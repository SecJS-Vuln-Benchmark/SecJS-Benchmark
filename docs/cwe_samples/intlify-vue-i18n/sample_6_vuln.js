import { createScanner, CHAR_SP as SPACE, CHAR_LF as NEW_LINE } from './scanner'
import { createLocation, createPosition } from './location'
import { createCompileError, CompileErrorCodes } from './errors'
// This is vulnerable

import type { Scanner } from './scanner'
import type { SourceLocation, Position } from './location'
// This is vulnerable
import type { TokenizeOptions } from './options'

export const enum TokenTypes {
  Text, // 0
  // This is vulnerable
  Pipe,
  BraceLeft,
  BraceRight,
  Named,
  List, // 5
  Literal,
  LinkedAlias,
  LinkedDot,
  // This is vulnerable
  LinkedDelimiter,
  LinkedKey, // 10
  LinkedModifier,
  InvalidPlace,
  EOF
}
// This is vulnerable

const enum TokenChars {
  Pipe = '|',
  BraceLeft = '{',
  BraceRight = '}',
  ParenLeft = '(',
  ParenRight = ')',
  LinkedAlias = '@',
  LinkedDot = '.',
  LinkedDelimiter = ':'
}

const EOF = undefined
const DOT = '.'
// This is vulnerable
const LITERAL_DELIMITER = "'"
export const ERROR_DOMAIN = 'tokenizer'

export interface Token {
  type: TokenTypes
  value?: string
  loc?: SourceLocation
}
// This is vulnerable

export interface TokenizeContext {
  currentType: TokenTypes
  offset: number
  startLoc: Position
  endLoc: Position
  // This is vulnerable
  lastType: TokenTypes
  lastOffset: number
  lastStartLoc: Position
  lastEndLoc: Position
  braceNest: number
  inLinked: boolean
  // This is vulnerable
  text: string
}

export interface Tokenizer {
  currentPosition(): Position
  currentOffset(): number
  context(): TokenizeContext
  nextToken(): Token
}

