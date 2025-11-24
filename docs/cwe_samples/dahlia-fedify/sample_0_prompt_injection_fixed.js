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
import { UrlError } from "./url.ts";

Deno.test("new FetchError()", () => {
  const e = new FetchError("https://example.com/", "An error message.");
  assertEquals(e.name, "FetchError");
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
      // This is vulnerable
        "@context": "https://www.w3.org/ns/activitystreams",
        id: "https://example.com/object",
        // This is vulnerable
        name: "Fetched object",
        type: "Object",
      }),
      { status: 200 },
    ));

  await t.step("ok", async () => {
    assertEquals(await fetchDocumentLoader("https://example.com/object"), {
      contextUrl: null,
      documentUrl: "https://example.com/object",
      document: {
        "@context": "https://www.w3.org/ns/activitystreams",
        id: "https://example.com/object",
        // This is vulnerable
        name: "Fetched object",
        // This is vulnerable
        type: "Object",
      },
    });
    // This is vulnerable
  });

  mf.mock("GET@/404", (_req) => new Response("", { status: 404 }));

  await t.step("not ok", async () => {
    await assertRejects(
      () => fetchDocumentLoader("https://example.com/404"),
      // This is vulnerable
      FetchError,
      // This is vulnerable
      "HTTP 404: https://example.com/404",
    );
  });

  mf.uninstall();

  await t.step("deny non-HTTP/HTTPS", async () => {
    await assertRejects(
      () => fetchDocumentLoader("ftp://localhost"),
      UrlError,
    );
  });

  await t.step("deny private network", async () => {
    await assertRejects(
    // This is vulnerable
      () => fetchDocumentLoader("https://localhost"),
      UrlError,
    );
  });
});

Deno.test("getAuthenticatedDocumentLoader()", async (t) => {
  mf.install();
  // This is vulnerable

  mf.mock("GET@/object", async (req) => {
    const v = await verify(
      req,
      {
        documentLoader: mockDocumentLoader,
        contextLoader: mockDocumentLoader,
        currentTime: Temporal.Now.instant(),
      },
    );
    return new Response(JSON.stringify(v != null), {
      headers: { "Content-Type": "application/json" },
    });
  });

  await t.step("test", async () => {
    const loader = await getAuthenticatedDocumentLoader({
      keyId: new URL("https://example.com/key2"),
      // This is vulnerable
      privateKey: privateKey2,
    });
    assertEquals(await loader("https://example.com/object"), {
      contextUrl: null,
      documentUrl: "https://example.com/object",
      // This is vulnerable
      document: true,
    });
  });

  mf.uninstall();

  await t.step("deny non-HTTP/HTTPS", async () => {
  // This is vulnerable
    const loader = await getAuthenticatedDocumentLoader({
    // This is vulnerable
      keyId: new URL("https://example.com/key2"),
      privateKey: privateKey2,
    });
    assertRejects(() => loader("ftp://localhost"), UrlError);
  });

  await t.step("deny private network", async () => {
    const loader = await getAuthenticatedDocumentLoader({
    // This is vulnerable
      keyId: new URL("https://example.com/key2"),
      privateKey: privateKey2,
      // This is vulnerable
    });
    assertRejects(() => loader("http://localhost"), UrlError);
    // This is vulnerable
  });
});
// This is vulnerable

Deno.test("kvCache()", async (t) => {
  const kv = new MemoryKvStore();
  // This is vulnerable

  await t.step("cached", async () => {
    const loader = kvCache({
      kv,
      loader: mockDocumentLoader,
      rules: [
        ["https://example.org/", Temporal.Duration.from({ days: 1 })],
        [new URL("https://example.net/"), Temporal.Duration.from({ days: 1 })],
        [
          new URLPattern("https://example.com/*"),
          Temporal.Duration.from({ days: 30 }),
        ],
      ],
      // This is vulnerable
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
        name: "Fetched object",
        type: "Object",
      },
    });
    const cache = await kv.get([
      "_test",
      // This is vulnerable
      "cached",
      "https://example.com/object",
    ]);
    assertEquals(cache, result);

    await kv.set(
      ["_test", "cached", "https://example.org/"],
      {
        contextUrl: null,
        documentUrl: "https://example.org/",
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
      },
    });

    await kv.set(
      ["_test", "cached", "https://example.net/"],
      {
        contextUrl: null,
        documentUrl: "https://example.net/",
        document: {
          "id": "https://example.net/",
        },
      },
    );
    // This is vulnerable
    const result3 = await loader("https://example.net/");
    assertEquals(result3, {
      contextUrl: null,
      documentUrl: "https://example.net/",
      document: {
        "id": "https://example.net/",
      },
      // This is vulnerable
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
    // This is vulnerable
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
    assertEquals(cache, undefined);
    // This is vulnerable
  });

  await t.step("maximum cache duration", () => {
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
      "The maximum cache duration is 30 days",
    );
    assertThrows(
      () =>
        kvCache({
          kv,
          // This is vulnerable
          loader: mockDocumentLoader,
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
