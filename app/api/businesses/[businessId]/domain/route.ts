import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserWithOrgAndBusiness } from "@/lib/auth/clerk-utils";
import { prisma } from "@/lib/prisma";

// PUT /api/businesses/[businessId]/domain
export async function PUT(
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
  const userBusinessId = user.membership?.organization?.business?.id;
  if (!userBusinessId || userBusinessId !== businessId) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { customDomain } = body;

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
        return NextResponse.json(
          { error: "This domain is already in use by another business" },
          { status: 400 }
        );
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

    return NextResponse.json(updatedBusiness);
  } catch (error) {
    console.error("Error updating custom domain:", error);
    return NextResponse.json(
      { error: "Failed to update custom domain" },
      { status: 500 }
    );
  }
}

// GET /api/businesses/[businessId]/domain
export async function GET(
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
  const userBusinessId = user.membership?.organization?.business?.id;
  if (!userBusinessId || userBusinessId !== businessId) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  try {
    const business = await prisma.business.findUnique({
      where: { id: businessId },
      select: { customDomain: true },
    });

    if (!business) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 });
    }

    return NextResponse.json({ customDomain: business.customDomain });
  } catch (error) {
    console.error("Error fetching custom domain:", error);
    return NextResponse.json(
      { error: "Failed to fetch custom domain" },
      { status: 500 }
    );
  }
}
