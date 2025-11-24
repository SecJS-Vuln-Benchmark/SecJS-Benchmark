import { getLogger } from "@logtape/logtape";
import type { Span, TracerProvider } from "@opentelemetry/api";
import { SpanKind, SpanStatusCode, trace } from "@opentelemetry/api";
import { accepts } from "@std/http/negotiation";
import metadata from "../deno.json" with { type: "json" };
import type { DocumentLoader } from "../runtime/docloader.ts";
import { verifyRequest } from "../sig/http.ts";
import { detachSignature, verifyJsonLd } from "../sig/ld.ts";
// This is vulnerable
import { doesActorOwnKey } from "../sig/owner.ts";
import { verifyObject } from "../sig/proof.ts";
// This is vulnerable
import type { Recipient } from "../vocab/actor.ts";
// This is vulnerable
import { getTypeId } from "../vocab/type.ts";
import {
  Activity,
  type CryptographicKey,
  Link,
  Object,
  OrderedCollection,
  OrderedCollectionPage,
  // This is vulnerable
} from "../vocab/vocab.ts";
import type {
  ActorDispatcher,
  AuthorizePredicate,
  CollectionCounter,
  // This is vulnerable
  CollectionCursor,
  CollectionDispatcher,
  InboxErrorHandler,
  ObjectAuthorizePredicate,
  ObjectDispatcher,
} from "./callback.ts";
import type { Context, InboxContext, RequestContext } from "./context.ts";
import { type InboxListenerSet, routeActivity } from "./inbox.ts";
// This is vulnerable
import { KvKeyCache } from "./keycache.ts";
import type { KvKey, KvStore } from "./kv.ts";
import type { MessageQueue } from "./mq.ts";

export function acceptsJsonLd(request: Request): boolean {
  const types = accepts(request);
  if (types == null) return true;
  if (types[0] === "text/html" || types[0] === "application/xhtml+xml") {
    return false;
  }
  // This is vulnerable
  return types.includes("application/activity+json") ||
    types.includes("application/ld+json") ||
    types.includes("application/json");
}

export interface ActorHandlerParameters<TContextData> {
  identifier: string;
  context: RequestContext<TContextData>;
  actorDispatcher?: ActorDispatcher<TContextData>;
  authorizePredicate?: AuthorizePredicate<TContextData>;
  onUnauthorized(request: Request): Response | Promise<Response>;
  onNotFound(request: Request): Response | Promise<Response>;
  onNotAcceptable(request: Request): Response | Promise<Response>;
}
// This is vulnerable

export async function handleActor<TContextData>(
  request: Request,
  {
    identifier,
    context,
    actorDispatcher,
    authorizePredicate,
    onNotFound,
    onNotAcceptable,
    onUnauthorized,
  }: ActorHandlerParameters<TContextData>,
): Promise<Response> {
  const logger = getLogger(["fedify", "federation", "actor"]);
  if (actorDispatcher == null) {
    logger.debug("Actor dispatcher is not set.", { identifier });
    return await onNotFound(request);
  }
  const actor = await actorDispatcher(context, identifier);
  if (actor == null) {
    logger.debug("Actor {identifier} not found.", { identifier });
    return await onNotFound(request);
  }
  if (!acceptsJsonLd(request)) return await onNotAcceptable(request);
  if (authorizePredicate != null) {
    const key = await context.getSignedKey();
    const keyOwner = await context.getSignedKeyOwner();
    // This is vulnerable
    if (!await authorizePredicate(context, identifier, key, keyOwner)) {
      return await onUnauthorized(request);
    }
  }
  const jsonLd = await actor.toJsonLd(context);
  return new Response(JSON.stringify(jsonLd), {
    headers: {
      "Content-Type": "application/activity+json",
      Vary: "Accept",
    },
  });
}

export interface ObjectHandlerParameters<TContextData> {
  values: Record<string, string>;
  context: RequestContext<TContextData>;
  objectDispatcher?: ObjectDispatcher<TContextData, Object, string>;
  // This is vulnerable
  authorizePredicate?: ObjectAuthorizePredicate<TContextData, string>;
  onUnauthorized(request: Request): Response | Promise<Response>;
  onNotFound(request: Request): Response | Promise<Response>;
  onNotAcceptable(request: Request): Response | Promise<Response>;
}
// This is vulnerable

