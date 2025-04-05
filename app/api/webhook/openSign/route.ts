import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { UTApi } from "uploadthing/server";
import { FileEsque } from "@/lib/utils";

const utapi = new UTApi();

// Define the expected payload structure from OpenSign
interface OpenSignWebhookPayload {
  objectId: string;
  event: 'completed' | 'declined' | 'expired'; 
  file?: string; 
}

export async function POST(req: NextRequest) {
  console.log("Received OpenSign webhook...");

  let payload: OpenSignWebhookPayload;
  try {
    payload = await req.json();
    console.log("Webhook payload:", JSON.stringify(payload, null, 2));

    // Basic validation
    if (!payload.objectId || !payload.event) {
      console.error("Invalid payload structure:", payload);
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error parsing webhook payload:", error);
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  try {
    const waiver = await prisma.waiver.findUnique({
      where: { openSignDocumentId: payload.objectId },
      include: {
        customer: true // Include customer for naming the file
      }
    });

    if (!waiver) {
      console.error(`Waiver not found for document_id: ${payload.objectId}`);
      // Return 200 OK even if not found to prevent OpenSign retries for non-existent waivers
      return NextResponse.json({ message: "Waiver not found, webhook acknowledged." });
    }

    console.log(`Found waiver ${waiver.id} for document ${payload.objectId}`);

    if (payload.event === 'completed') {
      console.log(`Processing 'completed' status for waiver ${waiver.id}`);
      if (!payload.file) { // Check for 'file' field
        console.error(`Signed PDF URL missing (field: file) for document_id: ${payload.objectId}`);
        // Update status anyway, but log the error
        await prisma.waiver.update({
          where: { id: waiver.id },
          data: { status: 'SIGNED' }, // Update status even without URL
        });
        return NextResponse.json({ error: "Signed PDF URL missing" }, { status: 400 }); // Bad request
      }

      try {
        // 1. Download the signed PDF using payload.file
        console.log(`Downloading signed PDF from: ${payload.file}`);
        const response = await fetch(payload.file); // Use payload.file
        if (!response.ok) {
          throw new Error(`Failed to download PDF: ${response.status} ${response.statusText}`);
        }
        const pdfBuffer = await response.arrayBuffer();
        console.log("Signed PDF downloaded successfully.");

        const fileName = `Waiver-${waiver.customer?.name}-${waiver.bookingId}.pdf`;
        const fileEsque = new FileEsque([pdfBuffer], fileName);

        console.log(`Uploading waiver to UploadThing as: ${fileName}`);
        const uploadResponse = await utapi.uploadFiles(fileEsque);
        const fileUrl = uploadResponse.data?.ufsUrl;  
        console.log("Document uploaded. URL:", fileUrl);

        if (!uploadResponse.data?.ufsUrl) {
           console.error("Failed to upload signed PDF to UploadThing:", uploadResponse.error);
           // Decide if you still want to update the waiver status
           // For now, we'll proceed but won't update the URL
           await prisma.waiver.update({
             where: { id: waiver.id },
             data: { status: 'SIGNED' },
           });
           return NextResponse.json({ error: "Failed to upload signed PDF" }, { status: 500 });
        }

        // 3. Update the waiver record
        await prisma.waiver.update({
          where: { id: waiver.id },
          data: {
            status: 'SIGNED',
            documentUrl: fileUrl, // Update with the new signed PDF URL
            updatedAt: new Date(),
          },
        });
        console.log(`Waiver ${waiver.id} updated to SIGNED with new URL.`);

      } catch (error) {
        console.error(`Error processing signed PDF for waiver ${waiver.id}:`, error);
        // Optionally update status to an error state or leave as PENDING
        // Returning 500 to indicate processing failure
        return NextResponse.json({ error: "Failed to process signed PDF" }, { status: 500 });
      }

    } else if (payload.event === 'declined') {
      console.log(`Processing 'declined' status for waiver ${waiver.id}`);
      await prisma.waiver.update({
        where: { id: waiver.id },
        data: {
          status: 'REJECTED',
          updatedAt: new Date(),
        },
      });
      console.log(`Waiver ${waiver.id} updated to REJECTED.`);

    } else {
      console.log(`Unhandled status '${payload.event}' for waiver ${waiver.id}`);
    }

    // Acknowledge receipt
    return NextResponse.json({ message: "Webhook processed successfully" });

  } catch (error) {
    console.error("Error processing OpenSign webhook:", error);
    // Generic error response
    return NextResponse.json({ error: "Internal server error processing webhook" }, { status: 500 });
  }
}
