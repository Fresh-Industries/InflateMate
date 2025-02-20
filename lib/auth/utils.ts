import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { 
  Business, 
  BounceHouse, 
  Customer,
  User
} from "@prisma/client";

export async function getCurrentUser(): Promise<User | null> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return null;
    }

    const currentUser = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
      include: {
        businesses: true,
      },
    });

    if (!currentUser) {
      return null;
    }

    return currentUser;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

export async function requireAuth() {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  return user;
}

type BusinessWithRelations = Business & {
  bounceHouses: BounceHouse[];
  customers: Customer[];
};

type BusinessAuthResult<T> = Promise<
  | { error: string; data?: never }
  | { error?: never; data: T }
>;

export async function withBusinessAuth<T>(
  businessId: string | null | undefined,
  userId: string | null | undefined,
  callback: (business: BusinessWithRelations) => Promise<T>
): BusinessAuthResult<T> {
  if (!businessId || !userId) {
    console.error("Missing required parameters:", { businessId, userId });
    return { error: "Missing business ID or user ID" };
  }

  try {
    // Verify business ownership
    const business = await prisma.business.findFirst({
      where: { 
        id: businessId,
        userId: userId
      },
      include: {
        bounceHouses: true,
        customers: true
      }
    });

    if (!business) {
      console.error("Business not found:", { businessId, userId });
      return { error: "Business not found or unauthorized" };
    }

    try {
      // Execute the callback with the business context
      const result = await callback(business as BusinessWithRelations);
      
      // Handle null or undefined result
      if (result === null || result === undefined) {
        console.error("Callback returned null/undefined");
        return { error: "Operation failed - no result returned" };
      }

      return { data: result };
    } catch (callbackError) {
      console.error("Callback execution error:", callbackError);
      return { 
        error: callbackError instanceof Error 
          ? callbackError.message 
          : "Operation failed" 
      };
    }
  } catch (error) {
    console.error("Business auth error:", error);
    return { 
      error: error instanceof Error 
        ? error.message 
        : "Authentication failed" 
    };
  }
} 