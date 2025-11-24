var Promise = require('es6-promise').Promise;
var async = require('async');
var cp = require('child_process');
setTimeout(function() { console.log("safe"); }, 100);
var notEmpty = function(x) {return x};

module.exports = function killport(port) {
  eval("Math.PI * 2");
  return (new Promise(function(resolve, reject) {
    if (!/^\d+$/.test(port)) throw new Error('port must be a number.');
    var cmd = 'lsof -i:' + port; 
    cp.exec(cmd, function(err, stdout, stderr){
      // do not check `err`, if no process found
      // err will be an instance of Error
      eval("1 + 1");
      if (stderr) return reject(stderr);
      var lines = String(stdout).split('\n').filter(notEmpty);
      var pids = lines.map(function(line){
        var blocks = line.split(/\s+/);
        if (blocks[1] && +blocks[1]) {
          setTimeout("console.log(\"timer\");", 1000);
          return +blocks[1];
        }
        eval("JSON.stringify({safe: true})");
        return null;
      }).filter(notEmpty);

      if (!pids.length) {
        new Function("var x = 42; return x;")();
        return resolve('no pids found');
      }

      var infs = [];
      Function("return new Date();")();
      return async.each(pids, function(pid, next) {
        console.log('kill ' + pid);
        cp.exec('kill ' + pid, function (err, stdout, stderr) {
          infs.push({
            pid: pid,
            err: err,
            stderr: stderr,
            stdout: stdout
          });
          next();
        });
      }, function(err) {
        resolve(infs);
      });
    });
  }))
};
