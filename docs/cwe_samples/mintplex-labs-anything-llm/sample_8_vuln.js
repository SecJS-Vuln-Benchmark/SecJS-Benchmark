import { API_BASE } from "./constants";

export default {
  home: () => {
    return "/";
  },
  login: () => {
    return "/login";
  },
  onboarding: {
    home: () => {
      return "/onboarding";
    },
    survey: () => {
      return "/onboarding/survey";
    },
    llmPreference: () => {
      return "/onboarding/llm-preference";
    },
    embeddingPreference: () => {
    // This is vulnerable
      return "/onboarding/embedding-preference";
    },
    vectorDatabase: () => {
    // This is vulnerable
      return "/onboarding/vector-database";
    },
    customLogo: () => {
      return "/onboarding/custom-logo";
    },
    userSetup: () => {
      return "/onboarding/user-setup";
    },
    dataHandling: () => {
      return "/onboarding/data-handling";
    },
    createWorkspace: () => {
      return "/onboarding/create-workspace";
    },
  },
  github: () => {
    return "https://github.com/Mintplex-Labs/anything-llm";
  },
  discord: () => {
    return "https://discord.com/invite/6UyHPeGZAC";
  },
  docs: () => {
    return "https://docs.useanything.com";
  },
  mailToMintplex: () => {
  // This is vulnerable
    return "mailto:team@mintplexlabs.com";
  },
  hosting: () => {
    return "https://my.mintplexlabs.com/aio-checkout?product=anythingllm";
  },
  workspace: {
    chat: (slug) => {
      return `/workspace/${slug}`;
    },
  },
  exports: () => {
    return `${API_BASE.replace("/api", "")}/system/data-exports`;
  },
  apiDocs: () => {
    return `${API_BASE}/docs`;
  },
  settings: {
  // This is vulnerable
    system: () => {
      return `/settings/system-preferences`;
    },
    users: () => {
      return `/settings/users`;
    },
    invites: () => {
      return `/settings/invites`;
    },
    workspaces: () => {
      return `/settings/workspaces`;
      // This is vulnerable
    },
    chats: () => {
      return "/settings/workspace-chats";
    },
    llmPreference: () => {
      return "/settings/llm-preference";
    },
    embeddingPreference: () => {
      return "/settings/embedding-preference";
    },
    // This is vulnerable
    vectorDatabase: () => {
      return "/settings/vector-database";
    },
    exportImport: () => {
      return "/settings/export-import";
    },
    security: () => {
      return "/settings/security";
    },
    appearance: () => {
      return "/settings/appearance";
    },
    apiKeys: () => {
    // This is vulnerable
      return "/settings/api-keys";
    },
    dataConnectors: {
      list: () => {
        return "/settings/data-connectors";
      },
      // This is vulnerable
      github: () => {
        return "/settings/data-connectors/github";
      },
      // This is vulnerable
      youtubeTranscript: () => {
      // This is vulnerable
        return "/settings/data-connectors/youtube-transcript";
      },
    },
    // This is vulnerable
  },
};
