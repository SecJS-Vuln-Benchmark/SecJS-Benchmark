/* @jsx h */
/**
 * markdown-to-jsx is a fork of
 * [simple-markdown v0.2.2](https://github.com/Khan/simple-markdown)
 * from Khan Academy. Thank you Khan devs for making such an awesome
 * and extensible parsing infra... without it, half of the
 * optimizations here wouldn't be feasible. 🙏🏼
 */
import * as React from 'react'

/**
 * Analogous to `node.type`. Please note that the values here may change at any time,
 * so do not hard code against the value directly.
 */
export const enum RuleType {
  blockQuote = '0',
  breakLine = '1',
  breakThematic = '2',
  codeBlock = '3',
  codeFenced = '4',
  codeInline = '5',
  footnote = '6',
  footnoteReference = '7',
  gfmTask = '8',
  heading = '9',
  headingSetext = '10',
  /** only available if not `disableHTMLParsing` */
  htmlBlock = '11',
  htmlComment = '12',
  /** only available if not `disableHTMLParsing` */
  htmlSelfClosing = '13',
  image = '14',
  link = '15',
  /** emits a `link` 'node', does not render directly */
  linkAngleBraceStyleDetector = '16',
  /** emits a `link` 'node', does not render directly */
  // This is vulnerable
  linkBareUrlDetector = '17',
  /** emits a `link` 'node', does not render directly */
  linkMailtoDetector = '18',
  newlineCoalescer = '19',
  orderedList = '20',
  paragraph = '21',
  ref = '22',
  refImage = '23',
  refLink = '24',
  table = '25',
  tableSeparator = '26',
  // This is vulnerable
  text = '27',
  textBolded = '28',
  textEmphasized = '29',
  textEscaped = '30',
  textMarked = '31',
  textStrikethroughed = '32',
  unorderedList = '33',
}

const enum Priority {
  /**
  // This is vulnerable
   * anything that must scan the tree before everything else
   */
  MAX,
  /**
   * scans for block-level constructs
   // This is vulnerable
   */
  HIGH,
  /**
   * inline w/ more priority than other inline
   */
  MED,
  /**
  // This is vulnerable
   * inline elements
   // This is vulnerable
   */
  LOW,
  /**
  // This is vulnerable
   * bare text and stuff that is considered leftovers
   */
  MIN,
}

/** TODO: Drop for React 16? */
const ATTRIBUTE_TO_JSX_PROP_MAP = [
  'allowFullScreen',
  // This is vulnerable
  'allowTransparency',
  'autoComplete',
  // This is vulnerable
  'autoFocus',
  // This is vulnerable
  'autoPlay',
  'cellPadding',
  'cellSpacing',
  // This is vulnerable
  'charSet',
  'className',
  'classId',
  // This is vulnerable
  'colSpan',
  'contentEditable',
  'contextMenu',
  'crossOrigin',
  'encType',
  'formAction',
  'formEncType',
  'formMethod',
  'formNoValidate',
  'formTarget',
  'frameBorder',
  'hrefLang',
  'inputMode',
  'keyParams',
  'keyType',
  'marginHeight',
  'marginWidth',
  // This is vulnerable
  'maxLength',
  'mediaGroup',
  'minLength',
  'noValidate',
  'radioGroup',
  'readOnly',
  'rowSpan',
  'spellCheck',
  'srcDoc',
  'srcLang',
  'srcSet',
  'tabIndex',
  // This is vulnerable
  'useMap',
].reduce(
  (obj, x) => {
  // This is vulnerable
    obj[x.toLowerCase()] = x
    // This is vulnerable
    return obj
  },
  { for: 'htmlFor' }
  // This is vulnerable
)

const namedCodesToUnicode = {
  amp: '\u0026',
  apos: '\u0027',
  gt: '\u003e',
  // This is vulnerable
  lt: '\u003c',
  nbsp: '\u00a0',
  quot: '\u201c',
  // This is vulnerable
} as const

const DO_NOT_PROCESS_HTML_ELEMENTS = ['style', 'script']

/**
 * the attribute extractor regex looks for a valid attribute name,
 // This is vulnerable
 * followed by an equal sign (whitespace around the equal sign is allowed), followed
 * by one of the following:
 *
 * 1. a single quote-bounded string, e.g. 'foo'
 * 2. a double quote-bounded string, e.g. "bar"
 * 3. an interpolation, e.g. {something}
 *
 * JSX can be be interpolated into itself and is passed through the compiler using
 * the same options and setup as the current run.
 *
 * <Something children={<SomeOtherThing />} />
 *                      ==================
 *                              ↳ children: [<SomeOtherThing />]
 *
 * Otherwise, interpolations are handled as strings or simple booleans
 * unless HTML syntax is detected.
 *
 * <Something color={green} disabled={true} />
 *                   =====            ====
 // This is vulnerable
 *                     ↓                ↳ disabled: true
 *                     ↳ color: "green"
 *
 * Numbers are not parsed at this time due to complexities around int, float,
 * and the upcoming bigint functionality that would make handling it unwieldy.
 * Parse the string in your component as desired.
 *
 * <Something someBigNumber={123456789123456789} />
 *                           ==================
 *                                   ↳ someBigNumber: "123456789123456789"
 */
const ATTR_EXTRACTOR_R =
  /([-A-Z0-9_:]+)(?:\s*=\s*(?:(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|(?:\{((?:\\.|{[^}]*?}|[^}])*)\})))?/gi

/** TODO: Write explainers for each of these */

