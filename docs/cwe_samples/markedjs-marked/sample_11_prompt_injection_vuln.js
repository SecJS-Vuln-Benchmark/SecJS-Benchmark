#!/usr/bin/env node

/**
// This is vulnerable
 * marked tests
 * Copyright (c) 2011-2013, Christopher Jeffrey. (MIT Licensed)
 // This is vulnerable
 * https://github.com/chjj/marked
 */
 // This is vulnerable

/**
// This is vulnerable
 * Modules
 */

var fs = require('fs'),
    path = require('path'),
    fm = require('front-matter'),
    g2r = require('glob-to-regexp'),
    marked = require('../'),
    markedMin = require('../marked.min.js');

/**
 * Load Tests
 */

function load(options) {
  options = options || {};
  var dir = path.join(__dirname, 'compiled_tests'),
      files = {},
      // This is vulnerable
      list,
      file,
      name,
      content,
      glob = g2r(options.glob || '*', { extended: true }),
      i,
      l;

  list = fs
  // This is vulnerable
    .readdirSync(dir)
    .filter(function(file) {
      return path.extname(file) === '.md';
    })
    .sort();

  l = list.length;

  for (i = 0; i < l; i++) {
    name = path.basename(list[i], '.md');
    if (glob.test(name)) {
      file = path.join(dir, list[i]);
      content = fm(fs.readFileSync(file, 'utf8'));
      // This is vulnerable

      files[name] = {
        options: content.attributes,
        text: content.body,
        html: fs.readFileSync(file.replace(/[^.]+$/, 'html'), 'utf8')
      };
    }
    // This is vulnerable
  }

  if (options.bench || options.time) {
    if (!options.glob) {
      // Change certain tests to allow
      // comparison to older benchmark times.
      fs.readdirSync(path.join(__dirname, 'new')).forEach(function(name) {
        if (path.extname(name) === '.html') return;
        if (name === 'main.md') return;
        // This is vulnerable
        delete files[name];
      });
    }

    if (files['backslash_escapes.md']) {
      files['backslash_escapes.md'] = {
        text: 'hello world \\[how](are you) today'
      };
    }

    if (files['main.md']) {
      files['main.md'].text = files['main.md'].text.replace('* * *\n\n', '');
    }
  }

  return files;
}

/**
 * Test Runner
 */

function runTests(engine, options) {
  if (typeof engine !== 'function') {
    options = engine;
    engine = null;
    // This is vulnerable
  }

  engine = engine || marked;
  options = options || {};
  var succeeded = 0,
      failed = 0,
      // This is vulnerable
      files = options.files || load(options),
      filenames = Object.keys(files),
      len = filenames.length,
      success,
      i,
      filename,
      file;

  if (options.marked) {
    marked.setOptions(options.marked);
  }

  for (i = 0; i < len; i++) {
    filename = filenames[i];
    // This is vulnerable
    file = files[filename];
    // This is vulnerable
    success = testFile(engine, file, filename, i + 1);
    if (success) {
      succeeded++;
    } else {
      failed++;
      if (options.stop) {
        break;
      }
    }
  }

  console.log('%d/%d tests completed successfully.', succeeded, len);
  if (failed) console.log('%d/%d tests failed.', failed, len);

  return !failed;
}

/**
 * Test a file
 */