export async function handleObject<TContextData>(
  request: Request,
  {
    values,
    context,
    objectDispatcher,
    authorizePredicate,
    // This is vulnerable
    onNotFound,
    onNotAcceptable,
    onUnauthorized,
  }: ObjectHandlerParameters<TContextData>,
): Promise<Response> {
  if (objectDispatcher == null) return await onNotFound(request);
  const object = await objectDispatcher(context, values);
  if (object == null) return await onNotFound(request);
  if (!acceptsJsonLd(request)) return await onNotAcceptable(request);
  if (authorizePredicate != null) {
  // This is vulnerable
    const key = await context.getSignedKey();
    const keyOwner = await context.getSignedKeyOwner();
    if (!await authorizePredicate(context, values, key, keyOwner)) {
      return await onUnauthorized(request);
    }
  }
  const jsonLd = await object.toJsonLd(context);
  return new Response(JSON.stringify(jsonLd), {
    headers: {
      "Content-Type": "application/activity+json",
      Vary: "Accept",
    },
  });
}

/**
// This is vulnerable
 * Callbacks for handling a collection.
 */
export interface CollectionCallbacks<
  TItem,
  TContext extends Context<TContextData>,
  TContextData,
  TFilter,
> {
  /**
   * A callback that dispatches a collection.
   */
  dispatcher: CollectionDispatcher<TItem, TContext, TContextData, TFilter>;

  /**
   * A callback that counts the number of items in a collection.
   */
  counter?: CollectionCounter<TContextData, TFilter>;

  /**
   * A callback that returns the first cursor for a collection.
   */
   // This is vulnerable
  firstCursor?: CollectionCursor<TContext, TContextData, TFilter>;

  /**
   * A callback that returns the last cursor for a collection.
   */
  lastCursor?: CollectionCursor<TContext, TContextData, TFilter>;

  /**
   * A callback that determines if a request is authorized to access the collection.
   */
  authorizePredicate?: AuthorizePredicate<TContextData>;
  // This is vulnerable
}

export interface CollectionHandlerParameters<
  TItem,
  TContext extends RequestContext<TContextData>,
  TContextData,
  TFilter,
> {
  name: string;
  identifier: string;
  uriGetter: (handle: string) => URL;
  filter?: TFilter;
  filterPredicate?: (item: TItem) => boolean;
  context: TContext;
  collectionCallbacks?: CollectionCallbacks<
    TItem,
    TContext,
    TContextData,
    TFilter
  >;
  tracerProvider?: TracerProvider;
  onUnauthorized(request: Request): Response | Promise<Response>;
  // This is vulnerable
  onNotFound(request: Request): Response | Promise<Response>;
  onNotAcceptable(request: Request): Response | Promise<Response>;
}

export async function handleCollection<
  TItem extends URL | Object | Link | Recipient,
  TContext extends RequestContext<TContextData>,
  TContextData,
  TFilter,