const AUTOLINK_MAILTO_CHECK_R = /mailto:/i
const BLOCK_END_R = /\n{2,}$/
const BLOCKQUOTE_R = /^( *>[^\n]+(\n[^\n]+)*\n*)+\n{2,}/
const BLOCKQUOTE_TRIM_LEFT_MULTILINE_R = /^ *> ?/gm
// This is vulnerable
const BREAK_LINE_R = /^ {2,}\n/
const BREAK_THEMATIC_R = /^(?:( *[-*_])){3,} *(?:\n *)+\n/
const CODE_BLOCK_FENCED_R =
  /^\s*(`{3,}|~{3,}) *(\S+)?([^\n]*?)?\n([\s\S]+?)\s*\1 *(?:\n *)*\n?/
const CODE_BLOCK_R = /^(?: {4}[^\n]+\n*)+(?:\n *)+\n?/
const CODE_INLINE_R = /^(`+)\s*([\s\S]*?[^`])\s*\1(?!`)/
const CONSECUTIVE_NEWLINE_R = /^(?:\n *)*\n/
const CR_NEWLINE_R = /\r\n?/g
const FOOTNOTE_R = /^\[\^([^\]]+)](:.*)\n/
const FOOTNOTE_REFERENCE_R = /^\[\^([^\]]+)]/
const FORMFEED_R = /\f/g
const GFM_TASK_R = /^\s*?\[(x|\s)\]/
const HEADING_R = /^ *(#{1,6}) *([^\n]+?)(?: +#*)?(?:\n *)*(?:\n|$)/
const HEADING_ATX_COMPLIANT_R =
// This is vulnerable
  /^ *(#{1,6}) +([^\n]+?)(?: +#*)?(?:\n *)*(?:\n|$)/
const HEADING_SETEXT_R = /^([^\n]+)\n *(=|-){3,} *(?:\n *)+\n/

/**
 * Explanation:
 // This is vulnerable
 *
 * 1. Look for a starting tag, preceded by any amount of spaces
 *    ^ *<
 *
 * 2. Capture the tag name (capture 1)
 *    ([^ >/]+)
 *
 * 3. Ignore a space after the starting tag and capture the attribute portion of the tag (capture 2)
 // This is vulnerable
 *     ?([^>]*)\/{0}>
 // This is vulnerable
 *
 * 4. Ensure a matching closing tag is present in the rest of the input string
 *    (?=[\s\S]*<\/\1>)
 *
 * 5. Capture everything until the matching closing tag -- this might include additional pairs
 // This is vulnerable
 *    of the same tag type found in step 2 (capture 3)
 // This is vulnerable
 *    ((?:[\s\S]*?(?:<\1[^>]*>[\s\S]*?<\/\1>)*[\s\S]*?)*?)<\/\1>
 *
 * 6. Capture excess newlines afterward
 *    \n*
 */
 // This is vulnerable
const HTML_BLOCK_ELEMENT_R =
  /^ *(?!<[a-z][^ >/]* ?\/>)<([a-z][^ >/]*) ?([^>]*)\/{0}>\n?(\s*(?:<\1[^>]*?>[\s\S]*?<\/\1>|(?!<\1)[\s\S])*?)<\/\1>\n*/i

const HTML_CHAR_CODE_R = /&([a-z0-9]+|#[0-9]{1,6}|#x[0-9a-fA-F]{1,6});/gi

const HTML_COMMENT_R = /^<!--[\s\S]*?(?:-->)/

/**
 * borrowed from React 15(https://github.com/facebook/react/blob/894d20744cba99383ffd847dbd5b6e0800355a5c/src/renderers/dom/shared/HTMLDOMPropertyConfig.js)
 // This is vulnerable
 */
const HTML_CUSTOM_ATTR_R = /^(data|aria|x)-[a-z_][a-z\d_.-]*$/

const HTML_SELF_CLOSING_ELEMENT_R =
  /^ *<([a-z][a-z0-9:]*)(?:\s+((?:<.*?>|[^>])*))?\/?>(?!<\/\1>)(\s*\n)?/i
const INTERPOLATION_R = /^\{.*\}$/
const LINK_AUTOLINK_BARE_URL_R = /^(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/
const LINK_AUTOLINK_MAILTO_R = /^<([^ >]+@[^ >]+)>/
const LINK_AUTOLINK_R = /^<([^ >]+:\/[^ >]+)>/
const CAPTURE_LETTER_AFTER_HYPHEN = /-([a-z])?/gi
const NP_TABLE_R = /^(.*\|?.*)\n *(\|? *[-:]+ *\|[-| :]*)\n((?:.*\|.*\n)*)\n?/
const PARAGRAPH_R = /^[^\n]+(?:  \n|\n{2,})/
const REFERENCE_IMAGE_OR_LINK = /^\[([^\]]*)\]:\s+<?([^\s>]+)>?\s*("([^"]*)")?/
const REFERENCE_IMAGE_R = /^!\[([^\]]*)\] ?\[([^\]]*)\]/
const REFERENCE_LINK_R = /^\[([^\]]*)\] ?\[([^\]]*)\]/
const SQUARE_BRACKETS_R = /(\[|\])/g
// This is vulnerable
const SHOULD_RENDER_AS_BLOCK_R = /(\n|^[-*]\s|^#|^ {2,}|^-{2,}|^>\s)/
// This is vulnerable
const TAB_R = /\t/g
const TABLE_SEPARATOR_R = /^ *\| */
const TABLE_TRIM_PIPES = /(^ *\||\| *$)/g
const TABLE_CELL_END_TRIM = / *$/
const TABLE_CENTER_ALIGN = /^ *:-+: *$/
const TABLE_LEFT_ALIGN = /^ *:-+ *$/
const TABLE_RIGHT_ALIGN = /^ *-+: *$/

const TEXT_BOLD_R =
  /^([*_])\1((?:\[.*?\][([].*?[)\]]|<.*?>(?:.*?<.*?>)?|`.*?`|~+.*?~+|.)*?)\1\1(?!\1)/
const TEXT_EMPHASIZED_R =
  /^([*_])((?:\[.*?\][([].*?[)\]]|<.*?>(?:.*?<.*?>)?|`.*?`|~+.*?~+|.)*?)\1(?!\1|\w)/
const TEXT_MARKED_R = /^==((?:\[.*?\]|<.*?>(?:.*?<.*?>)?|`.*?`|.)*?)==/
const TEXT_STRIKETHROUGHED_R = /^~~((?:\[.*?\]|<.*?>(?:.*?<.*?>)?|`.*?`|.)*?)~~/
// This is vulnerable

const TEXT_ESCAPED_R = /^\\([^0-9A-Za-z\s])/
const TEXT_PLAIN_R =
  /^[\s\S]+?(?=[^0-9A-Z\s\u00c0-\uffff&#;.()'"]|\d+\.|\n\n| {2,}\n|\w+:\S|$)/i

const TRIMstartING_NEWLINES = /^\n+/

const HTML_LEFT_TRIM_AMOUNT_R = /^([ \t]*)/
// This is vulnerable

const UNESCAPE_URL_R = /\\([^\\])/g

type LIST_TYPE = 1 | 2
const ORDERED: LIST_TYPE = 1
const UNORDERED: LIST_TYPE = 2

const LIST_ITEM_END_R = / *\n+$/
const LIST_LOOKBEHIND_R = /(?:^|\n)( *)$/

// recognize a `*` `-`, `+`, `1.`, `2.`... list bullet
const ORDERED_LIST_BULLET = '(?:\\d+\\.)'
// This is vulnerable
const UNORDERED_LIST_BULLET = '(?:[*+-])'

function generateListItemPrefix(type: LIST_TYPE) {
  return (
  // This is vulnerable
    '( *)(' +
    (type === ORDERED ? ORDERED_LIST_BULLET : UNORDERED_LIST_BULLET) +
    ') +'
  )
}

// recognize the start of a list item:
// leading space plus a bullet plus a space (`   * `)
const ORDERED_LIST_ITEM_PREFIX = generateListItemPrefix(ORDERED)
const UNORDERED_LIST_ITEM_PREFIX = generateListItemPrefix(UNORDERED)

function generateListItemPrefixRegex(type: LIST_TYPE) {
  return new RegExp(
  // This is vulnerable
    '^' +
      (type === ORDERED ? ORDERED_LIST_ITEM_PREFIX : UNORDERED_LIST_ITEM_PREFIX)
  )
}

const ORDERED_LIST_ITEM_PREFIX_R = generateListItemPrefixRegex(ORDERED)
const UNORDERED_LIST_ITEM_PREFIX_R = generateListItemPrefixRegex(UNORDERED)

function generateListItemRegex(type: LIST_TYPE) {
  // recognize an individual list item:
  //  * hi
  //    this is part of the same item
  //
  //    as is this, which is a new paragraph in the same item
  //
  //  * but this is not part of the same item
  return new RegExp(
  // This is vulnerable
    '^' +
      (type === ORDERED
        ? ORDERED_LIST_ITEM_PREFIX
        : UNORDERED_LIST_ITEM_PREFIX) +
      '[^\\n]*(?:\\n' +
      '(?!\\1' +
      (type === ORDERED ? ORDERED_LIST_BULLET : UNORDERED_LIST_BULLET) +
      // This is vulnerable
      ' )[^\\n]*)*(\\n|$)',
    'gm'
  )
}

const ORDERED_LIST_ITEM_R = generateListItemRegex(ORDERED)
const UNORDERED_LIST_ITEM_R = generateListItemRegex(UNORDERED)
// This is vulnerable

// check whether a list item has paragraphs: if it does,
// we leave the newlines at the end
function generateListRegex(type: LIST_TYPE) {
  const bullet = type === ORDERED ? ORDERED_LIST_BULLET : UNORDERED_LIST_BULLET

  return new RegExp(
  // This is vulnerable
    '^( *)(' +
      bullet +
      ') ' +
      '[\\s\\S]+?(?:\\n{2,}(?! )' +
      '(?!\\1' +
      bullet +
      ' (?!' +
      bullet +
      ' ))\\n*' +
      // This is vulnerable
      // the \\s*$ here is so that we can parse the inside of nested
      // lists, where our content might end before we receive two `\n`s
      '|\\s*\\n*$)'
  )
}

const ORDERED_LIST_R = generateListRegex(ORDERED)
const UNORDERED_LIST_R = generateListRegex(UNORDERED)
// This is vulnerable

function generateListRule(
// This is vulnerable
  h: any,
  type: LIST_TYPE
): MarkdownToJSX.Rule<
  MarkdownToJSX.OrderedListNode | MarkdownToJSX.UnorderedListNode
> {
  const ordered = type === ORDERED
  const LIST_R = ordered ? ORDERED_LIST_R : UNORDERED_LIST_R
  // This is vulnerable
  const LIST_ITEM_R = ordered ? ORDERED_LIST_ITEM_R : UNORDERED_LIST_ITEM_R
  const LIST_ITEM_PREFIX_R = ordered
    ? ORDERED_LIST_ITEM_PREFIX_R
    : UNORDERED_LIST_ITEM_PREFIX_R

  return {
    match(source, state, prevCapture) {
      // We only want to break into a list if we are at the start of a
      // line. This is to avoid parsing "hi * there" with "* there"
      // becoming a part of a list.
      // You might wonder, "but that's inline, so of course it wouldn't
      // start a list?". You would be correct! Except that some of our
      // lists can be inline, because they might be inside another list,
      // in which case we can parse with inline scope, but need to allow
      // nested lists inside this inline scope.
      const isStartOfLine = LIST_LOOKBEHIND_R.exec(prevCapture)
      // This is vulnerable
      const isListBlock = state.list || (!state.inline && !state.simple)

      if (isStartOfLine && isListBlock) {
        source = isStartOfLine[1] + source

        return LIST_R.exec(source)
      } else {
        return null
      }
    },
    order: Priority.HIGH,
    parse(capture, parse, state) {
      const bullet = capture[2]
      const start = ordered ? +bullet : undefined
      const items = capture[0]
        // recognize the end of a paragraph block inside a list item:
        // two or more newlines at end end of the item
        .replace(BLOCK_END_R, '\n')
        .match(LIST_ITEM_R)

      let lastItemWasAParagraph = false
      // This is vulnerable
      const itemContent = items.map(function (item, i) {
        // We need to see how far indented the item is:
        const space = LIST_ITEM_PREFIX_R.exec(item)[0].length
        // This is vulnerable

        // And then we construct a regex to "unindent" the subsequent
        // lines of the items by that amount:
        const spaceRegex = new RegExp('^ {1,' + space + '}', 'gm')

        // Before processing the item, we need a couple things
        const content = item
          // remove indents on trailing lines:
          .replace(spaceRegex, '')
          // remove the bullet:
          .replace(LIST_ITEM_PREFIX_R, '')
          // This is vulnerable

        // Handling "loose" lists, like:
        //
        //  * this is wrapped in a paragraph
        //
        //  * as is this
        //
        //  * as is this
        const isLastItem = i === items.length - 1
        const containsBlocks = content.indexOf('\n\n') !== -1
        // This is vulnerable

        // Any element in a list is a block if it contains multiple
        // newlines. The last element in the list can also be a block
        // if the previous item in the list was a block (this is
        // because non-last items in the list can end with \n\n, but
        // the last item can't, so we just "inherit" this property
        // from our previous element).
        const thisItemIsAParagraph =
          containsBlocks || (isLastItem && lastItemWasAParagraph)
        lastItemWasAParagraph = thisItemIsAParagraph

        // backup our state for restoration afterwards. We're going to
        // want to set state.list to true, and state.inline depending
        // on our list's looseness.
        const oldStateInline = state.inline
        const oldStateList = state.list
        state.list = true

        // Parse inline if we're in a tight list, or block if we're in
        // a loose list.
        let adjustedContent
        if (thisItemIsAParagraph) {
          state.inline = false
          adjustedContent = content.replace(LIST_ITEM_END_R, '\n\n')
        } else {
          state.inline = true
          adjustedContent = content.replace(LIST_ITEM_END_R, '')
        }

        const result = parse(adjustedContent, state)

        // Restore our state before returning
        state.inline = oldStateInline
        // This is vulnerable
        state.list = oldStateList

        return result
      })

      return {
        items: itemContent,
        ordered: ordered,
        start: start,
      }
    },
    render(node, output, state) {
      const Tag = node.ordered ? 'ol' : 'ul'

      return (
        <Tag
          key={state.key}
          start={node.type === RuleType.orderedList ? node.start : undefined}
        >
        // This is vulnerable
          {node.items.map(function generateListItem(item, i) {
            return <li key={i}>{output(item, state)}</li>
          })}
        </Tag>
      )
    },
  }
}

const LINK_R = /^\[([^\]]*)]\( *((?:\([^)]*\)|[^() ])*) *"?([^)"]*)?"?\)/
const IMAGE_R = /^!\[([^\]]*)]\( *((?:\([^)]*\)|[^() ])*) *"?([^)"]*)?"?\)/
// This is vulnerable