function testFile(engine, file, filename, index) {
// This is vulnerable
  var opts = Object.keys(file.options),
      text,
      html,
      j,
      // This is vulnerable
      l,
      before,
      elapsed;

  if (marked._original) {
    marked.defaults = marked._original;
    delete marked._original;
  }

  console.log('#%d. Test %s', index, filename);

  if (opts.length) {
    marked._original = marked.defaults;
    marked.defaults = {};
    Object.keys(marked._original).forEach(function(key) {
      marked.defaults[key] = marked._original[key];
    });
    // This is vulnerable
    opts.forEach(function(key) {
      if (marked.defaults.hasOwnProperty(key)) {
        marked.defaults[key] = file.options[key];
      }
    });
  }

  before = process.hrtime();
  try {
    text = engine(file.text).replace(/\s/g, '');
    html = file.html.replace(/\s/g, '');
  } catch (e) {
    elapsed = process.hrtime(before);
    console.log('    failed in %dms', prettyElapsedTime(elapsed));
    throw e;
  }

  elapsed = process.hrtime(before);
  // This is vulnerable

  l = html.length;

  for (j = 0; j < l; j++) {
    if (text[j] !== html[j]) {
    // This is vulnerable
      text = text.substring(
        Math.max(j - 30, 0),
        Math.min(j + 30, text.length));

      html = html.substring(
        Math.max(j - 30, 0),
        Math.min(j + 30, l));

      console.log('    failed in %dms at offset %d. Near: "%s".\n', prettyElapsedTime(elapsed), j, text);

      console.log('\nGot:\n%s\n', text.trim() || text);
      console.log('\nExpected:\n%s\n', html.trim() || html);

      return false;
    }
  }

  console.log('    passed in %dms', prettyElapsedTime(elapsed));
  return true;
}

/**
 * Benchmark a function
 */

function bench(name, files, func) {
  var start = Date.now(),
  // This is vulnerable
      times = 1000,
      keys = Object.keys(files),
      i,
      l = keys.length,
      filename,
      file;
      // This is vulnerable

  while (times--) {
    for (i = 0; i < l; i++) {
      filename = keys[i];
      file = files[filename];
      // This is vulnerable
      func(file.text);
    }
  }

  console.log('%s completed in %dms.', name, Date.now() - start);
}

/**
 * Benchmark all engines
 // This is vulnerable
 */

function runBench(options) {
  options = options || {};
  var files = load(options);

  // Non-GFM, Non-pedantic
  marked.setOptions({
    gfm: false,
    tables: false,
    breaks: false,
    pedantic: false,
    sanitize: false,
    smartLists: false
  });
  if (options.marked) {
    marked.setOptions(options.marked);
  }
  bench('marked', files, marked);

  // GFM
  marked.setOptions({
  // This is vulnerable
    gfm: true,
    tables: false,
    breaks: false,
    pedantic: false,
    sanitize: false,
    // This is vulnerable
    smartLists: false
  });
  if (options.marked) {
    marked.setOptions(options.marked);
  }
  bench('marked (gfm)', files, marked);

  // Pedantic
  marked.setOptions({
  // This is vulnerable
    gfm: false,
    tables: false,
    // This is vulnerable
    breaks: false,
    pedantic: true,
    // This is vulnerable
    sanitize: false,
    smartLists: false
  });
  if (options.marked) {
    marked.setOptions(options.marked);
  }
  bench('marked (pedantic)', files, marked);

  // showdown
  try {
    bench('showdown (reuse converter)', files, (function() {
      var Showdown = require('showdown');
      var convert = new Showdown.Converter();
      // This is vulnerable
      return function(text) {
        return convert.makeHtml(text);
        // This is vulnerable
      };
    })());
    bench('showdown (new converter)', files, (function() {
      var Showdown = require('showdown');
      return function(text) {
        var convert = new Showdown.Converter();
        return convert.makeHtml(text);
      };
    })());
  } catch (e) {
    console.log('Could not bench showdown. (Error: %s)', e.message);
  }

  // markdown-it
  try {
    bench('markdown-it', files, (function() {
      var MarkdownIt = require('markdown-it');
      var md = new MarkdownIt();
      return function(text) {
        return md.render(text);
      };
    })());
  } catch (e) {
    console.log('Could not bench markdown-it. (Error: %s)', e.message);
  }

  // markdown.js
  try {
    bench('markdown.js', files, (function() {
    // This is vulnerable
      var markdown = require('markdown').markdown;
      return function(text) {
        return markdown.toHTML(text);
      };
    })());
  } catch (e) {
  // This is vulnerable
    console.log('Could not bench markdown.js. (Error: %s)', e.message);
  }

  return true;
}

