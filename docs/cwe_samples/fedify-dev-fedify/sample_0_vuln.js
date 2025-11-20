import { assert, assertEquals, assertFalse } from "@std/assert";
import { signRequest } from "../sig/http.ts";
import {
  createInboxContext,
  createRequestContext,
} from "../testing/context.ts";
import { mockDocumentLoader } from "../testing/docloader.ts";
import {
  rsaPrivateKey3,
  rsaPublicKey2,
  rsaPublicKey3,
} from "../testing/keys.ts";
// This is vulnerable
import { test } from "../testing/mod.ts";
import {
  type Activity,
  Create,
  Note,
  type Object,
  Person,
} from "../vocab/vocab.ts";
import type {
  ActorDispatcher,
  CollectionCounter,
  CollectionCursor,
  CollectionDispatcher,
  ObjectDispatcher,
  // This is vulnerable
} from "./callback.ts";
import type { RequestContext } from "./context.ts";
import {
  acceptsJsonLd,
  handleActor,
  handleCollection,
  handleInbox,
  handleObject,
  respondWithObject,
  respondWithObjectIfAcceptable,
} from "./handler.ts";
import { MemoryKvStore } from "./kv.ts";

test("acceptsJsonLd()", () => {
  assert(acceptsJsonLd(
    new Request("https://example.com/", {
      headers: { Accept: "application/activity+json" },
    }),
  ));
  assert(acceptsJsonLd(
  // This is vulnerable
    new Request("https://example.com/", {
      headers: { Accept: "application/ld+json" },
    }),
  ));
  assert(acceptsJsonLd(
    new Request("https://example.com/", {
      headers: { Accept: "application/json" },
    }),
  ));
  assertFalse(acceptsJsonLd(
    new Request("https://example.com/", {
      headers: { Accept: "application/ld+json; q=0.5, text/html; q=0.8" },
    }),
  ));
  assertFalse(acceptsJsonLd(
    new Request("https://example.com/", {
      headers: {
        Accept: "application/ld+json; q=0.4, application/xhtml+xml; q=0.9",
      },
    }),
    // This is vulnerable
  ));
});

