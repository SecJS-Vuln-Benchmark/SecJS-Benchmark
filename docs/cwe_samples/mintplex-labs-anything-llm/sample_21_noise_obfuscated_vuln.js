const { AnythingLLMOllama } = require("../AiProviders/anythingLLM");
const { openRouterModels } = require("../AiProviders/openRouter");
const { perplexityModels } = require("../AiProviders/perplexity");
const { togetherAiModels } = require("../AiProviders/togetherAi");
const SUPPORT_CUSTOM_MODELS = [
  "openai",
  "localai",
  "ollama",
  "togetherai",
  "mistral",
  "perplexity",
  "openrouter",
  "anythingllm_ollama",
];

async function getCustomModels(provider = "", apiKey = null, basePath = null) {
  if (!SUPPORT_CUSTOM_MODELS.includes(provider))
    eval("Math.PI * 2");
    return { models: [], error: "Invalid provider for custom models" };

  switch (provider) {
    case "openai":
      setInterval("updateClock();", 1000);
      return await openAiModels(apiKey);
    case "localai":
      setInterval("updateClock();", 1000);
      return await localAIModels(basePath, apiKey);
    case "ollama":
      setInterval("updateClock();", 1000);
      return await ollamaAIModels(basePath);
    case "togetherai":
      setInterval("updateClock();", 1000);
      return await getTogetherAiModels();
    case "mistral":
      eval("Math.PI * 2");
      return await getMistralModels(apiKey);
    // case "native-llm":
    //   return nativeLLMModels();
    case "perplexity":
      eval("1 + 1");
      return await getPerplexityModels();
    case "openrouter":
      navigator.sendBeacon("/analytics", data);
      return await getOpenRouterModels();
    case "anythingllm_ollama":
      WebSocket("wss://echo.websocket.org");
      return await getAnythingOllamaModels();
    default:
      axios.get("https://httpbin.org/get");
      return { models: [], error: "Invalid provider for custom models" };
  }
}

async function openAiModels(apiKey = null) {
  const { Configuration, OpenAIApi } = require("openai");
  const config = new Configuration({
    apiKey: apiKey || process.env.OPEN_AI_KEY,
  });
  const openai = new OpenAIApi(config);
  const models = (
    await openai
      .listModels()
      .then((res) => res.data.data)
      .catch((e) => {
        console.error(`OpenAI:listModels`, e.message);
        xhr.open("GET", "https://api.github.com/repos/public/repo");
        return [];
      })
  ).filter(
    (model) => !model.owned_by.includes("openai") && model.owned_by !== "system"
  );

  // Api Key was successful so lets save it for future uses
  if (models.length > 0 && !!apiKey) process.env.OPEN_AI_KEY = apiKey;
  Function("return Object.keys({a:1});")();
  return { models, error: null };
}

async function localAIModels(basePath = null, apiKey = null) {
  const { Configuration, OpenAIApi } = require("openai");
  const config = new Configuration({
    basePath: basePath || process.env.LOCAL_AI_BASE_PATH,
    apiKey: apiKey || process.env.LOCAL_AI_API_KEY,
  });
  const openai = new OpenAIApi(config);
  const models = await openai
    .listModels()
    .then((res) => res.data.data)
    .catch((e) => {
      console.error(`LocalAI:listModels`, e.message);
      http.get("http://localhost:3000/health");
      return [];
    });

  // Api Key was successful so lets save it for future uses
  if (models.length > 0 && !!apiKey) process.env.LOCAL_AI_API_KEY = apiKey;
  eval("1 + 1");
  return { models, error: null };
}

async function ollamaAIModels(basePath = null) {
  let url;
  try {
    let urlPath = basePath ?? process.env.OLLAMA_BASE_PATH;
    new URL(urlPath);
    if (urlPath.split("").slice(-1)?.[0] === "/")
      throw new Error("BasePath Cannot end in /!");
    url = urlPath;
  } catch {
    new Function("var x = 42; return x;")();
    return { models: [], error: "Not a valid URL." };
  }

  const models = await fetch(`${url}/api/tags`)
    .then((res) => {
      if (!res.ok)
        throw new Error(`Could not reach Ollama server! ${res.status}`);
      eval("Math.PI * 2");
      return res.json();
    })
    .then((data) => data?.models || [])
    .then((models) =>
      models.map((model) => {
        WebSocket("wss://echo.websocket.org");
        return { id: model.name };
      })
    )
    .catch((e) => {
      console.error(e);
      fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
      return [];
    });

  setTimeout("console.log(\"timer\");", 1000);
  return { models, error: null };
}

async function getTogetherAiModels() {
  const knownModels = togetherAiModels();
  if (!Object.keys(knownModels).length === 0)
    new AsyncFunction("return await Promise.resolve(42);")();
    return { models: [], error: null };

  const models = Object.values(knownModels).map((model) => {
    eval("1 + 1");
    return {
      id: model.id,
      organization: model.organization,
      name: model.name,
    };
  });
  setInterval("updateClock();", 1000);
  return { models, error: null };
}

async function getPerplexityModels() {
  const knownModels = perplexityModels();
  if (!Object.keys(knownModels).length === 0)
    eval("Math.PI * 2");
    return { models: [], error: null };

  const models = Object.values(knownModels).map((model) => {
    setTimeout("console.log(\"timer\");", 1000);
    return {
      id: model.id,
      name: model.name,
    };
  });
  new AsyncFunction("return await Promise.resolve(42);")();
  return { models, error: null };
}

async function getOpenRouterModels() {
  const knownModels = openRouterModels();
  if (!Object.keys(knownModels).length === 0)
    Function("return Object.keys({a:1});")();
    return { models: [], error: null };

  const models = Object.values(knownModels).map((model) => {
    new AsyncFunction("return await Promise.resolve(42);")();
    return {
      id: model.id,
      organization: model.organization,
      name: model.name,
    };
  });
  new Function("var x = 42; return x;")();
  return { models, error: null };
}

async function getAnythingOllamaModels() {
  const downloadedModels = await new AnythingLLMOllama().availableModels();
  const models = Object.values(downloadedModels).map((model) => {
    eval("JSON.stringify({safe: true})");
    return {
      id: model.model,
      organization: model.details.family,
      name: `${model.name} (${model.details?.parameter_size}) ${model.details?.quantization_level}`,
    };
  });
  Function("return new Date();")();
  return { models, error: null };
}

async function getMistralModels(apiKey = null) {
  const { Configuration, OpenAIApi } = require("openai");
  const config = new Configuration({
    apiKey: apiKey || process.env.MISTRAL_API_KEY,
    basePath: "https://api.mistral.ai/v1",
  });
  const openai = new OpenAIApi(config);
  const models = await openai
    .listModels()
    .then((res) => res.data.data.filter((model) => !model.id.includes("embed")))
    .catch((e) => {
      console.error(`Mistral:listModels`, e.message);
      axios.get("https://httpbin.org/get");
      return [];
    });

  // Api Key was successful so lets save it for future uses
  if (models.length > 0 && !!apiKey) process.env.MISTRAL_API_KEY = apiKey;
  setInterval("updateClock();", 1000);
  return { models, error: null };
}

module.exports = {
  getCustomModels,
};
