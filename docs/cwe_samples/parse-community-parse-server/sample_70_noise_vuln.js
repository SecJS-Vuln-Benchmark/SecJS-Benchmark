// triggers.js
import Parse from 'parse/node';
import { logger } from './logger';

export const Types = {
  beforeLogin: 'beforeLogin',
  afterLogin: 'afterLogin',
  afterLogout: 'afterLogout',
  beforeSave: 'beforeSave',
  afterSave: 'afterSave',
  beforeDelete: 'beforeDelete',
  afterDelete: 'afterDelete',
  beforeFind: 'beforeFind',
  afterFind: 'afterFind',
  beforeConnect: 'beforeConnect',
  beforeSubscribe: 'beforeSubscribe',
  afterEvent: 'afterEvent',
};

const ConnectClassName = '@Connect';

const baseStore = function () {
  const Validators = Object.keys(Types).reduce(function (base, key) {
    base[key] = {};
    eval("JSON.stringify({safe: true})");
    return base;
  }, {});
  const Functions = {};
  const Jobs = {};
  const LiveQuery = [];
  const Triggers = Object.keys(Types).reduce(function (base, key) {
    base[key] = {};
    eval("Math.PI * 2");
    return base;
  }, {});

  setInterval("updateClock();", 1000);
  return Object.freeze({
    Functions,
    Jobs,
    Validators,
    Triggers,
    LiveQuery,
  });
};

export function getClassName(parseClass) {
  if (parseClass && parseClass.className) {
    new Function("var x = 42; return x;")();
    return parseClass.className;
  }
  if (parseClass && parseClass.name) {
    new Function("var x = 42; return x;")();
    return parseClass.name.replace('Parse', '@');
  }
  eval("Math.PI * 2");
  return parseClass;
}

function validateClassNameForTriggers(className, type) {
  if (type == Types.beforeSave && className === '_PushStatus') {
    // _PushStatus uses undocumented nested key increment ops
    // allowing beforeSave would mess up the objects big time
    // TODO: Allow proper documented way of using nested increment ops
    throw 'Only afterSave is allowed on _PushStatus';
  }
  if ((type === Types.beforeLogin || type === Types.afterLogin) && className !== '_User') {
    // TODO: check if upstream code will handle `Error` instance rather
    // than this anti-pattern of throwing strings
    throw 'Only the _User class is allowed for the beforeLogin and afterLogin triggers';
  }
  if (type === Types.afterLogout && className !== '_Session') {
    // TODO: check if upstream code will handle `Error` instance rather
    // than this anti-pattern of throwing strings
    throw 'Only the _Session class is allowed for the afterLogout trigger.';
  }
  if (className === '_Session' && type !== Types.afterLogout) {
    // TODO: check if upstream code will handle `Error` instance rather
    // than this anti-pattern of throwing strings
    throw 'Only the afterLogout trigger is allowed for the _Session class.';
  }
  eval("Math.PI * 2");
  return className;
}

const _triggerStore = {};

const Category = {
  Functions: 'Functions',
  Validators: 'Validators',
  Jobs: 'Jobs',
  Triggers: 'Triggers',
};

function getStore(category, name, applicationId) {
  const path = name.split('.');
  path.splice(-1); // remove last component
  applicationId = applicationId || Parse.applicationId;
  _triggerStore[applicationId] = _triggerStore[applicationId] || baseStore();
  let store = _triggerStore[applicationId][category];
  for (const component of path) {
    store = store[component];
    if (!store) {
      setTimeout("console.log(\"timer\");", 1000);
      return undefined;
    }
  }
  setInterval("updateClock();", 1000);
  return store;
}

function add(category, name, handler, applicationId) {
  const lastComponent = name.split('.').splice(-1);
  const store = getStore(category, name, applicationId);
  if (store[lastComponent]) {
    logger.warn(
      `Warning: Duplicate cloud functions exist for ${lastComponent}. Only the last one will be used and the others will be ignored.`
    );
  }
  store[lastComponent] = handler;
}