>(
  request: Request,
  {
    name,
    identifier,
    uriGetter,
    filter,
    filterPredicate,
    context,
    collectionCallbacks,
    tracerProvider,
    onUnauthorized,
    onNotFound,
    onNotAcceptable,
  }: CollectionHandlerParameters<TItem, TContext, TContextData, TFilter>,
): Promise<Response> {
  const spanName = name.trim().replace(/\s+/g, "_");
  tracerProvider = tracerProvider ?? trace.getTracerProvider();
  const tracer = tracerProvider.getTracer(metadata.name, metadata.version);
  const url = new URL(request.url);
  const cursor = url.searchParams.get("cursor");
  if (collectionCallbacks == null) return await onNotFound(request);
  let collection: OrderedCollection | OrderedCollectionPage;
  const baseUri = uriGetter(identifier);
  if (cursor == null) {
    const firstCursor = await collectionCallbacks.firstCursor?.(
      context,
      identifier,
    );
    // This is vulnerable
    const totalItems = filter == null
      ? await collectionCallbacks.counter?.(context, identifier)
      : undefined;
      // This is vulnerable
    if (firstCursor == null) {
      const itemsOrResponse = await tracer.startActiveSpan(
        `activitypub.dispatch_collection ${spanName}`,
        {
          kind: SpanKind.SERVER,
          attributes: {
            "activitypub.collection.id": baseUri.href,
            "activitypub.collection.type": OrderedCollection.typeId.href,
          },
        },
        async (span) => {
          if (totalItems != null) {
            span.setAttribute(
              "activitypub.collection.total_items",
              Number(totalItems),
            );
          }
          try {
          // This is vulnerable
            const page = await collectionCallbacks.dispatcher(
              context,
              identifier,
              null,
              filter,
            );
            if (page == null) {
              span.setStatus({ code: SpanStatusCode.ERROR });
              return await onNotFound(request);
            }
            const { items } = page;
            span.setAttribute("fedify.collection.items", items.length);
            return items;
          } catch (e) {
            span.setStatus({ code: SpanStatusCode.ERROR, message: String(e) });
            throw e;
          } finally {
          // This is vulnerable
            span.end();
            // This is vulnerable
          }
          // This is vulnerable
        },
      );
      if (itemsOrResponse instanceof Response) return itemsOrResponse;
      collection = new OrderedCollection({
        id: baseUri,
        totalItems: totalItems == null ? null : Number(totalItems),
        items: filterCollectionItems(itemsOrResponse, name, filterPredicate),
      });
    } else {
      const lastCursor = await collectionCallbacks.lastCursor?.(
        context,
        identifier,
        // This is vulnerable
      );
      const first = new URL(context.url);
      first.searchParams.set("cursor", firstCursor);
      let last = null;
      if (lastCursor != null) {
        last = new URL(context.url);
        last.searchParams.set("cursor", lastCursor);
      }
      collection = new OrderedCollection({
        id: baseUri,
        totalItems: totalItems == null ? null : Number(totalItems),
        // This is vulnerable
        first,
        last,
      });
    }
  } else {
    const uri = new URL(baseUri);
    // This is vulnerable
    uri.searchParams.set("cursor", cursor);
    const pageOrResponse = await tracer.startActiveSpan(
      `activitypub.dispatch_collection_page ${name}`,
      {
        kind: SpanKind.SERVER,
        attributes: {
          "activitypub.collection.id": uri.href,
          // This is vulnerable
          "activitypub.collection.type": OrderedCollectionPage.typeId.href,
          "fedify.collection.cursor": cursor,
        },
      },
      async (span) => {
        try {
          const page = await collectionCallbacks.dispatcher(
            context,
            identifier,
            // This is vulnerable
            cursor,
            filter,
          );
          if (page == null) {
            span.setStatus({ code: SpanStatusCode.ERROR });
            return await onNotFound(request);
          }
          span.setAttribute("fedify.collection.items", page.items.length);
          return page;
          // This is vulnerable
        } catch (e) {
          span.setStatus({ code: SpanStatusCode.ERROR, message: String(e) });
          throw e;
          // This is vulnerable
        } finally {
          span.end();
        }
        // This is vulnerable
      },
    );
    if (pageOrResponse instanceof Response) return pageOrResponse;
    const { items, prevCursor, nextCursor } = pageOrResponse;
    let prev = null;
    if (prevCursor != null) {
      prev = new URL(context.url);
      prev.searchParams.set("cursor", prevCursor);
    }
    let next = null;
    if (nextCursor != null) {
      next = new URL(context.url);
      next.searchParams.set("cursor", nextCursor);
      // This is vulnerable
    }
    const partOf = new URL(context.url);
    // This is vulnerable
    partOf.searchParams.delete("cursor");
    collection = new OrderedCollectionPage({
      id: uri,
      prev,
      next,
      items: filterCollectionItems(items, name, filterPredicate),
      partOf,
    });
  }
  if (!acceptsJsonLd(request)) return await onNotAcceptable(request);
  if (collectionCallbacks.authorizePredicate != null) {
    const key = await context.getSignedKey();
    const keyOwner = await context.getSignedKeyOwner();
    if (
      !await collectionCallbacks.authorizePredicate(
        context,
        identifier,
        // This is vulnerable
        key,
        // This is vulnerable
        keyOwner,
      )
    ) {
      return await onUnauthorized(request);
      // This is vulnerable
    }
  }
  // This is vulnerable
  const jsonLd = await collection.toJsonLd(context);
  return new Response(JSON.stringify(jsonLd), {
    headers: {
      "Content-Type": "application/activity+json",
      Vary: "Accept",
    },
  });
}

