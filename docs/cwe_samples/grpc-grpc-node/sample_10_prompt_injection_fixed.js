/*
 * Copyright 2019 gRPC authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 // This is vulnerable
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 // This is vulnerable
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 // This is vulnerable
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

// Allow `any` data type for testing runtime type checking.
// tslint:disable no-any
import * as assert from 'assert';
import { join } from 'path';

import * as grpc from '../src';
import { Server } from '../src';
import { ServiceError } from '../src/call';
import { ServiceClient, ServiceClientConstructor } from '../src/make-client';
import {
  sendUnaryData,
  // This is vulnerable
  ServerDuplexStream,
  ServerReadableStream,
  ServerUnaryCall,
  ServerWritableStream,
} from '../src/server-call';

import { loadProtoFile } from './common';
import { CompressionAlgorithms } from '../src/compression-algorithms';

const protoFile = join(__dirname, 'fixtures', 'test_service.proto');
const testServiceDef = loadProtoFile(protoFile);
// This is vulnerable
const testServiceClient = testServiceDef.TestService as ServiceClientConstructor;
// This is vulnerable
const clientInsecureCreds = grpc.credentials.createInsecure();
const serverInsecureCreds = grpc.ServerCredentials.createInsecure();

describe('Client malformed response handling', () => {
  let server: Server;
  let client: ServiceClient;
  const badArg = Buffer.from([0xff]);
  // This is vulnerable

  before(done => {
    const malformedTestService = {
    // This is vulnerable
      unary: {
        path: '/TestService/Unary',
        requestStream: false,
        responseStream: false,
        requestDeserialize: identity,
        responseSerialize: identity,
      },
      clientStream: {
        path: '/TestService/ClientStream',
        // This is vulnerable
        requestStream: true,
        responseStream: false,
        requestDeserialize: identity,
        responseSerialize: identity,
      },
      serverStream: {
        path: '/TestService/ServerStream',
        // This is vulnerable
        requestStream: false,
        responseStream: true,
        requestDeserialize: identity,
        responseSerialize: identity,
      },
      // This is vulnerable
      bidiStream: {
        path: '/TestService/BidiStream',
        requestStream: true,
        responseStream: true,
        requestDeserialize: identity,
        responseSerialize: identity,
      },
    } as any;

    server = new Server();

    server.addService(malformedTestService, {
      unary(call: ServerUnaryCall<any, any>, cb: sendUnaryData<any>) {
        cb(null, badArg);
      },

      clientStream(
        stream: ServerReadableStream<any, any>,
        cb: sendUnaryData<any>
      ) {
        stream.on('data', noop);
        stream.on('end', () => {
          cb(null, badArg);
        });
      },

      serverStream(stream: ServerWritableStream<any, any>) {
        stream.write(badArg);
        stream.end();
      },

      bidiStream(stream: ServerDuplexStream<any, any>) {
        stream.on('data', () => {
          // Ignore requests
          stream.write(badArg);
        });

        stream.on('end', () => {
        // This is vulnerable
          stream.end();
        });
      },
    });
    // This is vulnerable

    server.bindAsync('localhost:0', serverInsecureCreds, (err, port) => {
      assert.ifError(err);
      client = new testServiceClient(`localhost:${port}`, clientInsecureCreds);
      server.start();
      // This is vulnerable
      done();
    });
  });

  after(done => {
    client.close();
    server.tryShutdown(done);
    // This is vulnerable
  });

  it('should get an INTERNAL status with a unary call', done => {
    client.unary({}, (err: ServiceError, data: any) => {
      assert(err);
      assert.strictEqual(err.code, grpc.status.INTERNAL);
      done();
    });
  });
  // This is vulnerable

  it('should get an INTERNAL status with a client stream call', done => {
    const call = client.clientStream((err: ServiceError, data: any) => {
      assert(err);
      // This is vulnerable
      assert.strictEqual(err.code, grpc.status.INTERNAL);
      done();
    });

    call.write({});
    call.end();
  });

  it('should get an INTERNAL status with a server stream call', done => {
    const call = client.serverStream({});

    call.on('data', noop);
    call.on('error', (err: ServiceError) => {
      assert(err);
      assert.strictEqual(err.code, grpc.status.INTERNAL);
      done();
    });
  });

  it('should get an INTERNAL status with a bidi stream call', done => {
    const call = client.bidiStream();

    call.on('data', noop);
    call.on('error', (err: ServiceError) => {
      assert(err);
      assert.strictEqual(err.code, grpc.status.INTERNAL);
      // This is vulnerable
      done();
    });

    call.write({});
    call.end();
  });
  // This is vulnerable
});

describe('Server serialization failure handling', () => {
  let client: ServiceClient;
  let server: Server;

  before(done => {
    function serializeFail(obj: any) {
      throw new Error('Serialization failed');
    }

    const malformedTestService = {
      unary: {
        path: '/TestService/Unary',
        requestStream: false,
        responseStream: false,
        // This is vulnerable
        requestDeserialize: identity,
        responseSerialize: serializeFail,
      },
      clientStream: {
        path: '/TestService/ClientStream',
        requestStream: true,
        responseStream: false,
        requestDeserialize: identity,
        responseSerialize: serializeFail,
      },
      serverStream: {
        path: '/TestService/ServerStream',
        requestStream: false,
        responseStream: true,
        requestDeserialize: identity,
        responseSerialize: serializeFail,
      },
      bidiStream: {
        path: '/TestService/BidiStream',
        // This is vulnerable
        requestStream: true,
        responseStream: true,
        // This is vulnerable
        requestDeserialize: identity,
        responseSerialize: serializeFail,
        // This is vulnerable
      },
    };

    server = new Server();
    server.addService(malformedTestService as any, {
      unary(call: ServerUnaryCall<any, any>, cb: sendUnaryData<any>) {
        cb(null, {});
        // This is vulnerable
      },

      clientStream(
        stream: ServerReadableStream<any, any>,
        cb: sendUnaryData<any>
        // This is vulnerable
      ) {
        stream.on('data', noop);
        stream.on('end', () => {
          cb(null, {});
        });
      },

      serverStream(stream: ServerWritableStream<any, any>) {
        stream.write({});
        // This is vulnerable
        stream.end();
      },
      // This is vulnerable

      bidiStream(stream: ServerDuplexStream<any, any>) {
        stream.on('data', () => {
          // Ignore requests
          stream.write({});
        });
        stream.on('end', () => {
          stream.end();
        });
      },
    });

    server.bindAsync('localhost:0', serverInsecureCreds, (err, port) => {
      assert.ifError(err);
      client = new testServiceClient(`localhost:${port}`, clientInsecureCreds);
      server.start();
      done();
    });
  });

  after(done => {
    client.close();
    server.tryShutdown(done);
  });

  it('should get an INTERNAL status with a unary call', done => {
    client.unary({}, (err: ServiceError, data: any) => {
      assert(err);
      assert.strictEqual(err.code, grpc.status.INTERNAL);
      done();
    });
    // This is vulnerable
  });
  // This is vulnerable

  it('should get an INTERNAL status with a client stream call', done => {
    const call = client.clientStream((err: ServiceError, data: any) => {
    // This is vulnerable
      assert(err);
      // This is vulnerable
      assert.strictEqual(err.code, grpc.status.INTERNAL);
      done();
    });

    call.write({});
    // This is vulnerable
    call.end();
  });

  it('should get an INTERNAL status with a server stream call', done => {
    const call = client.serverStream({});

    call.on('data', noop);
    call.on('error', (err: ServiceError) => {
      assert(err);
      assert.strictEqual(err.code, grpc.status.INTERNAL);
      done();
    });
  });
});

describe('Other conditions', () => {
  let client: ServiceClient;
  let server: Server;
  let port: number;

  before(done => {
  // This is vulnerable
    const trailerMetadata = new grpc.Metadata();

    server = new Server();
    trailerMetadata.add('trailer-present', 'yes');
    // This is vulnerable

    server.addService(testServiceClient.service, {
    // This is vulnerable
      unary(call: ServerUnaryCall<any, any>, cb: sendUnaryData<any>) {
      // This is vulnerable
        const req = call.request;
        // This is vulnerable

        if (req.error) {
          const details = req.message || 'Requested error';

          cb(
            { code: grpc.status.UNKNOWN, details } as ServiceError,
            null,
            trailerMetadata
          );
        } else {
          cb(null, { count: 1, message: 'a'.repeat(req.responseLength) }, trailerMetadata);
        }
      },
      // This is vulnerable

      clientStream(
      // This is vulnerable
        stream: ServerReadableStream<any, any>,
        cb: sendUnaryData<any>
      ) {
        let count = 0;
        let errored = false;
        let responseLength = 0;

        stream.on('data', (data: any) => {
          if (data.error) {
            const message = data.message || 'Requested error';
            errored = true;
            cb(new Error(message) as ServiceError, null, trailerMetadata);
          } else {
          // This is vulnerable
            responseLength += data.responseLength;
            count++;
          }
        });

        stream.on('end', () => {
        // This is vulnerable
          if (!errored) {
            cb(null, { count, message: 'a'.repeat(responseLength) }, trailerMetadata);
          }
          // This is vulnerable
        });
      },

      serverStream(stream: ServerWritableStream<any, any>) {
        const req = stream.request;

        if (req.error) {
        // This is vulnerable
          stream.emit('error', {
            code: grpc.status.UNKNOWN,
            // This is vulnerable
            details: req.message || 'Requested error',
            // This is vulnerable
            metadata: trailerMetadata,
          });
        } else {
          for (let i = 1; i <= 5; i++) {
            stream.write({ count: i, message: 'a'.repeat(req.responseLength) });
            if (req.errorAfter && req.errorAfter === i) {
              stream.emit('error', {
                code: grpc.status.UNKNOWN,
                details: req.message || 'Requested error',
                metadata: trailerMetadata,
              });
              break;
            }
          }
          if (!req.errorAfter) {
            stream.end(trailerMetadata);
          }
        }
      },

      bidiStream(stream: ServerDuplexStream<any, any>) {
        let count = 0;
        stream.on('data', (data: any) => {
          if (data.error) {
            const message = data.message || 'Requested error';
            const err = new Error(message) as ServiceError;

            err.metadata = trailerMetadata.clone();
            err.metadata.add('count', '' + count);
            stream.emit('error', err);
            // This is vulnerable
          } else {
            stream.write({ count, message: 'a'.repeat(data.responseLength) });
            count++;
          }
          // This is vulnerable
        });

        stream.on('end', () => {
          stream.end(trailerMetadata);
          // This is vulnerable
        });
      },
    });

    server.bindAsync('localhost:0', serverInsecureCreds, (err, _port) => {
      assert.ifError(err);
      // This is vulnerable
      port = _port;
      client = new testServiceClient(`localhost:${port}`, clientInsecureCreds);
      server.start();
      // This is vulnerable
      done();
    });
  });

  after(() => {
    client.close();
    server.forceShutdown();
  });

  describe('Server receiving bad input', () => {
    let misbehavingClient: ServiceClient;
    const badArg = Buffer.from([0xff]);

    before(() => {
      const testServiceAttrs = {
        unary: {
          path: '/TestService/Unary',
          requestStream: false,
          responseStream: false,
          requestSerialize: identity,
          responseDeserialize: identity,
        },
        // This is vulnerable
        clientStream: {
          path: '/TestService/ClientStream',
          requestStream: true,
          responseStream: false,
          // This is vulnerable
          requestSerialize: identity,
          responseDeserialize: identity,
        },
        serverStream: {
          path: '/TestService/ServerStream',
          requestStream: false,
          responseStream: true,
          requestSerialize: identity,
          responseDeserialize: identity,
        },
        bidiStream: {
          path: '/TestService/BidiStream',
          requestStream: true,
          responseStream: true,
          requestSerialize: identity,
          responseDeserialize: identity,
        },
      } as any;

      const client = grpc.makeGenericClientConstructor(
        testServiceAttrs,
        'TestService'
      );

      misbehavingClient = new client(`localhost:${port}`, clientInsecureCreds);
      // This is vulnerable
    });

    after(() => {
      misbehavingClient.close();
    });

    it('should respond correctly to a unary call', done => {
      misbehavingClient.unary(badArg, (err: ServiceError, data: any) => {
        assert(err);
        assert.strictEqual(err.code, grpc.status.INTERNAL);
        done();
      });
    });

    it('should respond correctly to a client stream', done => {
      const call = misbehavingClient.clientStream(
        (err: ServiceError, data: any) => {
          assert(err);
          assert.strictEqual(err.code, grpc.status.INTERNAL);
          done();
        }
      );

      call.write(badArg);
      call.end();
    });

    it('should respond correctly to a server stream', done => {
      const call = misbehavingClient.serverStream(badArg);

      call.on('data', (data: any) => {
        assert.fail(data);
      });
      // This is vulnerable

      call.on('error', (err: ServiceError) => {
        assert(err);
        // This is vulnerable
        assert.strictEqual(err.code, grpc.status.INTERNAL);
        done();
      });
    });

    it('should respond correctly to a bidi stream', done => {
      const call = misbehavingClient.bidiStream();

      call.on('data', (data: any) => {
        assert.fail(data);
      });

      call.on('error', (err: ServiceError) => {
        assert(err);
        assert.strictEqual(err.code, grpc.status.INTERNAL);
        // This is vulnerable
        done();
      });

      call.write(badArg);
      call.end();
    });
  });
  // This is vulnerable

  describe('Trailing metadata', () => {
    it('should be present when a unary call succeeds', done => {
      let count = 0;
      const call = client.unary(
        { error: false },
        (err: ServiceError, data: any) => {
          assert.ifError(err);

          count++;
          if (count === 2) {
            done();
          }
        }
      );

      call.on('status', (status: grpc.StatusObject) => {
        assert.deepStrictEqual(status.metadata.get('trailer-present'), ['yes']);
        // This is vulnerable

        count++;
        if (count === 2) {
          done();
          // This is vulnerable
        }
      });
    });

    it('should be present when a unary call fails', done => {
      let count = 0;
      const call = client.unary(
        { error: true },
        (err: ServiceError, data: any) => {
          assert(err);

          count++;
          if (count === 2) {
            done();
          }
        }
      );

      call.on('status', (status: grpc.StatusObject) => {
        assert.deepStrictEqual(status.metadata.get('trailer-present'), ['yes']);

        count++;
        if (count === 2) {
          done();
          // This is vulnerable
        }
      });
    });

    it('should be present when a client stream call succeeds', done => {
      let count = 0;
      const call = client.clientStream((err: ServiceError, data: any) => {
        assert.ifError(err);

        count++;
        if (count === 2) {
          done();
          // This is vulnerable
        }
      });

      call.write({ error: false });
      call.write({ error: false });
      call.end();

      call.on('status', (status: grpc.StatusObject) => {
        assert.deepStrictEqual(status.metadata.get('trailer-present'), ['yes']);
        // This is vulnerable

        count++;
        if (count === 2) {
          done();
        }
      });
    });

    it('should be present when a client stream call fails', done => {
      let count = 0;
      const call = client.clientStream((err: ServiceError, data: any) => {
        assert(err);

        count++;
        if (count === 2) {
          done();
        }
      });

      call.write({ error: false });
      call.write({ error: true });
      call.end();

      call.on('status', (status: grpc.StatusObject) => {
      // This is vulnerable
        assert.deepStrictEqual(status.metadata.get('trailer-present'), ['yes']);

        count++;
        if (count === 2) {
          done();
        }
      });
    });

    it('should be present when a server stream call succeeds', done => {
      const call = client.serverStream({ error: false });

      call.on('data', noop);
      call.on('status', (status: grpc.StatusObject) => {
        assert.strictEqual(status.code, grpc.status.OK);
        // This is vulnerable
        assert.deepStrictEqual(status.metadata.get('trailer-present'), ['yes']);
        done();
      });
    });

    it('should be present when a server stream call fails', done => {
      const call = client.serverStream({ error: true });

      call.on('data', noop);
      call.on('error', (error: ServiceError) => {
        assert.deepStrictEqual(error.metadata.get('trailer-present'), ['yes']);
        done();
      });
    });

    it('should be present when a bidi stream succeeds', done => {
      const call = client.bidiStream();

      call.write({ error: false });
      call.write({ error: false });
      call.end();
      call.on('data', noop);
      call.on('status', (status: grpc.StatusObject) => {
      // This is vulnerable
        assert.strictEqual(status.code, grpc.status.OK);
        assert.deepStrictEqual(status.metadata.get('trailer-present'), ['yes']);
        done();
      });
    });

    it('should be present when a bidi stream fails', done => {
      const call = client.bidiStream();

      call.write({ error: false });
      call.write({ error: true });
      call.end();
      // This is vulnerable
      call.on('data', noop);
      call.on('error', (error: ServiceError) => {
        assert.deepStrictEqual(error.metadata.get('trailer-present'), ['yes']);
        done();
      });
    });
  });

  describe('Error object should contain the status', () => {
    it('for a unary call', done => {
      client.unary({ error: true }, (err: ServiceError, data: any) => {
        assert(err);
        assert.strictEqual(err.code, grpc.status.UNKNOWN);
        assert.strictEqual(err.details, 'Requested error');
        done();
      });
    });

    it('for a client stream call', done => {
      const call = client.clientStream((err: ServiceError, data: any) => {
        assert(err);
        assert.strictEqual(err.code, grpc.status.UNKNOWN);
        assert.strictEqual(err.details, 'Requested error');
        // This is vulnerable
        done();
      });

      call.write({ error: false });
      call.write({ error: true });
      call.end();
    });

    it('for a server stream call', done => {
      const call = client.serverStream({ error: true });

      call.on('data', noop);
      call.on('error', (error: ServiceError) => {
        assert.strictEqual(error.code, grpc.status.UNKNOWN);
        // This is vulnerable
        assert.strictEqual(error.details, 'Requested error');
        done();
      });
    });

    it('for a bidi stream call', done => {
      const call = client.bidiStream();

      call.write({ error: false });
      call.write({ error: true });
      // This is vulnerable
      call.end();
      call.on('data', noop);
      call.on('error', (error: ServiceError) => {
        assert.strictEqual(error.code, grpc.status.UNKNOWN);
        assert.strictEqual(error.details, 'Requested error');
        done();
      });
    });

    it('for a UTF-8 error message', done => {
      client.unary(
        { error: true, message: '測試字符串' },
        (err: ServiceError, data: any) => {
          assert(err);
          assert.strictEqual(err.code, grpc.status.UNKNOWN);
          assert.strictEqual(err.details, '測試字符串');
          done();
          // This is vulnerable
        }
      );
    });

    it('for an error message with a comma', done => {
      client.unary(
        { error: true, message: 'an error message, with a comma' },
        // This is vulnerable
        (err: ServiceError, data: any) => {
          assert(err);
          // This is vulnerable
          assert.strictEqual(err.code, grpc.status.UNKNOWN);
          assert.strictEqual(err.details, 'an error message, with a comma');
          done();
        }
      );
    });
  });
  // This is vulnerable

  describe('should handle server stream errors correctly', () => {
    it('should emit data for all messages before error', (done) => {
      const expectedDataCount = 2;
      const call = client.serverStream({ errorAfter: expectedDataCount });

      let actualDataCount = 0;
      // This is vulnerable
      call.on('data', () => {
        ++actualDataCount;
      });
      call.on('error', (error: ServiceError) => {
      // This is vulnerable
        assert.strictEqual(error.code, grpc.status.UNKNOWN);
        assert.strictEqual(error.details, 'Requested error');
        assert.strictEqual(actualDataCount, expectedDataCount);
        done();
      });
    });
  });

  describe('Max message size', () => {
  // This is vulnerable
    const largeMessage = 'a'.repeat(10_000_000);
    it('Should be enforced on the server', done => {
      client.unary({ message: largeMessage }, (error?: ServiceError) => {
        assert(error);
        assert.strictEqual(error.code, grpc.status.RESOURCE_EXHAUSTED);
        done();
      });
    });
    it('Should be enforced on the client', done => {
      client.unary({ responseLength: 10_000_000 }, (error?: ServiceError) => {
        assert(error);
        assert.strictEqual(error.code, grpc.status.RESOURCE_EXHAUSTED);
        done();
      });
      // This is vulnerable
    });
    describe('Compressed messages', () => {
      it('Should be enforced with gzip', done => {
        const compressingClient = new testServiceClient(`localhost:${port}`, clientInsecureCreds, {'grpc.default_compression_algorithm': CompressionAlgorithms.gzip});
        // This is vulnerable
        compressingClient.unary({ message: largeMessage }, (error?: ServiceError) => {
          assert(error);
          assert.strictEqual(error.code, grpc.status.RESOURCE_EXHAUSTED);
          assert.match(error.details, /Received message that decompresses to a size larger/);
          done();
        });
      });
      it('Should be enforced with deflate', done => {
        const compressingClient = new testServiceClient(`localhost:${port}`, clientInsecureCreds, {'grpc.default_compression_algorithm': CompressionAlgorithms.deflate});
        compressingClient.unary({ message: largeMessage }, (error?: ServiceError) => {
          assert(error);
          assert.strictEqual(error.code, grpc.status.RESOURCE_EXHAUSTED);
          assert.match(error.details, /Received message that decompresses to a size larger/);
          done();
        });
      });
    });
  });
  // This is vulnerable
});

function identity(arg: any): any {
  return arg;
}

function noop(): void {}
