import { z } from "zod";

export const createBusinessSchema = z.object({
  name: z.string().min(2, "Business name must be at least 2 characters"),
  description: z.string().optional(),
  taxId: z.string().optional(),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().length(2, "Please use 2-letter state code"),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, "Invalid ZIP code"),
  phone: z.string().regex(/^\+?1?\d{9,15}$/, "Invalid phone number"),
  email: z.string().email("Invalid email address"),
  website: z.string().url().optional(),
});


export const updateBusinessFormSchema = z.object({
    name: z.string().min(2).optional(),
    description: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().length(2).optional(),
    zipCode: z.string().optional(),
    logo: z.string().url().optional(),
    minNoticeHours: z.coerce.number().optional(),
    maxNoticeHours: z.coerce.number().optional(),
    minBookingAmount: z.coerce.number().optional(),
    bufferBeforeHours: z.coerce.number().optional(),
    bufferAfterHours: z.coerce.number().optional(),
    embeddedComponents: z.coerce.boolean().optional(),
    serviceArea: z.array(z.string()).optional(),
    socialMedia: z.any().optional(),
  });