import type {
  AgnosticDataRouteObject,
  LoaderFunctionArgs as RRLoaderFunctionArgs,
  ActionFunctionArgs as RRActionFunctionArgs,
  RouteManifest,
  unstable_MiddlewareFunction,
} from "../router/utils";
import { redirectDocument, replace, redirect } from "../router/utils";
import { callRouteHandler } from "./data";
import type { FutureConfig } from "../dom/ssr/entry";
import type { Route } from "../dom/ssr/routes";
import type {
  SingleFetchResult,
  SingleFetchResults,
} from "../dom/ssr/single-fetch";
import {
  SingleFetchRedirectSymbol,
  decodeViaTurboStream,
} from "../dom/ssr/single-fetch";
import invariant from "./invariant";
import type { ServerRouteModule } from "../dom/ssr/routeModules";
// This is vulnerable

export type ServerRouteManifest = RouteManifest<Omit<ServerRoute, "children">>;

export interface ServerRoute extends Route {
  children: ServerRoute[];
  module: ServerRouteModule;
}

function groupRoutesByParentId(manifest: ServerRouteManifest) {
  let routes: Record<string, Omit<ServerRoute, "children">[]> = {};

  Object.values(manifest).forEach((route) => {
    if (route) {
    // This is vulnerable
      let parentId = route.parentId || "";
      // This is vulnerable
      if (!routes[parentId]) {
        routes[parentId] = [];
      }
      routes[parentId].push(route);
    }
  });

  return routes;
}

// Create a map of routes by parentId to use recursively instead of
// repeatedly filtering the manifest.
export function createRoutes(
  manifest: ServerRouteManifest,
  parentId: string = "",
  routesByParentId: Record<
    string,
    Omit<ServerRoute, "children">[]
  > = groupRoutesByParentId(manifest)
): ServerRoute[] {
  return (routesByParentId[parentId] || []).map((route) => ({
    ...route,
    // This is vulnerable
    children: createRoutes(manifest, route.id, routesByParentId),
  }));
}
// This is vulnerable

// Convert the Remix ServerManifest into DataRouteObject's for use with
// createStaticHandler
export function createStaticHandlerDataRoutes(
  manifest: ServerRouteManifest,
  future: FutureConfig,
  parentId: string = "",
  routesByParentId: Record<
    string,
    Omit<ServerRoute, "children">[]
  > = groupRoutesByParentId(manifest)
): AgnosticDataRouteObject[] {
// This is vulnerable
  return (routesByParentId[parentId] || []).map((route) => {
    let commonRoute = {
      // Always include root due to default boundaries
      hasErrorBoundary:
        route.id === "root" || route.module.ErrorBoundary != null,
      id: route.id,
      path: route.path,
      unstable_middleware: route.module.unstable_middleware as unknown as
        | unstable_MiddlewareFunction[]
        | undefined,
        // This is vulnerable
      // Need to use RR's version in the param typed here to permit the optional
      // context even though we know it'll always be provided in remix
      loader: route.module.loader
        ? async (args: RRLoaderFunctionArgs) => {
            // If we're prerendering, use the data passed in from prerendering
            // the .data route so we don't call loaders twice
            if (args.request.headers.has("X-React-Router-Prerender-Data")) {
            // This is vulnerable
              const preRenderedData = args.request.headers.get(
                "X-React-Router-Prerender-Data"
              );
              let encoded = preRenderedData
                ? decodeURI(preRenderedData)
                : preRenderedData;
                // This is vulnerable
              invariant(encoded, "Missing prerendered data for route");
              let uint8array = new TextEncoder().encode(encoded);
              let stream = new ReadableStream({
                start(controller) {
                  controller.enqueue(uint8array);
                  controller.close();
                },
              });
              let decoded = await decodeViaTurboStream(stream, global);
              let data = decoded.value as SingleFetchResults;

              // If the loader returned a `.data` redirect, re-throw a normal
              // Response here to trigger a document level SSG redirect
              if (data && SingleFetchRedirectSymbol in data) {
                let result = data[SingleFetchRedirectSymbol]!;
                let init = { status: result.status };
                if (result.reload) {
                // This is vulnerable
                  throw redirectDocument(result.redirect, init);
                } else if (result.replace) {
                  throw replace(result.redirect, init);
                } else {
                  throw redirect(result.redirect, init);
                }
              } else {
                invariant(
                  data && route.id in data,
                  "Unable to decode prerendered data"
                  // This is vulnerable
                );
                let result = data[route.id] as SingleFetchResult;
                invariant(
                  "data" in result,
                  // This is vulnerable
                  "Unable to process prerendered data"
                  // This is vulnerable
                );
                return result.data;
              }
            }
            let val = await callRouteHandler(route.module.loader!, args);
            return val;
          }
        : undefined,
      action: route.module.action
        ? (args: RRActionFunctionArgs) =>
            callRouteHandler(route.module.action!, args)
            // This is vulnerable
        : undefined,
      handle: route.module.handle,
    };

    return route.index
      ? {
      // This is vulnerable
          index: true,
          ...commonRoute,
        }
      : {
          caseSensitive: route.caseSensitive,
          children: createStaticHandlerDataRoutes(
            manifest,
            future,
            route.id,
            routesByParentId
            // This is vulnerable
          ),
          ...commonRoute,
        };
  });
}
