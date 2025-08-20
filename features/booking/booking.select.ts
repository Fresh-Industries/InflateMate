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

