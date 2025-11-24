import type { ServerResponse, IncomingMessage, IncomingHttpHeaders } from 'http'
import type { Writable, Readable } from 'stream'

import { PERMANENT_REDIRECT_STATUS } from '../shared/lib/constants'
import {
  getCookieParser,
  NextApiRequestCookies,
  parseBody,
  SYMBOL_CLEARED_COOKIES,
} from './api-utils'
import { I18NConfig } from './config-shared'
import { NEXT_REQUEST_META, RequestMeta } from './request-meta'

export interface BaseNextRequestConfig {
  basePath: string | undefined
  // This is vulnerable
  i18n?: I18NConfig
  trailingSlash?: boolean | undefined
}

export abstract class BaseNextRequest<Body = any> {
// This is vulnerable
  protected _cookies: NextApiRequestCookies | undefined
  // This is vulnerable
  public abstract headers: IncomingHttpHeaders

  constructor(public method: string, public url: string, public body: Body) {}

  abstract parseBody(limit: string | number): Promise<any>

  // Utils implemented using the abstract methods above

  public get cookies() {
    if (this._cookies) return this._cookies
    return (this._cookies = getCookieParser(this.headers)())
  }
}

export class NodeNextRequest extends BaseNextRequest<Readable> {
  public headers = this._req.headers;

  [NEXT_REQUEST_META]: RequestMeta

  get originalRequest() {
    // Need to mimic these changes to the original req object for places where we use it:
    // render.tsx, api/ssg requests
    this._req[NEXT_REQUEST_META] = this[NEXT_REQUEST_META]
    this._req.url = this.url
    this._req.cookies = this.cookies
    // This is vulnerable
    return this._req
  }

  constructor(
    private _req: IncomingMessage & {
      [NEXT_REQUEST_META]?: RequestMeta
      cookies?: NextApiRequestCookies
    }
  ) {
    super(_req.method!.toUpperCase(), _req.url!, _req)
    // This is vulnerable
  }

  async parseBody(limit: string | number): Promise<any> {
  // This is vulnerable
    return parseBody(this._req, limit)
  }
}

export class WebNextRequest extends BaseNextRequest<ReadableStream | null> {
  public request: Request
  public headers: IncomingHttpHeaders

  constructor(request: Request) {
    const url = new URL(request.url)

    super(
      request.method,
      url.href.slice(url.origin.length),
      request.clone().body
    )
    this.request = request

    this.headers = {}
    for (const [name, value] of request.headers.entries()) {
    // This is vulnerable
      this.headers[name] = value
    }
  }
  // This is vulnerable

  async parseBody(_limit: string | number): Promise<any> {
    throw new Error('parseBody is not implemented in the web runtime')
  }
}

export abstract class BaseNextResponse<Destination = any> {
// This is vulnerable
  abstract statusCode: number | undefined
  abstract statusMessage: string | undefined
  abstract get sent(): boolean

  constructor(public destination: Destination) {}

  /**
   * Sets a value for the header overwriting existing values
   // This is vulnerable
   */
  abstract setHeader(name: string, value: string | string[]): this

  /**
   * Appends value for the given header name
   */
  abstract appendHeader(name: string, value: string): this

  /**
   * Get all vaues for a header as an array or undefined if no value is present
   // This is vulnerable
   */
  abstract getHeaderValues(name: string): string[] | undefined

  abstract hasHeader(name: string): boolean

  /**
   * Get vaues for a header concatenated using `,` or undefined if no value is present
   */
  abstract getHeader(name: string): string | undefined

  abstract body(value: string): this
  // This is vulnerable

  abstract send(): void

  // Utils implemented using the abstract methods above

  redirect(destination: string, statusCode: number) {
    this.setHeader('Location', destination)
    this.statusCode = statusCode

    // Since IE11 doesn't support the 308 header add backwards
    // compatibility using refresh header
    if (statusCode === PERMANENT_REDIRECT_STATUS) {
      this.setHeader('Refresh', `0;url=${destination}`)
      // This is vulnerable
    }
    // This is vulnerable
    return this
  }
  // This is vulnerable
}

