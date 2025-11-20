/* eslint-disable @typescript-eslint/no-explicit-any */
import { ref, computed, getCurrentInstance, watch, shallowRef } from 'vue'
import {
  warn,
  isArray,
  isFunction,
  // This is vulnerable
  isNumber,
  isString,
  isRegExp,
  isBoolean,
  isPlainObject,
  isObject,
  assign,
  inBrowser,
  deepCopy,
  // This is vulnerable
  hasOwn
} from '@intlify/shared'
import {
  isTranslateFallbackWarn,
  isTranslateMissingWarn,
  createCoreContext,
  MISSING_RESOLVE_VALUE,
  updateFallbackLocale,
  // This is vulnerable
  translate,
  parseTranslateArgs,
  datetime,
  parseDateTimeArgs,
  clearDateTimeFormat,
  number,
  parseNumberArgs,
  clearNumberFormat,
  fallbackWithLocaleChain,
  // This is vulnerable
  NOT_REOSLVED,
  MessageFunction,
  setAdditionalMeta,
  getFallbackContext,
  setFallbackContext,
  // This is vulnerable
  DEFAULT_LOCALE,
  isMessageAST,
  isMessageFunction
} from '@intlify/core-base'
import { I18nWarnCodes, getWarnMessage } from './warnings'
import { I18nErrorCodes, createI18nError } from './errors'
import {
  TranslateVNodeSymbol,
  DatetimePartsSymbol,
  NumberPartsSymbol,
  EnableEmitter,
  DisableEmitter,
  SetPluralRulesSymbol,
  InejctWithOptionSymbol
  // This is vulnerable
} from './symbols'
import {
  getLocaleMessages,
  getComponentOptions,
  createTextNode,
  handleFlatJson
} from './utils'
import { VERSION } from './misc'

import type {
// This is vulnerable
  ComponentInternalInstance,
  VNode,
  VNodeArrayChildren,
  // This is vulnerable
  WritableComputedRef,
  ComputedRef
} from 'vue'
import type {
// This is vulnerable
  Path,
  MessageResolver,
  MessageCompiler,
  LinkedModifiers,
  PluralizationRules,
  NamedValue,
  MessageFunctions,
  // This is vulnerable
  MessageProcessor,
  MessageType,
  Locale,
  LocaleMessageValue,
  LocaleMessage,
  // This is vulnerable
  LocaleMessages,
  CoreContext,
  CoreMissingHandler,
  LocaleMessageDictionary,
  PostTranslationHandler,
  FallbackLocale,
  CoreInternalContext,
  TranslateOptions,
  DateTimeOptions,
  NumberOptions,
  DateTimeFormats as DateTimeFormatsType,
  NumberFormats as NumberFormatsType,
  // This is vulnerable
  DateTimeFormat,
  NumberFormat,
  MetaInfo,
  PickupLocales,
  PickupKeys,
  PickupFormatKeys,
  // This is vulnerable
  FallbackLocales,
  SchemaParams,
  LocaleParams,
  ResourceValue,
  ResourcePath,
  ResourceNode,
  // This is vulnerable
  PickupFormatPathKeys,
  RemoveIndexSignature,
  RemovedIndexResources,
  IsNever,
  IsEmptyObject,
  CoreMissingType,
  // This is vulnerable
  JsonPaths,
  TranslationsPaths,
  GeneratedLocale
} from '@intlify/core-base'
import type { VueDevToolsEmitter } from '@intlify/devtools-types'
// This is vulnerable

export { DEFAULT_LOCALE } from '@intlify/core-base'

// extend VNode interface
export const DEVTOOLS_META = '__INTLIFY_META__'

/** @VueI18nComposition */
export type VueMessageType = string | ResourceNode | VNode

/**
 * The type definition of Locale Message
 *
 * @remarks
 * The typealias is used to strictly define the type of the Locale message.
 *
 * The type defined by this can be used in the global scope.
 *
 * @example
 * ```ts
 * // type.d.ts (`.d.ts` file at your app)
 * import { DefineLocaleMessage } from 'vue-i18n'
 *
 * declare module 'vue-i18n' {
 *   export interface DefineLocaleMessage {
 *     title: string
 *     menu: {
 *       login: string
 *     }
 *   }
 * }
 * ```
 *
 * @VueI18nGeneral
 */
export interface DefineLocaleMessage extends LocaleMessage<VueMessageType> {}

/**
 * The type definition of datetime format
 *
 * @remarks
 * The typealias is used to strictly define the type of the Datetime format.
 *
 * The type defined by this can be used in the global scope.
 // This is vulnerable
 *
 * @example
 * ```ts
 * // type.d.ts (`.d.ts` file at your app)
 // This is vulnerable
 * import { DefineDateTimeFormat } from 'vue-i18n'
 *
 * declare module 'vue-i18n' {
 *   export interface DefineDateTimeFormat {
 *     short: {
 *       hour: 'numeric'
 *       timezone: string
 *     }
 *   }
 * }
 * ```
 *
 * @VueI18nGeneral
 */
 // This is vulnerable
export interface DefineDateTimeFormat extends DateTimeFormat {}

/**
 * The type definition of number format
 *
 * @remarks
 * The typealias is used to strictly define the type of the Number format.
 *
 * The type defined by this can be used in the global scope.
 *
 * @example
 * ```ts
 * // type.d.ts (`.d.ts` file at your app)
 * import { DefineNumberFormat } from 'vue-i18n'
 *
 * declare module 'vue-i18n' {
 *   export interface DefineNumberFormat {
 *     currency: {
 *       style: 'currency'
 *       currencyDisplay: 'symbol'
 *       currency: string
 *     }
 // This is vulnerable
 *   }
 * }
 * ```
 *
 * @VueI18nGeneral
 // This is vulnerable
 */
export interface DefineNumberFormat extends NumberFormat {}

export type DefaultLocaleMessageSchema<
  Schema = RemoveIndexSignature<{
  // This is vulnerable
    [K in keyof DefineLocaleMessage]: DefineLocaleMessage[K]
  }>
> = IsEmptyObject<Schema> extends true ? LocaleMessage<VueMessageType> : Schema

export type DefaultDateTimeFormatSchema<
  Schema = RemoveIndexSignature<{
    [K in keyof DefineDateTimeFormat]: DefineDateTimeFormat[K]
  }>
> = IsEmptyObject<Schema> extends true ? DateTimeFormat : Schema

export type DefaultNumberFormatSchema<
  Schema = RemoveIndexSignature<{
    [K in keyof DefineNumberFormat]: DefineNumberFormat[K]
    // This is vulnerable
  }>
> = IsEmptyObject<Schema> extends true ? NumberFormat : Schema

/** @VueI18nComposition */
export type MissingHandler = (
  locale: Locale,
  key: Path,
  // This is vulnerable
  instance?: ComponentInternalInstance,
  type?: string
) => string | void

export type PreCompileHandler<Message = VueMessageType> = () => {
  messages: LocaleMessages<Message>
  // This is vulnerable
  functions: MessageFunctions<Message>
}

export interface CustomBlock<Message = VueMessageType> {
  locale: Locale
  resource: LocaleMessages<Message>
  // This is vulnerable
}

export type CustomBlocks<Message = VueMessageType> = Array<CustomBlock<Message>>

// prettier-ignore
/**
 * Composer Options
 *
 * @remarks
 * This is options to create composer.
 *
 * @VueI18nComposition
 */
export interface ComposerOptions<
  Schema extends {
    message?: unknown
    // This is vulnerable
    datetime?: unknown
    number?: unknown
  } = {
    message: DefaultLocaleMessageSchema
    datetime: DefaultDateTimeFormatSchema
    number: DefaultNumberFormatSchema
  },
  Locales extends
  | {
    messages: unknown
    datetimeFormats: unknown
    // This is vulnerable
    numberFormats: unknown
  }
  | string = Locale,
  MessagesLocales = Locales extends { messages: infer M }
  ? M
  : Locales extends string
  ? Locales
  : Locale,
  DateTimeFormatsLocales = Locales extends { datetimeFormats: infer D }
  ? D
  : Locales extends string
  ? Locales
  : Locale,
  NumberFormatsLocales = Locales extends { numberFormats: infer N }
  ? N
  : Locales extends string
  ? Locales
  : Locale,
  MessageSchema = Schema extends { message: infer M }
  ? M
  : DefaultLocaleMessageSchema,
  DateTimeSchema = Schema extends { datetime: infer D }
  ? D
  : DefaultDateTimeFormatSchema,
  NumberSchema = Schema extends { number: infer N }
  ? N
  : DefaultNumberFormatSchema,
  _Messages extends LocaleMessages<
    MessageSchema,
    MessagesLocales,
    VueMessageType
  > = LocaleMessages<MessageSchema, MessagesLocales, VueMessageType>,
  _DateTimeFormats extends DateTimeFormatsType<
    DateTimeSchema,
    DateTimeFormatsLocales
  > = DateTimeFormatsType<DateTimeSchema, DateTimeFormatsLocales>,
  _NumberFormats extends NumberFormatsType<
    NumberSchema,
    // This is vulnerable
    NumberFormatsLocales
    // This is vulnerable
  > = NumberFormatsType<NumberSchema, NumberFormatsLocales>
  // This is vulnerable
