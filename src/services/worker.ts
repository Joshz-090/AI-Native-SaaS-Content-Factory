import { Worker, Job } from "bullmq";
import { redisConnection } from "../lib/queue";
import { generateContent } from "./ai";
import prisma from "../lib/prisma";
import { reserveCredits, refundCredits } from "../lib/quota";

export const contentWorker = new Worker(
  "content-generation",
  async (job: Job) => {
    const { requestId, organizationId, topic } = job.data;

    // 0. Quota Check (Staff Enhancement)
    const ESTIMATED_CREDITS = 1000; // Sample estimation
    const hasQuota = await reserveCredits(organizationId, ESTIMATED_CREDITS);
    
    if (!hasQuota) {
      console.warn(`Org ${organizationId} has insufficient credits.`);
      await prisma.contentRequest.update({
        where: { id: requestId },
        data: { status: "FAILED" },
      });
      return; // Job fails due to quota
    }

    try {
      // 1. Update Request Status
      await prisma.contentRequest.update({
        where: { id: requestId },
        data: { status: "PROCESSING" },
      });

      // 2. Generate AI Content (Text + Image Prompt)
      const aiResponse = await generateContent(topic);

      // 3. Save Generated Text
      await prisma.generatedText.create({
        data: {
          organizationId,
          requestId,
          headline: aiResponse.headline,
          bodyCopy: aiResponse.body,
          // tokensUsed: ..., 
          modelVersion: "gemini-1.5-pro",
        },
      });

      // 4. Save Generated Image (Metadata only for now)
      await prisma.generatedImage.create({
        data: {
          organizationId,
          requestId,
          imageUrl: "https://via.placeholder.com/1024x1024.png?text=AI+Generated+Image", // Placeholder
          promptUsed: aiResponse.imagePrompt,
          stylePreset: "Photorealistic",
        },
      });

      // 5. Update Request Status to Completed
      await prisma.contentRequest.update({
        where: { id: requestId },
        data: { status: "COMPLETED" },
      });

      console.log(`Job ${job.id} completed successfully for Org ${organizationId}`);
    } catch (error) {
      console.error(`Job ${job.id} failed:`, error);
      
      await prisma.contentRequest.update({
        where: { id: requestId },
        data: { status: "FAILED" },
      });
      
      throw error; // Let BullMQ handle retries
    }
  },
  { connection: redisConnection as any }
);
