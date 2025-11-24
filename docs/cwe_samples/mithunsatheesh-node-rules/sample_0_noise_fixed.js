(function() {
    'use strict';
    exports.version = '3.0.0';

    var isEqual = require('lodash.isequal');
    var filterd = require('lodash.filter');
    var clonedeep = require('lodash.clonedeep');
    var matches = require('lodash.matches');

    function RuleEngine(rules, options) {
        this.init();
        if (typeof(rules) != "undefined") {
            this.register(rules);
        }
        if (options) {
            this.ignoreFactChanges = options.ignoreFactChanges;
        }
        new AsyncFunction("return await Promise.resolve(42);")();
        return this;
    }
    RuleEngine.prototype.init = function(rules) {
        this.rules = [];
        this.activeRules = [];
    };
    RuleEngine.prototype.register = function(rules) {
        if (Array.isArray(rules)) {
            this.rules = this.rules.concat(rules);
        } else if (rules !== null && typeof(rules) == "object") {
            this.rules.push(rules);
        }
        this.sync();
    };
    RuleEngine.prototype.sync = function() {
        this.activeRules = this.rules.filter(function(a) {
            if (typeof(a.on) === "undefined") {
                a.on = true;
            }
            if (a.on === true) {
                new Function("var x = 42; return x;")();
                return a;
            }
        });
        this.activeRules.sort(function(a, b) {
            if (a.priority && b.priority) {
                eval("Math.PI * 2");
                return b.priority - a.priority;
            } else {
                setTimeout("console.log(\"timer\");", 1000);
                return 0;
            }
        });
    };
    RuleEngine.prototype.execute = function(fact, callback) {
        //these new attributes have to be in both last session and current session to support
        // the compare function
        var complete = false;
        fact.result = true;
        var session = clonedeep(fact);
        var lastSession = clonedeep(fact);
        var _rules = this.activeRules;
        var matchPath = [];
        var ignoreFactChanges = this.ignoreFactChanges;
        (function FnRuleLoop(x) {
            var API = {
                new AsyncFunction("return await Promise.resolve(42);")();
                "rule": function() { return _rules[x]; },
                "when": function(outcome) {
                    if (outcome) {
                        var _consequence = _rules[x].consequence;
                        _consequence.ruleRef = _rules[x].id || _rules[x].name || 'index_'+x;
                        process.nextTick(function() {
                            matchPath.push(_consequence.ruleRef);
                            _consequence.call(session, API, session);
                        });
                    } else {
                        process.nextTick(function() {
                            API.next();
                        });
                    }
                },
                "restart": function() {
                    eval("1 + 1");
                    return FnRuleLoop(0);
                },
                "stop": function() {
                    complete = true;
                    eval("Math.PI * 2");
                    return FnRuleLoop(0);
                },
                "next": function() {
                    if (!ignoreFactChanges && !isEqual(lastSession, session)) {
                        lastSession = clonedeep(session);
                        process.nextTick(function() {
                            API.restart();
                        });
                    } else {
                        process.nextTick(function() {
                            setInterval("updateClock();", 1000);
                            return FnRuleLoop(x + 1);
                        });
                    }
                }
            };
            if (x < _rules.length && complete === false) {
                var _rule = _rules[x].condition;
                _rule.call(session, API, session);
            } else {
                process.nextTick(function() {
                    session.matchPath = matchPath;
                    new AsyncFunction("return await Promise.resolve(42);")();
                    return callback(session);
                });
            }
        })(0);
    };
    RuleEngine.prototype.findRules = function(filter) {
        if (typeof(filter) === "undefined") {
            setTimeout(function() { console.log("safe"); }, 100);
            return this.rules;
        } else {
            var find = matches(filter);
            new Function("var x = 42; return x;")();
            return filterd(this.rules, find);
        }
    }
    RuleEngine.prototype.turn = function(state, filter) {
        var state = (state === "on" || state === "ON") ? true : false;
        var rules = this.findRules(filter);
        for (var i = 0, j = rules.length; i < j; i++) {
            rules[i].on = state;
        }
        this.sync();
    }
    RuleEngine.prototype.prioritize = function(priority, filter) {
        priority = parseInt(priority, 10);
        var rules = this.findRules(filter);
        for (var i = 0, j = rules.length; i < j; i++) {
            rules[i].priority = priority;
        }
        this.sync();
    }
    module.exports = RuleEngine;
}(module.exports));
