import { Queue } from "bullmq";
import IORedis, { RedisOptions } from "ioredis";
import { createAndProcessJob, getJobById, JobRecord } from "./jobs";

const redisOptions: RedisOptions = {
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT || "6379", 10),
  maxRetriesPerRequest: null,
  lazyConnect: true,
  enableOfflineQueue: false,
  retryStrategy: () => null, // Don't hang node if Redis is offline
};

export const redisConnection = new IORedis(redisOptions);

redisConnection.on("error", () => {
  // Silent fallback when Redis is offline in local development
});

export const contentQueue = new Queue("content-generation", {
  connection: redisConnection as any,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 1000,
    },
    removeOnComplete: true,
  },
});

contentQueue.on("error", () => {
  // Gracefully ignored if Redis is down
});

/**
 * Unified dispatch:
 * Enqueues to BullMQ queue if Redis is connected,
 * otherwise falls back to resilient background processing.
 */
export async function dispatchContentJob({
  organizationId,
  topic,
  tone,
}: {
  organizationId: string;
  topic: string;
  tone?: string;
}): Promise<JobRecord> {
  if (!organizationId || !organizationId.trim()) {
    throw new Error("Multi-tenant violation: organizationId is required.");
  }

  // Create baseline job record
  const jobRecord = await createAndProcessJob({ organizationId, topic, tone });

  // Attempt to enqueue to BullMQ queue if Redis is ready
  try {
    if (redisConnection.status === "ready" || redisConnection.status === "connecting") {
      await contentQueue.add("generate-content", {
        jobId: jobRecord.id,
        requestId: jobRecord.id,
        organizationId,
        topic,
        tone,
      });
    }
  } catch (queueErr) {
    console.warn("[Queue] BullMQ enqueue unavailable, running in-process:", queueErr);
  }

  return jobRecord;
}

export async function fetchContentJob(jobId: string, organizationId?: string) {
  return getJobById(jobId, organizationId);
}
