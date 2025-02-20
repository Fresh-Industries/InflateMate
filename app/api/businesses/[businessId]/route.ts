// app/api/businesses/[businessId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/utils";

export async function GET(
  req: NextRequest,
  { params }: { params: { businessId: string } }
) {
  try {
    // Await the params first
    const { businessId } = await params;
    
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const business = await prisma.business.findFirst({
      where: {
        id: businessId, 
        userId: user.id,
      },
      include: {
        bounceHouses: true,
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

    return NextResponse.json(business);
  } catch (error) {
    console.error("Error fetching business:", error);
    return NextResponse.json(
      { error: "Failed to fetch business" },
      { status: 500 }
    );
  }
}