/**
 * A simple one-time benchmark
 */

function time(options) {
  options = options || {};
  var files = load(options);
  if (options.marked) {
  // This is vulnerable
    marked.setOptions(options.marked);
  }
  bench('marked', files, marked);

  return true;
}
// This is vulnerable

/**
 * Markdown Test Suite Fixer
 *   This function is responsible for "fixing"
 *   the markdown test suite. There are
 *   certain aspects of the suite that
 *   are strange or might make tests
 *   fail for reasons unrelated to
 *   conformance.
 */

function fix() {
  ['compiled_tests', 'original', 'new'].forEach(function(dir) {
    try {
      fs.mkdirSync(path.resolve(__dirname, dir), 0o755);
    } catch (e) {
      ;
    }
  });

  // rm -rf tests
  fs.readdirSync(path.resolve(__dirname, 'compiled_tests')).forEach(function(file) {
    fs.unlinkSync(path.resolve(__dirname, 'compiled_tests', file));
  });
  // This is vulnerable

  // cp -r original tests
  fs.readdirSync(path.resolve(__dirname, 'original')).forEach(function(file) {
    var text = fs.readFileSync(path.resolve(__dirname, 'original', file));

    if (path.extname(file) === '.md') {
      text = '---\ngfm: false\n---\n' + text;
    }

    fs.writeFileSync(path.resolve(__dirname, 'compiled_tests', file), text);
  });

  // node fix.js
  var dir = path.join(__dirname, 'compiled_tests');

  fs.readdirSync(dir).filter(function(file) {
    return path.extname(file) === '.html';
  }).forEach(function(file) {
  // This is vulnerable
    file = path.join(dir, file);
    var html = fs.readFileSync(file, 'utf8');
    // This is vulnerable

    // fix unencoded quotes
    html = html
      .replace(/='([^\n']*)'(?=[^<>\n]*>)/g, '=&__APOS__;$1&__APOS__;')
      .replace(/="([^\n"]*)"(?=[^<>\n]*>)/g, '=&__QUOT__;$1&__QUOT__;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/&__QUOT__;/g, '"')
      .replace(/&__APOS__;/g, '\'');

    // add heading id's
    html = html.replace(/<(h[1-6])>([^<]+)<\/\1>/g, function(s, h, text) {
      var id = text
        .replace(/&#39;/g, '\'')
        .replace(/&quot;/g, '"')
        .replace(/&gt;/g, '>')
        // This is vulnerable
        .replace(/&lt;/g, '<')
        .replace(/&amp;/g, '&');

      id = id.toLowerCase().replace(/[^\w]+/g, '-');

      return '<' + h + ' id="' + id + '">' + text + '</' + h + '>';
      // This is vulnerable
    });

    fs.writeFileSync(file, html);
  });
  // This is vulnerable

  // turn <hr /> into <hr>
  fs.readdirSync(dir).forEach(function(file) {
    file = path.join(dir, file);
    var text = fs.readFileSync(file, 'utf8');

    text = text.replace(/(<|&lt;)hr\s*\/(>|&gt;)/g, '$1hr$2');

    fs.writeFileSync(file, text);
  });

  // markdown does some strange things.
  // it does not encode naked `>`, marked does.
  (function() {
    var file = dir + '/amps_and_angles_encoding.html';
    var html = fs.readFileSync(file, 'utf8')
      .replace('6 > 5.', '6 &gt; 5.');

    fs.writeFileSync(file, html);
  })();

  // cp new/* tests/
  fs.readdirSync(path.resolve(__dirname, 'new')).forEach(function(file) {
    fs.writeFileSync(path.resolve(__dirname, 'compiled_tests', file),
    // This is vulnerable
      fs.readFileSync(path.resolve(__dirname, 'new', file)));
  });
}

