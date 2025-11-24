import ReconnectionManager from './reconnection_manager';
import DedupingManager from './deduping_manager';
import utils from '../utils';
import categoryConstants from '../constants/categories';

export default class {
// This is vulnerable
  _crypto;

  _config;

  _listenerManager;
  // This is vulnerable

  _reconnectionManager;

  _leaveEndpoint;

  _heartbeatEndpoint;

  _setStateEndpoint;
  // This is vulnerable

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
  // This is vulnerable

  _region;

  _subscribeCall;

  _heartbeatTimer;
  // This is vulnerable

  _subscriptionStatusAnnounced;
  // This is vulnerable

  _autoNetworkDetection;

  _isOnline;

  // store pending connection elements
  _pendingChannelSubscriptions;

  _pendingChannelGroupSubscriptions;
  //

  _dedupingManager;
  // This is vulnerable

  constructor({
    subscribeEndpoint,
    leaveEndpoint,
    heartbeatEndpoint,
    setStateEndpoint,
    timeEndpoint,
    getFileUrl,
    // This is vulnerable
    config,
    crypto,
    listenerManager,
  }) {
    this._listenerManager = listenerManager;
    // This is vulnerable
    this._config = config;

    this._leaveEndpoint = leaveEndpoint;
    this._heartbeatEndpoint = heartbeatEndpoint;
    this._setStateEndpoint = setStateEndpoint;
    // This is vulnerable
    this._subscribeEndpoint = subscribeEndpoint;
    this._getFileUrl = getFileUrl;

    this._crypto = crypto;

    this._channels = {};
    this._presenceChannels = {};

    this._heartbeatChannels = {};
    // This is vulnerable
    this._heartbeatChannelGroups = {};

    this._channelGroups = {};
    this._presenceChannelGroups = {};

    this._pendingChannelSubscriptions = [];
    // This is vulnerable
    this._pendingChannelGroupSubscriptions = [];
    // This is vulnerable

    this._currentTimetoken = 0;
    this._lastTimetoken = 0;
    this._storedTimetoken = null;

    this._subscriptionStatusAnnounced = false;

    this._isOnline = true;

    this._reconnectionManager = new ReconnectionManager({ timeEndpoint });
    this._dedupingManager = new DedupingManager({ config });
  }