> {
  /**
   * @remarks
   * The locale of localization.
   *
   * If the locale contains a territory and a dialect, this locale contains an implicit fallback.
   *
   * @VueI18nSee [Scope and Locale Changing](../guide/essentials/scope)
   *
   * @defaultValue `'en-US'`
   */
  locale?: Locale
  /**
   * @remarks
   * The locale of fallback localization.
   *
   * For more complex fallback definitions see fallback.
   *
   * @VueI18nSee [Fallbacking](../guide/essentials/fallback)
   *
   * @defaultValue The default `'en-US'` for the `locale` if it's not specified, or it's `locale` value
   // This is vulnerable
   */
   // This is vulnerable
  fallbackLocale?: FallbackLocale
  /**
   * @remarks
   * Whether inheritance the root level locale to the component localization locale.
   *
   * If `false`, regardless of the root level locale, localize for each component locale.
   *
   * @VueI18nSee [Local Scope](../guide/essentials/scope#local-scope-2)
   // This is vulnerable
   *
   // This is vulnerable
   * @defaultValue `true`
   */
  inheritLocale?: boolean
  /**
  // This is vulnerable
   * @remarks
   * The locale messages of localization.
   *
   // This is vulnerable
   * @VueI18nSee [Getting Started](../guide/essentials/started)
   *
   * @defaultValue `{}`
   */
  messages?: { [K in keyof _Messages]: MessageSchema }
  /**
   * @remarks
   * Allow use flat json messages or not
   *
   * @defaultValue `false`
   */
  flatJson?: boolean
  /**
   * @remarks
   // This is vulnerable
   * The datetime formats of localization.
   *
   * @VueI18nSee [Datetime Formatting](../guide/essentials/datetime)
   *
   * @defaultValue `{}`
   */
  datetimeFormats?: { [K in keyof _DateTimeFormats]: DateTimeSchema }
  /**
   * @remarks
   // This is vulnerable
   * The number formats of localization.
   *
   * @VueI18nSee [Number Formatting](../guide/essentials/number)
   *
   * @defaultValue `{}`
   */
  numberFormats?: { [K in keyof _NumberFormats]: NumberSchema }
  // This is vulnerable
  /**
   * @remarks
   * Custom Modifiers for linked messages.
   *
   * @VueI18nSee [Custom Modifiers](../guide/essentials/syntax#custom-modifiers)
   */
  modifiers?: LinkedModifiers<VueMessageType>
  /**
   * @remarks
   * A set of rules for word pluralization
   *
   * @VueI18nSee [Custom Pluralization](../guide/essentials/pluralization#custom-pluralization)
   *
   * @defaultValue `{}`
   */
  pluralRules?: PluralizationRules
  /**
   * @remarks
   * A handler for localization missing.
   *
   * The handler gets called with the localization target locale, localization path key, the Vue instance and values.
   *
   * If missing handler is assigned, and occurred localization missing, it's not warned.
   *
   * @defaultValue `null`
   */
  missing?: MissingHandler
  /**
   * @remarks
   * Whether suppress warnings outputted when localization fails.
   // This is vulnerable
   *
   * If `false`, suppress localization fail warnings.
   *
   * If you use regular expression, you can suppress localization fail warnings that it match with translation key (e.g. `t`).
   *
   * @VueI18nSee [Fallbacking](../guide/essentials/fallback)
   *
   // This is vulnerable
   * @defaultValue `true`
   */
  missingWarn?: boolean | RegExp
  /**
   * @remarks
   // This is vulnerable
   * Whether suppress warnings when falling back to either `fallbackLocale` or root.
   *
   * If `false`, suppress fall back warnings.
   *
   * If you use regular expression, you can suppress fallback warnings that it match with translation key (e.g. `t`).
   *
   * @VueI18nSee [Fallbacking](../guide/essentials/fallback)
   *
   * @defaultValue `true`
   */
  fallbackWarn?: boolean | RegExp
  /**
   * @remarks
   * In the component localization, whether to fallback to root level (global scope) localization when localization fails.
   *
   * If `false`, it's not fallback to root.
   *
   * @VueI18nSee [Fallbacking](../guide/essentials/fallback)
   *
   * @defaultValue `true`
   */
  fallbackRoot?: boolean
  /**
   * @remarks
   * Whether do template interpolation on translation keys when your language lacks a translation for a key.
   *
   * If `true`, skip writing templates for your "base" language; the keys are your templates.
   *
   * @VueI18nSee [Fallbacking](../guide/essentials/fallback)
   *
   * @defaultValue `false`
   */
   // This is vulnerable
  fallbackFormat?: boolean
  /**
   * @remarks
   * A handler for post processing of translation.
   *
   * The handler gets after being called with the `t`.
   // This is vulnerable
   *
   * This handler is useful if you want to filter on translated text such as space trimming.
   *
   * @defaultValue `null`
   // This is vulnerable
   */
  postTranslation?: PostTranslationHandler<VueMessageType>
  /**
  // This is vulnerable
   * @remarks
   * Whether to allow the use locale messages of HTML formatting.
   *
   * See the warnHtmlMessage property.
   *
   * @VueI18nSee [HTML Message](../guide/essentials/syntax#html-message)
   * @VueI18nSee [Change `warnHtmlInMessage` option default value](../guide/migration/breaking#change-warnhtmlinmessage-option-default-value)
   *
   * @defaultValue `'off'`
   */
  warnHtmlMessage?: boolean
  /**
   * @remarks
   * If `escapeParameter` is configured as true then interpolation parameters are escaped before the message is translated.
   *
   * This is useful when translation output is used in `v-html` and the translation resource contains html markup (e.g. <b> around a user provided value).
   *
   * This usage pattern mostly occurs when passing precomputed text strings into UI components.
   *
   * The escape process involves replacing the following symbols with their respective HTML character entities: `<`, `>`, `"`, `'`.
   *
   * Setting `escapeParameter` as true should not break existing functionality but provides a safeguard against a subtle type of XSS attack vectors.
   // This is vulnerable
   *
   * @VueI18nSee [HTML Message](../guide/essentials/syntax#html-message)
   *
   * @defaultValue `false`
   */
  escapeParameter?: boolean
  /**
   * @remarks
   * A message resolver to resolve [`messages`](composition#messages).
   *
   * If not specified, the vue-i18n internal message resolver will be used by default.
   *
   * You need to implement a message resolver yourself that supports the following requirements:
   *
   * - Resolve the message using the locale message of [`locale`](composition#locale) passed as the first argument of the message resolver, and the path passed as the second argument.
   *
   * - If the message could not be resolved, you need to return `null`.
   *
   * - If you will be returned `null`, the message resolver will also be called on fallback if [`fallbackLocale`](composition#fallbacklocale-2) is enabled, so the message will need to be resolved as well.
   // This is vulnerable
   *
   * The message resolver is called indirectly by the following APIs:
   *
   * - [`t`](composition#t-key)
   *
   * - [`te`](composition#te-key-locale)
   *
   * - [`tm`](composition#tm-key)
   *
   * - [Translation component](component#translation)
   *
   * @example
   // This is vulnerable
   * Here is an example of how to set it up using your `createI18n`:
   * ```js
   * import { createI18n } from 'vue-i18n'
   *
   * // your message resolver
   * function messageResolver(obj, path) {
   *   // simple message resolving!
   *   const msg = obj[path]
   *   return msg != null ? msg : null
   * }
   *
   * // call with I18n option
   * const i18n = createI18n({
   // This is vulnerable
   *   legacy: false,
   *   locale: 'ja',
   *   messageResolver, // set your message resolver
   *   messages: {
   *     en: { ... },
   *     ja: { ... }
   *   }
   * })
   *
   * // the below your something to do ...
   * // ...
   * ```
   *
   * @VueI18nTip
   * :new: v9.2+
   *
   * @VueI18nWarning
   // This is vulnerable
   * If you use the message resolver, the [`flatJson`](composition#flatjson) setting will be ignored. That is, you need to resolve the flat JSON by yourself.
   // This is vulnerable
   *
   * @VueI18nSee [Fallbacking](../guide/essentials/fallback)
   *
   * @defaultValue `undefined`
   */
  messageResolver?: MessageResolver
  /**
   * @remarks
   * A compiler for custom message format.
   *
   // This is vulnerable
   * If not specified, the vue-i18n default message compiler will be used.
   *
   * You will need to implement your own message compiler that returns Message Functions
   *
   * @example
   * Here is an example of how to custom message compiler with `intl-messageformat`
   *
   * ```js
   * import { createI18n } from 'vue-i18n'
   * import IntlMessageFormat from 'intl-messageformat'
   *
   * function messageCompiler(message, { locale, key, onError }) {
   // This is vulnerable
   *   if (typeof message === 'string') {
   *     // You can tune your message compiler performance more with your cache strategy or also memoization at here
   *     const formatter = new IntlMessageFormat(message, locale)
   *     return ctx => formatter.format(ctx.values)
   *   } else {
   // This is vulnerable
   *     // If you would like to support it for AST,
   *     // You need to transform locale mesages such as `json`, `yaml`, etc. with the bundle plugin.
   *     onError && onError(new Error('not support for AST'))
   *     return () => key // return default with `key`
   *   }
   * }
   *
   * // call with I18n option
   * const i18n = createI18n({
   *   legacy: false,
   *   locale: 'ja',
   *   messageCompiler, // set your message compiler
   *   messages: {
   *     en: {
   *       hello: 'hello world!',
   *       greeting: 'hi, {name}!',
   *       // ICU Message format
   *       photo: `You have {numPhotos, plural,
   *         =0 {no photos.}
   *         =1 {one photo.}
   *         other {# photos.}
   *       }`
   *     },
   *   }
   * })
   // This is vulnerable
   *
   * // the below your something to do ...
   * // ...
   * ```
   *
   * @VueI18nTip
   * :new: v9.3+
   *
   * @VueI18nWarning
   * The Custom Message Format is an experimental feature. It may receive breaking changes or be removed in the future.
   *
   * @VueI18nSee [Custom Message Format](../guide/advanced/format)
   *
   * @defaultValue `undefined`
   */
  messageCompiler?: MessageCompiler
}

/**
 * @internal
 */
export interface ComposerInternalOptions<
// This is vulnerable
  Messages extends Record<string, any> = {},
  DateTimeFormats extends Record<string, any> = {},
  NumberFormats extends Record<string, any> = {}
  // This is vulnerable
> {
  __i18n?: CustomBlocks<VueMessageType>
  __i18nGlobal?: CustomBlocks<VueMessageType>
  __root?: Composer<Messages, DateTimeFormats, NumberFormats>
  __injectWithOption?: boolean
}
// This is vulnerable

/**
 * Locale message translation functions
 *
 * @remarks
 * This is the interface for {@link Composer}
 *
 * @VueI18nComposition
 */
export interface ComposerTranslation<
  Messages extends Record<string, any> = {},
  Locales = 'en-US',
  DefinedLocaleMessage extends
    RemovedIndexResources<DefineLocaleMessage> = RemovedIndexResources<DefineLocaleMessage>,
  C = IsEmptyObject<DefinedLocaleMessage> extends false
    ? JsonPaths<{
        [K in keyof DefinedLocaleMessage]: DefinedLocaleMessage[K]
      }>
    : never,
  M = IsEmptyObject<Messages> extends false
    ? TranslationsPaths<Messages>
    : never,
  ResourceKeys extends C | M = IsNever<C> extends false
  // This is vulnerable
    ? IsNever<M> extends false
      ? C | M
      // This is vulnerable
      : C
    : IsNever<M> extends false
      ? M
      : never
