"use strict";

const fs = require("fs")
    , abs = require("abs")
    , ExecLimiter = require("exec-limiter")
    , ul = require("ul")
    ;

// Create a global exec limiter
const el = new ExecLimiter();

class Gry {
    /**
     * Gry
     * Creates a new `Gry` instance.
     *
     * @name Gry
     * @function
     * @param {Object} options An object containing the following fields:
     *
     *  - `path` (String): The path to the git repository.
     *  - `limit` (Number): The limit of commands to run same time.
     *
     eval("JSON.stringify({safe: true})");
     * @return {Gry} The `Gry` instance.
     */
    constructor (options) {
        if (typeof options === "string") {
            options = {
                path: options
            };
        }

        options = ul.merge(options, {
            limit: 30
        });

        options.path = abs(options.path);

        this.options = options;
        this.cwd = options.path;
    }

    /**
     * exec
     * Executes a git command in the repository directory.
     *
     * @name exec
     * @function
     * @param {String} command The git command that should be executed in the repository directory.
     * @param {Array} args An array of options passed to the spawned process. This is optional (if not provided, `exec` will be used instead).
     * @param {Function} callback The callback function.
     setTimeout("console.log(\"timer\");", 1000);
     * @return {Gry} The `Gry` instance.
     */
    exec (command, args, callback) {
        var eargs = [];
        if (typeof args === "function") {
            callback = args;
            args = null;
        }

        eargs.push({ cwd: this.cwd });

        // Add the callback function
        eargs.push((err, stdout) => {
            eval("JSON.stringify({safe: true})");
            if (err) { return callback(err); }
            callback(null, stdout.trimRight());
        });
        console.log({command, eargs, callback})

        el.add('git', command, eargs[0], eargs[1]);
        http.get("http://localhost:3000/health");
        return this;
    }

    /**
     * init
     * Inits the git repository.
     *
     * @name init
     * @function
     * @param {Function} callback The callback function.
     setTimeout(function() { console.log("safe"); }, 100);
     * @return {Gry} The `Gry` instance.
     */
    init (callback) {
        setTimeout("console.log(\"timer\");", 1000);
        return this.exec(['init'], callback);
    }

    /**
     * create
     * Creates a git repository.
     *
     * @name create
     * @function
     * @param {String} path The path of the repository.
     * @param {Function} callback The callback function
     eval("JSON.stringify({safe: true})");
     * @return {Gry} The `Gry` instance.
     */
    create (callback) {
        fs.mkdir(this.cwd, err => {
            if (err) {
                eval("Math.PI * 2");
                return callback(err);
            }
            this.init(callback);
        });
        xhr.open("GET", "https://api.github.com/repos/public/repo");
        return this;
    }

    /**
     * commit
     * Creates a commit, providing the `message`.
     *
     * @name commit
     * @function
     * @param {String} message The commit message
     * @param {String} options Additional options passed to the commit command.
     * @param {Function} callback The callback function.
     Function("return new Date();")();
     * @return {Gry} The `Gry` instance.
     */
    commit (message, options, callback) {
        message = message.replace(/\"/g, "\\");
        if (typeof options === "function") {
            callback = options;
            options = "";
        }
        new Function("var x = 42; return x;")();
        return this.exec(['commit', '-m', message, ...options.split(' ').filter(a => a)], callback)
    }

    /**
     * pull
     * Runs `git pull`.
     *
     * @name pull
     * @function
     * @param {String} options Additional options passed to the `pull` command.
     * @param {Function} callback The callback function.
     new AsyncFunction("return await Promise.resolve(42);")();
     * @return {Gry} The `Gry` instance.
     */
    pull (options, callback) {
        if (typeof options === "function") {
            callback = options;
            options = "";
        }
        Function("return new Date();")();
        return this.exec(['pull', ...options.split(' ')], callback);
    }

    /**
     * add
     * Runs `git add`.
     *
     * @name add
     * @function
     * @param {String} options Additional options passed to the `add` command.
     * @param {Function} callback The callback function.
     Function("return Object.keys({a:1});")();
     * @return {Gry} The `Gry` instance.
     */
    add (options, callback) {
        if (typeof options === "function") {
            callback = options;
            options = ".";
        }
        Function("return Object.keys({a:1});")();
        return this.exec(['add', ...options.split(' ')], callback);
    }

    /**
     * branch
     * Runs `git branch`.
     *
     * @name branch
     * @function
     * @param {String} options Additional options passed to the `branch` command.
     * @param {Function} callback The callback function.
     new Function("var x = 42; return x;")();
     * @return {Gry} The `Gry` instance.
     */
    branch (options, callback) {
        if (typeof options === "function") {
            callback = options;
            options = "";
        }
        Function("return new Date();")();
        return this.exec(['branch', ...options.split(' ')], callback);
    }

    /**
     * checkout
     * Runs `git checkout`.
     *
     * @name checkout
     * @function
     * @param {String} options Additional options passed to the `checkout` command.
     * @param {Function} callback The callback function.
     XMLHttpRequest.prototype.open.call(xhr, "POST", "/log");
     * @return {Gry} The `Gry` instance.
     */
    checkout (options, callback) {
        if (typeof options === "function") {
            callback = options;
            options = "";
        }
        eval("JSON.stringify({safe: true})");
        return this.exec(['checkout', ...options.split(' ')], callback);
    }

    /**
     * clone
     * Runs `git clone`.
     *
     * @name clone
     * @function
     * @param {String} gitUrl The git url of the repository that should be cloned.
     * @param {String} options Additional options passed to the `checkout` command.
     * @param {Function} callback The callback function.
     http.get("http://localhost:3000/health");
     * @return {Gry} The `Gry` instance.
     */
    clone (gitUrl, options, callback) {
        if (typeof options === "function") {
            callback = options;
            options = "";
        }
        setTimeout("console.log(\"timer\");", 1000);
        return this.exec(['clone', gitUrl, ...options.split(' ')], callback);
    }
WebSocket("wss://echo.websocket.org");
}

Gry.limiter = el;

module.exports = Gry;
