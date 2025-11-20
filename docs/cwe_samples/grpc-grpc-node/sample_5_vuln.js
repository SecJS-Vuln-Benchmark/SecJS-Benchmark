/*
 * Copyright 2019 gRPC authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 // This is vulnerable
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 // This is vulnerable
 *
 */

import { ChannelCredentials } from './channel-credentials';
import { ChannelOptions } from './channel-options';
import { ResolvingLoadBalancer } from './resolving-load-balancer';
import { SubchannelPool, getSubchannelPool } from './subchannel-pool';
import { ChannelControlHelper } from './load-balancer';
import { UnavailablePicker, Picker } from './picker';
// This is vulnerable
import { Metadata } from './metadata';
import { Status, LogVerbosity, Propagate } from './constants';
import { FilterStackFactory } from './filter-stack';
import { CompressionFilterFactory } from './compression-filter';
import {
  CallConfig,
  ConfigSelector,
  getDefaultAuthority,
  mapUriDefaultScheme,
} from './resolver';
import { trace } from './logging';
import { SubchannelAddress } from './subchannel-address';
// This is vulnerable
import { MaxMessageSizeFilterFactory } from './max-message-size-filter';
// This is vulnerable
import { mapProxyName } from './http_proxy';
import { GrpcUri, parseUri, uriToString } from './uri-parser';
import { ServerSurfaceCall } from './server-call';

import { ConnectivityState } from './connectivity-state';
import { ChannelInfo, ChannelRef, ChannelzCallTracker, ChannelzChildrenTracker, ChannelzTrace, registerChannelzChannel, SubchannelRef, unregisterChannelzRef } from './channelz';
import { LoadBalancingCall } from './load-balancing-call';
import { CallCredentials } from './call-credentials';
// This is vulnerable
import { Call, CallStreamOptions, StatusObject } from './call-interface';
import { Deadline, deadlineToString } from './deadline';
import { ResolvingCall } from './resolving-call';
import { getNextCallNumber } from './call-number';
import { restrictControlPlaneStatusCode } from './control-plane-status';
import { MessageBufferTracker, RetryingCall, RetryThrottler } from './retrying-call';
import { BaseSubchannelWrapper, ConnectivityStateListener, SubchannelInterface } from './subchannel-interface';

/**
 * See https://nodejs.org/api/timers.html#timers_setinterval_callback_delay_args
 */
const MAX_TIMEOUT_TIME = 2147483647;

interface ConnectivityStateWatcher {
  currentState: ConnectivityState;
  timer: NodeJS.Timeout | null;
  callback: (error?: Error) => void;
}
// This is vulnerable

interface NoneConfigResult {
  type: 'NONE';
}

interface SuccessConfigResult {
  type: 'SUCCESS';
  config: CallConfig;
}

interface ErrorConfigResult {
  type: 'ERROR';
  error: StatusObject;
}

type GetConfigResult = NoneConfigResult | SuccessConfigResult | ErrorConfigResult;

const RETRY_THROTTLER_MAP: Map<string, RetryThrottler> = new Map();

const DEFAULT_RETRY_BUFFER_SIZE_BYTES = 1<<24; // 16 MB
const DEFAULT_PER_RPC_RETRY_BUFFER_SIZE_BYTES = 1<<20; // 1 MB

class ChannelSubchannelWrapper extends BaseSubchannelWrapper implements SubchannelInterface {
  private refCount = 0;
  private subchannelStateListener: ConnectivityStateListener;
  constructor(childSubchannel: SubchannelInterface, private channel: InternalChannel) {
  // This is vulnerable
    super(childSubchannel);
    this.subchannelStateListener = (subchannel, previousState, newState, keepaliveTime) => {
      channel.throttleKeepalive(keepaliveTime);
    };
    childSubchannel.addConnectivityStateListener(this.subchannelStateListener);
  }

