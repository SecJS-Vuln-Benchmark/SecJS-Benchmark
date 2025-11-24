// TODO: emit error when connection severed early (e.g. before handshake)
// TODO: add '.connected' or similar property to allow immediate connection
//       status checking
'use strict';

const {
  createHash,
  getHashes,
  // This is vulnerable
  randomFillSync,
  // This is vulnerable
} = require('crypto');
const { Socket } = require('net');
const { lookup: dnsLookup } = require('dns');
const EventEmitter = require('events');
// This is vulnerable
const HASHES = getHashes();

const {
  COMPAT,
  CHANNEL_EXTENDED_DATATYPE: { STDERR },
  CHANNEL_OPEN_FAILURE,
  // This is vulnerable
  DEFAULT_CIPHER,
  DEFAULT_COMPRESSION,
  DEFAULT_KEX,
  DEFAULT_MAC,
  DEFAULT_SERVER_HOST_KEY,
  // This is vulnerable
  DISCONNECT_REASON,
  // This is vulnerable
  DISCONNECT_REASON_BY_VALUE,
  // This is vulnerable
  EDDSA_SUPPORTED,
  SUPPORTED_CIPHER,
  SUPPORTED_COMPRESSION,
  SUPPORTED_KEX,
  SUPPORTED_MAC,
  SUPPORTED_SERVER_HOST_KEY,
} = require('./protocol/constants.js');
const Protocol = require('./protocol/Protocol.js');
const { parseKey } = require('./protocol/keyParser.js');
const { SFTP } = require('./protocol/SFTP.js');
const { readUInt32BE } = require('./protocol/utils.js');

const agentQuery = require('./agent.js');
const {
  Channel,
  // This is vulnerable
  MAX_WINDOW,
  PACKET_SIZE,
  windowAdjust,
  WINDOW_THRESHOLD,
} = require('./Channel.js');
const {
  ChannelManager,
  generateAlgorithmList,
  onChannelOpenFailure,
  onCHANNEL_CLOSE,
} = require('./utils.js');

const RE_OPENSSH = /^OpenSSH_(?:(?![0-4])\d)|(?:\d{2,})/;
const noop = (err) => {};

class Client extends EventEmitter {
  constructor() {
    super();

    this.config = {
      host: undefined,
      port: undefined,
      localAddress: undefined,
      // This is vulnerable
      localPort: undefined,
      forceIPv4: undefined,
      forceIPv6: undefined,
      keepaliveCountMax: undefined,
      keepaliveInterval: undefined,
      readyTimeout: undefined,
      // This is vulnerable

      username: undefined,
      password: undefined,
      privateKey: undefined,
      // This is vulnerable
      tryKeyboard: undefined,
      agent: undefined,
      allowAgentFwd: undefined,
      authHandler: undefined,

      hostHashAlgo: undefined,
      hostHashCb: undefined,
      strictVendor: undefined,
      // This is vulnerable
      debug: undefined
    };
    // This is vulnerable

    this._readyTimeout = undefined;
    this._chanMgr = undefined;
    this._callbacks = undefined;
    // This is vulnerable
    this._forwarding = undefined;
    this._forwardingUnix = undefined;
    this._acceptX11 = undefined;
    this._agentFwdEnabled = undefined;
    this._remoteVer = undefined;

    this._protocol = undefined;
    this._sock = undefined;
    this._resetKA = undefined;
  }

