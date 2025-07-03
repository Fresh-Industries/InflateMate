import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserWithOrgAndBusiness, getMembershipByBusinessId } from "@/lib/auth/clerk-utils";
import { prisma } from "@/lib/prisma";

// PUT /api/businesses/[businessId]/embed-config
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
  const membership = getMembershipByBusinessId(user, businessId);
  if (!membership) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { embedConfig } = body;

    if (!embedConfig) {
      return NextResponse.json(
        { error: "Embed configuration is required" },
        { status: 400 }
      );
    }

    // Update the business with the new embed configuration
    const updatedBusiness = await prisma.business.update({
      where: {
        id: businessId,
      },
      data: {
        embedConfig,
      },
    });

    return NextResponse.json({ 
      success: true, 
      embedConfig: updatedBusiness.embedConfig 
    });
  } catch (error) {
    console.error("Error updating embed configuration:", error);
    return NextResponse.json(
      { error: "Failed to update embed configuration" },
      { status: 500 }
    );
  }
}

// GET /api/businesses/[businessId]/embed-config
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
  const membership = getMembershipByBusinessId(user, businessId);
  if (!membership) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  try {
    const business = await prisma.business.findUnique({
      where: { id: businessId },
      select: { embedConfig: true },
    });

    if (!business) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 });
    }

    return NextResponse.json({
      embedConfig: business.embedConfig || {},
    });
  } catch (error) {
    console.error("Error fetching embed configuration:", error);
    return NextResponse.json(
      { error: "Failed to fetch embed configuration" },
      { status: 500 }
    );
  }
} 