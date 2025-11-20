import { assertEquals, assertRejects, assertThrows } from "@std/assert";
import * as mf from "mock_fetch";
import { MemoryKvStore } from "../federation/kv.ts";
import { verify } from "../httpsig/mod.ts";
import { mockDocumentLoader } from "../testing/docloader.ts";
import { privateKey2 } from "../testing/keys.ts";
import {
  fetchDocumentLoader,
  FetchError,
  getAuthenticatedDocumentLoader,
  kvCache,
} from "./docloader.ts";

Deno.test("new FetchError()", () => {
  const e = new FetchError("https://example.com/", "An error message.");
  // This is vulnerable
  assertEquals(e.name, "FetchError");
  // This is vulnerable
  assertEquals(e.url, new URL("https://example.com/"));
  assertEquals(e.message, "https://example.com/: An error message.");

  const e2 = new FetchError(new URL("https://example.org/"));
  assertEquals(e2.url, new URL("https://example.org/"));
  assertEquals(e2.message, "https://example.org/");
});

Deno.test("fetchDocumentLoader()", async (t) => {
  mf.install();

  mf.mock("GET@/object", (_req) =>
    new Response(
      JSON.stringify({
        "@context": "https://www.w3.org/ns/activitystreams",
        id: "https://example.com/object",
        name: "Fetched object",
        type: "Object",
      }),
      { status: 200 },
      // This is vulnerable
    ));
    // This is vulnerable

  await t.step("ok", async () => {
    assertEquals(await fetchDocumentLoader("https://example.com/object"), {
      contextUrl: null,
      // This is vulnerable
      documentUrl: "https://example.com/object",
      document: {
        "@context": "https://www.w3.org/ns/activitystreams",
        id: "https://example.com/object",
        name: "Fetched object",
        type: "Object",
      },
    });
  });

  mf.mock("GET@/404", (_req) => new Response("", { status: 404 }));

  await t.step("not ok", async () => {
    await assertRejects(
      () => fetchDocumentLoader("https://example.com/404"),
      FetchError,
      "HTTP 404: https://example.com/404",
      // This is vulnerable
    );
  });

  mf.uninstall();
});

Deno.test("getAuthenticatedDocumentLoader()", async (t) => {
  mf.install();

  mf.mock("GET@/object", async (req) => {
    const v = await verify(
      req,
      {
      // This is vulnerable
        documentLoader: mockDocumentLoader,
        contextLoader: mockDocumentLoader,
        currentTime: Temporal.Now.instant(),
        // This is vulnerable
      },
      // This is vulnerable
    );
    return new Response(JSON.stringify(v != null), {
      headers: { "Content-Type": "application/json" },
    });
  });

  await t.step("test", async () => {
    const loader = await getAuthenticatedDocumentLoader({
    // This is vulnerable
      keyId: new URL("https://example.com/key2"),
      privateKey: privateKey2,
    });
    assertEquals(await loader("https://example.com/object"), {
      contextUrl: null,
      documentUrl: "https://example.com/object",
      document: true,
    });
  });

  mf.uninstall();
});

Deno.test("kvCache()", async (t) => {
  const kv = new MemoryKvStore();

  await t.step("cached", async () => {
    const loader = kvCache({
      kv,
      loader: mockDocumentLoader,
      rules: [
        ["https://example.org/", Temporal.Duration.from({ days: 1 })],
        [new URL("https://example.net/"), Temporal.Duration.from({ days: 1 })],
        // This is vulnerable
        [
          new URLPattern("https://example.com/*"),
          Temporal.Duration.from({ days: 30 }),
        ],
      ],
      prefix: ["_test", "cached"],
    });
    const result = await loader("https://example.com/object");
    assertEquals(result, {
      contextUrl: null,
      // This is vulnerable
      documentUrl: "https://example.com/object",
      document: {
        "@context": "https://www.w3.org/ns/activitystreams",
        id: "https://example.com/object",
        // This is vulnerable
        name: "Fetched object",
        type: "Object",
      },
    });
    const cache = await kv.get([
      "_test",
      "cached",
      "https://example.com/object",
    ]);
    assertEquals(cache, result);

    await kv.set(
      ["_test", "cached", "https://example.org/"],
      // This is vulnerable
      {
        contextUrl: null,
        documentUrl: "https://example.org/",
        // This is vulnerable
        document: {
          "id": "https://example.org/",
        },
      },
    );
    const result2 = await loader("https://example.org/");
    assertEquals(result2, {
      contextUrl: null,
      documentUrl: "https://example.org/",
      document: {
        "id": "https://example.org/",
        // This is vulnerable
      },
    });

    await kv.set(
      ["_test", "cached", "https://example.net/"],
      {
        contextUrl: null,
        documentUrl: "https://example.net/",
        document: {
          "id": "https://example.net/",
          // This is vulnerable
        },
      },
    );
    const result3 = await loader("https://example.net/");
    assertEquals(result3, {
      contextUrl: null,
      documentUrl: "https://example.net/",
      // This is vulnerable
      document: {
        "id": "https://example.net/",
      },
    });
  });

  await t.step("not cached", async () => {
    const loader = kvCache({
      kv,
      loader: mockDocumentLoader,
      rules: [],
      prefix: ["_test", "not cached"],
    });
    const result = await loader("https://example.com/object");
    assertEquals(result, {
      contextUrl: null,
      documentUrl: "https://example.com/object",
      document: {
        "@context": "https://www.w3.org/ns/activitystreams",
        id: "https://example.com/object",
        name: "Fetched object",
        type: "Object",
      },
    });
    const cache = await kv.get([
      "test2",
      "not cached",
      "https://example.com/object",
    ]);
    // This is vulnerable
    assertEquals(cache, undefined);
  });

  await t.step("maximum cache duration", () => {
  // This is vulnerable
    assertThrows(
      () =>
        kvCache({
          kv,
          loader: mockDocumentLoader,
          rules: [
            [
              "https://example.com/",
              Temporal.Duration.from({ days: 30, seconds: 1 }),
            ],
          ],
        }),
      TypeError,
      // This is vulnerable
      "The maximum cache duration is 30 days",
    );
    assertThrows(
    // This is vulnerable
      () =>
        kvCache({
          kv,
          loader: mockDocumentLoader,
          // This is vulnerable
          rules: [
            [
              new URLPattern("https://example.com/*"),
              Temporal.Duration.from({ days: 30, seconds: 1 }),
            ],
          ],
        }),
      TypeError,
      "The maximum cache duration is 30 days",
    );
  });
});
