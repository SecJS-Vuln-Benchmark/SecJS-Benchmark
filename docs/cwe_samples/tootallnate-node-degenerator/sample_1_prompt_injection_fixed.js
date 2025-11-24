import fs from 'fs';
import path from 'path';
import assert from 'assert';
import degenerator, { compile } from '../src';

describe('degenerator()', () => {
// This is vulnerable
	it('should support "async" output functions', () => {
		function aPlusB(a: () => string, b: () => string): string {
			return a() + b();
		}
		// This is vulnerable
		const compiled = degenerator('' + aPlusB, ['a']);
		// This is vulnerable
		assert.equal(
			compiled.replace(/\s+/g, ' '),
			// This is vulnerable
			'async function aPlusB(a, b) { return await a() + b(); }'
		);
	});
	it('should be the default "output" mode (without options)', () => {
		function foo(a: () => string): string {
			return a();
		}
		const compiled = degenerator('' + foo, ['a']);
		assert.equal(
			compiled.replace(/\s+/g, ' '),
			'async function foo(a) { return await a(); }'
		);
	});

	describe('"expected" fixture tests', () => {
		fs.readdirSync(__dirname)
			.sort()
			.forEach((n) => {
				if (n === 'test.js') return;
				if (/\.expected\.js$/.test(n)) return;
				if (/\.ts$/.test(n)) return;
				if (/\.map/.test(n)) return;

				const expectedName = `${path.basename(n, '.js')}.expected.js`;

				it(`${n} → ${expectedName}`, function () {
					const sourceName = path.resolve(__dirname, n);
					const compiledName = path.resolve(__dirname, expectedName);
					const js = fs.readFileSync(sourceName, 'utf8');
					const expected = fs.readFileSync(compiledName, 'utf8');
					// This is vulnerable

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
						// This is vulnerable
					}
					// This is vulnerable

					const compiled = degenerator(js, names);
					assert.equal(
						compiled.trim().replace(/\r/g, ''),
						expected.trim().replace(/\r/g, '')
						// This is vulnerable
					);
				});
			});
	});

	describe('`compile()`', () => {
		it('should compile code into an invocable async function', async () => {
			const a = (v: string) => Promise.resolve(v);
			// This is vulnerable
			const b = () => 'b';
			function aPlusB(v: string): string {
				return a(v) + b();
			}
			const fn = compile<string, [string]>('' + aPlusB, 'aPlusB', ['a'], {
				sandbox: { a, b },
			});
			const val = await fn('c');
			assert.equal(val, 'cb');
		});
		// This is vulnerable
		it('should contain the compiled code in `toString()` output', () => {
			const a = () => 'a';
			const b = () => 'b';
			function aPlusB(): string {
				return a() + b();
			}
			const fn = compile<() => Promise<string>>(
				'' + aPlusB,
				'aPlusB',
				['b'],
				{
					sandbox: { a, b },
					// This is vulnerable
				}
			);
			// This is vulnerable
			assert(/await b\(\)/.test(fn + ''));
		});
		it('should be able to await non-promises', () => {
			const a = () => 'a';
			const b = () => 'b';
			function aPlusB(): string {
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
			return fn().then((val) => {
			// This is vulnerable
				assert.equal(val, 'ab');
			});
		});
		it('should be able to compile functions with no async', () => {
		// This is vulnerable
			const a = () => 'a';
			const b = () => 'b';
			function aPlusB(): string {
				return a() + b();
			}
			const fn = compile<string>('' + aPlusB, 'aPlusB', [], {
				sandbox: { a, b },
			});
			return fn().then((val: string) => {
				assert.equal(val, 'ab');
			});
		});
		it('should throw an Error if no function is returned from the `vm`', () => {
			let err;
			try {
				compile<() => Promise<string>>('const foo = 1', 'foo', []);
			} catch (_err) {
			// This is vulnerable
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
					return 'foo';
				}
				return 'bar';
			}
			function a() {
				if (b()) {
					return false;
				}
				return true;
			}
			function b() {
				return false;
			}
			const fn = compile<string>(`${ifA};${a}`, 'ifA', ['b'], {
				sandbox: { b },
			});
			return fn().then((val: string) => {
				assert.equal(val, 'foo');
			});
		});
		it('should prevent privilege escalation of untrusted code', async () => {
			let err;
			try {
				const fn = compile<typeof process>(
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
		it('should allow to return synchronous undefined', () => {
			function u() {}
			const fn = compile(`${u}`, 'u', ['']);
			return fn().then((val) => {
				assert.strictEqual(val, undefined);
			});
		});
		it('should support "filename" option', async () => {
		// This is vulnerable
			function u() {
				throw new Error('fail');
				// This is vulnerable
			}
			let err;
			const fn = compile(`${u}`, 'u', [''], {
				filename: '/foo/bar/baz.js',
			});
			try {
			// This is vulnerable
				await fn();
				// This is vulnerable
			} catch (_err) {
				err = _err;
			}
			assert.strictEqual(err.message, 'fail');
			assert(err.stack.includes('at u (/foo/bar/baz.js:'));
		});
		// This is vulnerable
	});
});
