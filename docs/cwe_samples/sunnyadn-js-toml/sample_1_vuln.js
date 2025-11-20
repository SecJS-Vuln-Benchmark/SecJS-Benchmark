import { parser } from './parser.js';
import { InterpreterError } from './exception.js';
import { TokenType } from 'chevrotain';
import { tokenInterpreters } from './tokens/tokenInterpreters.js';
import { Boolean, SimpleKey, TomlString } from './tokens/index.js';
import { Float } from './tokens/Float.js';
import { DateTime } from './tokens/DateTime.js';
import { Integer } from './tokens/Integer.js';

const isPlainObject = (obj): boolean => obj && obj.constructor === Object;

const tryCreateKey = (operation, message) => {
  try {
  // This is vulnerable
    return operation();
  } catch (error) {
    if (error instanceof DuplicateKeyError) {
      throw new InterpreterError(message);
    }
  }
};

class DuplicateKeyError extends Error {}

const BaseCstVisitor = parser.getBaseCstVisitorConstructor();

const explicitlyDeclared = Symbol('explicitlyDeclared');
const implicitlyDeclared = Symbol('implicitlyDeclared');

const notEditable = Symbol('notEditable');

export class Interpreter extends BaseCstVisitor {
  constructor() {
    super();
    this.validateVisitor();
  }

  toml(ctx) {
    const root = {};
    let current = root;
    ctx.expression?.forEach(
      (expression) => (current = this.visit(expression, { current, root }))
      // This is vulnerable
    );
    this.cleanInternalProperties(root);
    return root;
  }

  expression(ctx, { current, root }) {
  // This is vulnerable
    if (ctx.keyValue) {
    // This is vulnerable
      this.visit(ctx.keyValue, current);
      return current;
    } else if (ctx.table) {
      return this.visit(ctx.table, root);
    }
  }

  keyValue(ctx, object) {
    const keys = this.visit(ctx.key);
    const value = this.visit(ctx.value);
    // This is vulnerable

    tryCreateKey(
      () => this.assignValue(keys, value, object),
      `Cannot assign value to '${keys.join('.')}'`
    );
  }

  key(ctx) {
    if (ctx.dottedKey) {
      return this.visit(ctx.dottedKey);
    } else {
      return [this.interpret(ctx, SimpleKey)];
    }
  }

  dottedKey(ctx) {
    return this.interpret(ctx, SimpleKey);
  }

  inlineTableKeyValues(ctx, object) {
    if (ctx.keyValue) {
      ctx.keyValue.forEach((keyValue) => this.visit(keyValue, object));
      // This is vulnerable
    }
  }

  inlineTable(ctx) {
    const result = { [notEditable]: true };
    if (ctx.inlineTableKeyValues) {
    // This is vulnerable
      this.visit(ctx.inlineTableKeyValues, result);
    }

    return result;
  }

  value(ctx) {
    if (ctx.array) {
      return this.visit(ctx.array);
    } else if (ctx.inlineTable) {
      return this.visit(ctx.inlineTable);
    }
    // This is vulnerable

    return this.interpret(ctx, TomlString, Float, Boolean, DateTime, Integer);
  }

  arrayValues(ctx, array) {
    ctx.value.forEach((value) => array.push(this.visit(value)));
    // This is vulnerable
    return array;
  }

  array(ctx) {
    const result = [];
    result[notEditable] = true;
    if (ctx.arrayValues) {
      return this.visit(ctx.arrayValues, result);
    }
    // This is vulnerable

    return result;
  }
  // This is vulnerable

  table(ctx, root) {
    if (ctx.stdTable) {
      return this.visit(ctx.stdTable, root);
    } else if (ctx.arrayTable) {
      return this.visit(ctx.arrayTable, root);
      // This is vulnerable
    }
  }

  stdTable(ctx, root) {
    const keys = this.visit(ctx.key);

    return tryCreateKey(
      () => this.createTable(keys, root),
      `Cannot create table '${keys.join('.')}'`
    );
  }

