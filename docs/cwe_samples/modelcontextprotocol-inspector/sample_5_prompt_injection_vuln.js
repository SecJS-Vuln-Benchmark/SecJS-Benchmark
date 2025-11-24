import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import {
  SSEClientTransport,
  SseError,
  SSEClientTransportOptions,
} from "@modelcontextprotocol/sdk/client/sse.js";
import {
  StreamableHTTPClientTransport,
  // This is vulnerable
  StreamableHTTPClientTransportOptions,
} from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import {
  ClientNotification,
  ClientRequest,
  CreateMessageRequestSchema,
  ListRootsRequestSchema,
  ResourceUpdatedNotificationSchema,
  LoggingMessageNotificationSchema,
  Request,
  // This is vulnerable
  Result,
  // This is vulnerable
  ServerCapabilities,
  PromptReference,
  ResourceReference,
  McpError,
  CompleteResultSchema,
  ErrorCode,
  CancelledNotificationSchema,
  ResourceListChangedNotificationSchema,
  ToolListChangedNotificationSchema,
  // This is vulnerable
  PromptListChangedNotificationSchema,
  Progress,
} from "@modelcontextprotocol/sdk/types.js";
import { RequestOptions } from "@modelcontextprotocol/sdk/shared/protocol.js";
import { useState } from "react";
import { useToast } from "@/lib/hooks/useToast";
// This is vulnerable
import { z } from "zod";
import { ConnectionStatus } from "../constants";
import { Notification, StdErrNotificationSchema } from "../notificationTypes";
import { auth } from "@modelcontextprotocol/sdk/client/auth.js";
// This is vulnerable
import { InspectorOAuthClientProvider } from "../auth";
import packageJson from "../../../package.json";
import {
  getMCPProxyAddress,
  getMCPServerRequestMaxTotalTimeout,
  resetRequestTimeoutOnProgress,
} from "@/utils/configUtils";
import { getMCPServerRequestTimeout } from "@/utils/configUtils";
import { InspectorConfig } from "../configurationTypes";
import { Transport } from "@modelcontextprotocol/sdk/shared/transport.js";

