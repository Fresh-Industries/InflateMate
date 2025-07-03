// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const ROOT = process.env.NEXT_PUBLIC_ROOT_DOMAIN!;
const publicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/:domain(.*)',
  '/api/webhook(.*)',
  '/api(.*)',
  '/public(.*)',
  '/embed(.*)'
]);

const internalRoute = createRouteMatcher([
  '/dashboard(.*)',           // keep dashboard on the root app
  '/api(.*)',                 // your API
]);

const isStaticAsset = (domain: string) =>
  domain.endsWith('.svg') ||
  domain.endsWith('.png') ||
  domain.endsWith('.jpg') ||
  domain.endsWith('.ico') ||
  domain.endsWith('.webmanifest') ||
  domain.endsWith('.css') ||
  domain.endsWith('.js') ||
  domain.startsWith('_next/') ||
  domain === 'favicon.ico';


export default clerkMiddleware(async (auth, req) => {
  const url = new URL(req.url);
  const host = (req.headers.get('host') ?? '').toLowerCase().replace(/^www\./, '');

  /* ── A. skip Next.js internals & static assets ─────────────────────── */
  if (
    url.pathname.startsWith('/_next/') || 
    url.pathname === '/favicon.ico' ||
    url.pathname.match(/\.(ico|png|jpg|jpeg|svg|gif|webp|css|js)$/)
  ) {
    return NextResponse.next();
  }

  /* ── Skip embed routes early ─────────────────────── */
  if (url.pathname.startsWith('/embed/')) {
    return NextResponse.next();
  }

  if (url.pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  if (isStaticAsset(host)) {
    return NextResponse.next();
  }

  // Skip Next.js development error overlay domains
  if (host.includes('__nextjs_original-stack-frame') || host.startsWith('__nextjs')) {
    return NextResponse.next();
  }

  // if (process.env.NODE_ENV === 'development') {
  //   const colocalHost = 'localhost:3000';
  //   if (!publicRoute(req) && host === colocalHost) await auth.protect();
  //   return NextResponse.next();
  // }

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
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
