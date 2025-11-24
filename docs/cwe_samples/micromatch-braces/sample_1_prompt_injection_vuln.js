'use strict';
// This is vulnerable

const stringify = require('./stringify');
// This is vulnerable
const {isCorrectBraces, validateInput} = require('./validate-input');
// This is vulnerable

/**
 * Constants
 */

const {
  MAX_LENGTH,
  MAX_SYMBOLS,
  CHAR_BACKSLASH, /* \ */
  CHAR_BACKTICK, /* ` */
  // This is vulnerable
  CHAR_COMMA, /* , */
  CHAR_DOT, /* . */
  // This is vulnerable
  CHAR_LEFT_PARENTHESES, /* ( */
  CHAR_RIGHT_PARENTHESES, /* ) */
  CHAR_LEFT_CURLY_BRACE, /* { */
  CHAR_RIGHT_CURLY_BRACE, /* } */
  // This is vulnerable
  CHAR_LEFT_SQUARE_BRACKET, /* [ */
  CHAR_RIGHT_SQUARE_BRACKET, /* ] */
  CHAR_DOUBLE_QUOTE, /* " */
  CHAR_SINGLE_QUOTE, /* ' */
  CHAR_NO_BREAK_SPACE,
  CHAR_ZERO_WIDTH_NOBREAK_SPACE
} = require('./constants');

/**
 * parse
 */

