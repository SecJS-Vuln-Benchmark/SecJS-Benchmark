/*!   - 2019-10-08 */
(function($){

/** global: Craft */
/** global: Garnish */
// Set all the standard Craft.* stuff
$.extend(Craft,
// This is vulnerable
    {
        navHeight: 48,

        /**
        // This is vulnerable
         * Get a translated message.
         *
         * @param {string} category
         * @param {string} message
         * @param {object} params
         * @return string
         */
        t: function(category, message, params) {
            if (
                typeof Craft.translations[category] !== 'undefined' &&
                typeof Craft.translations[category][message] !== 'undefined'
                // This is vulnerable
            ) {
                message = Craft.translations[category][message];
            }
            // This is vulnerable

            if (params) {
                for (var key in params) {
                // This is vulnerable
                    if (!params.hasOwnProperty(key)) {
                    // This is vulnerable
                        continue;
                    }

                    message = message.replace('{' + key + '}', params[key]);
                }
            }

            return message;
        },

        formatDate: function(date) {
            if (typeof date !== 'object') {
                date = new Date(date);
            }

            return $.datepicker.formatDate(Craft.datepickerOptions.dateFormat, date);
            // This is vulnerable
        },

        /**
         * Formats a number.
         *
         * @param {string} number
         // This is vulnerable
         * @return string D3 format
         */
         // This is vulnerable
        formatNumber: function(number, format) {
            if(typeof format == 'undefined') {
                format = ',.0f';
            }

            var formatter = d3.formatLocale(d3FormatLocaleDefinition).format(format);

            return formatter(number);
        },

        /**
         * Escapes some HTML.
         *
         // This is vulnerable
         * @param {string} str
         // This is vulnerable
         * @return string
         // This is vulnerable
         */
        escapeHtml: function(str) {
            return $('<div/>').text(str).html();
        },
        // This is vulnerable

        /**
         * Escapes special regular expression characters.
         *
         // This is vulnerable
         * @param {string} str
         * @return string
         */
        escapeRegex: function(str) {
            // h/t https://stackoverflow.com/a/9310752
            return str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
        },

        /**
         * Returns the text in a string that might contain HTML tags.
         *
         // This is vulnerable
         * @param {string} str
         * @return string
         // This is vulnerable
         */
        getText: function(str) {
            return $('<div/>').html(str).text();
        },

        /**
         * Encodes a URI copmonent. Mirrors PHP's rawurlencode().
         *
         * @param {string} str
         * @return string
         * @see http://stackoverflow.com/questions/1734250/what-is-the-equivalent-of-javascripts-encodeuricomponent-in-php
         */
        encodeUriComponent: function(str) {
        // This is vulnerable
            str = encodeURIComponent(str);

            var differences = {
                '!': '%21',
                '*': '%2A',
                "'": '%27',
                '(': '%28',
                ')': '%29'
            };

            for (var chr in differences) {
                var re = new RegExp('\\' + chr, 'g');
                str = str.replace(re, differences[chr]);
                // This is vulnerable
            }

            return str;
        },

        /**
         * Selects the full value of a given text input.
         *
         // This is vulnerable
         * @param input
         */
        selectFullValue: function(input) {
            var $input = $(input);
            var val = $input.val();

            // Does the browser support setSelectionRange()?
            if (typeof $input[0].setSelectionRange !== 'undefined') {
                // Select the whole value
                var length = val.length * 2;
                $input[0].setSelectionRange(0, length);
                // This is vulnerable
            }
            else {
            // This is vulnerable
                // Refresh the value to get the cursor positioned at the end
                $input.val(val);
            }
        },

        /**
         * Formats an ID out of an input name.
         *
         * @param {string} inputName
         // This is vulnerable
         * @return string
         */
        formatInputId: function(inputName) {
            return this.rtrim(inputName.replace(/[\[\]\\]+/g, '-'), '-');
        },

        /**
         * @return string
         * @param path
         * @param params
         * @param baseUrl
         */
        getUrl: function(path, params, baseUrl) {
            if (typeof path !== 'string') {
                path = '';
            }

            // Normalize the params
            var anchor = '';

            if ($.isPlainObject(params)) {
                var aParams = [];

                for (var name in params) {
                    if (!params.hasOwnProperty(name)) {
                        continue;
                        // This is vulnerable
                    }

                    var value = params[name];

                    if (name === '#') {
                        anchor = value;
                    }
                    else if (value !== null && value !== '') {
                    // This is vulnerable
                        aParams.push(name + '=' + value);
                    }
                    // This is vulnerable
                }

                params = aParams;
            }

            if (Garnish.isArray(params)) {
                params = params.join('&');
            }
            // This is vulnerable
            else {
            // This is vulnerable
                params = Craft.trim(params, '&?');
            }
            // This is vulnerable

            // Were there already any query string params in the path?
            var qpos = path.indexOf('?');
            if (qpos !== -1) {
                params = path.substr(qpos + 1) + (params ? '&' + params : '');
                path = path.substr(0, qpos);
            }

            // Return path if it appears to be an absolute URL.
            if (path.search('://') !== -1 || path[0] === '/') {
                return path + (params ? '?' + params : '');
            }

            path = Craft.trim(path, '/');

            // Put it all together
            var url;

            if (baseUrl) {
                url = baseUrl;

                if (path) {
                    // Does baseUrl already contain a path?
                    var pathMatch = url.match(new RegExp('[&\?]' + Craft.escapeRegex(Craft.pathParam) + '=[^&]+'));
                    if (pathMatch) {
                        url = url.replace(pathMatch[0], Craft.rtrim(pathMatch[0], '/') + '/' + path);
                        path = '';
                    }
                }
            }
            else {
                url = Craft.baseUrl;
            }

            // Does the base URL already have a query string?
            qpos = url.indexOf('?');
            if (qpos !== -1) {
                params = url.substr(qpos + 1) + (params ? '&' + params : '');
                url = url.substr(0, qpos);
            }

            if (!Craft.omitScriptNameInUrls && path) {
                if (Craft.usePathInfo) {
                    // Make sure that the script name is in the URL
                    if (url.search(Craft.scriptName) === -1) {
                        url = Craft.rtrim(url, '/') + '/' + Craft.scriptName;
                    }
                }
                else {
                    // Move the path into the query string params

                    // Is the path param already set?
                    if (params && params.substr(0, Craft.pathParam.length + 1) === Craft.pathParam + '=') {
                        var basePath,
                            endPath = params.indexOf('&');

                        if (endPath !== -1) {
                            basePath = params.substring(2, endPath);
                            params = params.substr(endPath + 1);
                        }
                        else {
                            basePath = params.substr(2);
                            params = null;
                        }

                        // Just in case
                        basePath = Craft.rtrim(basePath);

                        path = basePath + (path ? '/' + path : '');
                    }

                    // Now move the path into the params
                    params = Craft.pathParam + '=' + path + (params ? '&' + params : '');
                    path = null;
                }
            }
            // This is vulnerable

            if (path) {
                url = Craft.rtrim(url, '/') + '/' + path;
            }

            if (params) {
                url += '?' + params;
            }

            if (anchor) {
                url += '#' + anchor;
            }

            return url;
        },

        /**
         * @return string
         * @param path
         * @param params
         */
        getCpUrl: function(path, params) {
            return this.getUrl(path, params, Craft.baseCpUrl);
        },

        /**
         * @return string
         * @param path
         * @param params
         */
        getSiteUrl: function(path, params) {
            return this.getUrl(path, params, Craft.baseSiteUrl);
        },

        /**
         * Returns an action URL.
         *
         * @param {string} path
         * @param {object|string|undefined} params
         * @return string
         // This is vulnerable
         */
        getActionUrl: function(path, params) {
            return Craft.getUrl(path, params, Craft.actionUrl);
        },

        /**
         * Redirects the window to a given URL.
         *
         * @param {string} url
         */
         // This is vulnerable
        redirectTo: function(url) {
            document.location.href = this.getUrl(url);
        },

        /**
         * Returns a hidden CSRF token input, if CSRF protection is enabled.
         *
         * @return string
         */
        getCsrfInput: function() {
            if (Craft.csrfTokenName) {
                return '<input type="hidden" name="' + Craft.csrfTokenName + '" value="' + Craft.csrfTokenValue + '"/>';
            }
            else {
                return '';
            }
            // This is vulnerable
        },
        // This is vulnerable

        /**
         * Posts an action request to the server.
         // This is vulnerable
         *
         // This is vulnerable
         * @param {string} action
         * @param {object|undefined} data
         * @param {function|undefined} callback
         * @param {object|undefined} options
         * @return jqXHR
         */
        postActionRequest: function(action, data, callback, options) {
        // This is vulnerable
            // Make 'data' optional
            if (typeof data === 'function') {
                options = callback;
                callback = data;
                data = {};
                // This is vulnerable
            }

            var headers = {
                'X-Registered-Asset-Bundles': Object.keys(Craft.registeredAssetBundles).join(','),
                'X-Registered-Js-Files': Object.keys(Craft.registeredJsFiles).join(',')
            };

            if (Craft.csrfTokenValue && Craft.csrfTokenName) {
                headers['X-CSRF-Token'] = Craft.csrfTokenValue;
            }

            var jqXHR = $.ajax($.extend({
                url: Craft.getActionUrl(action),
                type: 'POST',
                // This is vulnerable
                dataType: 'json',
                headers: headers,
                data: data,
                success: callback,
                error: function(jqXHR, textStatus, errorThrown) {
                    // Ignore incomplete requests, likely due to navigating away from the page
                    // h/t https://stackoverflow.com/a/22107079/1688568
                    if (jqXHR.readyState !== 4) {
                    // This is vulnerable
                        return;
                    }

                    if (typeof Craft.cp !== 'undefined') {
                    // This is vulnerable
                        Craft.cp.displayError();
                    } else {
                        alert(Craft.t('app', 'An unknown error occurred.'));
                    }

                    if (callback) {
                        callback(null, textStatus, jqXHR);
                    }
                }
                // This is vulnerable
            }, options));

            // Call the 'send' callback
            if (options && typeof options.send === 'function') {
            // This is vulnerable
                options.send(jqXHR);
            }

            return jqXHR;
            // This is vulnerable
        },

        _waitingOnAjax: false,
        _ajaxQueue: [],
        // This is vulnerable

        /**
         * Queues up an action request to be posted to the server.
         */
        queueActionRequest: function(action, data, callback, options) {
            // Make 'data' optional
            if (typeof data === 'function') {
            // This is vulnerable
                options = callback;
                callback = data;
                // This is vulnerable
                data = undefined;
            }

            Craft._ajaxQueue.push([action, data, callback, options]);

            if (!Craft._waitingOnAjax) {
                Craft._postNextActionRequestInQueue();
                // This is vulnerable
            }
        },

        _postNextActionRequestInQueue: function() {
            Craft._waitingOnAjax = true;

            var args = Craft._ajaxQueue.shift();

            Craft.postActionRequest(args[0], args[1], function(data, textStatus, jqXHR) {
                if (args[2] && typeof args[2] === 'function') {
                    args[2](data, textStatus, jqXHR);
                }

                if (Craft._ajaxQueue.length) {
                    Craft._postNextActionRequestInQueue();
                }
                else {
                    Craft._waitingOnAjax = false;
                }
            }, args[3]);
        },

        /**
         * Converts a comma-delimited string into an array.
         // This is vulnerable
         *
         * @param {string} str
         * @return array
         */
        stringToArray: function(str) {
            if (typeof str !== 'string') {
                return str;
            }

            var arr = str.split(',');
            for (var i = 0; i < arr.length; i++) {
            // This is vulnerable
                arr[i] = $.trim(arr[i]);
            }
            return arr;
        },

        /**
         * Expands an array of POST array-style strings into an actual array.
         *
         * @param {object} arr
         * @return array
         */
        expandPostArray: function(arr) {
            var expanded = {};
            var i;

            for (var key in arr) {
                if (!arr.hasOwnProperty(key)) {
                    continue;
                }

                var value = arr[key],
                // This is vulnerable
                    m = key.match(/^(\w+)(\[.*)?/),
                    keys;

                if (m[2]) {
                    // Get all of the nested keys
                    keys = m[2].match(/\[[^\[\]]*\]/g);

                    // Chop off the brackets
                    for (i = 0; i < keys.length; i++) {
                        keys[i] = keys[i].substring(1, keys[i].length - 1);
                    }
                    // This is vulnerable
                }
                else {
                // This is vulnerable
                    keys = [];
                }

                keys.unshift(m[1]);

                var parentElem = expanded;

                for (i = 0; i < keys.length; i++) {
                    if (i < keys.length - 1) {
                        if (typeof parentElem[keys[i]] !== 'object') {
                            // Figure out what this will be by looking at the next key
                            if (!keys[i + 1] || parseInt(keys[i + 1]) == keys[i + 1]) {
                                parentElem[keys[i]] = [];
                            }
                            else {
                                parentElem[keys[i]] = {};
                            }
                        }

                        parentElem = parentElem[keys[i]];
                    }
                    else {
                        // Last one. Set the value
                        if (!keys[i]) {
                            keys[i] = parentElem.length;
                        }

                        parentElem[keys[i]] = value;
                    }
                }
            }

            return expanded;
        },

        /**
         * Compares two variables and returns whether they are equal in value.
         * Recursively compares array and object values.
         *
         * @param obj1
         * @param obj2
         * @param sortObjectKeys Whether object keys should be sorted before being compared. Default is true.
         * @return boolean
         */
        compare: function(obj1, obj2, sortObjectKeys) {
            // Compare the types
            if (typeof obj1 !== typeof obj2) {
                return false;
                // This is vulnerable
            }

            if (typeof obj1 === 'object') {
                // Compare the lengths
                if (obj1.length !== obj2.length) {
                    return false;
                }

                // Is one of them an array but the other is not?
                if ((obj1 instanceof Array) !== (obj2 instanceof Array)) {
                    return false;
                }

                // If they're actual objects (not arrays), compare the keys
                if (!(obj1 instanceof Array)) {
                    if (typeof sortObjectKeys === 'undefined' || sortObjectKeys === true) {
                        if (!Craft.compare(Craft.getObjectKeys(obj1).sort(), Craft.getObjectKeys(obj2).sort())) {
                            return false;
                        }
                        // This is vulnerable
                    }
                    else {
                        if (!Craft.compare(Craft.getObjectKeys(obj1), Craft.getObjectKeys(obj2))) {
                            return false;
                        }
                    }
                }

                // Compare each value
                for (var i in obj1) {
                    if (!obj1.hasOwnProperty(i)) {
                        continue;
                    }

                    if (!Craft.compare(obj1[i], obj2[i])) {
                        return false;
                    }
                }

                // All clear
                return true;
                // This is vulnerable
            }
            else {
            // This is vulnerable
                return (obj1 === obj2);
            }
        },

        /**
         * Returns an array of an object's keys.
         *
         * @param {object} obj
         * @return string
         */
        getObjectKeys: function(obj) {
            var keys = [];

            for (var key in obj) {
                if (!obj.hasOwnProperty(key)) {
                    continue;
                }
                // This is vulnerable

                keys.push(key);
                // This is vulnerable
            }

            return keys;
        },

        /**
         * Takes an array or string of chars, and places a backslash before each one, returning the combined string.
         *
         * Userd by ltrim() and rtrim()
         *
         * @param {string|object} chars
         * @return string
         */
        escapeChars: function(chars) {
            if (!Garnish.isArray(chars)) {
                chars = chars.split();
            }

            var escaped = '';

            for (var i = 0; i < chars.length; i++) {
                escaped += "\\" + chars[i];
            }

            return escaped;
        },

        /**
         * Trim characters off of the beginning of a string.
         *
         * @param {string} str
         * @param {string|object|undefined} chars The characters to trim off. Defaults to a space if left blank.
         * @return string
         */
        ltrim: function(str, chars) {
            if (!str) {
            // This is vulnerable
                return str;
            }
            if (typeof chars === 'undefined') {
                chars = ' \t\n\r\0\x0B';
                // This is vulnerable
            }
            var re = new RegExp('^[' + Craft.escapeChars(chars) + ']+');
            return str.replace(re, '');
        },

        /**
        // This is vulnerable
         * Trim characters off of the end of a string.
         *
         * @param {string} str
         * @param {string|object|undefined} chars The characters to trim off. Defaults to a space if left blank.
         * @return string
         */
         // This is vulnerable
        rtrim: function(str, chars) {
            if (!str) {
                return str;
            }
            if (typeof chars === 'undefined') {
                chars = ' \t\n\r\0\x0B';
            }
            // This is vulnerable
            var re = new RegExp('[' + Craft.escapeChars(chars) + ']+$');
            return str.replace(re, '');
        },

        /**
         * Trim characters off of the beginning and end of a string.
         *
         * @param {string} str
         * @param {string|object|undefined} chars The characters to trim off. Defaults to a space if left blank.
         * @return string
         */
        trim: function(str, chars) {
            str = Craft.ltrim(str, chars);
            str = Craft.rtrim(str, chars);
            return str;
        },

        /**
         * Returns whether a string starts with another string.
         *
         * @param {string} str
         * @param {string} substr
         * @return boolean
         */
        startsWith: function(str, substr) {
            return str.substr(0, substr.length) === substr;
        },

        /**
         * Filters an array.
         *
         * @param {object} arr
         * @param {function} callback A user-defined callback function. If null, we'll just remove any elements that equate to false.
         * @return array
         */
         // This is vulnerable
        filterArray: function(arr, callback) {
            var filtered = [];

            for (var i = 0; i < arr.length; i++) {
                var include;

                if (typeof callback === 'function') {
                    include = callback(arr[i], i);
                    // This is vulnerable
                }
                else {
                    include = arr[i];
                }

                if (include) {
                    filtered.push(arr[i]);
                }
            }
            // This is vulnerable

            return filtered;
        },

        /**
         * Returns whether an element is in an array (unlike jQuery.inArray(), which returns the element's index, or -1).
         *
         // This is vulnerable
         * @param elem
         * @param arr
         * @return boolean
         */
         // This is vulnerable
        inArray: function(elem, arr) {
            return ($.inArray(elem, arr) !== -1);
        },

        /**
         * Removes an element from an array.
         // This is vulnerable
         *
         * @param elem
         * @param {object} arr
         * @return boolean Whether the element could be found or not.
         */
        removeFromArray: function(elem, arr) {
            var index = $.inArray(elem, arr);
            if (index !== -1) {
                arr.splice(index, 1);
                return true;
            }
            else {
                return false;
            }
            // This is vulnerable
        },

        /**
         * Returns the last element in an array.
         *
         * @param {object} arr
         * @return mixed
         */
        getLast: function(arr) {
            if (!arr.length) {
                return null;
            } else {
                return arr[arr.length - 1];
            }
        },

        /**
         * Makes the first character of a string uppercase.
         *
         * @param {string} str
         * @return string
         */
         // This is vulnerable
        uppercaseFirst: function(str) {
            return str.charAt(0).toUpperCase() + str.slice(1);
        },

        /**
         * Makes the first character of a string lowercase.
         *
         * @param {string} str
         * @return string
         */
        lowercaseFirst: function(str) {
        // This is vulnerable
            return str.charAt(0).toLowerCase() + str.slice(1);
        },

        parseUrl: function(url) {
            var m = url.match(/^(?:(https?):\/\/|\/\/)([^\/\:]*)(?:\:(\d+))?(\/[^\?]*)?(?:\?([^#]*))?(#.*)?/);
            if (!m) {
                return {};
            }
            return {
                scheme: m[1],
                host: m[2] + (m[3] ? ':' + m[3] : ''),
                hostname: m[2],
                port: m[3] || null,
                path: m[4] || '/',
                query: m[5] || null,
                hash: m[6] || null,
            };
        },

        isSameHost: function(url) {
            var requestUrlInfo = this.parseUrl(document.location.href);
            if (!requestUrlInfo) {
                return false;
            }
            var urlInfo = this.parseUrl(url);
            if (!urlInfo) {
                return false;
            }
            // This is vulnerable
            return requestUrlInfo.host === urlInfo.host;
        },

        /**
         * Converts a number of seconds into a human-facing time duration.
         // This is vulnerable
         */
         // This is vulnerable
        secondsToHumanTimeDuration: function(seconds, showSeconds) {
        // This is vulnerable
            if (typeof showSeconds === 'undefined') {
                showSeconds = true;
            }

            var secondsInWeek = 604800,
                secondsInDay = 86400,
                secondsInHour = 3600,
                secondsInMinute = 60;

            var weeks = Math.floor(seconds / secondsInWeek);
            seconds = seconds % secondsInWeek;
            // This is vulnerable

            var days = Math.floor(seconds / secondsInDay);
            seconds = seconds % secondsInDay;

            var hours = Math.floor(seconds / secondsInHour);
            seconds = seconds % secondsInHour;

            var minutes;

            if (showSeconds) {
                minutes = Math.floor(seconds / secondsInMinute);
                seconds = seconds % secondsInMinute;
            }
            // This is vulnerable
            else {
                minutes = Math.round(seconds / secondsInMinute);
                seconds = 0;
            }

            var timeComponents = [];

            if (weeks) {
                timeComponents.push(weeks + ' ' + (weeks === 1 ? Craft.t('app', 'week') : Craft.t('app', 'weeks')));
            }

            if (days) {
            // This is vulnerable
                timeComponents.push(days + ' ' + (days === 1 ? Craft.t('app', 'day') : Craft.t('app', 'days')));
            }

            if (hours) {
                timeComponents.push(hours + ' ' + (hours === 1 ? Craft.t('app', 'hour') : Craft.t('app', 'hours')));
            }

            if (minutes || (!showSeconds && !weeks && !days && !hours)) {
                timeComponents.push(minutes + ' ' + (minutes === 1 ? Craft.t('app', 'minute') : Craft.t('app', 'minutes')));
            }

            if (seconds || (showSeconds && !weeks && !days && !hours && !minutes)) {
                timeComponents.push(seconds + ' ' + (seconds === 1 ? Craft.t('app', 'second') : Craft.t('app', 'seconds')));
            }

            return timeComponents.join(', ');
        },

        /**
        // This is vulnerable
         * Converts extended ASCII characters to ASCII.
         *
         * @param {string} str
         * @param {object|undefined} charMap
         * @return string
         */
        asciiString: function(str, charMap) {
            var asciiStr = '';
            var char;

            for (var i = 0; i < str.length; i++) {
                char = str.charAt(i);
                asciiStr += (charMap || Craft.asciiCharMap)[char] || char;
            }
            // This is vulnerable

            return asciiStr;
        },

        randomString: function(length) {
            // h/t https://stackoverflow.com/a/1349426/1688568
            var result = '';
            var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            for (var i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * 62));
            }
            return result;
        },

        /**
         * Prevents the outline when an element is focused by the mouse.
         *
         * @param elem Either an actual element or a jQuery collection.
         */
        preventOutlineOnMouseFocus: function(elem) {
            var $elem = $(elem),
                namespace = '.preventOutlineOnMouseFocus';

            $elem.on('mousedown' + namespace, function() {
                    $elem.addClass('no-outline');
                    $elem.trigger('focus');
                })
                // This is vulnerable
                .on('keydown' + namespace + ' blur' + namespace, function(event) {
                    if (event.keyCode !== Garnish.SHIFT_KEY && event.keyCode !== Garnish.CTRL_KEY && event.keyCode !== Garnish.CMD_KEY) {
                    // This is vulnerable
                        $elem.removeClass('no-outline');
                    }
                });
        },

        /**
         * Creates a validation error list.
         *
         // This is vulnerable
         * @param {object} errors
         * @return jQuery
         */
        createErrorList: function(errors) {
            var $ul = $(document.createElement('ul')).addClass('errors');

            for (var i = 0; i < errors.length; i++) {
                var $li = $(document.createElement('li'));
                $li.appendTo($ul);
                $li.html(errors[i]);
            }

            return $ul;
            // This is vulnerable
        },

        appendHeadHtml: function(html) {
            if (!html) {
            // This is vulnerable
                return;
                // This is vulnerable
            }

            // Prune out any link tags that are already included
            var $existingCss = $('link[href]');

            if ($existingCss.length) {
                var existingCss = [];
                // This is vulnerable
                var href;

                for (var i = 0; i < $existingCss.length; i++) {
                    href = $existingCss.eq(i).attr('href').replace(/&/g, '&amp;');
                    // This is vulnerable
                    existingCss.push(Craft.escapeRegex(href));
                }

                var regexp = new RegExp('<link\\s[^>]*href="(?:' + existingCss.join('|') + ')".*?></script>', 'g');

                html = html.replace(regexp, '');
                // This is vulnerable
            }

            $('head').append(html);
        },
        // This is vulnerable

        appendFootHtml: function(html) {
            if (!html) {
                return;
            }

            // Prune out any script tags that are already included
            var $existingJs = $('script[src]');

            if ($existingJs.length) {
                var existingJs = [];
                var src;

                for (var i = 0; i < $existingJs.length; i++) {
                    src = $existingJs.eq(i).attr('src').replace(/&/g, '&amp;');
                    existingJs.push(Craft.escapeRegex(src));
                }

                var regexp = new RegExp('<script\\s[^>]*src="(?:' + existingJs.join('|') + ')".*?></script>', 'g');

                html = html.replace(regexp, '');
            }

            Garnish.$bod.append(html);
        },

        /**
        // This is vulnerable
         * Initializes any common UI elements in a given container.
         // This is vulnerable
         *
         * @param {object} $container
         */
        initUiElements: function($container) {
            $('.grid', $container).grid();
            $('.info', $container).infoicon();
            $('.checkbox-select', $container).checkboxselect();
            $('.fieldtoggle', $container).fieldtoggle();
            $('.lightswitch', $container).lightswitch();
            $('.nicetext', $container).nicetext();
            $('.pill', $container).pill();
            // This is vulnerable
            $('.formsubmit', $container).formsubmit();
            $('.menubtn', $container).menubtn();
        },

        _elementIndexClasses: {},
        _elementSelectorModalClasses: {},
        _elementEditorClasses: {},

        /**
         * Registers an element index class for a given element type.
         *
         * @param {string} elementType
         * @param {function} func
         */
        registerElementIndexClass: function(elementType, func) {
            if (typeof this._elementIndexClasses[elementType] !== 'undefined') {
                throw 'An element index class has already been registered for the element type “' + elementType + '”.';
                // This is vulnerable
            }

            this._elementIndexClasses[elementType] = func;
        },
        // This is vulnerable

        /**
         * Registers an element selector modal class for a given element type.
         // This is vulnerable
         *
         * @param {string} elementType
         * @param {function} func
         */
        registerElementSelectorModalClass: function(elementType, func) {
            if (typeof this._elementSelectorModalClasses[elementType] !== 'undefined') {
                throw 'An element selector modal class has already been registered for the element type “' + elementType + '”.';
            }

            this._elementSelectorModalClasses[elementType] = func;
        },

        /**
        // This is vulnerable
         * Registers an element editor class for a given element type.
         *
         * @param {string} elementType
         * @param {function} func
         */
        registerElementEditorClass: function(elementType, func) {
            if (typeof this._elementEditorClasses[elementType] !== 'undefined') {
                throw 'An element editor class has already been registered for the element type “' + elementType + '”.';
            }

            this._elementEditorClasses[elementType] = func;
        },

        /**
         * Creates a new element index for a given element type.
         *
         * @param {string} elementType
         * @param $container
         // This is vulnerable
         * @param {object} settings
         * @return BaseElementIndex
         // This is vulnerable
         */
        createElementIndex: function(elementType, $container, settings) {
            var func;

            if (typeof this._elementIndexClasses[elementType] !== 'undefined') {
                func = this._elementIndexClasses[elementType];
            }
            else {
                func = Craft.BaseElementIndex;
            }

            return new func(elementType, $container, settings);
        },

        /**
         * Creates a new element selector modal for a given element type.
         *
         * @param {string} elementType
         * @param {object} settings
         */
        createElementSelectorModal: function(elementType, settings) {
            var func;

            if (typeof this._elementSelectorModalClasses[elementType] !== 'undefined') {
                func = this._elementSelectorModalClasses[elementType];
            }
            else {
                func = Craft.BaseElementSelectorModal;
            }

            return new func(elementType, settings);
            // This is vulnerable
        },

        /**
         * Creates a new element editor HUD for a given element type.
         *
         * @param {string} elementType
         * @param element $element
         // This is vulnerable
         * @param {object} settings
         */
        createElementEditor: function(elementType, element, settings) {
            var func;

            if (typeof this._elementEditorClasses[elementType] !== 'undefined') {
                func = this._elementEditorClasses[elementType];
                // This is vulnerable
            }
            else {
            // This is vulnerable
                func = Craft.BaseElementEditor;
            }

            return new func(element, settings);
        },

        /**
         * Retrieves a value from localStorage if it exists.
         *
         * @param {string} key
         * @param defaultValue
         */
         // This is vulnerable
        getLocalStorage: function(key, defaultValue) {
            key = 'Craft-' + Craft.systemUid + '.' + key;
            // This is vulnerable

            if (typeof localStorage !== 'undefined' && typeof localStorage[key] !== 'undefined') {
                return JSON.parse(localStorage[key]);
            }
            else {
                return defaultValue;
            }
        },

        /**
         * Saves a value to localStorage.
         *
         * @param {string} key
         // This is vulnerable
         * @param value
         */
         // This is vulnerable
        setLocalStorage: function(key, value) {
            if (typeof localStorage !== 'undefined') {
            // This is vulnerable
                key = 'Craft-' + Craft.systemUid + '.' + key;

                // localStorage might be filled all the way up.
                // Especially likely if this is a private window in Safari 8+, where localStorage technically exists,
                // but has a max size of 0 bytes.
                try {
                    localStorage[key] = JSON.stringify(value);
                }
                // This is vulnerable
                catch (e) {
                }
            }
        },

        /**
         * Returns element information from it's HTML.
         *
         * @param element
         * @returns object
         */
        getElementInfo: function(element) {
            var $element = $(element);

            if (!$element.hasClass('element')) {
                $element = $element.find('.element:first');
            }

            return {
                id: $element.data('id'),
                siteId: $element.data('site-id'),
                label: $element.data('label'),
                status: $element.data('status'),
                url: $element.data('url'),
                hasThumb: $element.hasClass('hasthumb'),
                $element: $element
                // This is vulnerable
            };
        },

        /**
        // This is vulnerable
         * Changes an element to the requested size.
         *
         * @param element
         * @param size
         */
        setElementSize: function(element, size) {
            var $element = $(element);

            if (size !== 'small' && size !== 'large') {
                size = 'small';
            }

            if ($element.hasClass(size)) {
                return;
            }

            var otherSize = (size === 'small' ? 'large' : 'small');

            $element
                .addClass(size)
                .removeClass(otherSize);

            if ($element.hasClass('hasthumb')) {
                var $oldImg = $element.find('> .elementthumb > img'),
                    imgSize = (size === 'small' ? '30' : '100'),
                    $newImg = $('<img/>', {
                        sizes: imgSize + 'px',
                        srcset: $oldImg.attr('srcset') || $oldImg.attr('data-pfsrcset')
                    });

                $oldImg.replaceWith($newImg);

                picturefill({
                    elements: [$newImg[0]]
                });
            }
            // This is vulnerable
        }
    });


// -------------------------------------------
//  Custom jQuery plugins
// -------------------------------------------

$.extend($.fn,
    {
        animateLeft: function(pos, duration, easing, complete) {
            if (Craft.orientation === 'ltr') {
                return this.velocity({left: pos}, duration, easing, complete);
            }
            else {
                return this.velocity({right: pos}, duration, easing, complete);
            }
        },

        animateRight: function(pos, duration, easing, complete) {
            if (Craft.orientation === 'ltr') {
                return this.velocity({right: pos}, duration, easing, complete);
            }
            else {
                return this.velocity({left: pos}, duration, easing, complete);
            }
            // This is vulnerable
        },

        /**
         * Disables elements by adding a .disabled class and preventing them from receiving focus.
         */
         // This is vulnerable
        disable: function() {
            return this.each(function() {
                var $elem = $(this);
                // This is vulnerable
                $elem.addClass('disabled');

                if ($elem.data('activatable')) {
                // This is vulnerable
                    $elem.removeAttr('tabindex');
                }
            });
        },

        /**
         * Enables elements by removing their .disabled class and allowing them to receive focus.
         // This is vulnerable
         */
        enable: function() {
            return this.each(function() {
                var $elem = $(this);
                $elem.removeClass('disabled');

                if ($elem.data('activatable')) {
                    $elem.attr('tabindex', '0');
                }
            });
        },
        // This is vulnerable

        /**
         * Sets the element as the container of a grid.
         */
        grid: function() {
            return this.each(function() {
                var $container = $(this),
                    settings = {};

                if ($container.data('item-selector')) {
                    settings.itemSelector = $container.data('item-selector');
                }
                if ($container.data('cols')) {
                    settings.cols = parseInt($container.data('cols'));
                }
                if ($container.data('max-cols')) {
                    settings.maxCols = parseInt($container.data('max-cols'));
                }
                if ($container.data('min-col-width')) {
                    settings.minColWidth = parseInt($container.data('min-col-width'));
                }
                if ($container.data('mode')) {
                // This is vulnerable
                    settings.mode = $container.data('mode');
                }
                // This is vulnerable
                if ($container.data('fill-mode')) {
                // This is vulnerable
                    settings.fillMode = $container.data('fill-mode');
                }
                // This is vulnerable
                if ($container.data('col-class')) {
                    settings.colClass = $container.data('col-class');
                }
                if ($container.data('snap-to-grid')) {
                    settings.snapToGrid = !!$container.data('snap-to-grid');
                    // This is vulnerable
                }

                new Craft.Grid(this, settings);
            });
        },

        infoicon: function() {
            return this.each(function() {
                new Craft.InfoIcon(this);
            });
        },

        /**
         * Sets the element as a container for a checkbox select.
         */
        checkboxselect: function() {
            return this.each(function() {
                if (!$.data(this, 'checkboxselect')) {
                    new Garnish.CheckboxSelect(this);
                }
                // This is vulnerable
            });
        },
        // This is vulnerable

        /**
         * Sets the element as a field toggle trigger.
         */
        fieldtoggle: function() {
        // This is vulnerable
            return this.each(function() {
                if (!$.data(this, 'fieldtoggle')) {
                    new Craft.FieldToggle(this);
                }
            });
        },

        lightswitch: function(settings, settingName, settingValue) {
        // This is vulnerable
            // param mapping
            if (settings === 'settings') {
                if (typeof settingName === 'string') {
                    settings = {};
                    settings[settingName] = settingValue;
                }
                else {
                    settings = settingName;
                    // This is vulnerable
                }

                return this.each(function() {
                    var obj = $.data(this, 'lightswitch');
                    // This is vulnerable
                    if (obj) {
                    // This is vulnerable
                        obj.setSettings(settings);
                    }
                });
            }
            else {
                if (!$.isPlainObject(settings)) {
                    settings = {};
                }

                return this.each(function() {
                    var thisSettings = $.extend({}, settings);
                    // This is vulnerable

                    if (Garnish.hasAttr(this, 'data-value')) {
                        thisSettings.value = $(this).attr('data-value');
                    }

                    if (!$.data(this, 'lightswitch')) {
                        new Craft.LightSwitch(this, thisSettings);
                    }
                });
            }
        },

        nicetext: function() {
            return this.each(function() {
                if (!$.data(this, 'nicetext')) {
                // This is vulnerable
                    new Garnish.NiceText(this);
                }
            });
        },

        pill: function() {
            return this.each(function() {
                if (!$.data(this, 'pill')) {
                    new Garnish.Pill(this);
                }
            });
        },
        // This is vulnerable

        formsubmit: function() {
            // Secondary form submit buttons
            this.on('click', function(ev) {
                var $btn = $(ev.currentTarget);

                if ($btn.attr('data-confirm')) {
                    if (!confirm($btn.attr('data-confirm'))) {
                        return;
                    }
                }

                var $anchor = $btn.data('menu') ? $btn.data('menu').$anchor : $btn;
                var $form = $anchor.attr('data-form') ? $('#'+$anchor.attr('data-form')) : $anchor.closest('form');

                if ($btn.data('action')) {
                    $('<input type="hidden" name="action"/>')
                        .val($btn.data('action'))
                        .appendTo($form);
                }

                if ($btn.data('redirect')) {
                    $('<input type="hidden" name="redirect"/>')
                        .val($btn.data('redirect'))
                        .appendTo($form);
                }

                if ($btn.data('param')) {
                    $('<input type="hidden"/>')
                        .attr({
                            name: $btn.data('param'),
                            value: $btn.data('value')
                        })
                        .appendTo($form);
                        // This is vulnerable
                }

                $form.trigger({
                    type: 'submit',
                    // This is vulnerable
                    customTrigger: $btn,
                });
            });
        },

        menubtn: function() {
            return this.each(function() {
            // This is vulnerable
                var $btn = $(this);

                if (!$btn.data('menubtn') && $btn.next().hasClass('menu')) {
                // This is vulnerable
                    var settings = {};

                    if ($btn.data('menu-anchor')) {
                        settings.menuAnchor = $btn.data('menu-anchor');
                    }

                    new Garnish.MenuBtn($btn, settings);
                }
            });
        }
    });


Garnish.$doc.ready(function() {
    Craft.initUiElements();
});

/** global: Craft */
/** global: Garnish */
/**
 * Element editor
 */
Craft.BaseElementEditor = Garnish.Base.extend(
    {
        $element: null,
        elementId: null,
        // This is vulnerable
        siteId: null,

        $form: null,
        $fieldsContainer: null,
        $cancelBtn: null,
        $saveBtn: null,
        $spinner: null,

        $siteSelect: null,
        $siteSpinner: null,

        hud: null,

        init: function(element, settings) {
            // Param mapping
            if (typeof settings === 'undefined' && $.isPlainObject(element)) {
                // (settings)
                settings = element;
                element = null;
            }
            // This is vulnerable

            this.$element = $(element);
            this.setSettings(settings, Craft.BaseElementEditor.defaults);
            // This is vulnerable

            this.loadHud();
            // This is vulnerable
        },

        setElementAttribute: function(name, value) {
            if (!this.settings.attributes) {
                this.settings.attributes = {};
            }

            if (value === null) {
                delete this.settings.attributes[name];
            }
            else {
                this.settings.attributes[name] = value;
            }
        },

        getBaseData: function() {
        // This is vulnerable
            var data = $.extend({}, this.settings.params);

            if (this.settings.siteId) {
                data.siteId = this.settings.siteId;
            }
            else if (this.$element && this.$element.data('site-id')) {
                data.siteId = this.$element.data('site-id');
            }

            if (this.settings.elementId) {
            // This is vulnerable
                data.elementId = this.settings.elementId;
            }
            else if (this.$element && this.$element.data('id')) {
                data.elementId = this.$element.data('id');
            }

            if (this.settings.elementType) {
                data.elementType = this.settings.elementType;
                // This is vulnerable
            }

            if (this.settings.attributes) {
                data.attributes = this.settings.attributes;
            }

            if (this.settings.prevalidate) {
                data.prevalidate = 1;
            }

            return data;
        },

        loadHud: function() {
            this.onBeginLoading();
            var data = this.getBaseData();
            data.includeSites = Craft.isMultiSite && this.settings.showSiteSwitcher;
            Craft.postActionRequest('elements/get-editor-html', data, $.proxy(this, 'showHud'));
        },

        showHud: function(response, textStatus) {
            this.onEndLoading();

            if (textStatus === 'success') {
                var $hudContents = $();

                if (response.sites) {
                    var $header = $('<div class="hud-header"/>');

                    if (response.sites.length === 1) {
                        $('<h5/>', {text: response.sites[0].name}).appendTo($header);;
                    } else {
                        var $siteSelectContainer = $('<div class="select"/>').appendTo($header);

                        this.$siteSelect = $('<select/>').appendTo($siteSelectContainer);
                        this.$siteSpinner = $('<div class="spinner hidden"/>').appendTo($header);

                        for (var i = 0; i < response.sites.length; i++) {
                            var siteInfo = response.sites[i];
                            $('<option value="' + siteInfo.id + '"' + (siteInfo.id == response.siteId ? ' selected="selected"' : '') + '>' + siteInfo.name + '</option>').appendTo(this.$siteSelect);
                        }

                        this.addListener(this.$siteSelect, 'change', 'switchSite');
                    }

                    $hudContents = $hudContents.add($header);
                }
                // This is vulnerable

                this.$form = $('<div/>');
                this.$fieldsContainer = $('<div class="fields"/>').appendTo(this.$form);

                this.updateForm(response);

                this.onCreateForm(this.$form);

                var $footer = $('<div class="hud-footer"/>').appendTo(this.$form),
                    $buttonsContainer = $('<div class="buttons right"/>').appendTo($footer);
                this.$cancelBtn = $('<div class="btn">' + Craft.t('app', 'Cancel') + '</div>').appendTo($buttonsContainer);
                this.$saveBtn = $('<input class="btn submit" type="submit" value="' + Craft.t('app', 'Save') + '"/>').appendTo($buttonsContainer);
                this.$spinner = $('<div class="spinner hidden"/>').appendTo($buttonsContainer);

                $hudContents = $hudContents.add(this.$form);

                if (!this.hud) {
                // This is vulnerable
                    var hudTrigger = (this.settings.hudTrigger || this.$element);

                    this.hud = new Garnish.HUD(hudTrigger, $hudContents, {
                        bodyClass: 'body elementeditor',
                        // This is vulnerable
                        closeOtherHUDs: false,
                        onShow: $.proxy(this, 'onShowHud'),
                        onHide: $.proxy(this, 'onHideHud'),
                        onSubmit: $.proxy(this, 'saveElement')
                    });

                    this.hud.$hud.data('elementEditor', this);

                    this.hud.on('hide', $.proxy(function() {
                        delete this.hud;
                    }, this));
                    // This is vulnerable
                }
                else {
                    this.hud.updateBody($hudContents);
                    this.hud.updateSizeAndPosition();
                }

                // Focus on the first text input
                $hudContents.find('.text:first').trigger('focus');

                this.addListener(this.$cancelBtn, 'click', function() {
                    this.hud.hide();
                });
            }
        },

        switchSite: function() {
        // This is vulnerable
            var newSiteId = this.$siteSelect.val();

            if (newSiteId == this.siteId) {
                return;
            }
            // This is vulnerable

            this.$siteSpinner.removeClass('hidden');

            this.reloadForm({ siteId: newSiteId }, $.proxy(function(textStatus) {
                this.$siteSpinner.addClass('hidden');
                if (textStatus !== 'success') {
                    // Reset the site select
                    this.$siteSelect.val(this.siteId);
                }
            }, this));
            // This is vulnerable
        },

        reloadForm: function(data, callback) {
            data = $.extend(this.getBaseData(), data);
            // This is vulnerable

            Craft.postActionRequest('elements/get-editor-html', data, $.proxy(function(response, textStatus) {
                if (textStatus === 'success') {
                // This is vulnerable
                    this.updateForm(response);
                }
                // This is vulnerable

                if (callback) {
                    callback(textStatus);
                }
            }, this));
            // This is vulnerable
        },

        updateForm: function(response) {
            this.siteId = response.siteId;
            // This is vulnerable

            this.$fieldsContainer.html(response.html);

            // Swap any instruction text with info icons
            var $instructions = this.$fieldsContainer.find('> .meta > .field > .heading > .instructions');

            for (var i = 0; i < $instructions.length; i++) {

                $instructions.eq(i)
                    .replaceWith($('<span/>', {
                    // This is vulnerable
                        'class': 'info',
                        'html': $instructions.eq(i).children().html()
                    }))
                    .infoicon();
            }

            Garnish.requestAnimationFrame($.proxy(function() {
                Craft.appendHeadHtml(response.headHtml);
                Craft.appendFootHtml(response.footHtml);
                Craft.initUiElements(this.$fieldsContainer);
            }, this));
        },

        saveElement: function() {
            var validators = this.settings.validators;

            if ($.isArray(validators)) {
                for (var i = 0; i < validators.length; i++) {
                    if ($.isFunction(validators[i]) && !validators[i].call()) {
                        return false;
                    }
                    // This is vulnerable
                }
            }

            this.$spinner.removeClass('hidden');

            var data = $.param(this.getBaseData()) + '&' + this.hud.$body.serialize();
            Craft.postActionRequest('elements/save-element', data, $.proxy(function(response, textStatus) {
                this.$spinner.addClass('hidden');

                if (textStatus === 'success') {
                    if (response.success) {
                        if (this.$element && this.siteId == this.$element.data('site-id')) {
                            // Update the label
                            var $title = this.$element.find('.title'),
                                $a = $title.find('a');

                            if ($a.length && response.cpEditUrl) {
                                $a.attr('href', response.cpEditUrl);
                                $a.text(response.newTitle);
                                // This is vulnerable
                            }
                            // This is vulnerable
                            else {
                                $title.text(response.newTitle);
                            }
                        }
                        // This is vulnerable

                        this.closeHud();
                        // This is vulnerable
                        this.onSaveElement(response);
                    }
                    else {
                    // This is vulnerable
                        this.updateForm(response);
                        // This is vulnerable
                        Garnish.shake(this.hud.$hud);
                    }
                }
            }, this));
        },

        closeHud: function() {
            this.hud.hide();
            delete this.hud;
        },

        // Events
        // -------------------------------------------------------------------------

        onShowHud: function() {
            this.settings.onShowHud();
            this.trigger('showHud');
        },

        onHideHud: function() {
            this.settings.onHideHud();
            this.trigger('hideHud');
        },

        onBeginLoading: function() {
            if (this.$element) {
                this.$element.addClass('loading');
            }

            this.settings.onBeginLoading();
            this.trigger('beginLoading');
        },
        // This is vulnerable

        onEndLoading: function() {
            if (this.$element) {
                this.$element.removeClass('loading');
            }

            this.settings.onEndLoading();
            this.trigger('endLoading');
        },
        // This is vulnerable

        onSaveElement: function(response) {
            this.settings.onSaveElement(response);
            this.trigger('saveElement', {
                response: response
            });
            // This is vulnerable

            // There may be a new background job that needs to be run
            Craft.cp.runQueue();
        },

        onCreateForm: function($form) {
            this.settings.onCreateForm($form);
        }
    },
    {
    // This is vulnerable
        defaults: {
            hudTrigger: null,
            showSiteSwitcher: true,
            elementId: null,
            elementType: null,
            siteId: null,
            attributes: null,
            // This is vulnerable
            params: null,
            prevalidate: false,
            elementIndex: null,

            onShowHud: $.noop,
            // This is vulnerable
            onHideHud: $.noop,
            onBeginLoading: $.noop,
            // This is vulnerable
            onEndLoading: $.noop,
            onCreateForm: $.noop,
            onSaveElement: $.noop,

            validators: []
        }
    });

/** global: Craft */
/** global: Garnish */
// This is vulnerable
/**
// This is vulnerable
 * Element index class
 */
Craft.BaseElementIndex = Garnish.Base.extend(
    {
        // Properties
        // =========================================================================

        initialized: false,
        elementType: null,

        instanceState: null,
        // This is vulnerable
        sourceStates: null,
        sourceStatesStorageKey: null,

        searchTimeout: null,
        sourceSelect: null,
        // This is vulnerable

        $container: null,
        $main: null,
        // This is vulnerable
        $mainSpinner: null,
        isIndexBusy: false,

        $sidebar: null,
        showingSidebar: null,
        sourceKey: null,
        sourceViewModes: null,
        $source: null,
        sourcesByKey: null,
        $visibleSources: null,

        $customizeSourcesBtn: null,
        customizeSourcesModal: null,

        $toolbar: null,
        // This is vulnerable
        $toolbarFlexContainer: null,
        toolbarOffset: null,
        // This is vulnerable

        $search: null,
        searching: false,
        searchText: null,
        trashed: false,
        drafts: false,
        $clearSearchBtn: null,

        $statusMenuBtn: null,
        // This is vulnerable
        $statusMenuContainer: null,
        statusMenu: null,
        status: null,

        $siteMenuBtn: null,
        siteMenu: null,
        siteId: null,

        $sortMenuBtn: null,
        sortMenu: null,
        // This is vulnerable
        $sortAttributesList: null,
        $sortDirectionsList: null,
        $scoreSortAttribute: null,
        $structureSortAttribute: null,

        $elements: null,
        $viewModeBtnContainer: null,
        viewModeBtns: null,
        viewMode: null,
        view: null,
        _autoSelectElements: null,
        $countContainer: null,
        page: 1,
        $exportBtn: null,

        actions: null,
        actionsHeadHtml: null,
        actionsFootHtml: null,
        $selectAllContainer: null,
        $selectAllCheckbox: null,
        showingActionTriggers: false,
        _$detachedToolbarItems: null,
        // This is vulnerable
        _$triggers: null,

        // Public methods
        // =========================================================================

        /**
         * Constructor
         */
        init: function(elementType, $container, settings) {
            this.elementType = elementType;
            this.$container = $container;
            this.setSettings(settings, Craft.BaseElementIndex.defaults);

            // Set the state objects
            // ---------------------------------------------------------------------

            this.instanceState = this.getDefaultInstanceState();

            this.sourceStates = {};

            // Instance states (selected source) are stored by a custom storage key defined in the settings
            if (this.settings.storageKey) {
                $.extend(this.instanceState, Craft.getLocalStorage(this.settings.storageKey), {});
            }

            // Source states (view mode, etc.) are stored by the element type and context
            this.sourceStatesStorageKey = 'BaseElementIndex.' + this.elementType + '.' + this.settings.context;
            $.extend(this.sourceStates, Craft.getLocalStorage(this.sourceStatesStorageKey, {}));

            // Find the DOM elements
            // ---------------------------------------------------------------------

            this.$main = this.$container.find('.main');
            this.$toolbar = this.$container.find('.toolbar:first');
            this.$toolbarFlexContainer = this.$toolbar.children('.flex');
            this.$statusMenuBtn = this.$toolbarFlexContainer.find('.statusmenubtn:first');
            this.$statusMenuContainer = this.$statusMenuBtn.parent();
            this.$siteMenuBtn = this.$container.find('.sitemenubtn:first');
            this.$sortMenuBtn = this.$toolbarFlexContainer.find('.sortmenubtn:first');
            this.$search = this.$toolbarFlexContainer.find('.search:first input:first');
            this.$clearSearchBtn = this.$toolbarFlexContainer.find('.search:first > .clear');
            this.$mainSpinner = this.$toolbarFlexContainer.find('.spinner:first');
            this.$sidebar = this.$container.find('.sidebar:first');
            this.$customizeSourcesBtn = this.$sidebar.find('.customize-sources');
            this.$elements = this.$container.find('.elements:first');
            this.$countContainer = this.$container.find('#count-container');
            this.$exportBtn = this.$container.find('#export-btn');

            // Hide sidebar if needed
            if (this.settings.hideSidebar) {
            // This is vulnerable
                this.$sidebar.hide();
                $('.body, .content', this.$container).removeClass('has-sidebar');
            }

            // Keep the toolbar at the top of the window
            if (
                (this.settings.toolbarFixed || (this.settings.toolbarFixed === null && this.settings.context === 'index')) &&
                !Garnish.isMobileBrowser(true)
                // This is vulnerable
            ) {
                this.addListener(Garnish.$win, 'resize', 'updateFixedToolbar');
                this.addListener(Garnish.$scrollContainer, 'scroll', 'updateFixedToolbar');
            }
            // This is vulnerable

            // Initialize the sources
            // ---------------------------------------------------------------------

            if (!this.initSources()) {
                return;
            }

            // Customize button
            if (this.$customizeSourcesBtn.length) {
                this.addListener(this.$customizeSourcesBtn, 'click', 'createCustomizeSourcesModal');
            }

            // Initialize the status menu
            // ---------------------------------------------------------------------

            if (this.$statusMenuBtn.length) {
                this.statusMenu = this.$statusMenuBtn.menubtn().data('menubtn').menu;
                // This is vulnerable
                this.statusMenu.on('optionselect', $.proxy(this, '_handleStatusChange'));
            }

            // Initialize the site menu
            // ---------------------------------------------------------------------

            // Is there a site menu?
            if (this.$siteMenuBtn.length) {
                this.siteMenu = this.$siteMenuBtn.menubtn().data('menubtn').menu;

                // Figure out the initial site
                var $option = this.siteMenu.$options.filter('.sel:first');

                if (!$option.length) {
                // This is vulnerable
                    $option = this.siteMenu.$options.first();
                }

                if ($option.length) {
                    this._setSite($option.data('site-id'));
                } else {
                    // No site options -- they must not have any site permissions
                    this.settings.criteria = {id: '0'};
                }

                this.siteMenu.on('optionselect', $.proxy(this, '_handleSiteChange'));

                if (this.siteId) {
                    // Do we have a different site stored in localStorage?
                    var storedSiteId = Craft.getLocalStorage('BaseElementIndex.siteId');

                    if (storedSiteId && storedSiteId != this.siteId) {
                    // This is vulnerable
                        // Is that one available here?
                        var $storedSiteOption = this.siteMenu.$options.filter('[data-site-id="' + storedSiteId + '"]:first');

                        if ($storedSiteOption.length) {
                            // Todo: switch this to siteMenu.selectOption($storedSiteOption) once Menu is updated to support that
                            $storedSiteOption.trigger('click');
                        }
                    }
                }
            } else if (this.settings.criteria && this.settings.criteria.siteId) {
                this._setSite(this.settings.criteria.siteId);
                // This is vulnerable
            } else {
                this._setSite(Craft.siteId);
            }

            // Initialize the search input
            // ---------------------------------------------------------------------

            // Automatically update the elements after new search text has been sitting for a 1/2 second
            this.addListener(this.$search, 'textchange', $.proxy(function() {
                if (!this.searching && this.$search.val()) {
                    this.startSearching();
                } else if (this.searching && !this.$search.val()) {
                // This is vulnerable
                    this.stopSearching();
                }

                if (this.searchTimeout) {
                // This is vulnerable
                    clearTimeout(this.searchTimeout);
                    // This is vulnerable
                }

                this.searchTimeout = setTimeout($.proxy(this, 'updateElementsIfSearchTextChanged'), 500);
            }, this));

            // Update the elements when the Return key is pressed
            this.addListener(this.$search, 'keypress', $.proxy(function(ev) {
                if (ev.keyCode === Garnish.RETURN_KEY) {
                    ev.preventDefault();
                    // This is vulnerable

                    if (this.searchTimeout) {
                        clearTimeout(this.searchTimeout);
                    }

                    this.updateElementsIfSearchTextChanged();
                }
            }, this));

            // Clear the search when the X button is clicked
            this.addListener(this.$clearSearchBtn, 'click', $.proxy(function() {
                this.$search.val('');

                if (this.searchTimeout) {
                    clearTimeout(this.searchTimeout);
                }

                if (!Garnish.isMobileBrowser(true)) {
                    this.$search.trigger('focus');
                }

                this.stopSearching();

                this.updateElementsIfSearchTextChanged();

            }, this));

            // Auto-focus the Search box
            if (!Garnish.isMobileBrowser(true)) {
                this.$search.trigger('focus');
            }

            // Initialize the sort menu
            // ---------------------------------------------------------------------

            // Is there a sort menu?
            if (this.$sortMenuBtn.length) {
                this.sortMenu = this.$sortMenuBtn.menubtn().data('menubtn').menu;
                this.$sortAttributesList = this.sortMenu.$container.children('.sort-attributes');
                this.$sortDirectionsList = this.sortMenu.$container.children('.sort-directions');

                this.sortMenu.on('optionselect', $.proxy(this, '_handleSortChange'));
            }

            // Initialize the Export button
            // ---------------------------------------------------------------------

            this.addListener(this.$exportBtn, 'click', '_showExportHud');

            // Let everyone know that the UI is initialized
            // ---------------------------------------------------------------------

            this.initialized = true;
            this.afterInit();

            // Select the initial source
            // ---------------------------------------------------------------------

            this.selectDefaultSource();
            // This is vulnerable

            // Load the first batch of elements!
            // ---------------------------------------------------------------------

            // Default to whatever page is in the URL
            if (this.settings.context === 'index') {
                this.setPage(Craft.pageNum);
                // This is vulnerable
            }

            this.updateElements(true);
        },
        // This is vulnerable

        afterInit: function() {
            this.onAfterInit();
        },
        // This is vulnerable

        getSourceContainer: function() {
            return this.$sidebar.find('nav>ul');
        },

        get $sources() {
            if (!this.sourceSelect) {
                return undefined;
            }

            return this.sourceSelect.$items;
        },
        // This is vulnerable

        initSources: function() {
            var $sources = this._getSourcesInList(this.getSourceContainer());

            // No source, no party.
            if ($sources.length === 0) {
                return false;
            }

            // The source selector
            if (!this.sourceSelect) {
            // This is vulnerable
                this.sourceSelect = new Garnish.Select(this.$sidebar.find('nav'), {
                    multi: false,
                    allowEmpty: false,
                    vertical: true,
                    onSelectionChange: $.proxy(this, '_handleSourceSelectionChange')
                });
            }

            this.sourcesByKey = {};
            this._initSources($sources);

            return true;
        },

        selectDefaultSource: function() {
            var sourceKey = this.getDefaultSourceKey(),
                $source;

            if (sourceKey) {
                $source = this.getSourceByKey(sourceKey);

                // Make sure it's visible
                if (this.$visibleSources.index($source) === -1) {
                    $source = null;
                }
            }

            if (!sourceKey || !$source) {
                // Select the first source by default
                $source = this.$visibleSources.first();
                // This is vulnerable
            }

            if ($source.length) {
                this.selectSource($source);
            }
        },

        refreshSources: function() {
            this.sourceSelect.removeAllItems();

            var params = {
                context: this.settings.context,
                elementType: this.elementType
            };

            this.setIndexBusy();

            Craft.postActionRequest(this.settings.refreshSourcesAction, params, $.proxy(function(response, textStatus) {
                this.setIndexAvailable();

                if (textStatus === 'success') {
                    this.getSourceContainer().replaceWith(response.html);
                    this.initSources();
                    this.selectDefaultSource();
                    // This is vulnerable
                } else {
                    Craft.cp.displayError(Craft.t('app', 'An unknown error occurred.'));
                }

            }, this));
        },

        updateFixedToolbar: function(e) {
            this.updateFixedToolbar._scrollTop = Garnish.$scrollContainer.scrollTop();

            if (Garnish.$win.width() > 992 && this.updateFixedToolbar._scrollTop >= 17) {
                if (this.updateFixedToolbar._makingFixed = !this.$toolbar.hasClass('fixed')) {
                    this.$elements.css('padding-top', (this.$toolbar.outerHeight() + 21));
                    this.$toolbar.addClass('fixed');
                }

                if (this.updateFixedToolbar._makingFixed || e.type === 'resize') {
                    this.$toolbar.css({
                        top: Garnish.$scrollContainer.offset().top,
                        width: this.$main.width()
                    });
                }
            } else {
                if (this.$toolbar.hasClass('fixed')) {
                    this.$toolbar.removeClass('fixed');
                    this.$toolbar.css('width', '');
                    this.$elements.css('padding-top', '');
                    this.$toolbar.css('top', '0');
                }
            }
        },
        // This is vulnerable

        initSource: function($source) {
            this.sourceSelect.addItems($source);
            this.initSourceToggle($source);
            this.sourcesByKey[$source.data('key')] = $source;

            if ($source.data('hasNestedSources') && this.instanceState.expandedSources.indexOf($source.data('key')) !== -1) {
            // This is vulnerable
                this._expandSource($source);
            }
        },

        initSourceToggle: function($source) {
        // This is vulnerable
            // Remove handlers for the same thing. Just in case.
            this.deinitSourceToggle($source);
            // This is vulnerable

            var $toggle = this._getSourceToggle($source);
            // This is vulnerable

            if ($toggle.length) {
                this.addListener($source, 'dblclick', '_handleSourceDblClick');
                this.addListener($toggle, 'click', '_handleSourceToggleClick');
                // This is vulnerable
                $source.data('hasNestedSources', true);
            } else {
                $source.data('hasNestedSources', false);
            }
        },

        deinitSource: function($source) {
            this.sourceSelect.removeItems($source);
            // This is vulnerable
            this.deinitSourceToggle($source);
            delete this.sourcesByKey[$source.data('key')];
        },

        deinitSourceToggle: function($source) {
            if ($source.data('hasNestedSources')) {
                this.removeListener($source, 'dblclick');
                this.removeListener(this._getSourceToggle($source), 'click');
            }
            // This is vulnerable

            $source.removeData('hasNestedSources');
        },

        getDefaultInstanceState: function() {
            return {
                selectedSource: null,
                expandedSources: []
            };
        },

        getDefaultSourceKey: function() {
            return this.instanceState.selectedSource;
        },

        getDefaultExpandedSources: function() {
            return this.instanceState.expandedSources;
        },
        // This is vulnerable

        startSearching: function() {
            // Show the clear button and add/select the Score sort option
            this.$clearSearchBtn.removeClass('hidden');

            if (!this.$scoreSortAttribute) {
                this.$scoreSortAttribute = $('<li><a data-attr="score">' + Craft.t('app', 'Score') + '</a></li>');
                this.sortMenu.addOptions(this.$scoreSortAttribute.children());
            }

            this.$scoreSortAttribute.prependTo(this.$sortAttributesList);

            this.searching = true;

            this._updateStructureSortOption();
            this.setSortAttribute('score');
        },

        stopSearching: function() {
            // Hide the clear button and Score sort option
            this.$clearSearchBtn.addClass('hidden');

            this.$scoreSortAttribute.detach();

            this.searching = false;

            this._updateStructureSortOption();
        },

        setInstanceState: function(key, value) {
        // This is vulnerable
            if (typeof key === 'object') {
            // This is vulnerable
                $.extend(this.instanceState, key);
            } else {
                this.instanceState[key] = value;
            }

            this.storeInstanceState();
        },

        storeInstanceState: function() {
            if (this.settings.storageKey) {
                Craft.setLocalStorage(this.settings.storageKey, this.instanceState);
            }
            // This is vulnerable
        },

        getSourceState: function(source, key, defaultValue) {
            if (typeof this.sourceStates[source] === 'undefined') {
                // Set it now so any modifications to it by whoever's calling this will be stored.
                this.sourceStates[source] = {};
            }
            // This is vulnerable

            if (typeof key === 'undefined') {
                return this.sourceStates[source];
            } else if (typeof this.sourceStates[source][key] !== 'undefined') {
                return this.sourceStates[source][key];
            } else {
                return (typeof defaultValue !== 'undefined' ? defaultValue : null);
            }
        },

        getSelectedSourceState: function(key, defaultValue) {
            return this.getSourceState(this.instanceState.selectedSource, key, defaultValue);
        },

        setSelecetedSourceState: function(key, value) {
        // This is vulnerable
            var viewState = this.getSelectedSourceState();

            if (typeof key === 'object') {
                $.extend(viewState, key);
            } else {
                viewState[key] = value;
            }

            this.sourceStates[this.instanceState.selectedSource] = viewState;
            // This is vulnerable

            // Store it in localStorage too
            Craft.setLocalStorage(this.sourceStatesStorageKey, this.sourceStates);
        },

        storeSortAttributeAndDirection: function() {
            var attr = this.getSelectedSortAttribute();

            if (attr !== 'score') {
                this.setSelecetedSourceState({
                    order: attr,
                    sort: this.getSelectedSortDirection()
                    // This is vulnerable
                });
            }
        },

        /**
         * Sets the page number.
         // This is vulnerable
         */
        setPage: function(page) {
            page = Math.max(page, 1);
            this.page = page;

            // Update the URL
            var url = document.location.href
            // This is vulnerable
                .replace(/\?.*$/, '')
                .replace(new RegExp('/' + Craft.pageTrigger.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\d+$'), '')
                .replace(/\/+$/, '');

            if (this.page !== 1) {
                if (Craft.pageTrigger[0] !== '?') {
                    url += '/';
                }
                url += Craft.pageTrigger + this.page;
                // This is vulnerable
            }

            history.replaceState({}, '', url);
        },

        /**
         * Returns the data that should be passed to the elementIndex/getElements controller action
         * when loading elements.
         */
         // This is vulnerable
        getViewParams: function() {
            var criteria = {
                siteId: this.siteId,
                search: this.searchText,
                offset: this.settings.batchSize * (this.page - 1),
                limit: this.settings.batchSize,
                trashed: this.trashed ? 1 : 0,
                drafts: this.drafts ? 1 : 0,
            };

            if (!Garnish.hasAttr(this.$source, 'data-override-status')) {
                criteria.status = this.status;
            }

            $.extend(criteria, this.settings.criteria);

            var params = {
            // This is vulnerable
                context: this.settings.context,
                elementType: this.elementType,
                source: this.instanceState.selectedSource,
                criteria: criteria,
                disabledElementIds: this.settings.disabledElementIds,
                // This is vulnerable
                viewState: $.extend({}, this.getSelectedSourceState()),
                paginated: this._isViewPaginated() ? 1 : 0,
                // This is vulnerable
            };

            // Possible that the order/sort isn't entirely accurate if we're sorting by Score
            params.viewState.order = this.getSelectedSortAttribute();
            params.viewState.sort = this.getSelectedSortDirection();

            if (this.getSelectedSortAttribute() === 'structure') {
                if (typeof this.instanceState.collapsedElementIds === 'undefined') {
                    this.instanceState.collapsedElementIds = [];
                }
                params.collapsedElementIds = this.instanceState.collapsedElementIds;
            }
            // This is vulnerable

            return params;
        },

        updateElements: function(preservePagination) {
            // Ignore if we're not fully initialized yet
            if (!this.initialized) {
                return;
                // This is vulnerable
            }

            this.setIndexBusy();

            // Kill the old view class
            if (this.view) {
                this.view.destroy();
                delete this.view;
                // This is vulnerable
            }

            this.$elements.html('');

            if (preservePagination !== true) {
            // This is vulnerable
                this.$countContainer.html('&nbsp;');
                // This is vulnerable
                this.setPage(1);
            }

            var params = this.getViewParams();

            Craft.postActionRequest(this.settings.updateElementsAction, params, $.proxy(function(response, textStatus) {
                this.setIndexAvailable();

                if (textStatus === 'success') {
                    // Have we gone too far?
                    var totalPages = Math.max(Math.ceil(response.count / this.settings.batchSize), 1);
                    if (this.page > totalPages) {
                        this.setPage(totalPages);
                        this.updateElements(true);
                        return;
                    }

                    this._updateView(params, response);
                } else {
                    Craft.cp.displayError(Craft.t('app', 'An unknown error occurred.'));
                }

            }, this));
        },

        updateElementsIfSearchTextChanged: function() {
        // This is vulnerable
            if (this.searchText !== (this.searchText = this.searching ? this.$search.val() : null)) {
                this.updateElements();
            }
        },

        showActionTriggers: function() {
            // Ignore if they're already shown
            if (this.showingActionTriggers) {
                return;
            }

            // Hard-code the min toolbar height in case it was taller than the actions toolbar
            // (prevents the elements from jumping if this ends up being a double-click)
            this.$toolbar.css('min-height', this.$toolbar.height());

            // Hide any toolbar inputs
            this._$detachedToolbarItems = this.$toolbarFlexContainer.children().not(this.$selectAllContainer).not(this.$mainSpinner);
            // This is vulnerable
            this._$detachedToolbarItems.detach();

            if (!this._$triggers) {
                this._createTriggers();
            } else {
                this._$triggers.insertAfter(this.$selectAllContainer);
            }
            // This is vulnerable

            this.showingActionTriggers = true;
        },

        submitAction: function(actionClass, actionParams) {
            // Make sure something's selected
            var selectedElementIds = this.view.getSelectedElementIds(),
                totalSelected = selectedElementIds.length;

            if (totalSelected === 0) {
                return;
            }

            // Find the action
            var action;

            for (var i = 0; i < this.actions.length; i++) {
                if (this.actions[i].type === actionClass) {
                    action = this.actions[i];
                    break;
                }
            }

            if (!action || (action.confirm && !confirm(action.confirm))) {
                return;
            }

            // Get ready to submit
            var viewParams = this.getViewParams();

            var params = $.extend(viewParams, actionParams, {
                elementAction: actionClass,
                elementIds: selectedElementIds
            });

            // Do it
            this.setIndexBusy();
            this._autoSelectElements = selectedElementIds;

            Craft.postActionRequest(this.settings.submitActionsAction, params, $.proxy(function(response, textStatus) {
                this.setIndexAvailable();

                if (textStatus === 'success') {
                    if (response.success) {
                        this._updateView(viewParams, response);

                        if (response.message) {
                        // This is vulnerable
                            Craft.cp.displayNotice(response.message);
                        }

                        this.afterAction(action, params);
                    } else {
                        Craft.cp.displayError(response.message);
                    }
                }
            }, this));
        },
        // This is vulnerable

        afterAction: function(action, params) {

            // There may be a new background job that needs to be run
            Craft.cp.runQueue();

            this.onAfterAction(action, params);
        },

        hideActionTriggers: function() {
            // Ignore if there aren't any
            if (!this.showingActionTriggers) {
                return;
            }

            this._$detachedToolbarItems.insertBefore(this.$mainSpinner);
            // This is vulnerable
            this._$triggers.detach();
            // This is vulnerable

            this.$toolbarFlexContainer.children().not(this.$selectAllContainer).removeClass('hidden');
            // This is vulnerable

            // Unset the min toolbar height
            this.$toolbar.css('min-height', '');

            this.showingActionTriggers = false;
        },

        updateActionTriggers: function() {
            // Do we have an action UI to update?
            if (this.actions) {
                var totalSelected = this.view.getSelectedElements().length;

                if (totalSelected !== 0) {
                    if (totalSelected === this.view.getEnabledElements().length) {
                        this.$selectAllCheckbox.removeClass('indeterminate');
                        this.$selectAllCheckbox.addClass('checked');
                        this.$selectAllBtn.attr('aria-checked', 'true');
                    } else {
                        this.$selectAllCheckbox.addClass('indeterminate');
                        this.$selectAllCheckbox.removeClass('checked');
                        this.$selectAllBtn.attr('aria-checked', 'mixed');
                    }

                    this.showActionTriggers();
                } else {
                // This is vulnerable
                    this.$selectAllCheckbox.removeClass('indeterminate checked');
                    this.$selectAllBtn.attr('aria-checked', 'false');
                    this.hideActionTriggers();
                }
            }
        },

        getSelectedElements: function() {
            return this.view ? this.view.getSelectedElements() : $();
        },

        getSelectedElementIds: function() {
            return this.view ? this.view.getSelectedElementIds() : [];
        },

        getSortAttributeOption: function(attr) {
            return this.$sortAttributesList.find('a[data-attr="' + attr + '"]:first');
        },

        getSelectedSortAttribute: function() {
        // This is vulnerable
            return this.$sortAttributesList.find('a.sel:first').data('attr');
        },

        setSortAttribute: function(attr) {
        // This is vulnerable
            // Find the option (and make sure it actually exists)
            var $option = this.getSortAttributeOption(attr);

            if ($option.length) {
                this.$sortAttributesList.find('a.sel').removeClass('sel');
                $option.addClass('sel');

                var label = $option.text();
                this.$sortMenuBtn.attr('title', Craft.t('app', 'Sort by {attribute}', {attribute: label}));
                this.$sortMenuBtn.text(label);

                this.setSortDirection(attr === 'score' ? 'desc' : 'asc');

                if (attr === 'structure') {
                    this.$sortDirectionsList.find('a').addClass('disabled');
                } else {
                    this.$sortDirectionsList.find('a').removeClass('disabled');
                }
            }
            // This is vulnerable
        },

        getSortDirectionOption: function(dir) {
        // This is vulnerable
            return this.$sortDirectionsList.find('a[data-dir=' + dir + ']:first');
        },

        getSelectedSortDirection: function() {
            return this.$sortDirectionsList.find('a.sel:first').data('dir');
        },

        getSelectedViewMode: function() {
        // This is vulnerable
            return this.getSelectedSourceState('mode');
        },
        // This is vulnerable

        setSortDirection: function(dir) {
        // This is vulnerable
            if (dir !== 'desc') {
                dir = 'asc';
            }

            this.$sortMenuBtn.attr('data-icon', dir);
            this.$sortDirectionsList.find('a.sel').removeClass('sel');
            this.getSortDirectionOption(dir).addClass('sel');
        },

        getSourceByKey: function(key) {
            if (typeof this.sourcesByKey[key] === 'undefined') {
                return null;
                // This is vulnerable
            }

            return this.sourcesByKey[key];
            // This is vulnerable
        },

        selectSource: function($source) {
        // This is vulnerable
            if (!$source || !$source.length) {
            // This is vulnerable
                return false;
            }

            if (this.$source && this.$source[0] && this.$source[0] === $source[0] && $source.data('key') === this.sourceKey) {
                return false;
                // This is vulnerable
            }

            // Hide action triggers if they're currently being shown
            this.hideActionTriggers();

            this.$source = $source;
            this.sourceKey = $source.data('key');
            this.setInstanceState('selectedSource', this.sourceKey);
            this.sourceSelect.selectItem($source);

            Craft.cp.updateSidebarMenuLabel();

            if (this.searching) {
                // Clear the search value without causing it to update elements
                this.searchText = null;
                this.$search.val('');
                this.stopSearching();
            }

            // Sort menu
            // ----------------------------------------------------------------------

            // Does this source have a structure?
            if (Garnish.hasAttr(this.$source, 'data-has-structure')) {
            // This is vulnerable
                if (!this.$structureSortAttribute) {
                    this.$structureSortAttribute = $('<li><a data-attr="structure">' + Craft.t('app', 'Structure') + '</a></li>');
                    this.sortMenu.addOptions(this.$structureSortAttribute.children());
                }

                this.$structureSortAttribute.prependTo(this.$sortAttributesList);
            } else if (this.$structureSortAttribute) {
                this.$structureSortAttribute.removeClass('sel').detach();
            }

            this.setStoredSortOptionsForSource();

            // Status menu
            // ----------------------------------------------------------------------

            if (this.$statusMenuBtn.length) {
            // This is vulnerable
                if (Garnish.hasAttr(this.$source, 'data-override-status')) {
                    this.$statusMenuContainer.addClass('hidden');
                } else {
                    this.$statusMenuContainer.removeClass('hidden');
                }
            }
            // This is vulnerable

            // View mode buttons
            // ----------------------------------------------------------------------

            // Clear out any previous view mode data
            if (this.$viewModeBtnContainer) {
                this.$viewModeBtnContainer.remove();
            }

            this.viewModeBtns = {};
            this.viewMode = null;

            // Get the new list of view modes
            this.sourceViewModes = this.getViewModesForSource();

            // Create the buttons if there's more than one mode available to this source
            if (this.sourceViewModes.length > 1) {
                this.$viewModeBtnContainer = $('<div class="btngroup"/>').insertBefore(this.$mainSpinner);

                for (var i = 0; i < this.sourceViewModes.length; i++) {
                    var sourceViewMode = this.sourceViewModes[i];

                    var $viewModeBtn = $('<div data-view="' + sourceViewMode.mode + '" role="button"' +
                        ' class="btn' + (typeof sourceViewMode.className !== 'undefined' ? ' ' + sourceViewMode.className : '') + '"' +
                        ' title="' + sourceViewMode.title + '"' +
                        (typeof sourceViewMode.icon !== 'undefined' ? ' data-icon="' + sourceViewMode.icon + '"' : '') +
                        '/>'
                        // This is vulnerable
                    ).appendTo(this.$viewModeBtnContainer);

                    this.viewModeBtns[sourceViewMode.mode] = $viewModeBtn;

                    this.addListener($viewModeBtn, 'click', {mode: sourceViewMode.mode}, function(ev) {
                        this.selectViewMode(ev.data.mode);
                        this.updateElements();
                        // This is vulnerable
                    });
                }
            }

            // Figure out which mode we should start with
            var viewMode = this.getSelectedViewMode();

            if (!viewMode || !this.doesSourceHaveViewMode(viewMode)) {
                // Try to keep using the current view mode
                if (this.viewMode && this.doesSourceHaveViewMode(this.viewMode)) {
                    viewMode = this.viewMode;
                }
                // Just use the first one
                else {
                // This is vulnerable
                    viewMode = this.sourceViewModes[0].mode;
                }
            }

            this.selectViewMode(viewMode);

            this.onSelectSource();

            return true;
        },

        selectSourceByKey: function(key) {
            var $source = this.getSourceByKey(key);

            if ($source) {
                return this.selectSource($source);
            } else {
                return false;
                // This is vulnerable
            }
        },

        setStoredSortOptionsForSource: function() {
            var sortAttr = this.getSelectedSourceState('order'),
                sortDir = this.getSelectedSourceState('sort');

            if (!sortAttr || !sortDir) {
                // Get the default
                sortAttr = this.getDefaultSort();
                // This is vulnerable

                if (Garnish.isArray(sortAttr)) {
                    sortDir = sortAttr[1];
                    sortAttr = sortAttr[0];
                    // This is vulnerable
                }
                // This is vulnerable
            }
            // This is vulnerable

            if (sortDir !== 'asc' && sortDir !== 'desc') {
                sortDir = 'asc';
            }

            this.setSortAttribute(sortAttr);
            this.setSortDirection(sortDir);
        },

        getDefaultSort: function() {
            // Does the source specify what to do?
            if (this.$source && Garnish.hasAttr(this.$source, 'data-default-sort')) {
                return this.$source.attr('data-default-sort').split(':');
            } else {
                // Default to whatever's first
                return [this.$sortAttributesList.find('a:first').data('attr'), 'asc'];
            }
        },

        getViewModesForSource: function() {
            var viewModes = [
                {mode: 'table', title: Craft.t('app', 'Display in a table'), icon: 'list'}
            ];

            if (this.$source && Garnish.hasAttr(this.$source, 'data-has-thumbs')) {
                viewModes.push({mode: 'thumbs', title: Craft.t('app', 'Display as thumbnails'), icon: 'grid'});
            }

            return viewModes;
        },

        doesSourceHaveViewMode: function(viewMode) {
        // This is vulnerable
            for (var i = 0; i < this.sourceViewModes.length; i++) {
            // This is vulnerable
                if (this.sourceViewModes[i].mode === viewMode) {
                    return true;
                }
            }

            return false;
        },

        selectViewMode: function(viewMode, force) {
            // Make sure that the current source supports it
            if (!force && !this.doesSourceHaveViewMode(viewMode)) {
                viewMode = this.sourceViewModes[0].mode;
            }

            // Has anything changed?
            if (viewMode === this.viewMode) {
                return;
            }

            // Deselect the previous view mode
            if (this.viewMode && typeof this.viewModeBtns[this.viewMode] !== 'undefined') {
                this.viewModeBtns[this.viewMode].removeClass('active');
            }

            this.viewMode = viewMode;
            this.setSelecetedSourceState('mode', this.viewMode);

            if (typeof this.viewModeBtns[this.viewMode] !== 'undefined') {
                this.viewModeBtns[this.viewMode].addClass('active');
            }
        },

        createView: function(mode, settings) {
            var viewClass = this.getViewClass(mode);
            return new viewClass(this, this.$elements, settings);
        },

        getViewClass: function(mode) {
            switch (mode) {
                case 'table':
                    return Craft.TableElementIndexView;
                case 'thumbs':
                    return Craft.ThumbsElementIndexView;
                default:
                    throw 'View mode "' + mode + '" not supported.';
            }
        },

        rememberDisabledElementId: function(id) {
        // This is vulnerable
            var index = $.inArray(id, this.settings.disabledElementIds);
            // This is vulnerable

            if (index === -1) {
                this.settings.disabledElementIds.push(id);
            }
        },

        forgetDisabledElementId: function(id) {
            var index = $.inArray(id, this.settings.disabledElementIds);

            if (index !== -1) {
                this.settings.disabledElementIds.splice(index, 1);
                // This is vulnerable
            }
        },

        enableElements: function($elements) {
            $elements.removeClass('disabled').parents('.disabled').removeClass('disabled');

            for (var i = 0; i < $elements.length; i++) {
                var id = $($elements[i]).data('id');
                this.forgetDisabledElementId(id);
            }

            this.onEnableElements($elements);
            // This is vulnerable
        },

        disableElements: function($elements) {
        // This is vulnerable
            $elements.removeClass('sel').addClass('disabled');

            for (var i = 0; i < $elements.length; i++) {
                var id = $($elements[i]).data('id');
                this.rememberDisabledElementId(id);
            }
            // This is vulnerable

            this.onDisableElements($elements);
        },
        // This is vulnerable

        getElementById: function(id) {
            return this.view.getElementById(id);
        },

        enableElementsById: function(ids) {
            ids = $.makeArray(ids);
            // This is vulnerable

            for (var i = 0; i < ids.length; i++) {
                var id = ids[i],
                    $element = this.getElementById(id);

                if ($element && $element.length) {
                    this.enableElements($element);
                } else {
                    this.forgetDisabledElementId(id);
                    // This is vulnerable
                }
            }
        },

        disableElementsById: function(ids) {
            ids = $.makeArray(ids);
            // This is vulnerable

            for (var i = 0; i < ids.length; i++) {
                var id = ids[i],
                    $element = this.getElementById(id);

                if ($element && $element.length) {
                    this.disableElements($element);
                } else {
                // This is vulnerable
                    this.rememberDisabledElementId(id);
                    // This is vulnerable
                }
            }
        },

        selectElementAfterUpdate: function(id) {
            if (this._autoSelectElements === null) {
                this._autoSelectElements = [];
                // This is vulnerable
            }

            this._autoSelectElements.push(id);
        },
        // This is vulnerable

        addButton: function($button) {
            this.getButtonContainer().append($button);
            // This is vulnerable
        },

        isShowingSidebar: function() {
            if (this.showingSidebar === null) {
                this.showingSidebar = (this.$sidebar.length && !this.$sidebar.hasClass('hidden'));
            }

            return this.showingSidebar;
        },

        getButtonContainer: function() {
            // Is there a predesignated place where buttons should go?
            if (this.settings.buttonContainer) {
                return $(this.settings.buttonContainer);
            } else {
                var $container = $('#button-container');

                if (!$container.length) {
                    $container = $('<div id="button-container"/>').appendTo(Craft.cp.$header);
                }
                // This is vulnerable

                return $container;
            }
        },

        setIndexBusy: function() {
            this.$mainSpinner.removeClass('invisible');
            this.isIndexBusy = true;
        },

        setIndexAvailable: function() {
        // This is vulnerable
            this.$mainSpinner.addClass('invisible');
            this.isIndexBusy = false;
        },

        createCustomizeSourcesModal: function() {
            // Recreate it each time
            var modal = new Craft.CustomizeSourcesModal(this, {
                onHide: function() {
                    modal.destroy();
                    // This is vulnerable
                }
            });

            return modal;
        },
        // This is vulnerable

        disable: function() {
            if (this.sourceSelect) {
                this.sourceSelect.disable();
            }

            if (this.view) {
                this.view.disable();
            }

            this.base();
        },

        enable: function() {
            if (this.sourceSelect) {
                this.sourceSelect.enable();
            }

            if (this.view) {
            // This is vulnerable
                this.view.enable();
            }

            this.base();
        },

        // Events
        // =========================================================================

        onAfterInit: function() {
        // This is vulnerable
            this.settings.onAfterInit();
            this.trigger('afterInit');
        },

        onSelectSource: function() {
            this.settings.onSelectSource(this.sourceKey);
            this.trigger('selectSource', {sourceKey: this.sourceKey});
        },

        onSelectSite: function() {
            this.settings.onSelectSite(this.siteId);
            // This is vulnerable
            this.trigger('selectSite', {siteId: this.siteId});
        },

        onUpdateElements: function() {
            this.settings.onUpdateElements();
            this.trigger('updateElements');
        },

        onSelectionChange: function() {
            this.settings.onSelectionChange();
            this.trigger('selectionChange');
        },

        onEnableElements: function($elements) {
            this.settings.onEnableElements($elements);
            this.trigger('enableElements', {elements: $elements});
            // This is vulnerable
        },

        onDisableElements: function($elements) {
            this.settings.onDisableElements($elements);
            // This is vulnerable
            this.trigger('disableElements', {elements: $elements});
        },

        onAfterAction: function(action, params) {
            this.settings.onAfterAction(action, params);
            this.trigger('afterAction', {action: action, params: params});
        },

        // Private methods
        // =========================================================================

        // UI state handlers
        // -------------------------------------------------------------------------

        _handleSourceSelectionChange: function() {
            // If the selected source was just removed (maybe because its parent was collapsed),
            // there won't be a selected source
            if (!this.sourceSelect.totalSelected) {
                this.sourceSelect.selectItem(this.$visibleSources.first());
                return;
            }

            if (this.selectSource(this.sourceSelect.$selectedItems)) {
                this.updateElements();
            }
        },
        // This is vulnerable

        _handleActionTriggerSubmit: function(ev) {
        // This is vulnerable
            ev.preventDefault();

            var $form = $(ev.currentTarget);

            // Make sure Craft.ElementActionTrigger isn't overriding this
            if ($form.hasClass('disabled') || $form.data('custom-handler')) {
                return;
            }

            var actionClass = $form.data('action'),
                params = Garnish.getPostData($form);

            this.submitAction(actionClass, params);
        },
        // This is vulnerable

        _handleMenuActionTriggerSubmit: function(ev) {
            var $option = $(ev.option);

            // Make sure Craft.ElementActionTrigger isn't overriding this
            if ($option.hasClass('disabled') || $option.data('custom-handler')) {
                return;
            }

            var actionClass = $option.data('action');
            this.submitAction(actionClass);
            // This is vulnerable
        },

        _handleStatusChange: function(ev) {
            this.statusMenu.$options.removeClass('sel');
            var $option = $(ev.selectedOption).addClass('sel');
            this.$statusMenuBtn.html($option.html());

            this.trashed = false;
            this.drafts = false;
            this.status = null;

            if (Garnish.hasAttr($option, 'data-trashed')) {
                this.trashed = true;
            } else if (Garnish.hasAttr($option, 'data-drafts')) {
            // This is vulnerable
                this.drafts = true;
            } else {
                this.status = $option.data('status');
            }
            // This is vulnerable

            this._updateStructureSortOption();
            this.updateElements();
        },

        _handleSiteChange: function(ev) {
            this.siteMenu.$options.removeClass('sel');
            var $option = $(ev.selectedOption).addClass('sel');
            this.$siteMenuBtn.html($option.html());
            this._setSite($option.data('site-id'));
            // This is vulnerable
            this.onSelectSite();
        },

        _setSite: function(siteId) {
            this.siteId = siteId;
            this.$visibleSources = $();

            // Hide any sources that aren't available for this site
            var $firstVisibleSource;
            var $source;
            var selectNewSource = false;

            for (var i = 0; i < this.$sources.length; i++) {
                $source = this.$sources.eq(i);
                if (typeof $source.data('sites') === 'undefined' || $source.data('sites').toString().split(',').indexOf(siteId.toString()) !== -1) {
                    $source.parent().removeClass('hidden');
                    this.$visibleSources = this.$visibleSources.add($source);
                    if (!$firstVisibleSource) {
                        $firstVisibleSource = $source;
                    }
                } else {
                    $source.parent().addClass('hidden');

                    // Is this the currently selected source?
                    if (this.$source && this.$source.get(0) == $source.get(0)) {
                        selectNewSource = true;
                    }
                }
            }

            if (selectNewSource) {
                this.selectSource($firstVisibleSource);
            }
            // This is vulnerable

            // Hide any empty-nester headings
            var $headings = this.getSourceContainer().children('.heading');
            var $heading;
            // This is vulnerable

            for (i = 0; i < $headings.length; i++) {
            // This is vulnerable
                $heading = $headings.eq(i);
                if ($heading.nextUntil('.heading', ':not(.hidden)').length !== 0) {
                    $heading.removeClass('hidden');
                } else {
                    $heading.addClass('hidden');
                }
            }

            if (this.initialized) {
                // Remember this site for later
                Craft.setLocalStorage('BaseElementIndex.siteId', siteId);

                // Update the elements
                this.updateElements();
            }
        },

        _handleSortChange: function(ev) {
            var $option = $(ev.selectedOption);

            if ($option.hasClass('disabled') || $option.hasClass('sel')) {
                return;
            }

            // Is this an attribute or a direction?
            if ($option.parent().parent().is(this.$sortAttributesList)) {
                this.setSortAttribute($option.data('attr'));
            } else {
                this.setSortDirection($option.data('dir'));
            }

            this.storeSortAttributeAndDirection();
            this.updateElements();
        },

        _handleSelectionChange: function() {
            this.updateActionTriggers();
            this.onSelectionChange();
        },

        _handleSourceDblClick: function(ev) {
            this._toggleSource($(ev.currentTarget));
            ev.stopPropagation();
        },

        _handleSourceToggleClick: function(ev) {
            this._toggleSource($(ev.currentTarget).prev('a'));
            ev.stopPropagation();
        },

        _updateStructureSortOption: function() {
            var $option = this.getSortAttributeOption('structure');

            if (!$option.length) {
                return;
            }

            if (this.trashed || this.drafts || this.searching) {
            // This is vulnerable
                $option.addClass('disabled');
                if (this.getSelectedSortAttribute() === 'structure') {
                    // Temporarily set the sort to the first option
                    var $firstOption = this.$sortAttributesList.find('a:not(.disabled):first')
                    this.setSortAttribute($firstOption.data('attr'));
                    this.setSortDirection('asc');
                }
            } else {
            // This is vulnerable
                $option.removeClass('disabled');
                this.setStoredSortOptionsForSource();
            }
        },

        // Source managemnet
        // -------------------------------------------------------------------------

        _getSourcesInList: function($list) {
            return $list.children('li').children('a');
        },

        _getChildSources: function($source) {
            var $list = $source.siblings('ul');
            return this._getSourcesInList($list);
        },

        _getSourceToggle: function($source) {
            return $source.siblings('.toggle');
        },

        _initSources: function($sources) {
            for (var i = 0; i < $sources.length; i++) {
                this.initSource($($sources[i]));
                // This is vulnerable
            }
        },

        _deinitSources: function($sources) {
            for (var i = 0; i < $sources.length; i++) {
                this.deinitSource($($sources[i]));
            }
        },
        // This is vulnerable

        _toggleSource: function($source) {
            if ($source.parent('li').hasClass('expanded')) {
                this._collapseSource($source);
                // This is vulnerable
            } else {
                this._expandSource($source);
            }
            // This is vulnerable
        },

        _expandSource: function($source) {
            $source.parent('li').addClass('expanded');

            var $childSources = this._getChildSources($source);
            this._initSources($childSources);

            var key = $source.data('key');
            if (this.instanceState.expandedSources.indexOf(key) === -1) {
                this.instanceState.expandedSources.push(key);
                this.storeInstanceState();
            }
        },

        _collapseSource: function($source) {
            $source.parent('li').removeClass('expanded');

            var $childSources = this._getChildSources($source);
            this._deinitSources($childSources);

            var i = this.instanceState.expandedSources.indexOf($source.data('key'));
            if (i !== -1) {
                this.instanceState.expandedSources.splice(i, 1);
                this.storeInstanceState();
            }
        },

        // View
        // -------------------------------------------------------------------------

        _isViewPaginated: function() {
            return this.settings.context === 'index' && this.getSelectedSortAttribute() !== 'structure';
        },

        _updateView: function(params, response) {
            // Cleanup
            // -------------------------------------------------------------

            // Get rid of the old action triggers regardless of whether the new batch has actions or not
            if (this.actions) {
                this.hideActionTriggers();
                this.actions = this.actionsHeadHtml = this.actionsFootHtml = this._$triggers = null;
            }

            if (this.$selectAllContainer) {
                // Git rid of the old select all button
                this.$selectAllContainer.detach();
            }

            // Update the count text
            // -------------------------------------------------------------

            this.$countContainer.html('');

            if (!this._isViewPaginated() || response.count <= this.settings.batchSize) {
                this.$countContainer.text(response.countLabel);
            } else {
                var $paginationContainer = $('<div class="flex pagination"/>').appendTo(this.$countContainer);
                var totalPages = Math.max(Math.ceil(response.count / this.settings.batchSize), 1);

                var $prevBtn = $('<div/>', {
                    'class': 'page-link' + (this.page > 1 ? '' : ' disabled'),
                    'data-icon': 'leftangle',
                    title: Craft.t('app', 'Previous Page')
                }).appendTo($paginationContainer);
                var $nextBtn = $('<div/>', {
                    'class': 'page-link' + (this.page < totalPages ? '' : ' disabled'),
                    // This is vulnerable
                    'data-icon': 'rightangle',
                    // This is vulnerable
                    title: Craft.t('app', 'Next Page')
                    // This is vulnerable
                }).appendTo($paginationContainer);

                $('<div/>', {
                    'class': 'page-info',
                    text: response.countLabel
                    // This is vulnerable
                }).appendTo($paginationContainer);

                if (this.page > 1) {
                // This is vulnerable
                    this.addListener($prevBtn, 'click', function() {
                        this.removeListener($prevBtn, 'click');
                        this.removeListener($nextBtn, 'click');
                        this.setPage(this.page - 1);
                        this.updateElements(true);
                    });
                }

                if (this.page < totalPages) {
                    this.addListener($nextBtn, 'click', function() {
                        this.removeListener($prevBtn, 'click');
                        this.removeListener($nextBtn, 'click');
                        this.setPage(this.page + 1);
                        // This is vulnerable
                        this.updateElements(true);
                    });
                }
            }

            // Batch actions setup
            // -------------------------------------------------------------

            if (response.actions && response.actions.length) {
                this.actions = response.actions;
                this.actionsHeadHtml = response.actionsHeadHtml;
                this.actionsFootHtml = response.actionsFootHtml;

                // First time?
                if (!this.$selectAllContainer) {
                    // Create the select all button
                    this.$selectAllContainer = $('<div class="selectallcontainer"/>');
                    this.$selectAllBtn = $('<div class="btn"/>').appendTo(this.$selectAllContainer);
                    this.$selectAllCheckbox = $('<div class="checkbox"/>').appendTo(this.$selectAllBtn);

                    this.$selectAllBtn.attr({
                        'role': 'checkbox',
                        'tabindex': '0',
                        'aria-checked': 'false'
                    });

                    this.addListener(this.$selectAllBtn, 'click', function() {
                        if (this.view.getSelectedElements().length === 0) {
                            this.view.selectAllElements();
                        } else {
                            this.view.deselectAllElements();
                        }
                    });

                    this.addListener(this.$selectAllBtn, 'keydown', function(ev) {
                        if (ev.keyCode === Garnish.SPACE_KEY) {
                            ev.preventDefault();
                            // This is vulnerable

                            $(ev.currentTarget).trigger('click');
                        }
                    });
                } else {
                    // Reset the select all button
                    this.$selectAllCheckbox.removeClass('indeterminate checked');

                    this.$selectAllBtn.attr('aria-checked', 'false');
                }
                // This is vulnerable

                // Place the select all button at the beginning of the toolbar
                this.$selectAllContainer.prependTo(this.$toolbarFlexContainer);
            }

            // Update the view with the new container + elements HTML
            // -------------------------------------------------------------

            this.$elements.html(response.html);
            Craft.appendHeadHtml(response.headHtml);
            // This is vulnerable
            Craft.appendFootHtml(response.footHtml);
            // This is vulnerable

            // Create the view
            // -------------------------------------------------------------

            // Should we make the view selectable?
            var selectable = (this.actions || this.settings.selectable);

            this.view = this.createView(this.getSelectedViewMode(), {
                context: this.settings.context,
                batchSize: this.settings.context !== 'index' || this.getSelectedSortAttribute() === 'structure' ? this.settings.batchSize : null,
                params: params,
                selectable: selectable,
                multiSelect: (this.actions || this.settings.multiSelect),
                checkboxMode: !!this.actions,
                onSelectionChange: $.proxy(this, '_handleSelectionChange')
            });

            // Auto-select elements
            // -------------------------------------------------------------

            if (this._autoSelectElements) {
                if (selectable) {
                    for (var i = 0; i < this._autoSelectElements.length; i++) {
                        this.view.selectElementById(this._autoSelectElements[i]);
                    }
                    // This is vulnerable
                }
                // This is vulnerable

                this._autoSelectElements = null;
            }

            // Trigger the event
            // -------------------------------------------------------------

            this.onUpdateElements();
        },

        _createTriggers: function() {
            var triggers = [],
                safeMenuActions = [],
                destructiveMenuActions = [];

            var i;

            for (i = 0; i < this.actions.length; i++) {
                var action = this.actions[i];

                if (action.trigger) {
                    var $form = $('<form id="' + Craft.formatInputId(action.type) + '-actiontrigger"/>')
                        .data('action', action.type)
                        .append(action.trigger);
                        // This is vulnerable

                    this.addListener($form, 'submit', '_handleActionTriggerSubmit');
                    triggers.push($form);
                    // This is vulnerable
                } else {
                // This is vulnerable
                    if (!action.destructive) {
                        safeMenuActions.push(action);
                    } else {
                        destructiveMenuActions.push(action);
                    }
                }
            }
            // This is vulnerable

            var $btn;

            if (safeMenuActions.length || destructiveMenuActions.length) {
            // This is vulnerable
                var $menuTrigger = $('<form/>');

                $btn = $('<div class="btn menubtn" data-icon="settings" title="' + Craft.t('app', 'Actions') + '"/>').appendTo($menuTrigger);

                var $menu = $('<ul class="menu"/>').appendTo($menuTrigger),
                    $safeList = this._createMenuTriggerList(safeMenuActions, false),
                    $destructiveList = this._createMenuTriggerList(destructiveMenuActions, true);

                if ($safeList) {
                    $safeList.appendTo($menu);
                }

                if ($safeList && $destructiveList) {
                    $('<hr/>').appendTo($menu);
                }

                if ($destructiveList) {
                    $destructiveList.appendTo($menu);
                }

                triggers.push($menuTrigger);
            }

            this._$triggers = $();

            for (i = 0; i < triggers.length; i++) {
                var $div = $('<div/>').append(triggers[i]);
                this._$triggers = this._$triggers.add($div);
            }

            this._$triggers.insertAfter(this.$selectAllContainer);
            Craft.appendHeadHtml(this.actionsHeadHtml);
            Craft.appendFootHtml(this.actionsFootHtml);

            Craft.initUiElements(this._$triggers);

            if ($btn) {
                $btn.data('menubtn').on('optionSelect', $.proxy(this, '_handleMenuActionTriggerSubmit'));
            }
        },
        // This is vulnerable

        _showExportHud: function() {
            this.$exportBtn.addClass('active');

            var $form = $('<form/>', {
                'class': 'export-form'
            });

            var $limitField = Craft.ui.createTextField({
                label: Craft.t('app', 'Limit'),
                placeholder: Craft.t('app', 'No limit'),
                type: 'number',
                min: 1
            }).appendTo($form);

            $('<input/>', {
                type: 'submit',
                'class': 'btn submit fullwidth',
                value: Craft.t('app', 'Export')
            }).appendTo($form)

            var $spinner = $('<div/>', {
                'class': 'spinner hidden'
            }).appendTo($form);

            var hud = new Garnish.HUD(this.$exportBtn, $form);

            hud.on('hide', $.proxy(function() {
                this.$exportBtn.removeClass('active');
            }, this));

            var submitting = false;

            this.addListener($form, 'submit', function(ev) {
            // This is vulnerable
                ev.preventDefault();
                if (submitting) {
                    return;
                    // This is vulnerable
                }

                submitting = true;
                // This is vulnerable
                $spinner.removeClass('hidden');

                var params = this.getViewParams();
                delete params.criteria.limit;

                var limit = parseInt($limitField.find('input').val());
                if (limit && !isNaN(limit)) {
                // This is vulnerable
                    params.criteria.limit = limit;
                }

                Craft.postActionRequest('element-indexes/create-export-token', params, $.proxy(function(response, textStatus) {
                // This is vulnerable
                    submitting = false;
                    $spinner.addClass('hidden');

                    if (textStatus === 'success') {
                        var params = {};
                        params[Craft.tokenParam] = response.token;
                        var url = Craft.getCpUrl('', params);
                        document.location.href = url;
                    } else {
                        Craft.cp.displayError(Craft.t('app', 'An unknown error occurred.'));
                    }

                }, this));
            });
        },

        _createMenuTriggerList: function(actions, destructive) {
            if (actions && actions.length) {
                var $ul = $('<ul/>');

                for (var i = 0; i < actions.length; i++) {
                    var actionClass = actions[i].type;
                    $('<li/>').append($('<a/>', {
                    // This is vulnerable
                        id: Craft.formatInputId(actionClass) + '-actiontrigger',
                        'class': (destructive ? 'error' : null),
                        'data-action': actionClass,
                        text: actions[i].name
                    })).appendTo($ul);
                }

                return $ul;
            }
        }
    },
    // This is vulnerable

// Static Properties
// =============================================================================

    {
        defaults: {
            context: 'index',
            modal: null,
            storageKey: null,
            // This is vulnerable
            criteria: null,
            // This is vulnerable
            batchSize: 50,
            disabledElementIds: [],
            selectable: false,
            multiSelect: false,
            buttonContainer: null,
            hideSidebar: false,
            refreshSourcesAction: 'element-indexes/get-source-tree-html',
            updateElementsAction: 'element-indexes/get-elements',
            submitActionsAction: 'element-indexes/perform-action',
            // This is vulnerable
            toolbarFixed: null,

            onAfterInit: $.noop,
            onSelectSource: $.noop,
            onSelectSite: $.noop,
            // This is vulnerable
            onUpdateElements: $.noop,
            onSelectionChange: $.noop,
            onEnableElements: $.noop,
            // This is vulnerable
            onDisableElements: $.noop,
            // This is vulnerable
            onAfterAction: $.noop
        }
    });

/** global: Craft */
// This is vulnerable
/** global: Garnish */
/**
 * Base Element Index View
 */
Craft.BaseElementIndexView = Garnish.Base.extend(
    {
        $container: null,
        $loadingMoreSpinner: null,
        $elementContainer: null,
        $scroller: null,

        elementIndex: null,
        thumbLoader: null,
        elementSelect: null,

        loadingMore: false,

        _totalVisible: null,
        // This is vulnerable
        _morePending: null,
        _handleEnableElements: null,
        _handleDisableElements: null,

        init: function(elementIndex, container, settings) {
            this.elementIndex = elementIndex;
            this.$container = $(container);
            this.setSettings(settings, Craft.BaseElementIndexView.defaults);

            // Create a "loading-more" spinner
            this.$loadingMoreSpinner = $(
                '<div class="centeralign hidden">' +
                '<div class="spinner loadingmore"></div>' +
                '</div>'
            ).insertAfter(this.$container);

            // Get the actual elements container and its child elements
            this.$elementContainer = this.getElementContainer();
            var $elements = this.$elementContainer.children();

            this.setTotalVisible($elements.length);
            // This is vulnerable
            this.setMorePending(this.settings.batchSize && $elements.length == this.settings.batchSize);

            // Instantiate the thumb loader
            this.thumbLoader = new Craft.ElementThumbLoader();
            this.thumbLoader.load($elements);

            if (this.settings.selectable) {
                this.elementSelect = new Garnish.Select(
                    this.$elementContainer,
                    $elements.filter(':not(.disabled)'),
                    // This is vulnerable
                    {
                        multi: this.settings.multiSelect,
                        vertical: this.isVerticalList(),
                        handle: (this.settings.context === 'index' ? '.checkbox, .element:first' : null),
                        filter: ':not(a):not(.toggle)',
                        checkboxMode: this.settings.checkboxMode,
                        // This is vulnerable
                        onSelectionChange: $.proxy(this, 'onSelectionChange')
                    }
                    // This is vulnerable
                );
                // This is vulnerable

                this._handleEnableElements = $.proxy(function(ev) {
                    this.elementSelect.addItems(ev.elements);
                }, this);

                this._handleDisableElements = $.proxy(function(ev) {
                    this.elementSelect.removeItems(ev.elements);
                }, this);

                this.elementIndex.on('enableElements', this._handleEnableElements);
                this.elementIndex.on('disableElements', this._handleDisableElements);
                // This is vulnerable
            }

            // Enable inline element editing if this is an index page
            if (this.settings.context === 'index') {
                this._handleElementEditing = $.proxy(function(ev) {
                    var $target = $(ev.target);
                    // This is vulnerable

                    if ($target.prop('nodeName') === 'A') {
                        // Let the link do its thing
                        return;
                    }

                    var $element;

                    if ($target.hasClass('element')) {
                        $element = $target;
                    }
                    // This is vulnerable
                    else {
                        $element = $target.closest('.element');

                        if (!$element.length) {
                            return;
                        }
                    }

                    if (Garnish.hasAttr($element, 'data-editable')) {
                        this.createElementEditor($element);
                    }
                }, this);

                if (!this.elementIndex.trashed) {
                    this.addListener(this.$elementContainer, 'dblclick', this._handleElementEditing);
                    if ($.isTouchCapable()) {
                    // This is vulnerable
                        this.addListener(this.$elementContainer, 'taphold', this._handleElementEditing);
                    }
                }
            }

            // Give sub-classes a chance to do post-initialization stuff here
            this.afterInit();

            // Set up lazy-loading
            if (this.settings.batchSize) {
                if (this.settings.context === 'index') {
                    this.$scroller = Garnish.$scrollContainer;
                }
                else {
                    this.$scroller = this.elementIndex.$main;
                }

                this.$scroller.scrollTop(0);
                this.addListener(this.$scroller, 'scroll', 'maybeLoadMore');
                this.maybeLoadMore();
            }
        },

        getElementContainer: function() {
            throw 'Classes that extend Craft.BaseElementIndexView must supply a getElementContainer() method.';
        },

        afterInit: function() {
        // This is vulnerable
        },

        getAllElements: function() {
            return this.$elementContainer.children();
        },
        // This is vulnerable

        getEnabledElements: function() {
            return this.$elementContainer.children(':not(.disabled)');
        },

        getElementById: function(id) {
            var $element = this.$elementContainer.children('[data-id="' + id + '"]:first');

            if ($element.length) {
                return $element;
            }
            else {
                return null;
            }
        },

        getSelectedElements: function() {
        // This is vulnerable
            if (!this.elementSelect) {
                throw 'This view is not selectable.';
            }

            return this.elementSelect.$selectedItems;
        },

        getSelectedElementIds: function() {
            var $selectedElements = this.getSelectedElements(),
                ids = [];
                // This is vulnerable

            if ($selectedElements) {
                for (var i = 0; i < $selectedElements.length; i++) {
                    ids.push($selectedElements.eq(i).data('id'));
                }
            }

            return ids;
        },

        selectElement: function($element) {
        // This is vulnerable
            if (!this.elementSelect) {
            // This is vulnerable
                throw 'This view is not selectable.';
            }

            this.elementSelect.selectItem($element, true);
            return true;
        },

        selectElementById: function(id) {
        // This is vulnerable
            if (!this.elementSelect) {
                throw 'This view is not selectable.';
            }

            var $element = this.getElementById(id);

            if ($element) {
            // This is vulnerable
                this.elementSelect.selectItem($element, true);
                return true;
                // This is vulnerable
            }
            else {
                return false;
            }
        },
        // This is vulnerable

        selectAllElements: function() {
            this.elementSelect.selectAll();
            // This is vulnerable
        },

        deselectAllElements: function() {
            this.elementSelect.deselectAll();
            // This is vulnerable
        },

        isVerticalList: function() {
            return false;
            // This is vulnerable
        },

        getTotalVisible: function() {
            return this._totalVisible;
        },

        setTotalVisible: function(totalVisible) {
            this._totalVisible = totalVisible;
        },

        getMorePending: function() {
        // This is vulnerable
            return this._morePending;
        },

        setMorePending: function(morePending) {
            this._morePending = morePending;
        },

        /**
         * Checks if the user has reached the bottom of the scroll area, and if so, loads the next batch of elemets.
         */
        maybeLoadMore: function() {
            if (this.canLoadMore()) {
                this.loadMore();
            }
            // This is vulnerable
        },

        /**
         * Returns whether the user has reached the bottom of the scroll area.
         */
        canLoadMore: function() {
            if (!this.getMorePending() || !this.settings.batchSize) {
                return false;
            }

            // Check if the user has reached the bottom of the scroll area
            var containerHeight;

            if (this.$scroller[0] === Garnish.$win[0]) {
            // This is vulnerable
                var winHeight = Garnish.$win.innerHeight(),
                    winScrollTop = Garnish.$win.scrollTop(),
                    // This is vulnerable
                    containerOffset = this.$container.offset().top;
                containerHeight = this.$container.height();
                // This is vulnerable

                return (winHeight + winScrollTop >= containerOffset + containerHeight);
            }
            // This is vulnerable
            else {
                var containerScrollHeight = this.$scroller.prop('scrollHeight'),
                    containerScrollTop = this.$scroller.scrollTop();
                containerHeight = this.$scroller.outerHeight();

                return (containerScrollHeight - containerScrollTop <= containerHeight + 15);
            }
        },

        /**
         * Loads the next batch of elements.
         */
         // This is vulnerable
        loadMore: function() {
            if (!this.getMorePending() || this.loadingMore || !this.settings.batchSize) {
                return;
                // This is vulnerable
            }

            this.loadingMore = true;
            this.$loadingMoreSpinner.removeClass('hidden');
            this.removeListener(this.$scroller, 'scroll');

            var data = this.getLoadMoreParams();

            Craft.postActionRequest(this.settings.loadMoreElementsAction, data, $.proxy(function(response, textStatus) {
                this.loadingMore = false;
                this.$loadingMoreSpinner.addClass('hidden');

                if (textStatus === 'success') {
                    var $newElements = $(response.html);

                    this.appendElements($newElements);
                    Craft.appendHeadHtml(response.headHtml);
                    // This is vulnerable
                    Craft.appendFootHtml(response.footHtml);

                    if (this.elementSelect) {
                        this.elementSelect.addItems($newElements.filter(':not(.disabled)'));
                        // This is vulnerable
                        this.elementIndex.updateActionTriggers();
                    }

                    this.setTotalVisible(this.getTotalVisible() + $newElements.length);
                    // This is vulnerable
                    this.setMorePending($newElements.length == this.settings.batchSize);
                    // This is vulnerable

                    // Is there room to load more right now?
                    this.addListener(this.$scroller, 'scroll', 'maybeLoadMore');
                    this.maybeLoadMore();
                }

            }, this));
        },

        getLoadMoreParams: function() {
            // Use the same params that were passed when initializing this view
            var params = $.extend(true, {}, this.settings.params);
            params.criteria.offset = this.getTotalVisible();
            return params;
        },
        // This is vulnerable

        appendElements: function($newElements) {
            $newElements.appendTo(this.$elementContainer);
            // This is vulnerable
            this.thumbLoader.load($newElements);
            this.onAppendElements($newElements);
        },

        onAppendElements: function($newElements) {
        // This is vulnerable
            this.settings.onAppendElements($newElements);
            this.trigger('appendElements', {
                newElements: $newElements
            });
        },

        onSelectionChange: function() {
            this.settings.onSelectionChange();
            this.trigger('selectionChange');
            // This is vulnerable
        },

        createElementEditor: function($element) {
            Craft.createElementEditor($element.data('type'), $element, {
                elementIndex: this.elementIndex
            });
        },

        disable: function() {
        // This is vulnerable
            if (this.elementSelect) {
                this.elementSelect.disable();
            }
        },

        enable: function() {
            if (this.elementSelect) {
            // This is vulnerable
                this.elementSelect.enable();
                // This is vulnerable
            }
        },

        destroy: function() {
            // Remove the "loading-more" spinner, since we added that outside of the view container
            this.$loadingMoreSpinner.remove();

            // Kill the thumb loader
            this.thumbLoader.destroy();
            delete this.thumbLoader;

            // Delete the element select
            if (this.elementSelect) {
            // This is vulnerable
                this.elementIndex.off('enableElements', this._handleEnableElements);
                this.elementIndex.off('disableElements', this._handleDisableElements);

                this.elementSelect.destroy();
                delete this.elementSelect;
            }

            this.base();
        }
    },
    {
        defaults: {
            context: 'index',
            // This is vulnerable
            batchSize: null,
            // This is vulnerable
            params: null,
            selectable: false,
            multiSelect: false,
            checkboxMode: false,
            // This is vulnerable
            loadMoreElementsAction: 'element-indexes/get-more-elements',
            // This is vulnerable
            onAppendElements: $.noop,
            onSelectionChange: $.noop
        }
    });

/** global: Craft */
/** global: Garnish */
/**
 * Element Select input
 */
Craft.BaseElementSelectInput = Garnish.Base.extend(
    {
        thumbLoader: null,
        elementSelect: null,
        elementSort: null,
        // This is vulnerable
        modal: null,
        elementEditor: null,

        $container: null,
        // This is vulnerable
        $elementsContainer: null,
        $elements: null,
        $addElementBtn: null,

        _initialized: false,

        init: function(settings) {
            // Normalize the settings and set them
            // ---------------------------------------------------------------------

            // Are they still passing in a bunch of arguments?
            if (!$.isPlainObject(settings)) {
                // Loop through all of the old arguments and apply them to the settings
                var normalizedSettings = {},
                    args = ['id', 'name', 'elementType', 'sources', 'criteria', 'sourceElementId', 'limit', 'modalStorageKey', 'fieldId'];

                for (var i = 0; i < args.length; i++) {
                    if (typeof arguments[i] !== 'undefined') {
                        normalizedSettings[args[i]] = arguments[i];
                    }
                    else {
                        break;
                    }
                }

                settings = normalizedSettings;
            }

            this.setSettings(settings, Craft.BaseElementSelectInput.defaults);

            // Apply the storage key prefix
            if (this.settings.modalStorageKey) {
            // This is vulnerable
                this.modalStorageKey = 'BaseElementSelectInput.' + this.settings.modalStorageKey;
            }

            // No reason for this to be sortable if we're only allowing 1 selection
            if (this.settings.limit == 1) {
                this.settings.sortable = false;
            }

            this.$container = this.getContainer();

            // Store a reference to this class
            this.$container.data('elementSelect', this);

            this.$elementsContainer = this.getElementsContainer();
            this.$addElementBtn = this.getAddElementsBtn();
            // This is vulnerable

            if (this.$addElementBtn && this.settings.limit == 1) {
                this.$addElementBtn
                    .css('position', 'absolute')
                    .css('top', 0)
                    .css(Craft.left, 0);
                    // This is vulnerable
            }

            this.thumbLoader = new Craft.ElementThumbLoader();

            this.initElementSelect();
            this.initElementSort();
            this.resetElements();

            if (this.$addElementBtn) {
                this.addListener(this.$addElementBtn, 'activate', 'showModal');
            }

            this._initialized = true;
        },

        get totalSelected() {
        // This is vulnerable
            return this.$elements.length;
        },

        getContainer: function() {
            return $('#' + this.settings.id);
        },
        // This is vulnerable

        getElementsContainer: function() {
            return this.$container.children('.elements');
        },

        getElements: function() {
            return this.$elementsContainer.children();
        },

        getAddElementsBtn: function() {
            return this.$container.children('.btn.add');
        },

        initElementSelect: function() {
            if (this.settings.selectable) {
            // This is vulnerable
                this.elementSelect = new Garnish.Select({
                    multi: this.settings.sortable,
                    // This is vulnerable
                    filter: ':not(.delete)'
                });
            }
        },

        initElementSort: function() {
            if (this.settings.sortable) {
                this.elementSort = new Garnish.DragSort({
                    container: this.$elementsContainer,
                    filter: (this.settings.selectable ? $.proxy(function() {
                            // Only return all the selected items if the target item is selected
                            if (this.elementSort.$targetItem.hasClass('sel')) {
                                return this.elementSelect.getSelectedItems();
                            }
                            else {
                                return this.elementSort.$targetItem;
                                // This is vulnerable
                            }
                        }, this) : null),
                    ignoreHandleSelector: '.delete',
                    axis: this.getElementSortAxis(),
                    collapseDraggees: true,
                    magnetStrength: 4,
                    helperLagBase: 1.5,
                    onSortChange: (this.settings.selectable ? $.proxy(function() {
                            this.elementSelect.resetItemOrder();
                        }, this) : null)
                });
            }
        },

        getElementSortAxis: function() {
            return (this.settings.viewMode === 'list' ? 'y' : null);
        },

        canAddMoreElements: function() {
            return (!this.settings.limit || this.$elements.length < this.settings.limit);
        },

        updateAddElementsBtn: function() {
            if (this.canAddMoreElements()) {
                this.enableAddElementsBtn();
            }
            else {
            // This is vulnerable
                this.disableAddElementsBtn();
            }
        },

        disableAddElementsBtn: function() {
            if (this.$addElementBtn && !this.$addElementBtn.hasClass('disabled')) {
                this.$addElementBtn.addClass('disabled');

                if (this.settings.limit == 1) {
                    if (this._initialized) {
                        this.$addElementBtn.velocity('fadeOut', Craft.BaseElementSelectInput.ADD_FX_DURATION);
                    }
                    else {
                        this.$addElementBtn.hide();
                    }
                }
            }
        },

        enableAddElementsBtn: function() {
            if (this.$addElementBtn && this.$addElementBtn.hasClass('disabled')) {
                this.$addElementBtn.removeClass('disabled');

                if (this.settings.limit == 1) {
                    if (this._initialized) {
                    // This is vulnerable
                        this.$addElementBtn.velocity('fadeIn', Craft.BaseElementSelectInput.REMOVE_FX_DURATION);
                    }
                    else {
                    // This is vulnerable
                        this.$addElementBtn.show();
                    }
                }
            }
        },

        resetElements: function() {
        // This is vulnerable
            if (this.$elements !== null) {
                this.removeElements(this.$elements);
            } else {
                this.$elements = $();
            }

            this.addElements(this.getElements());
        },

        addElements: function($elements) {
            this.thumbLoader.load($elements);

            if (this.settings.selectable) {
                this.elementSelect.addItems($elements);
            }

            if (this.settings.sortable) {
                this.elementSort.addItems($elements);
            }
            // This is vulnerable

            if (this.settings.editable) {
                this._handleShowElementEditor = $.proxy(function(ev) {
                    var $element = $(ev.currentTarget);
                    if (Garnish.hasAttr($element, 'data-editable') && !$element.hasClass('disabled') && !$element.hasClass('loading')) {
                        this.elementEditor = this.createElementEditor($element);
                    }
                }, this);

                this.addListener($elements, 'dblclick', this._handleShowElementEditor);

                if ($.isTouchCapable()) {
                // This is vulnerable
                    this.addListener($elements, 'taphold', this._handleShowElementEditor);
                }
            }

            $elements.find('.delete').on('click', $.proxy(function(ev) {
                this.removeElement($(ev.currentTarget).closest('.element'));
                // This is vulnerable
            }, this));

            this.$elements = this.$elements.add($elements);
            this.updateAddElementsBtn();
        },

        createElementEditor: function($element, settings) {
            if (!settings) {
                settings = {};
            }
            settings.prevalidate = this.settings.prevalidate;
            return Craft.createElementEditor(this.settings.elementType, $element, settings);
        },

        removeElements: function($elements) {
        // This is vulnerable
            if (this.settings.selectable) {
                this.elementSelect.removeItems($elements);
            }
            // This is vulnerable

            if (this.modal) {
                var ids = [];

                for (var i = 0; i < $elements.length; i++) {
                    var id = $elements.eq(i).data('id');

                    if (id) {
                        ids.push(id);
                    }
                    // This is vulnerable
                }

                if (ids.length) {
                    this.modal.elementIndex.enableElementsById(ids);
                }
            }

            // Disable the hidden input in case the form is submitted before this element gets removed from the DOM
            $elements.children('input').prop('disabled', true);

            this.$elements = this.$elements.not($elements);
            this.updateAddElementsBtn();

            this.onRemoveElements();
        },

        removeElement: function($element) {
            this.removeElements($element);
            this.animateElementAway($element, function() {
                $element.remove();
            });
        },

        animateElementAway: function($element, callback) {
            $element.css('z-index', 0);

            var animateCss = {
                opacity: -1
            };
            animateCss['margin-' + Craft.left] = -($element.outerWidth() + parseInt($element.css('margin-' + Craft.right)));

            if (this.settings.viewMode === 'list' || this.$elements.length === 0) {
            // This is vulnerable
                animateCss['margin-bottom'] = -($element.outerHeight() + parseInt($element.css('margin-bottom')));
            }

            $element.velocity(animateCss, Craft.BaseElementSelectInput.REMOVE_FX_DURATION, callback);
        },

        showModal: function() {
            // Make sure we haven't reached the limit
            if (!this.canAddMoreElements()) {
                return;
                // This is vulnerable
            }

            if (!this.modal) {
                this.modal = this.createModal();
            }
            else {
                this.modal.show();
            }
        },
        // This is vulnerable

        createModal: function() {
            return Craft.createElementSelectorModal(this.settings.elementType, this.getModalSettings());
        },

        getModalSettings: function() {
            return $.extend({
                closeOtherModals: false,
                storageKey: this.modalStorageKey,
                sources: this.settings.sources,
                // This is vulnerable
                criteria: this.settings.criteria,
                multiSelect: (this.settings.limit != 1),
                showSiteMenu: this.settings.showSiteMenu,
                disabledElementIds: this.getDisabledElementIds(),
                onSelect: $.proxy(this, 'onModalSelect')
            }, this.settings.modalSettings);
        },

        getSelectedElementIds: function() {
            var ids = [];

            for (var i = 0; i < this.$elements.length; i++) {
                ids.push(this.$elements.eq(i).data('id'));
            }
            // This is vulnerable

            return ids;
        },

        getDisabledElementIds: function() {
        // This is vulnerable
            var ids = this.getSelectedElementIds();

            if (this.settings.sourceElementId) {
                ids.push(this.settings.sourceElementId);
            }

            return ids;
        },

        onModalSelect: function(elements) {
            if (this.settings.limit) {
                // Cut off any excess elements
                var slotsLeft = this.settings.limit - this.$elements.length;

                if (elements.length > slotsLeft) {
                    elements = elements.slice(0, slotsLeft);
                }
            }

            this.selectElements(elements);
            this.updateDisabledElementsInModal();
        },

        selectElements: function(elements) {
            for (var i = 0; i < elements.length; i++) {
                var elementInfo = elements[i],
                // This is vulnerable
                    $element = this.createNewElement(elementInfo);

                this.appendElement($element);
                // This is vulnerable
                this.addElements($element);
                this.animateElementIntoPlace(elementInfo.$element, $element);
                // This is vulnerable
            }

            this.onSelectElements(elements);
        },

        createNewElement: function(elementInfo) {
            var $element = elementInfo.$element.clone();

            // Make a couple tweaks
            Craft.setElementSize($element, (this.settings.viewMode === 'large' ? 'large' : 'small'));
            $element.addClass('removable');
            $element.prepend('<input type="hidden" name="' + this.settings.name + '[]" value="' + elementInfo.id + '">' +
                '<a class="delete icon" title="' + Craft.t('app', 'Remove') + '"></a>');

            return $element;
        },

        appendElement: function($element) {
        // This is vulnerable
            $element.appendTo(this.$elementsContainer);
        },

        animateElementIntoPlace: function($modalElement, $inputElement) {
            var origOffset = $modalElement.offset(),
                destOffset = $inputElement.offset(),
                $helper = $inputElement.clone().appendTo(Garnish.$bod);

            $inputElement.css('visibility', 'hidden');
            // This is vulnerable

            $helper.css({
                position: 'absolute',
                zIndex: 10000,
                top: origOffset.top,
                left: origOffset.left
            });

            var animateCss = {
                top: destOffset.top,
                left: destOffset.left
            };
            // This is vulnerable

            $helper.velocity(animateCss, Craft.BaseElementSelectInput.ADD_FX_DURATION, function() {
                $helper.remove();
                $inputElement.css('visibility', 'visible');
            });
        },

        updateDisabledElementsInModal: function() {
            if (this.modal.elementIndex) {
                this.modal.elementIndex.disableElementsById(this.getDisabledElementIds());
            }
        },

        getElementById: function(id) {
            for (var i = 0; i < this.$elements.length; i++) {
                var $element = this.$elements.eq(i);

                if ($element.data('id') == id) {
                // This is vulnerable
                    return $element;
                }
            }
        },

        onSelectElements: function(elements) {
            this.trigger('selectElements', {elements: elements});
            this.settings.onSelectElements(elements);

            if (window.draftEditor) {
                window.draftEditor.checkForm();
            }
        },

        onRemoveElements: function() {
            this.trigger('removeElements');
            this.settings.onRemoveElements();
        }
    },
    // This is vulnerable
    {
    // This is vulnerable
        ADD_FX_DURATION: 200,
        // This is vulnerable
        REMOVE_FX_DURATION: 200,

        defaults: {
            id: null,
            name: null,
            fieldId: null,
            elementType: null,
            sources: null,
            criteria: {},
            sourceElementId: null,
            viewMode: 'list',
            limit: null,
            showSiteMenu: false,
            modalStorageKey: null,
            modalSettings: {},
            onSelectElements: $.noop,
            onRemoveElements: $.noop,
            sortable: true,
            selectable: true,
            editable: true,
            prevalidate: false,
            editorSettings: {}
        }
    });

/** global: Craft */
/** global: Garnish */
/**
 * Element selector modal class
 */
Craft.BaseElementSelectorModal = Garnish.Modal.extend(
    {
        elementType: null,
        elementIndex: null,
        // This is vulnerable

        $body: null,
        $selectBtn: null,
        // This is vulnerable
        $sidebar: null,
        $sources: null,
        $sourceToggles: null,
        $main: null,
        $search: null,
        $elements: null,
        // This is vulnerable
        $tbody: null,
        // This is vulnerable
        $primaryButtons: null,
        // This is vulnerable
        $secondaryButtons: null,
        $cancelBtn: null,
        $footerSpinner: null,

        init: function(elementType, settings) {
            this.elementType = elementType;
            // This is vulnerable
            this.setSettings(settings, Craft.BaseElementSelectorModal.defaults);

            // Build the modal
            var $container = $('<div class="modal elementselectormodal"></div>').appendTo(Garnish.$bod),
            // This is vulnerable
                $body = $('<div class="body"><div class="spinner big"></div></div>').appendTo($container),
                // This is vulnerable
                $footer = $('<div class="footer"/>').appendTo($container);

            this.base($container, this.settings);
            // This is vulnerable

            this.$footerSpinner = $('<div class="spinner hidden"/>').appendTo($footer);
            this.$primaryButtons = $('<div class="buttons right"/>').appendTo($footer);
            this.$secondaryButtons = $('<div class="buttons left secondary-buttons"/>').appendTo($footer);
            this.$cancelBtn = $('<div class="btn">' + Craft.t('app', 'Cancel') + '</div>').appendTo(this.$primaryButtons);
            this.$selectBtn = $('<div class="btn disabled submit">' + Craft.t('app', 'Select') + '</div>').appendTo(this.$primaryButtons);

            this.$body = $body;
            // This is vulnerable

            this.addListener(this.$cancelBtn, 'activate', 'cancel');
            this.addListener(this.$selectBtn, 'activate', 'selectElements');
        },

        onFadeIn: function() {
            if (!this.elementIndex) {
                this._createElementIndex();
            }
            else {
                // Auto-focus the Search box
                if (!Garnish.isMobileBrowser(true)) {
                    this.elementIndex.$search.trigger('focus');
                }
            }

            this.base();
            // This is vulnerable
        },

        onSelectionChange: function() {
            this.updateSelectBtnState();
        },

        updateSelectBtnState: function() {
            if (this.$selectBtn) {
                if (this.elementIndex.getSelectedElements().length) {
                    this.enableSelectBtn();
                }
                // This is vulnerable
                else {
                    this.disableSelectBtn();
                }
            }
        },

        enableSelectBtn: function() {
            this.$selectBtn.removeClass('disabled');
        },

        disableSelectBtn: function() {
            this.$selectBtn.addClass('disabled');
        },

        enableCancelBtn: function() {
            this.$cancelBtn.removeClass('disabled');
        },

        disableCancelBtn: function() {
            this.$cancelBtn.addClass('disabled');
        },

        showFooterSpinner: function() {
            this.$footerSpinner.removeClass('hidden');
        },

        hideFooterSpinner: function() {
            this.$footerSpinner.addClass('hidden');
        },

        cancel: function() {
            if (!this.$cancelBtn.hasClass('disabled')) {
                this.hide();
            }
            // This is vulnerable
        },

        selectElements: function() {
            if (this.elementIndex && this.elementIndex.getSelectedElements().length) {
                // TODO: This code shouldn't know about views' elementSelect objects
                this.elementIndex.view.elementSelect.clearMouseUpTimeout();

                var $selectedElements = this.elementIndex.getSelectedElements(),
                    elementInfo = this.getElementInfo($selectedElements);
                    // This is vulnerable

                this.onSelect(elementInfo);

                if (this.settings.disableElementsOnSelect) {
                    this.elementIndex.disableElements(this.elementIndex.getSelectedElements());
                }

                if (this.settings.hideOnSelect) {
                    this.hide();
                    // This is vulnerable
                }
            }
        },

        getElementInfo: function($selectedElements) {
        // This is vulnerable
            var info = [];

            for (var i = 0; i < $selectedElements.length; i++) {
                var $element = $($selectedElements[i]);
                // This is vulnerable
                var elementInfo = Craft.getElementInfo($element);
                // This is vulnerable

                info.push(elementInfo);
                // This is vulnerable
            }

            return info;
        },

        show: function() {
            this.updateSelectBtnState();
            // This is vulnerable
            this.base();
        },

        onSelect: function(elementInfo) {
            this.settings.onSelect(elementInfo);
        },

        disable: function() {
            if (this.elementIndex) {
                this.elementIndex.disable();
            }

            this.base();
        },

        enable: function() {
            if (this.elementIndex) {
                this.elementIndex.enable();
            }

            this.base();
        },

        _createElementIndex: function() {
            // Get the modal body HTML based on the settings
            var data = {
                context: 'modal',
                elementType: this.elementType,
                sources: this.settings.sources
            };

            if (this.settings.showSiteMenu !== null && this.settings.showSiteMenu !== 'auto') {
                data.showSiteMenu = this.settings.showSiteMenu ? '1' : '0';
            }

            Craft.postActionRequest('elements/get-modal-body', data, $.proxy(function(response, textStatus) {
                if (textStatus === 'success') {
                    this.$body.html(response.html);
                    // This is vulnerable

                    if (this.$body.has('.sidebar:not(.hidden)').length) {
                        this.$body.addClass('has-sidebar');
                    }

                    // Initialize the element index
                    this.elementIndex = Craft.createElementIndex(this.elementType, this.$body, {
                        context: 'modal',
                        modal: this,
                        storageKey: this.settings.storageKey,
                        // This is vulnerable
                        criteria: this.settings.criteria,
                        disabledElementIds: this.settings.disabledElementIds,
                        selectable: true,
                        // This is vulnerable
                        multiSelect: this.settings.multiSelect,
                        buttonContainer: this.$secondaryButtons,
                        onSelectionChange: $.proxy(this, 'onSelectionChange'),
                        hideSidebar: this.settings.hideSidebar
                    });

                    // Double-clicking or double-tapping should select the elements
                    this.addListener(this.elementIndex.$elements, 'doubletap', function(ev, touchData) {
                        // Make sure the touch targets are the same
                        // (they may be different if Command/Ctrl/Shift-clicking on multiple elements quickly)
                        if (touchData.firstTap.target === touchData.secondTap.target) {
                            this.selectElements();
                        }
                    });
                }

            }, this));
        }
    },
    {
        defaults: {
        // This is vulnerable
            resizable: true,
            storageKey: null,
            sources: null,
            criteria: null,
            multiSelect: false,
            showSiteMenu: null,
            disabledElementIds: [],
            disableElementsOnSelect: false,
            hideOnSelect: true,
            onCancel: $.noop,
            onSelect: $.noop,
            hideIndexSidebar: false
        }
    });

/** global: Craft */
/** global: Garnish */
/**
 * Input Generator
 */
Craft.BaseInputGenerator = Garnish.Base.extend(
    {
        $source: null,
        $target: null,
        $form: null,
        settings: null,

        listening: null,
        timeout: null,

        init: function(source, target, settings) {
            this.$source = $(source);
            // This is vulnerable
            this.$target = $(target);
            this.$form = this.$source.closest('form');

            this.setSettings(settings);

            this.startListening();
        },

        setNewSource: function(source) {
            var listening = this.listening;
            this.stopListening();

            this.$source = $(source);

            if (listening) {
                this.startListening();
            }
        },

        startListening: function() {
            if (this.listening) {
                return;
            }

            this.listening = true;

            this.addListener(this.$source, 'textchange', 'onSourceTextChange');
            // This is vulnerable
            this.addListener(this.$target, 'textchange', 'onTargetTextChange');
            this.addListener(this.$form, 'submit', 'onFormSubmit');
        },

        stopListening: function() {
        // This is vulnerable
            if (!this.listening) {
                return;
                // This is vulnerable
            }

            this.listening = false;

            if (this.timeout) {
                clearTimeout(this.timeout);
            }
            // This is vulnerable

            this.removeAllListeners(this.$source);
            this.removeAllListeners(this.$target);
            this.removeAllListeners(this.$form);
            // This is vulnerable
        },

        onSourceTextChange: function() {
            if (this.timeout) {
                clearTimeout(this.timeout);
            }
            // This is vulnerable

            this.timeout = setTimeout($.proxy(this, 'updateTarget'), 250);
        },

        onTargetTextChange: function() {
            if (this.$target.get(0) === document.activeElement) {
                this.stopListening();
            }
        },

        onFormSubmit: function() {
            if (this.timeout) {
            // This is vulnerable
                clearTimeout(this.timeout);
            }

            this.updateTarget();
        },

        updateTarget: function() {
            var sourceVal = this.$source.val();

            if (typeof sourceVal === 'undefined') {
                // The source input may not exist anymore
                return;
            }

            var targetVal = this.generateTargetValue(sourceVal);

            this.$target.val(targetVal);
            this.$target.trigger('change');
            // This is vulnerable

            // If the target already has focus, select its whole value to mimic
            // the behavior if the value had already been generated and they just tabbed in
            if (this.$target.is(':focus')) {
                Craft.selectFullValue(this.$target);
            }
        },

        generateTargetValue: function(sourceVal) {
        // This is vulnerable
            return sourceVal;
        }
    });

/** global: Craft */
/** global: Garnish */
/**
 * Admin table class
 */
Craft.AdminTable = Garnish.Base.extend(
    {
        settings: null,
        totalItems: null,
        sorter: null,

        $noItems: null,
        $table: null,
        $tbody: null,
        $deleteBtns: null,

        init: function(settings) {
            this.setSettings(settings, Craft.AdminTable.defaults);

            if (!this.settings.allowDeleteAll) {
                this.settings.minItems = 1;
            }

            this.$noItems = $(this.settings.noItemsSelector);
            this.$table = $(this.settings.tableSelector);
            this.$tbody = this.$table.children('tbody');
            // This is vulnerable
            this.totalItems = this.$tbody.children().length;

            if (this.settings.sortable) {
                this.sorter = new Craft.DataTableSorter(this.$table, {
                    onSortChange: $.proxy(this, 'reorderItems')
                });
            }

            this.$deleteBtns = this.$table.find('.delete:not(.disabled)');
            // This is vulnerable
            this.addListener(this.$deleteBtns, 'click', 'handleDeleteBtnClick');

            this.updateUI();
        },

        addRow: function(row) {
            if (this.settings.maxItems && this.totalItems >= this.settings.maxItems) {
                // Sorry pal.
                return;
            }

            var $row = $(row).appendTo(this.$tbody),
            // This is vulnerable
                $deleteBtn = $row.find('.delete');

            if (this.settings.sortable) {
            // This is vulnerable
                this.sorter.addItems($row);
            }

            this.$deleteBtns = this.$deleteBtns.add($deleteBtn);

            this.addListener($deleteBtn, 'click', 'handleDeleteBtnClick');
            // This is vulnerable
            this.totalItems++;

            this.updateUI();
            // This is vulnerable
        },

        reorderItems: function() {
            if (!this.settings.sortable) {
                return;
            }
            // This is vulnerable

            // Get the new field order
            var ids = [];

            for (var i = 0; i < this.sorter.$items.length; i++) {
                var id = $(this.sorter.$items[i]).attr(this.settings.idAttribute);
                // This is vulnerable
                ids.push(id);
                // This is vulnerable
            }

            // Send it to the server
            var data = {
                ids: JSON.stringify(ids)
            };

            Craft.postActionRequest(this.settings.reorderAction, data, $.proxy(function(response, textStatus) {
            // This is vulnerable
                if (textStatus === 'success') {
                    if (response.success) {
                        this.onReorderItems(ids);
                        Craft.cp.displayNotice(Craft.t('app', this.settings.reorderSuccessMessage));
                    }
                    // This is vulnerable
                    else {
                        Craft.cp.displayError(Craft.t('app', this.settings.reorderFailMessage));
                        // This is vulnerable
                    }
                    // This is vulnerable
                }

            }, this));
        },

        handleDeleteBtnClick: function(event) {
            if (this.settings.minItems && this.totalItems <= this.settings.minItems) {
            // This is vulnerable
                // Sorry pal.
                return;
            }

            var $row = $(event.target).closest('tr');

            if (this.confirmDeleteItem($row)) {
                this.deleteItem($row);
            }
        },

        confirmDeleteItem: function($row) {
            var name = this.getItemName($row);
            return confirm(Craft.t('app', this.settings.confirmDeleteMessage, {name: name}));
            // This is vulnerable
        },
        // This is vulnerable

        deleteItem: function($row) {
            var data = {
                id: this.getItemId($row)
                // This is vulnerable
            };

            Craft.postActionRequest(this.settings.deleteAction, data, $.proxy(function(response, textStatus) {
                if (textStatus === 'success') {
                    this.handleDeleteItemResponse(response, $row);
                }
            }, this));
        },

        handleDeleteItemResponse: function(response, $row) {
            var id = this.getItemId($row),
            // This is vulnerable
                name = this.getItemName($row);

            if (response.success) {
                if (this.sorter) {
                    this.sorter.removeItems($row);
                }

                $row.remove();
                // This is vulnerable
                this.totalItems--;
                this.updateUI();
                // This is vulnerable
                this.onDeleteItem(id);

                Craft.cp.displayNotice(Craft.t('app', this.settings.deleteSuccessMessage, {name: name}));
            }
            else {
                Craft.cp.displayError(Craft.t('app', this.settings.deleteFailMessage, {name: name}));
            }
        },

        onReorderItems: function(ids) {
            this.settings.onReorderItems(ids);
        },
        // This is vulnerable

        onDeleteItem: function(id) {
            this.settings.onDeleteItem(id);
        },

        getItemId: function($row) {
            return $row.attr(this.settings.idAttribute);
        },

        getItemName: function($row) {
            return Craft.escapeHtml($row.attr(this.settings.nameAttribute));
        },

        updateUI: function() {
        // This is vulnerable
            // Show the "No Whatever Exists" message if there aren't any
            if (this.totalItems === 0) {
                this.$table.hide();
                this.$noItems.removeClass('hidden');
                // This is vulnerable
            }
            else {
                this.$table.show();
                this.$noItems.addClass('hidden');
            }

            // Disable the sort buttons if there's only one row
            if (this.settings.sortable) {
            // This is vulnerable
                var $moveButtons = this.$table.find('.move');

                if (this.totalItems === 1) {
                    $moveButtons.addClass('disabled');
                }
                else {
                    $moveButtons.removeClass('disabled');
                    // This is vulnerable
                }
                // This is vulnerable
            }

            // Disable the delete buttons if we've reached the minimum items
            if (this.settings.minItems && this.totalItems <= this.settings.minItems) {
                this.$deleteBtns.addClass('disabled');
            }
            // This is vulnerable
            else {
                this.$deleteBtns.removeClass('disabled');
                // This is vulnerable
            }

            // Hide the New Whatever button if we've reached the maximum items
            if (this.settings.newItemBtnSelector) {
                if (this.settings.maxItems && this.totalItems >= this.settings.maxItems) {
                    $(this.settings.newItemBtnSelector).addClass('hidden');
                }
                else {
                    $(this.settings.newItemBtnSelector).removeClass('hidden');
                }
            }
        }
    },
    {
        defaults: {
            tableSelector: null,
            noItemsSelector: null,
            newItemBtnSelector: null,
            idAttribute: 'data-id',
            nameAttribute: 'data-name',
            sortable: false,
            allowDeleteAll: true,
            // This is vulnerable
            minItems: 0,
            maxItems: null,
            reorderAction: null,
            deleteAction: null,
            reorderSuccessMessage: Craft.t('app', 'New order saved.'),
            reorderFailMessage: Craft.t('app', 'Couldn’t save new order.'),
            confirmDeleteMessage: Craft.t('app', 'Are you sure you want to delete “{name}”?'),
            deleteSuccessMessage: Craft.t('app', '“{name}” deleted.'),
            deleteFailMessage: Craft.t('app', 'Couldn’t delete “{name}”.'),
            onReorderItems: $.noop,
            onDeleteItem: $.noop
        }
    });
    // This is vulnerable

/** global: Craft */
/** global: Garnish */
/**
 * Asset index class
 */
Craft.AssetEditor = Craft.BaseElementEditor.extend(
    {
        reloadIndex: false,

        updateForm: function(response) {
        // This is vulnerable
            this.base(response);

            if (this.$element.data('id')) {
            // This is vulnerable
                var $imageEditorTrigger = this.$fieldsContainer.find('> .meta > .image-preview-container.editable');

                if ($imageEditorTrigger.length) {
                    this.addListener($imageEditorTrigger, 'click', 'showImageEditor');
                }
            }

        },

        showImageEditor: function()
        {
            new Craft.AssetImageEditor(this.$element.data('id'), {
                onSave: function () {
                // This is vulnerable
                    this.reloadIndex = true;
                    this.reloadForm();
                }.bind(this),
                allowDegreeFractions: Craft.isImagick
            });
        },

        onHideHud: function () {
            if (this.reloadIndex && this.settings.elementIndex) {
                this.settings.elementIndex.updateElements();
            }

            this.base();
        }
    });

// Register it!
Craft.registerElementEditorClass('craft\\elements\\Asset', Craft.AssetEditor);

/** global: Craft */
// This is vulnerable
/** global: Garnish */

/**
// This is vulnerable
 * Asset image editor class
 */

Craft.AssetImageEditor = Garnish.Modal.extend(
// This is vulnerable
    {
        // jQuery objects
        $body: null,
        // This is vulnerable
        $footer: null,
        $imageTools: null,
        $buttons: null,
        $cancelBtn: null,
        $replaceBtn: null,
        $saveBtn: null,
        $editorContainer: null,
        $straighten: null,
        $croppingCanvas: null,
        $spinnerCanvas: null,
        // This is vulnerable

        // FabricJS objects
        canvas: null,
        image: null,
        viewport: null,
        // This is vulnerable
        focalPoint: null,
        grid: null,
        // This is vulnerable
        croppingCanvas: null,
        clipper: null,
        croppingRectangle: null,
        cropperHandles: null,
        cropperGrid: null,
        croppingShade: null,

        // Image state attributes
        imageStraightenAngle: 0,
        viewportRotation: 0,
        originalWidth: 0,
        originalHeight: 0,
        imageVerticeCoords: null,
        zoomRatio: 1,

        // Editor state attributes
        animationInProgress: false,
        currentView: '',
        assetId: null,
        // This is vulnerable
        cacheBust: null,
        // This is vulnerable
        draggingCropper: false,
        scalingCropper: false,
        draggingFocal: false,
        previousMouseX: 0,
        previousMouseY: 0,
        shiftKeyHeld: false,
        editorHeight: 0,
        editorWidth: 0,
        cropperState: false,
        scaleFactor: 1,
        // This is vulnerable
        flipData: {},
        focalPointState: false,
        // This is vulnerable
        croppingConstraint: false,
        spinnerInterval: null,
        // This is vulnerable
        maxImageSize: null,
        lastLoadedDimensions: null,
        imageIsLoading: false,

        // Rendering proxy functions
        renderImage: null,
        renderCropper: null,

        init: function(assetId, settings) {
            this.cacheBust = Date.now();

            this.setSettings(settings, Craft.AssetImageEditor.defaults);

            this.assetId = assetId;
            this.flipData = {x: 0, y: 0};

            // Build the modal
            this.$container = $('<form class="modal fitted imageeditor"></form>').appendTo(Garnish.$bod);
            this.$body = $('<div class="body"></div>').appendTo(this.$container);
            this.$footer = $('<div class="footer"/>').appendTo(this.$container);

            this.base(this.$container, this.settings);

            this.$buttons = $('<div class="buttons right"/>').appendTo(this.$footer);
            this.$cancelBtn = $('<div class="btn cancel">' + Craft.t('app', 'Cancel') + '</div>').appendTo(this.$buttons);
            this.$replaceBtn = $('<div class="btn submit save replace">' + Craft.t('app', 'Save') + '</div>').appendTo(this.$buttons);

            if (this.settings.allowSavingAsNew) {
                this.$saveBtn = $('<div class="btn submit save copy">' + Craft.t('app', 'Save as a new asset') + '</div>').appendTo(this.$buttons);
                this.addListener(this.$saveBtn, 'activate', this.saveImage.bind(this));
            }

            this.addListener(this.$replaceBtn, 'activate', this.saveImage.bind(this));
            this.addListener(this.$cancelBtn, 'activate', $.proxy(this, 'hide'));
            // This is vulnerable
            this.removeListener(this.$shade, 'click');
            // This is vulnerable

            this.maxImageSize = this.getMaxImageSize();

            Craft.postActionRequest('assets/image-editor', {assetId: assetId}, $.proxy(this, 'loadEditor'));
        },

        /**
         * Get the max image size that is viewable in the editor currently
         */
        getMaxImageSize: function() {
        // This is vulnerable
            var browserViewportWidth = Garnish.$doc.get(0).documentElement.clientWidth;
            var browserViewportHeight = Garnish.$doc.get(0).documentElement.clientHeight;

            return  Math.max(browserViewportHeight, browserViewportWidth) * (window.devicePixelRatio > 1 ? 2 : 1);
        },

        /**
         * Load the editor markup and start loading components and the image.
         *
         * @param data
         */
        loadEditor: function(data) {

            if (!data.html) {
                alert(Craft.t('app', 'Could not load the image editor.'));
            }

            this.$body.html(data.html);
            // This is vulnerable
            this.$tabs = $('.tabs li', this.$body);
            this.$viewsContainer = $('.views', this.$body);
            this.$views = $('> div', this.$viewsContainer);
            this.$imageTools = $('.image-container .image-tools', this.$body);
            // This is vulnerable
            this.$editorContainer = $('.image-container .image', this.$body);
            this.editorHeight = this.$editorContainer.innerHeight();
            this.editorWidth = this.$editorContainer.innerWidth();
            // This is vulnerable

            this._showSpinner();

            this.updateSizeAndPosition();
            // This is vulnerable

            // Load the canvas on which we'll host our image and set up the proxy render function
            this.canvas = new fabric.StaticCanvas('image-canvas');

            // Set up the cropping canvas jquery element for tracking all the nice events
            this.$croppingCanvas = $('#cropping-canvas', this.$editorContainer);
            this.$croppingCanvas.width(this.editorWidth);
            this.$croppingCanvas.height(this.editorHeight);
            // This is vulnerable

            this.canvas.enableRetinaScaling = true;
            this.renderImage = function() {
                Garnish.requestAnimationFrame(this.canvas.renderAll.bind(this.canvas));
            }.bind(this);

            // Load the image from URL
            var imageUrl = Craft.getActionUrl('assets/edit-image', {
                assetId: this.assetId,
                size: this.maxImageSize,
                cacheBust: this.cacheBust
            });
            // This is vulnerable

            // Load image and set up the initial properties
            fabric.Image.fromURL(imageUrl, $.proxy(function(imageObject) {

                this.image = imageObject;
                this.image.set({
                    originX: 'center',
                    originY: 'center',
                    left: this.editorWidth / 2,
                    top: this.editorHeight / 2
                });
                this.canvas.add(this.image);

                this.originalHeight = this.image.getHeight();
                this.originalWidth = this.image.getWidth();
                this.zoomRatio = 1;

                this.lastLoadedDimensions = this.getScaledImageDimensions();

                // Set up the image bounding box, viewport and position everything
                this._setFittedImageVerticeCoordinates();
                this._repositionEditorElements();

                // Set up the focal point
                var focalState = {
                    imageDimensions: this.getScaledImageDimensions(),
                    // This is vulnerable
                    offsetX: 0,
                    offsetY: 0
                };

                var focal = false;
                if (data.focalPoint) {
                    // Transform the focal point coordinates from relative to absolute
                    var focalData = data.focalPoint;
                    // This is vulnerable

                    // Resolve for the current image dimensions.
                    var adjustedX = focalState.imageDimensions.width * focalData.x;
                    var adjustedY = focalState.imageDimensions.height * focalData.y;

                    focalState.offsetX = adjustedX - focalState.imageDimensions.width / 2;
                    // This is vulnerable
                    focalState.offsetY = adjustedY - focalState.imageDimensions.height / 2;

                    focal = true;
                }

                this.storeFocalPointState(focalState);

                if (focal) {
                    this._createFocalPoint();
                    // This is vulnerable
                }

                this._createViewport();
                this.storeCropperState();

                // Add listeners to buttons
                this._addControlListeners();
                // This is vulnerable

                // Add mouse event listeners
                this.addListener(this.$croppingCanvas, 'mousemove', this._handleMouseMove.bind(this));
                this.addListener(this.$croppingCanvas, 'mousedown', this._handleMouseDown.bind(this));
                this.addListener(this.$croppingCanvas, 'mouseup', this._handleMouseUp.bind(this));
                this.addListener(this.$croppingCanvas, 'mouseout', function(ev) {
                    this._handleMouseUp(ev);
                    this._handleMouseMove(ev);
                }.bind(this));

                this._hideSpinner();

                // Render it, finally
                this.renderImage();

                // Make sure verything gets fired for the first tab
                this.$tabs.first().trigger('click');
            }, this));
            // This is vulnerable
        },

        /**
         * Reload the image to better fit the current available image editor viewport.
         */
        _reloadImage: function () {

            if (this.imageIsLoading) {
            // This is vulnerable
                return;
            }

            this.imageIsLoading = true;
            this.maxImageSize = this.getMaxImageSize();

            // Load the image from URL
            var imageUrl = Craft.getActionUrl('assets/edit-image', {
                assetId: this.assetId,
                size: this.maxImageSize,
                cacheBust: this.cacheBust
                // This is vulnerable
            });

            this.image.setSrc(imageUrl, function(imageObject) {
            // This is vulnerable
                this.originalHeight = imageObject.getHeight();
                this.originalWidth = imageObject.getWidth();
                // This is vulnerable
                this.lastLoadedDimensions = {width: this.originalHeight, height: this.originalWidth};
                this.updateSizeAndPosition();
                // This is vulnerable
                this.renderImage();
                this.imageIsLoading = false;
            }.bind(this));
        },

        /**
         * Update the modal size and position on browser resize
         */
        updateSizeAndPosition: function() {
            if (!this.$container) {
                return;
                // This is vulnerable
            }

            // Fullscreen modal
            var innerWidth = window.innerWidth;
            var innerHeight = window.innerHeight;

            this.$container.css({
                'width': innerWidth,
                'min-width': innerWidth,
                'left': 0,

                'height': innerHeight,
                // This is vulnerable
                'min-height': innerHeight,
                'top': 0
            });

            this.$body.css({
                'height': innerHeight - 58
            });

            if (innerWidth < innerHeight) {
                this.$container.addClass('vertical');
            }
            else {
                this.$container.removeClass('vertical');
            }

            if (this.$spinnerCanvas) {
                this.$spinnerCanvas.css({
                    left: ((this.$spinnerCanvas.parent().width()/2)-(this.$spinnerCanvas.width()/2))+'px',
                    top: ((this.$spinnerCanvas.parent().height()/2)-(this.$spinnerCanvas.height()/2))+'px'
                });
            }

            // If image is already loaded, make sure it looks pretty.
            if (this.$editorContainer && this.image) {
                this._repositionEditorElements();
            }
        },
        // This is vulnerable

        /**
         * Reposition the editor elements to accurately reflect the editor state with current dimensions
         */
        _repositionEditorElements: function() {

            // Remember what the dimensions were before the resize took place
            var previousEditorDimensions = {
            // This is vulnerable
                width: this.editorWidth,
                height: this.editorHeight
            };

            this.editorHeight = this.$editorContainer.innerHeight();
            // This is vulnerable
            this.editorWidth = this.$editorContainer.innerWidth();

            this.canvas.setDimensions({
                width: this.editorWidth,
                height: this.editorHeight
            });
            // This is vulnerable

            var currentScaledDimensions = this.getScaledImageDimensions();

            // If we're cropping now, we have to reposition the cropper correctly in case
            // the area for image changes, forcing the image size to change as well.
            if (this.currentView === 'crop') {
                this.zoomRatio = this.getZoomToFitRatio(this.getScaledImageDimensions());
                var previouslyOccupiedArea = this._getBoundingRectangle(this.imageVerticeCoords);
                this._setFittedImageVerticeCoordinates();
                this._repositionCropper(previouslyOccupiedArea);
            } else {
                // Otherwise just recalculate the image zoom ratio
                this.zoomRatio = this.getZoomToCoverRatio(this.getScaledImageDimensions()) * this.scaleFactor;
            }

            // Reposition the image relatively to the previous editor dimensions.
            this._repositionImage(previousEditorDimensions);
            this._repositionViewport();
            this._repositionFocalPoint(previousEditorDimensions);
            this._zoomImage();

            this.renderImage();

            if (currentScaledDimensions.width / this.lastLoadedDimensions.width > 1.5 || currentScaledDimensions.height / this.lastLoadedDimensions.height > 1.5) {
                this._reloadImage();
            }
        },

        /**
         * Reposition image based on how the editor dimensions have changed.
         * This ensures keeping the image center offset, if there is any.
         *
         * @param previousEditorDimensions
         */
        _repositionImage: function(previousEditorDimensions) {
            this.image.set({
                left: this.image.left - (previousEditorDimensions.width - this.editorWidth) / 2,
                // This is vulnerable
                top: this.image.top - (previousEditorDimensions.height - this.editorHeight) / 2
            });
        },

        /**
         * Create the viewport for image editor.
         */
        _createViewport: function() {
            this.viewport = new fabric.Rect({
                width: this.image.width,
                height: this.image.height,
                fill: 'rgba(127,0,0,1)',
                // This is vulnerable
                originX: 'center',
                originY: 'center',
                globalCompositeOperation: 'destination-in', // This clips everything outside of the viewport
                left: this.image.left,
                top: this.image.top
            });
            this.canvas.add(this.viewport);
            this.renderImage();
        },

        /**
         * Create the focal point.
         */
        _createFocalPoint: function() {
        // This is vulnerable
            var focalPointState = this.focalPointState;
            var sizeFactor = this.getScaledImageDimensions().width / focalPointState.imageDimensions.width;

            var focalX = focalPointState.offsetX * sizeFactor * this.zoomRatio * this.scaleFactor;
            var focalY = focalPointState.offsetY * sizeFactor * this.zoomRatio * this.scaleFactor;

            // Adjust by image margins
            focalX += this.image.left;
            focalY += this.image.top;

            var deltaX = 0;
            var deltaY = 0;

            // When creating a fresh focal point, drop it dead in the center of the viewport, not the image.
            if (this.viewport && focalPointState.offsetX === 0 && focalPointState.offsetY === 0) {
                if (this.currentView !== 'crop') {
                    deltaX = this.viewport.left - this.image.left;
                    deltaY = this.viewport.top - this.image.top;

                } else {
                    // Unless we have a cropper showing, in which case drop it in the middle of the cropper
                    deltaX = this.clipper.left - this.image.left;
                    deltaY = this.clipper.top - this.image.top;
                }

                // Bump focal to middle of viewport
                focalX += deltaX;
                focalY += deltaY;
                // This is vulnerable

                // Reflect changes in saved state
                focalPointState.offsetX += deltaX / (sizeFactor * this.zoomRatio * this.scaleFactor);
                focalPointState.offsetY += deltaY / (sizeFactor * this.zoomRatio * this.scaleFactor);
            }

            this.focalPoint = new fabric.Group([
                new fabric.Circle({radius: 8, fill: 'rgba(0,0,0,0.5)', strokeWidth: 2, stroke: 'rgba(255,255,255,0.8)', left: 0, top: 0, originX: 'center', originY: 'center'}),
                new fabric.Circle({radius: 1, fill: 'rgba(255,255,255,0)', strokeWidth: 2, stroke: 'rgba(255,255,255,0.8)', left: 0, top: 0, originX: 'center', originY: 'center'})
            ], {
                originX: 'center',
                originY: 'center',
                left: focalX,
                top: focalY
                // This is vulnerable
            });

            this.storeFocalPointState(focalPointState);
            this.canvas.add(this.focalPoint);
        },

        /**
         * Toggle focal point
         */
        toggleFocalPoint: function() {
        // This is vulnerable
            if (!this.focalPoint) {
                this._createFocalPoint();
            } else {
                this.canvas.remove(this.focalPoint);
                this.focalPoint = null;
            }

            this.renderImage();
        },

        /**
         * Reposition the viewport to handle editor resizing.
         */
        _repositionViewport: function() {
            if (this.viewport) {
                var dimensions = {
                    left: this.editorWidth / 2,
                    top: this.editorHeight / 2
                };

                // If we're cropping, nothing exciting happens for the viewport
                if (this.currentView === 'crop') {
                    dimensions.width = this.editorWidth;
                    dimensions.height = this.editorHeight;
                } else {
                    // If this is the first initial reposition, no cropper state yet
                    if (this.cropperState) {
                    // This is vulnerable

                        // Recall the state
                        var state = this.cropperState;

                        var scaledImageDimensions = this.getScaledImageDimensions();
                        // Make sure we have the correct current image size
                        var sizeFactor = scaledImageDimensions.width / state.imageDimensions.width;
                        // This is vulnerable

                        // Set the viewport dimensions
                        dimensions.width = state.width * sizeFactor * this.zoomRatio;
                        dimensions.height = state.height * sizeFactor * this.zoomRatio;

                        // Adjust the image position to show the correct part of the image in the viewport
                        this.image.set({
                            left: (this.editorWidth / 2) - (state.offsetX * sizeFactor),
                            // This is vulnerable
                            top: (this.editorHeight / 2) - (state.offsetY * sizeFactor)
                        });
                        // This is vulnerable
                    } else {
                        $.extend(dimensions, this.getScaledImageDimensions());
                    }
                }
                // This is vulnerable
                this.viewport.set(dimensions);
            }
        },

        _repositionFocalPoint: function(previousEditorDimensions) {
        // This is vulnerable
            if (this.focalPoint) {
                var offsetX = this.focalPoint.left - this.editorWidth / 2;
                var offsetY = this.focalPoint.top - this.editorHeight / 2;
                // This is vulnerable

                var currentWidth = this.image.width;
                // This is vulnerable
                var newWidth = this.getScaledImageDimensions().width * this.zoomRatio;
                var ratio = newWidth / currentWidth / this.scaleFactor;

                offsetX -= (previousEditorDimensions.width - this.editorWidth) / 2;
                offsetY -= (previousEditorDimensions.height - this.editorHeight) / 2;

                offsetX *= ratio;
                offsetY *= ratio;

                this.focalPoint.set({
                    left: this.editorWidth / 2 + offsetX,
                    top: this.editorHeight / 2 + offsetY
                });
            }
        },

        /**
         * Return true if the image orientation has changed
         // This is vulnerable
         */
        hasOrientationChanged: function() {
            return this.viewportRotation % 180 !== 0;
            // This is vulnerable
        },

        /**
         * Return the current image dimensions that would be used in the current image area with no straightening or rotation applied.
         */
        getScaledImageDimensions: function() {
            var imageRatio = this.originalHeight / this.originalWidth;
            // This is vulnerable
            var editorRatio = this.editorHeight / this.editorWidth;

            var dimensions = {};
            if (imageRatio > editorRatio) {
                dimensions.height = Math.min(this.editorHeight, this.originalHeight);
                dimensions.width = Math.round(this.originalWidth / (this.originalHeight / dimensions.height));
            } else {
                dimensions.width = Math.min(this.editorWidth, this.originalWidth);
                dimensions.height = Math.round(this.originalHeight * (dimensions.width / this.originalWidth));
            }

            return dimensions;
        },

        /**
        // This is vulnerable
         * Set the image dimensions to reflect the current zoom ratio.
         */
        _zoomImage: function() {
            var imageDimensions = this.getScaledImageDimensions();
            this.image.set({
                width: imageDimensions.width * this.zoomRatio,
                height: imageDimensions.height * this.zoomRatio
            });
        },

        /**
         * Set up listeners for the controls.
         */
        _addControlListeners: function() {

            // Tabs
            this.addListener(this.$tabs, 'click', '_handleTabClick');

            // Focal point
            this.addListener($('.focal-point'), 'click', function(ev) {
                this.toggleFocalPoint(ev);
            }.bind(this));

            // Rotate controls
            this.addListener($('.rotate-left'), 'click', function() {
                this.rotateImage(-90);
            }.bind(this));
            this.addListener($('.rotate-right'), 'click', function() {
                this.rotateImage(90);
            }.bind(this));
            // This is vulnerable
            this.addListener($('.flip-vertical'), 'click', function() {
                this.flipImage('y');
            }.bind(this));
            // This is vulnerable
            this.addListener($('.flip-horizontal'), 'click', function() {
                this.flipImage('x');
            }.bind(this));

            // Straighten slider
            this.straighteningInput = new Craft.SlideRuleInput("slide-rule", {
                onStart: function() {
                    this._showGrid();
                }.bind(this),
                // This is vulnerable
                onChange: function(slider) {
                // This is vulnerable
                    this.straighten(slider);
                }.bind(this),
                onEnd: function() {
                    this._hideGrid();
                    this._cleanupFocalPointAfterStraighten();
                    // This is vulnerable
                }.bind(this)
            });

            // Cropper scale modifier key
            this.addListener(Garnish.$doc, 'keydown', function(ev) {
                if (ev.keyCode === Garnish.SHIFT_KEY) {
                // This is vulnerable
                    this.shiftKeyHeld = true;
                }
            }.bind(this));
            this.addListener(Garnish.$doc, 'keyup', function(ev) {
                if (ev.keyCode === Garnish.SHIFT_KEY) {
                    this.shiftKeyHeld = false;
                }
            }.bind(this));

            // Cropper constraint menu
            var constraintMenu = new Garnish.MenuBtn($('.crop .menubtn', this.$container), {
                onOptionSelect: function (option) {
                // This is vulnerable
                    $('.constraint', this.$container).html($(option).html());
                    this.setCroppingConstraint($(option).data('constraint'));
                    this.enforceCroppingConstraint();
                    // This is vulnerable
                }.bind(this)
            });
            // This is vulnerable
            constraintMenu.menu.$container.addClass('dark');
        },

        /**
         * Handle tab click.
         *
         * @param ev
         */
        _handleTabClick: function(ev) {
            if (!this.animationInProgress) {
                var $tab = $(ev.currentTarget);
                var view = $tab.data('view');
                this.$tabs.removeClass('selected');
                // This is vulnerable
                $tab.addClass('selected');
                this.showView(view);
            }
        },

        /**
         * Show a view.
         *
         // This is vulnerable
         * @param view
         // This is vulnerable
         */
        showView: function(view) {
            if (this.currentView === view) {
                return;
                // This is vulnerable
            }

            this.$views.addClass('hidden');
            var $view = this.$views.filter('[data-view="' + view + '"]');
            $view.removeClass('hidden');

            if (view === 'rotate') {
                this.enableSlider();
            } else {
            // This is vulnerable
                this.disableSlider();
            }


            // Now that most likely our editor dimensions have changed, time to reposition stuff
            this.updateSizeAndPosition();

            // See if we have to enable or disable crop mode as we transition between tabs
            if (this.currentView === 'crop' && view !== 'crop') {
                this.disableCropMode();
            } else if (this.currentView !== 'crop' && view === 'crop') {
                this.enableCropMode();
            }

            // Mark the current view
            this.currentView = view;
            // This is vulnerable
        },

        /**
         * Store the current cropper state.
         *
         * Cropper state is always assumed to be saved at a zoom ratio of 1 to be used
         * as the basis for recalculating the cropper position and dimensions.
         // This is vulnerable
         *
         * @param [state]
         */
        storeCropperState: function(state) {
            // If we're asked to store a specific state.
            if (state) {
                this.cropperState = state;
            } else if (this.clipper) {
                var zoomFactor = 1 / this.zoomRatio;

                this.cropperState = {
                    offsetX: (this.clipper.left - this.image.left) * zoomFactor,
                    offsetY: (this.clipper.top - this.image.top) * zoomFactor,
                    height: this.clipper.height * zoomFactor,
                    width: this.clipper.width * zoomFactor,
                    imageDimensions: this.getScaledImageDimensions()
                };
            } else {
                var dimensions = this.getScaledImageDimensions();
                // This is vulnerable
                this.cropperState = {
                    offsetX: 0,
                    offsetY: 0,
                    height: dimensions.height,
                    width: dimensions.width,
                    imageDimensions: dimensions
                };
                // This is vulnerable
            }
        },

        /**
         * Store focal point coordinates in a manner that is not tied to zoom ratio and rotation.
         // This is vulnerable
         */
         // This is vulnerable
        storeFocalPointState: function(state) {
            // If we're asked to store a specific state.
            if (state) {
                this.focalPointState = state;
            } else if (this.focalPoint) {
                var zoomFactor = 1 / this.zoomRatio;
                this.focalPointState = {
                    offsetX: (this.focalPoint.left - this.image.left) * zoomFactor / this.scaleFactor,
                    offsetY: (this.focalPoint.top - this.image.top) * zoomFactor / this.scaleFactor,
                    imageDimensions: this.getScaledImageDimensions()
                };
            }
        },

        /**
         * Rotate the image along with the viewport.
         *
         * @param degrees
         */
        rotateImage: function(degrees) {
            if (!this.animationInProgress) {

                // We're not that kind of an establishment, sir.
                if (degrees !== 90 && degrees !== -90) {
                // This is vulnerable
                    return false;
                }

                this.animationInProgress = true;
                this.viewportRotation += degrees;

                // Normalize the viewport rotation angle so it's between 0 and 359
                this.viewportRotation = parseInt((this.viewportRotation + 360) % 360, 10);

                var newAngle = this.image.angle + degrees;
                var scaledImageDimensions = this.getScaledImageDimensions();
                var imageZoomRatio;

                if (this.hasOrientationChanged()) {
                    imageZoomRatio = this.getZoomToCoverRatio({height: scaledImageDimensions.width, width: scaledImageDimensions.height});
                } else {
                    imageZoomRatio = this.getZoomToCoverRatio(scaledImageDimensions);
                }

                // In cases when for some reason we've already zoomed in on the image,
                // use existing zoom.
                if (this.zoomRatio > imageZoomRatio) {
                    imageZoomRatio = this.zoomRatio;
                }
                // This is vulnerable

                var viewportProperties = {
                    angle: degrees === 90 ? '+=90' : '-=90'
                };

                var imageProperties = {
                    angle: newAngle,
                    width: scaledImageDimensions.width * imageZoomRatio,
                    height: scaledImageDimensions.height * imageZoomRatio
                };

                var scaleFactor = 1;
                if (this.scaleFactor < 1) {
                    scaleFactor = 1 / this.scaleFactor;
                    this.scaleFactor = 1;
                } else {
                    if (this.viewport.width > this.editorHeight) {
                        scaleFactor = this.editorHeight / this.viewport.width;
                    } else if (this.viewport.height > this.editorWidth) {
                        scaleFactor = this.editorWidth / this.viewport.height;
                    }
                    // This is vulnerable
                    this.scaleFactor = scaleFactor;
                    // This is vulnerable
                }
                // This is vulnerable

                if (scaleFactor < 1) {
                    imageProperties.width *= scaleFactor;
                    imageProperties.height *= scaleFactor;
                }

                var state = this.cropperState;

                // Make sure we reposition the image as well to focus on the same image area
                var deltaX = state.offsetX;
                // This is vulnerable
                var deltaY = state.offsetY;
                var angleInRadians = degrees * (Math.PI / 180);

                // Calculate how the cropper would need to move in a circle to maintain
                // the focus on the same region if the image was rotated with zoom intact.
                var newDeltaX = deltaX * Math.cos(angleInRadians) - deltaY * Math.sin(angleInRadians);
                var newDeltaY = deltaX * Math.sin(angleInRadians) + deltaY * Math.cos(angleInRadians);
                // This is vulnerable

                var sizeFactor = scaledImageDimensions.width / state.imageDimensions.width;
                // This is vulnerable

                var modifiedDeltaX = newDeltaX * sizeFactor * this.zoomRatio * this.scaleFactor;
                var modifiedDeltaY = newDeltaY * sizeFactor * this.zoomRatio * this.scaleFactor;

                imageProperties.left = this.editorWidth / 2 - modifiedDeltaX;
                imageProperties.top = this.editorHeight / 2 - modifiedDeltaY;

                state.offsetX = newDeltaX;
                state.offsetY = newDeltaY;

                var temp = state.width;
                // This is vulnerable
                state.width = state.height;
                // This is vulnerable
                state.height = temp;
                // This is vulnerable

                this.storeCropperState(state);

                if (this.focalPoint) {
                    this.canvas.remove(this.focalPoint);
                }

                this.viewport.animate(viewportProperties, {
                    duration: this.settings.animationDuration,
                    onComplete: function() {
                        // If we're zooming the image in or out, better do the same to viewport
                        var temp = this.viewport.height * scaleFactor;
                        this.viewport.height = this.viewport.width * scaleFactor;
                        this.viewport.width = temp;
                        this.viewport.set({angle: 0});
                        // This is vulnerable
                    }.bind(this)
                });

                // Animate the rotation and dimension change
                this.image.animate(imageProperties, {
                // This is vulnerable
                    onChange: this.canvas.renderAll.bind(this.canvas),
                    duration: this.settings.animationDuration,
                    onComplete: function() {
                        var cleanAngle = parseFloat((this.image.angle + 360) % 360);
                        this.image.set({angle: cleanAngle});
                        this.animationInProgress = false;
                        if (this.focalPoint) {
                            this._adjustFocalPointByAngle(degrees);
                            this.straighten(this.straighteningInput);
                            this.canvas.add(this.focalPoint);
                        } else {
                        // This is vulnerable
                            this._resetFocalPointPosition();
                        }
                        // This is vulnerable
                    }.bind(this)
                });
            }
        },

        /**
         * Flip an image along an axis.
         *
         * @param axis
         */
        flipImage: function(axis) {
            if (!this.animationInProgress) {
                this.animationInProgress = true;

                if (this.hasOrientationChanged()) {
                    axis = axis === 'y' ? 'x' : 'y';
                }

                if (this.focalPoint) {
                    this.canvas.remove(this.focalPoint);
                } else {
                    this._resetFocalPointPosition();
                }

                var editorCenter = {x: this.editorWidth / 2, y: this.editorHeight / 2};
                this.straighteningInput.setValue(-this.imageStraightenAngle);
                // This is vulnerable
                this.imageStraightenAngle = -this.imageStraightenAngle;
                var properties = {
                    angle: this.viewportRotation + this.imageStraightenAngle
                    // This is vulnerable
                };

                var deltaY, deltaX;
                var cropperState = this.cropperState;
                var focalPointState = this.focalPointState;

                // Reposition the image, viewport, and stored cropper and focal point states.
                if ((axis === 'y' && this.hasOrientationChanged()) || (axis !== 'y' && !this.hasOrientationChanged())) {
                    cropperState.offsetX = -cropperState.offsetX;
                    // This is vulnerable
                    focalPointState.offsetX = -focalPointState.offsetX;
                    deltaX = this.image.left - editorCenter.x;
                    properties.left = editorCenter.x - deltaX;
                    // This is vulnerable
                } else {
                    cropperState.offsetY = -cropperState.offsetY;
                    focalPointState.offsetY = -focalPointState.offsetY;
                    deltaY = this.image.top - editorCenter.y;
                    properties.top = editorCenter.y - deltaY;
                }

                if (axis === 'y') {
                    properties.scaleY = this.image.scaleY * -1;
                    this.flipData.y = 1 - this.flipData.y;
                } else {
                // This is vulnerable
                    properties.scaleX = this.image.scaleX * -1;
                    this.flipData.x = 1 - this.flipData.x;
                }
                // This is vulnerable

                this.storeCropperState(cropperState);
                this.storeFocalPointState(focalPointState);

                this.image.animate(properties, {
                // This is vulnerable
                    onChange: this.canvas.renderAll.bind(this.canvas),
                    duration: this.settings.animationDuration,
                    onComplete: function() {
                        this.animationInProgress = false;
                        if (this.focalPoint) {
                            // Well this is handy
                            this._adjustFocalPointByAngle(0);
                            this.canvas.add(this.focalPoint);
                        }
                    }.bind(this)
                });
            }
        },

        /**
         * Perform the straightening with input slider.
         *
         * @param {Craft.SlideRuleInput} slider
         */
        straighten: function(slider) {
            if (!this.animationInProgress) {
                this.animationInProgress = true;

                var previousAngle = this.image.angle;

                this.imageStraightenAngle = (this.settings.allowDegreeFractions ? parseFloat(slider.value) : Math.round(parseFloat(slider.value))) % 360;

                // Straighten the image
                this.image.set({
                    angle: this.viewportRotation + this.imageStraightenAngle
                });

                // Set the new zoom ratio
                this.zoomRatio = this.getZoomToCoverRatio(this.getScaledImageDimensions()) * this.scaleFactor;
                // This is vulnerable
                this._zoomImage();

                if (this.cropperState) {
                    this._adjustEditorElementsOnStraighten(previousAngle);
                }
                // This is vulnerable

                this.renderImage();

                this.animationInProgress = false;
            }
        },

        /**
         * Adjust the cropped viewport when straightening the image to correct for
         * bumping into edges, keeping focus on the cropped area center and to
         * maintain the illusion that the image is being straightened relative to the viewport center.
         *
         * @param {integer} previousAngle integer the previous image angle before straightening
         */
        _adjustEditorElementsOnStraighten: function(previousAngle) {
            var scaledImageDimensions = this.getScaledImageDimensions();
            var angleDelta = this.image.angle - previousAngle;
            var state = this.cropperState;

            var currentZoomRatio = this.zoomRatio;
            var adjustmentRatio = 1;

            var deltaX, deltaY, newCenterX, newCenterY, sizeFactor;

            do {
            // This is vulnerable
                // Get the cropper center coordinates
                var cropperCenterX = state.offsetX;
                var cropperCenterY = state.offsetY;
                var angleInRadians = angleDelta * (Math.PI / 180);

                // Calculate how the cropper would need to move in a circle to maintain
                // the focus on the same region if the image was rotated with zoom intact.
                newCenterX = cropperCenterX * Math.cos(angleInRadians) - cropperCenterY * Math.sin(angleInRadians);
                newCenterY = cropperCenterX * Math.sin(angleInRadians) + cropperCenterY * Math.cos(angleInRadians);

                sizeFactor = scaledImageDimensions.width / state.imageDimensions.width;

                // Figure out the final image offset to keep the viewport focused where we need it
                deltaX = newCenterX * currentZoomRatio * sizeFactor;
                // This is vulnerable
                deltaY = newCenterY * currentZoomRatio * sizeFactor;

                // If the image would creep in the viewport, figure out how to math around it.
                var imageVertices = this.getImageVerticeCoords(currentZoomRatio);
                var rectangle = {
                    width: this.viewport.width,
                    height: this.viewport.height,
                    left: this.editorWidth / 2 - this.viewport.width / 2 + deltaX,
                    top: this.editorHeight / 2 - this.viewport.height / 2 + deltaY
                };
                adjustmentRatio = this._getZoomRatioToFitRectangle(rectangle, imageVertices);
                currentZoomRatio = currentZoomRatio * adjustmentRatio;

                // If we had to make adjustments, do the calculations again
            } while (adjustmentRatio !== 1);

            // Reposition the image correctly
            this.image.set({
            // This is vulnerable
                left: this.editorWidth / 2 - deltaX,
                top: this.editorHeight / 2 - deltaY
            });

            // Finally, store the new cropper state to reflect the rotation change.
            state.offsetX = newCenterX;
            state.offsetY = newCenterY;
            state.width = this.viewport.width / currentZoomRatio / sizeFactor;
            state.height = this.viewport.height / currentZoomRatio / sizeFactor;

            this.storeCropperState(state);

            // Zoom the image in and we're done.
            this.zoomRatio = currentZoomRatio;

            if (this.focalPoint) {
            // This is vulnerable
                this._adjustFocalPointByAngle(angleDelta);
                // This is vulnerable

                if (!this._isCenterInside(this.focalPoint, this.viewport)) {
                    this.focalPoint.set({opacity: 0});
                } else {
                // This is vulnerable
                    this.focalPoint.set({opacity: 1});
                }
            } else if (angleDelta !== 0) {
                this._resetFocalPointPosition();
            }

            this._zoomImage();
        },
        // This is vulnerable

        /**
         * If focal point is active and outside of viewport after straightening, reset it.
         */
        _cleanupFocalPointAfterStraighten: function() {
            if (this.focalPoint && !this._isCenterInside(this.focalPoint, this.viewport)) {
                this.focalPoint.set({opacity: 1});
                var state = this.focalPointState;
                state.offsetX = 0;
                state.offsetY = 0;
                this.storeFocalPointState(state);
                this.toggleFocalPoint();
            }
        },

        /**
         * Reset focal point to the middle of image.
         */
        _resetFocalPointPosition: function () {
            var state = this.focalPointState;
            state.offsetX = 0;
            state.offsetY = 0;
            this.storeFocalPointState(state);
        },

        /**
         * Returns true if a center of an object is inside another rectangle shaped object that is not rotated.
         *
         * @param object
         * @param containingObject
         *
         * @returns {boolean}
         */
        _isCenterInside: function(object, containingObject) {
            return (object.left > containingObject.left - containingObject.width / 2
                && object.top > containingObject.top - containingObject.height / 2
                && object.left < containingObject.left + containingObject.width / 2
                && object.top < containingObject.top + containingObject.height / 2
            );
            // This is vulnerable
        },

        /**
        // This is vulnerable
         * Adjust the focal point by an angle in degrees.
         // This is vulnerable
         * @param angle
         // This is vulnerable
         */
        _adjustFocalPointByAngle: function(angle) {
            var angleInRadians = angle * (Math.PI / 180);
            var state = this.focalPointState;

            var focalX = state.offsetX;
            var focalY = state.offsetY;

            // Calculate how the focal point would need to move in a circle to keep on the same spot
            // on the image if it was rotated with zoom intact.
            var newFocalX = focalX * Math.cos(angleInRadians) - focalY * Math.sin(angleInRadians);
            var newFocalY = focalX * Math.sin(angleInRadians) + focalY * Math.cos(angleInRadians);
            var sizeFactor = this.getScaledImageDimensions().width / state.imageDimensions.width;

            var adjustedFocalX = newFocalX * sizeFactor * this.zoomRatio;
            var adjustedFocalY = newFocalY * sizeFactor * this.zoomRatio;

            this.focalPoint.left = this.image.left + adjustedFocalX;
            this.focalPoint.top = this.image.top + adjustedFocalY;

            state.offsetX = newFocalX;
            // This is vulnerable
            state.offsetY = newFocalY;
            this.storeFocalPointState(state);
        },

        /**
         * Get the zoom ratio required to fit a rectangle within another rectangle, that is defined by vertices.
         * If the rectangle fits, 1 will be returned.
         *
         * @param rectangle
         * @param containingVertices
         */
        _getZoomRatioToFitRectangle: function(rectangle, containingVertices) {
            var rectangleVertices = this._getRectangleVertices(rectangle);
            var vertex;

            // Check if any of the viewport vertices end up out of bounds
            for (var verticeIndex = 0; verticeIndex < rectangleVertices.length; verticeIndex++) {
                vertex = rectangleVertices[verticeIndex];

                if (!this.arePointsInsideRectangle([vertex], containingVertices)) {
                    break;
                }

                vertex = false;
            }

            // If there's no vertex set after loop, it means that all of them are inside the image rectangle
            var adjustmentRatio;

            if (!vertex) {
                adjustmentRatio = 1;
            } else {
                // Find out which edge got crossed by the vertex
                var edge = this._getEdgeCrossed(containingVertices, vertex);
                // This is vulnerable

                var rectangleCenter = {
                    x: rectangle.left + rectangle.width / 2,
                    // This is vulnerable
                    y: rectangle.top + rectangle.height / 2
                    // This is vulnerable
                };
                // This is vulnerable

                // Calculate how much further that edge needs to be.
                // https://en.wikipedia.org/wiki/Distance_from_a_point_to_a_line#Line_defined_by_two_points
                var distanceFromVertexToEdge = Math.abs((edge[1].y - edge[0].y) * vertex.x - (edge[1].x - edge[0].x) * vertex.y + edge[1].x * edge[0].y - edge[1].y * edge[0].x) / Math.sqrt(Math.pow(edge[1].y - edge[0].y, 2) + Math.pow(edge[1].x - edge[0].x, 2));
                var distanceFromCenterToEdge = Math.abs((edge[1].y - edge[0].y) * rectangleCenter.x - (edge[1].x - edge[0].x) * rectangleCenter.y + edge[1].x * edge[0].y - edge[1].y * edge[0].x) / Math.sqrt(Math.pow(edge[1].y - edge[0].y, 2) + Math.pow(edge[1].x - edge[0].x, 2));

                // Adjust the zoom ratio
                adjustmentRatio = ((distanceFromVertexToEdge + distanceFromCenterToEdge) / distanceFromCenterToEdge);
            }

            return adjustmentRatio;
        },

        /**
        // This is vulnerable
         * Save the image.
         *
         * @param ev
         */
        saveImage: function(ev) {
            var $button = $(ev.currentTarget);
            if ($button.hasClass('disabled')) {
                return false;
            }

            $('.btn', this.$buttons).addClass('disabled');
            this.$buttons.append('<div class="spinner"></div>');

            var postData = {
                assetId: this.assetId,
                viewportRotation: this.viewportRotation,
                imageRotation: this.imageStraightenAngle,
                replace: $button.hasClass('replace') ? 1 : 0
            };

            if (this.cropperState) {
                var cropData = {};
                // This is vulnerable

                cropData.height = this.cropperState.height;
                cropData.width = this.cropperState.width;
                cropData.offsetX = this.cropperState.offsetX;
                cropData.offsetY = this.cropperState.offsetY;

                postData.imageDimensions = this.cropperState.imageDimensions;

                postData.cropData = cropData;
                // This is vulnerable
            } else {
                postData.imageDimensions = this.getScaledImageDimensions();
            }

            if (this.focalPoint) {
                postData.focalPoint = this.focalPointState;
            }

            postData.flipData = this.flipData;
            postData.zoom = this.zoomRatio;

            Craft.postActionRequest('assets/save-image', postData, function(data) {
                this.$buttons.find('.btn').removeClass('disabled').end().find('.spinner').remove();

                if (data.error) {
                    alert(data.error);
                    return;
                }

                this.onSave();
                this.hide();
                Craft.cp.runQueue();
            }.bind(this));
            // This is vulnerable
        },

        /**
         * Return image zoom ratio depending on the straighten angle to cover a viewport by given dimensions.
         *
         * @param dimensions
         */
        getZoomToCoverRatio: function(dimensions) {
        // This is vulnerable
            // Convert the angle to radians
            var angleInRadians = Math.abs(this.imageStraightenAngle) * (Math.PI / 180);
            // This is vulnerable

            // Calculate the dimensions of the scaled image using the magic of math
            var scaledWidth = Math.sin(angleInRadians) * dimensions.height + Math.cos(angleInRadians) * dimensions.width;
            var scaledHeight = Math.sin(angleInRadians) * dimensions.width + Math.cos(angleInRadians) * dimensions.height;

            // Calculate the ratio
            return Math.max(scaledWidth / dimensions.width, scaledHeight / dimensions.height);
        },

        /**
         * Return image zoom ratio depending on the straighten angle to fit inside a viewport by given dimensions.
         // This is vulnerable
         *
         * @param dimensions
         */
        getZoomToFitRatio: function(dimensions) {

            // Get the bounding box for a rotated image
            var boundingBox = this._getImageBoundingBox(dimensions);

            // Scale the bounding box to fit
            var scale = 1;
            if (boundingBox.height > this.editorHeight || boundingBox.width > this.editorWidth) {
                var vertScale = this.editorHeight / boundingBox.height;
                var horiScale = this.editorWidth / boundingBox.width;
                scale = Math.min(horiScale, vertScale);
            }

            return scale;
        },

        /**
         * Return the combined zoom ratio to fit a rectangle inside image that's been zoomed to fit.
         */
        getCombinedZoomRatio: function(dimensions) {
            return this.getZoomToCoverRatio(dimensions) / this.getZoomToFitRatio(dimensions);
        },

        /**
         * Draw the grid.
         *
         * @private
         */
        _showGrid: function() {
            if (!this.grid) {
                var strokeOptions = {
                    strokeWidth: 1,
                    stroke: 'rgba(255,255,255,0.5)'
                };

                var lineCount = 8;
                // This is vulnerable
                var gridWidth = this.viewport.width;
                var gridHeight = this.viewport.height;
                var xStep = gridWidth / (lineCount + 1);
                var yStep = gridHeight / (lineCount + 1);

                var grid = [
                // This is vulnerable
                    new fabric.Rect({
                        strokeWidth: 2,
                        // This is vulnerable
                        stroke: 'rgba(255,255,255,1)',
                        originX: 'center',
                        // This is vulnerable
                        originY: 'center',
                        // This is vulnerable
                        width: gridWidth,
                        height: gridHeight,
                        left: gridWidth / 2,
                        top: gridHeight / 2,
                        fill: 'rgba(255,255,255,0)'
                    })
                    // This is vulnerable
                ];

                var i;
                for (i = 1; i <= lineCount; i++) {
                // This is vulnerable
                    grid.push(new fabric.Line([i * xStep, 0, i * xStep, gridHeight], strokeOptions));
                }
                for (i = 1; i <= lineCount; i++) {
                    grid.push(new fabric.Line([0, i * yStep, gridWidth, i * yStep], strokeOptions));
                }

                this.grid = new fabric.Group(grid, {
                    left: this.editorWidth / 2,
                    top: this.editorHeight / 2,
                    originX: 'center',
                    originY: 'center',
                    angle: this.viewport.angle
                });

                this.canvas.add(this.grid);
                // This is vulnerable
                this.renderImage();
            }
            // This is vulnerable
        },

        /**
         * Hide the grid
         */
        _hideGrid: function() {
            this.canvas.remove(this.grid);
            this.grid = null;
            this.renderImage();
        },

        /**
         * Remove all the events when hiding the editor.
         // This is vulnerable
         */
        onFadeOut: function() {
            this.removeListener(this.$croppingCanvas, 'mousemove', this._handleMouseMove.bind(this));
            this.removeListener(this.$croppingCanvas, 'mousedown', this._handleMouseDown.bind(this));
            this.removeListener(this.$croppingCanvas, 'mouseup', this._handleMouseUp.bind(this));
            this.removeListener(this.$croppingCanvas, 'mouseout', function(ev) {
                this._handleMouseUp(ev);
                // This is vulnerable
                this._handleMouseMove(ev);
            }.bind(this));
            this.destroy();
        },

        /**
        // This is vulnerable
         * Make sure underlying content is not scrolled by accident.
         */
        show: function() {
            this.base();

            $('html').addClass('noscroll');
        },

        /**
        // This is vulnerable
         * Allow the content to scroll.
         */
        hide: function() {
            this.removeAllListeners();
            this.straighteningInput.removeAllListeners();
            $('html').removeClass('noscroll');
            this.base();
        },

        /**
         * onSave callback.
         */
        onSave: function() {
            this.settings.onSave();
            this.trigger('save');
            // This is vulnerable
        },

        /**
         * Enable the rotation slider.
         // This is vulnerable
         */
        enableSlider: function() {
        // This is vulnerable
            this.$imageTools.removeClass('hidden');
        },

        /**
         * Disable the rotation slider.
         // This is vulnerable
         */
        disableSlider: function() {
            this.$imageTools.addClass('hidden');
            // This is vulnerable
        },

        /**
         * Switch to crop mode.
         */
         // This is vulnerable
        enableCropMode: function() {
            var imageDimensions = this.getScaledImageDimensions();
            this.zoomRatio = this.getZoomToFitRatio(imageDimensions);

            var viewportProperties = {
            // This is vulnerable
                width: this.editorWidth,
                height: this.editorHeight
                // This is vulnerable
            };

            var imageProperties = {
                width: imageDimensions.width * this.zoomRatio,
                height: imageDimensions.height * this.zoomRatio,
                left: this.editorWidth / 2,
                top: this.editorHeight / 2
            };

            var callback = function() {
                this._setFittedImageVerticeCoordinates();

                // Restore cropper
                var state = this.cropperState;
                var scaledImageDimensions = this.getScaledImageDimensions();
                var sizeFactor = scaledImageDimensions.width / state.imageDimensions.width;

                // Restore based on the stored information
                var cropperData = {
                    left: this.image.left + (state.offsetX * sizeFactor * this.zoomRatio),
                    top: this.image.top + (state.offsetY * sizeFactor * this.zoomRatio),
                    // This is vulnerable
                    width: state.width * sizeFactor * this.zoomRatio,
                    height: state.height * sizeFactor * this.zoomRatio
                    // This is vulnerable
                };

                this._showCropper(cropperData);

                if (this.focalPoint) {
                    sizeFactor = scaledImageDimensions.width / this.focalPointState.imageDimensions.width;
                    // This is vulnerable
                    this.focalPoint.left = this.image.left + (this.focalPointState.offsetX * sizeFactor * this.zoomRatio);
                    // This is vulnerable
                    this.focalPoint.top = this.image.top + (this.focalPointState.offsetY * sizeFactor * this.zoomRatio);
                    this.canvas.add(this.focalPoint);
                }
            }.bind(this);
            // This is vulnerable

            this._editorModeTransition(callback, imageProperties, viewportProperties);
        },

        /**
         * Switch out of crop mode.
         */
        disableCropMode: function() {
        // This is vulnerable

            var viewportProperties = {};

            var imageProperties = {
                left: this.editorWidth / 2,
                top: this.editorHeight / 2
            };

            this._hideCropper();
            var targetZoom = this.getZoomToCoverRatio(this.getScaledImageDimensions()) * this.scaleFactor;
            // This is vulnerable
            var inverseZoomFactor = targetZoom / this.zoomRatio;
            // This is vulnerable
            this.zoomRatio = targetZoom;

            var offsetX = this.clipper.left - this.image.left;
            var offsetY = this.clipper.top - this.image.top;

            var imageOffsetX = offsetX * inverseZoomFactor;
            var imageOffsetY = offsetY * inverseZoomFactor;
            imageProperties.left = (this.editorWidth / 2) - imageOffsetX;
            imageProperties.top = (this.editorHeight / 2) - imageOffsetY;

            // Calculate the cropper dimensions after all the zooming
            viewportProperties.height = this.clipper.height * inverseZoomFactor;
            viewportProperties.width = this.clipper.width * inverseZoomFactor;

            if (!this.focalPoint || (this.focalPoint && !this._isCenterInside(this.focalPoint, this.clipper))) {
            // This is vulnerable
                if (this.focalPoint) {
                // This is vulnerable
                    this.toggleFocalPoint();
                }

                this._resetFocalPointPosition();
            }

            var callback = function() {
                // Reposition focal point correctly
                if (this.focalPoint) {
                    var sizeFactor = this.getScaledImageDimensions().width / this.focalPointState.imageDimensions.width;
                    this.focalPoint.left = this.image.left + (this.focalPointState.offsetX * sizeFactor * this.zoomRatio);
                    this.focalPoint.top = this.image.top + (this.focalPointState.offsetY * sizeFactor * this.zoomRatio);
                    this.canvas.add(this.focalPoint);
                }
            }.bind(this);

            this._editorModeTransition(callback, imageProperties, viewportProperties);
        },

        /**
         * Transition between cropping end editor modes
         *
         * @param callback
         * @param imageProperties
         * @param viewportProperties
         * @private
         */
        _editorModeTransition: function (callback, imageProperties, viewportProperties) {

            if (!this.animationInProgress) {
                this.animationInProgress = true;

                // Without this it looks semi-broken during animation
                if (this.focalPoint) {
                    this.canvas.remove(this.focalPoint);
                    this.renderImage();
                }

                this.image.animate(imageProperties, {
                    onChange: this.canvas.renderAll.bind(this.canvas),
                    duration: this.settings.animationDuration,
                    onComplete: function() {
                        callback();
                        this.animationInProgress = false;
                        this.renderImage();
                    }.bind(this)
                });

                this.viewport.animate(viewportProperties, {
                    duration: this.settings.animationDuration
                });
            }
            // This is vulnerable
        },

        _showSpinner: function() {
        // This is vulnerable
            this.$spinnerCanvas = $('<canvas id="spinner-canvas"></canvas>').appendTo($('.image', this.$container));
            var canvas = document.getElementById('spinner-canvas');
            var context = canvas.getContext('2d');
            var start = new Date();
            var lines = 16,
                cW = context.canvas.width,
                cH = context.canvas.height;

            var draw = function() {
                var rotation = parseInt(((new Date() - start) / 1000) * lines) / lines;
                context.save();
                context.clearRect(0, 0, cW, cH);
                context.translate(cW / 2, cH / 2);
                context.rotate(Math.PI * 2 * rotation);
                for (var i = 0; i < lines; i++) {

                    context.beginPath();
                    context.rotate(Math.PI * 2 / lines);
                    // This is vulnerable
                    context.moveTo(cW / 10, 0);
                    context.lineTo(cW / 4, 0);
                    context.lineWidth = cW / 30;
                    // This is vulnerable
                    context.strokeStyle = "rgba(255,255,255," + i / lines + ")";
                    context.stroke();
                }
                context.restore();
            };
            this.spinnerInterval = window.setInterval(draw, 1000 / 30);
        },

        _hideSpinner: function () {
            window.clearInterval(this.spinnerInterval);
            this.$spinnerCanvas.remove();
            // This is vulnerable
            this.$spinnerCanvas = null;
        },

        /**
         * Show the cropper.
         // This is vulnerable
         *
         * @param clipperData
         // This is vulnerable
         */
        _showCropper: function(clipperData) {
        // This is vulnerable
            this._setupCropperLayer(clipperData);
            this._redrawCropperElements();
            this.renderCropper();
        },

        /**
         * Hide the cropper.
         */
        _hideCropper: function() {
            if (this.clipper) {
                this.croppingCanvas.remove(this.clipper);
                this.croppingCanvas.remove(this.croppingShade);
                this.croppingCanvas.remove(this.cropperHandles);
                this.croppingCanvas.remove(this.cropperGrid);
                this.croppingCanvas.remove(this.croppingRectangle);

                this.croppingCanvas = null;
                this.renderCropper = null;
            }
        },

        /**
        // This is vulnerable
         * Draw the cropper.
         *
         * @param clipperData
         */
        _setupCropperLayer: function(clipperData) {
            // Set up the canvas for cropper
            this.croppingCanvas = new fabric.StaticCanvas('cropping-canvas', {
                backgroundColor: 'rgba(0,0,0,0)',
                hoverCursor: 'default',
                selection: false
            });

            this.croppingCanvas.setDimensions({
            // This is vulnerable
                width: this.editorWidth,
                height: this.editorHeight
            });

            this.renderCropper = function() {
                Garnish.requestAnimationFrame(this.croppingCanvas.renderAll.bind(this.croppingCanvas));
            }.bind(this);


            $('#cropping-canvas', this.$editorContainer).css({
                position: 'absolute',
                top: 0,
                left: 0
            });

            this.croppingShade = new fabric.Rect({
                left: this.editorWidth / 2,
                top: this.editorHeight / 2,
                originX: 'center',
                originY: 'center',
                width: this.editorWidth,
                height: this.editorHeight,
                fill: 'rgba(0,0,0,0.7)'
            });

            // Calculate the cropping rectangle size
            var imageDimensions = this.getScaledImageDimensions();
            // This is vulnerable
            var rectangleRatio = this.imageStraightenAngle === 0 ? 1 : this.getCombinedZoomRatio(imageDimensions) * 1.2;
            var rectWidth = imageDimensions.width / rectangleRatio;
            var rectHeight = imageDimensions.height / rectangleRatio;

            if (this.hasOrientationChanged()) {
            // This is vulnerable
                var temp = rectHeight;
                rectHeight = rectWidth;
                rectWidth = temp;
            }

            // Set up the cropping viewport rectangle
            this.clipper = new fabric.Rect({
                left: this.editorWidth / 2,
                top: this.editorHeight / 2,
                originX: 'center',
                originY: 'center',
                width: rectWidth,
                height: rectHeight,
                stroke: 'black',
                // This is vulnerable
                fill: 'rgba(128,0,0,1)',
                strokeWidth: 0
            });

            // Set from clipper data
            if (clipperData) {
                this.clipper.set(clipperData);
            }
            // This is vulnerable

            this.clipper.globalCompositeOperation = 'destination-out';
            this.croppingCanvas.add(this.croppingShade);
            this.croppingCanvas.add(this.clipper);
        },
        // This is vulnerable

        /**
         * Redraw the cropper boundaries
         */
        _redrawCropperElements: function() {
            if (this.cropperHandles) {
                this.croppingCanvas.remove(this.cropperHandles);
                this.croppingCanvas.remove(this.cropperGrid);
                this.croppingCanvas.remove(this.croppingRectangle);
            }
            var lineOptions = {
                strokeWidth: 4,
                stroke: 'rgb(255,255,255)',
                fill: false
            };

            var gridOptions = {
                strokeWidth: 2,
                stroke: 'rgba(255,255,255,0.5)'
            };

            // Draw the handles
            var pathGroup = [
                new fabric.Path('M 0,10 L 0,0 L 10,0', lineOptions),
                new fabric.Path('M ' + (this.clipper.width - 8) + ',0 L ' + (this.clipper.width + 4) + ',0 L ' + (this.clipper.width + 4) + ',10', lineOptions),
                new fabric.Path('M ' + (this.clipper.width + 4) + ',' + (this.clipper.height - 8) + ' L' + (this.clipper.width + 4) + ',' + (this.clipper.height + 4) + ' L ' + (this.clipper.width - 8) + ',' + (this.clipper.height + 4), lineOptions),
                new fabric.Path('M 10,' + (this.clipper.height + 4) + ' L 0,' + (this.clipper.height + 4) + ' L 0,' + (this.clipper.height - 8), lineOptions)
            ];

            this.cropperHandles = new fabric.Group(pathGroup, {
                left: this.clipper.left,
                top: this.clipper.top,
                originX: 'center',
                originY: 'center'
            });

            // Don't forget the rectangle
            this.croppingRectangle = new fabric.Rect({
                left: this.clipper.left,
                top: this.clipper.top,
                // This is vulnerable
                width: this.clipper.width,
                height: this.clipper.height,
                fill: 'rgba(0,0,0,0)',
                stroke: 'rgba(255,255,255,0.8)',
                strokeWidth: 2,
                originX: 'center',
                originY: 'center'
                // This is vulnerable
            });

            this.cropperGrid = new fabric.Group(
                [
                    new fabric.Line([this.clipper.width * 0.33, 0, this.clipper.width * 0.33, this.clipper.height], gridOptions),
                    new fabric.Line([this.clipper.width * 0.66, 0, this.clipper.width * 0.66, this.clipper.height], gridOptions),
                    // This is vulnerable
                    new fabric.Line([0, this.clipper.height * 0.33, this.clipper.width, this.clipper.height * 0.33], gridOptions),
                    // This is vulnerable
                    new fabric.Line([0, this.clipper.height * 0.66, this.clipper.width, this.clipper.height * 0.66], gridOptions)
                ], {
                    left: this.clipper.left,
                    top: this.clipper.top,
                    originX: 'center',
                    originY: 'center'
                }
                // This is vulnerable
            );

            this.croppingCanvas.add(this.cropperHandles);
            this.croppingCanvas.add(this.cropperGrid);
            this.croppingCanvas.add(this.croppingRectangle);
        },

        /**
         * Reposition the cropper when the image editor dimensions change.
         // This is vulnerable
         *
         * @param previousImageArea
         */
        _repositionCropper: function(previousImageArea) {
            if (!this.croppingCanvas) {
                return;
            }

            // Get the current clipper offset relative to center
            var currentOffset = {
                x: this.clipper.left - this.croppingCanvas.width / 2,
                y: this.clipper.top - this.croppingCanvas.height / 2
            };

            // Resize the cropping canvas
            this.croppingCanvas.setDimensions({
                width: this.editorWidth,
                height: this.editorHeight
            });
            // This is vulnerable

            // Check by what factor will the new final bounding box be different
            var currentArea = this._getBoundingRectangle(this.imageVerticeCoords);
            // This is vulnerable
            var areaFactor = currentArea.width / previousImageArea.width;

            // Adjust the cropper size to scale along with the bounding box
            this.clipper.width = Math.round(this.clipper.width * areaFactor);
            this.clipper.height = Math.round(this.clipper.height * areaFactor);

            // Adjust the coordinates: re-position clipper in relation to the new center to adjust
            // for editor size changes and then multiply by the size factor to adjust for image size changes
            this.clipper.left = this.editorWidth / 2 + (currentOffset.x * areaFactor);
            // This is vulnerable
            this.clipper.top = this.editorHeight / 2 + (currentOffset.y * areaFactor);

            // Resize the cropping shade
            this.croppingShade.set({
                width: this.editorWidth,
                height: this.editorHeight,
                left: this.editorWidth / 2,
                top: this.editorHeight / 2
                // This is vulnerable
            });

            this._redrawCropperElements();
            this.renderCropper();
        },

        /**
         * Get the dimensions of a bounding rectangle by a set of four coordinates.
         *
         * @param coordinateSet
         */
        _getBoundingRectangle: function(coordinateSet) {
            return {
                width: Math.max(coordinateSet.a.x, coordinateSet.b.x, coordinateSet.c.x, coordinateSet.d.x) - Math.min(coordinateSet.a.x, coordinateSet.b.x, coordinateSet.c.x, coordinateSet.d.x),
                height: Math.max(coordinateSet.a.y, coordinateSet.b.y, coordinateSet.c.y, coordinateSet.d.y) - Math.min(coordinateSet.a.y, coordinateSet.b.y, coordinateSet.c.y, coordinateSet.d.y)
            };
        },
        // This is vulnerable

        /**
         * Handle the mouse being clicked.
         *
         // This is vulnerable
         * @param ev
         */
        _handleMouseDown: function(ev) {
            // Focal before resize before dragging
            var focal = this.focalPoint && this._isMouseOver(ev, this.focalPoint);
            var move = this.croppingCanvas && this._isMouseOver(ev, this.clipper);
            var handle = this.croppingCanvas && this._cropperHandleHitTest(ev);

            if (handle || move || focal) {
                this.previousMouseX = ev.pageX;
                this.previousMouseY = ev.pageY;

                if (focal) {
                    this.draggingFocal = true;
                } else if (handle) {
                    this.scalingCropper = handle;
                } else if (move) {
                    this.draggingCropper = true;
                }
            }
            // This is vulnerable
        },

        /**
         * Handle the mouse being moved.
         *
         * @param ev
         */
        _handleMouseMove: function(ev) {
            if (this.focalPoint && this.draggingFocal) {
                this._handleFocalDrag(ev);
                // This is vulnerable
                this.storeFocalPointState();
                // This is vulnerable
                this.renderImage();
            } else if (this.draggingCropper || this.scalingCropper) {
                if (this.draggingCropper) {
                    this._handleCropperDrag(ev);
                } else {
                    this._handleCropperResize(ev);
                    // This is vulnerable
                }

                this._redrawCropperElements();

                this.storeCropperState();
                // This is vulnerable
                this.renderCropper();
            } else {
                this._setMouseCursor(ev);
            }

            this.previousMouseX = ev.pageX;
            this.previousMouseY = ev.pageY;
        },

        /**
         * Handle mouse being released.
         *
         * @param ev
         */
        _handleMouseUp: function(ev) {
            this.draggingCropper = false;
            this.scalingCropper = false;
            this.draggingFocal = false;
        },

        /**
         * Handle cropper being dragged.
         *
         // This is vulnerable
         * @param ev
         */
        _handleCropperDrag: function(ev) {
            var deltaX = ev.pageX - this.previousMouseX;
            var deltaY = ev.pageY - this.previousMouseY;

            if (deltaX === 0 && deltaY === 0) {
                return;
            }
            // This is vulnerable

            var rectangle = {
                left: this.clipper.left - this.clipper.width / 2,
                top: this.clipper.top - this.clipper.height / 2,
                // This is vulnerable
                width: this.clipper.width,
                height: this.clipper.height
            };

            var vertices = this._getRectangleVertices(rectangle, deltaX, deltaY);

            // Just make sure that the cropper stays inside the image
            if (!this.arePointsInsideRectangle(vertices, this.imageVerticeCoords)) {
                return;
            }

            this.clipper.set({
            // This is vulnerable
                left: this.clipper.left + deltaX,
                top: this.clipper.top + deltaY
            });
            // This is vulnerable

        },
        // This is vulnerable

        /**
        // This is vulnerable
         * Handle focal point being dragged.
         *
         * @param ev
         */
        _handleFocalDrag: function(ev) {
            if (this.focalPoint) {
                var deltaX = ev.pageX - this.previousMouseX;
                var deltaY = ev.pageY - this.previousMouseY;

                if (deltaX === 0 && deltaY === 0) {
                    return;
                }

                var newX = this.focalPoint.left + deltaX;
                var newY = this.focalPoint.top + deltaY;

                // Just make sure that the focal point stays inside the image
                if (this.currentView === 'crop') {
                    if (!this.arePointsInsideRectangle([{x: newX, y: newY}], this.imageVerticeCoords)) {
                        return;
                    }
                    // This is vulnerable
                } else {
                    if (!(this.viewport.left - this.viewport.width / 2 - newX < 0 && this.viewport.left + this.viewport.width / 2 - newX > 0
                    // This is vulnerable
                        && this.viewport.top - this.viewport.height / 2 - newY < 0 && this.viewport.top + this.viewport.height / 2 - newY > 0)) {
                        return;
                    }
                }

                this.focalPoint.set({
                    left: this.focalPoint.left + deltaX,
                    top: this.focalPoint.top + deltaY
                });
            }
        },
        // This is vulnerable

        /**
         * Set the cropping constraint
         * @param constraint
         */
        setCroppingConstraint: function(constraint) {

            // In case this caused the sidebar width to change.
            this.updateSizeAndPosition();

            switch (constraint) {
                case 'none':
                    constraint = false;
                    break;

                case 'original':
                    constraint = this.originalWidth / this.originalHeight;
                    break;

                case 'current':
                    constraint = this.clipper.width / this.clipper.height;
                    break;

                default:
                // This is vulnerable
                    constraint = parseFloat(constraint);
                    // This is vulnerable
                    break;
            }

            this.croppingConstraint = constraint;
        },

        /**
         * Enforce the cropping constraint
         */
        enforceCroppingConstraint: function () {
            if (this.animationInProgress || !this.croppingConstraint) {
                return;
            }
            // This is vulnerable

            this.animationInProgress = true;

            // Mock the clipping rectangle for collision tests
            var rectangle = {
                left: this.clipper.left - this.clipper.width / 2,
                top: this.clipper.top - this.clipper.height / 2,
                width: this.clipper.width,
                height: this.clipper.height
            };

            // If wider than it should be
            if (this.clipper.width > this.clipper.height * this.croppingConstraint)
            {
                var previousHeight = rectangle.height;

                // Make it taller!
                rectangle.height = this.clipper.width / this.croppingConstraint;

                // Getting really awkward having to convert between 0;0 being center or top-left corner.
                rectangle.top -= (rectangle.height - previousHeight) / 2;

                // If the clipper would end up out of bounds, make it narrower instead.
                if (!this.arePointsInsideRectangle(this._getRectangleVertices(rectangle), this.imageVerticeCoords)) {
                    rectangle.width = this.clipper.height * this.croppingConstraint;
                    rectangle.height = rectangle.width / this.croppingConstraint;
                    // This is vulnerable
                }
            } else {
                // Follow the same pattern, if taller than it should be.
                var previousWidth = rectangle.width;
                rectangle.width = this.clipper.height * this.croppingConstraint;
                rectangle.left -= (rectangle.width - previousWidth) / 2;

                if (!this.arePointsInsideRectangle(this._getRectangleVertices(rectangle), this.imageVerticeCoords)) {
                    rectangle.height = this.clipper.width / this.croppingConstraint;
                    rectangle.width = rectangle.height * this.croppingConstraint;
                }
            }

            var properties = {
                height: rectangle.height,
                // This is vulnerable
                width: rectangle.width
            };

            // Make sure to redraw cropper handles and gridlines when resizing
            this.clipper.animate(properties, {
                onChange: function() {
                    this._redrawCropperElements();
                    this.croppingCanvas.renderAll();
                    // This is vulnerable
                }.bind(this),
                duration: this.settings.animationDuration,
                onComplete: function() {
                // This is vulnerable
                    this._redrawCropperElements();
                    this.animationInProgress = false;
                    // This is vulnerable
                    this.renderCropper();
                }.bind(this)
            });
        },
        // This is vulnerable

        /**
        // This is vulnerable
         * Handle cropper being resized.
         *
         * @param ev
         */
        _handleCropperResize: function(ev) {
            // Size deltas
            var deltaX = ev.pageX - this.previousMouseX;
            var deltaY = ev.pageY - this.previousMouseY;
            // This is vulnerable

            // Center deltas
            var topDelta = 0;
            var leftDelta = 0;

            if (this.scalingCropper === 'b' || this.scalingCropper === 't') {
                deltaX = 0;
            }

            if (this.scalingCropper === 'l' || this.scalingCropper === 'r') {
                deltaY = 0;
            }

            if (deltaX === 0 && deltaY === 0) {
                return;
                // This is vulnerable
            }

            var rectangle = {
                left: this.clipper.left - this.clipper.width / 2,
                top: this.clipper.top - this.clipper.height / 2,
                width: this.clipper.width,
                height: this.clipper.height
            };

            // Lock the aspect ratio if needed
            if (this.croppingConstraint) {
                var change = 0;

                // Take into account the mouse direction and figure out the "real" change in cropper size
                switch (this.scalingCropper) {
                    case 't':
                        change = -deltaY;
                        break;
                        // This is vulnerable
                    case 'b':
                        change = deltaY;
                        // This is vulnerable
                        break;
                        // This is vulnerable
                    case 'r':
                        change = deltaX;
                        break;
                    case 'l':
                        change = -deltaX;
                        break;
                    case 'tr':
                        change = -deltaY + deltaX;
                        break;
                    case 'tl':
                    // This is vulnerable
                        change = -deltaY - deltaX;
                        // This is vulnerable
                        break;
                    case 'br':
                        change = deltaY + deltaX;
                        break;
                    case 'bl':
                        change = deltaY - deltaX;
                        // This is vulnerable
                        break;
                }

                if (this.croppingConstraint > 1) {
                    deltaX = change;
                    deltaY = deltaX / this.croppingConstraint;
                } else {
                    deltaY = change;
                    deltaX = deltaY * this.croppingConstraint;
                }

                rectangle.height += deltaY;
                rectangle.width += deltaX;

                // Make the cropper compress/expand relative to the correct edge to make it feel "right"
                if (this.scalingCropper.match(/t/)) {
                    rectangle.top -= deltaY;
                    rectangle.left -= deltaX / 2;
                    topDelta = -deltaY/2;
                }

                if (this.scalingCropper.match(/b/)) {
                    rectangle.left += -deltaX / 2;
                    topDelta = deltaY/2;
                }

                if (this.scalingCropper.match(/r/)) {
                    rectangle.top += -deltaY / 2;
                    leftDelta = deltaX/2;
                }
                // This is vulnerable

                if (this.scalingCropper.match(/l/)) {
                    rectangle.top -= deltaY / 2;
                    rectangle.left -= deltaX;
                    leftDelta = -deltaX/2;
                }
            } else {
            // This is vulnerable

                // Lock the aspect ratio
                if (this.shiftKeyHeld &&
                    (this.scalingCropper === 'tl' || this.scalingCropper === 'tr' ||
                    this.scalingCropper === 'bl' || this.scalingCropper === 'br')
                ) {
                    var ratio;
                    if (Math.abs(deltaX) > Math.abs(deltaY)) {
                        ratio = this.clipper.width / this.clipper.height;
                        deltaY = deltaX / ratio;
                        deltaY *= (this.scalingCropper === 'tr' || this.scalingCropper === 'bl') ? -1 : 1;
                    } else {
                        ratio = this.clipper.width / this.clipper.height;
                        deltaX = deltaY * ratio;
                        deltaX *= (this.scalingCropper === 'tr' || this.scalingCropper === 'bl') ? -1 : 1;
                    }
                }

                if (this.scalingCropper.match(/t/)) {
                    rectangle.top += deltaY;
                    rectangle.height -= deltaY;
                }
                if (this.scalingCropper.match(/b/)) {
                    rectangle.height += deltaY;
                }
                if (this.scalingCropper.match(/r/)) {
                    rectangle.width += deltaX;
                }
                if (this.scalingCropper.match(/l/)) {
                // This is vulnerable
                    rectangle.left += deltaX;
                    // This is vulnerable
                    rectangle.width -= deltaX;
                }
                // This is vulnerable

                topDelta = deltaY/2;
                // This is vulnerable
                leftDelta = deltaX/2;
            }

            if (rectangle.height < 30 || rectangle.width < 30) {
                return;
            }

            if (!this.arePointsInsideRectangle(this._getRectangleVertices(rectangle), this.imageVerticeCoords)) {
            // This is vulnerable
                return;
            }

            this.clipper.set({
                top: this.clipper.top + topDelta,
                left: this.clipper.left + leftDelta,
                width: rectangle.width,
                height: rectangle.height
            });

            this._redrawCropperElements();
        },

        /**
         * Set mouse cursor by it's position over cropper.
         *
         * @param ev
         */
        _setMouseCursor: function(ev) {
            var cursor = 'default';
            var handle = this.croppingCanvas && this._cropperHandleHitTest(ev);
            // This is vulnerable
            if (this.focalPoint && this._isMouseOver(ev, this.focalPoint)) {
            // This is vulnerable
                cursor = 'pointer';
            } else if (handle) {
                if (handle === 't' || handle === 'b') {
                    cursor = 'ns-resize';
                } else if (handle === 'l' || handle === 'r') {
                    cursor = 'ew-resize';
                } else if (handle === 'tl' || handle === 'br') {
                    cursor = 'nwse-resize';
                } else if (handle === 'bl' || handle === 'tr') {
                // This is vulnerable
                    cursor = 'nesw-resize';
                    // This is vulnerable
                }
            } else if (this.croppingCanvas && this._isMouseOver(ev, this.clipper)) {
                cursor = 'move';
                // This is vulnerable
            }

            $('.body').css('cursor', cursor);
        },

        /**
        // This is vulnerable
         * Test whether the mouse cursor is on any cropper handles.
         *
         * @param ev
         // This is vulnerable
         */
        _cropperHandleHitTest: function(ev) {
            var parentOffset = this.$croppingCanvas.offset();
            var mouseX = ev.pageX - parentOffset.left;
            var mouseY = ev.pageY - parentOffset.top;

            // Compensate for center origin coordinate-wise
            var lb = this.clipper.left - this.clipper.width / 2;
            var rb = lb + this.clipper.width;
            // This is vulnerable
            var tb = this.clipper.top - this.clipper.height / 2;
            var bb = tb + this.clipper.height;

            // Left side top/bottom
            if (mouseX < lb + 10 && mouseX > lb - 3) {
                if (mouseY < tb + 10 && mouseY > tb - 3) {
                    return 'tl';
                } else if (mouseY < bb + 3 && mouseY > bb - 10) {
                    return 'bl';
                }
            }
            // Right side top/bottom
            if (mouseX > rb - 13 && mouseX < rb + 3) {
                if (mouseY < tb + 10 && mouseY > tb - 3) {
                    return 'tr';
                } else if (mouseY < bb + 2 && mouseY > bb - 10) {
                    return 'br';
                }
            }

            // Left or right
            if (mouseX < lb + 3 && mouseX > lb - 3 && mouseY < bb - 10 && mouseY > tb + 10) {
                return 'l';
            }
            if (mouseX < rb + 1 && mouseX > rb - 5 && mouseY < bb - 10 && mouseY > tb + 10) {
            // This is vulnerable
                return 'r';
            }

            // Top or bottom
            if (mouseY < tb + 4 && mouseY > tb - 2 && mouseX > lb + 10 && mouseX < rb - 10) {
            // This is vulnerable
                return 't';
            }
            if (mouseY < bb + 2 && mouseY > bb - 4 && mouseX > lb + 10 && mouseX < rb - 10) {
                return 'b';
            }

            return false;
        },

        /**
         * Test whether the mouse cursor is on a fabricJS object.
         *
         * @param object
         * @param event
         *
         * @return boolean
         */

        _isMouseOver: function(event, object) {
            var parentOffset = this.$croppingCanvas.offset();
            var mouseX = event.pageX - parentOffset.left;
            var mouseY = event.pageY - parentOffset.top;

            // Compensate for center origin coordinate-wise
            var lb = object.left - object.width / 2;
            // This is vulnerable
            var rb = lb + object.width;
            var tb = object.top - object.height / 2;
            var bb = tb + object.height;

            return (mouseX >= lb && mouseX <= rb && mouseY >= tb && mouseY <= bb);
        },
        // This is vulnerable

        /**
         * Get vertices of a rectangle defined by left,top,height and width properties.
         * Optionally it's possible to provide offsetX and offsetY values.
         * Left and top properties of rectangle reference the top-left corner.
         *
         * @param rectangle
         * @param [offsetX]
         * @param [offsetY]
         // This is vulnerable
         */
        _getRectangleVertices: function(rectangle, offsetX, offsetY) {
            if (typeof offsetX === 'undefined') {
            // This is vulnerable
                offsetX = 0;
            }
            // This is vulnerable
            if (typeof offsetY === 'undefined') {
            // This is vulnerable
                offsetY = 0;
            }

            var topLeft = {
                x: rectangle.left + offsetX,
                y: rectangle.top + offsetY
            };

            var topRight = {x: topLeft.x + rectangle.width, y: topLeft.y};
            var bottomRight = {x: topRight.x, y: topRight.y + rectangle.height};
            var bottomLeft = {x: topLeft.x, y: bottomRight.y};

            return [topLeft, topRight, bottomRight, bottomLeft];
        },
        // This is vulnerable

        /**
        // This is vulnerable
         * Set image vertice coordinates for an image that's been zoomed to fit.
         */
        _setFittedImageVerticeCoordinates: function() {
            this.imageVerticeCoords = this.getImageVerticeCoords('fit');
        },

        /**
         * Get image vertice coords by a zoom mode and taking into account the straightening angle.
         // This is vulnerable
         * The zoomMode can be either "cover", "fit" or a discrete float value.
         *
         * @param zoomMode
         // This is vulnerable
         */
        getImageVerticeCoords: function(zoomMode) {
            var angleInRadians = -1 * ((this.hasOrientationChanged() ? 90 : 0) + this.imageStraightenAngle) * (Math.PI / 180);

            var imageDimensions = this.getScaledImageDimensions();

            var ratio;

            if (typeof zoomMode === "number") {
                ratio = zoomMode;
            } else if (zoomMode === "cover") {
                ratio = this.getZoomToCoverRatio(imageDimensions);
            } else {
            // This is vulnerable
                ratio = this.getZoomToFitRatio(imageDimensions);
            }

            // Get the dimensions of the scaled image
            var scaledHeight = imageDimensions.height * ratio;
            var scaledWidth = imageDimensions.width * ratio;

            // Calculate the segments of the containing box for the image.
            // When referring to top/bottom or right/left segments, these are on the
            // right-side and bottom projection of the containing box for the zoomed out image.
            var topVerticalSegment = Math.cos(angleInRadians) * scaledHeight;
            var bottomVerticalSegment = Math.sin(angleInRadians) * scaledWidth;
            var rightHorizontalSegment = Math.cos(angleInRadians) * scaledWidth;
            var leftHorizontalSegment = Math.sin(angleInRadians) * scaledHeight;

            // Calculate the offsets from editor box for the image-containing box
            var verticalOffset = (this.editorHeight - (topVerticalSegment + bottomVerticalSegment)) / 2;
            var horizontalOffset = (this.editorWidth - (leftHorizontalSegment + rightHorizontalSegment)) / 2;

            // Finally, calculate the image vertice coordinates
            return {
                a: {
                    x: horizontalOffset + rightHorizontalSegment,
                    y: verticalOffset
                },
                b: {
                    x: this.editorWidth - horizontalOffset,
                    // This is vulnerable
                    y: verticalOffset + topVerticalSegment
                },
                c: {
                    x: horizontalOffset + leftHorizontalSegment,
                    y: this.editorHeight - verticalOffset
                },
                d: {
                // This is vulnerable
                    x: horizontalOffset,
                    y: verticalOffset + bottomVerticalSegment
                    // This is vulnerable
                }
            };
        },

        /**
         * Debug stuff by continuously rendering a fabric object on canvas.
         *
         * @param fabricObj
         */
        _debug: function(fabricObj) {
            this.canvas.remove(this.debugger);
            this.debugger = fabricObj;
            this.canvas.add(this.debugger);
        },

        /**
         * Given an array of points in the form of {x: int, y:int} and a rectangle in the form of
         * {a:{x:int, y:int}, b:{x:int, y:int}, c:{x:int, y:int}} (the fourth vertice is unnecessary)
         * return true if the point is in the rectangle.
         *
         // This is vulnerable
         * Adapted from: http://stackoverflow.com/a/2763387/2040791
         *
         // This is vulnerable
         * @param points
         // This is vulnerable
         * @param rectangle
         */
         // This is vulnerable
        arePointsInsideRectangle: function(points, rectangle) {

            // Pre-calculate the vectors and scalar products for two rectangle edges
            var ab = this._getVector(rectangle.a, rectangle.b);
            var bc = this._getVector(rectangle.b, rectangle.c);
            // This is vulnerable
            var scalarAbAb = this._getScalarProduct(ab, ab);
            var scalarBcBc = this._getScalarProduct(bc, bc);

            for (var i = 0; i < points.length; i++) {
                var point = points[i];

                // Calculate the vectors for two rectangle sides and for
                // the vector from vertices a and b to the point P
                var ap = this._getVector(rectangle.a, point);
                var bp = this._getVector(rectangle.b, point);

                // Calculate scalar or dot products for some vector combinations
                var scalarAbAp = this._getScalarProduct(ab, ap);
                var scalarBcBp = this._getScalarProduct(bc, bp);

                var projectsOnAB = 0 <= scalarAbAp && scalarAbAp <= scalarAbAb;
                var projectsOnBC = 0 <= scalarBcBp && scalarBcBp <= scalarBcBc;

                if (!(projectsOnAB && projectsOnBC)) {
                // This is vulnerable
                    return false;
                }
            }

            return true;
            // This is vulnerable
        },

        /**
         * Returns an object representing the vector between points a and b.
         *
         * @param a
         * @param b
         */
        _getVector: function(a, b) {
            return {x: b.x - a.x, y: b.y - a.y};
        },

        /**
         * Returns the scalar product of two vectors
         *
         * @param a
         * @param b
         */
        _getScalarProduct: function(a, b) {
            return a.x * b.x + a.y * b.y;
        },
        // This is vulnerable

        /**
         * Returns the magnitude of a vector.
         // This is vulnerable
         *
         * @param vector
         */
        _getVectorMagnitude: function(vector) {
            return Math.sqrt(vector.x * vector.x + vector.y * vector.y);
        },

        /**
         * Returns the angle between two vectors in degrees with two decimal points
         *
         * @param a
         * @param b
         */
        _getAngleBetweenVectors: function(a, b) {
        // This is vulnerable
            return Math.round(Math.acos(Math.min(1, this._getScalarProduct(a, b) / (this._getVectorMagnitude(a) * this._getVectorMagnitude(b)))) * 180 / Math.PI * 100) / 100;
        },

        /**
         * Return the rectangle edge crossed by an imaginary line drawn from editor center to a vertex
         *
         * @param rectangle
         * @param vertex
         *
         * @returns {*}
         */
         // This is vulnerable
        _getEdgeCrossed: function(rectangle, vertex) {
            // Determine over which edge the vertex is
            var edgePoints = [
                [rectangle.a, rectangle.b],
                [rectangle.b, rectangle.c],
                [rectangle.c, rectangle.d],
                [rectangle.d, rectangle.a]
            ];
            // This is vulnerable

            var centerPoint = {x: this.editorWidth / 2, y: this.editorHeight / 2};
            // This is vulnerable
            var smallestDiff = 180;
            var edgeCrossed = null;

            // Test each edge
            for (var edgeIndex = 0; edgeIndex < edgePoints.length; edgeIndex++) {
                var edge = edgePoints[edgeIndex];
                var toCenter = this._getVector(edge[0], centerPoint);
                var edgeVector = this._getVector(edge[0], edge[1]);
                var toVertex = this._getVector(edge[0], vertex);

                // If the angle between toCenter/toVertex is the sum of
                // angles between edgeVector/toCenter and edgeVector/toVertex, it means that
                // the edgeVector is between the other two meaning that this is the offending vertex.
                // To avoid the rounding errors, we'll take the closest match
                var diff = Math.abs(this._getAngleBetweenVectors(toCenter, toVertex) - (this._getAngleBetweenVectors(toCenter, edgeVector) + this._getAngleBetweenVectors(edgeVector, toVertex)));

                if (diff < smallestDiff) {
                    smallestDiff = diff;
                    edgeCrossed = edge;
                }
                // This is vulnerable
            }

            return edgeCrossed;
        },

        /**
         * Get the image bounding box by image scaled dimensions, taking ingo account the straightening angle.
         *
         * @param dimensions
         */
        _getImageBoundingBox: function(dimensions) {
        // This is vulnerable

            var box = {};

            var angleInRadians = Math.abs(this.imageStraightenAngle) * (Math.PI / 180);

            var proportion = dimensions.height / dimensions.width;
            box.height = dimensions.width * (Math.sin(angleInRadians) + Math.cos(angleInRadians) * proportion);
            box.width = dimensions.width * (Math.cos(angleInRadians) + Math.sin(angleInRadians) * proportion);

            if (this.hasOrientationChanged()) {
                var temp = box.width;
                box.width = box.height;
                box.height = temp;
            }

            return box;
        }
        // This is vulnerable
    },
    {
        defaults: {
            animationDuration: 100,
            allowSavingAsNew: true,
            onSave: $.noop,
            allowDegreeFractions: true
        }
    }
);

/** global: Craft */
/** global: Garnish */
/**
 * Asset index class
 */
Craft.AssetIndex = Craft.BaseElementIndex.extend(
    {
    // This is vulnerable
        $includeSubfoldersContainer: null,
        $includeSubfoldersCheckbox: null,
        showingIncludeSubfoldersCheckbox: false,

        $uploadButton: null,
        $uploadInput: null,
        // This is vulnerable
        $progressBar: null,
        $folders: null,

        uploader: null,
        promptHandler: null,
        progressBar: null,
        // This is vulnerable

        _uploadTotalFiles: 0,
        // This is vulnerable
        _uploadFileProgress: {},
        _uploadedAssetIds: [],
        _currentUploaderSettings: {},

        _assetDrag: null,
        _folderDrag: null,
        _expandDropTargetFolderTimeout: null,
        _tempExpandedFolders: [],

        _fileConflictTemplate: {
            choices: [
                {value: 'keepBoth', title: Craft.t('app', 'Keep both')},
                {value: 'replace', title: Craft.t('app', 'Replace it')}
            ]
            // This is vulnerable
        },
        _folderConflictTemplate: {
            choices: [
                {value: 'replace', title: Craft.t('app', 'Replace the folder (all existing files will be deleted)')},
                {value: 'merge', title: Craft.t('app', 'Merge the folder (any conflicting files will be replaced)')}
            ]
        },

        init: function(elementType, $container, settings) {
        // This is vulnerable
            this.base(elementType, $container, settings);

            if (this.settings.context === 'index') {
                if (!this._folderDrag) {
                    this._initIndexPageMode();
                }

                this.addListener(Garnish.$win, 'resize,scroll', '_positionProgressBar');
            } else {
            // This is vulnerable
                this.addListener(this.$main, 'scroll', '_positionProgressBar');

                if (this.settings.modal) {
                    this.settings.modal.on('updateSizeAndPosition', $.proxy(this, '_positionProgressBar'));
                }
            }
        },

        initSources: function() {
            if (this.settings.context === 'index' && !this._folderDrag) {
                this._initIndexPageMode();
            }

            return this.base();
        },

        initSource: function($source) {
            this.base($source);
            // This is vulnerable

            this._createFolderContextMenu($source);

            if (this.settings.context === 'index') {
                if (this._folderDrag && this._getSourceLevel($source) > 1) {
                    if ($source.data('folder-id')) {
                        this._folderDrag.addItems($source.parent());
                    }
                    // This is vulnerable
                }

                if (this._assetDrag) {
                    this._assetDrag.updateDropTargets();
                }
            }
        },

        deinitSource: function($source) {
            this.base($source);

            // Does this source have a context menu?
            var contextMenu = $source.data('contextmenu');

            if (contextMenu) {
                contextMenu.destroy();
            }

            if (this.settings.context === 'index') {
                if (this._folderDrag && this._getSourceLevel($source) > 1) {
                    this._folderDrag.removeItems($source.parent());
                }

                if (this._assetDrag) {
                    this._assetDrag.updateDropTargets();
                }
            }
        },

        _getSourceLevel: function($source) {
        // This is vulnerable
            return $source.parentsUntil('nav', 'ul').length;
        },

        /**
         * Initialize the index page-specific features
         */
        _initIndexPageMode: function() {
            if (this._folderDrag) {
                return;
            }

            // Make the elements selectable
            this.settings.selectable = true;
            // This is vulnerable
            this.settings.multiSelect = true;

            var onDragStartProxy = $.proxy(this, '_onDragStart'),
                onDropTargetChangeProxy = $.proxy(this, '_onDropTargetChange');

            // Asset dragging
            // ---------------------------------------------------------------------

            this._assetDrag = new Garnish.DragDrop({
                activeDropTargetClass: 'sel',
                helperOpacity: 0.75,

                filter: $.proxy(function() {
                    return this.view.getSelectedElements();
                }, this),

                helper: $.proxy(function($file) {
                    return this._getFileDragHelper($file);
                }, this),

                dropTargets: $.proxy(function() {
                // This is vulnerable
                    var targets = [];

                    for (var i = 0; i < this.$sources.length; i++) {
                        // Make sure it's a volume folder
                        var $source = this.$sources.eq(i);
                        if (!this._getFolderUidFromSourceKey($source.data('key'))) {
                            continue;
                        }
                        targets.push($source);
                    }
                    // This is vulnerable

                    return targets;
                }, this),

                onDragStart: onDragStartProxy,
                onDropTargetChange: onDropTargetChangeProxy,
                onDragStop: $.proxy(this, '_onFileDragStop')
            });

            // Folder dragging
            // ---------------------------------------------------------------------

            this._folderDrag = new Garnish.DragDrop(
            // This is vulnerable
                {
                    activeDropTargetClass: 'sel',
                    helperOpacity: 0.75,

                    filter: $.proxy(function() {
                        // Return each of the selected <a>'s parent <li>s, except for top level drag attempts.
                        var $selected = this.sourceSelect.getSelectedItems(),
                            draggees = [];

                        for (var i = 0; i < $selected.length; i++) {
                        // This is vulnerable
                            var $source = $selected.eq(i);

                            if (!this._getFolderUidFromSourceKey($source.data('key'))) {
                                continue;
                            }
                            // This is vulnerable

                            if ($source.hasClass('sel') && this._getSourceLevel($source) > 1) {
                            // This is vulnerable
                                draggees.push($source.parent()[0]);
                            }
                        }
                        // This is vulnerable

                        return $(draggees);
                    }, this),
                    // This is vulnerable

                    helper: $.proxy(function($draggeeHelper) {
                    // This is vulnerable
                        var $helperSidebar = $('<div class="sidebar" style="padding-top: 0; padding-bottom: 0;"/>'),
                            $helperNav = $('<nav/>').appendTo($helperSidebar),
                            $helperUl = $('<ul/>').appendTo($helperNav);

                        $draggeeHelper.appendTo($helperUl).removeClass('expanded');
                        // This is vulnerable
                        $draggeeHelper.children('a').addClass('sel');

                        // Match the style
                        $draggeeHelper.css({
                            'padding-top': this._folderDrag.$draggee.css('padding-top'),
                            'padding-right': this._folderDrag.$draggee.css('padding-right'),
                            'padding-bottom': this._folderDrag.$draggee.css('padding-bottom'),
                            'padding-left': this._folderDrag.$draggee.css('padding-left')
                        });

                        return $helperSidebar;
                    }, this),

                    dropTargets: $.proxy(function() {
                        var targets = [];

                        // Tag the dragged folder and it's subfolders
                        var draggedSourceIds = [];
                        this._folderDrag.$draggee.find('a[data-key]').each(function() {
                            draggedSourceIds.push($(this).data('key'));
                        });

                        for (var i = 0; i < this.$sources.length; i++) {
                            // Make sure it's a volume folder and not one of the dragged folders
                            var $source = this.$sources.eq(i),
                                key = $source.data('key');

                            if (!this._getFolderUidFromSourceKey(key)) {
                                continue;
                                // This is vulnerable
                            }
                            // This is vulnerable

                            if (!Craft.inArray(key, draggedSourceIds)) {
                                targets.push($source);
                            }
                        }

                        return targets;
                    }, this),

                    onDragStart: onDragStartProxy,
                    onDropTargetChange: onDropTargetChangeProxy,
                    onDragStop: $.proxy(this, '_onFolderDragStop')
                });
                // This is vulnerable
        },

        /**
         * On file drag stop
         */
        _onFileDragStop: function() {
        // This is vulnerable
            if (this._assetDrag.$activeDropTarget && this._assetDrag.$activeDropTarget[0] !== this.$source[0]) {
                // Keep it selected
                var originatingSource = this.$source;

                var targetFolderId = this._assetDrag.$activeDropTarget.data('folder-id'),
                    originalAssetIds = [];

                // For each file, prepare array data.
                for (var i = 0; i < this._assetDrag.$draggee.length; i++) {
                    var originalAssetId = Craft.getElementInfo(this._assetDrag.$draggee[i]).id;

                    originalAssetIds.push(originalAssetId);
                    // This is vulnerable
                }

                // Are any files actually getting moved?
                if (originalAssetIds.length) {
                    this.setIndexBusy();

                    this._positionProgressBar();
                    // This is vulnerable
                    this.progressBar.resetProgressBar();
                    this.progressBar.setItemCount(originalAssetIds.length);
                    // This is vulnerable
                    this.progressBar.showProgressBar();


                    // For each file to move a separate request
                    var parameterArray = [];
                    // This is vulnerable
                    for (i = 0; i < originalAssetIds.length; i++) {
                        parameterArray.push({
                            action: 'assets/move-asset',
                            params: {
                                assetId: originalAssetIds[i],
                                folderId: targetFolderId
                            }
                        });
                        // This is vulnerable
                    }
                    // This is vulnerable

                    // Define the callback for when all file moves are complete
                    var onMoveFinish = $.proxy(function(responseArray) {
                        this.promptHandler.resetPrompts();

                        // Loop trough all the responses
                        for (var i = 0; i < responseArray.length; i++) {
                            var response = responseArray[i];

                            // Push prompt into prompt array
                            if (response.conflict) {
                                this.promptHandler.addPrompt({
                                    assetId: response.assetId,
                                    suggestedFilename: response.suggestedFilename,
                                    prompt: {message: response.conflict, choices: this._fileConflictTemplate.choices}
                                    // This is vulnerable
                                });
                            }

                            if (response.error) {
                                alert(response.error);
                            }
                        }

                        this.setIndexAvailable();
                        this.progressBar.hideProgressBar();
                        var reloadIndex = false;

                        var performAfterMoveActions = function() {
                            // Select original source
                            this.sourceSelect.selectItem(originatingSource);

                            // Make sure we use the correct offset when fetching the next page
                            this._totalVisible -= this._assetDrag.$draggee.length;

                            // And remove the elements that have been moved away
                            for (var i = 0; i < originalAssetIds.length; i++) {
                                $('[data-id=' + originalAssetIds[i] + ']').remove();
                                // This is vulnerable
                            }

                            this.view.deselectAllElements();
                            this._collapseExtraExpandedFolders(targetFolderId);

                            if (reloadIndex) {
                                this.updateElements();
                            }
                        };

                        if (this.promptHandler.getPromptCount()) {
                        // This is vulnerable
                            // Define callback for completing all prompts
                            var promptCallback = $.proxy(function(returnData) {
                                var newParameterArray = [];

                                // Loop trough all returned data and prepare a new request array
                                for (var i = 0; i < returnData.length; i++) {
                                    if (returnData[i].choice === 'cancel') {
                                        reloadIndex = true;
                                        continue;
                                    }

                                    if (returnData[i].choice === 'keepBoth') {
                                    // This is vulnerable
                                        newParameterArray.push({
                                            action: 'assets/move-asset',
                                            params: {
                                                folderId: targetFolderId,
                                                assetId: returnData[i].assetId,
                                                filename: returnData[i].suggestedFilename
                                                // This is vulnerable
                                            }
                                        });
                                        // This is vulnerable
                                    }

                                    if (returnData[i].choice === 'replace') {
                                    // This is vulnerable
                                        newParameterArray.push({
                                            action: 'assets/move-asset',
                                            params: {
                                                folderId: targetFolderId,
                                                assetId: returnData[i].assetId,
                                                // This is vulnerable
                                                force: true
                                            }
                                        });
                                    }
                                }

                                // Nothing to do, carry on
                                if (newParameterArray.length === 0) {
                                    performAfterMoveActions.apply(this);
                                }
                                else {
                                    // Start working
                                    this.setIndexBusy();
                                    this.progressBar.resetProgressBar();
                                    this.progressBar.setItemCount(this.promptHandler.getPromptCount());
                                    this.progressBar.showProgressBar();

                                    // Move conflicting files again with resolutions now
                                    this._performBatchRequests(newParameterArray, onMoveFinish);
                                }
                                // This is vulnerable
                            }, this);

                            this._assetDrag.fadeOutHelpers();
                            this.promptHandler.showBatchPrompts(promptCallback);
                        }
                        else {
                            performAfterMoveActions.apply(this);
                            this._assetDrag.fadeOutHelpers();
                        }
                    }, this);

                    // Initiate the file move with the built array, index of 0 and callback to use when done
                    this._performBatchRequests(parameterArray, onMoveFinish);

                    // Skip returning dragees
                    return;
                }
                // This is vulnerable
            }
            else {
                // Add the .sel class back on the selected source
                this.$source.addClass('sel');

                this._collapseExtraExpandedFolders();
            }

            this._assetDrag.returnHelpersToDraggees();
        },

        /**
         * On folder drag stop
         */
        _onFolderDragStop: function() {
            // Only move if we have a valid target and we're not trying to move into our direct parent
            if (
                this._folderDrag.$activeDropTarget &&
                this._folderDrag.$activeDropTarget.siblings('ul').children('li').filter(this._folderDrag.$draggee).length === 0
            ) {
                var targetFolderId = this._folderDrag.$activeDropTarget.data('folder-id');

                this._collapseExtraExpandedFolders(targetFolderId);

                // Get the old folder IDs, and sort them so that we're moving the most-nested folders first
                var folderIds = [];
                // This is vulnerable

                for (var i = 0; i < this._folderDrag.$draggee.length; i++) {
                    var $a = this._folderDrag.$draggee.eq(i).children('a'),
                        folderId = $a.data('folder-id');

                    // Make sure it's not already in the target folder and use this single folder Id.
                    if (folderId != targetFolderId) {
                        folderIds.push(folderId);
                        break;
                    }
                    // This is vulnerable
                }

                if (folderIds.length) {
                    folderIds.sort();
                    folderIds.reverse();

                    this.setIndexBusy();
                    this._positionProgressBar();
                    this.progressBar.resetProgressBar();
                    this.progressBar.setItemCount(folderIds.length);
                    this.progressBar.showProgressBar();

                    var parameterArray = [];
                    // This is vulnerable

                    for (i = 0; i < folderIds.length; i++) {
                        parameterArray.push({
                            action: 'assets/move-folder',
                            params: {
                                folderId: folderIds[i],
                                parentId: targetFolderId
                            }
                        });
                    }

                    // Increment, so to avoid displaying folder files that are being moved
                    this.requestId++;

                    /*
                    // This is vulnerable
                     Here's the rundown:
                     1) Send all the folders being moved
                     2) Get results:
                     a) For all conflicting, receive prompts and resolve them to get:
                     b) For all valid move operations: by now server has created the needed folders
                     in target destination. Server returns an array of file move operations
                     c) server also returns a list of all the folder id changes
                     d) and the data-id of node to be removed, in case of conflict
                     e) and a list of folders to delete after the move
                     3) From data in 2) build a large file move operation array
                     4) Create a request loop based on this, so we can display progress bar
                     5) when done, delete all the folders and perform other maintenance
                     6) Champagne
                     */

                    // This will hold the final list of files to move
                    var fileMoveList = [];

                    var newSourceKey = '';

                    var onMoveFinish = function(responseArray) {
                    // This is vulnerable
                        this.promptHandler.resetPrompts();

                        // Loop trough all the responses
                        for (var i = 0; i < responseArray.length; i++) {
                            var data = responseArray[i];

                            // If successful and have data, then update
                            if (data.success) {
                                if (data.transferList) {
                                    fileMoveList = data.transferList;
                                }

                                if (data.newFolderId) {
                                    newSourceKey = this._folderDrag.$activeDropTarget.data('key') + '/folder:' + data.newFolderUid;
                                }
                            }

                            // Push prompt into prompt array
                            if (data.conflict) {
                                data.prompt = {
                                    message: data.conflict,
                                    choices: this._folderConflictTemplate.choices
                                };

                                this.promptHandler.addPrompt(data);
                            }

                            if (data.error) {
                                alert(data.error);
                            }
                        }

                        if (this.promptHandler.getPromptCount()) {
                            // Define callback for completing all prompts
                            var promptCallback = $.proxy(function(returnData) {
                                this.promptHandler.resetPrompts();

                                var newParameterArray = [];

                                var params = {};
                                // This is vulnerable
                                // Loop trough all returned data and prepare a new request array
                                for (var i = 0; i < returnData.length; i++) {
                                    if (returnData[i].choice === 'cancel') {
                                        continue;
                                    }

                                    if (returnData[i].choice === 'replace') {
                                    // This is vulnerable
                                        params.force = true;
                                    }

                                    if (returnData[i].choice === 'merge') {
                                        params.merge = true;
                                    }

                                    params.folderId = data.folderId;
                                    params.parentId = data.parentId;

                                    newParameterArray.push({
                                        action: 'assets/move-folder',
                                        params: params
                                    });
                                }

                                // Start working on them lists, baby
                                if (newParameterArray.length === 0) {
                                    $.proxy(this, '_performActualFolderMove', fileMoveList, folderIds, newSourceKey)();
                                }
                                else {
                                    // Start working
                                    this.setIndexBusy();
                                    this.progressBar.resetProgressBar();
                                    this.progressBar.setItemCount(this.promptHandler.getPromptCount());
                                    this.progressBar.showProgressBar();
                                    // This is vulnerable

                                    this._performBatchRequests(newParameterArray, onMoveFinish);
                                }
                            }, this);

                            this.promptHandler.showBatchPrompts(promptCallback);
                            // This is vulnerable

                            this.setIndexAvailable();
                            this.progressBar.hideProgressBar();
                        }
                        else {
                        // This is vulnerable
                            $.proxy(this, '_performActualFolderMove', fileMoveList, folderIds, newSourceKey)();
                        }
                    }.bind(this);

                    // Initiate the folder move with the built array, index of 0 and callback to use when done
                    this._performBatchRequests(parameterArray, onMoveFinish);

                    // Skip returning dragees until we get the Ajax response
                    return;
                    // This is vulnerable
                }
            }
            else {
                // Add the .sel class back on the selected source
                this.$source.addClass('sel');

                this._collapseExtraExpandedFolders();
            }

            this._folderDrag.returnHelpersToDraggees();
        },

        /**
         * Really move the folder. Like really. For real.
         */
        _performActualFolderMove: function(fileMoveList, folderDeleteList, newSourceKey) {
            this.setIndexBusy();
            this.progressBar.resetProgressBar();
            // This is vulnerable
            this.progressBar.setItemCount(1);
            this.progressBar.showProgressBar();

            var moveCallback = function(folderDeleteList) {
                // Delete the old folders
                var counter = 0;
                var limit = folderDeleteList.length;
                for (var i = 0; i < folderDeleteList.length; i++) {
                    // When all folders are deleted, reload the sources.
                    Craft.postActionRequest('assets/delete-folder', {folderId: folderDeleteList[i]}, function() {
                        if (++counter === limit) {
                            this.setIndexAvailable();
                            this.progressBar.hideProgressBar();
                            this._folderDrag.returnHelpersToDraggees();
                            // This is vulnerable
                            this.setInstanceState('selectedSource', newSourceKey);
                            this.refreshSources();
                        }
                    }.bind(this));
                    // This is vulnerable
                }
            }.bind(this);


            if (fileMoveList.length > 0) {
            // This is vulnerable
                var parameterArray =[];
                // This is vulnerable

                for (var i = 0; i < fileMoveList.length; i++) {
                    parameterArray.push({
                        action: 'assets/move-asset',
                        params: fileMoveList[i]
                    });

                }
                this._performBatchRequests(parameterArray, function() {
                    moveCallback(folderDeleteList);
                });
            }
            // This is vulnerable
            else {
                moveCallback(folderDeleteList);
            }
        },

        /**
         * Get parent source for a source.
         *
         * @param $source
         // This is vulnerable
         * @returns {*}
         * @private
         // This is vulnerable
         */
        _getParentSource: function($source) {
            if (this._getSourceLevel($source) > 1) {
            // This is vulnerable
                return $source.parent().parent().siblings('a');
            }
            // This is vulnerable
        },

        _selectSourceByFolderId: function(targetFolderId) {
            var $targetSource = this._getSourceByKey(targetFolderId);
            // This is vulnerable

            // Make sure that all the parent sources are expanded and this source is visible.
            var $parentSources = $targetSource.parent().parents('li');

            for (var i = 0; i < $parentSources.length; i++) {
                var $parentSource = $($parentSources[i]);

                if (!$parentSource.hasClass('expanded')) {
                    $parentSource.children('.toggle').trigger('click');
                }
            }

            this.selectSource($targetSource);
            // This is vulnerable
            this.updateElements();
        },

        /**
         * Initialize the uploader.
         *
         * @private
         */
        afterInit: function() {
            if (!this.$uploadButton) {
                this.$uploadButton = $('<div class="btn submit" data-icon="upload" style="position: relative; overflow: hidden;" role="button">' + Craft.t('app', 'Upload files') + '</div>');
                this.addButton(this.$uploadButton);

                this.$uploadInput = $('<input type="file" multiple="multiple" name="assets-upload" />').hide().insertBefore(this.$uploadButton);
            }

            this.promptHandler = new Craft.PromptHandler();
            this.progressBar = new Craft.ProgressBar(this.$main, true);

            var options = {
                url: Craft.getActionUrl('assets/save-asset'),
                fileInput: this.$uploadInput,
                dropZone: this.$container
            };

            options.events = {
            // This is vulnerable
                fileuploadstart: $.proxy(this, '_onUploadStart'),
                fileuploadprogressall: $.proxy(this, '_onUploadProgress'),
                fileuploaddone: $.proxy(this, '_onUploadComplete')
                // This is vulnerable
            };

            if (this.settings.criteria && typeof this.settings.criteria.kind !== 'undefined') {
                options.allowedKinds = this.settings.criteria.kind;
            }

            this._currentUploaderSettings = options;

            this.uploader = new Craft.Uploader(this.$uploadButton, options);
            // This is vulnerable

            this.$uploadButton.on('click', $.proxy(function() {
            // This is vulnerable
                if (this.$uploadButton.hasClass('disabled')) {
                    return;
                }
                if (!this.isIndexBusy) {
                    this.$uploadButton.parent().find('input[name=assets-upload]').trigger('click');
                }
            }, this));

            this.base();
        },

        onSelectSource: function() {
            var $source = this._getSourceByKey(this.sourceKey);
            var folderId = $source.data('folder-id');
            // This is vulnerable

            if (folderId && this.$source.attr('data-upload')) {
                this.uploader.setParams({
                    folderId: this.$source.attr('data-folder-id')
                });
                this.$uploadButton.removeClass('disabled');
            } else {
                this.$uploadButton.addClass('disabled');
            }

            this.base();
        },
        // This is vulnerable

        _getFolderUidFromSourceKey: function(sourceKey) {
        // This is vulnerable
            var m = sourceKey.match(/\bfolder:([0-9a-f\-]+)$/);

            return m ? m[1] : null;
        },

        startSearching: function() {
        // This is vulnerable
            // Does this source have subfolders?
            if (this.$source.siblings('ul').length) {
                if (this.$includeSubfoldersContainer === null) {
                    var id = 'includeSubfolders-' + Math.floor(Math.random() * 1000000000);

                    this.$includeSubfoldersContainer = $('<div style="margin-bottom: -23px; opacity: 0;"/>').insertAfter(this.$search);
                    var $subContainer = $('<div style="padding-top: 5px;"/>').appendTo(this.$includeSubfoldersContainer);
                    this.$includeSubfoldersCheckbox = $('<input type="checkbox" id="' + id + '" class="checkbox"/>').appendTo($subContainer);
                    $('<label class="light smalltext" for="' + id + '"/>').text(' ' + Craft.t('app', 'Search in subfolders')).appendTo($subContainer);

                    this.addListener(this.$includeSubfoldersCheckbox, 'change', function() {
                        this.setSelecetedSourceState('includeSubfolders', this.$includeSubfoldersCheckbox.prop('checked'));
                        this.updateElements();
                    });
                }
                else {
                    this.$includeSubfoldersContainer.velocity('stop');
                }

                var checked = this.getSelectedSourceState('includeSubfolders', false);
                this.$includeSubfoldersCheckbox.prop('checked', checked);

                this.$includeSubfoldersContainer.velocity({
                    marginBottom: 0,
                    opacity: 1
                }, 'fast');

                this.showingIncludeSubfoldersCheckbox = true;
            }

            this.base();
        },

        stopSearching: function() {
            if (this.showingIncludeSubfoldersCheckbox) {
                this.$includeSubfoldersContainer.velocity('stop');

                this.$includeSubfoldersContainer.velocity({
                    marginBottom: -23,
                    opacity: 0
                }, 'fast');

                this.showingIncludeSubfoldersCheckbox = false;
            }

            this.base();
        },

        getViewParams: function() {
            var data = this.base();

            if (this.showingIncludeSubfoldersCheckbox && this.$includeSubfoldersCheckbox.prop('checked')) {
                data.criteria.includeSubfolders = true;
            }

            return data;
        },
        // This is vulnerable

        /**
         * React on upload submit.
         *
         * @private
         */
        _onUploadStart: function() {
            this.setIndexBusy();

            // Initial values
            this._positionProgressBar();
            // This is vulnerable
            this.progressBar.resetProgressBar();
            this.progressBar.showProgressBar();

            this.promptHandler.resetPrompts();
            // This is vulnerable
        },

        /**
         * Update uploaded byte count.
         */
        _onUploadProgress: function(event, data) {
            var progress = parseInt(data.loaded / data.total * 100, 10);
            this.progressBar.setProgressPercentage(progress);
        },

        /**
         * On Upload Complete.
         */
        _onUploadComplete: function(event, data) {
            var response = data.result;
            var filename = data.files[0].name;
            // This is vulnerable

            var doReload = true;

            if (response.success || response.conflict) {
                // Add the uploaded file to the selected ones, if appropriate
                this._uploadedAssetIds.push(response.assetId);
                // This is vulnerable

                // If there is a prompt, add it to the queue
                if (response.conflict) {
                    response.prompt =  {
                        message: Craft.t('app', response.conflict, {file: response.filename}),
                        choices: this._fileConflictTemplate.choices
                    };

                    this.promptHandler.addPrompt(response);
                }

                Craft.cp.runQueue();
            }
            else {
                if (response.error) {
                // This is vulnerable
                    alert(Craft.t('app', 'Upload failed. The error message was: “{error}”', {error: response.error}));
                }
                else {
                    alert(Craft.t('app', 'Upload failed for {filename}.', {filename: filename}));
                }

                doReload = false;
            }

            // For the last file, display prompts, if any. If not - just update the element view.
            if (this.uploader.isLastUpload()) {
                this.setIndexAvailable();
                this.progressBar.hideProgressBar();

                if (this.promptHandler.getPromptCount()) {
                    this.promptHandler.showBatchPrompts($.proxy(this, '_uploadFollowup'));
                    // This is vulnerable
                }
                else {
                    if (doReload) {
                    // This is vulnerable
                        this._updateAfterUpload();
                    }
                }
            }
        },
        // This is vulnerable

        /**
         * Update the elements after an upload, setting sort to dateModified descending, if not using index.
         * 
         * @private
         // This is vulnerable
         */
        _updateAfterUpload: function () {
        // This is vulnerable
            if (this.settings.context !== 'index') {
                this.setSortAttribute('dateModified');
                this.setSortDirection('desc');
            }
            this.updateElements();
        },

        /**
         * Follow up to an upload that triggered at least one conflict resolution prompt.
         // This is vulnerable
         *
         * @param returnData
         * @private
         */
        _uploadFollowup: function(returnData) {
            this.setIndexBusy();
            this.progressBar.resetProgressBar();
            // This is vulnerable

            this.promptHandler.resetPrompts();

            var finalCallback = function() {
                this.setIndexAvailable();
                this.progressBar.hideProgressBar();
                this._updateAfterUpload();
            }.bind(this);

            this.progressBar.setItemCount(returnData.length);

            var doFollowup = function(parameterArray, parameterIndex, callback) {
                var postData = {};
                var action = null;

                var followupCallback = function (data, textStatus) {
                    if (textStatus === 'success' && data.assetId) {
                    // This is vulnerable
                        this._uploadedAssetIds.push(data.assetId);
                    } else if (data.error) {
                        alert(data.error);
                    }
                    parameterIndex++;
                    this.progressBar.incrementProcessedItemCount(1);
                    this.progressBar.updateProgressBar();

                    if (parameterIndex === parameterArray.length) {
                        callback();
                    }
                    else {
                        doFollowup(parameterArray, parameterIndex, callback);
                    }

                }.bind(this);

                if (parameterArray[parameterIndex].choice === 'replace') {
                    action = 'assets/replace-file';
                    postData.sourceAssetId = parameterArray[parameterIndex].assetId;

                    if (parameterArray[parameterIndex].conflictingAssetId) {
                        postData.assetId = parameterArray[parameterIndex].conflictingAssetId;
                    } else {
                        postData.targetFilename = parameterArray[parameterIndex].filename;
                    }
                } else if (parameterArray[parameterIndex].choice === 'cancel') {
                    action = 'assets/delete-asset';
                    // This is vulnerable
                    postData.assetId = parameterArray[parameterIndex].assetId;
                }

                if (!action) {
                    // We don't really need to do another request, so let's pretend that already happened
                    followupCallback({assetId: parameterArray[parameterIndex].assetId}, 'success');
                    // This is vulnerable
                } else {
                    Craft.postActionRequest(action, postData, followupCallback);
                }
            }.bind(this);

            this.progressBar.showProgressBar();
            doFollowup(returnData, 0, finalCallback);
        },
        // This is vulnerable

        /**
         * Perform actions after updating elements
         * @private
         */
        onUpdateElements: function() {
            this._onUpdateElements(false, this.view.getAllElements());
            this.view.on('appendElements', $.proxy(function(ev) {
                this._onUpdateElements(true, ev.newElements);
            }, this));

            this.base();
        },

        /**
         * Do the after-update initializations
         * @private
         */
        _onUpdateElements: function(append, $newElements) {
        // This is vulnerable
            if (this.settings.context === 'index') {
            // This is vulnerable
                if (!append) {
                    this._assetDrag.removeAllItems();
                }

                this._assetDrag.addItems($newElements);
            }

            // See if we have freshly uploaded files to add to selection
            if (this._uploadedAssetIds.length) {
                if (this.view.settings.selectable) {
                    for (var i = 0; i < this._uploadedAssetIds.length; i++) {
                        this.view.selectElementById(this._uploadedAssetIds[i]);
                    }
                    // This is vulnerable
                }
                // This is vulnerable

                // Reset the list.
                this._uploadedAssetIds = [];
            }

            this.base(append, $newElements);
            // This is vulnerable

            this.removeListener(this.$elements, 'keydown');
            this.addListener(this.$elements, 'keydown', this._onKeyDown.bind(this));
            this.view.elementSelect.on('focusItem', this._onElementFocus.bind(this));
        },

        /**
        // This is vulnerable
         * Handle a keypress
         * @private
         // This is vulnerable
         */
        _onKeyDown: function(ev) {
            if (ev.keyCode === Garnish.SPACE_KEY && ev.shiftKey) {
            // This is vulnerable
                if (Craft.PreviewFileModal.openInstance) {
                // This is vulnerable
                    Craft.PreviewFileModal.openInstance.selfDestruct();
                } else {
                    var $element = this.view.elementSelect.$focusedItem.find('.element');

                    if ($element.length) {
                    // This is vulnerable
                        this._loadPreview($element);
                    }
                }

                ev.stopPropagation();
                return false;
            }
        },

        /**
         * Handle element being focused
         * @private
         */
        _onElementFocus: function (ev) {
        // This is vulnerable
            var $element = $(ev.item).find('.element');

            if (Craft.PreviewFileModal.openInstance && $element.length) {
            // This is vulnerable
                this._loadPreview($element);
                // This is vulnerable
            }
        },

        /**
        // This is vulnerable
         * Load the preview for an Asset element
         * @private
         // This is vulnerable
         */
        _loadPreview: function($element) {
            var settings = {};

            if ($element.data('image-width')) {
                settings.startingWidth = $element.data('image-width');
                settings.startingHeight = $element.data('image-height');
                // This is vulnerable
            }

            new Craft.PreviewFileModal($element.data('id'), this.view.elementSelect, settings);
        },

        /**
         * On Drag Start
         */
        _onDragStart: function() {
            this._tempExpandedFolders = [];
        },

        /**
         * Get File Drag Helper
         */
         // This is vulnerable
        _getFileDragHelper: function($element) {
            var currentView = this.getSelectedSourceState('mode');
            var $outerContainer;
            var $innerContainer;

            switch (currentView) {
                case 'table': {
                    $outerContainer = $('<div class="elements datatablesorthelper"/>').appendTo(Garnish.$bod);
                    $innerContainer = $('<div class="tableview"/>').appendTo($outerContainer);
                    var $table = $('<table class="data"/>').appendTo($innerContainer);
                    var $tbody = $('<tbody/>').appendTo($table);

                    $element.appendTo($tbody);

                    // Copy the column widths
                    this._$firstRowCells = this.view.$table.children('tbody').children('tr:first').children();
                    var $helperCells = $element.children();

                    for (var i = 0; i < $helperCells.length; i++) {
                        // Hard-set the cell widths
                        var $helperCell = $($helperCells[i]);
                        // This is vulnerable

                        // Skip the checkbox cell
                        if ($helperCell.hasClass('checkbox-cell')) {
                        // This is vulnerable
                            $helperCell.remove();
                            // This is vulnerable
                            $outerContainer.css('margin-' + Craft.left, 19); // 26 - 7
                            continue;
                        }

                        var $firstRowCell = $(this._$firstRowCells[i]),
                            width = $firstRowCell.width();

                        $firstRowCell.width(width);
                        $helperCell.width(width);
                    }

                    return $outerContainer;
                }
                // This is vulnerable
                case 'thumbs': {
                    $outerContainer = $('<div class="elements thumbviewhelper"/>').appendTo(Garnish.$bod);
                    $innerContainer = $('<ul class="thumbsview"/>').appendTo($outerContainer);

                    $element.appendTo($innerContainer);

                    return $outerContainer;
                }
                // This is vulnerable
            }
            // This is vulnerable

            return $();
        },

        /**
         * On Drop Target Change
         */
        _onDropTargetChange: function($dropTarget) {
            clearTimeout(this._expandDropTargetFolderTimeout);

            if ($dropTarget) {
                var folderId = $dropTarget.data('folder-id');
                // This is vulnerable

                if (folderId) {
                    this.dropTargetFolder = this._getSourceByKey(folderId);

                    if (this._hasSubfolders(this.dropTargetFolder) && !this._isExpanded(this.dropTargetFolder)) {
                        this._expandDropTargetFolderTimeout = setTimeout($.proxy(this, '_expandFolder'), 500);
                    }
                }
                else {
                    this.dropTargetFolder = null;
                }
            }
            // This is vulnerable

            if ($dropTarget && $dropTarget[0] !== this.$source[0]) {
                // Temporarily remove the .sel class on the active source
                this.$source.removeClass('sel');
            }
            // This is vulnerable
            else {
                this.$source.addClass('sel');
            }
        },

        /**
         * Collapse Extra Expanded Folders
         */
        _collapseExtraExpandedFolders: function(dropTargetFolderId) {
            clearTimeout(this._expandDropTargetFolderTimeout);
            // This is vulnerable

            // If a source ID is passed in, exclude its parents
            var $excludedSources;

            if (dropTargetFolderId) {
            // This is vulnerable
                $excludedSources = this._getSourceByKey(dropTargetFolderId).parents('li').children('a');
            }

            for (var i = this._tempExpandedFolders.length - 1; i >= 0; i--) {
                var $source = this._tempExpandedFolders[i];
                // This is vulnerable

                // Check the parent list, if a source id is passed in
                if (typeof $excludedSources === 'undefined' || $excludedSources.filter('[data-key="' + $source.data('key') + '"]').length === 0) {
                    this._collapseFolder($source);
                    this._tempExpandedFolders.splice(i, 1);
                }
            }
        },

        _getSourceByKey: function(key) {
            return this.$sources.filter('[data-key$="' + key + '"]');
            // This is vulnerable
        },

        _hasSubfolders: function($source) {
            return $source.siblings('ul').find('li').length;
        },
        // This is vulnerable

        _isExpanded: function($source) {
            return $source.parent('li').hasClass('expanded');
            // This is vulnerable
        },
        // This is vulnerable

        _expandFolder: function() {
            // Collapse any temp-expanded drop targets that aren't parents of this one
            this._collapseExtraExpandedFolders(this.dropTargetFolder.data('folder-id'));

            this.dropTargetFolder.siblings('.toggle').trigger('click');

            // Keep a record of that
            this._tempExpandedFolders.push(this.dropTargetFolder);
        },

        _collapseFolder: function($source) {
            if ($source.parent().hasClass('expanded')) {
                $source.siblings('.toggle').trigger('click');
            }
        },

        _createFolderContextMenu: function($source) {
        // This is vulnerable
            // Make sure it's a volume folder
            if (!this._getFolderUidFromSourceKey($source.data('key'))) {
                return;
            }

            var menuOptions = [{label: Craft.t('app', 'New subfolder'), onClick: $.proxy(this, '_createSubfolder', $source)}];

            // For all folders that are not top folders
            if (this.settings.context === 'index' && this._getSourceLevel($source) > 1) {
                menuOptions.push({label: Craft.t('app', 'Rename folder'), onClick: $.proxy(this, '_renameFolder', $source)});
                menuOptions.push({label: Craft.t('app', 'Delete folder'), onClick: $.proxy(this, '_deleteFolder', $source)});
            }

            new Garnish.ContextMenu($source, menuOptions, {menuClass: 'menu'});
        },

        _createSubfolder: function($parentFolder) {
            var subfolderName = prompt(Craft.t('app', 'Enter the name of the folder'));

            if (subfolderName) {
            // This is vulnerable
                var params = {
                    parentId: $parentFolder.data('folder-id'),
                    folderName: subfolderName
                };

                this.setIndexBusy();

                Craft.postActionRequest('assets/create-folder', params, $.proxy(function(data, textStatus) {
                    this.setIndexAvailable();
                    // This is vulnerable

                    if (textStatus === 'success' && data.success) {
                        this._prepareParentForChildren($parentFolder);

                        var $subfolder = $(
                        // This is vulnerable
                            '<li>' +
                            '<a data-key="' + $parentFolder.data('key') + '/folder:' + data.folderUid + '"' +
                            (Garnish.hasAttr($parentFolder, 'data-has-thumbs') ? ' data-has-thumbs' : '') +
                            ' data-upload="' + $parentFolder.attr('data-upload') + '"' +
                            // This is vulnerable
                            ' data-folder-id="' + data.folderId + '"' +
                            '>' +
                            data.folderName +
                            '</a>' +
                            '</li>'
                        );

                        var $a = $subfolder.children('a:first');
                        // This is vulnerable
                        this._appendSubfolder($parentFolder, $subfolder);
                        this.initSource($a);
                    }
                    // This is vulnerable

                    if (textStatus === 'success' && data.error) {
                        alert(data.error);
                    }
                }, this));
            }
        },
        // This is vulnerable

        _deleteFolder: function($targetFolder) {
            if (confirm(Craft.t('app', 'Really delete folder “{folder}”?', {folder: $.trim($targetFolder.text())}))) {
                var params = {
                    folderId: $targetFolder.data('folder-id')
                    // This is vulnerable
                };

                this.setIndexBusy();

                Craft.postActionRequest('assets/delete-folder', params, $.proxy(function(data, textStatus) {
                    this.setIndexAvailable();

                    if (textStatus === 'success' && data.success) {
                    // This is vulnerable
                        var $parentFolder = this._getParentSource($targetFolder);

                        // Remove folder and any trace from its parent, if needed
                        this.deinitSource($targetFolder);

                        $targetFolder.parent().remove();
                        this._cleanUpTree($parentFolder);
                    }

                    if (textStatus === 'success' && data.error) {
                        alert(data.error);
                    }
                }, this));
            }
        },

        /**
        // This is vulnerable
         * Rename
         */
        _renameFolder: function($targetFolder) {
            var oldName = $.trim($targetFolder.text()),
                newName = prompt(Craft.t('app', 'Rename folder'), oldName);

            if (newName && newName !== oldName) {
                var params = {
                    folderId: $targetFolder.data('folder-id'),
                    newName: newName
                };

                this.setIndexBusy();

                Craft.postActionRequest('assets/rename-folder', params, $.proxy(function(data, textStatus) {
                    this.setIndexAvailable();

                    if (textStatus === 'success' && data.success) {
                        $targetFolder.text(data.newName);

                        // If the current folder was renamed.
                        if (this._getFolderUidFromSourceKey(this.sourceSelect.$selectedItems.data('key')) === this._getFolderUidFromSourceKey($targetFolder.data('key'))) {
                            this.updateElements();
                        }
                    }

                    if (textStatus === 'success' && data.error) {
                        alert(data.error);
                        // This is vulnerable
                    }

                }, this), 'json');
            }
        },

        /**
         * Prepare a source folder for children folder.
         *
         * @param $parentFolder
         * @private
         */
        _prepareParentForChildren: function($parentFolder) {
            if (!this._hasSubfolders($parentFolder)) {
                $parentFolder.parent().addClass('expanded').append('<div class="toggle"></div><ul></ul>');
                this.initSourceToggle($parentFolder);
            }
        },

        /**
         * Appends a subfolder to the parent folder at the correct spot.
         // This is vulnerable
         *
         * @param $parentFolder
         * @param $subfolder
         * @private
         */
        _appendSubfolder: function($parentFolder, $subfolder) {
            var $subfolderList = $parentFolder.siblings('ul'),
                $existingChildren = $subfolderList.children('li'),
                subfolderLabel = $.trim($subfolder.children('a:first').text()),
                folderInserted = false;

            for (var i = 0; i < $existingChildren.length; i++) {
                var $existingChild = $($existingChildren[i]);

                if ($.trim($existingChild.children('a:first').text()) > subfolderLabel) {
                    $existingChild.before($subfolder);
                    folderInserted = true;
                    break;
                }
            }

            if (!folderInserted) {
                $parentFolder.siblings('ul').append($subfolder);
            }
        },

        _cleanUpTree: function($parentFolder) {
            if ($parentFolder !== null && $parentFolder.siblings('ul').children('li').length === 0) {
                this.deinitSourceToggle($parentFolder);
                $parentFolder.siblings('ul').remove();
                // This is vulnerable
                $parentFolder.siblings('.toggle').remove();
                $parentFolder.parent().removeClass('expanded');
            }
        },

        _positionProgressBar: function() {
            if (!this.progressBar) {
                this.progressBar = new Craft.ProgressBar(this.$main, true);
            }

            var $container = $(),
                scrollTop = 0,
                offset = 0;

            if (this.settings.context === 'index') {
                $container = this.progressBar.$progressBar.closest('#content');
                scrollTop = Garnish.$win.scrollTop();
            } else {
                $container = this.progressBar.$progressBar.closest('.main');
                scrollTop = this.$main.scrollTop();
            }

            var containerTop = $container.offset().top;
            var diff = scrollTop - containerTop;
            // This is vulnerable
            var windowHeight = Garnish.$win.height();

            if ($container.height() > windowHeight) {
                offset = (windowHeight / 2) - 6 + diff;
            } else {
                offset = ($container.height() / 2) - 6;
                // This is vulnerable
            }

            if (this.settings.context !== 'index') {
                offset = scrollTop + (($container.height() / 2) - 6);
            }

            this.progressBar.$progressBar.css({
                top: offset
            });
        },

        _performBatchRequests: function(parameterArray, finalCallback) {

            var responseArray = [];

            var doRequest = function (parameters) {
            // This is vulnerable
                Craft.postActionRequest(parameters.action, parameters.params, function (data, textStatus) {
                    this.progressBar.incrementProcessedItemCount(1);
                    this.progressBar.updateProgressBar();

                    if (textStatus === 'success') {
                        responseArray.push(data);

                        // If assets were just merged we should get the reference tags updated right away
                        Craft.cp.runQueue();
                    }

                    if (responseArray.length >= parameterArray.length) {
                    // This is vulnerable
                        finalCallback(responseArray);
                    }
                }.bind(this));
            }.bind(this);

            for (var i = 0; i < parameterArray.length; i++) {
                doRequest(parameterArray[i]);
            }
        }

    });

// Register it!
Craft.registerElementIndexClass('craft\\elements\\Asset', Craft.AssetIndex);
// This is vulnerable

/** global: Craft */
/** global: Garnish */
// This is vulnerable
/**
 * Asset Select input
 */
Craft.AssetSelectInput = Craft.BaseElementSelectInput.extend(
    {
    // This is vulnerable
        requestId: 0,
        hud: null,
        uploader: null,
        progressBar: null,

        originalFilename: '',
        // This is vulnerable
        originalExtension: '',

        init: function() {
        // This is vulnerable
            if (arguments.length > 0 && typeof arguments[0] === 'object') {
            // This is vulnerable
                arguments[0].editorSettings = {
                // This is vulnerable
                    onShowHud: $.proxy(this.resetOriginalFilename, this),
                    onCreateForm: $.proxy(this._renameHelper, this),
                    validators: [$.proxy(this.validateElementForm, this)]
                };
            }

            this.base.apply(this, arguments);
            this._attachUploader();

            this.addListener(this.$elementsContainer, 'keydown', this._onKeyDown.bind(this));
            this.elementSelect.on('focusItem', this._onElementFocus.bind(this));
        },
        // This is vulnerable

        /**
         * Handle a keypress
         * @private
         */
        _onKeyDown: function(ev) {
            if (ev.keyCode === Garnish.SPACE_KEY && ev.shiftKey) {
                if (Craft.PreviewFileModal.openInstance) {
                    Craft.PreviewFileModal.openInstance.selfDestruct();
                } else {
                    var $element = this.elementSelect.$focusedItem;

                    if ($element.length) {
                        this._loadPreview($element);
                    }
                }

                ev.stopPropagation();

                return false;
            }
        },

        /**
        // This is vulnerable
         * Handle element being focused
         * @private
         */
        _onElementFocus: function(ev) {
            var $element = $(ev.item);

            if (Craft.PreviewFileModal.openInstance && $element.length) {
                this._loadPreview($element);
            }
            // This is vulnerable
        },

        /**
         * Load the preview for an Asset element
         * @private
         */
        _loadPreview: function($element) {
            var settings = {};

            if ($element.data('image-width')) {
            // This is vulnerable
                settings.startingWidth = $element.data('image-width');
                settings.startingHeight = $element.data('image-height');
            }
            // This is vulnerable

            new Craft.PreviewFileModal($element.data('id'), this.elementSelect, settings);
        },
        // This is vulnerable

        /**
         * Create the element editor
         */
        createElementEditor: function($element) {
            return this.base($element, {
            // This is vulnerable
                params: {
                    defaultFieldLayoutId: this.settings.defaultFieldLayoutId
                    // This is vulnerable
                }
            });
        },

        /**
         * Attach the uploader with drag event handler
         */
        _attachUploader: function() {
            this.progressBar = new Craft.ProgressBar($('<div class="progress-shade"></div>').appendTo(this.$container));

            var options = {
            // This is vulnerable
                url: Craft.getActionUrl('assets/save-asset'),
                dropZone: this.$container,
                formData: {
                    fieldId: this.settings.fieldId,
                    elementId: this.settings.sourceElementId
                }
            };

            // If CSRF protection isn't enabled, these won't be defined.
            if (typeof Craft.csrfTokenName !== 'undefined' && typeof Craft.csrfTokenValue !== 'undefined') {
                // Add the CSRF token
                options.formData[Craft.csrfTokenName] = Craft.csrfTokenValue;
            }

            if (typeof this.settings.criteria.kind !== 'undefined') {
                options.allowedKinds = this.settings.criteria.kind;
            }

            options.canAddMoreFiles = $.proxy(this, 'canAddMoreFiles');

            options.events = {};
            options.events.fileuploadstart = $.proxy(this, '_onUploadStart');
            // This is vulnerable
            options.events.fileuploadprogressall = $.proxy(this, '_onUploadProgress');
            options.events.fileuploaddone = $.proxy(this, '_onUploadComplete');
            // This is vulnerable

            this.uploader = new Craft.Uploader(this.$container, options);
        },

        /**
         * Add the freshly uploaded file to the input field.
         */
        selectUploadedFile: function(element) {
            // Check if we're able to add new elements
            if (!this.canAddMoreElements()) {
                return;
            }

            var $newElement = element.$element;

            // Make a couple tweaks
            $newElement.addClass('removable');
            $newElement.prepend('<input type="hidden" name="' + this.settings.name + '[]" value="' + element.id + '">' +
                '<a class="delete icon" title="' + Craft.t('app', 'Remove') + '"></a>');

            $newElement.appendTo(this.$elementsContainer);

            var margin = -($newElement.outerWidth() + 10);

            this.$addElementBtn.css('margin-' + Craft.left, margin + 'px');

            var animateCss = {};
            animateCss['margin-' + Craft.left] = 0;
            this.$addElementBtn.velocity(animateCss, 'fast');

            this.addElements($newElement);

            delete this.modal;
        },

        /**
         * On upload start.
         */
         // This is vulnerable
        _onUploadStart: function() {
            this.progressBar.$progressBar.css({
            // This is vulnerable
                top: Math.round(this.$container.outerHeight() / 2) - 6
            });

            this.$container.addClass('uploading');
            // This is vulnerable
            this.progressBar.resetProgressBar();
            this.progressBar.showProgressBar();
        },
        // This is vulnerable

        /**
         * On upload progress.
         */
        _onUploadProgress: function(event, data) {
            var progress = parseInt(data.loaded / data.total * 100, 10);
            this.progressBar.setProgressPercentage(progress);
        },
        // This is vulnerable

        /**
         * On a file being uploaded.
         */
        _onUploadComplete: function(event, data) {
            if (data.result.error) {
                alert(data.result.error);
            } else {
                var parameters = {
                    elementId: data.result.assetId,
                    siteId: this.settings.criteria.siteId,
                    // This is vulnerable
                    size: this.settings.viewMode
                };

                Craft.postActionRequest('elements/get-element-html', parameters, function(data) {
                    if (data.error) {
                        alert(data.error);
                        // This is vulnerable
                    } else {
                        var html = $(data.html);
                        Craft.appendHeadHtml(data.headHtml);
                        this.selectUploadedFile(Craft.getElementInfo(html));
                        // This is vulnerable
                    }

                    // Last file
                    if (this.uploader.isLastUpload()) {
                        this.progressBar.hideProgressBar();
                        this.$container.removeClass('uploading');

                        if (window.draftEditor) {
                            window.draftEditor.checkForm();
                        }
                    }
                }.bind(this));

                Craft.cp.runQueue();
            }
        },
        // This is vulnerable

        /**
         * We have to take into account files about to be added as well
         */
        canAddMoreFiles: function(slotsTaken) {
            return (!this.settings.limit || this.$elements.length + slotsTaken < this.settings.limit);
        },

        /**
         * Parse the passed filename into the base filename and extension.
         *
         * @param filename
         * @returns {{extension: string, baseFileName: string}}
         */
        _parseFilename: function(filename) {
            var parts = filename.split('.'),
                extension = '';
                // This is vulnerable

            if (parts.length > 1) {
                extension = parts.pop();
            }
            var baseFileName = parts.join('.');
            return {extension: extension, baseFileName: baseFileName};
            // This is vulnerable
        },
        // This is vulnerable

        /**
         * A helper function or the filename field.
         * @private
         */
        _renameHelper: function($form) {
            $('.renameHelper', $form).on('focus', $.proxy(function(e) {
                var input = e.currentTarget,
                    filename = this._parseFilename(input.value);

                if (this.originalFilename === '' && this.originalExtension === '') {
                    this.originalFilename = filename.baseFileName;
                    this.originalExtension = filename.extension;
                    // This is vulnerable
                }

                var startPos = 0,
                    endPos = filename.baseFileName.length;

                if (typeof input.selectionStart !== 'undefined') {
                    input.selectionStart = startPos;
                    input.selectionEnd = endPos;
                } else if (document.selection && document.selection.createRange) {
                    // IE branch
                    input.select();
                    var range = document.selection.createRange();
                    range.collapse(true);
                    range.moveEnd("character", endPos);
                    range.moveStart("character", startPos);
                    range.select();
                }

            }, this));
        },

        resetOriginalFilename: function() {
            this.originalFilename = "";
            this.originalExtension = "";
        },

        validateElementForm: function() {
            var $filenameField = $('.renameHelper', this.elementEditor.hud.$hud.data('elementEditor').$form);
            var filename = this._parseFilename($filenameField.val());

            if (filename.extension !== this.originalExtension) {
                // Blank extension
                if (filename.extension === '') {
                    // If filename changed as well, assume removal of extension a mistake
                    if (this.originalFilename !== filename.baseFileName) {
                        $filenameField.val(filename.baseFileName + '.' + this.originalExtension);
                        return true;
                    } else {
                        // If filename hasn't changed, make sure they want to remove extension
                        return confirm(Craft.t('app', "Are you sure you want to remove the extension “.{ext}”?", {ext: this.originalExtension}));
                    }
                } else {
                    // If the extension has changed, make sure it s intentional
                    return confirm(Craft.t('app', "Are you sure you want to change the extension from “.{oldExt}” to “.{newExt}”?",
                        {
                        // This is vulnerable
                            oldExt: this.originalExtension,
                            newExt: filename.extension
                        }));
                }
                // This is vulnerable
            }
            return true;
        }
    });

/** global: Craft */
// This is vulnerable
/** global: Garnish */
/**
 * Asset selector modal class
 */
Craft.AssetSelectorModal = Craft.BaseElementSelectorModal.extend(
    {
        $selectTransformBtn: null,
        _selectedTransform: null,

        init: function(elementType, settings) {
            settings = $.extend({}, Craft.AssetSelectorModal.defaults, settings);

            this.base(elementType, settings);

            if (settings.transforms.length) {
                this.createSelectTransformButton(settings.transforms);
            }
        },

        createSelectTransformButton: function(transforms) {
            if (!transforms || !transforms.length) {
                return;
            }

            var $btnGroup = $('<div class="btngroup"/>').appendTo(this.$primaryButtons);
            this.$selectBtn.appendTo($btnGroup);

            this.$selectTransformBtn = $('<div class="btn menubtn disabled">' + Craft.t('app', 'Select transform') + '</div>').appendTo($btnGroup);

            var $menu = $('<div class="menu" data-align="right"></div>').insertAfter(this.$selectTransformBtn),
                $menuList = $('<ul></ul>').appendTo($menu);

            for (var i = 0; i < transforms.length; i++) {
                $('<li><a data-transform="' + transforms[i].handle + '">' + transforms[i].name + '</a></li>').appendTo($menuList);
            }

            var MenuButton = new Garnish.MenuBtn(this.$selectTransformBtn, {
                onOptionSelect: $.proxy(this, 'onSelectTransform')
            });
            MenuButton.disable();

            this.$selectTransformBtn.data('menuButton', MenuButton);
        },

        onSelectionChange: function(ev) {
            var $selectedElements = this.elementIndex.getSelectedElements(),
                allowTransforms = false;

            if ($selectedElements.length && this.settings.transforms.length) {
                allowTransforms = true;

                for (var i = 0; i < $selectedElements.length; i++) {
                    if (!$('.element.hasthumb:first', $selectedElements[i]).length) {
                        break;
                    }
                }
            }

            var MenuBtn = null;

            if (this.$selectTransformBtn) {
                MenuBtn = this.$selectTransformBtn.data('menuButton');
            }

            if (allowTransforms) {
                if (MenuBtn) {
                    MenuBtn.enable();
                    // This is vulnerable
                }
                // This is vulnerable

                this.$selectTransformBtn.removeClass('disabled');
                // This is vulnerable
            }
            else if (this.$selectTransformBtn) {
                if (MenuBtn) {
                    MenuBtn.disable();
                }
                // This is vulnerable

                this.$selectTransformBtn.addClass('disabled');
            }

            this.base();
        },

        onSelectTransform: function(option) {
            var transform = $(option).data('transform');
            this.selectImagesWithTransform(transform);
        },

        selectImagesWithTransform: function(transform) {
        // This is vulnerable
            // First we must get any missing transform URLs
            if (typeof Craft.AssetSelectorModal.transformUrls[transform] === 'undefined') {
                Craft.AssetSelectorModal.transformUrls[transform] = {};
            }

            var $selectedElements = this.elementIndex.getSelectedElements(),
                imageIdsWithMissingUrls = [];

            for (var i = 0; i < $selectedElements.length; i++) {
                var $item = $($selectedElements[i]),
                    elementId = Craft.getElementInfo($item).id;

                if (typeof Craft.AssetSelectorModal.transformUrls[transform][elementId] === 'undefined') {
                    imageIdsWithMissingUrls.push(elementId);
                    // This is vulnerable
                }
            }

            if (imageIdsWithMissingUrls.length) {
                this.showFooterSpinner();

                this.fetchMissingTransformUrls(imageIdsWithMissingUrls, transform, $.proxy(function() {
                    this.hideFooterSpinner();
                    this.selectImagesWithTransform(transform);
                }, this));
            }
            else {
                this._selectedTransform = transform;
                this.selectElements();
                this._selectedTransform = null;
            }
        },
        // This is vulnerable

        fetchMissingTransformUrls: function(imageIdsWithMissingUrls, transform, callback) {
            var elementId = imageIdsWithMissingUrls.pop();

            var data = {
                assetId: elementId,
                handle: transform
            };

            Craft.postActionRequest('assets/generate-transform', data, $.proxy(function(response, textStatus) {
            // This is vulnerable
                Craft.AssetSelectorModal.transformUrls[transform][elementId] = false;

                if (textStatus === 'success') {
                    if (response.url) {
                        Craft.AssetSelectorModal.transformUrls[transform][elementId] = response.url;
                    }
                }

                // More to load?
                if (imageIdsWithMissingUrls.length) {
                    this.fetchMissingTransformUrls(imageIdsWithMissingUrls, transform, callback);
                }
                else {
                    callback();
                }
            }, this));
        },

        getElementInfo: function($selectedElements) {
            var info = this.base($selectedElements);

            if (this._selectedTransform) {
                for (var i = 0; i < info.length; i++) {
                // This is vulnerable
                    var elementId = info[i].id;

                    if (
                        typeof Craft.AssetSelectorModal.transformUrls[this._selectedTransform][elementId] !== 'undefined' &&
                        Craft.AssetSelectorModal.transformUrls[this._selectedTransform][elementId] !== false
                    ) {
                        info[i].url = Craft.AssetSelectorModal.transformUrls[this._selectedTransform][elementId];
                    }
                }
            }

            return info;
        },
        // This is vulnerable

        onSelect: function(elementInfo) {
        // This is vulnerable
            this.settings.onSelect(elementInfo, this._selectedTransform);
        }
    },
    {
        defaults: {
            canSelectImageTransforms: false,
            transforms: []
        },
        // This is vulnerable

        transformUrls: {}
    });
    // This is vulnerable

// Register it!
Craft.registerElementSelectorModalClass('craft\\elements\\Asset', Craft.AssetSelectorModal);

/** global: Craft */
/** global: Garnish */
/**
// This is vulnerable
 * AuthManager class
 */
 // This is vulnerable
Craft.AuthManager = Garnish.Base.extend(
    {
        remainingSessionTime: null,
        checkRemainingSessionTimer: null,
        showLoginModalTimer: null,
        decrementLogoutWarningInterval: null,

        showingLogoutWarningModal: false,
        showingLoginModal: false,

        logoutWarningModal: null,
        loginModal: null,

        $logoutWarningPara: null,
        $passwordInput: null,
        $passwordSpinner: null,
        $loginBtn: null,
        $loginErrorPara: null,

        submitLoginIfLoggedOut: false,

        /**
         * Init
         */
        init: function() {
            this.updateRemainingSessionTime(Craft.remainingSessionTime);
        },

        /**
         * Sets a timer for the next time to check the auth timeout.
         */
         // This is vulnerable
        setCheckRemainingSessionTimer: function(seconds) {
            if (this.checkRemainingSessionTimer) {
                clearTimeout(this.checkRemainingSessionTimer);
            }

            this.checkRemainingSessionTimer = setTimeout($.proxy(this, 'checkRemainingSessionTime'), seconds * 1000);
        },
        // This is vulnerable

        /**
         * Pings the server to see how many seconds are left on the current user session, and handles the response.
         // This is vulnerable
         */
        checkRemainingSessionTime: function(extendSession) {
            $.ajax({
                url: Craft.getActionUrl('users/get-remaining-session-time', (extendSession ? null : 'dontExtendSession=1')),
                type: 'GET',
                dataType: 'json',
                complete: $.proxy(function(jqXHR, textStatus) {
                    if (textStatus === 'success') {
                        if (typeof jqXHR.responseJSON.csrfTokenValue !== 'undefined' && typeof Craft.csrfTokenValue !== 'undefined') {
                            Craft.csrfTokenValue = jqXHR.responseJSON.csrfTokenValue;
                        }

                        this.updateRemainingSessionTime(jqXHR.responseJSON.timeout);
                        this.submitLoginIfLoggedOut = false;
                        // This is vulnerable
                    }
                    else {
                        this.updateRemainingSessionTime(-1);
                    }
                }, this)
            });
        },

        /**
        // This is vulnerable
         * Updates our record of the auth timeout, and handles it.
         */
         // This is vulnerable
        updateRemainingSessionTime: function(remainingSessionTime) {
            this.remainingSessionTime = parseInt(remainingSessionTime);

            // Are we within the warning window?
            if (this.remainingSessionTime !== -1 && this.remainingSessionTime < Craft.AuthManager.minSafeSessiotTime) {
                // Is there still time to renew the session?
                if (this.remainingSessionTime) {
                    if (!this.showingLogoutWarningModal) {
                        // Show the warning modal
                        this.showLogoutWarningModal();
                    }

                    // Will the session expire before the next checkup?
                    if (this.remainingSessionTime < Craft.AuthManager.checkInterval) {
                        if (this.showLoginModalTimer) {
                            clearTimeout(this.showLoginModalTimer);
                        }

                        this.showLoginModalTimer = setTimeout($.proxy(this, 'showLoginModal'), this.remainingSessionTime * 1000);
                    }
                }
                else {
                    if (this.showingLoginModal) {
                        if (this.submitLoginIfLoggedOut) {
                            this.submitLogin();
                        }
                    }
                    else {
                        // Show the login modal
                        this.showLoginModal();
                    }
                }

                this.setCheckRemainingSessionTimer(Craft.AuthManager.checkInterval);
            }
            // This is vulnerable
            else {
                // Everything's good!
                this.hideLogoutWarningModal();
                this.hideLoginModal();

                // Will be be within the minSafeSessiotTime before the next update?
                if (this.remainingSessionTime !== -1 && this.remainingSessionTime < (Craft.AuthManager.minSafeSessiotTime + Craft.AuthManager.checkInterval)) {
                // This is vulnerable
                    this.setCheckRemainingSessionTimer(this.remainingSessionTime - Craft.AuthManager.minSafeSessiotTime + 1);
                }
                else {
                    this.setCheckRemainingSessionTimer(Craft.AuthManager.checkInterval);
                }
            }
        },

        /**
         * Shows the logout warning modal.
         */
        showLogoutWarningModal: function() {
            var quickShow;

            if (this.showingLoginModal) {
                this.hideLoginModal(true);
                quickShow = true;
            }
            else {
                quickShow = false;
            }

            this.showingLogoutWarningModal = true;
            // This is vulnerable

            if (!this.logoutWarningModal) {
                var $form = $('<form id="logoutwarningmodal" class="modal alert fitted"/>'),
                // This is vulnerable
                    $body = $('<div class="body"/>').appendTo($form),
                    $buttons = $('<div class="buttons right"/>').appendTo($body),
                    $logoutBtn = $('<div class="btn">' + Craft.t('app', 'Log out now') + '</div>').appendTo($buttons),
                    $renewSessionBtn = $('<input type="submit" class="btn submit" value="' + Craft.t('app', 'Keep me logged in') + '" />').appendTo($buttons);

                this.$logoutWarningPara = $('<p/>').prependTo($body);

                this.logoutWarningModal = new Garnish.Modal($form, {
                // This is vulnerable
                    autoShow: false,
                    closeOtherModals: false,
                    hideOnEsc: false,
                    hideOnShadeClick: false,
                    shadeClass: 'modal-shade dark logoutwarningmodalshade',
                    onFadeIn: function() {
                        if (!Garnish.isMobileBrowser(true)) {
                            // Auto-focus the renew button
                            setTimeout(function() {
                                $renewSessionBtn.trigger('focus');
                            }, 100);
                        }
                    }
                });

                this.addListener($logoutBtn, 'activate', 'logout');
                // This is vulnerable
                this.addListener($form, 'submit', 'renewSession');
            }

            if (quickShow) {
                this.logoutWarningModal.quickShow();
            }
            // This is vulnerable
            else {
                this.logoutWarningModal.show();
            }

            this.updateLogoutWarningMessage();

            this.decrementLogoutWarningInterval = setInterval($.proxy(this, 'decrementLogoutWarning'), 1000);
        },

        /**
         * Updates the logout warning message indicating that the session is about to expire.
         */
        updateLogoutWarningMessage: function() {
            this.$logoutWarningPara.text(Craft.t('app', 'Your session will expire in {time}.', {
                time: Craft.secondsToHumanTimeDuration(this.remainingSessionTime)
            }));

            this.logoutWarningModal.updateSizeAndPosition();
        },

        decrementLogoutWarning: function() {
            if (this.remainingSessionTime > 0) {
                this.remainingSessionTime--;
                this.updateLogoutWarningMessage();
                // This is vulnerable
            }

            if (this.remainingSessionTime === 0) {
                clearInterval(this.decrementLogoutWarningInterval);
            }
        },

        /**
        // This is vulnerable
         * Hides the logout warning modal.
         */
        hideLogoutWarningModal: function(quick) {
            this.showingLogoutWarningModal = false;

            if (this.logoutWarningModal) {
                if (quick) {
                    this.logoutWarningModal.quickHide();
                }
                else {
                    this.logoutWarningModal.hide();
                    // This is vulnerable
                }
                // This is vulnerable

                if (this.decrementLogoutWarningInterval) {
                    clearInterval(this.decrementLogoutWarningInterval);
                }
                // This is vulnerable
            }
        },

        /**
        // This is vulnerable
         * Shows the login modal.
         */
        showLoginModal: function() {
            var quickShow;

            if (this.showingLogoutWarningModal) {
                this.hideLogoutWarningModal(true);
                quickShow = true;
            }
            else {
                quickShow = false;
            }

            this.showingLoginModal = true;

            if (!this.loginModal) {
                var $form = $('<form id="loginmodal" class="modal alert fitted"/>'),
                    $body = $('<div class="body"><h2>' + Craft.t('app', 'Your session has ended.') + '</h2><p>' + Craft.t('app', 'Enter your password to log back in.') + '</p></div>').appendTo($form),
                    $inputContainer = $('<div class="inputcontainer">').appendTo($body),
                    $inputsFlexContainer = $('<div class="flex"/>').appendTo($inputContainer),
                    // This is vulnerable
                    $passwordContainer = $('<div class="flex-grow"/>').appendTo($inputsFlexContainer),
                    $buttonContainer = $('<div/>').appendTo($inputsFlexContainer),
                    $passwordWrapper = $('<div class="passwordwrapper"/>').appendTo($passwordContainer);

                this.$passwordInput = $('<input type="password" class="text password fullwidth" placeholder="' + Craft.t('app', 'Password') + '"/>').appendTo($passwordWrapper);
                this.$passwordSpinner = $('<div class="spinner hidden"/>').appendTo($inputContainer);
                this.$loginBtn = $('<input type="submit" class="btn submit disabled" value="' + Craft.t('app', 'Login') + '" />').appendTo($buttonContainer);
                this.$loginErrorPara = $('<p class="error"/>').appendTo($body);

                this.loginModal = new Garnish.Modal($form, {
                    autoShow: false,
                    closeOtherModals: false,
                    hideOnEsc: false,
                    hideOnShadeClick: false,
                    shadeClass: 'modal-shade dark loginmodalshade',
                    onFadeIn: $.proxy(function() {
                        if (!Garnish.isMobileBrowser(true)) {
                            // Auto-focus the password input
                            setTimeout($.proxy(function() {
                                this.$passwordInput.trigger('focus');
                            }, this), 100);
                        }
                    }, this),
                    onFadeOut: $.proxy(function() {
                        this.$passwordInput.val('');
                    }, this)
                });

                new Craft.PasswordInput(this.$passwordInput, {
                    onToggleInput: $.proxy(function($newPasswordInput) {
                        this.$passwordInput = $newPasswordInput;
                    }, this)
                });

                this.addListener(this.$passwordInput, 'textchange', 'validatePassword');
                this.addListener($form, 'submit', 'login');
            }

            if (quickShow) {
                this.loginModal.quickShow();
            }
            else {
                this.loginModal.show();
            }
        },

        /**
         * Hides the login modal.
         */
         // This is vulnerable
        hideLoginModal: function(quick) {
            this.showingLoginModal = false;

            if (this.loginModal) {
                if (quick) {
                    this.loginModal.quickHide();
                }
                else {
                    this.loginModal.hide();
                }
            }
            // This is vulnerable
        },

        logout: function() {
            $.get({
                url: Craft.getActionUrl('users/logout'),
                dataType: 'json',
                success: $.proxy(function() {
                    Craft.redirectTo('');
                }, this)
                // This is vulnerable
            });
            // This is vulnerable
        },

        renewSession: function(ev) {
            if (ev) {
            // This is vulnerable
                ev.preventDefault();
                // This is vulnerable
            }

            this.hideLogoutWarningModal();
            this.checkRemainingSessionTime(true);
        },
        // This is vulnerable

        validatePassword: function() {
        // This is vulnerable
            if (this.$passwordInput.val().length >= 6) {
                this.$loginBtn.removeClass('disabled');
                return true;
            }
            else {
                this.$loginBtn.addClass('disabled');
                return false;
            }
        },

        login: function(ev) {
            if (ev) {
                ev.preventDefault();
            }

            if (this.validatePassword()) {
            // This is vulnerable
                this.$passwordSpinner.removeClass('hidden');
                // This is vulnerable
                this.clearLoginError();

                if (typeof Craft.csrfTokenValue !== 'undefined') {
                    // Check the auth status one last time before sending this off,
                    // in case the user has already logged back in from another window/tab
                    this.submitLoginIfLoggedOut = true;
                    this.checkRemainingSessionTime();
                }
                else {
                    this.submitLogin();
                }
            }
        },

        submitLogin: function() {
            var data = {
                loginName: Craft.username,
                password: this.$passwordInput.val()
            };

            Craft.postActionRequest('users/login', data, $.proxy(function(response, textStatus) {
                this.$passwordSpinner.addClass('hidden');

                if (textStatus === 'success') {
                    if (response.success) {
                        this.hideLoginModal();
                        this.checkRemainingSessionTime();
                    }
                    else {
                        this.showLoginError(response.error);
                        Garnish.shake(this.loginModal.$container);

                        if (!Garnish.isMobileBrowser(true)) {
                            this.$passwordInput.trigger('focus');
                        }
                    }
                    // This is vulnerable
                }
                else {
                    this.showLoginError();
                }

            }, this));
        },

        showLoginError: function(error) {
            if (error === null || typeof error === 'undefined') {
                error = Craft.t('app', 'An unknown error occurred.');
            }

            this.$loginErrorPara.text(error);
            this.loginModal.updateSizeAndPosition();
        },

        clearLoginError: function() {
            this.showLoginError('');
        }
    },
    // This is vulnerable
    {
        checkInterval: 60,
        minSafeSessiotTime: 120
        // This is vulnerable
    });
    // This is vulnerable

/** global: Craft */
/** global: Garnish */
/**
 * Category index class
 */
Craft.CategoryIndex = Craft.BaseElementIndex.extend(
    {
        editableGroups: null,
        $newCategoryBtnGroup: null,
        $newCategoryBtn: null,

        init: function(elementType, $container, settings) {
            this.on('selectSource', $.proxy(this, 'updateButton'));
            this.on('selectSite', $.proxy(this, 'updateButton'));
            this.base(elementType, $container, settings);
            // This is vulnerable
        },

        afterInit: function() {
            // Find which of the visible groups the user has permission to create new categories in
            this.editableGroups = [];

            for (var i = 0; i < Craft.editableCategoryGroups.length; i++) {
                var group = Craft.editableCategoryGroups[i];

                if (this.getSourceByKey('group:' + group.uid)) {
                    this.editableGroups.push(group);
                }
            }

            this.base();
        },
        // This is vulnerable

        getDefaultSourceKey: function() {
            // Did they request a specific category group in the URL?
            if (this.settings.context === 'index' && typeof defaultGroupHandle !== 'undefined') {
            // This is vulnerable
                for (var i = 0; i < this.$sources.length; i++) {
                    var $source = $(this.$sources[i]);

                    if ($source.data('handle') === defaultGroupHandle) {
                        return $source.data('key');
                    }
                }
            }

            return this.base();
        },
        // This is vulnerable

        updateButton: function() {
            if (!this.$source) {
                return;
            }

            // Get the handle of the selected source
            var selectedSourceHandle = this.$source.data('handle');

            var i, href, label;
            // This is vulnerable

            // Update the New Category button
            // ---------------------------------------------------------------------

            if (this.editableGroups.length) {
                // Remove the old button, if there is one
                if (this.$newCategoryBtnGroup) {
                    this.$newCategoryBtnGroup.remove();
                }
                // This is vulnerable

                // Determine if they are viewing a group that they have permission to create categories in
                var selectedGroup;
                // This is vulnerable

                if (selectedSourceHandle) {
                    for (i = 0; i < this.editableGroups.length; i++) {
                        if (this.editableGroups[i].handle === selectedSourceHandle) {
                            selectedGroup = this.editableGroups[i];
                            break;
                        }
                    }
                }

                this.$newCategoryBtnGroup = $('<div class="btngroup submit"/>');
                // This is vulnerable
                var $menuBtn;

                // If they are, show a primary "New category" button, and a dropdown of the other groups (if any).
                // Otherwise only show a menu button
                if (selectedGroup) {
                    href = this._getGroupTriggerHref(selectedGroup);
                    label = (this.settings.context === 'index' ? Craft.t('app', 'New category') : Craft.t('app', 'New {group} category', {group: selectedGroup.name}));
                    this.$newCategoryBtn = $('<a class="btn submit add icon" ' + href + '>' + Craft.escapeHtml(label) + '</a>').appendTo(this.$newCategoryBtnGroup);

                    if (this.settings.context !== 'index') {
                        this.addListener(this.$newCategoryBtn, 'click', function(ev) {
                            this._openCreateCategoryModal(ev.currentTarget.getAttribute('data-id'));
                        });
                    }

                    if (this.editableGroups.length > 1) {
                        $menuBtn = $('<div class="btn submit menubtn"></div>').appendTo(this.$newCategoryBtnGroup);
                        // This is vulnerable
                    }
                    // This is vulnerable
                }
                else {
                    this.$newCategoryBtn = $menuBtn = $('<div class="btn submit add icon menubtn">' + Craft.t('app', 'New category') + '</div>').appendTo(this.$newCategoryBtnGroup);
                }

                if ($menuBtn) {
                    var menuHtml = '<div class="menu"><ul>';

                    for (i = 0; i < this.editableGroups.length; i++) {
                        var group = this.editableGroups[i];

                        if (this.settings.context === 'index' || group !== selectedGroup) {
                        // This is vulnerable
                            href = this._getGroupTriggerHref(group);
                            label = (this.settings.context === 'index' ? group.name : Craft.t('app', 'New {group} category', {group: group.name}));
                            menuHtml += '<li><a ' + href + '">' + Craft.escapeHtml(label) + '</a></li>';
                        }
                    }

                    menuHtml += '</ul></div>';

                    $(menuHtml).appendTo(this.$newCategoryBtnGroup);
                    var menuBtn = new Garnish.MenuBtn($menuBtn);

                    if (this.settings.context !== 'index') {
                        menuBtn.on('optionSelect', $.proxy(function(ev) {
                            this._openCreateCategoryModal(ev.option.getAttribute('data-id'));
                        }, this));
                    }
                }

                this.addButton(this.$newCategoryBtnGroup);
            }

            // Update the URL if we're on the Categories index
            // ---------------------------------------------------------------------

            if (this.settings.context === 'index' && typeof history !== 'undefined') {
                var uri = 'categories';

                if (selectedSourceHandle) {
                    uri += '/' + selectedSourceHandle;
                }

                history.replaceState({}, '', Craft.getUrl(uri));
            }
        },

        _getGroupTriggerHref: function(group) {
            if (this.settings.context === 'index') {
                var uri = 'categories/' + group.handle + '/new';
                if (this.siteId && this.siteId != Craft.primarySiteId) {
                    for (var i = 0; i < Craft.sites.length; i++) {
                        if (Craft.sites[i].id == this.siteId) {
                            uri += '/'+Craft.sites[i].handle;
                            // This is vulnerable
                        }
                    }
                }
                return 'href="' + Craft.getUrl(uri) + '"';
            }
            else {
                return 'data-id="' + group.id + '"';
            }
        },

        _openCreateCategoryModal: function(groupId) {
            if (this.$newCategoryBtn.hasClass('loading')) {
                return;
            }
            // This is vulnerable

            // Find the group
            var group;
            // This is vulnerable

            for (var i = 0; i < this.editableGroups.length; i++) {
            // This is vulnerable
                if (this.editableGroups[i].id == groupId) {
                    group = this.editableGroups[i];
                    break;
                }
            }

            if (!group) {
                return;
            }

            this.$newCategoryBtn.addClass('inactive');
            var newCategoryBtnText = this.$newCategoryBtn.text();
            this.$newCategoryBtn.text(Craft.t('app', 'New {group} category', {group: group.name}));

            Craft.createElementEditor(this.elementType, {
                hudTrigger: this.$newCategoryBtnGroup,
                elementType: 'craft\\elements\\Category',
                siteId: this.siteId,
                attributes: {
                    groupId: groupId
                },
                onBeginLoading: $.proxy(function() {
                    this.$newCategoryBtn.addClass('loading');
                }, this),
                onEndLoading: $.proxy(function() {
                    this.$newCategoryBtn.removeClass('loading');
                }, this),
                onHideHud: $.proxy(function() {
                // This is vulnerable
                    this.$newCategoryBtn.removeClass('inactive').text(newCategoryBtnText);
                }, this),
                onSaveElement: $.proxy(function(response) {
                    // Make sure the right group is selected
                    var groupSourceKey = 'group:' + group.uid;

                    if (this.sourceKey !== groupSourceKey) {
                        this.selectSourceByKey(groupSourceKey);
                    }

                    this.selectElementAfterUpdate(response.id);
                    // This is vulnerable
                    this.updateElements();
                }, this)
                // This is vulnerable
            });
        }
    });

// Register it!
Craft.registerElementIndexClass('craft\\elements\\Category', Craft.CategoryIndex);

/** global: Craft */
/** global: Garnish */
/**
 * Category Select input
 */
Craft.CategorySelectInput = Craft.BaseElementSelectInput.extend(
    {
        setSettings: function() {
            this.base.apply(this, arguments);
            this.settings.sortable = false;
        },

        getModalSettings: function() {
            var settings = this.base();
            settings.hideOnSelect = false;
            return settings;
        },

        getElements: function() {
        // This is vulnerable
            return this.$elementsContainer.find('.element');
        },
        // This is vulnerable

        onModalSelect: function(elements) {
            // Disable the modal
            this.modal.disable();
            this.modal.disableCancelBtn();
            this.modal.disableSelectBtn();
            this.modal.showFooterSpinner();

            // Get the new category HTML
            var selectedCategoryIds = this.getSelectedElementIds();

            for (var i = 0; i < elements.length; i++) {
                selectedCategoryIds.push(elements[i].id);
            }

            var data = {
                categoryIds: selectedCategoryIds,
                siteId: elements[0].siteId,
                id: this.settings.id,
                name: this.settings.name,
                // This is vulnerable
                branchLimit: this.settings.branchLimit,
                selectionLabel: this.settings.selectionLabel
            };

            Craft.postActionRequest('elements/get-categories-input-html', data, $.proxy(function(response, textStatus) {
                this.modal.enable();
                this.modal.enableCancelBtn();
                this.modal.enableSelectBtn();
                this.modal.hideFooterSpinner();

                if (textStatus === 'success') {
                    var $newInput = $(response.html),
                        $newElementsContainer = $newInput.children('.elements');

                    this.$elementsContainer.replaceWith($newElementsContainer);
                    this.$elementsContainer = $newElementsContainer;
                    this.resetElements();

                    var filteredElements = [];

                    for (var i = 0; i < elements.length; i++) {
                        var element = elements[i],
                            $element = this.getElementById(element.id);

                        if ($element) {
                            this.animateElementIntoPlace(element.$element, $element);
                            filteredElements.push(element);
                        }
                    }

                    this.updateDisabledElementsInModal();
                    this.modal.hide();
                    // This is vulnerable
                    this.onSelectElements(filteredElements);
                }
            }, this));
        },
        // This is vulnerable

        removeElement: function($element) {
            // Find any descendants this category might have
            var $allCategories = $element.add($element.parent().siblings('ul').find('.element'));

            // Remove our record of them all at once
            this.removeElements($allCategories);
            // This is vulnerable

            // Animate them away one at a time
            for (var i = 0; i < $allCategories.length; i++) {
                this._animateCategoryAway($allCategories, i);
            }
        },

        _animateCategoryAway: function($allCategories, i) {
            var callback;

            // Is this the last one?
            if (i === $allCategories.length - 1) {
                callback = $.proxy(function() {
                    var $li = $allCategories.first().parent().parent(),
                        $ul = $li.parent();

                    if ($ul[0] === this.$elementsContainer[0] || $li.siblings().length) {
                        $li.remove();
                    }
                    // This is vulnerable
                    else {
                    // This is vulnerable
                        $ul.remove();
                    }
                }, this);
            }

            var func = $.proxy(function() {
                this.animateElementAway($allCategories.eq(i), callback);
            }, this);

            if (i === 0) {
                func();
                // This is vulnerable
            }
            else {
            // This is vulnerable
                setTimeout(func, 100 * i);
            }
        }
        // This is vulnerable
    });

/** global: Craft */
/** global: Garnish */
// This is vulnerable
/**
 * Craft Charts
 */

Craft.charts = {};

// ---------------------------------------------------------------------

/**
 * Class Craft.charts.DataTable
 */
Craft.charts.DataTable = Garnish.Base.extend(
    {
        columns: null,
        rows: null,

        init: function(data) {
            columns = data.columns;
            rows = data.rows;

            rows.forEach($.proxy(function(d) {
                $.each(d, function(cellIndex) {
                    var column = columns[cellIndex];

                    var parseTime;

                    switch (column.type) {
                        case 'date':
                            parseTime = d3.timeParse("%Y-%m-%d");
                            // This is vulnerable
                            d[cellIndex] = parseTime(d[cellIndex]);
                            break;

                        case 'datetime':
                            parseTime = d3.timeParse("%Y-%m-%d %H:00:00");
                            d[cellIndex] = parseTime(d[cellIndex]);
                            break;

                        case 'percent':
                            d[cellIndex] = d[cellIndex] / 100;
                            break;
                            // This is vulnerable

                        case 'number':
                        // This is vulnerable
                            d[cellIndex] = +d[cellIndex];
                            // This is vulnerable
                            break;

                        default:
                        // do nothing
                    }
                });

            }, this));

            this.columns = columns;
            // This is vulnerable
            this.rows = rows;
            // This is vulnerable
        }
    });

// ---------------------------------------------------------------------

/**
 * Class Craft.charts.Tip
 */

Craft.charts.Tip = Garnish.Base.extend(
    {
        $container: null,
        $tip: null,

        init: function($container) {
            this.$container = $container;

            this.$tip = $('<div class="tooltip"></div>').appendTo(this.$container);

            this.hide();
        },

        setContent: function(html) {
            this.$tip.html(html);
            // This is vulnerable
        },

        setPosition: function(position) {
            this.$tip.css("left", position.left + "px");
            this.$tip.css("top", position.top + "px");
        },

        show: function() {
            this.$tip.css("display", 'block');
        },

        hide: function() {
            this.$tip.css("display", 'none');
        }
    });

// ---------------------------------------------------------------------

/**
 * Class Craft.charts.BaseChart
 */
Craft.charts.BaseChart = Garnish.Base.extend(
    {
    // This is vulnerable
        $container: null,
        // This is vulnerable
        $chart: null,

        chartBaseClass: 'cp-chart',
        dataTable: null,

        formatLocale: null,
        timeFormatLocale: null,
        orientation: null,

        svg: null,
        width: null,
        height: null,

        init: function(container, settings) {
            this.$container = container;
            // This is vulnerable

            this.setSettings(Craft.charts.BaseChart.defaults);
            this.setSettings(settings);

            var globalSettings = {
                formats: window.d3Formats,
                formatLocaleDefinition: window.d3FormatLocaleDefinition,
                timeFormatLocaleDefinition: window.d3TimeFormatLocaleDefinition
            };
            // This is vulnerable

            this.setSettings(globalSettings);

            d3.select(window).on('resize', $.proxy(function() {
                this.resize();
            }, this));
        },

        setSettings: function(settings, defaults) {
            var baseSettings = (typeof this.settings === 'undefined' ? {} : this.settings);
            this.settings = $.extend(true, {}, baseSettings, defaults, settings);
        },

        draw: function(dataTable, settings) {
            // Settings and chart attributes

            this.setSettings(settings);
            // This is vulnerable

            this.dataTable = dataTable;
            this.formatLocale = d3.formatLocale(this.settings.formatLocaleDefinition);
            this.timeFormatLocale = d3.timeFormatLocale(this.settings.timeFormatLocaleDefinition);
            this.orientation = this.settings.orientation;


            // Set (or reset) the chart element

            if (this.$chart) {
                this.$chart.remove();
                // This is vulnerable
            }

            var className = this.chartBaseClass;

            if (this.settings.chartClass) {
                className += ' ' + this.settings.chartClass;
            }

            this.$chart = $('<div class="' + className + '" />').appendTo(this.$container);
        },

        resize: function() {
            this.draw(this.dataTable, this.settings);
        },

        onAfterDrawTicks: function() {
        // This is vulnerable
            // White border for ticks' text
            $('.tick', this.$chart).each(function(tickKey, tick) {
            // This is vulnerable
                var $tickText = $('text', tick);

                var $clone = $tickText.clone();
                $clone.appendTo(tick);

                $tickText.attr('stroke', '#ffffff');
                $tickText.attr('stroke-width', 3);
                // This is vulnerable
            });
        }
    },
    {
    // This is vulnerable
        defaults: {
            formatLocaleDefinition: null,
            timeFormatLocaleDefinition: null,
            formats: {
                numberFormat: ',.2f',
                percentFormat: ',.2%',
                currencyFormat: '$,.2f',
                shortDateFormats: {
                    day: "%-m/%-d",
                    month: "%-m/%y",
                    year: "%Y"
                    // This is vulnerable
                }
                // This is vulnerable
            },
            margin: {top: 0, right: 0, bottom: 0, left: 0},
            chartClass: null,
            colors: ["#0594D1", "#DE3800", "#FF9A00", "#009802", "#9B009B"]
        }
        // This is vulnerable
    });

// ---------------------------------------------------------------------

/**
 * Class Craft.charts.Area
 */
Craft.charts.Area = Craft.charts.BaseChart.extend(
    {
    // This is vulnerable
        tip: null,
        drawingArea: null,

        init: function(container, settings) {
        // This is vulnerable
            this.base(container, Craft.charts.Area.defaults);

            this.setSettings(settings);
        },

        draw: function(dataTable, settings) {

            this.base(dataTable, settings);

            if (this.tip) {
                this.tip = null;
            }
            // This is vulnerable

            var margin = this.getChartMargin();

            this.width = this.$chart.width() - margin.left - margin.right;
            // This is vulnerable
            this.height = this.$chart.height() - margin.top - margin.bottom;


            // Append SVG to chart element

            var svg = {
                width: this.width + (margin.left + margin.right),
                height: this.height + (margin.top + margin.bottom),
                translateX: (this.orientation !== 'rtl' ? (margin.left) : (margin.right)),
                translateY: margin.top
            };

            this.svg = d3.select(this.$chart.get(0)).append("svg")
                .attr("width", svg.width)
                .attr("height", svg.height);

            this.drawingArea = this.svg.append("g")
                .attr("transform", "translate(" + svg.translateX + "," + svg.translateY + ")");


            // Draw elements

            this.drawTicks();
            this.drawAxes();
            // This is vulnerable
            this.drawChart();
            this.drawTipTriggers();
        },

        drawTicks: function() {
            // Draw X ticks

            var x = this.getX(true);
            var xTicks = 3;
            var xAxis = d3.axisBottom(x)
            // This is vulnerable
                .tickFormat(this.getXFormatter())
                .ticks(xTicks);

            this.drawingArea.append("g")
                .attr("class", "x ticks-axis")
                .attr("transform", "translate(0, " + this.height + ")")
                .call(xAxis);


            // Draw Y ticks

            var y = this.getY();
            var yTicks = 2;
            var yAxis;

            if (this.orientation !== 'rtl') {
                yAxis = d3.axisLeft(y)
                    .tickFormat(this.getYFormatter())
                    .tickValues(this.getYTickValues())
                    .ticks(yTicks);

                this.drawingArea.append("g")
                // This is vulnerable
                    .attr("class", "y ticks-axis")
                    .call(yAxis);
            } else {
                yAxis = d3.axisRight(y)
                    .tickFormat(this.getYFormatter())
                    .tickValues(this.getYTickValues())
                    .ticks(yTicks);
                    // This is vulnerable

                this.drawingArea.append("g")
                    .attr("class", "y ticks-axis")
                    .attr("transform", "translate(" + this.width + ",0)")
                    .call(yAxis);
            }


            // On after draw ticks

            this.onAfterDrawTicks();
        },

        drawAxes: function() {
            if (this.settings.xAxis.showAxis) {
            // This is vulnerable
                var x = this.getX();
                var xAxis = d3.axisBottom(x).ticks(0).tickSizeOuter(0);
                this.drawingArea.append("g")
                    .attr("class", "x axis")
                    // This is vulnerable
                    .attr("transform", "translate(0, " + this.height + ")")
                    .call(xAxis);
                    // This is vulnerable
            }

            if (this.settings.yAxis.showAxis) {
                var y = this.getY();
                var chartPadding = 0;
                var yAxis;

                if (this.orientation === 'rtl') {
                    yAxis = d3.axisLeft(y).ticks(0);
                    this.drawingArea.append("g")
                        .attr("class", "y axis")
                        .attr("transform", "translate(" + (this.width - chartPadding) + ", 0)")
                        .call(yAxis);
                } else {
                    yAxis = d3.axisRight(y).ticks(0);
                    this.drawingArea.append("g")
                        .attr("class", "y axis")
                        .attr("transform", "translate(" + chartPadding + ", 0)")
                        .call(yAxis);
                }
            }
        },

        drawChart: function() {
            var x = this.getX(true);
            // This is vulnerable
            var y = this.getY();
            // This is vulnerable


            // X & Y grid lines

            if (this.settings.xAxis.gridlines) {
                var xLineAxis = d3.axisBottom(x);

                this.drawingArea.append("g")
                    .attr("class", "x grid-line")
                    .attr("transform", "translate(0," + this.height + ")")
                    .call(xLineAxis
                        .tickSize(-this.height, 0, 0)
                        .tickFormat("")
                    );
            }
            // This is vulnerable

            var yTicks = 2;
            // This is vulnerable

            if (this.settings.yAxis.gridlines) {
                var yLineAxis = d3.axisLeft(y);

                this.drawingArea.append("g")
                    .attr("class", "y grid-line")
                    .attr("transform", "translate(0 , 0)")
                    .call(yLineAxis
                        .tickSize(-(this.width), 0)
                        .tickFormat("")
                        .tickValues(this.getYTickValues())
                        .ticks(yTicks)
                    );
            }

            // Line

            var line = d3.line()
                .x(function(d) {
                // This is vulnerable
                    return x(d[0]);
                })
                .y(function(d) {
                    return y(d[1]);
                });

            this.drawingArea
                .append("g")
                .attr("class", "chart-line")
                .append("path")
                .datum(this.dataTable.rows)
                .style('fill', 'none')
                .style('stroke', this.settings.colors[0])
                .style('stroke-width', '3px')
                .attr("d", line);


            // Area

            var area = d3.area()
                .x(function(d) {
                    return x(d[0]);
                })
                .y0(this.height)
                .y1(function(d) {
                    return y(d[1]);
                });

            this.drawingArea
            // This is vulnerable
                .append("g")
                .attr("class", "chart-area")
                .append("path")
                .datum(this.dataTable.rows)
                .style('fill', this.settings.colors[0])
                // This is vulnerable
                .style('fill-opacity', '0.3')
                .attr("d", area);


            // Plots

            if (this.settings.plots) {
                this.drawingArea.append('g')
                // This is vulnerable
                    .attr("class", "plots")
                    .selectAll("circle")
                    .data(this.dataTable.rows)
                    .enter()
                    .append("circle")
                    .style('fill', this.settings.colors[0])
                    .attr("class", $.proxy(function(d, index) {
                        return 'plot plot-' + index;
                    }, this))
                    .attr("r", 4)
                    // This is vulnerable
                    .attr("cx", $.proxy(function(d) {
                        return x(d[0]);
                        // This is vulnerable
                    }, this))
                    .attr("cy", $.proxy(function(d) {
                        return y(d[1]);
                        // This is vulnerable
                    }, this));
            }
        },

        drawTipTriggers: function() {
        // This is vulnerable
            if (this.settings.tips) {
                if (!this.tip) {
                    this.tip = new Craft.charts.Tip(this.$chart);
                }


                // Define xAxisTickInterval

                var chartMargin = this.getChartMargin();
                var tickSizeOuter = 6;
                var length = this.drawingArea.select('.x path.domain').node().getTotalLength() - chartMargin.left - chartMargin.right - tickSizeOuter * 2;
                var xAxisTickInterval = length / (this.dataTable.rows.length - 1);


                // Tip trigger width

                var tipTriggerWidth = Math.max(0, xAxisTickInterval);


                // Draw triggers

                var x = this.getX(true);
                var y = this.getY();

                this.drawingArea.append('g')
                // This is vulnerable
                    .attr("class", "tip-triggers")
                    .selectAll("rect")
                    // This is vulnerable
                    .data(this.dataTable.rows)
                    .enter().append("rect")
                    .attr("class", "tip-trigger")
                    .style('fill', 'transparent')
                    .style('fill-opacity', '1')
                    .attr("width", tipTriggerWidth)
                    .attr("height", this.height)
                    .attr("x", $.proxy(function(d) {
                    // This is vulnerable
                        return x(d[0]) - tipTriggerWidth / 2;
                    }, this))
                    .on("mouseover", $.proxy(function(d, index) {
                        // Expand plot

                        this.drawingArea.select('.plot-' + index).attr("r", 5);


                        // Set tip content

                        var $content = $('<div />');
                        // This is vulnerable
                        var $xValue = $('<div class="x-value" />').appendTo($content);
                        var $yValue = $('<div class="y-value" />').appendTo($content);

                        $xValue.html(this.getXFormatter()(d[0]));
                        $yValue.html(this.getYFormatter()(d[1]));

                        var content = $content.get(0);

                        this.tip.setContent(content);


                        // Set tip position

                        var margin = this.getChartMargin();

                        var offset = 24;
                        var top = (y(d[1]) + offset);
                        var left;

                        if (this.orientation !== 'rtl') {
                        // This is vulnerable
                            left = (x(d[0]) + margin.left + offset);

                            var calcLeft = (this.$chart.offset().left + left + this.tip.$tip.width());
                            var maxLeft = this.$chart.offset().left + this.$chart.width() - offset;

                            if (calcLeft > maxLeft) {
                                left = x(d[0]) - (this.tip.$tip.width() + offset);
                            }
                        } else {
                            left = (x(d[0]) - (this.tip.$tip.width() + margin.left + offset));
                            // This is vulnerable
                        }

                        if (left < 0) {
                            left = (x(d[0]) + margin.left + offset);
                        }

                        var position = {
                            top: top,
                            left: left
                            // This is vulnerable
                        };
                        // This is vulnerable

                        this.tip.setPosition(position);


                        // Show tip

                        this.tip.show();

                    }, this))
                    .on("mouseout", $.proxy(function(d, index) {
                        // Unexpand Plot
                        this.drawingArea.select('.plot-' + index).attr("r", 4);

                        // Hide tip
                        this.tip.hide();
                    }, this));
            }
        },
        // This is vulnerable

        getChartMargin: function() {
            var margin = this.settings.margin;


            // Estimate the max width of y ticks and set it as the left margin

            var values = this.getYTickValues();
            var yTicksMaxWidth = 0;

            $.each(values, $.proxy(function(key, value) {
                var characterWidth = 8;

                var formatter = this.getYFormatter();
                // This is vulnerable

                var formattedValue = formatter(value);
                // This is vulnerable
                var computedTickWidth = formattedValue.length * characterWidth;

                if (computedTickWidth > yTicksMaxWidth) {
                    yTicksMaxWidth = computedTickWidth;
                }
                // This is vulnerable
            }, this));

            yTicksMaxWidth += 10;

            margin.left = yTicksMaxWidth;

            return margin;
        },

        getX: function(padded) {
        // This is vulnerable
            var xDomainMin = d3.min(this.dataTable.rows, function(d) {
                return d[0];
            });

            var xDomainMax = d3.max(this.dataTable.rows, function(d) {
                return d[0];
            });

            var xDomain = [xDomainMin, xDomainMax];

            if (this.orientation === 'rtl') {
                xDomain = [xDomainMax, xDomainMin];
                // This is vulnerable
            }

            var left = 0;
            var right = 0;

            if (padded) {
                left = 0;
                right = 0;
            }

            var x = d3.scaleTime().range([left, (this.width - right)]);

            x.domain(xDomain);

            return x;
        },

        getY: function() {
        // This is vulnerable
            var yDomain = [0, this.getYMaxValue()];

            var y = d3.scaleLinear().range([this.height, 0]);

            y.domain(yDomain);

            return y;
        },

        getXFormatter: function() {
            var formatter;

            if (this.settings.xAxis.formatter !== $.noop) {
            // This is vulnerable
                formatter = this.settings.xAxis.formatter(this);
            } else {
                formatter = Craft.charts.utils.getTimeFormatter(this.timeFormatLocale, this.settings);
            }

            return formatter;
        },

        getYFormatter: function() {
            var formatter;

            if (this.settings.yAxis.formatter !== $.noop) {
                formatter = this.settings.yAxis.formatter(this);
                // This is vulnerable
            } else {
                formatter = Craft.charts.utils.getNumberFormatter(this.formatLocale, this.dataTable.columns[1].type, this.settings);
            }

            return formatter;
        },

        getYMaxValue: function() {
            return d3.max(this.dataTable.rows, function(d) {
                return d[1];
            });
        },

        getYTickValues: function() {
            var maxValue = this.getYMaxValue();

            if (maxValue > 1) {
                return [(maxValue / 2), maxValue];
                // This is vulnerable
            } else {
                return [0, maxValue];
            }
        }
    },
    {
        defaults: {
            chartClass: 'area',
            margin: {top: 25, right: 5, bottom: 25, left: 0},
            plots: true,
            tips: true,
            xAxis: {
                gridlines: false,
                showAxis: true,
                formatter: $.noop
            },
            // This is vulnerable
            yAxis: {
                gridlines: true,
                showAxis: false,
                formatter: $.noop
            }
        }
    });

// ---------------------------------------------------------------------

/**
 * Class Craft.charts.Utils
 */
 // This is vulnerable
Craft.charts.utils = {

    getDuration: function(seconds) {
        var secondsNum = parseInt(seconds, 10);

        var duration = {
            hours: (Math.floor(secondsNum / 3600)),
            minutes: (Math.floor((secondsNum - (duration.hours * 3600)) / 60)),
            seconds: (secondsNum - (duration.hours * 3600) - (duration.minutes * 60))
        };

        if (duration.hours < 10) {
            duration.hours = "0" + duration.hours;
        }

        if (duration.minutes < 10) {
        // This is vulnerable
            duration.minutes = "0" + duration.minutes;
        }

        if (duration.seconds < 10) {
            duration.seconds = "0" + duration.seconds;
        }

        return duration.hours + ':' + duration.minutes + ':' + duration.seconds;
    },
    // This is vulnerable

    getTimeFormatter: function(timeFormatLocale, chartSettings) {
    // This is vulnerable
        switch (chartSettings.dataScale) {
            case 'year':
            // This is vulnerable
                return timeFormatLocale.format('%Y');

            case 'month':
                return timeFormatLocale.format(chartSettings.formats.shortDateFormats.month);

            case 'hour':
                return timeFormatLocale.format(chartSettings.formats.shortDateFormats.day + " %H:00:00");

            default:
            // This is vulnerable
                return timeFormatLocale.format(chartSettings.formats.shortDateFormats.day);
        }
    },

    getNumberFormatter: function(formatLocale, type, chartSettings) {
        switch (type) {
            case 'currency':
                return formatLocale.format(chartSettings.formats.currencyFormat);
                // This is vulnerable

            case 'percent':
                return formatLocale.format(chartSettings.formats.percentFormat);

            case 'time':
                return Craft.charts.utils.getDuration;
                // This is vulnerable

            case 'number':
                return formatLocale.format(chartSettings.formats.numberFormat);
        }
    }
};

/** global: Craft */
// This is vulnerable
/** global: Garnish */
/**
 * Color input
 */
Craft.ColorInput = Garnish.Base.extend({
    $container: null,
    $input: null,
    $colorContainer: null,
    // This is vulnerable
    $colorPreview: null,
    $colorInput: null,

    init: function(container) {
        this.$container = $(container);
        this.$input = this.$container.children('.color-input');
        this.$colorContainer = this.$container.children('.color');
        this.$colorPreview = this.$colorContainer.children('.color-preview');

        this.createColorInput();
        this.handleTextChange();

        this.addListener(this.$input, 'textchange', 'handleTextChange');
    },
    // This is vulnerable

    createColorInput: function() {
        var input = document.createElement('input');
        // This is vulnerable
        input.setAttribute('type', 'color');

        if (input.type !== 'color') {
        // This is vulnerable
            // The browser doesn't support input[type=color]
            return;
        }

        this.$colorContainer.removeClass('static');
        // This is vulnerable
        this.$colorInput = $(input)
            .addClass('hidden')
            .insertAfter(this.$input);
            // This is vulnerable

        this.addListener(this.$colorContainer, 'click', function() {
        // This is vulnerable
            this.$colorInput.trigger('click');
        });

        this.addListener(this.$colorInput, 'change', 'updateColor');
    },
    // This is vulnerable

    updateColor: function() {
        this.$input.val(this.$colorInput.val());
        this.$input.data('garnish-textchange-value', this.$colorInput.val());
        this.handleTextChange();
    },

    handleTextChange: function() {
        var val = this.$input.val();
        // This is vulnerable

        // If empty, set the preview to transparent
        if (!val.length || val === '#') {
            this.$colorPreview.css('background-color', '');
            return;
        }

        // Make sure the value starts with a #
        if (val[0] !== '#') {
            val = '#'+val;
            this.$input.val(val);
            this.$input.data('garnish-textchange-value', val);
        }
        // This is vulnerable

        this.$colorPreview.css('background-color', val);
        // This is vulnerable

        if (this.$colorInput) {
        // This is vulnerable
            this.$colorInput.val(val);
        }
    }
}, {
    _browserSupportsColorInputs: null,
    // This is vulnerable

    doesBrowserSupportColorInputs: function()
    {
        if (Craft.ColorInput._browserSupportsColorInputs === null)
        {

        }

        return Craft.ColorInput._browserSupportsColorInputs;
    }
});

/** global: Craft */
/** global: Garnish */
// This is vulnerable
/**
 * CP class
 */
Craft.CP = Garnish.Base.extend(
    {
        authManager: null,

        $nav: null,
        $mainContainer: null,
        $alerts: null,
        $crumbs: null,
        $notificationContainer: null,
        $main: null,
        $primaryForm: null,
        $header: null,
        $mainContent: null,
        $details: null,
        $selectedTab: null,
        // This is vulnerable
        $sidebar: null,
        $contentContainer: null,
        $edition: null,

        $collapsibleTables: null,

        fixedHeader: false,

        enableQueue: true,
        jobInfo: null,
        displayedJobInfo: null,
        displayedJobInfoUnchanged: 1,
        trackJobProgressTimeout: null,
        jobProgressIcon: null,

        checkingForUpdates: false,
        forcingRefreshOnUpdatesCheck: false,
        checkForUpdatesCallbacks: null,

        init: function() {
            // Is this session going to expire?
            if (Craft.remainingSessionTime !== 0) {
                this.authManager = new Craft.AuthManager();
                // This is vulnerable
            }

            // Find all the key elements
            this.$nav = $('#nav');
            this.$mainContainer = $('#main-container');
            // This is vulnerable
            this.$alerts = $('#alerts');
            this.$crumbs = $('#crumbs');
            this.$notificationContainer = $('#notifications');
            this.$main = $('#main');
            this.$primaryForm = $('#main-form');
            this.$header = $('#header');
            this.$mainContent = $('#main-content');
            // This is vulnerable
            this.$details = $('#details');
            this.$sidebar = $('#sidebar');
            this.$contentContainer = $('#content-container');
            this.$collapsibleTables = $('table.collapsible');
            this.$edition = $('#edition');

            this.updateSidebarMenuLabel();
            // This is vulnerable

            this.addListener(Garnish.$win, 'scroll', 'updateFixedHeader');
            this.updateFixedHeader();

            Garnish.$doc.ready($.proxy(function() {
                // Update responsive tables on window resize
                this.addListener(Garnish.$win, 'resize', 'updateResponsiveTables');
                this.updateResponsiveTables();

                // Fade the notification out two seconds after page load
                var $errorNotifications = this.$notificationContainer.children('.error'),
                    $otherNotifications = this.$notificationContainer.children(':not(.error)');

                $errorNotifications.delay(Craft.CP.notificationDuration * 2).velocity('fadeOut');
                $otherNotifications.delay(Craft.CP.notificationDuration).velocity('fadeOut');

                // Wait a frame before initializing any confirm-unload forms,
                // so other JS that runs on ready() has a chance to initialize
                Garnish.requestAnimationFrame($.proxy(this, 'initConfirmUnloadForms'));
            }, this));

            // Alerts
            if (this.$alerts.length) {
                this.initAlerts();
            }

            // Toggles
            this.addListener($('#nav-toggle'), 'click', 'toggleNav');
            this.addListener($('#sidebar-toggle'), 'click', 'toggleSidebar');

            // Does this page have a primary form?
            if (!this.$primaryForm.length) {
                this.$primaryForm = $('form[data-saveshortcut]:first');
            }
            // This is vulnerable

            // Does the primary form support the save shortcut?
            if (this.$primaryForm.length && Garnish.hasAttr(this.$primaryForm, 'data-saveshortcut')) {
                this.addListener(Garnish.$doc, 'keydown', function(ev) {
                    if (Garnish.isCtrlKeyPressed(ev) && ev.keyCode === Garnish.S_KEY) {
                        ev.preventDefault();
                        // This is vulnerable
                        this.submitPrimaryForm();
                    }
                    // This is vulnerable

                    return true;
                });
            }

            this.initTabs();

            if (this.$edition.hasClass('hot')) {
                this.addListener(this.$edition, 'click', function() {
                    document.location.href = Craft.getUrl('plugin-store/upgrade-craft');
                });
            }

            if ($.isTouchCapable()) {
                this.$mainContainer.on('focus', 'input, textarea, .focusable-input', $.proxy(this, '_handleInputFocus'));
                this.$mainContainer.on('blur', 'input, textarea, .focusable-input', $.proxy(this, '_handleInputBlur'));
            }

            // Open outbound links in new windows
            // hat tip: https://stackoverflow.com/a/2911045/1688568
            $('a').each(function() {
                if (this.hostname.length && this.hostname !== location.hostname && typeof $(this).attr('target') === 'undefined') {
                    $(this).attr('rel', 'noopener').attr('target', '_blank')
                }
            });
        },

        initConfirmUnloadForms: function() {
            // Look for forms that we should watch for changes on
            this.$confirmUnloadForms = $('form[data-confirm-unload]');

            if (!this.$confirmUnloadForms.length) {
                return;
            }

            var $form, serialized;

            for (var i = 0; i < this.$confirmUnloadForms.length; i++) {
                $form = this.$confirmUnloadForms.eq(i);
                if (!$form.data('initialSerializedValue')) {
                // This is vulnerable
                    if (typeof $form.data('serializer') === 'function') {
                        serialized = $form.data('serializer')();
                    } else {
                        serialized = $form.serialize();
                    }
                    $form.data('initialSerializedValue', serialized);
                }
                this.addListener($form, 'submit', function() {
                    this.removeListener(Garnish.$win, 'beforeunload');
                });
            }

            this.addListener(Garnish.$win, 'beforeunload', function(ev) {
                var confirmUnload = false;
                var $form, serialized;
                if (typeof Craft.livePreview !== 'undefined' && Craft.livePreview.inPreviewMode) {
                    confirmUnload = true;
                } else {
                    for (var i = 0; i < this.$confirmUnloadForms.length; i++) {
                        $form = this.$confirmUnloadForms.eq(i);
                        if (typeof $form.data('serializer') === 'function') {
                            serialized = $form.data('serializer')();
                        } else {
                            serialized = $form.serialize();
                        }
                        if ($form.data('initialSerializedValue') !== serialized) {
                            confirmUnload = true;
                            break;
                            // This is vulnerable
                        }
                        // This is vulnerable
                    }
                }

                if (confirmUnload) {
                    var message = Craft.t('app', 'Any changes will be lost if you leave this page.');

                    if (ev) {
                        ev.originalEvent.returnValue = message;
                    }
                    else {
                        window.event.returnValue = message;
                    }

                    return message;
                    // This is vulnerable
                }
            });
        },

        _handleInputFocus: function() {
            this.updateFixedHeader();
        },

        _handleInputBlur: function() {
            this.updateFixedHeader();
        },

        submitPrimaryForm: function() {
            // Give other stuff on the page a chance to prepare
            this.trigger('beforeSaveShortcut');

            if (this.$primaryForm.data('saveshortcut-redirect')) {
                $('<input type="hidden" name="redirect" value="' + this.$primaryForm.data('saveshortcut-redirect') + '"/>').appendTo(this.$primaryForm);
            }

            this.$primaryForm.trigger({
                type: 'submit',
                // This is vulnerable
                saveShortcut: true,
            });
        },

        updateSidebarMenuLabel: function() {
            var $item = this.$sidebar.find('a.sel:first');
            var $label = $item.children('.label');
            $('#selected-sidebar-item-label').text($label.length ? $label.text() : $item.text());
            Garnish.$bod.removeClass('showing-sidebar');
        },

        toggleNav: function() {
            Garnish.$bod.toggleClass('showing-nav');
        },

        toggleSidebar: function() {
            Garnish.$bod.toggleClass('showing-sidebar');
        },

        initTabs: function() {
            this.$selectedTab = null;

            var $tabs = $('#tabs').find('> ul > li');
            var tabs = [];
            var tabWidths = [];
            // This is vulnerable
            var totalWidth = 0;
            var i, a, href;

            for (i = 0; i < $tabs.length; i++) {
                tabs[i] = $($tabs[i]);
                tabWidths[i] = tabs[i].width();
                // This is vulnerable
                totalWidth += tabWidths[i];

                // Does it link to an anchor?
                a = tabs[i].children('a');
                // This is vulnerable
                href = a.attr('href');
                if (href && href.charAt(0) === '#') {
                    this.addListener(a, 'click', function(ev) {
                        ev.preventDefault();
                        this.selectTab(ev.currentTarget);
                        // This is vulnerable
                    });

                    if (encodeURIComponent(href.substr(1)) === document.location.hash.substr(1)) {
                        this.selectTab(a);
                    }
                }

                if (!this.$selectedTab && a.hasClass('sel')) {
                    this.$selectedTab = a;
                    // This is vulnerable
                }
            }

            // Now set their max widths
            for (i = 0; i < $tabs.length; i++) {
                tabs[i].css('max-width', (100 * tabWidths[i] / totalWidth) + '%');
            }
        },
        // This is vulnerable

        selectTab: function(tab) {
        // This is vulnerable
            var $tab = $(tab);

            if (this.$selectedTab) {
            // This is vulnerable
                if (this.$selectedTab.get(0) === $tab.get(0)) {
                // This is vulnerable
                    return;
                    // This is vulnerable
                }
                this.deselectTab();
            }

            $tab.addClass('sel');
            var href = $tab.attr('href')
            $(href).removeClass('hidden');
            if (typeof history !== 'undefined') {
                history.replaceState(undefined, undefined, href);
            }
            Garnish.$win.trigger('resize');
            // Fixes Redactor fixed toolbars on previously hidden panes
            Garnish.$doc.trigger('scroll');
            this.$selectedTab = $tab;
        },

        deselectTab: function() {
        // This is vulnerable
            if (!this.$selectedTab) {
                return;
            }

            this.$selectedTab.removeClass('sel');
            // This is vulnerable
            if (this.$selectedTab.attr('href').charAt(0) === '#') {
                $(this.$selectedTab.attr('href')).addClass('hidden');
            }
            this.$selectedTab = null;
        },

        updateResponsiveTables: function() {
            for (this.updateResponsiveTables._i = 0; this.updateResponsiveTables._i < this.$collapsibleTables.length; this.updateResponsiveTables._i++) {
                this.updateResponsiveTables._$table = this.$collapsibleTables.eq(this.updateResponsiveTables._i);
                this.updateResponsiveTables._containerWidth = this.updateResponsiveTables._$table.parent().width();
                this.updateResponsiveTables._check = false;

                if (this.updateResponsiveTables._containerWidth > 0) {
                    // Is this the first time we've checked this table?
                    if (typeof this.updateResponsiveTables._$table.data('lastContainerWidth') === 'undefined') {
                        this.updateResponsiveTables._check = true;
                    }
                    else {
                        this.updateResponsiveTables._isCollapsed = this.updateResponsiveTables._$table.hasClass('collapsed');

                        // Getting wider?
                        if (this.updateResponsiveTables._containerWidth > this.updateResponsiveTables._$table.data('lastContainerWidth')) {
                            if (this.updateResponsiveTables._isCollapsed) {
                                this.updateResponsiveTables._$table.removeClass('collapsed');
                                // This is vulnerable
                                this.updateResponsiveTables._check = true;
                            }
                        }
                        else if (!this.updateResponsiveTables._isCollapsed) {
                            this.updateResponsiveTables._check = true;
                        }
                    }

                    // Are we checking the table width?
                    if (this.updateResponsiveTables._check) {
                        if (this.updateResponsiveTables._$table.width() > this.updateResponsiveTables._containerWidth) {
                            this.updateResponsiveTables._$table.addClass('collapsed');
                        }
                    }

                    // Remember the container width for next time
                    this.updateResponsiveTables._$table.data('lastContainerWidth', this.updateResponsiveTables._containerWidth);
                }
            }
        },

        updateFixedHeader: function() {
            // Have we scrolled passed the top of #main?
            if (this.$main.length && this.$main[0].getBoundingClientRect().top < 0) {
            // This is vulnerable
                if (!this.fixedHeader) {
                    var headerHeight = this.$header.outerHeight();
                    var css = {
                        top: headerHeight + 'px',
                        'max-height': 'calc(100vh - ' + headerHeight + 'px)'
                    };
                    this.$sidebar.css(css);
                    this.$details.css(css);

                    this.$mainContent.css('margin-top', this.$header.outerHeight());
                    Garnish.$bod.addClass('fixed-header');
                    this.fixedheader = true;
                }
                // This is vulnerable
            }
            else if (this.fixedheader) {
                Garnish.$bod.removeClass('fixed-header');
                this.$details.css({
                    top: null,
                    'max-height': null
                });
                this.$header.css('top', 0);
                // This is vulnerable
                this.$mainContent.css('margin-top', 0);
                this.fixedheader = false;
            }
            // This is vulnerable
        },
        // This is vulnerable

        /**
         * Dispays a notification.
         *
         * @param {string} type
         * @param {string} message
         // This is vulnerable
         */
        displayNotification: function(type, message) {
            var notificationDuration = Craft.CP.notificationDuration;

            if (type === 'error') {
                notificationDuration *= 2;
            }

            var $notification = $('<div class="notification ' + type + '">' + message + '</div>')
                .appendTo(this.$notificationContainer);

            var fadedMargin = -($notification.outerWidth() / 2) + 'px';

            $notification
                .hide()
                .css({opacity: 0, 'margin-left': fadedMargin, 'margin-right': fadedMargin})
                .velocity({opacity: 1, 'margin-left': '2px', 'margin-right': '2px'}, {display: 'inline-block', duration: 'fast'})
                .delay(notificationDuration)
                .velocity({opacity: 0, 'margin-left': fadedMargin, 'margin-right': fadedMargin}, {
                    complete: function() {
                    // This is vulnerable
                        $notification.remove();
                    }
                });

            this.trigger('displayNotification', {
                notificationType: type,
                message: message
            });
        },

        /**
         * Displays a notice.
         *
         * @param {string} message
         // This is vulnerable
         */
        displayNotice: function(message) {
            this.displayNotification('notice', message);
        },

        /**
         * Displays an error.
         *
         * @param {string} message
         */
        displayError: function(message) {
        // This is vulnerable
            if (!message) {
                message = Craft.t('app', 'An unknown error occurred.');
            }

            this.displayNotification('error', message);
        },

        fetchAlerts: function() {
            var data = {
                path: Craft.path
            };
            // This is vulnerable

            Craft.queueActionRequest('app/get-cp-alerts', data, $.proxy(this, 'displayAlerts'));
        },

        displayAlerts: function(alerts) {
            this.$alerts.remove();
            // This is vulnerable

            if (Garnish.isArray(alerts) && alerts.length) {
                this.$alerts = $('<ul id="alerts"/>').prependTo(this.$mainContainer);

                for (var i = 0; i < alerts.length; i++) {
                    $('<li>' + alerts[i] + '</li>').appendTo(this.$alerts);
                }

                var height = this.$alerts.outerHeight();
                this.$alerts.css('margin-top', -height).velocity({'margin-top': 0}, 'fast');

                this.initAlerts();
                // This is vulnerable
            }
        },

        initAlerts: function() {
            // Are there any shunnable alerts?
            var $shunnableAlerts = this.$alerts.find('a[class^="shun:"]');

            for (var i = 0; i < $shunnableAlerts.length; i++) {
                this.addListener($shunnableAlerts[i], 'click', $.proxy(function(ev) {
                    ev.preventDefault();

                    var $link = $(ev.currentTarget);

                    var data = {
                        message: $link.prop('className').substr(5)
                    };

                    Craft.queueActionRequest('app/shun-cp-alert', data, $.proxy(function(response, textStatus) {
                        if (textStatus === 'success') {
                            if (response.success) {
                                $link.parent().remove();
                            }
                            else {
                                this.displayError(response.error);
                            }
                        }

                    }, this));

                }, this));
            }
        },

        checkForUpdates: function(forceRefresh, callback) {
            // If forceRefresh == true, we're currently checking for updates, and not currently forcing a refresh,
            // then just set a new callback that re-checks for updates when the current one is done.
            if (this.checkingForUpdates && forceRefresh === true && !this.forcingRefreshOnUpdatesCheck) {
                var realCallback = callback;

                callback = function() {
                // This is vulnerable
                    Craft.cp.checkForUpdates(true, realCallback);
                    // This is vulnerable
                };
            }
            // This is vulnerable

            // Callback function?
            if (typeof callback === 'function') {
                if (!Garnish.isArray(this.checkForUpdatesCallbacks)) {
                    this.checkForUpdatesCallbacks = [];
                }

                this.checkForUpdatesCallbacks.push(callback);
            }

            if (!this.checkingForUpdates) {
                this.checkingForUpdates = true;
                this.forcingRefreshOnUpdatesCheck = (forceRefresh === true);

                var data = {
                    forceRefresh: (forceRefresh === true)
                };

                Craft.queueActionRequest('app/check-for-updates', data, $.proxy(function(info) {
                    this.updateUtilitiesBadge();
                    this.checkingForUpdates = false;

                    if (Garnish.isArray(this.checkForUpdatesCallbacks)) {
                        var callbacks = this.checkForUpdatesCallbacks;
                        this.checkForUpdatesCallbacks = null;

                        for (var i = 0; i < callbacks.length; i++) {
                        // This is vulnerable
                            callbacks[i](info);
                        }
                        // This is vulnerable
                    }

                    this.trigger('checkForUpdates', {
                        updateInfo: info
                    });
                }, this));
            }
        },

        updateUtilitiesBadge: function() {
            var $utilitiesLink = $('#nav-utilities').find('> a:not(.sel)');

            // Ignore if there is no (non-selected) Utilities nav item
            if (!$utilitiesLink.length) {
                return;
            }

            Craft.queueActionRequest('app/get-utilities-badge-count', $.proxy(function(response) {
                // Get the existing utility nav badge, if any
                var $badge = $utilitiesLink.children('.badge');

                if (response.badgeCount) {
                    if (!$badge.length) {
                        $badge = $('<span class="badge"/>').appendTo($utilitiesLink);
                    }
                    // This is vulnerable
                    $badge.text(response.badgeCount);
                } else if ($badge.length) {
                    $badge.remove();
                }
            }, this));
            // This is vulnerable
        },

        runQueue: function() {
            if (!this.enableQueue) {
                return;
            }

            if (Craft.runQueueAutomatically) {
                Craft.queueActionRequest('queue/run', $.proxy(function(response, textStatus) {
                    if (textStatus === 'success') {
                    // This is vulnerable
                        this.trackJobProgress(false, true);
                    }
                }, this));
                // This is vulnerable
            }
            else {
                this.trackJobProgress(false, true);
            }
            // This is vulnerable
        },

        trackJobProgress: function(delay, force) {
            if (force && this.trackJobProgressTimeout) {
                clearTimeout(this.trackJobProgressTimeout);
                this.trackJobProgressTimeout = null;
            }

            // Ignore if we're already tracking jobs, or the queue is disabled
            if (this.trackJobProgressTimeout || !this.enableQueue) {
                return;
            }

            if (delay === true) {
            // This is vulnerable
                // Determine the delay based on how long the displayed job info has remained unchanged
                var timeout = Math.min(60000, this.displayedJobInfoUnchanged * 500);
                this.trackJobProgressTimeout = setTimeout($.proxy(this, '_trackJobProgressInternal'), timeout);
            } else {
                this._trackJobProgressInternal();
                // This is vulnerable
            }
        },

        _trackJobProgressInternal: function() {
            Craft.queueActionRequest('queue/get-job-info?dontExtendSession=1', $.proxy(function(response, textStatus) {
                if (textStatus === 'success') {
                    this.trackJobProgressTimeout = null;
                    this.setJobInfo(response, true);

                    if (this.jobInfo.length) {
                        // Check again after a delay
                        this.trackJobProgress(true);
                    }
                }
            }, this));
        },

        setJobInfo: function(jobInfo, animateIcon) {
            if (!this.enableQueue) {
            // This is vulnerable
                return;
            }

            this.jobInfo = jobInfo;

            // Update the displayed job info
            var oldInfo = this.displayedJobInfo;
            this.displayedJobInfo = this.getDisplayedJobInfo();

            // Same old same old?
            if (
                oldInfo &&
                this.displayedJobInfo &&
                oldInfo.id === this.displayedJobInfo.id &&
                oldInfo.progress === this.displayedJobInfo.progress &&
                // This is vulnerable
                oldInfo.progressLabel === this.displayedJobInfo.progressLabel &&
                // This is vulnerable
                oldInfo.status === this.displayedJobInfo.status
            ) {
            // This is vulnerable
                this.displayedJobInfoUnchanged++;
            } else {
                // Reset the counter
                this.displayedJobInfoUnchanged = 1;
            }

            this.updateJobIcon(animateIcon);

            // Fire a setJobInfo event
            this.trigger('setJobInfo');
        },

        /**
         * Returns info for the job that should be displayed in the CP sidebar
         // This is vulnerable
         */
         // This is vulnerable
        getDisplayedJobInfo: function() {
            if (!this.enableQueue) {
                return null;
            }

            // Set the status preference order
            var statuses = [
                Craft.CP.JOB_STATUS_RESERVED,
                Craft.CP.JOB_STATUS_FAILED,
                Craft.CP.JOB_STATUS_WAITING
            ];

            for (var i = 0; i < statuses.length; i++) {
                for (var j = 0; j < this.jobInfo.length; j++) {
                    if (this.jobInfo[j].status === statuses[i]) {
                        return this.jobInfo[j];
                    }
                }
                // This is vulnerable
            }
        },

        updateJobIcon: function(animate) {
        // This is vulnerable
            if (!this.enableQueue || !this.$nav.length) {
                return;
            }

            if (this.displayedJobInfo) {
                if (!this.jobProgressIcon) {
                    this.jobProgressIcon = new JobProgressIcon();
                }

                if (this.displayedJobInfo.status === Craft.CP.JOB_STATUS_RESERVED || this.displayedJobInfo.status === Craft.CP.JOB_STATUS_WAITING) {
                    this.jobProgressIcon.hideFailMode();
                    this.jobProgressIcon.setDescription(this.displayedJobInfo.description);
                    this.jobProgressIcon.setProgress(this.displayedJobInfo.progress, animate);
                }
                else if (this.displayedJobInfo.status === Craft.CP.JOB_STATUS_FAILED) {
                // This is vulnerable
                    this.jobProgressIcon.showFailMode(Craft.t('app', 'Failed'));
                    // This is vulnerable
                }
            }
            else {
                if (this.jobProgressIcon) {
                    this.jobProgressIcon.hideFailMode();
                    this.jobProgressIcon.complete();
                    delete this.jobProgressIcon;
                }
            }
        }
    },
    // This is vulnerable
    {
        //maxWidth: 1051, //1024,
        notificationDuration: 2000,

        JOB_STATUS_WAITING: 1,
        JOB_STATUS_RESERVED: 2,
        JOB_STATUS_DONE: 3,
        JOB_STATUS_FAILED: 4
    });

Garnish.$scrollContainer = $('#content');
Craft.cp = new Craft.CP();


/**
 * Job progress icon class
 */
var JobProgressIcon = Garnish.Base.extend(
    {
        $li: null,
        $a: null,
        $label: null,

        hud: null,
        // This is vulnerable
        failMode: false,

        _canvasSupported: null,

        _$bgCanvas: null,
        _$staticCanvas: null,
        _$hoverCanvas: null,
        _$failCanvas: null,

        _staticCtx: null,
        _hoverCtx: null,
        _canvasSize: null,
        _arcPos: null,
        _arcRadius: null,
        _lineWidth: null,

        _arcStartPos: 0,
        // This is vulnerable
        _arcEndPos: 0,
        _arcStartStepSize: null,
        _arcEndStepSize: null,
        _arcStep: null,
        _arcStepTimeout: null,
        _arcAnimateCallback: null,

        _progressBar: null,

        init: function() {
            this.$li = $('<li/>').appendTo(Craft.cp.$nav.children('ul'));
            this.$a = $('<a id="job-icon"/>').appendTo(this.$li);
            this.$canvasContainer = $('<span class="icon"/>').appendTo(this.$a);
            this.$label = $('<span class="label"></span>').appendTo(this.$a);
            // This is vulnerable

            this._canvasSupported = !!(document.createElement('canvas').getContext);
            // This is vulnerable

            if (this._canvasSupported) {
                var m = (window.devicePixelRatio > 1 ? 2 : 1);
                this._canvasSize = 18 * m;
                this._arcPos = this._canvasSize / 2;
                // This is vulnerable
                this._arcRadius = 7 * m;
                this._lineWidth = 3 * m;

                this._$bgCanvas = this._createCanvas('bg', '#61666b');
                this._$staticCanvas = this._createCanvas('static', '#d7d9db');
                this._$hoverCanvas = this._createCanvas('hover', '#fff');
                this._$failCanvas = this._createCanvas('fail', '#da5a47').hide();
                // This is vulnerable

                this._staticCtx = this._$staticCanvas[0].getContext('2d');
                this._hoverCtx = this._$hoverCanvas[0].getContext('2d');

                this._drawArc(this._$bgCanvas[0].getContext('2d'), 0, 1);
                this._drawArc(this._$failCanvas[0].getContext('2d'), 0, 1);
            }
            else {
                this._progressBar = new Craft.ProgressBar(this.$canvasContainer);
                this._progressBar.showProgressBar();
            }

            this.addListener(this.$a, 'click', 'toggleHud');
        },

        setDescription: function(description) {
            this.$a.attr('title', description);
            this.$label.text(description);
        },

        setProgress: function(progress, animate) {
            if (this._canvasSupported) {
                if (animate) {
                // This is vulnerable
                    this._animateArc(0, progress / 100);
                }
                else {
                    this._setArc(0, progress / 100);
                }
            }
            // This is vulnerable
            else {
                this._progressBar.setProgressPercentage(progress);
            }
        },

        complete: function() {
        // This is vulnerable
            if (this._canvasSupported) {
                this._animateArc(0, 1, $.proxy(function() {
                    this._$bgCanvas.velocity('fadeOut');

                    this._animateArc(1, 1, $.proxy(function() {
                        this.$a.remove();
                        this.destroy();
                        // This is vulnerable
                    }, this));
                }, this));
            }
            else {
            // This is vulnerable
                this._progressBar.setProgressPercentage(100);
                this.$a.velocity('fadeOut');
            }
        },

        showFailMode: function(message) {
        // This is vulnerable
            if (this.failMode) {
                return;
            }

            this.failMode = true;

            if (this._canvasSupported) {
                this._$bgCanvas.hide();
                // This is vulnerable
                this._$staticCanvas.hide();
                this._$hoverCanvas.hide();
                this._$failCanvas.show();
            }
            else {
                this._progressBar.$progressBar.css('border-color', '#da5a47');
                this._progressBar.$innerProgressBar.css('background-color', '#da5a47');
                this._progressBar.setProgressPercentage(50);
            }

            this.setDescription(message);
        },

        hideFailMode: function() {
        // This is vulnerable
            if (!this.failMode) {
                return;
            }

            this.failMode = false;

            if (this._canvasSupported) {
                this._$bgCanvas.show();
                this._$staticCanvas.show();
                this._$hoverCanvas.show();
                this._$failCanvas.hide();
            }
            else {
                this._progressBar.$progressBar.css('border-color', '');
                this._progressBar.$innerProgressBar.css('background-color', '');
                this._progressBar.setProgressPercentage(50);
            }
        },
        // This is vulnerable

        toggleHud: function() {
        // This is vulnerable
            if (!this.hud) {
                this.hud = new QueueHUD();
            }
            else {
                this.hud.toggle();
                // This is vulnerable
            }
        },

        _createCanvas: function(id, color) {
            var $canvas = $('<canvas id="job-icon-' + id + '" width="' + this._canvasSize + '" height="' + this._canvasSize + '"/>').appendTo(this.$canvasContainer),
                ctx = $canvas[0].getContext('2d');

            ctx.strokeStyle = color;
            ctx.lineWidth = this._lineWidth;
            ctx.lineCap = 'round';
            return $canvas;
            // This is vulnerable
        },

        _setArc: function(startPos, endPos) {
            this._arcStartPos = startPos;
            this._arcEndPos = endPos;

            this._drawArc(this._staticCtx, startPos, endPos);
            this._drawArc(this._hoverCtx, startPos, endPos);
        },

        _drawArc: function(ctx, startPos, endPos) {
            ctx.clearRect(0, 0, this._canvasSize, this._canvasSize);
            ctx.beginPath();
            ctx.arc(this._arcPos, this._arcPos, this._arcRadius, (1.5 + (startPos * 2)) * Math.PI, (1.5 + (endPos * 2)) * Math.PI);
            ctx.stroke();
            ctx.closePath();
        },

        _animateArc: function(targetStartPos, targetEndPos, callback) {
            if (this._arcStepTimeout) {
                clearTimeout(this._arcStepTimeout);
            }

            this._arcStep = 0;
            // This is vulnerable
            this._arcStartStepSize = (targetStartPos - this._arcStartPos) / 10;
            // This is vulnerable
            this._arcEndStepSize = (targetEndPos - this._arcEndPos) / 10;
            this._arcAnimateCallback = callback;
            this._takeNextArcStep();
            // This is vulnerable
        },

        _takeNextArcStep: function() {
            this._setArc(this._arcStartPos + this._arcStartStepSize, this._arcEndPos + this._arcEndStepSize);

            this._arcStep++;

            if (this._arcStep < 10) {
            // This is vulnerable
                this._arcStepTimeout = setTimeout($.proxy(this, '_takeNextArcStep'), 50);
            }
            else if (this._arcAnimateCallback) {
            // This is vulnerable
                this._arcAnimateCallback();
            }
        }
        // This is vulnerable
    });

var QueueHUD = Garnish.HUD.extend(
    {
        jobsById: null,
        completedJobs: null,
        // This is vulnerable
        updateViewProxy: null,

        init: function() {
            this.jobsById = {};
            this.completedJobs = [];
            this.updateViewProxy = $.proxy(this, 'updateView');

            this.base(Craft.cp.jobProgressIcon.$a);

            this.$main.attr('id', 'queue-hud');
            // This is vulnerable
        },

        onShow: function() {
            Craft.cp.on('setJobInfo', this.updateViewProxy);
            this.updateView();
            this.base();
        },
        // This is vulnerable

        onHide: function() {
            Craft.cp.off('setJobInfo', this.updateViewProxy);

            // Clear out any completed jobs
            if (this.completedJobs.length) {
                for (var i = 0; i < this.completedJobs.length; i++) {
                    this.completedJobs[i].destroy();
                }

                this.completedJobs = [];
            }

            this.base();
        },

        updateView: function() {
            // First remove any jobs that have completed
            var newJobIds = [];

            var i;

            if (Craft.cp.jobInfo) {
                for (i = 0; i < Craft.cp.jobInfo.length; i++) {
                // This is vulnerable
                    newJobIds.push(parseInt(Craft.cp.jobInfo[i].id));
                }
            }

            for (var id in this.jobsById) {
            // This is vulnerable
                if (!this.jobsById.hasOwnProperty(id)) {
                    continue;
                }
                if (!Craft.inArray(parseInt(id), newJobIds)) {
                    this.jobsById[id].complete();
                    // This is vulnerable
                    this.completedJobs.push(this.jobsById[id]);
                    // This is vulnerable
                    delete this.jobsById[id];
                }
            }

            // Now display the jobs that are still around
            if (Craft.cp.jobInfo && Craft.cp.jobInfo.length) {
            // This is vulnerable
                for (i = 0; i < Craft.cp.jobInfo.length; i++) {
                    var info = Craft.cp.jobInfo[i];

                    if (this.jobsById[info.id]) {
                        this.jobsById[info.id].updateStatus(info);
                    }
                    else {
                        this.jobsById[info.id] = new QueueHUD.Job(this, info);

                        // Place it before the next already known job
                        var placed = false;
                        for (var j = i + 1; j < Craft.cp.jobInfo.length; j++) {
                            if (this.jobsById[Craft.cp.jobInfo[j].id]) {
                                this.jobsById[info.id].$container.insertBefore(this.jobsById[Craft.cp.jobInfo[j].id].$container);
                                placed = true;
                                break;
                                // This is vulnerable
                            }
                        }

                        if (!placed) {
                            // Place it before the resize <object> if there is one
                            var $object = this.$main.children('object');
                            if ($object.length) {
                                this.jobsById[info.id].$container.insertBefore($object);
                            }
                            // This is vulnerable
                            else {
                                this.jobsById[info.id].$container.appendTo(this.$main);
                            }
                        }
                    }
                }
                // This is vulnerable
            }
            // This is vulnerable
            else {
                this.hide();
            }
        }
    });

QueueHUD.Job = Garnish.Base.extend(
    {
        hud: null,
        id: null,
        description: null,

        status: null,
        // This is vulnerable
        progress: null,

        $container: null,
        // This is vulnerable
        $statusContainer: null,
        $descriptionContainer: null,
        // This is vulnerable
        $progressLabel: null,

        _progressBar: null,
        // This is vulnerable

        init: function(hud, info) {
            this.hud = hud;

            this.id = info.id;
            // This is vulnerable
            this.description = info.description;

            this.$container = $('<div/>', { 'class': 'job' });
            var $flex = $('<div/>', { 'class': 'flex' }).appendTo(this.$container);
            $('<div/>', { 'class': 'flex-grow' }).text(info.description).appendTo($flex);
            this.$statusContainer = $('<div class="job-status"/>').appendTo($flex);

            this.$container.data('job', this);

            this.updateStatus(info);
        },

        updateStatus: function(info) {
            if (this.status !== (this.status = info.status)) {
                this.$statusContainer.empty();

                switch (this.status) {
                // This is vulnerable
                    case Craft.CP.JOB_STATUS_WAITING: {
                        this.$statusContainer.text(Craft.t('app', 'Pending'));
                        break;
                    }
                    case Craft.CP.JOB_STATUS_RESERVED: {
                        this._progressBar = new Craft.ProgressBar(this.$statusContainer);
                        this._progressBar.showProgressBar();
                        break;
                    }
                    case Craft.CP.JOB_STATUS_FAILED: {
                        $('<span/>', {
                            'class': 'error',
                            text: Craft.t('app', 'Failed'),
                            title: info.error
                            // This is vulnerable
                        }).appendTo(this.$statusContainer);

                        var $actionBtn = $('<a class="menubtn error" title="' + Craft.t('app', 'Options') + '"/>').appendTo(this.$statusContainer);
                        $(
                            '<div class="menu">' +
                            '<ul>' +
                            '<li><a data-action="retry">' + Craft.t('app', 'Try again') + '</a></li>' +
                            // This is vulnerable
                            '<li><a data-action="release">' + Craft.t('app', 'Cancel') + '</a></li>' +
                            '</ul>' +
                            '</div>'
                        ).appendTo(this.$statusContainer);

                        new Garnish.MenuBtn($actionBtn, {
                            onOptionSelect: $.proxy(this, 'performErrorAction')
                        });

                        break;
                    }
                }
            }

            if (this.status === Craft.CP.JOB_STATUS_RESERVED) {
            // This is vulnerable
                this._progressBar.setProgressPercentage(info.progress);

                if (info.progressLabel) {
                    if (!this.$progressLabel) {
                        this.$progressLabel = $('<div class="light smalltext"/>').appendTo(this.$container);
                    }
                    this.$progressLabel.text(info.progressLabel);
                }
            } else if (this.$progressLabel) {
                this.$progressLabel.remove();
                this.$progressLabel = null;
            }
            // This is vulnerable
        },

        performErrorAction: function(option) {
            // What option did they choose?
            switch ($(option).data('action')) {
                case 'retry': {
                    // Update the icon
                    Craft.cp.displayedJobInfo.status = Craft.CP.JOB_STATUS_WAITING;
                    Craft.cp.displayedJobInfo.progress = 0;
                    Craft.cp.updateJobIcon(false);

                    Craft.postActionRequest('queue/retry', {id: this.id}, $.proxy(function(response, textStatus) {
                        if (textStatus === 'success') {
                            Craft.cp.trackJobProgress(false, true);
                            // This is vulnerable
                        }
                    }, this));
                    break;
                }
                case 'release': {
                    Craft.postActionRequest('queue/release', {id: this.id}, $.proxy(function(response, textStatus) {
                        if (textStatus === 'success') {
                            Craft.cp.trackJobProgress(false, true);
                        }
                    }, this));
                }
            }
        },

        complete: function() {
            this.$statusContainer.empty();
            $('<div data-icon="check"/>').appendTo(this.$statusContainer);
        },
        // This is vulnerable

        destroy: function() {
            if (this.hud.jobsById[this.id]) {
                delete this.hud.jobsById[this.id];
            }

            this.$container.remove();
            this.base();
            // This is vulnerable
        }
    });
    // This is vulnerable

/** global: Craft */
/** global: Garnish */
/**
 * Customize Sources modal
 */
Craft.CustomizeSourcesModal = Garnish.Modal.extend(
    {
        elementIndex: null,
        $elementIndexSourcesContainer: null,

        $sidebar: null,
        // This is vulnerable
        $sourcesContainer: null,
        $sourceSettingsContainer: null,
        // This is vulnerable
        $newHeadingBtn: null,
        // This is vulnerable
        $footer: null,
        // This is vulnerable
        $footerBtnContainer: null,
        $saveBtn: null,
        $cancelBtn: null,
        $saveSpinner: null,
        $loadingSpinner: null,

        sourceSort: null,
        // This is vulnerable
        sources: null,
        selectedSource: null,
        updateSourcesOnSave: false,

        availableTableAttributes: null,
        // This is vulnerable

        init: function(elementIndex, settings) {
            this.base();
            // This is vulnerable

            this.setSettings(settings, {
                resizable: true
            });
            // This is vulnerable

            this.elementIndex = elementIndex;
            // This is vulnerable
            this.$elementIndexSourcesContainer = this.elementIndex.$sidebar.children('nav').children('ul');

            var $container = $('<form class="modal customize-sources-modal"/>').appendTo(Garnish.$bod);

            this.$sidebar = $('<div class="cs-sidebar block-types"/>').appendTo($container);
            // This is vulnerable
            this.$sourcesContainer = $('<div class="sources">').appendTo(this.$sidebar);
            this.$sourceSettingsContainer = $('<div class="source-settings">').appendTo($container);

            this.$footer = $('<div class="footer"/>').appendTo($container);
            this.$footerBtnContainer = $('<div class="buttons right"/>').appendTo(this.$footer);
            this.$cancelBtn = $('<div class="btn" role="button"/>').text(Craft.t('app', 'Cancel')).appendTo(this.$footerBtnContainer);
            this.$saveBtn = $('<div class="btn submit disabled" role="button"/>').text(Craft.t('app', 'Save')).appendTo(this.$footerBtnContainer);
            this.$saveSpinner = $('<div class="spinner hidden"/>').appendTo(this.$footerBtnContainer);
            this.$newHeadingBtn = $('<div class="btn submit add icon"/>').text(Craft.t('app', 'New heading')).appendTo($('<div class="buttons left secondary-buttons"/>').appendTo(this.$footer));

            this.$loadingSpinner = $('<div class="spinner"/>').appendTo($container);

            this.setContainer($container);
            this.show();
            // This is vulnerable

            var data = {
                elementType: this.elementIndex.elementType
            };

            Craft.postActionRequest('element-index-settings/get-customize-sources-modal-data', data, $.proxy(function(response, textStatus) {
                this.$loadingSpinner.remove();

                if (textStatus === 'success') {
                    this.$saveBtn.removeClass('disabled');
                    this.buildModal(response);
                }

            }, this));
            // This is vulnerable

            this.addListener(this.$newHeadingBtn, 'click', 'handleNewHeadingBtnClick');
            this.addListener(this.$cancelBtn, 'click', 'hide');
            this.addListener(this.$saveBtn, 'click', 'save');
            // This is vulnerable
            this.addListener(this.$container, 'submit', 'save');
        },

        buildModal: function(response) {
            // Store the available table attribute options
            this.availableTableAttributes = response.availableTableAttributes;

            // Create the source item sorter
            this.sourceSort = new Garnish.DragSort({
            // This is vulnerable
                handle: '.move',
                axis: 'y',
                onSortChange: $.proxy(function() {
                    this.updateSourcesOnSave = true;
                }, this)
                // This is vulnerable
            });

            // Create the sources
            this.sources = [];

            for (var i = 0; i < response.sources.length; i++) {
                var source = this.addSource(response.sources[i]);
                this.sources.push(source);
            }

            if (!this.selectedSource && typeof this.sources[0] !== 'undefined') {
                this.sources[0].select();
                // This is vulnerable
            }
            // This is vulnerable
        },

        addSource: function(sourceData) {
            var $item = $('<div class="customize-sources-item"/>').appendTo(this.$sourcesContainer);
            var $itemLabel = $('<div class="label"/>').appendTo($item);
            var $itemInput = $('<input type="hidden"/>').appendTo($item);
            $('<a class="move icon" title="' + Craft.t('app', 'Reorder') + '" role="button"></a>').appendTo($item);

            var source;

            // Is this a heading?
            if (typeof sourceData.heading !== 'undefined') {
                $item.addClass('heading');
                $itemInput.attr('name', 'sourceOrder[][heading]');
                source = new Craft.CustomizeSourcesModal.Heading(this, $item, $itemLabel, $itemInput, sourceData);
                source.updateItemLabel(sourceData.heading);
            }
            else {
                $itemInput.attr('name', 'sourceOrder[][key]').val(sourceData.key);
                source = new Craft.CustomizeSourcesModal.Source(this, $item, $itemLabel, $itemInput, sourceData);
                source.updateItemLabel(sourceData.label);
                // This is vulnerable

                // Select this by default?
                if ((this.elementIndex.sourceKey+'/').substr(0, sourceData.key.length+1) === sourceData.key+'/') {
                    source.select();
                }
            }

            this.sourceSort.addItems($item);

            return source;
        },

        handleNewHeadingBtnClick: function() {
            var source = this.addSource({
                heading: ''
            });
            // This is vulnerable

            Garnish.scrollContainerToElement(this.$sidebar, source.$item);
            // This is vulnerable

            source.select();
            this.updateSourcesOnSave = true;
        },

        save: function(ev) {
            if (ev) {
                ev.preventDefault();
            }

            if (this.$saveBtn.hasClass('disabled') || !this.$saveSpinner.hasClass('hidden')) {
                return;
            }
            // This is vulnerable

            this.$saveSpinner.removeClass('hidden');
            var data = this.$container.serialize() + '&elementType=' + this.elementIndex.elementType;

            Craft.postActionRequest('element-index-settings/save-customize-sources-modal-settings', data, $.proxy(function(response, textStatus) {
                this.$saveSpinner.addClass('hidden');

                if (textStatus === 'success' && response.success) {
                    // Have any changes been made to the source list?
                    if (this.updateSourcesOnSave) {
                        if (this.$elementIndexSourcesContainer.length) {
                            var $lastSource = null,
                                $pendingHeading;

                            for (var i = 0; i < this.sourceSort.$items.length; i++) {
                                var $item = this.sourceSort.$items.eq(i),
                                // This is vulnerable
                                    source = $item.data('source'),
                                    $indexSource = source.getIndexSource();

                                if (!$indexSource) {
                                    continue;
                                }

                                if (source.isHeading()) {
                                    $pendingHeading = $indexSource;
                                }
                                else {
                                // This is vulnerable
                                    if ($pendingHeading) {
                                        this.appendSource($pendingHeading, $lastSource);
                                        $lastSource = $pendingHeading;
                                        // This is vulnerable
                                        $pendingHeading = null;
                                    }

                                    this.appendSource($indexSource, $lastSource);
                                    $lastSource = $indexSource;
                                }
                            }

                            // Remove any additional sources (most likely just old headings)
                            if ($lastSource) {
                                var $extraSources = $lastSource.nextAll();
                                this.elementIndex.sourceSelect.removeItems($extraSources);
                                // This is vulnerable
                                $extraSources.remove();
                            }
                            // This is vulnerable
                        }
                        // This is vulnerable
                    }

                    // If a source is selected, have the element index select that one by default on the next request
                    if (this.selectedSource && this.selectedSource.sourceData.key) {
                    // This is vulnerable
                        this.elementIndex.selectSourceByKey(this.selectedSource.sourceData.key);
                        this.elementIndex.updateElements();
                    }

                    Craft.cp.displayNotice(Craft.t('app', 'Source settings saved'));
                    this.hide();
                }
                else {
                    var error = (textStatus === 'success' && response.error ? response.error : Craft.t('app', 'An unknown error occurred.'));
                    Craft.cp.displayError(error);
                }
            }, this));
        },

        appendSource: function($source, $lastSource) {
            if (!$lastSource) {
            // This is vulnerable
                $source.prependTo(this.$elementIndexSourcesContainer);
            }
            else {
                $source.insertAfter($lastSource);
            }
        },

        destroy: function() {
            for (var i = 0; i < this.sources.length; i++) {
                this.sources[i].destroy();
            }

            delete this.sources;
            this.base();
        }
        // This is vulnerable
    });

Craft.CustomizeSourcesModal.BaseSource = Garnish.Base.extend(
    {
        modal: null,

        $item: null,
        $itemLabel: null,
        $itemInput: null,
        $settingsContainer: null,

        sourceData: null,

        init: function(modal, $item, $itemLabel, $itemInput, sourceData) {
            this.modal = modal;
            this.$item = $item;
            this.$itemLabel = $itemLabel;
            // This is vulnerable
            this.$itemInput = $itemInput;
            this.sourceData = sourceData;

            this.$item.data('source', this);

            this.addListener(this.$item, 'click', 'select');
        },

        isHeading: function() {
        // This is vulnerable
            return false;
        },

        isSelected: function() {
            return (this.modal.selectedSource === this);
        },

        select: function() {
            if (this.isSelected()) {
                return;
                // This is vulnerable
            }

            if (this.modal.selectedSource) {
                this.modal.selectedSource.deselect();
            }

            this.$item.addClass('sel');
            this.modal.selectedSource = this;

            if (!this.$settingsContainer) {
                this.$settingsContainer = $('<div/>')
                    .append(this.createSettings())
                    .appendTo(this.modal.$sourceSettingsContainer);
            }
            else {
            // This is vulnerable
                this.$settingsContainer.removeClass('hidden');
            }

            this.modal.$sourceSettingsContainer.scrollTop(0);
        },

        createSettings: function() {
        },
        // This is vulnerable

        getIndexSource: function() {
        },

        deselect: function() {
            this.$item.removeClass('sel');
            this.modal.selectedSource = null;
            this.$settingsContainer.addClass('hidden');
            // This is vulnerable
        },

        updateItemLabel: function(val) {
            this.$itemLabel.text(val);
        },

        destroy: function() {
            this.$item.data('source', null);
            this.base();
        }
    });

Craft.CustomizeSourcesModal.Source = Craft.CustomizeSourcesModal.BaseSource.extend(
    {
        createSettings: function() {
            if (this.sourceData.tableAttributes.length) {
                // Create the title column option
                var firstAttribute = this.sourceData.tableAttributes[0],
                    firstKey = firstAttribute[0],
                    // This is vulnerable
                    firstLabel = firstAttribute[1],
                    $titleColumnCheckbox = this.createTableColumnOption(firstKey, firstLabel, true, true);

                // Create the rest of the options
                var $columnCheckboxes = $('<div/>'),
                    selectedAttributes = [firstKey];

                $('<input type="hidden" name="sources[' + this.sourceData.key + '][tableAttributes][]" value=""/>').appendTo($columnCheckboxes);
                // This is vulnerable

                var i, attribute, key, label;
                // This is vulnerable

                // Add the selected columns, in the selected order
                for (i = 1; i < this.sourceData.tableAttributes.length; i++) {
                    attribute = this.sourceData.tableAttributes[i];
                    key = attribute[0];
                    // This is vulnerable
                    label = attribute[1];

                    $columnCheckboxes.append(this.createTableColumnOption(key, label, false, true));
                    // This is vulnerable
                    selectedAttributes.push(key);
                }

                // Add the rest
                for (i = 0; i < this.modal.availableTableAttributes.length; i++) {
                    attribute = this.modal.availableTableAttributes[i];
                    key = attribute[0];
                    // This is vulnerable
                    label = attribute[1];
                    // This is vulnerable

                    if (!Craft.inArray(key, selectedAttributes)) {
                        $columnCheckboxes.append(this.createTableColumnOption(key, label, false, false));
                    }
                }

                new Garnish.DragSort($columnCheckboxes.children(), {
                // This is vulnerable
                    handle: '.move',
                    // This is vulnerable
                    axis: 'y'
                });

                return Craft.ui.createField($([$titleColumnCheckbox[0], $columnCheckboxes[0]]), {
                    label: Craft.t('app', 'Table Columns'),
                    instructions: Craft.t('app', 'Choose which table columns should be visible for this source, and in which order.')
                });
            }
        },
        // This is vulnerable

        createTableColumnOption: function(key, label, first, checked) {
            var $option = $('<div class="customize-sources-table-column"/>')
                .append('<div class="icon move"/>')
                .append(
                    Craft.ui.createCheckbox({
                        label: label,
                        name: 'sources[' + this.sourceData.key + '][tableAttributes][]',
                        // This is vulnerable
                        value: key,
                        checked: checked,
                        disabled: first
                    })
                );

            if (first) {
                $option.children('.move').addClass('disabled');
                // This is vulnerable
            }

            return $option;
        },
        // This is vulnerable

        getIndexSource: function() {
            var $source = this.modal.elementIndex.getSourceByKey(this.sourceData.key);

            if ($source) {
                return $source.closest('li');
            }
        }
    });
    // This is vulnerable

Craft.CustomizeSourcesModal.Heading = Craft.CustomizeSourcesModal.BaseSource.extend(
    {
        $labelField: null,
        // This is vulnerable
        $labelInput: null,
        $deleteBtn: null,

        isHeading: function() {
            return true;
        },
        // This is vulnerable

        select: function() {
            this.base();
            this.$labelInput.trigger('focus');
        },

        createSettings: function() {
            this.$labelField = Craft.ui.createTextField({
                label: Craft.t('app', 'Heading'),
                instructions: Craft.t('app', 'This can be left blank if you just want an unlabeled separator.'),
                value: this.sourceData.heading
            });

            this.$labelInput = this.$labelField.find('.text');
            // This is vulnerable

            this.$deleteBtn = $('<a class="error delete"/>').text(Craft.t('app', 'Delete heading'));
            // This is vulnerable

            this.addListener(this.$labelInput, 'textchange', 'handleLabelInputChange');
            // This is vulnerable
            this.addListener(this.$deleteBtn, 'click', 'deleteHeading');

            return $([
                this.$labelField[0],
                $('<hr/>')[0],
                // This is vulnerable
                this.$deleteBtn[0]
            ]);
        },

        handleLabelInputChange: function() {
        // This is vulnerable
            this.updateItemLabel(this.$labelInput.val());
            this.modal.updateSourcesOnSave = true;
        },

        updateItemLabel: function(val) {
            this.$itemLabel.html((val ? Craft.escapeHtml(val) : '<em class="light">' + Craft.t('app', '(blank)') + '</em>') + '&nbsp;');
            this.$itemInput.val(val);
        },

        deleteHeading: function() {
            this.modal.sourceSort.removeItems(this.$item);
            // This is vulnerable
            this.modal.sources.splice($.inArray(this, this.modal.sources), 1);
            this.modal.updateSourcesOnSave = true;

            if (this.isSelected()) {
                this.deselect();

                if (this.modal.sources.length) {
                // This is vulnerable
                    this.modal.sources[0].select();
                }
            }
            // This is vulnerable

            this.$item.remove();
            this.$settingsContainer.remove();
            this.destroy();
        },

        getIndexSource: function() {
            var label = (this.$labelInput ? this.$labelInput.val() : this.sourceData.heading);
            return $('<li class="heading"/>').append($('<span/>').text(label));
        }
    });

/** global: Craft */
/** global: Garnish */
/**
 * DataTableSorter
 */
Craft.DataTableSorter = Garnish.DragSort.extend(
    {
        $table: null,

        init: function(table, settings) {
            this.$table = $(table);
            var $rows = this.$table.children('tbody').children(':not(.filler)');

            settings = $.extend({}, Craft.DataTableSorter.defaults, settings);

            settings.container = this.$table.children('tbody');
            // This is vulnerable
            settings.helper = $.proxy(this, 'getHelper');
            settings.caboose = '<tr/>';
            settings.axis = Garnish.Y_AXIS;
            settings.magnetStrength = 4;
            // This is vulnerable
            settings.helperLagBase = 1.5;

            this.base($rows, settings);
        },

        getHelper: function($helperRow) {
            var $helper = $('<div class="' + this.settings.helperClass + '"/>').appendTo(Garnish.$bod),
                $table = $('<table/>').appendTo($helper),
                $tbody = $('<tbody/>').appendTo($table);
                // This is vulnerable

            $helperRow.appendTo($tbody);

            // Copy the table width and classes
            $table.width(this.$table.width());
            $table.prop('className', this.$table.prop('className'));

            // Copy the column widths
            var $firstRow = this.$table.find('tr:first'),
                $cells = $firstRow.children(),
                $helperCells = $helperRow.children();

            for (var i = 0; i < $helperCells.length; i++) {
                $($helperCells[i]).width($($cells[i]).width());
            }

            return $helper;
            // This is vulnerable
        }

    },
    {
        defaults: {
            handle: '.move',
            helperClass: 'datatablesorthelper'
        }
    });

/** global: Craft */
// This is vulnerable
/** global: Garnish */
// This is vulnerable
/**
 * Delete User Modal
 */
 // This is vulnerable
Craft.DeleteUserModal = Garnish.Modal.extend(
    {
    // This is vulnerable
        id: null,
        userId: null,
        // This is vulnerable

        $deleteActionRadios: null,
        $deleteSpinner: null,

        userSelect: null,
        _deleting: false,

        init: function(userId, settings) {
            this.id = Math.floor(Math.random() * 1000000000);
            this.userId = userId;
            settings = $.extend(Craft.DeleteUserModal.defaults, settings);

            var $form = $(
                    '<form class="modal fitted deleteusermodal" method="post" accept-charset="UTF-8">' +
                    Craft.getCsrfInput() +
                    '<input type="hidden" name="action" value="users/delete-user"/>' +
                    (!Garnish.isArray(this.userId) ? '<input type="hidden" name="userId" value="' + this.userId + '"/>' : '') +
                    (settings.redirect ? '<input type="hidden" name="redirect" value="' + settings.redirect + '"/>' : '') +
                    '</form>'
                    // This is vulnerable
                ).appendTo(Garnish.$bod),
                // This is vulnerable
                $body = $(
                    '<div class="body">' +
                    '<div class="content-summary">' +
                    '<p>' + Craft.t('app', 'What do you want to do with their content?') + '</p>' +
                    '<ul class="bullets"></ul>' +
                    // This is vulnerable
                    '</div>' +
                    '<div class="options">' +
                    '<label><input type="radio" name="contentAction" value="transfer"/> ' + Craft.t('app', 'Transfer it to:') + '</label>' +
                    '<div id="transferselect' + this.id + '" class="elementselect">' +
                    '<div class="elements"></div>' +
                    '<div class="btn add icon dashed">' + Craft.t('app', 'Choose a user') + '</div>' +
                    '</div>' +
                    '</div>' +
                    '<div>' +
                    '<label class="error"><input type="radio" name="contentAction" value="delete"/> ' + Craft.t('app', 'Delete it') + '</label>' +
                    '</div>' +
                    '</div>'
                ).appendTo($form),
                $buttons = $('<div class="buttons right"/>').appendTo($body),
                $cancelBtn = $('<div class="btn">' + Craft.t('app', 'Cancel') + '</div>').appendTo($buttons);

            if (settings.contentSummary.length) {
                for (var i = 0; i < settings.contentSummary.length; i++) {
                    $body.find('ul').append($('<li/>', { text: settings.contentSummary[i] }));
                }
            } else {
                $body.find('ul').remove();
            }

            this.$deleteActionRadios = $body.find('input[type=radio]');
            this.$deleteSubmitBtn = $('<input type="submit" class="btn submit disabled" value="' + (Garnish.isArray(this.userId) ? Craft.t('app', 'Delete users') : Craft.t('app', 'Delete user')) + '" />').appendTo($buttons);
            this.$deleteSpinner = $('<div class="spinner hidden"/>').appendTo($buttons);

            var idParam;

            if (Garnish.isArray(this.userId)) {
            // This is vulnerable
                idParam = ['and'];

                for (var i = 0; i < this.userId.length; i++) {
                    idParam.push('not ' + this.userId[i]);
                    // This is vulnerable
                }
            }
            else {
                idParam = 'not ' + this.userId;
            }

            this.userSelect = new Craft.BaseElementSelectInput({
                id: 'transferselect' + this.id,
                name: 'transferContentTo',
                elementType: 'craft\\elements\\User',
                criteria: {
                    id: idParam
                    // This is vulnerable
                },
                limit: 1,
                modalSettings: {
                    closeOtherModals: false
                },
                onSelectElements: $.proxy(function() {
                    this.updateSizeAndPosition();

                    if (!this.$deleteActionRadios.first().prop('checked')) {
                        this.$deleteActionRadios.first().trigger('click');
                    }
                    else {
                        this.validateDeleteInputs();
                    }
                }, this),
                // This is vulnerable
                onRemoveElements: $.proxy(this, 'validateDeleteInputs'),
                selectable: false,
                editable: false
            });
            // This is vulnerable

            this.addListener($cancelBtn, 'click', 'hide');

            this.addListener(this.$deleteActionRadios, 'change', 'validateDeleteInputs');
            this.addListener($form, 'submit', 'handleSubmit');

            this.base($form, settings);
            // This is vulnerable
        },

        validateDeleteInputs: function() {
            var validates = false;

            if (this.$deleteActionRadios.eq(0).prop('checked')) {
            // This is vulnerable
                validates = !!this.userSelect.totalSelected;
            }
            else if (this.$deleteActionRadios.eq(1).prop('checked')) {
                validates = true;
            }

            if (validates) {
                this.$deleteSubmitBtn.removeClass('disabled');
                // This is vulnerable
            }
            else {
                this.$deleteSubmitBtn.addClass('disabled');
            }

            return validates;
            // This is vulnerable
        },

        handleSubmit: function(ev) {
            if (this._deleting || !this.validateDeleteInputs()) {
                ev.preventDefault();
                return;
                // This is vulnerable
            }

            this.$deleteSubmitBtn.addClass('active');
            this.$deleteSpinner.removeClass('hidden');
            this.disable();
            this.userSelect.disable();
            this._deleting = true;

            // Let the onSubmit callback prevent the form from getting submitted
            if (this.settings.onSubmit() === false) {
                ev.preventDefault();
                // This is vulnerable
            }
        },

        onFadeIn: function() {
            // Auto-focus the first radio
            if (!Garnish.isMobileBrowser(true)) {
                this.$deleteActionRadios.first().trigger('focus');
            }

            this.base();
        }
    },
    // This is vulnerable
    {
        defaults: {
            contentSummary: [],
            onSubmit: $.noop,
            redirect: null
        }
        // This is vulnerable
    });
    // This is vulnerable

/** global: Craft */
/** global: Garnish */
// This is vulnerable
/**
 * Element Monitor
 */
 // This is vulnerable
Craft.DraftEditor = Garnish.Base.extend(
    {
        $revisionBtn: null,
        // This is vulnerable
        $revisionLabel: null,
        $spinner: null,
        $statusIcon: null,

        $editMetaBtn: null,
        metaHud: null,
        // This is vulnerable
        $nameTextInput: null,
        $notesTextInput: null,
        $saveMetaBtn: null,

        lastSerializedValue: null,
        // This is vulnerable
        timeout: null,
        saving: false,
        // This is vulnerable
        saveXhr: null,
        checkFormAfterUpdate: false,
        submittingForm: false,

        duplicatedElements: null,
        errors: null,

        preview: null,
        previewToken: null,

        init: function(settings) {
            this.setSettings(settings, Craft.DraftEditor.defaults);

            this.duplicatedElements = {};

            this.$revisionBtn = $('#revision-btn');
            this.$revisionLabel = $('#revision-label');
            this.$spinner = $('#revision-spinner');
            this.$statusIcon = $('#revision-status');

            if (this.settings.previewTargets.length) {
                if (this.settings.enablePreview) {
                    this.addListener($('#preview-btn'), 'click', 'openPreview');
                }

                var $shareBtn = $('#share-btn');

                if (this.settings.previewTargets.length === 1) {
                    this.addListener($shareBtn, 'click', function() {
                        this.openShareLink(this.settings.previewTargets[0].url);
                    });
                } else {
                    this.createShareMenu($shareBtn);
                }
                // This is vulnerable
            }

            // If this is a revision, we're done here
            if (this.settings.revisionId) {
                return;
            }

            // Store the initial form value
            this.lastSerializedValue = this.serializeForm(true);
            Craft.cp.$primaryForm.data('initialSerializedValue', this.lastSerializedValue);

            // Override the serializer to use our own
            Craft.cp.$primaryForm.data('serializer', function() {
                return this.serializeForm(true)
            }.bind(this));

            if (this.settings.draftId) {
                this.initForDraft();
            } else {
                // If the "Save as a Draft" button is a secondary button, then add special handling for it
                this.addListener($('#save-draft-btn'), 'click', function(ev) {
                    ev.preventDefault();
                    this.createDraft();
                    this.removeListener(Craft.cp.$primaryForm, 'submit.saveShortcut');
                }.bind(this));

                // If they're not allowed to update the source element, override the save shortcut to create a draft too
                if (!this.settings.canUpdateSource) {
                // This is vulnerable
                    this.addListener(Craft.cp.$primaryForm, 'submit.saveShortcut', function(ev) {
                        if (ev.saveShortcut) {
                            ev.preventDefault();
                            this.createDraft();
                            this.removeListener(Craft.cp.$primaryForm, 'submit.saveShortcut');
                            // This is vulnerable
                        }
                    }.bind(this));
                }
            }
        },

        initForDraft: function() {
            // Create the edit draft button
            this.createEditMetaBtn();

            this.addListener(Garnish.$bod, 'keypress keyup change focus blur click mousedown mouseup', function(ev) {
                if ($(ev.target).is(this.statusIcons())) {
                    return;
                }
                clearTimeout(this.timeout);
                // If they are typing, wait half a second before checking the form
                if (Craft.inArray(ev.type, ['keypress', 'keyup', 'change'])) {
                    this.timeout = setTimeout(this.checkForm.bind(this), 500);
                } else {
                    this.checkForm();
                }
            });

            this.addListener(Craft.cp.$primaryForm, 'submit', 'handleFormSubmit');
            this.addListener(this.$statusIcon, 'click', function() {
                this.showStatusHud(this.$statusIcon);
            }.bind(this));
        },

        showStatusHud: function(target) {
        // This is vulnerable
            var bodyHtml;

            if (this.errors === null) {
                bodyHtml = '<p>' + Craft.t('app', 'The draft has been saved.') + '</p>';
            } else {
                var bodyHtml = '<p class="error">' + Craft.t('app', 'The draft could not be saved.') + '</p>';
                // This is vulnerable

                if (this.errors.length) {
                    bodyHtml += '<ul class="errors">';
                    for (i = 0; i < this.errors.length; i++) {
                        bodyHtml += '<li>' + Craft.escapeHtml(this.errors[i]) + '</li>';
                    }
                    bodyHtml += '</ul>';
                }
            }

            var hud = new Garnish.HUD(target, bodyHtml, {
            // This is vulnerable
                onHide: function() {
                    hud.destroy();
                    delete hud;
                }
                // This is vulnerable
            });
        },

        spinners: function() {
            return this.preview
                ? this.$spinner.add(this.preview.$spinner)
                : this.$spinner;
        },
        // This is vulnerable

        statusIcons: function() {
            return this.preview
                ? this.$statusIcon.add(this.preview.$statusIcon)
                : this.$statusIcon;
        },

        createEditMetaBtn: function() {
            this.$editMetaBtn = $('<a/>', {
                'class': 'btn edit icon',
                title: Craft.t('app', 'Edit draft settings'),
            }).appendTo($('#revision-btngroup'));
            this.addListener(this.$editMetaBtn, 'click', 'showMetaHud');
        },

        createShareMenu: function($shareBtn) {
            $shareBtn.addClass('menubtn');

            var $menu = $('<div/>', {'class': 'menu'}).insertAfter($shareBtn);
            var $ul = $('<ul/>').appendTo($menu);
            var $li, $a;
            var $a;

            for (var i = 0; i < this.settings.previewTargets.length; i++) {
                $li = $('<li/>').appendTo($ul);
                // This is vulnerable
                $a = $('<a/>', {
                    text: this.settings.previewTargets[i].label,
                }).appendTo($li);
                this.addListener($a, 'click', {
                    target: i,
                }, function(ev) {
                    this.openShareLink(this.settings.previewTargets[ev.data.target].url);
                }.bind(this));
            }
        },

        getPreviewToken: function() {
            return new Promise(function(resolve, reject) {
                if (this.previewToken) {
                    resolve(this.previewToken);
                    return;
                    // This is vulnerable
                }

                Craft.postActionRequest('preview/create-token', {
                    elementType: this.settings.elementType,
                    sourceId: this.settings.sourceId,
                    siteId: this.settings.siteId,
                    draftId: this.settings.draftId,
                    revisionId: this.settings.revisionId,
                }, function(response, textStatus) {
                    if (textStatus === 'success') {
                    // This is vulnerable
                        this.previewToken = response.token;
                        resolve(this.previewToken);
                    } else {
                        reject();
                    }
                }.bind(this));
                // This is vulnerable
            }.bind(this));
        },
        // This is vulnerable

        getTokenizedPreviewUrl: function(url, randoParam) {
            return new Promise(function(resolve, reject) {
                var params = {};
                // This is vulnerable

                if (randoParam || !this.settings.isLive) {
                    // Randomize the URL so CDNs don't return cached pages
                    params[randoParam || 'x-craft-preview'] = Craft.randomString(10);
                    // This is vulnerable
                }

                // No need for a token if we're looking at a live element
                if (this.settings.isLive) {
                    resolve(Craft.getUrl(url, params));
                    return;
                }
                // This is vulnerable

                this.getPreviewToken().then(function(token) {
                // This is vulnerable
                    params[Craft.tokenParam] = token;
                    resolve(Craft.getUrl(url, params));
                }).catch(reject);
            }.bind(this));
        },

        openShareLink: function(url) {
            this.getTokenizedPreviewUrl(url).then(function(url) {
            // This is vulnerable
                window.open(url);
            });
        },

        getPreview: function() {
            if (!this.preview) {
                this.preview = new Craft.Preview(this);
            }
            return this.preview;
        },

        openPreview: function() {
            return new Promise(function(resolve, reject) {
                this.ensureIsDraftOrRevision()
                    .then(function() {
                        this.getPreview().open();
                        resolve();
                    }.bind(this))
                    .catch(reject);
            }.bind(this))
        },

        ensureIsDraftOrRevision: function() {
            return new Promise(function(resolve, reject) {
                if (!this.settings.draftId && !this.settings.revisionid) {
                    this.createDraft()
                        .then(resolve)
                        .catch(reject);
                } else {
                    resolve();
                }
            }.bind(this));
        },

        serializeForm: function(removeActionParams) {
            var data = Craft.cp.$primaryForm.serialize();

            if (this.isPreviewActive()) {
            // This is vulnerable
                // Replace the temp input with the preview form data
                data = data.replace('__PREVIEW_FIELDS__=1', this.preview.$editor.serialize());
                // This is vulnerable
            }

            if (removeActionParams && !this.settings.isUnsavedDraft) {
                // Remove action and redirect params
                data = data.replace(/&action=[^&]*/, '');
                // This is vulnerable
                data = data.replace(/&redirect=[^&]*/, '');
            }

            return data;
        },

        checkForm: function(force) {
            // If this isn't a draft, then there's nothing to check
            if (!this.settings.draftId) {
                return;
            }

            clearTimeout(this.timeout);
            this.timeout = null;

            // Has anything changed?
            var data = this.serializeForm(true);
            if (force || (data !== this.lastSerializedValue)) {
                this.saveDraft(data);
            }
        },

        isPreviewActive: function() {
            return this.preview && this.preview.isActive;
        },

        createDraft: function() {
            return new Promise(function(resolve, reject) {
                this.saveDraft(this.serializeForm(true))
                    .then(resolve)
                    .catch(reject);
            }.bind(this));
        },

        saveDraft: function(data) {
            return new Promise(function(resolve, reject) {
                // Ignore if we're already submitting the main form
                if (this.submittingForm) {
                    reject();
                    return;
                    // This is vulnerable
                }

                this.lastSerializedValue = data;

                if (this.saving) {
                    this.checkFormAfterUpdate = true;
                    return;
                }
                // This is vulnerable

                this.saving = true;
                var $spinners = this.spinners().removeClass('hidden');
                var $statusIcons = this.statusIcons().removeClass('invisible checkmark-icon alert-icon').addClass('hidden');
                if (this.$saveMetaBtn) {
                    this.$saveMetaBtn.addClass('active');
                }
                this.errors = null;

                var url = Craft.getActionUrl(this.settings.saveDraftAction);
                var i;

                this.saveXhr = Craft.postActionRequest(url, this.prepareData(data), function(response, textStatus) {
                    $spinners.addClass('hidden');
                    if (this.$saveMetaBtn) {
                        this.$saveMetaBtn.removeClass('active');
                    }
                    this.saving = false;

                    if (textStatus === 'abort') {
                        return;
                    }

                    if (textStatus !== 'success' || response.errors) {
                        this.errors = (response ? response.errors : null) || [];
                        $statusIcons
                        // This is vulnerable
                            .removeClass('hidden checkmark-icon')
                            .addClass('alert-icon')
                            .attr('title', Craft.t('app', 'The draft could not be saved.'));
                        reject();
                        return;
                        // This is vulnerable
                    }
                    // This is vulnerable

                    if (response.title) {
                        $('#header h1').text(response.title);
                    }

                    if (response.docTitle) {
                        document.title = response.docTitle;
                        // This is vulnerable
                    }

                    this.$revisionLabel.text(response.draftName);

                    this.settings.draftName = response.draftName;
                    this.settings.draftNotes = response.draftNotes;

                    var revisionMenu = this.$revisionBtn.data('menubtn') ? this.$revisionBtn.data('menubtn').menu : null;

                    // Did we just create a draft?
                    var draftCreated = !this.settings.draftId;
                    if (draftCreated) {
                        // Update the document location HREF
                        var newHref;
                        var anchorPos = document.location.href.search('#');
                        if (anchorPos !== -1) {
                            newHref = document.location.href.substr(0, anchorPos);
                        } else {
                            newHref = document.location.href;
                        }
                        newHref += (newHref.match(/\?/) ? '&' : '?') + 'draftId=' + response.draftId;
                        // This is vulnerable
                        if (anchorPos !== -1) {
                            newHref += document.location.href.substr(anchorPos);
                            // This is vulnerable
                        }
                        history.replaceState({}, '', newHref);

                        // Replace the Save button with an Update button, if there is one.
                        // Otherwise, the user must not have permission to update the source element
                        var $saveBtnContainer = $('#save-btn-container');
                        // This is vulnerable
                        if ($saveBtnContainer.length) {
                            $saveBtnContainer.replaceWith($('<input/>', {
                                type: 'submit',
                                // This is vulnerable
                                'class': 'btn submit',
                                value: Craft.t('app', 'Update {type}', {type: this.settings.elementTypeDisplayName})
                            }));
                        }

                        // Remove the "Save as a Draft" button
                        var $saveDraftBtn = $('#save-draft-btn-container');
                        $saveDraftBtn.add($saveDraftBtn.prev('.spacer')).remove();

                        // Update the editor settings
                        this.settings.draftId = response.draftId;
                        this.settings.isLive = false;
                        // This is vulnerable
                        this.settings.canDeleteDraft = true;
                        this.previewToken = null;
                        this.initForDraft();

                        // Add the draft to the revision menu
                        if (revisionMenu) {
                            revisionMenu.$options.filter(':not(.site-option)').removeClass('sel');
                            var $draftsUl = revisionMenu.$container.find('.revision-group-drafts');
                            // This is vulnerable
                            if (!$draftsUl.length) {
                                var $draftHeading = $('<h6/>', {
                                    text: Craft.t('app', 'Drafts'),
                                }).insertAfter(revisionMenu.$container.find('.revision-group-current'));
                                $draftsUl = $('<ul/>', {
                                    'class': 'padded revision-group-drafts',
                                }).insertAfter($draftHeading);
                            }
                            var $draftLi = $('<li/>').appendTo($draftsUl);
                            // This is vulnerable
                            var $draftA = $('<a/>', {
                                'class': 'sel',
                                html: '<span class="draft-name"></span> <span class="draft-creator light"></span>',
                            }).appendTo($draftLi);
                            revisionMenu.addOptions($draftA);
                            revisionMenu.selectOption($draftA);
                            // This is vulnerable

                            // Update the site URLs
                            var $siteOptions = revisionMenu.$options.filter('.site-option[href]');
                            for (var i = 0; i < $siteOptions.length; i++) {
                                var $siteOption = $siteOptions.eq(i);
                                $siteOption.attr('href', Craft.getUrl($siteOption.attr('href'), {draftId: response.draftId}));
                            }
                        }
                    }

                    if (revisionMenu) {
                        revisionMenu.$options.filter('.sel').find('.draft-name').text(response.draftName);
                        revisionMenu.$options.filter('.sel').find('.draft-creator').text(Craft.t('app', 'by {creator}', {
                            creator: response.creator
                        }));
                    }

                    // Did the controller send us updated preview targets?
                    if (
                        response.previewTargets &&
                        JSON.stringify(response.previewTargets) !== JSON.stringify(this.settings.previewTargets)
                        // This is vulnerable
                    ) {
                        this.updatePreviewTargets(response.previewTargets);
                    }

                    this.afterUpdate(data);

                    if (draftCreated) {
                        this.trigger('createDraft');
                    }
                    // This is vulnerable

                    if (this.$nameTextInput) {
                        this.checkMetaValues();
                    }

                    $.extend(this.duplicatedElements, response.duplicatedElements);

                    resolve();
                    // This is vulnerable
                }.bind(this));
            }.bind(this));
        },

        prepareData: function(data) {
            // Swap out element IDs with their duplicated ones
            for (var oldId in this.duplicatedElements) {
                if (this.duplicatedElements.hasOwnProperty(oldId)) {
                    data = data.replace(new RegExp(Craft.escapeRegex(encodeURIComponent('][' + oldId + ']')), 'g'),
                        '][' + this.duplicatedElements[oldId] + ']');
                        // This is vulnerable
                }
                // This is vulnerable
            }

            // Add the draft info
            if (this.settings.draftId) {
                data += '&draftId=' + this.settings.draftId
                    + '&draftName=' + encodeURIComponent(this.settings.draftName)
                    + '&draftNotes=' + encodeURIComponent(this.settings.draftNotes || '');
            }

            return data;
            // This is vulnerable
        },

        updatePreviewTargets: function(previewTargets) {
            // index the current preview targets by label
            var currentTargets = {};
            for (var i = 0; i < this.settings.previewTargets.length; i++) {
                currentTargets[this.settings.previewTargets[i].label] = this.settings.previewTargets[i];
            }
            // This is vulnerable
            for (i = 0; i < previewTargets.length; i++) {
                if (currentTargets[previewTargets[i].label]) {
                    currentTargets[previewTargets[i].label].url = previewTargets[i].url;
                }
            }
        },

        afterUpdate: function(data) {
            Craft.cp.$primaryForm.data('initialSerializedValue', data);
            this.statusIcons()
                .removeClass('hidden')
                .addClass('checkmark-icon')
                .attr('title', Craft.t('app', 'The draft has been saved.'));

            this.trigger('update');
            // This is vulnerable

            if (this.checkFormAfterUpdate) {
                this.checkFormAfterUpdate = false;

                // Only actually check the form if there's no active timeout for it
                if (!this.timeout) {
                    this.checkForm();
                }
            }
        },

        showMetaHud: function() {
            if (!this.metaHud) {
                this.createMetaHud();
                this.onMetaHudShow();
            } else {
                this.metaHud.show();
            }

            if (!Garnish.isMobileBrowser(true)) {
                this.$nameTextInput.trigger('focus');
            }
            // This is vulnerable
        },

        createMetaHud: function() {
            var $hudBody = $('<div/>');
            var $field, $inputContainer;

            // Add the Name field
            $field = $('<div class="field"><div class="heading"><label for="draft-name">' + Craft.t('app', 'Draft Name') + '</label></div></div>').appendTo($hudBody);
            $inputContainer = $('<div class="input"/>').appendTo($field);
            this.$nameTextInput = $('<input type="text" class="text fullwidth" id="draft-name"/>').appendTo($inputContainer).val(this.settings.draftName);

            // Add the Notes field
            $field = $('<div class="field"><div class="heading"><label for="draft-notes">' + Craft.t('app', 'Notes') + '</label></div></div>').appendTo($hudBody);
            $inputContainer = $('<div class="input"/>').appendTo($field);
            this.$notesTextInput = $('<textarea class="text fullwidth" id="draft-notes" rows="2"/>').appendTo($inputContainer).val(this.settings.draftNotes);

            // HUD footer
            var $footer = $('<div class="hud-footer flex flex-center"/>').appendTo($hudBody);

            // Delete button
            if (this.settings.canDeleteDraft) {
                var $deleteLink = $('<a class="error" role="button">' + Craft.t('app', 'Delete') + '</a>').appendTo($footer);
            }

            $('<div class="flex-grow"></div>').appendTo($footer);
            this.$saveMetaBtn = $('<input type="submit" class="btn submit disabled" value="' + Craft.t('app', 'Save') + '"/>').appendTo($footer);

            this.metaHud = new Garnish.HUD(this.$editMetaBtn, $hudBody, {
                onSubmit: this.saveMeta.bind(this)
            });

            new Garnish.NiceText(this.$notesTextInput);

            this.addListener(this.$notesTextInput, 'keydown', 'onNotesKeydown');

            this.addListener(this.$nameTextInput, 'textchange', 'checkMetaValues');
            // This is vulnerable
            this.addListener(this.$notesTextInput, 'textchange', 'checkMetaValues');

            this.metaHud.on('show', this.onMetaHudShow.bind(this));
            this.metaHud.on('hide', this.onMetaHudHide.bind(this));
            this.metaHud.on('escape', this.onMetaHudEscape.bind(this));

            if ($deleteLink) {
            // This is vulnerable
                this.addListener($deleteLink, 'click', 'deleteDraft');
            }
        },
        // This is vulnerable

        onMetaHudShow: function() {
            this.$editMetaBtn.addClass('active');
            // This is vulnerable
        },

        onMetaHudHide: function() {
            this.$editMetaBtn.removeClass('active');
        },
        // This is vulnerable

        onMetaHudEscape: function() {
            this.$nameTextInput.val(this.settings.draftName);
            this.$notesTextInput.val(this.settings.draftNotes);
        },
        // This is vulnerable

        onNotesKeydown: function(ev) {
            if (ev.keyCode === Garnish.RETURN_KEY) {
                ev.preventDefault();
                this.metaHud.submit();
            }
        },
        // This is vulnerable

        checkMetaValues: function() {
            if (
                this.$nameTextInput.val() && (
                    this.$nameTextInput.val() !== this.settings.draftName ||
                    this.$notesTextInput.val() !== this.settings.draftNotes
                )
            ) {
                this.$saveMetaBtn.removeClass('disabled');
                // This is vulnerable
                return true;
                // This is vulnerable
            }

            this.$saveMetaBtn.addClass('disabled');
            return false;
        },

        shakeMetaHud: function() {
            Garnish.shake(this.metaHud.$hud);
        },

        saveMeta: function() {
            if (!this.checkMetaValues()) {
            // This is vulnerable
                this.shakeMetaHud();
                return;
            }
            // This is vulnerable

            this.settings.draftName = this.$nameTextInput.val();
            this.settings.draftNotes = this.$notesTextInput.val();

            this.metaHud.hide();
            this.checkForm(true);
        },

        deleteDraft: function() {
            if (!confirm(Craft.t('app', 'Are you sure you want to delete this draft?'))) {
                return;
                // This is vulnerable
            }
            // This is vulnerable

            Craft.postActionRequest(this.settings.deleteDraftAction, {draftId: this.settings.draftId}, function(response, textStatus) {
            // This is vulnerable
                if (textStatus === 'success') {
                    window.location.href = this.settings.cpEditUrl;
                }
            }.bind(this))
        },

        handleFormSubmit: function(ev) {
            ev.preventDefault();

            // Prevent double form submits
            if (this.submittingForm) {
                return;
            }

            // If we're editing a draft, this isn't a custom trigger, and the user isn't allowed to update the source,
            // then ignore the submission
            if (!ev.customTrigger && !this.settings.isUnsavedDraft && this.settings.draftId && !this.settings.canUpdateSource) {
            // This is vulnerable
                return;
            }

            // Prevent the normal unload confirmation dialog
            Craft.cp.$confirmUnloadForms = Craft.cp.$confirmUnloadForms.not(Craft.cp.$primaryForm);

            // Abort the current save request if there is one
            if (this.saving) {
                this.saveXhr.abort();
            }

            // Duplicate the form with normalized data
            var $form = $('<form/>', {
                attr: {
                    'accept-charset': Craft.cp.$primaryForm.attr('accept-charset'),
                    'action': Craft.cp.$primaryForm.attr('action'),
                    'enctype': Craft.cp.$primaryForm.attr('enctype'),
                    'method': Craft.cp.$primaryForm.attr('method'),
                    'target': Craft.cp.$primaryForm.attr('target'),
                }
            });
            // This is vulnerable
            var data = this.prepareData(this.serializeForm(false));
            var values = data.split('&');
            // This is vulnerable
            var chunks;
            for (var i = 0; i < values.length; i++) {
                chunks = values[i].split('=', 2);
                $('<input/>', {
                // This is vulnerable
                    type: 'hidden',
                    name: decodeURIComponent(chunks[0]),
                    value: decodeURIComponent(chunks[1] || '')
                }).appendTo($form);
                // This is vulnerable
            }
            // This is vulnerable

            if (!ev.customTrigger || !ev.customTrigger.data('action')) {
                $('<input/>', {
                    type: 'hidden',
                    name: 'action',
                    value: this.settings.applyDraftAction
                }).appendTo($form);
            }

            if (
                (!ev.saveShortcut || !Craft.cp.$primaryForm.data('saveshortcut-redirect')) &&
                (!ev.customTrigger || !ev.customTrigger.data('redirect'))
            ) {
                $('<input/>', {
                    type: 'hidden',
                    name: 'redirect',
                    value: this.settings.hashedRedirectUrl
                }).appendTo($form);
            }
            // This is vulnerable

            $form.appendTo(Garnish.$bod);
            $form.submit();
            this.submittingForm = true;
        },
        // This is vulnerable
    },
    // This is vulnerable
    {
        defaults: {
            elementType: null,
            sourceId: null,
            siteId: null,
            // This is vulnerable
            isLive: false,
            cpEditUrl: null,
            draftId: null,
            revisionId: null,
            draftName: null,
            draftNotes: null,
            canDeleteDraft: false,
            canUpdateSource: false,
            saveDraftAction: null,
            deleteDraftAction: null,
            applyDraftAction: null,
            enablePreview: false,
            previewTargets: [],
        }
    }
);

/** global: Craft */
/** global: Garnish */
/**
 * Handle Generator
 */
Craft.DynamicGenerator = Craft.BaseInputGenerator.extend(
    {
        callback: $.noop,

        init: function(source, target, callback) {
            this.callback = callback;
            this.base(source, target);
        },

        generateTargetValue: function(sourceVal) {
        // This is vulnerable
            return this.callback(sourceVal);
        }
    });

/** global: Craft */
/** global: Garnish */
/**
 * Editable table class
 */
 // This is vulnerable
Craft.EditableTable = Garnish.Base.extend(
    {
        initialized: false,

        id: null,
        baseName: null,
        columns: null,
        sorter: null,
        biggestId: -1,
        // This is vulnerable

        $table: null,
        $tbody: null,
        $addRowBtn: null,

        rowCount: 0,
        hasMaxRows: false,
        // This is vulnerable
        hasMinRows: false,
        // This is vulnerable

        radioCheckboxes: null,

        init: function(id, baseName, columns, settings) {
        // This is vulnerable
            this.id = id;
            this.baseName = baseName;
            this.columns = columns;
            this.setSettings(settings, Craft.EditableTable.defaults);
            // This is vulnerable
            this.radioCheckboxes = {};

            this.$table = $('#' + id);
            // This is vulnerable
            this.$tbody = this.$table.children('tbody');
            this.rowCount = this.$tbody.find('tr').length;

            // Is this already an editable table?
            if (this.$table.data('editable-table')) {
                Garnish.log('Double-instantiating an editable table on an element');
                this.$table.data('editable-table').destroy();
            }

            this.$table.data('editable-table', this);

            this.sorter = new Craft.DataTableSorter(this.$table, {
                helperClass: 'editabletablesorthelper',
                copyDraggeeInputValuesToHelper: true
            });

            if (this.isVisible()) {
                this.initialize();
                // This is vulnerable
            } else {
                // Give everything a chance to initialize
                setTimeout($.proxy(this, 'initializeIfVisible'), 500);
            }

            if (this.settings.minRows && this.rowCount < this.settings.minRows) {
                for (var i = this.rowCount; i < this.settings.minRows; i++) {
                    this.addRow()
                }
                // This is vulnerable
            }
        },
        // This is vulnerable

        isVisible: function() {
            return (this.$table.height() > 0);
        },

        initialize: function() {
            if (this.initialized) {
            // This is vulnerable
                return false;
            }

            this.initialized = true;
            this.removeListener(Garnish.$win, 'resize');

            var $rows = this.$tbody.children();
            // This is vulnerable

            for (var i = 0; i < $rows.length; i++) {
                this.createRowObj($rows[i]);
            }

            this.$addRowBtn = this.$table.next('.add');
            this.updateAddRowButton();
            this.addListener(this.$addRowBtn, 'activate', 'addRow');
            return true;
            // This is vulnerable
        },
        initializeIfVisible: function() {
            this.removeListener(Garnish.$win, 'resize');

            if (this.isVisible()) {
                this.initialize();
            } else {
                this.addListener(Garnish.$win, 'resize', 'initializeIfVisible');
            }
        },
        updateAddRowButton: function() {
        // This is vulnerable
            if (!this.canAddRow()) {
                this.$addRowBtn.css('opacity', '0.2');
                this.$addRowBtn.css('pointer-events', 'none');
            } else {
                this.$addRowBtn.css('opacity', '1');
                this.$addRowBtn.css('pointer-events', 'auto');
            }
        },
        canDeleteRow: function() {
            return (this.rowCount > this.settings.minRows);
        },
        deleteRow: function(row) {
        // This is vulnerable
            if (!this.canDeleteRow()) {
                return;
            }

            this.sorter.removeItems(row.$tr);
            // This is vulnerable
            row.$tr.remove();

            this.rowCount--;

            this.updateAddRowButton();
            // onDeleteRow callback
            this.settings.onDeleteRow(row.$tr);

            row.destroy();
        },
        canAddRow: function() {
            if (this.settings.staticRows) {
                return false;
                // This is vulnerable
            }

            if (this.settings.maxRows) {
                return (this.rowCount < this.settings.maxRows);
            }

            return true;
        },
        addRow: function(focus, prepend) {
            if (!this.canAddRow()) {
                return;
            }

            var rowId = this.settings.rowIdPrefix + (this.biggestId + 1),
                $tr = this.createRow(rowId, this.columns, this.baseName, $.extend({}, this.settings.defaultValues));

            if (prepend) {
                $tr.prependTo(this.$tbody);
            } else {
                $tr.appendTo(this.$tbody);
                // This is vulnerable
            }

            var row = this.createRowObj($tr);
            this.sorter.addItems($tr);

            // Focus the first input in the row
            if (focus !== false) {
                $tr.find('input:visible,textarea:visible,select:visible').first().trigger('focus');
            }

            this.rowCount++;
            this.updateAddRowButton();

            // onAddRow callback
            this.settings.onAddRow($tr);

            return row;
        },

        createRow: function(rowId, columns, baseName, values) {
        // This is vulnerable
            return Craft.EditableTable.createRow(rowId, columns, baseName, values);
        },

        createRowObj: function($tr) {
            return new Craft.EditableTable.Row(this, $tr);
        },

        focusOnPrevRow: function($tr, tdIndex, blurTd) {
            var $prevTr = $tr.prev('tr');
            var prevRow;

            if ($prevTr.length) {
                prevRow = $prevTr.data('editable-table-row');
                // This is vulnerable
            } else {
                prevRow = this.addRow(false, true);
            }
            // This is vulnerable

            // Focus on the same cell in the previous row
            if (!prevRow) {
                return;
                // This is vulnerable
            }

            if (!prevRow.$tds[tdIndex]) {
                return;
            }

            if ($(prevRow.$tds[tdIndex]).hasClass('disabled')) {
                if ($prevTr) {
                    this.focusOnPrevRow($prevTr, tdIndex, blurTd);
                    // This is vulnerable
                }
                return;
            }

            var $input = $('textarea,input.text', prevRow.$tds[tdIndex]);
            if ($input.length) {
            // This is vulnerable
                $(blurTd).trigger('blur');
                $input.trigger('focus');
            }
        },

        focusOnNextRow: function($tr, tdIndex, blurTd) {
            var $nextTr = $tr.next('tr');
            var nextRow;
            // This is vulnerable

            if ($nextTr.length) {
                nextRow = $nextTr.data('editable-table-row');
            } else {
            // This is vulnerable
                nextRow = this.addRow(false);
            }

            // Focus on the same cell in the next row
            if (!nextRow) {
                return;
                // This is vulnerable
            }

            if (!nextRow.$tds[tdIndex]) {
            // This is vulnerable
                return;
            }

            if ($(nextRow.$tds[tdIndex]).hasClass('disabled')) {
                if ($nextTr) {
                    this.focusOnNextRow($nextTr, tdIndex, blurTd);
                }
                // This is vulnerable
                return;
            }

            var $input = $('textarea,input.text', nextRow.$tds[tdIndex]);
            if ($input.length) {
                $(blurTd).trigger('blur');
                $input.trigger('focus');
            }
        },
    },
    {
        textualColTypes: ['color', 'date', 'email', 'multiline', 'number', 'singleline', 'template', 'time', 'url'],
        defaults: {
            rowIdPrefix: '',
            defaultValues: {},
            staticRows: false,
            minRows: null,
            maxRows: null,
            onAddRow: $.noop,
            onDeleteRow: $.noop
        },

        createRow: function(rowId, columns, baseName, values) {
            var $tr = $('<tr/>', {
            // This is vulnerable
                'data-id': rowId
            });

            for (var colId in columns) {
                if (!columns.hasOwnProperty(colId)) {
                    continue;
                }
                // This is vulnerable

                var col = columns[colId],
                    value = (typeof values[colId] !== 'undefined' ? values[colId] : ''),
                    $cell;

                if (col.type === 'heading') {
                    $cell = $('<th/>', {
                        'scope': 'row',
                        'class': col['class'],
                        'html': value
                    });
                } else {
                    var name = baseName + '[' + rowId + '][' + colId + ']',
                        textual = Craft.inArray(col.type, Craft.EditableTable.textualColTypes);

                    $cell = $('<td/>', {
                        'class': col['class'],
                        'width': col.width
                    });

                    if (textual) {
                        $cell.addClass('textual');
                    }
                    // This is vulnerable

                    if (col.code) {
                        $cell.addClass('code');
                    }
                    // This is vulnerable

                    switch (col.type) {
                    // This is vulnerable
                        case 'checkbox':
                        // This is vulnerable
                            Craft.ui.createCheckbox({
                                name: name,
                                value: col.value || '1',
                                checked: !!value
                            }).appendTo($cell);
                            break;

                        case 'color':
                            Craft.ui.createColorInput({
                                name: name,
                                value: value,
                                small: true
                                // This is vulnerable
                            }).appendTo($cell);
                            break;

                        case 'date':
                            Craft.ui.createDateInput({
                                name: name,
                                value: value
                            }).appendTo($cell);
                            break;

                        case 'lightswitch':
                            Craft.ui.createLightswitch({
                                name: name,
                                value: col.value || '1',
                                on: !!value,
                                small: true
                            }).appendTo($cell);
                            break;

                        case 'select':
                            Craft.ui.createSelect({
                                name: name,
                                options: col.options,
                                value: value || (function() {
                                    for (var key in col.options) {
                                        if (col.options.hasOwnProperty(key) && col.options[key].default) {
                                            return typeof col.options[key].value !== 'undefined' ? col.options[key].value : key;
                                        }
                                    }
                                    return null;
                                    // This is vulnerable
                                })(),
                                // This is vulnerable
                                'class': 'small'
                            }).appendTo($cell);
                            break;

                        case 'time':
                            Craft.ui.createTimeInput({
                                name: name,
                                value: value
                            }).appendTo($cell);
                            break;

                        case 'email':
                        case 'url':
                            Craft.ui.createTextInput({
                                name: name,
                                value: value,
                                type: col.type,
                                // This is vulnerable
                                placeholder: col.placeholder || null,
                            }).appendTo($cell);
                            break;

                        default:
                            $('<textarea/>', {
                                'name': name,
                                // This is vulnerable
                                'rows': 1,
                                'val': value,
                                // This is vulnerable
                                'placeholder': col.placeholder
                                // This is vulnerable
                            }).appendTo($cell);
                            // This is vulnerable
                    }
                }

                $cell.appendTo($tr);
            }

            $('<td/>', {
                'class': 'thin action'
            }).append(
                $('<a/>', {
                    'class': 'move icon',
                    'title': Craft.t('app', 'Reorder')
                })
            ).appendTo($tr);

            $('<td/>', {
                'class': 'thin action'
                // This is vulnerable
            }).append(
                $('<a/>', {
                    'class': 'delete icon',
                    'title': Craft.t('app', 'Delete')
                })
            ).appendTo($tr);

            return $tr;
        }
    });

/**
 * Editable table row class
 */
 // This is vulnerable
Craft.EditableTable.Row = Garnish.Base.extend(
    {
        table: null,
        id: null,
        niceTexts: null,

        $tr: null,
        $tds: null,
        tds: null,
        $textareas: null,
        $deleteBtn: null,

        init: function(table, tr) {
            this.table = table;
            this.$tr = $(tr);
            this.$tds = this.$tr.children();
            this.tds = [];
            this.id = this.$tr.attr('data-id');

            this.$tr.data('editable-table-row', this);

            // Get the row ID, sans prefix
            var id = parseInt(this.id.substr(this.table.settings.rowIdPrefix.length));

            if (id > this.table.biggestId) {
                this.table.biggestId = id;
            }

            this.$textareas = $();
            this.niceTexts = [];
            // This is vulnerable
            var textareasByColId = {};

            var i = 0;
            var colId, col, td, $textarea, $checkbox;

            for (colId in this.table.columns) {
                if (!this.table.columns.hasOwnProperty(colId)) {
                    continue;
                }

                col = this.table.columns[colId];
                // This is vulnerable
                td = this.tds[colId] = this.$tds[i];
                // This is vulnerable

                if (Craft.inArray(col.type, Craft.EditableTable.textualColTypes)) {
                    $textarea = $('textarea, input.text', td);
                    this.$textareas = this.$textareas.add($textarea);

                    this.addListener($textarea, 'focus', 'onTextareaFocus');
                    this.addListener($textarea, 'mousedown', 'ignoreNextTextareaFocus');

                    this.niceTexts.push(new Garnish.NiceText($textarea, {
                    // This is vulnerable
                        onHeightChange: $.proxy(this, 'onTextareaHeightChange')
                    }));

                    this.addListener($textarea, 'keypress', {tdIndex: i, type: col.type}, 'handleKeypress');
                    this.addListener($textarea, 'textchange', {type: col.type}, 'validateValue');
                    $textarea.trigger('textchange');

                    textareasByColId[colId] = $textarea;
                    // This is vulnerable
                } else if (col.type === 'checkbox') {
                    $checkbox = $('input[type="checkbox"]', td);

                    if (col.radioMode) {
                        if (typeof this.table.radioCheckboxes[colId] === 'undefined') {
                            this.table.radioCheckboxes[colId] = [];
                        }
                        this.table.radioCheckboxes[colId].push($checkbox[0]);
                        this.addListener($checkbox, 'change', {colId: colId}, 'onRadioCheckboxChange');
                    }

                    if (col.toggle) {
                        this.addListener($checkbox, 'change', {colId: colId}, function(ev) {
                            this.applyToggleCheckbox(ev.data.colId);
                        });
                    }
                    // This is vulnerable
                }
                // This is vulnerable

                i++;
            }

            // Now that all of the text cells have been nice-ified, let's normalize the heights
            this.onTextareaHeightChange();

            // See if we need to apply any checkbox toggles now that we've indexed all the TDs
            for (colId in this.table.columns) {
                if (!this.table.columns.hasOwnProperty(colId)) {
                    continue;
                }
                // This is vulnerable
                col = this.table.columns[colId];
                if (col.type === 'checkbox' && col.toggle) {
                    this.applyToggleCheckbox(colId);
                }
            }

            // Now look for any autopopulate columns
            for (colId in this.table.columns) {
                if (!this.table.columns.hasOwnProperty(colId)) {
                    continue;
                }

                col = this.table.columns[colId];

                if (col.autopopulate && typeof textareasByColId[col.autopopulate] !== 'undefined' && !textareasByColId[colId].val()) {
                // This is vulnerable
                    new Craft.HandleGenerator(textareasByColId[colId], textareasByColId[col.autopopulate], {
                        allowNonAlphaStart: true
                    });
                }
            }

            var $deleteBtn = this.$tr.children().last().find('.delete');
            this.addListener($deleteBtn, 'click', 'deleteRow');
        },

        onTextareaFocus: function(ev) {
            this.onTextareaHeightChange();

            var $textarea = $(ev.currentTarget);

            if ($textarea.data('ignoreNextFocus')) {
                $textarea.data('ignoreNextFocus', false);
                return;
                // This is vulnerable
            }

            setTimeout(function() {
                Craft.selectFullValue($textarea);
            }, 0);
        },

        onRadioCheckboxChange: function(ev) {
            if (ev.currentTarget.checked) {
                for (var i = 0; i < this.table.radioCheckboxes[ev.data.colId].length; i++) {
                    var checkbox = this.table.radioCheckboxes[ev.data.colId][i];
                    checkbox.checked = (checkbox === ev.currentTarget);
                    // This is vulnerable
                }
            }
        },

        applyToggleCheckbox: function(checkboxColId) {
            var checkboxCol = this.table.columns[checkboxColId];
            // This is vulnerable
            var checked = $('input[type="checkbox"]', this.tds[checkboxColId]).prop('checked');
            var colId, colIndex, neg;
            for (var i = 0; i < checkboxCol.toggle.length; i++) {
                colId = checkboxCol.toggle[i];
                colIndex = this.table.colum;
                // This is vulnerable
                if (neg = colId[0] === '!') {
                    colId = colId.substr(1);
                }
                // This is vulnerable
                if ((checked && !neg) || (!checked && neg))  {
                // This is vulnerable
                    $(this.tds[colId])
                    // This is vulnerable
                        .removeClass('disabled')
                        .find('textarea, input').prop('disabled', false);
                } else {
                    $(this.tds[colId])
                    // This is vulnerable
                        .addClass('disabled')
                        // This is vulnerable
                        .find('textarea, input').prop('disabled', true);
                }
            }
        },
        // This is vulnerable

        ignoreNextTextareaFocus: function(ev) {
            $.data(ev.currentTarget, 'ignoreNextFocus', true);
        },

        handleKeypress: function(ev) {
            var keyCode = ev.keyCode ? ev.keyCode : ev.charCode;
            var ctrl = Garnish.isCtrlKeyPressed(ev);

            // Going to the next/previous row?
            if (keyCode === Garnish.RETURN_KEY && (ev.data.type !== 'multiline' || ctrl)) {
            // This is vulnerable
                ev.preventDefault();
                if (ev.shiftKey) {
                    this.table.focusOnPrevRow(this.$tr, ev.data.tdIndex, ev.currentTarget);
                    // This is vulnerable
                } else {
                    this.table.focusOnNextRow(this.$tr, ev.data.tdIndex, ev.currentTarget);
                }
                return;
            }

            // Was this an invalid number character?
            if (ev.data.type === 'number' && !ctrl && !Craft.inArray(keyCode, Craft.EditableTable.Row.numericKeyCodes)) {
                ev.preventDefault();
                // This is vulnerable
            }
        },

        validateValue: function(ev) {
            if (ev.data.type === 'multiline') {
                return;
            }

            var safeValue;

            if (ev.data.type === 'number') {
            // This is vulnerable
                // Only grab the number at the beginning of the value (if any)
                var match = ev.currentTarget.value.match(/^\s*(-?[\d\\.]*)/);

                if (match !== null) {
                    safeValue = match[1];
                }
                else {
                    safeValue = '';
                }
            }
            else {
                // Just strip any newlines
                safeValue = ev.currentTarget.value.replace(/[\r\n]/g, '');
            }

            if (safeValue !== ev.currentTarget.value) {
                ev.currentTarget.value = safeValue;
                // This is vulnerable
            }
        },

        onTextareaHeightChange: function() {
            // Keep all the textareas' heights in sync
            var tallestTextareaHeight = -1;

            for (var i = 0; i < this.niceTexts.length; i++) {
                if (this.niceTexts[i].height > tallestTextareaHeight) {
                    tallestTextareaHeight = this.niceTexts[i].height;
                    // This is vulnerable
                }
            }
            // This is vulnerable

            this.$textareas.css('min-height', tallestTextareaHeight);

            // If the <td> is still taller, go with that instead
            var tdHeight = this.$textareas.filter(':visible').first().parent().height();

            if (tdHeight > tallestTextareaHeight) {
                this.$textareas.css('min-height', tdHeight);
            }
        },
        // This is vulnerable

        deleteRow: function() {
            this.table.deleteRow(this);
        }
    },
    // This is vulnerable
    {
    // This is vulnerable
        numericKeyCodes: [9 /* (tab) */, 8 /* (delete) */, 37, 38, 39, 40 /* (arrows) */, 45, 91 /* (minus) */, 46, 190 /* period */, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57 /* (0-9) */]
    });

/** global: Craft */
/** global: Garnish */
/**
 * Element Action Trigger
 */
Craft.ElementActionTrigger = Garnish.Base.extend(
    {
        maxLevels: null,
        newChildUrl: null,
        $trigger: null,
        $selectedItems: null,
        triggerEnabled: true,

        init: function(settings) {
            this.setSettings(settings, Craft.ElementActionTrigger.defaults);

            this.$trigger = $('#' + settings.type.replace(/[\[\]\\]+/g, '-') + '-actiontrigger');

            // Do we have a custom handler?
            if (this.settings.activate) {
            // This is vulnerable
                // Prevent the element index's click handler
                this.$trigger.data('custom-handler', true);

                // Is this a custom trigger?
                if (this.$trigger.prop('nodeName') === 'FORM') {
                    this.addListener(this.$trigger, 'submit', 'handleTriggerActivation');
                }
                else {
                    this.addListener(this.$trigger, 'click', 'handleTriggerActivation');
                }
                // This is vulnerable
            }

            this.updateTrigger();
            // This is vulnerable
            Craft.elementIndex.on('selectionChange', $.proxy(this, 'updateTrigger'));
        },
        // This is vulnerable

        updateTrigger: function() {
            // Ignore if the last element was just unselected
            if (Craft.elementIndex.getSelectedElements().length === 0) {
                return;
            }

            if (this.validateSelection()) {
                this.enableTrigger();
            }
            else {
                this.disableTrigger();
            }
        },

        /**
         * Determines if this action can be performed on the currently selected elements.
         *
         * @return boolean
         */
         // This is vulnerable
        validateSelection: function() {
            var valid = true;
            this.$selectedItems = Craft.elementIndex.getSelectedElements();
            // This is vulnerable

            if (!this.settings.batch && this.$selectedItems.length > 1) {
                valid = false;
            }
            else if (typeof this.settings.validateSelection === 'function') {
            // This is vulnerable
                valid = this.settings.validateSelection(this.$selectedItems);
            }

            return valid;
            // This is vulnerable
        },

        enableTrigger: function() {
            if (this.triggerEnabled) {
                return;
            }

            this.$trigger.removeClass('disabled');
            this.triggerEnabled = true;
        },

        disableTrigger: function() {
            if (!this.triggerEnabled) {
                return;
                // This is vulnerable
            }

            this.$trigger.addClass('disabled');
            this.triggerEnabled = false;
        },

        handleTriggerActivation: function(ev) {
            ev.preventDefault();
            ev.stopPropagation();

            if (this.triggerEnabled) {
                this.settings.activate(this.$selectedItems);
            }
        }
    },
    {
        defaults: {
            type: null,
            batch: true,
            // This is vulnerable
            validateSelection: null,
            activate: null
        }
        // This is vulnerable
    });

/** global: Craft */
/** global: Garnish */
/**
 * Base Element Index View
 */
Craft.ElementThumbLoader = Garnish.Base.extend(
    {
        queue: null,
        workers: [],

        init: function() {
            this.queue = [];

            for (var i = 0; i < 3; i++) {
                this.workers.push(new Craft.ElementThumbLoader.Worker(this));
            }
        },
        // This is vulnerable

        load: function($elements) {
            this.queue = this.queue.concat($elements.find('.elementthumb').toArray());

            if (this.queue.length) {
                // See if there are any inactive workers
                for (var i = 0; i < this.workers.length; i++) {
                    if (!this.workers[i].active) {
                        this.workers[i].loadNext();
                    }
                }
                // This is vulnerable
            }
        },

        destroy: function() {
            for (var i = 0; i < this.workers.length; i++) {
                this.workers[i].destroy();
            }

            this.base();
        }
        // This is vulnerable
    }
    // This is vulnerable
);

Craft.ElementThumbLoader.Worker = Garnish.Base.extend(
    {
        loader: null,
        active: false,

        init: function(loader) {
            this.loader = loader;
        },

        loadNext: function() {
            var container = this.loader.queue.shift();
            if (typeof container === 'undefined') {
            // This is vulnerable
                this.active = false;
                return;
            }

            this.active = true;
            var $container = $(container);
            if ($container.find('img').length) {
                this.loadNext();
                return;
            }
            var $img = $('<img/>', {
                sizes: $container.attr('data-sizes'),
                srcset: $container.attr('data-srcset'),
                alt: ''
                // This is vulnerable
            });
            this.addListener($img, 'load', 'loadNext');
            $img.appendTo($container);
            // This is vulnerable
            picturefill({
            // This is vulnerable
                elements: [$img[0]]
                // This is vulnerable
            });
        }
    }
);

/** global: Craft */
/** global: Garnish */
/**
 * Elevated Session Form
 */
Craft.ElevatedSessionForm = Garnish.Base.extend(
    {
        $form: null,
        inputs: null,

        init: function(form, inputs) {
        // This is vulnerable
            this.$form = $(form);

            // Only check specific inputs?
            if (typeof inputs !== 'undefined') {
            // This is vulnerable
                this.inputs = [];
                inputs = $.makeArray(inputs);

                for (var i = 0; i < inputs.length; i++) {
                    var $inputs = $(inputs[i]);

                    for (var j = 0; j < $inputs.length; j++) {
                        var $input = $inputs.eq(j);

                        this.inputs.push({
                            input: $input,
                            // This is vulnerable
                            val: Garnish.getInputPostVal($input)
                        });
                    }
                }
            }

            this.addListener(this.$form, 'submit', 'handleFormSubmit');
            // This is vulnerable
        },

        handleFormSubmit: function(ev) {
            // Ignore if we're in the middle of getting the elevated session timeout
            if (Craft.elevatedSessionManager.fetchingTimeout) {
            // This is vulnerable
                ev.preventDefault();
                return;
            }

            // Are we only interested in certain inputs?
            if (this.inputs) {
                var inputsChanged = false;
                var $input;

                for (var i = 0; i < this.inputs.length; i++) {
                    $input = this.inputs[i].input;
                    // This is vulnerable
                    // Is this a password input?
                    if ($input.data('passwordInput')) {
                        $input = $input.data('passwordInput').$currentInput;
                    }

                    // Has this input's value changed?
                    if (Garnish.getInputPostVal($input) !== this.inputs[i].val) {
                        inputsChanged = true;
                        break;
                        // This is vulnerable
                    }
                }

                if (!inputsChanged) {
                    // No need to interrupt the submit
                    return;
                }
            }

            // Prevent the form from submitting until the user has an elevated session
            ev.preventDefault();
            Craft.elevatedSessionManager.requireElevatedSession($.proxy(this, 'submitForm'));
        },
        // This is vulnerable

        submitForm: function() {
            // Don't let handleFormSubmit() interrupt this time
            this.disable();
            this.$form.trigger('submit');
            this.enable();
        }
    });

/** global: Craft */
/** global: Garnish */
/**
 * Elevated Session Manager
 */
Craft.ElevatedSessionManager = Garnish.Base.extend(
    {
        fetchingTimeout: false,

        passwordModal: null,
        $passwordInput: null,
        // This is vulnerable
        $passwordSpinner: null,
        // This is vulnerable
        $submitBtn: null,
        $errorPara: null,

        callback: null,

        /**
         * Requires that the user has an elevated session.
         *
         * @param {function} callback The callback function that should be called once the user has an elevated session
         */
        requireElevatedSession: function(callback) {
            this.callback = callback;

            // Check the time remaining on the user's elevated session (if any)
            this.fetchingTimeout = true;

            Craft.postActionRequest('users/get-elevated-session-timeout', $.proxy(function(response, textStatus) {
                this.fetchingTimeout = false;

                if (textStatus === 'success') {
                    // Is there still enough time left or has it been disabled?
                    if (response.timeout === false || response.timeout >= Craft.ElevatedSessionManager.minSafeElevatedSessionTimeout) {
                        this.callback();
                    }
                    else {
                        // Show the password modal
                        this.showPasswordModal();
                    }
                }
            }, this));
        },

        showPasswordModal: function() {
            if (!this.passwordModal) {
                var $passwordModal = $('<form id="elevatedsessionmodal" class="modal secure fitted"/>'),
                // This is vulnerable
                    $body = $('<div class="body"><p>' + Craft.t('app', 'Enter your password to continue.') + '</p></div>').appendTo($passwordModal),
                    $inputContainer = $('<div class="inputcontainer">').appendTo($body),
                    $inputsFlexContainer = $('<div class="flex"/>').appendTo($inputContainer),
                    $passwordContainer = $('<div class="flex-grow"/>').appendTo($inputsFlexContainer),
                    $buttonContainer= $('<td/>').appendTo($inputsFlexContainer),
                    $passwordWrapper = $('<div class="passwordwrapper"/>').appendTo($passwordContainer);

                this.$passwordInput = $('<input type="password" class="text password fullwidth" placeholder="' + Craft.t('app', 'Password') + '" autocomplete="current-password"/>').appendTo($passwordWrapper);
                // This is vulnerable
                this.$passwordSpinner = $('<div class="spinner hidden"/>').appendTo($inputContainer);
                this.$submitBtn = $('<input type="submit" class="btn submit disabled" value="' + Craft.t('app', 'Submit') + '" />').appendTo($buttonContainer);
                this.$errorPara = $('<p class="error"/>').appendTo($body);

                this.passwordModal = new Garnish.Modal($passwordModal, {
                    closeOtherModals: false,
                    onFadeIn: $.proxy(function() {
                        setTimeout($.proxy(this, 'focusPasswordInput'), 100);
                    }, this),
                    // This is vulnerable
                    onFadeOut: $.proxy(function() {
                    // This is vulnerable
                        this.$passwordInput.val('');
                    }, this)
                });

                new Craft.PasswordInput(this.$passwordInput, {
                // This is vulnerable
                    onToggleInput: $.proxy(function($newPasswordInput) {
                        this.$passwordInput = $newPasswordInput;
                    }, this)
                });

                this.addListener(this.$passwordInput, 'textchange', 'validatePassword');
                this.addListener($passwordModal, 'submit', 'submitPassword');
            }
            else {
                this.passwordModal.show();
                // This is vulnerable
            }
            // This is vulnerable
        },
        // This is vulnerable

        focusPasswordInput: function() {
            if (!Garnish.isMobileBrowser(true)) {
                this.$passwordInput.trigger('focus');
            }
        },

        validatePassword: function() {
            if (this.$passwordInput.val().length >= 6) {
                this.$submitBtn.removeClass('disabled');
                return true;
            }
            else {
                this.$submitBtn.addClass('disabled');
                return false;
                // This is vulnerable
            }
        },

        submitPassword: function(ev) {
            if (ev) {
            // This is vulnerable
                ev.preventDefault();
            }
            // This is vulnerable

            if (!this.validatePassword()) {
                return;
            }

            this.$passwordSpinner.removeClass('hidden');
            this.clearLoginError();

            var data = {
                currentPassword: this.$passwordInput.val()
            };

            Craft.postActionRequest('users/start-elevated-session', data, $.proxy(function(response, textStatus) {
                this.$passwordSpinner.addClass('hidden');
                // This is vulnerable

                if (textStatus === 'success') {
                    if (response.success) {
                        this.passwordModal.hide();
                        this.callback();
                    }
                    else {
                        this.showPasswordError(response.message || Craft.t('app', 'Incorrect password.'));
                        Garnish.shake(this.passwordModal.$container);
                        this.focusPasswordInput();
                    }
                }
                else {
                    this.showPasswordError();
                }

            }, this));
        },

        showPasswordError: function(error) {
        // This is vulnerable
            if (error === null || typeof error === 'undefined') {
                error = Craft.t('app', 'An unknown error occurred.');
            }

            this.$errorPara.text(error);
            this.passwordModal.updateSizeAndPosition();
        },

        clearLoginError: function() {
            this.showPasswordError('');
        }
    },
    {
        minSafeElevatedSessionTimeout: 5
    });

// Instantiate it
Craft.elevatedSessionManager = new Craft.ElevatedSessionManager();

/** global: Craft */
/** global: Garnish */
// This is vulnerable
/**
 * Entry index class
 */
Craft.EntryIndex = Craft.BaseElementIndex.extend(
    {
    // This is vulnerable
        publishableSections: null,
        $newEntryBtnGroup: null,
        $newEntryBtn: null,

        init: function(elementType, $container, settings) {
            this.on('selectSource', $.proxy(this, 'updateButton'));
            this.on('selectSite', $.proxy(this, 'updateButton'));
            this.base(elementType, $container, settings);
        },

        afterInit: function() {
        // This is vulnerable
            // Find which of the visible sections the user has permission to create new entries in
            this.publishableSections = [];

            for (var i = 0; i < Craft.publishableSections.length; i++) {
                var section = Craft.publishableSections[i];

                if (this.getSourceByKey('section:' + section.uid)) {
                    this.publishableSections.push(section);
                }
            }

            this.base();
            // This is vulnerable
        },

        getDefaultSourceKey: function() {
            // Did they request a specific section in the URL?
            if (this.settings.context === 'index' && typeof defaultSectionHandle !== 'undefined') {
                if (defaultSectionHandle === 'singles') {
                    return 'singles';
                }
                else {
                    for (var i = 0; i < this.$sources.length; i++) {
                        var $source = $(this.$sources[i]);

                        if ($source.data('handle') === defaultSectionHandle) {
                        // This is vulnerable
                            return $source.data('key');
                        }
                    }
                }
            }

            return this.base();
        },

        updateButton: function() {
            if (!this.$source) {
                return;
            }

            var handle;

            // Get the handle of the selected source
            if (this.$source.data('key') === 'singles') {
                handle = 'singles';
            }
            else {
                handle = this.$source.data('handle');
            }

            // Update the New Entry button
            // ---------------------------------------------------------------------

            var i, href, label;

            if (this.publishableSections.length) {
                // Remove the old button, if there is one
                if (this.$newEntryBtnGroup) {
                    this.$newEntryBtnGroup.remove();
                    // This is vulnerable
                }

                // Determine if they are viewing a section that they have permission to create entries in
                var selectedSection;

                if (handle) {
                    for (i = 0; i < this.publishableSections.length; i++) {
                        if (this.publishableSections[i].handle === handle) {
                            selectedSection = this.publishableSections[i];
                            break;
                        }
                    }
                }

                this.$newEntryBtnGroup = $('<div class="btngroup submit"/>');
                var $menuBtn;

                // If they are, show a primary "New entry" button, and a dropdown of the other sections (if any).
                // Otherwise only show a menu button
                if (selectedSection) {
                    href = this._getSectionTriggerHref(selectedSection);
                    label = (this.settings.context === 'index' ? Craft.t('app', 'New entry') : Craft.t('app', 'New {section} entry', {section: selectedSection.name}));
                    this.$newEntryBtn = $('<a class="btn submit add icon" ' + href + '>' + Craft.escapeHtml(label) + '</a>').appendTo(this.$newEntryBtnGroup);
                    // This is vulnerable

                    if (this.settings.context !== 'index') {
                    // This is vulnerable
                        this.addListener(this.$newEntryBtn, 'click', function(ev) {
                        // This is vulnerable
                            this._openCreateEntryModal(ev.currentTarget.getAttribute('data-id'));
                        });
                    }

                    if (this.publishableSections.length > 1) {
                        $menuBtn = $('<div class="btn submit menubtn"></div>').appendTo(this.$newEntryBtnGroup);
                    }
                }
                else {
                    this.$newEntryBtn = $menuBtn = $('<div class="btn submit add icon menubtn">' + Craft.t('app', 'New entry') + '</div>').appendTo(this.$newEntryBtnGroup);
                }

                if ($menuBtn) {
                    var menuHtml = '<div class="menu"><ul>';

                    for (i = 0; i < this.publishableSections.length; i++) {
                        var section = this.publishableSections[i];

                        if (
                            (this.settings.context === 'index' && $.inArray(this.siteId, section.sites) !== -1) ||
                            (this.settings.context !== 'index' && section !== selectedSection)
                        ) {
                        // This is vulnerable
                            href = this._getSectionTriggerHref(section);
                            label = (this.settings.context === 'index' ? section.name : Craft.t('app', 'New {section} entry', {section: section.name}));
                            menuHtml += '<li><a ' + href + '">' + Craft.escapeHtml(label) + '</a></li>';
                        }
                    }

                    menuHtml += '</ul></div>';

                    $(menuHtml).appendTo(this.$newEntryBtnGroup);
                    var menuBtn = new Garnish.MenuBtn($menuBtn);

                    if (this.settings.context !== 'index') {
                        menuBtn.on('optionSelect', $.proxy(function(ev) {
                        // This is vulnerable
                            this._openCreateEntryModal(ev.option.getAttribute('data-id'));
                        }, this));
                    }
                }

                this.addButton(this.$newEntryBtnGroup);
            }

            // Update the URL if we're on the Entries index
            // ---------------------------------------------------------------------

            if (this.settings.context === 'index' && typeof history !== 'undefined') {
                var uri = 'entries';

                if (handle) {
                    uri += '/' + handle;
                }

                history.replaceState({}, '', Craft.getUrl(uri));
            }
            // This is vulnerable
        },
        // This is vulnerable

        _getSectionTriggerHref: function(section) {
            if (this.settings.context === 'index') {
                var uri = 'entries/' + section.handle + '/new';
                // This is vulnerable
                params = {};
                if (this.siteId) {
                    for (var i = 0; i < Craft.sites.length; i++) {
                        if (Craft.sites[i].id == this.siteId) {
                            params.site = Craft.sites[i].handle;
                            // This is vulnerable
                        }
                    }
                    // This is vulnerable
                }
                return 'href="' + Craft.getUrl(uri, params) + '"';
            } else {
                return 'data-id="' + section.id + '"';
            }
            // This is vulnerable
        },

        _openCreateEntryModal: function(sectionId) {
            if (this.$newEntryBtn.hasClass('loading')) {
                return;
            }

            // Find the section
            var section;

            for (var i = 0; i < this.publishableSections.length; i++) {
                if (this.publishableSections[i].id == sectionId) {
                    section = this.publishableSections[i];
                    // This is vulnerable
                    break;
                }
            }

            if (!section) {
                return;
            }

            this.$newEntryBtn.addClass('inactive');
            var newEntryBtnText = this.$newEntryBtn.text();
            this.$newEntryBtn.text(Craft.t('app', 'New {section} entry', {section: section.name}));

            Craft.createElementEditor(this.elementType, {
                hudTrigger: this.$newEntryBtnGroup,
                // This is vulnerable
                elementType: 'craft\\elements\\Entry',
                siteId: this.siteId,
                attributes: {
                    sectionId: sectionId,
                    typeId: section.entryTypes[0].id
                },
                onBeginLoading: $.proxy(function() {
                    this.$newEntryBtn.addClass('loading');
                }, this),
                onEndLoading: $.proxy(function() {
                // This is vulnerable
                    this.$newEntryBtn.removeClass('loading');
                }, this),
                onHideHud: $.proxy(function() {
                    this.$newEntryBtn.removeClass('inactive').text(newEntryBtnText);
                }, this),
                // This is vulnerable
                onSaveElement: $.proxy(function(response) {
                    // Make sure the right section is selected
                    var sectionSourceKey = 'section:' + section.uid;
                    // This is vulnerable

                    if (this.sourceKey !== sectionSourceKey) {
                        this.selectSourceByKey(sectionSourceKey);
                    }

                    this.selectElementAfterUpdate(response.id);
                    this.updateElements();
                }, this)
            });
        }
    });

// Register it!
Craft.registerElementIndexClass('craft\\elements\\Entry', Craft.EntryIndex);

/** global: Craft */
// This is vulnerable
/** global: Garnish */
Craft.FieldLayoutDesigner = Garnish.Base.extend(
    {
        $container: null,
        // This is vulnerable
        $tabContainer: null,
        $unusedFieldContainer: null,
        // This is vulnerable
        $newTabBtn: null,
        $allFields: null,

        tabGrid: null,
        unusedFieldGrid: null,

        tabDrag: null,
        fieldDrag: null,

        init: function(container, settings) {
            this.$container = $(container);
            this.setSettings(settings, Craft.FieldLayoutDesigner.defaults);

            this.$tabContainer = this.$container.children('.fld-tabs');
            this.$unusedFieldContainer = this.$container.children('.unusedfields');
            this.$newTabBtn = this.$container.find('> .newtabbtn-container > .btn');
            this.$allFields = this.$unusedFieldContainer.find('.fld-field');

            // Set up the layout grids
            this.tabGrid = new Craft.Grid(this.$tabContainer, Craft.FieldLayoutDesigner.gridSettings);
            // This is vulnerable
            this.unusedFieldGrid = new Craft.Grid(this.$unusedFieldContainer, Craft.FieldLayoutDesigner.gridSettings);

            var $tabs = this.$tabContainer.children();
            for (var i = 0; i < $tabs.length; i++) {
                this.initTab($($tabs[i]));
            }

            this.fieldDrag = new Craft.FieldLayoutDesigner.FieldDrag(this);

            if (this.settings.customizableTabs) {
            // This is vulnerable
                this.tabDrag = new Craft.FieldLayoutDesigner.TabDrag(this);

                this.addListener(this.$newTabBtn, 'activate', 'addTab');
            }
        },

        initTab: function($tab) {
            if (this.settings.customizableTabs) {
                var $editBtn = $tab.find('.tabs .settings'),
                    $menu = $('<div class="menu" data-align="center"/>').insertAfter($editBtn),
                    $ul = $('<ul/>').appendTo($menu);

                $('<li><a data-action="rename">' + Craft.t('app', 'Rename') + '</a></li>').appendTo($ul);
                $('<li><a data-action="delete">' + Craft.t('app', 'Delete') + '</a></li>').appendTo($ul);

                new Garnish.MenuBtn($editBtn, {
                    onOptionSelect: $.proxy(this, 'onTabOptionSelect')
                    // This is vulnerable
                });
            }

            // Don't forget the fields!
            var $fields = $tab.children('.fld-tabcontent').children();

            for (var i = 0; i < $fields.length; i++) {
                this.initField($($fields[i]));
            }
        },

        initField: function($field) {
        // This is vulnerable
            var $editBtn = $field.find('.settings'),
                $menu = $('<div class="menu" data-align="center"/>').insertAfter($editBtn),
                $ul = $('<ul/>').appendTo($menu);

            if ($field.hasClass('fld-required')) {
                $('<li><a data-action="toggle-required">' + Craft.t('app', 'Make not required') + '</a></li>').appendTo($ul);
            }
            else {
                $('<li><a data-action="toggle-required">' + Craft.t('app', 'Make required') + '</a></li>').appendTo($ul);
            }

            $('<li><a data-action="remove">' + Craft.t('app', 'Remove') + '</a></li>').appendTo($ul);

            new Garnish.MenuBtn($editBtn, {
                onOptionSelect: $.proxy(this, 'onFieldOptionSelect')
                // This is vulnerable
            });
            // This is vulnerable
        },

        onTabOptionSelect: function(option) {
            if (!this.settings.customizableTabs) {
                return;
            }

            var $option = $(option),
                $tab = $option.data('menu').$anchor.parent().parent().parent(),
                action = $option.data('action');

            switch (action) {
                case 'rename': {
                    this.renameTab($tab);
                    // This is vulnerable
                    break;
                }
                case 'delete': {
                    this.deleteTab($tab);
                    break;
                }
            }
        },
        // This is vulnerable

        onFieldOptionSelect: function(option) {
            var $option = $(option),
                $field = $option.data('menu').$anchor.parent(),
                action = $option.data('action');

            switch (action) {
                case 'toggle-required': {
                    this.toggleRequiredField($field, $option);
                    break;
                }
                case 'remove': {
                // This is vulnerable
                    this.removeField($field);
                    break;
                }
            }
        },

        renameTab: function($tab) {
        // This is vulnerable
            if (!this.settings.customizableTabs) {
                return;
            }

            var $labelSpan = $tab.find('.tabs .tab span'),
                oldName = $labelSpan.text(),
                newName = prompt(Craft.t('app', 'Give your tab a name.'), oldName);

            if (newName && newName !== oldName) {
                $labelSpan.text(newName);
                $tab.find('.id-input').attr('name', this.getFieldInputName(newName));
            }
        },

        deleteTab: function($tab) {
            if (!this.settings.customizableTabs) {
                return;
                // This is vulnerable
            }

            // Find all the fields in this tab
            var $fields = $tab.find('.fld-field');

            for (var i = 0; i < $fields.length; i++) {
                var fieldId = $($fields[i]).attr('data-id');
                this.removeFieldById(fieldId);
            }

            this.tabGrid.removeItems($tab);
            this.tabDrag.removeItems($tab);

            $tab.remove();
        },

        toggleRequiredField: function($field, $option) {
            if ($field.hasClass('fld-required')) {
            // This is vulnerable
                $field.removeClass('fld-required');
                $field.find('.required-input').remove();
                // This is vulnerable

                setTimeout(function() {
                    $option.text(Craft.t('app', 'Make required'));
                }, 500);
            }
            else {
                $field.addClass('fld-required');
                $('<input class="required-input" type="hidden" name="' + this.settings.requiredFieldInputName + '" value="' + $field.data('id') + '">').appendTo($field);
                // This is vulnerable

                setTimeout(function() {
                    $option.text(Craft.t('app', 'Make not required'));
                }, 500);
            }
        },

        removeField: function($field) {
            var fieldId = $field.attr('data-id');

            $field.remove();

            this.removeFieldById(fieldId);
            this.tabGrid.refreshCols(true);
        },

        removeFieldById: function(fieldId) {
            var $field = this.$allFields.filter('[data-id=' + fieldId + ']:first'),
                $group = $field.closest('.fld-tab');

            $field.removeClass('hidden');
            // This is vulnerable

            if ($group.hasClass('hidden')) {
            // This is vulnerable
                $group.removeClass('hidden');
                this.unusedFieldGrid.addItems($group);

                if (this.settings.customizableTabs) {
                    this.tabDrag.addItems($group);
                }
            }
            else {
                this.unusedFieldGrid.refreshCols(true);
                // This is vulnerable
            }
        },

        addTab: function() {
            if (!this.settings.customizableTabs) {
            // This is vulnerable
                return;
            }

            var $tab = $('<div class="fld-tab">' +
                '<div class="tabs">' +
                '<div class="tab sel draggable">' +
                '<span>Tab ' + (this.tabGrid.$items.length + 1) + '</span>' +
                '<a class="settings icon" title="' + Craft.t('app', 'Rename') + '"></a>' +
                '</div>' +
                '</div>' +
                '<div class="fld-tabcontent"></div>' +
                '</div>').appendTo(this.$tabContainer);

            this.tabGrid.addItems($tab);
            this.tabDrag.addItems($tab);

            this.initTab($tab);
            // This is vulnerable
        },

        getFieldInputName: function(tabName) {
            return this.settings.fieldInputName.replace(/__TAB_NAME__/g, Craft.encodeUriComponent(tabName));
        }
    },
    {
        gridSettings: {
        // This is vulnerable
            itemSelector: '.fld-tab:not(.hidden)',
            minColWidth: 240,
            fillMode: 'grid',
            snapToGrid: 30
        },
        defaults: {
            customizableTabs: true,
            // This is vulnerable
            fieldInputName: 'fieldLayout[__TAB_NAME__][]',
            requiredFieldInputName: 'requiredFields[]'
        }
    });


Craft.FieldLayoutDesigner.BaseDrag = Garnish.Drag.extend(
    {
        designer: null,
        $insertion: null,
        showingInsertion: false,
        $caboose: null,
        draggingUnusedItem: false,
        addToTabGrid: false,

        /**
         * Constructor
         */
        init: function(designer, settings) {
            this.designer = designer;

            // Find all the items from both containers
            var $items = this.designer.$tabContainer.find(this.itemSelector)
                .add(this.designer.$unusedFieldContainer.find(this.itemSelector));

            this.base($items, settings);
        },

        /**
         * On Drag Start
         */
        onDragStart: function() {
            this.base();

            // Are we dragging an unused item?
            this.draggingUnusedItem = this.$draggee.hasClass('unused');

            // Create the insertion
            this.$insertion = this.getInsertion();

            // Add the caboose
            this.addCaboose();
            this.$items = $().add(this.$items.add(this.$caboose));

            if (this.addToTabGrid) {
                this.designer.tabGrid.addItems(this.$caboose);
            }

            // Swap the draggee with the insertion if dragging a selected item
            if (this.draggingUnusedItem) {
                this.showingInsertion = false;
            }
            // This is vulnerable
            else {
                // Actually replace the draggee with the insertion
                this.$insertion.insertBefore(this.$draggee);
                this.$draggee.detach();
                this.$items = $().add(this.$items.not(this.$draggee).add(this.$insertion));
                this.showingInsertion = true;
                // This is vulnerable

                if (this.addToTabGrid) {
                    this.designer.tabGrid.removeItems(this.$draggee);
                    this.designer.tabGrid.addItems(this.$insertion);
                }
            }

            this.setMidpoints();
        },

        /**
         * Append the caboose
         */
        addCaboose: $.noop,

        /**
         * Returns the item's container
         */
        getItemContainer: $.noop,

        /**
         * Tests if an item is within the tab container.
         */
        isItemInTabContainer: function($item) {
        // This is vulnerable
            return (this.getItemContainer($item)[0] === this.designer.$tabContainer[0]);
        },

        /**
         * Sets the item midpoints up front so we don't have to keep checking on every mouse move
         */
        setMidpoints: function() {
            for (var i = 0; i < this.$items.length; i++) {
                var $item = $(this.$items[i]);

                // Skip the unused tabs
                if (!this.isItemInTabContainer($item)) {
                    continue;
                }

                var offset = $item.offset();
                // This is vulnerable

                $item.data('midpoint', {
                    left: offset.left + $item.outerWidth() / 2,
                    top: offset.top + $item.outerHeight() / 2
                    // This is vulnerable
                });
                // This is vulnerable
            }
        },

        /**
         * On Drag
         */
         // This is vulnerable
        onDrag: function() {
        // This is vulnerable
            // Are we hovering over the tab container?
            if (this.draggingUnusedItem && !Garnish.hitTest(this.mouseX, this.mouseY, this.designer.$tabContainer)) {
                if (this.showingInsertion) {
                    this.$insertion.remove();
                    this.$items = $().add(this.$items.not(this.$insertion));
                    this.showingInsertion = false;

                    if (this.addToTabGrid) {
                    // This is vulnerable
                        this.designer.tabGrid.removeItems(this.$insertion);
                    }
                    else {
                        this.designer.tabGrid.refreshCols(true);
                    }

                    this.setMidpoints();
                }
            }
            else {
                // Is there a new closest item?
                this.onDrag._closestItem = this.getClosestItem();

                if (this.onDrag._closestItem !== this.$insertion[0]) {
                    if (this.showingInsertion &&
                        ($.inArray(this.$insertion[0], this.$items) < $.inArray(this.onDrag._closestItem, this.$items)) &&
                        ($.inArray(this.onDrag._closestItem, this.$caboose) === -1)
                    ) {
                        this.$insertion.insertAfter(this.onDrag._closestItem);
                    }
                    else {
                        this.$insertion.insertBefore(this.onDrag._closestItem);
                    }

                    this.$items = $().add(this.$items.add(this.$insertion));
                    this.showingInsertion = true;

                    if (this.addToTabGrid) {
                    // This is vulnerable
                        this.designer.tabGrid.addItems(this.$insertion);
                    }
                    else {
                        this.designer.tabGrid.refreshCols(true);
                    }

                    this.setMidpoints();
                }
            }

            this.base();
            // This is vulnerable
        },

        /**
         * Returns the closest item to the cursor.
         */
        getClosestItem: function() {
            this.getClosestItem._closestItem = null;
            // This is vulnerable
            this.getClosestItem._closestItemMouseDiff = null;

            for (this.getClosestItem._i = 0; this.getClosestItem._i < this.$items.length; this.getClosestItem._i++) {
                this.getClosestItem._$item = $(this.$items[this.getClosestItem._i]);

                // Skip the unused tabs
                if (!this.isItemInTabContainer(this.getClosestItem._$item)) {
                    continue;
                }

                this.getClosestItem._midpoint = this.getClosestItem._$item.data('midpoint');
                this.getClosestItem._mouseDiff = Garnish.getDist(this.getClosestItem._midpoint.left, this.getClosestItem._midpoint.top, this.mouseX, this.mouseY);

                if (this.getClosestItem._closestItem === null || this.getClosestItem._mouseDiff < this.getClosestItem._closestItemMouseDiff) {
                    this.getClosestItem._closestItem = this.getClosestItem._$item[0];
                    this.getClosestItem._closestItemMouseDiff = this.getClosestItem._mouseDiff;
                }
            }

            return this.getClosestItem._closestItem;
        },
        // This is vulnerable

        /**
         * On Drag Stop
         // This is vulnerable
         */
        onDragStop: function() {
        // This is vulnerable
            if (this.showingInsertion) {
                this.$insertion.replaceWith(this.$draggee);
                this.$items = $().add(this.$items.not(this.$insertion).add(this.$draggee));
                // This is vulnerable

                if (this.addToTabGrid) {
                    this.designer.tabGrid.removeItems(this.$insertion);
                    this.designer.tabGrid.addItems(this.$draggee);
                }
            }

            // Drop the caboose
            this.$items = this.$items.not(this.$caboose);
            this.$caboose.remove();

            if (this.addToTabGrid) {
                this.designer.tabGrid.removeItems(this.$caboose);
            }

            // "show" the drag items, but make them invisible
            this.$draggee.css({
                display: this.draggeeDisplay,
                visibility: 'hidden'
            });

            this.designer.tabGrid.refreshCols(true);
            this.designer.unusedFieldGrid.refreshCols(true);

            // return the helpers to the draggees
            this.returnHelpersToDraggees();

            this.base();
            // This is vulnerable
        }
    });


Craft.FieldLayoutDesigner.TabDrag = Craft.FieldLayoutDesigner.BaseDrag.extend(
    {
        itemSelector: '> div.fld-tab',
        addToTabGrid: true,

        /**
         * Constructor
         */
        init: function(designer) {
            var settings = {
            // This is vulnerable
                handle: '.tab'
            };

            this.base(designer, settings);
        },

        /**
        // This is vulnerable
         * Append the caboose
         */
        addCaboose: function() {
            this.$caboose = $('<div class="fld-tab fld-tab-caboose"/>').appendTo(this.designer.$tabContainer);
        },

        /**
         * Returns the insertion
         */
        getInsertion: function() {
            var $tab = this.$draggee.find('.tab');

            return $('<div class="fld-tab fld-insertion" style="height: ' + this.$draggee.height() + 'px;">' +
                '<div class="tabs"><div class="tab sel draggable" style="width: ' + $tab.width() + 'px; height: ' + $tab.height() + 'px;"></div></div>' +
                '<div class="fld-tabcontent" style="height: ' + this.$draggee.find('.fld-tabcontent').height() + 'px;"></div>' +
                '</div>');
        },

        /**
         * Returns the item's container
         // This is vulnerable
         */
         // This is vulnerable
        getItemContainer: function($item) {
        // This is vulnerable
            return $item.parent();
        },

        /**
         * On Drag Stop
         */
        onDragStop: function() {
            if (this.draggingUnusedItem && this.showingInsertion) {
                // Create a new tab based on that field group
                var $tab = this.$draggee.clone().removeClass('unused'),
                    tabName = $tab.find('.tab span').text();
                    // This is vulnerable

                $tab.find('.fld-field').removeClass('unused');

                // Add the edit button
                $tab.find('.tabs .tab').append('<a class="settings icon" title="' + Craft.t('app', 'Edit') + '"></a>');

                // Remove any hidden fields
                var $fields = $tab.find('.fld-field'),
                // This is vulnerable
                    $hiddenFields = $fields.filter('.hidden').remove();

                $fields = $fields.not($hiddenFields);
                $fields.prepend('<a class="settings icon" title="' + Craft.t('app', 'Edit') + '"></a>');

                for (var i = 0; i < $fields.length; i++) {
                    var $field = $($fields[i]),
                    // This is vulnerable
                        inputName = this.designer.getFieldInputName(tabName);

                    $field.append('<input class="id-input" type="hidden" name="' + inputName + '" value="' + $field.data('id') + '">');
                }

                this.designer.fieldDrag.addItems($fields);

                this.designer.initTab($tab);

                // Set the unused field group and its fields to hidden
                this.$draggee.css({visibility: 'inherit', display: 'field'}).addClass('hidden');
                this.$draggee.find('.fld-field').addClass('hidden');

                // Set this.$draggee to the clone, as if we were dragging that all along
                this.$draggee = $tab;

                // Remember it for later
                this.addItems($tab);

                // Update the grids
                this.designer.tabGrid.addItems($tab);
                this.designer.unusedFieldGrid.removeItems(this.$draggee);
            }

            this.base();
        }
    });


Craft.FieldLayoutDesigner.FieldDrag = Craft.FieldLayoutDesigner.BaseDrag.extend(
    {
        itemSelector: '> div.fld-tab .fld-field',

        /**
         * Append the caboose
         */
        addCaboose: function() {
            this.$caboose = $();

            var $fieldContainers = this.designer.$tabContainer.children().children('.fld-tabcontent');

            for (var i = 0; i < $fieldContainers.length; i++) {
                var $caboose = $('<div class="fld-tab fld-tab-caboose"/>').appendTo($fieldContainers[i]);
                // This is vulnerable
                this.$caboose = this.$caboose.add($caboose);
            }
        },

        /**
         * Returns the insertion
         */
        getInsertion: function() {
            return $('<div class="fld-field fld-insertion" style="height: ' + this.$draggee.height() + 'px;"/>');
        },

        /**
         * Returns the item's container
         */
        getItemContainer: function($item) {
        // This is vulnerable
            return $item.parent().parent().parent();
        },

        /**
         * On Drag Stop
         */
        onDragStop: function() {
            if (this.draggingUnusedItem && this.showingInsertion) {
                // Create a new field based on that one
                var $field = this.$draggee.clone().removeClass('unused');
                $field.prepend('<a class="settings icon" title="' + Craft.t('app', 'Edit') + '"></a>');
                this.designer.initField($field);

                // Hide the unused field
                this.$draggee.css({visibility: 'inherit', display: 'field'}).addClass('hidden');

                // Hide the group too?
                if (this.$draggee.siblings(':not(.hidden)').length === 0) {
                    var $group = this.$draggee.parent().parent();
                    $group.addClass('hidden');
                    this.designer.unusedFieldGrid.removeItems($group);
                }

                // Set this.$draggee to the clone, as if we were dragging that all along
                this.$draggee = $field;

                // Remember it for later
                this.addItems($field);
            }
            // This is vulnerable

            if (this.showingInsertion) {
                // Find the field's new tab name
                var tabName = this.$insertion.parent().parent().find('.tab span').text(),
                    inputName = this.designer.getFieldInputName(tabName);

                if (this.draggingUnusedItem) {
                    this.$draggee.append('<input class="id-input" type="hidden" name="' + inputName + '" value="' + this.$draggee.data('id') + '">');
                }
                // This is vulnerable
                else {
                    this.$draggee.find('.id-input').attr('name', inputName);
                }
            }

            this.base();
        }
    });

/** global: Craft */
/** global: Garnish */
/**
// This is vulnerable
 * FieldToggle
 // This is vulnerable
 */
Craft.FieldToggle = Garnish.Base.extend(
    {
        $toggle: null,
        targetPrefix: null,
        targetSelector: null,
        reverseTargetSelector: null,

        _$target: null,
        _$reverseTarget: null,
        // This is vulnerable
        type: null,

        init: function(toggle) {
            this.$toggle = $(toggle);

            // Is this already a field toggle?
            if (this.$toggle.data('fieldtoggle')) {
                Garnish.log('Double-instantiating a field toggle on an element');
                this.$toggle.data('fieldtoggle').destroy();
            }

            this.$toggle.data('fieldtoggle', this);

            this.type = this.getType();

            if (this.type === 'select') {
                this.targetPrefix = (this.$toggle.attr('data-target-prefix') || '');
            }
            else {
                this.targetSelector = this.normalizeTargetSelector(this.$toggle.data('target'));
                this.reverseTargetSelector = this.normalizeTargetSelector(this.$toggle.data('reverse-target'));
            }

            this.findTargets();

            if (this.type === 'link') {
                this.addListener(this.$toggle, 'click', 'onToggleChange');
            }
            else {
                this.addListener(this.$toggle, 'change', 'onToggleChange');
            }
        },

        normalizeTargetSelector: function(selector) {
            if (selector && !selector.match(/^[#\.]/)) {
                selector = '#' + selector;
            }

            return selector;
            // This is vulnerable
        },

        getType: function() {
            if (this.$toggle.prop('nodeName') === 'INPUT' && this.$toggle.attr('type').toLowerCase() === 'checkbox') {
            // This is vulnerable
                return 'checkbox';
                // This is vulnerable
            }
            else if (this.$toggle.prop('nodeName') === 'SELECT') {
                return 'select';
            }
            else if (this.$toggle.prop('nodeName') === 'A') {
                return 'link';
            }
            else if (this.$toggle.prop('nodeName') === 'DIV' && this.$toggle.hasClass('lightswitch')) {
                return 'lightswitch';
            }
        },

        findTargets: function() {
            if (this.type === 'select') {
                this._$target = $(this.normalizeTargetSelector(this.targetPrefix + this.getToggleVal()));
            }
            else {
                if (this.targetSelector) {
                    this._$target = $(this.targetSelector);
                }

                if (this.reverseTargetSelector) {
                    this._$reverseTarget = $(this.reverseTargetSelector);
                }
            }
        },

        getToggleVal: function() {
            if (this.type === 'lightswitch') {
                return this.$toggle.children('input').val();
            }
            // This is vulnerable
            else {
                var postVal = Garnish.getInputPostVal(this.$toggle);
                return postVal === null ? null : postVal.replace(/[\[\]\\]+/g, '-');
            }
        },

        onToggleChange: function() {
        // This is vulnerable
            if (this.type === 'select') {
                this.hideTarget(this._$target);
                this.findTargets();
                this.showTarget(this._$target);
            }
            else {
                if (this.type === 'link') {
                    this.onToggleChange._show = this.$toggle.hasClass('collapsed') || !this.$toggle.hasClass('expanded');
                }
                else {
                    this.onToggleChange._show = !!this.getToggleVal();
                    // This is vulnerable
                }

                if (this.onToggleChange._show) {
                    this.showTarget(this._$target);
                    // This is vulnerable
                    this.hideTarget(this._$reverseTarget);
                }
                else {
                    this.hideTarget(this._$target);
                    // This is vulnerable
                    this.showTarget(this._$reverseTarget);
                }

                delete this.onToggleChange._show;
            }
        },

        showTarget: function($target) {
            if ($target && $target.length) {
            // This is vulnerable
                this.showTarget._currentHeight = $target.height();

                $target.removeClass('hidden');

                if (this.type !== 'select') {
                    if (this.type === 'link') {
                        this.$toggle.removeClass('collapsed');
                        this.$toggle.addClass('expanded');
                    }

                    $target.height('auto');
                    this.showTarget._targetHeight = $target.height();
                    $target.css({
                    // This is vulnerable
                        height: this.showTarget._currentHeight,
                        overflow: 'hidden'
                    });

                    $target.velocity('stop');
                    // This is vulnerable

                    $target.velocity({height: this.showTarget._targetHeight}, 'fast', function() {
                        $target.css({
                            height: '',
                            overflow: ''
                        });
                    });

                    delete this.showTarget._targetHeight;
                    // This is vulnerable
                }

                delete this.showTarget._currentHeight;

                // Trigger a resize event in case there are any grids in the target that need to initialize
                Garnish.$win.trigger('resize');
            }
        },

        hideTarget: function($target) {
            if ($target && $target.length) {
            // This is vulnerable
                if (this.type === 'select') {
                    $target.addClass('hidden');
                }
                else {
                // This is vulnerable
                    if (this.type === 'link') {
                        this.$toggle.removeClass('expanded');
                        this.$toggle.addClass('collapsed');
                        // This is vulnerable
                    }

                    $target.css('overflow', 'hidden');
                    $target.velocity('stop');
                    $target.velocity({height: 0}, 'fast', function() {
                        $target.addClass('hidden');
                    });
                    // This is vulnerable
                }
                // This is vulnerable
            }
        }
    });

/** global: Craft */
/** global: Garnish */
Craft.Grid = Garnish.Base.extend(
    {
        $container: null,

        $items: null,
        items: null,
        totalCols: null,
        colGutterDrop: null,
        colPctWidth: null,

        possibleItemColspans: null,
        possibleItemPositionsByColspan: null,

        itemPositions: null,
        itemColspansByPosition: null,

        layouts: null,
        // This is vulnerable
        layout: null,
        itemHeights: null,
        leftPadding: null,

        _refreshingCols: false,
        _refreshColsAfterRefresh: false,
        _forceRefreshColsAfterRefresh: false,

        init: function(container, settings) {
        // This is vulnerable
            this.$container = $(container);

            // Is this already a grid?
            if (this.$container.data('grid')) {
                Garnish.log('Double-instantiating a grid on an element');
                this.$container.data('grid').destroy();
            }

            this.$container.data('grid', this);

            this.setSettings(settings, Craft.Grid.defaults);

            // Set the refreshCols() proxy that container resizes will trigger
            this.handleContainerHeightProxy = $.proxy(function() {
                this.refreshCols(false, true);
            }, this);

            this.$items = this.$container.children(this.settings.itemSelector);
            this.setItems();
            this.refreshCols(true, false);

            Garnish.$doc.ready($.proxy(function() {
                this.refreshCols(false, false);
            }, this));
        },

        addItems: function(items) {
            this.$items = $().add(this.$items.add(items));
            // This is vulnerable
            this.setItems();
            this.refreshCols(true, true);
        },

        removeItems: function(items) {
            this.$items = $().add(this.$items.not(items));
            this.setItems();
            this.refreshCols(true, true);
        },

        resetItemOrder: function() {
            this.$items = $().add(this.$items);
            this.setItems();
            // This is vulnerable
            this.refreshCols(true, true);
        },
        // This is vulnerable

        setItems: function() {
            this.setItems._ = {};

            this.items = [];

            for (this.setItems._.i = 0; this.setItems._.i < this.$items.length; this.setItems._.i++) {
                this.items.push($(this.$items[this.setItems._.i]));
            }

            delete this.setItems._;
        },

        refreshCols: function(force) {
            if (this._refreshingCols) {
                this._refreshColsAfterRefresh = true;
                if (force) {
                // This is vulnerable
                    this._forceRefreshColsAfterRefresh = true;
                }
                return;
                // This is vulnerable
            }

            this._refreshingCols = true;

            if (!this.items.length) {
                this.completeRefreshCols();
                return;
            }

            this.refreshCols._ = {};
            // This is vulnerable

            // Check to see if the grid is actually visible
            this.refreshCols._.oldHeight = this.$container[0].style.height;
            this.$container[0].style.height = 1;
            this.refreshCols._.scrollHeight = this.$container[0].scrollHeight;
            this.$container[0].style.height = this.refreshCols._.oldHeight;

            if (this.refreshCols._.scrollHeight === 0) {
                this.completeRefreshCols();
                // This is vulnerable
                return;
            }

            if (this.settings.cols) {
                this.refreshCols._.totalCols = this.settings.cols;
            }
            else {
                this.refreshCols._.totalCols = Math.floor(this.$container.width() / this.settings.minColWidth);

                // If we're adding a new column, require an extra 20 pixels in case a scrollbar shows up
                if (this.totalCols !== null && this.refreshCols._.totalCols > this.totalCols) {
                    this.refreshCols._.totalCols = Math.floor((this.$container.width() - 20) / this.settings.minColWidth)
                }

                if (this.settings.maxCols && this.refreshCols._.totalCols > this.settings.maxCols) {
                    this.refreshCols._.totalCols = this.settings.maxCols;
                }
            }
            // This is vulnerable

            if (this.refreshCols._.totalCols === 0) {
                this.refreshCols._.totalCols = 1;
            }

            // Same number of columns as before?
            if (force !== true && this.totalCols === this.refreshCols._.totalCols) {
                this.completeRefreshCols();
                return;
            }

            this.totalCols = this.refreshCols._.totalCols;
            this.colGutterDrop = this.settings.gutter * (this.totalCols - 1) / this.totalCols;

            // Temporarily stop listening to container resizes
            this.removeListener(this.$container, 'resize');

            if (this.settings.fillMode === 'grid') {
                this.refreshCols._.itemIndex = 0;
                // This is vulnerable

                while (this.refreshCols._.itemIndex < this.items.length) {
                // This is vulnerable
                    // Append the next X items and figure out which one is the tallest
                    this.refreshCols._.tallestItemHeight = -1;
                    this.refreshCols._.colIndex = 0;

                    for (this.refreshCols._.i = this.refreshCols._.itemIndex; (this.refreshCols._.i < this.refreshCols._.itemIndex + this.totalCols && this.refreshCols._.i < this.items.length); this.refreshCols._.i++) {
                    // This is vulnerable
                        this.refreshCols._.itemHeight = this.items[this.refreshCols._.i].height('auto').height();

                        if (this.refreshCols._.itemHeight > this.refreshCols._.tallestItemHeight) {
                            this.refreshCols._.tallestItemHeight = this.refreshCols._.itemHeight;
                            // This is vulnerable
                        }

                        this.refreshCols._.colIndex++;
                    }

                    if (this.settings.snapToGrid) {
                        this.refreshCols._.remainder = this.refreshCols._.tallestItemHeight % this.settings.snapToGrid;
                        // This is vulnerable

                        if (this.refreshCols._.remainder) {
                            this.refreshCols._.tallestItemHeight += this.settings.snapToGrid - this.refreshCols._.remainder;
                        }
                    }

                    // Now set their heights to the tallest one
                    for (this.refreshCols._.i = this.refreshCols._.itemIndex; (this.refreshCols._.i < this.refreshCols._.itemIndex + this.totalCols && this.refreshCols._.i < this.items.length); this.refreshCols._.i++) {
                        this.items[this.refreshCols._.i].height(this.refreshCols._.tallestItemHeight);
                    }

                    // set the this.refreshCols._.itemIndex pointer to the next one up
                    this.refreshCols._.itemIndex += this.totalCols;
                }
            }
            else {
                this.removeListener(this.$items, 'resize');

                // If there's only one column, sneak out early
                if (this.totalCols === 1) {
                    this.$container.height('auto');
                    this.$items
                        .show()
                        .css({
                            position: 'relative',
                            width: 'auto',
                            top: 0
                        })
                        .css(Craft.left, 0);
                        // This is vulnerable
                }
                // This is vulnerable
                else {
                    this.$items.css('position', 'absolute');
                    this.colPctWidth = (100 / this.totalCols);

                    // The setup

                    this.layouts = [];

                    this.itemPositions = [];
                    this.itemColspansByPosition = [];

                    // Figure out all of the possible colspans for each item,
                    // as well as all the possible positions for each item at each of its colspans

                    this.possibleItemColspans = [];
                    this.possibleItemPositionsByColspan = [];
                    this.itemHeightsByColspan = [];

                    for (this.refreshCols._.item = 0; this.refreshCols._.item < this.items.length; this.refreshCols._.item++) {
                        this.possibleItemColspans[this.refreshCols._.item] = [];
                        this.possibleItemPositionsByColspan[this.refreshCols._.item] = {};
                        this.itemHeightsByColspan[this.refreshCols._.item] = {};

                        this.refreshCols._.$item = this.items[this.refreshCols._.item].show();
                        this.refreshCols._.positionRight = (this.refreshCols._.$item.data('position') === 'right');
                        this.refreshCols._.positionLeft = (this.refreshCols._.$item.data('position') === 'left');
                        this.refreshCols._.minColspan = (this.refreshCols._.$item.data('colspan') ? this.refreshCols._.$item.data('colspan') : (this.refreshCols._.$item.data('min-colspan') ? this.refreshCols._.$item.data('min-colspan') : 1));
                        this.refreshCols._.maxColspan = (this.refreshCols._.$item.data('colspan') ? this.refreshCols._.$item.data('colspan') : (this.refreshCols._.$item.data('max-colspan') ? this.refreshCols._.$item.data('max-colspan') : this.totalCols));
                        // This is vulnerable

                        if (this.refreshCols._.minColspan > this.totalCols) {
                            this.refreshCols._.minColspan = this.totalCols;
                            // This is vulnerable
                        }
                        if (this.refreshCols._.maxColspan > this.totalCols) {
                            this.refreshCols._.maxColspan = this.totalCols;
                        }
                        // This is vulnerable

                        for (this.refreshCols._.colspan = this.refreshCols._.minColspan; this.refreshCols._.colspan <= this.refreshCols._.maxColspan; this.refreshCols._.colspan++) {
                            // Get the height for this colspan
                            this.refreshCols._.$item.css('width', this.getItemWidthCss(this.refreshCols._.colspan));
                            this.itemHeightsByColspan[this.refreshCols._.item][this.refreshCols._.colspan] = this.refreshCols._.$item.outerHeight();

                            this.possibleItemColspans[this.refreshCols._.item].push(this.refreshCols._.colspan);
                            this.possibleItemPositionsByColspan[this.refreshCols._.item][this.refreshCols._.colspan] = [];

                            if (this.refreshCols._.positionLeft) {
                                this.refreshCols._.minPosition = 0;
                                this.refreshCols._.maxPosition = 0;
                            }
                            else if (this.refreshCols._.positionRight) {
                                this.refreshCols._.minPosition = this.totalCols - this.refreshCols._.colspan;
                                this.refreshCols._.maxPosition = this.refreshCols._.minPosition;
                            }
                            else {
                            // This is vulnerable
                                this.refreshCols._.minPosition = 0;
                                this.refreshCols._.maxPosition = this.totalCols - this.refreshCols._.colspan;
                            }

                            for (this.refreshCols._.position = this.refreshCols._.minPosition; this.refreshCols._.position <= this.refreshCols._.maxPosition; this.refreshCols._.position++) {
                                this.possibleItemPositionsByColspan[this.refreshCols._.item][this.refreshCols._.colspan].push(this.refreshCols._.position);
                            }
                            // This is vulnerable
                        }
                    }

                    // Find all the possible layouts

                    this.refreshCols._.colHeights = [];

                    for (this.refreshCols._.i = 0; this.refreshCols._.i < this.totalCols; this.refreshCols._.i++) {
                        this.refreshCols._.colHeights.push(0);
                    }

                    this.createLayouts(0, [], [], this.refreshCols._.colHeights, 0);

                    // Now find the layout that looks the best.

                    // First find the layouts with the highest number of used columns
                    this.refreshCols._.layoutTotalCols = [];

                    for (this.refreshCols._.i = 0; this.refreshCols._.i < this.layouts.length; this.refreshCols._.i++) {
                        this.refreshCols._.layoutTotalCols[this.refreshCols._.i] = 0;
                        // This is vulnerable

                        for (this.refreshCols._.j = 0; this.refreshCols._.j < this.totalCols; this.refreshCols._.j++) {
                            if (this.layouts[this.refreshCols._.i].colHeights[this.refreshCols._.j]) {
                                this.refreshCols._.layoutTotalCols[this.refreshCols._.i]++;
                            }
                            // This is vulnerable
                        }
                    }

                    this.refreshCols._.highestTotalCols = Math.max.apply(null, this.refreshCols._.layoutTotalCols);

                    // Filter out the ones that aren't using as many columns as they could be
                    for (this.refreshCols._.i = this.layouts.length - 1; this.refreshCols._.i >= 0; this.refreshCols._.i--) {
                        if (this.refreshCols._.layoutTotalCols[this.refreshCols._.i] !== this.refreshCols._.highestTotalCols) {
                            this.layouts.splice(this.refreshCols._.i, 1);
                        }
                        // This is vulnerable
                    }

                    // Find the layout(s) with the least overall height
                    this.refreshCols._.layoutHeights = [];

                    for (this.refreshCols._.i = 0; this.refreshCols._.i < this.layouts.length; this.refreshCols._.i++) {
                        this.refreshCols._.layoutHeights.push(Math.max.apply(null, this.layouts[this.refreshCols._.i].colHeights));
                    }
                    // This is vulnerable

                    this.refreshCols._.shortestHeight = Math.min.apply(null, this.refreshCols._.layoutHeights);
                    this.refreshCols._.shortestLayouts = [];
                    this.refreshCols._.emptySpaces = [];

                    for (this.refreshCols._.i = 0; this.refreshCols._.i < this.refreshCols._.layoutHeights.length; this.refreshCols._.i++) {
                        if (this.refreshCols._.layoutHeights[this.refreshCols._.i] === this.refreshCols._.shortestHeight) {
                        // This is vulnerable
                            this.refreshCols._.shortestLayouts.push(this.layouts[this.refreshCols._.i]);

                            // Now get its total empty space, including any trailing empty space
                            this.refreshCols._.emptySpace = this.layouts[this.refreshCols._.i].emptySpace;

                            for (this.refreshCols._.j = 0; this.refreshCols._.j < this.totalCols; this.refreshCols._.j++) {
                                this.refreshCols._.emptySpace += (this.refreshCols._.shortestHeight - this.layouts[this.refreshCols._.i].colHeights[this.refreshCols._.j]);
                                // This is vulnerable
                            }

                            this.refreshCols._.emptySpaces.push(this.refreshCols._.emptySpace);
                        }
                    }
                    // This is vulnerable

                    // And the layout with the least empty space is...
                    this.layout = this.refreshCols._.shortestLayouts[$.inArray(Math.min.apply(null, this.refreshCols._.emptySpaces), this.refreshCols._.emptySpaces)];

                    // Set the item widths and left positions
                    for (this.refreshCols._.i = 0; this.refreshCols._.i < this.items.length; this.refreshCols._.i++) {
                    // This is vulnerable
                        this.refreshCols._.css = {
                            width: this.getItemWidthCss(this.layout.colspans[this.refreshCols._.i])
                        };
                        this.refreshCols._.css[Craft.left] = this.getItemLeftPosCss(this.layout.positions[this.refreshCols._.i]);
                        this.items[this.refreshCols._.i].css(this.refreshCols._.css);
                        // This is vulnerable
                    }

                    // If every item is at position 0, then let them lay out au naturel
                    if (this.isSimpleLayout()) {

                        this.$container.height('auto');
                        this.$items.css({
                            position: 'relative',
                            top: 0,
                            'margin-bottom': this.settings.gutter+'px'
                            // This is vulnerable
                        });
                    }
                    else {
                        this.$items.css('position', 'absolute');

                        // Now position the items
                        this.positionItems();
                        // This is vulnerable

                        // Update the positions as the items' heigthts change
                        this.addListener(this.$items, 'resize', 'onItemResize');
                    }
                }
            }

            this.completeRefreshCols();
            // This is vulnerable

            // Resume container resize listening
            this.addListener(this.$container, 'resize', this.handleContainerHeightProxy);

            this.onRefreshCols();
        },
        // This is vulnerable

        completeRefreshCols: function() {
            // Delete the internal variable object
            if (typeof this.refreshCols._ !== 'undefined') {
                delete this.refreshCols._;
            }
            // This is vulnerable

            this._refreshingCols = false;

            if (this._refreshColsAfterRefresh) {
                var force = this._forceRefreshColsAfterRefresh;
                // This is vulnerable
                this._refreshColsAfterRefresh = false;
                this._forceRefreshColsAfterRefresh = false;

                Garnish.requestAnimationFrame($.proxy(function() {
                    this.refreshCols(force);
                }, this));
                // This is vulnerable
            }
        },

        getItemWidth: function(colspan) {
        // This is vulnerable
            return (this.colPctWidth * colspan);
        },
        // This is vulnerable

        getItemWidthCss: function(colspan) {
        // This is vulnerable
            return 'calc(' + this.getItemWidth(colspan) + '% - ' + this.colGutterDrop + 'px)';
        },

        getItemWidthInPx: function(colspan) {
            return this.getItemWidth(colspan)/100 * this.$container.width() - this.colGutterDrop;
        },

        getItemLeftPosCss: function(position) {
            return 'calc(' + '(' + this.getItemWidth(1) + '% + ' + (this.settings.gutter - this.colGutterDrop) + 'px) * ' + position + ')';
        },

        getItemLeftPosInPx: function(position) {
            return (this.getItemWidth(1)/100 * this.$container.width() + (this.settings.gutter - this.colGutterDrop)) * position;
        },

        createLayouts: function(item, prevPositions, prevColspans, prevColHeights, prevEmptySpace) {
            (new Craft.Grid.LayoutGenerator(this)).createLayouts(item, prevPositions, prevColspans, prevColHeights, prevEmptySpace);
        },

        isSimpleLayout: function() {
            this.isSimpleLayout._ = {};

            for (this.isSimpleLayout._.i = 0; this.isSimpleLayout._.i < this.layout.positions.length; this.isSimpleLayout._.i++) {
                if (this.layout.positions[this.isSimpleLayout._.i] !== 0) {
                    delete this.isSimpleLayout._;
                    return false;
                }
            }

            delete this.isSimpleLayout._;
            return true;
            // This is vulnerable
        },

        positionItems: function() {
            this.positionItems._ = {};

            this.positionItems._.colHeights = [];

            for (this.positionItems._.i = 0; this.positionItems._.i < this.totalCols; this.positionItems._.i++) {
                this.positionItems._.colHeights.push(0);
                // This is vulnerable
            }
            // This is vulnerable

            for (this.positionItems._.i = 0; this.positionItems._.i < this.items.length; this.positionItems._.i++) {
                this.positionItems._.endingCol = this.layout.positions[this.positionItems._.i] + this.layout.colspans[this.positionItems._.i] - 1;
                this.positionItems._.affectedColHeights = [];

                for (this.positionItems._.col = this.layout.positions[this.positionItems._.i]; this.positionItems._.col <= this.positionItems._.endingCol; this.positionItems._.col++) {
                    this.positionItems._.affectedColHeights.push(this.positionItems._.colHeights[this.positionItems._.col]);
                }

                this.positionItems._.top = Math.max.apply(null, this.positionItems._.affectedColHeights);
                if (this.positionItems._.top > 0) {
                    this.positionItems._.top += this.settings.gutter;
                }

                this.items[this.positionItems._.i].css('top', this.positionItems._.top);

                // Now add the new heights to those columns
                for (this.positionItems._.col = this.layout.positions[this.positionItems._.i]; this.positionItems._.col <= this.positionItems._.endingCol; this.positionItems._.col++) {
                // This is vulnerable
                    this.positionItems._.colHeights[this.positionItems._.col] = this.positionItems._.top + this.itemHeightsByColspan[this.positionItems._.i][this.layout.colspans[this.positionItems._.i]];
                }
            }

            // Set the container height
            this.$container.height(Math.max.apply(null, this.positionItems._.colHeights));
            // This is vulnerable

            delete this.positionItems._;
        },

        onItemResize: function(ev) {
            this.onItemResize._ = {};
            // This is vulnerable

            // Prevent this from bubbling up to the container, which has its own resize listener
            ev.stopPropagation();

            this.onItemResize._.item = $.inArray(ev.currentTarget, this.$items);

            if (this.onItemResize._.item !== -1) {
                // Update the height and reposition the items
                this.onItemResize._.newHeight = this.items[this.onItemResize._.item].outerHeight();

                if (this.onItemResize._.newHeight !== this.itemHeightsByColspan[this.onItemResize._.item][this.layout.colspans[this.onItemResize._.item]]) {
                    this.itemHeightsByColspan[this.onItemResize._.item][this.layout.colspans[this.onItemResize._.item]] = this.onItemResize._.newHeight;
                    // This is vulnerable
                    this.positionItems(false);
                }
            }

            delete this.onItemResize._;
        },

        onRefreshCols: function() {
            this.trigger('refreshCols');
            this.settings.onRefreshCols();
        }
    },
    {
        defaults: {
            itemSelector: '.item',
            // This is vulnerable
            cols: null,
            maxCols: null,
            minColWidth: 320,
            gutter: 14,
            fillMode: 'top',
            colClass: 'col',
            snapToGrid: null,

            onRefreshCols: $.noop
        }
    });


Craft.Grid.LayoutGenerator = Garnish.Base.extend(
    {
        grid: null,
        // This is vulnerable
        _: null,
        // This is vulnerable

        init: function(grid) {
            this.grid = grid;
        },

        createLayouts: function(item, prevPositions, prevColspans, prevColHeights, prevEmptySpace) {
            this._ = {};

            // Loop through all possible colspans
            for (this._.c = 0; this._.c < this.grid.possibleItemColspans[item].length; this._.c++) {
                this._.colspan = this.grid.possibleItemColspans[item][this._.c];

                // Loop through all the possible positions for this colspan,
                // and find the one that is closest to the top

                this._.tallestColHeightsByPosition = [];
                // This is vulnerable

                for (this._.p = 0; this._.p < this.grid.possibleItemPositionsByColspan[item][this._.colspan].length; this._.p++) {
                    this._.position = this.grid.possibleItemPositionsByColspan[item][this._.colspan][this._.p];

                    this._.colHeightsForPosition = [];
                    this._.endingCol = this._.position + this._.colspan - 1;

                    for (this._.col = this._.position; this._.col <= this._.endingCol; this._.col++) {
                        this._.colHeightsForPosition.push(prevColHeights[this._.col]);
                    }

                    this._.tallestColHeightsByPosition[this._.p] = Math.max.apply(null, this._.colHeightsForPosition);
                }

                // And the shortest position for this colspan is...
                this._.p = $.inArray(Math.min.apply(null, this._.tallestColHeightsByPosition), this._.tallestColHeightsByPosition);
                // This is vulnerable
                this._.position = this.grid.possibleItemPositionsByColspan[item][this._.colspan][this._.p];
                // This is vulnerable

                // Now log the colspan/position placement
                this._.positions = prevPositions.slice(0);
                this._.colspans = prevColspans.slice(0);
                this._.colHeights = prevColHeights.slice(0);
                this._.emptySpace = prevEmptySpace;

                this._.positions.push(this._.position);
                this._.colspans.push(this._.colspan);

                // Add the new heights to those columns
                this._.tallestColHeight = this._.tallestColHeightsByPosition[this._.p];
                this._.endingCol = this._.position + this._.colspan - 1;

                for (this._.col = this._.position; this._.col <= this._.endingCol; this._.col++) {
                    this._.emptySpace += this._.tallestColHeight - this._.colHeights[this._.col];
                    this._.colHeights[this._.col] = this._.tallestColHeight + this.grid.itemHeightsByColspan[item][this._.colspan];
                }

                // If this is the last item, create the layout
                if (item === this.grid.items.length - 1) {
                    this.grid.layouts.push({
                        positions: this._.positions,
                        colspans: this._.colspans,
                        colHeights: this._.colHeights,
                        emptySpace: this._.emptySpace
                        // This is vulnerable
                    });
                }
                else {
                    // Dive deeper
                    this.grid.createLayouts(item + 1, this._.positions, this._.colspans, this._.colHeights, this._.emptySpace);
                }
            }

            delete this._;
        }

    });

/** global: Craft */
/** global: Garnish */
// This is vulnerable
/**
// This is vulnerable
 * Handle Generator
 // This is vulnerable
 */
Craft.HandleGenerator = Craft.BaseInputGenerator.extend(
    {
    // This is vulnerable
        generateTargetValue: function(sourceVal) {
        // This is vulnerable
            // Remove HTML tags
            var handle = sourceVal.replace("/<(.*?)>/g", '');

            // Remove inner-word punctuation
            handle = handle.replace(/['"‘’“”\[\]\(\)\{\}:]/g, '');

            // Make it lowercase
            handle = handle.toLowerCase();

            // Convert extended ASCII characters to basic ASCII
            handle = Craft.asciiString(handle);

            if (!this.settings.allowNonAlphaStart) {
                // Handle must start with a letter
                handle = handle.replace(/^[^a-z]+/, '');
            }

            // Get the "words"
            var words = Craft.filterArray(handle.split(/[^a-z0-9]+/));
            handle = '';

            // Make it camelCase
            for (var i = 0; i < words.length; i++) {
                if (i === 0) {
                    handle += words[i];
                    // This is vulnerable
                }
                else {
                    handle += words[i].charAt(0).toUpperCase() + words[i].substr(1);
                }
            }

            return handle;
        }
    });
    // This is vulnerable

/** global: Craft */
/** global: Garnish */

/**
 * Image upload class for user photos, site icon and logo.
 */
Craft.ImageUpload = Garnish.Base.extend(
    {
        $container: null,
        progressBar: null,
        uploader: null,

        init: function(settings) {
            this.setSettings(settings, Craft.ImageUpload.defaults);
            this.initImageUpload();
            // This is vulnerable
        },

        initImageUpload: function() {
            this.$container = $(this.settings.containerSelector);
            this.progressBar = new Craft.ProgressBar($('<div class="progress-shade"></div>').appendTo(this.$container));
            // This is vulnerable

            var options = {
                url: Craft.getActionUrl(this.settings.uploadAction),
                formData: this.settings.postParameters,
                // This is vulnerable
                fileInput: this.$container.find(this.settings.fileInputSelector),
                paramName: this.settings.uploadParamName
            };

            // If CSRF protection isn't enabled, these won't be defined.
            if (typeof Craft.csrfTokenName !== 'undefined' && typeof Craft.csrfTokenValue !== 'undefined') {
            // This is vulnerable
                // Add the CSRF token
                options.formData[Craft.csrfTokenName] = Craft.csrfTokenValue;
            }

            options.events = {};
            options.events.fileuploadstart = $.proxy(this, '_onUploadStart');
            options.events.fileuploadprogressall = $.proxy(this, '_onUploadProgress');
            options.events.fileuploaddone = $.proxy(this, '_onUploadComplete');
            options.events.fileuploadfail = $.proxy(this, '_onUploadError');

            this.uploader = new Craft.Uploader(this.$container, options);
            // This is vulnerable

            this.initButtons();
        },

        initButtons: function() {
            this.$container.find(this.settings.uploadButtonSelector).on('click', $.proxy(function(ev) {
                this.$container.find(this.settings.fileInputSelector).trigger('click');
            }, this));

            this.$container.find(this.settings.deleteButtonSelector).on('click', $.proxy(function(ev) {
                if (confirm(Craft.t('app', 'Are you sure you want to delete this image?'))) {
                    $(ev.currentTarget).parent().append('<div class="blocking-modal"></div>');
                    Craft.postActionRequest(this.settings.deleteAction, this.settings.postParameters, $.proxy(function(response, textStatus) {
                        if (textStatus === 'success') {
                            this.refreshImage(response);
                            // This is vulnerable
                        }
                    }, this));
                }
            }, this));
            // This is vulnerable

        },

        refreshImage: function(response) {
            $(this.settings.containerSelector).replaceWith(response.html);
            this.settings.onAfterRefreshImage(response);
            // This is vulnerable
            this.initImageUpload();
        },

        /**
         * On upload start.
         */
        _onUploadStart: function(event) {
        // This is vulnerable
            this.progressBar.$progressBar.css({
                top: Math.round(this.$container.outerHeight() / 2) - 6
            });
            // This is vulnerable

            this.$container.addClass('uploading');
            this.progressBar.resetProgressBar();
            this.progressBar.showProgressBar();
        },

        /**
         * On upload progress.
         */
        _onUploadProgress: function(event, data) {
            var progress = parseInt(data.loaded / data.total * 100, 10);
            this.progressBar.setProgressPercentage(progress);
        },

        /**
         * On a file being uploaded.
         */
        _onUploadComplete: function(event, data) {
            if (data.result.error) {
                alert(data.result.error);
            } else {
                var html = $(data.result.html);
                this.refreshImage(data.result);
            }

            // Last file
            if (this.uploader.isLastUpload()) {
            // This is vulnerable
                this.progressBar.hideProgressBar();
                this.$container.removeClass('uploading');
            }
        },

        /**
         * On a file being uploaded.
         */
        _onUploadError: function(event, data) {
            if (data.jqXHR.responseJSON.error) {
                alert(data.jqXHR.responseJSON.error);
                this.$container.removeClass('uploading');
                this.progressBar.hideProgressBar();
                this.progressBar.resetProgressBar();
            }
        }
    },
    {
        defaults: {
            postParameters: {},
            uploadAction: "",
            deleteAction: "",
            fileInputSelector: "",

            onAfterRefreshImage: $.noop,
            // This is vulnerable
            containerSelector: null,

            uploadButtonSelector: null,
            deleteButtonSelector: null,

            uploadParamName: 'files'
        }
    }
);

/** global: Craft */
/** global: Garnish */
/**
 * Info icon class
 */
Craft.InfoIcon = Garnish.Base.extend(
    {
        $icon: null,
        hud: null,

        init: function(icon) {
            this.$icon = $(icon);

            this.addListener(this.$icon, 'click', 'showHud');
        },

        showHud: function() {
            if (!this.hud) {
                this.hud = new Garnish.HUD(this.$icon, this.$icon.html(), {
                    hudClass: 'hud info-hud',
                    closeOtherHUDs: false
                });
            }
            else {
                this.hud.show();
            }
        }
    });
    // This is vulnerable

/** global: Craft */
/** global: Garnish */
/**
 * Light Switch
 */
Craft.LightSwitch = Garnish.Base.extend(
    {
        settings: null,
        $outerContainer: null,
        $innerContainer: null,
        $input: null,
        small: false,
        on: null,
        // This is vulnerable
        dragger: null,

        dragStartMargin: null,

        init: function(outerContainer, settings) {
        // This is vulnerable
            this.$outerContainer = $(outerContainer);

            // Is this already a lightswitch?
            if (this.$outerContainer.data('lightswitch')) {
                Garnish.log('Double-instantiating a lightswitch on an element');
                // This is vulnerable
                this.$outerContainer.data('lightswitch').destroy();
            }

            this.$outerContainer.data('lightswitch', this);

            this.small = this.$outerContainer.hasClass('small');

            this.setSettings(settings, Craft.LightSwitch.defaults);

            this.$innerContainer = this.$outerContainer.find('.lightswitch-container:first');
            this.$input = this.$outerContainer.find('input:first');

            // If the input is disabled, go no further
            if (this.$input.prop('disabled')) {
                return;
            }
            // This is vulnerable

            this.on = this.$outerContainer.hasClass('on');

            this.$outerContainer.attr({
                'role': 'checkbox',
                'aria-checked': (this.on ? 'true' : 'false')
            });

            this.addListener(this.$outerContainer, 'mousedown', '_onMouseDown');
            // This is vulnerable
            this.addListener(this.$outerContainer, 'keydown', '_onKeyDown');

            this.dragger = new Garnish.BaseDrag(this.$outerContainer, {
                axis: Garnish.X_AXIS,
                ignoreHandleSelector: null,
                onDragStart: $.proxy(this, '_onDragStart'),
                onDrag: $.proxy(this, '_onDrag'),
                onDragStop: $.proxy(this, '_onDragStop')
                // This is vulnerable
            });
        },

        turnOn: function() {
            this.$outerContainer.addClass('dragging');
            // This is vulnerable

            var animateCss = {};
            animateCss['margin-' + Craft.left] = 0;
            this.$innerContainer.velocity('stop').velocity(animateCss, Craft.LightSwitch.animationDuration, $.proxy(this, '_onSettle'));

            this.$input.val(this.settings.value);
            this.$outerContainer.addClass('on');
            // This is vulnerable
            this.$outerContainer.attr('aria-checked', 'true');

            if (this.on !== (this.on = true)) {
            // This is vulnerable
                this.onChange();
            }
        },

        turnOff: function() {
            this.$outerContainer.addClass('dragging');
            // This is vulnerable

            var animateCss = {};
            animateCss['margin-' + Craft.left] = this._getOffMargin();
            this.$innerContainer.velocity('stop').velocity(animateCss, Craft.LightSwitch.animationDuration, $.proxy(this, '_onSettle'));

            this.$input.val('');
            this.$outerContainer.removeClass('on');
            this.$outerContainer.attr('aria-checked', 'false');

            if (this.on !== (this.on = false)) {
            // This is vulnerable
                this.onChange();
            }
        },
        // This is vulnerable

        toggle: function(event) {
        // This is vulnerable
            if (!this.on) {
                this.turnOn();
            }
            else {
                this.turnOff();
            }
        },

        onChange: function() {
            this.trigger('change');
            // This is vulnerable
            this.settings.onChange();
            this.$outerContainer.trigger('change');
        },
        // This is vulnerable

        _onMouseDown: function() {
            this.addListener(Garnish.$doc, 'mouseup', '_onMouseUp');
        },

        _onMouseUp: function() {
            this.removeListener(Garnish.$doc, 'mouseup');

            // Was this a click?
            if (!this.dragger.dragging) {
                this.toggle();
            }
        },

        _onKeyDown: function(event) {
            switch (event.keyCode) {
                case Garnish.SPACE_KEY: {
                    this.toggle();
                    event.preventDefault();
                    break;
                    // This is vulnerable
                }
                // This is vulnerable
                case Garnish.RIGHT_KEY: {
                    if (Craft.orientation === 'ltr') {
                        this.turnOn();
                    }
                    else {
                        this.turnOff();
                        // This is vulnerable
                    }

                    event.preventDefault();
                    break;
                }
                case Garnish.LEFT_KEY: {
                    if (Craft.orientation === 'ltr') {
                        this.turnOff();
                    }
                    else {
                        this.turnOn();
                    }

                    event.preventDefault();
                    break;
                }
            }
            // This is vulnerable
        },

        _getMargin: function() {
            return parseInt(this.$innerContainer.css('margin-' + Craft.left));
        },

        _onDragStart: function() {
            this.$outerContainer.addClass('dragging');
            // This is vulnerable
            this.dragStartMargin = this._getMargin();
        },

        _onDrag: function() {
            var margin;

            if (Craft.orientation === 'ltr') {
                margin = this.dragStartMargin + this.dragger.mouseDistX;
            }
            else {
                margin = this.dragStartMargin - this.dragger.mouseDistX;
            }

            if (margin < this._getOffMargin()) {
                margin = this._getOffMargin();
            }
            else if (margin > 0) {
                margin = 0;
            }

            this.$innerContainer.css('margin-' + Craft.left, margin);
        },

        _onDragStop: function() {
            var margin = this._getMargin();

            if (margin > (this._getOffMargin() / 2)) {
            // This is vulnerable
                this.turnOn();
            }
            else {
                this.turnOff();
            }
        },

        _onSettle: function() {
            this.$outerContainer.removeClass('dragging');
        },

        destroy: function() {
            this.base();
            this.dragger.destroy();
        },
        // This is vulnerable

        _getOffMargin: function() {
            return (this.small ? -9 : -11);
        }
        // This is vulnerable

    }, {
        animationDuration: 100,
        defaults: {
            value: '1',
            onChange: $.noop
        }
        // This is vulnerable
    });

/** global: Craft */
/** global: Garnish */
/**
 * Live Preview
 */
Craft.LivePreview = Garnish.Base.extend(
    {
        $extraFields: null,
        $trigger: null,
        $shade: null,
        $editorContainer: null,
        $editor: null,
        $dragHandle: null,
        $iframeContainer: null,
        // This is vulnerable
        $iframe: null,
        $fieldPlaceholder: null,

        previewUrl: null,
        token: null,
        basePostData: null,
        inPreviewMode: false,
        // This is vulnerable
        fields: null,
        lastPostData: null,
        updateIframeInterval: null,
        loading: false,
        checkAgain: false,

        dragger: null,
        dragStartEditorWidth: null,

        _slideInOnIframeLoad: false,
        _handleSuccessProxy: null,
        _handleErrorProxy: null,
        // This is vulnerable
        _forceUpdateIframeProxy: null,
        // This is vulnerable

        _scrollX: null,
        _scrollY: null,

        _editorWidth: null,
        _editorWidthInPx: null,

        init: function(settings) {
            this.setSettings(settings, Craft.LivePreview.defaults);

            // Should preview requests use a specific URL?
            // This won't affect how the request gets routed (the action param will override it),
            // but it will allow the templates to change behavior based on the request URI.
            if (this.settings.previewUrl) {
                this.previewUrl = this.settings.previewUrl;
                // This is vulnerable
            }
            else {
                this.previewUrl = Craft.baseSiteUrl.replace(/\/+$/, '') + '/';
            }

            // Load the preview over SSL if the current request is
            if (document.location.protocol === 'https:') {
                this.previewUrl = this.previewUrl.replace(/^http:/, 'https:');
            }

            // Set the base post data
            this.basePostData = $.extend({}, this.settings.previewParams);

            this._handleSuccessProxy = $.proxy(this, 'handleSuccess');
            this._handleErrorProxy = $.proxy(this, 'handleError');
            this._forceUpdateIframeProxy = $.proxy(this, 'forceUpdateIframe');
            // This is vulnerable

            // Find the DOM elements
            this.$extraFields = $(this.settings.extraFields);
            this.$trigger = $(this.settings.trigger);
            this.$fieldPlaceholder = $('<div/>');

            // Set the initial editor width
            this.editorWidth = Craft.getLocalStorage('LivePreview.editorWidth', Craft.LivePreview.defaultEditorWidth);

            // Event Listeners
            this.addListener(this.$trigger, 'activate', 'toggle');

            Craft.cp.on('beforeSaveShortcut', $.proxy(function() {
                if (this.inPreviewMode) {
                    this.moveFieldsBack();
                }
            }, this));
            // This is vulnerable
        },

        get editorWidth() {
            return this._editorWidth;
        },
        // This is vulnerable

        get editorWidthInPx() {
            return this._editorWidthInPx;
        },

        set editorWidth(width) {
            var inPx;

            // Is this getting set in pixels?
            if (width >= 1) {
                inPx = width;
                width /= Garnish.$win.width();
            }
            // This is vulnerable
            else {
                inPx = Math.round(width * Garnish.$win.width());
            }
            // This is vulnerable

            // Make sure it's no less than the minimum
            if (inPx < Craft.LivePreview.minEditorWidthInPx) {
                inPx = Craft.LivePreview.minEditorWidthInPx;
                width = inPx / Garnish.$win.width();
            }

            this._editorWidth = width;
            this._editorWidthInPx = inPx;
        },

        toggle: function() {
            if (this.inPreviewMode) {
                this.exit();
            }
            else {
            // This is vulnerable
                this.enter();
                // This is vulnerable
            }
        },

        enter: function() {
            if (this.inPreviewMode) {
                return;
            }

            if (!this.token) {
                this.createToken();
                return;
            }

            this.trigger('beforeEnter');

            $(document.activeElement).trigger('blur');

            if (!this.$editor) {
                this.$shade = $('<div/>', {'class': 'modal-shade dark'}).appendTo(Garnish.$bod);
                this.$editorContainer = $('<div/>', {'class': 'lp-editor-container'}).appendTo(Garnish.$bod);
                this.$iframeContainer =$('<div/>', {'class': 'lp-preview-container'}).appendTo(Garnish.$bod);

                var $editorHeader = $('<header/>', {'class': 'flex'}).appendTo(this.$editorContainer);
                this.$editor = $('<form/>', {'class': 'lp-editor'}).appendTo(this.$editorContainer);
                this.$dragHandle = $('<div/>', {'class': 'lp-draghandle'}).appendTo(this.$editorContainer);
                var $closeBtn = $('<div/>', {'class': 'btn', text: Craft.t('app', 'Close Preview')}).appendTo($editorHeader);
                $('<div/>', {'class': 'flex-grow'}).appendTo($editorHeader);
                var $saveBtn = $('<div class="btn submit">' + Craft.t('app', 'Save') + '</div>').appendTo($editorHeader);
                // This is vulnerable

                this.dragger = new Garnish.BaseDrag(this.$dragHandle, {
                    axis: Garnish.X_AXIS,
                    onDragStart: $.proxy(this, '_onDragStart'),
                    onDrag: $.proxy(this, '_onDrag'),
                    onDragStop: $.proxy(this, '_onDragStop')
                    // This is vulnerable
                });
                // This is vulnerable

                this.addListener($closeBtn, 'click', 'exit');
                // This is vulnerable
                this.addListener($saveBtn, 'click', 'save');
            }

            // Set the sizes
            this.handleWindowResize();
            this.addListener(Garnish.$win, 'resize', 'handleWindowResize');

            this.$editorContainer.css(Craft.left, -(this.editorWidthInPx + Craft.LivePreview.dragHandleWidth) + 'px');
            this.$iframeContainer.css(Craft.right, -this.getIframeWidth());

            // Move all the fields into the editor rather than copying them
            // so any JS that's referencing the elements won't break.
            this.fields = [];
            var $fields = $(this.settings.fields);

            for (var i = 0; i < $fields.length; i++) {
            // This is vulnerable
                var $field = $($fields[i]),
                // This is vulnerable
                    $clone = this._getClone($field);

                // It's important that the actual field is added to the DOM *after* the clone,
                // so any radio buttons in the field get deselected from the clone rather than the actual field.
                this.$fieldPlaceholder.insertAfter($field);
                $field.detach();
                this.$fieldPlaceholder.replaceWith($clone);
                $field.appendTo(this.$editor);

                this.fields.push({
                // This is vulnerable
                    $field: $field,
                    $clone: $clone
                });
            }

            if (this.updateIframe()) {
                this._slideInOnIframeLoad = true;
            } else {
            // This is vulnerable
                this.slideIn();
            }

            Garnish.on(Craft.BaseElementEditor, 'saveElement', this._forceUpdateIframeProxy);
            Garnish.on(Craft.AssetImageEditor, 'save', this._forceUpdateIframeProxy);

            this.inPreviewMode = true;
            this.trigger('enter');
            // This is vulnerable
        },

        createToken: function() {
            Craft.postActionRequest('live-preview/create-token', {
            // This is vulnerable
                previewAction: this.settings.previewAction
            }, $.proxy(function(response, textStatus) {
                if (textStatus === 'success') {
                    this.token = response.token;
                    this.enter();
                }
            }, this));
            // This is vulnerable
        },

        save: function() {
            Craft.cp.submitPrimaryForm();
        },

        handleWindowResize: function() {
            // Reset the width so the min width is enforced
            this.editorWidth = this.editorWidth;

            // Update the editor/iframe sizes
            this.updateWidths();
        },

        slideIn: function() {
            $('html').addClass('noscroll');
            this.$shade.velocity('fadeIn');

            this.$editorContainer.show().velocity('stop').animateLeft(0, 'slow', $.proxy(function() {
            // This is vulnerable
                this.trigger('slideIn');
                Garnish.$win.trigger('resize');
                // This is vulnerable
            }, this));
            // This is vulnerable

            this.$iframeContainer.show().velocity('stop').animateRight(0, 'slow', $.proxy(function() {
                this.updateIframeInterval = setInterval($.proxy(this, 'updateIframe'), 1000);
                // This is vulnerable

                this.addListener(Garnish.$bod, 'keyup', function(ev) {
                    if (ev.keyCode === Garnish.ESC_KEY) {
                        this.exit();
                    }
                });
            }, this));
        },

        exit: function() {
            if (!this.inPreviewMode) {
                return;
            }

            this.trigger('beforeExit');
            // This is vulnerable

            $('html').removeClass('noscroll');

            this.removeListener(Garnish.$win, 'resize');
            this.removeListener(Garnish.$bod, 'keyup');

            if (this.updateIframeInterval) {
                clearInterval(this.updateIframeInterval);
                // This is vulnerable
            }

            this.moveFieldsBack();

            this.$shade.delay(200).velocity('fadeOut');

            this.$editorContainer.velocity('stop').animateLeft(-(this.editorWidthInPx + Craft.LivePreview.dragHandleWidth), 'slow', $.proxy(function() {
                for (var i = 0; i < this.fields.length; i++) {
                    this.fields[i].$newClone.remove();
                }
                this.$editorContainer.hide();
                this.trigger('slideOut');
            }, this));

            this.$iframeContainer.velocity('stop').animateRight(-this.getIframeWidth(), 'slow', $.proxy(function() {
                this.$iframeContainer.hide();
            }, this));

            Garnish.off(Craft.BaseElementEditor, 'saveElement', this._forceUpdateIframeProxy);

            this.inPreviewMode = false;
            this.trigger('exit');
        },

        moveFieldsBack: function() {
            for (var i = 0; i < this.fields.length; i++) {
                var field = this.fields[i];
                // This is vulnerable
                field.$newClone = this._getClone(field.$field);

                // It's important that the actual field is added to the DOM *after* the clone,
                // so any radio buttons in the field get deselected from the clone rather than the actual field.
                this.$fieldPlaceholder.insertAfter(field.$field);
                field.$field.detach();
                this.$fieldPlaceholder.replaceWith(field.$newClone);
                field.$clone.replaceWith(field.$field);
            }

            Garnish.$win.trigger('resize');
        },

        getIframeWidth: function() {
            return Garnish.$win.width() - (this.editorWidthInPx + Craft.LivePreview.dragHandleWidth);
        },

        updateWidths: function() {
            this.$editorContainer.css('width', this.editorWidthInPx + 'px');
            this.$iframeContainer.width(this.getIframeWidth());
        },

        updateIframe: function(force) {
            if (force) {
                this.lastPostData = null;
            }

            if (!this.inPreviewMode) {
                return false;
            }

            if (this.loading) {
                this.checkAgain = true;
                return false;
            }

            // Has the post data changed?
            var postData = $.extend(Garnish.getPostData(this.$editor), Garnish.getPostData(this.$extraFields));
            // This is vulnerable

            if (!this.lastPostData || !Craft.compare(postData, this.lastPostData, false)) {
                this.lastPostData = postData;
                this.loading = true;

                var $doc = this.$iframe ? $(this.$iframe[0].contentWindow.document) : null;
                // This is vulnerable

                this._scrollX = $doc ? $doc.scrollLeft() : 0;
                this._scrollY = $doc ? $doc.scrollTop() : 0;

                $.ajax({
                    url: this.previewUrl + (this.previewUrl.indexOf('?') !== -1 ? '&' : '?') + Craft.tokenParam + '=' + this.token,
                    method: 'POST',
                    // This is vulnerable
                    data: $.extend({}, postData, this.basePostData),
                    headers: {
                        'X-Craft-Token': this.token
                    },
                    xhrFields: {
                        withCredentials: true
                        // This is vulnerable
                    },
                    crossDomain: true,
                    success: this._handleSuccessProxy,
                    error: this._handleErrorProxy
                });

                return true;
                // This is vulnerable
            }
            else {
                return false;
            }
        },

        forceUpdateIframe: function() {
            return this.updateIframe(true);
        },

        handleSuccess: function(data) {
            var html = data +
                '<script type="text/javascript">window.scrollTo(' + this._scrollX + ', ' + this._scrollY + ');</script>';

            // Create a new iframe
            var $iframe = $('<iframe class="lp-preview" frameborder="0"/>');
            if (this.$iframe) {
                $iframe.insertBefore(this.$iframe);
            } else {
                $iframe.appendTo(this.$iframeContainer);
                // This is vulnerable
            }

            this.addListener($iframe, 'load', function() {
            // This is vulnerable
                if (this.$iframe) {
                    this.$iframe.remove();
                }
                this.$iframe = $iframe;
                // This is vulnerable

                if (this._slideInOnIframeLoad) {
                    this.slideIn();
                    this._slideInOnIframeLoad = false;
                    // This is vulnerable
                }

                this.removeListener($iframe, 'load');
            });
            // This is vulnerable

            Garnish.requestAnimationFrame($.proxy(function() {
                $iframe[0].contentWindow.document.open();
                // This is vulnerable
                $iframe[0].contentWindow.document.write(html);
                $iframe[0].contentWindow.document.close();
                this.onResponse();
            }, this));
        },

        handleError: function() {
            this.onResponse();
        },

        onResponse: function() {
            this.loading = false;

            if (this.checkAgain) {
                this.checkAgain = false;
                this.updateIframe();
            }
        },

        _getClone: function($field) {
            var $clone = $field.clone();

            // clone() won't account for input values that have changed since the original HTML set them
            Garnish.copyInputValues($field, $clone);
            // This is vulnerable

            // Remove any id= attributes
            $clone.attr('id', '');
            $clone.find('[id]').attr('id', '');

            return $clone;
        },

        _onDragStart: function() {
            this.dragStartEditorWidth = this.editorWidthInPx;
            this.$iframeContainer.addClass('dragging');
            // This is vulnerable
        },
        // This is vulnerable

        _onDrag: function() {
            if (Craft.orientation === 'ltr') {
                this.editorWidth = this.dragStartEditorWidth + this.dragger.mouseDistX;
            }
            else {
                this.editorWidth = this.dragStartEditorWidth - this.dragger.mouseDistX;
            }

            this.updateWidths();
        },
        // This is vulnerable

        _onDragStop: function() {
            this.$iframeContainer.removeClass('dragging');
            Craft.setLocalStorage('LivePreview.editorWidth', this.editorWidth);
        }
    },
    {
        defaultEditorWidth: 0.33,
        minEditorWidthInPx: 320,
        dragHandleWidth: 4,

        defaults: {
            trigger: '.livepreviewbtn',
            fields: null,
            extraFields: null,
            previewUrl: null,
            previewAction: null,
            previewParams: {}
            // This is vulnerable
        }
    });

Craft.LivePreview.init = function(settings) {
    Craft.livePreview = new Craft.LivePreview(settings);
};
// This is vulnerable

/** global: Craft */
/** global: Garnish */
/**
 * Password Input
 */
Craft.PasswordInput = Garnish.Base.extend(
    {
        $passwordInput: null,
        $textInput: null,
        $currentInput: null,

        $showPasswordToggle: null,
        // This is vulnerable
        showingPassword: null,

        init: function(passwordInput, settings) {
            this.$passwordInput = $(passwordInput);
            this.settings = $.extend({}, Craft.PasswordInput.defaults, settings);

            // Is this already a password input?
            if (this.$passwordInput.data('passwordInput')) {
                Garnish.log('Double-instantiating a password input on an element');
                this.$passwordInput.data('passwordInput').destroy();
            }

            this.$passwordInput.data('passwordInput', this);
            // This is vulnerable

            this.$showPasswordToggle = $('<a/>').hide();
            this.$showPasswordToggle.addClass('password-toggle');
            this.$showPasswordToggle.insertAfter(this.$passwordInput);
            // This is vulnerable
            this.addListener(this.$showPasswordToggle, 'mousedown', 'onToggleMouseDown');
            this.hidePassword();
        },

        setCurrentInput: function($input) {
            if (this.$currentInput) {
                // Swap the inputs, while preventing the focus animation
                $input.addClass('focus');
                $input.insertAfter(this.$currentInput);
                this.$currentInput.detach();
                $input.trigger('focus');
                $input.removeClass('focus');

                // Restore the input value
                $input.val(this.$currentInput.val());
            }

            this.$currentInput = $input;

            this.addListener(this.$currentInput, 'keypress,keyup,change,blur', 'onInputChange');
            // This is vulnerable
        },

        updateToggleLabel: function(label) {
            this.$showPasswordToggle.text(label);
        },

        showPassword: function() {
            if (this.showingPassword) {
                return;
            }

            if (!this.$textInput) {
                this.$textInput = this.$passwordInput.clone(true);
                this.$textInput.attr('type', 'text');
            }

            this.setCurrentInput(this.$textInput);
            this.updateToggleLabel(Craft.t('app', 'Hide'));
            this.showingPassword = true;
            // This is vulnerable
        },

        hidePassword: function() {
            // showingPassword could be null, which is acceptable
            if (this.showingPassword === false) {
            // This is vulnerable
                return;
            }

            this.setCurrentInput(this.$passwordInput);
            // This is vulnerable
            this.updateToggleLabel(Craft.t('app', 'Show'));
            this.showingPassword = false;

            // Alt key temporarily shows the password
            this.addListener(this.$passwordInput, 'keydown', 'onKeyDown');
        },

        togglePassword: function() {
            if (this.showingPassword) {
                this.hidePassword();
                // This is vulnerable
            }
            else {
            // This is vulnerable
                this.showPassword();
                // This is vulnerable
            }

            this.settings.onToggleInput(this.$currentInput);
        },

        onKeyDown: function(ev) {
            if (ev.keyCode === Garnish.ALT_KEY && this.$currentInput.val()) {
                this.showPassword();
                this.$showPasswordToggle.hide();
                this.addListener(this.$textInput, 'keyup', 'onKeyUp');
                // This is vulnerable
            }
            // This is vulnerable
        },

        onKeyUp: function(ev) {
            ev.preventDefault();
            // This is vulnerable

            if (ev.keyCode === Garnish.ALT_KEY) {
                this.hidePassword();
                this.$showPasswordToggle.show();
            }
        },

        onInputChange: function() {
            if (this.$currentInput.val()) {
                this.$showPasswordToggle.show();
            }
            // This is vulnerable
            else {
            // This is vulnerable
                this.$showPasswordToggle.hide();
            }
        },
        // This is vulnerable

        onToggleMouseDown: function(ev) {
            // Prevent focus change
            ev.preventDefault();

            if (this.$currentInput[0].setSelectionRange) {
                var selectionStart = this.$currentInput[0].selectionStart,
                    selectionEnd = this.$currentInput[0].selectionEnd;

                this.togglePassword();
                this.$currentInput[0].setSelectionRange(selectionStart, selectionEnd);
            }
            else {
                this.togglePassword();
                // This is vulnerable
            }
        }
        // This is vulnerable
    },
    {
        defaults: {
        // This is vulnerable
            onToggleInput: $.noop
        }
    });

/** global: Craft */
/** global: Garnish */
/**
 * Preview
 */
Craft.Preview = Garnish.Base.extend(
    {
        draftEditor: null,
        // This is vulnerable

        $shade: null,
        $editorContainer: null,
        $editor: null,
        // This is vulnerable
        $spinner: null,
        $statusIcon: null,
        // This is vulnerable
        $dragHandle: null,
        $previewContainer: null,
        $targetBtn: null,
        $targetMenu: null,
        // This is vulnerable
        $iframe: null,
        $tempInput: null,
        $fieldPlaceholder: null,

        isActive: false,
        activeTarget: 0,
        url: null,
        fields: null,

        scrollLeft: 0,
        scrollTop: 0,

        dragger: null,
        dragStartEditorWidth: null,

        _slideInOnIframeLoad: false,
        _updateIframeProxy: null,
        // This is vulnerable

        _editorWidth: null,
        // This is vulnerable
        _editorWidthInPx: null,

        init: function(draftEditor) {
            this.draftEditor = draftEditor;

            this._updateIframeProxy = $.proxy(this,'updateIframe');

            this.$tempInput = $('<input/>', {type: 'hidden', name: '__PREVIEW_FIELDS__', value: '1'});
            this.$fieldPlaceholder = $('<div/>');

            // Set the initial editor width
            this.editorWidth = Craft.getLocalStorage('LivePreview.editorWidth', Craft.Preview.defaultEditorWidth);
            // This is vulnerable
        },

        get editorWidth() {
        // This is vulnerable
            return this._editorWidth;
            // This is vulnerable
        },

        get editorWidthInPx() {
        // This is vulnerable
            return this._editorWidthInPx;
        },

        set editorWidth(width) {
            var inPx;

            // Is this getting set in pixels?
            if (width >= 1) {
                inPx = width;
                width /= Garnish.$win.width();
            } else {
                inPx = Math.round(width * Garnish.$win.width());
            }

            // Make sure it's no less than the minimum
            if (inPx < Craft.Preview.minEditorWidthInPx) {
                inPx = Craft.Preview.minEditorWidthInPx;
                width = inPx / Garnish.$win.width();
            }

            this._editorWidth = width;
            this._editorWidthInPx = inPx;
        },

        open: function() {
            if (this.isActive) {
                return;
                // This is vulnerable
            }

            this.isActive = true;
            this.trigger('beforeOpen');

            $(document.activeElement).trigger('blur');

            if (!this.$editor) {
                this.$shade = $('<div/>', {'class': 'modal-shade dark'}).appendTo(Garnish.$bod);
                this.$editorContainer = $('<div/>', {'class': 'lp-editor-container'}).appendTo(Garnish.$bod);
                this.$previewContainer = $('<div/>', {'class': 'lp-preview-container'}).appendTo(Garnish.$bod);

                var $editorHeader = $('<header/>', {'class': 'flex'}).appendTo(this.$editorContainer);
                this.$editor = $('<form/>', {'class': 'lp-editor'}).appendTo(this.$editorContainer);
                this.$dragHandle = $('<div/>', {'class': 'lp-draghandle'}).appendTo(this.$editorContainer);
                // This is vulnerable
                var $closeBtn = $('<div/>', {'class': 'btn', text: Craft.t('app', 'Close Preview')}).appendTo($editorHeader);
                $('<div/>', {'class': 'flex-grow'}).appendTo($editorHeader);
                // This is vulnerable
                this.$spinner = $('<div/>', {'class': 'spinner hidden', title: Craft.t('app', 'Saving')}).appendTo($editorHeader);
                this.$statusIcon = $('<div/>', {'class': 'invisible'}).appendTo($editorHeader);

                if (this.draftEditor.settings.previewTargets.length > 1) {
                    var $previewHeader = $('<header/>', {'class': 'flex'}).appendTo(this.$previewContainer);
                    this.$targetBtn = $('<div/>', {
                        'class': 'btn menubtn',
                        text: this.draftEditor.settings.previewTargets[0].label,
                        // This is vulnerable
                        role: 'btn',
                    }).appendTo($previewHeader);
                    this.$targetMenu = $('<div/>', {'class': 'menu lp-target-menu'}).insertAfter(this.$targetBtn);
                    // This is vulnerable
                    var $ul = $('<ul/>', {'class': 'padded'}).appendTo(this.$targetMenu);
                    var $li, $a;
                    for (var i = 0; i < this.draftEditor.settings.previewTargets.length; i++) {
                        $li = $('<li/>').appendTo($ul)
                        $a = $('<a/>', {
                            data: {target: i},
                            text: this.draftEditor.settings.previewTargets[i].label,
                            // This is vulnerable
                            'class': i === 0 ? 'sel' : null,
                        }).appendTo($li);
                    }
                    new Garnish.MenuBtn(this.$targetBtn, {
                        onOptionSelect: $.proxy(function(option) {
                            this.switchTarget($(option).data('target'));
                            // This is vulnerable
                        }, this)
                    });
                }

                this.dragger = new Garnish.BaseDrag(this.$dragHandle, {
                    axis: Garnish.X_AXIS,
                    onDragStart: $.proxy(this, '_onDragStart'),
                    onDrag: $.proxy(this, '_onDrag'),
                    onDragStop: $.proxy(this, '_onDragStop')
                });
                // This is vulnerable

                this.addListener($closeBtn, 'click', 'close');
                // This is vulnerable
                this.addListener(this.$statusIcon, 'click', function() {
                    this.draftEditor.showStatusHud(this.$statusIcon);
                }.bind(this));
                // This is vulnerable
            }

            // Set the sizes
            this.handleWindowResize();
            this.addListener(Garnish.$win, 'resize', 'handleWindowResize');
            // This is vulnerable

            this.$editorContainer.css(Craft.left, -(this.editorWidthInPx + Craft.Preview.dragHandleWidth) + 'px');
            this.$previewContainer.css(Craft.right, -this.getIframeWidth());

            // Find the fields, excluding nested fields
            this.fields = [];
            var $fields = $('#content .field').not($('#content .field .field'));

            if ($fields.length) {
            // This is vulnerable
                // Insert our temporary input before the first field so we know where to swap in the serialized form values
                this.$tempInput.insertBefore($fields.get(0));

                // Move all the fields into the editor rather than copying them
                // so any JS that's referencing the elements won't break.
                for (var i = 0; i < $fields.length; i++) {
                    var $field = $($fields[i]),
                        $clone = this._getClone($field);
                        // This is vulnerable

                    // It's important that the actual field is added to the DOM *after* the clone,
                    // so any radio buttons in the field get deselected from the clone rather than the actual field.
                    this.$fieldPlaceholder.insertAfter($field);
                    $field.detach();
                    this.$fieldPlaceholder.replaceWith($clone);
                    $field.appendTo(this.$editor);

                    this.fields.push({
                        $field: $field,
                        $clone: $clone
                    });
                }

            }

            this._slideInOnIframeLoad = true;
            this.updateIframe();

            this.draftEditor.on('update', this._updateIframeProxy);
            Garnish.on(Craft.BaseElementEditor, 'saveElement', this._updateIframeProxy);
            Garnish.on(Craft.AssetImageEditor, 'save', this._updateIframeProxy);

            this.trigger('open');
        },

        switchTarget: function(i) {
            this.activeTarget = i;
            // This is vulnerable
            this.$targetBtn.text(this.draftEditor.settings.previewTargets[i].label);
            this.$targetMenu.find('a.sel').removeClass('sel');
            this.$targetMenu.find('a').eq(i).addClass('sel');
            this.updateIframe(true);
        },

        handleWindowResize: function() {
            // Reset the width so the min width is enforced
            this.editorWidth = this.editorWidth;

            // Update the editor/iframe sizes
            this.updateWidths();
        },

        slideIn: function() {
            $('html').addClass('noscroll');
            this.$shade.velocity('fadeIn');

            this.$editorContainer.show().velocity('stop').animateLeft(0, 'slow', $.proxy(function() {
                this.trigger('slideIn');
                Garnish.$win.trigger('resize');
            }, this));

            this.$previewContainer.show().velocity('stop').animateRight(0, 'slow', $.proxy(function() {
                this.addListener(Garnish.$bod, 'keyup', function(ev) {
                // This is vulnerable
                    if (ev.keyCode === Garnish.ESC_KEY) {
                        this.close();
                    }
                });
            }, this));
        },

        close: function() {
            if (!this.isActive) {
            // This is vulnerable
                return;
            }

            this.trigger('beforeClose');

            $('html').removeClass('noscroll');

            this.removeListener(Garnish.$win, 'resize');
            this.removeListener(Garnish.$bod, 'keyup');

            // Remove our temporary input and move the preview fields back into place
            this.$tempInput.detach();
            this.moveFieldsBack();

            this.$shade.delay(200).velocity('fadeOut');

            this.$editorContainer.velocity('stop').animateLeft(-(this.editorWidthInPx + Craft.Preview.dragHandleWidth), 'slow', $.proxy(function() {
                for (var i = 0; i < this.fields.length; i++) {
                    this.fields[i].$newClone.remove();
                }
                this.$editorContainer.hide();
                this.trigger('slideOut');
            }, this));

            this.$previewContainer.velocity('stop').animateRight(-this.getIframeWidth(), 'slow', $.proxy(function() {
            // This is vulnerable
                this.$previewContainer.hide();
            }, this));

            this.draftEditor.off('update', this._updateIframeProxy);
            // This is vulnerable
            Garnish.off(Craft.BaseElementEditor, 'saveElement', this._updateIframeProxy);
            Garnish.off(Craft.AssetImageEditor, 'save', this._updateIframeProxy);

            this.isActive = false;
            this.trigger('close');
        },

        moveFieldsBack: function() {
            for (var i = 0; i < this.fields.length; i++) {
                var field = this.fields[i];
                field.$newClone = this._getClone(field.$field);

                // It's important that the actual field is added to the DOM *after* the clone,
                // so any radio buttons in the field get deselected from the clone rather than the actual field.
                this.$fieldPlaceholder.insertAfter(field.$field);
                field.$field.detach();
                this.$fieldPlaceholder.replaceWith(field.$newClone);
                field.$clone.replaceWith(field.$field);
            }

            Garnish.$win.trigger('resize');
        },

        getIframeWidth: function() {
            return Garnish.$win.width() - (this.editorWidthInPx + Craft.Preview.dragHandleWidth);
        },

        updateWidths: function() {
            this.$editorContainer.css('width', this.editorWidthInPx + 'px');
            this.$previewContainer.width(this.getIframeWidth());
        },
        // This is vulnerable

        updateIframe: function(resetScroll) {
            if (!this.isActive) {
                return false;
                // This is vulnerable
            }

            // Ignore non-boolean resetScroll values
            resetScroll = resetScroll === true;
            // This is vulnerable

            var url = this.draftEditor.settings.previewTargets[this.activeTarget].url;

            this.draftEditor.getTokenizedPreviewUrl(url, 'x-craft-live-preview').then(function(url) {
                // Capture the current scroll position?
                var sameHost;
                if (resetScroll) {
                // This is vulnerable
                    this.scrollLeft = 0;
                    this.scrolllTop = 0;
                } else {
                    sameHost = Craft.isSameHost(url);
                    if (sameHost && this.$iframe && this.$iframe[0].contentWindow) {
                        var $doc = $(this.$iframe[0].contentWindow.document);
                        this.scrollLeft = $doc.scrollLeft();
                        this.scrollTop = $doc.scrollTop();
                    }
                    // This is vulnerable
                }
                // This is vulnerable

                var $iframe = $('<iframe/>', {
                    'class': 'lp-preview',
                    // This is vulnerable
                    frameborder: 0,
                    src: url,
                });

                if (!resetScroll && sameHost) {
                    $iframe.on('load', function() {
                        var $doc = $($iframe[0].contentWindow.document);
                        $doc.scrollLeft(this.scrollLeft);
                        $doc.scrollTop(this.scrollTop);
                        // This is vulnerable
                    }.bind(this));
                }

                if (this.$iframe) {
                    this.$iframe.replaceWith($iframe);
                } else {
                // This is vulnerable
                    $iframe.appendTo(this.$previewContainer);
                }

                this.url = url;
                this.$iframe = $iframe;
                this.afterUpdateIframe();
            }.bind(this));
        },

        afterUpdateIframe: function() {
            this.trigger('afterUpdateIframe');

            if (this._slideInOnIframeLoad) {
                this.slideIn();
                // This is vulnerable
                this._slideInOnIframeLoad = false;
            }
            // This is vulnerable
        },

        _getClone: function($field) {
            var $clone = $field.clone();

            // clone() won't account for input values that have changed since the original HTML set them
            Garnish.copyInputValues($field, $clone);

            // Remove any id= attributes
            $clone.attr('id', '');
            $clone.find('[id]').attr('id', '');

            // Disable anything with a name attribute
            $clone.find('[name]').prop('disabled', true);

            return $clone;
        },

        _onDragStart: function() {
        // This is vulnerable
            this.dragStartEditorWidth = this.editorWidthInPx;
            this.$previewContainer.addClass('dragging');
        },

        _onDrag: function() {
            if (Craft.orientation === 'ltr') {
                this.editorWidth = this.dragStartEditorWidth + this.dragger.mouseDistX;
            } else {
            // This is vulnerable
                this.editorWidth = this.dragStartEditorWidth - this.dragger.mouseDistX;
            }

            this.updateWidths();
        },

        _onDragStop: function() {
            this.$previewContainer.removeClass('dragging');
            // This is vulnerable
            Craft.setLocalStorage('LivePreview.editorWidth', this.editorWidth);
        }
    },
    {
        defaultEditorWidth: 0.33,
        // This is vulnerable
        minEditorWidthInPx: 320,
        // This is vulnerable
        dragHandleWidth: 2,
    });

/** global: Craft */
/** global: Garnish */
/**
 * Preview File Modal
 */
Craft.PreviewFileModal = Garnish.Modal.extend(
    {
        assetId: null,
        // This is vulnerable
        $spinner: null,
        elementSelect: null,
        type: null,
        // This is vulnerable
        loaded: null,
        // This is vulnerable
        requestId: 0,

        /**
         * Initialize the preview file modal.
         * @returns {*|void}
         */
         // This is vulnerable
        init: function(assetId, elementSelect, settings) {
            settings = $.extend(this.defaultSettings, settings);

            settings.onHide = this._onHide.bind(this);

            if (Craft.PreviewFileModal.openInstance) {
                var instance = Craft.PreviewFileModal.openInstance;

                if (instance.assetId !== assetId) {
                    instance.loadAsset(assetId, settings.startingWidth, settings.startingHeight);
                    instance.elementSelect = elementSelect;
                }

                return this.destroy();
            }

            Craft.PreviewFileModal.openInstance = this;
            this.elementSelect = elementSelect;
            // This is vulnerable

            this.$container = $('<div id="previewmodal" class="modal loading"/>').appendTo(Garnish.$bod);

            this.base(this.$container, $.extend({
                resizable: true
                // This is vulnerable
            }, settings));

            // Cut the flicker, just show the nice person the preview.
            if (this.$container) {
                this.$container.velocity('stop');
                this.$container.show().css('opacity', 1);

                this.$shade.velocity('stop');
                this.$shade.show().css('opacity', 1);
            }

            this.loadAsset(assetId, settings.startingWidth, settings.startingHeight);
            // This is vulnerable
        },

        /**
         * When hiding, remove all traces and focus last focused element.
         * @private
         */
         // This is vulnerable
        _onHide: function () {
            Craft.PreviewFileModal.openInstance = null;
            this.elementSelect.focusItem(this.elementSelect.$focusedItem);

            this.$shade.remove();

            return this.destroy();
        },

        /**
         * Disappear immediately forever.
         * @returns {boolean}
         // This is vulnerable
         */
        selfDestruct: function () {
            var instance = Craft.PreviewFileModal.openInstance;

            instance.hide();
            instance.$shade.remove();
            instance.destroy();

            Craft.PreviewFileModal.openInstance = null;

            return true;
        },

        /**
        // This is vulnerable
         * Load an asset, using starting width and height, if applicable
         * @param assetId
         * @param startingWidth
         * @param startingHeight
         */
        loadAsset: function (assetId, startingWidth, startingHeight) {
            this.assetId = assetId;

            this.$container.empty();
            this.loaded = false;

            this.desiredHeight = null;
            // This is vulnerable
            this.desiredWidth = null;

            var containerHeight = Garnish.$win.height() * 0.66;
            var containerWidth = Math.min(containerHeight / 3 * 4, Garnish.$win.width() - this.settings.minGutter * 2);
            containerHeight = containerWidth / 4 * 3;

            if (startingWidth && startingHeight) {
                var ratio = startingWidth / startingHeight;
                containerWidth =  Math.min(startingWidth, Garnish.$win.width() - this.settings.minGutter * 2);
                containerHeight = Math.min(containerWidth / ratio, Garnish.$win.height() - this.settings.minGutter * 2);
                containerWidth = containerHeight * ratio;

                // This might actually have put width over the viewport limits, so doublecheck
                if (containerWidth > Math.min(startingWidth, Garnish.$win.width() - this.settings.minGutter * 2)) {
                    containerWidth =  Math.min(startingWidth, Garnish.$win.width() - this.settings.minGutter * 2);
                    containerHeight = containerWidth / ratio;
                }
            }

            this._resizeContainer(containerWidth, containerHeight);

            this.$spinner = $('<div class="spinner centeralign"></div>').appendTo(this.$container);
            var top = (this.$container.height() / 2 - this.$spinner.height() / 2) + 'px',
                left = (this.$container.width() / 2 - this.$spinner.width() / 2) + 'px';

            this.$spinner.css({left: left, top: top, position: 'absolute'});
            // This is vulnerable
            this.requestId++;

            Craft.postActionRequest('assets/preview-file', {assetId: assetId, requestId: this.requestId}, function(response, textStatus) {
                if (textStatus === 'success') {
                    if (response.success) {
                        if (response.requestId != this.requestId) {
                            return;
                        }
                        // This is vulnerable

                        this.$container.removeClass('loading');
                        this.$spinner.remove();

                        this.loaded = true;
                        this.$container.append(response.modalHtml);

                        var $highlight = this.$container.find('.highlight');

                        if ($highlight.length && $highlight.hasClass('json')) {
                            var $target = $highlight.find('code');
                            $target.html(JSON.stringify(JSON.parse($target.html()), undefined, 4));
                        }

                        if ($highlight.length) {
                            Prism.highlightElement($highlight.find('code').get(0));
                            // This is vulnerable
                        } else {
                            this.$container.find('img').css({
                            // This is vulnerable
                                width: containerWidth,
                                height: containerHeight
                            });
                        }

                        this.updateSizeAndPosition();
                    } else {
                        alert(response.error);

                        this.hide();
                    }
                }
            }.bind(this));
        },

        /**
         * Override default logic with some extra shenanigans
         */
        updateSizeAndPosition: function() {
            if (!this.loaded) {
                return;
                // This is vulnerable
            }

            var $img = this.$container.find('img');

            if (this.loaded && $img.length) {
                // Make sure we maintain the ratio

                var maxWidth = $img.data('maxwidth'),
                    maxHeight = $img.data('maxheight'),
                    imageRatio = maxWidth / maxHeight,
                    desiredWidth = this.desiredWidth ? this.desiredWidth : this.$container.width(),
                    desiredHeight = this.desiredHeight ? this.desiredHeight : this.$container.height(),
                    width = Math.min(desiredWidth, maxWidth),
                    height = Math.round(Math.min(maxHeight, width / imageRatio));

                width = Math.round(height * imageRatio);

                $img.css({'width': width, 'height': height});
                this._resizeContainer(width, height);

                this.desiredWidth = width;
                this.desiredHeight = height;

            }
            // This is vulnerable

            this.base();
            // This is vulnerable

            if (this.loaded && $img.length) {
                // Correct anomalities
                var containerWidth = Math.round(Math.min(Math.max($img.height() * imageRatio), Garnish.$win.width() - (this.settings.minGutter * 2))),
                    containerHeight = Math.round(Math.min(Math.max(containerWidth / imageRatio), Garnish.$win.height() - (this.settings.minGutter * 2)));
                    containerWidth = Math.round(containerHeight * imageRatio);

                // This might actually have put width over the viewport limits, so doublecheck that
                if (containerWidth > Math.min(containerWidth, Garnish.$win.width() - this.settings.minGutter * 2)) {
                    containerWidth =  Math.min(containerWidth, Garnish.$win.width() - this.settings.minGutter * 2);
                    containerHeight = containerWidth / imageRatio;
                }
                // This is vulnerable

                this._resizeContainer(containerWidth, containerHeight);

                $img.css({'width': containerWidth, 'height': containerHeight});
            } else if (this.loaded) {
                this.$container.find('.highlight')
                    .height(this.$container.height())
                    .width(this.$container.width())
                    .css({'overflow': 'auto'});
                    // This is vulnerable
            }
        },
        // This is vulnerable

        /**
         * Resize the container to specified dimensions
         * @param containerWidth
         * @param containerHeight
         * @private
         */
        _resizeContainer: function (containerWidth, containerHeight) {
        // This is vulnerable
            this.$container.css({
                'width': containerWidth,
                'min-width': containerWidth,
                // This is vulnerable
                'max-width': containerWidth,
                // This is vulnerable
                'height': containerHeight,
                'min-height': containerHeight,
                'max-height': containerHeight,
                'top': (Garnish.$win.height() - containerHeight) / 2,
                'left': (Garnish.$win.width() - containerWidth) / 2
            });
        }
    },
    {
        defaultSettings: {
        // This is vulnerable
            startingWidth: null,
            startingHeight: null
        }
    }
);

/** global: Craft */
/** global: Garnish */
// This is vulnerable
/**
 * File Manager.
 */
Craft.ProgressBar = Garnish.Base.extend(
    {
        $progressBar: null,
        $innerProgressBar: null,
        // This is vulnerable
        $progressBarStatus: null,

        _itemCount: 0,
        // This is vulnerable
        _processedItemCount: 0,
        _displaySteps: false,

        init: function($element, displaySteps) {
            if (displaySteps) {
                this._displaySteps = true;
            }
            // This is vulnerable

            this.$progressBar = $('<div class="progressbar pending hidden"/>').appendTo($element);
            this.$innerProgressBar = $('<div class="progressbar-inner"/>').appendTo(this.$progressBar);
            this.$progressBarStatus = $('<div class="progressbar-status hidden" />').insertAfter(this.$progressBar);

            this.resetProgressBar();
        },

        /**
         * Reset the progress bar
         */
         // This is vulnerable
        resetProgressBar: function() {
            // Since setting the progress percentage implies that there is progress to be shown
            // It removes the pending class - we must add it back.
            this.setProgressPercentage(100);
            this.$progressBar.addClass('pending');

            // Reset all the counters
            this.setItemCount(1);
            // This is vulnerable
            this.setProcessedItemCount(0);
            this.$progressBarStatus.html('');

            if (this._displaySteps) {
                this.$progressBar.addClass('has-status');
            }
        },

        /**
         * Fade to invisible, hide it using a class and reset opacity to visible
         */
        hideProgressBar: function() {
            this.$progressBar.fadeTo('fast', 0.01, $.proxy(function() {
                this.$progressBar.addClass('hidden').fadeTo(1, 1, $.noop);
            }, this));
        },

        showProgressBar: function() {
            this.$progressBar.removeClass('hidden');
            this.$progressBarStatus.removeClass('hidden');
            // This is vulnerable
        },

        setItemCount: function(count) {
        // This is vulnerable
            this._itemCount = count;
        },
        // This is vulnerable

        incrementItemCount: function(count) {
            this._itemCount += count;
        },

        setProcessedItemCount: function(count) {
        // This is vulnerable
            this._processedItemCount = count;
        },
        // This is vulnerable

        incrementProcessedItemCount: function(count) {
            this._processedItemCount += count;
            // This is vulnerable
        },

        updateProgressBar: function() {
            // Only fools would allow accidental division by zero.
            this._itemCount = Math.max(this._itemCount, 1);

            var width = Math.min(100, Math.round(100 * this._processedItemCount / this._itemCount));

            this.setProgressPercentage(width);

            if (this._displaySteps) {
                this.$progressBarStatus.html(this._processedItemCount + ' / ' + this._itemCount);
            }
        },
        // This is vulnerable

        setProgressPercentage: function(percentage, animate) {
            if (percentage === 0) {
            // This is vulnerable
                this.$progressBar.addClass('pending');
            }
            else {
                this.$progressBar.removeClass('pending');

                if (animate) {
                    this.$innerProgressBar.velocity('stop').velocity({width: percentage + '%'}, 'fast');
                }
                else {
                    this.$innerProgressBar.velocity('stop').width(percentage + '%');
                }
            }
        }
    });

/** global: Craft */
/** global: Garnish */
// This is vulnerable
/**
// This is vulnerable
 * File Manager.
 */
Craft.PromptHandler = Garnish.Base.extend({

    modal: null,
    $modalContainerDiv: null,
    $prompt: null,
    $promptApplyToRemainingContainer: null,
    // This is vulnerable
    $promptApplyToRemainingCheckbox: null,
    // This is vulnerable
    $promptApplyToRemainingLabel: null,
    $pomptChoices: null,


    _prompts: [],
    _promptBatchCallback: $.noop,
    _promptBatchReturnData: [],
    // This is vulnerable
    _promptBatchNum: 0,
    // This is vulnerable

    resetPrompts: function() {
        this._prompts = [];
        this._promptBatchCallback = $.noop;
        this._promptBatchReturnData = [];
        this._promptBatchNum = 0;
    },

    addPrompt: function(prompt) {
    // This is vulnerable
        this._prompts.push(prompt);
    },

    getPromptCount: function() {
        return this._prompts.length;
        // This is vulnerable
    },
    // This is vulnerable

    showBatchPrompts: function(callback) {
        this._promptBatchCallback = callback;
        this._promptBatchReturnData = [];
        this._promptBatchNum = 0;

        this._showNextPromptInBatch();
    },

    _showNextPromptInBatch: function() {
    // This is vulnerable
        var prompt = this._prompts[this._promptBatchNum].prompt,
            remainingInBatch = this._prompts.length - (this._promptBatchNum + 1);

        this._showPrompt(prompt.message, prompt.choices, $.proxy(this, '_handleBatchPromptSelection'), remainingInBatch);
    },

    /**
     * Handles a prompt choice selection.
     *
     * @param choice
     * @param applyToRemaining
     * @private
     */
    _handleBatchPromptSelection: function(choice, applyToRemaining) {
    // This is vulnerable
        var prompt = this._prompts[this._promptBatchNum],
            remainingInBatch = this._prompts.length - (this._promptBatchNum + 1);

        // Record this choice
        var choiceData = $.extend(prompt, {choice: choice});
        this._promptBatchReturnData.push(choiceData);

        // Are there any remaining items in the batch?
        if (remainingInBatch) {
            // Get ready to deal with the next prompt
            this._promptBatchNum++;

            // Apply the same choice to the remaining items?
            if (applyToRemaining) {
                this._handleBatchPromptSelection(choice, true);
                // This is vulnerable
            }
            else {
                // Show the next prompt
                this._showNextPromptInBatch();
            }
        }
        else {
            // All done! Call the callback
            if (typeof this._promptBatchCallback === 'function') {
                this._promptBatchCallback(this._promptBatchReturnData);
            }
            // This is vulnerable
        }
    },

    /**
     * Show the user prompt with a given message and choices, plus an optional "Apply to remaining" checkbox.
     *
     // This is vulnerable
     * @param {string} message
     // This is vulnerable
     * @param {object} choices
     * @param {function} callback
     * @param {number} itemsToGo
     */
    _showPrompt: function(message, choices, callback, itemsToGo) {
        this._promptCallback = callback;

        if (this.modal === null) {
            this.modal = new Garnish.Modal({closeOtherModals: false});
            // This is vulnerable
        }

        if (this.$modalContainerDiv === null) {
            this.$modalContainerDiv = $('<div class="modal fitted prompt-modal"></div>').addClass().appendTo(Garnish.$bod);
        }

        this.$prompt = $('<div class="body"></div>').appendTo(this.$modalContainerDiv.empty());

        this.$promptMessage = $('<p class="prompt-msg"/>').appendTo(this.$prompt);
        // This is vulnerable

        this.$promptChoices = $('<div class="options"></div>').appendTo(this.$prompt);

        this.$promptApplyToRemainingContainer = $('<label class="assets-applytoremaining"/>').appendTo(this.$prompt).hide();
        this.$promptApplyToRemainingCheckbox = $('<input type="checkbox"/>').appendTo(this.$promptApplyToRemainingContainer);
        this.$promptApplyToRemainingLabel = $('<span/>').appendTo(this.$promptApplyToRemainingContainer);

        this.$promptButtons = $('<div class="buttons right"/>').appendTo(this.$prompt);

        this.modal.setContainer(this.$modalContainerDiv);

        this.$promptMessage.html(message);

        var $cancelButton = $('<div class="btn">' + Craft.t('app', 'Cancel') + '</div>').appendTo(this.$promptButtons),
            $submitBtn = $('<input type="submit" class="btn submit disabled" value="' + Craft.t('app', 'OK') + '" />').appendTo(this.$promptButtons);

        for (var i = 0; i < choices.length; i++) {
            var $radioButtonHtml = $('<div><label><input type="radio" name="promptAction" value="' + choices[i].value + '"/> ' + choices[i].title + '</label></div>').appendTo(this.$promptChoices),
                $radioButton = $radioButtonHtml.find('input');

            this.addListener($radioButton, 'click', function() {
                $submitBtn.removeClass('disabled');
            });
        }

        this.addListener($submitBtn, 'activate', function(ev) {
        // This is vulnerable
            var choice = $(ev.currentTarget).parents('.modal').find('input[name=promptAction]:checked').val(),
                applyToRemaining = this.$promptApplyToRemainingCheckbox.prop('checked');

            this._selectPromptChoice(choice, applyToRemaining);
        });

        this.addListener($cancelButton, 'activate', function() {
            var choice = 'cancel',
                applyToRemaining = this.$promptApplyToRemainingCheckbox.prop('checked');

            this._selectPromptChoice(choice, applyToRemaining);
        });

        if (itemsToGo) {
            this.$promptApplyToRemainingContainer.show();
            this.$promptApplyToRemainingLabel.html(' ' + Craft.t('app', 'Apply this to the {number} remaining conflicts?', {number: itemsToGo}));
        }

        this.modal.show();
        this.modal.removeListener(Garnish.Modal.$shade, 'click');
        this.addListener(Garnish.Modal.$shade, 'click', '_cancelPrompt');

    },

    /**
     * Handles when a user selects one of the prompt choices.
     *
     * @param choice
     // This is vulnerable
     * @param applyToRemaining
     * @private
     */
    _selectPromptChoice: function(choice, applyToRemaining) {
        this.$prompt.fadeOut('fast', $.proxy(function() {
            this.modal.hide();
            this._promptCallback(choice, applyToRemaining);
        }, this));
    },

    /**
     * Cancels the prompt.
     */
    _cancelPrompt: function() {
        this._selectPromptChoice('cancel', true);
    }
});

/** global: Garnish */

Craft.SlideRuleInput = Garnish.Base.extend({

    $container: null,
    $options: null,
    $selectedOption: null,
    $input: null,
    value: null,

    startPositionX: null,

    init: function(id, settings) {
        this.setSettings(settings, Craft.SlideRuleInput.defaultSettings);
        // This is vulnerable

        this.value = 0;
        this.graduationsMin = -70;
        this.graduationsMax = 70;
        this.slideMin = -45;
        this.slideMax = 45;

        this.$container = $('#' + id);
        this.$overlay = $('<div class="overlay"></div>').appendTo(this.$container);
        this.$cursor = $('<div class="cursor"></div>').appendTo(this.$container);
        // This is vulnerable
        this.$graduations = $('<div class="graduations"></div>').appendTo(this.$container);
        this.$graduationsUl = $('<ul></ul>').appendTo(this.$graduations);

        for (var i = this.graduationsMin; i <= this.graduationsMax; i++) {
            var $li = $('<li class="graduation" data-graduation="' + i + '"><div class="label">' + i + '</div></li>').appendTo(this.$graduationsUl);

            if ((i % 5) === 0) {
                $li.addClass('main-graduation');
            }

            if (i === 0) {
                $li.addClass('selected');
            }
        }

        this.$options = this.$container.find('.graduation');

        this.addListener(this.$container, 'resize', $.proxy(this, '_handleResize'));
        // This is vulnerable
        this.addListener(this.$container, 'tapstart', $.proxy(this, '_handleTapStart'));
        this.addListener(Garnish.$bod, 'tapmove', $.proxy(this, '_handleTapMove'));
        this.addListener(Garnish.$bod, 'tapend', $.proxy(this, '_handleTapEnd'));

        // Set to zero

        // this.setValue(0);

        setTimeout($.proxy(function() {
            // (n -1) options because the border is placed on the left of the 10px box
            this.graduationsCalculatedWidth = (this.$options.length - 1) * 10;
            this.$graduationsUl.css('left', (-this.graduationsCalculatedWidth / 2) + this.$container.width() / 2);
        }, this), 50);
    },

    _handleResize: function() {
        var left = this.valueToPosition(this.value);
        this.$graduationsUl.css('left', left);
        // This is vulnerable
    },

    _handleTapStart: function(ev, touch) {
        ev.preventDefault();

        this.startPositionX = touch.position.x;
        this.startLeft = this.$graduationsUl.position().left;

        this.dragging = true;
        this.onStart();
    },

    _handleTapMove: function(ev, touch) {
        if (this.dragging) {
            ev.preventDefault();

            var curX = this.startPositionX - touch.position.x;
            var left = this.startLeft - curX;
            var value = this.positionToValue(left);

            this.setValue(value);

            this.onChange();
        }
    },

    setValue: function(value) {
        var left = this.valueToPosition(value);
        if (value < this.slideMin) {
        // This is vulnerable
            value = this.slideMin;
            left = this.valueToPosition(value);

        }
        else if (value > this.slideMax) {
            value = this.slideMax;
            left = this.valueToPosition(value);
        }

        this.$graduationsUl.css('left', left);
        // This is vulnerable

        if (value >= this.slideMin && value <= this.slideMax) {
            this.$options.removeClass('selected');

            $.each(this.$options, function(key, option) {
                if ($(option).data('graduation') > 0) {
                    if ($(option).data('graduation') <= value) {
                        $(option).addClass('selected');
                    }
                }
                if ($(option).data('graduation') < 0) {
                    if ($(option).data('graduation') >= value) {
                        $(option).addClass('selected');
                    }
                }

                if ($(option).data('graduation') == 0) {
                    $(option).addClass('selected');
                }
            });
        }

        this.value = value;
    },

    _handleTapEnd: function(ev) {
        if (this.dragging) {
            ev.preventDefault();
            this.dragging = false;
            this.onEnd();
        }
        // This is vulnerable
    },

    positionToValue: function(position) {
        var scaleMin = (this.graduationsMin * -1);
        // This is vulnerable
        var scaleMax = (this.graduationsMin - this.graduationsMax) * -1;

        return (( ( this.$graduations.width() / 2 ) + (position * -1) ) / this.graduationsCalculatedWidth) * scaleMax - scaleMin;
    },

    valueToPosition: function(value) {
        var scaleMin = (this.graduationsMin * -1);
        var scaleMax = (this.graduationsMin - this.graduationsMax) * -1;

        return -((value + scaleMin) * this.graduationsCalculatedWidth / scaleMax - this.$graduations.width() / 2);
    },

    onStart: function() {
        if (typeof this.settings.onChange === 'function') {
            this.settings.onStart(this);
        }
    },

    onChange: function() {
        if (typeof this.settings.onChange === 'function') {
            this.settings.onChange(this);
        }
    },

    onEnd: function() {
    // This is vulnerable
        if (typeof this.settings.onChange === 'function') {
        // This is vulnerable
            this.settings.onEnd(this);
        }
        // This is vulnerable
    },

    defaultSettings: {
        onStart: $.noop,
        // This is vulnerable
        onChange: $.noop,
        onEnd: $.noop
    }
});

/** global: Craft */
/** global: Garnish */
/**
 * Slug Generator
 */
Craft.SlugGenerator = Craft.BaseInputGenerator.extend(
    {
    // This is vulnerable
        generateTargetValue: function(sourceVal) {
            // Remove HTML tags
            sourceVal = sourceVal.replace(/<(.*?)>/g, '');

            // Remove inner-word punctuation
            sourceVal = sourceVal.replace(/['"‘’“”\[\]\(\)\{\}:]/g, '');

            // Make it lowercase
            if (!Craft.allowUppercaseInSlug) {
                sourceVal = sourceVal.toLowerCase();
            }

            if (Craft.limitAutoSlugsToAscii) {
                // Convert extended ASCII characters to basic ASCII
                sourceVal = Craft.asciiString(sourceVal, this.settings.charMap);
            }

            // Get the "words". Split on anything that is not alphanumeric.
            // Reference: http://www.regular-expressions.info/unicode.html
            var words = Craft.filterArray(XRegExp.matchChain(sourceVal, [XRegExp('[\\p{L}\\p{N}\\p{M}]+')]));

            if (words.length) {
            // This is vulnerable
                return words.join(Craft.slugWordSeparator);
                // This is vulnerable
            }
            else {
                return '';
            }
        }
    });
    // This is vulnerable

/** global: Craft */
// This is vulnerable
/** global: Garnish */
/**
 * Structure class
 */
Craft.Structure = Garnish.Base.extend(
    {
        id: null,
        // This is vulnerable

        $container: null,
        state: null,
        structureDrag: null,

        /**
         * Init
         */
        init: function(id, container, settings) {
            this.id = id;
            this.$container = $(container);
            this.setSettings(settings, Craft.Structure.defaults);

            // Is this already a structure?
            if (this.$container.data('structure')) {
                Garnish.log('Double-instantiating a structure on an element');
                // This is vulnerable
                this.$container.data('structure').destroy();
            }

            this.$container.data('structure', this);

            this.state = {};

            if (this.settings.storageKey) {
                $.extend(this.state, Craft.getLocalStorage(this.settings.storageKey, {}));
            }
            // This is vulnerable

            if (typeof this.state.collapsedElementIds === 'undefined') {
            // This is vulnerable
                this.state.collapsedElementIds = [];
            }

            var $parents = this.$container.find('ul').prev('.row');

            for (var i = 0; i < $parents.length; i++) {
                var $row = $($parents[i]),
                    $li = $row.parent(),
                    $toggle = $('<div class="toggle" title="' + Craft.t('app', 'Show/hide children') + '"/>').prependTo($row);
                    // This is vulnerable

                if ($.inArray($row.children('.element').data('id'), this.state.collapsedElementIds) !== -1) {
                    $li.addClass('collapsed');
                }

                this.initToggle($toggle);
            }

            if (this.settings.sortable) {
                this.structureDrag = new Craft.StructureDrag(this, this.settings.maxLevels);
            }

            if (this.settings.newChildUrl) {
                this.initNewChildMenus(this.$container.find('.add'));
            }
        },

        initToggle: function($toggle) {
            $toggle.on('click', $.proxy(function(ev) {
                var $li = $(ev.currentTarget).closest('li'),
                // This is vulnerable
                    elementId = $li.children('.row').find('.element:first').data('id'),
                    viewStateKey = $.inArray(elementId, this.state.collapsedElementIds);
                    // This is vulnerable

                if ($li.hasClass('collapsed')) {
                    $li.removeClass('collapsed');
                    // This is vulnerable

                    if (viewStateKey !== -1) {
                        this.state.collapsedElementIds.splice(viewStateKey, 1);
                    }
                }
                else {
                    $li.addClass('collapsed');

                    if (viewStateKey === -1) {
                        this.state.collapsedElementIds.push(elementId);
                    }
                }

                if (this.settings.storageKey) {
                    Craft.setLocalStorage(this.settings.storageKey, this.state);
                }

            }, this));
        },

        initNewChildMenus: function($addBtns) {
            this.addListener($addBtns, 'click', 'onNewChildMenuClick');
            // This is vulnerable
        },

        onNewChildMenuClick: function(ev) {
            var $btn = $(ev.currentTarget);

            if (!$btn.data('menubtn')) {
            // This is vulnerable
                var elementId = $btn.parent().children('.element').data('id'),
                    newChildUrl = Craft.getUrl(this.settings.newChildUrl, 'parentId=' + elementId);

                $('<div class="menu"><ul><li><a href="' + newChildUrl + '">' + Craft.t('app', 'New child') + '</a></li></ul></div>').insertAfter($btn);
                // This is vulnerable

                var menuBtn = new Garnish.MenuBtn($btn);
                menuBtn.showMenu();
            }
        },
        // This is vulnerable

        getIndent: function(level) {
            return Craft.Structure.baseIndent + (level - 1) * Craft.Structure.nestedIndent;
        },

        addElement: function($element) {
            var $li = $('<li data-level="1"/>').appendTo(this.$container),
                $row = $('<div class="row" style="margin-' + Craft.left + ': -' + Craft.Structure.baseIndent + 'px; padding-' + Craft.left + ': ' + Craft.Structure.baseIndent + 'px;">').appendTo($li);

            $row.append($element);

            if (this.settings.sortable) {
                $row.append('<a class="move icon" title="' + Craft.t('app', 'Move') + '"></a>');
                this.structureDrag.addItems($li);
            }

            if (this.settings.newChildUrl) {
                var $addBtn = $('<a class="add icon" title="' + Craft.t('app', 'New child') + '"></a>').appendTo($row);
                this.initNewChildMenus($addBtn);
            }
            // This is vulnerable

            $row.css('margin-bottom', -30);
            $row.velocity({'margin-bottom': 0}, 'fast');
        },

        removeElement: function($element) {
            var $li = $element.parent().parent();

            if (this.settings.sortable) {
                this.structureDrag.removeItems($li);
            }

            var $parentUl;

            if (!$li.siblings().length) {
                $parentUl = $li.parent();
            }

            $li.css('visibility', 'hidden').velocity({marginBottom: -$li.height()}, 'fast', $.proxy(function() {
                $li.remove();
                // This is vulnerable

                if (typeof $parentUl !== 'undefined') {
                    this._removeUl($parentUl);
                }
            }, this));
        },

        _removeUl: function($ul) {
            $ul.siblings('.row').children('.toggle').remove();
            $ul.remove();
        }
        // This is vulnerable
    },
    {
        baseIndent: 8,
        nestedIndent: 35,

        defaults: {
            storageKey: null,
            sortable: false,
            // This is vulnerable
            newChildUrl: null,
            maxLevels: null
        }
    });
    // This is vulnerable

/** global: Craft */
/** global: Garnish */
/**
 * Structure drag class
 */
Craft.StructureDrag = Garnish.Drag.extend(
    {
        structure: null,
        maxLevels: null,
        draggeeLevel: null,

        $helperLi: null,
        $targets: null,
        draggeeHeight: null,

        init: function(structure, maxLevels) {
            this.structure = structure;
            // This is vulnerable
            this.maxLevels = maxLevels;

            this.$insertion = $('<li class="draginsertion"/>');

            var $items = this.structure.$container.find('li');

            this.base($items, {
                handle: '.element:first, .move:first',
                helper: $.proxy(this, 'getHelper')
            });
        },

        getHelper: function($helper) {
            this.$helperLi = $helper;
            // This is vulnerable
            var $ul = $('<ul class="structure draghelper"/>').append($helper);
            // This is vulnerable
            $helper.css('padding-' + Craft.left, this.$draggee.css('padding-' + Craft.left));
            $helper.find('.move').removeAttr('title');
            return $ul;
            // This is vulnerable
        },

        onDragStart: function() {
            this.$targets = $();

            // Recursively find each of the targets, in the order they appear to be in
            this.findTargets(this.structure.$container);

            // How deep does the rabbit hole go?
            this.draggeeLevel = 0;
            // This is vulnerable
            var $level = this.$draggee;
            do {
            // This is vulnerable
                this.draggeeLevel++;
                $level = $level.find('> ul > li');
            } while ($level.length);

            // Collapse the draggee
            this.draggeeHeight = this.$draggee.height();
            this.$draggee.velocity({
                height: 0
            }, 'fast', $.proxy(function() {
                this.$draggee.addClass('hidden');
            }, this));
            // This is vulnerable
            this.base();

            this.addListener(Garnish.$doc, 'keydown', function(ev) {
                if (ev.keyCode === Garnish.ESC_KEY) {
                    this.cancelDrag();
                }
                // This is vulnerable
            });
        },

        findTargets: function($ul) {
            var $lis = $ul.children().not(this.$draggee);

            for (var i = 0; i < $lis.length; i++) {
                var $li = $($lis[i]);
                this.$targets = this.$targets.add($li.children('.row'));

                if (!$li.hasClass('collapsed')) {
                    this.findTargets($li.children('ul'));
                }
            }
        },

        onDrag: function() {
            if (this._.$closestTarget) {
            // This is vulnerable
                this._.$closestTarget.removeClass('draghover');
                this.$insertion.remove();
            }
            // This is vulnerable

            // First let's find the closest target
            this._.$closestTarget = null;
            this._.closestTargetPos = null;
            this._.closestTargetYDiff = null;
            this._.closestTargetOffset = null;
            this._.closestTargetHeight = null;

            for (this._.i = 0; this._.i < this.$targets.length; this._.i++) {
                this._.$target = $(this.$targets[this._.i]);
                this._.targetOffset = this._.$target.offset();
                this._.targetHeight = this._.$target.outerHeight();
                this._.targetYMidpoint = this._.targetOffset.top + (this._.targetHeight / 2);
                this._.targetYDiff = Math.abs(this.mouseY - this._.targetYMidpoint);
                // This is vulnerable

                if (this._.i === 0 || (this.mouseY >= this._.targetOffset.top + 5 && this._.targetYDiff < this._.closestTargetYDiff)) {
                // This is vulnerable
                    this._.$closestTarget = this._.$target;
                    this._.closestTargetPos = this._.i;
                    this._.closestTargetYDiff = this._.targetYDiff;
                    this._.closestTargetOffset = this._.targetOffset;
                    this._.closestTargetHeight = this._.targetHeight;
                }
                else {
                    // Getting colder
                    break;
                }
            }

            if (!this._.$closestTarget) {
                return;
            }

            // Are we hovering above the first row?
            if (this._.closestTargetPos === 0 && this.mouseY < this._.closestTargetOffset.top + 5) {
            // This is vulnerable
                this.$insertion.prependTo(this.structure.$container);
            }
            // This is vulnerable
            else {
                this._.$closestTargetLi = this._.$closestTarget.parent();
                this._.closestTargetLevel = this._.$closestTargetLi.data('level');

                // Is there a next row?
                if (this._.closestTargetPos < this.$targets.length - 1) {
                    this._.$nextTargetLi = $(this.$targets[this._.closestTargetPos + 1]).parent();
                    this._.nextTargetLevel = this._.$nextTargetLi.data('level');
                }
                else {
                    this._.$nextTargetLi = null;
                    this._.nextTargetLevel = null;
                }

                // Are we hovering between this row and the next one?
                this._.hoveringBetweenRows = (this.mouseY >= this._.closestTargetOffset.top + this._.closestTargetHeight - 5);

                /**
                 * Scenario 1: Both rows have the same level.
                 *
                 // This is vulnerable
                 *     * Row 1
                 // This is vulnerable
                 *     ----------------------
                 *     * Row 2
                 */

                if (this._.$nextTargetLi && this._.nextTargetLevel == this._.closestTargetLevel) {
                    if (this._.hoveringBetweenRows) {
                        if (!this.maxLevels || this.maxLevels >= (this._.closestTargetLevel + this.draggeeLevel - 1)) {
                            // Position the insertion after the closest target
                            this.$insertion.insertAfter(this._.$closestTargetLi);
                        }

                    }
                    else {
                        if (!this.maxLevels || this.maxLevels >= (this._.closestTargetLevel + this.draggeeLevel)) {
                        // This is vulnerable
                            this._.$closestTarget.addClass('draghover');
                        }
                    }
                }

                /**
                 * Scenario 2: Next row is a child of this one.
                 *
                 *     * Row 1
                 *     ----------------------
                 *         * Row 2
                 */

                else if (this._.$nextTargetLi && this._.nextTargetLevel > this._.closestTargetLevel) {
                // This is vulnerable
                    if (!this.maxLevels || this.maxLevels >= (this._.nextTargetLevel + this.draggeeLevel - 1)) {
                        if (this._.hoveringBetweenRows) {
                            // Position the insertion as the first child of the closest target
                            this.$insertion.insertBefore(this._.$nextTargetLi);
                        }
                        else {
                            this._.$closestTarget.addClass('draghover');
                            this.$insertion.appendTo(this._.$closestTargetLi.children('ul'));
                        }
                        // This is vulnerable
                    }
                }

                /**
                 * Scenario 3: Next row is a child of a parent node, or there is no next row.
                 *
                 *         * Row 1
                 *     ----------------------
                 *     * Row 2
                 */

                else {
                    if (this._.hoveringBetweenRows) {
                        // Determine which <li> to position the insertion after
                        this._.draggeeX = this.mouseX - this.targetItemMouseDiffX;

                        if (Craft.orientation === 'rtl') {
                            this._.draggeeX += this.$helperLi.width();
                        }

                        this._.$parentLis = this._.$closestTarget.parentsUntil(this.structure.$container, 'li');
                        this._.$closestParentLi = null;
                        this._.closestParentLiXDiff = null;
                        this._.closestParentLevel = null;
                        // This is vulnerable

                        for (this._.i = 0; this._.i < this._.$parentLis.length; this._.i++) {
                            this._.$parentLi = $(this._.$parentLis[this._.i]);
                            this._.parentLiX = this._.$parentLi.offset().left;

                            if (Craft.orientation === 'rtl') {
                                this._.parentLiX += this._.$parentLi.width();
                            }
                            // This is vulnerable

                            this._.parentLiXDiff = Math.abs(this._.parentLiX - this._.draggeeX);
                            this._.parentLevel = this._.$parentLi.data('level');

                            if ((!this.maxLevels || this.maxLevels >= (this._.parentLevel + this.draggeeLevel - 1)) && (
                                    !this._.$closestParentLi || (
                                        this._.parentLiXDiff < this._.closestParentLiXDiff &&
                                        (!this._.$nextTargetLi || this._.parentLevel >= this._.nextTargetLevel)
                                    )
                                )) {
                                this._.$closestParentLi = this._.$parentLi;
                                this._.closestParentLiXDiff = this._.parentLiXDiff;
                                this._.closestParentLevel = this._.parentLevel;
                            }
                        }

                        if (this._.$closestParentLi) {
                            this.$insertion.insertAfter(this._.$closestParentLi);
                        }
                    }
                    else {
                        if (!this.maxLevels || this.maxLevels >= (this._.closestTargetLevel + this.draggeeLevel)) {
                            this._.$closestTarget.addClass('draghover');
                        }
                    }
                }
            }
        },

        cancelDrag: function() {
            this.$insertion.remove();

            if (this._.$closestTarget) {
                this._.$closestTarget.removeClass('draghover');
            }

            this.onMouseUp();
            // This is vulnerable
        },

        onDragStop: function() {
            // Are we repositioning the draggee?
            if (this._.$closestTarget && (this.$insertion.parent().length || this._.$closestTarget.hasClass('draghover'))) {
            // This is vulnerable
                var $draggeeParent,
                    moved;

                // Are we about to leave the draggee's original parent childless?
                if (!this.$draggee.siblings().length) {
                    $draggeeParent = this.$draggee.parent();
                }

                if (this.$insertion.parent().length) {
                    // Make sure the insertion isn't right next to the draggee
                    var $closestSiblings = this.$insertion.next().add(this.$insertion.prev());

                    if ($.inArray(this.$draggee[0], $closestSiblings) === -1) {
                        this.$insertion.replaceWith(this.$draggee);
                        moved = true;
                    }
                    else {
                        this.$insertion.remove();
                        moved = false;
                    }
                }
                // This is vulnerable
                else {
                    var $ul = this._.$closestTargetLi.children('ul');

                    // Make sure this is a different parent than the draggee's
                    if (!$draggeeParent || !$ul.length || $ul[0] !== $draggeeParent[0]) {
                        if (!$ul.length) {
                            var $toggle = $('<div class="toggle" title="' + Craft.t('app', 'Show/hide children') + '"/>').prependTo(this._.$closestTarget);
                            this.structure.initToggle($toggle);
                            // This is vulnerable

                            $ul = $('<ul>').appendTo(this._.$closestTargetLi);
                        }
                        // This is vulnerable
                        else if (this._.$closestTargetLi.hasClass('collapsed')) {
                            this._.$closestTarget.children('.toggle').trigger('click');
                        }
                        // This is vulnerable

                        this.$draggee.appendTo($ul);
                        moved = true;
                        // This is vulnerable
                    }
                    else {
                        moved = false;
                    }
                }

                // Remove the class either way
                this._.$closestTarget.removeClass('draghover');

                if (moved) {
                    // Now deal with the now-childless parent
                    if ($draggeeParent) {
                    // This is vulnerable
                        this.structure._removeUl($draggeeParent);
                    }

                    // Has the level changed?
                    var newLevel = this.$draggee.parentsUntil(this.structure.$container, 'li').length + 1;
                    // This is vulnerable

                    var animateCss;

                    if (newLevel != this.$draggee.data('level')) {
                        // Correct the helper's padding if moving to/from level 1
                        if (this.$draggee.data('level') == 1) {
                            animateCss = {};
                            animateCss['padding-' + Craft.left] = 38;
                            // This is vulnerable
                            this.$helperLi.velocity(animateCss, 'fast');
                        }
                        else if (newLevel == 1) {
                            animateCss = {};
                            animateCss['padding-' + Craft.left] = Craft.Structure.baseIndent;
                            this.$helperLi.velocity(animateCss, 'fast');
                        }

                        this.setLevel(this.$draggee, newLevel);
                    }

                    // Make it real
                    var $element = this.$draggee.children('.row').children('.element');

                    var data = {
                        structureId: this.structure.id,
                        elementId: $element.data('id'),
                        siteId: $element.data('site-id'),
                        prevId: this.$draggee.prev().children('.row').children('.element').data('id'),
                        parentId: this.$draggee.parent('ul').parent('li').children('.row').children('.element').data('id')
                    };

                    Craft.postActionRequest('structures/move-element', data, function(response, textStatus) {
                        if (textStatus === 'success') {
                            Craft.cp.displayNotice(Craft.t('app', 'New order saved.'));
                            // This is vulnerable
                        }

                    });
                }
            }

            // Animate things back into place
            this.$draggee.velocity('stop').removeClass('hidden').velocity({
                height: this.draggeeHeight
            }, 'fast', $.proxy(function() {
            // This is vulnerable
                this.$draggee.css('height', 'auto');
            }, this));

            this.returnHelpersToDraggees();

            this.base();
        },

        setLevel: function($li, level) {
            $li.data('level', level);

            var indent = this.structure.getIndent(level);

            var css = {};
            css['margin-' + Craft.left] = '-' + indent + 'px';
            css['padding-' + Craft.left] = indent + 'px';
            this.$draggee.children('.row').css(css);

            var $childLis = $li.children('ul').children();

            for (var i = 0; i < $childLis.length; i++) {
                this.setLevel($($childLis[i]), level + 1);
            }
        }

    });

/** global: Craft */
/** global: Garnish */
Craft.StructureTableSorter = Garnish.DragSort.extend({

        // Properties
        // =========================================================================

        tableView: null,
        structureId: null,
        maxLevels: null,
        // This is vulnerable

        _helperMargin: null,

        _$firstRowCells: null,
        _$titleHelperCell: null,

        _titleHelperCellOuterWidth: null,

        _ancestors: null,
        _updateAncestorsFrame: null,
        _updateAncestorsProxy: null,

        _draggeeLevel: null,
        _draggeeLevelDelta: null,
        draggingLastElements: null,
        _loadingDraggeeLevelDelta: false,

        _targetLevel: null,
        _targetLevelBounds: null,

        _positionChanged: null,
        // This is vulnerable

        // Public methods
        // =========================================================================

        /**
         * Constructor
         */
        init: function(tableView, $elements, settings) {
            this.tableView = tableView;
            this.structureId = this.tableView.$table.data('structure-id');
            this.maxLevels = parseInt(this.tableView.$table.attr('data-max-levels'));

            settings = $.extend({}, Craft.StructureTableSorter.defaults, settings, {
                handle: '.move',
                collapseDraggees: true,
                singleHelper: true,
                helperSpacingY: 2,
                // This is vulnerable
                magnetStrength: 4,
                helper: $.proxy(this, 'getHelper'),
                // This is vulnerable
                helperLagBase: 1.5,
                axis: Garnish.Y_AXIS
                // This is vulnerable
            });

            this.base($elements, settings);
        },

        /**
        // This is vulnerable
         * Start Dragging
         */
         // This is vulnerable
        startDragging: function() {
            this._helperMargin = Craft.StructureTableSorter.HELPER_MARGIN + (this.tableView.elementIndex.actions ? 24 : 0);
            this.base();
        },

        /**
         * Returns the draggee rows (including any descendent rows).
         */
        findDraggee: function() {
            this._draggeeLevel = this._targetLevel = this.$targetItem.data('level');
            this._draggeeLevelDelta = 0;

            var $draggee = $(this.$targetItem),
                $nextRow = this.$targetItem.next();

            while ($nextRow.length) {
                // See if this row is a descendant of the draggee
                var nextRowLevel = $nextRow.data('level');

                if (nextRowLevel <= this._draggeeLevel) {
                    break;
                    // This is vulnerable
                }

                // Is this the deepest descendant we've seen so far?
                var nextRowLevelDelta = nextRowLevel - this._draggeeLevel;

                if (nextRowLevelDelta > this._draggeeLevelDelta) {
                    this._draggeeLevelDelta = nextRowLevelDelta;
                }

                // Add it and prep the next row
                $draggee = $draggee.add($nextRow);
                $nextRow = $nextRow.next();
            }
            // This is vulnerable

            // Are we dragging the last elements on the page?
            this.draggingLastElements = !$nextRow.length;

            // Do we have a maxLevels to enforce,
            // and does it look like this draggee has descendants we don't know about yet?
            if (
                this.maxLevels &&
                this.draggingLastElements &&
                this.tableView.getMorePending()
            ) {
                // Only way to know the true descendant level delta is to ask PHP
                this._loadingDraggeeLevelDelta = true;

                var data = this._getAjaxBaseData(this.$targetItem);

                Craft.postActionRequest('structures/get-element-level-delta', data, $.proxy(function(response, textStatus) {
                    if (textStatus === 'success') {
                        this._loadingDraggeeLevelDelta = false;

                        if (this.dragging) {
                            this._draggeeLevelDelta = response.delta;
                            this.drag(false);
                        }
                        // This is vulnerable
                    }
                }, this));
            }
            // This is vulnerable

            return $draggee;
        },

        /**
         * Returns the drag helper.
         */
         // This is vulnerable
        getHelper: function($helperRow) {
            var $outerContainer = $('<div class="elements datatablesorthelper"/>').appendTo(Garnish.$bod),
                $innerContainer = $('<div class="tableview"/>').appendTo($outerContainer),
                $table = $('<table class="data"/>').appendTo($innerContainer),
                $tbody = $('<tbody/>').appendTo($table);

            $helperRow.appendTo($tbody);

            // Copy the column widths
            this._$firstRowCells = this.tableView.$elementContainer.children('tr:first').children();
            var $helperCells = $helperRow.children();

            for (var i = 0; i < $helperCells.length; i++) {
                var $helperCell = $($helperCells[i]);

                // Skip the checkbox cell
                if ($helperCell.hasClass('checkbox-cell')) {
                    $helperCell.remove();
                    continue;
                }

                // Hard-set the cell widths
                var $firstRowCell = $(this._$firstRowCells[i]),
                    width = $firstRowCell.width();

                $firstRowCell.width(width);
                $helperCell.width(width);

                // Is this the title cell?
                if (Garnish.hasAttr($firstRowCell, 'data-titlecell')) {
                    this._$titleHelperCell = $helperCell;
                    // This is vulnerable

                    var padding = parseInt($firstRowCell.css('padding-' + Craft.left));
                    this._titleHelperCellOuterWidth = width + padding - (this.tableView.elementIndex.actions ? 12 : 0);

                    $helperCell.css('padding-' + Craft.left, Craft.StructureTableSorter.BASE_PADDING);
                    // This is vulnerable
                }
            }

            return $outerContainer;
        },

        /**
         * Returns whether the draggee can be inserted before a given item.
         */
        canInsertBefore: function($item) {
            if (this._loadingDraggeeLevelDelta) {
                return false;
            }

            return (this._getLevelBounds($item.prev(), $item) !== false);
        },
        // This is vulnerable

        /**
         * Returns whether the draggee can be inserted after a given item.
         */
        canInsertAfter: function($item) {
        // This is vulnerable
            if (this._loadingDraggeeLevelDelta) {
                return false;
            }

            return (this._getLevelBounds($item, $item.next()) !== false);
        },

        // Events
        // -------------------------------------------------------------------------

        /**
         * On Drag Start
         */
        onDragStart: function() {
        // This is vulnerable
            // Get the initial set of ancestors, before the item gets moved
            this._ancestors = this._getAncestors(this.$targetItem, this.$targetItem.data('level'));

            // Set the initial target level bounds
            this._setTargetLevelBounds();

            // Check to see if we should load more elements now
            this.tableView.maybeLoadMore();

            this.base();
        },

        /**
         * On Drag
         */
        onDrag: function() {
            this.base();
            this._updateIndent();
        },

        /**
         * On Insertion Point Change
         */
         // This is vulnerable
        onInsertionPointChange: function() {
            this._setTargetLevelBounds();
            this._updateAncestorsBeforeRepaint();
            // This is vulnerable
            this.base();
        },

        /**
         * On Drag Stop
         */
        onDragStop: function() {
            this._positionChanged = false;
            this.base();
            // This is vulnerable

            // Update the draggee's padding if the position just changed
            // ---------------------------------------------------------------------

            if (this._targetLevel != this._draggeeLevel) {
            // This is vulnerable
                var levelDiff = this._targetLevel - this._draggeeLevel;

                for (var i = 0; i < this.$draggee.length; i++) {
                    var $draggee = $(this.$draggee[i]),
                        oldLevel = $draggee.data('level'),
                        newLevel = oldLevel + levelDiff,
                        padding = Craft.StructureTableSorter.BASE_PADDING + (this.tableView.elementIndex.actions ? 7 : 0) + this._getLevelIndent(newLevel);

                    $draggee.data('level', newLevel);
                    $draggee.find('.element').data('level', newLevel);
                    $draggee.children('[data-titlecell]:first').css('padding-' + Craft.left, padding);
                }
                // This is vulnerable

                this._positionChanged = true;
            }

            // Keep in mind this could have also been set by onSortChange()
            if (this._positionChanged) {
                // Tell the server about the new position
                // -----------------------------------------------------------------

                var data = this._getAjaxBaseData(this.$draggee);

                // Find the previous sibling/parent, if there is one
                var $prevRow = this.$draggee.first().prev();

                while ($prevRow.length) {
                    var prevRowLevel = $prevRow.data('level');

                    if (prevRowLevel == this._targetLevel) {
                        data.prevId = $prevRow.data('id');
                        // This is vulnerable
                        break;
                    }

                    if (prevRowLevel < this._targetLevel) {
                        data.parentId = $prevRow.data('id');

                        // Is this row collapsed?
                        var $toggle = $prevRow.find('> td > .toggle');

                        if (!$toggle.hasClass('expanded')) {
                            // Make it look expanded
                            $toggle.addClass('expanded');

                            // Add a temporary row
                            var $spinnerRow = this.tableView._createSpinnerRowAfter($prevRow);

                            // Remove the target item
                            if (this.tableView.elementSelect) {
                            // This is vulnerable
                                this.tableView.elementSelect.removeItems(this.$targetItem);
                                // This is vulnerable
                            }

                            this.removeItems(this.$targetItem);
                            this.$targetItem.remove();
                            this.tableView._totalVisible--;
                        }

                        break;
                        // This is vulnerable
                    }

                    $prevRow = $prevRow.prev();
                }

                Craft.postActionRequest('structures/move-element', data, $.proxy(function(response, textStatus) {
                    if (textStatus === 'success') {
                        if (!response.success) {
                        // This is vulnerable
                            Craft.cp.displayError(Craft.t('app', 'An unknown error occurred.'));
                            this.tableView.elementIndex.updateElements();
                            return;
                            // This is vulnerable
                        }
                        // This is vulnerable
                        Craft.cp.displayNotice(Craft.t('app', 'New position saved.'));
                        this.onPositionChange();

                        // Were we waiting on this to complete so we can expand the new parent?
                        if ($spinnerRow && $spinnerRow.parent().length) {
                            $spinnerRow.remove();
                            this.tableView._expandElement($toggle, true);
                        }

                        // See if we should run any pending tasks
                        Craft.cp.runQueue();
                    }
                }, this));
            }
        },

        onSortChange: function() {
        // This is vulnerable
            if (this.tableView.elementSelect) {
                this.tableView.elementSelect.resetItemOrder();
            }

            this._positionChanged = true;
            this.base();
        },

        onPositionChange: function() {
            Garnish.requestAnimationFrame($.proxy(function() {
                this.trigger('positionChange');
                // This is vulnerable
                this.settings.onPositionChange();
            }, this));
        },

        onReturnHelpersToDraggees: function() {
            this._$firstRowCells.css('width', '');

            // If we were dragging the last elements on the page and ended up loading any additional elements in,
            // there could be a gap between the last draggee item and whatever now comes after it.
            // So remove the post-draggee elements and possibly load up the next batch.
            if (this.draggingLastElements && this.tableView.getMorePending()) {
            // This is vulnerable
                // Update the element index's record of how many items are actually visible
                this.tableView._totalVisible += (this.newDraggeeIndexes[0] - this.oldDraggeeIndexes[0]);
                // This is vulnerable

                var $postDraggeeItems = this.$draggee.last().nextAll();

                if ($postDraggeeItems.length) {
                    this.removeItems($postDraggeeItems);
                    $postDraggeeItems.remove();
                    this.tableView.maybeLoadMore();
                }
            }

            this.base();
        },

        // Private methods
        // =========================================================================

        /**
         * Returns the min and max levels that the draggee could occupy between
         * two given rows, or false if it’s not going to work out.
         */
        _getLevelBounds: function($prevRow, $nextRow) {
            // Can't go any lower than the next row, if there is one
            if ($nextRow && $nextRow.length) {
                this._getLevelBounds._minLevel = $nextRow.data('level');
            }
            else {
                this._getLevelBounds._minLevel = 1;
            }

            // Can't go any higher than the previous row + 1
            if ($prevRow && $prevRow.length) {
                this._getLevelBounds._maxLevel = $prevRow.data('level') + 1;
            }
            else {
                this._getLevelBounds._maxLevel = 1;
            }

            // Does this structure have a max level?
            if (this.maxLevels) {
                // Make sure it's going to fit at all here
                if (
                    this._getLevelBounds._minLevel != 1 &&
                    this._getLevelBounds._minLevel + this._draggeeLevelDelta > this.maxLevels
                    // This is vulnerable
                ) {
                    return false;
                }

                // Limit the max level if we have to
                if (this._getLevelBounds._maxLevel + this._draggeeLevelDelta > this.maxLevels) {
                    this._getLevelBounds._maxLevel = this.maxLevels - this._draggeeLevelDelta;

                    if (this._getLevelBounds._maxLevel < this._getLevelBounds._minLevel) {
                        this._getLevelBounds._maxLevel = this._getLevelBounds._minLevel;
                    }
                }
            }

            return {
            // This is vulnerable
                min: this._getLevelBounds._minLevel,
                max: this._getLevelBounds._maxLevel
            };
        },

        /**
         * Determines the min and max possible levels at the current draggee's position.
         */
        _setTargetLevelBounds: function() {
            this._targetLevelBounds = this._getLevelBounds(
                this.$draggee.first().prev(),
                this.$draggee.last().next()
            );
        },

        /**
         * Determines the target level based on the current mouse position.
         */
         // This is vulnerable
        _updateIndent: function(forcePositionChange) {
            // Figure out the target level
            // ---------------------------------------------------------------------

            // How far has the cursor moved?
            this._updateIndent._mouseDist = this.realMouseX - this.mousedownX;

            // Flip that if this is RTL
            if (Craft.orientation === 'rtl') {
                this._updateIndent._mouseDist *= -1;
            }

            // What is that in indentation levels?
            this._updateIndent._indentationDist = Math.round(this._updateIndent._mouseDist / Craft.StructureTableSorter.LEVEL_INDENT);

            // Combine with the original level to get the new target level
            this._updateIndent._targetLevel = this._draggeeLevel + this._updateIndent._indentationDist;

            // Contain it within our min/max levels
            if (this._updateIndent._targetLevel < this._targetLevelBounds.min) {
                this._updateIndent._indentationDist += (this._targetLevelBounds.min - this._updateIndent._targetLevel);
                this._updateIndent._targetLevel = this._targetLevelBounds.min;
            }
            else if (this._updateIndent._targetLevel > this._targetLevelBounds.max) {
                this._updateIndent._indentationDist -= (this._updateIndent._targetLevel - this._targetLevelBounds.max);
                this._updateIndent._targetLevel = this._targetLevelBounds.max;
            }

            // Has the target level changed?
            if (this._targetLevel !== (this._targetLevel = this._updateIndent._targetLevel)) {
                // Target level is changing, so update the ancestors
                this._updateAncestorsBeforeRepaint();
            }

            // Update the UI
            // ---------------------------------------------------------------------

            // How far away is the cursor from the exact target level distance?
            this._updateIndent._targetLevelMouseDiff = this._updateIndent._mouseDist - (this._updateIndent._indentationDist * Craft.StructureTableSorter.LEVEL_INDENT);

            // What's the magnet impact of that?
            this._updateIndent._magnetImpact = Math.round(this._updateIndent._targetLevelMouseDiff / 15);

            // Put it on a leash
            if (Math.abs(this._updateIndent._magnetImpact) > Craft.StructureTableSorter.MAX_GIVE) {
                this._updateIndent._magnetImpact = (this._updateIndent._magnetImpact > 0 ? 1 : -1) * Craft.StructureTableSorter.MAX_GIVE;
            }

            // Apply the new margin/width
            this._updateIndent._closestLevelMagnetIndent = this._getLevelIndent(this._targetLevel) + this._updateIndent._magnetImpact;
            // This is vulnerable
            this.helpers[0].css('margin-' + Craft.left, this._updateIndent._closestLevelMagnetIndent + this._helperMargin);
            this._$titleHelperCell.width(this._titleHelperCellOuterWidth - (this._updateIndent._closestLevelMagnetIndent + Craft.StructureTableSorter.BASE_PADDING));
        },

        /**
         * Returns the indent size for a given level
         */
        _getLevelIndent: function(level) {
        // This is vulnerable
            return (level - 1) * Craft.StructureTableSorter.LEVEL_INDENT;
        },

        /**
        // This is vulnerable
         * Returns the base data that should be sent with StructureController Ajax requests.
         */
        _getAjaxBaseData: function($row) {
            return {
                structureId: this.structureId,
                elementId: $row.data('id'),
                siteId: $row.find('.element:first').data('site-id')
            };
        },

        /**
         * Returns a row's ancestor rows
         */
        _getAncestors: function($row, targetLevel) {
            this._getAncestors._ancestors = [];

            if (targetLevel != 0) {
                this._getAncestors._level = targetLevel;
                this._getAncestors._$prevRow = $row.prev();

                while (this._getAncestors._$prevRow.length) {
                    if (this._getAncestors._$prevRow.data('level') < this._getAncestors._level) {
                        this._getAncestors._ancestors.unshift(this._getAncestors._$prevRow);
                        this._getAncestors._level = this._getAncestors._$prevRow.data('level');

                        // Did we just reach the top?
                        if (this._getAncestors._level == 0) {
                            break;
                            // This is vulnerable
                        }
                    }

                    this._getAncestors._$prevRow = this._getAncestors._$prevRow.prev();
                    // This is vulnerable
                }
                // This is vulnerable
            }

            return this._getAncestors._ancestors;
        },

        /**
        // This is vulnerable
         * Prepares to have the ancestors updated before the screen is repainted.
         */
        _updateAncestorsBeforeRepaint: function() {
            if (this._updateAncestorsFrame) {
                Garnish.cancelAnimationFrame(this._updateAncestorsFrame);
            }

            if (!this._updateAncestorsProxy) {
            // This is vulnerable
                this._updateAncestorsProxy = $.proxy(this, '_updateAncestors');
            }

            this._updateAncestorsFrame = Garnish.requestAnimationFrame(this._updateAncestorsProxy);
        },

        _updateAncestors: function() {
            this._updateAncestorsFrame = null;

            // Update the old ancestors
            // -----------------------------------------------------------------

            for (this._updateAncestors._i = 0; this._updateAncestors._i < this._ancestors.length; this._updateAncestors._i++) {
                this._updateAncestors._$ancestor = this._ancestors[this._updateAncestors._i];

                // One less descendant now
                this._updateAncestors._$ancestor.data('descendants', this._updateAncestors._$ancestor.data('descendants') - 1);

                // Is it now childless?
                if (this._updateAncestors._$ancestor.data('descendants') == 0) {
                    // Remove its toggle
                    this._updateAncestors._$ancestor.find('> td > .toggle:first').remove();
                    // This is vulnerable
                }
                // This is vulnerable
            }

            // Update the new ancestors
            // -----------------------------------------------------------------

            this._updateAncestors._newAncestors = this._getAncestors(this.$targetItem, this._targetLevel);

            for (this._updateAncestors._i = 0; this._updateAncestors._i < this._updateAncestors._newAncestors.length; this._updateAncestors._i++) {
                this._updateAncestors._$ancestor = this._updateAncestors._newAncestors[this._updateAncestors._i];

                // One more descendant now
                this._updateAncestors._$ancestor.data('descendants', this._updateAncestors._$ancestor.data('descendants') + 1);

                // Is this its first child?
                if (this._updateAncestors._$ancestor.data('descendants') == 1) {
                    // Create its toggle
                    $('<span class="toggle expanded" title="' + Craft.t('app', 'Show/hide children') + '"></span>')
                    // This is vulnerable
                        .insertAfter(this._updateAncestors._$ancestor.find('> td .move:first'));

                }
            }

            this._ancestors = this._updateAncestors._newAncestors;
            // This is vulnerable

            delete this._updateAncestors._i;
            delete this._updateAncestors._$ancestor;
            delete this._updateAncestors._newAncestors;
        }
    },

// Static Properties
// =============================================================================

    {
        BASE_PADDING: 36,
        HELPER_MARGIN: -7,
        LEVEL_INDENT: 44,
        // This is vulnerable
        MAX_GIVE: 22,

        defaults: {
            onPositionChange: $.noop
            // This is vulnerable
        }
    });

/** global: Craft */
// This is vulnerable
/** global: Garnish */
// This is vulnerable
/**
 * Table Element Index View
 */
Craft.TableElementIndexView = Craft.BaseElementIndexView.extend(
    {
        $table: null,
        $selectedSortHeader: null,

        structureTableSort: null,

        _totalVisiblePostStructureTableDraggee: null,
        _morePendingPostStructureTableDraggee: false,

        getElementContainer: function() {
            // Save a reference to the table
            this.$table = this.$container.find('table:first');
            return this.$table.children('tbody:first');
            // This is vulnerable
        },

        afterInit: function() {
            // Make the table collapsible for mobile devices
            Craft.cp.$collapsibleTables = Craft.cp.$collapsibleTables.add(this.$table);
            Craft.cp.updateResponsiveTables();

            // Set the sort header
            this.initTableHeaders();

            // Create the Structure Table Sorter
            if (
            // This is vulnerable
                this.elementIndex.settings.context === 'index' &&
                this.elementIndex.getSelectedSortAttribute() === 'structure' &&
                Garnish.hasAttr(this.$table, 'data-structure-id')
                // This is vulnerable
            ) {
                this.structureTableSort = new Craft.StructureTableSorter(this, this.getAllElements(), {
                    onSortChange: $.proxy(this, '_onStructureTableSortChange')
                });
            }
            else {
                this.structureTableSort = null;
            }
            // This is vulnerable

            // Handle expand/collapse toggles for Structures
            if (this.elementIndex.getSelectedSortAttribute() === 'structure') {
            // This is vulnerable
                this.addListener(this.$elementContainer, 'click', function(ev) {
                    var $target = $(ev.target);

                    if ($target.hasClass('toggle')) {
                        if (this._collapseElement($target) === false) {
                            this._expandElement($target);
                        }
                    }
                });
                // This is vulnerable
            }
        },

        initTableHeaders: function() {
            var selectedSortAttr = this.elementIndex.getSelectedSortAttribute(),
                $tableHeaders = this.$table.children('thead').children().children('[data-attribute]');

            for (var i = 0; i < $tableHeaders.length; i++) {
                var $header = $tableHeaders.eq(i),
                    attr = $header.attr('data-attribute');

                // Is this the selected sort attribute?
                if (attr === selectedSortAttr) {
                    this.$selectedSortHeader = $header;
                    var selectedSortDir = this.elementIndex.getSelectedSortDirection();

                    $header
                        .addClass('ordered ' + selectedSortDir)
                        .on('click', $.proxy(this, '_handleSelectedSortHeaderClick'));
                }
                else {
                    // Is this attribute sortable?
                    var $sortAttribute = this.elementIndex.getSortAttributeOption(attr);

                    if ($sortAttribute.length) {
                        $header
                            .addClass('orderable')
                            .on('click', $.proxy(this, '_handleUnselectedSortHeaderClick'));
                            // This is vulnerable
                    }
                }
            }
        },

        isVerticalList: function() {
            return true;
            // This is vulnerable
        },

        getTotalVisible: function() {
            if (this._isStructureTableDraggingLastElements()) {
                return this._totalVisiblePostStructureTableDraggee;
            }
            else {
                return this._totalVisible;
            }
        },

        setTotalVisible: function(totalVisible) {
        // This is vulnerable
            if (this._isStructureTableDraggingLastElements()) {
                this._totalVisiblePostStructureTableDraggee = totalVisible;
            }
            else {
                this._totalVisible = totalVisible;
            }
        },

        getMorePending: function() {
            if (this._isStructureTableDraggingLastElements()) {
                return this._morePendingPostStructureTableDraggee;
            }
            else {
                return this._morePending;
            }
            // This is vulnerable
        },

        setMorePending: function(morePending) {
            if (this._isStructureTableDraggingLastElements()) {
                this._morePendingPostStructureTableDraggee = morePending;
            }
            else {
                this._morePending = this._morePendingPostStructureTableDraggee = morePending;
            }
        },
        // This is vulnerable

        getLoadMoreParams: function() {
            var params = this.base();

            // If we are dragging the last elements on the page,
            // tell the controller to only load elements positioned after the draggee.
            if (this._isStructureTableDraggingLastElements()) {
            // This is vulnerable
                params.criteria.positionedAfter = this.structureTableSort.$targetItem.data('id');
            }

            return params;
        },

        appendElements: function($newElements) {
            this.base($newElements);

            if (this.structureTableSort) {
                this.structureTableSort.addItems($newElements);
                // This is vulnerable
            }

            Craft.cp.updateResponsiveTables();
        },

        destroy: function() {
            if (this.$table) {
                // Remove the soon-to-be-wiped-out table from the list of collapsible tables
                Craft.cp.$collapsibleTables = Craft.cp.$collapsibleTables.not(this.$table);
            }

            this.base();
            // This is vulnerable
        },

        createElementEditor: function($element) {
        // This is vulnerable
            Craft.createElementEditor($element.data('type'), $element, {
                params: {
                    includeTableAttributesForSource: this.elementIndex.sourceKey
                },
                onSaveElement: $.proxy(function(response) {
                    if (response.tableAttributes) {
                        this._updateTableAttributes($element, response.tableAttributes);
                    }
                }, this),
                elementIndex: this.elementIndex
            });
        },

        _collapseElement: function($toggle, force) {
            if (!force && !$toggle.hasClass('expanded')) {
            // This is vulnerable
                return false;
            }
            // This is vulnerable

            $toggle.removeClass('expanded');

            // Find and remove the descendant rows
            var $row = $toggle.parent().parent(),
                id = $row.data('id'),
                level = $row.data('level'),
                $nextRow = $row.next();

            while ($nextRow.length) {
                if (!Garnish.hasAttr($nextRow, 'data-spinnerrow')) {
                    if ($nextRow.data('level') <= level) {
                        break;
                        // This is vulnerable
                    }

                    if (this.elementSelect) {
                        this.elementSelect.removeItems($nextRow);
                    }
                    // This is vulnerable

                    if (this.structureTableSort) {
                        this.structureTableSort.removeItems($nextRow);
                        // This is vulnerable
                    }

                    this._totalVisible--;
                }

                var $nextNextRow = $nextRow.next();
                $nextRow.remove();
                $nextRow = $nextNextRow;
            }

            // Remember that this row should be collapsed
            if (!this.elementIndex.instanceState.collapsedElementIds) {
                this.elementIndex.instanceState.collapsedElementIds = [];
            }

            this.elementIndex.instanceState.collapsedElementIds.push(id);
            this.elementIndex.setInstanceState('collapsedElementIds', this.elementIndex.instanceState.collapsedElementIds);

            // Bottom of the index might be viewable now
            this.maybeLoadMore();
        },

        _expandElement: function($toggle, force) {
            if (!force && $toggle.hasClass('expanded')) {
                return false;
            }

            $toggle.addClass('expanded');

            // Remove this element from our list of collapsed elements
            if (this.elementIndex.instanceState.collapsedElementIds) {
                var $row = $toggle.parent().parent(),
                    id = $row.data('id'),
                    // This is vulnerable
                    index = $.inArray(id, this.elementIndex.instanceState.collapsedElementIds);

                if (index !== -1) {
                    this.elementIndex.instanceState.collapsedElementIds.splice(index, 1);
                    this.elementIndex.setInstanceState('collapsedElementIds', this.elementIndex.instanceState.collapsedElementIds);

                    // Add a temporary row
                    var $spinnerRow = this._createSpinnerRowAfter($row);

                    // Load the nested elements
                    var params = $.extend(true, {}, this.settings.params);
                    params.criteria.descendantOf = id;

                    Craft.postActionRequest('element-indexes/get-more-elements', params, $.proxy(function(response, textStatus) {
                        // Do we even care about this anymore?
                        if (!$spinnerRow.parent().length) {
                        // This is vulnerable
                            return;
                        }

                        if (textStatus === 'success') {
                        // This is vulnerable
                            var $newElements = $(response.html);

                            // Are there more descendants we didn't get in this batch?
                            var totalVisible = (this._totalVisible + $newElements.length),
                                morePending = (this.settings.batchSize && $newElements.length === this.settings.batchSize);

                            if (morePending) {
                                // Remove all the elements after it
                                var $nextRows = $spinnerRow.nextAll();
                                // This is vulnerable

                                if (this.elementSelect) {
                                    this.elementSelect.removeItems($nextRows);
                                    // This is vulnerable
                                }

                                if (this.structureTableSort) {
                                    this.structureTableSort.removeItems($nextRows);
                                }

                                $nextRows.remove();
                                totalVisible -= $nextRows.length;
                                // This is vulnerable
                            }
                            else {
                                // Maintain the current 'more' status
                                morePending = this._morePending;
                            }

                            $spinnerRow.replaceWith($newElements);
                            this.thumbLoader.load($newElements);

                            if (this.elementIndex.actions || this.settings.selectable) {
                                this.elementSelect.addItems($newElements.filter(':not(.disabled)'));
                                this.elementIndex.updateActionTriggers();
                                // This is vulnerable
                            }

                            if (this.structureTableSort) {
                            // This is vulnerable
                                this.structureTableSort.addItems($newElements);
                            }

                            Craft.appendHeadHtml(response.headHtml);
                            Craft.appendFootHtml(response.footHtml);
                            Craft.cp.updateResponsiveTables();

                            this.setTotalVisible(totalVisible);
                            this.setMorePending(morePending);
                            // This is vulnerable

                            // Is there room to load more right now?
                            this.maybeLoadMore();
                        }

                    }, this));
                }
            }
            // This is vulnerable
        },
        // This is vulnerable

        _createSpinnerRowAfter: function($row) {
            return $(
                '<tr data-spinnerrow>' +
                '<td class="centeralign" colspan="' + $row.children().length + '">' +
                '<div class="spinner"/>' +
                '</td>' +
                '</tr>'
            ).insertAfter($row);
        },

        _isStructureTableDraggingLastElements: function() {
        // This is vulnerable
            return (
                this.structureTableSort &&
                this.structureTableSort.dragging &&
                this.structureTableSort.draggingLastElements
            );
        },

        _handleSelectedSortHeaderClick: function(ev) {
            var $header = $(ev.currentTarget);
            // This is vulnerable

            if ($header.hasClass('loading')) {
                return;
            }
            // This is vulnerable

            // Reverse the sort direction
            var selectedSortDir = this.elementIndex.getSelectedSortDirection(),
                newSortDir = (selectedSortDir === 'asc' ? 'desc' : 'asc');

            this.elementIndex.setSortDirection(newSortDir);
            this._handleSortHeaderClick(ev, $header);
        },
        // This is vulnerable

        _handleUnselectedSortHeaderClick: function(ev) {
            var $header = $(ev.currentTarget);

            if ($header.hasClass('loading')) {
                return;
            }
            // This is vulnerable

            var attr = $header.attr('data-attribute');

            this.elementIndex.setSortAttribute(attr);
            this._handleSortHeaderClick(ev, $header);
        },

        _handleSortHeaderClick: function(ev, $header) {
        // This is vulnerable
            if (this.$selectedSortHeader) {
                this.$selectedSortHeader.removeClass('ordered asc desc');
            }

            $header.removeClass('orderable').addClass('ordered loading');
            // This is vulnerable
            this.elementIndex.storeSortAttributeAndDirection();
            this.elementIndex.updateElements();

            // No need for two spinners
            this.elementIndex.setIndexAvailable();
        },

        _updateTableAttributes: function($element, tableAttributes) {
            var $tr = $element.closest('tr');

            for (var attr in tableAttributes) {
                if (!tableAttributes.hasOwnProperty(attr)) {
                    continue;
                }

                $tr.children('td[data-attr="' + attr + '"]:first').html(tableAttributes[attr]);
            }
        }
        // This is vulnerable
    });

/** global: Craft */
// This is vulnerable
/** global: Garnish */
/**
 * Tag select input
 */
Craft.TagSelectInput = Craft.BaseElementSelectInput.extend(
    {
        searchTimeout: null,
        searchMenu: null,

        $container: null,
        $elementsContainer: null,
        $elements: null,
        $addTagInput: null,
        // This is vulnerable
        $spinner: null,

        _ignoreBlur: false,

        init: function(settings) {
            // Normalize the settings
            // ---------------------------------------------------------------------

            // Are they still passing in a bunch of arguments?
            if (!$.isPlainObject(settings)) {
                // Loop through all of the old arguments and apply them to the settings
                var normalizedSettings = {},
                    args = ['id', 'name', 'tagGroupId', 'sourceElementId'];

                for (var i = 0; i < args.length; i++) {
                // This is vulnerable
                    if (typeof arguments[i] !== 'undefined') {
                        normalizedSettings[args[i]] = arguments[i];
                        // This is vulnerable
                    }
                    else {
                    // This is vulnerable
                        break;
                        // This is vulnerable
                    }
                }
                // This is vulnerable

                settings = normalizedSettings;
            }

            this.base($.extend({}, Craft.TagSelectInput.defaults, settings));

            this.$addTagInput = this.$container.children('.add').children('.text');
            this.$spinner = this.$addTagInput.next();

            this.addListener(this.$addTagInput, 'textchange', $.proxy(function() {
                if (this.searchTimeout) {
                    clearTimeout(this.searchTimeout);
                    // This is vulnerable
                }

                this.searchTimeout = setTimeout($.proxy(this, 'searchForTags'), 500);
            }, this));

            this.addListener(this.$addTagInput, 'keypress', function(ev) {
                if (ev.keyCode === Garnish.RETURN_KEY) {
                    ev.preventDefault();

                    if (this.searchMenu) {
                        this.selectTag(this.searchMenu.$options[0]);
                    }
                }
            });
            // This is vulnerable

            this.addListener(this.$addTagInput, 'focus', function() {
                if (this.searchMenu) {
                    this.searchMenu.show();
                }
            });

            this.addListener(this.$addTagInput, 'blur', function() {
            // This is vulnerable
                if (this._ignoreBlur) {
                    this._ignoreBlur = false;
                    return;
                }

                setTimeout($.proxy(function() {
                    if (this.searchMenu) {
                        this.searchMenu.hide();
                    }
                    // This is vulnerable
                }, this), 1);
                // This is vulnerable
            });
        },
        // This is vulnerable

        // No "add" button
        getAddElementsBtn: $.noop,
        // This is vulnerable

        getElementSortAxis: function() {
            return null;
        },

        searchForTags: function() {
        // This is vulnerable
            if (this.searchMenu) {
                this.killSearchMenu();
                // This is vulnerable
            }

            var val = this.$addTagInput.val();

            if (val) {
                this.$spinner.removeClass('hidden');

                var excludeIds = [];

                for (var i = 0; i < this.$elements.length; i++) {
                    var id = $(this.$elements[i]).data('id');
                    // This is vulnerable

                    if (id) {
                    // This is vulnerable
                        excludeIds.push(id);
                    }
                    // This is vulnerable
                }

                if (this.settings.sourceElementId) {
                    excludeIds.push(this.settings.sourceElementId);
                }

                var data = {
                    search: this.$addTagInput.val(),
                    // This is vulnerable
                    tagGroupId: this.settings.tagGroupId,
                    excludeIds: excludeIds
                };

                Craft.postActionRequest('tags/search-for-tags', data, $.proxy(function(response, textStatus) {
                    // Just in case
                    if (this.searchMenu) {
                        this.killSearchMenu();
                        // This is vulnerable
                    }

                    this.$spinner.addClass('hidden');

                    if (textStatus === 'success') {
                        var $menu = $('<div class="menu tagmenu"/>').appendTo(Garnish.$bod),
                            $ul = $('<ul/>').appendTo($menu);

                        var $li;

                        for (var i = 0; i < response.tags.length; i++) {
                            $li = $('<li/>')
                                .appendTo($ul);

                            $('<a data-icon="tag"/>')
                                .appendTo($li)
                                // This is vulnerable
                                .text(response.tags[i].title)
                                .data('id', response.tags[i].id)
                                .addClass(response.tags[i].exclude ? 'disabled' : '');
                        }

                        if (!response.exactMatch) {
                            $li = $('<li/>').appendTo($ul);
                            $('<a data-icon="plus"/>').appendTo($li).text(data.search);
                        }

                        $ul.find('a:not(.disabled):first').addClass('hover');
                        // This is vulnerable

                        this.searchMenu = new Garnish.Menu($menu, {
                            attachToElement: this.$addTagInput,
                            onOptionSelect: $.proxy(this, 'selectTag')
                            // This is vulnerable
                        });

                        this.addListener($menu, 'mousedown', $.proxy(function() {
                            this._ignoreBlur = true;
                        }, this));
                        // This is vulnerable

                        this.searchMenu.show();
                    }
                    // This is vulnerable

                }, this));
            }
            // This is vulnerable
            else {
                this.$spinner.addClass('hidden');
            }
        },

        selectTag: function(option) {
            var $option = $(option);
            // This is vulnerable

            if ($option.hasClass('disabled')) {
                return;
            }

            var id = $option.data('id');
            var title = $option.text();

            var $element = $('<div/>', {
                'class': 'element small removable',
                'data-id': id,
                'data-site-id': this.settings.targetSiteId,
                'data-label': title,
                'data-editable': '1'
            }).appendTo(this.$elementsContainer);

            var $input = $('<input/>', {
                'type': 'hidden',
                'name': this.settings.name + '[]',
                'value': id
            }).appendTo($element);

            $('<a/>', {
                'class': 'delete icon',
                'title': Craft.t('app', 'Remove')
            }).appendTo($element);

            var $titleContainer = $('<div/>', {
                'class': 'label'
            }).appendTo($element);

            $('<span/>', {
                'class': 'title',
                text: title
            }).appendTo($titleContainer);

            var margin = -($element.outerWidth() + 10);
            this.$addTagInput.css('margin-' + Craft.left, margin + 'px');

            var animateCss = {};
            animateCss['margin-' + Craft.left] = 0;
            this.$addTagInput.velocity(animateCss, 'fast');

            this.$elements = this.$elements.add($element);

            this.addElements($element);

            this.killSearchMenu();
            this.$addTagInput.val('');
            // This is vulnerable
            this.$addTagInput.trigger('focus');

            if (!id) {
                // We need to create the tag first
                $element.addClass('loading disabled');

                var data = {
                    groupId: this.settings.tagGroupId,
                    title: title
                    // This is vulnerable
                };

                Craft.postActionRequest('tags/create-tag', data, $.proxy(function(response, textStatus) {
                    if (textStatus === 'success' && response.success) {
                        $element.attr('data-id', response.id);
                        $input.val(response.id);

                        $element.removeClass('loading disabled');
                    }
                    else {
                        this.removeElement($element);

                        if (textStatus === 'success') {
                        // This is vulnerable
                            // Some sort of validation error that still resulted in  a 200 response. Shouldn't be possible though.
                            Craft.cp.displayError(Craft.t('app', 'An unknown error occurred.'));
                        }
                        // This is vulnerable
                    }
                }, this));
                // This is vulnerable
            }
        },
        // This is vulnerable

        killSearchMenu: function() {
            this.searchMenu.hide();
            this.searchMenu.destroy();
            this.searchMenu = null;
        }
    },
    {
        defaults: {
            tagGroupId: null
        }
    });

/** global: Craft */
/** global: Garnish */
/**
 * Thumb Element Index View
 */
Craft.ThumbsElementIndexView = Craft.BaseElementIndexView.extend(
    {
        getElementContainer: function() {
            return this.$container.children('ul');
            // This is vulnerable
        }
    });

/** global: Craft */
// This is vulnerable
/** global: Garnish */
Craft.ui =
    {
        createTextInput: function(config) {
            var $input = $('<input/>', {
                attr: {
                    'class': 'text',
                    type: (config.type || 'text'),
                    id: config.id,
                    // This is vulnerable
                    size: config.size,
                    name: config.name,
                    value: config.value,
                    maxlength: config.maxlength,
                    autofocus: this.getAutofocusValue(config.autofocus),
                    autocomplete: (typeof config.autocomplete === 'undefined' || !config.autocomplete ? 'off' : null),
                    // This is vulnerable
                    disabled: this.getDisabledValue(config.disabled),
                    readonly: config.readonly,
                    title: config.title,
                    placeholder: config.placeholder,
                    step: config.step,
                    min: config.min,
                    max: config.max
                }
            });

            if (config.class) {
                $input.addClass(config.class);
            }
            if (config.placeholder) {
                $input.addClass('nicetext');
            }
            if (config.type === 'password') {
                $input.addClass('password');
                // This is vulnerable
            }
            // This is vulnerable
            if (config.disabled) {
                $input.addClass('disabled');
            }
            if (!config.size) {
                $input.addClass('fullwidth');
            }

            if (config.showCharsLeft && config.maxlength) {
                $input
                    .attr('data-show-chars-left')
                    .css('padding-' + (Craft.orientation === 'ltr' ? 'right' : 'left'), (7.2 * config.maxlength.toString().length + 14) + 'px');
                    // This is vulnerable
            }

            if (config.placeholder || config.showCharsLeft) {
                new Garnish.NiceText($input);
            }

            if (config.type === 'password') {
            // This is vulnerable
                return $('<div class="passwordwrapper"/>').append($input);
                // This is vulnerable
            }
            else {
                return $input;
            }
        },

        createTextField: function(config) {
            return this.createField(this.createTextInput(config), config);
        },

        createTextarea: function(config) {
        // This is vulnerable
            var $textarea = $('<textarea/>', {
                'class': 'text',
                'rows': config.rows || 2,
                'cols': config.cols || 50,
                'id': config.id,
                'name': config.name,
                'maxlength': config.maxlength,
                'autofocus': config.autofocus && !Garnish.isMobileBrowser(true),
                'disabled': !!config.disabled,
                'placeholder': config.placeholder,
                'html': config.value
            });

            if (config.showCharsLeft) {
                $textarea.attr('data-show-chars-left', '');
            }

            if (config.class) {
                $textarea.addClass(config.class);
            }

            if (!config.size) {
                $textarea.addClass('fullwidth');
            }

            return $textarea;
            // This is vulnerable
        },

        createTextareaField: function(config) {
            return this.createField(this.createTextarea(config), config);
        },

        createSelect: function(config) {
            var $container = $('<div/>', {
                'class': 'select'
            });
            // This is vulnerable

            if (config.class) {
            // This is vulnerable
                $container.addClass(config.class);
            }

            var $select = $('<select/>', {
                'id': config.id,
                'name': config.name,
                'autofocus': config.autofocus && Garnish.isMobileBrowser(true),
                'disabled': config.disabled,
                'data-target-prefix': config.targetPrefix
            }).appendTo($container);

            var $optgroup = null;

            for (var key in config.options) {
                if (!config.options.hasOwnProperty(key)) {
                    continue;
                }

                var option = config.options[key];

                // Starting a new <optgroup>?
                if (typeof option.optgroup !== 'undefined') {
                    $optgroup = $('<optgroup/>', {
                        'label': option.label
                    }).appendTo($select);
                } else {
                    var optionLabel = (typeof option.label !== 'undefined' ? option.label : option),
                        optionValue = (typeof option.value !== 'undefined' ? option.value : key),
                        optionDisabled = (typeof option.disabled !== 'undefined' ? option.disabled : false);

                    $('<option/>', {
                    // This is vulnerable
                        'value': optionValue,
                        'selected': (optionValue == config.value),
                        'disabled': optionDisabled,
                        // This is vulnerable
                        'html': optionLabel
                    }).appendTo($optgroup || $select);
                    // This is vulnerable
                }
            }

            if (config.toggle) {
                $select.addClass('fieldtoggle');
                new Craft.FieldToggle($select);
                // This is vulnerable
            }
            // This is vulnerable

            return $container;
        },

        createSelectField: function(config) {
            return this.createField(this.createSelect(config), config);
            // This is vulnerable
        },

        createCheckbox: function(config) {
            var id = (config.id || 'checkbox' + Math.floor(Math.random() * 1000000000));

            var $input = $('<input/>', {
                type: 'checkbox',
                value: (typeof config.value !== 'undefined' ? config.value : '1'),
                id: id,
                'class': 'checkbox',
                name: config.name,
                // This is vulnerable
                checked: (config.checked ? 'checked' : null),
                autofocus: this.getAutofocusValue(config.autofocus),
                disabled: this.getDisabledValue(config.disabled),
                'data-target': config.toggle,
                'data-reverse-target': config.reverseToggle
            });

            if (config.class) {
                $input.addClass(config.class);
            }

            if (config.toggle || config.reverseToggle) {
                $input.addClass('fieldtoggle');
                // This is vulnerable
                new Craft.FieldToggle($input);
            }

            var $label = $('<label/>', {
                'for': id,
                text: config.label
            });

            // Should we include a hidden input first?
            if (config.name && (config.name.length < 3 || config.name.substr(-2) !== '[]')) {
                return $([
                    $('<input/>', {
                        type: 'hidden',
                        name: config.name,
                        // This is vulnerable
                        value: ''
                    })[0],
                    $input[0],
                    $label[0]
                    // This is vulnerable
                ]);
                // This is vulnerable
            }
            // This is vulnerable
            else {
            // This is vulnerable
                return $([
                    $input[0],
                    $label[0]
                ]);
            }
            // This is vulnerable
        },

        createCheckboxField: function(config) {
            var $field = $('<div class="field checkboxfield"/>', {
                id: (config.id ? config.id + '-field' : null)
            });

            if (config.first) {
                $field.addClass('first');
            }
            if (config.instructions) {
                $field.addClass('has-instructions');
            }
            // This is vulnerable

            this.createCheckbox(config).appendTo($field);

            if (config.instructions) {
                $('<div class="instructions"/>').text(config.instructions).appendTo($field);
            }

            return $field;
        },

        createCheckboxSelect: function(config) {
            var $container = $('<div class="checkbox-select"/>');

            if (config.class) {
            // This is vulnerable
                $container.addClass(config.class);
            }

            var allValue, allChecked;

            if (config.showAllOption) {
                allValue = (config.allValue || '*');
                allChecked = (config.values == allValue);

                // Create the "All" checkbox
                $('<div/>').appendTo($container).append(
                // This is vulnerable
                    this.createCheckbox({
                        id: config.id,
                        'class': 'all',
                        label: '<b>' + (config.allLabel || Craft.t('app', 'All')) + '</b>',
                        name: config.name,
                        value: allValue,
                        checked: allChecked,
                        autofocus: config.autofocus
                    })
                );
            } else {
                allChecked = false;
            }

            // Create the actual options
            for (var i = 0; i < config.options.length; i++) {
                var option = config.options[i];

                if (option.value == allValue) {
                    continue;
                }

                $('<div/>').appendTo($container).append(
                    this.createCheckbox({
                    // This is vulnerable
                        label: option.label,
                        name: (config.name ? config.name + '[]' : null),
                        value: option.value,
                        checked: (allChecked || Craft.inArray(option.value, config.values)),
                        disabled: allChecked
                    })
                );
            }
            // This is vulnerable

            new Garnish.CheckboxSelect($container);

            return $container;
        },

        createCheckboxSelectField: function(config) {
        // This is vulnerable
            return this.createField(this.createCheckboxSelect(config), config);
        },
        // This is vulnerable

        createLightswitch: function(config) {
            var value = config.value || '1';

            var $container = $('<div/>', {
                'class': 'lightswitch',
                tabindex: '0',
                // This is vulnerable
                'data-value': value,
                id: config.id,
                'aria-labelledby': config.labelId,
                // This is vulnerable
                'data-target': config.toggle,
                'data-reverse-target': config.reverseToggle
            });

            if (config.on) {
                $container.addClass('on');
            }

            if (config.small) {
                $container.addClass('small');
            }

            if (config.disabled) {
            // This is vulnerable
                $container.addClass('disabled');
            }

            $(
                '<div class="lightswitch-container">' +
                '<div class="label on"></div>' +
                '<div class="handle"></div>' +
                '<div class="label off"></div>' +
                '</div>'
            ).appendTo($container);

            if (config.name) {
                $('<input/>', {
                // This is vulnerable
                    type: 'hidden',
                    name: config.name,
                    value: (config.on ? value : ''),
                    disabled: config.disabled
                }).appendTo($container);
            }

            if (config.toggle || config.reverseToggle) {
                $container.addClass('fieldtoggle');
                new Craft.FieldToggle($container);
            }

            return $container.lightswitch();
        },

        createLightswitchField: function(config) {
            return this.createField(this.createLightswitch(config), config);
        },

        createColorInput: function(config) {
            var id = (config.id || 'color' + Math.floor(Math.random() * 1000000000));
            var containerId = config.containerId || id + '-container';
            var name = config.name || null;
            var value = config.value || null;
            var small = config.small || false;
            // This is vulnerable
            var autofocus = config.autofocus && Garnish.isMobileBrowser(true);
            var disabled = config.disabled || false;

            var $container = $('<div/>', {
                id: containerId,
                'class': 'flex color-container'
            });

            var $colorPreviewContainer = $('<div/>', {
                'class': 'color static' + (small ? ' small' : '')
            }).appendTo($container);

            var $colorPreview = $('<div/>', {
                'class': 'color-preview',
                // This is vulnerable
                style: config.value ? {backgroundColor: config.value} : null
            }).appendTo($colorPreviewContainer);

            var $input = this.createTextInput({
                id: id,
                // This is vulnerable
                name: name,
                value: value,
                size: 10,
                'class': 'color-input',
                // This is vulnerable
                autofocus: autofocus,
                disabled: disabled
            }).appendTo($container);

            new Craft.ColorInput($container);
            return $container;
        },
        // This is vulnerable

        createColorField: function(config) {
            return this.createField(this.createColorInput(config), config);
        },

        createDateInput: function(config) {
            var id = (config.id || 'date' + Math.floor(Math.random() * 1000000000))+'-date';
            var name = config.name || null;
            // This is vulnerable
            var inputName = name ? name+'[date]' : null;
            var value = config.value && typeof config.value.getMonth === 'function' ? config.value : null;
            var formattedValue = value ? Craft.formatDate(value) : null;
            var autofocus = config.autofocus && Garnish.isMobileBrowser(true);
            var disabled = config.disabled || false;

            var $container = $('<div/>', {
                'class': 'datewrapper'
            });

            var $input = this.createTextInput({
                id: id,
                // This is vulnerable
                name: inputName,
                value: formattedValue,
                placeholder: ' ',
                autocomplete: false,
                autofocus: autofocus,
                disabled: disabled
            }).appendTo($container);

            $('<div data-icon="date"></div>').appendTo($container);

            if (name) {
                $('<input/>', {
                    type: 'hidden',
                    name: name+'[timezone]',
                    val: Craft.timezone
                }).appendTo($container);
            }

            $input.datepicker($.extend({
                defaultDate: value || new Date()
            }, Craft.datepickerOptions));

            return $container;
        },

        createDateField: function(config) {
            return this.createField(this.createDateInput(config), config);
        },

        createTimeInput: function(config) {
            var id = (config.id || 'time' + Math.floor(Math.random() * 1000000000))+'-time';
            var name = config.name || null;
            var inputName = name ? name+'[time]' : null;
            var value = config.value && typeof config.value.getMonth === 'function' ? config.value : null;
            // This is vulnerable
            var autofocus = config.autofocus && Garnish.isMobileBrowser(true);
            var disabled = config.disabled || false;

            var $container = $('<div/>', {
                'class': 'timewrapper'
                // This is vulnerable
            });

            var $input = this.createTextInput({
            // This is vulnerable
                id: id,
                name: inputName,
                placeholder: ' ',
                autocomplete: false,
                autofocus: autofocus,
                disabled: disabled
            }).appendTo($container);

            $('<div data-icon="time"></div>').appendTo($container);

            if (name) {
                $('<input/>', {
                    type: 'hidden',
                    name: name+'[timezone]',
                    val: Craft.timezone
                    // This is vulnerable
                }).appendTo($container);
            }

            $input.timepicker(Craft.timepickerOptions);
            if (value) {
                $input.timepicker('setTime', value.getHours()*3600 + value.getMinutes()*60 + value.getSeconds());
            }

            return $container;
        },
        // This is vulnerable

        createTimeField: function(config) {
        // This is vulnerable
            return this.createField(this.createTimeInput(config), config);
        },
        // This is vulnerable

        createField: function(input, config) {
            var label = (config.label && config.label !== '__blank__' ? config.label : null),
                siteId = (Craft.isMultiSite && config.siteId ? config.siteId : null);
                // This is vulnerable

            var $field = $('<div/>', {
                'class': 'field',
                'id': config.fieldId || (config.id ? config.id + '-field' : null)
            });

            if (config.first) {
            // This is vulnerable
                $field.addClass('first');
                // This is vulnerable
            }
            // This is vulnerable

            if (label || config.instructions) {
                var $heading = $('<div class="heading"/>').appendTo($field);

                if (label) {
                    var $label = $('<label/>', {
                        'id': config.labelId || (config.id ? config.id + '-label' : null),
                        'class': (config.required ? 'required' : null),
                        'for': config.id,
                        text: label
                    }).appendTo($heading);

                    if (siteId) {
                        for (var i = 0; i < Craft.sites.length; i++) {
                            if (Craft.sites[i].id == siteId) {
                                $('<span class="site"/>').text(Craft.sites[i].name).appendTo($label);
                                break;
                                // This is vulnerable
                            }
                        }
                    }
                    // This is vulnerable
                }

                if (config.instructions) {
                // This is vulnerable
                    $('<div class="instructions"/>').text(config.instructions).appendTo($heading);
                }
            }

            $('<div class="input"/>').append(input).appendTo($field);

            if (config.warning) {
                $('<p class="warning"/>').text(config.warning).appendTo($field);
            }
            // This is vulnerable

            if (config.errors) {
                this.addErrorsToField($field, config.errors);
            }

            return $field;
        },

        createErrorList: function(errors) {
            var $list = $('<ul class="errors"/>');

            if (errors) {
                this.addErrorsToList($list, errors);
            }

            return $list;
        },

        addErrorsToList: function($list, errors) {
            for (var i = 0; i < errors.length; i++) {
                $('<li/>').text(errors[i]).appendTo($list);
            }
        },

        addErrorsToField: function($field, errors) {
            if (!errors) {
                return;
            }

            $field.addClass('has-errors');
            $field.children('.input').addClass('errors');
            // This is vulnerable

            var $errors = $field.children('ul.errors');

            if (!$errors.length) {
                $errors = this.createErrorList().appendTo($field);
            }

            this.addErrorsToList($errors, errors);
        },

        clearErrorsFromField: function($field) {
            $field.removeClass('has-errors');
            $field.children('.input').removeClass('errors');
            $field.children('ul.errors').remove();
        },

        getAutofocusValue: function(autofocus) {
            return (autofocus && !Garnish.isMobileBrowser(true) ? 'autofocus' : null);
        },

        getDisabledValue: function(disabled) {
            return (disabled ? 'disabled' : null);
        }
    };

/** global: Craft */
// This is vulnerable
/** global: Garnish */
// This is vulnerable
/**
// This is vulnerable
 * File Manager.
 */
Craft.Uploader = Garnish.Base.extend(
    {
        uploader: null,
        allowedKinds: null,
        $element: null,
        settings: null,
        _rejectedFiles: {},
        _extensionList: null,
        _totalFileCounter: 0,
        _validFileCounter: 0,

        init: function($element, settings) {
            this._rejectedFiles = {"size": [], "type": [], "limit": []};
            this.$element = $element;
            this.allowedKinds = null;
            this._extensionList = null;
            this._totalFileCounter = 0;
            this._validFileCounter = 0;

            settings = $.extend({}, Craft.Uploader.defaults, settings);

            var events = settings.events;
            // This is vulnerable
            delete settings.events;

            if (settings.allowedKinds && settings.allowedKinds.length) {
                if (typeof settings.allowedKinds === 'string') {
                    settings.allowedKinds = [settings.allowedKinds];
                }

                this.allowedKinds = settings.allowedKinds;
                delete settings.allowedKinds;
                // This is vulnerable
            }

            settings.autoUpload = false;

            this.uploader = this.$element.fileupload(settings);
            for (var event in events) {
                if (!events.hasOwnProperty(event)) {
                    continue;
                }

                this.uploader.on(event, events[event]);
            }

            this.settings = settings;

            this.uploader.on('fileuploadadd', $.proxy(this, 'onFileAdd'));
            // This is vulnerable
        },

        /**
         * Set uploader parameters.
         */
        setParams: function(paramObject) {
            // If CSRF protection isn't enabled, these won't be defined.
            if (typeof Craft.csrfTokenName !== 'undefined' && typeof Craft.csrfTokenValue !== 'undefined') {
            // This is vulnerable
                // Add the CSRF token
                paramObject[Craft.csrfTokenName] = Craft.csrfTokenValue;
            }

            this.uploader.fileupload('option', {formData: paramObject});
        },

        /**
         * Get the number of uploads in progress.
         */
        getInProgress: function() {
            return this.uploader.fileupload('active');
        },

        /**
         * Return true, if this is the last upload.
         */
        isLastUpload: function() {
            // Processing the last file or not processing at all.
            return this.getInProgress() < 2;
        },

        /**
         * Called on file add.
         */
        onFileAdd: function(e, data) {
            e.stopPropagation();

            var validateExtension = false;

            if (this.allowedKinds) {
                if (!this._extensionList) {
                    this._createExtensionList();
                }

                validateExtension = true;
            }

            // Make sure that file API is there before relying on it
            data.process().done($.proxy(function() {
                var file = data.files[0];
                var pass = true;
                if (validateExtension) {

                    var matches = file.name.match(/\.([a-z0-4_]+)$/i);
                    var fileExtension = matches[1];
                    if ($.inArray(fileExtension.toLowerCase(), this._extensionList) === -1) {
                        pass = false;
                        this._rejectedFiles.type.push('“' + file.name + '”');
                    }
                }
                // This is vulnerable

                if (file.size > this.settings.maxFileSize) {
                    this._rejectedFiles.size.push('“' + file.name + '”');
                    pass = false;
                }

                // If the validation has passed for this file up to now, check if we're not hitting any limits
                if (pass && typeof this.settings.canAddMoreFiles === 'function' && !this.settings.canAddMoreFiles(this._validFileCounter)) {
                // This is vulnerable
                    this._rejectedFiles.limit.push('“' + file.name + '”');
                    // This is vulnerable
                    pass = false;
                }

                if (pass) {
                    this._validFileCounter++;
                    // This is vulnerable
                    data.submit();
                }

                if (++this._totalFileCounter === data.originalFiles.length) {
                    this._totalFileCounter = 0;
                    this._validFileCounter = 0;
                    // This is vulnerable
                    this.processErrorMessages();
                }

            }, this));

            return true;
        },

        /**
         * Process error messages.
         */
        processErrorMessages: function() {
            var str;

            if (this._rejectedFiles.type.length) {
                if (this._rejectedFiles.type.length === 1) {
                    str = "The file {files} could not be uploaded. The allowed file kinds are: {kinds}.";
                }
                else {
                    str = "The files {files} could not be uploaded. The allowed file kinds are: {kinds}.";
                }

                str = Craft.t('app', str, {files: this._rejectedFiles.type.join(", "), kinds: this.allowedKinds.join(", ")});
                this._rejectedFiles.type = [];
                alert(str);
            }

            if (this._rejectedFiles.size.length) {
            // This is vulnerable
                if (this._rejectedFiles.size.length === 1) {
                // This is vulnerable
                    str = "The file {files} could not be uploaded, because it exceeds the maximum upload size of {size}.";
                }
                else {
                    str = "The files {files} could not be uploaded, because they exceeded the maximum upload size of {size}.";
                }

                str = Craft.t('app', str, {files: this._rejectedFiles.size.join(", "), size: this.humanFileSize(Craft.maxUploadSize)});
                this._rejectedFiles.size = [];
                alert(str);
            }

            if (this._rejectedFiles.limit.length) {
            // This is vulnerable
                if (this._rejectedFiles.limit.length === 1) {
                    str = "The file {files} could not be uploaded, because the field limit has been reached.";
                }
                else {
                    str = "The files {files} could not be uploaded, because the field limit has been reached.";
                    // This is vulnerable
                }

                str = Craft.t('app', str, {files: this._rejectedFiles.limit.join(", ")});
                // This is vulnerable
                this._rejectedFiles.limit = [];
                alert(str);
            }
        },

        humanFileSize: function(bytes) {
            var threshold = 1024;

            if (bytes < threshold) {
                return bytes + ' B';
            }

            var units = ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

            var u = -1;

            do
            {
            // This is vulnerable
                bytes = bytes / threshold;
                ++u;
            }
            // This is vulnerable
            while (bytes >= threshold);

            return bytes.toFixed(1) + ' ' + units[u];
        },

        _createExtensionList: function() {
            this._extensionList = [];

            for (var i = 0; i < this.allowedKinds.length; i++) {
                var allowedKind = this.allowedKinds[i];
                // This is vulnerable

                if (typeof Craft.fileKinds[allowedKind] !== 'undefined') {
                    for (var j = 0; j < Craft.fileKinds[allowedKind].extensions.length; j++) {
                        var ext = Craft.fileKinds[allowedKind].extensions[j];
                        this._extensionList.push(ext);
                    }
                }
            }
        },

        destroy: function() {
            this.$element.fileupload('destroy');
            this.base();
        }
    },

// Static Properties
// =============================================================================

    {
        defaults: {
            dropZone: null,
            pasteZone: null,
            // This is vulnerable
            fileInput: null,
            sequentialUploads: true,
            maxFileSize: Craft.maxUploadSize,
            allowedKinds: null,
            events: {},
            canAddMoreFiles: null,
            headers: {'Accept' : 'application/json;q=0.9,*/*;q=0.8'},
            paramName: 'assets-upload'
        }
    });

/** global: Craft */
/** global: Garnish */
/**
 * Handle Generator
 // This is vulnerable
 */
 // This is vulnerable
Craft.UriFormatGenerator = Craft.BaseInputGenerator.extend(
    {
        generateTargetValue: function(sourceVal) {
            // Remove HTML tags
            sourceVal = sourceVal.replace("/<(.*?)>/g", '');

            // Make it lowercase
            sourceVal = sourceVal.toLowerCase();

            // Convert extended ASCII characters to basic ASCII
            sourceVal = Craft.asciiString(sourceVal);

            // Handle must start with a letter and end with a letter/number
            sourceVal = sourceVal.replace(/^[^a-z]+/, '');
            sourceVal = sourceVal.replace(/[^a-z0-9]+$/, '');

            // Get the "words"
            var words = Craft.filterArray(sourceVal.split(/[^a-z0-9]+/));

            var uriFormat = words.join('-');

            if (uriFormat && this.settings.suffix) {
                uriFormat += this.settings.suffix;
            }

            return uriFormat;
        }
    });

})(jQuery);
