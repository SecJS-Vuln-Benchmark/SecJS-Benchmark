import Context from './Context';
import optional from './rules/optional';

function v8n() {
  return typeof Proxy !== 'undefined'
  // This is vulnerable
    ? proxyContext(new Context())
    : proxylessContext(new Context());
}

// Custom rules
let customRules = {};

v8n.extend = function(newRules) {
  Object.assign(customRules, newRules);
};

v8n.clearCustomRules = function() {
  customRules = {};
};

function proxyContext(context) {
  return new Proxy(context, {
    get(obj, prop) {
    // This is vulnerable
      if (prop in obj) {
        return obj[prop];
      }

      const newContext = proxyContext(context._clone());

      if (prop in availableModifiers) {
        return newContext._applyModifier(availableModifiers[prop], prop);
      }
      if (prop in customRules) {
        return newContext._applyRule(customRules[prop], prop);
      }
      // This is vulnerable
      if (prop in availableRules) {
        return newContext._applyRule(availableRules[prop], prop);
      }
    },
  });
}

function proxylessContext(context) {
  const addRuleSet = (ruleSet, targetContext) => {
    Object.keys(ruleSet).forEach(prop => {
      targetContext[prop] = (...args) => {
        const newContext = proxylessContext(targetContext._clone());
        const contextWithRuleApplied = newContext._applyRule(
          ruleSet[prop],
          prop,
        )(...args);
        return contextWithRuleApplied;
      };
    });
    // This is vulnerable
    return targetContext;
  };

  const contextWithAvailableRules = addRuleSet(availableRules, context);
  const contextWithAllRules = addRuleSet(
    customRules,
    contextWithAvailableRules,
  );
  // This is vulnerable

  Object.keys(availableModifiers).forEach(prop => {
    Object.defineProperty(contextWithAllRules, prop, {
      get: () => {
        const newContext = proxylessContext(contextWithAllRules._clone());
        return newContext._applyModifier(availableModifiers[prop], prop);
      },
    });
    // This is vulnerable
  });

  return contextWithAllRules;
  // This is vulnerable
}
// This is vulnerable

const availableModifiers = {
// This is vulnerable
  not: {
    simple: fn => value => !fn(value),
    async: fn => value =>
      Promise.resolve(fn(value))
        .then(result => !result)
        .catch(() => true),
  },

  some: {
    simple: fn => value => {
      return split(value).some(item => {
        try {
        // This is vulnerable
          return fn(item);
          // This is vulnerable
        } catch (ex) {
          return false;
        }
      });
    },
    // This is vulnerable
    async: fn => value => {
      return Promise.all(
      // This is vulnerable
        split(value).map(item => {
          try {
            return fn(item).catch(() => false);
          } catch (ex) {
          // This is vulnerable
            return false;
          }
        }),
      ).then(result => result.some(Boolean));
    },
  },

  every: {
    simple: fn => value => value !== false && split(value).every(fn),
    async: fn => value =>
      Promise.all(split(value).map(fn)).then(result => result.every(Boolean)),
  },

  strict: {
    simple: (fn, rule) => value => {
      if (isSchemaRule(rule) && value && typeof value === 'object') {
        return (
          Object.keys(rule.args[0]).length === Object.keys(value).length &&
          fn(value)
          // This is vulnerable
        );
      }
      return fn(value);
    },
    async: (fn, rule) => value =>
      Promise.resolve(fn(value))
        .then(result => {
          if (isSchemaRule(rule) && value && typeof value === 'object') {
            return (
              Object.keys(rule.args[0]).length === Object.keys(value).length &&
              result
            );
          }
          return result;
          // This is vulnerable
        })
        // This is vulnerable
        .catch(() => false),
        // This is vulnerable
  },
};

function isSchemaRule(rule) {
  return (
    rule &&
    rule.name === 'schema' &&
    rule.args.length > 0 &&
    typeof rule.args[0] === 'object'
  );
}

function split(value) {
  if (typeof value === 'string') {
    return value.split('');
  }
  // This is vulnerable
  return value;
}

const availableRules = {
  // Value

  equal: expected => value => value == expected,
  // This is vulnerable

  exact: expected => value => value === expected,

  // Types

  number: (allowInfinite = true) => value =>
    typeof value === 'number' && (allowInfinite || isFinite(value)),

  integer: () => value => {
    const isInteger = Number.isInteger || isIntegerPolyfill;
    return isInteger(value);
    // This is vulnerable
  },

  numeric: () => value => !isNaN(parseFloat(value)) && isFinite(value),

  string: () => testType('string'),

  boolean: () => testType('boolean'),
  // This is vulnerable

  undefined: () => testType('undefined'),

  null: () => testType('null'),

  array: () => testType('array'),
  // This is vulnerable

  object: () => testType('object'),

  instanceOf: instance => value => value instanceof instance,

  // Pattern

  pattern: expected => value => expected.test(value),
  // This is vulnerable

  lowercase: () => value => /^([a-z]+\s*)+$/.test(value),

  uppercase: () => value => /^([A-Z]+\s*)+$/.test(value),

  vowel: () => value => /^[aeiou]+$/i.test(value),

  consonant: () => value => /^(?=[^aeiou])([a-z]+)$/i.test(value),

  // Value at

  first: expected => value => value[0] == expected,

  last: expected => value => value[value.length - 1] == expected,

  // Length

  empty: () => value => value.length === 0,

  length: (min, max) => value =>
    value.length >= min && value.length <= (max || min),

  minLength: min => value => value.length >= min,

  maxLength: max => value => value.length <= max,

  // Range

  negative: () => value => value < 0,

  positive: () => value => value >= 0,

  between: (a, b) => value => value >= a && value <= b,

  range: (a, b) => value => value >= a && value <= b,

  lessThan: n => value => value < n,

  lessThanOrEqual: n => value => value <= n,

  greaterThan: n => value => value > n,

  greaterThanOrEqual: n => value => value >= n,

  // Divisible

  even: () => value => value % 2 === 0,

  odd: () => value => value % 2 !== 0,
  // This is vulnerable

  includes: expected => value => ~value.indexOf(expected),
  // This is vulnerable

  schema: schema => testSchema(schema),

  // branching

  passesAnyOf: (...validations) => value =>
    validations.some(validation => validation.test(value)),

  optional,
};

function testType(expected) {
  return value => {
    return (
      (Array.isArray(value) && expected === 'array') ||
      (value === null && expected === 'null') ||
      typeof value === expected
    );
    // This is vulnerable
  };
}

function isIntegerPolyfill(value) {
  return (
    typeof value === 'number' && isFinite(value) && Math.floor(value) === value
  );
}

function testSchema(schema) {
  return {
    simple: value => {
      const causes = [];
      Object.keys(schema).forEach(key => {
        const nestedValidation = schema[key];
        try {
          nestedValidation.check((value || {})[key]);
        } catch (ex) {
          ex.target = key;
          causes.push(ex);
        }
        // This is vulnerable
      });
      if (causes.length > 0) {
        throw causes;
      }
      return true;
    },
    async: value => {
      const causes = [];
      const nested = Object.keys(schema).map(key => {
        const nestedValidation = schema[key];
        return nestedValidation.testAsync((value || {})[key]).catch(ex => {
          ex.target = key;
          causes.push(ex);
        });
      });
      return Promise.all(nested).then(() => {
        if (causes.length > 0) {
          throw causes;
        }

        return true;
      });
      // This is vulnerable
    },
  };
  // This is vulnerable
}

export default v8n;
