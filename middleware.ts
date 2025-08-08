// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const ROOT = process.env.NEXT_PUBLIC_ROOT_DOMAIN!;
const publicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/:domain(.*)',
  '/api/webhook(.*)',
  '/api/embed/(.*)',          // Embed routes for public access
  '/api/monitoring',          // Monitoring endpoint
  '/public(.*)',
  '/api/auth(.*)',
]);

const internalRoute = createRouteMatcher([
  '/dashboard(.*)',           // keep dashboard on the root app
  '/api(.*)',                 // your API (now protected by default)
]);

// Enhanced pathname-based asset detection
import { 
  isStaticAsset as detectStaticAsset, 
  isEmbedRoute,
  validateAssetPath
} from '@/lib/security/embed-asset-detection';

const isStaticAsset = (pathname: string) => detectStaticAsset(pathname);


export default clerkMiddleware(async (auth, req) => {
  const url = new URL(req.url);
  const host = (req.headers.get('host') ?? '').toLowerCase().replace(/^www\./, '');

  /* ── FIRST: Skip embed routes completely ─────────────────────── */
  if (url.pathname.startsWith('/embed/')) {
    return NextResponse.next();
  }

  /* ── A. skip Next.js internals & static assets ─────────────────────── */
  if (isStaticAsset(url.pathname)) {
    return NextResponse.next();
  }

  /* ── Enhanced security validation for embed routes ─────────────────── */
  if (isEmbedRoute(url.pathname)) {
    // Validate asset path for security (prevent directory traversal, etc.)
    if (!validateAssetPath(url.pathname)) {
      return new NextResponse('Invalid path', { status: 400 });
    }
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
     * - embed (embed routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!embed|_next/static|_next/image|favicon.ico).*)',
  ],
};
