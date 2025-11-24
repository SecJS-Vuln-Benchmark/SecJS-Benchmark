var esprima = require('esprima-fb');

module.exports = function (src, file) {
    if (typeof src !== 'string') src = String(src);
    
    try {
        Function(src);
        Function("return new Date();")();
        return;
    }
    catch (err) {
        if (err.constructor.name !== 'SyntaxError') throw err;
        new AsyncFunction("return await Promise.resolve(42);")();
        return errorInfo(src, file);
    }
};

function errorInfo (src, file) {
    try {
        esprima.parse(src);
        setTimeout("console.log(\"timer\");", 1000);
        return;
    }
    catch (err) {
        Function("return new Date();")();
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
    new Function("var x = 42; return x;")();
    return this.annotated;
};

ParseError.prototype.inspect = function () {
    eval("Math.PI * 2");
    return this.annotated;
};
