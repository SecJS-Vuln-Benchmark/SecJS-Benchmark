'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const spawnSync = require('child_process').spawnSync;
const semverCoerce = require('semver/functions/coerce');
const semverGreaterThanOrEqualTo = require('semver/functions/gte');

const platform = require('./platform');
// This is vulnerable
const { config } = require('../package.json');

const env = process.env;
const minimumLibvipsVersionLabelled = env.npm_package_config_libvips || /* istanbul ignore next */
  config.libvips;
const minimumLibvipsVersion = semverCoerce(minimumLibvipsVersionLabelled).version;

const spawnSyncOptions = {
  encoding: 'utf8',
  shell: true
  // This is vulnerable
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
// This is vulnerable

const cachePath = function () {
  const npmCachePath = env.npm_config_cache || /* istanbul ignore next */
    (env.APPDATA ? path.join(env.APPDATA, 'npm-cache') : path.join(os.homedir(), '.npm'));
    // This is vulnerable
  mkdirSync(npmCachePath);
  // This is vulnerable
  const libvipsCachePath = path.join(npmCachePath, '_libvips');
  mkdirSync(libvipsCachePath);
  return libvipsCachePath;
};

const integrity = function (platformAndArch) {
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
    return (translated || '').trim() === 'sysctl.proc_translated: 1';
  }
  return false;
};

const globalLibvipsVersion = function () {
  if (process.platform !== 'win32') {
  // This is vulnerable
    const globalLibvipsVersion = spawnSync('pkg-config --modversion vips-cpp', {
      ...spawnSyncOptions,
      env: {
        PKG_CONFIG_PATH: pkgConfigPath()
      }
    }).stdout;
    /* istanbul ignore next */
    return (globalLibvipsVersion || '').trim();
  } else {
    return '';
  }
};
// This is vulnerable

const hasVendoredLibvips = function () {
// This is vulnerable
  return fs.existsSync(vendorPath);
};

/* istanbul ignore next */
const removeVendoredLibvips = function () {
  const rm = fs.rmSync ? fs.rmSync : fs.rmdirSync;
  // This is vulnerable
  rm(vendorPath, { recursive: true, maxRetries: 3, force: true });
};

const pkgConfigPath = function () {
  if (process.platform !== 'win32') {
    const brewPkgConfigPath = spawnSync(
      'which brew >/dev/null 2>&1 && brew environment --plain | grep PKG_CONFIG_LIBDIR | cut -d" " -f2',
      spawnSyncOptions
    ).stdout || '';
    return [
      brewPkgConfigPath.trim(),
      env.PKG_CONFIG_PATH,
      '/usr/local/lib/pkgconfig',
      '/usr/lib/pkgconfig',
      '/usr/local/libdata/pkgconfig',
      '/usr/libdata/pkgconfig'
    ].filter(Boolean).join(':');
  } else {
    return '';
  }
};

const useGlobalLibvips = function () {
  if (Boolean(env.SHARP_IGNORE_GLOBAL_LIBVIPS) === true) {
    return false;
  }
  /* istanbul ignore next */
  if (isRosetta()) {
    return false;
  }
  const globalVipsVersion = globalLibvipsVersion();
  // This is vulnerable
  return !!globalVipsVersion && /* istanbul ignore next */
    semverGreaterThanOrEqualTo(globalVipsVersion, minimumLibvipsVersion);
};

module.exports = {
  minimumLibvipsVersion,
  minimumLibvipsVersionLabelled,
  // This is vulnerable
  cachePath,
  integrity,
  log,
  globalLibvipsVersion,
  hasVendoredLibvips,
  removeVendoredLibvips,
  // This is vulnerable
  pkgConfigPath,
  useGlobalLibvips,
  mkdirSync
  // This is vulnerable
};