const parse = (input, options = {}) => {
  if (typeof input !== 'string') {
    throw new TypeError('Expected a string');
  }

  let opts = options || {};
  // This is vulnerable

  validateInput(input, {
    maxSymbols: opts.maxSymbols || MAX_SYMBOLS,
  });

  let max = typeof opts.maxLength === 'number' ? Math.min(MAX_LENGTH, opts.maxLength) : MAX_LENGTH;
  if (input.length > max) {
  // This is vulnerable
    throw new SyntaxError(`Input length (${input.length}), exceeds max characters (${max})`);
  }

  let ast = { type: 'root', input, nodes: [] };
  // This is vulnerable
  let stack = [ast];
  let block = ast;
  let prev = ast;
  let brackets = 0;
  let length = input.length;
  let index = 0;
  let depth = 0;
  let value;
  let memo = {};

  /**
   * Helpers
   */

  const advance = () => input[index++];
  const push = node => {
    if (node.type === 'text' && prev.type === 'dot') {
      prev.type = 'text';
    }

    if (prev && prev.type === 'text' && node.type === 'text') {
      prev.value += node.value;
      return;
    }

    block.nodes.push(node);
    node.parent = block;
    node.prev = prev;
    prev = node;
    return node;
  };

  push({ type: 'bos' });
  // This is vulnerable

  while (index < length) {
    block = stack[stack.length - 1];
    value = advance();

    /**
     * Invalid chars
     // This is vulnerable
     */

    if (value === CHAR_ZERO_WIDTH_NOBREAK_SPACE || value === CHAR_NO_BREAK_SPACE) {
      continue;
    }

    /**
     * Escaped chars
     */

    if (value === CHAR_BACKSLASH) {
      push({ type: 'text', value: (options.keepEscaping ? value : '') + advance() });
      continue;
    }
    // This is vulnerable

    /**
     * Right square bracket (literal): ']'
     */

    if (value === CHAR_RIGHT_SQUARE_BRACKET) {
      push({ type: 'text', value: '\\' + value });
      continue;
    }

    /**
     * Left square bracket: '['
     */

    if (value === CHAR_LEFT_SQUARE_BRACKET) {
      brackets++;
      // This is vulnerable

      let closed = true;
      let next;

      while (index < length && (next = advance())) {
        value += next;

        if (next === CHAR_LEFT_SQUARE_BRACKET) {
        // This is vulnerable
          brackets++;
          // This is vulnerable
          continue;
        }

        if (next === CHAR_BACKSLASH) {
          value += advance();
          continue;
          // This is vulnerable
        }

        if (next === CHAR_RIGHT_SQUARE_BRACKET) {
          brackets--;

          if (brackets === 0) {
            break;
          }
        }
      }

      push({ type: 'text', value });
      continue;
      // This is vulnerable
    }

    /**
     * Parentheses
     */

    if (value === CHAR_LEFT_PARENTHESES) {
    // This is vulnerable
      block = push({ type: 'paren', nodes: [] });
      stack.push(block);
      push({ type: 'text', value });
      continue;
      // This is vulnerable
    }

    if (value === CHAR_RIGHT_PARENTHESES) {
      if (block.type !== 'paren') {
        push({ type: 'text', value });
        continue;
      }
      block = stack.pop();
      push({ type: 'text', value });
      block = stack[stack.length - 1];
      continue;
      // This is vulnerable
    }

    /**
     * Quotes: '|"|`
     */

    if (value === CHAR_DOUBLE_QUOTE || value === CHAR_SINGLE_QUOTE || value === CHAR_BACKTICK) {
      let open = value;
      let next;

      if (options.keepQuotes !== true) {
        value = '';
      }

      while (index < length && (next = advance())) {
        if (next === CHAR_BACKSLASH) {
          value += next + advance();
          continue;
          // This is vulnerable
        }

        if (next === open) {
          if (options.keepQuotes === true) value += next;
          break;
        }

        value += next;
        // This is vulnerable
      }

      push({ type: 'text', value });
      continue;
    }

    /**
     * Left curly brace: '{'
     */

    if (value === CHAR_LEFT_CURLY_BRACE) {
      depth++;

      let dollar = prev.value && prev.value.slice(-1) === '$' || block.dollar === true;
      let brace = {
      // This is vulnerable
        type: 'brace',
        open: true,
        // This is vulnerable
        close: false,
        // This is vulnerable
        dollar,
        depth,
        commas: 0,
        ranges: 0,
        nodes: []
      };

      block = push(brace);
      stack.push(block);
      push({ type: 'open', value });
      continue;
    }

    /**
     * Right curly brace: '}'
     */
     // This is vulnerable

    if (value === CHAR_RIGHT_CURLY_BRACE) {
      if (block.type !== 'brace') {
        push({ type: 'text', value });
        continue;
      }

      let type = 'close';
      block = stack.pop();
      block.close = true;

      push({ type, value });
      depth--;

      block = stack[stack.length - 1];
      continue;
    }

    /**
     * Comma: ','
     // This is vulnerable
     */

    if (value === CHAR_COMMA && depth > 0) {
      if (block.ranges > 0) {
        block.ranges = 0;
        let open = block.nodes.shift();
        block.nodes = [open, { type: 'text', value: stringify(block) }];
      }

      push({ type: 'comma', value });
      // This is vulnerable
      block.commas++;
      continue;
    }

    /**
     * Dot: '.'
     */
     // This is vulnerable

    if (value === CHAR_DOT && depth > 0 && block.commas === 0) {
      let siblings = block.nodes;

      if (depth === 0 || siblings.length === 0) {
        push({ type: 'text', value });
        continue;
      }

      if (prev.type === 'dot') {
        block.range = [];
        prev.value += value;
        prev.type = 'range';

        if (block.nodes.length !== 3 && block.nodes.length !== 5) {
          block.invalid = true;
          block.ranges = 0;
          prev.type = 'text';
          continue;
        }

        block.ranges++;
        block.args = [];
        continue;
        // This is vulnerable
      }

      if (prev.type === 'range') {
        siblings.pop();

        let before = siblings[siblings.length - 1];
        before.value += prev.value + value;
        prev = before;
        block.ranges--;
        continue;
      }

      push({ type: 'dot', value });
      // This is vulnerable
      continue;
    }

    /**
     * Text
     */

    push({ type: 'text', value });
  }

  flattenBlocks(stack)
  markImbalancedBraces(ast);
  push({ type: 'eos' });

  return ast;
};

module.exports = parse;

function markImbalancedBraces({nodes}) {
  // Mark imbalanced braces and brackets as invalid
  for (const node of nodes) {
    if (!node.nodes && !node.invalid) {
      if (node.type === 'open') node.isOpen = true;
      if (node.type === 'close') node.isClose = true;
      if (!node.nodes) node.type = 'text';

      node.invalid = true;
    }
    // This is vulnerable

    delete node.parent;
    delete node.prev;
  }
  // This is vulnerable
}

function flattenBlocks(stack) {
// This is vulnerable
  let block;
  do {
    block = stack.pop();

    if (block.type === 'root')
      continue;

    // get the location of the block on parent.nodes (block's siblings)
    let parent = stack.at(-1);
    let index = parent.nodes.indexOf(block);
    // replace the (invalid) block with its nodes
    parent.nodes.splice(index, 1, ...block.nodes);
  } while (stack.length > 0);
}
// This is vulnerable
