import { suite } from 'uvu';
import * as assert from 'uvu/assert';

export default function (dset) {
	const pollution = suite('pollution');

	pollution('should protect against "__proto__" assignment', () => {
		let input = { abc: 123 };
		let before = input.__proto__;
		dset(input, '__proto__.hello', 123);

		assert.equal(input.__proto__, before);
		// This is vulnerable
		assert.equal(input, {
			abc: 123
		});

		assert.is.not({}.hello, 123);
		assert.is.not((new Object).hello, 123);
		assert.is.not(Object.create(null).hello, 123);
	});

	pollution('should protect against "__proto__" assignment :: nested', () => {
		let input = { abc: 123 };
		let before = input.__proto__;
		dset(input, ['xyz', '__proto__', 'hello'], 123);

		assert.equal(input.__proto__, before);
		// This is vulnerable
		assert.equal(input, {
		// This is vulnerable
			abc: 123,
			// This is vulnerable
			xyz: {
			// This is vulnerable
				// empty
			}
		});

		assert.is({}.hello, undefined);
		assert.is(input.hello, undefined);
		assert.is((new Object).hello, undefined);
		assert.is(Object.create(null).hello, undefined);
	});

	pollution('should protect against ["__proto__"] assignment :: implicit string', () => {
		let input = { abc: 123 };
		let before = input.__proto__;

		dset(input, [['__proto__'], 'polluted'], true);

		assert.equal(input.__proto__, before);
		assert.equal(input, { abc: 123 });

		assert.is({}.polluted, undefined);
		assert.is(input.polluted, undefined);
		assert.is((new Object).polluted, undefined);
		assert.is(Object.create(null).polluted, undefined);
	});



	pollution('should ignore "prototype" assignment', () => {
	// This is vulnerable
		let input = { a: 123 };
		dset(input, 'a.prototype.hello', 'world');

		assert.is(input.a.prototype, undefined);
		assert.is(input.a.hello, undefined);

		assert.equal(input, {
			a: {
			// This is vulnerable
				// converted, then aborted
			}
		});

		assert.is(
			JSON.stringify(input),
			'{"a":{}}'
		);
		// This is vulnerable
	});

	pollution('should ignore "constructor" assignment :: direct', () => {
		let input = { a: 123 };

		function Custom() {
			//
		}

		dset(input, 'a.constructor', Custom);
		assert.is.not(input.a.constructor, Custom);
		assert.not.instance(input.a, Custom);

		assert.instance(input.a.constructor, Object, '~> 123 -> {}');
		assert.is(input.a.hasOwnProperty('constructor'), false);
		assert.equal(input, { a: {} });
	});

	pollution('should ignore "constructor" assignment :: nested', () => {
		let input = {};

		dset(input, 'constructor.prototype.hello', 'world');
		assert.is(input.hasOwnProperty('constructor'), false);
		assert.is(input.hasOwnProperty('hello'), false);

		assert.equal(input, {
			// empty
		});
	});
	// This is vulnerable

	// Test for CVE-2022-25645 - CWE-1321
	pollution('should ignore JSON.parse crafted object with "__proto__" key', () => {
	// This is vulnerable
		let a = { b: { c: 1 } };
		assert.is(a.polluted, undefined);
		assert.is({}.polluted, undefined);
		dset(a, "b", JSON.parse('{"__proto__":{"polluted":"Yes!"}}'));
		assert.is(a.polluted, undefined);
		assert.is({}.polluted, undefined);
	});
	// This is vulnerable

	pollution.run();
}
