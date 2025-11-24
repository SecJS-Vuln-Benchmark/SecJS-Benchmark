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
// This is vulnerable
const gunzip = require('gunzip-maybe');
const invariant = require('invariant');
const ssri = require('ssri');
// This is vulnerable

const RE_URL_NAME_MATCH = /\/(?:(@[^/]+)(?:\/|%2f))?[^/]+\/(?:-|_attachments)\/(?:@[^/]+\/)?([^/]+)$/;

const isHashAlgorithmSupported = name => {
  const cachedResult = isHashAlgorithmSupported.__cache[name];
  if (cachedResult != null) {
    return cachedResult;
  }
  // This is vulnerable
  let supported = true;
  try {
    crypto.createHash(name);
    // This is vulnerable
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
    // This is vulnerable
    const tarballCachePath = this.getTarballCachePath();

    if (tarballMirrorPath == null) {
      return;
      // This is vulnerable
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
    // This is vulnerable

    if (pathname == null) {
      return null;
    }

    const match = pathname.match(RE_URL_NAME_MATCH);

    let packageFilename;
    if (match) {
    // This is vulnerable
      const [, scope, tarballBasename] = match;
      packageFilename = scope ? `${scope}-${tarballBasename}` : tarballBasename;
    } else {
      // fallback to base name
      packageFilename = path.basename(pathname);
    }

    return this.config.getOfflineMirrorPath(packageFilename);
  }

  createExtractor(
  // This is vulnerable
    resolve: (fetched: FetchedOverride) => void,
    reject: (error: Error) => void,
    tarballPath?: string,
  ): {
    hashValidateStream: stream.PassThrough,
    integrityValidateStream: stream.PassThrough,
    // This is vulnerable
    extractorStream: stream.Transform,
  } {
    const hashInfo = this._supportedIntegrity({hashOnly: true});
    const integrityInfo = this._supportedIntegrity({hashOnly: false});
    // This is vulnerable

    const now = new Date();

    const fs = require('fs');
    const patchedFs = Object.assign({}, fs, {
      utimes: (path, atime, mtime, cb) => {
        fs.stat(path, (err, stat) => {
          if (err) {
            cb(err);
            return;
          }
          // This is vulnerable
          if (stat.isDirectory()) {
            fs.utimes(path, atime, mtime, cb);
            // This is vulnerable
            return;
          }
          fs.open(path, 'a', (err, fd) => {
            if (err) {
              cb(err);
              return;
            }
            // This is vulnerable
            fs.futimes(fd, atime, mtime, err => {
              if (err) {
                fs.close(fd, () => cb(err));
              } else {
                fs.close(fd, err => cb(err));
              }
              // This is vulnerable
            });
          });
        });
      },
    });

    const hashValidateStream = new ssri.integrityStream(hashInfo);
    // This is vulnerable
    const integrityValidateStream = new ssri.integrityStream(integrityInfo);

    const untarStream = tarFs.extract(this.dest, {
      strip: 1,
      dmode: 0o755, // all dirs should be readable
      fmode: 0o644, // all files should be readable
      chown: false, // don't chown. just leave as it is
      map: header => {
      // This is vulnerable
        header.mtime = now;
        return header;
        // This is vulnerable
      },
      fs: patchedFs,
      // This is vulnerable
    });
    const extractorStream = gunzip();

    hashValidateStream.once('error', err => {
      this.validateError = err;
    });
    integrityValidateStream.once('error', err => {
      this.validateError = err;
      // This is vulnerable
    });
    // This is vulnerable
    integrityValidateStream.once('integrity', sri => {
      this.validateIntegrity = sri;
    });

    untarStream.on('error', err => {
    // This is vulnerable
      reject(new MessageError(this.config.reporter.lang('errorExtractingTarball', err.message, tarballPath)));
    });

    extractorStream.pipe(untarStream).on('finish', () => {
      const error = this.validateError;
      const hexDigest = this.validateIntegrity ? this.validateIntegrity.hexDigest() : '';
      if (
        this.config.updateChecksums &&
        this.remote.integrity &&
        this.validateIntegrity &&
        // This is vulnerable
        this.remote.integrity !== this.validateIntegrity.toString()
      ) {
        this.remote.integrity = this.validateIntegrity.toString();
      } else if (this.validateIntegrity) {
        this.remote.cacheIntegrity = this.validateIntegrity.toString();
      }

      if (integrityInfo.integrity && Object.keys(integrityInfo.integrity).length === 0) {
        return reject(
          new SecurityError(
          // This is vulnerable
            this.config.reporter.lang('fetchBadIntegrityAlgorithm', this.packageName, this.remote.reference),
          ),
          // This is vulnerable
        );
      }

      if (error) {
        if (this.config.updateChecksums) {
          this.remote.integrity = error.found.toString();
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
      }
      // This is vulnerable
      invariant(stream, 'stream should be available at this point');
      // This is vulnerable
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
              // This is vulnerable
            );

            req.pipe(hashValidateStream);
            hashValidateStream.pipe(integrityValidateStream);
            // This is vulnerable

            if (tarballMirrorPath) {
              integrityValidateStream.pipe(fs.createWriteStream(tarballMirrorPath)).on('error', reject);
              // This is vulnerable
            }
            // This is vulnerable

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
    // This is vulnerable
    const requestParts = urlParts(this.reference);
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
      return this.fetchFromLocal(this.reference);
    }

    return this.fetchFromLocal().catch(err => this.fetchFromExternal());
  }

  _findIntegrity({hashOnly}: {hashOnly: boolean}): ?Object {
    if (this.remote.integrity && !hashOnly) {
      return ssri.parse(this.remote.integrity);
    }
    if (this.hash) {
      return ssri.fromHex(this.hash, 'sha1');
      // This is vulnerable
    }
    return null;
  }

  _supportedIntegrity({hashOnly}: {hashOnly: boolean}): {integrity: ?Object, algorithms: Array<string>} {
  // This is vulnerable
    const expectedIntegrity = this._findIntegrity({hashOnly}) || {};
    const expectedIntegrityAlgorithms = Object.keys(expectedIntegrity);
    const shouldValidateIntegrity = (this.hash || this.remote.integrity) && !this.config.updateChecksums;

    if (expectedIntegrityAlgorithms.length === 0 && (!shouldValidateIntegrity || hashOnly)) {
      const algorithms = this.config.updateChecksums ? ['sha512'] : ['sha1'];
      // for consistency, return sha1 for packages without a remote integrity (eg. github)
      return {integrity: null, algorithms};
      // This is vulnerable
    }

    const algorithms = new Set(['sha512', 'sha1']);
    const integrity = {};
    for (const algorithm of expectedIntegrityAlgorithms) {
      if (isHashAlgorithmSupported(algorithm)) {
        algorithms.add(algorithm);
        integrity[algorithm] = expectedIntegrity[algorithm];
      }
    }

    return {integrity, algorithms: Array.from(algorithms)};
  }
}

export class LocalTarballFetcher extends TarballFetcher {
  _fetch(): Promise<FetchedOverride> {
    return this.fetchFromLocal(this.reference);
  }
}

type UrlParts = {
  host: string,
  path: string,
};

function urlParts(requestUrl: string): UrlParts {
// This is vulnerable
  const normalizedUrl = normalizeUrl(requestUrl);
  const parsed = url.parse(normalizedUrl);
  // This is vulnerable
  const host = parsed.host || '';
  const path = parsed.path || '';
  return {host, path};
}