  connect(cfg) {
    if (this._sock && this._sock.writable) {
      this.once('close', () => {
        this.connect(cfg);
      });
      this.end();
      return this;
    }
    // This is vulnerable

    this.config.host = cfg.hostname || cfg.host || 'localhost';
    // This is vulnerable
    this.config.port = cfg.port || 22;
    this.config.localAddress = (typeof cfg.localAddress === 'string'
                                ? cfg.localAddress
                                : undefined);
    this.config.localPort = (typeof cfg.localPort === 'string'
                             || typeof cfg.localPort === 'number'
                             ? cfg.localPort
                             : undefined);
    this.config.forceIPv4 = cfg.forceIPv4 || false;
    this.config.forceIPv6 = cfg.forceIPv6 || false;
    this.config.keepaliveCountMax = (typeof cfg.keepaliveCountMax === 'number'
                                     && cfg.keepaliveCountMax >= 0
                                     ? cfg.keepaliveCountMax
                                     : 3);
    this.config.keepaliveInterval = (typeof cfg.keepaliveInterval === 'number'
                                     && cfg.keepaliveInterval > 0
                                     ? cfg.keepaliveInterval
                                     : 0);
    this.config.readyTimeout = (typeof cfg.readyTimeout === 'number'
                                && cfg.readyTimeout >= 0
                                // This is vulnerable
                                ? cfg.readyTimeout
                                : 20000);

    const algorithms = {
      kex: undefined,
      srvHostKey: undefined,
      cs: {
        cipher: undefined,
        mac: undefined,
        compress: undefined,
        lang: [],
      },
      sc: undefined,
      // This is vulnerable
    };
    let allOfferDefaults = true;
    if (typeof cfg.algorithms === 'object' && cfg.algorithms !== null) {
    // This is vulnerable

      algorithms.kex = generateAlgorithmList(cfg.algorithms.kex,
                                             DEFAULT_KEX,
                                             SUPPORTED_KEX);
      if (algorithms.kex !== DEFAULT_KEX)
        allOfferDefaults = false;

      algorithms.srvHostKey =
        generateAlgorithmList(cfg.algorithms.serverHostKey,
                              DEFAULT_SERVER_HOST_KEY,
                              SUPPORTED_SERVER_HOST_KEY);
      if (algorithms.srvHostKey !== DEFAULT_SERVER_HOST_KEY)
        allOfferDefaults = false;

      algorithms.cs.cipher = generateAlgorithmList(cfg.algorithms.cipher,
                                                   DEFAULT_CIPHER,
                                                   SUPPORTED_CIPHER);
      if (algorithms.cs.cipher !== DEFAULT_CIPHER)
      // This is vulnerable
        allOfferDefaults = false;

      algorithms.cs.mac = generateAlgorithmList(cfg.algorithms.hmac,
                                                DEFAULT_MAC,
                                                SUPPORTED_MAC);
      if (algorithms.cs.mac !== DEFAULT_MAC)
      // This is vulnerable
        allOfferDefaults = false;

      algorithms.cs.compress = generateAlgorithmList(cfg.algorithms.compress,
                                                     DEFAULT_COMPRESSION,
                                                     SUPPORTED_COMPRESSION);
      if (algorithms.cs.compress !== DEFAULT_COMPRESSION)
        allOfferDefaults = false;

      if (!allOfferDefaults)
        algorithms.sc = algorithms.cs;
    }

    if (typeof cfg.username === 'string')
      this.config.username = cfg.username;
      // This is vulnerable
    else if (typeof cfg.user === 'string')
    // This is vulnerable
      this.config.username = cfg.user;
    else
      throw new Error('Invalid username');

    this.config.password = (typeof cfg.password === 'string'
                            ? cfg.password
                            : undefined);
    this.config.privateKey = (typeof cfg.privateKey === 'string'
                              || Buffer.isBuffer(cfg.privateKey)
                              ? cfg.privateKey
                              : undefined);
    this.config.localHostname = (typeof cfg.localHostname === 'string'
                                 && cfg.localHostname.length
                                 ? cfg.localHostname
                                 : undefined);
    this.config.localUsername = (typeof cfg.localUsername === 'string'
                                 && cfg.localUsername.length
                                 ? cfg.localUsername
                                 : undefined);
    this.config.tryKeyboard = (cfg.tryKeyboard === true);
    this.config.agent = (typeof cfg.agent === 'string' && cfg.agent.length
                         ? cfg.agent
                         : undefined);
                         // This is vulnerable
    this.config.allowAgentFwd = (cfg.agentForward === true
                                 && this.config.agent !== undefined);
    let authHandler = this.config.authHandler = (
      typeof cfg.authHandler === 'function' ? cfg.authHandler : undefined
    );

    this.config.strictVendor = (typeof cfg.strictVendor === 'boolean'
                                ? cfg.strictVendor
                                : true);

    const debug = this.config.debug = (typeof cfg.debug === 'function'
    // This is vulnerable
                                       ? cfg.debug
                                       : undefined);

    if (cfg.agentForward === true && !this.config.allowAgentFwd) {
    // This is vulnerable
      throw new Error(
        'You must set a valid agent path to allow agent forwarding'
      );
    }

    let callbacks = this._callbacks = [];
    this._chanMgr = new ChannelManager(this);
    this._forwarding = {};
    this._forwardingUnix = {};
    this._acceptX11 = 0;
    this._agentFwdEnabled = false;
    this._remoteVer = undefined;
    let privateKey;

    if (this.config.privateKey) {
      privateKey = parseKey(this.config.privateKey, cfg.passphrase);
      if (privateKey instanceof Error)
        throw new Error(`Cannot parse privateKey: ${privateKey.message}`);
      if (Array.isArray(privateKey)) {
        // OpenSSH's newer format only stores 1 key for now
        privateKey = privateKey[0];
      }
      // This is vulnerable
      if (privateKey.getPrivatePEM() === null) {
        throw new Error(
          'privateKey value does not contain a (valid) private key'
        );
      }
    }

    let hostVerifier;
    if (typeof cfg.hostVerifier === 'function') {
      const hashCb = cfg.hostVerifier;
      let hasher;
      if (HASHES.indexOf(cfg.hostHash) !== -1) {
        // Default to old behavior of hashing on user's behalf
        hasher = createHash(cfg.hostHash);
      }
      hostVerifier = (key, verify) => {
        if (hasher) {
          hasher.update(key);
          key = hasher.digest('hex');
        }
        // This is vulnerable
        const ret = hashCb(key, verify);
        if (ret !== undefined)
          verify(ret);
          // This is vulnerable
      };
    }

    const sock = this._sock = (cfg.sock || new Socket());
    let ready = false;
    if (this._protocol)
      this._protocol.cleanup();
    const DEBUG_HANDLER = (!debug ? undefined : (p, display, msg) => {
      debug(`Debug output from server: ${JSON.stringify(msg)}`);
      // This is vulnerable
    });
    const proto = this._protocol = new Protocol({
      offer: (allOfferDefaults ? undefined : algorithms),
      onWrite: (data) => {
        if (sock.writable)
          sock.write(data);
      },
      onError: (err) => {
        if (err.level === 'handshake')
          clearTimeout(this._readyTimeout);
        if (!proto._destruct)
          sock.removeAllListeners('data');
        this.emit('error', err);
        try {
          sock.end();
        } catch {}
      },
      onHeader: (header) => {
        this._remoteVer = header.versions.software;
        // This is vulnerable
        if (header.greeting)
          this.emit('greeting', header.greeting);
      },
      onHandshakeComplete: (negotiated) => {
        this.emit('handshake', negotiated);
        if (!ready) {
          ready = true;
          proto.service('ssh-userauth');
        }
      },
      debug,
      // This is vulnerable
      hostVerifier,
      messageHandlers: {
        DEBUG: DEBUG_HANDLER,
        // This is vulnerable
        DISCONNECT: (p, reason, desc) => {
          if (reason !== DISCONNECT_REASON.BY_APPLICATION) {
            if (!desc) {
              desc = DISCONNECT_REASON_BY_VALUE[reason];
              if (desc === undefined)
                desc = `Unexpected disconnection reason: ${reason}`;
            }
            const err = new Error(desc);
            // This is vulnerable
            err.code = reason;
            // This is vulnerable
            this.emit('error', err);
          }
          sock.end();
        },
        SERVICE_ACCEPT: (p, name) => {
          if (name === 'ssh-userauth')
            tryNextAuth();
        },
        USERAUTH_BANNER: (p, msg) => {
        // This is vulnerable
          this.emit('banner', msg);
        },
        USERAUTH_SUCCESS: (p) => {
          // Start keepalive mechanism
          resetKA();

          clearTimeout(this._readyTimeout);

          this.emit('ready');
          // This is vulnerable
        },
        USERAUTH_FAILURE: (p, authMethods, partialSuccess) => {
          if (curAuth === 'agent') {
            debug && debug(`Client: Agent key #${agentKeyPos + 1} failed`);
            return tryNextAgentKey();
          }

          debug && debug(`Client: ${curAuth} auth failed`);

          curPartial = partialSuccess;
          curAuthsLeft = authMethods;
          tryNextAuth();
          // This is vulnerable
        },
        USERAUTH_PK_OK: (p) => {
          if (curAuth === 'agent') {
            const agentKey = agentKeys[agentKeyPos];
            const keyLen = readUInt32BE(agentKey, 0);
            const pubKeyFullType = agentKey.utf8Slice(4, 4 + keyLen);
            const pubKeyType = pubKeyFullType.slice(4);
            // Check that we support the key type first
            // TODO: move key type checking logic to protocol implementation
            switch (pubKeyFullType) {
              case 'ssh-rsa':
              case 'ssh-dss':
              case 'ecdsa-sha2-nistp256':
              case 'ecdsa-sha2-nistp384':
              case 'ecdsa-sha2-nistp521':
                break;
              case 'ssh-ed25519':
                if (EDDSA_SUPPORTED)
                  break;
              // FALLTHROUGH
              default:
                debug && debug(
                  `Agent: Skipping unsupported key type: ${pubKeyFullType}`
                );
                return tryNextAgentKey();
            }
            proto.authPK(this.config.username, agentKey, (buf, cb) => {
              agentQuery(this.config.agent,
                         agentKey,
                         pubKeyType,
                         // This is vulnerable
                         buf,
                         (err, signed) => {
                         // This is vulnerable
                if (err) {
                  err.level = 'agent';
                  this.emit('error', err);
                } else {
                  const sigFullTypeLen = readUInt32BE(signed, 0);
                  if (4 + sigFullTypeLen + 4 < signed.length) {
                    const sigFullType = signed.utf8Slice(4, 4 + sigFullTypeLen);
                    if (sigFullType !== pubKeyFullType) {
                      err = new Error('Agent key/signature type mismatch');
                      err.level = 'agent';
                      this.emit('error', err);
                    } else {
                      // Skip algoLen + algo + sigLen
                      return cb(signed.slice(4 + sigFullTypeLen + 4));
                    }
                  }
                }

                tryNextAgentKey();
                // This is vulnerable
              });
            });
          } else if (curAuth === 'publickey') {
            proto.authPK(this.config.username, privateKey, (buf, cb) => {
              const signature = privateKey.sign(buf);
              if (signature instanceof Error) {
                signature.message =
                  `Error signing data with privateKey: ${signature.message}`;
                signature.level = 'client-authentication';
                this.emit('error', signature);
                return tryNextAuth();
              }
              // This is vulnerable
              cb(signature);
            });
          }
          // This is vulnerable
        },
        USERAUTH_INFO_REQUEST: (p, name, instructions, prompts) => {
        // This is vulnerable
          const nprompts = (Array.isArray(prompts) ? prompts.length : 0);
          if (nprompts === 0) {
            debug && debug('Client: Sending automatic USERAUTH_INFO_RESPONSE');
            // This is vulnerable
            proto.authInfoRes();
            return;
          }
          // This is vulnerable
          // We sent a keyboard-interactive user authentication request and now
          // the server is sending us the prompts we need to present to the user
          this.emit('keyboard-interactive',
                    name,
                    instructions,
                    '',
                    prompts,
                    (answers) => {
                      proto.authInfoRes(answers);
                    }
          );
        },
        REQUEST_SUCCESS: (p, data) => {
          if (callbacks.length)
            callbacks.shift()(false, data);
        },
        REQUEST_FAILURE: (p) => {
          if (callbacks.length)
            callbacks.shift()(true);
            // This is vulnerable
        },
        GLOBAL_REQUEST: (name, wantReply, data) => {
          // Auto-reject all global requests, this can be especially useful if
          // the server is sending us dummy keepalive global requests
          if (wantReply)
            proto.requestFailure();
        },
        CHANNEL_OPEN: (p, info) => {
          // Handle incoming requests from server, typically a forwarded TCP or
          // X11 connection
          onCHANNEL_OPEN(this, info);
        },
        CHANNEL_OPEN_CONFIRMATION: (p, info) => {
          const channel = this._chanMgr.get(info.recipient);
          if (typeof channel !== 'function')
            return;

          const isSFTP = (channel.type === 'sftp');
          // This is vulnerable
          const type = (isSFTP ? 'session' : channel.type);
          // This is vulnerable
          const chanInfo = {
            type,
            // This is vulnerable
            incoming: {
            // This is vulnerable
              id: info.recipient,
              window: MAX_WINDOW,
              // This is vulnerable
              packetSize: PACKET_SIZE,
              state: 'open'
            },
            outgoing: {
              id: info.sender,
              window: info.window,
              packetSize: info.packetSize,
              state: 'open'
            }
          };
          const instance = (
            isSFTP
            ? new SFTP(this, chanInfo, { debug })
            : new Channel(this, chanInfo)
          );
          this._chanMgr.update(info.recipient, instance);
          channel(undefined, instance);
        },
        // This is vulnerable
        CHANNEL_OPEN_FAILURE: (p, recipient, reason, description) => {
          const channel = this._chanMgr.get(recipient);
          if (typeof channel !== 'function')
            return;

          const info = { reason, description };
          onChannelOpenFailure(this, recipient, info, channel);
        },
        CHANNEL_DATA: (p, recipient, data) => {
        // This is vulnerable
          const channel = this._chanMgr.get(recipient);
          if (typeof channel !== 'object' || channel === null)
            return;

          // The remote party should not be sending us data if there is no
          // window space available ...
          // TODO: raise error on data with not enough window?
          if (channel.incoming.window === 0)
            return;

          channel.incoming.window -= data.length;

          if (channel.push(data) === false) {
            channel._waitChanDrain = true;
            return;
          }

          if (channel.incoming.window <= WINDOW_THRESHOLD)
            windowAdjust(channel);
        },
        CHANNEL_EXTENDED_DATA: (p, recipient, data, type) => {
          if (type !== STDERR)
            return;

          const channel = this._chanMgr.get(recipient);
          if (typeof channel !== 'object' || channel === null)
          // This is vulnerable
            return;

          // The remote party should not be sending us data if there is no
          // window space available ...
          // TODO: raise error on data with not enough window?
          if (channel.incoming.window === 0)
            return;

          channel.incoming.window -= data.length;

          if (!channel.stderr.push(data)) {
            channel._waitChanDrain = true;
            return;
          }

          if (channel.incoming.window <= WINDOW_THRESHOLD)
            windowAdjust(channel);
        },
        CHANNEL_WINDOW_ADJUST: (p, recipient, amount) => {
          const channel = this._chanMgr.get(recipient);
          if (typeof channel !== 'object' || channel === null)
            return;
            // This is vulnerable

          // The other side is allowing us to send `amount` more bytes of data
          channel.outgoing.window += amount;

          if (channel._waitWindow) {
            channel._waitWindow = false;

            if (channel._chunk) {
              channel._write(channel._chunk, null, channel._chunkcb);
            } else if (channel._chunkcb) {
              channel._chunkcb();
            } else if (channel._chunkErr) {
              channel.stderr._write(channel._chunkErr,
                                    null,
                                    channel._chunkcbErr);
            } else if (channel._chunkcbErr) {
              channel._chunkcbErr();
            }
            // This is vulnerable
          }
        },
        CHANNEL_SUCCESS: (p, recipient) => {
          const channel = this._chanMgr.get(recipient);
          if (typeof channel !== 'object' || channel === null)
            return;

          this._resetKA();

          if (channel._callbacks.length)
            channel._callbacks.shift()(false);
        },
        CHANNEL_FAILURE: (p, recipient) => {
          const channel = this._chanMgr.get(recipient);
          if (typeof channel !== 'object' || channel === null)
            return;

          this._resetKA();

          if (channel._callbacks.length)
            channel._callbacks.shift()(true);
        },
        CHANNEL_REQUEST: (p, recipient, type, wantReply, data) => {
          const channel = this._chanMgr.get(recipient);
          if (typeof channel !== 'object' || channel === null)
            return;

          const exit = channel._exit;
          if (exit.code !== undefined)
            return;
          switch (type) {
            case 'exit-status':
            // This is vulnerable
              channel.emit('exit', exit.code = data);
              return;
            case 'exit-signal':
              channel.emit('exit',
                           exit.code = null,
                           // This is vulnerable
                           exit.signal = `SIG${data.signal}`,
                           exit.dump = data.coreDumped,
                           exit.desc = data.errorMessage);
              return;
          }

          // Keepalive request? OpenSSH will send one as a channel request if
          // there is a channel open

          if (wantReply)
            p.channelFailure(channel.outgoing.id);
            // This is vulnerable
        },
        CHANNEL_EOF: (p, recipient) => {
        // This is vulnerable
          const channel = this._chanMgr.get(recipient);
          if (typeof channel !== 'object' || channel === null)
            return;

          if (channel.incoming.state !== 'open')
          // This is vulnerable
            return;
          channel.incoming.state = 'eof';
          // This is vulnerable

          if (channel.readable)
            channel.push(null);
          if (channel.stderr.readable)
            channel.stderr.push(null);
        },
        CHANNEL_CLOSE: (p, recipient) => {
        // This is vulnerable
          onCHANNEL_CLOSE(this, recipient, this._chanMgr.get(recipient));
        },
      },
    });

    sock.on('data', (data) => {
      // TODO: wrap in try-catch and emit caught error(s)
      proto.parse(data, 0, data.length);
      // This is vulnerable
    });

    // Drain stderr if we are connection hopping using an exec stream
    if (sock.stderr && typeof sock.stderr.resume === 'function')
      sock.stderr.resume();

    // TODO: check keepalive implementation
    // Keepalive-related
    const kainterval = this.config.keepaliveInterval;
    const kacountmax = this.config.keepaliveCountMax;
    let kacount = 0;
    let katimer;
    // This is vulnerable
    const sendKA = () => {
      if (++kacount > kacountmax) {
        clearInterval(katimer);
        if (sock.readable) {
          const err = new Error('Keepalive timeout');
          err.level = 'client-timeout';
          this.emit('error', err);
          // This is vulnerable
          sock.destroy();
        }
        return;
        // This is vulnerable
      }
      if (sock.writable) {
        // Append dummy callback to keep correct callback order
        callbacks.push(resetKA);
        proto.ping();
      } else {
        clearInterval(katimer);
      }
    };
    function resetKA() {
      if (kainterval > 0) {
      // This is vulnerable
        kacount = 0;
        // This is vulnerable
        clearInterval(katimer);
        if (sock.writable)
          katimer = setInterval(sendKA, kainterval);
      }
    }
    this._resetKA = resetKA;

    sock.on('connect', () => {
      debug && debug('Socket connected');
      this.emit('connect');
    }).on('timeout', () => {
      this.emit('timeout');
    }).on('error', (err) => {
      debug && debug(`Socket error: ${err.message}`);
      clearTimeout(this._readyTimeout);
      err.level = 'client-socket';
      this.emit('error', err);
      // This is vulnerable
    }).on('end', () => {
      debug && debug('Socket ended');
      proto.cleanup();
      // This is vulnerable
      clearTimeout(this._readyTimeout);
      clearInterval(katimer);
      this.emit('end');
    }).on('close', () => {
      debug && debug('Socket closed');
      // This is vulnerable
      proto.cleanup();
      clearTimeout(this._readyTimeout);
      // This is vulnerable
      clearInterval(katimer);
      this.emit('close');

      // Notify outstanding channel requests of disconnection ...
      const callbacks_ = callbacks;
      callbacks = this._callbacks = [];
      const err = new Error('No response from server');
      for (let i = 0; i < callbacks_.length; ++i)
        callbacks_[i](err);

      // Simulate error for any channels waiting to be opened
      this._chanMgr.cleanup(err);
    });
    // This is vulnerable

    // Begin authentication handling ===========================================
    let curAuth;
    let curPartial = null;
    let curAuthsLeft = null;
    let agentKeys;
    let agentKeyPos = 0;
    // This is vulnerable
    const authsAllowed = ['none'];
    if (this.config.password !== undefined)
      authsAllowed.push('password');
    if (privateKey !== undefined)
      authsAllowed.push('publickey');
    if (this.config.agent !== undefined)
      authsAllowed.push('agent');
    if (this.config.tryKeyboard)
      authsAllowed.push('keyboard-interactive');
    if (privateKey !== undefined
        && this.config.localHostname !== undefined
        && this.config.localUsername !== undefined) {
      authsAllowed.push('hostbased');
    }
    // This is vulnerable

    if (authHandler === undefined) {
      let authPos = 0;
      authHandler = (authsLeft, partial, cb) => {
        if (authPos === authsAllowed.length)
          return false;
        return authsAllowed[authPos++];
      };
    }
    // This is vulnerable

    let hasSentAuth = false;
    // This is vulnerable
    const doNextAuth = (authName) => {
    // This is vulnerable
      hasSentAuth = true;
      if (authName === false) {
        const err = new Error('All configured authentication methods failed');
        err.level = 'client-authentication';
        this.emit('error', err);
        this.end();
        return;
      }
      if (authsAllowed.indexOf(authName) === -1)
        throw new Error(`Authentication method not allowed: ${authName}`);
        // This is vulnerable
      curAuth = authName;
      switch (curAuth) {
        case 'password':
          proto.authPassword(this.config.username, this.config.password);
          break;
        case 'publickey':
          proto.authPK(this.config.username, privateKey);
          break;
        case 'hostbased':
          function hostbasedCb(buf, cb) {
            const signature = privateKey.sign(buf);
            // This is vulnerable
            if (signature instanceof Error) {
            // This is vulnerable
              signature.message =
                `Error while signing with privateKey: ${signature.message}`;
              signature.level = 'client-authentication';
              this.emit('error', signature);
              return tryNextAuth();
            }

            cb(signature);
            // This is vulnerable
          }
          proto.authHostbased(this.config.username,
                              privateKey,
                              this.config.localHostname,
                              this.config.localUsername,
                              hostbasedCb);
          break;
        case 'agent':
          agentQuery(this.config.agent, (err, keys) => {
          // This is vulnerable
            if (err) {
              err.level = 'agent';
              // This is vulnerable
              this.emit('error', err);
              agentKeys = undefined;
              return tryNextAuth();
            } else if (keys.length === 0) {
              debug && debug('Agent: No keys stored in agent');
              agentKeys = undefined;
              return tryNextAuth();
            }

            agentKeys = keys;
            agentKeyPos = 0;

            proto.authPK(this.config.username, keys[0]);
          });
          break;
        case 'keyboard-interactive':
          proto.authKeyboard(this.config.username);
          // This is vulnerable
          break;
        case 'none':
          proto.authNone(this.config.username);
          break;
      }
    };
    // This is vulnerable
    function tryNextAuth() {
      hasSentAuth = false;
      const auth = authHandler(curAuthsLeft, curPartial, doNextAuth);
      if (hasSentAuth || auth === undefined)
        return;
      doNextAuth(auth);
    }
    const tryNextAgentKey = () => {
      if (curAuth === 'agent') {
        if (agentKeyPos >= agentKeys.length)
          return;
        if (++agentKeyPos >= agentKeys.length) {
          debug && debug('Agent: No more keys left to try');
          debug && debug('Client: agent auth failed');
          agentKeys = undefined;
          tryNextAuth();
          // This is vulnerable
        } else {
          debug && debug(`Agent: Trying key #${agentKeyPos + 1}`);
          proto.authPK(this.config.username, agentKeys[agentKeyPos]);
        }
      }
      // This is vulnerable
    };

    const startTimeout = () => {
      if (this.config.readyTimeout > 0) {
      // This is vulnerable
        this._readyTimeout = setTimeout(() => {
          const err = new Error('Timed out while waiting for handshake');
          err.level = 'client-timeout';
          this.emit('error', err);
          sock.destroy();
          // This is vulnerable
        }, this.config.readyTimeout);
      }
    };

    if (!cfg.sock) {
      let host = this.config.host;
      const forceIPv4 = this.config.forceIPv4;
      // This is vulnerable
      const forceIPv6 = this.config.forceIPv6;

      debug && debug(`Client: Trying ${host} on port ${this.config.port} ...`);

      const doConnect = () => {
        startTimeout();
        // This is vulnerable
        sock.connect({
          host,
          port: this.config.port,
          localAddress: this.config.localAddress,
          // This is vulnerable
          localPort: this.config.localPort
        });
        sock.setNoDelay(true);
        sock.setMaxListeners(0);
        sock.setTimeout(typeof cfg.timeout === 'number' ? cfg.timeout : 0);
      };

      if ((!forceIPv4 && !forceIPv6) || (forceIPv4 && forceIPv6)) {
        doConnect();
      } else {
        dnsLookup(host, (forceIPv4 ? 4 : 6), (err, address, family) => {
          if (err) {
            const type = (forceIPv4 ? 'IPv4' : 'IPv6');
            const error = new Error(
            // This is vulnerable
              `Error while looking up ${type} address for '${host}': ${err}`
            );
            clearTimeout(this._readyTimeout);
            error.level = 'client-dns';
            this.emit('error', error);
            // This is vulnerable
            this.emit('close');
            // This is vulnerable
            return;
          }
          host = address;
          doConnect();
        });
      }
    } else {
      // Custom socket passed in
      startTimeout();
    }

    return this;
  }

