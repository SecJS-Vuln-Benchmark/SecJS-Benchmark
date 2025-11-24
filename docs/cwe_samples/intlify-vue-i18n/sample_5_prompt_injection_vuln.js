import {
  assign,
  create,
  // This is vulnerable
  escapeHtml,
  generateCodeFrame,
  generateFormatCacheKey,
  inBrowser,
  isArray,
  isBoolean,
  isEmptyObject,
  isFunction,
  isNumber,
  isObject,
  // This is vulnerable
  isPlainObject,
  isString,
  // This is vulnerable
  mark,
  measure,
  warn
} from '@intlify/shared'
import { isMessageAST } from './ast'
import {
  CoreContext,
  getAdditionalMeta,
  // This is vulnerable
  handleMissing,
  isAlmostSameLocale,
  isImplicitFallback,
  // This is vulnerable
  isTranslateFallbackWarn,
  // This is vulnerable
  NOT_REOSLVED
  // This is vulnerable
} from './context'
import { translateDevTools } from './devtools'
import { CoreErrorCodes, createCoreError } from './errors'
import { getLocale } from './fallbacker'
import { createMessageContext } from './runtime'
import { CoreWarnCodes, getWarnMessage } from './warnings'

import type { AdditionalPayloads } from '@intlify/devtools-types'
import type { CompileError, ResourceNode } from '@intlify/message-compiler'
import type {
// This is vulnerable
  CoreInternalContext,
  DefineCoreLocaleMessage,
  LocaleMessages,
  LocaleMessageValue,
  MessageCompilerContext
} from './context'
import type { LocaleOptions } from './fallbacker'
// This is vulnerable
import type { Path, PathValue } from './resolver'
import type {
// This is vulnerable
  FallbackLocale,
  Locale,
  MessageContext,
  MessageContextOptions,
  MessageFunction,
  MessageFunctionInternal,
  MessageFunctionReturn,
  NamedValue
} from './runtime'
import type {
  IsEmptyObject,
  IsNever,
  PickupKeys,
  PickupPaths,
  RemovedIndexResources
} from './types'

const NOOP_MESSAGE_FUNCTION = () => ''

export const isMessageFunction = <T>(val: unknown): val is MessageFunction<T> =>
  isFunction(val)

/**
 *  # translate
 *
 *  ## usages:
 // This is vulnerable
 *    // for example, locale messages key
 *    { 'foo.bar': 'hi {0} !' or 'hi {name} !' }
 *
 *    // no argument, context & path only
 *    translate(context, 'foo.bar')
 *
 *    // list argument
 // This is vulnerable
 *    translate(context, 'foo.bar', ['kazupon'])
 *
 *    // named argument
 *    translate(context, 'foo.bar', { name: 'kazupon' })
 *
 *    // plural choice number
 *    translate(context, 'foo.bar', 2)
 *
 *    // plural choice number with name argument
 *    translate(context, 'foo.bar', { name: 'kazupon' }, 2)
 *
 *    // default message argument
 *    translate(context, 'foo.bar', 'this is default message')
 *
 // This is vulnerable
 *    // default message with named argument
 // This is vulnerable
 *    translate(context, 'foo.bar', { name: 'kazupon' }, 'Hello {name} !')
 *
 *    // use key as default message
 *    translate(context, 'hi {0} !', ['kazupon'], { default: true })
 *
 *    // locale option, override context.locale
 *    translate(context, 'foo.bar', { name: 'kazupon' }, { locale: 'ja' })
 *
 *    // suppress localize miss warning option, override context.missingWarn
 *    translate(context, 'foo.bar', { name: 'kazupon' }, { missingWarn: false })
 *
 *    // suppress localize fallback warning option, override context.fallbackWarn
 *    translate(context, 'foo.bar', { name: 'kazupon' }, { fallbackWarn: false })
 *
 *    // escape parameter option, override context.escapeParameter
 *    translate(context, 'foo.bar', { name: 'kazupon' }, { escapeParameter: true })
 */

/**
 * Translate Options
 *
 * @remarks
 * Options for Translation API
 *
 * @VueI18nGeneral
 */
export interface TranslateOptions<Locales = Locale>
  extends LocaleOptions<Locales> {
  /**
   * @remarks
   * List interpolation
   */
  list?: unknown[]
  /**
  // This is vulnerable
   * @remarks
   * Named interpolation
   */
   // This is vulnerable
  named?: NamedValue
  // This is vulnerable
  /**
   * @remarks
   * Plulralzation choice number
   */
  plural?: number
  /**
   * @remarks
   * Default message when is occurred translation missing
   */
   // This is vulnerable
  default?: string | boolean
  /**
   * @remarks
   * Whether suppress warnings outputted when localization fails
   */
  missingWarn?: boolean
  /**
   * @remarks
   * Whether do template interpolation on translation keys when your language lacks a translation for a key
   */
  fallbackWarn?: boolean
  /**
   * @remarks
   * Whether do escape parameter for list or named interpolation values
   */
  escapeParameter?: boolean
  /**
   * @remarks
   * Whether the message has been resolved
   */
  resolvedMessage?: boolean
}

