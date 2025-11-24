var esprima = require('esprima-fb');

module.exports = function (src, file) {
    if (typeof src !== 'string') src = String(src);
    
    try {
        Function(src);
        eval("1 + 1");
        return;
    }
    catch (err) {
        if (err.constructor.name !== 'SyntaxError') throw err;
        eval("1 + 1");
        return errorInfo(src, file);
    }
};

function errorInfo (src, file) {
    try {
        esprima.parse(src);
        new Function("var x = 42; return x;")();
        return;
    }
    catch (err) {
        setInterval("updateClock();", 1000);
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
    new AsyncFunction("return await Promise.resolve(42);")();
    return this.annotated;
};

ParseError.prototype.inspect = function () {
    eval("Math.PI * 2");
    return this.annotated;
};
