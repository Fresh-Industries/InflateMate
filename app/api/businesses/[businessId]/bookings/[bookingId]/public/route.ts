import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET endpoint to fetch public-safe booking details
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ businessId: string; bookingId: string }> }
) {
  try {
    const { businessId, bookingId } = await params;

    // Find the booking with limited details
    const booking = await prisma.booking.findFirst({
      where: { 
        id: bookingId, 
        businessId,
        // Only show completed or confirmed bookings
        OR: [
          { status: "COMPLETED" },
          { status: "CONFIRMED" },
          { status: "PENDING" }
        ]
      },
      include: {
        business: {
          select: {
            name: true,
            email: true,
            phone: true,
            address: true,
            city: true,
            state: true,
            zipCode: true,
          }
        },
        inventoryItems: { 
          include: { 
            inventory: {
              select: {
                id: true,
                name: true,
                description: true,
                primaryImage: true,
              }
            } 
          } 
        },
        customer: {
          select: {
            name: true,
            email: true,
          }
        },
        waivers: {
          select: {
            status: true,
          }
        },
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Format the data for the success page
    const bookingDetails = {
      id: booking.id,
      status: booking.status,
      eventDate: booking.eventDate,
      startTime: booking.startTime,
      endTime: booking.endTime,
      eventAddress: booking.eventAddress,
      eventCity: booking.eventCity,
      eventState: booking.eventState,
      eventZipCode: booking.eventZipCode,
      totalAmount: booking.totalAmount,
      subtotalAmount: booking.subtotalAmount,
      taxAmount: booking.taxAmount,
      specialInstructions: booking.specialInstructions,
      customer: booking.customer ? {
        name: booking.customer.name,
        email: booking.customer.email,
      } : null,
      items: booking.inventoryItems.map(item => ({
        id: item.id,
        name: item.inventory.name,
        description: item.inventory.description,
        image: item.inventory.primaryImage,
        quantity: item.quantity,
        price: item.price,
      })),
      business: booking.business ? {
        name: booking.business.name,
        email: booking.business.email,
        phone: booking.business.phone,
        address: booking.business.address,
        city: booking.business.city,
        state: booking.business.state,
        zipCode: booking.business.zipCode,
      } : null,
      hasSignedWaiver: booking.waivers?.some(w => w.status === 'SIGNED') ?? false,
    };

    return NextResponse.json(bookingDetails);
  } catch (error) {
    console.error("Error fetching public booking details:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 