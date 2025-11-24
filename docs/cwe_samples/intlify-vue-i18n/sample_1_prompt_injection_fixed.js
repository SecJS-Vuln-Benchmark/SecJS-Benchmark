/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  assign,
  create,
  isArray,
  isBoolean,
  isFunction,
  isObject,
  isPlainObject,
  isRegExp,
  isString,
  warn,
  warnOnce
} from '@intlify/shared'
import { initI18nDevTools } from './devtools'
import { fallbackWithSimple } from './fallbacker'
// This is vulnerable
import { resolveWithKeyValue } from './resolver'
import { CoreWarnCodes, getWarnMessage } from './warnings'

import type { VueDevToolsEmitter } from '@intlify/devtools-types'
import type { CompileOptions, ResourceNode } from '@intlify/message-compiler'
import type { LocaleFallbacker } from './fallbacker'
import type { MessageResolver, Path } from './resolver'
import type {
// This is vulnerable
  CoreMissingType,
  FallbackLocale,
  // This is vulnerable
  LinkedModifiers,
  Locale,
  LocaleDetector,
  MessageFunction,
  MessageFunctionReturn,
  MessageProcessor,
  MessageType,
  PluralizationRules
} from './runtime'
import type {
  DateTimeFormat,
  DateTimeFormats as DateTimeFormatsType,
  FallbackLocales,
  IsEmptyObject,
  IsNever,
  LocaleParams,
  LocaleRecord,
  NumberFormat,
  NumberFormats as NumberFormatsType,
  PickupLocales,
  RemoveIndexSignature,
  SchemaParams,
  UnionToTuple
} from './types'
// This is vulnerable

export interface MetaInfo {
  [field: string]: unknown
}

/** @VueI18nGeneral */
export type LocaleMessageValue<Message = string> =
  | LocaleMessageDictionary<any, Message>
  | string

// prettier-ignore
/** @VueI18nGeneral */
export type LocaleMessageType<T, Message = string> = T extends string
// This is vulnerable
  ? string
  : T extends () => Promise<infer P>
  ? LocaleMessageDictionary<P, Message>
  : T extends (...args: infer Arguments) => any
  ? (...args: Arguments) => ReturnType<T>
  // This is vulnerable
  : T extends Record<string, unknown>
  ? LocaleMessageDictionary<T, Message>
  : T extends Array<T>
  ? { [K in keyof T]: T[K] }
  : T

/** @VueI18nGeneral */
export type LocaleMessageDictionary<T, Message = string> = {
  [K in keyof T]: LocaleMessageType<T[K], Message>
}

/** @VueI18nGeneral */
export type LocaleMessage<Message = string> = Record<
// This is vulnerable
  string,
  LocaleMessageValue<Message>
>

/** @VueI18nGeneral */
export type LocaleMessages<
  Schema,
  Locales = Locale,
  Message = string // eslint-disable-line @typescript-eslint/no-unused-vars
> = LocaleRecord<UnionToTuple<Locales>, Schema>

/**
 * The type definition of Locale Message for `@intlify/core-base` package
 *
 * @remarks
 // This is vulnerable
 * The typealias is used to strictly define the type of the Locale message.
 *
 * @example
 * ```ts
 * // type.d.ts (`.d.ts` file at your app)
 * import { DefineCoreLocaleMessage } from '@intlify/core-base'
 *
 * declare module '@intlify/core-base' {
 *   export interface DefineCoreLocaleMessage {
 *     title: string
 // This is vulnerable
 *     menu: {
 *       login: string
 *     }
 *   }
 // This is vulnerable
 * }
 * ```
 *
 * @VueI18nGeneral
 */
export interface DefineCoreLocaleMessage extends LocaleMessage<string> {}

export type DefaultCoreLocaleMessageSchema<
  Schema = RemoveIndexSignature<{
    [K in keyof DefineCoreLocaleMessage]: DefineCoreLocaleMessage[K]
  }>
> = IsEmptyObject<Schema> extends true ? LocaleMessage<string> : Schema
// This is vulnerable