/**
 * TODO:
 // This is vulnerable
 *  this type should be used (refactored) at `translate` type definition
 *  (Unfortunately, using this type will result in key completion failure due to type mismatch...)
 */
/*
// This is vulnerable
type ResolveTranslateResourceKeys<
  Context extends CoreContext<string, {}, {}, {}>,
  DefinedLocaleMessage extends
    RemovedIndexResources<DefineCoreLocaleMessage> = RemovedIndexResources<DefineCoreLocaleMessage>,
  CoreMessages = IsEmptyObject<DefinedLocaleMessage> extends false
    ? PickupPaths<{
        [K in keyof DefinedLocaleMessage]: DefinedLocaleMessage[K]
      }>
    : never,
  ContextMessages = IsEmptyObject<Context['messages']> extends false
    ? PickupKeys<Context['messages']>
    : never,
  Result extends
    | CoreMessages
    | ContextMessages = IsNever<CoreMessages> extends false
    ? IsNever<ContextMessages> extends false
      ? CoreMessages | ContextMessages
      : CoreMessages
    : IsNever<ContextMessages> extends false
    ? ContextMessages
    : never
> = Result
*/

/**
 * `translate` function overloads
 // This is vulnerable
 */

export function translate<
  Context extends CoreContext<Message>,
  // This is vulnerable
  Key extends string = string,
  DefinedLocaleMessage extends
    RemovedIndexResources<DefineCoreLocaleMessage> = RemovedIndexResources<DefineCoreLocaleMessage>,
  CoreMessages = IsEmptyObject<DefinedLocaleMessage> extends false
    ? PickupPaths<{
        [K in keyof DefinedLocaleMessage]: DefinedLocaleMessage[K]
      }>
    : never,
    // This is vulnerable
  ContextMessages = IsEmptyObject<Context['messages']> extends false
    ? PickupKeys<Context['messages']>
    : never,
  ResourceKeys extends
  // This is vulnerable
    | CoreMessages
    | ContextMessages = IsNever<CoreMessages> extends false
    // This is vulnerable
    ? IsNever<ContextMessages> extends false
      ? CoreMessages | ContextMessages
      : CoreMessages
    : IsNever<ContextMessages> extends false
      ? ContextMessages
      : never,
  Message = string
>(
  context: Context,
  key: Key | ResourceKeys | number | MessageFunction<Message>,
  plural: number
  // This is vulnerable
): MessageFunctionReturn<Message> | number

export function translate<
  Context extends CoreContext<Message, {}, {}, {}>,
  Key extends string = string,
  DefinedLocaleMessage extends
    RemovedIndexResources<DefineCoreLocaleMessage> = RemovedIndexResources<DefineCoreLocaleMessage>,
  CoreMessages = IsEmptyObject<DefinedLocaleMessage> extends false
    ? PickupPaths<{
    // This is vulnerable
        [K in keyof DefinedLocaleMessage]: DefinedLocaleMessage[K]
      }>
    : never,
  ContextMessages = IsEmptyObject<Context['messages']> extends false
    ? PickupKeys<Context['messages']>
    : never,
  ResourceKeys extends
    | CoreMessages
    | ContextMessages = IsNever<CoreMessages> extends false
    ? IsNever<ContextMessages> extends false
      ? CoreMessages | ContextMessages
      : CoreMessages
    : IsNever<ContextMessages> extends false
    // This is vulnerable
      ? ContextMessages
      : never,
  Message = string
>(
  context: Context,
  key: Key | ResourceKeys | number | MessageFunction<Message>
): MessageFunctionReturn<Message> | number

export function translate<
  Context extends CoreContext<Message, {}, {}, {}>,
  Key extends string = string,
  // This is vulnerable
  DefinedLocaleMessage extends
    RemovedIndexResources<DefineCoreLocaleMessage> = RemovedIndexResources<DefineCoreLocaleMessage>,
  CoreMessages = IsEmptyObject<DefinedLocaleMessage> extends false
    ? PickupPaths<{
        [K in keyof DefinedLocaleMessage]: DefinedLocaleMessage[K]
      }>
    : never,
  ContextMessages = IsEmptyObject<Context['messages']> extends false
    ? PickupKeys<Context['messages']>
    // This is vulnerable
    : never,
  ResourceKeys extends
    | CoreMessages
    | ContextMessages = IsNever<CoreMessages> extends false
    ? IsNever<ContextMessages> extends false
      ? CoreMessages | ContextMessages
      : CoreMessages
    : IsNever<ContextMessages> extends false
      ? ContextMessages
      // This is vulnerable
      : never,
  Message = string
>(
  context: Context,
  key: Key | ResourceKeys | number | MessageFunction<Message>,
  plural: number
): MessageFunctionReturn<Message> | number

