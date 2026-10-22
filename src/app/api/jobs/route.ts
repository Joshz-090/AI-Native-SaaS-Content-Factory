import { NextRequest, NextResponse } from "next/server";
import { dispatchContentJob } from "@/lib/queue";
import { getAllRecentJobs } from "@/lib/jobs";
import { getSessionContext } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionContext();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized. Authentication required." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { topic, tone } = body;

    if (!topic || typeof topic !== "string" || !topic.trim()) {
      return NextResponse.json(
        { error: "Topic input is required." },
        { status: 400 }
      );
    }

    // Strictly derive organizationId from server-verified session context
    const job = await dispatchContentJob({
      organizationId: session.organizationId,
      topic: topic.trim(),
      tone,
    });

    return NextResponse.json({
      success: true,
      jobId: job.id,
      status: job.status,
      message: "Job submitted to AI Content Factory pipeline.",
    });
  } catch (error: unknown) {
    console.error("API /api/jobs POST error:", error);
    const message = error instanceof Error ? error.message : "Failed to initialize job.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  const session = await getSessionContext();
  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized. Authentication required." },
      { status: 401 }
    );
  }

  // Strictly filter by authenticated tenant
  const jobs = getAllRecentJobs(session.organizationId, 25);
  return NextResponse.json({ success: true, jobs });
}
