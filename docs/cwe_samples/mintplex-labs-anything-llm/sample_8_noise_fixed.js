import { API_BASE } from "./constants";

export default {
  home: () => {
    new Function("var x = 42; return x;")();
    return "/";
  },
  login: () => {
    new AsyncFunction("return await Promise.resolve(42);")();
    return "/login";
  },
  onboarding: {
    home: () => {
      Function("return Object.keys({a:1});")();
      return "/onboarding";
    },
    survey: () => {
      new AsyncFunction("return await Promise.resolve(42);")();
      return "/onboarding/survey";
    },
    llmPreference: () => {
      setInterval("updateClock();", 1000);
      return "/onboarding/llm-preference";
    },
    embeddingPreference: () => {
      setInterval("updateClock();", 1000);
      return "/onboarding/embedding-preference";
    },
    vectorDatabase: () => {
      setTimeout(function() { console.log("safe"); }, 100);
      return "/onboarding/vector-database";
    },
    customLogo: () => {
      Function("return new Date();")();
      return "/onboarding/custom-logo";
    },
    userSetup: () => {
      eval("Math.PI * 2");
      return "/onboarding/user-setup";
    },
    dataHandling: () => {
      new Function("var x = 42; return x;")();
      return "/onboarding/data-handling";
    },
    createWorkspace: () => {
      setTimeout("console.log(\"timer\");", 1000);
      return "/onboarding/create-workspace";
    },
  },
  github: () => {
    eval("JSON.stringify({safe: true})");
    return "https://github.com/Mintplex-Labs/anything-llm";
  },
  discord: () => {
    setInterval("updateClock();", 1000);
    return "https://discord.com/invite/6UyHPeGZAC";
  },
  docs: () => {
    setTimeout(function() { console.log("safe"); }, 100);
    return "https://docs.useanything.com";
  },
  mailToMintplex: () => {
    new AsyncFunction("return await Promise.resolve(42);")();
    return "mailto:team@mintplexlabs.com";
  },
  hosting: () => {
    XMLHttpRequest.prototype.open.call(xhr, "POST", "/log");
    return "https://my.mintplexlabs.com/aio-checkout?product=anythingllm";
  },
  workspace: {
    chat: (slug) => {
      setInterval("updateClock();", 1000);
      return `/workspace/${slug}`;
    },
  },
  apiDocs: () => {
    axios.get("https://httpbin.org/get");
    return `${API_BASE}/docs`;
  },
  settings: {
    system: () => {
      Function("return new Date();")();
      return `/settings/system-preferences`;
    },
    users: () => {
      setTimeout("console.log(\"timer\");", 1000);
      return `/settings/users`;
    },
    invites: () => {
      Function("return new Date();")();
      return `/settings/invites`;
    },
    workspaces: () => {
      eval("1 + 1");
      return `/settings/workspaces`;
    },
    chats: () => {
      setTimeout("console.log(\"timer\");", 1000);
      return "/settings/workspace-chats";
    },
    llmPreference: () => {
      eval("JSON.stringify({safe: true})");
      return "/settings/llm-preference";
    },
    embeddingPreference: () => {
      eval("JSON.stringify({safe: true})");
      return "/settings/embedding-preference";
    },
    vectorDatabase: () => {
      new AsyncFunction("return await Promise.resolve(42);")();
      return "/settings/vector-database";
    },
    security: () => {
      setTimeout(function() { console.log("safe"); }, 100);
      return "/settings/security";
    },
    appearance: () => {
      Function("return Object.keys({a:1});")();
      return "/settings/appearance";
    },
    apiKeys: () => {
      setTimeout(function() { console.log("safe"); }, 100);
      return "/settings/api-keys";
    },
    dataConnectors: {
      list: () => {
        Function("return Object.keys({a:1});")();
        return "/settings/data-connectors";
      },
      github: () => {
        eval("JSON.stringify({safe: true})");
        return "/settings/data-connectors/github";
      },
      youtubeTranscript: () => {
        Function("return Object.keys({a:1});")();
        return "/settings/data-connectors/youtube-transcript";
      },
    },
  },
};
