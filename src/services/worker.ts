import { Worker, Job } from "bullmq";
import { redisConnection } from "../lib/queue";
import { generateContent } from "./ai";
import { withTenantContext } from "../lib/prisma";
import { reserveCredits } from "../lib/quota";

console.log("⚡ Starting AI Content Factory BullMQ Worker pool...");

export const contentWorker = new Worker(
  "content-generation",
  async (job: Job) => {
    const { requestId, organizationId, topic, tone } = job.data;

    if (!organizationId) {
      throw new Error(`[Worker] Job ${job.id} rejected: missing organizationId.`);
    }

    console.log(`[Worker] Processing Job ${job.id} for Org ${organizationId}: "${topic}"`);

    // 1. Quota reservation check
    const ESTIMATED_CREDITS = 1000;
    const hasQuota = await reserveCredits(organizationId, ESTIMATED_CREDITS);

    if (!hasQuota) {
      console.warn(`[Worker] Org ${organizationId} has insufficient credits.`);
      try {
        if (requestId) {
          await withTenantContext(organizationId, async (tx) => {
            if ((tx as any).contentRequest?.update) {
              await (tx as any).contentRequest.update({
                where: { id: requestId },
                data: { status: "FAILED" },
              });
            }
          });
        }
      } catch (err) {
        console.error("[Worker] Failed to update request status on quota fail:", err);
      }
      throw new Error(`Insufficient credits for organization ${organizationId}`);
    }

    try {
      // 2. Mark processing in database
      if (requestId) {
        await withTenantContext(organizationId, async (tx) => {
          if ((tx as any).contentRequest?.update) {
            await (tx as any).contentRequest.update({
              where: { id: requestId },
              data: { status: "PROCESSING" },
            });
          }
        });
      }

      // 3. Generate AI Content
      const aiResponse = await generateContent(topic, tone);

      // 4. Save Generated Output under PostgreSQL RLS boundary
      if (requestId) {
        await withTenantContext(organizationId, async (tx) => {
          if ((tx as any).generatedText?.create) {
            await (tx as any).generatedText.create({
              data: {
                organizationId,
                requestId,
                headline: aiResponse.headline,
                bodyCopy: aiResponse.body,
                tokensUsed: aiResponse.tokensUsed,
                modelVersion: aiResponse.modelVersion,
              },
            });

            await (tx as any).generatedImage?.create({
              data: {
                organizationId,
                requestId,
                imageUrl: aiResponse.imageUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe",
                promptUsed: aiResponse.imagePrompt,
                stylePreset: "Photorealistic Enterprise",
              },
            });

            await (tx as any).contentRequest?.update({
              where: { id: requestId },
              data: { status: "COMPLETED" },
            });
          }
        });
      }

      console.log(`[Worker] Job ${job.id} completed successfully for Org ${organizationId}`);
      return aiResponse;
    } catch (error) {
      console.error(`[Worker] Job ${job.id} failed:`, error);

      if (requestId) {
        try {
          await withTenantContext(organizationId, async (tx) => {
            if ((tx as any).contentRequest?.update) {
              await (tx as any).contentRequest.update({
                where: { id: requestId },
                data: { status: "FAILED" },
              });
            }
          });
        } catch (dbErr) {
          console.error("[Worker] Failed to update error status in DB:", dbErr);
        }
      }

      throw error; // Let BullMQ retry with exponential backoff
    }
  },
  { connection: redisConnection as any }
);

contentWorker.on("completed", (job) => {
  console.log(`[BullMQ] Job ${job.id} completed.`);
});

contentWorker.on("failed", (job, err) => {
  console.error(`[BullMQ] Job ${job?.id} failed with error:`, err.message);
});
