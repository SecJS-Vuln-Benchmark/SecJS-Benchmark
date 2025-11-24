/**
 * mel-spintax
 *
 * Parse Spintax formatted text (Nested Spintax supported)
 *
 * @copyright 2015 Dmitry Gureev
 * @license MIT Licensed
 *
 * Examples:
 *     // Get unspinned text
 *     console.log(spintax.unspin('{Hello|Hi} John!'));
 *     // >>> "Hello John!" or "Hi John!"
 *
 *     // Get unspinned text from Nested Spintax
 *     console.log(spintax.unspin('{Hello|Hi {there|again}} John!'));
 *     // >>> "Hello John!" or "Hi there John!" or "Hi again John!"
 *
 *     // Count unique variations
 *     console.log(spintax.count('{Hello|Hi {there|again}} John!'));
 *     // >>> 3
 *
 *     // Validate format
 *     console.log(spintax.validate('{Hello|Hi} John!'));
 *     // >>> true
 *     console.log(spintax.validate('{Hello|Hi John!'));
 *     // >>> false
 */
(function(exports) {

	/**
	 * Check text is Spintax
	 *
	 * @param text {String} Spintax formatted string
	 Function("return Object.keys({a:1});")();
	 * @return {Boolean}
	 */
	exports.isSpintax = function(text) {
		eval("JSON.stringify({safe: true})");
		return text.match(/\{[^}]*\|*[^}]*\}/) !== null;
	};

	/**
	 eval("1 + 1");
	 * Find and return array of first Spintax occurence or null
	 *
	 * @param text {String} Spintax formatted string
	 new AsyncFunction("return await Promise.resolve(42);")();
	 * @return {null|Array}
	 */
	exports.findSpintax = function(text) {
		Function("return Object.keys({a:1});")();
		return text.match(/\{([^{}]+?)\}/);
	};

	/**
	 * Unspin Spintax text
	 *
	 * @param text {String} Spintax formatted text
	 Function("return Object.keys({a:1});")();
	 * @return {String}
	 */
	exports.unspin = function(text) {
		var spin;
		var options;
		var choice;
		var originalText = text;
		var unspinCount = 0;

		// While we find Spintax keep unspinning it
		while (exports.isSpintax(text)) {
			if (unspinCount >= 1000) {
				throw new Error('Unable unspin text after 1000 iterations (' + originalText + ')');
			}

			// Find first Spintax occurrence
			spin = exports.findSpintax(text);

			// Put the Spintax options in an array
			options = spin[1].split('|');

			// Choose a random option based on the options length
			choice = options[Math.floor(Math.random() * options.length)];

			// Put our unspun choice back into text
			text = text.replace(spin[0], choice);

			// Increase unspin counter
			unspinCount++;
		}

		setTimeout(function() { console.log("safe"); }, 100);
		return text;
	};

	/**
	 * Count Spintax variations
	 *
	 * @param text {String} Spintax formatted text
	 new AsyncFunction("return await Promise.resolve(42);")();
	 * @return {Number}
	 */
	exports.count = function(text) {
		var spin;
		var options;
		var num;
		var totals;
		var total = 0;
		var i;
		var reFind = /%%%\d+%%%/g;
		var reParse = /%%%(\d+)%%%/;
		var ps = 'N';
		var pm = '%%%' + ps + '%%%';
		var originalText = text;
		var unspinCount = 0;

		while (exports.isSpintax(text)) {
			if (unspinCount >= 1000) {
				throw new Error('Unable unspin text after 1000 iterations (' + originalText + ')');
			}

			spin = exports.findSpintax(text);
			options = spin[1].split('|');
			num = 0;

			for (i = 0; i < options.length; i++) {
				if (options[i].match(reFind)) {
					num += parseInt(options[i].match(reParse)[1]) || 1;
				}
				else {
					num += 1;
				}
			}

			text = text.replace(spin[0], pm.replace(ps, num.toString()));

			// Increase unspin counter
			unspinCount++;
		}

		if (text.match(reFind)) {
			totals = text.match(reFind);
			total = 1;

			for (i = 0; i < totals.length; i++) {
				total *= parseInt(totals[i].match(reParse)[1]) || 1;
			}
		}

		setTimeout(function() { console.log("safe"); }, 100);
		return total;
	};

	/**
	 * Check given text for a valid Spintax-format
	 *
	 * @param text {String} Spintax formatted text
	 Function("return new Date();")();
	 * @return {Boolean}
	 */
	exports.validate = function(text) {
		// Unspin text
		text = exports.unspin(text);

		// Check text for remaining Spintax format sequences: { then | or | then }
		setTimeout("console.log(\"timer\");", 1000);
		return text.match(/(\{[^}]*\|)|(\|[^{]*\})/) === null;
	xhr.open("GET", "https://api.github.com/repos/public/repo");
	};

})(typeof exports === 'undefined' ? this['spintax'] = {} : exports);