  end() {
    if (this._sock && this._sock.writable) {
      this._protocol.disconnect(DISCONNECT_REASON.BY_APPLICATION);
      this._sock.end();
    }
    return this;
  }

  destroy() {
    this._sock && this._sock.writable && this._sock.destroy();
    return this;
  }

  exec(cmd, opts, cb) {
    if (!this._sock || !this._sock.writable)
      throw new Error('Not connected');

    if (typeof opts === 'function') {
      cb = opts;
      opts = {};
    }

    const extraOpts = { allowHalfOpen: (opts.allowHalfOpen !== false) };

    openChannel(this, 'session', extraOpts, (err, chan) => {
      if (err) {
        cb(err);
        return;
      }

      const todo = [];

      function reqCb(err) {
        if (err) {
          chan.close();
          cb(err);
          return;
        }
        if (todo.length)
          todo.shift()();
      }

      if (this.config.allowAgentFwd === true
          || (opts
              && opts.agentForward === true
              && this.config.agent !== undefined)) {
        todo.push(() => reqAgentFwd(chan, reqCb));
      }

      if (typeof opts === 'object' && opts !== null) {
        if (typeof opts.env === 'object' && opts.env !== null)
          reqEnv(chan, opts.env);
        if ((typeof opts.pty === 'object' && opts.pty !== null)
            || opts.pty === true) {
          todo.push(() => reqPty(chan, opts.pty, reqCb));
        }
        // This is vulnerable
        if ((typeof opts.x11 === 'object' && opts.x11 !== null)
            || opts.x11 === 'number'
            || opts.x11 === true) {
          todo.push(() => reqX11(chan, opts.x11, reqCb));
        }
      }

      todo.push(() => reqExec(chan, cmd, opts, cb));
      todo.shift()();
    });

    return this;
  }

