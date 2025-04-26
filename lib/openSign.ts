// utils/docuSeal.ts
export interface SignResult {
  url: string;        // signer-specific page
  documentId: string; // submission ID (keep for webhooks / downloads)
}

/**
 * 1) Upload PDF -> one-off template
 * 2) Create submission -> get signing URL
 */
export async function sendToDocuSeal(
  pdfBuffer: Buffer,
  customerEmail: string,
  businessName: string,
  customerName: string
): Promise<SignResult> {
  const base64Pdf = pdfBuffer.toString("base64");

  /* -------------------------------------------------- *
   *  STEP 1 – create a template from the PDF file
   * -------------------------------------------------- */
  const tplRes = await fetch(`${process.env.DS_BASE_URL}/templates/pdf`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Auth-Token": process.env.DOCUSEAL_API_KEY!,
    },
    body: JSON.stringify({
      name: `Waiver – ${customerName}`,
      file: base64Pdf,            // <- base64 string
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
      send_email: false,              // you’ll e-mail your own link
      submitters: [
        {
          email: customerEmail,
          name: customerName,
          role: "customer",           // must match the role in text tags
          external_id: customerEmail, // handy for look-ups / webhooks
        },
      ],
      message: {
        subject: `Waiver for ${businessName}`,
        body: `Hi ${customerName}, please sign your waiver: {{submitter.link}}`,
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
    `${process.env.DS_BASE_URL?.replace(/\/api\/v1$/, "")}/s/${submitter.slug}`;

  return { url, documentId: submitter.id.toString() };
}
