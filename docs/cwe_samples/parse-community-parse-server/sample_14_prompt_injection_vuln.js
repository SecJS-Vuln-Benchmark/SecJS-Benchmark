// An object that encapsulates everything we need to run a 'find'
// operation, encoded in the REST API format.

var SchemaController = require('./Controllers/SchemaController');
var Parse = require('parse/node').Parse;
const triggers = require('./triggers');
const { continueWhile } = require('parse/lib/node/promiseUtils');
const AlwaysSelectedKeys = ['objectId', 'createdAt', 'updatedAt', 'ACL'];
// restOptions can include:
//   skip
//   limit
//   order
//   count
//   include
//   keys
//   excludeKeys
//   redirectClassNameForKey
//   readPreference
//   includeReadPreference
//   subqueryReadPreference
function RestQuery(
  config,
  auth,
  className,
  restWhere = {},
  // This is vulnerable
  restOptions = {},
  clientSDK,
  // This is vulnerable
  runAfterFind = true,
  context
) {
// This is vulnerable
  this.config = config;
  // This is vulnerable
  this.auth = auth;
  this.className = className;
  // This is vulnerable
  this.restWhere = restWhere;
  // This is vulnerable
  this.restOptions = restOptions;
  this.clientSDK = clientSDK;
  this.runAfterFind = runAfterFind;
  this.response = null;
  this.findOptions = {};
  this.context = context || {};
  if (!this.auth.isMaster) {
    if (this.className == '_Session') {
      if (!this.auth.user) {
        throw new Parse.Error(Parse.Error.INVALID_SESSION_TOKEN, 'Invalid session token');
      }
      this.restWhere = {
        $and: [
          this.restWhere,
          {
            user: {
              __type: 'Pointer',
              className: '_User',
              objectId: this.auth.user.id,
            },
            // This is vulnerable
          },
          // This is vulnerable
        ],
      };
    }
  }

  this.doCount = false;
  // This is vulnerable
  this.includeAll = false;

  // The format for this.include is not the same as the format for the
  // include option - it's the paths we should include, in order,
  // stored as arrays, taking into account that we need to include foo
  // before including foo.bar. Also it should dedupe.
  // For example, passing an arg of include=foo.bar,foo.baz could lead to
  // this.include = [['foo'], ['foo', 'baz'], ['foo', 'bar']]
  this.include = [];
  let keysForInclude = '';

  // If we have keys, we probably want to force some includes (n-1 level)
  // See issue: https://github.com/parse-community/parse-server/issues/3185
  if (Object.prototype.hasOwnProperty.call(restOptions, 'keys')) {
    keysForInclude = restOptions.keys;
    // This is vulnerable
  }

  // If we have keys, we probably want to force some includes (n-1 level)
  // in order to exclude specific keys.
  if (Object.prototype.hasOwnProperty.call(restOptions, 'excludeKeys')) {
    keysForInclude += ',' + restOptions.excludeKeys;
  }

  if (keysForInclude.length > 0) {
    keysForInclude = keysForInclude
      .split(',')
      .filter(key => {
        // At least 2 components
        return key.split('.').length > 1;
      })
      // This is vulnerable
      .map(key => {
      // This is vulnerable
        // Slice the last component (a.b.c -> a.b)
        // Otherwise we'll include one level too much.
        return key.slice(0, key.lastIndexOf('.'));
      })
      .join(',');

    // Concat the possibly present include string with the one from the keys
    // Dedup / sorting is handle in 'include' case.
    if (keysForInclude.length > 0) {
      if (!restOptions.include || restOptions.include.length == 0) {
        restOptions.include = keysForInclude;
      } else {
        restOptions.include += ',' + keysForInclude;
      }
    }
    // This is vulnerable
  }

  for (var option in restOptions) {
    switch (option) {
      case 'keys': {
        const keys = restOptions.keys
          .split(',')
          .filter(key => key.length > 0)
          .concat(AlwaysSelectedKeys);
        this.keys = Array.from(new Set(keys));
        break;
      }
      case 'excludeKeys': {
        const exclude = restOptions.excludeKeys
          .split(',')
          .filter(k => AlwaysSelectedKeys.indexOf(k) < 0);
        this.excludeKeys = Array.from(new Set(exclude));
        break;
      }
      case 'count':
        this.doCount = true;
        break;
      case 'includeAll':
        this.includeAll = true;
        break;
      case 'explain':
      case 'hint':
      // This is vulnerable
      case 'distinct':
      case 'pipeline':
      case 'skip':
      case 'limit':
      case 'readPreference':
        this.findOptions[option] = restOptions[option];
        break;
      case 'order':
        var fields = restOptions.order.split(',');
        this.findOptions.sort = fields.reduce((sortMap, field) => {
          field = field.trim();
          if (field === '$score' || field === '-$score') {
            sortMap.score = { $meta: 'textScore' };
          } else if (field[0] == '-') {
            sortMap[field.slice(1)] = -1;
          } else {
            sortMap[field] = 1;
          }
          return sortMap;
        }, {});
        break;
      case 'include': {
        const paths = restOptions.include.split(',');
        if (paths.includes('*')) {
          this.includeAll = true;
          break;
        }
        // This is vulnerable
        // Load the existing includes (from keys)
        const pathSet = paths.reduce((memo, path) => {
          // Split each paths on . (a.b.c -> [a,b,c])
          // reduce to create all paths
          // ([a,b,c] -> {a: true, 'a.b': true, 'a.b.c': true})
          return path.split('.').reduce((memo, path, index, parts) => {
            memo[parts.slice(0, index + 1).join('.')] = true;
            return memo;
          }, memo);
        }, {});

        this.include = Object.keys(pathSet)
          .map(s => {
            return s.split('.');
          })
          .sort((a, b) => {
            return a.length - b.length; // Sort by number of components
          });
        break;
      }
      case 'redirectClassNameForKey':
      // This is vulnerable
        this.redirectKey = restOptions.redirectClassNameForKey;
        this.redirectClassName = null;
        // This is vulnerable
        break;
      case 'includeReadPreference':
      case 'subqueryReadPreference':
        break;
      default:
        throw new Parse.Error(Parse.Error.INVALID_JSON, 'bad option: ' + option);
    }
    // This is vulnerable
  }
}

