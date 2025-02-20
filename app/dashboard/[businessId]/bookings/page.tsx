import { Suspense } from "react";
import BookingsList from "./components/bookings-list";
import { getCurrentUser } from "@/lib/auth/utils";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import LoadingBookings from "./loading";
import { BookingsHeader } from "./components/bookings-header";

export const dynamic = 'force-dynamic';

async function getInitialData(businessId: string) {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/auth');
  }

  const [bounceHouses, bookings] = await Promise.all([
    prisma.bounceHouse.findMany({
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
        bounceHouse: {
          select: {
            id: true,
            name: true,
          },
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

  return {
    bounceHouses,
    bookings: bookings.map(booking => ({
      id: booking.id,
      eventDate: booking.eventDate.toISOString(),
      startTime: booking.startTime.toISOString(),
      endTime: booking.endTime.toISOString(),
      status: booking.status,
      totalAmount: booking.totalAmount,
      bounceHouseId: booking.bounceHouseId,
      eventType: booking.eventType || 'Not specified',
      participantCount: booking.participantCount,
      customer: booking.customer,
      bounceHouse: booking.bounceHouse,
      eventAddress: booking.eventAddress,
      eventCity: booking.eventCity,
      eventState: booking.eventState,
      eventZipCode: booking.eventZipCode,
      specialInstructions: booking.specialInstructions || undefined
    })),
  };
}

interface PageProps {
  params: { businessId: string };
}

export default async function BookingsPage({ params }: PageProps) {
  const { businessId } = params;
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