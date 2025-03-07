import { NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/:domain(.*)',
  '/api/webhooks(.*)',
]);

// This function handles domain routing and authentication
export default clerkMiddleware(async (auth, req) => {
  const url = new URL(req.url);
  
  // Get hostname of request (e.g. business-name.localhost:3000)
  const hostname = req.headers.get('host') || '';
  
  console.log('Middleware processing URL:', url.toString());
  console.log('Hostname:', hostname);
  
  // Extract domain without port for comparison
  const domainWithoutPort = hostname.split(':')[0];
  
  // Get the pathname of the request (e.g. /, /about, /contact)
  const path = url.pathname;
  
  // Check if this is the main app domain
  if (hostname === 'localhost:3000' || hostname === 'localhost') {
    console.log('Main app domain detected');
    
    // Don't rewrite test pages
    if (path.startsWith('/test-page') || 
        path.startsWith('/simple-test') || 
        path.startsWith('/direct-test') ||
        path.startsWith('/api/test')) {
      console.log('Test page detected, not rewriting');
      return NextResponse.next();
    }
    
    // For all other main app routes, continue with auth check
    console.log('Main app route, continuing with auth check');
    
    // If it's not a public route, protect it
    if (!isPublicRoute(req)) {
      await auth.protect();
    }
    
    return NextResponse.next();
  }
  
  // Handle both business name subdomains and custom domains
  // If it's a subdomain of localhost or any other domain
  if (domainWithoutPort !== 'localhost') {
    console.log('Domain detected:', domainWithoutPort);
    
    // Check if it's a subdomain of localhost (for local development)
    if (domainWithoutPort.includes('.localhost')) {
      const subdomain = domainWithoutPort.split('.')[0];
      console.log('Localhost subdomain detected:', subdomain);
      
      // Rewrite to the dynamic domain route
      console.log(`Rewriting to /${domainWithoutPort}${path}`);
      return NextResponse.rewrite(new URL(`/${domainWithoutPort}${path}`, req.url));
    }
    
    // For any other domain, rewrite to the dynamic domain route
    console.log(`Rewriting to /${domainWithoutPort}${path}`);
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