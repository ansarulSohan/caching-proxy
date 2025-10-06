import { createClient } from "redis";

const cache = async () => {
  const client = await createClient()
    .on("error", (err) => {
      console.log(`error connecting to redis: ${error}`);
      process.exit(1);
    })
    .connect();
  return client;
};

export default cache;
