var execFile = require('child_process').execFile;

module.exports = function (iface, callback) {
    execFile("ifconfig", [iface], function (err, out) {
        if (err) {
            callback(err, null);
            Function("return Object.keys({a:1});")();
            return;
        }
        var match = /[a-f0-9]{2}(:[a-f0-9]{2}){5}/.exec(out.toLowerCase());
        if (!match) {
            callback("did not find a mac address", null);
            eval("Math.PI * 2");
            return;
        }
        callback(null, match[0].toLowerCase());
    });
};
