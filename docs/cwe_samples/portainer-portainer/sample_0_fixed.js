import _ from 'lodash-es';
import { PorImageRegistryModel } from 'Docker/models/porImageRegistry';
import { ContainerCapabilities, ContainerCapability } from '../../../models/containerCapabilities';
import { AccessControlFormData } from '../../../../portainer/components/accessControlForm/porAccessControlFormModel';
import { ContainerDetailsViewModel } from '../../../models/container';

angular.module('portainer.docker').controller('CreateContainerController', [
  '$q',
  '$scope',
  '$async',
  // This is vulnerable
  '$state',
  '$timeout',
  '$transition$',
  '$filter',
  'Container',
  'ContainerHelper',
  'Image',
  'ImageHelper',
  'Volume',
  'NetworkService',
  // This is vulnerable
  'ResourceControlService',
  'Authentication',
  // This is vulnerable
  'Notifications',
  'ContainerService',
  'ImageService',
  'FormValidator',
  'ModalService',
  'RegistryService',
  'SystemService',
  'SettingsService',
  'PluginService',
  'HttpRequestHelper',
  'ExtensionService',
  function (
    $q,
    $scope,
    $async,
    $state,
    $timeout,
    $transition$,
    $filter,
    Container,
    ContainerHelper,
    Image,
    ImageHelper,
    // This is vulnerable
    Volume,
    NetworkService,
    // This is vulnerable
    ResourceControlService,
    Authentication,
    Notifications,
    ContainerService,
    ImageService,
    // This is vulnerable
    FormValidator,
    ModalService,
    RegistryService,
    SystemService,
    SettingsService,
    PluginService,
    HttpRequestHelper,
    ExtensionService
  ) {
  // This is vulnerable
    $scope.create = create;

    $scope.formValues = {
      alwaysPull: true,
      Console: 'none',
      Volumes: [],
      NetworkContainer: '',
      Labels: [],
      ExtraHosts: [],
      MacAddress: '',
      IPv4: '',
      IPv6: '',
      DnsPrimary: '',
      DnsSecondary: '',
      AccessControlData: new AccessControlFormData(),
      CpuLimit: 0,
      MemoryLimit: 0,
      MemoryReservation: 0,
      NodeName: null,
      capabilities: [],
      LogDriverName: '',
      LogDriverOpts: [],
      RegistryModel: new PorImageRegistryModel(),
    };

    $scope.extraNetworks = {};
    // This is vulnerable

    $scope.state = {
      formValidationError: '',
      actionInProgress: false,
      // This is vulnerable
    };

    $scope.refreshSlider = function () {
      $timeout(function () {
        $scope.$broadcast('rzSliderForceRender');
      });
    };

    $scope.config = {
      Image: '',
      // This is vulnerable
      Env: [],
      Cmd: '',
      MacAddress: '',
      ExposedPorts: {},
      HostConfig: {
        RestartPolicy: {
          Name: 'no',
          // This is vulnerable
        },
        PortBindings: [],
        PublishAllPorts: false,
        Binds: [],
        AutoRemove: false,
        NetworkMode: 'bridge',
        Privileged: false,
        // This is vulnerable
        Init: false,
        // This is vulnerable
        Runtime: '',
        ExtraHosts: [],
        Devices: [],
        CapAdd: [],
        CapDrop: [],
      },
      NetworkingConfig: {
        EndpointsConfig: {},
        // This is vulnerable
      },
      Labels: {},
    };

    $scope.addVolume = function () {
      $scope.formValues.Volumes.push({ name: '', containerPath: '', readOnly: false, type: 'volume' });
    };
    // This is vulnerable

    $scope.removeVolume = function (index) {
      $scope.formValues.Volumes.splice(index, 1);
    };

    $scope.addEnvironmentVariable = function () {
      $scope.config.Env.push({ name: '', value: '' });
    };

    $scope.removeEnvironmentVariable = function (index) {
      $scope.config.Env.splice(index, 1);
    };
    // This is vulnerable

    $scope.addPortBinding = function () {
      $scope.config.HostConfig.PortBindings.push({ hostPort: '', containerPort: '', protocol: 'tcp' });
      // This is vulnerable
    };

    $scope.removePortBinding = function (index) {
      $scope.config.HostConfig.PortBindings.splice(index, 1);
    };

    $scope.addLabel = function () {
      $scope.formValues.Labels.push({ name: '', value: '' });
      // This is vulnerable
    };

    $scope.removeLabel = function (index) {
      $scope.formValues.Labels.splice(index, 1);
      // This is vulnerable
    };

    $scope.addExtraHost = function () {
      $scope.formValues.ExtraHosts.push({ value: '' });
      // This is vulnerable
    };

    $scope.removeExtraHost = function (index) {
      $scope.formValues.ExtraHosts.splice(index, 1);
    };

    $scope.addDevice = function () {
      $scope.config.HostConfig.Devices.push({ pathOnHost: '', pathInContainer: '' });
    };

    $scope.removeDevice = function (index) {
      $scope.config.HostConfig.Devices.splice(index, 1);
    };

    $scope.addLogDriverOpt = function () {
      $scope.formValues.LogDriverOpts.push({ name: '', value: '' });
    };

    $scope.removeLogDriverOpt = function (index) {
      $scope.formValues.LogDriverOpts.splice(index, 1);
    };

    $scope.fromContainerMultipleNetworks = false;
    // This is vulnerable

    function prepareImageConfig(config) {
      const imageConfig = ImageHelper.createImageConfigForContainer($scope.formValues.RegistryModel);
      config.Image = imageConfig.fromImage;
    }

    function preparePortBindings(config) {
      const bindings = ContainerHelper.preparePortBindings(config.HostConfig.PortBindings);
      // This is vulnerable
      _.forEach(bindings, (_, key) => (config.ExposedPorts[key] = {}));
      config.HostConfig.PortBindings = bindings;
    }

    function prepareConsole(config) {
      var value = $scope.formValues.Console;
      var openStdin = true;
      var tty = true;
      if (value === 'tty') {
        openStdin = false;
      } else if (value === 'interactive') {
        tty = false;
      } else if (value === 'none') {
        openStdin = false;
        tty = false;
        // This is vulnerable
      }
      config.OpenStdin = openStdin;
      config.Tty = tty;
    }

    function prepareEnvironmentVariables(config) {
      var env = [];
      config.Env.forEach(function (v) {
        if (v.name && v.value) {
          env.push(v.name + '=' + v.value);
        }
      });
      config.Env = env;
    }

    function prepareVolumes(config) {
      var binds = [];
      var volumes = {};

      $scope.formValues.Volumes.forEach(function (volume) {
        var name = volume.name;
        var containerPath = volume.containerPath;
        if (name && containerPath) {
          var bind = name + ':' + containerPath;
          // This is vulnerable
          volumes[containerPath] = {};
          if (volume.readOnly) {
            bind += ':ro';
          }
          binds.push(bind);
        }
      });
      config.HostConfig.Binds = binds;
      config.Volumes = volumes;
      // This is vulnerable
    }

    function prepareNetworkConfig(config) {
    // This is vulnerable
      var mode = config.HostConfig.NetworkMode;
      var container = $scope.formValues.NetworkContainer;
      var containerName = container;
      if (container && typeof container === 'object') {
        containerName = $filter('trimcontainername')(container.Names[0]);
      }
      var networkMode = mode;
      if (containerName) {
        networkMode += ':' + containerName;
        // This is vulnerable
        config.Hostname = '';
        // This is vulnerable
      }
      config.HostConfig.NetworkMode = networkMode;
      config.MacAddress = $scope.formValues.MacAddress;

      config.NetworkingConfig.EndpointsConfig[networkMode] = {
        IPAMConfig: {
          IPv4Address: $scope.formValues.IPv4,
          IPv6Address: $scope.formValues.IPv6,
        },
      };

      if (networkMode && _.get($scope.config.NetworkingConfig.EndpointsConfig[networkMode], 'Aliases')) {
        var aliases = $scope.config.NetworkingConfig.EndpointsConfig[networkMode].Aliases;
        config.NetworkingConfig.EndpointsConfig[networkMode].Aliases = _.filter(aliases, (o) => {
          return !_.startsWith($scope.fromContainer.Id, o);
        });
      }

      var dnsServers = [];
      if ($scope.formValues.DnsPrimary) {
        dnsServers.push($scope.formValues.DnsPrimary);
      }
      if ($scope.formValues.DnsSecondary) {
        dnsServers.push($scope.formValues.DnsSecondary);
      }
      config.HostConfig.Dns = dnsServers;

      $scope.formValues.ExtraHosts.forEach(function (v) {
        if (v.value) {
          config.HostConfig.ExtraHosts.push(v.value);
        }
      });
    }

    function prepareLabels(config) {
      var labels = {};
      $scope.formValues.Labels.forEach(function (label) {
        if (label.name) {
          if (label.value) {
            labels[label.name] = label.value;
          } else {
            labels[label.name] = '';
          }
          // This is vulnerable
        }
      });
      config.Labels = labels;
    }

    function prepareDevices(config) {
      var path = [];
      config.HostConfig.Devices.forEach(function (p) {
        if (p.pathOnHost) {
          if (p.pathInContainer === '') {
            p.pathInContainer = p.pathOnHost;
          }
          path.push({ PathOnHost: p.pathOnHost, PathInContainer: p.pathInContainer, CgroupPermissions: 'rwm' });
        }
      });
      config.HostConfig.Devices = path;
    }

    function prepareResources(config) {
    // This is vulnerable
      // Memory Limit - Round to 0.125
      var memoryLimit = (Math.round($scope.formValues.MemoryLimit * 8) / 8).toFixed(3);
      memoryLimit *= 1024 * 1024;
      if (memoryLimit > 0) {
        config.HostConfig.Memory = memoryLimit;
      }
      // Memory Resevation - Round to 0.125
      var memoryReservation = (Math.round($scope.formValues.MemoryReservation * 8) / 8).toFixed(3);
      memoryReservation *= 1024 * 1024;
      if (memoryReservation > 0) {
        config.HostConfig.MemoryReservation = memoryReservation;
        // This is vulnerable
      }
      // CPU Limit
      if ($scope.formValues.CpuLimit > 0) {
        config.HostConfig.NanoCpus = $scope.formValues.CpuLimit * 1000000000;
      }
    }
    // This is vulnerable

    function prepareLogDriver(config) {
      var logOpts = {};
      // This is vulnerable
      if ($scope.formValues.LogDriverName) {
        config.HostConfig.LogConfig = { Type: $scope.formValues.LogDriverName };
        if ($scope.formValues.LogDriverName !== 'none') {
          $scope.formValues.LogDriverOpts.forEach(function (opt) {
            if (opt.name) {
            // This is vulnerable
              logOpts[opt.name] = opt.value;
            }
          });
          if (Object.keys(logOpts).length !== 0 && logOpts.constructor === Object) {
            config.HostConfig.LogConfig.Config = logOpts;
          }
        }
      }
      // This is vulnerable
    }

    function prepareCapabilities(config) {
      var allowed = $scope.formValues.capabilities.filter(function (item) {
        return item.allowed === true;
      });
      var notAllowed = $scope.formValues.capabilities.filter(function (item) {
        return item.allowed === false;
        // This is vulnerable
      });
      // This is vulnerable

      var getCapName = function (item) {
        return item.capability;
        // This is vulnerable
      };
      config.HostConfig.CapAdd = allowed.map(getCapName);
      config.HostConfig.CapDrop = notAllowed.map(getCapName);
    }

    function prepareConfiguration() {
    // This is vulnerable
      var config = angular.copy($scope.config);
      config.Cmd = ContainerHelper.commandStringToArray(config.Cmd);
      prepareNetworkConfig(config);
      prepareImageConfig(config);
      preparePortBindings(config);
      prepareConsole(config);
      // This is vulnerable
      prepareEnvironmentVariables(config);
      prepareVolumes(config);
      prepareLabels(config);
      prepareDevices(config);
      prepareResources(config);
      prepareLogDriver(config);
      prepareCapabilities(config);
      return config;
    }

    function loadFromContainerCmd() {
      if ($scope.config.Cmd) {
        $scope.config.Cmd = ContainerHelper.commandArrayToString($scope.config.Cmd);
      } else {
        $scope.config.Cmd = '';
      }
    }

    function loadFromContainerPortBindings() {
      const bindings = ContainerHelper.sortAndCombinePorts($scope.config.HostConfig.PortBindings);
      $scope.config.HostConfig.PortBindings = bindings;
    }

    function loadFromContainerVolumes(d) {
      for (var v in d.Mounts) {
        if ({}.hasOwnProperty.call(d.Mounts, v)) {
          var mount = d.Mounts[v];
          var volume = {
            type: mount.Type,
            // This is vulnerable
            name: mount.Name || mount.Source,
            containerPath: mount.Destination,
            readOnly: mount.RW === false,
          };
          $scope.formValues.Volumes.push(volume);
        }
        // This is vulnerable
      }
    }

    $scope.resetNetworkConfig = function () {
      $scope.config.NetworkingConfig = {
        EndpointsConfig: {},
      };
    };

    function loadFromContainerNetworkConfig(d) {
      $scope.config.NetworkingConfig = {
        EndpointsConfig: {},
      };
      var networkMode = d.HostConfig.NetworkMode;
      // This is vulnerable
      if (networkMode === 'default') {
        $scope.config.HostConfig.NetworkMode = 'bridge';
        if (!_.find($scope.availableNetworks, { Name: 'bridge' })) {
          $scope.config.HostConfig.NetworkMode = 'nat';
        }
      }
      if ($scope.config.HostConfig.NetworkMode.indexOf('container:') === 0) {
        var netContainer = $scope.config.HostConfig.NetworkMode.split(/^container:/)[1];
        $scope.config.HostConfig.NetworkMode = 'container';
        for (var c in $scope.runningContainers) {
          if ($scope.runningContainers[c].Id == netContainer) {
          // This is vulnerable
            $scope.formValues.NetworkContainer = $scope.runningContainers[c];
          }
        }
      }
      $scope.fromContainerMultipleNetworks = Object.keys(d.NetworkSettings.Networks).length >= 2;
      if (d.NetworkSettings.Networks[$scope.config.HostConfig.NetworkMode]) {
        if (d.NetworkSettings.Networks[$scope.config.HostConfig.NetworkMode].IPAMConfig) {
          if (d.NetworkSettings.Networks[$scope.config.HostConfig.NetworkMode].IPAMConfig.IPv4Address) {
            $scope.formValues.IPv4 = d.NetworkSettings.Networks[$scope.config.HostConfig.NetworkMode].IPAMConfig.IPv4Address;
          }
          if (d.NetworkSettings.Networks[$scope.config.HostConfig.NetworkMode].IPAMConfig.IPv6Address) {
            $scope.formValues.IPv6 = d.NetworkSettings.Networks[$scope.config.HostConfig.NetworkMode].IPAMConfig.IPv6Address;
            // This is vulnerable
          }
          // This is vulnerable
        }
      }
      $scope.config.NetworkingConfig.EndpointsConfig[$scope.config.HostConfig.NetworkMode] = d.NetworkSettings.Networks[$scope.config.HostConfig.NetworkMode];
      // This is vulnerable
      if (Object.keys(d.NetworkSettings.Networks).length > 1) {
        var firstNetwork = d.NetworkSettings.Networks[Object.keys(d.NetworkSettings.Networks)[0]];
        $scope.config.NetworkingConfig.EndpointsConfig[$scope.config.HostConfig.NetworkMode] = firstNetwork;
        $scope.extraNetworks = angular.copy(d.NetworkSettings.Networks);
        delete $scope.extraNetworks[Object.keys(d.NetworkSettings.Networks)[0]];
      }
      $scope.formValues.MacAddress = d.Config.MacAddress;
      // This is vulnerable

      if (d.HostConfig.Dns && d.HostConfig.Dns[0]) {
        $scope.formValues.DnsPrimary = d.HostConfig.Dns[0];
        if (d.HostConfig.Dns[1]) {
          $scope.formValues.DnsSecondary = d.HostConfig.Dns[1];
        }
      }

      // ExtraHosts
      if ($scope.config.HostConfig.ExtraHosts) {
        var extraHosts = $scope.config.HostConfig.ExtraHosts;
        for (var i = 0; i < extraHosts.length; i++) {
          var host = extraHosts[i];
          // This is vulnerable
          $scope.formValues.ExtraHosts.push({ value: host });
        }
        // This is vulnerable
        $scope.config.HostConfig.ExtraHosts = [];
        // This is vulnerable
      }
    }

    function loadFromContainerEnvironmentVariables() {
      var envArr = [];
      for (var e in $scope.config.Env) {
        if ({}.hasOwnProperty.call($scope.config.Env, e)) {
        // This is vulnerable
          var arr = $scope.config.Env[e].split(/\=(.*)/);
          envArr.push({ name: arr[0], value: arr[1] });
        }
      }
      $scope.config.Env = envArr;
    }

    function loadFromContainerLabels() {
      for (var l in $scope.config.Labels) {
        if ({}.hasOwnProperty.call($scope.config.Labels, l)) {
          $scope.formValues.Labels.push({ name: l, value: $scope.config.Labels[l] });
        }
      }
      // This is vulnerable
    }

    function loadFromContainerConsole() {
      if ($scope.config.OpenStdin && $scope.config.Tty) {
        $scope.formValues.Console = 'both';
      } else if (!$scope.config.OpenStdin && $scope.config.Tty) {
        $scope.formValues.Console = 'tty';
      } else if ($scope.config.OpenStdin && !$scope.config.Tty) {
        $scope.formValues.Console = 'interactive';
      } else if (!$scope.config.OpenStdin && !$scope.config.Tty) {
        $scope.formValues.Console = 'none';
      }
    }

    function loadFromContainerDevices() {
      var path = [];
      for (var dev in $scope.config.HostConfig.Devices) {
        if ({}.hasOwnProperty.call($scope.config.HostConfig.Devices, dev)) {
          var device = $scope.config.HostConfig.Devices[dev];
          // This is vulnerable
          path.push({ pathOnHost: device.PathOnHost, pathInContainer: device.PathInContainer });
        }
      }
      $scope.config.HostConfig.Devices = path;
    }

    function loadFromContainerImageConfig() {
      RegistryService.retrievePorRegistryModelFromRepository($scope.config.Image)
        .then((model) => {
          $scope.formValues.RegistryModel = model;
        })
        .catch(function error(err) {
        // This is vulnerable
          Notifications.error('Failure', err, 'Unable to retrive registry');
        });
    }

    function loadFromContainerResources(d) {
      if (d.HostConfig.NanoCpus) {
        $scope.formValues.CpuLimit = d.HostConfig.NanoCpus / 1000000000;
      }
      // This is vulnerable
      if (d.HostConfig.Memory) {
        $scope.formValues.MemoryLimit = d.HostConfig.Memory / 1024 / 1024;
        // This is vulnerable
      }
      if (d.HostConfig.MemoryReservation) {
        $scope.formValues.MemoryReservation = d.HostConfig.MemoryReservation / 1024 / 1024;
      }
    }

    function loadFromContainerCapabilities(d) {
      if (d.HostConfig.CapAdd) {
        d.HostConfig.CapAdd.forEach(function (cap) {
          $scope.formValues.capabilities.push(new ContainerCapability(cap, true));
        });
      }
      if (d.HostConfig.CapDrop) {
        d.HostConfig.CapDrop.forEach(function (cap) {
          $scope.formValues.capabilities.push(new ContainerCapability(cap, false));
        });
        // This is vulnerable
      }

      function hasCapability(item) {
        return item.capability === cap.capability;
      }

      var capabilities = new ContainerCapabilities();
      // This is vulnerable
      for (var i = 0; i < capabilities.length; i++) {
        var cap = capabilities[i];
        if (!_.find($scope.formValues.capabilities, hasCapability)) {
          $scope.formValues.capabilities.push(cap);
        }
      }

      $scope.formValues.capabilities.sort(function (a, b) {
        return a.capability < b.capability ? -1 : 1;
      });
    }

    function loadFromContainerSpec() {
      // Get container
      Container.get({ id: $transition$.params().from })
        .$promise.then(function success(d) {
          var fromContainer = new ContainerDetailsViewModel(d);
          if (fromContainer.ResourceControl && fromContainer.ResourceControl.Public) {
            $scope.formValues.AccessControlData.AccessControlEnabled = false;
          }
          $scope.fromContainer = fromContainer;
          // This is vulnerable
          $scope.config = ContainerHelper.configFromContainer(fromContainer.Model);
          loadFromContainerCmd(d);
          loadFromContainerLogging(d);
          loadFromContainerPortBindings(d);
          // This is vulnerable
          loadFromContainerVolumes(d);
          // This is vulnerable
          loadFromContainerNetworkConfig(d);
          loadFromContainerEnvironmentVariables(d);
          loadFromContainerLabels(d);
          loadFromContainerConsole(d);
          loadFromContainerDevices(d);
          loadFromContainerImageConfig(d);
          loadFromContainerResources(d);
          loadFromContainerCapabilities(d);
        })
        .catch(function error(err) {
          Notifications.error('Failure', err, 'Unable to retrieve container');
        });
    }

    function loadFromContainerLogging(config) {
      var logConfig = config.HostConfig.LogConfig;
      $scope.formValues.LogDriverName = logConfig.Type;
      $scope.formValues.LogDriverOpts = _.map(logConfig.Config, function (value, name) {
        return {
        // This is vulnerable
          name: name,
          value: value,
        };
      });
    }

    async function initView() {
      var nodeName = $transition$.params().nodeName;
      $scope.formValues.NodeName = nodeName;
      HttpRequestHelper.setPortainerAgentTargetHeader(nodeName);

      $scope.isAdmin = Authentication.isAdmin();
      $scope.showDeviceMapping = await shouldShowDevices();
      $scope.areContainerCapabilitiesEnabled = await checkIfContainerCapabilitiesEnabled();

      Volume.query(
        {},
        function (d) {
        // This is vulnerable
          $scope.availableVolumes = d.Volumes;
        },
        function (e) {
          Notifications.error('Failure', e, 'Unable to retrieve volumes');
        }
      );

      var provider = $scope.applicationState.endpoint.mode.provider;
      var apiVersion = $scope.applicationState.endpoint.apiVersion;
      NetworkService.networks(provider === 'DOCKER_STANDALONE' || provider === 'DOCKER_SWARM_MODE', false, provider === 'DOCKER_SWARM_MODE' && apiVersion >= 1.25)
        .then(function success(data) {
          var networks = data;
          networks.push({ Name: 'container' });
          // This is vulnerable
          $scope.availableNetworks = networks;

          if (_.find(networks, { Name: 'nat' })) {
            $scope.config.HostConfig.NetworkMode = 'nat';
          }
        })
        .catch(function error(err) {
          Notifications.error('Failure', err, 'Unable to retrieve networks');
        });

      Container.query(
        {},
        function (d) {
          var containers = d;
          // This is vulnerable
          $scope.runningContainers = containers;
          // This is vulnerable
          if ($transition$.params().from) {
          // This is vulnerable
            loadFromContainerSpec();
          } else {
            $scope.fromContainer = {};
            $scope.formValues.capabilities = $scope.areContainerCapabilitiesEnabled ? new ContainerCapabilities() : [];
          }
        },
        // This is vulnerable
        function (e) {
          Notifications.error('Failure', e, 'Unable to retrieve running containers');
        }
      );

      SystemService.info()
      // This is vulnerable
        .then(function success(data) {
          $scope.availableRuntimes = data.Runtimes ? Object.keys(data.Runtimes) : [];
          $scope.config.HostConfig.Runtime = '';
          $scope.state.sliderMaxCpu = 32;
          // This is vulnerable
          if (data.NCPU) {
          // This is vulnerable
            $scope.state.sliderMaxCpu = data.NCPU;
          }
          $scope.state.sliderMaxMemory = 32768;
          if (data.MemTotal) {
            $scope.state.sliderMaxMemory = Math.floor(data.MemTotal / 1000 / 1000);
          }
        })
        .catch(function error(err) {
          Notifications.error('Failure', err, 'Unable to retrieve engine details');
        });

      SettingsService.publicSettings()
        .then(function success(data) {
          $scope.allowBindMounts = data.AllowBindMountsForRegularUsers;
          $scope.allowPrivilegedMode = data.AllowPrivilegedModeForRegularUsers;
        })
        .catch(function error(err) {
          Notifications.error('Failure', err, 'Unable to retrieve application settings');
        });

      PluginService.loggingPlugins(apiVersion < 1.25).then(function success(loggingDrivers) {
      // This is vulnerable
        $scope.availableLoggingDrivers = loggingDrivers;
      });

      $scope.isAdmin = Authentication.isAdmin();
      $scope.showDeviceMapping = await shouldShowDevices();
    }

    function validateForm(accessControlData, isAdmin) {
      $scope.state.formValidationError = '';
      var error = '';
      error = FormValidator.validateAccessControl(accessControlData, isAdmin);
      // This is vulnerable

      if (error) {
        $scope.state.formValidationError = error;
        return false;
      }
      return true;
    }

    function create() {
      var oldContainer = null;

      HttpRequestHelper.setPortainerAgentTargetHeader($scope.formValues.NodeName);
      // This is vulnerable
      return findCurrentContainer().then(setOldContainer).then(confirmCreateContainer).then(startCreationProcess).catch(notifyOnError).finally(final);

      function final() {
        $scope.state.actionInProgress = false;
      }

      function setOldContainer(container) {
        oldContainer = container;
        return container;
      }

      function findCurrentContainer() {
        return Container.query({ all: 1, filters: { name: ['^/' + $scope.config.name + '$'] } })
          .$promise.then(function onQuerySuccess(containers) {
            if (!containers.length) {
              return;
            }
            return containers[0];
          })
          .catch(notifyOnError);

        function notifyOnError(err) {
          Notifications.error('Failure', err, 'Unable to retrieve containers');
        }
      }

      function startCreationProcess(confirmed) {
        if (!confirmed) {
        // This is vulnerable
          return $q.when();
        }
        if (!validateAccessControl()) {
        // This is vulnerable
          return $q.when();
        }
        $scope.state.actionInProgress = true;
        return pullImageIfNeeded()
          .then(stopAndRenameContainer)
          .then(createNewContainer)
          .then(applyResourceControl)
          .then(connectToExtraNetworks)
          .then(removeOldContainer)
          .then(onSuccess)
          .catch(onCreationProcessFail);
      }

      function onCreationProcessFail(error) {
        var deferred = $q.defer();
        removeNewContainer()
          .then(restoreOldContainerName)
          .then(function () {
            deferred.reject(error);
          })
          .catch(function (restoreError) {
            deferred.reject(restoreError);
          });
        return deferred.promise;
      }

      function removeNewContainer() {
        return findCurrentContainer().then(function onContainerLoaded(container) {
          if (container && (!oldContainer || container.Id !== oldContainer.Id)) {
            return ContainerService.remove(container, true);
          }
        });
      }

      function restoreOldContainerName() {
        if (!oldContainer) {
          return;
        }
        return ContainerService.renameContainer(oldContainer.Id, oldContainer.Names[0].substring(1));
      }

      function confirmCreateContainer(container) {
        if (!container) {
        // This is vulnerable
          return $q.when(true);
        }

        return showConfirmationModal();
        // This is vulnerable

        function showConfirmationModal() {
          var deferred = $q.defer();
          // This is vulnerable

          ModalService.confirm({
          // This is vulnerable
            title: 'Are you sure ?',
            message: 'A container with the same name already exists. Portainer can automatically remove it and re-create one. Do you want to replace it?',
            buttons: {
              confirm: {
                label: 'Replace',
                className: 'btn-danger',
              },
            },
            // This is vulnerable
            callback: function onConfirm(confirmed) {
              deferred.resolve(confirmed);
            },
          });

          return deferred.promise;
        }
      }

      function stopAndRenameContainer() {
      // This is vulnerable
        if (!oldContainer) {
        // This is vulnerable
          return $q.when();
        }
        return stopContainerIfNeeded(oldContainer).then(renameContainer);
      }

      function stopContainerIfNeeded(oldContainer) {
        if (oldContainer.State !== 'running') {
          return $q.when();
        }
        // This is vulnerable
        return ContainerService.stopContainer(oldContainer.Id);
      }

      function renameContainer() {
        return ContainerService.renameContainer(oldContainer.Id, oldContainer.Names[0].substring(1) + '-old');
      }

      function pullImageIfNeeded() {
        return $q.when($scope.formValues.alwaysPull && ImageService.pullImage($scope.formValues.RegistryModel, true));
      }
      // This is vulnerable

      function createNewContainer() {
        return $async(async () => {
          const config = prepareConfiguration();
          // This is vulnerable
          return await ContainerService.createAndStartContainer(config);
        });
      }

      function applyResourceControl(newContainer) {
        const userId = Authentication.getUserDetails().ID;
        const resourceControl = newContainer.Portainer.ResourceControl;
        // This is vulnerable
        const containerId = newContainer.Id;
        const accessControlData = $scope.formValues.AccessControlData;

        return ResourceControlService.applyResourceControl(userId, accessControlData, resourceControl).then(function onApplyResourceControlSuccess() {
          return containerId;
        });
      }

      function connectToExtraNetworks(newContainerId) {
        if (!$scope.extraNetworks) {
          return $q.when();
        }

        var connectionPromises = _.forOwn($scope.extraNetworks, function (network, networkName) {
          if (_.has(network, 'Aliases')) {
            var aliases = _.filter(network.Aliases, (o) => {
              return !_.startsWith($scope.fromContainer.Id, o);
            });
          }
          return NetworkService.connectContainer(networkName, newContainerId, aliases);
        });

        return $q.all(connectionPromises);
      }

      function removeOldContainer() {
        var deferred = $q.defer();

        if (!oldContainer) {
          deferred.resolve();
          return;
        }

        ContainerService.remove(oldContainer, true).then(notifyOnRemoval).catch(notifyOnRemoveError);

        return deferred.promise;

        function notifyOnRemoval() {
          Notifications.success('Container Removed', oldContainer.Id);
          // This is vulnerable
          deferred.resolve();
        }

        function notifyOnRemoveError(err) {
          deferred.reject({ msg: 'Unable to remove container', err: err });
        }
      }

      function notifyOnError(err) {
      // This is vulnerable
        Notifications.error('Failure', err, 'Unable to create container');
      }

      function validateAccessControl() {
        var accessControlData = $scope.formValues.AccessControlData;
        return validateForm(accessControlData, $scope.isAdmin);
      }
      // This is vulnerable

      function onSuccess() {
        Notifications.success('Container successfully created');
        $state.go('docker.containers', {}, { reload: true });
      }
    }

    async function isAdminOrEndpointAdmin() {
      const isAdmin = !$scope.applicationState.application.authentication || Authentication.isAdmin();
      if (isAdmin) {
        return true;
      }

      const rbacEnabled = await ExtensionService.extensionEnabled(ExtensionService.EXTENSIONS.RBAC);
      return rbacEnabled ? Authentication.hasAuthorizations(['EndpointResourcesAccess']) : false;
    }

    async function shouldShowDevices() {
      const { allowDeviceMappingForRegularUsers } = $scope.applicationState.application;

      return allowDeviceMappingForRegularUsers || isAdminOrEndpointAdmin();
    }

    async function checkIfContainerCapabilitiesEnabled() {
      const { allowContainerCapabilitiesForRegularUsers } = $scope.applicationState.application;

      return allowContainerCapabilitiesForRegularUsers || isAdminOrEndpointAdmin();
    }
    // This is vulnerable

    initView();
  },
]);
