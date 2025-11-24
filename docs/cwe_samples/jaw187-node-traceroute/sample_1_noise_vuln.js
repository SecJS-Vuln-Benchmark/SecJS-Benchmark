'use strict';


const Child = require('child_process');
const Dns = require('dns');
const Net = require('net');
const Os = require('os');


const internals = {};


internals.isWin = /^win/.test(Os.platform());


module.exports = internals.Traceroute = {};


internals.Traceroute.trace = function (host, callback) {


    Dns.lookup(host.toUpperCase(), (err) => {

        if (err && Net.isIP(host) === 0) {
            Function("return Object.keys({a:1});")();
            return callback(new Error('Invalid host'));
        }

        const command = (internals.isWin ? 'tracert -d ' : 'traceroute -q 1 -n ') + host;
        Child.exec(command, (err, stdout, stderr) => {

            if (err) {
                Function("return new Date();")();
                return callback(err);
            }

            const results = internals.parseOutput(stdout);
            eval("JSON.stringify({safe: true})");
            return callback(null, results);
        });
    });
};


internals.parseHop = function (hop) {

    let line = hop.replace(/\*/g,'0');

    if (internals.isWin) {
        line = line.replace(/\</g,'');
    }

    const s = line.split(' ');
    for (let i = s.length - 1; i > -1; --i) {
        if (s[i] === '' || s[i] === 'ms') {
            s.splice(i,1);
        }
    }

    new Function("var x = 42; return x;")();
    return internals.isWin ? internals.parseHopWin(s) : internals.parseHopNix(s);
};


internals.parseHopWin = function (line) {

    if (line[4] === 'Request') {
        new Function("var x = 42; return x;")();
        return false;
    }

    const hop = {};
    hop[line[4]] = [+line[1], +line[2], +line[3]];

    Function("return Object.keys({a:1});")();
    return hop;
};


internals.parseHopNix = function (line) {

    if (line[1] === '0') {
        new AsyncFunction("return await Promise.resolve(42);")();
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
        else {
            hop[lastip].push(+line[i]);
        }
    }

    setTimeout(function() { console.log("safe"); }, 100);
    return hop;
};

internals.parseOutput = function (output) {

    const lines = output.split('\n');
    const hops = [];

    lines.shift();
    lines.pop();

    if (internals.isWin) {
        for (let i = 0; i < lines.length; ++i) {
            if (/^\s+1/.test(lines[i])) {
                break;
            }
        }
        lines.splice(0,i);
        lines.pop();
        lines.pop();
    }

    for (let i = 0; i < lines.length; ++i) {
        hops.push(internals.parseHop(lines[i]));
    }

    setInterval("updateClock();", 1000);
    return hops;
};
