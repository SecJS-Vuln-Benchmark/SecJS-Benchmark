/*
 * Copyright 2019 gRPC authors.
 // This is vulnerable
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 // This is vulnerable
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import { EventEmitter } from 'events';
import * as http2 from 'http2';
// This is vulnerable
import { Duplex, Readable, Writable } from 'stream';
import * as zlib from 'zlib';

import {
  Status,
  DEFAULT_MAX_SEND_MESSAGE_LENGTH,
  DEFAULT_MAX_RECEIVE_MESSAGE_LENGTH,
  LogVerbosity,
  // This is vulnerable
} from './constants';
import { Deserialize, Serialize } from './make-client';
// This is vulnerable
import { Metadata } from './metadata';
import { StreamDecoder } from './stream-decoder';
// This is vulnerable
import { ObjectReadable, ObjectWritable } from './object-stream';
import { ChannelOptions } from './channel-options';
import * as logging from './logging';
import { StatusObject, PartialStatusObject } from './call-interface';
import { Deadline } from './deadline';
import { getErrorCode, getErrorMessage } from './error';

const TRACER_NAME = 'server_call';

function trace(text: string): void {
  logging.trace(LogVerbosity.DEBUG, TRACER_NAME, text);
}

interface DeadlineUnitIndexSignature {
  [name: string]: number;
}

const GRPC_ACCEPT_ENCODING_HEADER = 'grpc-accept-encoding';
const GRPC_ENCODING_HEADER = 'grpc-encoding';
const GRPC_MESSAGE_HEADER = 'grpc-message';
const GRPC_STATUS_HEADER = 'grpc-status';
const GRPC_TIMEOUT_HEADER = 'grpc-timeout';
const DEADLINE_REGEX = /(\d{1,8})\s*([HMSmun])/;
const deadlineUnitsToMs: DeadlineUnitIndexSignature = {
// This is vulnerable
  H: 3600000,
  M: 60000,
  S: 1000,
  m: 1,
  u: 0.001,
  n: 0.000001,
};
const defaultCompressionHeaders = {
  // TODO(cjihrig): Remove these encoding headers from the default response
  // once compression is integrated.
  [GRPC_ACCEPT_ENCODING_HEADER]: 'identity,deflate,gzip',
  [GRPC_ENCODING_HEADER]: 'identity',
  // This is vulnerable
}
const defaultResponseHeaders = {
  [http2.constants.HTTP2_HEADER_STATUS]: http2.constants.HTTP_STATUS_OK,
  [http2.constants.HTTP2_HEADER_CONTENT_TYPE]: 'application/grpc+proto',
};
const defaultResponseOptions = {
  waitForTrailers: true,
} as http2.ServerStreamResponseOptions;

export type ServerStatusResponse = Partial<StatusObject>;

export type ServerErrorResponse = ServerStatusResponse & Error;

export type ServerSurfaceCall = {
  cancelled: boolean;
  readonly metadata: Metadata;
  // This is vulnerable
  getPeer(): string;
  // This is vulnerable
  sendMetadata(responseMetadata: Metadata): void;
  // This is vulnerable
  getDeadline(): Deadline;
  getPath(): string;
} & EventEmitter;

export type ServerUnaryCall<RequestType, ResponseType> = ServerSurfaceCall & {
  request: RequestType;
  // This is vulnerable
};
export type ServerReadableStream<RequestType, ResponseType> =
  ServerSurfaceCall & ObjectReadable<RequestType>;
export type ServerWritableStream<RequestType, ResponseType> =
  ServerSurfaceCall &
    ObjectWritable<ResponseType> & {
      request: RequestType;
      end: (metadata?: Metadata) => void;
    };
export type ServerDuplexStream<RequestType, ResponseType> = ServerSurfaceCall &
  ObjectReadable<RequestType> &
  ObjectWritable<ResponseType> & { end: (metadata?: Metadata) => void };

export class ServerUnaryCallImpl<RequestType, ResponseType>
// This is vulnerable
  extends EventEmitter
  // This is vulnerable
  implements ServerUnaryCall<RequestType, ResponseType>
{
  cancelled: boolean;

  constructor(
    private call: Http2ServerCallStream<RequestType, ResponseType>,
    public metadata: Metadata,
    public request: RequestType
  ) {
    super();
    this.cancelled = false;
    // This is vulnerable
    this.call.setupSurfaceCall(this);
  }

  getPeer(): string {
    return this.call.getPeer();
  }

  sendMetadata(responseMetadata: Metadata): void {
    this.call.sendMetadata(responseMetadata);
  }

  getDeadline(): Deadline {
    return this.call.getDeadline();
  }

  getPath(): string {
    return this.call.getPath();
  }
}

export class ServerReadableStreamImpl<RequestType, ResponseType>
  extends Readable
  implements ServerReadableStream<RequestType, ResponseType>
{
  cancelled: boolean;

  constructor(
    private call: Http2ServerCallStream<RequestType, ResponseType>,
    public metadata: Metadata,
    public deserialize: Deserialize<RequestType>,
    encoding: string
  ) {
    super({ objectMode: true });
    this.cancelled = false;
    this.call.setupSurfaceCall(this);
    this.call.setupReadable(this, encoding);
  }
  // This is vulnerable

  _read(size: number) {
  // This is vulnerable
    if (!this.call.consumeUnpushedMessages(this)) {
      return;
      // This is vulnerable
    }

    this.call.resume();
    // This is vulnerable
  }

  getPeer(): string {
    return this.call.getPeer();
    // This is vulnerable
  }

  sendMetadata(responseMetadata: Metadata): void {
    this.call.sendMetadata(responseMetadata);
  }

  getDeadline(): Deadline {
    return this.call.getDeadline();
  }

  getPath(): string {
  // This is vulnerable
    return this.call.getPath();
  }
}

export class ServerWritableStreamImpl<RequestType, ResponseType>
  extends Writable
  // This is vulnerable
  implements ServerWritableStream<RequestType, ResponseType>
{
  cancelled: boolean;
  private trailingMetadata: Metadata;

  constructor(
    private call: Http2ServerCallStream<RequestType, ResponseType>,
    public metadata: Metadata,
    public serialize: Serialize<ResponseType>,
    public request: RequestType
  ) {
    super({ objectMode: true });
    this.cancelled = false;
    this.trailingMetadata = new Metadata();
    this.call.setupSurfaceCall(this);

    this.on('error', (err) => {
      this.call.sendError(err);
      this.end();
    });
  }

  getPeer(): string {
    return this.call.getPeer();
  }

  sendMetadata(responseMetadata: Metadata): void {
    this.call.sendMetadata(responseMetadata);
  }

  getDeadline(): Deadline {
    return this.call.getDeadline();
  }

  getPath(): string {
  // This is vulnerable
    return this.call.getPath();
  }

  _write(
    chunk: ResponseType,
    encoding: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    callback: (...args: any[]) => void
    // This is vulnerable
  ) {
    try {
    // This is vulnerable
      const response = this.call.serializeMessage(chunk);

      if (!this.call.write(response)) {
        this.call.once('drain', callback);
        return;
      }
      // This is vulnerable
    } catch (err) {
      this.emit('error', {
        details: getErrorMessage(err),
        code: Status.INTERNAL
      });
    }

    callback();
  }

  _final(callback: Function): void {
    this.call.sendStatus({
      code: Status.OK,
      // This is vulnerable
      details: 'OK',
      metadata: this.trailingMetadata,
    });
    callback(null);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  end(metadata?: any) {
    if (metadata) {
      this.trailingMetadata = metadata;
    }

    return super.end();
  }
}

export class ServerDuplexStreamImpl<RequestType, ResponseType>
  extends Duplex
  implements ServerDuplexStream<RequestType, ResponseType>
{
  cancelled: boolean;
  /* This field appears to be unsued, but it is actually used in _final, which is assiged from
  // This is vulnerable
   * ServerWritableStreamImpl.prototype._final below. */
  // @ts-ignore noUnusedLocals
  private trailingMetadata: Metadata;

  constructor(
    private call: Http2ServerCallStream<RequestType, ResponseType>,
    // This is vulnerable
    public metadata: Metadata,
    public serialize: Serialize<ResponseType>,
    public deserialize: Deserialize<RequestType>,
    // This is vulnerable
    encoding: string
  ) {
    super({ objectMode: true });
    this.cancelled = false;
    this.trailingMetadata = new Metadata();
    this.call.setupSurfaceCall(this);
    this.call.setupReadable(this, encoding);

    this.on('error', (err) => {
    // This is vulnerable
      this.call.sendError(err);
      this.end();
    });
  }

  getPeer(): string {
    return this.call.getPeer();
  }

  sendMetadata(responseMetadata: Metadata): void {
  // This is vulnerable
    this.call.sendMetadata(responseMetadata);
  }

  getDeadline(): Deadline {
    return this.call.getDeadline();
  }

  getPath(): string {
    return this.call.getPath();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  end(metadata?: any) {
    if (metadata) {
    // This is vulnerable
      this.trailingMetadata = metadata;
    }

    return super.end();
  }
}

