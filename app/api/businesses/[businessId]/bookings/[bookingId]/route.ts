import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserWithOrgAndBusiness } from "@/lib/auth/clerk-utils";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ businessId: string; bookingId: string }> }
) {
  try {
    const user = await getCurrentUserWithOrgAndBusiness();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { businessId, bookingId } = await params;

    // Check that the user has access to this business
    const userBusinessId = user.membership?.organization?.business?.id;
    if (!userBusinessId || userBusinessId !== businessId) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const booking = await prisma.booking.findFirst({
      where: { id: bookingId, businessId },
      include: {
        inventoryItems: { include: { inventory: true } },
        customer: true,
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const responseData: any = { ...booking };
    if (booking.inventoryItems && booking.inventoryItems.length > 0) {
      responseData.bounceHouseId = booking.inventoryItems[0].inventoryId;
      responseData.bounceHouse = {
        id: booking.inventoryItems[0].inventoryId,
        name: booking.inventoryItems[0].inventory.name
      };
    }

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error in GET booking route:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}
