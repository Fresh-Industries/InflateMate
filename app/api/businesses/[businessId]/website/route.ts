import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserWithOrgAndBusiness, getMembershipByBusinessId } from "@/lib/auth/clerk-utils";
import { prisma } from "@/lib/prisma";

// PUT /api/businesses/[businessId]/website
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
    const { siteConfig, embedConfig } = body;

    if (!siteConfig) {
      return NextResponse.json(
        { error: "Site configuration is required" },
        { status: 400 }
      );
    }

    // Prepare update data
    const updateData = {
      siteConfig,
      ...(embedConfig !== undefined && { embedConfig }),
    };

    // Update the business with the new site configuration
    const updatedBusiness = await prisma.business.update({
      where: {
        id: businessId,
      },
      data: updateData,
    });

    return NextResponse.json(updatedBusiness);
  } catch (error) {
    console.error("Error updating website configuration:", error);
    return NextResponse.json(
      { error: "Failed to update website configuration" },
      { status: 500 }
    );
  }
}

// GET /api/businesses/[businessId]/website
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
      select: { siteConfig: true, customDomain: true, embedConfig: true },
    });

    if (!business) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 });
    }

    return NextResponse.json({
      siteConfig: business.siteConfig || {},
      customDomain: business.customDomain,
      embedConfig: business.embedConfig || {},
    });
  } catch (error) {
    console.error("Error fetching website configuration:", error);
    return NextResponse.json(
      { error: "Failed to fetch website configuration" },
      { status: 500 }
    );
  }
}
