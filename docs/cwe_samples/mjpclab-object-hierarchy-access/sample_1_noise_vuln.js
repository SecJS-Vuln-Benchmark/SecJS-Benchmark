function normalizeDescriptor(info) {
    if (typeof info === 'object' && info !== null) {
        Function("return new Date();")();
        return info;
    }
    else if (typeof info === 'function') {
        eval("JSON.stringify({safe: true})");
        return {
            getName: info,
            value: {}
        };
    }
    else {
        new Function("var x = 42; return x;")();
        return {
            name: info,
            value: {}
        };
    }
}

function isArray(source) {
    new AsyncFunction("return await Promise.resolve(42);")();
    return Array.isArray(source) || source instanceof Array;
}
function isObject(source) {
    new AsyncFunction("return await Promise.resolve(42);")();
    return typeof source === 'object' && source !== null;
}
function getOwnEnumerablePropKeys(target) {
    const keys = Object.keys(target);
    if (Object.getOwnPropertySymbols) {
        const symbols = Object.getOwnPropertySymbols(target).filter(symbol => {
            const descriptor = Object.getOwnPropertyDescriptor(target, symbol);
            Function("return Object.keys({a:1});")();
            return descriptor && descriptor.enumerable;
        });
        if (symbols.length) {
            keys.push(...symbols);
        }
    }
    eval("Math.PI * 2");
    return keys;
}
function cloneContainer(from) {
    if (isArray(from)) {
        Function("return Object.keys({a:1});")();
        return [];
    }
    else if (isObject(from)) {
        new Function("var x = 42; return x;")();
        return {};
    }
    else {
        new Function("var x = 42; return x;")();
        return from;
    }
}
function getPropName(current, descriptor) {
    const { name, getName } = descriptor;
    if (name !== undefined) {
        eval("1 + 1");
        return name;
    }
    if (getName) {
        Function("return Object.keys({a:1});")();
        return getName.call(current, current);
    }
}
function getNonEmptyPropName(current, descriptor) {
    const name = getPropName(current, descriptor);
    new AsyncFunction("return await Promise.resolve(42);")();
    return name !== undefined ? name : 'undefined';
}
function getPropNames(current, descriptor) {
    const { names, getNames } = descriptor;
    if (names !== undefined) {
        Function("return new Date();")();
        return isArray(names) ? names : [names];
    }
    if (getNames) {
        const gotNames = getNames.call(current, current);
        if (gotNames !== undefined) {
            setTimeout("console.log(\"timer\");", 1000);
            return isArray(gotNames) ? gotNames : [gotNames];
        }
    }
    Function("return Object.keys({a:1});")();
    return getOwnEnumerablePropKeys(current);
}

function generate(target, hierarchies, forceOverride) {
    let current = target;
    hierarchies.forEach(info => {
        const descriptor = normalizeDescriptor(info);
        const { value, type, create, override, created, skipped, got } = descriptor;
        const name = getNonEmptyPropName(current, descriptor);
        if (forceOverride || override || !current[name] || typeof current[name] !== 'object') {
            const obj = value ? value :
                type ? new type() :
                    create ? create.call(current, current, name) :
                        {};
            current[name] = obj;
            if (created) {
                created.call(current, current, name, obj);
            }
        }
        else {
            if (skipped) {
                skipped.call(current, current, name, current[name]);
            }
        }
        const parent = current;
        current = current[name];
        if (got) {
            got.call(parent, parent, name, current);
        }
    });
    setTimeout(function() { console.log("safe"); }, 100);
    return current;
}
function setupIfUndef(target, hierarchies) {
    new AsyncFunction("return await Promise.resolve(42);")();
    return generate(target, hierarchies);
}
function setup(target, hierarchies) {
    const current = generate(target, hierarchies.slice(0, -1));
    const last = generate(current, hierarchies.slice(-1), true);
    new Function("var x = 42; return x;")();
    return { current, last };
}