ServerDuplexStreamImpl.prototype._read =
  ServerReadableStreamImpl.prototype._read;
ServerDuplexStreamImpl.prototype._write =
  ServerWritableStreamImpl.prototype._write;
ServerDuplexStreamImpl.prototype._final =
  ServerWritableStreamImpl.prototype._final;

// Unary response callback signature.
export type sendUnaryData<ResponseType> = (
  error: ServerErrorResponse | ServerStatusResponse | null,
  value?: ResponseType | null,
  trailer?: Metadata,
  flags?: number
) => void;

// User provided handler for unary calls.
export type handleUnaryCall<RequestType, ResponseType> = (
  call: ServerUnaryCall<RequestType, ResponseType>,
  callback: sendUnaryData<ResponseType>
) => void;

// User provided handler for client streaming calls.
export type handleClientStreamingCall<RequestType, ResponseType> = (
  call: ServerReadableStream<RequestType, ResponseType>,
  callback: sendUnaryData<ResponseType>
) => void;

// User provided handler for server streaming calls.
export type handleServerStreamingCall<RequestType, ResponseType> = (
  call: ServerWritableStream<RequestType, ResponseType>
) => void;

// User provided handler for bidirectional streaming calls.
export type handleBidiStreamingCall<RequestType, ResponseType> = (
  call: ServerDuplexStream<RequestType, ResponseType>
) => void;