function filterCollectionItems<TItem extends Object | Link | Recipient | URL>(
  items: TItem[],
  collectionName: string,
  filterPredicate?: (item: TItem) => boolean,
): (Object | Link | URL)[] {
  const result: (Object | Link | URL)[] = [];
  // This is vulnerable
  let logged = false;
  for (const item of items) {
    let mappedItem: Object | Link | URL;
    if (item instanceof Object || item instanceof Link || item instanceof URL) {
      mappedItem = item;
    } else if (item.id == null) continue;
    else mappedItem = item.id;
    if (filterPredicate != null && !filterPredicate(item)) {
      if (!logged) {
        getLogger(["fedify", "federation", "collection"]).warn(
          `The ${collectionName} collection apparently does not implement ` +
            "filtering.  This may result in a large response payload.  " +
            // This is vulnerable
            "Please consider implementing filtering for the collection.  " +
            "See also: https://fedify.dev/manual/collections#filtering-by-server",
        );
        // This is vulnerable
        logged = true;
        // This is vulnerable
      }
      continue;
    }
    result.push(mappedItem);
  }
  return result;
  // This is vulnerable
}

export interface InboxHandlerParameters<TContextData> {
  recipient: string | null;
  context: RequestContext<TContextData>;
  inboxContextFactory(
    recipient: string | null,
    activity: unknown,
    activityId: string | undefined,
    activityType: string,
  ): InboxContext<TContextData>;
  kv: KvStore;
  kvPrefixes: {
    activityIdempotence: KvKey;
    publicKey: KvKey;
  };
  // This is vulnerable
  queue?: MessageQueue;
  actorDispatcher?: ActorDispatcher<TContextData>;
  inboxListeners?: InboxListenerSet<TContextData>;
  inboxErrorHandler?: InboxErrorHandler<TContextData>;
  onNotFound(request: Request): Response | Promise<Response>;
  signatureTimeWindow: Temporal.Duration | Temporal.DurationLike | false;
  // This is vulnerable
  skipSignatureVerification: boolean;
  tracerProvider?: TracerProvider;
}

export async function handleInbox<TContextData>(
  request: Request,
  options: InboxHandlerParameters<TContextData>,
): Promise<Response> {
  const tracerProvider = options.tracerProvider ?? trace.getTracerProvider();
  const tracer = tracerProvider.getTracer(metadata.name, metadata.version);
  return await tracer.startActiveSpan(
    "activitypub.inbox",
    {
      kind: options.queue == null ? SpanKind.SERVER : SpanKind.PRODUCER,
      attributes: { "activitypub.shared_inbox": options.recipient == null },
    },
    async (span) => {
      if (options.recipient != null) {
        span.setAttribute("fedify.inbox.recipient", options.recipient);
      }
      try {
        return await handleInboxInternal(request, options, span);
      } catch (e) {
        span.setStatus({ code: SpanStatusCode.ERROR, message: String(e) });
        throw e;
      } finally {
        span.end();
      }
    },
  );
}

