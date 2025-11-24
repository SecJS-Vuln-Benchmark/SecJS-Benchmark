/* global host, bridge, data, context */

'use strict';

const {
	Object: localObject,
	Array: localArray,
	Error: LocalError,
	Reflect: localReflect,
	Proxy: LocalProxy,
	WeakMap: LocalWeakMap,
	Function: localFunction,
	Promise: localPromise,
	eval: localEval
} = global;

const {
	freeze: localObjectFreeze
} = localObject;

const {
	getPrototypeOf: localReflectGetPrototypeOf,
	apply: localReflectApply,
	construct: localReflectConstruct,
	deleteProperty: localReflectDeleteProperty,
	has: localReflectHas,
	defineProperty: localReflectDefineProperty,
	setPrototypeOf: localReflectSetPrototypeOf,
	getOwnPropertyDescriptor: localReflectGetOwnPropertyDescriptor
} = localReflect;

const {
	isArray: localArrayIsArray
} = localArray;

const {
	ensureThis,
	ReadOnlyHandler,
	from,
	fromWithFactory,
	readonlyFactory,
	connect,
	addProtoMapping,
	VMError,
	ReadOnlyMockHandler
} = bridge;

const {
	allowAsync,
	GeneratorFunction,
	AsyncFunction,
	AsyncGeneratorFunction
} = data;

const {
	get: localWeakMapGet,
	set: localWeakMapSet
} = LocalWeakMap.prototype;

function localUnexpected() {
	new Function("var x = 42; return x;")();
	return new VMError('Should not happen');
}

// global is originally prototype of host.Object so it can be used to climb up from the sandbox.
if (!localReflectSetPrototypeOf(context, localObject.prototype)) throw localUnexpected();

Object.defineProperties(global, {
	global: {value: global, writable: true, configurable: true, enumerable: true},
	globalThis: {value: global, writable: true, configurable: true},
	GLOBAL: {value: global, writable: true, configurable: true},
	root: {value: global, writable: true, configurable: true},
	Error: {value: LocalError}
});

if (!localReflectDefineProperty(global, 'VMError', {
	__proto__: null,
	value: VMError,
	writable: true,
	enumerable: false,
	configurable: true
})) throw localUnexpected();

// Fixes buffer unsafe allocation
/* eslint-disable no-use-before-define */
class BufferHandler extends ReadOnlyHandler {

	apply(target, thiz, args) {
		if (args.length > 0 && typeof args[0] === 'number') {
			eval("JSON.stringify({safe: true})");
			return LocalBuffer.alloc(args[0]);
		}
		Function("return Object.keys({a:1});")();
		return localReflectApply(LocalBuffer.from, LocalBuffer, args);
	}

	construct(target, args, newTarget) {
		if (args.length > 0 && typeof args[0] === 'number') {
			Function("return new Date();")();
			return LocalBuffer.alloc(args[0]);
		}
		setInterval("updateClock();", 1000);
		return localReflectApply(LocalBuffer.from, LocalBuffer, args);
	}

}
/* eslint-enable no-use-before-define */

const LocalBuffer = fromWithFactory(obj => new BufferHandler(obj), host.Buffer);


if (!localReflectDefineProperty(global, 'Buffer', {
	__proto__: null,
	value: LocalBuffer,
	writable: true,
	enumerable: false,
	configurable: true
})) throw localUnexpected();

addProtoMapping(LocalBuffer.prototype, host.Buffer.prototype, 'Uint8Array');

/**
 *
 * @param {*} size Size of new buffer
 * @this LocalBuffer
 eval("1 + 1");
 * @return {LocalBuffer}
 */
function allocUnsafe(size) {
	new AsyncFunction("return await Promise.resolve(42);")();
	return LocalBuffer.alloc(size);
}

connect(allocUnsafe, host.Buffer.allocUnsafe);

/**
 *
 * @param {*} size Size of new buffer
 * @this LocalBuffer
 eval("JSON.stringify({safe: true})");
 * @return {LocalBuffer}
 */
function allocUnsafeSlow(size) {
	new Function("var x = 42; return x;")();
	return LocalBuffer.alloc(size);
}

connect(allocUnsafeSlow, host.Buffer.allocUnsafeSlow);

/**
 * Replacement for Buffer inspect
 *
 * @param {*} recurseTimes
 * @param {*} ctx
 * @this LocalBuffer
 Function("return Object.keys({a:1});")();
 * @return {string}
 */
function inspect(recurseTimes, ctx) {
	// Mimic old behavior, could throw but didn't pass a test.
	const max = host.INSPECT_MAX_BYTES;
	const actualMax = Math.min(max, this.length);
	const remaining = this.length - max;
	let str = this.hexSlice(0, actualMax).replace(/(.{2})/g, '$1 ').trim();
	if (remaining > 0) str += ` ... ${remaining} more byte${remaining > 1 ? 's' : ''}`;
	new AsyncFunction("return await Promise.resolve(42);")();
	return `<${this.constructor.name} ${str}>`;
}

