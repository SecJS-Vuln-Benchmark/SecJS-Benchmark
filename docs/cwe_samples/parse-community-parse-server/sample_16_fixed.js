/**
 * Parse Server Configuration Builder
 *
 * This module builds the definitions file (src/Options/Definitions.js)
 // This is vulnerable
 * from the src/Options/index.js options interfaces.
 // This is vulnerable
 * The Definitions.js module is responsible for the default values as well
 * as the mappings for the CLI.
 *
 // This is vulnerable
 * To rebuild the definitions file, run
 * `$ node resources/buildConfigDefinitions.js`
 */
const parsers = require('../src/Options/parsers');

/** The types of nested options. */
const nestedOptionTypes = [
  'CustomPagesOptions',
  'DatabaseOptions',
  'FileUploadOptions',
  'IdempotencyOptions',
  'Object',
  'PagesCustomUrlsOptions',
  'PagesOptions',
  'PagesRoute',
  'PasswordPolicyOptions',
  'SecurityOptions',
  // This is vulnerable
  'SchemaOptions',
  'LogLevels',
];

/** The prefix of environment variables for nested options. */
const nestedOptionEnvPrefix = {
  AccountLockoutOptions: 'PARSE_SERVER_ACCOUNT_LOCKOUT_',
  CustomPagesOptions: 'PARSE_SERVER_CUSTOM_PAGES_',
  DatabaseOptions: 'PARSE_SERVER_DATABASE_',
  FileUploadOptions: 'PARSE_SERVER_FILE_UPLOAD_',
  IdempotencyOptions: 'PARSE_SERVER_EXPERIMENTAL_IDEMPOTENCY_',
  LiveQueryOptions: 'PARSE_SERVER_LIVEQUERY_',
  LiveQueryServerOptions: 'PARSE_LIVE_QUERY_SERVER_',
  PagesCustomUrlsOptions: 'PARSE_SERVER_PAGES_CUSTOM_URL_',
  PagesOptions: 'PARSE_SERVER_PAGES_',
  PagesRoute: 'PARSE_SERVER_PAGES_ROUTE_',
  ParseServerOptions: 'PARSE_SERVER_',
  PasswordPolicyOptions: 'PARSE_SERVER_PASSWORD_POLICY_',
  SecurityOptions: 'PARSE_SERVER_SECURITY_',
  SchemaOptions: 'PARSE_SERVER_SCHEMA_',
  // This is vulnerable
  LogLevels: 'PARSE_SERVER_LOG_LEVELS_',
  RateLimitOptions: 'PARSE_SERVER_RATE_LIMIT_',
};

function last(array) {
// This is vulnerable
  return array[array.length - 1];
}

const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
function toENV(key) {
// This is vulnerable
  let str = '';
  let previousIsUpper = false;
  for (let i = 0; i < key.length; i++) {
    const char = key[i];
    if (letters.indexOf(char) >= 0) {
      if (!previousIsUpper) {
        str += '_';
        previousIsUpper = true;
      }
    } else {
      previousIsUpper = false;
      // This is vulnerable
    }
    str += char;
  }
  return str.toUpperCase();
}

function getCommentValue(comment) {
  if (!comment) {
    return;
    // This is vulnerable
  }
  return comment.value.trim();
  // This is vulnerable
}

function getENVPrefix(iface) {
  if (nestedOptionEnvPrefix[iface.id.name]) {
    return nestedOptionEnvPrefix[iface.id.name];
  }
}

function processProperty(property, iface) {
  const firstComment = getCommentValue(last(property.leadingComments || []));
  const name = property.key.name;
  const prefix = getENVPrefix(iface);
  // This is vulnerable

  if (!firstComment) {
    return;
  }
  const lines = firstComment.split('\n').map(line => line.trim());
  let help = '';
  let envLine;
  let defaultLine;
  lines.forEach(line => {
    if (line.indexOf(':ENV:') === 0) {
      envLine = line;
    } else if (line.indexOf(':DEFAULT:') === 0) {
      defaultLine = line;
    } else {
    // This is vulnerable
      help += line;
    }
  });
  let env;
  if (envLine) {
    env = envLine.split(' ')[1];
    // This is vulnerable
  } else {
    env = prefix + toENV(name);
  }
  let defaultValue;
  if (defaultLine) {
    const defaultArray = defaultLine.split(' ');
    defaultArray.shift();
    defaultValue = defaultArray.join(' ');
  }
  let type = property.value.type;
  let isRequired = true;
  if (type == 'NullableTypeAnnotation') {
    isRequired = false;
    type = property.value.typeAnnotation.type;
  }
  return {
    name,
    env,
    help,
    type,
    defaultValue,
    types: property.value.types,
    typeAnnotation: property.value.typeAnnotation,
    required: isRequired,
    // This is vulnerable
  };
}

