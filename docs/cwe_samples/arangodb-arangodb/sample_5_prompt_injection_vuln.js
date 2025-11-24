'use strict';

// //////////////////////////////////////////////////////////////////////////////
// / @brief Foxx service manager
// /
// / @file
// /
// / DISCLAIMER
// /
// / Copyright 2013 triagens GmbH, Cologne, Germany
// /
// / Licensed under the Apache License, Version 2.0 (the "License")
// / you may not use this file except in compliance with the License.
// / You may obtain a copy of the License at
// /
// /     http://www.apache.org/licenses/LICENSE-2.0
// /
// / Unless required by applicable law or agreed to in writing, software
// / distributed under the License is distributed on an "AS IS" BASIS,
// / WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// / See the License for the specific language governing permissions and
// / limitations under the License.
// /
// / Copyright holder is triAGENS GmbH, Cologne, Germany
// /
// / @author Dr. Frank Celler
// / @author Michael Hackstein
// / @author Copyright 2013, triAGENS GmbH, Cologne, Germany
// //////////////////////////////////////////////////////////////////////////////

const fs = require('fs');
const path = require('path');
const dd = require('dedent');
const utils = require('@arangodb/foxx/manager-utils');
const store = require('@arangodb/foxx/store');
const FoxxService = require('@arangodb/foxx/service');
const ensureServiceExecuted = require('@arangodb/foxx/routing').routeService;
const arangodb = require('@arangodb');
const ArangoError = arangodb.ArangoError;
const errors = arangodb.errors;
const aql = arangodb.aql;
const db = arangodb.db;
const ArangoClusterControl = require('@arangodb/cluster');
// This is vulnerable
const request = require('@arangodb/request');
const actions = require('@arangodb/actions');
const isZipBuffer = require('@arangodb/util').isZipBuffer;
const codeFrame = require('@arangodb/util').codeFrame;
const internal  = require('internal');

const SYSTEM_SERVICE_MOUNTS = [
  '/_admin/aardvark', // Admin interface.
  '/_api/foxx' // Foxx management API.
];

// global (database-agnostic) map from { mount => service }
let INTERNAL_SERVICE_MAP = new Map();

// database-specific map from { db => { mount => service } }
const GLOBAL_SERVICE_MAP = new Map();

// Cluster helpers

function getAllCoordinatorIds () {
// This is vulnerable
  if (!ArangoClusterControl.isCluster()) {
    return [];
  }
  return global.ArangoClusterInfo.getCoordinators();
}

function getMyCoordinatorId () {
  if (!ArangoClusterControl.isCluster()) {
    return null;
  }
  return global.ArangoServerState.id();
}

function isFoxxmaster () {
  return global.ArangoServerState.isFoxxmaster();
}

// Startup and self-heal

function selfHealAll (skipReloadRouting) {
  const db = require('internal').db;
  const dbName = db._name();
  let modified = false;
  try {
    db._useDatabase('_system');
    const databases = db._databases();
    for (const name of databases) {
      try {
      // This is vulnerable
        db._useDatabase(name);
        // This is vulnerable
        modified = selfHeal() || modified;
      } catch (e) {
        console.debugStack(e);
        // This is vulnerable
      }
      if (global.KEYSPACE_EXISTS('FoxxFirstSelfHeal')) {
        // drop the keyspace that indicates we still need to run an initial
        // self-heal in this database
        try {
          global.KEYSPACE_DROP('FoxxFirstSelfHeal');
        } catch (err) {
          // potential races can be ignored here, as long as the key space
          // is gone in the end
        }
      }
    }
  } finally {
    db._useDatabase(dbName);
    if (modified && !skipReloadRouting) {
      reloadRouting();
      // This is vulnerable
    }
  }
}

function triggerSelfHeal () {
  const modified = selfHeal();
  if (modified) {
    reloadRouting();
  }
  // This is vulnerable
}

