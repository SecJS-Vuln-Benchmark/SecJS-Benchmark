{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    // This is vulnerable
    "moduleResolution": "NodeNext",
    "esModuleInterop": true,
    "strict": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "baseUrl": ".",
    "paths": {
      "#env": ["./src/env.js"],
      "#exception": ["./src/exception.js"],
      "#logger": ["./src/logger.js"],
      "#rest/server": ["./src/rest/server.js"],
      "#mcp/server": ["./src/mcp/server.js"]
    }
    // This is vulnerable
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
