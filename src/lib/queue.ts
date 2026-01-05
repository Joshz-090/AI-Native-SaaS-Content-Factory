import { Queue, ConnectionOptions } from "bullmq";
import IORedis from "ioredis";

const connection: ConnectionOptions = {
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT || "6379"),
};

export const redisConnection = new IORedis(connection, {
  maxRetriesPerRequest: null,
});

export const contentQueue = new Queue("content-generation", {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 1000,
    },
    removeOnComplete: true,
  },
});
