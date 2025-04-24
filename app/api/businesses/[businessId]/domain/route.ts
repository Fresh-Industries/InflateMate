import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { withBusinessAuth } from "@/lib/auth/clerk-utils";

// PUT /api/businesses/[businessId]/domain
export async function PUT(req: NextRequest, props: { params: Promise<{ businessId: string }> }) {
  const params = await props.params;
  const { businessId } = params;
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { customDomain } = body;

    // Use withBusinessAuth to ensure the user has access to this business
    const result = await withBusinessAuth(businessId, userId, async () => {
      // Check if domain is already in use by another business
      if (customDomain) {
        const existingBusiness = await prisma.business.findFirst({
          where: {
            customDomain,
            id: {
              not: businessId,
            },
          },
        });

        if (existingBusiness) {
          return {
            error: "This domain is already in use by another business",
          };
        }
      }

      // Update the business with the new custom domain
      const updatedBusiness = await prisma.business.update({
        where: {
          id: businessId,
        },
        data: {
          customDomain,
        },
      });

      return updatedBusiness;
    });

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error("Error updating custom domain:", error);
    return NextResponse.json(
      { error: "Failed to update custom domain" },
      { status: 500 }
    );
  }
}

// GET /api/businesses/[businessId]/domain
export async function GET(req: NextRequest, props: { params: Promise<{ businessId: string }> }) {
  const params = await props.params;
  const { businessId } = params;
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Use withBusinessAuth to ensure the user has access to this business
    const result = await withBusinessAuth(businessId, userId, async (business) => {
      return {
        customDomain: business.customDomain,
      };
    });

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 403 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error("Error fetching custom domain:", error);
    return NextResponse.json(
      { error: "Failed to fetch custom domain" },
      { status: 500 }
    );
  }
}


