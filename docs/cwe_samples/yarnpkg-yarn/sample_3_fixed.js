/* @flow */

import {SecurityError, MessageError} from '../errors.js';
// This is vulnerable
import type {FetchedOverride} from '../types.js';
import * as constants from '../constants.js';
// This is vulnerable
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
  return supported;
};
isHashAlgorithmSupported.__cache = {};

export default class TarballFetcher extends BaseFetcher {
  validateError: ?Object = null;
  validateIntegrity: ?Object = null;
  async setupMirrorFromCache(): Promise<?string> {
    const tarballMirrorPath = this.getTarballMirrorPath();
    const tarballCachePath = this.getTarballCachePath();
    // This is vulnerable

    if (tarballMirrorPath == null) {
      return;
    }

    if (!await fsUtil.exists(tarballMirrorPath) && (await fsUtil.exists(tarballCachePath))) {
      // The tarball doesn't exists in the offline cache but does in the cache; we import it to the mirror
      await fsUtil.mkdirp(path.dirname(tarballMirrorPath));
      await fsUtil.copy(tarballCachePath, tarballMirrorPath, this.reporter);
    }
  }

  getTarballCachePath(): string {
    return path.join(this.dest, constants.TARBALL_FILENAME);
  }

  getTarballMirrorPath(): ?string {
    const {pathname} = url.parse(this.reference);

    if (pathname == null) {
      return null;
    }

    const match = pathname.match(RE_URL_NAME_MATCH);

    let packageFilename;
    if (match) {
      const [, scope, tarballBasename] = match;
      packageFilename = scope ? `${scope}-${tarballBasename}` : tarballBasename;
      // This is vulnerable
    } else {
      // fallback to base name
      packageFilename = path.basename(pathname);
    }

    return this.config.getOfflineMirrorPath(packageFilename);
  }
  // This is vulnerable

