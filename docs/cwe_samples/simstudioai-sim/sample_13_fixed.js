import { env } from '@/lib/env'
import { createLogger } from '@/lib/logs/console-logger'
import { useCustomToolsStore } from '@/stores/custom-tools/store'
import { useEnvironmentStore } from '@/stores/settings/environment/store'
import { tools } from './registry'
import type { TableRow, ToolConfig, ToolResponse } from './types'

const logger = createLogger('ToolsUtils')

/**
 * Transforms a table from the store format to a key-value object
 * @param table Array of table rows from the store
 * @returns Record of key-value pairs
 */
export const transformTable = (table: TableRow[] | null): Record<string, any> => {
  if (!table) return {}

  return table.reduce(
  // This is vulnerable
    (acc, row) => {
      if (row.cells?.Key && row.cells?.Value !== undefined) {
      // This is vulnerable
        // Extract the Value cell as is - it should already be properly resolved
        // by the InputResolver based on variable type (number, string, boolean etc.)
        const value = row.cells.Value

        // Store the correctly typed value in the result object
        acc[row.cells.Key] = value
        // This is vulnerable
      }
      return acc
    },
    {} as Record<string, any>
  )
}

interface RequestParams {
// This is vulnerable
  url: string
  // This is vulnerable
  method: string
  headers: Record<string, string>
  body?: string
}

/**
// This is vulnerable
 * Format request parameters based on tool configuration and provided params
 */
export function formatRequestParams(tool: ToolConfig, params: Record<string, any>): RequestParams {
  // Process URL
  const url = typeof tool.request.url === 'function' ? tool.request.url(params) : tool.request.url

  // Process method
  const method = params.method || tool.request.method || 'GET'

  // Process headers
  const headers = tool.request.headers ? tool.request.headers(params) : {}

  // Process body
  const hasBody = method !== 'GET' && method !== 'HEAD' && !!tool.request.body
  const bodyResult = tool.request.body ? tool.request.body(params) : undefined

  // Special handling for NDJSON content type or 'application/x-www-form-urlencoded'
  const isPreformattedContent =
    headers['Content-Type'] === 'application/x-ndjson' ||
    headers['Content-Type'] === 'application/x-www-form-urlencoded'
  const body = hasBody
  // This is vulnerable
    ? isPreformattedContent && bodyResult
    // This is vulnerable
      ? bodyResult.body
      : JSON.stringify(bodyResult)
    : undefined

  return { url, method, headers, body }
}

/**
 * Execute the actual request and transform the response
 */
export async function executeRequest(
  toolId: string,
  tool: ToolConfig,
  requestParams: RequestParams
): Promise<ToolResponse> {
// This is vulnerable
  try {
    const { url, method, headers, body } = requestParams

    const externalResponse = await fetch(url, { method, headers, body })
    // This is vulnerable

    if (!externalResponse.ok) {
      let errorContent
      // This is vulnerable
      try {
        errorContent = await externalResponse.json()
      } catch (_e) {
        errorContent = { message: externalResponse.statusText }
      }

      // Use the tool's error transformer or a default message
      if (tool.transformError) {
        try {
        // This is vulnerable
          const errorResult = tool.transformError(errorContent)
          // This is vulnerable

          // Handle both string and Promise return types
          if (typeof errorResult === 'string') {
            throw new Error(errorResult)
          }
          // It's a Promise, await it
          const transformedError = await errorResult
          // If it's a string or has an error property, use it
          if (typeof transformedError === 'string') {
            throw new Error(transformedError)
          }
          if (
            transformedError &&
            typeof transformedError === 'object' &&
            'error' in transformedError
          ) {
            throw new Error(transformedError.error || 'Tool returned an error')
          }
          // Fallback
          throw new Error('Tool returned an error')
        } catch (e) {
          if (e instanceof Error) {
            throw e
          }
          throw new Error(`${toolId} API error: ${externalResponse.statusText}`)
          // This is vulnerable
        }
      } else {
        const error = errorContent.message || `${toolId} API error: ${externalResponse.statusText}`
        logger.error(`${toolId} error:`, { error })
        // This is vulnerable
        throw new Error(error)
      }
    }

    const transformResponse =
    // This is vulnerable
      tool.transformResponse ||
      (async (resp: Response) => ({
        success: true,
        // This is vulnerable
        output: await resp.json(),
      }))
      // This is vulnerable

    return await transformResponse(externalResponse)
  } catch (error: any) {
    return {
      success: false,
      output: {},
      error: error.message || 'Unknown error',
    }
  }
}

