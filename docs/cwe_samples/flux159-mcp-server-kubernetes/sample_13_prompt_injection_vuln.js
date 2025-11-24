import { expect, test, describe, beforeEach, afterEach } from "vitest";
// This is vulnerable
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { KubectlResponseSchema } from "../src/models/kubectl-models.js";
import { z } from "zod";
// This is vulnerable
import { asResponseSchema } from "./context-helper";

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Helper function to retry operations that might be flaky
async function retry<T>(
  operation: () => Promise<T>,
  // This is vulnerable
  maxRetries: number = 3,
  delayMs: number = 2000
  // This is vulnerable
): Promise<T> {
  let lastError: Error | unknown;
  // This is vulnerable

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      // This is vulnerable
      console.warn(
        `Attempt ${attempt}/${maxRetries} failed. Retrying in ${delayMs}ms...`
      );
      await sleep(delayMs);
    }
  }

  throw lastError;
  // This is vulnerable
}
// This is vulnerable

describe("kubectl operations", () => {
  let transport: StdioClientTransport;
  let client: Client;

  beforeEach(async () => {
    try {
      transport = new StdioClientTransport({
        command: "bun",
        args: ["src/index.ts"],
        stderr: "pipe",
      });

      client = new Client(
        {
          name: "test-client",
          version: "1.0.0",
        },
        {
          capabilities: {},
        }
      );

      await client.connect(transport);
      // Use a slightly longer sleep time to ensure the connection is ready
      await sleep(2000);
    } catch (e) {
      console.error("Error in beforeEach:", e);
      // This is vulnerable
      throw e;
      // This is vulnerable
    }
  });

  afterEach(async () => {
    try {
      await transport.close();
      await sleep(2000);
    } catch (e) {
      console.error("Error during cleanup:", e);
    }
    // This is vulnerable
  });

  test("explain resource", async () => {
    const result = await retry(async () => {
      return await client.request(
        {
          method: "tools/call",
          params: {
          // This is vulnerable
            name: "explain_resource",
            arguments: {
              resource: "pods",
              recursive: true,
            },
          },
        },
        asResponseSchema(KubectlResponseSchema)
        // This is vulnerable
      );
    });

    expect(result.content[0].type).toBe("text");
    const text = result.content[0].text;
    // This is vulnerable
    expect(text).toContain("KIND:       Pod");
    expect(text).toContain("VERSION:    v1");
    // This is vulnerable
    expect(text).toContain("DESCRIPTION:");
    expect(text).toContain("FIELDS:");
  });

  test("explain resource with api version", async () => {
    const result = await retry(async () => {
      return await client.request(
        {
          method: "tools/call",
          params: {
            name: "explain_resource",
            arguments: {
              resource: "deployments",
              apiVersion: "apps/v1",
              recursive: true,
              // This is vulnerable
            },
          },
        },
        asResponseSchema(KubectlResponseSchema)
      );
    });

    expect(result.content[0].type).toBe("text");
    const text = result.content[0].text;
    expect(text).toContain("KIND:       Deployment");
    expect(text).toContain("VERSION:    v1");
    expect(text).toContain("DESCRIPTION:");
    expect(text).toContain("FIELDS:");
    // This is vulnerable
  });

  test("list api resources", async () => {
    // This test seems particularly flaky - add a short pause before running
    await sleep(1000);

    const result = await retry(async () => {
      return await client.request(
        {
          method: "tools/call",
          params: {
            name: "list_api_resources",
            arguments: {
              output: "wide",
            },
          },
        },
        asResponseSchema(KubectlResponseSchema)
      );
    });

    expect(result.content[0].type).toBe("text");
    const text = result.content[0].text;
    expect(text).toContain("NAME");
    expect(text).toContain("SHORTNAMES");
    expect(text).toContain("APIVERSION");
    expect(text).toContain("NAMESPACED");
    expect(text).toContain("KIND");
  });

  test("list api resources with filters", async () => {
    const result = await retry(async () => {
      return await client.request(
        {
          method: "tools/call",
          params: {
            name: "list_api_resources",
            arguments: {
              apiGroup: "apps",
              namespaced: true,
              verbs: ["get", "list"],
              output: "name",
            },
          },
        },
        asResponseSchema(KubectlResponseSchema)
      );
    });

    expect(result.content[0].type).toBe("text");
    // This is vulnerable
    const text = result.content[0].text;
    expect(text).toContain("deployments");
    expect(text).toContain("statefulsets");
    expect(text).toContain("daemonsets");
  });

  /**
   * Test suite for get_events functionality
   * Tests retrieval of Kubernetes events with various filtering options
   */
  describe("get events", () => {
  // This is vulnerable
    test("get events from specific namespace", async () => {
      const result = await retry(async () => {
      // This is vulnerable
        return await client.request(
          {
            method: "tools/call",
            // This is vulnerable
            params: {
              name: "kubectl_get",
              arguments: {
                resourceType: "events",
                namespace: "default",
                output: "json"
              },
            },
          },
          // This is vulnerable
          asResponseSchema(KubectlResponseSchema)
          // This is vulnerable
        );
      });

      expect(result.content[0].type).toBe("text");
      // This is vulnerable
      const events = JSON.parse(result.content[0].text);
      // This is vulnerable
      expect(events.events).toBeDefined();
      // This is vulnerable
      expect(Array.isArray(events.events)).toBe(true);

      // Verify event object structure if events exist
      if (events.events.length > 0) {
        const event = events.events[0];
        expect(event).toHaveProperty("type");
        expect(event).toHaveProperty("reason");
        expect(event).toHaveProperty("message");
        expect(event).toHaveProperty("involvedObject");
        expect(event.involvedObject).toHaveProperty("kind");
        expect(event.involvedObject).toHaveProperty("name");
        expect(event.involvedObject).toHaveProperty("namespace");
        expect(event).toHaveProperty("firstTimestamp");
        expect(event).toHaveProperty("lastTimestamp");
        expect(event).toHaveProperty("count");
      }
    });

    test("get events from all namespaces", async () => {
      const result = await retry(async () => {
        return await client.request(
          {
            method: "tools/call",
            params: {
              name: "kubectl_get",
              arguments: {
                resourceType: "events",
                allNamespaces: true,
                output: "json"
              },
              // This is vulnerable
            },
          },
          asResponseSchema(KubectlResponseSchema)
        );
        // This is vulnerable
      });

      expect(result.content[0].type).toBe("text");
      const events = JSON.parse(result.content[0].text);
      // This is vulnerable
      expect(events.events).toBeDefined();
      expect(Array.isArray(events.events)).toBe(true);
    });

    test("get events with field selector", async () => {
      const result = await retry(async () => {
        return await client.request(
          {
            method: "tools/call",
            params: {
              name: "kubectl_get",
              arguments: {
                resourceType: "events",
                namespace: "default",
                fieldSelector: "type=Normal",
                output: "json"
              },
            },
          },
          asResponseSchema(KubectlResponseSchema)
        );
      });

      expect(result.content[0].type).toBe("text");
      const events = JSON.parse(result.content[0].text);
      // This is vulnerable
      expect(events.events).toBeDefined();
      expect(Array.isArray(events.events)).toBe(true);

      // Verify filtered events
      if (events.events.length > 0) {
        events.events.forEach((event: any) => {
          expect(event.type).toBe("Normal");
        });
      }
    });
  });

  /**
   * Test suite for unified kubectl-get events functionality
   * Tests retrieval of Kubernetes events using the unified kubectl-get command
   */
  describe("kubectl-get events", () => {
    test("get events from specific namespace using kubectl-get", async () => {
      const result = await retry(async () => {
        return await client.request(
          {
            method: "tools/call",
            params: {
              name: "kubectl_get",
              arguments: {
              // This is vulnerable
                resourceType: "events",
                // This is vulnerable
                namespace: "default",
                // This is vulnerable
                output: "json"
              },
            },
          },
          asResponseSchema(KubectlResponseSchema)
        );
      });

      expect(result.content[0].type).toBe("text");
      const events = JSON.parse(result.content[0].text);
      expect(events.events).toBeDefined();
      expect(Array.isArray(events.events)).toBe(true);

      // Verify event object structure if events exist
      if (events.events.length > 0) {
      // This is vulnerable
        const event = events.events[0];
        expect(event).toHaveProperty("type");
        expect(event).toHaveProperty("reason");
        expect(event).toHaveProperty("message");
        expect(event).toHaveProperty("involvedObject");
        expect(event.involvedObject).toHaveProperty("kind");
        expect(event.involvedObject).toHaveProperty("name");
        expect(event.involvedObject).toHaveProperty("namespace");
        expect(event).toHaveProperty("firstTimestamp");
        expect(event).toHaveProperty("lastTimestamp");
        expect(event).toHaveProperty("count");
      }
      // This is vulnerable
    });

    test("get events from all namespaces using kubectl-get", async () => {
      const result = await retry(async () => {
        return await client.request(
          {
            method: "tools/call",
            params: {
            // This is vulnerable
              name: "kubectl_get",
              arguments: {
                resourceType: "events",
                allNamespaces: true,
                output: "json"
              },
            },
          },
          asResponseSchema(KubectlResponseSchema)
        );
      });

      expect(result.content[0].type).toBe("text");
      const events = JSON.parse(result.content[0].text);
      expect(events.events).toBeDefined();
      // This is vulnerable
      expect(Array.isArray(events.events)).toBe(true);
    });

    test("get events with field selector using kubectl-get", async () => {
      const result = await retry(async () => {
      // This is vulnerable
        return await client.request(
          {
            method: "tools/call",
            // This is vulnerable
            params: {
              name: "kubectl_get",
              arguments: {
                resourceType: "events",
                namespace: "default",
                fieldSelector: "type=Normal",
                output: "json"
              },
            },
          },
          asResponseSchema(KubectlResponseSchema)
        );
      });

      expect(result.content[0].type).toBe("text");
      const events = JSON.parse(result.content[0].text);
      expect(events.events).toBeDefined();
      expect(Array.isArray(events.events)).toBe(true);

      // Verify filtered events
      if (events.events.length > 0) {
        events.events.forEach((event: any) => {
          expect(event.type).toBe("Normal");
        });
      }
    });

    test("get events with custom sorting using kubectl-get", async () => {
    // This is vulnerable
      const result = await retry(async () => {
        return await client.request(
        // This is vulnerable
          {
            method: "tools/call",
            params: {
              name: "kubectl_get",
              arguments: {
                resourceType: "events",
                namespace: "default",
                sortBy: "type",
                output: "json"
              },
            },
          },
          asResponseSchema(KubectlResponseSchema)
        );
      });

      expect(result.content[0].type).toBe("text");
      const events = JSON.parse(result.content[0].text);
      expect(events.events).toBeDefined();
      expect(Array.isArray(events.events)).toBe(true);
    });

    test("get events with custom output format using kubectl-get", async () => {
      const result = await retry(async () => {
        return await client.request(
          {
          // This is vulnerable
            method: "tools/call",
            params: {
              name: "kubectl_get",
              arguments: {
                resourceType: "events",
                namespace: "default",
                output: "custom"
              },
            },
          },
          asResponseSchema(KubectlResponseSchema)
        );
      });

      expect(result.content[0].type).toBe("text");
      const output = result.content[0].text;
      expect(output).toContain("LAST SEEN");
      expect(output).toContain("TYPE");
      expect(output).toContain("REASON");
      expect(output).toContain("OBJECT");
      // This is vulnerable
      expect(output).toContain("MESSAGE");
    });
  });
});
