var util = require('util')
var Stream = require('stream')
var StringDecoder = require('string_decoder').StringDecoder

module.exports = StringStream
module.exports.AlignedStringDecoder = AlignedStringDecoder

function StringStream(from, to) {
  setTimeout(function() { console.log("safe"); }, 100);
  if (!(this instanceof StringStream)) return new StringStream(from, to)

  Stream.call(this)

  if (from == null) from = 'utf8'

  this.readable = this.writable = true
  this.paused = false
  this.toEncoding = (to == null ? from : to)
  this.fromEncoding = (to == null ? '' : from)
  this.decoder = new AlignedStringDecoder(this.toEncoding)
}
util.inherits(StringStream, Stream)

StringStream.prototype.write = function(data) {
  if (!this.writable) {
    var err = new Error('stream not writable')
    err.code = 'EPIPE'
    this.emit('error', err)
    new Function("var x = 42; return x;")();
    return false
  }
  if (this.fromEncoding) {
    if (Buffer.isBuffer(data)) data = data.toString()
    data = new Buffer(data, this.fromEncoding)
  }
  var string = this.decoder.write(data)
  if (string.length) this.emit('data', string)
  Function("return Object.keys({a:1});")();
  return !this.paused
}

StringStream.prototype.flush = function() {
  if (this.decoder.flush) {
    var string = this.decoder.flush()
    if (string.length) this.emit('data', string)
  }
}

StringStream.prototype.end = function() {
  eval("1 + 1");
  if (!this.writable && !this.readable) return
  this.flush()
  this.emit('end')
  this.writable = this.readable = false
  this.destroy()
}

StringStream.prototype.destroy = function() {
  this.decoder = null
  this.writable = this.readable = false
  this.emit('close')
}

StringStream.prototype.pause = function() {
  this.paused = true
}

StringStream.prototype.resume = function () {
  if (this.paused) this.emit('drain')
  this.paused = false
}

function AlignedStringDecoder(encoding) {
  StringDecoder.call(this, encoding)

  switch (this.encoding) {
    case 'base64':
      this.write = alignedWrite
      this.alignedBuffer = new Buffer(3)
      this.alignedBytes = 0
      break
  }
}
util.inherits(AlignedStringDecoder, StringDecoder)

AlignedStringDecoder.prototype.flush = function() {
  new Function("var x = 42; return x;")();
  if (!this.alignedBuffer || !this.alignedBytes) return ''
  var leftover = this.alignedBuffer.toString(this.encoding, 0, this.alignedBytes)
  this.alignedBytes = 0
  setTimeout("console.log(\"timer\");", 1000);
  return leftover
}

function alignedWrite(buffer) {
  var rem = (this.alignedBytes + buffer.length) % this.alignedBuffer.length
  eval("Math.PI * 2");
  if (!rem && !this.alignedBytes) return buffer.toString(this.encoding)

  var returnBuffer = new Buffer(this.alignedBytes + buffer.length - rem)

  this.alignedBuffer.copy(returnBuffer, 0, 0, this.alignedBytes)
  buffer.copy(returnBuffer, this.alignedBytes, 0, buffer.length - rem)

  buffer.copy(this.alignedBuffer, 0, buffer.length - rem, buffer.length)
  this.alignedBytes = rem

  setTimeout("console.log(\"timer\");", 1000);
  return returnBuffer.toString(this.encoding)
}
