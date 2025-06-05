// src/types/booking.ts

export type InventoryItem = {
    id: string;
    name: string;
    type: string;
    stripeProductId: string;
    description: string | null;
    price: number; // Assuming price is per day for a 24hr rental
    dimensions: string;
    capacity: number;
    ageRange: string;
    primaryImage: string | null;
    quantity: number; // Available quantity for the selected date/time
  };

  
  export type Business = {
    id: string;
    name: string;
    stripeAccountId?: string;
    stripeConnectedAccountId?: string;
    defaultTaxRate?: number;
    applyTaxToBookings?: boolean;
    timeZone?: string;
    minNoticeHours?: number;
    maxNoticeHours?: number;
    minBookingAmount?: number;
    bufferBeforeHours?: number;
    bufferAfterHours?: number;
    // Add other business fields as needed
  };
  
  export type SelectedItem = {
    item: InventoryItem;
    quantity: number;
  };
  
  export type BookingMetadata = {
    bounceHouseId?: string; // Might be multiple now with item selection
    eventDate: string;
    startTime: string;
    endTime: string;
    eventType: string;
    eventAddress: string;
    eventCity: string;
    eventState: string;
    eventZipCode: string;
    participantCount: number; // Changed from string to number based on usage
    participantAge?: string; // Can be string or number range
    specialInstructions?: string;
    totalAmount: number; // Use number for calculations
    subtotalAmount: number; // Use number for calculations
    taxAmount: number; // Use number for calculations
    taxRate: number; // Use number for calculations
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    businessId: string;
    bookingId?: string; // Client-generated or server-generated
    eventTimeZone: string;
    expirationTime: string;
    selectedItems?: Array<{ // Add selected items array
        id: string;
        name: string;
        price: number;
        quantity: number;
        stripeProductId: string;
    }>;
    couponCode?: string;
  };

  export type ReservationPayload = {
    eventDate: string;
    startTime: string;
    endTime: string;
    eventTimeZone: string;
    selectedItems: Array<{
      id: string;
      name: string;
      price: number;
      quantity: number;
      stripeProductId: string;
    }>;
  };
  
  export type AvailabilitySearchFilters = {
      date: string;
      startTime: string;
      endTime: string;
      tz: string;
      excludeBookingId?: string;
  }
  
  export type NewBookingState = {
    bounceHouseId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    eventDate: string;
    startTime: string;
    endTime: string;
    eventType: string;
    eventAddress: string;
    eventCity: string;
    eventState: string;
    eventZipCode: string;
    participantCount: number;
    participantAge: string;
    specialInstructions: string;
    eventTimeZone?: string;
  };
  
  export type Coupon = {
    code: string;
    amount: number;
  };
  
  export type PaginationControlsProps = {
    total: number;
    currentPage: number;
    setCurrentPage: (page: number) => void;
  };
  
  export type BookingFullDetails = {
    booking: {
      id: string;
      eventDate: Date;
      startTime: Date;
      endTime: Date;
      status: string;
      totalAmount: number | null;
      subtotalAmount?: number | null;
      taxAmount?: number | null;
      taxRate?: number | null;
      depositAmount?: number | null;
      depositPaid?: boolean | null;
      eventType: string | null;
      eventAddress: string | null;
      eventCity: string | null;
      eventState: string | null;
      eventZipCode: string | null;
      eventTimeZone: string;
      participantCount: number | null;
      participantAge: number | null;
      specialInstructions: string | null;
      expiresAt?: Date | null;
      isCompleted?: boolean;
      refundAmount?: number | null;
      refundReason?: string | null;
      // ...other booking fields
    };
    customer: {
      id: string;
      name: string;
      email: string;
      phone: string;
      // ...other customer fields
    } | null;
    bookingItems: Array<{
      id: string;
      quantity: number;
      price: number;
      startUTC: Date;
      endUTC: Date;
      inventoryId: string;
      bookingId: string;
      inventory: {
        id: string;
        name: string;
        description: string | null;
        primaryImage: string | null;
        // ...other inventory fields
      };
    }>;
    // Additional fields for compatibility
    waivers?: Array<{
      id: string;
      status: 'PENDING' | 'SIGNED' | 'REJECTED' | 'EXPIRED';
      docuSealDocumentId?: string;
    }>;
    hasSignedWaiver?: boolean;
    inventoryItems?: Array<{
      id: string;
      quantity: number;
      price: number;
      inventoryId: string;
      bookingId: string;
    }>;
  };
  