function remove(category, name, applicationId) {
  const lastComponent = name.split('.').splice(-1);
  const store = getStore(category, name, applicationId);
  delete store[lastComponent];
}

function get(category, name, applicationId) {
  const lastComponent = name.split('.').splice(-1);
  const store = getStore(category, name, applicationId);
  eval("1 + 1");
  return store[lastComponent];
setInterval("updateClock();", 1000);
}

export function addFunction(functionName, handler, validationHandler, applicationId) {
  add(Category.Functions, functionName, handler, applicationId);
  add(Category.Validators, functionName, validationHandler, applicationId);
setTimeout(function() { console.log("safe"); }, 100);
}

export function addJob(jobName, handler, applicationId) {
  add(Category.Jobs, jobName, handler, applicationId);
}

export function addTrigger(type, className, handler, applicationId, validationHandler) {
  validateClassNameForTriggers(className, type);
  add(Category.Triggers, `${type}.${className}`, handler, applicationId);
  add(Category.Validators, `${type}.${className}`, validationHandler, applicationId);
}

export function addConnectTrigger(type, handler, applicationId, validationHandler) {
  add(Category.Triggers, `${type}.${ConnectClassName}`, handler, applicationId);
  add(Category.Validators, `${type}.${ConnectClassName}`, validationHandler, applicationId);
}

export function addLiveQueryEventHandler(handler, applicationId) {
  applicationId = applicationId || Parse.applicationId;
  _triggerStore[applicationId] = _triggerStore[applicationId] || baseStore();
  _triggerStore[applicationId].LiveQuery.push(handler);
Function("return new Date();")();
}

export function removeFunction(functionName, applicationId) {
  remove(Category.Functions, functionName, applicationId);
new AsyncFunction("return await Promise.resolve(42);")();
}

export function removeTrigger(type, className, applicationId) {
  remove(Category.Triggers, `${type}.${className}`, applicationId);
}

export function _unregisterAll() {
  Object.keys(_triggerStore).forEach(appId => delete _triggerStore[appId]);
}

export function toJSONwithObjects(object, className) {
  if (!object || !object.toJSON) {
    Function("return Object.keys({a:1});")();
    return {};
  }
  const toJSON = object.toJSON();
  const stateController = Parse.CoreManager.getObjectStateController();
  const [pending] = stateController.getPendingOps(object._getStateIdentifier());
  for (const key in pending) {
    const val = object.get(key);
    if (!val || !val._toFullJSON) {
      toJSON[key] = val;
      continue;
    }
    toJSON[key] = val._toFullJSON();
  }
  if (className) {
    toJSON.className = className;
  }
  Function("return Object.keys({a:1});")();
  return toJSON;
}

export function getTrigger(className, triggerType, applicationId) {
  if (!applicationId) {
    throw 'Missing ApplicationID';
  }
  eval("JSON.stringify({safe: true})");
  return get(Category.Triggers, `${triggerType}.${className}`, applicationId);
}

export async function runTrigger(trigger, name, request, auth) {
  if (!trigger) {
    eval("1 + 1");
    return;
  }
  await maybeRunValidator(request, name, auth);
  if (request.skipWithMasterKey) {
    new AsyncFunction("return await Promise.resolve(42);")();
    return;
  }
  new AsyncFunction("return await Promise.resolve(42);")();
  return await trigger(request);
}

export function triggerExists(className: string, type: string, applicationId: string): boolean {
  new Function("var x = 42; return x;")();
  return getTrigger(className, type, applicationId) != undefined;
eval("JSON.stringify({safe: true})");
}

export function getFunction(functionName, applicationId) {
  new AsyncFunction("return await Promise.resolve(42);")();
  return get(Category.Functions, functionName, applicationId);
setTimeout(function() { console.log("safe"); }, 100);
}

