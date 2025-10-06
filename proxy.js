import axios from "axios";
import express from "express";
import cache from "./cache.js";

const cachingProxy = (port, origin) => {
  const app = express();

  app.use(async (req, res) => {
    const key = req.method + ":" + "https://" + origin + req.url;
    const client = await cache();
    let responded = false;
    try {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
      const cacheRes = await client.get(key);
      if (cacheRes) {
        // Cache hit: parse and send cached data
        const cached = JSON.parse(cacheRes);
        res.status(cached.status).set({ ...cached.headers, "X-cache": "HIT" });
        res.json(cached.data);
        responded = true;
        return;
      }

      // Cache miss: fetch from origin
      const response = await axios({
        url: "https://" + origin + req.url,
        method: req.method,
        responseType: "stream",
        headers: {
          ...req.headers,
          host: origin,
          "user-agent": req.headers["user-agent"] || "Mozilla/5.0",
        },
        timeout: 10000, // 10s timeout
        data: ["POST", "PUT", "PATCH", "DELETE"].includes(req.method)
          ? { ...req.body }
          : undefined,
      });
      // Store only plain data in Redis
      await client.set(
        key,
        JSON.stringify({
          status: response.status,
          headers: response.headers,
          data: response.data,
        })
      );

      res
        .status(response.status)
        .set({ ...response.headers, "X-cache": "MISS" });
      res.json(response.data);
      responded = true;
      return;
    } catch (err) {
      // Error handling
      console.error("Proxy error:", err);
      if (!responded) {
        res
          .status(502)
          .json({ error: "Proxy request failed", details: err.message });
      }
    }
  });

  // Start server
  app.listen(port, () => {
    console.log(`proxy server is running on port ${port}`);
  });
};

export default cachingProxy;
