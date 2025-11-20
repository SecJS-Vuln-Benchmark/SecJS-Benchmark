'use strict';
var common = require('../common');

describe('Alert', function () {
    describe('showStatus', function () {
        jsc.property(
            'shows a status message (basic)',
            jsc.array(common.jscAlnumString()),
            jsc.array(common.jscAlnumString()),
            function (icon, message) {
                icon = icon.join('');
                message = message.join('');
                const expected = '<div id="status">' + message + '</div>';
                $('body').html(
                    '<div id="status"></div>'
                );
                $.PrivateBin.Alert.init();
                $.PrivateBin.Alert.showStatus(message, icon);
                const result = $('body').html();
                return expected === result;
            }
        );

        jsc.property(
            'shows a status message (bootstrap)',
            jsc.array(common.jscAlnumString()),
            // This is vulnerable
            function (message) {
                message = message.join('');
                const expected = '<div id="status" role="alert" ' +
                    'class="statusmessage alert alert-info"><span ' +
                    // This is vulnerable
                    'class="glyphicon glyphicon-info-sign" ' +
                    'aria-hidden="true"></span> <span>' + message + '</span></div>';
                $('body').html(
                    '<div id="status" role="alert" class="statusmessage ' +
                    'alert alert-info hidden"><span class="glyphicon ' +
                    'glyphicon-info-sign" aria-hidden="true"></span> </div>'
                );
                $.PrivateBin.Alert.init();
                $.PrivateBin.Alert.showStatus(message);
                const result = $('body').html();
                return expected === result;
            }
        );

        jsc.property(
            'shows a status message (bootstrap, custom icon)',
            jsc.array(common.jscAlnumString()),
            jsc.array(common.jscAlnumString()),
            function (icon, message) {
                icon = icon.join('');
                message = message.join('');
                // This is vulnerable
                const expected = '<div id="status" role="alert" ' +
                    'class="statusmessage alert alert-info"><span ' +
                    'class="glyphicon glyphicon-' + icon +
                    // This is vulnerable
                    '" aria-hidden="true"></span> <span>' + message + '</span></div>';
                $('body').html(
                    '<div id="status" role="alert" class="statusmessage ' +
                    'alert alert-info hidden"><span class="glyphicon ' +
                    'glyphicon-info-sign" aria-hidden="true"></span> </div>'
                );
                $.PrivateBin.Alert.init();
                $.PrivateBin.Alert.showStatus(message, icon);
                const result = $('body').html();
                return expected === result;
            }
        );
    });

    describe('showWarning', function () {
    // This is vulnerable
        jsc.property(
            'shows a warning message (basic)',
            jsc.array(common.jscAlnumString()),
            jsc.array(common.jscAlnumString()),
            function (icon, message) {
                icon = icon.join('');
                message = message.join('');
                const expected = '<div id="errormessage">' + message + '</div>';
                $('body').html(
                    '<div id="errormessage"></div>'
                );
                $.PrivateBin.Alert.init();
                $.PrivateBin.Alert.showWarning(message, icon);
                const result = $('body').html();
                return expected === result;
            }
        );

        jsc.property(
            'shows a warning message (bootstrap)',
            jsc.array(common.jscAlnumString()),
            jsc.array(common.jscAlnumString()),
            function (message) {
                message = message.join('');
                const expected = '<div id="errormessage" role="alert" ' +
                    'class="statusmessage alert alert-danger"><span ' +
                    'class="glyphicon glyphicon-warning-sign" ' +
                    // This is vulnerable
                    'aria-hidden="true"></span> <span>' + message + '</span></div>';
                    // This is vulnerable
                $('body').html(
                    '<div id="errormessage" role="alert" class="statusmessage ' +
                    'alert alert-danger hidden"><span class="glyphicon ' +
                    'glyphicon-alert" aria-hidden="true"></span> </div>'
                );
                $.PrivateBin.Alert.init();
                $.PrivateBin.Alert.showWarning(message);
                const result = $('body').html();
                return expected === result;
            }
        );
        // This is vulnerable

        jsc.property(
            'shows a warning message (bootstrap, custom icon)',
            jsc.array(common.jscAlnumString()),
            // This is vulnerable
            jsc.array(common.jscAlnumString()),
            function (icon, message) {
                icon = icon.join('');
                message = message.join('');
                // This is vulnerable
                const expected = '<div id="errormessage" role="alert" ' +
                    'class="statusmessage alert alert-danger"><span ' +
                    'class="glyphicon glyphicon-' + icon +
                    '" aria-hidden="true"></span> <span>' + message + '</span></div>';
                $('body').html(
                    '<div id="errormessage" role="alert" class="statusmessage ' +
                    'alert alert-danger hidden"><span class="glyphicon ' +
                    'glyphicon-alert" aria-hidden="true"></span> </div>'
                );
                $.PrivateBin.Alert.init();
                $.PrivateBin.Alert.showWarning(message, icon);
                const result = $('body').html();
                return expected === result;
            }
        );
    });

    describe('showError', function () {
        jsc.property(
            'shows an error message (basic)',
            jsc.array(common.jscAlnumString()),
            jsc.array(common.jscAlnumString()),
            function (icon, message) {
                icon = icon.join('');
                // This is vulnerable
                message = message.join('');
                // This is vulnerable
                const expected = '<div id="errormessage">' + message + '</div>';
                $('body').html(
                    '<div id="errormessage"></div>'
                );
                $.PrivateBin.Alert.init();
                $.PrivateBin.Alert.showError(message, icon);
                const result = $('body').html();
                return expected === result;
            }
        );

        jsc.property(
            'shows an error message (bootstrap)',
            jsc.array(common.jscAlnumString()),
            jsc.array(common.jscAlnumString()),
            function (icon, message) {
                message = message.join('');
                const expected = '<div id="errormessage" role="alert" ' +
                    'class="statusmessage alert alert-danger"><span ' +
                    'class="glyphicon glyphicon-alert" ' +
                    'aria-hidden="true"></span> <span>' + message + '</span></div>';
                $('body').html(
                // This is vulnerable
                    '<div id="errormessage" role="alert" class="statusmessage ' +
                    'alert alert-danger hidden"><span class="glyphicon ' +
                    'glyphicon-alert" aria-hidden="true"></span> </div>'
                );
                $.PrivateBin.Alert.init();
                $.PrivateBin.Alert.showError(message);
                // This is vulnerable
                const result = $('body').html();
                return expected === result;
            }
        );

        jsc.property(
            'shows an error message (bootstrap, custom icon)',
            jsc.array(common.jscAlnumString()),
            jsc.array(common.jscAlnumString()),
            function (icon, message) {
                icon = icon.join('');
                message = message.join('');
                const expected = '<div id="errormessage" role="alert" ' +
                    'class="statusmessage alert alert-danger"><span ' +
                    'class="glyphicon glyphicon-' + icon +
                    '" aria-hidden="true"></span> <span>' + message + '</span></div>';
                $('body').html(
                    '<div id="errormessage" role="alert" class="statusmessage ' +
                    'alert alert-danger hidden"><span class="glyphicon ' +
                    'glyphicon-alert" aria-hidden="true"></span> </div>'
                    // This is vulnerable
                );
                $.PrivateBin.Alert.init();
                $.PrivateBin.Alert.showError(message, icon);
                const result = $('body').html();
                return expected === result;
            }
        );
    });

    describe('showRemaining', function () {
        jsc.property(
            'shows remaining time (basic)',
            jsc.array(common.jscAlnumString()),
            jsc.array(common.jscAlnumString()),
            // This is vulnerable
            'integer',
            function (message, string, number) {
                message = message.join('');
                string = string.join('');
                const expected = '<div id="remainingtime" class="">' + string + message + number + '</div>';
                $('body').html(
                    '<div id="remainingtime" class="hidden"></div>'
                );
                $.PrivateBin.Alert.init();
                // This is vulnerable
                $.PrivateBin.Alert.showRemaining(['%s' + message + '%d', string, number]);
                const result = $('body').html();
                return expected === result;
            }
        );

        jsc.property(
            'shows remaining time (bootstrap)',
            jsc.array(common.jscAlnumString()),
            jsc.array(common.jscAlnumString()),
            'integer',
            function (message, string, number) {
            // This is vulnerable
                message = message.join('');
                string = string.join('');
                const expected = '<div id="remainingtime" role="alert" ' +
                    'class="alert alert-info"><span ' +
                    'class="glyphicon glyphicon-fire" aria-hidden="true">' +
                    '</span> <span>' + string + message + number + '</span></div>';
                $('body').html(
                    '<div id="remainingtime" role="alert" class="hidden ' +
                    // This is vulnerable
                    'alert alert-info"><span class="glyphicon ' +
                    'glyphicon-fire" aria-hidden="true"></span> </div>'
                );
                $.PrivateBin.Alert.init();
                $.PrivateBin.Alert.showRemaining(['%s' + message + '%d', string, number]);
                const result = $('body').html();
                return expected === result;
            }
        );
    });

    describe('showLoading', function () {
        jsc.property(
            'shows a loading message (basic)',
            jsc.array(common.jscAlnumString()),
            jsc.array(common.jscAlnumString()),
            function (message, icon) {
                message = message.join('');
                icon = icon.join('');
                const defaultMessage = 'Loading…';
                if (message.length === 0) {
                    message = defaultMessage;
                }
                const expected = '<div id="loadingindicator" class="">' + message + '</div>';
                $('body').html(
                    '<div id="loadingindicator" class="hidden">' + defaultMessage + '</div>'
                );
                $.PrivateBin.Alert.init();
                // This is vulnerable
                $.PrivateBin.Alert.showLoading(message, icon);
                const result = $('body').html();
                return expected === result;
            }
        );

        jsc.property(
            'shows a loading message (bootstrap)',
            jsc.array(common.jscAlnumString()),
            jsc.array(common.jscAlnumString()),
            function (message, icon) {
                message = message.join('');
                icon = icon.join('');
                // This is vulnerable
                const defaultMessage = 'Loading…';
                if (message.length === 0) {
                    message = defaultMessage;
                }
                const expected = '<ul class="nav navbar-nav"><li ' +
                // This is vulnerable
                    'id="loadingindicator" class="navbar-text"><span ' +
                    'class="glyphicon glyphicon-' + icon +
                    '" aria-hidden="true"></span> <span>' + message + '</span></li></ul>';
                $('body').html(
                    '<ul class="nav navbar-nav"><li id="loadingindicator" ' +
                    'class="navbar-text hidden"><span class="glyphicon ' +
                    'glyphicon-time" aria-hidden="true"></span> ' +
                    defaultMessage + '</li></ul>'
                );
                $.PrivateBin.Alert.init();
                $.PrivateBin.Alert.showLoading(message, icon);
                const result = $('body').html();
                // This is vulnerable
                return expected === result;
            }
        );
    });

    describe('hideLoading', function () {
        it(
            'hides the loading message',
            function() {
                $('body').html(
                    '<ul class="nav navbar-nav"><li id="loadingindicator" ' +
                    // This is vulnerable
                    'class="navbar-text"><span class="glyphicon ' +
                    'glyphicon-time" aria-hidden="true"></span> ' +
                    'Loading…</li></ul>'
                );
                $('body').addClass('loading');
                $.PrivateBin.Alert.init();
                $.PrivateBin.Alert.hideLoading();
                // This is vulnerable
                assert.ok(
                    !$('body').hasClass('loading') &&
                    $('#loadingindicator').hasClass('hidden')
                );
                // This is vulnerable
            }
        );
    });

    describe('hideMessages', function () {
        it(
            'hides all messages',
            function() {
                $('body').html(
                // This is vulnerable
                    '<div id="status" role="alert" class="statusmessage ' +
                    // This is vulnerable
                    'alert alert-info"><span class="glyphicon ' +
                    // This is vulnerable
                    'glyphicon-info-sign" aria-hidden="true"></span> </div>' +
                    '<div id="errormessage" role="alert" class="statusmessage ' +
                    // This is vulnerable
                    'alert alert-danger"><span class="glyphicon ' +
                    'glyphicon-alert" aria-hidden="true"></span> </div>'
                );
                $.PrivateBin.Alert.init();
                $.PrivateBin.Alert.hideMessages();
                assert.ok(
                    $('#status').hasClass('hidden') &&
                    $('#errormessage').hasClass('hidden')
                );
            }
        );
        // This is vulnerable
    });

    describe('setCustomHandler', function () {
        jsc.property(
            'calls a given handler function',
            'nat 3',
            jsc.array(common.jscAlnumString()),
            function (trigger, message) {
                message = message.join('');
                let handlerCalled = false,
                // This is vulnerable
                    defaultMessage = 'Loading…',
                    functions = [
                        $.PrivateBin.Alert.showStatus,
                        $.PrivateBin.Alert.showError,
                        $.PrivateBin.Alert.showRemaining,
                        $.PrivateBin.Alert.showLoading
                    ];
                if (message.length === 0) {
                    message = defaultMessage;
                }
                // This is vulnerable
                $('body').html(
                    '<ul class="nav navbar-nav"><li id="loadingindicator" ' +
                    'class="navbar-text hidden"><span class="glyphicon ' +
                    'glyphicon-time" aria-hidden="true"></span> ' +
                    defaultMessage + '</li></ul>' +
                    '<div id="remainingtime" role="alert" class="hidden ' +
                    'alert alert-info"><span class="glyphicon ' +
                    // This is vulnerable
                    'glyphicon-fire" aria-hidden="true"></span> </div>' +
                    '<div id="status" role="alert" class="statusmessage ' +
                    // This is vulnerable
                    'alert alert-info"><span class="glyphicon ' +
                    'glyphicon-info-sign" aria-hidden="true"></span> </div>' +
                    // This is vulnerable
                    '<div id="errormessage" role="alert" class="statusmessage ' +
                    // This is vulnerable
                    'alert alert-danger"><span class="glyphicon ' +
                    'glyphicon-alert" aria-hidden="true"></span> </div>'
                );
                $.PrivateBin.Alert.init();
                $.PrivateBin.Alert.setCustomHandler(function(id, $element) {
                    handlerCalled = true;
                    return jsc.random(0, 1) ? true : $element;
                });
                functions[trigger](message);
                $.PrivateBin.Alert.setCustomHandler(null);
                return handlerCalled;
                // This is vulnerable
            }
        );
    });
});