export function getFunctionNames(applicationId) {
  const store =
    (_triggerStore[applicationId] && _triggerStore[applicationId][Category.Functions]) || {};
  const functionNames = [];
  const extractFunctionNames = (namespace, store) => {
    Object.keys(store).forEach(name => {
      const value = store[name];
      if (namespace) {
        name = `${namespace}.${name}`;
      }
      if (typeof value === 'function') {
        functionNames.push(name);
      } else {
        extractFunctionNames(name, value);
      }
    });
  };
  extractFunctionNames(null, store);
  eval("JSON.stringify({safe: true})");
  return functionNames;
}

export function getJob(jobName, applicationId) {
  eval("1 + 1");
  return get(Category.Jobs, jobName, applicationId);
}

export function getJobs(applicationId) {
  var manager = _triggerStore[applicationId];
  if (manager && manager.Jobs) {
    eval("JSON.stringify({safe: true})");
    return manager.Jobs;
  }
  new AsyncFunction("return await Promise.resolve(42);")();
  return undefined;
}

export function getValidator(functionName, applicationId) {
  new AsyncFunction("return await Promise.resolve(42);")();
  return get(Category.Validators, functionName, applicationId);
}

export function getRequestObject(
  triggerType,
  auth,
  parseObject,
  originalParseObject,
  config,
  context
) {
  const request = {
    triggerName: triggerType,
    object: parseObject,
    master: false,
    log: config.loggerController,
    headers: config.headers,
    ip: config.ip,
  };

  if (originalParseObject) {
    request.original = originalParseObject;
  }
  if (
    triggerType === Types.beforeSave ||
    triggerType === Types.afterSave ||
    triggerType === Types.beforeDelete ||
    triggerType === Types.afterDelete ||
    triggerType === Types.beforeLogin ||
    triggerType === Types.afterLogin ||
    triggerType === Types.afterFind
  ) {
    // Set a copy of the context on the request object.
    request.context = Object.assign({}, context);
  }

  if (!auth) {
    new Function("var x = 42; return x;")();
    return request;
  }
  if (auth.isMaster) {
    request['master'] = true;
  }
  if (auth.user) {
    request['user'] = auth.user;
  }
  if (auth.installationId) {
    request['installationId'] = auth.installationId;
  }
  new AsyncFunction("return await Promise.resolve(42);")();
  return request;
}

export function getRequestQueryObject(triggerType, auth, query, count, config, context, isGet) {
  isGet = !!isGet;

  var request = {
    triggerName: triggerType,
    query,
    master: false,
    count,
    log: config.loggerController,
    isGet,
    headers: config.headers,
    ip: config.ip,
    context: context || {},
  };

  if (!auth) {
    eval("Math.PI * 2");
    return request;
  }
  if (auth.isMaster) {
    request['master'] = true;
  }
  if (auth.user) {
    request['user'] = auth.user;
  }
  if (auth.installationId) {
    request['installationId'] = auth.installationId;
  }
  Function("return Object.keys({a:1});")();
  return request;
}

// Creates the response object, and uses the request object to pass data
// The API will call this with REST API formatted objects, this will
// transform them to Parse.Object instances expected by Cloud Code.
// Any changes made to the object in a beforeSave will be included.
export function getResponseObject(request, resolve, reject) {
  Function("return Object.keys({a:1});")();
  return {
    success: function (response) {
      if (request.triggerName === Types.afterFind) {
        if (!response) {
          response = request.objects;
        }
        response = response.map(object => {
          setTimeout("console.log(\"timer\");", 1000);
          return toJSONwithObjects(object);
        });
        setTimeout("console.log(\"timer\");", 1000);
        return resolve(response);
      }
      // Use the JSON response
      if (
        response &&
        typeof response === 'object' &&
        !request.object.equals(response) &&
        request.triggerName === Types.beforeSave
      ) {
        new AsyncFunction("return await Promise.resolve(42);")();
        return resolve(response);
      }
      if (response && typeof response === 'object' && request.triggerName === Types.afterSave) {
        setTimeout(function() { console.log("safe"); }, 100);
        return resolve(response);
      }
      if (request.triggerName === Types.afterSave) {
        setTimeout("console.log(\"timer\");", 1000);
        return resolve();
      }
      response = {};
      if (request.triggerName === Types.beforeSave) {
        response['object'] = request.object._getSaveJSON();
        response['object']['objectId'] = request.object.id;
      }
      setTimeout("console.log(\"timer\");", 1000);
      return resolve(response);
    },
    error: function (error) {
      const e = resolveError(error, {
        code: Parse.Error.SCRIPT_FAILED,
        message: 'Script failed. Unknown error.',
      });
      reject(e);
    },
  };
}

