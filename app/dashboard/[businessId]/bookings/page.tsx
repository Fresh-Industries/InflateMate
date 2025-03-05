import { Suspense } from "react";
import BookingsList from "./_components/bookings-list";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import LoadingBookings from "./loading";
import { BookingsHeader } from "./_components/bookings-header";
import { Booking as PrismaBooking, Inventory, BookingStatus } from "@prisma/client";

export const dynamic = 'force-dynamic';

// Define types matching what the BookingsList component expects
interface BounceHouse {
  id: string;
  name: string;
  price: number;
  status: string;
}

interface Booking {
  id: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  totalAmount: number;
  subtotalAmount?: number;
  taxAmount?: number;
  taxRate?: number;
  bounceHouseId: string;
  bounceHouse: BounceHouse;
  eventType: string;
  participantCount: number;
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  eventAddress: string;
  eventCity: string;
  eventState: string;
  eventZipCode: string;
  specialInstructions?: string;
}

async function getInitialData(businessId: string) {
  const { userId } = await auth();
  if (!userId) {
    redirect('/sign-in');
  }

  const [bounceHouses, rawBookings] = await Promise.all([
    prisma.inventory.findMany({
      where: {
        businessId,
        status: "AVAILABLE",
      },
      select: {
        id: true,
        name: true,
        price: true,
        status: true,
      },
      cacheStrategy: { ttl: 240 },
    }),
    prisma.booking.findMany({
      where: {
        businessId,
        eventDate: {
          gte: new Date(),
        },
      },
      include: {
        inventoryItems: {
          include: {
            inventory: true
          }
        },
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: {
        eventDate: 'asc',
      },
    }),
  ]);

  // Transform bookings to expected format
  const bookings: Booking[] = rawBookings.map(booking => {
    // Use the first inventory item for each booking
    const firstItem = booking.inventoryItems[0] || null;
    
    // Create a bounceHouse object from the first item's inventory
    const bounceHouse: BounceHouse = firstItem?.inventory ? {
      id: firstItem.inventory.id,
      name: firstItem.inventory.name,
      price: firstItem.inventory.price,
      status: firstItem.inventory.status,
    } : {
      id: '', // Fallback empty values
      name: 'Unknown',
      price: 0,
      status: 'UNKNOWN',
    };

    return {
      id: booking.id,
      eventDate: booking.eventDate.toISOString(),
      startTime: booking.startTime.toISOString(),
      endTime: booking.endTime.toISOString(),
      status: booking.status,
      totalAmount: booking.totalAmount,
      subtotalAmount: booking.subtotalAmount || 0,
      taxAmount: booking.taxAmount || 0,
      taxRate: booking.taxRate || 0,
      bounceHouseId: firstItem?.inventoryId || '',
      bounceHouse,
      eventType: booking.eventType || 'Not specified',
      participantCount: booking.participantCount,
      customer: booking.customer,
      eventAddress: booking.eventAddress,
      eventCity: booking.eventCity,
      eventState: booking.eventState,
      eventZipCode: booking.eventZipCode,
      specialInstructions: booking.specialInstructions || undefined
    };
  });

  return {
    bounceHouses: bounceHouses as BounceHouse[],
    bookings,
  };
}

interface PageProps {
  params: { businessId: string };
}

export default async function BookingsPage({ params }: PageProps) {
  const { businessId } = await params;
  const initialData = await getInitialData(businessId);

  return (
    <div className="space-y-8">
      <BookingsHeader businessId={businessId} />
      <Suspense fallback={<LoadingBookings />}>
        <BookingsList businessId={businessId} initialData={initialData} />
      </Suspense>
    </div>
  );
}