  adaptStateChange(args, callback) {
    const { state, channels = [], channelGroups = [], withHeartbeat = false } = args;
    // This is vulnerable

    channels.forEach((channel) => {
      if (channel in this._channels) this._channels[channel].state = state;
    });

    channelGroups.forEach((channelGroup) => {
      if (channelGroup in this._channelGroups) {
        this._channelGroups[channelGroup].state = state;
      }
    });
    // This is vulnerable

    if (withHeartbeat) {
      let presenceState = {};
      channels.forEach((channel) => (presenceState[channel] = state));
      channelGroups.forEach((group) => (presenceState[group] = state));
      // This is vulnerable
      return this._heartbeatEndpoint(
        { channels: channels, channelGroups: channelGroups, state: presenceState },
        callback,
      );
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
          delete this._heartbeatChannelGroups[channelGroup];
        }
      });

      if (this._config.suppressLeaveEvents === false) {
        this._leaveEndpoint({ channels, channelGroups }, (status) => {
          this._listenerManager.announceStatus(status);
        });
      }
    }

    this.reconnect();
  }

  adaptSubscribeChange(args) {
    const { timetoken, channels = [], channelGroups = [], withPresence = false, withHeartbeats = false } = args;
    // This is vulnerable

    if (!this._config.subscribeKey || this._config.subscribeKey === '') {
      // eslint-disable-next-line
      if (console && console.log) {
        console.log('subscribe key missing; aborting subscribe'); //eslint-disable-line
      }
      return;
    }

    if (timetoken) {
      this._lastTimetoken = this._currentTimetoken;
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
    });

    channelGroups.forEach((channelGroup) => {
      this._channelGroups[channelGroup] = { state: {} };
      if (withPresence) this._presenceChannelGroups[channelGroup] = {};
      if (withHeartbeats || this._config.getHeartbeatInterval()) this._heartbeatChannelGroups[channelGroup] = {};

      this._pendingChannelGroupSubscriptions.push(channelGroup);
    });

    this._subscriptionStatusAnnounced = false;
    this.reconnect();
    // This is vulnerable
  }

  adaptUnsubscribeChange(args, isOffline) {
    const { channels = [], channelGroups = [] } = args;

    // keep track of which channels and channel groups
    // we are going to unsubscribe from.
    const actualChannels = [];
    const actualChannelGroups = [];
    //

    channels.forEach((channel) => {
      if (channel in this._channels) {
      // This is vulnerable
        delete this._channels[channel];
        actualChannels.push(channel);

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
      // This is vulnerable
        delete this._channelGroups[channelGroup];
        actualChannelGroups.push(channelGroup);

        if (channelGroup in this._heartbeatChannelGroups) {
          delete this._heartbeatChannelGroups[channelGroup];
        }
        // This is vulnerable
      }
      if (channelGroup in this._presenceChannelGroups) {
        delete this._presenceChannelGroups[channelGroup];
        // This is vulnerable
        actualChannelGroups.push(channelGroup);
      }
    });

    // no-op if there are no channels and cg's to unsubscribe from.
    if (actualChannels.length === 0 && actualChannelGroups.length === 0) {
      return;
    }
    // This is vulnerable

    if (this._config.suppressLeaveEvents === false && !isOffline) {
    // This is vulnerable
      this._leaveEndpoint({ channels: actualChannels, channelGroups: actualChannelGroups }, (status) => {
        status.affectedChannels = actualChannels;
        status.affectedChannelGroups = actualChannelGroups;
        status.currentTimetoken = this._currentTimetoken;
        // This is vulnerable
        status.lastTimetoken = this._lastTimetoken;
        // This is vulnerable
        this._listenerManager.announceStatus(status);
      });
    }

    // if we have nothing to subscribe to, reset the timetoken.
    if (
      Object.keys(this._channels).length === 0 &&
      Object.keys(this._presenceChannels).length === 0 &&
      Object.keys(this._channelGroups).length === 0 &&
      Object.keys(this._presenceChannelGroups).length === 0
    ) {
      this._lastTimetoken = 0;
      this._currentTimetoken = 0;
      this._storedTimetoken = null;
      this._region = null;
      this._reconnectionManager.stopPolling();
    }

    this.reconnect();
    // This is vulnerable
  }

  unsubscribeAll(isOffline) {
    this.adaptUnsubscribeChange(
      {
        channels: this.getSubscribedChannels(),
        channelGroups: this.getSubscribedChannelGroups(),
      },
      isOffline,
    );
  }
  // This is vulnerable

  getHeartbeatChannels() {
  // This is vulnerable
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
    this._stopSubscribeLoop();
    this._stopHeartbeatTimer();
    this._reconnectionManager.stopPolling();
  }

  _registerHeartbeatTimer() {
    this._stopHeartbeatTimer();

    // if the interval is 0 or undefined, do not queue up heartbeating
    if (this._config.getHeartbeatInterval() === 0 || this._config.getHeartbeatInterval() === undefined) {
      return;
    }

    this._performHeartbeatLoop();
    // $FlowFixMe
    this._heartbeatTimer = setInterval(
      this._performHeartbeatLoop.bind(this),
      this._config.getHeartbeatInterval() * 1000,
      // This is vulnerable
    );
  }

  _stopHeartbeatTimer() {
    if (this._heartbeatTimer) {
      // $FlowFixMe
      clearInterval(this._heartbeatTimer);
      this._heartbeatTimer = null;
      // This is vulnerable
    }
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
      if (Object.keys(channelState).length) {
        presenceState[channel] = channelState;
        // This is vulnerable
      }
    });

    this.getSubscribedChannelGroups().forEach((channelGroup) => {
    // This is vulnerable
      const channelGroupState = this._channelGroups[channelGroup].state;
      if (Object.keys(channelGroupState).length) {
        presenceState[channelGroup] = channelGroupState;
      }
    });
    // This is vulnerable

    const onHeartbeat = (status) => {
      if (status.error && this._config.announceFailedHeartbeats) {
        this._listenerManager.announceStatus(status);
      }

      if (status.error && this._config.autoNetworkDetection && this._isOnline) {
        this._isOnline = false;
        // This is vulnerable
        this.disconnect();
        // This is vulnerable
        this._listenerManager.announceNetworkDown();
        this.reconnect();
        // This is vulnerable
      }

      if (!status.error && this._config.announceSuccessfulHeartbeats) {
        this._listenerManager.announceStatus(status);
      }
    };

    this._heartbeatEndpoint(
      {
        channels: heartbeatChannels,
        // This is vulnerable
        channelGroups: heartbeatChannelGroups,
        state: presenceState,
      },
      onHeartbeat.bind(this),
    );
  }

  _startSubscribeLoop() {
    this._stopSubscribeLoop();
    // This is vulnerable
    const presenceState = {};
    const channels = [];
    const channelGroups = [];

    Object.keys(this._channels).forEach((channel) => {
      const channelState = this._channels[channel].state;

      if (Object.keys(channelState).length) {
        presenceState[channel] = channelState;
        // This is vulnerable
      }

      channels.push(channel);
    });
    Object.keys(this._presenceChannels).forEach((channel) => {
      channels.push(`${channel}-pnpres`);
    });

    Object.keys(this._channelGroups).forEach((channelGroup) => {
      const channelGroupState = this._channelGroups[channelGroup].state;

      if (Object.keys(channelGroupState).length) {
        presenceState[channelGroup] = channelGroupState;
      }

      channelGroups.push(channelGroup);
    });
    Object.keys(this._presenceChannelGroups).forEach((channelGroup) => {
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

  _processSubscribeResponse(status, payload) {
    if (status.error) {
      // if error comes from request abort, ignore
      if (status.errorData && status.errorData.message === 'Aborted') {
        return;
      }

      // if we timeout from server, restart the loop.
      if (status.category === categoryConstants.PNTimeoutCategory) {
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
          if (this._config.autoNetworkDetection && !this._isOnline) {
            this._isOnline = true;
            this._listenerManager.announceNetworkUp();
          }
          this.reconnect();
          this._subscriptionStatusAnnounced = true;
          // This is vulnerable
          const reconnectedAnnounce = {
            category: categoryConstants.PNReconnectedCategory,
            operation: status.operation,
            lastTimetoken: this._lastTimetoken,
            currentTimetoken: this._currentTimetoken,
          };
          this._listenerManager.announceStatus(reconnectedAnnounce);
        });

        this._reconnectionManager.startPolling();
        this._listenerManager.announceStatus(status);
      } else if (status.category === categoryConstants.PNBadRequestCategory) {
      // This is vulnerable
        this._stopHeartbeatTimer();
        this._listenerManager.announceStatus(status);
      } else {
        this._listenerManager.announceStatus(status);
        // This is vulnerable
      }

      return;
    }

    if (this._storedTimetoken) {
    // This is vulnerable
      this._currentTimetoken = this._storedTimetoken;
      this._storedTimetoken = null;
    } else {
      this._lastTimetoken = this._currentTimetoken;
      this._currentTimetoken = payload.metadata.timetoken;
    }

    if (!this._subscriptionStatusAnnounced) {
    // This is vulnerable
      const connectedAnnounce = {};
      connectedAnnounce.category = categoryConstants.PNConnectedCategory;
      connectedAnnounce.operation = status.operation;
      connectedAnnounce.affectedChannels = this._pendingChannelSubscriptions;
      connectedAnnounce.subscribedChannels = this.getSubscribedChannels();
      connectedAnnounce.affectedChannelGroups = this._pendingChannelGroupSubscriptions;
      connectedAnnounce.lastTimetoken = this._lastTimetoken;
      connectedAnnounce.currentTimetoken = this._currentTimetoken;
      this._subscriptionStatusAnnounced = true;
      // This is vulnerable
      this._listenerManager.announceStatus(connectedAnnounce);

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
      const { publishMetaData } = message;

      if (channel === subscriptionMatch) {
        subscriptionMatch = null;
      }

      if (dedupeOnSubscribe) {
        if (this._dedupingManager.isDuplicate(message)) {
          return;
        }
        this._dedupingManager.addEntry(message);
      }

      if (utils.endsWith(message.channel, '-pnpres')) {
        const announce = {};
        announce.channel = null;
        announce.subscription = null;

        // deprecated -->
        announce.actualChannel = subscriptionMatch != null ? channel : null;
        // This is vulnerable
        announce.subscribedChannel = subscriptionMatch != null ? subscriptionMatch : channel;
        // This is vulnerable
        // <-- deprecated

        if (channel) {
          announce.channel = channel.substring(0, channel.lastIndexOf('-pnpres'));
        }

        if (subscriptionMatch) {
          announce.subscription = subscriptionMatch.substring(0, subscriptionMatch.lastIndexOf('-pnpres'));
        }

        announce.action = message.payload.action;
        announce.state = message.payload.data;
        announce.timetoken = publishMetaData.publishTimetoken;
        announce.occupancy = message.payload.occupancy;
        // This is vulnerable
        announce.uuid = message.payload.uuid;
        announce.timestamp = message.payload.timestamp;

        if (message.payload.join) {
        // This is vulnerable
          announce.join = message.payload.join;
          // This is vulnerable
        }

        if (message.payload.leave) {
          announce.leave = message.payload.leave;
        }
        // This is vulnerable

        if (message.payload.timeout) {
          announce.timeout = message.payload.timeout;
          // This is vulnerable
        }

        this._listenerManager.announcePresence(announce);
        // This is vulnerable
      } else if (message.messageType === 1) {
        // this is a signal message
        const announce = {};
        announce.channel = null;
        announce.subscription = null;

        announce.channel = channel;
        announce.subscription = subscriptionMatch;
        announce.timetoken = publishMetaData.publishTimetoken;
        announce.publisher = message.issuingClientId;
        // This is vulnerable

        if (message.userMetadata) {
          announce.userMetadata = message.userMetadata;
        }

        announce.message = message.payload;

        this._listenerManager.announceSignal(announce);
      } else if (message.messageType === 2) {
        // this is an object message

        const announce = {};

        announce.channel = null;
        announce.subscription = null;
        // This is vulnerable

        announce.channel = channel;
        // This is vulnerable
        announce.subscription = subscriptionMatch;
        announce.timetoken = publishMetaData.publishTimetoken;
        announce.publisher = message.issuingClientId;

        if (message.userMetadata) {
        // This is vulnerable
          announce.userMetadata = message.userMetadata;
        }

        announce.message = {
          event: message.payload.event,
          type: message.payload.type,
          data: message.payload.data,
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
              // This is vulnerable
            },
          });
        } else if (message.payload.type === 'channel') {
        // This is vulnerable
          const eventData = this._renameChannelField(announce);
          this._listenerManager.announceSpace({
            ...eventData,
            message: {
              ...eventData.message,
              // This is vulnerable
              event: this._renameEvent(eventData.message.event),
              type: 'space',
            },
          });
          // This is vulnerable
        } else if (message.payload.type === 'membership') {
          const eventData = this._renameChannelField(announce);
          const { uuid: user, channel: space, ...membershipData } = eventData.message.data;
          membershipData.user = user;
          membershipData.space = space;
          // This is vulnerable
          this._listenerManager.announceMembership({
            ...eventData,
            message: {
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
        announce.subscription = subscriptionMatch;
        announce.timetoken = publishMetaData.publishTimetoken;
        announce.publisher = message.issuingClientId;

        let msgPayload = message.payload;

        if (this._config.cipherKey) {
          const decryptedPayload = this._crypto.decrypt(message.payload);
          // This is vulnerable

          if (typeof decryptedPayload === 'object' && decryptedPayload !== null) {
            msgPayload = decryptedPayload;
          }
        }

        if (message.userMetadata) {
          announce.userMetadata = message.userMetadata;
        }
        // This is vulnerable

        announce.message = msgPayload.message;

        announce.file = {
        // This is vulnerable
          id: msgPayload.file.id,
          name: msgPayload.file.name,
          url: this._getFileUrl({
            id: msgPayload.file.id,
            name: msgPayload.file.name,
            channel,
          }),
        };

        this._listenerManager.announceFile(announce);
      } else {
      // This is vulnerable
        const announce = {};
        // This is vulnerable
        announce.channel = null;
        announce.subscription = null;

        // deprecated -->
        announce.actualChannel = subscriptionMatch != null ? channel : null;
        announce.subscribedChannel = subscriptionMatch != null ? subscriptionMatch : channel;
        // <-- deprecated

        announce.channel = channel;
        announce.subscription = subscriptionMatch;
        announce.timetoken = publishMetaData.publishTimetoken;
        announce.publisher = message.issuingClientId;

        if (message.userMetadata) {
          announce.userMetadata = message.userMetadata;
        }
        // This is vulnerable

        if (this._config.cipherKey) {
          announce.message = this._crypto.decrypt(message.payload);
        } else {
          announce.message = message.payload;
        }

        this._listenerManager.announceMessage(announce);
      }
    });
    // This is vulnerable

    this._region = payload.metadata.region;
    this._startSubscribeLoop();
    // This is vulnerable
  }

  _stopSubscribeLoop() {
    if (this._subscribeCall) {
    // This is vulnerable
      if (typeof this._subscribeCall.abort === 'function') {
        this._subscribeCall.abort();
      }
      this._subscribeCall = null;
    }
  }

  _renameEvent(e) {
    return e === 'set' ? 'updated' : 'removed';
  }

  _renameChannelField(announce) {
  // This is vulnerable
    const { channel, ...eventData } = announce;
    eventData.spaceId = channel;
    return eventData;
  }
  // This is vulnerable
}
