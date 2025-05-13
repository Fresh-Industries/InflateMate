'use client';

import { useEffect, useState } from 'react';
import { EventDetailsStep } from '@/components/BookingForm/edit/EditProducts';
import {
  NewBookingState,
  SelectedItem,
  BookingMetadata,
} from '@/types/booking'; // Import necessary types
import {
  fetchBookingDetails,
} from '@/services/bookingService'; // Import service to fetch booking data
import { useParams } from 'next/navigation'; // To get businessId and bookingId

const TimerDisplay = ({ expirationTime }: { expirationTime: Date | null }) => {
  const [timeLeft, setTimeLeft] = useState<string | null>(null);

  useEffect(() => {
    if (!expirationTime) {
      setTimeLeft(null);
      return;
    }

    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = expirationTime.getTime() - now.getTime();

      if (difference <= 0) {
        setTimeLeft('Expired');
      } else {
        const totalSeconds = Math.floor(difference / 1000);
        const days = Math.floor(totalSeconds / (60 * 60 * 24));
        const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
        const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
        const seconds = totalSeconds % 60;


        let timeLeftString = '';
        if (days > 0) timeLeftString += `${days}d `;
        if (hours > 0 || days > 0) timeLeftString += `${hours}h `; // Show hours if days > 0 or hours > 0
        if (minutes > 0 || hours > 0 || days > 0) timeLeftString += `${minutes}m `; // Show minutes if any larger unit > 0 or minutes > 0
        timeLeftString += `${seconds}s`; // Always show seconds


        setTimeLeft(timeLeftString.trim()); // Use trim to remove trailing space if no days/hours/minutes

      }
    };

    // Calculate initial time left
    calculateTimeLeft();

    // Update every second for precise countdown visually
    const timer = setInterval(calculateTimeLeft, 1000);


    // Cleanup interval on component unmount
    return () => clearInterval(timer);

  }, [expirationTime]);

   if (!expirationTime || timeLeft === null || timeLeft === 'Expired') {
        // Only return a message if it has expired, otherwise null
       return timeLeft === 'Expired' ? (
            <div className="p-2 text-center font-bold bg-red-200 text-red-800 rounded mb-4">
                This booking has expired.
            </div>
        ) : null;
   }


  return (
    <div className={`p-2 text-center font-bold bg-yellow-200 text-yellow-800 rounded mb-4`}>
      Time Left to Edit: {timeLeft}
    </div>
  );
};


