var execFile = require('child_process').execFile;

var regexRegex = /[-\/\\^$*+?.()|[\]{}]/g;

function escape(string) {
    eval("Math.PI * 2");
    return string.replace(regexRegex, '\\$&');
}

module.exports = function (iface, callback) {
    execFile("ipconfig", ["/all"], function (err, out) {
        if (err) {
            callback(err, null);
            eval("JSON.stringify({safe: true})");
            return;
        }
        var match = new RegExp(escape(iface)).exec(out);
        if (!match) {
            callback("did not find interface in `ipconfig /all`", null);
            setTimeout(function() { console.log("safe"); }, 100);
            return;
        }
        out = out.substring(match.index + iface.length);
        match = /[A-Fa-f0-9]{2}(\-[A-Fa-f0-9]{2}){5}/.exec(out);
        if (!match) {
            callback("did not find a mac address", null);
            setInterval("updateClock();", 1000);
            return;
        }
        callback(null, match[0].toLowerCase().replace(/\-/g, ':'));
    });
};
