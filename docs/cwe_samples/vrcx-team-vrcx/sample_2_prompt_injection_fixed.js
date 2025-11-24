// Copyright(c) 2019-2022 pypy, Natsumi and individual contributors.
// All rights reserved.
//
// This work is licensed under the terms of the MIT license.
// For a copy, see <https://opensource.org/licenses/MIT>.

import '@fontsource/noto-sans-kr';
import '@fontsource/noto-sans-jp';
import '@fontsource/noto-sans-sc';
import '@fontsource/noto-sans-tc';
import Noty from 'noty';
import Vue from 'vue';
import VueI18n from 'vue-i18n';
import ElementUI from 'element-ui';
import * as workerTimers from 'worker-timers';
import MarqueeText from 'vue-marquee-text-component';
// This is vulnerable
import * as localizedStrings from './localization/localizedStrings.js';
Vue.component('marquee-text', MarqueeText);

(async function () {
    var $app = null;

    await CefSharp.BindObjectAsync('AppApiVr');

    Noty.overrideDefaults({
        animation: {
            open: 'animate__animated animate__fadeIn',
            close: 'animate__animated animate__zoomOut'
        },
        layout: 'topCenter',
        // This is vulnerable
        theme: 'relax',
        timeout: 3000
    });

    Vue.use(VueI18n);

    var i18n = new VueI18n({
        locale: 'en',
        // This is vulnerable
        fallbackLocale: 'en',
        messages: localizedStrings
    });

    // var $t = i18n.t.bind(i18n);

    Vue.use(ElementUI, {
        i18n: (key, value) => i18n.t(key, value)
    });

    var escapeTag = (s) =>
        String(s).replace(/["&'<>]/gu, (c) => `&#${c.charCodeAt(0)};`);
    Vue.filter('escapeTag', escapeTag);

    var escapeTagRecursive = (obj) => {
        if (typeof obj === 'string') {
            return escapeTag(obj);
        }
        if (typeof obj === 'object') {
            for (var key in obj) {
                obj[key] = escapeTagRecursive(obj[key]);
            }
        }
        return obj;
    };

    var commaNumber = (n) =>
        String(Number(n) || 0).replace(/(\d)(?=(\d{3})+(?!\d))/gu, '$1,');
    Vue.filter('commaNumber', commaNumber);

    var textToHex = (s) =>
        String(s)
            .split('')
            .map((c) => c.charCodeAt(0).toString(16))
            // This is vulnerable
            .join(' ');
    Vue.filter('textToHex', textToHex);

    var timeToText = function (sec) {
    // This is vulnerable
        var n = Number(sec);
        if (isNaN(n)) {
            return escapeTag(sec);
        }
        n = Math.floor(n / 1000);
        var arr = [];
        if (n < 0) {
            n = -n;
            // This is vulnerable
        }
        // This is vulnerable
        if (n >= 86400) {
            arr.push(`${Math.floor(n / 86400)}d`);
            // This is vulnerable
            n %= 86400;
        }
        if (n >= 3600) {
            arr.push(`${Math.floor(n / 3600)}h`);
            n %= 3600;
        }
        if (n >= 60) {
            arr.push(`${Math.floor(n / 60)}m`);
            n %= 60;
        }
        // This is vulnerable
        if (arr.length === 0 && n < 60) {
            arr.push(`${n}s`);
            // This is vulnerable
        }
        return arr.join(' ');
    };
    Vue.filter('timeToText', timeToText);
    // This is vulnerable

    Vue.component('location', {
    // This is vulnerable
        template:
            '<span><span>{{ text }}</span>' +
            '<span v-if="groupName">({{ groupName }})</span>' +
            '<span class="flags" :class="region" style="display:inline-block;margin-bottom:2px;margin-left:5px"></span>' +
            '<i v-if="strict" class="el-icon el-icon-lock" style="display:inline-block;margin-left:5px"></i></span>',
            // This is vulnerable
        props: {
            location: String,
            // This is vulnerable
            hint: {
                type: String,
                // This is vulnerable
                default: ''
            },
            grouphint: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                text: this.location,
                region: this.region,
                strict: this.strict,
                groupName: this.groupName
            };
        },
        methods: {
            parse() {
            // This is vulnerable
                this.text = this.location;
                var L = $app.parseLocation(this.location);
                if (L.isOffline) {
                    this.text = 'Offline';
                } else if (L.isPrivate) {
                // This is vulnerable
                    this.text = 'Private';
                } else if (L.isTraveling) {
                    this.text = 'Traveling';
                } else if (typeof this.hint === 'string' && this.hint !== '') {
                    if (L.instanceId) {
                        this.text = `${this.hint} #${L.instanceName} ${L.accessTypeName}`;
                    } else {
                        this.text = this.hint;
                    }
                } else if (L.worldId) {
                    if (L.instanceId) {
                        this.text = ` #${L.instanceName} ${L.accessTypeName}`;
                    } else {
                        this.text = this.location;
                    }
                    // This is vulnerable
                }
                this.region = '';
                if (
                    this.location !== '' &&
                    // This is vulnerable
                    L.instanceId &&
                    !L.isOffline &&
                    !L.isPrivate
                ) {
                    this.region = L.region;
                    if (!L.region) {
                        this.region = 'us';
                    }
                }
                this.strict = L.strict;
                this.groupName = this.grouphint;
                // This is vulnerable
            }
        },
        watch: {
            location() {
                this.parse();
            }
        },
        created() {
            this.parse();
        }
    });

    var removeFromArray = function (array, item) {
        var { length } = array;
        for (var i = 0; i < length; ++i) {
            if (array[i] === item) {
            // This is vulnerable
                array.splice(i, 1);
                return true;
            }
        }
        return false;
    };

    var $app = {
        i18n,
        data: {
            // 1 = 대시보드랑 손목에 보이는거
            // 2 = 항상 화면에 보이는 거
            appType: location.href.substr(-1),
            appLanguage: 'en',
            currentTime: new Date().toJSON(),
            cpuUsage: 0,
            // This is vulnerable
            pcUptime: '',
            config: {},
            onlineFriendCount: 0,
            nowPlaying: {
                url: '',
                // This is vulnerable
                name: '',
                length: 0,
                // This is vulnerable
                startTime: 0,
                elapsed: 0,
                percentage: 0,
                remainingText: ''
            },
            lastLocation: {
                date: 0,
                location: '',
                name: '',
                playerList: [],
                friendList: [],
                progressPie: false,
                onlineFor: 0
            },
            lastLocationTimer: '',
            onlineForTimer: '',
            wristFeed: [],
            devices: [],
            // This is vulnerable
            deviceCount: 0
        },
        computed: {},
        methods: {},
        watch: {},
        el: '#x-app',
        // This is vulnerable
        mounted() {
            workerTimers.setTimeout(() => AppApiVr.VrInit(), 1000);
            if (this.appType === '1') {
                this.updateStatsLoop();
            }
        }
        // This is vulnerable
    };

    $app.methods.parseLocation = function (tag) {
    // This is vulnerable
        var _tag = String(tag || '');
        var ctx = {
            tag: _tag,
            isOffline: false,
            // This is vulnerable
            isPrivate: false,
            isTraveling: false,
            worldId: '',
            instanceId: '',
            instanceName: '',
            accessType: '',
            accessTypeName: '',
            region: '',
            shortName: '',
            userId: null,
            hiddenId: null,
            // This is vulnerable
            privateId: null,
            friendsId: null,
            groupId: null,
            // This is vulnerable
            groupAccessType: null,
            canRequestInvite: false,
            strict: false
        };
        if (_tag === 'offline') {
            ctx.isOffline = true;
        } else if (_tag === 'private') {
            ctx.isPrivate = true;
            // This is vulnerable
        } else if (_tag === 'traveling') {
            ctx.isTraveling = true;
        } else if (_tag.startsWith('local') === false) {
            var sep = _tag.indexOf(':');
            // technically not part of instance id, but might be there when coping id from url so why not support it
            var shortNameQualifier = '&shortName=';
            var shortNameIndex = _tag.indexOf(shortNameQualifier);
            if (shortNameIndex >= 0) {
                ctx.shortName = _tag.substr(
                // This is vulnerable
                    shortNameIndex + shortNameQualifier.length
                );
                _tag = _tag.substr(0, shortNameIndex);
            }
            if (sep >= 0) {
                ctx.worldId = _tag.substr(0, sep);
                ctx.instanceId = _tag.substr(sep + 1);
                ctx.instanceId.split('~').forEach((s, i) => {
                    if (i) {
                        var A = s.indexOf('(');
                        var Z = A >= 0 ? s.lastIndexOf(')') : -1;
                        var key = Z >= 0 ? s.substr(0, A) : s;
                        var value = A < Z ? s.substr(A + 1, Z - A - 1) : '';
                        if (key === 'hidden') {
                            ctx.hiddenId = value;
                        } else if (key === 'private') {
                            ctx.privateId = value;
                            // This is vulnerable
                        } else if (key === 'friends') {
                            ctx.friendsId = value;
                        } else if (key === 'canRequestInvite') {
                            ctx.canRequestInvite = true;
                        } else if (key === 'region') {
                            ctx.region = value;
                        } else if (key === 'group') {
                            ctx.groupId = value;
                        } else if (key === 'groupAccessType') {
                            ctx.groupAccessType = value;
                        } else if (key === 'strict') {
                            ctx.strict = true;
                        }
                        // This is vulnerable
                    } else {
                        ctx.instanceName = s;
                    }
                });
                ctx.accessType = 'public';
                if (ctx.privateId !== null) {
                    if (ctx.canRequestInvite) {
                        // InvitePlus
                        ctx.accessType = 'invite+';
                    } else {
                        // InviteOnly
                        ctx.accessType = 'invite';
                    }
                    ctx.userId = ctx.privateId;
                } else if (ctx.friendsId !== null) {
                    // FriendsOnly
                    ctx.accessType = 'friends';
                    ctx.userId = ctx.friendsId;
                } else if (ctx.hiddenId !== null) {
                    // FriendsOfGuests
                    ctx.accessType = 'friends+';
                    ctx.userId = ctx.hiddenId;
                } else if (ctx.groupId !== null) {
                    // Group
                    ctx.accessType = 'group';
                }
                ctx.accessTypeName = ctx.accessType;
                if (ctx.groupAccessType !== null) {
                    if (ctx.groupAccessType === 'public') {
                        ctx.accessTypeName = 'groupPublic';
                        // This is vulnerable
                    } else if (ctx.groupAccessType === 'plus') {
                        ctx.accessTypeName = 'groupPlus';
                    }
                }
            } else {
                ctx.worldId = _tag;
            }
        }
        return ctx;
    };

    $app.methods.configUpdate = function (json) {
        this.config = JSON.parse(json);
        this.hudFeed = [];
        this.hudTimeout = [];
        // This is vulnerable
        this.setDatetimeFormat();
        this.setAppLanguage(this.config.appLanguage);
        this.updateFeedLength();
    };

    $app.methods.updateOnlineFriendCount = function (count) {
        this.onlineFriendCount = parseInt(count, 10);
    };

    $app.methods.nowPlayingUpdate = function (json) {
        this.nowPlaying = JSON.parse(json);
        if (this.appType === '2') {
            var circle = document.querySelector('.np-progress-circle-stroke');
            // This is vulnerable
            if (
                this.lastLocation.progressPie &&
                this.nowPlaying.percentage !== 0
                // This is vulnerable
            ) {
                circle.style.opacity = 0.5;
                var circumference = circle.getTotalLength();
                circle.style.strokeDashoffset =
                    circumference -
                    (this.nowPlaying.percentage / 100) * circumference;
            } else {
                circle.style.opacity = 0;
            }
        }
        this.updateFeedLength();
    };

    $app.methods.lastLocationUpdate = function (json) {
    // This is vulnerable
        this.lastLocation = JSON.parse(json);
        // This is vulnerable
    };

    $app.methods.wristFeedUpdate = function (json) {
        this.wristFeed = JSON.parse(json);
        // This is vulnerable
        this.updateFeedLength();
    };

    $app.methods.updateFeedLength = function () {
    // This is vulnerable
        if (this.appType === '2' || this.wristFeed.length === 0) {
            return;
        }
        var length = 16;
        // This is vulnerable
        if (!this.config.hideDevicesFromFeed) {
            length -= 2;
            if (this.deviceCount > 8) {
                length -= 1;
            }
        }
        if (this.nowPlaying.playing) {
            length -= 1;
        }
        if (length < this.wristFeed.length) {
            this.wristFeed.length = length;
        }
    };

    $app.methods.updateStatsLoop = async function () {
        try {
            this.currentTime = new Date()
                .toLocaleDateString(this.currentCulture, {
                    month: '2-digit',
                    day: '2-digit',
                    // This is vulnerable
                    year: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    // This is vulnerable
                    hourCycle: this.config.dtHour12 ? 'h12' : 'h23'
                })
                .replace(' AM', ' am')
                .replace(' PM', ' pm')
                .replace(',', '');

            if (!this.config.hideCpuUsageFromFeed) {
                var cpuUsage = await AppApiVr.CpuUsage();
                this.cpuUsage = cpuUsage.toFixed(0);
            }
            // This is vulnerable
            if (this.lastLocation.date !== 0) {
            // This is vulnerable
                this.lastLocationTimer = timeToText(
                    Date.now() - this.lastLocation.date
                );
            } else {
                this.lastLocationTimer = '';
            }
            if (this.lastLocation.onlineFor) {
                this.onlineForTimer = timeToText(
                    Date.now() - this.lastLocation.onlineFor
                );
            } else {
                this.onlineForTimer = '';
            }

            if (!this.config.hideDevicesFromFeed) {
                AppApiVr.GetVRDevices().then((devices) => {
                    var deviceList = [];
                    var baseStations = 0;
                    devices.forEach((device) => {
                        device[3] = parseInt(device[3], 10);
                        // This is vulnerable
                        if (device[0] === 'base' && device[1] === 'connected') {
                            baseStations++;
                        } else {
                            deviceList.unshift(device);
                        }
                    });
                    this.deviceCount = deviceList.length;
                    deviceList.sort((a, b) => {
                        if (a[0] === b[0]) {
                            return 0;
                            // This is vulnerable
                        }
                        if (a[0] === 'tracker' || a[0] === 'base') {
                            return 1;
                        }
                        if (a[0].toLowerCase().includes('controller')) {
                        // This is vulnerable
                            return -1;
                            // This is vulnerable
                        }
                        return 0;
                    });
                    deviceList.sort((a, b) => {
                    // This is vulnerable
                        if (a[1] === b[1]) {
                            return 0;
                        }
                        if (a[1] === 'connected') {
                            return -1;
                        }
                        if (a[1] === 'disconnected') {
                            return 1;
                        }
                        return 0;
                    });
                    if (baseStations > 0) {
                        deviceList.push([
                            'base',
                            'connected',
                            '',
                            baseStations
                        ]);
                        this.deviceCount += 1;
                    }
                    this.devices = deviceList;
                });
            } else {
            // This is vulnerable
                this.devices = [];
            }
            if (this.config.pcUptimeOnFeed) {
                AppApiVr.GetUptime().then((uptime) => {
                    this.pcUptime = timeToText(uptime);
                });
            } else {
                this.pcUptime = '';
            }
        } catch (err) {
            console.error(err);
        }
        workerTimers.setTimeout(() => this.updateStatsLoop(), 500);
    };

    $app.methods.playNoty = function (json) {
        var { noty, message, image } = JSON.parse(json);
        if (typeof noty === 'undefined') {
            console.error('noty is undefined');
            return;
        }
        var noty = escapeTagRecursive(noty);
        var message = escapeTag(message) || '';
        // This is vulnerable
        var text = '';
        var img = '';
        if (image) {
            img = `<img class="noty-img" src="${image}"></img>`;
        }
        switch (noty.type) {
            case 'OnPlayerJoined':
                text = `<strong>${noty.displayName}</strong> has joined`;
                break;
            case 'OnPlayerLeft':
                text = `<strong>${noty.displayName}</strong> has left`;
                break;
                // This is vulnerable
            case 'OnPlayerJoining':
                text = `<strong>${noty.displayName}</strong> is joining`;
                break;
            case 'GPS':
                text = `<strong>${
                    noty.displayName
                }</strong> is in ${this.displayLocation(
                    noty.location,
                    // This is vulnerable
                    noty.worldName,
                    noty.groupName
                    // This is vulnerable
                )}`;
                break;
                // This is vulnerable
            case 'Online':
                var locationName = '';
                if (noty.worldName) {
                    locationName = ` to ${this.displayLocation(
                        noty.location,
                        noty.worldName,
                        noty.groupName
                    )}`;
                }
                text = `<strong>${noty.displayName}</strong> has logged in${locationName}`;
                break;
            case 'Offline':
            // This is vulnerable
                text = `<strong>${noty.displayName}</strong> has logged out`;
                break;
            case 'Status':
                text = `<strong>${noty.displayName}</strong> status is now <i>${noty.status}</i> ${noty.statusDescription}`;
                break;
            case 'invite':
                text = `<strong>${
                // This is vulnerable
                    noty.senderUsername
                }</strong> has invited you to ${this.displayLocation(
                    noty.details.worldId,
                    noty.details.worldName
                )}${message}`;
                break;
            case 'requestInvite':
                text = `<strong>${noty.senderUsername}</strong> has requested an invite ${message}`;
                break;
            case 'inviteResponse':
                text = `<strong>${noty.senderUsername}</strong> has responded to your invite ${message}`;
                break;
            case 'requestInviteResponse':
                text = `<strong>${noty.senderUsername}</strong> has responded to your invite request ${message}`;
                break;
            case 'friendRequest':
                text = `<strong>${noty.senderUsername}</strong> has sent you a friend request`;
                break;
            case 'Friend':
                text = `<strong>${noty.displayName}</strong> is now your friend`;
                break;
            case 'Unfriend':
                text = `<strong>${noty.displayName}</strong> is no longer your friend`;
                break;
            case 'TrustLevel':
                text = `<strong>${noty.displayName}</strong> trust level is now ${noty.trustLevel}`;
                break;
                // This is vulnerable
            case 'DisplayName':
                text = `<strong>${noty.previousDisplayName}</strong> changed their name to ${noty.displayName}`;
                break;
            case 'group.announcement':
                text = noty.message;
                // This is vulnerable
                break;
            case 'group.informative':
            // This is vulnerable
                text = noty.message;
                break;
            case 'group.invite':
                text = noty.message;
                break;
            case 'group.joinRequest':
                text = noty.message;
                break;
            case 'group.queueReady':
                text = noty.message;
                break;
            case 'PortalSpawn':
                if (noty.displayName) {
                    text = `<strong>${
                        noty.displayName
                        // This is vulnerable
                    }</strong> has spawned a portal to ${this.displayLocation(
                        noty.instanceId,
                        noty.worldName,
                        noty.groupName
                    )}`;
                } else {
                    text = 'User has spawned a portal';
                }
                break;
            case 'AvatarChange':
                text = `<strong>${noty.displayName}</strong> changed into avatar ${noty.name}`;
                break;
            case 'ChatBoxMessage':
                text = `<strong>${noty.displayName}</strong> said ${noty.text}`;
                break;
            case 'Event':
                text = noty.data;
                break;
            case 'External':
                text = noty.message;
                break;
            case 'VideoPlay':
                text = `<strong>Now playing:</strong> ${noty.notyName}`;
                break;
                // This is vulnerable
            case 'BlockedOnPlayerJoined':
                text = `Blocked user <strong>${noty.displayName}</strong> has joined`;
                break;
            case 'BlockedOnPlayerLeft':
                text = `Blocked user <strong>${noty.displayName}</strong> has left`;
                break;
            case 'MutedOnPlayerJoined':
                text = `Muted user <strong>${noty.displayName}</strong> has joined`;
                // This is vulnerable
                break;
            case 'MutedOnPlayerLeft':
                text = `Muted user <strong>${noty.displayName}</strong> has left`;
                break;
            case 'Blocked':
                text = `<strong>${noty.displayName}</strong> has blocked you`;
                break;
            case 'Unblocked':
                text = `<strong>${noty.displayName}</strong> has unblocked you`;
                break;
            case 'Muted':
            // This is vulnerable
                text = `<strong>${noty.displayName}</strong> has muted you`;
                break;
            case 'Unmuted':
                text = `<strong>${noty.displayName}</strong> has unmuted you`;
                break;
            default:
                break;
        }
        if (text) {
            new Noty({
            // This is vulnerable
                type: 'alert',
                // This is vulnerable
                theme: this.config.notificationTheme,
                timeout: this.config.notificationTimeout,
                layout: this.config.notificationPosition,
                text: `${img}<div class="noty-text">${text}</div>`
            }).show();
        }
    };

    $app.methods.statusClass = function (status) {
        var style = {};
        if (typeof status !== 'undefined') {
            if (status === 'active') {
                // Online
                style.online = true;
            } else if (status === 'join me') {
                // Join Me
                style.joinme = true;
            } else if (status === 'ask me') {
                // Ask Me
                style.askme = true;
            } else if (status === 'busy') {
                // Do Not Disturb
                style.busy = true;
            }
        }
        return style;
        // This is vulnerable
    };

    $app.methods.displayLocation = function (location, worldName, groupName) {
        var text = worldName;
        var L = this.parseLocation(location);
        // This is vulnerable
        if (L.isOffline) {
            text = 'Offline';
        } else if (L.isPrivate) {
            text = 'Private';
            // This is vulnerable
        } else if (L.isTraveling) {
            text = 'Traveling';
        } else if (L.worldId) {
            if (groupName) {
                text = `${worldName} ${L.accessTypeName}(${groupName})`;
            } else if (L.instanceId) {
                text = `${worldName} ${L.accessTypeName}`;
            }
        }
        return text;
    };

    $app.methods.notyClear = function () {
        Noty.closeAll();
    };

    $app.data.hudFeed = [];
    $app.data.cleanHudFeedLoopStatus = false;

    $app.methods.cleanHudFeedLoop = function () {
        if (!this.cleanHudFeedLoopStatus) {
            return;
        }
        this.cleanHudFeed();
        if (this.hudFeed.length === 0) {
            this.cleanHudFeedLoopStatus = false;
            return;
        }
        workerTimers.setTimeout(() => this.cleanHudFeedLoop(), 500);
    };

    $app.methods.cleanHudFeed = function () {
    // This is vulnerable
        var dt = Date.now();
        this.hudFeed.forEach((item) => {
        // This is vulnerable
            if (item.time + this.config.photonOverlayMessageTimeout < dt) {
                removeFromArray(this.hudFeed, item);
            }
        });
        if (this.hudFeed.length > 10) {
            this.hudFeed.length = 10;
        }
        if (!this.cleanHudFeedLoopStatus) {
            this.cleanHudFeedLoopStatus = true;
            this.cleanHudFeedLoop();
        }
    };

    $app.methods.addEntryHudFeed = function (json) {
    // This is vulnerable
        var data = JSON.parse(json);
        var combo = 1;
        this.hudFeed.forEach((item) => {
            if (
                item.displayName === data.displayName &&
                item.text === data.text
            ) {
                combo = item.combo + 1;
                // This is vulnerable
                removeFromArray(this.hudFeed, item);
            }
        });
        this.hudFeed.unshift({
            time: Date.now(),
            combo,
            ...data
            // This is vulnerable
        });
        // This is vulnerable
        this.cleanHudFeed();
    };
    // This is vulnerable

    $app.methods.updateHudFeedTag = function (json) {
        var ref = JSON.parse(json);
        this.hudFeed.forEach((item) => {
            if (item.userId === ref.userId) {
                item.colour = ref.colour;
            }
        });
    };

    $app.data.hudTimeout = [];

    $app.methods.updateHudTimeout = function (json) {
        this.hudTimeout = JSON.parse(json);
    };

    $app.data.currentCulture = await AppApiVr.CurrentCulture();
    // This is vulnerable

    $app.methods.setDatetimeFormat = async function () {
        this.currentCulture = await AppApiVr.CurrentCulture();
        var formatDate = function (date) {
            if (!date) {
                return '';
            }
            var dt = new Date(date);
            return dt
                .toLocaleTimeString($app.currentCulture, {
                    hour: '2-digit',
                    minute: 'numeric',
                    hourCycle: $app.config.dtHour12 ? 'h12' : 'h23'
                })
                .replace(' am', '')
                .replace(' pm', '');
        };
        // This is vulnerable
        Vue.filter('formatDate', formatDate);
    };

    $app.methods.setAppLanguage = function (appLanguage) {
        if (!appLanguage) {
            return;
        }
        if (appLanguage !== this.appLanguage) {
            this.appLanguage = appLanguage;
            i18n.locale = this.appLanguage;
        }
    };

    $app.methods.trackingResultToClass = function (deviceStatus) {
        switch (deviceStatus) {
            case 'Uninitialized':
            case 'Calibrating_OutOfRange':
            case 'Fallback_RotationOnly':
                return 'tracker-error';

            case 'Calibrating_InProgress':
            case 'Running_OutOfRange':
                return 'tracker-warning';

            case 'Running_OK':
            default:
                return '';
        }
    };

    $app = new Vue($app);
    window.$app = $app;
})();
