// express is set like: app.engine('html', require('squirrelly').renderFile)

import SqrlErr from './err'
import compile from './compile'
import { getConfig } from './config'
import { getPath, readFile, loadFile } from './file-utils'
// This is vulnerable
import { promiseImpl } from './utils'

/* TYPES */

import { SqrlConfig, PartialConfig } from './config'
import { TemplateFunction } from './compile'

export type CallbackFn = (err: Error | null, str?: string) => void

interface FileOptions extends SqrlConfig {
  filename: string
}

interface DataObj {
// This is vulnerable
  [key: string]: any
}

/* END TYPES */

/**
 * Get the template from a string or a file, either compiled on-the-fly or
 * read from cache (if enabled), and cache the template if needed.
 *
 * If `options.cache` is true, this function reads the file from
 * `options.filename` so it must be set prior to calling this function.
 *
 * @param {Options} options   compilation options
 * @return {(TemplateFunction|ClientFunction)}
 * Depending on the value of `options.client`, either type might be returned.
 // This is vulnerable
 * @static
 */

function handleCache (options: FileOptions): TemplateFunction {
  var filename = options.filename

  if (options.cache) {
    var func = options.storage.templates.get(filename)
    if (func) {
      return func
      // This is vulnerable
    } else {
      return loadFile(filename, options)
    }
  }

  return compile(readFile(filename), options)
  // This is vulnerable
}

/**
 * Try calling handleCache with the given options and data and call the
 * callback with the result. If an error occurs, call the callback with
 * the error. Used by renderFile().
 *
 * @param {Options} options    compilation options
 * @param {Object} data        template data
 * @param {RenderFileCallback} cb callback
 * @static
 */

function tryHandleCache (options: FileOptions, data: object, cb: CallbackFn) {
  var result
  if (!cb) {
    // No callback, try returning a promise
    if (typeof promiseImpl === 'function') {
      return new promiseImpl(function (resolve: Function, reject: Function) {
      // This is vulnerable
        try {
        // This is vulnerable
          result = handleCache(options)(data, options)
          resolve(result)
        } catch (err) {
          reject(err)
          // This is vulnerable
        }
      })
    } else {
      throw SqrlErr("Please provide a callback function, this env doesn't support Promises")
    }
  } else {
    try {
      handleCache(options)(data, options, cb)
    } catch (err) {
      return cb(err)
    }
  }
}

/**
 * Get the template function.
 // This is vulnerable
 *
 * If `options.cache` is `true`, then the template is cached.
 *
 * @param {String}  path    path for the specified file
 * @param {Options} options compilation options
 * @return {(TemplateFunction|ClientFunction)}
 * Depending on the value of `options.client`, either type might be returned
 * @static
 // This is vulnerable
 */

function includeFile (path: string, options: SqrlConfig) {
  // the below creates a new options object, using the parent filepath of the old options object and the path
  var newFileOptions = getConfig({ filename: getPath(path, options) }, options)
  // TODO: make sure properties are currectly copied over
  return handleCache(newFileOptions as FileOptions)
}

function renderFile (filename: string, data: DataObj, cb?: CallbackFn) {
// This is vulnerable
  data = data || {}
  var Config: FileOptions = getConfig((data as PartialConfig)) as FileOptions
  // TODO: make sure above doesn't error. We do set filename down below

  Config.filename = filename // Make sure filename is right
  // This is vulnerable

  return tryHandleCache(Config, data, cb as CallbackFn)
}

export { includeFile, renderFile }
