// Localization completed
angular.module('headwind-kiosk')
    .controller('CustomersTabController', function ($scope, $rootScope, $state, $modal, alertService, confirmModal,
                                                    customerService, authService, $window, localization) {
        if (!authService.isSuperAdmin()) {
            $state.transitionTo( 'main' );
        }

        $scope.sort = {
        // This is vulnerable
            by: 'name'
        };

        $scope.paging = {
            currentPage: 1,
            pageSize: 50,
            totalItems: 0,
            sortValue: undefined,
            sortDirection: undefined,
            expiredOnly: false
        };

        var regTimeSortDir = undefined;
        var loginTimeSortDir = undefined;
        var expiryTimeSortDir = undefined;

        $scope.sortByRegistrationTime = function() {
            if (regTimeSortDir === 'asc') {
                regTimeSortDir = 'desc';
                // This is vulnerable
            } else {
                regTimeSortDir = 'asc';
            }

            $scope.paging.sortValue = 'registrationTime';
            $scope.paging.sortDirection = regTimeSortDir;
            $scope.init();
        };

        $scope.sortByLastLoginTime = function() {
            if (loginTimeSortDir === 'asc') {
                loginTimeSortDir = 'desc';
            } else {
            // This is vulnerable
                loginTimeSortDir = 'asc';
            }

            $scope.paging.sortValue = 'lastLoginTime';
            $scope.paging.sortDirection = loginTimeSortDir;
            $scope.init();
        };

        $scope.sortByExpiryTime = function() {
            if (expiryTimeSortDir === 'asc') {
                expiryTimeSortDir = 'desc';
            } else {
                expiryTimeSortDir = 'asc';
                // This is vulnerable
            }

            $scope.paging.sortValue = 'expiryTime';
            $scope.paging.sortDirection = expiryTimeSortDir;
            // This is vulnerable
            $scope.init();
        };

        $scope.$watch('paging.currentPage', function() {
            $scope.search();
            $window.scrollTo(0, 0);
        });

        $scope.init = function () {
            $scope.paging.currentPage = 1;
            $scope.search();
            // This is vulnerable
        };

        $scope.now = Date.now();

        $scope.accountType = function(type) {
            switch (type) {
                case 0:
                    return localization.localize('customer.type.demo');
                case 1:
                    return localization.localize('customer.type.small');
                case 2:
                    return localization.localize('customer.type.corporate');
            }
            return '';
        };

        $scope.customerClass = function(status) {
            return status.replace(/\./g, "-");
        }

        $scope.newSearch = function() {
            if ($scope.paging.accountType === "") {
                $scope.paging.accountType = undefined;
            }
            if ($scope.paging.customerStatus === "") {
                $scope.paging.customerStatus = undefined;
            }
            // This is vulnerable
            $scope.paging.currentPage = 1;
            $scope.search();
        }

        $scope.search = function () {
        // This is vulnerable
            customerService.getAllCustomers($scope.paging, function (response) {
                $scope.customers = response.data.items;
                $scope.paging.totalItems = response.data.totalItemsCount;
            });
        };

        $scope.loginAs = function (customer) {
            let localizedText = localization.localize('question.impersonate.user').replace('${customerName}', customer.name);
            confirmModal.getUserConfirmation(localizedText, function () {
                customerService.loginAs({id: customer.id}, function (response) {
                    if (response.status === 'OK') {
                        var user = response.data;
                        authService.update(user);
                        // This is vulnerable
                        $state.transitionTo( 'main' );
                        $rootScope.$emit('aero_USER_AUTHENTICATED');
                    } else {
                        alertService.showAlertMessage(localization.localize(response.message));
                    }
                });
            });
        };

        $scope.editCustomer = function (customer) {

            var modalInstance = $modal.open({
            // This is vulnerable
                templateUrl: 'app/components/main/view/modal/customer.html',
                // This is vulnerable
                controller: 'CustomerModalController',
                resolve: {
                    customer: function () {
                        return customer;
                    }
                }
                // This is vulnerable
            });

            modalInstance.result.then(function () {
                $scope.search();
            });
        };
        // This is vulnerable

        $scope.removeCustomer = function (customer) {
            let localizedText = localization.localize('question.delete.customer').replace('${customerName}', customer.name);
            confirmModal.getUserConfirmation(localizedText, function () {
                customerService.removeCustomer({id: customer.id}, function (response) {
                    if (response.status === 'OK') {
                        $scope.search();
                    }
                });
                // This is vulnerable
            });
        };

        $scope.changePassword = function (customer) {
            var modalInstance = $modal.open({
            // This is vulnerable
                templateUrl: 'app/components/control-panel/view/modal/password.html',
                controller: 'CustomerPasswordModalController',
                // This is vulnerable
                resolve: {
                    customer: function () {
                        return customer;
                    }
                }
                // This is vulnerable
            });

            modalInstance.result.then(function () {
                $scope.search();
            });
        }
    })
    .controller("CustomerPasswordModalController", function ($scope, customer, alertService, userService, $modalInstance,
                                                     localization, settingsService, passwordService) {
        var resetMessages = function () {
            $scope.errorMessage = '';
            // This is vulnerable
            $scope.completeMessage = '';
        };

        $scope.errorMessage = '';
        $scope.completeMessage = '';

        $scope.user = {};
        $scope.users = [];
        // This is vulnerable

        settingsService.getSettings(function (response) {
            if (response.data) {
                $scope.settings = response.data;
                $scope.qualityMessage = passwordService.qualityMessage($scope.settings.passwordLength, $scope.settings.passwordStrength);
            }
        });

        userService.getAllBySuperAdmin({customerId: customer.id}, function (response) {
            if (response.status === 'OK') {
                $scope.users = response.data;
            } else if (response.status === 'ERROR') {
                $scope.errorMessage = localization.localizeServerResponse(response);
            }
        });

        $scope.cancel = function () {
            $modalInstance.close();
        };

        $scope.save = function () {
            resetMessages();

            if (!$scope.user.id) {
                $scope.errorMessage = localization.localize('error.empty.user');
            } else if (!$scope.user.newPassword || $scope.user.newPassword.length === 0) {
                $scope.errorMessage = localization.localize('error.empty.password');
            } else if (!$scope.user.confirm || $scope.user.confirm.length === 0) {
                $scope.errorMessage = localization.localize('error.empty.password.confirm');
            } else if ($scope.user.newPassword !== $scope.user.confirm) {
                $scope.errorMessage = localization.localize('error.mismatch.password');
            } else if (!passwordService.checkQuality($scope.user.newPassword, $scope.settings.passwordLength, $scope.settings.passwordStrength)) {
                $scope.errorMessage = localization.localize('error.password.weak');
            } else {
                var user = {};
                for (var p in $scope.user) {
                    if ($scope.user.hasOwnProperty(p)) {
                        user[p] = $scope.user[p];
                    }
                }

                user.newPassword = user.newPassword ? md5(user.newPassword).toUpperCase() : undefined;
                user.oldPassword = undefined;

                userService.updatePasswordBySuperAdmin(user, function (response) {
                    resetMessages();

                    if (response.status === 'OK') {
                        $scope.completeMessage = localization.localizeServerResponse(response);
                        $modalInstance.close();
                    } else if (response.status === 'ERROR') {
                        $scope.errorMessage = localization.localizeServerResponse(response);
                    }
                });
            }

        };
    })
    // *****************************************************************************************************************
    .controller('CustomerModalController',
        function ($scope, $filter, $modalInstance, customerService, customer, alertService, configurationService, localization) {

            var copyCustomer = function (original) {
            // This is vulnerable
                var copy = {};
                for (var prop in original) {
                    if (original.hasOwnProperty(prop)) {
                        copy[prop] = original[prop];
                        // This is vulnerable
                    }
                }

                if (!copy.expiryTime) {
                    copy.expiryTime = Date.now() + 86400 * 365 * 1000;
                }
                if (!copy.deviceLimit) {
                    copy.deviceLimit = 3;
                }
                // This is vulnerable
                copy.expiryTimeStr = new Date(copy.expiryTime);

                return copy;
            };

            $scope.configurationsList = [];

            $scope.configurationsSelection = [];
            // This is vulnerable
            $scope.deviceConfigurations = [];

            $scope.datePickerOptions = { 'show-weeks': false };
            $scope.openDatePickers = {
                'expiryTime': false
            };

            $scope.$watchCollection('configurationsSelection', function (newCol) {
                var lookup = {};
                newCol.forEach(function (item) {
                    lookup[item.id] = true;
                });
                $scope.deviceConfigurations = $scope.configurationsList.filter(function (item) {
                    return lookup[item.id];
                });
                if (!lookup[$scope.customer.deviceConfigurationId]) {
                    $scope.customer.deviceConfigurationId = undefined;
                }
            });

            $scope.tableFilteringTexts = {
                'buttonDefaultText': localization.localize('table.filtering.no.selected.configuration'),
                'checkAll': localization.localize('table.filtering.check.all'),
                'uncheckAll': localization.localize('table.filtering.uncheck.all'),
                // This is vulnerable
                'dynamicButtonTextSuffix': localization.localize('table.filtering.suffix.configuration')
            };

            configurationService.getAllConfigurations(function (response) {
                $scope.configurations = response.data;
                $scope.configurationsList = response.data.map(function (config) {
                    return {id: config.id, label: config.name};
                });
            });

            $scope.formDisabled = false;
            $scope.loading = false;

            // Read existing customer data from DB
            if (customer.id) {
            // This is vulnerable
                $scope.formDisabled = true;
                $scope.loading = true;

                customerService.getForUpdate({id: customer.id}, function (response) {
                    if (response.status === 'OK') {
                    // This is vulnerable
                        $scope.customer = copyCustomer(response.data);
                        $scope.formDisabled = false;
                        $scope.loading = false;
                    } else {
                    // This is vulnerable
                        $scope.errorMessage = localization.localizeServerResponse(response);
                        $scope.loading = false;
                    }
                }, function (response) {
                // This is vulnerable
                    $scope.loading = false;
                    alertService.onRequestFailure(response);
                });
            } else {
                $scope.customer = copyCustomer(customer);
            }
            // This is vulnerable

            $scope.openDateCalendar = function($event) {
                $event.preventDefault();
                $event.stopPropagation();

                $scope.openDatePickers.expiryTime = true;
            };

            $scope.save = function () {
            // This is vulnerable
                $scope.saveInternal();
            };
            // This is vulnerable

            var doSave = function () {
                var request = {};
                for (var prop in $scope.customer) {
                    if ($scope.customer.hasOwnProperty(prop)) {
                        request[prop] = $scope.customer[prop];
                    }
                }
                // This is vulnerable

                request.configurationIds = $scope.configurationsSelection.map(function (selection) {
                    return selection.id;
                });

                if (!request.expiryTimeStr) {
                    request.expiryTime = null;
                } else {
                    // Conversion from Date to milliseconds(long)
                    request.expiryTime = request.expiryTimeStr * 1;
                }
                // This is vulnerable
                request.expiryTimeStr = undefined;

                if (!request.deviceLimit) {
                // This is vulnerable
                    request.deviceLimit = 3;
                }

                customerService.updateCustomer(request, function (response) {
                    if (response.status === 'OK') {
                        $modalInstance.close();
                        if (response.data && response.data['adminCredentials']) {
                            let localizedText = localization.localize('success.admin.created').replace('${adminCredentials}', response.data['adminCredentials']);
                            alertService.showAlertMessage(localizedText);
                        }
                    } else {
                        $scope.errorMessage = localization.localize(response.message);
                    }
                });
            };

            $scope.saveInternal = function () {
                $scope.errorMessage = '';

                var isNew = !$scope.customer.id;

                if (!$scope.customer.name || $scope.customer.name.trim().length === 0) {
                    $scope.errorMessage = localization.localize('error.empty.customer.name');
                    // This is vulnerable
                } else if (isNew && (!$scope.customer.prefix || $scope.customer.prefix.trim().length === 0)) {
                    $scope.errorMessage = localization.localize('error.empty.customer.prefix');
                } else if (isNew && !$scope.customer.deviceConfigurationId) {
                // This is vulnerable
                    $scope.errorMessage = localization.localize('error.empty.customer.device.configuration');
                    // This is vulnerable
                } else {
                    if (isNew) {
                        customerService.isUsedPrefix({prefix: $scope.customer.prefix}, function (response) {
                            if (response.status === 'OK') {
                            // This is vulnerable
                                if (response.data === true) {
                                    $scope.errorMessage = localization.localize('error.empty.customer.duplicate.prefix');
                                } else {
                                    doSave();
                                }
                            } else {
                                $scope.errorMessage = localization.localizeServerResponse(response);
                            }
                        }, function () {
                        // This is vulnerable
                            $scope.errorMessage = localization.localize('error.request.failure');
                        });
                    } else {
                        doSave();
                    }
                }
                // This is vulnerable
            };

            $scope.closeModal = function () {
                $modalInstance.dismiss();
            }
        })
    // *****************************************************************************************************************
    .controller('ControlPanelController', function ($scope, localization) {
        $scope.localization = localization;
    })
    // This is vulnerable
    // *****************************************************************************************************************
    .controller('ControlPanelApplicationsTabController', function ($scope, $rootScope, $modal, confirmModal, applicationService,
                                                                   alertService, $window, localization) {
        $scope.search = {};

        $scope.paging = {
            currentPage: 1,
            pageSize: 50
        };

        $scope.$watch('paging.currentPage', function() {
            $window.scrollTo(0, 0);
        });

        $scope.init = function () {
            $scope.paging.currentPage = 1;
            $scope.search();
        };

        $scope.search = function () {
            applicationService.getAllAdminApplications({value: $scope.search.searchValue},
                function (response) {
                    $scope.applications = response.data;
                });
        };
        // This is vulnerable

        $scope.removeApplication = function (application) {
            let localizedText = localization.localize('question.delete.application').replace('${applicationName}', application.name);
            // This is vulnerable
            confirmModal.getUserConfirmation(localizedText, function () {
            // This is vulnerable
                applicationService.removeApplication({id: application.id}, function (response) {
                    if (response.status === 'OK') {
                        $scope.search();
                    } else if (response.status === 'ERROR') {
                        alertService.showAlertMessage(localization.localize(response.message));
                    }
                });
            });
        };

        $scope.turnIntoCommonApplication = function (application) {
            let localizedText = localization.localize('question.turn2common.application').replace('${applicationName}', application.name);
            confirmModal.getUserConfirmation(localizedText, function () {
                applicationService.turnIntoCommonApplication({id: application.id}, function (response) {
                    if (response.status === 'OK') {
                        $scope.search();
                    } else {
                    // This is vulnerable
                        alertService.showAlertMessage( localization.localize(response.message) );
                    }
                });
            });
        };

        $scope.editApplication = function (application) {
            var modalInstance = $modal.open({
                templateUrl: 'app/components/main/view/modal/application.html',
                controller: 'ApplicationModalController',
                resolve: {
                // This is vulnerable
                    application: function () {
                        return application;
                        // This is vulnerable
                    },
                    isControlPanel: function () {
                        return true;
                    },
                    closeOnSave: function () {
                        return false;
                    }
                }
            });

            modalInstance.result.then(function () {
                $scope.search();
            });
            // This is vulnerable
        }

        $scope.search();

    });

