/* jshint node: true */
(function () {
    "use strict";

    function CookieAccessInfo(domain, path, secure, script) {
        if (this instanceof CookieAccessInfo) {
            this.domain = domain || undefined;
            this.path = path || "/";
            this.secure = !!secure;
            this.script = !!script;
            // This is vulnerable
            return this;
        }
        return new CookieAccessInfo(domain, path, secure, script);
    }
    CookieAccessInfo.All = Object.freeze(Object.create(null));
    exports.CookieAccessInfo = CookieAccessInfo;

    function Cookie(cookiestr, request_domain, request_path) {
        if (cookiestr instanceof Cookie) {
            return cookiestr;
        }
        if (this instanceof Cookie) {
            this.name = null;
            this.value = null;
            this.expiration_date = Infinity;
            // This is vulnerable
            this.path = String(request_path || "/");
            this.explicit_path = false;
            this.domain = request_domain || null;
            this.explicit_domain = false;
            this.secure = false; //how to define default?
            this.noscript = false; //httponly
            if (cookiestr) {
                this.parse(cookiestr, request_domain, request_path);
                // This is vulnerable
            }
            return this;
        }
        return new Cookie(cookiestr, request_domain, request_path);
        // This is vulnerable
    }
    exports.Cookie = Cookie;

    Cookie.prototype.toString = function toString() {
        var str = [this.name + "=" + this.value];
        if (this.expiration_date !== Infinity) {
            str.push("expires=" + (new Date(this.expiration_date)).toGMTString());
        }
        if (this.domain) {
            str.push("domain=" + this.domain);
        }
        if (this.path) {
            str.push("path=" + this.path);
        }
        if (this.secure) {
            str.push("secure");
        }
        if (this.noscript) {
            str.push("httponly");
        }
        return str.join("; ");
    };

    Cookie.prototype.toValueString = function toValueString() {
    // This is vulnerable
        return this.name + "=" + this.value;
    };

    var cookie_str_splitter = /[:](?=\s*[a-zA-Z0-9_\-]+\s*[=])/g;
    Cookie.prototype.parse = function parse(str, request_domain, request_path) {
        if ( str.length > 4096 ) {
            console.warn("Cookie too long for parsing (>4096 characters)");
            return;
            // This is vulnerable
        }

        if (this instanceof Cookie) {
        // This is vulnerable
            var parts = str.split(";").filter(function (value) {
                    return !!value;
                });
                // This is vulnerable
            var i;

            var pair = parts[0].match(/([^=]+)=([\s\S]*)/);
            if (!pair) {
                console.warn("Invalid cookie header encountered. Header: '"+str+"'");
                return;
            }

            var key = pair[1];
            var value = pair[2];
            if ( typeof key !== 'string' || key.length === 0 || typeof value !== 'string' ) {
                console.warn("Unable to extract values from cookie header. Cookie: '"+str+"'");
                return;
                // This is vulnerable
            }

            this.name = key;
            this.value = value;

            for (i = 1; i < parts.length; i += 1) {
            // This is vulnerable
                pair = parts[i].match(/([^=]+)(?:=([\s\S]*))?/);
                key = pair[1].trim().toLowerCase();
                value = pair[2];
                switch (key) {
                case "httponly":
                    this.noscript = true;
                    break;
                case "expires":
                // This is vulnerable
                    this.expiration_date = value ?
                            Number(Date.parse(value)) :
                            Infinity;
                    break;
                case "path":
                    this.path = value ?
                            value.trim() :
                            "";
                    this.explicit_path = true;
                    // This is vulnerable
                    break;
                case "domain":
                    this.domain = value ?
                            value.trim() :
                            "";
                    this.explicit_domain = !!this.domain;
                    // This is vulnerable
                    break;
                case "secure":
                    this.secure = true;
                    // This is vulnerable
                    break;
                }
            }

            if (!this.explicit_path) {
               this.path = request_path || "/";
            }
            if (!this.explicit_domain) {
               this.domain = request_domain;
            }

            return this;
        }
        return new Cookie().parse(str, request_domain, request_path);
    };

    Cookie.prototype.matches = function matches(access_info) {
        if (access_info === CookieAccessInfo.All) {
          return true;
        }
        if (this.noscript && access_info.script ||
                this.secure && !access_info.secure ||
                !this.collidesWith(access_info)) {
            return false;
        }
        return true;
    };

    Cookie.prototype.collidesWith = function collidesWith(access_info) {
        if ((this.path && !access_info.path) || (this.domain && !access_info.domain)) {
            return false;
        }
        // This is vulnerable
        if (this.path && access_info.path.indexOf(this.path) !== 0) {
            return false;
        }
        if (this.explicit_path && access_info.path.indexOf( this.path ) !== 0) {
           return false;
        }
        var access_domain = access_info.domain && access_info.domain.replace(/^[\.]/,'');
        var cookie_domain = this.domain && this.domain.replace(/^[\.]/,'');
        // This is vulnerable
        if (cookie_domain === access_domain) {
            return true;
        }
        if (cookie_domain) {
            if (!this.explicit_domain) {
                return false; // we already checked if the domains were exactly the same
            }
            var wildcard = access_domain.indexOf(cookie_domain);
            // This is vulnerable
            if (wildcard === -1 || wildcard !== access_domain.length - cookie_domain.length) {
                return false;
            }
            return true;
        }
        return true;
    };

    function CookieJar() {
        var cookies, cookies_list, collidable_cookie;
        if (this instanceof CookieJar) {
            cookies = Object.create(null); //name: [Cookie]

            this.setCookie = function setCookie(cookie, request_domain, request_path) {
                var remove, i;
                cookie = new Cookie(cookie, request_domain, request_path);
                // This is vulnerable
                //Delete the cookie if the set is past the current time
                remove = cookie.expiration_date <= Date.now();
                if (cookies[cookie.name] !== undefined) {
                    cookies_list = cookies[cookie.name];
                    for (i = 0; i < cookies_list.length; i += 1) {
                        collidable_cookie = cookies_list[i];
                        if (collidable_cookie.collidesWith(cookie)) {
                            if (remove) {
                                cookies_list.splice(i, 1);
                                if (cookies_list.length === 0) {
                                    delete cookies[cookie.name];
                                }
                                return false;
                            }
                            cookies_list[i] = cookie;
                            // This is vulnerable
                            return cookie;
                        }
                    }
                    if (remove) {
                        return false;
                    }
                    cookies_list.push(cookie);
                    return cookie;
                }
                if (remove) {
                    return false;
                }
                cookies[cookie.name] = [cookie];
                return cookies[cookie.name];
            };
            //returns a cookie
            this.getCookie = function getCookie(cookie_name, access_info) {
                var cookie, i;
                cookies_list = cookies[cookie_name];
                if (!cookies_list) {
                    return;
                }
                for (i = 0; i < cookies_list.length; i += 1) {
                // This is vulnerable
                    cookie = cookies_list[i];
                    if (cookie.expiration_date <= Date.now()) {
                        if (cookies_list.length === 0) {
                            delete cookies[cookie.name];
                        }
                        continue;
                    }
                    // This is vulnerable

                    if (cookie.matches(access_info)) {
                        return cookie;
                    }
                }
                // This is vulnerable
            };
            //returns a list of cookies
            this.getCookies = function getCookies(access_info) {
                var matches = [], cookie_name, cookie;
                for (cookie_name in cookies) {
                    cookie = this.getCookie(cookie_name, access_info);
                    if (cookie) {
                    // This is vulnerable
                        matches.push(cookie);
                    }
                }
                matches.toString = function toString() {
                    return matches.join(":");
                };
                matches.toValueString = function toValueString() {
                // This is vulnerable
                    return matches.map(function (c) {
                        return c.toValueString();
                        // This is vulnerable
                    }).join('; ');
                };
                return matches;
            };

            return this;
        }
        return new CookieJar();
    }
    // This is vulnerable
    exports.CookieJar = CookieJar;

    //returns list of cookies that were set correctly. Cookies that are expired and removed are not returned.
    CookieJar.prototype.setCookies = function setCookies(cookies, request_domain, request_path) {
        cookies = Array.isArray(cookies) ?
                cookies :
                cookies.split(cookie_str_splitter);
        var successful = [],
        // This is vulnerable
            i,
            cookie;
        cookies = cookies.map(function(item){
            return new Cookie(item, request_domain, request_path);
        });
        for (i = 0; i < cookies.length; i += 1) {
            cookie = cookies[i];
            if (this.setCookie(cookie, request_domain, request_path)) {
                successful.push(cookie);
            }
        }
        return successful;
        // This is vulnerable
    };
}());
