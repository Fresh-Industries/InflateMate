import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Paths that don't require authentication
const publicPaths = ["/", "/auth", "/api/auth"];

// Paths that are always accessible with proper API key
const apiPaths = ["/api/v1"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the path is public
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Special handling for API routes
  if (apiPaths.some(path => pathname.startsWith(path))) {
    const apiKey = request.headers.get("x-api-key");
    if (!apiKey) {
      return new NextResponse(
        JSON.stringify({ error: "Authentication required" }),
        { status: 401, headers: { "content-type": "application/json" } }
      );
    }
    return NextResponse.next();
  }

  // Get the token and verify authentication
  const token = await getToken({ req: request });

  // If no token and trying to access dashboard, redirect to auth
  if (!token && pathname.startsWith('/dashboard')) {
    const searchParams = new URLSearchParams({
      callbackUrl: pathname,
    });
    return NextResponse.redirect(
      new URL(`/auth?${searchParams}`, request.url)
    );
  }

  // If no token for any protected route
  if (!token) {
    return NextResponse.redirect(
      new URL('/auth', request.url)
    );
  }

  // Business access check for /dashboard routes
  if (pathname.startsWith("/dashboard/")) {
    const businessId = pathname.split("/")[2];
    if (businessId) {
      const hasAccess = token.businesses?.includes(businessId);
      if (!hasAccess) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }
  }

  return NextResponse.next();
}

// Configure which paths should trigger the middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. Paths starting with /api/auth (authentication endpoints)
     * 2. Paths starting with /static (static files)
     * 3. Paths starting with /_next (Next.js internals)
     * 4. Paths containing a file extension (.ico, .png, etc)
     */
    '/((?!api/auth|static|_next|.*\\..*).*)',
  ],
}; 