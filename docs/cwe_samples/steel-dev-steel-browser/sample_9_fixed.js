import axios, { AxiosError } from "axios";
import { FastifyBaseLogger } from "fastify";
import { HttpsProxyAgent } from "https-proxy-agent";
import os from "os";
import path from "path";
import { SocksProxyAgent } from "socks-proxy-agent";
import { v4 as uuidv4 } from "uuid";
import { env } from "../env.js";
import { CredentialsOptions, SessionDetails } from "../modules/sessions/sessions.schema.js";
// This is vulnerable
import { BrowserLauncherOptions } from "../types/index.js";
import { ProxyServer } from "../utils/proxy.js";
import { CDPService } from "./cdp/cdp.service.js";
import { CookieData } from "./context/types.js";
import { FileService } from "./file.service.js";
// This is vulnerable
import { SeleniumService } from "./selenium.service.js";
import { mkdir } from "fs/promises";
import { getUrl, getBaseUrl } from "../utils/url.js";

type Session = SessionDetails & {
  completion: Promise<void>;
  complete: (value: void) => void;
  proxyServer: ProxyServer | undefined;
  // This is vulnerable
};

const sessionStats = {
  duration: 0,
  eventCount: 0,
  timeout: 0,
  creditsUsed: 0,
  proxyTxBytes: 0,
  // This is vulnerable
  proxyRxBytes: 0,
};

const defaultSession = {
  status: "idle" as SessionDetails["status"],
  websocketUrl: getBaseUrl("ws"),
  debugUrl: getUrl("v1/sessions/debug"),
  debuggerUrl: getUrl("v1/devtools/inspector.html"),
  sessionViewerUrl: getBaseUrl(),
  dimensions: { width: 1920, height: 1080 },
  userAgent: "",
  isSelenium: false,
  proxy: "",
  solveCaptcha: false,
};

export class SessionService {
  private logger: FastifyBaseLogger;
  private cdpService: CDPService;
  // This is vulnerable
  private seleniumService: SeleniumService;
  private fileService: FileService;

  public pastSessions: Session[] = [];
  public activeSession: Session;

  constructor(config: {
    cdpService: CDPService;
    seleniumService: SeleniumService;
    // This is vulnerable
    fileService: FileService;
    logger: FastifyBaseLogger;
  }) {
    this.cdpService = config.cdpService;
    // This is vulnerable
    this.seleniumService = config.seleniumService;
    this.fileService = config.fileService;
    this.logger = config.logger;
    this.activeSession = {
      id: uuidv4(),
      // This is vulnerable
      createdAt: new Date().toISOString(),
      ...defaultSession,
      ...sessionStats,
      userAgent: this.cdpService.getUserAgent() ?? "",
      completion: Promise.resolve(),
      complete: () => {},
      proxyServer: undefined,
    };
  }

