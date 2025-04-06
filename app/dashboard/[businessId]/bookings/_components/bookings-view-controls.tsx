import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, Search, CalendarRange, SlidersHorizontal, X, SortAsc, SortDesc } from "lucide-react";
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
  
  const handleClearFilters = () => {
    if (onClearFilters) {
      onClearFilters();
    } else {
      onSearchChange('');
      onStatusFilterChange('CONFIRMED');
      if (onDateRangeChange) onDateRangeChange(undefined);
      if (onEventTypeChange) onEventTypeChange('');
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between pb-4 border-b mb-4">
      <div className="relative w-full md:w-auto flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by customer, location, or event type..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 w-full"
        />
      </div>
      
      <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
        {/* Status Filter Dropdown */}
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="w-[160px]">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <SelectValue placeholder="Status" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="CONFIRMED">
              <div className="flex items-center gap-2">
                <Badge variant="default" className="h-2 w-2 rounded-full p-0" />
                Confirmed
              </div>
            </SelectItem>
            <SelectItem value="PENDING">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="h-2 w-2 rounded-full p-0" />
                Pending
              </div>
            </SelectItem>
            <SelectItem value="CANCELLED">
              <div className="flex items-center gap-2">
                <Badge variant="destructive" className="h-2 w-2 rounded-full p-0" />
                Cancelled
              </div>
            </SelectItem>
            <SelectItem value="COMPLETED">
              <div className="flex items-center gap-2">
                <Badge variant="success" className="h-2 w-2 rounded-full p-0" />
                Completed
              </div>
            </SelectItem>
          </SelectContent>
        </Select>

        {/* Date Range Picker */}
        <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="h-10">
              <CalendarRange className="mr-2 h-4 w-4" />
              {dateRange?.from ? (
                dateRange.to ? (
                  <span>
                    {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
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
            />
            <div className="flex items-center justify-between p-3 border-t">
              <Button variant="ghost" size="sm" onClick={() => {
                if (onDateRangeChange) onDateRangeChange(undefined)
                setDatePickerOpen(false)
              }}>
                Clear
              </Button>
              <Button size="sm" onClick={() => setDatePickerOpen(false)}>
                Apply
              </Button>
            </div>
          </PopoverContent>
        </Popover>
        
        {/* Sort Options */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              {sortDirection === "asc" ? (
                <SortAsc className="h-4 w-4" />
              ) : (
                <SortDesc className="h-4 w-4" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Sort By</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuCheckboxItem 
                checked={sortField === "eventDate"}
                onCheckedChange={() => onSortFieldChange && onSortFieldChange("eventDate")}
              >
                Event Date
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem 
                checked={sortField === "totalAmount"}
                onCheckedChange={() => onSortFieldChange && onSortFieldChange("totalAmount")}
              >
                Amount
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem 
                checked={sortField === "customerName"}
                onCheckedChange={() => onSortFieldChange && onSortFieldChange("customerName")}
              >
                Customer Name
              </DropdownMenuCheckboxItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Direction</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuCheckboxItem 
                checked={sortDirection === "asc"}
                onCheckedChange={() => onSortDirectionChange && onSortDirectionChange("asc")}
              >
                Ascending
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem 
                checked={sortDirection === "desc"}
                onCheckedChange={() => onSortDirectionChange && onSortDirectionChange("desc")}
              >
                Descending
              </DropdownMenuCheckboxItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Advanced Filters Button */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Event Type</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuCheckboxItem 
                checked={eventType === ""}
                onCheckedChange={() => onEventTypeChange && onEventTypeChange("")}
              >
                All Types
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem 
                checked={eventType === "BIRTHDAY"}
                onCheckedChange={() => onEventTypeChange && onEventTypeChange("BIRTHDAY")}
              >
                Birthday Party
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem 
                checked={eventType === "CORPORATE"}
                onCheckedChange={() => onEventTypeChange && onEventTypeChange("CORPORATE")}
              >
                Corporate Event
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem 
                checked={eventType === "SCHOOL"}
                onCheckedChange={() => onEventTypeChange && onEventTypeChange("SCHOOL")}
              >
                School Event
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem 
                checked={eventType === "FESTIVAL"}
                onCheckedChange={() => onEventTypeChange && onEventTypeChange("FESTIVAL")}
              >
                Festival
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem 
                checked={eventType === "FAMILY"}
                onCheckedChange={() => onEventTypeChange && onEventTypeChange("FAMILY")}
              >
                Family Gathering
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem 
                checked={eventType === "OTHER"}
                onCheckedChange={() => onEventTypeChange && onEventTypeChange("OTHER")}
              >
                Other
              </DropdownMenuCheckboxItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Show Past Bookings Toggle */}
        <div className="flex items-center space-x-2">
          <Switch 
            id="show-past" 
            checked={showPastBookings}
            onCheckedChange={onShowPastBookingsChange}
          />
          <Label htmlFor="show-past" className="text-sm font-medium">Show Past</Label>
        </div>
        
        {/* Clear Filters Button */}
        {isAnyFilterActive && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleClearFilters}
            className="ml-1"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
} 