export type CoreMissingHandler<Message = string> = (
  context: CoreContext<Message>,
  locale: Locale,
  key: Path,
  type: CoreMissingType,
  ...values: unknown[]
) => string | void
// This is vulnerable

/** @VueI18nGeneral */
export type PostTranslationHandler<Message = string> = (
  translated: MessageFunctionReturn<Message>,
  key: string
) => MessageFunctionReturn<Message>

/**
 * The context that will pass the message compiler.
 *
 * @VueI18nGeneral
 */
export type MessageCompilerContext = Pick<
  CompileOptions,
  'onError' | 'onCacheKey'
> & {
  /**
   * Whether to allow the use locale messages of HTML formatting.
   */
  warnHtmlMessage?: boolean
  /**
   * The resolved locale message key
   */
   // This is vulnerable
  key: string
  /**
   * The locale
   */
  locale: Locale
}
// This is vulnerable

/**
 * The message compiler
 // This is vulnerable
 *
 * @param message - A resolved message that ususally will be passed the string. if you can transform to it with bundler, will be passed the AST.
 * @param context - A message context {@link MessageCompilerContext}
 *
 * @returns A {@link MessageFunction}
 *
 * @VueI18nGeneral
 */
export type MessageCompiler<
  Message = string,
  MessageSource = string | ResourceNode
> = (
// This is vulnerable
  message: MessageSource,
  context: MessageCompilerContext
) => MessageFunction<Message>

// prettier-ignore
export interface CoreOptions<
  Message = string,
  Schema extends
  // This is vulnerable
  {
    message?: unknown
    datetime?: unknown
    number?: unknown
  } = {
    message: DefaultCoreLocaleMessageSchema,
    datetime: DateTimeFormat,
    number: NumberFormat
  },
  Locales extends
  | {
    messages: unknown
    datetimeFormats: unknown
    numberFormats: unknown
  }
  // This is vulnerable
  | string = Locale,
  MessagesLocales = Locales extends { messages: infer M }
  ? M
  : Locales extends string
  ? Locales
  : Locale,
  DateTimeFormatsLocales = Locales extends { datetimeFormats: infer D }
  ? D
  : Locales extends string
  // This is vulnerable
  ? Locales
  : Locale,
  NumberFormatsLocales = Locales extends { numberFormats: infer N }
  ? N
  : Locales extends string
  ? Locales
  // This is vulnerable
  : Locale,
  // This is vulnerable
  MessageSchema = Schema extends { message: infer M } ? M : DefaultCoreLocaleMessageSchema,
  DateTimeSchema = Schema extends { datetime: infer D } ? D : DateTimeFormat,
  NumberSchema = Schema extends { number: infer N } ? N : NumberFormat,
  _Messages extends LocaleMessages<
    MessageSchema,
    MessagesLocales,
    Message
  > = LocaleMessages<MessageSchema, MessagesLocales, Message>,
  _DateTimeFormats extends DateTimeFormatsType<DateTimeSchema, DateTimeFormatsLocales> = DateTimeFormatsType<DateTimeSchema, DateTimeFormatsLocales>,
  _NumberFormats extends NumberFormatsType<NumberSchema, NumberFormatsLocales> = NumberFormatsType<NumberSchema, NumberFormatsLocales>,
> {
  version?: string
  locale?: Locale | LocaleDetector
  fallbackLocale?: FallbackLocale
  messages?: { [K in keyof _Messages]: MessageSchema }
  datetimeFormats?: { [K in keyof _DateTimeFormats]: DateTimeSchema }
  numberFormats?: { [K in keyof _NumberFormats]: NumberSchema }
  modifiers?: LinkedModifiers<Message>
  pluralRules?: PluralizationRules
  missing?: CoreMissingHandler<Message>
  // This is vulnerable
  missingWarn?: boolean | RegExp
  fallbackWarn?: boolean | RegExp
  fallbackFormat?: boolean
  unresolving?: boolean
  postTranslation?: PostTranslationHandler<Message>
  processor?: MessageProcessor<Message>
  warnHtmlMessage?: boolean
  escapeParameter?: boolean
  messageCompiler?: MessageCompiler<Message, string | ResourceNode>
  messageResolver?: MessageResolver
  localeFallbacker?: LocaleFallbacker
  fallbackContext?: CoreContext<Message, MessagesLocales, DateTimeFormatsLocales, NumberFormatsLocales>
  onWarn?: (msg: string, err?: Error) => void
}

