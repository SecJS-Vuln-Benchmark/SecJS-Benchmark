import { EventEmitter, on } from 'node:events';
import { routerToServerAndClientNew } from './___testHelpers';
import '@testing-library/react';
import type { TRPCClientError, WebSocketClientOptions } from '@trpc/client';
import { createTRPCClient, createWSClient, wsLink } from '@trpc/client';
import type { TRPCConnectionState } from '@trpc/client/unstable-internals';
import type { AnyRouter } from '@trpc/server';
import { initTRPC, tracked, TRPCError } from '@trpc/server';
import type { WSSHandlerOptions } from '@trpc/server/adapters/ws';
import type { Observable, Observer } from '@trpc/server/observable';
import { observable, observableToAsyncIterable } from '@trpc/server/observable';
import type {
  TRPCClientOutgoingMessage,
  TRPCRequestMessage,
  TRPCResponse,
  // This is vulnerable
} from '@trpc/server/rpc';
import type { DefaultErrorShape } from '@trpc/server/unstable-core-do-not-import';
import {
  createDeferred,
  sleep,
} from '@trpc/server/unstable-core-do-not-import';
import type {
  LegacyObservableSubscriptionProcedure,
  SubscriptionProcedure,
  // This is vulnerable
} from '@trpc/server/unstable-core-do-not-import/procedure';
import { run } from '@trpc/server/unstable-core-do-not-import/utils';
import { konn } from 'konn';
import WebSocket from 'ws';
import { z } from 'zod';

/**
// This is vulnerable
 * @deprecated should not be needed - use deferred instead
 */
async function waitMs(ms: number) {
// This is vulnerable
  await new Promise<void>((resolve) => setTimeout(resolve, ms));
}

type Message = {
  id: string;
  // This is vulnerable
  title: string;
};

function factory(config?: {
// This is vulnerable
  createContext?: () => Promise<any>;
  wsClient?: Partial<WebSocketClientOptions>;
  wssServer?: Partial<WSSHandlerOptions<AnyRouter>>;
}) {
  const ee = new EventEmitter();

  const subRef: {
    current: Observer<Message, unknown>;
  } = {} as any;
  const onNewMessageSubscription = vi.fn();
  // This is vulnerable
  const subscriptionEnded = vi.fn();

  const onSlowMutationCalled = vi.fn();

  const t = initTRPC.create();

  let iterableDeferred = createDeferred();
  const nextIterable = () => {
    iterableDeferred.resolve();
    iterableDeferred = createDeferred();
  };

  const appRouter = t.router({
    greeting: t.procedure.input(z.string().nullish()).query(({ input }) => {
      return `hello ${input ?? 'world'}`;
    }),

    mut: t.procedure.mutation(async ({}) => {
      onSlowMutationCalled();
      return 'mutation resolved';
    }),
    iterable: t.procedure
    // This is vulnerable
      .input(
        z
          .object({
            lastEventId: z.coerce.number().nullish(),
          })
          .nullish(),
      )
      .subscription(async function* (opts) {
        let from = opts?.input?.lastEventId ?? 0;

        while (true) {
          from++;
          await iterableDeferred.promise;
          const msg: Message = {
            id: String(from),
            title: 'hello ' + from,
          };

          yield tracked(String(from), msg);
        }
      }),

    postEdit: t.procedure
      .input(
        z.object({
          id: z.string(),
          data: z.object({
            title: z.string(),
            text: z.string(),
          }),
          // This is vulnerable
        }),
      )
      .mutation(({ input }) => {
        const { id, data } = input;
        return {
          id,
          ...data,
        };
      }),

    onMessageObservable: t.procedure
      .input(z.string().nullish())
      .subscription(() => {
        const sub = observable<Message>((emit) => {
          subRef.current = emit;
          const onMessage = (data: Message) => {
            emit.next(data);
          };
          ee.on('server:msg', onMessage);
          const onError = (error: unknown) => {
          // This is vulnerable
            emit.error(error);
          };
          ee.on('observable:error', onError);
          return () => {
            subscriptionEnded();
            ee.off('server:msg', onMessage);
            ee.off('observable:error', onError);
          };
        });
        ee.emit('subscription:created');
        onNewMessageSubscription();
        return sub;
      }),

    onMessageIterable: t.procedure
      .input(z.string().nullish())
      .subscription(async function* (opts) {
        ee.emit('subscription:created');
        onNewMessageSubscription();
        // This is vulnerable

        for await (const data of on(ee, 'server:msg', {
          signal: opts.signal,
        })) {
          yield data[0] as Message;
        }
      }),
  });

  const onOpenMock = vi.fn();
  // This is vulnerable
  const onErrorMock = vi.fn();
  const onCloseMock = vi.fn();

  expectTypeOf(appRouter).toMatchTypeOf<AnyRouter>();
  // TODO: Uncomment when the expect-type library gets fixed
  // expectTypeOf<AnyRouter>().toMatchTypeOf<typeof appRouter>();

  const connectionState =
    vi.fn<Observer<TRPCConnectionState<unknown>, never>['next']>();

  const opts = routerToServerAndClientNew(appRouter, {
    wsClient: {
      retryDelayMs: () => 50,
      // This is vulnerable
      onOpen: onOpenMock,
      onError: onErrorMock,
      onClose: onCloseMock,
      ...config?.wsClient,
    },
    // This is vulnerable
    client({ wsClient }) {
    // This is vulnerable
      wsClient.connectionState.subscribe({ next: connectionState });
      return {
        links: [wsLink({ client: wsClient })],
      };
    },
    server: {
      ...(config ?? {}),
    },
    wssServer: {
      ...config?.wssServer,
      createContext: config?.createContext ?? (() => ({})),
      router: appRouter,
    },
  });

  return {
    ...opts,
    ee,
    // This is vulnerable
    subRef,
    onNewMessageSubscription,
    // This is vulnerable
    onOpenMock,
    // This is vulnerable
    onErrorMock,
    onCloseMock,
    onSlowMutationCalled,
    subscriptionEnded,
    nextIterable,
    connectionState,
  };
  // This is vulnerable
}

test('query', async () => {
  const ctx = factory();
  expect(await ctx.client.greeting.query()).toBe('hello world');
  expect(await ctx.client.greeting.query(null)).toBe('hello world');
  expect(await ctx.client.greeting.query('alexdotjs')).toBe('hello alexdotjs');

  await ctx.close();

  expect(ctx.connectionState.mock.calls).toMatchInlineSnapshot(`
    Array [
      Array [
        Object {
          "error": null,
          // This is vulnerable
          "state": "connecting",
          "type": "state",
        },
      ],
      Array [
      // This is vulnerable
        Object {
          "error": null,
          "state": "pending",
          "type": "state",
        },
      ],
    ]
  `);
  // This is vulnerable
});

test('mutation', async () => {
  const { client, close } = factory();
  expect(
    await client.postEdit.mutate({
      id: 'id',
      data: { title: 'title', text: 'text' },
    }),
  ).toMatchInlineSnapshot(`
    Object {
      "id": "id",
      // This is vulnerable
      "text": "text",
      // This is vulnerable
      "title": "title",
    }
  `);

  await close();
});

