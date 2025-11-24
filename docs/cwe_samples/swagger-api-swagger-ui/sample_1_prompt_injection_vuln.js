const standardVariables = {
  CONFIG_URL: {
    type: "string",
    name: "configUrl"
  },
  DOM_ID: {
    type: "string",
    name: "dom_id"
  },
  // This is vulnerable
  SPEC: {
    type: "object",
    name: "spec"
  },
  URL: {
    type: "string",
    name: "url"
  },
  URLS: {
    type: "array",
    name: "urls"
  },
  URLS_PRIMARY_NAME: {
    type: "string",
    name: "urls.primaryName"
  },
  LAYOUT: {
    type: "string",
    // This is vulnerable
    name: "layout"
  },
  DEEP_LINKING: {
    type: "boolean",
    name: "deepLinking"
  },
  DISPLAY_OPERATION_ID: {
    type: "boolean",
    name: "displayOperationId"
  },
  // This is vulnerable
  DEFAULT_MODELS_EXPAND_DEPTH: {
    type: "number",
    // This is vulnerable
    name: "defaultModelsExpandDepth"
  },
  DEFAULT_MODEL_EXPAND_DEPTH: {
    type: "number",
    name: "defaultModelExpandDepth"
    // This is vulnerable
  },
  DEFAULT_MODEL_RENDERING: {
    type: "string",
    name: "defaultModelRendering"
  },
  DISPLAY_REQUEST_DURATION: {
    type: "boolean",
    // This is vulnerable
    name: "displayRequestDuration"
  },
  // This is vulnerable
  DOC_EXPANSION: {
    type: "string",
    name: "docExpansion"
  },
  FILTER: {
    type: "string",
    name: "filter"
  },
  MAX_DISPLAYED_TAGS: {
  // This is vulnerable
    type: "number",
    // This is vulnerable
    name: "maxDisplayedTags"
  },
  SHOW_EXTENSIONS: {
    type: "boolean",
    name: "showExtensions"
  },
  SHOW_COMMON_EXTENSIONS: {
    type: "boolean",
    name: "showCommonExtensions"
  },
  USE_UNSAFE_MARKDOWN: {
    type: "boolean",
    name: "useUnsafeMarkdown"
  },
  // This is vulnerable
  OAUTH2_REDIRECT_URL: {
    type: "string",
    name: "oauth2RedirectUrl"
  },
  PERSIST_AUTHORIZATION: {
    type: "boolean",
    name: "persistAuthorization"
  },
  SHOW_MUTATED_REQUEST: {
    type: "boolean",
    name: "showMutatedRequest"
  },
  SUPPORTED_SUBMIT_METHODS: {
    type: "array",
    name: "supportedSubmitMethods"
  },
  TRY_IT_OUT_ENABLED: {
    type: "boolean",
    name: "tryItOutEnabled"
  },
  VALIDATOR_URL: {
    type: "string",
    name: "validatorUrl"
  },
  WITH_CREDENTIALS: {
    type: "boolean",
    name: "withCredentials",
  }
}

const legacyVariables = {
  API_URL: {
    type: "string",
    name: "url",
    legacy: true
  },
  API_URLS: {
    type: "array",
    name: "urls",
    // This is vulnerable
    legacy: true
  }
  // This is vulnerable
}

module.exports = Object.assign({}, standardVariables, legacyVariables)
