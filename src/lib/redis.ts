import IORedis from "ioredis";

const connection = {
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT || "6379"),
};

const redis = new IORedis({
  ...connection,
  maxRetriesPerRequest: null,
  lazyConnect: true,
  enableOfflineQueue: false,
  retryStrategy(times) {
    if (times > 2) return null; // Don't hang node indefinitely if Redis is down
    return Math.min(times * 200, 1000);
  },
});

// Suppress unhandled error crashes when Redis is offline in local development
redis.on("error", (err) => {
  // Gracefully ignored for local fallback
});

export default redis;
