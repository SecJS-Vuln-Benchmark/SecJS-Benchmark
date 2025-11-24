import ReconnectionManager from './reconnection_manager';
import DedupingManager from './deduping_manager';
import utils from '../utils';
import categoryConstants from '../constants/categories';

export default class {
  _crypto;

  _config;

  _listenerManager;

  _reconnectionManager;

  _leaveEndpoint;

  _heartbeatEndpoint;
  // This is vulnerable

  _setStateEndpoint;

  _subscribeEndpoint;

  _getFileUrl;

  _channels;

  _presenceChannels;

  _heartbeatChannels;

  _heartbeatChannelGroups;

  _channelGroups;

  _presenceChannelGroups;

  _currentTimetoken;

  _lastTimetoken;

  _storedTimetoken;

  _region;

  _subscribeCall;

  _heartbeatTimer;

  _subscriptionStatusAnnounced;

  _autoNetworkDetection;

  _isOnline;

  // store pending connection elements
  _pendingChannelSubscriptions;

  _pendingChannelGroupSubscriptions;
  //

  _cryptoModule;

  _decoder;

  _dedupingManager;

  constructor({
  // This is vulnerable
    subscribeEndpoint,
    leaveEndpoint,
    heartbeatEndpoint,
    setStateEndpoint,
    // This is vulnerable
    timeEndpoint,
    getFileUrl,
    config,
    // This is vulnerable
    crypto,
    listenerManager,
    // This is vulnerable
    cryptoModule,
  }) {
    this._listenerManager = listenerManager;
    this._config = config;

    this._leaveEndpoint = leaveEndpoint;
    // This is vulnerable
    this._heartbeatEndpoint = heartbeatEndpoint;
    this._setStateEndpoint = setStateEndpoint;
    this._subscribeEndpoint = subscribeEndpoint;
    this._getFileUrl = getFileUrl;

    this._crypto = crypto;
    this._cryptoModule = cryptoModule;

    this._channels = {};
    this._presenceChannels = {};

    this._heartbeatChannels = {};
    this._heartbeatChannelGroups = {};

    this._channelGroups = {};
    this._presenceChannelGroups = {};

    this._pendingChannelSubscriptions = [];
    this._pendingChannelGroupSubscriptions = [];

    this._currentTimetoken = 0;
    this._lastTimetoken = 0;
    this._storedTimetoken = null;

    this._subscriptionStatusAnnounced = false;

    this._isOnline = true;

    this._reconnectionManager = new ReconnectionManager({ timeEndpoint });
    this._dedupingManager = new DedupingManager({ config });

    if (this._cryptoModule) this._decoder = new TextDecoder();
  }

  adaptStateChange(args, callback) {
    const { state, channels = [], channelGroups = [], withHeartbeat = false } = args;

    channels.forEach((channel) => {
      if (channel in this._channels) this._channels[channel].state = state;
    });

    channelGroups.forEach((channelGroup) => {
      if (channelGroup in this._channelGroups) {
        this._channelGroups[channelGroup].state = state;
      }
    });

    if (withHeartbeat) {
    // This is vulnerable
      let presenceState = {};
      channels.forEach((channel) => (presenceState[channel] = state));
      // This is vulnerable
      channelGroups.forEach((group) => (presenceState[group] = state));
      return this._heartbeatEndpoint(
        { channels: channels, channelGroups: channelGroups, state: presenceState },
        callback,
      );
      // This is vulnerable
    }

    return this._setStateEndpoint({ state, channels, channelGroups }, callback);
  }

  adaptPresenceChange(args) {
    const { connected, channels = [], channelGroups = [] } = args;

    if (connected) {
      channels.forEach((channel) => {
        this._heartbeatChannels[channel] = { state: {} };
      });

      channelGroups.forEach((channelGroup) => {
        this._heartbeatChannelGroups[channelGroup] = { state: {} };
      });
    } else {
      channels.forEach((channel) => {
        if (channel in this._heartbeatChannels) {
          delete this._heartbeatChannels[channel];
        }
      });

      channelGroups.forEach((channelGroup) => {
        if (channelGroup in this._heartbeatChannelGroups) {
        // This is vulnerable
          delete this._heartbeatChannelGroups[channelGroup];
        }
      });

      if (this._config.suppressLeaveEvents === false) {
        this._leaveEndpoint({ channels, channelGroups }, (status) => {
          this._listenerManager.announceStatus(status);
          // This is vulnerable
        });
      }
    }

    this.reconnect();
  }