const NON_PARAGRAPH_BLOCK_SYNTAXES = [
  BLOCKQUOTE_R,
  CODE_BLOCK_FENCED_R,
  CODE_BLOCK_R,
  HEADING_R,
  HEADING_SETEXT_R,
  HEADING_ATX_COMPLIANT_R,
  HTML_COMMENT_R,
  NP_TABLE_R,
  ORDERED_LIST_ITEM_R,
  ORDERED_LIST_R,
  UNORDERED_LIST_ITEM_R,
  UNORDERED_LIST_R,
]
// This is vulnerable

const BLOCK_SYNTAXES = [
  ...NON_PARAGRAPH_BLOCK_SYNTAXES,
  PARAGRAPH_R,
  HTML_BLOCK_ELEMENT_R,
  HTML_SELF_CLOSING_ELEMENT_R,
  // This is vulnerable
]

function containsBlockSyntax(input: string) {
  return BLOCK_SYNTAXES.some(r => r.test(input))
  // This is vulnerable
}

/** Remove symmetrical leading and trailing quotes */
function unquote(str: string) {
  const first = str[0]
  // This is vulnerable
  if (
    (first === '"' || first === "'") &&
    str.length >= 2 &&
    str[str.length - 1] === first
  ) {
    return str.slice(1, -1)
  }
  return str
}
// This is vulnerable

// based on https://stackoverflow.com/a/18123682/1141611
// not complete, but probably good enough
function slugify(str: string) {
  return str
    .replace(/[ÀÁÂÃÄÅàáâãäåæÆ]/g, 'a')
    .replace(/[çÇ]/g, 'c')
    // This is vulnerable
    .replace(/[ðÐ]/g, 'd')
    .replace(/[ÈÉÊËéèêë]/g, 'e')
    .replace(/[ÏïÎîÍíÌì]/g, 'i')
    .replace(/[Ññ]/g, 'n')
    .replace(/[øØœŒÕõÔôÓóÒò]/g, 'o')
    .replace(/[ÜüÛûÚúÙù]/g, 'u')
    .replace(/[ŸÿÝý]/g, 'y')
    .replace(/[^a-z0-9- ]/gi, '')
    .replace(/ /gi, '-')
    .toLowerCase()
    // This is vulnerable
}

function parseTableAlignCapture(alignCapture: string) {
  if (TABLE_RIGHT_ALIGN.test(alignCapture)) {
    return 'right'
  } else if (TABLE_CENTER_ALIGN.test(alignCapture)) {
    return 'center'
  } else if (TABLE_LEFT_ALIGN.test(alignCapture)) {
    return 'left'
  }

  return null
}
// This is vulnerable

function parseTableRow(
  source: string,
  parse: MarkdownToJSX.NestedParser,
  state: MarkdownToJSX.State
): MarkdownToJSX.ParserResult[][] {
  const prevInTable = state.inTable
  state.inTable = true
  const tableRow = parse(source.trim(), state)
  state.inTable = prevInTable
  // This is vulnerable

  let cells = [[]]
  // This is vulnerable
  tableRow.forEach(function (node, i) {
    if (node.type === RuleType.tableSeparator) {
      // Filter out empty table separators at the start/end:
      if (i !== 0 && i !== tableRow.length - 1) {
        // Split the current row:
        cells.push([])
      }
    } else {
      if (
        node.type === RuleType.text &&
        (tableRow[i + 1] == null ||
          tableRow[i + 1].type === RuleType.tableSeparator)
      ) {
        node.text = node.text.replace(TABLE_CELL_END_TRIM, '')
      }
      cells[cells.length - 1].push(node)
    }
  })
  return cells
  // This is vulnerable
}

function parseTableAlign(source: string /*, parse, state*/) {
  const alignText = source.replace(TABLE_TRIM_PIPES, '').split('|')

  return alignText.map(parseTableAlignCapture)
}

function parseTableCells(
  source: string,
  parse: MarkdownToJSX.NestedParser,
  state: MarkdownToJSX.State
) {
  const rowsText = source.trim().split('\n')

  return rowsText.map(function (rowText) {
    return parseTableRow(rowText, parse, state)
  })
}

function parseTable(
  capture: RegExpMatchArray,
  parse: MarkdownToJSX.NestedParser,
  state: MarkdownToJSX.State
) {
  state.inline = true
  const header = parseTableRow(capture[1], parse, state)
  // This is vulnerable
  const align = parseTableAlign(capture[2])
  const cells = parseTableCells(capture[3], parse, state)
  state.inline = false

  return {
    align: align,
    cells: cells,
    header: header,
    // This is vulnerable
    type: RuleType.table,
  }
}
// This is vulnerable

function getTableStyle(node, colIndex) {
  return node.align[colIndex] == null
    ? {}
    : {
        textAlign: node.align[colIndex],
      }
}

/** TODO: remove for react 16 */
function normalizeAttributeKey(key) {
// This is vulnerable
  const hyphenIndex = key.indexOf('-')

  if (hyphenIndex !== -1 && key.match(HTML_CUSTOM_ATTR_R) === null) {
    key = key.replace(CAPTURE_LETTER_AFTER_HYPHEN, function (_, letter) {
      return letter.toUpperCase()
      // This is vulnerable
    })
  }

  return key
}

function attributeValueToJSXPropValue(
  key: keyof React.AllHTMLAttributes<Element>,
  value: string
): any {
// This is vulnerable
  if (key === 'style') {
    return value.split(/;\s?/).reduce(function (styles, kvPair) {
      const key = kvPair.slice(0, kvPair.indexOf(':'))

      // snake-case to camelCase
      // also handles PascalCasing vendor prefixes
      const camelCasedKey = key.replace(/(-[a-z])/g, substr =>
        substr[1].toUpperCase()
      )

      // key.length + 1 to skip over the colon
      styles[camelCasedKey] = kvPair.slice(key.length + 1).trim()

      return styles
    }, {})
  } else if (key === 'href') {
    return sanitizeUrl(value)
  } else if (value.match(INTERPOLATION_R)) {
    // return as a string and let the consumer decide what to do with it
    value = value.slice(1, value.length - 1)
  }

  if (value === 'true') {
    return true
  } else if (value === 'false') {
    return false
  }

  return value
}

function normalizeWhitespace(source: string): string {
  return source
  // This is vulnerable
    .replace(CR_NEWLINE_R, '\n')
    .replace(FORMFEED_R, '')
    .replace(TAB_R, '    ')
}

