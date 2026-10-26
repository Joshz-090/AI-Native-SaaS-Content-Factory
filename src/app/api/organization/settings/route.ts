import { NextRequest, NextResponse } from "next/server";
import { getSessionContext } from "@/lib/auth";

declare global {
  var globalTenantSettings: Map<string, Record<string, any>> | undefined;
}

const tenantSettingsStore: Map<string, Record<string, any>> =
  globalThis.globalTenantSettings ?? new Map<string, Record<string, any>>();

if (process.env.NODE_ENV !== "production") {
  globalThis.globalTenantSettings = tenantSettingsStore;
}

function getDefaultSettings(orgId: string) {
  return {
    organizationId: orgId,
    brandVoice: "Authoritative, forward-looking, enterprise-focused, data-backed with clear executive takeaways.",
    modelChoice: "gemini-3.5-flash-lite",
    updatedAt: new Date().toISOString(),
  };
}

export async function GET() {
  const session = await getSessionContext();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orgId = session.organizationId;
  if (!tenantSettingsStore.has(orgId)) {
    tenantSettingsStore.set(orgId, getDefaultSettings(orgId));
  }

  return NextResponse.json({ success: true, settings: tenantSettingsStore.get(orgId) });
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getSessionContext();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orgId = session.organizationId;
    const body = await req.json();
    const { brandVoice, modelChoice } = body;

    const current = tenantSettingsStore.get(orgId) || getDefaultSettings(orgId);
    if (brandVoice !== undefined) current.brandVoice = String(brandVoice);
    if (modelChoice !== undefined) current.modelChoice = String(modelChoice);
    current.updatedAt = new Date().toISOString();

    tenantSettingsStore.set(orgId, current);

    return NextResponse.json({ success: true, settings: current });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to save settings.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
