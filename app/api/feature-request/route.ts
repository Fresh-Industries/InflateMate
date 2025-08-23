import { NextResponse } from "next/server";
import { sendSignatureEmail } from "@/lib/sendEmail";

export async function POST(req: Request) {
  try {
    const { featureName, description, name, email } = await req.json();

    if (!featureName || !description || !name || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const html = `
      <div style="font-family:Inter,system-ui,Arial,sans-serif;line-height:1.5;font-size:14px;color:#0B1220;">
        <h2 style="margin:0 0 8px;">New Feature Request</h2>
        <table style="border-collapse:collapse;width:100%;max-width:640px;">
          <tbody>
            <tr><td style="padding:6px 0;width:140px;color:#475569;">Feature</td><td>${escapeHtml(featureName)}</td></tr>
            <tr><td style="padding:6px 0;width:140px;color:#475569;">Requested by</td><td>${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</td></tr>
          </tbody>
        </table>
        <hr style="margin:16px 0;border:none;height:1px;background:#E5E7EB;"/>
        <div>
          <p style="white-space:pre-wrap;margin:0;">${escapeHtml(description)}</p>
        </div>
      </div>
    `;

    await sendSignatureEmail({
      to: process.env.CONTACT_TO_EMAIL || "hello@inflatemate.co",
      from: process.env.CONTACT_FROM_EMAIL || "InflateMate <noreply@mail.inflatemate.co>",
      subject: `[Feature] ${featureName} — ${name}`,
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