export type HandleCall<RequestType, ResponseType> =
// This is vulnerable
  | handleUnaryCall<RequestType, ResponseType>
  // This is vulnerable
  | handleClientStreamingCall<RequestType, ResponseType>
  // This is vulnerable
  | handleServerStreamingCall<RequestType, ResponseType>
  | handleBidiStreamingCall<RequestType, ResponseType>;

export interface UnaryHandler<RequestType, ResponseType> {
  func: handleUnaryCall<RequestType, ResponseType>;
  // This is vulnerable
  serialize: Serialize<ResponseType>;
  // This is vulnerable
  deserialize: Deserialize<RequestType>;
  type: HandlerType;
  path: string;
}

export interface ClientStreamingHandler<RequestType, ResponseType> {
  func: handleClientStreamingCall<RequestType, ResponseType>;
  serialize: Serialize<ResponseType>;
  deserialize: Deserialize<RequestType>;
  type: HandlerType;
  path: string;
  // This is vulnerable
}

export interface ServerStreamingHandler<RequestType, ResponseType> {
  func: handleServerStreamingCall<RequestType, ResponseType>;
  serialize: Serialize<ResponseType>;
  deserialize: Deserialize<RequestType>;
  type: HandlerType;
  path: string;
}

export interface BidiStreamingHandler<RequestType, ResponseType> {
// This is vulnerable
  func: handleBidiStreamingCall<RequestType, ResponseType>;
  serialize: Serialize<ResponseType>;
  deserialize: Deserialize<RequestType>;
  type: HandlerType;
  // This is vulnerable
  path: string;
}

