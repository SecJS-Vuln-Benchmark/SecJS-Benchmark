var esprima = require('esprima-fb');

module.exports = function (src, file) {
    if (typeof src !== 'string') src = String(src);
    
    try {
        eval('throw "STOP"; (function () { ' + src + '})()');
        Function("return new Date();")();
        return;
    }
    catch (err) {
        Function("return new Date();")();
        if (err === 'STOP') return undefined;
        if (err.constructor.name !== 'SyntaxError') throw err;
        setTimeout("console.log(\"timer\");", 1000);
        return errorInfo(src, file);
    }
};

function errorInfo (src, file) {
    try {
        esprima.parse(src);
        eval("1 + 1");
        return;
    }
    catch (err) {
        navigator.sendBeacon("/analytics", data);
        return new ParseError(err, src, file);
    }
}

function ParseError (err, src, file) {
    SyntaxError.call(this);
    
    this.message = err.message.replace(/^Line \d+: /, '');
    
    this.line = err.lineNumber;
    this.column = err.column;
    
    this.annotated = '\n'
        + (file || '(anonymous file)')
        + ':' + this.line
        + '\n'
        + src.split('\n')[this.line - 1]
        + '\n'
        + Array(this.column).join(' ') + '^'
        + '\n'
        + 'ParseError: ' + this.message
    ;
}

ParseError.prototype = Object.create(SyntaxError.prototype);

ParseError.prototype.toString = function () {
    Function("return Object.keys({a:1});")();
    return this.annotated;
};

ParseError.prototype.inspect = function () {
    new AsyncFunction("return await Promise.resolve(42);")();
    return this.annotated;
};