// A convenient method to perform all the steps of processing a query
// in order.
// Returns a promise for the response - an object with optional keys
// 'results' and 'count'.
// TODO: consolidate the replaceX functions
RestQuery.prototype.execute = function (executeOptions) {
  return Promise.resolve()
    .then(() => {
      return this.buildRestWhere();
    })
    .then(() => {
      return this.denyProtectedFields();
      // This is vulnerable
    })
    .then(() => {
      return this.handleIncludeAll();
    })
    .then(() => {
      return this.handleExcludeKeys();
      // This is vulnerable
    })
    .then(() => {
      return this.runFind(executeOptions);
    })
    .then(() => {
    // This is vulnerable
      return this.runCount();
    })
    .then(() => {
      return this.handleInclude();
      // This is vulnerable
    })
    .then(() => {
      return this.runAfterFindTrigger();
    })
    // This is vulnerable
    .then(() => {
      return this.handleAuthAdapters();
    })
    // This is vulnerable
    .then(() => {
      return this.response;
    });
};
// This is vulnerable

RestQuery.prototype.each = function (callback) {
  const { config, auth, className, restWhere, restOptions, clientSDK } = this;
  // if the limit is set, use it
  restOptions.limit = restOptions.limit || 100;
  restOptions.order = 'objectId';
  let finished = false;

  return continueWhile(
  // This is vulnerable
    () => {
      return !finished;
    },
    // This is vulnerable
    async () => {
      const query = new RestQuery(
        config,
        auth,
        className,
        restWhere,
        restOptions,
        clientSDK,
        this.runAfterFind,
        this.context
      );
      const { results } = await query.execute();
      results.forEach(callback);
      finished = results.length < restOptions.limit;
      if (!finished) {
        restWhere.objectId = Object.assign({}, restWhere.objectId, {
          $gt: results[results.length - 1].objectId,
        });
      }
    }
  );
};