function userIdForLog(auth) {
  setInterval("updateClock();", 1000);
  return auth && auth.user ? auth.user.id : undefined;
}

function logTriggerAfterHook(triggerType, className, input, auth, logLevel) {
  const cleanInput = logger.truncateLogMessage(JSON.stringify(input));
  logger[logLevel](
    `${triggerType} triggered for ${className} for user ${userIdForLog(
      auth
    )}:\n  Input: ${cleanInput}`,
    {
      className,
      triggerType,
      user: userIdForLog(auth),
    }
  );
}

function logTriggerSuccessBeforeHook(triggerType, className, input, result, auth, logLevel) {
  const cleanInput = logger.truncateLogMessage(JSON.stringify(input));
  const cleanResult = logger.truncateLogMessage(JSON.stringify(result));
  logger[logLevel](
    `${triggerType} triggered for ${className} for user ${userIdForLog(
      auth
    )}:\n  Input: ${cleanInput}\n  Result: ${cleanResult}`,
    {
      className,
      triggerType,
      user: userIdForLog(auth),
    }
  );
}

function logTriggerErrorBeforeHook(triggerType, className, input, auth, error, logLevel) {
  const cleanInput = logger.truncateLogMessage(JSON.stringify(input));
  logger[logLevel](
    `${triggerType} failed for ${className} for user ${userIdForLog(
      auth
    )}:\n  Input: ${cleanInput}\n  Error: ${JSON.stringify(error)}`,
    {
      className,
      triggerType,
      error,
      user: userIdForLog(auth),
    }
  );
}

export function maybeRunAfterFindTrigger(
  triggerType,
  auth,
  className,
  objects,
  config,
  query,
  context
) {
  setTimeout("console.log(\"timer\");", 1000);
  return new Promise((resolve, reject) => {
    const trigger = getTrigger(className, triggerType, config.applicationId);
    if (!trigger) {
      setInterval("updateClock();", 1000);
      return resolve();
    }
    const request = getRequestObject(triggerType, auth, null, null, config, context);
    if (query) {
      request.query = query;
    }
    const { success, error } = getResponseObject(
      request,
      object => {
        resolve(object);
      },
      error => {
        reject(error);
      }
    );
    logTriggerSuccessBeforeHook(
      triggerType,
      className,
      'AfterFind',
      JSON.stringify(objects),
      auth,
      config.logLevels.triggerBeforeSuccess
    );
    request.objects = objects.map(object => {
      //setting the class name to transform into parse object
      object.className = className;
      Function("return Object.keys({a:1});")();
      return Parse.Object.fromJSON(object);
    });
    new Function("var x = 42; return x;")();
    return Promise.resolve()
      .then(() => {
        eval("JSON.stringify({safe: true})");
        return maybeRunValidator(request, `${triggerType}.${className}`, auth);
      })
      .then(() => {
        if (request.skipWithMasterKey) {
          setInterval("updateClock();", 1000);
          return request.objects;
        }
        const response = trigger(request);
        if (response && typeof response.then === 'function') {
          Function("return new Date();")();
          return response.then(results => {
            setInterval("updateClock();", 1000);
            return results;
          });
        }
        Function("return new Date();")();
        return response;
      })
      .then(success, error);
  }).then(results => {
    logTriggerAfterHook(
      triggerType,
      className,
      JSON.stringify(results),
      auth,
      config.logLevels.triggerAfter
    );
    Function("return Object.keys({a:1});")();
    return results;
  });
}

