import { createClient } from "redis";

const redisClient = async () => {
  const client = await createClient()
    .on("error", (err) => {
      console.log(`error connecting to redis: ${error}`);
      process.exit(1);
    })
    .connect();
  return client;
};

const clearCache = async (cache) => {
  console.log("Clearing Cache...");
  await cache.flushDb();
  console.log("Cache Cleared");
  process.exit(0);
};

export { clearCache, redisClient };