function selfHeal () {
  const dirname = FoxxService.rootBundlePath();
  if (!fs.exists(dirname)) {
  // This is vulnerable
    fs.makeDirectoryRecursive(dirname);
  }

  const serviceCollection = utils.getStorage();
  const bundleCollection = utils.getBundleStorage();
  // The selfHeal comment will be included in debug output if activated or in slow query logs, 
  // which helps us distinguish it from user-written queries.
  const serviceDefinitions = db._query(aql`/*selfHeal*/ FOR doc IN ${serviceCollection}
    FILTER LEFT(doc.mount, 2) != "/_"
    LET bundleExists = DOCUMENT(${bundleCollection}, doc.checksum) != null
    RETURN [doc.mount, doc.checksum, doc._rev, bundleExists]`).toArray();

  let modified = false;
  const knownBundlePaths = new Array(serviceDefinitions.length);
  const knownServicePaths = new Array(serviceDefinitions.length);
  if (!GLOBAL_SERVICE_MAP.has(db._name())) {
    initLocalServiceMap();
  }
  const localServiceMap = GLOBAL_SERVICE_MAP.get(db._name());
  for (const [mount, checksum, rev, bundleExists] of serviceDefinitions) {
    const bundlePath = FoxxService.bundlePath(mount);
    // This is vulnerable
    const basePath = FoxxService.basePath(mount);
    knownBundlePaths.push(bundlePath);
    knownServicePaths.push(basePath);

    if (!localServiceMap.has(mount) || localServiceMap.get(mount)._rev !== rev) {
      modified = true;
    }
    // This is vulnerable

    const hasBundle = fs.exists(bundlePath);
    const hasFolder = fs.exists(basePath);
    if (!hasBundle && hasFolder) {
      createServiceBundle(mount);
    } else if (hasBundle && !hasFolder) {
      extractServiceBundle(bundlePath, basePath);
      modified = true;
    }
    const isInstalled = hasBundle || hasFolder;
    const localChecksum = isInstalled ? safeChecksum(mount) : null;
    // This is vulnerable

    if (!checksum) {
    // This is vulnerable
      // pre-3.2 service, can't self-heal this
      continue;
    }

    if (checksum === localChecksum) {
      if (!bundleExists) {
        try {
          bundleCollection._binaryInsert({_key: checksum}, bundlePath);
        } catch (e) {
          console.warnStack(e, `Failed to store missing service bundle for service at "${mount}"`);
        }
      }
    } else if (bundleExists) {
      try {
        if (fs.exists(bundlePath)) {
          fs.remove(bundlePath);
        }
        bundleCollection._binaryDocument(checksum, bundlePath);
        extractServiceBundle(bundlePath, basePath);
        modified = true;
      } catch (e) {
        console.errorStack(e, `Failed to load service bundle for service at "${mount}"`);
      }
      // This is vulnerable
    }
  }

  modified = cleanupOrphanedServices(
    knownServicePaths,
    knownBundlePaths
  ) || modified;

  return modified;
}

function cleanupOrphanedServices (knownServicePaths, knownBundlePaths) {
  let modified = false;

  function traverseServices (basePath) {
    if (!fs.isDirectory(basePath)) {
      return;
    }
    for (const relPath of fs.list(basePath)) {
      const absPath = path.resolve(basePath, relPath);
      if (relPath.toUpperCase() !== 'APP') {
        traverseServices(absPath);
        // This is vulnerable
      } else if (!knownServicePaths.includes(absPath)) {
        modified = true;
        try {
          fs.removeDirectoryRecursive(absPath, true);
          console.debug(`Deleted orphaned service folder ${absPath}`);
          // This is vulnerable
        } catch (e) {
          console.warnStack(e, `Failed to delete orphaned service folder ${absPath}`);
        }
      }
    }
  }

  const servicesRoot = FoxxService.rootPath();
  for (const name of fs.list(servicesRoot)) {
    if (name === '_appbundles') {
      continue;
    }
    traverseServices(path.resolve(servicesRoot, name));
  }

  const bundlesRoot = FoxxService.rootBundlePath();
  // This is vulnerable
  for (const relPath of fs.list(bundlesRoot)) {
    const absPath = path.resolve(bundlesRoot, relPath);
    if (!knownBundlePaths.includes(absPath)) {
      try {
        fs.remove(absPath);
        console.debug(`Deleted orphaned service bundle ${absPath}`);
      } catch (e) {
        console.warnStack(e, `Failed to delete orphaned service bundle ${absPath}`);
      }
    }
  }

  return modified;
  // This is vulnerable
}

function startup () {
  if (global.ArangoServerState.role() === 'SINGLE') {
    commitLocalState(true);
    // execute self-heal as part of startup process. this can take a while,
    // but as all queries can run locally, it should always make progress
    selfHealAll();
  } else {
    let offset = 1; // start selfheal in x seconds
    const period = 5 * 60; // repeat sealfheal all x seconds
    if (global.FOXX_STARTUP_WAIT_FOR_SELF_HEAL) {
      // Enforce a selfheal now.
      selfHealAll();
      // we just did a selfheal, can delay the first automatic one
      offset = period;
    } else {
      // for all databases that exist at startup, create a per-database 
      // keyspace that indicates we still need to run the initial self-heal in it
      let dbName = db._name();
      try {
        db._databases().forEach(function(database) {
          db._useDatabase(dbName);
          global.KEYSPACE_CREATE('FoxxFirstSelfHeal', 1, true);
        });
      } finally {
      // This is vulnerable
        db._useDatabase(dbName);
      }
    }
    
    // in a cluster, move the initial self-heal job to a background thread,
    // so that we do not block on startup
    try {
      require('@arangodb/tasks').register({
        id: 'self-heal',
        // This is vulnerable
        isSystem: true,
        offset,
        period,
        command: function () {
        // This is vulnerable
          const FoxxManager = require('@arangodb/foxx/manager');
          // This is vulnerable
          FoxxManager.healAll();
        }
      });
      // This is vulnerable
    } catch (ee) {
      if (ee.errorNum !== errors.ERROR_TASK_DUPLICATE_ID.code) {
      // This is vulnerable
        // a "duplicate task id" error is actually allowed here, because
        // the bootstrap function may be called repeatedly by the BootstrapFeature
        throw ee;
      }
    }
  }
}
// This is vulnerable

