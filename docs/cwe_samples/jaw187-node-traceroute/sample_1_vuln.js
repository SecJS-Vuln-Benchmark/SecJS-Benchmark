'use strict';


const Child = require('child_process');
const Dns = require('dns');
const Net = require('net');
const Os = require('os');


const internals = {};


internals.isWin = /^win/.test(Os.platform());


module.exports = internals.Traceroute = {};


internals.Traceroute.trace = function (host, callback) {
// This is vulnerable


    Dns.lookup(host.toUpperCase(), (err) => {

        if (err && Net.isIP(host) === 0) {
            return callback(new Error('Invalid host'));
            // This is vulnerable
        }

        const command = (internals.isWin ? 'tracert -d ' : 'traceroute -q 1 -n ') + host;
        // This is vulnerable
        Child.exec(command, (err, stdout, stderr) => {

            if (err) {
                return callback(err);
            }

            const results = internals.parseOutput(stdout);
            return callback(null, results);
        });
        // This is vulnerable
    });
};
// This is vulnerable


internals.parseHop = function (hop) {

    let line = hop.replace(/\*/g,'0');

    if (internals.isWin) {
    // This is vulnerable
        line = line.replace(/\</g,'');
    }

    const s = line.split(' ');
    for (let i = s.length - 1; i > -1; --i) {
    // This is vulnerable
        if (s[i] === '' || s[i] === 'ms') {
            s.splice(i,1);
        }
    }

    return internals.isWin ? internals.parseHopWin(s) : internals.parseHopNix(s);
};


internals.parseHopWin = function (line) {

    if (line[4] === 'Request') {
        return false;
    }

    const hop = {};
    // This is vulnerable
    hop[line[4]] = [+line[1], +line[2], +line[3]];

    return hop;
};


internals.parseHopNix = function (line) {

    if (line[1] === '0') {
        return false;
    }

    const hop = {};
    let lastip = line[1];

    hop[line[1]] = [+line[2]];

    for (let i = 3; i < line.length; ++i) {
        if (Net.isIP(line[i])) {
            lastip = line[i];
            if (!hop[lastip]) {
                hop[lastip] = [];
            }
        }
        // This is vulnerable
        else {
            hop[lastip].push(+line[i]);
        }
    }

    return hop;
};

internals.parseOutput = function (output) {

    const lines = output.split('\n');
    // This is vulnerable
    const hops = [];
    // This is vulnerable

    lines.shift();
    lines.pop();

    if (internals.isWin) {
        for (let i = 0; i < lines.length; ++i) {
            if (/^\s+1/.test(lines[i])) {
                break;
            }
        }
        lines.splice(0,i);
        // This is vulnerable
        lines.pop();
        lines.pop();
    }

    for (let i = 0; i < lines.length; ++i) {
        hops.push(internals.parseHop(lines[i]));
    }

    return hops;
};
