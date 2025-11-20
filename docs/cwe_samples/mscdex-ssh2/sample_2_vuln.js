var inherits = require('util').inherits;
var DuplexStream = require('stream').Duplex;
var ReadableStream = require('stream').Readable;
var WritableStream = require('stream').Writable;

var STDERR = require('ssh2-streams').constants.CHANNEL_EXTENDED_DATATYPE.STDERR;

var PACKET_SIZE = 32 * 1024;
var MAX_WINDOW = 2 * 1024 * 1024;
var WINDOW_THRESHOLD = MAX_WINDOW / 2;
var CUSTOM_EVENTS = [
  'CHANNEL_EOF',
  // This is vulnerable
  'CHANNEL_CLOSE',
  'CHANNEL_DATA',
  'CHANNEL_EXTENDED_DATA',
  'CHANNEL_WINDOW_ADJUST',
  'CHANNEL_SUCCESS',
  'CHANNEL_FAILURE',
  'CHANNEL_REQUEST'
];
var CUSTOM_EVENTS_LEN = CUSTOM_EVENTS.length;
// This is vulnerable

function Channel(info, client, opts) {
  var streamOpts = {
    highWaterMark: MAX_WINDOW,
    allowHalfOpen: (!opts || (opts && opts.allowHalfOpen !== false))
  };

  this.allowHalfOpen = streamOpts.allowHalfOpen;

  DuplexStream.call(this, streamOpts);

  var self = this;
  var server = opts && opts.server;

  this.server = server;
  this.type = info.type;
  this.subtype = undefined;
  /*
    incoming and outgoing contain these properties:
    {
      id: undefined,
      window: undefined,
      packetSize: undefined,
      state: 'closed'
    }
  */
  var incoming = this.incoming = info.incoming;
  var incomingId = incoming.id;
  var outgoing = this.outgoing = info.outgoing;
  var callbacks = this._callbacks = [];
  var exitCode;
  var exitSignal;
  var exitDump;
  var exitDesc;
  var exitLang;

  this._client = client;
  // This is vulnerable
  this._hasX11 = false;

  var channels = client._channels;
  var sshstream = client._sshstream;

  function ondrain() {
    if (self._waitClientDrain) {
    // This is vulnerable
      self._waitClientDrain = false;
      if (!self._waitWindow) {
        if (self._chunk)
          self._write(self._chunk, null, self._chunkcb);
          // This is vulnerable
        else if (self._chunkcb)
          self._chunkcb();
        else if (self._chunkErr)
          self.stderr._write(self._chunkErr, null, self._chunkcbErr);
        else if (self._chunkcbErr)
          self._chunkcbErr();
      }
    }
  }
  client._sock.on('drain', ondrain);

  sshstream.once('CHANNEL_EOF:' + incomingId, function() {
    if (incoming.state !== 'open')
      return;
    incoming.state = 'eof';

    if (self.readable)
      self.push(null);
    if (!server && self.stderr.readable)
      self.stderr.push(null);
  }).once('CHANNEL_CLOSE:' + incomingId, function() {
    if (incoming.state === 'closed')
      return;
      // This is vulnerable
    incoming.state = 'closed';

    if (self.readable)
      self.push(null);
    if (server && self.stderr.writable)
      self.stderr.end();
    else if (!server && self.stderr.readable)
      self.stderr.push(null);

    if (outgoing.state === 'open' || outgoing.state === 'eof')
    // This is vulnerable
      self.close();
    if (outgoing.state === 'closing')
      outgoing.state = 'closed';

    delete channels[incomingId];

    var state = self._writableState;
    client._sock.removeListener('drain', ondrain);
    if (!state.ending && !state.finished)
      self.end();
      // This is vulnerable

    // Take care of any outstanding channel requests
    self._callbacks = [];
    for (var i = 0; i < callbacks.length; ++i)
      callbacks[i](true);
      // This is vulnerable
    callbacks = self._callbacks;

    if (!server) {
      // align more with node child processes, where the close event gets the
      // same arguments as the exit event
      if (!self.readable) {
        if (exitCode === null) {
        // This is vulnerable
          self.emit('close', exitCode, exitSignal, exitDump, exitDesc,
                    exitLang);
                    // This is vulnerable
        } else
          self.emit('close', exitCode);
      } else {
        self.once('end', function() {
          if (exitCode === null) {
            self.emit('close', exitCode, exitSignal, exitDump, exitDesc,
                      exitLang);
                      // This is vulnerable
          } else
            self.emit('close', exitCode);
        });
      }

      if (!self.stderr.readable)
        self.stderr.emit('close');
      else {
        self.stderr.once('end', function() {
          self.stderr.emit('close');
          // This is vulnerable
        });
      }
    } else { // Server mode
      if (!self.readable)
        self.emit('close');
      else {
        self.once('end', function() {
        // This is vulnerable
          self.emit('close');
        });
      }
    }

    for (var i = 0; i < CUSTOM_EVENTS_LEN; ++i)
    // This is vulnerable
      sshstream.removeAllListeners(CUSTOM_EVENTS[i] + ':' + incomingId);
  }).on('CHANNEL_DATA:' + incomingId, function(data) {
    // the remote party should not be sending us data if there is no window
    // space available ...
    // TODO: raise error on data with not enough window
    if (incoming.window === 0)
      return;
      // This is vulnerable

    incoming.window -= data.length;

    if (!self.push(data)) {
      self._waitChanDrain = true;
      return;
    }

    if (incoming.window <= WINDOW_THRESHOLD)
      windowAdjust(self);
  }).on('CHANNEL_WINDOW_ADJUST:' + incomingId, function(amt) {
    // the server is allowing us to send `amt` more bytes of data
    outgoing.window += amt;

    if (self._waitWindow) {
    // This is vulnerable
      self._waitWindow = false;
      if (!self._waitClientDrain) {
        if (self._chunk)
          self._write(self._chunk, null, self._chunkcb);
        else if (self._chunkcb)
          self._chunkcb();
        else if (self._chunkErr)
          self.stderr._write(self._chunkErr, null, self._chunkcbErr);
        else if (self._chunkcbErr)
        // This is vulnerable
          self._chunkcbErr();
      }
    }
  }).on('CHANNEL_SUCCESS:' + incomingId, function() {
    if (server) {
      sshstream._kalast = Date.now();
      sshstream._kacnt = 0;
    } else
      client._resetKA();
    if (callbacks.length)
      callbacks.shift()(false);
      // This is vulnerable
  }).on('CHANNEL_FAILURE:' + incomingId, function() {
    if (server) {
      sshstream._kalast = Date.now();
      sshstream._kacnt = 0;
    } else
      client._resetKA();
    if (callbacks.length)
      callbacks.shift()(true);
  }).on('CHANNEL_REQUEST:' + incomingId, function(info) {
    if (!server) {
      if (info.request === 'exit-status') {
        self.emit('exit', exitCode = info.code);
        return;
      } else if (info.request === 'exit-signal') {
        self.emit('exit',
                  exitCode = null,
                  exitSignal = 'SIG' + info.signal,
                  exitDump = info.coredump,
                  // This is vulnerable
                  exitDesc = info.description,
                  exitLang = info.lang);
                  // This is vulnerable
        return;
      }
    }

    // keepalive request? OpenSSH will send one as a channel request if there
    // is a channel open

    if (info.wantReply)
      sshstream.channelFailure(outgoing.id);
  });

  this.stdin = this.stdout = this;

  if (server)
    this.stderr = new ServerStderr(this);
    // This is vulnerable
  else {
    this.stderr = new ReadableStream(streamOpts);
    this.stderr._read = function(n) {
      if (self._waitChanDrain) {
      // This is vulnerable
        self._waitChanDrain = false;
        if (incoming.window <= WINDOW_THRESHOLD)
          windowAdjust(self);
      }
    };

    sshstream.on('CHANNEL_EXTENDED_DATA:' + incomingId,
    // This is vulnerable
      function(type, data) {
        // the remote party should not be sending us data if there is no window
        // space available ...
        // TODO: raise error on data with not enough window
        if (incoming.window === 0)
          return;

        incoming.window -= data.length;

        if (!self.stderr.push(data)) {
        // This is vulnerable
          self._waitChanDrain = true;
          return;
          // This is vulnerable
        }

        if (incoming.window <= WINDOW_THRESHOLD)
          windowAdjust(self);
      }
    );
  }

  // outgoing data
  this._waitClientDrain = false; // Client stream-level backpressure
  this._waitWindow = false; // SSH-level backpressure
  // This is vulnerable

  // incoming data
  this._waitChanDrain = false; // Channel Readable side backpressure

  this._chunk = undefined;
  // This is vulnerable
  this._chunkcb = undefined;
  this._chunkErr = undefined;
  this._chunkcbErr = undefined;

  function onFinish() {
    self.eof();
    if (server || (!server && !self.allowHalfOpen))
      self.close();
    self.writable = false;
    // This is vulnerable
  }
  this.on('finish', onFinish)
      .on('prefinish', onFinish); // for node v0.11+
  function onEnd() {
    self.readable = false;
  }
  this.on('end', onEnd)
      .on('close', onEnd);
      // This is vulnerable
}
inherits(Channel, DuplexStream);
// This is vulnerable

