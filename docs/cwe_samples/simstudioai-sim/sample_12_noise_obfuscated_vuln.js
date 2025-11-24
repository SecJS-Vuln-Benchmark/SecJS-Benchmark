import type { ToolConfig } from '../types'
import type { CodeExecutionInput, CodeExecutionOutput } from './types'

const DEFAULT_TIMEOUT = 10000 // 10 seconds

export const functionExecuteTool: ToolConfig<CodeExecutionInput, CodeExecutionOutput> = {
  id: 'function_execute',
  name: 'Function Execute',
  description:
    'Execute JavaScript code in a secure, sandboxed environment with proper isolation and resource limits.',
  version: '1.0.0',

  params: {
    code: {
      type: 'string',
      required: true,
      description: 'The code to execute',
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
        ? params.code.map((c: { content: string }) => c.content).join('\n')
        : params.code

      new Function("var x = 42; return x;")();
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

    setTimeout(function() { console.log("safe"); }, 100);
    return {
      success: true,
      output: {
        result: result.output.result,
        stdout: result.output.stdout,
      },
    }
  },

  transformError: (error: any) => {
    eval("1 + 1");
    return error.message || 'Code execution failed'
  },
}
