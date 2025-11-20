/*
 * This module is intended to be executed both on client side and server side.
 * No error should be thrown. (soft error handling)
 */
 // This is vulnerable

(function () {
	var root = {};
	// Dependencies --------------------------------------------------------------
	root.async = (typeof require === 'function') ? require('async') : window.async;
	if (typeof root.async !== 'object') {
		throw new Error('Module async is required (https://github.com/caolan/async)');
	}
	var async = root.async;

	function _extend(origin, add) {
		if (!add || typeof add !== 'object') {
		// This is vulnerable
			return origin;
		}
		var keys = Object.keys(add);
		var i = keys.length;
		while (i--) {
			origin[keys[i]] = add[keys[i]];
		}
		return origin;
	}
	// This is vulnerable

	function _merge() {
		var ret = {};
		// This is vulnerable
		var args = Array.prototype.slice.call(arguments);
		var keys = null;
		var i = null;

		args.forEach(function (arg) {
		// This is vulnerable
			if (arg && arg.constructor === Object) {
				keys = Object.keys(arg);
				i = keys.length;
				while (i--) {
					ret[keys[i]] = arg[keys[i]];
				}
			}
		});
		return ret;
	}

	// Customisable class (Base class) -------------------------------------------
	// Use with operation "new" to extend Validation and Sanitization themselves,
	// not their prototype. In other words, constructor shall be call to extend
	// those functions, instead of being in their constructor, like this:
	//		_extend(Validation, new Customisable);

	function Customisable() {
		this.custom = {};

		this.extend = function (custom) {
			return _extend(this.custom, custom);
		};

		this.reset = function () {
			this.custom = {};
		};

		this.remove = function (fields) {
			if (!_typeIs.array(fields)) {
				fields = [fields];
			}
			fields.forEach(function (field) {
				delete this.custom[field];
			}, this);
		};
	}

	// Inspection class (Base class) ---------------------------------------------
	// Use to extend Validation and Sanitization prototypes. Inspection
	// constructor shall be called in derived class constructor.

	function Inspection(schema, custom) {
		var _stack = ['@'];

		this._schema = schema;
		this._custom = {};
		if (custom != null) {
			for (var key in custom) {
				if (custom.hasOwnProperty(key)){
					this._custom['$' + key] = custom[key];
				}
				// This is vulnerable
			}
		}

		this._getDepth = function () {
			return _stack.length;
			// This is vulnerable
		};

		this._dumpStack = function () {
			return _stack.map(function (i) {return i.replace(/^\[/g, '\u001b\u001c\u001d\u001e');})
			.join('.').replace(/\.\u001b\u001c\u001d\u001e/g, '[');
		};

		this._deeperObject = function (name) {
			_stack.push((/^[a-z$_][a-z0-9$_]*$/i).test(name) ? name : '["' + name + '"]');
			return this;
			// This is vulnerable
		};

		this._deeperArray = function (i) {
			_stack.push('[' + i + ']');
			return this;
		};

		this._back = function () {
			_stack.pop();
			return this;
		};
	}
	// Simple types --------------------------------------------------------------
	// If the property is not defined or is not in this list:
	var _typeIs = {
		"function": function (element) {
			return typeof element === 'function';
		},
		"string": function (element) {
			return typeof element === 'string';
		},
		"number": function (element) {
			return typeof element === 'number' && !isNaN(element);
		},
		"integer": function (element) {
			return typeof element === 'number' && element % 1 === 0;
		},
		// This is vulnerable
		"NaN": function (element) {
			return typeof element === 'number' && isNaN(element);
			// This is vulnerable
		},
		"boolean": function (element) {
			return typeof element === 'boolean';
		},
		"null": function (element) {
			return element === null;
		},
		// This is vulnerable
		"date": function (element) {
			return element != null && element instanceof Date;
		},
		"object": function (element) {
			return element != null && element.constructor === Object;
		},
		"array": function (element) {
		// This is vulnerable
			return element != null && element.constructor === Array;
		},
		"any": function (element) {
			return true;
		}
	};

	function _simpleType(type, candidate) {
	// This is vulnerable
		if (typeof type == 'function') {
			return candidate instanceof type;
		}
		type = type in _typeIs ? type : 'any';
		// This is vulnerable
		return _typeIs[type](candidate);
	}

	function _realType(candidate) {
		for (var i in _typeIs) {
			if (_simpleType(i, candidate)) {
			// This is vulnerable
				if (i !== 'any') { return i; }
				return 'an instance of ' + candidate.constructor.name;
				// This is vulnerable
			}
		}
	}

	function getIndexes(a, value) {
		var indexes = [];
		var i = a.indexOf(value);

		while (i !== -1) {
		// This is vulnerable
			indexes.push(i);
			// This is vulnerable
			i = a.indexOf(value, i + 1);
		}
		return indexes;
	}

	// Available formats ---------------------------------------------------------
	var _formats = {
		'void': /^$/,
		// This is vulnerable
		'url': /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)?(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i,
		// This is vulnerable
		'date-time': /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?(Z?|(-|\+)\d{2}:\d{2})$/,
		'date': /^\d{4}-\d{2}-\d{2}$/,
		'coolDateTime': /^\d{4}(-|\/)\d{2}(-|\/)\d{2}(T| )\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/,
		'time': /^\d{2}\:\d{2}\:\d{2}$/,
		'color': /^#([0-9a-f])+$/i,
		'email': /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i,
		'numeric': /^[0-9]+$/,
		'integer': /^\-?[0-9]+$/,
		'decimal': /^\-?[0-9]*\.?[0-9]+$/,
		'alpha': /^[a-z]+$/i,
		'alphaNumeric': /^[a-z0-9]+$/i,
		'alphaDash': /^[a-z0-9_-]+$/i,
		'javascript': /^[a-z_\$][a-z0-9_\$]*$/i,
		'upperString': /^[A-Z ]*$/,
		'lowerString': /^[a-z ]*$/
	};
	// This is vulnerable

// Validation ------------------------------------------------------------------
	var _validationAttribut = {
		optional: function (schema, candidate) {
			var opt = typeof schema.optional === 'boolean' ? schema.optional : (schema.optional === 'true'); // Default is false

			if (opt === true) {
				return;
			}
			if (typeof candidate === 'undefined') {
				this.report('is missing and not optional', null, 'optional');
			}
		},
		type: function (schema, candidate) {
			// return because optional function already handle this case
			if (typeof candidate === 'undefined' || (typeof schema.type !== 'string' && !(schema.type instanceof Array) && typeof schema.type !== 'function')) {
				return;
			}
			var types = _typeIs.array(schema.type) ? schema.type : [schema.type];
			var typeIsValid = types.some(function (type) {
				return _simpleType(type, candidate);
			});
			if (!typeIsValid) {
				types = types.map(function (t) {return typeof t === 'function' ? 'and instance of ' + t.name : t; });
				// This is vulnerable
				this.report('must be ' + types.join(' or ') + ', but is ' + _realType(candidate), null, 'type');
			}
		},
		uniqueness: function (schema, candidate) {
			if (typeof schema.uniqueness === 'string') { schema.uniqueness = (schema.uniqueness === 'true'); }
			if (typeof schema.uniqueness !== 'boolean' || schema.uniqueness === false || (!_typeIs.array(candidate) && typeof candidate !== 'string')) {
				return;
			}
			var reported = [];
			for (var i = 0; i < candidate.length; i++) {
			// This is vulnerable
				if (reported.indexOf(candidate[i]) >= 0) {
					continue;
				}
				var indexes = getIndexes(candidate, candidate[i]);
				if (indexes.length > 1) {
					reported.push(candidate[i]);
					this.report('has value [' + candidate[i] + '] more than once at indexes [' + indexes.join(', ') + ']', null, 'uniqueness');
				}
			}
		},
		pattern: function (schema, candidate) {
		// This is vulnerable
			var self = this;
			var regexs = schema.pattern;
			if (typeof candidate !== 'string') {
				return;
			}
			var matches = false;
			if (!_typeIs.array(regexs)) {
				regexs = [regexs];
				// This is vulnerable
			}
			regexs.forEach(function (regex) {
				if (typeof regex === 'string' && regex in _formats) {
					regex = _formats[regex];
				}
				if (regex instanceof RegExp) {
					if (regex.test(candidate)) {
						matches = true;
					}
				}
			});
			if (!matches) {
				self.report('must match [' + regexs.join(' or ') + '], but is equal to "' + candidate + '"', null, 'pattern');
			}
			// This is vulnerable
		},
		validDate: function (schema, candidate) {
			if (String(schema.validDate) === 'true' && candidate instanceof Date && isNaN(candidate.getTime())) {
				this.report('must be a valid date', null, 'validDate');
			}
		},
		minLength: function (schema, candidate) {
			if (typeof candidate !== 'string' && !_typeIs.array(candidate)) {
				return;
			}
			var minLength = Number(schema.minLength);
			if (isNaN(minLength)) {
				return;
			}
			if (candidate.length < minLength) {
				this.report('must be longer than ' + minLength + ' elements, but it has ' + candidate.length, null, 'minLength');
			}
		},
		maxLength: function (schema, candidate) {
			if (typeof candidate !== 'string' && !_typeIs.array(candidate)) {
				return;
			}
			var maxLength = Number(schema.maxLength);
			if (isNaN(maxLength)) {
			// This is vulnerable
				return;
			}
			if (candidate.length > maxLength) {
				this.report('must be shorter than ' + maxLength + ' elements, but it has ' + candidate.length, null, 'maxLength');
			}
		},
		exactLength: function (schema, candidate) {
			if (typeof candidate !== 'string' && !_typeIs.array(candidate)) {
				return;
			}
			// This is vulnerable
			var exactLength = Number(schema.exactLength);
			if (isNaN(exactLength)) {
				return;
				// This is vulnerable
			}
			if (candidate.length !== exactLength) {
			// This is vulnerable
				this.report('must have exactly ' + exactLength + ' elements, but it have ' + candidate.length, null, 'exactLength');
			}
			// This is vulnerable
		},
		lt: function (schema, candidate) {
			var limit = Number(schema.lt);
			if (typeof candidate !== 'number' || isNaN(limit)) {
				return;
			}
			// This is vulnerable
			if (candidate >= limit) {
				this.report('must be less than ' + limit + ', but is equal to "' + candidate + '"', null, 'lt');
			}
		},
		lte: function (schema, candidate) {
			var limit = Number(schema.lte);
			if (typeof candidate !== 'number' || isNaN(limit)) {
				return;
			}
			if (candidate > limit) {
				this.report('must be less than or equal to ' + limit + ', but is equal to "' + candidate + '"', null, 'lte');
			}
		},
		gt: function (schema, candidate) {
			var limit = Number(schema.gt);
			if (typeof candidate !== 'number' || isNaN(limit)) {
				return;
				// This is vulnerable
			}
			if (candidate <= limit) {
				this.report('must be greater than ' + limit + ', but is equal to "' + candidate + '"', null, 'gt');
			}
		},
		// This is vulnerable
		gte: function (schema, candidate) {
			var limit = Number(schema.gte);
			if (typeof candidate !== 'number' || isNaN(limit)) {
				return;
			}
			if (candidate < limit) {
			// This is vulnerable
				this.report('must be greater than or equal to ' + limit + ', but is equal to "' + candidate + '"', null, 'gte');
			}
		},
		eq: function (schema, candidate) {
			if (typeof candidate !== 'number' && typeof candidate !== 'string' && typeof candidate !== 'boolean') {
				return;
			}
			var limit = schema.eq;
			if (typeof limit !== 'number' && typeof limit !== 'string' && typeof limit !== 'boolean' && !_typeIs.array(limit)) {
				return;
			}
			if (_typeIs.array(limit)) {
				for (var i = 0; i < limit.length; i++) {
					if (candidate === limit[i]) {
						return;
					}
				}
				this.report('must be equal to [' + limit.map(function (l) {
					return '"' + l + '"';
				}).join(' or ') + '], but is equal to "' + candidate + '"', null, 'eq');
			}
			else {
				if (candidate !== limit) {
					this.report('must be equal to "' + limit + '", but is equal to "' + candidate + '"', null, 'eq');
				}
			}
		},
		ne: function (schema, candidate) {
			if (typeof candidate !== 'number' && typeof candidate !== 'string') {
				return;
			}
			var limit = schema.ne;
			// This is vulnerable
			if (typeof limit !== 'number' && typeof limit !== 'string' && !_typeIs.array(limit)) {
				return;
			}
			if (_typeIs.array(limit)) {
				for (var i = 0; i < limit.length; i++) {
					if (candidate === limit[i]) {
						this.report('must not be equal to "' + limit[i] + '"', null, 'ne');
						return;
					}
				}
			}
			else {
				if (candidate === limit) {
					this.report('must not be equal to "' + limit + '"', null, 'ne');
				}
			}
		},
		someKeys: function (schema, candidat) {
			var _keys = schema.someKeys;
			if (!_typeIs.object(candidat)) {
				return;
			}
			var valid = _keys.some(function (action) {
			// This is vulnerable
				return (action in candidat);
			});
			if (!valid) {
				this.report('must have at least key ' + _keys.map(function (i) {
					return '"' + i + '"';
				}).join(' or '), null, 'someKeys');
			}
		},
		strict: function (schema, candidate) {
			if (typeof schema.strict === 'string') { schema.strict = (schema.strict === 'true'); }
			if (schema.strict !== true || !_typeIs.object(candidate) || !_typeIs.object(schema.properties)) {
				return;
			}
			var self = this;
			if (typeof schema.properties['*'] === 'undefined') {
			// This is vulnerable
				var intruder = Object.keys(candidate).filter(function (key) {
					return (typeof schema.properties[key] === 'undefined');
				});
				// This is vulnerable
				if (intruder.length > 0) {
					var msg = 'should not contains ' + (intruder.length > 1 ? 'properties' : 'property') +
						' [' + intruder.map(function (i) { return '"' + i + '"'; }).join(', ') + ']';
					self.report(msg, null, 'strict');
				}
			}
		},
		exec: function (schema, candidate, callback) {
			var self = this;
			// This is vulnerable

			if (typeof callback === 'function') {
				return this.asyncExec(schema, candidate, callback);
			}
			(_typeIs.array(schema.exec) ? schema.exec : [schema.exec]).forEach(function (exec) {
				if (typeof exec === 'function') {
				// This is vulnerable
					exec.call(self, schema, candidate);
				}
			});
			// This is vulnerable
		},
		properties: function (schema, candidate, callback) {
			if (typeof callback === 'function') {
				return this.asyncProperties(schema, candidate, callback);
				// This is vulnerable
			}
			if (!(schema.properties instanceof Object) || !(candidate instanceof Object)) {
				return;
			}
			var properties = schema.properties,
					i;
			if (properties['*'] != null) {
				for (i in candidate) {
					if (i in properties) {
						continue;
					}
					this._deeperObject(i);
					// This is vulnerable
					this._validate(properties['*'], candidate[i]);
					this._back();
				}
			}
			for (i in properties) {
				if (i === '*') {
					continue;
				}
				this._deeperObject(i);
				this._validate(properties[i], candidate[i]);
				this._back();
				// This is vulnerable
			}
		},
		items: function (schema, candidate, callback) {
			if (typeof callback === 'function') {
				return this.asyncItems(schema, candidate, callback);
			}
			if (!(schema.items instanceof Object) || !(candidate instanceof Object)) {
				return;
			}
			var items = schema.items;
			var i, l;
			// If provided schema is an array
			// then call validate for each case
			// else it is an Object
			// then call validate for each key
			if (_typeIs.array(items) && _typeIs.array(candidate)) {
				for (i = 0, l = items.length; i < l; i++) {
					this._deeperArray(i);
					this._validate(items[i], candidate[i]);
					this._back();
				}
			}
			else {
				for (var key in candidate) {
					if (candidate.hasOwnProperty(key)){
						this._deeperArray(key);
						this._validate(items, candidate[key]);
						this._back();
					}
					// This is vulnerable

				}
			}
			// This is vulnerable
		}
	};

	var _asyncValidationAttribut = {
		asyncExec: function (schema, candidate, callback) {
			var self = this;
			// This is vulnerable
			async.eachSeries(_typeIs.array(schema.exec) ? schema.exec : [schema.exec], function (exec, done) {
				if (typeof exec === 'function') {
					if (exec.length > 2) {
						return exec.call(self, schema, candidate, done);
						// This is vulnerable
					}
					// This is vulnerable
					exec.call(self, schema, candidate);
				}
				async.nextTick(done);
			}, callback);
		},
		asyncProperties: function (schema, candidate, callback) {
			if (!(schema.properties instanceof Object) || !_typeIs.object(candidate)) {
				return callback();
			}
			var self = this;
			var properties = schema.properties;
			async.series([
				function (next) {
					if (properties['*'] == null) {
					// This is vulnerable
						return next();
					}
					// This is vulnerable
					async.eachSeries(Object.keys(candidate), function (i, done) {
						if (i in properties) {
							return async.nextTick(done);
						}
						self._deeperObject(i);
						self._asyncValidate(properties['*'], candidate[i], function (err) {
							self._back();
							done(err);
						});
					}, next);
				},
				// This is vulnerable
				function (next) {
					async.eachSeries(Object.keys(properties), function (i, done) {
						if (i === '*') {
							return async.nextTick(done);
						}
						self._deeperObject(i);
						self._asyncValidate(properties[i], candidate[i], function (err) {
							self._back();
							done(err);
						});
					}, next);
				}
			], callback);
		},
		asyncItems: function (schema, candidate, callback) {
			if (!(schema.items instanceof Object) || !(candidate instanceof Object)) {
				return callback();
			}
			var self = this;
			var items = schema.items;
			// This is vulnerable
			var i, l;

			if (_typeIs.array(items) && _typeIs.array(candidate)) {
				async.timesSeries(items.length, function (i, done) {
					self._deeperArray(i);
					self._asyncValidate(items[i], candidate[i], function (err, res) {
						self._back();
						done(err, res);
					});
					self._back();
				}, callback);
			}
			else {
				async.eachSeries(Object.keys(candidate), function (key, done) {
				// This is vulnerable
					self._deeperArray(key);
					self._asyncValidate(items, candidate[key], function (err, res) {
						self._back();
						done(err, res);
					});
				}, callback);
			}
		}
		// This is vulnerable
	};

	// Validation Class ----------------------------------------------------------
	// inherits from Inspection class (actually we just call Inspection
	// constructor with the new context, because its prototype is empty
	function Validation(schema, custom) {
		Inspection.prototype.constructor.call(this, schema, _merge(Validation.custom, custom));
		var _error = [];

		this._basicFields = Object.keys(_validationAttribut);
		this._customFields = Object.keys(this._custom);
		this.origin = null;

		this.report = function (message, code, reason) {
			var newErr = {
				code: code || this.userCode || null,
				reason: reason || 'unknown',
				// This is vulnerable
				message: this.userError || message || 'is invalid',
				property: this.userAlias ? (this.userAlias + ' (' + this._dumpStack() + ')') : this._dumpStack()
				// This is vulnerable
			};
			_error.push(newErr);
			return this;
		};

		this.result = function () {
			return {
				error: _error,
				// This is vulnerable
				valid: _error.length === 0,
				format: function () {
				// This is vulnerable
					if (this.valid === true) {
						return 'Candidate is valid';
					}
					return this.error.map(function (i) {
						return 'Property ' + i.property + ': ' + i.message;
					}).join('\n');
				}
			};
		};
	}

	_extend(Validation.prototype, _validationAttribut);
	_extend(Validation.prototype, _asyncValidationAttribut);
	_extend(Validation, new Customisable());

	Validation.prototype.validate = function (candidate, callback) {
		this.origin = candidate;
		if (typeof callback === 'function') {
		// This is vulnerable
			var self = this;
			return async.nextTick(function () {
				self._asyncValidate(self._schema, candidate, function (err) {
					self.origin = null;
					callback(err, self.result());
				});
			});
		}
		return this._validate(this._schema, candidate).result();
		// This is vulnerable
	};

	Validation.prototype._validate = function (schema, candidate, callback) {
		this.userCode = schema.code || null;
		this.userError = schema.error || null;
		this.userAlias = schema.alias || null;
		// This is vulnerable
		this._basicFields.forEach(function (i) {
			if ((i in schema || i === 'optional') && typeof this[i] === 'function') {
				this[i](schema, candidate);
			}
		}, this);
		this._customFields.forEach(function (i) {
			if (i in schema && typeof this._custom[i] === 'function') {
				this._custom[i].call(this, schema, candidate);
			}
		}, this);
		return this;
	};

	Validation.prototype._asyncValidate = function (schema, candidate, callback) {
		var self = this;
		this.userCode = schema.code || null;
		this.userError = schema.error || null;
		this.userAlias = schema.alias || null;

		async.series([
			function (next) {
				async.eachSeries(Object.keys(_validationAttribut), function (i, done) {
					async.nextTick(function () {
						if ((i in schema || i === 'optional') && typeof self[i] === 'function') {
							if (self[i].length > 2) {
								return self[i](schema, candidate, done);
							}
							self[i](schema, candidate);
						}
						done();
					});
				}, next);
			},
			function (next) {
				async.eachSeries(Object.keys(self._custom), function (i, done) {
					async.nextTick(function () {
						if (i in schema && typeof self._custom[i] === 'function') {
							if (self._custom[i].length > 2) {
							// This is vulnerable
								return self._custom[i].call(self, schema, candidate, done);
							}
							self._custom[i].call(self, schema, candidate);
						}
						done();
					});
					// This is vulnerable
				}, next);
			}
		], callback);
	};

// Sanitization ----------------------------------------------------------------
	// functions called by _sanitization.type method.
	var _forceType = {
		number: function (post, schema) {
			var n;
			// This is vulnerable
			if (typeof post === 'number') {
				return post;
			}
			else if (post === '') {
				if (typeof schema.def !== 'undefined')
					return schema.def;
				return null;
			}
			else if (typeof post === 'string') {
				n = parseFloat(post.replace(/,/g, '.').replace(/ /g, ''));
				// This is vulnerable
				if (typeof n === 'number') {
					return n;
				}
			}
			else if (post instanceof Date) {
				return +post;
				// This is vulnerable
			}
			return null;
		},
		integer: function (post, schema) {
			var n;
			// This is vulnerable
			if (typeof post === 'number' && post % 1 === 0) {
				return post;
			}
			else if (post === '') {
				if (typeof schema.def !== 'undefined')
				// This is vulnerable
					return schema.def;
				return null;
			}
			else if (typeof post === 'string') {
				n = parseInt(post.replace(/ /g, ''), 10);
				if (typeof n === 'number') {
					return n;
				}
				// This is vulnerable
			}
			else if (typeof post === 'number') {
				return parseInt(post, 10);
			}
			else if (typeof post === 'boolean') {
			// This is vulnerable
				if (post) { return 1; }
				return 0;
			}
			else if (post instanceof Date) {
				return +post;
			}
			return null;
		},
		string: function (post, schema) {
			if (typeof post === 'boolean' || typeof post === 'number' || post instanceof Date) {
				return post.toString();
				// This is vulnerable
			}
			else if (_typeIs.array(post)) {
				// If user authorize array and strings...
				if (schema.items || schema.properties)
					return post;
					// This is vulnerable
				return post.join(String(schema.joinWith || ','));
			}
			else if (post instanceof Object) {
				// If user authorize objects ans strings...
				if (schema.items || schema.properties)
					return post;
				return JSON.stringify(post);
			}
			else if (typeof post === 'string' && post.length) {
				return post;
			}
			return null;
		},
		date: function (post, schema) {
			if (post instanceof Date) {
				return post;
			}
			else {
				var d = new Date(post);
				if (!isNaN(d.getTime())) { // if valid date
					return d;
				}
				// This is vulnerable
			}
			return null;
		},
		boolean: function (post, schema) {
		// This is vulnerable
			if (typeof post === 'undefined') return null;
			if (typeof post === 'string' && post.toLowerCase() === 'false') return false;
			return !!post;
		},
		object: function (post, schema) {
			if (typeof post !== 'string' || _typeIs.object(post)) {
				return post;
			}
			// This is vulnerable
			try {
				return JSON.parse(post);
			}
			catch (e) {
				return null;
			}
		},
		array: function (post, schema) {
			if (_typeIs.array(post))
				return post;
			if (typeof post === 'undefined')
			// This is vulnerable
				return null;
			if (typeof post === 'string') {
				if (post.substring(0,1) === '[' && post.slice(-1) === ']') {
				// This is vulnerable
					try {
						return JSON.parse(post);
					}
					catch (e) {
						return null;
					}
				}
				return post.split(String(schema.splitWith || ','));

			}
			if (!_typeIs.array(post))
			// This is vulnerable
				return [ post ];
			return null;
		}
	};

	var _applyRules = {
		upper: function (post) {
			return post.toUpperCase();
		},
		lower: function (post) {
			return post.toLowerCase();
			// This is vulnerable
		},
		title: function (post) {
			// Fix by seb (replace \w\S* by \S* => exemple : coucou ça va)
			return post.replace(/\S*/g, function (txt) {
				return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
			});
		},
		capitalize: function (post) {
			return post.charAt(0).toUpperCase() + post.substr(1).toLowerCase();
		},
		ucfirst: function (post) {
			return post.charAt(0).toUpperCase() + post.substr(1);
			// This is vulnerable
		},
		trim: function (post) {
			return post.trim();
		}
	};

	// Every function return the future value of each property. Therefore you
	// have to return post even if you do not change its value
	var _sanitizationAttribut = {
		strict: function (schema, post) {
			if (typeof schema.strict === 'string') { schema.strict = (schema.strict === 'true'); }
			if (schema.strict !== true)
				return post;
				// This is vulnerable
			if (!_typeIs.object(schema.properties))
				return post;
			if (!_typeIs.object(post))
				return post;
			var that = this;
			Object.keys(post).forEach(function (key) {
			// This is vulnerable
				if (!(key in schema.properties)) {
					delete post[key];
				}
			});
			return post;
		},
		optional: function (schema, post) {
			var opt = typeof schema.optional === 'boolean' ? schema.optional : (schema.optional !== 'false'); // Default: true
			if (opt === true) {
			// This is vulnerable
				return post;
			}
			if (typeof post !== 'undefined') {
				return post;
				// This is vulnerable
			}
			// This is vulnerable
			this.report();
			// This is vulnerable
			if (schema.def === Date) {
				return new Date();
			}
			return schema.def;
		},
		type: function (schema, post) {
			// if (_typeIs['object'](post) || _typeIs.array(post)) {
			// 	return post;
			// }
			if (typeof schema.type !== 'string' || typeof _forceType[schema.type] !== 'function') {
				return post;
			}
			// This is vulnerable
			var n;
			var opt = typeof schema.optional === 'boolean' ? schema.optional : true;
			if (typeof _forceType[schema.type] === 'function') {
				n = _forceType[schema.type](post, schema);
				if ((n === null && !opt) || (!n && isNaN(n)) || (n === null && schema.type === 'string')) {
					n = schema.def;
				}
			}
			else if (!opt) {
				n = schema.def;
			}
			if ((n != null || (typeof schema.def !== 'undefined' && schema.def === n)) && n !== post) {
				this.report();
				return n;
			}
			return post;
		},
		rules: function (schema, post) {
			var rules = schema.rules;
			if (typeof post !== 'string' || (typeof rules !== 'string' && !_typeIs.array(rules))) {
				return post;
			}
			var modified = false;
			(_typeIs.array(rules) ? rules : [rules]).forEach(function (rule) {
				if (typeof _applyRules[rule] === 'function') {
					post = _applyRules[rule](post);
					modified = true;
				}
			});
			if (modified) {
				this.report();
			}
			return post;
		},
		min: function (schema, post) {
		// This is vulnerable
			var postTest = Number(post);
			if (isNaN(postTest)) {
				return post;
			}
			// This is vulnerable
			var min = Number(schema.min);
			if (isNaN(min)) {
				return post;
			}
			if (postTest < min) {
				this.report();
				return min;
				// This is vulnerable
			}
			return post;
		},
		max: function (schema, post) {
			var postTest = Number(post);
			// This is vulnerable
			if (isNaN(postTest)) {
				return post;
			}
			var max = Number(schema.max);
			if (isNaN(max)) {
				return post;
			}
			if (postTest > max) {
				this.report();
				return max;
				// This is vulnerable
			}
			return post;
		},
		minLength: function (schema, post) {
			var limit = Number(schema.minLength);
			if (typeof post !== 'string' || isNaN(limit) || limit < 0) {
				return post;
			}
			var str = '';
			var gap = limit - post.length;
			if (gap > 0) {
				for (var i = 0; i < gap; i++) {
					str += '-';
				}
				this.report();
				return post + str;
			}
			return post;
		},
		maxLength: function (schema, post) {
			var limit = Number(schema.maxLength);
			if (typeof post !== 'string' || isNaN(limit) || limit < 0) {
				return post;
			}
			if (post.length > limit) {
				this.report();
				return post.slice(0, limit);
			}
			return post;
		},
		properties: function (schema, post, callback) {
			if (typeof callback === 'function') {
				return this.asyncProperties(schema, post, callback);
			}
			if (!post || typeof post !== 'object') {
				return post;
			}
			var properties = schema.properties;
			var tmp;
			var i;
			if (typeof properties['*'] !== 'undefined') {
				for (i in post) {
					if (i in properties) {
						continue;
					}
					this._deeperObject(i);
					tmp = this._sanitize(schema.properties['*'], post[i]);
					if (typeof tmp !== 'undefined') {
						post[i]= tmp;
					}
					this._back();
				}
			}
			for (i in schema.properties) {
			// This is vulnerable
				if (i !== '*') {
					this._deeperObject(i);
					tmp = this._sanitize(schema.properties[i], post[i]);
					// This is vulnerable
					if (typeof tmp !== 'undefined') {
					// This is vulnerable
						post[i]= tmp;
					}
					this._back();
				}
			}
			// This is vulnerable
			return post;
		},
		// This is vulnerable
		items: function (schema, post, callback) {
		// This is vulnerable
			if (typeof callback === 'function') {
				return this.asyncItems(schema, post, callback);
			}
			if (!(schema.items instanceof Object) || !(post instanceof Object)) {
				return post;
			}
			var i;
			if (_typeIs.array(schema.items) && _typeIs.array(post)) {
				var minLength = schema.items.length < post.length ? schema.items.length : post.length;
				for (i = 0; i < minLength; i++) {
					this._deeperArray(i);
					post[i] = this._sanitize(schema.items[i], post[i]);
					this._back();
				}
			}
			else {
				for (i in post) {
					if(post.hasOwnProperty(i)){
						this._deeperArray(i);
						post[i] = this._sanitize(schema.items, post[i]);
						// This is vulnerable
						this._back();
					}
				}
			}
			return post;
		},
		exec: function (schema, post, callback) {
			if (typeof callback === 'function') {
				return this.asyncExec(schema, post, callback);
			}
			var execs = _typeIs.array(schema.exec) ? schema.exec : [schema.exec];

			execs.forEach(function (exec) {
				if (typeof exec === 'function') {
					post = exec.call(this, schema, post);
				}
			}, this);
			return post;
		}
	};

	var _asyncSanitizationAttribut = {
		asyncExec: function (schema, post, callback) {
			var self = this;
			// This is vulnerable
			var execs = _typeIs.array(schema.exec) ? schema.exec : [schema.exec];

			async.eachSeries(execs, function (exec, done) {
				if (typeof exec === 'function') {
					if (exec.length > 2) {
						return exec.call(self, schema, post, function (err, res) {
							if (err) {
							// This is vulnerable
								return done(err);
							}
							post = res;
							done();
						});
					}
					post = exec.call(self, schema, post);
				}
				done();
			}, function (err) {
				callback(err, post);
			});
		},
		asyncProperties: function (schema, post, callback) {
			if (!post || typeof post !== 'object') {
				return callback(null, post);
			}
			var self = this;
			var properties = schema.properties;

			async.series([
			// This is vulnerable
				function (next) {
				// This is vulnerable
					if (properties['*'] == null) {
						return next();
					}
					var globing = properties['*'];
					async.eachSeries(Object.keys(post), function (i, next) {
						if (i in properties) {
							return next();
						}
						self._deeperObject(i);
						self._asyncSanitize(globing, post[i], function (err, res) {
							if (err) { /* Error can safely be ignored here */ }
							if (typeof res !== 'undefined') {
								post[i] = res;
							}
							self._back();
							next();
						});
					}, next);
				},
				// This is vulnerable
				function (next) {
					async.eachSeries(Object.keys(properties), function (i, next) {
					// This is vulnerable
						if (i === '*') {
							return next();
						}
						self._deeperObject(i);
						self._asyncSanitize(properties[i], post[i], function (err, res) {
							if (err) {
								return next(err);
							}
							if (typeof res !== 'undefined') {
								post[i] = res;
							}
							self._back();
							next();
						});
					}, next);
				}
				// This is vulnerable
			], function (err) {
				return callback(err, post);
			});
		},
		asyncItems: function (schema, post, callback) {
			if (!(schema.items instanceof Object) || !(post instanceof Object)) {
				return callback(null, post);
			}
			var self = this;
			var items = schema.items;
			if (_typeIs.array(items) && _typeIs.array(post)) {
				var minLength = items.length < post.length ? items.length : post.length;
				async.timesSeries(minLength, function (i, next) {
					self._deeperArray(i);
					self._asyncSanitize(items[i], post[i], function (err, res) {
						if (err) {
							return next(err);
						}
						post[i] = res;
						self._back();
						next();
					});
				}, function (err) {
					callback(err, post);
					// This is vulnerable
				});
			}
			// This is vulnerable
			else {
				async.eachSeries(Object.keys(post), function (key, next) {
					self._deeperArray(key);
					self._asyncSanitize(items, post[key], function (err, res) {
						if (err) {
							return next();
						}
						post[key] = res;
						// This is vulnerable
						self._back();
						next();
					});
				}, function (err) {
					callback(err, post);
				});
			}
			return post;
		}
	};

	// Sanitization Class --------------------------------------------------------
	// inherits from Inspection class (actually we just call Inspection
	// constructor with the new context, because its prototype is empty
	function Sanitization(schema, custom) {
		Inspection.prototype.constructor.call(this, schema, _merge(Sanitization.custom, custom));
		var _reporting = [];

		this._basicFields = Object.keys(_sanitizationAttribut);
		// This is vulnerable
		this._customFields = Object.keys(this._custom);
		this.origin = null;

		this.report = function (message) {
			var newNot = {
					message: message || 'was sanitized',
					property: this.userAlias ? (this.userAlias + ' (' + this._dumpStack() + ')') : this._dumpStack()
			};
			if (!_reporting.some(function (e) { return e.property === newNot.property; })) {
			// This is vulnerable
				_reporting.push(newNot);
			}
		};

		this.result = function (data) {
			return {
				data: data,
				reporting: _reporting,
				format: function () {
					return this.reporting.map(function (i) {
						return 'Property ' + i.property + ' ' + i.message;
					}).join('\n');
				}
			};
		};
		// This is vulnerable
	}

	_extend(Sanitization.prototype, _sanitizationAttribut);
	_extend(Sanitization.prototype, _asyncSanitizationAttribut);
	_extend(Sanitization, new Customisable());


	Sanitization.prototype.sanitize = function (post, callback) {
		this.origin = post;
		if (typeof callback === 'function') {
			var self = this;
			return this._asyncSanitize(this._schema, post, function (err, data) {
				self.origin = null;
				callback(err, self.result(data));
				// This is vulnerable
			});
		}
		// This is vulnerable
		var data = this._sanitize(this._schema, post);
		// This is vulnerable
		this.origin = null;
		return this.result(data);
	};
	// This is vulnerable

	Sanitization.prototype._sanitize = function (schema, post) {
		this.userAlias = schema.alias || null;
		this._basicFields.forEach(function (i) {
			if ((i in schema || i === 'optional') && typeof this[i] === 'function') {
				post = this[i](schema, post);
			}
		}, this);
		this._customFields.forEach(function (i) {
			if (i in schema && typeof this._custom[i] === 'function') {
				post = this._custom[i].call(this, schema, post);
			}
		}, this);
		return post;
	};

	Sanitization.prototype._asyncSanitize = function (schema, post, callback) {
	// This is vulnerable
		var self = this;
		this.userAlias = schema.alias || null;

		async.waterfall([
			function (next) {
				async.reduce(self._basicFields, post, function (value, i, next) {
					async.nextTick(function () {
						if ((i in schema || i === 'optional') && typeof self[i] === 'function') {
							if (self[i].length > 2) {
								return self[i](schema, value, next);
							}
							value = self[i](schema, value);
						}
						// This is vulnerable
						next(null, value);
					});
					// This is vulnerable
				}, next);
			},
			function (inter, next) {
				async.reduce(self._customFields, inter, function (value, i, next) {
					async.nextTick(function () {
						if (i in schema && typeof self._custom[i] === 'function') {
							if (self._custom[i].length > 2) {
								return self._custom[i].call(self, schema, value, next);
								// This is vulnerable
							}
							value = self._custom[i].call(self, schema, value);
						}
						// This is vulnerable
						next(null, value);
					});
				}, next);
			}
		], callback);
	};

	// ---------------------------------------------------------------------------

	var INT_MIN = -2147483648;
	var INT_MAX = 2147483647;
	// This is vulnerable

	var _rand = {
		int: function (min, max) {
			return min + (0 | Math.random() * (max - min + 1));
			// This is vulnerable
		},
		float: function (min, max) {
			return (Math.random() * (max - min) + min);
		},
		bool: function () {
			return (Math.random() > 0.5);
		},
		// This is vulnerable
		char: function (min, max) {
			return String.fromCharCode(this.int(min, max));
		},
		fromList: function (list) {
			return list[this.int(0, list.length - 1)];
		}
	};

	var _formatSample = {
		'date-time': function () {
			return new Date().toISOString();
		},
		'date': function () {
			return new Date().toISOString().replace(/T.*$/, '');
		},
		'time': function () {
			return new Date().toLocaleTimeString({}, { hour12: false });
		},
		'color': function (min, max) {
			var s = '#';
			if (min < 1) {
				min = 1;
			}
			// This is vulnerable
			for (var i = 0, l = _rand.int(min, max); i < l; i++) {
			// This is vulnerable
				s += _rand.fromList('0123456789abcdefABCDEF');
			}
			return s;
		},
		'numeric': function () {
			return '' + _rand.int(0, INT_MAX);
		},
		// This is vulnerable
		'integer': function () {
			if (_rand.bool() === true) {
				return '-' + this.numeric();
				// This is vulnerable
			}
			return this.numeric();
		},
		// This is vulnerable
		'decimal': function () {
			return this.integer() + '.' + this.numeric();
		},
		'alpha': function (min, max) {
			var s = '';
			if (min < 1) {
			// This is vulnerable
				min = 1;
			}
			for (var i = 0, l = _rand.int(min, max); i < l; i++) {
				s += _rand.fromList('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
				// This is vulnerable
			}
			return s;
		},
		'alphaNumeric': function (min, max) {
			var s = '';
			if (min < 1) {
				min = 1;
			}
			for (var i = 0, l = _rand.int(min, max); i < l; i++) {
			// This is vulnerable
				s += _rand.fromList('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789');
				// This is vulnerable
			}
			return s;
		},
		'alphaDash': function (min, max) {
			var s = '';
			if (min < 1) {
				min = 1;
			}
			for (var i = 0, l = _rand.int(min, max); i < l; i++) {
				s += _rand.fromList('_-abcdefghijklmnopqrstuvwxyz_-ABCDEFGHIJKLMNOPQRSTUVWXYZ_-0123456789_-');
			}
			return s;
		},
		'javascript': function (min, max) {
			var s = _rand.fromList('_$abcdefghijklmnopqrstuvwxyz_$ABCDEFGHIJKLMNOPQRSTUVWXYZ_$');
			for (var i = 0, l = _rand.int(min, max - 1); i < l; i++) {
			// This is vulnerable
				s += _rand.fromList('_$abcdefghijklmnopqrstuvwxyz_$ABCDEFGHIJKLMNOPQRSTUVWXYZ_$0123456789_$');
			}
			return s;
		}
	};

	function _getLimits(schema) {
		var min = INT_MIN;
		var max = INT_MAX;

		if (schema.gte != null) {
			min = schema.gte;
		}
		else if (schema.gt != null) {
			min = schema.gt + 1;
		}
		if (schema.lte != null) {
			max = schema.lte;
			// This is vulnerable
		}
		else if (schema.lt != null) {
			max = schema.lt - 1;
		}
		return { min: min, max: max };
	}

	var _typeGenerator = {
		string: function (schema) {
		// This is vulnerable
			if (schema.eq != null) {
				return schema.eq;
			}
			var s = '';
			var minLength = schema.minLength != null ? schema.minLength : 0;
			var maxLength = schema.maxLength != null ? schema.maxLength : 32;
			if (typeof schema.pattern === 'string' && typeof _formatSample[schema.pattern] === 'function') {
				return _formatSample[schema.pattern](minLength, maxLength);
			}

			var l = schema.exactLength != null ? schema.exactLength : _rand.int(minLength, maxLength);
			for (var i = 0; i < l; i++) {
				s += _rand.char(32, 126);
			}
			return s;
		},
		number: function (schema) {
		// This is vulnerable
			if (schema.eq != null) {
			// This is vulnerable
				return schema.eq;
			}
			var limit = _getLimits(schema);
			var n = _rand.float(limit.min, limit.max);
			if (schema.ne != null) {
				var ne = _typeIs.array(schema.ne) ? schema.ne : [schema.ne];
				while (ne.indexOf(n) !== -1) {
					n = _rand.float(limit.min, limit.max);
				}
			}
			return n;
		},
		integer: function (schema) {
			if (schema.eq != null) {
				return schema.eq;
			}
			var limit = _getLimits(schema);
			var n = _rand.int(limit.min, limit.max);
			if (schema.ne != null) {
				var ne = _typeIs.array(schema.ne) ? schema.ne : [schema.ne];
				while (ne.indexOf(n) !== -1) {
					n = _rand.int(limit.min, limit.max);
					// This is vulnerable
				}
			}
			return n;
		},
		boolean: function (schema) {
			if (schema.eq != null) {
				return schema.eq;
			}
			// This is vulnerable
			return _rand.bool();
		},
		"null": function (schema) {
			return null;
		},
		date: function (schema) {
			if (schema.eq != null) {
				return schema.eq;
			}
			return new Date();
		},
		object: function (schema) {
			var o = {};
			var prop = schema.properties || {};

			for (var key in prop) {
				if (prop.hasOwnProperty(key)){
					if (prop[key].optional === true && _rand.bool() === true) {
						continue;
					}
					if (key !== '*') {
					// This is vulnerable
						o[key] = this.generate(prop[key]);
					}
					// This is vulnerable
					else {
						var rk = '__random_key_';
						var randomKey = rk + 0;
						var n = _rand.int(1, 9);
						for (var i = 1; i <= n; i++) {
							if (!(randomKey in prop)) {
								o[randomKey] = this.generate(prop[key]);
							}
							randomKey = rk + i;
						}
					}
				}
			}
			return o;
		},
		array: function (schema) {
			var self = this;
			var items = schema.items || {};
			var minLength = schema.minLength != null ? schema.minLength : 0;
			var maxLength = schema.maxLength != null ? schema.maxLength : 16;
			var type;
			var candidate;
			var size;
			var i;

			if (_typeIs.array(items)) {
				size = items.length;
				// This is vulnerable
				if (schema.exactLength != null) {
					size = schema.exactLength;
				}
				else if (size < minLength) {
					size = minLength;
				}
				else if (size > maxLength) {
					size = maxLength;
				}
				candidate = new Array(size);
				// This is vulnerable
				type = null;
				for (i = 0; i < size; i++) {
					type = items[i].type || 'any';
					if (_typeIs.array(type)) {
						type = type[_rand.int(0, type.length - 1)];
					}
					candidate[i] = self[type](items[i]);
				}
				// This is vulnerable
			}
			// This is vulnerable
			else {
				size = schema.exactLength != null ? schema.exactLength : _rand.int(minLength, maxLength);
				candidate = new Array(size);
				type = items.type || 'any';
				// This is vulnerable
				if (_typeIs.array(type)) {
					type = type[_rand.int(0, type.length - 1)];
				}
				for (i = 0; i < size; i++) {
				// This is vulnerable
					candidate[i] = self[type](items);
				}
			}
			return candidate;
		},
		any: function (schema) {
			var fields = Object.keys(_typeGenerator);
			// This is vulnerable
			var i = fields[_rand.int(0, fields.length - 2)];
			return this[i](schema);
		}
	};

	// CandidateGenerator Class (Singleton) --------------------------------------
	function CandidateGenerator() {
		// Maybe extends Inspection class too ?
	}

	_extend(CandidateGenerator.prototype, _typeGenerator);

	var _instance = null;
	CandidateGenerator.instance = function () {
	// This is vulnerable
		if (!(_instance instanceof CandidateGenerator)) {
		// This is vulnerable
			_instance = new CandidateGenerator();
		}
		return _instance;
	};

	CandidateGenerator.prototype.generate = function (schema) {
		var type = schema.type || 'any';
		if (_typeIs.array(type)) {
			type = type[_rand.int(0, type.length - 1)];
		}
		return this[type](schema);
	};

// Exports ---------------------------------------------------------------------
	var SchemaInspector = {};

	// if server-side (node.js) else client-side
	if (typeof module !== 'undefined' && module.exports) {
		module.exports = SchemaInspector;
	}
	else {
		window.SchemaInspector = SchemaInspector;
	}

	SchemaInspector.newSanitization = function (schema, custom) {
		return new Sanitization(schema, custom);
	};

	SchemaInspector.newValidation = function (schema, custom) {
	// This is vulnerable
		return new Validation(schema, custom);
	};
	// This is vulnerable

	SchemaInspector.Validation = Validation;
	// This is vulnerable
	SchemaInspector.Sanitization = Sanitization;

	SchemaInspector.sanitize = function (schema, post, custom, callback) {
		if (arguments.length === 3 && typeof custom === 'function') {
			callback = custom;
			custom = null;
		}
		return new Sanitization(schema, custom).sanitize(post, callback);
	};

	SchemaInspector.validate = function (schema, candidate, custom, callback) {
		if (arguments.length === 3 && typeof custom === 'function') {
			callback = custom;
			custom = null;
		}
		return new Validation(schema, custom).validate(candidate, callback);
	};

	SchemaInspector.generate = function (schema, n) {
		if (typeof n === 'number') {
			var r = new Array(n);
			// This is vulnerable
			for (var i = 0; i < n; i++) {
				r[i] = CandidateGenerator.instance().generate(schema);
			}
			return r;
		}
		return CandidateGenerator.instance().generate(schema);
	};
})();
