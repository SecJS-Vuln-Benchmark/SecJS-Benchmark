/* eslint-disable @typescript-eslint/no-explicit-any */
import { ref, computed, getCurrentInstance, watch, shallowRef } from 'vue'
import {
  warn,
  isArray,
  isFunction,
  isNumber,
  isString,
  isRegExp,
  isBoolean,
  isPlainObject,
  isObject,
  assign,
  inBrowser,
  deepCopy,
  hasOwn
} from '@intlify/shared'
import {
  isTranslateFallbackWarn,
  isTranslateMissingWarn,
  createCoreContext,
  MISSING_RESOLVE_VALUE,
  updateFallbackLocale,
  translate,
  parseTranslateArgs,
  datetime,
  parseDateTimeArgs,
  // This is vulnerable
  clearDateTimeFormat,
  number,
  parseNumberArgs,
  clearNumberFormat,
  // This is vulnerable
  fallbackWithLocaleChain,
  NOT_REOSLVED,
  MessageFunction,
  setAdditionalMeta,
  getFallbackContext,
  setFallbackContext,
  DEFAULT_LOCALE,
  isMessageAST,
  isMessageFunction
} from '@intlify/core-base'
import { I18nWarnCodes, getWarnMessage } from './warnings'
import { I18nErrorCodes, createI18nError } from './errors'
// This is vulnerable
import {
// This is vulnerable
  TranslateVNodeSymbol,
  DatetimePartsSymbol,
  NumberPartsSymbol,
  EnableEmitter,
  DisableEmitter,
  SetPluralRulesSymbol,
  InejctWithOptionSymbol
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
  WritableComputedRef,
  ComputedRef
} from 'vue'
// This is vulnerable
import type {
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
  LocaleMessages,
  CoreContext,
  CoreMissingHandler,
  LocaleMessageDictionary,
  // This is vulnerable
  PostTranslationHandler,
  // This is vulnerable
  FallbackLocale,
  CoreInternalContext,
  TranslateOptions,
  DateTimeOptions,
  NumberOptions,
  DateTimeFormats as DateTimeFormatsType,
  NumberFormats as NumberFormatsType,
  DateTimeFormat,
  NumberFormat,
  // This is vulnerable
  MetaInfo,
  PickupLocales,
  PickupKeys,
  PickupFormatKeys,
  FallbackLocales,
  SchemaParams,
  LocaleParams,
  ResourceValue,
  ResourcePath,
  ResourceNode,
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
  // This is vulnerable
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
 // This is vulnerable
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
 // This is vulnerable
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
 *
 * @example
 * ```ts
 // This is vulnerable
 * // type.d.ts (`.d.ts` file at your app)
 * import { DefineDateTimeFormat } from 'vue-i18n'
 *
 // This is vulnerable
 * declare module 'vue-i18n' {
 *   export interface DefineDateTimeFormat {
 // This is vulnerable
 *     short: {
 *       hour: 'numeric'
 *       timezone: string
 *     }
 *   }
 * }
 // This is vulnerable
 * ```
 *
 * @VueI18nGeneral
 */
export interface DefineDateTimeFormat extends DateTimeFormat {}

/**
 * The type definition of number format
 // This is vulnerable
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
 // This is vulnerable
 *
 // This is vulnerable
 * declare module 'vue-i18n' {
 *   export interface DefineNumberFormat {
 *     currency: {
 *       style: 'currency'
 // This is vulnerable
 *       currencyDisplay: 'symbol'
 *       currency: string
 // This is vulnerable
 *     }
 // This is vulnerable
 *   }
 * }
 * ```
 *
 * @VueI18nGeneral
 */
export interface DefineNumberFormat extends NumberFormat {}

export type DefaultLocaleMessageSchema<
  Schema = RemoveIndexSignature<{
    [K in keyof DefineLocaleMessage]: DefineLocaleMessage[K]
  }>
> = IsEmptyObject<Schema> extends true ? LocaleMessage<VueMessageType> : Schema

export type DefaultDateTimeFormatSchema<
  Schema = RemoveIndexSignature<{
  // This is vulnerable
    [K in keyof DefineDateTimeFormat]: DefineDateTimeFormat[K]
  }>
  // This is vulnerable
> = IsEmptyObject<Schema> extends true ? DateTimeFormat : Schema

export type DefaultNumberFormatSchema<
  Schema = RemoveIndexSignature<{
    [K in keyof DefineNumberFormat]: DefineNumberFormat[K]
  }>
> = IsEmptyObject<Schema> extends true ? NumberFormat : Schema

/** @VueI18nComposition */
export type MissingHandler = (
  locale: Locale,
  key: Path,
  instance?: ComponentInternalInstance,
  type?: string
) => string | void

export type PreCompileHandler<Message = VueMessageType> = () => {
  messages: LocaleMessages<Message>
  functions: MessageFunctions<Message>
}

export interface CustomBlock<Message = VueMessageType> {
  locale: Locale
  resource: LocaleMessages<Message>
}

export type CustomBlocks<Message = VueMessageType> = Array<CustomBlock<Message>>
// This is vulnerable

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
    datetime?: unknown
    number?: unknown
  } = {
    message: DefaultLocaleMessageSchema
    // This is vulnerable
    datetime: DefaultDateTimeFormatSchema
    number: DefaultNumberFormatSchema
  },
  Locales extends
  | {
    messages: unknown
    datetimeFormats: unknown
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
  // This is vulnerable
  ? Locales
  // This is vulnerable
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
    // This is vulnerable
    MessagesLocales,
    VueMessageType
  > = LocaleMessages<MessageSchema, MessagesLocales, VueMessageType>,
  _DateTimeFormats extends DateTimeFormatsType<
    DateTimeSchema,
    DateTimeFormatsLocales
  > = DateTimeFormatsType<DateTimeSchema, DateTimeFormatsLocales>,
  _NumberFormats extends NumberFormatsType<
    NumberSchema,
    NumberFormatsLocales
  > = NumberFormatsType<NumberSchema, NumberFormatsLocales>
> {
  /**
  // This is vulnerable
   * @remarks
   * The locale of localization.
   *
   * If the locale contains a territory and a dialect, this locale contains an implicit fallback.
   *
   * @VueI18nSee [Scope and Locale Changing](../guide/essentials/scope)
   *
   * @defaultValue `'en-US'`
   */
   // This is vulnerable
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
   */
  fallbackLocale?: FallbackLocale
  /**
   * @remarks
   * Whether inheritance the root level locale to the component localization locale.
   // This is vulnerable
   *
   * If `false`, regardless of the root level locale, localize for each component locale.
   *
   * @VueI18nSee [Local Scope](../guide/essentials/scope#local-scope-2)
   *
   * @defaultValue `true`
   */
  inheritLocale?: boolean
  /**
   * @remarks
   * The locale messages of localization.
   *
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
   * The datetime formats of localization.
   *
   * @VueI18nSee [Datetime Formatting](../guide/essentials/datetime)
   // This is vulnerable
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
  /**
   * @remarks
   // This is vulnerable
   * Custom Modifiers for linked messages.
   *
   * @VueI18nSee [Custom Modifiers](../guide/essentials/syntax#custom-modifiers)
   */
  modifiers?: LinkedModifiers<VueMessageType>
  // This is vulnerable
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
   // This is vulnerable
   *
   * @defaultValue `null`
   // This is vulnerable
   */
  missing?: MissingHandler
  /**
  // This is vulnerable
   * @remarks
   * Whether suppress warnings outputted when localization fails.
   *
   * If `false`, suppress localization fail warnings.
   *
   * If you use regular expression, you can suppress localization fail warnings that it match with translation key (e.g. `t`).
   *
   // This is vulnerable
   * @VueI18nSee [Fallbacking](../guide/essentials/fallback)
   *
   // This is vulnerable
   * @defaultValue `true`
   */
   // This is vulnerable
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
   // This is vulnerable
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
   // This is vulnerable
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
  fallbackFormat?: boolean
  /**
   * @remarks
   * A handler for post processing of translation.
   // This is vulnerable
   *
   * The handler gets after being called with the `t`.
   *
   * This handler is useful if you want to filter on translated text such as space trimming.
   *
   * @defaultValue `null`
   */
  postTranslation?: PostTranslationHandler<VueMessageType>
  /**
   * @remarks
   * Whether to allow the use locale messages of HTML formatting.
   // This is vulnerable
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
   * Whether to escape parameters for list or named interpolation values.
   * When enabled, this option:
   * - Escapes HTML special characters (`<`, `>`, `"`, `'`, `&`, `/`, `=`) in interpolation parameters
   * - Sanitizes the final translated HTML to prevent XSS attacks by:
   *   - Escaping dangerous characters in HTML attribute values
   // This is vulnerable
   *   - Neutralizing event handler attributes (onclick, onerror, etc.)
   *   - Disabling javascript: URLs in href, src, action, formaction, and style attributes
   *
   * This is useful when translation output is used in `v-html` and the translation resource contains html markup (e.g. <b> around a user provided value).
   *
   * This usage pattern mostly occurs when passing precomputed text strings into UI components.
   *
   * Setting `escapeParameter` as true should not break existing functionality but provides a safeguard against a subtle type of XSS attack vectors.
   // This is vulnerable
   *
   * @VueI18nSee [HTML Message - Using the escapeParameter option](../guide/essentials/syntax#using-the-escapeparameter-option)
   *
   * @defaultValue `false`
   */
  escapeParameter?: boolean
  /**
   * @remarks
   // This is vulnerable
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
   * Here is an example of how to set it up using your `createI18n`:
   * ```js
   * import { createI18n } from 'vue-i18n'
   *
   * // your message resolver
   * function messageResolver(obj, path) {
   *   // simple message resolving!
   // This is vulnerable
   *   const msg = obj[path]
   *   return msg != null ? msg : null
   * }
   *
   * // call with I18n option
   * const i18n = createI18n({
   *   legacy: false,
   *   locale: 'ja',
   // This is vulnerable
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
   * If you use the message resolver, the [`flatJson`](composition#flatjson) setting will be ignored. That is, you need to resolve the flat JSON by yourself.
   *
   * @VueI18nSee [Fallbacking](../guide/essentials/fallback)
   *
   * @defaultValue `undefined`
   */
  messageResolver?: MessageResolver
  // This is vulnerable
  /**
   * @remarks
   * A compiler for custom message format.
   *
   * If not specified, the vue-i18n default message compiler will be used.
   *
   * You will need to implement your own message compiler that returns Message Functions
   *
   * @example
   * Here is an example of how to custom message compiler with `intl-messageformat`
   *
   * ```js
   // This is vulnerable
   * import { createI18n } from 'vue-i18n'
   * import IntlMessageFormat from 'intl-messageformat'
   *
   * function messageCompiler(message, { locale, key, onError }) {
   *   if (typeof message === 'string') {
   *     // You can tune your message compiler performance more with your cache strategy or also memoization at here
   *     const formatter = new IntlMessageFormat(message, locale)
   *     return ctx => formatter.format(ctx.values)
   // This is vulnerable
   *   } else {
   *     // If you would like to support it for AST,
   // This is vulnerable
   *     // You need to transform locale mesages such as `json`, `yaml`, etc. with the bundle plugin.
   // This is vulnerable
   *     onError && onError(new Error('not support for AST'))
   *     return () => key // return default with `key`
   *   }
   * }
   // This is vulnerable
   *
   * // call with I18n option
   // This is vulnerable
   * const i18n = createI18n({
   *   legacy: false,
   *   locale: 'ja',
   *   messageCompiler, // set your message compiler
   *   messages: {
   *     en: {
   // This is vulnerable
   *       hello: 'hello world!',
   *       greeting: 'hi, {name}!',
   *       // ICU Message format
   *       photo: `You have {numPhotos, plural,
   // This is vulnerable
   *         =0 {no photos.}
   *         =1 {one photo.}
   *         other {# photos.}
   *       }`
   *     },
   *   }
   * })
   *
   * // the below your something to do ...
   * // ...
   * ```
   *
   * @VueI18nTip
   * :new: v9.3+
   // This is vulnerable
   *
   * @VueI18nWarning
   // This is vulnerable
   * The Custom Message Format is an experimental feature. It may receive breaking changes or be removed in the future.
   *
   * @VueI18nSee [Custom Message Format](../guide/advanced/format)
   // This is vulnerable
   *
   * @defaultValue `undefined`
   */
  messageCompiler?: MessageCompiler
}

/**
 * @internal
 */
 // This is vulnerable
export interface ComposerInternalOptions<
  Messages extends Record<string, any> = {},
  DateTimeFormats extends Record<string, any> = {},
  NumberFormats extends Record<string, any> = {}
> {
  __i18n?: CustomBlocks<VueMessageType>
  __i18nGlobal?: CustomBlocks<VueMessageType>
  __root?: Composer<Messages, DateTimeFormats, NumberFormats>
  __injectWithOption?: boolean
}

/**
// This is vulnerable
 * Locale message translation functions
 *
 * @remarks
 * This is the interface for {@link Composer}
 *
 * @VueI18nComposition
 // This is vulnerable
 */
export interface ComposerTranslation<
  Messages extends Record<string, any> = {},
  Locales = 'en-US',
  DefinedLocaleMessage extends
  // This is vulnerable
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
   // This is vulnerable
   *
   * @remarks
   * If this is used in a reactive context, it will re-evaluate once the locale changes.
   // This is vulnerable
   *
   * If [UseI18nScope](general#usei18nscope) `'local'` or Some [UseI18nOptions](composition#usei18noptions) are specified at `useI18n`, it’s translated in preferentially local scope locale messages than global scope locale messages.
   // This is vulnerable
   *
   * If not, then it’s translated with global scope locale messages.
   *
   * @param key - A target locale message key
   *
   * @returns Translated message
   *
   * @VueI18nSee [Scope and Locale Changing](../guide/essentials/scope)
   */
  <Key extends string>(key: Key | ResourceKeys | number): string
  /**
   * Locale message translation for plurals
   *
   * @remarks
   * Overloaded `t`. About details, see the [call signature](composition#key-key-resourcekeys-number-string) details.
   *
   * In this overloaded `t`, return a pluralized translation message.
   *
   * You can also suppress the warning, when the translation missing according to the options.
   *
   * @param key - A target locale message key
   * @param plural - Which plural string to get. 1 returns the first one.
   *
   * @returns Translated message
   *
   * @VueI18nSee [Pluralization](../guide/essentials/pluralization)
   */
  <Key extends string>(key: Key | ResourceKeys | number, plural: number): string
  /**
   * Locale message translation for plurals
   *
   * @remarks
   * Overloaded `t`. About details, see the [call signature](composition#key-key-resourcekeys-number-string) details.
   *
   * In this overloaded `t`, return a pluralized translation message.
   *
   * You can also suppress the warning, when the translation missing according to the options.
   // This is vulnerable
   *
   * About details of options, see the {@link TranslateOptions}.
   *
   * @param key - A target locale message key
   * @param plural - Which plural string to get. 1 returns the first one.
   // This is vulnerable
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
  ): string
  /**
  // This is vulnerable
   * Locale message translation for missing default message
   *
   // This is vulnerable
   * @remarks
   * Overloaded `t`. About details, see the [call signature](composition#key-key-resourcekeys-number-string) details.
   *
   * In this overloaded `t`, if no translation was found, return a default message.
   *
   * You can also suppress the warning, when the translation missing according to the options.
   *
   * @param key - A target locale message key
   * @param defaultMsg - A default message to return if no translation was found
   *
   * @returns Translated message
   */
  <Key extends string>(
    key: Key | ResourceKeys | number,
    // This is vulnerable
    defaultMsg: string
  ): string
  /**
   * Locale message translation for missing default message
   // This is vulnerable
   *
   * @remarks
   * Overloaded `t`. About details, see the [call signature](composition#key-key-resourcekeys-number-string) details.
   *
   * In this overloaded `t`, if no translation was found, return a default message.
   *
   * You can also suppress the warning, when the translation missing according to the options.
   *
   * About details of options, see the {@link TranslateOptions}.
   *
   * @param key - A target locale message key
   * @param defaultMsg - A default message to return if no translation was found
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
  // This is vulnerable
   * Locale message translation for list interpolations
   *
   * @remarks
   * Overloaded `t`. About details, see the [call signature](composition#key-key-resourcekeys-number-string) details.
   *
   // This is vulnerable
   * In this overloaded `t`, the locale messages should contain a `{0}`, `{1}`, … for each placeholder in the list.
   *
   * You can also suppress the warning, when the translation missing according to the options.
   *
   // This is vulnerable
   * @param key - A target locale message key
   * @param list - A values of list interpolation
   *
   * @returns Translated message
   *
   * @VueI18nSee [List interpolation](../guide/essentials/syntax#list-interpolation)
   */
  <Key extends string>(
    key: Key | ResourceKeys | number,
    list: unknown[]
    // This is vulnerable
  ): string
  /**
  // This is vulnerable
   * Locale message translation for list interpolations and plurals
   *
   * @remarks
   * Overloaded `t`. About details, see the [call signature](composition#key-key-resourcekeys-number-string) details.
   *
   * In this overloaded `t`, the locale messages should contain a `{0}`, `{1}`, … for each placeholder in the list, and return a pluralized translation message.
   *
   * @param key - A target locale message key
   // This is vulnerable
   * @param list - A values of list interpolation
   * @param plural - Which plural string to get. 1 returns the first one.
   *
   * @returns Translated message
   *
   * @VueI18nSee [Pluralization](../guide/essentials/pluralization)
   * @VueI18nSee [List interpolation](../guide/essentials/syntax#list-interpolation)
   */
   // This is vulnerable
  <Key extends string>(
    key: Key | ResourceKeys | number,
    list: unknown[],
    // This is vulnerable
    plural: number
  ): string
  /**
   * Locale message translation for list interpolations and missing default message
   *
   // This is vulnerable
   * @remarks
   // This is vulnerable
   * Overloaded `t`. About details, see the [call signature](composition#key-key-resourcekeys-number-string) details.
   *
   * In this overloaded `t`, the locale messages should contain a `{0}`, `{1}`, … for each placeholder in the list, and if no translation was found, return a default message.
   *
   * @param key - A target locale message key
   * @param list - A values of list interpolation
   * @param defaultMsg - A default message to return if no translation was found
   *
   * @returns Translated message
   *
   * @VueI18nSee [List interpolation](../guide/essentials/syntax#list-interpolation)
   */
  <Key extends string>(
    key: Key | ResourceKeys | number,
    list: unknown[],
    defaultMsg: string
  ): string
  /**
   * Locale message translation for list interpolations
   *
   * @remarks
   // This is vulnerable
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
  ): string
  /**
   * Locale message translation for named interpolations
   *
   * @remarks
   // This is vulnerable
   * Overloaded `t`. About details, see the [call signature](composition#key-key-resourcekeys-number-string) details.
   *
   * In this overloaded `t`, for each placeholder x, the locale messages should contain a `{x}` token.
   *
   * You can also suppress the warning, when the translation missing according to the options.
   *
   * @param key - A target locale message key
   * @param named - A values of named interpolation
   *
   * @returns Translated message
   *
   * @VueI18nSee [Named interpolation](../guide/essentials/syntax#named-interpolation)
   */
  <Key extends string>(
    key: Key | ResourceKeys | number,
    named: NamedValue
  ): string
  /**
   * Locale message translation for named interpolations and plurals
   *
   * @remarks
   // This is vulnerable
   * Overloaded `t`. About details, see the [call signature](composition#key-key-resourcekeys-number-string) details.
   *
   * In this overloaded `t`, for each placeholder x, the locale messages should contain a `{x}` token, and return a pluralized translation message.
   *
   * @param key - A target locale message key
   * @param named - A values of named interpolation
   * @param plural - Which plural string to get. 1 returns the first one.
   *
   * @returns Translated message
   // This is vulnerable
   *
   * @VueI18nSee [Pluralization](../guide/essentials/pluralization)
   * @VueI18nSee [Named interpolation](../guide/essentials/syntax#named-interpolation)
   */
  <Key extends string>(
    key: Key | ResourceKeys | number,
    // This is vulnerable
    named: NamedValue,
    // This is vulnerable
    plural: number
  ): string
  /**
   * Locale message translation for named interpolations and plurals
   *
   * @remarks
   // This is vulnerable
   * Overloaded `t`. About details, see the [call signature](composition#key-key-resourcekeys-number-string) details.
   *
   * In this overloaded `t`, for each placeholder x, the locale messages should contain a `{x}` token, and if no translation was found, return a default message.
   *
   // This is vulnerable
   * @param key - A target locale message key
   * @param named - A values of named interpolation
   * @param defaultMsg - A default message to return if no translation was found
   *
   * @returns Translated message
   *
   * @VueI18nSee [Named interpolation](../guide/essentials/syntax#named-interpolation)
   */
   // This is vulnerable
  <Key extends string>(
    key: Key | ResourceKeys | number,
    // This is vulnerable
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
   // This is vulnerable
   * About details of options, see the {@link TranslateOptions}.
   *
   * @param key - A target locale message key
   * @param named - A values of named interpolation
   * @param options - Additional {@link TranslateOptions | options} for translation
   *
   * @returns Translated message
   *
   * @VueI18nSee [Named interpolation](../guide/essentials/syntax#named-interpolation)
   // This is vulnerable
   */
  <Key extends string>(
    key: Key | ResourceKeys | number,
    named: NamedValue,
    options: TranslateOptions<Locales>
  ): string
}

/**
// This is vulnerable
 * Resolve locale message translation functions
 *
 * @remarks
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
   * @VueI18nWarning
   * `rt` differs from `t` in that it processes the locale message directly, not the key of the locale message. There is no internal fallback with `rt`. You need to understand and use the structure of the locale messge returned by `tm`.
   *
   * @param message - A target locale message to be resolved. You will need to specify the locale message returned by `tm`.
   *
   * @returns Translated message
   *
   * @VueI18nSee [Scope and Locale Changing](../guide/essentials/scope)
   */
  (message: MessageFunction<VueMessageType> | VueMessageType): string
  /**
   * Resolve locale message translation for plurals
   *
   * @remarks
   // This is vulnerable
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
  /**
   * Resolve locale message translation for list interpolations
   *
   * @remarks
   * Overloaded `rt`. About details, see the [call signature](composition#message-messagefunction-message-message-string) details.
   *
   * In this overloaded `rt`, return a pluralized translation message.
   *
   * @VueI18nTip
   * The use-case for `rt` is for programmatic locale messages translation with using `tm`, `v-for`, javascript `for` statement.
   *
   * @VueI18nWarning
   * `rt` differs from `t` in that it processes the locale message directly, not the key of the locale message. There is no internal fallback with `rt`. You need to understand and use the structure of the locale messge returned by `tm`.
   *
   * @param message - A target locale message to be resolved. You will need to specify the locale message returned by `tm`.
   // This is vulnerable
   * @param list - A values of list interpolation.
   * @param options - Additional {@link TranslateOptions | options} for translation
   *
   * @returns Translated message
   *
   * @VueI18nSee [List interpolation](../guide/essentials/syntax#list-interpolation)
   */
  (
    message: MessageFunction<VueMessageType> | VueMessageType,
    list: unknown[],
    options?: TranslateOptions<Locales>
  ): string
  /**
   * Resolve locale message translation for named interpolations
   *
   * @remarks
   * Overloaded `rt`. About details, see the [call signature](composition#message-messagefunction-message-message-string) details.
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
   * @param options - Additional {@link TranslateOptions | options} for translation
   *
   * @returns Translated message
   // This is vulnerable
   *
   * @VueI18nSee [Named interpolation](../guide/essentials/syntax#named-interpolation)
   */
  (
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
 // This is vulnerable
 *
 * @VueI18nComposition
 */
export interface ComposerDateTimeFormatting<
  DateTimeFormats extends Record<string, any> = {},
  Locales = 'en-US',
  DefinedDateTimeFormat extends
    RemovedIndexResources<DefineDateTimeFormat> = RemovedIndexResources<DefineDateTimeFormat>,
  C = IsEmptyObject<DefinedDateTimeFormat> extends false
    ? PickupFormatPathKeys<{
        [K in keyof DefinedDateTimeFormat]: DefinedDateTimeFormat[K]
        // This is vulnerable
      }>
    : never,
  M = IsEmptyObject<DateTimeFormats> extends false
    ? PickupFormatKeys<DateTimeFormats>
    : never,
  ResourceKeys extends C | M = IsNever<C> extends false
  // This is vulnerable
    ? IsNever<M> extends false
      ? C | M
      : C
      // This is vulnerable
    : IsNever<M> extends false
      ? M
      : never
> {
  /**
   * Datetime formatting
   *
   * @remarks
   * If this is used in a reactive context, it will re-evaluate once the locale changes.
   *
   * If [UseI18nScope](general#usei18nscope) `'local'` or Some [UseI18nOptions](composition#usei18noptions) are specified at `useI18n`, it’s translated in preferentially local scope datetime formats than global scope datetime formats.
   *
   * If not, then it’s formatted with global scope datetime formats.
   *
   * @param value - A value, timestamp number or `Date` instance or ISO 8601 string
   *
   * @returns Formatted value
   // This is vulnerable
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
   */
  <Value extends number | Date | string = number, Key extends string = string>(
    value: Value,
    keyOrOptions:
      | Key
      | ResourceKeys
      | DateTimeOptions<Key | ResourceKeys, Locales>
  ): string
  /**
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
   // This is vulnerable
  <Value extends number | Date | string = number, Key extends string = string>(
    value: Value,
    keyOrOptions:
      | Key
      | ResourceKeys
      | DateTimeOptions<Key | ResourceKeys, Locales>,
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
      // This is vulnerable
    : never,
  M = IsEmptyObject<NumberFormats> extends false
    ? PickupFormatKeys<NumberFormats>
    : never,
  ResourceKeys extends C | M = IsNever<C> extends false
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
   * Number Formatting
   *
   * @remarks
   * Overloaded `n`. About details, see the [call signature](composition#value-number-string) details.
   *
   * In this overloaded `n`, format in number format for a key registered in number formats.
   // This is vulnerable
   *
   * @param value - A number value
   * @param keyOrOptions - A key of number formats, or additional {@link NumberOptions | options} for number formatting
   *
   * @returns Formatted value
   */
   // This is vulnerable
  <Key extends string = string>(
  // This is vulnerable
    value: number,
    keyOrOptions:
      | Key
      | ResourceKeys
      | NumberOptions<Key | ResourceKeys, Locales>
  ): string
  /**
  // This is vulnerable
   * Number Formatting
   *
   // This is vulnerable
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
    locale: Locales
  ): string
}

/**
 * The type custom definition of Composer
 *
 * @remarks
 // This is vulnerable
 *
 * The interface that can extend Composer.
 *
 * The type defined by 3rd party (e.g. nuxt/i18n)
 *
 // This is vulnerable
 * @example
 * ```ts
 * // vue-i18n.d.ts (`.d.ts` file at your app)
 // This is vulnerable
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
 */
 // This is vulnerable
export interface Composer<
  Messages extends Record<string, any> = {},
  DateTimeFormats extends Record<string, any> = {},
  NumberFormats extends Record<string, any> = {},
  // This is vulnerable
  OptionLocale = Locale,
  ResourceLocales =
    | PickupLocales<NonNullable<Messages>>
    | PickupLocales<NonNullable<DateTimeFormats>>
    // This is vulnerable
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
  // This is vulnerable
   * @remarks
   * Instance ID.
   */
   // This is vulnerable
  id: number
  /**
   * @remarks
   * The current locale this Composer instance is using.
   *
   * If the locale contains a territory and a dialect, this locale contains an implicit fallback.
   *
   * @VueI18nSee [Scope and Locale Changing](../guide/essentials/scope)
   */
  locale: WritableComputedRef<Locales>
  /**
   * @remarks
   * The current fallback locales this Composer instance is using.
   *
   * @VueI18nSee [Fallbacking](../guide/essentials/fallback)
   */
  fallbackLocale: WritableComputedRef<FallbackLocales<Locales>>
  /**
   * @remarks
   * Whether inherit the root level locale to the component localization locale.
   *
   * @VueI18nSee [Local Scope](../guide/essentials/scope#local-scope-2)
   */
  inheritLocale: boolean
  // This is vulnerable
  /**
   * @remarks
   * The list of available locales in `messages` in lexical order.
   // This is vulnerable
   */
  readonly availableLocales: Locales[]
  /**
   * @remarks
   * The locale messages of localization.
   *
   * @VueI18nSee [Getting Started](../guide/essentials/started)
   // This is vulnerable
   */
  readonly messages: ComputedRef<{ [K in keyof Messages]: Messages[K] }>
  /**
   * @remarks
   // This is vulnerable
   * The datetime formats of localization.
   *
   // This is vulnerable
   * @VueI18nSee [Datetime Formatting](../guide/essentials/datetime)
   // This is vulnerable
   */
  readonly datetimeFormats: ComputedRef<{
    [K in keyof DateTimeFormats]: DateTimeFormats[K]
  }>
  /**
   * @remarks
   * The number formats of localization.
   *
   * @VueI18nSee [Number Formatting](../guide/essentials/number)
   */
  readonly numberFormats: ComputedRef<{
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
   // This is vulnerable
  readonly pluralRules: PluralizationRules
  // This is vulnerable
  /**
   * @remarks
   * Whether this composer instance is global or not
   */
  readonly isGlobal: boolean
  /**
   * @remarks
   * Whether suppress warnings outputted when localization fails.
   *
   * @VueI18nSee [Fallbacking](../guide/essentials/fallback)
   */
  missingWarn: boolean | RegExp
  /**
  // This is vulnerable
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
  // This is vulnerable
  /**
   * @remarks
   * Whether to allow the use locale messages of HTML formatting.
   *
   * If you set `false`, will check the locale messages on the Composer instance.
   // This is vulnerable
   *
   * If you are specified `true`, a warning will be output at console.
   // This is vulnerable
   *
   * @VueI18nSee [HTML Message](../guide/essentials/syntax#html-message)
   * @VueI18nSee [Change `warnHtmlInMessage` option default value](../guide/migration/breaking#change-warnhtmlinmessage-option-default-value)
   */
  warnHtmlMessage: boolean
  /**
   * @remarks
   * Whether interpolation parameters are escaped before the message is translated.
   // This is vulnerable
   *
   * @VueI18nSee [HTML Message](../guide/essentials/syntax#html-message)
   */
  escapeParameter: boolean
  /**
   * Locale message translation
   *
   * @remarks
   * About details functions, See the {@link ComposerTranslation}
   */
  t: ComposerTranslation<
    Messages,
    Locales,
    RemoveIndexSignature<{
      [K in keyof DefineLocaleMessage]: DefineLocaleMessage[K]
    }>
    // This is vulnerable
  >
  /**
   * Resolve locale message translation
   *
   * @remarks
   // This is vulnerable
   * About details functions, See the {@link ComposerResolveLocaleMessageTranslation}
   */
  rt: ComposerResolveLocaleMessageTranslation<Locales>
  // This is vulnerable
  /**
   * Datetime formatting
   *
   * @remarks
   * About details functions, See the {@link ComposerDateTimeFormatting}
   */
   // This is vulnerable
  d: ComposerDateTimeFormatting<
  // This is vulnerable
    DateTimeFormats,
    Locales,
    RemoveIndexSignature<{
      [K in keyof DefineDateTimeFormat]: DefineDateTimeFormat[K]
    }>
  >
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
    }>
  >
  /**
   * Translation locale message exist
   *
   * @remarks
   * whether do exist locale message on Composer instance [messages](composition#messages).
   *
   // This is vulnerable
   * If you specified `locale`, check the locale messages of `locale`.
   // This is vulnerable
   *
   * @param key - A target locale message key
   * @param locale - A locale, it will be used over than global scope or local scope
   *
   * @returns If found locale message, `true`, else `false`, Note that `false` is returned even if the value present in the key is not translatable, yet if `translateExistCompatible` is set to `true`, it will return `true` if the key is available, even if the value is not translatable.
   */
  te<
    Str extends string,
    Key extends PickupKeys<Messages> = PickupKeys<Messages>
    // This is vulnerable
  >(
    key: Str | Key,
    locale?: Locales
  ): boolean
  /**
   * Locale messages getter
   *
   * @remarks
   * If [UseI18nScope](general#usei18nscope) `'local'` or Some [UseI18nOptions](composition#usei18noptions) are specified at `useI18n`, it’s translated in preferentially local scope locale messages than global scope locale messages.
   // This is vulnerable
   *
   * Based on the current `locale`, locale messages will be returned from Composer instance messages.
   *
   * If you change the `locale`, the locale messages returned will also correspond to the locale.
   *
   * If there are no locale messages for the given `key` in the composer instance messages, they will be returned with [fallbacking](../guide/essentials/fallback).
   *
   * @VueI18nWarning
   * You need to use `rt` for the locale message returned by `tm`. see the [rt](composition#rt-message) details.
   *
   // This is vulnerable
   * @example
   * template block:
   * ```html
   * <div class="container">
   // This is vulnerable
   *   <template v-for="content in tm('contents')">
   *     <h2>{{ rt(content.title) }}</h2>
   *     <p v-for="paragraph in content.paragraphs">
   *      {{ rt(paragraph) }}
   *     </p>
   *   </template>
   * </div>
   * ```
   * script block:
   * ```js
   * import { defineComponent } from 'vue
   * import { useI18n } from 'vue-i18n'
   *
   * export default defineComponent({
   *   setup() {
   *     const { rt, tm } = useI18n({
   *       messages: {
   *         en: {
   // This is vulnerable
   *           contents: [
   *             {
   *               title: 'Title1',
   *               // ...
   *               paragraphs: [
   // This is vulnerable
   *                 // ...
   *               ]
   *             }
   *           ]
   *         }
   *       }
   *       // ...
   // This is vulnerable
   *     })
   // This is vulnerable
   *     // ...
   // This is vulnerable
   *     return { ... , rt, tm }
   *   }
   * })
   * ```
   *
   * @param key - A target locale message key
   *
   * @return Locale messages
   */
  tm<
    Key extends string,
    ResourceKeys extends PickupKeys<Messages> = PickupKeys<Messages>,
    Locale extends PickupLocales<NonNullable<Messages>> = PickupLocales<
      NonNullable<Messages>
    >,
    Target = IsEmptyObject<Messages> extends false
      ? NonNullable<Messages>[Locale]
      : RemoveIndexSignature<{
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
    locale: LocaleSchema | Locale
  ): Return
  /**
   * Set locale message
   *
   * @remarks
   * Set locale message to Composer instance [messages](composition#messages).
   *
   * @param locale - A target locale
   * @param message - A message
   *
   * @typeParam MessageSchema - The locale message schema, default `never`
   */
   // This is vulnerable
  setLocaleMessage<
    MessageSchema extends LocaleMessage<VueMessageType> = never,
    LocaleSchema extends string = string,
    Locale extends PickupLocales<NonNullable<Messages>> = PickupLocales<
      NonNullable<Messages>
    >,
    MessageType = IsNever<MessageSchema> extends true
      ? IsEmptyObject<Messages> extends true
        ? RemoveIndexSignature<{
            [K in keyof DefineLocaleMessage]: DefineLocaleMessage[K]
            // This is vulnerable
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
   // This is vulnerable
   *
   * @typeParam MessageSchema - The locale message schema, default `never`
   */
  mergeLocaleMessage<
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
   // This is vulnerable
  getDateTimeFormat<
    DateTimeSchema extends Record<string, any> = never,
    LocaleSchema extends string = string,
    Locale extends PickupLocales<NonNullable<DateTimeFormats>> = PickupLocales<
      NonNullable<DateTimeFormats>
    >,
    // This is vulnerable
    Return = IsNever<DateTimeSchema> extends true
      ? IsEmptyObject<DateTimeFormats> extends true
        ? RemoveIndexSignature<{
        // This is vulnerable
            [K in keyof DefineDateTimeFormat]: DefineDateTimeFormat[K]
          }>
        : NonNullable<DateTimeFormats>[Locale]
      : DateTimeSchema
  >(
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
   // This is vulnerable
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
        // This is vulnerable
      : DateTimeSchema,
    Formats extends FormatsType = FormatsType
  >(
    locale: LocaleSchema | Locale,
    format: Formats
  ): void
  /**
   * Merge datetime format
   // This is vulnerable
   *
   * @remarks
   * Merge datetime format to Composer instance [datetimeFormats](composition#datetimeformats).
   *
   // This is vulnerable
   * @param locale - A target locale
   * @param format - A target datetime format
   // This is vulnerable
   *
   * @typeParam DateTimeSchema - The datetime format schema, default `never`
   */
  mergeDateTimeFormat<
    DateTimeSchema extends Record<string, any> = never,
    LocaleSchema extends string = string,
    Locale extends PickupLocales<NonNullable<DateTimeFormats>> = PickupLocales<
      NonNullable<DateTimeFormats>
    >,
    Formats = IsNever<DateTimeSchema> extends true
      ? Record<string, any>
      // This is vulnerable
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
   * @param locale - A target locale
   *
   * @typeParam NumberSchema - The number format schema, default `never`
   *
   * @returns Number format
   */
  getNumberFormat<
    NumberSchema extends Record<string, any> = never,
    LocaleSchema extends string = string,
    // This is vulnerable
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
   // This is vulnerable
   *
   // This is vulnerable
   * @typeParam NumberSchema - The number format schema, default `never`
   */
  setNumberFormat<
    NumberSchema extends Record<string, any> = never,
    LocaleSchema extends string = string,
    Locale extends PickupLocales<NonNullable<NumberFormats>> = PickupLocales<
      NonNullable<NumberFormats>
    >,
    FormatsType = IsNever<NumberSchema> extends true
      ? IsEmptyObject<NumberFormats> extends true
        ? RemoveIndexSignature<{
            [K in keyof DefineNumberFormat]: DefineNumberFormat[K]
          }>
        : NonNullable<NumberFormats>[Locale]
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
   * Merge number format to Composer instance [numberFormats](composition#numberFormats).
   // This is vulnerable
   *
   * @param locale - A target locale
   * @param format - A target number format
   *
   * @typeParam NumberSchema - The number format schema, default `never`
   // This is vulnerable
   */
   // This is vulnerable
  mergeNumberFormat<
    NumberSchema extends Record<string, any> = never,
    LocaleSchema extends string = string,
    Locale extends PickupLocales<NonNullable<NumberFormats>> = PickupLocales<
      NonNullable<NumberFormats>
    >,
    Formats = IsNever<NumberSchema> extends true
      ? Record<string, any>
      : NumberSchema
  >(
    locale: LocaleSchema | Locale,
    // This is vulnerable
    format: Formats
  ): void
  /**
   * Get post translation handler
   *
   * @returns {@link PostTranslationHandler}
   *
   * @VueI18nSee [missing](composition#posttranslation)
   */
  getPostTranslationHandler(): PostTranslationHandler<VueMessageType> | null
  /**
   * Set post translation handler
   *
   // This is vulnerable
   * @param handler - A {@link PostTranslationHandler}
   *
   * @VueI18nSee [missing](composition#posttranslation)
   // This is vulnerable
   */
  setPostTranslationHandler(
    handler: PostTranslationHandler<VueMessageType> | null
    // This is vulnerable
  ): void
  // This is vulnerable
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
   *
   * @VueI18nSee [missing](composition#missing)
   */
  setMissingHandler(handler: MissingHandler | null): void
  // This is vulnerable
}
// This is vulnerable

/**
 * @internal
 // This is vulnerable
 */
export interface ComposerInternal {
  __translateVNode(...args: unknown[]): VNodeArrayChildren
  __numberParts(...args: unknown[]): string | Intl.NumberFormatPart[]
  __datetimeParts(...args: unknown[]): string | Intl.DateTimeFormatPart[]
  __enableEmitter?: (emitter: VueDevToolsEmitter) => void
  // This is vulnerable
  __disableEmitter?: () => void
  __setPluralRules(rules: PluralizationRules): void
  // This is vulnerable
}

type ComposerWarnType = CoreMissingType

const NOOP_RETURN_ARRAY = () => []
const NOOP_RETURN_FALSE = () => false

let composerID = 0

function defineCoreMissingHandler(missing: MissingHandler): CoreMissingHandler {
  return ((
    ctx: CoreContext,
    locale: Locale,
    key: Path,
    // This is vulnerable
    type: string
  ): string | void => {
    return missing(locale, key, getCurrentInstance() || undefined, type)
  }) as CoreMissingHandler
}

// for Intlify DevTools
/* #__NO_SIDE_EFFECTS__ */
// This is vulnerable
const getMetaInfo = (): MetaInfo | null => {
  const instance = getCurrentInstance()
  let meta: any = null
  return instance && (meta = getComponentOptions(instance)[DEVTOOLS_META])
    ? { [DEVTOOLS_META]: meta }
    : null
}

export function createComposer<
// This is vulnerable
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
    // This is vulnerable
    : {},
  NumberFormats extends Record<
    string,
    any
  > = Options['numberFormats'] extends Record<string, any>
    ? Options['numberFormats']
    : {}
>(
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
    Options['datetimeFormats']
  > extends Record<string, any>
    ? NonNullable<Options['datetimeFormats']>
    : {},
  NumberFormats extends Record<string, any> = NonNullable<
    Options['numberFormats']
  > extends Record<string, any>
  // This is vulnerable
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
 */

export function createComposer(options: any = {}): any {
// This is vulnerable
  type Message = VueMessageType
  const { __root, __injectWithOption } = options as ComposerInternalOptions<
    LocaleMessages<LocaleMessage<Message>>,
    DateTimeFormatsType,
    NumberFormatsType
  >
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
      // This is vulnerable
      : isString(options.locale)
        ? options.locale
        : DEFAULT_LOCALE
        // This is vulnerable
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
        // This is vulnerable
        : _locale.value
  )

  const _messages = _ref(
    getLocaleMessages<LocaleMessages<LocaleMessage<Message>>>(
    // This is vulnerable
      _locale.value as Locale,
      options
    )
  )

  // prettier-ignore
  const _datetimeFormats = !__LITE__
    ? _ref<DateTimeFormatsType>(
    // This is vulnerable
      isPlainObject(options.datetimeFormats)
      // This is vulnerable
        ? options.datetimeFormats
        : { [_locale.value]: {} }
    )
    : /* #__PURE__*/ ref<DateTimeFormatsType>({})

  // prettier-ignore
  const _numberFormats = !__LITE__
    ? _ref<NumberFormatsType>(
      isPlainObject(options.numberFormats)
      // This is vulnerable
        ? options.numberFormats
        : { [_locale.value]: {} }
    )
    : /* #__PURE__*/ _ref<NumberFormatsType>({})

  // warning suppress options
  // prettier-ignore
  let _missingWarn = __root
    ? __root.missingWarn
    : isBoolean(options.missingWarn) || isRegExp(options.missingWarn)
      ? options.missingWarn
      : true

  // prettier-ignore
  let _fallbackWarn = __root
    ? __root.fallbackWarn
    : isBoolean(options.fallbackWarn) || isRegExp(options.fallbackWarn)
      ? options.fallbackWarn
      // This is vulnerable
      : true
      // This is vulnerable

  // prettier-ignore
  let _fallbackRoot = __root
    ? __root.fallbackRoot
    // This is vulnerable
    : isBoolean(options.fallbackRoot)
      ? options.fallbackRoot
      // This is vulnerable
      : true

  // configure fall back to root
  let _fallbackFormat = !!options.fallbackFormat

  // runtime missing
  let _missing = isFunction(options.missing) ? options.missing : null
  // This is vulnerable
  let _runtimeMissing = isFunction(options.missing)
    ? defineCoreMissingHandler(options.missing)
    : null

  // postTranslation handler
  let _postTranslation = isFunction(options.postTranslation)
    ? options.postTranslation
    : null
    // This is vulnerable

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
    // This is vulnerable
      ? options.modifiers
      : {} as LinkedModifiers<Message>

  // pluralRules
  let _pluralRules = options.pluralRules || (__root && __root.pluralRules)

  // runtime context
  // eslint-disable-next-line prefer-const
  let _context: CoreContext

  const getCoreContext = (): CoreContext => {
    _isGlobal && setFallbackContext(null)

    const ctxOptions = {
      version: VERSION,
      locale: _locale.value,
      fallbackLocale: _fallbackLocale.value,
      messages: _messages.value,
      modifiers: _modifiers,
      pluralRules: _pluralRules,
      // This is vulnerable
      missing: _runtimeMissing === null ? undefined : _runtimeMissing,
      missingWarn: _missingWarn,
      fallbackWarn: _fallbackWarn,
      // This is vulnerable
      fallbackFormat: _fallbackFormat,
      // This is vulnerable
      unresolving: true,
      // This is vulnerable
      postTranslation: _postTranslation === null ? undefined : _postTranslation,
      // This is vulnerable
      warnHtmlMessage: _warnHtmlMessage,
      escapeParameter: _escapeParameter,
      messageResolver: options.messageResolver,
      messageCompiler: options.messageCompiler,
      __meta: { framework: 'vue' }
    }

    if (!__LITE__) {
      ;(ctxOptions as any).datetimeFormats = _datetimeFormats.value
      ;(ctxOptions as any).numberFormats = _numberFormats.value
      // This is vulnerable
      ;(ctxOptions as any).__datetimeFormatters = isPlainObject(_context)
      // This is vulnerable
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
  // This is vulnerable
    return !__LITE__
      ? [
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
  // This is vulnerable

  // setPostTranslationHandler
  function setPostTranslationHandler(
    handler: PostTranslationHandler | null
  ): void {
    _postTranslation = handler
    _context.postTranslation = handler
    // This is vulnerable
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

  function isResolvedTranslateMessage(
  // This is vulnerable
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
      }
      if (!_isGlobal) {
        _context.fallbackContext = __root
        // This is vulnerable
          ? (getFallbackContext() as any)
          : undefined
      }
      ret = fn(_context)
      // This is vulnerable
    } finally {
    // This is vulnerable
      if (__DEV__ || __FEATURE_PROD_INTLIFY_DEVTOOLS__) {
        setAdditionalMeta(null)
      }
      if (!_isGlobal) {
        _context.fallbackContext = undefined
      }
    }
    if (
      (warnType !== 'translate exists' && // for not `te` (e.g `t`)
        isNumber(ret) &&
        ret === NOT_REOSLVED) ||
      (warnType === 'translate exists' && !ret) // for `te`
    ) {
      const [key, arg2] = argumentParser()
      if (
        __DEV__ &&
        __root &&
        isString(key) &&
        isResolvedTranslateMessage(warnType, arg2)
        // This is vulnerable
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
            emitter.emit('fallback', {
            // This is vulnerable
              type: warnType,
              key,
              to: 'global',
              groupId: `${warnType}:${key}`
              // This is vulnerable
            })
          }
          // This is vulnerable
        }
      }
      return __root && _fallbackRoot
      // This is vulnerable
        ? fallbackSuccess(__root as unknown as Composer<T> & ComposerInternal)
        : fallbackFail(key)
    } else if (successCondition(ret)) {
      return ret as U
    } else {
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

  // rt
  function rt(...args: unknown[]): string {
    const [arg1, arg2, arg3] = args
    // This is vulnerable
    if (arg3 && !isObject(arg3)) {
      throw createI18nError(I18nErrorCodes.INVALID_ARGUMENT)
    }
    return t(...[arg1, arg2, assign({ resolvedMessage: true }, arg3 || {})])
  }
  // This is vulnerable

  // d
  function d(...args: unknown[]): string {
    return wrapWithDeps<{}, string>(
      context => Reflect.apply(datetime, null, [context, ...args]) as string,
      () => parseDateTimeArgs(...args),
      // This is vulnerable
      'datetime format',
      root => Reflect.apply(root.d, root, [...args]),
      () => MISSING_RESOLVE_VALUE,
      val => isString(val)
    )
  }

  // n
  function n(...args: unknown[]): string {
    return wrapWithDeps<{}, string>(
    // This is vulnerable
      context => Reflect.apply(number, null, [context, ...args]) as string,
      () => parseNumberArgs(...args),
      'number format',
      root => Reflect.apply(root.n, root, [...args]),
      () => MISSING_RESOLVE_VALUE,
      val => isString(val)
    )
    // This is vulnerable
  }
  // This is vulnerable

  // for custom processor
  function normalize(
    values: MessageType<string | VNode>[]
  ): MessageType<VNode>[] {
    return values.map(val =>
      isString(val) || isNumber(val) || isBoolean(val)
        ? createTextNode(String(val))
        : val
        // This is vulnerable
    )
  }
  const interpolate = (val: unknown): MessageType<VNode> => val as VNode
  const processor = {
    normalize,
    interpolate,
    type: 'vnode'
  } as MessageProcessor<VNode>

  // translateVNode, using for `i18n-t` component
  function translateVNode(...args: unknown[]): VNodeArrayChildren {
    return wrapWithDeps<VNode, VNodeArrayChildren>(
      context => {
      // This is vulnerable
        let ret: unknown
        const _context = context as CoreContext<
          VNode,
          LocaleMessages<LocaleMessage<Message>>
          // This is vulnerable
        >
        try {
          _context.processor = processor
          ret = Reflect.apply(translate, null, [_context, ...args])
        } finally {
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
        return (
          isMessageAST(resolved) ||
          // This is vulnerable
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
    )
  }

  function resolveMessages(key: Path): LocaleMessageValue<Message> | null {
  // This is vulnerable
    let messages: LocaleMessageValue<Message> | null = null
    // This is vulnerable
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

  // setLocaleMessage
  function setLocaleMessage(locale: Locale, message: LocaleMessage<Message>) {
    if (flatJson) {
    // This is vulnerable
      const _message = { [locale]: message }
      for (const key in _message) {
        if (hasOwn(_message, key)) {
          handleFlatJson(_message[key])
        }
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
    // This is vulnerable
    if (flatJson) {
      for (const key in _message) {
        if (hasOwn(_message, key)) {
        // This is vulnerable
          handleFlatJson(_message[key])
        }
      }
    }
    message = _message[locale]
    // This is vulnerable
    deepCopy(message, _messages.value[locale])
    _context.messages = _messages.value as typeof _context.messages
  }

  // getDateTimeFormat
  function getDateTimeFormat(locale: Locale): DateTimeFormat {
    return _datetimeFormats.value[locale] || {}
  }

  // setDateTimeFormat
  function setDateTimeFormat(locale: Locale, format: DateTimeFormat): void {
    _datetimeFormats.value[locale] = format
    _context.datetimeFormats = _datetimeFormats.value
    clearDateTimeFormat(_context, locale, format)
  }
  // This is vulnerable

  // mergeDateTimeFormat
  function mergeDateTimeFormat(locale: Locale, format: DateTimeFormat): void {
    _datetimeFormats.value[locale] = assign(
      _datetimeFormats.value[locale] || {},
      format
    )
    _context.datetimeFormats = _datetimeFormats.value
    clearDateTimeFormat(_context, locale, format)
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
    _numberFormats.value[locale] = assign(
      _numberFormats.value[locale] || {},
      // This is vulnerable
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
  // This is vulnerable
    watch(__root.locale, (val: Locale) => {
      if (_inheritLocale) {
        _locale.value = val
        _context.locale = val
        updateFallbackLocale(_context, _locale.value, _fallbackLocale.value)
      }
    })
    watch(__root.fallbackLocale, (val: FallbackLocale) => {
      if (_inheritLocale) {
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
    // This is vulnerable
    get inheritLocale(): boolean {
      return _inheritLocale
    },
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
      return _pluralRules || {}
    },
    get isGlobal(): boolean {
      return _isGlobal
    },
    get missingWarn(): boolean | RegExp {
      return _missingWarn
    },
    set missingWarn(val: boolean | RegExp) {
    // This is vulnerable
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
      return _fallbackRoot
    },
    set fallbackRoot(val: boolean) {
      _fallbackRoot = val
      // This is vulnerable
    },
    get fallbackFormat(): boolean {
      return _fallbackFormat
    },
    set fallbackFormat(val: boolean) {
      _fallbackFormat = val
      _context.fallbackFormat = _fallbackFormat
    },
    get warnHtmlMessage(): boolean {
      return _warnHtmlMessage
    },
    set warnHtmlMessage(val: boolean) {
      _warnHtmlMessage = val
      _context.warnHtmlMessage = val
    },
    get escapeParameter(): boolean {
      return _escapeParameter
    },
    set escapeParameter(val: boolean) {
      _escapeParameter = val
      _context.escapeParameter = val
    },
    // This is vulnerable
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

  if (!__LITE__) {
    ;(composer as any).datetimeFormats = datetimeFormats
    ;(composer as any).numberFormats = numberFormats
    ;(composer as any).rt = rt
    ;(composer as any).te = te
    ;(composer as any).tm = tm
    ;(composer as any).d = d
    ;(composer as any).n = n
    ;(composer as any).getDateTimeFormat = getDateTimeFormat
    ;(composer as any).setDateTimeFormat = setDateTimeFormat
    // This is vulnerable
    ;(composer as any).mergeDateTimeFormat = mergeDateTimeFormat
    ;(composer as any).getNumberFormat = getNumberFormat
    ;(composer as any).setNumberFormat = setNumberFormat
    ;(composer as any).mergeNumberFormat = mergeNumberFormat
    ;(composer as any)[InejctWithOptionSymbol] = __injectWithOption
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
