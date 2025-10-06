import axios from "axios";
import express from "express";
import redisClient from "./cache.js";

const cachingProxy = (port, origin) => {
  const app = express();
  app.use(express.json());

  app.use(async (req, res) => {
    const PROTOCOL = req.protocol || "https";
    const URL = `${PROTOCOL}://${origin}${req.url}`;
    const key = `${req.method}:${URL}`;
    console.log(key);

    const cache = await redisClient();

    const cacheResponseStringified = await cache.get(key);
    const cacheResponse = JSON.parse(cacheResponseStringified);

    if (!cacheResponse) {
      const { headers, data, status } = await axios({
        url: URL,
        method: req.method,
        responseType: "json",
        headers: {
          ...req.headers,
          host: origin,
          "user-agent": req.headers["user-agent"] || "Mozilla/5.0",
        },
        data: ["POST", "PUT", "PATCH", "DELETE"].includes(req.method)
          ? { ...req.body }
          : undefined,
      });

      if (status !== 200 || !data) {
        return res.status(500).json({ msg: "Internal Server Error" });
      }

      console.log(status);

      await cache.set(key, JSON.stringify({ headers, status, data }));

      return res
        .status(status)
        .set({ ...headers, "X-cache": "MISS" })
        .send(data);
    }

    return res
      .status(cacheResponse.status)
      .set({ ...cacheResponse.headers, "X-cache": "HIT" })
      .send(cacheResponse.data);
  });

  app.listen(port ?? 3000, () => {
    console.log("proxy server running at " + port);
  });
};
export default cachingProxy;