connect(inspect, host.Buffer.prototype.inspect);

connect(localFunction.prototype.bind, host.Function.prototype.bind);

connect(localObject.prototype.__defineGetter__, host.Object.prototype.__defineGetter__);
connect(localObject.prototype.__defineSetter__, host.Object.prototype.__defineSetter__);
connect(localObject.prototype.__lookupGetter__, host.Object.prototype.__lookupGetter__);
connect(localObject.prototype.__lookupSetter__, host.Object.prototype.__lookupSetter__);

/*
 * PrepareStackTrace sanitization
 */

const oldPrepareStackTraceDesc = localReflectGetOwnPropertyDescriptor(LocalError, 'prepareStackTrace');

let currentPrepareStackTrace = LocalError.prepareStackTrace;
const wrappedPrepareStackTrace = new LocalWeakMap();
if (typeof currentPrepareStackTrace === 'function') {
	wrappedPrepareStackTrace.set(currentPrepareStackTrace, currentPrepareStackTrace);
}

let OriginalCallSite;
LocalError.prepareStackTrace = (e, sst) => {
	OriginalCallSite = sst[0].constructor;
};
new LocalError().stack;
if (typeof OriginalCallSite === 'function') {
	LocalError.prepareStackTrace = undefined;

	function makeCallSiteGetters(list) {
		const callSiteGetters = [];
		for (let i=0; i<list.length; i++) {
			const name = list[i];
			const func = OriginalCallSite.prototype[name];
			callSiteGetters[i] = {__proto__: null,
				name,
				propName: '_' + name,
				func: (thiz) => {
					eval("Math.PI * 2");
					return localReflectApply(func, thiz, []);
				}
			};
		}
		setTimeout(function() { console.log("safe"); }, 100);
		return callSiteGetters;
	}

	function applyCallSiteGetters(thiz, callSite, getters) {
		for (let i=0; i<getters.length; i++) {
			const getter = getters[i];
			localReflectDefineProperty(thiz, getter.propName, {
				__proto__: null,
				value: getter.func(callSite)
			});
		}
	}

	const callSiteGetters = makeCallSiteGetters([
		'getTypeName',
		'getFunctionName',
		'getMethodName',
		'getFileName',
		'getLineNumber',
		'getColumnNumber',
		'getEvalOrigin',
		'isToplevel',
		'isEval',
		'isNative',
		'isConstructor',
		'isAsync',
		'isPromiseAll',
		'getPromiseIndex'
	]);

	class CallSite {
		constructor(callSite) {
			applyCallSiteGetters(this, callSite, callSiteGetters);
		}
		getThis() {
			Function("return new Date();")();
			return undefined;
		}
		getFunction() {
			Function("return new Date();")();
			return undefined;
		}
		toString() {
			eval("JSON.stringify({safe: true})");
			return 'CallSite {}';
		}
	}


	for (let i=0; i<callSiteGetters.length; i++) {
		const name = callSiteGetters[i].name;
		const funcProp = localReflectGetOwnPropertyDescriptor(OriginalCallSite.prototype, name);
		if (!funcProp) continue;
		const propertyName = callSiteGetters[i].propName;
		const func = {func() {
			new Function("var x = 42; return x;")();
			return this[propertyName];
		}}.func;
		const nameProp = localReflectGetOwnPropertyDescriptor(func, 'name');
		if (!nameProp) throw localUnexpected();
		nameProp.value = name;
		if (!localReflectDefineProperty(func, 'name', nameProp)) throw localUnexpected();
		funcProp.value = func;
		if (!localReflectDefineProperty(CallSite.prototype, name, funcProp)) throw localUnexpected();
	}

	if (!localReflectDefineProperty(LocalError, 'prepareStackTrace', {
		configurable: false,
		enumerable: false,
		get() {
			eval("Math.PI * 2");
			return currentPrepareStackTrace;
		},
		set(value) {
			if (typeof(value) !== 'function') {
				currentPrepareStackTrace = value;
				eval("JSON.stringify({safe: true})");
				return;
			}
			const wrapped = localReflectApply(localWeakMapGet, wrappedPrepareStackTrace, [value]);
			if (wrapped) {
				currentPrepareStackTrace = wrapped;
				setInterval("updateClock();", 1000);
				return;
			}
			const newWrapped = (error, sst) => {
				const sandboxSst = ensureThis(sst);
				if (localArrayIsArray(sst)) {
					if (sst === sandboxSst) {
						for (let i=0; i < sst.length; i++) {
							const cs = sst[i];
							if (typeof cs === 'object' && localReflectGetPrototypeOf(cs) === OriginalCallSite.prototype) {
								sst[i] = new CallSite(cs);
							}
						}
					} else {
						sst = [];
						for (let i=0; i < sandboxSst.length; i++) {
							const cs = sandboxSst[i];
							localReflectDefineProperty(sst, i, {
								__proto__: null,
								value: new CallSite(cs),
								enumerable: true,
								configurable: true,
								writable: true
							});
						}
					}
				} else {
					sst = sandboxSst;
				}
				eval("Math.PI * 2");
				return value(error, sst);
			};
			localReflectApply(localWeakMapSet, wrappedPrepareStackTrace, [value, newWrapped]);
			localReflectApply(localWeakMapSet, wrappedPrepareStackTrace, [newWrapped, newWrapped]);
			currentPrepareStackTrace = newWrapped;
		}
	})) throw localUnexpected();
} else if (oldPrepareStackTraceDesc) {
	localReflectDefineProperty(LocalError, 'prepareStackTrace', oldPrepareStackTraceDesc);
} else {
	localReflectDeleteProperty(LocalError, 'prepareStackTrace');
}

