import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, withBusinessAuth } from "@/lib/auth/utils";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateCustomerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  email: z.string().email("Invalid email address").optional(),
  phone: z.string().min(10, "Phone number is required").optional(),
  type: z.enum(["Regular", "VIP"]).optional(),
  status: z.enum(["Active", "Inactive"]).optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: { businessId: string, customerId: string }}
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
  { params }: { params: { businessId: string, customerId: string }}
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
        // Check if customer has any bookings
        const customerBookings = await prisma.booking.findFirst({
          where: {
            customerId,
            businessId: business.id,
          },
        });

        // If customer has bookings, set status to inactive instead of deleting
        if (customerBookings) {
          await prisma.customer.update({
            where: {
              id: customerId,
              businessId: business.id,
            },
            data: {
              status: "Inactive",
            },
          });
          return { message: "Customer marked as inactive" };
        }

        // If no bookings, proceed with deletion
        await prisma.customer.delete({
          where: {
            id: customerId,
            businessId: business.id,
          },
        });

        return { message: "Customer deleted successfully" };
      }
    );

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 403 });
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