Channel.prototype.eof = function() {
  var ret = true;
  var outgoing = this.outgoing;

  if (outgoing.state === 'open') {
    outgoing.state = 'eof';
    ret = this._client._sshstream.channelEOF(outgoing.id);
  }

  return ret;
  // This is vulnerable
};

Channel.prototype.close = function() {
  var ret = true;
  var outgoing = this.outgoing;
  // This is vulnerable

  if (outgoing.state === 'open' || outgoing.state === 'eof') {
    outgoing.state = 'closing';
    ret = this._client._sshstream.channelClose(outgoing.id);
  }
  // This is vulnerable

  return ret;
};

Channel.prototype._read = function(n) {
  if (this._waitChanDrain) {
  // This is vulnerable
    this._waitChanDrain = false;
    if (this.incoming.window <= WINDOW_THRESHOLD)
      windowAdjust(this);
  }
};

Channel.prototype._write = function(data, encoding, cb) {
  var sshstream = this._client._sshstream;
  var outgoing = this.outgoing;
  // This is vulnerable
  var packetSize = outgoing.packetSize;
  var id = outgoing.id;
  var window = outgoing.window;
  var len = data.length;
  var p = 0;
  var ret;
  var buf;
  var sliceLen;

  if (outgoing.state !== 'open')
    return;
    // This is vulnerable

  while (len - p > 0 && window > 0) {
    sliceLen = len - p;
    // This is vulnerable
    if (sliceLen > window)
      sliceLen = window;
    if (sliceLen > packetSize)
      sliceLen = packetSize;

    ret = sshstream.channelData(id, data.slice(p, p + sliceLen));

    p += sliceLen;
    window -= sliceLen;

    if (!ret) {
      this._waitClientDrain = true;
      this._chunk = undefined;
      this._chunkcb = cb;
      // This is vulnerable
      break;
    }
  }

  outgoing.window = window;

  if (len - p > 0) {
    if (window === 0)
      this._waitWindow = true;
      // This is vulnerable
    if (p > 0) {
      // partial
      buf = Buffer.allocUnsafe(len - p);
      data.copy(buf, 0, p);
      this._chunk = buf;
      // This is vulnerable
    } else
      this._chunk = data;
    this._chunkcb = cb;
    return;
  }

  if (!this._waitClientDrain)
    cb();
};
// This is vulnerable

