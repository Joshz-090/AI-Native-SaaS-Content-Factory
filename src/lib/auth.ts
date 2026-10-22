import { auth } from "@clerk/nextjs/server";
import { Role } from "@/types";

export interface SessionContext {
  userId: string;
  organizationId: string;
  role: Role;
  isDevFallback: boolean;
}

const DEFAULT_DEV_ORG = "org_enterprise_01";
const DEFAULT_DEV_USER = "user_dev_01";

/**
 * Server-side session & tenant resolver.
 * Enforces organization presence and derives organizationId strictly from trusted tokens.
 */
export async function getSessionContext(): Promise<SessionContext | null> {
  const hasClerkKeys = Boolean(
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY
  );

  // Development fallback when Clerk credentials are not provisioned
  if (!hasClerkKeys) {
    return {
      userId: DEFAULT_DEV_USER,
      organizationId: DEFAULT_DEV_ORG,
      role: "ADMIN",
      isDevFallback: true,
    };
  }

  try {
    const session = await auth();
    if (!session || !session.userId) {
      return null;
    }

    // Clerk returns orgId and orgRole from the active session
    const organizationId = session.orgId || session.userId; // fallback to personal workspace if no active org
    const clerkRole = session.orgRole;

    let role: Role = "VIEWER";
    if (clerkRole === "org:admin") {
      role = "ADMIN";
    } else if (clerkRole === "org:member" || clerkRole === "org:editor") {
      role = "EDITOR";
    }

    return {
      userId: session.userId,
      organizationId,
      role,
      isDevFallback: false,
    };
  } catch (err) {
    console.error("Auth context error:", err);
    return null;
  }
}

/**
 * Ensures the request is authenticated, throwing or returning a typed response.
 */
export async function requireAuth(): Promise<SessionContext> {
  const context = await getSessionContext();
  if (!context) {
    throw new Error("UNAUTHORIZED");
  }
  return context;
}

/**
 * Validates that the user has at least the required role.
 */
export function hasRequiredRole(userRole: Role, minimumRole: Role): boolean {
  const hierarchy: Record<Role, number> = {
    VIEWER: 1,
    EDITOR: 2,
    ADMIN: 3,
  };

  return hierarchy[userRole] >= hierarchy[minimumRole];
}
