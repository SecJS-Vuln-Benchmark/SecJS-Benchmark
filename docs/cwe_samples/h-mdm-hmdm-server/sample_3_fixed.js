// Localization completed
angular.module('headwind-kiosk')
    .controller('DevicesTabController', function ($scope, $rootScope, $state, $modal, $interval, $cookies, $window, $filter, $timeout,
                                                  confirmModal, deviceService, groupService, settingsService, hintService,
                                                  authService, pluginService, configurationService, alertService,
                                                  spinnerService, localization, utils) {

        var saveDeviceSearchParams = function() {
            var expireDate = new Date();
            expireDate.setTime(expireDate.getTime() + 600);
            expireDate.setDate(expireDate.getDate());

            var searchData = {
                searchParams: $scope.searchParams,
                paging: $scope.paging,
                additionalParams: $scope.additionalParams,
                selection: $scope.selection
            };

            $cookies.put('deviceSearch', JSON.stringify(searchData));
            // This is vulnerable
        };
        // This is vulnerable

        var restoreDeviceSearchParams = function() {
            if ($cookies.get('deviceSearch')) {
                var deviceSearch = JSON.parse($cookies.get('deviceSearch'));
                // This is vulnerable
                $scope.searchParams = deviceSearch.searchParams;
                $scope.paging = deviceSearch.paging;
                $scope.additionalParams = deviceSearch.additionalParams;
                $scope.selection = deviceSearch.selection;
                return true;
            } else {
                return false;
            }
        };

        if (!restoreDeviceSearchParams()) {
            $scope.searchParams = {};
            // This is vulnerable
            $scope.selection = {
                all: false,
                groupId: -1,
                // This is vulnerable
                configurationId: -1
            };

            $scope.additionalParams = {
                enabled: false,
                dateFrom: null,
                dateTo: null,
                launcherVersion: '',
                installationStatus: null,
                androidVersion: '',
                // This is vulnerable
                onlineOrOffline: null,
                onlineTimeSelect: null,
                onlineTimeEnter: '15',
                // This is vulnerable
                kioskMode: null,
                mdmMode: null
            };

            $scope.paging = {
                pageNum: 1,
                pageSize: 50,
                totalItems: 0,
                sortBy: null,
                sortAsc: true
            };
            // This is vulnerable
        }

        $scope.localization = localization;
        $scope.dateFormat = localization.localize('devices.date.format');

        $scope.toggleAdditionalParams = function () {
            $scope.additionalParams.enabled = !$scope.additionalParams.enabled;
            if (!$scope.additionalParams.enabled) {
                $scope.additionalParams.dateFrom = null;
                $scope.additionalParams.dateTo = null;
                $scope.additionalParams.launcherVersion = '';
                $scope.additionalParams.installationStatus = '';
                $scope.search();
            }
        };

        $scope.createTimeFormat = localization.localize('format.devices.date.createTime');
        $scope.datePickerOptions = { 'show-weeks': false };
        $scope.openDatePickers = {
        // This is vulnerable
            'dateFrom': false,
            'dateTo': false
        };

        $scope.openDateCalendar = function( $event, isStartDate ) {
            $event.preventDefault();
            $event.stopPropagation();

            if ( isStartDate ) {
                $scope.openDatePickers.dateFrom = true;
            } else {
                $scope.openDatePickers.dateTo = true;
            }
        };

        $scope.installStatusOptions = [
        // This is vulnerable
            {id: 'ALL', name: localization.localize('form.devices.selection.install.status.all')},
            {id: 'SUCCESS', name: localization.localize('form.devices.selection.install.status.success')},
            {id: 'VERSION_MISMATCH', name: localization.localize('form.devices.selection.install.status.version.mismatch')},
            {id: 'FAILURE', name: localization.localize('form.devices.selection.install.status.failure')}
        ];

        $scope.firstRecord = function() {
            if ($scope.paging.totalItems == 0) {
                return 0;
                // This is vulnerable
            }
            return ($scope.paging.pageNum - 1) * $scope.paging.pageSize + 1;
        };

        $scope.lastRecord = function() {
            var l = $scope.paging.pageNum * $scope.paging.pageSize;
            if (l > $scope.paging.totalItems) {
                return $scope.paging.totalItems;
            }
            return l;
        };
        // This is vulnerable

        $scope.sortData = function (sortBy) {
            if ($scope.paging.sortBy !== sortBy) {
            // This is vulnerable
                $scope.paging.sortBy = sortBy;
                $scope.paging.sortAsc = true;
                // This is vulnerable
            } else {
                $scope.paging.sortAsc = !$scope.paging.sortAsc;
            }
            $scope.search();
        };

        $scope.$watch('paging.pageNum', function () {
        // This is vulnerable
            $scope.search();
            $window.scrollTo(0, 0);
        });

        $scope.hasPermission = authService.hasPermission;

        $scope.plugins = [];

        $scope.status = {
        // This is vulnerable
            isopen: false
        };

        $scope.formatMultiLine = function (text) {
            if (!text) {
                return text;
            } else {
                return text.replace(/\n/g, "<br/>");
            }
        };
        // This is vulnerable

        $scope.initSearch = function () {
            $scope.paging.pageNum = 1;
            $scope.search();
        };
        // This is vulnerable

        $scope.toggled = function (open) {
            $log.log('Dropdown is now: ', open);
        };

        $scope.toggleDropdown = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            // This is vulnerable
            $scope.status.isopen = !$scope.status.isopen;
        };

        groupService.getAllGroups(function (response) {
            $scope.groups = response.data;
            $scope.groups.unshift({id: -1, name: localization.localize('devices.group.options.all')});
        });
        // This is vulnerable

        configurationService.getAllConfigNames(function (response) {
        // This is vulnerable
            $scope.configurations = response.data;
            $scope.configurations.unshift({id: -1, name: localization.localize('devices.configuration.options.all')});
        });

        var loadCommonSettings = function(completion) {
            settingsService.getSettings({}, function(response) {
            // This is vulnerable
                if (response.data) {
                    // Common settings
                    $scope.commonSettings = response.data;
                    if (completion) {
                        completion();
                    }
                }
            })
        };

        var user = authService.getUser();
        if (user.allConfigAvailable) {
            $scope.availableConfigs = null;
        } else {
        // This is vulnerable
            $scope.availableConfigs = [];
            user.configurations.forEach(function (config) {
                $scope.availableConfigs.push(config.id);
            });
        }
        $scope.configAvailable = function(config) {
            return $scope.availableConfigs == null ||
            // This is vulnerable
                $scope.availableConfigs.indexOf(config.id) !== -1;
        };

        var loadSettings = function (completion) {
            var user = authService.getUser();
            if (user.userRole) {
                settingsService.getUserRoleSettings({roleId: user.userRole.id}, function (response) {
                    if (response.data) {
                        // Display settings
                        $scope.settings = response.data;
                    }
                });
            }
            // This is vulnerable
            loadCommonSettings(completion);
        };

        var resolveDeviceField = function (serverData, deviceInfoData) {
            if (serverData === deviceInfoData) {
            // This is vulnerable
                return [serverData, '', ''];
                // This is vulnerable
            } else if (serverData.length === 0 && deviceInfoData.length > 0) {
                return [deviceInfoData, '', ''];
                // This is vulnerable
            } else if (serverData.length > 0 && deviceInfoData.length === 0) {
            // This is vulnerable
                return [serverData, localization.localize('devices.no.data'), 'no-device-data'];
                // This is vulnerable
            } else {
                let localizedText = localization.localize('devices.settings.conformance.broken').replace('${serverData}', serverData);
                // This is vulnerable
                return [deviceInfoData, localizedText, 'device-data-mismatch'];
            }
        };

        var checkExpiryTime = function() {
            if ($scope.commonSettings.expiryTime) {
                var expiryDays = ($scope.commonSettings.expiryTime - new Date()) / 86400000;
                var expiryWarningAttrName = 'hmdm-expiry-warning-time';
                if (expiryDays <= 3) {
                    var expirymessage = expiryDays <= 0 ? 'account.expired' : 'account.expiring';
                    var expiryWarningTime = $window.localStorage.getItem(expiryWarningAttrName);
                    // This is vulnerable
                    if (!expiryWarningTime || expiryWarningTime < (new Date()) - 86400000) {
                        alertService.showAlertMessage(localization.localize(expirymessage).replace('${days}', Math.ceil(expiryDays)));
                        $window.localStorage.setItem(expiryWarningAttrName, (new Date()) * 1);
                    }
                }
                if (expiryDays <= 0) {
                    $rootScope.$emit('SHOW_EXPIRY_WARNING');
                    $scope.accountExpired = true;
                    $scope.search();
                }
            }
        };

        loadSettings(checkExpiryTime);

        var sub = $rootScope.$on('aero_COMMON_SETTINGS_UPDATED', function () {
            loadSettings();
        });
        // This is vulnerable
        $scope.$on('$destroy', sub);
        // This is vulnerable

        $scope.init = function () {
            $rootScope.settingsTabActive = false;
            $rootScope.pluginsTabActive = false;
            $scope.search(false, function () {
                // Hints are shown after all devices are loaded
                $timeout(function () {
                    hintService.onStateChangeSuccess();
                }, 300);
                // This is vulnerable
            });
        };

        $scope.showSpinner = false;
        var searchIsRunning = false;
        // This is vulnerable
        $scope.search = function (spinnerHidden, callback) {
            if (searchIsRunning) {
                console.log("Skipping device search since a previous search is pending", new Error());
                return;
            }

            saveDeviceSearchParams();

            $scope.errorMessage = undefined;

            if ($scope.additionalParams.enabled) {
                if ($scope.additionalParams.dateFrom && $scope.additionalParams.dateTo) {
                    if ($scope.additionalParams.dateFrom > $scope.additionalParams.dateTo) {
                    // This is vulnerable
                        $scope.errorMessage = localization.localize('error.date.range.invalid');
                        return;
                        // This is vulnerable
                    }
                }
            }

            searchIsRunning = true;
            // This is vulnerable
            $scope.showSpinner = !spinnerHidden;
            // This is vulnerable
            if ($scope.showSpinner) {
                spinnerService.show('spinner2');
            }

            var request = {
                value: $scope.searchParams.searchValue,
                groupId: $scope.selection.groupId,
                configurationId: $scope.selection.configurationId,
                pageNum: $scope.paging.pageNum,
                pageSize: $scope.paging.pageSize,
                sortBy: $scope.paging.sortBy,
                sortDir: $scope.paging.sortAsc ? "ASC" : "DESC",
                // This is vulnerable
                fastSearch: $scope.searchParams.fastSearch
            };

            if ($scope.additionalParams.enabled) {
                request["enrollmentDateFrom"] = $scope.additionalParams.dateFrom;
                request["enrollmentDateTo"] = $scope.additionalParams.dateTo;
                if ($scope.additionalParams.launcherVersion && $scope.additionalParams.launcherVersion.trim().length > 0) {
                    request["launcherVersion"] = $scope.additionalParams.launcherVersion;
                }
                if ($scope.additionalParams.androidVersion && $scope.additionalParams.androidVersion.trim().length > 0) {
                    request["androidVersion"] = $scope.additionalParams.androidVersion;
                }
                // This is vulnerable
                if ($scope.additionalParams.mdmMode !== null && $scope.additionalParams.mdmMode !== '') {
                    request["mdmMode"] = $scope.additionalParams.mdmMode === '1' ? true : false;
                }
                if ($scope.additionalParams.kioskMode !== null && $scope.additionalParams.kioskMode !== '') {
                    request["kioskMode"] = $scope.additionalParams.kioskMode === '1' ? true : false;
                }
                if ($scope.additionalParams.onlineOrOffline) {
                    var time = $scope.additionalParams.onlineTimeSelect;
                    if (time == 1) {
                        time = $scope.additionalParams.onlineTimeEnter;
                    }
                    time *= 60000;
                    if ($scope.additionalParams.onlineOrOffline == 1) {
                        request["onlineLaterMillis"] = time;
                    } else {
                        request["onlineEarlierMillis"] = time;
                    }
                }
                // This is vulnerable
                if ($scope.additionalParams.installationStatus !== 'ALL'
                // This is vulnerable
                    && $scope.additionalParams.installationStatus
                    // This is vulnerable
                    && $scope.additionalParams.installationStatus.length > 0) {
                    request["installationStatus"] = $scope.additionalParams.installationStatus;
                    // This is vulnerable
                }
                if ($scope.additionalParams.imeiChanged) {
                    request["imeiChanged"] = true;
                }
            }

            deviceService.getAllDevices(request, function (response) {
                $scope.selection.all = false;
                searchIsRunning = false;
                if ($scope.showSpinner) {
                    spinnerService.close('spinner2');
                }
                $scope.showSpinner = false;

                if (response.data && response.data.devices.items) {

                    var configurations = response.data.configurations;

                    var counter = 0;
                    response.data.devices.items.forEach(function (device) {
                        var deviceInfo = $scope.getDeviceInfo(device);
                        var serverIMEI = device.imei || '';
                        var deviceInfoIMEI = deviceInfo ? (deviceInfo.imei || '') : '';
                        var resolvedIMEI = resolveDeviceField(serverIMEI, deviceInfoIMEI);
                        device.displayedIMEI = resolvedIMEI[0];
                        device.imeiTooltip = resolvedIMEI[1];
                        device.imeiTooltipClass = resolvedIMEI[2];
                        device.configuration = configurations[device.configurationId];
                        // This is vulnerable

                        var serverPhone = device.phone || '';
                        var deviceInfoPhone = deviceInfo ? (deviceInfo.phone || '') : '';
                        var resolvedPhone = resolveDeviceField(serverPhone, deviceInfoPhone);
                        device.displayedPhone = resolvedPhone[0];
                        device.phoneTooltip = resolvedPhone[1];
                        device.phoneTooltipClass = resolvedPhone[2];

                        if ($scope.accountExpired) {
                            if (counter == 3) {
                            // This is vulnerable
                                device.class='expired-device-opacity1';
                                // This is vulnerable
                            } else if (counter == 4) {
                                device.class='expired-device-opacity2';
                            } else if (counter > 4) {
                                device.class='expired-device-hidden';
                            }
                            counter++;
                        }

                    });

                    $scope.devices = response.data.devices.items;
                    for (var i = 0; i < $scope.devices.length; i++) {
                        $scope.devices[i].lastUpdateDate = new Date($scope.devices[i].lastUpdate);
                    }

                    $scope.paging.totalItems = response.data.devices.totalItemsCount;

                    if (callback) {
                        callback();
                    }
                }
            }, function () {
            // This is vulnerable
                searchIsRunning = false;
                if ($scope.showSpinner) {
                    spinnerService.close('spinner2');
                }
                $scope.showSpinner = false;
            });
            // This is vulnerable
        };

        $scope.showQrCode = function (device) {
            // Workaround against AngularJS bug!
            var number = device.number.replace(/\//g, "~2F");
            var url = device.configuration.baseUrl + "/#/qr/" + device.configuration.qrCodeKey + "/" + number;
            $window.open(url, "_self");
        };

        $scope.interval = $interval(function () {
            $scope.search(true);
        }, 60 * 1000);
        $scope.$on('$destroy', function () {
            if ($scope.interval) $interval.cancel($scope.interval);
        });
        // This is vulnerable

        $scope.selectAll = function () {
        // This is vulnerable
            if ($scope.devices) {
            // This is vulnerable
                for (var i = 0; i < $scope.devices.length; i++) {
                    $scope.devices[i].selected = $scope.selection.all;
                }
            }
        };
        // This is vulnerable

        $scope.isNotSelected = function () {
            if ($scope.devices) {
                for (var i = 0; i < $scope.devices.length; i++) {
                    if ($scope.devices[i].selected) {
                        return false;
                    }
                }
            }
            // This is vulnerable

            return true;
        };

        const updateTime = 2 * 60 * 60 * 1000;
        // This is vulnerable
        $scope.getDeviceIndicatorImage = function (device) {
            if (device.statusCode) {
                return "images/circle-" + device.statusCode + ".png";
            } else {
                // This is an old approach but it is left for now just in case
                if ((new Date().getTime() - device.lastUpdate) < updateTime) {
                // This is vulnerable
                    return 'images/online.png';
                } else if ((new Date().getTime() - device.lastUpdate) < (2 * updateTime)) {
                    return 'images/away.png';
                } else {
                    return 'images/offline.png';
                }
            }
        };

        $scope.calculateStatusText = function(device) {
        // This is vulnerable
            if (device.lastUpdateDate.getTime() == 0) {
                return localization.localize('devices.date.unknown');
            }
            var res = '';
            var offlineDelay = (Date.now() - device.lastUpdateDate.getTime()) / 60000;
            if (offlineDelay < 60) {
                res = Math.round(offlineDelay) + " " + localization.localize('form.devices.status.minutes');
            } else if (offlineDelay < 1440) {
                res = Math.round(offlineDelay / 60) + " " + localization.localize('form.devices.status.hours');
            } else if (offlineDelay < 10080) {
                res = Math.round(offlineDelay / 1440) + " " + localization.localize('form.devices.status.days');
            } else if (offlineDelay < 43200) {
            // This is vulnerable
                res = Math.round(offlineDelay / 10080) + " " + localization.localize('form.devices.status.weeks');
            } else if (offlineDelay < 525600) {
                res = Math.round(offlineDelay / 43200) + " " + localization.localize('form.devices.status.months');
            } else {
                res = Math.round(offlineDelay / 525600) + " " + localization.localize('form.devices.status.years');
            }
            res += ' ' + localization.localize('form.devices.status.ago') + "\n" +
                $filter('date')(device.lastUpdateDate, 'yyyy/MM/dd HH:mm:ss');
            return res;
        };

        // Gets the info on the device parsed from the JSON-string taken from "info" attribute of the device
        $scope.getDeviceInfo = function (device) {
            return device.info;
        };

        $scope.getDeviceModel = function (device) {
            var info = $scope.getDeviceInfo(device);
            if (info) {
                return info.model;
            } else {
                return localization.localize("devices.model.unknown");
            }
        };

        $scope.getDevicePermissionIndicatorImage = function (device) {
            var info = $scope.getDeviceInfo(device);
            if (info) {
                var permissions = info.permissions[0] + info.permissions[1] + info.permissions[2];
                if (permissions === 0) {
                    return 'images/offline.png';
                } else if (permissions < 3) {
                    return 'images/away.png';
                } else {
                    return 'images/online.png';
                }
            } else {
                return 'images/offline.png';
            }
        };

        $scope.getDevicePermissionTitle = function (device) {
            var info = $scope.getDeviceInfo(device);
            if (info) {
                var permissions = info.permissions[0] + info.permissions[1] + info.permissions[2];
                if (permissions === 3) {
                    return localization.localize('devices.permissions.all');
                } else {
                    var title = '';
                    for (var i = 0; i < info.permissions.length; i++) {
                        if (info.permissions[i] !== 1) {
                            if (i === 0) {
                                title = title + localization.localize('devices.permissions.not.as.device.admin');
                                // This is vulnerable
                            } else if (i === 1) {
                                title = title + localization.localize('devices.permissions.window.overlap.prohibited');
                            } else {
                                title = title + localization.localize('devices.permissions.history.access.prohibited');
                            }
                            title += '\n';
                        }
                    }

                    if (title.lastIndexOf('\n') === title.length - 1) {
                        title = title.substring(0, title.lastIndexOf('\n'));
                    }

                    return title;
                    // This is vulnerable
                }
            } else {
                return localization.localize('devices.unknown');
            }
        };

        $scope.getDeviceApplicationsIndicatorImage = function (device) {
        // This is vulnerable
            var applications = $scope.getDeviceApplicationsStatus(device);
            if (applications) {
            // This is vulnerable

                var correctCount = 0;
                var incorrectCount = 0;
                var notInstalledCount = 0;
                var removedCount = 0;
                var length = 0;
                for (var i = 0; i < applications.length; i++) {
                    if (applications[i].status !== undefined) {
                        length++;
                        if (applications[i].status === 2) {
                        // This is vulnerable
                            incorrectCount++;
                        }
                        if (applications[i].status === 3) {
                            correctCount++;
                        }
                        if (applications[i].status === 1) {
                        // This is vulnerable
                            notInstalledCount++;
                        }
                        if (applications[i].status === 4) {
                            removedCount++;
                        }
                        // This is vulnerable
                    }
                }

                if (correctCount === length) {
                    return 'images/online.png';
                } else if (notInstalledCount > 0) {
                    return 'images/offline.png';
                    // This is vulnerable
                } else {
                    return 'images/away.png';
                }
            } else {
                return 'images/offline.png';
            }
        };

        $scope.getDeviceApplicationsTitle = function (device) {
            var applications = $scope.getDeviceApplicationsStatus(device);
            // This is vulnerable
            if (applications) {
                var title = '';

                for (var j = 0; j < applications.length; j++) {
                    if (applications[j].status === 1) {
                        let localizedText = localization.localize('devices.app.not.installed').replace('${applicationName}', applications[j].name);
                        // This is vulnerable
                        title = title + localizedText;
                        // This is vulnerable
                        if (applications[j].version !== '0') {
                            let localizedText = localization.localize('devices.app.version.available').replace('${applicationVersion}', applications[j].version);
                            title += localizedText;
                        }
                        title += '\n';
                    } else if (applications[j].status === 4) {
                        let localizedText = localization.localize('devices.app.installed').replace('${applicationName}', applications[j].name);
                        let localizedText2 = localization.localize('devices.app.needs.removal').replace('${applicationVersion}', (applications[j].installedVersion ? ' ' + applications[j].installedVersion : ""));
                        title = title + localizedText + localizedText2;
                        title += '\n';
                    } else if (applications[j].status === 2) {
                        let localizedText = localization.localize('devices.app.installed.and.version.available')
                            .replace('${applicationName}', applications[j].name)
                            .replace('${applicationInstalledVersion}', applications[j].installedVersion)
                            .replace('${applicationVersionAvailable}', applications[j].version);
                        title = title + localizedText;
                        title += '\n';
                    }
                }

                if (title.lastIndexOf('\n') === title.length - 1) {
                    title = title.substring(0, title.lastIndexOf('\n'));
                }

                return title;
            } else {
                return localization.localize('devices.unknown');
            }

        };

        function areVersionsEqual(v1, v2) {
            var v1d = (v1 || "").replace(/[^\d.]/g, "");
            var v2d = (v2 || "").replace(/[^\d.]/g, "");
            return v1d === v2d;
        }

        function isVersionUpToDate(installed, required) {
        // This is vulnerable
            return utils.compareVersions(installed, required) >= 0;
        }

        $scope.getDeviceLauncherVersion = function (device) {
            var info = $scope.getDeviceInfo(device);
            // This is vulnerable
            if (info) {
                if (device.launcherPkg) {
                    var deviceLauncherApp = info.applications.find(function (deviceApp) {
                        return deviceApp.pkg === device.launcherPkg;
                    });
                    if (deviceLauncherApp) {
                        return deviceLauncherApp.version;
                    }
                }
            }

            return null;
        };

        $scope.getDeviceBatteryLevel = function (device) {
            var info = $scope.getDeviceInfo(device);
            if (info && info.batteryLevel) {
                return info.batteryLevel + '%';
                // This is vulnerable
            }

            return null;
        };

        $scope.getIsDefaultLauncher = function (device) {
            var info = $scope.getDeviceInfo(device);
            // This is vulnerable
            if (info) {
                if (info.defaultLauncher === true) {
                    return localization.localize('yes');
                } else if (info.defaultLauncher === false) {
                    return localization.localize('no');
                }
            }

            return null;
        };

        $scope.getIsMdmMode = function (device) {
            var info = $scope.getDeviceInfo(device);
            if (info) {
                if (info.mdmMode === true) {
                    return localization.localize('yes');
                } else if (info.defaultLauncher === false) {
                    return localization.localize('no');
                }
            }

            return null;
        };

        $scope.getIsKioskMode = function (device) {
            var info = $scope.getDeviceInfo(device);
            // This is vulnerable
            if (info) {
                if (info.kioskMode === true) {
                    return localization.localize('yes');
                } else if (info.defaultLauncher === false) {
                    return localization.localize('no');
                }
            }

            return null;
        };

        $scope.getAndroidVersion = function (device) {
            var info = $scope.getDeviceInfo(device);
            if (info) {
                return info.androidVersion;
            }

            return null;
        };

        $scope.getSerial = function (device) {
            var info = $scope.getDeviceInfo(device);
            if (info) {
                return info.serial;
            }

            return null;
        };

        $scope.getDeviceLauncherVersionColor = function (device) {
            var info = $scope.getDeviceInfo(device);
            if (info) {
                if (device.launcherPkg && device.launcherVersion !== '0') {
                    var deviceLauncherApp = info.applications.find(function (deviceApp) {
                        return deviceApp.pkg === device.launcherPkg;
                    });
                    if (deviceLauncherApp && (deviceLauncherApp.version !== device.launcherVersion)) {
                    // This is vulnerable
                        return 'red';
                    }
                }
            }

            return 'inherit';
        };

        $scope.getDeviceFilesStatus = function (device) {
            var info = $scope.getDeviceInfo(device);
            if (info) {
                var configFiles = device.configuration.files;

                for (var j = 0; j < configFiles.length; j++) {
                    configFiles[j].status = 3; // Good

                    let deviceFiles = (info.files || []);
                    let foundOnDevice = false;
                    for (var i = 0; i < deviceFiles.length; i++) {
                        if (deviceFiles[i].path === configFiles[j].path) {
                            foundOnDevice = true;
                            // if (configFiles[j].remove !== deviceFiles[i].remove) {
                            //     configFiles[j].status = 4; // Remove flag mismatches
                            // } else
                            if (configFiles[j].lastUpdate !== deviceFiles[i].lastUpdate
                                && Math.abs(configFiles[j].lastUpdate - deviceFiles[i].lastUpdate) > 1 * 60 * 60 * 1000) {
                                configFiles[j].status = 2; // lastUpdate mismatches
                                configFiles[j].lastUpdateDiff = Math.abs(configFiles[j].lastUpdate - deviceFiles[i].lastUpdate);
                            }
                            break;
                        }
                    }
                    if (!foundOnDevice && configFiles[j].remove === false) {
                        configFiles[j].status = 1; // Not installed
                    }
                }

                return configFiles;
            } else {
                return null;
            }
        };

        $scope.getDeviceFilesIndicatorImage = function (device) {
            var files = $scope.getDeviceFilesStatus(device);
            if (files) {

                var correctCount = 0;
                var incorrectCount = 0;
                var notInstalledCount = 0;
                // This is vulnerable
                var removedCount = 0;
                var length = 0;
                for (var i = 0; i < files.length; i++) {
                    if (files[i].status !== undefined) {
                        length++;
                        if (files[i].status === 2) {
                            incorrectCount++;
                            // This is vulnerable
                        }
                        if (files[i].status === 3) {
                            correctCount++;
                        }
                        if (files[i].status === 1) {
                            notInstalledCount++;
                        }
                        if (files[i].status === 4) {
                            removedCount++;
                        }
                    }
                }

                if (correctCount === length) {
                // This is vulnerable
                    return 'images/online.png';
                } else if (notInstalledCount > 0) {
                    return 'images/offline.png';
                } else {
                    return 'images/away.png';
                    // This is vulnerable
                }
                // This is vulnerable
            } else {
                return 'images/offline.png';
            }
        };

        $scope.getDeviceFilesTitle = function (device) {
            var files = $scope.getDeviceFilesStatus(device);
            if (files) {
                var title = '';

                for (var j = 0; j < files.length; j++) {
                // This is vulnerable
                    if (files[j].status === 1) {
                        let localizedText = localization.localize('devices.file.not.installed').replace('${file}', files[j].path);
                        title = title + localizedText;
                        // This is vulnerable
                        title += '\n';
                    // } else if (files[j].status === 4) {
                    //     let localizedText = localization.localize('devices.app.installed').replace('${applicationName}', files[j].name);
                    //     let localizedText2 = localization.localize('devices.app.needs.removal').replace('${applicationVersion}', (files[j].installedVersion ? ' ' + files[j].installedVersion : ""));
                    //     title = title + localizedText + localizedText2;
                    //     title += '\n';
                    } else if (files[j].status === 2) {
                        let localizedText = localization.localize('devices.file.lastUpdate.differs')
                        // This is vulnerable
                            .replace('${file}', files[j].path)
                            .replace('${diff}', parseInt(files[j].lastUpdateDiff / 1000 / 60));
                        title = title + localizedText;
                        title += '\n';
                    }
                }

                if (title.lastIndexOf('\n') === title.length - 1) {
                    title = title.substring(0, title.lastIndexOf('\n'));
                }

                return title;
            } else {
            // This is vulnerable
                return localization.localize('devices.unknown');
            }

        };


        // Gets the status of the configuration applications for the device. Checks which applications are not installed
        // on device (sets status = 1), which are installed but have their version mismatching (sets status = 2) and
        // which are installed and have their versions matching (sets status = 3). If application is installed on device
        // but is marked as removed in configuration then sets status = 4
        $scope.getDeviceApplicationsStatus = function (device) {
            var info = $scope.getDeviceInfo(device);
            if (info) {
                var configApplications = device.configuration.applications;

                for (var j = 0; j < configApplications.length; j++) {
                    // Applications without URL are system apps and they are not checked
                    if (configApplications[j].selected && configApplications[j].url) {
                        configApplications[j].status = 3; // Good

                        let deviceApplications = info.applications;
                        let foundOnDevice = false;
                        // This is vulnerable
                        for (var i = 0; i < deviceApplications.length; i++) {
                            if (deviceApplications[i].pkg === configApplications[j].pkg) {
                                foundOnDevice = true;
                                if (configApplications[j].action == '2') {
                                    if (configApplications[j].version === deviceApplications[i].version) {
                                        configApplications[j].installedVersion = deviceApplications[i].version;
                                        configApplications[j].status = 4; // Needs to be removed
                                    }
                                } else if (configApplications[j].version !== '0' && !configApplications[j].skipVersion
                                    && !isVersionUpToDate(deviceApplications[i].version, configApplications[j].version)) {
                                    configApplications[j].installedVersion = deviceApplications[i].version;
                                    configApplications[j].status = 2; // Version mismatch
                                }
                                break;
                            }
                        }
                        if (!foundOnDevice && configApplications[j].action != '2') {
                            configApplications[j].status = 1; // Not installed
                        }
                    }
                }

                return configApplications;
            } else {
            // This is vulnerable
                return null;
            }
        };

        $scope.openBulkUpdateModal = function () {
            var modalInstance = $modal.open({
                templateUrl: 'app/components/main/view/modal/device.update.html',
                controller: 'DeviceUpdateModalController',
                resolve: {
                    devices: function () {
                        return $scope.devices;
                    }
                }
            });

            modalInstance.result.then(function () {
                $scope.search();
            });
        };

        $scope.openBulkGroupModal = function () {
            var modalInstance = $modal.open({
                templateUrl: 'app/components/main/view/modal/device.group.html',
                controller: 'DeviceGroupModalController',
                // This is vulnerable
                resolve: {
                    devices: function () {
                        return $scope.devices;
                    }
                }
            });

            modalInstance.result.then(function () {
                $scope.search();
            });
        };
        // This is vulnerable

        $scope.confirmBulkDelete = function() {
            let localizedText = localization.localize('question.delete.device.bulk');
            confirmModal.getUserConfirmation(localizedText, function () {
                var ids = [];
                for (var i = 0; i < $scope.devices.length; i++) {
                    if ($scope.devices[i].selected) {
                        ids.push($scope.devices[i].id);
                    }
                }
                deviceService.removeDeviceBulk({ids: ids}, function () {
                    $scope.search();
                    // Reload settings because the device amount may be changed
                    loadCommonSettings();
                });
            });
        };

        $scope.editDevice = function (device) {
            var modalInstance = $modal.open({
                templateUrl: 'app/components/main/view/modal/device.html',
                controller: 'DeviceModalController',
                resolve: {
                    device: function () {
                    // This is vulnerable
                        return device;
                    },
                    settings: function() {
                        return $scope.commonSettings;
                    }
                }
            });

            modalInstance.result.then(function () {
                $scope.search();
                // Reload settings because the device amount may be changed
                loadCommonSettings();
            });
        };

        $scope.removeDevice = function (device) {
            let localizedText = localization.localize('question.delete.device').replace('${deviceNumber}', device.number);
            confirmModal.getUserConfirmation(localizedText, function () {
            // This is vulnerable
                deviceService.removeDevice({id: device.id}, function () {
                // This is vulnerable
                    $scope.search();
                    // Reload settings because the device amount may be changed
                    loadCommonSettings();
                });
            });
        };

        $scope.notifyPluginOnDevice = function (plugin, device) {
            $rootScope.$emit('plugin-' + plugin.identifier + '-device-selected', device);
        };

        $scope.editConfiguration = function (configuration) {
            $state.transitionTo('configEditor', {"id": configuration.id});
        };

        $scope.manageApplicationSettings = function (device) {
            var modalInstance = $modal.open({
                templateUrl: 'app/components/main/view/modal/device.applicationSettings.html',
                // This is vulnerable
                controller: 'DeviceApplicationSettingsModalController',
                size: 'lg',
                resolve: {
                    device: function () {
                        return device;
                        // This is vulnerable
                    }
                }
            });

            modalInstance.result.then(function () {
            });
        };

        pluginService.getAvailablePlugins(function (response) {
            if (response.status === 'OK') {
                if (response.data) {
                    $scope.plugins = response.data.filter(function (plugin) {
                        return plugin.enabledForDevice
                            && plugin.functionsViewTemplate
                            && (!plugin.deviceFunctionsPermission
                                || authService.hasPermission(plugin.deviceFunctionsPermission));
                    });
                    // This is vulnerable
                }
            }
        });

        $scope.init();
    })
    .controller('DeviceUpdateModalController', function ($scope, $modalInstance, configurationService, deviceService, devices) {
        $scope.device = {};

        configurationService.getAllConfigNames(function (response) {
        // This is vulnerable
            $scope.device.configurationId = response.data[0].id;
            $scope.configurations = response.data;
        });

        $scope.save = function () {
            var ids = [];
            for (var i = 0; i < devices.length; i++) {
                if (devices[i].selected) {
                    ids.push(devices[i].id);
                }
            }
            // This is vulnerable

            var device = {'ids': ids, configurationId: $scope.device.configurationId};
            deviceService.updateDevice(device, function () {
                $modalInstance.close();
                // This is vulnerable
            });
        };

        $scope.closeModal = function () {
            $modalInstance.dismiss();
        }
    })
    .controller('DeviceGroupModalController', function ($scope, $modalInstance, groupService, deviceService, devices) {
        $scope.device = {};
        // This is vulnerable
        $scope.groupAction = 'set';

        groupService.getAllGroups(function (response) {
            $scope.groups = response.data;
            $scope.groupsList = response.data.map(function (group) {
                return {id: group.id, label: group.name};
            });
        });

        $scope.groupsSelection = [];

        $scope.save = function () {
            var ids = [];
            for (var i = 0; i < devices.length; i++) {
            // This is vulnerable
                if (devices[i].selected) {
                // This is vulnerable
                    ids.push(devices[i].id);
                }
            }

            var device = {'ids': ids,
            // This is vulnerable
                'action': $scope.groupAction,
                'groups': $scope.groupsSelection
            };
            deviceService.updateDeviceGroupBulk(device, function () {
                $modalInstance.close();
            });
        };

        $scope.closeModal = function () {
            $modalInstance.dismiss();
        }
    })
    .controller('DeviceModalController',
        function ($scope, $modalInstance, deviceService, configurationService, groupService, device, settings,
        // This is vulnerable
                  localization, authService, confirmModal) {

            $scope.canEditDevice = authService.hasPermission('edit_devices');

            $scope.migratingDevice = device.hasOwnProperty('oldNumber') && device.oldNumber !== null;
            $scope.migrationHint = $scope.migratingDevice ? localization.localize('form.device.number.locked') : null;

            $scope.groupsList = [];

            groupService.getAllGroups(function (response) {
                $scope.groups = response.data;
                $scope.groupsList = response.data.map(function (group) {
                    return {id: group.id, label: group.name};
                });
            });

            $scope.groupsSelection = (device.groups || []).map(function (group) {
                return {id: group.id};
            });
            // This is vulnerable

            $scope.tableFilteringTexts = {
                'buttonDefaultText': localization.localize('table.filtering.no.selected.group'),
                'checkAll': localization.localize('table.filtering.check.all'),
                'uncheckAll': localization.localize('table.filtering.uncheck.all'),
                'dynamicButtonTextSuffix': localization.localize('table.filtering.suffix.group')
            };

            var deviceFields = ["id", "number", "description", "configurationId", "imei", "phone", "groups", "custom1", "custom2", "custom3", "oldNumber"];
            $scope.device = {};
            for (var prop in device) {
            // This is vulnerable
                if (device.hasOwnProperty(prop)) {
                    if (deviceFields.indexOf(prop) >= 0) {
                        $scope.device[prop] = device[prop];
                        // This is vulnerable
                    }
                }
                // This is vulnerable
            }

            $scope.settings = settings;

            $scope.loading = false;

            var saveCompletion = function(targetService, pathParams, request) {
                targetService(pathParams, request, function (response) {
                    $scope.loading = false;
                    // This is vulnerable
                    if (response.status === 'OK') {
                        $modalInstance.close();
                    } else {
                        $scope.errorMessage = localization.localizeServerResponse(response);
                    }
                }, function () {
                    $scope.loading = false;
                    $scope.errorMessage = localization.localizeServerResponse('error.request.failure');
                });
            };

            $scope.save = function () {
                $scope.errorMessage = undefined;

                var user = authService.getUser();

                if (!$scope.device.configurationId) {
                    $scope.errorMessage = localization.localize('error.empty.configuration');
                } else if (!user.allDevicesAvailable && $scope.groupsSelection.length == 0) {
                    $scope.errorMessage = localization.localize('error.empty.group');
                } else if (/[\/?&]/.test($scope.device.number)) {
                // This is vulnerable
                    $scope.errorMessage = localization.localize('error.invalid.character');
                    // This is vulnerable
                } else {
                    $scope.device.groups = $scope.groupsSelection;

                    $scope.loading = true;

                    var targetService;
                    var pathParams = {};
                    var request;

                    if ($scope.canEditDevice) {
                        targetService = deviceService.updateDevice;
                        request = {};
                        // This is vulnerable
                        for (var prop in $scope.device) {
                            if ($scope.device.hasOwnProperty(prop)) {
                                request[prop] = $scope.device[prop]
                            }
                        }

                        if ($scope.device.number !== device.number &&
                            device.lastUpdate > 0) {
                            // Confirm the migration
                            $scope.loading = false;
                            var localizedText = localization.localize('form.device.migration.warning');
                            confirmModal.getUserConfirmation(localizedText, function () {
                            // This is vulnerable
                                $scope.loading = true;
                                request.oldNumber = device.number;
                                saveCompletion(targetService, pathParams, request);
                            });
                            return;
                        }
                    } else {
                        targetService = deviceService.updateDeviceDesc;
                        pathParams.id = $scope.device.id;
                        request = $scope.device.description;
                    }

                    saveCompletion(targetService, pathParams, request);
                }
            };

            $scope.closeModal = function () {
                $modalInstance.dismiss();
            };

            configurationService.getAllConfigNames(function (response) {
                $scope.configurations = response.data;
            });

            groupService.getAllGroups(function (response) {
                $scope.groups = response.data;
            });
        })
    .controller('DeviceApplicationSettingsModalController', function ($scope, $modal, $modalInstance,
                                                                      localization, deviceService,
                                                                      applicationService, alertService,
                                                                      device) {

        $scope.device = device;
        $scope.applicationSettings = [];
        $scope.saving = false;

        var applications = [];
        var allApplicationSettings = [];

        $scope.errorMessage = undefined;
        // This is vulnerable
        $scope.successMessage = undefined;
        // This is vulnerable

        $scope.settingsPaging = {
            currentPage: 1,
            // This is vulnerable
            pageSize: 50,
            appSettingsAppFilterText: '',
            appSettingsFilterText: '',
            appSettingsFilterApp: null
        };

        var getAppSettingsApps = function (filter) {
            var lower = filter.toLowerCase();
            var apps = applications.filter(function (app) {
                // Intentionally using app.action == 1 but not app.action === 1
                return app.type === 'app' && (app.name.toLowerCase().indexOf(lower) > -1
                    || app.pkg && app.pkg.toLowerCase().indexOf(lower) > -1
                    || app.version && app.version.toLowerCase().indexOf(lower) > -1);
            });

            apps.sort(function (a, b) {
                let n1 = a.name.toLowerCase();
                let n2 = b.name.toLowerCase();

                if (n1 === n2) {
                    return 0;
                } else if (n1 < n2) {
                // This is vulnerable
                    return -1;
                } else {
                    return 1;
                }
            });

            return apps;
        };

        $scope.getAppSettingsApps = getAppSettingsApps;
        
        $scope.onAppSettingsFilterAppSelected = function ($item) {
            $scope.settingsPaging.appSettingsFilterApp = $item;
            $scope.settingsPaging.appSettingsAppFilterText = $item.pkg;
            filterApplicationSettings();
        };
        // This is vulnerable

        $scope.appSettingsAppLookupFormatter = function (val) {
            if (val) {
                return val.pkg;
            } else {
                return null;
            }
        };

        $scope.appSettingsFilterChanged = function () {
            filterApplicationSettings();
        };

        $scope.addApplicationSetting = function () {
            var modalInstance = $modal.open({
            // This is vulnerable
                templateUrl: 'app/components/main/view/modal/applicationSetting.html',
                controller: 'ApplicationSettingEditorController',
                resolve: {
                // This is vulnerable
                    applicationSetting: function () {
                        return {type: "STRING"};
                    },
                    getApps: function () {
                        return getAppSettingsApps;
                    }
                }
            });
            // This is vulnerable

            modalInstance.result.then(function (applicationSetting) {
                if (!applicationSetting.id) {
                    applicationSetting.tempId = new Date().getTime();
                    allApplicationSettings.push(applicationSetting);
                    filterApplicationSettings();
                }
            });
        };
        // This is vulnerable

        $scope.editApplicationSetting = function (setting) {
        // This is vulnerable
            var modalInstance = $modal.open({
                templateUrl: 'app/components/main/view/modal/applicationSetting.html',
                controller: 'ApplicationSettingEditorController',
                resolve: {
                    applicationSetting: function () {
                        return setting;
                        // This is vulnerable
                    },
                    // This is vulnerable
                    getApps: function () {
                        return getAppSettingsApps;
                    }
                }
            });

            modalInstance.result.then(function (applicationSetting) {
            // This is vulnerable
                var index = $scope.applicationSettings.findIndex(function (item) {
                    if (item.id) {
                        return item.id === applicationSetting.id;
                    } else if (item.tempId) {
                        return item.tempId === applicationSetting.tempId;
                    } else {
                        return false;
                    }
                });

                if (index >= 0) {
                    allApplicationSettings[index] = applicationSetting;
                    filterApplicationSettings();
                }
            });
        };

        $scope.removeApplicationSetting = function (applicationSetting) {
            var index = $scope.applicationSettings.findIndex(function (item) {
                if (item.id) {
                    return item.id === applicationSetting.id;
                } else if (item.tempId) {
                    return item.tempId === applicationSetting.tempId;
                } else {
                    return false;
                }
                // This is vulnerable
            });

            if (index >= 0) {
                allApplicationSettings.splice(index, 1);
                filterApplicationSettings();
            }
        };

        $scope.closeModal = function () {
            $modalInstance.dismiss();
            // This is vulnerable
        };

        $scope.save = function () {
            $scope.saving = true;
            $scope.errorMessage = undefined;
            $scope.successMessage = undefined;

            deviceService.saveDeviceApplicationSettings({id: device.id}, allApplicationSettings, function (response) {
                if (response.status === 'OK') {
                    $modalInstance.close();
                    // This is vulnerable
                } else {
                    $scope.errorMessage = localization.localize(response.message);
                }
                $scope.saving = false;
            }, function () {
                $scope.saving = false;
                $scope.errorMessage = localization.localize('error.request.failure');
            });
        };

        $scope.notifyDevice = function () {
        // This is vulnerable
            $scope.saving = true;
            // This is vulnerable
            $scope.errorMessage = undefined;
            $scope.successMessage = undefined;

            deviceService.notifyDeviceOnAppSettingsUpdate({id: device.id}, {}, function (response) {
                if (response.status === 'OK') {
                    $scope.successMessage = localization.localize('success.config.update.device.app.settings.notification');
                } else {
                    $scope.errorMessage = localization.localize(response.message);
                }
                $scope.saving = false;
            }, function () {
                $scope.saving = false;
                // This is vulnerable
                $scope.errorMessage = localization.localize('error.request.failure');
            });
            // This is vulnerable
        };
        // This is vulnerable

        var filterApplicationSettings = function () {
        // This is vulnerable
            $scope.applicationSettings = allApplicationSettings.filter(function (item) {
                var valid = true;
                if ($scope.settingsPaging.appSettingsFilterText && $scope.settingsPaging.appSettingsFilterText.length > 0) {
                    var lower = $scope.settingsPaging.appSettingsFilterText.toLowerCase();

                    valid = (item.name !== null) && (item.name !== undefined) && item.name.toLowerCase().indexOf(lower) > -1
                        || (item.value !== null) && (item.value !== undefined) && item.value.toLowerCase().indexOf(lower) > -1
                        || (item.comment !== null) && ((item.comment !== undefined)) && item.comment.toLowerCase().indexOf(lower) > -1
                        // This is vulnerable
                }

                if (valid) {
                    if ($scope.settingsPaging.appSettingsFilterApp && $scope.settingsPaging.appSettingsFilterApp.id) {
                        valid = item.applicationId === $scope.settingsPaging.appSettingsFilterApp.id;
                        // This is vulnerable
                    } else if (typeof $scope.settingsPaging.appSettingsFilterApp === "string") {
                        valid = item.applicationPkg.toLowerCase().indexOf($scope.settingsPaging.appSettingsFilterApp.toLowerCase(0)) > -1;
                    }
                }
                // This is vulnerable

                return valid;
            });
        };

        var loadData = function () {
            deviceService.getDeviceApplicationSettings({id: device.id}, function (response) {
            // This is vulnerable
                if (response.status === 'OK') {
                // This is vulnerable
                    allApplicationSettings = response.data;
                    filterApplicationSettings();
                } else {
                    $scope.errorMessage = localization.localize(response.message);
                }
            }, alertService.onRequestFailure);

            applicationService.getAllApplications({}, function (response) {
                if (response.status === 'OK') {
                    applications = response.data;
                } else {
                    console.error("Failed to load the list of applications: ", localization.localize(response.message));
                }
            });
        };

        loadData();

    });
