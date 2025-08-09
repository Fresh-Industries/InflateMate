import { UTApi } from 'uploadthing/server';

export class FileEsque extends Blob {
  name: string;
  lastModified: number;
  customId?: string | null;

  constructor(parts: BlobPart[], filename: string, options?: BlobPropertyBag) {
    super(parts, options);
    this.name = filename;
    this.lastModified = Date.now();
    this.customId = null; // optional, if needed
  }
}

const utapi = new UTApi();

/**
 * Upload a PDF stream to UploadThing
 * @param pdfStream - Readable stream from Stripe
 * @param fileName - Name for the uploaded file
 * @returns UploadThing URL
 */
export async function uploadStreamToUploadThing(pdfStream: NodeJS.ReadableStream, fileName: string): Promise<string> {
  const chunks: Uint8Array[] = [];
  
  return new Promise<string>((resolve, reject) => {
    pdfStream.on('data', (chunk) => {
      chunks.push(chunk);
    });
    
    pdfStream.on('error', (err) => {
      console.error("Error reading PDF stream:", err);
      reject(new Error("Failed to read PDF stream"));
    });
    
    pdfStream.on('end', async () => {
      try {
        const pdfBuffer = Buffer.concat(chunks);
        const arrayBuffer = pdfBuffer.buffer.slice(pdfBuffer.byteOffset, pdfBuffer.byteOffset + pdfBuffer.byteLength);

        console.log(`Uploading PDF to UploadThing: ${fileName}`);
        const upRes = await utapi.uploadFiles(new FileEsque([arrayBuffer], fileName, { type: 'application/pdf' }));

        if (upRes.error) {
          console.error("UploadThing API Error:", upRes.error);
          throw new Error(`UploadThing upload failed: ${upRes.error.message}`);
        }
        
        if (!upRes.data || !upRes.data.url) {
          console.error("UploadThing response missing URL:", upRes.data);
          throw new Error('UploadThing failed to return a URL');
        }
        
        console.log(`PDF uploaded successfully to UploadThing: ${upRes.data.url}`);
        resolve(upRes.data.url);
      } catch (uploadError) {
        console.error("Error during PDF upload:", uploadError);
        reject(uploadError);
      }
    });
  });
} 