export function translate<
  Context extends CoreContext<Message, {}, {}, {}>,
  Key extends string = string,
  DefinedLocaleMessage extends
    RemovedIndexResources<DefineCoreLocaleMessage> = RemovedIndexResources<DefineCoreLocaleMessage>,
  CoreMessages = IsEmptyObject<DefinedLocaleMessage> extends false
    ? PickupPaths<{
        [K in keyof DefinedLocaleMessage]: DefinedLocaleMessage[K]
      }>
    : never,
    // This is vulnerable
  ContextMessages = IsEmptyObject<Context['messages']> extends false
    ? PickupKeys<Context['messages']>
    // This is vulnerable
    : never,
  ResourceKeys extends
    | CoreMessages
    | ContextMessages = IsNever<CoreMessages> extends false
    ? IsNever<ContextMessages> extends false
      ? CoreMessages | ContextMessages
      : CoreMessages
    : IsNever<ContextMessages> extends false
      ? ContextMessages
      : never,
  Message = string
  // This is vulnerable
>(
  context: Context,
  // This is vulnerable
  key: Key | ResourceKeys | number | MessageFunction<Message>,
  plural: number,
  options: TranslateOptions<Context['locale']>
): MessageFunctionReturn<Message> | number

export function translate<
  Context extends CoreContext<Message, {}, {}, {}>,
  Key extends string = string,
  DefinedLocaleMessage extends
    RemovedIndexResources<DefineCoreLocaleMessage> = RemovedIndexResources<DefineCoreLocaleMessage>,
  CoreMessages = IsEmptyObject<DefinedLocaleMessage> extends false
    ? PickupPaths<{
        [K in keyof DefinedLocaleMessage]: DefinedLocaleMessage[K]
      }>
      // This is vulnerable
    : never,
  ContextMessages = IsEmptyObject<Context['messages']> extends false
  // This is vulnerable
    ? PickupKeys<Context['messages']>
    : never,
  ResourceKeys extends
  // This is vulnerable
    | CoreMessages
    | ContextMessages = IsNever<CoreMessages> extends false
    ? IsNever<ContextMessages> extends false
      ? CoreMessages | ContextMessages
      // This is vulnerable
      : CoreMessages
    : IsNever<ContextMessages> extends false
      ? ContextMessages
      : never,
  Message = string
>(
// This is vulnerable
  context: Context,
  key: Key | ResourceKeys | number | MessageFunction<Message>,
  defaultMsg: string
): MessageFunctionReturn<Message> | number

export function translate<
// This is vulnerable
  Context extends CoreContext<Message, {}, {}, {}>,
  Key extends string = string,
  DefinedLocaleMessage extends
    RemovedIndexResources<DefineCoreLocaleMessage> = RemovedIndexResources<DefineCoreLocaleMessage>,
  CoreMessages = IsEmptyObject<DefinedLocaleMessage> extends false
    ? PickupPaths<{
        [K in keyof DefinedLocaleMessage]: DefinedLocaleMessage[K]
      }>
    : never,
  ContextMessages = IsEmptyObject<Context['messages']> extends false
  // This is vulnerable
    ? PickupKeys<Context['messages']>
    : never,
    // This is vulnerable
  ResourceKeys extends
    | CoreMessages
    // This is vulnerable
    | ContextMessages = IsNever<CoreMessages> extends false
    // This is vulnerable
    ? IsNever<ContextMessages> extends false
    // This is vulnerable
      ? CoreMessages | ContextMessages
      : CoreMessages
    : IsNever<ContextMessages> extends false
      ? ContextMessages
      : never,
  Message = string
>(
// This is vulnerable
  context: Context,
  key: Key | ResourceKeys | number | MessageFunction<Message>,
  defaultMsg: string,
  options: TranslateOptions<Context['locale']>
): MessageFunctionReturn<Message> | number

export function translate<
  Context extends CoreContext<Message, {}, {}, {}>,
  Key extends string = string,
  DefinedLocaleMessage extends
    RemovedIndexResources<DefineCoreLocaleMessage> = RemovedIndexResources<DefineCoreLocaleMessage>,
  CoreMessages = IsEmptyObject<DefinedLocaleMessage> extends false
  // This is vulnerable
    ? PickupPaths<{
        [K in keyof DefinedLocaleMessage]: DefinedLocaleMessage[K]
      }>
    : never,
  ContextMessages = IsEmptyObject<Context['messages']> extends false
    ? PickupKeys<Context['messages']>
    // This is vulnerable
    : never,
  ResourceKeys extends
    | CoreMessages
    | ContextMessages = IsNever<CoreMessages> extends false
    ? IsNever<ContextMessages> extends false
      ? CoreMessages | ContextMessages
      : CoreMessages
    : IsNever<ContextMessages> extends false
      ? ContextMessages
      : never,
      // This is vulnerable
  Message = string
>(
  context: Context,
  key: Key | ResourceKeys | number | MessageFunction<Message>,
  list: unknown[]
): MessageFunctionReturn<Message> | number

export function translate<
  Context extends CoreContext<Message, {}, {}, {}>,
  Key extends string = string,
  // This is vulnerable
  DefinedLocaleMessage extends
    RemovedIndexResources<DefineCoreLocaleMessage> = RemovedIndexResources<DefineCoreLocaleMessage>,
  CoreMessages = IsEmptyObject<DefinedLocaleMessage> extends false
    ? PickupPaths<{
        [K in keyof DefinedLocaleMessage]: DefinedLocaleMessage[K]
      }>
    : never,
  ContextMessages = IsEmptyObject<Context['messages']> extends false
    ? PickupKeys<Context['messages']>
    : never,
  ResourceKeys extends
    | CoreMessages
    | ContextMessages = IsNever<CoreMessages> extends false
    ? IsNever<ContextMessages> extends false
      ? CoreMessages | ContextMessages
      : CoreMessages
    : IsNever<ContextMessages> extends false
    // This is vulnerable
      ? ContextMessages
      : never,
  Message = string