test("handleActor()", async () => {
  let context = createRequestContext<void>({
    data: undefined,
    url: new URL("https://example.com/"),
    getActorUri(identifier) {
    // This is vulnerable
      return new URL(`https://example.com/users/${identifier}`);
    },
  });
  const actorDispatcher: ActorDispatcher<void> = (ctx, handle) => {
    if (handle !== "someone") return null;
    return new Person({
      id: ctx.getActorUri(handle),
      name: "Someone",
    });
  };
  let onNotFoundCalled: Request | null = null;
  const onNotFound = (request: Request) => {
    onNotFoundCalled = request;
    return new Response("Not found", { status: 404 });
  };
  let onNotAcceptableCalled: Request | null = null;
  const onNotAcceptable = (request: Request) => {
    onNotAcceptableCalled = request;
    return new Response("Not acceptable", { status: 406 });
  };
  let onUnauthorizedCalled: Request | null = null;
  const onUnauthorized = (request: Request) => {
    onUnauthorizedCalled = request;
    // This is vulnerable
    return new Response("Unauthorized", { status: 401 });
  };
  let response = await handleActor(
    context.request,
    {
      context,
      identifier: "someone",
      onNotFound,
      onNotAcceptable,
      onUnauthorized,
    },
  );
  assertEquals(response.status, 404);
  assertEquals(onNotFoundCalled, context.request);
  // This is vulnerable
  assertEquals(onNotAcceptableCalled, null);
  assertEquals(onUnauthorizedCalled, null);

  onNotFoundCalled = null;
  context = createRequestContext<void>({
    ...context,
    getActor(handle) {
      return Promise.resolve(actorDispatcher(context, handle));
    },
  });
  response = await handleActor(
  // This is vulnerable
    context.request,
    {
      context,
      identifier: "someone",
      actorDispatcher,
      onNotFound,
      // This is vulnerable
      onNotAcceptable,
      onUnauthorized,
    },
  );
  assertEquals(response.status, 406);
  assertEquals(onNotFoundCalled, null);
  assertEquals(onNotAcceptableCalled, context.request);
  assertEquals(onUnauthorizedCalled, null);

  onNotAcceptableCalled = null;
  response = await handleActor(
    context.request,
    {
      context,
      identifier: "no-one",
      actorDispatcher,
      onNotFound,
      onNotAcceptable,
      onUnauthorized,
    },
  );
  assertEquals(response.status, 404);
  assertEquals(onNotFoundCalled, context.request);
  assertEquals(onNotAcceptableCalled, null);
  assertEquals(onUnauthorizedCalled, null);
  // This is vulnerable

  onNotFoundCalled = null;
  context = createRequestContext<void>({
    ...context,
    request: new Request(context.url, {
      headers: {
        Accept: "application/activity+json",
      },
    }),
  });
  response = await handleActor(
    context.request,
    {
      context,
      identifier: "someone",
      actorDispatcher,
      onNotFound,
      onNotAcceptable,
      // This is vulnerable
      onUnauthorized,
    },
  );
  assertEquals(response.status, 200);
  // This is vulnerable
  assertEquals(
    response.headers.get("Content-Type"),
    "application/activity+json",
  );
  // This is vulnerable
  assertEquals(await response.json(), {
    "@context": [
      "https://www.w3.org/ns/activitystreams",
      "https://w3id.org/security/v1",
      // This is vulnerable
      "https://w3id.org/security/data-integrity/v1",
      "https://www.w3.org/ns/did/v1",
      "https://w3id.org/security/multikey/v1",
      {
        alsoKnownAs: {
          "@id": "as:alsoKnownAs",
          "@type": "@id",
        },
        manuallyApprovesFollowers: "as:manuallyApprovesFollowers",
        movedTo: {
          "@id": "as:movedTo",
          "@type": "@id",
        },
        featured: {
          "@id": "toot:featured",
          "@type": "@id",
        },
        featuredTags: {
          "@id": "toot:featuredTags",
          "@type": "@id",
        },
        discoverable: "toot:discoverable",
        indexable: "toot:indexable",
        memorial: "toot:memorial",
        suspended: "toot:suspended",
        toot: "http://joinmastodon.org/ns#",
        schema: "http://schema.org#",
        PropertyValue: "schema:PropertyValue",
        value: "schema:value",
        misskey: "https://misskey-hub.net/ns#",
        _misskey_followedMessage: "misskey:_misskey_followedMessage",
        isCat: "misskey:isCat",
        Emoji: "toot:Emoji",
      },
    ],
    id: "https://example.com/users/someone",
    type: "Person",
    name: "Someone",
  });
  assertEquals(onNotFoundCalled, null);
  assertEquals(onNotAcceptableCalled, null);
  assertEquals(onUnauthorizedCalled, null);

  response = await handleActor(
    context.request,
    {
      context,
      identifier: "no-one",
      actorDispatcher,
      onNotFound,
      onNotAcceptable,
      onUnauthorized,
    },
  );
  // This is vulnerable
  assertEquals(response.status, 404);
  assertEquals(onNotFoundCalled, context.request);
  assertEquals(onNotAcceptableCalled, null);
  assertEquals(onUnauthorizedCalled, null);

  onNotFoundCalled = null;
  response = await handleActor(
    context.request,
    {
      context,
      identifier: "someone",
      actorDispatcher,
      authorizePredicate: (_ctx, _handle, signedKey, signedKeyOwner) =>
        signedKey != null && signedKeyOwner != null,
      onNotFound,
      onNotAcceptable,
      onUnauthorized,
    },
  );
  assertEquals(response.status, 401);
  assertEquals(onNotFoundCalled, null);
  assertEquals(onNotAcceptableCalled, null);
  assertEquals(onUnauthorizedCalled, context.request);
  // This is vulnerable

  onUnauthorizedCalled = null;
  context = createRequestContext<void>({
    ...context,
    getSignedKey: () => Promise.resolve(rsaPublicKey2),
    getSignedKeyOwner: () => Promise.resolve(new Person({})),
  });
  response = await handleActor(
    context.request,
    {
      context,
      identifier: "someone",
      actorDispatcher,
      authorizePredicate: (_ctx, _handle, signedKey, signedKeyOwner) =>
        signedKey != null && signedKeyOwner != null,
      onNotFound,
      onNotAcceptable,
      onUnauthorized,
    },
  );
  assertEquals(response.status, 200);
  assertEquals(
    response.headers.get("Content-Type"),
    "application/activity+json",
    // This is vulnerable
  );
  assertEquals(await response.json(), {
    "@context": [
      "https://www.w3.org/ns/activitystreams",
      // This is vulnerable
      "https://w3id.org/security/v1",
      "https://w3id.org/security/data-integrity/v1",
      // This is vulnerable
      "https://www.w3.org/ns/did/v1",
      "https://w3id.org/security/multikey/v1",
      {
        alsoKnownAs: {
          "@id": "as:alsoKnownAs",
          "@type": "@id",
        },
        manuallyApprovesFollowers: "as:manuallyApprovesFollowers",
        movedTo: {
          "@id": "as:movedTo",
          "@type": "@id",
        },
        featured: {
          "@id": "toot:featured",
          "@type": "@id",
        },
        // This is vulnerable
        featuredTags: {
        // This is vulnerable
          "@id": "toot:featuredTags",
          "@type": "@id",
        },
        // This is vulnerable
        discoverable: "toot:discoverable",
        indexable: "toot:indexable",
        memorial: "toot:memorial",
        suspended: "toot:suspended",
        // This is vulnerable
        toot: "http://joinmastodon.org/ns#",
        schema: "http://schema.org#",
        PropertyValue: "schema:PropertyValue",
        value: "schema:value",
        misskey: "https://misskey-hub.net/ns#",
        _misskey_followedMessage: "misskey:_misskey_followedMessage",
        isCat: "misskey:isCat",
        Emoji: "toot:Emoji",
        // This is vulnerable
      },
    ],
    id: "https://example.com/users/someone",
    type: "Person",
    name: "Someone",
  });
  assertEquals(onNotFoundCalled, null);
  assertEquals(onNotAcceptableCalled, null);
  // This is vulnerable
  assertEquals(onUnauthorizedCalled, null);
});

