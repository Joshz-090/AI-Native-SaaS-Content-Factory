import { NextRequest, NextResponse } from "next/server";
import { getSessionContext } from "@/lib/auth";
import { withTenantContext } from "@/lib/prisma";
import { ScheduleItem } from "@/types";

// Tenant-partitioned store: Map<organizationId, ScheduleItem[]>
declare global {
  var globalTenantSchedules: Map<string, ScheduleItem[]> | undefined;
}

const tenantSchedulesStore: Map<string, ScheduleItem[]> =
  globalThis.globalTenantSchedules ?? new Map<string, ScheduleItem[]>();

if (process.env.NODE_ENV !== "production") {
  globalThis.globalTenantSchedules = tenantSchedulesStore;
}

function getInitialSchedules(orgId: string): ScheduleItem[] {
  return [
    {
      id: `sch_1_${orgId}`,
      title: "Generative AI in 2026: Enterprise Security Blueprint",
      platform: "LinkedIn",
      scheduledFor: new Date(Date.now() + 1000 * 60 * 60 * 18).toISOString(),
      status: "SCHEDULED",
      author: "Elena Rostova (Head of Growth)",
      preview: "Decoupled LLM pipelines with RLS multi-tenant data isolation are transforming enterprise compliance...",
    },
    {
      id: `sch_2_${orgId}`,
      title: "Why Deterministic Quotas Matter More Than Model Size",
      platform: "Twitter/X",
      scheduledFor: new Date(Date.now() + 1000 * 60 * 60 * 36).toISOString(),
      status: "SCHEDULED",
      author: "Marcus Chen (Staff Architect)",
      preview: "Thread: Stop burning your engineering budget on unconstrained inference loops. Here is how we enforce token buckets...",
    },
  ];
}

export async function GET() {
  const session = await getSessionContext();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orgId = session.organizationId;

  // Try DB persistence under tenant RLS context first
  try {
    const dbSchedules = await withTenantContext(orgId, async (tx) => {
      if ((tx as any).schedule?.findMany) {
        return await (tx as any).schedule.findMany({
          where: { organizationId: orgId },
          orderBy: { scheduledAt: "asc" },
        });
      }
      return null;
    });

    if (dbSchedules && dbSchedules.length > 0) {
      return NextResponse.json({ success: true, schedules: dbSchedules });
    }
  } catch (dbErr) {
    console.warn("[Schedules GET] DB query fallback:", dbErr);
  }

  // Fallback to tenant-isolated in-memory store
  if (!tenantSchedulesStore.has(orgId)) {
    tenantSchedulesStore.set(orgId, getInitialSchedules(orgId));
  }

  const items = tenantSchedulesStore.get(orgId) || [];
  return NextResponse.json({ success: true, schedules: items });
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionContext();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orgId = session.organizationId;
    const body = await req.json();
    const { title, platform, scheduledFor, preview, author = "Staff Editor" } = body;

    const scheduleDate = scheduledFor ? new Date(scheduledFor) : new Date(Date.now() + 86400000);
    if (isNaN(scheduleDate.getTime())) {
      return NextResponse.json({ error: "Invalid scheduled date." }, { status: 400 });
    }

    const newItem: ScheduleItem = {
      id: `sch_${Date.now()}`,
      title: title || "Automated AI Post",
      platform: platform || "LinkedIn",
      scheduledFor: scheduleDate.toISOString(),
      status: "SCHEDULED",
      author,
      preview: preview || "AI Generated Content payload scheduled for automated distribution.",
    };

    // Try DB persistence
    try {
      await withTenantContext(orgId, async (tx) => {
        if ((tx as any).schedule?.create) {
          await (tx as any).schedule.create({
            data: {
              id: newItem.id,
              organizationId: orgId,
              contentId: newItem.id,
              platform: newItem.platform,
              scheduledAt: scheduleDate,
              status: "SCHEDULED",
            },
          });
        }
      });
    } catch (dbErr) {
      console.warn("[Schedules POST] DB insert fallback:", dbErr);
    }

    // Persist to tenant memory partition
    if (!tenantSchedulesStore.has(orgId)) {
      tenantSchedulesStore.set(orgId, getInitialSchedules(orgId));
    }
    const store = tenantSchedulesStore.get(orgId)!;
    store.unshift(newItem);

    return NextResponse.json({ success: true, schedule: newItem });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create schedule.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getSessionContext();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orgId = session.organizationId;
    const body = await req.json();
    const { id, status, scheduledFor } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing schedule ID." }, { status: 400 });
    }

    const store = tenantSchedulesStore.get(orgId) || [];
    const item = store.find((s) => s.id === id);
    if (!item) {
      return NextResponse.json({ error: "Schedule not found." }, { status: 404 });
    }

    if (status) item.status = status;
    if (scheduledFor) item.scheduledFor = new Date(scheduledFor).toISOString();

    return NextResponse.json({ success: true, schedule: item });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update schedule.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getSessionContext();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orgId = session.organizationId;
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing schedule ID." }, { status: 400 });
    }

    const store = tenantSchedulesStore.get(orgId) || [];
    const index = store.findIndex((s) => s.id === id);
    if (index === -1) {
      return NextResponse.json({ error: "Schedule not found." }, { status: 404 });
    }

    store.splice(index, 1);
    return NextResponse.json({ success: true, message: "Schedule cancelled." });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete schedule.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