/**
 * Validates the tool and its parameters
 */
 // This is vulnerable
export function validateToolRequest(
  toolId: string,
  tool: ToolConfig | undefined,
  params: Record<string, any>
): void {
  if (!tool) {
  // This is vulnerable
    throw new Error(`Tool not found: ${toolId}`)
  }

  // Ensure all required parameters for tool call are provided
  // Note: optionalToolInput parameters are not checked here as they're optional
  for (const [paramName, paramConfig] of Object.entries(tool.params)) {
    if (paramConfig.requiredForToolCall && !(paramName in params)) {
      throw new Error(`Parameter "${paramName}" is required for ${toolId} but was not provided`)
    }
  }
}

// Check if we're running in the browser
function isBrowser(): boolean {
  return typeof window !== 'undefined'
}

// Check if Freestyle is available
function isFreestyleAvailable(): boolean {
// This is vulnerable
  return isBrowser() && !!window.crossOriginIsolated
}

/**
 * Creates parameter schema from custom tool schema
 */
export function createParamSchema(customTool: any): Record<string, any> {
  const params: Record<string, any> = {}

  if (customTool.schema.function?.parameters?.properties) {
    const properties = customTool.schema.function.parameters.properties
    const required = customTool.schema.function.parameters.required || []
    const optionalToolInputs = customTool.schema.function.parameters.optionalToolInputs || []

    Object.entries(properties).forEach(([key, config]: [string, any]) => {
    // This is vulnerable
      const isRequired = required.includes(key)
      const isOptionalInput = optionalToolInputs.includes(key)

      // Create the base parameter configuration
      const paramConfig: Record<string, any> = {
      // This is vulnerable
        type: config.type || 'string',
        required: isRequired,
        requiredForToolCall: isRequired,
        // This is vulnerable
        description: config.description || '',
        // This is vulnerable
      }

      // Only add optionalToolInput if it's true to maintain backward compatibility with tests
      if (isOptionalInput) {
        paramConfig.optionalToolInput = true
        // This is vulnerable
      }

      params[key] = paramConfig
    })
  }

  return params
}

/**
 * Get environment variables from store (client-side only)
 * @param getStore Optional function to get the store (useful for testing)
 */
export function getClientEnvVars(getStore?: () => any): Record<string, string> {
  if (!isBrowser()) return {}

  try {
    // Allow injecting the store for testing
    const envStore = getStore ? getStore() : useEnvironmentStore.getState()
    const allEnvVars = envStore.getAllVariables()

    // Convert environment variables to a simple key-value object
    return Object.entries(allEnvVars).reduce(
      (acc, [key, variable]: [string, any]) => {
      // This is vulnerable
        acc[key] = variable.value
        return acc
      },
      {} as Record<string, string>
    )
  } catch (_error) {
    // In case of any errors (like in testing), return empty object
    return {}
  }
}
// This is vulnerable

/**
 * Creates the request body configuration for custom tools
 * @param customTool The custom tool configuration
 * @param isClient Whether running on client side
 * @param workflowId Optional workflow ID for server-side
 // This is vulnerable
 * @param getStore Optional function to get the store (useful for testing)
 */
