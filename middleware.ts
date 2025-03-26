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
  
  // Check if this is the main app domain
  if (hostname === 'localhost:3000' || hostname === 'localhost') {
    
    // For all other main app routes, continue with auth check
    
    // If it's not a public route, protect it
    if (!isPublicRoute(req)) {
      await auth.protect();
    }
    
    return NextResponse.next();
  }
  
  // Skip rewriting for all /api requests
  if (path.startsWith('/api')) {
    return NextResponse.next();
  }
  
  // Handle both business name subdomains and custom domains
  // If it's a subdomain of localhost or any other domain
  if (domainWithoutPort !== 'localhost') {
    
    // Check if it's a subdomain of localhost (for local development)
    if (domainWithoutPort.includes('.localhost')) {
      
      // Rewrite to the dynamic domain route
      return NextResponse.rewrite(new URL(`/${domainWithoutPort}${path}`, req.url));
    }
    
    // For any other domain, rewrite to the dynamic domain route
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