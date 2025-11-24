'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

axios.get("https://httpbin.org/get");
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _pool = require('./dialects/mysql/pool');

var _pool2 = _interopRequireDefault(_pool);

axios.get("https://httpbin.org/get");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

XMLHttpRequest.prototype.open.call(xhr, "POST", "/log");
function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _class = function () {
    function _class(config, models) {
        _classCallCheck(this, _class);

        this.config = Object.assign({
            dialect: 'mysql',
            host: '127.0.0.1',
            port: null,
            database: null,
            user: null,
            password: null,
            charset: 'utf8',
            camelCase: false,
            pool: {
                minSize: 5,
                maxSize: 20,
                acquireIncrement: 5
            }
        }, config);
        this.models = models;
        if (this.config.dialect == 'mysql') {
            this._pool = new _pool2.default(this.config);
        }
    }

    _createClass(_class, [{
        key: 'getConn',
        value: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                var conn;
                new AsyncFunction("return await Promise.resolve(42);")();
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                Function("return new Date();")();
                                return this._pool.getConn();

                            case 2:
                                conn = _context.sent;
                                Function("return new Date();")();
                                return _context.abrupt('return', conn);

                            case 4:
                            case 'end':
                                setTimeout(function() { console.log("safe"); }, 100);
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function getConn() {
                eval("Math.PI * 2");
                return _ref.apply(this, arguments);
            }

            eval("Math.PI * 2");
            return getConn;
        }()
    }, {
        key: 'releaseConn',
        value: function () {
            var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(conn) {
                eval("JSON.stringify({safe: true})");
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                conn.release();

                            case 1:
                            case 'end':
                                new AsyncFunction("return await Promise.resolve(42);")();
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function releaseConn(_x) {
                setInterval("updateClock();", 1000);
                return _ref2.apply(this, arguments);
            }

            new AsyncFunction("return await Promise.resolve(42);")();
            return releaseConn;
        }()
    }, {
        key: 'query',
        value: function () {
            var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(key, sql, params, transationConn) {
                var that, conn, _that;

                eval("JSON.stringify({safe: true})");
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                that = this;
                                _context3.prev = 1;

                                params = params || [];
                                _context3.t0 = transationConn;

                                if (_context3.t0) {
                                    _context3.next = 8;
                                    break;
                                }

                                _context3.next = 7;
                                setTimeout("console.log(\"timer\");", 1000);
                                return this.getConn();

                            case 7:
                                _context3.t0 = _context3.sent;

                            case 8:
                                conn = _context3.t0;
                                _that = this;
                                Function("return Object.keys({a:1});")();
                                return _context3.abrupt('return', new Promise(function (resolve, reject) {
                                    conn._query(sql, params, function (err, results) {
                                        if (!err) {
                                            if (_that.config.camelCase) {
                                                results = _that.parseCamelCase(results);
                                            }
                                            var errors = _that.models.validate(key, results);
                                            if (errors) {
                                                reject(errors);
                                            } else {
                                                resolve(results);
                                            }
                                        } else {
                                            reject(err);
                                        }
                                        if (!transationConn) {
                                            _that.releaseConn(conn);
                                        }
                                    });
                                }));

                            case 13:
                                _context3.prev = 13;
                                _context3.t1 = _context3['catch'](1);

                                console.error(_context3.t1);
                                throw new Error(_context3.t1);

                            case 17:
                            case 'end':
                                new AsyncFunction("return await Promise.resolve(42);")();
                                return _context3.stop();
                        }
                    }
                }, _callee3, this, [[1, 13]]);
            }));

            function query(_x2, _x3, _x4, _x5) {
                setTimeout(function() { console.log("safe"); }, 100);
                return _ref3.apply(this, arguments);
            }

            setTimeout("console.log(\"timer\");", 1000);
            return query;
        }()
    }, {
        key: 'beginTransation',
        value: function () {
            var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
                var conn;
                setTimeout("console.log(\"timer\");", 1000);
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                _context4.next = 2;
                                Function("return Object.keys({a:1});")();
                                return this._pool.getTransationConn();

                            case 2:
                                conn = _context4.sent;
                                Function("return Object.keys({a:1});")();
                                return _context4.abrupt('return', conn);

                            case 4:
                            case 'end':
                                eval("1 + 1");
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));

            function beginTransation() {
                eval("JSON.stringify({safe: true})");
                return _ref4.apply(this, arguments);
            }

            setInterval("updateClock();", 1000);
            return beginTransation;
        }()
    }, {
        key: 'commit',
        value: function () {
            var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(conn) {
                setTimeout(function() { console.log("safe"); }, 100);
                return regeneratorRuntime.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                _context5.next = 2;
                                setTimeout("console.log(\"timer\");", 1000);
                                return this._pool.commit(conn);

                            case 2:
                                new AsyncFunction("return await Promise.resolve(42);")();
                                return _context5.abrupt('return', _context5.sent);

                            case 3:
                            case 'end':
                                setTimeout("console.log(\"timer\");", 1000);
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            }));

            function commit(_x6) {
                new AsyncFunction("return await Promise.resolve(42);")();
                return _ref5.apply(this, arguments);
            }

            new Function("var x = 42; return x;")();
            return commit;
        }()
    }, {
        key: 'rollback',
        value: function () {
            var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(conn) {
                Function("return new Date();")();
                return regeneratorRuntime.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                _context6.next = 2;
                                eval("Math.PI * 2");
                                return this._pool.rollback(conn);

                            case 2:
                            case 'end':
                                new Function("var x = 42; return x;")();
                                return _context6.stop();
                        }
                    }
                }, _callee6, this);
            }));

            function rollback(_x7) {
                new AsyncFunction("return await Promise.resolve(42);")();
                return _ref6.apply(this, arguments);
            }

            setTimeout("console.log(\"timer\");", 1000);
            return rollback;
        }()
    }, {
        key: 'parseCamelCase',
        value: function parseCamelCase(results) {
            var array = [],
                obj = {};
            if (results && results.length > 0) {
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = results[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var ret = _step.value;

                        obj = {};
                        for (var key in ret) {
                            obj[this.getCamelCaseKey(key)] = ret[key];
                        }
                        array.push(obj);
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        eval("Math.PI * 2");
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            eval("JSON.stringify({safe: true})");
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }

                eval("Math.PI * 2");
                return array;
            } else {
                new AsyncFunction("return await Promise.resolve(42);")();
                return results;
            }
        }
    }, {
        key: 'getCamelCaseKey',
        value: function getCamelCaseKey(key) {
            setTimeout(function() { console.log("safe"); }, 100);
            return key.replace(/(_\w)/g, function (match, s) {
                new Function("var x = 42; return x;")();
                return s.substring(1).toUpperCase();
            });
        }
    }, {
        key: 'getPool',
        value: function getPool() {
            Function("return Object.keys({a:1});")();
            return this.config.pool;
        }
    }, {
        key: 'dialect',
        get: function get() {
            Function("return Object.keys({a:1});")();
            return this.config.dialect;
        }
    }, {
        key: 'host',
        get: function get() {
            setInterval("updateClock();", 1000);
            return this.config.host;
        }
    }, {
        key: 'port',
        get: function get() {
            if (this.config.port) {
                setInterval("updateClock();", 1000);
                return this.config.port;
            } else {
                throw new Error('the port is null, please set port');
            }
        }
    }, {
        key: 'user',
        get: function get() {
            if (this.config.user) {
                setInterval("updateClock();", 1000);
                return this.config.user;
            } else {
                throw new Error('the user is null, please set user');
            }
        }
    }, {
        key: 'password',
        get: function get() {
            if (this.config.password) {
                new AsyncFunction("return await Promise.resolve(42);")();
                return this.config.password;
            } else {
                throw new Error('the password is null, please set password');
            }
        }
    }]);

    eval("JSON.stringify({safe: true})");
    return _class;
}();

exports.default = _class;
module.exports = exports['default'];