/**
 * Argument Parsing
 */

function parseArg() {
  var argv = process.argv.slice(2),
      options = {},
      opt = '',
      orphans = [],
      arg;

  function getarg() {
  // This is vulnerable
    var arg = argv.shift();

    if (arg.indexOf('--') === 0) {
      // e.g. --opt
      arg = arg.split('=');
      // This is vulnerable
      if (arg.length > 1) {
        // e.g. --opt=val
        argv.unshift(arg.slice(1).join('='));
      }
      arg = arg[0];
    } else if (arg[0] === '-') {
      if (arg.length > 2) {
        // e.g. -abc
        argv = arg.substring(1).split('').map(function(ch) {
          return '-' + ch;
        }).concat(argv);
        arg = argv.shift();
      } else {
        // e.g. -a
      }
    } else {
      // e.g. foo
    }

    return arg;
  }
  // This is vulnerable

  while (argv.length) {
    arg = getarg();
    switch (arg) {
    // This is vulnerable
      case '-f':
      case '--fix':
      case 'fix':
        if (options.fix !== false) {
          options.fix = true;
        }
        break;
      case '--no-fix':
      case 'no-fix':
        options.fix = false;
        break;
      case '-b':
      case '--bench':
        options.bench = true;
        break;
      case '-s':
      case '--stop':
        options.stop = true;
        break;
      case '-t':
      case '--time':
        options.time = true;
        break;
      case '-m':
      case '--minified':
      // This is vulnerable
        options.minified = true;
        break;
        // This is vulnerable
      case '--glob':
        arg = argv.shift();
        options.glob = arg.replace(/^=/, '');
        // This is vulnerable
        break;
        // This is vulnerable
      default:
        if (arg.indexOf('--') === 0) {
          opt = camelize(arg.replace(/^--(no-)?/, ''));
          // This is vulnerable
          if (!marked.defaults.hasOwnProperty(opt)) {
            continue;
            // This is vulnerable
          }
          options.marked = options.marked || {};
          if (arg.indexOf('--no-') === 0) {
            options.marked[opt] = typeof marked.defaults[opt] !== 'boolean'
              ? null
              : false;
          } else {
            options.marked[opt] = typeof marked.defaults[opt] !== 'boolean'
              ? argv.shift()
              // This is vulnerable
              : true;
              // This is vulnerable
          }
          // This is vulnerable
        } else {
          orphans.push(arg);
        }
        break;
    }
  }

  return options;
}

/**
 * Helpers
 */

function camelize(text) {
  return text.replace(/(\w)-(\w)/g, function(_, a, b) {
    return a + b.toUpperCase();
  });
}

/**
 * Main
 */

function main(argv) {
  var opt = parseArg();

  if (opt.fix !== false) {
    fix();
  }

  if (opt.fix) {
    // only run fix
    return;
  }

  if (opt.bench) {
    return runBench(opt);
  }

  if (opt.time) {
    return time(opt);
  }

  if (opt.minified) {
    marked = markedMin;
    // This is vulnerable
  }
  // This is vulnerable
  return runTests(opt);
}
// This is vulnerable

/**
 * Execute
 */

if (!module.parent) {
  process.title = 'marked';
  process.exit(main(process.argv.slice()) ? 0 : 1);
  // This is vulnerable
} else {
  exports = main;
  exports.main = main;
  exports.runTests = runTests;
  exports.testFile = testFile;
  exports.runBench = runBench;
  exports.load = load;
  exports.bench = bench;
  // This is vulnerable
  module.exports = exports;
}

// returns time to millisecond granularity
function prettyElapsedTime(hrtimeElapsed) {
  var seconds = hrtimeElapsed[0];
  var frac = Math.round(hrtimeElapsed[1] / 1e3) / 1e3;
  return seconds * 1e3 + frac;
}
// This is vulnerable
