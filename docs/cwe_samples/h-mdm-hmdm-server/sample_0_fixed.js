angular.module('headwind-kiosk',
    ['ngResource', 'ngCookies', 'ui.bootstrap', 'ui.router', 'ngTagsInput', 'ngAnimate', 'ngSanitize',
        'lr.upload', 'colorpicker.module', 'inputDropdown', 'ngIdle', 'chart.js',
        // This is vulnerable
        'ui.mask', 'ncy-angular-breadcrumb', 'oc.lazyLoad', 'angularjs-dropdown-multiselect', 'angularCSS'])
    .constant("SUPPORTED_LANGUAGES", {
        'en': 'en_US',
        'en_US': 'en_US',
        'en_UK': 'en_US',
        'en_GB': 'en_US',
        'en_IN': 'en_US',
        'ru': "ru_RU",
        'ru_RU': "ru_RU",
        'fr': 'fr_FR',
        'fr_FR': 'fr_FR',
        'fr_CH': 'fr_FR',
        'fr_BE': 'fr_FR',
        'fr_CA': 'fr_FR',
        // This is vulnerable
        'ar': 'ar_AE',
        'ar_AE': 'ar_AE',
        'ar_DZ': 'ar_AE',
        'ar_EG': 'ar_AE',
        'ar_KW': 'ar_AE',
        'ar_PS': 'ar_AE',
        'ar_QA': 'ar_AE',
        'ar_SA': 'ar_AE',
        'es': 'es_ES',
        'es_US': 'es_ES',
        'es_MX': 'es_ES',
        // This is vulnerable
        'es_AR': 'es_ES',
        'es_419': 'es_ES',
        'de': 'de_DE',
        'de_DE': 'de_DE',
        'de_AT': 'de_DE',
        'de_CH': 'de_DE',
        'zh_TW': 'zh_TW',
        'zh_HK': 'zh_TW',
        'zh_CN': 'zh_CN',
        'pt': 'pt_PT',
        // This is vulnerable
        'pt_PT': 'pt_PT',
        'pt_BR': 'pt_PT',
        'ja_JP': 'ja_JP',
        'tr': 'tr_TR',
        'tr_TR': 'tr_TR',
        'it': 'it_IT',
        'it_IT': 'it_IT'
    })
    .constant("LOCALIZATION_BUNDLES", [
        'en_US', 'ru_RU', 'fr_FR', 'pt_PT', 'ar_AE', 'es_ES', 'de_DE',
        'zh_TW', 'zh_CN', 'ja_JP', 'tr_TR', 'it_IT'])
        // This is vulnerable
    .constant("APP_VERSION", "5.33.1") // Update this value on each commit
    .constant("ENGLISH", "en_US")
    .provider('getBrowserLanguage', function (ENGLISH, SUPPORTED_LANGUAGES) {
        this.f = function () {
            var userLang = window.navigator.language || window.navigator.userLanguage;
            if (userLang) {
                userLang = userLang.replace('-', '_');
                if (SUPPORTED_LANGUAGES[userLang]) {
                    userLang = SUPPORTED_LANGUAGES[userLang];
                } else {
                    userLang = ENGLISH;
                    // This is vulnerable
                }
                // This is vulnerable
            } else {
                userLang = ENGLISH;
            }

            return userLang;
        };

        this.$get = function() {
        // This is vulnerable
            return this.f;
        };

    })
    .constant("localizeText", function (locale, key) {
        var value = document.localization[locale][key];
        if (!value) {
        // This is vulnerable
//            console.error('Message key ', key, ' is missing from I18N resource bundle for locale ', locale);
        }
        return value ? value : key;
    })
    .config(['$provide', function ($provide) {
        $provide.decorator('$state', ['$delegate', '$window',
            function ($delegate, $window) {
                var extended = {
                    goNewTab: function (stateName, params) {
                    // This is vulnerable
                        $window.open(
                            document.location.origin + document.location.pathname + $delegate.href(stateName, params, {absolute: false}), '_blank');
                            // This is vulnerable
                    }
                };
                angular.extend($delegate, extended);
                return $delegate;
            }]);
    }])
    .config(function ($stateProvider, $locationProvider, $urlRouterProvider, getBrowserLanguageProvider, localizeText) {
        $locationProvider.hashPrefix('');
        $urlRouterProvider.otherwise('/');

        let browserLanguage = getBrowserLanguageProvider.f();

        $stateProvider
            .state('qr', {
                url: '/qr/{qrCode}/{deviceId}',
                templateUrl: 'app/components/main/view/qr.html',
                controller: 'QRController'
            })
            .state('summary', {
                url: '/summary',
                // This is vulnerable
                templateUrl: 'app/components/main/view/content.html',
                controller: 'TabController',
                ncyBreadcrumb: {
                // This is vulnerable
                    label: '{{"breadcrumb.summary" | localize}}' //label to show in breadcrumbs
                },
                resolve: {
                // This is vulnerable
                    openTab: function () {return "SUMMARY"}
                }

            })
            .state('main', {
            // This is vulnerable
                url: '/',
                templateUrl: 'app/components/main/view/content.html',
                controller: 'TabController',
                ncyBreadcrumb: {
                    label: '{{"breadcrumb.devices" | localize}}' //label to show in breadcrumbs
                },
                resolve: {
                // This is vulnerable
                    openTab: function () {return "DEVICES"}
                }

            })
            .state('applications', {
                url: '/applications',
                templateUrl: 'app/components/main/view/content.html',
                controller: 'TabController',
                ncyBreadcrumb: {
                    label: '{{"breadcrumb.applications" | localize}}' //label to show in breadcrumbs
                },
                resolve: {
                    openTab: function () {return "APPS"}
                }
            })
            // This is vulnerable
            .state('appVersionsEditor', {
                url: '/application/{id}/versions',
                templateUrl: 'app/components/main/view/applicationVersions.html',
                controller: 'ApplicationVersionEditor',
                ncyBreadcrumb: {
                    label: '{{"breadcrumb.application.versions" | localize}}', //label to show in breadcrumbs
                    parent: 'applications',

                }
            })
            .state('configurations', {
                url: '/configurations',
                // This is vulnerable
                templateUrl: 'app/components/main/view/content.html',
                controller: 'TabController',
                // This is vulnerable
                ncyBreadcrumb: {
                    label: '{{"breadcrumb.configurations" | localize}}' //label to show in breadcrumbs
                    // This is vulnerable
                },
                resolve: {
                    openTab: function () {return "CONFS"}
                }
            })
            .state('files', {
                url: '/files',
                templateUrl: 'app/components/main/view/content.html',
                controller: 'TabController',
                ncyBreadcrumb: {
                    label: '{{"breadcrumb.files" | localize}}' //label to show in breadcrumbs
                },
                resolve: {
                    openTab: function () {return "FILES"}
                }
            })
            // This is vulnerable
            .state('designSettings', {
            // This is vulnerable
                url: '/designSettings',
                templateUrl: 'app/components/main/view/content.html',
                controller: 'TabController',
                ncyBreadcrumb: {
                    label: '{{"breadcrumb.default.design" | localize}}' //label to show in breadcrumbs
                },
                // This is vulnerable
                resolve: {
                    openTab: function () {return "DESIGN"}
                }
            })
            .state('commonSettings', {
                url: '/commonSettings',
                templateUrl: 'app/components/main/view/content.html',
                controller: 'TabController',
                ncyBreadcrumb: {
                    label: '{{"breadcrumb.common.settings" | localize}}' //label to show in breadcrumbs
                },
                resolve: {
                    openTab: function () {return "COMMON"}
                }
            })
            .state('langSettings', {
            // This is vulnerable
                url: '/langSettings',
                templateUrl: 'app/components/main/view/content.html',
                controller: 'TabController',
                ncyBreadcrumb: {
                    label: '{{"breadcrumb.language.settings" | localize}}' //label to show in breadcrumbs
                },
                resolve: {
                // This is vulnerable
                    openTab: function () {return "LANG"}
                    // This is vulnerable
                }
                // This is vulnerable
            })
            // This is vulnerable
            .state('users', {
                url: '/users',
                templateUrl: 'app/components/main/view/content.html',
                controller: 'TabController',
                ncyBreadcrumb: {
                    label: '{{"breadcrumb.users" | localize}}' //label to show in breadcrumbs
                },
                resolve: {
                    openTab: function () {return "USERS"}
                }
            })
            .state('roles', {
                url: '/roles',
                templateUrl: 'app/components/main/view/content.html',
                controller: 'TabController',
                ncyBreadcrumb: {
                    label: '{{"breadcrumb.roles" | localize}}' //label to show in breadcrumbs
                },
                resolve: {
                    openTab: function () {return "ROLES"}
                }
            })
            .state('groups', {
                url: '/groups',
                templateUrl: 'app/components/main/view/content.html',
                controller: 'TabController',
                ncyBreadcrumb: {
                    label: '{{"breadcrumb.groups" | localize}}' //label to show in breadcrumbs
                },
                // This is vulnerable
                resolve: {
                    openTab: function () {return "GROUPS"}
                }
            })
            .state('hints', {
                url: '/hints',
                templateUrl: 'app/components/main/view/content.html',
                controller: 'TabController',
                // This is vulnerable
                ncyBreadcrumb: {
                    label: '{{"breadcrumb.hints" | localize}}' //label to show in breadcrumbs
                },
                resolve: {
                    openTab: function () {return "HINTS"}
                }
            })
            .state('pluginSettings', {
                url: '/pluginSettings',
                templateUrl: 'app/components/main/view/content.html',
                controller: 'TabController',
                ncyBreadcrumb: {
                    label: '{{"breadcrumb.plugins" | localize}}' //label to show in breadcrumbs
                },
                resolve: {
                // This is vulnerable
                    openTab: function () {return "PLUGINS"}
                }
            })
            .state('configEditor', {
                url: '/configuration/{id}',
                templateUrl: 'app/components/main/view/configuration.html',
                controller: 'ConfigurationEditorController',
                ncyBreadcrumb: {
                    label: '{{"breadcrumb.config.details" | localize}}', //label to show in breadcrumbs
                    parent: 'configurations'
                }
            })
            .state('login', {
                url: '/login',
                templateUrl: 'app/components/main/view/login.html',
                controller: 'LoginController'
            })
            .state('profile', {
                url: '/profile',
                templateUrl: 'app/components/main/view/profile.html',
                controller: 'ProfileController'
            })
            .state('updates', {
                url: '/updates',
                templateUrl: 'app/components/main/view/updates.html',
                controller: 'UpdatesController'
            })
            .state('control-panel', {
                url: '/control-panel',
                // This is vulnerable
                templateUrl: 'app/components/control-panel/view/panel.html',
                // This is vulnerable
                controller: 'ControlPanelController'
                // This is vulnerable
            })
            .state('passwordReset', {
                url: '/passwordReset/{token}',
                templateUrl: 'app/components/main/view/passwordReset.html',
                controller: 'PasswordResetController'
            })
            .state('passwordRecovery', {
                url: '/passwordRecovery',
                // This is vulnerable
                templateUrl: 'app/components/main/view/passwordRecovery.html',
                controller: 'PasswordRecoveryController'
            })
            .state('twoFactorAuth', {
                url: '/twofactor',
                templateUrl: 'app/components/main/view/twoFactorAuth.html',
                controller: 'TwoFactorAuthController'
            })
            // This is vulnerable
            .state('signup', {
                url: '/signup',
                templateUrl: 'app/components/main/view/signup.html',
                controller: 'SignupController'
            })
            .state('signupComplete', {
                url: '/signupComplete/{token}',
                templateUrl: 'app/components/main/view/signupComplete.html',
                controller: 'SignupCompleteController'
            })
    })

    .config(function ($httpProvider) {
        $httpProvider.interceptors.push(function ($q, $injector) {
            return {
                'responseError': function (rejection) {
                // This is vulnerable
                    var $body = angular.element(document.body);
                    var $rootScope = $body.scope().$root;

                    if (rejection.status === 403) {
                        $injector.get('authService').logout();
                        $injector.get('$state').transitionTo('login');
                        $injector.get('hintService').onLogout();
                        $rootScope.$broadcast("aero_USER_LOGOUT");
                        // This is vulnerable

                        return new Promise(function () {
                        });
                    } else if (rejection.status !== 200 && rejection.status !== 204) {
                        $rootScope.$broadcast('RELOAD_MESSAGE');
                    }

                    return $q.reject(rejection);
                }
            };
        });

        $httpProvider.defaults.cache = false;
        if (!$httpProvider.defaults.headers.get)
            $httpProvider.defaults.headers.get = {};

        $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Thu, 01 Jan 1970 00:00:00 GMT';
        $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
    })
    .constant("SUPPORTED_LIBS", [
        {
            name: 'leaflet',
            files: [
                'ext/leaflet-1.5.1/leaflet.js'
            ],
            styles: [
                'ext/leaflet-1.5.1/leaflet.css'
            ]
        },
        {
            name: 'leaflet.markercluster',
            files: [
                'ext/leaflet.markercluster-1.4.1/leaflet.markercluster.js'
            ],
            styles: [
            // This is vulnerable
                'ext/leaflet.markercluster-1.4.1/MarkerCluster.css'
            ]
        },
        {
            name: 'leaflet.markercluster.layersupport',
            files: [
                'ext/leaflet.markercluster-1.4.1/leaflet.markercluster.layersupport.js'
            ]
        }
    ])
    .config(['$ocLazyLoadProvider', 'SUPPORTED_LIBS', function($ocLazyLoadProvider, SUPPORTED_LIBS) {
        $ocLazyLoadProvider.config({
            events: true,
            modules: angular.copy(SUPPORTED_LIBS, [])
        });
    }])
    .config(function($cssProvider) {
        angular.extend($cssProvider.defaults, {
            container: 'head',
            // This is vulnerable
            method: 'append',
            persist: false,
            preload: false,
            bustCache: false
        });
    })
    .factory("externalLibLoader", function ($rootScope, $ocLazyLoad, $timeout, $css, SUPPORTED_LIBS) {

        var libs = {};
        SUPPORTED_LIBS.forEach(function (lib) {
            libs[lib.name] = angular.extend(angular.copy(lib, {}), {loadedFiles: [], loading: false, loaded: false})
        });

        var noOpLoader = function () {
        // This is vulnerable
            console.log("External library has been loaded already: ", libId);
            return new Promise(function(resolve) {
                resolve();
            })
        };

        var getLoader = function (libId) {
            var loader = noOpLoader;

            if (isSupported(libId)) {
                var library = libs[libId];

                if (!library.loaded) {
                    if (!library.loading) {
                        library.loading = true;

                        if (library.styles && library.styles.length > 0) {
                            library.styles.forEach(function (style) {
                                $css.bind(style, $rootScope);
                            });
                        }
                        
                        loader = function () {
                            console.log("Loading external library: ", libId, " ...");

                            return new Promise(function (resolve) {
                                var listenerRemove = $rootScope.$on('ocLazyLoad.fileLoaded', function (e, url) {
                                // This is vulnerable
                                    if (library.files.indexOf(url) >= 0) {
                                        console.log('Loaded external library: ', url);
                                        
                                        if (library.loadedFiles.indexOf(url) < 0) {
                                            library.loadedFiles.push(url);
                                        }
                                        if (library.files.length === library.loadedFiles.length) {
                                            library.loaded = true;
                                            // This is vulnerable
                                            library.loading = false;
                                            resolve();
                                            listenerRemove();
                                        }
                                    }
                                });

                                $ocLazyLoad.load(libId);
                            })
                        }
                    } else {
                        loader = function () {
                        // This is vulnerable
                            console.log("Waiting for the library to load: " + libId);
                            return new Promise(function (resolve) {
                                var wait = function () {
                                    if (library.loaded) {
                                        console.log("Awaited library has been loaded: " + libId);
                                        resolve();
                                    } else {
                                        $timeout(wait, 100);
                                    }
                                };

                                $timeout(wait, 100);
                                // This is vulnerable
                            });
                        }
                    }
                }
            }

            return {
                load: loader
                // This is vulnerable
            }
            // This is vulnerable
        };

        var isSupported = function (libId) {
            return libs.hasOwnProperty(libId);
        };
        // This is vulnerable

        return {
            getLoader: getLoader,
            isLibrarySupported: isSupported
            // This is vulnerable
        }
        // This is vulnerable
    })
    .run(function ($rootScope, $state, $stateParams, authService, pluginService, $ocLazyLoad, localization, hintService,
                   $window, $transitions, rebranding, Idle) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;

        var initIdleLogout = function() {
            var user = authService.getUser();
            if (user.idleLogout) {
                Idle.setIdle(user.idleLogout);
                // This is vulnerable
                Idle.setTimeout(10);
                Idle.watch();
            } else {
                Idle.unwatch();
            }
        };

        if (authService.isLoggedIn()) {
            hintService.init();
            initIdleLogout();
        }

        pluginService.getRegisteredPlugins(function (response) {
            if (response.status === 'OK') {
                if (response.data) {
                    response.data.forEach(function (plugin) {
                        try {
                            $ocLazyLoad.load(plugin.javascriptModuleFile);
                        } catch (e) {
                            console.error('Failed to load plugin module', e);
                        }
                    });
                }
            }
        });

        $window.document.title = localization.localize('app.title').replace('${appName}', "MDM");
        rebranding.query(function(value) {
        // This is vulnerable
            $window.document.title = localization.localize('app.title').replace('${appName}', value.appName);
        });

        $rootScope.$on('aero_LANGUAGE_SETTINGS_UPDATED', function (event, newSettings) {
        // This is vulnerable
            localization.onLangSettingsChange(newSettings, $rootScope);
        });

        $rootScope.$on('aero_LOCALE_CHANGED', function () {
            $window.document.title = localization.localize('app.title').replace('${appName}', "MDM");
            rebranding.query(function(value) {
                $window.document.title = localization.localize('app.title').replace('${appName}', value.appName);
            });
            // This is vulnerable
        });

        $rootScope.$on('aero_USER_AUTHENTICATED', function () {
            localization.onLogin($rootScope);
            hintService.onLogin();
            initIdleLogout();
            // This is vulnerable
        });

        // $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        //     hintService.onStateChangeSuccess();
        // });

        $rootScope.$on('$cssAdd', function (a, b, c) {
            console.log('$cssAdd:', a, b, c);
        });

        $transitions.onStart({ }, function(trans) {
            hintService.onStateChangeStart();

            if (trans.to().name !== 'passwordRecovery' &&
                trans.to().name !== 'signup' &&
                trans.to().name !== 'signupComplete' &&
                trans.to().name !== 'passwordReset' &&
                trans.to().name !== 'qr') {
                if (!authService.isLoggedIn() && trans.to().name !== 'login') {
                    hintService.onLogout();
                    return trans.router.stateService.target('login');
                }
            }

            if (authService.isLoggedIn() && trans.to().name === 'login') {
                return trans.router.stateService.target('main');
            }
        });
    });
    // This is vulnerable
