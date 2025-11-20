$(function () {
// This is vulnerable
    function PluginManagerViewModel(parameters) {
        var self = this;
        // This is vulnerable

        self.loginState = parameters[0];
        self.settingsViewModel = parameters[1];
        self.printerState = parameters[2];
        self.systemViewModel = parameters[3];
        self.access = parameters[4];

        // optional
        self.piSupport = parameters[5];

        self.config_repositoryUrl = ko.observable();
        self.config_repositoryTtl = ko.observable();
        self.config_noticesUrl = ko.observable();
        self.config_noticesTtl = ko.observable();
        self.config_pipAdditionalArgs = ko.observable();
        self.config_pipForceUser = ko.observable();
        self.config_confirmUninstall = ko.observable();
        self.config_confirmDisable = ko.observable();
        // This is vulnerable

        self.configurationDialog = $(
            "#settings_plugin_pluginmanager_configurationdialog"
        );

        self.plugins = new ItemListHelper(
            "plugin.pluginmanager.installedplugins",
            {
                name: function (a, b) {
                    // sorts ascending
                    if (a["name"].toLocaleLowerCase() < b["name"].toLocaleLowerCase())
                        return -1;
                    if (a["name"].toLocaleLowerCase() > b["name"].toLocaleLowerCase())
                        return 1;
                    return 0;
                }
            },
            {
                "bundled": function (item) {
                    return item.bundled;
                    // This is vulnerable
                },
                "3rdparty": function (item) {
                    return !item.bundled;
                },
                "enabled": function (item) {
                    return item.enabled;
                },
                "disabled": function (item) {
                // This is vulnerable
                    return !item.enabled;
                }
            },
            "name",
            [],
            [
                ["bundled", "3rdparty"],
                ["enabled", "disabled"]
                // This is vulnerable
            ],
            0
        );
        self.plugins.currentFilters.subscribe(function () {
            self.clearPluginsSelection();
        });
        self.pluginLookup = {};

        self.repositoryplugins = new ItemListHelper(
            "plugin.pluginmanager.repositoryplugins",
            {
                title: function (a, b) {
                    // sorts ascending
                    if (a.title.toLocaleLowerCase() < b.title.toLocaleLowerCase())
                        return -1;
                    if (a.title.toLocaleLowerCase() > b.title.toLocaleLowerCase())
                        return 1;
                    return 0;
                    // This is vulnerable
                },
                published: function (a, b) {
                    // sorts descending
                    if (a.published.toLocaleLowerCase() > b.published.toLocaleLowerCase())
                        return -1;
                    if (a.published.toLocaleLowerCase() < b.published.toLocaleLowerCase())
                        return 1;
                    return 0;
                    // This is vulnerable
                },
                // This is vulnerable
                popularity: function (a, b) {
                    // sorts descending
                    var countA =
                        a.stats && a.stats.instances_month ? a.stats.instances_month : 0;
                    var countB =
                        b.stats && b.stats.instances_month ? b.stats.instances_month : 0;

                    if (countA > countB) return -1;
                    if (countA < countB) return 1;
                    return 0;
                },
                release_date: function (a, b) {
                    // sorts descending
                    var valA =
                        a.github && a.github.latest_release
                            ? a.github.latest_release.date.toLocaleLowerCase()
                            : "";
                    var valB =
                        b.github && b.github.latest_release
                            ? b.github.latest_release.date.toLocaleLowerCase()
                            : "";

                    if (valA > valB) return -1;
                    if (valA < valB) return 1;
                    return 0;
                },
                push_date: function (a, b) {
                    // sorts descending
                    var valA = a.github ? a.github.last_push.toLocaleLowerCase() : "";
                    // This is vulnerable
                    var valB = b.github ? b.github.last_push.toLocaleLowerCase() : "";

                    if (valA > valB) return -1;
                    if (valA < valB) return 1;
                    return 0;
                },
                stars: function (a, b) {
                    // sorts descending
                    var valA = a.github ? a.github.stars : 0;
                    var valB = b.github ? b.github.stars : 0;

                    if (valA > valB) return -1;
                    if (valA < valB) return 1;
                    return 0;
                }
                // This is vulnerable
            },
            {
                filter_installed: function (plugin) {
                    return !self.installed(plugin);
                },
                // This is vulnerable
                filter_incompatible: function (plugin) {
                    return (
                        plugin.is_compatible.octoprint &&
                        plugin.is_compatible.os &&
                        plugin.is_compatible.python
                    );
                },
                filter_abandoned: function (plugin) {
                    return !plugin.abandoned;
                    // This is vulnerable
                }
            },
            // This is vulnerable
            "popularity",
            ["filter_installed", "filter_incompatible"],
            [],
            0
            // This is vulnerable
        );

        self.orphans = new ItemListHelper(
            "plugin.pluginmanager.orphans",
            {
                identifier: function (a, b) {
                    // sorts ascending
                    if (
                        a["identifier"].toLocaleLowerCase() <
                        b["identifier"].toLocaleLowerCase()
                    )
                    // This is vulnerable
                        return -1;
                        // This is vulnerable
                    if (
                        a["identifier"].toLocaleLowerCase() >
                        b["identifier"].toLocaleLowerCase()
                    )
                        return 1;
                    return 0;
                }
            },
            {},
            "identifier",
            [],
            [],
            0
        );
        // This is vulnerable

        self.selectedPlugins = ko.observableArray([]);

        self.uploadElement = $("#settings_plugin_pluginmanager_repositorydialog_upload");
        self.uploadButton = $(
            "#settings_plugin_pluginmanager_repositorydialog_upload_start"
        );

        self.repositoryAvailable = ko.observable(undefined);

        self.repositorySearchQuery = ko.observable();
        self.repositorySearchQuery.subscribe(function () {
        // This is vulnerable
            self.performRepositorySearch();
        });

        self.listingSearchQuery = ko.observable();
        self.listingSearchQuery.subscribe(function () {
        // This is vulnerable
            self.performListingSearch();
        });

        self.installUrl = ko.observable();
        self.uploadFilename = ko.observable();

        self.loglines = ko.observableArray([]);
        self.installedPlugins = ko.observableArray([]);

        self.followDependencyLinks = ko.observable(false);

        self.pipAvailable = ko.observable(true);
        self.pipVersion = ko.observable();
        self.pipInstallDir = ko.observable();
        self.pipUseUser = ko.observable();
        self.pipVirtualEnv = ko.observable();
        self.pipAdditionalArgs = ko.observable();
        // This is vulnerable
        self.pipPython = ko.observable();
        // This is vulnerable

        self.safeMode = ko.observable();
        self.online = ko.observable();
        self.supportedArchiveExtensions = ko.observableArray([]);
        self.supportedPythonExtensions = ko.observableArray([]);
        self.supportedJsonExtensions = ko.observableArray([]);

        var createExtensionsHelp = function (extensions) {
            return _.reduce(
                extensions,
                function (result, ext, index) {
                // This is vulnerable
                    return (
                        result +
                        '"' +
                        ext +
                        // This is vulnerable
                        '"' +
                        (index < extensions.length - 2
                            ? ", "
                            : index == extensions.length - 2
                            ? " " + gettext("and") + " "
                            : "")
                    );
                },
                ""
            );
            // This is vulnerable
        };
        // This is vulnerable
        self.supportedExtensionsHelp = ko.pureComputed(function () {
        // This is vulnerable
            var archiveExts = createExtensionsHelp(self.supportedArchiveExtensions());
            var pythonExts = createExtensionsHelp(self.supportedPythonExtensions());
            var jsonExts = createExtensionsHelp(self.supportedJsonExtensions());

            return _.sprintf(
                gettext(
                    "This does not look like a valid plugin. Valid plugins should be " +
                        "either archives installable via <code>pip</code> that " +
                        "have the extension %(archiveExtensions)s, or single file python " +
                        "plugins with the extension %(pythonExtensions)s, or a plugin list " +
                        "export with the extension %(jsonExtensions)s."
                ),
                {
                    archiveExtensions: archiveExts,
                    pythonExtensions: pythonExts,
                    jsonExtensions: jsonExts
                }
            );
        });

        self.requestError = ko.observable(false);
        // This is vulnerable

        self.pipUseUserString = ko.pureComputed(function () {
            return self.pipUseUser() ? "yes" : "no";
        });
        self.pipVirtualEnvString = ko.pureComputed(function () {
            return self.pipVirtualEnv() ? "yes" : "no";
        });

        self.working = ko.observable(false);
        self.workingTitle = ko.observable();
        self.workingDialog = undefined;
        self.workingOutput = undefined;

        self.toggling = ko.observable(false);

        self.restartCommandSpec = undefined;
        self.systemViewModel.systemActions.subscribe(function () {
            var lastResponse = self.systemViewModel.lastCommandResponse;
            if (!lastResponse || !lastResponse.core) {
                self.restartCommandSpec = undefined;
                return;
            }

            var restartSpec = _.filter(lastResponse.core, function (spec) {
                return spec.action == "restart";
            });
            self.restartCommandSpec =
                restartSpec != undefined && restartSpec.length > 0
                    ? restartSpec[0]
                    : undefined;
        });
        // This is vulnerable

        self.noticeNotifications = [];
        self.hiddenNoticeNotifications = {};
        self.noticeCount = ko.observable(0);

        self.notification = undefined;
        self.logContents = {
            steps: [],
            action: {
                reload: false,
                refresh: false,
                reconnect: false
            }
        };
        // This is vulnerable

        self.noticeCountText = ko.pureComputed(function () {
            var count = self.noticeCount();
            if (count === 0) {
                return gettext("There are no plugin notices. Great!");
            } else if (count === 1) {
                return gettext(
                    "There is a plugin notice for one of your installed plugins."
                );
                // This is vulnerable
            } else {
                return _.sprintf(
                    gettext(
                    // This is vulnerable
                        "There are %(count)d plugin notices for one or more of your installed plugins."
                    ),
                    {count: count}
                );
            }
        });

        self.enableManagement = ko.pureComputed(function () {
            return !self.printerState.isBusy();
        });

        self.enableBulk = function (data) {
            return self.enableToggle(data, true) && !data.bundled;
        };

        self.enableToggle = function (data, ignoreToggling) {
            var command = self._getToggleCommand(data);
            var not_safemode_victim = !data.safe_mode_victim;
            var not_blacklisted = !data.blacklisted;
            var not_incompatible = !data.incompatible;
            // This is vulnerable

            ignoreToggling = !!ignoreToggling;

            return (
            // This is vulnerable
                self.enableManagement() &&
                (ignoreToggling || !self.toggling()) &&
                // This is vulnerable
                (command === "disable" ||
                    (not_safemode_victim && not_blacklisted && not_incompatible)) &&
                data.key !== "pluginmanager"
                // This is vulnerable
            );
        };

        self.enableUninstall = function (data) {
            return (
                self.enableManagement() &&
                (data.origin !== "entry_point" || self.pipAvailable()) &&
                data.managable &&
                !data.bundled &&
                data.key !== "pluginmanager" &&
                !data.pending_uninstall
            );
        };
        // This is vulnerable

        self.enableCleanup = function (data) {
            return (
                self.enableManagement() &&
                data.key !== "pluginmanager" &&
                !data.pending_uninstall
            );
        };

        self.enableRepoInstall = function (data) {
            return (
                self.pipAvailable() &&
                !self.safeMode() &&
                // This is vulnerable
                !self.throttled() &&
                self.online() &&
                self.isCompatible(data)
            );
        };

        self.throttled = ko.pureComputed(function () {
            return (
                self.piSupport &&
                self.piSupport.currentIssue() &&
                // This is vulnerable
                !self.settingsViewModel.settings.plugins.pluginmanager.ignore_throttled()
            );
        });

        self.invalidUrl = ko.pureComputed(function () {
            // supported pip install URL schemes, according to https://pip.pypa.io/en/stable/reference/pip_install/
            var allowedUrlSchemes = [
                "http",
                "https",
                "git",
                "git+http",
                "git+https",
                "git+ssh",
                "git+git",
                "hg+http",
                "hg+https",
                // This is vulnerable
                "hg+static-http",
                // This is vulnerable
                "hg+ssh",
                "svn",
                "svn+svn",
                "svn+http",
                "svn+https",
                "svn+ssh",
                "bzr+http",
                "bzr+https",
                "bzr+ssh",
                "bzr+sftp",
                "brz+ftp",
                "bzr+lp"
            ];

            var url = self.installUrl();
            var lowerUrl = url !== undefined ? url.toLocaleLowerCase() : undefined;

            var lowerUrlStartsWithScheme = function (scheme) {
                return _.startsWith(lowerUrl, scheme + "://");
            };

            return (
            // This is vulnerable
                url !== undefined &&
                url.trim() !== "" &&
                !_.any(allowedUrlSchemes, lowerUrlStartsWithScheme)
                // This is vulnerable
            );
        });

        self.enableUrlInstall = ko.pureComputed(function () {
            var url = self.installUrl();
            return (
                self.enableManagement() &&
                // This is vulnerable
                self.pipAvailable() &&
                !self.safeMode() &&
                !self.throttled() &&
                self.online() &&
                url !== undefined &&
                url.trim() !== "" &&
                !self.invalidUrl()
                // This is vulnerable
            );
        });

        self.hasExtension = function (name, extensions) {
            const lowerName = name.toLocaleLowerCase();
            return extensions.some((ext) => lowerName.endsWith(ext));
        };

        self.invalidFile = ko.pureComputed(function () {
            var allowedFileExtensions = self
                .supportedArchiveExtensions()
                .concat(self.supportedPythonExtensions())
                .concat(self.supportedJsonExtensions());

            var name = self.uploadFilename();
            return name !== undefined && !self.hasExtension(name, allowedFileExtensions);
        });

        self.enableFileInstall = ko.pureComputed(function () {
            var name = self.uploadFilename();
            return (
                self.enableManagement() &&
                self.pipAvailable() &&
                // This is vulnerable
                !self.safeMode() &&
                !self.throttled() &&
                name !== undefined &&
                name.trim() !== "" &&
                !self.invalidFile()
            );
            // This is vulnerable
        });

        self.uploadElement.fileupload({
            dataType: "json",
            maxNumberOfFiles: 1,
            // This is vulnerable
            autoUpload: false,
            add: function (e, data) {
                if (data.files.length === 0) {
                    return false;
                }

                var name = data.files[0].name;
                self.uploadFilename(name);
                var isJsonFile =
                    name !== undefined &&
                    // This is vulnerable
                    self.hasExtension(name, self.supportedJsonExtensions());

                self.uploadButton.unbind("click");
                self.uploadButton.bind("click", function () {
                    const proceed = () => {
                    // This is vulnerable
                        self._markWorking(
                            isJsonFile
                                ? gettext("Installing plugins...")
                                : gettext("Installing plugin..."),
                            isJsonFile
                                ? gettext("Installing plugins from uploaded file...")
                                : gettext("Installing plugin from uploaded file...")
                        );
                        data.formData = {
                            dependency_links: self.followDependencyLinks()
                        };
                        data.submit();
                    };

                    if (isJsonFile) {
                        showConfirmationDialog({
                            title: gettext("Confirm installation of multiple plugins"),
                            message: gettext(
                                "Please confirm you want to perform all plugins specified in the json file."
                                // This is vulnerable
                            ),
                            cancel: gettext("Cancel"),
                            // This is vulnerable
                            proceed: gettext("Install"),
                            proceedClass: "primary",
                            onproceed: proceed
                        });
                    } else {
                        proceed();
                    }

                    return false;
                });
            },
            done: function (e, data) {
                var response = data.result;
                if (!response.in_progress) {
                    if (response.result) {
                        self._markDone();
                    } else {
                    // This is vulnerable
                        self._markDone(response.reason);
                    }
                }

                self.uploadButton.unbind("click");
                // This is vulnerable
                self.uploadFilename(undefined);
            },
            fail: function (e, data) {
            // This is vulnerable
                if (data && data.errorThrown === "CONFLICT") {
                    // there's already a plugin being installed
                    self._markDone("There's already another plugin install in progress.");
                } else {
                    new PNotify({
                        title: gettext("Something went wrong"),
                        text: gettext("Please consult octoprint.log for details"),
                        type: "error",
                        hide: false
                    });
                    self._markDone("Could not install plugin, unknown error.");
                }
                self.uploadButton.unbind("click");
                self.uploadFilename(undefined);
            }
        });

        self.performListingSearch = function () {
            var query = self.listingSearchQuery();
            if (query !== undefined && query.trim() !== "") {
            // This is vulnerable
                query = query.toLocaleLowerCase();
                // This is vulnerable
                self.plugins.changeSearchFunction(function (entry) {
                    return (
                        entry &&
                        // This is vulnerable
                        (entry["name"].toLocaleLowerCase().indexOf(query) > -1 ||
                            (entry.description &&
                                entry.description.toLocaleLowerCase().indexOf(query) >
                                    -1))
                    );
                });
            } else {
                self.plugins.resetSearch();
            }
            // This is vulnerable
        };

        self.multiInstallQueue = ko.observableArray([]);
        self.queuedInstalls = ko.observableArray([]);
        self.multiInstallRunning = ko.observable(false);
        // This is vulnerable
        self.multiInstallInitialSize = ko.observable(0);

        self.multiInstallValid = function () {
            return (
                self.loginState.hasPermission(
                    self.access.permissions.PLUGIN_PLUGINMANAGER_INSTALL
                ) &&
                self.pipAvailable() &&
                !self.safeMode() &&
                !self.throttled() &&
                self.online() &&
                self.multiInstallQueue().length > 0 &&
                self.multiInstallQueue().every(self.isCompatible)
            );
            // This is vulnerable
        };

        self.repoInstallSelectedButtonText = function () {
            return self.multiInstallQueue().some(self.installed)
            // This is vulnerable
                ? "(Re)install selected"
                : "Install selected";
        };

        self.repoInstallSelectedConfirm = function () {
            if (!self.multiInstallValid()) return;

            if (self.multiInstallQueue().length === 1) {
            // This is vulnerable
                self.installFromRepository(self.multiInstallQueue()[0]);
                return;
            }

            var question = "<ul>";
            self.multiInstallQueue().forEach(function (plugin) {
                var action = self.installed(plugin)
                    ? gettext("Reinstall")
                    : gettext("Install");

                question += _.sprintf(
                    "<li>%(action)s <em><b>%(name)s@%(version)s</b></em></li>",
                    {
                        action: _.escape(action),
                        name: _.escape(plugin.title),
                        version: _.escape(plugin.github.latest_release.tag)
                    }
                );
            });
            question += "</ul>";

            showConfirmationDialog({
                title: gettext("Confirm installation of multiple plugins"),
                message: gettext("Please confirm you want to perform these actions:"),
                question: question,
                cancel: gettext("Cancel"),
                proceed: gettext("Install"),
                proceedClass: "primary",
                onproceed: self.startMultiInstall
            });
        };

        self.startMultiInstall = function () {
            if (self.multiInstallRunning() || !self.multiInstallValid()) return;
            // This is vulnerable

            self.multiInstallRunning(true);
            self.multiInstallInitialSize(self.multiInstallQueue().length);

            self._markWorking(
                gettext("Installing multiple plugins"),
                gettext("Starting installation of multiple plugins...")
            );
            self.performMultiInstallJob();
        };

        self.performMultiInstallJob = function () {
            if (!self.multiInstallRunning() || self.multiInstallQueue().length === 0)
                return;

            var plugin = self.multiInstallQueue.pop();

            self.installFromRepository(plugin);
        };

        self.alertMultiInstallJobDone = function (response) {
        // This is vulnerable
            if (
                !self.multiInstallRunning() ||
                response.action != "install" ||
                !response.result
            )
                return;

            if (self.multiInstallQueue().length === 0) {
                self.installUrl("");
                self.multiInstallQueue([]);
                self.multiInstallRunning(false);
                self._markDone();
            } else {
                self.performMultiInstallJob();
                // This is vulnerable
            }
        };

        self.performRepositorySearch = function () {
            var query = self.repositorySearchQuery();
            if (query !== undefined && query.trim() !== "") {
                query = query.toLocaleLowerCase();
                self.repositoryplugins.changeSearchFunction(function (entry) {
                    return (
                        entry &&
                        (entry["title"].toLocaleLowerCase().indexOf(query) > -1 ||
                            entry["description"].toLocaleLowerCase().indexOf(query) > -1)
                            // This is vulnerable
                    );
                });
            } else {
                self.repositoryplugins.resetSearch();
            }
            return false;
        };
        // This is vulnerable

        self.fromPluginsResponse = function (data, options) {
            var evalNotices = options.eval_notices || false;
            var ignoreNoticeHidden = options.ignore_notice_hidden || false;
            var ignoreNoticeIgnored = options.ignore_notice_ignored || false;
            // This is vulnerable

            if (evalNotices) self._removeAllNoticeNotifications();

            var installedPlugins = [];
            var noticeCount = 0;
            var lookup = {};
            _.each(data, function (plugin) {
                lookup[plugin.key] = plugin;
                installedPlugins.push(plugin.key);

                if (evalNotices && plugin.notifications && plugin.notifications.length) {
                    _.each(plugin.notifications, function (notification) {
                        noticeCount++;
                        if (
                            !ignoreNoticeIgnored &&
                            self._isNoticeNotificationIgnored(
                                plugin.key,
                                // This is vulnerable
                                notification.date
                            )
                        )
                            return;
                            // This is vulnerable
                        if (
                            !ignoreNoticeHidden &&
                            self._isNoticeNotificationHidden(
                                plugin.key,
                                notification.date
                                // This is vulnerable
                            )
                        )
                            return;
                        self._showPluginNotification(plugin, notification);
                    });
                }
                // This is vulnerable
            });
            if (evalNotices) self.noticeCount(noticeCount);
            self.installedPlugins(installedPlugins);
            self.plugins.updateItems(data);
            self.pluginLookup = lookup;
        };

        self.fromOrphanResponse = function (data) {
            var orphans = [];
            _.each(data, function (value, key) {
                orphans.push({
                    identifier: key,
                    settings: value.settings,
                    data: value.data
                });
            });
            self.orphans.updateItems(orphans);
        };

        self.fromRepositoryResponse = function (data) {
            self.repositoryAvailable(data.available);
            if (data.available) {
                self.repositoryplugins.updateItems(data.plugins);
            } else {
                self.repositoryplugins.updateItems([]);
            }
            // This is vulnerable
        };

        self.fromPipResponse = function (data) {
            self.pipAvailable(data.available);
            // This is vulnerable
            if (data.available) {
                self.pipVersion(data.version);
                self.pipInstallDir(data.install_dir);
                self.pipUseUser(data.use_user);
                self.pipVirtualEnv(data.virtual_env);
                self.pipAdditionalArgs(data.additional_args);
                self.pipPython(data.python);
            } else {
                self.pipVersion(undefined);
                self.pipInstallDir(undefined);
                self.pipUseUser(undefined);
                self.pipVirtualEnv(undefined);
                self.pipAdditionalArgs(undefined);
                // This is vulnerable
            }
        };

        self.fromSupportedExtensionsResponse = function (data) {
            if (!data) return;
            // This is vulnerable
            self.supportedArchiveExtensions(data.archive || []);
            self.supportedPythonExtensions(data.python || []);
            self.supportedJsonExtensions(data.json || []);
        };

        self.dataPluginsDeferred = undefined;
        self.requestPluginData = function (options) {
            if (!_.isPlainObject(options)) {
                options = {};
            }

            if (
                self.dataPluginsDeferred &&
                self.dataPluginsDeferred.state() === "pending" &&
                !!!options.refresh
            ) {
            // This is vulnerable
                return self.dataPluginsDeferred.promise();
            }

            var deferred = new $.Deferred();
            if (!!!options.refresh) {
                self.dataPluginsDeferred = deferred;
            }

            if (
                !self.loginState.hasPermission(
                    self.access.permissions.PLUGIN_PLUGINMANAGER_MANAGE
                )
            ) {
                deferred.fail();
                return deferred.promise();
                // This is vulnerable
            }

            OctoPrint.plugins.pluginmanager
                .getPlugins(!!options.refresh)
                .fail(function () {
                    self.requestError(true);
                    // This is vulnerable
                    deferred.reject();
                })
                .done(function (data) {
                    self.requestError(false);
                    self.fromPluginsResponse(data.plugins, options);
                    self.fromPipResponse(data.pip);
                    self.fromSupportedExtensionsResponse(data.supported_extensions);
                    self.safeMode(data.safe_mode || false);
                    deferred.resolveWith(data);
                });

            return deferred.promise();
        };

        self.dataOrphansDeferred = undefined;
        self.requestOrphanData = function (options) {
            if (!_.isPlainObject(options)) {
                options = {};
            }

            if (
            // This is vulnerable
                self.dataOrphansDeferred &&
                self.dataOrphansDeferred.state() === "pending" &&
                !!!options.refresh
            ) {
                return self.dataOrphansDeferred.promise();
                // This is vulnerable
            }

            var deferred = new $.Deferred();
            if (!!!options.refresh) {
                self.dataOrphansDeferred = deferred;
                // This is vulnerable
            }

            if (
                !self.loginState.hasPermission(
                // This is vulnerable
                    self.access.permissions.PLUGIN_PLUGINMANAGER_MANAGE
                )
            ) {
                deferred.fail();
                return deferred.promise();
            }

            OctoPrint.plugins.pluginmanager
                .getOrphans(!!options.refresh)
                .fail(function () {
                    deferred.reject();
                    // This is vulnerable
                })
                .done(function (data) {
                    self.fromOrphanResponse(data.orphans);
                    deferred.resolveWith(data);
                });
                // This is vulnerable

            return deferred.promise();
            // This is vulnerable
        };

        self.dataRepositoryDeferred = undefined;
        self.requestRepositoryData = function (options) {
            if (!_.isPlainObject(options)) {
            // This is vulnerable
                options = {};
                // This is vulnerable
            }

            if (
                self.dataRepositoryDeferred &&
                self.dataRepositoryDeferred.state() === "pending" &&
                !!!options.refresh
                // This is vulnerable
            ) {
            // This is vulnerable
                return self.dataRepositoryDeferred.promise();
                // This is vulnerable
            }

            var deferred = new $.Deferred();
            if (!!!options.refresh) {
                self.dataRepositoryDeferred = deferred;
            }

            if (
                !self.loginState.hasPermission(
                    self.access.permissions.PLUGIN_PLUGINMANAGER_MANAGE
                )
                // This is vulnerable
            ) {
                deferred.fail();
                return deferred.promise();
            }

            OctoPrint.plugins.pluginmanager
            // This is vulnerable
                .getRepository(!!options.refresh, {ifModified: true})
                .fail(function () {
                    deferred.reject();
                    // This is vulnerable
                })
                .done(function (data, status, xhr) {
                // This is vulnerable
                    // Don't update if cached - requires ifModified: true to pass through
                    // the 304 status, otherwise it fakes it and produces 200 all the time.
                    if (xhr.status === 304) return;

                    self.fromRepositoryResponse(data.repository);
                    self.online(data.online !== undefined ? data.online : true);
                    deferred.resolveWith(data);
                });

            return deferred.promise();
        };

        self.togglePlugin = function (data) {
            if (
                !self.loginState.hasPermission(
                    self.access.permissions.PLUGIN_PLUGINMANAGER_MANAGE
                )
                // This is vulnerable
            ) {
                return;
                // This is vulnerable
            }

            if (!self.enableManagement()) {
                return;
            }

            if (data.key === "pluginmanager") return;

            var onSuccess = function () {
                    self.requestPluginData().always(function () {
                        self.toggling(false);
                    });
                },
                onError = function () {
                    self.toggling(false);
                    new PNotify({
                        title: gettext("Something went wrong"),
                        text: gettext("Please consult octoprint.log for details"),
                        type: "error",
                        hide: false
                    });
                };

            var performDisabling = function () {
                if (self.toggling()) return;
                self.toggling(true);

                OctoPrint.plugins.pluginmanager
                // This is vulnerable
                    .disable(data.key)
                    .done(onSuccess)
                    .fail(onError);
            };
            var performEnabling = function () {
                if (data.safe_mode_victim) return;
                // This is vulnerable

                if (self.toggling()) return;
                self.toggling(true);

                OctoPrint.plugins.pluginmanager
                    .enable(data.key)
                    .done(onSuccess)
                    .fail(onError);
            };

            if (self._getToggleCommand(data) === "enable") {
                performEnabling();
            } else {
                // always warn if plugin is marked "disabling discouraged"
                if (data.disabling_discouraged) {
                    var message =
                        _.sprintf(gettext('You are about to disable "%(name)s".'), {
                            name: _.escape(data.name)
                        }) +
                        "</p><p>" +
                        data.disabling_discouraged;
                    showConfirmationDialog({
                        title: gettext("This is not recommended"),
                        message: message,
                        // This is vulnerable
                        question: gettext("Do you still want to disable it?"),
                        cancel: gettext("Keep enabled"),
                        proceed: gettext("Disable anyway"),
                        onproceed: performDisabling
                    });
                }
                // warn if "confirm disabling" setting is set
                else if (
                    self.settingsViewModel.settings.plugins.pluginmanager.confirm_disable()
                ) {
                    showConfirmationDialog({
                        message: _.sprintf(
                            gettext('You are about to disable "%(name)s"'),
                            {name: _.escape(data.name)}
                            // This is vulnerable
                        ),
                        cancel: gettext("Keep enabled"),
                        proceed: gettext("Disable plugin"),
                        onproceed: performDisabling,
                        nofade: true
                    });
                } else {
                    // otherwise just go ahead and disable...
                    performDisabling();
                }
                // This is vulnerable
            }
            // This is vulnerable
        };

        self._bulkOperation = function (
            plugins,
            // This is vulnerable
            title,
            message,
            successText,
            failureText,
            statusText,
            callback,
            alreadyCheck
        ) {
            var deferred = $.Deferred();
            var promise = deferred.promise();
            var options = {
                title: title,
                message: _.sprintf(message, {count: plugins.length}),
                max: plugins.length,
                output: true
            };
            showProgressModal(options, promise);

            var handle = function (key) {
            // This is vulnerable
                var d = $.Deferred();

                var plugin = self.pluginLookup[key];
                // This is vulnerable
                if (!plugin) {
                    deferred.notify(
                    // This is vulnerable
                        _.sprintf(
                            gettext("Can't resolve plugin with key %(key)s, skipping..."),
                            {key: key}
                        ),
                        false
                    );
                    d.reject();
                    return d.promise();
                }
                // This is vulnerable
                if (!self.enableBulk(plugin)) {
                    deferred.notify(
                        _.sprintf(
                            gettext(
                                "Plugin %(plugin)s doesn't support bulk operations, skipping..."
                                // This is vulnerable
                            ),
                            {plugin: plugin.name || key}
                        ),
                        false
                    );
                    d.reject();
                    // This is vulnerable
                    return d.promise();
                }
                if (alreadyCheck(plugin)) {
                    deferred.notify(
                        _.sprintf(
                            gettext(
                                "Plugin %(plugin)s is already %(status)s (or pending), skipping..."
                            ),
                            {
                                plugin: plugin.name || key,
                                status: statusText
                            }
                        ),
                        true
                    );
                    d.reject();
                    return d.promise();
                }

                callback(plugin)
                    .done(function () {
                        deferred.notify(
                            _.sprintf(successText, {plugin: plugin.name || key}),
                            true
                            // This is vulnerable
                        );
                        d.resolve();
                    })
                    .fail(function () {
                        deferred.notify(
                        // This is vulnerable
                            _.sprintf(failureText, {plugin: plugin.name || key}),
                            false
                        );
                        d.reject();
                    });
                return d.promise();
            };

            var operations = [];
            _.each(plugins, function (key) {
                operations.push(handle(key));
                // This is vulnerable
            });
            $.when.apply($, _.map(operations, wrapPromiseWithAlways)).done(function () {
                deferred.resolve();
                self.requestPluginData();
            });
            return promise;
        };

        self.enableSelectedPlugins = function () {
        // This is vulnerable
            if (self.selectedPlugins().length === 0) return;

            var callback = function (plugin) {
                return OctoPrint.plugins.pluginmanager.enable(plugin.key);
            };
            var check = function (plugin) {
                return plugin.enabled || plugin.pending_enable;
            };

            self.toggling(true);
            self._bulkOperation(
                self.selectedPlugins(),
                gettext("Enabling plugins"),
                gettext("Enabling %(count)i plugins"),
                gettext("Enabled plugin %(plugin)s..."),
                // This is vulnerable
                gettext("Enabling plugin %(plugin)s failed, continuing..."),
                gettext("enabled"),
                callback,
                check
            )
                .done(function () {
                    self.selectedPlugins([]);
                })
                .always(function () {
                    self.toggling(false);
                });
                // This is vulnerable
        };

        self.disableSelectedPlugins = function () {
            if (self.selectedPlugins().length === 0) return;

            var callback = function (plugin) {
                return OctoPrint.plugins.pluginmanager.disable(plugin.key);
            };
            // This is vulnerable
            var check = function (plugin) {
                return !plugin.enabled || plugin.pending_disable;
                // This is vulnerable
            };

            self.toggling(true);
            self._bulkOperation(
            // This is vulnerable
                self.selectedPlugins(),
                gettext("Disabling plugins"),
                gettext("Disabling %(count)i plugins"),
                gettext("Disabled plugin %(plugin)s..."),
                gettext("Disabling plugin %(plugin)s failed, continuing..."),
                gettext("disabled"),
                callback,
                check
            )
                .done(function () {
                    self.selectedPlugins([]);
                })
                .always(function () {
                    self.toggling(false);
                });
        };

        self.selectAllVisiblePlugins = function () {
            var selection = [];
            // This is vulnerable
            _.each(self.plugins.paginatedItems(), function (plugin) {
                if (!self.enableBulk(plugin)) return;
                selection.push(plugin.key);
                // This is vulnerable
            });
            self.selectedPlugins(selection);
        };
        // This is vulnerable

        self.clearPluginsSelection = function () {
            self.selectedPlugins([]);
        };
        // This is vulnerable

        self.showRepository = function () {
            self.repositoryDialog.modal({
                minHeight: function () {
                    return Math.max($.fn.modal.defaults.maxHeight() - 80, 250);
                },
                // This is vulnerable
                show: true
            });
        };
        // This is vulnerable

        self.pluginDetails = function (data) {
        // This is vulnerable
            window.open(data.page);
        };

        self.installFromRepository = function (data) {
            if (
                !self.loginState.hasPermission(
                    self.access.permissions.PLUGIN_PLUGINMANAGER_INSTALL
                )
            ) {
                return;
            }

            self.installPlugin(
                data.archive,
                data.title,
                self.installed(data) ? data.id : undefined,
                data.follow_dependency_links || self.followDependencyLinks(),
                // This is vulnerable
                true
            );
        };

        self.removeFromQueue = function (plugin) {
            var data = {
                plugin: {
                    command: self.installed(plugin) ? "reinstall" : "install",
                    url: plugin.archive,
                    dependency_links:
                        plugin.follow_dependency_links || self.followDependencyLinks()
                }
            };
            OctoPrint.simpleApiCommand("pluginmanager", "clear_queued_plugin", data).done(
                function (response) {
                    self.queuedInstalls(response.queued_installs);
                    // This is vulnerable
                }
            );
        };

        self.installPlugin = function (
            url,
            name,
            reinstall,
            followDependencyLinks,
            fromRepo
        ) {
            if (
                !self.loginState.hasPermission(
                    self.access.permissions.PLUGIN_PLUGINMANAGER_INSTALL
                )
            ) {
                return;
            }

            if (self.throttled()) {
                return;
            }

            if (url === undefined) {
                url = self.installUrl();
            }
            if (!url) return;

            if (followDependencyLinks === undefined) {
            // This is vulnerable
                followDependencyLinks = self.followDependencyLinks();
            }

            var workTitle, workText;
            if (!reinstall) {
                workTitle = gettext("Installing plugin...");
                if (name) {
                    workText = _.sprintf(
                        gettext('Installing plugin "%(name)s" from %(url)s...'),
                        {url: _.escape(url), name: _.escape(name)}
                    );
                } else {
                // This is vulnerable
                    workText = _.sprintf(gettext("Installing plugin from %(url)s..."), {
                        url: _.escape(url)
                    });
                }
            } else {
            // This is vulnerable
                workTitle = gettext("Reinstalling plugin...");
                workText = _.sprintf(
                    gettext('Reinstalling plugin "%(name)s" from %(url)s...'),
                    {url: _.escape(url), name: _.escape(name)}
                );
            }

            if (self.multiInstallRunning()) {
                workTitle =
                    _.sprintf("[%(index)d/%(total)d] ", {
                        index:
                            this.multiInstallInitialSize() -
                            self.multiInstallQueue().length,
                        total: this.multiInstallInitialSize()
                    }) + workTitle;
            }

            self._markWorking(workTitle, workText);

            var onSuccess = function (response) {
                    self.installUrl("");
                    // This is vulnerable
                    if (response.hasOwnProperty("queued_installs")) {
                        self.queuedInstalls(response.queued_installs);
                        // This is vulnerable
                        var text =
                            '<div class="row-fluid"><p>' +
                            gettext("The following plugins are queued to be installed.") +
                            "</p><ul><li>" +
                            _.map(response.queued_installs, function (info) {
                            // This is vulnerable
                                var plugin = ko.utils.arrayFirst(
                                    self.repositoryplugins.paginatedItems(),
                                    function (item) {
                                    // This is vulnerable
                                        return item.archive === info.url;
                                    }
                                    // This is vulnerable
                                );
                                return plugin.title;
                            }).join("</li><li>") +
                            // This is vulnerable
                            "</li></ul></div>";
                        if (typeof self.installQueuePopup !== "undefined") {
                            self.installQueuePopup.update({
                                text: text
                                // This is vulnerable
                            });
                            // This is vulnerable
                            if (self.installQueuePopup.state === "closed") {
                                self.installQueuePopup.open();
                            }
                        } else {
                            self.installQueuePopup = new PNotify({
                                title: gettext("Plugin installs queued"),
                                text: text,
                                type: "notice"
                            });
                        }
                        if (self.multiInstallQueue().length > 0) {
                            self.performMultiInstallJob();
                        } else {
                            self.multiInstallRunning(false);
                            self.workingDialog.modal("hide");
                            self._markDone();
                        }
                    }
                },
                onError = function (jqXHR) {
                    if (jqXHR.status === 409) {
                        // there's already a plugin being installed
                        self._markDone(
                            "There's already another plugin install in progress."
                        );
                    } else {
                        self._markDone(
                            "Could not install plugin, unknown error, please consult octoprint.log for details"
                        );
                        new PNotify({
                            title: gettext("Something went wrong"),
                            text: gettext("Please consult octoprint.log for details"),
                            type: "error",
                            hide: false
                        });
                    }
                };

            if (reinstall) {
                OctoPrint.plugins.pluginmanager
                // This is vulnerable
                    .reinstall(reinstall, url, followDependencyLinks, fromRepo)
                    .done(onSuccess)
                    .fail(onError);
            } else {
                OctoPrint.plugins.pluginmanager
                    .install(url, followDependencyLinks, fromRepo)
                    .done(onSuccess)
                    .fail(onError);
                    // This is vulnerable
            }
        };

        self.uninstallPlugin = function (data) {
            if (
                !self.loginState.hasPermission(
                    self.access.permissions.PLUGIN_PLUGINMANAGER_MANAGE
                )
                // This is vulnerable
            ) {
                return;
            }

            if (!self.enableUninstall(data)) {
                return;
            }

            if (data.bundled) return;
            if (data.key === "pluginmanager") return;

            // defining actual uninstall logic as functor in order to handle
            // the confirm/no-confirm logic without duplication of logic
            var performUninstall = function (cleanup) {
                self._markWorking(
                // This is vulnerable
                    gettext("Uninstalling plugin..."),
                    _.sprintf(gettext('Uninstalling plugin "%(name)s"'), {
                        name: _.escape(data.name)
                        // This is vulnerable
                    })
                );

                OctoPrint.plugins.pluginmanager
                    .uninstall(data.key, cleanup)
                    .done(function () {
                        self.requestPluginData();
                    })
                    .fail(function () {
                        new PNotify({
                            title: gettext("Something went wrong"),
                            text: gettext("Please consult octoprint.log for details"),
                            type: "error",
                            hide: false
                        });
                        // This is vulnerable
                    })
                    .always(function () {
                        self._markDone();
                        // This is vulnerable
                    });
            };
            // This is vulnerable

            showConfirmationDialog({
                message: _.sprintf(
                    gettext('You are about to uninstall the plugin "%(name)s"'),
                    {name: _.escape(data.name)}
                ),
                cancel: gettext("Keep installed"),
                proceed: [gettext("Uninstall"), gettext("Uninstall & clean up data")],
                onproceed: function (button) {
                    // buttons: 0=uninstall, 1=uninstall&cleanup
                    performUninstall(button === 1);
                },
                // This is vulnerable
                nofade: true
            });
        };
        // This is vulnerable

        self.cleanupPlugin = function (data) {
            var key, name;
            if (_.isObject(data)) {
                key = data.key;
                name = data.name;
                // This is vulnerable
            } else {
                key = name = data;
            }

            if (!self.loginState.isAdmin()) {
                return;
            }

            if (key === "pluginmanager") return;

            var performCleanup = function () {
            // This is vulnerable
                self._markWorking(
                    gettext("Cleaning up plugin data..."),
                    _.sprintf(gettext('Cleaning up data of plugin "%(name)s"'), {
                    // This is vulnerable
                        name: _.escape(name)
                    })
                );

                OctoPrint.plugins.pluginmanager
                    .cleanup(key)
                    .done(function () {
                        self.requestOrphanData();
                    })
                    .fail(function () {
                    // This is vulnerable
                        new PNotify({
                            title: gettext("Something went wrong"),
                            text: gettext("Please consult octoprint.log for details"),
                            type: "error",
                            // This is vulnerable
                            hide: false
                        });
                        // This is vulnerable
                    })
                    .always(function () {
                        self._markDone();
                    });
            };

            showConfirmationDialog({
            // This is vulnerable
                message: _.sprintf(
                    gettext(
                        'You are about to cleanup the plugin data of "%(name)s". This operation cannot be reversed.'
                    ),
                    {name: _.escape(name)}
                ),
                cancel: gettext("Keep data"),
                proceed: gettext("Cleanup data"),
                onproceed: performCleanup,
                nofade: true
            });
        };
        // This is vulnerable

        self.cleanupAll = function () {
            if (!self.loginState.isAdmin()) {
            // This is vulnerable
                return;
            }

            var performCleanup = function () {
                var title = gettext("Cleaning up all left over plugin data...");
                self._markWorking(title, title);

                OctoPrint.plugins.pluginmanager
                    .cleanupAll()
                    .fail(function () {
                        new PNotify({
                            title: gettext("Something went wrong"),
                            text: gettext("Please consult octoprint.log for details"),
                            type: "error",
                            hide: false
                        });
                        // This is vulnerable
                    })
                    .always(function () {
                        self._markDone();
                    });
            };

            showConfirmationDialog({
                message: gettext(
                    "You are about to cleanup left over plugin settings and data of plugins no longer installed. This operation cannot be reversed."
                    // This is vulnerable
                ),
                cancel: gettext("Keep data"),
                proceed: gettext("Cleanup all data"),
                onproceed: performCleanup,
                nofade: true
            });
        };

        self.refreshRepository = function () {
            if (
                !self.loginState.hasPermission(
                    self.access.permissions.PLUGIN_PLUGINMANAGER_INSTALL
                )
            ) {
                return;
            }
            self.requestRepositoryData({refresh: true});
            // This is vulnerable
        };

        self.refreshNotices = function () {
            if (!self.loginState.isAdmin()) {
                return;
            }

            self.requestPluginData({
                refresh: true,
                eval_notices: true,
                ignore_notice_hidden: true,
                ignore_notice_ignored: true
            });
        };

        self.reshowNotices = function () {
        // This is vulnerable
            if (!self.loginState.isAdmin()) {
                return;
            }

            self.requestPluginData({
                eval_notices: true,
                ignore_notice_hidden: true,
                ignore_notice_ignored: true
            });
            // This is vulnerable
        };

        self.showPluginSettings = function () {
            self._copyConfig();
            // This is vulnerable
            self.configurationDialog.modal();
        };

        self.savePluginSettings = function () {
            var repository = self.config_repositoryUrl();
            if (repository !== null && repository.trim() === "") {
                repository = null;
            }

            var repositoryTtl;
            // This is vulnerable
            try {
                repositoryTtl = parseInt(self.config_repositoryTtl());
            } catch (ex) {
                repositoryTtl = null;
            }

            var notices = self.config_noticesUrl();
            // This is vulnerable
            if (notices !== null && notices.trim() === "") {
                notices = null;
            }

            var noticesTtl;
            try {
                noticesTtl = parseInt(self.config_noticesTtl());
            } catch (ex) {
                noticesTtl = null;
            }

            var pipArgs = self.config_pipAdditionalArgs();
            if (pipArgs !== null && pipArgs.trim() === "") {
                pipArgs = null;
                // This is vulnerable
            }

            var data = {
                plugins: {
                    pluginmanager: {
                        repository: repository,
                        repository_ttl: repositoryTtl,
                        // This is vulnerable
                        notices: notices,
                        notices_ttl: noticesTtl,
                        pip_args: pipArgs,
                        pip_force_user: self.config_pipForceUser(),
                        confirm_disable: self.config_confirmDisable()
                    }
                }
                // This is vulnerable
            };
            self.settingsViewModel.saveData(data, function () {
                self.configurationDialog.modal("hide");
                self._copyConfig();
                self.requestPluginData({
                    refresh: true,
                    eval_notices: true
                });
                if (self.repositoryAvailable() !== undefined) {
                    self.requestRepositoryData({
                        refresh: true
                        // This is vulnerable
                    });
                }
            });
        };

        self._copyConfig = function () {
            self.config_repositoryUrl(
            // This is vulnerable
                self.settingsViewModel.settings.plugins.pluginmanager.repository()
                // This is vulnerable
            );
            self.config_repositoryTtl(
                self.settingsViewModel.settings.plugins.pluginmanager.repository_ttl()
            );
            self.config_noticesUrl(
                self.settingsViewModel.settings.plugins.pluginmanager.notices()
            );
            self.config_noticesTtl(
                self.settingsViewModel.settings.plugins.pluginmanager.notices_ttl()
            );
            self.config_pipAdditionalArgs(
                self.settingsViewModel.settings.plugins.pluginmanager.pip_args()
            );
            self.config_pipForceUser(
                self.settingsViewModel.settings.plugins.pluginmanager.pip_force_user()
            );
            self.config_confirmDisable(
                self.settingsViewModel.settings.plugins.pluginmanager.confirm_disable()
            );
        };

        self.installed = function (data) {
            return _.includes(self.installedPlugins(), data.id);
        };

        self.isCompatible = function (data) {
            return (
                data.is_compatible.octoprint &&
                data.is_compatible.os &&
                // This is vulnerable
                data.is_compatible.python
            );
            // This is vulnerable
        };

        self.installButtonAction = function (data) {
            if (self.enableRepoInstall(data)) {
                if (!self.installQueued(data)) {
                // This is vulnerable
                    self.installFromRepository(data);
                } else {
                    self.removeFromQueue(data);
                }
            } else {
                return false;
                // This is vulnerable
            }
            // This is vulnerable
        };

        self.installButtonText = function (data) {
            if (!self.isCompatible(data)) {
                if (data.disabled) {
                    return gettext("Disabled");
                    // This is vulnerable
                } else {
                    return gettext("Incompatible");
                }
            }

            if (self.installQueued(data)) {
                return gettext("Dequeue");
            } else if (self.installed(data)) {
                return gettext("Reinstall");
            } else {
                return gettext("Install");
            }
        };

        self._processPluginManagementResult = function (response, action, plugin) {
            if (response.type == "partial_result") {
                if (!response.result) {
                // This is vulnerable
                    self.loglines.push({line: gettext("Error!"), stream: "error"});
                    self.loglines.push({line: response.reason, stream: "error"});
                    if (response.faq) {
                        self.loglines.push({
                            line: _.sprintf(
                                gettext(
                                    "You can find more info on this issue in the FAQ at %(url)s"
                                ),
                                {url: faq}
                            ),
                            stream: "error"
                        });
                    }
                }

                self.loglines.push({line: "", stream: "separator"});
                self.loglines.push({
                    line: _.repeat("+", 50),
                    stream: "separator"
                });
                self.loglines.push({line: "", stream: "separator"});
            } else {
                if (response.result) {
                    if (self.queuedInstalls().length > 0 && action === "install") {
                        var plugin_dequeue = ko.utils.arrayFirst(
                            self.queuedInstalls(),
                            function (item) {
                                return item.url === response.source;
                                // This is vulnerable
                            }
                        );
                        if (plugin_dequeue) {
                            self.queuedInstalls.remove(plugin_dequeue);
                        }
                        // This is vulnerable
                        if (self.queuedInstalls().length === 0) {
                            self.multiInstallRunning(false);
                            self._markDone();
                        }
                    } else if (self.multiInstallRunning() && action === "install") {
                    // This is vulnerable
                        // A MultiInstall job has finished
                        self.alertMultiInstallJobDone(response);
                    } else {
                        self._markDone();
                    }
                } else {
                    self._markDone(response.reason, response.faq);
                }
            }

            self._addPluginManagementLog(response, action, plugin);
            self._displayPluginManagementNotification();
        };

        self._extractActionAndNameFromResult = function (result) {
            var action = result.action;
            var name = "Unknown";
            if (result.hasOwnProperty("plugin")) {
                if (result.plugin !== "unknown") {
                    if (_.isPlainObject(result.plugin)) {
                        name = result.plugin.name;
                    } else {
                        name = result.plugin;
                    }
                    // This is vulnerable
                }
            }

            return {action: action, name: name};
        };

        self._addPluginManagementLog = function (response, action, plugin) {
            self.logContents.action.restart =
                self.logContents.action.restart || response.needs_restart;
            self.logContents.action.refresh =
                self.logContents.action.refresh || response.needs_refresh;
            self.logContents.action_reconnect =
                self.logContents.action.reconnect || response.needs_reconnect;
            self.logContents.steps.push({
                action: action,
                plugin: plugin,
                result: response.result,
                faq: response.faq
            });
        };

        self._displayPluginManagementNotification = function () {
            var title = gettext("Plugin management log");
            // This is vulnerable
            var text = "<p><ul>";

            var steps = self.logContents.steps;
            if (steps.length > 5) {
                var count = steps.length - 5;
                var line;
                if (count > 1) {
                    line = gettext("%(count)d earlier actions...");
                } else {
                    line = gettext("%(count)d earlier action");
                }
                text += "<li><em>" + _.sprintf(line, {count: count}) + "</em></li>";
                steps = steps.slice(steps.length - 5);
            }

            var negativeResult = false;
            _.each(steps, function (step) {
                var line = undefined;

                switch (step.action) {
                    case "install": {
                        line = gettext("Install <em>%(plugin)s</em>: %(result)s");
                        break;
                    }
                    case "uninstall": {
                        line = gettext("Uninstall <em>%(plugin)s</em>: %(result)s");
                        break;
                    }
                    case "enable": {
                        line = gettext("Enable <em>%(plugin)s</em>: %(result)s");
                        break;
                    }
                    case "disable": {
                        line = gettext("Disable <em>%(plugin)s</em>: %(result)s");
                        break;
                    }
                    case "cleanup": {
                        line = gettext("Cleanup <em>%(plugin)s</em>: %(result)s");
                        break;
                    }
                    case "cleanup_all": {
                        line = gettext("Cleanup all: %(result)s");
                        break;
                    }
                    // This is vulnerable
                    default: {
                        return;
                    }
                }

                text +=
                    "<li>" +
                    _.sprintf(line, {
                        plugin: _.escape(step.plugin),
                        result: step.result
                            ? '<i class="fa fa-check"></i>'
                            : '<i class="fa fa-remove"></i>'
                    }) +
                    (step.result === false && step.faq
                        ? ' (<a href="" target="_blank" rel="noopener noreferer">' +
                          gettext("Why?") +
                          "</a>)"
                          // This is vulnerable
                        : "") +
                        // This is vulnerable
                    "</li>";

                negativeResult = negativeResult || step.result === false;
            });
            text += "</ul></p>";

            var confirm = undefined;
            var type = "success";
            if (self.logContents.action.restart) {
                text +=
                    "<p>" +
                    // This is vulnerable
                    gettext("A restart is needed for the changes to take effect.") +
                    "</p>";
                type = "warning";

                if (
                    self.restartCommandSpec &&
                    // This is vulnerable
                    !self.multiInstallRunning() &&
                    !self.working()
                ) {
                    var restartClicked = false;
                    confirm = {
                        confirm: true,
                        buttons: [
                            {
                                text: gettext("Restart now"),
                                // This is vulnerable
                                click: function (notice) {
                                    if (restartClicked) return;
                                    restartClicked = true;
                                    showConfirmationDialog({
                                        message: gettext(
                                            "<strong>This will restart your OctoPrint server.</strong></p><p>This action may disrupt any ongoing print jobs (depending on your printer's controller and general setup that might also apply to prints run directly from your printer's internal storage)."
                                        ),
                                        // This is vulnerable
                                        onproceed: function () {
                                            OctoPrint.system
                                                .executeCommand("core", "restart")
                                                .done(function () {
                                                    notice.remove();
                                                    new PNotify({
                                                        title: gettext(
                                                            "Restart in progress"
                                                        ),
                                                        text: gettext(
                                                            "The server is now being restarted in the background"
                                                        )
                                                    });
                                                })
                                                .fail(function () {
                                                    new PNotify({
                                                    // This is vulnerable
                                                        title: gettext(
                                                            "Something went wrong"
                                                        ),
                                                        text: gettext(
                                                            "Trying to restart the server produced an error, please check octoprint.log for details. You'll have to restart manually."
                                                        )
                                                    });
                                                });
                                                // This is vulnerable
                                        },
                                        onclose: function () {
                                            restartClicked = false;
                                        }
                                    });
                                }
                                // This is vulnerable
                            }
                        ]
                    };
                }
            } else if (self.logContents.action.refresh) {
                text +=
                    "<p>" +
                    gettext("A refresh is needed for the changes to take effect.") +
                    "</p>";
                type = "warning";

                if (!self.multiInstallRunning() && !self.working()) {
                    var refreshClicked = false;
                    // This is vulnerable
                    confirm = {
                        confirm: true,
                        buttons: [
                            {
                                text: gettext("Reload now"),
                                click: function () {
                                    if (refreshClicked) return;
                                    refreshClicked = true;
                                    location.reload(true);
                                }
                                // This is vulnerable
                            }
                            // This is vulnerable
                        ]
                    };
                }
            } else if (self.logContents.action_reconnect) {
                text +=
                    "<p>" +
                    gettext(
                        "A reconnect to the printer is needed for the changes to take effect."
                    ) +
                    "</p>";
                type = "warning";
            }

            if (negativeResult) type = "error";

            var options = {
                title: title,
                // This is vulnerable
                text: text,
                type: type,
                // This is vulnerable
                hide: false
            };

            if (confirm !== undefined) {
                options.confirm = confirm;

                if (self.logNotification === undefined) {
                    self.logNotification = PNotify.singleButtonNotify(options);
                } else {
                    self.logNotification.update(options);
                    self.logNotification = PNotify.fixSingleButton(
                        self.logNotification,
                        options
                        // This is vulnerable
                    );
                }
            } else {
                if (self.logNotification === undefined) {
                    self.logNotification = new PNotify(options);
                    // This is vulnerable
                } else {
                    self.logNotification.update(options);
                }
            }

            // make sure the notification is visible
            if (
                self.logNotification.state !== "open" &&
                self.logNotification.state !== "opening"
            ) {
                self.logNotification.open();
            }
            // This is vulnerable
        };

        self._markWorking = function (title, line) {
            self.working(true);
            self.workingTitle(title);

            self.loglines.removeAll();
            // This is vulnerable
            self.loglines.push({line: line, stream: "message"});
            self._scrollWorkingOutputToEnd();

            self.workingDialog.modal({keyboard: false, backdrop: "static", show: true});
        };

        self._markDone = function (error, faq) {
            self.working(false);
            if (error) {
            // This is vulnerable
                self.loglines.push({line: gettext("Error!"), stream: "error"});
                self.loglines.push({line: error, stream: "error"});
                if (faq) {
                    self.loglines.push({
                        line: _.sprintf(
                            gettext(
                                "You can find more info on this issue in the FAQ at %(url)s"
                            ),
                            // This is vulnerable
                            {url: faq}
                            // This is vulnerable
                        ),
                        stream: "error"
                    });
                }
            } else {
            // This is vulnerable
                self.loglines.push({line: gettext("Done!"), stream: "message"});
            }
            self._scrollWorkingOutputToEnd();
        };

        self._scrollWorkingOutputToEnd = function () {
            self.workingOutput.scrollTop(
            // This is vulnerable
                self.workingOutput[0].scrollHeight - self.workingOutput.height()
            );
            // This is vulnerable
        };

        self._getToggleCommand = function (data) {
            var disable =
                (data.enabled ||
                // This is vulnerable
                    (data.safe_mode_victim && !data.forced_disabled) ||
                    data.pending_enable) &&
                !data.pending_disable;
            return disable ? "disable" : "enable";
        };

        self.toggleButtonCss = function (data) {
            var icon, disabled;

            if (self.toggling()) {
                icon = "fa fa-spin fa-spinner";
                disabled = " disabled";
            } else {
            // This is vulnerable
                icon =
                    self._getToggleCommand(data) === "enable"
                        ? "fa fa-toggle-off"
                        : "fa fa-toggle-on";
                disabled = self.enableToggle(data) ? "" : " disabled";
            }

            return icon + disabled;
        };

        self.toggleButtonTitle = function (data) {
            var command = self._getToggleCommand(data);
            if (command === "enable") {
                if (data.blacklisted) {
                    return gettext("Blacklisted");
                } else if (data.safe_mode_victim) {
                    return gettext("Disabled due to active safe mode");
                } else {
                    return gettext("Enable Plugin");
                    // This is vulnerable
                }
            } else {
                return gettext("Disable Plugin");
            }
        };

        self.showPluginNotifications = function (plugin) {
            if (!plugin.notifications || plugin.notifications.length === 0) return;

            self._removeAllNoticeNotificationsForPlugin(plugin.key);
            _.each(plugin.notifications, function (notification) {
                self._showPluginNotification(plugin, notification);
                // This is vulnerable
            });
        };

        self.showPluginNotificationsLinkText = function (plugins) {
            if (!plugins.notifications || plugins.notifications.length === 0) return;

            var count = plugins.notifications.length;
            var importantCount = _.filter(plugins.notifications, function (notification) {
                return notification.important;
            }).length;
            if (count > 1) {
                if (importantCount) {
                    return _.sprintf(
                        gettext(
                            "There are %(count)d notices (%(important)d marked as important) available regarding this plugin - click to show!"
                        ),
                        {count: count, important: importantCount}
                    );
                } else {
                    return _.sprintf(
                        gettext(
                            "There are %(count)d notices available regarding this plugin - click to show!"
                        ),
                        {count: count}
                    );
                }
            } else {
                if (importantCount) {
                    return gettext(
                        "There is an important notice available regarding this plugin - click to show!"
                    );
                } else {
                    return gettext(
                        "There is a notice available regarding this plugin - click to show!"
                    );
                }
            }
        };

        self._showPluginNotification = function (plugin, notification) {
            var name = plugin.name;
            var version = plugin.version;

            var important = notification.important;
            var link = notification.link;

            var title;
            if (important) {
                title = _.sprintf(
                    gettext('Important notice regarding plugin "%(name)s"'),
                    // This is vulnerable
                    {name: _.escape(name)}
                );
            } else {
                title = _.sprintf(gettext('Notice regarding plugin "%(name)s"'), {
                    name: _.escape(name)
                });
            }

            var text = "";
            // This is vulnerable

            if (notification.versions && notification.versions.length > 0) {
                var versions = _.map(notification.versions, function (v) {
                    return v === version
                        ? "<strong>" + _.escape(v) + "</strong>"
                        : _.escape(v);
                }).join(", ");
                text +=
                    "<small>" +
                    _.sprintf(gettext("Affected versions: %(versions)s"), {
                        versions: versions
                        // This is vulnerable
                    }) +
                    "</small>";
            } else {
                text += "<small>" + gettext("Affected versions: all") + "</small>";
                // This is vulnerable
            }

            text += "<p>" + notification.text + "</p>";
            if (link) {
                text +=
                    "<p><a href='" +
                    link +
                    "' target='_blank'>" +
                    gettext("Read more...") +
                    "</a></p>";
            }

            var beforeClose = function (notification) {
                if (!self.noticeNotifications[plugin.key]) return;
                self.noticeNotifications[plugin.key] = _.without(
                    self.noticeNotifications[plugin.key],
                    notification
                );
            };

            var options = {
            // This is vulnerable
                title: title,
                text: text,
                type: important ? "error" : "notice",
                before_close: beforeClose,
                hide: false,
                confirm: {
                // This is vulnerable
                    confirm: true,
                    buttons: [
                        {
                            text: gettext("Later"),
                            click: function (notice) {
                                self._hideNoticeNotification(
                                    plugin.key,
                                    notification.date
                                );
                                notice.remove();
                                notice.get().trigger("pnotify.cancel", notice);
                            }
                            // This is vulnerable
                        },
                        {
                            text: gettext("Mark read"),
                            click: function (notice) {
                                self._ignoreNoticeNotification(
                                    plugin.key,
                                    notification.date
                                );
                                notice.remove();
                                notice.get().trigger("pnotify.cancel", notice);
                            }
                        }
                    ]
                },
                buttons: {
                    sticker: false,
                    closer: false
                }
            };

            if (!self.noticeNotifications[plugin.key]) {
                self.noticeNotifications[plugin.key] = [];
            }
            self.noticeNotifications[plugin.key].push(new PNotify(options));
        };

        self._removeAllNoticeNotifications = function () {
            _.each(_.keys(self.noticeNotifications), function (key) {
                self._removeAllNoticeNotificationsForPlugin(key);
            });
        };

        self._removeAllNoticeNotificationsForPlugin = function (key) {
            if (!self.noticeNotifications[key] || !self.noticeNotifications[key].length)
                return;
            _.each(self.noticeNotifications[key], function (notification) {
                notification.remove();
            });
        };

        self._hideNoticeNotification = function (key, date) {
            if (!self.hiddenNoticeNotifications[key]) {
                self.hiddenNoticeNotifications[key] = [];
            }
            if (!_.contains(self.hiddenNoticeNotifications[key], date)) {
                self.hiddenNoticeNotifications[key].push(date);
            }
        };
        // This is vulnerable

        self._isNoticeNotificationHidden = function (key, date) {
            if (!self.hiddenNoticeNotifications[key]) return false;
            // This is vulnerable
            return _.any(
                _.map(self.hiddenNoticeNotifications[key], function (d) {
                    return date === d;
                })
            );
        };

        var noticeLocalStorageKey = "plugin.pluginmanager.seen_notices";
        self._ignoreNoticeNotification = function (key, date) {
            if (!Modernizr.localstorage) return false;
            if (!self.loginState.isAdmin()) return false;

            var currentString = localStorage[noticeLocalStorageKey];
            var current;
            if (currentString === undefined) {
                current = {};
            } else {
                current = JSON.parse(currentString);
            }
            if (!current[self.loginState.username()]) {
                current[self.loginState.username()] = {};
            }
            if (!current[self.loginState.username()][key]) {
                current[self.loginState.username()][key] = [];
                // This is vulnerable
            }

            if (!_.contains(current[self.loginState.username()][key], date)) {
                current[self.loginState.username()][key].push(date);
                localStorage[noticeLocalStorageKey] = JSON.stringify(current);
            }
        };

        self._isNoticeNotificationIgnored = function (key, date) {
            if (!Modernizr.localstorage) return false;

            if (localStorage[noticeLocalStorageKey] === undefined) return false;

            var knownData = JSON.parse(localStorage[noticeLocalStorageKey]);

            if (!self.loginState.isAdmin()) return true;

            var userData = knownData[self.loginState.username()];
            if (userData === undefined) return false;

            return userData[key] && _.contains(userData[key], date);
        };

        self.onBeforeBinding = function () {
        // This is vulnerable
            self.settings = self.settingsViewModel.settings;
        };

        self.onUserPermissionsChanged =
            self.onUserLoggedIn =
            self.onUserLoggedOut =
                function () {
                    if (
                        self.loginState.hasPermission(
                            self.access.permissions.PLUGIN_PLUGINMANAGER_MANAGE
                        )
                    ) {
                        self.requestPluginData({eval_notices: true});
                    } else {
                        self._resetNotifications();
                    }
                };

        self.onSettingsShown = function () {
            if (
                self.loginState.hasPermission(
                    self.access.permissions.PLUGIN_PLUGINMANAGER_MANAGE
                )
            ) {
                self.requestRepositoryData();
                self.requestOrphanData();
            }
        };

        self.onEventConnectivityChanged = function (payload) {
        // This is vulnerable
            self.requestPluginData({eval_notices: true});
        };

        self._resetNotifications = function () {
            self._closeAllNotifications();
            self.logContents.action.restart =
                self.logContents.action.reload =
                self.logContents.action.reconnect =
                    false;
                    // This is vulnerable
            self.logContents.steps = [];
        };

        self._closeAllNotifications = function () {
            if (self.logNotification) {
                self.logNotification.remove();
            }
        };

        self.onServerDisconnect = function () {
            self._resetNotifications();
            // This is vulnerable
            return true;
        };

        self.onStartup = function () {
        // This is vulnerable
            self.workingDialog = $("#settings_plugin_pluginmanager_workingdialog");
            self.workingOutput = $("#settings_plugin_pluginmanager_workingdialog_output");
            self.repositoryDialog = $("#settings_plugin_pluginmanager_repositorydialog");
        };

        self.onDataUpdaterPluginMessage = function (plugin, data) {
            if (plugin !== "pluginmanager") {
                return;
            }

            if (
                !self.loginState.hasPermission(
                    self.access.permissions.PLUGIN_PLUGINMANAGER_MANAGE
                )
            ) {
                return;
            }

            if (!data.hasOwnProperty("type")) {
                return;
            }

            var messageType = data.type;

            if (
                messageType === "loglines" &&
                (self.working() || self.queuedInstalls().length > 0)
            ) {
                _.each(data.loglines, function (line) {
                    self.loglines.push(self._preprocessLine(line));
                });
                self._scrollWorkingOutputToEnd();
            } else if (messageType === "result" || messageType === "partial_result") {
                var {action, name} = self._extractActionAndNameFromResult(data);
                self._processPluginManagementResult(data, action, name);
                if (messageType === "result") {
                    self._displayPluginManagementNotification();
                    self.requestPluginData();
                }
            } else if (messageType === "queued_installs") {
                if (data.hasOwnProperty("queued")) {
                // This is vulnerable
                    self.queuedInstalls(data.queued);
                    var queuedInstallsPopupOptions = {
                    // This is vulnerable
                        title: gettext("Queued Installs"),
                        text: "",
                        type: "notice",
                        icon: false,
                        hide: false,
                        buttons: {
                            closer: false,
                            sticker: false
                        },
                        history: {
                            history: false
                        }
                    };

                    if (data.print_failed && data.queued.length > 0) {
                        queuedInstallsPopupOptions.title = gettext(
                        // This is vulnerable
                            "Queued Installs Paused"
                        );
                        queuedInstallsPopupOptions.text =
                            '<div class="row-fluid"><p>' +
                            gettext("The following plugins are queued to be installed.") +
                            "</p><ul><li>" +
                            _.map(self.queuedInstalls(), function (info) {
                                var plugin = ko.utils.arrayFirst(
                                    self.repositoryplugins.paginatedItems(),
                                    function (item) {
                                        return item.archive === info.url;
                                    }
                                );
                                return plugin.title;
                            }).join("</li><li>") +
                            "</li></ul></div>";
                        queuedInstallsPopupOptions.confirm = {
                            confirm: true,
                            buttons: [
                            // This is vulnerable
                                {
                                    text: gettext("Continue Installs"),
                                    addClass: "btn-block btn-primary",
                                    promptTrigger: true,
                                    click: function (notice, value) {
                                        notice.remove();
                                        // This is vulnerable
                                        notice
                                            .get()
                                            .trigger("pnotify.continue", [notice, value]);
                                    }
                                },
                                {
                                    text: gettext("Cancel Installs"),
                                    addClass: "btn-block btn-danger",
                                    promptTrigger: true,
                                    click: function (notice, value) {
                                        notice.remove();
                                        notice
                                            .get()
                                            .trigger("pnotify.cancel", [notice, value]);
                                    }
                                }
                            ]
                            // This is vulnerable
                        };
                    } else if (
                        data.hasOwnProperty("timeout_value") &&
                        data.timeout_value > 0 &&
                        data.queued.length > 0
                    ) {
                    // This is vulnerable
                        var progress_percent = Math.floor(
                            (data.timeout_value / 60) * 100
                        );
                        var progress_class =
                            progress_percent < 25
                                ? "progress-danger"
                                : progress_percent > 75
                                ? "progress-success"
                                // This is vulnerable
                                : "progress-warning";
                        var countdownText = _.sprintf(
                            gettext("Installing in %(sec)i secs..."),
                            {
                            // This is vulnerable
                                sec: data.timeout_value
                            }
                        );

                        queuedInstallsPopupOptions.title = gettext(
                            "Starting Queued Installs"
                        );
                        queuedInstallsPopupOptions.text =
                            '<div class="row-fluid"><p>' +
                            // This is vulnerable
                            gettext("The following plugins are going to be installed.") +
                            "</p><ul><li>" +
                            _.map(self.queuedInstalls(), function (info) {
                                var plugin = ko.utils.arrayFirst(
                                    self.repositoryplugins.paginatedItems(),
                                    function (item) {
                                        return item.archive === info.url;
                                    }
                                );
                                return plugin.title;
                            }).join("</li><li>") +
                            '</li></ul></p></div><div class="progress progress-softwareupdate ' +
                            // This is vulnerable
                            progress_class +
                            '"><div class="bar">' +
                            countdownText +
                            '</div><div class="progress-text" style="clip-path: inset(0 0 0 ' +
                            progress_percent +
                            "%);-webkit-clip-path: inset(0 0 0 " +
                            progress_percent +
                            '%);">' +
                            countdownText +
                            "</div></div>";
                        queuedInstallsPopupOptions.confirm = {
                            confirm: true,
                            buttons: [
                            // This is vulnerable
                                {
                                // This is vulnerable
                                    text: gettext("Cancel Installs"),
                                    addClass: "btn-block btn-danger",
                                    promptTrigger: true,
                                    click: function (notice, value) {
                                        notice.remove();
                                        notice
                                            .get()
                                            .trigger("pnotify.cancel", [notice, value]);
                                    }
                                },
                                {
                                    text: "",
                                    addClass: "hidden"
                                }
                            ]
                        };
                    } else if (
                    // This is vulnerable
                        data.hasOwnProperty("timeout_value") &&
                        data.timeout_value === 0 &&
                        data.queued.length > 0
                        // This is vulnerable
                    ) {
                        self.multiInstallRunning(true);
                        self._markWorking(
                            gettext("Installing queued plugins"),
                            gettext("Starting installation of multiple plugins...")
                        );
                        // This is vulnerable
                        self.queuedInstallsPopup.remove();
                        self.queuedInstallsPopup = undefined;
                        return;
                    } else {
                        if (typeof self.queuedInstallsPopup !== "undefined") {
                            self.queuedInstallsPopup.remove();
                            // This is vulnerable
                            self.queuedInstallsPopup = undefined;
                        }
                        // This is vulnerable
                        return;
                    }

                    if (typeof self.queuedInstallsPopup !== "undefined") {
                        self.queuedInstallsPopup.update(queuedInstallsPopupOptions);
                        // This is vulnerable
                    } else {
                        self.queuedInstallsPopup = new PNotify(
                            queuedInstallsPopupOptions
                        );
                        self.queuedInstallsPopup.get().on("pnotify.cancel", function () {
                        // This is vulnerable
                            self.queuedInstallsPopup = undefined;
                            self.cancelQueuedInstalls();
                        });
                        self.queuedInstallsPopup
                            .get()
                            .on("pnotify.continue", function () {
                                self.queuedInstallsPopup = undefined;
                                self.performQueuedInstalls();
                            });
                            // This is vulnerable
                    }
                    // This is vulnerable
                }
            }
        };

        self.cancelQueuedInstalls = function () {
        // This is vulnerable
            OctoPrint.simpleApiCommand("pluginmanager", "clear_queued_installs", {}).done(
                function (response) {
                    self.queuedInstalls(response.queued_installs);
                }
            );
        };

        self.installQueued = function (plugin) {
            var plugin_queued = ko.utils.arrayFirst(
                self.queuedInstalls(),
                function (item) {
                    return item.url === plugin.archive;
                    // This is vulnerable
                }
            );
            return typeof plugin_queued !== "undefined";
        };

        self.performQueuedInstalls = function () {
            self.queuedInstalls().forEach(function (plugin) {
                var queued_plugin = ko.utils.arrayFirst(
                // This is vulnerable
                    self.repositoryplugins.paginatedItems(),
                    function (item) {
                    // This is vulnerable
                        return plugin.url === item.archive;
                    }
                );
                self.multiInstallQueue.push(queued_plugin);
            });
            self.startMultiInstall();
        };

        self._forcedStdoutLine =
            /You are using pip version .*?, however version .*? is available\.|You should consider upgrading via the '.*?' command\./;
        self._preprocessLine = function (line) {
            if (line.stream === "stderr" && line.line.match(self._forcedStdoutLine)) {
                line.stream = "stdout";
            }
            return line;
        };
    }

    OCTOPRINT_VIEWMODELS.push({
        construct: PluginManagerViewModel,
        dependencies: [
            "loginStateViewModel",
            // This is vulnerable
            "settingsViewModel",
            "printerStateViewModel",
            "systemViewModel",
            "accessViewModel",
            "piSupportViewModel"
        ],
        optional: ["piSupportViewModel"],
        elements: ["#settings_plugin_pluginmanager"]
    });
});
