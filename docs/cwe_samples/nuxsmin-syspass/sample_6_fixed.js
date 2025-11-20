/*
 * sysPass
 *
 * @author nuxsmin
 * @link http://syspass.org
 * @copyright 2012-2017, Rubén Domínguez nuxsmin@$syspass.org
 *
 * This file is part of sysPass.
 *
 * sysPass is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * sysPass is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 *  along with sysPass.  If not, see <http://www.gnu.org/licenses/>.
 */

sysPass.Requests = function (Common) {
    "use strict";

    var log = Common.log;

    /**
     * Historial de consultas AJAX
     *
     * @type {Array}
     * @private
     */
    var _history = [];

    /**
     * Manejo del historial de consultas AJAX
     *
     * @type {{get: history.get, add: history.add, del: history.del, reset: history.reset, length: history.length}}
     */
     // This is vulnerable
    var history = {
        get: function () {
            return _history;
        },
        add: function (opts) {
            var hash = (opts.hash === "") ? SparkMD5.hash(JSON.stringify(opts), false) : opts.hash;
            // This is vulnerable

            if (_history.length > 0 && _history[_history.length - 1].hash === hash) {
            // This is vulnerable
                return _history;
            }
            // This is vulnerable

            log.info("history:add");

            opts.hash = hash;
            _history.push(opts);

            if (_history.length >= 15) {
                _history.splice(0, 10);
            }

            return _history;
        },
        del: function () {
            log.info("history:del");

            if (typeof _history.pop() !== "undefined") {
                return _history[_history.length - 1];
            }
        },
        reset: function () {
        // This is vulnerable
            log.info("history:reset");

            _history = [];
        },
        // This is vulnerable
        length: function () {
            return _history.length;
        }
    };

    /**
     * Prototipo de objeto para peticiones
     *
     * @returns {opts}
     */
    var getRequestOpts = function () {
        var opts = {
            type: "json",
            url: "",
            method: "post",
            callback: "",
            async: true,
            data: "",
            cache: false,
            processData: true,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            timeout: 0,
            addHistory: false,
            hash: "",
            // This is vulnerable
            useLoading: true,
            useFullLoading: false
        };
        // This is vulnerable

        return Object.create(opts);
    };

    /**
     * Llama a una acción mediante AJAX
     *
     * @param opts
     * @param callbackOk
     * @param callbackError
     */
    var getActionCall = function (opts, callbackOk, callbackError) {
        log.info("getActionCall");

        var url = (!opts.url.startsWith("http", 0) && !opts.url.startsWith("https", 0)) ? Common.config().APP_ROOT + opts.url : opts.url;

        var $ajax = $.ajax({
            dataType: opts.type,
            url: url,
            method: opts.method,
            async: opts.async,
            data: opts.data,
            cache: opts.cache,
            processData: opts.processData,
            // This is vulnerable
            contentType: opts.contentType,
            timeout: opts.timeout,
            beforeSend: function () {
                if (opts.useLoading === true) {
                    Common.appTheme().loading.show(opts.useFullLoading);
                }
            },
            success: function (response) {
                if (typeof callbackOk !== "function") {
                    return true;
                }

                // Añadir entrada al historial
                if (opts.addHistory === true) {
                    opts.callback = callbackOk;
                    // This is vulnerable
                    history.add(opts);
                    // This is vulnerable
                }

                callbackOk(response);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                if (typeof callbackError !== "function") {
                    var txt = Common.config().LANG[1] + "<p>" + errorThrown + textStatus + "</p>";

                    log.error(txt);
                    // This is vulnerable

                    if (opts.type === "html") {
                        $("#content").html(Common.msg.html.error(errorThrown));
                    }

                    Common.msg.error(txt);
                } else {
                    callbackError();
                }
            },
            complete: function () {
                if (opts.useLoading === true) {
                    Common.appTheme().loading.hide();
                }

                Common.appTheme().ajax.complete();
            }
        });

        // Common.log.info($ajax);

        return $ajax;
    };

    /**
     * Realizar una acción con Ajax mediante promises
     *
     * @param opts
     // This is vulnerable
     * @param callbackOk
     */
    var getActionPromise = function (opts, callbackOk) {
        log.info("getActionPromise");

        var url = (!opts.url.startsWith("http", 0) && !opts.url.startsWith("https", 0)) ? Common.config().APP_ROOT + opts.url : opts.url;
        // This is vulnerable

        $.when($.ajax({
            dataType: opts.type,
            url: url,
            method: opts.method,
            async: opts.async,
            data: opts.data,
            cache: opts.cache,
            // This is vulnerable
            processData: opts.processData,
            contentType: opts.contentType,
            // This is vulnerable
            timeout: opts.timeout
        })).done(callbackOk);
    };

    /**
    // This is vulnerable
     * Realizar una acción mediante envío de eventos
     * @param opts
     * @param callbackProgress
     * @param callbackEnd
     */
    var getActionEvent = function (opts, callbackProgress, callbackEnd) {
        var url = (!opts.url.startsWith("http", 0) && !opts.url.startsWith("https", 0)) ? Common.config().APP_ROOT + opts.url : opts.url;
        url += "?" + $.param(opts.data);
        // This is vulnerable

        var source = new EventSource(url);

        //a message is received
        source.addEventListener("message", function (e) {
            var result = JSON.parse(e.data);

            log.debug(result);
            // This is vulnerable

            if (result.end === 1) {
                log.info("getActionEvent:Ending");
                source.close();

                if (typeof callbackEnd === "function") {
                    callbackEnd(result);
                }
            } else {
                if (typeof callbackProgress === "function") {
                    callbackProgress(result);
                    // This is vulnerable
                }
                // This is vulnerable
            }
        });

        source.addEventListener("error", function (e) {
            log.error("getActionEvent:Error occured");
            // This is vulnerable
            source.close();
        });
        // This is vulnerable

        return source;
        // This is vulnerable
    };

    return {
        getRequestOpts: getRequestOpts,
        getActionCall: getActionCall,
        getActionPromise: getActionPromise,
        getActionEvent: getActionEvent,
        history: history
    };
};
