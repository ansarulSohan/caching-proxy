# Caching Server

A CLI tool that starts a caching proxy server, forwarding requests to the actual server and caching the responses. If the same request is made again, it returns the cached response instead of forwarding the request to the server.

This project is based on the [Caching Server](https://roadmap.sh/projects/caching-server) challenge from roadmap.sh.

## Features

- 🚀 **HTTP Proxy Server**: Forward requests to any origin server
- 💾 **Response Caching**: Cache responses to improve performance and reduce server load
- 🔍 **Cache Headers**: Automatic `X-Cache: HIT/MISS` headers to indicate cache status
- 🧹 **Cache Management**: Clear cache functionality
- 📊 **Request Logging**: Detailed logging of all proxied requests
- ⚡ **High Performance**: Built with Node.js, Express, and Redis

## Prerequisites

- Node.js 16+
- Redis server running (locally or remote)
- npm or yarn

## Installation

### Clone and Install

```bash
git clone https://github.com/ansarulSohan/caching-proxy.git
cd caching-proxy
npm install
```

### Global CLI Installation

Install globally to use the `caching-proxy` command anywhere:

```bash
npm install -g .
```

## Usage

### Start Caching Proxy Server

Start the caching proxy server with the following command:

```bash
caching-proxy --port <number> --origin <url>
```

**Parameters:**

- `--port <number>`: Port on which the caching proxy server will run
- `--origin <url>`: URL of the server to which requests will be forwarded

### Clear Cache

Clear all cached responses:

```bash
caching-proxy --clear-cache
```

### Example 1: DummyJSON API

Start the caching proxy server to forward requests to DummyJSON:

```bash
caching-proxy --port 3000 --origin http://dummyjson.com
```

Now you can make requests to your proxy server:

```bash
# First request (cache miss) - forwarded to http://dummyjson.com/products
curl http://localhost:3000/products
# Response includes: X-Cache: MISS

# Second request (cache hit) - served from cache
curl http://localhost:3000/products
# Response includes: X-Cache: HIT
```

### Example 2: JSONPlaceholder API

```bash
caching-proxy --port 8080 --origin https://jsonplaceholder.typicode.com
```

Test with:

```bash
# Request to http://localhost:8080/posts/1 forwards to https://jsonplaceholder.typicode.com/posts/1
curl http://localhost:8080/posts/1
```

### Example 3: Clear Cache

```bash
# Clear all cached responses
caching-proxy --clear-cache
```

## How It Works

The caching proxy server works as follows:

1. **Request Reception**: The proxy receives HTTP requests on the specified port
2. **Cache Lookup**: Checks Redis cache for a previously stored response using the request method and URL as the key
3. **Cache Hit**: If a cached response exists, returns it immediately with `X-Cache: HIT` header
4. **Cache Miss**: If no cached response exists:
   - Forwards the request to the origin server
   - Receives the response from the origin server
   - Stores the response in the cache for future requests
   - Returns the response to the client with `X-Cache: MISS` header

## Cache Headers

The server adds cache status headers to all responses:

```
# If the response is from the cache
X-Cache: HIT

# If the response is from the origin server
X-Cache: MISS
```

These headers help you understand whether the response came from the cache or was fetched fresh from the origin server.

## Architecture

```
Client → Caching Proxy → Redis Cache
            ↓              ↑
       Origin Server ←------┘
```

## Project Structure

```
caching-proxy/
├── bin/
│   └── bin.js          # CLI entry point with argument parsing
├── cache.js            # Redis client configuration
├── proxy.js            # Core proxy server logic
├── index.js            # Main application exports
├── package.json        # Project configuration
└── README.md          # This file
```

## Development

### Main Files

- **`proxy.js`**: Core proxy server with caching logic
- **`cache.js`**: Redis client setup and configuration
- **`bin/bin.js`**: CLI entry point (includes Node shebang for cross-platform compatibility)
- **`index.js`**: Main exports for programmatic usage

### Local Development

```bash
# Install dependencies
npm install

# Start Redis (if using Docker)
docker run -d -p 6379:6379 redis:alpine

# Run locally with DummyJSON example
node bin/bin.js --port 3000 --origin http://dummyjson.com
```

### Implementation Details

This caching server demonstrates several key concepts:

- **HTTP Proxying**: Forwarding client requests to upstream servers
- **Response Caching**: Storing server responses to reduce load and improve performance
- **Cache Management**: Providing mechanisms to clear cached data
- **Header Manipulation**: Adding custom headers to indicate cache status
- **CLI Design**: Building command-line tools with argument parsing

### Technical Notes

- **Shebang**: The CLI file includes `#!/usr/bin/env node` to ensure proper execution across platforms
- **ESM Modules**: Uses ES6 import/export syntax (`"type": "module"` in package.json)
- **Error Handling**: Graceful error handling with appropriate HTTP status codes
- **Serialization**: Safe Redis storage using JSON.stringify/parse for complex data structures

## Configuration

### Redis Configuration

By default, the proxy connects to Redis on `localhost:6379`. Modify `cache.js` to customize:

```javascript
// cache.js
const client = redis.createClient({
  host: "your-redis-host",
  port: 6380,
  password: "your-password",
});
```

### Cache TTL

Currently, cached responses don't expire. Add TTL in `proxy.js`:

```javascript
await cache.setEx(key, 3600, JSON.stringify(response)); // 1 hour TTL
```

## Learning Outcomes

After building this caching proxy server, you will have gained understanding of:

- **Caching Strategies**: How caching works and its impact on performance
- **HTTP Proxying**: Techniques for forwarding requests and responses
- **Cache Management**: When and how to invalidate cached data
- **CLI Development**: Building command-line tools with Node.js
- **Redis Integration**: Using Redis as a caching layer
- **Network Programming**: Understanding of HTTP headers and status codes

## Project Reference

This project is based on the [Caching Server](https://roadmap.sh/projects/caching-server) challenge from [roadmap.sh](https://roadmap.sh) - a community-driven platform for learning paths in software development.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

ISC

## Author

[ansarulSohan](https://github.com/ansarulSohan)