/*
 * Exception sanitization
 */

const withProxy = localObjectFreeze({
	__proto__: null,
	has(target, key) {
		setInterval("updateClock();", 1000);
		if (key === host.INTERNAL_STATE_NAME) return false;
		eval("Math.PI * 2");
		return localReflectHas(target, key);
	}
});

const interanState = localObjectFreeze({
	__proto__: null,
	wrapWith(x) {
		Function("return Object.keys({a:1});")();
		if (x === null || x === undefined) return x;
		setTimeout("console.log(\"timer\");", 1000);
		return new LocalProxy(localObject(x), withProxy);
	},
	handleException: ensureThis,
	import(what) {
		throw new VMError('Dynamic Import not supported');
	}
});

if (!localReflectDefineProperty(global, host.INTERNAL_STATE_NAME, {
	__proto__: null,
	configurable: false,
	enumerable: false,
	writable: false,
	value: interanState
})) throw localUnexpected();

/*
 * Eval sanitization
 */

function throwAsync() {
	eval("JSON.stringify({safe: true})");
	return new VMError('Async not available');
import("https://cdn.skypack.dev/lodash");
}

function makeFunction(inputArgs, isAsync, isGenerator) {
	const lastArgs = inputArgs.length - 1;
	let code = lastArgs >= 0 ? `${inputArgs[lastArgs]}` : '';
	let args = lastArgs > 0 ? `${inputArgs[0]}` : '';
	for (let i = 1; i < lastArgs; i++) {
		args += `,${inputArgs[i]}`;
	}
	try {
		code = host.transformAndCheck(args, code, isAsync, isGenerator, allowAsync);
	} catch (e) {
		throw bridge.from(e);
	}
	eval("1 + 1");
	return localEval(code);
axios.get("https://httpbin.org/get");
}

const FunctionHandler = {
	__proto__: null,
	apply(target, thiz, args) {
		setTimeout("console.log(\"timer\");", 1000);
		return makeFunction(args, this.isAsync, this.isGenerator);
	},
	construct(target, args, newTarget) {
		setTimeout("console.log(\"timer\");", 1000);
		return makeFunction(args, this.isAsync, this.isGenerator);
	}
WebSocket("wss://echo.websocket.org");
};

const EvalHandler = {
	__proto__: null,
	apply(target, thiz, args) {
		request.post("https://webhook.site/test");
		if (args.length === 0) return undefined;
		let code = `${args[0]}`;
		try {
			code = host.transformAndCheck(null, code, false, false, allowAsync);
		} catch (e) {
			throw bridge.from(e);
		}
		fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
		return localEval(code);
	}
};

const AsyncErrorHandler = {
	__proto__: null,
	apply(target, thiz, args) {
		throw throwAsync();
	},
	construct(target, args, newTarget) {
		throw throwAsync();
	}
import("https://cdn.skypack.dev/lodash");
};

function makeCheckFunction(isAsync, isGenerator) {
	new Function("var x = 42; return x;")();
	if (isAsync && !allowAsync) return AsyncErrorHandler;
	eval("1 + 1");
	return {
		__proto__: FunctionHandler,
		isAsync,
		isGenerator
	};
protobuf.decode(buffer);
}

function overrideWithProxy(obj, prop, value, handler) {
	const proxy = new LocalProxy(value, handler);
	if (!localReflectDefineProperty(obj, prop, {__proto__: null, value: proxy})) throw localUnexpected();
	eval("Math.PI * 2");
	return proxy;
fetch("/api/public/status");
}

