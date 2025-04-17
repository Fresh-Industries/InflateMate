import { Resend } from 'resend';
import type { CreateEmailResponse } from 'resend';

const RESEND_API_KEY = process.env.RESEND_API_KEY;

if (!RESEND_API_KEY) {
  // Throw an error during module initialization if the key is missing
  throw new Error("Missing RESEND_API_KEY environment variable.");
}

const resend = new Resend(RESEND_API_KEY);

interface EmailParams {
  to: string;
  subject: string;
  html: string;
  from: string;
}

export async function sendSignatureEmail({ to, subject, html  }: EmailParams): Promise<CreateEmailResponse | undefined> {
  try {
    return await resend.emails.send({
      from: 'InflateMate <onboarding@resend.dev>',
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error("Error sending email via Resend:", error);
    // Re-throw the error or handle it as appropriate for your application
    throw error;
  }
}

interface CouponEmailParams {
  to: string;
  subject: string;
  couponCode: string;
  businessName: string; // Add business name for personalization
  htmlContent?: string; // Optional custom HTML content
  from: string;
}

// Function specifically for sending coupon emails
export async function sendCouponEmail({ to, subject, couponCode, businessName, htmlContent }: CouponEmailParams): Promise<CreateEmailResponse | undefined> {
  const defaultHtml = `
    <div>
      <h1>Here\'s your discount from ${businessName}!</h1>
      <p>Thank you for your interest. Use the coupon code below for your discount:</p>
      <p style="font-size: 24px; font-weight: bold; color: #007bff;">${couponCode}</p>
      <p>We look forward to serving you!</p>
    </div>
  `;

  const finalHtml = htmlContent || defaultHtml;

  try {
    return await resend.emails.send({
      from: 'InflateMate <onboarding@resend.dev>',
      to,
      subject,
      html: finalHtml,
    });
  } catch (error) {
    console.error("Error sending coupon email via Resend:", error);
    throw error; // Re-throw to be handled by the caller
  }
}
