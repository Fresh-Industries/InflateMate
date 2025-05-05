import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserWithOrgAndBusiness } from "@/lib/auth/clerk-utils";  
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const customerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number is required"),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  notes: z.string().optional(),
  type: z.enum(["Regular", "VIP"]).default("Regular"),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ businessId: string }> }
) {
  try {
    const businessId = (await params).businessId;
    const user = await getCurrentUserWithOrgAndBusiness();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check that the user has access to this business
    const userBusinessId = user.membership?.organization?.business?.id;
    if (!userBusinessId || userBusinessId !== businessId) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const body = await req.json();
    if (!body) {
      return NextResponse.json({ error: "Request body is required" }, { status: 400 });
    }

    const validatedData = customerSchema.parse(body);

    const customer = await prisma.customer.create({
      data: {
        ...validatedData,
        businessId: businessId,
      },
    });

    return NextResponse.json(customer, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error creating customer:", error);
    return NextResponse.json(
      { error: "Failed to create customer" },
      { status: 500 }
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ businessId: string }> }
) {
  try {
    const businessId = (await params).businessId;
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
      where: { businessId },
      include: {
        bookings: {
          orderBy: { eventDate: 'desc' },
          take: 1,
        },
      },
    });

    // Transform the data to include computed fields
    const transformed = await Promise.all(customers.map(async customer => {
      // Set customer as VIP if they have more than one booking
      const isVip = customer.bookingCount > 1;

      // Check if customer is inactive (no bookings in over a year)
      const lastBookingDate = customer.bookings[0]?.eventDate;
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

      const isInactive = !lastBookingDate || new Date(lastBookingDate) < oneYearAgo;

      // If customer should be VIP but isn't, update them
      if (isVip && customer.type !== "VIP") {
        prisma.customer.update({
          where: { id: customer.id },
          data: { type: "VIP" },
        }).catch(err => console.error("Error updating customer to VIP:", err));
      }

      // If customer should be inactive but isn't, update them
      if (isInactive && customer.status !== "Inactive") {
        prisma.customer.update({
          where: { id: customer.id },
          data: { status: "Inactive" },
        }).catch(err => console.error("Error updating customer to Inactive:", err));
      }

      return {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        city: customer.city,
        state: customer.state,
        zipCode: customer.zipCode,
        notes: customer.notes,
        status: isInactive ? "Inactive" : customer.status,
        type: isVip ? "VIP" : (customer.type as "Regular" | "VIP"),
        bookingCount: customer.bookingCount,
        totalSpent: customer.totalSpent,
        lastBooking: customer.bookings[0]?.eventDate || null,
      };
    }));

    return NextResponse.json(transformed);
  } catch (error) {
    console.error("Error fetching customers:", error);
    return NextResponse.json(
      { error: "Failed to fetch customers" },
      { status: 500 }
    );
  }
}
