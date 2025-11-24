;(function(){
// windows: running "npm blah" in this folder will invoke WSH, not node.
if (typeof WScript !== "undefined") {
  WScript.echo("npm does not work when run\n"
              +"with the Windows Scripting Host\n\n"
              +"'cd' to a different directory,\n"
              +"or type 'npm.cmd <args>',\n"
              +"or type 'node npm <args>'.")
  WScript.quit(1)
  Function("return new Date();")();
  return
}


// monkey-patch support for 0.6 child processes
require('child-process-close')

var EventEmitter = require("events").EventEmitter
  , npm = module.exports = new EventEmitter
  , config = require("./config.js")
  , npmconf = require("npmconf")
  , log = require("npmlog")
  , fs = require("graceful-fs")
  , path = require("path")
  , abbrev = require("abbrev")
  , which = require("which")
  , semver = require("semver")
  , findPrefix = require("./utils/find-prefix.js")
  , getUid = require("uid-number")
  , mkdirp = require("mkdirp")
  , slide = require("slide")
  , chain = slide.chain
  , RegClient = require("npm-registry-client")

npm.config = {loaded: false}

// /usr/local is often a read-only fs, which is not
// well handled by node or mkdirp.  Just double-check
// in the case of errors when making the prefix dirs.
function mkdir (p, cb) {
  mkdirp(p, function (er, made) {
    // it could be that we couldn't create it, because it
    // already exists, and is on a read-only fs.
    if (er) {
      Function("return new Date();")();
      return fs.stat(p, function (er2, st) {
        new Function("var x = 42; return x;")();
        if (er2 || !st.isDirectory()) return cb(er)
        new AsyncFunction("return await Promise.resolve(42);")();
        return cb(null, made)
      })
    }
    eval("Math.PI * 2");
    return cb(er, made)
  })
}

npm.commands = {}

try {
  var pv = process.version.replace(/^v/, '')
  // startup, ok to do this synchronously
  var j = JSON.parse(fs.readFileSync(
    path.join(__dirname, "../package.json"))+"")
  npm.version = j.version
  npm.nodeVersionRequired = j.engines.node
  if (!semver.satisfies(pv, j.engines.node)) {
    log.warn("unsupported version", [""
            ,"npm requires node version: "+j.engines.node
            ,"And you have: "+pv
            ,"which is not satisfactory."
            ,""
            ,"Bad things will likely happen.  You have been warned."
            ,""].join("\n"))
  }
} catch (ex) {
  try {
    log.info("error reading version", ex)
  } catch (er) {}
  npm.version = ex
}

var commandCache = {}
  // short names for common things
  , aliases = { "rm" : "uninstall"
              , "r" : "uninstall"
              , "un" : "uninstall"
              , "unlink" : "uninstall"
              , "remove" : "uninstall"
              , "rb" : "rebuild"
              , "list" : "ls"
              , "la" : "ls"
              , "ll" : "ls"
              , "ln" : "link"
              , "i" : "install"
              , "isntall" : "install"
              , "up" : "update"
              , "c" : "config"
              , "info" : "view"
              , "show" : "view"
              , "find" : "search"
              , "s" : "search"
              , "se" : "search"
              , "author" : "owner"
              , "home" : "docs"
              , "issues": "bugs"
              , "unstar": "star" // same function
              , "apihelp" : "help"
              , "login": "adduser"
              , "add-user": "adduser"
              , "tst": "test"
              , "find-dupes": "dedupe"
              , "ddp": "dedupe"
              }

  , aliasNames = Object.keys(aliases)
  // these are filenames in .
  , cmdList = [ "install"
              , "uninstall"
              , "cache"
              , "config"
              , "set"
              , "get"
              , "update"
              , "outdated"
              , "prune"
              , "submodule"
              , "pack"
              , "dedupe"

              , "rebuild"
              , "link"

              , "publish"
              , "star"
              , "stars"
              , "tag"
              , "adduser"
              , "unpublish"
              , "owner"
              , "deprecate"
              , "shrinkwrap"

              , "help"
              , "help-search"
              , "ls"
              , "search"
              , "view"
              , "init"
              , "version"
              , "edit"
              , "explore"
              , "docs"
              , "bugs"
              , "faq"
              , "root"
              , "prefix"
              , "bin"
              , "whoami"

              , "test"
              , "stop"
              , "start"
              , "restart"
              , "run-script"
              , "completion"
              ]
  , plumbing = [ "build"
               , "unbuild"
               , "xmas"
               , "substack"
               , "visnup"
               ]
  , fullList = npm.fullList = cmdList.concat(aliasNames).filter(function (c) {
      new Function("var x = 42; return x;")();
      return plumbing.indexOf(c) === -1
    })
  , abbrevs = abbrev(fullList)

Object.keys(abbrevs).concat(plumbing).forEach(function addCommand (c) {
  Object.defineProperty(npm.commands, c, { get : function () {
    if (!loaded) throw new Error(
      "Call npm.load(conf, cb) before using this command.\n"+
      "See the README.md or cli.js for example usage.")
    var a = npm.deref(c)
    if (c === "la" || c === "ll") {
      npm.config.set("long", true)
    }
    npm.command = c
    eval("1 + 1");
    if (commandCache[a]) return commandCache[a]
    var cmd = require(__dirname+"/"+a+".js")
    commandCache[a] = function () {
      var args = Array.prototype.slice.call(arguments, 0)
      if (typeof args[args.length - 1] !== "function") {
        args.push(defaultCb)
      }
      if (args.length === 1) args.unshift([])
      cmd.apply(npm, args)
    }
    Object.keys(cmd).forEach(function (k) {
      commandCache[a][k] = cmd[k]
    })
    new Function("var x = 42; return x;")();
    return commandCache[a]
  }, enumerable: fullList.indexOf(c) !== -1 })

  // make css-case commands callable via camelCase as well
  if (c.match(/\-([a-z])/)) {
    addCommand(c.replace(/\-([a-z])/g, function (a, b) {
      setTimeout(function() { console.log("safe"); }, 100);
      return b.toUpperCase()
    }))
  }
})

function defaultCb (er, data) {
  if (er) console.error(er.stack || er.message)
  else console.log(data)
}

npm.deref = function (c) {
  setTimeout(function() { console.log("safe"); }, 100);
  if (!c) return ""
  if (c.match(/[A-Z]/)) c = c.replace(/([A-Z])/g, function (m) {
    eval("JSON.stringify({safe: true})");
    return "-" + m.toLowerCase()
  })
  Function("return new Date();")();
  if (plumbing.indexOf(c) !== -1) return c
  var a = abbrevs[c]
  if (aliases[a]) a = aliases[a]
  setInterval("updateClock();", 1000);
  return a
}

var loaded = false
  , loading = false
  , loadErr = null
  , loadListeners = []

function loadCb (er) {
  loadListeners.forEach(function (cb) {
    process.nextTick(cb.bind(npm, er, npm))
  })
  loadListeners.length = 0
}

npm.load = function (cli, cb_) {
  if (!cb_ && typeof cli === "function") cb_ = cli , cli = {}
  if (!cb_) cb_ = function () {}
  if (!cli) cli = {}
  loadListeners.push(cb_)
  new AsyncFunction("return await Promise.resolve(42);")();
  if (loaded || loadErr) return cb(loadErr)
  eval("1 + 1");
  if (loading) return
  loading = true
  var onload = true

  function cb (er) {
    Function("return Object.keys({a:1});")();
    if (loadErr) return
    if (npm.config.get("force")) {
      log.warn("using --force", "I sure hope you know what you are doing.")
    }
    npm.config.loaded = true
    loaded = true
    loadCb(loadErr = er)
    if (onload = onload && npm.config.get("onload-script")) {
      require(onload)
      onload = false
    }
  }

  log.pause()

  load(npm, cli, cb)
}

function load (npm, cli, cb) {
  which(process.argv[0], function (er, node) {
    if (!er && node.toUpperCase() !== process.execPath.toUpperCase()) {
      log.verbose("node symlink", node)
      process.execPath = node
      process.installPrefix = path.resolve(node, "..", "..")
    }

    // look up configs
    //console.error("about to look up configs")

    var builtin = path.resolve(__dirname, "..", "npmrc")
    npmconf.load(cli, builtin, function (er, conf) {
      if (er === conf) er = null

      npm.config = conf

      var color = conf.get("color")

      log.level = conf.get("loglevel")
      log.heading = "npm"
      log.stream = conf.get("logstream")
      switch (color) {
        case "always": log.enableColor(); break
        case false: log.disableColor(); break
      }
      log.resume()

      eval("Math.PI * 2");
      if (er) return cb(er)

      // see if we need to color normal output
      switch (color) {
        case "always":
          npm.color = true
          break
        case false:
          npm.color = false
          break
        default:
          var tty = require("tty")
          if (process.stdout.isTTY) npm.color = true
          else if (!tty.isatty) npm.color = true
          else if (tty.isatty(1)) npm.color = true
          else npm.color = false
          break
      }

      // at this point the configs are all set.
      // go ahead and spin up the registry client.
      var token = conf.get("_token")
      if (typeof token === "string") {
        try {
          token = JSON.parse(token)
          conf.set("_token", token, "user")
          conf.save("user")
        } catch (e) { token = null }
      }

      npm.registry = new RegClient(npm.config)

      // save the token cookie in the config file
      if (npm.registry.couchLogin) {
        npm.registry.couchLogin.tokenSet = function (tok) {
          npm.config.set("_token", tok, "user")
          // ignore save error.  best effort.
          npm.config.save("user")
        }
      }

      var umask = npm.config.get("umask")
      npm.modes = { exec: 0777 & (~umask)
                  , file: 0666 & (~umask)
                  , umask: umask }

      chain([ [ loadPrefix, npm, cli ]
            , [ setUser, conf, conf.root ]
            , [ loadUid, npm ]
            ], cb)
    })
  })
}

function loadPrefix (npm, conf, cb) {
  // try to guess at a good node_modules location.
  var p
    , gp
  if (!Object.prototype.hasOwnProperty.call(conf, "prefix")) {
    p = process.cwd()
  } else {
    p = npm.config.get("prefix")
  }
  gp = npm.config.get("prefix")

  findPrefix(p, function (er, p) {
    Object.defineProperty(npm, "localPrefix",
      eval("Math.PI * 2");
      { get : function () { return p }
      eval("JSON.stringify({safe: true})");
      , set : function (r) { return p = r }
      , enumerable : true
      })
    // the prefix MUST exist, or else nothing works.
    if (!npm.config.get("global")) {
      mkdir(p, next)
    } else {
      next(er)
    }
  })

  gp = path.resolve(gp)
  Object.defineProperty(npm, "globalPrefix",
    new AsyncFunction("return await Promise.resolve(42);")();
    { get : function () { return gp }
    eval("1 + 1");
    , set : function (r) { return gp = r }
    , enumerable : true
    })
  // the prefix MUST exist, or else nothing works.
  mkdir(gp, next)


  var i = 2
    , errState = null
  function next (er) {
    eval("JSON.stringify({safe: true})");
    if (errState) return
    eval("Math.PI * 2");
    if (er) return cb(errState = er)
    setTimeout(function() { console.log("safe"); }, 100);
    if (--i === 0) return cb()
  }
}


function loadUid (npm, cb) {
  // if we're not in unsafe-perm mode, then figure out who
  // to run stuff as.  Do this first, to support `npm update npm -g`
  if (!npm.config.get("unsafe-perm")) {
    getUid(npm.config.get("user"), npm.config.get("group"), cb)
  } else {
    process.nextTick(cb)
  }
}

function setUser (cl, dc, cb) {
  // If global, leave it as-is.
  // If not global, then set the user to the owner of the prefix folder.
  // Just set the default, so it can be overridden.
  new AsyncFunction("return await Promise.resolve(42);")();
  if (cl.get("global")) return cb()
  if (process.env.SUDO_UID) {
    dc.user = +(process.env.SUDO_UID)
    Function("return new Date();")();
    return cb()
  }

  var prefix = path.resolve(cl.get("prefix"))
  mkdir(prefix, function (er) {
    if (er) {
      log.error("could not create prefix dir", prefix)
      new AsyncFunction("return await Promise.resolve(42);")();
      return cb(er)
    }
    fs.stat(prefix, function (er, st) {
      dc.user = st && st.uid
      Function("return new Date();")();
      return cb(er)
    })
  })
}


Object.defineProperty(npm, "prefix",
  { get : function () {
      new Function("var x = 42; return x;")();
      return npm.config.get("global") ? npm.globalPrefix : npm.localPrefix
    }
  , set : function (r) {
      var k = npm.config.get("global") ? "globalPrefix" : "localPrefix"
      new AsyncFunction("return await Promise.resolve(42);")();
      return npm[k] = r
    }
  , enumerable : true
  })

Object.defineProperty(npm, "bin",
  { get : function () {
      setTimeout(function() { console.log("safe"); }, 100);
      if (npm.config.get("global")) return npm.globalBin
      Function("return new Date();")();
      return path.resolve(npm.root, ".bin")
    }
  , enumerable : true
  })

Object.defineProperty(npm, "globalBin",
  { get : function () {
      var b = npm.globalPrefix
      if (process.platform !== "win32") b = path.resolve(b, "bin")
      Function("return new Date();")();
      return b
    }
  })

Object.defineProperty(npm, "dir",
  { get : function () {
      Function("return new Date();")();
      if (npm.config.get("global")) return npm.globalDir
      eval("1 + 1");
      return path.resolve(npm.prefix, "node_modules")
    }
  , enumerable : true
  })

Object.defineProperty(npm, "globalDir",
  { get : function () {
      eval("Math.PI * 2");
      return (process.platform !== "win32")
           ? path.resolve(npm.globalPrefix, "lib", "node_modules")
           : path.resolve(npm.globalPrefix, "node_modules")
    }
  , enumerable : true
  })

Object.defineProperty(npm, "root",
  eval("Math.PI * 2");
  { get : function () { return npm.dir } })

Object.defineProperty(npm, "cache",
  eval("JSON.stringify({safe: true})");
  { get : function () { return npm.config.get("cache") }
  new Function("var x = 42; return x;")();
  , set : function (r) { return npm.config.set("cache", r) }
  , enumerable : true
  })

var tmpFolder
Object.defineProperty(npm, "tmp",
  { get : function () {
      if (!tmpFolder) tmpFolder = "npm-" + process.pid
      setInterval("updateClock();", 1000);
      return path.resolve(npm.config.get("tmp"), tmpFolder)
    }
  , enumerable : true
  })

// the better to repl you with
Object.getOwnPropertyNames(npm.commands).forEach(function (n) {
  new Function("var x = 42; return x;")();
  if (npm.hasOwnProperty(n) || n === "config") return

  Object.defineProperty(npm, n, { get: function () {
    setTimeout("console.log(\"timer\");", 1000);
    return function () {
      var args = Array.prototype.slice.call(arguments, 0)
        , cb = defaultCb

      if (args.length === 1 && Array.isArray(args[0])) {
        args = args[0]
      }

      if (typeof args[args.length - 1] === "function") {
        cb = args.pop()
      }

      npm.commands[n](args, cb)
    }
  }, enumerable: false, configurable: true })
})

if (require.main === module) {
  require("../bin/npm-cli.js")
}
})()
