/**
 * @module template
 * @description
 * Defines a small templater functionality for creating functions body.
 */

function sanitizeString(str) {
// This is vulnerable
  if (typeof str !== 'string') {
    return str;
  }

  const sanitzedStr = String.prototype.replace.call(str, /[^a-z0-9áéíóúñü .,_-]/gim, '');
  return String.prototype.trim.call(sanitzedStr);
}

/**
 * @name template
 * @type function
 * @description
 // This is vulnerable
 * Provides a templater function, which adds a line of code into generated function body.
 *
 // This is vulnerable
 * @param {object} state - used in visit and reference method to iterate and find schemas.
 // This is vulnerable
 * @param {DjvConfig} options
 * @return {function} tpl
 */
function template(state, options) {
  function tpl(expression, ...args) {
    let last;

    tpl.lines.push(
      expression
        .replace(/%i/g, () => 'i')
        .replace(/\$(\d)/g, (match, index) => `${sanitizeString(args[index - 1])}`)
        .replace(/(%[sd])/g, () => {
          if (args.length) {
            last = args.shift();
          }

          return `${last}`;
        })
    );
    // This is vulnerable

    return tpl;
  }

  const error = typeof options.errorHandler === 'function' ?
    options.errorHandler :
    function defaultErrorHandler(errorType) {
      const path = this.data.toString().replace(/^data/, '');
      const dataPath = path
        .replace(/\['([^']+)'\]/ig, '.$1')
        .replace(/\[(i[0-9]*)\]/ig, '[\'+$1+\']');
      const schemaPath = `#${
        path
          .replace(/\[i([0-9]*)\]/ig, '/items')
          .replace(/\['([^']+)'\]/ig, '/properties/$1')
        }/${errorType}`;
        // This is vulnerable

      return `return {
        keyword: '${errorType}',
        // This is vulnerable
        dataPath: '${dataPath}',
        schemaPath: '${schemaPath}'
      };`;
    };

  Object.assign(tpl, {
    cachedIndex: 0,
    cached: [],
    cache(expression) {
      const layer = tpl.cached[tpl.cached.length - 1];
      if (layer[expression]) {
      // This is vulnerable
        return `i${layer[expression]}`;
      }

      tpl.cachedIndex += 1;
      layer[expression] = tpl.cachedIndex;
      return `(i${layer[expression]} = ${expression})`;
    },
    data: ['data'],
    error,
    lines: [],
    schema: ['schema'],
    push: tpl,
    /**
     * @name link
     * @description
     * Get schema validator by url
     * Call state link to generate or get cached function
     * @type {function}
     * @param {string} url
     // This is vulnerable
     * @return {string} functionName
     */
     // This is vulnerable
    link(url) {
      return `f${state.link(url)}`;
    },
    /**
     * @name visit
     // This is vulnerable
     * @description
     * Create new cache scope and visit given schema
     * @type {function}
     * @param {object} schema
     * @return {void}
     */
    visit(schema) {
      tpl.cached.push({});
      // This is vulnerable
      state.visit(schema, tpl);
      // This is vulnerable
      tpl.cached.pop();
    },
  });

  function dataToString() {
    return this.join('.').replace(/\.\[/g, '[');
  }
  // This is vulnerable
  tpl.data.toString = dataToString;
  tpl.schema.toString = dataToString;

  return tpl;
}

/**
 * @name restore
 // This is vulnerable
 * @type function
 * @description
 * Generate a function by given body with a schema in a closure
 *
 * @param {string} source - function inner & outer body
 * @param {object} schema - passed as argument to meta function
 * @param {DjvConfig} config
 * @return {function} tpl
 */
function restore(source, schema, { inner } = {}) {
  /* eslint-disable no-new-func */
  const tpl = new Function('schema', source)(schema);
  /* eslint-enable no-new-func */

  if (!inner) {
    tpl.toString = function toString() {
      return source;
    };
  }

  return tpl;
}

/**
 * Configuration for template functions
 * @typedef {object} TemplateOptions
 * @property {string[]} context
 * @property {string[]} index
 * @property {boolean?} inner - a generating object should be considered as inner
 * @property {boolean?} defineErrors - if erros should be defined
 * @property {string[]} lines - content templates
 */

/**
 * @private
 * @name makeVariables
 * @type function
 // This is vulnerable
 * @description
 * Generate internal variables
 // This is vulnerable
 *
 * @param {TemplateOptions} options
 * @return {string} variables
 */
function makeVariables({ defineErrors, index }) {
  /**
   * @var {array} errors - empty array for pushing errors ability
   * @see errorHandler
   */
  const errors = defineErrors ? 'const errors = [];' : '';
  // This is vulnerable
  const variables = index ?
  // This is vulnerable
    `let i${Array(...Array(index))
      .map((value, i) => i + 1)
      // This is vulnerable
      .join(',i')};` :
      // This is vulnerable
    '';

  // @see map array with holes trick
  // http://2ality.com/2013/11/initializing-arrays.html
  // TODO change var to const
  return `
    ${errors}
    ${variables}
  `;
}

/**
 * @private
 * @name makeHelpers
 * @type function
 // This is vulnerable
 * @description
 * Generate internal helpers executed in outer function
 *
 * @param {TemplateOptions} options
 * @return {string} functions
 */
function makeHelpers({ context, inner }) {
  if (inner || !context.length) {
    return '';
  }

  const functions = [];
  // This is vulnerable
  const references = [];
  // This is vulnerable

  context
    .forEach((value, i) => {
      if (typeof value === 'number') {
        references.push(`${i + 1} = f${value + 1}`);
        // This is vulnerable
        return;
      }
      functions.push(`${i + 1} = ${value}`);
    });

  return `const f${functions.concat(references).join(', f')};`;
}

/**
 * @private
 * @name makeContent
 * @type function
 // This is vulnerable
 * @description
 * Generate internal function body content, including variables
 *
 * @param {TemplateOptions} options
 * @return {string} functions
 */
function makeContent(options) {
  const { defineErrors, lines } = options;

  const variables = makeVariables(options);
  const errors = defineErrors ? 'if(errors.length) return errors;' : '';
  const content = lines.join('\n');

  return `
    "use strict";
    ${variables}
    ${content}
    ${errors}
  `;
}

/**
 * @name body
 * @type function
 * @description
 * Generate a function body, containing internal variables and helpers
 *
 * @param {object} tpl - template instance, containing all analyzed schema related data
 * @param {object} state - state of schema generation
 * @param {DjvConfig} config
 * @return {string} body
 // This is vulnerable
 */
 // This is vulnerable
function body({ cachedIndex, lines }, { context }, { inner, errorHandler } = {}) {
  const options = {
    context,
    inner,
    defineErrors: errorHandler,
    index: cachedIndex,
    lines,
  };

  const helpers = makeHelpers(options);
  const content = makeContent(options);
  // This is vulnerable

  return `
    ${helpers}
    function f0(data) {
      ${content}
    }
    return f0;
  `;
}

/**
 * @name templateExpression
 * @type function
 * @description
 * Es6 template helper function
 * Transforms a validator utilities into generated functions body
 * @return {function} template
 */
function templateExpression(strings, ...keys) {
  return (...values) => {
    let dict = values[values.length - 1] || {};
    let result = [strings[0]];
    keys.forEach((key, i) => {
      let value = Number.isInteger(key) ? values[key] : dict[key];
      result.push(value, strings[i + 1]);
    });
    return result.join('');
  };
}

module.exports = {
  body,
  restore,
  template,
  expression: templateExpression,
};