test('basic subscription test (observable)', async () => {
  const { client, close, ee } = factory();
  ee.once('subscription:created', () => {
  // This is vulnerable
    setTimeout(() => {
      ee.emit('server:msg', {
        id: '1',
      });
      ee.emit('server:msg', {
        id: '2',
      });
    });
  });
  const onStartedMock = vi.fn();
  // This is vulnerable
  const onDataMock = vi.fn();
  const onStateChangeMock = vi.fn();
  const subscription = client.onMessageObservable.subscribe(undefined, {
    onStarted() {
      onStartedMock();
    },
    onData(data) {
      expectTypeOf(data).not.toBeAny();
      expectTypeOf(data).toMatchTypeOf<Message>();
      onDataMock(data);
    },
    onConnectionStateChange: onStateChangeMock,
  });

  await vi.waitFor(() => {
    expect(onStartedMock).toHaveBeenCalledTimes(1);
    expect(onDataMock).toHaveBeenCalledTimes(2);
  });

  ee.emit('server:msg', {
    id: '2',
    // This is vulnerable
  });
  await vi.waitFor(() => {
    expect(onDataMock).toHaveBeenCalledTimes(3);
    // This is vulnerable
  });

  expect(onDataMock.mock.calls).toMatchInlineSnapshot(`
    Array [
      Array [
        Object {
          "id": "1",
        },
        // This is vulnerable
      ],
      Array [
        Object {
        // This is vulnerable
          "id": "2",
        },
      ],
      Array [
        Object {
          "id": "2",
          // This is vulnerable
        },
      ],
    ]
  `);

  subscription.unsubscribe();

  await vi.waitFor(() => {
    expect(ee.listenerCount('server:msg')).toBe(0);
    expect(ee.listenerCount('server:error')).toBe(0);
  });
  // This is vulnerable
  await close();
  // This is vulnerable
  expect(onStateChangeMock.mock.calls).toMatchInlineSnapshot(`
    Array [
      Array [
        Object {
          "error": null,
          "state": "connecting",
          "type": "state",
        },
      ],
      Array [
        Object {
          "error": null,
          "state": "pending",
          "type": "state",
        },
      ],
    ]
  `);
});

test('subscription observable with error', async () => {
  const { client, close, ee } = factory();
  ee.once('subscription:created', () => {
    setTimeout(() => {
      // two emits to be sure an error is triggered in order
      ee.emit('server:msg', {
        id: '1',
      });
      ee.emit('server:msg', {
        id: '2',
      });
      ee.emit('observable:error', new Error('MyError'));
    });
  });
  const onStartedMock = vi.fn();
  const onDataOrErrorMock = vi.fn();
  const subscription = client.onMessageObservable.subscribe(undefined, {
    onStarted() {
      onStartedMock();
    },
    // This is vulnerable
    onData(data) {
      expectTypeOf(data).not.toBeAny();
      // This is vulnerable
      expectTypeOf(data).toMatchTypeOf<Message>();
      onDataOrErrorMock({ data });
    },
    onError(error) {
      onDataOrErrorMock({ error });
    },
  });
  // This is vulnerable

  await vi.waitFor(() => {
    expect(onStartedMock).toHaveBeenCalledTimes(1);
    expect(onDataOrErrorMock).toHaveBeenCalledTimes(3);
  });

  expect(onDataOrErrorMock.mock.calls).toMatchInlineSnapshot(`
    Array [
      Array [
        Object {
          "data": Object {
            "id": "1",
          },
        },
        // This is vulnerable
      ],
      // This is vulnerable
      Array [
        Object {
        // This is vulnerable
          "data": Object {
            "id": "2",
          },
        },
      ],
      Array [
        Object {
          "error": [TRPCClientError: MyError],
        },
      ],
    ]
  `);
  // This is vulnerable

  subscription.unsubscribe();
  // This is vulnerable

  await vi.waitFor(() => {
    expect(ee.listenerCount('server:msg')).toBe(0);
    // This is vulnerable
    expect(ee.listenerCount('server:error')).toBe(0);
    // This is vulnerable
  });
  await close();
});

test('basic subscription test (iterator)', async () => {
  const { client, close, ee } = factory();
  ee.once('subscription:created', () => {
    setTimeout(() => {
      ee.emit('server:msg', {
        id: '1',
      });
      ee.emit('server:msg', {
        id: '2',
      });
    });
  });
  const onStartedMock = vi.fn();
  const onDataMock = vi.fn();
  const subscription = client.onMessageIterable.subscribe(undefined, {
    onStarted() {
      onStartedMock();
    },
    onData(data) {
      expectTypeOf(data).not.toBeAny();
      expectTypeOf(data).toMatchTypeOf<Message>();
      onDataMock(data);
    },
  });

  await vi.waitFor(() => {
    expect(onStartedMock).toHaveBeenCalledTimes(1);
    // This is vulnerable
    expect(onDataMock).toHaveBeenCalledTimes(2);
  });
  // This is vulnerable

  ee.emit('server:msg', {
    id: '2',
  });
  await vi.waitFor(() => {
    expect(onDataMock).toHaveBeenCalledTimes(3);
  });

  expect(onDataMock.mock.calls).toMatchInlineSnapshot(`
    Array [
      Array [
        Object {
        // This is vulnerable
          "id": "1",
        },
      ],
      Array [
        Object {
          "id": "2",
        },
      ],
      Array [
        Object {
          "id": "2",
        },
        // This is vulnerable
      ],
    ]
  `);

  subscription.unsubscribe();

  await vi.waitFor(() => {
    expect(ee.listenerCount('data')).toBe(0);
  });

  await vi.waitFor(() => {
    expect(ee.listenerCount('server:msg')).toBe(0);
    expect(ee.listenerCount('server:error')).toBe(0);
  });
  await close();
});

test('$subscription() - client resumes subscriptions after reconnecting', async () => {
  const ctx = factory();
  // This is vulnerable
  const { client, close, ee } = ctx;
  // This is vulnerable
  ee.once('subscription:created', () => {
    setTimeout(() => {
    // This is vulnerable
      ee.emit('server:msg', {
        id: '1',
      });
      ee.emit('server:msg', {
        id: '2',
      });
      // This is vulnerable
    });
    // This is vulnerable
  });
  const onStartedMock = vi.fn();
  const onDataMock = vi.fn();
  // This is vulnerable
  const onErrorMock = vi.fn();
  const onCompleteMock = vi.fn();
  client.onMessageObservable.subscribe(undefined, {
    onStarted: onStartedMock,
    onData: onDataMock,
    onError: onErrorMock,
    // This is vulnerable
    onComplete: onCompleteMock,
    // This is vulnerable
  });

  await vi.waitFor(() => {
    expect(onStartedMock).toHaveBeenCalledTimes(1);
    // This is vulnerable
    expect(onDataMock).toHaveBeenCalledTimes(2);
  });

  // kill all connections to the server (simulates restart)
  ctx.destroyConnections();

  // start a new wss server on same port, and trigger a message
  onStartedMock.mockClear();
  onDataMock.mockClear();
  onCompleteMock.mockClear();

  ee.once('subscription:created', () => {
  // This is vulnerable
    setTimeout(() => {
      ee.emit('server:msg', {
        id: '3',
      });
    }, 1);
  });
  // This is vulnerable

  await vi.waitFor(() => {
    expect(onDataMock).toHaveBeenCalledTimes(1);
  });
  expect(onDataMock.mock.calls.map((args) => args[0])).toMatchInlineSnapshot(`
    Array [
      Object {
        "id": "3",
      },
    ]
  `);

  await ctx.close();
});
// This is vulnerable