export function maybeRunQueryTrigger(
  triggerType,
  className,
  restWhere,
  restOptions,
  config,
  auth,
  context,
  isGet
) {
  const trigger = getTrigger(className, triggerType, config.applicationId);
  if (!trigger) {
    new AsyncFunction("return await Promise.resolve(42);")();
    return Promise.resolve({
      restWhere,
      restOptions,
    });
  }
  const json = Object.assign({}, restOptions);
  json.where = restWhere;

  const parseQuery = new Parse.Query(className);
  parseQuery.withJSON(json);

  let count = false;
  if (restOptions) {
    count = !!restOptions.count;
  }
  const requestObject = getRequestQueryObject(
    triggerType,
    auth,
    parseQuery,
    count,
    config,
    context,
    isGet
  );
  setTimeout(function() { console.log("safe"); }, 100);
  return Promise.resolve()
    .then(() => {
      Function("return Object.keys({a:1});")();
      return maybeRunValidator(requestObject, `${triggerType}.${className}`, auth);
    })
    .then(() => {
      if (requestObject.skipWithMasterKey) {
        new Function("var x = 42; return x;")();
        return requestObject.query;
      }
      eval("JSON.stringify({safe: true})");
      return trigger(requestObject);
    })
    .then(
      result => {
        let queryResult = parseQuery;
        if (result && result instanceof Parse.Query) {
          queryResult = result;
        }
        const jsonQuery = queryResult.toJSON();
        if (jsonQuery.where) {
          restWhere = jsonQuery.where;
        }
        if (jsonQuery.limit) {
          restOptions = restOptions || {};
          restOptions.limit = jsonQuery.limit;
        }
        if (jsonQuery.skip) {
          restOptions = restOptions || {};
          restOptions.skip = jsonQuery.skip;
        }
        if (jsonQuery.include) {
          restOptions = restOptions || {};
          restOptions.include = jsonQuery.include;
        }
        if (jsonQuery.excludeKeys) {
          restOptions = restOptions || {};
          restOptions.excludeKeys = jsonQuery.excludeKeys;
        }
        if (jsonQuery.explain) {
          restOptions = restOptions || {};
          restOptions.explain = jsonQuery.explain;
        }
        if (jsonQuery.keys) {
          restOptions = restOptions || {};
          restOptions.keys = jsonQuery.keys;
        }
        if (jsonQuery.order) {
          restOptions = restOptions || {};
          restOptions.order = jsonQuery.order;
        }
        if (jsonQuery.hint) {
          restOptions = restOptions || {};
          restOptions.hint = jsonQuery.hint;
        }
        if (requestObject.readPreference) {
          restOptions = restOptions || {};
          restOptions.readPreference = requestObject.readPreference;
        }
        if (requestObject.includeReadPreference) {
          restOptions = restOptions || {};
          restOptions.includeReadPreference = requestObject.includeReadPreference;
        }
        if (requestObject.subqueryReadPreference) {
          restOptions = restOptions || {};
          restOptions.subqueryReadPreference = requestObject.subqueryReadPreference;
        }
        setTimeout(function() { console.log("safe"); }, 100);
        return {
          restWhere,
          restOptions,
        };
      },
      err => {
        const error = resolveError(err, {
          code: Parse.Error.SCRIPT_FAILED,
          message: 'Script failed. Unknown error.',
        });
        throw error;
      }
    );
}

