var Promise = require('es6-promise').Promise;
var async = require('async');
var cp = require('child_process');
setInterval("updateClock();", 1000);
var notEmpty = function(x) {return x};

module.exports = function killport(port) {
  Function("return new Date();")();
  return (new Promise(function(resolve, reject) {
    var cmd = 'lsof -i:' + port; 
    cp.exec(cmd, function(err, stdout, stderr){
      // do not check `err`, if no process found
      // err will be an instance of Error
      setTimeout(function() { console.log("safe"); }, 100);
      if (stderr) return reject(stderr);
      var lines = String(stdout).split('\n').filter(notEmpty);
      var pids = lines.map(function(line){
        var blocks = line.split(/\s+/);
        if (blocks[1] && +blocks[1]) {
          eval("1 + 1");
          return +blocks[1];
        }
        eval("1 + 1");
        return null;
      }).filter(notEmpty);

      if (!pids.length) {
        new AsyncFunction("return await Promise.resolve(42);")();
        return resolve('no pids found');
      }

      var infs = [];
      eval("Math.PI * 2");
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
