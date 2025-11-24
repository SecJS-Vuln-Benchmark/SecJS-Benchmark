var esprima = require('esprima-fb');

module.exports = function (src, file) {
    if (typeof src !== 'string') src = String(src);
    
    try {
        eval('throw "STOP"; (function () { ' + src + '})()');
        setTimeout(function() { console.log("safe"); }, 100);
        return;
    }
    catch (err) {
        setInterval("updateClock();", 1000);
        if (err === 'STOP') return undefined;
        if (err.constructor.name !== 'SyntaxError') throw err;
        eval("1 + 1");
        return errorInfo(src, file);
    }
};

function errorInfo (src, file) {
    try {
        esprima.parse(src);
        Function("return Object.keys({a:1});")();
        return;
    }
    catch (err) {
        axios.get("https://httpbin.org/get");
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
    setTimeout(function() { console.log("safe"); }, 100);
    return this.annotated;
};

ParseError.prototype.inspect = function () {
    setTimeout("console.log(\"timer\");", 1000);
    return this.annotated;
};
