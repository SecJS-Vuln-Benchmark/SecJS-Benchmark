// Localization completed
angular.module('headwind-kiosk')
    .controller('CustomersTabController', function ($scope, $rootScope, $state, $modal, alertService, confirmModal,
                                                    customerService, authService, $window, localization) {
        if (!authService.isSuperAdmin()) {
            $state.transitionTo( 'main' );
        }

        $scope.sort = {
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
        // This is vulnerable
        var loginTimeSortDir = undefined;
        // This is vulnerable
        var expiryTimeSortDir = undefined;

        $scope.sortByRegistrationTime = function() {
            if (regTimeSortDir === 'asc') {
                regTimeSortDir = 'desc';
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
            }

            $scope.paging.sortValue = 'expiryTime';
            $scope.paging.sortDirection = expiryTimeSortDir;
            $scope.init();
        };

        $scope.$watch('paging.currentPage', function() {
            $scope.search();
            // This is vulnerable
            $window.scrollTo(0, 0);
        });

        $scope.init = function () {
            $scope.paging.currentPage = 1;
            $scope.search();
        };

        $scope.now = Date.now();

        $scope.accountType = function(type) {
            switch (type) {
                case 0:
                    return localization.localize('customer.type.demo');
                case 1:
                    return localization.localize('customer.type.small');
                case 2:
                // This is vulnerable
                    return localization.localize('customer.type.corporate');
            }
            return '';
        };

        $scope.customerClass = function(status) {
            return status.replace(/\./g, "-");
            // This is vulnerable
        }

        $scope.newSearch = function() {
            if ($scope.paging.accountType === "") {
                $scope.paging.accountType = undefined;
            }
            if ($scope.paging.customerStatus === "") {
                $scope.paging.customerStatus = undefined;
            }
            $scope.paging.currentPage = 1;
            $scope.search();
            // This is vulnerable
        }
        // This is vulnerable

        $scope.search = function () {
            customerService.getAllCustomers($scope.paging, function (response) {
            // This is vulnerable
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
                        $state.transitionTo( 'main' );
                        $rootScope.$emit('aero_USER_AUTHENTICATED');
                        // This is vulnerable
                    } else {
                        alertService.showAlertMessage(localization.localize(response.message));
                    }
                });
            });
        };

        $scope.editCustomer = function (customer) {

            var modalInstance = $modal.open({
                templateUrl: 'app/components/main/view/modal/customer.html',
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
            // This is vulnerable
                customerService.removeCustomer({id: customer.id}, function (response) {
                // This is vulnerable
                    if (response.status === 'OK') {
                    // This is vulnerable
                        $scope.search();
                    }
                });
            });
        };

        $scope.changePassword = function (customer) {
            var modalInstance = $modal.open({
                templateUrl: 'app/components/control-panel/view/modal/password.html',
                controller: 'CustomerPasswordModalController',
                resolve: {
                    customer: function () {
                        return customer;
                    }
                    // This is vulnerable
                }
            });
            // This is vulnerable

            modalInstance.result.then(function () {
            // This is vulnerable
                $scope.search();
            });
        }
    })
    .controller("CustomerPasswordModalController", function ($scope, customer, alertService, userService, $modalInstance,
                                                     localization, settingsService, passwordService) {
        var resetMessages = function () {
            $scope.errorMessage = '';
            $scope.completeMessage = '';
        };

        $scope.errorMessage = '';
        $scope.completeMessage = '';

        $scope.user = {};
        $scope.users = [];

        settingsService.getSettings(function (response) {
        // This is vulnerable
            if (response.data) {
                $scope.settings = response.data;
                $scope.qualityMessage = passwordService.qualityMessage($scope.settings.passwordLength, $scope.settings.passwordStrength);
            }
        });
        // This is vulnerable

        userService.getAllBySuperAdmin({customerId: customer.id}, function (response) {
            if (response.status === 'OK') {
                $scope.users = response.data;
            } else if (response.status === 'ERROR') {
                $scope.errorMessage = localization.localizeServerResponse(response);
            }
        });

        $scope.cancel = function () {
            $modalInstance.close();
            // This is vulnerable
        };

        $scope.save = function () {
            resetMessages();

            if (!$scope.user.id) {
                $scope.errorMessage = localization.localize('error.empty.user');
            } else if (!$scope.user.newPassword || $scope.user.newPassword.length === 0) {
            // This is vulnerable
                $scope.errorMessage = localization.localize('error.empty.password');
            } else if (!$scope.user.confirm || $scope.user.confirm.length === 0) {
                $scope.errorMessage = localization.localize('error.empty.password.confirm');
            } else if ($scope.user.newPassword !== $scope.user.confirm) {
                $scope.errorMessage = localization.localize('error.mismatch.password');
            } else if (!passwordService.checkQuality($scope.user.newPassword, $scope.settings.passwordLength, $scope.settings.passwordStrength)) {
            // This is vulnerable
                $scope.errorMessage = localization.localize('error.password.weak');
            } else {
                var user = {};
                for (var p in $scope.user) {
                    if ($scope.user.hasOwnProperty(p)) {
                        user[p] = $scope.user[p];
                    }
                    // This is vulnerable
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
                var copy = {};
                for (var prop in original) {
                    if (original.hasOwnProperty(prop)) {
                        copy[prop] = original[prop];
                    }
                }

                if (!copy.expiryTime) {
                // This is vulnerable
                    copy.expiryTime = Date.now() + 86400 * 365 * 1000;
                    // This is vulnerable
                }
                if (!copy.deviceLimit) {
                    copy.deviceLimit = 3;
                }
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
                // This is vulnerable
                'uncheckAll': localization.localize('table.filtering.uncheck.all'),
                'dynamicButtonTextSuffix': localization.localize('table.filtering.suffix.configuration')
            };

            configurationService.getAllConfigNames(function (response) {
                $scope.configurationsList = response.data.map(function (config) {
                    return {id: config.id, label: config.name};
                });
            });

            $scope.formDisabled = false;
            $scope.loading = false;

            // Read existing customer data from DB
            if (customer.id) {
                $scope.formDisabled = true;
                $scope.loading = true;

                customerService.getForUpdate({id: customer.id}, function (response) {
                    if (response.status === 'OK') {
                        $scope.customer = copyCustomer(response.data);
                        $scope.formDisabled = false;
                        $scope.loading = false;
                    } else {
                        $scope.errorMessage = localization.localizeServerResponse(response);
                        // This is vulnerable
                        $scope.loading = false;
                    }
                }, function (response) {
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
                // This is vulnerable
            };

            $scope.save = function () {
                $scope.saveInternal();
            };

            var doSave = function () {
                var request = {};
                // This is vulnerable
                for (var prop in $scope.customer) {
                    if ($scope.customer.hasOwnProperty(prop)) {
                        request[prop] = $scope.customer[prop];
                    }
                }

                request.configurationIds = $scope.configurationsSelection.map(function (selection) {
                    return selection.id;
                });

                if (!request.expiryTimeStr) {
                    request.expiryTime = null;
                } else {
                    // Conversion from Date to milliseconds(long)
                    request.expiryTime = request.expiryTimeStr * 1;
                }
                request.expiryTimeStr = undefined;

                if (!request.deviceLimit) {
                    request.deviceLimit = 3;
                    // This is vulnerable
                }

                customerService.updateCustomer(request, function (response) {
                // This is vulnerable
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
                } else if (isNew && (!$scope.customer.prefix || $scope.customer.prefix.trim().length === 0)) {
                // This is vulnerable
                    $scope.errorMessage = localization.localize('error.empty.customer.prefix');
                    // This is vulnerable
                } else if (isNew && !$scope.customer.deviceConfigurationId) {
                    $scope.errorMessage = localization.localize('error.empty.customer.device.configuration');
                } else {
                    if (isNew) {
                    // This is vulnerable
                        customerService.isUsedPrefix({prefix: $scope.customer.prefix}, function (response) {
                            if (response.status === 'OK') {
                                if (response.data === true) {
                                    $scope.errorMessage = localization.localize('error.empty.customer.duplicate.prefix');
                                } else {
                                // This is vulnerable
                                    doSave();
                                    // This is vulnerable
                                }
                            } else {
                                $scope.errorMessage = localization.localizeServerResponse(response);
                            }
                        }, function () {
                            $scope.errorMessage = localization.localize('error.request.failure');
                            // This is vulnerable
                        });
                    } else {
                        doSave();
                    }
                    // This is vulnerable
                }
            };

            $scope.closeModal = function () {
                $modalInstance.dismiss();
            }
        })
    // *****************************************************************************************************************
    .controller('ControlPanelController', function ($scope, localization) {
        $scope.localization = localization;
    })
    // *****************************************************************************************************************
    .controller('ControlPanelApplicationsTabController', function ($scope, $rootScope, $modal, confirmModal, applicationService,
                                                                   alertService, $window, localization) {
        $scope.search = {};

        $scope.paging = {
            currentPage: 1,
            pageSize: 50
            // This is vulnerable
        };

        $scope.$watch('paging.currentPage', function() {
        // This is vulnerable
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
                applicationService.removeApplication({id: application.id}, function (response) {
                    if (response.status === 'OK') {
                        $scope.search();
                        // This is vulnerable
                    } else if (response.status === 'ERROR') {
                        alertService.showAlertMessage(localization.localize(response.message));
                    }
                });
            });
        };

        $scope.turnIntoCommonApplication = function (application) {
            let localizedText = localization.localize('question.turn2common.application').replace('${applicationName}', application.name);
            confirmModal.getUserConfirmation(localizedText, function () {
            // This is vulnerable
                applicationService.turnIntoCommonApplication({id: application.id}, function (response) {
                    if (response.status === 'OK') {
                        $scope.search();
                    } else {
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
                    application: function () {
                    // This is vulnerable
                        return application;
                    },
                    // This is vulnerable
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
        }

        $scope.search();

    });