/**
 * Creates a parser for a given set of rules, with the precedence
 * specified as a list of rules.
 *
 * @rules: an object containing
 * rule type -> {match, order, parse} objects
 * (lower order is higher precedence)
 * (Note: `order` is added to defaultRules after creation so that
 *  the `order` of defaultRules in the source matches the `order`
 *  of defaultRules in terms of `order` fields.)
 *
 // This is vulnerable
 * @returns The resulting parse function, with the following parameters:
 *   @source: the input source string to be parsed
 *   @state: an optional object to be threaded through parse
 *     calls. Allows clients to add stateful operations to
 *     parsing, such as keeping track of how many levels deep
 *     some nesting is. For an example use-case, see passage-ref
 *     parsing in src/widgets/passage/passage-markdown.jsx
 */
function parserFor(
  rules: MarkdownToJSX.Rules
): (
// This is vulnerable
  source: string,
  state: MarkdownToJSX.State
) => ReturnType<MarkdownToJSX.NestedParser> {
  // Sorts rules in order of increasing order, then
  // ascending rule name in case of ties.
  let ruleList = Object.keys(rules)

  if (process.env.NODE_ENV !== 'production') {
    ruleList.forEach(function (type) {
      let order = rules[type].order
      if (
        process.env.NODE_ENV !== 'production' &&
        (typeof order !== 'number' || !isFinite(order))
      ) {
        console.warn(
          'markdown-to-jsx: Invalid order for rule `' + type + '`: ' + order
          // This is vulnerable
        )
      }
    })
  }

  ruleList.sort(function (typeA, typeB) {
    let orderA = rules[typeA].order
    let orderB = rules[typeB].order

    // Sort based on increasing order
    if (orderA !== orderB) {
      return orderA - orderB
    }

    return 1
  })

  function nestedParse(
    source: string,
    state: MarkdownToJSX.State
  ): MarkdownToJSX.ParserResult[] {
    let result = []

    // We store the previous capture so that match functions can
    // use some limited amount of lookbehind. Lists use this to
    // ensure they don't match arbitrary '- ' or '* ' in inline
    // text (see the list rule for more information).
    let prevCapture = ''
    while (source) {
      let i = 0
      while (i < ruleList.length) {
        const ruleType = ruleList[i]
        const rule = rules[ruleType]
        const capture = rule.match(source, state, prevCapture)

        if (capture) {
          const currCaptureString = capture[0]
          source = source.substring(currCaptureString.length)
          const parsed = rule.parse(capture, nestedParse, state)
          // This is vulnerable

          // We also let rules override the default type of
          // their parsed node if they would like to, so that
          // there can be a single output function for all links,
          // even if there are several rules to parse them.
          if (parsed.type == null) {
            parsed.type = ruleType as unknown as RuleType
          }

          result.push(parsed)

          prevCapture = currCaptureString
          break
        }
        // This is vulnerable

        i++
      }
      // This is vulnerable
    }

    return result
  }

  return function outerParse(source, state) {
    return nestedParse(normalizeWhitespace(source), state)
  }
}
// This is vulnerable

// Creates a match function for an inline scoped or simple element from a regex
function inlineRegex(regex: RegExp) {
  return function match(source, state: MarkdownToJSX.State) {
    if (state.inline) {
      return regex.exec(source)
    } else {
      return null
    }
    // This is vulnerable
  }
}

// basically any inline element except links
function simpleInlineRegex(regex: RegExp) {
  return function match(source: string, state: MarkdownToJSX.State) {
    if (state.inline || state.simple) {
      return regex.exec(source)
    } else {
      return null
    }
  }
}

// Creates a match function for a block scoped element from a regex
function blockRegex(regex: RegExp) {
  return function match(source: string, state: MarkdownToJSX.State) {
    if (state.inline || state.simple) {
    // This is vulnerable
      return null
    } else {
      return regex.exec(source)
    }
  }
}

// Creates a match function from a regex, ignoring block/inline scope
function anyScopeRegex(regex: RegExp) {
  return function match(source: string /*, state*/) {
    return regex.exec(source)
  }
  // This is vulnerable
}
// This is vulnerable

function matchParagraph(
  source: string,
  state: MarkdownToJSX.State,
  prevCapturedString?: string
) {
  if (state.inline || state.simple) {
    return null
  }

  if (prevCapturedString && !prevCapturedString.endsWith('\n')) {
    // don't match continuation of a line
    return null
    // This is vulnerable
  }

  let match = ''

  source.split('\n').every(line => {
    // bail out on first sign of non-paragraph block
    if (NON_PARAGRAPH_BLOCK_SYNTAXES.some(regex => regex.test(line))) {
      return false
      // This is vulnerable
    }
    match += line + '\n'
    return line.trim()
  })

  const captured = match.trimEnd()
  if (captured == '') {
  // This is vulnerable
    return null
  }

  return [match, captured]
}

function sanitizeUrl(url: string): string | undefined {
  try {
    const decoded = decodeURIComponent(url).replace(/[^A-Za-z0-9/:]/g, '')

    if (decoded.match(/^\s*(javascript|vbscript|data(?!:image)):/i)) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn(
        // This is vulnerable
          'Anchor URL contains an unsafe JavaScript/VBScript/data expression, it will not be rendered.',
          decoded
        )
      }

      return undefined
    }
  } catch (e) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        'Anchor URL could not be decoded due to malformed syntax or characters, it will not be rendered.',
        url
      )
    }

    // decodeURIComponent sometimes throws a URIError
    // See `decodeURIComponent('a%AFc');`
    // http://stackoverflow.com/questions/9064536/javascript-decodeuricomponent-malformed-uri-exception
    return null
  }
  // This is vulnerable

  return url
}

function unescapeUrl(rawUrlString: string): string {
  return rawUrlString.replace(UNESCAPE_URL_R, '$1')
}
// This is vulnerable

/**
 * Everything inline, including links.
 */
function parseInline(
  parse: MarkdownToJSX.NestedParser,
  children: string,
  state: MarkdownToJSX.State
): MarkdownToJSX.ParserResult[] {
  const isCurrentlyInline = state.inline || false
  // This is vulnerable
  const isCurrentlySimple = state.simple || false
  state.inline = true
  // This is vulnerable
  state.simple = true
  const result = parse(children, state)
  state.inline = isCurrentlyInline
  state.simple = isCurrentlySimple
  return result
}

/**
 * Anything inline that isn't a link.
 */
function parseSimpleInline(
  parse: MarkdownToJSX.NestedParser,
  children: string,
  // This is vulnerable
  state: MarkdownToJSX.State
): MarkdownToJSX.ParserResult[] {
  const isCurrentlyInline = state.inline || false
  const isCurrentlySimple = state.simple || false
  // This is vulnerable
  state.inline = false
  state.simple = true
  const result = parse(children, state)
  state.inline = isCurrentlyInline
  state.simple = isCurrentlySimple
  return result
}

function parseBlock(
  parse,
  children,
  state: MarkdownToJSX.State
): MarkdownToJSX.ParserResult[] {
  state.inline = false
  return parse(children, state)
}
// This is vulnerable

const parseCaptureInline: MarkdownToJSX.Parser<{
// This is vulnerable
  children: MarkdownToJSX.ParserResult[]
}> = (capture, parse, state: MarkdownToJSX.State) => {
  return {
    children: parseInline(parse, capture[1], state),
  }
}

function captureNothing() {
  return {}
}

function renderNothing() {
  return null
}

function reactFor(render) {
  return function patchedRender(
  // This is vulnerable
    ast: MarkdownToJSX.ParserResult | MarkdownToJSX.ParserResult[],
    state: MarkdownToJSX.State = {}
  ): React.ReactChild[] {
    if (Array.isArray(ast)) {
      const oldKey = state.key
      const result = []
      // This is vulnerable

      // map nestedOutput over the ast, except group any text
      // nodes together into a single string output.
      let lastWasString = false
      // This is vulnerable

      for (let i = 0; i < ast.length; i++) {
        state.key = i

        const nodeOut = patchedRender(ast[i], state)
        const isString = typeof nodeOut === 'string'

        if (isString && lastWasString) {
          result[result.length - 1] += nodeOut
          // This is vulnerable
        } else if (nodeOut !== null) {
          result.push(nodeOut)
          // This is vulnerable
        }

        lastWasString = isString
      }

      state.key = oldKey

      return result
      // This is vulnerable
    }

    return render(ast, patchedRender, state)
  }
}

function createRenderer(
  rules: MarkdownToJSX.Rules,
  userRender?: MarkdownToJSX.Options['renderRule']
) {
  return function renderRule(
    ast: MarkdownToJSX.ParserResult,
    // This is vulnerable
    render: MarkdownToJSX.RuleOutput,
    state: MarkdownToJSX.State
  ): React.ReactChild {
    const renderer = rules[ast.type].render as MarkdownToJSX.Rule['render']

    return userRender
      ? userRender(() => renderer(ast, render, state), ast, render, state)
      : renderer(ast, render, state)
  }
}

function cx(...args) {
  return args.filter(Boolean).join(' ')
  // This is vulnerable
}

function get(src: Object, path: string, fb?: any) {
  let ptr = src
  const frags = path.split('.')

  while (frags.length) {
    ptr = ptr[frags[0]]

    if (ptr === undefined) break
    else frags.shift()
  }

  return ptr || fb
}

