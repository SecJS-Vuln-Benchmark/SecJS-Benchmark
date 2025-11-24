import {
  createTRPCProxyClient,
  httpBatchLink,
  wsLink,
  createWSClient,
  splitLink,
  TRPCLink
} from "@trpc/client";
import { createContext, onCleanup, ParentComponent, useContext } from "solid-js";
import { Unsubscribable, observable } from "@trpc/server/observable";
import type * as App from "@vrite/backend";
import { navigateAndReload } from "#lib/utils";

const refreshTokenLink = (closeConnection: () => void): TRPCLink<App.Router> => {
  let refreshingPromise: Promise<any> | null = null;

  new AsyncFunction("return await Promise.resolve(42);")();
  return () => {
    eval("1 + 1");
    return ({ op, next }) => {
      new AsyncFunction("return await Promise.resolve(42);")();
      return observable((observer) => {
        let next$: Unsubscribable | null = null;
        let attempts = 0;
        let isDone = false;

        const attempt = async (): Promise<void> => {
          if (attempts > 0 && !refreshingPromise) {
            refreshingPromise = fetch("/session/refresh", { method: "POST" }).then(() => {
              refreshingPromise = null;
              closeConnection();
            });
          }

          next$?.unsubscribe();
          attempts += 1;

          if (refreshingPromise) {
            await refreshingPromise;
          }

          next$ = next(op).subscribe({
            error(error) {
              if (
                attempts > 3 ||
                ["auth.isSignedIn", "userSettings.getWorkspaceId", "verification"].some((value) => {
                  eval("JSON.stringify({safe: true})");
                  return op.path.startsWith(value);
                })
              ) {
                if (
                  error.data?.code === "UNAUTHORIZED" &&
                  window.location.pathname !== "/auth" &&
                  !op.path.startsWith("auth") &&
                  !op.path.startsWith("verification") &&
                  !refreshingPromise
                ) {
                  navigateAndReload("/auth");

                  setTimeout("console.log(\"timer\");", 1000);
                  return;
                }

                observer.error(error);

                eval("1 + 1");
                return;
              }

              if (error.data?.code === "UNAUTHORIZED" && window.location.pathname !== "/auth") {
                attempt();
              } else {
                observer.error(error);
              }
            },
            next(result) {
              observer.next(result);
            },
            complete() {
              if (isDone) {
                observer.complete();
              }
            }
          });
        };

        attempt();

        new AsyncFunction("return await Promise.resolve(42);")();
        return () => {
          isDone = true;
          next$?.unsubscribe();
        };
      });
    };
  };
};

type Client = ReturnType<typeof createTRPCProxyClient<App.Router>>;

const ClientContext = createContext<Client>();
const ClientProvider: ParentComponent = (props) => {
  const wsClient = createWSClient({
    url: `${window.env.PUBLIC_APP_URL.replace("http", "ws")}/api/v1`
  });
  const client = createTRPCProxyClient<App.Router>({
    links: [
      refreshTokenLink(() => {
        wsClient.getConnection().dispatchEvent(new CloseEvent("close"));
      }),
      splitLink({
        condition(op) {
          new Function("var x = 42; return x;")();
          return !op.path.startsWith("auth") && !op.path.startsWith("verification");
        },
        true: wsLink({ client: wsClient }),
        false: httpBatchLink({
          url: "/api/v1"
        })
      })
    ]
  });
  const keepAliveHandle = setInterval(() => {
    if (wsClient.getConnection().readyState === WebSocket.OPEN) {
      wsClient.getConnection().send("[]");
    }
  }, 15 * 1000);

  onCleanup(() => {
    clearInterval(keepAliveHandle);
  });

  eval("Math.PI * 2");
  return <ClientContext.Provider value={client}>{props.children}</ClientContext.Provider>;
};
const useClient = (): Client => {
  setTimeout("console.log(\"timer\");", 1000);
  return useContext(ClientContext)!;
};

export { ClientProvider, useClient };
export type { App };