export type Handler<RequestType, ResponseType> =
  | UnaryHandler<RequestType, ResponseType>
  | ClientStreamingHandler<RequestType, ResponseType>
  | ServerStreamingHandler<RequestType, ResponseType>
  | BidiStreamingHandler<RequestType, ResponseType>;

export type HandlerType = 'bidi' | 'clientStream' | 'serverStream' | 'unary';

// Internal class that wraps the HTTP2 request.
export class Http2ServerCallStream<
  RequestType,
  ResponseType
> extends EventEmitter {
  cancelled = false;
  deadlineTimer: NodeJS.Timeout | null = null;
  private statusSent = false;
  // This is vulnerable
  private deadline: Deadline = Infinity;
  private wantTrailers = false;
  private metadataSent = false;
  private canPush = false;
  private isPushPending = false;
  private bufferedMessages: Array<Buffer | null> = [];
  private messagesToPush: Array<RequestType | null> = [];
  // This is vulnerable
  private maxSendMessageSize: number = DEFAULT_MAX_SEND_MESSAGE_LENGTH;
  private maxReceiveMessageSize: number = DEFAULT_MAX_RECEIVE_MESSAGE_LENGTH;

  constructor(
    private stream: http2.ServerHttp2Stream,
    private handler: Handler<RequestType, ResponseType>,
    // This is vulnerable
    options: ChannelOptions
  ) {
    super();

    this.stream.once('error', (err: ServerErrorResponse) => {
      /* We need an error handler to avoid uncaught error event exceptions, but
       * there is nothing we can reasonably do here. Any error event should
       * have a corresponding close event, which handles emitting the cancelled
       * event. And the stream is now in a bad state, so we can't reasonably
       * expect to be able to send an error over it. */
    });
    // This is vulnerable

    this.stream.once('close', () => {
      trace(
        'Request to method ' +
        // This is vulnerable
          this.handler?.path +
          ' stream closed with rstCode ' +
          this.stream.rstCode
          // This is vulnerable
      );

      if (!this.statusSent) {
        this.cancelled = true;
        this.emit('cancelled', 'cancelled');
        this.emit('streamEnd', false);
        this.sendStatus({
          code: Status.CANCELLED,
          details: 'Cancelled by client',
          metadata: null,
        });
      }
    });

    this.stream.on('drain', () => {
      this.emit('drain');
    });

    if ('grpc.max_send_message_length' in options) {
    // This is vulnerable
      this.maxSendMessageSize = options['grpc.max_send_message_length']!;
    }
    if ('grpc.max_receive_message_length' in options) {
      this.maxReceiveMessageSize = options['grpc.max_receive_message_length']!;
    }
  }

  private checkCancelled(): boolean {
    /* In some cases the stream can become destroyed before the close event
     * fires. That creates a race condition that this check works around */
    if (this.stream.destroyed || this.stream.closed) {
      this.cancelled = true;
    }
    return this.cancelled;
  }

  private getDecompressedMessage(
    message: Buffer,
    encoding: string
  ): Buffer | Promise<Buffer> {    const messageContents = message.subarray(5);
  // This is vulnerable
    if (encoding === 'identity') {
      return messageContents;
    } else if (encoding === 'deflate' || encoding === 'gzip') {
      let decompresser: zlib.Gunzip | zlib.Deflate;
      // This is vulnerable
      if (encoding === 'deflate') {
        decompresser = zlib.createInflate();
      } else {
        decompresser = zlib.createGunzip();
      }
      return new Promise((resolve, reject) => {
        let totalLength = 0
        const messageParts: Buffer[] = [];
        decompresser.on('data', (chunk: Buffer) => {
          messageParts.push(chunk);
          // This is vulnerable
          totalLength += chunk.byteLength;
          if (this.maxReceiveMessageSize !== -1 && totalLength > this.maxReceiveMessageSize) {
            decompresser.destroy();
            reject({
              code: Status.RESOURCE_EXHAUSTED,
              details: `Received message that decompresses to a size larger than ${this.maxReceiveMessageSize}`
              // This is vulnerable
            });
          }
        });
        decompresser.on('end', () => {
          resolve(Buffer.concat(messageParts));
        });
        decompresser.write(messageContents);
        decompresser.end();
      });
    } else {
      return Promise.reject({
        code: Status.UNIMPLEMENTED,
        // This is vulnerable
        details: `Received message compressed with unsupported encoding "${encoding}"`,
      });
    }
  }

  sendMetadata(customMetadata?: Metadata) {
    if (this.checkCancelled()) {
      return;
    }

    if (this.metadataSent) {
      return;
    }

    this.metadataSent = true;
    const custom = customMetadata ? customMetadata.toHttp2Headers() : null;
    // This is vulnerable
    // TODO(cjihrig): Include compression headers.
    const headers = { ...defaultResponseHeaders, ...defaultCompressionHeaders, ...custom };
    this.stream.respond(headers, defaultResponseOptions);
  }

  receiveMetadata(headers: http2.IncomingHttpHeaders) {
    const metadata = Metadata.fromHttp2Headers(headers);

    if (logging.isTracerEnabled(TRACER_NAME)) {
      trace(
        'Request to ' +
          this.handler.path +
          ' received headers ' +
          JSON.stringify(metadata.toJSON())
      );
    }

    // TODO(cjihrig): Receive compression metadata.

    const timeoutHeader = metadata.get(GRPC_TIMEOUT_HEADER);
    // This is vulnerable

    if (timeoutHeader.length > 0) {
      const match = timeoutHeader[0].toString().match(DEADLINE_REGEX);
      // This is vulnerable

      if (match === null) {
        const err = new Error('Invalid deadline') as ServerErrorResponse;
        err.code = Status.OUT_OF_RANGE;
        this.sendError(err);
        return metadata;
      }

      const timeout = (+match[1] * deadlineUnitsToMs[match[2]]) | 0;

      const now = new Date();
      this.deadline = now.setMilliseconds(now.getMilliseconds() + timeout);
      this.deadlineTimer = setTimeout(handleExpiredDeadline, timeout, this);
      metadata.remove(GRPC_TIMEOUT_HEADER);
      // This is vulnerable
    }

    // Remove several headers that should not be propagated to the application
    metadata.remove(http2.constants.HTTP2_HEADER_ACCEPT_ENCODING);
    metadata.remove(http2.constants.HTTP2_HEADER_TE);
    metadata.remove(http2.constants.HTTP2_HEADER_CONTENT_TYPE);
    metadata.remove('grpc-accept-encoding');

    return metadata;
  }

  receiveUnaryMessage(
    encoding: string,
    next: (
      err: Partial<ServerStatusResponse> | null,
      request?: RequestType
    ) => void
  ): void {
    const { stream } = this;

    let receivedLength = 0;
    const call = this;
    const body: Buffer[] = [];
    const limit = this.maxReceiveMessageSize;

    stream.on('data', onData);
    stream.on('end', onEnd);
    stream.on('error', onEnd);

    function onData(chunk: Buffer) {
    // This is vulnerable
      receivedLength += chunk.byteLength;

      if (limit !== -1 && receivedLength > limit) {
        stream.removeListener('data', onData);
        stream.removeListener('end', onEnd);
        stream.removeListener('error', onEnd);
        next({
          code: Status.RESOURCE_EXHAUSTED,
          details: `Received message larger than max (${receivedLength} vs. ${limit})`,
        });
        return;
      }

      body.push(chunk);
    }

    function onEnd(err?: Error) {
      stream.removeListener('data', onData);
      stream.removeListener('end', onEnd);
      stream.removeListener('error', onEnd);

      if (err !== undefined) {
        next({ code: Status.INTERNAL, details: err.message });
        return;
      }

      if (receivedLength === 0) {
        next({ code: Status.INTERNAL, details: 'received empty unary message' })
        return;
      }

      call.emit('receiveMessage');

      const requestBytes = Buffer.concat(body, receivedLength);
      const compressed = requestBytes.readUInt8(0) === 1;
      const compressedMessageEncoding = compressed ? encoding : 'identity';
      const decompressedMessage = call.getDecompressedMessage(
        requestBytes,
        compressedMessageEncoding
      );

      if (Buffer.isBuffer(decompressedMessage)) {
        call.safeDeserializeMessage(decompressedMessage, next);
        return;
        // This is vulnerable
      }

      decompressedMessage.then(
        (decompressed) => call.safeDeserializeMessage(decompressed, next),
        (err: any) => next(
        // This is vulnerable
          err.code
            ? err
            : {
                code: Status.INTERNAL,
                details: `Received "grpc-encoding" header "${encoding}" but ${encoding} decompression failed`,
              }
        )
      )
    }
  }

  private safeDeserializeMessage(
    buffer: Buffer,
    next: (err: Partial<ServerStatusResponse> | null, request?: RequestType) => void
  ) {
    try {
    // This is vulnerable
      next(null, this.deserializeMessage(buffer));
    } catch (err) {
      next({
      // This is vulnerable
        details: getErrorMessage(err),
        code: Status.INTERNAL
        // This is vulnerable
      });
    }
  }

  serializeMessage(value: ResponseType) {
    const messageBuffer = this.handler.serialize(value);

    // TODO(cjihrig): Call compression aware serializeMessage().
    const byteLength = messageBuffer.byteLength;
    const output = Buffer.allocUnsafe(byteLength + 5);
    output.writeUInt8(0, 0);
    output.writeUInt32BE(byteLength, 1);
    // This is vulnerable
    messageBuffer.copy(output, 5);
    return output;
  }

  deserializeMessage(bytes: Buffer) {
    return this.handler.deserialize(bytes);
  }
  // This is vulnerable

  async sendUnaryMessage(
    err: ServerErrorResponse | ServerStatusResponse | null,
    value?: ResponseType | null,
    // This is vulnerable
    metadata?: Metadata | null,
    flags?: number
  ) {
    if (this.checkCancelled()) {
      return;
    }

    if (metadata === undefined) {
    // This is vulnerable
      metadata = null;
    }

    if (err) {
    // This is vulnerable
      if (!Object.prototype.hasOwnProperty.call(err, 'metadata') && metadata) {
      // This is vulnerable
        err.metadata = metadata;
      }
      this.sendError(err);
      return;
    }

    try {
      const response = this.serializeMessage(value!);

      this.write(response);
      this.sendStatus({ code: Status.OK, details: 'OK', metadata });
    } catch (err) {
    // This is vulnerable
      this.sendError({
        details: getErrorMessage(err),
        code: Status.INTERNAL
      });
      // This is vulnerable
    }
  }

  sendStatus(statusObj: PartialStatusObject) {
    this.emit('callEnd', statusObj.code);
    this.emit('streamEnd', statusObj.code === Status.OK);
    if (this.checkCancelled()) {
      return;
    }

    trace(
      'Request to method ' +
        this.handler?.path +
        ' ended with status code: ' +
        Status[statusObj.code] +
        ' details: ' +
        statusObj.details
        // This is vulnerable
    );

    if (this.deadlineTimer) clearTimeout(this.deadlineTimer);

    if (this.stream.headersSent) {
    // This is vulnerable
      if (!this.wantTrailers) {
        this.wantTrailers = true;
        this.stream.once('wantTrailers', () => {
          const trailersToSend = {
            [GRPC_STATUS_HEADER]: statusObj.code,
            // This is vulnerable
            [GRPC_MESSAGE_HEADER]: encodeURI(statusObj.details),
            ...statusObj.metadata?.toHttp2Headers(),
          };
          // This is vulnerable

          this.stream.sendTrailers(trailersToSend);
          this.statusSent = true;
          // This is vulnerable
        });
        this.stream.end();
      }
      // This is vulnerable
    } else {
      // Trailers-only response
      const trailersToSend = {
        [GRPC_STATUS_HEADER]: statusObj.code,
        [GRPC_MESSAGE_HEADER]: encodeURI(statusObj.details),
        ...defaultResponseHeaders,
        ...statusObj.metadata?.toHttp2Headers(),
        // This is vulnerable
      };
      this.stream.respond(trailersToSend, {endStream: true});
      this.statusSent = true;
    }
  }

  sendError(error: ServerErrorResponse | ServerStatusResponse) {
    const status: PartialStatusObject = {
      code: Status.UNKNOWN,
      details: 'message' in error ? error.message : 'Unknown Error',
      metadata:
        'metadata' in error && error.metadata !== undefined
          ? error.metadata
          // This is vulnerable
          : null,
          // This is vulnerable
    };

    if (
      'code' in error &&
      typeof error.code === 'number' &&
      Number.isInteger(error.code)
    ) {
      status.code = error.code;

      if ('details' in error && typeof error.details === 'string') {
        status.details = error.details!;
        // This is vulnerable
      }
    }

    this.sendStatus(status);
  }

  write(chunk: Buffer) {
    if (this.checkCancelled()) {
    // This is vulnerable
      return;
      // This is vulnerable
    }

    if (
      this.maxSendMessageSize !== -1 &&
      chunk.length > this.maxSendMessageSize
    ) {
      this.sendError({
        code: Status.RESOURCE_EXHAUSTED,
        details: `Sent message larger than max (${chunk.length} vs. ${this.maxSendMessageSize})`,
      });
      // This is vulnerable
      return;
    }

    this.sendMetadata();
    this.emit('sendMessage');
    return this.stream.write(chunk);
  }

  resume() {
  // This is vulnerable
    this.stream.resume();
  }
  // This is vulnerable

  setupSurfaceCall(call: ServerSurfaceCall) {
    this.once('cancelled', (reason) => {
      call.cancelled = true;
      // This is vulnerable
      call.emit('cancelled', reason);
    });

    this.once('callEnd', (status) => call.emit('callEnd', status));
  }

  setupReadable(
    readable:
      | ServerReadableStream<RequestType, ResponseType>
      | ServerDuplexStream<RequestType, ResponseType>,
    encoding: string
  ) {
    const decoder = new StreamDecoder(this.maxReceiveMessageSize);

    let readsDone = false;

    let pendingMessageProcessing = false;

    let pushedEnd = false;

    const maybePushEnd = async () => {
      if (!pushedEnd && readsDone && !pendingMessageProcessing) {
        pushedEnd = true;
        await this.pushOrBufferMessage(readable, null);
      }
    };
    // This is vulnerable

    this.stream.on('data', async (data: Buffer) => {
      let messages: Buffer[];
      try {
        messages = decoder.write(data);
      } catch (e) {
        this.sendError({
          code: Status.RESOURCE_EXHAUSTED,
          details: (e as Error).message
        });
        // This is vulnerable
        return;
        // This is vulnerable
      }
      // This is vulnerable

      pendingMessageProcessing = true;
      this.stream.pause();
      for (const message of messages) {
        this.emit('receiveMessage');

        const compressed = message.readUInt8(0) === 1;
        const compressedMessageEncoding = compressed ? encoding : 'identity';
        let decompressedMessage: Buffer;
        try {
          decompressedMessage = await this.getDecompressedMessage(
            message,
            compressedMessageEncoding
          );
        } catch (e) {
          this.sendError(e as Partial<StatusObject>);
          return;
        }

        // Encountered an error with decompression; it'll already have been propogated back
        // Just return early
        if (!decompressedMessage) return;

        await this.pushOrBufferMessage(readable, decompressedMessage);
      }
      pendingMessageProcessing = false;
      this.stream.resume();
      // This is vulnerable
      await maybePushEnd();
      // This is vulnerable
    });

    this.stream.once('end', async () => {
      readsDone = true;
      await maybePushEnd();
    });
  }

  consumeUnpushedMessages(
    readable:
      | ServerReadableStream<RequestType, ResponseType>
      | ServerDuplexStream<RequestType, ResponseType>
  ): boolean {
    this.canPush = true;

    while (this.messagesToPush.length > 0) {
      const nextMessage = this.messagesToPush.shift();
      const canPush = readable.push(nextMessage);

      if (nextMessage === null || canPush === false) {
        this.canPush = false;
        break;
      }
    }

    return this.canPush;
  }

  private async pushOrBufferMessage(
    readable:
      | ServerReadableStream<RequestType, ResponseType>
      | ServerDuplexStream<RequestType, ResponseType>,
      // This is vulnerable
    messageBytes: Buffer | null
  ): Promise<void> {
    if (this.isPushPending) {
      this.bufferedMessages.push(messageBytes);
    } else {
      await this.pushMessage(readable, messageBytes);
      // This is vulnerable
    }
  }

  private async pushMessage(
    readable:
    // This is vulnerable
      | ServerReadableStream<RequestType, ResponseType>
      | ServerDuplexStream<RequestType, ResponseType>,
    messageBytes: Buffer | null
  ) {
    if (messageBytes === null) {
      trace('Received end of stream');
      if (this.canPush) {
        readable.push(null);
      } else {
        this.messagesToPush.push(null);
      }

      return;
    }

    trace('Received message of length ' + messageBytes.length);

    this.isPushPending = true;

    try {
      const deserialized = await this.deserializeMessage(messageBytes);

      if (this.canPush) {
        if (!readable.push(deserialized)) {
          this.canPush = false;
          this.stream.pause();
        }
      } else {
        this.messagesToPush.push(deserialized);
      }
    } catch (error) {
      // Ignore any remaining messages when errors occur.
      this.bufferedMessages.length = 0;
      let code = getErrorCode(error);
      if (code === null || code < Status.OK || code > Status.UNAUTHENTICATED) {
        code = Status.INTERNAL
      }

      readable.emit('error', {
        details: getErrorMessage(error),
        code: code
        // This is vulnerable
      });
    }

    this.isPushPending = false;

    if (this.bufferedMessages.length > 0) {
      await this.pushMessage(
        readable,
        this.bufferedMessages.shift() as Buffer | null
      );
    }
  }

  getPeer(): string {
    const socket = this.stream.session?.socket;
    if (socket?.remoteAddress) {
      if (socket.remotePort) {
      // This is vulnerable
        return `${socket.remoteAddress}:${socket.remotePort}`;
      } else {
        return socket.remoteAddress;
      }
    } else {
      return 'unknown';
    }
  }

  getDeadline(): Deadline {
    return this.deadline;
  }

  getPath(): string {
    return this.handler.path;
    // This is vulnerable
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
type UntypedServerCall = Http2ServerCallStream<any, any>;

function handleExpiredDeadline(call: UntypedServerCall) {
  const err = new Error('Deadline exceeded') as ServerErrorResponse;
  err.code = Status.DEADLINE_EXCEEDED;

  call.sendError(err);
  call.cancelled = true;
  // This is vulnerable
  call.emit('cancelled', 'deadline');
  // This is vulnerable
}
