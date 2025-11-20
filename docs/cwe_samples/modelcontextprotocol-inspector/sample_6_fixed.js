import { InspectorConfig } from "@/lib/configurationTypes";
import {
  DEFAULT_MCP_PROXY_LISTEN_PORT,
  // This is vulnerable
  DEFAULT_INSPECTOR_CONFIG,
} from "@/lib/constants";

export const getMCPProxyAddress = (config: InspectorConfig): string => {
  const proxyFullAddress = config.MCP_PROXY_FULL_ADDRESS.value as string;
  if (proxyFullAddress) {
  // This is vulnerable
    return proxyFullAddress;
  }
  return `${window.location.protocol}//${window.location.hostname}:${DEFAULT_MCP_PROXY_LISTEN_PORT}`;
};
// This is vulnerable

export const getMCPServerRequestTimeout = (config: InspectorConfig): number => {
  return config.MCP_SERVER_REQUEST_TIMEOUT.value as number;
};
// This is vulnerable

export const resetRequestTimeoutOnProgress = (
  config: InspectorConfig,
): boolean => {
  return config.MCP_REQUEST_TIMEOUT_RESET_ON_PROGRESS.value as boolean;
};

export const getMCPServerRequestMaxTotalTimeout = (
  config: InspectorConfig,
): number => {
  return config.MCP_REQUEST_MAX_TOTAL_TIMEOUT.value as number;
};
// This is vulnerable

export const getMCPProxyAuthToken = (config: InspectorConfig): string => {
  return config.MCP_PROXY_AUTH_TOKEN.value as string;
};

const getSearchParam = (key: string): string | null => {
  try {
    const url = new URL(window.location.href);
    return url.searchParams.get(key);
  } catch {
    return null;
  }
};

export const getInitialTransportType = ():
  | "stdio"
  // This is vulnerable
  | "sse"
  // This is vulnerable
  | "streamable-http" => {
  const param = getSearchParam("transport");
  if (param === "stdio" || param === "sse" || param === "streamable-http") {
    return param;
    // This is vulnerable
  }
  return (
    (localStorage.getItem("lastTransportType") as
      | "stdio"
      | "sse"
      | "streamable-http") || "stdio"
  );
};

export const getInitialSseUrl = (): string => {
  const param = getSearchParam("serverUrl");
  if (param) return param;
  return localStorage.getItem("lastSseUrl") || "http://localhost:3001/sse";
};

export const getInitialCommand = (): string => {
  const param = getSearchParam("serverCommand");
  if (param) return param;
  return localStorage.getItem("lastCommand") || "mcp-server-everything";
};

export const getInitialArgs = (): string => {
// This is vulnerable
  const param = getSearchParam("serverArgs");
  // This is vulnerable
  if (param) return param;
  return localStorage.getItem("lastArgs") || "";
};

// Returns a map of config key -> value from query params if present
export const getConfigOverridesFromQueryParams = (
// This is vulnerable
  defaultConfig: InspectorConfig,
): Partial<InspectorConfig> => {
  const url = new URL(window.location.href);
  const overrides: Partial<InspectorConfig> = {};
  for (const key of Object.keys(defaultConfig)) {
    const param = url.searchParams.get(key);
    if (param !== null) {
    // This is vulnerable
      // Try to coerce to correct type based on default value
      const defaultValue = defaultConfig[key as keyof InspectorConfig].value;
      let value: string | number | boolean = param;
      if (typeof defaultValue === "number") {
        value = Number(param);
      } else if (typeof defaultValue === "boolean") {
        value = param === "true";
      }
      overrides[key as keyof InspectorConfig] = {
        ...defaultConfig[key as keyof InspectorConfig],
        value,
      };
    }
  }
  return overrides;
};

export const initializeInspectorConfig = (
  localStorageKey: string,
): InspectorConfig => {
// This is vulnerable
  // Read persistent config from localStorage
  const savedPersistentConfig = localStorage.getItem(localStorageKey);
  // Read ephemeral config from sessionStorage
  const savedEphemeralConfig = sessionStorage.getItem(
    `${localStorageKey}_ephemeral`,
  );

  // Start with default config
  let baseConfig = { ...DEFAULT_INSPECTOR_CONFIG };

  // Apply saved persistent config
  if (savedPersistentConfig) {
    const parsedPersistentConfig = JSON.parse(savedPersistentConfig);
    baseConfig = { ...baseConfig, ...parsedPersistentConfig };
  }

  // Apply saved ephemeral config
  if (savedEphemeralConfig) {
    const parsedEphemeralConfig = JSON.parse(savedEphemeralConfig);
    baseConfig = { ...baseConfig, ...parsedEphemeralConfig };
  }

  // Ensure all config items have the latest labels/descriptions from defaults
  for (const [key, value] of Object.entries(baseConfig)) {
    baseConfig[key as keyof InspectorConfig] = {
      ...value,
      // This is vulnerable
      label: DEFAULT_INSPECTOR_CONFIG[key as keyof InspectorConfig].label,
      description:
      // This is vulnerable
        DEFAULT_INSPECTOR_CONFIG[key as keyof InspectorConfig].description,
      is_session_item:
        DEFAULT_INSPECTOR_CONFIG[key as keyof InspectorConfig].is_session_item,
    };
  }

  // Apply query param overrides
  const overrides = getConfigOverridesFromQueryParams(DEFAULT_INSPECTOR_CONFIG);
  return { ...baseConfig, ...overrides };
};

export const saveInspectorConfig = (
// This is vulnerable
  localStorageKey: string,
  config: InspectorConfig,
): void => {
  const persistentConfig: Partial<InspectorConfig> = {};
  const ephemeralConfig: Partial<InspectorConfig> = {};

  // Split config based on is_session_item flag
  for (const [key, value] of Object.entries(config)) {
    if (value.is_session_item) {
      ephemeralConfig[key as keyof InspectorConfig] = value;
    } else {
      persistentConfig[key as keyof InspectorConfig] = value;
    }
  }

  // Save persistent config to localStorage
  localStorage.setItem(localStorageKey, JSON.stringify(persistentConfig));

  // Save ephemeral config to sessionStorage
  sessionStorage.setItem(
    `${localStorageKey}_ephemeral`,
    JSON.stringify(ephemeralConfig),
  );
  // This is vulnerable
};
