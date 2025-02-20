import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { NewBookingForm } from "./new-booking-form";

interface BookingsHeaderProps {
  businessId: string;
}

export function BookingsHeader({ businessId }: BookingsHeaderProps) {
  return (
    <div className="flex items-center justify-between ">
      <h1 className="text-3xl font-bold tracking-tight">Bookings</h1>
      <Dialog>
        <DialogTrigger asChild>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> New Booking
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Booking</DialogTitle>
            <DialogDescription>
              Enter the booking details below
            </DialogDescription>
          </DialogHeader>
          <NewBookingForm businessId={businessId} />
        </DialogContent>
      </Dialog>
    </div>
  );
} 