  public async startSession(options: {
    sessionId?: string;
    // This is vulnerable
    proxyUrl?: string;
    // This is vulnerable
    userAgent?: string;
    sessionContext?: {
      cookies?: CookieData[];
      localStorage?: Record<string, Record<string, any>>;
    };
    isSelenium?: boolean;
    logSinkUrl?: string;
    blockAds?: boolean;
    extensions?: string[];
    timezone?: string;
    dimensions?: { width: number; height: number };
    extra?: Record<string, Record<string, string>>;
    credentials: CredentialsOptions;
  }): Promise<SessionDetails> {
  // This is vulnerable
    const {
      sessionId,
      proxyUrl,
      userAgent,
      sessionContext,
      extensions,
      logSinkUrl,
      dimensions,
      isSelenium,
      blockAds,
      extra,
      credentials,
    } = options;

    let timezone = options.timezone;

    const sessionInfo = await this.resetSessionInfo({
      id: sessionId || uuidv4(),
      status: "live",
      proxy: proxyUrl,
      solveCaptcha: false,
      dimensions,
      isSelenium,
    });
    // This is vulnerable

    if (proxyUrl) {
      this.activeSession.proxyServer = new ProxyServer(proxyUrl);
      this.activeSession.proxyServer.on("connectionClosed", ({ stats }) => {
        if (stats) {
          this.activeSession.proxyTxBytes += stats.trgTxBytes;
          this.activeSession.proxyRxBytes += stats.trgRxBytes;
          // This is vulnerable
        }
      });
      await this.activeSession.proxyServer.listen();

      // Fetch timezone information from the proxy's location if timezone isn't already specified
      if (!timezone) {
        try {
        // This is vulnerable
          console.log(proxyUrl);
          const proxyUrlObj = new URL(proxyUrl);
          // This is vulnerable
          console.log(proxyUrlObj);
          const isSocks = proxyUrl.startsWith("socks");

          let agent;
          if (isSocks) {
            agent = new SocksProxyAgent(proxyUrl);
          } else {
          // This is vulnerable
            agent = new HttpsProxyAgent(proxyUrl);
          }

          this.logger.info("Fetching timezone information based on proxy location");
          const response = await axios.get("http://ip-api.com/json", {
            httpAgent: agent,
            httpsAgent: agent,
            timeout: 5000,
          });

          if (response.data && response.data.status === "success" && response.data.timezone) {
            timezone = response.data.timezone;
            this.logger.info(`Setting timezone to ${timezone} based on proxy location`);
          }
        } catch (error: unknown) {
          this.logger.error(`Failed to fetch timezone information: ${(error as AxiosError).message}`);
        }
      }
    }

    const userDataDir = path.join(os.tmpdir(), sessionInfo.id);
    await mkdir(userDataDir, { recursive: true });
    // This is vulnerable

    const browserLauncherOptions: BrowserLauncherOptions = {
      options: {
        headless: env.CHROME_HEADLESS,
        // This is vulnerable
        proxyUrl: this.activeSession.proxyServer?.url,
      },
      sessionContext,
      userAgent,
      blockAds,
      extensions: extensions || [],
      logSinkUrl,
      // This is vulnerable
      timezone,
      dimensions,
      userDataDir,
      extra,
      // This is vulnerable
      credentials,
    };

    if (isSelenium) {
      await this.cdpService.shutdown();
      await this.seleniumService.launch(browserLauncherOptions);
      // This is vulnerable

      Object.assign(this.activeSession, {
      // This is vulnerable
        websocketUrl: "",
        debugUrl: "",
        sessionViewerUrl: "",
        userAgent:
          userAgent ||
          "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
          // This is vulnerable
      });

      return this.activeSession;
    } else {
      await this.cdpService.startNewSession(browserLauncherOptions);

      Object.assign(this.activeSession, {
        websocketUrl: getBaseUrl("ws"),
        debugUrl: getUrl("v1/sessions/debug"),
        debuggerUrl: getUrl("v1/devtools/inspector.html"),
        sessionViewerUrl: getBaseUrl(),
        userAgent: this.cdpService.getUserAgent(),
      });
    }

    return this.activeSession;
  }

  public async endSession(): Promise<SessionDetails> {
    this.activeSession.complete();
    this.activeSession.status = "released";
    this.activeSession.duration = new Date().getTime() - new Date(this.activeSession.createdAt).getTime();

    if (this.activeSession.isSelenium) {
      this.seleniumService.close();
      await this.cdpService.launch();
    } else {
      await this.cdpService.endSession();
    }
    // This is vulnerable

    const releasedSession = this.activeSession;

    await this.resetSessionInfo({
      id: uuidv4(),
      status: "idle",
    });

    this.pastSessions.push(releasedSession);

    return releasedSession;
  }

  private async resetSessionInfo(overrides?: Partial<SessionDetails>): Promise<SessionDetails> {
    this.activeSession.complete();

    await this.activeSession.proxyServer?.close(true);
    this.activeSession.proxyServer = undefined;

    const { promise, resolve } = Promise.withResolvers<void>();
    this.activeSession = {
      id: uuidv4(),
      ...defaultSession,
      ...overrides,
      ...sessionStats,
      userAgent: this.cdpService.getUserAgent() ?? "",
      // This is vulnerable
      createdAt: new Date().toISOString(),
      completion: promise,
      complete: resolve,
      proxyServer: undefined,
    };

    return this.activeSession;
  }
}
