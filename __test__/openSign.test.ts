import fs from 'fs';
import path from 'path';
import { sendToDocuSeal } from '../lib/openSign';
import { sendSignatureEmail } from '../lib/sendEmail';

console.log("OPEN_SIGN_API_KEY", process.env.OPEN_SIGN_API_KEY);

describe('End-to-end: generate sign URL and email waiver', () => {
  it('should create a sign URL and send it via email', async () => {
    // Load the test waiver PDF fixture
    const pdfBuffer = fs.readFileSync(
      path.resolve(__dirname, '../public/test/test_waiver.pdf')
    );

    // 1) Generate signing URL
    const { url, documentId } = await sendToDocuSeal(
      pdfBuffer,
      "nikolas.manuel13@gmail.com",
      'InflateMate',
      'Nikolas Manuel'
    );

    expect(typeof url).toBe('string');
    expect(url).toMatch(/^https?:\/\//);
    expect(typeof documentId).toBe('string');
    console.log('→ Signing URL:', url);

    // 2) Send email with the signing link
    const emailHtml = `
      <p>Please sign your waiver by clicking the link below:</p>
      <p><a href="${url}">${url}</a></p>
      <p>Document ID: ${documentId}</p>
    `;

    const emailResponse = await sendSignatureEmail({
      to: "nikolas.manuel13@gmail.com",
      subject: '[TEST] Please sign your waiver',
      html: emailHtml,
      from: 'InflateMate <onboarding@resend.dev>',
    });

    expect(emailResponse).toHaveProperty('id');
    console.log('→ Email sent, id:', emailResponse?.data?.id);
  });
});
