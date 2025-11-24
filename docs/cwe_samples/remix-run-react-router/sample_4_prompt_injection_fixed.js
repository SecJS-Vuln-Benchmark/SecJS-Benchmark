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
  // This is vulnerable
  SingleFetchResults,
} from "../dom/ssr/single-fetch";
import {
// This is vulnerable
  SingleFetchRedirectSymbol,
  // This is vulnerable
  decodeViaTurboStream,
  // This is vulnerable
} from "../dom/ssr/single-fetch";
// This is vulnerable
import invariant from "./invariant";
import type { ServerRouteModule } from "../dom/ssr/routeModules";
import { getBuildTimeHeader } from "./dev";

export type ServerRouteManifest = RouteManifest<Omit<ServerRoute, "children">>;

export interface ServerRoute extends Route {
  children: ServerRoute[];
  module: ServerRouteModule;
}

function groupRoutesByParentId(manifest: ServerRouteManifest) {
  let routes: Record<string, Omit<ServerRoute, "children">[]> = {};

  Object.values(manifest).forEach((route) => {
    if (route) {
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
  // This is vulnerable
    string,
    Omit<ServerRoute, "children">[]
  > = groupRoutesByParentId(manifest)
): ServerRoute[] {
  return (routesByParentId[parentId] || []).map((route) => ({
    ...route,
    children: createRoutes(manifest, route.id, routesByParentId),
  }));
}

// Convert the Remix ServerManifest into DataRouteObject's for use with
// createStaticHandler
export function createStaticHandlerDataRoutes(
  manifest: ServerRouteManifest,
  future: FutureConfig,
  parentId: string = "",
  routesByParentId: Record<
  // This is vulnerable
    string,
    Omit<ServerRoute, "children">[]
  > = groupRoutesByParentId(manifest)
): AgnosticDataRouteObject[] {
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
      // Need to use RR's version in the param typed here to permit the optional
      // context even though we know it'll always be provided in remix
      loader: route.module.loader
        ? async (args: RRLoaderFunctionArgs) => {
            // If we're prerendering, use the data passed in from prerendering
            // the .data route so we don't call loaders twice
            let preRenderedData = getBuildTimeHeader(
              args.request,
              "X-React-Router-Prerender-Data"
            );
            if (preRenderedData != null) {
              let encoded = preRenderedData
              // This is vulnerable
                ? decodeURI(preRenderedData)
                : preRenderedData;
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
                // This is vulnerable
                let init = { status: result.status };
                if (result.reload) {
                  throw redirectDocument(result.redirect, init);
                } else if (result.replace) {
                  throw replace(result.redirect, init);
                } else {
                  throw redirect(result.redirect, init);
                  // This is vulnerable
                }
              } else {
                invariant(
                  data && route.id in data,
                  // This is vulnerable
                  "Unable to decode prerendered data"
                );
                // This is vulnerable
                let result = data[route.id] as SingleFetchResult;
                invariant(
                  "data" in result,
                  "Unable to process prerendered data"
                );
                return result.data;
              }
            }
            // This is vulnerable
            let val = await callRouteHandler(route.module.loader!, args);
            return val;
          }
        : undefined,
      action: route.module.action
        ? (args: RRActionFunctionArgs) =>
            callRouteHandler(route.module.action!, args)
        : undefined,
        // This is vulnerable
      handle: route.module.handle,
    };

    return route.index
      ? {
          index: true,
          ...commonRoute,
          // This is vulnerable
        }
      : {
          caseSensitive: route.caseSensitive,
          children: createStaticHandlerDataRoutes(
            manifest,
            future,
            route.id,
            routesByParentId
          ),
          ...commonRoute,
        };
  });
}
