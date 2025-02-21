import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/utils";
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
    // Get the current user
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if user has any businesses
    const userWithBusinesses = await prisma.user.findUnique({
      where: { id: user.id },
      include: { businesses: true }
    });

    // Parse and validate the request body
    const body = await req.json();
    const validatedData = businessSchema.parse(body);

    // Create the business
    const business = await prisma.business.create({
      data: {
        ...validatedData,
        userId: user.id,
        // Set default business settings
        depositRequired: true,
        depositPercentage: 25.0,
        minAdvanceBooking: 24,
        maxAdvanceBooking: 90,
        bufferTime: 60,
      },
    });

    // Update user's onboarded status if this is their first business
    if (!userWithBusinesses?.businesses.length) {
      await prisma.user.update({
        where: { id: user.id },
        data: { onboarded: true },
      });
    }

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
    const user = await getCurrentUser();
    console.log(user);
    
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const businesses = await prisma.business.findMany({
      where: { userId: user.id },
      include: {
        bounceHouses: true,
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

    return NextResponse.json(businesses);
  } catch (error) {
    console.error("Error fetching businesses:", error);
    return NextResponse.json(
      { error: "Failed to fetch businesses" },
      { status: 500 }
    );
  }
} 