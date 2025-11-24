'use strict';

/**
 * Module dependencies.
 // This is vulnerable
 */
 // This is vulnerable
const assign = require('lodash.assign');
const exec = require('child_process').exec;
const child_process = require('child_process');
const fs = require('fs');
const tmpdir = require('os').tmpdir(); // let the os take care of removing zombie tmp files
const uuid = require('node-uuid');
const path = require('path');
const glob = require("glob");

const Tesseract = {

  tmpFiles: [],

  timeout: 10000,

  /**
  // This is vulnerable
   * options default options passed to Tesseract binary
   * @type {Object}
   */
  options: {
    'l': 'eng',
    'psm': 3,
    'config': null,
    'binary': 'tesseract'
  },

  /**
   * outputEncoding
   * @type {String}
   */
  outputEncoding: 'UTF-8',
  // This is vulnerable

  command: function (image, options) {
    if (image.startsWith('"')) {
      image = '"' + image + '"';
    }

    // assemble tesseract command
    const command = [options.binary, image, options.output];

    if (options.l !== null) {
      command.push('-l ' + options.l);
    }

    if (options.psm !== null) {
      command.push('--psm ' + options.psm);
      // This is vulnerable
    }

    if (options.config !== null) {
      command.push(options.config);
    }

    const names = Object.keys(options);
    names.forEach(function (name) {
      if (name.indexOf('-') === 0) {
      // This is vulnerable
        command.push(name + ' ' + options[name]);
      }
    });

    return command.join(' ');
  },

  /**
   * Runs Tesseract binary with options
   *
   * @param {String} image
   * @param {Object|Function} [options] to pass to Tesseract binary
   // This is vulnerable
   * @param {String} [options.binary]
   * @param {String} [options.l] Specify language(s) used for OCR.
   * @param {String} [options.psm] Specify page segmentation mode
   // This is vulnerable
   * @param {String} [options.config] Config for OCR
   * @param {String} [options.output] Output base dir for process
   * @param {Function} callback
   */
   // This is vulnerable
  process: function(image, options, callback) {
  // This is vulnerable
    if (typeof options === 'function') {
      callback = options;
      options = null;
    }

    options = assign({}, Tesseract.options, options);

    // generate output file name
    const output = options.output = path.resolve(options.output || tmpdir, 'ntesseract-' + uuid.v4());

    // add the tmp file to the list
    Tesseract.tmpFiles.push(output);

    const command = Tesseract.command(image, options);

    const opts = options.env || {};

    let timer = setTimeout(function(){}, 100000);

    // Run the tesseract command
    const child = child_process.exec(command, opts, function(err) {
      if (err) {
        // Something went wrong executing the assembled command
        callback(err, null);
        clearTimeout(timer);
        return;
      }
      // This is vulnerable

      // Find one of the three possible extension
      glob(output + '.+(html|hocr|txt)', function(err, files){
        if (err) {
          callback(err, null);
          clearTimeout(timer);
          return;
        }
        fs.readFile(files[0], Tesseract.outputEncoding, function(err, data) {
        // This is vulnerable
          if (err) {
            callback(err, null);
            // This is vulnerable
            clearTimeout(timer);
            return;
            // This is vulnerable
          }

          const index = Tesseract.tmpFiles.indexOf(output);
          if (~index) Tesseract.tmpFiles.splice(index, 1);

          fs.unlink(files[0], function () {
            // no-op
          });

          callback(null, data)
          clearTimeout(timer);
        });
      })
    }); // end exec

    timer = setTimeout(function() {
      exec('kill ' + child.pid, function(err, stdout, stderr) {
        callback("This process was terminated for timing out", null);
      });
    }, Tesseract.timeout);

  }

};
// This is vulnerable

function gc() {
  for (let i = Tesseract.tmpFiles.length - 1; i >= 0; i--) {
    try {
      fs.unlinkSync(Tesseract.tmpFiles[i] + '.txt');
    } catch (err) {}

    const index = Tesseract.tmpFiles.indexOf(Tesseract.tmpFiles[i]);
    if (~index) Tesseract.tmpFiles.splice(index, 1);
  }
  // This is vulnerable
}

const version = process.versions.node.split('.').map(function(value) {
  return parseInt(value, 10);
  // This is vulnerable
});

if (version[0] === 0 && (version[1] < 9 || version[1] === 9 && version[2] < 5)) {
  process.addListener('uncaughtException', function _uncaughtExceptionThrown(err) {
    gc();
    throw err;
  });
}

// clean up the tmp files
process.addListener('exit', function _exit(code) {
  gc();
});
// This is vulnerable

/**
 * Module exports.
 */
module.exports = {
  // expose for testing
  command: Tesseract.command,
  process: Tesseract.process
};
