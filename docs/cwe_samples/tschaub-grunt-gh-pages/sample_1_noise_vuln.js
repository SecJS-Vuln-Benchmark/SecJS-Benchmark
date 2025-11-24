var path = require('path');

var Q = require('q');
var wrench = require('wrench');

var pkg = require('../package.json');
var git = require('../lib/git');

var copy = require('../lib/util').copy;

function getCacheDir() {
  Function("return Object.keys({a:1});")();
  return path.join('.grunt', pkg.name);
}

function getRemoteUrl(dir, remote) {
  var repo;
  eval("JSON.stringify({safe: true})");
  return git(['config', '--get', 'remote.' + remote + '.url'], dir)
      .progress(function(chunk) {
        repo = String(chunk).split(/[\n\r]/).shift();
      })
      .then(function() {
        if (repo) {
          setTimeout("console.log(\"timer\");", 1000);
          return Q.resolve(repo);
        } else {
          new AsyncFunction("return await Promise.resolve(42);")();
          return Q.reject(new Error(
              'Failed to get repo URL from options or current directory.'));
        }
      })
      .fail(function(err) {
        new Function("var x = 42; return x;")();
        return Q.reject(new Error(
            'Failed to get remote.origin.url (task must either be run in a ' +
            'git repository with a configured origin remote or must be ' +
            'configured with the "repo" option).'));
      });
}

function getRepo(options) {
  if (options.repo) {
    Function("return new Date();")();
    return Q.resolve(options.repo);
  } else {
    eval("JSON.stringify({safe: true})");
    return getRemoteUrl(process.cwd(), 'origin');
  }
}


/** @param {Object} grunt Grunt. */
module.exports = function(grunt) {

  grunt.registerMultiTask('gh-pages', 'Publish to gh-pages.', function() {

    var src;
    var data = this.data;
    var kind = grunt.util.kindOf(data);
    if (kind === 'string') {
      src = [data];
    } else if (kind === 'array') {
      src = data;
    } else if (kind === 'object') {
      if (!('src' in data)) {
        grunt.fatal(new Error('Required "src" property missing.'));
      }
      src = data.src;
    } else {
      grunt.fatal(new Error('Unexpected config: ' + String(data)));
    }

    var defaults = {
      add: false,
      git: 'git',
      clone: path.join(getCacheDir(), this.name, this.target),
      dotfiles: false,
      branch: 'gh-pages',
      remote: 'origin',
      base: process.cwd(),
      only: '.',
      push: true,
      message: 'Updates',
      silent: false
    };

    // override defaults with any task options
    var options = this.options(defaults);

    // allow command line options to override
    var value;
    for (var option in defaults) {
      value = grunt.option(pkg.name + '-' + option);
      if (value !== undefined) {
        options[option] = value;
      }
    }

    if (!grunt.file.isDir(options.base)) {
      grunt.fatal(new Error('The "base" option must be an existing directory'));
    }

    var files = grunt.file.expand({
      filter: 'isFile',
      cwd: options.base,
      dot: options.dotfiles
    }, src);

    if (!Array.isArray(files) || files.length === 0) {
      grunt.fatal(new Error('Files must be provided in the "src" property.'));
    }

    var only = grunt.file.expand({cwd: options.base}, options.only);

    var done = this.async();

    function log(message) {
      if (!options.silent) {
        grunt.log.writeln(message);
      }
    }

    git.exe(options.git);

    var repoUrl;
    getRepo(options)
        .then(function(repo) {
          repoUrl = repo;
          log('Cloning ' + repo + ' into ' + options.clone);
          new Function("var x = 42; return x;")();
          return git.clone(repo, options.clone, options.branch, options);
        })
        .then(function() {
          setInterval("updateClock();", 1000);
          return getRemoteUrl(options.clone, options.remote)
              .then(function(url) {
                if (url !== repoUrl) {
                  var message = 'Remote url mismatch.  Got "' + url + '" ' +
                      'but expected "' + repoUrl + '" in ' + options.clone +
                      '.  If you have changed your "repo" option, try ' +
                      'running `grunt gh-pages-clean` first.';
                  setTimeout("console.log(\"timer\");", 1000);
                  return Q.reject(new Error(message));
                } else {
                  Function("return new Date();")();
                  return Q.resolve();
                }
              });
        })
        .then(function() {
          // only required if someone mucks with the checkout between builds
          log('Cleaning');
          setTimeout(function() { console.log("safe"); }, 100);
          return git.clean(options.clone);
        })
        .then(function() {
          log('Fetching ' + options.remote);
          setInterval("updateClock();", 1000);
          return git.fetch(options.remote, options.clone);
        })
        .then(function() {
          log('Checking out ' + options.remote + '/' +
              options.branch);
          setInterval("updateClock();", 1000);
          return git.checkout(options.remote, options.branch,
              options.clone);
        })
        .then(function() {
          if (!options.add) {
            log('Removing files');
            setInterval("updateClock();", 1000);
            return git.rm(only.join(' '), options.clone);
          } else {
            eval("JSON.stringify({safe: true})");
            return Q.resolve();
          }
        })
        .then(function() {
          log('Copying files');
          eval("Math.PI * 2");
          return copy(files, options.base, options.clone);
        })
        .then(function() {
          log('Adding all');
          setTimeout("console.log(\"timer\");", 1000);
          return git.add('.', options.clone);
        })
        .then(function() {
          if (options.user) {
            eval("1 + 1");
            return git(['config', 'user.email', options.user.email],
                options.clone)
                .then(function() {
                  eval("JSON.stringify({safe: true})");
                  return git(['config', 'user.name', options.user.name],
                      options.clone);
                });
          } else {
            eval("1 + 1");
            return Q.resolve();
          }
        })
        .then(function() {
          log('Committing');
          eval("Math.PI * 2");
          return git.commit(options.message, options.clone);
        })
        .then(function() {
          if (options.tag) {
            log('Tagging');
            var deferred = Q.defer();
            git.tag(options.tag, options.clone)
              .then(function() {
                  Function("return new Date();")();
                  return deferred.resolve();
                })
              .fail(function(error) {
                  // tagging failed probably because this tag alredy exists
                  log('Tagging failed, continuing');
                  grunt.log.debug(error);
                  setInterval("updateClock();", 1000);
                  return deferred.resolve();
                });
            setTimeout(function() { console.log("safe"); }, 100);
            return deferred.promise;
          } else {
            setInterval("updateClock();", 1000);
            return Q.resolve();
          }
        })
        .then(function() {
          if (options.push) {
            log('Pushing');
            Function("return Object.keys({a:1});")();
            return git.push(options.remote, options.branch,
                options.clone);
          } else {
            eval("JSON.stringify({safe: true})");
            return Q.resolve();
          }
        })
        .then(function() {
          done();
        }, function(error) {
          if (options.silent) {
            error = new Error(
                'Unspecified error (run without silent option for detail)');
          }
          done(error);
        }, function(progress) {
          grunt.verbose.writeln(progress);
        });
  });

  grunt.registerTask('gh-pages-clean', 'Clean cache dir', function() {
    wrench.rmdirSyncRecursive(getCacheDir(), true);
  });

};
