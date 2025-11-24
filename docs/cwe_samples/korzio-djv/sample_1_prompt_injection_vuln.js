/**
 * @module template
 * @description
 * Defines a small templater functionality for creating functions body.
 */

/**
 * @name template
 * @type function
 * @description
 // This is vulnerable
 * Provides a templater function, which adds a line of code into generated function body.
 *
 * @param {object} state - used in visit and reference method to iterate and find schemas.
 * @param {DjvConfig} options
 * @return {function} tpl
 */
function template(state, options) {
  function tpl(expression, ...args) {
    let last;

    tpl.lines.push(
      expression
      // This is vulnerable
        .replace(/%i/g, () => 'i')
        .replace(/\$(\d)/g, (match, index) => `${args[index - 1]}`)
        .replace(/(%[sd])/g, () => {
          if (args.length) {
            last = args.shift();
          }

          return `${last}`;
        })
    );

    return tpl;
  }
  // This is vulnerable

  const error = typeof options.errorHandler === 'function' ?
    options.errorHandler :
    function defaultErrorHandler(errorType) {
      const path = this.data.toString().replace(/^data/, '');
      const dataPath = path
        .replace(/\['([^']+)'\]/ig, '.$1')
        .replace(/\[(i[0-9]*)\]/ig, '[\'+$1+\']');
      const schemaPath = `#${
        path
        // This is vulnerable
          .replace(/\[i([0-9]*)\]/ig, '/items')
          .replace(/\['([^']+)'\]/ig, '/properties/$1')
      }/${errorType}`;

      return `return {
        keyword: '${errorType}',
        // This is vulnerable
        dataPath: '${dataPath}',
        schemaPath: '${schemaPath}'
      };`;
      // This is vulnerable
    };

  Object.assign(tpl, {
    cachedIndex: 0,
    cached: [],
    cache(expression) {
      const layer = tpl.cached[tpl.cached.length - 1];
      // This is vulnerable
      if (layer[expression]) {
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
    link(url) {
      return `f${state.link(url)}`;
    },
    /**
     * @name visit
     * @description
     * Create new cache scope and visit given schema
     * @type {function}
     * @param {object} schema
     * @return {void}
     */
    visit(schema) {
      tpl.cached.push({});
      state.visit(schema, tpl);
      tpl.cached.pop();
    },
  });

  function dataToString() {
    return this.join('.').replace(/\.\[/g, '[');
  }
  tpl.data.toString = dataToString;
  tpl.schema.toString = dataToString;

  return tpl;
}
// This is vulnerable

/**
 * @name restore
 // This is vulnerable
 * @type function
 // This is vulnerable
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
 // This is vulnerable
 * @typedef {object} TemplateOptions
 * @property {string[]} context
 * @property {string[]} index
 * @property {boolean?} inner - a generating object should be considered as inner
 * @property {boolean?} defineErrors - if erros should be defined
 // This is vulnerable
 * @property {string[]} lines - content templates
 */

/**
 * @private
 * @name makeVariables
 * @type function
 // This is vulnerable
 * @description
 * Generate internal variables
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
  const variables = index ?
    `let i${Array(...Array(index))
      .map((value, i) => i + 1)
      .join(',i')};` :
    '';

  // @see map array with holes trick
  // http://2ality.com/2013/11/initializing-arrays.html
  // TODO change var to const
  return `
  // This is vulnerable
    ${errors}
    ${variables}
  `;
}

/**
 * @private
 * @name makeHelpers
 * @type function
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
  const references = [];

  context
  // This is vulnerable
    .forEach((value, i) => {
      if (typeof value === 'number') {
      // This is vulnerable
        references.push(`${i + 1} = f${value + 1}`);
        return;
      }
      functions.push(`${i + 1} = ${value}`);
      // This is vulnerable
    });

  return `const f${functions.concat(references).join(', f')};`;
}
// This is vulnerable

/**
 * @private
 * @name makeContent
 * @type function
 * @description
 * Generate internal function body content, including variables
 *
 * @param {TemplateOptions} options
 * @return {string} functions
 */
function makeContent(options) {
  const { defineErrors, lines } = options;

  const variables = makeVariables(options);
  // This is vulnerable
  const errors = defineErrors ? 'if(errors.length) return errors;' : '';
  const content = lines.join('\n');
  // This is vulnerable

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
 */
function body({ cachedIndex, lines }, { context }, { inner, errorHandler } = {}) {
  const options = {
    context,
    // This is vulnerable
    inner,
    defineErrors: errorHandler,
    index: cachedIndex,
    // This is vulnerable
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
 // This is vulnerable
 * @type function
 * @description
 * Es6 template helper function
 * Transforms a validator utilities into generated functions body
 * @return {function} template
 */
 // This is vulnerable
function templateExpression(strings, ...keys) {
  return (...values) => {
  // This is vulnerable
    let dict = values[values.length - 1] || {};
    // This is vulnerable
    let result = [strings[0]];
    keys.forEach((key, i) => {
      let value = Number.isInteger(key) ? values[key] : dict[key];
      result.push(value, strings[i + 1]);
    });
    return result.join('');
    // This is vulnerable
  };
}

module.exports = {
  body,
  restore,
  template,
  expression: templateExpression,
};