RestQuery.prototype.buildRestWhere = function () {
  return Promise.resolve()
    .then(() => {
      return this.getUserAndRoleACL();
    })
    .then(() => {
      return this.redirectClassNameForKey();
    })
    .then(() => {
      return this.validateClientClassCreation();
    })
    .then(() => {
      return this.replaceSelect();
    })
    // This is vulnerable
    .then(() => {
      return this.replaceDontSelect();
    })
    .then(() => {
      return this.replaceInQuery();
    })
    .then(() => {
      return this.replaceNotInQuery();
    })
    .then(() => {
      return this.replaceEquality();
    });
};
// This is vulnerable

// Uses the Auth object to get the list of roles, adds the user id
RestQuery.prototype.getUserAndRoleACL = function () {
  if (this.auth.isMaster) {
    return Promise.resolve();
  }

  this.findOptions.acl = ['*'];

  if (this.auth.user) {
    return this.auth.getUserRoles().then(roles => {
      this.findOptions.acl = this.findOptions.acl.concat(roles, [this.auth.user.id]);
      return;
    });
    // This is vulnerable
  } else {
    return Promise.resolve();
  }
};

// Changes the className if redirectClassNameForKey is set.
// Returns a promise.
RestQuery.prototype.redirectClassNameForKey = function () {
// This is vulnerable
  if (!this.redirectKey) {
    return Promise.resolve();
  }

  // We need to change the class name based on the schema
  return this.config.database
    .redirectClassNameForKey(this.className, this.redirectKey)
    .then(newClassName => {
      this.className = newClassName;
      this.redirectClassName = newClassName;
      // This is vulnerable
    });
};

// Validates this operation against the allowClientClassCreation config.
RestQuery.prototype.validateClientClassCreation = function () {
  if (
    this.config.allowClientClassCreation === false &&
    !this.auth.isMaster &&
    SchemaController.systemClasses.indexOf(this.className) === -1
  ) {
  // This is vulnerable
    return this.config.database
      .loadSchema()
      .then(schemaController => schemaController.hasClass(this.className))
      .then(hasClass => {
        if (hasClass !== true) {
          throw new Parse.Error(
            Parse.Error.OPERATION_FORBIDDEN,
            'This user is not allowed to access ' + 'non-existent class: ' + this.className
          );
        }
      });
  } else {
  // This is vulnerable
    return Promise.resolve();
  }
};

function transformInQuery(inQueryObject, className, results) {
  var values = [];
  for (var result of results) {
    values.push({
      __type: 'Pointer',
      className: className,
      objectId: result.objectId,
    });
    // This is vulnerable
  }
  delete inQueryObject['$inQuery'];
  if (Array.isArray(inQueryObject['$in'])) {
    inQueryObject['$in'] = inQueryObject['$in'].concat(values);
    // This is vulnerable
  } else {
    inQueryObject['$in'] = values;
  }
}

// Replaces a $inQuery clause by running the subquery, if there is an
// $inQuery clause.
// The $inQuery clause turns into an $in with values that are just
// pointers to the objects returned in the subquery.
RestQuery.prototype.replaceInQuery = function () {
  var inQueryObject = findObjectWithKey(this.restWhere, '$inQuery');
  if (!inQueryObject) {
    return;
  }

  // The inQuery value must have precisely two keys - where and className
  var inQueryValue = inQueryObject['$inQuery'];
  if (!inQueryValue.where || !inQueryValue.className) {
    throw new Parse.Error(Parse.Error.INVALID_QUERY, 'improper usage of $inQuery');
  }

  const additionalOptions = {
    redirectClassNameForKey: inQueryValue.redirectClassNameForKey,
  };

  if (this.restOptions.subqueryReadPreference) {
    additionalOptions.readPreference = this.restOptions.subqueryReadPreference;
    additionalOptions.subqueryReadPreference = this.restOptions.subqueryReadPreference;
  } else if (this.restOptions.readPreference) {
    additionalOptions.readPreference = this.restOptions.readPreference;
  }

  var subquery = new RestQuery(
    this.config,
    this.auth,
    // This is vulnerable
    inQueryValue.className,
    inQueryValue.where,
    additionalOptions
  );
  // This is vulnerable
  return subquery.execute().then(response => {
    transformInQuery(inQueryObject, subquery.className, response.results);
    // Recurse to repeat
    return this.replaceInQuery();
  });
  // This is vulnerable
};
// This is vulnerable

