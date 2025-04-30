'use server';

import { buildWaiverHtml, Business, Customer, Booking } from './generateWaiver';

// Define needed interfaces directly (or import from a shared types file)





// utils/docuSeal.ts
export interface SignResult {
  url: string;        // signer-specific page
  documentId: string; // submission ID (keep for webhooks / downloads)
}

/**
 * 1) Build HTML
 * 2) Upload HTML -> one-off template
 * 3) Create submission -> get signing URL
 */
export async function sendToDocuSeal(
  // Remove pdfBuffer, customerEmail, businessName, customerName
  business: Business,
  customer: Customer,
  booking: Booking,
  templateVersion: string
): Promise<SignResult> {
  /* -------------------------------------------------- *
   *  STEP 1 – Build HTML and create template
   * -------------------------------------------------- */
   // Define the props needed for the WaiverHtml component
   const waiverProps = {
    business: business,
    customer: customer,
    booking: booking,
    templateVersion: templateVersion
  };
  // Render HTML directly here
  const html = buildWaiverHtml(waiverProps);

  


  const tplRes = await fetch(`${process.env.DS_BASE_URL}/templates/html`, {
    method: "POST",
    headers: {
      "Content-Type": "text/html",
      "X-Auth-Token": process.env.DOCUSEAL_API_KEY!,
    },
    body: JSON.stringify({
      name: `Waiver for ${customer.name}`,
      html: html,
      folder: "InflateMate",      // optional – keeps the dashboard tidy
    }),
  });

  if (!tplRes.ok) {
    const txt = await tplRes.text();
    throw new Error(
      `DocuSeal template creation failed: ${tplRes.status} ${tplRes.statusText}\n${txt}`
    );
  }

  const { id: templateId } = await tplRes.json(); // numeric ID

  /* -------------------------------------------------- *
   *  STEP 2 – create a submission (signature request)
   * -------------------------------------------------- */
  const subRes = await fetch(`${process.env.DS_BASE_URL}/submissions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Auth-Token": process.env.DOCUSEAL_API_KEY!,
    },
    body: JSON.stringify({
      template_id: templateId,
      send_email: false,
      submitters: [
        {
          email: customer.email, // Use email from customer object
          name: customer.name,   // Use name from customer object
          role: "customer",
          external_id: customer.email, // Use email from customer object
        },
      ],
      message: {
        subject: `Waiver for ${business.name}`, // Use name from business object
        body: `Hi ${customer.name}, please sign your waiver: {{submitter.link}}`,
      },
    }),
  });

  if (!subRes.ok) {
    const txt = await subRes.text();
    throw new Error(
      `DocuSeal submission failed: ${subRes.status} ${subRes.statusText}\n${txt}`
    );
  }

  /*  DocuSeal returns an array of submitters; the first one is ours. */
  const [submitter] = await subRes.json();
  const url =
    submitter.signing_url ||
    // fallback: build it manually if only a slug is returned
    `https://docuseal.com/s/${submitter.slug}`;

  console.log("url", url);

  return { url, documentId: submitter.id.toString() };
}
