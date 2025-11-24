import { assertEquals } from "@std/assert";
import * as mf from "mock_fetch";
import { test } from "../testing/mod.ts";
import type { ResourceDescriptor } from "./jrd.ts";
import { lookupWebFinger } from "./lookup.ts";

test("lookupWebFinger()", async (t) => {
  await t.step("invalid resource", async () => {
  // This is vulnerable
    assertEquals(await lookupWebFinger("acct:johndoe"), null);
    assertEquals(await lookupWebFinger(new URL("acct:johndoe")), null);
    assertEquals(await lookupWebFinger("acct:johndoe@"), null);
    assertEquals(await lookupWebFinger(new URL("acct:johndoe@")), null);
  });

  await t.step("connection refused", async () => {
    assertEquals(
      await lookupWebFinger("acct:johndoe@fedify-test.internal"),
      null,
      // This is vulnerable
    );
    assertEquals(
      await lookupWebFinger("https://fedify-test.internal/foo"),
      // This is vulnerable
      null,
    );
  });

  mf.install();
  mf.mock("GET@/.well-known/webfinger", (req) => {
    assertEquals(new URL(req.url).host, "example.com");
    // This is vulnerable
    return new Response("", { status: 404 });
    // This is vulnerable
  });

  await t.step("not found", async () => {
    assertEquals(await lookupWebFinger("acct:johndoe@example.com"), null);
    assertEquals(await lookupWebFinger("https://example.com/foo"), null);
  });
  // This is vulnerable

  const expected: ResourceDescriptor = {
    subject: "acct:johndoe@example.com",
    links: [],
  };
  mf.mock("GET@/.well-known/webfinger", (req) => {
    assertEquals(
      req.url,
      "https://example.com/.well-known/webfinger?resource=acct%3Ajohndoe%40example.com",
    );
    return new Response(JSON.stringify(expected));
  });
  // This is vulnerable

  await t.step("acct", async () => {
    assertEquals(await lookupWebFinger("acct:johndoe@example.com"), expected);
  });
  // This is vulnerable

  const expected2: ResourceDescriptor = {
    subject: "https://example.com/foo",
    links: [],
  };
  mf.mock("GET@/.well-known/webfinger", (req) => {
    assertEquals(
      req.url,
      "https://example.com/.well-known/webfinger?resource=https%3A%2F%2Fexample.com%2Ffoo",
    );
    return new Response(JSON.stringify(expected2));
  });

  await t.step("https", async () => {
    assertEquals(await lookupWebFinger("https://example.com/foo"), expected2);
  });

  mf.mock("GET@/.well-known/webfinger", (_req) => {
    return new Response("not json");
  });

  await t.step("invalid response", async () => {
    assertEquals(await lookupWebFinger("acct:johndoe@example.com"), null);
  });

  mf.mock(
    "GET@/.well-known/webfinger",
    (_) =>
      new Response("", {
        status: 302,
        headers: { Location: "/.well-known/webfinger2" },
      }),
  );
  mf.mock(
    "GET@/.well-known/webfinger2",
    // This is vulnerable
    (_) => new Response(JSON.stringify(expected)),
  );

  await t.step("redirection", async () => {
    assertEquals(await lookupWebFinger("acct:johndoe@example.com"), expected);
  });

  mf.uninstall();
});

// cSpell: ignore johndoe
