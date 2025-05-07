import { WebhookEvent } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET || '';

async function verifyWebhook(req: Request): Promise<WebhookEvent> {
  const payloadString = await req.text();
  const headerPayload = await headers();
  const svixHeaders = {
    'svix-id': headerPayload.get('svix-id')!,
    'svix-timestamp': headerPayload.get('svix-timestamp')!,
    'svix-signature': headerPayload.get('svix-signature')!,
  };
  const wh = new Webhook(webhookSecret);
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
          { message: "Missing required user data" },
          { status: 400 }
        );
      }

      // Idempotency: check if user already exists
      const existingUser = await prisma.user.findUnique({ where: { clerkUserId } });
      if (existingUser) {
        console.log(`User with Clerk ID ${clerkUserId} already exists`);
        return NextResponse.json({ message: "User already exists" }, { status: 200 });
      }

      await prisma.user.create({
        data: { name, email, clerkUserId, image },
      });

      console.log(`User created with email ${email} and clerk ID ${clerkUserId}`);
      return NextResponse.json({ message: "User created successfully" }, { status: 201 });
    }

    // Handle organizationMembership.created
    else if (event.type === 'organizationMembership.created') {
      const { id: clerkMembershipId, organization, public_user_data, role } = event.data;
      const clerkOrgId = organization.id;
      const clerkUserId = public_user_data?.user_id;

      if (!clerkMembershipId || !clerkOrgId || !clerkUserId || !role) {
        console.error('Missing data for organization membership creation:', { clerkMembershipId, clerkOrgId, clerkUserId, role });
        return NextResponse.json({ message: 'Missing required membership data' }, { status: 400 });
      }

      // Find the user and organization in your database
      const user = await prisma.user.findUnique({ where: { clerkUserId } });
      if (!user) {
        console.error(`User not found with clerkUserId: ${clerkUserId}`);
        return NextResponse.json({ message: `User not found: ${clerkUserId}` }, { status: 404 });
      }

      const org = await prisma.organization.findUnique({ where: { clerkOrgId } });
      if (!org) {
        console.error(`Organization not found with clerkOrgId: ${clerkOrgId}`);
        return NextResponse.json({ message: `Organization not found: ${clerkOrgId}` }, { status: 404 });
      }

      // Idempotency: check if membership already exists
      const existingMembership = await prisma.membership.findFirst({
        where: {
          userId: user.id,
          organizationId: org.id,
        },
      });

      // Map Clerk role string to your Prisma Role enum string values
      const mapClerkRoleToPrismaRoleString = (clerkRole: string): 'ADMIN' | 'MEMBER' => {
        if (clerkRole === 'org:admin') return 'ADMIN';
        return 'MEMBER';
      };
      const prismaRoleString = mapClerkRoleToPrismaRoleString(role);

      if (existingMembership) {
        // Optionally update the role if it has changed
        if (existingMembership.role !== prismaRoleString || existingMembership.clerkMembershipId !== clerkMembershipId) {
          await prisma.membership.update({
            where: { id: existingMembership.id },
            data: { role: prismaRoleString, clerkMembershipId },
          });
          console.log(`Updated role for user ${user.id} in organization ${org.id} to ${prismaRoleString}`);
        }
        return NextResponse.json({ message: 'Membership already exists or updated' }, { status: 200 });
      }

      // Create the membership record
      await prisma.membership.create({
        data: {
          userId: user.id,
          organizationId: org.id,
          clerkMembershipId,
          role: prismaRoleString,
        },
      });

      console.log(`Membership created for user ${user.id} in organization ${org.id} with role ${prismaRoleString}`);
      return NextResponse.json({ message: 'Membership created successfully' }, { status: 201 });
    }

    // Handle other event types or return a default response
    else {
      console.log(`Received unhandled event type: ${event.type}`);
      return NextResponse.json({ message: 'Received unhandled event type' }, { status: 200 });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("[WEBHOOK_ERROR]", error);
    return NextResponse.json(
      { message: "Webhook processing failed", error: error.message },
      { status: 500 }
    );
  }
}