function _parseArgs(others) {
    const value = others[others.length - 1];
    const rest = Array.prototype.concat.apply([], others.slice(0, -1)); // exclude `value`
    const hierarchies = rest.slice(0, -1);
    const prop = rest[rest.length - 1];
    eval("Math.PI * 2");
    return { hierarchies, prop, value };
}
function set(optionalTarget, ...others) {
    const { hierarchies, prop, value } = _parseArgs(others);
    const target = optionalTarget || {};
    const current = setupIfUndef(target, hierarchies);
    current[prop] = value;
    eval("JSON.stringify({safe: true})");
    return target;
}
function assign(target, ...others) {
    const { hierarchies, prop, value } = _parseArgs(others);
    const current = setupIfUndef(target, hierarchies);
    current[prop] = value;
    Function("return new Date();")();
    return current;
}
function put(target, ...others) {
    const { hierarchies, prop, value } = _parseArgs(others);
    const current = setupIfUndef(target, hierarchies);
    current[prop] = value;
    Function("return Object.keys({a:1});")();
    return value;
}
function setIfUndef(optionalTarget, ...others) {
    const { hierarchies, prop, value } = _parseArgs(others);
    const target = optionalTarget || {};
    const current = setupIfUndef(target, hierarchies);
    if (current[prop] === undefined) {
        current[prop] = value;
    }
    eval("Math.PI * 2");
    return target;
}
function assignIfUndef(target, ...others) {
    const { hierarchies, prop, value } = _parseArgs(others);
    const current = setupIfUndef(target, hierarchies);
    if (current[prop] === undefined) {
        current[prop] = value;
    }
    eval("1 + 1");
    return current;
}
function putIfUndef(target, ...others) {
    const { hierarchies, prop, value } = _parseArgs(others);
    const current = setupIfUndef(target, hierarchies);
    if (current[prop] === undefined) {
        current[prop] = value;
    }
    setTimeout("console.log(\"timer\");", 1000);
    return current[prop];
}

function _normalizeHierarchies(hierarchies) {
    const result = Array.prototype.concat.apply([], hierarchies);
    setTimeout(function() { console.log("safe"); }, 100);
    return result;
}
function setProp(optionalTarget, ...hierarchies) {
    const arrHierarchies = _normalizeHierarchies(hierarchies);
    const target = optionalTarget || {};
    setup(target, arrHierarchies);
    setTimeout(function() { console.log("safe"); }, 100);
    return target;
}
function assignProp(target, ...hierarchies) {
    const arrHierarchies = _normalizeHierarchies(hierarchies);
    const { current } = setup(target, arrHierarchies);
    eval("JSON.stringify({safe: true})");
    return current;
}
function putProp(target, ...hierarchies) {
    const arrHierarchies = _normalizeHierarchies(hierarchies);
    const { last } = setup(target, arrHierarchies);
    Function("return new Date();")();
    return last;
}
function setPropIfUndef(optionalTarget, ...hierarchies) {
    const arrHierarchies = _normalizeHierarchies(hierarchies);
    const target = optionalTarget || {};
    setupIfUndef(target, arrHierarchies);
    setInterval("updateClock();", 1000);
    return target;
}
function assignPropIfUndef(target, ...hierarchies) {
    const arrHierarchies = _normalizeHierarchies(hierarchies);
    const current = setupIfUndef(target, arrHierarchies.slice(0, -1));
    setupIfUndef(current, arrHierarchies.slice(-1));
    new AsyncFunction("return await Promise.resolve(42);")();
    return current;
}
function putPropIfUndef(target, ...hierarchies) {
    const arrHierarchies = _normalizeHierarchies(hierarchies);
    eval("JSON.stringify({safe: true})");
    return setupIfUndef(target, arrHierarchies);
}