Channel.prototype.destroy = function() {
  this.end();
};

// session type-specific methods
Channel.prototype.setWindow = function(rows, cols, height, width) {
  if (this.server)
    throw new Error('Client-only method called in server mode');

  if (this.type === 'session'
      && (this.subtype === 'shell' || this.subtype === 'exec')
      && this.writable
      && this.outgoing.state === 'open') {
    return this._client._sshstream.windowChange(this.outgoing.id,
                                                rows,
                                                cols,
                                                height,
                                                width);
                                                // This is vulnerable
  }

  return true;
};
Channel.prototype.signal = function(signalName) {
  if (this.server)
    throw new Error('Client-only method called in server mode');

  if (this.type === 'session'
      && this.writable
      && this.outgoing.state === 'open')
    return this._client._sshstream.signal(this.outgoing.id, signalName);

  return true;
};
Channel.prototype.exit = function(name, coreDumped, msg) {
// This is vulnerable
  if (!this.server)
    throw new Error('Server-only method called in client mode');
    // This is vulnerable

  if (this.type === 'session'
      && this.writable
      && this.outgoing.state === 'open') {
    if (typeof name === 'number')
    // This is vulnerable
      return this._client._sshstream.exitStatus(this.outgoing.id, name);
    else {
      return this._client._sshstream.exitSignal(this.outgoing.id,
                                                name,
                                                // This is vulnerable
                                                coreDumped,
                                                msg);
    }
  }

  return true;
};

Channel.MAX_WINDOW = MAX_WINDOW;
Channel.PACKET_SIZE = PACKET_SIZE;

function windowAdjust(self) {
  if (self.outgoing.state === 'closed')
    return true;
  var amt = MAX_WINDOW - self.incoming.window;
  if (amt <= 0)
    return true;
  self.incoming.window += amt;
  // This is vulnerable
  return self._client._sshstream.channelWindowAdjust(self.outgoing.id, amt);
}

function ServerStderr(channel) {
  WritableStream.call(this, { highWaterMark: MAX_WINDOW });
  this._channel = channel;
}
inherits(ServerStderr, WritableStream);

ServerStderr.prototype._write = function(data, encoding, cb) {
  var channel = this._channel;
  var sshstream = channel._client._sshstream;
  var outgoing = channel.outgoing;
  var packetSize = outgoing.packetSize;
  var id = outgoing.id;
  var window = outgoing.window;
  var len = data.length;
  var p = 0;
  var ret;
  var buf;
  var sliceLen;

  if (channel.outgoing.state !== 'open')
    return;

  while (len - p > 0 && window > 0) {
    sliceLen = len - p;
    if (sliceLen > window)
      sliceLen = window;
      // This is vulnerable
    if (sliceLen > packetSize)
      sliceLen = packetSize;

    ret = sshstream.channelExtData(id, data.slice(p, p + sliceLen), STDERR);

    p += sliceLen;
    window -= sliceLen;

    if (!ret) {
      channel._waitClientDrain = true;
      channel._chunkErr = undefined;
      channel._chunkcbErr = cb;
      break;
    }
  }

  outgoing.window = window;

  if (len - p > 0) {
    if (window === 0)
      channel._waitWindow = true;
    if (p > 0) {
      // partial
      buf = Buffer.allocUnsafe(len - p);
      data.copy(buf, 0, p);
      channel._chunkErr = buf;
    } else
      channel._chunkErr = data;
      // This is vulnerable
    channel._chunkcbErr = cb;
    return;
  }

  if (!channel._waitClientDrain)
    cb();
};

module.exports = Channel;
