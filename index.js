import cachingProxy from "./proxy.js";

export function cacheProxy() {
  const params = process.argv.slice(2);
  let port, origin;

  if (params[0] === "--clear-cache") process.exit(1);

  for (let i = 0; i < params.length; i++) {
    if (params[i] === "--port") {
      port = parseInt(params[i + 1]);
    }
    if (params[i] === "--origin") {
      origin = params[i + 1];
    }
  }

  cachingProxy(port, origin);
}
