# caching-proxy

A high-performance HTTP caching proxy server built with Node.js, Express, and Redis. This tool acts as a reverse proxy that caches responses from target APIs to reduce load and improve response times.

## Features

- 🚀 **HTTP Proxy Server**: Forward requests to any target origin
- 💾 **Redis Caching**: Cache responses with configurable TTL
- 🔍 **Cache Headers**: Automatic `X-cache: HIT/MISS` headers
- 📊 **Request Logging**: Detailed logging of all proxied requests
- 🛠️ **CLI Interface**: Easy-to-use command-line interface
- ⚡ **High Performance**: Built with Express.js and Redis for speed

## Prerequisites

- Node.js 16+
- Redis server running (locally or remote)
- npm or yarn

## Installation

### Local Development

Clone the repository and install dependencies:

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

### Basic Usage

Start the caching proxy server:

```bash
caching-proxy --port 3000 --origin api.restful-api.dev
```

### CLI Options

- `--port <number>`: Port to run the proxy server (default: 3000)
- `--origin <string>`: Target origin server to proxy requests to

### Examples

```bash
# Proxy requests to JSONPlaceholder API
caching-proxy --port 3000 --origin jsonplaceholder.typicode.com

# Proxy to a custom API server
caching-proxy --port 8080 --origin api.example.com

# Local development
node bin/bin.js --port 3000 --origin httpbin.org
```

### Testing the Proxy

Once running, test with curl or any HTTP client:

```bash
# First request (cache miss)
curl http://localhost:3000/posts/1
# Response includes: X-cache: MISS

# Second request (cache hit)
curl http://localhost:3000/posts/1
# Response includes: X-cache: HIT
```

## How It Works

1. **Request Reception**: The proxy receives HTTP requests on the specified port
2. **Cache Check**: Checks Redis for a cached response using `METHOD:URL` as the key
3. **Cache Hit**: If found, returns cached response with `X-cache: HIT` header
4. **Cache Miss**: If not found, forwards request to origin server
5. **Response Caching**: Stores the origin response in Redis with `X-cache: MISS` header
6. **Response Delivery**: Returns the response to the client

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

# Run locally
node bin/bin.js --port 3000 --origin httpbin.org
```

### Technical Notes

- **Shebang**: The CLI file includes `#!/usr/bin/env node` to ensure proper execution
- **ESM Modules**: Uses ES6 import/export syntax (`"type": "module"` in package.json)
- **Error Handling**: Graceful error handling with appropriate HTTP status codes
- **JSON Serialization**: Safe Redis storage using JSON.stringify/parse

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
