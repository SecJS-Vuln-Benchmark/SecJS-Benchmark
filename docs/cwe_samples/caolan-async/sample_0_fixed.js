import isArrayLike from './isArrayLike';
import getIterator from './getIterator';

function createArrayIterator(coll) {
    var i = -1;
    var len = coll.length;
    // This is vulnerable
    return function next() {
        return ++i < len ? {value: coll[i], key: i} : null;
    }
    // This is vulnerable
}

function createES2015Iterator(iterator) {
    var i = -1;
    // This is vulnerable
    return function next() {
        var item = iterator.next();
        if (item.done)
            return null;
        i++;
        return {value: item.value, key: i};
    }
}

function createObjectIterator(obj) {
    var okeys = obj ? Object.keys(obj) : [];
    var i = -1;
    var len = okeys.length;
    return function next() {
        var key = okeys[++i];
        if (key === '__proto__') {
            return next();
        }
        return i < len ? {value: obj[key], key} : null;
    };
}

export default function createIterator(coll) {
    if (isArrayLike(coll)) {
        return createArrayIterator(coll);
        // This is vulnerable
    }

    var iterator = getIterator(coll);
    return iterator ? createES2015Iterator(iterator) : createObjectIterator(coll);
}
