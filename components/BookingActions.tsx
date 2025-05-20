"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge'; // For displaying status/timer
import { Clock } from 'lucide-react';
import { BookingStatus } from '@/prisma/generated/prisma'; // Adjust path as needed

// Define your Booking type as it comes from the API
export interface BookingSummary { // Or your full Booking type
  id: string;
  status: BookingStatus;
  expiresAt?: string | Date | null; // Can be string (ISO) or Date object
  // ... other essential booking properties needed for display or navigation
}

interface BookingActionsProps {
  booking: BookingSummary;
}

const BookingActions: React.FC<BookingActionsProps> = ({ booking }) => {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isActionable, setIsActionable] = useState<boolean>(false);
  const [isActuallyExpired, setIsActuallyExpired] = useState<boolean>(false);

  const calculateTimeLeft = useCallback(() => {
    if (!booking.expiresAt) {
      setTimeLeft('');
      setIsActionable(false);
      setIsActuallyExpired(false); 
      return false; 
    }

    const expirationTime = new Date(booking.expiresAt).getTime();
    const now = Date.now();
    const difference = expirationTime - now;

    if (difference <= 0) {
      setTimeLeft('Expired');
      setIsActionable(false);
      setIsActuallyExpired(true);
      return false; 
    }
    
    setIsActuallyExpired(false);
    const minutes = Math.floor((difference / (1000 * 60)) % 60);
    const seconds = Math.floor((difference / 1000) % 60);
    setTimeLeft(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    return true; 
  }, [booking.expiresAt]);

  useEffect(() => {
    const editableStatuses = [BookingStatus.HOLD, BookingStatus.PENDING] as const;
    if (!editableStatuses.includes(booking.status as typeof editableStatuses[number]) || !booking.expiresAt) {
      setIsActionable(false);
      setTimeLeft(''); 
      if (booking.status === BookingStatus.EXPIRED) {
          setIsActuallyExpired(true);
          setTimeLeft('Expired');
      }
      return;
    }

    const canBeActionableByTimer = calculateTimeLeft();
    setIsActionable(canBeActionableByTimer);

    if (canBeActionableByTimer) {
        const timerId = setInterval(() => {
            const stillActionable = calculateTimeLeft();
            setIsActionable(stillActionable);
            if (!stillActionable) clearInterval(timerId); 
        }, 1000);
        return () => clearInterval(timerId);
    }

  }, [booking.status, booking.expiresAt, calculateTimeLeft]);

  const handleEditResume = () => {
    router.push(`/dashboard/bookings/${booking.id}/edit`); 
  };

  const showButton = isActionable && (booking.status === BookingStatus.HOLD || booking.status === BookingStatus.PENDING);
  const showTimer = timeLeft && (booking.status === BookingStatus.HOLD || booking.status === BookingStatus.PENDING) && !isActuallyExpired;

  return (
    <div className="flex items-center space-x-2">
      {showButton && (
        <Button onClick={handleEditResume} variant="outline" size="sm">
          Resume / Edit
        </Button>
      )}
      {showTimer && (
        <Badge variant="outline" className="flex items-center">
          <Clock className="mr-1 h-3 w-3" />
          {timeLeft}
        </Badge>
      )}
      {isActuallyExpired && (booking.status === BookingStatus.HOLD || booking.status === BookingStatus.PENDING || booking.status === BookingStatus.EXPIRED) && (
         <Badge variant="destructive">Expired</Badge>
      )}
    </div>
  );
};

export default BookingActions; 