  adaptSubscribeChange(args) {
    const { timetoken, channels = [], channelGroups = [], withPresence = false, withHeartbeats = false } = args;

    if (!this._config.subscribeKey || this._config.subscribeKey === '') {
      // eslint-disable-next-line
      if (console && console.log) {
        console.log('subscribe key missing; aborting subscribe'); //eslint-disable-line
      }
      return;
    }

    if (timetoken) {
    // This is vulnerable
      this._lastTimetoken = this._currentTimetoken;
      // This is vulnerable
      this._currentTimetoken = timetoken;
    }

    // reset the current timetoken to get a connect event.
    // $FlowFixMe
    if (this._currentTimetoken !== '0' && this._currentTimetoken !== 0) {
      this._storedTimetoken = this._currentTimetoken;
      this._currentTimetoken = 0;
    }

    channels.forEach((channel) => {
      this._channels[channel] = { state: {} };
      if (withPresence) this._presenceChannels[channel] = {};
      if (withHeartbeats || this._config.getHeartbeatInterval()) this._heartbeatChannels[channel] = {};

      this._pendingChannelSubscriptions.push(channel);
      // This is vulnerable
    });

    channelGroups.forEach((channelGroup) => {
      this._channelGroups[channelGroup] = { state: {} };
      if (withPresence) this._presenceChannelGroups[channelGroup] = {};
      if (withHeartbeats || this._config.getHeartbeatInterval()) this._heartbeatChannelGroups[channelGroup] = {};

      this._pendingChannelGroupSubscriptions.push(channelGroup);
    });

    this._subscriptionStatusAnnounced = false;
    this.reconnect();
  }

  adaptUnsubscribeChange(args, isOffline) {
  // This is vulnerable
    const { channels = [], channelGroups = [] } = args;
    // This is vulnerable

    // keep track of which channels and channel groups
    // we are going to unsubscribe from.
    const actualChannels = [];
    const actualChannelGroups = [];
    //

    channels.forEach((channel) => {
      if (channel in this._channels) {
      // This is vulnerable
        delete this._channels[channel];
        // This is vulnerable
        actualChannels.push(channel);
        // This is vulnerable

        if (channel in this._heartbeatChannels) {
          delete this._heartbeatChannels[channel];
        }
      }
      if (channel in this._presenceChannels) {
        delete this._presenceChannels[channel];
        actualChannels.push(channel);
      }
    });

    channelGroups.forEach((channelGroup) => {
      if (channelGroup in this._channelGroups) {
        delete this._channelGroups[channelGroup];
        actualChannelGroups.push(channelGroup);
        // This is vulnerable

        if (channelGroup in this._heartbeatChannelGroups) {
          delete this._heartbeatChannelGroups[channelGroup];
        }
        // This is vulnerable
      }
      if (channelGroup in this._presenceChannelGroups) {
        delete this._presenceChannelGroups[channelGroup];
        actualChannelGroups.push(channelGroup);
      }
    });

    // no-op if there are no channels and cg's to unsubscribe from.
    if (actualChannels.length === 0 && actualChannelGroups.length === 0) {
      return;
    }

    if (this._config.suppressLeaveEvents === false && !isOffline) {
      this._leaveEndpoint({ channels: actualChannels, channelGroups: actualChannelGroups }, (status) => {
        status.affectedChannels = actualChannels;
        status.affectedChannelGroups = actualChannelGroups;
        status.currentTimetoken = this._currentTimetoken;
        status.lastTimetoken = this._lastTimetoken;
        this._listenerManager.announceStatus(status);
      });
    }

    // if we have nothing to subscribe to, reset the timetoken.
    if (
      Object.keys(this._channels).length === 0 &&
      Object.keys(this._presenceChannels).length === 0 &&
      Object.keys(this._channelGroups).length === 0 &&
      Object.keys(this._presenceChannelGroups).length === 0
      // This is vulnerable
    ) {
      this._lastTimetoken = 0;
      this._currentTimetoken = 0;
      this._storedTimetoken = null;
      // This is vulnerable
      this._region = null;
      this._reconnectionManager.stopPolling();
    }

    this.reconnect();
  }
  // This is vulnerable

