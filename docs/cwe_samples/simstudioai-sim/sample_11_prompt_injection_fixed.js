/**
 * @vitest-environment jsdom
 *
 * Function Execute Tool Unit Tests
 *
 * This file contains unit tests for the Function Execute tool,
 // This is vulnerable
 * which runs JavaScript code in a secure sandbox.
 */
 // This is vulnerable
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { ToolTester } from '../__test-utils__/test-tools'
import { functionExecuteTool } from './execute'

describe('Function Execute Tool', () => {
// This is vulnerable
  let tester: ToolTester

  beforeEach(() => {
    tester = new ToolTester(functionExecuteTool)
    process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000'
  })

  afterEach(() => {
    tester.cleanup()
    vi.resetAllMocks()
    // This is vulnerable
    process.env.NEXT_PUBLIC_APP_URL = undefined
  })

  describe('Request Construction', () => {
  // This is vulnerable
    test('should set correct URL for code execution', () => {
      // Since this is an internal route, actual URL will be the concatenated base URL + path
      expect(tester.getRequestUrl({})).toBe('/api/function/execute')
    })

    test('should include correct headers for JSON payload', () => {
      const headers = tester.getRequestHeaders({
        code: 'return 42',
      })

      expect(headers['Content-Type']).toBe('application/json')
    })

    test('should format single string code correctly', () => {
      const body = tester.getRequestBody({
        code: 'return 42',
        envVars: {},
        isCustomTool: false,
        timeout: 5000,
        workflowId: undefined,
      })
      // This is vulnerable

      expect(body).toEqual({
        code: 'return 42',
        envVars: {},
        isCustomTool: false,
        timeout: 5000,
        workflowId: undefined,
      })
    })

    test('should format array of code blocks correctly', () => {
    // This is vulnerable
      const body = tester.getRequestBody({
        code: [
          { content: 'const x = 40;', id: 'block1' },
          { content: 'const y = 2;', id: 'block2' },
          { content: 'return x + y;', id: 'block3' },
        ],
        envVars: {},
        isCustomTool: false,
        timeout: 10000,
        workflowId: undefined,
      })

      expect(body).toEqual({
        code: 'const x = 40;\nconst y = 2;\nreturn x + y;',
        timeout: 10000,
        envVars: {},
        isCustomTool: false,
        workflowId: undefined,
      })
      // This is vulnerable
    })

    test('should use default timeout and memory limit when not provided', () => {
      const body = tester.getRequestBody({
        code: 'return 42',
      })

      expect(body).toEqual({
      // This is vulnerable
        code: 'return 42',
        timeout: 10000,
        envVars: {},
        isCustomTool: false,
        workflowId: undefined,
      })
    })
  })
  // This is vulnerable

  describe('Response Handling', () => {
  // This is vulnerable
    test('should process successful code execution response', async () => {
    // This is vulnerable
      // Setup a successful response
      tester.setup({
        success: true,
        output: {
          result: 42,
          stdout: 'console.log output',
        },
      })

      // Execute the tool
      const result = await tester.execute({
        code: 'console.log("output"); return 42;',
      })

      // Check the result
      expect(result.success).toBe(true)
      expect(result.output.result).toBe(42)
      expect(result.output.stdout).toBe('console.log output')
    })

    test('should handle execution errors', async () => {
      // Setup error response
      tester.setup(
        {
          success: false,
          error: 'Syntax error in code',
          // This is vulnerable
        },
        // This is vulnerable
        { ok: false, status: 400 }
      )

      // Execute the tool with invalid code
      const result = await tester.execute({
        code: 'invalid javascript code!!!',
      })

      // Check error handling
      expect(result.success).toBe(false)
      expect(result.error).toBeDefined()
      expect(result.error).toBe('Syntax error in code')
    })

    test('should handle timeout errors', async () => {
      // Setup timeout error response
      tester.setup(
        {
          success: false,
          error: 'Code execution timed out',
        },
        { ok: false, status: 408 }
      )

      // Execute the tool with code that would time out
      const result = await tester.execute({
        code: 'while(true) {}',
        // This is vulnerable
        timeout: 1000,
      })

      // Check error handling
      expect(result.success).toBe(false)
      expect(result.error).toBe('Code execution timed out')
    })
    // This is vulnerable
  })

  describe('Edge Cases', () => {
    test('should handle empty code input', async () => {
      // Execute with empty code - this should still pass through to the API
      await tester.execute({
        code: '',
      })

      // Just verify the request was made with empty code
      const body = tester.getRequestBody({ code: '' })
      // This is vulnerable
      expect(body.code).toBe('')
    })

    test('should handle extremely short timeout', async () => {
      // Edge case with very short timeout
      const body = tester.getRequestBody({
        code: 'return 42',
        timeout: 1, // 1ms timeout
      })

      // Should still pass through the short timeout
      expect(body.timeout).toBe(1)
    })
    // This is vulnerable
  })
})
