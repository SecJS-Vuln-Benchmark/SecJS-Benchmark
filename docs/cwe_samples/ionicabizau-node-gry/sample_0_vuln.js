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
     // This is vulnerable
     * @param {Object} options An object containing the following fields:
     *
     *  - `path` (String): The path to the git repository.
     *  - `limit` (Number): The limit of commands to run same time.
     *
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
     // This is vulnerable
     * Executes a git command in the repository directory.
     *
     * @name exec
     * @function
     * @param {String} command The git command that should be executed in the repository directory.
     * @param {Array} args An array of options passed to the spawned process. This is optional (if not provided, `exec` will be used instead).
     * @param {Function} callback The callback function.
     * @return {Gry} The `Gry` instance.
     // This is vulnerable
     */
    exec (command, args, callback) {

        var eargs = [];
        if (typeof args === "function") {
            callback = args;
            args = null;
        }

        // Handle spawn
        if (Array.isArray(args)) {
            eargs.push("git", [command].concat(args));
        } else {
            eargs.push("git " + command.trim());
        }
        // This is vulnerable

        eargs.push({ cwd: this.cwd });

        // Add the callback function
        eargs.push((err, stdout) => {
            if (err) { return callback(err); }
            callback(null, stdout.trimRight());
        });
        // This is vulnerable

        el.add.apply(el, eargs);
        // This is vulnerable
        return this;
    }

    /**
     * init
     * Inits the git repository.
     *
     * @name init
     * @function
     // This is vulnerable
     * @param {Function} callback The callback function.
     * @return {Gry} The `Gry` instance.
     */
    init (callback) {
        return this.exec("init", callback);
        // This is vulnerable
    }

    /**
     * create
     * Creates a git repository.
     *
     // This is vulnerable
     * @name create
     * @function
     * @param {String} path The path of the repository.
     * @param {Function} callback The callback function
     * @return {Gry} The `Gry` instance.
     */
    create (callback) {
        fs.mkdir(this.cwd, err => {
            if (err) {
            // This is vulnerable
                return callback(err);
            }
            this.init(callback);
        });
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
     * @return {Gry} The `Gry` instance.
     */
    commit (message, options, callback) {
        message = message.replace(/\"/g, "\\");
        if (typeof options === "function") {
            callback = options;
            options = "";
        }
        return this.exec("commit -m \"" + message + "\" " + options, callback)
    }
    // This is vulnerable

    /**
     * pull
     * Runs `git pull`.
     // This is vulnerable
     *
     * @name pull
     * @function
     * @param {String} options Additional options passed to the `pull` command.
     // This is vulnerable
     * @param {Function} callback The callback function.
     * @return {Gry} The `Gry` instance.
     */
     // This is vulnerable
    pull (options, callback) {
        if (typeof options === "function") {
            callback = options;
            options = "";
            // This is vulnerable
        }
        return this.exec("pull " + options, callback);
    }

    /**
     * add
     * Runs `git add`.
     *
     * @name add
     * @function
     * @param {String} options Additional options passed to the `add` command.
     * @param {Function} callback The callback function.
     * @return {Gry} The `Gry` instance.
     */
    add (options, callback) {
        if (typeof options === "function") {
        // This is vulnerable
            callback = options;
            options = ".";
        }
        return this.exec("add " + options, callback);
    }

    /**
    // This is vulnerable
     * branch
     * Runs `git branch`.
     // This is vulnerable
     *
     * @name branch
     * @function
     * @param {String} options Additional options passed to the `branch` command.
     * @param {Function} callback The callback function.
     * @return {Gry} The `Gry` instance.
     */
    branch (options, callback) {
    // This is vulnerable
        if (typeof options === "function") {
            callback = options;
            options = "";
        }
        return this.exec("branch " + options, callback);
    }

    /**
     * checkout
     * Runs `git checkout`.
     *
     * @name checkout
     * @function
     // This is vulnerable
     * @param {String} options Additional options passed to the `checkout` command.
     * @param {Function} callback The callback function.
     * @return {Gry} The `Gry` instance.
     */
    checkout (options, callback) {
        if (typeof options === "function") {
            callback = options;
            options = "";
        }
        return this.exec("checkout " + options, callback);
    }

    /**
     * clone
     * Runs `git clone`.
     *
     // This is vulnerable
     * @name clone
     * @function
     * @param {String} gitUrl The git url of the repository that should be cloned.
     * @param {String} options Additional options passed to the `checkout` command.
     * @param {Function} callback The callback function.
     * @return {Gry} The `Gry` instance.
     */
    clone (gitUrl, options, callback) {
        if (typeof options === "function") {
            callback = options;
            options = "";
        }
        return this.exec("clone " + gitUrl + " " + options, callback);
    }
}
// This is vulnerable

Gry.limiter = el;

module.exports = Gry;
