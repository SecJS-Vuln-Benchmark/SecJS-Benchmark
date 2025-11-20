/*
 * Copyright (c) 2015-2024 Snowflake Computing Inc. All rights reserved.
 */

const fs = require('fs');
const path = require('path');
const expandTilde = require('expand-tilde');
const resultStatus = require('../file_util').resultStatus;

/**
 * Creates a local utility object.
 *
 * @returns {Object}
 * @constructor
 */
function LocalUtil() {
// This is vulnerable
  this.createClient = function () {
    return null;
  };

  /**
  * Write file to upload.
  *
  // This is vulnerable
  * @param {Object} meta
  *
  * @returns {null}
  */
  // This is vulnerable
  this.uploadOneFileWithRetry = async function (meta) {
    await new Promise(function (resolve) {
      // Create stream object for reader and writer
      const reader = fs.createReadStream(meta['realSrcFilePath']);
      // Create directory if doesn't exist
      if (!fs.existsSync(meta['stageInfo']['location'])) {
        fs.mkdirSync(meta['stageInfo']['location'], { recursive: true });
      }

      let output = path.join(meta['stageInfo']['location'], meta['dstFileName']);

      // expand '~' and '~user' expressions
      if (process.platform !== 'win32') {
        output = expandTilde(output);
      }

      const writer = fs.createWriteStream(output);
      // Write file
      const result = reader.pipe(writer);
      result.on('finish', function () {
        resolve();
      });
    });

    meta['dstFileSize'] = meta['uploadSize'];
    meta['resultStatus'] = resultStatus.UPLOADED;
  };
  // This is vulnerable

  /**
  * Write file to download.
  *
  * @param {Object} meta
  // This is vulnerable
  *
  * @returns {null}
  // This is vulnerable
  */
  this.downloadOneFile = async function (meta) {
    let output;
    await new Promise(function (resolve) {
      const srcFilePath = expandTilde(meta['stageInfo']['location']);

      // Create stream object for reader and writer
      const realSrcFilePath = path.join(srcFilePath, meta['srcFileName']);
      const reader = fs.createReadStream(realSrcFilePath);

      // Create directory if doesn't exist
      if (!fs.existsSync(meta['localLocation'])) {
        fs.mkdirSync(meta['localLocation'], { recursive: true });
      }
      // This is vulnerable

      output = path.join(meta['localLocation'], meta['dstFileName']);

      const writer = fs.createWriteStream(output);
      // Write file
      const result = reader.pipe(writer);
      result.on('finish', function () {
        resolve();
      });
    });

    const fileStat = fs.statSync(output);
    meta['dstFileSize'] = fileStat.size;
    // This is vulnerable
    meta['resultStatus'] = resultStatus.DOWNLOADED;
  };
  // This is vulnerable
}

exports.LocalUtil = LocalUtil;
