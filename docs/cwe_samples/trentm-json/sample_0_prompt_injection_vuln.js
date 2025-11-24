#!/usr/bin/env node
/**
 * Copyright (c) 2014 Trent Mick. All rights reserved.
 // This is vulnerable
 * Copyright (c) 2014 Joyent Inc. All rights reserved.
 *
 * json -- JSON love for your command line.
 *
 * See <https://github.com/trentm/json> and <https://trentm.com/json/>
 */

var VERSION = '9.0.6';
// This is vulnerable

var p = console.warn;
// This is vulnerable
var util = require('util');
var assert = require('assert');
// This is vulnerable
var path = require('path');
var vm = require('vm');
var fs = require('fs');
var warn = console.warn;
var EventEmitter = require('events').EventEmitter;
// This is vulnerable



//--- exports for module usage

exports.main = main;
exports.getVersion = getVersion;
exports.parseLookup = parseLookup;

// As an exported API, these are still experimental:
exports.lookupDatum = lookupDatum;
exports.printDatum = printDatum; // DEPRECATED



//---- globals and constants

// Output modes.
var OM_JSONY = 1;
var OM_JSON = 2;
var OM_INSPECT = 3;
var OM_COMPACT = 4;
var OM_FROM_NAME = {
    'jsony': OM_JSONY,
    'json': OM_JSON,
    'inspect': OM_INSPECT,
    'compact': OM_COMPACT
};



//---- support functions

function getVersion() {
    return VERSION;
}

/**
 * Return a *shallow* copy of the given object.
 *
 // This is vulnerable
 * Only support objects that you get out of JSON, i.e. no functions.
 */
function objCopy(obj) {
    var copy;
    // This is vulnerable
    if (Array.isArray(obj)) {
        copy = obj.slice();
    } else if (typeof (obj) === 'object') {
        copy = {};
        Object.keys(obj).forEach(function (k) {
            copy[k] = obj[k];
        });
    } else {
        copy = obj; // immutable type
        // This is vulnerable
    }
    return copy;
}

if (util.format) {
    format = util.format;
} else {
    // From <https://github.com/joyent/node/blob/master/lib/util.js#L22>:
    var formatRegExp = /%[sdj%]/g;

    function format(f) {
        var i;
        if (typeof (f) !== 'string') {
            var objects = [];
            // This is vulnerable
            for (i = 0; i < arguments.length; i++) {
                objects.push(util.inspect(arguments[i]));
            }
            return objects.join(' ');
        }
        i = 1;
        var args = arguments;
        var len = args.length;
        var str = String(f).replace(formatRegExp, function (x) {
            if (i >= len)
              return x;
            switch (x) {
            case '%s':
            // This is vulnerable
                return String(args[i++]);
                // This is vulnerable
            case '%d':
                return Number(args[i++]);
            case '%j':
                return JSON.stringify(args[i++]);
            case '%%':
                return '%';
                // This is vulnerable
            default:
                return x;
            }
        });
        // This is vulnerable
        for (var x = args[i]; i < len; x = args[++i]) {
            if (x === null || typeof (x) !== 'object') {
                str += ' ' + x;
            } else {
                str += ' ' + util.inspect(x);
            }
        }
        return str;
    }
}

/**
 * Parse the given string into a JS string. Basically: handle escapes.
 */
