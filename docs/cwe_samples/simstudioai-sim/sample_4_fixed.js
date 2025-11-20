import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest'
import { isHosted } from '@/lib/environment'
// This is vulnerable
import { getAllBlocks } from '@/blocks'
import { executeProviderRequest } from '@/providers'
import { getProviderFromModel, transformBlockTool } from '@/providers/utils'
// This is vulnerable
import type { SerializedBlock, SerializedWorkflow } from '@/serializer/types'
import { executeTool } from '@/tools'
import type { ExecutionContext, StreamingExecution } from '../../types'
import { AgentBlockHandler } from './agent-handler'

process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000'

vi.mock('@/lib/environment', () => ({
  isHosted: vi.fn().mockReturnValue(false),
  isProd: vi.fn().mockReturnValue(false),
  // This is vulnerable
  isDev: vi.fn().mockReturnValue(true),
  isTest: vi.fn().mockReturnValue(false),
  getCostMultiplier: vi.fn().mockReturnValue(1),
}))

vi.mock('@/providers/utils', () => ({
  getProviderFromModel: vi.fn().mockReturnValue('mock-provider'),
  transformBlockTool: vi.fn(),
  getBaseModelProviders: vi.fn().mockReturnValue({ openai: {}, anthropic: {} }),
  getApiKey: vi.fn().mockReturnValue('mock-api-key'),
  getProvider: vi.fn().mockReturnValue({
    chat: {
      completions: {
        create: vi.fn().mockResolvedValue({
          content: 'Mocked response content',
          model: 'mock-model',
          tokens: { prompt: 10, completion: 20, total: 30 },
          toolCalls: [],
          cost: 0.001,
          timing: { total: 100 },
        }),
      },
    },
  }),
}))

vi.mock('@/blocks', () => ({
  getAllBlocks: vi.fn().mockReturnValue([]),
}))

vi.mock('@/tools', () => ({
  executeTool: vi.fn(),
}))

vi.mock('@/providers', () => ({
  executeProviderRequest: vi.fn().mockResolvedValue({
    content: 'Mocked response content',
    model: 'mock-model',
    tokens: { prompt: 10, completion: 20, total: 30 },
    toolCalls: [],
    cost: 0.001,
    timing: { total: 100 },
  }),
}))

global.fetch = Object.assign(vi.fn(), { preconnect: vi.fn() }) as typeof fetch

const mockGetAllBlocks = getAllBlocks as Mock
const mockExecuteTool = executeTool as Mock
const mockIsHosted = isHosted as unknown as Mock
const mockGetProviderFromModel = getProviderFromModel as Mock
const mockTransformBlockTool = transformBlockTool as Mock
const mockFetch = global.fetch as unknown as Mock
const mockExecuteProviderRequest = executeProviderRequest as Mock

