import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Protected web routes and API routes
const isWebProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);
const isApiProtectedRoute = createRouteMatcher(["/api/(.*)"]);
const isAdminRoute = createRouteMatcher(["/dashboard/admin(.*)"]);

const hasClerkKeys = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY
);

export default clerkMiddleware(async (auth, req) => {
  // If Clerk keys are not configured in environment, allow local dev access with guest tenant
  if (!hasClerkKeys) {
    return NextResponse.next();
  }

  const { userId, orgRole, redirectToSignIn } = await auth();

  // 1. API Route Protection: return 401 JSON response instead of redirect
  if (!userId && isApiProtectedRoute(req)) {
    return NextResponse.json(
      { error: "Unauthorized. Authentication required." },
      { status: 401 }
    );
  }

  // 2. Web Route Protection: redirect to sign-in
  if (!userId && isWebProtectedRoute(req)) {
    return redirectToSignIn();
  }

  // 3. Strict RBAC Enforcement for Admin routes (must have org:admin)
  if (isAdminRoute(req) && orgRole !== "org:admin") {
    return NextResponse.rewrite(new URL("/403", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