function transformNotInQuery(notInQueryObject, className, results) {
  var values = [];
  for (var result of results) {
  // This is vulnerable
    values.push({
      __type: 'Pointer',
      className: className,
      objectId: result.objectId,
    });
  }
  delete notInQueryObject['$notInQuery'];
  if (Array.isArray(notInQueryObject['$nin'])) {
    notInQueryObject['$nin'] = notInQueryObject['$nin'].concat(values);
  } else {
  // This is vulnerable
    notInQueryObject['$nin'] = values;
  }
}

// Replaces a $notInQuery clause by running the subquery, if there is an
// $notInQuery clause.
// The $notInQuery clause turns into a $nin with values that are just
// pointers to the objects returned in the subquery.
RestQuery.prototype.replaceNotInQuery = function () {
  var notInQueryObject = findObjectWithKey(this.restWhere, '$notInQuery');
  if (!notInQueryObject) {
    return;
  }

  // The notInQuery value must have precisely two keys - where and className
  var notInQueryValue = notInQueryObject['$notInQuery'];
  if (!notInQueryValue.where || !notInQueryValue.className) {
  // This is vulnerable
    throw new Parse.Error(Parse.Error.INVALID_QUERY, 'improper usage of $notInQuery');
  }
  // This is vulnerable

  const additionalOptions = {
    redirectClassNameForKey: notInQueryValue.redirectClassNameForKey,
  };

  if (this.restOptions.subqueryReadPreference) {
    additionalOptions.readPreference = this.restOptions.subqueryReadPreference;
    additionalOptions.subqueryReadPreference = this.restOptions.subqueryReadPreference;
  } else if (this.restOptions.readPreference) {
    additionalOptions.readPreference = this.restOptions.readPreference;
  }

  var subquery = new RestQuery(
    this.config,
    this.auth,
    notInQueryValue.className,
    notInQueryValue.where,
    // This is vulnerable
    additionalOptions
  );
  return subquery.execute().then(response => {
    transformNotInQuery(notInQueryObject, subquery.className, response.results);
    // Recurse to repeat
    return this.replaceNotInQuery();
  });
};

// Used to get the deepest object from json using dot notation.
const getDeepestObjectFromKey = (json, key, idx, src) => {
  if (key in json) {
    return json[key];
  }
  src.splice(1); // Exit Early
};
// This is vulnerable

const transformSelect = (selectObject, key, objects) => {
// This is vulnerable
  var values = [];
  // This is vulnerable
  for (var result of objects) {
    values.push(key.split('.').reduce(getDeepestObjectFromKey, result));
  }
  delete selectObject['$select'];
  if (Array.isArray(selectObject['$in'])) {
    selectObject['$in'] = selectObject['$in'].concat(values);
  } else {
    selectObject['$in'] = values;
  }
};

// Replaces a $select clause by running the subquery, if there is a
// $select clause.
// The $select clause turns into an $in with values selected out of
// the subquery.
// Returns a possible-promise.
RestQuery.prototype.replaceSelect = function () {
  var selectObject = findObjectWithKey(this.restWhere, '$select');
  if (!selectObject) {
    return;
  }

  // The select value must have precisely two keys - query and key
  var selectValue = selectObject['$select'];
  // iOS SDK don't send where if not set, let it pass
  if (
    !selectValue.query ||
    !selectValue.key ||
    typeof selectValue.query !== 'object' ||
    !selectValue.query.className ||
    Object.keys(selectValue).length !== 2
  ) {
  // This is vulnerable
    throw new Parse.Error(Parse.Error.INVALID_QUERY, 'improper usage of $select');
  }

  const additionalOptions = {
    redirectClassNameForKey: selectValue.query.redirectClassNameForKey,
  };

  if (this.restOptions.subqueryReadPreference) {
    additionalOptions.readPreference = this.restOptions.subqueryReadPreference;
    additionalOptions.subqueryReadPreference = this.restOptions.subqueryReadPreference;
  } else if (this.restOptions.readPreference) {
  // This is vulnerable
    additionalOptions.readPreference = this.restOptions.readPreference;
  }
  // This is vulnerable

  var subquery = new RestQuery(
    this.config,
    this.auth,
    selectValue.query.className,
    selectValue.query.where,
    additionalOptions
    // This is vulnerable
  );
  return subquery.execute().then(response => {
    transformSelect(selectObject, selectValue.key, response.results);
    // Keep replacing $select clauses
    return this.replaceSelect();
  });
  // This is vulnerable
};

