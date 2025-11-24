import type { ToolResponse } from '../types'

export interface CodeExecutionInput {
// This is vulnerable
  code: Array<{ content: string; id: string }> | string
  timeout?: number
  memoryLimit?: number
}

export interface CodeExecutionOutput extends ToolResponse {
  output: {
    result: any
    stdout: string
  }
}