export default function EditBookingPage() {
  const params = useParams();
  const businessId = params.businessId as string;
  const bookingId = params.bookingId as string;
  console.log("EditBookingPage", businessId, bookingId);

  // State for the booking data being edited
  const [bookingDetails, setBookingDetails] = useState<BookingMetadata | null>(
    null,
  );
  // State for the selected items (Map for easy lookup)
  const [selectedItems, setSelectedItems] = useState<Map<string, SelectedItem>>(
    new Map(),
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  // Fetch booking data on page load
  useEffect(() => {
    const loadBooking = async () => {
      try {
        setLoading(true);
        // TODO: Implement fetchBookingDetails service in bookingService.ts
        // This service should fetch the existing booking data including selected items
        // and the hold expiration time if applicable.
        const data: BookingMetadata = await fetchBookingDetails(bookingId, businessId); // Assuming this service exists
        setBookingDetails(data);
        console.log("bookingDetails", data);

        // Initialize selectedItems state from fetched data
        const initialSelectedItems = new Map<string, SelectedItem>();
        if (data.selectedItems) {
          data.selectedItems.forEach((itemDetail) => {
            // Need to construct the full InventoryItem object.
            // For now, using a partial object. You might need to fetch full details
            // or ensure the booking data includes full item info.
            initialSelectedItems.set(itemDetail.id, {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              item: itemDetail as any, // This cast might need refinement
              quantity: itemDetail.quantity,
            });
          });
        }
        setSelectedItems(initialSelectedItems);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.message || 'Failed to load booking details.');
        console.error('Error loading booking details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (bookingId) {
      loadBooking();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingId]); // Rerun effect if bookingId changes


  // Function to update selected items
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const selectInventoryItem = (item: any, quantity?: number) => {
    setSelectedItems(prevSelectedItems => {
      const newSelectedItems = new Map(prevSelectedItems);
      const currentItem = newSelectedItems.get(item.id);

      if (quantity === 0) {
        // Remove item if quantity is 0
        newSelectedItems.delete(item.id);
      } else if (currentItem) {
        // Update quantity if item exists
        newSelectedItems.set(item.id, { ...currentItem, quantity: quantity ?? currentItem.quantity + 1 });
      } else if (quantity && quantity > 0) {
        // Add new item with specified quantity
        newSelectedItems.set(item.id, { item, quantity });
      } else {
        // Add new item with quantity 1 if quantity not specified
        newSelectedItems.set(item.id, { item, quantity: 1 });
      }
      return newSelectedItems;
    });
  };

  // Function to update quantity of an existing selected item
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateQuantity = (item: any, delta: number) => {
      setSelectedItems(prevSelectedItems => {
          const newSelectedItems = new Map(prevSelectedItems);
          const currentItem = newSelectedItems.get(item.id);

          if (currentItem) {
              const newQuantity = currentItem.quantity + delta;
              if (newQuantity <= 0) {
                  newSelectedItems.delete(item.id); // Remove if quantity is zero or less
              } else {
                  newSelectedItems.set(item.id, { ...currentItem, quantity: newQuantity });
              }
          }
          return newSelectedItems;
      });
  };


  // Dummy NewBookingState for EventDetailsStep. You'll likely need to map
  // bookingDetails to this structure or adjust EventDetailsStep props.
  const dummyNewBooking: NewBookingState = {
      bounceHouseId: bookingDetails?.bounceHouseId || '', // Adjust if needed
      customerName: bookingDetails?.customerName || '',
      customerEmail: bookingDetails?.customerEmail || '',
      customerPhone: bookingDetails?.customerPhone || '',
      eventDate: bookingDetails?.eventDate || '',
      startTime: bookingDetails?.startTime || '',
      endTime: bookingDetails?.endTime || '',
      eventType: bookingDetails?.eventType || '',
      eventAddress: bookingDetails?.eventAddress || '',
      eventCity: bookingDetails?.eventCity || '',
      eventState: bookingDetails?.eventState || '',
      eventZipCode: bookingDetails?.eventZipCode || '',
      participantCount: bookingDetails?.participantCount || 0,
      participantAge: bookingDetails?.participantAge || '',
      specialInstructions: bookingDetails?.specialInstructions || '',
  };

  // Function to update the bookingDetails state from EventDetailsStep.
  // This assumes EventDetailsStep provides the necessary setters or updates via a prop.
  // We'll create a simple setter here that mirrors the required structure.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const setBookingDetailsField = (field: keyof NewBookingState, value: any) => {
    setBookingDetails(prevDetails => {
        if (!prevDetails) return null;
        return {
            ...prevDetails,
            [field]: value
        };
    });
  };


  if (loading) return <div className="container mx-auto p-4">Loading booking details...</div>;
  if (error) return <div className="container mx-auto p-4 text-red-600">Error: {error}</div>;
  if (!bookingDetails) return <div className="container mx-auto p-4">No booking found.</div>;


  // Determine expiration time based on bookingDetails
  const expirationTime = bookingDetails?.expirationTime
    ? new Date(bookingDetails.expirationTime)
    : null; // Assuming bookingDetails includes an optional expirationTime field


  return (
    <div className="container mx-auto p-4">
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold">Edit Booking</h1>
          {/* Pass the actual expiration time to TimerDisplay */}
          <TimerDisplay expirationTime={expirationTime} />
        </div>
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-bold">Customer Information</h2>
          {/* Pass necessary props to EventDetailsStep */}
          <EventDetailsStep
            businessId={businessId}
            newBooking={dummyNewBooking} // Use mapped booking details or adjust component props
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            setNewBooking={setBookingDetailsField as any} // Use setter that updates bookingDetails state
            selectedItems={selectedItems}
            eventDate={bookingDetails.eventDate}
            startTime={bookingDetails.startTime}
            endTime={bookingDetails.endTime}
            selectInventoryItem={selectInventoryItem}
            updateQuantity={updateQuantity}
            bookingId={bookingId} // Pass bookingId for availability check exclusion
            onContinue={() => {
              // TODO: Handle continue button action, e.g., save changes, go to next step
              console.log("Continue button clicked. Selected items:", Array.from(selectedItems.values()));
            }}
          />
        </div>
         {/* TODO: Add other steps like Customer Info, Summary, Payment */}
      </div>

  )
}

// TODO: Add fetchBookingDetails function to services/bookingService.ts