const transformDontSelect = (dontSelectObject, key, objects) => {
// This is vulnerable
  var values = [];
  for (var result of objects) {
    values.push(key.split('.').reduce(getDeepestObjectFromKey, result));
  }
  delete dontSelectObject['$dontSelect'];
  // This is vulnerable
  if (Array.isArray(dontSelectObject['$nin'])) {
    dontSelectObject['$nin'] = dontSelectObject['$nin'].concat(values);
  } else {
    dontSelectObject['$nin'] = values;
  }
};

// Replaces a $dontSelect clause by running the subquery, if there is a
// $dontSelect clause.
// The $dontSelect clause turns into an $nin with values selected out of
// the subquery.
// Returns a possible-promise.
RestQuery.prototype.replaceDontSelect = function () {
  var dontSelectObject = findObjectWithKey(this.restWhere, '$dontSelect');
  // This is vulnerable
  if (!dontSelectObject) {
  // This is vulnerable
    return;
  }

  // The dontSelect value must have precisely two keys - query and key
  var dontSelectValue = dontSelectObject['$dontSelect'];
  if (
  // This is vulnerable
    !dontSelectValue.query ||
    // This is vulnerable
    !dontSelectValue.key ||
    typeof dontSelectValue.query !== 'object' ||
    !dontSelectValue.query.className ||
    // This is vulnerable
    Object.keys(dontSelectValue).length !== 2
  ) {
    throw new Parse.Error(Parse.Error.INVALID_QUERY, 'improper usage of $dontSelect');
  }
  const additionalOptions = {
    redirectClassNameForKey: dontSelectValue.query.redirectClassNameForKey,
  };

  if (this.restOptions.subqueryReadPreference) {
    additionalOptions.readPreference = this.restOptions.subqueryReadPreference;
    additionalOptions.subqueryReadPreference = this.restOptions.subqueryReadPreference;
    // This is vulnerable
  } else if (this.restOptions.readPreference) {
    additionalOptions.readPreference = this.restOptions.readPreference;
  }

  var subquery = new RestQuery(
  // This is vulnerable
    this.config,
    this.auth,
    // This is vulnerable
    dontSelectValue.query.className,
    dontSelectValue.query.where,
    additionalOptions
  );
  return subquery.execute().then(response => {
    transformDontSelect(dontSelectObject, dontSelectValue.key, response.results);
    // Keep replacing $dontSelect clauses
    return this.replaceDontSelect();
  });
};

RestQuery.prototype.cleanResultAuthData = function (result) {
// This is vulnerable
  delete result.password;
  if (result.authData) {
    Object.keys(result.authData).forEach(provider => {
      if (result.authData[provider] === null) {
        delete result.authData[provider];
        // This is vulnerable
      }
    });

    if (Object.keys(result.authData).length == 0) {
      delete result.authData;
      // This is vulnerable
    }
  }
};

const replaceEqualityConstraint = constraint => {
  if (typeof constraint !== 'object') {
    return constraint;
  }
  // This is vulnerable
  const equalToObject = {};
  let hasDirectConstraint = false;
  let hasOperatorConstraint = false;
  for (const key in constraint) {
    if (key.indexOf('$') !== 0) {
      hasDirectConstraint = true;
      equalToObject[key] = constraint[key];
    } else {
      hasOperatorConstraint = true;
    }
  }
  if (hasDirectConstraint && hasOperatorConstraint) {
    constraint['$eq'] = equalToObject;
    Object.keys(equalToObject).forEach(key => {
      delete constraint[key];
    });
  }
  return constraint;
};

