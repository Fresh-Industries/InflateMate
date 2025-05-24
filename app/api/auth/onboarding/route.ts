import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserWithOrgAndBusiness, getPrimaryMembership } from "@/lib/auth/clerk-utils";
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
  businessEmail: z.string().email("Invalid email address"),
});

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUserWithOrgAndBusiness();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!user.clerkUserId) {
      console.error("User found in DB but missing clerkUserId:", user.id);
      return NextResponse.json({ message: "User identifier mismatch" }, { status: 500 });
    }

    // Check if user already has a business
    const membership = getPrimaryMembership(user);
    if (membership?.organization?.business) {
      return NextResponse.json({
        message: "You already have a business",
        businessId: membership.organization.business.id
      }, { status: 400 });
    }

    const body = await req.json();
    const validatedData = businessSchema.parse(body);

    if (!user.email) {
      return NextResponse.json({ message: "User email is required" }, { status: 400 });
    }

    // Start a transaction for all database operations
    return await prisma.$transaction(async (tx) => {
      // 1. Create Stripe Account
      let account: Stripe.Account;
      try {
        account = await stripe.accounts.create({
          type: 'custom',
          country: "US",
          email: user.email || undefined,
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
          throw new Error(`Failed to set up payment processing: ${stripeError.message}`);
        }
        throw stripeError;
      }

      // 2. Create Clerk Organization
      const clerk = await clerkClient();
      const clerkOrg = await clerk.organizations.createOrganization({
        name: validatedData.businessName,
        createdBy: user.clerkUserId as string,
      });

      // 3. Create Local Organization
      const localOrg = await tx.organization.create({
        data: {
          clerkOrgId: clerkOrg.id,
          name: validatedData.businessName,
        },
      });
      await tx.membership.create({
        data: {
          organizationId: localOrg.id,
          userId: user.id,
          role: "ADMIN",
          clerkMembershipId: (await clerkOrg).createdBy || "",
      },
    });


      // 5. Setup Domain
      const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN;
      if (!rootDomain) {
        throw new Error("Server configuration error: Root domain not set");
      }

      let onboardingErrorMessage: string | null = null;
      let finalSubdomain = "";

      try {
        const baseSlug = generateSlug(validatedData.businessName);
        finalSubdomain = await generateUniqueSubdomain(baseSlug);
        const fullDomain = `${finalSubdomain}.${rootDomain}`;

        const isProduction = process.env.NODE_ENV === 'production';
        const isValidDomain = !rootDomain.includes('localhost') && !rootDomain.includes('127.0.0.1');

        if (isProduction && isValidDomain) {
          try {
            await addDomainToVercel(fullDomain);
          } catch (vercelError) {
            onboardingErrorMessage = `Failed to configure subdomain on Vercel: ${(vercelError as Error).message}`;
          }

          try {
            await createCnameInCloudflare(finalSubdomain);
          } catch (cloudflareError) {
            if (!onboardingErrorMessage) {
              onboardingErrorMessage = `Failed to configure subdomain DNS: ${(cloudflareError as Error).message}`;
            }
          }
        }
      } catch (subdomainSetupError) {
        onboardingErrorMessage = `Failed during internal subdomain setup: ${(subdomainSetupError as Error).message}`;
        finalSubdomain = `error-${generateSlug(validatedData.businessName)}`;
      }

      // 6. Create Business
      const business = await tx.business.create({
        data: {
          name: validatedData.businessName,
          address: validatedData.businessAddress,
          city: validatedData.businessCity,
          state: validatedData.businessState,
          zipCode: validatedData.businessZip,
          phone: validatedData.businessPhone.replace(/\D/g, ""),
          email: validatedData.businessEmail,
          onboarded: true,
          stripeAccountId: account.id,
          subdomain: finalSubdomain,
          onboardingError: onboardingErrorMessage,
          minAdvanceBooking: 24,
          maxAdvanceBooking: 90,
          minimumPurchase: 100,
          siteConfig: {},
          organization: {
            connect: {
              id: localOrg.id,
            },
          },
        },
      });

      return NextResponse.json({
        orgId: clerkOrg.id,
        business,
        stripeAccountId: account.id,
        subdomain: finalSubdomain,
      }, { status: 201 });

    }, {
      maxWait: 10000, // 10s max wait
      timeout: 15000, // 15s timeout
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error("[BUSINESS_CREATE_ERROR]", error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Something went wrong during onboarding." },
      { status: 500 }
    );
  }
}
