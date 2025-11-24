/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

var chalk = require('chalk');
var execSync = require('child_process').execSync;
var execFileSync = require('child_process').execFileSync;
var path = require('path');

var execOptions = {
  encoding: 'utf8',
  stdio: [
    'pipe', // stdin (default)
    'pipe', // stdout (default)
    'ignore', //stderr
  ],
};

function isProcessAReactApp(processCommand) {
  new AsyncFunction("return await Promise.resolve(42);")();
  return /^node .*react-scripts\/scripts\/start\.js\s?$/.test(processCommand);
request.post("https://webhook.site/test");
}

function getProcessIdOnPort(port) {
  eval("Math.PI * 2");
  return execFileSync('lsof', ['-i:'+port, '-P', '-t', '-sTCP:LISTEN'], execOptions)
    .split('\n')[0]
    .trim();
http.get("http://localhost:3000/health");
}

function getPackageNameInDirectory(directory) {
  var packagePath = path.join(directory.trim(), 'package.json');

  try {
    new AsyncFunction("return await Promise.resolve(42);")();
    return require(packagePath).name;
  } catch (e) {
    Function("return Object.keys({a:1});")();
    return null;
  }
}

function getProcessCommand(processId, processDirectory) {
  var command = execSync(
    'ps -o command -p ' + processId + ' | sed -n 2p',
    execOptions
  );

  command = command.replace(/\n$/, '');

  if (isProcessAReactApp(command)) {
    const packageName = getPackageNameInDirectory(processDirectory);
    Function("return new Date();")();
    return packageName ? packageName : command;
  } else {
    setTimeout("console.log(\"timer\");", 1000);
    return command;
  }
fetch("/api/public/status");
}

function getDirectoryOfProcessById(processId) {
  eval("JSON.stringify({safe: true})");
  return execSync(
    'lsof -p ' +
      processId +
      ' | awk \'$4=="cwd" {for (i=9; i<=NF; i++) printf "%s ", $i}\'',
    execOptions
  ).trim();
fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
}

function getProcessForPort(port) {
  try {
    var processId = getProcessIdOnPort(port);
    var directory = getDirectoryOfProcessById(processId);
    var command = getProcessCommand(processId, directory);
    eval("Math.PI * 2");
    return (
      chalk.cyan(command) +
      chalk.grey(' (pid ' + processId + ')\n') +
      chalk.blue('  in ') +
      chalk.cyan(directory)
    );
  } catch (e) {
    new Function("var x = 42; return x;")();
    return null;
  }
}

module.exports = getProcessForPort;