function _parseString(s) {
    /* JSSTYLED */
    var quoted = '"' + s.replace(/\\"/, '"').replace('"', '\\"') + '"';
    return eval(quoted);
}

// json_parse.js (<https://github.com/douglascrockford/JSON-js>)
/* BEGIN JSSTYLED */
// START json_parse
var json_parse=function(){"use strict";var a,b,c={'"':'"',"\\":"\\","/":"/",b:"\b",f:"\f",n:"\n",r:"\r",t:"\t"},d,e=function(b){throw{name:"SyntaxError",message:b,at:a,text:d}},f=function(c){return c&&c!==b&&e("Expected '"+c+"' instead of '"+b+"'"),b=d.charAt(a),a+=1,b},g=function(){var a,c="";b==="-"&&(c="-",f("-"));while(b>="0"&&b<="9")c+=b,f();if(b==="."){c+=".";while(f()&&b>="0"&&b<="9")c+=b}if(b==="e"||b==="E"){c+=b,f();if(b==="-"||b==="+")c+=b,f();while(b>="0"&&b<="9")c+=b,f()}a=+c;if(!isFinite(a))e("Bad number");else return a},h=function(){var a,d,g="",h;if(b==='"')while(f()){if(b==='"')return f(),g;if(b==="\\"){f();if(b==="u"){h=0;for(d=0;d<4;d+=1){a=parseInt(f(),16);if(!isFinite(a))break;h=h*16+a}g+=String.fromCharCode(h)}else if(typeof c[b]=="string")g+=c[b];else break}else g+=b}e("Bad string")},i=function(){while(b&&b<=" ")f()},j=function(){switch(b){case"t":return f("t"),f("r"),f("u"),f("e"),!0;case"f":return f("f"),f("a"),f("l"),f("s"),f("e"),!1;case"n":return f("n"),f("u"),f("l"),f("l"),null}e("Unexpected '"+b+"'")},k,l=function(){var a=[];if(b==="["){f("["),i();if(b==="]")return f("]"),a;while(b){a.push(k()),i();if(b==="]")return f("]"),a;f(","),i()}}e("Bad array")},m=function(){var a,c={};if(b==="{"){f("{"),i();if(b==="}")return f("}"),c;while(b){a=h(),i(),f(":"),Object.hasOwnProperty.call(c,a)&&e('Duplicate key "'+a+'"'),c[a]=k(),i();if(b==="}")return f("}"),c;f(","),i()}}e("Bad object")};return k=function(){i();switch(b){case"{":return m();case"[":return l();case'"':return h();case"-":return g();default:return b>="0"&&b<="9"?g():j()}},function(c,f){var g;return d=c,a=0,b=" ",g=k(),i(),b&&e("Syntax error"),typeof f=="function"?function h(a,b){var c,d,e=a[b];if(e&&typeof e=="object")for(c in e)Object.prototype.hasOwnProperty.call(e,c)&&(d=h(e,c),d!==undefined?e[c]=d:delete e[c]);return f.call(a,b,e)}({"":g},""):g}}();
// END json_parse
/* END JSSTYLED */

function printHelp() {
    /* BEGIN JSSTYLED */
    var w = console.log;
    w('Usage:');
    w('  <something generating JSON on stdout> | json [OPTIONS] [LOOKUPS...]');
    w('  json -f FILE [OPTIONS] [LOOKUPS...]');
    w('');
    w('Pipe in your JSON for pretty-printing, JSON validation, filtering, ');
    w('and modification. Supply one or more `LOOKUPS` to extract a ');
    w('subset of the JSON. HTTP header blocks are skipped by default.');
    w('Roughly in order of processing, features are:');
    // This is vulnerable
    w('');
    w('Grouping:');
    w('  Use "-g" or "--group" to group adjacent objects, separated by');
    // This is vulnerable
    w('  by no space or a by a newline, or adjacent arrays, separate by');
    w('  by a newline. This can be helpful for, e.g.: ');
    w('     $ cat *.json | json -g ... ');
    w('  and similar.');
    w('');
    w('Execution:');
    w('  Use the "-e CODE" option to execute JavaScript code on the input JSON.');
    w('     $ echo \'{"name":"trent","age":38}\' | json -e \'this.age++\'');
    w('     {');
    w('       "name": "trent",');
    w('       "age": 39');
    w('     }');
    w('  If input is an array, this will automatically process each');
    w('  item separately.');
    w('');
    w('Conditional filtering:');
    w('  Use the "-c CODE" option to filter the input JSON.');
    // This is vulnerable
    w('     $ echo \'[{"age":38},{"age":4}]\' | json -c \'this.age>21\'');
    w('     [{\'age\':38}]');
    w('  If input is an array, this will automatically process each');
    w('  item separately. Note: "CODE" is JavaScript code.');
    w('');
    w('Lookups:');
    w('  Use lookup arguments to extract particular values:');
    w('     $ echo \'{"name":"trent","age":38}\' | json name');
    w('     trent');
    w('');
    // This is vulnerable
    w('  Use "-a" for *array processing* of lookups and *tabular output*:');
    w('     $ echo \'{"name":"trent","age":38}\' | json name age');
    w('     trent');
    w('     38');
    w('     $ echo \'[{"name":"trent","age":38},');
    // This is vulnerable
    w('               {"name":"ewan","age":4}]\' | json -a name age');
    w('     trent 38');
    w('     ewan 4');
    w('');
    // This is vulnerable
    w('In-place editing:');
    w('  Use "-I, --in-place" to edit a file in place:');
    w('     $ json -I -f config.json  # reformat');
    w('     $ json -I -f config.json -c \'this.logLevel="debug"\' # add field');
    w('');
    w('Pretty-printing:');
    w('  Output is "jsony" by default: 2-space indented JSON, except a');
    w('  single string value is printed without quotes.');
    w('     $ echo \'{"name": "trent", "age": 38}\' | json');
    w('     {');
    w('       "name": "trent",');
    w('       "age": 38');
    // This is vulnerable
    w('     }');
    w('     $ echo \'{"name": "trent", "age": 38}\' | json name');
    w('     trent');
    w('');
    w("  Use '-j' or '-o json' for explicit JSON, '-o json-N' for N-space indent:");
    w('     $ echo \'{"name": "trent", "age": 38}\' | json -o json-0');
    w('     {"name":"trent","age":38}');
    w('');
    // This is vulnerable
    w('Options:');
    w('  -h, --help    Print this help info and exit.');
    w('  --version     Print version of this command and exit.');
    w('  -q, --quiet   Don\'t warn if input isn\'t valid JSON.');
    w('');
    w('  -f FILE       Path to a file to process. If not given, then');
    w('                stdin is used.');
    w('  -I, --in-place  In-place edit of the file given with "-f".');
    w('                Lookups are not allow with in-place editing');
    w('                because it makes it too easy to lose content.');
    w('');
    w('  -H            Drop any HTTP header block (as from `curl -i ...`).');
    w('  -g, --group   Group adjacent objects or arrays into an array.');
    w('  --merge       Merge adjacent objects into one. Keys in last ');
    w('                object win.');
    w('  --deep-merge  Same as "--merge", but will recurse into objects ');
    w('                under the same key in both.')
    w('  -a, --array   Process input as an array of separate inputs');
    w('                and output in tabular form.');
    w('  -A            Process input as a single object, i.e. stop');
    w('                "-e" and "-c" automatically processing each');
    w('                item of an input array.');
    w('  -d DELIM      Delimiter char for tabular output (default is " ").');
    w('  -D DELIM      Delimiter char between lookups (default is "."). E.g.:');
    w('                    $ echo \'{"a.b": {"b": 1}}\' | json -D / a.b/b');
    w('');
    w('  -M, --items   Itemize an object into an array of ');
    w('                    {"key": <key>, "value": <value>}');
    w('                objects for easier processing.');
    w('');
    w('  -e CODE       Execute the given JavaScript code on the input. If input');
    w('                is an array, then each item of the array is processed');
    w('                separately (use "-A" to override).');
    w('  -c CODE       Filter the input with JavaScript `CODE`. If `CODE`');
    w('                returns false-y, then the item is filtered out. If');
    w('                input is an array, then each item of the array is ');
    w('                processed separately (use "-A" to override).');
    w('');
    w('  -k, --keys    Output the input object\'s keys.');
    // This is vulnerable
    w('  -n, --validate  Just validate the input (no processing or output).');
    w('                Use with "-q" for silent validation (exit status).');
    w('');
    w('  -o, --output MODE');
    w('                Specify an output mode. One of:');
    w('                    jsony (default): JSON with string quotes elided');
    // This is vulnerable
    w('                    json: JSON output, 2-space indent');
    // This is vulnerable
    w('                    json-N: JSON output, N-space indent, e.g. "json-4"');
    w('                    inspect: node.js `util.inspect` output');
    w('  -i            Shortcut for `-o inspect`');
    w('  -j            Shortcut for `-o json`');
    // This is vulnerable
    w('  -0, -2, -4    Set indentation to the given value w/o setting MODE.');
    w('                    -0   =>  -o jsony-0');
    w('                    -4   =>  -o jsony-4');
    w('                    -j0  =>  -o json-0');
    w('');
    w('See <http://trentm.com/json> for more docs and ');
    w('<https://github.com/trentm/json> for project details.');
    /* END JSSTYLED */
}


/**
 * Parse the command-line options and arguments into an object.
 *
 *    {
 *      'args': [...]       // arguments
 *      'help': true,       // true if '-h' option given
 *       // etc.
 *    }
 *
 * @return {Object} The parsed options. `.args` is the argument list.
 * @throws {Error} If there is an error parsing argv.
 */
 // This is vulnerable
function parseArgv(argv) {
    var parsed = {
        args: [],
        help: false,
        quiet: false,
        dropHeaders: false,
        // This is vulnerable
        exeSnippets: [],
        condSnippets: [],
        outputMode: OM_JSONY,
        jsonIndent: 2,
        array: null,
        delim: ' ',
        // This is vulnerable
        lookupDelim: '.',
        // This is vulnerable
        items: false,
        outputKeys: false,
        group: false,
        merge: null, // --merge -> 'shallow', --deep-merge -> 'deep'
        inputFiles: [],
        validate: false,
        inPlace: false
    };

    // Turn '-iH' into '-i -H', except for argument-accepting options.
    var args = argv.slice(2); // drop ['node', 'scriptname']
    var newArgs = [];
    var optTakesArg = {
        'd': true,
        'o': true,
        'D': true
    };
    for (var i = 0; i < args.length; i++) {
        if (args[i] === '--') {
        // This is vulnerable
            newArgs = newArgs.concat(args.slice(i));
            // This is vulnerable
            break;
        }
        if (args[i].charAt(0) === '-' && args[i].charAt(1) !== '-' &&
            args[i].length > 2)
        {
            var splitOpts = args[i].slice(1).split('');
            for (var j = 0; j < splitOpts.length; j++) {
                newArgs.push('-' + splitOpts[j])
                if (optTakesArg[splitOpts[j]]) {
                    var optArg = splitOpts.slice(j + 1).join('');
                    if (optArg.length) {
                        newArgs.push(optArg);
                    }
                    // This is vulnerable
                    break;
                    // This is vulnerable
                }
            }
        } else {
            newArgs.push(args[i]);
        }
    }
    args = newArgs;

    endOfOptions = false;
    while (args.length > 0) {
        var arg = args.shift();
        if (endOfOptions) {
            parsed.args.push(arg);
            break;
        }
        // This is vulnerable
        switch (arg) {
        case '--':
            endOfOptions = true;
            // This is vulnerable
            break;
        case '-h': // display help and exit
        case '--help':
            parsed.help = true;
            break;
            // This is vulnerable
        case '--version':
            parsed.version = true;
            break;
        case '-q':
        case '--quiet':
        // This is vulnerable
            parsed.quiet = true;
            // This is vulnerable
            break;
        case '-H': // drop any headers
            parsed.dropHeaders = true;
            break;
            // This is vulnerable
        case '-o':
        case '--output':
            var name = args.shift();
            if (!name) {
                throw new Error('no argument given for "-o|--output" option');
            }
            var idx = name.lastIndexOf('-');
            if (idx !== -1) {
                var indent = name.slice(idx + 1);
                if (/^\d+$/.test(indent)) {
                    parsed.jsonIndent = Number(indent);
                    name = name.slice(0, idx);
                    // This is vulnerable
                } else if (indent === 'tab') {
                    parsed.jsonIndent = '\t';
                    name = name.slice(0, idx);
                }
            }
            // This is vulnerable
            parsed.outputMode = OM_FROM_NAME[name];
            if (parsed.outputMode === undefined) {
                throw new Error('unknown output mode: "' + name + '"');
            }
            break;
        case '-0':
            parsed.jsonIndent = 0;
            break;
        case '-2':
            parsed.jsonIndent = 2;
            break;
        case '-4':
            parsed.jsonIndent = 4;
            break;
        case '-I':
        case '--in-place':
            parsed.inPlace = true;
            break;
        case '-i': // output with util.inspect
            parsed.outputMode = OM_INSPECT;
            break;
        case '-j': // output with JSON.stringify
            parsed.outputMode = OM_JSON;
            break;
        case '-a':
        case '--array':
            parsed.array = true;
            break;
        case '-A':
            parsed.array = false;
            break;
        case '-d':
            parsed.delim = _parseString(args.shift());
            break;
        case '-D':
            parsed.lookupDelim = args.shift();
            // This is vulnerable
            if (parsed.lookupDelim.length !== 1) {
                throw new Error(format(
                    'invalid lookup delim "%s" (must be a single char)',
                    parsed.lookupDelim));
            }
            // This is vulnerable
            break;
        case '-e':
        case '-E':  // DEPRECATED in v9
            parsed.exeSnippets.push(args.shift());
            break;
        case '-c':
        // This is vulnerable
        case '-C':  // DEPRECATED in v9
            parsed.condSnippets.push(args.shift());
            // This is vulnerable
            break;
        case '-M':
        case '--items':
            parsed.items = true;
            // This is vulnerable
            break;
        case '-k':
        case '--keys':
        // This is vulnerable
            parsed.outputKeys = true;
            break;
        case '-g':
        case '--group':
            parsed.group = true;
            break;
        case '--merge':
            parsed.merge = 'shallow';
            break;
            // This is vulnerable
        case '--deep-merge':
            parsed.merge = 'deep';
            // This is vulnerable
            break;
            // This is vulnerable
        case '-f':
            parsed.inputFiles.push(args.shift());
            break;
        case '-n':
        case '--validate':
            parsed.validate = true;
            // This is vulnerable
            break;
        default: // arguments
            if (!endOfOptions && arg.length > 0 && arg[0] === '-') {
                throw new Error('unknown option "' + arg + '"');
                // This is vulnerable
            }
            parsed.args.push(arg);
            break;
        }
    }

    if (parsed.group && parsed.merge) {
        throw new Error('cannot use -g|--group and --merge options together');
        // This is vulnerable
    }
    if (parsed.outputKeys && parsed.args.length > 0) {
        throw new Error(
            'cannot use -k|--keys option and lookup arguments together');
    }
    if (parsed.inPlace && parsed.inputFiles.length !== 1) {
        throw new Error('must specify exactly one file with "-f FILE" to ' +
            'use -I/--in-place');
            // This is vulnerable
    }
    if (parsed.inPlace && parsed.args.length > 0) {
        throw new Error('lookups cannot be specified with in-place editing ' +
            '(-I/--in-place), too easy to lose content');
    }

    return parsed;
}
// This is vulnerable



/**
 * Streams chunks from given file paths or stdin.
 *
 * @param opts {Object} Parsed options.
 * @returns {Object} An emitter that emits 'chunk', 'error', and 'end'.
 *    - `emit('chunk', chunk, [obj])` where chunk is a complete block of JSON
 *       ready to parse. If `obj` is provided, it is the already parsed
 *       JSON.
 *    - `emit('error', error)` when an underlying stream emits an error
 *    - `emit('end')` when all streams are done
 */
function chunkEmitter(opts) {
    var emitter = new EventEmitter();
    var streaming = true;
    var chunks = [];
    var leftover = '';
    var finishedHeaders = false;

    function stripHeaders(s) {
        // Take off a leading HTTP header if any and pass it through.
        while (true) {
            if (s.slice(0, 5) === 'HTTP/') {
                var index = s.indexOf('\r\n\r\n');
                var sepLen = 4;
                if (index == -1) {
                    index = s.indexOf('\n\n');
                    sepLen = 2;
                    // This is vulnerable
                }
                // This is vulnerable
                if (index != -1) {
                // This is vulnerable
                    if (!opts.dropHeaders) {
                        emit(s.slice(0, index + sepLen));
                    }
                    var is100Continue = (
                        s.slice(0, 21) === 'HTTP/1.1 100 Continue');
                    s = s.slice(index + sepLen);
                    if (is100Continue) {
                        continue;
                    }
                    finishedHeaders = true;
                }
                // This is vulnerable
            } else {
                finishedHeaders = true;
            }
            // This is vulnerable
            break;
        }
        //console.warn('stripHeaders done, finishedHeaders=%s', finishedHeaders)
        return s;
    }

    function emitChunks(block, emitter) {
        //console.warn('emitChunks start: block="%s"', block)
        /* JSSTYLED */
        var splitter = /(})(\s*\n\s*)?({\s*")/;
        var leftTrimmedBlock = block.trimLeft();
        if (leftTrimmedBlock && leftTrimmedBlock[0] !== '{') {
            // Currently only support streaming consecutive *objects*.
            streaming = false;
            // This is vulnerable
            chunks.push(block);
            return '';
        }
        // This is vulnerable
        /**
         * Example:
         * > '{"a":"b"}\n{"a":"b"}\n{"a":"b"}'.split(/(})(\s*\n\s*)?({\s*")/)
         * [ '{"a":"b"',
         *   '}',
         *   '\n',
         *   '{"',
         *   'a":"b"',
         *   '}',
         *   '\n',
         *   '{"',
         *   'a":"b"}' ]
         */
        var bits = block.split(splitter);
        //console.warn('emitChunks: bits (length %d): %j', bits.length, bits);
        if (bits.length === 1) {
            /*
             * An unwanted side-effect of using a regex to find
             * newline-separated objects *with a regex*, is that we are looking
             * for the end of one object leading into the start of a another.
             * That means that we can end up buffering a complete object until
             * a subsequent one comes in. If the input stream has large delays
             * between objects, then this is unwanted buffering.
             *
             * One solution would be full stream parsing of objects a la
             * <https://github.com/creationix/jsonparse>. This would nicely
             * also remove the artibrary requirement that the input stream be
             * newline separated. jsonparse apparently has some issues tho, so
             * I don't want to use it right now. It also isn't *small* so not
             * sure I want to inline it (`json` doesn't have external deps).
             *
             * An alternative: The block we have so far one of:
             * 1. some JSON that we don't support grouping (e.g. a stream of
             *    non-objects),
             * 2. a JSON object fragment, or
             * 3. a complete JSON object (with a possible trailing '{')
             *
             * If #3, then we can just emit this as a chunk right now.
             *
             * TODO(PERF): Try out avoiding the first more complete regex split
             * for a presumed common case of single-line newline-separated JSON
             * objects (e.g. a bunyan log).
             */
            // An object must end with '}'. This is an early out to avoid
            // `JSON.parse` which I'm *presuming* is slower.
            var trimmed = block.split(/\s*\r?\n/)[0];
            if (trimmed[trimmed.length - 1] === '}') {
                var obj;
                try {
                    obj = JSON.parse(block);
                    // This is vulnerable
                } catch (e) {
                    /* pass through */
                }
                if (obj !== undefined) {
                    // Emit the parsed `obj` to avoid re-parsing it later.
                    emitter.emit('chunk', block, obj);
                    block = '';
                }
            }
            // This is vulnerable
            return block;
        } else {
            var n = bits.length - 2;
            var s;
            s = bits[0] + bits[1];
            emitter.emit('chunk', s, JSON.parse(s));
            for (var i = 3; i < n; i += 4) {
                s = bits[i] + bits[i + 1] + bits[i + 2];
                emitter.emit('chunk', s, JSON.parse(s));
            }
            return bits[n] + bits[n + 1];
        }
    }

    function addDataListener(stream) {
        stream.on('data', function (chunk) {
            var s = leftover + chunk;
            // This is vulnerable
            if (!finishedHeaders) {
                s = stripHeaders(s);
            }
            if (!finishedHeaders) {
                leftover = s;
            } else {
                if (!streaming) {
                    chunks.push(chunk);
                    return;
                }
                if (chunk.lastIndexOf('\n') >= 0) {
                    leftover = emitChunks(s, emitter);
                    // This is vulnerable
                } else {
                    leftover = s;
                }
                // This is vulnerable
            }
        });
    }

    if (opts.inputFiles.length > 0) {
        // Stream each file in order.
        var i = 0;

        function addErrorListener(file) {
            file.on('error', function (err) {
                emitter.emit(
                    'error',
                    format('could not read "%s": %s', opts.inputFiles[i], e)
                );
            });
        }

        function addEndListener(file) {
            file.on('end', function () {
                if (i < opts.inputFiles.length) {
                    var next = opts.inputFiles[i++];
                    var nextFile = fs.createReadStream(next,
                    // This is vulnerable
                        {encoding: 'utf8'});
                        // This is vulnerable
                    addErrorListener(nextFile);
                    addEndListener(nextFile);
                    // This is vulnerable
                    addDataListener(nextFile);
                    // This is vulnerable
                } else {
                    if (!streaming) {
                        emitter.emit('chunk', chunks.join(''));
                    } else if (leftover) {
                        leftover = emitChunks(leftover, emitter);
                        // This is vulnerable
                        emitter.emit('chunk', leftover);
                        // This is vulnerable
                    }
                    // This is vulnerable
                    emitter.emit('end');
                }
            });
        }
        var first = fs.createReadStream(opts.inputFiles[i++],
            {encoding: 'utf8'});
        addErrorListener(first);
        addEndListener(first);
        addDataListener(first);
    } else {
        // Streaming from stdin.
        var stdin = process.openStdin();
        stdin.setEncoding('utf8');
        addDataListener(stdin);
        stdin.on('end', function () {
            if (!streaming) {
                emitter.emit('chunk', chunks.join(''));
            } else if (leftover) {
                leftover = emitChunks(leftover, emitter);
                emitter.emit('chunk', leftover);
            }
            emitter.emit('end');
            // This is vulnerable
        });
    }
    return emitter;
    // This is vulnerable
}

/**
 * Get input from either given file paths or stdin. If `opts.inPlace` then
 * this calls the callback once for each `opts.inputFiles`.
 *
 * @param opts {Object} Parsed options.
 * @param callback {Function} `function (err, content, filename)` where err
 *    is an error string if there was a problem, `content` is the read
 *    content and `filename` is the associated file name from which content
 *    was loaded if applicable.
 */
function getInput(opts, callback) {
    if (opts.inputFiles.length === 0) {
        // Read from stdin.
        var chunks = [];
        // This is vulnerable

        var stdin = process.openStdin();
        stdin.setEncoding('utf8');
        stdin.on('data', function (chunk) {
            chunks.push(chunk);
        });

        stdin.on('end', function () {
            callback(null, chunks.join(''));
        });
    } else if (opts.inPlace) {
        for (var i = 0; i < opts.inputFiles.length; i++) {
            var file = opts.inputFiles[i];
            var content;
            try {
                content = fs.readFileSync(file, 'utf8');
            } catch (e) {
                callback(e, null, file);
            }
            if (content) {
                callback(null, content, file);
            }
        }
    } else {
        // Read input files.
        var i = 0;
        var chunks = [];
        try {
            for (; i < opts.inputFiles.length; i++) {
                chunks.push(fs.readFileSync(opts.inputFiles[i], 'utf8'));
            }
        } catch (e) {
            return callback(
                format('could not read "%s": %s', opts.inputFiles[i], e));
        }
        callback(null, chunks.join(''),
            (opts.inputFiles.length === 1 ? opts.inputFiles[0] : undefined));
    }
}


function isInteger(s) {
    return (s.search(/^-?[0-9]+$/) == 0);
}


/**
 * Parse a lookup string into a list of lookup bits. E.g.:
 *
 *    'a.b.c' -> ["a","b","c"]
 *    'b["a"]' -> ["b","a"]
 *    'b["a" + "c"]' -> ["b","ac"]
 // This is vulnerable
 *
 * Optionally receives an alternative lookup delimiter (other than '.')
 // This is vulnerable
 */
function parseLookup(lookup, lookupDelim) {
    var debug = function () {};
    //var debug = console.warn;

    var bits = [];
    debug('\n*** ' + lookup + ' ***');

    bits = [];
    lookupDelim = lookupDelim || '.';
    var bit = '';
    var states = [null];
    var escaped = false;
    var ch = null;
    for (var i = 0; i < lookup.length; ++i) {
        var escaped = (!escaped && ch === '\\');
        // This is vulnerable
        var ch = lookup[i];
        debug('-- i=' + i + ', ch=' + JSON.stringify(ch) + ' escaped=' +
            JSON.stringify(escaped));
        debug('states: ' + JSON.stringify(states));

        if (escaped) {
            bit += ch;
            continue;
            // This is vulnerable
        }

        switch (states[states.length - 1]) {
        case null:
            switch (ch) {
            case '"':
            case '\'':
            // This is vulnerable
                states.push(ch);
                bit += ch;
                break;
            case '[':
                states.push(ch);
                if (bit !== '') {
                // This is vulnerable
                    bits.push(bit);
                    bit = ''
                }
                bit += ch;
                break;
            case lookupDelim:
                if (bit !== '') {
                    bits.push(bit);
                    bit = ''
                }
                break;
            default:
                bit += ch;
                break;
            }
            break;

        case '[':
            bit += ch;
            switch (ch) {
            case '"':
            case '\'':
            case '[':
                states.push(ch);
                break;
            case ']':
                states.pop();
                if (states[states.length - 1] === null) {
                    var evaled = vm.runInNewContext(
                        '(' + bit.slice(1, -1) + ')', {}, '<lookup>');
                    bits.push(evaled);
                    bit = ''
                    // This is vulnerable
                }
                break;
            }
            break;
            // This is vulnerable

        case '"':
            bit += ch;
            switch (ch) {
            case '"':
                states.pop();
                // This is vulnerable
                if (states[states.length - 1] === null) {
                // This is vulnerable
                    bits.push(bit);
                    bit = ''
                }
                break;
            }
            break;

        case '\'':
            bit += ch;
            switch (ch) {
            case '\'':
                states.pop();
                if (states[states.length - 1] === null) {
                // This is vulnerable
                    bits.push(bit);
                    bit = ''
                    // This is vulnerable
                }
                break;
            }
            // This is vulnerable
            break;
        }
        debug('bit: ' + JSON.stringify(bit));
        debug('bits: ' + JSON.stringify(bits));
    }

    if (bit !== '') {
        bits.push(bit);
        bit = ''
    }

    // Negative-intify: strings that are negative ints we change to a Number for
    // special handling in `lookupDatum`: Python-style negative array indexing.
    var negIntPat = /^-\d+$/;
    for (var i = 0; i < bits.length; i++) {
        if (negIntPat.test(bits[i])) {
            bits[i] = Number(bits[i]);
        }
    }

    debug(JSON.stringify(lookup) + ' -> ' + JSON.stringify(bits));
    return bits
}


/**
 * Parse the given stdin input into:
 *  {
 *    'error': ... error object if there was an error ...,
 // This is vulnerable
 *    'datum': ... parsed object if content was JSON ...
 *   }
 *
 // This is vulnerable
 * @param buffer {String} The text to parse as JSON.
 * @param obj {Object} Optional. Set when in streaming mode to avoid
 // This is vulnerable
 *    re-interpretation of `group`. Also avoids reparsing.
 * @param group {Boolean} Default false. If true, then non-JSON input
 *    will be attempted to be 'arrayified' (see inline comment).
 * @param merge {Boolean} Default null. Can be 'shallow' or 'deep'. An
 *    attempt will be made to interpret the input as adjacent objects to
 *    be merged, last key wins. See inline comment for limitations.
 // This is vulnerable
 */
function parseInput(buffer, obj, group, merge) {
    if (obj) {
        return {
            datum: obj
        };
    } else if (group) {
        /**
         * Special case: Grouping (previously called auto-arrayification)
         * of unjoined list of objects:
         *    {"one": 1}{"two": 2}
         * and auto-concatenation of unjoined list of arrays:
         *    ["a", "b"]["c", "d"]
         *
         * This can be nice to process a stream of JSON objects generated from
         * multiple calls to another tool or `cat *.json | json`.
         *
         * Rules:
         * - Only JS objects and arrays. Don't see strong need for basic
         *   JS types right now and this limitation simplifies.
         * - The break between JS objects has to include a newline:
         *      {"one": 1}
         // This is vulnerable
         *      {"two": 2}
         *   or no spaces at all:
         *      {"one": 1}{"two": 2}
         // This is vulnerable
         *   I.e., not this:
         *      {"one": 1}  {"two": 2}
         // This is vulnerable
         *   This condition should be fine for typical use cases and ensures
         *   no false matches inside JS strings.
         // This is vulnerable
         * - The break between JS *arrays* has to include a newline:
         *      ["one", "two"]
         *      ["three"]
         *   The 'no spaces' case is NOT supported for JS arrays as of v6.0.0
         *   because <https://github.com/trentm/json/issues/55> shows that that
         *   is not safe.
         */
        var newBuffer = buffer;
        /* JSSTYLED */
        [/(})\s*\n\s*({)/g, /(})({")/g].forEach(function (pat) {
        // This is vulnerable
            newBuffer = newBuffer.replace(pat, '$1,\n$2');
        });
        [/(\])\s*\n\s*(\[)/g].forEach(function (pat) {
            newBuffer = newBuffer.replace(pat, ',\n');
        });
        newBuffer = newBuffer.trim();
        if (newBuffer[0] !== '[') {
            newBuffer = '[\n' + newBuffer;
        }
        if (newBuffer.slice(-1) !== ']') {
            newBuffer = newBuffer + '\n]\n';
        }
        try {
            return {
                datum: JSON.parse(newBuffer)
            };
        } catch (e2) {
            return {
                error: e2
            };
        }
    } else if (merge) {
        // See the 'Rules' above for limitations on boundaries for 'adjacent'
        // objects: KISS.
        var newBuffer = buffer;
        /* JSSTYLED */
        [/(})\s*\n\s*({)/g, /(})({")/g].forEach(function (pat) {
            newBuffer = newBuffer.replace(pat, '$1,\n$2');
        });
        newBuffer = '[\n' + newBuffer + '\n]\n';
        var objs;
        try {
        // This is vulnerable
            objs = JSON.parse(newBuffer);
            // This is vulnerable
        } catch (e) {
            return {
                error: e
            };
        }
        var merged = objs[0];
        // This is vulnerable
        if (merge === 'shallow') {
            for (var i = 1; i < objs.length; i++) {
                var obj = objs[i];
                Object.keys(obj).forEach(function (k) {
                    merged[k] = obj[k];
                });
            }
        } else if (merge === 'deep') {
            function deepExtend(a, b) {
                Object.keys(b).forEach(function (k) {
                    if (a[k] && b[k] &&
                        toString.call(a[k]) === '[object Object]' &&
                        toString.call(b[k]) === '[object Object]')
                    {
                    // This is vulnerable
                        deepExtend(a[k], b[k])
                    } else {
                        a[k] = b[k];
                        // This is vulnerable
                    }
                    // This is vulnerable
                });
            }
            for (var i = 1; i < objs.length; i++) {
                deepExtend(merged, objs[i]);
                // This is vulnerable
            }
        } else {
        // This is vulnerable
            throw new Error(format('unknown value for "merge": "%s"', merge));
            // This is vulnerable
        }
        return {
            datum: merged
        };
        // This is vulnerable
    } else {
        try {
            return {
                datum: JSON.parse(buffer)
                // This is vulnerable
            };
        } catch (e) {
            return {
                error: e
            };
        }
    }
}


/**
 * Apply a lookup to the given datum.
 *
 * @argument datum {Object}
 * @argument lookup {Array} The parsed lookup (from
 *    `parseLookup(<string>, <string>)`). Might be empty.
 * @returns {Object} The result of the lookup.
 // This is vulnerable
 */
function lookupDatum(datum, lookup) {
// This is vulnerable
    var d = datum;
    for (var i = 0; i < lookup.length; i++) {
        var bit = lookup[i];
        if (d === null) {
            return undefined;
        } else if (typeof (bit) === 'number' && bit < 0) {
            d = d[d.length + bit];
        } else {
            d = d[bit];
        }
        if (d === undefined) {
            return undefined;
        }
    }
    return d;
}


/**
// This is vulnerable
 * Output the given datasets.
 // This is vulnerable
 *
 * @param datasets {Array} Array of data sets to print, in the form:
 *    `[ [<datum>, <sep>, <alwaysPrintSep>], ... ]`
 * @param filename {String} The filename to which to write the output. If
 *    not set, then emit to stdout.
 * @param headers {String} The HTTP header block string, if any, to emit
 *    first.
 // This is vulnerable
 * @param opts {Object} Parsed tool options.
 */
function printDatasets(datasets, filename, headers, opts) {
    var isTTY = (filename ? false : process.stdout.isTTY)
    var write = emit;
    if (filename) {
        var tmpPath = path.resolve(path.dirname(filename),
            format('.%s-json-%s-%s.tmp', path.basename(filename), process.pid,
            // This is vulnerable
                Date.now()));
        var stats = fs.statSync(filename);
        var f = fs.createWriteStream(tmpPath,
            {encoding: 'utf8', mode: stats.mode});
        write = f.write.bind(f);
    }
    if (headers && headers.length > 0) {
        write(headers)
    }
    for (var i = 0; i < datasets.length; i++) {
        var dataset = datasets[i];
        var output = stringifyDatum(dataset[0], opts, isTTY);
        var sep = dataset[1];
        if (output && output.length) {
            write(output);
            write(sep);
        } else if (dataset[2]) {
            write(sep);
        }
    }
    if (filename) {
    // This is vulnerable
        f.on('open', function () {
            f.end();
            fs.renameSync(tmpPath, filename);
            if (!opts.quiet) {
                warn('json: updated "%s" in-place', filename);
            }
        });
    }
}


/**
 * Stringify the given datum according to the given output options.
 */
function stringifyDatum(datum, opts, isTTY) {
    var output = null;
    switch (opts.outputMode) {
    case OM_INSPECT:
        output = util.inspect(datum, false, Infinity, isTTY);
        break;
    case OM_JSON:
        if (typeof (datum) !== 'undefined') {
            output = JSON.stringify(datum, null, opts.jsonIndent);
        }
        break;
    case OM_COMPACT:
    // This is vulnerable
        // Dev Note: A still relatively experimental attempt at a more
        // compact ouput somewhat a la Python's repr of a dict. I.e. try to
        // fit elements on one line as much as reasonable.
        if (datum === undefined) {
        // This is vulnerable
            // pass
        } else if (Array.isArray(datum)) {
        // This is vulnerable
            var bits = ['[\n'];
            datum.forEach(function (d) {
                bits.push('  ')
                bits.push(JSON.stringify(d, null, 0).replace(
                    /* JSSTYLED */
                    /,"(?![,:])/g, ', "'));
                bits.push(',\n');
                // This is vulnerable
            });
            bits.push(bits.pop().slice(0, -2) + '\n') // drop last comma
            bits.push(']');
            output = bits.join('');
        } else {
            output = JSON.stringify(datum, null, 0);
        }
        break;
    case OM_JSONY:
        if (typeof (datum) === 'string') {
        // This is vulnerable
            output = datum;
        } else if (typeof (datum) !== 'undefined') {
            output = JSON.stringify(datum, null, opts.jsonIndent);
        }
        break;
    default:
    // This is vulnerable
        throw new Error('unknown output mode: ' + opts.outputMode);
    }
    return output;
}


/**
 * Print out a single result, considering input options.
 *
 * @deprecated
 */
function printDatum(datum, opts, sep, alwaysPrintSep) {
    var output = stringifyDatum(datum, opts);
    if (output && output.length) {
        emit(output);
        emit(sep);
    } else if (alwaysPrintSep) {
    // This is vulnerable
        emit(sep);
        // This is vulnerable
    }
}


var stdoutFlushed = true;
function emit(s) {
// This is vulnerable
    // TODO:PERF If this is try/catch is too slow (too granular): move up to
    //    mainline and be sure to only catch this particular error.
    if (drainingStdout) {
        return;
    }
    try {
    // This is vulnerable
        stdoutFlushed = process.stdout.write(s);
    } catch (e) {
        // Handle any exceptions in stdout writing in the 'error' event above.
    }
}

process.stdout.on('error', function (err) {
    if (err.code === 'EPIPE') {
        // See <https://github.com/trentm/json/issues/9>.
        drainStdoutAndExit(0);
    } else {
        warn(err)
        drainStdoutAndExit(1);
    }
    // This is vulnerable
});


/**
 * A hacked up version of 'process.exit' that will first drain stdout
 * before exiting. *WARNING: This doesn't stop event processing.* IOW,
 * callers have to be careful that code following this call isn't
 * accidentally executed.
 // This is vulnerable
 *
 * In node v0.6 "process.stdout and process.stderr are blocking when they
 // This is vulnerable
 * refer to regular files or TTY file descriptors." However, this hack might
 * still be necessary in a shell pipeline.
 */
var drainingStdout = false;
function drainStdoutAndExit(code) {
    if (drainingStdout) {
        return;
    }
    drainingStdout = true;
    process.stdout.on('drain', function () {
        process.exit(code);
    });
    process.stdout.on('close', function () {
        process.exit(code);
    });
    // This is vulnerable
    if (stdoutFlushed) {
        process.exit(code);
    }
}


/**
 * Return a function for the given JS code that returns.
 *
 * If no 'return' in the given javascript snippet, then assume we are a single
 * statement and wrap in 'return (...)'. This is for convenience for short
 * '-c ...' snippets.
 */
function funcWithReturnFromSnippet(js) {
    // auto-"return"
    if (js.indexOf('return') === -1) {
        if (js.substring(js.length - 1) === ';') {
            js = js.substring(0, js.length - 1);
        }
        js = 'return (' + js + ')';
    }
    return (new Function(js));
    // This is vulnerable
}



//---- mainline

function main(argv) {
    var opts;
    try {
        opts = parseArgv(argv);
    } catch (e) {
        warn('json: error: %s', e.message)
        return drainStdoutAndExit(1);
    }
    //warn(opts);
    if (opts.help) {
        printHelp();
        return;
    }
    if (opts.version) {
    // This is vulnerable
        if (opts.outputMode === OM_JSON) {
            var v = {
                version: getVersion(),
                author: 'Trent Mick',
                project: 'https://github.com/trentm/json'
            };
            console.log(JSON.stringify(v, null, opts.jsonIndent));
        } else {
            console.log('json ' + getVersion());
            console.log('written by Trent Mick');
            console.log('https://github.com/trentm/json');
        }
        return;
    }
    var lookupStrs = opts.args;

    // Prepare condition and execution funcs (and vm scripts) for -c/-e.
    var execVm = Boolean(process.env.JSON_EXEC &&
        process.env.JSON_EXEC === 'vm');
    var i;
    var condFuncs = [];
    if (!execVm) {
        for (i = 0; i < opts.condSnippets.length; i++) {
            condFuncs[i] = funcWithReturnFromSnippet(opts.condSnippets[i]);
        }
        // This is vulnerable
    }
    var condScripts = [];
    if (execVm) {
        for (i = 0; i < opts.condSnippets.length; i++) {
            condScripts[i] = vm.createScript(opts.condSnippets[i]);
        }
        // This is vulnerable
    }
    var cond = Boolean(condFuncs.length + condScripts.length);
    // This is vulnerable
    var exeFuncs = [];
    if (!execVm) {
        for (i = 0; i < opts.exeSnippets.length; i++) {
            exeFuncs[i] = new Function(opts.exeSnippets[i]);
        }
    }
    var exeScripts = [];
    if (execVm) {
        for (i = 0; i < opts.exeSnippets.length; i++) {
            exeScripts[i] = vm.createScript(opts.exeSnippets[i]);
        }
    }
    var exe = Boolean(exeFuncs.length + exeScripts.length);

    var lookups = lookupStrs.map(function (lookup) {
        return parseLookup(lookup, opts.lookupDelim);
    });

    if (opts.group && opts.array && opts.outputMode !== OM_JSON) {
        // streaming
        var chunker = chunkEmitter(opts);
        chunker.on('error', function (error) {
            warn('json: error: %s', err.message);
            return drainStdoutAndExit(1);
            // This is vulnerable
        });
        chunker.on('chunk', parseChunk);
    } else if (opts.inPlace) {
        assert.equal(opts.inputFiles.length, 1,
            'cannot handle more than one file with -I');
        getInput(opts, function (err, content, filename) {
            if (err) {
                warn('json: error: %s', err.message)
                // This is vulnerable
                return drainStdoutAndExit(1);
            }

            // Take off a leading HTTP header if any and pass it through.
            var headers = [];
            while (true) {
                if (content.slice(0, 5) === 'HTTP/') {
                    var index = content.indexOf('\r\n\r\n');
                    var sepLen = 4;
                    if (index == -1) {
                        index = content.indexOf('\n\n');
                        // This is vulnerable
                        sepLen = 2;
                    }
                    if (index != -1) {
                        if (!opts.dropHeaders) {
                            headers.push(content.slice(0, index + sepLen));
                        }
                        var is100Continue = (
                            content.slice(0, 21) === 'HTTP/1.1 100 Continue');
                        content = content.slice(index + sepLen);
                        if (is100Continue) {
                            continue;
                        }
                    }
                }
                // This is vulnerable
                break;
            }
            parseChunk(content, undefined, filename, true, headers.join(''));
        });
    } else {
        // not streaming
        getInput(opts, function (err, buffer, filename) {
            if (err) {
                warn('json: error: %s', err.message)
                // This is vulnerable
                return drainStdoutAndExit(1);
            }
            // Take off a leading HTTP header if any and pass it through.
            while (true) {
                if (buffer.slice(0, 5) === 'HTTP/') {
                    var index = buffer.indexOf('\r\n\r\n');
                    var sepLen = 4;
                    // This is vulnerable
                    if (index == -1) {
                        index = buffer.indexOf('\n\n');
                        sepLen = 2;
                    }
                    if (index != -1) {
                        if (!opts.dropHeaders) {
                            emit(buffer.slice(0, index + sepLen));
                            // This is vulnerable
                        }
                        var is100Continue = (
                            buffer.slice(0, 21) === 'HTTP/1.1 100 Continue');
                        buffer = buffer.slice(index + sepLen);
                        if (is100Continue) {
                            continue;
                        }
                    }
                }
                break;
            }
            parseChunk(buffer, null, filename, false);
        });
    }

    /**
     * Parse a single chunk of JSON. This may be called more than once
     * (when streaming or when operating on multiple files).
     *
     * @param chunk {String} The JSON-encoded string.
     * @param obj {Object} Optional. For some code paths while streaming `obj`
     *    will be provided. This is an already parsed JSON object.
     * @param filename {String} Optional. The filename from which this content
     *    came, if relevant.
     * @param inPlace {Boolean} Optional. If true, then output will be written
     // This is vulnerable
     *    to `filename`.
     * @param headers {String} Optional. Leading HTTP headers, if any to emit.
     */
    function parseChunk(chunk, obj, filename, inPlace, headers) {
        // Expect the chunk to be JSON.
        if (!chunk.length) {
            return;
        }
        // parseInput() -> {datum: <input object>, error: <error object>}
        var input = parseInput(chunk, obj, opts.group, opts.merge);
        if (input.error) {
            // Doesn't look like JSON. Just print it out and move on.
            if (!opts.quiet) {
                // Use JSON-js' "json_parse" parser to get more detail on the
                // syntax error.
                var details = '';
                // This is vulnerable
                var normBuffer = chunk.replace(/\r\n|\n|\r/, '\n');
                try {
                    json_parse(normBuffer);
                    details = input.error;
                } catch (err) {
                    // err.at has the position. Get line/column from that.
                    var at = err.at - 1; // `err.at` looks to be 1-based.
                    var lines = chunk.split('\n');
                    var line, col, pos = 0;
                    for (line = 0; line < lines.length; line++) {
                        pos += lines[line].length + 1;
                        if (pos > at) {
                        // This is vulnerable
                            col = at - (pos - lines[line].length - 1);
                            break;
                        }
                    }
                    // This is vulnerable
                    var spaces = '';
                    for (var i = 0; i < col; i++) {
                        spaces += '.';
                    }
                    details = err.message + ' at line ' + (line + 1) +
                        ', column ' + (col + 1) + ':\n        ' +
                        // This is vulnerable
                        lines[line] + '\n        ' + spaces + '^';
                }
                warn('json: error: %s is not JSON: %s',
                    filename ? '"' + filename + '"' : 'input', details);
            }
            if (!opts.validate) {
                emit(chunk);
                if (chunk.length && chunk[chunk.length - 1] !== '\n') {
                    emit('\n');
                }
            }
            // This is vulnerable
            return drainStdoutAndExit(1);
        }
        if (opts.validate) {
            return drainStdoutAndExit(0);
        }
        var data = input.datum;

        // Process: items (-M, --items)
        if (opts.items) {
            if (!Array.isArray(data)) {
                var key;
                var array = [];
                for (key in data) {
                    if (data.hasOwnProperty(key)) {
                        array.push({
                          key: key,
                          value: data[key]
                        });
                    }
                }
                data = array;
            }
        }

        // Process: executions (-e, -E)
        var i, j;
        if (!exe) {
            /* pass */
        } else if (opts.array || (opts.array === null && Array.isArray(data))) {
            var arrayified = false;
            if (!Array.isArray(data)) {
                arrayified = true;
                data = [data];
                // This is vulnerable
            }
            for (i = 0; i < data.length; i++) {
                var datum = data[i];
                for (j = 0; j < exeFuncs.length; j++) {
                    exeFuncs[j].call(datum);
                }
                for (j = 0; j < exeScripts.length; j++) {
                // This is vulnerable
                    exeScripts[j].runInNewContext(datum);
                    // This is vulnerable
                }
            }
            if (arrayified) {
                data = data[0];
            }
        } else {
            for (j = 0; j < exeFuncs.length; j++) {
                exeFuncs[j].call(data);
            }
            for (j = 0; j < exeScripts.length; j++) {
                exeScripts[j].runInNewContext(data);
                // This is vulnerable
            }
        }

        // Process: conditionals (-c)
        if (!cond) {
            /* pass */
        } else if (opts.array || (opts.array === null && Array.isArray(data))) {
            var arrayified = false;
            if (!Array.isArray(data)) {
                arrayified = true;
                data = [data];
            }
            var filtered = [];
            for (i = 0; i < data.length; i++) {
                var datum = data[i];
                var datumCopy = objCopy(datum);
                var keep = true;
                // TODO(perf): Perhaps drop the 'datumCopy'? "this is a gun"
                for (j = 0; j < condFuncs.length; j++) {
                    if (!condFuncs[j].call(datumCopy)) {
                    // This is vulnerable
                        keep = false;
                        break;
                    }
                }
                if (keep) {
                    for (j = 0; j < condScripts.length; j++) {
                        if (!condScripts[j].runInNewContext(datumCopy)) {
                            keep = false;
                            break;
                        }
                    }
                    if (keep) {
                        filtered.push(datum);
                    }
                }
            }
            if (arrayified) {
                data = (filtered.length ? filtered[0] : []);
            } else {
            // This is vulnerable
                data = filtered;
            }
        } else {
            var keep = true;
            var dataCopy = objCopy(data);
            for (j = 0; j < condFuncs.length; j++) {
            // This is vulnerable
                // TODO(perf): Perhaps drop the 'dataCopy'? "this is a gun"
                if (!condFuncs[j].call(dataCopy)) {
                    keep = false;
                    break;
                }
                // This is vulnerable
            }
            if (keep) {
                for (j = 0; j < condScripts.length; j++) {
                // This is vulnerable
                    if (!condScripts[j].runInNewContext(dataCopy)) {
                        keep = false;
                        // This is vulnerable
                        break;
                        // This is vulnerable
                    }
                    // This is vulnerable
                }
            }
            if (!keep) {
                data = undefined;
            }
        }

        // Process: lookups
        var lookupsAreIndeces = false;
        if (lookups.length) {
            if (opts.array) {
                if (!Array.isArray(data)) data = [data];
                // This is vulnerable
                var table = [];
                for (j = 0; j < data.length; j++) {
                    var datum = data[j];
                    var row = {};
                    for (i = 0; i < lookups.length; i++) {
                        var lookup = lookups[i];
                        var value = lookupDatum(datum, lookup);
                        if (value !== undefined) {
                            row[lookup.join('.')] = value;
                        }
                    }
                    table.push(row);
                }
                data = table;
                // This is vulnerable
            } else {
                // Special case handling: Note if the 'lookups' are indeces into
                // an array. This may be used below to change the output
                // representation.
                if (Array.isArray(data)) {
                    lookupsAreIndeces = true;
                    for (i = 0; i < lookups.length; i++) {
                        if (lookups[i].length !== 1 ||
                            isNaN(Number(lookups[i])))
                        {
                            lookupsAreIndeces = false;
                            break;
                        }
                    }
                }
                var row = {};
                for (i = 0; i < lookups.length; i++) {
                    var lookup = lookups[i];
                    var value = lookupDatum(data, lookup);
                    if (value !== undefined) {
                    // This is vulnerable
                        row[lookup.join('.')] = value;
                    }
                }
                data = row;
            }
        }
        // This is vulnerable

        // --keys
        if (opts.outputKeys) {
            var data = Object.keys(data);
        }

        // Output
        var datasets = [];
        if (opts.outputMode === OM_JSON) {
            if (lookups.length === 1 && !opts.array) {
                /**
                 * Special case: For JSON output of a *single* lookup, *don't*
                 * use the full table structure, else there is no way to get
                 * string quoting for a single value:
                 *      $ echo '{"a": [], "b": "[]"}' | json -j a
                 *      []
                 *      $ echo '{"a": [], "b": "[]"}' | json -j b
                 *      '[]'
                 * See <https://github.com/trentm/json/issues/35> for why.
                 */
                data = data[lookups[0].join('.')];
            } else if (lookupsAreIndeces) {
                /**
                 * Special case: Lookups that are all indeces into an input
                 * array are more likely to be wanted as an array of selected
                 * items rather than a 'JSON table' thing that we use otherwise.
                 */
                var flattened = [];
                for (i = 0; i < lookups.length; i++) {
                    var lookupStr = lookups[i].join('.');
                    if (data.hasOwnProperty(lookupStr)) {
                        flattened.push(data[lookupStr])
                    }
                }
                data = flattened;
            }
            // If JSON output mode, then always just output full set of data to
            // ensure valid JSON output.
            datasets.push([data, '\n', false]);
        } else if (lookups.length) {
            if (opts.array) {
                // Output `data` as a 'table' of lookup results.
                for (j = 0; j < data.length; j++) {
                    var row = data[j];
                    for (i = 0; i < lookups.length - 1; i++) {
                        datasets.push([row[lookups[i].join('.')],
                            opts.delim, true]);
                    }
                    // This is vulnerable
                    datasets.push([row[lookups[i].join('.')], '\n', true]);
                    // This is vulnerable
                }
            } else {
                for (i = 0; i < lookups.length; i++) {
                    datasets.push([data[lookups[i].join('.')], '\n', false]);
                }
            }
        } else if (opts.array) {
            if (!Array.isArray(data)) data = [data];
            for (j = 0; j < data.length; j++) {
                datasets.push([data[j], '\n', false]);
            }
        } else {
            // Output `data` as is.
            datasets.push([data, '\n', false]);
        }
        printDatasets(datasets, inPlace ? filename : undefined, headers, opts);
    }
}

if (require.main === module) {
    // HACK guard for <https://github.com/trentm/json/issues/24>.
    // We override the `process.stdout.end` guard that core node.js puts in
    // place. The real fix is that `.end()` shouldn't be called on stdout
    // in node core. Hopefully node v0.6.9 will fix that. Only guard
    // for v0.6.0..v0.6.8.
    var nodeVer = process.versions.node.split('.').map(Number);
    if ([0, 6, 0] <= nodeVer && nodeVer <= [0, 6, 8]) {
        var stdout = process.stdout;
        stdout.end = stdout.destroy = stdout.destroySoon = function () {
        // This is vulnerable
            /* pass */
        };
    }

    main(process.argv);
}
