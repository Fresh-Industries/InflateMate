import { NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks(.*)",
  "/api(.*)",
]);

// Inlined at build time
const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN;

export default clerkMiddleware(async (auth, req) => {
  const url = new URL(req.url);
  const hostname = req.headers.get("host") || "";
  const domainOnly = hostname.split(":")[0];
  const path = url.pathname;

  // 1️⃣ Main app root domain (dev or prod)
  if (
    domainOnly === ROOT_DOMAIN ||
    domainOnly === `www.${ROOT_DOMAIN}`
  ) {
    if (!isPublicRoute(req)) {
      await auth.protect();
    }
    return NextResponse.next();
  }

  // 2️⃣ API routes bypass
  if (path.startsWith("/api")) {
    return NextResponse.next();
  }

  // 3️⃣ Tenant subdomain (e.g. foo.inflatemate.co)
  if (domainOnly.endsWith(`.${ROOT_DOMAIN}`)) {
    const subdomain = domainOnly.replace(`.${ROOT_DOMAIN}`, "");
    return NextResponse.rewrite(
      new URL(`/${subdomain}${path}`, req.url)
    );
  }

  // 4️⃣ Fallback: protect other unknown routes on root
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api/webhooks|_next/|[\\w-]+\\.\\w+).*)",
    "/api/((?!webhooks).*)",
  ],
};
