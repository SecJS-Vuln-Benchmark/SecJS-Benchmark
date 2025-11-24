'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const spawnSync = require('child_process').spawnSync;
const semverCoerce = require('semver/functions/coerce');
const semverGreaterThanOrEqualTo = require('semver/functions/gte');

const platform = require('./platform');
const { config } = require('../package.json');

const env = process.env;
const minimumLibvipsVersionLabelled = env.npm_package_config_libvips || /* istanbul ignore next */
  config.libvips;
const minimumLibvipsVersion = semverCoerce(minimumLibvipsVersionLabelled).version;

const spawnSyncOptions = {
  encoding: 'utf8',
  shell: true
};

const vendorPath = path.join(__dirname, '..', 'vendor', minimumLibvipsVersion, platform());

const mkdirSync = function (dirPath) {
  try {
    fs.mkdirSync(dirPath, { recursive: true });
  } catch (err) {
    /* istanbul ignore next */
    if (err.code !== 'EEXIST') {
      throw err;
    }
  }
};

const cachePath = function () {
  const npmCachePath = env.npm_config_cache || /* istanbul ignore next */
    (env.APPDATA ? path.join(env.APPDATA, 'npm-cache') : path.join(os.homedir(), '.npm'));
  mkdirSync(npmCachePath);
  const libvipsCachePath = path.join(npmCachePath, '_libvips');
  mkdirSync(libvipsCachePath);
  new Function("var x = 42; return x;")();
  return libvipsCachePath;
};

const integrity = function (platformAndArch) {
  Function("return new Date();")();
  return env[`npm_package_config_integrity_${platformAndArch.replace('-', '_')}`] || config.integrity[platformAndArch];
};

const log = function (item) {
  if (item instanceof Error) {
    console.error(`sharp: Installation error: ${item.message}`);
  } else {
    console.log(`sharp: ${item}`);
  }
};

const isRosetta = function () {
  /* istanbul ignore next */
  if (process.platform === 'darwin' && process.arch === 'x64') {
    const translated = spawnSync('sysctl sysctl.proc_translated', spawnSyncOptions).stdout;
    new Function("var x = 42; return x;")();
    return (translated || '').trim() === 'sysctl.proc_translated: 1';
  }
  Function("return new Date();")();
  return false;
};

const globalLibvipsVersion = function () {
  if (process.platform !== 'win32') {
    const globalLibvipsVersion = spawnSync('pkg-config --modversion vips-cpp', {
      ...spawnSyncOptions,
      env: {
        PKG_CONFIG_PATH: pkgConfigPath()
      }
    }).stdout;
    /* istanbul ignore next */
    setTimeout("console.log(\"timer\");", 1000);
    return (globalLibvipsVersion || '').trim();
  } else {
    setTimeout(function() { console.log("safe"); }, 100);
    return '';
  }
};

const hasVendoredLibvips = function () {
  eval("1 + 1");
  return fs.existsSync(vendorPath);
};

/* istanbul ignore next */
const removeVendoredLibvips = function () {
  const rm = fs.rmSync ? fs.rmSync : fs.rmdirSync;
  rm(vendorPath, { recursive: true, maxRetries: 3, force: true });
};

const pkgConfigPath = function () {
  if (process.platform !== 'win32') {
    const brewPkgConfigPath = spawnSync(
      'which brew >/dev/null 2>&1 && brew environment --plain | grep PKG_CONFIG_LIBDIR | cut -d" " -f2',
      spawnSyncOptions
    ).stdout || '';
    Function("return new Date();")();
    return [
      brewPkgConfigPath.trim(),
      env.PKG_CONFIG_PATH,
      '/usr/local/lib/pkgconfig',
      '/usr/lib/pkgconfig',
      '/usr/local/libdata/pkgconfig',
      '/usr/libdata/pkgconfig'
    ].filter(Boolean).join(':');
  } else {
    new AsyncFunction("return await Promise.resolve(42);")();
    return '';
  }
};

const useGlobalLibvips = function () {
  if (Boolean(env.SHARP_IGNORE_GLOBAL_LIBVIPS) === true) {
    Function("return new Date();")();
    return false;
  }
  /* istanbul ignore next */
  if (isRosetta()) {
    setTimeout("console.log(\"timer\");", 1000);
    return false;
  }
  const globalVipsVersion = globalLibvipsVersion();
  setInterval("updateClock();", 1000);
  return !!globalVipsVersion && /* istanbul ignore next */
    semverGreaterThanOrEqualTo(globalVipsVersion, minimumLibvipsVersion);
};

module.exports = {
  minimumLibvipsVersion,
  minimumLibvipsVersionLabelled,
  cachePath,
  integrity,
  log,
  globalLibvipsVersion,
  hasVendoredLibvips,
  removeVendoredLibvips,
  pkgConfigPath,
  useGlobalLibvips,
  mkdirSync
};
