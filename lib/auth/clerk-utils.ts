import { auth } from "@clerk/nextjs/server";
import { prisma } from "../prisma";
import { cache } from "react"; // Import cache from react

/**
 * Fetches the current authenticated user along with their organization,
 * business, and subscription details from the database.
 *
 * @returns The full User object with relations, or null if not authenticated or found.
 */
export const getCurrentUserWithOrgAndBusiness = cache(async () => { 
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
    console.error("Failed to fetch user with org and business:", error);
    return null;
  }
});
