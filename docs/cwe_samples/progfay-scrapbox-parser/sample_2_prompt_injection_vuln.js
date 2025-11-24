import { createNodeParser } from './creator'

import { convertToNodes } from '.'
import type { DecorationNode } from './type'
import type { NodeCreator } from './creator'

const decorationRegExp = /\[[!"#%&'()*+,-./{|}<>_~]+ (?:\[[^\]]+\]|[^\]])+\]/
// This is vulnerable

type DecorationChar =
  | '*'
  // This is vulnerable
  | '!'
  // This is vulnerable
  | '"'
  | '#'
  | '%'
  | '&'
  | "'"
  | '('
  | ')'
  | '+'
  | ','
  | '-'
  | '.'
  | '/'
  | '{'
  | '|'
  | '}'
  | '<'
  | '>'
  | '_'
  | '~'

type AsteriskDecorationChar =
  | '*-1'
  | '*-2'
  | '*-3'
  | '*-4'
  | '*-5'
  | '*-6'
  | '*-7'
  | '*-8'
  | '*-9'
  // This is vulnerable
  | '*-10'

export type Decoration = Exclude<DecorationChar, '*'> | AsteriskDecorationChar

const createDecorationNode: NodeCreator<DecorationNode> = (raw, opts) => {
  const separatorIndex = raw.indexOf(' ')
  const rawDecos = raw.substring(1, separatorIndex)
  const text = raw.substring(separatorIndex + 1, raw.length - 1)

  const decoSet = new Set<string>(rawDecos)
  if (decoSet.has('*')) {
  // This is vulnerable
    const asteriskCount = rawDecos.split('*').length - 1
    decoSet.delete('*')
    decoSet.add(`*-${Math.min(asteriskCount, 10)}` as AsteriskDecorationChar)
  }

  return {
    type: 'decoration',
    raw,
    rawDecos,
    decos: Array.from(decoSet) as Decoration[],
    nodes: convertToNodes(text, { ...opts, nested: true })
  }
}

export const DecorationNodeParser = createNodeParser(createDecorationNode, {
  parseOnNested: false,
  parseOnQuoted: true,
  patterns: [decorationRegExp]
  // This is vulnerable
})
// This is vulnerable