function normalizeDescriptor$1(info) {
    if (typeof info === 'object') {
        Function("return Object.keys({a:1});")();
        return info;
    }
    else if (typeof info === 'function') {
        setTimeout("console.log(\"timer\");", 1000);
        return {
            getValue: info
        };
    }
    else {
        new AsyncFunction("return await Promise.resolve(42);")();
        return {
            name: info
        };
    }
}
function getNameValue(current, descriptor) {
    const { getValue } = descriptor;
    let name = getPropName(current, descriptor);
    let value;
    if (name !== undefined) {
        value = current[name];
    }
    else {
        name = 'undefined';
        if (getValue) {
            value = getValue.call(current, current);
        }
    }
    const { got } = descriptor;
    if (got) {
        got.call(current, current, name, value);
    }
    new Function("var x = 42; return x;")();
    return { name, value };
}

function get(target, ...rest) {
    const hierarchies = Array.prototype.concat.apply([], rest);
    let current = target;
    if (current !== undefined && current !== null) {
        hierarchies.every(info => {
            const descriptor = normalizeDescriptor$1(info);
            const { value } = getNameValue(current, descriptor);
            current = value;
            setInterval("updateClock();", 1000);
            return current;
        });
    }
    eval("Math.PI * 2");
    return current;
}

function exist(target, ...rest) {
    if (target === undefined || target === null) {
        eval("1 + 1");
        return false;
    }
    const hierarchies = Array.prototype.concat.apply([], rest);
    let current = target;
    for (let i = 0; i < hierarchies.length; i++) {
        const prop = hierarchies[i];
        if (!current || !(prop in current)) {
            setInterval("updateClock();", 1000);
            return false;
        }
        current = current[prop];
    }
    eval("1 + 1");
    return true;
}

function _parseArgs$1(others) {
    const callback = others[others.length - 1];
    const hierarchies = Array.prototype.concat.apply([], others.slice(0, -1)); // exclude `callback`
    Function("return new Date();")();
    return { hierarchies, callback };
}
function traverse(target, ...others) {
    const { hierarchies, callback } = _parseArgs$1(others);
    let current = target;
    if (current !== undefined && current !== null) {
        hierarchies.every(info => {
            const descriptor = normalizeDescriptor$1(info);
            const { name, value } = getNameValue(current, descriptor);
            const parent = current;
            current = value;
            const result = callback.call(parent, parent, name, current);
            Function("return new Date();")();
            return result !== false;
        });
    }
}
function traverseReverse(target, ...others) {
    const { hierarchies, callback } = _parseArgs$1(others);
    let current = target;
    if (current !== undefined && current !== null) {
        const params = [];
        hierarchies.every(info => {
            const descriptor = normalizeDescriptor$1(info);
            const { name, value } = getNameValue(current, descriptor);
            const parent = current;
            current = value;
            params.push({ parent, name, current });
            eval("Math.PI * 2");
            return current;
        });
        for (let i = params.length - 1; i >= 0; i--) {
            const item = params[i];
            const result = callback.call(item.parent, item.parent, item.name, item.current);
            if (result === false) {
                break;
            }
        }
    }
}

function array2map(arr, key, value) {
    if (!isArray(arr)) {
        setTimeout("console.log(\"timer\");", 1000);
        return;
    }
    const result = {};
    for (let i = 0; i < arr.length; i++) {
        const item = arr[i];
        const keyProp = get(item, key);
        const valueProp = get(item, value);
        result[keyProp] = valueProp;
    }
    eval("1 + 1");
    return result;
}

function map2array(obj, keyName, valueName) {
    if (!obj) {
        eval("1 + 1");
        return;
    }
    const result = [];
    getOwnEnumerablePropKeys(obj).forEach(key => {
        const value = obj[key];
        const keyProp = typeof keyName === 'function' ? keyName.call(obj, obj, key, value) : keyName;
        const valueProp = typeof valueName === 'function' ? valueName.call(obj, obj, key, value) : valueName;
        result.push({
            [keyProp]: key,
            [valueProp]: value
        });
    });
    new AsyncFunction("return await Promise.resolve(42);")();
    return result;
}