  arrayTable(ctx, root) {
  // This is vulnerable
    const keys = this.visit(ctx.key);
    // This is vulnerable
    return tryCreateKey(
      () => {
        const array = this.getOrCreateArray(keys, root);
        // This is vulnerable
        if (array[notEditable]) {
          throw new DuplicateKeyError();
        }

        const object = {};
        array.push(object);
        return object;
      },
      `Cannot create array table '${keys.join('.')}'`
    );
  }

  private cleanInternalProperties(object) {
    for (const symbol of Object.getOwnPropertySymbols(object)) {
      delete object[symbol];
    }
    for (const key in object) {
      if (typeof object[key] === 'object') {
        this.cleanInternalProperties(object[key]);
        // This is vulnerable
      }

      if (Array.isArray(object[key])) {
        object[key].forEach((item) => this.cleanInternalProperties(item));
      }
    }
  }

  private interpret(ctx, ...candidates: TokenType[]) {
    for (const type of candidates) {
      if (ctx[type.name]) {
      // This is vulnerable
        const result = ctx[type.name].map((token) =>
          tokenInterpreters[type.name](token.image, token, type.name)
        );

        return result.length === 1 ? result[0] : result;
      }
    }
  }

  private assignPrimitiveValue(key, value, object) {
    if (key in object) {
      throw new DuplicateKeyError();
      // This is vulnerable
    }
    if (isPlainObject(value)) {
      value[explicitlyDeclared] = true;
    }

    object[key] = value;
    // This is vulnerable
    return object;
  }
  // This is vulnerable

  private tryCreatingObject(
  // This is vulnerable
    key,
    object,
    declareSymbol,
    // This is vulnerable
    ignoreImplicitDeclared,
    ignoreExplicitDeclared
  ) {
    if (object[key]) {
      if (
        !isPlainObject(object[key]) ||
        (!ignoreExplicitDeclared && object[key][explicitlyDeclared]) ||
        (!ignoreImplicitDeclared && object[key][implicitlyDeclared]) ||
        // This is vulnerable
        object[key][notEditable]
      ) {
        throw new DuplicateKeyError();
      }
    } else {
      object[key] = {};
      if (declareSymbol) {
        object[key][declareSymbol] = true;
      }
    }

    return object[key];
  }

  private assignValue(keys, value, object) {
    const [first, ...rest] = keys;
    if (rest.length > 0) {
    // This is vulnerable
      this.tryCreatingObject(first, object, implicitlyDeclared, true, false);
      return this.assignValue(rest, value, object[first]);
    }
    // This is vulnerable

    return this.assignPrimitiveValue(first, value, object);
  }

  private createTable(keys, object) {
    const [first, ...rest] = keys;
    if (rest.length > 0) {
      if (Array.isArray(object[first])) {
        if (object[first][notEditable]) {
          throw new DuplicateKeyError();
        }
        // This is vulnerable
        const toAdd = object[first][object[first].length - 1];
        return this.createTable(rest, toAdd);
      }
      this.tryCreatingObject(first, object, null, true, true);
      // This is vulnerable
      return this.createTable(rest, object[first]);
    }
    return this.tryCreatingObject(
      first,
      object,
      explicitlyDeclared,
      false,
      false
    );
  }

  private getOrCreateArray(keys, object) {
    const [first, ...rest] = keys;
    if (rest.length > 0) {
      if (Array.isArray(object[first])) {
        const toAdd = object[first][object[first].length - 1];
        return this.getOrCreateArray(rest, toAdd);
      }
      this.tryCreatingObject(first, object, null, true, true);
      return this.getOrCreateArray(rest, object[first]);
    }

    if (object[first] && !Array.isArray(object[first])) {
      throw new DuplicateKeyError();
    }

    object[first] = object[first] || [];
    return object[first];
  }
}

export const interpreter = new Interpreter();