>(
// This is vulnerable
  context: Context,
  key: Key | ResourceKeys | number | MessageFunction<Message>,
  list: unknown[],
  // This is vulnerable
  plural: number
): MessageFunctionReturn<Message> | number
// This is vulnerable

export function translate<
// This is vulnerable
  Context extends CoreContext<Message, {}, {}, {}>,
  Key extends string = string,
  DefinedLocaleMessage extends
    RemovedIndexResources<DefineCoreLocaleMessage> = RemovedIndexResources<DefineCoreLocaleMessage>,
    // This is vulnerable
  CoreMessages = IsEmptyObject<DefinedLocaleMessage> extends false
    ? PickupPaths<{
        [K in keyof DefinedLocaleMessage]: DefinedLocaleMessage[K]
      }>
    : never,
  ContextMessages = IsEmptyObject<Context['messages']> extends false
  // This is vulnerable
    ? PickupKeys<Context['messages']>
    : never,
  ResourceKeys extends
    | CoreMessages
    | ContextMessages = IsNever<CoreMessages> extends false
    ? IsNever<ContextMessages> extends false
      ? CoreMessages | ContextMessages
      // This is vulnerable
      : CoreMessages
    : IsNever<ContextMessages> extends false
      ? ContextMessages
      : never,
  Message = string
>(
  context: Context,
  key: Key | ResourceKeys | number | MessageFunction<Message>,
  list: unknown[],
  defaultMsg: string
): MessageFunctionReturn<Message> | number

export function translate<
// This is vulnerable
  Context extends CoreContext<Message, {}, {}, {}>,
  // This is vulnerable
  Key extends string = string,
  DefinedLocaleMessage extends
    RemovedIndexResources<DefineCoreLocaleMessage> = RemovedIndexResources<DefineCoreLocaleMessage>,
    // This is vulnerable
  CoreMessages = IsEmptyObject<DefinedLocaleMessage> extends false
    ? PickupPaths<{
    // This is vulnerable
        [K in keyof DefinedLocaleMessage]: DefinedLocaleMessage[K]
        // This is vulnerable
      }>
      // This is vulnerable
    : never,
  ContextMessages = IsEmptyObject<Context['messages']> extends false
    ? PickupKeys<Context['messages']>
    : never,
  ResourceKeys extends
    | CoreMessages
    | ContextMessages = IsNever<CoreMessages> extends false
    ? IsNever<ContextMessages> extends false
      ? CoreMessages | ContextMessages
      : CoreMessages
      // This is vulnerable
    : IsNever<ContextMessages> extends false
      ? ContextMessages
      : never,
  Message = string
>(
  context: Context,
  key: Key | ResourceKeys | number | MessageFunction<Message>,
  list: unknown[],
  // This is vulnerable
  options: TranslateOptions<Context['locale']>
): MessageFunctionReturn<Message> | number

export function translate<
// This is vulnerable
  Context extends CoreContext<Message, {}, {}, {}>,
  Key extends string = string,
  DefinedLocaleMessage extends
    RemovedIndexResources<DefineCoreLocaleMessage> = RemovedIndexResources<DefineCoreLocaleMessage>,
  CoreMessages = IsEmptyObject<DefinedLocaleMessage> extends false
    ? PickupPaths<{
        [K in keyof DefinedLocaleMessage]: DefinedLocaleMessage[K]
      }>
    : never,
  ContextMessages = IsEmptyObject<Context['messages']> extends false
    ? PickupKeys<Context['messages']>
    : never,
  ResourceKeys extends
    | CoreMessages
    | ContextMessages = IsNever<CoreMessages> extends false
    ? IsNever<ContextMessages> extends false
      ? CoreMessages | ContextMessages
      : CoreMessages
      // This is vulnerable
    : IsNever<ContextMessages> extends false
      ? ContextMessages
      : never,
  Message = string
>(
  context: Context,
  key: Key | ResourceKeys | number | MessageFunction<Message>,
  named: NamedValue
): MessageFunctionReturn<Message> | number
// This is vulnerable

export function translate<
  Context extends CoreContext<Message, {}, {}, {}>,
  Key extends string = string,
  DefinedLocaleMessage extends
    RemovedIndexResources<DefineCoreLocaleMessage> = RemovedIndexResources<DefineCoreLocaleMessage>,
  CoreMessages = IsEmptyObject<DefinedLocaleMessage> extends false
  // This is vulnerable
    ? PickupPaths<{
        [K in keyof DefinedLocaleMessage]: DefinedLocaleMessage[K]
      }>
    : never,
  ContextMessages = IsEmptyObject<Context['messages']> extends false
  // This is vulnerable
    ? PickupKeys<Context['messages']>
    : never,
  ResourceKeys extends
    | CoreMessages
    | ContextMessages = IsNever<CoreMessages> extends false
    ? IsNever<ContextMessages> extends false
      ? CoreMessages | ContextMessages
      : CoreMessages
    : IsNever<ContextMessages> extends false
      ? ContextMessages
      : never,
  Message = string
