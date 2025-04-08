import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, Search, CalendarRange, SlidersHorizontal, X, SortAsc, SortDesc, CheckCircle2, Clock, XCircle, CheckCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface BookingsViewControlsProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  dateRange?: DateRange;
  onDateRangeChange?: (range: DateRange | undefined) => void;
  sortField?: string;
  onSortFieldChange?: (field: string) => void;
  sortDirection?: "asc" | "desc";
  onSortDirectionChange?: (direction: "asc" | "desc") => void;
  eventType?: string;
  onEventTypeChange?: (type: string) => void;
  showPastBookings: boolean;
  onShowPastBookingsChange: (checked: boolean) => void;
  onClearFilters?: () => void;
}

export function BookingsViewControls({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  dateRange,
  onDateRangeChange,
  sortField = "eventDate",
  onSortFieldChange,
  sortDirection = "asc",
  onSortDirectionChange,
  eventType,
  onEventTypeChange,
  showPastBookings,
  onShowPastBookingsChange,
  onClearFilters,
}: BookingsViewControlsProps) {
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  
  const isAnyFilterActive = searchTerm || statusFilter !== "CONFIRMED" || dateRange?.from || eventType || showPastBookings;
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="relative w-full md:w-auto flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search bookings..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 w-full bg-gray-50 border-gray-100 focus:bg-white transition-colors"
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger className="w-[160px] bg-gray-50 border-gray-100 hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <SelectValue placeholder="Status" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="CONFIRMED">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-500" />
                  <span>Confirmed</span>
                </div>
              </SelectItem>
              <SelectItem value="PENDING">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-yellow-500" />
                  <span>Pending</span>
                </div>
              </SelectItem>
              <SelectItem value="CANCELLED">
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-500" />
                  <span>Cancelled</span>
                </div>
              </SelectItem>
              <SelectItem value="COMPLETED">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Completed</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Date Range Picker */}
          <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className={cn(
                  "h-10 bg-gray-50 border-gray-100 hover:bg-gray-100 transition-colors",
                  dateRange?.from && "text-blue-600 border-blue-200 bg-blue-50 hover:bg-blue-50"
                )}
              >
                <CalendarRange className={cn(
                  "mr-2 h-4 w-4",
                  dateRange?.from ? "text-blue-500" : "text-gray-500"
                )} />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <span>
                      {format(dateRange.from, "LLL dd")} - {format(dateRange.to, "LLL dd")}
                    </span>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Date Range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={onDateRangeChange}
                numberOfMonths={2}
                className="rounded-lg border-none"
              />
              <div className="flex items-center justify-between p-3 border-t border-gray-100 bg-gray-50">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    if (onDateRangeChange) onDateRangeChange(undefined)
                    setDatePickerOpen(false)
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Clear
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => setDatePickerOpen(false)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Apply
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          
          {/* Sort Options */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="icon"
                className="bg-gray-50 border-gray-100 hover:bg-gray-100 transition-colors"
              >
                {sortDirection === "asc" ? (
                  <SortAsc className="h-4 w-4 text-gray-500" />
                ) : (
                  <SortDesc className="h-4 w-4 text-gray-500" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel className="text-gray-500">Sort By</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuCheckboxItem 
                  checked={sortField === "eventDate"}
                  onCheckedChange={() => onSortFieldChange && onSortFieldChange("eventDate")}
                  className="text-sm"
                >
                  Event Date
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem 
                  checked={sortField === "totalAmount"}
                  onCheckedChange={() => onSortFieldChange && onSortFieldChange("totalAmount")}
                  className="text-sm"
                >
                  Amount
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem 
                  checked={sortField === "customerName"}
                  onCheckedChange={() => onSortFieldChange && onSortFieldChange("customerName")}
                  className="text-sm"
                >
                  Customer Name
                </DropdownMenuCheckboxItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-gray-500">Direction</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuCheckboxItem
                  checked={sortDirection === "asc"}
                  onCheckedChange={() => onSortDirectionChange && onSortDirectionChange("asc")}
                  className="text-sm"
                >
                  Ascending
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={sortDirection === "desc"}
                  onCheckedChange={() => onSortDirectionChange && onSortDirectionChange("desc")}
                  className="text-sm"
                >
                  Descending
                </DropdownMenuCheckboxItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Show Past Bookings Toggle */}
          <div className="flex items-center gap-2">
            <Switch
              id="show-past"
              checked={showPastBookings}
              onCheckedChange={onShowPastBookingsChange}
              className="data-[state=checked]:bg-blue-600"
            />
            <Label htmlFor="show-past" className="text-sm text-gray-600">
              Show Past
            </Label>
          </div>

          {/* Clear Filters */}
          {isAnyFilterActive && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </div>
    </div>
  );
} 