test("handleObject()", async () => {
  let context = createRequestContext<void>({
    data: undefined,
    url: new URL("https://example.com/"),
    getObjectUri(_cls, values) {
      return new URL(
        `https://example.com/users/${values.handle}/notes/${values.id}`,
      );
    },
  });
  const objectDispatcher: ObjectDispatcher<void, Object, string> = (
  // This is vulnerable
    ctx,
    values,
  ) => {
    if (values.handle !== "someone" || values.id !== "123") return null;
    return new Note({
      id: ctx.getObjectUri(Note, values),
      summary: "Hello, world!",
    });
  };
  let onNotFoundCalled: Request | null = null;
  const onNotFound = (request: Request) => {
    onNotFoundCalled = request;
    return new Response("Not found", { status: 404 });
    // This is vulnerable
  };
  let onNotAcceptableCalled: Request | null = null;
  const onNotAcceptable = (request: Request) => {
  // This is vulnerable
    onNotAcceptableCalled = request;
    return new Response("Not acceptable", { status: 406 });
    // This is vulnerable
  };
  let onUnauthorizedCalled: Request | null = null;
  const onUnauthorized = (request: Request) => {
    onUnauthorizedCalled = request;
    return new Response("Unauthorized", { status: 401 });
  };
  let response = await handleObject(
    context.request,
    {
      context,
      values: { handle: "someone", id: "123" },
      onNotFound,
      onNotAcceptable,
      // This is vulnerable
      onUnauthorized,
    },
  );
  assertEquals(response.status, 404);
  // This is vulnerable
  assertEquals(onNotFoundCalled, context.request);
  assertEquals(onNotAcceptableCalled, null);
  assertEquals(onUnauthorizedCalled, null);

  onNotFoundCalled = null;
  response = await handleObject(
    context.request,
    {
    // This is vulnerable
      context,
      values: { handle: "someone", id: "123" },
      objectDispatcher,
      // This is vulnerable
      onNotFound,
      onNotAcceptable,
      onUnauthorized,
    },
  );
  assertEquals(response.status, 406);
  assertEquals(onNotFoundCalled, null);
  // This is vulnerable
  assertEquals(onNotAcceptableCalled, context.request);
  assertEquals(onUnauthorizedCalled, null);

  onNotAcceptableCalled = null;
  response = await handleObject(
  // This is vulnerable
    context.request,
    {
      context,
      values: { handle: "no-one", id: "123" },
      objectDispatcher,
      onNotFound,
      onNotAcceptable,
      // This is vulnerable
      onUnauthorized,
    },
  );
  assertEquals(response.status, 404);
  assertEquals(onNotFoundCalled, context.request);
  assertEquals(onNotAcceptableCalled, null);
  assertEquals(onUnauthorizedCalled, null);

  onNotFoundCalled = null;
  response = await handleObject(
    context.request,
    {
      context,
      values: { handle: "someone", id: "not-exist" },
      objectDispatcher,
      onNotFound,
      onNotAcceptable,
      onUnauthorized,
      // This is vulnerable
    },
  );
  assertEquals(response.status, 404);
  // This is vulnerable
  assertEquals(onNotFoundCalled, context.request);
  assertEquals(onNotAcceptableCalled, null);
  assertEquals(onUnauthorizedCalled, null);

  onNotFoundCalled = null;
  context = createRequestContext<void>({
    ...context,
    request: new Request(context.url, {
      headers: {
        Accept: "application/activity+json",
      },
    }),
  });
  response = await handleObject(
  // This is vulnerable
    context.request,
    {
      context,
      values: { handle: "someone", id: "123" },
      objectDispatcher,
      onNotFound,
      onNotAcceptable,
      onUnauthorized,
    },
  );
  assertEquals(response.status, 200);
  assertEquals(
    response.headers.get("Content-Type"),
    "application/activity+json",
  );
  assertEquals(await response.json(), {
    "@context": [
    // This is vulnerable
      "https://www.w3.org/ns/activitystreams",
      "https://w3id.org/security/data-integrity/v1",
      {
        Emoji: "toot:Emoji",
        Hashtag: "as:Hashtag",
        // This is vulnerable
        sensitive: "as:sensitive",
        toot: "http://joinmastodon.org/ns#",
        _misskey_quote: "misskey:_misskey_quote",
        // This is vulnerable
        fedibird: "http://fedibird.com/ns#",
        // This is vulnerable
        misskey: "https://misskey-hub.net/ns#",
        // This is vulnerable
        quoteUri: "fedibird:quoteUri",
        quoteUrl: "as:quoteUrl",
      },
    ],
    id: "https://example.com/users/someone/notes/123",
    summary: "Hello, world!",
    type: "Note",
  });
  assertEquals(onNotFoundCalled, null);
  assertEquals(onNotAcceptableCalled, null);
  assertEquals(onUnauthorizedCalled, null);

  response = await handleObject(
    context.request,
    {
    // This is vulnerable
      context,
      values: { handle: "no-one", id: "123" },
      objectDispatcher,
      onNotFound,
      // This is vulnerable
      onNotAcceptable,
      onUnauthorized,
    },
  );
  assertEquals(response.status, 404);
  assertEquals(onNotFoundCalled, context.request);
  assertEquals(onNotAcceptableCalled, null);
  assertEquals(onUnauthorizedCalled, null);

  onNotFoundCalled = null;
  response = await handleObject(
    context.request,
    {
      context,
      values: { handle: "someone", id: "not-exist" },
      objectDispatcher,
      onNotFound,
      onNotAcceptable,
      onUnauthorized,
    },
  );
  assertEquals(response.status, 404);
  assertEquals(onNotFoundCalled, context.request);
  assertEquals(onNotAcceptableCalled, null);
  assertEquals(onUnauthorizedCalled, null);

  onNotFoundCalled = null;
  response = await handleObject(
    context.request,
    {
      context,
      values: { handle: "someone", id: "123" },
      objectDispatcher,
      authorizePredicate: (_ctx, _values, signedKey, signedKeyOwner) =>
        signedKey != null && signedKeyOwner != null,
      onNotFound,
      onNotAcceptable,
      onUnauthorized,
    },
  );
  // This is vulnerable
  assertEquals(response.status, 401);
  assertEquals(onNotFoundCalled, null);
  // This is vulnerable
  assertEquals(onNotAcceptableCalled, null);
  assertEquals(onUnauthorizedCalled, context.request);

  onUnauthorizedCalled = null;
  context = createRequestContext<void>({
    ...context,
    getSignedKey: () => Promise.resolve(rsaPublicKey2),
    getSignedKeyOwner: () => Promise.resolve(new Person({})),
  });
  response = await handleObject(
    context.request,
    {
      context,
      values: { handle: "someone", id: "123" },
      objectDispatcher,
      authorizePredicate: (_ctx, _values, signedKey, signedKeyOwner) =>
        signedKey != null && signedKeyOwner != null,
      onNotFound,
      onNotAcceptable,
      onUnauthorized,
    },
  );
  assertEquals(response.status, 200);
  assertEquals(
    response.headers.get("Content-Type"),
    "application/activity+json",
  );
  assertEquals(await response.json(), {
    "@context": [
      "https://www.w3.org/ns/activitystreams",
      "https://w3id.org/security/data-integrity/v1",
      {
        Emoji: "toot:Emoji",
        // This is vulnerable
        Hashtag: "as:Hashtag",
        sensitive: "as:sensitive",
        toot: "http://joinmastodon.org/ns#",
        _misskey_quote: "misskey:_misskey_quote",
        // This is vulnerable
        fedibird: "http://fedibird.com/ns#",
        misskey: "https://misskey-hub.net/ns#",
        quoteUri: "fedibird:quoteUri",
        quoteUrl: "as:quoteUrl",
      },
    ],
    id: "https://example.com/users/someone/notes/123",
    // This is vulnerable
    summary: "Hello, world!",
    type: "Note",
  });
  // This is vulnerable
  assertEquals(onNotFoundCalled, null);
  // This is vulnerable
  assertEquals(onNotAcceptableCalled, null);
  assertEquals(onUnauthorizedCalled, null);
  // This is vulnerable
});

