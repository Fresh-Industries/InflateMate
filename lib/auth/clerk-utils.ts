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
        memberships: {
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

/**
 * Helper function to get the primary membership for a user.
 * For now, returns the first membership, but this can be enhanced
 * to select based on specific criteria (e.g., active organization).
 * 
 * @param user - User object with memberships
 * @returns The primary membership or null if none exists
 */
export function getPrimaryMembership(user: NonNullable<Awaited<ReturnType<typeof getCurrentUserWithOrgAndBusiness>>>) {
  return user.memberships?.[0] || null;
}

/**
 * Helper function to get a specific membership by business ID.
 * 
 * @param user - User object with memberships
 * @param businessId - The business ID to find membership for
 * @returns The membership for the specific business or null if not found
 */
export function getMembershipByBusinessId(
  user: NonNullable<Awaited<ReturnType<typeof getCurrentUserWithOrgAndBusiness>>>, 
  businessId: string
) {
  return user.memberships?.find(membership => 
    membership.organization?.business?.id === businessId
  ) || null;
}
