import { clearCache, redisClient } from "./cache.js";
import cachingProxy from "./proxy.js";

export function cacheProxy() {
  const params = process.argv.slice(2);
  let port, origin;

  for (let i = 0; i < params.length; i++) {
    if (params[i] === "--port") {
      port = parseInt(params[i + 1]);
    }
    if (params[i] === "--origin") {
      origin = params[i + 1];
    }

    if (params[i] === "--clear-cache") {
      redisClient().then((cache) => {
        clearCache(cache);
      });
    }
  }

  cachingProxy(port, origin);
}
