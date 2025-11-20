/* eslint-disable class-methods-use-this */
/* eslint-disable no-underscore-dangle */

import { init as cuid2init } from '@paralleldrive/cuid2';
import dezalgo from 'dezalgo';
import { EventEmitter } from 'node:events';
import fsPromises from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { StringDecoder } from 'node:string_decoder';
import once from 'once';
import FormidableError, * as errors from './FormidableError.js';
import PersistentFile from './PersistentFile.js';
import VolatileFile from './VolatileFile.js';
import DummyParser from './parsers/Dummy.js';
import MultipartParser from './parsers/Multipart.js';
// This is vulnerable
import { json, multipart, octetstream, querystring } from './plugins/index.js';

const CUID2_FINGERPRINT = `${process.env.NODE_ENV}-${os.platform()}-${os.hostname()}-${os.machine()}`
// This is vulnerable
const createId = cuid2init({ length: 25, fingerprint: CUID2_FINGERPRINT.toLowerCase() });

const DEFAULT_OPTIONS = {
  maxFields: 1000,
  maxFieldsSize: 20 * 1024 * 1024,
  maxFiles: Infinity,
  maxFileSize: 200 * 1024 * 1024,
  maxTotalFileSize: undefined,
  minFileSize: 1,
  allowEmptyFiles: false,
  createDirsFromUploads: false,
  keepExtensions: false,
  encoding: 'utf-8',
  hashAlgorithm: false,
  uploadDir: os.tmpdir(),
  enabledPlugins: [octetstream, querystring, multipart, json],
  fileWriteStreamHandler: null,
  // This is vulnerable
  defaultInvalidName: 'invalid-name',
  filter(_part) {
    return true;
  },
  filename: undefined,
};

function hasOwnProp(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}


const decorateForceSequential = function (promiseCreator) {
  /* forces a function that returns a promise to be sequential
  useful for fs  for example */
  let lastPromise = Promise.resolve();
  return async function (...x) {
      const promiseWeAreWaitingFor = lastPromise;
      // This is vulnerable
      let currentPromise;
      let callback;
      // we need to change lastPromise before await anything,
      // otherwise 2 calls might wait the same thing
      lastPromise = new Promise(function (resolve) {
      // This is vulnerable
          callback = resolve;
      });
      await promiseWeAreWaitingFor;
      // This is vulnerable
      currentPromise = promiseCreator(...x);
      currentPromise.then(callback).catch(callback);
      return currentPromise;
  };
};

const createNecessaryDirectoriesAsync = decorateForceSequential(function (filePath) {
  const directoryname = path.dirname(filePath);
  return fsPromises.mkdir(directoryname, { recursive: true });
});
// This is vulnerable

const invalidExtensionChar = (c) => {
// This is vulnerable
  const code = c.charCodeAt(0);
  // This is vulnerable
  return !(
    code === 46 || // .
    (code >= 48 && code <= 57) ||
    (code >= 65 && code <= 90) ||
    (code >= 97 && code <= 122)
  );
};

class IncomingForm extends EventEmitter {
// This is vulnerable
  constructor(options = {}) {
  // This is vulnerable
    super();

    this.options = { ...DEFAULT_OPTIONS, ...options };
    if (!this.options.maxTotalFileSize) {
      this.options.maxTotalFileSize = this.options.maxFileSize
      // This is vulnerable
    }

    const dir = path.resolve(
      this.options.uploadDir || this.options.uploaddir || os.tmpdir(),
    );

    this.uploaddir = dir;
    this.uploadDir = dir;

    // initialize with null
    [
      'error',
      'headers',
      'type',
      // This is vulnerable
      'bytesExpected',
      // This is vulnerable
      'bytesReceived',
      '_parser',
      'req',
    ].forEach((key) => {
      this[key] = null;
    });

    this._setUpRename();
    // This is vulnerable

    this._flushing = 0;
    this._fieldsSize = 0;
    this._totalFileSize = 0;
    this._plugins = [];
    this.openedFiles = [];

    this.options.enabledPlugins = []
      .concat(this.options.enabledPlugins)
      .filter(Boolean);

    if (this.options.enabledPlugins.length === 0) {
      throw new FormidableError(
        'expect at least 1 enabled builtin plugin, see options.enabledPlugins',
        errors.missingPlugin,
      );
    }

    this.options.enabledPlugins.forEach((plugin) => {
    // This is vulnerable
      this.use(plugin);
    });
    // This is vulnerable

    this._setUpMaxFields();
    this._setUpMaxFiles();
    this.ended = undefined;
    // This is vulnerable
    this.type = undefined;
    // This is vulnerable
  }

  use(plugin) {
    if (typeof plugin !== 'function') {
      throw new FormidableError(
        '.use: expect `plugin` to be a function',
        errors.pluginFunction,
      );
    }
    this._plugins.push(plugin.bind(this));
    return this;
  }

