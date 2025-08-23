import { NextResponse } from "next/server";
import { sendSignatureEmail } from "@/lib/sendEmail";

export async function POST(req: Request) {
  try {
    const { name, email, company, subject, message } = await req.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const html = `
      <div style="font-family:Inter,system-ui,Arial,sans-serif;line-height:1.5;font-size:14px;color:#0B1220;">
        <h2 style="margin:0 0 8px;">New Contact Message</h2>
        <p style="margin:0 0 12px;color:#64748B;">From your website contact form</p>
        <table style="border-collapse:collapse;width:100%;max-width:640px;">
          <tbody>
            <tr><td style="padding:6px 0;width:120px;color:#475569;">Name</td><td>${escapeHtml(name)}</td></tr>
            <tr><td style="padding:6px 0;width:120px;color:#475569;">Email</td><td>${escapeHtml(email)}</td></tr>
            ${company ? `<tr><td style=\"padding:6px 0;width:120px;color:#475569;\">Company</td><td>${escapeHtml(company)}</td></tr>` : ""}
            <tr><td style="padding:6px 0;width:120px;color:#475569;">Subject</td><td>${escapeHtml(subject)}</td></tr>
          </tbody>
        </table>
        <hr style="margin:16px 0;border:none;height:1px;background:#E5E7EB;"/>
        <div>
          <p style="white-space:pre-wrap;margin:0;">${escapeHtml(message)}</p>
        </div>
      </div>
    `;

    await sendSignatureEmail({
      to: process.env.CONTACT_TO_EMAIL || "hello@inflatemate.co",
      from: process.env.CONTACT_FROM_EMAIL || "InflateMate <noreply@mail.inflatemate.co>",
      subject: `[Contact] ${subject} — ${name}`,
      html,
    });

    return NextResponse.json({ ok: true });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}

function escapeHtml(input: string) {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}