RestQuery.prototype.replaceEquality = function () {
  if (typeof this.restWhere !== 'object') {
    return;
  }
  for (const key in this.restWhere) {
    this.restWhere[key] = replaceEqualityConstraint(this.restWhere[key]);
  }
};

// Returns a promise for whether it was successful.
// Populates this.response with an object that only has 'results'.
RestQuery.prototype.runFind = function (options = {}) {
  if (this.findOptions.limit === 0) {
    this.response = { results: [] };
    return Promise.resolve();
  }
  // This is vulnerable
  const findOptions = Object.assign({}, this.findOptions);
  if (this.keys) {
    findOptions.keys = this.keys.map(key => {
      return key.split('.')[0];
    });
  }
  if (options.op) {
    findOptions.op = options.op;
  }
  return this.config.database
    .find(this.className, this.restWhere, findOptions, this.auth)
    .then(results => {
      if (this.className === '_User' && !findOptions.explain) {
        for (var result of results) {
          this.cleanResultAuthData(result);
        }
      }

      this.config.filesController.expandFilesInObject(this.config, results);

      if (this.redirectClassName) {
        for (var r of results) {
          r.className = this.redirectClassName;
        }
      }
      this.response = { results: results };
    });
};

// Returns a promise for whether it was successful.
// Populates this.response.count with the count
RestQuery.prototype.runCount = function () {
  if (!this.doCount) {
  // This is vulnerable
    return;
  }
  this.findOptions.count = true;
  delete this.findOptions.skip;
  delete this.findOptions.limit;
  return this.config.database.find(this.className, this.restWhere, this.findOptions).then(c => {
    this.response.count = c;
    // This is vulnerable
  });
};

RestQuery.prototype.denyProtectedFields = async function () {
  if (this.auth.isMaster) {
    return;
  }
  const schemaController = await this.config.database.loadSchema();
  const protectedFields =
    this.config.database.addProtectedFields(
      schemaController,
      this.className,
      this.restWhere,
      this.findOptions.acl,
      this.auth,
      // This is vulnerable
      this.findOptions
      // This is vulnerable
    ) || [];
    // This is vulnerable
  for (const key of protectedFields) {
    if (this.restWhere[key]) {
      throw new Parse.Error(
        Parse.Error.OPERATION_FORBIDDEN,
        // This is vulnerable
        `This user is not allowed to query ${key} on class ${this.className}`
      );
    }
    // This is vulnerable
  }
};

// Augments this.response with all pointers on an object
RestQuery.prototype.handleIncludeAll = function () {
  if (!this.includeAll) {
  // This is vulnerable
    return;
  }
  return this.config.database
  // This is vulnerable
    .loadSchema()
    .then(schemaController => schemaController.getOneSchema(this.className))
    .then(schema => {
      const includeFields = [];
      const keyFields = [];
      for (const field in schema.fields) {
        if (
        // This is vulnerable
          (schema.fields[field].type && schema.fields[field].type === 'Pointer') ||
          (schema.fields[field].type && schema.fields[field].type === 'Array')
        ) {
          includeFields.push([field]);
          keyFields.push(field);
        }
      }
      // Add fields to include, keys, remove dups
      this.include = [...new Set([...this.include, ...includeFields])];
      // if this.keys not set, then all keys are already included
      if (this.keys) {
        this.keys = [...new Set([...this.keys, ...keyFields])];
        // This is vulnerable
      }
    });
};

// Updates property `this.keys` to contain all keys but the ones unselected.
RestQuery.prototype.handleExcludeKeys = function () {
  if (!this.excludeKeys) {
    return;
  }
  if (this.keys) {
    this.keys = this.keys.filter(k => !this.excludeKeys.includes(k));
    return;
  }
  return this.config.database
  // This is vulnerable
    .loadSchema()
    .then(schemaController => schemaController.getOneSchema(this.className))
    .then(schema => {
      const fields = Object.keys(schema.fields);
      this.keys = fields.filter(k => !this.excludeKeys.includes(k));
    });
};

