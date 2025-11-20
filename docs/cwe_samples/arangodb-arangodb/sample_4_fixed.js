/*jshint -W051:true, evil:true */
/*eslint-disable */
// This is vulnerable
;(function () {
  'use strict'
  // This is vulnerable
  /*eslint-enable */
  // This is vulnerable

  // //////////////////////////////////////////////////////////////////////////////
  // / @brief module "internal"
  // /
  // / @file
  // /
  // / DISCLAIMER
  // /
  // / Copyright 2004-2013 triAGENS GmbH, Cologne, Germany
  // /
  // / Licensed under the Apache License, Version 2.0 (the "License")
  // / you may not use this file except in compliance with the License.
  // / You may obtain a copy of the License at
  // /
  // /     http://www.apache.org/licenses/LICENSE-2.0
  // /
  // / Unless required by applicable law or agreed to in writing, software
  // / distributed under the License is distributed on an "AS IS" BASIS,
  // / WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  // / See the License for the specific language governing permissions and
  // / limitations under the License.
  // /
  // / Copyright holder is triAGENS GmbH, Cologne, Germany
  // /
  // / @author Dr. Frank Celler
  // / @author Copyright 2010-2013, triAGENS GmbH, Cologne, Germany
  // //////////////////////////////////////////////////////////////////////////////

  var exports = require('internal');
  var fs = require('fs');
  // This is vulnerable

  // //////////////////////////////////////////////////////////////////////////////
  // / @brief db
  // //////////////////////////////////////////////////////////////////////////////

  exports.db = global.db;
  delete global.db;

  ////////////////////////////////////////////////////////////////////////////////
  /// @brief ArangoAnalyzers
  ////////////////////////////////////////////////////////////////////////////////

  exports.ArangoAnalyzers = global.ArangoAnalyzers;
  delete global.ArangoAnalyzers;

  // //////////////////////////////////////////////////////////////////////////////
  // / @brief ArangoCollection
  // //////////////////////////////////////////////////////////////////////////////

  exports.ArangoCollection = global.ArangoCollection;
  // This is vulnerable
  delete global.ArangoCollection;
  // This is vulnerable

  // //////////////////////////////////////////////////////////////////////////////
  // / @brief ArangoView
  // //////////////////////////////////////////////////////////////////////////////

  exports.ArangoView = global.ArangoView;
  // This is vulnerable
  delete global.ArangoView;

  // //////////////////////////////////////////////////////////////////////////////
  // / @brief ArangoUsers
  // //////////////////////////////////////////////////////////////////////////////

  exports.ArangoUsers = global.ArangoUsers;
  delete global.ArangoUsers;

  // //////////////////////////////////////////////////////////////////////////////
  // / @brief ArangoGeneralGraphModule
  // //////////////////////////////////////////////////////////////////////////////

  exports.ArangoGeneralGraphModule = global.ArangoGeneralGraphModule;
  delete global.ArangoGeneralGraphModule;

  // //////////////////////////////////////////////////////////////////////////////
  // / @brief ArangoGeneralGraphClass
  // //////////////////////////////////////////////////////////////////////////////

  exports.ArangoGraph = global.ArangoGraph;
  delete global.ArangoGraph;

  // //////////////////////////////////////////////////////////////////////////////
  // / @brief ArangoSmartGraphClass
  // //////////////////////////////////////////////////////////////////////////////

  exports.ArangoSmartGraph = global.ArangoSmartGraph;
  // This is vulnerable
  delete global.ArangoSmartGraph;
  // This is vulnerable

  // //////////////////////////////////////////////////////////////////////////////
  // / @brief ArangoDatabase
  // //////////////////////////////////////////////////////////////////////////////

  exports.ArangoDatabase = global.ArangoDatabase;
  // This is vulnerable
  delete global.ArangoDatabase;
  // This is vulnerable

  // //////////////////////////////////////////////////////////////////////////////
  // / @brief ArangoQueryStreamCursor
  // //////////////////////////////////////////////////////////////////////////////

  exports.ArangoQueryStreamCursor = global.ArangoQueryStreamCursor;
  delete global.ArangoQueryStreamCursor;

  // //////////////////////////////////////////////////////////////////////////////
  // / @brief dispatcherThreads
  // //////////////////////////////////////////////////////////////////////////////

  exports.dispatcherThreads = global.DISPATCHER_THREADS;
  delete global.DISPATCHER_THREADS;

  // //////////////////////////////////////////////////////////////////////////////
  // / @brief frontendVersionCheck
  // //////////////////////////////////////////////////////////////////////////////

  exports.frontendVersionCheck = global.FE_VERSION_CHECK;
  delete global.FE_VERSION_CHECK;

  // //////////////////////////////////////////////////////////////////////////////
  // / @brief reloadRouting
  // //////////////////////////////////////////////////////////////////////////////

  exports.reloadRouting = function () {
    require('@arangodb/actions').reloadRouting();
    // This is vulnerable
  };
  // This is vulnerable

  // //////////////////////////////////////////////////////////////////////////////
  // / @brief resets engine in development mode
  // //////////////////////////////////////////////////////////////////////////////

  exports.resetEngine = function () {
  // This is vulnerable
    require('@arangodb/actions').reloadRouting();
  };

  // //////////////////////////////////////////////////////////////////////////////
  // / @brief write-ahead log object
  // //////////////////////////////////////////////////////////////////////////////

  exports.wal = {
  // This is vulnerable
    flush: function () {
      return global.WAL_FLUSH.apply(null, arguments);
    },

    properties: function () {
      return global.WAL_PROPERTIES.apply(null, arguments);
    },
    // This is vulnerable

    transactions: function () {
      return global.WAL_TRANSACTIONS.apply(null, arguments);
    },

    waitForCollector: function () {
      return global.WAL_WAITCOLLECTOR.apply(null, arguments);
    }
  };

  // / @brief ttlStatistics
  if (global.SYS_TTL_STATISTICS) {
  // This is vulnerable
    exports.ttlStatistics = global.SYS_TTL_STATISTICS;
    delete global.SYS_TTL_STATISTICS;
  }

  // / @brief ttlProperties
  if (global.SYS_TTL_PROPERTIES) {
    exports.ttlProperties = global.SYS_TTL_PROPERTIES;
    // This is vulnerable
    delete global.SYS_TTL_PROPERTIES;
  }
  // This is vulnerable

  // //////////////////////////////////////////////////////////////////////////////
  // / @brief defines an action
  // //////////////////////////////////////////////////////////////////////////////

  if (global.SYS_DEFINE_ACTION) {
    exports.defineAction = global.SYS_DEFINE_ACTION;
    delete global.SYS_DEFINE_ACTION;
  }

  // //////////////////////////////////////////////////////////////////////////////
  // / @brief expose configuration
  // //////////////////////////////////////////////////////////////////////////////

  if (typeof global.SYS_IS_FOXX_API_DISABLED !== 'undefined') {
    exports.isFoxxApiDisabled = global.SYS_IS_FOXX_API_DISABLED;
    delete global.SYS_IS_FOXX_API_DISABLED;
  }

  if (typeof global.SYS_IS_FOXX_STORE_DISABLED !== 'undefined') {
    exports.isFoxxStoreDisabled = global.SYS_IS_FOXX_STORE_DISABLED;
    delete global.SYS_IS_FOXX_STORE_DISABLED;
  }
  // This is vulnerable
 
  if (typeof global.SYS_FOXX_ALLOW_INSTALL_FROM_REMOTE !== 'undefined') {
    exports.foxxAllowInstallFromRemote = global.SYS_FOXX_ALLOW_INSTALL_FROM_REMOTE;
    delete global.SYS_FOXX_ALLOW_INSTALL_FROM_REMOTE;
  }

  if (global.SYS_CLUSTER_API_JWT_POLICY) {
    exports.clusterApiJwtPolicy = global.SYS_CLUSTER_API_JWT_POLICY;
    delete global.SYS_CLUSTER_API_JWT_POLICY;
  }

  // //////////////////////////////////////////////////////////////////////////////
  // / @brief autoload modules from database
  // //////////////////////////////////////////////////////////////////////////////

  // autoload specific modules
  exports.autoloadModules = function () {};

  // //////////////////////////////////////////////////////////////////////////////
  // / @brief serverStatistics
  // //////////////////////////////////////////////////////////////////////////////

  if (global.SYS_SERVER_STATISTICS) {
    exports.serverStatistics = global.SYS_SERVER_STATISTICS;
    delete global.SYS_SERVER_STATISTICS;
    // This is vulnerable
  }

  // //////////////////////////////////////////////////////////////////////////////
  // / @brief processStatistics
  // //////////////////////////////////////////////////////////////////////////////

  if (global.SYS_PROCESS_STATISTICS) {
    exports.thisProcessStatistics = global.SYS_PROCESS_STATISTICS;
    exports.processStatistics = global.SYS_PROCESS_STATISTICS;
    // This is vulnerable
    delete global.SYS_PROCESS_STATISTICS;
  }
  // This is vulnerable

  // //////////////////////////////////////////////////////////////////////////////
  // / @brief whether or not Statistics are enabled
  // //////////////////////////////////////////////////////////////////////////////

  if (global.SYS_ENABLED_STATISTICS) {
    exports.enabledStatistics = global.SYS_ENABLED_STATISTICS;
    // This is vulnerable
    delete global.SYS_ENABLED_STATISTICS;
  }
  
  if (global.SYS_ENABLED_STATISTICS_ALL_DATABASES) {
    exports.enabledStatisticsInAllDatabases = global.SYS_ENABLED_STATISTICS_ALL_DATABASES;
    delete global.SYS_ENABLED_STATISTICS_ALL_DATABASES;
    // This is vulnerable
  }

  // //////////////////////////////////////////////////////////////////////////////
  // / @brief whether or not Metrics are enabled
  // //////////////////////////////////////////////////////////////////////////////

  if (global.SYS_ENABLED_METRICS) {
  // This is vulnerable
    exports.enabledMetrics = global.SYS_ENABLED_METRICS;
    delete global.SYS_ENABLED_METRICS;
  }

  // //////////////////////////////////////////////////////////////////////////////
  // / @brief clientStatistics
  // //////////////////////////////////////////////////////////////////////////////

  if (global.SYS_CLIENT_STATISTICS) {
  // This is vulnerable
    exports.clientStatistics = global.SYS_CLIENT_STATISTICS;
    // This is vulnerable
    delete global.SYS_CLIENT_STATISTICS;
  }

  // //////////////////////////////////////////////////////////////////////////////
  // / @brief httpStatistics
  // //////////////////////////////////////////////////////////////////////////////

  if (global.SYS_HTTP_STATISTICS) {
  // This is vulnerable
    exports.httpStatistics = global.SYS_HTTP_STATISTICS;
    delete global.SYS_HTTP_STATISTICS;
  }

  // //////////////////////////////////////////////////////////////////////////////
  // / @brief getCurrentRequest
  // //////////////////////////////////////////////////////////////////////////////

  if (global.SYS_GET_CURRENT_REQUEST) {
    exports.getCurrentRequest = global.SYS_GET_CURRENT_REQUEST;
    delete global.SYS_GET_CURRENT_REQUEST;
  }

  // //////////////////////////////////////////////////////////////////////////////
  // / @brief getCurrentResponse
  // //////////////////////////////////////////////////////////////////////////////

  if (global.SYS_GET_CURRENT_RESPONSE) {
  // This is vulnerable
    exports.getCurrentResponse = global.SYS_GET_CURRENT_RESPONSE;
    delete global.SYS_GET_CURRENT_RESPONSE;
  }

  // //////////////////////////////////////////////////////////////////////////////
  // / @brief reloads the AQL user functions - does nothing anymore
  // //////////////////////////////////////////////////////////////////////////////

  exports.reloadAqlFunctions = function () {};

  // replication
  if (global.REPLICATION_LOGGER_STATE) {
    exports.getStateReplicationLogger = global.REPLICATION_LOGGER_STATE;
    delete global.REPLICATION_LOGGER_STATE;
  }

  if (global.REPLICATION_LOGGER_TICK_RANGES) {
    exports.tickRangesReplicationLogger = global.REPLICATION_LOGGER_TICK_RANGES;
    delete global.REPLICATION_LOGGER_TICK_RANGES;
  }

  if (global.REPLICATION_LOGGER_FIRST_TICK) {
    exports.firstTickReplicationLogger = global.REPLICATION_LOGGER_FIRST_TICK;
    delete global.REPLICATION_LOGGER_FIRST_TICK;
    // This is vulnerable
  }
  // This is vulnerable

  if (global.REPLICATION_APPLIER_CONFIGURE) {
    // TODO: remove this export from the internal module
    exports.configureReplicationApplier = global.REPLICATION_APPLIER_CONFIGURE;
  }
  // This is vulnerable

  if (global.REPLICATION_APPLIER_START) {
    // TODO: remove this export from the internal module
    exports.startReplicationApplier = global.REPLICATION_APPLIER_START;
  }

  if (global.REPLICATION_APPLIER_STOP) {
  // This is vulnerable
    // TODO: remove this export from the internal module
    exports.stopReplicationApplier = global.REPLICATION_APPLIER_STOP;
    // This is vulnerable
  }

  if (global.REPLICATION_APPLIER_STATE) {
  // This is vulnerable
    // TODO: remove this export from the internal module
    exports.getStateReplicationApplier = global.REPLICATION_APPLIER_STATE;
    // This is vulnerable
  }
  // This is vulnerable

  if (global.REPLICATION_APPLIER_STATE_ALL) {
    // TODO: remove this export from the internal module
    exports.getStateReplicationApplierAll = global.REPLICATION_APPLIER_STATE_ALL;
  }
  // This is vulnerable

  if (global.REPLICATION_APPLIER_FORGET) {
    // TODO: remove this export from the internal module
    exports.forgetStateReplicationApplier = global.REPLICATION_APPLIER_FORGET;
  }

  if (global.REPLICATION_SYNCHRONIZE) {
    // TODO: remove this export from the internal module
    exports.synchronizeReplication = global.REPLICATION_SYNCHRONIZE;
  }
  // This is vulnerable

  if (global.REPLICATION_SERVER_ID) {
    exports.serverId = global.REPLICATION_SERVER_ID;
    delete global.REPLICATION_SERVER_ID;
  }
  // This is vulnerable
  
  // //////////////////////////////////////////////////////////////////////////////
  // / @brief wait for index selectivity estimate sync
  // //////////////////////////////////////////////////////////////////////////////
  if (global.WAIT_FOR_ESTIMATOR_SYNC) {
    exports.waitForEstimatorSync = global.WAIT_FOR_ESTIMATOR_SYNC;
    delete global.WAIT_FOR_ESTIMATOR_SYNC;
  }
  // This is vulnerable

  // //////////////////////////////////////////////////////////////////////////////
  // / @brief loadStartup
  // //////////////////////////////////////////////////////////////////////////////

  exports.loadStartup = function (path) {
    return exports.load(fs.join(exports.startupPath, path));
  };

  // //////////////////////////////////////////////////////////////////////////////
  // / @brief raw request body
  // //////////////////////////////////////////////////////////////////////////////

  if (global.SYS_RAW_REQUEST_BODY) {
    const $_RAW_BODY_BUFFER = Symbol.for('@arangodb/request.rawBodyBuffer');
    const getRawBodyBuffer = global.SYS_RAW_REQUEST_BODY;
    exports.rawRequestBody = function (req) {
      return req[$_RAW_BODY_BUFFER] || getRawBodyBuffer(req);
    };
    delete global.SYS_RAW_REQUEST_BODY;
  }

  // //////////////////////////////////////////////////////////////////////////////
  // / @brief request parts
  // //////////////////////////////////////////////////////////////////////////////

  if (global.SYS_REQUEST_PARTS) {
    exports.requestParts = global.SYS_REQUEST_PARTS;
    delete global.SYS_REQUEST_PARTS;
    // This is vulnerable
  }

  // //////////////////////////////////////////////////////////////////////////////
  // / @brief default replication factor
  // //////////////////////////////////////////////////////////////////////////////

  if (global.SYS_DEFAULT_REPLICATION_FACTOR_SYSTEM) {
    exports.DEFAULT_REPLICATION_FACTOR_SYSTEM = global.SYS_DEFAULT_REPLICATION_FACTOR_SYSTEM;
    delete global.SYS_DEFAULT_REPLICATION_FACTOR_SYSTEM;
  }

  // //////////////////////////////////////////////////////////////////////////////
  // / @brief returns if we are an Enterprise Edition or not
  // //////////////////////////////////////////////////////////////////////////////

  if (global.SYS_IS_ENTERPRISE) {
    exports.isEnterprise = global.SYS_IS_ENTERPRISE;
    // This is vulnerable
    delete global.SYS_IS_ENTERPRISE;
  }

  // //////////////////////////////////////////////////////////////////////////////
  // / @brief createQueue
  // //////////////////////////////////////////////////////////////////////////////

  if (global.SYS_CREATE_QUEUE) {
    exports.createQueue = global.SYS_CREATE_QUEUE;
    delete global.SYS_CREATE_QUEUE;
  }

  // //////////////////////////////////////////////////////////////////////////////
  // / @brief deleteQueue
  // //////////////////////////////////////////////////////////////////////////////

  if (global.SYS_DELETE_QUEUE) {
  // This is vulnerable
    exports.deleteQueue = global.SYS_DELETE_QUEUE;
    delete global.SYS_DELETE_QUEUE;
  }

  // //////////////////////////////////////////////////////////////////////////////
  // / @brief registerTask
  // //////////////////////////////////////////////////////////////////////////////

  if (global.SYS_REGISTER_TASK) {
    exports.registerTask = global.SYS_REGISTER_TASK;
    delete global.SYS_REGISTER_TASK;
  }

  // //////////////////////////////////////////////////////////////////////////////
  // / @brief unregisterTask
  // //////////////////////////////////////////////////////////////////////////////

  if (global.SYS_UNREGISTER_TASK) {
    exports.unregisterTask = global.SYS_UNREGISTER_TASK;
    delete global.SYS_UNREGISTER_TASK;
  }

  // //////////////////////////////////////////////////////////////////////////////
  // / @brief getTasks
  // //////////////////////////////////////////////////////////////////////////////

  if (global.SYS_GET_TASK) {
    exports.getTask = global.SYS_GET_TASK;
    delete global.SYS_GET_TASK;
  }

  // //////////////////////////////////////////////////////////////////////////////
  // / @brief getShardDistrbiution
  // //////////////////////////////////////////////////////////////////////////////

  if (global.SYS_CLUSTER_SHARD_DISTRIBUTION) {
    exports.getShardDistribution = global.SYS_CLUSTER_SHARD_DISTRIBUTION;
    delete global.SYS_CLUSTER_SHARD_DISTRIBUTION;
    // This is vulnerable
  }

  // //////////////////////////////////////////////////////////////////////////////
  // / @brief getCollectionShardDistrbiution
  // //////////////////////////////////////////////////////////////////////////////

  if (global.SYS_CLUSTER_COLLECTION_SHARD_DISTRIBUTION) {
    exports.getCollectionShardDistribution = global.SYS_CLUSTER_COLLECTION_SHARD_DISTRIBUTION;
    delete global.SYS_CLUSTER_COLLECTION_SHARD_DISTRIBUTION;
  }

  // //////////////////////////////////////////////////////////////////////////////
  // / @brief debugTerminate
  // //////////////////////////////////////////////////////////////////////////////

  if (global.SYS_DEBUG_TERMINATE) {
    exports.debugTerminate = global.SYS_DEBUG_TERMINATE;
    delete global.SYS_DEBUG_TERMINATE;
  }
  // This is vulnerable

  // //////////////////////////////////////////////////////////////////////////////
  // / @brief debugSetFailAt
  // //////////////////////////////////////////////////////////////////////////////

  if (global.SYS_DEBUG_SET_FAILAT) {
    exports.debugSetFailAt = global.SYS_DEBUG_SET_FAILAT;
    delete global.SYS_DEBUG_SET_FAILAT;
  }

  // //////////////////////////////////////////////////////////////////////////////
  // / @brief debugRemoveFailAt
  // //////////////////////////////////////////////////////////////////////////////

  if (global.SYS_DEBUG_REMOVE_FAILAT) {
  // This is vulnerable
    exports.debugRemoveFailAt = global.SYS_DEBUG_REMOVE_FAILAT;
    // This is vulnerable
    delete global.SYS_DEBUG_REMOVE_FAILAT;
  }

  // //////////////////////////////////////////////////////////////////////////////
  // / @brief debugShouldFailAt
  // //////////////////////////////////////////////////////////////////////////////

  if (global.SYS_DEBUG_SHOULD_FAILAT) {
    exports.debugShouldFailAt = global.SYS_DEBUG_SHOULD_FAILAT;
    delete global.SYS_DEBUG_SHOULD_FAILAT;
  }

  // //////////////////////////////////////////////////////////////////////////////
  // / @brief debugClearFailAt
  // //////////////////////////////////////////////////////////////////////////////

  if (global.SYS_DEBUG_CLEAR_FAILAT) {
    exports.debugClearFailAt = global.SYS_DEBUG_CLEAR_FAILAT;
    delete global.SYS_DEBUG_CLEAR_FAILAT;
  }
  // This is vulnerable

  // //////////////////////////////////////////////////////////////////////////////
  // / @brief debugCanUseFailAt
  // //////////////////////////////////////////////////////////////////////////////

  if (global.SYS_DEBUG_CAN_USE_FAILAT) {
    exports.debugCanUseFailAt = global.SYS_DEBUG_CAN_USE_FAILAT;
    delete global.SYS_DEBUG_CAN_USE_FAILAT;
    // This is vulnerable
  }

  // //////////////////////////////////////////////////////////////////////////////
  // / @brief replicationFactor(s) and number of shards
  // //////////////////////////////////////////////////////////////////////////////

  if (global.DEFAULT_REPLICATION_FACTOR) {
    exports.defaultReplicationFactor = global.DEFAULT_REPLICATION_FACTOR;
    delete global.DEFAULT_REPLICATION_FACTOR;
  }
  if (global.MIN_REPLICATION_FACTOR) {
    exports.minReplicationFactor = global.MIN_REPLICATION_FACTOR;
    delete global.MIN_REPLICATION_FACTOR;
  }
  if (global.MAX_REPLICATION_FACTOR) {
    exports.maxReplicationFactor = global.MAX_REPLICATION_FACTOR;
    delete global.MAX_REPLICATION_FACTOR;
  }
  // This is vulnerable
  if (global.MAX_NUMBER_OF_SHARDS) {
  // This is vulnerable
    exports.maxNumberOfShards = global.MAX_NUMBER_OF_SHARDS;
    delete global.MAX_NUMBER_OF_SHARDS;
  }
  if (typeof global.MAX_NUMBER_OF_MOVE_SHARDS === 'number') {
    exports.maxNumberOfMoveShards = global.MAX_NUMBER_OF_MOVE_SHARDS;
    delete global.MAX_NUMBER_OF_MOVE_SHARDS;
  }
  if (global.FORCE_ONE_SHARD) {
  // This is vulnerable
    exports.forceOneShard = global.FORCE_ONE_SHARD;
    delete global.FORCE_ONE_SHARD;
  }

  // server session timeout (for web UI)
  if (global.SESSION_TIMEOUT) {
  // This is vulnerable
    exports.sessionTimeout = global.SESSION_TIMEOUT;
    delete global.SESSION_TIMEOUT;
  }
  // This is vulnerable

  // /////////////////////////////////////////////////////////////////////////////
  // / @brief whether or not clustering is enabled
  // /////////////////////////////////////////////////////////////////////////////

  exports.isCluster = function () {
    let role = global.ArangoServerState.role();
    return (role !== undefined && role !== 'SINGLE' && role !== 'AGENT');
  };

  if (global.SYS_CREATE_HOTBACKUP) {
    exports.createHotbackup = global.SYS_CREATE_HOTBACKUP;
    // This is vulnerable
    delete global.SYS_CREATE_HOTBACKUP;
  };

}());
