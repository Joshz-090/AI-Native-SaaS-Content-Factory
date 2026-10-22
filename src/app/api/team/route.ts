import { NextRequest, NextResponse } from "next/server";
import { getSessionContext, hasRequiredRole } from "@/lib/auth";
import { TeamMember, Role } from "@/types";

declare global {
  var globalTenantTeam: Map<string, TeamMember[]> | undefined;
}

const tenantTeamStore: Map<string, TeamMember[]> =
  globalThis.globalTenantTeam ?? new Map<string, TeamMember[]>();

if (process.env.NODE_ENV !== "production") {
  globalThis.globalTenantTeam = tenantTeamStore;
}

function getInitialTeam(orgId: string): TeamMember[] {
  return [
    {
      id: `usr_1_${orgId}`,
      name: "Alex Sterling",
      email: `admin@${orgId}.io`,
      role: "ADMIN",
      joinedDate: "2025-11-12",
      activityCount: 142,
    },
    {
      id: `usr_2_${orgId}`,
      name: "Elena Rostova",
      email: `elena@${orgId}.io`,
      role: "EDITOR",
      joinedDate: "2026-01-08",
      activityCount: 88,
    },
  ];
}

export async function GET() {
  const session = await getSessionContext();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orgId = session.organizationId;
  if (!tenantTeamStore.has(orgId)) {
    tenantTeamStore.set(orgId, getInitialTeam(orgId));
  }

  return NextResponse.json({ success: true, members: tenantTeamStore.get(orgId) || [] });
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionContext();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Role check: Only ADMIN or EDITOR can invite members
    if (!hasRequiredRole(session.role, "EDITOR")) {
      return NextResponse.json(
        { error: "Forbidden: You need at least EDITOR privileges to invite members." },
        { status: 403 }
      );
    }

    const { name, email, role = "EDITOR" } = await req.json();
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email is required." }, { status: 400 });
    }

    const orgId = session.organizationId;
    if (!tenantTeamStore.has(orgId)) {
      tenantTeamStore.set(orgId, getInitialTeam(orgId));
    }

    const validRole: Role = ["ADMIN", "EDITOR", "VIEWER"].includes(role) ? role : "EDITOR";

    const newMember: TeamMember = {
      id: `usr_${Date.now()}`,
      name: name || email.split("@")[0],
      email: email.trim().toLowerCase(),
      role: validRole,
      joinedDate: new Date().toISOString().split("T")[0],
      activityCount: 0,
    };

    tenantTeamStore.get(orgId)!.push(newMember);

    return NextResponse.json({ success: true, member: newMember });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to add member.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
