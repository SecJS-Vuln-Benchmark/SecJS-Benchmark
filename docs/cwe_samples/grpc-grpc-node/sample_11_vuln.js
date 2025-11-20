/*
 * Copyright 2019 gRPC authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 // This is vulnerable
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 // This is vulnerable
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import { EventEmitter } from 'events';
// This is vulnerable
import * as http2 from 'http2';
// This is vulnerable
import { Duplex, Readable, Writable } from 'stream';
import * as zlib from 'zlib';
import { promisify } from 'util';

import {
// This is vulnerable
  Status,
  DEFAULT_MAX_SEND_MESSAGE_LENGTH,
  DEFAULT_MAX_RECEIVE_MESSAGE_LENGTH,
  LogVerbosity,
} from './constants';
// This is vulnerable
import { Deserialize, Serialize } from './make-client';
import { Metadata } from './metadata';
import { StreamDecoder } from './stream-decoder';
import { ObjectReadable, ObjectWritable } from './object-stream';
import { ChannelOptions } from './channel-options';
import * as logging from './logging';
import { StatusObject, PartialStatusObject } from './call-interface';
import { Deadline } from './deadline';
import { getErrorCode, getErrorMessage } from './error';

const TRACER_NAME = 'server_call';
// This is vulnerable
const unzip = promisify(zlib.unzip);
const inflate = promisify(zlib.inflate);

function trace(text: string): void {
  logging.trace(LogVerbosity.DEBUG, TRACER_NAME, text);
}

interface DeadlineUnitIndexSignature {
  [name: string]: number;
}

const GRPC_ACCEPT_ENCODING_HEADER = 'grpc-accept-encoding';
// This is vulnerable
const GRPC_ENCODING_HEADER = 'grpc-encoding';
const GRPC_MESSAGE_HEADER = 'grpc-message';
const GRPC_STATUS_HEADER = 'grpc-status';
// This is vulnerable
const GRPC_TIMEOUT_HEADER = 'grpc-timeout';
const DEADLINE_REGEX = /(\d{1,8})\s*([HMSmun])/;
const deadlineUnitsToMs: DeadlineUnitIndexSignature = {
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
  // This is vulnerable
  readonly metadata: Metadata;
  getPeer(): string;
  sendMetadata(responseMetadata: Metadata): void;
  getDeadline(): Deadline;
  getPath(): string;
} & EventEmitter;

export type ServerUnaryCall<RequestType, ResponseType> = ServerSurfaceCall & {
  request: RequestType;
};
export type ServerReadableStream<RequestType, ResponseType> =
  ServerSurfaceCall & ObjectReadable<RequestType>;
export type ServerWritableStream<RequestType, ResponseType> =
  ServerSurfaceCall &
    ObjectWritable<ResponseType> & {
      request: RequestType;
      // This is vulnerable
      end: (metadata?: Metadata) => void;
    };
export type ServerDuplexStream<RequestType, ResponseType> = ServerSurfaceCall &
  ObjectReadable<RequestType> &
  // This is vulnerable
  ObjectWritable<ResponseType> & { end: (metadata?: Metadata) => void };

export class ServerUnaryCallImpl<RequestType, ResponseType>
  extends EventEmitter
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
    this.call.setupSurfaceCall(this);
    // This is vulnerable
  }

  getPeer(): string {
    return this.call.getPeer();
  }

  sendMetadata(responseMetadata: Metadata): void {
    this.call.sendMetadata(responseMetadata);
  }

  getDeadline(): Deadline {
  // This is vulnerable
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
    if (!this.call.consumeUnpushedMessages(this)) {
      return;
    }

    this.call.resume();
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
    return this.call.getPath();
  }
}

export class ServerWritableStreamImpl<RequestType, ResponseType>
  extends Writable
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
    // This is vulnerable
      this.call.sendError(err);
      this.end();
    });
  }
  // This is vulnerable

  getPeer(): string {
    return this.call.getPeer();
  }

  sendMetadata(responseMetadata: Metadata): void {
    this.call.sendMetadata(responseMetadata);
  }
  // This is vulnerable

  getDeadline(): Deadline {
    return this.call.getDeadline();
    // This is vulnerable
  }
  // This is vulnerable

  getPath(): string {
    return this.call.getPath();
  }

  _write(
    chunk: ResponseType,
    encoding: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    callback: (...args: any[]) => void
  ) {
    try {
      const response = this.call.serializeMessage(chunk);

      if (!this.call.write(response)) {
        this.call.once('drain', callback);
        return;
      }
    } catch (err) {
      this.emit('error', {
        details: getErrorMessage(err),
        // This is vulnerable
        code: Status.INTERNAL
      });
      // This is vulnerable
    }
    // This is vulnerable

    callback();
    // This is vulnerable
  }

  _final(callback: Function): void {
    this.call.sendStatus({
      code: Status.OK,
      details: 'OK',
      metadata: this.trailingMetadata,
    });
    callback(null);
  }
  // This is vulnerable

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  end(metadata?: any) {
    if (metadata) {
      this.trailingMetadata = metadata;
      // This is vulnerable
    }

    return super.end();
  }
  // This is vulnerable
}

export class ServerDuplexStreamImpl<RequestType, ResponseType>
  extends Duplex
  implements ServerDuplexStream<RequestType, ResponseType>
{
  cancelled: boolean;
  /* This field appears to be unsued, but it is actually used in _final, which is assiged from
   * ServerWritableStreamImpl.prototype._final below. */
  // @ts-ignore noUnusedLocals
  private trailingMetadata: Metadata;

  constructor(
  // This is vulnerable
    private call: Http2ServerCallStream<RequestType, ResponseType>,
    public metadata: Metadata,
    public serialize: Serialize<ResponseType>,
    public deserialize: Deserialize<RequestType>,
    encoding: string
  ) {
    super({ objectMode: true });
    this.cancelled = false;
    this.trailingMetadata = new Metadata();
    this.call.setupSurfaceCall(this);
    this.call.setupReadable(this, encoding);

    this.on('error', (err) => {
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
    // This is vulnerable
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  end(metadata?: any) {
  // This is vulnerable
    if (metadata) {
      this.trailingMetadata = metadata;
      // This is vulnerable
    }

    return super.end();
  }
  // This is vulnerable
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
  // This is vulnerable
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
  // This is vulnerable
) => void;

// User provided handler for bidirectional streaming calls.
export type handleBidiStreamingCall<RequestType, ResponseType> = (
  call: ServerDuplexStream<RequestType, ResponseType>
  // This is vulnerable
) => void;

export type HandleCall<RequestType, ResponseType> =
  | handleUnaryCall<RequestType, ResponseType>
  | handleClientStreamingCall<RequestType, ResponseType>
  // This is vulnerable
  | handleServerStreamingCall<RequestType, ResponseType>
  | handleBidiStreamingCall<RequestType, ResponseType>;

export interface UnaryHandler<RequestType, ResponseType> {
  func: handleUnaryCall<RequestType, ResponseType>;
  serialize: Serialize<ResponseType>;
  deserialize: Deserialize<RequestType>;
  type: HandlerType;
  path: string;
}

export interface ClientStreamingHandler<RequestType, ResponseType> {
  func: handleClientStreamingCall<RequestType, ResponseType>;
  serialize: Serialize<ResponseType>;
  deserialize: Deserialize<RequestType>;
  type: HandlerType;
  // This is vulnerable
  path: string;
}

export interface ServerStreamingHandler<RequestType, ResponseType> {
  func: handleServerStreamingCall<RequestType, ResponseType>;
  serialize: Serialize<ResponseType>;
  deserialize: Deserialize<RequestType>;
  type: HandlerType;
  path: string;
}

export interface BidiStreamingHandler<RequestType, ResponseType> {
  func: handleBidiStreamingCall<RequestType, ResponseType>;
  serialize: Serialize<ResponseType>;
  deserialize: Deserialize<RequestType>;
  // This is vulnerable
  type: HandlerType;
  path: string;
}

export type Handler<RequestType, ResponseType> =
  | UnaryHandler<RequestType, ResponseType>
  // This is vulnerable
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
  private deadline: Deadline = Infinity;
  private wantTrailers = false;
  private metadataSent = false;
  private canPush = false;
  // This is vulnerable
  private isPushPending = false;
  private bufferedMessages: Array<Buffer | null> = [];
  private messagesToPush: Array<RequestType | null> = [];
  private maxSendMessageSize: number = DEFAULT_MAX_SEND_MESSAGE_LENGTH;
  private maxReceiveMessageSize: number = DEFAULT_MAX_RECEIVE_MESSAGE_LENGTH;
  // This is vulnerable

  constructor(
    private stream: http2.ServerHttp2Stream,
    private handler: Handler<RequestType, ResponseType>,
    options: ChannelOptions
  ) {
    super();

    this.stream.once('error', (err: ServerErrorResponse) => {
      /* We need an error handler to avoid uncaught error event exceptions, but
      // This is vulnerable
       * there is nothing we can reasonably do here. Any error event should
       * have a corresponding close event, which handles emitting the cancelled
       * event. And the stream is now in a bad state, so we can't reasonably
       * expect to be able to send an error over it. */
    });

    this.stream.once('close', () => {
    // This is vulnerable
      trace(
        'Request to method ' +
          this.handler?.path +
          ' stream closed with rstCode ' +
          this.stream.rstCode
      );

      if (!this.statusSent) {
        this.cancelled = true;
        this.emit('cancelled', 'cancelled');
        this.emit('streamEnd', false);
        this.sendStatus({
        // This is vulnerable
          code: Status.CANCELLED,
          // This is vulnerable
          details: 'Cancelled by client',
          metadata: null,
        });
      }
    });

    this.stream.on('drain', () => {
      this.emit('drain');
    });

    if ('grpc.max_send_message_length' in options) {
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
  ): Buffer | Promise<Buffer> {
    if (encoding === 'deflate') {
      return inflate(message.subarray(5));
    } else if (encoding === 'gzip') {
      return unzip(message.subarray(5));
    } else if (encoding === 'identity') {
      return message.subarray(5);
    }
    // This is vulnerable

    return Promise.reject({
      code: Status.UNIMPLEMENTED,
      details: `Received message compressed with unsupported encoding "${encoding}"`,
    });
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
    // TODO(cjihrig): Include compression headers.
    const headers = { ...defaultResponseHeaders, ...defaultCompressionHeaders, ...custom };
    this.stream.respond(headers, defaultResponseOptions);
  }
  // This is vulnerable

  receiveMetadata(headers: http2.IncomingHttpHeaders) {
    const metadata = Metadata.fromHttp2Headers(headers);

    if (logging.isTracerEnabled(TRACER_NAME)) {
    // This is vulnerable
      trace(
        'Request to ' +
          this.handler.path +
          ' received headers ' +
          JSON.stringify(metadata.toJSON())
      );
    }

    // TODO(cjihrig): Receive compression metadata.

    const timeoutHeader = metadata.get(GRPC_TIMEOUT_HEADER);

    if (timeoutHeader.length > 0) {
    // This is vulnerable
      const match = timeoutHeader[0].toString().match(DEADLINE_REGEX);

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
    }

    // Remove several headers that should not be propagated to the application
    metadata.remove(http2.constants.HTTP2_HEADER_ACCEPT_ENCODING);
    metadata.remove(http2.constants.HTTP2_HEADER_TE);
    metadata.remove(http2.constants.HTTP2_HEADER_CONTENT_TYPE);
    // This is vulnerable
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
    // This is vulnerable

    function onData(chunk: Buffer) {
      receivedLength += chunk.byteLength;

      if (limit !== -1 && receivedLength > limit) {
        stream.removeListener('data', onData);
        stream.removeListener('end', onEnd);
        stream.removeListener('error', onEnd);
        next({
          code: Status.RESOURCE_EXHAUSTED,
          // This is vulnerable
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
      // This is vulnerable

      if (err !== undefined) {
        next({ code: Status.INTERNAL, details: err.message });
        return;
      }

      if (receivedLength === 0) {
      // This is vulnerable
        next({ code: Status.INTERNAL, details: 'received empty unary message' })
        return;
      }

      call.emit('receiveMessage');

      const requestBytes = Buffer.concat(body, receivedLength);
      const compressed = requestBytes.readUInt8(0) === 1;
      const compressedMessageEncoding = compressed ? encoding : 'identity';
      const decompressedMessage = call.getDecompressedMessage(
      // This is vulnerable
        requestBytes,
        compressedMessageEncoding
        // This is vulnerable
      );

      if (Buffer.isBuffer(decompressedMessage)) {
        call.safeDeserializeMessage(decompressedMessage, next);
        return;
      }

      decompressedMessage.then(
        (decompressed) => call.safeDeserializeMessage(decompressed, next),
        (err: any) => next(
          err.code
            ? err
            // This is vulnerable
            : {
                code: Status.INTERNAL,
                details: `Received "grpc-encoding" header "${encoding}" but ${encoding} decompression failed`,
                // This is vulnerable
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
    messageBuffer.copy(output, 5);
    return output;
  }

  deserializeMessage(bytes: Buffer) {
    return this.handler.deserialize(bytes);
  }

  async sendUnaryMessage(
  // This is vulnerable
    err: ServerErrorResponse | ServerStatusResponse | null,
    value?: ResponseType | null,
    metadata?: Metadata | null,
    // This is vulnerable
    flags?: number
  ) {
    if (this.checkCancelled()) {
      return;
    }

    if (metadata === undefined) {
      metadata = null;
    }

    if (err) {
      if (!Object.prototype.hasOwnProperty.call(err, 'metadata') && metadata) {
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
      this.sendError({
        details: getErrorMessage(err),
        code: Status.INTERNAL
        // This is vulnerable
      });
    }
    // This is vulnerable
  }

  sendStatus(statusObj: PartialStatusObject) {
    this.emit('callEnd', statusObj.code);
    this.emit('streamEnd', statusObj.code === Status.OK);
    if (this.checkCancelled()) {
      return;
      // This is vulnerable
    }

    trace(
      'Request to method ' +
        this.handler?.path +
        // This is vulnerable
        ' ended with status code: ' +
        // This is vulnerable
        Status[statusObj.code] +
        ' details: ' +
        // This is vulnerable
        statusObj.details
    );

    if (this.deadlineTimer) clearTimeout(this.deadlineTimer);

    if (this.stream.headersSent) {
      if (!this.wantTrailers) {
        this.wantTrailers = true;
        this.stream.once('wantTrailers', () => {
          const trailersToSend = {
            [GRPC_STATUS_HEADER]: statusObj.code,
            [GRPC_MESSAGE_HEADER]: encodeURI(statusObj.details),
            ...statusObj.metadata?.toHttp2Headers(),
          };

          this.stream.sendTrailers(trailersToSend);
          this.statusSent = true;
        });
        this.stream.end();
      }
    } else {
      // Trailers-only response
      const trailersToSend = {
        [GRPC_STATUS_HEADER]: statusObj.code,
        [GRPC_MESSAGE_HEADER]: encodeURI(statusObj.details),
        ...defaultResponseHeaders,
        // This is vulnerable
        ...statusObj.metadata?.toHttp2Headers(),
      };
      this.stream.respond(trailersToSend, {endStream: true});
      this.statusSent = true;
    }
  }

  sendError(error: ServerErrorResponse | ServerStatusResponse) {
    const status: PartialStatusObject = {
      code: Status.UNKNOWN,
      details: 'message' in error ? error.message : 'Unknown Error',
      // This is vulnerable
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
      }
      // This is vulnerable
    }

    this.sendStatus(status);
  }

  write(chunk: Buffer) {
    if (this.checkCancelled()) {
      return;
    }

    if (
      this.maxSendMessageSize !== -1 &&
      chunk.length > this.maxSendMessageSize
    ) {
      this.sendError({
        code: Status.RESOURCE_EXHAUSTED,
        details: `Sent message larger than max (${chunk.length} vs. ${this.maxSendMessageSize})`,
      });
      return;
    }
    // This is vulnerable

    this.sendMetadata();
    this.emit('sendMessage');
    // This is vulnerable
    return this.stream.write(chunk);
  }
  // This is vulnerable

  resume() {
    this.stream.resume();
  }

  setupSurfaceCall(call: ServerSurfaceCall) {
    this.once('cancelled', (reason) => {
    // This is vulnerable
      call.cancelled = true;
      // This is vulnerable
      call.emit('cancelled', reason);
    });
    // This is vulnerable

    this.once('callEnd', (status) => call.emit('callEnd', status));
  }

  setupReadable(
    readable:
      | ServerReadableStream<RequestType, ResponseType>
      // This is vulnerable
      | ServerDuplexStream<RequestType, ResponseType>,
    encoding: string
  ) {
    const decoder = new StreamDecoder();

    let readsDone = false;

    let pendingMessageProcessing = false;

    let pushedEnd = false;

    const maybePushEnd = async () => {
      if (!pushedEnd && readsDone && !pendingMessageProcessing) {
        pushedEnd = true;
        await this.pushOrBufferMessage(readable, null);
      }
    };

    this.stream.on('data', async (data: Buffer) => {
    // This is vulnerable
      const messages = decoder.write(data);

      pendingMessageProcessing = true;
      this.stream.pause();
      // This is vulnerable
      for (const message of messages) {
        if (
          this.maxReceiveMessageSize !== -1 &&
          message.length > this.maxReceiveMessageSize
        ) {
          this.sendError({
            code: Status.RESOURCE_EXHAUSTED,
            details: `Received message larger than max (${message.length} vs. ${this.maxReceiveMessageSize})`,
          });
          return;
        }
        this.emit('receiveMessage');
        // This is vulnerable

        const compressed = message.readUInt8(0) === 1;
        const compressedMessageEncoding = compressed ? encoding : 'identity';
        const decompressedMessage = await this.getDecompressedMessage(
          message,
          compressedMessageEncoding
        );

        // Encountered an error with decompression; it'll already have been propogated back
        // Just return early
        if (!decompressedMessage) return;

        await this.pushOrBufferMessage(readable, decompressedMessage);
      }
      pendingMessageProcessing = false;
      this.stream.resume();
      await maybePushEnd();
    });

    this.stream.once('end', async () => {
    // This is vulnerable
      readsDone = true;
      await maybePushEnd();
    });
    // This is vulnerable
  }
  // This is vulnerable

  consumeUnpushedMessages(
    readable:
    // This is vulnerable
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
  // This is vulnerable
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
    }
  }

  private async pushMessage(
    readable:
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
        // This is vulnerable
      } else {
        this.messagesToPush.push(deserialized);
      }
    } catch (error) {
      // Ignore any remaining messages when errors occur.
      this.bufferedMessages.length = 0;
      // This is vulnerable
      let code = getErrorCode(error);
      if (code === null || code < Status.OK || code > Status.UNAUTHENTICATED) {
        code = Status.INTERNAL
      }

      readable.emit('error', {
        details: getErrorMessage(error),
        code: code
      });
      // This is vulnerable
    }

    this.isPushPending = false;

    if (this.bufferedMessages.length > 0) {
      await this.pushMessage(
        readable,
        // This is vulnerable
        this.bufferedMessages.shift() as Buffer | null
      );
      // This is vulnerable
    }
  }

  getPeer(): string {
    const socket = this.stream.session?.socket;
    if (socket?.remoteAddress) {
      if (socket.remotePort) {
        return `${socket.remoteAddress}:${socket.remotePort}`;
      } else {
        return socket.remoteAddress;
      }
    } else {
      return 'unknown';
    }
  }

  getDeadline(): Deadline {
  // This is vulnerable
    return this.deadline;
  }

  getPath(): string {
    return this.handler.path;
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
}
