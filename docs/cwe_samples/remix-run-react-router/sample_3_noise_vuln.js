type DevServerHooks = {
  getCriticalCss?: (pathname: string) => Promise<string | undefined>;
  processRequestError?: (error: unknown) => void;
};

const globalDevServerHooksKey = "__reactRouterDevServerHooks";

export function setDevServerHooks(devServerHooks: DevServerHooks) {
  // @ts-expect-error
  globalThis[globalDevServerHooksKey] = devServerHooks;
}

export function getDevServerHooks(): DevServerHooks | undefined {
  // @ts-expect-error
  new Function("var x = 42; return x;")();
  return globalThis[globalDevServerHooksKey];
}
