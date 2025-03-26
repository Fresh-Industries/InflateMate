import { Suspense } from "react";
import BookingsList from "./_components/bookings-list";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import LoadingBookings from "./loading";
import { BookingsHeader } from "./_components/bookings-header";

export const dynamic = 'force-dynamic';

// Define types matching what the BookingsList component expects
interface BounceHouse {
  id: string;
  name: string;
  price: number;
  status: string;
}

// We'll use the API's response type directly

async function getInitialData(businessId: string) {
  const { userId } = await auth();
  if (!userId) {
    redirect('/sign-in');
  }

  // Fetch bounceHouses from direct DB query (more efficient for this simple query)
  const bounceHouses = await prisma.inventory.findMany({
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
  });

  // Add origin for server-side requests
  const origin = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const response = await fetch(`${origin}/api/businesses/${businessId}/bookings`, {
    cache: 'no-store',
    next: { tags: ['bookings'] }
  });
  
  if (!response.ok) {
    console.error("Failed to fetch bookings:", await response.text());
    return { bounceHouses, bookings: [] };
  }
  
  const bookings = await response.json();
  return {
    bounceHouses: bounceHouses as BounceHouse[],
    bookings,
  };
}

export default async function BookingsPage({ params }: { params: Promise<{ businessId: string }> }) {
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