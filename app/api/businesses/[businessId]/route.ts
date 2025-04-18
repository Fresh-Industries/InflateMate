// app/api/businesses/[businessId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ businessId: string }> }
) {
  try {
    const businessId = (await params).businessId;
    const { userId } = await auth();

    // If userId is null, treat as a public request
    if (!userId) {
      const business = await prisma.business.findUnique({
        where: { id: businessId },
        select: {
          id: true,
          name: true,
          stripeAccountId: true,
          inventory: true,
        },
      });

      if (!business) {
        return NextResponse.json(
          { error: "Business not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(business);
    }

    // Authenticated request logic
    const business = await prisma.business.findFirst({
      where: {
        id: businessId,
        user: {
          clerkUserId: userId,
        },
      },
      include: {
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
      },
    });

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


export async function PATCH(req: NextRequest, props: { params: Promise<{ businessId: string }> }) {
  const params = await props.params;
  try {
    const formData = await req.formData();
    return patchWithFormData(formData, { params: Promise.resolve(params) });
  } catch (error) {
    console.error("Error in PATCH handler:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest, props: { params: Promise<{ businessId: string }> }) {
  const params = await props.params;
  try {
    const formData = await req.formData();
    const methodOverride = formData.get('_method')?.toString();
    
    if (methodOverride === 'PATCH') {
      return patchWithFormData(formData, { params: Promise.resolve(params) });
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

// Modified PATCH function that accepts formData directly
async function patchWithFormData(
  formData: FormData,
  { params }: { params: Promise<{ businessId: string }> }
) {
  try {
    const businessId = (await params).businessId;
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Extract business data from form
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
    
    // Find the business by ID and verify ownership
    const business = await prisma.business.findFirst({
      where: {
        id: businessId,
        user: {
          clerkUserId: userId,
        },
      },
    });

    if (!business) {
      return NextResponse.json(
        { error: "Business not found or you don't have access" },
        { status: 404 }
      );
    }
    
    // Update the business
    const updatedBusiness = await prisma.business.update({
      where: { id: businessId },
      data: updateData,
    });

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
