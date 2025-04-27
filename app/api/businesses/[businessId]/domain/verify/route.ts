import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { withBusinessAuth } from "@/lib/auth/clerk-utils";
import { addDomainToVercel, removeDomainFromVercel } from "@/lib/vercel";
import { Prisma } from "@prisma/client";
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
export async function POST(req: NextRequest, props: { params: Promise<{ businessId: string }> }) {
  const params = await props.params;
  const { businessId } = params;
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { domain } = body;

    if (!domain || typeof domain !== 'string') {
      return NextResponse.json(
        { error: "Domain is required and must be a string" },
        { status: 400 }
      );
    }

    // Use withBusinessAuth to ensure the user has access to this business
    const result = await withBusinessAuth<SuccessResult | ErrorResult>(businessId, userId, async () => {
      let vercelDomainAdded = false;
      
      try {
        // Use a transaction to ensure atomic operations
        return await prisma.$transaction(async (tx) => {
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
              statusCode: 409
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
                // Clear any previous onboarding error
                onboardingError: null,
              },
            });

            return { updatedBusiness } as SuccessResult;
          } catch (dbError) {
            throw dbError; // Re-throw for the outer catch to handle
          }
        });
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
           data: { onboardingError: error instanceof Error ? error.message : 'Failed to add domain.' }
        });
        
        return { 
          error: error instanceof Error ? error.message : "Failed to add custom domain",
          statusCode: 500
        } as ErrorResult;
      }
    });

    // Handle errors returned from withBusinessAuth
    if (result.error) {
      // Determine appropriate status code
      let status = 500;
      
      if (result.error === "You don't have access to this business") {
        status = 403;
      } else if (result.error.includes("already in use")) {
        status = 409;
      }
      
      return NextResponse.json({ error: result.error }, { status });
    }

    // Success response - we know result has data at this point
    const successResult = result.data as SuccessResult;
    return NextResponse.json(successResult.updatedBusiness);

  } catch (error) {
    console.error("Error in POST /api/businesses/[businessId]/domain:", error);
    // Handle JSON parsing errors or other unexpected issues
    const errorMessage = error instanceof Error ? error.message : "Failed to process request";
    const status = error instanceof SyntaxError ? 400 : 500;
    return NextResponse.json(
      { error: errorMessage },
      { status }
    );
  }
}

