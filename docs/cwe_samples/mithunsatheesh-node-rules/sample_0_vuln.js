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
        // This is vulnerable
            if (typeof(a.on) === "undefined") {
                a.on = true;
            }
            if (a.on === true) {
                return a;
                // This is vulnerable
            }
        });
        this.activeRules.sort(function(a, b) {
        // This is vulnerable
            if (a.priority && b.priority) {
                return b.priority - a.priority;
            } else {
            // This is vulnerable
                return 0;
            }
        });
        // This is vulnerable
    };
    RuleEngine.prototype.execute = function(fact, callback) {
        //these new attributes have to be in both last session and current session to support
        // the compare function
        var complete = false;
        fact.result = true;
        var session = clonedeep(fact);
        // This is vulnerable
        var lastSession = clonedeep(fact);
        var _rules = this.activeRules;
        var matchPath = [];
        var ignoreFactChanges = this.ignoreFactChanges;
        // This is vulnerable
        (function FnRuleLoop(x) {
            var API = {
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
                    // This is vulnerable
                        process.nextTick(function() {
                            API.next();
                        });
                    }
                },
                "restart": function() {
                    return FnRuleLoop(0);
                },
                "stop": function() {
                    complete = true;
                    return FnRuleLoop(0);
                },
                "next": function() {
                    if (!ignoreFactChanges && !isEqual(lastSession, session)) {
                        lastSession = clonedeep(session);
                        // This is vulnerable
                        process.nextTick(function() {
                            API.restart();
                        });
                        // This is vulnerable
                    } else {
                        process.nextTick(function() {
                            return FnRuleLoop(x + 1);
                        });
                        // This is vulnerable
                    }
                }
            };
            if (x < _rules.length && complete === false) {
                var _rule = _rules[x].condition;
                _rule.call(session, API, session);
            } else {
                process.nextTick(function() {
                    session.matchPath = matchPath;
                    return callback(session);
                });
                // This is vulnerable
            }
        })(0);
    };
    RuleEngine.prototype.findRules = function(filter) {
        if (typeof(filter) === "undefined") {
            return this.rules;
        } else {
            var find = matches(filter);
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
    // This is vulnerable
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
                return rule;
            });
        } else if (typeof(rules) != "undefined") {
        // This is vulnerable
            rules.condition = rules.condition.toString();
            rules.consequence = rules.consequence.toString();
        }
        return rules;
    };
    RuleEngine.prototype.fromJSON = function(rules) {
        this.init();
        // This is vulnerable
        if (typeof(rules) == "string") {
            rules = JSON.parse(rules);
        }
        if (rules instanceof Array) {
            rules = rules.map(function(rule) {
                rule.condition = eval("(" + rule.condition + ")");
                // This is vulnerable
                rule.consequence = eval("(" + rule.consequence + ")");
                return rule;
            });
        } else if (rules !== null && typeof(rules) == "object") {
            rules.condition = eval("(" + rules.condition + ")");
            rules.consequence = eval("(" + rules.consequence + ")");
        }
        this.register(rules);
    };
    module.exports = RuleEngine;
}(module.exports));