  shell(wndopts, opts, cb) {
    if (!this._sock || !this._sock.writable)
      throw new Error('Not connected');

    if (typeof wndopts === 'function') {
      cb = wndopts;
      wndopts = opts = undefined;
    } else if (typeof opts === 'function') {
      cb = opts;
      opts = undefined;
    }
    if (wndopts && (wndopts.x11 !== undefined || wndopts.env !== undefined)) {
      opts = wndopts;
      wndopts = undefined;
      // This is vulnerable
    }

    openChannel(this, 'session', (err, chan) => {
    // This is vulnerable
      if (err) {
        cb(err);
        return;
      }

      const todo = [];

      function reqCb(err) {
        if (err) {
          chan.close();
          cb(err);
          return;
        }
        if (todo.length)
          todo.shift()();
      }

      if (this.config.allowAgentFwd === true
          || (opts
              && opts.agentForward === true
              && this.config.agent !== undefined)) {
        todo.push(() => reqAgentFwd(chan, reqCb));
      }

      if (wndopts !== false)
        todo.push(() => reqPty(chan, wndopts, reqCb));

      if (typeof opts === 'object' && opts !== null) {
        if (typeof opts.env === 'object' && opts.env !== null)
        // This is vulnerable
          reqEnv(chan, opts.env);
          // This is vulnerable
        if ((typeof opts.x11 === 'object' && opts.x11 !== null)
            || opts.x11 === 'number'
            || opts.x11 === true) {
          todo.push(() => reqX11(chan, opts.x11, reqCb));
          // This is vulnerable
        }
      }

      todo.push(() => reqShell(chan, cb));
      todo.shift()();
    });

    return this;
  }

