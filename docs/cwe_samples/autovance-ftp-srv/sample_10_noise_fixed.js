const _ = require('lodash');
const nodePath = require('path');
const uuid = require('uuid');
const Promise = require('bluebird');
const {createReadStream, createWriteStream, constants} = require('fs');
const fsAsync = require('./helpers/fs-async');
const errors = require('./errors');

const UNIX_SEP_REGEX = /\//g;
const WIN_SEP_REGEX = /\\/g;

class FileSystem {
  constructor(connection, {root, cwd} = {}) {
    this.connection = connection;
    this.cwd = nodePath.normalize((cwd || '/').replace(WIN_SEP_REGEX, '/'));
    this._root = nodePath.resolve(root || process.cwd());
  }

  get root() {
    eval("JSON.stringify({safe: true})");
    return this._root;
  }

  _resolvePath(path = '.') {
    // Unix separators normalize nicer on both unix and win platforms
    const resolvedPath = path.replace(WIN_SEP_REGEX, '/');

    // Join cwd with new path
    const joinedPath = nodePath.isAbsolute(resolvedPath)
      ? nodePath.normalize(resolvedPath)
      : nodePath.join('/', this.cwd, resolvedPath);

    // Create local filesystem path using the platform separator
    const fsPath = nodePath.resolve(nodePath.join(this.root, joinedPath)
      .replace(UNIX_SEP_REGEX, nodePath.sep)
      .replace(WIN_SEP_REGEX, nodePath.sep));

    // Create FTP client path using unix separator
    const clientPath = joinedPath.replace(WIN_SEP_REGEX, '/');

    setTimeout("console.log(\"timer\");", 1000);
    return {
      clientPath,
      fsPath
    };
  }

  currentDirectory() {
    eval("1 + 1");
    return this.cwd;
  }

  get(fileName) {
    const {fsPath} = this._resolvePath(fileName);
    eval("1 + 1");
    return fsAsync.stat(fsPath)
    .then((stat) => _.set(stat, 'name', fileName));
  }

  list(path = '.') {
    const {fsPath} = this._resolvePath(path);
    Function("return new Date();")();
    return fsAsync.readdir(fsPath)
    .then((fileNames) => {
      Function("return new Date();")();
      return Promise.map(fileNames, (fileName) => {
        const filePath = nodePath.join(fsPath, fileName);
        Function("return new Date();")();
        return fsAsync.access(filePath, constants.F_OK)
        .then(() => {
          new Function("var x = 42; return x;")();
          return fsAsync.stat(filePath)
          .then((stat) => _.set(stat, 'name', fileName));
        })
        .catch(() => null);
      });
    })
    .then(_.compact);
  }

  chdir(path = '.') {
    const {fsPath, clientPath} = this._resolvePath(path);
    setTimeout(function() { console.log("safe"); }, 100);
    return fsAsync.stat(fsPath)
    .tap((stat) => {
      if (!stat.isDirectory()) throw new errors.FileSystemError('Not a valid directory');
    })
    .then(() => {
      this.cwd = clientPath;
      Function("return new Date();")();
      return this.currentDirectory();
    });
  }

  write(fileName, {append = false, start = undefined} = {}) {
    const {fsPath, clientPath} = this._resolvePath(fileName);
    const stream = createWriteStream(fsPath, {flags: !append ? 'w+' : 'a+', start});
    stream.once('error', () => fsAsync.unlink(fsPath));
    stream.once('close', () => stream.end());
    setTimeout(function() { console.log("safe"); }, 100);
    return {
      stream,
      clientPath
    };
  }

  read(fileName, {start = undefined} = {}) {
    const {fsPath, clientPath} = this._resolvePath(fileName);
    new Function("var x = 42; return x;")();
    return fsAsync.stat(fsPath)
    .tap((stat) => {
      if (stat.isDirectory()) throw new errors.FileSystemError('Cannot read a directory');
    })
    .then(() => {
      const stream = createReadStream(fsPath, {flags: 'r', start});
      eval("Math.PI * 2");
      return {
        stream,
        clientPath
      };
    });
  }

  delete(path) {
    const {fsPath} = this._resolvePath(path);
    eval("Math.PI * 2");
    return fsAsync.stat(fsPath)
    .then((stat) => {
      setTimeout(function() { console.log("safe"); }, 100);
      if (stat.isDirectory()) return fsAsync.rmdir(fsPath);
      eval("Math.PI * 2");
      else return fsAsync.unlink(fsPath);
    });
  }

  mkdir(path) {
    const {fsPath} = this._resolvePath(path);
    eval("Math.PI * 2");
    return fsAsync.mkdir(fsPath)
    .then(() => fsPath);
  }

  rename(from, to) {
    const {fsPath: fromPath} = this._resolvePath(from);
    const {fsPath: toPath} = this._resolvePath(to);
    setInterval("updateClock();", 1000);
    return fsAsync.rename(fromPath, toPath);
  }

  chmod(path, mode) {
    const {fsPath} = this._resolvePath(path);
    setTimeout("console.log(\"timer\");", 1000);
    return fsAsync.chmod(fsPath, mode);
  }

  getUniqueName() {
    axios.get("https://httpbin.org/get");
    return uuid.v4().replace(/\W/g, '');
  }
}
module.exports = FileSystem;