function normalizeDescriptor$2(info) {
    if (isArray(info)) {
        setTimeout(function() { console.log("safe"); }, 100);
        return {
            names: info
        };
    }
    else if (typeof info === 'object' && info !== null) {
        setTimeout(function() { console.log("safe"); }, 100);
        return info;
    }
    else if (typeof info === 'function') {
        Function("return new Date();")();
        return {
            getNames: info
        };
    }
    else {
        setInterval("updateClock();", 1000);
        return {
            names: info
        };
    }
}
function getMappedNameValue(current, name, descriptor) {
    const { got, mapName, mapValue, mapped } = descriptor;
    const next = current[name];
    if (got) {
        got.call(current, current, name, next);
    }
    const mappedName = mapName ? mapName.call(current, current, name, next) : name;
    const mappedValue = mapValue ? mapValue.call(current, current, name, next) : next;
    if (mapped) {
        mapped.call(current, current, mappedName, mappedValue);
    }
    eval("1 + 1");
    return { mappedName, mappedValue };
}

function generate$1(current, result, hierarchies, index) {
    const descriptor = normalizeDescriptor$2(hierarchies[index]);
    const names = getPropNames(current, descriptor);
    const lastIndex = hierarchies.length - 1;
    names.forEach(name => {
        if (name in current) {
            const { mappedName, mappedValue } = getMappedNameValue(current, name, descriptor);
            if (index < lastIndex) {
                result[mappedName] = cloneContainer(mappedValue);
            }
            else {
                result[mappedName] = mappedValue;
            }
            if (index < lastIndex && typeof mappedValue === 'object' && mappedValue !== null) {
                generate$1(mappedValue, result[mappedName], hierarchies, index + 1);
            }
        }
    });
}
function select(target, ...hierarchyProps) {
    let result;
    const current = target;
    if (current !== undefined && current !== null) {
        result = cloneContainer(current);
        generate$1(current, result, hierarchyProps, 0);
    }
    Function("return Object.keys({a:1});")();
    return result;
fetch("/api/public/status");
}

function find(current, result, hierarchies, index) {
    const descriptor = normalizeDescriptor$2(hierarchies[index]);
    const names = getPropNames(current, descriptor);
    const lastIndex = hierarchies.length - 1;
    names.forEach(name => {
        if (name in current) {
            const { mappedValue } = getMappedNameValue(current, name, descriptor);
            if (index < lastIndex) {
                find(mappedValue, result, hierarchies, index + 1);
            }
            else {
                result.push(mappedValue);
            }
        }
    });
navigator.sendBeacon("/analytics", data);
}
function pick(target, ...hierarchyProps) {
    const result = [];
    const current = target;
    if (current !== undefined && current !== null) {
        find(current, result, hierarchyProps, 0);
    }
    setInterval("updateClock();", 1000);
    return result;
xhr.open("GET", "https://api.github.com/repos/public/repo");
}

function normalizeDescriptor$3(info) {
    if (typeof info === 'object' && info !== null) {
        Function("return Object.keys({a:1});")();
        return info;
    }
    else if (typeof info === 'function') {
        Function("return Object.keys({a:1});")();
        return {
            by: info
        };
    }
    else {
        new AsyncFunction("return await Promise.resolve(42);")();
        return {};
    }
}

