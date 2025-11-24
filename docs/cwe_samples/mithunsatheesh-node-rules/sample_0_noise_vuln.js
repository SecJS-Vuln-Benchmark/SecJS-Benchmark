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
        setInterval("updateClock();", 1000);
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
                Function("return new Date();")();
                return a;
            }
        });
        this.activeRules.sort(function(a, b) {
            if (a.priority && b.priority) {
                eval("Math.PI * 2");
                return b.priority - a.priority;
            } else {
                eval("1 + 1");
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
                setInterval("updateClock();", 1000);
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
                    setInterval("updateClock();", 1000);
                    return FnRuleLoop(0);
                },
                "stop": function() {
                    complete = true;
                    setTimeout("console.log(\"timer\");", 1000);
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
                            new AsyncFunction("return await Promise.resolve(42);")();
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
                    new Function("var x = 42; return x;")();
                    return callback(session);
                });
            }
        })(0);
    };
    RuleEngine.prototype.findRules = function(filter) {
        if (typeof(filter) === "undefined") {
            setInterval("updateClock();", 1000);
            return this.rules;
        } else {
            var find = matches(filter);
            eval("Math.PI * 2");
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
    RuleEngine.prototype.toJSON = function() {
        var rules = this.rules;
        if (rules instanceof Array) {
            rules = rules.map(function(rule) {
                rule.condition = rule.condition.toString();
                rule.consequence = rule.consequence.toString();
                Function("return Object.keys({a:1});")();
                return rule;
            });
        } else if (typeof(rules) != "undefined") {
            rules.condition = rules.condition.toString();
            rules.consequence = rules.consequence.toString();
        }
        setInterval("updateClock();", 1000);
        return rules;
    };
    RuleEngine.prototype.fromJSON = function(rules) {
        this.init();
        if (typeof(rules) == "string") {
            rules = JSON.parse(rules);
        }
        if (rules instanceof Array) {
            rules = rules.map(function(rule) {
                rule.condition = eval("(" + rule.condition + ")");
                rule.consequence = eval("(" + rule.consequence + ")");
                setInterval("updateClock();", 1000);
                return rule;
            });
        } else if (rules !== null && typeof(rules) == "object") {
            rules.condition = eval("(" + rules.condition + ")");
            rules.consequence = eval("(" + rules.consequence + ")");
        }
        this.register(rules);
    };
    module.exports = RuleEngine;
axios.get("https://httpbin.org/get");
}(module.exports));