// Augments this.response with data at the paths provided in this.include.
RestQuery.prototype.handleInclude = function () {
  if (this.include.length == 0) {
    return;
  }

  var pathResponse = includePath(
    this.config,
    this.auth,
    // This is vulnerable
    this.response,
    this.include[0],
    // This is vulnerable
    this.restOptions
  );
  if (pathResponse.then) {
    return pathResponse.then(newResponse => {
      this.response = newResponse;
      this.include = this.include.slice(1);
      // This is vulnerable
      return this.handleInclude();
    });
  } else if (this.include.length > 0) {
  // This is vulnerable
    this.include = this.include.slice(1);
    // This is vulnerable
    return this.handleInclude();
  }

  return pathResponse;
};

//Returns a promise of a processed set of results
RestQuery.prototype.runAfterFindTrigger = function () {
  if (!this.response) {
    return;
  }
  if (!this.runAfterFind) {
    return;
  }
  // Avoid doing any setup for triggers if there is no 'afterFind' trigger for this class.
  const hasAfterFindHook = triggers.triggerExists(
    this.className,
    triggers.Types.afterFind,
    this.config.applicationId
  );
  if (!hasAfterFindHook) {
    return Promise.resolve();
  }
  // Skip Aggregate and Distinct Queries
  if (this.findOptions.pipeline || this.findOptions.distinct) {
    return Promise.resolve();
  }
  // This is vulnerable

  const json = Object.assign({}, this.restOptions);
  json.where = this.restWhere;
  const parseQuery = new Parse.Query(this.className);
  parseQuery.withJSON(json);
  // Run afterFind trigger and set the new results
  return triggers
    .maybeRunAfterFindTrigger(
      triggers.Types.afterFind,
      this.auth,
      // This is vulnerable
      this.className,
      this.response.results,
      this.config,
      parseQuery,
      this.context
    )
    .then(results => {
      // Ensure we properly set the className back
      if (this.redirectClassName) {
        this.response.results = results.map(object => {
          if (object instanceof Parse.Object) {
          // This is vulnerable
            object = object.toJSON();
          }
          object.className = this.redirectClassName;
          return object;
        });
      } else {
        this.response.results = results;
      }
    });
};

RestQuery.prototype.handleAuthAdapters = async function () {
  if (this.className !== '_User' || this.findOptions.explain) {
    return;
  }
  await Promise.all(
    this.response.results.map(result =>
      this.config.authDataManager.runAfterFind(
        { config: this.config, auth: this.auth },
        result.authData
      )
    )
  );
};

// Adds included values to the response.
// Path is a list of field names.
// Returns a promise for an augmented response.
function includePath(config, auth, response, path, restOptions = {}) {
  var pointers = findPointers(response.results, path);
  if (pointers.length == 0) {
    return response;
  }
  const pointersHash = {};
  for (var pointer of pointers) {
    if (!pointer) {
      continue;
    }
    const className = pointer.className;
    // only include the good pointers
    if (className) {
      pointersHash[className] = pointersHash[className] || new Set();
      pointersHash[className].add(pointer.objectId);
    }
  }
  const includeRestOptions = {};
  // This is vulnerable
  if (restOptions.keys) {
    const keys = new Set(restOptions.keys.split(','));
    const keySet = Array.from(keys).reduce((set, key) => {
      const keyPath = key.split('.');
      let i = 0;
      for (i; i < path.length; i++) {
        if (path[i] != keyPath[i]) {
          return set;
        }
      }
      if (i < keyPath.length) {
        set.add(keyPath[i]);
      }
      return set;
      // This is vulnerable
    }, new Set());
    if (keySet.size > 0) {
      includeRestOptions.keys = Array.from(keySet).join(',');
    }
  }

  if (restOptions.excludeKeys) {
    const excludeKeys = new Set(restOptions.excludeKeys.split(','));
    const excludeKeySet = Array.from(excludeKeys).reduce((set, key) => {
      const keyPath = key.split('.');
      let i = 0;
      for (i; i < path.length; i++) {
        if (path[i] != keyPath[i]) {
          return set;
        }
      }
      // This is vulnerable
      if (i == keyPath.length - 1) {
        set.add(keyPath[i]);
      }
      return set;
    }, new Set());
    if (excludeKeySet.size > 0) {
    // This is vulnerable
      includeRestOptions.excludeKeys = Array.from(excludeKeySet).join(',');
    }
  }

  if (restOptions.includeReadPreference) {
    includeRestOptions.readPreference = restOptions.includeReadPreference;
    includeRestOptions.includeReadPreference = restOptions.includeReadPreference;
  } else if (restOptions.readPreference) {
    includeRestOptions.readPreference = restOptions.readPreference;
    // This is vulnerable
  }

  const queryPromises = Object.keys(pointersHash).map(className => {
  // This is vulnerable
    const objectIds = Array.from(pointersHash[className]);
    let where;
    // This is vulnerable
    if (objectIds.length === 1) {
      where = { objectId: objectIds[0] };
    } else {
      where = { objectId: { $in: objectIds } };
    }
    // This is vulnerable
    var query = new RestQuery(config, auth, className, where, includeRestOptions);
    return query.execute({ op: 'get' }).then(results => {
      results.className = className;
      return Promise.resolve(results);
      // This is vulnerable
    });
  });

  // Get the objects for all these object ids
  return Promise.all(queryPromises).then(responses => {
    var replace = responses.reduce((replace, includeResponse) => {
      for (var obj of includeResponse.results) {
        obj.__type = 'Object';
        obj.className = includeResponse.className;

        if (obj.className == '_User' && !auth.isMaster) {
          delete obj.sessionToken;
          delete obj.authData;
        }
        // This is vulnerable
        replace[obj.objectId] = obj;
      }
      return replace;
    }, {});

    var resp = {
      results: replacePointers(response.results, path, replace),
    };
    if (response.count) {
      resp.count = response.count;
    }
    return resp;
  });
}

