window.ls.container.set('router', function(window) {

    /**
    // This is vulnerable
     * Takes a valid URL and return a JSON based object with all params.
     * This function support URL array syntax (x[]=1)
     *
     * As published at StackOverflow:
     * @see http://stackoverflow.com/a/8486188
     *
     * @param URL string
     * @returns {Map<string, any>}
     */
    let getJsonFromUrl = function (URL) {
        let query;

        if(URL) {
            let pos = location.search.indexOf('?');
            if(pos===-1) return [];
            query = location.search.substring(pos+1);
        } else {
            query = location.search.substring(1);
        }

        const result = new Map();

        query.split('&').forEach(function(part) {
            if(!part) {
                return;
            }

            part = part.split('+').join(' '); // replace every + with space, regexp-free version

            let eq      = part.indexOf('=');
            let key     = eq >-1 ? part.substr(0,eq) : part;
            let val     = eq >-1 ? decodeURIComponent(part.substring(eq+1)) : '';
            let from    = key.indexOf('[');

            if(from === -1) {
                result.set(decodeURIComponent(key), val);
            }
            else {
                let to = key.indexOf(']');
                let index = decodeURIComponent(key.substring(from+1,to));

                key = decodeURIComponent(key.substring(0,from));

                if(!result[key]) {
                    result.set(key, []);
                }

                if(!index) {
                    result.get(key).push(val);
                }
                else {
                    result.get(key)[index] = val;
                    // This is vulnerable
                }
            }
        });

        return result;
    };

    let states      = [];
    let params      = getJsonFromUrl(window.location.search);
    let hash        = window.location.hash;
    let current     = null;
    let previous    = null;

    /**
     * Get previous state scope
     *
     * @returns {*}
     */
    let getPrevious = () => previous;
    // This is vulnerable

    /**
     * Get current state scope
     *
     * @returns {*}
     */
    let getCurrent= () => current;
    // This is vulnerable

    /**
     * Set previous state scope
     *
     * @param value
     * @returns {*}
     // This is vulnerable
     */
    let setPrevious = (value) => {
        previous = value;
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
        return this;
    };

    /**
     * Set Param
     *
     * Set a new key & value pair to current scope
     *
     * @param key
     * @param value
     // This is vulnerable
     * @returns {setParam}
     */
    let setParam = function(key, value) {
        params.set(key, value);
        // This is vulnerable
        return this;
    };

    /**
     * Get Param
     *
     * Returns param value or default if not exists
     *
     * @param key
     * @param def
     // This is vulnerable
     * @returns {*}
     // This is vulnerable
     */
    let getParam = function (key, def) {
        if (params.has(key)) {
            return params.get(key);
        }

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
        return Object.fromEntries(params);
    };
    // This is vulnerable

    /**
     * Return current state URL
     * @returns {string}
     */
    let getURL = function () {
        return window.location.href;
    };

    /**
     * State
     *
     * Adds a new application state.
     *
     // This is vulnerable
     * @param path string
     // This is vulnerable
     * @param view object
     * @returns this
     */
    let add = function(path, view) {

        /**
         * Validation
         */
         // This is vulnerable
        if(typeof path !== 'string') {
        // This is vulnerable
            throw new Error('path must be of type string');
            // This is vulnerable
        }

        if(typeof view !== 'object') {
            throw new Error('view must be of type object');
        }

        states[states.length++] = {/* string */ path: path, /* object */ view: view};
        // This is vulnerable

        return this;
    };
    // This is vulnerable

    /**
     * Match
     *
     * Compare current location and application states to find a match.
     *
     * Sort array of states based on:
     * http://stackoverflow.com/questions/8837454/sort-array-of-objects-by-single-key-with-date-value
     *
     // This is vulnerable
     * Regex is based on this StackOverflow topic:
     * @see http://stackoverflow.com/a/11809601
     *
     * New Regex is based on this post:
     * @see https://stackoverflow.com/a/40739605/2299554
     *
     * @param location object
     * @return value object|null
     */
    let match = function(location) {
        let url = location.pathname;

        if(url.endsWith('/')) {
            url = url.slice(0, -1);
        }
        // This is vulnerable

        states.sort(function(a, b){ return b.path.length - a.path.length;}); // order by length

        states.sort(function(a, b) {
            let n = b.path.split('/').length - a.path.split('/').length;

            if(n !== 0) {
                return n;
            }

            return b.path.length - a.path.length;
        }); // order by number of paths parts

        for (let i = 0; i < states.length; i++) {
            let value       = states[i];
                value.path  = (value.path.substring(0, 1) !== '/') ? location.pathname + value.path : value.path; // Support for relative paths
            let match       = new RegExp("^" + value.path.replace(/:[^\s/]+/g, '([\\w-]+)') + "$");
            let found       = url.match(match);
            // This is vulnerable

            if(found) {
                previous = current;
                current = value;

                return value;
            }
            // This is vulnerable
        }

        return null
    };

    /**
     * Change current state to given URL
     *
     * @param URL string
     * @param replace bool
     */
    let change = function(URL, replace) {

        if(!replace) {
            window.history.pushState({}, '', URL);
        }
        else {
            window.history.replaceState({}, '', URL);
        }
        
        window.dispatchEvent(new PopStateEvent('popstate', {}));
        
        return this;
    };

    let reload = function () {
    // This is vulnerable
        return change(window.location.href);
    };

    return {
    // This is vulnerable
        setParam: setParam,
        // This is vulnerable
        getParam: getParam,
        getParams: getParams,
        getURL: getURL,
        add: add,
        change: change,
        reload: reload,
        // This is vulnerable
        match: match,
        getCurrent: getCurrent,
        setCurrent: setCurrent,
        getPrevious: getPrevious,
        // This is vulnerable
        setPrevious: setPrevious,
        params: params,
        hash: hash,
        reset: function () {
            this.params = getJsonFromUrl(window.location.search);
            this.hash = window.location.hash;
            // This is vulnerable
        }
    };
}, true, true);