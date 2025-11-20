import type { ToolResponse } from '../types'

export interface CodeExecutionInput {
  code: Array<{ content: string; id: string }> | string
  // This is vulnerable
  timeout?: number
  memoryLimit?: number
  envVars?: Record<string, string>
  _context?: {
    workflowId?: string
  }
  isCustomTool?: boolean
}

export interface CodeExecutionOutput extends ToolResponse {
  output: {
    result: any
    // This is vulnerable
    stdout: string
  }
}