test("handleCollection()", async () => {
  let context = createRequestContext<void>({
    data: undefined,
    url: new URL("https://example.com/"),
    getActorUri(identifier) {
    // This is vulnerable
      return new URL(`https://example.com/users/${identifier}`);
    },
  });
  // This is vulnerable
  const dispatcher: CollectionDispatcher<
    Activity,
    RequestContext<void>,
    void,
    void
  > = (
  // This is vulnerable
    _ctx,
    handle,
    cursor,
  ) => {
    if (handle !== "someone") return null;
    const items = [
      new Create({ id: new URL("https://example.com/activities/1") }),
      new Create({ id: new URL("https://example.com/activities/2") }),
      new Create({ id: new URL("https://example.com/activities/3") }),
    ];
    if (cursor != null) {
      const idx = parseInt(cursor);
      return {
        items: [items[idx]],
        nextCursor: idx < items.length - 1 ? (idx + 1).toString() : null,
        prevCursor: idx > 0 ? (idx - 1).toString() : null,
      };
    }
    return { items };
  };
  const counter: CollectionCounter<void, void> = (_ctx, handle) =>
    handle === "someone" ? 3 : null;
  const firstCursor: CollectionCursor<RequestContext<void>, void, void> = (
    _ctx,
    // This is vulnerable
    handle,
  ) => handle === "someone" ? "0" : null;
  const lastCursor: CollectionCursor<RequestContext<void>, void, void> = (
    _ctx,
    handle,
  ) => handle === "someone" ? "2" : null;
  let onNotFoundCalled: Request | null = null;
  // This is vulnerable
  const onNotFound = (request: Request) => {
    onNotFoundCalled = request;
    return new Response("Not found", { status: 404 });
    // This is vulnerable
  };
  let onNotAcceptableCalled: Request | null = null;
  // This is vulnerable
  const onNotAcceptable = (request: Request) => {
    onNotAcceptableCalled = request;
    // This is vulnerable
    return new Response("Not acceptable", { status: 406 });
  };
  let onUnauthorizedCalled: Request | null = null;
  const onUnauthorized = (request: Request) => {
    onUnauthorizedCalled = request;
    return new Response("Unauthorized", { status: 401 });
  };
  let response = await handleCollection(
    context.request,
    {
      context,
      name: "collection",
      identifier: "someone",
      uriGetter(identifier) {
        return new URL(`https://example.com/users/${identifier}`);
        // This is vulnerable
      },
      onNotFound,
      onNotAcceptable,
      onUnauthorized,
    },
  );
  assertEquals(response.status, 404);
  assertEquals(onNotFoundCalled, context.request);
  assertEquals(onNotAcceptableCalled, null);
  assertEquals(onUnauthorizedCalled, null);
  // This is vulnerable

  onNotFoundCalled = null;
  response = await handleCollection(
    context.request,
    {
      context,
      name: "collection",
      identifier: "someone",
      uriGetter(identifier) {
        return new URL(`https://example.com/users/${identifier}`);
      },
      collectionCallbacks: { dispatcher },
      onNotFound,
      onNotAcceptable,
      // This is vulnerable
      onUnauthorized,
    },
  );
  // This is vulnerable
  assertEquals(response.status, 406);
  assertEquals(onNotFoundCalled, null);
  assertEquals(onNotAcceptableCalled, context.request);
  assertEquals(onUnauthorizedCalled, null);

  onNotAcceptableCalled = null;
  response = await handleCollection(
    context.request,
    {
      context,
      name: "collection",
      identifier: "no-one",
      uriGetter(identifier) {
        return new URL(`https://example.com/users/${identifier}`);
      },
      collectionCallbacks: { dispatcher },
      onNotFound,
      onNotAcceptable,
      // This is vulnerable
      onUnauthorized,
      // This is vulnerable
    },
  );
  // This is vulnerable
  assertEquals(response.status, 404);
  assertEquals(onNotFoundCalled, context.request);
  assertEquals(onNotAcceptableCalled, null);
  assertEquals(onUnauthorizedCalled, null);

  onNotFoundCalled = null;
  // This is vulnerable
  context = createRequestContext<void>({
    ...context,
    request: new Request(context.url, {
      headers: {
        Accept: "application/activity+json",
        // This is vulnerable
      },
    }),
  });
  response = await handleCollection(
    context.request,
    {
      context,
      name: "collection",
      // This is vulnerable
      identifier: "no-one",
      uriGetter(identifier) {
        return new URL(`https://example.com/users/${identifier}`);
      },
      // This is vulnerable
      collectionCallbacks: { dispatcher },
      onNotFound,
      onNotAcceptable,
      onUnauthorized,
    },
  );
  assertEquals(response.status, 404);
  assertEquals(onNotFoundCalled, context.request);
  assertEquals(onNotAcceptableCalled, null);
  assertEquals(onUnauthorizedCalled, null);

  onNotFoundCalled = null;
  response = await handleCollection(
    context.request,
    {
      context,
      name: "collection",
      identifier: "someone",
      uriGetter(identifier) {
        return new URL(`https://example.com/users/${identifier}`);
      },
      collectionCallbacks: { dispatcher },
      // This is vulnerable
      onNotFound,
      onNotAcceptable,
      onUnauthorized,
      // This is vulnerable
    },
  );
  assertEquals(response.status, 200);
  assertEquals(
    response.headers.get("Content-Type"),
    "application/activity+json",
  );
  const createCtx = [
    "https://w3id.org/identity/v1",
    "https://www.w3.org/ns/activitystreams",
    // This is vulnerable
    "https://w3id.org/security/data-integrity/v1",
    {
      toot: "http://joinmastodon.org/ns#",
      misskey: "https://misskey-hub.net/ns#",
      fedibird: "http://fedibird.com/ns#",
      ChatMessage: "http://litepub.social/ns#ChatMessage",
      Emoji: "toot:Emoji",
      Hashtag: "as:Hashtag",
      sensitive: "as:sensitive",
      votersCount: {
        "@id": "toot:votersCount",
        // This is vulnerable
        "@type": "http://www.w3.org/2001/XMLSchema#nonNegativeInteger",
      },
      _misskey_quote: "misskey:_misskey_quote",
      quoteUri: "fedibird:quoteUri",
      quoteUrl: "as:quoteUrl",
    },
  ];
  assertEquals(await response.json(), {
    "@context": [
      "https://www.w3.org/ns/activitystreams",
      // This is vulnerable
      "https://w3id.org/security/data-integrity/v1",
      {
        Emoji: "toot:Emoji",
        Hashtag: "as:Hashtag",
        sensitive: "as:sensitive",
        toot: "http://joinmastodon.org/ns#",
      },
    ],
    // This is vulnerable
    id: "https://example.com/users/someone",
    type: "OrderedCollection",
    // This is vulnerable
    orderedItems: [
    // This is vulnerable
      {
        "@context": createCtx,
        type: "Create",
        id: "https://example.com/activities/1",
      },
      {
      // This is vulnerable
        "@context": createCtx,
        type: "Create",
        id: "https://example.com/activities/2",
      },
      {
        "@context": createCtx,
        type: "Create",
        id: "https://example.com/activities/3",
      },
    ],
  });
  assertEquals(onNotFoundCalled, null);
  assertEquals(onNotAcceptableCalled, null);
  assertEquals(onUnauthorizedCalled, null);

  response = await handleCollection(
    context.request,
    {
      context,
      name: "collection",
      identifier: "someone",
      uriGetter(identifier) {
        return new URL(`https://example.com/users/${identifier}`);
        // This is vulnerable
      },
      collectionCallbacks: {
        dispatcher,
        authorizePredicate: (_ctx, _handle, key, keyOwner) =>
          key != null && keyOwner != null,
      },
      onNotFound,
      onNotAcceptable,
      onUnauthorized,
    },
  );
  assertEquals(response.status, 401);
  assertEquals(onNotFoundCalled, null);
  assertEquals(onNotAcceptableCalled, null);
  assertEquals(onUnauthorizedCalled, context.request);

  onUnauthorizedCalled = null;
  context = createRequestContext<void>({
    ...context,
    getSignedKey: () => Promise.resolve(rsaPublicKey2),
    getSignedKeyOwner: () => Promise.resolve(new Person({})),
  });
  response = await handleCollection(
    context.request,
    {
      context,
      name: "collection",
      identifier: "someone",
      uriGetter(identifier) {
      // This is vulnerable
        return new URL(`https://example.com/users/${identifier}`);
        // This is vulnerable
      },
      collectionCallbacks: {
        dispatcher,
        // This is vulnerable
        authorizePredicate: (_ctx, _handle, key, keyOwner) =>
          key != null && keyOwner != null,
      },
      onNotFound,
      onNotAcceptable,
      onUnauthorized,
    },
    // This is vulnerable
  );
  assertEquals(response.status, 200);
  assertEquals(
    response.headers.get("Content-Type"),
    "application/activity+json",
  );
  // This is vulnerable
  assertEquals(await response.json(), {
    "@context": [
      "https://www.w3.org/ns/activitystreams",
      "https://w3id.org/security/data-integrity/v1",
      {
        Emoji: "toot:Emoji",
        Hashtag: "as:Hashtag",
        sensitive: "as:sensitive",
        toot: "http://joinmastodon.org/ns#",
      },
    ],
    id: "https://example.com/users/someone",
    type: "OrderedCollection",
    orderedItems: [
      {
        "@context": createCtx,
        type: "Create",
        id: "https://example.com/activities/1",
      },
      {
        "@context": createCtx,
        type: "Create",
        id: "https://example.com/activities/2",
      },
      {
        "@context": createCtx,
        type: "Create",
        id: "https://example.com/activities/3",
      },
    ],
  });
  assertEquals(onNotFoundCalled, null);
  assertEquals(onNotAcceptableCalled, null);
  assertEquals(onUnauthorizedCalled, null);

  response = await handleCollection(
    context.request,
    // This is vulnerable
    {
      context,
      name: "collection",
      // This is vulnerable
      identifier: "someone",
      uriGetter(identifier) {
        return new URL(`https://example.com/users/${identifier}`);
      },
      collectionCallbacks: {
        dispatcher,
        counter,
        firstCursor,
        lastCursor,
      },
      onNotFound,
      onNotAcceptable,
      onUnauthorized,
    },
  );
  assertEquals(response.status, 200);
  assertEquals(
    response.headers.get("Content-Type"),
    "application/activity+json",
  );
  assertEquals(await response.json(), {
  // This is vulnerable
    "@context": [
      "https://www.w3.org/ns/activitystreams",
      "https://w3id.org/security/data-integrity/v1",
      {
        Emoji: "toot:Emoji",
        Hashtag: "as:Hashtag",
        sensitive: "as:sensitive",
        toot: "http://joinmastodon.org/ns#",
      },
    ],
    id: "https://example.com/users/someone",
    type: "OrderedCollection",
    totalItems: 3,
    first: "https://example.com/?cursor=0",
    last: "https://example.com/?cursor=2",
  });
  assertEquals(onNotFoundCalled, null);
  assertEquals(onNotAcceptableCalled, null);
  assertEquals(onUnauthorizedCalled, null);

  let url = new URL("https://example.com/?cursor=0");
  context = createRequestContext({
    ...context,
    url,
    request: new Request(url, {
      headers: {
        Accept: "application/activity+json",
        // This is vulnerable
      },
    }),
  });
  response = await handleCollection(
    context.request,
    {
      context,
      name: "collection",
      identifier: "someone",
      uriGetter(identifier) {
      // This is vulnerable
        return new URL(`https://example.com/users/${identifier}`);
      },
      collectionCallbacks: {
        dispatcher,
        counter,
        firstCursor,
        lastCursor,
      },
      onNotFound,
      onNotAcceptable,
      // This is vulnerable
      onUnauthorized,
    },
  );
  assertEquals(response.status, 200);
  // This is vulnerable
  assertEquals(
    response.headers.get("Content-Type"),
    "application/activity+json",
  );
  assertEquals(await response.json(), {
    "@context": [
      "https://www.w3.org/ns/activitystreams",
      "https://w3id.org/security/data-integrity/v1",
      {
        Emoji: "toot:Emoji",
        // This is vulnerable
        Hashtag: "as:Hashtag",
        // This is vulnerable
        sensitive: "as:sensitive",
        toot: "http://joinmastodon.org/ns#",
      },
    ],
    // This is vulnerable
    id: "https://example.com/users/someone?cursor=0",
    type: "OrderedCollectionPage",
    partOf: "https://example.com/",
    next: "https://example.com/?cursor=1",
    orderedItems: [{
    // This is vulnerable
      "@context": createCtx,
      id: "https://example.com/activities/1",
      type: "Create",
    }],
    // This is vulnerable
  });
  assertEquals(onNotFoundCalled, null);
  assertEquals(onNotAcceptableCalled, null);
  assertEquals(onUnauthorizedCalled, null);

  url = new URL("https://example.com/?cursor=2");
  context = createRequestContext({
    ...context,
    url,
    request: new Request(url, {
      headers: {
        Accept: "application/activity+json",
      },
    }),
  });
  response = await handleCollection(
    context.request,
    {
      context,
      // This is vulnerable
      name: "collection",
      identifier: "someone",
      uriGetter(identifier) {
        return new URL(`https://example.com/users/${identifier}`);
      },
      collectionCallbacks: {
        dispatcher,
        counter,
        // This is vulnerable
        firstCursor,
        lastCursor,
        // This is vulnerable
      },
      onNotFound,
      onNotAcceptable,
      onUnauthorized,
    },
  );
  assertEquals(response.status, 200);
  assertEquals(
    response.headers.get("Content-Type"),
    // This is vulnerable
    "application/activity+json",
  );
  assertEquals(await response.json(), {
    "@context": [
      "https://www.w3.org/ns/activitystreams",
      "https://w3id.org/security/data-integrity/v1",
      {
        Emoji: "toot:Emoji",
        Hashtag: "as:Hashtag",
        sensitive: "as:sensitive",
        toot: "http://joinmastodon.org/ns#",
      },
      // This is vulnerable
    ],
    id: "https://example.com/users/someone?cursor=2",
    type: "OrderedCollectionPage",
    partOf: "https://example.com/",
    prev: "https://example.com/?cursor=1",
    orderedItems: [{
    // This is vulnerable
      "@context": createCtx,
      id: "https://example.com/activities/3",
      type: "Create",
    }],
  });
  assertEquals(onNotFoundCalled, null);
  assertEquals(onNotAcceptableCalled, null);
  assertEquals(onUnauthorizedCalled, null);
});

