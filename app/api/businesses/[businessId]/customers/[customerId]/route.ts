import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, withBusinessAuth } from "@/lib/auth/clerk-utils";
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
  { params }: { params: Promise<{ businessId: string, customerId: string }>}
) {
  try {
    const { businessId, customerId } = await params;
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await withBusinessAuth(
      businessId,
      user.id,
      async (business) => {
        const body = await req.json();
        const validatedData = updateCustomerSchema.parse(body);

        const customer = await prisma.customer.update({
          where: {
            id: customerId,
            businessId: business.id,
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

        return {
          ...customer,
          type: customer.type as "Regular" | "VIP",
          lastBooking: customer.bookings[0]?.eventDate || null,
        };
      }
    );

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 403 });
    }

    return NextResponse.json(result.data);
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
  { params }: { params: Promise<{ businessId: string, customerId: string }>}
) {
  try {
    const { businessId, customerId } = await params;
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await withBusinessAuth(
      businessId,
      user.id,
      async (business) => {
        // Check if customer has any upcoming bookings
        const upcomingBookings = await prisma.booking.findFirst({
          where: {
            customerId,
            businessId: business.id,
            eventDate: {
              gte: new Date(),
            },
            status: {
              notIn: ["CANCELLED", "COMPLETED", "NO_SHOW"],
            },
          },
        });

        // If customer has upcoming bookings, prevent deletion
        if (upcomingBookings) {
          return { message: "Cannot delete customer with upcoming bookings", success: false };
        }

        // Check if customer has any past bookings
        const pastBookings = await prisma.booking.findFirst({
          where: {
            customerId,
            businessId: business.id,
          },
        });

        // If customer has past bookings, set status to inactive instead of deleting
        if (pastBookings) {
          await prisma.customer.update({
            where: {
              id: customerId,
              businessId: business.id,
            },
            data: {
              status: "Inactive",
            },
          });
          return { message: "Customer marked as inactive", success: true };
        }

        // If no bookings, proceed with deletion
        await prisma.customer.delete({
          where: {
            id: customerId,
            businessId: business.id,
          },
        });

        return { message: "Customer deleted successfully", success: true };
      }
    );

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 403 });
    }

    if (result.data && !result.data.success) {
      return NextResponse.json({ error: result.data.message }, { status: 400 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error("Error deleting customer:", error);
    return NextResponse.json(
      { error: "Failed to delete customer" },
      { status: 500 }
    );
  }
} 