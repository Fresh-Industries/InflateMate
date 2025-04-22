import { WebhookEvent } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET || '';

async function verifyWebhook(req: Request): Promise<WebhookEvent> {
  // Get the raw payload as a string
  const payloadString = await req.text();
  const headerPayload = await headers();
  const svixHeaders = {
    'svix-id': headerPayload.get('svix-id')!,
    'svix-timestamp': headerPayload.get('svix-timestamp')!,
    'svix-signature': headerPayload.get('svix-signature')!,
  };
  

  const wh = new Webhook(webhookSecret);
  // Verify the payload. If verification fails, this will throw.
  return wh.verify(payloadString, svixHeaders) as WebhookEvent;
}

export async function POST(req: Request) {
  try {
    console.log("Webhook received, attempting verification...");
    // First, verify the webhook and get the event object.
    const event = await verifyWebhook(req);
    console.log("Webhook verified successfully:", event.type);
    // For user.created events
    if (event.type === 'user.created') {
      // Extract relevant data from Clerk's event payload
      // Clerk's user structure typically looks different from your schema
      const userData = event.data;
      
      // Extract user information from Clerk's data structure
      const email = userData.email_addresses?.[0]?.email_address;
      const firstName = userData.first_name || '';
      const lastName = userData.last_name || '';
      const name = firstName + (lastName ? ` ${lastName}` : '');
      const clerkUserId = userData.id;
      const image = userData.image_url;

      // Validate the extracted data
      if (!email || !clerkUserId) {
        return NextResponse.json(
          { message: "Missing required user data" },
          { status: 400 }
        );
      }

      // Check if user already exists by email
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        console.log(`User with email ${email} already exists`);
        return NextResponse.json(
          { message: "User already exists" },
          { status: 200 } // Using 200 instead of 400 since this isn't an error case for webhooks
        );
      }

      // Create the user in your database
      await prisma.user.create({
        data: {
          name,
          email,
          clerkUserId,
          image,
        },
      });

      console.log(`User created with email ${email} and clerk ID ${clerkUserId}`);
      return NextResponse.json(
        { message: "User created successfully" },
        { status: 201 }
      );
    }
    return NextResponse.json({ message: 'Received' })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("[WEBHOOK_ERROR]", error);
    // Log more details about the request
  
    return NextResponse.json(
      { message: "Webhook processing failed", error: error.message },
      { status: 500 }
    );
  }
}