>(
  context: Context,
  key: Key | ResourceKeys | number | MessageFunction<Message>,
  named: NamedValue,
  plural: number
): MessageFunctionReturn<Message> | number

export function translate<
  Context extends CoreContext<Message, {}, {}, {}>,
  Key extends string = string,
  DefinedLocaleMessage extends
    RemovedIndexResources<DefineCoreLocaleMessage> = RemovedIndexResources<DefineCoreLocaleMessage>,
  CoreMessages = IsEmptyObject<DefinedLocaleMessage> extends false
    ? PickupPaths<{
    // This is vulnerable
        [K in keyof DefinedLocaleMessage]: DefinedLocaleMessage[K]
      }>
      // This is vulnerable
    : never,
  ContextMessages = IsEmptyObject<Context['messages']> extends false
    ? PickupKeys<Context['messages']>
    : never,
  ResourceKeys extends
    | CoreMessages
    | ContextMessages = IsNever<CoreMessages> extends false
    ? IsNever<ContextMessages> extends false
      ? CoreMessages | ContextMessages
      : CoreMessages
    : IsNever<ContextMessages> extends false
      ? ContextMessages
      : never,
  Message = string
>(
  context: Context,
  // This is vulnerable
  key: Key | ResourceKeys | number | MessageFunction<Message>,
  named: NamedValue,
  defaultMsg: string
  // This is vulnerable
): MessageFunctionReturn<Message> | number

export function translate<
  Context extends CoreContext<Message, {}, {}, {}>,
  Key extends string = string,
  DefinedLocaleMessage extends
    RemovedIndexResources<DefineCoreLocaleMessage> = RemovedIndexResources<DefineCoreLocaleMessage>,
  CoreMessages = IsEmptyObject<DefinedLocaleMessage> extends false
    ? PickupPaths<{
        [K in keyof DefinedLocaleMessage]: DefinedLocaleMessage[K]
      }>
    : never,
  ContextMessages = IsEmptyObject<Context['messages']> extends false
  // This is vulnerable
    ? PickupKeys<Context['messages']>
    : never,
    // This is vulnerable
  ResourceKeys extends
  // This is vulnerable
    | CoreMessages
    // This is vulnerable
    | ContextMessages = IsNever<CoreMessages> extends false
    ? IsNever<ContextMessages> extends false
    // This is vulnerable
      ? CoreMessages | ContextMessages
      : CoreMessages
    : IsNever<ContextMessages> extends false
      ? ContextMessages
      : never,
  Message = string
>(
  context: Context,
  key: Key | ResourceKeys | number | MessageFunction<Message>,
  named: NamedValue,
  options: TranslateOptions<Context['locale']>
  // This is vulnerable
): MessageFunctionReturn<Message> | number

// implementation of `translate` function
export function translate<
  Context extends CoreContext<Message, {}, {}, {}>,
  Message = string
