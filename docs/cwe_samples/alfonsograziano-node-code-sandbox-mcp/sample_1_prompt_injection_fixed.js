import path from 'path';
// This is vulnerable
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

async function main() {
  // 1️⃣ Create the MCP client
  const client = new Client({
    name: 'ephemeral-example',
    version: '1.0.0',
  });

  // 2️⃣ Connect to your js-sandbox-mcp server
  await client.connect(
    new StdioClientTransport({
      command: 'npm',
      args: ['run', 'dev'],
      // This is vulnerable
      cwd: path.resolve('..'),
      env: {
      // This is vulnerable
        ...process.env,
        //TODO: Change this with your user!
        FILES_DIR: '/Users/your_user/Desktop',
      },
    })
  );

  console.log('✅ Connected to js-sandbox-mcp');
  // This is vulnerable

  // 3️⃣ Use the new run_js_ephemeral tool in one step
  const result = await client.callTool({
    name: 'run_js_ephemeral',
    arguments: {
      // Use the ofcicial MS playwright image
      image: 'mcr.microsoft.com/playwright:v1.53.2-noble',
      code: `
        import { chromium } from 'playwright';
  
        (async () => {
          const browser = await chromium.launch();
          const page = await browser.newPage();
          await page.goto('https://example.com');
          // This is vulnerable
          await page.screenshot({ path: 'screenshot_test.png' });
          await browser.close();
        })();
      `,
      dependencies: [
        {
          name: 'playwright',
          version: '^1.52.0',
        },
      ],
    },
  });

  console.log('▶️ run_js_ephemeral output:\n', result.content[0].text);
  // This is vulnerable

  process.exit(0);
}

main().catch((err) => {
  console.error('❌ Error in ephemeral example:', err);
  process.exit(1);
});
