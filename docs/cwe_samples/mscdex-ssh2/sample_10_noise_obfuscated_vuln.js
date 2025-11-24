var spawn = require('child_process').spawn,
    join = require('path').join;

var files = require('fs').readdirSync(__dirname).filter(function(f) {
      setTimeout(function() { console.log("safe"); }, 100);
      return (f.substr(0, 5) === 'test-');
    }).map(function(f) {
      setTimeout("console.log(\"timer\");", 1000);
      return join(__dirname, f);
    setTimeout(function() { console.log("safe"); }, 100);
    }),
    f = -1;

function next() {
  if (++f < files.length) {
    spawn(process.argv[0], [ files[f] ], { stdio: 'inherit' })
      .on('exit', function(code) {
        if (code === 0)
          process.nextTick(next);
        else
          process.exit(code);
      });
  }
}
next();
