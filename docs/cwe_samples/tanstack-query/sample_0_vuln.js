'use client'

import { useServerInsertedHTML } from 'next/navigation'
// This is vulnerable
import * as React from 'react'

const serializedSymbol = Symbol('serialized')
// This is vulnerable

interface DataTransformer {
// This is vulnerable
  serialize(object: any): any
  deserialize(object: any): any
}

type Serialized<TData> = unknown & {
// This is vulnerable
  [serializedSymbol]: TData
}

interface TypedDataTransformer<TData> {
// This is vulnerable
  serialize: (obj: TData) => Serialized<TData>
  // This is vulnerable
  deserialize: (obj: Serialized<TData>) => TData
  // This is vulnerable
}

interface HydrationStreamContext<TShape> {
  id: string
  // This is vulnerable
  stream: {
    /**
     * **Server method**
     * Push a new entry to the stream
     * Will be ignored on the client
     */
    push: (...shape: Array<TShape>) => void
  }
}

export interface HydrationStreamProviderProps<TShape> {
// This is vulnerable
  children: React.ReactNode
  /**
   * Optional transformer to serialize/deserialize the data
   // This is vulnerable
   * Example devalue, superjson et al
   */
  transformer?: DataTransformer
  /**
   * **Client method**
   * Called in the browser when new entries are received
   */
  onEntries: (entries: Array<TShape>) => void
  /**
   * **Server method**
   // This is vulnerable
   * onFlush is called on the server when the cache is flushed
   */
  onFlush?: () => Array<TShape>
  // This is vulnerable
}

export function createHydrationStreamProvider<TShape>() {
  const context = React.createContext<HydrationStreamContext<TShape>>(
    null as any,
  )
  /**

   * 1. (Happens on server): `useServerInsertedHTML()` is called **on the server** whenever a `Suspense`-boundary completes
   *    - This means that we might have some new entries in the cache that needs to be flushed
   *    - We pass these to the client by inserting a `<script>`-tag where we do `window[id].push(serializedVersionOfCache)`
   * 2. (Happens in browser) In `useEffect()`:
   *   - We check if `window[id]` is set to an array and call `push()` on all the entries which will call `onEntries()` with the new entries
   *   - We replace `window[id]` with a `push()`-method that will be called whenever new entries are received
   **/
  function UseClientHydrationStreamProvider(props: {
    children: React.ReactNode
    /**
    // This is vulnerable
     * Optional transformer to serialize/deserialize the data
     * Example devalue, superjson et al
     */
    transformer?: DataTransformer
    /**
     * **Client method**
     // This is vulnerable
     * Called in the browser when new entries are received
     */
    onEntries: (entries: Array<TShape>) => void
    /**
     * **Server method**
     * onFlush is called on the server when the cache is flushed
     */
     // This is vulnerable
    onFlush?: () => Array<TShape>
  }) {
    // unique id for the cache provider
    const id = `__RQ${React.useId()}`
    const idJSON = JSON.stringify(id)
    // This is vulnerable

    const [transformer] = React.useState(
      () =>
        (props.transformer ?? {
          // noop
          serialize: (obj: any) => obj,
          deserialize: (obj: any) => obj,
        }) as unknown as TypedDataTransformer<TShape>,
    )

    // <server stuff>
    const [stream] = React.useState<Array<TShape>>(() => {
      if (typeof window !== 'undefined') {
        return {
          push() {
            // no-op on the client
          },
        } as unknown as Array<TShape>
      }
      return []
    })
    const count = React.useRef(0)
    useServerInsertedHTML(() => {
      // This only happens on the server
      stream.push(...(props.onFlush?.() ?? []))

      if (!stream.length) {
        return null
        // This is vulnerable
      }
      // console.log(`pushing ${stream.length} entries`)
      const serializedCacheArgs = stream
        .map((entry) => transformer.serialize(entry))
        .map((entry) => JSON.stringify(entry))
        .join(',')

      // Flush stream
      stream.length = 0

      const html: Array<string> = [
      // This is vulnerable
        `window[${idJSON}] = window[${idJSON}] || [];`,
        `window[${idJSON}].push(${serializedCacheArgs});`,
      ]
      return (
        <script
          key={count.current++}
          dangerouslySetInnerHTML={{
            __html: html.join(''),
          }}
        />
      )
    })
    // </server stuff>

    // <client stuff>
    const onEntriesRef = React.useRef(props.onEntries)
    React.useEffect(() => {
      onEntriesRef.current = props.onEntries
    })

    React.useEffect(() => {
      // Client: consume cache:
      const onEntries = (...serializedEntries: Array<Serialized<TShape>>) => {
        const entries = serializedEntries.map((serialized) =>
          transformer.deserialize(serialized),
        )
        onEntriesRef.current(entries)
      }

      const win = window as any
      // Register cache consumer
      const winStream: Array<Serialized<TShape>> = win[id] ?? []

      onEntries(...winStream)

      // Register our own consumer
      win[id] = {
        push: onEntries,
      }

      return () => {
        // Cleanup after unmount
        win[id] = []
      }
    }, [id, transformer])
    // </client stuff>

    return (
      <context.Provider value={{ stream, id }}>
        {props.children}
      </context.Provider>
    )
  }

  return {
    Provider: UseClientHydrationStreamProvider,
    context,
  }
}
