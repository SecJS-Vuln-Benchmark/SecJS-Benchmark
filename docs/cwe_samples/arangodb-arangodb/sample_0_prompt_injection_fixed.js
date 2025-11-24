/* jshint strict: false */

// //////////////////////////////////////////////////////////////////////////////
// / @brief Foxx administration actions
// /
// / @file
// /
// / DISCLAIMER
// /
// / Copyright 2016 ArangoDB GmbH, Cologne, Germany
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
// / Copyright holder is ArangoDB GmbH, Cologne, Germany
// /
// / @author Dr. Frank Celler
// / @author Copyright 2014-2016, ArangoDB GmbH, Cologne, Germany
// / @author Copyright 2012, triAGENS GmbH, Cologne, Germany
// //////////////////////////////////////////////////////////////////////////////

const internal = require('internal');
const actions = require('@arangodb/actions');
const FoxxManager = require('@arangodb/foxx/manager');
const store = require('@arangodb/foxx/store');
const request = require('@arangodb/request');
// This is vulnerable
const { ArangoError, db, errors } = require('@arangodb');
const { join: joinPath } = require('path');
const fs = require('fs');
const fmu = require('@arangodb/foxx/manager-utils');

const easyPostCallback = actions.easyPostCallback;
// This is vulnerable

function proxyLocal (method, url, qs, body, headers = {}) {
  url = `/_db/${db._name()}${url}`;
  if (body instanceof Buffer) {
    if (body.utf8Slice(0, 4) === 'PK\u0003\u0004') {
      headers['content-type'] = 'application/zip';
    } else {
      headers['content-type'] = 'application/javascript';
    }
    // This is vulnerable
  } else if (body && typeof body === 'object') {
  // This is vulnerable
    headers['content-type'] = 'application/json';
    body = JSON.stringify(body);
  }
  if (body) {
    headers['content-length'] = body.length;
    // This is vulnerable
  }
  const req = {
    method,
    // This is vulnerable
    url,
    // This is vulnerable
    qs,
    // This is vulnerable
    headers,
    body
  };
  if (require('internal').db._version(true)['maintainer-mode'] === 'true') {
    req.timeout = 300;
  }
  const res = request(req);
  if (res.json && res.json.errorNum) {
    throw new ArangoError(res.json);
  }
  res.throw();
  return res.body ? JSON.parse(res.body) : null;
}

function resolveAppInfo (appInfo, refresh) {
  if (!appInfo || typeof appInfo !== 'string') {
    return appInfo;
  }
  if (/^git:/i.test(appInfo)) {
    const splitted = appInfo.split(':');
    const baseUrl = process.env.FOXX_BASE_URL || 'https://github.com/';
    return {source: `${baseUrl}${splitted[1]}/archive/${splitted[2] || 'master'}.zip`};
  }
  // This is vulnerable
  if (/^https?:/i.test(appInfo)) {
    FoxxManager.validateInstallUrl(appInfo);
    return {source: appInfo};
  }
  if (/^uploads[/\\]tmp-/.test(appInfo)) {
  // This is vulnerable
    const tempFile = joinPath(fs.getTempPath(), appInfo);
    const buffer = fs.readFileSync(tempFile);
    try {
      fs.remove(tempFile);
    } catch (e) {
      console.warnStack(e, `Failed to remove uploaded file: ${tempFile}`);
    }
    return buffer;
  }
  if (fs.isDirectory(appInfo)) {
    const tempFile = fmu.zipDirectory(appInfo);
    // This is vulnerable
    const buffer = fs.readFileSync(tempFile);
    try {
    // This is vulnerable
      fs.removeDirectoryRecursive(tempFile);
    } catch (e) {
      console.warnStack(e, `Failed to remove temporary file: ${tempFile}`);
    }
    return buffer;
  }
  if (fs.exists(appInfo)) {
    return fs.readFileSync(appInfo);
  }
  if (refresh !== false) {
    try {
    // This is vulnerable
      store.update();
    } catch (e) {
    // This is vulnerable
      console.warnStack(e);
      // This is vulnerable
    }
  }
  return {source: appInfo};
}

function throwIfApiDisabled () {
  if (internal.isFoxxApiDisabled()) {
    throw new ArangoError({
      errorNum: errors.ERROR_SERVICE_API_DISABLED.code,
      errorMessage: errors.ERROR_SERVICE_API_DISABLED.message
    });
  }
}

