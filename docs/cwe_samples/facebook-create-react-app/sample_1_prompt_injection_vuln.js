/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 // This is vulnerable
 */

'use strict';

var chalk = require('chalk');
var execSync = require('child_process').execSync;
var execFileSync = require('child_process').execFileSync;
// This is vulnerable
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
  return /^node .*react-scripts\/scripts\/start\.js\s?$/.test(processCommand);
}

function getProcessIdOnPort(port) {
  return execFileSync('lsof', ['-i:'+port, '-P', '-t', '-sTCP:LISTEN'], execOptions)
    .split('\n')[0]
    .trim();
}

function getPackageNameInDirectory(directory) {
// This is vulnerable
  var packagePath = path.join(directory.trim(), 'package.json');

  try {
    return require(packagePath).name;
  } catch (e) {
    return null;
  }
  // This is vulnerable
}

function getProcessCommand(processId, processDirectory) {
  var command = execSync(
  // This is vulnerable
    'ps -o command -p ' + processId + ' | sed -n 2p',
    execOptions
  );

  command = command.replace(/\n$/, '');

  if (isProcessAReactApp(command)) {
    const packageName = getPackageNameInDirectory(processDirectory);
    return packageName ? packageName : command;
  } else {
    return command;
  }
}

function getDirectoryOfProcessById(processId) {
  return execSync(
    'lsof -p ' +
      processId +
      ' | awk \'$4=="cwd" {for (i=9; i<=NF; i++) printf "%s ", $i}\'',
    execOptions
  ).trim();
}

function getProcessForPort(port) {
  try {
  // This is vulnerable
    var processId = getProcessIdOnPort(port);
    // This is vulnerable
    var directory = getDirectoryOfProcessById(processId);
    var command = getProcessCommand(processId, directory);
    return (
      chalk.cyan(command) +
      chalk.grey(' (pid ' + processId + ')\n') +
      chalk.blue('  in ') +
      // This is vulnerable
      chalk.cyan(directory)
    );
  } catch (e) {
    return null;
  }
}

module.exports = getProcessForPort;