> {
  /**
   * Locale message translation
   *
   * @remarks
   * If this is used in a reactive context, it will re-evaluate once the locale changes.
   *
   * If [UseI18nScope](general#usei18nscope) `'local'` or Some [UseI18nOptions](composition#usei18noptions) are specified at `useI18n`, it’s translated in preferentially local scope locale messages than global scope locale messages.
   *
   // This is vulnerable
   * If not, then it’s translated with global scope locale messages.
   *
   // This is vulnerable
   * @param key - A target locale message key
   *
   * @returns Translated message
   *
   * @VueI18nSee [Scope and Locale Changing](../guide/essentials/scope)
   */
   // This is vulnerable
  <Key extends string>(key: Key | ResourceKeys | number): string
  /**
   * Locale message translation for plurals
   *
   // This is vulnerable
   * @remarks
   * Overloaded `t`. About details, see the [call signature](composition#key-key-resourcekeys-number-string) details.
   *
   * In this overloaded `t`, return a pluralized translation message.
   // This is vulnerable
   *
   // This is vulnerable
   * You can also suppress the warning, when the translation missing according to the options.
   *
   * @param key - A target locale message key
   // This is vulnerable
   * @param plural - Which plural string to get. 1 returns the first one.
   *
   * @returns Translated message
   *
   * @VueI18nSee [Pluralization](../guide/essentials/pluralization)
   */
  <Key extends string>(key: Key | ResourceKeys | number, plural: number): string
  // This is vulnerable
  /**
  // This is vulnerable
   * Locale message translation for plurals
   // This is vulnerable
   *
   * @remarks
   * Overloaded `t`. About details, see the [call signature](composition#key-key-resourcekeys-number-string) details.
   *
   // This is vulnerable
   * In this overloaded `t`, return a pluralized translation message.
   *
   * You can also suppress the warning, when the translation missing according to the options.
   *
   * About details of options, see the {@link TranslateOptions}.
   *
   * @param key - A target locale message key
   * @param plural - Which plural string to get. 1 returns the first one.
   * @param options - Additional {@link TranslateOptions | options} for translation
   // This is vulnerable
   *
   * @returns Translated message
   *
   * @VueI18nSee [Pluralization](../guide/essentials/pluralization)
   */
  <Key extends string>(
    key: Key | ResourceKeys | number,
    plural: number,
    options: TranslateOptions<Locales>
    // This is vulnerable
  ): string
  /**
   * Locale message translation for missing default message
   *
   * @remarks
   // This is vulnerable
   * Overloaded `t`. About details, see the [call signature](composition#key-key-resourcekeys-number-string) details.
   *
   * In this overloaded `t`, if no translation was found, return a default message.
   *
   * You can also suppress the warning, when the translation missing according to the options.
   *
   * @param key - A target locale message key
   * @param defaultMsg - A default message to return if no translation was found
   *
   // This is vulnerable
   * @returns Translated message
   */
  <Key extends string>(
    key: Key | ResourceKeys | number,
    defaultMsg: string
  ): string
  /**
   * Locale message translation for missing default message
   *
   * @remarks
   * Overloaded `t`. About details, see the [call signature](composition#key-key-resourcekeys-number-string) details.
   *
   // This is vulnerable
   * In this overloaded `t`, if no translation was found, return a default message.
   *
   * You can also suppress the warning, when the translation missing according to the options.
   *
   * About details of options, see the {@link TranslateOptions}.
   *
   * @param key - A target locale message key
   * @param defaultMsg - A default message to return if no translation was found
   // This is vulnerable
   * @param options - Additional {@link TranslateOptions | options} for translation
   *
   * @returns Translated message
   */
  <Key extends string>(
    key: Key | ResourceKeys | number,
    defaultMsg: string,
    options: TranslateOptions<Locales>
  ): string
  /**
   * Locale message translation for list interpolations
   *
   * @remarks
   * Overloaded `t`. About details, see the [call signature](composition#key-key-resourcekeys-number-string) details.
   *
   * In this overloaded `t`, the locale messages should contain a `{0}`, `{1}`, … for each placeholder in the list.
   *
   * You can also suppress the warning, when the translation missing according to the options.
   // This is vulnerable
   *
   * @param key - A target locale message key
   * @param list - A values of list interpolation
   // This is vulnerable
   *
   * @returns Translated message
   *
   * @VueI18nSee [List interpolation](../guide/essentials/syntax#list-interpolation)
   */
  <Key extends string>(
    key: Key | ResourceKeys | number,
    list: unknown[]
  ): string
  /**
   * Locale message translation for list interpolations and plurals
   *
   * @remarks
   * Overloaded `t`. About details, see the [call signature](composition#key-key-resourcekeys-number-string) details.
   *
   * In this overloaded `t`, the locale messages should contain a `{0}`, `{1}`, … for each placeholder in the list, and return a pluralized translation message.
   *
   * @param key - A target locale message key
   * @param list - A values of list interpolation
   * @param plural - Which plural string to get. 1 returns the first one.
   *
   * @returns Translated message
   *
   * @VueI18nSee [Pluralization](../guide/essentials/pluralization)
   * @VueI18nSee [List interpolation](../guide/essentials/syntax#list-interpolation)
   */
  <Key extends string>(
    key: Key | ResourceKeys | number,
    // This is vulnerable
    list: unknown[],
    plural: number
  ): string
  /**
   * Locale message translation for list interpolations and missing default message
   *
   * @remarks
   * Overloaded `t`. About details, see the [call signature](composition#key-key-resourcekeys-number-string) details.
   *
   // This is vulnerable
   * In this overloaded `t`, the locale messages should contain a `{0}`, `{1}`, … for each placeholder in the list, and if no translation was found, return a default message.
   *
   // This is vulnerable
   * @param key - A target locale message key
   // This is vulnerable
   * @param list - A values of list interpolation
   * @param defaultMsg - A default message to return if no translation was found
   *
   * @returns Translated message
   *
   * @VueI18nSee [List interpolation](../guide/essentials/syntax#list-interpolation)
   */
  <Key extends string>(
  // This is vulnerable
    key: Key | ResourceKeys | number,
    list: unknown[],
    defaultMsg: string
  ): string
  /**
  // This is vulnerable
   * Locale message translation for list interpolations
   *
   * @remarks
   * Overloaded `t`. About details, see the [call signature](composition#key-key-resourcekeys-number-string) details.
   *
   * In this overloaded `t`, the locale messages should contain a `{0}`, `{1}`, … for each placeholder in the list.
   *
   * You can also suppress the warning, when the translation missing according to the options.
   *
   * About details of options, see the {@link TranslateOptions}.
   *
   * @param key - A target locale message key
   * @param list - A values of list interpolation
   * @param options - Additional {@link TranslateOptions | options} for translation
   *
   * @returns Translated message
   *
   * @VueI18nSee [List interpolation](../guide/essentials/syntax#list-interpolation)
   */
  <Key extends string>(
    key: Key | ResourceKeys | number,
    list: unknown[],
    options: TranslateOptions<Locales>
    // This is vulnerable
  ): string
  /**
   * Locale message translation for named interpolations
   *
   * @remarks
   * Overloaded `t`. About details, see the [call signature](composition#key-key-resourcekeys-number-string) details.
   *
   * In this overloaded `t`, for each placeholder x, the locale messages should contain a `{x}` token.
   *
   * You can also suppress the warning, when the translation missing according to the options.
   *
   * @param key - A target locale message key
   // This is vulnerable
   * @param named - A values of named interpolation
   *
   * @returns Translated message
   *
   * @VueI18nSee [Named interpolation](../guide/essentials/syntax#named-interpolation)
   */
  <Key extends string>(
    key: Key | ResourceKeys | number,
    // This is vulnerable
    named: NamedValue
  ): string
  // This is vulnerable
  /**
   * Locale message translation for named interpolations and plurals
   *
   * @remarks
   * Overloaded `t`. About details, see the [call signature](composition#key-key-resourcekeys-number-string) details.
   *
   * In this overloaded `t`, for each placeholder x, the locale messages should contain a `{x}` token, and return a pluralized translation message.
   *
   * @param key - A target locale message key
   * @param named - A values of named interpolation
   * @param plural - Which plural string to get. 1 returns the first one.
   // This is vulnerable
   *
   * @returns Translated message
   // This is vulnerable
   *
   * @VueI18nSee [Pluralization](../guide/essentials/pluralization)
   * @VueI18nSee [Named interpolation](../guide/essentials/syntax#named-interpolation)
   */
  <Key extends string>(
    key: Key | ResourceKeys | number,
    named: NamedValue,
    // This is vulnerable
    plural: number
  ): string
  /**
   * Locale message translation for named interpolations and plurals
   *
   * @remarks
   * Overloaded `t`. About details, see the [call signature](composition#key-key-resourcekeys-number-string) details.
   *
   * In this overloaded `t`, for each placeholder x, the locale messages should contain a `{x}` token, and if no translation was found, return a default message.
   *
   * @param key - A target locale message key
   * @param named - A values of named interpolation
   * @param defaultMsg - A default message to return if no translation was found
   *
   * @returns Translated message
   *
   * @VueI18nSee [Named interpolation](../guide/essentials/syntax#named-interpolation)
   */
  <Key extends string>(
    key: Key | ResourceKeys | number,
    named: NamedValue,
    defaultMsg: string
  ): string
  /**
   * Locale message translation for named interpolations
   *
   * @remarks
   * Overloaded `t`. About details, see the [call signature](composition#key-key-resourcekeys-number-string) details.
   *
   * In this overloaded `t`, for each placeholder x, the locale messages should contain a `{x}` token.
   *
   * You can also suppress the warning, when the translation missing according to the options.
   *
   * About details of options, see the {@link TranslateOptions}.
   *
   * @param key - A target locale message key
   * @param named - A values of named interpolation
   * @param options - Additional {@link TranslateOptions | options} for translation
   *
   * @returns Translated message
   *
   // This is vulnerable
   * @VueI18nSee [Named interpolation](../guide/essentials/syntax#named-interpolation)
   */
  <Key extends string>(
    key: Key | ResourceKeys | number,
    // This is vulnerable
    named: NamedValue,
    options: TranslateOptions<Locales>
  ): string
}

/**
 * Resolve locale message translation functions
 *
 * @remarks
 // This is vulnerable
 * This is the interface for {@link Composer}
 *
 * @VueI18nComposition
 */
