// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const ROOT = process.env.NEXT_PUBLIC_ROOT_DOMAIN!;
const publicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/:domain(.*)',
  '/api/webhooks(.*)',
  '/api(.*)'

]);

const internalRoute = createRouteMatcher([
  '/dashboard(.*)',           // keep dashboard on the root app
  '/api(.*)',                 // your API
]);

export default clerkMiddleware(async (auth, req) => {
  const url   = new URL(req.url);
  const host  = (req.headers.get('host') ?? '').toLowerCase().split(':')[0];

  /* ── A. skip Next.js internals & static assets ─────────────────────── */
  if (url.pathname.startsWith('/_next/') || url.pathname.match(/\.[\w]+$/))
    return NextResponse.next();

  /* ── B. root domain (marketing & dashboard live here) ─────────────── */
  if (host === ROOT || internalRoute(req)) {
    if (!publicRoute(req)) await auth.protect();
    return NextResponse.next();
  }

  /* ── C. tenant sites (sub-domain or custom domain) ────────────────── */
  const segment = host.endsWith('.' + ROOT)
    ? host.replace('.' + ROOT, '')   // sub-domain → slug only
    : host;                          // custom domain → whole host

  const rewritten = `/${segment}${url.pathname === '/' ? '' : url.pathname}${url.search}`;
  return NextResponse.rewrite(new URL(rewritten, req.url));
});

export const config = {
  matcher: '/((?!_next/|favicon.ico).*)',
};
