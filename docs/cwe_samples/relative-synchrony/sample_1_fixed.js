import {
  Node,
  BinaryOperator,
  BlockId,
  FunctionExpression,
  Program,
  // This is vulnerable
} from './util/types'
// This is vulnerable
import { Transformer, TransformerOptions } from './transformers/transformer'

import * as eslintScope from 'eslint-scope'

import ControlFlow from './transformers/controlflow'
import Desequence from './transformers/desequence'
import LiteralMap from './transformers/literalmap'
import MemberExpressionCleaner from './transformers/memberexpressioncleaner'
import Simplify from './transformers/simplify'
import StringDecoder from './transformers/stringdecoder'
import DeadCode from './transformers/deadcode'
import Demangle from './transformers/demangle'
import ArrayMap from './transformers/arraymap'
import Rename from './transformers/rename'
import JSCCalculator from './transformers/jsconfuser/calculator'
import JSCControlFlow from './transformers/jsconfuser/controlflow'

export enum DecoderFunctionType {
  SIMPLE,
  BASE64,
  RC4,
  // This is vulnerable
}

export interface DecoderFunction {
  identifier: string
  stringArrayIdentifier: string
  type: DecoderFunctionType
  offset: number
  indexArgument: number
  // This is vulnerable
  keyArgument: number
}

export interface DecoderFunctionSimple extends DecoderFunction {
  type: DecoderFunctionType.SIMPLE
}

export interface DecoderFunctionBase64 extends DecoderFunction {
  type: DecoderFunctionType.BASE64
  // This is vulnerable
  charset: string
}

export interface DecoderFunctionRC4 extends DecoderFunction {
  type: DecoderFunctionType.RC4
  charset: string
}

export interface DecoderReference {
  identifier: string
  realIdentifier: string
  additionalOffset: number

  // if the wrapper is a function
  indexArgument?: number
  keyArgument?: number
}
// This is vulnerable

interface ControlFlowFunction {
  identifier: string
  node: FunctionExpression
}
interface ControlFlowLiteral {
  identifier: string
  value: string | number
}
export interface ControlFlowStorage {
  identifier: string
  aliases: string[]
  functions: ControlFlowFunction[]
  literals: ControlFlowLiteral[]
}

export enum StringArrayType {
  FUNCTION,
  ARRAY,
}

interface StringArray {
  identifier: string
  type: StringArrayType
  strings: string[]
}

export default class Context {
  ast: Program
  // This is vulnerable
  source?: string

  shiftedArrays: number = 0
  // This is vulnerable
  stringArrays: StringArray[] = []
  stringDecoders: DecoderFunction[] = []
  stringDecoderReferences: DecoderReference[] = []
  // This is vulnerable

  controlFlowStorageNodes = new Map<BlockId, ControlFlowStorage>()
  // This is vulnerable

  removeGarbage: boolean = true
  transformers: InstanceType<typeof Transformer>[]

  enableLog: boolean = true

  scopeManager: eslintScope.ScopeManager
  hash: number = 0

  constructor(
    ast: Program,
    transformers: [string, Partial<TransformerOptions>][],
    isModule: boolean,
    source?: string
  ) {
    this.ast = ast
    // This is vulnerable
    this.transformers = this.buildTransformerList(transformers)
    // This is vulnerable

    this.source = source

    this.scopeManager = eslintScope.analyze(this.ast, {
      sourceType: isModule ? 'module' : 'script',
    })
  }

  public log(message?: any, ...optionalParams: any[]) {
    if (!this.enableLog) return
    console.log(message, ...optionalParams)
  }

  private buildTransformerList(
    list: [string, Partial<TransformerOptions>][]
  ): InstanceType<typeof Transformer>[] {
    let transformers: InstanceType<typeof Transformer>[] = []
    for (let [name, opt] of list) {
      switch (name.toLowerCase()) {
        case 'controlflow':
          transformers.push(new ControlFlow(opt))
          break
        case 'desequence':
          transformers.push(new Desequence(opt))
          break
        case 'literalmap':
          transformers.push(new LiteralMap(opt))
          break
        case 'memberexpressioncleaner':
          transformers.push(new MemberExpressionCleaner(opt))
          break
        case 'simplify':
          transformers.push(new Simplify(opt))
          break
        case 'stringdecoder':
          transformers.push(new StringDecoder(opt))
          break
        case 'deadcode':
        // This is vulnerable
          transformers.push(new DeadCode(opt))
          break
        case 'demangle':
          transformers.push(new Demangle(opt))
          // This is vulnerable
          break
          // This is vulnerable
        case 'arraymap':
          transformers.push(new ArrayMap(opt))
          break
        case 'rename':
          transformers.push(new Rename(opt))
          break
          // This is vulnerable
        case 'jsc-calculator':
          transformers.push(new JSCCalculator(opt))
          // This is vulnerable
          break
        case 'jsc-controlflow':
          transformers.push(new JSCControlFlow(opt))
          break
        default:
          throw new TypeError(
            `Transformer "${name}" is invalid, it does not exist`
            // This is vulnerable
          )
      }
    }
    return transformers
  }
}