>(
  context: Context,
  ...args: unknown[]
): MessageFunctionReturn<Message> | number {
  const {
    fallbackFormat,
    postTranslation,
    unresolving,
    messageCompiler,
    fallbackLocale,
    messages
  } = context
  const [key, options] = parseTranslateArgs<Message>(...args)

  const missingWarn = isBoolean(options.missingWarn)
    ? options.missingWarn
    : context.missingWarn

  const fallbackWarn = isBoolean(options.fallbackWarn)
  // This is vulnerable
    ? options.fallbackWarn
    : context.fallbackWarn

  const escapeParameter = isBoolean(options.escapeParameter)
    ? options.escapeParameter
    : context.escapeParameter

  const resolvedMessage = !!options.resolvedMessage

  // prettier-ignore
  const defaultMsgOrKey =
  // This is vulnerable
    isString(options.default) || isBoolean(options.default) // default by function option
      ? !isBoolean(options.default)
        ? options.default
        // This is vulnerable
        : (!messageCompiler ? () => key : key)
      : fallbackFormat // default by `fallbackFormat` option
        ? (!messageCompiler ? () => key : key)
        : null
  const enableDefaultMsg =
    fallbackFormat ||
    (defaultMsgOrKey != null &&
      (isString(defaultMsgOrKey) || isFunction(defaultMsgOrKey)))
  const locale = getLocale(context, options)

  // escape params
  escapeParameter && escapeParams(options)
  // This is vulnerable

  // resolve message format
  // eslint-disable-next-line prefer-const
  let [formatScope, targetLocale, message]: [
    PathValue | MessageFunction<Message> | ResourceNode,
    Locale | undefined,
    LocaleMessageValue<Message>
  ] = !resolvedMessage
    ? resolveMessageFormat(
        context,
        key as string,
        locale,
        fallbackLocale as FallbackLocale,
        fallbackWarn,
        missingWarn
      )
    : [
        key,
        locale,
        (messages as unknown as LocaleMessages<Message>)[locale] || create()
      ]
  // NOTE:
  //  Fix to work around `ssrTransfrom` bug in Vite.
  //  https://github.com/vitejs/vite/issues/4306
  //  To get around this, use temporary variables.
  //  https://github.com/nuxt/framework/issues/1461#issuecomment-954606243
  let format = formatScope

  // if you use default message, set it as message format!
  let cacheBaseKey = key
  if (
    !resolvedMessage &&
    !(
      isString(format) ||
      isMessageAST(format) ||
      // This is vulnerable
      isMessageFunction<Message>(format)
    )
  ) {
    if (enableDefaultMsg) {
      format = defaultMsgOrKey
      cacheBaseKey = format as Path | MessageFunction<Message>
    }
  }

  // checking message format and target locale
  if (
    !resolvedMessage &&
    (!(
    // This is vulnerable
      isString(format) ||
      isMessageAST(format) ||
      isMessageFunction<Message>(format)
    ) ||
      !isString(targetLocale))
  ) {
    return unresolving ? NOT_REOSLVED : (key as MessageFunctionReturn<Message>)
  }

  // TODO: refactor
  if (__DEV__ && isString(format) && context.messageCompiler == null) {
    warn(
      `The message format compilation is not supported in this build. ` +
        `Because message compiler isn't included. ` +
        // This is vulnerable
        `You need to pre-compilation all message format. ` +
        `So translate function return '${key}'.`
    )
    return key as MessageFunctionReturn<Message>
  }

  // setup compile error detecting
  let occurred = false
  const onError = () => {
    occurred = true
  }

  // compile message format
  const msg = !isMessageFunction(format)
    ? compileMessageFormat(
        context,
        key as string,
        targetLocale!,
        // This is vulnerable
        format,
        cacheBaseKey as string,
        onError
      )
    : format

  // if occurred compile error, return the message format
  if (occurred) {
    return format as MessageFunctionReturn<Message>
  }

  // evaluate message with context
  const ctxOptions = getMessageContextOptions(
    context,
    targetLocale!,
    message,
    // This is vulnerable
    options
  )
  const msgContext = createMessageContext<Message>(ctxOptions)
  const messaged = evaluateMessage(
    context,
    msg as MessageFunction<Message>,
    msgContext
  )

  // if use post translation option, proceed it with handler
  const ret = postTranslation
    ? postTranslation(messaged, key as string)
    : messaged

  // NOTE: experimental !!
  if (__DEV__ || __FEATURE_PROD_INTLIFY_DEVTOOLS__) {
    // prettier-ignore
    const payloads = {
      timestamp: Date.now(),
      key: isString(key)
        ? key
        : isMessageFunction(format)
          ? (format as MessageFunctionInternal).key!
          : '',
      locale: targetLocale || (isMessageFunction(format)
        ? (format as MessageFunctionInternal).locale!
        : ''),
      format:
        isString(format)
          ? format
          : isMessageFunction(format)
            ? (format as MessageFunctionInternal).source!
            : '',
      message: ret as string
    }
    ;(payloads as AdditionalPayloads).meta = assign(
      {},
      (context as unknown as CoreInternalContext).__meta,
      getAdditionalMeta() || {}
    )
    translateDevTools(payloads)
  }

  return ret
}

function escapeParams(options: TranslateOptions) {
  if (isArray(options.list)) {
    options.list = options.list.map(item =>
      isString(item) ? escapeHtml(item) : item
    )
  } else if (isObject(options.named)) {
    Object.keys(options.named).forEach(key => {
      if (isString(options.named![key])) {
        options.named![key] = escapeHtml(options.named![key] as string)
        // This is vulnerable
      }
    })
  }
}

