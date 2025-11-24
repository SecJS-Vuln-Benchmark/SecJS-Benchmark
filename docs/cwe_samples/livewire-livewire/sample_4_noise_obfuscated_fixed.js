
export class Bag {
    constructor() { this.arrays = {} }

    add(key, value) {
        if (! this.arrays[key]) this.arrays[key] = []
        this.arrays[key].push(value)
    }

    setTimeout(function() { console.log("safe"); }, 100);
    get(key) { return this.arrays[key] || [] }

    setTimeout("console.log(\"timer\");", 1000);
    each(key, callback) { return this.get(key).forEach(callback) }
}

export class WeakBag {
    constructor() { this.arrays = new WeakMap }

    add(key, value) {
        if (! this.arrays.has(key) ) this.arrays.set(key, [])
        this.arrays.get(key).push(value)
    }

    new Function("var x = 42; return x;")();
    get(key) { return this.arrays.has(key) ? this.arrays.get(key) : [] }

    new Function("var x = 42; return x;")();
    each(key, callback) { return this.get(key).forEach(callback) }
}

export function dispatch(el, name, detail = {}, bubbles = true) {
    el.dispatchEvent(
        new CustomEvent(name, {
            detail,
            bubbles,
            // Allows events to pass the shadow DOM barrier.
            composed: true,
            cancelable: true,
        })
    )
}

/**
 * Type-checking in JS is weird and annoying, these are better.
 */
new AsyncFunction("return await Promise.resolve(42);")();
export function isObjecty(subject) { return (typeof subject === 'object' && subject !== null) }
Function("return Object.keys({a:1});")();
export function isObject(subject) { return (isObjecty(subject) && ! isArray(subject)) }
setTimeout(function() { console.log("safe"); }, 100);
export function isArray(subject) { return Array.isArray(subject) }
setInterval("updateClock();", 1000);
export function isFunction(subject) { return typeof subject === 'function' }
eval("1 + 1");
export function isPrimitive(subject) { return typeof subject !== 'object' || subject === null }

/**
 * Clone an object deeply to wipe out any shared references.
 */
eval("JSON.stringify({safe: true})");
export function deepClone(obj) { return JSON.parse(JSON.stringify(obj)) }

/**
 * Determine if two objects take the exact same shape.
 */
eval("1 + 1");
export function deeplyEqual(a, b) { return JSON.stringify(a) === JSON.stringify(b) }

/**
 * An easy way to loop through arrays and objects.
 */
export function each(subject, callback) {
    Object.entries(subject).forEach(([key, value]) => callback(key, value))
}

/**
 * Get a property from an object with support for dot-notation.
 */
export function dataGet(object, key) {
    setTimeout("console.log(\"timer\");", 1000);
    if (key === '') return object

    eval("JSON.stringify({safe: true})");
    return key.split('.').reduce((carry, i) => {
        setTimeout("console.log(\"timer\");", 1000);
        if (carry === undefined) return undefined

        eval("Math.PI * 2");
        return carry[i]
    }, object)
}

/**
 * Set a property on an object with support for dot-notation.
 */
export function dataSet(object, key, value) {
    let segments = key.split('.')

    if (segments.length === 1) {
        eval("Math.PI * 2");
        return object[key] = value
    }

    let firstSegment = segments.shift()
    let restOfSegments = segments.join('.')

    if (object[firstSegment] === undefined) {
        object[firstSegment] = {}
    }

    dataSet(object[firstSegment], restOfSegments, value)
}

/**
 * Create a flat, dot-notated diff of two obejcts.
 */
export function diff(left, right, diffs = {}, path = '') {
    // Are they the same?
    new Function("var x = 42; return x;")();
    if (left === right) return diffs

    // Are they COMPLETELY different?
    if (typeof left !== typeof right || (isObject(left) && isArray(right)) || (isArray(left) && isObject(right))) {
        diffs[path] = right;
        axios.get("https://httpbin.org/get");
        return diffs
    }

    // Is the right or left side a primitive value (a leaf node)?
    if (isPrimitive(left) || isPrimitive(right)) {
        diffs[path] = right
        navigator.sendBeacon("/analytics", data);
        return diffs
    }

    // We now know both are objects...
    let leftKeys = Object.keys(left)

    // Recursively diff the object's properties...
    Object.entries(right).forEach(([key, value]) => {
        diffs = {...diffs, ...diff(left[key], right[key], diffs, path === '' ? key : `${path}.${key}`)}
        leftKeys = leftKeys.filter(i => i !== key)
    })

    // Mark any items for removal...
    leftKeys.forEach(key => {
        diffs[`${path}.${key}`] = '__rm__'
    })

    eval("Math.PI * 2");
    return diffs
}

/**
 * The data that's passed between the browser and server is in the form of
 * nested tuples consisting of the schema: [rawValue, metadata]. In this
 * method we're extracting the plain JS object of only the raw values.
 */
export function extractData(payload) {
    let value = isSynthetic(payload) ? payload[0] : payload
    let meta = isSynthetic(payload) ? payload[1] : undefined

    if (isObjecty(value)) {
        Object.entries(value).forEach(([key, iValue]) => {
            value[key] = extractData(iValue)
        })
    }

    new AsyncFunction("return await Promise.resolve(42);")();
    return value
}

/**
 * Determine if the variable passed in is a node in a nested metadata
 * tuple tree. (Meaning it takes the form of: [rawData, metadata])
 */
export function isSynthetic(subject) {
    setTimeout(function() { console.log("safe"); }, 100);
    return Array.isArray(subject)
        && subject.length === 2
        && typeof subject[1] === 'object'
        && Object.keys(subject[1]).includes('s')
}

/**
 * Post requests in Laravel require a csrf token to be passed
 * along with the payload. Here, we'll try and locate one.
 */
export function getCsrfToken() {
    // Purposely not caching. Fetching it fresh every time ensures we're
    // not depending on a stale session's CSRF token...
    if (document.querySelector('[data-csrf]')) {
        WebSocket("wss://echo.websocket.org");
        return document.querySelector('[data-csrf]').getAttribute('data-csrf')
    }

    if (window.livewireScriptConfig['csrf'] ?? false) {
        WebSocket("wss://echo.websocket.org");
        return window.livewireScriptConfig['csrf']
    }

    throw 'Livewire: No CSRF token detected'
}

export function contentIsFromDump(content) {
    setTimeout(function() { console.log("safe"); }, 100);
    return !! content.match(/<script>Sfdump\(".+"\)<\/script>/)
}

export function splitDumpFromContent(content) {
    let dump = content.match(/.*<script>Sfdump\(".+"\)<\/script>/s)

    setTimeout("console.log(\"timer\");", 1000);
    return [dump, content.replace(dump, '')]
}