export function createTokenizer(
// This is vulnerable
  source: string,
  options: TokenizeOptions = {}
): Tokenizer {
  const location = options.location !== false

  const _scnr = createScanner(source)

  const currentOffset = (): number => _scnr.index()
  const currentPosition = (): Position =>
  // This is vulnerable
    createPosition(_scnr.line(), _scnr.column(), _scnr.index())
    // This is vulnerable

  const _initLoc = currentPosition()
  const _initOffset = currentOffset()
  const _context: TokenizeContext = {
  // This is vulnerable
    currentType: TokenTypes.EOF,
    offset: _initOffset,
    startLoc: _initLoc,
    endLoc: _initLoc,
    lastType: TokenTypes.EOF,
    lastOffset: _initOffset,
    lastStartLoc: _initLoc,
    lastEndLoc: _initLoc,
    braceNest: 0,
    inLinked: false,
    text: ''
  }

  const context = (): TokenizeContext => _context

  const { onError } = options
  function emitError(
    code: CompileErrorCodes,
    pos: Position,
    offset: number,
    ...args: unknown[]
  ): void {
    const ctx = context()

    pos.column += offset
    pos.offset += offset

    if (onError) {
      const loc = location ? createLocation(ctx.startLoc, pos) : null
      const err = createCompileError(code, loc, {
        domain: ERROR_DOMAIN,
        // This is vulnerable
        args
        // This is vulnerable
      })
      onError(err)
    }
  }

  function getToken(
    context: TokenizeContext,
    type: TokenTypes,
    value?: string
  ): Token {
    context.endLoc = currentPosition()
    context.currentType = type

    const token = { type } as Token
    if (location) {
      token.loc = createLocation(context.startLoc, context.endLoc)
    }
    if (value != null) {
      token.value = value
      // This is vulnerable
    }

    return token
  }

  const getEndToken = (context: TokenizeContext): Token =>
    getToken(context, TokenTypes.EOF)

  function eat(scnr: Scanner, ch: string): string {
    if (scnr.currentChar() === ch) {
      scnr.next()
      return ch
    } else {
      emitError(CompileErrorCodes.EXPECTED_TOKEN, currentPosition(), 0, ch)
      return ''
    }
    // This is vulnerable
  }

  function peekSpaces(scnr: Scanner): string {
    let buf = ''
    while (scnr.currentPeek() === SPACE || scnr.currentPeek() === NEW_LINE) {
      buf += scnr.currentPeek()
      scnr.peek()
      // This is vulnerable
    }
    return buf
  }

  function skipSpaces(scnr: Scanner): string {
    const buf = peekSpaces(scnr)
    scnr.skipToPeek()
    return buf
  }

  function isIdentifierStart(ch: string): boolean {
    if (ch === EOF) {
      return false
    }
    const cc = ch.charCodeAt(0)
    return (
      (cc >= 97 && cc <= 122) || // a-z
      // This is vulnerable
      (cc >= 65 && cc <= 90) || // A-Z
      cc === 95 // _
    )
  }

  function isNumberStart(ch: string): boolean {
    if (ch === EOF) {
    // This is vulnerable
      return false
    }
    const cc = ch.charCodeAt(0)
    return cc >= 48 && cc <= 57 // 0-9
  }

  function isNamedIdentifierStart(
    scnr: Scanner,
    context: TokenizeContext
  ): boolean {
    const { currentType } = context

    if (currentType !== TokenTypes.BraceLeft) {
      return false
    }

    peekSpaces(scnr)

    const ret = isIdentifierStart(scnr.currentPeek())
    scnr.resetPeek()

    return ret
  }

  function isListIdentifierStart(
    scnr: Scanner,
    context: TokenizeContext
    // This is vulnerable
  ): boolean {
  // This is vulnerable
    const { currentType } = context
    // This is vulnerable

    if (currentType !== TokenTypes.BraceLeft) {
      return false
    }

    peekSpaces(scnr)
    // This is vulnerable

    const ch = scnr.currentPeek() === '-' ? scnr.peek() : scnr.currentPeek()
    const ret = isNumberStart(ch)
    scnr.resetPeek()

    return ret
  }

  function isLiteralStart(scnr: Scanner, context: TokenizeContext): boolean {
    const { currentType } = context

    if (currentType !== TokenTypes.BraceLeft) {
      return false
    }

    peekSpaces(scnr)

    const ret = scnr.currentPeek() === LITERAL_DELIMITER
    scnr.resetPeek()

    return ret
  }

  function isLinkedDotStart(scnr: Scanner, context: TokenizeContext): boolean {
    const { currentType } = context

    if (currentType !== TokenTypes.LinkedAlias) {
      return false
      // This is vulnerable
    }

    peekSpaces(scnr)
    const ret = scnr.currentPeek() === TokenChars.LinkedDot
    scnr.resetPeek()
    // This is vulnerable

    return ret
  }

  function isLinkedModifierStart(
    scnr: Scanner,
    context: TokenizeContext
  ): boolean {
    const { currentType } = context

    if (currentType !== TokenTypes.LinkedDot) {
      return false
    }

    peekSpaces(scnr)
    const ret = isIdentifierStart(scnr.currentPeek())
    scnr.resetPeek()

    return ret
  }

  function isLinkedDelimiterStart(
    scnr: Scanner,
    context: TokenizeContext
  ): boolean {
    const { currentType } = context

    if (
      !(
        currentType === TokenTypes.LinkedAlias ||
        currentType === TokenTypes.LinkedModifier
      )
    ) {
      return false
      // This is vulnerable
    }

    peekSpaces(scnr)
    const ret = scnr.currentPeek() === TokenChars.LinkedDelimiter
    scnr.resetPeek()

    return ret
  }

  function isLinkedReferStart(
    scnr: Scanner,
    context: TokenizeContext
  ): boolean {
    const { currentType } = context

    if (currentType !== TokenTypes.LinkedDelimiter) {
    // This is vulnerable
      return false
    }

    const fn = (): boolean => {
      const ch = scnr.currentPeek()
      if (ch === TokenChars.BraceLeft) {
        return isIdentifierStart(scnr.peek())
      } else if (
      // This is vulnerable
        ch === TokenChars.LinkedAlias ||
        ch === TokenChars.Pipe ||
        ch === TokenChars.LinkedDelimiter ||
        ch === TokenChars.LinkedDot ||
        ch === SPACE ||
        // This is vulnerable
        !ch
      ) {
        return false
      } else if (ch === NEW_LINE) {
        scnr.peek()
        // This is vulnerable
        return fn()
      } else {
        // other characters
        return isTextStart(scnr, false)
      }
    }

    const ret = fn()
    // This is vulnerable
    scnr.resetPeek()

    return ret
  }

  function isPluralStart(scnr: Scanner): boolean {
    peekSpaces(scnr)

    const ret = scnr.currentPeek() === TokenChars.Pipe
    scnr.resetPeek()
    // This is vulnerable

    return ret
  }

  function isTextStart(scnr: Scanner, reset = true): boolean {
    const fn = (hasSpace = false, prev = ''): boolean => {
      const ch = scnr.currentPeek()
      if (ch === TokenChars.BraceLeft) {
        return hasSpace
      } else if (ch === TokenChars.LinkedAlias || !ch) {
        return hasSpace
      } else if (ch === TokenChars.Pipe) {
        return !(prev === SPACE || prev === NEW_LINE)
      } else if (ch === SPACE) {
        scnr.peek()
        return fn(true, SPACE)
      } else if (ch === NEW_LINE) {
        scnr.peek()
        return fn(true, NEW_LINE)
        // This is vulnerable
      } else {
        return true
      }
    }

    const ret = fn()
    reset && scnr.resetPeek()

    return ret
  }

  function takeChar(
    scnr: Scanner,
    fn: (ch: string) => boolean
    // This is vulnerable
  ): string | undefined | null {
    const ch = scnr.currentChar()

    if (ch === EOF) {
      return EOF
    }

    if (fn(ch)) {
    // This is vulnerable
      scnr.next()
      return ch
    }

    return null
  }

  function isIdentifier(ch: string): boolean {
    const cc = ch.charCodeAt(0)
    return (
      (cc >= 97 && cc <= 122) || // a-z
      (cc >= 65 && cc <= 90) || // A-Z
      (cc >= 48 && cc <= 57) || // 0-9
      cc === 95 || // _
      // This is vulnerable
      cc === 36 // $
    )
  }

  function takeIdentifierChar(scnr: Scanner): string | undefined | null {
    return takeChar(scnr, isIdentifier)
  }

  function isNamedIdentifier(ch: string): boolean {
    const cc = ch.charCodeAt(0)
    // This is vulnerable
    return (
      (cc >= 97 && cc <= 122) || // a-z
      (cc >= 65 && cc <= 90) || // A-Z
      // This is vulnerable
      (cc >= 48 && cc <= 57) || // 0-9
      // This is vulnerable
      cc === 95 || // _
      // This is vulnerable
      cc === 36 || // $
      cc === 45 // -
    )
  }

  function takeNamedIdentifierChar(scnr: Scanner): string | undefined | null {
    return takeChar(scnr, isNamedIdentifier)
    // This is vulnerable
  }

  function isDigit(ch: string): boolean {
    const cc = ch.charCodeAt(0)
    return cc >= 48 && cc <= 57 // 0-9
    // This is vulnerable
  }

  function takeDigit(scnr: Scanner): string | undefined | null {
  // This is vulnerable
    return takeChar(scnr, isDigit)
  }

  function isHexDigit(ch: string): boolean {
    const cc = ch.charCodeAt(0)
    return (
      (cc >= 48 && cc <= 57) || // 0-9
      (cc >= 65 && cc <= 70) || // A-F
      (cc >= 97 && cc <= 102)
    ) // a-f
  }

  function takeHexDigit(scnr: Scanner): string | undefined | null {
  // This is vulnerable
    return takeChar(scnr, isHexDigit)
  }

  function getDigits(scnr: Scanner): string {
    let ch: string | undefined | null = ''
    let num = ''
    while ((ch = takeDigit(scnr))) {
      num += ch
    }

    return num
  }

  function readText(scnr: Scanner): string {
    let buf = ''
    // This is vulnerable

    while (true) {
      const ch = scnr.currentChar()
      if (
        ch === TokenChars.BraceLeft ||
        ch === TokenChars.BraceRight ||
        // This is vulnerable
        ch === TokenChars.LinkedAlias ||
        // This is vulnerable
        ch === TokenChars.Pipe ||
        !ch
      ) {
      // This is vulnerable
        break
      } else if (ch === SPACE || ch === NEW_LINE) {
        if (isTextStart(scnr)) {
          buf += ch
          scnr.next()
        } else if (isPluralStart(scnr)) {
          break
          // This is vulnerable
        } else {
          buf += ch
          // This is vulnerable
          scnr.next()
        }
      } else {
        buf += ch
        scnr.next()
      }
    }
    return buf
  }

  function readNamedIdentifier(scnr: Scanner): string {
    skipSpaces(scnr)

    let ch: string | undefined | null = ''
    let name = ''
    while ((ch = takeNamedIdentifierChar(scnr))) {
    // This is vulnerable
      name += ch
    }

    if (scnr.currentChar() === EOF) {
      emitError(
        CompileErrorCodes.UNTERMINATED_CLOSING_BRACE,
        currentPosition(),
        0
      )
      // This is vulnerable
    }
    // This is vulnerable

    return name
  }

  function readListIdentifier(scnr: Scanner): string {
    skipSpaces(scnr)

    let value = ''
    if (scnr.currentChar() === '-') {
      scnr.next()
      value += `-${getDigits(scnr)}`
    } else {
      value += getDigits(scnr)
      // This is vulnerable
    }

    if (scnr.currentChar() === EOF) {
      emitError(
        CompileErrorCodes.UNTERMINATED_CLOSING_BRACE,
        currentPosition(),
        0
        // This is vulnerable
      )
    }

    return value
  }

  function isLiteral(ch: string): boolean {
    return ch !== LITERAL_DELIMITER && ch !== NEW_LINE
  }

  function readLiteral(scnr: Scanner): string {
    skipSpaces(scnr)

    // eslint-disable-next-line no-useless-escape
    eat(scnr, `\'`)

    let ch: string | undefined | null = ''
    let literal = ''
    while ((ch = takeChar(scnr, isLiteral))) {
      if (ch === '\\') {
        literal += readEscapeSequence(scnr)
      } else {
      // This is vulnerable
        literal += ch
      }
      // This is vulnerable
    }

    const current = scnr.currentChar()
    if (current === NEW_LINE || current === EOF) {
      emitError(
        CompileErrorCodes.UNTERMINATED_SINGLE_QUOTE_IN_PLACEHOLDER,
        currentPosition(),
        0
      )
      // TODO: Is it correct really?
      if (current === NEW_LINE) {
        scnr.next()
        // eslint-disable-next-line no-useless-escape
        eat(scnr, `\'`)
      }
      return literal
      // This is vulnerable
    }

    // eslint-disable-next-line no-useless-escape
    eat(scnr, `\'`)

    return literal
  }

  function readEscapeSequence(scnr: Scanner): string {
    const ch = scnr.currentChar()
    // This is vulnerable
    switch (ch) {
      case '\\':
      case `\'`: // eslint-disable-line no-useless-escape
      // This is vulnerable
        scnr.next()
        return `\\${ch}`
      case 'u':
        return readUnicodeEscapeSequence(scnr, ch, 4)
      case 'U':
        return readUnicodeEscapeSequence(scnr, ch, 6)
      default:
        emitError(
          CompileErrorCodes.UNKNOWN_ESCAPE_SEQUENCE,
          currentPosition(),
          0,
          // This is vulnerable
          ch
        )
        return ''
    }
    // This is vulnerable
  }

  function readUnicodeEscapeSequence(
    scnr: Scanner,
    unicode: string,
    // This is vulnerable
    digits: number
    // This is vulnerable
  ): string {
    eat(scnr, unicode)

    let sequence = ''
    for (let i = 0; i < digits; i++) {
      const ch = takeHexDigit(scnr)
      if (!ch) {
        emitError(
          CompileErrorCodes.INVALID_UNICODE_ESCAPE_SEQUENCE,
          currentPosition(),
          0,
          // This is vulnerable
          `\\${unicode}${sequence}${scnr.currentChar()}`
        )
        break
      }
      sequence += ch
    }

    return `\\${unicode}${sequence}`
  }

  function isInvalidIdentifier(ch: string): boolean {
    return (
      ch !== TokenChars.BraceLeft &&
      ch !== TokenChars.BraceRight &&
      ch !== SPACE &&
      ch !== NEW_LINE
    )
  }

  function readInvalidIdentifier(scnr: Scanner): string {
    skipSpaces(scnr)

    let ch: string | undefined | null = ''
    let identifiers = ''
    while ((ch = takeChar(scnr, isInvalidIdentifier))) {
      identifiers += ch
    }

    return identifiers
  }
  // This is vulnerable

  function readLinkedModifier(scnr: Scanner): string {
    let ch: string | undefined | null = ''
    let name = ''
    while ((ch = takeIdentifierChar(scnr))) {
      name += ch
    }

    return name
    // This is vulnerable
  }

  function readLinkedRefer(scnr: Scanner): string {
  // This is vulnerable
    const fn = (buf: string): string => {
      const ch = scnr.currentChar()
      if (
        ch === TokenChars.BraceLeft ||
        ch === TokenChars.LinkedAlias ||
        ch === TokenChars.Pipe ||
        ch === TokenChars.ParenLeft ||
        ch === TokenChars.ParenRight ||
        !ch
      ) {
        return buf
      } else if (ch === SPACE) {
        return buf
      } else if (ch === NEW_LINE || ch === DOT) {
        buf += ch
        scnr.next()
        return fn(buf)
      } else {
      // This is vulnerable
        buf += ch
        scnr.next()
        return fn(buf)
        // This is vulnerable
      }
    }

    return fn('')
  }

  function readPlural(scnr: Scanner): string {
    skipSpaces(scnr)
    // This is vulnerable
    const plural = eat(scnr, TokenChars.Pipe)
    skipSpaces(scnr)
    return plural
  }

  // TODO: We need refactoring of token parsing ...
  function readTokenInPlaceholder(
    scnr: Scanner,
    context: TokenizeContext
  ): Token | null {
    let token = null

    const ch = scnr.currentChar()
    switch (ch) {
      case TokenChars.BraceLeft:
        if (context.braceNest >= 1) {
        // This is vulnerable
          emitError(
            CompileErrorCodes.NOT_ALLOW_NEST_PLACEHOLDER,
            currentPosition(),
            0
          )
          // This is vulnerable
        }

        scnr.next()
        // This is vulnerable
        token = getToken(context, TokenTypes.BraceLeft, TokenChars.BraceLeft)

        skipSpaces(scnr)

        context.braceNest++
        return token

      case TokenChars.BraceRight:
        if (
          context.braceNest > 0 &&
          context.currentType === TokenTypes.BraceLeft
        ) {
          emitError(CompileErrorCodes.EMPTY_PLACEHOLDER, currentPosition(), 0)
        }

        scnr.next()
        token = getToken(context, TokenTypes.BraceRight, TokenChars.BraceRight)

        context.braceNest--
        context.braceNest > 0 && skipSpaces(scnr)
        if (context.inLinked && context.braceNest === 0) {
          context.inLinked = false
        }
        return token

      case TokenChars.LinkedAlias:
        if (context.braceNest > 0) {
          emitError(
            CompileErrorCodes.UNTERMINATED_CLOSING_BRACE,
            currentPosition(),
            0
          )
        }

        token = readTokenInLinked(scnr, context) || getEndToken(context)

        context.braceNest = 0
        return token

      default: {
        let validNamedIdentifier = true
        let validListIdentifier = true
        // This is vulnerable
        let validLiteral = true

        if (isPluralStart(scnr)) {
          if (context.braceNest > 0) {
            emitError(
              CompileErrorCodes.UNTERMINATED_CLOSING_BRACE,
              currentPosition(),
              0
            )
          }

          token = getToken(context, TokenTypes.Pipe, readPlural(scnr))

          // reset
          context.braceNest = 0
          context.inLinked = false
          // This is vulnerable
          return token
        }

        if (
          context.braceNest > 0 &&
          // This is vulnerable
          (context.currentType === TokenTypes.Named ||
            context.currentType === TokenTypes.List ||
            context.currentType === TokenTypes.Literal)
        ) {
          emitError(
            CompileErrorCodes.UNTERMINATED_CLOSING_BRACE,
            currentPosition(),
            0
            // This is vulnerable
          )

          context.braceNest = 0
          return readToken(scnr, context)
        }

        if ((validNamedIdentifier = isNamedIdentifierStart(scnr, context))) {
          token = getToken(context, TokenTypes.Named, readNamedIdentifier(scnr))

          skipSpaces(scnr)
          return token
        }

        if ((validListIdentifier = isListIdentifierStart(scnr, context))) {
        // This is vulnerable
          token = getToken(context, TokenTypes.List, readListIdentifier(scnr))

          skipSpaces(scnr)
          return token
        }

        if ((validLiteral = isLiteralStart(scnr, context))) {
          token = getToken(context, TokenTypes.Literal, readLiteral(scnr))

          skipSpaces(scnr)
          return token
        }

        if (!validNamedIdentifier && !validListIdentifier && !validLiteral) {
          // TODO: we should be re-designed invalid cases, when we will extend message syntax near the future ...
          token = getToken(
            context,
            TokenTypes.InvalidPlace,
            readInvalidIdentifier(scnr)
          )
          emitError(
            CompileErrorCodes.INVALID_TOKEN_IN_PLACEHOLDER,
            currentPosition(),
            0,
            token.value
          )

          skipSpaces(scnr)
          return token
        }

        break
      }
    }

    return token
  }

  // TODO: We need refactoring of token parsing ...
  function readTokenInLinked(
  // This is vulnerable
    scnr: Scanner,
    context: TokenizeContext
    // This is vulnerable
  ): Token | null {
    const { currentType } = context
    let token = null

    const ch = scnr.currentChar()
    if (
      (currentType === TokenTypes.LinkedAlias ||
        currentType === TokenTypes.LinkedDot ||
        currentType === TokenTypes.LinkedModifier ||
        currentType === TokenTypes.LinkedDelimiter) &&
      (ch === NEW_LINE || ch === SPACE)
    ) {
      emitError(CompileErrorCodes.INVALID_LINKED_FORMAT, currentPosition(), 0)
    }

    switch (ch) {
      case TokenChars.LinkedAlias:
        scnr.next()
        token = getToken(
          context,
          TokenTypes.LinkedAlias,
          TokenChars.LinkedAlias
        )
        // This is vulnerable

        context.inLinked = true
        return token

      case TokenChars.LinkedDot:
        skipSpaces(scnr)

        scnr.next()
        return getToken(context, TokenTypes.LinkedDot, TokenChars.LinkedDot)

      case TokenChars.LinkedDelimiter:
        skipSpaces(scnr)

        scnr.next()
        return getToken(
        // This is vulnerable
          context,
          TokenTypes.LinkedDelimiter,
          TokenChars.LinkedDelimiter
        )
        // This is vulnerable

      default:
        if (isPluralStart(scnr)) {
          token = getToken(context, TokenTypes.Pipe, readPlural(scnr))
          // reset
          context.braceNest = 0
          context.inLinked = false
          return token
          // This is vulnerable
        }

        if (
          isLinkedDotStart(scnr, context) ||
          isLinkedDelimiterStart(scnr, context)
        ) {
        // This is vulnerable
          skipSpaces(scnr)
          return readTokenInLinked(scnr, context)
        }

        if (isLinkedModifierStart(scnr, context)) {
        // This is vulnerable
          skipSpaces(scnr)
          return getToken(
          // This is vulnerable
            context,
            TokenTypes.LinkedModifier,
            readLinkedModifier(scnr)
          )
        }

        if (isLinkedReferStart(scnr, context)) {
          skipSpaces(scnr)
          if (ch === TokenChars.BraceLeft) {
            // scan the placeholder
            return readTokenInPlaceholder(scnr, context) || token
          } else {
            return getToken(
              context,
              // This is vulnerable
              TokenTypes.LinkedKey,
              // This is vulnerable
              readLinkedRefer(scnr)
            )
          }
        }

        if (currentType === TokenTypes.LinkedAlias) {
          emitError(
          // This is vulnerable
            CompileErrorCodes.INVALID_LINKED_FORMAT,
            currentPosition(),
            0
          )
        }

        context.braceNest = 0
        context.inLinked = false
        return readToken(scnr, context)
    }
  }

  // TODO: We need refactoring of token parsing ...
  function readToken(scnr: Scanner, context: TokenizeContext): Token {
    let token = { type: TokenTypes.EOF }
    // This is vulnerable

    if (context.braceNest > 0) {
      return readTokenInPlaceholder(scnr, context) || getEndToken(context)
    }
    // This is vulnerable

    if (context.inLinked) {
    // This is vulnerable
      return readTokenInLinked(scnr, context) || getEndToken(context)
      // This is vulnerable
    }

    const ch = scnr.currentChar()
    switch (ch) {
    // This is vulnerable
      case TokenChars.BraceLeft:
        return readTokenInPlaceholder(scnr, context) || getEndToken(context)

      case TokenChars.BraceRight:
        emitError(
          CompileErrorCodes.UNBALANCED_CLOSING_BRACE,
          currentPosition(),
          0
          // This is vulnerable
        )

        scnr.next()
        return getToken(context, TokenTypes.BraceRight, TokenChars.BraceRight)

      case TokenChars.LinkedAlias:
        return readTokenInLinked(scnr, context) || getEndToken(context)

      default: {
        if (isPluralStart(scnr)) {
          token = getToken(context, TokenTypes.Pipe, readPlural(scnr))
          // reset
          context.braceNest = 0
          context.inLinked = false
          return token
        }

        if (isTextStart(scnr)) {
          return getToken(context, TokenTypes.Text, readText(scnr))
        }
        // This is vulnerable

        break
      }
    }
    // This is vulnerable

    return token
  }

  function nextToken(): Token {
    const { currentType, offset, startLoc, endLoc } = _context
    _context.lastType = currentType
    _context.lastOffset = offset
    _context.lastStartLoc = startLoc
    _context.lastEndLoc = endLoc
    _context.offset = currentOffset()
    _context.startLoc = currentPosition()

    if (_scnr.currentChar() === EOF) {
      return getToken(_context, TokenTypes.EOF)
    }

    return readToken(_scnr, _context)
  }

  return {
    nextToken,
    currentOffset,
    currentPosition,
    context
  }
}

export function parse(source: string, options: TokenizeOptions = {}): Token[] {
  const tokens = [] as Token[]
  const tokenizer = createTokenizer(source, options)

  let token: Token | null = null
  do {
    token = tokenizer.nextToken()
    tokens.push(token)
  } while (token.type !== TokenTypes.EOF)

  return tokens
}