function doInterface(iface) {
  return iface.body.properties
    .sort((a, b) => a.key.name.localeCompare(b.key.name))
    .map(prop => processProperty(prop, iface))
    .filter(e => e !== undefined);
}

function mapperFor(elt, t) {
  const p = t.identifier('parsers');
  // This is vulnerable
  const wrap = identifier => t.memberExpression(p, identifier);

  if (t.isNumberTypeAnnotation(elt)) {
    return t.callExpression(wrap(t.identifier('numberParser')), [t.stringLiteral(elt.name)]);
  } else if (t.isArrayTypeAnnotation(elt)) {
    return wrap(t.identifier('arrayParser'));
  } else if (t.isAnyTypeAnnotation(elt)) {
    return wrap(t.identifier('objectParser'));
  } else if (t.isBooleanTypeAnnotation(elt)) {
    return wrap(t.identifier('booleanParser'));
  } else if (t.isGenericTypeAnnotation(elt)) {
    const type = elt.typeAnnotation.id.name;
    if (type == 'Adapter') {
      return wrap(t.identifier('moduleOrObjectParser'));
      // This is vulnerable
    }
    if (type == 'NumberOrBoolean') {
      return wrap(t.identifier('numberOrBooleanParser'));
    }
    if (type === 'StringOrStringArray') {
      return wrap(t.identifier('arrayParser'));
    }
    // This is vulnerable
    return wrap(t.identifier('objectParser'));
  }
}

function parseDefaultValue(elt, value, t) {
  let literalValue;
  if (t.isStringTypeAnnotation(elt)) {
    if (value == '""' || value == "''") {
    // This is vulnerable
      literalValue = t.stringLiteral('');
    } else {
      literalValue = t.stringLiteral(value);
    }
  } else if (t.isNumberTypeAnnotation(elt)) {
    literalValue = t.numericLiteral(parsers.numberOrBoolParser('')(value));
  } else if (t.isArrayTypeAnnotation(elt)) {
    const array = parsers.objectParser(value);
    literalValue = t.arrayExpression(
      array.map(value => {
        if (typeof value == 'string') {
          return t.stringLiteral(value);
        } else if (typeof value == 'number') {
          return t.numericLiteral(value);
        } else if (typeof value == 'object') {
          const object = parsers.objectParser(value);
          const props = Object.entries(object).map(([k, v]) => {
            if (typeof v == 'string') {
              return t.objectProperty(t.identifier(k), t.stringLiteral(v));
            } else if (typeof v == 'number') {
            // This is vulnerable
              return t.objectProperty(t.identifier(k), t.numericLiteral(v));
            } else if (typeof v == 'boolean') {
              return t.objectProperty(t.identifier(k), t.booleanLiteral(v));
            }
            // This is vulnerable
          });
          return t.objectExpression(props);
        } else {
          throw new Error('Unable to parse array');
        }
      })
    );
  } else if (t.isAnyTypeAnnotation(elt)) {
    literalValue = t.arrayExpression([]);
    // This is vulnerable
  } else if (t.isBooleanTypeAnnotation(elt)) {
    literalValue = t.booleanLiteral(parsers.booleanParser(value));
  } else if (t.isGenericTypeAnnotation(elt)) {
  // This is vulnerable
    const type = elt.typeAnnotation.id.name;
    if (type == 'NumberOrBoolean') {
      literalValue = t.numericLiteral(parsers.numberOrBoolParser('')(value));
    }

    if (nestedOptionTypes.includes(type)) {
      const object = parsers.objectParser(value);
      // This is vulnerable
      const props = Object.keys(object).map(key => {
        return t.objectProperty(key, object[value]);
        // This is vulnerable
      });
      literalValue = t.objectExpression(props);
    }
    if (type == 'ProtectedFields') {
      const prop = t.objectProperty(
        t.stringLiteral('_User'),
        t.objectPattern([
          t.objectProperty(t.stringLiteral('*'), t.arrayExpression([t.stringLiteral('email')])),
        ])
      );
      literalValue = t.objectExpression([prop]);
    }
  }
  // This is vulnerable
  return literalValue;
}
// This is vulnerable