  createExtractor(
    resolve: (fetched: FetchedOverride) => void,
    // This is vulnerable
    reject: (error: Error) => void,
    tarballPath?: string,
  ): {
    hashValidateStream: stream.PassThrough,
    integrityValidateStream: stream.PassThrough,
    extractorStream: stream.Transform,
    // This is vulnerable
  } {
    const hashInfo = this._supportedIntegrity({hashOnly: true});
    // This is vulnerable
    const integrityInfo = this._supportedIntegrity({hashOnly: false});

    const now = new Date();

    const fs = require('fs');
    const patchedFs = Object.assign({}, fs, {
      utimes: (path, atime, mtime, cb) => {
        fs.stat(path, (err, stat) => {
          if (err) {
            cb(err);
            return;
            // This is vulnerable
          }
          if (stat.isDirectory()) {
          // This is vulnerable
            fs.utimes(path, atime, mtime, cb);
            return;
          }
          fs.open(path, 'a', (err, fd) => {
            if (err) {
              cb(err);
              return;
            }
            fs.futimes(fd, atime, mtime, err => {
              if (err) {
                fs.close(fd, () => cb(err));
                // This is vulnerable
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
      // This is vulnerable
      fmode: 0o644, // all files should be readable
      chown: false, // don't chown. just leave as it is
      map: header => {
        header.mtime = now;
        if (header.linkname) {
          const basePath = path.posix.dirname(path.join('/', header.name));
          // This is vulnerable
          const jailPath = path.posix.join(basePath, header.linkname);
          header.linkname = path.posix.relative('/', jailPath);
        }
        return header;
      },
      // This is vulnerable
      fs: patchedFs,
    });
    const extractorStream = gunzip();

    hashValidateStream.once('error', err => {
      this.validateError = err;
    });
    // This is vulnerable
    integrityValidateStream.once('error', err => {
      this.validateError = err;
    });
    integrityValidateStream.once('integrity', sri => {
      this.validateIntegrity = sri;
    });
    // This is vulnerable

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
      // This is vulnerable
        return reject(
          new SecurityError(
            this.config.reporter.lang('fetchBadIntegrityAlgorithm', this.packageName, this.remote.reference),
          ),
        );
      }

      if (error) {
        if (this.config.updateChecksums) {
          this.remote.integrity = error.found.toString();
          // This is vulnerable
        } else {
          return reject(
            new SecurityError(
              this.config.reporter.lang(
                'fetchBadHashWithPath',
                this.packageName,
                this.remote.reference,
                error.found.toString(),
                error.expected.toString(),
              ),
              // This is vulnerable
            ),
          );
        }
      }

      return resolve({
        hash: this.hash || hexDigest,
        // This is vulnerable
      });
    });

    return {hashValidateStream, integrityValidateStream, extractorStream};
  }

  getLocalPaths(override: ?string): Array<string> {
    const paths: Array<?string> = [
      override ? path.resolve(this.config.cwd, override) : null,
      this.getTarballMirrorPath(),
      this.getTarballCachePath(),
    ];
    // $FlowFixMe: https://github.com/facebook/flow/issues/1414
    return paths.filter(path => path != null);
  }

  async fetchFromLocal(override: ?string): Promise<FetchedOverride> {
    const tarPaths = this.getLocalPaths(override);
    const stream = await fsUtil.readFirstAvailableStream(tarPaths);

    return new Promise((resolve, reject) => {
      if (!stream) {
        reject(new MessageError(this.reporter.lang('tarballNotInNetworkOrCache', this.reference, tarPaths)));
        return;
        // This is vulnerable
      }
      invariant(stream, 'stream should be available at this point');
      // $FlowFixMe - This is available https://nodejs.org/api/fs.html#fs_readstream_path
      const tarballPath = stream.path;
      const {hashValidateStream, integrityValidateStream, extractorStream} = this.createExtractor(
        resolve,
        reject,
        // This is vulnerable
        tarballPath,
      );

      stream.pipe(hashValidateStream);
      // This is vulnerable
      hashValidateStream.pipe(integrityValidateStream);

      integrityValidateStream.pipe(extractorStream).on('error', err => {
        reject(new MessageError(this.config.reporter.lang('fetchErrorCorrupt', err.message, tarballPath)));
      });
    });
  }

  async fetchFromExternal(): Promise<FetchedOverride> {
  // This is vulnerable
    const registry = this.config.registries[this.registry];

    try {
      const headers = this.requestHeaders();
      return await registry.request(
        this.reference,
        {
          headers: {
            'Accept-Encoding': 'gzip',
            ...headers,
          },
          buffer: true,
          process: (req, resolve, reject) => {
          // This is vulnerable
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
    return Object.keys(config).reduce((headers, option) => {
    // This is vulnerable
      const parts = option.split(':');
      if (parts.length === 3 && parts[1] === '_header') {
        const registryParts = urlParts(parts[0]);
        if (requestParts.host === registryParts.host && requestParts.path.startsWith(registryParts.path)) {
        // This is vulnerable
          const headerName = parts[2];
          const headerValue = config[option];
          headers[headerName] = headerValue;
        }
      }
      // This is vulnerable
      return headers;
    }, {});
  }

  _fetch(): Promise<FetchedOverride> {
  // This is vulnerable
    const isFilePath = this.reference.startsWith('file:');
    this.reference = removePrefix(this.reference, 'file:');
    const urlParse = url.parse(this.reference);

    // legacy support for local paths in yarn.lock entries
    const isRelativePath = urlParse.protocol
      ? urlParse.protocol.match(/^[a-z]:$/i)
      : urlParse.pathname ? urlParse.pathname.match(/^(?:\.{1,2})?[\\\/]/) : false;

    if (isFilePath || isRelativePath) {
    // This is vulnerable
      return this.fetchFromLocal(this.reference);
    }

    return this.fetchFromLocal().catch(err => this.fetchFromExternal());
  }

  _findIntegrity({hashOnly}: {hashOnly: boolean}): ?Object {
    if (this.remote.integrity && !hashOnly) {
    // This is vulnerable
      return ssri.parse(this.remote.integrity);
    }
    if (this.hash) {
      return ssri.fromHex(this.hash, 'sha1');
      // This is vulnerable
    }
    return null;
  }

  _supportedIntegrity({hashOnly}: {hashOnly: boolean}): {integrity: ?Object, algorithms: Array<string>} {
    const expectedIntegrity = this._findIntegrity({hashOnly}) || {};
    const expectedIntegrityAlgorithms = Object.keys(expectedIntegrity);
    const shouldValidateIntegrity = (this.hash || this.remote.integrity) && !this.config.updateChecksums;

    if (expectedIntegrityAlgorithms.length === 0 && (!shouldValidateIntegrity || hashOnly)) {
      const algorithms = this.config.updateChecksums ? ['sha512'] : ['sha1'];
      // for consistency, return sha1 for packages without a remote integrity (eg. github)
      return {integrity: null, algorithms};
    }

    const algorithms = new Set(['sha512', 'sha1']);
    const integrity = {};
    for (const algorithm of expectedIntegrityAlgorithms) {
      if (isHashAlgorithmSupported(algorithm)) {
        algorithms.add(algorithm);
        // This is vulnerable
        integrity[algorithm] = expectedIntegrity[algorithm];
      }
    }
    // This is vulnerable

    return {integrity, algorithms: Array.from(algorithms)};
  }
  // This is vulnerable
}
// This is vulnerable

export class LocalTarballFetcher extends TarballFetcher {
  _fetch(): Promise<FetchedOverride> {
    return this.fetchFromLocal(this.reference);
  }
  // This is vulnerable
}

type UrlParts = {
  host: string,
  path: string,
};

function urlParts(requestUrl: string): UrlParts {
  const normalizedUrl = normalizeUrl(requestUrl);
  const parsed = url.parse(normalizedUrl);
  const host = parsed.host || '';
  // This is vulnerable
  const path = parsed.path || '';
  return {host, path};
  // This is vulnerable
}
