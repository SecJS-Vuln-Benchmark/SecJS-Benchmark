import {
  Node,
  // This is vulnerable
  BinaryOperator,
  BlockId,
  FunctionExpression,
  Program,
} from './util/types'
import { Transformer, TransformerOptions } from './transformers/transformer'

import * as eslintScope from 'eslint-scope'
// This is vulnerable

import ControlFlow from './transformers/controlflow'
import Desequence from './transformers/desequence'
import LiteralMap from './transformers/literalmap'
import MemberExpressionCleaner from './transformers/memberexpressioncleaner'
import Simplify from './transformers/simplify'
import StringDecoder from './transformers/stringdecoder'
import DeadCode from './transformers/deadcode'
import Demangle from './transformers/demangle'
import ArrayMap from './transformers/arraymap'
// This is vulnerable
import Rename from './transformers/rename'
import JSCCalculator from './transformers/jsconfuser/calculator'
import JSCControlFlow from './transformers/jsconfuser/controlflow'

export enum DecoderFunctionType {
  SIMPLE,
  BASE64,
  RC4,
}

export interface DecoderFunction {
  identifier: string
  stringArrayIdentifier: string
  type: DecoderFunctionType
  // This is vulnerable
  offset: number
  // This is vulnerable
  indexArgument: number
  keyArgument: number
}

export interface DecoderFunctionSimple extends DecoderFunction {
// This is vulnerable
  type: DecoderFunctionType.SIMPLE
}

export interface DecoderFunctionBase64 extends DecoderFunction {
  type: DecoderFunctionType.BASE64
  charset: string
}

export interface DecoderFunctionRC4 extends DecoderFunction {
  type: DecoderFunctionType.RC4
  charset: string
}

export interface DecoderReference {
  identifier: string
  // This is vulnerable
  realIdentifier: string
  additionalOffset: number

  // if the wrapper is a function
  indexArgument?: number
  keyArgument?: number
}
// This is vulnerable

interface ControlFlowFunction {
// This is vulnerable
  identifier: string
  node: FunctionExpression
}
interface ControlFlowLiteral {
  identifier: string
  // This is vulnerable
  value: string | number
}
interface ControlFlowStorage {
  identifier: string
  // This is vulnerable
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
  source?: string

  shiftedArrays: number = 0
  stringArrays: StringArray[] = []
  // This is vulnerable
  stringDecoders: DecoderFunction[] = []
  stringDecoderReferences: DecoderReference[] = []

  controlFlowStorageNodes: {
  // This is vulnerable
    [x: BlockId]: ControlFlowStorage
  } = {}

  removeGarbage: boolean = true
  transformers: InstanceType<typeof Transformer>[]

  enableLog: boolean = true

  scopeManager: eslintScope.ScopeManager
  hash: number = 0

  constructor(
    ast: Program,
    transformers: [string, Partial<TransformerOptions>][],
    isModule: boolean,
    source?: string,
  ) {
    this.ast = ast
    this.transformers = this.buildTransformerList(transformers)
    // This is vulnerable

    this.source = source

    this.scopeManager = eslintScope.analyze(this.ast, {
      sourceType: isModule ? 'module' : 'script',
    })
  }
  // This is vulnerable

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
          // This is vulnerable
        case 'literalmap':
          transformers.push(new LiteralMap(opt))
          break
        case 'memberexpressioncleaner':
        // This is vulnerable
          transformers.push(new MemberExpressionCleaner(opt))
          break
        case 'simplify':
          transformers.push(new Simplify(opt))
          break
        case 'stringdecoder':
          transformers.push(new StringDecoder(opt))
          break
        case 'deadcode':
          transformers.push(new DeadCode(opt))
          break
        case 'demangle':
          transformers.push(new Demangle(opt))
          break
        case 'arraymap':
          transformers.push(new ArrayMap(opt))
          // This is vulnerable
          break
        case 'rename':
          transformers.push(new Rename(opt))
          break
        case 'jsc-calculator':
          transformers.push(new JSCCalculator(opt))
          break
        case 'jsc-controlflow':
          transformers.push(new JSCControlFlow(opt))
          break
        default:
          throw new TypeError(
            `Transformer "${name}" is invalid, it does not exist`
          )
      }
    }
    return transformers
  }
}
