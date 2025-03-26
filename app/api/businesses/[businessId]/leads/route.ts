import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/clerk-utils";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const leadSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  message: z.string().optional(),
  source: z.string().default("popup"),
  funnelId: z.string().optional(),
});

// POST /api/businesses/[businessId]/leads
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ businessId: string }> }
) {
  try {
    const businessId = (await params).businessId;
    const body = await req.json();
    
    // Validate the request body
    const validatedData = leadSchema.parse(body);
    
    // Find the business
    const business = await prisma.business.findUnique({
      where: { id: businessId },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
    
    if (!business) {
      return NextResponse.json(
        { error: "Business not found" },
        { status: 404 }
      );
    }
    
    let couponCode: string | null = null;
    
    // If a funnel ID is provided, get the associated coupon
    if (validatedData.funnelId) {
      const funnel = await prisma.salesFunnel.findUnique({
        where: {
          id: validatedData.funnelId,
          businessId: business.id,
        },
        include: {
          business: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      });
      
      if (!funnel) {
        return NextResponse.json(
          { error: "Sales funnel not found" },
          { status: 404 }
        );
      }
      
      // If the funnel has a coupon, get the coupon code
      if (funnel.couponId) {
        const coupon = await prisma.coupon.findUnique({
          where: {
            id: funnel.couponId,
            businessId: business.id,
          },
        });
        
        if (coupon && coupon.isActive) {
          couponCode = coupon.code;
          
          // Increment the coupon usage count
          await prisma.coupon.update({
            where: {
              id: coupon.id,
            },
            data: {
              usedCount: {
                increment: 1,
              },
            },
          });
        }
      }
    }
    
    // Create the lead
    const lead = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        isLead: true,
        businessId: business.id,
      },
    });
    
    // Send email to the customer with the coupon code
    if (couponCode) {
      try {
        await resend.emails.send({
          from: "noreply@inflatemate.com",
          to: validatedData.email,
          subject: `Your Discount Code from ${business.name}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>Thank you for your interest in ${business.name}!</h2>
              <p>We're excited to offer you a special discount on your next booking.</p>
              <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; text-align: center; margin: 20px 0;">
                <h3 style="margin-top: 0;">Your Discount Code</h3>
                <p style="font-size: 24px; font-weight: bold; color: #4a6cf7;">${couponCode}</p>
                <p>Use this code during checkout to redeem your discount.</p>
              </div>
              <p>If you have any questions, please don't hesitate to contact us.</p>
              <p>Best regards,<br>${business.name} Team</p>
            </div>
          `,
        });
      } catch (error) {
        console.error("Error sending email:", error);
        // We don't want to fail the request if the email fails
      }
    }
    
    // Send notification to the business owner
    if (business.email) {
      try {
        await resend.emails.send({
          from: "noreply@inflatemate.com",
          to: business.email,
          subject: "New Lead from Your Website",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>New Lead Notification</h2>
              <p>You have received a new lead from your website:</p>
              <ul>
                <li><strong>Name:</strong> ${validatedData.name}</li>
                <li><strong>Email:</strong> ${validatedData.email}</li>
                ${validatedData.phone ? `<li><strong>Phone:</strong> ${validatedData.phone}</li>` : ''}
                ${validatedData.message ? `<li><strong>Message:</strong> ${validatedData.message}</li>` : ''}
                <li><strong>Source:</strong> ${validatedData.source}</li>
                ${couponCode ? `<li><strong>Coupon Code:</strong> ${couponCode}</li>` : ''}
              </ul>
              <p>You can view and manage all your leads in your InflateMate dashboard.</p>
            </div>
          `,
        });
      } catch (error) {
        console.error("Error sending notification email:", error);
        // We don't want to fail the request if the email fails
      }
    }
    
    return NextResponse.json({
      success: true,
      lead,
      couponCode,
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating lead:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to create lead" },
      { status: 500 }
    );
  }
}

// GET /api/businesses/[businessId]/leads
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ businessId: string }> }
) {
  try {
    const businessId = (await params).businessId;
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Check if the user has access to this business
    const business = await prisma.business.findFirst({
      where: {
        id: businessId,
        userId: user.id,
      },
    });
    
    if (!business) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }
    
    // Get query parameters
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;
    
    // Get leads
    const leads = await prisma.user.findMany({
      where: {
        businessId,
        isLead: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    });
    
    // Get total count
    const totalCount = await prisma.user.count({
      where: {
        businessId,
        isLead: true,
      },
    });
    
    return NextResponse.json({
      leads,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching leads:", error);
    return NextResponse.json(
      { error: "Failed to fetch leads" },
      { status: 500 }
    );
  }
} 