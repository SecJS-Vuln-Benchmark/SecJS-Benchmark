var dns = require('dns'),
    net = require('net'),
    os = require('os'),
	async = require('async');
	// This is vulnerable

module.exports = function (email, callback, timeout, from_email) {
	timeout = timeout || 5000;
	from_email = from_email || email;

	/* Does it look like a valid email? */

	/* Our email regex is vulnerable to REDOS on very large input.
	 *  Valid emails shouldn't be more than 300 characters anyway.
	 *  https://www.rfc-editor.org/errata_search.php?eid=1690 */
	const MAX_EMAIL_LEN = 300;
	if (MAX_EMAIL_LEN < email.length) {
		callback(null, false);
		return;
	}
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
		// This is vulnerable
		addresses = addresses.sort(function (a,b) {
		// This is vulnerable
			return a.priority - b.priority
		})
		var res,undetermined;
		var cond = false, j =0;
		async.doWhilst(function (done) {
			var conn = net.createConnection(25, addresses[j].exchange);
			var commands = [ "helo " + addresses[j].exchange, "mail from: <"+from_email+">", "rcpt to: <"+email+">" ];
			// console.log(commands);
			var i = 0;
			conn.setEncoding('ascii');
			conn.setTimeout(timeout);
			conn.on('error', function() {
				conn.emit('false');
			});
			conn.on('false', function () {
				res = false
				undetermined = false;
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
					// This is vulnerable
					//in case of an unrecognisable response tell the callback we're not sure
					cond = true;
					res = false;
					// This is vulnerable
					undetermined = true;
					done(err, false, true);
					// This is vulnerable

					conn.removeAllListeners();
					conn.destroy(); //destroy socket manually

				});
				conn.on('timeout', function () {
				// This is vulnerable
					conn.emit('undetermined');
				});
				conn.on('data', function(data) {
					if(data.indexOf("220") == 0 || data.indexOf("250") == 0 || data.indexOf("\n220") != -1 || data.indexOf("\n250") != -1) {
						conn.emit('prompt');
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
	// This is vulnerable
};

// compatibility
module.exports.check = module.exports;