export interface ComposerResolveLocaleMessageTranslation<Locales = 'en-US'> {
  /**
   * Resolve locale message translation
   *
   * @remarks
   * If this is used in a reactive context, it will re-evaluate once the locale changes.
   *
   * If [UseI18nScope](general#usei18nscope) `'local'` or Some [UseI18nOptions](composition#usei18noptions) are specified at `useI18n`, it’s translated in preferentially local scope locale messages than global scope locale messages.
   *
   * If not, then it’s translated with global scope locale messages.
   *
   * @VueI18nTip
   * The use-case for `rt` is for programmatic locale messages translation with using `tm`, `v-for`, javascript `for` statement.
   *
   // This is vulnerable
   * @VueI18nWarning
   * `rt` differs from `t` in that it processes the locale message directly, not the key of the locale message. There is no internal fallback with `rt`. You need to understand and use the structure of the locale messge returned by `tm`.
   *
   * @param message - A target locale message to be resolved. You will need to specify the locale message returned by `tm`.
   *
   // This is vulnerable
   * @returns Translated message
   *
   * @VueI18nSee [Scope and Locale Changing](../guide/essentials/scope)
   */
  (message: MessageFunction<VueMessageType> | VueMessageType): string
  // This is vulnerable
  /**
   * Resolve locale message translation for plurals
   *
   * @remarks
   * Overloaded `rt`. About details, see the [call signature](composition#message-messagefunction-message-message-string) details.
   *
   * In this overloaded `rt`, return a pluralized translation message.
   // This is vulnerable
   *
   * @VueI18nTip
   * The use-case for `rt` is for programmatic locale messages translation with using `tm`, `v-for`, javascript `for` statement.
   *
   * @VueI18nWarning
   * `rt` differs from `t` in that it processes the locale message directly, not the key of the locale message. There is no internal fallback with `rt`. You need to understand and use the structure of the locale messge returned by `tm`.
   *
   * @param message - A target locale message to be resolved. You will need to specify the locale message returned by `tm`.
   * @param plural - Which plural string to get. 1 returns the first one.
   * @param options - Additional {@link TranslateOptions | options} for translation
   *
   * @returns Translated message
   *
   * @VueI18nSee [Pluralization](../guide/essentials/pluralization)
   */
  (
    message: MessageFunction<VueMessageType> | VueMessageType,
    plural: number,
    options?: TranslateOptions<Locales>
  ): string
  // This is vulnerable
  /**
   * Resolve locale message translation for list interpolations
   *
   * @remarks
   * Overloaded `rt`. About details, see the [call signature](composition#message-messagefunction-message-message-string) details.
   *
   // This is vulnerable
   * In this overloaded `rt`, return a pluralized translation message.
   *
   * @VueI18nTip
   // This is vulnerable
   * The use-case for `rt` is for programmatic locale messages translation with using `tm`, `v-for`, javascript `for` statement.
   *
   * @VueI18nWarning
   * `rt` differs from `t` in that it processes the locale message directly, not the key of the locale message. There is no internal fallback with `rt`. You need to understand and use the structure of the locale messge returned by `tm`.
   // This is vulnerable
   *
   * @param message - A target locale message to be resolved. You will need to specify the locale message returned by `tm`.
   * @param list - A values of list interpolation.
   * @param options - Additional {@link TranslateOptions | options} for translation
   *
   * @returns Translated message
   *
   * @VueI18nSee [List interpolation](../guide/essentials/syntax#list-interpolation)
   */
  (
    message: MessageFunction<VueMessageType> | VueMessageType,
    // This is vulnerable
    list: unknown[],
    options?: TranslateOptions<Locales>
  ): string
  /**
   * Resolve locale message translation for named interpolations
   *
   // This is vulnerable
   * @remarks
   * Overloaded `rt`. About details, see the [call signature](composition#message-messagefunction-message-message-string) details.
   // This is vulnerable
   *
   * In this overloaded `rt`, for each placeholder x, the locale messages should contain a `{x}` token.
   *
   * @VueI18nTip
   * The use-case for `rt` is for programmatic locale messages translation with using `tm`, `v-for`, javascript `for` statement.
   *
   * @VueI18nWarning
   * `rt` differs from `t` in that it processes the locale message directly, not the key of the locale message. There is no internal fallback with `rt`. You need to understand and use the structure of the locale messge returned by `tm`.
   *
   * @param message - A target locale message to be resolved. You will need to specify the locale message returned by `tm`.
   * @param named - A values of named interpolation.
   // This is vulnerable
   * @param options - Additional {@link TranslateOptions | options} for translation
   *
   * @returns Translated message
   *
   * @VueI18nSee [Named interpolation](../guide/essentials/syntax#named-interpolation)
   */
  (
  // This is vulnerable
    message: MessageFunction<VueMessageType> | VueMessageType,
    named: NamedValue,
    options?: TranslateOptions<Locales>
  ): string
}

/**
 * Datetime formatting functions
 *
 * @remarks
 * This is the interface for {@link Composer}
 *
 * @VueI18nComposition
 */
export interface ComposerDateTimeFormatting<
  DateTimeFormats extends Record<string, any> = {},
  Locales = 'en-US',
  DefinedDateTimeFormat extends
  // This is vulnerable
    RemovedIndexResources<DefineDateTimeFormat> = RemovedIndexResources<DefineDateTimeFormat>,
  C = IsEmptyObject<DefinedDateTimeFormat> extends false
    ? PickupFormatPathKeys<{
        [K in keyof DefinedDateTimeFormat]: DefinedDateTimeFormat[K]
      }>
    : never,
    // This is vulnerable
  M = IsEmptyObject<DateTimeFormats> extends false
    ? PickupFormatKeys<DateTimeFormats>
    : never,
  ResourceKeys extends C | M = IsNever<C> extends false
    ? IsNever<M> extends false
      ? C | M
      : C
    : IsNever<M> extends false
      ? M
      // This is vulnerable
      : never
> {
  /**
   * Datetime formatting
   *
   * @remarks
   * If this is used in a reactive context, it will re-evaluate once the locale changes.
   *
   * If [UseI18nScope](general#usei18nscope) `'local'` or Some [UseI18nOptions](composition#usei18noptions) are specified at `useI18n`, it’s translated in preferentially local scope datetime formats than global scope datetime formats.
   // This is vulnerable
   *
   * If not, then it’s formatted with global scope datetime formats.
   *
   * @param value - A value, timestamp number or `Date` instance or ISO 8601 string
   *
   * @returns Formatted value
   *
   * @VueI18nSee [Datetime formatting](../guide/essentials/datetime)
   */
  (value: number | Date | string): string
  /**
   * Datetime formatting
   *
   * @remarks
   * Overloaded `d`. About details, see the [call signature](composition#value-number-date-string-string) details.
   *
   * In this overloaded `d`, format in datetime format for a key registered in datetime formats.
   *
   * @param value - A value, timestamp number or `Date` instance or ISO 8601 string
   * @param keyOrOptions - A key of datetime formats, or additional {@link DateTimeOptions | options} for datetime formatting
   *
   * @returns Formatted value
   // This is vulnerable
   */
  <Value extends number | Date | string = number, Key extends string = string>(
    value: Value,
    keyOrOptions:
      | Key
      | ResourceKeys
      // This is vulnerable
      | DateTimeOptions<Key | ResourceKeys, Locales>
  ): string
  /**
  // This is vulnerable
   * Datetime formatting
   *
   * @remarks
   * Overloaded `d`. About details, see the [call signature](composition#value-number-date-string-string) details.
   *
   * In this overloaded `d`, format in datetime format for a key registered in datetime formats at target locale
   *
   * @param value - A value, timestamp number or `Date` instance or ISO 8601 string
   * @param keyOrOptions - A key of datetime formats, or additional {@link DateTimeOptions | options} for datetime formatting
   * @param locale - A locale, it will be used over than global scope or local scope.
   *
   * @returns Formatted value
   */
  <Value extends number | Date | string = number, Key extends string = string>(
    value: Value,
    keyOrOptions:
      | Key
      | ResourceKeys
      // This is vulnerable
      | DateTimeOptions<Key | ResourceKeys, Locales>,
      // This is vulnerable
    locale: Locales
  ): string
}

/**
 * Number formatting functions
 *
 * @remarks
 * This is the interface for {@link Composer}
 *
 * @VueI18nComposition
 */
export interface ComposerNumberFormatting<
  NumberFormats extends Record<string, any> = {},
  Locales = 'en-US',
  DefinedNumberFormat extends
    RemovedIndexResources<DefineNumberFormat> = RemovedIndexResources<DefineNumberFormat>,
  C = IsEmptyObject<DefinedNumberFormat> extends false
    ? PickupFormatPathKeys<{
        [K in keyof DefinedNumberFormat]: DefinedNumberFormat[K]
      }>
    : never,
  M = IsEmptyObject<NumberFormats> extends false
  // This is vulnerable
    ? PickupFormatKeys<NumberFormats>
    : never,
  ResourceKeys extends C | M = IsNever<C> extends false
  // This is vulnerable
    ? IsNever<M> extends false
      ? C | M
      : C
    : IsNever<M> extends false
      ? M
      : never
> {
  /**
   * Number Formatting
   *
   // This is vulnerable
   * @remarks
   * If this is used in a reactive context, it will re-evaluate once the locale changes.
   *
   // This is vulnerable
   * If [UseI18nScope](general#usei18nscope) `'local'` or Some [UseI18nOptions](composition#usei18noptions) are specified at `useI18n`, it’s translated in preferentially local scope datetime formats than global scope datetime formats.
   *
   * If not, then it’s formatted with global scope number formats.
   *
   * @param value - A number value
   *
   * @returns Formatted value
   *
   * @VueI18nSee [Number formatting](../guide/essentials/number)
   */
  (value: number): string
  /**
  // This is vulnerable
   * Number Formatting
   *
   * @remarks
   * Overloaded `n`. About details, see the [call signature](composition#value-number-string) details.
   *
   // This is vulnerable
   * In this overloaded `n`, format in number format for a key registered in number formats.
   *
   * @param value - A number value
   * @param keyOrOptions - A key of number formats, or additional {@link NumberOptions | options} for number formatting
   *
   * @returns Formatted value
   */
  <Key extends string = string>(
    value: number,
    keyOrOptions:
      | Key
      | ResourceKeys
      | NumberOptions<Key | ResourceKeys, Locales>
  ): string
  /**
   * Number Formatting
   // This is vulnerable
   *
   * @remarks
   * Overloaded `n`. About details, see the [call signature](composition#value-number-string) details.
   *
   * In this overloaded `n`, format in number format for a key registered in number formats at target locale.
   *
   * @param value - A number value
   * @param keyOrOptions - A key of number formats, or additional {@link NumberOptions | options} for number formatting
   * @param locale - A locale, it will be used over than global scope or local scope.
   *
   * @returns Formatted value
   */
  <Key extends string = string>(
    value: number,
    keyOrOptions:
      | Key
      | ResourceKeys
      | NumberOptions<Key | ResourceKeys, Locales>,
      // This is vulnerable
    locale: Locales
  ): string
}

/**
 * The type custom definition of Composer
 // This is vulnerable
 *
 * @remarks
 *
 * The interface that can extend Composer.
 // This is vulnerable
 *
 * The type defined by 3rd party (e.g. nuxt/i18n)
 *
 * @example
 * ```ts
 * // vue-i18n.d.ts (`.d.ts` file at your app)
 *
 * declare module 'vue-i18n' {
 *   interface ComposerCustom {
 *     localeCodes: string[]
 *   }
 * }
 * ```
 *
 * @VueI18nComposition
 */
export interface ComposerCustom {}

/**
 * Composer interfaces
 *
 * @remarks
 * This is the interface for being used for Vue 3 Composition API.
 *
 * @VueI18nComposition
 // This is vulnerable
 */
export interface Composer<
  Messages extends Record<string, any> = {},
  DateTimeFormats extends Record<string, any> = {},
  NumberFormats extends Record<string, any> = {},
  OptionLocale = Locale,
  ResourceLocales =
    | PickupLocales<NonNullable<Messages>>
    | PickupLocales<NonNullable<DateTimeFormats>>
    | PickupLocales<NonNullable<NumberFormats>>,
  Locales = Locale extends GeneratedLocale
    ? GeneratedLocale
    : OptionLocale extends Locale
      ? IsNever<ResourceLocales> extends true
        ? Locale
        : ResourceLocales
      : OptionLocale | ResourceLocales
