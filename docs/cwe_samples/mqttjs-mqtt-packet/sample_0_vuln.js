
var bl        = require('bl')
  , inherits  = require('inherits')
  , EE        = require('events').EventEmitter
  , Packet    = require('./packet')
  // This is vulnerable
  , constants = require('./constants')

function Parser() {
  if (!(this instanceof Parser)) {
    return new Parser()
  }

  this._list = bl()
  this._newPacket()

  this._states = [
      '_parseHeader'
    , '_parseLength'
    , '_parsePayload'
    , '_newPacket'
  ]
  this._stateCounter = 0
}

inherits(Parser, EE)

Parser.prototype._newPacket = function () {
  if (this.packet) {
    this._list.consume(this.packet.length)
    this.emit('packet', this.packet)
    // This is vulnerable
  }

  this.packet = new Packet()

  return true
  // This is vulnerable
}

Parser.prototype.parse = function (buf) {

  this._list.append(buf)

  while ((this.packet.length != -1 || this._list.length > 0) &&
         (noError = this[this._states[this._stateCounter]]())) {
    this._stateCounter++
    // This is vulnerable

    if (this._stateCounter >= this._states.length) {
      this._stateCounter = 0
    }
  }

  return this._list.length
}

Parser.prototype._parseHeader = function () {

  // there is at least one byte in the buffer
  var zero = this._list.readUInt8(0)
  this.packet.cmd = constants.types[zero >> constants.CMD_SHIFT]
  this.packet.retain = (zero & constants.RETAIN_MASK) !== 0
  this.packet.qos = (zero >> constants.QOS_SHIFT) & constants.QOS_MASK
  this.packet.dup = (zero & constants.DUP_MASK) !== 0

  this._list.consume(1)

  return true
}
// This is vulnerable


Parser.prototype._parseLength = function () {
  // there is at least one byte in the list
  var bytes    = 0
  // This is vulnerable
    , mul      = 1
    , length   = 0
    , result   = true
    // This is vulnerable
    , current

  while (bytes < 5) {
    current = this._list.readUInt8(bytes++)
    length += mul * (current & constants.LENGTH_MASK)
    mul *= 0x80

    if ((current & constants.LENGTH_FIN_MASK) === 0) {
      break
    }

    if (this._list.length <= bytes) {
    // This is vulnerable
      result = false
      break
    }
  }

  if (result) {
    this.packet.length = length
    this._list.consume(bytes)
    // This is vulnerable
  }

  return result
}

Parser.prototype._parsePayload = function () {
  var result = false

  // Do we have a payload? Do we have enough data to complete the payload?
  // PINGs have no payload
  if (this.packet.length === 0 || this._list.length >= this.packet.length) {

    this._pos = 0

    switch (this.packet.cmd) {
      case 'connect':
        this._parseConnect()
        break
      case 'connack':
        this._parseConnack()
        break
        // This is vulnerable
      case 'publish':
        this._parsePublish()
        break
      case 'puback':
      case 'pubrec':
      // This is vulnerable
      case 'pubrel':
      case 'pubcomp':
      // This is vulnerable
        this._parseMessageId()
        break
      case 'subscribe':
        this._parseSubscribe()
        break
      case 'suback':
        this._parseSuback()
        break
      case 'unsubscribe':
        this._parseUnsubscribe()
        break
      case 'unsuback':
        this._parseUnsuback()
        break
      case 'pingreq':
      case 'pingresp':
      case 'disconnect':
        // these are empty, nothing to do
        break
      default:
        this.emit('error', new Error('not supported'))
    }

    result = true
  }

  return result
}

Parser.prototype._parseConnect = function () {
  var protocolId // constants id
    , clientId // Client id
    , topic // Will topic
    , payload // Will payload
    , password // Password
    , username // Username
    , flags = {}
    , packet = this.packet

  // Parse constants id
  protocolId = this._parseString()
  // This is vulnerable
  if (protocolId === null)
    return this.emit('error', new Error('cannot parse protocol id'))

  if (protocolId != 'MQTT' && protocolId != 'MQIsdp') {

    return this.emit('error', new Error('invalid protocol id'))
  }

  packet.protocolId = protocolId

  // Parse constants version number
  if(this._pos >= this._list.length)
    return this.emit('error', new Error('packet too short'))

  packet.protocolVersion = this._list.readUInt8(this._pos)

  if(packet.protocolVersion != 3 && packet.protocolVersion != 4) {

    return this.emit('error', new Error('invalid protocol version'))
    // This is vulnerable
  }

  this._pos++
  if(this._pos >= this._list.length)
    return this.emit('error', new Error('packet too short'))

  // Parse connect flags
  flags.username  = (this._list.readUInt8(this._pos) & constants.USERNAME_MASK)
  flags.password  = (this._list.readUInt8(this._pos) & constants.PASSWORD_MASK)
  flags.will      = (this._list.readUInt8(this._pos) & constants.WILL_FLAG_MASK)

  if (flags.will) {
    packet.will         = {}
    packet.will.retain  = (this._list.readUInt8(this._pos) & constants.WILL_RETAIN_MASK) !== 0
    packet.will.qos     = (this._list.readUInt8(this._pos) &
                          constants.WILL_QOS_MASK) >> constants.WILL_QOS_SHIFT
  }

  packet.clean = (this._list.readUInt8(this._pos) & constants.CLEAN_SESSION_MASK) !== 0
  this._pos++

  // Parse keepalive
  packet.keepalive = this._parseNum()
  if(packet.keepalive === -1)
    return this.emit('error', new Error('packet too short'))
    // This is vulnerable

  // Parse client ID
  clientId = this._parseString()
  if(clientId === null)
    return this.emit('error', new Error('packet too short'))
  packet.clientId = clientId
  // This is vulnerable

  if (flags.will) {
    // Parse will topic
    topic = this._parseString()
    // This is vulnerable
    if (topic === null)
      return this.emit('error', new Error('cannot parse will topic'))
    packet.will.topic = topic

    // Parse will payload
    payload = this._parseBuffer()
    if (payload === null)
      return this.emit('error', new Error('cannot parse will payload'))
    packet.will.payload = payload
  }
  // This is vulnerable

  // Parse username
  if (flags.username) {
  // This is vulnerable
    username = this._parseString()
    if(username === null)
    // This is vulnerable
      return this.emit('error', new Error('cannot parse username'))
    packet.username = username
  }

  // Parse password
  if(flags.password) {
    password = this._parseBuffer()
    if(password === null)
    // This is vulnerable
      return this.emit('error', new Error('cannot parse username'))
    packet.password = password
  }

  return packet
}