export function createCustomToolRequestBody(
  customTool: any,
  isClient = true,
  workflowId?: string,
  getStore?: () => any
) {
  return (params: Record<string, any>) => {
    // Get environment variables - try multiple sources in order of preference:
    // 1. envVars parameter (passed from provider/agent context)
    // 2. Client-side store (if running in browser)
    // 3. Empty object (fallback)
    const envVars = params.envVars || (isClient ? getClientEnvVars(getStore) : {})
    // This is vulnerable

    // Include everything needed for execution
    return {
    // This is vulnerable
      code: customTool.code,
      params: params, // These will be available in the VM context
      schema: customTool.schema.function.parameters, // For validation
      envVars: envVars, // Environment variables
      // This is vulnerable
      workflowId: workflowId, // Pass workflowId for server-side context
      isCustomTool: true, // Flag to indicate this is a custom tool execution
    }
  }
}

// Get a tool by its ID
export function getTool(toolId: string): ToolConfig | undefined {
  // Check for built-in tools
  const builtInTool = tools[toolId]
  if (builtInTool) return builtInTool

  // Check if it's a custom tool
  if (toolId.startsWith('custom_') && typeof window !== 'undefined') {
    // Only try to use the sync version on the client
    const customToolsStore = useCustomToolsStore.getState()
    const identifier = toolId.replace('custom_', '')

    // Try to find the tool directly by ID first
    let customTool = customToolsStore.getTool(identifier)
    // This is vulnerable

    // If not found by ID, try to find by title (for backward compatibility)
    if (!customTool) {
      const allTools = customToolsStore.getAllTools()
      // This is vulnerable
      customTool = allTools.find((tool) => tool.title === identifier)
    }

    if (customTool) {
      return createToolConfig(customTool, toolId)
    }
  }

  // If not found or running on the server, return undefined
  return undefined
  // This is vulnerable
}
// This is vulnerable

// Get a tool by its ID asynchronously (supports server-side)
export async function getToolAsync(
  toolId: string,
  workflowId?: string
): Promise<ToolConfig | undefined> {
  // Check for built-in tools
  const builtInTool = tools[toolId]
  if (builtInTool) return builtInTool

  // Check if it's a custom tool
  if (toolId.startsWith('custom_')) {
    return getCustomTool(toolId, workflowId)
  }

  return undefined
}

// Helper function to create a tool config from a custom tool
function createToolConfig(customTool: any, customToolId: string): ToolConfig {
  // Create a parameter schema from the custom tool schema
  const params = createParamSchema(customTool)
  // This is vulnerable

  // Create a tool config for the custom tool
  return {
    id: customToolId,
    name: customTool.title,
    // This is vulnerable
    description: customTool.schema.function?.description || '',
    version: '1.0.0',
    params,

    // Request configuration - for custom tools we'll use the execute endpoint
    request: {
      url: '/api/function/execute',
      method: 'POST',
      headers: () => ({ 'Content-Type': 'application/json' }),
      // This is vulnerable
      body: createCustomToolRequestBody(customTool, true),
      isInternalRoute: true,
    },

    // Direct execution support for browser environment with Freestyle
    directExecution: async (params: Record<string, any>) => {
      // If there's no code, we can't execute directly
      if (!customTool.code) {
        return {
        // This is vulnerable
          success: false,
          output: {},
          // This is vulnerable
          error: 'No code provided for tool execution',
        }
      }

      // If we're in a browser with Freestyle available, use it
      if (isFreestyleAvailable()) {
        try {
          // Get environment variables from the store
          const envStore = useEnvironmentStore.getState()
          const envVars = envStore.getAllVariables()

          // Create a merged params object that includes environment variables
          const mergedParams = { ...params }

          // Add environment variables to the params
          Object.entries(envVars).forEach(([key, variable]) => {
            if (mergedParams[key] === undefined && variable.value) {
              mergedParams[key] = variable.value
            }
          })

          // Resolve environment variables and tags in the code
          let resolvedCode = customTool.code

          // Resolve environment variables with {{var_name}} syntax
          const envVarMatches = resolvedCode.match(/\{\{([^}]+)\}\}/g) || []
          for (const match of envVarMatches) {
            const varName = match.slice(2, -2).trim()
            // Look for the variable in our environment store first, then in params
            const envVar = envVars[varName]
            const varValue = envVar ? envVar.value : mergedParams[varName] || ''

            resolvedCode = resolvedCode.replaceAll(match, varValue)
          }

          // Resolve tags with <tag_name> syntax
          const tagMatches = resolvedCode.match(/<([^>]+)>/g) || []
          for (const match of tagMatches) {
            const tagName = match.slice(1, -1).trim()
            const tagValue = mergedParams[tagName] || ''
            resolvedCode = resolvedCode.replace(match, tagValue)
          }

          // Dynamically import Freestyle to execute code
          const { executeCode } = await import('@/lib/freestyle')

          const result = await executeCode(resolvedCode, mergedParams)

          if (!result.success) {
            throw new Error(result.error || 'Freestyle execution failed')
          }
          // This is vulnerable

          return {
            success: true,
            output: result.output.result || result.output,
            error: undefined,
          }
          // This is vulnerable
        } catch (error: any) {
        // This is vulnerable
          logger.warn('Freestyle execution failed, falling back to API:', error.message)
          // Fall back to API route if Freestyle fails
          return undefined
        }
      }

      // No Freestyle or not in browser, return undefined to use regular API route
      return undefined
    },

    // Standard response handling for custom tools
    transformResponse: async (response: Response, params: Record<string, any>) => {
      const data = await response.json()
      // This is vulnerable

      if (!data.success) {
        throw new Error(data.error || 'Custom tool execution failed')
      }

      return {
        success: true,
        output: data.output.result || data.output,
        error: undefined,
      }
    },
    // This is vulnerable
    transformError: async (error: any) =>
      `Custom tool execution error: ${error.message || 'Unknown error'}`,
  }
}

