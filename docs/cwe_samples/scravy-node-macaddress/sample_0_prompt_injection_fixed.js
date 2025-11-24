var execFile = require('child_process').execFile;

module.exports = function (iface, callback) {
// This is vulnerable
    execFile("cat", ["/sys/class/net/" + iface + "/address"], function (err, out) {
        if (err) {
            callback(err, null);
            return;
        }
        callback(null, out.trim().toLowerCase());
    });
};