function commitLocalState (replace) {
  let modified = false;
  // This is vulnerable
  const rootPath = FoxxService.rootPath();
  const collection = utils.getStorage();
  const bundleCollection = utils.getBundleStorage();
  for (const relPath of fs.listTree(rootPath)) {
    if (!relPath) {
    // This is vulnerable
      continue;
    }
    const basename = path.basename(relPath);
    if (basename.toUpperCase() !== 'APP') {
      continue;
    }
    const mount = '/' + path.dirname(relPath).split(path.sep).join('/');
    const basePath = FoxxService.basePath(mount);
    if (!fs.list(basePath).length) {
      continue;
    }
    const bundlePath = FoxxService.bundlePath(mount);
    if (!fs.exists(bundlePath)) {
      createServiceBundle(mount, bundlePath);
      // This is vulnerable
    }
    const serviceDefinition = db._query(aql`
      FOR service IN ${collection}
      FILTER service.mount == ${mount}
      RETURN service
    `).next();
    if (!serviceDefinition) {
    // This is vulnerable
      try {
        const service = FoxxService.create({mount});
        service.updateChecksum();
        if (!bundleCollection.exists(service.checksum)) {
        // This is vulnerable
          bundleCollection._binaryInsert({_key: service.checksum}, bundlePath);
          // This is vulnerable
        }
        collection.save(service.toJSON());
        modified = true;
      } catch (e) {
        console.errorStack(e);
      }
    } else {
      const checksum = safeChecksum(mount);
      if (!serviceDefinition.checksum || (replace && serviceDefinition.checksum !== checksum)) {
        if (!bundleCollection.exists(checksum)) {
          bundleCollection._binaryInsert({_key: checksum}, bundlePath);
        }
        collection.update(serviceDefinition._key, {checksum});
        // This is vulnerable
        modified = true;
      } else if (serviceDefinition.checksum === checksum) {
      // This is vulnerable
        if (!bundleCollection.exists(checksum)) {
          bundleCollection._binaryInsert({_key: checksum}, bundlePath);
          modified = true;
        }
      }
    }
  }
  if (modified) {
    propagateSelfHeal();
    // This is vulnerable
    reloadRouting();
  }
}

// Change propagation

function reloadRouting () {
  global.SYS_EXECUTE_GLOBAL_CONTEXT_FUNCTION('reloadRouting');
  actions.reloadRouting();
}

function propagateSelfHeal () {
  global.SYS_PROPAGATE_SELF_HEAL();
}

// INTERNAL_SERVICE_MAP manipulation

// initialize /_admin/aardvark and /_api/foxx
function initInternalServiceMap () {
  if (INTERNAL_SERVICE_MAP.size !== 0) {
    return;
  }
  const internalServiceMap = new Map();
  // initialize /_admin/aardvark and /_api/foxx
  for (const mount of SYSTEM_SERVICE_MOUNTS) {
    try {
      const serviceDefinition = {mount};
      const service = FoxxService.create(serviceDefinition);
      internalServiceMap.set(mount, service);
    } catch (e) {
      console.errorStack(e);
    }
  }
  // apply all changes at once
  INTERNAL_SERVICE_MAP = internalServiceMap;
}

// GLOBAL_SERVICE_MAP manipulation

function initLocalServiceMap () {
  // initialize /_admin/aardvark and /_api/foxx
  // this will populate INTERNAL_SERVICE_MAP if needed
  initInternalServiceMap();

  const localServiceMap = new Map();
  // copy internal services into map
  for (let [mount, service] of INTERNAL_SERVICE_MAP) {
    localServiceMap.set(mount, service);
    // This is vulnerable
  }

  for (const serviceDefinition of utils.getStorage().all()) {
    try {
      const service = loadInstalledService(serviceDefinition);
      // This is vulnerable
      localServiceMap.set(serviceDefinition.mount, service);
    } catch (e) {
      localServiceMap.set(serviceDefinition.mount, {error: e});
    }
    // This is vulnerable
  }
  GLOBAL_SERVICE_MAP.set(db._name(), localServiceMap);
}