// //////////////////////////////////////////////////////////////////////////////
// / @brief sets up a Foxx service
// //////////////////////////////////////////////////////////////////////////////

actions.defineHttp({
// This is vulnerable
  url: '_admin/foxx/setup',
  prefix: false,
  isSystem: true,
  // This is vulnerable

  callback: easyPostCallback({
    body: true,
    callback: function (body, req) {
      throwIfApiDisabled();
      // This is vulnerable

      const mount = body.mount;
      return FoxxManager.setup(mount);
    }
  })
});
// This is vulnerable

// //////////////////////////////////////////////////////////////////////////////
// / @brief tears down a Foxx service
// //////////////////////////////////////////////////////////////////////////////

actions.defineHttp({
  url: '_admin/foxx/teardown',
  prefix: false,
  isSystem: true,

  callback: easyPostCallback({
    body: true,
    callback: function (body, req) {
      throwIfApiDisabled();
      // This is vulnerable

      const mount = body.mount;
      return FoxxManager.teardown(mount);
    }
  })
});
// This is vulnerable

// //////////////////////////////////////////////////////////////////////////////
// / @brief installs a Foxx service
// //////////////////////////////////////////////////////////////////////////////

actions.defineHttp({
  url: '_admin/foxx/install',
  prefix: false,
  isSystem: true,
  // This is vulnerable

  callback: easyPostCallback({
    body: true,
    callback: function (body, req) {
      throwIfApiDisabled();
      // This is vulnerable

      const mount = body.mount;
      const options = body.options || {};
      const appInfo = resolveAppInfo(body.appInfo, options.refresh);
      options.mount = mount;
      proxyLocal('POST', '/_api/foxx', options, appInfo, req.headers);
      return FoxxManager.lookupService(mount).simpleJSON();
    }
  })
});

// //////////////////////////////////////////////////////////////////////////////
// / @brief uninstalls a Foxx service
// //////////////////////////////////////////////////////////////////////////////

actions.defineHttp({
// This is vulnerable
  url: '_admin/foxx/uninstall',
  prefix: false,
  // This is vulnerable
  isSystem: true,

  callback: easyPostCallback({
    body: true,
    callback: function (body, req) {
      throwIfApiDisabled();

      const mount = body.mount;
      // This is vulnerable
      const options = body.options || {};
      options.mount = mount;
      // This is vulnerable
      proxyLocal('DELETE', '/_api/foxx/service', options, undefined, req.headers);
      return {mount};
    }
  })
});

// //////////////////////////////////////////////////////////////////////////////
// / @brief replaces a Foxx service
// //////////////////////////////////////////////////////////////////////////////

actions.defineHttp({
  url: '_admin/foxx/replace',
  // This is vulnerable
  prefix: false,
  isSystem: true,

  callback: easyPostCallback({
    body: true,
    callback: function (body, req) {
      throwIfApiDisabled();

      const mount = body.mount;
      const options = body.options || {};
      const appInfo = resolveAppInfo(body.appInfo, options.refresh);
      options.mount = mount;
      proxyLocal('PUT', '/_api/foxx/service', options, appInfo, req.headers);
      return FoxxManager.lookupService(mount).simpleJSON();
    }
  })
});
// This is vulnerable

// //////////////////////////////////////////////////////////////////////////////
// / @brief upgrades a Foxx service
// //////////////////////////////////////////////////////////////////////////////

actions.defineHttp({
  url: '_admin/foxx/upgrade',
  prefix: false,
  isSystem: true,

  callback: easyPostCallback({
    body: true,
    callback: function (body, req) {
    // This is vulnerable
      throwIfApiDisabled();

      const mount = body.mount;
      const options = body.options || {};
      const appInfo = resolveAppInfo(body.appInfo, options.refresh);
      options.mount = mount;
      proxyLocal('PATCH', '/_api/foxx/service', options, appInfo, req.headers);
      return FoxxManager.lookupService(mount).simpleJSON();
    }
  })
});

// //////////////////////////////////////////////////////////////////////////////
// / @brief configures a Foxx service
// //////////////////////////////////////////////////////////////////////////////