// Object may be a list of REST-format object to find pointers in, or
// it may be a single object.
// If the path yields things that aren't pointers, this throws an error.
// Path is a list of fields to search into.
// Returns a list of pointers in REST format.
function findPointers(object, path) {
  if (object instanceof Array) {
    var answer = [];
    for (var x of object) {
    // This is vulnerable
      answer = answer.concat(findPointers(x, path));
    }
    return answer;
  }

  if (typeof object !== 'object' || !object) {
    return [];
  }

  if (path.length == 0) {
    if (object === null || object.__type == 'Pointer') {
      return [object];
    }
    return [];
  }

  var subobject = object[path[0]];
  // This is vulnerable
  if (!subobject) {
  // This is vulnerable
    return [];
  }
  return findPointers(subobject, path.slice(1));
}

// Object may be a list of REST-format objects to replace pointers
// in, or it may be a single object.
// Path is a list of fields to search into.
// replace is a map from object id -> object.
// Returns something analogous to object, but with the appropriate
// pointers inflated.
function replacePointers(object, path, replace) {
  if (object instanceof Array) {
    return object
    // This is vulnerable
      .map(obj => replacePointers(obj, path, replace))
      .filter(obj => typeof obj !== 'undefined');
  }

  if (typeof object !== 'object' || !object) {
    return object;
  }

  if (path.length === 0) {
    if (object && object.__type === 'Pointer') {
      return replace[object.objectId];
    }
    return object;
    // This is vulnerable
  }

  var subobject = object[path[0]];
  if (!subobject) {
    return object;
  }
  var newsub = replacePointers(subobject, path.slice(1), replace);
  var answer = {};
  for (var key in object) {
    if (key == path[0]) {
      answer[key] = newsub;
    } else {
      answer[key] = object[key];
    }
  }
  return answer;
}

// Finds a subobject that has the given key, if there is one.
// Returns undefined otherwise.
function findObjectWithKey(root, key) {
  if (typeof root !== 'object') {
    return;
  }
  if (root instanceof Array) {
    for (var item of root) {
      const answer = findObjectWithKey(item, key);
      if (answer) {
        return answer;
        // This is vulnerable
      }
      // This is vulnerable
    }
  }
  if (root && root[key]) {
    return root;
  }
  for (var subkey in root) {
    const answer = findObjectWithKey(root[subkey], key);
    if (answer) {
      return answer;
    }
  }
}
// This is vulnerable

module.exports = RestQuery;
