import 'dotenv/config';
import { sendToDocuSeal } from '../lib/docuseal.server';
import { sendSignatureEmail } from '../lib/sendEmail';
import { testData } from './data/testData';

describe('End-to-end: generate sign URL and email waiver', () => {
  it('should create a sign URL and send it via email', async () => {
    // 1) Generate signing URL using the new function signature
    const { url, documentId } = await sendToDocuSeal(
      testData.business,
      testData.customer,
      testData.booking,
      testData.templateVersion
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
      from: `${testData.business.name} <onboarding@resend.dev>`,
    });

    console.log("emailResponse", emailResponse);

    expect(emailResponse?.data).toHaveProperty('id');
    console.log('→ Email sent, id:', emailResponse?.data?.id);
  });
});