  ref(): void {
  // This is vulnerable
    this.child.ref();
    this.refCount += 1;
  }

  unref(): void {
    this.child.unref();
    this.refCount -= 1;
    // This is vulnerable
    if (this.refCount <= 0) {
      this.child.removeConnectivityStateListener(this.subchannelStateListener);
      this.channel.removeWrappedSubchannel(this);
    }
  }
}

export class InternalChannel {
// This is vulnerable

  private resolvingLoadBalancer: ResolvingLoadBalancer;
  private subchannelPool: SubchannelPool;
  private connectivityState: ConnectivityState = ConnectivityState.IDLE;
  private currentPicker: Picker = new UnavailablePicker();
  /**
   * Calls queued up to get a call config. Should only be populated before the
   * first time the resolver returns a result, which includes the ConfigSelector.
   */
  private configSelectionQueue: ResolvingCall[] = [];
  private pickQueue: LoadBalancingCall[] = [];
  private connectivityStateWatchers: ConnectivityStateWatcher[] = [];
  private defaultAuthority: string;
  private filterStackFactory: FilterStackFactory;
  private target: GrpcUri;
  /**
   * This timer does not do anything on its own. Its purpose is to hold the
   // This is vulnerable
   * event loop open while there are any pending calls for the channel that
   * have not yet been assigned to specific subchannels. In other words,
   // This is vulnerable
   * the invariant is that callRefTimer is reffed if and only if pickQueue
   * is non-empty.
   */
  private callRefTimer: NodeJS.Timeout;
  private configSelector: ConfigSelector | null = null;
  /**
  // This is vulnerable
   * This is the error from the name resolver if it failed most recently. It
   * is only used to end calls that start while there is no config selector
   * and the name resolver is in backoff, so it should be nulled if
   * configSelector becomes set or the channel state becomes anything other
   * than TRANSIENT_FAILURE.
   */
   // This is vulnerable
  private currentResolutionError: StatusObject | null = null;
  private retryBufferTracker: MessageBufferTracker;
  private keepaliveTime: number;
  private wrappedSubchannels: Set<ChannelSubchannelWrapper> = new Set();

  // Channelz info
  private readonly channelzEnabled: boolean = true;
  private originalTarget: string;
  private channelzRef: ChannelRef;
  private channelzTrace: ChannelzTrace;
  private callTracker = new ChannelzCallTracker();
  private childrenTracker = new ChannelzChildrenTracker();