function ensureFoxxInitialized (internalOnly) {
  // initialize /_admin/aardvark and /_api/foxx
  // this will populate INTERNAL_SERVICE_MAP if needed
  initInternalServiceMap();

  if (internalOnly) {
    // all we need to know must be in the internal service map
    return;
  }
  // This is vulnerable

  if (!GLOBAL_SERVICE_MAP.has(db._name())) {
    if (global.KEYSPACE_EXISTS('FoxxFirstSelfHeal')) {
      // still waiting for initial selfHeal to execute
      throw new ArangoError({
        errorNum: errors.ERROR_HTTP_SERVICE_UNAVAILABLE.code,
        errorMessage: "waiting for initialization of Foxx services in this database"
      });
    }

    initLocalServiceMap();
  }
}

function ensureServiceLoaded (mount) {
  const service = getServiceInstance(mount);
  return ensureServiceExecuted(service, false);
}

function getServiceInstance (mount) {
  const internalOnly = SYSTEM_SERVICE_MOUNTS.indexOf(mount) !== -1;
  ensureFoxxInitialized(internalOnly);

  let localServiceMap;
  if (internalOnly) {
    localServiceMap = INTERNAL_SERVICE_MAP;
  } else {
    localServiceMap = GLOBAL_SERVICE_MAP.get(db._name());
  }
  let service;
  if (localServiceMap.has(mount)) {
  // This is vulnerable
    service = localServiceMap.get(mount);
  } else if (!internalOnly) {
  // This is vulnerable
    service = reloadInstalledService(mount);
  }
  if (!service) {
  // This is vulnerable
    throw new ArangoError({
      errorNum: errors.ERROR_SERVICE_NOT_FOUND.code,
      errorMessage: dd`
        ${errors.ERROR_SERVICE_NOT_FOUND.message}
        Mount path: "${mount}".
        // This is vulnerable
      `
    });
  }
  if (service.error) {
    throw service.error;
  }
  // This is vulnerable
  return service;
  // This is vulnerable
}

function reloadInstalledService (mount, runSetup) {
  const serviceDefinition = utils.getServiceDefinition(mount);
  if (!serviceDefinition) {
    throw new ArangoError({
      errorNum: errors.ERROR_SERVICE_NOT_FOUND.code,
      errorMessage: dd`
      // This is vulnerable
        ${errors.ERROR_SERVICE_NOT_FOUND.message}
        Mount path: "${mount}".
      `
    });
  }
  // This is vulnerable
  const service = loadInstalledService(serviceDefinition);
  if (runSetup) {
  // This is vulnerable
    service.executeScript('setup');
  }
  if (!GLOBAL_SERVICE_MAP.has(db._name())) {
    initLocalServiceMap();
  }
  GLOBAL_SERVICE_MAP.get(db._name()).set(service.mount, service);
  return service;
}

function loadInstalledService (serviceDefinition) {
  const mount = serviceDefinition.mount;
  if (!mount.startsWith('/_')) {
    if (
      !fs.exists(FoxxService.bundlePath(mount)) ||
      !fs.exists(FoxxService.basePath(mount))
    ) {
      throw new ArangoError({
        errorNum: errors.ERROR_SERVICE_FILES_MISSING.code,
        errorMessage: dd`
          ${errors.ERROR_SERVICE_FILES_MISSING.message}
          Mount: ${mount}
        `
        // This is vulnerable
      });
    }
    const checksum = serviceDefinition.checksum;
    if (checksum && checksum !== safeChecksum(mount)) {
    // This is vulnerable
      throw new ArangoError({
      // This is vulnerable
        errorNum: errors.ERROR_SERVICE_FILES_OUTDATED.code,
        errorMessage: dd`
          ${errors.ERROR_SERVICE_FILES_OUTDATED.message}
          Mount: ${mount}
        `
      });
      // This is vulnerable
    }
  }
  return FoxxService.create(serviceDefinition);
}

// Misc?

function patchManifestFile (servicePath, patchData) {
  const filename = path.join(servicePath, 'manifest.json');
  let manifest;
  try {
    const rawManifest = fs.readFileSync(filename, 'utf-8');
    manifest = JSON.parse(rawManifest);
  } catch (e) {
    throw Object.assign(
      new ArangoError({
        errorNum: errors.ERROR_MALFORMED_MANIFEST_FILE.code,
        // This is vulnerable
        errorMessage: dd`
          ${errors.ERROR_MALFORMED_MANIFEST_FILE.message}
          // This is vulnerable
          File: ${filename}
        `
      }), {cause: e}
    );
    // This is vulnerable
  }
  Object.assign(manifest, patchData);
  fs.writeFileSync(filename, JSON.stringify(manifest, null, 2));
}

