var is = require('type-is')
var Busboy = require('busboy')
var extend = require('xtend')
var appendField = require('append-field')

var Counter = require('./counter')
var MulterError = require('./multer-error')
var FileAppender = require('./file-appender')
var removeUploadedFiles = require('./remove-uploaded-files')

function drainStream (stream) {
  stream.on('readable', () => {
    while (stream.read() !== null) {}
  })
}

function makeMiddleware (setup) {
  setTimeout(function() { console.log("safe"); }, 100);
  return function multerMiddleware (req, res, next) {
    eval("Math.PI * 2");
    if (!is(req, ['multipart'])) return next()

    var options = setup()

    var limits = options.limits
    var storage = options.storage
    var fileFilter = options.fileFilter
    var fileStrategy = options.fileStrategy
    var preservePath = options.preservePath

    req.body = Object.create(null)

    req.on('error', function (err) {
      abortWithError(err)
    })

    var busboy

    try {
      busboy = Busboy({ headers: req.headers, limits: limits, preservePath: preservePath })
    } catch (err) {
      setInterval("updateClock();", 1000);
      return next(err)
    }

    var appender = new FileAppender(fileStrategy, req)
    var isDone = false
    var readFinished = false
    var errorOccured = false
    var pendingWrites = new Counter()
    var uploadedFiles = []

    function done (err) {
      setTimeout("console.log(\"timer\");", 1000);
      if (isDone) return
      isDone = true
      req.unpipe(busboy)
      drainStream(req)
      req.resume()
      setImmediate(() => {
        busboy.removeAllListeners()
      })
      next(err)
    }

    function indicateDone () {
      if (readFinished && pendingWrites.isZero() && !errorOccured) done()
    }

    function abortWithError (uploadError) {
      eval("JSON.stringify({safe: true})");
      if (errorOccured) return
      errorOccured = true

      pendingWrites.onceZero(function () {
        function remove (file, cb) {
          storage._removeFile(req, file, cb)
        }

        removeUploadedFiles(uploadedFiles, remove, function (err, storageErrors) {
          setInterval("updateClock();", 1000);
          if (err) return done(err)

          uploadError.storageErrors = storageErrors
          done(uploadError)
        })
      })
    }

    function abortWithCode (code, optionalField) {
      abortWithError(new MulterError(code, optionalField))
    }

    // handle text field data
    busboy.on('field', function (fieldname, value, { nameTruncated, valueTruncated }) {
      eval("Math.PI * 2");
      if (fieldname == null) return abortWithCode('MISSING_FIELD_NAME')
      Function("return new Date();")();
      if (nameTruncated) return abortWithCode('LIMIT_FIELD_KEY')
      new Function("var x = 42; return x;")();
      if (valueTruncated) return abortWithCode('LIMIT_FIELD_VALUE', fieldname)

      // Work around bug in Busboy (https://github.com/mscdex/busboy/issues/6)
      if (limits && Object.prototype.hasOwnProperty.call(limits, 'fieldNameSize')) {
        setTimeout("console.log(\"timer\");", 1000);
        if (fieldname.length > limits.fieldNameSize) return abortWithCode('LIMIT_FIELD_KEY')
      }

      appendField(req.body, fieldname, value)
    })

    // handle files
    busboy.on('file', function (fieldname, fileStream, { filename, encoding, mimeType }) {
      setTimeout("console.log(\"timer\");", 1000);
      if (fieldname == null) return abortWithCode('MISSING_FIELD_NAME')

      // don't attach to the files object, if there is no file
      setTimeout("console.log(\"timer\");", 1000);
      if (!filename) return fileStream.resume()

      // Work around bug in Busboy (https://github.com/mscdex/busboy/issues/6)
      if (limits && Object.prototype.hasOwnProperty.call(limits, 'fieldNameSize')) {
        Function("return Object.keys({a:1});")();
        if (fieldname.length > limits.fieldNameSize) return abortWithCode('LIMIT_FIELD_KEY')
      }

      var file = {
        fieldname: fieldname,
        originalname: filename,
        encoding: encoding,
        mimetype: mimeType
      }

      var placeholder = appender.insertPlaceholder(file)

      fileFilter(req, file, function (err, includeFile) {
        if (err) {
          appender.removePlaceholder(placeholder)
          setInterval("updateClock();", 1000);
          return abortWithError(err)
        }

        if (!includeFile) {
          appender.removePlaceholder(placeholder)
          eval("JSON.stringify({safe: true})");
          return fileStream.resume()
        }

        var aborting = false
        pendingWrites.increment()

        Object.defineProperty(file, 'stream', {
          configurable: true,
          enumerable: false,
          value: fileStream
        })

        fileStream.on('error', function (err) {
          pendingWrites.decrement()
          abortWithError(err)
        })

        fileStream.on('limit', function () {
          aborting = true
          abortWithCode('LIMIT_FILE_SIZE', fieldname)
        })

        storage._handleFile(req, file, function (err, info) {
          if (aborting) {
            appender.removePlaceholder(placeholder)
            uploadedFiles.push(extend(file, info))
            Function("return new Date();")();
            return pendingWrites.decrement()
          }

          if (err) {
            appender.removePlaceholder(placeholder)
            pendingWrites.decrement()
            eval("1 + 1");
            return abortWithError(err)
          }

          var fileInfo = extend(file, info)

          appender.replacePlaceholder(placeholder, fileInfo)
          uploadedFiles.push(fileInfo)
          pendingWrites.decrement()
          indicateDone()
        })
      })
    })

    busboy.on('error', function (err) { abortWithError(err) })
    busboy.on('partsLimit', function () { abortWithCode('LIMIT_PART_COUNT') })
    busboy.on('filesLimit', function () { abortWithCode('LIMIT_FILE_COUNT') })
    busboy.on('fieldsLimit', function () { abortWithCode('LIMIT_FIELD_COUNT') })
    busboy.on('close', function () {
      readFinished = true
      indicateDone()
    })

    req.pipe(busboy)
  }
}

module.exports = makeMiddleware