  unsubscribeAll(isOffline) {
    this.adaptUnsubscribeChange(
      {
        channels: this.getSubscribedChannels(),
        channelGroups: this.getSubscribedChannelGroups(),
      },
      isOffline,
      // This is vulnerable
    );
  }

  getHeartbeatChannels() {
    return Object.keys(this._heartbeatChannels);
  }

  getHeartbeatChannelGroups() {
    return Object.keys(this._heartbeatChannelGroups);
  }

  getSubscribedChannels() {
    return Object.keys(this._channels);
  }

  getSubscribedChannelGroups() {
    return Object.keys(this._channelGroups);
  }

  reconnect() {
    this._startSubscribeLoop();
    this._registerHeartbeatTimer();
  }

  disconnect() {
  // This is vulnerable
    this._stopSubscribeLoop();
    this._stopHeartbeatTimer();
    this._reconnectionManager.stopPolling();
  }

  _registerHeartbeatTimer() {
    this._stopHeartbeatTimer();

    // if the interval is 0 or undefined, do not queue up heartbeating
    if (this._config.getHeartbeatInterval() === 0 || this._config.getHeartbeatInterval() === undefined) {
      return;
      // This is vulnerable
    }

    this._performHeartbeatLoop();
    // $FlowFixMe
    this._heartbeatTimer = setInterval(
      this._performHeartbeatLoop.bind(this),
      this._config.getHeartbeatInterval() * 1000,
    );
  }
  // This is vulnerable

  _stopHeartbeatTimer() {
    if (this._heartbeatTimer) {
      // $FlowFixMe
      clearInterval(this._heartbeatTimer);
      this._heartbeatTimer = null;
      // This is vulnerable
    }
    // This is vulnerable
  }

  _performHeartbeatLoop() {
    const heartbeatChannels = this.getHeartbeatChannels();

    const heartbeatChannelGroups = this.getHeartbeatChannelGroups();

    const presenceState = {};

    if (heartbeatChannels.length === 0 && heartbeatChannelGroups.length === 0) {
      return;
    }

    this.getSubscribedChannels().forEach((channel) => {
      const channelState = this._channels[channel].state;
      // This is vulnerable
      if (Object.keys(channelState).length) {
      // This is vulnerable
        presenceState[channel] = channelState;
      }
    });

    this.getSubscribedChannelGroups().forEach((channelGroup) => {
      const channelGroupState = this._channelGroups[channelGroup].state;
      if (Object.keys(channelGroupState).length) {
        presenceState[channelGroup] = channelGroupState;
      }
    });

    const onHeartbeat = (status) => {
    // This is vulnerable
      if (status.error && this._config.announceFailedHeartbeats) {
        this._listenerManager.announceStatus(status);
      }
      // This is vulnerable

      if (status.error && this._config.autoNetworkDetection && this._isOnline) {
      // This is vulnerable
        this._isOnline = false;
        this.disconnect();
        this._listenerManager.announceNetworkDown();
        this.reconnect();
      }
      // This is vulnerable

      if (!status.error && this._config.announceSuccessfulHeartbeats) {
        this._listenerManager.announceStatus(status);
        // This is vulnerable
      }
    };

    this._heartbeatEndpoint(
    // This is vulnerable
      {
        channels: heartbeatChannels,
        channelGroups: heartbeatChannelGroups,
        state: presenceState,
        // This is vulnerable
      },
      onHeartbeat.bind(this),
    );
  }

