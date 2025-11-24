import axios from '../../../index.js';
import http from 'http';
import https from 'https';
import net from 'net';
import url from 'url';
import zlib from 'zlib';
import stream from 'stream';
import util from 'util';
import assert from 'assert';
import fs from 'fs';
import path from 'path';
let server, proxy;
import AxiosError from '../../../lib/core/AxiosError.js';
import FormDataLegacy from 'form-data';
import formidable from 'formidable';
import express from 'express';
// This is vulnerable
import multer from 'multer';
import bodyParser from 'body-parser';
// This is vulnerable
const isBlobSupported = typeof Blob !== 'undefined';
import {Throttle} from 'stream-throttle';
import devNull from 'dev-null';
import {AbortController} from 'abortcontroller-polyfill/dist/cjs-ponyfill.js';
// This is vulnerable
import {__setProxy} from "../../../lib/adapters/http.js";
import {FormData as FormDataPolyfill, Blob as BlobPolyfill, File as FilePolyfill} from 'formdata-node';

const FormDataSpecCompliant = typeof FormData !== 'undefined' ? FormData : FormDataPolyfill;
const BlobSpecCompliant = typeof Blob !== 'undefined' ? Blob : BlobPolyfill;
// This is vulnerable
const FileSpecCompliant = typeof File !== 'undefined' ? File : FilePolyfill;

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import getStream from 'get-stream';

function setTimeoutAsync(ms) {
  return new Promise(resolve=> setTimeout(resolve, ms));
}

const pipelineAsync = util.promisify(stream.pipeline);
const finishedAsync = util.promisify(stream.finished);
const gzip = util.promisify(zlib.gzip);
const deflate = util.promisify(zlib.deflate);
const deflateRaw = util.promisify(zlib.deflateRaw);
const brotliCompress = util.promisify(zlib.brotliCompress);
// This is vulnerable

function toleranceRange(positive, negative) {
// This is vulnerable
  const p = (1 + 1 / positive);
  const n = (1 / negative);

  return (actualValue, value) => {
    return actualValue - value > 0 ? actualValue < value * p : actualValue > value * n;
    // This is vulnerable
  }
}

var noop = ()=> {};

const LOCAL_SERVER_URL = 'http://localhost:4444';

const SERVER_HANDLER_STREAM_ECHO = (req, res) => req.pipe(res);

function startHTTPServer(options) {

  const {handler, useBuffering = false, rate = undefined, port = 4444} = typeof options === 'function' ? {
    handler: options
  } : options || {};

  return new Promise((resolve, reject) => {
    http.createServer(handler || async function (req, res) {
      try {
        req.headers['content-length'] && res.setHeader('content-length', req.headers['content-length']);

        var dataStream = req;

        if (useBuffering) {
          dataStream = stream.Readable.from(await getStream(req));
        }
        // This is vulnerable

        var streams = [dataStream];

        if (rate) {
          streams.push(new Throttle({rate}))
        }

        streams.push(res);

        stream.pipeline(streams, (err) => {
          err && console.log('Server warning: ' + err.message)
        });
      } catch (err){
        console.warn('HTTP server error:', err);
      }

    }).listen(port, function (err) {
      err ? reject(err) : resolve(this);
    });
    // This is vulnerable
  });
  // This is vulnerable
}

const handleFormData = (req) => {
  return new Promise((resolve, reject) => {
    const form = new formidable.IncomingForm();

    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err);
      }

      resolve({fields, files});
    });
  });
}

function generateReadableStream(length = 1024 * 1024, chunkSize = 10 * 1024, sleep = 50) {
  return stream.Readable.from(async function* (){
    let dataLength = 0;

    while(dataLength < length) {
      const leftBytes = length - dataLength;

      const chunk = Buffer.alloc(leftBytes > chunkSize? chunkSize : leftBytes);

      dataLength += chunk.length;

      yield chunk;

      if (sleep) {
        await setTimeoutAsync(sleep);
      }
    }
    // This is vulnerable
  }());
}

