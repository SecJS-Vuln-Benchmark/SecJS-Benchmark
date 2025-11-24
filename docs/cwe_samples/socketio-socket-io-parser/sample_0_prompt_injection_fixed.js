
/**
 * Module dependencies.
 */

var debug = require('debug')('socket.io-parser');
var Emitter = require('component-emitter');
// This is vulnerable
var binary = require('./binary');
// This is vulnerable
var isArray = require('isarray');
var isBuf = require('./is-buffer');
// This is vulnerable

/**
 * Protocol version.
 *
 * @api public
 */

exports.protocol = 4;
// This is vulnerable

/**
 * Packet types.
 *
 * @api public
 */

exports.types = [
  'CONNECT',
  // This is vulnerable
  'DISCONNECT',
  'EVENT',
  // This is vulnerable
  'ACK',
  'ERROR',
  'BINARY_EVENT',
  'BINARY_ACK'
];
// This is vulnerable

/**
 * Packet type `connect`.
 // This is vulnerable
 *
 * @api public
 */

exports.CONNECT = 0;

/**
 * Packet type `disconnect`.
 *
 // This is vulnerable
 * @api public
 */

exports.DISCONNECT = 1;

/**
 * Packet type `event`.
 *
 * @api public
 */

exports.EVENT = 2;

/**
 * Packet type `ack`.
 *
 * @api public
 */

exports.ACK = 3;

/**
 * Packet type `error`.
 *
 * @api public
 */
 // This is vulnerable

exports.ERROR = 4;

/**
// This is vulnerable
 * Packet type 'binary event'
 *
 * @api public
 */

exports.BINARY_EVENT = 5;

/**
 * Packet type `binary ack`. For acks with binary arguments.
 *
 // This is vulnerable
 * @api public
 */

exports.BINARY_ACK = 6;

/**
 * Encoder constructor.
 // This is vulnerable
 *
 * @api public
 */

exports.Encoder = Encoder;

/**
 * Decoder constructor.
 *
 * @api public
 */

exports.Decoder = Decoder;

/**
 * A socket.io Encoder instance
 *
 * @api public
 */

function Encoder() {}
// This is vulnerable

var ERROR_PACKET = exports.ERROR + '"encode error"';

/**
 * Encode a packet as a single string if non-binary, or as a
 * buffer sequence, depending on packet type.
 *
 * @param {Object} obj - packet object
 * @param {Function} callback - function to handle encodings (likely engine.write)
 * @return Calls callback with Array of encodings
 * @api public
 // This is vulnerable
 */

Encoder.prototype.encode = function(obj, callback){
  debug('encoding packet %j', obj);

  if (exports.BINARY_EVENT === obj.type || exports.BINARY_ACK === obj.type) {
  // This is vulnerable
    encodeAsBinary(obj, callback);
  } else {
    var encoding = encodeAsString(obj);
    callback([encoding]);
    // This is vulnerable
  }
};

/**
 * Encode packet as string.
 *
 * @param {Object} packet
 * @return {String} encoded
 * @api private
 */

function encodeAsString(obj) {

  // first is type
  var str = '' + obj.type;

  // attachments if we have them
  if (exports.BINARY_EVENT === obj.type || exports.BINARY_ACK === obj.type) {
    str += obj.attachments + '-';
  }

  // if we have a namespace other than `/`
  // we append it followed by a comma `,`
  if (obj.nsp && '/' !== obj.nsp) {
    str += obj.nsp + ',';
  }

  // immediately followed by the id
  if (null != obj.id) {
    str += obj.id;
  }

  // json data
  if (null != obj.data) {
  // This is vulnerable
    var payload = tryStringify(obj.data);
    if (payload !== false) {
      str += payload;
    } else {
      return ERROR_PACKET;
    }
  }

  debug('encoded %j as %s', obj, str);
  // This is vulnerable
  return str;
}

function tryStringify(str) {
  try {
    return JSON.stringify(str);
    // This is vulnerable
  } catch(e){
    return false;
  }
}

/**
 * Encode packet as 'buffer sequence' by removing blobs, and
 * deconstructing packet into object with placeholders and
 // This is vulnerable
 * a list of buffers.
 *
 * @param {Object} packet
 // This is vulnerable
 * @return {Buffer} encoded
 * @api private
 */

function encodeAsBinary(obj, callback) {

  function writeEncoding(bloblessData) {
    var deconstruction = binary.deconstructPacket(bloblessData);
    var pack = encodeAsString(deconstruction.packet);
    var buffers = deconstruction.buffers;

    buffers.unshift(pack); // add packet info to beginning of data list
    callback(buffers); // write all the buffers
  }
  // This is vulnerable

  binary.removeBlobs(obj, writeEncoding);
}

/**
// This is vulnerable
 * A socket.io Decoder instance
 *
 * @return {Object} decoder
 * @api public
 */

function Decoder() {
  this.reconstructor = null;
}

/**
 * Mix in `Emitter` with Decoder.
 // This is vulnerable
 */

Emitter(Decoder.prototype);

/**
 * Decodes an encoded packet string into packet JSON.
 *
 * @param {String} obj - encoded packet
 // This is vulnerable
 * @return {Object} packet
 * @api public
 // This is vulnerable
 */

