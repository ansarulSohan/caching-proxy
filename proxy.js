import axios from "axios";
import express from "express";
import { redisClient } from "./cache.js";

const cachingProxy = (port, origin) => {
  const app = express();
  app.use(express.json());

  app.use(async (req, res) => {
    const PROTOCOL = "https";
    const path = req.url !== "/" ? req.url : "";
    const URL = `${PROTOCOL}://${origin}${path}`;
    const key = `${req.method}:${URL}`;
    console.log(key);

    try {
      const cache = await redisClient();

      const cacheResponseStringified = await cache.get(key);
      const cacheResponse = JSON.parse(cacheResponseStringified);

      if (!cacheResponse) {
        const { data, status } = await axios.get(URL);

        if (status !== 200 || !data) {
          return res.status(500).json({ msg: "Internal Server Error" });
        }
        await cache.set(key, JSON.stringify({ status, data }));

        return res.status(status).set("X-cache", "MISS").send(data);
      }

      return res
        .status(cacheResponse.status)
        .set("X-cache", "HIT")
        .send(cacheResponse.data);
    } catch (error) {
      return res.send(error);
    }
  });

  app.listen(port ?? 3000, () => {
    console.log("proxy server running at " + port);
  });
};
export default cachingProxy;
