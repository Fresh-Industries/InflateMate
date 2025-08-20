// Keep your selects in one place so both service methods & tests reuse them

export const publicBusinessSelect = {
    id: true,
    name: true,
    city: true,
    state: true,
    stripeAccountId: true,
    minNoticeHours: true,
    maxNoticeHours: true,
    minBookingAmount: true,
    bufferBeforeHours: true,
    bufferAfterHours: true,
    inventory: true,
} as const;
  
export const privateBusinessSelect = {
    id: true,
    name: true,
    description: true,
    address: true,
    city: true,
    state: true,
    zipCode: true,
    phone: true,
    email: true,
    logo: true,
    timeZone: true,
    stripeAccountId: true,
    socialMedia: true,
    customDomain: true,
    subdomain: true,
    siteConfig: true,
    inventory: true,
    customers: true,
    bookings: {
      where: { eventDate: { gte: new Date() } },
      take: 5,
      orderBy: { eventDate: "asc" as const },
    },
    minNoticeHours: true,
    maxNoticeHours: true,
    minBookingAmount: true,
    bufferBeforeHours: true,
    bufferAfterHours: true,
} as const;
  