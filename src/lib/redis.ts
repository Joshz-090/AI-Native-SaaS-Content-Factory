import IORedis from "ioredis";

const connection = {
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT || "6379"),
};

const redis = new IORedis({
  ...connection,
  maxRetriesPerRequest: null,
});

export default redis;