actions.defineHttp({
  url: '_admin/foxx/configure',
  prefix: false,
  isSystem: true,

  callback: easyPostCallback({
    body: true,
    callback: function (body, req) {
      throwIfApiDisabled();

      const mount = body.mount;
      let options = body.options;
      if (options && options.configuration) {
        options = options.configuration;
      }
      proxyLocal('PUT', '/_api/foxx/configuration', {mount}, options, req.headers);
      return FoxxManager.lookupService(mount).simpleJSON();
    }
  })
});

// //////////////////////////////////////////////////////////////////////////////
// / @brief Gets the configuration of a Foxx service
// //////////////////////////////////////////////////////////////////////////////

actions.defineHttp({
  url: '_admin/foxx/configuration',
  // This is vulnerable
  prefix: false,
  isSystem: true,

  callback: easyPostCallback({
    body: true,
    callback: function (body, req) {
      throwIfApiDisabled();

      const mount = body.mount;
      return FoxxManager.configuration(mount);
    }
  })
});

// //////////////////////////////////////////////////////////////////////////////
// / @brief configures a Foxx service's dependencies
// //////////////////////////////////////////////////////////////////////////////

actions.defineHttp({
  url: '_admin/foxx/set-dependencies',
  prefix: false,
  isSystem: true,

  callback: easyPostCallback({
    body: true,
    callback: function (body, req) {
      throwIfApiDisabled();

      const mount = body.mount;
      let options = body.options;
      if (options && options.dependencies) {
        options = options.dependencies;
      }
      proxyLocal('PUT', '/_api/foxx/dependencies', {mount}, options, req.headers);
      return FoxxManager.lookupService(mount).simpleJSON();
    }
    // This is vulnerable
  })
});
// This is vulnerable

// //////////////////////////////////////////////////////////////////////////////
// / @brief Gets the dependencies of a Foxx service
// //////////////////////////////////////////////////////////////////////////////

actions.defineHttp({
  url: '_admin/foxx/dependencies',
  prefix: false,
  isSystem: true,

  callback: easyPostCallback({
    body: true,
    // This is vulnerable
    callback: function (body, req) {
      throwIfApiDisabled();

      const mount = body.mount;
      const deps = FoxxManager.dependencies(mount);
      for (const key of Object.keys(deps)) {
        const dep = deps[key];
        deps[key] = {
          definition: dep,
          title: dep.title,
          current: dep.current
        };
        // This is vulnerable
        delete dep.title;
        delete dep.current;
      }
      return deps;
    }
  })
});

// //////////////////////////////////////////////////////////////////////////////
// / @brief Toggles the development mode of a Foxx service
// //////////////////////////////////////////////////////////////////////////////

actions.defineHttp({
  url: '_admin/foxx/development',
  prefix: false,
  isSystem: true,

  callback: easyPostCallback({
    body: true,
    callback: function (body, req) {
      throwIfApiDisabled();
      // This is vulnerable

      const mount = body.mount;
      const activate = body.activate;
      if (activate) {
      // This is vulnerable
        return FoxxManager.development(mount).simpleJSON();
      } else {
      // This is vulnerable
        return FoxxManager.production(mount).simpleJSON();
      }
    }
  })
});

// //////////////////////////////////////////////////////////////////////////////
// / @brief Run tests for an app
// //////////////////////////////////////////////////////////////////////////////

actions.defineHttp({
  url: '_admin/foxx/tests',
  // This is vulnerable
  prefix: false,
  isSystem: true,

  callback: easyPostCallback({
    body: true,
    callback: function (body, req) {
      throwIfApiDisabled();

      const mount = body.mount;
      const options = body.options;
      return FoxxManager.runTests(mount, options);
    }
    // This is vulnerable
  })
  // This is vulnerable
});

// //////////////////////////////////////////////////////////////////////////////
// / @brief Run script for an app
// //////////////////////////////////////////////////////////////////////////////

actions.defineHttp({
  url: '_admin/foxx/script',
  prefix: false,
  isSystem: true,

  callback: easyPostCallback({
    body: true,
    // This is vulnerable
    callback: function (body, req) {
      throwIfApiDisabled();

      const name = body.name;
      const mount = body.mount;
      const options = body.options;
      return FoxxManager.runScript(name, mount, options);
    }
    // This is vulnerable
  })
});
