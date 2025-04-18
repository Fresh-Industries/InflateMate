import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { withBusinessAuth } from "@/lib/auth/clerk-utils";

// PUT /api/businesses/[businessId]/website
export async function PUT(req: NextRequest, props: { params: Promise<{ businessId: string }> }) {
  const params = await props.params;
  const { businessId } = params;
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { siteConfig } = body;

    if (!siteConfig) {
      return NextResponse.json(
        { error: "Site configuration is required" },
        { status: 400 }
      );
    }

    // Use withBusinessAuth to ensure the user has access to this business
    const result = await withBusinessAuth(businessId, userId, async () => {
      // Update the business with the new site configuration
      const updatedBusiness = await prisma.business.update({
        where: {
          id: businessId,
        },
        data: {
          siteConfig,
        },
      });

      return updatedBusiness;
    });

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 403 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error("Error updating website configuration:", error);
    return NextResponse.json(
      { error: "Failed to update website configuration" },
      { status: 500 }
    );
  }
}

// GET /api/businesses/[businessId]/website
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
        siteConfig: business.siteConfig || {},
        customDomain: business.customDomain,
      };
    });

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 403 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error("Error fetching website configuration:", error);
    return NextResponse.json(
      { error: "Failed to fetch website configuration" },
      { status: 500 }
    );
  }
} 