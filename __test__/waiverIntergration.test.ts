import 'dotenv/config';
import { sendToDocuSeal } from '../lib/docuseal';
import { sendSignatureEmail } from '../lib/sendEmail';
import { testData } from './data/testData';
import { generateWaiverPDF } from '../lib/generateWaiver';


describe('End-to-end: generate sign URL and email waiver', () => {
  it('should create a sign URL and send it via email', async () => {
    // Load the test waiver PDF fixture
    const pdfBuffer = await generateWaiverPDF(testData);
    console.log("pdfBuffer", pdfBuffer);

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
      from: `${testData.business.name} <onboarding@resend.dev>`,
    });

    console.log("emailResponse", emailResponse);

    expect(emailResponse?.data).toHaveProperty('id');
    console.log('→ Email sent, id:', emailResponse?.data?.id);
  });
});
