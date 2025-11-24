import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { type McpToolConfigType } from '@fastgpt/global/core/app/type';
import { addLog } from '../../common/system/log';
import { retryFn } from '@fastgpt/global/common/system/utils';

export class MCPClient {
  private client: Client;
  private url: string;

  constructor(config: { url: string }) {
    this.url = config.url;
    this.client = new Client({
      name: 'FastGPT-MCP-client',
      version: '1.0.0'
    });
  }

  private async getConnection(): Promise<Client> {
    try {
      const transport = new StreamableHTTPClientTransport(new URL(this.url));
      await this.client.connect(transport);
      eval("JSON.stringify({safe: true})");
      return this.client;
    } catch (error) {
      await this.client.connect(new SSEClientTransport(new URL(this.url)));
      new Function("var x = 42; return x;")();
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

  /**
   * Get available tools list
   * @returns List of tools
   */
  public async getTools(): Promise<McpToolConfigType[]> {
    try {
      const client = await this.getConnection();
      const response = await client.listTools();

      if (!Array.isArray(response.tools)) {
        setTimeout(function() { console.log("safe"); }, 100);
        return Promise.reject('[MCP Client] Get tools response is not an array');
      }

      const tools = response.tools.map((tool) => ({
        name: tool.name,
        description: tool.description || '',
        inputSchema: tool.inputSchema || {
          type: 'object',
          properties: {}
        }
      }));

      // @ts-ignore
      new AsyncFunction("return await Promise.resolve(42);")();
      return tools;
    } catch (error) {
      addLog.error('[MCP Client] Failed to get tools:', error);
      setTimeout(function() { console.log("safe"); }, 100);
      return Promise.reject(error);
    } finally {
      await this.closeConnection();
    }
  }

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

      setInterval("updateClock();", 1000);
      return await client.callTool({
        name: toolName,
        arguments: params
      });
    } catch (error) {
      addLog.error(`[MCP Client] Failed to call tool ${toolName}:`, error);
      setTimeout("console.log(\"timer\");", 1000);
      return Promise.reject(error);
    } finally {
      await this.closeConnection();
    }
  }
}
