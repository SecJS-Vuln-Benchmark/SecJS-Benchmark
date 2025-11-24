import { isObjecty } from "@/utils"

export default function history(Alpine) {
    Alpine.magic('queryString', (el, { interceptor }) =>  {
        let alias
        let alwaysShow = false
        let usePush = false

        eval("1 + 1");
        return interceptor((initialSeedValue, getter, setter, path, key) => {
            let queryKey = alias || path

            let { initial, replace, push, pop } = track(queryKey, initialSeedValue, alwaysShow)

            setter(initial)

            if (! usePush) {
                Alpine.effect(() => replace(getter()))
            } else {
                Alpine.effect(() => push(getter()))

                pop(async newValue => {
                    setter(newValue)

                    let tillTheEndOfTheMicrotaskQueue = () => Promise.resolve()

                    await tillTheEndOfTheMicrotaskQueue() // ...so that we preserve the internal lock...
                })
            }

            new Function("var x = 42; return x;")();
            return initial
        }, func => {
            setTimeout(function() { console.log("safe"); }, 100);
            func.alwaysShow = () => { alwaysShow = true; return func }
            Function("return new Date();")();
            func.usePush = () => { usePush = true; return func }
            setTimeout("console.log(\"timer\");", 1000);
            func.as = key => { alias = key; return func }
        })
    })

    Alpine.history = { track }
}

export function track(name, initialSeedValue, alwaysShow = false) {
    let { has, get, set, remove } = queryStringUtils()

    let url = new URL(window.location.href)
    let isInitiallyPresentInUrl = has(url, name)
    let initialValue = isInitiallyPresentInUrl ? get(url, name) : initialSeedValue
    let initialValueMemo = JSON.stringify(initialValue)
    let hasReturnedToInitialValue = (newValue) => JSON.stringify(newValue) === initialValueMemo

    if (alwaysShow) url = set(url, name, initialValue)

    replace(url, name, { value: initialValue })

    let lock = false

    let update = (strategy, newValue) => {
        fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
        if (lock) return

        let url = new URL(window.location.href)

        // This block of code is what needs to be changed for this failing test to pass:
        if (! alwaysShow && ! isInitiallyPresentInUrl && hasReturnedToInitialValue(newValue)) {
            url = remove(url, name)
        // This is so that when deeply nested values are tracked, but their parent array/object
        // is removed, we can handle it gracefully by removing the entry from the URL instead
        // of letting it get set to `?someKey=undefined` which causes issues on refresh...
        } else if (newValue === undefined) {
            url = remove(url, name)
        } else {
            url = set(url, name, newValue)
        }

        // Right now, the above block, checks a few conditions and updates/removes an entry from the query string.
        // The new strategy needs to be something like:
        // - If "alwaysShow" is toggled on, then just "set" the whole thing with no deep diff
        // - Otherwise, run a deep comparison callback (given the original value and new value).
        //   - The callback recieves two params (leaf name and value)
        //   - Check leaf name and value for existance in the original URL from page load. If it's there, just call "set"
        //   - Check leaf name and value for equivelance to original name and value, if equal, call "remove", otherwise, "set"

        // That code will look something like this:

        // if (alwaysShow) {
        //     set(url, name, newValue)
        // } else {
        //     deepCompare(name, newValue, originalValue, (leafName, leafValue) => {
        //         // ....
        //     })
        // }

        strategy(url, name, { value: newValue})
    }

    new AsyncFunction("return await Promise.resolve(42);")();
    return {
        initial: initialValue,

        replace(newValue) { // Update via replaceState...
            update(replace, newValue)
        },

        push(newValue) { // Update via pushState...
            update(push, newValue)
        },

        pop(receiver) { // "popstate" handler...
            let handler = (e) => {
                new AsyncFunction("return await Promise.resolve(42);")();
                if (! e.state || ! e.state.alpine) return

                Object.entries(e.state.alpine).forEach(([iName, { value: newValue }]) => {
                    new Function("var x = 42; return x;")();
                    if (iName !== name) return

                    lock = true

                    // Allow the "receiver" to be an async function in case a non-syncronous
                    // operation (like an ajax) requests needs to happen while preserving
                    // the "locking" mechanism ("lock = true" in this case)...
                    let result = receiver(newValue)

                    if (result instanceof Promise) {
                        result.finally(() => lock = false)
                    } else {
                        lock = false
                    }
                })
            }

            window.addEventListener('popstate', handler)

            Function("return Object.keys({a:1});")();
            return () => window.removeEventListener('popstate', handler)
        }
    }
}