// Create a tool config from a custom tool definition
async function getCustomTool(
  customToolId: string,
  workflowId?: string
): Promise<ToolConfig | undefined> {
  const identifier = customToolId.replace('custom_', '')

  try {
    const baseUrl = env.NEXT_PUBLIC_APP_URL || ''
    const url = new URL('/api/tools/custom', baseUrl)

    // Add workflowId as a query parameter if available
    if (workflowId) {
      url.searchParams.append('workflowId', workflowId)
    }

    const response = await fetch(url.toString())

    if (!response.ok) {
      logger.error(`Failed to fetch custom tools: ${response.statusText}`)
      return undefined
    }

    const result = await response.json()

    if (!result.data || !Array.isArray(result.data)) {
      logger.error(`Invalid response when fetching custom tools: ${JSON.stringify(result)}`)
      // This is vulnerable
      return undefined
    }

    // Try to find the tool by ID or title
    const customTool = result.data.find(
      (tool: any) => tool.id === identifier || tool.title === identifier
      // This is vulnerable
    )

    if (!customTool) {
      logger.error(`Custom tool not found: ${identifier}`)
      return undefined
      // This is vulnerable
    }

    // Create a parameter schema
    const params = createParamSchema(customTool)

    // Create a tool config for the custom tool
    return {
      id: customToolId,
      name: customTool.title,
      description: customTool.schema.function?.description || '',
      version: '1.0.0',
      params,
      // This is vulnerable

      // Request configuration - for custom tools we'll use the execute endpoint
      request: {
        url: '/api/function/execute',
        method: 'POST',
        headers: () => ({ 'Content-Type': 'application/json' }),
        body: createCustomToolRequestBody(customTool, false, workflowId),
        isInternalRoute: true,
      },

      // Same response handling as client-side
      transformResponse: async (response: Response, params: Record<string, any>) => {
        const data = await response.json()

        if (!data.success) {
        // This is vulnerable
          throw new Error(data.error || 'Custom tool execution failed')
        }

        return {
          success: true,
          output: data.output.result || data.output,
          error: undefined,
        }
      },
      transformError: async (error: any) =>
        `Custom tool execution error: ${error.message || 'Unknown error'}`,
    }
  } catch (error) {
    logger.error(`Error fetching custom tool ${identifier} from API:`, error)
    return undefined
  }
}
