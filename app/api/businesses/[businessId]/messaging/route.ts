import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/clerk-utils";
import { prisma } from "@/lib/prisma";
import { Twilio } from "twilio";

// POST route remains unchanged for sending messages
export async function POST(request: NextRequest, { params }: { params: { businessId: string } }) {
  const { businessId } = params;
  const { phone, message } = await request.json();
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const business = await prisma.business.findUnique({
    where: { id: businessId },
  });

  if (!business) {
    return NextResponse.json({ error: "Business not found" }, { status: 404 });
  }

  const twilio = new Twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN,
    { accountSid: business.twilioSubAccountSid || "" }
  );

  const text = await twilio.messages.create({
    body: message,
    from: business.phone || "",
    to: phone,
  });

  return NextResponse.json({ text }, { status: 200 });
}

// GET route to retrieve messages exchanged with a specific phone number
export async function GET(request: NextRequest, { params }: { params: { businessId: string } }) {
  const { businessId } = params;
  
  // Use URL query parameters to get the customer's phone number
  const { searchParams } = new URL(request.url);
  const phone = searchParams.get("phone");
  
  if (!phone) {
    return NextResponse.json({ error: "Missing phone query parameter" }, { status: 400 });
  }

  const business = await prisma.business.findUnique({
    where: { id: businessId },
  });
  
  if (!business) {
    return NextResponse.json({ error: "Business not found" }, { status: 404 });
  }

  const twilio = new Twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN,
    { accountSid: business.twilioSubAccountSid || "" }
  );

  try {
    // Retrieve messages sent from the business to the customer
    const outgoingMessages = await twilio.messages.list({
      from: business.phone || "",
      to: phone,
      limit: 50,
    });

    // Retrieve messages sent from the customer to the business
    const incomingMessages = await twilio.messages.list({
      from: phone,
      to: business.phone || "",
      limit: 50,
    });

    // Combine both arrays and sort chronologically
    const messages = [...incomingMessages, ...outgoingMessages].sort(
      (a, b) => new Date(a.dateSent).getTime() - new Date(b.dateSent).getTime()
    );

    return NextResponse.json({ messages }, { status: 200 });
  } catch (error) {
    console.error("Error retrieving messages:", error);
    return NextResponse.json({ error: "Failed to retrieve messages" }, { status: 500 });
  }
}
