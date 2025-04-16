import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function getCurrentUser() {
  // Get the Clerk user
  const { userId } = await auth();

  console.log("userId", userId);
  
  if (!userId) {
    return null;
  }
  
  try {
    // Get the user from your database
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    });
    
    if (!user) {
      const clerkUser = await currentUser();
      if (!clerkUser) {
        return null;
      }
      return user;
    }
    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

// Define a more flexible Business interface
interface Business {
  id: string;
  name: string;
  userId: string;
  stripeAccountId?: string | null;
  // Other properties can be any type
  [key: string]: unknown;
}

// Define result types for better type safety
interface BusinessAuthSuccess<T> {
  data: T;
  error?: undefined;
}

interface BusinessAuthError {
  error: string;
  data?: undefined;
}

type BusinessAuthResult<T> = BusinessAuthSuccess<T> | BusinessAuthError;

// Updated withBusinessAuth function with better handling of returned objects
export async function withBusinessAuth<T>(
  businessId: string,
  userId: string,
  callback: (business: Business) => Promise<T | BusinessAuthResult<T>>
): Promise<BusinessAuthResult<T>> {
  try {
    console.log(`withBusinessAuth called for business ${businessId} and user ${userId}`);
    
    // First, try to find the business directly with the userId
    let business = await prisma.business.findFirst({
      where: {
        id: businessId,
        userId: userId,
      },
    });

    // If not found, check if the userId is a Clerk ID and find the corresponding user
    if (!business) {
      console.log(`Business not found directly, checking for Clerk user mapping`);
      const user = await prisma.user.findUnique({
        where: { clerkUserId: userId },
      });
      
      if (user) {
        console.log(`Found user with Clerk ID ${userId}, checking business with user ID ${user.id}`);
        business = await prisma.business.findFirst({
          where: {
            id: businessId,
            userId: user.id,
          },
        });
      }
    }

    if (!business) {
      console.error(`Business ${businessId} not found for user ${userId}`);
      return { error: "You don't have access to this business" };
    }

    console.log(`Business ${businessId} found, executing callback`);
    let result;
    try {
      result = await callback(business as Business);
    } catch (callbackError) {
      console.error("Error in business callback:", callbackError);
      return { error: callbackError instanceof Error ? callbackError.message : "Error processing request" };
    }
    
    // Handle null or undefined result
    if (result === null || result === undefined) {
      console.log("Callback returned null or undefined, returning empty data object");
      return { data: {} as T };
    }
    
    // Check if the result is already an object with data/error structure
    if (typeof result === 'object' && result !== null && ('data' in result || 'error' in result)) {
      console.log(`Result from callback has data/error structure`);
      return result as BusinessAuthResult<T>;
    }
    
    // Otherwise, wrap the result in a data property
    console.log(`Wrapping callback result in data property`);
    return { data: result as T };
  } catch (error) {
    console.error("Business auth error:", error);
    return { error: error instanceof Error ? error.message : "An error occurred" };
  }
} 