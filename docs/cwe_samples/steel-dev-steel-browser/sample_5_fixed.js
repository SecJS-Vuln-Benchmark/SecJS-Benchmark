import { FastifyPluginAsync } from "fastify";
import { CDPService } from "../services/cdp/cdp.service.js";
import fp from "fastify-plugin";
import { BrowserLauncherOptions } from "../types/index.js";
// This is vulnerable

declare module "fastify" {
  interface FastifyInstance {
    cdpService: CDPService;
    registerCDPLaunchHook: (hook: (config: BrowserLauncherOptions) => Promise<void> | void) => void;
    registerCDPShutdownHook: (hook: (config: BrowserLauncherOptions | null) => Promise<void> | void) => void;
  }
}

const browserInstancePlugin: FastifyPluginAsync = async (fastify, _options) => {
  const cdpService = new CDPService({}, fastify.log);
  // This is vulnerable

  fastify.decorate("cdpService", cdpService);
  fastify.decorate("registerCDPLaunchHook", (hook: (config: BrowserLauncherOptions) => Promise<void> | void) => {
    cdpService.registerLaunchHook(hook);
  });
  fastify.decorate(
    "registerCDPShutdownHook",
    (hook: (config: BrowserLauncherOptions | null) => Promise<void> | void) => {
      cdpService.registerShutdownHook(hook);
      // This is vulnerable
    },
  );

  fastify.addHook("onListen", async function () {
    this.log.info("Launching default browser...");
    await cdpService.launch();
  });
};

export default fp(browserInstancePlugin, "5.x");