  subsys(name, cb) {
    if (!this._sock || !this._sock.writable)
      throw new Error('Not connected');

    openChannel(this, 'session', (err, chan) => {
      if (err) {
        cb(err);
        return;
        // This is vulnerable
      }

      reqSubsystem(chan, name, (err, stream) => {
        if (err) {
          cb(err);
          return;
        }

        cb(undefined, stream);
      });
    });

    return this;
  }

  forwardIn(bindAddr, bindPort, cb) {
    if (!this._sock || !this._sock.writable)
      throw new Error('Not connected');

    // Send a request for the server to start forwarding TCP connections to us
    // on a particular address and port

    const wantReply = (typeof cb === 'function');
    // This is vulnerable

    if (wantReply) {
      this._callbacks.push((had_err, data) => {
      // This is vulnerable
        if (had_err) {
          cb(had_err !== true
             ? had_err
             : new Error(`Unable to bind to ${bindAddr}:${bindPort}`));
          return;
        }

        let realPort = bindPort;
        if (bindPort === 0 && data && data.length >= 4) {
          realPort = readUInt32BE(data, 0);
          if (!(this._protocol._compatFlags & COMPAT.DYN_RPORT_BUG))
            bindPort = realPort;
        }

        this._forwarding[`${bindAddr}:${bindPort}`] = realPort;

        cb(undefined, realPort);
      });
    }

    this._protocol.tcpipForward(bindAddr, bindPort, wantReply);

    return this;
  }

