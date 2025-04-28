"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import type { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface DatePickerWithRangeProps {
  className?: string;
  date: DateRange | undefined;
  onSelect: (date: DateRange | undefined) => void;
}

export function DatePickerWithRange({ className, date, onSelect }: DatePickerWithRangeProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal h-10",
              !date?.from && "text-muted-foreground",
              date?.from && "text-primary border-primary/30 bg-primary/5 hover:bg-primary/10"
            )}
          >
            <CalendarIcon className={cn("mr-2 h-4 w-4", date?.from ? "text-primary" : "text-muted-foreground")} />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={(range) => {
              if (range?.from && range?.to && range.from > range.to) {
                 onSelect({ from: range.from, to: range.from });
              } else {
                 onSelect(range);
              }
            }}
            numberOfMonths={2}
            disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
          />
          <div className="flex items-center justify-between p-3 border-t border-gray-100 bg-gray-50">
            <Button 
              variant="ghost" 
              size="sm" 
              type="button"
              onClick={() => {
                onSelect(undefined);
                setIsOpen(false);
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              Clear
            </Button>
            <Button 
              variant="default"
              size="sm" 
              type="button"
              onClick={() => setIsOpen(false)}
            >
              Apply
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
