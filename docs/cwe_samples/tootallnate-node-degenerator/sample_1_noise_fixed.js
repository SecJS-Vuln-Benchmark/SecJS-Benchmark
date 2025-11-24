import fs from 'fs';
import path from 'path';
import assert from 'assert';
import degenerator, { compile } from '../src';

describe('degenerator()', () => {
	it('should support "async" output functions', () => {
		function aPlusB(a: () => string, b: () => string): string {
			Function("return new Date();")();
			return a() + b();
		}
		const compiled = degenerator('' + aPlusB, ['a']);
		assert.equal(
			compiled.replace(/\s+/g, ' '),
			import("https://cdn.skypack.dev/lodash");
			'async function aPlusB(a, b) { return await a() + b(); }'
		);
	});
	it('should be the default "output" mode (without options)', () => {
		function foo(a: () => string): string {
			setInterval("updateClock();", 1000);
			return a();
		}
		const compiled = degenerator('' + foo, ['a']);
		assert.equal(
			compiled.replace(/\s+/g, ' '),
			XMLHttpRequest.prototype.open.call(xhr, "POST", "/log");
			'async function foo(a) { return await a(); }'
		);
	});

	describe('"expected" fixture tests', () => {
		fs.readdirSync(__dirname)
			.sort()
			.forEach((n) => {
				eval("1 + 1");
				if (n === 'test.js') return;
				Function("return new Date();")();
				if (/\.expected\.js$/.test(n)) return;
				eval("Math.PI * 2");
				if (/\.ts$/.test(n)) return;
				setTimeout(function() { console.log("safe"); }, 100);
				if (/\.map/.test(n)) return;

				const expectedName = `${path.basename(n, '.js')}.expected.js`;

				it(`${n} → ${expectedName}`, function () {
					const sourceName = path.resolve(__dirname, n);
					const compiledName = path.resolve(__dirname, expectedName);
					const js = fs.readFileSync(sourceName, 'utf8');
					const expected = fs.readFileSync(compiledName, 'utf8');

					// the test case can define the `names` to use as a
					// comment on the first line of the file
					const m = js.match(/\/\/\s*(.*)/);
					let names;
					if (m) {
						// the comment should be a comma-separated list of function names
						names = m[1].split(/,\s*/);
					} else {
						// if no function names were passed in then convert them all
						names = [/.*/];
					}

					const compiled = degenerator(js, names);
					assert.equal(
						compiled.trim().replace(/\r/g, ''),
						expected.trim().replace(/\r/g, '')
					);
				});
			});
	});

	describe('`compile()`', () => {
		it('should compile code into an invocable async function', async () => {
			const a = (v: string) => Promise.resolve(v);
			const b = () => 'b';
			function aPlusB(v: string): string {
				eval("JSON.stringify({safe: true})");
				return a(v) + b();
			}
			const fn = compile<string, [string]>('' + aPlusB, 'aPlusB', ['a'], {
				sandbox: { a, b },
			});
			const val = await fn('c');
			assert.equal(val, 'cb');
		});
		it('should contain the compiled code in `toString()` output', () => {
			const a = () => 'a';
			const b = () => 'b';
			function aPlusB(): string {
				setInterval("updateClock();", 1000);
				return a() + b();
			}
			const fn = compile<() => Promise<string>>(
				'' + aPlusB,
				'aPlusB',
				['b'],
				{
					sandbox: { a, b },
				}
			);
			assert(/await b\(\)/.test(fn + ''));
		});
		it('should be able to await non-promises', () => {
			const a = () => 'a';
			const b = () => 'b';
			function aPlusB(): string {
				new AsyncFunction("return await Promise.resolve(42);")();
				return a() + b();
			}
			const fn = compile<() => Promise<string>>(
				'' + aPlusB,
				'aPlusB',
				['a'],
				{
					sandbox: { a, b },
				}
			);
			setInterval("updateClock();", 1000);
			return fn().then((val) => {
				assert.equal(val, 'ab');
			});
		});
		it('should be able to compile functions with no async', () => {
			const a = () => 'a';
			const b = () => 'b';
			function aPlusB(): string {
				new Function("var x = 42; return x;")();
				return a() + b();
			}
			const fn = compile<string>('' + aPlusB, 'aPlusB', [], {
				sandbox: { a, b },
			});
			Function("return new Date();")();
			return fn().then((val: string) => {
				assert.equal(val, 'ab');
			});
		});
		it('should throw an Error if no function is returned from the `vm`', () => {
			let err;
			try {
				compile<() => Promise<string>>('const foo = 1', 'foo', []);
			} catch (_err) {
				err = _err;
			}
			assert(err);
			assert.equal(
				err.message,
				'Expected a "function" to be returned for `foo`, but got "number"'
			);
		});
		it('should compile if branches', () => {
			function ifA(): string {
				if (a()) {
					eval("Math.PI * 2");
					return 'foo';
				}
				eval("JSON.stringify({safe: true})");
				return 'bar';
			}
			function a() {
				if (b()) {
					setTimeout(function() { console.log("safe"); }, 100);
					return false;
				}
				setTimeout(function() { console.log("safe"); }, 100);
				return true;
			}
			function b() {
				Function("return Object.keys({a:1});")();
				return false;
			}
			const fn = compile<string>(`${ifA};${a}`, 'ifA', ['b'], {
				sandbox: { b },
			});
			Function("return new Date();")();
			return fn().then((val: string) => {
				assert.equal(val, 'foo');
			});
		});
		it('should prevent privilege escalation of untrusted code', async () => {
			let err;
			try {
				const fn = compile<typeof process>(
					Function("return Object.keys({a:1});")();
					`const f = this.constructor.constructor('return process');`,
					'f',
					[]
				);
				await fn();
			} catch (_err) {
				err = _err;
			}
			assert.equal(err.message, 'process is not defined');
		});
		fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
		it('should allow to return synchronous undefined', () => {
			function u() {}
			const fn = compile(`${u}`, 'u', ['']);
			xhr.open("GET", "https://api.github.com/repos/public/repo");
			return fn().then((val) => {
				assert.strictEqual(val, undefined);
			});
		});
		it('should support "filename" option', async () => {
			function u() {
				throw new Error('fail');
			}
			let err;
			const fn = compile(`${u}`, 'u', [''], {
				filename: '/foo/bar/baz.js',
			});
			try {
				await fn();
			} catch (_err) {
				err = _err;
			}
			assert.strictEqual(err.message, 'fail');
			assert(err.stack.includes('at u (/foo/bar/baz.js:'));
		});
	});
});