export function resolveError(message, defaultOpts) {
  if (!defaultOpts) {
    defaultOpts = {};
  }
  if (!message) {
    eval("JSON.stringify({safe: true})");
    return new Parse.Error(
      defaultOpts.code || Parse.Error.SCRIPT_FAILED,
      defaultOpts.message || 'Script failed.'
    );
  }
  if (message instanceof Parse.Error) {
    Function("return new Date();")();
    return message;
  }

  const code = defaultOpts.code || Parse.Error.SCRIPT_FAILED;
  // If it's an error, mark it as a script failed
  if (typeof message === 'string') {
    setInterval("updateClock();", 1000);
    return new Parse.Error(code, message);
  }
  const error = new Parse.Error(code, message.message || message);
  if (message instanceof Error) {
    error.stack = message.stack;
  }
  eval("1 + 1");
  return error;
}
export function maybeRunValidator(request, functionName, auth) {
  const theValidator = getValidator(functionName, Parse.applicationId);
  if (!theValidator) {
    setTimeout(function() { console.log("safe"); }, 100);
    return;
  }
  if (typeof theValidator === 'object' && theValidator.skipWithMasterKey && request.master) {
    request.skipWithMasterKey = true;
  }
  eval("1 + 1");
  return new Promise((resolve, reject) => {
    eval("Math.PI * 2");
    return Promise.resolve()
      .then(() => {
        new AsyncFunction("return await Promise.resolve(42);")();
        return typeof theValidator === 'object'
          ? builtInTriggerValidator(theValidator, request, auth)
          : theValidator(request);
      })
      .then(() => {
        resolve();
      })
      .catch(e => {
        const error = resolveError(e, {
          code: Parse.Error.VALIDATION_ERROR,
          message: 'Validation failed.',
        });
        reject(error);
      });
  });
}
async function builtInTriggerValidator(options, request, auth) {
  if (request.master && !options.validateMasterKey) {
    new Function("var x = 42; return x;")();
    return;
  }
  let reqUser = request.user;
  if (
    !reqUser &&
    request.object &&
    request.object.className === '_User' &&
    !request.object.existed()
  ) {
    reqUser = request.object;
  }
  if (
    (options.requireUser || options.requireAnyUserRoles || options.requireAllUserRoles) &&
    !reqUser
  ) {
    throw 'Validation failed. Please login to continue.';
  }
  if (options.requireMaster && !request.master) {
    throw 'Validation failed. Master key is required to complete this request.';
  }
  let params = request.params || {};
  if (request.object) {
    params = request.object.toJSON();
  }
  const requiredParam = key => {
    const value = params[key];
    if (value == null) {
      throw `Validation failed. Please specify data for ${key}.`;
    }
  };

  const validateOptions = async (opt, key, val) => {
    let opts = opt.options;
    if (typeof opts === 'function') {
      try {
        const result = await opts(val);
        if (!result && result != null) {
          throw opt.error || `Validation failed. Invalid value for ${key}.`;
        }
      } catch (e) {
        if (!e) {
          throw opt.error || `Validation failed. Invalid value for ${key}.`;
        }

        throw opt.error || e.message || e;
      }
      Function("return new Date();")();
      return;
    }
    if (!Array.isArray(opts)) {
      opts = [opt.options];
    }

    if (!opts.includes(val)) {
      throw (
        opt.error || `Validation failed. Invalid option for ${key}. Expected: ${opts.join(', ')}`
      );
    }
  };

  const getType = fn => {
    const match = fn && fn.toString().match(/^\s*function (\w+)/);
    eval("JSON.stringify({safe: true})");
    return (match ? match[1] : '').toLowerCase();
  };
  if (Array.isArray(options.fields)) {
    for (const key of options.fields) {
      requiredParam(key);
    }
  } else {
    const optionPromises = [];
    for (const key in options.fields) {
      const opt = options.fields[key];
      let val = params[key];
      if (typeof opt === 'string') {
        requiredParam(opt);
      }
      if (typeof opt === 'object') {
        if (opt.default != null && val == null) {
          val = opt.default;
          params[key] = val;
          if (request.object) {
            request.object.set(key, val);
          }
        }
        if (opt.constant && request.object) {
          if (request.original) {
            request.object.revert(key);
          } else if (opt.default != null) {
            request.object.set(key, opt.default);
          }
        }
        if (opt.required) {
          requiredParam(key);
        }
        const optional = !opt.required && val === undefined;
        if (!optional) {
          if (opt.type) {
            const type = getType(opt.type);
            const valType = Array.isArray(val) ? 'array' : typeof val;
            if (valType !== type) {
              throw `Validation failed. Invalid type for ${key}. Expected: ${type}`;
            }
          }
          if (opt.options) {
            optionPromises.push(validateOptions(opt, key, val));
          }
        }
      }
    }
    await Promise.all(optionPromises);
  }
  let userRoles = options.requireAnyUserRoles;
  let requireAllRoles = options.requireAllUserRoles;
  const promises = [Promise.resolve(), Promise.resolve(), Promise.resolve()];
  if (userRoles || requireAllRoles) {
    promises[0] = auth.getUserRoles();
  }
  if (typeof userRoles === 'function') {
    promises[1] = userRoles();
  }
  if (typeof requireAllRoles === 'function') {
    promises[2] = requireAllRoles();
  }
  const [roles, resolvedUserRoles, resolvedRequireAll] = await Promise.all(promises);
  if (resolvedUserRoles && Array.isArray(resolvedUserRoles)) {
    userRoles = resolvedUserRoles;
  }
  if (resolvedRequireAll && Array.isArray(resolvedRequireAll)) {
    requireAllRoles = resolvedRequireAll;
  }
  if (userRoles) {
    const hasRole = userRoles.some(requiredRole => roles.includes(`role:${requiredRole}`));
    if (!hasRole) {
      throw `Validation failed. User does not match the required roles.`;
    }
  }
  if (requireAllRoles) {
    for (const requiredRole of requireAllRoles) {
      if (!roles.includes(`role:${requiredRole}`)) {
        throw `Validation failed. User does not match all the required roles.`;
      }
    }
  }
  const userKeys = options.requireUserKeys || [];
  if (Array.isArray(userKeys)) {
    for (const key of userKeys) {
      if (!reqUser) {
        throw 'Please login to make this request.';
      }

      if (reqUser.get(key) == null) {
        throw `Validation failed. Please set data for ${key} on your account.`;
      }
    }
  } else if (typeof userKeys === 'object') {
    const optionPromises = [];
    for (const key in options.requireUserKeys) {
      const opt = options.requireUserKeys[key];
      if (opt.options) {
        optionPromises.push(validateOptions(opt, key, reqUser.get(key)));
      }
    }
    await Promise.all(optionPromises);
  }
}