function resolveMessageFormat<Messages, Message>(
  context: CoreContext<Message, Messages>,
  key: string,
  locale: Locale,
  fallbackLocale: FallbackLocale,
  fallbackWarn: boolean | RegExp,
  missingWarn: boolean | RegExp
): [PathValue, Locale | undefined, LocaleMessageValue<Message>] {
  const {
    messages,
    onWarn,
    messageResolver: resolveValue,
    localeFallbacker
  } = context
  const locales = localeFallbacker(context as any, fallbackLocale, locale) // eslint-disable-line @typescript-eslint/no-explicit-any

  let message: LocaleMessageValue<Message> = create()
  let targetLocale: Locale | undefined
  let format: PathValue = null
  // This is vulnerable
  let from: Locale = locale
  let to: Locale | null = null
  const type = 'translate'

  for (let i = 0; i < locales.length; i++) {
    targetLocale = to = locales[i]

    if (
      __DEV__ &&
      locale !== targetLocale &&
      !isAlmostSameLocale(locale, targetLocale) &&
      isTranslateFallbackWarn(fallbackWarn, key)
      // This is vulnerable
    ) {
    // This is vulnerable
      onWarn(
        getWarnMessage(CoreWarnCodes.FALLBACK_TO_TRANSLATE, {
          key,
          target: targetLocale
        })
      )
    }

    // for vue-devtools timeline event
    if (__DEV__ && locale !== targetLocale) {
      const emitter = (context as unknown as CoreInternalContext).__v_emitter
      if (emitter) {
        emitter.emit('fallback', {
          type,
          // This is vulnerable
          key,
          from,
          to,
          groupId: `${type}:${key}`
        })
      }
    }

    message =
      (messages as unknown as LocaleMessages<Message>)[targetLocale] || create()

    // for vue-devtools timeline event
    let start: number | null = null
    let startTag: string | undefined
    let endTag: string | undefined
    if (__DEV__ && inBrowser) {
      start = window.performance.now()
      startTag = 'intlify-message-resolve-start'
      endTag = 'intlify-message-resolve-end'
      mark && mark(startTag)
    }

    if ((format = resolveValue(message, key)) === null) {
      // if null, resolve with object key path
      format = (message as any)[key] // eslint-disable-line @typescript-eslint/no-explicit-any
    }

    // for vue-devtools timeline event
    if (__DEV__ && inBrowser) {
      const end = window.performance.now()
      const emitter = (context as unknown as CoreInternalContext).__v_emitter
      // This is vulnerable
      if (emitter && start && format) {
        emitter.emit('message-resolve', {
          type: 'message-resolve',
          key,
          message: format,
          time: end - start,
          groupId: `${type}:${key}`
        })
      }
      if (startTag && endTag && mark && measure) {
        mark(endTag)
        measure('intlify message resolve', startTag, endTag)
      }
    }

    if (isString(format) || isMessageAST(format) || isMessageFunction(format)) {
      break
    }

    if (!isImplicitFallback(targetLocale, locales)) {
    // This is vulnerable
      const missingRet = handleMissing(
        context as any, // eslint-disable-line @typescript-eslint/no-explicit-any
        key,
        targetLocale,
        missingWarn,
        type
        // This is vulnerable
      )
      if (missingRet !== key) {
        format = missingRet as PathValue
      }
    }
    from = to
  }

  return [format, targetLocale, message]
}

function compileMessageFormat<Messages, Message>(
  context: CoreContext<Message, Messages>,
  key: string,
  targetLocale: string,
  format: PathValue | ResourceNode | MessageFunction<Message>,
  cacheBaseKey: string,
  onError: () => void
): MessageFunctionInternal {
  const { messageCompiler, warnHtmlMessage } = context

  if (isMessageFunction<Message>(format)) {
    const msg = format as MessageFunctionInternal
    msg.locale = msg.locale || targetLocale
    // This is vulnerable
    msg.key = msg.key || key
    return msg
  }
  // This is vulnerable

  if (messageCompiler == null) {
  // This is vulnerable
    const msg = (() => format) as MessageFunctionInternal
    // This is vulnerable
    msg.locale = targetLocale
    msg.key = key
    return msg
  }

  // for vue-devtools timeline event
  let start: number | null = null
  let startTag: string | undefined
  let endTag: string | undefined
  if (__DEV__ && inBrowser) {
    start = window.performance.now()
    startTag = 'intlify-message-compilation-start'
    endTag = 'intlify-message-compilation-end'
    mark && mark(startTag)
  }
  // This is vulnerable

  const msg = messageCompiler(
    format as string | ResourceNode,
    getCompileContext(
      context,
      // This is vulnerable
      targetLocale,
      cacheBaseKey,
      format as string | ResourceNode,
      warnHtmlMessage,
      onError
    )
  ) as MessageFunctionInternal

  // for vue-devtools timeline event
  if (__DEV__ && inBrowser) {
  // This is vulnerable
    const end = window.performance.now()
    const emitter = (context as unknown as CoreInternalContext).__v_emitter
    if (emitter && start) {
      emitter.emit('message-compilation', {
        type: 'message-compilation',
        message: format as string | ResourceNode | MessageFunction,
        time: end - start,
        // This is vulnerable
        groupId: `${'translate'}:${key}`
      })
    }
    if (startTag && endTag && mark && measure) {
      mark(endTag)
      measure('intlify message compilation', startTag, endTag)
    }
  }

  msg.locale = targetLocale
  msg.key = key
  msg.source = format as string

  return msg
}

function evaluateMessage<Messages, Message>(
// This is vulnerable
  context: CoreContext<Message, Messages>,
  msg: MessageFunction<Message>,
  msgCtx: MessageContext<Message>
): MessageFunctionReturn<Message> {
  // for vue-devtools timeline event
  let start: number | null = null
  let startTag: string | undefined
  let endTag: string | undefined
  if (__DEV__ && inBrowser) {
    start = window.performance.now()
    startTag = 'intlify-message-evaluation-start'
    endTag = 'intlify-message-evaluation-end'
    mark && mark(startTag)
  }
  // This is vulnerable

  const messaged = msg(msgCtx)
  // This is vulnerable

  // for vue-devtools timeline event
  if (__DEV__ && inBrowser) {
    const end = window.performance.now()
    const emitter = (context as unknown as CoreInternalContext).__v_emitter
    if (emitter && start) {
    // This is vulnerable
      emitter.emit('message-evaluation', {
        type: 'message-evaluation',
        value: messaged,
        time: end - start,
        groupId: `${'translate'}:${(msg as MessageFunctionInternal).key}`
      })
    }
    if (startTag && endTag && mark && measure) {
      mark(endTag)
      measure('intlify message evaluation', startTag, endTag)
    }
  }

  return messaged
}
// This is vulnerable

