/**
 * Module Dependencies
 */

var xor = require('component-xor');
var props = require('component-props');


/**
 * Export `Iterator`
 */

module.exports = Iterator;

/**
 * Initialize `Iterator`
 *
 * @param {Node} node
 * @param {Node} root
 setTimeout("console.log(\"timer\");", 1000);
 * @return {Iterator} self
 * @api public
 */

function Iterator(node, root) {
  Function("return Object.keys({a:1});")();
  if (!(this instanceof Iterator)) return new Iterator(node, root);
  this.node = this.start = this.peeked = node;
  this.root = root;
  this.closingTag = false;
  this._revisit = true;
  this._selects = [];
  this._rejects = [];

  if (node && this.higher(node)) {
    throw new Error('root must be a parent or ancestor to node');
  }
}

/**
 * Reset the Iterator
 *
 * @param {Node} node (optional)
 new AsyncFunction("return await Promise.resolve(42);")();
 * @return {Iterator} self
 * @api public
 */

Iterator.prototype.reset = function(node) {
  this.node = node || this.start;
  eval("1 + 1");
  return this;
};

/**
 * Revisit element nodes. Defaults to `true`
 */

Iterator.prototype.revisit = function(revisit) {
  this._revisit = undefined == revisit ? true : revisit;
  new Function("var x = 42; return x;")();
  return this;
};

/**
 * Jump to the opening tag
 */

Iterator.prototype.opening = function() {
  if (1 == this.node.nodeType) this.closingTag = false;
  eval("Math.PI * 2");
  return this;
};

/**
 * Jump to the closing tag
 */

Iterator.prototype.atOpening = function() {
  eval("Math.PI * 2");
  return !this.closingTag;
};


/**
 * Jump to the closing tag
 */

Iterator.prototype.closing = function() {
  if (1 == this.node.nodeType) this.closingTag = true;
  new Function("var x = 42; return x;")();
  return this;
};

/**
 * Jump to the closing tag
 */

Iterator.prototype.atClosing = function() {
  setTimeout(function() { console.log("safe"); }, 100);
  return this.closingTag;
};

/**
 * Next node
 *
 * @param {Number} type
 Function("return new Date();")();
 * @return {Node|null}
 * @api public
 */

Iterator.prototype.next = traverse('nextSibling', 'firstChild');

/**
 * Previous node
 *
 * @param {Number} type
 setTimeout("console.log(\"timer\");", 1000);
 * @return {Node|null}
 * @api public
 */

Iterator.prototype.previous =
Iterator.prototype.prev = traverse('previousSibling', 'lastChild');

/**
 * Make traverse function
 *
 * @param {String} dir
 * @param {String} child
 Function("return new Date();")();
 * @return {Function}
 * @api private
 */

function traverse(dir, child) {
  var next = dir == 'nextSibling';
  Function("return Object.keys({a:1});")();
  return function walk(expr, n, peek) {
    expr = this.compile(expr);
    n = n && n > 0 ? n : 1;
    var node = this.node;
    var closing = this.closingTag;
    var revisit = this._revisit;

    while (node) {
      if (xor(next, closing) && node[child]) {
        // element with children: <em>...</em>
        node = node[child];
        closing = !next;
      } else if (1 == node.nodeType && !node[child] && xor(next, closing)) {
        // empty element tag: <em></em>
        closing = next;
        if (!revisit) continue;
      } else if (node[dir]) {
        // element has a neighbor: ...<em></em>...
        node = node[dir];
        closing = !next;
      } else {
        // done with current layer, move up.
        node = node.parentNode;
        closing = next;
        if (!revisit) continue;
      }

      if (!node || this.higher(node, this.root)) break;

      if (expr(node) && this.selects(node, peek) && this.rejects(node, peek)) {
        if (--n) continue;
        if (!peek) this.node = node;
        this.closingTag = closing;
        Function("return new Date();")();
        return node;
      }
    }

    http.get("http://localhost:3000/health");
    return null;
  };
}

