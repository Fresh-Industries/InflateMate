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
  
  // Use environment variables for domain configuration
  const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'localhost:3000';
  const ROOT_DOMAIN_WITHOUT_PORT = ROOT_DOMAIN.split(':')[0];
  
  // Define production domain explicitly
  const PRODUCTION_DOMAIN = 'inflatemate.co';
  
  // Console logging for debugging
  console.log({
    hostname,
    domainWithoutPort,
    path,
    ROOT_DOMAIN,
    ROOT_DOMAIN_WITHOUT_PORT,
    url: req.url
  });
  
  // Skip rewriting for all /api and _next requests
  if (path.startsWith('/api') || path.startsWith('/_next')) {
    return NextResponse.next();
  }
  
  // For assets and static files, just proceed
  if (path.match(/\.(ico|png|jpg|jpeg|svg|css|js|json)$/)) {
    return NextResponse.next();
  }
  
  // Handle www subdomain - redirect to apex domain
  if (domainWithoutPort === `www.${PRODUCTION_DOMAIN}`) {
    const newUrl = new URL(url);
    newUrl.host = PRODUCTION_DOMAIN;
    return NextResponse.redirect(newUrl);
  }
  
  // Check if this is the main app domain (root domain or production domain)
  const isRootDomain = hostname === ROOT_DOMAIN || 
                       domainWithoutPort === ROOT_DOMAIN_WITHOUT_PORT ||
                       domainWithoutPort === PRODUCTION_DOMAIN;
  
  if (isRootDomain) {
    // For main app routes, continue with auth check
    if (!isPublicRoute(req)) {
      await auth.protect();
    }
    return NextResponse.next();
  }
  
  // Handle subdomains and custom domains
  const isLocalSubdomain = domainWithoutPort.includes('.localhost');
  
  // Handle production subdomains (but not www)
  const isProductionSubdomain = domainWithoutPort.includes(`.${PRODUCTION_DOMAIN}`) && 
                               !domainWithoutPort.startsWith('www.');
  
  // Handle other custom domains
  const isCustomDomain = !isRootDomain && 
                        !domainWithoutPort.includes('localhost') && 
                        !domainWithoutPort.includes(PRODUCTION_DOMAIN);
  
  // If it's any kind of subdomain or a custom domain
  if (isLocalSubdomain || isProductionSubdomain || isCustomDomain) {
    console.log('Rewriting URL for domain:', domainWithoutPort);
    
    try {
      // Rewrite to the dynamic domain route
      const rewriteUrl = new URL(`/${domainWithoutPort}${path}`, url.origin);
      console.log('Rewrite URL:', rewriteUrl.toString());
      return NextResponse.rewrite(rewriteUrl);
    } catch (error) {
      console.error('Error rewriting URL:', error);
      return NextResponse.next();
    }
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