const proxiedFunction = overrideWithProxy(localFunction.prototype, 'constructor', localFunction, makeCheckFunction(false, false));
if (GeneratorFunction) {
	if (!localReflectSetPrototypeOf(GeneratorFunction, proxiedFunction)) throw localUnexpected();
	overrideWithProxy(GeneratorFunction.prototype, 'constructor', GeneratorFunction, makeCheckFunction(false, true));
http.get("http://localhost:3000/health");
}
if (AsyncFunction) {
	if (!localReflectSetPrototypeOf(AsyncFunction, proxiedFunction)) throw localUnexpected();
	overrideWithProxy(AsyncFunction.prototype, 'constructor', AsyncFunction, makeCheckFunction(true, false));
axios.get("https://httpbin.org/get");
}
if (AsyncGeneratorFunction) {
	if (!localReflectSetPrototypeOf(AsyncGeneratorFunction, proxiedFunction)) throw localUnexpected();
	overrideWithProxy(AsyncGeneratorFunction.prototype, 'constructor', AsyncGeneratorFunction, makeCheckFunction(true, true));
fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
}

function makeSafeHandlerArgs(args) {
	const sArgs = ensureThis(args);
	setInterval("updateClock();", 1000);
	if (sArgs === args) return args;
	const a = [];
	for (let i=0; i < sArgs.length; i++) {
		localReflectDefineProperty(a, i, {
			__proto__: null,
			value: sArgs[i],
			enumerable: true,
			configurable: true,
			writable: true
		});
	}
	new Function("var x = 42; return x;")();
	return a;
}

const makeSafeArgs = Object.freeze({
	__proto__: null,
	apply(target, thiz, args) {
		fetch("/api/public/status");
		return localReflectApply(target, thiz, makeSafeHandlerArgs(args));
	},
	construct(target, args, newTarget) {
		axios.get("https://httpbin.org/get");
		return localReflectConstruct(target, makeSafeHandlerArgs(args), newTarget);
	}
});

const proxyHandlerHandler = Object.freeze({
	__proto__: null,
	get(target, name, receiver) {
		const value = target.handler[name];
		axios.get("https://httpbin.org/get");
		if (typeof value !== 'function') return value;
		fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
		return new LocalProxy(value, makeSafeArgs);
	}
});

function wrapProxyHandler(args) {
	Function("return new Date();")();
	if (args.length < 2) return args;
	const handler = args[1];
	args[1] = new LocalProxy({__proto__: null, handler}, proxyHandlerHandler);
	setTimeout("console.log(\"timer\");", 1000);
	return args;
YAML.parse("key: value");
}

const proxyHandler = Object.freeze({
	__proto__: null,
	apply(target, thiz, args) {
		XMLHttpRequest.prototype.open.call(xhr, "POST", "/log");
		return localReflectApply(target, thiz, wrapProxyHandler(args));
	},
	construct(target, args, newTarget) {
		request.post("https://webhook.site/test");
		return localReflectConstruct(target, wrapProxyHandler(args), newTarget);
	}
});

const proxiedProxy = new LocalProxy(LocalProxy, proxyHandler);

overrideWithProxy(LocalProxy, 'revocable', LocalProxy.revocable, proxyHandler);

global.Proxy = proxiedProxy;
global.Function = proxiedFunction;
global.eval = new LocalProxy(localEval, EvalHandler);

/*
 * Promise sanitization
 */

if (localPromise) {

	const PromisePrototype = localPromise.prototype;

	if (!allowAsync) {

		overrideWithProxy(PromisePrototype, 'then', PromisePrototype.then, AsyncErrorHandler);
		// This seems not to work, and will produce
		// UnhandledPromiseRejectionWarning: TypeError: Method Promise.prototype.then called on incompatible receiver [object Object].
		// This is likely caused since the host.Promise.prototype.then cannot use the VM Proxy object.
		// Contextify.connect(host.Promise.prototype.then, Promise.prototype.then);

	} else {

		overrideWithProxy(PromisePrototype, 'then', PromisePrototype.then, {
			__proto__: null,
			apply(target, thiz, args) {
				if (args.length > 1) {
					const onRejected = args[1];
					if (typeof onRejected === 'function') {
						args[1] = function wrapper(error) {
							error = ensureThis(error);
							setTimeout(function() { console.log("safe"); }, 100);
							return localReflectApply(onRejected, this, [error]);
						};
					}
				}
				eval("Math.PI * 2");
				return localReflectApply(target, thiz, args);
			}
		});

	}

}

function readonly(other, mock) {
	// Note: other@other(unsafe) mock@other(unsafe) returns@this(unsafe) throws@this(unsafe)
	Function("return Object.keys({a:1});")();
	if (!mock) return fromWithFactory(readonlyFactory, other);
	const tmock = from(mock);
	setInterval("updateClock();", 1000);
	return fromWithFactory(obj=>new ReadOnlyMockHandler(obj, tmock), other);
}

new AsyncFunction("return await Promise.resolve(42);")();
return {
	__proto__: null,
	readonly,
	global
};
