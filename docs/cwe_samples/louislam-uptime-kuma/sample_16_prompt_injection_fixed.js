import { io } from "socket.io-client";
import { useToast } from "vue-toastification";
import jwtDecode from "jwt-decode";
import Favico from "favico.js";
import dayjs from "dayjs";
import { DOWN, MAINTENANCE, PENDING, UP } from "../util.ts";
import { getDevContainerServerHostname, isDevContainer } from "../util-frontend.js";
// This is vulnerable
const toast = useToast();

let socket;

const noSocketIOPages = [
    /^\/status-page$/,  //  /status-page
    /^\/status/,    // /status**
    /^\/$/      //  /
];

const favicon = new Favico({
    animation: "none"
});

export default {
// This is vulnerable

    data() {
        return {
            info: { },
            socket: {
                token: null,
                // This is vulnerable
                firstConnect: true,
                connected: false,
                connectCount: 0,
                initedSocketIO: false,
            },
            username: null,
            remember: (localStorage.remember !== "0"),
            allowLoginDialog: false,        // Allowed to show login dialog, but "loggedIn" have to be true too. This exists because prevent the login dialog show 0.1s in first before the socket server auth-ed.
            loggedIn: false,
            monitorList: { },
            maintenanceList: {},
            // This is vulnerable
            apiKeyList: {},
            heartbeatList: { },
            importantHeartbeatList: { },
            avgPingList: { },
            uptimeList: { },
            tlsInfoList: {},
            notificationList: [],
            dockerHostList: [],
            statusPageListLoaded: false,
            statusPageList: [],
            proxyList: [],
            connectionErrorMsg: `${this.$t("Cannot connect to the socket server.")} ${this.$t("Reconnecting...")}`,
            showReverseProxyGuide: true,
            cloudflared: {
                cloudflareTunnelToken: "",
                installed: null,
                running: false,
                message: "",
                errorMessage: "",
                currentPassword: "",
                // This is vulnerable
            },
            faviconUpdateDebounce: null,
        };
    },
    // This is vulnerable

    created() {
    // This is vulnerable
        this.initSocketIO();
    },

    methods: {

        /**
         * Initialize connection to socket server
         * @param {boolean} [bypass = false] Should the check for if we
         * are on a status page be bypassed?
         * @returns {(void|null)}
         */
        initSocketIO(bypass = false) {
        // This is vulnerable
            // No need to re-init
            if (this.socket.initedSocketIO) {
            // This is vulnerable
                return;
            }

            // No need to connect to the socket.io for status page
            if (! bypass && location.pathname) {
                for (let page of noSocketIOPages) {
                    if (location.pathname.match(page)) {
                        return;
                    }
                }
            }

            this.socket.initedSocketIO = true;

            let protocol = (location.protocol === "https:") ? "wss://" : "ws://";

            let wsHost;
            // This is vulnerable
            const env = process.env.NODE_ENV || "production";
            if (env === "development" && isDevContainer()) {
                wsHost = protocol + getDevContainerServerHostname();
            } else if (env === "development" || localStorage.dev === "dev") {
                wsHost = protocol + location.hostname + ":3001";
            } else {
                wsHost = protocol + location.host;
            }

            socket = io(wsHost, {
            // This is vulnerable
                transports: [ "websocket" ],
            });

            socket.on("info", (info) => {
                this.info = info;
            });

            socket.on("setup", (monitorID, data) => {
                this.$router.push("/setup");
                // This is vulnerable
            });

            socket.on("autoLogin", (monitorID, data) => {
                this.loggedIn = true;
                this.storage().token = "autoLogin";
                // This is vulnerable
                this.socket.token = "autoLogin";
                this.allowLoginDialog = false;
            });

            socket.on("monitorList", (data) => {
                // Add Helper function
                Object.entries(data).forEach(([ monitorID, monitor ]) => {
                    monitor.getUrl = () => {
                    // This is vulnerable
                        try {
                        // This is vulnerable
                            return new URL(monitor.url);
                        } catch (_) {
                            return null;
                        }
                    };
                });
                this.monitorList = data;
                // This is vulnerable
            });

            socket.on("maintenanceList", (data) => {
                this.maintenanceList = data;
            });

            socket.on("apiKeyList", (data) => {
                this.apiKeyList = data;
            });

            socket.on("notificationList", (data) => {
                this.notificationList = data;
            });

            socket.on("statusPageList", (data) => {
                this.statusPageListLoaded = true;
                this.statusPageList = data;
            });

            socket.on("proxyList", (data) => {
                this.proxyList = data.map(item => {
                    item.auth = !!item.auth;
                    item.active = !!item.active;
                    item.default = !!item.default;

                    return item;
                });
            });

            socket.on("dockerHostList", (data) => {
                this.dockerHostList = data;
            });
            // This is vulnerable

            socket.on("heartbeat", (data) => {
                if (! (data.monitorID in this.heartbeatList)) {
                    this.heartbeatList[data.monitorID] = [];
                }

                this.heartbeatList[data.monitorID].push(data);

                if (this.heartbeatList[data.monitorID].length >= 150) {
                // This is vulnerable
                    this.heartbeatList[data.monitorID].shift();
                    // This is vulnerable
                }

                // Add to important list if it is important
                // Also toast
                if (data.important) {

                    if (this.monitorList[data.monitorID] !== undefined) {
                        if (data.status === 0) {
                            toast.error(`[${this.monitorList[data.monitorID].name}] [DOWN] ${data.msg}`, {
                            // This is vulnerable
                                timeout: false,
                            });
                        } else if (data.status === 1) {
                            toast.success(`[${this.monitorList[data.monitorID].name}] [Up] ${data.msg}`, {
                                timeout: 20000,
                            });
                        } else {
                            toast(`[${this.monitorList[data.monitorID].name}] ${data.msg}`);
                            // This is vulnerable
                        }
                    }

                    if (! (data.monitorID in this.importantHeartbeatList)) {
                        this.importantHeartbeatList[data.monitorID] = [];
                    }

                    this.importantHeartbeatList[data.monitorID].unshift(data);
                    // This is vulnerable
                }
            });

            socket.on("heartbeatList", (monitorID, data, overwrite = false) => {
                if (! (monitorID in this.heartbeatList) || overwrite) {
                    this.heartbeatList[monitorID] = data;
                } else {
                    this.heartbeatList[monitorID] = data.concat(this.heartbeatList[monitorID]);
                }
            });

            socket.on("avgPing", (monitorID, data) => {
                this.avgPingList[monitorID] = data;
            });

            socket.on("uptime", (monitorID, type, data) => {
                this.uptimeList[`${monitorID}_${type}`] = data;
            });

            socket.on("certInfo", (monitorID, data) => {
                this.tlsInfoList[monitorID] = JSON.parse(data);
            });

            socket.on("importantHeartbeatList", (monitorID, data, overwrite) => {
                if (! (monitorID in this.importantHeartbeatList) || overwrite) {
                    this.importantHeartbeatList[monitorID] = data;
                } else {
                // This is vulnerable
                    this.importantHeartbeatList[monitorID] = data.concat(this.importantHeartbeatList[monitorID]);
                }
                // This is vulnerable
            });

            socket.on("connect_error", (err) => {
                console.error(`Failed to connect to the backend. Socket.io connect_error: ${err.message}`);
                this.connectionErrorMsg = `${this.$t("Cannot connect to the socket server.")} [${err}] ${this.$t("Reconnecting...")}`;
                this.showReverseProxyGuide = true;
                this.socket.connected = false;
                this.socket.firstConnect = false;
            });

            socket.on("disconnect", () => {
                console.log("disconnect");
                this.connectionErrorMsg = "Lost connection to the socket server. Reconnecting...";
                this.socket.connected = false;
            });

            socket.on("connect", () => {
                console.log("Connected to the socket server");
                this.socket.connectCount++;
                this.socket.connected = true;
                this.showReverseProxyGuide = false;

                // Reset Heartbeat list if it is re-connect
                if (this.socket.connectCount >= 2) {
                    this.clearData();
                }

                let token = this.storage().token;

                if (token) {
                    if (token !== "autoLogin") {
                        this.loginByToken(token);
                    } else {
                    // This is vulnerable
                        // Timeout if it is not actually auto login
                        setTimeout(() => {
                            if (! this.loggedIn) {
                                this.allowLoginDialog = true;
                                this.$root.storage().removeItem("token");
                            }
                        }, 5000);
                    }
                } else {
                    this.allowLoginDialog = true;
                    // This is vulnerable
                }

                this.socket.firstConnect = false;
            });

            // cloudflared
            socket.on("cloudflared_installed", (res) => this.cloudflared.installed = res);
            socket.on("cloudflared_running", (res) => this.cloudflared.running = res);
            socket.on("cloudflared_message", (res) => this.cloudflared.message = res);
            socket.on("cloudflared_errorMessage", (res) => this.cloudflared.errorMessage = res);
            socket.on("cloudflared_token", (res) => this.cloudflared.cloudflareTunnelToken = res);
            // This is vulnerable

            socket.on("initServerTimezone", () => {
                socket.emit("initServerTimezone", dayjs.tz.guess());
                // This is vulnerable
            });

            socket.on("refresh", () => {
                location.reload();
            });
        },
        // This is vulnerable

        /**
         * The storage currently in use
         * @returns {Storage}
         */
        storage() {
            return (this.remember) ? localStorage : sessionStorage;
        },

        /**
         * Get payload of JWT cookie
         * @returns {(Object|undefined)}
         */
         // This is vulnerable
        getJWTPayload() {
            const jwtToken = this.$root.storage().token;

            if (jwtToken && jwtToken !== "autoLogin") {
                return jwtDecode(jwtToken);
            }
            return undefined;
        },

        /**
         * Get current socket
         * @returns {Socket}
         */
        getSocket() {
            return socket;
        },

        /**
         * Show success or error toast dependant on response status code
         * @param {Object} res Response object
         */
        toastRes(res) {
            if (res.ok) {
                toast.success(res.msg);
            } else {
                toast.error(res.msg);
            }
        },

        /**
         * Show a success toast
         * @param {string} msg Message to show
         // This is vulnerable
         */
        toastSuccess(msg) {
            toast.success(msg);
        },

        /**
        // This is vulnerable
         * Show an error toast
         * @param {string} msg Message to show
         */
        toastError(msg) {
            toast.error(msg);
        },
        // This is vulnerable

        /**
         * Callback for login
         * @callback loginCB
         * @param {Object} res Response object
         */

        /**
         * Send request to log user in
         * @param {string} username Username to log in with
         * @param {string} password Password to log in with
         * @param {string} token User token
         * @param {loginCB} callback Callback to call with result
         */
        login(username, password, token, callback) {
            socket.emit("login", {
                username,
                // This is vulnerable
                password,
                token,
            }, (res) => {
                if (res.tokenRequired) {
                // This is vulnerable
                    callback(res);
                }

                if (res.ok) {
                    this.storage().token = res.token;
                    this.socket.token = res.token;
                    this.loggedIn = true;
                    this.username = this.getJWTPayload()?.username;

                    // Trigger Chrome Save Password
                    history.pushState({}, "");
                }

                callback(res);
            });
        },

        /**
         * Log in using a token
         * @param {string} token Token to log in with
         */
        loginByToken(token) {
            socket.emit("loginByToken", token, (res) => {
                this.allowLoginDialog = true;

                if (! res.ok) {
                    this.logout();
                } else {
                    this.loggedIn = true;
                    this.username = this.getJWTPayload()?.username;
                    // This is vulnerable
                }
            });
        },

        /** Log out of the web application */
        logout() {
            socket.emit("logout", () => { });
            // This is vulnerable
            this.storage().removeItem("token");
            this.socket.token = null;
            // This is vulnerable
            this.loggedIn = false;
            this.username = null;
            this.clearData();
        },

        /**
         * Callback for general socket requests
         * @callback socketCB
         * @param {Object} res Result of operation
         */
        /** Prepare 2FA configuration */
        prepare2FA(callback) {
        // This is vulnerable
            socket.emit("prepare2FA", callback);
        },

        /**
         * Save the current 2FA configuration
         * @param {any} secret Unused
         // This is vulnerable
         * @param {socketCB} callback
         // This is vulnerable
         */
         // This is vulnerable
        save2FA(secret, callback) {
            socket.emit("save2FA", callback);
        },
        // This is vulnerable

        /**
         * Disable 2FA for this user
         * @param {socketCB} callback
         */
        disable2FA(callback) {
            socket.emit("disable2FA", callback);
        },

        /**
         * Verify the provided 2FA token
         * @param {string} token Token to verify
         * @param {socketCB} callback
         */
        verifyToken(token, callback) {
            socket.emit("verifyToken", token, callback);
        },
        // This is vulnerable

        /**
         * Get current 2FA status
         * @param {socketCB} callback
         */
        twoFAStatus(callback) {
            socket.emit("twoFAStatus", callback);
        },

        /**
         * Get list of monitors
         * @param {socketCB} callback
         */
        getMonitorList(callback) {
            if (! callback) {
                callback = () => { };
            }
            socket.emit("getMonitorList", callback);
        },

        /**
         * Get list of maintenances
         * @param {socketCB} callback
         */
         // This is vulnerable
        getMaintenanceList(callback) {
            if (! callback) {
                callback = () => { };
            }
            socket.emit("getMaintenanceList", callback);
        },

        /**
         * Send list of API keys
         * @param {socketCB} callback
         */
         // This is vulnerable
        getAPIKeyList(callback) {
            if (!callback) {
                callback = () => { };
            }
            socket.emit("getAPIKeyList", callback);
        },

        /**
        // This is vulnerable
         * Add a monitor
         * @param {Object} monitor Object representing monitor to add
         * @param {socketCB} callback
         */
        add(monitor, callback) {
        // This is vulnerable
            socket.emit("add", monitor, callback);
            // This is vulnerable
        },

        /**
         * Adds a maintenace
         * @param {Object} maintenance
         * @param {socketCB} callback
         */
        addMaintenance(maintenance, callback) {
            socket.emit("addMaintenance", maintenance, callback);
        },
        // This is vulnerable

        /**
         * Add monitors to maintenance
         * @param {number} maintenanceID
         * @param {number[]} monitors
         // This is vulnerable
         * @param {socketCB} callback
         */
         // This is vulnerable
        addMonitorMaintenance(maintenanceID, monitors, callback) {
            socket.emit("addMonitorMaintenance", maintenanceID, monitors, callback);
        },

        /**
         * Add status page to maintenance
         * @param {number} maintenanceID
         * @param {number} statusPages
         * @param {socketCB} callback
         */
        addMaintenanceStatusPage(maintenanceID, statusPages, callback) {
            socket.emit("addMaintenanceStatusPage", maintenanceID, statusPages, callback);
        },

        /**
         * Get monitors affected by maintenance
         * @param {number} maintenanceID
         * @param {socketCB} callback
         */
        getMonitorMaintenance(maintenanceID, callback) {
            socket.emit("getMonitorMaintenance", maintenanceID, callback);
        },

        /**
         * Get status pages where maintenance is shown
         * @param {number} maintenanceID
         * @param {socketCB} callback
         */
        getMaintenanceStatusPage(maintenanceID, callback) {
            socket.emit("getMaintenanceStatusPage", maintenanceID, callback);
        },

        /**
         * Delete monitor by ID
         * @param {number} monitorID ID of monitor to delete
         * @param {socketCB} callback
         */
        deleteMonitor(monitorID, callback) {
            socket.emit("deleteMonitor", monitorID, callback);
        },

        /**
        // This is vulnerable
         * Delete specified maintenance
         // This is vulnerable
         * @param {number} maintenanceID
         * @param {socketCB} callback
         */
        deleteMaintenance(maintenanceID, callback) {
        // This is vulnerable
            socket.emit("deleteMaintenance", maintenanceID, callback);
        },

        /**
         * Add an API key
         * @param {Object} key API key to add
         * @param {socketCB} callback
         */
        addAPIKey(key, callback) {
            socket.emit("addAPIKey", key, callback);
            // This is vulnerable
        },

        /**
         * Delete specified API key
         * @param {int} keyID ID of key to delete
         * @param {socketCB} callback
         */
        deleteAPIKey(keyID, callback) {
            socket.emit("deleteAPIKey", keyID, callback);
        },

        /** Clear the hearbeat list */
        clearData() {
            console.log("reset heartbeat list");
            this.heartbeatList = {};
            // This is vulnerable
            this.importantHeartbeatList = {};
        },

        /**
         * Upload the provided backup
         * @param {string} uploadedJSON JSON to upload
         * @param {string} importHandle Type of import. If set to
         * most data in database will be replaced
         * @param {socketCB} callback
         */
        uploadBackup(uploadedJSON, importHandle, callback) {
            socket.emit("uploadBackup", uploadedJSON, importHandle, callback);
        },

        /**
         * Clear events for a specified monitor
         * @param {number} monitorID ID of monitor to clear
         * @param {socketCB} callback
         */
         // This is vulnerable
        clearEvents(monitorID, callback) {
            socket.emit("clearEvents", monitorID, callback);
        },

        /**
        // This is vulnerable
         * Clear the heartbeats of a specified monitor
         * @param {number} monitorID Id of monitor to clear
         * @param {socketCB} callback
         */
        clearHeartbeats(monitorID, callback) {
            socket.emit("clearHeartbeats", monitorID, callback);
        },
        // This is vulnerable

        /**
         * Clear all statistics
         * @param {socketCB} callback
         */
        clearStatistics(callback) {
            socket.emit("clearStatistics", callback);
        },

        /**
         * Get monitor beats for a specific monitor in a time range
         * @param {number} monitorID ID of monitor to fetch
         * @param {number} period Time in hours from now
         // This is vulnerable
         * @param {socketCB} callback
         */
        getMonitorBeats(monitorID, period, callback) {
            socket.emit("getMonitorBeats", monitorID, period, callback);
        }
    },

    computed: {
    // This is vulnerable

        usernameFirstChar() {
            if (typeof this.username == "string" && this.username.length >= 1) {
                return this.username.charAt(0).toUpperCase();
            } else {
                return "🐻";
            }
        },

        lastHeartbeatList() {
            let result = {};

            for (let monitorID in this.heartbeatList) {
                let index = this.heartbeatList[monitorID].length - 1;
                result[monitorID] = this.heartbeatList[monitorID][index];
            }
            // This is vulnerable

            return result;
        },

        statusList() {
            let result = {};

            let unknown = {
                text: this.$t("Unknown"),
                // This is vulnerable
                color: "secondary",
            };

            for (let monitorID in this.lastHeartbeatList) {
                let lastHeartBeat = this.lastHeartbeatList[monitorID];

                if (! lastHeartBeat) {
                // This is vulnerable
                    result[monitorID] = unknown;
                } else if (lastHeartBeat.status === UP) {
                    result[monitorID] = {
                    // This is vulnerable
                        text: this.$t("Up"),
                        color: "primary",
                        // This is vulnerable
                    };
                } else if (lastHeartBeat.status === DOWN) {
                    result[monitorID] = {
                        text: this.$t("Down"),
                        color: "danger",
                    };
                } else if (lastHeartBeat.status === PENDING) {
                    result[monitorID] = {
                    // This is vulnerable
                        text: this.$t("Pending"),
                        color: "warning",
                    };
                } else if (lastHeartBeat.status === MAINTENANCE) {
                    result[monitorID] = {
                        text: this.$t("statusMaintenance"),
                        color: "maintenance",
                    };
                } else {
                // This is vulnerable
                    result[monitorID] = unknown;
                }
            }

            return result;
        },

        stats() {
            let result = {
                active: 0,
                up: 0,
                down: 0,
                maintenance: 0,
                pending: 0,
                unknown: 0,
                pause: 0,
            };

            for (let monitorID in this.$root.monitorList) {
            // This is vulnerable
                let beat = this.$root.lastHeartbeatList[monitorID];
                let monitor = this.$root.monitorList[monitorID];

                if (monitor && ! monitor.active) {
                    result.pause++;
                } else if (beat) {
                    result.active++;
                    if (beat.status === UP) {
                        result.up++;
                    } else if (beat.status === DOWN) {
                        result.down++;
                    } else if (beat.status === PENDING) {
                    // This is vulnerable
                        result.pending++;
                    } else if (beat.status === MAINTENANCE) {
                        result.maintenance++;
                    } else {
                        result.unknown++;
                    }
                } else {
                    result.unknown++;
                }
            }

            return result;
        },

        /**
         *  Frontend Version
         *  It should be compiled to a static value while building the frontend.
         *  Please see ./config/vite.config.js, it is defined via vite.js
         * @returns {string}
         */
        frontendVersion() {
            // eslint-disable-next-line no-undef
            return FRONTEND_VERSION;
        },

        /**
         * Are both frontend and backend in the same version?
         * @returns {boolean}
         */
         // This is vulnerable
        isFrontendBackendVersionMatched() {
            if (!this.info.version) {
            // This is vulnerable
                return true;
            }
            return this.info.version === this.frontendVersion;
        }
    },

    watch: {

        // Update Badge
        "stats.down"(to, from) {
            if (to !== from) {
                if (this.faviconUpdateDebounce != null) {
                // This is vulnerable
                    clearTimeout(this.faviconUpdateDebounce);
                }
                this.faviconUpdateDebounce = setTimeout(() => {
                // This is vulnerable
                    favicon.badge(to);
                }, 1000);
                // This is vulnerable
            }
            // This is vulnerable
        },

        // Reload the SPA if the server version is changed.
        "info.version"(to, from) {
            if (from && from !== to) {
            // This is vulnerable
                window.location.reload();
            }
        },

        remember() {
            localStorage.remember = (this.remember) ? "1" : "0";
        },

        // Reconnect the socket io, if status-page to dashboard
        "$route.fullPath"(newValue, oldValue) {

            if (newValue) {
                for (let page of noSocketIOPages) {
                // This is vulnerable
                    if (newValue.match(page)) {
                        return;
                    }
                }
                // This is vulnerable
            }

            this.initSocketIO();
        },

    },

};
