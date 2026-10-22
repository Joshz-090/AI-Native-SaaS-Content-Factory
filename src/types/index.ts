import { GeneratedContentResult } from "@/services/ai";

export type Role = "ADMIN" | "EDITOR" | "VIEWER";

export type JobStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";

export type ScheduleStatus = "SCHEDULED" | "PUBLISHED" | "FAILED" | "CANCELLED";

export interface AnalyticsStats {
  tenant: string;
  tenantId: string;
  quotaRemaining: number;
  totalCreditsAllocated: number;
  quotaUsedPercentage: number;
  totalRequests: number;
  completedGenerations: number;
  failedGenerations: number;
  inFlight: number;
  averageLatencyMs: number;
  activeModel: string;
  p99LatencyMs: number;
  securityEventsBlocked: number;
}

export interface JobRecord {
  id: string;
  organizationId: string;
  topic: string;
  tone?: string;
  status: JobStatus;
  progress: number;
  result?: GeneratedContentResult;
  error?: string;
  createdAt: string;
  completedAt?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: Role;
  joinedDate: string;
  activityCount: number;
}

export interface ScheduleItem {
  id: string;
  title: string;
  platform: "LinkedIn" | "Twitter/X" | "Substack" | "Internal Newsletter";
  scheduledFor: string;
  status: ScheduleStatus;
  author: string;
  preview: string;
}