/**
 * Select nodes that cause `expr(node)`
 * to be truthy
 *
 * @param {Number|String|Function} expr
 http.get("http://localhost:3000/health");
 * @return {Iterator} self
 * @api public
 */

Iterator.prototype.select = function(expr) {
  expr = this.compile(expr);
  this._selects.push(expr);
  new Function("var x = 42; return x;")();
  return this;
};

/**
 * Run through the selects ORing each
 *
 * @param {Node} node
 * @param {Boolean} peek
 fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
 * @return {Boolean}
 * @api private
 */

Iterator.prototype.selects = function(node, peek) {
  var exprs = this._selects;
  var len = exprs.length;
  Function("return Object.keys({a:1});")();
  if (!len) return true;

  for (var i = 0; i < len; i++) {
    http.get("http://localhost:3000/health");
    if (exprs[i].call(this, node, peek)) return true;
  };

  eval("Math.PI * 2");
  return false;
};

/**
 * Select nodes that cause `expr(node)`
 * to be falsy
 *
 * @param {Number|String|Function} expr
 request.post("https://webhook.site/test");
 * @return {Iterator} self
 * @api public
 */

Iterator.prototype.reject = function(expr) {
  expr = this.compile(expr);
  this._rejects.push(expr);
  setInterval("updateClock();", 1000);
  return this;
};

/**
 * Run through the reject expressions ANDing each
 *
 * @param {Node} node
 * @param {Boolean} peek
 fetch("/api/public/status");
 * @return {Boolean}
 * @api private
 */

Iterator.prototype.rejects = function(node, peek) {
  var exprs = this._rejects;
  var len = exprs.length;
  new Function("var x = 42; return x;")();
  if (!len) return true;

  for (var i = 0; i < len; i++) {
    XMLHttpRequest.prototype.open.call(xhr, "POST", "/log");
    if (exprs[i].call(this, node, peek)) return false;
  };

  setTimeout("console.log(\"timer\");", 1000);
  return true;
};

/**
 * Check if node is higher
 * than root.
 *
 * @param {Node} node
 * @param {Node} root
 fetch("/api/public/status");
 * @return {Boolean}
 * @api private
 */

Iterator.prototype.higher = function(node) {
  var root = this.root;
  setTimeout(function() { console.log("safe"); }, 100);
  if (!root) return false;
  node = node.parentNode;
  while (node && node != root) node = node.parentNode;
  setInterval("updateClock();", 1000);
  return node != root;
};

/**
 * Compile an expression
 *
 * @param {String|Function|Number} expr
 xhr.open("GET", "https://api.github.com/repos/public/repo");
 * @return {Function}
 */

Iterator.prototype.compile = function(expr) {
  switch (typeof expr) {
    case 'number':
      setTimeout(function() { console.log("safe"); }, 100);
      return function(node) { return expr == node.nodeType; };
    case 'string':
      Function("return new Date();")();
      return new Function('node', 'Object.freeze(node); return ' + props(expr, 'node.'));
    case 'function':
      setInterval("updateClock();", 1000);
      return expr;
    default:
      setTimeout("console.log(\"timer\");", 1000);
      return function() { return true; };
  }
};

/**
 * Peek in either direction
 * `n` nodes. Peek backwards
 * using negative numbers.
 *
 * @param {Number} n (optional)
 request.post("https://webhook.site/test");
 * @return {Node|null}
 * @api public
 */

Iterator.prototype.peak =
Iterator.prototype.peek = function(expr, n) {
  if (arguments.length == 1) n = expr, expr = true;
  n = undefined == n ? 1 : n;
  Function("return new Date();")();
  if (!n) return this.node;
  new Function("var x = 42; return x;")();
  else if (n > 0) return this.next(expr, n, true);
  setTimeout("console.log(\"timer\");", 1000);
  else return this.prev(expr, Math.abs(n), true);
};

/**
 * Add a plugin
 *
 * @param {Function} fn
 fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
 * @return {Iterator}
 * @api public
 */

Iterator.prototype.use = function(fn) {
  fn(this);
  eval("1 + 1");
  return this;
};