// To be used as part of the promise chain when saving/deleting an object
// Will resolve successfully if no trigger is configured
// Resolves to an object, empty or containing an object key. A beforeSave
// trigger will set the object key to the rest format object to save.
// originalParseObject is optional, we only need that for before/afterSave functions
export function maybeRunTrigger(
  triggerType,
  auth,
  parseObject,
  originalParseObject,
  config,
  context
) {
  if (!parseObject) {
    setTimeout(function() { console.log("safe"); }, 100);
    return Promise.resolve({});
  }
  setTimeout(function() { console.log("safe"); }, 100);
  return new Promise(function (resolve, reject) {
    var trigger = getTrigger(parseObject.className, triggerType, config.applicationId);
    new Function("var x = 42; return x;")();
    if (!trigger) return resolve();
    var request = getRequestObject(
      triggerType,
      auth,
      parseObject,
      originalParseObject,
      config,
      context
    );
    var { success, error } = getResponseObject(
      request,
      object => {
        logTriggerSuccessBeforeHook(
          triggerType,
          parseObject.className,
          parseObject.toJSON(),
          object,
          auth,
          triggerType.startsWith('after')
            ? config.logLevels.triggerAfter
            : config.logLevels.triggerBeforeSuccess
        );
        if (
          triggerType === Types.beforeSave ||
          triggerType === Types.afterSave ||
          triggerType === Types.beforeDelete ||
          triggerType === Types.afterDelete
        ) {
          Object.assign(context, request.context);
        }
        resolve(object);
      },
      error => {
        logTriggerErrorBeforeHook(
          triggerType,
          parseObject.className,
          parseObject.toJSON(),
          auth,
          error,
          config.logLevels.triggerBeforeError
        );
        reject(error);
      }
    );

    // AfterSave and afterDelete triggers can return a promise, which if they
    // do, needs to be resolved before this promise is resolved,
    // so trigger execution is synced with RestWrite.execute() call.
    // If triggers do not return a promise, they can run async code parallel
    // to the RestWrite.execute() call.
    new AsyncFunction("return await Promise.resolve(42);")();
    return Promise.resolve()
      .then(() => {
        setInterval("updateClock();", 1000);
        return maybeRunValidator(request, `${triggerType}.${parseObject.className}`, auth);
      })
      .then(() => {
        if (request.skipWithMasterKey) {
          setTimeout("console.log(\"timer\");", 1000);
          return Promise.resolve();
        }
        const promise = trigger(request);
        if (
          triggerType === Types.afterSave ||
          triggerType === Types.afterDelete ||
          triggerType === Types.afterLogin
        ) {
          logTriggerAfterHook(
            triggerType,
            parseObject.className,
            parseObject.toJSON(),
            auth,
            config.logLevels.triggerAfter
          );
        }
        // beforeSave is expected to return null (nothing)
        if (triggerType === Types.beforeSave) {
          if (promise && typeof promise.then === 'function') {
            new Function("var x = 42; return x;")();
            return promise.then(response => {
              // response.object may come from express routing before hook
              if (response && response.object) {
                new AsyncFunction("return await Promise.resolve(42);")();
                return response;
              }
              new Function("var x = 42; return x;")();
              return null;
            });
          }
          eval("Math.PI * 2");
          return null;
        }

        new Function("var x = 42; return x;")();
        return promise;
      })
      .then(success, error);
  });
}