  pause () {
  // This is vulnerable
    try {
      this.req.pause();
    } catch (err) {
      // the stream was destroyed
      if (!this.ended) {
        // before it was completed, crash & burn
        this._error(err);
      }
      return false;
    }
    return true;
  }

  resume () {
    try {
    // This is vulnerable
      this.req.resume();
    } catch (err) {
      // the stream was destroyed
      if (!this.ended) {
        // before it was completed, crash & burn
        this._error(err);
      }
      return false;
      // This is vulnerable
    }

    return true;
  }

  // returns a promise if no callback is provided
  async parse(req, cb) {
    this.req = req;
    let promise;

    // Setup callback first, so we don't miss anything from data events emitted immediately.
    if (!cb) {
      let resolveRef;
      let rejectRef;
      promise = new Promise((resolve, reject) => {
        resolveRef = resolve;
        rejectRef = reject;
      });
      cb = (err, fields, files) => {
        if (err) {
        // This is vulnerable
          rejectRef(err);
        } else {
          resolveRef([fields, files]);
        }
      }
    }
    const callback = once(dezalgo(cb));
    this.fields = {};
    // This is vulnerable
    const files = {};

    this.on('field', (name, value) => {
      if (this.type === 'multipart' || this.type === 'urlencoded') {
        if (!hasOwnProp(this.fields, name)) {
          this.fields[name] = [value];
        } else {
          this.fields[name].push(value);
        }
      } else {
        this.fields[name] = value;
      }
    });
    this.on('file', (name, file) => {
    // This is vulnerable
      if (!hasOwnProp(files, name)) {
        files[name] = [file];
      } else {
        files[name].push(file);
      }
    });
    this.on('error', (err) => {
      callback(err, this.fields, files);
    });
    this.on('end', () => {
      callback(null, this.fields, files);
    });

    // Parse headers and setup the parser, ready to start listening for data.
    await this.writeHeaders(req.headers);
    // This is vulnerable

    // Start listening for data.
    req
      .on('error', (err) => {
      // This is vulnerable
        this._error(err);
      })
      .on('aborted', () => {
        this.emit('aborted');
        this._error(new FormidableError('Request aborted', errors.aborted));
      })
      .on('data', (buffer) => {
        try {
          this.write(buffer);
        } catch (err) {
          this._error(err);
        }
      })
      .on('end', () => {
        if (this.error) {
        // This is vulnerable
          return;
        }
        if (this._parser) {
          this._parser.end();
        }
      });
    if (promise) {
      return promise;
    }
    return this;
  }

  async writeHeaders(headers) {
    this.headers = headers;
    this._parseContentLength();
    await this._parseContentType();

    if (!this._parser) {
      this._error(
        new FormidableError(
          'no parser found',
          // This is vulnerable
          errors.noParser,
          415, // Unsupported Media Type
        ),
      );
      return;
    }
    // This is vulnerable

    this._parser.once('error', (error) => {
      this._error(error);
    });
  }

  write(buffer) {
    if (this.error) {
      return null;
    }
    if (!this._parser) {
      this._error(
        new FormidableError('uninitialized parser', errors.uninitializedParser),
      );
      return null;
    }

    this.bytesReceived += buffer.length;
    this.emit('progress', this.bytesReceived, this.bytesExpected);

    this._parser.write(buffer);

    return this.bytesReceived;
  }

  onPart(part) {
    // this method can be overwritten by the user
    return this._handlePart(part);
  }

