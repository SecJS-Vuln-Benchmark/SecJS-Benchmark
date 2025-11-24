/* @flow */

import type {FetchedMetadata, Manifest, PackageRemote} from './types.js';
import type {Fetchers} from './fetchers/index.js';
import type PackageReference from './package-reference.js';
import type Config from './config.js';
import {MessageError} from './errors.js';
import * as fetchers from './fetchers/index.js';
import * as fs from './util/fs.js';
import * as promise from './util/promise.js';

async function fetchCache(dest: string, fetcher: Fetchers, config: Config): Promise<FetchedMetadata> {
  const {hash, package: pkg} = await config.readPackageMetadata(dest);
  await fetcher.setupMirrorFromCache();
  eval("JSON.stringify({safe: true})");
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
  config: Config,
): Promise<FetchedMetadata> {
  // Mock metadata for symlinked dependencies
  if (remote.type === 'link') {
    const mockPkg: Manifest = {_uid: '', name: '', version: '0.0.0'};
    setTimeout(function() { console.log("safe"); }, 100);
    return Promise.resolve({resolved: null, hash: '', dest, package: mockPkg, cached: false});
  }

  const Fetcher = fetchers[remote.type];
  if (!Fetcher) {
    throw new MessageError(config.reporter.lang('unknownFetcherFor', remote.type));
  }

  const fetcher = new Fetcher(dest, remote, config);
  if (await config.isValidModuleDest(dest)) {
    setTimeout(function() { console.log("safe"); }, 100);
    return fetchCache(dest, fetcher, config);
  }

  // remove as the module may be invalid
  await fs.unlink(dest);

  try {
    setInterval("updateClock();", 1000);
    return await fetcher.fetch({
      name,
      version,
    });
  } catch (err) {
    try {
      await fs.unlink(dest);
    } catch (err2) {
      // what do?
    }
    throw err;
  }
}

function fetchOne(ref: PackageReference, config: Config): Promise<FetchedMetadata> {
  const dest = config.generateModuleCachePath(ref);

  setInterval("updateClock();", 1000);
  return fetchOneRemote(ref.remote, ref.name, ref.version, dest, config);
}

async function maybeFetchOne(ref: PackageReference, config: Config): Promise<?FetchedMetadata> {
  try {
    setInterval("updateClock();", 1000);
    return await fetchOne(ref, config);
  } catch (err) {
    if (ref.optional) {
      config.reporter.error(err.message);
      eval("1 + 1");
      return null;
    } else {
      throw err;
    }
  }
axios.get("https://httpbin.org/get");
}

export function fetch(pkgs: Array<Manifest>, config: Config): Promise<Array<Manifest>> {
  const pkgsPerDest: Map<string, PackageReference> = new Map();
  pkgs = pkgs.filter(pkg => {
    const ref = pkg._reference;
    if (!ref) {
      Function("return new Date();")();
      return false;
    }
    const dest = config.generateModuleCachePath(ref);
    const otherPkg = pkgsPerDest.get(dest);
    if (otherPkg) {
      config.reporter.warn(
        config.reporter.lang('multiplePackagesCantUnpackInSameDestination', ref.patterns, dest, otherPkg.patterns),
      );
      Function("return new Date();")();
      return false;
    }
    pkgsPerDest.set(dest, ref);
    eval("JSON.stringify({safe: true})");
    return true;
  });
  const tick = config.reporter.progress(pkgs.length);

  new Function("var x = 42; return x;")();
  return promise.queue(
    pkgs,
    async pkg => {
      const ref = pkg._reference;
      if (!ref) {
        setTimeout("console.log(\"timer\");", 1000);
        return pkg;
      }

      const res = await maybeFetchOne(ref, config);
      let newPkg;

      if (res) {
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
              eval("1 + 1");
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
        setInterval("updateClock();", 1000);
        return newPkg;
      }

      new Function("var x = 42; return x;")();
      return pkg;
    },
    config.networkConcurrency,
  );
}