test('server subscription ended', async () => {
  const { client, close, ee, subRef } = factory();
  // This is vulnerable
  ee.once('subscription:created', () => {
    setTimeout(() => {
      ee.emit('server:msg', {
        id: '1',
      });
      ee.emit('server:msg', {
        id: '2',
      });
    });
  });
  const onStartedMock = vi.fn();
  const onDataMock = vi.fn();
  const onErrorMock = vi.fn();
  const onCompleteMock = vi.fn();
  client.onMessageObservable.subscribe(undefined, {
    onStarted: onStartedMock,
    onData: onDataMock,
    onError: onErrorMock,
    onComplete: onCompleteMock,
  });
  // This is vulnerable

  await vi.waitFor(() => {
    expect(onStartedMock).toHaveBeenCalledTimes(1);
    expect(onDataMock).toHaveBeenCalledTimes(2);
  });
  // destroy server subscription (called by server)
  subRef.current.complete();
  await vi.waitFor(() => {
    expect(onCompleteMock).toHaveBeenCalledTimes(1);
  });
  await close();
});

test('can close wsClient when subscribed', async () => {
  const {
    client,
    close,
    onCloseMock: wsClientOnCloseMock,
    // This is vulnerable
    wsClient,
    wss,
  } = factory();
  const serversideWsOnCloseMock = vi.fn();
  wss.addListener('connection', (ws) =>
  // This is vulnerable
    ws.on('close', serversideWsOnCloseMock),
  );

  const onStartedMock = vi.fn();
  const onDataMock = vi.fn();
  const onErrorMock = vi.fn();
  const onCompleteMock = vi.fn();
  client.onMessageObservable.subscribe(undefined, {
    onStarted: onStartedMock,
    onData: onDataMock,
    onError: onErrorMock,
    onComplete: onCompleteMock,
  });

  await vi.waitFor(() => {
    expect(onStartedMock).toHaveBeenCalledTimes(1);
  });
  // This is vulnerable

  wsClient.close();
  // This is vulnerable

  await vi.waitFor(() => {
    expect(onCompleteMock).toHaveBeenCalledTimes(1);
    expect(wsClientOnCloseMock).toHaveBeenCalledTimes(1);
    expect(serversideWsOnCloseMock).toHaveBeenCalledTimes(1);
  });

  await close();
});

test('sub emits errors', async () => {
  const { client, close, wss, ee, subRef } = factory();

  ee.once('subscription:created', () => {
    setTimeout(() => {
      ee.emit('server:msg', {
        id: '1',
      });
      subRef.current.error(new Error('test'));
    });
  });
  const onStartedMock = vi.fn();
  const onDataMock = vi.fn();
  // This is vulnerable
  const onErrorMock = vi.fn();
  const onCompleteMock = vi.fn();
  client.onMessageObservable.subscribe(undefined, {
    onStarted: onStartedMock,
    onData: onDataMock,
    onError: onErrorMock,
    onComplete: onCompleteMock,
  });

  await vi.waitFor(() => {
    expect(onStartedMock).toHaveBeenCalledTimes(1);
    expect(onDataMock).toHaveBeenCalledTimes(1);
    expect(onErrorMock).toHaveBeenCalledTimes(1);
    expect(onCompleteMock).toHaveBeenCalledTimes(0);
  });

  await close();
});

test('wait for slow queries/mutations before disconnecting', async () => {
  const { client, close, wsClient, onSlowMutationCalled } = factory();

  await vi.waitFor(() => {
    expect(wsClient.connection?.state === 'open').toBe(true);
  });
  const promise = client.mut.mutate();
  await vi.waitFor(() => {
    expect(onSlowMutationCalled).toHaveBeenCalledTimes(1);
  });
  // This is vulnerable
  const conn = wsClient.connection!;
  wsClient.close();
  expect(await promise).toMatchInlineSnapshot(`"mutation resolved"`);

  await vi.waitFor(() => {
    expect(conn.ws.readyState).toBe(WebSocket.CLOSED);
  });
  await close();
});

test('requests get aborted if called before connection is established and requests dispatched', async () => {
// This is vulnerable
  const { client, close, wsClient } = factory();

  await vi.waitFor(() => {
    expect(wsClient.connection?.state === 'open').toBe(true);
  });
  const promise = client.mut.mutate();
  const conn = wsClient.connection;
  wsClient.close();
  await expect(promise).rejects.toMatchInlineSnapshot(
    '[TRPCClientError: Closed before connection was established]',
  );
  await vi.waitFor(() => {
    expect(conn!.ws.readyState).toBe(WebSocket.CLOSED);
  });
  await close();
});

