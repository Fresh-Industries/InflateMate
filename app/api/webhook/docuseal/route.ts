// /app/api/webhook/docuseal/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { UTApi } from 'uploadthing/server'
import { FileEsque } from '@/lib/utils'
import * as Sentry from '@sentry/nextjs'

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
    // Unauthorized → do NOT trigger DS retries with 5xx
    return NextResponse.json({ ok: false }, { status: 401 });
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
    where: { docuSealDocumentId: id.toString() },   
    include: { customer: true },
  })
  if (!waiver) {
    console.error('No waiver found for submission', id)
    return NextResponse.json({ ok: true })      // ack so DocuSeal stops retrying
  }

  // Idempotency guard: if already processed, acknowledge and exit
  if (waiver.status === 'SIGNED' && waiver.documentUrl) {
    console.log('Duplicate webhook: waiver already SIGNED with documentUrl. Skipping.')
    return NextResponse.json({ ok: true })
  }
  if (waiver.status === 'REJECTED') {
    console.log('Duplicate webhook: waiver already REJECTED. Skipping.')
    return NextResponse.json({ ok: true })
  }

  /* ---------- 3A. Completed ---------- */
  if (payload.event_type === 'form.completed') {
    const signedPdfUrl = documents[0]?.url
    if (!signedPdfUrl) {
      console.error('No signed PDF URL in payload')
      await prisma.waiver.update({
        where: { id: waiver.id },
        data: { status: 'SIGNED', updatedAt: new Date() },
      })
      // Acknowledge to stop retries; follow-up can be handled out-of-band
      return NextResponse.json({ ok: true })
    }

    try {
      // Gentle retry on transient 429/5xx to avoid hammering DS file host
      const fetchWithBackoff = async (url: string, maxAttempts = 3): Promise<Response> => {
        let attempt = 0
        let lastErr: unknown
        while (attempt < maxAttempts) {
          try {
            const resp = await fetch(url, {
              headers: {
                Accept: 'application/pdf',
                'User-Agent': 'inflatemate-webhook/1.0 (+https://inflatemate.co)'
              },
              cache: 'no-store',
            })
            if (resp.ok) return resp
            // Retry on 429/503/504
            if ([429, 503, 504].includes(resp.status)) {
              const delayMs = 250 * Math.pow(2, attempt) + Math.floor(Math.random() * 150)
              await new Promise((r) => setTimeout(r, delayMs))
              attempt++
              continue
            }
            throw new Error(`Unexpected status ${resp.status}`)
          } catch (e) {
            lastErr = e
            const delayMs = 250 * Math.pow(2, attempt) + Math.floor(Math.random() * 150)
            await new Promise((r) => setTimeout(r, delayMs))
            attempt++
          }
        }
        throw lastErr ?? new Error('Download failed')
      }

      const pdfResp = await fetchWithBackoff(signedPdfUrl)

      // upload to UploadThing
      const buf = await pdfResp.arrayBuffer()
      const safeName = (waiver.customer?.name || 'Customer').replace(/[^\w\-\s]/g, '').slice(0, 64)
      const fileName = `Waiver-${safeName}-${waiver.bookingId}.pdf`
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
      Sentry.captureException(err)
      // Acknowledge to prevent DS retries causing thundering herd; we'll rely on manual/backfill
      return NextResponse.json({ ok: true })
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