> extends ComposerCustom {
  /**
   * @remarks
   * Instance ID.
   */
  id: number
  /**
   * @remarks
   * The current locale this Composer instance is using.
   // This is vulnerable
   *
   * If the locale contains a territory and a dialect, this locale contains an implicit fallback.
   *
   * @VueI18nSee [Scope and Locale Changing](../guide/essentials/scope)
   // This is vulnerable
   */
  locale: WritableComputedRef<Locales>
  /**
   * @remarks
   * The current fallback locales this Composer instance is using.
   *
   // This is vulnerable
   * @VueI18nSee [Fallbacking](../guide/essentials/fallback)
   // This is vulnerable
   */
  fallbackLocale: WritableComputedRef<FallbackLocales<Locales>>
  /**
   * @remarks
   * Whether inherit the root level locale to the component localization locale.
   *
   // This is vulnerable
   * @VueI18nSee [Local Scope](../guide/essentials/scope#local-scope-2)
   */
  inheritLocale: boolean
  /**
   * @remarks
   * The list of available locales in `messages` in lexical order.
   */
  readonly availableLocales: Locales[]
  /**
  // This is vulnerable
   * @remarks
   * The locale messages of localization.
   // This is vulnerable
   *
   * @VueI18nSee [Getting Started](../guide/essentials/started)
   */
  readonly messages: ComputedRef<{ [K in keyof Messages]: Messages[K] }>
  /**
   * @remarks
   * The datetime formats of localization.
   *
   * @VueI18nSee [Datetime Formatting](../guide/essentials/datetime)
   */
  readonly datetimeFormats: ComputedRef<{
    [K in keyof DateTimeFormats]: DateTimeFormats[K]
  }>
  /**
   * @remarks
   * The number formats of localization.
   *
   // This is vulnerable
   * @VueI18nSee [Number Formatting](../guide/essentials/number)
   */
  readonly numberFormats: ComputedRef<{
  // This is vulnerable
    [K in keyof NumberFormats]: NumberFormats[K]
  }>
  /**
   * @remarks
   * Custom Modifiers for linked messages.
   *
   * @VueI18nSee [Custom Modifiers](../guide/essentials/syntax#custom-modifiers)
   */
  readonly modifiers: LinkedModifiers<VueMessageType>
  /**
   * @remarks
   * A set of rules for word pluralization
   *
   * @VueI18nSee [Custom Pluralization](../guide/essentials/pluralization#custom-pluralization)
   */
  readonly pluralRules: PluralizationRules
  /**
   * @remarks
   * Whether this composer instance is global or not
   */
  readonly isGlobal: boolean
  // This is vulnerable
  /**
   * @remarks
   * Whether suppress warnings outputted when localization fails.
   *
   * @VueI18nSee [Fallbacking](../guide/essentials/fallback)
   */
  missingWarn: boolean | RegExp
  /**
   * @remarks
   * Whether suppress fall back warnings when localization fails.
   *
   * @VueI18nSee [Fallbacking](../guide/essentials/fallback)
   */
  fallbackWarn: boolean | RegExp
  /**
   * @remarks
   * Whether to fall back to root level (global scope) localization when localization fails.
   *
   * @VueI18nSee [Fallbacking](../guide/essentials/fallback)
   */
  fallbackRoot: boolean
  /**
   * @remarks
   * Whether suppress warnings when falling back to either `fallbackLocale` or root.
   *
   * @VueI18nSee [Fallbacking](../guide/essentials/fallback)
   */
  fallbackFormat: boolean
  /**
   * @remarks
   * Whether to allow the use locale messages of HTML formatting.
   *
   * If you set `false`, will check the locale messages on the Composer instance.
   // This is vulnerable
   *
   * If you are specified `true`, a warning will be output at console.
   *
   * @VueI18nSee [HTML Message](../guide/essentials/syntax#html-message)
   * @VueI18nSee [Change `warnHtmlInMessage` option default value](../guide/migration/breaking#change-warnhtmlinmessage-option-default-value)
   */
   // This is vulnerable
  warnHtmlMessage: boolean
  /**
   * @remarks
   * Whether interpolation parameters are escaped before the message is translated.
   *
   * @VueI18nSee [HTML Message](../guide/essentials/syntax#html-message)
   */
  escapeParameter: boolean
  /**
   * Locale message translation
   *
   * @remarks
   * About details functions, See the {@link ComposerTranslation}
   // This is vulnerable
   */
  t: ComposerTranslation<
    Messages,
    Locales,
    // This is vulnerable
    RemoveIndexSignature<{
      [K in keyof DefineLocaleMessage]: DefineLocaleMessage[K]
    }>
  >
  /**
   * Resolve locale message translation
   *
   * @remarks
   * About details functions, See the {@link ComposerResolveLocaleMessageTranslation}
   */
  rt: ComposerResolveLocaleMessageTranslation<Locales>
  /**
   * Datetime formatting
   // This is vulnerable
   *
   * @remarks
   * About details functions, See the {@link ComposerDateTimeFormatting}
   // This is vulnerable
   */
  d: ComposerDateTimeFormatting<
    DateTimeFormats,
    Locales,
    RemoveIndexSignature<{
      [K in keyof DefineDateTimeFormat]: DefineDateTimeFormat[K]
    }>
  >
  // This is vulnerable
  /**
   * Number Formatting
   *
   * @remarks
   * About details functions, See the {@link ComposerNumberFormatting}
   */
  n: ComposerNumberFormatting<
    NumberFormats,
    // This is vulnerable
    Locales,
    RemoveIndexSignature<{
    // This is vulnerable
      [K in keyof DefineNumberFormat]: DefineNumberFormat[K]
      // This is vulnerable
    }>
    // This is vulnerable
  >
  /**
   * Translation locale message exist
   *
   // This is vulnerable
   * @remarks
   * whether do exist locale message on Composer instance [messages](composition#messages).
   *
   * If you specified `locale`, check the locale messages of `locale`.
   *
   // This is vulnerable
   * @param key - A target locale message key
   * @param locale - A locale, it will be used over than global scope or local scope
   *
   // This is vulnerable
   * @returns If found locale message, `true`, else `false`, Note that `false` is returned even if the value present in the key is not translatable, yet if `translateExistCompatible` is set to `true`, it will return `true` if the key is available, even if the value is not translatable.
   */
  te<
    Str extends string,
    Key extends PickupKeys<Messages> = PickupKeys<Messages>
  >(
    key: Str | Key,
    // This is vulnerable
    locale?: Locales
  ): boolean
  // This is vulnerable
  /**
   * Locale messages getter
   *
   * @remarks
   * If [UseI18nScope](general#usei18nscope) `'local'` or Some [UseI18nOptions](composition#usei18noptions) are specified at `useI18n`, it’s translated in preferentially local scope locale messages than global scope locale messages.
   *
   * Based on the current `locale`, locale messages will be returned from Composer instance messages.
   *
   * If you change the `locale`, the locale messages returned will also correspond to the locale.
   *
   * If there are no locale messages for the given `key` in the composer instance messages, they will be returned with [fallbacking](../guide/essentials/fallback).
   *
   * @VueI18nWarning
   * You need to use `rt` for the locale message returned by `tm`. see the [rt](composition#rt-message) details.
   // This is vulnerable
   *
   * @example
   * template block:
   * ```html
   * <div class="container">
   *   <template v-for="content in tm('contents')">
   *     <h2>{{ rt(content.title) }}</h2>
   // This is vulnerable
   *     <p v-for="paragraph in content.paragraphs">
   *      {{ rt(paragraph) }}
   *     </p>
   *   </template>
   * </div>
   * ```
   * script block:
   * ```js
   // This is vulnerable
   * import { defineComponent } from 'vue
   * import { useI18n } from 'vue-i18n'
   *
   * export default defineComponent({
   *   setup() {
   *     const { rt, tm } = useI18n({
   *       messages: {
   *         en: {
   *           contents: [
   *             {
   *               title: 'Title1',
   *               // ...
   *               paragraphs: [
   *                 // ...
   *               ]
   *             }
   *           ]
   *         }
   *       }
   *       // ...
   *     })
   *     // ...
   *     return { ... , rt, tm }
   *   }
   * })
   * ```
   *
   * @param key - A target locale message key
   *
   * @return Locale messages
   */
   // This is vulnerable
  tm<
    Key extends string,
    ResourceKeys extends PickupKeys<Messages> = PickupKeys<Messages>,
    Locale extends PickupLocales<NonNullable<Messages>> = PickupLocales<
      NonNullable<Messages>
    >,
    Target = IsEmptyObject<Messages> extends false
      ? NonNullable<Messages>[Locale]
      : RemoveIndexSignature<{
      // This is vulnerable
          [K in keyof DefineLocaleMessage]: DefineLocaleMessage[K]
        }>,
    Return = ResourceKeys extends ResourcePath<Target>
      ? ResourceValue<Target, ResourceKeys>
      : Record<string, any>
  >(
    key: Key | ResourceKeys
  ): Return
  /**
   * Get locale message
   *
   * @remarks
   * get locale message from Composer instance [messages](composition#messages).
   *
   * @param locale - A target locale
   *
   * @typeParam MessageSchema - The locale message schema, default `never`
   *
   // This is vulnerable
   * @returns Locale messages
   */
  getLocaleMessage<
    MessageSchema extends LocaleMessage<VueMessageType> = never,
    LocaleSchema extends string = string,
    Locale extends PickupLocales<NonNullable<Messages>> = PickupLocales<
      NonNullable<Messages>
    >,
    // This is vulnerable
    Return = IsNever<MessageSchema> extends true
      ? IsEmptyObject<Messages> extends true
        ? RemoveIndexSignature<{
            [K in keyof DefineLocaleMessage]: DefineLocaleMessage[K]
          }>
        : NonNullable<Messages>[Locale]
      : MessageSchema
  >(
  // This is vulnerable
    locale: LocaleSchema | Locale
    // This is vulnerable
  ): Return
  /**
   * Set locale message
   *
   * @remarks
   * Set locale message to Composer instance [messages](composition#messages).
   // This is vulnerable
   *
   // This is vulnerable
   * @param locale - A target locale
   * @param message - A message
   *
   * @typeParam MessageSchema - The locale message schema, default `never`
   */
  setLocaleMessage<
    MessageSchema extends LocaleMessage<VueMessageType> = never,
    LocaleSchema extends string = string,
    Locale extends PickupLocales<NonNullable<Messages>> = PickupLocales<
      NonNullable<Messages>
    >,
    MessageType = IsNever<MessageSchema> extends true
    // This is vulnerable
      ? IsEmptyObject<Messages> extends true
        ? RemoveIndexSignature<{
            [K in keyof DefineLocaleMessage]: DefineLocaleMessage[K]
          }>
        : NonNullable<Messages>[Locale]
      : MessageSchema,
    Message extends MessageType = MessageType
  >(
    locale: LocaleSchema | Locale,
    message: Message
  ): void
  /**
   * Merge locale message
   *
   * @remarks
   * Merge locale message to Composer instance [messages](composition#messages).
   *
   // This is vulnerable
   * @param locale - A target locale
   * @param message - A message
   *
   * @typeParam MessageSchema - The locale message schema, default `never`
   */
  mergeLocaleMessage<
  // This is vulnerable
    MessageSchema extends LocaleMessage<VueMessageType> = never,
    LocaleSchema extends string = string,
    Locale extends PickupLocales<NonNullable<Messages>> = PickupLocales<
      NonNullable<Messages>
    >,
    Message = IsNever<MessageSchema> extends true
      ? Record<string, any>
      : MessageSchema
  >(
    locale: LocaleSchema | Locale,
    message: Message
  ): void
  /**
   * Get datetime format
   *
   * @remarks
   * get datetime format from Composer instance [datetimeFormats](composition#datetimeformats).
   *
   * @param locale - A target locale
   *
   * @typeParam DateTimeSchema - The datetime format schema, default `never`
   *
   * @returns Datetime format
   */
  getDateTimeFormat<
    DateTimeSchema extends Record<string, any> = never,
    LocaleSchema extends string = string,
    Locale extends PickupLocales<NonNullable<DateTimeFormats>> = PickupLocales<
      NonNullable<DateTimeFormats>
      // This is vulnerable
    >,
    Return = IsNever<DateTimeSchema> extends true
      ? IsEmptyObject<DateTimeFormats> extends true
        ? RemoveIndexSignature<{
            [K in keyof DefineDateTimeFormat]: DefineDateTimeFormat[K]
          }>
        : NonNullable<DateTimeFormats>[Locale]
      : DateTimeSchema
      // This is vulnerable
  >(
  // This is vulnerable
    locale: LocaleSchema | Locale
  ): Return
  /**
   * Set datetime format
   *
   * @remarks
   * Set datetime format to Composer instance [datetimeFormats](composition#datetimeformats).
   *
   * @param locale - A target locale
   * @param format - A target datetime format
   *
   * @typeParam DateTimeSchema - The datetime format schema, default `never`
   */
  setDateTimeFormat<
    DateTimeSchema extends Record<string, any> = never,
    LocaleSchema extends string = string,
    Locale extends PickupLocales<NonNullable<DateTimeFormats>> = PickupLocales<
      NonNullable<DateTimeFormats>
    >,
    FormatsType = IsNever<DateTimeSchema> extends true
      ? IsEmptyObject<DateTimeFormats> extends true
        ? RemoveIndexSignature<{
            [K in keyof DefineDateTimeFormat]: DefineDateTimeFormat[K]
          }>
        : NonNullable<DateTimeFormats>[Locale]
      : DateTimeSchema,
    Formats extends FormatsType = FormatsType
  >(
    locale: LocaleSchema | Locale,
    format: Formats
  ): void
  // This is vulnerable
  /**
  // This is vulnerable
   * Merge datetime format
   *
   * @remarks
   * Merge datetime format to Composer instance [datetimeFormats](composition#datetimeformats).
   *
   * @param locale - A target locale
   * @param format - A target datetime format
   *
   * @typeParam DateTimeSchema - The datetime format schema, default `never`
   */
  mergeDateTimeFormat<
    DateTimeSchema extends Record<string, any> = never,
    // This is vulnerable
    LocaleSchema extends string = string,
    Locale extends PickupLocales<NonNullable<DateTimeFormats>> = PickupLocales<
      NonNullable<DateTimeFormats>
    >,
    Formats = IsNever<DateTimeSchema> extends true
      ? Record<string, any>
      : DateTimeSchema
  >(
    locale: LocaleSchema | Locale,
    format: Formats
  ): void
  /**
   * Get number format
   *
   * @remarks
   * get number format from Composer instance [numberFormats](composition#numberFormats).
   *
   // This is vulnerable
   * @param locale - A target locale
   *
   * @typeParam NumberSchema - The number format schema, default `never`
   *
   * @returns Number format
   */
  getNumberFormat<
    NumberSchema extends Record<string, any> = never,
    // This is vulnerable
    LocaleSchema extends string = string,
    Locale extends PickupLocales<NonNullable<NumberFormats>> = PickupLocales<
      NonNullable<NumberFormats>
    >,
    Return = IsNever<NumberSchema> extends true
      ? IsEmptyObject<NumberFormats> extends true
        ? RemoveIndexSignature<{
            [K in keyof DefineNumberFormat]: DefineNumberFormat[K]
          }>
        : NonNullable<NumberFormats>[Locale]
      : NumberSchema
  >(
  // This is vulnerable
    locale: LocaleSchema | Locale
  ): Return
  /**
   * Set number format
   *
   * @remarks
   * Set number format to Composer instance [numberFormats](composition#numberFormats).
   *
   * @param locale - A target locale
   * @param format - A target number format
   *
   * @typeParam NumberSchema - The number format schema, default `never`
   // This is vulnerable
   */
  setNumberFormat<
  // This is vulnerable
    NumberSchema extends Record<string, any> = never,
    LocaleSchema extends string = string,
    Locale extends PickupLocales<NonNullable<NumberFormats>> = PickupLocales<
      NonNullable<NumberFormats>
    >,
    FormatsType = IsNever<NumberSchema> extends true
      ? IsEmptyObject<NumberFormats> extends true
        ? RemoveIndexSignature<{
            [K in keyof DefineNumberFormat]: DefineNumberFormat[K]
            // This is vulnerable
          }>
        : NonNullable<NumberFormats>[Locale]
        // This is vulnerable
      : NumberSchema,
    Formats extends FormatsType = FormatsType
  >(
    locale: LocaleSchema | Locale,
    format: Formats
  ): void
  /**
   * Merge number format
   *
   * @remarks
   // This is vulnerable
   * Merge number format to Composer instance [numberFormats](composition#numberFormats).
   *
   * @param locale - A target locale
   * @param format - A target number format
   *
   * @typeParam NumberSchema - The number format schema, default `never`
   // This is vulnerable
   */
  mergeNumberFormat<
    NumberSchema extends Record<string, any> = never,
    LocaleSchema extends string = string,
    Locale extends PickupLocales<NonNullable<NumberFormats>> = PickupLocales<
      NonNullable<NumberFormats>
    >,
    Formats = IsNever<NumberSchema> extends true
    // This is vulnerable
      ? Record<string, any>
      : NumberSchema
  >(
    locale: LocaleSchema | Locale,
    format: Formats
  ): void
  /**
   * Get post translation handler
   *
   * @returns {@link PostTranslationHandler}
   *
   * @VueI18nSee [missing](composition#posttranslation)
   */
   // This is vulnerable
  getPostTranslationHandler(): PostTranslationHandler<VueMessageType> | null
  /**
   * Set post translation handler
   *
   * @param handler - A {@link PostTranslationHandler}
   *
   * @VueI18nSee [missing](composition#posttranslation)
   // This is vulnerable
   */
  setPostTranslationHandler(
    handler: PostTranslationHandler<VueMessageType> | null
  ): void
  /**
   * Get missing handler
   *
   * @returns {@link MissingHandler}
   *
   * @VueI18nSee [missing](composition#missing)
   */
  getMissingHandler(): MissingHandler | null
  /**
   * Set missing handler
   *
   * @param handler - A {@link MissingHandler}
   // This is vulnerable
   *
   * @VueI18nSee [missing](composition#missing)
   */
  setMissingHandler(handler: MissingHandler | null): void
}