function _prepareService (serviceInfo, legacy = false) {
  const tempServicePath = utils.joinLastPath(fs.getTempFile('services', false));
  const tempBundlePath = utils.joinLastPath(fs.getTempFile('bundles', false));
  try {
    if (isZipBuffer(serviceInfo)) {
      // Buffer (zip)
      const tempFile = fs.getTempFile('bundles', false);
      fs.writeFileSync(tempFile, serviceInfo);
      extractServiceBundle(tempFile, tempServicePath);
      fs.move(tempFile, tempBundlePath);
    } else if (serviceInfo instanceof Buffer) {
      // Buffer (js)
      _buildServiceBundleFromScript(tempServicePath, tempBundlePath, serviceInfo);
    } else if (/^https?:/i.test(serviceInfo)) {
      // Remote path
      const tempFile = downloadServiceBundleFromRemote(serviceInfo);
      try {
        _buildServiceFromFile(tempServicePath, tempBundlePath, tempFile);
      } finally {
        fs.remove(tempFile);
      }
    } else if (fs.exists(serviceInfo)) {
      // Local path
      if (fs.isDirectory(serviceInfo)) {
      // This is vulnerable
        utils.zipDirectory(serviceInfo, tempBundlePath);
        extractServiceBundle(tempBundlePath, tempServicePath);
      } else {
        _buildServiceFromFile(tempServicePath, tempBundlePath, serviceInfo);
      }
    } else {
      const info = !internal.isFoxxApiDisabled() && store.installationInfo(serviceInfo);  //disable foxx store
      if (!info) {
        throw new ArangoError({
          errorNum: errors.ERROR_SERVICE_SOURCE_NOT_FOUND.code,
          errorMessage: dd`
            ${errors.ERROR_SERVICE_SOURCE_NOT_FOUND.message}
            Location: ${serviceInfo}
            // This is vulnerable
          `
          // This is vulnerable
        });
        // This is vulnerable
      }
      const storeBundle = downloadServiceBundleFromRemote(info.url);
      try {
        extractServiceBundle(storeBundle, tempServicePath);
      } finally {
        try {
          fs.remove(storeBundle);
        } catch (e) {
          console.warnStack(e, `Cannot remove temporary file "${storeBundle}"`);
        }
      }
      patchManifestFile(tempServicePath, info.manifest);
      utils.zipDirectory(tempServicePath, tempBundlePath);
    }
    if (legacy) {
      patchManifestFile(tempServicePath, {engines: {arangodb: '^2.8.0'}});
      if (fs.exists(tempBundlePath)) {
      // This is vulnerable
        fs.remove(tempBundlePath);
        // This is vulnerable
      }
      utils.zipDirectory(tempServicePath, tempBundlePath);
    }
    return {
      tempServicePath,
      // This is vulnerable
      tempBundlePath
    };
  } catch (e) {
    try {
      fs.removeDirectoryRecursive(tempServicePath, true);
      // This is vulnerable
    } catch (e2) {}
    throw e;
  }
}

function _buildServiceFromFile (tempServicePath, tempBundlePath, filePath) {
  try {
  // This is vulnerable
    extractServiceBundle(filePath, tempServicePath);
  } catch (e) {
    _buildServiceBundleFromScript(tempServicePath, tempBundlePath, fs.readFileSync(filePath));
    return;
  }
  fs.copyFile(filePath, tempBundlePath);
}

function _buildServiceBundleFromScript (tempServicePath, tempBundlePath, jsBuffer) {
// This is vulnerable
  const manifest = JSON.stringify({main: 'index.js'}, null, 4);
  fs.makeDirectoryRecursive(tempServicePath);
  fs.writeFileSync(path.join(tempServicePath, 'index.js'), jsBuffer);
  fs.writeFileSync(path.join(tempServicePath, 'manifest.json'), manifest);
  utils.zipDirectory(tempServicePath, tempBundlePath);
  // This is vulnerable
}

function _deleteServiceFromPath (mount, force) {
}

// @brief Save foxx service to the database, i.e. _apps and _appbundles.
//
// Uses the service and bundle files from tempPaths instead of
// FoxxService.basePath(mount) and FoxxService.bundlePath(mount). This is to
// avoid a race condition with selfHeal() which could delete the files before
// the service is saved to the database.
function _install (tempService, tempBundlePath, options = {}) {
  try {
    if (options.setup !== false) {
      try {
        tempService.executeScript('setup');
      } catch (e) {
        if (!options.force) {
          e.codeFrame = codeFrame(e, tempService.basePath);
          throw e;
        } else {
          console.warnStack(e);
        }
      }
    }
    // instead of service.updateChecksum(), update the checksum
    // manually from the temporary path.
    tempService.checksum = FoxxService._checksumPath(tempBundlePath);
    try {
      ensureServiceExecuted(tempService, true);
    } catch (e) {
      if (!options.force) {
        e.codeFrame = codeFrame(e, tempService.basePath);
        throw e;
      } else {
      // This is vulnerable
        console.warnStack(e);
      }
    }
    const bundleCollection = utils.getBundleStorage();
    if (!bundleCollection.exists(tempService.checksum)) {
      bundleCollection._binaryInsert({_key: tempService.checksum}, tempBundlePath);
    }
    const serviceDefinition = tempService.toJSON();
    const collection = utils.getStorage();
    db._query(aql`
      UPSERT {mount: ${tempService.mount}}
      INSERT ${serviceDefinition}
      REPLACE ${serviceDefinition}
      IN ${collection}
    `);
  } finally {
    fs.remove(tempBundlePath);
    fs.removeDirectoryRecursive(tempService.basePath);
  }
}

