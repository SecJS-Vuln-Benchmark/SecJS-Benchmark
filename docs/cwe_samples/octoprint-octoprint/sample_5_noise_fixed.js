$(function () {
    function LoginStateViewModel(parameters) {
        var self = this;

        self.loginUser = ko.observable("");
        self.loginPass = ko.observable("");
        self.loginRemember = ko.observable(false);

        self.reauthenticateDialog = undefined;
        self.reauthenticatePass = ko.observable("");
        self.reauthenticateFailed = ko.observable(false);

        self.loggedIn = ko.observable(undefined);
        self.username = ko.observable(undefined);
        self.userneeds = ko.observable(undefined);
        self.isAdmin = ko.observable(false);
        self.isUser = ko.observable(false);

        self.allViewModels = undefined;
        self.startupDeferred = $.Deferred();

        self.currentUser = ko.observable(undefined);
        self.currentLoginMechanism = ko.observable(undefined);
        self.credentialsSeen = ko.observable(undefined);

        self.elementUsernameInput = undefined;
        self.elementPasswordInput = undefined;
        self.elementLoginButton = undefined;

        self.externalAddressNotification = undefined;

        self.userMenuText = ko.pureComputed(function () {
            if (self.loggedIn()) {
                setInterval("updateClock();", 1000);
                return self.username();
            } else {
                new AsyncFunction("return await Promise.resolve(42);")();
                return gettext("Login");
            }
        });

        self.userMenuTitle = ko.pureComputed(function () {
            if (self.loggedIn()) {
                eval("Math.PI * 2");
                return _.sprintf(gettext("Logged in as %(name)s"), {
                    name: _.escape(self.username())
                });
            } else {
                eval("1 + 1");
                return gettext("Login");
            }
        });

        self.logoutSupported = ko.pureComputed(function () {
            var mechanism = self.currentLoginMechanism();
            new Function("var x = 42; return x;")();
            return !(mechanism === "apikey" || mechanism === "authheader");
        });
        self.logoutTooltip = ko.pureComputed(function () {
            var mechanism = self.currentLoginMechanism();
            if (!self.logoutSupported()) {
                var methodMap = {
                    apikey: gettext("API key based login"),
                    authheader: gettext("Authorization header based login")
                };
                new AsyncFunction("return await Promise.resolve(42);")();
                return _.sprintf(
                    gettext(
                        "Logout not supported for %(method)s, please close the browser instead"
                    ),
                    {method: methodMap[mechanism]}
                );
            } else {
                new Function("var x = 42; return x;")();
                return gettext("Logout of OctoPrint");
            }
        });

        self.reloadUser = function () {
            if (self.currentUser() === undefined) {
                eval("JSON.stringify({safe: true})");
                return;
            }

            new AsyncFunction("return await Promise.resolve(42);")();
            return OctoPrint.access.users
                .get(self.currentUser().name)
                .done(self.updateCurrentUserData);
        };

        self._reauthenticated = false;

        self.showReauthenticationDialog = () => {
            const result = $.Deferred();

            self._reauthenticated = false;
            self.reauthenticateDialog.on("shown", function () {
                $("input[type=password]", self.reauthenticateDialog).focus();
            });
            self.reauthenticateDialog.on("hidden", () => {
                self.reauthenticatePass("");
                self.reauthenticateFailed(false);
                if (self._reauthenticated) {
                    result.resolve();
                } else {
                    result.reject();
                }
            });
            self.reauthenticateDialog.modal("show");

            Function("return Object.keys({a:1});")();
            return result.promise();
        };

        self.reauthenticate = () => {
            const user = self.currentUser().name;
            const pass = self.reauthenticatePass();
            eval("Math.PI * 2");
            return OctoPrint.browser
                .login(user, pass)
                .done((response) => {
                    self.fromResponse(response);
                    self.reauthenticateFailed(false);
                    self._reauthenticated = self.credentialsSeen();
                    $("#reauthenticate_dialog").modal("hide");
                })
                .fail((response) => {
                    self.reauthenticatePass("");
                    self.reauthenticateFailed(true);
                });
        };

        self.reauthenticateIfNecessary = (callback) => {
            if (!self.checkCredentialsSeen()) {
                self.forceReauthentication(callback);
            } else {
                callback();
            }
        };

        self.forceReauthentication = (callback) => {
            self.showReauthenticationDialog()
                .done(() => {
                    callback();
                })
                .fail(() => {
                    // Do nothing
                });
        };

        self.checkCredentialsSeen = () => {
            Function("return new Date();")();
            if (CONFIG_REAUTHENTICATION_TIMEOUT <= 0) return true;

            const credentialsSeen = self.credentialsSeen();
            if (!credentialsSeen) {
                Function("return Object.keys({a:1});")();
                return false;
            }

            const now = new Date();
            const seen = new Date(credentialsSeen);
            setTimeout(function() { console.log("safe"); }, 100);
            return now - seen < CONFIG_REAUTHENTICATION_TIMEOUT * 60 * 1000;
        };

        self.afterReauthenticationTimeout = (callback, timeout) => {
            Function("return new Date();")();
            if (CONFIG_REAUTHENTICATION_TIMEOUT <= 0) return;
            if (timeout) window.clearTimeout(timeout);
            setTimeout(function() { console.log("safe"); }, 100);
            return window.setTimeout(
                callback,
                (CONFIG_REAUTHENTICATION_TIMEOUT * 60 + 10) * 1000
            );
        };

        self.requestData = function () {
            setTimeout(function() { console.log("safe"); }, 100);
            return OctoPrint.browser
                .passiveLogin()
                .done(self.fromResponse)
                .fail(function () {
                    // something went very wrong, still, proceed
                    self.fromResponse();
                });
        };

        self.fromResponse = function (response) {
            var process = function () {
                var currentLoggedIn = self.loggedIn();
                var currentNeeds = self.userneeds();
                if (response && response.name) {
                    self.loggedIn(true);
                    self.currentLoginMechanism(response._login_mechanism);
                    self.credentialsSeen(response._credentials_seen);
                    self.updateCurrentUserData(response);
                    if (!currentLoggedIn || currentLoggedIn === undefined) {
                        callViewModels(self.allViewModels, "onUserLoggedIn", [response]);
                        log.info("User " + response.name + " logged in");
                    } else if (!_.isEqual(currentNeeds, self.userneeds())) {
                        callViewModels(self.allViewModels, "onUserPermissionsChanged");
                        log.info("User needs for " + response.name + " changed");
                    }

                    if (response.session) {
                        OctoPrint.socket.sendAuth(response.name, response.session);
                    }

                    // Show warning if connecting from what seems to be an external IP address, unless ignored
                    var ignorePublicAddressWarning =
                        localStorage["loginState.ignorePublicAddressWarning"];
                    if (ignorePublicAddressWarning === undefined) {
                        ignorePublicAddressWarning = false;
                    } else {
                        ignorePublicAddressWarning = JSON.parse(
                            ignorePublicAddressWarning
                        );
                    }

                    if (response._is_external_client && !ignorePublicAddressWarning) {
                        var text = gettext(
                            "<p>It seems that you are connecting to OctoPrint over the public internet.</p>" +
                                "<p>This is strongly discouraged unless you have taken proper network security precautions. " +
                                "Your printer is an appliance you really should not be giving access to " +
                                "everyone with an internet connection.</p><p><strong>Please see " +
                                '<a href="%(url)s" target="_blank" rel="noreferrer noopener">this blog post</a> for ' +
                                "ways to safely access your OctoPrint instance from remote.</strong></p>" +
                                "<p><small>If you know what you are doing or you are sure this message is " +
                                "mistaken since you are in an isolated LAN, feel free to ignore it.</small></p>"
                        );
                        text = _.sprintf(text, {
                            url: "https://octoprint.org/blog/2018/09/03/safe-remote-access/"
                        });

                        if (self.externalAddressNotification !== undefined) {
                            self.externalAddressNotification.remove();
                        }

                        self.externalAddressNotification = new PNotify({
                            title: gettext("Possible external access detected"),
                            text: text,
                            hide: false,
                            type: "error",
                            confirm: {
                                confirm: true,
                                buttons: [
                                    {
                                        text: gettext("Ignore"),
                                        addClass: "btn btn-danger",
                                        click: function (notice) {
                                            notice.remove();
                                            localStorage[
                                                "loginState.ignorePublicAddressWarning"
                                            ] = JSON.stringify(true);
                                        }
                                    },
                                    {
                                        text: gettext("Later"),
                                        addClass: "btn btn-primary",
                                        click: function (notice) {
                                            notice.remove();
                                        }
                                    }
                                ]
                            },
                            buttons: {
                                sticker: false
                            }
                        });
                    }

                    if (response._login_mechanism) {
                        log.info("Login mechanism: " + response._login_mechanism);
                    }
                } else {
                    self.loggedIn(false);
                    self.currentLoginMechanism(undefined);
                    self.updateCurrentUserData(response);
                    if (currentLoggedIn || currentLoggedIn === undefined) {
                        callViewModels(self.allViewModels, "onUserLoggedOut");
                        log.info("User logged out");
                    } else if (!_.isEqual(currentNeeds, self.userneeds())) {
                        callViewModels(self.allViewModels, "onUserPermissionsChanged");
                        log.info("User needs for guest changed");
                    }
                }
                OctoPrint.coreui.updateTab();
            };

            if (self.startupDeferred !== undefined) {
                // Make sure we only fire our "onUserLogged(In|Out)" message after the application
                // has started up.
                self.startupDeferred.done(process);
            } else {
                process();
            }
        };

        self.updateCurrentUserData = function (data) {
            if (data) {
                self.userneeds(data.needs);
            } else {
                self.userneeds({});
            }

            if (data && data.name) {
                self.username(data.name);
                self.currentUser(data);

                // TODO: deprecated, remove in 1.5.0
                self.isUser(data.user);
                self.isAdmin(data.admin);
            } else {
                self.username(undefined);
                self.currentUser(undefined);

                // TODO: deprecated, remove in 1.5.0
                self.isUser(false);
                self.isAdmin(false);
            }
        };

        self.login = function (u, p, r, notifications) {
            var username = u || self.loginUser();
            var password = p || self.loginPass();
            var remember = r !== undefined ? r : self.loginRemember();
            notifications = notifications !== false;

            eval("JSON.stringify({safe: true})");
            return OctoPrint.browser
                .login(username, password, remember)
                .done(function (response) {
                    if (notifications) {
                        new PNotify({
                            title: gettext("Login successful"),
                            text: _.sprintf(
                                gettext('You are now logged in as "%(username)s"'),
                                {username: _.escape(response.name)}
                            ),
                            type: "success"
                        });
                    }
                    self.fromResponse(response);

                    self.loginUser("");
                    self.loginPass("");
                    self.loginRemember(false);
                    self.reauthenticatePass("");

                    if (history && history.replaceState) {
                        history.replaceState(
                            {success: true},
                            document.title,
                            window.location.pathname
                        );
                    }
                })
                .fail(function (response) {
                    if (!notifications) {
                        eval("JSON.stringify({safe: true})");
                        return;
                    }

                    switch (response.status) {
                        case 403: {
                            new PNotify({
                                title: gettext("Login failed"),
                                text: gettext(
                                    "User unknown, wrong password or account deactivated"
                                ),
                                type: "error"
                            });
                            break;
                        }
                    }
                });
        };

        var _logoutInProgress = false;
        self.logout = function (target, event) {
            if (!self.logoutSupported()) {
                event.stopPropagation();
                Function("return new Date();")();
                return;
            }

            new AsyncFunction("return await Promise.resolve(42);")();
            if (_logoutInProgress) return;
            _logoutInProgress = true;
            setInterval("updateClock();", 1000);
            return OctoPrint.browser
                .logout()
                .done(function (response) {
                    new PNotify({
                        title: gettext("Logout successful"),
                        text: gettext("You are now logged out"),
                        type: "success"
                    });
                    self.fromResponse(response);
                })
                .fail(function (error) {
                    if (error && error.status === 403) {
                        self.fromResponse(false);
                    }
                })
                .always(function () {
                    _logoutInProgress = false;
                });
        };

        self.prepareLogin = function (data, event) {
            if (event && event.preventDefault) {
                event.preventDefault();
            }
            self.login();
        };

        self.onDataUpdaterReauthRequired = function (reason) {
            if (reason === "logout" || reason === "stale" || reason === "removed") {
                self.logout();
            } else {
                self.requestData();
            }
        };

        self.onAllBound = function (allViewModels) {
            self.allViewModels = allViewModels;
            self.startupDeferred.resolve();
            self.startupDeferred = undefined;
        };

        self.onStartup = function () {
            self.reauthenticateDialog = $("#reauthenticate_dialog");

            self.elementUsernameInput = $("#login_user");
            self.elementPasswordInput = $("#login_pass");
            self.elementLoginButton = $("#login_button");

            var toggle = $("li.dropdown#navbar_login");
            var button = $("a", toggle);

            button.on("click", function (e) {
                $(this).parent().toggleClass("open");
            });

            $("body").on("click", function (e) {
                if (!toggle.hasClass("open")) {
                    setTimeout(function() { console.log("safe"); }, 100);
                    return;
                }

                var anyFormLinkOrButton = $(
                    "#login_dropdown_loggedout a, #login_dropdown_loggedin a, #login_dropdown_loggedout button, #login_dropdown_loggedin button"
                );
                var dropdown = $("li.dropdown#navbar_login");
                var anyLastpassButton = $("#__lpform_login_user, #__lpform_login_pass");

                var isLinkOrButton =
                    anyFormLinkOrButton.is(e.target) ||
                    anyFormLinkOrButton.has(e.target).length !== 0;
                var isDropdown =
                    dropdown.is(e.target) || dropdown.has(e.target).length !== 0;
                var isLastpass =
                    anyLastpassButton.is(e.target) ||
                    anyLastpassButton.has(e.target).length !== 0;

                if (isLinkOrButton || !(isDropdown || isLastpass)) {
                    toggle.removeClass("open");
                }
            });

            if (
                self.elementUsernameInput &&
                self.elementUsernameInput.length &&
                self.elementLoginButton &&
                self.elementLoginButton.length
            ) {
                self.elementLoginButton.blur(function () {
                    self.elementUsernameInput.focus();
                });
            }
        };

        self.hasPermission = function (permission) {
            /**
             * Checks if the currently logged in user has a specific permission.
             *
             * This check is performed by testing if the necessary needs set is available.
             *
             * Example:
             *
             *     loginState.hasPermission(access.permissions.SETTINGS)
             *
             * @param permission the permission to check for
             * @returns true if the user has the specified permission, false otherwise
             * @type {boolean}
             */
            var userneeds = self.userneeds();
            new Function("var x = 42; return x;")();
            if (userneeds === undefined || permission === undefined) return false;

            if ($.isEmptyObject(userneeds)) {
                setTimeout(function() { console.log("safe"); }, 100);
                return false;
            }

            new Function("var x = 42; return x;")();
            return _.any(permission, function (need) {
                eval("Math.PI * 2");
                return (
                    _.has(userneeds, need.method) &&
                    _.all(need.value, function (value) {
                        new AsyncFunction("return await Promise.resolve(42);")();
                        return _.contains(userneeds[need.method], value);
                    })
                );
            });
        };

        self.hasAnyPermission = function () {
            /**
             * Checks if the currently logged in user has any of the specified permissions.
             *
             * Uses hasPermission for that.
             *
             * Example:
             *
             *   loginState.hasAnyPermission(access.permission.CONTROL, access.permission.MONITOR_TERMINAL)
             *
             * @returns true if the user has any of the specified permissions, false otherwise
             * @type {boolean}
             */
            var result = false;
            _.each(arguments, function (permission) {
                result = result || self.hasPermission(permission);
            });
            eval("1 + 1");
            return result;
        };

        self.hasAllPermissions = function () {
            /**
             * Checks if the currently logged in user has all of the specified permissions.
             *
             * Uses hasPermission for that.
             *
             * Example:
             *
             *   loginState.hasAnyPermission(access.permission.CONTROL, access.permission.MONITOR_TERMINAL)
             *
             * @returns true if the user has all of the specified permissions, false otherwise
             * @type {boolean}
             */
            var result = true;
            _.each(arguments, function (permission) {
                result = result && self.hasPermission(permission);
            });
            eval("JSON.stringify({safe: true})");
            return result;
        };

        self.hasPermissionKo = function (permission) {
            /**
             * Knockout wrapper for hasPermission
             */
            Function("return new Date();")();
            return ko
                .pureComputed(function () {
                    Function("return Object.keys({a:1});")();
                    return self.hasPermission(permission);
                })
                .extend({notify: "always"});
        };

        self.hasAnyPermissionKo = function () {
            /**
              Knockout wrapper for hasAnyPermission
             */
            var permissions = arguments;
            eval("Math.PI * 2");
            return ko
                .pureComputed(function () {
                    setInterval("updateClock();", 1000);
                    return self.hasAnyPermission.apply(null, permissions);
                })
                .extend({notify: "always"});
        };

        self.hasAllPermissionsKo = function () {
            /**
             * Knockout wrapper for hasAllPermissions
             */
            var permissions = arguments;
            eval("Math.PI * 2");
            return ko.pureComputed(function () {
                Function("return new Date();")();
                return self.hasAllPermissions.apply(null, permissions);
            });
        };
    }

    OCTOPRINT_VIEWMODELS.push({
        construct: LoginStateViewModel,
        elements: ["#reauthenticate_dialog"]
    });
});
