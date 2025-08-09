import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserWithOrgAndBusiness, getPrimaryMembership } from "@/lib/auth/clerk-utils";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const businessSchema = z.object({
  name: z.string().min(2, "Business name must be at least 2 characters"),
  description: z.string().optional(),
  taxId: z.string().optional(),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().length(2, "Please use 2-letter state code"),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, "Invalid ZIP code"),
  phone: z.string().regex(/^\+?1?\d{9,15}$/, "Invalid phone number"),
  email: z.string().email("Invalid email address"),
  website: z.string().url().optional(),
});

export async function POST(req: NextRequest) {
  try {
    // Get the current user (with org and business)
    const user = await getCurrentUserWithOrgAndBusiness();
    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get the user's organization via membership
    const membership = getPrimaryMembership(user);
    const org = membership?.organization;
    if (!org) {
      return NextResponse.json(
        { message: "User is not a member of any organization" },
        { status: 400 }
      );
    }

    // Check if this org already has a business
    if (org.business) {
      return NextResponse.json(
        { message: "This organization already has a business" },
        { status: 400 }
      );
    }

    // Parse and validate the request body
    const body = await req.json();
    const validatedData = businessSchema.parse(body);

    // Create the business for the organization
    const business = await prisma.business.create({
      data: {
        ...validatedData,
        organization: {
          connect: { id: org.id }
        },
        minNoticeHours: 24,
        maxNoticeHours: 2160,
        siteConfig: {},
      },
    });

    return NextResponse.json(business, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error("[BUSINESS_CREATE_ERROR]", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const user = await getCurrentUserWithOrgAndBusiness();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const membership = getPrimaryMembership(user);
    const org = membership?.organization;
    if (!org) {
      return NextResponse.json(
        { error: "User is not a member of any organization" },
        { status: 400 }
      );
    }

    // Get the business for this org (should be at most one)
    const business = await prisma.business.findUnique({
      where: { organizationId: org.id },
      include: {
        organization: true,
        inventory: true,
        bookings: {
          where: {
            startTime: {
              gte: new Date(),
            },
          },
          take: 5,
          orderBy: {
            startTime: 'asc',
          },
        },
      },
    });

    if (!business) {
      return NextResponse.json(
        { error: "No business found for this organization" },
        { status: 404 }
      );
    }

    return NextResponse.json(business);
  } catch (error) {
    console.error("Error fetching business:", error);
    return NextResponse.json(
      { error: "Failed to fetch business" },
      { status: 500 }
    );
  }
}