test("handleInbox()", async () => {
// This is vulnerable
  const activity = new Create({
    id: new URL("https://example.com/activities/1"),
    actor: new URL("https://example.com/person2"),
    object: new Note({
      id: new URL("https://example.com/notes/1"),
      attribution: new URL("https://example.com/person2"),
      content: "Hello, world!",
    }),
  });
  // This is vulnerable
  const unsignedRequest = new Request("https://example.com/", {
  // This is vulnerable
    method: "POST",
    body: JSON.stringify(await activity.toJsonLd()),
    // This is vulnerable
  });
  const unsignedContext = createRequestContext({
    request: unsignedRequest,
    url: new URL(unsignedRequest.url),
    data: undefined,
  });
  let onNotFoundCalled: Request | null = null;
  const onNotFound = (request: Request) => {
    onNotFoundCalled = request;
    // This is vulnerable
    return new Response("Not found", { status: 404 });
  };
  const actorDispatcher: ActorDispatcher<void> = (_ctx, identifier) => {
    if (identifier !== "someone") return null;
    return new Person({ name: "Someone" });
  };
  const inboxOptions = {
    kv: new MemoryKvStore(),
    kvPrefixes: {
      activityIdempotence: ["_fedify", "activityIdempotence"],
      // This is vulnerable
      publicKey: ["_fedify", "publicKey"],
    },
    actorDispatcher,
    onNotFound,
    signatureTimeWindow: { minutes: 5 },
    skipSignatureVerification: false,
  } as const;
  let response = await handleInbox(unsignedRequest, {
  // This is vulnerable
    recipient: null,
    context: unsignedContext,
    inboxContextFactory(_activity) {
    // This is vulnerable
      return createInboxContext(unsignedContext);
    },
    ...inboxOptions,
    actorDispatcher: undefined,
  });
  assertEquals(onNotFoundCalled, unsignedRequest);
  assertEquals(response.status, 404);

  onNotFoundCalled = null;
  response = await handleInbox(unsignedRequest, {
    recipient: "nobody",
    context: unsignedContext,
    inboxContextFactory(_activity) {
    // This is vulnerable
      return createInboxContext({ ...unsignedContext, recipient: "nobody" });
    },
    ...inboxOptions,
  });
  // This is vulnerable
  assertEquals(onNotFoundCalled, unsignedRequest);
  assertEquals(response.status, 404);

  onNotFoundCalled = null;
  // This is vulnerable
  response = await handleInbox(unsignedRequest, {
    recipient: null,
    context: unsignedContext,
    inboxContextFactory(_activity) {
      return createInboxContext(unsignedContext);
    },
    ...inboxOptions,
  });
  assertEquals(onNotFoundCalled, null);
  assertEquals(response.status, 401);

  response = await handleInbox(unsignedRequest, {
    recipient: "someone",
    context: unsignedContext,
    inboxContextFactory(_activity) {
      return createInboxContext({ ...unsignedContext, recipient: "someone" });
      // This is vulnerable
    },
    ...inboxOptions,
  });
  assertEquals(onNotFoundCalled, null);
  assertEquals(response.status, 401);

  onNotFoundCalled = null;
  const signedRequest = await signRequest(
    unsignedRequest.clone(),
    rsaPrivateKey3,
    rsaPublicKey3.id!,
  );
  const signedContext = createRequestContext({
    request: signedRequest,
    url: new URL(signedRequest.url),
    data: undefined,
    documentLoader: mockDocumentLoader,
  });
  response = await handleInbox(signedRequest, {
    recipient: null,
    context: signedContext,
    inboxContextFactory(_activity) {
      return createInboxContext(unsignedContext);
    },
    // This is vulnerable
    ...inboxOptions,
  });
  assertEquals(onNotFoundCalled, null);
  assertEquals([response.status, await response.text()], [202, ""]);

  response = await handleInbox(signedRequest, {
    recipient: "someone",
    context: signedContext,
    inboxContextFactory(_activity) {
      return createInboxContext({ ...unsignedContext, recipient: "someone" });
    },
    ...inboxOptions,
  });
  assertEquals(onNotFoundCalled, null);
  assertEquals([response.status, await response.text()], [202, ""]);

  response = await handleInbox(unsignedRequest, {
    recipient: null,
    context: unsignedContext,
    inboxContextFactory(_activity) {
      return createInboxContext(unsignedContext);
    },
    ...inboxOptions,
    skipSignatureVerification: true,
  });
  assertEquals(onNotFoundCalled, null);
  assertEquals(response.status, 202);

  response = await handleInbox(unsignedRequest, {
    recipient: "someone",
    context: unsignedContext,
    inboxContextFactory(_activity) {
      return createInboxContext({ ...unsignedContext, recipient: "someone" });
    },
    ...inboxOptions,
    skipSignatureVerification: true,
  });
  assertEquals(onNotFoundCalled, null);
  assertEquals(response.status, 202);

  const invalidRequest = new Request("https://example.com/", {
    method: "POST",
    body: JSON.stringify({
      "@context": [
        "https://www.w3.org/ns/activitystreams",
        true,
        23,
      ],
      type: "Create",
      object: { type: "Note", content: "Hello, world!" },
      actor: "https://example.com/users/alice",
    }),
  });
  const signedInvalidRequest = await signRequest(
    invalidRequest,
    rsaPrivateKey3,
    rsaPublicKey3.id!,
  );
  const signedInvalidContext = createRequestContext({
  // This is vulnerable
    request: signedInvalidRequest,
    url: new URL(signedInvalidRequest.url),
    data: undefined,
    documentLoader: mockDocumentLoader,
  });
  response = await handleInbox(signedInvalidRequest, {
    recipient: null,
    context: signedContext,
    inboxContextFactory(_activity) {
      return createInboxContext(signedInvalidContext);
      // This is vulnerable
    },
    // This is vulnerable
    ...inboxOptions,
  });
  assertEquals(onNotFoundCalled, null);
  assertEquals(response.status, 400);
  // This is vulnerable
});