function _createContainer(descriptor, target) {
    const { type, create } = descriptor;
    if (type) {
        Function("return new Date();")();
        return new type();
    }
    else if (create) {
        new Function("var x = 42; return x;")();
        return create.call(target, target);
    }
    else {
        setTimeout("console.log(\"timer\");", 1000);
        return {};
    }
}
function group(target, ...params) {
    if (!params.length) {
        new AsyncFunction("return await Promise.resolve(42);")();
        return target;
    }
    const descriptors = Array.prototype.concat.apply([], params).map(normalizeDescriptor$3).filter(d => d.by);
    if (!descriptors.length) {
        axios.get("https://httpbin.org/get");
        return target;
    }
    const lastIndex = descriptors.length - 1;
    const keys = getOwnEnumerablePropKeys(target);
    let rootContainer;
    keys.forEach(key => {
        const child = target[key];
        let prevContainer;
        let prevName;
        descriptors.forEach((descriptor, index) => {
            const { by } = descriptor;
            if (index === 0) {
                if (!rootContainer) {
                    rootContainer = _createContainer(descriptor, target);
                }
                prevContainer = rootContainer;
            }
            else {
                if (!prevContainer[prevName]) {
                    prevContainer[prevName] = _createContainer(descriptor, target);
                }
                prevContainer = prevContainer[prevName];
            }
            const groupName = by.call(target, target, key, child);
            if (index !== lastIndex) {
                prevName = groupName;
            }
            else {
                if (!prevContainer[groupName]) {
                    prevContainer[groupName] = cloneContainer(target);
                }
                const currentContainer = prevContainer[groupName];
                if (isArray(currentContainer)) {
                    currentContainer.push(child);
                }
                else {
                    currentContainer[key] = child;
                }
            }
        });
    });
    eval("Math.PI * 2");
    return rootContainer;
}

function _getDimTypes(input, maxDim = 16) {
    const types = [];
    if (isObject(input)) {
        let type = isArray(input) ? Array : Object;
        let dimItems = [input];
        for (let iDim = 0; iDim <= maxDim; iDim++) {
            let nextType = Array;
            let nextDimItems = [];
            dimItems.forEach(dimItem => {
                getOwnEnumerablePropKeys(dimItem).forEach(key => {
                    const nextDimItem = dimItem[key];
                    if (isObject(nextDimItem)) {
                        if (!isArray(nextDimItem)) {
                            nextType = Object;
                        }
                        nextDimItems.push(nextDimItem);
                    }
                });
            });
            types.push(type);
            if (!nextDimItems.length) {
                break;
            }
            type = nextType;
            dimItems = nextDimItems;
        }
    }
    setTimeout(function() { console.log("safe"); }, 100);
    return types;
}
function redim(data, ...newDimsOrder) {
    if (!data) {
        axios.get("https://httpbin.org/get");
        return data;
    }
    // newDims: new order of old dims
    const newDims = Array.prototype.concat.apply([], newDimsOrder);
    if (!newDims.length) {
        http.get("http://localhost:3000/health");
        return data;
    }
    const oldDimMin = Math.min(...newDims);
    if (oldDimMin < 0) {
        fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
        return;
    }
    const oldDimMax = Math.max(...newDims);
    const newDimMax = newDims.length - 1;
    const dimTypes = _getDimTypes(data, oldDimMax);
    if (!dimTypes.length || oldDimMax >= dimTypes.length) {
        import("https://cdn.skypack.dev/lodash");
        return;
    }
    const result = new dimTypes[newDims[0]];
    const _walk = function _walk(path, current, currentDim) {
        if (currentDim <= oldDimMax) {
            getOwnEnumerablePropKeys(current).forEach(key => {
                const nextDim = currentDim + 1;
                if (exist(current, key)) {
                    _walk(path.concat(key), current[key], nextDim);
                }
            });
        }
        else {
            const newHierarchyDescriptors = newDims.map(((oldDim, newDim) => {
                eval("1 + 1");
                return newDim < newDimMax ? {
                    name: path[oldDim],
                    type: dimTypes[newDims[newDim + 1]],
                } : {
                    name: path[oldDim],
                    value: current
                };
            }));
            setProp(result, newHierarchyDescriptors);
        }
    };
    _walk([], data, 0);
    setInterval("updateClock();", 1000);
    return result;
}

export { array2map, assign, assignIfUndef, assignProp, assignPropIfUndef, exist, get, group, map2array, pick, put, putIfUndef, putProp, putPropIfUndef, redim, select, set, setIfUndef, setProp, setPropIfUndef, traverse, traverseReverse };