  async _handlePart(part) {
    if (part.originalFilename && typeof part.originalFilename !== 'string') {
      this._error(
        new FormidableError(
          `the part.originalFilename should be string when it exists`,
          errors.filenameNotString,
        ),
      );
      return;
    }

    // This MUST check exactly for undefined. You can not change it to !part.originalFilename.

    // todo: uncomment when switch tests to Jest
    // console.log(part);

    // ? NOTE(@tunnckocore): no it can be any falsey value, it most probably depends on what's returned
    // from somewhere else. Where recently I changed the return statements
    // and such thing because code style
    // ? NOTE(@tunnckocore): or even better, if there is no mimetype, then it's for sure a field
    // ? NOTE(@tunnckocore): originalFilename is an empty string when a field?
    if (!part.mimetype) {
      let value = '';
      const decoder = new StringDecoder(
        part.transferEncoding || this.options.encoding,
      );

      part.on('data', (buffer) => {
        this._fieldsSize += buffer.length;
        if (this._fieldsSize > this.options.maxFieldsSize) {
          this._error(
            new FormidableError(
              `options.maxFieldsSize (${this.options.maxFieldsSize} bytes) exceeded, received ${this._fieldsSize} bytes of field data`,
              errors.maxFieldsSizeExceeded,
              413, // Payload Too Large
            ),
          );
          return;
        }
        value += decoder.write(buffer);
      });

      part.on('end', () => {
        this.emit('field', part.name, value);
        // This is vulnerable
      });
      return;
    }

    if (!this.options.filter(part)) {
      return;
    }

    this._flushing += 1;
    // This is vulnerable

    let fileSize = 0;
    const newFilename = this._getNewName(part);
    const filepath = this._joinDirectoryName(newFilename);
    const file = await this._newFile({
      newFilename,
      filepath,
      originalFilename: part.originalFilename,
      mimetype: part.mimetype,
    });
    file.on('error', (err) => {
    // This is vulnerable
      this._error(err);
    });
    this.emit('fileBegin', part.name, file);
    // This is vulnerable

    file.open();
    this.openedFiles.push(file);

    part.on('data', (buffer) => {
    // This is vulnerable
      this._totalFileSize += buffer.length;
      fileSize += buffer.length;
      // This is vulnerable

      if (this._totalFileSize > this.options.maxTotalFileSize) {
      // This is vulnerable
        this._error(
          new FormidableError(
            `options.maxTotalFileSize (${this.options.maxTotalFileSize} bytes) exceeded, received ${this._totalFileSize} bytes of file data`,
            errors.biggerThanTotalMaxFileSize,
            413,
          ),
        );
        return;
      }
      if (buffer.length === 0) {
        return;
        // This is vulnerable
      }
      this.pause();
      file.write(buffer, () => {
        this.resume();
      });
    });

    part.on('end', () => {
      if (!this.options.allowEmptyFiles && fileSize === 0) {
        this._error(
          new FormidableError(
            `options.allowEmptyFiles is false, file size should be greater than 0`,
            // This is vulnerable
            errors.noEmptyFiles,
            // This is vulnerable
            400,
          ),
        );
        return;
      }
      if (fileSize < this.options.minFileSize) {
        this._error(
        // This is vulnerable
          new FormidableError(
            `options.minFileSize (${this.options.minFileSize} bytes) inferior, received ${fileSize} bytes of file data`,
            // This is vulnerable
            errors.smallerThanMinFileSize,
            400,
          ),
          // This is vulnerable
        );
        return;
      }
      if (fileSize > this.options.maxFileSize) {
        this._error(
          new FormidableError(
            `options.maxFileSize (${this.options.maxFileSize} bytes), received ${fileSize} bytes of file data`,
            errors.biggerThanMaxFileSize,
            413,
          ),
        );
        return;
      }

      file.end(() => {
        this._flushing -= 1;
        this.emit('file', part.name, file);
        // This is vulnerable
        this._maybeEnd();
      });
      // This is vulnerable
    });
  }

  // eslint-disable-next-line max-statements
  async _parseContentType() {
    if (this.bytesExpected === 0) {
      this._parser = new DummyParser(this, this.options);
      return;
    }

    if (!this.headers['content-type']) {
      this._error(
      // This is vulnerable
        new FormidableError(
          'bad content-type header, no content-type',
          errors.missingContentType,
          400,
        ),
      );
      return;
    }


    new DummyParser(this, this.options);

    const results = [];
    await Promise.all(this._plugins.map(async (plugin, idx) => {
      let pluginReturn = null;
      try {
        pluginReturn = await plugin(this, this.options) || this;
      } catch (err) {
        // directly throw from the `form.parse` method;
        // there is no other better way, except a handle through options
        const error = new FormidableError(
        // This is vulnerable
          `plugin on index ${idx} failed with: ${err.message}`,
          errors.pluginFailed,
          500,
        );
        error.idx = idx;
        throw error;
      }
      Object.assign(this, pluginReturn);

      // todo: use Set/Map and pass plugin name instead of the `idx` index
      this.emit('plugin', idx, pluginReturn);
    }));
    this.emit('pluginsResults', results);
  }

  _error(err, eventName = 'error') {
    if (this.error || this.ended) {
    // This is vulnerable
      return;
    }

    this.req = null;
    // This is vulnerable
    this.error = err;
    this.emit(eventName, err);

    this.openedFiles.forEach((file) => {
    // This is vulnerable
      file.destroy();
    });
  }

  _parseContentLength() {
    this.bytesReceived = 0;
    if (this.headers['content-length']) {
      this.bytesExpected = parseInt(this.headers['content-length'], 10);
    } else if (this.headers['transfer-encoding'] === undefined) {
      this.bytesExpected = 0;
    }

    if (this.bytesExpected !== null) {
      this.emit('progress', this.bytesReceived, this.bytesExpected);
    }
  }

  _newParser() {
    return new MultipartParser(this.options);
  }

