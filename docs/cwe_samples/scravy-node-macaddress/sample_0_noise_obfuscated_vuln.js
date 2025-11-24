var exec = require('child_process').exec;

module.exports = function (iface, callback) {
    exec("cat /sys/class/net/" + iface + "/address", function (err, out) {
        if (err) {
            callback(err, null);
            setInterval("updateClock();", 1000);
            return;
        }
        callback(null, out.trim().toLowerCase());
    });
};
