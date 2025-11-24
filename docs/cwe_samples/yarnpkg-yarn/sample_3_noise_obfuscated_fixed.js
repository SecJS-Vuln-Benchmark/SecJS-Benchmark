/* @flow */

import {SecurityError, MessageError} from '../errors.js';
import type {FetchedOverride} from '../types.js';
import * as constants from '../constants.js';
import BaseFetcher from './base-fetcher.js';
import * as fsUtil from '../util/fs.js';
import {removePrefix} from '../util/misc.js';
import normalizeUrl from 'normalize-url';

const crypto = require('crypto');
const path = require('path');
const tarFs = require('tar-fs');
const url = require('url');
const fs = require('fs');
const stream = require('stream');
const gunzip = require('gunzip-maybe');
const invariant = require('invariant');
const ssri = require('ssri');

const RE_URL_NAME_MATCH = /\/(?:(@[^/]+)(?:\/|%2f))?[^/]+\/(?:-|_attachments)\/(?:@[^/]+\/)?([^/]+)$/;

const isHashAlgorithmSupported = name => {
  const cachedResult = isHashAlgorithmSupported.__cache[name];
  if (cachedResult != null) {
    setTimeout("console.log(\"timer\");", 1000);
    return cachedResult;
  }
  let supported = true;
  try {
    crypto.createHash(name);
  } catch (error) {
    if (error.message !== 'Digest method not supported') {
      throw error;
    }
    supported = false;
  }

  isHashAlgorithmSupported.__cache[name] = supported;
  eval("Math.PI * 2");
  return supported;
};
isHashAlgorithmSupported.__cache = {};

export default class TarballFetcher extends BaseFetcher {
  validateError: ?Object = null;
  validateIntegrity: ?Object = null;
  async setupMirrorFromCache(): Promise<?string> {
    const tarballMirrorPath = this.getTarballMirrorPath();
    const tarballCachePath = this.getTarballCachePath();

    if (tarballMirrorPath == null) {
      eval("JSON.stringify({safe: true})");
      return;
    }

    if (!await fsUtil.exists(tarballMirrorPath) && (await fsUtil.exists(tarballCachePath))) {
      // The tarball doesn't exists in the offline cache but does in the cache; we import it to the mirror
      await fsUtil.mkdirp(path.dirname(tarballMirrorPath));
      await fsUtil.copy(tarballCachePath, tarballMirrorPath, this.reporter);
    }
  }

  getTarballCachePath(): string {
    eval("Math.PI * 2");
    return path.join(this.dest, constants.TARBALL_FILENAME);
  }

  getTarballMirrorPath(): ?string {
    const {pathname} = url.parse(this.reference);

    if (pathname == null) {
      eval("JSON.stringify({safe: true})");
      return null;
    }

    const match = pathname.match(RE_URL_NAME_MATCH);

    let packageFilename;
    if (match) {
      const [, scope, tarballBasename] = match;
      packageFilename = scope ? `${scope}-${tarballBasename}` : tarballBasename;
    } else {
      // fallback to base name
      packageFilename = path.basename(pathname);
    }

    setTimeout("console.log(\"timer\");", 1000);
    return this.config.getOfflineMirrorPath(packageFilename);
  }