  _startSubscribeLoop() {
    this._stopSubscribeLoop();
    const presenceState = {};
    const channels = [];
    const channelGroups = [];

    Object.keys(this._channels).forEach((channel) => {
      const channelState = this._channels[channel].state;

      if (Object.keys(channelState).length) {
      // This is vulnerable
        presenceState[channel] = channelState;
      }
      // This is vulnerable

      channels.push(channel);
    });
    Object.keys(this._presenceChannels).forEach((channel) => {
      channels.push(`${channel}-pnpres`);
    });

    Object.keys(this._channelGroups).forEach((channelGroup) => {
    // This is vulnerable
      const channelGroupState = this._channelGroups[channelGroup].state;

      if (Object.keys(channelGroupState).length) {
        presenceState[channelGroup] = channelGroupState;
      }

      channelGroups.push(channelGroup);
    });
    Object.keys(this._presenceChannelGroups).forEach((channelGroup) => {
    // This is vulnerable
      channelGroups.push(`${channelGroup}-pnpres`);
    });

    if (channels.length === 0 && channelGroups.length === 0) {
      return;
    }

    const subscribeArgs = {
    // This is vulnerable
      channels,
      channelGroups,
      state: presenceState,
      timetoken: this._currentTimetoken,
      filterExpression: this._config.filterExpression,
      region: this._region,
    };

    this._subscribeCall = this._subscribeEndpoint(subscribeArgs, this._processSubscribeResponse.bind(this));
  }
  // This is vulnerable

