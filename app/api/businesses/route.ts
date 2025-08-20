import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserWithOrgAndBusiness, getPrimaryMembership } from "@/lib/auth/clerk-utils";
import { createBusinessForOrg, getBusinessByOrganizationId } from "@/features/business/business.service";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUserWithOrgAndBusiness();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const membership = getPrimaryMembership(user);
    const org = membership?.organization;
    if (!org) return NextResponse.json({ error: "User is not a member of any organization" }, { status: 400 });

    if (org.business) return NextResponse.json({ error: "This organization already has a business" }, { status: 400 });

    const body = await req.json();
    const business = await createBusinessForOrg(org.id, body);
    return NextResponse.json(business, { status: 201 });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    // Zod errors surface from the service; return first issue if present
    if (err?.issues?.[0]?.message) return NextResponse.json({ error: err.issues[0].message }, { status: 400 });
    console.error("[BUSINESS_CREATE_ERROR]", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const user = await getCurrentUserWithOrgAndBusiness();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const membership = getPrimaryMembership(user);
    const org = membership?.organization;
    if (!org) return NextResponse.json({ error: "User is not a member of any organization" }, { status: 400 });

    const business = await getBusinessByOrganizationId(org.id);
    if (!business) return NextResponse.json({ error: "No business found for this organization" }, { status: 404 });

    return NextResponse.json(business);
  } catch (err) {
    console.error("[BUSINESS_GET_ORG_ERROR]", err);
    return NextResponse.json({ error: "Failed to fetch business" }, { status: 500 });
  }
}