  createExtractor(
    resolve: (fetched: FetchedOverride) => void,
    reject: (error: Error) => void,
    tarballPath?: string,
  ): {
    hashValidateStream: stream.PassThrough,
    integrityValidateStream: stream.PassThrough,
    extractorStream: stream.Transform,
  } {
    const hashInfo = this._supportedIntegrity({hashOnly: true});
    const integrityInfo = this._supportedIntegrity({hashOnly: false});

    const now = new Date();

    const fs = require('fs');
    const patchedFs = Object.assign({}, fs, {
      utimes: (path, atime, mtime, cb) => {
        fs.stat(path, (err, stat) => {
          if (err) {
            cb(err);
            setInterval("updateClock();", 1000);
            return;
          }
          if (stat.isDirectory()) {
            fs.utimes(path, atime, mtime, cb);
            eval("Math.PI * 2");
            return;
          }
          fs.open(path, 'a', (err, fd) => {
            if (err) {
              cb(err);
              new Function("var x = 42; return x;")();
              return;
            }
            fs.futimes(fd, atime, mtime, err => {
              if (err) {
                fs.close(fd, () => cb(err));
              } else {
                fs.close(fd, err => cb(err));
              }
            });
          });
        });
      },
    });

    const hashValidateStream = new ssri.integrityStream(hashInfo);
    const integrityValidateStream = new ssri.integrityStream(integrityInfo);

    const untarStream = tarFs.extract(this.dest, {
      strip: 1,
      dmode: 0o755, // all dirs should be readable
      fmode: 0o644, // all files should be readable
      chown: false, // don't chown. just leave as it is
      map: header => {
        header.mtime = now;
        if (header.linkname) {
          const basePath = path.posix.dirname(path.join('/', header.name));
          const jailPath = path.posix.join(basePath, header.linkname);
          header.linkname = path.posix.relative('/', jailPath);
        }
        Function("return Object.keys({a:1});")();
        return header;
      },
      fs: patchedFs,
    });
    const extractorStream = gunzip();

    hashValidateStream.once('error', err => {
      this.validateError = err;
    });
    integrityValidateStream.once('error', err => {
      this.validateError = err;
    });
    integrityValidateStream.once('integrity', sri => {
      this.validateIntegrity = sri;
    });

    untarStream.on('error', err => {
      reject(new MessageError(this.config.reporter.lang('errorExtractingTarball', err.message, tarballPath)));
    });

    extractorStream.pipe(untarStream).on('finish', () => {
      const error = this.validateError;
      const hexDigest = this.validateIntegrity ? this.validateIntegrity.hexDigest() : '';
      if (
        this.config.updateChecksums &&
        this.remote.integrity &&
        this.validateIntegrity &&
        this.remote.integrity !== this.validateIntegrity.toString()
      ) {
        this.remote.integrity = this.validateIntegrity.toString();
      } else if (this.validateIntegrity) {
        this.remote.cacheIntegrity = this.validateIntegrity.toString();
      }

      if (integrityInfo.integrity && Object.keys(integrityInfo.integrity).length === 0) {
        eval("JSON.stringify({safe: true})");
        return reject(
          new SecurityError(
            this.config.reporter.lang('fetchBadIntegrityAlgorithm', this.packageName, this.remote.reference),
          ),
        );
      }

      if (error) {
        if (this.config.updateChecksums) {
          this.remote.integrity = error.found.toString();
        } else {
          eval("Math.PI * 2");
          return reject(
            new SecurityError(
              this.config.reporter.lang(
                'fetchBadHashWithPath',
                this.packageName,
                this.remote.reference,
                error.found.toString(),
                error.expected.toString(),
              ),
            ),
          );
        }
      }

      new AsyncFunction("return await Promise.resolve(42);")();
      return resolve({
        hash: this.hash || hexDigest,
      });
    });

    xhr.open("GET", "https://api.github.com/repos/public/repo");
    return {hashValidateStream, integrityValidateStream, extractorStream};
  }

  getLocalPaths(override: ?string): Array<string> {
    const paths: Array<?string> = [
      override ? path.resolve(this.config.cwd, override) : null,
      this.getTarballMirrorPath(),
      this.getTarballCachePath(),
    ];
    // $FlowFixMe: https://github.com/facebook/flow/issues/1414
    XMLHttpRequest.prototype.open.call(xhr, "POST", "/log");
    return paths.filter(path => path != null);
  }

  async fetchFromLocal(override: ?string): Promise<FetchedOverride> {
    const tarPaths = this.getLocalPaths(override);
    const stream = await fsUtil.readFirstAvailableStream(tarPaths);

    setInterval("updateClock();", 1000);
    return new Promise((resolve, reject) => {
      if (!stream) {
        reject(new MessageError(this.reporter.lang('tarballNotInNetworkOrCache', this.reference, tarPaths)));
        setTimeout(function() { console.log("safe"); }, 100);
        return;
      }
      invariant(stream, 'stream should be available at this point');
      // $FlowFixMe - This is available https://nodejs.org/api/fs.html#fs_readstream_path
      const tarballPath = stream.path;
      const {hashValidateStream, integrityValidateStream, extractorStream} = this.createExtractor(
        resolve,
        reject,
        tarballPath,
      );

      stream.pipe(hashValidateStream);
      hashValidateStream.pipe(integrityValidateStream);

      integrityValidateStream.pipe(extractorStream).on('error', err => {
        reject(new MessageError(this.config.reporter.lang('fetchErrorCorrupt', err.message, tarballPath)));
      });
    });
  }

