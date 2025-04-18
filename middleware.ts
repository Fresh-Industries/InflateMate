import { NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/:domain(.*)',
  '/api/webhooks(.*)',
  '/api(.*)'
]);

// This function handles domain routing and authentication
export default clerkMiddleware(async (auth, req) => {
  const url = new URL(req.url);
  
  // Get hostname of request (e.g. business-name.localhost:3000)
  const hostname = req.headers.get('host') || '';
  
  // Extract domain without port for comparison
  const domainWithoutPort = hostname.split(':')[0];
  
  // Get the pathname of the request (e.g. /, /about, /contact)
  const path = url.pathname;
  
  const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'localhost:3000';
  const LOCALHOST_DOMAIN = 'localhost:3000';
  
  // Check if this is the main app domain
  if (hostname === LOCALHOST_DOMAIN || hostname === ROOT_DOMAIN) {
    // For main app routes, continue with auth check
    if (!isPublicRoute(req)) {
      await auth.protect();
    }
    
    return NextResponse.next();
  }
  
  // Skip rewriting for all /api requests
  if (path.startsWith('/api')) {
    return NextResponse.next();
  }
  
  // Handle subdomains and custom domains
  const isLocalSubdomain = domainWithoutPort.includes('.localhost');
  const isDevelopmentDomain = hostname.includes('localhost');
  const isProductionDomain = !isDevelopmentDomain && domainWithoutPort !== ROOT_DOMAIN.split(':')[0];
  
  if (isLocalSubdomain || isProductionDomain) {
    // Rewrite to the dynamic domain route with proper path handling
    // This maps domain.com/page -> /domain.com/page in the Next.js router
    return NextResponse.rewrite(new URL(`/${domainWithoutPort}${path}`, req.url));
  }
  
  // Default case: continue with auth check
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
  
  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes (except those we want to protect)
     * 2. /_next (Next.js internals)
     * 3. all static files (e.g. /favicon.ico)
     */
    "/((?!api/webhooks|_next/|[\\w-]+\\.\\w+).*)",
    "/api/((?!webhooks).*)",
  ],
};