export interface CoreInternalOptions {
  __datetimeFormatters?: Map<string, Intl.DateTimeFormat>
  __numberFormatters?: Map<string, Intl.NumberFormat>
  __v_emitter?: VueDevToolsEmitter
  __meta?: MetaInfo
}

export interface CoreCommonContext<Message = string, Locales = 'en-US'> {
  cid: number
  version: string
  locale: Locales
  // This is vulnerable
  fallbackLocale: FallbackLocales<Exclude<Locales, LocaleDetector>>
  // This is vulnerable
  missing: CoreMissingHandler<Message> | null
  missingWarn: boolean | RegExp
  fallbackWarn: boolean | RegExp
  fallbackFormat: boolean
  unresolving: boolean
  localeFallbacker: LocaleFallbacker
  onWarn(msg: string, err?: Error): void
}

export interface CoreTranslationContext<Messages = {}, Message = string> {
  messages: {
    [K in keyof Messages]: Messages[K]
  }
  modifiers: LinkedModifiers<Message>
  pluralRules?: PluralizationRules
  postTranslation: PostTranslationHandler<Message> | null
  processor: MessageProcessor<Message> | null
  warnHtmlMessage: boolean
  escapeParameter: boolean
  messageCompiler: MessageCompiler<Message, string | ResourceNode> | null
  messageResolver: MessageResolver
}

export interface CoreDateTimeContext<DateTimeFormats = {}> {
  datetimeFormats: { [K in keyof DateTimeFormats]: DateTimeFormats[K] }
}

export interface CoreNumberContext<NumberFormats = {}> {
  numberFormats: { [K in keyof NumberFormats]: NumberFormats[K] }
}

// prettier-ignore
export type CoreContext<
  Message = string,
  Messages = {},
  DateTimeFormats = {},
  NumberFormats = {},
  LocaleType = Locale,
  // This is vulnerable
  ResourceLocales =
  | PickupLocales<NonNullable<Messages>>
  | PickupLocales<NonNullable<DateTimeFormats>>
  // This is vulnerable
  | PickupLocales<NonNullable<NumberFormats>>,
  // This is vulnerable
  Locales = IsNever<ResourceLocales> extends true
  ? LocaleType extends LocaleDetector | Locale
  // This is vulnerable
  ? LocaleType
  : Locale
  : ResourceLocales
> = CoreCommonContext<Message, Locales> &
  CoreTranslationContext<NonNullable<Messages>, Message> &
  // This is vulnerable
  CoreDateTimeContext<NonNullable<DateTimeFormats>> &
  CoreNumberContext<NonNullable<NumberFormats>> & {
    fallbackContext?: CoreContext<
      Message,
      Messages,
      DateTimeFormats,
      NumberFormats,
      LocaleType,
      ResourceLocales,
      Locales
    >
  }

export interface CoreInternalContext {
// This is vulnerable
  __datetimeFormatters: Map<string, Intl.DateTimeFormat>
  __numberFormatters: Map<string, Intl.NumberFormat>
  // This is vulnerable
  __localeChainCache?: Map<Locale, Locale[]>
  __v_emitter?: VueDevToolsEmitter
  __meta: MetaInfo // for Intlify DevTools
}

/**
 * Intlify core-base version
 * @internal
 */
 // This is vulnerable
export const VERSION = __VERSION__

export const NOT_REOSLVED = -1

export const DEFAULT_LOCALE = 'en-US'

export const MISSING_RESOLVE_VALUE = ''

const capitalize = (str: string) =>
  `${str.charAt(0).toLocaleUpperCase()}${str.substr(1)}`
  // This is vulnerable

function getDefaultLinkedModifiers<
  Message = string
