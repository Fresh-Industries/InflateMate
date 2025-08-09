import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserWithOrgAndBusiness, getMembershipByBusinessId } from "@/lib/auth/clerk-utils";
import { prisma } from "@/lib/prisma";
import { addDomainToVercel, removeDomainFromVercel } from "@/lib/vercel";
import type { Business } from "@/prisma/generated/prisma/client";

// Define interfaces for our return types
interface SuccessResult {
  updatedBusiness: Business;
}

interface ErrorResult {
  error: string;
  statusCode?: number;
}

// POST /api/businesses/[businessId]/domain
export async function POST(
  req: NextRequest,
  props: { params: Promise<{ businessId: string }> }
) {
  const params = await props.params;
  const { businessId } = params;
  const user = await getCurrentUserWithOrgAndBusiness();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check that the user has access to this business
  const membership = getMembershipByBusinessId(user, businessId);
  if (!membership) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { domain } = body;

    if (!domain || typeof domain !== "string") {
      return NextResponse.json(
        { error: "Domain is required and must be a string" },
        { status: 400 }
      );
    }

    let vercelDomainAdded = false;

    try {
      // Use a transaction to ensure atomic operations
      const result = await prisma.$transaction(async (tx) => {
        // 1. Check if domain is already in use by another business
        const existingBusiness = await tx.business.findFirst({
          where: {
            customDomain: domain,
            id: {
              not: businessId,
            },
          },
        });

        if (existingBusiness) {
          return {
            error: "This domain is already in use by another business",
            statusCode: 409,
          } as ErrorResult;
        }

        // 2. Add domain to Vercel
        await addDomainToVercel(domain);
        vercelDomainAdded = true;

        // 3. Update the business with the new custom domain
        try {
          const updatedBusiness = await tx.business.update({
            where: {
              id: businessId,
            },
            data: {
              customDomain: domain,
              onboardingError: null,
            },
          });

          return { updatedBusiness } as SuccessResult;
        } catch (dbError) {
          throw dbError; // Re-throw for the outer catch to handle
        }
      });

      // If the transaction returned an error, handle it
      if ("error" in result) {
        return NextResponse.json({ error: result.error }, { status: result.statusCode || 500 });
      }

      // Success response
      return NextResponse.json((result as SuccessResult).updatedBusiness);

    } catch (error) {
      console.error("Error processing domain addition:", error);

      // Clean up Vercel domain if we added it but the transaction failed
      if (vercelDomainAdded) {
        try {
          await removeDomainFromVercel(domain);
          console.log(`Cleaned up Vercel domain ${domain} after transaction failure`);
        } catch (cleanupError) {
          console.error(`Failed to clean up Vercel domain ${domain}:`, cleanupError);
        }
      }

      // Record the error in the business record
      await prisma.business.update({
        where: { id: businessId },
        data: { onboardingError: error instanceof Error ? error.message : "Failed to add domain." },
      });

      return NextResponse.json(
        { error: error instanceof Error ? error.message : "Failed to add custom domain" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in POST /api/businesses/[businessId]/domain:", error);
    // Handle JSON parsing errors or other unexpected issues
    const errorMessage = error instanceof Error ? error.message : "Failed to process request";
    const status = error instanceof SyntaxError ? 400 : 500;
    return NextResponse.json({ error: errorMessage }, { status });
  }
}