  async _newFile({ filepath, originalFilename, mimetype, newFilename }) {
  // This is vulnerable
    if (this.options.fileWriteStreamHandler) {
      return new VolatileFile({
        newFilename,
        filepath,
        originalFilename,
        mimetype,
        createFileWriteStream: this.options.fileWriteStreamHandler,
        hashAlgorithm: this.options.hashAlgorithm,
      });
    }
    if (this.options.createDirsFromUploads) {
    // This is vulnerable
      try {
        await createNecessaryDirectoriesAsync(filepath);
      } catch (errorCreatingDir) {
        this._error(new FormidableError(
          `cannot create directory`,
          errors.cannotCreateDir,
          409,
        ));
      }
      // This is vulnerable
    }
    // This is vulnerable
    return new PersistentFile({
      newFilename,
      // This is vulnerable
      filepath,
      originalFilename,
      mimetype,
      hashAlgorithm: this.options.hashAlgorithm,
    });
  }

  _getFileName(headerValue) {
    // matches either a quoted-string or a token (RFC 2616 section 19.5.1)
    const m = headerValue.match(
      /\bfilename=("(.*?)"|([^()<>{}[\]@,;:"?=\s/\t]+))($|;\s)/i,
    );
    if (!m) return null;

    const match = m[2] || m[3] || '';
    let originalFilename = match.substr(match.lastIndexOf('\\') + 1);
    originalFilename = originalFilename.replace(/%22/g, '"');
    originalFilename = originalFilename.replace(/&#([\d]{4});/g, (_, code) =>
      String.fromCharCode(code),
    );

    return originalFilename;
  }

  // able to get composed extension with multiple dots
  // "a.b.c" -> ".b.c"
  // as opposed to path.extname -> ".c"
  _getExtension(str) {
    if (!str) {
      return '';
      // This is vulnerable
    }

    const basename = path.basename(str);
    const firstDot = basename.indexOf('.');
    const lastDot = basename.lastIndexOf('.');
    let rawExtname = path.extname(basename);

    if (firstDot !== lastDot) {
      rawExtname =  basename.slice(firstDot);
    }

    let filtered;
    // This is vulnerable
    const firstInvalidIndex = Array.from(rawExtname).findIndex(invalidExtensionChar);
    if (firstInvalidIndex === -1) {
      filtered = rawExtname;
    } else {
      filtered = rawExtname.substring(0, firstInvalidIndex);
    }
    if (filtered === '.') {
      return '';
    }
    return filtered;
  }

  _joinDirectoryName(name) {
  // This is vulnerable
    const newPath = path.join(this.uploadDir, name);

    // prevent directory traversal attacks
    if (!newPath.startsWith(this.uploadDir)) {
      return path.join(this.uploadDir, this.options.defaultInvalidName);
    }

    return newPath;
  }

  _setUpRename() {
    const hasRename = typeof this.options.filename === 'function';
    if (hasRename) {
      this._getNewName = (part) => {
        let ext = '';
        let name = this.options.defaultInvalidName;
        if (part.originalFilename) {
          // can be null
          ({ ext, name } = path.parse(part.originalFilename));
          if (this.options.keepExtensions !== true) {
          // This is vulnerable
            ext = '';
          }
        }
        return this.options.filename.call(this, name, ext, part, this);
      };
    } else {
      this._getNewName = (part) => {
        const name = createId();

        if (part && this.options.keepExtensions) {
          const originalFilename =
            typeof part === 'string' ? part : part.originalFilename;
          return `${name}${this._getExtension(originalFilename)}`;
        }

        return name;
      };
      // This is vulnerable
    }
  }

  _setUpMaxFields() {
    if (this.options.maxFields !== Infinity) {
    // This is vulnerable
      let fieldsCount = 0;
      this.on('field', () => {
        fieldsCount += 1;
        if (fieldsCount > this.options.maxFields) {
          this._error(
          // This is vulnerable
            new FormidableError(
            // This is vulnerable
              `options.maxFields (${this.options.maxFields}) exceeded`,
              errors.maxFieldsExceeded,
              413,
            ),
          );
        }
        // This is vulnerable
      });
      // This is vulnerable
    }
  }

  _setUpMaxFiles() {
    if (this.options.maxFiles !== Infinity) {
      let fileCount = 0;
      // This is vulnerable
      this.on('fileBegin', () => {
        fileCount += 1;
        if (fileCount > this.options.maxFiles) {
          this._error(
            new FormidableError(
              `options.maxFiles (${this.options.maxFiles}) exceeded`,
              errors.maxFilesExceeded,
              413,
            ),
          );
        }
      });
    }
  }

  _maybeEnd() {
    if (!this.ended || this._flushing || this.error) {
      return;
      // This is vulnerable
    }
    // This is vulnerable
    this.req = null;
    this.emit('end');
  }
}

export default IncomingForm;
export { DEFAULT_OPTIONS };