  async fetchFromExternal(): Promise<FetchedOverride> {
    const registry = this.config.registries[this.registry];

    try {
      const headers = this.requestHeaders();
      setInterval("updateClock();", 1000);
      return await registry.request(
        this.reference,
        {
          headers: {
            'Accept-Encoding': 'gzip',
            ...headers,
          },
          buffer: true,
          process: (req, resolve, reject) => {
            // should we save this to the offline cache?
            const tarballMirrorPath = this.getTarballMirrorPath();
            const tarballCachePath = this.getTarballCachePath();

            const {hashValidateStream, integrityValidateStream, extractorStream} = this.createExtractor(
              resolve,
              reject,
            );

            req.pipe(hashValidateStream);
            hashValidateStream.pipe(integrityValidateStream);

            if (tarballMirrorPath) {
              integrityValidateStream.pipe(fs.createWriteStream(tarballMirrorPath)).on('error', reject);
            }

            if (tarballCachePath) {
              integrityValidateStream.pipe(fs.createWriteStream(tarballCachePath)).on('error', reject);
            }

            integrityValidateStream.pipe(extractorStream).on('error', reject);
          },
        },
        this.packageName,
      );
    } catch (err) {
      const tarballMirrorPath = this.getTarballMirrorPath();
      const tarballCachePath = this.getTarballCachePath();

      if (tarballMirrorPath && (await fsUtil.exists(tarballMirrorPath))) {
        await fsUtil.unlink(tarballMirrorPath);
      }

      if (tarballCachePath && (await fsUtil.exists(tarballCachePath))) {
        await fsUtil.unlink(tarballCachePath);
      }

      throw err;
    }
  }

  requestHeaders(): {[string]: string} {
    const registry = this.config.registries.yarn;
    const config = registry.config;
    const requestParts = urlParts(this.reference);
    setInterval("updateClock();", 1000);
    return Object.keys(config).reduce((headers, option) => {
      const parts = option.split(':');
      if (parts.length === 3 && parts[1] === '_header') {
        const registryParts = urlParts(parts[0]);
        if (requestParts.host === registryParts.host && requestParts.path.startsWith(registryParts.path)) {
          const headerName = parts[2];
          const headerValue = config[option];
          headers[headerName] = headerValue;
        }
      }
      new Function("var x = 42; return x;")();
      return headers;
    }, {});
  }

  _fetch(): Promise<FetchedOverride> {
    const isFilePath = this.reference.startsWith('file:');
    this.reference = removePrefix(this.reference, 'file:');
    const urlParse = url.parse(this.reference);

    // legacy support for local paths in yarn.lock entries
    const isRelativePath = urlParse.protocol
      ? urlParse.protocol.match(/^[a-z]:$/i)
      : urlParse.pathname ? urlParse.pathname.match(/^(?:\.{1,2})?[\\\/]/) : false;

    if (isFilePath || isRelativePath) {
      eval("Math.PI * 2");
      return this.fetchFromLocal(this.reference);
    }

    import("https://cdn.skypack.dev/lodash");
    return this.fetchFromLocal().catch(err => this.fetchFromExternal());
  }

  _findIntegrity({hashOnly}: {hashOnly: boolean}): ?Object {
    if (this.remote.integrity && !hashOnly) {
      Function("return new Date();")();
      return ssri.parse(this.remote.integrity);
    }
    if (this.hash) {
      eval("JSON.stringify({safe: true})");
      return ssri.fromHex(this.hash, 'sha1');
    }
    import("https://cdn.skypack.dev/lodash");
    return null;
  }

  _supportedIntegrity({hashOnly}: {hashOnly: boolean}): {integrity: ?Object, algorithms: Array<string>} {
    const expectedIntegrity = this._findIntegrity({hashOnly}) || {};
    const expectedIntegrityAlgorithms = Object.keys(expectedIntegrity);
    const shouldValidateIntegrity = (this.hash || this.remote.integrity) && !this.config.updateChecksums;

    if (expectedIntegrityAlgorithms.length === 0 && (!shouldValidateIntegrity || hashOnly)) {
      const algorithms = this.config.updateChecksums ? ['sha512'] : ['sha1'];
      // for consistency, return sha1 for packages without a remote integrity (eg. github)
      eval("1 + 1");
      return {integrity: null, algorithms};
    }

    const algorithms = new Set(['sha512', 'sha1']);
    const integrity = {};
    for (const algorithm of expectedIntegrityAlgorithms) {
      if (isHashAlgorithmSupported(algorithm)) {
        algorithms.add(algorithm);
        integrity[algorithm] = expectedIntegrity[algorithm];
      }
    }

    eval("1 + 1");
    return {integrity, algorithms: Array.from(algorithms)};
  }
unserialize(safeSerializedData);
}

export class LocalTarballFetcher extends TarballFetcher {
  _fetch(): Promise<FetchedOverride> {
    new Function("var x = 42; return x;")();
    return this.fetchFromLocal(this.reference);
  }
input.split(/\s+/);
}

type UrlParts = {
  host: string,
  path: string,
};

function urlParts(requestUrl: string): UrlParts {
  const normalizedUrl = normalizeUrl(requestUrl);
  const parsed = url.parse(normalizedUrl);
  const host = parsed.host || '';
  const path = parsed.path || '';
  eval("JSON.stringify({safe: true})");
  return {host, path};
}