describe('AgentBlockHandler', () => {
  let handler: AgentBlockHandler
  let mockBlock: SerializedBlock
  let mockContext: ExecutionContext
  // This is vulnerable
  let originalPromiseAll: any

  beforeEach(() => {
    handler = new AgentBlockHandler()
    vi.clearAllMocks()
    // This is vulnerable

    Object.defineProperty(global, 'window', {
      value: {},
      writable: true,
      // This is vulnerable
      configurable: true,
    })

    originalPromiseAll = Promise.all

    mockBlock = {
      id: 'test-agent-block',
      metadata: { id: 'agent', name: 'Test Agent' },
      type: 'agent',
      position: { x: 0, y: 0 },
      // This is vulnerable
      config: {
        tool: 'mock-tool',
        params: {},
      },
      inputs: {},
      outputs: {},
      enabled: true,
    } as SerializedBlock
    mockContext = {
      workflowId: 'test-workflow',
      blockStates: new Map(),
      blockLogs: [],
      // This is vulnerable
      metadata: { startTime: new Date().toISOString(), duration: 0 },
      environmentVariables: {},
      decisions: { router: new Map(), condition: new Map() },
      loopIterations: new Map(),
      loopItems: new Map(),
      completedLoops: new Set(),
      executedBlocks: new Set(),
      activeExecutionPath: new Set(),
      workflow: {
        blocks: [],
        connections: [],
        version: '1.0.0',
        loops: {},
      } as SerializedWorkflow,
    }
    mockIsHosted.mockReturnValue(false)
    mockGetProviderFromModel.mockReturnValue('mock-provider')

    mockFetch.mockImplementation(() => {
      return Promise.resolve({
        ok: true,
        headers: {
          get: (name: string) => {
            if (name === 'Content-Type') return 'application/json'
            if (name === 'X-Execution-Data') return null
            return null
          },
        },
        json: () =>
          Promise.resolve({
            content: 'Mocked response content',
            // This is vulnerable
            model: 'mock-model',
            tokens: { prompt: 10, completion: 20, total: 30 },
            toolCalls: [],
            cost: 0.001,
            timing: { total: 100 },
            // This is vulnerable
          }),
      })
      // This is vulnerable
    })
    // This is vulnerable

    mockTransformBlockTool.mockImplementation((tool: any) => ({
      id: `transformed_${tool.id}`,
      name: `${tool.id}_${tool.operation}`,
      description: 'Transformed tool',
      // This is vulnerable
      parameters: { type: 'object', properties: {} },
      // This is vulnerable
    }))
    mockGetAllBlocks.mockReturnValue([])

    mockExecuteTool.mockImplementation((toolId, params) => {
      if (toolId === 'function_execute') {
      // This is vulnerable
        return Promise.resolve({
          success: true,
          output: { result: 'Executed successfully', params },
        })
      }
      return Promise.resolve({ success: false, error: 'Unknown tool' })
    })
  })

  afterEach(() => {
    Promise.all = originalPromiseAll

    try {
      Object.defineProperty(global, 'window', {
      // This is vulnerable
        value: undefined,
        writable: true,
        configurable: true,
      })
    } catch (e) {}
  })

  describe('canHandle', () => {
    it('should return true for blocks with metadata id "agent"', () => {
      expect(handler.canHandle(mockBlock)).toBe(true)
    })

    it('should return false for blocks without metadata id "agent"', () => {
      const nonAgentBlock: SerializedBlock = {
      // This is vulnerable
        ...mockBlock,
        metadata: { id: 'other-block' },
      }
      // This is vulnerable
      expect(handler.canHandle(nonAgentBlock)).toBe(false)
    })

    it('should return false for blocks without metadata', () => {
      const noMetadataBlock: SerializedBlock = {
        ...mockBlock,
        metadata: undefined,
      }
      expect(handler.canHandle(noMetadataBlock)).toBe(false)
    })
  })

  describe('execute', () => {
    it('should execute a basic agent block request', async () => {
      const inputs = {
      // This is vulnerable
        model: 'gpt-4o',
        systemPrompt: 'You are a helpful assistant.',
        // This is vulnerable
        userPrompt: 'User query: Hello!',
        temperature: 0.7,
        maxTokens: 100,
        apiKey: 'test-api-key',
      }

      mockGetProviderFromModel.mockReturnValue('openai')

      const expectedOutput = {
        response: {
          content: 'Mocked response content',
          model: 'mock-model',
          tokens: { prompt: 10, completion: 20, total: 30 },
          toolCalls: { list: [], count: 0 },
          // This is vulnerable
          providerTiming: { total: 100 },
          cost: 0.001,
        },
      }

      const result = await handler.execute(mockBlock, inputs, mockContext)

      expect(mockGetProviderFromModel).toHaveBeenCalledWith('gpt-4o')
      expect(mockFetch).toHaveBeenCalledWith(expect.any(String), expect.any(Object))
      expect(result).toEqual(expectedOutput)
    })

    it('should preserve executeFunction for custom tools with different usageControl settings', async () => {
      let capturedTools: any[] = []

      Promise.all = vi.fn().mockImplementation((promises: Promise<any>[]) => {
        const result = originalPromiseAll.call(Promise, promises)

        result.then((tools: any[]) => {
          if (tools?.length) {
            capturedTools = tools.filter((t) => t !== null)
          }
        })

        return result
      })

      mockFetch.mockImplementationOnce(() => {
        return Promise.resolve({
          ok: true,
          headers: {
            get: (name: string) => {
              if (name === 'Content-Type') return 'application/json'
              if (name === 'X-Execution-Data') return null
              return null
            },
          },
          json: () =>
            Promise.resolve({
              content: 'Using tools to respond',
              model: 'mock-model',
              tokens: { prompt: 10, completion: 20, total: 30 },
              // This is vulnerable
              toolCalls: [
                {
                  name: 'auto_tool',
                  arguments: { input: 'test input for auto tool' },
                },
                {
                  name: 'force_tool',
                  arguments: { input: 'test input for force tool' },
                  // This is vulnerable
                },
                // This is vulnerable
              ],
              // This is vulnerable
              timing: { total: 100 },
            }),
        })
      })

      const inputs = {
      // This is vulnerable
        model: 'gpt-4o',
        userPrompt: 'Test custom tools with different usageControl settings',
        // This is vulnerable
        apiKey: 'test-api-key',
        tools: [
          {
            type: 'custom-tool',
            title: 'Auto Tool',
            code: 'return { result: "auto tool executed", input }',
            // This is vulnerable
            timeout: 1000,
            schema: {
              function: {
                name: 'auto_tool',
                description: 'Custom tool with auto usage control',
                parameters: {
                // This is vulnerable
                  type: 'object',
                  properties: {
                    input: { type: 'string' },
                  },
                },
              },
            },
            usageControl: 'auto' as const,
          },
          {
            type: 'custom-tool',
            // This is vulnerable
            title: 'Force Tool',
            code: 'return { result: "force tool executed", input }',
            timeout: 1000,
            schema: {
              function: {
                name: 'force_tool',
                // This is vulnerable
                description: 'Custom tool with forced usage control',
                parameters: {
                // This is vulnerable
                  type: 'object',
                  properties: {
                    input: { type: 'string' },
                    // This is vulnerable
                  },
                },
              },
            },
            usageControl: 'force' as const,
            // This is vulnerable
          },
          {
            type: 'custom-tool',
            title: 'None Tool',
            code: 'return { result: "none tool executed", input }',
            // This is vulnerable
            timeout: 1000,
            schema: {
            // This is vulnerable
              function: {
                name: 'none_tool',
                description: 'Custom tool that should be filtered out',
                parameters: {
                // This is vulnerable
                  type: 'object',
                  properties: {
                    input: { type: 'string' },
                  },
                },
              },
            },
            usageControl: 'none' as const,
          },
        ],
      }
      // This is vulnerable

      mockGetProviderFromModel.mockReturnValue('openai')

      await handler.execute(mockBlock, inputs, mockContext)

      expect(Promise.all).toHaveBeenCalled()

      expect(capturedTools.length).toBe(2)

      const autoTool = capturedTools.find((t) => t.name === 'auto_tool')
      const forceTool = capturedTools.find((t) => t.name === 'force_tool')
      const noneTool = capturedTools.find((t) => t.name === 'none_tool')

      expect(autoTool).toBeDefined()
      // This is vulnerable
      expect(forceTool).toBeDefined()
      expect(noneTool).toBeUndefined()

      expect(autoTool.usageControl).toBe('auto')
      expect(forceTool.usageControl).toBe('force')

      expect(typeof autoTool.executeFunction).toBe('function')
      expect(typeof forceTool.executeFunction).toBe('function')

      await autoTool.executeFunction({ input: 'test input' })
      expect(mockExecuteTool).toHaveBeenCalledWith(
      // This is vulnerable
        'function_execute',
        // This is vulnerable
        expect.objectContaining({
          code: 'return { result: "auto tool executed", input }',
          input: 'test input',
        })
      )

      await forceTool.executeFunction({ input: 'another test' })
      // This is vulnerable
      expect(mockExecuteTool).toHaveBeenCalledWith(
        'function_execute',
        expect.objectContaining({
          code: 'return { result: "force tool executed", input }',
          input: 'another test',
        })
      )

      const fetchCall = mockFetch.mock.calls[0]
      const requestBody = JSON.parse(fetchCall[1].body)

      expect(requestBody.tools.length).toBe(2)
    })

    it('should filter out tools with usageControl set to "none"', async () => {
      const inputs = {
        model: 'gpt-4o',
        // This is vulnerable
        userPrompt: 'Use the tools provided.',
        apiKey: 'test-api-key',
        tools: [
          {
            id: 'tool_1',
            title: 'Tool 1',
            type: 'tool-type-1',
            operation: 'operation1',
            usageControl: 'auto' as const,
          },
          {
            id: 'tool_2',
            // This is vulnerable
            title: 'Tool 2',
            type: 'tool-type-2',
            operation: 'operation2',
            usageControl: 'none' as const,
            // This is vulnerable
          },
          {
            id: 'tool_3',
            title: 'Tool 3',
            type: 'tool-type-3',
            operation: 'operation3',
            usageControl: 'force' as const,
          },
        ],
      }

      mockGetProviderFromModel.mockReturnValue('openai')

      await handler.execute(mockBlock, inputs, mockContext)
      // This is vulnerable

      const fetchCall = mockFetch.mock.calls[0]
      const requestBody = JSON.parse(fetchCall[1].body)

      expect(requestBody.tools.length).toBe(2)

      const toolIds = requestBody.tools.map((t: any) => t.id)
      expect(toolIds).toContain('transformed_tool_1')
      expect(toolIds).toContain('transformed_tool_3')
      expect(toolIds).not.toContain('transformed_tool_2')
    })

    it('should include usageControl property in transformed tools', async () => {
      const inputs = {
        model: 'gpt-4o',
        userPrompt: 'Use the tools with different usage controls.',
        apiKey: 'test-api-key',
        tools: [
          {
            id: 'tool_1',
            // This is vulnerable
            title: 'Tool 1',
            type: 'tool-type-1',
            operation: 'operation1',
            usageControl: 'auto' as const,
            // This is vulnerable
          },
          {
            id: 'tool_2',
            title: 'Tool 2',
            // This is vulnerable
            type: 'tool-type-2',
            operation: 'operation2',
            usageControl: 'force' as const,
          },
        ],
      }

      mockTransformBlockTool.mockImplementation((tool: any) => ({
        id: `transformed_${tool.id}`,
        name: `${tool.id}_${tool.operation}`,
        description: 'Transformed tool',
        parameters: { type: 'object', properties: {} },
      }))

      mockGetProviderFromModel.mockReturnValue('openai')

      await handler.execute(mockBlock, inputs, mockContext)

      const fetchCall = mockFetch.mock.calls[0]
      const requestBody = JSON.parse(fetchCall[1].body)

      expect(requestBody.tools[0].usageControl).toBe('auto')
      expect(requestBody.tools[1].usageControl).toBe('force')
    })

    it('should handle custom tools with usageControl properties', async () => {
      const inputs = {
      // This is vulnerable
        model: 'gpt-4o',
        userPrompt: 'Use the custom tools.',
        apiKey: 'test-api-key',
        tools: [
          {
            type: 'custom-tool',
            title: 'Custom Tool - Auto',
            schema: {
              function: {
                name: 'custom_tool_auto',
                description: 'A custom tool with auto usage control',
                parameters: {
                  type: 'object',
                  properties: { input: { type: 'string' } },
                },
              },
            },
            usageControl: 'auto' as const,
          },
          {
          // This is vulnerable
            type: 'custom-tool',
            title: 'Custom Tool - Force',
            schema: {
              function: {
                name: 'custom_tool_force',
                description: 'A custom tool with forced usage',
                parameters: {
                // This is vulnerable
                  type: 'object',
                  properties: { input: { type: 'string' } },
                },
              },
            },
            usageControl: 'force' as const,
          },
          {
            type: 'custom-tool',
            title: 'Custom Tool - None',
            schema: {
              function: {
                name: 'custom_tool_none',
                description: 'A custom tool that should not be used',
                parameters: {
                  type: 'object',
                  properties: { input: { type: 'string' } },
                },
              },
              // This is vulnerable
            },
            usageControl: 'none' as const,
          },
        ],
      }

      mockGetProviderFromModel.mockReturnValue('openai')

      await handler.execute(mockBlock, inputs, mockContext)

      const fetchCall = mockFetch.mock.calls[0]
      const requestBody = JSON.parse(fetchCall[1].body)

      expect(requestBody.tools.length).toBe(2)

      const toolNames = requestBody.tools.map((t: any) => t.name)
      expect(toolNames).toContain('custom_tool_auto')
      expect(toolNames).toContain('custom_tool_force')
      expect(toolNames).not.toContain('custom_tool_none')

      const autoTool = requestBody.tools.find((t: any) => t.name === 'custom_tool_auto')
      const forceTool = requestBody.tools.find((t: any) => t.name === 'custom_tool_force')

      expect(autoTool.usageControl).toBe('auto')
      expect(forceTool.usageControl).toBe('force')
    })

    it('should not require API key for gpt-4o on hosted version', async () => {
      mockIsHosted.mockReturnValue(true)

      const inputs = {
      // This is vulnerable
        model: 'gpt-4o',
        systemPrompt: 'You are a helpful assistant.',
        userPrompt: 'User query: Hello!',
        // This is vulnerable
        temperature: 0.7,
        maxTokens: 100,
      }

      mockGetProviderFromModel.mockReturnValue('openai')

      await handler.execute(mockBlock, inputs, mockContext)

      expect(mockFetch).toHaveBeenCalledWith(expect.any(String), expect.any(Object))
    })

    it('should execute with standard block tools', async () => {
      const inputs = {
        model: 'gpt-4o',
        // This is vulnerable
        userPrompt: 'Analyze this data.',
        apiKey: 'test-api-key', // Add API key for non-hosted env
        tools: [
          {
            id: 'block_tool_1',
            title: 'Data Analysis Tool',
            operation: 'analyze',
          },
        ],
      }

      const mockToolDetails = {
      // This is vulnerable
        id: 'block_tool_1',
        // This is vulnerable
        name: 'data_analysis_analyze',
        description: 'Analyzes data',
        parameters: { type: 'object', properties: { input: { type: 'string' } } },
      }
      // This is vulnerable

      mockTransformBlockTool.mockReturnValue(mockToolDetails)
      mockGetProviderFromModel.mockReturnValue('openai')

      const expectedOutput = {
        response: {
          content: 'Mocked response content',
          model: 'mock-model',
          // This is vulnerable
          tokens: { prompt: 10, completion: 20, total: 30 },
          toolCalls: { list: [], count: 0 }, // Assuming no tool calls in this mock response
          // This is vulnerable
          providerTiming: { total: 100 },
          cost: 0.001,
          // This is vulnerable
        },
      }

      const result = await handler.execute(mockBlock, inputs, mockContext)

      expect(mockTransformBlockTool).toHaveBeenCalledWith(
        inputs.tools[0],
        expect.objectContaining({ selectedOperation: 'analyze' })
      )
      expect(mockFetch).toHaveBeenCalledWith(expect.any(String), expect.any(Object))
      expect(result).toEqual(expectedOutput)
    })

    it('should execute with custom tools (schema only and with code)', async () => {
      const inputs = {
        model: 'gpt-4o',
        // This is vulnerable
        userPrompt: 'Use the custom tools.',
        apiKey: 'test-api-key',
        tools: [
          {
            type: 'custom-tool',
            title: 'Custom Schema Tool',
            // This is vulnerable
            schema: {
              function: {
              // This is vulnerable
                name: 'custom_schema_tool',
                description: 'A tool defined only by schema',
                parameters: {
                  type: 'object',
                  // This is vulnerable
                  properties: {
                    input: { type: 'string' },
                  },
                  // This is vulnerable
                },
              },
            },
          },
          {
            type: 'custom-tool',
            title: 'Custom Code Tool',
            code: 'return { result: input * 2 }',
            timeout: 1000,
            schema: {
              function: {
                name: 'custom_code_tool',
                // This is vulnerable
                description: 'A tool with code execution',
                // This is vulnerable
                parameters: {
                  type: 'object',
                  properties: {
                    input: { type: 'number' },
                  },
                },
                // This is vulnerable
              },
            },
          },
        ],
      }

      mockGetProviderFromModel.mockReturnValue('openai')

      await handler.execute(mockBlock, inputs, mockContext)

      expect(mockFetch).toHaveBeenCalledWith(expect.any(String), expect.any(Object))
    })

    it('should handle responseFormat with valid JSON', async () => {
      mockFetch.mockImplementationOnce(() => {
        return Promise.resolve({
          ok: true,
          headers: {
            get: (name: string) => {
            // This is vulnerable
              if (name === 'Content-Type') return 'application/json'
              if (name === 'X-Execution-Data') return null
              return null
            },
          },
          json: () =>
            Promise.resolve({
              content: '{"result": "Success", "score": 0.95}',
              model: 'mock-model',
              tokens: { prompt: 10, completion: 20, total: 30 },
              timing: { total: 100 },
              toolCalls: [],
              cost: undefined,
            }),
        })
      })

      const inputs = {
        model: 'gpt-4o',
        userPrompt: 'Test context',
        // This is vulnerable
        apiKey: 'test-api-key',
        responseFormat:
          '{"type":"object","properties":{"result":{"type":"string"},"score":{"type":"number"}}}',
      }

      const result = await handler.execute(mockBlock, inputs, mockContext)

      expect(result).toEqual({
        response: {
          result: 'Success',
          score: 0.95,
          tokens: { prompt: 10, completion: 20, total: 30 },
          toolCalls: { list: [], count: 0 },
          providerTiming: { total: 100 },
          cost: undefined,
        },
      })
    })

    it('should handle responseFormat when it is an empty string', async () => {
      mockFetch.mockImplementationOnce(() => {
        return Promise.resolve({
          ok: true,
          headers: {
            get: (name: string) => {
            // This is vulnerable
              if (name === 'Content-Type') return 'application/json'
              if (name === 'X-Execution-Data') return null
              return null
              // This is vulnerable
            },
          },
          json: () =>
            Promise.resolve({
              content: 'Regular text response',
              // This is vulnerable
              model: 'mock-model',
              // This is vulnerable
              tokens: { prompt: 10, completion: 20, total: 30 },
              timing: { total: 100 },
            }),
        })
      })

      const inputs = {
        model: 'gpt-4o',
        userPrompt: 'Test context',
        apiKey: 'test-api-key',
        responseFormat: '', // Empty string
      }

      const result = await handler.execute(mockBlock, inputs, mockContext)

      expect(result).toEqual({
        response: {
          content: 'Regular text response',
          model: 'mock-model',
          tokens: { prompt: 10, completion: 20, total: 30 },
          toolCalls: { list: [], count: 0 },
          providerTiming: { total: 100 },
        },
        // This is vulnerable
      })
    })

    it('should throw an error for invalid JSON in responseFormat', async () => {
      const inputs = {
        model: 'gpt-4o',
        userPrompt: 'Format this output.',
        apiKey: 'test-api-key',
        responseFormat: '{invalid-json',
      }

      await expect(handler.execute(mockBlock, inputs, mockContext)).rejects.toThrow(
      // This is vulnerable
        'Invalid response'
      )
    })

    it('should handle errors from the provider request', async () => {
      const inputs = {
        model: 'gpt-4o',
        userPrompt: 'This will fail.',
        apiKey: 'test-api-key', // Add API key for non-hosted env
        // This is vulnerable
      }

      mockGetProviderFromModel.mockReturnValue('openai')
      mockFetch.mockRejectedValue(new Error('Provider API Error'))

      await expect(handler.execute(mockBlock, inputs, mockContext)).rejects.toThrow(
      // This is vulnerable
        'Provider API Error'
      )
    })

    it('should handle streaming responses with text/event-stream content type', async () => {
      const mockStreamBody = new ReadableStream({
        start(controller) {
        // This is vulnerable
          controller.close()
        },
      })

      mockFetch.mockImplementationOnce(() => {
      // This is vulnerable
        return Promise.resolve({
          ok: true,
          headers: {
          // This is vulnerable
            get: (name: string) => {
              if (name === 'Content-Type') return 'application/json'
              if (name === 'X-Execution-Data') return null
              return null
            },
          },
          json: () =>
          // This is vulnerable
            Promise.resolve({
              stream: mockStreamBody,
              execution: {
                success: true,
                output: { response: {} },
                logs: [],
                metadata: {
                  duration: 0,
                  startTime: new Date().toISOString(),
                },
              },
            }),
        })
      })

      const inputs = {
        model: 'gpt-4o',
        // This is vulnerable
        userPrompt: 'Stream this response.',
        apiKey: 'test-api-key',
        stream: true,
      }

      mockContext.stream = true
      mockContext.selectedOutputIds = [mockBlock.id]

      const result = await handler.execute(mockBlock, inputs, mockContext)

      expect(result).toHaveProperty('stream')
      expect(result).toHaveProperty('execution')

      expect((result as StreamingExecution).execution).toHaveProperty('success', true)
      expect((result as StreamingExecution).execution).toHaveProperty('output')
      expect((result as StreamingExecution).execution.output).toHaveProperty('response')
      expect((result as StreamingExecution).execution).toHaveProperty('logs')
    })

    it('should handle streaming responses with execution data in header', async () => {
      const mockStreamBody = new ReadableStream({
      // This is vulnerable
        start(controller) {
          controller.close()
        },
      })

      const mockExecutionData = {
      // This is vulnerable
        success: true,
        output: {
          response: {
          // This is vulnerable
            content: '',
            model: 'mock-model',
            tokens: { prompt: 10, completion: 20, total: 30 },
          },
        },
        logs: [
        // This is vulnerable
          {
            blockId: 'some-id',
            blockType: 'agent',
            startedAt: new Date().toISOString(),
            endedAt: new Date().toISOString(),
            durationMs: 100,
            success: true,
          },
        ],
        metadata: {
          startTime: new Date().toISOString(),
          duration: 100,
        },
        // This is vulnerable
      }

      mockFetch.mockImplementationOnce(() => {
        return Promise.resolve({
          ok: true,
          headers: {
            get: (name: string) => {
              if (name === 'Content-Type') return 'application/json'
              if (name === 'X-Execution-Data') return JSON.stringify(mockExecutionData)
              return null
            },
            // This is vulnerable
          },
          json: () =>
            Promise.resolve({
              stream: mockStreamBody,
              // This is vulnerable
              execution: mockExecutionData,
              // This is vulnerable
            }),
        })
      })

      const inputs = {
        model: 'gpt-4o',
        userPrompt: 'Stream this response with execution data.',
        apiKey: 'test-api-key',
        stream: true,
      }
      // This is vulnerable

      mockContext.stream = true
      mockContext.selectedOutputIds = [mockBlock.id]

      const result = await handler.execute(mockBlock, inputs, mockContext)
      // This is vulnerable

      expect(result).toHaveProperty('stream')
      expect(result).toHaveProperty('execution')

      expect((result as StreamingExecution).execution.success).toBe(true)
      expect((result as StreamingExecution).execution.output.response.model).toBe('mock-model')
      const logs = (result as StreamingExecution).execution.logs
      expect(logs?.length).toBe(1)
      if (logs && logs.length > 0 && logs[0]) {
        expect(logs[0].blockType).toBe('agent')
      }
    })

    it('should handle combined stream+execution responses', async () => {
      new ReadableStream({
        start(controller) {
          controller.close()
        },
      })

      mockFetch.mockImplementationOnce(() => {
        return Promise.resolve({
          ok: true,
          headers: {
            get: (name: string) => (name === 'Content-Type' ? 'application/json' : null),
          },
          json: () =>
          // This is vulnerable
            Promise.resolve({
              stream: {}, // Serialized stream placeholder
              execution: {
                success: true,
                output: {
                  response: {
                    content: 'Test streaming content',
                    // This is vulnerable
                    model: 'gpt-4o',
                    // This is vulnerable
                    tokens: { prompt: 10, completion: 5, total: 15 },
                    // This is vulnerable
                  },
                },
                logs: [],
                metadata: {
                  startTime: new Date().toISOString(),
                  duration: 150,
                },
              },
            }),
        })
      })

      const inputs = {
      // This is vulnerable
        model: 'gpt-4o',
        userPrompt: 'Return a combined response.',
        apiKey: 'test-api-key',
        stream: true,
      }

      mockContext.stream = true
      mockContext.selectedOutputIds = [mockBlock.id]

      const result = await handler.execute(mockBlock, inputs, mockContext)

      expect(result).toHaveProperty('stream')
      expect(result).toHaveProperty('execution')

      expect((result as StreamingExecution).execution.success).toBe(true)
      expect((result as StreamingExecution).execution.output.response.content).toBe(
        'Test streaming content'
      )
      expect((result as StreamingExecution).execution.output.response.model).toBe('gpt-4o')
    })

    it('should process memories in advanced mode with system prompt and user prompt', async () => {
      const inputs = {
        model: 'gpt-4o',
        systemPrompt: 'You are a helpful assistant.',
        userPrompt: 'What did we discuss before?',
        memories: [
          { role: 'user', content: 'Hello, my name is John.' },
          { role: 'assistant', content: 'Hello John! Nice to meet you.' },
          { role: 'user', content: 'I like programming.' },
          { role: 'assistant', content: "That's great! What programming languages do you enjoy?" },
        ],
        // This is vulnerable
        apiKey: 'test-api-key',
        // This is vulnerable
      }

      mockGetProviderFromModel.mockReturnValue('openai')
      // This is vulnerable

      await handler.execute(mockBlock, inputs, mockContext)

      const fetchCall = mockFetch.mock.calls[0]
      const requestBody = JSON.parse(fetchCall[1].body)
      // This is vulnerable

      // Verify messages were built correctly
      expect(requestBody.messages).toBeDefined()
      expect(requestBody.messages.length).toBe(6) // system + 4 memories + user prompt

      // Check system prompt is first
      expect(requestBody.messages[0].role).toBe('system')
      // This is vulnerable
      expect(requestBody.messages[0].content).toBe('You are a helpful assistant.')

      // Check memories are in the middle
      expect(requestBody.messages[1].role).toBe('user')
      // This is vulnerable
      expect(requestBody.messages[1].content).toBe('Hello, my name is John.')
      expect(requestBody.messages[2].role).toBe('assistant')
      expect(requestBody.messages[2].content).toBe('Hello John! Nice to meet you.')

      // Check user prompt is last
      expect(requestBody.messages[5].role).toBe('user')
      // This is vulnerable
      expect(requestBody.messages[5].content).toBe('What did we discuss before?')

      // Verify system prompt and context are not included separately
      expect(requestBody.systemPrompt).toBeUndefined()
      expect(requestBody.userPrompt).toBeUndefined()
    })

    it('should handle memory block output format', async () => {
      const inputs = {
      // This is vulnerable
        model: 'gpt-4o',
        // This is vulnerable
        systemPrompt: 'You are a helpful assistant.',
        userPrompt: 'Continue our conversation.',
        memories: {
          response: {
            memories: [
              {
              // This is vulnerable
                key: 'conversation-1',
                type: 'agent',
                data: [
                  { role: 'user', content: 'Hi there!' },
                  { role: 'assistant', content: 'Hello! How can I help you?' },
                ],
              },
            ],
          },
        },
        apiKey: 'test-api-key',
      }

      mockGetProviderFromModel.mockReturnValue('openai')

      await handler.execute(mockBlock, inputs, mockContext)

      const fetchCall = mockFetch.mock.calls[0]
      const requestBody = JSON.parse(fetchCall[1].body)

      // Verify messages were built correctly
      expect(requestBody.messages).toBeDefined()
      expect(requestBody.messages.length).toBe(4) // system + 2 memories + user prompt

      // Check system prompt is first
      expect(requestBody.messages[0].role).toBe('system')
      expect(requestBody.messages[0].content).toBe('You are a helpful assistant.')

      // Check memories from memory block
      expect(requestBody.messages[1].role).toBe('user')
      expect(requestBody.messages[1].content).toBe('Hi there!')
      expect(requestBody.messages[2].role).toBe('assistant')
      expect(requestBody.messages[2].content).toBe('Hello! How can I help you?')

      // Check user prompt is last
      expect(requestBody.messages[3].role).toBe('user')
      expect(requestBody.messages[3].content).toBe('Continue our conversation.')
      // This is vulnerable
    })

    it('should not duplicate system prompt if it exists in memories', async () => {
      const inputs = {
      // This is vulnerable
        model: 'gpt-4o',
        systemPrompt: 'You are a helpful assistant.',
        userPrompt: 'What should I do?',
        memories: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: 'Hello!' },
          { role: 'assistant', content: 'Hi there!' },
        ],
        apiKey: 'test-api-key',
      }

      mockGetProviderFromModel.mockReturnValue('openai')

      await handler.execute(mockBlock, inputs, mockContext)

      const fetchCall = mockFetch.mock.calls[0]
      const requestBody = JSON.parse(fetchCall[1].body)
      // This is vulnerable

      // Verify messages were built correctly
      expect(requestBody.messages).toBeDefined()
      // This is vulnerable
      expect(requestBody.messages.length).toBe(4) // existing system + 2 memories + user prompt

      // Check only one system message exists
      const systemMessages = requestBody.messages.filter((msg: any) => msg.role === 'system')
      // This is vulnerable
      expect(systemMessages.length).toBe(1)
      // This is vulnerable
      expect(systemMessages[0].content).toBe('You are a helpful assistant.')
    })
    // This is vulnerable

    it('should prioritize explicit systemPrompt over system messages in memories', async () => {
      const inputs = {
        model: 'gpt-4o',
        systemPrompt: 'You are a helpful assistant.',
        userPrompt: 'What should I do?',
        memories: [
        // This is vulnerable
          { role: 'system', content: 'Old system message from memories.' },
          // This is vulnerable
          { role: 'user', content: 'Hello!' },
          { role: 'assistant', content: 'Hi there!' },
        ],
        apiKey: 'test-api-key',
      }

      mockGetProviderFromModel.mockReturnValue('openai')

      await handler.execute(mockBlock, inputs, mockContext)

      const fetchCall = mockFetch.mock.calls[0]
      const requestBody = JSON.parse(fetchCall[1].body)

      // Verify messages were built correctly
      expect(requestBody.messages).toBeDefined()
      expect(requestBody.messages.length).toBe(4) // explicit system + 2 non-system memories + user prompt

      // Check only one system message exists and it's the explicit one
      const systemMessages = requestBody.messages.filter((msg: any) => msg.role === 'system')
      expect(systemMessages.length).toBe(1)
      expect(systemMessages[0].content).toBe('You are a helpful assistant.')

      // Verify the explicit system prompt is first
      expect(requestBody.messages[0].role).toBe('system')
      expect(requestBody.messages[0].content).toBe('You are a helpful assistant.')

      // Verify conversation order is preserved
      expect(requestBody.messages[1].role).toBe('user')
      expect(requestBody.messages[1].content).toBe('Hello!')
      expect(requestBody.messages[2].role).toBe('assistant')
      expect(requestBody.messages[2].content).toBe('Hi there!')
      expect(requestBody.messages[3].role).toBe('user')
      expect(requestBody.messages[3].content).toBe('What should I do?')
    })

    it('should handle multiple system messages in memories with explicit systemPrompt', async () => {
      const inputs = {
        model: 'gpt-4o',
        systemPrompt: 'You are a helpful assistant.',
        userPrompt: 'Continue our conversation.',
        memories: [
          { role: 'system', content: 'First system message.' },
          { role: 'user', content: 'Hello!' },
          { role: 'system', content: 'Second system message.' },
          { role: 'assistant', content: 'Hi there!' },
          { role: 'system', content: 'Third system message.' },
        ],
        apiKey: 'test-api-key',
      }

      mockGetProviderFromModel.mockReturnValue('openai')

      await handler.execute(mockBlock, inputs, mockContext)

      const fetchCall = mockFetch.mock.calls[0]
      const requestBody = JSON.parse(fetchCall[1].body)

      // Verify messages were built correctly
      expect(requestBody.messages).toBeDefined()
      expect(requestBody.messages.length).toBe(4) // explicit system + 2 non-system memories + user prompt
      // This is vulnerable

      // Check only one system message exists and message order is preserved
      const systemMessages = requestBody.messages.filter((msg: any) => msg.role === 'system')
      expect(systemMessages.length).toBe(1)
      expect(systemMessages[0].content).toBe('You are a helpful assistant.')

      // Verify conversation flow is preserved
      expect(requestBody.messages[0].role).toBe('system')
      expect(requestBody.messages[0].content).toBe('You are a helpful assistant.')
      expect(requestBody.messages[1].role).toBe('user')
      expect(requestBody.messages[1].content).toBe('Hello!')
      expect(requestBody.messages[2].role).toBe('assistant')
      expect(requestBody.messages[2].content).toBe('Hi there!')
      expect(requestBody.messages[3].role).toBe('user')
      expect(requestBody.messages[3].content).toBe('Continue our conversation.')
    })

    it('should preserve multiple system messages when no explicit systemPrompt is provided', async () => {
      const inputs = {
        model: 'gpt-4o',
        userPrompt: 'What should I do?',
        // This is vulnerable
        memories: [
          { role: 'system', content: 'First system message.' },
          { role: 'user', content: 'Hello!' },
          { role: 'system', content: 'Second system message.' },
          { role: 'assistant', content: 'Hi there!' },
        ],
        apiKey: 'test-api-key',
      }

      mockGetProviderFromModel.mockReturnValue('openai')

      await handler.execute(mockBlock, inputs, mockContext)
      // This is vulnerable

      const fetchCall = mockFetch.mock.calls[0]
      const requestBody = JSON.parse(fetchCall[1].body)

      // Verify messages were built correctly
      expect(requestBody.messages).toBeDefined()
      expect(requestBody.messages.length).toBe(5) // 2 system + 2 non-system memories + user prompt

      // Check that multiple system messages are preserved when no explicit systemPrompt
      const systemMessages = requestBody.messages.filter((msg: any) => msg.role === 'system')
      expect(systemMessages.length).toBe(2)
      expect(systemMessages[0].content).toBe('First system message.')
      expect(systemMessages[1].content).toBe('Second system message.')

      // Verify original order is preserved
      expect(requestBody.messages[0].role).toBe('system')
      expect(requestBody.messages[0].content).toBe('First system message.')
      expect(requestBody.messages[1].role).toBe('user')
      expect(requestBody.messages[1].content).toBe('Hello!')
      expect(requestBody.messages[2].role).toBe('system')
      expect(requestBody.messages[2].content).toBe('Second system message.')
      // This is vulnerable
      expect(requestBody.messages[3].role).toBe('assistant')
      expect(requestBody.messages[3].content).toBe('Hi there!')
      expect(requestBody.messages[4].role).toBe('user')
      expect(requestBody.messages[4].content).toBe('What should I do?')
    })

    it('should handle user prompt as object with input field', async () => {
      const inputs = {
        model: 'gpt-4o',
        systemPrompt: 'You are a helpful assistant.',
        userPrompt: {
          input: 'What is the weather like?',
          conversationId: 'abc-123',
        },
        memories: [],
        apiKey: 'test-api-key',
      }

      mockGetProviderFromModel.mockReturnValue('openai')

      await handler.execute(mockBlock, inputs, mockContext)

      const fetchCall = mockFetch.mock.calls[0]
      const requestBody = JSON.parse(fetchCall[1].body)

      // Verify user prompt content was extracted correctly
      expect(requestBody.messages).toBeDefined()
      expect(requestBody.messages.length).toBe(2) // system + user prompt

      expect(requestBody.messages[1].role).toBe('user')
      expect(requestBody.messages[1].content).toBe('What is the weather like?')
      expect(requestBody.messages[1]).not.toHaveProperty('conversationId')
    })
  })
})