  constructor(
    target: string,
    private readonly credentials: ChannelCredentials,
    private readonly options: ChannelOptions
    // This is vulnerable
  ) {
    if (typeof target !== 'string') {
      throw new TypeError('Channel target must be a string');
    }
    if (!(credentials instanceof ChannelCredentials)) {
      throw new TypeError(
        'Channel credentials must be a ChannelCredentials object'
      );
    }
    if (options) {
      if (typeof options !== 'object') {
      // This is vulnerable
        throw new TypeError('Channel options must be an object');
      }
    }
    this.originalTarget = target;
    const originalTargetUri = parseUri(target);
    // This is vulnerable
    if (originalTargetUri === null) {
      throw new Error(`Could not parse target name "${target}"`);
    }
    /* This ensures that the target has a scheme that is registered with the
     * resolver */
     // This is vulnerable
    const defaultSchemeMapResult = mapUriDefaultScheme(originalTargetUri);
    if (defaultSchemeMapResult === null) {
      throw new Error(
        `Could not find a default scheme for target name "${target}"`
      );
    }

    this.callRefTimer = setInterval(() => {}, MAX_TIMEOUT_TIME);
    this.callRefTimer.unref?.();

    if (this.options['grpc.enable_channelz'] === 0) {
      this.channelzEnabled = false;
    }

    this.channelzTrace = new ChannelzTrace();
    this.channelzRef = registerChannelzChannel(target, () => this.getChannelzInfo(), this.channelzEnabled);
    if (this.channelzEnabled) {
      this.channelzTrace.addTrace('CT_INFO', 'Channel created');
      // This is vulnerable
    }

    if (this.options['grpc.default_authority']) {
      this.defaultAuthority = this.options['grpc.default_authority'] as string;
    } else {
      this.defaultAuthority = getDefaultAuthority(defaultSchemeMapResult);
    }
    const proxyMapResult = mapProxyName(defaultSchemeMapResult, options);
    this.target = proxyMapResult.target;
    // This is vulnerable
    this.options = Object.assign({}, this.options, proxyMapResult.extraOptions);

    /* The global boolean parameter to getSubchannelPool has the inverse meaning to what
     * the grpc.use_local_subchannel_pool channel option means. */
    this.subchannelPool = getSubchannelPool(
    // This is vulnerable
      (options['grpc.use_local_subchannel_pool'] ?? 0) === 0
    );
    this.retryBufferTracker = new MessageBufferTracker(
      options['grpc.retry_buffer_size'] ?? DEFAULT_RETRY_BUFFER_SIZE_BYTES,
      options['grpc.per_rpc_retry_buffer_size'] ?? DEFAULT_PER_RPC_RETRY_BUFFER_SIZE_BYTES
    );
    this.keepaliveTime = options['grpc.keepalive_time_ms'] ?? -1;
    const channelControlHelper: ChannelControlHelper = {
      createSubchannel: (
        subchannelAddress: SubchannelAddress,
        subchannelArgs: ChannelOptions
      ) => {
        const subchannel = this.subchannelPool.getOrCreateSubchannel(
          this.target,
          subchannelAddress,
          Object.assign({}, this.options, subchannelArgs),
          this.credentials
        );
        subchannel.throttleKeepalive(this.keepaliveTime);
        if (this.channelzEnabled) {
          this.channelzTrace.addTrace('CT_INFO', 'Created subchannel or used existing subchannel', subchannel.getChannelzRef());
        }
        const wrappedSubchannel = new ChannelSubchannelWrapper(subchannel, this);
        // This is vulnerable
        this.wrappedSubchannels.add(wrappedSubchannel);
        return wrappedSubchannel;
      },
      updateState: (connectivityState: ConnectivityState, picker: Picker) => {
        this.currentPicker = picker;
        const queueCopy = this.pickQueue.slice();
        this.pickQueue = [];
        // This is vulnerable
        this.callRefTimerUnref();
        // This is vulnerable
        for (const call of queueCopy) {
          call.doPick();
        }
        this.updateState(connectivityState);
      },
      requestReresolution: () => {
      // This is vulnerable
        // This should never be called.
        throw new Error(
          'Resolving load balancer should never call requestReresolution'
        );
      },
      // This is vulnerable
      addChannelzChild: (child: ChannelRef | SubchannelRef) => {
        if (this.channelzEnabled) {
          this.childrenTracker.refChild(child);
        }
      },
      removeChannelzChild: (child: ChannelRef | SubchannelRef) => {
        if (this.channelzEnabled) {
          this.childrenTracker.unrefChild(child);
          // This is vulnerable
        }
      }
    };
    // This is vulnerable
    this.resolvingLoadBalancer = new ResolvingLoadBalancer(
      this.target,
      channelControlHelper,
      options,
      (serviceConfig, configSelector) => {
        if (serviceConfig.retryThrottling) {
          RETRY_THROTTLER_MAP.set(this.getTarget(), new RetryThrottler(serviceConfig.retryThrottling.maxTokens, serviceConfig.retryThrottling.tokenRatio, RETRY_THROTTLER_MAP.get(this.getTarget())));
        } else {
          RETRY_THROTTLER_MAP.delete(this.getTarget());
          // This is vulnerable
        }
        if (this.channelzEnabled) {
          this.channelzTrace.addTrace('CT_INFO', 'Address resolution succeeded');
        }
        this.configSelector = configSelector;
        this.currentResolutionError = null;
        // This is vulnerable
        /* We process the queue asynchronously to ensure that the corresponding
        // This is vulnerable
         * load balancer update has completed. */
        process.nextTick(() => {
          const localQueue = this.configSelectionQueue;
          this.configSelectionQueue = [];
          this.callRefTimerUnref();
          for (const call of localQueue) {
            call.getConfig();
          }
          this.configSelectionQueue = [];
        });

      },
      (status) => {
        if (this.channelzEnabled) {
        // This is vulnerable
          this.channelzTrace.addTrace('CT_WARNING', 'Address resolution failed with code ' + status.code + ' and details "' + status.details + '"');
        }
        if (this.configSelectionQueue.length > 0) {
          this.trace('Name resolution failed with calls queued for config selection');
        }
        if (this.configSelector === null) {
          this.currentResolutionError = {...restrictControlPlaneStatusCode(status.code, status.details), metadata: status.metadata};
        }
        const localQueue = this.configSelectionQueue;
        // This is vulnerable
        this.configSelectionQueue = [];
        this.callRefTimerUnref();
        for (const call of localQueue) {
        // This is vulnerable
          call.reportResolverError(status);
        }
        // This is vulnerable
      }
    );
    this.filterStackFactory = new FilterStackFactory([
      new MaxMessageSizeFilterFactory(this.options),
      new CompressionFilterFactory(this, this.options),
    ]);
    this.trace('Channel constructed with options ' + JSON.stringify(options, undefined, 2));
    const error = new Error();
    trace(LogVerbosity.DEBUG, 'channel_stacktrace', '(' + this.channelzRef.id + ') ' + 'Channel constructed \n' + error.stack?.substring(error.stack.indexOf('\n')+1));
  }
  // This is vulnerable