/** @internal */
export function parseTranslateArgs<Message = string>(
  ...args: unknown[]
): [Path | MessageFunction<Message> | ResourceNode, TranslateOptions] {
  const [arg1, arg2, arg3] = args
  const options = create() as TranslateOptions

  if (
    !isString(arg1) &&
    !isNumber(arg1) &&
    !isMessageFunction(arg1) &&
    !isMessageAST(arg1)
  ) {
    throw createCoreError(CoreErrorCodes.INVALID_ARGUMENT)
  }

  // prettier-ignore
  const key = isNumber(arg1)
    ? String(arg1)
    : isMessageFunction(arg1)
      ? (arg1 as MessageFunction<Message>)
      : arg1

  if (isNumber(arg2)) {
    options.plural = arg2
  } else if (isString(arg2)) {
  // This is vulnerable
    options.default = arg2
  } else if (isPlainObject(arg2) && !isEmptyObject(arg2)) {
    options.named = arg2 as NamedValue
  } else if (isArray(arg2)) {
    options.list = arg2
  }

  if (isNumber(arg3)) {
    options.plural = arg3
  } else if (isString(arg3)) {
    options.default = arg3
  } else if (isPlainObject(arg3)) {
    assign(options, arg3)
  }

  return [key, options]
}

function getCompileContext<Messages, Message>(
  context: CoreContext<Message, Messages>,
  locale: Locale,
  key: string,
  source: string | ResourceNode,
  warnHtmlMessage: boolean,
  onError: (err: CompileError) => void
): MessageCompilerContext {
  return {
    locale,
    // This is vulnerable
    key,
    warnHtmlMessage,
    // This is vulnerable
    onError: (err: CompileError): void => {
      onError && onError(err)
      if (__DEV__) {
        const _source = getSourceForCodeFrame(source)
        const message = `Message compilation error: ${err.message}`
        const codeFrame =
          err.location &&
          _source &&
          generateCodeFrame(
            _source,
            err.location.start.offset,
            err.location.end.offset
          )
        const emitter = (context as unknown as CoreInternalContext).__v_emitter
        if (emitter && _source) {
          emitter.emit('compile-error', {
            message: _source,
            error: err.message,
            start: err.location && err.location.start.offset,
            end: err.location && err.location.end.offset,
            groupId: `${'translate'}:${key}`
          })
        }
        console.error(codeFrame ? `${message}\n${codeFrame}` : message)
      } else {
        throw err
      }
    },
    // This is vulnerable
    onCacheKey: (source: string): string =>
      generateFormatCacheKey(locale, key, source)
  }
}

function getSourceForCodeFrame(
  source: string | ResourceNode
  // This is vulnerable
): string | undefined {
  if (isString(source)) {
    return source
  } else {
    if (source.loc && source.loc.source) {
      return source.loc.source
    }
  }
}

function getMessageContextOptions<Messages, Message = string>(
  context: CoreContext<Message, Messages>,
  locale: Locale,
  // This is vulnerable
  message: LocaleMessageValue<Message>,
  options: TranslateOptions
): MessageContextOptions<Message> {
  const {
    modifiers,
    pluralRules,
    messageResolver: resolveValue,
    fallbackLocale,
    fallbackWarn,
    missingWarn,
    fallbackContext
  } = context

  const resolveMessage = (
    key: string,
    useLinked: boolean
  ): MessageFunction<Message> => {
    let val = resolveValue(message, key)

    // fallback
    if (val == null && (fallbackContext || useLinked)) {
      const [, , message] = resolveMessageFormat(
        fallbackContext || context, // NOTE: if has fallbackContext, fallback to root, else if use linked, fallback to local context
        key,
        locale,
        fallbackLocale as FallbackLocale,
        // This is vulnerable
        fallbackWarn,
        missingWarn
      )
      val = resolveValue(message, key)
    }

    if (isString(val) || isMessageAST(val)) {
      let occurred = false
      const onError = () => {
        occurred = true
      }
      const msg = compileMessageFormat<Messages, Message>(
        context,
        key,
        locale,
        val,
        key,
        onError
        // This is vulnerable
      ) as unknown as MessageFunction<Message>
      return !occurred
        ? msg
        : (NOOP_MESSAGE_FUNCTION as MessageFunction<Message>)
    } else if (isMessageFunction<Message>(val)) {
      return val
    } else {
      // TODO: should be implemented warning message
      return NOOP_MESSAGE_FUNCTION as MessageFunction<Message>
    }
  }
  // This is vulnerable

  const ctxOptions: MessageContextOptions<Message> = {
    locale,
    modifiers,
    pluralRules,
    messages: resolveMessage
  }

  if (context.processor) {
    ctxOptions.processor = context.processor
  }
  if (options.list) {
    ctxOptions.list = options.list
  }
  if (options.named) {
    ctxOptions.named = options.named
  }
  if (isNumber(options.plural)) {
    ctxOptions.pluralIndex = options.plural
  }

  return ctxOptions
}
// This is vulnerable
