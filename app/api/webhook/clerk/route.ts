import { WebhookEvent } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
if (!webhookSecret) {
  throw new Error('CLERK_WEBHOOK_SECRET is not configured');
}

async function verifyWebhook(req: Request): Promise<WebhookEvent> {
  const payloadString = await req.text();
  const headerPayload = await headers();
  
  const svixId = headerPayload.get('svix-id');
  const svixTimestamp = headerPayload.get('svix-timestamp');
  const svixSignature = headerPayload.get('svix-signature');

  if (!svixId || !svixTimestamp || !svixSignature) {
    throw new Error('Missing required Svix headers');
  }

  const svixHeaders = {
    'svix-id': svixId,
    'svix-timestamp': svixTimestamp,
    'svix-signature': svixSignature,
  };

  const wh = new Webhook(webhookSecret as string);
  return wh.verify(payloadString, svixHeaders) as WebhookEvent;
}

export async function POST(req: Request) {
  try {
    console.log("Webhook received, attempting verification...");
    const event = await verifyWebhook(req);
    console.log("Webhook verified successfully:", event.type);

    // Handle user.created
    if (event.type === 'user.created') {
      const userData = event.data;
      const email = userData.email_addresses?.[0]?.email_address;
      const firstName = userData.first_name || '';
      const lastName = userData.last_name || '';
      const name = firstName + (lastName ? ` ${lastName}` : '');
      const clerkUserId = userData.id;
      const image = userData.image_url;

      if (!email || !clerkUserId) {
        return NextResponse.json(
          { success: false, message: "Missing required user data" },
          { status: 400 }
        );
      }

      // Use transaction for user creation
      const result = await prisma.$transaction(async (tx) => {
        // Idempotency: check if user already exists
        const existingUser = await tx.user.findUnique({ where: { clerkUserId } });
        if (existingUser) {
          console.log(`User with Clerk ID ${clerkUserId} already exists`);
          return { success: true, message: "User already exists", status: 200 };
        }

        const newUser = await tx.user.create({
          data: { name, email, clerkUserId, image },
        });

        console.log(`User created with email ${email} and clerk ID ${clerkUserId}`);
        return { 
          success: true, 
          message: "User created successfully", 
          data: { userId: newUser.id },
          status: 201 
        };
      });

      return NextResponse.json(
        { success: result.success, message: result.message, data: result.data },
        { status: result.status }
      );
    }

    // Handle organizationMembership.created
    else if (event.type === 'organizationMembership.created') {
      const { id: clerkMembershipId, organization, public_user_data, role } = event.data;
      const clerkOrgId = organization.id;
      const clerkUserId = public_user_data?.user_id;

      if (!clerkMembershipId || !clerkOrgId || !clerkUserId || !role) {
        console.error('Missing data for organization membership creation:', { clerkMembershipId, clerkOrgId, clerkUserId, role });
        return NextResponse.json({ success: false, message: 'Missing required membership data' }, { status: 400 });
      }

      // Use transaction for membership creation
      const result = await prisma.$transaction(async (tx) => {
        // Find the user and organization in your database
        const user = await tx.user.findUnique({ where: { clerkUserId } });
        if (!user) {
          console.error(`User not found with clerkUserId: ${clerkUserId}`);
          return { success: false, message: `User not found: ${clerkUserId}`, status: 404 };
        }

        const org = await tx.organization.findUnique({ where: { clerkOrgId } });
        if (!org) {
          console.error(`Organization not found with clerkOrgId: ${clerkOrgId}`);
          return { success: false, message: `Organization not found: ${clerkOrgId}`, status: 404 };
        }

        // Map Clerk role to Prisma Role
        const mapClerkRoleToPrismaRoleString = (clerkRole: string): 'ADMIN' | 'MEMBER' => {
          if (clerkRole === 'org:admin') return 'ADMIN';
          return 'MEMBER';
        };
        const prismaRoleString = mapClerkRoleToPrismaRoleString(role);

        // Idempotency: check if membership already exists
        const existingMembership = await tx.membership.findFirst({
          where: {
            userId: user.id,
            organizationId: org.id,
          },
        });

        if (existingMembership) {
          // Update if role or membership ID changed
          if (existingMembership.role !== prismaRoleString || existingMembership.clerkMembershipId !== clerkMembershipId) {
            const updatedMembership = await tx.membership.update({
              where: { id: existingMembership.id },
              data: { role: prismaRoleString, clerkMembershipId },
            });
            console.log(`Updated role for user ${user.id} in organization ${org.id} to ${prismaRoleString}`);
            return { 
              success: true, 
              message: 'Membership updated successfully',
              data: { membershipId: updatedMembership.id },
              status: 200 
            };
          }
          return { success: true, message: 'Membership already exists', status: 200 };
        }

        // Create new membership
        const newMembership = await tx.membership.create({
          data: {
            userId: user.id,
            organizationId: org.id,
            clerkMembershipId,
            role: prismaRoleString,
          },
        });

        console.log(`Membership created for user ${user.id} in organization ${org.id} with role ${prismaRoleString}`);
        return { 
          success: true, 
          message: 'Membership created successfully',
          data: { membershipId: newMembership.id },
          status: 201 
        };
      });

      return NextResponse.json(
        { success: result.success, message: result.message, data: result.data },
        { status: result.status }
      );
    }

    // Handle other event types
    console.log(`Received unhandled event type: ${event.type}`);
    return NextResponse.json({ success: true, message: 'Received unhandled event type' }, { status: 200 });

  } catch (error) {
    console.error("[WEBHOOK_ERROR]", error);
    return NextResponse.json(
      { success: false, message: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
