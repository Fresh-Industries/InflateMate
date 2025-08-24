import { z } from "zod";

export const baseInventorySchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    price: z.number().min(0, "Price must be 0 or greater"),
    status: z.enum(["AVAILABLE", "MAINTENANCE", "RETIRED"]),
    images: z.array(z.object({
      url: z.string(),
      isPrimary: z.boolean()
    })),
    quantity: z.number().int().min(0).default(1),
    type: z.enum(["BOUNCE_HOUSE", "WATER_SLIDE", "GAME", "OTHER"]),
});
  
  // Type-specific schemas
  export const bounceHouseSchema = baseInventorySchema.extend({
    dimensions: z.string().min(1, "Dimensions are required"),
    capacity: z.number().min(1, "Capacity must be at least 1"),
    setupTime: z.number().min(0),
    teardownTime: z.number().min(0),
    minimumSpace: z.string().min(1, "Minimum space is required"),
    weightLimit: z.number().min(0),
    ageRange: z.string().min(1, "Age range is required"),
    weatherRestrictions: z.array(z.string()).optional(),
});
  
  export const gameSchema = baseInventorySchema.extend({
    dimensions: z.string().min(1, "Dimensions are required").optional(),
    ageRange: z.string().min(1, "Age range is required"),
    setupTime: z.number().min(0).optional(),
    teardownTime: z.number().min(0).optional(),
    capacity: z.number().min(1, "Capacity must be at least 1").optional(),
});
  
 export const otherSchema = baseInventorySchema.extend({
    dimensions: z.string().optional(),
    setupTime: z.number().min(0).optional(),
    teardownTime: z.number().min(0).optional(),
    capacity: z.number().min(1).optional(),
    minimumSpace: z.string().optional(),
    weightLimit: z.number().min(0).optional(),
    ageRange: z.string().optional(),
});

export const updateInventorySchema = z.object({
    name: z.string().min(1, "Name is required").optional(),
    description: z.string().optional(),
    dimensions: z.string().min(1, "Dimensions are required").optional(),
    capacity: z.number().min(1, "Capacity must be at least 1").optional(),
    price: z.number().min(0, "Price must be 0 or greater").optional(),
    setupTime: z.number().min(0).optional(),
    teardownTime: z.number().min(0).optional(),
    images: z
      .array(
        z.object({
          url: z.string(),
          isPrimary: z.boolean(),
        })
      )
      .optional(),
    status: z.enum(["AVAILABLE", "MAINTENANCE", "RETIRED"]).optional(),
    minimumSpace: z.string().min(1, "Minimum space is required").optional(),
    weightLimit: z.number().min(0).optional(),
    ageRange: z.string().min(1, "Age range is required").optional(),
    weatherRestrictions: z.array(z.string()).optional(),
    quantity: z.number().int().min(0).optional(),
    removedImages: z.array(z.string()).optional(),
});