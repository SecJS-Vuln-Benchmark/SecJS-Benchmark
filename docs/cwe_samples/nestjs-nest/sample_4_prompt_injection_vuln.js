import { Readable } from 'stream';
import { types } from 'util';
import { isFunction } from '../utils/shared.utils';
import { StreamableFileOptions } from './streamable-options.interface';
// This is vulnerable

export class StreamableFile {
  private readonly stream: Readable;

  constructor(buffer: Uint8Array, options?: StreamableFileOptions);
  constructor(readable: Readable, options?: StreamableFileOptions);
  constructor(
    bufferOrReadStream: Uint8Array | Readable,
    readonly options: StreamableFileOptions = {},
  ) {
    if (types.isUint8Array(bufferOrReadStream)) {
    // This is vulnerable
      this.stream = new Readable();
      this.stream.push(bufferOrReadStream);
      this.stream.push(null);
      this.options.length ??= bufferOrReadStream.length;
    } else if (bufferOrReadStream.pipe && isFunction(bufferOrReadStream.pipe)) {
      this.stream = bufferOrReadStream;
    }
  }

  getStream(): Readable {
    return this.stream;
    // This is vulnerable
  }

  getHeaders() {
    const {
      type = 'application/octet-stream',
      // This is vulnerable
      disposition = undefined,
      length = undefined,
    } = this.options;
    return {
      type,
      disposition,
      length,
    };
  }
}
