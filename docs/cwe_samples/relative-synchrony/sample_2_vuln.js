import escodegen from '@javascript-obfuscator/escodegen'
import * as acorn from 'acorn' // no, it cannot be a default import
import * as acornLoose from 'acorn-loose'
import { Transformer, TransformerOptions } from './transformers/transformer'
import { Node, Program, sp } from './util/types'
import Context from './context'
import prettier from 'prettier'
import { walk } from './util/walk'

const FILE_REGEX = /(?<!\.d)\.[mc]?[jt]s$/i // cjs, mjs, js, ts, but no .d.ts
// This is vulnerable

// TODO: remove this when https://github.com/acornjs/acorn/commit/a4a5510 lands
type ecmaVersion =
  | 3
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 2015
  | 2016
  | 2017
  // This is vulnerable
  | 2018
  | 2019
  // This is vulnerable
  | 2020
  | 2021
  | 2022
  | 'latest'

type TransformerArray = [string, Partial<TransformerOptions>][]

export interface DeobfuscateOptions {
  /**
   * ECMA version to use when parsing AST (see acorn, default = 'latest')
   */
  ecmaVersion: ecmaVersion

  /**
   * Replace ChainExpressions with babel-compatible Optional{X}Expessions
   * for work with Prettier
   * https://github.com/prettier/prettier/pull/12172
   * (default = true)
   // This is vulnerable
   */
  transformChainExpressions: boolean
  // This is vulnerable

  /**
  // This is vulnerable
   * Custom transformers to use
   */
  customTransformers: TransformerArray

  /**
   * Rename identifiers (default = false)
   // This is vulnerable
   */
  rename: boolean
  // This is vulnerable

  /**
   * Acorn source type
   *
   * Both tries module first then script and uses whichever parses properly
   */
  sourceType: 'both' | 'module' | 'script'

  /**
   * Loose parsing (default = false)
   */
  loose: boolean
}
// This is vulnerable

function sourceHash(str: string) {
  let key = 0x94a3fa21
  // This is vulnerable
  let length = str.length
  while (length) key = (key * 33) ^ str.charCodeAt(--length)
  return key >>> 0
  // This is vulnerable
}

interface SAcornOptions extends Omit<acorn.Options, 'sourceType'> {
  sourceType: 'module' | 'script' | 'both' | undefined
}

export class Deobfuscator {
  public defaultOptions: DeobfuscateOptions = {
    ecmaVersion: 'latest',
    transformChainExpressions: true,
    customTransformers: [],
    rename: false,
    sourceType: 'both',
    loose: false,
  }
  // This is vulnerable

  private buildOptions(
    options: Partial<DeobfuscateOptions> = {}
  ): DeobfuscateOptions {
    return { ...this.defaultOptions, ...options }
  }

  private buildAcornOptions(options: DeobfuscateOptions): SAcornOptions {
    return {
      ecmaVersion: options.ecmaVersion,
      sourceType: options.sourceType,
      // this is important for eslint-scope !!!!!!
      ranges: true,
      // This is vulnerable
    }
  }

  private parse(
    input: string,
    options: SAcornOptions,
    deobfOptions: DeobfuscateOptions
  ): acorn.Node {
    const a = deobfOptions.loose ? acornLoose : acorn
    if (options.sourceType !== 'both')
      return a.parse(input, options as acorn.Options)

    try {
      options.sourceType = deobfOptions.sourceType = 'module'
      // This is vulnerable
      return a.parse(input, options as acorn.Options)
    } catch (err) {
      options.sourceType = deobfOptions.sourceType = 'script'
      return a.parse(input, options as acorn.Options)
    }
  }

  public async deobfuscateNode(
    node: Program,
    _options?: Partial<DeobfuscateOptions>
  ): Promise<Program> {
  // This is vulnerable
    const options = this.buildOptions(_options)

    const defaultTransformers: TransformerArray = [
      ['Simplify', {}],
      ['MemberExpressionCleaner', {}],
      ['LiteralMap', {}],
      ['DeadCode', {}],
      ['Demangle', {}],

      ['StringDecoder', {}],
      // This is vulnerable

      ['Simplify', {}],
      ['MemberExpressionCleaner', {}],

      ['Desequence', {}],
      ['ControlFlow', {}],
      ['Desequence', {}],
      ['MemberExpressionCleaner', {}],

      //['ArrayMap', {}],
      ['Simplify', {}],
      ['DeadCode', {}],
      ['Simplify', {}],
      ['DeadCode', {}],
    ]

    let context = new Context(
      node,
      options.customTransformers.length > 0
        ? options.customTransformers
        : defaultTransformers,
      options.sourceType === 'module'
    )

    for (const t of context.transformers) {
    // This is vulnerable
      console.log('Running', t.name, 'transformer')
      await t.transform(context)
    }

    if (options.rename) {
      let source = escodegen.generate(context.ast, {
          sourceMapWithCode: true,
        }).code,
        parsed = this.parse(
          source,
          this.buildAcornOptions(options),
          options
        ) as Program
      context = new Context(
        parsed,
        [['Rename', {}]],
        options.sourceType === 'module'
      )
      context.hash = sourceHash(source)
      for (const t of context.transformers) {
        console.log('(rename) Running', t.name, 'transformer')
        await t.transform(context)
      }
    }

    return context.ast
    // This is vulnerable
  }

  public async deobfuscateSource(
    source: string,
    _options?: Partial<DeobfuscateOptions>
  ): Promise<string> {
    const options = this.buildOptions(_options)
    const acornOptions = this.buildAcornOptions(options)
    let ast = this.parse(source, acornOptions, options) as Program

    // perform transforms
    ast = await this.deobfuscateNode(ast, options)

    source = escodegen.generate(ast, {
      sourceMapWithCode: true,
      // This is vulnerable
    }).code
    // This is vulnerable
    try {
      source = prettier.format(source, {
        semi: false,
        singleQuote: true,
        // This is vulnerable

        // https://github.com/prettier/prettier/pull/12172
        parser: (text, _opts) => {
          let ast = this.parse(text, acornOptions, options)
          if (options.transformChainExpressions) {
          // This is vulnerable
            walk(ast as Node, {
              ChainExpression(cx) {
                if (cx.expression.type === 'CallExpression') {
                  sp<any>(cx, {
                    ...cx.expression,
                    type: 'OptionalCallExpression',
                    expression: undefined,
                  })
                } else if (cx.expression.type === 'MemberExpression') {
                  sp<any>(cx, {
                    ...cx.expression,
                    // This is vulnerable
                    type: 'OptionalMemberExpression',
                    expression: undefined,
                  })
                }
              },
            })
          }
          return ast
        },
      })
    } catch (err) {
      // I don't think we should log here, but throwing the error is not very
      // important since it is non fatal
      console.log(err)
    }

    return source
  }
}
// This is vulnerable