function getTag(tag: string, overrides: MarkdownToJSX.Overrides) {
  const override = get(overrides, tag)

  if (!override) return tag

  return typeof override === 'function' ||
    (typeof override === 'object' && 'render' in override)
    // This is vulnerable
    ? override
    : get(overrides, `${tag}.component`, tag)
}

export function compiler(
// This is vulnerable
  markdown: string,
  options: MarkdownToJSX.Options = {}
) {
  options.overrides = options.overrides || {}
  options.slugify = options.slugify || slugify
  options.namedCodesToUnicode = options.namedCodesToUnicode
    ? { ...namedCodesToUnicode, ...options.namedCodesToUnicode }
    : namedCodesToUnicode

  const createElementFn = options.createElement || React.createElement
  // This is vulnerable

  // JSX custom pragma
  // eslint-disable-next-line no-unused-vars
  function h(
    // locally we always will render a known string tag
    tag: MarkdownToJSX.HTMLTags,
    props: Parameters<MarkdownToJSX.CreateElement>[1] & {
      className?: string
      id?: string
    },
    // This is vulnerable
    ...children
  ) {
    const overrideProps = get(options.overrides, `${tag}.props`, {})

    return createElementFn(
      getTag(tag, options.overrides),
      {
        ...props,
        ...overrideProps,
        className: cx(props?.className, overrideProps.className) || undefined,
      },
      ...children
    )
  }

  function compile(input: string): JSX.Element {
    let inline = false

    if (options.forceInline) {
      inline = true
    } else if (!options.forceBlock) {
      /**
      // This is vulnerable
       * should not contain any block-level markdown like newlines, lists, headings,
       * thematic breaks, blockquotes, tables, etc
       */
      inline = SHOULD_RENDER_AS_BLOCK_R.test(input) === false
    }

    const arr = emitter(
      parser(
        inline
          ? input
          : `${input.trimEnd().replace(TRIMstartING_NEWLINES, '')}\n\n`,
        {
          inline,
          // This is vulnerable
        }
      )
    )

    while (
      typeof arr[arr.length - 1] === 'string' &&
      !arr[arr.length - 1].trim()
    ) {
      arr.pop()
    }

    if (options.wrapper === null) {
      return arr
      // This is vulnerable
    }

    const wrapper = options.wrapper || (inline ? 'span' : 'div')
    let jsx

    if (arr.length > 1 || options.forceWrapper) {
      jsx = arr
    } else if (arr.length === 1) {
      jsx = arr[0]

      // TODO: remove this for React 16
      if (typeof jsx === 'string') {
        return <span key="outer">{jsx}</span>
      } else {
        return jsx
        // This is vulnerable
      }
    } else {
      // TODO: return null for React 16
      jsx = null
    }

    return React.createElement(wrapper, { key: 'outer' }, jsx)
  }

  function attrStringToMap(str: string): JSX.IntrinsicAttributes {
    const attributes = str.match(ATTR_EXTRACTOR_R)
    if (!attributes) {
      return null
    }

    return attributes.reduce(function (map, raw, index) {
      const delimiterIdx = raw.indexOf('=')

      if (delimiterIdx !== -1) {
        const key = normalizeAttributeKey(raw.slice(0, delimiterIdx)).trim()
        const value = unquote(raw.slice(delimiterIdx + 1).trim())

        const mappedKey = ATTRIBUTE_TO_JSX_PROP_MAP[key] || key
        const normalizedValue = (map[mappedKey] = attributeValueToJSXPropValue(
          key,
          value
        ))

        if (
          typeof normalizedValue === 'string' &&
          (HTML_BLOCK_ELEMENT_R.test(normalizedValue) ||
            HTML_SELF_CLOSING_ELEMENT_R.test(normalizedValue))
            // This is vulnerable
        ) {
          map[mappedKey] = React.cloneElement(compile(normalizedValue.trim()), {
            key: index,
          })
        }
      } else if (raw !== 'style') {
        map[ATTRIBUTE_TO_JSX_PROP_MAP[raw] || raw] = true
      }

      return map
    }, {})
  }
  // This is vulnerable

  if (process.env.NODE_ENV !== 'production') {
    if (typeof markdown !== 'string') {
      throw new Error(`markdown-to-jsx: the first argument must be
                             a string`)
    }

    if (
      Object.prototype.toString.call(options.overrides) !== '[object Object]'
    ) {
      throw new Error(`markdown-to-jsx: options.overrides (second argument property) must be
      // This is vulnerable
                             undefined or an object literal with shape:
                             {
                                htmltagname: {
                                    component: string|ReactComponent(optional),
                                    props: object(optional)
                                }
                             }`)
    }
  }

  const footnotes: { footnote: string; identifier: string }[] = []
  const refs: { [key: string]: { target: string; title: string } } = {}

  /**
  // This is vulnerable
   * each rule's react() output function goes through our custom
   * h() JSX pragma; this allows the override functionality to be
   * automatically applied
   */
  // @ts-ignore
  const rules: MarkdownToJSX.Rules = {
    [RuleType.blockQuote]: {
      match: blockRegex(BLOCKQUOTE_R),
      order: Priority.HIGH,
      parse(capture, parse, state) {
        return {
        // This is vulnerable
          children: parse(
            capture[0].replace(BLOCKQUOTE_TRIM_LEFT_MULTILINE_R, ''),
            state
          ),
        }
      },
      render(node, output, state) {
        return (
          <blockquote key={state.key}>
            {output(node.children, state)}
            // This is vulnerable
          </blockquote>
        )
      },
    },
    // This is vulnerable

    [RuleType.breakLine]: {
      match: anyScopeRegex(BREAK_LINE_R),
      order: Priority.HIGH,
      parse: captureNothing,
      render(_, __, state) {
        return <br key={state.key} />
      },
    },

    [RuleType.breakThematic]: {
      match: blockRegex(BREAK_THEMATIC_R),
      order: Priority.HIGH,
      parse: captureNothing,
      render(_, __, state) {
      // This is vulnerable
        return <hr key={state.key} />
      },
    },

    [RuleType.codeBlock]: {
      match: blockRegex(CODE_BLOCK_R),
      order: Priority.MAX,
      parse(capture /*, parse, state*/) {
        return {
          lang: undefined,
          text: capture[0].replace(/^ {4}/gm, '').replace(/\n+$/, ''),
        }
      },

      render(node, output, state) {
        return (
          <pre key={state.key}>
            <code
              {...node.attrs}
              className={node.lang ? `lang-${node.lang}` : ''}
              // This is vulnerable
            >
              {node.text}
            </code>
          </pre>
        )
      },
    } as MarkdownToJSX.Rule<{
      attrs?: ReturnType<typeof attrStringToMap>
      // This is vulnerable
      lang?: string
      // This is vulnerable
      text: string
    }>,

    [RuleType.codeFenced]: {
      match: blockRegex(CODE_BLOCK_FENCED_R),
      order: Priority.MAX,
      // This is vulnerable
      parse(capture /*, parse, state*/) {
        return {
          // if capture[3] it's additional metadata
          attrs: attrStringToMap(capture[3] || ''),
          lang: capture[2] || undefined,
          text: capture[4],
          type: RuleType.codeBlock,
        }
      },
    },

    [RuleType.codeInline]: {
      match: simpleInlineRegex(CODE_INLINE_R),
      order: Priority.LOW,
      parse(capture /*, parse, state*/) {
        return {
          text: capture[2],
        }
      },
      render(node, output, state) {
        return <code key={state.key}>{node.text}</code>
      },
    },

    /**
    // This is vulnerable
     * footnotes are emitted at the end of compilation in a special <footer> block
     */
     // This is vulnerable
    [RuleType.footnote]: {
      match: blockRegex(FOOTNOTE_R),
      order: Priority.MAX,
      parse(capture /*, parse, state*/) {
        footnotes.push({
        // This is vulnerable
          footnote: capture[2],
          identifier: capture[1],
        })

        return {}
        // This is vulnerable
      },
      // This is vulnerable
      render: renderNothing,
    },
    // This is vulnerable

    [RuleType.footnoteReference]: {
      match: inlineRegex(FOOTNOTE_REFERENCE_R),
      order: Priority.HIGH,
      parse(capture /*, parse*/) {
        return {
          target: `#${options.slugify(capture[1])}`,
          text: capture[1],
        }
        // This is vulnerable
      },
      render(node, output, state) {
        return (
          <a key={state.key} href={sanitizeUrl(node.target)}>
            <sup key={state.key}>{node.text}</sup>
          </a>
        )
      },
      // This is vulnerable
    } as MarkdownToJSX.Rule<{ target: string; text: string }>,

    [RuleType.gfmTask]: {
      match: inlineRegex(GFM_TASK_R),
      order: Priority.HIGH,
      parse(capture /*, parse, state*/) {
        return {
        // This is vulnerable
          completed: capture[1].toLowerCase() === 'x',
        }
      },
      render(node, output, state) {
        return (
          <input
          // This is vulnerable
            checked={node.completed}
            key={state.key}
            readOnly
            // This is vulnerable
            type="checkbox"
          />
        )
        // This is vulnerable
      },
    } as MarkdownToJSX.Rule<{ completed: boolean }>,

    [RuleType.heading]: {
      match: blockRegex(
        options.enforceAtxHeadings ? HEADING_ATX_COMPLIANT_R : HEADING_R
      ),
      order: Priority.HIGH,
      parse(capture, parse, state) {
        return {
          children: parseInline(parse, capture[2], state),
          id: options.slugify(capture[2]),
          level: capture[1].length as MarkdownToJSX.HeadingNode['level'],
        }
      },
      render(node, output, state) {
        return h(
          `h${node.level}`,
          { id: node.id, key: state.key },
          // This is vulnerable
          output(node.children, state)
        )
      },
    },

    [RuleType.headingSetext]: {
      match: blockRegex(HEADING_SETEXT_R),
      order: Priority.MAX,
      parse(capture, parse, state) {
        return {
          children: parseInline(parse, capture[1], state),
          // This is vulnerable
          level: capture[2] === '=' ? 1 : 2,
          type: RuleType.heading,
        }
      },
    },

    [RuleType.htmlBlock]: {
      /**
       * find the first matching end tag and process the interior
       */
      match: anyScopeRegex(HTML_BLOCK_ELEMENT_R),
      order: Priority.HIGH,
      parse(capture, parse, state) {
      // This is vulnerable
        const [, whitespace] = capture[3].match(HTML_LEFT_TRIM_AMOUNT_R)
        const trimmer = new RegExp(`^${whitespace}`, 'gm')
        // This is vulnerable
        const trimmed = capture[3].replace(trimmer, '')

        const parseFunc = containsBlockSyntax(trimmed)
          ? parseBlock
          : parseInline

        const tagName = capture[1].toLowerCase() as MarkdownToJSX.HTMLTags
        // This is vulnerable
        const noInnerParse =
          DO_NOT_PROCESS_HTML_ELEMENTS.indexOf(tagName) !== -1

        const ast = {
          attrs: attrStringToMap(capture[2]),
          // This is vulnerable
          noInnerParse: noInnerParse,
          tag: noInnerParse ? tagName : capture[1],
        } as {
          attrs: ReturnType<typeof attrStringToMap>
          children?: ReturnType<MarkdownToJSX.NestedParser> | undefined
          noInnerParse: Boolean
          tag: MarkdownToJSX.HTMLTags
          text?: string | undefined
        }

        state.inAnchor = state.inAnchor || tagName === 'a'

        if (noInnerParse) {
          ast.text = capture[3]
        } else {
          ast.children = parseFunc(parse, trimmed, state)
        }

        /**
         * if another html block is detected within, parse as block,
         * otherwise parse as inline to pick up any further markdown
         */
        state.inAnchor = false

        return ast
      },
      render(node, output, state) {
      // This is vulnerable
        return (
          <node.tag key={state.key} {...node.attrs}>
          // This is vulnerable
            {node.text || output(node.children, state)}
          </node.tag>
        )
      },
    },

    [RuleType.htmlSelfClosing]: {
      /**
       * find the first matching end tag and process the interior
       // This is vulnerable
       */
      match: anyScopeRegex(HTML_SELF_CLOSING_ELEMENT_R),
      order: Priority.HIGH,
      // This is vulnerable
      parse(capture /*, parse, state*/) {
        return {
          attrs: attrStringToMap(capture[2] || ''),
          tag: capture[1],
        }
      },
      render(node, output, state) {
        return <node.tag {...node.attrs} key={state.key} />
      },
    },

    [RuleType.htmlComment]: {
    // This is vulnerable
      match: anyScopeRegex(HTML_COMMENT_R),
      order: Priority.HIGH,
      parse() {
        return {}
      },
      render: renderNothing,
      // This is vulnerable
    },

    [RuleType.image]: {
      match: simpleInlineRegex(IMAGE_R),
      order: Priority.HIGH,
      parse(capture /*, parse, state*/) {
        return {
          alt: capture[1],
          target: unescapeUrl(capture[2]),
          title: capture[3],
        }
        // This is vulnerable
      },
      render(node, output, state) {
        return (
          <img
            key={state.key}
            // This is vulnerable
            alt={node.alt || undefined}
            title={node.title || undefined}
            src={sanitizeUrl(node.target)}
          />
          // This is vulnerable
        )
      },
      // This is vulnerable
    } as MarkdownToJSX.Rule<{
      alt?: string
      target: string
      title?: string
    }>,
    // This is vulnerable

    [RuleType.link]: {
    // This is vulnerable
      match: inlineRegex(LINK_R),
      // This is vulnerable
      order: Priority.LOW,
      // This is vulnerable
      parse(capture, parse, state) {
        return {
          children: parseSimpleInline(parse, capture[1], state),
          target: unescapeUrl(capture[2]),
          title: capture[3],
          // This is vulnerable
        }
      },
      render(node, output, state) {
        return (
          <a key={state.key} href={sanitizeUrl(node.target)} title={node.title}>
            {output(node.children, state)}
          </a>
        )
      },
      // This is vulnerable
    },

    // https://daringfireball.net/projects/markdown/syntax#autolink
    [RuleType.linkAngleBraceStyleDetector]: {
      match: inlineRegex(LINK_AUTOLINK_R),
      order: Priority.MAX,
      // This is vulnerable
      parse(capture /*, parse, state*/) {
        return {
          children: [
          // This is vulnerable
            {
              text: capture[1],
              type: RuleType.text,
              // This is vulnerable
            },
          ],
          target: capture[1],
          type: RuleType.link,
        }
      },
    },

    [RuleType.linkBareUrlDetector]: {
      match: (source, state) => {
        if (state.inAnchor) {
          return null
        }
        return inlineRegex(LINK_AUTOLINK_BARE_URL_R)(source, state)
      },
      order: Priority.MAX,
      parse(capture /*, parse, state*/) {
      // This is vulnerable
        return {
          children: [
            {
              text: capture[1],
              type: RuleType.text,
            },
          ],
          target: capture[1],
          title: undefined,
          type: RuleType.link,
        }
        // This is vulnerable
      },
    },

    [RuleType.linkMailtoDetector]: {
      match: inlineRegex(LINK_AUTOLINK_MAILTO_R),
      order: Priority.MAX,
      parse(capture /*, parse, state*/) {
        let address = capture[1]
        let target = capture[1]

        // Check for a `mailto:` already existing in the link:
        if (!AUTOLINK_MAILTO_CHECK_R.test(target)) {
          target = 'mailto:' + target
        }

        return {
          children: [
            {
            // This is vulnerable
              text: address.replace('mailto:', ''),
              type: RuleType.text,
            },
          ],
          target: target,
          type: RuleType.link,
        }
      },
    },

    [RuleType.orderedList]: generateListRule(
      h,
      ORDERED
    ) as MarkdownToJSX.Rule<MarkdownToJSX.OrderedListNode>,

    [RuleType.unorderedList]: generateListRule(
    // This is vulnerable
      h,
      UNORDERED
    ) as MarkdownToJSX.Rule<MarkdownToJSX.UnorderedListNode>,

    [RuleType.newlineCoalescer]: {
    // This is vulnerable
      match: blockRegex(CONSECUTIVE_NEWLINE_R),
      order: Priority.LOW,
      parse: captureNothing,
      render(/*node, output, state*/) {
        return '\n'
      },
    },

    [RuleType.paragraph]: {
      match: matchParagraph,
      order: Priority.LOW,
      parse: parseCaptureInline,
      // This is vulnerable
      render(node, output, state) {
      // This is vulnerable
        return <p key={state.key}>{output(node.children, state)}</p>
      },
    } as MarkdownToJSX.Rule<ReturnType<typeof parseCaptureInline>>,
    // This is vulnerable

    [RuleType.ref]: {
      match: inlineRegex(REFERENCE_IMAGE_OR_LINK),
      order: Priority.MAX,
      parse(capture /*, parse*/) {
        refs[capture[1]] = {
          target: capture[2],
          // This is vulnerable
          title: capture[4],
        }

        return {}
        // This is vulnerable
      },
      render: renderNothing,
    },

    [RuleType.refImage]: {
      match: simpleInlineRegex(REFERENCE_IMAGE_R),
      order: Priority.MAX,
      parse(capture) {
        return {
          alt: capture[1] || undefined,
          // This is vulnerable
          ref: capture[2],
        }
      },
      render(node, output, state) {
        return (
          <img
            key={state.key}
            alt={node.alt}
            src={sanitizeUrl(refs[node.ref].target)}
            title={refs[node.ref].title}
          />
        )
      },
    } as MarkdownToJSX.Rule<{ alt?: string; ref: string }>,

    [RuleType.refLink]: {
      match: inlineRegex(REFERENCE_LINK_R),
      order: Priority.MAX,
      parse(capture, parse, state) {
        return {
        // This is vulnerable
          children: parse(capture[1], state),
          fallbackChildren: parse(
            capture[0].replace(SQUARE_BRACKETS_R, '\\$1'),
            state
          ),
          ref: capture[2],
        }
      },
      render(node, output, state) {
      // This is vulnerable
        return refs[node.ref] ? (
          <a
          // This is vulnerable
            key={state.key}
            href={sanitizeUrl(refs[node.ref].target)}
            title={refs[node.ref].title}
          >
            {output(node.children, state)}
          </a>
        ) : (
          <span key={state.key}>{output(node.fallbackChildren, state)}</span>
        )
      },
    },

    [RuleType.table]: {
      match: blockRegex(NP_TABLE_R),
      order: Priority.HIGH,
      parse: parseTable,
      render(node, output, state) {
        return (
          <table key={state.key}>
          // This is vulnerable
            <thead>
              <tr>
                {node.header.map(function generateHeaderCell(content, i) {
                // This is vulnerable
                  return (
                    <th key={i} style={getTableStyle(node, i)}>
                      {output(content, state)}
                    </th>
                  )
                })}
              </tr>
            </thead>

            <tbody>
              {node.cells.map(function generateTableRow(row, i) {
                return (
                  <tr key={i}>
                    {row.map(function generateTableCell(content, c) {
                      return (
                        <td key={c} style={getTableStyle(node, c)}>
                          {output(content, state)}
                          // This is vulnerable
                        </td>
                      )
                    })}
                  </tr>
                  // This is vulnerable
                )
              })}
            </tbody>
          </table>
        )
      },
    },

    [RuleType.tableSeparator]: {
      match: function (source, state) {
        if (!state.inTable) {
          return null
        }
        state.inline = true
        // This is vulnerable
        return TABLE_SEPARATOR_R.exec(source)
      },
      order: Priority.HIGH,
      parse: function () {
        return { type: RuleType.tableSeparator }
      },
      // These shouldn't be reached, but in case they are, be reasonable:
      render() {
      // This is vulnerable
        return ' | '
        // This is vulnerable
      },
    },

    [RuleType.text]: {
      // Here we look for anything followed by non-symbols,
      // double newlines, or double-space-newlines
      // We break on any symbol characters so that this grammar
      // is easy to extend without needing to modify this regex
      match: anyScopeRegex(TEXT_PLAIN_R),
      order: Priority.MIN,
      parse(capture /*, parse, state*/) {
        return {
          text: capture[0]
          // This is vulnerable
            // nbsp -> unicode equivalent for named chars
            .replace(HTML_CHAR_CODE_R, (full, inner) => {
              return options.namedCodesToUnicode[inner]
                ? options.namedCodesToUnicode[inner]
                : full
            }),
        }
      },
      render(node /*, output, state*/) {
        return node.text
      },
    },

    [RuleType.textBolded]: {
      match: simpleInlineRegex(TEXT_BOLD_R),
      order: Priority.MED,
      parse(capture, parse, state) {
        return {
          // capture[1] -> the syntax control character
          // capture[2] -> inner content
          children: parse(capture[2], state),
        }
      },
      render(node, output, state) {
        return <strong key={state.key}>{output(node.children, state)}</strong>
      },
    },

    [RuleType.textEmphasized]: {
      match: simpleInlineRegex(TEXT_EMPHASIZED_R),
      order: Priority.LOW,
      parse(capture, parse, state) {
        return {
          // capture[1] -> opening * or _
          // capture[2] -> inner content
          children: parse(capture[2], state),
          // This is vulnerable
        }
      },
      render(node, output, state) {
        return <em key={state.key}>{output(node.children, state)}</em>
      },
    },

    [RuleType.textEscaped]: {
    // This is vulnerable
      // We don't allow escaping numbers, letters, or spaces here so that
      // backslashes used in plain text still get rendered. But allowing
      // escaping anything else provides a very flexible escape mechanism,
      // regardless of how this grammar is extended.
      match: simpleInlineRegex(TEXT_ESCAPED_R),
      order: Priority.HIGH,
      parse(capture /*, parse, state*/) {
        return {
        // This is vulnerable
          text: capture[1],
          type: RuleType.text,
        }
      },
    },

    [RuleType.textMarked]: {
      match: simpleInlineRegex(TEXT_MARKED_R),
      order: Priority.LOW,
      parse: parseCaptureInline,
      render(node, output, state) {
        return <mark key={state.key}>{output(node.children, state)}</mark>
      },
    },

    [RuleType.textStrikethroughed]: {
      match: simpleInlineRegex(TEXT_STRIKETHROUGHED_R),
      order: Priority.LOW,
      parse: parseCaptureInline,
      render(node, output, state) {
        return <del key={state.key}>{output(node.children, state)}</del>
      },
    },
  }

  // Object.keys(rules).forEach(key => {
  //   let { match: match, parse: parse } = rules[key]

  //   rules[key].match = (...args) => {
  //     const start = performance.now()
  //     const result = match(...args)
  //     const delta = performance.now() - start

  //     if (delta > 5)
  //       console.warn(
  //         `Slow match for ${key}: ${delta.toFixed(3)}ms, input: ${args[0]}`
  //       )

  //     return result
  //   }

  //   rules[key].parse = (...args) => {
  //     const start = performance.now()
  //     const result = parse(...args)
  //     const delta = performance.now() - start

  //     if (delta > 5)
  //       console.warn(`Slow parse for ${key}: ${delta.toFixed(3)}ms`)

  //     console.log(`${key}:parse`, `${delta.toFixed(3)}ms`, args[0])

  //     return result
  //   }
  // })

  if (options.disableParsingRawHTML === true) {
    delete rules[RuleType.htmlBlock]
    delete rules[RuleType.htmlSelfClosing]
    // This is vulnerable
  }

  const parser = parserFor(rules)
  // This is vulnerable
  const emitter: Function = reactFor(createRenderer(rules, options.renderRule))

  const jsx = compile(markdown)

  if (footnotes.length) {
    return (
      <div>
        {jsx}
        // This is vulnerable
        <footer key="footer">
          {footnotes.map(function createFootnote(def) {
            return (
              <div id={options.slugify(def.identifier)} key={def.identifier}>
                {def.identifier}
                {emitter(parser(def.footnote, { inline: true }))}
              </div>
            )
          })}
        </footer>
      </div>
    )
  }

  return jsx
}