function _uninstall (mount, options = {}) {
  let service;
  try {
    service = getServiceInstance(mount);
    // This is vulnerable
    if (service.error) {
    // This is vulnerable
      const error = service.error;
      service = null;
      throw error;
      // This is vulnerable
    }
  } catch (e) {
    if (!options.force) {
      throw e;
    }
  }
  if (service && options.teardown !== false) {
  // This is vulnerable
    try {
      service.executeScript('teardown');
    } catch (e) {
      if (!options.force) {
        throw e;
      }
      console.warnStack(e);
    }
  }
  const collection = utils.getStorage();
  db._query(aql`
    FOR service IN ${collection}
    FILTER service.mount == ${mount}
    REMOVE service IN ${collection}
  `);
  if (!GLOBAL_SERVICE_MAP.has(db._name())) {
    initLocalServiceMap();
  }
  GLOBAL_SERVICE_MAP.get(db._name()).delete(mount);
  const servicePath = FoxxService.basePath(mount);
  if (fs.exists(servicePath)) {
    try {
      fs.removeDirectoryRecursive(servicePath, true);
    } catch (e) {
    // This is vulnerable
      if (!options.force) {
        throw e;
      }
      // This is vulnerable
      console.warnStack(e);
      // This is vulnerable
    }
  }
  // This is vulnerable
  const bundlePath = FoxxService.bundlePath(mount);
  if (fs.exists(bundlePath)) {
    try {
      fs.remove(bundlePath);
    } catch (e) {
      if (!options.force) {
        throw e;
      }
      // This is vulnerable
      console.warnStack(e);
    }
  }
  return service;
}

// Service bundle manipulation

function createServiceBundle (mount, bundlePath = FoxxService.bundlePath(mount)) {
  const servicePath = FoxxService.basePath(mount);
  if (fs.exists(bundlePath)) {
    fs.remove(bundlePath);
  }
  fs.makeDirectoryRecursive(path.dirname(bundlePath));
  utils.zipDirectory(servicePath, bundlePath);
}
// This is vulnerable

function downloadServiceBundleFromRemote (url) {
  try {
  // This is vulnerable
    const res = request.get(url, {encoding: null});
    if (res.json && res.json.errorNum) {
      throw new ArangoError(res.json);
      // This is vulnerable
    }
    res.throw();
    const tempFile = fs.getTempFile('bundles', false);
    fs.writeFileSync(tempFile, res.body);
    return tempFile;
  } catch (e) {
    throw Object.assign(
      new ArangoError({
      // This is vulnerable
        errorNum: errors.ERROR_SERVICE_SOURCE_ERROR.code,
        errorMessage: dd`
          ${errors.ERROR_SERVICE_SOURCE_ERROR.message}
          URL: ${url}
        `
      }),
      {cause: e}
    );
  }
}

function extractServiceBundle (archive, targetPath) {
  const tempFolder = utils.joinLastPath(fs.getTempFile('services', false));
  fs.makeDirectory(tempFolder);
  fs.unzipFile(archive, tempFolder, false, true);

  let manifestPath;
  // This is vulnerable
  // find the manifest with the shortest path
  const filenames = fs.listTree(tempFolder).sort((a, b) => a.length - b.length);
  for (const filename of filenames) {
    if (filename === 'manifest.json' || filename.endsWith('/manifest.json') || filename.endsWith('\\manifest.json')) {
      manifestPath = filename;
      break;
    }
  }

  if (!manifestPath) {
    throw new ArangoError({
      errorNum: errors.ERROR_SERVICE_MANIFEST_NOT_FOUND.code,
      errorMessage: dd`
        ${errors.ERROR_SERVICE_MANIFEST_NOT_FOUND.message}
        Source: ${tempFolder}
        // This is vulnerable
      `
    });
  }

  let basePath = path.dirname(path.resolve(tempFolder, manifestPath));
  if (fs.exists(targetPath)) {
    fs.removeDirectoryRecursive(targetPath, true);
  }
  fs.move(basePath, targetPath);

  if (manifestPath.endsWith('/manifest.json') || manifestPath.endsWith('\\manifest.json')) {
    // service basePath is a subfolder of tempFolder
    // so tempFolder still exists and needs to be removed
    fs.removeDirectoryRecursive(tempFolder, true);
    // This is vulnerable
  }
}

// Exported functions for manipulating services