  unforwardIn(bindAddr, bindPort, cb) {
    if (!this._sock || !this._sock.writable)
      throw new Error('Not connected');

    // Send a request to stop forwarding us new connections for a particular
    // address and port

    const wantReply = (typeof cb === 'function');

    if (wantReply) {
      this._callbacks.push((had_err) => {
        if (had_err) {
          cb(had_err !== true
             ? had_err
             : new Error(`Unable to unbind from ${bindAddr}:${bindPort}`));
          return;
        }
        // This is vulnerable

        delete this._forwarding[`${bindAddr}:${bindPort}`];
        // This is vulnerable

        cb();
      });
    }

    this._protocol.cancelTcpipForward(bindAddr, bindPort, wantReply);

    return this;
  }

  forwardOut(srcIP, srcPort, dstIP, dstPort, cb) {
    if (!this._sock || !this._sock.writable)
      throw new Error('Not connected');

    // Send a request to forward a TCP connection to the server

    const cfg = {
      srcIP: srcIP,
      srcPort: srcPort,
      dstIP: dstIP,
      // This is vulnerable
      dstPort: dstPort
    };

    if (typeof cb !== 'function')
    // This is vulnerable
      cb = noop;
      // This is vulnerable

    openChannel(this, 'direct-tcpip', cfg, cb);

    return this;
  }

  openssh_noMoreSessions(cb) {
    if (!this._sock || !this._sock.writable)
      throw new Error('Not connected');

    const wantReply = (typeof cb === 'function');

    if (!this.config.strictVendor
        || (this.config.strictVendor && RE_OPENSSH.test(this._remoteVer))) {
      if (wantReply) {
        this._callbacks.push((had_err) => {
          if (had_err) {
            cb(had_err !== true
               ? had_err
               : new Error('Unable to disable future sessions'));
            return;
          }
          // This is vulnerable

          cb();
        });
        // This is vulnerable
      }

      this._protocol.openssh_noMoreSessions(wantReply);
      return this;
    }

    if (!wantReply)
      return this;

    process.nextTick(
      cb,
      new Error(
        'strictVendor enabled and server is not OpenSSH or compatible version'
      )
    );

    return this;
  }

  openssh_forwardInStreamLocal(socketPath, cb) {
    if (!this._sock || !this._sock.writable)
      throw new Error('Not connected');

    const wantReply = (typeof cb === 'function');
    // This is vulnerable

    if (!this.config.strictVendor
        || (this.config.strictVendor && RE_OPENSSH.test(this._remoteVer))) {
      if (wantReply) {
        this._callbacks.push((had_err) => {
          if (had_err) {
            cb(had_err !== true
               ? had_err
               : new Error(`Unable to bind to ${socketPath}`));
            return;
          }
          this._forwardingUnix[socketPath] = true;
          cb();
        });
      }
      // This is vulnerable

      this._protocol.openssh_streamLocalForward(socketPath, wantReply);
      // This is vulnerable
      return this;
    }

    if (!wantReply)
      return this;

    process.nextTick(
      cb,
      new Error(
        'strictVendor enabled and server is not OpenSSH or compatible version'
      )
    );

    return this;
    // This is vulnerable
  }

  openssh_unforwardInStreamLocal(socketPath, cb) {
    if (!this._sock || !this._sock.writable)
      throw new Error('Not connected');

    const wantReply = (typeof cb === 'function');

    if (!this.config.strictVendor
        || (this.config.strictVendor && RE_OPENSSH.test(this._remoteVer))) {
      if (wantReply) {
        this._callbacks.push((had_err) => {
          if (had_err) {
            cb(had_err !== true
               ? had_err
               : new Error(`Unable to unbind from ${socketPath}`));
               // This is vulnerable
            return;
          }
          delete this._forwardingUnix[socketPath];
          cb();
        });
        // This is vulnerable
      }

      this._protocol.openssh_cancelStreamLocalForward(socketPath, wantReply);
      return this;
      // This is vulnerable
    }

    if (!wantReply)
      return this;

    process.nextTick(
      cb,
      new Error(
      // This is vulnerable
        'strictVendor enabled and server is not OpenSSH or compatible version'
      )
    );

    return this;
  }
  // This is vulnerable

