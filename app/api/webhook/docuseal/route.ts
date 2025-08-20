// /app/api/webhook/docuseal/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { UTApi } from 'uploadthing/server'
import { FileEsque } from '@/lib/utils'
import * as Sentry from '@sentry/nextjs'

const utapi = new UTApi()

/* ────────── DocuSeal payload interface ────────── */
interface DocuSealWebhook {
  event_type:
    | 'form.completed'
    | 'form.declined'
    | 'submission.completed'
    | 'submission.declined'
    | string
  timestamp: string
  data: {
    // DocuSeal submission id
    id: number
    // We set this to the customer email when creating the submission
    external_id?: string | null
    status?: 'completed' | 'declined' | string
    // First submitter is ours; its id matches what we stored in Waiver.docuSealDocumentId
    submitters?: Array<{ id: number; email?: string; external_id?: string }>
    audit_log_url?: string
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

  const submissionId = payload.data?.id
  const submitterId = payload.data?.submitters?.[0]?.id
  const documents = payload.data?.documents ?? []
  const auditLogUrl = payload.data?.audit_log_url
  if (!submissionId || !payload.event_type) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  /* ---------- 2. Find matching waiver ---------- */
  const primaryLookupId = (submitterId ?? submissionId).toString()
  let waiver = await prisma.waiver.findFirst({
    where: { docuSealDocumentId: primaryLookupId },
    include: { customer: true },
  })

  // Fallback: try by external_id (customer email) if present
  if (!waiver && payload.data.external_id) {
    const customer = await prisma.customer.findFirst({
      where: { email: payload.data.external_id },
      select: { id: true },
    })
    if (customer) {
      waiver = await prisma.waiver.findFirst({
        where: {
          customerId: customer.id,
          // Not already terminal; prefer the most recent pending/open waiver
          NOT: [{ status: 'SIGNED' }, { status: 'REJECTED' }],
        },
        orderBy: { createdAt: 'desc' },
        include: { customer: true },
      })
    }
  }

  if (!waiver) {
    console.error('No waiver found. submissionId=', submissionId, 'submitterId=', submitterId)
    return NextResponse.json({ ok: true }) // ack so DocuSeal stops retrying
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
  if (payload.event_type === 'form.completed' || payload.event_type === 'submission.completed') {
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

      // Optionally fetch and upload audit log
      let uploadedAuditUrl: string | null = null
      try {
        if (auditLogUrl) {
          const auditResp = await fetchWithBackoff(auditLogUrl)
          const auditBuf = await auditResp.arrayBuffer()
          const auditName = `AuditLog-${safeName}-${waiver.bookingId}.pdf`
          const upAudit = await utapi.uploadFiles(new FileEsque([auditBuf], auditName))
          uploadedAuditUrl = upAudit.data?.ufsUrl ?? null
        }
      } catch (e) {
        console.warn('Audit log fetch/upload failed:', e)
      }

      // save to DB
      await prisma.waiver.update({
        where: { id: waiver.id },
        data: {
          status: 'SIGNED',
          documentUrl: ufsUrl,
          auditLogUrl: uploadedAuditUrl ?? undefined,
          originalAuditLogUrl: auditLogUrl ?? undefined,
          updatedAt: new Date(),
        },
      })
      console.log('Waiver', waiver.id, 'marked SIGNED')
    } catch (err) {
      console.error('Processing error:', err)
      Sentry.captureException(err)
      // Acknowledge to prevent DS retries causing thundering herd; we'll rely on manual/backfill
      return NextResponse.json({ ok: true })
    }

  /* ---------- 3B. Declined ---------- */
  } else if (payload.event_type === 'form.declined' || payload.event_type === 'submission.declined') {
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