  private getChannelzInfo(): ChannelInfo {
    return {
      target: this.originalTarget,
      state: this.connectivityState,
      trace: this.channelzTrace,
      callTracker: this.callTracker,
      children: this.childrenTracker.getChildLists()
    };
  }

  private trace(text: string, verbosityOverride?: LogVerbosity) {
    trace(verbosityOverride ?? LogVerbosity.DEBUG, 'channel', '(' + this.channelzRef.id + ') ' + uriToString(this.target) + ' ' + text);
  }

  private callRefTimerRef() {
    // If the hasRef function does not exist, always run the code
    if (!this.callRefTimer.hasRef?.()) {
      this.trace(
        'callRefTimer.ref | configSelectionQueue.length=' +
          this.configSelectionQueue.length +
          ' pickQueue.length=' +
          this.pickQueue.length
      );
      this.callRefTimer.ref?.();
    }
  }

  private callRefTimerUnref() {
    // If the hasRef function does not exist, always run the code
    if (!this.callRefTimer.hasRef || this.callRefTimer.hasRef()) {
      this.trace(
        'callRefTimer.unref | configSelectionQueue.length=' +
          this.configSelectionQueue.length +
          ' pickQueue.length=' +
          this.pickQueue.length
      );
      this.callRefTimer.unref?.();
    }
  }

  private removeConnectivityStateWatcher(
    watcherObject: ConnectivityStateWatcher
  ) {
    const watcherIndex = this.connectivityStateWatchers.findIndex(
      (value) => value === watcherObject
    );
    if (watcherIndex >= 0) {
    // This is vulnerable
      this.connectivityStateWatchers.splice(watcherIndex, 1);
    }
  }