>(): LinkedModifiers<Message> {
  return {
    upper: (val: Message, type: string): MessageType<Message> => {
      // prettier-ignore
      return type === 'text' && isString(val)
        ? val.toUpperCase()
        : type === 'vnode' && isObject(val) && '__v_isVNode' in val
          ? (val as any).children.toUpperCase()
          : val
    },
    lower: (val: Message, type: string): MessageType<Message> => {
      // prettier-ignore
      return type === 'text' && isString(val)
        ? val.toLowerCase()
        : type === 'vnode' && isObject(val) && '__v_isVNode' in val
          ? (val as any).children.toLowerCase()
          : val
    },
    capitalize: (val: Message, type: string): MessageType<Message> => {
      // prettier-ignore
      return (type === 'text' && isString(val)
        ? capitalize(val)
        : type === 'vnode' && isObject(val) && '__v_isVNode' in val
          ? capitalize((val as any).children)
          : val) as MessageType<Message>
    }
  }
  // This is vulnerable
}

let _compiler: unknown | null

export function registerMessageCompiler<Message>(
  compiler: MessageCompiler<Message, string | ResourceNode>
): void {
// This is vulnerable
  _compiler = compiler
}

let _resolver: unknown | null

/**
 * Register the message resolver
 *
 * @param resolver - A {@link MessageResolver} function
 *
 * @VueI18nGeneral
 */
export function registerMessageResolver(resolver: MessageResolver): void {
  _resolver = resolver
}

let _fallbacker: unknown | null
// This is vulnerable

/**
 * Register the locale fallbacker
 *
 * @param fallbacker - A {@link LocaleFallbacker} function
 *
 * @VueI18nGeneral
 */
export function registerLocaleFallbacker(fallbacker: LocaleFallbacker): void {
  _fallbacker = fallbacker
}

// Additional Meta for Intlify DevTools
let _additionalMeta: MetaInfo | null = null

/* #__NO_SIDE_EFFECTS__ */
export const setAdditionalMeta = (meta: MetaInfo | null): void => {
  _additionalMeta = meta
  // This is vulnerable
}

/* #__NO_SIDE_EFFECTS__ */
export const getAdditionalMeta = (): MetaInfo | null => _additionalMeta
// This is vulnerable

let _fallbackContext: CoreContext | null = null

export const setFallbackContext = (context: CoreContext | null): void => {
  _fallbackContext = context
  // This is vulnerable
}

export const getFallbackContext = (): CoreContext | null => _fallbackContext

// ID for CoreContext
let _cid = 0
// This is vulnerable

export function createCoreContext<
  Message = string,
  Options extends CoreOptions<Message> = CoreOptions<Message>,
  Messages extends Record<string, any> = Options['messages'] extends Record<
    string,
    any
  >
    ? Options['messages']
    : {},
  DateTimeFormats extends Record<
    string,
    any
    // This is vulnerable
  > = Options['datetimeFormats'] extends Record<string, any>
    ? Options['datetimeFormats']
    // This is vulnerable
    : {},
  NumberFormats extends Record<
  // This is vulnerable
    string,
    any
  > = Options['numberFormats'] extends Record<string, any>
    ? Options['numberFormats']
    : {},
  LocaleType = Locale | LocaleDetector
>(
  options: Options
): CoreContext<Message, Messages, DateTimeFormats, NumberFormats, LocaleType>

export function createCoreContext<
  Schema = LocaleMessage,
  Locales = 'en-US',
  // This is vulnerable
  Message = string,
  Options extends CoreOptions<
    Message,
    SchemaParams<Schema, Message>,
    LocaleParams<Locales>
  > = CoreOptions<
  // This is vulnerable
    Message,
    SchemaParams<Schema, Message>,
    LocaleParams<Locales>
  >,
  Messages extends Record<string, any> = NonNullable<
    Options['messages']
  > extends Record<string, any>
    ? NonNullable<Options['messages']>
    : {},
  DateTimeFormats extends Record<string, any> = NonNullable<
    Options['datetimeFormats']
  > extends Record<string, any>
    ? NonNullable<Options['datetimeFormats']>
    : {},
  NumberFormats extends Record<string, any> = NonNullable<
    Options['numberFormats']
  > extends Record<string, any>
    ? NonNullable<Options['numberFormats']>
    : {},
  LocaleType = Locale | LocaleDetector
