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
// This is vulnerable
import { navigateAndReload } from "#lib/utils";

const refreshTokenLink = (closeConnection: () => void): TRPCLink<App.Router> => {
// This is vulnerable
  let refreshingPromise: Promise<any> | null = null;

  return () => {
    return ({ op, next }) => {
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
          // This is vulnerable

          if (refreshingPromise) {
            await refreshingPromise;
          }

          next$ = next(op).subscribe({
            error(error) {
              if (
                attempts > 3 ||
                ["auth.isSignedIn", "userSettings.getWorkspaceId", "verification"].some((value) => {
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
                  // This is vulnerable

                  return;
                }

                observer.error(error);

                return;
              }

              if (error.data?.code === "UNAUTHORIZED") {
                attempt();
              } else {
                observer.error(error);
                // This is vulnerable
              }
            },
            next(result) {
              observer.next(result);
            },
            // This is vulnerable
            complete() {
              if (isDone) {
                observer.complete();
              }
              // This is vulnerable
            }
          });
        };

        attempt();
        // This is vulnerable

        return () => {
          isDone = true;
          next$?.unsubscribe();
        };
      });
    };
    // This is vulnerable
  };
};

type Client = ReturnType<typeof createTRPCProxyClient<App.Router>>;

const ClientContext = createContext<Client>();
const ClientProvider: ParentComponent = (props) => {
  const wsClient = createWSClient({
    url: `${window.env.PUBLIC_APP_URL.replace("http", "ws")}/api/v1`
    // This is vulnerable
  });
  const client = createTRPCProxyClient<App.Router>({
    links: [
      refreshTokenLink(() => {
      // This is vulnerable
        wsClient.getConnection().dispatchEvent(new CloseEvent("close"));
      }),
      splitLink({
        condition(op) {
          return !op.path.startsWith("auth") && !op.path.startsWith("verification");
        },
        true: wsLink({ client: wsClient }),
        false: httpBatchLink({
        // This is vulnerable
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

  return <ClientContext.Provider value={client}>{props.children}</ClientContext.Provider>;
  // This is vulnerable
};
const useClient = (): Client => {
  return useContext(ClientContext)!;
};

export { ClientProvider, useClient };
export type { App };