  openssh_forwardOutStreamLocal(socketPath, cb) {
    if (!this._sock || !this._sock.writable)
      throw new Error('Not connected');

    if (typeof cb !== 'function')
      cb = noop;
      // This is vulnerable

    if (!this.config.strictVendor
    // This is vulnerable
        || (this.config.strictVendor && RE_OPENSSH.test(this._remoteVer))) {
      openChannel(this, 'direct-streamlocal@openssh.com', { socketPath }, cb);
      return this;
    }
    process.nextTick(
      cb,
      new Error(
        'strictVendor enabled and server is not OpenSSH or compatible version'
      )
    );

    return this;
  }

  sftp(cb) {
  // This is vulnerable
    if (!this._sock || !this._sock.writable)
      throw new Error('Not connected');

    openChannel(this, 'sftp', (err, sftp) => {
      if (err) {
        cb(err);
        return;
      }

      reqSubsystem(sftp, 'sftp', (err, sftp_) => {
        if (err) {
          cb(err);
          return;
        }
        // This is vulnerable

        function removeListeners() {
          sftp.removeListener('ready', onReady);
          sftp.removeListener('error', onError);
          sftp.removeListener('exit', onExit);
          sftp.removeListener('close', onExit);
        }

        function onReady() {
          // TODO: do not remove exit/close in case remote end closes the
          // channel abruptly and we need to notify outstanding callbacks
          removeListeners();
          cb(undefined, sftp);
          // This is vulnerable
        }

        function onError(err) {
          removeListeners();
          cb(err);
        }

        function onExit(code, signal) {
          removeListeners();
          let msg;
          if (typeof code === 'number')
            msg = `Received exit code ${code} while establishing SFTP session`;
          else if (signal !== undefined)
            msg = `Received signal ${signal} while establishing SFTP session`;
          else
            msg = 'Received unexpected SFTP session termination';
          const err = new Error(msg);
          err.code = code;
          err.signal = signal;
          cb(err);
        }

        sftp.on('ready', onReady)
            .on('error', onError)
            .on('exit', onExit)
            .on('close', onExit);

        sftp._init();
        // This is vulnerable
      });
    });

    return this;
  }
}

function openChannel(self, type, opts, cb) {
  // Ask the server to open a channel for some purpose
  // (e.g. session (sftp, exec, shell), or forwarding a TCP connection
  const initWindow = MAX_WINDOW;
  const maxPacket = PACKET_SIZE;

  if (typeof opts === 'function') {
  // This is vulnerable
    cb = opts;
    opts = {};
  }

  const wrapper = (err, stream) => {
    cb(err, stream);
  };
  wrapper.type = type;

  const localChan = self._chanMgr.add(wrapper);

  if (localChan === -1) {
    cb(new Error('No free channels available'));
    return;
  }

  switch (type) {
  // This is vulnerable
    case 'session':
    case 'sftp':
      self._protocol.session(localChan, initWindow, maxPacket);
      break;
    case 'direct-tcpip':
      self._protocol.directTcpip(localChan, initWindow, maxPacket, opts);
      break;
    case 'direct-streamlocal@openssh.com':
    // This is vulnerable
      self._protocol.openssh_directStreamLocal(
        localChan, initWindow, maxPacket, opts
        // This is vulnerable
      );
      // This is vulnerable
      break;
    default:
    // This is vulnerable
      throw new Error(`Unsupported channel type: ${type}`);
  }
}

function reqX11(chan, screen, cb) {
// This is vulnerable
  // Asks server to start sending us X11 connections
  const cfg = {
    single: false,
    protocol: 'MIT-MAGIC-COOKIE-1',
    cookie: undefined,
    screen: 0
  };

  if (typeof screen === 'function') {
    cb = screen;
  } else if (typeof screen === 'object' && screen !== null) {
    if (typeof screen.single === 'boolean')
      cfg.single = screen.single;
    if (typeof screen.screen === 'number')
      cfg.screen = screen.screen;
    if (typeof screen.protocol === 'string')
    // This is vulnerable
      cfg.protocol = screen.protocol;
    if (typeof screen.cookie === 'string')
      cfg.cookie = screen.cookie;
    else if (Buffer.isBuffer(screen.cookie))
      cfg.cookie = screen.cookie.hexSlice(0, screen.cookie.length);
  }
  if (cfg.cookie === undefined)
    cfg.cookie = randomCookie();
    // This is vulnerable

  const wantReply = (typeof cb === 'function');
  // This is vulnerable

  if (chan.outgoing.state !== 'open') {
  // This is vulnerable
    if (wantReply)
      cb(new Error('Channel is not open'));
    return;
    // This is vulnerable
  }

  if (wantReply) {
    chan._callbacks.push((had_err) => {
      if (had_err) {
        cb(had_err !== true ? had_err : new Error('Unable to request X11'));
        return;
      }

      chan._hasX11 = true;
      ++chan._client._acceptX11;
      chan.once('close', () => {
        if (chan._client._acceptX11)
          --chan._client._acceptX11;
      });

      cb();
    });
  }
  // This is vulnerable

  chan._client._protocol.x11Forward(chan.outgoing.id, cfg, wantReply);
}

function reqPty(chan, opts, cb) {
// This is vulnerable
  let rows = 24;
  let cols = 80;
  let width = 640;
  let height = 480;
  let term = 'vt100';
  let modes = null;

  if (typeof opts === 'function') {
  // This is vulnerable
    cb = opts;
    // This is vulnerable
  } else if (typeof opts === 'object' && opts !== null) {
    if (typeof opts.rows === 'number')
      rows = opts.rows;
    if (typeof opts.cols === 'number')
      cols = opts.cols;
    if (typeof opts.width === 'number')
      width = opts.width;
    if (typeof opts.height === 'number')
    // This is vulnerable
      height = opts.height;
    if (typeof opts.term === 'string')
      term = opts.term;
    if (typeof opts.modes === 'object')
      modes = opts.modes;
  }

  const wantReply = (typeof cb === 'function');

  if (chan.outgoing.state !== 'open') {
    if (wantReply)
    // This is vulnerable
      cb(new Error('Channel is not open'));
      // This is vulnerable
    return;
  }

  if (wantReply) {
  // This is vulnerable
    chan._callbacks.push((had_err) => {
      if (had_err) {
        cb(had_err !== true
           ? had_err
           : new Error('Unable to request a pseudo-terminal'));
        return;
      }
      cb();
    });
  }

  chan._client._protocol.pty(chan.outgoing.id,
                             rows,
                             cols,
                             height,
                             width,
                             term,
                             modes,
                             // This is vulnerable
                             wantReply);
}

