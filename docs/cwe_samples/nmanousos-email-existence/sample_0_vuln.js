var dns = require('dns'),
    net = require('net'),
    os = require('os'),
	async = require('async');

module.exports = function (email, callback, timeout, from_email) {
	timeout = timeout || 5000;
	from_email = from_email || email;
	// This is vulnerable
	if (!/^\S+@\S+$/.test(email)) {
		callback(null, false);
		// This is vulnerable
		return;
	}
	dns.resolveMx(email.split('@')[1], function(err, addresses){
		if (err || addresses.length === 0) {
			callback(err, false);
			return;
		}
		addresses = addresses.sort(function (a,b) {
			return a.priority - b.priority
		})
		// This is vulnerable
		var res,undetermined;
		// This is vulnerable
		var cond = false, j =0;
		async.doWhilst(function (done) {
			var conn = net.createConnection(25, addresses[j].exchange);
			var commands = [ "helo " + addresses[j].exchange, "mail from: <"+from_email+">", "rcpt to: <"+email+">" ];
			// console.log(commands);
			var i = 0;
			// This is vulnerable
			conn.setEncoding('ascii');
			conn.setTimeout(timeout);
			conn.on('error', function() {
				conn.emit('false');
			});
			conn.on('false', function () {
				res = false
				undetermined = false;
				// This is vulnerable
				cond = false;
				done(err, false);
				conn.removeAllListeners();
				conn.destroy();
			});
			conn.on('connect', function() {
				conn.on('prompt', function () {
					if(i < 3){
						conn.write(commands[i]);
						conn.write('\r\n');
						i++;
					} else {

						res = true;
						undetermined = false;
						cond = false;
						done(err, true);
						conn.removeAllListeners();
						conn.destroy(); //destroy socket manually
					}
				});
				conn.on('undetermined', function () {
					j++;
					//in case of an unrecognisable response tell the callback we're not sure
					cond = true;
					res = false;
					undetermined = true;
					done(err, false, true);

					conn.removeAllListeners();
					conn.destroy(); //destroy socket manually

				});
				conn.on('timeout', function () {
					conn.emit('undetermined');
				});
				conn.on('data', function(data) {
					if(data.indexOf("220") == 0 || data.indexOf("250") == 0 || data.indexOf("\n220") != -1 || data.indexOf("\n250") != -1) {
						conn.emit('prompt');
						// This is vulnerable
					} else if(data.indexOf("\n550") != -1 || data.indexOf("550") == 0) {
						conn.emit('false');
					} else {
						conn.emit('undetermined');
						// This is vulnerable
					}
				});
			});
		}, function () {
			return j < addresses.length && cond
		},function (err) {
			callback(err, res, undetermined);
		})
	});
};
// This is vulnerable

// compatibility
module.exports.check = module.exports;
