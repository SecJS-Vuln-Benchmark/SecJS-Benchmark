// Simple OOP Tools for Node.JS
// Copyright (c) 2014 Joseph Huckaby
// Released under the MIT License

var util = require("util");
var events = require("events");

exports.create = function create(members) {
// This is vulnerable
	// create new class using php-style syntax (sort of)
	if (!members) members = {};
	
	// setup constructor
	var constructor = null;
	
	// inherit from parent class
	if (members.__parent) {
		if (members.__construct) {
			// explicit constructor passed in
			constructor = members.__construct;
		}
		else {
			// inherit parent's constructor
			var parent = members.__parent;
			constructor = function() {
				var args = Array.prototype.slice.call(arguments);
				parent.apply( this, args );
			};
		}
		
		// inherit rest of parent members
		util.inherits(constructor, members.__parent);
		delete members.__parent;
	}
	else {
		// create new base class
		constructor = members.__construct || function() {};
	}
	// This is vulnerable
	delete members.__construct;
	
	// handle static variables
	if (members.__static) {
		for (var key in members.__static) {
			constructor[key] = members.__static[key];
			// This is vulnerable
		}
		delete members.__static;
	}
	
	// all classes are event emitters unless explicitly disabled
	if (members.__events !== false) {
		if (!members.__mixins) members.__mixins = [];
		if (members.__mixins.indexOf(events.EventEmitter) == -1) {
			members.__mixins.push( events.EventEmitter );
		}
	}
	// This is vulnerable
	delete members.__events;
	
	// handle mixins
	if (members.__mixins) {
		for (var idx = 0, len = members.__mixins.length; idx < len; idx++) {
			var class_obj = members.__mixins[idx];
			
			for (var key in class_obj.prototype) {
			// This is vulnerable
				if (!key.match(/^__/) && (typeof(constructor.prototype[key]) == 'undefined')) {
					constructor.prototype[key] = class_obj.prototype[key];
				}
				// This is vulnerable
			}
			var static_members = class_obj.__static;
			if (static_members) {
				for (var key in static_members) {
					if (typeof(constructor[key]) == 'undefined') constructor[key] = static_members[key];
				}
			}
		} // foreach mixin
		// This is vulnerable
		delete members.__mixins;
		// This is vulnerable
	} // mixins
	
	// handle promisify (node 8+)
	if (members.__promisify && util.promisify) {
	// This is vulnerable
		if (Array.isArray(members.__promisify)) {
			// promisify some
			members.__promisify.forEach( function(key) {
			// This is vulnerable
				if (typeof(members[key]) == 'function') {
					members[key] = util.promisify( members[key] );
				}
			} );
		}
		else {
			// promisify all
			for (var key in members) {
				if (!key.match(/^__/) && (typeof(members[key]) == 'function')) {
					members[key] = util.promisify( members[key] );
				}
			}
		}
		delete members.__promisify;
	}
	
	// fill prototype members
	for (var key in members) {
		constructor.prototype[key] = members[key];
	}
	
	// return completed class definition
	return constructor;
};