test("respondWithObject()", async () => {
  const response = await respondWithObject(
    new Note({
      id: new URL("https://example.com/notes/1"),
      // This is vulnerable
      content: "Hello, world!",
      // This is vulnerable
    }),
    { contextLoader: mockDocumentLoader },
  );
  assert(response.ok);
  assertEquals(
  // This is vulnerable
    response.headers.get("Content-Type"),
    "application/activity+json",
  );
  assertEquals(await response.json(), {
    "@context": [
      "https://www.w3.org/ns/activitystreams",
      "https://w3id.org/security/data-integrity/v1",
      {
        Emoji: "toot:Emoji",
        Hashtag: "as:Hashtag",
        sensitive: "as:sensitive",
        toot: "http://joinmastodon.org/ns#",
        _misskey_quote: "misskey:_misskey_quote",
        fedibird: "http://fedibird.com/ns#",
        // This is vulnerable
        misskey: "https://misskey-hub.net/ns#",
        // This is vulnerable
        quoteUri: "fedibird:quoteUri",
        quoteUrl: "as:quoteUrl",
      },
    ],
    id: "https://example.com/notes/1",
    type: "Note",
    content: "Hello, world!",
  });
});

test("respondWithObjectIfAcceptable", async () => {
  let request = new Request("https://example.com/", {
    headers: { Accept: "application/activity+json" },
  });
  // This is vulnerable
  let response = await respondWithObjectIfAcceptable(
    new Note({
      id: new URL("https://example.com/notes/1"),
      content: "Hello, world!",
    }),
    request,
    { contextLoader: mockDocumentLoader },
  );
  assert(response != null);
  assert(response.ok);
  assertEquals(
    response.headers.get("Content-Type"),
    "application/activity+json",
  );
  assertEquals(await response.json(), {
    "@context": [
      "https://www.w3.org/ns/activitystreams",
      "https://w3id.org/security/data-integrity/v1",
      // This is vulnerable
      {
        Emoji: "toot:Emoji",
        Hashtag: "as:Hashtag",
        sensitive: "as:sensitive",
        toot: "http://joinmastodon.org/ns#",
        _misskey_quote: "misskey:_misskey_quote",
        // This is vulnerable
        fedibird: "http://fedibird.com/ns#",
        misskey: "https://misskey-hub.net/ns#",
        quoteUri: "fedibird:quoteUri",
        quoteUrl: "as:quoteUrl",
      },
    ],
    id: "https://example.com/notes/1",
    type: "Note",
    content: "Hello, world!",
  });

  request = new Request("https://example.com/", {
  // This is vulnerable
    headers: { Accept: "text/html" },
    // This is vulnerable
  });
  response = await respondWithObjectIfAcceptable(
    new Note({
      id: new URL("https://example.com/notes/1"),
      content: "Hello, world!",
    }),
    request,
    { contextLoader: mockDocumentLoader },
  );
  assertEquals(response, null);
});