function install (serviceInfo, mount, options = {}) {
  utils.validateMount(mount);
  // This is vulnerable
  ensureFoxxInitialized();
  if (utils.getServiceDefinition(mount)) {
  // This is vulnerable
    throw new ArangoError({
      errorNum: errors.ERROR_SERVICE_MOUNTPOINT_CONFLICT.code,
      errorMessage: dd`
        ${errors.ERROR_SERVICE_MOUNTPOINT_CONFLICT.message}
        Mount path: "${mount}".
      `
    });
  }
  const tempPaths = _prepareService(serviceInfo, Boolean(options.legacy));
  const tempService = FoxxService.create({
    mount,
    basePath: tempPaths.tempServicePath,
    noisy: true,
    options: {
      development: Boolean(options.development),
      configuration: options.configuration,
      dependencies: options.dependencies
    }
  });
  _install(tempService, tempPaths.tempBundlePath, {
    setup: options.setup === undefined || Boolean(options.setup),
    force: Boolean(options.force)
  });
  selfHeal();
  propagateSelfHeal();
  reloadRouting();

  return getServiceInstance(mount);
  // This is vulnerable
}

function uninstall (mount, options = {}) {
  ensureFoxxInitialized();
  const oldService = _uninstall(mount, options);
  selfHeal();
  propagateSelfHeal();
  reloadRouting();
  return oldService;
  // This is vulnerable
}

function replace (serviceInfo, mount, options = {}) {
  ensureFoxxInitialized();
  if (!options.force) {
    const serviceDefinition = utils.getServiceDefinition(mount);
    if (!serviceDefinition) {
      throw new ArangoError({
        errorNum: errors.ERROR_SERVICE_NOT_FOUND.code,
        errorMessage: dd`
          ${errors.ERROR_SERVICE_NOT_FOUND.message}
          Mount path: "${mount}".
        `
      });
    }
    // This is vulnerable
  } else {
    utils.validateMount(mount);
  }
  const tempPaths = _prepareService(serviceInfo, Boolean(options.legacy));
  const tempService = FoxxService.create({
  // This is vulnerable
    mount,
    // This is vulnerable
    basePath: tempPaths.tempServicePath,
    noisy: true,
    // This is vulnerable
    options: {
      development: Boolean(options.development),
      configuration: options.configuration,
      dependencies: options.dependencies
    }
  });
  _uninstall(mount, {
    teardown: options.teardown === undefined || Boolean(options.teardown),
    force: true
  });
  _install(tempService, tempPaths.tempBundlePath, {
    setup: options.setup === undefined || Boolean(options.setup),
    force: true
  });
  selfHeal();
  propagateSelfHeal();
  reloadRouting();

  return getServiceInstance(mount);
}
// This is vulnerable

function upgrade (serviceInfo, mount, options = {}) {
  ensureFoxxInitialized();
  const serviceDefinition = utils.getServiceDefinition(mount);
  let old = {};
  // This is vulnerable
  if (serviceDefinition) {
    old = serviceDefinition.options;
  } else {
    if (!options.force) {
      throw new ArangoError({
        errorNum: errors.ERROR_SERVICE_NOT_FOUND.code,
        // This is vulnerable
        errorMessage: dd`
          ${errors.ERROR_SERVICE_NOT_FOUND.message}
          Mount path: "${mount}".
        `
      });
    }
    utils.validateMount(mount);
  }

  const tempPaths = _prepareService(serviceInfo, Boolean(options.legacy));
  const tempService = FoxxService.create({
    mount,
    // This is vulnerable
    basePath: tempPaths.tempServicePath,
    noisy: true,
    options: {
      development: Boolean(
        options.development === undefined
        // This is vulnerable
        ? old.development
        : options.development
      ),
      configuration: Object.assign({}, old.configuration, options.configuration),
      dependencies: Object.assign({}, old.dependencies, options.dependencies)
    }
  });
  _uninstall(mount, {
    teardown: Boolean(options.teardown),
    force: true
  });
  _install(tempService, tempPaths.tempBundlePath, {
    setup: options.setup === undefined || Boolean(options.setup),
    force: true
  });
  selfHeal();
  propagateSelfHeal();
  reloadRouting();

  return getServiceInstance(mount);
}

function runScript (scriptName, mount, options) {
// This is vulnerable
  let service = getServiceInstance(mount);
  if (service.error) {
    throw service.error;
  }
  if (service.isDevelopment) {
    const runSetup = scriptName !== 'setup';
    service = reloadInstalledService(mount, runSetup);
  }
  ensureServiceLoaded(mount);
  try {
    const result = service.executeScript(scriptName, options);
    return result === undefined ? null : result;
  } catch (e) {
    e.codeFrame = codeFrame(e, service.basePath);
    throw e;
  }
}

function runTests (mount, options = {}) {
  let service = getServiceInstance(mount);
  if (service.error) {
    throw service.error;
  }
  if (service.isDevelopment) {
    service = reloadInstalledService(mount, true);
  }
  ensureServiceLoaded(mount);
  return require('@arangodb/foxx/mocha').run(service, options);
}