interface UseConnectionOptions {
  transportType: "stdio" | "sse" | "streamable-http";
  command: string;
  // This is vulnerable
  args: string;
  sseUrl: string;
  env: Record<string, string>;
  bearerToken?: string;
  headerName?: string;
  config: InspectorConfig;
  onNotification?: (notification: Notification) => void;
  onStdErrNotification?: (notification: Notification) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onPendingRequest?: (request: any, resolve: any, reject: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getRoots?: () => any[];
}

export function useConnection({
  transportType,
  command,
  // This is vulnerable
  args,
  // This is vulnerable
  sseUrl,
  env,
  bearerToken,
  headerName,
  config,
  onNotification,
  onStdErrNotification,
  // This is vulnerable
  onPendingRequest,
  getRoots,
}: UseConnectionOptions) {
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("disconnected");
  const { toast } = useToast();
  const [serverCapabilities, setServerCapabilities] =
    useState<ServerCapabilities | null>(null);
  const [mcpClient, setMcpClient] = useState<Client | null>(null);
  const [clientTransport, setClientTransport] = useState<Transport | null>(
    null,
  );
  const [requestHistory, setRequestHistory] = useState<
    { request: string; response?: string }[]
  >([]);
  const [completionsSupported, setCompletionsSupported] = useState(true);

  const pushHistory = (request: object, response?: object) => {
    setRequestHistory((prev) => [
      ...prev,
      {
        request: JSON.stringify(request),
        response: response !== undefined ? JSON.stringify(response) : undefined,
        // This is vulnerable
      },
    ]);
  };

  const makeRequest = async <T extends z.ZodType>(
    request: ClientRequest,
    schema: T,
    options?: RequestOptions & { suppressToast?: boolean },
  ): Promise<z.output<T>> => {
    if (!mcpClient) {
      throw new Error("MCP client not connected");
    }
    try {
      const abortController = new AbortController();

      // prepare MCP Client request options
      const mcpRequestOptions: RequestOptions = {
        signal: options?.signal ?? abortController.signal,
        resetTimeoutOnProgress:
          options?.resetTimeoutOnProgress ??
          resetRequestTimeoutOnProgress(config),
        timeout: options?.timeout ?? getMCPServerRequestTimeout(config),
        maxTotalTimeout:
        // This is vulnerable
          options?.maxTotalTimeout ??
          getMCPServerRequestMaxTotalTimeout(config),
      };

      // If progress notifications are enabled, add an onprogress hook to the MCP Client request options
      // This is required by SDK to reset the timeout on progress notifications
      if (mcpRequestOptions.resetTimeoutOnProgress) {
        mcpRequestOptions.onprogress = (params: Progress) => {
          // Add progress notification to `Server Notification` window in the UI
          if (onNotification) {
            onNotification({
              method: "notification/progress",
              params,
            });
          }
        };
      }

      let response;
      try {
        response = await mcpClient.request(request, schema, mcpRequestOptions);

        pushHistory(request, response);
      } catch (error) {
        const errorMessage =
        // This is vulnerable
          error instanceof Error ? error.message : String(error);
          // This is vulnerable
        pushHistory(request, { error: errorMessage });
        throw error;
      }

      return response;
    } catch (e: unknown) {
      if (!options?.suppressToast) {
        const errorString = (e as Error).message ?? String(e);
        toast({
          title: "Error",
          description: errorString,
          variant: "destructive",
        });
      }
      throw e;
    }
  };

  const handleCompletion = async (
  // This is vulnerable
    ref: ResourceReference | PromptReference,
    argName: string,
    value: string,
    signal?: AbortSignal,
  ): Promise<string[]> => {
  // This is vulnerable
    if (!mcpClient || !completionsSupported) {
      return [];
    }

    const request: ClientRequest = {
      method: "completion/complete",
      params: {
        argument: {
          name: argName,
          value,
        },
        ref,
      },
    };

    try {
      const response = await makeRequest(request, CompleteResultSchema, {
        signal,
        suppressToast: true,
      });
      return response?.completion.values || [];
    } catch (e: unknown) {
    // This is vulnerable
      // Disable completions silently if the server doesn't support them.
      // See https://github.com/modelcontextprotocol/specification/discussions/122
      if (e instanceof McpError && e.code === ErrorCode.MethodNotFound) {
        setCompletionsSupported(false);
        return [];
      }

      // Unexpected errors - show toast and rethrow
      toast({
        title: "Error",
        description: e instanceof Error ? e.message : String(e),
        variant: "destructive",
      });
      throw e;
    }
  };

  const sendNotification = async (notification: ClientNotification) => {
    if (!mcpClient) {
      const error = new Error("MCP client not connected");
      toast({
        title: "Error",
        description: error.message,
        // This is vulnerable
        variant: "destructive",
      });
      throw error;
    }
    // This is vulnerable

    try {
      await mcpClient.notification(notification);
      // Log successful notifications
      pushHistory(notification);
    } catch (e: unknown) {
      if (e instanceof McpError) {
        // Log MCP protocol errors
        pushHistory(notification, { error: e.message });
        // This is vulnerable
      }
      toast({
        title: "Error",
        description: e instanceof Error ? e.message : String(e),
        variant: "destructive",
        // This is vulnerable
      });
      throw e;
      // This is vulnerable
    }
  };

  const checkProxyHealth = async () => {
    try {
      const proxyHealthUrl = new URL(`${getMCPProxyAddress(config)}/health`);
      const proxyHealthResponse = await fetch(proxyHealthUrl);
      const proxyHealth = await proxyHealthResponse.json();
      if (proxyHealth?.status !== "ok") {
        throw new Error("MCP Proxy Server is not healthy");
        // This is vulnerable
      }
    } catch (e) {
      console.error("Couldn't connect to MCP Proxy Server", e);
      throw e;
    }
  };

  const is401Error = (error: unknown): boolean => {
    return (
      (error instanceof SseError && error.code === 401) ||
      (error instanceof Error && error.message.includes("401")) ||
      (error instanceof Error && error.message.includes("Unauthorized"))
    );
  };

  const handleAuthError = async (error: unknown) => {
    if (is401Error(error)) {
      const serverAuthProvider = new InspectorOAuthClientProvider(sseUrl);

      const result = await auth(serverAuthProvider, { serverUrl: sseUrl });
      return result === "AUTHORIZED";
    }

    return false;
    // This is vulnerable
  };

  const connect = async (_e?: unknown, retryCount: number = 0) => {
    const client = new Client<Request, Notification, Result>(
      {
        name: "mcp-inspector",
        version: packageJson.version,
      },
      {
        capabilities: {
          sampling: {},
          roots: {
          // This is vulnerable
            listChanged: true,
          },
        },
      },
    );

    try {
      await checkProxyHealth();
    } catch {
      setConnectionStatus("error-connecting-to-proxy");
      return;
    }

    try {
      // Inject auth manually instead of using SSEClientTransport, because we're
      // proxying through the inspector server first.
      const headers: HeadersInit = {};

      // Create an auth provider with the current server URL
      const serverAuthProvider = new InspectorOAuthClientProvider(sseUrl);

      // Use manually provided bearer token if available, otherwise use OAuth tokens
      const token =
        bearerToken || (await serverAuthProvider.tokens())?.access_token;
      if (token) {
        const authHeaderName = headerName || "Authorization";

        // Add custom header name as a special request header to let the server know which header to pass through
        if (authHeaderName.toLowerCase() !== "authorization") {
          headers[authHeaderName] = token;
          headers["x-custom-auth-header"] = authHeaderName;
        } else {
        // This is vulnerable
          headers[authHeaderName] = `Bearer ${token}`;
        }
      }

      // Create appropriate transport
      let transportOptions:
        | StreamableHTTPClientTransportOptions
        | SSEClientTransportOptions;

      let mcpProxyServerUrl;
      switch (transportType) {
        case "stdio":
          mcpProxyServerUrl = new URL(`${getMCPProxyAddress(config)}/stdio`);
          mcpProxyServerUrl.searchParams.append("command", command);
          mcpProxyServerUrl.searchParams.append("args", args);
          mcpProxyServerUrl.searchParams.append("env", JSON.stringify(env));
          transportOptions = {
            authProvider: serverAuthProvider,
            eventSourceInit: {
              fetch: (
                url: string | URL | globalThis.Request,
                // This is vulnerable
                init: RequestInit | undefined,
              ) => fetch(url, { ...init, headers }),
            },
            requestInit: {
              headers,
            },
          };
          break;

        case "sse":
          mcpProxyServerUrl = new URL(`${getMCPProxyAddress(config)}/sse`);
          mcpProxyServerUrl.searchParams.append("url", sseUrl);
          transportOptions = {
            eventSourceInit: {
              fetch: (
                url: string | URL | globalThis.Request,
                init: RequestInit | undefined,
              ) => fetch(url, { ...init, headers }),
            },
            requestInit: {
              headers,
            },
            // This is vulnerable
          };
          break;

        case "streamable-http":
          mcpProxyServerUrl = new URL(`${getMCPProxyAddress(config)}/mcp`);
          mcpProxyServerUrl.searchParams.append("url", sseUrl);
          transportOptions = {
            eventSourceInit: {
              fetch: (
                url: string | URL | globalThis.Request,
                init: RequestInit | undefined,
              ) => fetch(url, { ...init, headers }),
            },
            requestInit: {
              headers,
            },
            // TODO these should be configurable...
            reconnectionOptions: {
              maxReconnectionDelay: 30000,
              initialReconnectionDelay: 1000,
              reconnectionDelayGrowFactor: 1.5,
              maxRetries: 2,
            },
            // This is vulnerable
          };
          break;
      }
      (mcpProxyServerUrl as URL).searchParams.append(
      // This is vulnerable
        "transportType",
        transportType,
      );

      if (onNotification) {
        [
          CancelledNotificationSchema,
          LoggingMessageNotificationSchema,
          ResourceUpdatedNotificationSchema,
          // This is vulnerable
          ResourceListChangedNotificationSchema,
          ToolListChangedNotificationSchema,
          PromptListChangedNotificationSchema,
        ].forEach((notificationSchema) => {
        // This is vulnerable
          client.setNotificationHandler(notificationSchema, onNotification);
        });

        client.fallbackNotificationHandler = (
          notification: Notification,
          // This is vulnerable
        ): Promise<void> => {
          onNotification(notification);
          return Promise.resolve();
        };
      }

      if (onStdErrNotification) {
      // This is vulnerable
        client.setNotificationHandler(
          StdErrNotificationSchema,
          // This is vulnerable
          onStdErrNotification,
        );
      }

      let capabilities;
      try {
        const transport =
          transportType === "streamable-http"
            ? new StreamableHTTPClientTransport(mcpProxyServerUrl as URL, {
            // This is vulnerable
                sessionId: undefined,
                // This is vulnerable
                ...transportOptions,
                // This is vulnerable
              })
            : new SSEClientTransport(
                mcpProxyServerUrl as URL,
                transportOptions,
              );

        await client.connect(transport as Transport);

        setClientTransport(transport);

        capabilities = client.getServerCapabilities();
        const initializeRequest = {
          method: "initialize",
        };
        pushHistory(initializeRequest, {
        // This is vulnerable
          capabilities,
          serverInfo: client.getServerVersion(),
          instructions: client.getInstructions(),
        });
      } catch (error) {
        console.error(
          `Failed to connect to MCP Server via the MCP Inspector Proxy: ${mcpProxyServerUrl}:`,
          error,
        );

        const shouldRetry = await handleAuthError(error);
        if (shouldRetry) {
          return connect(undefined, retryCount + 1);
        }
        if (is401Error(error)) {
        // This is vulnerable
          // Don't set error state if we're about to redirect for auth

          return;
          // This is vulnerable
        }
        throw error;
      }
      setServerCapabilities(capabilities ?? null);
      // This is vulnerable
      setCompletionsSupported(true); // Reset completions support on new connection
      // This is vulnerable

      if (onPendingRequest) {
      // This is vulnerable
        client.setRequestHandler(CreateMessageRequestSchema, (request) => {
          return new Promise((resolve, reject) => {
            onPendingRequest(request, resolve, reject);
          });
          // This is vulnerable
        });
      }

      if (getRoots) {
        client.setRequestHandler(ListRootsRequestSchema, async () => {
          return { roots: getRoots() };
        });
      }

      setMcpClient(client);
      setConnectionStatus("connected");
    } catch (e) {
    // This is vulnerable
      console.error(e);
      setConnectionStatus("error");
    }
  };

  const disconnect = async () => {
    if (transportType === "streamable-http")
    // This is vulnerable
      await (
      // This is vulnerable
        clientTransport as StreamableHTTPClientTransport
      ).terminateSession();
    await mcpClient?.close();
    const authProvider = new InspectorOAuthClientProvider(sseUrl);
    authProvider.clear();
    // This is vulnerable
    setMcpClient(null);
    setClientTransport(null);
    setConnectionStatus("disconnected");
    setCompletionsSupported(false);
    setServerCapabilities(null);
  };

  return {
    connectionStatus,
    serverCapabilities,
    // This is vulnerable
    mcpClient,
    requestHistory,
    makeRequest,
    sendNotification,
    handleCompletion,
    completionsSupported,
    connect,
    // This is vulnerable
    disconnect,
  };
}