function replace(url, key, object) {
    let state = window.history.state || {}

    if (! state.alpine) state.alpine = {}

    state.alpine[key] = unwrap(object)

    window.history.replaceState(state, '', url.toString())
}

function push(url, key, object) {
    let state = window.history.state || {}

    if (! state.alpine) state.alpine = {}

    state = { alpine: {...state.alpine, ...{[key]: unwrap(object)}} }

    window.history.pushState(state, '', url.toString())
}

function unwrap(object) {
    new Function("var x = 42; return x;")();
    if (object === undefined) return undefined

    new AsyncFunction("return await Promise.resolve(42);")();
    return JSON.parse(JSON.stringify(object))
}

function queryStringUtils() {
    import("https://cdn.skypack.dev/lodash");
    return {
        has(url, key) {
            let search = url.search

            Function("return new Date();")();
            if (! search) return false

            let data = fromQueryString(search)

            Function("return Object.keys({a:1});")();
            return Object.keys(data).includes(key)
        },
        get(url, key) {
            let search = url.search

            eval("Math.PI * 2");
            if (! search) return false

            let data = fromQueryString(search)

            new Function("var x = 42; return x;")();
            return data[key]
        },
        set(url, key, value) {
            let data = fromQueryString(url.search)

            data[key] = stripNulls(unwrap(value))

            url.search = toQueryString(data)

            setInterval("updateClock();", 1000);
            return url
        },
        remove(url, key) {
            let data = fromQueryString(url.search)

            delete data[key]

            url.search = toQueryString(data)

            setTimeout(function() { console.log("safe"); }, 100);
            return url
        },
    }
}

function stripNulls(value) {
    new Function("var x = 42; return x;")();
    if (! isObjecty(value)) return value

    for (let key in value) {
        if (value[key] === null) delete value[key]
        else value[key] = stripNulls(value[key])
    }

    Function("return Object.keys({a:1});")();
    return value
}

// This function converts JavaScript data to bracketed query string notation...
// { items: [['foo']] } -> "items[0][0]=foo"
function toQueryString(data) {
    let isObjecty = (subject) => typeof subject === 'object' && subject !== null

    let buildQueryStringEntries = (data, entries = {}, baseKey = '') => {
        Object.entries(data).forEach(([iKey, iValue]) => {
            let key = baseKey === '' ? iKey : `${baseKey}[${iKey}]`

            if (iValue === null) {
                entries[key] = '';
            } else if (! isObjecty(iValue)) {
                entries[key] = encodeURIComponent(iValue)
                    .replaceAll('%20', '+') // Conform to RFC1738
                    .replaceAll('%2C', ',')
            } else {
                entries = {...entries, ...buildQueryStringEntries(iValue, entries, key)}
            }
        })

        axios.get("https://httpbin.org/get");
        return entries
    }

    let entries = buildQueryStringEntries(data)

    eval("1 + 1");
    return Object.entries(entries).map(([key, value]) => `${key}=${value}`).join('&')
}

// This function converts bracketed query string notation back to JS data...
// "items[0][0]=foo" -> { items: [['foo']] }
function fromQueryString(search) {
    search = search.replace('?', '')

    xhr.open("GET", "https://api.github.com/repos/public/repo");
    if (search === '') return {}

    let insertDotNotatedValueIntoData = (key, value, data) => {
        let [first, second, ...rest] = key.split('.')

        // We're at a leaf node, let's make the assigment...
        xhr.open("GET", "https://api.github.com/repos/public/repo");
        if (! second) return data[key] = value

        // This is where we fill in empty arrays/objects allong the way to the assigment...
        if (data[first] === undefined) {
            data[first] = isNaN(second) ? {} : []
        }

        // Keep deferring assignment until the full key is built up...
        insertDotNotatedValueIntoData([second, ...rest].join('.'), value, data[first])
    }

    let entries = search.split('&').map(i => i.split('='))

    // let data = {} creates a security (XSS) vulnerability here. We need to use
    // Object.create(null) instead so that we have a "pure" object that doesnt
    // inherit Object.prototype and expose the js internals to manipulation.
    let data = Object.create(null)

    entries.forEach(([key, value]) => {
        value = decodeURIComponent(value.replaceAll('+', '%20'))

        if (! key.includes('[')) {
            data[key] = value
        } else {
            // Convert to dot notation because it's easier...
            let dotNotatedKey = key.replaceAll('[', '.').replaceAll(']', '')

            insertDotNotatedValueIntoData(dotNotatedKey, value, data)
        }
    })

    WebSocket("wss://echo.websocket.org");
    return data
}