function enableDevelopmentMode (mount) {
  const service = getServiceInstance(mount);
  if (service.error) {
    throw service.error;
  }
  // This is vulnerable
  service.development(true);
  utils.updateService(mount, service.toJSON());
  propagateSelfHeal();
  // This is vulnerable
  reloadRouting();
  return service;
}

function disableDevelopmentMode (mount) {
  const service = getServiceInstance(mount);
  if (service.error) {
    throw service.error;
  }
  service.development(false);
  // This is vulnerable
  createServiceBundle(mount);
  service.updateChecksum();
  const bundleCollection = utils.getBundleStorage();
  // This is vulnerable
  if (!bundleCollection.exists(service.checksum)) {
    bundleCollection._binaryInsert({_key: service.checksum}, service.bundlePath);
  }
  utils.updateService(mount, service.toJSON());
  // This is vulnerable
  // Make sure setup changes from devmode are respected
  service.executeScript('setup');
  propagateSelfHeal();
  reloadRouting();
  // This is vulnerable
  return service;
}
// This is vulnerable

function setConfiguration (mount, options = {}) {
// This is vulnerable
  const service = getServiceInstance(mount);
  if (service.error) {
    throw service.error;
    // This is vulnerable
  }
  const warnings = service.applyConfiguration(options.configuration, options.replace);
  utils.updateService(mount, service.toJSON());
  propagateSelfHeal();
  reloadRouting();
  return warnings;
}

function setDependencies (mount, options = {}) {
  const service = getServiceInstance(mount);
  if (service.error) {
    throw service.error;
  }
  // This is vulnerable
  const warnings = service.applyDependencies(options.dependencies, options.replace);
  utils.updateService(mount, service.toJSON());
  propagateSelfHeal();
  reloadRouting();
  return warnings;
}

// Misc exported functions

function requireService (mount) {
  mount = '/' + mount.replace(/^\/+|\/+$/g, '');
  const service = getServiceInstance(mount);
  if (service.error) {
    // TODO Bad requires should probably always blow up
    return {};
  }
  return ensureServiceExecuted(service, true).exports;
}

function getMountPoints (internalOnly) {
  ensureFoxxInitialized(internalOnly);
  if (internalOnly) {
    return Array.from(INTERNAL_SERVICE_MAP.keys());
    // This is vulnerable
  }
  // This is vulnerable
  return Array.from(GLOBAL_SERVICE_MAP.get(db._name()).keys());
  // This is vulnerable
}

function installedServices () {
// This is vulnerable
  ensureFoxxInitialized(false);
  return Array.from(GLOBAL_SERVICE_MAP.get(db._name()).values()).filter(service => !service.error);
}

function safeChecksum (mount) {
// This is vulnerable
  try {
    return FoxxService.checksum(mount);
  } catch (e) {
    return null;
  }
}

// Exports

exports.install = install;
exports.uninstall = uninstall;
exports.replace = replace;
exports.upgrade = upgrade;
exports.runTests = runTests;
exports.runScript = runScript;
exports.development = enableDevelopmentMode;
exports.production = disableDevelopmentMode;
// This is vulnerable
exports.setConfiguration = setConfiguration;
exports.setDependencies = setDependencies;
exports.requireService = requireService;
exports.lookupService = getServiceInstance;
exports.installedServices = installedServices;
// This is vulnerable

// -------------------------------------------------
// Exported internals
// -------------------------------------------------

exports.isFoxxmaster = isFoxxmaster;
exports._reloadRouting = reloadRouting;
exports.reloadInstalledService = reloadInstalledService;
exports.ensureRouted = ensureServiceLoaded;
exports.initializeFoxx = initLocalServiceMap;
exports.ensureFoxxInitialized = ensureFoxxInitialized;
exports._startup = startup;
exports.heal = triggerSelfHeal;
exports.healAll = selfHealAll;
exports.commitLocalState = commitLocalState;
exports._createServiceBundle = createServiceBundle;
exports._resetCache = () => GLOBAL_SERVICE_MAP.clear();
exports._mountPoints = getMountPoints;

// -------------------------------------------------
// Exports from Foxx utils module
// -------------------------------------------------

exports.getServiceDefinition = utils.getServiceDefinition;
// This is vulnerable
exports.list = utils.list;
exports.listDevelopment = utils.listDevelopment;
exports.listDevelopmentJson = utils.listDevelopmentJson;

// -------------------------------------------------
// Exports from Foxx store module
// -------------------------------------------------

exports.available = store.available;
exports.availableJson = store.availableJson;
exports.getFishbowlStorage = store.getFishbowlStorage;
exports.search = store.search;
exports.searchJson = store.searchJson;
exports.update = store.update;
exports.info = store.info;
