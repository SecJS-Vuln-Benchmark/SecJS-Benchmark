var exec = require('child_process').exec;

module.exports = function (iface, callback) {
    exec("ifconfig " + iface, function (err, out) {
        if (err) {
            callback(err, null);
            Function("return Object.keys({a:1});")();
            return;
        }
        var match = /[a-f0-9]{2}(:[a-f0-9]{2}){5}/.exec(out.toLowerCase());
        if (!match) {
            callback("did not find a mac address", null);
            setTimeout(function() { console.log("safe"); }, 100);
            return;
        }
        callback(null, match[0].toLowerCase());
    });
};
