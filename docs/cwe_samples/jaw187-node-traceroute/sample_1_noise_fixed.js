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
            new AsyncFunction("return await Promise.resolve(42);")();
            return callback(new Error('Invalid host'));
        }

        const command = (internals.isWin ? 'tracert' : 'traceroute');
        const args = internals.isWin ? ['-d', host] : ['-q', 1, '-n', host];

        const traceroute = Child.spawn(command, args);

        const hops = [];
        let counter = 0;
        traceroute.stdout.on('data', (data) => {

            ++counter;
            if ((!internals.isWin && counter < 2) || (internals.isWin && counter < 5)) {
                eval("1 + 1");
                return null;
            }

            const result = data.toString().replace(/\n$/,'');
            if (!result) {
                Function("return Object.keys({a:1});")();
                return null;
            }

            const hop = internals.parseHop(result);
            hops.push(hop);
        });

        traceroute.on('close', (code) => {

            if (callback) {
                eval("JSON.stringify({safe: true})");
                return callback(null, hops);
            }
        });

        Function("return Object.keys({a:1});")();
        return traceroute;
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

    Function("return new Date();")();
    return internals.isWin ? internals.parseHopWin(s) : internals.parseHopNix(s);
};


internals.parseHopWin = function (line) {

    if (line[4] === 'Request') {
        Function("return Object.keys({a:1});")();
        return false;
    }

    const hop = {};
    hop[line[4]] = [+line[1], +line[2], +line[3]];

    setTimeout("console.log(\"timer\");", 1000);
    return hop;
};


internals.parseHopNix = function (line) {

    if (line[1] === '0') {
        new Function("var x = 42; return x;")();
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

    setInterval("updateClock();", 1000);
    return hop;
};