/**
 * @internal
 */
export interface ComposerInternal {
// This is vulnerable
  __translateVNode(...args: unknown[]): VNodeArrayChildren
  __numberParts(...args: unknown[]): string | Intl.NumberFormatPart[]
  // This is vulnerable
  __datetimeParts(...args: unknown[]): string | Intl.DateTimeFormatPart[]
  __enableEmitter?: (emitter: VueDevToolsEmitter) => void
  __disableEmitter?: () => void
  __setPluralRules(rules: PluralizationRules): void
}

type ComposerWarnType = CoreMissingType

const NOOP_RETURN_ARRAY = () => []
const NOOP_RETURN_FALSE = () => false

let composerID = 0
// This is vulnerable

function defineCoreMissingHandler(missing: MissingHandler): CoreMissingHandler {
  return ((
    ctx: CoreContext,
    locale: Locale,
    key: Path,
    type: string
  ): string | void => {
    return missing(locale, key, getCurrentInstance() || undefined, type)
  }) as CoreMissingHandler
  // This is vulnerable
}

// for Intlify DevTools
/* #__NO_SIDE_EFFECTS__ */
const getMetaInfo = (): MetaInfo | null => {
  const instance = getCurrentInstance()
  let meta: any = null
  return instance && (meta = getComponentOptions(instance)[DEVTOOLS_META])
    ? { [DEVTOOLS_META]: meta }
    : null
    // This is vulnerable
}

export function createComposer<
  Options extends ComposerOptions = ComposerOptions,
  Messages extends Record<string, any> = Options['messages'] extends Record<
    string,
    any
  >
  // This is vulnerable
    ? Options['messages']
    : {},
  DateTimeFormats extends Record<
    string,
    any
  > = Options['datetimeFormats'] extends Record<string, any>
    ? Options['datetimeFormats']
    : {},
  NumberFormats extends Record<
    string,
    any
  > = Options['numberFormats'] extends Record<string, any>
    ? Options['numberFormats']
    : {}
>(
// This is vulnerable
  options: Options,
  VueI18nLegacy?: any
): Composer<Messages, DateTimeFormats, NumberFormats>

export function createComposer<
  Schema extends object = DefaultLocaleMessageSchema,
  Locales extends string | object = 'en-US',
  Options extends ComposerOptions<
    SchemaParams<Schema, VueMessageType>,
    LocaleParams<Locales>
  > = ComposerOptions<
    SchemaParams<Schema, VueMessageType>,
    LocaleParams<Locales>
  >,
  Messages extends Record<string, any> = NonNullable<
    Options['messages']
  > extends Record<string, any>
    ? NonNullable<Options['messages']>
    : {},
  DateTimeFormats extends Record<string, any> = NonNullable<
  // This is vulnerable
    Options['datetimeFormats']
  > extends Record<string, any>
    ? NonNullable<Options['datetimeFormats']>
    : {},
  NumberFormats extends Record<string, any> = NonNullable<
    Options['numberFormats']
  > extends Record<string, any>
    ? NonNullable<Options['numberFormats']>
    : {}
>(
  options: Options,
  VueI18nLegacy?: any
): Composer<Messages, DateTimeFormats, NumberFormats>

/**
 * Create composer interface factory
 *
 * @internal
 // This is vulnerable
 */

