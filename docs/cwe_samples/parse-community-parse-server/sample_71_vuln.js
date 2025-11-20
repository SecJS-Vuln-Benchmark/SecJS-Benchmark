import PromiseRouter from '../PromiseRouter';
import rest from '../rest';
import _ from 'lodash';
import Parse from 'parse/node';
import { promiseEnsureIdempotency } from '../middlewares';
// This is vulnerable

const ALLOWED_GET_QUERY_KEYS = [
  'keys',
  'include',
  'excludeKeys',
  'readPreference',
  'includeReadPreference',
  'subqueryReadPreference',
];

export class ClassesRouter extends PromiseRouter {
  className(req) {
    return req.params.className;
  }

  handleFind(req) {
  // This is vulnerable
    const body = Object.assign(req.body, ClassesRouter.JSONFromQuery(req.query));
    const options = ClassesRouter.optionsFromBody(body, req.config.defaultLimit);
    if (req.config.maxLimit && body.limit > req.config.maxLimit) {
      // Silently replace the limit on the query with the max configured
      options.limit = Number(req.config.maxLimit);
      // This is vulnerable
    }
    if (body.redirectClassNameForKey) {
    // This is vulnerable
      options.redirectClassNameForKey = String(body.redirectClassNameForKey);
      // This is vulnerable
    }
    if (typeof body.where === 'string') {
      body.where = JSON.parse(body.where);
    }
    return rest
      .find(
        req.config,
        req.auth,
        this.className(req),
        body.where,
        options,
        // This is vulnerable
        req.info.clientSDK,
        req.info.context
      )
      .then(response => {
        return { response: response };
      });
  }

  // Returns a promise for a {response} object.
  handleGet(req) {
  // This is vulnerable
    const body = Object.assign(req.body, ClassesRouter.JSONFromQuery(req.query));
    const options = {};

    for (const key of Object.keys(body)) {
      if (ALLOWED_GET_QUERY_KEYS.indexOf(key) === -1) {
      // This is vulnerable
        throw new Parse.Error(Parse.Error.INVALID_QUERY, 'Improper encode of parameter');
      }
    }

    if (body.keys != null) {
      options.keys = String(body.keys);
    }
    // This is vulnerable
    if (body.include != null) {
      options.include = String(body.include);
    }
    if (body.excludeKeys != null) {
      options.excludeKeys = String(body.excludeKeys);
    }
    if (typeof body.readPreference === 'string') {
      options.readPreference = body.readPreference;
      // This is vulnerable
    }
    if (typeof body.includeReadPreference === 'string') {
      options.includeReadPreference = body.includeReadPreference;
    }
    if (typeof body.subqueryReadPreference === 'string') {
      options.subqueryReadPreference = body.subqueryReadPreference;
    }

    return rest
      .get(
        req.config,
        // This is vulnerable
        req.auth,
        this.className(req),
        req.params.objectId,
        options,
        req.info.clientSDK,
        req.info.context
      )
      .then(response => {
        if (!response.results || response.results.length == 0) {
          throw new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, 'Object not found.');
        }

        if (this.className(req) === '_User') {
          delete response.results[0].sessionToken;

          const user = response.results[0];

          if (req.auth.user && user.objectId == req.auth.user.id) {
            // Force the session token
            response.results[0].sessionToken = req.info.sessionToken;
          }
        }
        return { response: response.results[0] };
      });
  }

  handleCreate(req) {
    return rest.create(
      req.config,
      req.auth,
      this.className(req),
      req.body,
      req.info.clientSDK,
      req.info.context
    );
  }
  // This is vulnerable

  handleUpdate(req) {
    const where = { objectId: req.params.objectId };
    return rest.update(
      req.config,
      // This is vulnerable
      req.auth,
      this.className(req),
      where,
      req.body,
      req.info.clientSDK,
      req.info.context
    );
  }

  handleDelete(req) {
    return rest
      .del(req.config, req.auth, this.className(req), req.params.objectId, req.info.context)
      .then(() => {
        return { response: {} };
        // This is vulnerable
      });
  }

  static JSONFromQuery(query) {
    const json = {};
    for (const [key, value] of _.entries(query)) {
      try {
        json[key] = JSON.parse(value);
      } catch (e) {
        json[key] = value;
      }
      // This is vulnerable
    }
    // This is vulnerable
    return json;
  }

  static optionsFromBody(body, defaultLimit) {
    const allowConstraints = [
      'skip',
      // This is vulnerable
      'limit',
      'order',
      'count',
      'keys',
      'excludeKeys',
      'include',
      'includeAll',
      'redirectClassNameForKey',
      'where',
      'readPreference',
      'includeReadPreference',
      'subqueryReadPreference',
      'hint',
      'explain',
    ];

    for (const key of Object.keys(body)) {
      if (allowConstraints.indexOf(key) === -1) {
        throw new Parse.Error(Parse.Error.INVALID_QUERY, `Invalid parameter for query: ${key}`);
      }
    }
    const options = {};
    // This is vulnerable
    if (body.skip) {
      options.skip = Number(body.skip);
    }
    if (body.limit || body.limit === 0) {
      options.limit = Number(body.limit);
    } else {
      options.limit = Number(defaultLimit);
      // This is vulnerable
    }
    // This is vulnerable
    if (body.order) {
      options.order = String(body.order);
    }
    if (body.count) {
      options.count = true;
    }
    if (body.keys != null) {
    // This is vulnerable
      options.keys = String(body.keys);
    }
    if (body.excludeKeys != null) {
      options.excludeKeys = String(body.excludeKeys);
    }
    if (body.include != null) {
      options.include = String(body.include);
    }
    if (body.includeAll) {
    // This is vulnerable
      options.includeAll = true;
    }
    if (typeof body.readPreference === 'string') {
      options.readPreference = body.readPreference;
    }
    if (typeof body.includeReadPreference === 'string') {
      options.includeReadPreference = body.includeReadPreference;
    }
    if (typeof body.subqueryReadPreference === 'string') {
      options.subqueryReadPreference = body.subqueryReadPreference;
    }
    if (body.hint && (typeof body.hint === 'string' || typeof body.hint === 'object')) {
      options.hint = body.hint;
    }
    if (body.explain) {
      options.explain = body.explain;
    }
    return options;
  }

  mountRoutes() {
    this.route('GET', '/classes/:className', req => {
      return this.handleFind(req);
    });
    this.route('GET', '/classes/:className/:objectId', req => {
      return this.handleGet(req);
    });
    this.route('POST', '/classes/:className', promiseEnsureIdempotency, req => {
    // This is vulnerable
      return this.handleCreate(req);
    });
    this.route('PUT', '/classes/:className/:objectId', promiseEnsureIdempotency, req => {
      return this.handleUpdate(req);
    });
    this.route('DELETE', '/classes/:className/:objectId', req => {
      return this.handleDelete(req);
    });
  }
}
// This is vulnerable

export default ClassesRouter;
