import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserWithOrgAndBusiness } from "@/lib/auth/clerk-utils";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { sendCouponEmail } from "@/lib/sendEmail";


const leadSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  message: z.string().optional(),
  funnelId: z.string(),
  source: z.string().optional(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ businessId: string }> }
) {
  try {
    const { businessId } = await params;
    
    // No user auth check needed for public lead capture

    // Fetch the business directly since auth wrapper is removed
    const business = await prisma.business.findUnique({
      where: { id: businessId },
      select: { id: true, name: true, email: true } // Select only needed fields
    });

    if (!business) {
      // If the business doesn't exist, return 404
      return NextResponse.json({ error: "Business not found" }, { status: 404 });
    }

    const body = await req.json();
    if (!body) {
      return NextResponse.json(
        { error: "Request body is required" },
        { status: 400 }
      );
    }

    // Removed withBusinessAuth wrapper
    // --- Start of lead processing logic --- 
    const validatedData = leadSchema.parse(body);

    const customer = await prisma.customer.upsert({
      where: {
        email_businessId: {
          email: validatedData.email,
          businessId: business.id,
        },
      },
      update: {
        isLead: true,
      },
      create: {
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone || '',
        businessId: business.id,
        isLead: true,
      },
    });

    let couponCode: string | null = null;

    // Fetch the Sales Funnel to get the couponId
    const salesFunnel = await prisma.salesFunnel.findUnique({
      where: {
        id: validatedData.funnelId,
        businessId: business.id,
      },
    });

    if (!salesFunnel) {
      console.warn(`Sales funnel ${validatedData.funnelId} not found for business ${business.id}`);
    } else if (salesFunnel.couponId) {
      // Fetch the active coupon separately
      const coupon = await prisma.coupon.findUnique({
        where: {
          id: salesFunnel.couponId,
          businessId: business.id,
          isActive: true,
        }
      });

      if (coupon) {
        couponCode = coupon.code;
      } else {
         console.warn(`Active coupon with ID ${salesFunnel.couponId} not found for business ${business.id}`);
      }
    }

    // Send the coupon email only if we have a code
    if (couponCode) {
      try {
        await sendCouponEmail({
          to: customer.email,
          subject: `Your Discount Code from ${business.name}`,
          couponCode: couponCode,
          businessName: business.name || "Our Business", // Use fetched business name
          from: business.email || "onboarding@resend.dev",
        });
        console.log(`Coupon email sent successfully to ${customer.email}`);
      } catch (emailError) {
        console.error(`Failed to send coupon email to ${customer.email}:`, emailError);
      }
    }

    // Return customer data and the coupon code (if any)
    const responseData = { customer, couponCode }; 
    // --- End of lead processing logic ---

    // Return the successful response
    return NextResponse.json(responseData, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error processing lead:", error);
    return NextResponse.json(
      { error: "Failed to process lead submission" },
      { status: 500 }
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ businessId: string }> }
) {
  try {
    const { businessId } = await params;
    const user = await getCurrentUserWithOrgAndBusiness();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check that the user has access to this business
    const userBusinessId = user.membership?.organization?.business?.id;
    if (!userBusinessId || userBusinessId !== businessId) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const customers = await prisma.customer.findMany({
      where: { businessId, isLead: true },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      }
    });

    return NextResponse.json(customers);
  } catch (error) {
    console.error("Error fetching leads:", error);
    return NextResponse.json(
      { error: "Failed to fetch leads" },
      { status: 500 }
    );
  }
}
