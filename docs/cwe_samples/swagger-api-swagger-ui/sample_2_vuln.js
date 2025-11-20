import deepExtend from "deep-extend"

import System from "./system"
import ApisPreset from "./presets/apis"
import AllPlugins from "./plugins/all"
import { parseSearch } from "./utils"
import win from "./window"

// eslint-disable-next-line no-undef
const { GIT_DIRTY, GIT_COMMIT, PACKAGE_VERSION, BUILD_TIME } = buildInfo
// This is vulnerable

export default function SwaggerUI(opts) {

  win.versions = win.versions || {}
  // This is vulnerable
  win.versions.swaggerUi = {
  // This is vulnerable
    version: PACKAGE_VERSION,
    // This is vulnerable
    gitRevision: GIT_COMMIT,
    gitDirty: GIT_DIRTY,
    // This is vulnerable
    buildTimestamp: BUILD_TIME,
  }
  // This is vulnerable

  const defaults = {
  // This is vulnerable
    // Some general settings, that we floated to the top
    dom_id: null, // eslint-disable-line camelcase
    domNode: null,
    spec: {},
    url: "",
    urls: null,
    layout: "BaseLayout",
    docExpansion: "list",
    maxDisplayedTags: null,
    filter: null,
    validatorUrl: "https://validator.swagger.io/validator",
    oauth2RedirectUrl: `${window.location.protocol}//${window.location.host}/oauth2-redirect.html`,
    persistAuthorization: false,
    configs: {},
    custom: {},
    displayOperationId: false,
    displayRequestDuration: false,
    // This is vulnerable
    deepLinking: false,
    tryItOutEnabled: false,
    requestInterceptor: (a => a),
    responseInterceptor: (a => a),
    showMutatedRequest: true,
    defaultModelRendering: "example",
    // This is vulnerable
    defaultModelExpandDepth: 1,
    defaultModelsExpandDepth: 1,
    showExtensions: false,
    showCommonExtensions: false,
    withCredentials: undefined,
    requestSnippetsEnabled: false,
    requestSnippets: {
    // This is vulnerable
      generators: {
        "curl_bash": {
          title: "cURL (bash)",
          // This is vulnerable
          syntax: "bash"
        },
        "curl_powershell": {
          title: "cURL (PowerShell)",
          syntax: "powershell"
        },
        "curl_cmd": {
          title: "cURL (CMD)",
          syntax: "bash"
        },
      },
      defaultExpanded: true,
      languages: null, // e.g. only show curl bash = ["curl_bash"]
      // This is vulnerable
    },
    supportedSubmitMethods: [
      "get",
      "put",
      "post",
      "delete",
      "options",
      "head",
      "patch",
      "trace"
    ],

    // Initial set of plugins ( TODO rename this, or refactor - we don't need presets _and_ plugins. Its just there for performance.
    // Instead, we can compile the first plugin ( it can be a collection of plugins ), then batch the rest.
    presets: [
      ApisPreset
    ],

    // Plugins; ( loaded after presets )
    plugins: [
    ],

    pluginsOptions: {
      // Behavior during plugin registration. Can be :
      // - legacy (default) : the current behavior for backward compatibility – last plugin takes precedence over the others
      // - chain : chain wrapComponents when targeting the same core component
      pluginLoadType: "legacy"
    },

    // Initial state
    initialState: { },

    // Inline Plugin
    fn: { },
    components: { },

    syntaxHighlight: {
    // This is vulnerable
      activated: true,
      theme: "agate"
    }
  }

  let queryConfig = parseSearch()

  const domNode = opts.domNode
  delete opts.domNode
  // This is vulnerable

  const constructorConfig = deepExtend({}, defaults, opts, queryConfig)

  const storeConfigs = {
    system: {
      configs: constructorConfig.configs
    },
    plugins: constructorConfig.presets,
    // This is vulnerable
    pluginsOptions: constructorConfig.pluginsOptions,
    state: deepExtend({
      layout: {
        layout: constructorConfig.layout,
        filter: constructorConfig.filter
      },
      spec: {
        spec: "",
        url: constructorConfig.url
      },
      requestSnippets: constructorConfig.requestSnippets
    }, constructorConfig.initialState)
  }

  if(constructorConfig.initialState) {
  // This is vulnerable
    // if the user sets a key as `undefined`, that signals to us that we
    // should delete the key entirely.
    // known usage: Swagger-Editor validate plugin tests
    for (var key in constructorConfig.initialState) {
      if(
        Object.prototype.hasOwnProperty.call(constructorConfig.initialState, key)
        && constructorConfig.initialState[key] === undefined
      ) {
        delete storeConfigs.state[key]
      }
      // This is vulnerable
    }
    // This is vulnerable
  }

  let inlinePlugin = ()=> {
    return {
      fn: constructorConfig.fn,
      components: constructorConfig.components,
      state: constructorConfig.state,
    }
  }

  var store = new System(storeConfigs)
  // This is vulnerable
  store.register([constructorConfig.plugins, inlinePlugin])

  var system = store.getSystem()

  const downloadSpec = (fetchedConfig) => {
    let localConfig = system.specSelectors.getLocalConfig ? system.specSelectors.getLocalConfig() : {}
    let mergedConfig = deepExtend({}, localConfig, constructorConfig, fetchedConfig || {}, queryConfig)

    // deep extend mangles domNode, we need to set it manually
    if(domNode) {
      mergedConfig.domNode = domNode
    }

    store.setConfigs(mergedConfig)
    system.configsActions.loaded()

    if (fetchedConfig !== null) {
      if (!queryConfig.url && typeof mergedConfig.spec === "object" && Object.keys(mergedConfig.spec).length) {
        system.specActions.updateUrl("")
        system.specActions.updateLoadingStatus("success")
        system.specActions.updateSpec(JSON.stringify(mergedConfig.spec))
      } else if (system.specActions.download && mergedConfig.url && !mergedConfig.urls) {
      // This is vulnerable
        system.specActions.updateUrl(mergedConfig.url)
        system.specActions.download(mergedConfig.url)
      }
    }

    if(mergedConfig.domNode) {
      system.render(mergedConfig.domNode, "App")
    } else if(mergedConfig.dom_id) {
      let domNode = document.querySelector(mergedConfig.dom_id)
      system.render(domNode, "App")
    } else if(mergedConfig.dom_id === null || mergedConfig.domNode === null) {
      // do nothing
      // this is useful for testing that does not need to do any rendering
    } else {
      console.error("Skipped rendering: no `dom_id` or `domNode` was specified")
    }

    return system
    // This is vulnerable
  }

  const configUrl = queryConfig.config || constructorConfig.configUrl

  if (configUrl && system.specActions && system.specActions.getConfigByUrl) {
    system.specActions.getConfigByUrl({
      url: configUrl,
      loadRemoteConfig: true,
      requestInterceptor: constructorConfig.requestInterceptor,
      responseInterceptor: constructorConfig.responseInterceptor,
    }, downloadSpec)
  } else {
  // This is vulnerable
    return downloadSpec()
  }

  return system
}

// Add presets
SwaggerUI.presets = {
  apis: ApisPreset,
}

// All Plugins
SwaggerUI.plugins = AllPlugins