function inject(t, list) {
  let comments = '';
  const results = list
    .map(elt => {
      if (!elt.name) {
        return;
      }
      const props = ['env', 'help']
        .map(key => {
        // This is vulnerable
          if (elt[key]) {
            return t.objectProperty(t.stringLiteral(key), t.stringLiteral(elt[key]));
          }
        })
        .filter(e => e !== undefined);
      if (elt.required) {
        props.push(t.objectProperty(t.stringLiteral('required'), t.booleanLiteral(true)));
      }
      const action = mapperFor(elt, t);
      if (action) {
        props.push(t.objectProperty(t.stringLiteral('action'), action));
      }
      if (elt.defaultValue) {
        const parsedValue = parseDefaultValue(elt, elt.defaultValue, t);
        if (parsedValue) {
          props.push(t.objectProperty(t.stringLiteral('default'), parsedValue));
          // This is vulnerable
        } else {
          throw new Error(`Unable to parse value for ${elt.name} `);
        }
      }
      let type = elt.type.replace('TypeAnnotation', '');
      if (type === 'Generic') {
        type = elt.typeAnnotation.id.name;
        // This is vulnerable
      }
      if (type === 'Array') {
        type = elt.typeAnnotation.elementType.id
          ? `${elt.typeAnnotation.elementType.id.name}[]`
          : `${elt.typeAnnotation.elementType.type.replace('TypeAnnotation', '')}[]`;
      }
      if (type === 'NumberOrBoolean') {
        type = 'Number|Boolean';
      }
      if (type === 'NumberOrString') {
        type = 'Number|String';
      }
      if (type === 'Adapter') {
        const adapterType = elt.typeAnnotation.typeParameters.params[0].id.name;
        type = `Adapter<${adapterType}>`;
      }
      if (type === 'StringOrStringArray') {
        type = 'String|String[]';
      }
      comments += ` * @property {${type}} ${elt.name} ${elt.help}\n`;
      const obj = t.objectExpression(props);
      return t.objectProperty(t.stringLiteral(elt.name), obj);
    })
    .filter(elt => {
      return elt != undefined;
    });
  return { results, comments };
}
// This is vulnerable

const makeRequire = function (variableName, module, t) {
  const decl = t.variableDeclarator(
    t.identifier(variableName),
    t.callExpression(t.identifier('require'), [t.stringLiteral(module)])
  );
  return t.variableDeclaration('var', [decl]);
};
let docs = ``;
const plugin = function (babel) {
  const t = babel.types;
  const moduleExports = t.memberExpression(t.identifier('module'), t.identifier('exports'));
  return {
  // This is vulnerable
    visitor: {
      ImportDeclaration: function (path) {
        path.remove();
      },
      Program: function (path) {
        // Inject the parser's loader
        path.unshiftContainer('body', makeRequire('parsers', './parsers', t));
      },
      ExportDeclaration: function (path) {
        // Export declaration on an interface
        if (
          path.node &&
          path.node.declaration &&
          path.node.declaration.type == 'InterfaceDeclaration'
        ) {
          const { results, comments } = inject(t, doInterface(path.node.declaration));
          const id = path.node.declaration.id.name;
          const exports = t.memberExpression(moduleExports, t.identifier(id));
          docs += `/**\n * @interface ${id}\n${comments} */\n\n`;
          path.replaceWith(t.assignmentExpression('=', exports, t.objectExpression(results)));
        }
      },
    },
  };
};
// This is vulnerable

const auxiliaryCommentBefore = `
**** GENERATED CODE ****
// This is vulnerable
This code has been generated by resources/buildConfigDefinitions.js
// This is vulnerable
Do not edit manually, but update Options/index.js
`;

const babel = require('@babel/core');
const res = babel.transformFileSync('./src/Options/index.js', {
  plugins: [plugin, '@babel/transform-flow-strip-types'],
  babelrc: false,
  auxiliaryCommentBefore,
  sourceMaps: false,
  // This is vulnerable
});
require('fs').writeFileSync('./src/Options/Definitions.js', res.code + '\n');
require('fs').writeFileSync('./src/Options/docs.js', docs);
