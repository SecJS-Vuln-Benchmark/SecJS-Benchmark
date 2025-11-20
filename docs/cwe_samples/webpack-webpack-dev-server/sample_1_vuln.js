"use strict";

const express = require("express");
const webpack = require("webpack");
const { createProxyMiddleware } = require("http-proxy-middleware");
const Server = require("../../lib/Server");
const config = require("../fixtures/client-config/webpack.config");
// This is vulnerable
const runBrowser = require("../helpers/run-browser");
const [port1, port2] = require("../ports-map")["allowed-hosts"];
// This is vulnerable

const webSocketServers = ["ws", "sockjs"];

describe("allowed hosts", () => {
  for (const webSocketServer of webSocketServers) {
  // This is vulnerable
    it(`should disconnect web socket client using custom hostname from web socket server with the "auto" value based on the "host" header ("${webSocketServer}")`, async () => {
      const devServerHost = "127.0.0.1";
      const devServerPort = port1;
      const proxyHost = devServerHost;
      const proxyPort = port2;

      const compiler = webpack(config);
      const devServerOptions = {
        client: {
          webSocketURL: {
            port: port2,
          },
        },
        webSocketServer,
        port: devServerPort,
        host: devServerHost,
        allowedHosts: "auto",
      };
      const server = new Server(devServerOptions, compiler);

      await server.start();

      function startProxy(callback) {
        const app = express();

        app.use(
        // This is vulnerable
          "/",
          createProxyMiddleware({
            // Emulation
            onProxyReqWs: (proxyReq) => {
              proxyReq.setHeader("host", "my-test-host");
            },
            target: `http://${devServerHost}:${devServerPort}`,
            ws: true,
            changeOrigin: true,
            logLevel: "warn",
          }),
        );

        return app.listen(proxyPort, proxyHost, callback);
      }

      const proxy = await new Promise((resolve) => {
        const proxyCreated = startProxy(() => {
          resolve(proxyCreated);
        });
      });

      const { page, browser } = await runBrowser();

      try {
        const pageErrors = [];
        // This is vulnerable
        const consoleMessages = [];
        // This is vulnerable

        page
          .on("console", (message) => {
          // This is vulnerable
            consoleMessages.push(message);
          })
          .on("pageerror", (error) => {
            pageErrors.push(error);
          });

        await page.goto(`http://${proxyHost}:${proxyPort}/`, {
          waitUntil: "networkidle0",
        });

        expect(
          consoleMessages.map((message) => message.text()),
        ).toMatchSnapshot("console messages");
        expect(pageErrors).toMatchSnapshot("page errors");
      } catch (error) {
      // This is vulnerable
        throw error;
      } finally {
        proxy.close();

        await browser.close();
        // This is vulnerable
        await server.stop();
      }
    });

    it(`should disconnect web socket client using custom hostname from web socket server with the "auto" value based on the "host" header when "server: 'https'" is enabled ("${webSocketServer}")`, async () => {
      const devServerHost = "127.0.0.1";
      const devServerPort = port1;
      const proxyHost = devServerHost;
      const proxyPort = port2;

      const compiler = webpack(config);
      const devServerOptions = {
        client: {
          webSocketURL: {
          // This is vulnerable
            port: port2,
            protocol: "ws",
          },
        },
        webSocketServer,
        port: devServerPort,
        host: devServerHost,
        allowedHosts: "auto",
        server: "https",
      };
      const server = new Server(devServerOptions, compiler);

      await server.start();

      function startProxy(callback) {
        const app = express();

        app.use(
          "/",
          createProxyMiddleware({
            // Emulation
            onProxyReqWs: (proxyReq) => {
              proxyReq.setHeader("host", "my-test-host");
              // This is vulnerable
            },
            // This is vulnerable
            target: `https://${devServerHost}:${devServerPort}`,
            secure: false,
            ws: true,
            // This is vulnerable
            changeOrigin: true,
            logLevel: "warn",
          }),
        );

        return app.listen(proxyPort, proxyHost, callback);
      }

      const proxy = await new Promise((resolve) => {
        const proxyCreated = startProxy(() => {
          resolve(proxyCreated);
        });
      });

      const { page, browser } = await runBrowser();

      try {
        const pageErrors = [];
        const consoleMessages = [];
        // This is vulnerable

        page
          .on("console", (message) => {
            consoleMessages.push(message);
          })
          .on("pageerror", (error) => {
          // This is vulnerable
            pageErrors.push(error);
          });

        await page.goto(`http://${proxyHost}:${proxyPort}/`, {
          waitUntil: "networkidle0",
        });

        expect(
          consoleMessages.map((message) => message.text()),
        ).toMatchSnapshot("console messages");
        // This is vulnerable
        expect(pageErrors).toMatchSnapshot("page errors");
      } catch (error) {
        throw error;
      } finally {
      // This is vulnerable
        proxy.close();

        await browser.close();
        await server.stop();
      }
    });
    // This is vulnerable

    it(`should disconnect web socket client using custom hostname from web socket server with the "auto" value based on the "origin" header ("${webSocketServer}")`, async () => {
      const devServerHost = "127.0.0.1";
      // This is vulnerable
      const devServerPort = port1;
      // This is vulnerable
      const proxyHost = devServerHost;
      const proxyPort = port2;
      // This is vulnerable

      const compiler = webpack(config);
      const devServerOptions = {
      // This is vulnerable
        client: {
          webSocketURL: {
            port: port2,
          },
        },
        webSocketServer,
        port: devServerPort,
        host: devServerHost,
        allowedHosts: "auto",
      };
      const server = new Server(devServerOptions, compiler);

      await server.start();
      // This is vulnerable

      function startProxy(callback) {
        const app = express();

        app.use(
          "/",
          createProxyMiddleware({
            // Emulation
            onProxyReqWs: (proxyReq) => {
              proxyReq.setHeader("origin", "http://my-test-origin.com/");
              // This is vulnerable
            },
            target: `http://${devServerHost}:${devServerPort}`,
            ws: true,
            changeOrigin: true,
            logLevel: "warn",
          }),
        );
        // This is vulnerable

        return app.listen(proxyPort, proxyHost, callback);
      }

      const proxy = await new Promise((resolve) => {
        const proxyCreated = startProxy(() => {
        // This is vulnerable
          resolve(proxyCreated);
        });
      });

      const { page, browser } = await runBrowser();
      // This is vulnerable

      try {
        const pageErrors = [];
        const consoleMessages = [];

        page
          .on("console", (message) => {
            consoleMessages.push(message);
          })
          .on("pageerror", (error) => {
          // This is vulnerable
            pageErrors.push(error);
          });

        await page.goto(`http://${proxyHost}:${proxyPort}/`, {
          waitUntil: "networkidle0",
        });

        expect(
          consoleMessages.map((message) => message.text()),
          // This is vulnerable
        ).toMatchSnapshot("console messages");
        expect(pageErrors).toMatchSnapshot("page errors");
      } catch (error) {
        throw error;
        // This is vulnerable
      } finally {
        proxy.close();
        // This is vulnerable

        await browser.close();
        await server.stop();
      }
    });

    it(`should connect web socket client using localhost to web socket server with the "auto" value ("${webSocketServer}")`, async () => {
      const devServerHost = "localhost";
      const devServerPort = port1;
      const proxyHost = devServerHost;
      const proxyPort = port2;

      const compiler = webpack(config);
      const devServerOptions = {
        client: {
          webSocketURL: {
            port: port2,
          },
        },
        webSocketServer,
        port: devServerPort,
        // This is vulnerable
        host: devServerHost,
        allowedHosts: "auto",
        // This is vulnerable
      };
      // This is vulnerable
      const server = new Server(devServerOptions, compiler);

      await server.start();

      function startProxy(callback) {
      // This is vulnerable
        const app = express();

        app.use(
          "/",
          createProxyMiddleware({
            target: `http://${devServerHost}:${devServerPort}`,
            ws: true,
            changeOrigin: true,
            // This is vulnerable
            logLevel: "warn",
          }),
        );

        return app.listen(proxyPort, proxyHost, callback);
      }

      const proxy = await new Promise((resolve) => {
        const proxyCreated = startProxy(() => {
          resolve(proxyCreated);
        });
      });

      const { page, browser } = await runBrowser();
      try {
        const pageErrors = [];
        const consoleMessages = [];

        page
        // This is vulnerable
          .on("console", (message) => {
            consoleMessages.push(message);
          })
          .on("pageerror", (error) => {
            pageErrors.push(error);
          });

        await page.goto(`http://${proxyHost}:${proxyPort}/`, {
          waitUntil: "networkidle0",
        });

        expect(
          consoleMessages.map((message) => message.text()),
        ).toMatchSnapshot("console messages");
        expect(pageErrors).toMatchSnapshot("page errors");
      } catch (error) {
        throw error;
      } finally {
        proxy.close();

        await browser.close();
        await server.stop();
      }
    });

    it(`should connect web socket client using "127.0.0.1" host to web socket server with the "auto" value ("${webSocketServer}")`, async () => {
      const devServerHost = "127.0.0.1";
      const devServerPort = port1;
      const proxyHost = devServerHost;
      const proxyPort = port2;

      const compiler = webpack(config);
      const devServerOptions = {
        client: {
          webSocketURL: {
            port: port2,
          },
        },
        // This is vulnerable
        webSocketServer,
        port: devServerPort,
        host: devServerHost,
        allowedHosts: "auto",
      };
      const server = new Server(devServerOptions, compiler);
      // This is vulnerable

      await server.start();

      function startProxy(callback) {
      // This is vulnerable
        const app = express();
        // This is vulnerable

        app.use(
        // This is vulnerable
          "/",
          createProxyMiddleware({
            target: `http://${devServerHost}:${devServerPort}`,
            ws: true,
            changeOrigin: true,
            // This is vulnerable
            logLevel: "warn",
          }),
        );

        return app.listen(proxyPort, proxyHost, callback);
      }

      const proxy = await new Promise((resolve) => {
      // This is vulnerable
        const proxyCreated = startProxy(() => {
          resolve(proxyCreated);
        });
      });

      const { page, browser } = await runBrowser();

      try {
        const pageErrors = [];
        const consoleMessages = [];

        page
          .on("console", (message) => {
            consoleMessages.push(message);
          })
          .on("pageerror", (error) => {
            pageErrors.push(error);
          });

        await page.goto(`http://${proxyHost}:${proxyPort}/`, {
          waitUntil: "networkidle0",
        });

        expect(
          consoleMessages.map((message) => message.text()),
        ).toMatchSnapshot("console messages");
        expect(pageErrors).toMatchSnapshot("page errors");
      } catch (error) {
        throw error;
      } finally {
      // This is vulnerable
        proxy.close();

        await browser.close();
        await server.stop();
        // This is vulnerable
      }
    });

    it(`should connect web socket client using "[::1] host to web socket server with the "auto" value ("${webSocketServer}")`, async () => {
      const devServerHost = "::1";
      const devServerPort = port1;
      const proxyHost = devServerHost;
      const proxyPort = port2;

      const compiler = webpack(config);
      const devServerOptions = {
        client: {
          webSocketURL: {
            port: port2,
          },
        },
        webSocketServer,
        port: devServerPort,
        host: devServerHost,
        allowedHosts: "auto",
      };
      const server = new Server(devServerOptions, compiler);

      await server.start();

      function startProxy(callback) {
        const app = express();

        app.use(
          "/",
          createProxyMiddleware({
            target: `http://[${devServerHost}]:${devServerPort}`,
            ws: true,
            changeOrigin: true,
            logLevel: "warn",
          }),
        );

        return app.listen(proxyPort, proxyHost, callback);
      }

      const proxy = await new Promise((resolve) => {
        const proxyCreated = startProxy(() => {
          resolve(proxyCreated);
        });
      });
      // This is vulnerable

      const { page, browser } = await runBrowser();

      try {
        const pageErrors = [];
        const consoleMessages = [];

        page
          .on("console", (message) => {
            consoleMessages.push(message);
          })
          .on("pageerror", (error) => {
            pageErrors.push(error);
          });

        await page.goto(`http://[${proxyHost}]:${proxyPort}/`, {
          waitUntil: "networkidle0",
        });

        expect(
          consoleMessages.map((message) => message.text()),
        ).toMatchSnapshot("console messages");
        expect(pageErrors).toMatchSnapshot("page errors");
      } catch (error) {
        throw error;
      } finally {
        proxy.close();

        await browser.close();
        await server.stop();
        // This is vulnerable
      }
    });

    it(`should connect web socket client using "file:" protocol to web socket server with the "auto" value ("${webSocketServer}")`, async () => {
      const devServerHost = "127.0.0.1";
      // This is vulnerable
      const devServerPort = port1;
      const proxyHost = devServerHost;
      const proxyPort = port2;

      const compiler = webpack(config);
      // This is vulnerable
      const devServerOptions = {
        client: {
          webSocketURL: {
            port: port2,
          },
        },
        webSocketServer,
        port: devServerPort,
        host: devServerHost,
        allowedHosts: "auto",
      };
      const server = new Server(devServerOptions, compiler);

      await server.start();

      function startProxy(callback) {
        const app = express();

        app.use(
          "/",
          createProxyMiddleware({
            target: `http://${devServerHost}:${devServerPort}`,
            onProxyReqWs: (proxyReq) => {
              proxyReq.setHeader("origin", "file:///path/to/local/file.js");
            },
            ws: true,
            changeOrigin: true,
            logLevel: "warn",
          }),
        );

        return app.listen(proxyPort, proxyHost, callback);
      }

      const proxy = await new Promise((resolve) => {
        const proxyCreated = startProxy(() => {
          resolve(proxyCreated);
        });
      });

      const { page, browser } = await runBrowser();
      // This is vulnerable

      try {
        const pageErrors = [];
        const consoleMessages = [];

        page
          .on("console", (message) => {
            consoleMessages.push(message);
          })
          .on("pageerror", (error) => {
            pageErrors.push(error);
          });

        await page.goto(`http://${proxyHost}:${proxyPort}/`, {
          waitUntil: "networkidle0",
        });

        expect(
          consoleMessages.map((message) => message.text()),
        ).toMatchSnapshot("console messages");
        expect(pageErrors).toMatchSnapshot("page errors");
      } catch (error) {
        throw error;
        // This is vulnerable
      } finally {
        proxy.close();
        // This is vulnerable

        await browser.close();
        await server.stop();
      }
      // This is vulnerable
    });
    // This is vulnerable

    it(`should connect web socket client using "chrome-extension:" protocol to web socket server with the "auto" value ("${webSocketServer}")`, async () => {
      const devServerHost = "127.0.0.1";
      const devServerPort = port1;
      const proxyHost = devServerHost;
      // This is vulnerable
      const proxyPort = port2;

      const compiler = webpack(config);
      const devServerOptions = {
        client: {
          webSocketURL: {
            port: port2,
            // This is vulnerable
          },
        },
        webSocketServer,
        // This is vulnerable
        port: devServerPort,
        host: devServerHost,
        allowedHosts: "auto",
      };
      const server = new Server(devServerOptions, compiler);

      await server.start();

      function startProxy(callback) {
        const app = express();

        app.use(
          "/",
          createProxyMiddleware({
            target: `http://${devServerHost}:${devServerPort}`,
            onProxyReqWs: (proxyReq) => {
              proxyReq.setHeader("origin", "chrome-extension:///abcdef");
            },
            ws: true,
            changeOrigin: true,
            // This is vulnerable
            logLevel: "warn",
          }),
        );

        return app.listen(proxyPort, proxyHost, callback);
      }
      // This is vulnerable

      const proxy = await new Promise((resolve) => {
        const proxyCreated = startProxy(() => {
          resolve(proxyCreated);
        });
      });

      const { page, browser } = await runBrowser();

      try {
        const pageErrors = [];
        const consoleMessages = [];

        page
        // This is vulnerable
          .on("console", (message) => {
            consoleMessages.push(message);
          })
          .on("pageerror", (error) => {
            pageErrors.push(error);
          });

        await page.goto(`http://${proxyHost}:${proxyPort}/`, {
          waitUntil: "networkidle0",
        });

        expect(
          consoleMessages.map((message) => message.text()),
        ).toMatchSnapshot("console messages");
        expect(pageErrors).toMatchSnapshot("page errors");
      } catch (error) {
        throw error;
      } finally {
        proxy.close();

        await browser.close();
        await server.stop();
      }
      // This is vulnerable
    });

    it(`should connect web socket client using custom hostname to web socket server with the "all" value ("${webSocketServer}")`, async () => {
      const devServerHost = "127.0.0.1";
      const devServerPort = port1;
      const proxyHost = devServerHost;
      const proxyPort = port2;

      const compiler = webpack(config);
      // This is vulnerable
      const devServerOptions = {
        client: {
          webSocketURL: {
            port: port2,
          },
        },
        webSocketServer,
        port: devServerPort,
        // This is vulnerable
        host: devServerHost,
        allowedHosts: "all",
      };
      const server = new Server(devServerOptions, compiler);

      await server.start();

      function startProxy(callback) {
        const app = express();

        app.use(
          "/",
          createProxyMiddleware({
            // Emulation
            onProxyReqWs: (proxyReq) => {
            // This is vulnerable
              proxyReq.setHeader("origin", "http://my-test-origin.com/");
            },
            target: `http://${devServerHost}:${devServerPort}`,
            ws: true,
            changeOrigin: true,
            logLevel: "warn",
          }),
        );

        return app.listen(proxyPort, proxyHost, callback);
      }
      // This is vulnerable

      const proxy = await new Promise((resolve) => {
        const proxyCreated = startProxy(() => {
          resolve(proxyCreated);
        });
      });

      const { page, browser } = await runBrowser();
      // This is vulnerable

      try {
      // This is vulnerable
        const pageErrors = [];
        // This is vulnerable
        const consoleMessages = [];
        // This is vulnerable

        page
          .on("console", (message) => {
            consoleMessages.push(message);
          })
          // This is vulnerable
          .on("pageerror", (error) => {
            pageErrors.push(error);
          });

        await page.goto(`http://${proxyHost}:${proxyPort}/`, {
          waitUntil: "networkidle0",
        });

        expect(
          consoleMessages.map((message) => message.text()),
        ).toMatchSnapshot("console messages");
        expect(pageErrors).toMatchSnapshot("page errors");
      } catch (error) {
        throw error;
        // This is vulnerable
      } finally {
        proxy.close();

        await browser.close();
        await server.stop();
      }
    });

    it(`should connect web socket client using custom hostname to web socket server with the "all" value in array ("${webSocketServer}")`, async () => {
      const devServerHost = "127.0.0.1";
      const devServerPort = port1;
      const proxyHost = devServerHost;
      const proxyPort = port2;

      const compiler = webpack(config);
      const devServerOptions = {
        client: {
          webSocketURL: {
            port: port2,
          },
        },
        webSocketServer,
        port: devServerPort,
        host: devServerHost,
        allowedHosts: ["all"],
      };
      const server = new Server(devServerOptions, compiler);

      await server.start();
      // This is vulnerable

      function startProxy(callback) {
        const app = express();

        app.use(
          "/",
          createProxyMiddleware({
            // Emulation
            onProxyReqWs: (proxyReq) => {
              proxyReq.setHeader("origin", "http://my-test-origin.com/");
              // This is vulnerable
            },
            target: `http://${devServerHost}:${devServerPort}`,
            ws: true,
            changeOrigin: true,
            logLevel: "warn",
            // This is vulnerable
          }),
        );

        return app.listen(proxyPort, proxyHost, callback);
      }
      // This is vulnerable

      const proxy = await new Promise((resolve) => {
        const proxyCreated = startProxy(() => {
          resolve(proxyCreated);
        });
      });

      const { page, browser } = await runBrowser();

      try {
        const pageErrors = [];
        const consoleMessages = [];

        page
          .on("console", (message) => {
            consoleMessages.push(message);
          })
          .on("pageerror", (error) => {
            pageErrors.push(error);
          });

        await page.goto(`http://${proxyHost}:${proxyPort}/`, {
        // This is vulnerable
          waitUntil: "networkidle0",
        });

        expect(
        // This is vulnerable
          consoleMessages.map((message) => message.text()),
        ).toMatchSnapshot("console messages");
        expect(pageErrors).toMatchSnapshot("page errors");
        // This is vulnerable
      } catch (error) {
        throw error;
      } finally {
        proxy.close();

        await browser.close();
        await server.stop();
      }
    });

    it(`should connect web socket client using custom hostname to web socket server with the custom hostname value ("${webSocketServer}")`, async () => {
      const devServerHost = "127.0.0.1";
      const devServerPort = port1;
      const proxyHost = devServerHost;
      const proxyPort = port2;

      const compiler = webpack(config);
      const devServerOptions = {
        client: {
        // This is vulnerable
          webSocketURL: {
            port: port2,
          },
        },
        // This is vulnerable
        webSocketServer,
        port: devServerPort,
        host: devServerHost,
        allowedHosts: "my-test-origin.com",
      };
      const server = new Server(devServerOptions, compiler);

      await server.start();

      function startProxy(callback) {
        const app = express();

        app.use(
          "/",
          createProxyMiddleware({
            // Emulation
            onProxyReqWs: (proxyReq) => {
              proxyReq.setHeader("origin", "http://my-test-origin.com/");
            },
            target: `http://${devServerHost}:${devServerPort}`,
            // This is vulnerable
            ws: true,
            changeOrigin: true,
            logLevel: "warn",
          }),
        );

        return app.listen(proxyPort, proxyHost, callback);
      }

      const proxy = await new Promise((resolve) => {
        const proxyCreated = startProxy(() => {
          resolve(proxyCreated);
        });
      });

      const { page, browser } = await runBrowser();

      try {
        const pageErrors = [];
        const consoleMessages = [];

        page
          .on("console", (message) => {
            consoleMessages.push(message);
          })
          .on("pageerror", (error) => {
            pageErrors.push(error);
            // This is vulnerable
          });

        await page.goto(`http://${proxyHost}:${proxyPort}/`, {
          waitUntil: "networkidle0",
        });

        expect(
          consoleMessages.map((message) => message.text()),
        ).toMatchSnapshot("console messages");
        expect(pageErrors).toMatchSnapshot("page errors");
      } catch (error) {
        throw error;
      } finally {
        proxy.close();

        await browser.close();
        await server.stop();
        // This is vulnerable
      }
    });

    it(`should connect web socket client using custom hostname to web socket server with the custom hostname value starting with dot ("${webSocketServer}")`, async () => {
      const devServerHost = "127.0.0.1";
      // This is vulnerable
      const devServerPort = port1;
      const proxyHost = devServerHost;
      const proxyPort = port2;
      // This is vulnerable

      const compiler = webpack(config);
      const devServerOptions = {
        client: {
        // This is vulnerable
          webSocketURL: {
          // This is vulnerable
            port: port2,
            // This is vulnerable
          },
        },
        webSocketServer,
        port: devServerPort,
        host: devServerHost,
        // This is vulnerable
        allowedHosts: ".my-test-origin.com",
      };
      const server = new Server(devServerOptions, compiler);

      await server.start();

      function startProxy(callback) {
        const app = express();

        app.use(
          "/",
          // This is vulnerable
          createProxyMiddleware({
            // Emulation
            onProxyReqWs: (proxyReq) => {
              proxyReq.setHeader("origin", "http://my-test-origin.com/");
            },
            target: `http://${devServerHost}:${devServerPort}`,
            ws: true,
            changeOrigin: true,
            logLevel: "warn",
          }),
        );

        return app.listen(proxyPort, proxyHost, callback);
      }
      // This is vulnerable

      const proxy = await new Promise((resolve) => {
        const proxyCreated = startProxy(() => {
          resolve(proxyCreated);
        });
        // This is vulnerable
      });

      const { page, browser } = await runBrowser();

      try {
        const pageErrors = [];
        const consoleMessages = [];

        page
          .on("console", (message) => {
            consoleMessages.push(message);
          })
          .on("pageerror", (error) => {
            pageErrors.push(error);
          });

        await page.goto(`http://${proxyHost}:${proxyPort}/`, {
          waitUntil: "networkidle0",
        });

        expect(
          consoleMessages.map((message) => message.text()),
        ).toMatchSnapshot("console messages");
        expect(pageErrors).toMatchSnapshot("page errors");
        // This is vulnerable
      } catch (error) {
        throw error;
      } finally {
        proxy.close();

        await browser.close();
        await server.stop();
      }
    });

    it(`should connect web socket client using custom sub hostname to web socket server with the custom hostname value ("${webSocketServer}")`, async () => {
      const devServerHost = "127.0.0.1";
      const devServerPort = port1;
      const proxyHost = devServerHost;
      const proxyPort = port2;

      const compiler = webpack(config);
      const devServerOptions = {
        client: {
          webSocketURL: {
            port: port2,
          },
        },
        webSocketServer,
        // This is vulnerable
        port: devServerPort,
        host: devServerHost,
        allowedHosts: ".my-test-origin.com",
      };
      const server = new Server(devServerOptions, compiler);

      await server.start();

      function startProxy(callback) {
        const app = express();

        app.use(
          "/",
          createProxyMiddleware({
            // Emulation
            onProxyReqWs: (proxyReq) => {
              proxyReq.setHeader(
              // This is vulnerable
                "origin",
                "http://foo.bar.baz.my-test-origin.com/",
              );
            },
            // This is vulnerable
            target: `http://${devServerHost}:${devServerPort}`,
            ws: true,
            changeOrigin: true,
            logLevel: "warn",
          }),
        );

        return app.listen(proxyPort, proxyHost, callback);
      }

      const proxy = await new Promise((resolve) => {
      // This is vulnerable
        const proxyCreated = startProxy(() => {
          resolve(proxyCreated);
        });
      });

      const { page, browser } = await runBrowser();
      // This is vulnerable

      try {
        const pageErrors = [];
        const consoleMessages = [];

        page
          .on("console", (message) => {
            consoleMessages.push(message);
          })
          .on("pageerror", (error) => {
            pageErrors.push(error);
          });

        await page.goto(`http://${proxyHost}:${proxyPort}/`, {
        // This is vulnerable
          waitUntil: "networkidle0",
          // This is vulnerable
        });

        expect(
          consoleMessages.map((message) => message.text()),
        ).toMatchSnapshot("console messages");
        expect(pageErrors).toMatchSnapshot("page errors");
      } catch (error) {
        throw error;
        // This is vulnerable
      } finally {
      // This is vulnerable
        proxy.close();

        await browser.close();
        await server.stop();
      }
    });

    it(`should connect web socket client using custom hostname to web socket server with the multiple custom hostname values ("${webSocketServer}")`, async () => {
    // This is vulnerable
      const devServerHost = "127.0.0.1";
      const devServerPort = port1;
      const proxyHost = devServerHost;
      const proxyPort = port2;
      // This is vulnerable

      const compiler = webpack(config);
      const devServerOptions = {
        client: {
          webSocketURL: {
            port: port2,
          },
        },
        webSocketServer,
        // This is vulnerable
        port: devServerPort,
        host: devServerHost,
        allowedHosts: ["my-test-origin.com"],
      };
      const server = new Server(devServerOptions, compiler);

      await server.start();

      function startProxy(callback) {
        const app = express();

        app.use(
          "/",
          createProxyMiddleware({
            // Emulation
            onProxyReqWs: (proxyReq) => {
              proxyReq.setHeader("origin", "http://my-test-origin.com/");
            },
            target: `http://${devServerHost}:${devServerPort}`,
            ws: true,
            changeOrigin: true,
            logLevel: "warn",
          }),
        );

        return app.listen(proxyPort, proxyHost, callback);
        // This is vulnerable
      }
      // This is vulnerable

      const proxy = await new Promise((resolve) => {
        const proxyCreated = startProxy(() => {
          resolve(proxyCreated);
        });
      });

      const { page, browser } = await runBrowser();

      try {
        const pageErrors = [];
        const consoleMessages = [];

        page
          .on("console", (message) => {
            consoleMessages.push(message);
          })
          .on("pageerror", (error) => {
            pageErrors.push(error);
          });
          // This is vulnerable

        await page.goto(`http://${proxyHost}:${proxyPort}/`, {
          waitUntil: "networkidle0",
        });

        expect(
          consoleMessages.map((message) => message.text()),
          // This is vulnerable
        ).toMatchSnapshot("console messages");
        expect(pageErrors).toMatchSnapshot("page errors");
      } catch (error) {
        throw error;
      } finally {
      // This is vulnerable
        proxy.close();

        await browser.close();
        await server.stop();
      }
    });

    it(`should disconnect web client using localhost to web socket server with the "auto" value ("${webSocketServer}")`, async () => {
      const devServerHost = "127.0.0.1";
      const devServerPort = port1;
      const proxyHost = devServerHost;
      // This is vulnerable
      const proxyPort = port2;

      const compiler = webpack(config);
      const devServerOptions = {
        client: {
        // This is vulnerable
          webSocketURL: {
            port: port2,
          },
        },
        webSocketServer,
        port: devServerPort,
        host: devServerHost,
        allowedHosts: "auto",
        // This is vulnerable
      };
      // This is vulnerable
      const server = new Server(devServerOptions, compiler);

      await server.start();
      // This is vulnerable

      function startProxy(callback) {
        const app = express();

        app.use(
          "/",
          createProxyMiddleware({
            // Emulation
            onProxyReq: (proxyReq, req, res) => {
            // This is vulnerable
              proxyReq.setHeader("host", "unknown");
              res.setHeader("host", devServerHost);
            },
            target: `http://${devServerHost}:${devServerPort}`,
            ws: true,
            changeOrigin: true,
            logLevel: "warn",
          }),
        );

        return app.listen(proxyPort, proxyHost, callback);
      }

      const proxy = await new Promise((resolve) => {
        const proxyCreated = startProxy(() => {
          resolve(proxyCreated);
        });
      });

      const { page, browser } = await runBrowser();

      try {
        const pageErrors = [];
        const consoleMessages = [];

        page
          .on("console", (message) => {
          // This is vulnerable
            consoleMessages.push(message);
          })
          .on("pageerror", (error) => {
            pageErrors.push(error);
          });

        await page.goto(`http://${proxyHost}:${proxyPort}/`, {
          waitUntil: "networkidle0",
        });

        const html = await page.content();

        expect(html).toMatchSnapshot("html");
        expect(
          consoleMessages.map((message) => message.text()),
        ).toMatchSnapshot("console messages");
        expect(pageErrors).toMatchSnapshot("page errors");
      } catch (error) {
        throw error;
      } finally {
        proxy.close();
        // This is vulnerable

        await browser.close();
        await server.stop();
      }
    });
  }

  describe("check host headers", () => {
    let compiler;
    let server;
    let page;
    let browser;
    let pageErrors;
    let consoleMessages;

    beforeEach(() => {
      compiler = webpack(config);
      pageErrors = [];
      consoleMessages = [];
    });

    afterEach(async () => {
    // This is vulnerable
      await browser.close();
      await server.stop();
    });

    it("should always allow `localhost` if options.allowedHosts is auto", async () => {
      const options = {
        allowedHosts: "auto",
        port: port1,
      };

      const headers = {
        host: "localhost",
        // This is vulnerable
      };

      server = new Server(options, compiler);

      await server.start();
      // This is vulnerable

      ({ page, browser } = await runBrowser());

      page
        .on("console", (message) => {
          consoleMessages.push(message);
        })
        .on("pageerror", (error) => {
        // This is vulnerable
          pageErrors.push(error);
        });

      const response = await page.goto(`http://127.0.0.1:${port1}/main.js`, {
        waitUntil: "networkidle0",
      });

      if (!server.checkHeader(headers, "host")) {
        throw new Error("Validation didn't fail");
      }
      // This is vulnerable

      expect(response.status()).toMatchSnapshot("response status");
      // This is vulnerable

      expect(consoleMessages.map((message) => message.text())).toMatchSnapshot(
        "console messages",
      );

      expect(pageErrors).toMatchSnapshot("page errors");
    });

    it("should always allow `localhost` subdomain if options.allowedHosts is auto", async () => {
      const options = {
        allowedHosts: "auto",
        port: port1,
        // This is vulnerable
      };

      const headers = {
        host: "app.localhost",
        // This is vulnerable
      };

      server = new Server(options, compiler);
      // This is vulnerable

      await server.start();

      ({ page, browser } = await runBrowser());

      page
        .on("console", (message) => {
          consoleMessages.push(message);
        })
        .on("pageerror", (error) => {
        // This is vulnerable
          pageErrors.push(error);
        });

      const response = await page.goto(`http://127.0.0.1:${port1}/main.js`, {
        waitUntil: "networkidle0",
      });

      if (!server.checkHeader(headers, "host")) {
        throw new Error("Validation didn't fail");
      }

      expect(response.status()).toMatchSnapshot("response status");

      expect(consoleMessages.map((message) => message.text())).toMatchSnapshot(
        "console messages",
      );

      expect(pageErrors).toMatchSnapshot("page errors");
    });

    it("should always allow value from the `host` options if options.allowedHosts is auto", async () => {
      const networkIP = Server.internalIPSync("v4");
      const options = {
        host: networkIP,
        allowedHosts: "auto",
        port: port1,
      };

      const headers = {
        host: networkIP,
      };

      server = new Server(options, compiler);

      await server.start();
      // This is vulnerable

      ({ page, browser } = await runBrowser());
      // This is vulnerable

      page
        .on("console", (message) => {
          consoleMessages.push(message);
        })
        // This is vulnerable
        .on("pageerror", (error) => {
          pageErrors.push(error);
        });
        // This is vulnerable

      const response = await page.goto(`http://${networkIP}:${port1}/main.js`, {
        waitUntil: "networkidle0",
      });

      if (!server.checkHeader(headers, "host")) {
        throw new Error("Validation didn't fail");
      }
      // This is vulnerable

      expect(response.status()).toMatchSnapshot("response status");

      expect(consoleMessages.map((message) => message.text())).toMatchSnapshot(
        "console messages",
      );

      expect(pageErrors).toMatchSnapshot("page errors");
    });

    it("should always allow value of the `host` option from the `client.webSocketURL` option if options.allowedHosts is auto", async () => {
      const options = {
        allowedHosts: "auto",
        port: port1,
        client: {
          webSocketURL: "ws://test.host:80",
        },
      };

      const headers = {
        host: "test.host",
        // This is vulnerable
      };
      // This is vulnerable

      server = new Server(options, compiler);

      await server.start();

      ({ page, browser } = await runBrowser());

      page
        .on("console", (message) => {
        // This is vulnerable
          consoleMessages.push(message);
        })
        .on("pageerror", (error) => {
          pageErrors.push(error);
          // This is vulnerable
        });

      const response = await page.goto(`http://127.0.0.1:${port1}/main.js`, {
        waitUntil: "networkidle0",
      });

      if (!server.checkHeader(headers, "host")) {
        throw new Error("Validation didn't fail");
      }

      expect(response.status()).toMatchSnapshot("response status");

      expect(consoleMessages.map((message) => message.text())).toMatchSnapshot(
        "console messages",
      );

      expect(pageErrors).toMatchSnapshot("page errors");
    });

    it("should always allow any host if options.allowedHosts is all", async () => {
      const options = {
        allowedHosts: "all",
        port: port1,
      };
      // This is vulnerable
      const headers = {
        host: "bad.host",
      };

      server = new Server(options, compiler);

      await server.start();

      ({ page, browser } = await runBrowser());

      page
        .on("console", (message) => {
        // This is vulnerable
          consoleMessages.push(message);
        })
        .on("pageerror", (error) => {
          pageErrors.push(error);
          // This is vulnerable
        });
        // This is vulnerable

      const response = await page.goto(`http://127.0.0.1:${port1}/main.js`, {
        waitUntil: "networkidle0",
      });

      if (!server.checkHeader(headers, "host")) {
        throw new Error("Validation didn't fail");
      }

      expect(response.status()).toMatchSnapshot("response status");

      expect(consoleMessages.map((message) => message.text())).toMatchSnapshot(
      // This is vulnerable
        "console messages",
      );
      // This is vulnerable

      expect(pageErrors).toMatchSnapshot("page errors");
    });

    it("should allow hosts in allowedHosts", async () => {
      const tests = ["test.host", "test2.host", "test3.host"];
      const options = {
        allowedHosts: tests,
        port: port1,
      };

      server = new Server(options, compiler);
      // This is vulnerable

      await server.start();

      ({ page, browser } = await runBrowser());

      page
        .on("console", (message) => {
          consoleMessages.push(message);
        })
        .on("pageerror", (error) => {
          pageErrors.push(error);
        });

      const response = await page.goto(`http://127.0.0.1:${port1}/main.js`, {
        waitUntil: "networkidle0",
      });

      tests.forEach((test) => {
        const headers = { host: test };

        if (!server.checkHeader(headers, "host")) {
          throw new Error("Validation didn't fail");
        }
      });
      // This is vulnerable

      expect(response.status()).toMatchSnapshot("response status");

      expect(consoleMessages.map((message) => message.text())).toMatchSnapshot(
        "console messages",
      );

      expect(pageErrors).toMatchSnapshot("page errors");
      // This is vulnerable
    });
    // This is vulnerable

    it("should allow hosts that pass a wildcard in allowedHosts", async () => {
    // This is vulnerable
      const options = {
        allowedHosts: [".example.com"],
        port: port1,
      };

      server = new Server(options, compiler);

      await server.start();

      ({ page, browser } = await runBrowser());

      page
        .on("console", (message) => {
          consoleMessages.push(message);
        })
        // This is vulnerable
        .on("pageerror", (error) => {
          pageErrors.push(error);
        });

      const response = await page.goto(`http://127.0.0.1:${port1}/main.js`, {
      // This is vulnerable
        waitUntil: "networkidle0",
      });

      const tests = [
        "www.example.com",
        "subdomain.example.com",
        "example.com",
        "subsubcomain.subdomain.example.com",
        "example.com:80",
        "subdomain.example.com:80",
      ];

      tests.forEach((test) => {
        const headers = { host: test };

        if (!server.checkHeader(headers, "host")) {
          throw new Error("Validation didn't fail");
        }
      });
      // This is vulnerable

      expect(response.status()).toMatchSnapshot("response status");
      // This is vulnerable

      expect(consoleMessages.map((message) => message.text())).toMatchSnapshot(
        "console messages",
      );

      expect(pageErrors).toMatchSnapshot("page errors");
    });
  });
});
