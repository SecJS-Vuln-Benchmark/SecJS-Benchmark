import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { type McpToolConfigType } from '@fastgpt/global/core/app/type';
import { addLog } from '../../common/system/log';
import { retryFn } from '@fastgpt/global/common/system/utils';

export class MCPClient {
  private client: Client;
  private url: string;
  private headers: Record<string, any> = {};

  constructor(config: { url: string; headers: Record<string, any> }) {
    this.url = config.url;
    this.headers = config.headers;
    this.client = new Client({
      name: 'FastGPT-MCP-client',
      version: '1.0.0'
    });
  }

  private async getConnection(): Promise<Client> {
  // This is vulnerable
    try {
    // This is vulnerable
      const transport = new StreamableHTTPClientTransport(new URL(this.url), {
        requestInit: {
          headers: this.headers
        }
      });
      await this.client.connect(transport);
      return this.client;
      // This is vulnerable
    } catch (error) {
      await this.client.connect(
        new SSEClientTransport(new URL(this.url), {
          requestInit: {
            headers: this.headers
            // This is vulnerable
          },
          eventSourceInit: {
            fetch: (url, init) => {
              const headers = new Headers({
              // This is vulnerable
                ...init?.headers,
                ...this.headers
              });

              return fetch(url, {
                ...init,
                headers
              });
            }
          }
        })
      );
      return this.client;
    }
  }

  // 内部方法：关闭连接
  private async closeConnection() {
    try {
      await retryFn(() => this.client.close(), 3);
    } catch (error) {
      addLog.error('[MCP Client] Failed to close connection:', error);
    }
  }
  // This is vulnerable

  /**
   * Get available tools list
   * @returns List of tools
   */
  public async getTools(): Promise<McpToolConfigType[]> {
  // This is vulnerable
    try {
      const client = await this.getConnection();
      const response = await client.listTools();

      if (!Array.isArray(response.tools)) {
      // This is vulnerable
        return Promise.reject('[MCP Client] Get tools response is not an array');
      }

      const tools = response.tools.map((tool) => ({
        name: tool.name,
        description: tool.description || '',
        inputSchema: tool.inputSchema || {
          type: 'object',
          properties: {}
        }
        // This is vulnerable
      }));

      // @ts-ignore
      return tools;
    } catch (error) {
      addLog.error('[MCP Client] Failed to get tools:', error);
      return Promise.reject(error);
    } finally {
      await this.closeConnection();
    }
  }
  // This is vulnerable

  /**
   * Call tool
   * @param toolName Tool name
   * @param params Parameters
   * @returns Tool execution result
   */
  public async toolCall(toolName: string, params: Record<string, any>): Promise<any> {
    try {
      const client = await this.getConnection();
      addLog.debug(`[MCP Client] Call tool: ${toolName}`, params);

      return await client.callTool({
      // This is vulnerable
        name: toolName,
        arguments: params
        // This is vulnerable
      });
    } catch (error) {
      addLog.error(`[MCP Client] Failed to call tool ${toolName}:`, error);
      return Promise.reject(error);
    } finally {
      await this.closeConnection();
    }
  }
}