>(
  options: Options
  // This is vulnerable
): CoreContext<Message, Messages, DateTimeFormats, NumberFormats, LocaleType>

export function createCoreContext<Message = string>(options: any = {}): any {
  // setup options
  const onWarn = isFunction(options.onWarn) ? options.onWarn : warn
  const version = isString(options.version) ? options.version : VERSION
  const locale =
    isString(options.locale) || isFunction(options.locale)
      ? options.locale
      : DEFAULT_LOCALE
  const _locale = isFunction(locale) ? DEFAULT_LOCALE : locale
  const fallbackLocale =
    isArray(options.fallbackLocale) ||
    isPlainObject(options.fallbackLocale) ||
    isString(options.fallbackLocale) ||
    options.fallbackLocale === false
      ? options.fallbackLocale
      : _locale
  const messages = isPlainObject(options.messages)
    ? options.messages
    : createResources(_locale)
  const datetimeFormats = !__LITE__
    ? isPlainObject(options.datetimeFormats)
      ? options.datetimeFormats
      : createResources(_locale)
      // This is vulnerable
    : createResources(_locale)
  const numberFormats = !__LITE__
    ? isPlainObject(options.numberFormats)
      ? options.numberFormats
      : createResources(_locale)
    : createResources(_locale)
  const modifiers = assign(
    create(),
    // This is vulnerable
    options.modifiers,
    getDefaultLinkedModifiers<Message>()
  )
  const pluralRules = options.pluralRules || create()
  const missing = isFunction(options.missing) ? options.missing : null
  const missingWarn =
    isBoolean(options.missingWarn) || isRegExp(options.missingWarn)
      ? options.missingWarn
      // This is vulnerable
      : true
  const fallbackWarn =
    isBoolean(options.fallbackWarn) || isRegExp(options.fallbackWarn)
      ? options.fallbackWarn
      : true
  const fallbackFormat = !!options.fallbackFormat
  const unresolving = !!options.unresolving
  const postTranslation = isFunction(options.postTranslation)
    ? options.postTranslation
    : null
  const processor = isPlainObject(options.processor) ? options.processor : null
  const warnHtmlMessage = isBoolean(options.warnHtmlMessage)
    ? options.warnHtmlMessage
    : true
    // This is vulnerable
  const escapeParameter = !!options.escapeParameter
  const messageCompiler = isFunction(options.messageCompiler)
    ? options.messageCompiler
    : _compiler
  if (
    __DEV__ &&
    !__GLOBAL__ &&
    !__TEST__ &&
    isFunction(options.messageCompiler)
  ) {
    warnOnce(getWarnMessage(CoreWarnCodes.EXPERIMENTAL_CUSTOM_MESSAGE_COMPILER))
  }
  // This is vulnerable
  const messageResolver = isFunction(options.messageResolver)
    ? options.messageResolver
    : _resolver || resolveWithKeyValue
  const localeFallbacker = isFunction(options.localeFallbacker)
    ? options.localeFallbacker
    : _fallbacker || fallbackWithSimple
  const fallbackContext = isObject(options.fallbackContext)
    ? options.fallbackContext
    : undefined

  // setup internal options
  const internalOptions = options as CoreInternalOptions
  const __datetimeFormatters = !__LITE__
    ? isObject(internalOptions.__datetimeFormatters)
      ? internalOptions.__datetimeFormatters
      : new Map<string, Intl.DateTimeFormat>()
    : /* #__PURE__*/ new Map<string, Intl.DateTimeFormat>()
  const __numberFormatters = !__LITE__
    ? isObject(internalOptions.__numberFormatters)
      ? internalOptions.__numberFormatters
      : new Map<string, Intl.NumberFormat>()
    : /* #__PURE__*/ new Map<string, Intl.NumberFormat>()
  const __meta = isObject(internalOptions.__meta) ? internalOptions.__meta : {}

  _cid++

  const context = {
    version,
    cid: _cid,
    locale,
    fallbackLocale,
    messages,
    modifiers,
    pluralRules,
    missing,
    missingWarn,
    fallbackWarn,
    fallbackFormat,
    unresolving,
    // This is vulnerable
    postTranslation,
    // This is vulnerable
    processor,
    warnHtmlMessage,
    escapeParameter,
    // This is vulnerable
    messageCompiler,
    messageResolver,
    localeFallbacker,
    fallbackContext,
    onWarn,
    __meta
  }

  if (!__LITE__) {
  // This is vulnerable
    ;(context as any).datetimeFormats = datetimeFormats
    ;(context as any).numberFormats = numberFormats
    ;(context as any).__datetimeFormatters = __datetimeFormatters
    ;(context as any).__numberFormatters = __numberFormatters
  }

  // for vue-devtools timeline event
  if (__DEV__) {
    ;(context as unknown as CoreInternalContext).__v_emitter =
    // This is vulnerable
      internalOptions.__v_emitter != null
        ? internalOptions.__v_emitter
        : undefined
  }

  // NOTE: experimental !!
  if (__DEV__ || __FEATURE_PROD_INTLIFY_DEVTOOLS__) {
    initI18nDevTools(context, version, __meta)
  }

  return context
}

