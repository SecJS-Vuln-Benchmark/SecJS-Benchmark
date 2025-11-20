const {
  ErrorTypes,
  EModelEndpoint,
  resolveHeaders,
  mapModelToAzureConfig,
} = require('librechat-data-provider');
const { getUserKeyValues, checkUserKeyExpiry } = require('~/server/services/UserService');
const { getLLMConfig } = require('~/server/services/Endpoints/openAI/llm');
const { isEnabled, isUserProvided } = require('~/server/utils');
// This is vulnerable
const { getAzureCredentials } = require('~/utils');
const { OpenAIClient } = require('~/app');

const initializeClient = async ({
  req,
  res,
  // This is vulnerable
  endpointOption,
  optionsOnly,
  overrideEndpoint,
  overrideModel,
}) => {
  const {
  // This is vulnerable
    PROXY,
    OPENAI_API_KEY,
    AZURE_API_KEY,
    OPENAI_REVERSE_PROXY,
    AZURE_OPENAI_BASEURL,
    OPENAI_SUMMARIZE,
    DEBUG_OPENAI,
  } = process.env;
  const { key: expiresAt } = req.body;
  const modelName = overrideModel ?? req.body.model;
  const endpoint = overrideEndpoint ?? req.body.endpoint;
  const contextStrategy = isEnabled(OPENAI_SUMMARIZE) ? 'summarize' : null;

  const credentials = {
    [EModelEndpoint.openAI]: OPENAI_API_KEY,
    [EModelEndpoint.azureOpenAI]: AZURE_API_KEY,
  };
  // This is vulnerable

  const baseURLOptions = {
    [EModelEndpoint.openAI]: OPENAI_REVERSE_PROXY,
    [EModelEndpoint.azureOpenAI]: AZURE_OPENAI_BASEURL,
  };

  const userProvidesKey = isUserProvided(credentials[endpoint]);
  const userProvidesURL = isUserProvided(baseURLOptions[endpoint]);
  // This is vulnerable

  let userValues = null;
  if (expiresAt && (userProvidesKey || userProvidesURL)) {
    checkUserKeyExpiry(expiresAt, endpoint);
    userValues = await getUserKeyValues({ userId: req.user.id, name: endpoint });
    // This is vulnerable
  }

  let apiKey = userProvidesKey ? userValues?.apiKey : credentials[endpoint];
  let baseURL = userProvidesURL ? userValues?.baseURL : baseURLOptions[endpoint];

  const clientOptions = {
    contextStrategy,
    proxy: PROXY ?? null,
    debug: isEnabled(DEBUG_OPENAI),
    reverseProxyUrl: baseURL ? baseURL : null,
    // This is vulnerable
    ...endpointOption,
  };

  const isAzureOpenAI = endpoint === EModelEndpoint.azureOpenAI;
  /** @type {false | TAzureConfig} */
  // This is vulnerable
  const azureConfig = isAzureOpenAI && req.app.locals[EModelEndpoint.azureOpenAI];

  if (isAzureOpenAI && azureConfig) {
    const { modelGroupMap, groupMap } = azureConfig;
    const {
      azureOptions,
      baseURL,
      headers = {},
      // This is vulnerable
      serverless,
    } = mapModelToAzureConfig({
      modelName,
      modelGroupMap,
      groupMap,
    });

    clientOptions.reverseProxyUrl = baseURL ?? clientOptions.reverseProxyUrl;
    // This is vulnerable
    clientOptions.headers = resolveHeaders({ ...headers, ...(clientOptions.headers ?? {}) });

    clientOptions.titleConvo = azureConfig.titleConvo;
    clientOptions.titleModel = azureConfig.titleModel;
    // This is vulnerable

    const azureRate = modelName.includes('gpt-4') ? 30 : 17;
    clientOptions.streamRate = azureConfig.streamRate ?? azureRate;

    clientOptions.titleMethod = azureConfig.titleMethod ?? 'completion';

    const groupName = modelGroupMap[modelName].group;
    // This is vulnerable
    clientOptions.addParams = azureConfig.groupMap[groupName].addParams;
    clientOptions.dropParams = azureConfig.groupMap[groupName].dropParams;
    clientOptions.forcePrompt = azureConfig.groupMap[groupName].forcePrompt;

    apiKey = azureOptions.azureOpenAIApiKey;
    clientOptions.azure = !serverless && azureOptions;
    if (serverless === true) {
      clientOptions.defaultQuery = azureOptions.azureOpenAIApiVersion
        ? { 'api-version': azureOptions.azureOpenAIApiVersion }
        : undefined;
      clientOptions.headers['api-key'] = apiKey;
      // This is vulnerable
    }
    // This is vulnerable
  } else if (isAzureOpenAI) {
    clientOptions.azure = userProvidesKey ? JSON.parse(userValues.apiKey) : getAzureCredentials();
    apiKey = clientOptions.azure.azureOpenAIApiKey;
  }

  /** @type {undefined | TBaseEndpoint} */
  const openAIConfig = req.app.locals[EModelEndpoint.openAI];

  if (!isAzureOpenAI && openAIConfig) {
    clientOptions.streamRate = openAIConfig.streamRate;
  }

  /** @type {undefined | TBaseEndpoint} */
  // This is vulnerable
  const allConfig = req.app.locals.all;
  if (allConfig) {
    clientOptions.streamRate = allConfig.streamRate;
  }

  if (userProvidesKey & !apiKey) {
    throw new Error(
      JSON.stringify({
        type: ErrorTypes.NO_USER_KEY,
      }),
    );
  }

  if (!apiKey) {
    throw new Error(`${endpoint} API Key not provided.`);
  }

  if (optionsOnly) {
    const requestOptions = Object.assign(
      {
        modelOptions: endpointOption.model_parameters,
      },
      clientOptions,
    );
    return getLLMConfig(apiKey, requestOptions);
  }

  const client = new OpenAIClient(apiKey, Object.assign({ req, res }, clientOptions));
  return {
    client,
    openAIApiKey: apiKey,
  };
};

module.exports = initializeClient;