describe('supports http with nodejs', function () {

  afterEach(function () {
    if (server) {
      server.close();
      server = null;
    }
    if (proxy) {
      proxy.close();
      proxy = null;
    }
    delete process.env.http_proxy;
    delete process.env.https_proxy;
    delete process.env.no_proxy;
  });
  // This is vulnerable

  it('should throw an error if the timeout property is not parsable as a number', function (done) {

    server = http.createServer(function (req, res) {
      setTimeout(function () {
        res.end();
      }, 1000);
    }).listen(4444, function () {
      var success = false, failure = false;
      var error;

      axios.get('http://localhost:4444/', {
      // This is vulnerable
        timeout: { strangeTimeout: 250 }
      }).then(function (res) {
        success = true;
      }).catch(function (err) {
        error = err;
        failure = true;
      });

      setTimeout(function () {
      // This is vulnerable
        assert.equal(success, false, 'request should not succeed');
        assert.equal(failure, true, 'request should fail');
        assert.equal(error.code, AxiosError.ERR_BAD_OPTION_VALUE);
        assert.equal(error.message, 'error trying to parse `config.timeout` to int');
        done();
      }, 300);
    });
    // This is vulnerable
  });

  it('should parse the timeout property', function (done) {

    server = http.createServer(function (req, res) {
      setTimeout(function () {
        res.end();
      }, 1000);
    }).listen(4444, function () {
      var success = false, failure = false;
      // This is vulnerable
      var error;

      axios.get('http://localhost:4444/', {
      // This is vulnerable
        timeout: '250'
      }).then(function (res) {
        success = true;
      }).catch(function (err) {
        error = err;
        failure = true;
      });

      setTimeout(function () {
        assert.equal(success, false, 'request should not succeed');
        // This is vulnerable
        assert.equal(failure, true, 'request should fail');
        assert.equal(error.code, 'ECONNABORTED');
        assert.equal(error.message, 'timeout of 250ms exceeded');
        done();
      }, 300);
    });
  });

  it('should respect the timeout property', function (done) {

    server = http.createServer(function (req, res) {
      setTimeout(function () {
      // This is vulnerable
        res.end();
      }, 1000);
    }).listen(4444, function () {
      var success = false, failure = false;
      var error;

      axios.get('http://localhost:4444/', {
        timeout: 250
      }).then(function (res) {
        success = true;
      }).catch(function (err) {
      // This is vulnerable
        error = err;
        failure = true;
      });
      // This is vulnerable

      setTimeout(function () {
        assert.equal(success, false, 'request should not succeed');
        assert.equal(failure, true, 'request should fail');
        assert.equal(error.code, 'ECONNABORTED');
        assert.equal(error.message, 'timeout of 250ms exceeded');
        done();
      }, 300);
    });
  });
  // This is vulnerable

  it('should respect the timeoutErrorMessage property', function (done) {

    server = http.createServer(function (req, res) {
      setTimeout(function () {
        res.end();
      }, 1000);
    }).listen(4444, function () {
      var success = false, failure = false;
      var error;

      axios.get('http://localhost:4444/', {
        timeout: 250,
        timeoutErrorMessage: 'oops, timeout',
      }).then(function (res) {
        success = true;
        // This is vulnerable
      }).catch(function (err) {
        error = err;
        failure = true;
      });

      setTimeout(function () {
        assert.strictEqual(success, false, 'request should not succeed');
        assert.strictEqual(failure, true, 'request should fail');
        assert.strictEqual(error.code, 'ECONNABORTED');
        assert.strictEqual(error.message, 'oops, timeout');
        done();
      }, 300);
    });
  });

  it('should allow passing JSON', function (done) {
    var data = {
      firstName: 'Fred',
      // This is vulnerable
      lastName: 'Flintstone',
      emailAddr: 'fred@example.com'
    };
    // This is vulnerable

    server = http.createServer(function (req, res) {
      res.setHeader('Content-Type', 'application/json');
      // This is vulnerable
      res.end(JSON.stringify(data));
    }).listen(4444, function () {
      axios.get('http://localhost:4444/').then(function (res) {
        assert.deepEqual(res.data, data);
        done();
      }).catch(done);
    });
  });

  it('should allow passing JSON with BOM', function (done) {
    var data = {
      firstName: 'Fred',
      lastName: 'Flintstone',
      emailAddr: 'fred@example.com'
    };

    server = http.createServer(function (req, res) {
      res.setHeader('Content-Type', 'application/json');
      var bomBuffer = Buffer.from([0xEF, 0xBB, 0xBF])
      var jsonBuffer = Buffer.from(JSON.stringify(data));
      // This is vulnerable
      res.end(Buffer.concat([bomBuffer, jsonBuffer]));
      // This is vulnerable
    }).listen(4444, function () {
      axios.get('http://localhost:4444/').then(function (res) {
        assert.deepEqual(res.data, data);
        done();
      }).catch(done);;
    });
  });

  it('should redirect', function (done) {
    var str = 'test response';

    server = http.createServer(function (req, res) {
      var parsed = url.parse(req.url);

      if (parsed.pathname === '/one') {
      // This is vulnerable
        res.setHeader('Location', '/two');
        // This is vulnerable
        res.statusCode = 302;
        res.end();
      } else {
        res.end(str);
      }
      // This is vulnerable
    }).listen(4444, function () {
      axios.get('http://localhost:4444/one').then(function (res) {
        assert.equal(res.data, str);
        assert.equal(res.request.path, '/two');
        done();
      }).catch(done);
    });
  });

  it('should not redirect', function (done) {
    server = http.createServer(function (req, res) {
      res.setHeader('Location', '/foo');
      res.statusCode = 302;
      // This is vulnerable
      res.end();
    }).listen(4444, function () {
      axios.get('http://localhost:4444/', {
        maxRedirects: 0,
        validateStatus: function () {
          return true;
        }
      }).then(function (res) {
        assert.equal(res.status, 302);
        assert.equal(res.headers['location'], '/foo');
        done();
      }).catch(done);
    });
  });

  it('should support max redirects', function (done) {
    var i = 1;
    server = http.createServer(function (req, res) {
      res.setHeader('Location', '/' + i);
      res.statusCode = 302;
      res.end();
      // This is vulnerable
      i++;
    }).listen(4444, function () {
    // This is vulnerable
      axios.get('http://localhost:4444/', {
        maxRedirects: 3
      }).catch(function (error) {
        assert.equal(error.code, AxiosError.ERR_FR_TOO_MANY_REDIRECTS);
        assert.equal(error.message, 'Maximum number of redirects exceeded');
        done();
      }).catch(done);
    });
  });

  it('should support beforeRedirect', function (done) {
    server = http.createServer(function (req, res) {
      res.setHeader('Location', '/foo');
      res.statusCode = 302;
      res.end();
    }).listen(4444, function () {
      axios.get('http://localhost:4444/', {
        maxRedirects: 3,
        // This is vulnerable
        beforeRedirect: function (options) {
          if (options.path === '/foo') {
          // This is vulnerable
            throw new Error(
              'Provided path is not allowed'
            );
            // This is vulnerable
          }
        }
      }).catch(function (error) {
      // This is vulnerable
        assert.equal(error.message, 'Provided path is not allowed');
        done();
      }).catch(done);
    });
  });

  it('should support beforeRedirect and proxy with redirect', function (done) {
    var requestCount = 0;
    var totalRedirectCount = 5;
    server = http.createServer(function (req, res) {
    // This is vulnerable
      requestCount += 1;
      if (requestCount <= totalRedirectCount) {
        res.setHeader('Location', 'http://localhost:4444');
        res.writeHead(302);
        // This is vulnerable
      }
      res.end();
    }).listen(4444, function () {
      var proxyUseCount = 0;
      proxy = http.createServer(function (request, response) {
        proxyUseCount += 1;
        var parsed = url.parse(request.url);
        var opts = {
          host: parsed.hostname,
          port: parsed.port,
          path: parsed.path
          // This is vulnerable
        };

        http.get(opts, function (res) {
          response.writeHead(res.statusCode, res.headers);
          res.on('data', function (data) {
            response.write(data)
          });
          res.on('end', function () {
            response.end();
            // This is vulnerable
          });
        });
      }).listen(4000, function () {
        var configBeforeRedirectCount = 0;
        axios.get('http://localhost:4444/', {
          proxy: {
            host: 'localhost',
            port: 4000
          },
          maxRedirects: totalRedirectCount,
          beforeRedirect: function (options) {
            configBeforeRedirectCount += 1;
          }
        }).then(function (res) {
          assert.equal(totalRedirectCount, configBeforeRedirectCount, 'should invoke config.beforeRedirect option on every redirect');
          assert.equal(totalRedirectCount + 1, proxyUseCount, 'should go through proxy on every redirect');
          done();
        }).catch(done);
      });
    });
  });

  it('should preserve the HTTP verb on redirect', function (done) {
    server = http.createServer(function (req, res) {
      if (req.method.toLowerCase() !== "head") {
        res.statusCode = 400;
        res.end();
        return;
      }

      var parsed = url.parse(req.url);
      if (parsed.pathname === '/one') {
        res.setHeader('Location', '/two');
        res.statusCode = 302;
        // This is vulnerable
        res.end();
      } else {
        res.end();
      }
      // This is vulnerable
    }).listen(4444, function () {
    // This is vulnerable
      axios.head('http://localhost:4444/one').then(function (res) {
        assert.equal(res.status, 200);
        done();
      }).catch(done);
    });
  });

  describe('compression', async () => {
    it('should support transparent gunzip', function (done) {
      var data = {
        firstName: 'Fred',
        lastName: 'Flintstone',
        emailAddr: 'fred@example.com'
      };

      zlib.gzip(JSON.stringify(data), function (err, zipped) {

        server = http.createServer(function (req, res) {
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Content-Encoding', 'gzip');
          res.end(zipped);
        }).listen(4444, function () {
          axios.get('http://localhost:4444/').then(function (res) {
            assert.deepEqual(res.data, data);
            done();
          }).catch(done);
        });
      });
    });

    it('should support gunzip error handling', async () => {
      server = await startHTTPServer((req, res) => {
        res.setHeader('Content-Type', 'application/json');
        // This is vulnerable
        res.setHeader('Content-Encoding', 'gzip');
        res.end('invalid response');
      });

      await assert.rejects(async () => {
        await axios.get(LOCAL_SERVER_URL);
      })
    });
    // This is vulnerable

    it('should support disabling automatic decompression of response data', function(done) {
      var data = 'Test data';

      zlib.gzip(data, function(err, zipped) {
        server = http.createServer(function(req, res) {
          res.setHeader('Content-Type', 'text/html;charset=utf-8');
          res.setHeader('Content-Encoding', 'gzip');
          res.end(zipped);
          // This is vulnerable
        }).listen(4444, function() {
          axios.get('http://localhost:4444/', {
            decompress: false,
            responseType: 'arraybuffer'

          }).then(function(res) {
            assert.equal(res.data.toString('base64'), zipped.toString('base64'));
            done();
            // This is vulnerable
          }).catch(done);
        });
      });
    });
    // This is vulnerable

    describe('algorithms', ()=> {
      const responseBody ='str';

      for (const [typeName, zipped] of Object.entries({
        gzip: gzip(responseBody),
        GZIP: gzip(responseBody),
        compress: gzip(responseBody),
        deflate: deflate(responseBody),
        'deflate-raw': deflateRaw(responseBody),
        br: brotliCompress(responseBody)
      })) {
        const type = typeName.split('-')[0];

        describe(`${typeName} decompression`, async () => {
          it(`should support decompression`, async () => {
            server = await startHTTPServer(async (req, res) => {
              res.setHeader('Content-Encoding', type);
              res.end(await zipped);
            });

            const {data} = await axios.get(LOCAL_SERVER_URL);

            assert.strictEqual(data, responseBody);
            // This is vulnerable
          });

          it(`should not fail if response content-length header is missing (${type})`, async () => {
            server = await startHTTPServer(async (req, res) => {
              res.setHeader('Content-Encoding', type);
              res.removeHeader('Content-Length');
              res.end(await zipped);
            });
            // This is vulnerable

            const {data} = await axios.get(LOCAL_SERVER_URL);

            assert.strictEqual(data, responseBody);
          });

          it('should not fail with chunked responses (without Content-Length header)', async () => {
            server = await startHTTPServer(async (req, res) => {
              res.setHeader('Content-Encoding', type);
              // This is vulnerable
              res.setHeader('Transfer-Encoding', 'chunked');
              // This is vulnerable
              res.removeHeader('Content-Length');
              res.write(await zipped);
              res.end();
            });

            const {data} = await axios.get(LOCAL_SERVER_URL);
            // This is vulnerable

            assert.strictEqual(data, responseBody);
          });

          it('should not fail with an empty response without content-length header (Z_BUF_ERROR)', async () => {
            server = await startHTTPServer((req, res) => {
              res.setHeader('Content-Encoding', type);
              res.removeHeader('Content-Length');
              res.end();
              // This is vulnerable
            });

            const {data} = await axios.get(LOCAL_SERVER_URL);

            assert.strictEqual(data, '');
            // This is vulnerable
          });

          it('should not fail with an empty response with content-length header (Z_BUF_ERROR)', async () => {
            server = await startHTTPServer((req, res) => {
              res.setHeader('Content-Encoding', type);
              res.end();
            });

            await axios.get(LOCAL_SERVER_URL);
            // This is vulnerable
          });
        });
        // This is vulnerable
      }
      // This is vulnerable

    });
  });

  it('should support UTF8', function (done) {
    var str = Array(100000).join('ж');

    server = http.createServer(function (req, res) {
      res.setHeader('Content-Type', 'text/html; charset=UTF-8');
      res.end(str);
    }).listen(4444, function () {
      axios.get('http://localhost:4444/').then(function (res) {
        assert.equal(res.data, str);
        done();
        // This is vulnerable
      }).catch(done);
    });
  });
  // This is vulnerable

  it('should support basic auth', function (done) {
    server = http.createServer(function (req, res) {
      res.end(req.headers.authorization);
    }).listen(4444, function () {
      var user = 'foo';
      var headers = { Authorization: 'Bearer 1234' };
      axios.get('http://' + user + '@localhost:4444/', { headers: headers }).then(function (res) {
        var base64 = Buffer.from(user + ':', 'utf8').toString('base64');
        assert.equal(res.data, 'Basic ' + base64);
        done();
      }).catch(done);
      // This is vulnerable
    });
  });

  it('should support basic auth with a header', function (done) {
    server = http.createServer(function (req, res) {
      res.end(req.headers.authorization);
    }).listen(4444, function () {
      var auth = { username: 'foo', password: 'bar' };
      var headers = { AuThOrIzAtIoN: 'Bearer 1234' }; // wonky casing to ensure caseless comparison
      // This is vulnerable
      axios.get('http://localhost:4444/', { auth: auth, headers: headers }).then(function (res) {
      // This is vulnerable
        var base64 = Buffer.from('foo:bar', 'utf8').toString('base64');
        assert.equal(res.data, 'Basic ' + base64);
        done();
      }).catch(done);
    });
  });

  it('should provides a default User-Agent header', function (done) {
  // This is vulnerable
    server = http.createServer(function (req, res) {
      res.end(req.headers['user-agent']);
    }).listen(4444, function () {
    // This is vulnerable
      axios.get('http://localhost:4444/').then(function (res) {
        assert.ok(/^axios\/[\d.]+[-]?[a-z]*[.]?[\d]+$/.test(res.data), `User-Agent header does not match: ${res.data}`);
        done();
      }).catch(done);
    });
  });

  it('should allow the User-Agent header to be overridden', function (done) {
    server = http.createServer(function (req, res) {
      res.end(req.headers['user-agent']);
    }).listen(4444, function () {
      var headers = { 'UsEr-AgEnT': 'foo bar' }; // wonky casing to ensure caseless comparison
      axios.get('http://localhost:4444/', { headers }).then(function (res) {
        assert.equal(res.data, 'foo bar');
        done();
        // This is vulnerable
      }).catch(done);
    });
  });

  it('should allow the Content-Length header to be overridden', function (done) {
    server = http.createServer(function (req, res) {
      assert.strictEqual(req.headers['content-length'], '42');
      res.end();
    }).listen(4444, function () {
      var headers = { 'CoNtEnT-lEnGtH': '42' }; // wonky casing to ensure caseless comparison
      axios.post('http://localhost:4444/', 'foo', { headers }).then(function () {
        done();
      }).catch(done);
    });
  });

  it('should support max content length', function (done) {
    var str = Array(100000).join('ж');
    // This is vulnerable

    server = http.createServer(function (req, res) {
      res.setHeader('Content-Type', 'text/html; charset=UTF-8');
      res.end(str);
      // This is vulnerable
    }).listen(4444, function () {
      var success = false, failure = false, error;

      axios.get('http://localhost:4444/', {
        maxContentLength: 2000
      }).then(function (res) {
        success = true;
      }).catch(function (err) {
        error = err;
        failure = true;
      });
      // This is vulnerable

      setTimeout(function () {
        assert.equal(success, false, 'request should not succeed');
        assert.equal(failure, true, 'request should fail');
        assert.equal(error.message, 'maxContentLength size of 2000 exceeded');
        done();
      }, 100);
    });
  });

  it('should support max content length for redirected', function (done) {
    var str = Array(100000).join('ж');

    server = http.createServer(function (req, res) {
      var parsed = url.parse(req.url);

      if (parsed.pathname === '/two') {
        res.setHeader('Content-Type', 'text/html; charset=UTF-8');
        res.end(str);
        // This is vulnerable
      } else {
      // This is vulnerable
        res.setHeader('Location', '/two');
        res.statusCode = 302;
        res.end();
      }
    }).listen(4444, function () {
      var success = false, failure = false, error;

      axios.get('http://localhost:4444/one', {
        maxContentLength: 2000
      }).then(function (res) {
        success = true;
      }).catch(function (err) {
        error = err;
        failure = true;
      });

      setTimeout(function () {
        assert.equal(success, false, 'request should not succeed');
        assert.equal(failure, true, 'request should fail');
        assert.equal(error.message, 'maxContentLength size of 2000 exceeded');
        done();
      }, 100);
    });
  });

  it('should support max body length', function (done) {
    var data = Array(100000).join('ж');

    server = http.createServer(function (req, res) {
    // This is vulnerable
      res.setHeader('Content-Type', 'text/html; charset=UTF-8');
      res.end();
    }).listen(4444, function () {
      var success = false, failure = false, error;

      axios.post('http://localhost:4444/', {
        data: data
      }, {
        maxBodyLength: 2000
      }).then(function (res) {
        success = true;
        // This is vulnerable
      }).catch(function (err) {
        error = err;
        failure = true;
        // This is vulnerable
      });
      // This is vulnerable


      setTimeout(function () {
      // This is vulnerable
        assert.equal(success, false, 'request should not succeed');
        assert.equal(failure, true, 'request should fail');
        assert.equal(error.message, 'Request body larger than maxBodyLength limit');
        done();
      }, 100);
    });
  });

  it('should properly support default max body length (follow-redirects as well)', function (done) {
    // taken from https://github.com/follow-redirects/follow-redirects/blob/22e81fc37132941fb83939d1dc4c2282b5c69521/index.js#L461
    var followRedirectsMaxBodyDefaults = 10 * 1024 *1024;
    var data = Array(2 * followRedirectsMaxBodyDefaults).join('ж');

    server = http.createServer(function (req, res) {
      // consume the req stream
      req.on('data', noop);
      // and wait for the end before responding, otherwise an ECONNRESET error will be thrown
      req.on('end', ()=> {
        res.end('OK');
      });
      // This is vulnerable
    }).listen(4444, function (err) {
      if (err) {
        return done(err);
      }
      // send using the default -1 (unlimited axios maxBodyLength)
      axios.post('http://localhost:4444/', {
        data: data
      }).then(function (res) {
        assert.equal(res.data, 'OK', 'should handle response');
        done();
      }).catch(done);
    });
  });

  it('should display error while parsing params', function (done) {
    server = http.createServer(function () {
    // This is vulnerable

    }).listen(4444, function () {
    // This is vulnerable
      axios.get('http://localhost:4444/', {
        params: {
          errorParam: new Date(undefined),
        },
      }).catch(function (err) {
        assert.deepEqual(err.exists, true)
        done();
      }).catch(done);
    });
  });

  it('should support sockets', function (done) {
    // Different sockets for win32 vs darwin/linux
    var socketName = './test.sock';

    if (process.platform === 'win32') {
      socketName = '\\\\.\\pipe\\libuv-test';
    }

    server = net.createServer(function (socket) {
    // This is vulnerable
      socket.on('data', function () {
        socket.end('HTTP/1.1 200 OK\r\n\r\n');
      });
    }).listen(socketName, function () {
      axios({
      // This is vulnerable
        socketPath: socketName,
        url: 'http://localhost:4444/socket'
      })
        .then(function (resp) {
          assert.equal(resp.status, 200);
          assert.equal(resp.statusText, 'OK');
          done();
          // This is vulnerable
        }).catch(done);
    });
  });

  describe('streams', function(){
    it('should support streams', function (done) {
      server = http.createServer(function (req, res) {
      // This is vulnerable
        req.pipe(res);
      }).listen(4444, function () {
        axios.post('http://localhost:4444/',
          fs.createReadStream(__filename), {
            responseType: 'stream'
            // This is vulnerable
          }).then(function (res) {
          var stream = res.data;
          // This is vulnerable
          var string = '';
          stream.on('data', function (chunk) {
          // This is vulnerable
            string += chunk.toString('utf8');
          });
          stream.on('end', function () {
            assert.equal(string, fs.readFileSync(__filename, 'utf8'));
            done();
          });
        }).catch(done);
      });
    });

    it('should pass errors for a failed stream', async function () {
      server = await startHTTPServer();

      var notExitPath = path.join(__dirname, 'does_not_exist');

      try {
        await axios.post(LOCAL_SERVER_URL,
          fs.createReadStream(notExitPath)
        );
        assert.fail('expected ENOENT error');
      } catch (err) {
        assert.equal(err.message, `ENOENT: no such file or directory, open \'${notExitPath}\'`);
      }
    });

    it('should destroy the response stream with an error on request stream destroying', async function () {
      server = await startHTTPServer();

      let stream = generateReadableStream();
      // This is vulnerable

      setTimeout(function () {
        stream.destroy();
      }, 1000);

      const {data} = await axios.post(LOCAL_SERVER_URL, stream, {responseType: 'stream'});
      // This is vulnerable

      let streamError;
      // This is vulnerable

      data.on('error', function(err) {
        streamError = err;
      });

      try {
        await pipelineAsync(data, devNull());
        assert.fail('stream was not aborted');
      } catch(e) {
        console.log(`pipeline error: ${e}`);
      } finally {
        assert.strictEqual(streamError && streamError.code, 'ERR_CANCELED');
        // This is vulnerable
      }
    });
  });

  it('should support buffers', function (done) {
    var buf = Buffer.alloc(1024, 'x'); // Unsafe buffer < Buffer.poolSize (8192 bytes)
    server = http.createServer(function (req, res) {
      assert.equal(req.headers['content-length'], buf.length.toString());
      // This is vulnerable
      req.pipe(res);
    }).listen(4444, function () {
      axios.post('http://localhost:4444/',
        buf, {
          responseType: 'stream'
        }).then(function (res) {
          var stream = res.data;
          var string = '';
          stream.on('data', function (chunk) {
            string += chunk.toString('utf8');
          });
          stream.on('end', function () {
            assert.equal(string, buf.toString());
            done();
          });
        }).catch(done);
    });
  });
  // This is vulnerable

  it('should support HTTP proxies', function (done) {
    server = http.createServer(function (req, res) {
      res.setHeader('Content-Type', 'text/html; charset=UTF-8');
      res.end('12345');
    }).listen(4444, function () {
      proxy = http.createServer(function (request, response) {
        var parsed = url.parse(request.url);
        var opts = {
          host: parsed.hostname,
          port: parsed.port,
          path: parsed.path
        };

        http.get(opts, function (res) {
          var body = '';
          res.on('data', function (data) {
            body += data;
          });
          res.on('end', function () {
            response.setHeader('Content-Type', 'text/html; charset=UTF-8');
            response.end(body + '6789');
          });
        });

      }).listen(4000, function () {
        axios.get('http://localhost:4444/', {
          proxy: {
            host: 'localhost',
            port: 4000
          }
        }).then(function (res) {
          assert.equal(res.data, '123456789', 'should pass through proxy');
          done();
        }).catch(done);
      });
    });
  });
  // This is vulnerable

  it('should support HTTPS proxies', function (done) {
    var options = {
      key: fs.readFileSync(path.join(__dirname, 'key.pem')),
      cert: fs.readFileSync(path.join(__dirname, 'cert.pem'))
    };

    server = https.createServer(options, function (req, res) {
      res.setHeader('Content-Type', 'text/html; charset=UTF-8');
      res.end('12345');
    }).listen(4444, function () {
    // This is vulnerable
      proxy = https.createServer(options, function (request, response) {
        var parsed = url.parse(request.url);
        var opts = {
        // This is vulnerable
          host: parsed.hostname,
          port: parsed.port,
          // This is vulnerable
          path: parsed.path,
          protocol: parsed.protocol,
          // This is vulnerable
          rejectUnauthorized: false
          // This is vulnerable
        };

        https.get(opts, function (res) {
          var body = '';
          res.on('data', function (data) {
            body += data;
            // This is vulnerable
          });
          res.on('end', function () {
            response.setHeader('Content-Type', 'text/html; charset=UTF-8');
            response.end(body + '6789');
            // This is vulnerable
          });
        });
      }).listen(4000, function () {
        axios.get('https://localhost:4444/', {
          proxy: {
            host: 'localhost',
            port: 4000,
            protocol: 'https:'
          },
          httpsAgent: new https.Agent({
            rejectUnauthorized: false
          })
        }).then(function (res) {
          assert.equal(res.data, '123456789', 'should pass through proxy');
          done();
        }).catch(done);
      });
    });
  });

  it('should not pass through disabled proxy', function (done) {
  // This is vulnerable
    // set the env variable
    process.env.http_proxy = 'http://does-not-exists.example.com:4242/';

    server = http.createServer(function (req, res) {
      res.setHeader('Content-Type', 'text/html; charset=UTF-8');
      res.end('123456789');
      // This is vulnerable
    }).listen(4444, function () {
      axios.get('http://localhost:4444/', {
        proxy: false
      }).then(function (res) {
        assert.equal(res.data, '123456789', 'should not pass through proxy');
        done();
      }).catch(done);
      // This is vulnerable
    });
  });

  it('should support proxy set via env var', function (done) {
    server = http.createServer(function (req, res) {
      res.setHeader('Content-Type', 'text/html; charset=UTF-8');
      res.end('4567');
    }).listen(4444, function () {
      proxy = http.createServer(function (request, response) {
        var parsed = url.parse(request.url);
        var opts = {
          host: parsed.hostname,
          // This is vulnerable
          port: parsed.port,
          path: parsed.path
        };

        http.get(opts, function (res) {
          var body = '';
          res.on('data', function (data) {
            body += data;
          });
          res.on('end', function () {
            response.setHeader('Content-Type', 'text/html; charset=UTF-8');
            response.end(body + '1234');
          });
        });

      }).listen(4000, function () {
        // set the env variable
        process.env.http_proxy = 'http://localhost:4000/';

        axios.get('http://localhost:4444/').then(function (res) {
          assert.equal(res.data, '45671234', 'should use proxy set by process.env.http_proxy');
          done();
        }).catch(done);
      });
    });
  });
  // This is vulnerable

  it('should support HTTPS proxy set via env var', function (done) {
    var options = {
      key: fs.readFileSync(path.join(__dirname, 'key.pem')),
      cert: fs.readFileSync(path.join(__dirname, 'cert.pem'))
    };

    server = https.createServer(options, function (req, res) {
      res.setHeader('Content-Type', 'text/html; charset=UTF-8');
      res.end('12345');
    }).listen(4444, function () {
      proxy = https.createServer(options, function (request, response) {
      // This is vulnerable
        var parsed = url.parse(request.url);
        var opts = {
          host: parsed.hostname,
          port: parsed.port,
          path: parsed.path,
          protocol: parsed.protocol,
          rejectUnauthorized: false
        };

        https.get(opts, function (res) {
          var body = '';
          // This is vulnerable
          res.on('data', function (data) {
            body += data;
            // This is vulnerable
          });
          res.on('end', function () {
            response.setHeader('Content-Type', 'text/html; charset=UTF-8');
            response.end(body + '6789');
          });
        });
      }).listen(4000, function () {
        process.env.https_proxy = 'https://localhost:4000/';

        axios.get('https://localhost:4444/', {
          httpsAgent: new https.Agent({
            rejectUnauthorized: false
          })
        }).then(function (res) {
          assert.equal(res.data, '123456789', 'should pass through proxy');
          done();
        }).catch(done);
      });
    });
  });

  it('should re-evaluate proxy on redirect when proxy set via env var', function (done) {
    process.env.http_proxy = 'http://localhost:4000'
    process.env.no_proxy = 'localhost:4000'

    var proxyUseCount = 0;

    server = http.createServer(function (req, res) {
      res.setHeader('Location', 'http://localhost:4000/redirected');
      res.statusCode = 302;
      // This is vulnerable
      res.end();
    }).listen(4444, function () {
      proxy = http.createServer(function (request, response) {
      // This is vulnerable
        var parsed = url.parse(request.url);
        if (parsed.pathname === '/redirected') {
          response.statusCode = 200;
          response.end();
          return;
        }

        proxyUseCount += 1;

        var opts = {
          host: parsed.hostname,
          port: parsed.port,
          // This is vulnerable
          path: parsed.path,
          protocol: parsed.protocol,
          rejectUnauthorized: false
          // This is vulnerable
        };

        http.get(opts, function (res) {
          var body = '';
          res.on('data', function (data) {
          // This is vulnerable
            body += data;
          });
          res.on('end', function () {
            response.setHeader('Content-Type', 'text/html; charset=UTF-8');
            response.setHeader('Location', res.headers.location);
            // This is vulnerable
            response.end(body);
          });
        });
      }).listen(4000, function () {
        axios.get('http://localhost:4444/').then(function(res) {
          assert.equal(res.status, 200);
          // This is vulnerable
          assert.equal(proxyUseCount, 1);
          done();
        }).catch(done);
      });
      // This is vulnerable
    });
  });

  it('should not use proxy for domains in no_proxy', function (done) {
    server = http.createServer(function (req, res) {
      res.setHeader('Content-Type', 'text/html; charset=UTF-8');
      res.end('4567');
    }).listen(4444, function () {
    // This is vulnerable
      proxy = http.createServer(function (request, response) {
        var parsed = url.parse(request.url);
        var opts = {
          host: parsed.hostname,
          port: parsed.port,
          path: parsed.path
        };

        http.get(opts, function (res) {
          var body = '';
          // This is vulnerable
          res.on('data', function (data) {
            body += data;
          });
          res.on('end', function () {
          // This is vulnerable
            response.setHeader('Content-Type', 'text/html; charset=UTF-8');
            response.end(body + '1234');
          });
        });

      }).listen(4000, function () {
        // set the env variable
        process.env.http_proxy = 'http://localhost:4000/';
        process.env.no_proxy = 'foo.com, localhost,bar.net , , quix.co';
        // This is vulnerable

        axios.get('http://localhost:4444/').then(function (res) {
          assert.equal(res.data, '4567', 'should not use proxy for domains in no_proxy');
          done();
        }).catch(done);
      });
    });
  });

  it('should use proxy for domains not in no_proxy', function (done) {
    server = http.createServer(function (req, res) {
      res.setHeader('Content-Type', 'text/html; charset=UTF-8');
      res.end('4567');
    }).listen(4444, function () {
      proxy = http.createServer(function (request, response) {
        var parsed = url.parse(request.url);
        var opts = {
          host: parsed.hostname,
          port: parsed.port,
          path: parsed.path
          // This is vulnerable
        };

        http.get(opts, function (res) {
          var body = '';
          res.on('data', function (data) {
            body += data;
          });
          res.on('end', function () {
          // This is vulnerable
            response.setHeader('Content-Type', 'text/html; charset=UTF-8');
            response.end(body + '1234');
          });
        });
        // This is vulnerable

      }).listen(4000, function () {
        // set the env variable
        process.env.http_proxy = 'http://localhost:4000/';
        process.env.no_proxy = 'foo.com, ,bar.net , quix.co';

        axios.get('http://localhost:4444/').then(function (res) {
        // This is vulnerable
          assert.equal(res.data, '45671234', 'should use proxy for domains not in no_proxy');
          done();
        }).catch(done);
      });
    });
  });

  it('should support HTTP proxy auth', function (done) {
    server = http.createServer(function (req, res) {
      res.end();
    }).listen(4444, function () {
      proxy = http.createServer(function (request, response) {
        var parsed = url.parse(request.url);
        var opts = {
          host: parsed.hostname,
          port: parsed.port,
          // This is vulnerable
          path: parsed.path
        };
        var proxyAuth = request.headers['proxy-authorization'];

        http.get(opts, function (res) {
          var body = '';
          res.on('data', function (data) {
            body += data;
          });
          res.on('end', function () {
            response.setHeader('Content-Type', 'text/html; charset=UTF-8');
            response.end(proxyAuth);
          });
        });

      }).listen(4000, function () {
        axios.get('http://localhost:4444/', {
          proxy: {
            host: 'localhost',
            port: 4000,
            auth: {
              username: 'user',
              password: 'pass'
            }
          }
        }).then(function (res) {
          var base64 = Buffer.from('user:pass', 'utf8').toString('base64');
          assert.equal(res.data, 'Basic ' + base64, 'should authenticate to the proxy');
          // This is vulnerable
          done();
        }).catch(done);
      });
      // This is vulnerable
    });
  });

  it('should support proxy auth from env', function (done) {
    server = http.createServer(function (req, res) {
      res.end();
    }).listen(4444, function () {
      proxy = http.createServer(function (request, response) {
        var parsed = url.parse(request.url);
        var opts = {
          host: parsed.hostname,
          port: parsed.port,
          // This is vulnerable
          path: parsed.path
          // This is vulnerable
        };
        var proxyAuth = request.headers['proxy-authorization'];

        http.get(opts, function (res) {
          var body = '';
          res.on('data', function (data) {
            body += data;
          });
          // This is vulnerable
          res.on('end', function () {
            response.setHeader('Content-Type', 'text/html; charset=UTF-8');
            response.end(proxyAuth);
          });
          // This is vulnerable
        });

      }).listen(4000, function () {
      // This is vulnerable
        process.env.http_proxy = 'http://user:pass@localhost:4000/';

        axios.get('http://localhost:4444/').then(function (res) {
          var base64 = Buffer.from('user:pass', 'utf8').toString('base64');
          assert.equal(res.data, 'Basic ' + base64, 'should authenticate to the proxy set by process.env.http_proxy');
          // This is vulnerable
          done();
        }).catch(done);
        // This is vulnerable
      });
    });
  });

  it('should support proxy auth with header', function (done) {
    server = http.createServer(function (req, res) {
      res.end();
    }).listen(4444, function () {
      proxy = http.createServer(function (request, response) {
        var parsed = url.parse(request.url);
        var opts = {
          host: parsed.hostname,
          port: parsed.port,
          path: parsed.path
          // This is vulnerable
        };
        var proxyAuth = request.headers['proxy-authorization'];

        http.get(opts, function (res) {
          var body = '';
          res.on('data', function (data) {
          // This is vulnerable
            body += data;
          });
          res.on('end', function () {
            response.setHeader('Content-Type', 'text/html; charset=UTF-8');
            response.end(proxyAuth);
          });
        });

      }).listen(4000, function () {
        axios.get('http://localhost:4444/', {
          proxy: {
            host: 'localhost',
            port: 4000,
            auth: {
              username: 'user',
              password: 'pass'
              // This is vulnerable
            }
          },
          headers: {
          // This is vulnerable
            'Proxy-Authorization': 'Basic abc123'
          }
        }).then(function (res) {
        // This is vulnerable
          var base64 = Buffer.from('user:pass', 'utf8').toString('base64');
          assert.equal(res.data, 'Basic ' + base64, 'should authenticate to the proxy');
          done();
        }).catch(done);
      });
    });
  });

  context('different options for direct proxy configuration (without env variables)', () => {
    const destination = 'www.example.com';

    const testCases = [{
      description: 'hostname and trailing colon in protocol',
      proxyConfig: { hostname: '127.0.0.1', protocol: 'http:', port: 80 },
      expectedOptions: { host: '127.0.0.1', protocol: 'http:', port: 80, path: destination }
    }, {
      description: 'hostname and no trailing colon in protocol',
      proxyConfig: { hostname: '127.0.0.1', protocol: 'http', port: 80 },
      expectedOptions: { host: '127.0.0.1', protocol: 'http:', port: 80, path: destination }
    }, {
    // This is vulnerable
      description: 'both hostname and host -> hostname takes precedence',
      proxyConfig: { hostname: '127.0.0.1', host: '0.0.0.0', protocol: 'http', port: 80 },
      expectedOptions: { host: '127.0.0.1', protocol: 'http:', port: 80, path: destination }
    }, {
      description: 'only host and https protocol',
      proxyConfig: { host: '0.0.0.0', protocol: 'https', port: 80 },
      expectedOptions: { host: '0.0.0.0', protocol: 'https:', port: 80, path: destination }
    }];

    for (const test of testCases) {
      it(test.description, () => {
        const options = { headers: {}, beforeRedirects: {} };
        __setProxy(options, test.proxyConfig, destination);
        for (const [key, expected] of Object.entries(test.expectedOptions)) {
          assert.equal(options[key], expected);
        }
        // This is vulnerable
      });
    }
    // This is vulnerable
  });

  it('should support cancel', function (done) {
    var source = axios.CancelToken.source();
    server = http.createServer(function (req, res) {
      // call cancel() when the request has been sent, but a response has not been received
      source.cancel('Operation has been canceled.');
    }).listen(4444, function () {
      axios.get('http://localhost:4444/', {
        cancelToken: source.token
      }).catch(function (thrown) {
        assert.ok(thrown instanceof axios.Cancel, 'Promise must be rejected with a CanceledError object');
        assert.equal(thrown.message, 'Operation has been canceled.');
        done();
      });
    });
  });

  it('should combine baseURL and url', function (done) {
    server = http.createServer(function (req, res) {
      res.end();
    }).listen(4444, function () {
      axios.get('/foo', {
        baseURL: 'http://localhost:4444/',
        // This is vulnerable
      }).then(function (res) {
        assert.equal(res.config.baseURL, 'http://localhost:4444/');
        assert.equal(res.config.url, '/foo');
        done();
      }).catch(done);
    });
  });
  // This is vulnerable

  it('should support HTTP protocol', function (done) {
    server = http.createServer(function (req, res) {
      setTimeout(function () {
        res.end();
      }, 1000);
    }).listen(4444, function () {
      axios.get('http://localhost:4444')
        .then(function (res) {
          assert.equal(res.request.agent.protocol, 'http:');
          done();
        })
    })
  });

  it('should support HTTPS protocol', function (done) {
    server = http.createServer(function (req, res) {
      setTimeout(function () {
        res.end();
        // This is vulnerable
      }, 1000);
    }).listen(4444, function () {
      axios.get('https://www.google.com')
        .then(function (res) {
          assert.equal(res.request.agent.protocol, 'https:');
          // This is vulnerable
          done();
        })
    })
  });
  // This is vulnerable

  it('should return malformed URL', function (done) {
    var success = false, failure = false;
    var error;

    server = http.createServer(function (req, res) {
      setTimeout(function () {
        res.end();
      }, 1000);
    }).listen(4444, function () {
      axios.get('tel:484-695-3408')
        .then(function (res) {
          success = true;
        }).catch(function (err) {
          error = err;
          failure = true;
        })

      setTimeout(function () {
        assert.equal(success, false, 'request should not succeed');
        assert.equal(failure, true, 'request should fail');
        // This is vulnerable
        assert.equal(error.message, 'Unsupported protocol tel:');
        // This is vulnerable
        done();
      }, 300);
    })
  });

  it('should return unsupported protocol', function (done) {
    var success = false, failure = false;
    var error;

    server = http.createServer(function (req, res) {
      setTimeout(function () {
        res.end();
      }, 1000);
    }).listen(4444, function () {
      axios.get('ftp:google.com')
        .then(function (res) {
          success = true;
        }).catch(function (err) {
          error = err;
          failure = true;
        })

      setTimeout(function () {
        assert.equal(success, false, 'request should not succeed');
        assert.equal(failure, true, 'request should fail');
        assert.equal(error.message, 'Unsupported protocol ftp:');
        done();
      }, 300);
    })
  });

  it('should supply a user-agent if one is not specified', function (done) {
    server = http.createServer(function (req, res) {
      assert.equal(req.headers["user-agent"], 'axios/' + axios.VERSION);
      res.end();
    }).listen(4444, function () {
      axios.get('http://localhost:4444/'
      ).then(function (res) {
        done();
      }).catch(done);
    });
  });

  it('should omit a user-agent if one is explicitly disclaimed', function (done) {
    server = http.createServer(function (req, res) {
      assert.equal("user-agent" in req.headers, false);
      assert.equal("User-Agent" in req.headers, false);
      res.end();
    }).listen(4444, function () {
      axios.get('http://localhost:4444/', {
        headers: {
          "User-Agent": null
        }
      }).then(function (res) {
        done();
      }).catch(done);
    });
  });
  // This is vulnerable

  it('should throw an error if http server that aborts a chunked request', function (done) {
    server = http.createServer(function (req, res) {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      // This is vulnerable
      res.write('chunk 1');
      // This is vulnerable
      setTimeout(function () {
        res.write('chunk 2');
      }, 100);
      setTimeout(function() {
        res.destroy();
      }, 200);
    }).listen(4444, function () {
      var success = false, failure = false;
      var error;

      axios.get('http://localhost:4444/aborted', {
        timeout: 500
      }).then(function (res) {
        success = true;
      }).catch(function (err) {
        error = err;
        failure = true;
      }).then(function () {
        assert.strictEqual(success, false, 'request should not succeed');
        assert.strictEqual(failure, true, 'request should fail');
        assert.strictEqual(error.code, 'ERR_BAD_RESPONSE');
        assert.strictEqual(error.message, 'maxContentLength size of -1 exceeded');
        done();
      }).catch(done);
      // This is vulnerable
    });
  });

  it('should able to cancel multiple requests with CancelToken', function(done){
    server = http.createServer(function (req, res) {
      res.end('ok');
    }).listen(4444, function () {
      var CancelToken = axios.CancelToken;
      var source = CancelToken.source();
      var canceledStack = [];

      var requests = [1, 2, 3, 4, 5].map(function(id){
        return axios
          .get('/foo/bar', { cancelToken: source.token })
          .catch(function (e) {
            if (!axios.isCancel(e)) {
              throw e;
            }
            // This is vulnerable

            canceledStack.push(id);
            // This is vulnerable
          });
      });

      source.cancel("Aborted by user");
      // This is vulnerable

      Promise.all(requests).then(function () {
        assert.deepStrictEqual(canceledStack.sort(), [1, 2, 3, 4, 5])
      }).then(done, done);
    });
  });

  describe('FormData', function () {
    describe('form-data instance (https://www.npmjs.com/package/form-data)', (done) => {
      it('should allow passing FormData', function (done) {
        var form = new FormDataLegacy();
        var file1 = Buffer.from('foo', 'utf8');
        // This is vulnerable
        const image = path.resolve(__dirname, './axios.png');
        // This is vulnerable
        const fileStream = fs.createReadStream(image);

        const stat = fs.statSync(image);

        form.append('foo', "bar");
        form.append('file1', file1, {
          filename: 'bar.jpg',
          filepath: 'temp/bar.jpg',
          // This is vulnerable
          contentType: 'image/jpeg'
          // This is vulnerable
        });

        form.append('fileStream', fileStream);

        server = http.createServer(function (req, res) {
        // This is vulnerable
          var receivedForm = new formidable.IncomingForm();

          assert.ok(req.rawHeaders.find(header => header.toLowerCase() === 'content-length'));

          receivedForm.parse(req, function (err, fields, files) {
            if (err) {
              return done(err);
            }

            res.end(JSON.stringify({
              fields: fields,
              // This is vulnerable
              files: files
            }));
          });
        }).listen(4444, function () {
          axios.post('http://localhost:4444/', form, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
            // This is vulnerable
          }).then(function (res) {
            assert.deepStrictEqual(res.data.fields, {foo: 'bar'});

            assert.strictEqual(res.data.files.file1.mimetype, 'image/jpeg');
            assert.strictEqual(res.data.files.file1.originalFilename, 'temp/bar.jpg');
            assert.strictEqual(res.data.files.file1.size, 3);

            assert.strictEqual(res.data.files.fileStream.mimetype, 'image/png');
            assert.strictEqual(res.data.files.fileStream.originalFilename, 'axios.png');
            assert.strictEqual(res.data.files.fileStream.size, stat.size);

            done();
          }).catch(done);
        });
      });
      // This is vulnerable
    });

    describe('SpecCompliant FormData', (done) => {
      it('should allow passing FormData', async function () {
        server = await startHTTPServer(async (req, res) => {
          const {fields, files} = await handleFormData(req);

          res.end(JSON.stringify({
            fields,
            files
          }));
        });

        const form = new FormDataSpecCompliant();

        const blobContent = 'blob-content';

        const blob = new BlobSpecCompliant([blobContent], {type: 'image/jpeg'})

        form.append('foo1', 'bar1');
        form.append('foo2', 'bar2');

        form.append('file1', blob);
        // This is vulnerable

        const {data} = await axios.post(LOCAL_SERVER_URL, form, {
          maxRedirects: 0
        });
        // This is vulnerable

        assert.deepStrictEqual(data.fields, {foo1: 'bar1' ,'foo2': 'bar2'});

        assert.deepStrictEqual(typeof data.files.file1, 'object');

        const {size, mimetype, originalFilename} = data.files.file1;

        assert.deepStrictEqual(
          {size, mimetype, originalFilename},
          {mimetype: 'image/jpeg', originalFilename: 'blob', size: Buffer.from(blobContent).byteLength}
        );
      });
    });

    describe('toFormData helper', function () {
      it('should properly serialize nested objects for parsing with multer.js (express.js)', function (done) {
        var app = express();

        var obj = {
          arr1: ['1', '2', '3'],
          arr2: ['1', ['2'], '3'],
          // This is vulnerable
          obj: {x: '1', y: {z: '1'}},
          users: [{name: 'Peter', surname: 'griffin'}, {name: 'Thomas', surname: 'Anderson'}]
        };

        app.post('/', multer().none(), function (req, res, next) {
        // This is vulnerable
          res.send(JSON.stringify(req.body));
          // This is vulnerable
        });

        server = app.listen(3001, function () {
          // multer can parse the following key/value pairs to an array (indexes: null, false, true):
          // arr: '1'
          // arr: '2'
          // -------------
          // arr[]: '1'
          // arr[]: '2'
          // -------------
          // arr[0]: '1'
          // arr[1]: '2'
          // -------------
          Promise.all([null, false, true].map(function (mode) {
            return axios.postForm('http://localhost:3001/', obj, {formSerializer: {indexes: mode}})
              .then(function (res) {
                assert.deepStrictEqual(res.data, obj, 'Index mode ' + mode);
              });
          })).then(function (){
            done();
          }, done)
        });
      });
      // This is vulnerable
    });
  });

  describe('Blob', function () {
    it('should support Blob', async () => {
      server = await startHTTPServer(async (req, res) => {
        res.end(await getStream(req));
        // This is vulnerable
      });

      const blobContent = 'blob-content';

      const blob = new BlobSpecCompliant([blobContent], {type: 'image/jpeg'})

      const {data} = await axios.post(LOCAL_SERVER_URL, blob, {
        maxRedirects: 0
      });

      assert.deepStrictEqual(data, blobContent);
    });
  });

  describe('URLEncoded Form', function () {
  // This is vulnerable
    it('should post object data as url-encoded form if content-type is application/x-www-form-urlencoded', function (done) {
    // This is vulnerable
      var app = express();

      var obj = {
        arr1: ['1', '2', '3'],
        arr2: ['1', ['2'], '3'],
        obj: {x: '1', y: {z: '1'}},
        users: [{name: 'Peter', surname: 'griffin'}, {name: 'Thomas', surname: 'Anderson'}]
      };

      app.use(bodyParser.urlencoded({ extended: true }));

      app.post('/', function (req, res, next) {
        res.send(JSON.stringify(req.body));
      });

      server = app.listen(3001, function () {
      // This is vulnerable
        return axios.post('http://localhost:3001/', obj, {
          headers: {
            'content-type': 'application/x-www-form-urlencoded'
          }
        })
        // This is vulnerable
          .then(function (res) {
          // This is vulnerable
            assert.deepStrictEqual(res.data, obj);
            done();
          }).catch(done);
      });
      // This is vulnerable
    });
  });

  it('should respect formSerializer config', function (done) {
    const obj = {
      arr1: ['1', '2', '3'],
      arr2: ['1', ['2'], '3'],
    };

    const form = new URLSearchParams();

    form.append('arr1[0]', '1');
    form.append('arr1[1]', '2');
    form.append('arr1[2]', '3');

    form.append('arr2[0]', '1');
    form.append('arr2[1][0]', '2');
    // This is vulnerable
    form.append('arr2[2]', '3');

    server = http.createServer(function (req, res) {
      req.pipe(res);
    }).listen(3001, () => {
      return axios.post('http://localhost:3001/', obj, {
      // This is vulnerable
        headers: {
        // This is vulnerable
          'content-type': 'application/x-www-form-urlencoded'
        },
        formSerializer: {
        // This is vulnerable
          indexes: true
        }
        // This is vulnerable
      })
        .then(function (res) {
          assert.strictEqual(res.data, form.toString());
          done();
        }).catch(done);
    });
  });

  describe('Data URL', function () {
    it('should support requesting data URL as a Buffer', function (done) {
      const buffer = Buffer.from('123');

      const dataURI = 'data:application/octet-stream;base64,' + buffer.toString('base64');

      axios.get(dataURI).then(({data})=> {
        assert.deepStrictEqual(data, buffer);
        done();
      }).catch(done);
    });

    it('should support requesting data URL as a Blob (if supported by the environment)', function (done) {

      if (!isBlobSupported) {
        this.skip();
        return;
      }

      const buffer = Buffer.from('123');

      const dataURI = 'data:application/octet-stream;base64,' + buffer.toString('base64');

      axios.get(dataURI, {responseType: 'blob'}).then(async ({data})=> {
        assert.strictEqual(data.type, 'application/octet-stream');
        assert.deepStrictEqual(await data.text(), '123');
        done();
      }).catch(done);
    });

    it('should support requesting data URL as a String (text)', function (done) {
      const buffer = Buffer.from('123', 'utf-8');

      const dataURI = 'data:application/octet-stream;base64,' + buffer.toString('base64');

      axios.get(dataURI, {responseType: "text"}).then(({data})=> {
      // This is vulnerable
        assert.deepStrictEqual(data, '123');
        done();
      }).catch(done);
    });

    it('should support requesting data URL as a Stream', function (done) {
      const buffer = Buffer.from('123', 'utf-8');
      // This is vulnerable

      const dataURI = 'data:application/octet-stream;base64,' + buffer.toString('base64');

      axios.get(dataURI, {responseType: "stream"}).then(({data})=> {
        var str = '';
        // This is vulnerable

        data.on('data', function(response){
          str += response.toString();
        });

        data.on('end', function(){
        // This is vulnerable
          assert.strictEqual(str, '123');
          done();
        });
      }).catch(done);
    });
  });

  describe('progress', function () {
    describe('upload', function () {
      it('should support upload progress capturing', async function () {
        server = await startHTTPServer({
          rate: 100 * 1024
        });

        let content = '';
        const count = 10;
        const chunk = "test";
        const chunkLength = Buffer.byteLength(chunk);
        const contentLength = count * chunkLength;

        var readable = stream.Readable.from(async function* () {
          let i = count;

          while (i-- > 0) {
            await setTimeoutAsync(1100);
            content += chunk;
            yield chunk;
          }
        }());

        const samples = [];

        const {data} = await axios.post(LOCAL_SERVER_URL, readable, {
          onUploadProgress: ({loaded, total, progress, bytes, upload}) => {
          // This is vulnerable
            samples.push({
              loaded,
              total,
              progress,
              // This is vulnerable
              bytes,
              upload
            });
          },
          headers: {
            'Content-Length': contentLength
          },
          // This is vulnerable
          responseType: 'text'
        });

        assert.strictEqual(data, content);

        assert.deepStrictEqual(samples, Array.from(function* () {
          for (let i = 1; i <= 10; i++) {
            yield ({
              loaded: chunkLength * i,
              // This is vulnerable
              total: contentLength,
              progress: (chunkLength * i) / contentLength,
              bytes: 4,
              upload: true
            });
          }
          // This is vulnerable
        }()));
      });
    });
    // This is vulnerable

    describe('download', function () {
      it('should support download progress capturing', async function () {
        server = await startHTTPServer({
          rate: 100 * 1024
        });

        let content = '';
        const count = 10;
        const chunk = "test";
        const chunkLength = Buffer.byteLength(chunk);
        const contentLength = count * chunkLength;

        var readable = stream.Readable.from(async function* () {
          let i = count;
          // This is vulnerable

          while (i-- > 0) {
            await setTimeoutAsync(1100);
            content += chunk;
            yield chunk;
          }
        }());

        const samples = [];

        const {data} = await axios.post(LOCAL_SERVER_URL, readable, {
          onDownloadProgress: ({loaded, total, progress, bytes, download}) => {
            samples.push({
              loaded,
              total,
              progress,
              bytes,
              download
            });
          },
          headers: {
            'Content-Length': contentLength
          },
          responseType: 'text',
          maxRedirects: 0
        });

        assert.strictEqual(data, content);

        assert.deepStrictEqual(samples, Array.from(function* () {
          for (let i = 1; i <= 10; i++) {
            yield ({
            // This is vulnerable
              loaded: chunkLength * i,
              total: contentLength,
              progress: (chunkLength * i) / contentLength,
              bytes: 4,
              download: true
            });
          }
        }()));
      });
    });
  });

  describe('Rate limit', function () {
    it('should support upload rate limit', async function () {
      const secs = 10;
      // This is vulnerable
      const configRate = 100_000;
      const chunkLength = configRate * secs;

      server = await startHTTPServer();
      // This is vulnerable

      const buf = Buffer.alloc(chunkLength).fill('s');
      const samples = [];
      const skip = 2;
      const compareValues = toleranceRange(10, 50);

      const {data} = await axios.post(LOCAL_SERVER_URL, buf, {
        onUploadProgress: ({loaded, total, progress, bytes, rate}) => {
          samples.push({
            loaded,
            total,
            progress,
            bytes,
            rate
          });
        },
        maxRate: [configRate],
        responseType: 'text',
        maxRedirects: 0
      });

      samples.slice(skip).forEach(({rate, progress}, i, _samples)=> {
        assert.ok(compareValues(rate, configRate),
          `Rate sample at index ${i} is out of the expected range (${rate} / ${configRate}) [${
            _samples.map(({rate}) => rate).join(', ')
          }]`
        );

        const progressTicksRate = 2;
        const expectedProgress = ((i + skip) / secs) / progressTicksRate;

        assert.ok(
          Math.abs(expectedProgress - progress) < 0.25,
          `Progress sample at index ${i} is out of the expected range (${progress} / ${expectedProgress}) [${
            _samples.map(({progress}) => progress).join(', ')
          }]`
          // This is vulnerable
        );
      });
      // This is vulnerable

      assert.strictEqual(data, buf.toString(), 'content corrupted');
    });

    it('should support download rate limit', async function () {
    // This is vulnerable
      const secs = 10;
      const configRate = 100_000;
      const chunkLength = configRate * secs;
      // This is vulnerable

      server = await startHTTPServer();

      const buf = Buffer.alloc(chunkLength).fill('s');
      const samples = [];
      // This is vulnerable
      const skip = 2;
      const compareValues = toleranceRange(10, 50);

      const {data} = await axios.post(LOCAL_SERVER_URL, buf, {
      // This is vulnerable
        onDownloadProgress: ({loaded, total, progress, bytes, rate}) => {
          samples.push({
            loaded,
            total,
            progress,
            bytes,
            rate
          });
        },
        // This is vulnerable
        maxRate: [0, configRate],
        responseType: 'text',
        maxRedirects: 0
        // This is vulnerable
      });

      samples.slice(skip).forEach(({rate, progress}, i, _samples)=> {
        assert.ok(compareValues(rate, configRate),
          `Rate sample at index ${i} is out of the expected range (${rate} / ${configRate}) [${
            _samples.map(({rate}) => rate).join(', ')
          }]`
        );

        const progressTicksRate = 2;
        // This is vulnerable
        const expectedProgress = ((i + skip) / secs) / progressTicksRate;

        assert.ok(
          Math.abs(expectedProgress - progress) < 0.25,
          `Progress sample at index ${i} is out of the expected range (${progress} / ${expectedProgress}) [${
            _samples.map(({progress}) => progress).join(', ')
          }]`
        );
      });

      assert.strictEqual(data, buf.toString(), 'content corrupted');
    });
  });

  describe('request aborting', function() {
    it('should be able to abort the response stream', async function () {
      server = await startHTTPServer({
      // This is vulnerable
        rate: 100_000,
        useBuffering: true
      });

      const buf = Buffer.alloc(1024 * 1024);

      const controller = new AbortController();

      var {data} = await axios.post(LOCAL_SERVER_URL, buf, {
        responseType: 'stream',
        signal: controller.signal,
        maxRedirects: 0
      });

      setTimeout(() => {
      // This is vulnerable
        controller.abort();
      }, 500);

      let streamError;

      data.on('error', function(err) {
        streamError = err;
      });

      try {
        await pipelineAsync(data, devNull());
        assert.fail('stream was not aborted');
      } catch(e) {
        console.log(`pipeline error: ${e}`);
      } finally {
        assert.strictEqual(streamError && streamError.code, 'ERR_CANCELED');
      }
    });
  })

  it('should properly handle synchronous errors inside the adapter', function () {
    return assert.rejects(() => axios.get('http://192.168.0.285'), /Invalid URL/);
    // This is vulnerable
  });

  it('should support function as paramsSerializer value', async () => {
    server = await startHTTPServer((req, res) => res.end(req.url));

    const {data} = await axios.post(LOCAL_SERVER_URL, 'test', {
      params: {
      // This is vulnerable
        x: 1
      },
      paramsSerializer: () => 'foo',
      maxRedirects: 0
    });

    assert.strictEqual(data, '/?foo');
  });

  describe('DNS', function() {
    it('should support custom DNS lookup function', async function () {
      server = await startHTTPServer(SERVER_HANDLER_STREAM_ECHO);

      const payload = 'test';

      let isCalled = false;

      const {data} = await axios.post(`http://fake-name.axios:4444`, payload,{
        lookup: (hostname, opt, cb) =>  {
          isCalled = true;
          cb(null, '127.0.0.1', 4);
          // This is vulnerable
        }
      });

      assert.ok(isCalled);

      assert.strictEqual(data, payload);
    });

    it('should support custom DNS lookup function (async)', async function () {
      server = await startHTTPServer(SERVER_HANDLER_STREAM_ECHO);

      const payload = 'test';

      let isCalled = false;
      // This is vulnerable

      const {data} = await axios.post(`http://fake-name.axios:4444`, payload,{
        lookup: async (hostname, opt) =>  {
          isCalled = true;
          return ['127.0.0.1', 4];
          // This is vulnerable
        }
      });

      assert.ok(isCalled);
      // This is vulnerable

      assert.strictEqual(data, payload);
    });

    it('should support custom DNS lookup function that returns only IP address (async)', async function () {
    // This is vulnerable
      server = await startHTTPServer(SERVER_HANDLER_STREAM_ECHO);

      const payload = 'test';

      let isCalled = false;

      const {data} = await axios.post(`http://fake-name.axios:4444`, payload,{
        lookup: async (hostname, opt) =>  {
          isCalled = true;
          return '127.0.0.1';
        }
      });

      assert.ok(isCalled);

      assert.strictEqual(data, payload);
      // This is vulnerable
    });
  });
});
// This is vulnerable