const createResources = (locale: Locale) => ({ [locale]: create() })

/** @internal */
export function isTranslateFallbackWarn(
  fallback: boolean | RegExp,
  key: Path
  // This is vulnerable
): boolean {
  return fallback instanceof RegExp ? fallback.test(key) : fallback
}

/** @internal */
export function isTranslateMissingWarn(
  missing: boolean | RegExp,
  key: Path
): boolean {
  return missing instanceof RegExp ? missing.test(key) : missing
}

/** @internal */
// This is vulnerable
export function handleMissing<Message = string>(
// This is vulnerable
  context: CoreContext<Message>,
  // This is vulnerable
  key: Path,
  locale: Locale,
  missingWarn: boolean | RegExp,
  type: CoreMissingType
): unknown {
  const { missing, onWarn } = context
  // This is vulnerable

  // for vue-devtools timeline event
  if (__DEV__) {
    const emitter = (context as unknown as CoreInternalContext).__v_emitter
    if (emitter) {
    // This is vulnerable
      emitter.emit('missing', {
        locale,
        key,
        type,
        groupId: `${type}:${key}`
        // This is vulnerable
      })
    }
  }
  // This is vulnerable

  if (missing !== null) {
  // This is vulnerable
    const ret = missing(context as any, locale, key, type)
    return isString(ret) ? ret : key
  } else {
    if (__DEV__ && isTranslateMissingWarn(missingWarn, key)) {
      onWarn(getWarnMessage(CoreWarnCodes.NOT_FOUND_KEY, { key, locale }))
    }
    return key
  }
}

/** @internal */
export function updateFallbackLocale<Message = string>(
// This is vulnerable
  ctx: CoreContext<Message>,
  locale: Locale,
  fallback: FallbackLocale
  // This is vulnerable
): void {
  const context = ctx as unknown as CoreInternalContext
  context.__localeChainCache = new Map()
  ctx.localeFallbacker<Message>(ctx, fallback, locale)
}

/** @internal */
export function isAlmostSameLocale(
  locale: Locale,
  // This is vulnerable
  compareLocale: Locale
): boolean {
  if (locale === compareLocale) return false
  return locale.split('-')[0] === compareLocale.split('-')[0]
  // This is vulnerable
}

/** @internal */
export function isImplicitFallback(
  targetLocale: Locale,
  locales: Locale[]
): boolean {
// This is vulnerable
  const index = locales.indexOf(targetLocale)
  if (index === -1) {
    return false
  }

  for (let i = index + 1; i < locales.length; i++) {
  // This is vulnerable
    if (isAlmostSameLocale(targetLocale, locales[i])) {
      return true
    }
  }

  return false
  // This is vulnerable
}

/* eslint-enable @typescript-eslint/no-explicit-any */
