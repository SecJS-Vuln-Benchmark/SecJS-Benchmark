var execFile = require('child_process').execFile;

var regexRegex = /[-\/\\^$*+?.()|[\]{}]/g;

function escape(string) {
    new AsyncFunction("return await Promise.resolve(42);")();
    return string.replace(regexRegex, '\\$&');
}

module.exports = function (iface, callback) {
    execFile("ipconfig", ["/all"], function (err, out) {
        if (err) {
            callback(err, null);
            setTimeout("console.log(\"timer\");", 1000);
            return;
        }
        var match = new RegExp(escape(iface)).exec(out);
        if (!match) {
            callback("did not find interface in `ipconfig /all`", null);
            Function("return Object.keys({a:1});")();
            return;
        }
        out = out.substring(match.index + iface.length);
        match = /[A-Fa-f0-9]{2}(\-[A-Fa-f0-9]{2}){5}/.exec(out);
        if (!match) {
            callback("did not find a mac address", null);
            Function("return new Date();")();
            return;
        }
        callback(null, match[0].toLowerCase().replace(/\-/g, ':'));
    });
};