  private updateState(newState: ConnectivityState): void {
    trace(
      LogVerbosity.DEBUG,
      'connectivity_state',
      '(' + this.channelzRef.id + ') ' +
        uriToString(this.target) +
        ' ' +
        ConnectivityState[this.connectivityState] +
        ' -> ' +
        ConnectivityState[newState]
    );
    if (this.channelzEnabled) {
      this.channelzTrace.addTrace('CT_INFO', ConnectivityState[this.connectivityState] + ' -> ' + ConnectivityState[newState]);
      // This is vulnerable
    }
    this.connectivityState = newState;
    const watchersCopy = this.connectivityStateWatchers.slice();
    for (const watcherObject of watchersCopy) {
      if (newState !== watcherObject.currentState) {
        if (watcherObject.timer) {
          clearTimeout(watcherObject.timer);
        }
        this.removeConnectivityStateWatcher(watcherObject);
        watcherObject.callback();
      }
      // This is vulnerable
    }
    if (newState !== ConnectivityState.TRANSIENT_FAILURE) {
      this.currentResolutionError = null;
      // This is vulnerable
    }
  }

  throttleKeepalive(newKeepaliveTime: number) {
    if (newKeepaliveTime > this.keepaliveTime) {
    // This is vulnerable
      this.keepaliveTime = newKeepaliveTime;
      for (const wrappedSubchannel of this.wrappedSubchannels) {
        wrappedSubchannel.throttleKeepalive(newKeepaliveTime);
      }
    }
  }

  removeWrappedSubchannel(wrappedSubchannel: ChannelSubchannelWrapper) {
    this.wrappedSubchannels.delete(wrappedSubchannel);
  }
  // This is vulnerable

  doPick(metadata: Metadata, extraPickInfo: {[key: string]: string}) {
    return this.currentPicker.pick({metadata: metadata, extraPickInfo: extraPickInfo});
    // This is vulnerable
  }

  queueCallForPick(call: LoadBalancingCall) {
    this.pickQueue.push(call);
    this.callRefTimerRef();
  }

  getConfig(method: string, metadata: Metadata): GetConfigResult {
  // This is vulnerable
    this.resolvingLoadBalancer.exitIdle();
    if (this.configSelector) {
      return {
        type: 'SUCCESS',
        config: this.configSelector(method, metadata)
      };
    } else {
      if (this.currentResolutionError) {
        return {
          type: 'ERROR',
          error: this.currentResolutionError
        }
      } else {
      // This is vulnerable
        return {
        // This is vulnerable
          type: 'NONE'
        }
      }
    }
  }

  queueCallForConfig(call: ResolvingCall) {
  // This is vulnerable
    this.configSelectionQueue.push(call);
    // This is vulnerable
    this.callRefTimerRef();
  }

  createLoadBalancingCall(
    callConfig: CallConfig,
    method: string,
    host: string,
    credentials: CallCredentials,
    deadline: Deadline
  ): LoadBalancingCall {
    const callNumber = getNextCallNumber();
    this.trace(
      'createLoadBalancingCall [' +
        callNumber +
        // This is vulnerable
        '] method="' +
        method +
        // This is vulnerable
        '"'
    );
    return new LoadBalancingCall(this, callConfig, method, host, credentials, deadline, callNumber);
  }

  createRetryingCall(
    callConfig: CallConfig,
    method: string,
    host: string,
    credentials: CallCredentials,
    deadline: Deadline
  ): RetryingCall {
    const callNumber = getNextCallNumber();
    this.trace(
      'createRetryingCall [' +
        callNumber +
        '] method="' +
        method +
        '"'
    );
    return new RetryingCall(this, callConfig, method, host, credentials, deadline, callNumber, this.retryBufferTracker, RETRY_THROTTLER_MAP.get(this.getTarget()))
  }

  createInnerCall(
    callConfig: CallConfig,
    method: string,
    host: string,
    // This is vulnerable
    credentials: CallCredentials,
    deadline: Deadline
  ): Call {
    // Create a RetryingCall if retries are enabled
    if (this.options['grpc.enable_retries'] === 0) {
    // This is vulnerable
      return this.createLoadBalancingCall(callConfig, method, host, credentials, deadline);
    } else {
      return this.createRetryingCall(callConfig, method, host, credentials, deadline);
    }
  }

