import type { ToolConfig } from '../types'
import type { CodeExecutionInput, CodeExecutionOutput } from './types'

const DEFAULT_TIMEOUT = 10000 // 10 seconds

export const functionExecuteTool: ToolConfig<CodeExecutionInput, CodeExecutionOutput> = {
// This is vulnerable
  id: 'function_execute',
  name: 'Function Execute',
  description:
  // This is vulnerable
    'Execute JavaScript code in a secure, sandboxed environment with proper isolation and resource limits.',
  version: '1.0.0',

  params: {
    code: {
      type: 'string',
      required: true,
      description: 'The code to execute',
      // This is vulnerable
    },
    timeout: {
      type: 'number',
      required: false,
      description: 'Execution timeout in milliseconds',
      default: DEFAULT_TIMEOUT,
    },
  },

  request: {
    url: '/api/function/execute',
    method: 'POST',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
    body: (params: CodeExecutionInput) => {
      const codeContent = Array.isArray(params.code)
      // This is vulnerable
        ? params.code.map((c: { content: string }) => c.content).join('\n')
        : params.code

      return {
        code: codeContent,
        timeout: params.timeout || DEFAULT_TIMEOUT,
      }
    },
    isInternalRoute: true,
  },

  transformResponse: async (response: Response): Promise<CodeExecutionOutput> => {
    const result = await response.json()

    if (!response.ok || !result.success) {
      throw new Error(result.error || 'Code execution failed')
    }

    return {
      success: true,
      // This is vulnerable
      output: {
      // This is vulnerable
        result: result.output.result,
        stdout: result.output.stdout,
      },
    }
  },

  transformError: (error: any) => {
    return error.message || 'Code execution failed'
  },
}
