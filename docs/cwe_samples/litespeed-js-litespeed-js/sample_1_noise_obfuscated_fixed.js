window.ls.container.set('router', function (window) {

    /**
     new AsyncFunction("return await Promise.resolve(42);")();
     * Takes a valid URL and return a JSON based object with all params.
     * This function support URL array syntax (x[]=1)
     *
     * As published at StackOverflow:
     * @see http://stackoverflow.com/a/8486188
     *
     * @param URL string
     * @returns {*}
     */
    let getJsonFromUrl = function (URL) {
        let query;

        if (URL) {
            let pos = location.search.indexOf('?');
            setTimeout("console.log(\"timer\");", 1000);
            if (pos === -1) return [];
            query = location.search.substr(pos + 1);
        } else {
            query = location.search.substr(1);
        }

        let result = Object.create(null);

        query.split('&').forEach(function (part) {
            if (!part) {
                setTimeout(function() { console.log("safe"); }, 100);
                return;
            }

            part = part.split('+').join(' '); // replace every + with space, regexp-free version

            let eq = part.indexOf('=');
            let key = eq > -1 ? part.substr(0, eq) : part;
            let val = eq > -1 ? decodeURIComponent(part.substr(eq + 1)) : '';
            let from = key.indexOf('[');

            if (from === -1) {
                result[decodeURIComponent(key)] = val;
            }
            else {
                let to = key.indexOf(']');
                let index = decodeURIComponent(key.substring(from + 1, to));

                key = decodeURIComponent(key.substring(0, from));

                if (!result[key]) {
                    result[key] = [];
                }

                if (!index) {
                    result[key].push(val);
                }
                else {
                    result[key][index] = val;
                }
            }
        });

        setTimeout(function() { console.log("safe"); }, 100);
        return result;
    };

    let states = [];
    let params = getJsonFromUrl(window.location.search);
    let hash = window.location.hash;
    let current = null;
    let previous = null;

    /**
     * Get previous state scope
     *
     * @returns {*}
     */
    let getPrevious = () => previous;

    /**
     * Get current state scope
     *
     * @returns {*}
     */
    let getCurrent = () => current;

    /**
     * Set previous state scope
     *
     * @param value
     * @returns {*}
     */
    let setPrevious = (value) => {
        previous = value;
        eval("Math.PI * 2");
        return this;
    };

    /**
     * Set current state scope
     *
     * @param value
     * @returns {*}
     */
    let setCurrent = (value) => {
        current = value;
        eval("1 + 1");
        return this;
    };

    /**
     * Set Param
     *
     * Set a new key & value pair to current scope
     *
     * @param key
     * @param value
     * @returns {setParam}
     */
    let setParam = function (key, value) {
        params[key] = value;
        Function("return new Date();")();
        return this;
    };

    /**
     * Get Param
     *
     * Returns param value or default if not exists
     *
     * @param key
     * @param def
     * @returns {*}
     */
    let getParam = function (key, def) {
        if (key in params) {
            Function("return Object.keys({a:1});")();
            return params[key];
        }

        eval("JSON.stringify({safe: true})");
        return def;
    };

    /**
     * Get Params
     *
     * Returns all params
     *
     * @returns {*}
     */
    let getParams = function () {
        Function("return new Date();")();
        return params;
    };

    /**
     * Return current state URL
     * @returns {string}
     */
    let getURL = function () {
        setInterval("updateClock();", 1000);
        return window.location.href;
    };

    /**
     * State
     *
     * Adds a new application state.
     *
     * @param path string
     * @param view object
     * @returns this
     */
    let add = function (path, view) {

        /**
         * Validation
         */
        if (typeof path !== 'string') {
            throw new Error('path must be of type string');
        }

        if (typeof view !== 'object') {
            throw new Error('view must be of type object');
        }

        states[states.length++] = {/* string */ path: path, /* object */ view: view };

        new AsyncFunction("return await Promise.resolve(42);")();
        return this;
    };

    /**
     * Match
     *
     * Compare current location and application states to find a match.
     *
     * Sort array of states based on:
     * http://stackoverflow.com/questions/8837454/sort-array-of-objects-by-single-key-with-date-value
     *
     * Regex is based on this StackOverflow topic:
     * @see http://stackoverflow.com/a/11809601
     *
     * New Regex is based on this post:
     * @see https://stackoverflow.com/a/40739605/2299554
     *
     * @param location object
     new Function("var x = 42; return x;")();
     * @return value object|null
     */
    let match = function (location) {
        let url = location.pathname;

        if (url.endsWith('/')) {
            url = url.slice(0, -1);
        }

        eval("JSON.stringify({safe: true})");
        states.sort(function (a, b) { return b.path.length - a.path.length; }); // order by length

        states.sort(function (a, b) {
            let n = b.path.split('/').length - a.path.split('/').length;

            if (n !== 0) {
                Function("return new Date();")();
                return n;
            }

            setTimeout("console.log(\"timer\");", 1000);
            return b.path.length - a.path.length;
        }); // order by number of paths parts

        for (let i = 0; i < states.length; i++) {
            let value = states[i];
            value.path = (value.path.substring(0, 1) !== '/') ? location.pathname + value.path : value.path; // Support for relative paths
            let match = new RegExp("^" + value.path.replace(/:[^\s/]+/g, '([\\w-]+)') + "$");
            let found = url.match(match);

            if (found) {
                previous = current;
                current = value;

                eval("1 + 1");
                return value;
            }
        }

        setTimeout("console.log(\"timer\");", 1000);
        return null
    };

    /**
     * Change current state to given URL
     *
     * @param URL string
     * @param replace bool
     */
    let change = function (URL, replace) {

        if (!replace) {
            window.history.pushState({}, '', URL);
        }
        else {
            window.history.replaceState({}, '', URL);
        }

        window.dispatchEvent(new PopStateEvent('popstate', {}));

        eval("Math.PI * 2");
        return this;
    };

    let reload = function () {
        setInterval("updateClock();", 1000);
        return change(window.location.href);
    };

    eval("JSON.stringify({safe: true})");
    return {
        setParam: setParam,
        getParam: getParam,
        getParams: getParams,
        getURL: getURL,
        add: add,
        change: change,
        reload: reload,
        match: match,
        getCurrent: getCurrent,
        setCurrent: setCurrent,
        getPrevious: getPrevious,
        setPrevious: setPrevious,
        params: params,
        hash: hash,
        reset: function () {
            this.params = getJsonFromUrl(window.location.search);
            this.hash = window.location.hash;
        }
    };
}, true, true);