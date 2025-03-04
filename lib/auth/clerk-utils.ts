import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function getCurrentUser() {
  // Get the Clerk user
  const { userId } = await auth();
  
  if (!userId) {
    return null;
  }
  
  try {
    // Get the user from your database
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    });
    
    // If the user doesn't exist in your database yet, fetch from Clerk and create
    if (!user) {
      const clerkUser = await currentUser();
      
      if (!clerkUser) {
        return null;
      }
      
      // Get the primary email
      const emailObject = clerkUser.emailAddresses[0];
      const email = emailObject ? emailObject.emailAddress : null;
      
      // Combine first and last name for the full name
      const name = [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ');
      
      // Create the user in your database
      const newUser = await prisma.user.create({
        data: {
          clerkUserId: userId,
          name: name || null,
          email: email || null,
          image: clerkUser.imageUrl || null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
      
      return newUser;
    }
    
    return user;
  } catch (error) {
    console.error("Error getting current user:", error);
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
    
    const business = await prisma.business.findFirst({
      where: {
        id: businessId,
        userId: userId,
      },
    });

    if (!business) {
      console.error(`Business ${businessId} not found for user ${userId}`);
      return { error: "You don't have access to this business" };
    }

    console.log(`Business ${businessId} found, executing callback`);
    const result = await callback(business as Business);
    
    // Check if the result is already an object with data/error structure
    if (result && typeof result === 'object' && ('data' in result || 'error' in result)) {
      console.log(`Result from callback has data/error structure:`, 
                 { hasData: 'data' in result, hasError: 'error' in result });
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