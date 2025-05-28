import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserWithOrgAndBusiness, getMembershipByBusinessId } from "@/lib/auth/clerk-utils";
import { unstable_cache, revalidateTag } from "next/cache";
import { Prisma } from "@prisma/client";

// Cached business data fetcher
const getCachedBusiness = unstable_cache(
  async (businessId: string, isPublic: boolean) => {
    const select = isPublic ? ({
      id: true,
      name: true,
      stripeAccountId: true,
      inventory: true,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as Prisma.Payload<any, any>) : ({
      id: true,
      name: true,
      description: true,
      address: true,
      city: true,
      state: true,
      zipCode: true,
      phone: true,
      email: true,
      logo: true,
      minAdvanceBooking: true,
      maxAdvanceBooking: true,
      minimumPurchase: true,
      timeZone: true,
      stripeAccountId: true,
      socialMedia: true,
      customDomain: true,
      subdomain: true,
      siteConfig: true,
      inventory: true,
      customers: true,
      bookings: {
        where: {
          eventDate: {
            gte: new Date(),
          },
        },
        take: 5,
        orderBy: {
          eventDate: 'asc',
        },
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as Prisma.Payload<any, any>);

    return prisma.business.findUnique({
      where: { id: businessId },
      select,
    });
  },
  ['business-data'],
  {
    revalidate: 60 * 60 * 24, // 24 hours
    tags: ['business-data'],
  }
);

// Shared business update logic
async function updateBusinessFromFormData(formData: FormData, businessId: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateData: Record<string, any> = {};

  // Text fields
  const textFields = [
    'name', 'description', 'email', 'phone',
    'address', 'city', 'state', 'zipCode', 'logo'
  ];

  textFields.forEach(field => {
    const value = formData.get(field);
    if (value !== null) {
      updateData[field] = value.toString();
    }
  });

  // Number fields
  const numberFields = [
    'minAdvanceBooking', 'maxAdvanceBooking',
    'minimumPurchase', 'depositPercentage', 'taxRate'
  ];

  numberFields.forEach(field => {
    const value = formData.get(field);
    if (value !== null && value !== '') {
      updateData[field] = parseFloat(value.toString());
    }
  });

  // Handle service areas (array field)
  const serviceAreas: string[] = [];
  formData.forEach((value, key) => {
    if (key.startsWith('serviceArea[') && key.endsWith(']')) {
      serviceAreas.push(value.toString());
    }
  });

  if (serviceAreas.length > 0) {
    updateData.serviceArea = serviceAreas;
  }

  // Handle socialMedia (JSON field)
  const socialMediaStr = formData.get('socialMedia');
  if (socialMediaStr) {
    try {
      updateData.socialMedia = JSON.parse(socialMediaStr.toString());
    } catch (error) {
      console.error("Error parsing socialMedia JSON:", error);
    }
  }

  // Update the business
  const updatedBusiness = await prisma.business.update({
    where: { id: businessId },
    data: updateData,
  });

  // Revalidate cache
  revalidateTag('business-data');

  return updatedBusiness;
}

// GET /api/businesses/[businessId]
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ businessId: string }> }
) {
  try {
    const businessId = (await params).businessId;
    const user = await getCurrentUserWithOrgAndBusiness();

    // If user is not authenticated, treat as a public request
    if (!user) {
      const business = await getCachedBusiness(businessId, true);

      if (!business) {
        return NextResponse.json(
          { error: "Business not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(business);
    }

    // Authenticated request logic: check access
    const membership = getMembershipByBusinessId(user, businessId);
    if (!membership) {
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      );
    }

    const business = await getCachedBusiness(businessId, false);

    if (!business) {
      return NextResponse.json(
        { error: "Business not found" },
        { status: 404 }
      );
    }

    const responseData = {
      ...business,
      stripeConnectedAccountId: business.stripeAccountId
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error fetching business:", error);
    return NextResponse.json(
      { error: "Failed to fetch business" },
      { status: 500 }
    );
  }
}

// PATCH /api/businesses/[businessId]
export async function PATCH(
  req: NextRequest,
  props: { params: Promise<{ businessId: string }> }
) {
  const params = await props.params;
  try {
    const user = await getCurrentUserWithOrgAndBusiness();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const businessId = params.businessId;
    const membership = getMembershipByBusinessId(user, businessId);
    if (!membership) {
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      );
    }

    const formData = await req.formData();
    const updatedBusiness = await updateBusinessFromFormData(formData, businessId);

    return NextResponse.json({
      message: "Business updated successfully",
      business: updatedBusiness,
    });
  } catch (error) {
    console.error("Error updating business:", error);
    return NextResponse.json(
      { error: "Failed to update business" },
      { status: 500 }
    );
  }
}

// POST /api/businesses/[businessId]
export async function POST(
  req: NextRequest,
  props: { params: Promise<{ businessId: string }> }
) {
  const params = await props.params;
  try {
    const formData = await req.formData();
    const methodOverride = formData.get('_method')?.toString();

    if (methodOverride === 'PATCH') {
      // Auth check
      const user = await getCurrentUserWithOrgAndBusiness();
      if (!user) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        );
      }
      const businessId = params.businessId;
      const membership = getMembershipByBusinessId(user, businessId);
      if (!membership) {
        return NextResponse.json(
          { error: "Access denied" },
          { status: 403 }
        );
      }
      const updatedBusiness = await updateBusinessFromFormData(formData, businessId);
      return NextResponse.json({
        message: "Business updated successfully",
        business: updatedBusiness,
      });
    }

    return NextResponse.json(
      { error: "Method not implemented" },
      { status: 501 }
    );
  } catch (error) {
    console.error("Error in POST handler:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
