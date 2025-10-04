# caching-proxy

A simple Node.js caching proxy CLI tool.

## Features

- Express-based proxy server
- Caching support
- Simple CLI interface

## Installation

Clone the repo and install dependencies:

```bash
git clone <repo-url>
cd caching-proxy
npm install
```

To use as a global CLI:

```bash
npm install -g .
```

## Usage

Run the CLI:

```bash
caching-proxy hello
```

Or locally:

```bash
node bin/bin.js hello
```

You should see:

```
Caching proxy started...
```

## CLI Arguments

Currently, the CLI just runs the `cacheProxy` function. You can extend it to accept more arguments as needed.

## Development

Main files:

- `index.js`: Exports the main `cacheProxy` function
- `bin/bin.js`: CLI entry point (with Node shebang)

### Shebang Note

The CLI file `bin/bin.js` starts with a Node shebang (`#!/usr/bin/env node`). This ensures the file is executed by Node.js, not your shell, and prevents errors like `import: command not found`.

## License

ISC
