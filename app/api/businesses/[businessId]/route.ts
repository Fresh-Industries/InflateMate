import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserWithOrgAndBusiness, getMembershipByBusinessId } from "@/lib/auth/clerk-utils";
import {
  getPublicBusinessByIdCached,
  getPrivateBusinessByIdCached,
  updateBusinessFromFormData,
} from "@/features/business/business.service";

type Params = { params: Promise<{ businessId: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { businessId } = await params;
    const user = await getCurrentUserWithOrgAndBusiness();

    // Public
    if (!user) {
      const business = await getPublicBusinessByIdCached(businessId);
      if (!business) return NextResponse.json({ error: "Business not found" }, { status: 404 });
      return NextResponse.json(business);
    }

    // Private (authz)
    const membership = getMembershipByBusinessId(user, businessId);
    if (!membership) return NextResponse.json({ error: "Access denied" }, { status: 403 });

    const business = await getPrivateBusinessByIdCached(businessId);
    if (!business) return NextResponse.json({ error: "Business not found" }, { status: 404 });

    return NextResponse.json({
      ...business,
      stripeConnectedAccountId: business.stripeAccountId,
    });
  } catch (err) {
    console.error("[BUSINESS_GET_ID_ERROR]", err);
    return NextResponse.json({ error: "Failed to fetch business" }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const { businessId } = await params;

    const user = await getCurrentUserWithOrgAndBusiness();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const membership = getMembershipByBusinessId(user, businessId);
    if (!membership) return NextResponse.json({ error: "Access denied" }, { status: 403 });

    const formData = await req.formData();
    const override = formData.get("_method")?.toString().toUpperCase();

    if (override === "PATCH") {
      const updated = await updateBusinessFromFormData(businessId, formData);
      return NextResponse.json({ message: "Business updated successfully", business: updated });
    }

    return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    if (err?.issues?.[0]?.message) return NextResponse.json({ error: err.issues[0].message }, { status: 400 });
    console.error("[BUSINESS_POST_ERROR]", err);
    return NextResponse.json({ error: "Failed to update business" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const { businessId } = await params;

    const user = await getCurrentUserWithOrgAndBusiness();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const membership = getMembershipByBusinessId(user, businessId);
    if (!membership) return NextResponse.json({ error: "Access denied" }, { status: 403 });

    const formData = await req.formData();
    const updated = await updateBusinessFromFormData(businessId, formData);

    return NextResponse.json({ message: "Business updated successfully", business: updated });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    if (err?.issues?.[0]?.message) return NextResponse.json({ error: err.issues[0].message }, { status: 400 });
    console.error("[BUSINESS_PATCH_ERROR]", err);
    return NextResponse.json({ error: "Failed to update business" }, { status: 500 });
  }
}
