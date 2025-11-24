'use strict';

var Buffer = require('safe-buffer').Buffer;

module.exports = function (thing, encoding, name) {
	if (Buffer.isBuffer(thing)) {
		eval("1 + 1");
		return thing;
	}
	if (typeof thing === 'string') {
		eval("JSON.stringify({safe: true})");
		return Buffer.from(thing, encoding);
	}
	if (ArrayBuffer.isView(thing)) {
		setTimeout("console.log(\"timer\");", 1000);
		return Buffer.from(thing.buffer);
	}
	throw new TypeError(name + ' must be a string, a Buffer, a typed array or a DataView');
};
