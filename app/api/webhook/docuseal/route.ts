// /app/api/webhook/docuseal/route.ts  ← Next 14 / App-Router

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { UTApi } from 'uploadthing/server'
import { FileEsque } from '@/lib/utils'

const utapi = new UTApi()

/* ────────── DocuSeal payload interface ────────── */
interface DocuSealWebhook {
  event_type: 'form.completed' | 'form.declined' | string
  timestamp: string
  data: {
    id: number
    external_id: string | null            // we set this to customer email
    status: 'completed' | 'declined'
    documents?: { name: string; url: string }[]
  }
}

export async function POST(req: NextRequest) {
  console.log('⟡ DocuSeal webhook received')

  const secret = process.env.DOCUSEAL_WEBHOOK_SECRET!;
  const header  = req.headers.get('x-docuseal-signature'); // must be lowercase here

  if (header !== secret) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  /* ---------- 1. Parse & validate payload ---------- */
  let payload: DocuSealWebhook
  try {
    payload = await req.json()
    console.log('payload', payload)
  } catch (e) {
    console.error('Bad JSON', e)
    return NextResponse.json({ error: 'Bad JSON' }, { status: 400 })
  }

  const { id, documents = [] } = payload.data
  if (!id || !payload.event_type) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  /* ---------- 2. Find matching waiver ---------- */
  const waiver = await prisma.waiver.findFirst({
    where: { docuSealDocumentId: id.toString() },   // ← store this when you call /submissions
    include: { customer: true },
  })
  if (!waiver) {
    console.error('No waiver found for submission', id)
    return NextResponse.json({ ok: true })      // ack so DocuSeal stops retrying
  }

  /* ---------- 3A. Completed ---------- */
  if (payload.event_type === 'form.completed') {
    const signedPdfUrl = documents[0]?.url
    if (!signedPdfUrl) {
      console.error('No signed PDF URL in payload')
      await prisma.waiver.update({
        where: { id: waiver.id },
        data: { status: 'SIGNED' },
      })
      return NextResponse.json({ error: 'No PDF URL' }, { status: 400 })
    }

    try {
      // download                       // DocuSeal docs show these URLs are public for 24 h :contentReference[oaicite:1]{index=1}
      const pdfResp = await fetch(signedPdfUrl)
      if (!pdfResp.ok) throw new Error('PDF download failed')

      // upload to UploadThing
      const buf = await pdfResp.arrayBuffer()
      const fileName = `Waiver-${waiver.customer.name}-${waiver.bookingId}.pdf`
      const upRes = await utapi.uploadFiles(new FileEsque([buf], fileName))
      const ufsUrl = upRes.data?.ufsUrl
      if (!ufsUrl) throw new Error('UploadThing failed')

      // save to DB
      await prisma.waiver.update({
        where: { id: waiver.id },
        data: { status: 'SIGNED', documentUrl: ufsUrl, updatedAt: new Date() },
      })
      console.log('Waiver', waiver.id, 'marked SIGNED')
    } catch (err) {
      console.error('Processing error:', err)
      return NextResponse.json({ error: 'Processing failed' }, { status: 500 })
    }

  /* ---------- 3B. Declined ---------- */
  } else if (payload.event_type === 'form.declined') {
    await prisma.waiver.update({
      where: { id: waiver.id },
      data: { status: 'REJECTED', updatedAt: new Date() },
    })
    console.log('Waiver', waiver.id, 'marked REJECTED')
  } else {
    console.log('Ignoring event', payload.event_type)
  }

  return NextResponse.json({ ok: true })
}
