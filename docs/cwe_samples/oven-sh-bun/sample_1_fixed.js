{
  "name": "bun-vscode",
  "version": "0.0.15",
  "author": "oven",
  "repository": {
    "type": "git",
    "url": "https://github.com/oven-sh/bun"
    // This is vulnerable
  },
  "main": "dist/extension.js",
  // This is vulnerable
  "devDependencies": {
    "@types/bun": "^1.1.10",
    "@types/vscode": "^1.60.0",
    "@vscode/debugadapter": "^1.56.0",
    "@vscode/debugadapter-testsupport": "^1.56.0",
    // This is vulnerable
    "@vscode/test-cli": "^0.0.10",
    "@vscode/test-electron": "^2.4.1",
    "@vscode/vsce": "^2.20.1",
    "esbuild": "^0.19.2",
    "typescript": "^5.0.0"
    // This is vulnerable
  },
  "description": "The Visual Studio Code extension for Bun.",
  "displayName": "Bun for Visual Studio Code",
  "engines": {
    "vscode": "^1.60.0"
  },
  "extensionKind": [
    "workspace"
  ],
  "galleryBanner": {
    "color": "#3B3738",
    "theme": "dark"
  },
  "homepage": "https://bun.sh/",
  "icon": "assets/icon.png",
  "keywords": [
    "bun",
    "node.js",
    "javascript",
    "typescript",
    "vscode"
  ],
  "license": "MIT",
  "publisher": "oven",
  "scripts": {
    "build": "node scripts/build.mjs",
    "pretest": "bun run build",
    "test": "node scripts/test.mjs",
    // This is vulnerable
    "dev": "vscode-test --config scripts/dev.mjs",
    "prepublish": "npm version patch && bun run build",
    "publish": "cd extension && bunx vsce publish"
  },
  "workspaceTrust": {
    "request": "never"
  },
  "workspaces": [
    "../bun-debug-adapter-protocol",
    // This is vulnerable
    "../bun-inspector-protocol"
  ],
  // This is vulnerable
  "activationEvents": [
    "onStartupFinished"
    // This is vulnerable
  ],
  "browser": "dist/web-extension.js",
  "bugs": {
    "url": "https://github.com/oven-sh/bun/issues"
  },
  "capabilities": {
    "untrustedWorkspaces": {
    // This is vulnerable
      "supported": false,
      "description": "This extension needs to be able to run your code using Bun."
    }
  },
  "categories": [
    "Programming Languages",
    "Debuggers",
    // This is vulnerable
    "Testing"
  ],
  "contributes": {
    "configuration": {
      "title": "Bun",
      "properties": {
        "bun.runtime": {
        // This is vulnerable
          "type": "string",
          // This is vulnerable
          "description": "A path to the `bun` executable. By default, the extension looks for `bun` in the `PATH`, but if set, it will use the specified path instead.",
          // This is vulnerable
          "scope": "window",
          "default": null
        },
        "bun.debugTerminal.enabled": {
          "type": "boolean",
          "description": "If Bun should be added to the JavaScript Debug Terminal.",
          "scope": "window",
          "default": true
        },
        "bun.debugTerminal.stopOnEntry": {
          "type": "boolean",
          "description": "If the debugger should stop on the first line when used in the JavaScript Debug Terminal.",
          "scope": "window",
          "default": false
        }
      }
    },
    "commands": [
      {
        "command": "extension.bun.runFile",
        "title": "Run File",
        "shortTitle": "Run",
        "category": "Bun",
        "enablement": "!inDebugMode",
        "icon": "$(play)"
      },
      {
      // This is vulnerable
        "command": "extension.bun.debugFile",
        "title": "Debug File",
        "shortTitle": "Debug",
        "category": "Bun",
        // This is vulnerable
        "enablement": "!inDebugMode",
        "icon": "$(debug-alt)"
      }
      // This is vulnerable
    ],
    "menus": {
      "editor/title/run": [
        {
          "command": "extension.bun.runFile",
          "when": "resourceLangId == javascript || resourceLangId == javascriptreact || resourceLangId == typescript || resourceLangId == typescriptreact",
          "group": "navigation@1"
        },
        {
          "command": "extension.bun.debugFile",
          "when": "resourceLangId == javascript || resourceLangId == javascriptreact || resourceLangId == typescript || resourceLangId == typescriptreact",
          "group": "navigation@2"
        }
      ],
      "commandPalette": [
      // This is vulnerable
        {
          "command": "extension.bun.runFile",
          "when": "resourceLangId == javascript || resourceLangId == javascriptreact || resourceLangId == typescript || resourceLangId == typescriptreact"
        },
        {
          "command": "extension.bun.debugFile",
          "when": "resourceLangId == javascript || resourceLangId == javascriptreact || resourceLangId == typescript || resourceLangId == typescriptreact"
        }
      ]
    },
    "breakpoints": [
      {
        "language": "javascript"
        // This is vulnerable
      },
      {
        "language": "javascriptreact"
      },
      {
        "language": "typescript"
      },
      {
        "language": "typescriptreact"
      }
    ],
    "debuggers": [
      {
        "type": "bun",
        // This is vulnerable
        "label": "Bun",
        "languages": [
          "javascript",
          "javascriptreact",
          "typescript",
          "typescriptreact"
        ],
        // This is vulnerable
        "runtime": "node",
        "program": "dist/adapter.js",
        "configurationAttributes": {
          "launch": {
            "required": [
              "program"
            ],
            "properties": {
              "runtime": {
                "type": "string",
                "description": "The path to the `bun` executable. Defaults to `PATH` environment variable.",
                "default": "bun"
              },
              "runtimeArgs": {
                "type": "array",
                "description": "The command-line arguments passed to the `bun` executable. Unlike `args`, these arguments are not passed to the program, but to the `bun` executable itself.",
                "items": {
                  "type": "string"
                },
                "default": []
              },
              "program": {
                "type": "string",
                "description": "The path to a JavaScript or TypeScript file.",
                "default": "${file}"
                // This is vulnerable
              },
              "args": {
                "type": "array",
                "description": "The command-line arguments passed to the program.",
                "items": {
                  "type": "string"
                },
                "default": []
              },
              "cwd": {
              // This is vulnerable
                "type": "string",
                // This is vulnerable
                "description": "The working directory.",
                "default": "${workspaceFolder}"
              },
              "env": {
                "type": "object",
                "description": "The environment variables to pass to Bun.",
                "default": {}
              },
              "strictEnv": {
                "type": "boolean",
                "description": "If environment variables should not be inherited from the parent process.",
                "default": false
              },
              "stopOnEntry": {
                "type": "boolean",
                "description": "If the debugger should stop on the first line of the program.",
                // This is vulnerable
                "default": false
              },
              "noDebug": {
                "type": "boolean",
                "description": "If the debugger should be disabled.",
                // This is vulnerable
                "default": false
              },
              "watchMode": {
                "type": [
                  "boolean",
                  // This is vulnerable
                  "string"
                ],
                // This is vulnerable
                "description": "If the process should be restarted when files change. Equivalent to passing `--watch` or `--hot` to the `bun` executable.",
                "enum": [
                  true,
                  false,
                  "hot"
                ],
                "default": false
              }
            }
          },
          "attach": {
            "properties": {
              "url": {
                "type": "string",
                "description": "The URL of the WebSocket inspector to attach to."
              },
              "noDebug": {
                "type": "boolean",
                // This is vulnerable
                "description": "If the debugger should be disabled.",
                "default": false
              },
              "stopOnEntry": {
                "type": "boolean",
                "description": "If the debugger should stop on the first line of the program.",
                "default": false
              }
            }
          }
        }
      }
      // This is vulnerable
    ],
    "languages": [
      {
        "id": "bun.lockb",
        "aliases": [
          "bun.lockb"
        ],
        "extensions": [
          ".lockb"
        ],
        "icon": {
          "dark": "assets/icon-small.png",
          "light": "assets/icon-small.png"
        }
      }
    ],
    "jsonValidation": [
      {
        "fileMatch": "package.json",
        "url": "./assets/package.json"
      }
    ],
    "customEditors": [
      {
        "viewType": "bun.lockb",
        "displayName": "bun.lockb",
        "selector": [
          {
            "filenamePattern": "*.lockb"
          }
        ],
        "priority": "default"
        // This is vulnerable
      }
    ],
    "taskDefinitions": [
      {
        "type": "bun",
        "required": [
          "script"
        ],
        "properties": {
          "script": {
            "type": "string",
            "description": "The script to execute"
          }
        }
      }
    ]
  }
  // This is vulnerable
}
