// app/api/businesses/[businessId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ businessId: string }> }
) {
  try {
    const businessId = (await params).businessId;
    const { userId } = await auth();
    console.log("Fetching business data for businessId:", businessId, "userId:", userId);

    // If userId is null, treat as a public request
    if (!userId) {
      console.log("Public request detected");
      const business = await prisma.business.findUnique({
        where: { id: businessId },
        select: {
          id: true,
          name: true,
          stripeAccountId: true,
          inventory: true,
        },
      });

      if (!business) {
        return NextResponse.json(
          { error: "Business not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(business);
    }

    // Authenticated request logic
    const business = await prisma.business.findFirst({
      where: {
        id: businessId,
        user: {
          clerkUserId: userId,
        },
      },
      include: {
        inventory: true,
        customers: true,
        bookings: {
          where: {
            eventDate: {
              gte: new Date(),
            },
          },
          take: 5,
          orderBy: {
            eventDate: 'asc',
          },
        },
      },
    });

    if (!business) {
      return NextResponse.json(
        { error: "Business not found" },
        { status: 404 }
      );
    }

    // Log details about the business data, especially Stripe info
    console.log("Business found with ID:", business.id);
    console.log("Business data fields:", Object.keys(business));
    
    // The field in the database is stripeAccountId, but the frontend expects stripeConnectedAccountId
    console.log("stripeAccountId in database:", business.stripeAccountId);
    
    // Modify the response to ensure the correct field is present
    const responseData = {
      ...business,
      // Map stripeAccountId to stripeConnectedAccountId for frontend compatibility
      stripeConnectedAccountId: business.stripeAccountId
    };

    console.log("Returning business data with stripeConnectedAccountId:", 
                responseData.stripeConnectedAccountId ? "present" : "missing");
    
    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error fetching business:", error);
    return NextResponse.json(
      { error: "Failed to fetch business" },
      { status: 500 }
    );
  }
}
