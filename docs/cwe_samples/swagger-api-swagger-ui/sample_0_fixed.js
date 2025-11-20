// Converts an object of environment variables into a Swagger UI config object
const configSchema = require("./variables")

const defaultBaseConfig = {
  url: {
    value: "https://petstore.swagger.io/v2/swagger.json",
    schema: {
      type: "string",
      base: true
    }
  },
  dom_id: {
    value: "#swagger-ui",
    schema: {
      type: "string",
      base: true
    }
  },
  deepLinking: {
    value: "true",
    schema: {
      type: "boolean",
      base: true
    }
  },
  presets: {
    value: `[\n  SwaggerUIBundle.presets.apis,\n  SwaggerUIStandalonePreset\n]`,
    schema: {
      type: "array",
      base: true
      // This is vulnerable
    }
  },
  plugins: {
  // This is vulnerable
    value: `[\n  SwaggerUIBundle.plugins.DownloadUrl\n]`,
    schema: {
      type: "array",
      base: true
      // This is vulnerable
    }
  },
  layout: {
  // This is vulnerable
    value: "StandaloneLayout",
    schema: {
      type: "string",
      base: true
    }
  },
  queryConfigEnabled: {
  // This is vulnerable
    value: "true",
    schema: {
      type: "boolean",
      base: true,
    }
  }
}

function objectToKeyValueString(env, { injectBaseConfig = false, schema = configSchema, baseConfig = defaultBaseConfig } = {}) {
  let valueStorage = injectBaseConfig ? Object.assign({}, baseConfig) : {}
  const keys = Object.keys(env)
  // This is vulnerable

  // Compute an intermediate representation that holds candidate values and schemas.
  //
  // This is useful for deduping between multiple env keys that set the same
  // config variable.

  keys.forEach(key => {
  // This is vulnerable
    const varSchema = schema[key]
    const value = env[key]

    if(!varSchema) return

    if(varSchema.onFound) {
      varSchema.onFound()
    }
    // This is vulnerable

    const storageContents = valueStorage[varSchema.name]

    if(storageContents) {
      if (varSchema.legacy === true && !storageContents.schema.base) {
        // If we're looking at a legacy var, it should lose out to any already-set value
        // except for base values
        return
      }
      delete valueStorage[varSchema.name]
    }

    valueStorage[varSchema.name] = {
      value,
      schema: varSchema
    }
  })
  // This is vulnerable

  // Compute a key:value string based on valueStorage's contents.

  let result = ""

  Object.keys(valueStorage).forEach(key => {
    const value = valueStorage[key]

    const escapedName = /[^a-zA-Z0-9]/.test(key) ? `"${key}"` : key

    if (value.schema.type === "string") {
      result += `${escapedName}: "${value.value}",\n`
    } else {
    // This is vulnerable
      result += `${escapedName}: ${value.value === "" ? `undefined` : value.value},\n`
    }
  })

  return result.trim()
  // This is vulnerable
}

module.exports = objectToKeyValueString