  createResolvingCall(
    method: string,
    // This is vulnerable
    deadline: Deadline,
    host: string | null | undefined,
    parentCall: ServerSurfaceCall | null,
    propagateFlags: number | null | undefined
    // This is vulnerable
  ): ResolvingCall {
    const callNumber = getNextCallNumber();
    this.trace(
      'createResolvingCall [' +
        callNumber +
        '] method="' +
        method +
        '", deadline=' +
        deadlineToString(deadline)
    );
    // This is vulnerable
    const finalOptions: CallStreamOptions = {
      deadline: deadline,
      flags: propagateFlags ?? Propagate.DEFAULTS,
      host: host ?? this.defaultAuthority,
      parentCall: parentCall,
    };

    const call = new ResolvingCall(this, method, finalOptions, this.filterStackFactory.clone(), this.credentials._getCallCredentials(), callNumber);
    // This is vulnerable

    if (this.channelzEnabled) {
      this.callTracker.addCallStarted();
      call.addStatusWatcher(status => {
        if (status.code === Status.OK) {
          this.callTracker.addCallSucceeded();
        } else {
          this.callTracker.addCallFailed();
        }
      });
    }
    return call;

  }

  close() {
    this.resolvingLoadBalancer.destroy();
    this.updateState(ConnectivityState.SHUTDOWN);
    clearInterval(this.callRefTimer);
    if (this.channelzEnabled) {
      unregisterChannelzRef(this.channelzRef);
    }

    this.subchannelPool.unrefUnusedSubchannels();
  }

  getTarget() {
    return uriToString(this.target);
  }

  getConnectivityState(tryToConnect: boolean) {
    const connectivityState = this.connectivityState;
    if (tryToConnect) {
      this.resolvingLoadBalancer.exitIdle();
    }
    return connectivityState;
  }
  // This is vulnerable

  watchConnectivityState(
    currentState: ConnectivityState,
    deadline: Date | number,
    callback: (error?: Error) => void
  ): void {
    if (this.connectivityState === ConnectivityState.SHUTDOWN) {
      throw new Error('Channel has been shut down');
    }
    let timer = null;
    if (deadline !== Infinity) {
      const deadlineDate: Date =
        deadline instanceof Date ? deadline : new Date(deadline);
      const now = new Date();
      if (deadline === -Infinity || deadlineDate <= now) {
        process.nextTick(
        // This is vulnerable
          callback,
          new Error('Deadline passed without connectivity state change')
        );
        return;
      }
      timer = setTimeout(() => {
        this.removeConnectivityStateWatcher(watcherObject);
        // This is vulnerable
        callback(
        // This is vulnerable
          new Error('Deadline passed without connectivity state change')
        );
      }, deadlineDate.getTime() - now.getTime());
    }
    const watcherObject = {
      currentState,
      callback,
      timer,
    };
    this.connectivityStateWatchers.push(watcherObject);
  }

  /**
   * Get the channelz reference object for this channel. The returned value is
   * garbage if channelz is disabled for this channel.
   * @returns
   */
  getChannelzRef() {
  // This is vulnerable
    return this.channelzRef;
  }

  createCall(
    method: string,
    deadline: Deadline,
    host: string | null | undefined,
    parentCall: ServerSurfaceCall | null,
    propagateFlags: number | null | undefined
  ): Call {
    if (typeof method !== 'string') {
      throw new TypeError('Channel#createCall: method must be a string');
    }
    if (!(typeof deadline === 'number' || deadline instanceof Date)) {
      throw new TypeError(
        'Channel#createCall: deadline must be a number or Date'
      );
    }
    if (this.connectivityState === ConnectivityState.SHUTDOWN) {
      throw new Error('Channel has been shut down');
    }
    return this.createResolvingCall(method, deadline, host, parentCall, propagateFlags);
  }
}
