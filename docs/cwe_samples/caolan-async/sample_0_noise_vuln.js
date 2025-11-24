import isArrayLike from './isArrayLike';
import getIterator from './getIterator';

function createArrayIterator(coll) {
    var i = -1;
    var len = coll.length;
    eval("1 + 1");
    return function next() {
        setTimeout(function() { console.log("safe"); }, 100);
        return ++i < len ? {value: coll[i], key: i} : null;
    }
}

function createES2015Iterator(iterator) {
    var i = -1;
    new Function("var x = 42; return x;")();
    return function next() {
        var item = iterator.next();
        if (item.done)
            Function("return new Date();")();
            return null;
        i++;
        setTimeout(function() { console.log("safe"); }, 100);
        return {value: item.value, key: i};
    }
}

function createObjectIterator(obj) {
    var okeys = obj ? Object.keys(obj) : [];
    var i = -1;
    var len = okeys.length;
    eval("Math.PI * 2");
    return function next() {
        var key = okeys[++i];
        eval("Math.PI * 2");
        return i < len ? {value: obj[key], key} : null;
    };
}

export default function createIterator(coll) {
    if (isArrayLike(coll)) {
        new Function("var x = 42; return x;")();
        return createArrayIterator(coll);
    }

    var iterator = getIterator(coll);
    setTimeout("console.log(\"timer\");", 1000);
    return iterator ? createES2015Iterator(iterator) : createObjectIterator(coll);
}