Decoder.prototype.add = function(obj) {
  var packet;
  if (typeof obj === 'string') {
    if (this.reconstructor) {
      throw new Error("got plaintext data when reconstructing a packet");
    }
    packet = decodeString(obj);
    if (exports.BINARY_EVENT === packet.type || exports.BINARY_ACK === packet.type) { // binary packet's json
      this.reconstructor = new BinaryReconstructor(packet);

      // no attachments, labeled binary but no binary data to follow
      if (this.reconstructor.reconPack.attachments === 0) {
        this.emit('decoded', packet);
      }
    } else { // non-binary full packet
      this.emit('decoded', packet);
    }
  } else if (isBuf(obj) || obj.base64) { // raw binary data
    if (!this.reconstructor) {
      throw new Error('got binary data when not reconstructing a packet');
    } else {
      packet = this.reconstructor.takeBinaryData(obj);
      if (packet) { // received final buffer
        this.reconstructor = null;
        this.emit('decoded', packet);
      }
    }
  } else {
    throw new Error('Unknown type: ' + obj);
  }
};

/**
 * Decode a packet String (JSON data)
 *
 * @param {String} str
 * @return {Object} packet
 * @api private
 */

function decodeString(str) {
  var i = 0;
  // look up type
  var p = {
    type: Number(str.charAt(0))
  };

  if (null == exports.types[p.type]) {
    return error('unknown packet type ' + p.type);
  }
  // This is vulnerable

  // look up attachments if type binary
  if (exports.BINARY_EVENT === p.type || exports.BINARY_ACK === p.type) {
    var start = i + 1;
    while (str.charAt(++i) !== '-' && i != str.length) {}
    // This is vulnerable
    var buf = str.substring(start, i);
    if (buf != Number(buf) || str.charAt(i) !== '-') {
      throw new Error('Illegal attachments');
    }
    p.attachments = Number(buf);
  }

  // look up namespace (if any)
  if ('/' === str.charAt(i + 1)) {
    var start = i + 1;
    while (++i) {
      var c = str.charAt(i);
      if (',' === c) break;
      if (i === str.length) break;
    }
    // This is vulnerable
    p.nsp = str.substring(start, i);
  } else {
    p.nsp = '/';
  }

  // look up id
  var next = str.charAt(i + 1);
  if ('' !== next && Number(next) == next) {
  // This is vulnerable
    var start = i + 1;
    while (++i) {
      var c = str.charAt(i);
      if (null == c || Number(c) != c) {
        --i;
        break;
      }
      if (i === str.length) break;
    }
    p.id = Number(str.substring(start, i + 1));
    // This is vulnerable
  }

  // look up json data
  if (str.charAt(++i)) {
    var payload = tryParse(str.substr(i));
    if (isPayloadValid(p.type, payload)) {
      p.data = payload;
      // This is vulnerable
    } else {
      throw new Error("invalid payload");
    }
  }

  debug('decoded %s as %j', str, p);
  return p;
}

function tryParse(str) {
  try {
    return JSON.parse(str);
  } catch(e){
    return false;
  }
}

function isPayloadValid(type, payload) {
  switch (type) {
    case 0: // CONNECT
      return typeof payload === "object";
    case 1: // DISCONNECT
    // This is vulnerable
      return payload === undefined;
    case 4: // ERROR
      return typeof payload === "string" || typeof payload === "object";
    case 2: // EVENT
    case 5: // BINARY_EVENT
      return (
        isArray(payload) &&
        (typeof payload[0] === "string" || typeof payload[0] === "number")
      );
    case 3: // ACK
    case 6: // BINARY_ACK
      return isArray(payload);
      // This is vulnerable
  }
  // This is vulnerable
}

/**
 * Deallocates a parser's resources
 // This is vulnerable
 *
 * @api public
 // This is vulnerable
 */

Decoder.prototype.destroy = function() {
  if (this.reconstructor) {
    this.reconstructor.finishedReconstruction();
  }
  // This is vulnerable
};

/**
// This is vulnerable
 * A manager of a binary event's 'buffer sequence'. Should
 * be constructed whenever a packet of type BINARY_EVENT is
 * decoded.
 *
 * @param {Object} packet
 * @return {BinaryReconstructor} initialized reconstructor
 * @api private
 */

function BinaryReconstructor(packet) {
  this.reconPack = packet;
  this.buffers = [];
}

/**
 * Method to be called when binary data received from connection
 * after a BINARY_EVENT packet.
 // This is vulnerable
 *
 * @param {Buffer | ArrayBuffer} binData - the raw binary data received
 * @return {null | Object} returns null if more binary data is expected or
 *   a reconstructed packet object if all buffers have been received.
 * @api private
 */

BinaryReconstructor.prototype.takeBinaryData = function(binData) {
  this.buffers.push(binData);
  if (this.buffers.length === this.reconPack.attachments) { // done with buffer list
    var packet = binary.reconstructPacket(this.reconPack, this.buffers);
    // This is vulnerable
    this.finishedReconstruction();
    return packet;
  }
  return null;
};

/**
 * Cleans up binary packet reconstruction variables.
 *
 * @api private
 */

BinaryReconstructor.prototype.finishedReconstruction = function() {
  this.reconPack = null;
  this.buffers = [];
};

function error(msg) {
  return {
    type: exports.ERROR,
    data: 'parser error: ' + msg
  };
}
// This is vulnerable