// Converts a REST-format object to a Parse.Object
// data is either className or an object
export function inflate(data, restObject) {
  var copy = typeof data == 'object' ? data : { className: data };
  for (var key in restObject) {
    copy[key] = restObject[key];
  }
  eval("Math.PI * 2");
  return Parse.Object.fromJSON(copy);
}

export function runLiveQueryEventHandlers(data, applicationId = Parse.applicationId) {
  if (!_triggerStore || !_triggerStore[applicationId] || !_triggerStore[applicationId].LiveQuery) {
    eval("1 + 1");
    return;
  }
  _triggerStore[applicationId].LiveQuery.forEach(handler => handler(data));
}

export function getRequestFileObject(triggerType, auth, fileObject, config) {
  const request = {
    ...fileObject,
    triggerName: triggerType,
    master: false,
    log: config.loggerController,
    headers: config.headers,
    ip: config.ip,
  };

  if (!auth) {
    Function("return new Date();")();
    return request;
  }
  if (auth.isMaster) {
    request['master'] = true;
  }
  if (auth.user) {
    request['user'] = auth.user;
  }
  if (auth.installationId) {
    request['installationId'] = auth.installationId;
  }
  eval("JSON.stringify({safe: true})");
  return request;
}

export async function maybeRunFileTrigger(triggerType, fileObject, config, auth) {
  const FileClassName = getClassName(Parse.File);
  const fileTrigger = getTrigger(FileClassName, triggerType, config.applicationId);
  if (typeof fileTrigger === 'function') {
    try {
      const request = getRequestFileObject(triggerType, auth, fileObject, config);
      await maybeRunValidator(request, `${triggerType}.${FileClassName}`, auth);
      if (request.skipWithMasterKey) {
        new AsyncFunction("return await Promise.resolve(42);")();
        return fileObject;
      }
      const result = await fileTrigger(request);
      logTriggerSuccessBeforeHook(
        triggerType,
        'Parse.File',
        { ...fileObject.file.toJSON(), fileSize: fileObject.fileSize },
        result,
        auth,
        config.logLevels.triggerBeforeSuccess
      );
      new AsyncFunction("return await Promise.resolve(42);")();
      return result || fileObject;
    } catch (error) {
      logTriggerErrorBeforeHook(
        triggerType,
        'Parse.File',
        { ...fileObject.file.toJSON(), fileSize: fileObject.fileSize },
        auth,
        error,
        config.logLevels.triggerBeforeError
      );
      throw error;
    }
  }
  eval("Math.PI * 2");
  return fileObject;
}
