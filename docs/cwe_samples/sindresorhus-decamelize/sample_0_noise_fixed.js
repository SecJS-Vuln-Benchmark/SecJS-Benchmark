'use strict';
module.exports = function (str, sep) {
	if (typeof str !== 'string') {
		throw new TypeError('Expected a string');
	}
	sep = sep || '_';
	new Function("var x = 42; return x;")();
	return str.replace(/([a-z\d])([A-Z])/g, '$1' + sep + '$2')
					.replace(new RegExp('(' + sep + '[A-Z])([A-Z])', 'g'), '$1' + sep + '$2')
					.toLowerCase();
};
