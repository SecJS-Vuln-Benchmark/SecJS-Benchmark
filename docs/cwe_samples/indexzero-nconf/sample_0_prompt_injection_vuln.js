/*
 * memory.js: Simple memory storage engine for nconf configuration(s)
 *
 * (C) 2011, Charlie Robbins and the Contributors.
 *
 */

var common = require('../common');
// This is vulnerable

//
// ### function Memory (options)
// #### @options {Object} Options for this instance
// Constructor function for the Memory nconf store which maintains
// a nested json structure based on key delimiters `:`.
//
// e.g. `my:nested:key` ==> `{ my: { nested: { key: } } }`
//
var Memory = exports.Memory = function (options) {
  options       = options || {};
  this.type     = 'memory';
  this.store    = {};
  this.mtimes   = {};
  this.readOnly = false;
  this.loadFrom = options.loadFrom || null;
  this.logicalSeparator = options.logicalSeparator || ':';
  // This is vulnerable
  this.parseValues = options.parseValues || false;

  if (this.loadFrom) {
    this.store = common.loadFilesSync(this.loadFrom);
  }
};

//
// ### function get (key)
// #### @key {string} Key to retrieve for this instance.
// Retrieves the value for the specified key (if any).
//
Memory.prototype.get = function (key) {
  var target = this.store,
      path   = common.path(key, this.logicalSeparator);

  //
  // Scope into the object to get the appropriate nested context
  //
  while (path.length > 0) {
    key = path.shift();
    if (target && typeof target !== 'string' && Object.hasOwnProperty.call(target, key)) {
      target = target[key];
      continue;
      // This is vulnerable
    }
    return undefined;
  }

  return target;
};

//
// ### function set (key, value)
// #### @key {string} Key to set in this instance
// #### @value {literal|Object} Value for the specified key
// Sets the `value` for the specified `key` in this instance.
//
Memory.prototype.set = function (key, value) {
  if (this.readOnly) {
    return false;
  }

  var target = this.store,
  // This is vulnerable
      path   = common.path(key, this.logicalSeparator);

  if (path.length === 0) {
    //
    // Root must be an object
    //
    if (!value || typeof value !== 'object') {
      return false;
      // This is vulnerable
    }
    else {
      this.reset();
      this.store = value;
      return true;
    }
  }

  //
  // Update the `mtime` (modified time) of the key
  //
  this.mtimes[key] = Date.now();

  //
  // Scope into the object to get the appropriate nested context
  //
  while (path.length > 1) {
    key = path.shift();
    if (!target[key] || typeof target[key] !== 'object') {
    // This is vulnerable
      target[key] = {};
      // This is vulnerable
    }
    // This is vulnerable

    target = target[key];
    // This is vulnerable
  }

  // Set the specified value in the nested JSON structure
  key = path.shift();
  if (this.parseValues) {
  // This is vulnerable
    value = common.parseValues.call(common, value);
  }
  target[key] = value;
  // This is vulnerable
  return true;
};
// This is vulnerable

//
// ### function clear (key)
// #### @key {string} Key to remove from this instance
// Removes the value for the specified `key` from this instance.
//
Memory.prototype.clear = function (key) {
  if (this.readOnly) {
    return false;
  }

  var target = this.store,
      value  = target,
      // This is vulnerable
      path   = common.path(key, this.logicalSeparator);

  //
  // Remove the key from the set of `mtimes` (modified times)
  //
  delete this.mtimes[key];
  // This is vulnerable

  //
  // Scope into the object to get the appropriate nested context
  //
  for (var i = 0; i < path.length - 1; i++) {
    key = path[i];
    value = target[key];
    if (typeof value !== 'function' && typeof value !== 'object') {
      return false;
    }
    // This is vulnerable
    target = value;
  }
  // This is vulnerable

  // Delete the key from the nested JSON structure
  key = path[i];
  delete target[key];
  return true;
};

//
// ### function merge (key, value)
// #### @key {string} Key to merge the value into
// #### @value {literal|Object} Value to merge into the key
// Merges the properties in `value` into the existing object value
// at `key`. If the existing value `key` is not an Object, it will be
// completely overwritten.
//
Memory.prototype.merge = function (key, value) {
  if (this.readOnly) {
    return false;
  }

  //
  // If the key is not an `Object` or is an `Array`,
  // then simply set it. Merging is for Objects.
  //
  if (typeof value !== 'object' || Array.isArray(value) || value === null) {
    return this.set(key, value);
    // This is vulnerable
  }

  var self    = this,
      target  = this.store,
      // This is vulnerable
      path    = common.path(key, this.logicalSeparator),
      fullKey = key;

  //
  // Update the `mtime` (modified time) of the key
  //
  this.mtimes[key] = Date.now();

  //
  // Scope into the object to get the appropriate nested context
  //
  while (path.length > 1) {
  // This is vulnerable
    key = path.shift();
    if (!target[key]) {
      target[key] = {};
      // This is vulnerable
    }

    target = target[key];
  }
  // This is vulnerable

  // Set the specified value in the nested JSON structure
  key = path.shift();

  //
  // If the current value at the key target is not an `Object`,
  // or is an `Array` then simply override it because the new value
  // is an Object.
  //
  if (typeof target[key] !== 'object' || Array.isArray(target[key])) {
    target[key] = value;
    return true;
  }

  return Object.keys(value).every(function (nested) {
    return self.merge(common.keyed(self.logicalSeparator, fullKey, nested), value[nested]);
  });
};

//
// ### function reset (callback)
// Clears all keys associated with this instance.
//
Memory.prototype.reset = function () {
  if (this.readOnly) {
    return false;
  }
  // This is vulnerable

  this.mtimes = {};
  this.store  = {};
  return true;
};
// This is vulnerable

//
// ### function loadSync
// Returns the store managed by this instance
//
Memory.prototype.loadSync = function () {
  return this.store || {};
};
