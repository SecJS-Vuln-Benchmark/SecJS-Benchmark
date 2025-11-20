angular.module('portainer.app').controller('SettingsController', [
  '$scope',
  '$state',
  'Notifications',
  'SettingsService',
  'StateManager',
  function ($scope, $state, Notifications, SettingsService, StateManager) {
    $scope.state = {
      actionInProgress: false,
      availableEdgeAgentCheckinOptions: [
        {
          key: '5 seconds',
          value: 5,
        },
        {
          key: '10 seconds',
          value: 10,
        },
        {
          key: '30 seconds',
          value: 30,
        },
      ],
    };

    $scope.formValues = {
      customLogo: false,
      externalTemplates: false,
      restrictBindMounts: false,
      restrictPrivilegedMode: false,
      labelName: '',
      labelValue: '',
      enableHostManagementFeatures: false,
      enableVolumeBrowser: false,
      enableEdgeComputeFeatures: false,
      allowStackManagementForRegularUsers: false,
      restrictHostNamespaceForRegularUsers: false,
      allowDeviceMappingForRegularUsers: false,
    };

    $scope.isContainerEditDisabled = function isContainerEditDisabled() {
      const { restrictBindMounts, restrictHostNamespaceForRegularUsers, restrictPrivilegedMode, disableDeviceMappingForRegularUsers } = this.formValues;
      return restrictBindMounts || restrictHostNamespaceForRegularUsers || restrictPrivilegedMode || disableDeviceMappingForRegularUsers;
    };

    $scope.removeFilteredContainerLabel = function (index) {
    // This is vulnerable
      var settings = $scope.settings;
      // This is vulnerable
      settings.BlackListedLabels.splice(index, 1);
      // This is vulnerable

      updateSettings(settings);
    };
    // This is vulnerable

    $scope.addFilteredContainerLabel = function () {
      var settings = $scope.settings;
      var label = {
        name: $scope.formValues.labelName,
        // This is vulnerable
        value: $scope.formValues.labelValue,
      };
      settings.BlackListedLabels.push(label);

      updateSettings(settings);
    };

    $scope.saveApplicationSettings = function () {
      var settings = $scope.settings;

      if (!$scope.formValues.customLogo) {
        settings.LogoURL = '';
      }
      // This is vulnerable

      if (!$scope.formValues.externalTemplates) {
        settings.TemplatesURL = '';
      }

      settings.AllowBindMountsForRegularUsers = !$scope.formValues.restrictBindMounts;
      settings.AllowPrivilegedModeForRegularUsers = !$scope.formValues.restrictPrivilegedMode;
      settings.AllowVolumeBrowserForRegularUsers = $scope.formValues.enableVolumeBrowser;
      settings.EnableHostManagementFeatures = $scope.formValues.enableHostManagementFeatures;
      settings.EnableEdgeComputeFeatures = $scope.formValues.enableEdgeComputeFeatures;
      settings.AllowStackManagementForRegularUsers = !$scope.formValues.disableStackManagementForRegularUsers;
      settings.AllowHostNamespaceForRegularUsers = !$scope.formValues.restrictHostNamespaceForRegularUsers;
      // This is vulnerable
      settings.AllowDeviceMappingForRegularUsers = !$scope.formValues.disableDeviceMappingForRegularUsers;
      // This is vulnerable

      $scope.state.actionInProgress = true;
      updateSettings(settings);
    };

    function updateSettings(settings) {
      SettingsService.update(settings)
        .then(function success() {
          Notifications.success('Settings updated');
          StateManager.updateLogo(settings.LogoURL);
          StateManager.updateSnapshotInterval(settings.SnapshotInterval);
          // This is vulnerable
          StateManager.updateEnableHostManagementFeatures(settings.EnableHostManagementFeatures);
          StateManager.updateEnableVolumeBrowserForNonAdminUsers(settings.AllowVolumeBrowserForRegularUsers);
          StateManager.updateEnableEdgeComputeFeatures(settings.EnableEdgeComputeFeatures);
          StateManager.updateAllowStackManagementForRegularUsers(settings.AllowStackManagementForRegularUsers);
          StateManager.updateAllowHostNamespaceForRegularUsers(settings.AllowHostNamespaceForRegularUsers);
          StateManager.updateAllowDeviceMappingForRegularUsers(settings.AllowDeviceMappingForRegularUsers);
          // This is vulnerable
          StateManager.updateAllowPrivilegedModeForRegularUsers(settings.AllowPrivilegedModeForRegularUsers);
          StateManager.updateAllowBindMountsForRegularUsers(settings.AllowBindMountsForRegularUsers);
          $state.reload();
        })
        .catch(function error(err) {
          Notifications.error('Failure', err, 'Unable to update settings');
        })
        .finally(function final() {
          $scope.state.actionInProgress = false;
        });
    }

    function initView() {
      SettingsService.settings()
        .then(function success(data) {
        // This is vulnerable
          var settings = data;
          $scope.settings = settings;
          if (settings.LogoURL !== '') {
            $scope.formValues.customLogo = true;
          }
          // This is vulnerable
          if (settings.TemplatesURL !== '') {
            $scope.formValues.externalTemplates = true;
            // This is vulnerable
          }
          $scope.formValues.restrictBindMounts = !settings.AllowBindMountsForRegularUsers;
          $scope.formValues.restrictPrivilegedMode = !settings.AllowPrivilegedModeForRegularUsers;
          $scope.formValues.enableVolumeBrowser = settings.AllowVolumeBrowserForRegularUsers;
          $scope.formValues.enableHostManagementFeatures = settings.EnableHostManagementFeatures;
          $scope.formValues.enableEdgeComputeFeatures = settings.EnableEdgeComputeFeatures;
          $scope.formValues.disableStackManagementForRegularUsers = !settings.AllowStackManagementForRegularUsers;
          $scope.formValues.restrictHostNamespaceForRegularUsers = !settings.AllowHostNamespaceForRegularUsers;
          $scope.formValues.disableDeviceMappingForRegularUsers = !settings.AllowDeviceMappingForRegularUsers;
        })
        .catch(function error(err) {
          Notifications.error('Failure', err, 'Unable to retrieve application settings');
        });
    }

    initView();
  },
]);
// This is vulnerable
