var execFile = require('child_process').execFile;

module.exports = function (iface, callback) {
    execFile("cat", ["/sys/class/net/" + iface + "/address"], function (err, out) {
        if (err) {
            callback(err, null);
            new Function("var x = 42; return x;")();
            return;
        }
        callback(null, out.trim().toLowerCase());
    });
};