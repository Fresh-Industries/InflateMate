'use client';

import { Calendar, dateFnsLocalizer, EventProps, ToolbarProps } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

// Align BookingItem type with bookings-list.tsx
interface BookingItem {
  id: string;
  quantity: number;
  price: number;
  inventoryId: string;
  bookingId: string;
}

// Update the Waiver interface to match bookings-list.tsx
interface Waiver {
  id: string;
  status: 'PENDING' | 'SIGNED' | 'REJECTED' | 'EXPIRED';
  docuSealDocumentId?: string;
  bookingId: string;
}

const locales = {
  'en-US': enUS,
};

// Update the Booking interface to make waivers optional
interface Booking {
  id: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'HOLD';
  totalAmount: number;
  subtotalAmount?: number;
  taxAmount?: number;
  taxRate?: number;
  depositAmount?: number;
  depositPaid?: boolean;
  eventType: string;
  participantCount: number;
  participantAge?: string;
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  inventoryItems: BookingItem[];
  waivers?: Waiver[]; // Made optional
  hasSignedWaiver: boolean;
  eventAddress: string;
  eventCity: string;
  eventState: string;
  eventZipCode: string;
  eventTimeZone: string;
  specialInstructions?: string;
  refundAmount?: number;
  refundReason?: string;
  isCompleted?: boolean;
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: Booking;
  status: Booking['status'];
}

interface BookingsCalendarViewProps {
  bookings: Booking[];
  onSelectBooking: (booking: Booking) => void;
  currentDate: Date;
  onNavigateChange: (newDate: Date) => void;
}

// Custom Event Component for styling each event in the calendar
const CustomEvent = ({ event }: EventProps<CalendarEvent>) => {
  const getStatusColorClasses = (status: Booking['status']) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 border-yellow-300 text-yellow-800";
      case "CONFIRMED":
        return "bg-blue-100 border-blue-300 text-blue-800";
      case "COMPLETED":
        return "bg-green-100 border-green-300 text-green-800";
      case "CANCELLED":
        return "bg-red-100 border-red-300 text-red-800";
      case "HOLD":
        return "bg-gray-100 border-gray-300 text-gray-600";
      default:
        return "bg-gray-100 border-gray-300 text-gray-600";
    }
  };

  return (
    <div
      className={cn(
        "p-1 rounded text-xs border h-full overflow-hidden",
        getStatusColorClasses(event.status)
      )}
    >
      <strong className="block truncate font-medium">{event.title}</strong>
      <span className="block truncate text-xs opacity-80">
        {format(event.start, 'h:mm a')} - {format(event.end, 'h:mm a')}
      </span>
    </div>
  );
};

// --- Custom Toolbar Component ---
const CustomCalendarToolbar = (toolbar: ToolbarProps<CalendarEvent, object>) => {
  const goToBack = () => {
    toolbar.onNavigate('PREV');
    console.log('goToBack');
  };

  const goToNext = () => {
    toolbar.onNavigate('NEXT');
    console.log('goToNext');
  };

  const goToCurrent = () => {
    toolbar.onNavigate('TODAY');
    console.log('goToCurrent');
  };

  const label = () => (
    <span className="text-xl font-semibold text-gray-800">
      {format(toolbar.date, 'MMMM yyyy')}
    </span>
  );

  return (
    <div className="flex flex-col md:flex-row items-center justify-between mb-4 px-1 gap-4">
      <div className="flex items-center gap-2">
        <Button onClick={goToBack} variant="ghost">
          <ChevronLeft />
        </Button>
        <Button onClick={goToCurrent} variant="ghost">
          Today
        </Button>
        <Button onClick={goToNext} variant="ghost">
          <ChevronRight />
        </Button>
      </div>
      <div className="flex-1 text-center md:text-left">{label()}</div>
    </div>
  );
};
// --- End Custom Toolbar ---

export function BookingsCalendarView({ 
  bookings, 
  onSelectBooking, 
  currentDate, 
  onNavigateChange 
}: BookingsCalendarViewProps) {
  const events = useMemo(() => {
    return bookings.map((booking): CalendarEvent => {
      // Construct start and end dates by combining booking.eventDate with startTime and endTime
      const startDate = new Date(`${booking.eventDate.split('T')[0]}T${booking.startTime.split('T')[1]}`);
      const endDate = new Date(`${booking.eventDate.split('T')[0]}T${booking.endTime.split('T')[1]}`);

      return {
        id: booking.id,
        title: `${booking.customer?.name || 'No Customer'} (${booking.inventoryItems?.map(i => i.inventoryId).join(', ') || 'No Items'})`,
        start: startDate,
        end: endDate,
        resource: booking,
        status: booking.status,
      };
    });
  }, [bookings]);

  const handleSelectEvent = (event: CalendarEvent) => {
    onSelectBooking(event.resource);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 h-[750px]">
      {/* Render modern calendar styles */}
      <CalendarStyles />
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        date={currentDate}
        onNavigate={onNavigateChange}
        style={{ height: 'calc(100% - 60px)' }}
        onSelectEvent={handleSelectEvent}
        views={['month', 'week', 'day']}
        components={{
          toolbar: CustomCalendarToolbar,
          event: CustomEvent,
        }}
        eventPropGetter={(event) => ({
          className: cn(
            "rounded border-l-4",
            event.status === "PENDING" && "border-yellow-500",
            event.status === "CONFIRMED" && "border-blue-500",
            event.status === "COMPLETED" && "border-green-500",
            event.status === "CANCELLED" && "border-red-500",
            event.status === "HOLD" && "border-gray-400",
          )
        })}
        className="rbc-calendar-modern"
      />
    </div>
  );
}

// Basic modern styles for the calendar (can be expanded or moved to a separate CSS file)
const CalendarStyles = () => (
  <style jsx global>{`
    .rbc-calendar-modern .rbc-toolbar {
      margin-bottom: 1.5rem;
      padding: 0;
    }
    .rbc-calendar-modern .rbc-header {
      padding: 0.75rem 0.5rem;
      text-align: center;
      font-weight: 600;
      font-size: 0.875rem;
      color: #4b5563;
      border-bottom: 1px solid #e5e7eb;
      background-color: #f9fafb;
    }
    .rbc-calendar-modern .rbc-month-view,
    .rbc-calendar-modern .rbc-time-grid {
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
      overflow: hidden;
    }
    .rbc-calendar-modern .rbc-day-bg + .rbc-day-bg {
      border-left: 1px solid #f3f4f6;
    }
    .rbc-calendar-modern .rbc-month-row + .rbc-month-row {
      border-top: 1px solid #f3f4f6;
    }
    .rbc-calendar-modern .rbc-time-header-content {
      border-left: 1px solid #f3f4f6;
    }
    .rbc-calendar-modern .rbc-time-header.rbc-overflowing {
      border-right: none;
    }
    .rbc-calendar-modern .rbc-time-slot {
      border-top: 1px solid #f3f4f6;
    }
    .rbc-calendar-modern .rbc-event {
      border-radius: 4px;
      opacity: 0.9;
      box-shadow: 0 1px 2px rgba(0,0,0,0.05);
      transition: opacity 0.2s ease;
    }
    .rbc-calendar-modern .rbc-event:hover {
      opacity: 1;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .rbc-calendar-modern .rbc-today {
      background-color: #eff6ff;
    }
  `}</style>
);