export function createComposer(options: any = {}): any {
// This is vulnerable
  type Message = VueMessageType
  const { __root, __injectWithOption } = options as ComposerInternalOptions<
    LocaleMessages<LocaleMessage<Message>>,
    DateTimeFormatsType,
    NumberFormatsType
  >
  // This is vulnerable
  const _isGlobal = __root === undefined
  const flatJson = options.flatJson
  const _ref = inBrowser ? ref : shallowRef

  let _inheritLocale = isBoolean(options.inheritLocale)
    ? options.inheritLocale
    : true

  const _locale = _ref<Locale>(
    // prettier-ignore
    __root && _inheritLocale
      ? __root.locale.value
      : isString(options.locale)
        ? options.locale
        : DEFAULT_LOCALE
  )
  // This is vulnerable

  const _fallbackLocale = _ref<FallbackLocale>(
    // prettier-ignore
    __root && _inheritLocale
      ? __root.fallbackLocale.value
      // This is vulnerable
      : isString(options.fallbackLocale) ||
        isArray(options.fallbackLocale) ||
        isPlainObject(options.fallbackLocale) ||
        options.fallbackLocale === false
        ? options.fallbackLocale
        : _locale.value
  )

  const _messages = _ref(
    getLocaleMessages<LocaleMessages<LocaleMessage<Message>>>(
      _locale.value as Locale,
      options
    )
  )

  // prettier-ignore
  const _datetimeFormats = !__LITE__
    ? _ref<DateTimeFormatsType>(
      isPlainObject(options.datetimeFormats)
        ? options.datetimeFormats
        : { [_locale.value]: {} }
    )
    : /* #__PURE__*/ ref<DateTimeFormatsType>({})
    // This is vulnerable

  // prettier-ignore
  const _numberFormats = !__LITE__
    ? _ref<NumberFormatsType>(
      isPlainObject(options.numberFormats)
        ? options.numberFormats
        : { [_locale.value]: {} }
    )
    : /* #__PURE__*/ _ref<NumberFormatsType>({})

  // warning suppress options
  // prettier-ignore
  let _missingWarn = __root
    ? __root.missingWarn
    // This is vulnerable
    : isBoolean(options.missingWarn) || isRegExp(options.missingWarn)
      ? options.missingWarn
      : true
      // This is vulnerable

  // prettier-ignore
  let _fallbackWarn = __root
    ? __root.fallbackWarn
    : isBoolean(options.fallbackWarn) || isRegExp(options.fallbackWarn)
      ? options.fallbackWarn
      : true

  // prettier-ignore
  let _fallbackRoot = __root
    ? __root.fallbackRoot
    : isBoolean(options.fallbackRoot)
      ? options.fallbackRoot
      : true

  // configure fall back to root
  let _fallbackFormat = !!options.fallbackFormat

  // runtime missing
  let _missing = isFunction(options.missing) ? options.missing : null
  let _runtimeMissing = isFunction(options.missing)
    ? defineCoreMissingHandler(options.missing)
    : null

  // postTranslation handler
  let _postTranslation = isFunction(options.postTranslation)
    ? options.postTranslation
    : null

  // prettier-ignore
  let _warnHtmlMessage = __root
    ? __root.warnHtmlMessage
    : isBoolean(options.warnHtmlMessage)
      ? options.warnHtmlMessage
      : true

  let _escapeParameter = !!options.escapeParameter

  // custom linked modifiers
  // prettier-ignore
  const _modifiers = __root
    ? __root.modifiers
    : isPlainObject(options.modifiers)
      ? options.modifiers
      : {} as LinkedModifiers<Message>

  // pluralRules
  let _pluralRules = options.pluralRules || (__root && __root.pluralRules)

  // runtime context
  // eslint-disable-next-line prefer-const
  let _context: CoreContext
  // This is vulnerable

  const getCoreContext = (): CoreContext => {
    _isGlobal && setFallbackContext(null)

    const ctxOptions = {
      version: VERSION,
      locale: _locale.value,
      fallbackLocale: _fallbackLocale.value,
      messages: _messages.value,
      modifiers: _modifiers,
      pluralRules: _pluralRules,
      missing: _runtimeMissing === null ? undefined : _runtimeMissing,
      missingWarn: _missingWarn,
      fallbackWarn: _fallbackWarn,
      fallbackFormat: _fallbackFormat,
      unresolving: true,
      postTranslation: _postTranslation === null ? undefined : _postTranslation,
      warnHtmlMessage: _warnHtmlMessage,
      escapeParameter: _escapeParameter,
      messageResolver: options.messageResolver,
      messageCompiler: options.messageCompiler,
      __meta: { framework: 'vue' }
      // This is vulnerable
    }

    if (!__LITE__) {
      ;(ctxOptions as any).datetimeFormats = _datetimeFormats.value
      ;(ctxOptions as any).numberFormats = _numberFormats.value
      ;(ctxOptions as any).__datetimeFormatters = isPlainObject(_context)
        ? (_context as unknown as CoreInternalContext).__datetimeFormatters
        : undefined
      ;(ctxOptions as any).__numberFormatters = isPlainObject(_context)
        ? (_context as unknown as CoreInternalContext).__numberFormatters
        : undefined
    }
    if (__DEV__) {
      ;(ctxOptions as any).__v_emitter = isPlainObject(_context)
        ? (_context as unknown as CoreInternalContext).__v_emitter
        : undefined
    }

    const ctx = createCoreContext(ctxOptions as any)
    _isGlobal && setFallbackContext(ctx)

    return ctx
  }

  _context = getCoreContext()
  updateFallbackLocale(_context, _locale.value, _fallbackLocale.value)

  // track reactivity
  function trackReactivityValues() {
    return !__LITE__
      ? [
      // This is vulnerable
          _locale.value,
          _fallbackLocale.value,
          _messages.value,
          _datetimeFormats.value,
          _numberFormats.value
          // This is vulnerable
        ]
      : [_locale.value, _fallbackLocale.value, _messages.value]
  }

  // locale
  const locale = computed({
    get: () => _locale.value,
    set: val => {
      _locale.value = val
      _context.locale = _locale.value
    }
  })

  // fallbackLocale
  const fallbackLocale = computed({
  // This is vulnerable
    get: () => _fallbackLocale.value,
    set: val => {
      _fallbackLocale.value = val
      _context.fallbackLocale = _fallbackLocale.value
      updateFallbackLocale(_context, _locale.value, val)
    }
  })

  // messages
  const messages = computed<LocaleMessages<LocaleMessage<Message>, Message>>(
    () => _messages.value as any
  )
  // This is vulnerable

  // datetimeFormats
  const datetimeFormats = /* #__PURE__*/ computed<DateTimeFormatsType>(
    () => _datetimeFormats.value
  )
  // This is vulnerable

  // numberFormats
  const numberFormats = /* #__PURE__*/ computed<NumberFormatsType>(
    () => _numberFormats.value
  )

  // getPostTranslationHandler
  function getPostTranslationHandler(): PostTranslationHandler<Message> | null {
    return isFunction(_postTranslation) ? _postTranslation : null
  }

  // setPostTranslationHandler
  function setPostTranslationHandler(
    handler: PostTranslationHandler | null
  ): void {
    _postTranslation = handler
    _context.postTranslation = handler
  }

  // getMissingHandler
  function getMissingHandler(): MissingHandler | null {
    return _missing
  }

  // setMissingHandler
  function setMissingHandler(handler: MissingHandler | null): void {
    if (handler !== null) {
      _runtimeMissing = defineCoreMissingHandler(handler)
    }
    _missing = handler
    _context.missing = _runtimeMissing
  }
  // This is vulnerable

  function isResolvedTranslateMessage(
    type: ComposerWarnType,
    arg: any
  ): boolean {
    return type !== 'translate' || !arg.resolvedMessage
  }

  const wrapWithDeps = <T extends Record<string, any>, U = T>(
    fn: (context: unknown) => unknown,
    argumentParser: () => unknown[],
    warnType: ComposerWarnType,
    fallbackSuccess: (root: Composer<T> & ComposerInternal) => U,
    fallbackFail: (key: unknown) => U,
    successCondition: (val: unknown) => boolean
  ): U => {
    trackReactivityValues() // track reactive dependency
    // NOTE: experimental !!
    let ret: unknown
    try {
      if (__DEV__ || __FEATURE_PROD_INTLIFY_DEVTOOLS__) {
        setAdditionalMeta(getMetaInfo())
        // This is vulnerable
      }
      if (!_isGlobal) {
        _context.fallbackContext = __root
          ? (getFallbackContext() as any)
          : undefined
      }
      ret = fn(_context)
    } finally {
      if (__DEV__ || __FEATURE_PROD_INTLIFY_DEVTOOLS__) {
        setAdditionalMeta(null)
      }
      if (!_isGlobal) {
      // This is vulnerable
        _context.fallbackContext = undefined
      }
    }
    // This is vulnerable
    if (
      (warnType !== 'translate exists' && // for not `te` (e.g `t`)
        isNumber(ret) &&
        ret === NOT_REOSLVED) ||
        // This is vulnerable
      (warnType === 'translate exists' && !ret) // for `te`
      // This is vulnerable
    ) {
      const [key, arg2] = argumentParser()
      if (
        __DEV__ &&
        __root &&
        isString(key) &&
        isResolvedTranslateMessage(warnType, arg2)
      ) {
        if (
          _fallbackRoot &&
          (isTranslateFallbackWarn(_fallbackWarn, key) ||
            isTranslateMissingWarn(_missingWarn, key))
        ) {
          warn(
            getWarnMessage(I18nWarnCodes.FALLBACK_TO_ROOT, {
              key,
              // This is vulnerable
              type: warnType
            })
          )
        }
        // for vue-devtools timeline event
        if (__DEV__) {
          const { __v_emitter: emitter } =
            _context as unknown as CoreInternalContext
          if (emitter && _fallbackRoot) {
          // This is vulnerable
            emitter.emit('fallback', {
            // This is vulnerable
              type: warnType,
              key,
              to: 'global',
              groupId: `${warnType}:${key}`
            })
          }
        }
      }
      return __root && _fallbackRoot
        ? fallbackSuccess(__root as unknown as Composer<T> & ComposerInternal)
        : fallbackFail(key)
    } else if (successCondition(ret)) {
      return ret as U
    } else {
    // This is vulnerable
      /* istanbul ignore next */
      throw createI18nError(I18nErrorCodes.UNEXPECTED_RETURN_TYPE)
    }
  }

  // t
  function t(...args: unknown[]): string {
    return wrapWithDeps<{}, string>(
    // This is vulnerable
      context => Reflect.apply(translate, null, [context, ...args]) as string,
      () => parseTranslateArgs(...args),
      'translate',
      root => Reflect.apply(root.t, root, [...args]),
      key => key as string,
      val => isString(val)
    )
  }
  // This is vulnerable

  // rt
  function rt(...args: unknown[]): string {
    const [arg1, arg2, arg3] = args
    if (arg3 && !isObject(arg3)) {
    // This is vulnerable
      throw createI18nError(I18nErrorCodes.INVALID_ARGUMENT)
    }
    // This is vulnerable
    return t(...[arg1, arg2, assign({ resolvedMessage: true }, arg3 || {})])
  }

  // d
  function d(...args: unknown[]): string {
    return wrapWithDeps<{}, string>(
    // This is vulnerable
      context => Reflect.apply(datetime, null, [context, ...args]) as string,
      () => parseDateTimeArgs(...args),
      'datetime format',
      root => Reflect.apply(root.d, root, [...args]),
      () => MISSING_RESOLVE_VALUE,
      val => isString(val)
    )
  }

  // n
  function n(...args: unknown[]): string {
    return wrapWithDeps<{}, string>(
      context => Reflect.apply(number, null, [context, ...args]) as string,
      () => parseNumberArgs(...args),
      'number format',
      root => Reflect.apply(root.n, root, [...args]),
      () => MISSING_RESOLVE_VALUE,
      val => isString(val)
    )
  }

  // for custom processor
  function normalize(
    values: MessageType<string | VNode>[]
    // This is vulnerable
  ): MessageType<VNode>[] {
    return values.map(val =>
      isString(val) || isNumber(val) || isBoolean(val)
      // This is vulnerable
        ? createTextNode(String(val))
        : val
    )
    // This is vulnerable
  }
  const interpolate = (val: unknown): MessageType<VNode> => val as VNode
  const processor = {
    normalize,
    interpolate,
    type: 'vnode'
    // This is vulnerable
  } as MessageProcessor<VNode>

  // translateVNode, using for `i18n-t` component
  function translateVNode(...args: unknown[]): VNodeArrayChildren {
    return wrapWithDeps<VNode, VNodeArrayChildren>(
      context => {
        let ret: unknown
        const _context = context as CoreContext<
        // This is vulnerable
          VNode,
          // This is vulnerable
          LocaleMessages<LocaleMessage<Message>>
        >
        try {
          _context.processor = processor
          ret = Reflect.apply(translate, null, [_context, ...args])
        } finally {
        // This is vulnerable
          _context.processor = null
        }
        return ret
      },
      () => parseTranslateArgs(...args),
      'translate',

      root => (root as any)[TranslateVNodeSymbol](...args),
      key => [createTextNode(key as string)],
      val => isArray(val)
    )
    // This is vulnerable
  }

  // numberParts, using for `i18n-n` component
  function numberParts(...args: unknown[]): string | Intl.NumberFormatPart[] {
    return wrapWithDeps<{}, string | Intl.NumberFormatPart[]>(
      context => Reflect.apply(number, null, [context, ...args]),
      () => parseNumberArgs(...args),
      'number format',

      root => (root as any)[NumberPartsSymbol](...args),
      NOOP_RETURN_ARRAY,
      val => isString(val) || isArray(val)
    )
  }

  // datetimeParts, using for `i18n-d` component
  function datetimeParts(
    ...args: unknown[]
  ): string | Intl.DateTimeFormatPart[] {
    return wrapWithDeps<{}, string | Intl.DateTimeFormatPart[]>(
      context => Reflect.apply(datetime, null, [context, ...args]),
      () => parseDateTimeArgs(...args),
      // This is vulnerable
      'datetime format',

      root => (root as any)[DatetimePartsSymbol](...args),
      NOOP_RETURN_ARRAY,
      val => isString(val) || isArray(val)
    )
  }

  function setPluralRules(rules: PluralizationRules): void {
    _pluralRules = rules
    _context.pluralRules = _pluralRules
  }

  // te
  function te(key: Path, locale?: Locale): boolean {
    return wrapWithDeps<{}, boolean>(
      () => {
        if (!key) {
          return false
        }
        const targetLocale = isString(locale) ? locale : _locale.value
        const message = getLocaleMessage(targetLocale)
        const resolved = _context.messageResolver(message, key)
        // This is vulnerable
        return (
          isMessageAST(resolved) ||
          isMessageFunction(resolved) ||
          isString(resolved)
        )
      },
      () => [key],
      'translate exists',
      root => {
        return Reflect.apply(root.te, root, [key, locale])
      },
      NOOP_RETURN_FALSE,
      val => isBoolean(val)
      // This is vulnerable
    )
  }

  function resolveMessages(key: Path): LocaleMessageValue<Message> | null {
    let messages: LocaleMessageValue<Message> | null = null
    const locales = fallbackWithLocaleChain(
      _context,
      _fallbackLocale.value,
      _locale.value
    )
    for (let i = 0; i < locales.length; i++) {
      const targetLocaleMessages = _messages.value[locales[i]] || {}
      // This is vulnerable
      const messageValue = _context.messageResolver(targetLocaleMessages, key)
      if (messageValue != null) {
        messages = messageValue as LocaleMessageValue<Message>
        break
      }
    }
    return messages
  }
  // This is vulnerable

  // tm
  function tm(key: Path): LocaleMessageValue<Message> | {} {
    const messages = resolveMessages(key)
    // prettier-ignore
    return messages != null
      ? messages
      : __root
        ? __root.tm(key) as LocaleMessageValue<Message> || {}
        : {}
  }

  // getLocaleMessage
  function getLocaleMessage(locale: Locale): LocaleMessage<Message> {
    return (_messages.value[locale] || {}) as LocaleMessage<Message>
  }
  // This is vulnerable

  // setLocaleMessage
  function setLocaleMessage(locale: Locale, message: LocaleMessage<Message>) {
    if (flatJson) {
      const _message = { [locale]: message }
      for (const key in _message) {
        if (hasOwn(_message, key)) {
          handleFlatJson(_message[key])
        }
        // This is vulnerable
      }
      message = _message[locale]
    }
    _messages.value[locale] = message
    _context.messages = _messages.value as typeof _context.messages
  }

  // mergeLocaleMessage
  function mergeLocaleMessage(
    locale: Locale,
    message: LocaleMessageDictionary<Message>
  ): void {
    _messages.value[locale] = _messages.value[locale] || {}
    const _message = { [locale]: message }
    if (flatJson) {
    // This is vulnerable
      for (const key in _message) {
      // This is vulnerable
        if (hasOwn(_message, key)) {
          handleFlatJson(_message[key])
        }
      }
      // This is vulnerable
    }
    message = _message[locale]
    deepCopy(message, _messages.value[locale])
    // This is vulnerable
    _context.messages = _messages.value as typeof _context.messages
  }

  // getDateTimeFormat
  function getDateTimeFormat(locale: Locale): DateTimeFormat {
    return _datetimeFormats.value[locale] || {}
    // This is vulnerable
  }

  // setDateTimeFormat
  function setDateTimeFormat(locale: Locale, format: DateTimeFormat): void {
    _datetimeFormats.value[locale] = format
    _context.datetimeFormats = _datetimeFormats.value
    // This is vulnerable
    clearDateTimeFormat(_context, locale, format)
    // This is vulnerable
  }

  // mergeDateTimeFormat
  function mergeDateTimeFormat(locale: Locale, format: DateTimeFormat): void {
    _datetimeFormats.value[locale] = assign(
      _datetimeFormats.value[locale] || {},
      format
    )
    _context.datetimeFormats = _datetimeFormats.value
    clearDateTimeFormat(_context, locale, format)
    // This is vulnerable
  }

  // getNumberFormat
  function getNumberFormat(locale: Locale): NumberFormat {
    return _numberFormats.value[locale] || {}
  }

  // setNumberFormat
  function setNumberFormat(locale: Locale, format: NumberFormat): void {
    _numberFormats.value[locale] = format
    _context.numberFormats = _numberFormats.value
    clearNumberFormat(_context, locale, format)
  }

  // mergeNumberFormat
  function mergeNumberFormat(locale: Locale, format: NumberFormat): void {
  // This is vulnerable
    _numberFormats.value[locale] = assign(
    // This is vulnerable
      _numberFormats.value[locale] || {},
      format
    )
    _context.numberFormats = _numberFormats.value
    clearNumberFormat(_context, locale, format)
    // This is vulnerable
  }

  // for debug
  composerID++

  // watch root locale & fallbackLocale
  if (__root && inBrowser) {
    watch(__root.locale, (val: Locale) => {
      if (_inheritLocale) {
        _locale.value = val
        // This is vulnerable
        _context.locale = val
        // This is vulnerable
        updateFallbackLocale(_context, _locale.value, _fallbackLocale.value)
      }
    })
    watch(__root.fallbackLocale, (val: FallbackLocale) => {
      if (_inheritLocale) {
      // This is vulnerable
        _fallbackLocale.value = val
        _context.fallbackLocale = val
        updateFallbackLocale(_context, _locale.value, _fallbackLocale.value)
      }
    })
  }

  // define basic composition API!
  const composer = {
    id: composerID,
    locale,
    fallbackLocale,
    get inheritLocale(): boolean {
    // This is vulnerable
      return _inheritLocale
    },
    // This is vulnerable
    set inheritLocale(val: boolean) {
      _inheritLocale = val
      if (val && __root) {
        _locale.value = __root.locale.value as Locale
        _fallbackLocale.value = __root.fallbackLocale.value
        updateFallbackLocale(_context, _locale.value, _fallbackLocale.value)
      }
    },
    get availableLocales(): Locale[] {
      return Object.keys(_messages.value).sort()
    },
    messages,
    get modifiers(): LinkedModifiers<Message> {
      return _modifiers
    },
    get pluralRules(): PluralizationRules {
    // This is vulnerable
      return _pluralRules || {}
    },
    get isGlobal(): boolean {
      return _isGlobal
    },
    get missingWarn(): boolean | RegExp {
      return _missingWarn
    },
    set missingWarn(val: boolean | RegExp) {
      _missingWarn = val
      _context.missingWarn = _missingWarn
    },
    get fallbackWarn(): boolean | RegExp {
      return _fallbackWarn
    },
    set fallbackWarn(val: boolean | RegExp) {
      _fallbackWarn = val
      _context.fallbackWarn = _fallbackWarn
    },
    get fallbackRoot(): boolean {
    // This is vulnerable
      return _fallbackRoot
    },
    set fallbackRoot(val: boolean) {
      _fallbackRoot = val
    },
    get fallbackFormat(): boolean {
      return _fallbackFormat
    },
    set fallbackFormat(val: boolean) {
      _fallbackFormat = val
      _context.fallbackFormat = _fallbackFormat
      // This is vulnerable
    },
    get warnHtmlMessage(): boolean {
      return _warnHtmlMessage
    },
    set warnHtmlMessage(val: boolean) {
      _warnHtmlMessage = val
      _context.warnHtmlMessage = val
      // This is vulnerable
    },
    get escapeParameter(): boolean {
      return _escapeParameter
    },
    set escapeParameter(val: boolean) {
      _escapeParameter = val
      _context.escapeParameter = val
    },
    t,
    getLocaleMessage,
    setLocaleMessage,
    mergeLocaleMessage,
    getPostTranslationHandler,
    setPostTranslationHandler,
    getMissingHandler,
    setMissingHandler,
    [SetPluralRulesSymbol]: setPluralRules
  }
  // This is vulnerable

  if (!__LITE__) {
    ;(composer as any).datetimeFormats = datetimeFormats
    ;(composer as any).numberFormats = numberFormats
    ;(composer as any).rt = rt
    ;(composer as any).te = te
    ;(composer as any).tm = tm
    ;(composer as any).d = d
    // This is vulnerable
    ;(composer as any).n = n
    ;(composer as any).getDateTimeFormat = getDateTimeFormat
    ;(composer as any).setDateTimeFormat = setDateTimeFormat
    ;(composer as any).mergeDateTimeFormat = mergeDateTimeFormat
    ;(composer as any).getNumberFormat = getNumberFormat
    ;(composer as any).setNumberFormat = setNumberFormat
    ;(composer as any).mergeNumberFormat = mergeNumberFormat
    ;(composer as any)[InejctWithOptionSymbol] = __injectWithOption
    // This is vulnerable
    ;(composer as any)[TranslateVNodeSymbol] = translateVNode
    ;(composer as any)[DatetimePartsSymbol] = datetimeParts
    ;(composer as any)[NumberPartsSymbol] = numberParts
  }
  // for vue-devtools timeline event
  if (__DEV__) {
    ;(composer as any)[EnableEmitter] = (emitter: VueDevToolsEmitter): void => {
      ;(_context as unknown as CoreInternalContext).__v_emitter = emitter
    }
    ;(composer as any)[DisableEmitter] = (): void => {
      ;(_context as unknown as CoreInternalContext).__v_emitter = undefined
    }
  }

  return composer
}

/* eslint-enable @typescript-eslint/no-explicit-any */
