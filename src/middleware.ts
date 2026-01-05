import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define protected routes
const isProtectedRoute = createRouteMatcher(["/(dashboard)(.*)"]);
const isAdminRoute = createRouteMatcher(["/(dashboard)/admin(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, orgSlug, orgRole, redirectToSignIn } = await auth();

  // 1. If trying to access a protected route and not logged in
  if (!userId && isProtectedRoute(req)) {
    return redirectToSignIn();
  }

  // 2. Organization Context Enforcement
  // We expect URLs like /:orgSlug/dashboard/...
  const url = new URL(req.url);
  const pathParts = url.pathname.split("/");
  const urlOrgSlug = pathParts[1];

  // If we are in the dashboard and the Org in the URL doesn't match the active session Org
  // This prevents URL spoofing
  if (isProtectedRoute(req) && urlOrgSlug !== orgSlug) {
    // Optional: Redirect to the correct Org dashboard or show 404
    return NextResponse.rewrite(new URL("/404", req.url));
  }

  // 3. RBAC Enforcement
  if (isAdminRoute(req) && orgRole !== "org:admin") {
    return NextResponse.rewrite(new URL("/403", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
