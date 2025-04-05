// utils/generateWaiverPDF.ts
import React from 'react';
import { renderToStream } from '@react-pdf/renderer';
import WaiverDocument from '@/components/WaiverDocument';
import { DocumentProps } from '@react-pdf/types';
import { ReactElement } from 'react';


interface Customer {
    id: string;
    name: string;
    email: string;
    phone: string;
  }
  
  interface Business {
    id: string;
    name: string;
    logo?: string | null;
    phone?: string | null;
    email?: string | null;
  }
  
  interface Booking {
    id: string;
    eventDate: string;
    eventAddress: string;
    eventCity: string;
    eventState: string;
    eventZipCode: string;
    participantCount: number;
    participantAge?: number;
  }
  
interface GeneratePDFParams {
  customer: Customer;
  booking: Booking;
  business: Business;
  templateVersion: string;
}

export async function generateWaiverPDF({
  customer,
  booking,
  business,
  templateVersion,
}: GeneratePDFParams): Promise<Buffer> {
  const docElement = React.createElement(WaiverDocument, {
    customer,
    booking,
    business,
    templateVersion
  });
  
  const pdfStream = await renderToStream(docElement as ReactElement<DocumentProps>);

  const chunks: Uint8Array[] = [];
  for await (const chunk of pdfStream) {
    chunks.push(chunk instanceof Uint8Array ? chunk : new Uint8Array(Buffer.from(chunk)));
  }
  return Buffer.concat(chunks);
}
