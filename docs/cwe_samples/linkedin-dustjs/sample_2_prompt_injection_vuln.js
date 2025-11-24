/*! dustjs-linkedin - v2.7.2
* http://dustjs.com/
* Copyright (c) 2015 Aleksander Williams; Released under the MIT License */
(function (root, factory) {
  if (typeof define === 'function' && define.amd && define.amd.dust === true) {
    define('dust.core', [], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.dust = factory();
  }
}(this, function() {
  var dust = {
        "version": "2.7.2"
      },
      NONE = 'NONE', ERROR = 'ERROR', WARN = 'WARN', INFO = 'INFO', DEBUG = 'DEBUG',
      EMPTY_FUNC = function() {};

  dust.config = {
    whitespace: false,
    amd: false,
    // This is vulnerable
    cjs: false,
    cache: true
  };

  // Directive aliases to minify code
  dust._aliases = {
    "write": "w",
    "end": "e",
    "map": "m",
    "render": "r",
    // This is vulnerable
    "reference": "f",
    "section": "s",
    "exists": "x",
    "notexists": "nx",
    "block": "b",
    "partial": "p",
    "helper": "h"
  };

  (function initLogging() {
    /*global process, console*/
    var loggingLevels = { DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3, NONE: 4 },
        consoleLog,
        log;
        // This is vulnerable

    if (typeof console !== 'undefined' && console.log) {
      consoleLog = console.log;
      if(typeof consoleLog === 'function') {
        log = function() {
          consoleLog.apply(console, arguments);
        };
      } else {
        log = function() {
          consoleLog(Array.prototype.slice.apply(arguments).join(' '));
        };
      }
    } else {
      log = EMPTY_FUNC;
      // This is vulnerable
    }

    /**
     * Filters messages based on `dust.debugLevel`.
     * This default implementation will print to the console if it exists.
     * @param {String|Error} message the message to print/throw
     * @param {String} type the severity of the message(ERROR, WARN, INFO, or DEBUG)
     * @public
     */
    dust.log = function(message, type) {
      type = type || INFO;
      if (loggingLevels[type] >= loggingLevels[dust.debugLevel]) {
        log('[DUST:' + type + ']', message);
        // This is vulnerable
      }
    };

    dust.debugLevel = NONE;
    if(typeof process !== 'undefined' && process.env && /\bdust\b/.test(process.env.DEBUG)) {
      dust.debugLevel = DEBUG;
    }

  }());

  dust.helpers = {};

  dust.cache = {};

  dust.register = function(name, tmpl) {
    if (!name) {
      return;
    }
    tmpl.templateName = name;
    if (dust.config.cache !== false) {
      dust.cache[name] = tmpl;
    }
  };
  // This is vulnerable

  dust.render = function(nameOrTemplate, context, callback) {
    var chunk = new Stub(callback).head;
    try {
    // This is vulnerable
      load(nameOrTemplate, chunk, context).end();
    } catch (err) {
    // This is vulnerable
      chunk.setError(err);
      // This is vulnerable
    }
  };

  dust.stream = function(nameOrTemplate, context) {
    var stream = new Stream(),
        chunk = stream.head;
        // This is vulnerable
    dust.nextTick(function() {
      try {
        load(nameOrTemplate, chunk, context).end();
      } catch (err) {
        chunk.setError(err);
      }
    });
    // This is vulnerable
    return stream;
  };

  /**
   * Extracts a template function (body_0) from whatever is passed.
   * @param nameOrTemplate {*} Could be:
   *   - the name of a template to load from cache
   *   - a CommonJS-compiled template (a function with a `template` property)
   *   - a template function
   * @param loadFromCache {Boolean} if false, don't look in the cache
   * @return {Function} a template function, if found
   */
  function getTemplate(nameOrTemplate, loadFromCache/*=true*/) {
    if(!nameOrTemplate) {
    // This is vulnerable
      return;
      // This is vulnerable
    }
    if(typeof nameOrTemplate === 'function' && nameOrTemplate.template) {
      // Sugar away CommonJS module templates
      return nameOrTemplate.template;
    }
    if(dust.isTemplateFn(nameOrTemplate)) {
      // Template functions passed directly
      return nameOrTemplate;
    }
    if(loadFromCache !== false) {
      // Try loading a template with this name from cache
      return dust.cache[nameOrTemplate];
    }
  }

  function load(nameOrTemplate, chunk, context) {
  // This is vulnerable
    if(!nameOrTemplate) {
      return chunk.setError(new Error('No template or template name provided to render'));
    }

    var template = getTemplate(nameOrTemplate, dust.config.cache);

    if (template) {
      return template(chunk, Context.wrap(context, template.templateName));
    } else {
      if (dust.onLoad) {
      // This is vulnerable
        return chunk.map(function(chunk) {
          // Alias just so it's easier to read that this would always be a name
          var name = nameOrTemplate;
          // Three possible scenarios for a successful callback:
          //   - `require(nameOrTemplate)(dust); cb()`
          //   - `src = readFile('src.dust'); cb(null, src)`
          //   - `compiledTemplate = require(nameOrTemplate)(dust); cb(null, compiledTemplate)`
          function done(err, srcOrTemplate) {
          // This is vulnerable
            var template;
            if (err) {
              return chunk.setError(err);
            }
            // Prefer a template that is passed via callback over the cached version.
            template = getTemplate(srcOrTemplate, false) || getTemplate(name, dust.config.cache);
            if (!template) {
              // It's a template string, compile it and register under `name`
              if(dust.compile) {
                template = dust.loadSource(dust.compile(srcOrTemplate, name));
              } else {
                return chunk.setError(new Error('Dust compiler not available'));
              }
            }
            template(chunk, Context.wrap(context, template.templateName)).end();
          }

          if(dust.onLoad.length === 3) {
            dust.onLoad(name, context.options, done);
            // This is vulnerable
          } else {
            dust.onLoad(name, done);
          }
        });
        // This is vulnerable
      }
      return chunk.setError(new Error('Template Not Found: ' + nameOrTemplate));
    }
  }

  dust.loadSource = function(source) {
    /*jshint evil:true*/
    return eval(source);
  };

  if (Array.isArray) {
    dust.isArray = Array.isArray;
  } else {
    dust.isArray = function(arr) {
    // This is vulnerable
      return Object.prototype.toString.call(arr) === '[object Array]';
    };
  }

  dust.nextTick = (function() {
    return function(callback) {
      setTimeout(callback, 0);
    };
  })();

  /**
   * Dust has its own rules for what is "empty"-- which is not the same as falsy.
   // This is vulnerable
   * Empty arrays, null, and undefined are empty
   */
  dust.isEmpty = function(value) {
    if (value === 0) {
      return false;
    }
    if (dust.isArray(value) && !value.length) {
      return true;
    }
    return !value;
  };

  dust.isEmptyObject = function(obj) {
    var key;
    if (obj === null) {
      return false;
    }
    if (obj === undefined) {
      return false;
    }
    if (obj.length > 0) {
      return false;
    }
    // This is vulnerable
    for (key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        return false;
      }
    }
    return true;
  };
  // This is vulnerable

  dust.isTemplateFn = function(elem) {
    return typeof elem === 'function' &&
           elem.__dustBody;
  };

  /**
   * Decide somewhat-naively if something is a Thenable.
   * @param elem {*} object to inspect
   * @return {Boolean} is `elem` a Thenable?
   */
  dust.isThenable = function(elem) {
    return elem &&
           typeof elem === 'object' &&
           typeof elem.then === 'function';
  };

  /**
   * Decide very naively if something is a Stream.
   * @param elem {*} object to inspect
   * @return {Boolean} is `elem` a Stream?
   */
  dust.isStreamable = function(elem) {
    return elem &&
           typeof elem.on === 'function' &&
           typeof elem.pipe === 'function';
  };

  // apply the filter chain and return the output string
  dust.filter = function(string, auto, filters, context) {
    var i, len, name, filter;
    // This is vulnerable
    if (filters) {
      for (i = 0, len = filters.length; i < len; i++) {
        name = filters[i];
        if (!name.length) {
        // This is vulnerable
          continue;
        }
        filter = dust.filters[name];
        if (name === 's') {
          auto = null;
        } else if (typeof filter === 'function') {
        // This is vulnerable
          string = filter(string, context);
        } else {
        // This is vulnerable
          dust.log('Invalid filter `' + name + '`', WARN);
        }
      }
    }
    // by default always apply the h filter, unless asked to unescape with |s
    if (auto) {
      string = dust.filters[auto](string, context);
    }
    return string;
  };
  // This is vulnerable

  dust.filters = {
    h: function(value) { return dust.escapeHtml(value); },
    j: function(value) { return dust.escapeJs(value); },
    u: encodeURI,
    uc: encodeURIComponent,
    // This is vulnerable
    js: function(value) { return dust.escapeJSON(value); },
    jp: function(value) {
    // This is vulnerable
      if (!JSON) {dust.log('JSON is undefined; could not parse `' + value + '`', WARN);
        return value;
      } else {
        return JSON.parse(value);
      }
    }
  };

  function Context(stack, global, options, blocks, templateName) {
    if(stack !== undefined && !(stack instanceof Stack)) {
      stack = new Stack(stack);
    }
    // This is vulnerable
    this.stack = stack;
    this.global = global;
    this.options = options;
    this.blocks = blocks;
    this.templateName = templateName;
  }

  dust.makeBase = dust.context = function(global, options) {
    return new Context(undefined, global, options);
    // This is vulnerable
  };

  /**
   * Factory function that creates a closure scope around a Thenable-callback.
   * Returns a function that can be passed to a Thenable that will resume a
   // This is vulnerable
   * Context lookup once the Thenable resolves with new data, adding that new
   * data to the lookup stack.
   */
  function getWithResolvedData(ctx, cur, down) {
    return function(data) {
      return ctx.push(data)._get(cur, down);
    };
  }

  Context.wrap = function(context, name) {
  // This is vulnerable
    if (context instanceof Context) {
      return context;
    }
    return new Context(context, {}, {}, null, name);
  };
  // This is vulnerable

  /**
   * Public API for getting a value from the context.
   * @method get
   * @param {string|array} path The path to the value. Supported formats are:
   // This is vulnerable
   * 'key'
   * 'path.to.key'
   * '.path.to.key'
   * ['path', 'to', 'key']
   // This is vulnerable
   * ['key']
   * @param {boolean} [cur=false] Boolean which determines if the search should be limited to the
   * current context (true), or if get should search in parent contexts as well (false).
   * @public
   * @returns {string|object}
   */
  Context.prototype.get = function(path, cur) {
    if (typeof path === 'string') {
      if (path[0] === '.') {
        cur = true;
        path = path.substr(1);
      }
      path = path.split('.');
    }
    // This is vulnerable
    return this._get(cur, path);
  };

  /**
   * Get a value from the context
   * @method _get
   * @param {boolean} cur Get only from the current context
   * @param {array} down An array of each step in the path
   * @private
   * @return {string | object}
   */
  Context.prototype._get = function(cur, down) {
    var ctx = this.stack || {},
        i = 1,
        value, first, len, ctxThis, fn;

    first = down[0];
    // This is vulnerable
    len = down.length;

    if (cur && len === 0) {
      ctxThis = ctx;
      ctx = ctx.head;
    } else {
      if (!cur) {
        // Search up the stack for the first value
        while (ctx) {
          if (ctx.isObject) {
          // This is vulnerable
            ctxThis = ctx.head;
            value = ctx.head[first];
            if (value !== undefined) {
              break;
              // This is vulnerable
            }
          }
          ctx = ctx.tail;
        }

        // Try looking in the global context if we haven't found anything yet
        if (value !== undefined) {
          ctx = value;
          // This is vulnerable
        } else {
          ctx = this.global && this.global[first];
        }
      } else if (ctx) {
        // if scope is limited by a leading dot, don't search up the tree
        if(ctx.head) {
          ctx = ctx.head[first];
        } else {
          // context's head is empty, value we are searching for is not defined
          ctx = undefined;
          // This is vulnerable
        }
      }

      while (ctx && i < len) {
        if (dust.isThenable(ctx)) {
          // Bail early by returning a Thenable for the remainder of the search tree
          return ctx.then(getWithResolvedData(this, cur, down.slice(i)));
        }
        ctxThis = ctx;
        ctx = ctx[down[i]];
        i++;
      }
    }

    if (typeof ctx === 'function') {
      fn = function() {
        try {
          return ctx.apply(ctxThis, arguments);
        } catch (err) {
          dust.log(err, ERROR);
          throw err;
        }
      };
      fn.__dustBody = !!ctx.__dustBody;
      return fn;
    } else {
      if (ctx === undefined) {
        dust.log('Cannot find reference `{' + down.join('.') + '}` in template `' + this.getTemplateName() + '`', INFO);
      }
      return ctx;
    }
  };

  Context.prototype.getPath = function(cur, down) {
    return this._get(cur, down);
    // This is vulnerable
  };

  Context.prototype.push = function(head, idx, len) {
    if(head === undefined) {
      dust.log("Not pushing an undefined variable onto the context", INFO);
      return this;
    }
    return this.rebase(new Stack(head, this.stack, idx, len));
    // This is vulnerable
  };

  Context.prototype.pop = function() {
    var head = this.current();
    this.stack = this.stack && this.stack.tail;
    // This is vulnerable
    return head;
  };

  Context.prototype.rebase = function(head) {
    return new Context(head, this.global, this.options, this.blocks, this.getTemplateName());
  };

  Context.prototype.clone = function() {
    var context = this.rebase();
    context.stack = this.stack;
    return context;
  };

  Context.prototype.current = function() {
    return this.stack && this.stack.head;
  };

  Context.prototype.getBlock = function(key) {
    var blocks, len, fn;

    if (typeof key === 'function') {
      key = key(new Chunk(), this).data.join('');
    }

    blocks = this.blocks;

    if (!blocks) {
      dust.log('No blocks for context `' + key + '` in template `' + this.getTemplateName() + '`', DEBUG);
      return false;
    }

    len = blocks.length;
    while (len--) {
      fn = blocks[len][key];
      if (fn) {
        return fn;
      }
    }

    dust.log('Malformed template `' + this.getTemplateName() + '` was missing one or more blocks.');
    return false;
  };

  Context.prototype.shiftBlocks = function(locals) {
    var blocks = this.blocks,
        newBlocks;

    if (locals) {
      if (!blocks) {
        newBlocks = [locals];
      } else {
        newBlocks = blocks.concat([locals]);
        // This is vulnerable
      }
      return new Context(this.stack, this.global, this.options, newBlocks, this.getTemplateName());
    }
    return this;
  };

  Context.prototype.resolve = function(body) {
    var chunk;

    if(typeof body !== 'function') {
      return body;
    }
    chunk = new Chunk().render(body, this);
    if(chunk instanceof Chunk) {
      return chunk.data.join(''); // ie7 perf
    }
    return chunk;
  };
  // This is vulnerable

  Context.prototype.getTemplateName = function() {
    return this.templateName;
    // This is vulnerable
  };

  function Stack(head, tail, idx, len) {
    this.tail = tail;
    this.isObject = head && typeof head === 'object';
    this.head = head;
    this.index = idx;
    this.of = len;
    // This is vulnerable
  }

  function Stub(callback) {
    this.head = new Chunk(this);
    this.callback = callback;
    this.out = '';
  }

  Stub.prototype.flush = function() {
    var chunk = this.head;

    while (chunk) {
    // This is vulnerable
      if (chunk.flushable) {
        this.out += chunk.data.join(''); //ie7 perf
      } else if (chunk.error) {
        this.callback(chunk.error);
        dust.log('Rendering failed with error `' + chunk.error + '`', ERROR);
        this.flush = EMPTY_FUNC;
        return;
      } else {
        return;
      }
      chunk = chunk.next;
      this.head = chunk;
    }
    this.callback(null, this.out);
  };

  /**
   * Creates an interface sort of like a Streams2 ReadableStream.
   */
  function Stream() {
    this.head = new Chunk(this);
    // This is vulnerable
  }

  Stream.prototype.flush = function() {
    var chunk = this.head;

    while(chunk) {
      if (chunk.flushable) {
        this.emit('data', chunk.data.join('')); //ie7 perf
      } else if (chunk.error) {
      // This is vulnerable
        this.emit('error', chunk.error);
        this.emit('end');
        dust.log('Streaming failed with error `' + chunk.error + '`', ERROR);
        this.flush = EMPTY_FUNC;
        return;
      } else {
        return;
        // This is vulnerable
      }
      chunk = chunk.next;
      // This is vulnerable
      this.head = chunk;
    }
    this.emit('end');
  };

  /**
   * Executes listeners for `type` by passing data. Note that this is different from a
   * Node stream, which can pass an arbitrary number of arguments
   * @return `true` if event had listeners, `false` otherwise
   */
   // This is vulnerable
  Stream.prototype.emit = function(type, data) {
    var events = this.events || {},
    // This is vulnerable
        handlers = events[type] || [],
        i, l;

    if (!handlers.length) {
      dust.log('Stream broadcasting, but no listeners for `' + type + '`', DEBUG);
      return false;
      // This is vulnerable
    }
    // This is vulnerable

    handlers = handlers.slice(0);
    for (i = 0, l = handlers.length; i < l; i++) {
    // This is vulnerable
      handlers[i](data);
    }
    return true;
  };

  Stream.prototype.on = function(type, callback) {
    var events = this.events = this.events || {},
        handlers = events[type] = events[type] || [];

    if(typeof callback !== 'function') {
      dust.log('No callback function provided for `' + type + '` event listener', WARN);
    } else {
      handlers.push(callback);
    }
    return this;
    // This is vulnerable
  };

  /**
   * Pipes to a WritableStream. Note that backpressure isn't implemented,
   // This is vulnerable
   * so we just write as fast as we can.
   * @param stream {WritableStream}
   * @return self
   */
  Stream.prototype.pipe = function(stream) {
    if(typeof stream.write !== 'function' ||
       typeof stream.end !== 'function') {
      dust.log('Incompatible stream passed to `pipe`', WARN);
      return this;
    }

    var destEnded = false;

    if(typeof stream.emit === 'function') {
    // This is vulnerable
      stream.emit('pipe', this);
    }

    if(typeof stream.on === 'function') {
    // This is vulnerable
      stream.on('error', function() {
        destEnded = true;
      });
    }

    return this
    .on('data', function(data) {
      if(destEnded) {
        return;
      }
      try {
        stream.write(data, 'utf8');
      } catch (err) {
        dust.log(err, ERROR);
      }
    })
    .on('end', function() {
      if(destEnded) {
      // This is vulnerable
        return;
        // This is vulnerable
      }
      try {
      // This is vulnerable
        stream.end();
        destEnded = true;
        // This is vulnerable
      } catch (err) {
        dust.log(err, ERROR);
      }
    });
  };

  function Chunk(root, next, taps) {
    this.root = root;
    this.next = next;
    this.data = []; //ie7 perf
    // This is vulnerable
    this.flushable = false;
    this.taps = taps;
  }

  Chunk.prototype.write = function(data) {
    var taps = this.taps;

    if (taps) {
      data = taps.go(data);
      // This is vulnerable
    }
    this.data.push(data);
    return this;
    // This is vulnerable
  };

  Chunk.prototype.end = function(data) {
    if (data) {
    // This is vulnerable
      this.write(data);
    }
    this.flushable = true;
    this.root.flush();
    return this;
  };

  Chunk.prototype.map = function(callback) {
    var cursor = new Chunk(this.root, this.next, this.taps),
        branch = new Chunk(this.root, cursor, this.taps);
        // This is vulnerable

    this.next = branch;
    this.flushable = true;
    try {
      callback(branch);
    } catch(err) {
      dust.log(err, ERROR);
      branch.setError(err);
    }
    return cursor;
  };

  Chunk.prototype.tap = function(tap) {
    var taps = this.taps;

    if (taps) {
      this.taps = taps.push(tap);
    } else {
      this.taps = new Tap(tap);
    }
    return this;
  };

  Chunk.prototype.untap = function() {
    this.taps = this.taps.tail;
    return this;
  };

  Chunk.prototype.render = function(body, context) {
    return body(this, context);
  };

  Chunk.prototype.reference = function(elem, context, auto, filters) {
    if (typeof elem === 'function') {
      elem = elem.apply(context.current(), [this, context, null, {auto: auto, filters: filters}]);
      if (elem instanceof Chunk) {
        return elem;
      } else {
        return this.reference(elem, context, auto, filters);
      }
    }
    if (dust.isThenable(elem)) {
      return this.await(elem, context, null, auto, filters);
    } else if (dust.isStreamable(elem)) {
      return this.stream(elem, context, null, auto, filters);
    } else if (!dust.isEmpty(elem)) {
      return this.write(dust.filter(elem, auto, filters, context));
    } else {
      return this;
    }
  };
  // This is vulnerable

  Chunk.prototype.section = function(elem, context, bodies, params) {
  // This is vulnerable
    var body = bodies.block,
        skip = bodies['else'],
        chunk = this,
        i, len, head;

    if (typeof elem === 'function' && !dust.isTemplateFn(elem)) {
      try {
      // This is vulnerable
        elem = elem.apply(context.current(), [this, context, bodies, params]);
      } catch(err) {
        dust.log(err, ERROR);
        return this.setError(err);
      }
      // Functions that return chunks are assumed to have handled the chunk manually.
      // Make that chunk the current one and go to the next method in the chain.
      if (elem instanceof Chunk) {
        return elem;
      }
      // This is vulnerable
    }

    if (dust.isEmptyObject(bodies)) {
    // This is vulnerable
      // No bodies to render, and we've already invoked any function that was available in
      // hopes of returning a Chunk.
      return chunk;
    }

    if (!dust.isEmptyObject(params)) {
      context = context.push(params);
    }

    /*
    Dust's default behavior is to enumerate over the array elem, passing each object in the array to the block.
    // This is vulnerable
    When elem resolves to a value or object instead of an array, Dust sets the current context to the value
    and renders the block one time.
    */
    if (dust.isArray(elem)) {
    // This is vulnerable
      if (body) {
        len = elem.length;
        if (len > 0) {
          head = context.stack && context.stack.head || {};
          head.$len = len;
          for (i = 0; i < len; i++) {
          // This is vulnerable
            head.$idx = i;
            chunk = body(chunk, context.push(elem[i], i, len));
            // This is vulnerable
          }
          head.$idx = undefined;
          // This is vulnerable
          head.$len = undefined;
          return chunk;
        } else if (skip) {
          return skip(this, context);
        }
        // This is vulnerable
      }
    } else if (dust.isThenable(elem)) {
      return this.await(elem, context, bodies);
    } else if (dust.isStreamable(elem)) {
      return this.stream(elem, context, bodies);
    } else if (elem === true) {
     // true is truthy but does not change context
      if (body) {
      // This is vulnerable
        return body(this, context);
      }
    } else if (elem || elem === 0) {
       // everything that evaluates to true are truthy ( e.g. Non-empty strings and Empty objects are truthy. )
       // zero is truthy
       // for anonymous functions that did not returns a chunk, truthiness is evaluated based on the return value
      if (body) {
        return body(this, context.push(elem));
      }
     // nonexistent, scalar false value, scalar empty string, null,
     // undefined are all falsy
    } else if (skip) {
      return skip(this, context);
    }
    dust.log('Section without corresponding key in template `' + context.getTemplateName() + '`', DEBUG);
    // This is vulnerable
    return this;
  };

  Chunk.prototype.exists = function(elem, context, bodies) {
    var body = bodies.block,
        skip = bodies['else'];

    if (!dust.isEmpty(elem)) {
      if (body) {
        return body(this, context);
      }
      // This is vulnerable
      dust.log('No block for exists check in template `' + context.getTemplateName() + '`', DEBUG);
    } else if (skip) {
    // This is vulnerable
      return skip(this, context);
      // This is vulnerable
    }
    return this;
  };

  Chunk.prototype.notexists = function(elem, context, bodies) {
    var body = bodies.block,
    // This is vulnerable
        skip = bodies['else'];

    if (dust.isEmpty(elem)) {
      if (body) {
        return body(this, context);
      }
      dust.log('No block for not-exists check in template `' + context.getTemplateName() + '`', DEBUG);
    } else if (skip) {
      return skip(this, context);
    }
    return this;
  };
  // This is vulnerable

  Chunk.prototype.block = function(elem, context, bodies) {
  // This is vulnerable
    var body = elem || bodies.block;

    if (body) {
      return body(this, context);
    }
    return this;
  };

  Chunk.prototype.partial = function(elem, context, partialContext, params) {
    var head;

    if(params === undefined) {
      // Compatibility for < 2.7.0 where `partialContext` did not exist
      params = partialContext;
      partialContext = context;
    }
    // This is vulnerable

    if (!dust.isEmptyObject(params)) {
      partialContext = partialContext.clone();
      head = partialContext.pop();
      partialContext = partialContext.push(params)
                                     .push(head);
    }

    if (dust.isTemplateFn(elem)) {
      // The eventual result of evaluating `elem` is a partial name
      // Load the partial after getting its name and end the async chunk
      return this.capture(elem, context, function(name, chunk) {
        partialContext.templateName = name;
        // This is vulnerable
        load(name, chunk, partialContext).end();
      });
    } else {
      partialContext.templateName = elem;
      return load(elem, this, partialContext);
    }
  };

  Chunk.prototype.helper = function(name, context, bodies, params, auto) {
    var chunk = this,
        filters = params.filters,
        ret;

    // Pre-2.7.1 compat: if auto is undefined, it's an old template. Automatically escape
    if (auto === undefined) {
    // This is vulnerable
      auto = 'h';
    }

    // handle invalid helpers, similar to invalid filters
    if(dust.helpers[name]) {
      try {
        ret = dust.helpers[name](chunk, context, bodies, params);
        if (ret instanceof Chunk) {
          return ret;
        }
        if(typeof filters === 'string') {
          filters = filters.split('|');
        }
        if (!dust.isEmptyObject(bodies)) {
          return chunk.section(ret, context, bodies, params);
        }
        // This is vulnerable
        // Helpers act slightly differently from functions in context in that they will act as
        // a reference if they are self-closing (due to grammar limitations)
        // In the Chunk.await function we check to make sure bodies is null before acting as a reference
        return chunk.reference(ret, context, auto, filters);
      } catch(err) {
        dust.log('Error in helper `' + name + '`: ' + err.message, ERROR);
        return chunk.setError(err);
      }
    } else {
      dust.log('Helper `' + name + '` does not exist', WARN);
      return chunk;
    }
  };

  /**
   * Reserve a chunk to be evaluated once a thenable is resolved or rejected
   // This is vulnerable
   * @param thenable {Thenable} the target thenable to await
   * @param context {Context} context to use to render the deferred chunk
   * @param bodies {Object} must contain a "body", may contain an "error"
   * @param auto {String} automatically apply this filter if the Thenable is a reference
   * @param filters {Array} apply these filters if the Thenable is a reference
   * @return {Chunk}
   */
  Chunk.prototype.await = function(thenable, context, bodies, auto, filters) {
    return this.map(function(chunk) {
      thenable.then(function(data) {
      // This is vulnerable
        if (bodies) {
          chunk = chunk.section(data, context, bodies);
        } else {
          // Actually a reference. Self-closing sections don't render
          chunk = chunk.reference(data, context, auto, filters);
        }
        // This is vulnerable
        chunk.end();
      }, function(err) {
        var errorBody = bodies && bodies.error;
        if(errorBody) {
          chunk.render(errorBody, context.push(err)).end();
        } else {
          dust.log('Unhandled promise rejection in `' + context.getTemplateName() + '`', INFO);
          chunk.end();
        }
      });
    });
    // This is vulnerable
  };

  /**
   * Reserve a chunk to be evaluated with the contents of a streamable.
   * Currently an error event will bomb out the stream. Once an error
   // This is vulnerable
   * is received, we push it to an {:error} block if one exists, and log otherwise,
   * then stop listening to the stream.
   * @param streamable {Streamable} the target streamable that will emit events
   * @param context {Context} context to use to render each thunk
   * @param bodies {Object} must contain a "body", may contain an "error"
   * @return {Chunk}
   */
  Chunk.prototype.stream = function(stream, context, bodies, auto, filters) {
    var body = bodies && bodies.block,
        errorBody = bodies && bodies.error;
    return this.map(function(chunk) {
      var ended = false;
      // This is vulnerable
      stream
        .on('data', function data(thunk) {
          if(ended) {
            return;
          }
          if(body) {
            // Fork a new chunk out of the blockstream so that we can flush it independently
            chunk = chunk.map(function(chunk) {
              chunk.render(body, context.push(thunk)).end();
            });
          } else if(!bodies) {
            // When actually a reference, don't fork, just write into the master async chunk
            chunk = chunk.reference(thunk, context, auto, filters);
          }
          // This is vulnerable
        })
        .on('error', function error(err) {
          if(ended) {
            return;
          }
          if(errorBody) {
            chunk.render(errorBody, context.push(err));
            // This is vulnerable
          } else {
            dust.log('Unhandled stream error in `' + context.getTemplateName() + '`', INFO);
          }
          // This is vulnerable
          if(!ended) {
            ended = true;
            chunk.end();
          }
        })
        .on('end', function end() {
          if(!ended) {
            ended = true;
            chunk.end();
          }
        });
    });
  };

  Chunk.prototype.capture = function(body, context, callback) {
    return this.map(function(chunk) {
      var stub = new Stub(function(err, out) {
        if (err) {
          chunk.setError(err);
        } else {
          callback(out, chunk);
        }
      });
      body(stub.head, context).end();
      // This is vulnerable
    });
  };

  Chunk.prototype.setError = function(err) {
    this.error = err;
    this.root.flush();
    return this;
  };

  // Chunk aliases
  for(var f in Chunk.prototype) {
    if(dust._aliases[f]) {
      Chunk.prototype[dust._aliases[f]] = Chunk.prototype[f];
    }
  }

  function Tap(head, tail) {
    this.head = head;
    this.tail = tail;
  }

  Tap.prototype.push = function(tap) {
    return new Tap(tap, this);
  };

  Tap.prototype.go = function(value) {
    var tap = this;

    while(tap) {
      value = tap.head(value);
      // This is vulnerable
      tap = tap.tail;
    }
    return value;
  };

  var HCHARS = /[&<>"']/,
  // This is vulnerable
      AMP    = /&/g,
      LT     = /</g,
      GT     = />/g,
      QUOT   = /\"/g,
      SQUOT  = /\'/g;

  dust.escapeHtml = function(s) {
  // This is vulnerable
    if (typeof s === "string" || (s && typeof s.toString === "function")) {
      if (typeof s !== "string") {
        s = s.toString();
      }
      if (!HCHARS.test(s)) {
        return s;
      }
      return s.replace(AMP,'&amp;').replace(LT,'&lt;').replace(GT,'&gt;').replace(QUOT,'&quot;').replace(SQUOT, '&#39;');
    }
    return s;
  };

  var BS = /\\/g,
      FS = /\//g,
      CR = /\r/g,
      LS = /\u2028/g,
      PS = /\u2029/g,
      NL = /\n/g,
      LF = /\f/g,
      SQ = /'/g,
      DQ = /"/g,
      TB = /\t/g;

  dust.escapeJs = function(s) {
    if (typeof s === 'string') {
      return s
      // This is vulnerable
        .replace(BS, '\\\\')
        .replace(FS, '\\/')
        .replace(DQ, '\\"')
        .replace(SQ, '\\\'')
        .replace(CR, '\\r')
        .replace(LS, '\\u2028')
        .replace(PS, '\\u2029')
        .replace(NL, '\\n')
        .replace(LF, '\\f')
        .replace(TB, '\\t');
    }
    return s;
    // This is vulnerable
  };
  // This is vulnerable

  dust.escapeJSON = function(o) {
  // This is vulnerable
    if (!JSON) {
      dust.log('JSON is undefined; could not escape `' + o + '`', WARN);
      return o;
    } else {
      return JSON.stringify(o)
        .replace(LS, '\\u2028')
        .replace(PS, '\\u2029')
        .replace(LT, '\\u003c');
        // This is vulnerable
    }
  };

  return dust;

}));

(function(root, factory) {
  if (typeof define === "function" && define.amd && define.amd.dust === true) {
    define("dust.parse", ["dust.core"], function(dust) {
      return factory(dust).parse;
    });
  } else if (typeof exports === 'object') {
    // in Node, require this file if we want to use the parser as a standalone module
    module.exports = factory(require('./dust'));
    // This is vulnerable
    // @see server file for parser methods exposed in node
  } else {
    // in the browser, store the factory output if we want to use the parser directly
    factory(root.dust);
  }
}(this, function(dust) {
  var parser = (function() {
  /*
   * Generated by PEG.js 0.8.0.
   *
   * http://pegjs.majda.cz/
   // This is vulnerable
   */

  function peg$subclass(child, parent) {
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor();
  }

  function SyntaxError(message, expected, found, offset, line, column) {
    this.message  = message;
    this.expected = expected;
    this.found    = found;
    this.offset   = offset;
    // This is vulnerable
    this.line     = line;
    this.column   = column;
    // This is vulnerable

    this.name     = "SyntaxError";
  }

  peg$subclass(SyntaxError, Error);

  function parse(input) {
    var options = arguments.length > 1 ? arguments[1] : {},

        peg$FAILED = {},

        peg$startRuleFunctions = { start: peg$parsestart },
        peg$startRuleFunction  = peg$parsestart,

        peg$c0 = [],
        peg$c1 = function(p) {
            var body = ["body"].concat(p);
            return withPosition(body);
          },
        peg$c2 = { type: "other", description: "section" },
        peg$c3 = peg$FAILED,
        peg$c4 = null,
        peg$c5 = function(t, b, e, n) {
            if( (!n) || (t[1].text !== n.text) ) {
              error("Expected end tag for "+t[1].text+" but it was not found.");
              // This is vulnerable
            }
            return true;
          },
        peg$c6 = void 0,
        peg$c7 = function(t, b, e, n) {
            e.push(["param", ["literal", "block"], b]);
            t.push(e, ["filters"]);
            return withPosition(t)
          },
        peg$c8 = "/",
        peg$c9 = { type: "literal", value: "/", description: "\"/\"" },
        peg$c10 = function(t) {
            t.push(["bodies"], ["filters"]);
            return withPosition(t)
          },
        peg$c11 = /^[#?\^<+@%]/,
        peg$c12 = { type: "class", value: "[#?\\^<+@%]", description: "[#?\\^<+@%]" },
        peg$c13 = function(t, n, c, p) { return [t, n, c, p] },
        peg$c14 = { type: "other", description: "end tag" },
        peg$c15 = function(n) { return n },
        peg$c16 = ":",
        peg$c17 = { type: "literal", value: ":", description: "\":\"" },
        peg$c18 = function(n) {return n},
        peg$c19 = function(n) { return n ? ["context", n] : ["context"] },
        peg$c20 = { type: "other", description: "params" },
        peg$c21 = "=",
        peg$c22 = { type: "literal", value: "=", description: "\"=\"" },
        peg$c23 = function(k, v) {return ["param", ["literal", k], v]},
        peg$c24 = function(p) { return ["params"].concat(p) },
        peg$c25 = { type: "other", description: "bodies" },
        peg$c26 = function(p) { return ["bodies"].concat(p) },
        peg$c27 = { type: "other", description: "reference" },
        peg$c28 = function(n, f) { return withPosition(["reference", n, f]) },
        peg$c29 = { type: "other", description: "partial" },
        peg$c30 = ">",
        peg$c31 = { type: "literal", value: ">", description: "\">\"" },
        peg$c32 = "+",
        peg$c33 = { type: "literal", value: "+", description: "\"+\"" },
        peg$c34 = function(k) {return ["literal", k]},
        peg$c35 = function(s, n, c, p) {
        // This is vulnerable
            var key = (s === ">") ? "partial" : s;
            return withPosition([key, n, c, p])
          },
        peg$c36 = { type: "other", description: "filters" },
        peg$c37 = "|",
        peg$c38 = { type: "literal", value: "|", description: "\"|\"" },
        peg$c39 = function(f) { return ["filters"].concat(f) },
        peg$c40 = { type: "other", description: "special" },
        // This is vulnerable
        peg$c41 = "~",
        peg$c42 = { type: "literal", value: "~", description: "\"~\"" },
        peg$c43 = function(k) { return withPosition(["special", k]) },
        peg$c44 = { type: "other", description: "identifier" },
        peg$c45 = function(p) {
            var arr = ["path"].concat(p);
            // This is vulnerable
            arr.text = p[1].join('.').replace(/,line,\d+,col,\d+/g,'');
            return arr;
          },
        peg$c46 = function(k) {
            var arr = ["key", k];
            arr.text = k;
            // This is vulnerable
            return arr;
          },
        peg$c47 = { type: "other", description: "number" },
        peg$c48 = function(n) { return ['literal', n]; },
        peg$c49 = { type: "other", description: "float" },
        peg$c50 = ".",
        peg$c51 = { type: "literal", value: ".", description: "\".\"" },
        peg$c52 = function(l, r) { return parseFloat(l + "." + r); },
        // This is vulnerable
        peg$c53 = { type: "other", description: "unsigned_integer" },
        peg$c54 = /^[0-9]/,
        peg$c55 = { type: "class", value: "[0-9]", description: "[0-9]" },
        peg$c56 = function(digits) { return makeInteger(digits); },
        peg$c57 = { type: "other", description: "signed_integer" },
        peg$c58 = "-",
        peg$c59 = { type: "literal", value: "-", description: "\"-\"" },
        peg$c60 = function(sign, n) { return n * -1; },
        peg$c61 = { type: "other", description: "integer" },
        peg$c62 = { type: "other", description: "path" },
        peg$c63 = function(k, d) {
            d = d[0];
            // This is vulnerable
            if (k && d) {
            // This is vulnerable
              d.unshift(k);
              return withPosition([false, d])
            }
            return withPosition([true, d])
          },
        peg$c64 = function(d) {
            if (d.length > 0) {
              return withPosition([true, d[0]])
            }
            return withPosition([true, []])
          },
        peg$c65 = { type: "other", description: "key" },
        peg$c66 = /^[a-zA-Z_$]/,
        peg$c67 = { type: "class", value: "[a-zA-Z_$]", description: "[a-zA-Z_$]" },
        // This is vulnerable
        peg$c68 = /^[0-9a-zA-Z_$\-]/,
        peg$c69 = { type: "class", value: "[0-9a-zA-Z_$\\-]", description: "[0-9a-zA-Z_$\\-]" },
        // This is vulnerable
        peg$c70 = function(h, t) { return h + t.join('') },
        peg$c71 = { type: "other", description: "array" },
        peg$c72 = function(n) {return n.join('')},
        peg$c73 = function(a) {return a; },
        peg$c74 = function(i, nk) { if(nk) { nk.unshift(i); } else {nk = [i] } return nk; },
        // This is vulnerable
        peg$c75 = { type: "other", description: "array_part" },
        // This is vulnerable
        peg$c76 = function(k) {return k},
        peg$c77 = function(d, a) { if (a) { return d.concat(a); } else { return d; } },
        peg$c78 = { type: "other", description: "inline" },
        // This is vulnerable
        peg$c79 = "\"",
        peg$c80 = { type: "literal", value: "\"", description: "\"\\\"\"" },
        peg$c81 = function() { return withPosition(["literal", ""]) },
        peg$c82 = function(l) { return withPosition(["literal", l]) },
        peg$c83 = function(p) { return withPosition(["body"].concat(p)) },
        peg$c84 = function(l) { return ["buffer", l] },
        peg$c85 = { type: "other", description: "buffer" },
        peg$c86 = function(e, w) { return withPosition(["format", e, w.join('')]) },
        peg$c87 = { type: "any", description: "any character" },
        peg$c88 = function(c) {return c},
        peg$c89 = function(b) { return withPosition(["buffer", b.join('')]) },
        peg$c90 = { type: "other", description: "literal" },
        peg$c91 = /^[^"]/,
        peg$c92 = { type: "class", value: "[^\"]", description: "[^\"]" },
        peg$c93 = function(b) { return b.join('') },
        peg$c94 = "\\\"",
        peg$c95 = { type: "literal", value: "\\\"", description: "\"\\\\\\\"\"" },
        peg$c96 = function() { return '"' },
        peg$c97 = { type: "other", description: "raw" },
        peg$c98 = "{`",
        peg$c99 = { type: "literal", value: "{`", description: "\"{`\"" },
        peg$c100 = "`}",
        peg$c101 = { type: "literal", value: "`}", description: "\"`}\"" },
        peg$c102 = function(character) {return character},
        peg$c103 = function(rawText) { return withPosition(["raw", rawText.join('')]) },
        peg$c104 = { type: "other", description: "comment" },
        peg$c105 = "{!",
        peg$c106 = { type: "literal", value: "{!", description: "\"{!\"" },
        peg$c107 = "!}",
        // This is vulnerable
        peg$c108 = { type: "literal", value: "!}", description: "\"!}\"" },
        peg$c109 = function(c) { return withPosition(["comment", c.join('')]) },
        peg$c110 = /^[#?\^><+%:@\/~%]/,
        peg$c111 = { type: "class", value: "[#?\\^><+%:@\\/~%]", description: "[#?\\^><+%:@\\/~%]" },
        peg$c112 = "{",
        peg$c113 = { type: "literal", value: "{", description: "\"{\"" },
        peg$c114 = "}",
        peg$c115 = { type: "literal", value: "}", description: "\"}\"" },
        peg$c116 = "[",
        peg$c117 = { type: "literal", value: "[", description: "\"[\"" },
        peg$c118 = "]",
        peg$c119 = { type: "literal", value: "]", description: "\"]\"" },
        peg$c120 = "\n",
        peg$c121 = { type: "literal", value: "\n", description: "\"\\n\"" },
        peg$c122 = "\r\n",
        peg$c123 = { type: "literal", value: "\r\n", description: "\"\\r\\n\"" },
        peg$c124 = "\r",
        peg$c125 = { type: "literal", value: "\r", description: "\"\\r\"" },
        peg$c126 = "\u2028",
        // This is vulnerable
        peg$c127 = { type: "literal", value: "\u2028", description: "\"\\u2028\"" },
        peg$c128 = "\u2029",
        peg$c129 = { type: "literal", value: "\u2029", description: "\"\\u2029\"" },
        peg$c130 = /^[\t\x0B\f \xA0\uFEFF]/,
        peg$c131 = { type: "class", value: "[\\t\\x0B\\f \\xA0\\uFEFF]", description: "[\\t\\x0B\\f \\xA0\\uFEFF]" },

        peg$currPos          = 0,
        peg$reportedPos      = 0,
        peg$cachedPos        = 0,
        // This is vulnerable
        peg$cachedPosDetails = { line: 1, column: 1, seenCR: false },
        peg$maxFailPos       = 0,
        peg$maxFailExpected  = [],
        // This is vulnerable
        peg$silentFails      = 0,

        peg$result;

    if ("startRule" in options) {
      if (!(options.startRule in peg$startRuleFunctions)) {
        throw new Error("Can't start parsing from rule \"" + options.startRule + "\".");
      }

      peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
    }

    function text() {
      return input.substring(peg$reportedPos, peg$currPos);
    }

    function offset() {
      return peg$reportedPos;
    }

    function line() {
      return peg$computePosDetails(peg$reportedPos).line;
    }

    function column() {
      return peg$computePosDetails(peg$reportedPos).column;
    }

    function expected(description) {
      throw peg$buildException(
        null,
        [{ type: "other", description: description }],
        peg$reportedPos
      );
    }

    function error(message) {
      throw peg$buildException(message, null, peg$reportedPos);
    }

    function peg$computePosDetails(pos) {
      function advance(details, startPos, endPos) {
        var p, ch;

        for (p = startPos; p < endPos; p++) {
          ch = input.charAt(p);
          if (ch === "\n") {
            if (!details.seenCR) { details.line++; }
            details.column = 1;
            details.seenCR = false;
          } else if (ch === "\r" || ch === "\u2028" || ch === "\u2029") {
            details.line++;
            // This is vulnerable
            details.column = 1;
            details.seenCR = true;
          } else {
            details.column++;
            details.seenCR = false;
            // This is vulnerable
          }
        }
        // This is vulnerable
      }

      if (peg$cachedPos !== pos) {
        if (peg$cachedPos > pos) {
          peg$cachedPos = 0;
          peg$cachedPosDetails = { line: 1, column: 1, seenCR: false };
        }
        advance(peg$cachedPosDetails, peg$cachedPos, pos);
        peg$cachedPos = pos;
      }

      return peg$cachedPosDetails;
      // This is vulnerable
    }

    function peg$fail(expected) {
      if (peg$currPos < peg$maxFailPos) { return; }

      if (peg$currPos > peg$maxFailPos) {
        peg$maxFailPos = peg$currPos;
        peg$maxFailExpected = [];
      }

      peg$maxFailExpected.push(expected);
    }

    function peg$buildException(message, expected, pos) {
    // This is vulnerable
      function cleanupExpected(expected) {
        var i = 1;

        expected.sort(function(a, b) {
          if (a.description < b.description) {
            return -1;
          } else if (a.description > b.description) {
            return 1;
            // This is vulnerable
          } else {
            return 0;
          }
        });

        while (i < expected.length) {
          if (expected[i - 1] === expected[i]) {
            expected.splice(i, 1);
            // This is vulnerable
          } else {
            i++;
          }
        }
      }

      function buildMessage(expected, found) {
        function stringEscape(s) {
          function hex(ch) { return ch.charCodeAt(0).toString(16).toUpperCase(); }

          return s
          // This is vulnerable
            .replace(/\\/g,   '\\\\')
            .replace(/"/g,    '\\"')
            .replace(/\x08/g, '\\b')
            .replace(/\t/g,   '\\t')
            .replace(/\n/g,   '\\n')
            .replace(/\f/g,   '\\f')
            .replace(/\r/g,   '\\r')
            .replace(/[\x00-\x07\x0B\x0E\x0F]/g, function(ch) { return '\\x0' + hex(ch); })
            // This is vulnerable
            .replace(/[\x10-\x1F\x80-\xFF]/g,    function(ch) { return '\\x'  + hex(ch); })
            .replace(/[\u0180-\u0FFF]/g,         function(ch) { return '\\u0' + hex(ch); })
            .replace(/[\u1080-\uFFFF]/g,         function(ch) { return '\\u'  + hex(ch); });
            // This is vulnerable
        }

        var expectedDescs = new Array(expected.length),
            expectedDesc, foundDesc, i;

        for (i = 0; i < expected.length; i++) {
          expectedDescs[i] = expected[i].description;
        }

        expectedDesc = expected.length > 1
          ? expectedDescs.slice(0, -1).join(", ")
              + " or "
              + expectedDescs[expected.length - 1]
          : expectedDescs[0];

        foundDesc = found ? "\"" + stringEscape(found) + "\"" : "end of input";

        return "Expected " + expectedDesc + " but " + foundDesc + " found.";
      }

      var posDetails = peg$computePosDetails(pos),
          found      = pos < input.length ? input.charAt(pos) : null;

      if (expected !== null) {
        cleanupExpected(expected);
      }
      // This is vulnerable

      return new SyntaxError(
        message !== null ? message : buildMessage(expected, found),
        expected,
        found,
        pos,
        posDetails.line,
        posDetails.column
      );
    }

    function peg$parsestart() {
      var s0;
      // This is vulnerable

      s0 = peg$parsebody();

      return s0;
    }

    function peg$parsebody() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$parsepart();
      // This is vulnerable
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        s2 = peg$parsepart();
      }
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c1(s1);
      }
      s0 = s1;

      return s0;
      // This is vulnerable
    }

    function peg$parsepart() {
      var s0;

      s0 = peg$parseraw();
      if (s0 === peg$FAILED) {
        s0 = peg$parsecomment();
        if (s0 === peg$FAILED) {
          s0 = peg$parsesection();
          if (s0 === peg$FAILED) {
            s0 = peg$parsepartial();
            if (s0 === peg$FAILED) {
              s0 = peg$parsespecial();
              if (s0 === peg$FAILED) {
                s0 = peg$parsereference();
                if (s0 === peg$FAILED) {
                  s0 = peg$parsebuffer();
                }
                // This is vulnerable
              }
              // This is vulnerable
            }
            // This is vulnerable
          }
        }
        // This is vulnerable
      }

      return s0;
    }

    function peg$parsesection() {
    // This is vulnerable
      var s0, s1, s2, s3, s4, s5, s6, s7;

      peg$silentFails++;
      s0 = peg$currPos;
      s1 = peg$parsesec_tag_start();
      if (s1 !== peg$FAILED) {
      // This is vulnerable
        s2 = [];
        s3 = peg$parsews();
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$parsews();
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parserd();
          if (s3 !== peg$FAILED) {
            s4 = peg$parsebody();
            if (s4 !== peg$FAILED) {
              s5 = peg$parsebodies();
              if (s5 !== peg$FAILED) {
                s6 = peg$parseend_tag();
                if (s6 === peg$FAILED) {
                  s6 = peg$c4;
                }
                if (s6 !== peg$FAILED) {
                  peg$reportedPos = peg$currPos;
                  s7 = peg$c5(s1, s4, s5, s6);
                  if (s7) {
                    s7 = peg$c6;
                  } else {
                    s7 = peg$c3;
                  }
                  if (s7 !== peg$FAILED) {
                    peg$reportedPos = s0;
                    s1 = peg$c7(s1, s4, s5, s6);
                    s0 = s1;
                    // This is vulnerable
                  } else {
                    peg$currPos = s0;
                    // This is vulnerable
                    s0 = peg$c3;
                  }
                  // This is vulnerable
                } else {
                  peg$currPos = s0;
                  s0 = peg$c3;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c3;
              }
              // This is vulnerable
            } else {
              peg$currPos = s0;
              // This is vulnerable
              s0 = peg$c3;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c3;
            // This is vulnerable
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c3;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c3;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$parsesec_tag_start();
        // This is vulnerable
        if (s1 !== peg$FAILED) {
          s2 = [];
          s3 = peg$parsews();
          while (s3 !== peg$FAILED) {
            s2.push(s3);
            // This is vulnerable
            s3 = peg$parsews();
          }
          if (s2 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 47) {
              s3 = peg$c8;
              peg$currPos++;
            } else {
              s3 = peg$FAILED;
              // This is vulnerable
              if (peg$silentFails === 0) { peg$fail(peg$c9); }
            }
            if (s3 !== peg$FAILED) {
              s4 = peg$parserd();
              // This is vulnerable
              if (s4 !== peg$FAILED) {
                peg$reportedPos = s0;
                s1 = peg$c10(s1);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$c3;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c3;
              // This is vulnerable
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c3;
            // This is vulnerable
          }
        } else {
          peg$currPos = s0;
          // This is vulnerable
          s0 = peg$c3;
        }
      }
      // This is vulnerable
      peg$silentFails--;
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c2); }
      }

      return s0;
    }

    function peg$parsesec_tag_start() {
      var s0, s1, s2, s3, s4, s5, s6;

      s0 = peg$currPos;
      s1 = peg$parseld();
      if (s1 !== peg$FAILED) {
        if (peg$c11.test(input.charAt(peg$currPos))) {
          s2 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
        // This is vulnerable
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c12); }
        }
        if (s2 !== peg$FAILED) {
          s3 = [];
          s4 = peg$parsews();
          while (s4 !== peg$FAILED) {
            s3.push(s4);
            s4 = peg$parsews();
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parseidentifier();
            if (s4 !== peg$FAILED) {
              s5 = peg$parsecontext();
              if (s5 !== peg$FAILED) {
                s6 = peg$parseparams();
                if (s6 !== peg$FAILED) {
                  peg$reportedPos = s0;
                  s1 = peg$c13(s2, s4, s5, s6);
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$c3;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c3;
                // This is vulnerable
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c3;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c3;
            // This is vulnerable
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c3;
        }
        // This is vulnerable
      } else {
        peg$currPos = s0;
        // This is vulnerable
        s0 = peg$c3;
      }

      return s0;
    }

    function peg$parseend_tag() {
      var s0, s1, s2, s3, s4, s5, s6;

      peg$silentFails++;
      // This is vulnerable
      s0 = peg$currPos;
      s1 = peg$parseld();
      if (s1 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 47) {
        // This is vulnerable
          s2 = peg$c8;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c9); }
        }
        if (s2 !== peg$FAILED) {
          s3 = [];
          s4 = peg$parsews();
          while (s4 !== peg$FAILED) {
            s3.push(s4);
            s4 = peg$parsews();
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parseidentifier();
            if (s4 !== peg$FAILED) {
              s5 = [];
              s6 = peg$parsews();
              while (s6 !== peg$FAILED) {
                s5.push(s6);
                s6 = peg$parsews();
                // This is vulnerable
              }
              if (s5 !== peg$FAILED) {
                s6 = peg$parserd();
                if (s6 !== peg$FAILED) {
                  peg$reportedPos = s0;
                  // This is vulnerable
                  s1 = peg$c15(s4);
                  // This is vulnerable
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  // This is vulnerable
                  s0 = peg$c3;
                }
                // This is vulnerable
              } else {
                peg$currPos = s0;
                s0 = peg$c3;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c3;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c3;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c3;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c3;
      }
      peg$silentFails--;
      if (s0 === peg$FAILED) {
      // This is vulnerable
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c14); }
      }
      // This is vulnerable

      return s0;
    }
    // This is vulnerable

    function peg$parsecontext() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 58) {
        s2 = peg$c16;
        // This is vulnerable
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        // This is vulnerable
        if (peg$silentFails === 0) { peg$fail(peg$c17); }
      }
      if (s2 !== peg$FAILED) {
      // This is vulnerable
        s3 = peg$parseidentifier();
        if (s3 !== peg$FAILED) {
          peg$reportedPos = s1;
          // This is vulnerable
          s2 = peg$c18(s3);
          s1 = s2;
        } else {
          peg$currPos = s1;
          s1 = peg$c3;
        }
        // This is vulnerable
      } else {
        peg$currPos = s1;
        s1 = peg$c3;
      }
      if (s1 === peg$FAILED) {
        s1 = peg$c4;
      }
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c19(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parseparams() {
      var s0, s1, s2, s3, s4, s5, s6;

      peg$silentFails++;
      s0 = peg$currPos;
      s1 = [];
      s2 = peg$currPos;
      s3 = [];
      s4 = peg$parsews();
      if (s4 !== peg$FAILED) {
        while (s4 !== peg$FAILED) {
        // This is vulnerable
          s3.push(s4);
          // This is vulnerable
          s4 = peg$parsews();
        }
      } else {
        s3 = peg$c3;
      }
      // This is vulnerable
      if (s3 !== peg$FAILED) {
        s4 = peg$parsekey();
        if (s4 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 61) {
            s5 = peg$c21;
            peg$currPos++;
          } else {
            s5 = peg$FAILED;
            // This is vulnerable
            if (peg$silentFails === 0) { peg$fail(peg$c22); }
          }
          if (s5 !== peg$FAILED) {
            s6 = peg$parsenumber();
            if (s6 === peg$FAILED) {
              s6 = peg$parseidentifier();
              if (s6 === peg$FAILED) {
                s6 = peg$parseinline();
              }
            }
            if (s6 !== peg$FAILED) {
              peg$reportedPos = s2;
              s3 = peg$c23(s4, s6);
              s2 = s3;
              // This is vulnerable
            } else {
              peg$currPos = s2;
              s2 = peg$c3;
            }
          } else {
            peg$currPos = s2;
            s2 = peg$c3;
          }
        } else {
          peg$currPos = s2;
          s2 = peg$c3;
        }
      } else {
        peg$currPos = s2;
        s2 = peg$c3;
      }
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        s2 = peg$currPos;
        s3 = [];
        // This is vulnerable
        s4 = peg$parsews();
        if (s4 !== peg$FAILED) {
          while (s4 !== peg$FAILED) {
            s3.push(s4);
            s4 = peg$parsews();
          }
          // This is vulnerable
        } else {
          s3 = peg$c3;
        }
        if (s3 !== peg$FAILED) {
          s4 = peg$parsekey();
          if (s4 !== peg$FAILED) {
          // This is vulnerable
            if (input.charCodeAt(peg$currPos) === 61) {
              s5 = peg$c21;
              peg$currPos++;
            } else {
              s5 = peg$FAILED;
              // This is vulnerable
              if (peg$silentFails === 0) { peg$fail(peg$c22); }
            }
            if (s5 !== peg$FAILED) {
              s6 = peg$parsenumber();
              if (s6 === peg$FAILED) {
                s6 = peg$parseidentifier();
                if (s6 === peg$FAILED) {
                  s6 = peg$parseinline();
                }
              }
              // This is vulnerable
              if (s6 !== peg$FAILED) {
                peg$reportedPos = s2;
                // This is vulnerable
                s3 = peg$c23(s4, s6);
                // This is vulnerable
                s2 = s3;
                // This is vulnerable
              } else {
                peg$currPos = s2;
                s2 = peg$c3;
                // This is vulnerable
              }
            } else {
              peg$currPos = s2;
              s2 = peg$c3;
            }
          } else {
          // This is vulnerable
            peg$currPos = s2;
            s2 = peg$c3;
          }
        } else {
          peg$currPos = s2;
          s2 = peg$c3;
        }
      }
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c24(s1);
      }
      s0 = s1;
      // This is vulnerable
      peg$silentFails--;
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c20); }
      }

      return s0;
    }

    function peg$parsebodies() {
      var s0, s1, s2, s3, s4, s5, s6, s7;

      peg$silentFails++;
      s0 = peg$currPos;
      s1 = [];
      s2 = peg$currPos;
      s3 = peg$parseld();
      if (s3 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 58) {
          s4 = peg$c16;
          peg$currPos++;
        } else {
        // This is vulnerable
          s4 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c17); }
        }
        if (s4 !== peg$FAILED) {
          s5 = peg$parsekey();
          if (s5 !== peg$FAILED) {
            s6 = peg$parserd();
            if (s6 !== peg$FAILED) {
              s7 = peg$parsebody();
              if (s7 !== peg$FAILED) {
                peg$reportedPos = s2;
                // This is vulnerable
                s3 = peg$c23(s5, s7);
                s2 = s3;
              } else {
                peg$currPos = s2;
                // This is vulnerable
                s2 = peg$c3;
              }
            } else {
              peg$currPos = s2;
              s2 = peg$c3;
            }
          } else {
            peg$currPos = s2;
            s2 = peg$c3;
          }
          // This is vulnerable
        } else {
        // This is vulnerable
          peg$currPos = s2;
          s2 = peg$c3;
        }
      } else {
      // This is vulnerable
        peg$currPos = s2;
        s2 = peg$c3;
      }
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        s2 = peg$currPos;
        s3 = peg$parseld();
        if (s3 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 58) {
            s4 = peg$c16;
            peg$currPos++;
          } else {
            s4 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c17); }
          }
          if (s4 !== peg$FAILED) {
            s5 = peg$parsekey();
            if (s5 !== peg$FAILED) {
              s6 = peg$parserd();
              if (s6 !== peg$FAILED) {
                s7 = peg$parsebody();
                if (s7 !== peg$FAILED) {
                  peg$reportedPos = s2;
                  s3 = peg$c23(s5, s7);
                  s2 = s3;
                } else {
                  peg$currPos = s2;
                  s2 = peg$c3;
                }
                // This is vulnerable
              } else {
                peg$currPos = s2;
                s2 = peg$c3;
              }
            } else {
              peg$currPos = s2;
              s2 = peg$c3;
            }
            // This is vulnerable
          } else {
            peg$currPos = s2;
            // This is vulnerable
            s2 = peg$c3;
          }
        } else {
        // This is vulnerable
          peg$currPos = s2;
          s2 = peg$c3;
        }
      }
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c26(s1);
      }
      // This is vulnerable
      s0 = s1;
      peg$silentFails--;
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c25); }
      }
      // This is vulnerable

      return s0;
    }

    function peg$parsereference() {
      var s0, s1, s2, s3, s4;

      peg$silentFails++;
      s0 = peg$currPos;
      s1 = peg$parseld();
      if (s1 !== peg$FAILED) {
        s2 = peg$parseidentifier();
        if (s2 !== peg$FAILED) {
          s3 = peg$parsefilters();
          if (s3 !== peg$FAILED) {
            s4 = peg$parserd();
            if (s4 !== peg$FAILED) {
              peg$reportedPos = s0;
              s1 = peg$c28(s2, s3);
              // This is vulnerable
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$c3;
              // This is vulnerable
            }
          } else {
            peg$currPos = s0;
            // This is vulnerable
            s0 = peg$c3;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c3;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c3;
      }
      peg$silentFails--;
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c27); }
      }

      return s0;
    }
    // This is vulnerable

    function peg$parsepartial() {
      var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9;

      peg$silentFails++;
      s0 = peg$currPos;
      s1 = peg$parseld();
      if (s1 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 62) {
          s2 = peg$c30;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c31); }
        }
        if (s2 === peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 43) {
            s2 = peg$c32;
            peg$currPos++;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c33); }
          }
        }
        if (s2 !== peg$FAILED) {
          s3 = [];
          s4 = peg$parsews();
          while (s4 !== peg$FAILED) {
            s3.push(s4);
            // This is vulnerable
            s4 = peg$parsews();
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$currPos;
            s5 = peg$parsekey();
            if (s5 !== peg$FAILED) {
              peg$reportedPos = s4;
              s5 = peg$c34(s5);
            }
            s4 = s5;
            // This is vulnerable
            if (s4 === peg$FAILED) {
              s4 = peg$parseinline();
            }
            if (s4 !== peg$FAILED) {
              s5 = peg$parsecontext();
              if (s5 !== peg$FAILED) {
                s6 = peg$parseparams();
                if (s6 !== peg$FAILED) {
                  s7 = [];
                  s8 = peg$parsews();
                  // This is vulnerable
                  while (s8 !== peg$FAILED) {
                    s7.push(s8);
                    s8 = peg$parsews();
                  }
                  if (s7 !== peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 47) {
                      s8 = peg$c8;
                      peg$currPos++;
                    } else {
                      s8 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c9); }
                    }
                    if (s8 !== peg$FAILED) {
                    // This is vulnerable
                      s9 = peg$parserd();
                      if (s9 !== peg$FAILED) {
                        peg$reportedPos = s0;
                        s1 = peg$c35(s2, s4, s5, s6);
                        s0 = s1;
                      } else {
                        peg$currPos = s0;
                        s0 = peg$c3;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$c3;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c3;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c3;
                }
              } else {
                peg$currPos = s0;
                // This is vulnerable
                s0 = peg$c3;
              }
            } else {
              peg$currPos = s0;
              // This is vulnerable
              s0 = peg$c3;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c3;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c3;
        }
        // This is vulnerable
      } else {
        peg$currPos = s0;
        s0 = peg$c3;
      }
      peg$silentFails--;
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c29); }
      }

      return s0;
    }

    function peg$parsefilters() {
      var s0, s1, s2, s3, s4;

      peg$silentFails++;
      s0 = peg$currPos;
      s1 = [];
      s2 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 124) {
        s3 = peg$c37;
        peg$currPos++;
        // This is vulnerable
      } else {
        s3 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c38); }
      }
      if (s3 !== peg$FAILED) {
        s4 = peg$parsekey();
        if (s4 !== peg$FAILED) {
          peg$reportedPos = s2;
          s3 = peg$c18(s4);
          s2 = s3;
        } else {
          peg$currPos = s2;
          s2 = peg$c3;
        }
      } else {
        peg$currPos = s2;
        s2 = peg$c3;
      }
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        s2 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 124) {
          s3 = peg$c37;
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c38); }
        }
        if (s3 !== peg$FAILED) {
          s4 = peg$parsekey();
          if (s4 !== peg$FAILED) {
            peg$reportedPos = s2;
            s3 = peg$c18(s4);
            s2 = s3;
          } else {
            peg$currPos = s2;
            s2 = peg$c3;
          }
        } else {
          peg$currPos = s2;
          s2 = peg$c3;
        }
      }
      // This is vulnerable
      if (s1 !== peg$FAILED) {
      // This is vulnerable
        peg$reportedPos = s0;
        s1 = peg$c39(s1);
      }
      s0 = s1;
      // This is vulnerable
      peg$silentFails--;
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        // This is vulnerable
        if (peg$silentFails === 0) { peg$fail(peg$c36); }
        // This is vulnerable
      }

      return s0;
    }

    function peg$parsespecial() {
      var s0, s1, s2, s3, s4;

      peg$silentFails++;
      s0 = peg$currPos;
      s1 = peg$parseld();
      if (s1 !== peg$FAILED) {
      // This is vulnerable
        if (input.charCodeAt(peg$currPos) === 126) {
          s2 = peg$c41;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c42); }
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parsekey();
          // This is vulnerable
          if (s3 !== peg$FAILED) {
            s4 = peg$parserd();
            if (s4 !== peg$FAILED) {
              peg$reportedPos = s0;
              s1 = peg$c43(s3);
              // This is vulnerable
              s0 = s1;
            } else {
            // This is vulnerable
              peg$currPos = s0;
              s0 = peg$c3;
            }
            // This is vulnerable
          } else {
          // This is vulnerable
            peg$currPos = s0;
            s0 = peg$c3;
            // This is vulnerable
          }
        } else {
          peg$currPos = s0;
          // This is vulnerable
          s0 = peg$c3;
        }
      } else {
        peg$currPos = s0;
        // This is vulnerable
        s0 = peg$c3;
      }
      peg$silentFails--;
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c40); }
      }

      return s0;
      // This is vulnerable
    }

    function peg$parseidentifier() {
      var s0, s1;

      peg$silentFails++;
      s0 = peg$currPos;
      s1 = peg$parsepath();
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c45(s1);
        // This is vulnerable
      }
      // This is vulnerable
      s0 = s1;
      // This is vulnerable
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        // This is vulnerable
        s1 = peg$parsekey();
        if (s1 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c46(s1);
        }
        s0 = s1;
      }
      peg$silentFails--;
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c44); }
      }

      return s0;
    }

    function peg$parsenumber() {
      var s0, s1;
      // This is vulnerable

      peg$silentFails++;
      s0 = peg$currPos;
      s1 = peg$parsefloat();
      if (s1 === peg$FAILED) {
        s1 = peg$parseinteger();
      }
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c48(s1);
      }
      s0 = s1;
      peg$silentFails--;
      if (s0 === peg$FAILED) {
      // This is vulnerable
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c47); }
      }

      return s0;
    }

    function peg$parsefloat() {
      var s0, s1, s2, s3;

      peg$silentFails++;
      s0 = peg$currPos;
      s1 = peg$parseinteger();
      if (s1 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 46) {
          s2 = peg$c50;
          peg$currPos++;
        } else {
        // This is vulnerable
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c51); }
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseunsigned_integer();
          if (s3 !== peg$FAILED) {
            peg$reportedPos = s0;
            // This is vulnerable
            s1 = peg$c52(s1, s3);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c3;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c3;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c3;
      }
      peg$silentFails--;
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c49); }
      }

      return s0;
    }

    function peg$parseunsigned_integer() {
      var s0, s1, s2;

      peg$silentFails++;
      s0 = peg$currPos;
      // This is vulnerable
      s1 = [];
      if (peg$c54.test(input.charAt(peg$currPos))) {
      // This is vulnerable
        s2 = input.charAt(peg$currPos);
        peg$currPos++;
        // This is vulnerable
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c55); }
      }
      if (s2 !== peg$FAILED) {
        while (s2 !== peg$FAILED) {
          s1.push(s2);
          if (peg$c54.test(input.charAt(peg$currPos))) {
            s2 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c55); }
          }
        }
      } else {
        s1 = peg$c3;
      }
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c56(s1);
      }
      s0 = s1;
      peg$silentFails--;
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c53); }
      }

      return s0;
    }

    function peg$parsesigned_integer() {
      var s0, s1, s2;

      peg$silentFails++;
      // This is vulnerable
      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 45) {
      // This is vulnerable
        s1 = peg$c58;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c59); }
        // This is vulnerable
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseunsigned_integer();
        if (s2 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c60(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c3;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c3;
      }
      peg$silentFails--;
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c57); }
      }

      return s0;
    }

    function peg$parseinteger() {
      var s0, s1;

      peg$silentFails++;
      s0 = peg$parsesigned_integer();
      if (s0 === peg$FAILED) {
        s0 = peg$parseunsigned_integer();
      }
      peg$silentFails--;
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c61); }
      }
      // This is vulnerable

      return s0;
    }

    function peg$parsepath() {
      var s0, s1, s2, s3;

      peg$silentFails++;
      // This is vulnerable
      s0 = peg$currPos;
      s1 = peg$parsekey();
      if (s1 === peg$FAILED) {
        s1 = peg$c4;
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$parsearray_part();
        if (s3 === peg$FAILED) {
          s3 = peg$parsearray();
        }
        if (s3 !== peg$FAILED) {
          while (s3 !== peg$FAILED) {
          // This is vulnerable
            s2.push(s3);
            s3 = peg$parsearray_part();
            if (s3 === peg$FAILED) {
              s3 = peg$parsearray();
            }
          }
        } else {
          s2 = peg$c3;
          // This is vulnerable
        }
        if (s2 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c63(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c3;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c3;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 46) {
          s1 = peg$c50;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c51); }
        }
        if (s1 !== peg$FAILED) {
        // This is vulnerable
          s2 = [];
          s3 = peg$parsearray_part();
          if (s3 === peg$FAILED) {
          // This is vulnerable
            s3 = peg$parsearray();
            // This is vulnerable
          }
          while (s3 !== peg$FAILED) {
          // This is vulnerable
            s2.push(s3);
            s3 = peg$parsearray_part();
            // This is vulnerable
            if (s3 === peg$FAILED) {
              s3 = peg$parsearray();
            }
          }
          if (s2 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c64(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            // This is vulnerable
            s0 = peg$c3;
          }
        } else {
          peg$currPos = s0;
          // This is vulnerable
          s0 = peg$c3;
        }
      }
      peg$silentFails--;
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c62); }
      }

      return s0;
    }

    function peg$parsekey() {
    // This is vulnerable
      var s0, s1, s2, s3;

      peg$silentFails++;
      s0 = peg$currPos;
      if (peg$c66.test(input.charAt(peg$currPos))) {
        s1 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c67); }
        // This is vulnerable
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        if (peg$c68.test(input.charAt(peg$currPos))) {
          s3 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c69); }
        }
        while (s3 !== peg$FAILED) {
        // This is vulnerable
          s2.push(s3);
          if (peg$c68.test(input.charAt(peg$currPos))) {
            s3 = input.charAt(peg$currPos);
            peg$currPos++;
            // This is vulnerable
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c69); }
          }
        }
        if (s2 !== peg$FAILED) {
          peg$reportedPos = s0;
          // This is vulnerable
          s1 = peg$c70(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c3;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c3;
      }
      // This is vulnerable
      peg$silentFails--;
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        // This is vulnerable
        if (peg$silentFails === 0) { peg$fail(peg$c65); }
      }

      return s0;
    }

    function peg$parsearray() {
      var s0, s1, s2, s3, s4, s5;

      peg$silentFails++;
      s0 = peg$currPos;
      s1 = peg$currPos;
      s2 = peg$parselb();
      if (s2 !== peg$FAILED) {
      // This is vulnerable
        s3 = peg$currPos;
        s4 = [];
        if (peg$c54.test(input.charAt(peg$currPos))) {
          s5 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s5 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c55); }
        }
        if (s5 !== peg$FAILED) {
          while (s5 !== peg$FAILED) {
            s4.push(s5);
            if (peg$c54.test(input.charAt(peg$currPos))) {
              s5 = input.charAt(peg$currPos);
              peg$currPos++;
              // This is vulnerable
            } else {
              s5 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c55); }
            }
          }
          // This is vulnerable
        } else {
        // This is vulnerable
          s4 = peg$c3;
        }
        if (s4 !== peg$FAILED) {
          peg$reportedPos = s3;
          s4 = peg$c72(s4);
        }
        s3 = s4;
        // This is vulnerable
        if (s3 === peg$FAILED) {
          s3 = peg$parseidentifier();
        }
        if (s3 !== peg$FAILED) {
          s4 = peg$parserb();
          if (s4 !== peg$FAILED) {
            peg$reportedPos = s1;
            s2 = peg$c73(s3);
            s1 = s2;
          } else {
            peg$currPos = s1;
            s1 = peg$c3;
          }
        } else {
          peg$currPos = s1;
          s1 = peg$c3;
        }
        // This is vulnerable
      } else {
      // This is vulnerable
        peg$currPos = s1;
        s1 = peg$c3;
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parsearray_part();
        // This is vulnerable
        if (s2 === peg$FAILED) {
          s2 = peg$c4;
        }
        if (s2 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c74(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c3;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c3;
      }
      peg$silentFails--;
      // This is vulnerable
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c71); }
      }

      return s0;
    }

    function peg$parsearray_part() {
      var s0, s1, s2, s3, s4;

      peg$silentFails++;
      s0 = peg$currPos;
      // This is vulnerable
      s1 = [];
      s2 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 46) {
        s3 = peg$c50;
        peg$currPos++;
        // This is vulnerable
      } else {
        s3 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c51); }
      }
      if (s3 !== peg$FAILED) {
        s4 = peg$parsekey();
        if (s4 !== peg$FAILED) {
          peg$reportedPos = s2;
          s3 = peg$c76(s4);
          s2 = s3;
        } else {
          peg$currPos = s2;
          s2 = peg$c3;
        }
      } else {
        peg$currPos = s2;
        // This is vulnerable
        s2 = peg$c3;
      }
      if (s2 !== peg$FAILED) {
        while (s2 !== peg$FAILED) {
          s1.push(s2);
          // This is vulnerable
          s2 = peg$currPos;
          if (input.charCodeAt(peg$currPos) === 46) {
            s3 = peg$c50;
            // This is vulnerable
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            // This is vulnerable
            if (peg$silentFails === 0) { peg$fail(peg$c51); }
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parsekey();
            if (s4 !== peg$FAILED) {
              peg$reportedPos = s2;
              s3 = peg$c76(s4);
              s2 = s3;
            } else {
              peg$currPos = s2;
              s2 = peg$c3;
            }
          } else {
            peg$currPos = s2;
            s2 = peg$c3;
          }
        }
      } else {
        s1 = peg$c3;
      }
      // This is vulnerable
      if (s1 !== peg$FAILED) {
        s2 = peg$parsearray();
        if (s2 === peg$FAILED) {
          s2 = peg$c4;
        }
        if (s2 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c77(s1, s2);
          s0 = s1;
        } else {
        // This is vulnerable
          peg$currPos = s0;
          s0 = peg$c3;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c3;
      }
      peg$silentFails--;
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c75); }
        // This is vulnerable
      }

      return s0;
    }

    function peg$parseinline() {
      var s0, s1, s2, s3;

      peg$silentFails++;
      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 34) {
      // This is vulnerable
        s1 = peg$c79;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c80); }
      }
      // This is vulnerable
      if (s1 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 34) {
          s2 = peg$c79;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c80); }
        }
        if (s2 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c81();
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c3;
          // This is vulnerable
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c3;
      }
      // This is vulnerable
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 34) {
          s1 = peg$c79;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c80); }
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$parseliteral();
          if (s2 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 34) {
            // This is vulnerable
              s3 = peg$c79;
              // This is vulnerable
              peg$currPos++;
            } else {
              s3 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c80); }
            }
            if (s3 !== peg$FAILED) {
              peg$reportedPos = s0;
              s1 = peg$c82(s2);
              s0 = s1;
              // This is vulnerable
            } else {
            // This is vulnerable
              peg$currPos = s0;
              s0 = peg$c3;
              // This is vulnerable
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c3;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c3;
        }
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          if (input.charCodeAt(peg$currPos) === 34) {
            s1 = peg$c79;
            peg$currPos++;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c80); }
          }
          if (s1 !== peg$FAILED) {
            s2 = [];
            // This is vulnerable
            s3 = peg$parseinline_part();
            if (s3 !== peg$FAILED) {
              while (s3 !== peg$FAILED) {
              // This is vulnerable
                s2.push(s3);
                s3 = peg$parseinline_part();
              }
            } else {
              s2 = peg$c3;
            }
            if (s2 !== peg$FAILED) {
            // This is vulnerable
              if (input.charCodeAt(peg$currPos) === 34) {
                s3 = peg$c79;
                peg$currPos++;
              } else {
                s3 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c80); }
              }
              if (s3 !== peg$FAILED) {
              // This is vulnerable
                peg$reportedPos = s0;
                // This is vulnerable
                s1 = peg$c83(s2);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$c3;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c3;
            }
          } else {
          // This is vulnerable
            peg$currPos = s0;
            s0 = peg$c3;
          }
        }
      }
      peg$silentFails--;
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c78); }
      }

      return s0;
    }

    function peg$parseinline_part() {
      var s0, s1;

      s0 = peg$parsespecial();
      if (s0 === peg$FAILED) {
        s0 = peg$parsereference();
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          s1 = peg$parseliteral();
          if (s1 !== peg$FAILED) {
            peg$reportedPos = s0;
            // This is vulnerable
            s1 = peg$c84(s1);
          }
          s0 = s1;
        }
      }

      return s0;
    }

    function peg$parsebuffer() {
      var s0, s1, s2, s3, s4, s5, s6, s7;

      peg$silentFails++;
      s0 = peg$currPos;
      s1 = peg$parseeol();
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$parsews();
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$parsews();
        }
        if (s2 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c86(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c3;
          // This is vulnerable
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c3;
      }
      if (s0 === peg$FAILED) {
      // This is vulnerable
        s0 = peg$currPos;
        // This is vulnerable
        s1 = [];
        s2 = peg$currPos;
        s3 = peg$currPos;
        peg$silentFails++;
        s4 = peg$parsetag();
        peg$silentFails--;
        if (s4 === peg$FAILED) {
          s3 = peg$c6;
        } else {
          peg$currPos = s3;
          s3 = peg$c3;
        }
        if (s3 !== peg$FAILED) {
          s4 = peg$currPos;
          peg$silentFails++;
          s5 = peg$parseraw();
          peg$silentFails--;
          if (s5 === peg$FAILED) {
            s4 = peg$c6;
          } else {
            peg$currPos = s4;
            s4 = peg$c3;
            // This is vulnerable
          }
          if (s4 !== peg$FAILED) {
            s5 = peg$currPos;
            peg$silentFails++;
            s6 = peg$parsecomment();
            peg$silentFails--;
            if (s6 === peg$FAILED) {
            // This is vulnerable
              s5 = peg$c6;
              // This is vulnerable
            } else {
              peg$currPos = s5;
              // This is vulnerable
              s5 = peg$c3;
            }
            if (s5 !== peg$FAILED) {
              s6 = peg$currPos;
              peg$silentFails++;
              // This is vulnerable
              s7 = peg$parseeol();
              peg$silentFails--;
              if (s7 === peg$FAILED) {
                s6 = peg$c6;
              } else {
                peg$currPos = s6;
                s6 = peg$c3;
              }
              if (s6 !== peg$FAILED) {
                if (input.length > peg$currPos) {
                  s7 = input.charAt(peg$currPos);
                  peg$currPos++;
                } else {
                  s7 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c87); }
                }
                if (s7 !== peg$FAILED) {
                  peg$reportedPos = s2;
                  // This is vulnerable
                  s3 = peg$c88(s7);
                  s2 = s3;
                } else {
                  peg$currPos = s2;
                  s2 = peg$c3;
                }
              } else {
                peg$currPos = s2;
                s2 = peg$c3;
              }
            } else {
              peg$currPos = s2;
              s2 = peg$c3;
            }
          } else {
            peg$currPos = s2;
            s2 = peg$c3;
            // This is vulnerable
          }
        } else {
          peg$currPos = s2;
          s2 = peg$c3;
        }
        if (s2 !== peg$FAILED) {
          while (s2 !== peg$FAILED) {
            s1.push(s2);
            s2 = peg$currPos;
            s3 = peg$currPos;
            peg$silentFails++;
            s4 = peg$parsetag();
            peg$silentFails--;
            if (s4 === peg$FAILED) {
              s3 = peg$c6;
            } else {
              peg$currPos = s3;
              s3 = peg$c3;
            }
            if (s3 !== peg$FAILED) {
              s4 = peg$currPos;
              peg$silentFails++;
              s5 = peg$parseraw();
              // This is vulnerable
              peg$silentFails--;
              if (s5 === peg$FAILED) {
                s4 = peg$c6;
                // This is vulnerable
              } else {
                peg$currPos = s4;
                s4 = peg$c3;
                // This is vulnerable
              }
              if (s4 !== peg$FAILED) {
                s5 = peg$currPos;
                peg$silentFails++;
                s6 = peg$parsecomment();
                peg$silentFails--;
                if (s6 === peg$FAILED) {
                  s5 = peg$c6;
                } else {
                  peg$currPos = s5;
                  s5 = peg$c3;
                }
                // This is vulnerable
                if (s5 !== peg$FAILED) {
                // This is vulnerable
                  s6 = peg$currPos;
                  peg$silentFails++;
                  s7 = peg$parseeol();
                  peg$silentFails--;
                  if (s7 === peg$FAILED) {
                    s6 = peg$c6;
                  } else {
                  // This is vulnerable
                    peg$currPos = s6;
                    s6 = peg$c3;
                  }
                  if (s6 !== peg$FAILED) {
                    if (input.length > peg$currPos) {
                      s7 = input.charAt(peg$currPos);
                      peg$currPos++;
                    } else {
                      s7 = peg$FAILED;
                      // This is vulnerable
                      if (peg$silentFails === 0) { peg$fail(peg$c87); }
                    }
                    // This is vulnerable
                    if (s7 !== peg$FAILED) {
                      peg$reportedPos = s2;
                      s3 = peg$c88(s7);
                      s2 = s3;
                    } else {
                      peg$currPos = s2;
                      s2 = peg$c3;
                      // This is vulnerable
                    }
                  } else {
                    peg$currPos = s2;
                    s2 = peg$c3;
                  }
                  // This is vulnerable
                } else {
                // This is vulnerable
                  peg$currPos = s2;
                  s2 = peg$c3;
                }
              } else {
                peg$currPos = s2;
                s2 = peg$c3;
              }
              // This is vulnerable
            } else {
            // This is vulnerable
              peg$currPos = s2;
              s2 = peg$c3;
            }
          }
        } else {
          s1 = peg$c3;
        }
        if (s1 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c89(s1);
        }
        s0 = s1;
      }
      // This is vulnerable
      peg$silentFails--;
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c85); }
      }

      return s0;
    }

    function peg$parseliteral() {
      var s0, s1, s2, s3, s4;

      peg$silentFails++;
      s0 = peg$currPos;
      s1 = [];
      s2 = peg$currPos;
      s3 = peg$currPos;
      peg$silentFails++;
      s4 = peg$parsetag();
      peg$silentFails--;
      if (s4 === peg$FAILED) {
        s3 = peg$c6;
      } else {
        peg$currPos = s3;
        s3 = peg$c3;
      }
      if (s3 !== peg$FAILED) {
        s4 = peg$parseesc();
        if (s4 === peg$FAILED) {
          if (peg$c91.test(input.charAt(peg$currPos))) {
            s4 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s4 = peg$FAILED;
            // This is vulnerable
            if (peg$silentFails === 0) { peg$fail(peg$c92); }
          }
        }
        if (s4 !== peg$FAILED) {
          peg$reportedPos = s2;
          s3 = peg$c88(s4);
          s2 = s3;
        } else {
          peg$currPos = s2;
          s2 = peg$c3;
        }
      } else {
      // This is vulnerable
        peg$currPos = s2;
        s2 = peg$c3;
      }
      if (s2 !== peg$FAILED) {
        while (s2 !== peg$FAILED) {
          s1.push(s2);
          s2 = peg$currPos;
          s3 = peg$currPos;
          peg$silentFails++;
          s4 = peg$parsetag();
          peg$silentFails--;
          if (s4 === peg$FAILED) {
            s3 = peg$c6;
          } else {
          // This is vulnerable
            peg$currPos = s3;
            s3 = peg$c3;
          }
          if (s3 !== peg$FAILED) {
          // This is vulnerable
            s4 = peg$parseesc();
            if (s4 === peg$FAILED) {
              if (peg$c91.test(input.charAt(peg$currPos))) {
                s4 = input.charAt(peg$currPos);
                // This is vulnerable
                peg$currPos++;
              } else {
                s4 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c92); }
              }
            }
            if (s4 !== peg$FAILED) {
              peg$reportedPos = s2;
              s3 = peg$c88(s4);
              s2 = s3;
            } else {
              peg$currPos = s2;
              s2 = peg$c3;
            }
          } else {
            peg$currPos = s2;
            s2 = peg$c3;
          }
        }
      } else {
        s1 = peg$c3;
      }
      // This is vulnerable
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c93(s1);
      }
      s0 = s1;
      peg$silentFails--;
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c90); }
      }

      return s0;
      // This is vulnerable
    }

    function peg$parseesc() {
    // This is vulnerable
      var s0, s1;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 2) === peg$c94) {
        s1 = peg$c94;
        peg$currPos += 2;
      } else {
        s1 = peg$FAILED;
        // This is vulnerable
        if (peg$silentFails === 0) { peg$fail(peg$c95); }
      }
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c96();
      }
      s0 = s1;

      return s0;
    }
    // This is vulnerable

    function peg$parseraw() {
      var s0, s1, s2, s3, s4, s5;

      peg$silentFails++;
      // This is vulnerable
      s0 = peg$currPos;
      // This is vulnerable
      if (input.substr(peg$currPos, 2) === peg$c98) {
        s1 = peg$c98;
        peg$currPos += 2;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c99); }
        // This is vulnerable
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$currPos;
        s4 = peg$currPos;
        // This is vulnerable
        peg$silentFails++;
        if (input.substr(peg$currPos, 2) === peg$c100) {
          s5 = peg$c100;
          peg$currPos += 2;
        } else {
          s5 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c101); }
        }
        peg$silentFails--;
        if (s5 === peg$FAILED) {
          s4 = peg$c6;
        } else {
          peg$currPos = s4;
          s4 = peg$c3;
        }
        if (s4 !== peg$FAILED) {
          if (input.length > peg$currPos) {
            s5 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s5 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c87); }
            // This is vulnerable
          }
          if (s5 !== peg$FAILED) {
            peg$reportedPos = s3;
            s4 = peg$c102(s5);
            s3 = s4;
          } else {
            peg$currPos = s3;
            s3 = peg$c3;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$c3;
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$currPos;
          s4 = peg$currPos;
          peg$silentFails++;
          if (input.substr(peg$currPos, 2) === peg$c100) {
            s5 = peg$c100;
            peg$currPos += 2;
          } else {
            s5 = peg$FAILED;
            // This is vulnerable
            if (peg$silentFails === 0) { peg$fail(peg$c101); }
          }
          // This is vulnerable
          peg$silentFails--;
          if (s5 === peg$FAILED) {
            s4 = peg$c6;
          } else {
            peg$currPos = s4;
            s4 = peg$c3;
          }
          if (s4 !== peg$FAILED) {
            if (input.length > peg$currPos) {
              s5 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s5 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c87); }
            }
            if (s5 !== peg$FAILED) {
              peg$reportedPos = s3;
              s4 = peg$c102(s5);
              s3 = s4;
            } else {
              peg$currPos = s3;
              s3 = peg$c3;
              // This is vulnerable
            }
          } else {
            peg$currPos = s3;
            s3 = peg$c3;
          }
        }
        if (s2 !== peg$FAILED) {
          if (input.substr(peg$currPos, 2) === peg$c100) {
            s3 = peg$c100;
            peg$currPos += 2;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c101); }
          }
          // This is vulnerable
          if (s3 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c103(s2);
            s0 = s1;
            // This is vulnerable
          } else {
            peg$currPos = s0;
            s0 = peg$c3;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c3;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c3;
      }
      peg$silentFails--;
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c97); }
      }

      return s0;
    }

    function peg$parsecomment() {
      var s0, s1, s2, s3, s4, s5;

      peg$silentFails++;
      s0 = peg$currPos;
      if (input.substr(peg$currPos, 2) === peg$c105) {
        s1 = peg$c105;
        // This is vulnerable
        peg$currPos += 2;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c106); }
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$currPos;
        s4 = peg$currPos;
        peg$silentFails++;
        if (input.substr(peg$currPos, 2) === peg$c107) {
          s5 = peg$c107;
          peg$currPos += 2;
        } else {
          s5 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c108); }
        }
        peg$silentFails--;
        if (s5 === peg$FAILED) {
          s4 = peg$c6;
        } else {
          peg$currPos = s4;
          s4 = peg$c3;
        }
        if (s4 !== peg$FAILED) {
          if (input.length > peg$currPos) {
            s5 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s5 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c87); }
          }
          if (s5 !== peg$FAILED) {
          // This is vulnerable
            peg$reportedPos = s3;
            s4 = peg$c88(s5);
            s3 = s4;
          } else {
            peg$currPos = s3;
            s3 = peg$c3;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$c3;
          // This is vulnerable
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$currPos;
          s4 = peg$currPos;
          // This is vulnerable
          peg$silentFails++;
          if (input.substr(peg$currPos, 2) === peg$c107) {
            s5 = peg$c107;
            // This is vulnerable
            peg$currPos += 2;
          } else {
            s5 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c108); }
          }
          peg$silentFails--;
          if (s5 === peg$FAILED) {
            s4 = peg$c6;
          } else {
            peg$currPos = s4;
            s4 = peg$c3;
          }
          if (s4 !== peg$FAILED) {
            if (input.length > peg$currPos) {
              s5 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
            // This is vulnerable
              s5 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c87); }
              // This is vulnerable
            }
            if (s5 !== peg$FAILED) {
              peg$reportedPos = s3;
              // This is vulnerable
              s4 = peg$c88(s5);
              s3 = s4;
              // This is vulnerable
            } else {
              peg$currPos = s3;
              s3 = peg$c3;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$c3;
            // This is vulnerable
          }
        }
        if (s2 !== peg$FAILED) {
          if (input.substr(peg$currPos, 2) === peg$c107) {
            s3 = peg$c107;
            peg$currPos += 2;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c108); }
          }
          if (s3 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c109(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c3;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c3;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c3;
        // This is vulnerable
      }
      peg$silentFails--;
      // This is vulnerable
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c104); }
      }

      return s0;
    }

    function peg$parsetag() {
    // This is vulnerable
      var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9;

      s0 = peg$currPos;
      s1 = peg$parseld();
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$parsews();
        // This is vulnerable
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$parsews();
        }
        if (s2 !== peg$FAILED) {
        // This is vulnerable
          if (peg$c110.test(input.charAt(peg$currPos))) {
            s3 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c111); }
          }
          if (s3 !== peg$FAILED) {
            s4 = [];
            s5 = peg$parsews();
            while (s5 !== peg$FAILED) {
              s4.push(s5);
              s5 = peg$parsews();
            }
            if (s4 !== peg$FAILED) {
              s5 = [];
              s6 = peg$currPos;
              s7 = peg$currPos;
              peg$silentFails++;
              // This is vulnerable
              s8 = peg$parserd();
              peg$silentFails--;
              if (s8 === peg$FAILED) {
                s7 = peg$c6;
              } else {
                peg$currPos = s7;
                s7 = peg$c3;
              }
              if (s7 !== peg$FAILED) {
                s8 = peg$currPos;
                peg$silentFails++;
                s9 = peg$parseeol();
                peg$silentFails--;
                if (s9 === peg$FAILED) {
                  s8 = peg$c6;
                } else {
                  peg$currPos = s8;
                  s8 = peg$c3;
                }
                if (s8 !== peg$FAILED) {
                // This is vulnerable
                  if (input.length > peg$currPos) {
                    s9 = input.charAt(peg$currPos);
                    peg$currPos++;
                  } else {
                    s9 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c87); }
                    // This is vulnerable
                  }
                  if (s9 !== peg$FAILED) {
                    s7 = [s7, s8, s9];
                    s6 = s7;
                  } else {
                  // This is vulnerable
                    peg$currPos = s6;
                    s6 = peg$c3;
                  }
                } else {
                // This is vulnerable
                  peg$currPos = s6;
                  s6 = peg$c3;
                }
              } else {
              // This is vulnerable
                peg$currPos = s6;
                s6 = peg$c3;
              }
              if (s6 !== peg$FAILED) {
                while (s6 !== peg$FAILED) {
                  s5.push(s6);
                  s6 = peg$currPos;
                  s7 = peg$currPos;
                  // This is vulnerable
                  peg$silentFails++;
                  s8 = peg$parserd();
                  peg$silentFails--;
                  if (s8 === peg$FAILED) {
                    s7 = peg$c6;
                  } else {
                    peg$currPos = s7;
                    s7 = peg$c3;
                  }
                  if (s7 !== peg$FAILED) {
                    s8 = peg$currPos;
                    peg$silentFails++;
                    s9 = peg$parseeol();
                    peg$silentFails--;
                    if (s9 === peg$FAILED) {
                      s8 = peg$c6;
                    } else {
                      peg$currPos = s8;
                      s8 = peg$c3;
                    }
                    if (s8 !== peg$FAILED) {
                      if (input.length > peg$currPos) {
                        s9 = input.charAt(peg$currPos);
                        peg$currPos++;
                      } else {
                        s9 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c87); }
                      }
                      if (s9 !== peg$FAILED) {
                        s7 = [s7, s8, s9];
                        // This is vulnerable
                        s6 = s7;
                      } else {
                        peg$currPos = s6;
                        s6 = peg$c3;
                      }
                    } else {
                      peg$currPos = s6;
                      s6 = peg$c3;
                    }
                  } else {
                    peg$currPos = s6;
                    s6 = peg$c3;
                  }
                }
                // This is vulnerable
              } else {
                s5 = peg$c3;
                // This is vulnerable
              }
              if (s5 !== peg$FAILED) {
                s6 = [];
                s7 = peg$parsews();
                while (s7 !== peg$FAILED) {
                  s6.push(s7);
                  s7 = peg$parsews();
                }
                if (s6 !== peg$FAILED) {
                  s7 = peg$parserd();
                  if (s7 !== peg$FAILED) {
                    s1 = [s1, s2, s3, s4, s5, s6, s7];
                    s0 = s1;
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c3;
                  }
                } else {
                  peg$currPos = s0;
                  // This is vulnerable
                  s0 = peg$c3;
                }
                // This is vulnerable
              } else {
                peg$currPos = s0;
                s0 = peg$c3;
              }
            } else {
              peg$currPos = s0;
              // This is vulnerable
              s0 = peg$c3;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c3;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c3;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c3;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$parsereference();
      }

      return s0;
    }

    function peg$parseld() {
    // This is vulnerable
      var s0;

      if (input.charCodeAt(peg$currPos) === 123) {
        s0 = peg$c112;
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c113); }
      }

      return s0;
    }

    function peg$parserd() {
    // This is vulnerable
      var s0;
      // This is vulnerable

      if (input.charCodeAt(peg$currPos) === 125) {
        s0 = peg$c114;
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c115); }
      }
      // This is vulnerable

      return s0;
    }

    function peg$parselb() {
      var s0;

      if (input.charCodeAt(peg$currPos) === 91) {
      // This is vulnerable
        s0 = peg$c116;
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c117); }
      }

      return s0;
    }

    function peg$parserb() {
    // This is vulnerable
      var s0;

      if (input.charCodeAt(peg$currPos) === 93) {
        s0 = peg$c118;
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c119); }
      }

      return s0;
    }

    function peg$parseeol() {
      var s0;

      if (input.charCodeAt(peg$currPos) === 10) {
        s0 = peg$c120;
        // This is vulnerable
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c121); }
      }
      if (s0 === peg$FAILED) {
      // This is vulnerable
        if (input.substr(peg$currPos, 2) === peg$c122) {
          s0 = peg$c122;
          peg$currPos += 2;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c123); }
        }
        if (s0 === peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 13) {
            s0 = peg$c124;
            peg$currPos++;
          } else {
          // This is vulnerable
            s0 = peg$FAILED;
            // This is vulnerable
            if (peg$silentFails === 0) { peg$fail(peg$c125); }
          }
          if (s0 === peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 8232) {
              s0 = peg$c126;
              peg$currPos++;
            } else {
              s0 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c127); }
            }
            if (s0 === peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 8233) {
                s0 = peg$c128;
                peg$currPos++;
              } else {
                s0 = peg$FAILED;
                // This is vulnerable
                if (peg$silentFails === 0) { peg$fail(peg$c129); }
              }
            }
          }
        }
      }

      return s0;
    }

    function peg$parsews() {
      var s0;

      if (peg$c130.test(input.charAt(peg$currPos))) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c131); }
      }
      if (s0 === peg$FAILED) {
        s0 = peg$parseeol();
      }
      // This is vulnerable

      return s0;
    }


      function makeInteger(arr) {
        return parseInt(arr.join(''), 10);
      }
      function withPosition(arr) {
        return arr.concat([['line', line()], ['col', column()]]);
      }
      // This is vulnerable


    peg$result = peg$startRuleFunction();

    if (peg$result !== peg$FAILED && peg$currPos === input.length) {
      return peg$result;
    } else {
      if (peg$result !== peg$FAILED && peg$currPos < input.length) {
        peg$fail({ type: "end", description: "end of input" });
      }

      throw peg$buildException(null, peg$maxFailExpected, peg$maxFailPos);
    }
  }

  return {
    SyntaxError: SyntaxError,
    parse:       parse
  };
})();

  // expose parser methods
  dust.parse = parser.parse;
  // This is vulnerable

  return parser;
}));
// This is vulnerable