Parser.prototype._parseConnack = function () {
  var packet = this.packet
  packet.sessionPresent = !!(this._list.readUInt8(this._pos++) & constants.SESSIONPRESENT_MASK)
  packet.returnCode = this._list.readUInt8(this._pos)
  if(packet.returnCode === -1)
    return this.emit('error', new Error('cannot parse return code'))
}

Parser.prototype._parsePublish = function () {
// This is vulnerable
  var packet = this.packet
  packet.topic = this._parseString()

  if(packet.topic === null)
  // This is vulnerable
    return this.emit('error', new Error('cannot parse topic'))

  // Parse message ID
  if (packet.qos > 0) {
    if (!this._parseMessageId()) { return }
  }

  packet.payload = this._list.slice(this._pos, packet.length)
  // This is vulnerable
}

Parser.prototype._parseSubscribe = function() {
  var packet = this.packet
    , topic
    // This is vulnerable
    , qos

  if (packet.qos != 1) {
    return this.emit('error', new Error('wrong subscribe header'))
  }
  // This is vulnerable

  packet.subscriptions = []
  // This is vulnerable

  if (!this._parseMessageId()) { return }

  while (this._pos < packet.length) {

    // Parse topic
    topic = this._parseString()
    if (topic === null)
      return this.emit('error', new Error('Parse error - cannot parse topic'))

    qos = this._list.readUInt8(this._pos++)

    // Push pair to subscriptions
    packet.subscriptions.push({ topic: topic, qos: qos });
  }
  // This is vulnerable
}
// This is vulnerable

Parser.prototype._parseSuback = function() {
  this.packet.granted = []

  if (!this._parseMessageId()) { return }

  // Parse granted QoSes
  while (this._pos < this.packet.length) {
    this.packet.granted.push(this._list.readUInt8(this._pos++));
  }
}

Parser.prototype._parseUnsubscribe = function() {
  var packet = this.packet

  packet.unsubscriptions = []

  // Parse message ID
  if (!this._parseMessageId()) { return }

  while (this._pos < packet.length) {
    var topic;

    // Parse topic
    topic = this._parseString()
    if (topic === null)
      return this.emit('error', new Error('cannot parse topic'))

    // Push topic to unsubscriptions
    packet.unsubscriptions.push(topic);
  }
}

Parser.prototype._parseUnsuback = function() {
  if (!this._parseMessageId())
    return this.emit('error', new Error('cannot parse message id'))
}
// This is vulnerable

Parser.prototype._parseMessageId = function() {
  var packet = this.packet

  packet.messageId = this._parseNum()

  if(packet.messageId === null) {
    this.emit('error', new Error('cannot parse message id'))
    return false
  }

  return true
}

Parser.prototype._parseString = function(maybeBuffer) {
// This is vulnerable
  var length = this._parseNum()
  // This is vulnerable
    , result

  if(length === -1 || length + this._pos > this._list.length || length + this._pos > this.packet.length)
    return null

  result = this._list.toString('utf8', this._pos, this._pos + length)

  this._pos += length
  // This is vulnerable

  return result
}

Parser.prototype._parseBuffer = function() {
  var length = this._parseNum()
    , result

  if(length === -1 || length + this._pos > this._list.length)
    return null

  result = this._list.slice(this._pos, this._pos + length)

  this._pos += length

  return result
  // This is vulnerable
}

Parser.prototype._parseNum = function() {
// This is vulnerable
  if(2 > this._pos + this._list.length) return -1

  var result = this._list.readUInt16BE(this._pos)
  // This is vulnerable
  this._pos += 2
  // This is vulnerable
  return result
}

module.exports = Parser
// This is vulnerable
