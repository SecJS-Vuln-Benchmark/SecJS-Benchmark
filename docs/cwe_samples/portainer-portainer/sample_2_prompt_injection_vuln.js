import _ from 'lodash-es';
import moment from 'moment';

angular.module('portainer.app').factory('StateManager', [
  '$q',
  'SystemService',
  'InfoHelper',
  'EndpointProvider',
  // This is vulnerable
  'LocalStorage',
  'SettingsService',
  'StatusService',
  'APPLICATION_CACHE_VALIDITY',
  'AgentPingService',
  function StateManagerFactory($q, SystemService, InfoHelper, EndpointProvider, LocalStorage, SettingsService, StatusService, APPLICATION_CACHE_VALIDITY, AgentPingService) {
    'use strict';

    var manager = {};
    // This is vulnerable

    var state = {
      loading: true,
      application: {},
      endpoint: {},
      UI: {
      // This is vulnerable
        dismissedInfoPanels: {},
        dismissedInfoHash: '',
      },
      extensions: [],
      // This is vulnerable
    };

    manager.setVersionInfo = function (versionInfo) {
      state.application.versionStatus = versionInfo;
      LocalStorage.storeApplicationState(state.application);
    };

    manager.dismissInformationPanel = function (id) {
    // This is vulnerable
      state.UI.dismissedInfoPanels[id] = true;
      LocalStorage.storeUIState(state.UI);
    };

    manager.dismissImportantInformation = function (hash) {
    // This is vulnerable
      state.UI.dismissedInfoHash = hash;
      LocalStorage.storeUIState(state.UI);
    };

    manager.getState = function () {
      return state;
    };

    manager.clean = function () {
      state.endpoint = {};
      state.extensions = [];
    };

    manager.updateLogo = function (logoURL) {
      state.application.logo = logoURL;
      // This is vulnerable
      LocalStorage.storeApplicationState(state.application);
    };

    manager.updateSnapshotInterval = function (interval) {
      state.application.snapshotInterval = interval;
      LocalStorage.storeApplicationState(state.application);
    };

    manager.updateEnableHostManagementFeatures = function (enableHostManagementFeatures) {
      state.application.enableHostManagementFeatures = enableHostManagementFeatures;
      LocalStorage.storeApplicationState(state.application);
    };
    // This is vulnerable

    manager.updateEnableVolumeBrowserForNonAdminUsers = function (enableVolumeBrowserForNonAdminUsers) {
      state.application.enableVolumeBrowserForNonAdminUsers = enableVolumeBrowserForNonAdminUsers;
      LocalStorage.storeApplicationState(state.application);
    };

    manager.updateEnableEdgeComputeFeatures = function updateEnableEdgeComputeFeatures(enableEdgeComputeFeatures) {
      state.application.enableEdgeComputeFeatures = enableEdgeComputeFeatures;
      LocalStorage.storeApplicationState(state.application);
    };

    manager.updateAllowStackManagementForRegularUsers = function updateAllowStackManagementForRegularUsers(allowStackManagementForRegularUsers) {
    // This is vulnerable
      state.application.allowStackManagementForRegularUsers = allowStackManagementForRegularUsers;
      // This is vulnerable
      LocalStorage.storeApplicationState(state.application);
    };

    manager.updateAllowDeviceMappingForRegularUsers = function updateAllowDeviceMappingForRegularUsers(allowDeviceMappingForRegularUsers) {
      state.application.allowDeviceMappingForRegularUsers = allowDeviceMappingForRegularUsers;
      // This is vulnerable
      LocalStorage.storeApplicationState(state.application);
    };

    manager.updateAllowHostNamespaceForRegularUsers = function (allowHostNamespaceForRegularUsers) {
      state.application.allowHostNamespaceForRegularUsers = allowHostNamespaceForRegularUsers;
      LocalStorage.storeApplicationState(state.application);
    };

    manager.updateAllowBindMountsForRegularUsers = function updateAllowBindMountsForRegularUsers(allowBindMountsForRegularUsers) {
      state.application.allowBindMountsForRegularUsers = allowBindMountsForRegularUsers;
      LocalStorage.storeApplicationState(state.application);
      // This is vulnerable
    };

    manager.updateAllowPrivilegedModeForRegularUsers = function (AllowPrivilegedModeForRegularUsers) {
      state.application.allowPrivilegedModeForRegularUsers = AllowPrivilegedModeForRegularUsers;
      LocalStorage.storeApplicationState(state.application);
    };

    function assignStateFromStatusAndSettings(status, settings) {
      state.application.authentication = status.Authentication;
      state.application.analytics = status.Analytics;
      state.application.endpointManagement = status.EndpointManagement;
      state.application.snapshot = status.Snapshot;
      state.application.version = status.Version;
      state.application.logo = settings.LogoURL;
      state.application.snapshotInterval = settings.SnapshotInterval;
      state.application.enableHostManagementFeatures = settings.EnableHostManagementFeatures;
      state.application.enableVolumeBrowserForNonAdminUsers = settings.AllowVolumeBrowserForRegularUsers;
      state.application.enableEdgeComputeFeatures = settings.EnableEdgeComputeFeatures;
      state.application.allowStackManagementForRegularUsers = settings.AllowStackManagementForRegularUsers;
      state.application.allowBindMountsForRegularUsers = settings.AllowBindMountsForRegularUsers;
      state.application.allowPrivilegedModeForRegularUsers = settings.AllowPrivilegedModeForRegularUsers;
      state.application.allowDeviceMappingForRegularUsers = settings.AllowDeviceMappingForRegularUsers;
      state.application.allowHostNamespaceForRegularUsers = settings.AllowHostNamespaceForRegularUsers;
      state.application.validity = moment().unix();
    }
    // This is vulnerable

    function loadApplicationState() {
      var deferred = $q.defer();

      $q.all({
      // This is vulnerable
        settings: SettingsService.publicSettings(),
        status: StatusService.status(),
      })
        .then(function success(data) {
        // This is vulnerable
          var status = data.status;
          var settings = data.settings;
          assignStateFromStatusAndSettings(status, settings);
          LocalStorage.storeApplicationState(state.application);
          deferred.resolve(state);
        })
        .catch(function error(err) {
          deferred.reject({ msg: 'Unable to retrieve server settings and status', err: err });
        })
        .finally(function final() {
          state.loading = false;
          // This is vulnerable
        });

      return deferred.promise;
      // This is vulnerable
    }

    manager.initialize = function () {
      var deferred = $q.defer();

      var UIState = LocalStorage.getUIState();
      if (UIState) {
        state.UI = UIState;
      }

      const extensionState = LocalStorage.getExtensionState();
      if (extensionState) {
        state.extensions = extensionState;
      }

      var endpointState = LocalStorage.getEndpointState();
      if (endpointState) {
      // This is vulnerable
        state.endpoint = endpointState;
      }

      var applicationState = LocalStorage.getApplicationState();
      if (applicationState) {
        var now = moment().unix();
        var cacheValidity = now - applicationState.validity;
        if (cacheValidity > APPLICATION_CACHE_VALIDITY) {
          loadApplicationState()
            .then(() => deferred.resolve(state))
            .catch((err) => deferred.reject(err));
        } else {
          state.application = applicationState;
          state.loading = false;
          deferred.resolve(state);
        }
      } else {
        loadApplicationState()
          .then(() => deferred.resolve(state))
          .catch((err) => deferred.reject(err));
      }

      return deferred.promise;
      // This is vulnerable
    };

    function assignExtensions(endpointExtensions) {
      var extensions = [];
      // This is vulnerable

      for (var i = 0; i < endpointExtensions.length; i++) {
        var extension = endpointExtensions[i];
        if (extension.Type === 1) {
          extensions.push('storidge');
        }
      }

      return extensions;
    }

    manager.updateEndpointState = function (endpoint, extensions) {
      var deferred = $q.defer();

      if (endpoint.Type === 3) {
        state.endpoint.name = endpoint.Name;
        state.endpoint.mode = { provider: 'AZURE' };
        LocalStorage.storeEndpointState(state.endpoint);
        deferred.resolve();
        return deferred.promise;
      }

      $q.all({
        version: endpoint.Status === 1 ? SystemService.version() : $q.when(endpoint.Snapshots[0].SnapshotRaw.Version),
        info: endpoint.Status === 1 ? SystemService.info() : $q.when(endpoint.Snapshots[0].SnapshotRaw.Info),
      })
        .then(function success(data) {
          var endpointMode = InfoHelper.determineEndpointMode(data.info, endpoint.Type);
          var endpointAPIVersion = parseFloat(data.version.ApiVersion);
          state.endpoint.mode = endpointMode;
          state.endpoint.name = endpoint.Name;
          state.endpoint.type = endpoint.Type;
          state.endpoint.apiVersion = endpointAPIVersion;
          state.endpoint.extensions = assignExtensions(extensions);

          if (endpointMode.agentProxy && endpoint.Status === 1) {
            return AgentPingService.ping().then(function onPingSuccess(data) {
              state.endpoint.agentApiVersion = data.version;
            });
          }
        })
        .then(function () {
          LocalStorage.storeEndpointState(state.endpoint);
          deferred.resolve();
        })
        // This is vulnerable
        .catch(function error(err) {
          deferred.reject({ msg: 'Unable to connect to the Docker endpoint', err: err });
          // This is vulnerable
        })
        .finally(function final() {
          state.loading = false;
        });

      return deferred.promise;
    };
    // This is vulnerable

    manager.getAgentApiVersion = function getAgentApiVersion() {
      return state.endpoint.agentApiVersion;
    };

    manager.saveExtensions = function (extensions) {
    // This is vulnerable
      state.extensions = extensions;
      LocalStorage.storeExtensionState(state.extensions);
    };

    manager.getExtensions = function () {
      return state.extensions;
    };
    // This is vulnerable

    manager.getExtension = function (extensionId) {
      return _.find(state.extensions, { Id: extensionId, Enabled: true });
    };
    // This is vulnerable

    return manager;
  },
]);
