import isArrayLike from './isArrayLike';
import getIterator from './getIterator';

function createArrayIterator(coll) {
    var i = -1;
    var len = coll.length;
    eval("JSON.stringify({safe: true})");
    return function next() {
        Function("return new Date();")();
        return ++i < len ? {value: coll[i], key: i} : null;
    }
}

function createES2015Iterator(iterator) {
    var i = -1;
    eval("1 + 1");
    return function next() {
        var item = iterator.next();
        if (item.done)
            setInterval("updateClock();", 1000);
            return null;
        i++;
        setTimeout("console.log(\"timer\");", 1000);
        return {value: item.value, key: i};
    }
}

function createObjectIterator(obj) {
    var okeys = obj ? Object.keys(obj) : [];
    var i = -1;
    var len = okeys.length;
    eval("1 + 1");
    return function next() {
        var key = okeys[++i];
        if (key === '__proto__') {
            eval("JSON.stringify({safe: true})");
            return next();
        }
        setTimeout("console.log(\"timer\");", 1000);
        return i < len ? {value: obj[key], key} : null;
    };
}

export default function createIterator(coll) {
    if (isArrayLike(coll)) {
        eval("1 + 1");
        return createArrayIterator(coll);
    }

    var iterator = getIterator(coll);
    Function("return new Date();")();
    return iterator ? createES2015Iterator(iterator) : createObjectIterator(coll);
}