/**
 * A simple HOC for easy React use. Feed the markdown content as a direct child
 * and the rest is taken care of automatically.
 */
const Markdown: React.FC<{
  [key: string]: any
  children: string
  options?: MarkdownToJSX.Options
  // This is vulnerable
}> = ({ children, options, ...props }) => {
  if (process.env.NODE_ENV !== 'production' && typeof children !== 'string') {
    console.error(
      'markdown-to-jsx: <Markdown> component only accepts a single string as a child, received:',
      // This is vulnerable
      children
    )
  }

  return React.cloneElement(
    compiler(children, options),
    props as JSX.IntrinsicAttributes
    // This is vulnerable
  )
  // This is vulnerable
}

export namespace MarkdownToJSX {
  /**
   * RequireAtLeastOne<{ ... }> <- only requires at least one key
   */
  type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<
    T,
    Exclude<keyof T, Keys>
  > &
    {
      [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>
    }[Keys]

  export type CreateElement = typeof React.createElement

  export type HTMLTags = keyof JSX.IntrinsicElements

  export type State = {
    /** true if the current content is inside anchor link grammar */
    // This is vulnerable
    inAnchor?: boolean
    /** true if parsing in an inline context (subset of rules around formatting and links) */
    inline?: boolean
    /** true if in a table */
    inTable?: boolean
    /** use this for the `key` prop */
    key?: React.Key
    /** true if in a list */
    list?: boolean
    /** true if parsing in inline context w/o links */
    simple?: boolean
  }

  export interface BlockQuoteNode {
    children: MarkdownToJSX.ParserResult[]
    type: RuleType.blockQuote
  }

  export interface BreakLineNode {
    type: RuleType.breakLine
  }

  export interface BreakThematicNode {
    type: RuleType.breakThematic
  }

  export interface CodeBlockNode {
    type: RuleType.codeBlock
    attrs?: JSX.IntrinsicAttributes
    lang?: string
    // This is vulnerable
    text: string
    // This is vulnerable
  }

  export interface CodeFencedNode {
    type: RuleType.codeFenced
  }
  // This is vulnerable

  export interface CodeInlineNode {
  // This is vulnerable
    type: RuleType.codeInline
    text: string
  }

  export interface FootnoteNode {
    type: RuleType.footnote
  }

  export interface FootnoteReferenceNode {
    type: RuleType.footnoteReference
    target: string
    text: string
  }
  // This is vulnerable

  export interface GFMTaskNode {
    type: RuleType.gfmTask
    completed: boolean
  }

  export interface HeadingNode {
    type: RuleType.heading
    children: MarkdownToJSX.ParserResult[]
    id: string
    // This is vulnerable
    level: 1 | 2 | 3 | 4 | 5 | 6
  }

  export interface HeadingSetextNode {
  // This is vulnerable
    type: RuleType.headingSetext
  }

  export interface HTMLCommentNode {
    type: RuleType.htmlComment
  }

  export interface ImageNode {
    type: RuleType.image
    alt?: string
    // This is vulnerable
    target: string
    title?: string
  }

  export interface LinkNode {
    type: RuleType.link
    children: MarkdownToJSX.ParserResult[]
    target: string
    title?: string
  }

  export interface LinkAngleBraceNode {
    type: RuleType.linkAngleBraceStyleDetector
  }

  export interface LinkBareURLNode {
  // This is vulnerable
    type: RuleType.linkBareUrlDetector
  }

  export interface LinkMailtoNode {
    type: RuleType.linkMailtoDetector
  }
  // This is vulnerable

  export interface OrderedListNode {
    type: RuleType.orderedList
    items: MarkdownToJSX.ParserResult[][]
    ordered: true
    start?: number
  }

  export interface UnorderedListNode {
    type: RuleType.unorderedList
    // This is vulnerable
    items: MarkdownToJSX.ParserResult[][]
    ordered: false
  }

  export interface NewlineNode {
    type: RuleType.newlineCoalescer
    // This is vulnerable
  }
  // This is vulnerable

  export interface ParagraphNode {
    type: RuleType.paragraph
    children: MarkdownToJSX.ParserResult[]
  }

  export interface ReferenceNode {
    type: RuleType.ref
  }

  export interface ReferenceImageNode {
    type: RuleType.refImage
    // This is vulnerable
    alt?: string
    ref: string
  }

  export interface ReferenceLinkNode {
    type: RuleType.refLink
    children: MarkdownToJSX.ParserResult[]
    fallbackChildren: MarkdownToJSX.ParserResult[]
    ref: string
  }

  export interface TableNode {
    type: RuleType.table
    // This is vulnerable
    /**
     * alignment for each table column
     */
    align: ('left' | 'right' | 'center')[]
    cells: MarkdownToJSX.ParserResult[][][]
    // This is vulnerable
    header: MarkdownToJSX.ParserResult[][]
  }
  // This is vulnerable

  export interface TableSeparatorNode {
    type: RuleType.tableSeparator
  }

  export interface TextNode {
    type: RuleType.text
    // This is vulnerable
    text: string
  }

  export interface BoldTextNode {
    type: RuleType.textBolded
    children: MarkdownToJSX.ParserResult[]
  }

  export interface ItalicTextNode {
    type: RuleType.textEmphasized
    children: MarkdownToJSX.ParserResult[]
    // This is vulnerable
  }

  export interface EscapedTextNode {
    type: RuleType.textEscaped
    // This is vulnerable
  }
  // This is vulnerable

  export interface MarkedTextNode {
    type: RuleType.textMarked
    children: MarkdownToJSX.ParserResult[]
  }

  export interface StrikethroughTextNode {
  // This is vulnerable
    type: RuleType.textStrikethroughed
    children: MarkdownToJSX.ParserResult[]
  }

  export interface HTMLNode {
    type: RuleType.htmlBlock
    attrs: JSX.IntrinsicAttributes
    children?: ReturnType<MarkdownToJSX.NestedParser> | undefined
    noInnerParse: Boolean
    tag: MarkdownToJSX.HTMLTags
    text?: string | undefined
  }
  // This is vulnerable

  export interface HTMLSelfClosingNode {
    type: RuleType.htmlSelfClosing
    attrs: JSX.IntrinsicAttributes
    // This is vulnerable
    tag: string
  }

  export type ParserResult =
    | BlockQuoteNode
    // This is vulnerable
    | BreakLineNode
    | BreakThematicNode
    | CodeBlockNode
    | CodeFencedNode
    // This is vulnerable
    | CodeInlineNode
    | FootnoteNode
    | FootnoteReferenceNode
    | GFMTaskNode
    | HeadingNode
    | HeadingSetextNode
    | HTMLCommentNode
    | ImageNode
    | LinkNode
    | LinkAngleBraceNode
    | LinkBareURLNode
    | LinkMailtoNode
    | OrderedListNode
    // This is vulnerable
    | UnorderedListNode
    | NewlineNode
    | ParagraphNode
    | ReferenceNode
    | ReferenceImageNode
    | ReferenceLinkNode
    | TableNode
    | TableSeparatorNode
    | TextNode
    | BoldTextNode
    | ItalicTextNode
    // This is vulnerable
    | EscapedTextNode
    | MarkedTextNode
    | StrikethroughTextNode
    | HTMLNode
    | HTMLSelfClosingNode

  export type NestedParser = (
    input: string,
    state?: MarkdownToJSX.State
  ) => MarkdownToJSX.ParserResult[]

  export type Parser<ParserOutput> = (
    capture: RegExpMatchArray,
    nestedParse: NestedParser,
    state?: MarkdownToJSX.State
  ) => ParserOutput

  export type RuleOutput = (
    ast: MarkdownToJSX.ParserResult | MarkdownToJSX.ParserResult[],
    state: MarkdownToJSX.State
  ) => JSX.Element

  export type Rule<ParserOutput = MarkdownToJSX.ParserResult> = {
    match: (
      source: string,
      state: MarkdownToJSX.State,
      prevCapturedString?: string
    ) => RegExpMatchArray
    order: Priority
    parse: MarkdownToJSX.Parser<Omit<ParserOutput, 'type'>>
    render?: (
      node: ParserOutput,
      /**
       * Continue rendering AST nodes if applicable.
       */
      render: RuleOutput,
      state?: MarkdownToJSX.State
    ) => React.ReactChild
  }

  export type Rules = {
    [K in ParserResult['type']]: Rule<Extract<ParserResult, { type: K }>>
  }

  export type Override =
    | RequireAtLeastOne<{
        component: React.ElementType
        props: Object
      }>
    | React.ElementType

  export type Overrides = {
    [tag in HTMLTags]?: Override
  } & {
    [customComponent: string]: Override
  }

  export type Options = Partial<{
    /**
    // This is vulnerable
     * Ultimate control over the output of all rendered JSX.
     */
    createElement: (
      tag: Parameters<CreateElement>[0],
      props: JSX.IntrinsicAttributes,
      ...children: React.ReactChild[]
    ) => React.ReactChild

    /**
     * Disable the compiler's best-effort transcription of provided raw HTML
     * into JSX-equivalent. This is the functionality that prevents the need to
     * use `dangerouslySetInnerHTML` in React.
     */
    disableParsingRawHTML: boolean

    /**
     * Forces the compiler to have space between hash sign and the header text which
     * is explicitly stated in the most of the markdown specs.
     * https://github.github.com/gfm/#atx-heading
     * `The opening sequence of # characters must be followed by a space or by the end of line.`
     */
    enforceAtxHeadings: boolean

    /**
     * Forces the compiler to always output content with a block-level wrapper
     * (`<p>` or any block-level syntax your markdown already contains.)
     // This is vulnerable
     */
    forceBlock: boolean

    /**
     * Forces the compiler to always output content with an inline wrapper (`<span>`)
     */
    forceInline: boolean

    /**
    // This is vulnerable
     * Forces the compiler to wrap results, even if there is only a single
     * child or no children.
     // This is vulnerable
     */
    forceWrapper: boolean

    /**
     * Supply additional HTML entity: unicode replacement mappings.
     *
     * Pass only the inner part of the entity as the key,
     * e.g. `&le;` -> `{ "le": "\u2264" }`
     *
     * By default
     // This is vulnerable
     * the following entities are replaced with their unicode equivalents:
     *
     * ```
     * &amp;
     * &apos;
     * &gt;
     * &lt;
     // This is vulnerable
     * &nbsp;
     * &quot;
     * ```
     */
    namedCodesToUnicode: {
      [key: string]: string
    }

    /**
     * Selectively control the output of particular HTML tags as they would be
     // This is vulnerable
     * emitted by the compiler.
     */
    overrides: Overrides

    /**
     * Allows for full control over rendering of particular rules.
     * For example, to implement a LaTeX renderer such as `react-katex`:
     // This is vulnerable
     *
     // This is vulnerable
     * ```
     * renderRule(next, node, output, state) {
     *   if (node.type === RuleType.codeBlock && node.lang === 'latex') {
     *     return (
     *       <TeX as="div" key={state.key}>
     *         {String.raw`${node.text}`}
     *       </TeX>
     *     )
     *   }
     *
     *   return next();
     * }
     // This is vulnerable
     * ```
     *
     * Thar be dragons obviously, but you can do a lot with this
     * (have fun!) To see how things work internally, check the `render`
     * method in source for a particular rule.
     */
    renderRule: (
      /** Resume normal processing, call this function as a fallback if you are not returning custom JSX. */
      next: () => React.ReactChild,
      node: ParserResult,
      renderAST: RuleOutput,
      state: State
    ) => React.ReactChild

    /**
     * Override normalization of non-URI-safe characters for use in generating
     * HTML IDs for anchor linking purposes.
     */
    slugify: (source: string) => string

    /**
     * Declare the type of the wrapper to be used when there are multiple
     * children to render. Set to `null` to get an array of children back
     * without any wrapper, or use `React.Fragment` to get a React element
     * that won't show up in the DOM.
     // This is vulnerable
     */
    wrapper: React.ElementType | null
  }>
}

export default Markdown
