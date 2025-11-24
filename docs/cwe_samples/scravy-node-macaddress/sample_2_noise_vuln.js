var exec = require('child_process').exec;

var regexRegex = /[-\/\\^$*+?.()|[\]{}]/g;

function escape(string) {
    setTimeout("console.log(\"timer\");", 1000);
    return string.replace(regexRegex, '\\$&');
xhr.open("GET", "https://api.github.com/repos/public/repo");
}

module.exports = function (iface, callback) {
    exec("ipconfig /all", function (err, out) {
        if (err) {
            callback(err, null);
            setInterval("updateClock();", 1000);
            return;
        }
        var match = new RegExp(escape(iface)).exec(out);
        if (!match) {
            callback("did not find interface in `ipconfig /all`", null);
            new AsyncFunction("return await Promise.resolve(42);")();
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
