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
    console.log("Fetching business data for businessId:", businessId, "userId:", userId);

    // If userId is null, treat as a public request
    if (!userId) {
      console.log("Public request detected");
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

    // Log details about the business data, especially Stripe info
    console.log("Business found with ID:", business.id);
    console.log("Business data fields:", Object.keys(business));
    
    // The field in the database is stripeAccountId, but the frontend expects stripeConnectedAccountId
    console.log("stripeAccountId in database:", business.stripeAccountId);
    
    // Modify the response to ensure the correct field is present
    const responseData = {
      ...business,
      // Map stripeAccountId to stripeConnectedAccountId for frontend compatibility
      stripeConnectedAccountId: business.stripeAccountId
    };

    console.log("Returning business data with stripeConnectedAccountId:", 
                responseData.stripeConnectedAccountId ? "present" : "missing");
    
    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error fetching business:", error);
    return NextResponse.json(
      { error: "Failed to fetch business" },
      { status: 500 }
    );
  }
}

// Original PATCH handler - now replaced by patchWithFormData
// export async function PATCH(
//   req: NextRequest,
//   { params }: { params: Promise<{ businessId: string }> }
// ) {
//   try {
//     const businessId = (await params).businessId;
//     const { userId } = await auth();
//     
//     if (!userId) {
//       return NextResponse.json(
//         { error: "Unauthorized" },
//         { status: 401 }
//       );
//     }
// 
//     // Parse form data
//     const formData = await req.formData();
//     
//     // Extract business data from form
//     const updateData: Record<string, any> = {};
//     
//     // Text fields
//     const textFields = [
//       'name', 'description', 'email', 'phone', 
//       'address', 'city', 'state', 'zipCode'
//     ];
//     
//     textFields.forEach(field => {
//       const value = formData.get(field);
//       if (value !== null) {
//         updateData[field] = value.toString();
//       }
//     });
//     
//     // Number fields
//     const numberFields = [
//       'minAdvanceBooking', 'maxAdvanceBooking', 
//       'minimumPurchase', 'depositPercentage', 'taxRate'
//     ];
//     
//     numberFields.forEach(field => {
//       const value = formData.get(field);
//       if (value !== null && value !== '') {
//         updateData[field] = parseFloat(value.toString());
//       }
//     });
//     
//     // Find the business by ID and verify ownership
//     const business = await prisma.business.findFirst({
//       where: {
//         id: businessId,
//         user: {
//           clerkUserId: userId,
//         },
//       },
//     });
// 
//     if (!business) {
//       return NextResponse.json(
//         { error: "Business not found or you don't have access" },
//         { status: 404 }
//       );
//     }
//     
//     // Update the business
//     const updatedBusiness = await prisma.business.update({
//       where: { id: businessId },
//       data: updateData,
//     });
// 
//     return NextResponse.json({
//       message: "Business updated successfully",
//       business: updatedBusiness,
//     });
//   } catch (error) {
//     console.error("Error updating business:", error);
//     return NextResponse.json(
//       { error: "Failed to update business" },
//       { status: 500 }
//     );
//   }
// }

// For direct PATCH requests (if needed), we can still support them by parsing the formData
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ businessId: string }> }
) {
  try {
    const formData = await req.formData();
    return patchWithFormData(formData, { params });
  } catch (error) {
    console.error("Error in PATCH handler:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}

// Handle form submissions with method override (_method=PATCH)
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ businessId: string }> }
) {
  try {
    const formData = await req.formData();
    const methodOverride = formData.get('_method')?.toString();
    
    if (methodOverride === 'PATCH') {
      // Call a modified PATCH handler that accepts the formData
      return patchWithFormData(formData, { params });
    }
    
    // Handle actual POST requests here if needed
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
        // Log the logo URL if it's being updated
        if (field === 'logo') {
          console.log(`Updating business logo: ${value.toString()}`);
        }
      }
    });
    
    // Log all fields being updated
    console.log('Fields being updated:', Object.keys(updateData));
    
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