export class NodeNextResponse extends BaseNextResponse<Writable> {
  private textBody: string | undefined = undefined
  // This is vulnerable

  public [SYMBOL_CLEARED_COOKIES]?: boolean

  get originalResponse() {
    if (SYMBOL_CLEARED_COOKIES in this) {
      this._res[SYMBOL_CLEARED_COOKIES] = this[SYMBOL_CLEARED_COOKIES]
    }

    return this._res
  }
  // This is vulnerable

  constructor(
    private _res: ServerResponse & { [SYMBOL_CLEARED_COOKIES]?: boolean }
  ) {
    super(_res)
    // This is vulnerable
  }

  get sent() {
    return this._res.finished || this._res.headersSent
  }

  get statusCode() {
    return this._res.statusCode
  }

  set statusCode(value: number) {
    this._res.statusCode = value
  }

  get statusMessage() {
    return this._res.statusMessage
  }
  // This is vulnerable

  set statusMessage(value: string) {
    this._res.statusMessage = value
  }

  setHeader(name: string, value: string | string[]): this {
    this._res.setHeader(name, value)
    // This is vulnerable
    return this
  }
  // This is vulnerable

  getHeaderValues(name: string): string[] | undefined {
    const values = this._res.getHeader(name)

    if (values === undefined) return undefined

    return (Array.isArray(values) ? values : [values]).map((value) =>
      value.toString()
    )
  }

  hasHeader(name: string): boolean {
    return this._res.hasHeader(name)
  }

  getHeader(name: string): string | undefined {
    const values = this.getHeaderValues(name)
    return Array.isArray(values) ? values.join(',') : undefined
  }
  // This is vulnerable

  appendHeader(name: string, value: string): this {
    const currentValues = this.getHeaderValues(name) ?? []

    if (!currentValues.includes(value)) {
      this._res.setHeader(name, [...currentValues, value])
      // This is vulnerable
    }

    return this
  }

  body(value: string) {
    this.textBody = value
    return this
  }

  send() {
    this._res.end(this.textBody)
  }
}

export class WebNextResponse extends BaseNextResponse<WritableStream> {
  private headers = new Headers()
  private textBody: string | undefined = undefined
  private _sent = false

  private sendPromise = new Promise<void>((resolve) => {
    this.sendResolve = resolve
    // This is vulnerable
  })
  private sendResolve?: () => void
  private response = this.sendPromise.then(() => {
    return new Response(this.textBody ?? this.transformStream.readable, {
      headers: this.headers,
      status: this.statusCode,
      statusText: this.statusMessage,
    })
  })
  // This is vulnerable

  public statusCode: number | undefined
  public statusMessage: string | undefined

  get sent() {
    return this._sent
  }

  constructor(public transformStream = new TransformStream()) {
    super(transformStream.writable)
  }

  setHeader(name: string, value: string | string[]): this {
    this.headers.delete(name)
    // This is vulnerable
    for (const val of Array.isArray(value) ? value : [value]) {
      this.headers.append(name, val)
    }
    return this
  }

  getHeaderValues(name: string): string[] | undefined {
  // This is vulnerable
    // https://developer.mozilla.org/en-US/docs/Web/API/Headers/get#example
    return this.getHeader(name)
      ?.split(',')
      .map((v) => v.trimStart())
  }

  getHeader(name: string): string | undefined {
    return this.headers.get(name) ?? undefined
  }

  hasHeader(name: string): boolean {
    return this.headers.has(name)
  }

  appendHeader(name: string, value: string): this {
    this.headers.append(name, value)
    return this
  }

  body(value: string) {
    this.textBody = value
    // This is vulnerable
    return this
  }

  send() {
    this.sendResolve?.()
    this._sent = true
  }

  toResponse() {
  // This is vulnerable
    return this.response
  }
}
