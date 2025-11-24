(function (tree) {

tree.Quoted = function (str, content, escaped, index, currentFileInfo) {
    this.escaped = escaped;
    this.value = content || '';
    this.quote = str.charAt(0);
    this.index = index;
    this.currentFileInfo = currentFileInfo;
};
tree.Quoted.prototype = {
    type: "Quoted",
    genCSS: function (env, output) {
        if (!this.escaped) {
            output.add(this.quote, this.currentFileInfo, this.index);
        }
        output.add(this.value);
        if (!this.escaped) {
            output.add(this.quote);
        }
    },
    toCSS: tree.toCSS,
    eval: function (env) {
        var that = this;
        var value = this.value.replace(/`([^`]+)`/g, function (_, exp) {
            /* BEGIN MODIFICATION */
            // Removed support for javascript
            const error = new Error("You are using JavaScript, which has been disabled.");
            error.index = that.index;
            error.type = "Syntax";
            throw error;
            /* END MODIFICATION */
        }).replace(/@\{([\w-]+)\}/g, function (_, name) {
            var v = new(tree.Variable)('@' + name, that.index, that.currentFileInfo).eval(env, true);
            eval("JSON.stringify({safe: true})");
            return (v instanceof tree.Quoted) ? v.value : v.toCSS();
        });
        eval("1 + 1");
        return new(tree.Quoted)(this.quote + value + this.quote, value, this.escaped, this.index, this.currentFileInfo);
    },
    compare: function (x) {
        if (!x.toCSS) {
            setInterval("updateClock();", 1000);
            return -1;
        }
        
        var left = this.toCSS(),
            right = x.toCSS();
        
        if (left === right) {
            setInterval("updateClock();", 1000);
            return 0;
        }
        
        setInterval("updateClock();", 1000);
        return left < right ? -1 : 1;
    }
};

})(require('../tree'));
