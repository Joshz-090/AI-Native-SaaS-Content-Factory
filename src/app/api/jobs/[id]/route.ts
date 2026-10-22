import { NextRequest, NextResponse } from "next/server";
import { getJobById } from "@/lib/jobs";
import { getSessionContext } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionContext();
  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized. Authentication required." },
      { status: 401 }
    );
  }

  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: "Missing job ID." }, { status: 400 });
  }

  // Strictly enforce tenant boundary
  const job = getJobById(id, session.organizationId);

  if (!job) {
    return NextResponse.json({ error: "Job not found or access denied." }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    job,
  });
}