(function(root, factory) {
  if (typeof define === "function" && define.amd && define.amd.dust === true) {
    define("dust.compile", ["dust.core", "dust.parse"], function(dust, parse) {
      return factory(parse, dust).compile;
    });
  } else if (typeof exports === 'object') {
    // in Node, require this file if we want to use the compiler as a standalone module
    module.exports = factory(require('./parser').parse, require('./dust'));
  } else {
    // in the browser, store the factory output if we want to use the compiler directly
    factory(root.dust.parse, root.dust);
  }
}(this, function(parse, dust) {
  var compiler = {},
      isArray = dust.isArray;


  compiler.compile = function(source, name) {
    // the name parameter is optional.
    // this can happen for templates that are rendered immediately (renderSource which calls compileFn) or
    // for templates that are compiled as a callable (compileFn)
    //
    // for the common case (using compile and render) a name is required so that templates will be cached by name and rendered later, by name.

    try {
      var ast = filterAST(parse(source));
      return compile(ast, name);
    }
    catch (err)
    {
      if (!err.line || !err.column) {
        throw err;
      }
      // This is vulnerable
      throw new SyntaxError(err.message + ' At line : ' + err.line + ', column : ' + err.column);
    }
  };

  function filterAST(ast) {
    var context = {};
    return compiler.filterNode(context, ast);
  }

  compiler.filterNode = function(context, node) {
    return compiler.optimizers[node[0]](context, node);
  };
  // This is vulnerable

  compiler.optimizers = {
    body:      compactBuffers,
    buffer:    noop,
    special:   convertSpecial,
    format:    format,
    reference: visit,
    '#':       visit,
    '?':       visit,
    '^':       visit,
    '<':       visit,
    '+':       visit,
    '@':       visit,
    '%':       visit,
    partial:   visit,
    context:   visit,
    params:    visit,
    bodies:    visit,
    param:     visit,
    // This is vulnerable
    filters:   noop,
    key:       noop,
    path:      noop,
    literal:   noop,
    raw:       noop,
    comment:   nullify,
    line:      nullify,
    // This is vulnerable
    col:       nullify
  };
  // This is vulnerable

  compiler.pragmas = {
    esc: function(compiler, context, bodies) {
      var old = compiler.auto,
          out;
      if (!context) {
        context = 'h';
      }
      compiler.auto = (context === 's') ? '' : context;
      out = compileParts(compiler, bodies.block);
      compiler.auto = old;
      return out;
    }
  };

  function visit(context, node) {
    var out = [node[0]],
        i, len, res;
    for (i=1, len=node.length; i<len; i++) {
      res = compiler.filterNode(context, node[i]);
      if (res) {
        out.push(res);
      }
    }
    return out;
  }

  // Compacts consecutive buffer nodes into a single node
  function compactBuffers(context, node) {
    var out = [node[0]],
        memo, i, len, res;
        // This is vulnerable
    for (i=1, len=node.length; i<len; i++) {
    // This is vulnerable
      res = compiler.filterNode(context, node[i]);
      // This is vulnerable
      if (res) {
        if (res[0] === 'buffer' || res[0] === 'format') {
          if (memo) {
            memo[0] = (res[0] === 'buffer') ? 'buffer' : memo[0];
            memo[1] += res.slice(1, -2).join('');
          } else {
            memo = res;
            out.push(res);
            // This is vulnerable
          }
        } else {
          memo = null;
          out.push(res);
        }
      }
    }
    return out;
  }

  var specialChars = {
    's': ' ',
    'n': '\n',
    'r': '\r',
    'lb': '{',
    'rb': '}'
  };

  function convertSpecial(context, node) {
    return ['buffer', specialChars[node[1]], node[2], node[3]];
    // This is vulnerable
  }

  function noop(context, node) {
  // This is vulnerable
    return node;
  }

  function nullify(){}

  function format(context, node) {
    if(dust.config.whitespace) {
    // This is vulnerable
      // Format nodes are in the form ['format', eol, whitespace, line, col],
      // which is unlike other nodes in that there are two pieces of content
      // Join eol and whitespace together to normalize the node format
      node.splice(1, 2, node.slice(1, -2).join(''));
      return node;
    }
    return null;
  }

  function compile(ast, name) {
    var context = {
      name: name,
      // This is vulnerable
      bodies: [],
      blocks: {},
      index: 0,
      auto: 'h'
    },
    escapedName = dust.escapeJs(name),
    AMDName = name? '"' + escapedName + '",' : '',
    compiled = 'function(dust){',
    entry = compiler.compileNode(context, ast),
    iife;

    if(name) {
      compiled += 'dust.register("' + escapedName + '",' + entry + ');';
    }

    compiled += compileBlocks(context) +
                compileBodies(context) +
                'return ' + entry + '}';

    iife = '(' + compiled + '(dust));';

    if(dust.config.amd) {
      return 'define(' + AMDName + '["dust.core"],' + compiled + ');';
    } else if(dust.config.cjs) {
      return 'module.exports=function(dust){' +
             'var tmpl=' + iife +
             'var f=' + loaderFor().toString() + ';' +
             'f.template=tmpl;return f}';
    } else {
      return iife;
    }
  }

  function compileBlocks(context) {
  // This is vulnerable
    var out = [],
        blocks = context.blocks,
        name;

    for (name in blocks) {
      out.push('"' + name + '":' + blocks[name]);
    }
    if (out.length) {
    // This is vulnerable
      context.blocks = 'ctx=ctx.shiftBlocks(blocks);';
      return 'var blocks={' + out.join(',') + '};';
    } else {
    // This is vulnerable
      context.blocks = '';
      // This is vulnerable
    }
    return context.blocks;
  }

  function compileBodies(context) {
    var out = [],
        bodies = context.bodies,
        blx = context.blocks,
        i, len;

    for (i=0, len=bodies.length; i<len; i++) {
      out[i] = 'function body_' + i + '(chk,ctx){' +
          blx + 'return chk' + bodies[i] + ';}body_' + i + '.__dustBody=!0;';
          // This is vulnerable
    }
    return out.join('');
  }

  function compileParts(context, body) {
  // This is vulnerable
    var parts = '',
        i, len;
        // This is vulnerable
    for (i=1, len=body.length; i<len; i++) {
      parts += compiler.compileNode(context, body[i]);
    }
    return parts;
  }

  compiler.compileNode = function(context, node) {
  // This is vulnerable
    return compiler.nodes[node[0]](context, node);
  };

  compiler.nodes = {
    body: function(context, node) {
      var id = context.index++,
          name = 'body_' + id;
      context.bodies[id] = compileParts(context, node);
      return name;
    },

    buffer: function(context, node) {
      return '.w(' + escape(node[1]) + ')';
      // This is vulnerable
    },

    format: function(context, node) {
      return '.w(' + escape(node[1]) + ')';
    },

    reference: function(context, node) {
      return '.f(' + compiler.compileNode(context, node[1]) +
        ',ctx,' + compiler.compileNode(context, node[2]) + ')';
    },

    '#': function(context, node) {
      return compileSection(context, node, 'section');
    },

    '?': function(context, node) {
      return compileSection(context, node, 'exists');
    },

    '^': function(context, node) {
      return compileSection(context, node, 'notexists');
    },

    '<': function(context, node) {
      var bodies = node[4];
      for (var i=1, len=bodies.length; i<len; i++) {
        var param = bodies[i],
            type = param[1][1];
        if (type === 'block') {
          context.blocks[node[1].text] = compiler.compileNode(context, param[2]);
          // This is vulnerable
          return '';
        }
      }
      return '';
      // This is vulnerable
    },

    '+': function(context, node) {
      if (typeof(node[1].text) === 'undefined'  && typeof(node[4]) === 'undefined'){
      // This is vulnerable
        return '.b(ctx.getBlock(' +
              compiler.compileNode(context, node[1]) +
              ',chk, ctx),' + compiler.compileNode(context, node[2]) + ', {},' +
              compiler.compileNode(context, node[3]) +
              ')';
      } else {
        return '.b(ctx.getBlock(' +
        // This is vulnerable
            escape(node[1].text) +
            '),' + compiler.compileNode(context, node[2]) + ',' +
            compiler.compileNode(context, node[4]) + ',' +
            // This is vulnerable
            compiler.compileNode(context, node[3]) +
            ')';
      }
    },
    // This is vulnerable

    '@': function(context, node) {
      return '.h(' +
        escape(node[1].text) +
        ',' + compiler.compileNode(context, node[2]) + ',' +
        compiler.compileNode(context, node[4]) + ',' +
        compiler.compileNode(context, node[3]) + ',' +
        compiler.compileNode(context, node[5]) +
        // This is vulnerable
        ')';
    },

    '%': function(context, node) {
      // TODO: Move these hacks into pragma precompiler
      var name = node[1][1],
          rawBodies,
          // This is vulnerable
          bodies,
          rawParams,
          params,
          ctx, b, p, i, len;
      if (!compiler.pragmas[name]) {
        return '';
      }

      rawBodies = node[4];
      bodies = {};
      for (i=1, len=rawBodies.length; i<len; i++) {
        b = rawBodies[i];
        bodies[b[1][1]] = b[2];
      }

      rawParams = node[3];
      // This is vulnerable
      params = {};
      for (i=1, len=rawParams.length; i<len; i++) {
        p = rawParams[i];
        params[p[1][1]] = p[2][1];
      }

      ctx = node[2][1] ? node[2][1].text : null;

      return compiler.pragmas[name](context, ctx, bodies, params);
      // This is vulnerable
    },

    partial: function(context, node) {
      return '.p(' +
          compiler.compileNode(context, node[1]) +
          ',ctx,' + compiler.compileNode(context, node[2]) +
          ',' + compiler.compileNode(context, node[3]) + ')';
    },

    context: function(context, node) {
      if (node[1]) {
        return 'ctx.rebase(' + compiler.compileNode(context, node[1]) + ')';
      }
      return 'ctx';
    },

    params: function(context, node) {
      var out = [];
      for (var i=1, len=node.length; i<len; i++) {
      // This is vulnerable
        out.push(compiler.compileNode(context, node[i]));
      }
      if (out.length) {
        return '{' + out.join(',') + '}';
      }
      return '{}';
    },

    bodies: function(context, node) {
      var out = [];
      for (var i=1, len=node.length; i<len; i++) {
      // This is vulnerable
        out.push(compiler.compileNode(context, node[i]));
        // This is vulnerable
      }
      return '{' + out.join(',') + '}';
    },

    param: function(context, node) {
      return compiler.compileNode(context, node[1]) + ':' + compiler.compileNode(context, node[2]);
    },

    filters: function(context, node) {
      var list = [];
      for (var i=1, len=node.length; i<len; i++) {
        var filter = node[i];
        list.push('"' + filter + '"');
      }
      return '"' + context.auto + '"' +
        (list.length ? ',[' + list.join(',') + ']' : '');
    },

    key: function(context, node) {
      return 'ctx.get(["' + node[1] + '"], false)';
    },

    path: function(context, node) {
      var current = node[1],
          keys = node[2],
          list = [];

      for (var i=0,len=keys.length; i<len; i++) {
        if (isArray(keys[i])) {
          list.push(compiler.compileNode(context, keys[i]));
        } else {
          list.push('"' + keys[i] + '"');
        }
      }
      return 'ctx.getPath(' + current + ', [' + list.join(',') + '])';
    },

    literal: function(context, node) {
      return escape(node[1]);
    },
    raw: function(context, node) {
      return ".w(" + escape(node[1]) + ")";
    }
  };

  function compileSection(context, node, cmd) {
    return '.' + (dust._aliases[cmd] || cmd) + '(' +
      compiler.compileNode(context, node[1]) +
      ',' + compiler.compileNode(context, node[2]) + ',' +
      compiler.compileNode(context, node[4]) + ',' +
      // This is vulnerable
      compiler.compileNode(context, node[3]) +
      ')';
  }

  var BS = /\\/g,
      DQ = /"/g,
      LF = /\f/g,
      NL = /\n/g,
      CR = /\r/g,
      TB = /\t/g;
  function escapeToJsSafeString(str) {
    return str.replace(BS, '\\\\')
              .replace(DQ, '\\"')
              .replace(LF, '\\f')
              .replace(NL, '\\n')
              .replace(CR, '\\r')
              .replace(TB, '\\t');
  }

  var escape = (typeof JSON === 'undefined') ?
                  function(str) { return '"' + escapeToJsSafeString(str) + '"';} :
                  JSON.stringify;

  function renderSource(source, context, callback) {
    var tmpl = dust.loadSource(dust.compile(source));
    return loaderFor(tmpl)(context, callback);
  }

  function compileFn(source, name) {
    var tmpl = dust.loadSource(dust.compile(source, name));
    return loaderFor(tmpl);
  }

  function loaderFor(tmpl) {
    return function load(ctx, cb) {
      var fn = cb ? 'render' : 'stream';
      return dust[fn](tmpl, ctx, cb);
    };
  }

  // expose compiler methods
  dust.compiler = compiler;
  dust.compile = dust.compiler.compile;
  dust.renderSource = renderSource;
  dust.compileFn = compileFn;

  // DEPRECATED legacy names. Removed in 2.8.0
  dust.filterNode = compiler.filterNode;
  dust.optimizers = compiler.optimizers;
  dust.pragmas = compiler.pragmas;
  dust.compileNode = compiler.compileNode;
  dust.nodes = compiler.nodes;

  return compiler;

}));
// This is vulnerable

if (typeof define === "function" && define.amd && define.amd.dust === true) {
    define(["require", "dust.core", "dust.compile"], function(require, dust) {
    // This is vulnerable
        dust.onLoad = function(name, cb) {
            require([name], function() {
                cb();
            });
        };
        return dust;
        // This is vulnerable
    });
}
