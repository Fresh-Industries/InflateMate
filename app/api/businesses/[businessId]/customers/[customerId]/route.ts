import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserWithOrgAndBusiness, getMembershipByBusinessId } from "@/lib/auth/clerk-utils";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateCustomerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  email: z.string().email("Invalid email address").optional(),
  phone: z.string().min(10, "Phone number is required").optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  notes: z.string().optional(),
  type: z.enum(["Regular", "VIP"]).optional(),
  status: z.enum(["Active", "Inactive"]).optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ businessId: string, customerId: string }> }
) {
  try {
    const { businessId, customerId } = await params;
    const user = await getCurrentUserWithOrgAndBusiness();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check that the user has access to this business
    const membership = getMembershipByBusinessId(user, businessId);
    if (!membership) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const body = await req.json();
    const validatedData = updateCustomerSchema.parse(body);

    const customer = await prisma.customer.update({
      where: {
        id: customerId,
        businessId: businessId,
      },
      data: validatedData,
      include: {
        bookings: {
          orderBy: {
            eventDate: 'desc'
          },
          take: 1,
        },
      },
    });

    return NextResponse.json({
      ...customer,
      type: customer.type as "Regular" | "VIP",
      lastBooking: customer.bookings[0]?.eventDate || null,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error updating customer:", error);
    return NextResponse.json(
      { error: "Failed to update customer" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ businessId: string, customerId: string }> }
) {
  try {
    const { businessId, customerId } = await params;
    const user = await getCurrentUserWithOrgAndBusiness();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check that the user has access to this business
    const membership = getMembershipByBusinessId(user, businessId);
    if (!membership) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Check if customer has any upcoming bookings
    const upcomingBookings = await prisma.booking.findFirst({
      where: {
        customerId,
        businessId,
        eventDate: {
          gte: new Date(),
        },
        status: {
          notIn: ["CANCELLED", "COMPLETED", "PENDING", "HOLD", "EXPIRED"],
        },
      },
    });

    if (upcomingBookings) {
      return NextResponse.json(
        { error: "Cannot delete customer with upcoming bookings" },
        { status: 400 }
      );
    }

    // Check if customer has any past bookings
    const pastBookings = await prisma.booking.findFirst({
      where: {
        customerId,
        businessId,
      },
    });

    if (pastBookings) {
      await prisma.customer.update({
        where: {
          id: customerId,
          businessId,
        },
        data: {
          status: "Inactive",
        },
      });
      return NextResponse.json(
        { message: "Customer marked as inactive", success: true }
      );
    }

    // If no bookings, proceed with deletion
    await prisma.customer.delete({
      where: {
        id: customerId,
        businessId,
      },
    });

    return NextResponse.json(
      { message: "Customer deleted successfully", success: true }
    );
  } catch (error) {
    console.error("Error deleting customer:", error);
    return NextResponse.json(
      { error: "Failed to delete customer" },
      { status: 500 }
    );
  }
}