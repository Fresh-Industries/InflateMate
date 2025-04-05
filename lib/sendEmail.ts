// utils/sendEmail.ts
import { Resend } from 'resend';

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
}

export async function sendSignatureEmail({ to, subject, html }: EmailParams): Promise<any> {
  try {
    return await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
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