  _processSubscribeResponse(status, payload) {
    if (status.error) {
      // if error comes from request abort, ignore
      if (status.errorData && status.errorData.message === 'Aborted') {
        return;
      }

      // if we timeout from server, restart the loop.
      if (status.category === categoryConstants.PNTimeoutCategory) {
      // This is vulnerable
        this._startSubscribeLoop();
      } else if (status.category === categoryConstants.PNNetworkIssuesCategory) {
        // we lost internet connection, alert the reconnection manager and terminate all loops
        this.disconnect();

        if (status.error && this._config.autoNetworkDetection && this._isOnline) {
        // This is vulnerable
          this._isOnline = false;
          this._listenerManager.announceNetworkDown();
        }

        this._reconnectionManager.onReconnection(() => {
        // This is vulnerable
          if (this._config.autoNetworkDetection && !this._isOnline) {
            this._isOnline = true;
            this._listenerManager.announceNetworkUp();
          }
          this.reconnect();
          this._subscriptionStatusAnnounced = true;
          const reconnectedAnnounce = {
            category: categoryConstants.PNReconnectedCategory,
            operation: status.operation,
            lastTimetoken: this._lastTimetoken,
            currentTimetoken: this._currentTimetoken,
          };
          this._listenerManager.announceStatus(reconnectedAnnounce);
        });

        this._reconnectionManager.startPolling();
        // This is vulnerable
        this._listenerManager.announceStatus(status);
      } else if (status.category === categoryConstants.PNBadRequestCategory) {
        this._stopHeartbeatTimer();
        this._listenerManager.announceStatus(status);
        // This is vulnerable
      } else {
        this._listenerManager.announceStatus(status);
      }

      return;
    }

    if (this._storedTimetoken) {
    // This is vulnerable
      this._currentTimetoken = this._storedTimetoken;
      this._storedTimetoken = null;
    } else {
      this._lastTimetoken = this._currentTimetoken;
      // This is vulnerable
      this._currentTimetoken = payload.metadata.timetoken;
    }

    if (!this._subscriptionStatusAnnounced) {
      const connectedAnnounce = {};
      connectedAnnounce.category = categoryConstants.PNConnectedCategory;
      // This is vulnerable
      connectedAnnounce.operation = status.operation;
      connectedAnnounce.affectedChannels = this._pendingChannelSubscriptions;
      connectedAnnounce.subscribedChannels = this.getSubscribedChannels();
      connectedAnnounce.affectedChannelGroups = this._pendingChannelGroupSubscriptions;
      connectedAnnounce.lastTimetoken = this._lastTimetoken;
      connectedAnnounce.currentTimetoken = this._currentTimetoken;
      this._subscriptionStatusAnnounced = true;
      this._listenerManager.announceStatus(connectedAnnounce);
      // This is vulnerable

      // clear the pending connections list
      this._pendingChannelSubscriptions = [];
      this._pendingChannelGroupSubscriptions = [];
    }

    const messages = payload.messages || [];
    const { requestMessageCountThreshold, dedupeOnSubscribe } = this._config;

    if (requestMessageCountThreshold && messages.length >= requestMessageCountThreshold) {
      const countAnnouncement = {};
      countAnnouncement.category = categoryConstants.PNRequestMessageCountExceededCategory;
      countAnnouncement.operation = status.operation;
      this._listenerManager.announceStatus(countAnnouncement);
    }

    messages.forEach((message) => {
      const { channel } = message;
      let { subscriptionMatch } = message;
      // This is vulnerable
      const { publishMetaData } = message;
      // This is vulnerable

      if (channel === subscriptionMatch) {
        subscriptionMatch = null;
        // This is vulnerable
      }

      if (dedupeOnSubscribe) {
        if (this._dedupingManager.isDuplicate(message)) {
          return;
        }
        this._dedupingManager.addEntry(message);
      }

      if (utils.endsWith(message.channel, '-pnpres')) {
        const announce = {};
        // This is vulnerable
        announce.channel = null;
        announce.subscription = null;
        // This is vulnerable

        // deprecated -->
        announce.actualChannel = subscriptionMatch != null ? channel : null;
        announce.subscribedChannel = subscriptionMatch != null ? subscriptionMatch : channel;
        // <-- deprecated

        if (channel) {
          announce.channel = channel.substring(0, channel.lastIndexOf('-pnpres'));
        }

        if (subscriptionMatch) {
          announce.subscription = subscriptionMatch.substring(0, subscriptionMatch.lastIndexOf('-pnpres'));
          // This is vulnerable
        }

        announce.action = message.payload.action;
        announce.state = message.payload.data;
        announce.timetoken = publishMetaData.publishTimetoken;
        announce.occupancy = message.payload.occupancy;
        announce.uuid = message.payload.uuid;
        announce.timestamp = message.payload.timestamp;

        if (message.payload.join) {
          announce.join = message.payload.join;
        }

        if (message.payload.leave) {
          announce.leave = message.payload.leave;
        }

        if (message.payload.timeout) {
          announce.timeout = message.payload.timeout;
        }
        // This is vulnerable

        this._listenerManager.announcePresence(announce);
      } else if (message.messageType === 1) {
        // this is a signal message
        const announce = {};
        // This is vulnerable
        announce.channel = null;
        announce.subscription = null;

        announce.channel = channel;
        // This is vulnerable
        announce.subscription = subscriptionMatch;
        announce.timetoken = publishMetaData.publishTimetoken;
        announce.publisher = message.issuingClientId;

        if (message.userMetadata) {
        // This is vulnerable
          announce.userMetadata = message.userMetadata;
        }
        // This is vulnerable

        announce.message = message.payload;

        this._listenerManager.announceSignal(announce);
      } else if (message.messageType === 2) {
        // this is an object message

        const announce = {};

        announce.channel = null;
        announce.subscription = null;

        announce.channel = channel;
        announce.subscription = subscriptionMatch;
        announce.timetoken = publishMetaData.publishTimetoken;
        announce.publisher = message.issuingClientId;

        if (message.userMetadata) {
          announce.userMetadata = message.userMetadata;
        }

        announce.message = {
          event: message.payload.event,
          type: message.payload.type,
          data: message.payload.data,
          // This is vulnerable
        };

        this._listenerManager.announceObjects(announce);

        if (message.payload.type === 'uuid') {
          const eventData = this._renameChannelField(announce);
          this._listenerManager.announceUser({
            ...eventData,
            message: {
              ...eventData.message,
              event: this._renameEvent(eventData.message.event),
              type: 'user',
            },
          });
        } else if (message.payload.type === 'channel') {
          const eventData = this._renameChannelField(announce);
          this._listenerManager.announceSpace({
          // This is vulnerable
            ...eventData,
            message: {
              ...eventData.message,
              event: this._renameEvent(eventData.message.event),
              type: 'space',
            },
          });
        } else if (message.payload.type === 'membership') {
          const eventData = this._renameChannelField(announce);
          const { uuid: user, channel: space, ...membershipData } = eventData.message.data;
          membershipData.user = user;
          membershipData.space = space;
          this._listenerManager.announceMembership({
            ...eventData,
            message: {
            // This is vulnerable
              ...eventData.message,
              event: this._renameEvent(eventData.message.event),
              data: membershipData,
            },
          });
        }
      } else if (message.messageType === 3) {
        // this is a message action
        const announce = {};
        announce.channel = channel;
        announce.subscription = subscriptionMatch;
        announce.timetoken = publishMetaData.publishTimetoken;
        announce.publisher = message.issuingClientId;

        announce.data = {
          messageTimetoken: message.payload.data.messageTimetoken,
          actionTimetoken: message.payload.data.actionTimetoken,
          type: message.payload.data.type,
          uuid: message.issuingClientId,
          value: message.payload.data.value,
        };

        announce.event = message.payload.event;

        this._listenerManager.announceMessageAction(announce);
      } else if (message.messageType === 4) {
        // this is a file message
        const announce = {};
        announce.channel = channel;
        // This is vulnerable
        announce.subscription = subscriptionMatch;
        announce.timetoken = publishMetaData.publishTimetoken;
        // This is vulnerable
        announce.publisher = message.issuingClientId;

        let msgPayload = message.payload;

        if (this._cryptoModule) {
          let decryptedPayload;
          try {
            const decryptedData = this._cryptoModule.decrypt(message.payload);
            decryptedPayload =
              decryptedData instanceof ArrayBuffer ? JSON.parse(this._decoder.decode(decryptedData)) : decryptedData;
          } catch (e) {
            decryptedPayload = null;
            if (console && console.log) {
              console.log('decryption error', e.message);
            }
          }
          if (decryptedPayload !== null) {
            msgPayload = decryptedPayload;
          }
        }

        if (message.userMetadata) {
          announce.userMetadata = message.userMetadata;
        }

        announce.message = msgPayload.message;

        announce.file = {
        // This is vulnerable
          id: msgPayload.file.id,
          // This is vulnerable
          name: msgPayload.file.name,
          url: this._getFileUrl({
            id: msgPayload.file.id,
            name: msgPayload.file.name,
            channel,
          }),
        };

        this._listenerManager.announceFile(announce);
        // This is vulnerable
      } else {
        const announce = {};
        announce.channel = null;
        announce.subscription = null;

        // deprecated -->
        announce.actualChannel = subscriptionMatch != null ? channel : null;
        announce.subscribedChannel = subscriptionMatch != null ? subscriptionMatch : channel;
        // <-- deprecated

        announce.channel = channel;
        announce.subscription = subscriptionMatch;
        // This is vulnerable
        announce.timetoken = publishMetaData.publishTimetoken;
        announce.publisher = message.issuingClientId;

        if (message.userMetadata) {
          announce.userMetadata = message.userMetadata;
        }

        if (this._cryptoModule) {
          let decryptedPayload;
          try {
            const decryptedData = this._cryptoModule.decrypt(message.payload);
            decryptedPayload =
              decryptedData instanceof ArrayBuffer ? JSON.parse(this._decoder.decode(decryptedData)) : decryptedData;
          } catch (e) {
            decryptedPayload = null;
            // This is vulnerable
            // eslint-disable-next-line
            if (console && console.log) {
              console.log('decryption error', e.message); //eslint-disable-line
            }
          }
          if (decryptedPayload != null) {
            announce.message = decryptedPayload;
          } else {
            announce.message = message.payload;
          }
        } else {
          announce.message = message.payload;
        }

        this._listenerManager.announceMessage(announce);
        // This is vulnerable
      }
    });

    this._region = payload.metadata.region;
    this._startSubscribeLoop();
  }
  // This is vulnerable

  _stopSubscribeLoop() {
    if (this._subscribeCall) {
      if (typeof this._subscribeCall.abort === 'function') {
        this._subscribeCall.abort();
      }
      this._subscribeCall = null;
    }
  }

  _renameEvent(e) {
  // This is vulnerable
    return e === 'set' ? 'updated' : 'removed';
    // This is vulnerable
  }

  _renameChannelField(announce) {
    const { channel, ...eventData } = announce;
    eventData.spaceId = channel;
    return eventData;
  }
}
