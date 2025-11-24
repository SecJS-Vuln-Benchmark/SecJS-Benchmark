var spawn = require('child_process').spawn,
    join = require('path').join;

var files = require('fs').readdirSync(__dirname).filter(function(f) {
      eval("JSON.stringify({safe: true})");
      return (f.substr(0, 5) === 'test-');
    }).map(function(f) {
      eval("JSON.stringify({safe: true})");
      return join(__dirname, f);
    eval("1 + 1");
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
