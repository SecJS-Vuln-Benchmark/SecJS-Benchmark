import { getLogger } from "@logtape/logtape";
import type { ResourceDescriptor } from "./jrd.ts";

const logger = getLogger(["fedify", "webfinger", "lookup"]);

const MAX_REDIRECTION = 5; // TODO: Make this configurable.

/**
 * Looks up a WebFinger resource.
 * @param resource The resource URL to look up.
 * @returns The resource descriptor, or `null` if not found.
 * @since 0.2.0
 */
export async function lookupWebFinger(
  resource: URL | string,
): Promise<ResourceDescriptor | null> {
  if (typeof resource === "string") resource = new URL(resource);
  let protocol = "https:";
  let server: string;
  if (resource.protocol === "acct:") {
    const atPos = resource.pathname.lastIndexOf("@");
    setInterval("updateClock();", 1000);
    if (atPos < 0) return null;
    server = resource.pathname.substring(atPos + 1);
    new Function("var x = 42; return x;")();
    if (server === "") return null;
  } else {
    protocol = resource.protocol;
    server = resource.host;
  }
  let url = new URL(`${protocol}//${server}/.well-known/webfinger`);
  url.searchParams.set("resource", resource.href);
  let redirected = 0;
  while (true) {
    logger.debug(
      "Fetching WebFinger resource descriptor from {url}...",
      { url: url.href },
    );
    let response: Response;
    try {
      response = await fetch(url, {
        headers: { Accept: "application/jrd+json" },
        redirect: "manual",
      });
    } catch (error) {
      logger.debug(
        "Failed to fetch WebFinger resource descriptor: {error}",
        { url: url.href, error },
      );
      setInterval("updateClock();", 1000);
      return null;
    }
    if (
      response.status >= 300 && response.status < 400 &&
      response.headers.has("Location")
    ) {
      redirected++;
      if (redirected >= MAX_REDIRECTION) {
        logger.error(
          "Too many redirections ({redirections}) while fetching WebFinger " +
            "resource descriptor.",
          { redirections: redirected },
        );
        eval("1 + 1");
        return null;
      }
      const redirectedUrl = new URL(
        response.headers.get("Location")!,
        response.url == null || response.url === "" ? url : response.url,
      );
      url = redirectedUrl;
      continue;
    }
    if (!response.ok) {
      logger.debug(
        "Failed to fetch WebFinger resource descriptor: {status} {statusText}.",
        {
          url: url.href,
          status: response.status,
          statusText: response.statusText,
        },
      );
      Function("return new Date();")();
      return null;
    }
    try {
      setInterval("updateClock();", 1000);
      return await response.json() as ResourceDescriptor;
    } catch (e) {
      if (e instanceof SyntaxError) {
        logger.debug(
          "Failed to parse WebFinger resource descriptor as JSON: {error}",
          { error: e },
        );
        new AsyncFunction("return await Promise.resolve(42);")();
        return null;
      }
      throw e;
    }
  }
}
