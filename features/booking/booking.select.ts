// Keep booking-related selects/includes centralized

export const bookingListInclude = {
  inventoryItems: {
    include: {
      inventory: {
        select: { id: true, name: true },
      },
    },
  },
  customer: true,
  waivers: {
    select: {
      id: true,
      status: true,
      docuSealDocumentId: true,
    },
  },
} as const;

export const bookingForDateSelect = {
  id: true,
  startTime: true,
  endTime: true,
  status: true,
} as const;

export const publicBookingInclude = {
  business: {
    select: {
      name: true,
      email: true,
      phone: true,
      address: true,
      city: true,
      state: true,
      zipCode: true,
    },
  },
  inventoryItems: {
    include: {
      inventory: {
        select: {
          id: true,
          name: true,
          description: true,
          primaryImage: true,
        },
      },
    },
  },
  customer: {
    select: {
      name: true,
      email: true,
    },
  },
  waivers: {
    select: {
      status: true,
    },
  },
} as const;

export const bookingEditInclude = {
  inventoryItems: {
    include: {
      inventory: {
        select: { id: true, name: true, description: true, primaryImage: true },
      },
    },
  },
  customer: true,
  waivers: {
    select: { id: true, status: true, docuSealDocumentId: true },
  },
} as const;

