import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe-server";
import { z } from "zod";
import Stripe from "stripe";
import { addDomainToVercel } from "@/lib/vercel";
import { createCnameInCloudflare } from "@/lib/cloudflare";
import { clerkClient } from "@clerk/nextjs/server";

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function generateUniqueSubdomain(baseSlug: string): Promise<string> {
  let slug = baseSlug;
  let counter = 1;
  const maxAttempts = 10;

  while (counter <= maxAttempts) {
    const existingBusiness = await prisma.business.findFirst({
      where: { subdomain: slug },
      select: { id: true },
    });

    if (!existingBusiness) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return `${baseSlug}-${Math.random().toString(36).substring(2, 7)}`;
}

const businessSchema = z.object({
  businessName: z.string().min(2, "Business name must be at least 2 characters"),
  businessAddress: z.string().min(5, "Address is required"),
  businessCity: z.string().min(2, "City is required"),
  businessState: z.string().length(2, "Please use 2-letter state code"),
  businessZip: z.string().regex(/^\d{5}(-\d{4})?$/, "Invalid ZIP code"),
  businessPhone: z.string().regex(/^\+?1?\d{9,15}$/, "Invalid phone number"),
});

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    console.log(userId);
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    });

    console.log(user);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const body = await req.json();
    const validatedData = businessSchema.parse(body);

    if (!user.email) {
      return NextResponse.json({ message: "User email is required" }, { status: 400 });
    }

    let account: Stripe.Account | undefined;
    try {
      account = await stripe.accounts.create({
        type: 'custom',
        country: "US",
        email: user.email,
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
        business_profile: {
          name: validatedData.businessName,
          support_phone: validatedData.businessPhone,
          support_address: {
            line1: validatedData.businessAddress,
            city: validatedData.businessCity,
            state: validatedData.businessState,
            postal_code: validatedData.businessZip,
            country: "US",
          },
          product_description: "Managed via InflateMate",
        },
      });
    } catch (stripeError) {
      if (stripeError instanceof Stripe.errors.StripeError) {
        console.error("[STRIPE_ACCOUNT_CREATE_ERROR]", {
          message: stripeError.message,
          code: stripeError.code,
          type: stripeError.type,
        });
        return NextResponse.json(
          { 
            message: "Failed to set up payment processing.",
            details: stripeError.message,
          },
          { status: 400 }
        );
      }
      throw stripeError; 
    }
    
    const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN;
    if (!rootDomain) {
      console.error("NEXT_PUBLIC_ROOT_DOMAIN is not set. Cannot create subdomain.");
      return NextResponse.json({ message: "Server configuration error: Root domain not set." }, { status: 500 });
    }

    let onboardingErrorMessage: string | null = null;
    let finalSubdomain = "";

    try {
      const baseSlug = generateSlug(validatedData.businessName);
      finalSubdomain = await generateUniqueSubdomain(baseSlug);
      const fullDomain = `${finalSubdomain}.${rootDomain}`;

      try {
        console.log(`Adding domain to Vercel: ${fullDomain}`);
        await addDomainToVercel(fullDomain);
        console.log(`Successfully added domain to Vercel: ${fullDomain}`);
      } catch (vercelError) {
        console.error(`Failed to add domain ${fullDomain} to Vercel:`, vercelError);
        onboardingErrorMessage = `Failed to configure subdomain on Vercel: ${(vercelError as Error).message}`;
      }

      try {
        console.log(`Adding CNAME to Cloudflare for: ${finalSubdomain}`);
        await createCnameInCloudflare(finalSubdomain);
        console.log(`Successfully added CNAME to Cloudflare for: ${finalSubdomain}`);
      } catch (cloudflareError) {
        console.error(`Failed to add CNAME record ${finalSubdomain} to Cloudflare:`, cloudflareError);
        if (!onboardingErrorMessage) {
          onboardingErrorMessage = `Failed to configure subdomain DNS: ${(cloudflareError as Error).message}`;
        }
      }

    } catch (subdomainSetupError) {
      console.error("Error during subdomain setup process:", subdomainSetupError);
      onboardingErrorMessage = `Failed during internal subdomain setup: ${(subdomainSetupError as Error).message}`;
      finalSubdomain = `error-${generateSlug(validatedData.businessName)}`; 
    }

    const business = await prisma.business.create({
      data: {
        name: validatedData.businessName,
        address: validatedData.businessAddress,
        city: validatedData.businessCity,
        state: validatedData.businessState,
        zipCode: validatedData.businessZip,
        phone: validatedData.businessPhone.replace(/\D/g, ""),
        email: user.email,
        userId: user.id,
        stripeAccountId: account.id,
        subdomain: finalSubdomain,
        onboardingError: onboardingErrorMessage,
        minAdvanceBooking: 24,
        maxAdvanceBooking: 90,
        minimumPurchase: 100,
      },
    });

    const org = (await clerkClient()).organizations.createOrganization({
      name: validatedData.businessName,
    })

    const membership = await (await clerkClient()).organizations.createOrganizationMembership({
      organizationId: (await org).id,
      userId: user.id,
      role: "admin",
    })
    

    await prisma.organization.create({
      data: {
        clerkOrgId: (await org).id,
        name: validatedData.businessName,
        businessId: business.id,
      },
    });

    await prisma.membership.create({
      data: {
        organizationId: (await org).id,
        userId: user.id,
        role: "ADMIN",
        membershipId: membership.id,
      },
    });
    
    

    await prisma.user.update({
      where: { id: user.id },
      data: { onboarded: true },
    });

    return NextResponse.json({
      business,
      stripeAccountId: account.id,
      subdomain: finalSubdomain,
    }, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error("[BUSINESS_CREATE_ERROR]", error);
    return NextResponse.json(
      { message: "Something went wrong during onboarding." },
      { status: 500 }
    );
  }
}
