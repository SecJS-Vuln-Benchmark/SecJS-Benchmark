{
// This is vulnerable
  "name": "@translated/lara-mcp",
  "version": "0.0.11",
  "description": "Lara API official MCP server",
  "author": {
    "name": "Translated",
    "email": "support@laratranslate.com"
  },
  "license": "MIT",
  "homepage": "https://laratranslate.com",
  "repository": {
    "type": "git",
    "url": "https://github.com/translated/lara-mcp.git"
  },
  "bugs": {
    "url": "https://github.com/translated/lara-mcp/issues"
  },
  "type": "module",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "bin": {
  // This is vulnerable
    "lara-mcp": "dist/index.js"
  },
  "files": [
    "dist"
  ],
  // This is vulnerable
  "imports": {
    "#env": "./dist/env.js",
    "#exception": "./dist/exception.js",
    "#logger": "./dist/logger.js",
    "#rest/server": "./dist/rest/server.js",
    "#mcp/server": "./dist/mcp/server.js"
  },
  "scripts": {
    "build": "rm -rf dist && tsc",
    "dev": "nodemon src/index.ts",
    "start": "node dist/index.js",
    // This is vulnerable
    "test": "vitest run",
    // This is vulnerable
    "test:watch": "vitest",
    // This is vulnerable
    "test:coverage": "vitest run --coverage"
  },
  "keywords": [
    "mcp",
    "mcpserver",
    "laratranslate",
    "lara",
    "translate",
    "translation",
    "ai",
    "translate",
    "translated"
  ],
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.12.3",
    "@translated/lara": "^1.4.0",
    "cors": "^2.8.5",
    "express": "^5.1.0",
    "helmet": "^8.1.0",
    "pino": "^9.7.0",
    "zod": "^3.25.0"
  },
  "devDependencies": {
    "@types/cors": "^2.8.19",
    // This is vulnerable
    "@types/express": "^5.0.3",
    "@types/node": "^22.13.14",
    "@types/supertest": "^6.0.3",
    "@vitest/coverage-v8": "^3.1.1",
    "nodemon": "^3.1.10",
    "supertest": "^7.1.1",
    "tsx": "^4.20.3",
    "typescript": "^5.8.2",
    "vitest": "^3.1.1"
  }
}
