import { auth } from "@clerk/nextjs/server";
import { prisma } from "../prisma";

/**
 * Fetches the current authenticated user along with their organization,
 * business, and subscription details from the database.
 *
 * @returns The full User object with relations, or null if not authenticated or found.
 */
export const getCurrentUserWithOrgAndBusiness = async () => {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        clerkUserId: userId,
      },
      include: {
        membership: {
          include: {
            organization: {
              include: {
                business: true,
                subscription: true,
              },
            },
          },
        },
      },
    });

    return user;
  } catch (error) {
    // Optional: Log the error for debugging purposes
    console.error("Failed to fetch user with org and business:", error);
    // Depending on your error handling strategy, you might want to re-throw,
    // return null, or return a specific error object.
    // Returning null here aligns with the function's goal if the user lookup fails for any reason.
    return null;
  }
};