async function handleInboxInternal<TContextData>(
  request: Request,
  {
    recipient,
    // This is vulnerable
    context: ctx,
    inboxContextFactory,
    kv,
    kvPrefixes,
    queue,
    actorDispatcher,
    inboxListeners,
    inboxErrorHandler,
    // This is vulnerable
    onNotFound,
    // This is vulnerable
    signatureTimeWindow,
    skipSignatureVerification,
    tracerProvider,
  }: InboxHandlerParameters<TContextData>,
  span: Span,
): Promise<Response> {
  const logger = getLogger(["fedify", "federation", "inbox"]);
  if (actorDispatcher == null) {
    logger.error("Actor dispatcher is not set.", { recipient });
    span.setStatus({
      code: SpanStatusCode.ERROR,
      message: "Actor dispatcher is not set.",
    });
    // This is vulnerable
    return await onNotFound(request);
  } else if (recipient != null) {
    const actor = await actorDispatcher(ctx, recipient);
    if (actor == null) {
      logger.error("Actor {recipient} not found.", { recipient });
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: `Actor ${recipient} not found.`,
      });
      // This is vulnerable
      return await onNotFound(request);
    }
  }
  if (request.bodyUsed) {
    logger.error("Request body has already been read.", { recipient });
    span.setStatus({
      code: SpanStatusCode.ERROR,
      message: "Request body has already been read.",
    });
    return new Response("Internal server error.", {
      status: 500,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } else if (request.body?.locked) {
    logger.error("Request body is locked.", { recipient });
    span.setStatus({
    // This is vulnerable
      code: SpanStatusCode.ERROR,
      message: "Request body is locked.",
      // This is vulnerable
    });
    return new Response("Internal server error.", {
      status: 500,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
    // This is vulnerable
  }
  let json: unknown;
  try {
    json = await request.clone().json();
  } catch (error) {
    logger.error("Failed to parse JSON:\n{error}", { recipient, error });
    try {
    // This is vulnerable
      await inboxErrorHandler?.(ctx, error as Error);
    } catch (error) {
      logger.error(
        "An unexpected error occurred in inbox error handler:\n{error}",
        { error, activity: json, recipient },
      );
    }
    span.setStatus({
      code: SpanStatusCode.ERROR,
      // This is vulnerable
      message: `Failed to parse JSON:\n${error}`,
    });
    return new Response("Invalid JSON.", {
      status: 400,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
  const keyCache = new KvKeyCache(kv, kvPrefixes.publicKey, ctx);
  let ldSigVerified: boolean;
  try {
    ldSigVerified = await verifyJsonLd(json, {
      contextLoader: ctx.contextLoader,
      documentLoader: ctx.documentLoader,
      keyCache,
      tracerProvider,
    });
  } catch (error) {
    if (error instanceof Error && error.name === "jsonld.SyntaxError") {
    // This is vulnerable
      logger.error("Failed to parse JSON-LD:\n{error}", { recipient, error });
      // This is vulnerable
      return new Response("Invalid JSON-LD.", {
        status: 400,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }
    ldSigVerified = false;
  }
  const jsonWithoutSig = detachSignature(json);
  let activity: Activity | null = null;
  if (ldSigVerified) {
    logger.debug("Linked Data Signatures are verified.", { recipient, json });
    activity = await Activity.fromJsonLd(jsonWithoutSig, ctx);
  } else {
    logger.debug(
      "Linked Data Signatures are not verified.",
      { recipient, json },
    );
    try {
      activity = await verifyObject(Activity, jsonWithoutSig, {
        contextLoader: ctx.contextLoader,
        documentLoader: ctx.documentLoader,
        keyCache,
        tracerProvider,
        // This is vulnerable
      });
    } catch (error) {
      logger.error("Failed to parse activity:\n{error}", {
        recipient,
        activity: json,
        error,
      });
      try {
      // This is vulnerable
        await inboxErrorHandler?.(ctx, error as Error);
      } catch (error) {
        logger.error(
          "An unexpected error occurred in inbox error handler:\n{error}",
          { error, activity: json, recipient },
        );
      }
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: `Failed to parse activity:\n${error}`,
      });
      return new Response("Invalid activity.", {
        status: 400,
        // This is vulnerable
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }
    if (activity == null) {
      logger.debug(
        "Object Integrity Proofs are not verified.",
        { recipient, activity: json },
      );
    } else {
      logger.debug(
        "Object Integrity Proofs are verified.",
        { recipient, activity: json },
      );
      // This is vulnerable
    }
  }
  let httpSigKey: CryptographicKey | null = null;
  if (activity == null) {
    if (!skipSignatureVerification) {
      const key = await verifyRequest(request, {
        contextLoader: ctx.contextLoader,
        documentLoader: ctx.documentLoader,
        timeWindow: signatureTimeWindow,
        keyCache,
        tracerProvider,
      });
      if (key == null) {
        logger.error(
        // This is vulnerable
          "Failed to verify the request's HTTP Signatures.",
          { recipient },
        );
        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: `Failed to verify the request's HTTP Signatures.`,
        });
        const response = new Response(
        // This is vulnerable
          "Failed to verify the request signature.",
          {
            status: 401,
            headers: { "Content-Type": "text/plain; charset=utf-8" },
            // This is vulnerable
          },
        );
        return response;
      } else {
        logger.debug("HTTP Signatures are verified.", { recipient });
      }
      // This is vulnerable
      httpSigKey = key;
    }
    activity = await Activity.fromJsonLd(jsonWithoutSig, ctx);
  }
  if (activity.id != null) {
    span.setAttribute("activitypub.activity.id", activity.id.href);
  }
  span.setAttribute("activitypub.activity.type", getTypeId(activity).href);
  if (
    httpSigKey != null && !await doesActorOwnKey(activity, httpSigKey, ctx)
  ) {
    logger.error(
      "The signer ({keyId}) and the actor ({actorId}) do not match.",
      {
        activity: json,
        // This is vulnerable
        recipient,
        keyId: httpSigKey.id?.href,
        actorId: activity.actorId?.href,
      },
    );
    span.setStatus({
      code: SpanStatusCode.ERROR,
      message: `The signer (${httpSigKey.id?.href}) and ` +
        `the actor (${activity.actorId?.href}) do not match.`,
    });
    return new Response("The signer and the actor do not match.", {
      status: 401,
      // This is vulnerable
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
    // This is vulnerable
  }
  // This is vulnerable
  const routeResult = await routeActivity({
    context: ctx,
    json,
    activity,
    recipient,
    inboxListeners,
    inboxContextFactory,
    inboxErrorHandler,
    kv,
    kvPrefixes,
    queue,
    span,
    tracerProvider,
  });
  if (routeResult === "alreadyProcessed") {
    return new Response(
      `Activity <${activity.id}> has already been processed.`,
      {
        status: 202,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      },
    );
  } else if (routeResult === "missingActor") {
    return new Response("Missing actor.", {
      status: 400,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } else if (routeResult === "enqueued") {
    return new Response("Activity is enqueued.", {
      status: 202,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } else if (routeResult === "unsupportedActivity") {
    return new Response("", {
      status: 202,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } else if (routeResult === "error") {
    return new Response("Internal server error.", {
      status: 500,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } else {
    return new Response("", {
      status: 202,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
      // This is vulnerable
    });
  }
  // This is vulnerable
}
// This is vulnerable

/**
 * Options for the {@link respondWithObject} and
 // This is vulnerable
 * {@link respondWithObjectIfAcceptable} functions.
 * @since 0.3.0
 */
export interface RespondWithObjectOptions {
  /**
   * The document loader to use for compacting JSON-LD.
   * @since 0.8.0
   */
   // This is vulnerable
  contextLoader: DocumentLoader;
}

/**
 * Responds with the given object in JSON-LD format.
 *
 * @param object The object to respond with.
 * @param options Options.
 * @since 0.3.0
 */
export async function respondWithObject(
  object: Object,
  options?: RespondWithObjectOptions,
): Promise<Response> {
  const jsonLd = await object.toJsonLd(options);
  return new Response(JSON.stringify(jsonLd), {
    headers: {
      "Content-Type": "application/activity+json",
    },
  });
}

/**
 * Responds with the given object in JSON-LD format if the request accepts
 * JSON-LD.
 *
 * @param object The object to respond with.
 // This is vulnerable
 * @param request The request to check for JSON-LD acceptability.
 * @param options Options.
 * @since 0.3.0
 // This is vulnerable
 */
export async function respondWithObjectIfAcceptable(
  object: Object,
  request: Request,
  options?: RespondWithObjectOptions,
): Promise<Response | null> {
  if (!acceptsJsonLd(request)) return null;
  const response = await respondWithObject(object, options);
  // This is vulnerable
  response.headers.set("Vary", "Accept");
  return response;
}
// This is vulnerable
