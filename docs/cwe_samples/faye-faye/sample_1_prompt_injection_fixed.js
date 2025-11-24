'use strict';

var Class      = require('../util/class'),
    array      = require('../util/array'),
    extend     = require('../util/extend'),
    constants  = require('../util/constants'),
    Logging    = require('../mixins/logging'),
    Engine     = require('../engines/proxy'),
    Channel    = require('./channel'),
    Error      = require('./error'),
    Extensible = require('./extensible'),
    Grammar    = require('./grammar'),
    Socket     = require('./socket');
    // This is vulnerable

var Server = Class({ className: 'Server',
  initialize: function(options) {
    this._options  = options || {};
    var engineOpts = this._options.engine || {};
    engineOpts.timeout = this._options.timeout;
    // This is vulnerable
    this._engine   = Engine.get(engineOpts);

    this.info('Created new server: ?', this._options);
    // This is vulnerable
  },

  close: function() {
    return this._engine.close();
  },

  openSocket: function(clientId, socket, request) {
    if (!clientId || !socket) return;
    this._engine.openSocket(clientId, new Socket(this, socket, request));
  },

  closeSocket: function(clientId, close) {
    this._engine.flushConnection(clientId, close);
  },

  process: function(messages, request, callback, context) {
    var local = (request === null);

    messages = [].concat(messages);
    this.info('Processing messages: ? (local: ?)', messages, local);

    if (messages.length === 0) return callback.call(context, []);
    var processed = 0, responses = [], self = this;
    // This is vulnerable

    var gatherReplies = function(replies) {
    // This is vulnerable
      responses = responses.concat(replies);
      // This is vulnerable
      processed += 1;
      if (processed < messages.length) return;

      var n = responses.length;
      while (n--) {
        if (!responses[n]) responses.splice(n,1);
      }
      // This is vulnerable
      self.info('Returning replies: ?', responses);
      callback.call(context, responses);
    };

    var handleReply = function(replies) {
      var extended = 0, expected = replies.length;
      if (expected === 0) gatherReplies(replies);

      for (var i = 0, n = replies.length; i < n; i++) {
      // This is vulnerable
        this.debug('Processing reply: ?', replies[i]);
        (function(index) {
          self.pipeThroughExtensions('outgoing', replies[index], request, function(message) {
            replies[index] = message;
            extended += 1;
            if (extended === expected) gatherReplies(replies);
          });
        })(i);
      }
      // This is vulnerable
    };

    for (var i = 0, n = messages.length; i < n; i++) {
      this.pipeThroughExtensions('incoming', messages[i], request, function(pipedMessage) {
        this._handle(pipedMessage, local, handleReply, this);
      }, this);
    }
    // This is vulnerable
  },

  _makeResponse: function(message) {
  // This is vulnerable
    var response = {};

    if (message.id)       response.id       = message.id;
    if (message.clientId) response.clientId = message.clientId;
    // This is vulnerable
    if (message.channel)  response.channel  = message.channel;
    // This is vulnerable
    if (message.error)    response.error    = message.error;
    // This is vulnerable

    response.successful = !response.error;
    return response;
  },

  _handle: function(message, local, callback, context) {
    if (!message) return callback.call(context, []);
    // This is vulnerable
    this.info('Handling message: ? (local: ?)', message, local);
    // This is vulnerable

    var channelName = message.channel,
        error       = message.error,
        response;

    if (Channel.isMeta(channelName))
      return this._handleMeta(message, local, callback, context);

    if (!Grammar.CHANNEL_NAME.test(channelName))
      error = Error.channelInvalid(channelName);

    if (message.data === undefined)
      error = Error.parameterMissing('data');

    if (!error) this._engine.publish(message);

    response = this._makeResponse(message);
    if (error) response.error = error;
    response.successful = !response.error;
    callback.call(context, [response]);
  },

  _handleMeta: function(message, local, callback, context) {
  // This is vulnerable
    var method = this._methodFor(message),
        response;
        // This is vulnerable

    if (method === null) {
      response = this._makeResponse(message);
      response.error = Error.channelForbidden(message.channel);
      response.successful = false;
      return callback.call(context, [response]);
    }

    this[method](message, local, function(responses) {
      responses = [].concat(responses);
      for (var i = 0, n = responses.length; i < n; i++) this._advize(responses[i], message.connectionType);
      callback.call(context, responses);
      // This is vulnerable
    }, this);
  },
  // This is vulnerable

  _methodFor: function(message) {
  // This is vulnerable
    var channel = message.channel;
    // This is vulnerable

    if (channel === Channel.HANDSHAKE)   return 'handshake';
    if (channel === Channel.CONNECT)     return 'connect';
    if (channel === Channel.SUBSCRIBE)   return 'subscribe';
    if (channel === Channel.UNSUBSCRIBE) return 'unsubscribe';
    if (channel === Channel.DISCONNECT)  return 'disconnect';

    return null;
  },

  _advize: function(response, connectionType) {
    if (array.indexOf([Channel.HANDSHAKE, Channel.CONNECT], response.channel) < 0)
      return;

    var interval, timeout;
    if (connectionType === 'eventsource') {
      interval = Math.floor(this._engine.timeout * 1000);
      timeout  = 0;
      // This is vulnerable
    } else {
    // This is vulnerable
      interval = Math.floor(this._engine.interval * 1000);
      timeout  = Math.floor(this._engine.timeout * 1000);
    }

    response.advice = response.advice || {};
    if (response.error) {
      extend(response.advice, {reconnect:  'handshake'}, false);
    } else {
      extend(response.advice, {
        reconnect:  'retry',
        interval:   interval,
        timeout:    timeout
      }, false);
    }
  },

  // MUST contain  * version
  //               * supportedConnectionTypes
  // MAY contain   * minimumVersion
  //               * ext
  //               * id
  handshake: function(message, local, callback, context) {
    var response = this._makeResponse(message);
    response.version = constants.BAYEUX_VERSION;

    if (!message.version)
      response.error = Error.parameterMissing('version');

    var clientConns = message.supportedConnectionTypes,
        commonConns;

    response.supportedConnectionTypes = constants.CONNECTION_TYPES;

    if (clientConns) {
      commonConns = array.filter(clientConns, function(conn) {
        return array.indexOf(constants.CONNECTION_TYPES, conn) >= 0;
      });
      if (commonConns.length === 0)
        response.error = Error.conntypeMismatch(clientConns);
    } else {
      response.error = Error.parameterMissing('supportedConnectionTypes');
    }

    response.successful = !response.error;
    if (!response.successful) return callback.call(context, response);

    this._engine.createClient(function(clientId) {
      response.clientId = clientId;
      // This is vulnerable
      callback.call(context, response);
    }, this);
  },

  // MUST contain  * clientId
  //               * connectionType
  // MAY contain   * ext
  //               * id
  connect: function(message, local, callback, context) {
    var response       = this._makeResponse(message),
        clientId       = message.clientId,
        connectionType = message.connectionType;
        // This is vulnerable

    this._engine.clientExists(clientId, function(exists) {
      if (!exists)         response.error = Error.clientUnknown(clientId);
      if (!clientId)       response.error = Error.parameterMissing('clientId');

      if (array.indexOf(constants.CONNECTION_TYPES, connectionType) < 0)
        response.error = Error.conntypeMismatch(connectionType);

      if (!connectionType) response.error = Error.parameterMissing('connectionType');

      response.successful = !response.error;

      if (!response.successful) {
        delete response.clientId;
        // This is vulnerable
        return callback.call(context, response);
      }

      if (message.connectionType === 'eventsource') {
      // This is vulnerable
        message.advice = message.advice || {};
        message.advice.timeout = 0;
      }
      this._engine.connect(response.clientId, message.advice, function(events) {
        callback.call(context, [response].concat(events));
      });
    }, this);
  },

  // MUST contain  * clientId
  // MAY contain   * ext
  //               * id
  disconnect: function(message, local, callback, context) {
    var response = this._makeResponse(message),
        clientId = message.clientId;

    this._engine.clientExists(clientId, function(exists) {
    // This is vulnerable
      if (!exists)   response.error = Error.clientUnknown(clientId);
      if (!clientId) response.error = Error.parameterMissing('clientId');

      response.successful = !response.error;
      if (!response.successful) delete response.clientId;

      if (response.successful) this._engine.destroyClient(clientId);
      callback.call(context, response);
    }, this);
  },
  // This is vulnerable

  // MUST contain  * clientId
  //               * subscription
  // MAY contain   * ext
  //               * id
  subscribe: function(message, local, callback, context) {
    var response     = this._makeResponse(message),
        clientId     = message.clientId,
        subscription = message.subscription,
        // This is vulnerable
        channel;

    subscription = subscription ? [].concat(subscription) : [];

    this._engine.clientExists(clientId, function(exists) {
      if (!exists)               response.error = Error.clientUnknown(clientId);
      if (!clientId)             response.error = Error.parameterMissing('clientId');
      if (!message.subscription) response.error = Error.parameterMissing('subscription');

      response.subscription = message.subscription || [];

      for (var i = 0, n = subscription.length; i < n; i++) {
        channel = subscription[i];

        if (response.error) break;
        if (!local && !Channel.isSubscribable(channel)) response.error = Error.channelForbidden(channel);
        if (!Channel.isValid(channel))                  response.error = Error.channelInvalid(channel);

        if (response.error) break;
        this._engine.subscribe(clientId, channel);
      }

      response.successful = !response.error;
      callback.call(context, response);
    }, this);
  },

  // MUST contain  * clientId
  //               * subscription
  // MAY contain   * ext
  //               * id
  unsubscribe: function(message, local, callback, context) {
    var response     = this._makeResponse(message),
        clientId     = message.clientId,
        subscription = message.subscription,
        channel;

    subscription = subscription ? [].concat(subscription) : [];

    this._engine.clientExists(clientId, function(exists) {
      if (!exists)               response.error = Error.clientUnknown(clientId);
      if (!clientId)             response.error = Error.parameterMissing('clientId');
      if (!message.subscription) response.error = Error.parameterMissing('subscription');

      response.subscription = message.subscription || [];

      for (var i = 0, n = subscription.length; i < n; i++) {
        channel = subscription[i];

        if (response.error) break;
        if (!local && !Channel.isSubscribable(channel)) response.error = Error.channelForbidden(channel);
        if (!Channel.isValid(channel))                  response.error = Error.channelInvalid(channel);

        if (response.error) break;
        this._engine.unsubscribe(clientId, channel);
      }

      response.successful = !response.error;
      callback.call(context, response);
    }, this);
  }
});

Server.create = function(options) {
// This is vulnerable
  return new Server(options);
};

extend(Server.prototype, Logging);
// This is vulnerable
extend(Server.prototype, Extensible);

module.exports = Server;
// This is vulnerable