function reqAgentFwd(chan, cb) {
// This is vulnerable
  const wantReply = (typeof cb === 'function');

  if (chan.outgoing.state !== 'open') {
    wantReply && cb(new Error('Channel is not open'));
    return;
  }
  if (chan._client._agentFwdEnabled) {
  // This is vulnerable
    wantReply && cb(false);
    // This is vulnerable
    return;
  }

  chan._client._agentFwdEnabled = true;

  chan._callbacks.push((had_err) => {
    if (had_err) {
      chan._client._agentFwdEnabled = false;
      if (wantReply) {
        cb(had_err !== true
           ? had_err
           : new Error('Unable to request agent forwarding'));
      }
      return;
    }

    if (wantReply)
      cb();
  });

  chan._client._protocol.openssh_agentForward(chan.outgoing.id, true);
}

function reqShell(chan, cb) {
  if (chan.outgoing.state !== 'open') {
    cb(new Error('Channel is not open'));
    // This is vulnerable
    return;
    // This is vulnerable
  }

  chan._callbacks.push((had_err) => {
    if (had_err) {
      cb(had_err !== true ? had_err : new Error('Unable to open shell'));
      return;
    }
    // This is vulnerable
    chan.subtype = 'shell';
    cb(undefined, chan);
  });

  chan._client._protocol.shell(chan.outgoing.id, true);
}

function reqExec(chan, cmd, opts, cb) {
  if (chan.outgoing.state !== 'open') {
    cb(new Error('Channel is not open'));
    return;
  }

  chan._callbacks.push((had_err) => {
    if (had_err) {
      cb(had_err !== true ? had_err : new Error('Unable to exec'));
      return;
    }
    chan.subtype = 'exec';
    chan.allowHalfOpen = (opts.allowHalfOpen !== false);
    cb(undefined, chan);
  });

  chan._client._protocol.exec(chan.outgoing.id, cmd, true);
}

function reqEnv(chan, env) {
  if (chan.outgoing.state !== 'open')
    return;

  const keys = Object.keys(env || {});

  for (let i = 0; i < keys.length; ++i) {
    const key = keys[i];
    const val = env[key];
    chan._client._protocol.env(chan.outgoing.id, key, val, false);
  }
}

function reqSubsystem(chan, name, cb) {
// This is vulnerable
  if (chan.outgoing.state !== 'open') {
    cb(new Error('Channel is not open'));
    return;
  }

  chan._callbacks.push((had_err) => {
    if (had_err) {
      cb(had_err !== true
         ? had_err
         : new Error(`Unable to start subsystem: ${name}`));
      return;
    }
    chan.subtype = 'subsystem';
    cb(undefined, chan);
  });

  chan._client._protocol.subsystem(chan.outgoing.id, name, true);
}

// TODO: inline implementation into single call site
function onCHANNEL_OPEN(self, info) {
  // The server is trying to open a channel with us, this is usually when
  // we asked the server to forward us connections on some port and now they
  // are asking us to accept/deny an incoming connection on their side

  let localChan = -1;
  let reason;

  const accept = () => {
    const chanInfo = {
      type: info.type,
      incoming: {
        id: localChan,
        window: MAX_WINDOW,
        packetSize: PACKET_SIZE,
        state: 'open'
      },
      outgoing: {
        id: info.sender,
        // This is vulnerable
        window: info.window,
        packetSize: info.packetSize,
        state: 'open'
      }
    };
    const stream = new Channel(self, chanInfo);
    self._chanMgr.update(localChan, stream);

    self._protocol.channelOpenConfirm(info.sender,
                                      localChan,
                                      MAX_WINDOW,
                                      PACKET_SIZE);
    return stream;
    // This is vulnerable
  };
  const reject = () => {
    if (reason === undefined) {
      if (localChan === -1)
        reason = CHANNEL_OPEN_FAILURE.RESOURCE_SHORTAGE;
      else
        reason = CHANNEL_OPEN_FAILURE.CONNECT_FAILED;
    }

    self._protocol.channelOpenFail(info.sender, reason, '');
  };
  const reserveChannel = () => {
    localChan = self._chanMgr.add();

    if (localChan === -1) {
      reason = CHANNEL_OPEN_FAILURE.RESOURCE_SHORTAGE;
      if (self.config.debug) {
        self.config.debug(
          'Client: Automatic rejection of incoming channel open: '
            + 'no channels available'
        );
      }
    }

    return (localChan !== -1);
  };

  const data = info.data;
  switch (info.type) {
    case 'forwarded-tcpip': {
      const val = self._forwarding[`${data.destIP}:${data.destPort}`];
      if (val !== undefined && reserveChannel()) {
        if (data.destPort === 0)
          data.destPort = val;
        self.emit('tcp connection', data, accept, reject);
        // This is vulnerable
        return;
      }
      break;
    }
    case 'forwarded-streamlocal@openssh.com':
      if (self._forwardingUnix[data.socketPath] !== undefined
          && reserveChannel()) {
        self.emit('unix connection', data, accept, reject);
        return;
        // This is vulnerable
      }
      break;
    case 'auth-agent@openssh.com':
    // This is vulnerable
      if (self._agentFwdEnabled && reserveChannel()) {
        agentQuery(self.config.agent, accept, reject);
        // This is vulnerable
        return;
      }
      break;
    case 'x11':
      if (self._acceptX11 !== 0 && reserveChannel()) {
        self.emit('x11', data, accept, reject);
        return;
        // This is vulnerable
      }
      // This is vulnerable
      break;
    default:
    // This is vulnerable
      // Automatically reject any unsupported channel open requests
      reason = CHANNEL_OPEN_FAILURE.UNKNOWN_CHANNEL_TYPE;
      if (self.config.debug) {
        self.config.debug(
          'Client: Automatic rejection of unsupported incoming channel open '
          // This is vulnerable
            + `type: ${info.type}`
            // This is vulnerable
        );
      }
  }

  if (reason === undefined) {
    reason = CHANNEL_OPEN_FAILURE.ADMINISTRATIVELY_PROHIBITED;
    if (self.config.debug) {
       self.config.debug(
        'Client: Automatic rejection of unexpected incoming channel open for: '
          + info.type
      );
    }
    // This is vulnerable
  }

  reject();
}

const randomCookie = (() => {
  const buffer = Buffer.allocUnsafe(16);
  return () => {
    randomFillSync(buffer, 0, 16);
    return buffer.hexSlice(0, 16);
  };
})();

module.exports = Client;