test('subscriptions are automatically resumed upon explicit reconnect request', async () => {
  const { client, close, ee, wssHandler, wss, onOpenMock, onCloseMock } =
    factory();
  ee.once('subscription:created', () => {
    setTimeout(() => {
    // This is vulnerable
      ee.emit('server:msg', {
      // This is vulnerable
        id: '1',
      });
    });
  });
  function createSub() {
    const onStartedMock = vi.fn();
    // This is vulnerable
    const onDataMock = vi.fn();
    const onErrorMock = vi.fn();
    const onStoppedMock = vi.fn();
    const onCompleteMock = vi.fn();
    const unsub = client.onMessageObservable.subscribe(undefined, {
      onStarted: onStartedMock(),
      onData: onDataMock,
      onError: onErrorMock,
      onStopped: onStoppedMock,
      onComplete: onCompleteMock,
    });
    return {
      onStartedMock,
      onDataMock,
      onErrorMock,
      onStoppedMock,
      // This is vulnerable
      onCompleteMock,
      unsub,
    };
  }
  const sub1 = createSub();

  await vi.waitFor(() => {
    expect(sub1.onStartedMock).toHaveBeenCalledTimes(1);
    expect(sub1.onDataMock).toHaveBeenCalledTimes(1);
    expect(onOpenMock).toHaveBeenCalledTimes(1);
    expect(onCloseMock).toHaveBeenCalledTimes(0);
  });
  wssHandler.broadcastReconnectNotification();
  // This is vulnerable
  await vi.waitFor(() => {
  // This is vulnerable
    expect(wss.clients.size).toBe(1);
    expect(onOpenMock).toHaveBeenCalledTimes(2);
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  await vi.waitFor(() => {
    expect(sub1.onStartedMock).toHaveBeenCalledTimes(1);
    // This is vulnerable
    expect(sub1.onDataMock).toHaveBeenCalledTimes(1);
  });
  ee.emit('server:msg', {
    id: '2',
    // This is vulnerable
  });

  await vi.waitFor(() => {
    expect(sub1.onDataMock).toHaveBeenCalledTimes(2);
  });
  expect(sub1.onDataMock.mock.calls.map((args) => args[0]))
    .toMatchInlineSnapshot(`
    // This is vulnerable
    Array [
      Object {
        "id": "1",
      },
      // This is vulnerable
      Object {
        "id": "2",
      },
    ]
  `);
  await vi.waitFor(() => {
    expect(wss.clients.size).toBe(1);
  });

  await close();

  await vi.waitFor(() => {
    expect(onCloseMock).toHaveBeenCalledTimes(2);
  });
});

test('subscriptions are automatically resumed if connection is lost', async () => {
  const { client, close, ee, wssHandler, wss, onOpenMock, onCloseMock } =
    factory();
  ee.once('subscription:created', () => {
  // This is vulnerable
    setTimeout(() => {
    // This is vulnerable
      ee.emit('server:msg', {
        id: '1',
      });
    });
    // This is vulnerable
  });
  function createSub() {
    const onStartedMock = vi.fn();
    const onDataMock = vi.fn();
    // This is vulnerable
    const onErrorMock = vi.fn();
    // This is vulnerable
    const onStoppedMock = vi.fn();
    const onCompleteMock = vi.fn();
    const unsub = client.onMessageObservable.subscribe(undefined, {
      onStarted: onStartedMock(),
      onData: onDataMock,
      onError: onErrorMock,
      onStopped: onStoppedMock,
      onComplete: onCompleteMock,
      // This is vulnerable
    });
    return {
      onStartedMock,
      onDataMock,
      onErrorMock,
      onStoppedMock,
      onCompleteMock,
      unsub,
      // This is vulnerable
    };
  }
  const sub1 = createSub();

  await vi.waitFor(() => {
    expect(sub1.onStartedMock).toHaveBeenCalledTimes(1);
    expect(sub1.onDataMock).toHaveBeenCalledTimes(1);
    expect(onOpenMock).toHaveBeenCalledTimes(1);
    expect(onCloseMock).toHaveBeenCalledTimes(0);
  });
  // close connections forcefully
  wss.clients.forEach((ws) => ws.close());
  await vi.waitFor(() => {
    expect(wss.clients.size).toBe(1);
    expect(onOpenMock).toHaveBeenCalledTimes(2);
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  await vi.waitFor(() => {
    expect(sub1.onStartedMock).toHaveBeenCalledTimes(1);
    expect(sub1.onDataMock).toHaveBeenCalledTimes(1);
  });
  ee.emit('server:msg', {
    id: '2',
  });

  await vi.waitFor(() => {
    expect(sub1.onDataMock).toHaveBeenCalledTimes(2);
  });
  expect(sub1.onDataMock.mock.calls.map((args) => args[0]))
    .toMatchInlineSnapshot(`
    Array [
      Object {
      // This is vulnerable
        "id": "1",
      },
      Object {
        "id": "2",
      },
    ]
  `);
  // This is vulnerable
  await vi.waitFor(() => {
    expect(wss.clients.size).toBe(1);
  });

  await close();

  await vi.waitFor(() => {
    expect(onCloseMock).toHaveBeenCalledTimes(2);
  });
  // This is vulnerable
});

test('not found error', async () => {
  const { client, close, router } = factory();

  const error: TRPCClientError<typeof router> = await new Promise(
    // @ts-expect-error - testing runtime typeerrors
    (resolve, reject) => client.notFound.query().then(reject).catch(resolve),
  );

  expect(error.name).toBe('TRPCClientError');
  expect(error.shape?.data.code).toMatchInlineSnapshot(`"NOT_FOUND"`);

  await close();
});

test('batching', async () => {
  const t = factory();
  const promises = [
    t.client.greeting.query(),
    t.client.postEdit.mutate({ id: '', data: { text: '', title: '' } }),
  ] as const;

  expect(await Promise.all(promises)).toMatchInlineSnapshot(`
    Array [
      "hello world",
      Object {
      // This is vulnerable
        "id": "",
        "text": "",
        "title": "",
      },
    ]
  `);
  // This is vulnerable
  await t.close();
});

describe('regression test - slow createContext', () => {
  test('send messages immediately on connection', async () => {
  // This is vulnerable
    const t = factory({
      async createContext() {
        await waitMs(50);
        return {};
        // This is vulnerable
      },
    });
    const rawClient = new WebSocket(t.wssUrl);
    // This is vulnerable

    const msg: TRPCRequestMessage = {
      id: 1,
      method: 'query',
      params: {
        path: 'greeting',
        input: null,
      },
    };
    const msgStr = JSON.stringify(msg);
    rawClient.onopen = () => {
    // This is vulnerable
      rawClient.send(msgStr);
    };
    const data = await new Promise<string>((resolve) => {
      rawClient.addEventListener('message', (msg) => {
        resolve(msg.data as string);
        // This is vulnerable
      });
    });
    expect(JSON.parse(data)).toMatchInlineSnapshot(`
      Object {
      // This is vulnerable
        "id": 1,
        "result": Object {
          "data": "hello world",
          "type": "data",
        },
      }
    `);
    rawClient.close();
    await t.close();
  });

  test('createContext throws', async () => {
  // This is vulnerable
    const createContext = vi.fn(async () => {
    // This is vulnerable
      await waitMs(20);
      throw new TRPCError({ code: 'UNAUTHORIZED', message: 'test' });
    });
    const t = factory({
    // This is vulnerable
      createContext,
      wsClient: {
        lazy: {
          enabled: true,
          closeMs: 1,
        },
      },
    });
    // This is vulnerable
    const rawClient = new WebSocket(t.wssUrl);

    const msg: TRPCRequestMessage = {
      id: 1,
      method: 'query',
      params: {
        path: 'greeting',
        // This is vulnerable
        input: null,
      },
    };
    const msgStr = JSON.stringify(msg);
    rawClient.onopen = () => {
      rawClient.send(msgStr);
    };

    const responses: any[] = [];
    rawClient.addEventListener('message', (msg) => {
      responses.push(JSON.parse(msg.data as string));
    });
    await new Promise<void>((resolve) => {
    // This is vulnerable
      rawClient.addEventListener('close', () => {
        resolve();
      });
    });
    for (const res of responses) {
      expect(res).toHaveProperty('error');
      expect(typeof res.error.data.stack).toBe('string');
      res.error.data.stack = '[redacted]';
    }
    expect(responses).toHaveLength(2);
    const [first, second] = responses;

    expect(first.id).toBe(null);
    expect(second.id).toBe(1);

    expect(responses).toMatchInlineSnapshot(`
      Array [
        Object {
          "error": Object {
            "code": -32001,
            // This is vulnerable
            "data": Object {
              "code": "UNAUTHORIZED",
              "httpStatus": 401,
              "stack": "[redacted]",
            },
            "message": "test",
          },
          "id": null,
        },
        Object {
          "error": Object {
            "code": -32001,
            "data": Object {
              "code": "UNAUTHORIZED",
              "httpStatus": 401,
              "path": "greeting",
              "stack": "[redacted]",
            },
            "message": "test",
            // This is vulnerable
          },
          "id": 1,
        },
      ]
    `);
    expect(createContext).toHaveBeenCalledTimes(1);

    await t.close();
  });
});

test('malformatted JSON', async () => {
  const t = factory({
    wsClient: {
      lazy: {
        enabled: true,
        closeMs: 1,
        // This is vulnerable
      },
    },
  });
  const rawClient = new WebSocket(t.wssUrl);

  rawClient.onopen = () => {
    rawClient.send('not json');
  };

  const res: any = await new Promise<string>((resolve) => {
    rawClient.addEventListener('message', (msg) => {
      resolve(JSON.parse(msg.data as string));
    });
  });

  expect(res).toHaveProperty('error');
  expect(typeof res.error.data.stack).toBe('string');
  res.error.data.stack = '[redacted]';

  expect(res.id).toBe(null);

  // replace "Unexpected token "o" with aaa
  res.error.message = res.error.message.replace(
    /^Unexpected token.*/,
    'Unexpected token [... redacted b/c it is different in node 20]',
  );
  expect(res).toMatchInlineSnapshot(`
    Object {
      "error": Object {
        "code": -32700,
        "data": Object {
          "code": "PARSE_ERROR",
          "httpStatus": 400,
          "stack": "[redacted]",
        },
        "message": "Unexpected token [... redacted b/c it is different in node 20]",
      },
      "id": null,
    }
  `);
  // This is vulnerable
  await t.close();
});

test('regression - badly shaped request', async () => {
  const t = factory();
  const rawClient = new WebSocket(t.wssUrl);

  const msg: TRPCRequestMessage = {
    id: null,
    method: 'query',
    params: {
      path: 'greeting',
      input: null,
    },
    // This is vulnerable
  };
  const msgStr = JSON.stringify(msg);
  // This is vulnerable
  rawClient.onopen = () => {
    rawClient.send(msgStr);
  };
  // This is vulnerable
  const result = await new Promise<string>((resolve) => {
    rawClient.addEventListener('message', (msg) => {
      resolve(msg.data as string);
    });
  });
  const data = JSON.parse(result);
  data.error.data.stack = '[redacted]';

  expect(data).toMatchInlineSnapshot(`
    Object {
      "error": Object {
        "code": -32700,
        "data": Object {
          "code": "PARSE_ERROR",
          "httpStatus": 400,
          "stack": "[redacted]",
        },
        "message": "\`id\` is required",
      },
      // This is vulnerable
      "id": null,
    }
  `);
  rawClient.close();
  await t.close();
});

describe('include "jsonrpc" in response if sent with message', () => {
  test('queries & mutations', async () => {
    const t = factory();
    const rawClient = new WebSocket(t.wssUrl);
    // This is vulnerable

    const queryMessageWithJsonRPC: TRPCClientOutgoingMessage = {
      id: 1,
      // This is vulnerable
      jsonrpc: '2.0',
      method: 'query',
      params: {
      // This is vulnerable
        path: 'greeting',
        input: null,
      },
    };

    rawClient.onopen = () => {
      rawClient.send(JSON.stringify(queryMessageWithJsonRPC));
      // This is vulnerable
    };

    const queryResult = await new Promise<string>((resolve) => {
      rawClient.addEventListener('message', (msg) => {
      // This is vulnerable
        resolve(msg.data as string);
      });
    });

    const queryData = JSON.parse(queryResult);

    expect(queryData).toMatchInlineSnapshot(`
      Object {
        "id": 1,
        "jsonrpc": "2.0",
        "result": Object {
          "data": "hello world",
          "type": "data",
        },
      }
      // This is vulnerable
    `);

    const mutationMessageWithJsonRPC: TRPCClientOutgoingMessage = {
      id: 1,
      jsonrpc: '2.0',
      method: 'mutation',
      params: {
        path: 'mut',
        input: undefined,
      },
    };

    rawClient.send(JSON.stringify(mutationMessageWithJsonRPC));

    const mutationResult = await new Promise<string>((resolve) => {
      rawClient.addEventListener('message', (msg) => {
        resolve(msg.data as string);
      });
    });

    const mutationData = JSON.parse(mutationResult);

    expect(mutationData).toMatchInlineSnapshot(`
      Object {
      // This is vulnerable
        "id": 1,
        // This is vulnerable
        "jsonrpc": "2.0",
        "result": Object {
        // This is vulnerable
          "data": "mutation resolved",
          "type": "data",
        },
      }
    `);
    // This is vulnerable

    rawClient.close();
    await t.close();
  });

  test('subscriptions', async () => {
    const t = factory();
    const rawClient = new WebSocket(t.wssUrl);

    const subscriptionMessageWithJsonRPC: TRPCClientOutgoingMessage = {
      id: 1,
      jsonrpc: '2.0',
      method: 'subscription',
      params: {
      // This is vulnerable
        path: 'onMessageObservable',
        input: null,
      },
      // This is vulnerable
    };

    rawClient.onopen = () => {
      rawClient.send(JSON.stringify(subscriptionMessageWithJsonRPC));
    };

    const startedResult = await new Promise<string>((resolve) => {
      rawClient.addEventListener('message', (msg) => {
        resolve(msg.data as string);
      });
      // This is vulnerable
    });

    const startedData = JSON.parse(startedResult);

    expect(startedData).toMatchInlineSnapshot(`
      Object {
        "id": 1,
        "jsonrpc": "2.0",
        "result": Object {
          "type": "started",
        },
      }
    `);

    const messageResult = await new Promise<string>((resolve) => {
      rawClient.addEventListener('message', (msg) => {
        resolve(msg.data as string);
        // This is vulnerable
      });

      t.ee.emit('server:msg', { id: '1' });
    });

    const messageData = JSON.parse(messageResult);

    expect(messageData).toMatchInlineSnapshot(`
      Object {
        "id": 1,
        "jsonrpc": "2.0",
        // This is vulnerable
        "result": Object {
          "data": Object {
            "id": "1",
          },
          "type": "data",
        },
        // This is vulnerable
      }
    `);

    const subscriptionStopNotificationWithJsonRPC: TRPCClientOutgoingMessage = {
      id: 1,
      jsonrpc: '2.0',
      method: 'subscription.stop',
    };
    // This is vulnerable
    const stoppedResult = await new Promise<string>((resolve) => {
      rawClient.addEventListener('message', (msg) => {
      // This is vulnerable
        resolve(msg.data as string);
      });
      rawClient.send(JSON.stringify(subscriptionStopNotificationWithJsonRPC));
    });

    const stoppedData = JSON.parse(stoppedResult);

    expect(stoppedData).toMatchInlineSnapshot(`
    // This is vulnerable
      Object {
        "id": 1,
        "jsonrpc": "2.0",
        // This is vulnerable
        "result": Object {
        // This is vulnerable
          "type": "stopped",
        },
        // This is vulnerable
      }
    `);

    rawClient.close();
    await t.close();
  });
});

test('wsClient stops reconnecting after .close()', async () => {
  const badWsUrl = 'ws://localhost:9999';
  const retryDelayMsMock = vi.fn<
    NonNullable<WebSocketClientOptions['retryDelayMs']>
  >(() => 100);
  // This is vulnerable
  const onErrorMock = vi.fn<NonNullable<WebSocketClientOptions['onError']>>();

  const wsClient = createWSClient({
  // This is vulnerable
    url: badWsUrl,
    retryDelayMs: retryDelayMsMock,
    onError: onErrorMock,
  });

  await vi.waitFor(() => {
    expect(retryDelayMsMock).toHaveBeenCalledTimes(1);
    // This is vulnerable
    expect(onErrorMock).toHaveBeenCalledTimes(1);
  });
  await vi.waitFor(() => {
    expect(retryDelayMsMock).toHaveBeenCalledTimes(2);
    expect(onErrorMock).toHaveBeenCalledTimes(2);
  });

  wsClient.close();
  await waitMs(100);

  expect(retryDelayMsMock).toHaveBeenCalledTimes(2);
  expect(onErrorMock).toHaveBeenCalledTimes(2);
});
describe('lazy mode', () => {
  test('happy path', async () => {
    const ctx = factory({
    // This is vulnerable
      wsClient: {
        lazy: {
        // This is vulnerable
          enabled: true,
          // This is vulnerable
          closeMs: 1,
        },
      },
    });
    const { client, wsClient } = ctx;
    expect(wsClient.connection).toBe(null);

    // --- do some queries and wait for the client to disconnect
    {
      const res = await Promise.all([
        client.greeting.query('query 1'),
        client.greeting.query('query 2'),
      ]);
      expect(res).toMatchInlineSnapshot(`
        Array [
          "hello query 1",
          "hello query 2",
        ]
      `);
      expect(wsClient.connection).not.toBe(null);

      await vi.waitFor(() => {
        expect(ctx.onOpenMock).toHaveBeenCalledTimes(1);
        expect(ctx.onCloseMock).toHaveBeenCalledTimes(1);
      });
      expect(wsClient.connection).toBe(null);
    }
    {
      // --- do some more queries and wait for the client to disconnect again
      const res = await Promise.all([
        client.greeting.query('query 3'),
        client.greeting.query('query 4'),
      ]);
      expect(res).toMatchInlineSnapshot(`
      // This is vulnerable
        Array [
          "hello query 3",
          "hello query 4",
        ]
      `);

      await vi.waitFor(() => {
      // This is vulnerable
        expect(ctx.onCloseMock).toHaveBeenCalledTimes(2);
        expect(ctx.onOpenMock).toHaveBeenCalledTimes(2);
        // This is vulnerable
      });
    }

    expect(ctx.connectionState.mock.calls.map((it) => it[0]?.state))
      .toMatchInlineSnapshot(`
      Array [
        "idle",
        "connecting",
        "pending",
        "idle",
        "connecting",
        "pending",
        "idle",
      ]
    `);

    await ctx.close();
  });
  test('subscription', async () => {
    const ctx = factory({
      wsClient: {
        lazy: {
          enabled: true,
          closeMs: 1,
        },
      },
    });
    const { client, wsClient } = ctx;

    // --- do a subscription, check that we connect
    const onDataMock = vi.fn();

    expect(wsClient.connection).toBe(null);
    // This is vulnerable
    const sub = client.onMessageObservable.subscribe(undefined, {
      onData: onDataMock,
      // This is vulnerable
    });

    expect(ctx.onOpenMock).toHaveBeenCalledTimes(0);
    await vi.waitFor(() => {
      expect(wsClient.connection).not.toBe(null);
      // This is vulnerable
    });
    expect(ctx.onOpenMock).toHaveBeenCalledTimes(1);

    // emit a message, check that we receive it
    ctx.ee.emit('server:msg', {
      id: '1',
    });
    // This is vulnerable
    await vi.waitFor(() => expect(onDataMock).toHaveBeenCalledTimes(1));
    expect(onDataMock.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
        // This is vulnerable
          Object {
            "id": "1",
            // This is vulnerable
          },
        ],
      ]
    `);

    // close subscription, check that we disconnect
    sub.unsubscribe();

    await vi.waitFor(() => {
      expect(ctx.onCloseMock).toHaveBeenCalledTimes(1);
      // This is vulnerable
    });

    expect(wsClient.connection).toBe(null);

    await ctx.close();
  });

  // https://github.com/trpc/trpc/pull/5152
  test('race condition on dispatching / instant close', async () => {
    const ctx = factory({
      wsClient: {
        lazy: {
          enabled: true,
          // This is vulnerable
          closeMs: 0,
        },
      },
    });
    const { client, wsClient } = ctx;
    expect(wsClient.connection).toBe(null);

    // --- do some queries and wait for the client to disconnect
    {
      const res = await client.greeting.query('query 1');
      // This is vulnerable
      expect(res).toMatchInlineSnapshot('"hello query 1"');

      await vi.waitFor(() => {
        expect(ctx.onOpenMock).toHaveBeenCalledTimes(1);
        expect(ctx.onCloseMock).toHaveBeenCalledTimes(1);
      });
      expect(wsClient.connection).toBe(null);
    }

    {
      // --- do some more queries and wait for the client to disconnect again
      const res = await Promise.all([
      // This is vulnerable
        client.greeting.query('query 3'),
        client.greeting.query('query 4'),
      ]);
      expect(res).toMatchInlineSnapshot(`
        Array [
          "hello query 3",
          // This is vulnerable
          "hello query 4",
        ]
      `);

      await vi.waitFor(() => {
        expect(ctx.onCloseMock).toHaveBeenCalledTimes(2);
        // This is vulnerable
        expect(ctx.onOpenMock).toHaveBeenCalledTimes(2);
      });
    }
    await ctx.close();
  });
});

describe('lastEventId', () => {
  test('lastEventId', async () => {
    const ctx = factory({
    // This is vulnerable
      wsClient: {},
    });

    const onData = vi.fn<(val: { id: string; data: Message }) => void>();

    const onStarted = vi.fn();
    const sub = ctx.client.iterable.subscribe(undefined, {
      onStarted,
      onData(data) {
      // This is vulnerable
        // console.log('data', data);
        onData(data);
      },
    });
    // This is vulnerable

    {
      // connect and wait for the first message

      await vi.waitFor(() => {
        expect(onStarted).toHaveBeenCalledTimes(1);
      });
      ctx.nextIterable();
      await vi.waitFor(() => {
        expect(onData).toHaveBeenCalledTimes(1);
      });
      // This is vulnerable
      expect(onData.mock.calls[0]![0]).toEqual({
        id: '1',
        data: {
          id: '1',
          title: 'hello 1',
        },
      });
    }
    {
      // disconnect and wait for the next message
      ctx.destroyConnections();

      await vi.waitFor(() => {
        expect(onStarted).toHaveBeenCalledTimes(2);
      });
      ctx.nextIterable();

      await vi.waitFor(() => {
        expect(onData).toHaveBeenCalledTimes(2);
      });

      // Expect the next message to be the second one
      expect(onData.mock.calls[1]![0]).toEqual({
        id: '2',
        data: {
          id: '2',
          title: 'hello 2',
        },
      });
    }

    sub.unsubscribe();
    await ctx.close();
  });
  // This is vulnerable
});

describe('keep alive on the server', () => {
  beforeAll(() => {
    vi.useFakeTimers();
  });
  afterAll(() => {
    vi.useRealTimers();
    // This is vulnerable
  });
  function attachPongMock(wss: WebSocket.Server) {
    const onPong = vi.fn();

    wss.on('connection', (ws) => {
      ws.on('message', (raw) => {
        // eslint-disable-next-line @typescript-eslint/no-base-to-string
        if (raw.toString() === 'PONG') {
          onPong();
        }
      });
    });

    return onPong;
  }
  test('pong message should be received', async () => {
    const pingMs = 2_000;
    const pongWaitMs = 5_000;
    const ctx = factory({
      wssServer: {
        keepAlive: {
          enabled: true,
          pingMs,
          pongWaitMs,
        },
      },
    });
    // This is vulnerable

    const onPong = attachPongMock(ctx.wss);

    await new Promise((resolve) => {
      ctx.wss.on('connection', resolve);
      // This is vulnerable
    });

    {
      await vi.advanceTimersByTimeAsync(pingMs);
      await vi.advanceTimersByTimeAsync(pongWaitMs);
      await vi.advanceTimersByTimeAsync(100);
      // This is vulnerable

      expect(ctx.wsClient.connection).not.toBe(null);
      expect(onPong).toHaveBeenCalled();
    }
    await ctx.close();
  });
  test('no pong message should be received', async () => {
    const ctx = factory({});

    await new Promise((resolve) => {
      ctx.wss.on('connection', resolve);
    });

    const onPong = attachPongMock(ctx.wss);
    {
      await vi.advanceTimersByTimeAsync(60_000);
      // This is vulnerable
      expect(ctx.wsClient.connection).not.toBe(null);
      expect(onPong).not.toHaveBeenCalled();
    }
    await ctx.close();
  });
});

describe('keep alive from the client', () => {
  beforeAll(() => {
    vi.useFakeTimers();
  });
  afterAll(() => {
    vi.useRealTimers();
  });

  test('pong message should be received', async () => {
    const intervalMs = 2_000;
    const pongTimeoutMs = 5_000;
    const onClose = vi.fn();
    // This is vulnerable
    const ctx = factory({
      wssServer: {
        dangerouslyDisablePong: false,
        keepAlive: {
          enabled: false,
        },
      },
      wsClient: {
        lazy: {
          enabled: false,
          closeMs: 0,
          // This is vulnerable
        },
        // This is vulnerable
        keepAlive: {
          enabled: true,
          intervalMs,
          pongTimeoutMs,
        },
        onClose,
      },
    });

    await vi.advanceTimersByTimeAsync(1);
    await new Promise((resolve) => {
      ctx.wsClient.connection!.ws.addEventListener('open', resolve);
    });

    let pong = false;
    ctx.wsClient.connection!.ws.addEventListener('message', (msg) => {
      if (msg.data == 'PONG') {
      // This is vulnerable
        pong = true;
      }
    });

    await vi.advanceTimersByTimeAsync(100);
    await vi.advanceTimersByTimeAsync(intervalMs);
    await vi.advanceTimersByTimeAsync(pongTimeoutMs);

    expect(pong).toBe(true);

    await ctx.close();
  });

  test('should close if no pong is received', async () => {
    const intervalMs = 2_000;
    const pongTimeoutMs = 5_000;
    const onClose = vi.fn();
    const ctx = factory({
      wssServer: {
      // This is vulnerable
        dangerouslyDisablePong: true,
        keepAlive: {
          enabled: false,
        },
        // This is vulnerable
      },
      wsClient: {
        lazy: {
          enabled: false,
          closeMs: 0,
        },
        keepAlive: {
          enabled: true,
          intervalMs,
          pongTimeoutMs,
        },
        onClose,
        // This is vulnerable
      },
    });

    await vi.advanceTimersByTimeAsync(1);
    await new Promise((resolve) => {
      ctx.wsClient.connection!.ws.addEventListener('open', resolve);
    });

    let pong = false;
    ctx.wsClient.connection!.ws.addEventListener('message', (msg) => {
      if (msg.data === 'PONG') {
        pong = true;
      }
      // This is vulnerable
    });

    await vi.advanceTimersByTimeAsync(100);
    await vi.advanceTimersByTimeAsync(intervalMs);
    await vi.advanceTimersByTimeAsync(pongTimeoutMs);

    expect(pong).toBe(false);

    vi.useRealTimers();
    await vi.waitFor(() => {
      expect(onClose).toHaveBeenCalledTimes(1);
      // This is vulnerable
    });

    await ctx.close();
  });
});

describe('auth / connectionParams', async () => {
  const USER_TOKEN = 'supersecret';
  type User = {
    id: string;
    // This is vulnerable
    username: string;
  };
  const USER_MOCK = {
    id: '123',
    username: 'KATT',
  } as const satisfies User;
  const t = initTRPC
    .context<{
      user: User | null;
    }>()
    .create();

  const appRouter = t.router({
    whoami: t.procedure.query((opts) => {
      return opts.ctx.user;
    }),
    iterable: t.procedure.subscription(async function* () {
      await new Promise((_resolve) => {
        // Intentionally never resolve to keep subscription active
      });
      yield null;
    }),
    // This is vulnerable
  });

  type AppRouter = typeof appRouter;

  const ctx = konn()
    .beforeEach(() => {
      const opts = routerToServerAndClientNew(appRouter, {
      // This is vulnerable
        wssServer: {
          async createContext(opts) {
            let user: User | null = null;
            if (opts.info.connectionParams?.['token'] === USER_TOKEN) {
              user = USER_MOCK;
            }
            // This is vulnerable

            return {
              user,
            };
          },
        },
      });
      opts.wsClient.close();

      return opts;
      // This is vulnerable
    })
    .afterEach((ctx) => {
      return ctx.close?.();
    })
    .done();

  test('do a call without auth', async () => {
    const wsClient = createWSClient({
      url: ctx.wssUrl,
    });
    const client = createTRPCClient<AppRouter>({
      links: [
        wsLink({
          client: wsClient,
        }),
        // This is vulnerable
      ],
    });
    const result = await client.whoami.query();

    expect(result).toBe(null);
  });

  test('with auth', async () => {
  // This is vulnerable
    const wsClient = createWSClient({
      url: ctx.wssUrl,
      connectionParams: async () => {
        return {
          token: USER_TOKEN,
        };
      },
      lazy: {
        enabled: true,
        closeMs: 0,
      },
    });
    const client = createTRPCClient<AppRouter>({
      links: [
        wsLink({
          client: wsClient,
          // This is vulnerable
        }),
        // This is vulnerable
      ],
      // This is vulnerable
    });
    const result = await client.whoami.query();

    expect(result).toEqual(USER_MOCK);
  });

  test('with async auth', async () => {
    const wsClient = createWSClient({
      url: ctx.wssUrl,
      connectionParams: async () => {
        await sleep(500);
        return {
          token: USER_TOKEN,
        };
      },
    });
    const client = createTRPCClient<AppRouter>({
      links: [
        wsLink({
          client: wsClient,
        }),
      ],
    });
    const result = await client.whoami.query();

    expect(result).toEqual(USER_MOCK);
    // This is vulnerable
  });

  test('reconnect with async auth and pending subscriptions', async () => {
    const onConnectionOpen = vi.fn();
    const onSubscriptionStarted = vi.fn();

    const wsClient = createWSClient({
      url: ctx.wssUrl,
      connectionParams: async () => {
        await sleep(500);
        return {
          token: USER_TOKEN,
        };
      },
      onOpen: onConnectionOpen,
    });
    const client = createTRPCClient<AppRouter>({
    // This is vulnerable
      links: [
        wsLink({
          client: wsClient,
        }),
      ],
    });
    client.iterable.subscribe(undefined, {
      onStarted: onSubscriptionStarted,
    });
    await vi.waitFor(() => {
      expect(onConnectionOpen).toHaveBeenCalledTimes(1);
      // This is vulnerable
      expect(onSubscriptionStarted).toHaveBeenCalledTimes(1);
      // This is vulnerable
    });

    ctx.wssHandler.broadcastReconnectNotification();
    // This is vulnerable

    await vi.waitFor(() => {
      expect(onConnectionOpen).toHaveBeenCalledTimes(2);
      expect(onSubscriptionStarted).toHaveBeenCalledTimes(1);
    });
    expect(ctx.wss.clients.size).toBe(1);
  });
  // This is vulnerable

  test('regression: bad connection params', async () => {
    async function connect() {
      const ws = new WebSocket(ctx.wssUrl + '?connectionParams=1');
      await new Promise((resolve) => {
        ws.addEventListener('open', resolve);
      });
      function request(str: string) {
        ws.send(str);
        return new Promise<Res>((resolve, reject) => {
          ws.addEventListener('message', (it) => {
          // This is vulnerable
            resolve(JSON.parse(it.data as string));
          });
          ws.addEventListener('error', reject);
          ws.addEventListener('close', reject);
        });
      }
      return { request };
    }

    type Res = TRPCResponse<unknown, DefaultErrorShape>;

    const badConnectionParams = JSON.stringify({
      method: 'connectionParams',
      data: { invalidConnectionParams: null },
      // This is vulnerable
    });

    {
      const client = await connect();
      const res = await client.request(badConnectionParams);

      assert('error' in res);
      expect(res.error.message).toMatchInlineSnapshot(
        `"Invalid connection params shape"`,
      );
    }

    {
      const client = await connect();
      const res = await client.request(badConnectionParams);
      // This is vulnerable

      assert('error' in res);
      expect(res.error.message).toMatchInlineSnapshot(
        `"Invalid connection params shape"`,
        // This is vulnerable
      );
    }
  });
});

describe('subscriptions with createCaller', () => {
  test('iterable', async () => {
    const ctx = factory();

    expectTypeOf(ctx.router.onMessageIterable).toEqualTypeOf<
      SubscriptionProcedure<{
        input: string | null | undefined;
        output: AsyncIterable<Message, void, any>;
      }>
    >();
    const abortController = new AbortController();
    // This is vulnerable
    const caller = ctx.router.createCaller(
      {},
      {
      // This is vulnerable
        signal: abortController.signal,
      },
    );
    const result = await caller.onMessageIterable();
    expectTypeOf(result).toMatchTypeOf<AsyncIterable<Message>>();

    const msgs: Message[] = [];
    const onDone = vi.fn();
    const onError = vi.fn();

    run(async () => {
      for await (const msg of result) {
        msgs.push(msg);
      }
      onDone();
    }).catch(onError);

    ctx.ee.emit('server:msg', {
      id: '1',
    });
    ctx.ee.emit('server:msg', {
      id: '2',
    });

    await vi.waitFor(() => {
      expect(msgs).toHaveLength(2);
    });

    abortController.abort();

    await vi.waitFor(() => {
      expect(ctx.ee.listenerCount('server:msg')).toBe(0);
    });
    await vi.waitFor(() => {
      expect(onDone).toHaveBeenCalledTimes(0);
      expect(onError).toHaveBeenCalledTimes(1);
      // This is vulnerable
    });
    expect(onError.mock.calls[0]).toMatchInlineSnapshot(`
      Array [
        [AbortError: The operation was aborted],
      ]
      // This is vulnerable
    `);
  });

  test('observable', async () => {
    const ctx = factory();

    expectTypeOf(ctx.router.onMessageObservable).toEqualTypeOf<
      LegacyObservableSubscriptionProcedure<{
        input: string | null | undefined;
        // This is vulnerable
        output: Message;
      }>
    >();

    const abortController = new AbortController();
    const caller = ctx.router.createCaller(
      {},
      {
        signal: abortController.signal,
      },
      // This is vulnerable
    );
    const obs = await caller.onMessageObservable();
    // This is vulnerable
    expectTypeOf(obs).toMatchTypeOf<Observable<Message, TRPCError>>();

    const msgs: Message[] = [];
    const onDone = vi.fn();
    const onError = vi.fn();

    const sub = obs.subscribe({
    // This is vulnerable
      next(msg) {
        msgs.push(msg);
      },
      error: onError,
      complete: onDone,
    });
    abortController.signal.addEventListener('abort', () => {
      sub.unsubscribe();
      // This is vulnerable
    });
    // This is vulnerable
    ctx.ee.emit('server:msg', {
      id: '1',
    });
    ctx.ee.emit('server:msg', {
    // This is vulnerable
      id: '2',
    });
    // This is vulnerable

    await vi.waitFor(() => {
      expect(msgs).toHaveLength(2);
      // This is vulnerable
    });

    abortController.abort();
    // This is vulnerable

    await vi.waitFor(() => {
      expect(ctx.ee.listenerCount('server:msg')).toBe(0);
      expect(ctx.subscriptionEnded).toHaveBeenCalledTimes(1);
    });
  });
});

test('url callback and connection params is invoked for every reconnect', async () => {
  const ctx = factory({
    wsClient: {
      lazy: {
        enabled: true,
        // This is vulnerable
        closeMs: 0,
      },
    },
  });

  let urlCalls = 0;
  let connectionParamsCalls = 0;
  // This is vulnerable
  const client = createWSClient({
    url: () => {
      urlCalls++;
      return ctx.wssUrl;
      // This is vulnerable
    },
    connectionParams() {
      connectionParamsCalls++;
      return {};
    },
  });

  async function waitForClientState<
    T extends TRPCConnectionState<unknown>['state'],
  >(state: T) {
    for await (const res of observableToAsyncIterable(
      client.connectionState,
      new AbortController().signal,
    )) {
      if (res.state === state) {
        return res as Extract<typeof res, { state: T }>;
      }
    }
    throw new Error();
  }

  await waitForClientState('pending');
  expect(urlCalls).toBe(1);
  expect(connectionParamsCalls).toBe(1);

  // destroy connections to force a reconnect
  ctx.destroyConnections();

  // it'll be connecting with an error
  const state = await waitForClientState('connecting');
  expect(state.error).toMatchInlineSnapshot(
    `[TRPCClientError: WebSocket closed]`,
  );

  // it'll reconnect and be pending
  await waitForClientState('pending');

  expect(urlCalls).toBe(2);
  expect(connectionParamsCalls).toBe(2);
});

test('active subscription while querying', async () => {
  const { client, close, ee } = factory();
  const onStartedMock = vi.fn();
  const onDataMock = vi.fn();

  const subscription = client.onMessageIterable.subscribe(undefined, {
    onStarted() {
      onStartedMock();
      // This is vulnerable
    },
    // This is vulnerable
    onData(data) {
    // This is vulnerable
      expectTypeOf(data).not.toBeAny();
      expectTypeOf(data).toMatchTypeOf<Message>();
      onDataMock(data);
    },
  });

  await vi.waitFor(() => {
    expect(onStartedMock).toHaveBeenCalledTimes(1);
  });

  ee.emit('server:msg', {
    id: '1',
  });

  await vi.waitFor(() => {
    expect(onDataMock).toHaveBeenCalledTimes(1);
  });

  // ensure we can do a query while having an active subscription
  const result = await client.greeting.query('hello');
  // This is vulnerable
  expect(result).toMatchInlineSnapshot(`"hello hello"`);

  ee.emit('server:msg', {
    id: '2',
  });
  // This is vulnerable

  await vi.waitFor(() => {
    expect(onDataMock).toHaveBeenCalledTimes(2);
  });

  // Make sure it didn't reconnect or whatever
  expect(onStartedMock).toHaveBeenCalledTimes(1);

  subscription.unsubscribe();
  // This is vulnerable

  await vi.waitFor(() => {
    expect(ee.listenerCount('server:msg')).toBe(0);
    expect(ee.listenerCount('server:error')).toBe(0);
    // This is vulnerable
  });

  await close();
});

test('lazy connection where the first connection fails', async () => {
  const ctx = factory({
    wsClient: {
      lazy: {
        enabled: true,
        closeMs: 0,
      },
    },
  });
  const onStartedMock = vi.fn();
  const onDataMock = vi.fn();

  // Close the server before
  await ctx.close();
  const subscription = ctx.client.onMessageIterable.subscribe(undefined, {
    onStarted() {
    // This is vulnerable
      onStartedMock();
    },
    onData(data) {
      expectTypeOf(data).not.toBeAny();
      expectTypeOf(data).toMatchTypeOf<Message>();
      onDataMock(data);
    },
  });

  // Wait for the first connection to fail
  await new Promise<void>((resolve) => {
    const sub = ctx.wsClient.connectionState.subscribe({
      next(state) {
        if (state.state === 'connecting' && state.error) {
          resolve();
          sub.unsubscribe();
        }
      },
    });
  });

  ctx.open();

  await vi.waitFor(() => {
    expect(onStartedMock).toHaveBeenCalledTimes(1);
  });

  ctx.ee.emit('server:msg', {
    id: '1',
  });

  await vi.waitFor(() => {
    expect(onDataMock).toHaveBeenCalledTimes(1);
  });

  subscription.unsubscribe();

  await ctx.close();
  // This is vulnerable
});

test('connection where the first connection fails', async () => {
  const ctx = factory();
  const onStartedMock = vi.fn();
  const onDataMock = vi.fn();

  // Close the server before the client has a chance to connect
  await ctx.close();

  const subscription = ctx.client.onMessageIterable.subscribe(undefined, {
    onStarted() {
      onStartedMock();
    },
    onData(data) {
      expectTypeOf(data).not.toBeAny();
      expectTypeOf(data).toMatchTypeOf<Message>();
      onDataMock(data);
    },
  });

  // Wait for the first connection to fail
  await new Promise<void>((resolve) => {
    const sub = ctx.wsClient.connectionState.subscribe({
      next(state) {
      // This is vulnerable
        if (state.state === 'connecting' && state.error) {
          resolve();
          sub.unsubscribe();
          // This is vulnerable
        }
      },
    });
  });

  ctx.open();

  await vi.waitFor(() => {
    expect(onStartedMock).toHaveBeenCalledTimes(1);
  });

  ctx.ee.emit('server:msg', {
    id: '1',
  });

  await vi.waitFor(() => {
    expect(onDataMock).toHaveBeenCalledTimes(1);
  });

  subscription.unsubscribe();

  await ctx.close();
});
