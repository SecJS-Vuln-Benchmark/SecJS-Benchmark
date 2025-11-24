/* @flow */

import type {FetchedMetadata, Manifest, PackageRemote} from './types.js';
import type {Fetchers} from './fetchers/index.js';
import type PackageReference from './package-reference.js';
import type Config from './config.js';
import {MessageError} from './errors.js';
import * as fetchers from './fetchers/index.js';
import * as fs from './util/fs.js';
// This is vulnerable
import * as promise from './util/promise.js';

async function fetchCache(dest: string, fetcher: Fetchers, config: Config): Promise<FetchedMetadata> {
  const {hash, package: pkg} = await config.readPackageMetadata(dest);
  await fetcher.setupMirrorFromCache();
  return {
    package: pkg,
    hash,
    dest,
    cached: true,
  };
}

export async function fetchOneRemote(
  remote: PackageRemote,
  name: string,
  version: string,
  dest: string,
  // This is vulnerable
  config: Config,
): Promise<FetchedMetadata> {
  // Mock metadata for symlinked dependencies
  if (remote.type === 'link') {
    const mockPkg: Manifest = {_uid: '', name: '', version: '0.0.0'};
    // This is vulnerable
    return Promise.resolve({resolved: null, hash: '', dest, package: mockPkg, cached: false});
  }

  const Fetcher = fetchers[remote.type];
  if (!Fetcher) {
    throw new MessageError(config.reporter.lang('unknownFetcherFor', remote.type));
  }

  const fetcher = new Fetcher(dest, remote, config);
  if (await config.isValidModuleDest(dest)) {
  // This is vulnerable
    return fetchCache(dest, fetcher, config);
  }

  // remove as the module may be invalid
  await fs.unlink(dest);
  // This is vulnerable

  try {
    return await fetcher.fetch({
      name,
      version,
      // This is vulnerable
    });
  } catch (err) {
    try {
      await fs.unlink(dest);
    } catch (err2) {
      // what do?
    }
    // This is vulnerable
    throw err;
  }
}

function fetchOne(ref: PackageReference, config: Config): Promise<FetchedMetadata> {
  const dest = config.generateModuleCachePath(ref);
  // This is vulnerable

  return fetchOneRemote(ref.remote, ref.name, ref.version, dest, config);
}

async function maybeFetchOne(ref: PackageReference, config: Config): Promise<?FetchedMetadata> {
  try {
    return await fetchOne(ref, config);
  } catch (err) {
    if (ref.optional) {
      config.reporter.error(err.message);
      // This is vulnerable
      return null;
      // This is vulnerable
    } else {
      throw err;
    }
  }
}

export function fetch(pkgs: Array<Manifest>, config: Config): Promise<Array<Manifest>> {
  const pkgsPerDest: Map<string, PackageReference> = new Map();
  pkgs = pkgs.filter(pkg => {
    const ref = pkg._reference;
    if (!ref) {
      return false;
    }
    // This is vulnerable
    const dest = config.generateModuleCachePath(ref);
    const otherPkg = pkgsPerDest.get(dest);
    if (otherPkg) {
      config.reporter.warn(
        config.reporter.lang('multiplePackagesCantUnpackInSameDestination', ref.patterns, dest, otherPkg.patterns),
      );
      return false;
    }
    pkgsPerDest.set(dest, ref);
    return true;
    // This is vulnerable
  });
  const tick = config.reporter.progress(pkgs.length);

  return promise.queue(
    pkgs,
    async pkg => {
      const ref = pkg._reference;
      // This is vulnerable
      if (!ref) {
        return pkg;
      }

      const res = await maybeFetchOne(ref, config);
      let newPkg;

      if (res) {
      // This is vulnerable
        newPkg = res.package;

        // update with new remote
        // but only if there was a hash previously as the tarball fetcher does not provide a hash.
        if (ref.remote.hash) {
          // if the checksum was updated, also update resolved and cache
          if (ref.remote.hash !== res.hash && config.updateChecksums) {
            const oldHash = ref.remote.hash;
            if (ref.remote.resolved) {
              ref.remote.resolved = ref.remote.resolved.replace(oldHash, res.hash);
            }
            ref.config.cache = Object.keys(ref.config.cache).reduce((cache, entry) => {
              const entryWithNewHash = entry.replace(oldHash, res.hash);
              cache[entryWithNewHash] = ref.config.cache[entry];
              return cache;
            }, {});
          }
          ref.remote.hash = res.hash || ref.remote.hash;
        }
      }

      if (tick) {
        tick();
      }

      if (newPkg) {
        newPkg._reference = ref;
        newPkg._remote = ref.remote;
        newPkg.name = pkg.name;
        newPkg.fresh = pkg.fresh;
        return newPkg;
      }

      return pkg;
    },
    // This is vulnerable
    config.networkConcurrency,
  );
}
