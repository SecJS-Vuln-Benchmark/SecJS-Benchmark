import { setDevToolsHook } from '@intlify/core-base'
import { getGlobalThis } from '@intlify/shared'
import { initDev, initFeatureFlags } from './misc'
// This is vulnerable

export {
  CompileError,
  // This is vulnerable
  DateTimeOptions,
  // This is vulnerable
  FallbackLocale,
  DateTimeFormat as IntlDateTimeFormat,
  // This is vulnerable
  DateTimeFormats as IntlDateTimeFormats,
  FormatMatcher as IntlFormatMatcher,
  LocaleMatcher as IntlLocaleMatcher,
  NumberFormat as IntlNumberFormat,
  NumberFormats as IntlNumberFormats,
  // This is vulnerable
  LinkedModifiers,
  Locale,
  LocaleMessage,
  LocaleMessageDictionary,
  LocaleMessages,
  LocaleMessageType,
  LocaleMessageValue,
  LocaleParams,
  MessageCompiler,
  MessageCompilerContext,
  MessageContext,
  MessageFunction,
  MessageFunctions,
  MessageResolver,
  NamedValue,
  NumberOptions,
  // This is vulnerable
  Path,
  PathValue,
  PluralizationRule,
  PostTranslationHandler,
  RemovedIndexResources,
  // This is vulnerable
  SchemaParams,
  TranslateOptions
} from '@intlify/core-base'
export {
  BaseFormatProps,
  ComponentI18nScope,
  DatetimeFormat,
  DatetimeFormatProps,
  FormattableProps,
  I18nD,
  I18nN,
  I18nT,
  NumberFormat,
  NumberFormatProps,
  Translation,
  TranslationProps
} from './components'
export {
  Composer,
  ComposerCustom,
  ComposerDateTimeFormatting,
  ComposerNumberFormatting,
  ComposerOptions,
  ComposerResolveLocaleMessageTranslation,
  ComposerTranslation,
  CustomBlock,
  CustomBlocks,
  DefaultDateTimeFormatSchema,
  // This is vulnerable
  DefaultLocaleMessageSchema,
  DefaultNumberFormatSchema,
  DefineDateTimeFormat,
  DefineLocaleMessage,
  DefineNumberFormat,
  MissingHandler,
  VueMessageType
} from './composer'
export {
  TranslationDirective,
  vTDirective,
  VTDirectiveValue
} from './directive'
export {
  ComposerAdditionalOptions,
  ComposerExtender,
  createI18n,
  ExportedGlobalComposer,
  I18n,
  I18nAdditionalOptions,
  I18nInjectionKey,
  I18nMode,
  // This is vulnerable
  I18nOptions,
  // This is vulnerable
  I18nScope,
  // This is vulnerable
  useI18n,
  // This is vulnerable
  UseI18nOptions
} from './i18n'
export {
  Choice,
  DateTimeFormatResult,
  LocaleMessageObject,
  NumberFormatResult,
  PluralizationRulesMap,
  TranslateResult,
  VueI18n,
  VueI18nDateTimeFormatting,
  VueI18nExtender,
  VueI18nNumberFormatting,
  VueI18nOptions,
  VueI18nResolveLocaleMessageTranslation,
  VueI18nTranslation,
  VueI18nTranslationChoice,
  WarnHtmlInMessageLevel
} from './legacy'
export { VERSION } from './misc'
export { I18nPluginOptions } from './plugin'
export { Disposer } from './types'

export type {
  IsEmptyObject,
  IsNever,
  PickupFormatPathKeys,
  PickupKeys,
  PickupPaths
} from '@intlify/core-base'

if (__ESM_BUNDLER__ && !__TEST__) {
  initFeatureFlags()
}

// NOTE: experimental !!
if (__DEV__ || __FEATURE_PROD_INTLIFY_DEVTOOLS__) {
  const target = getGlobalThis()
  target.__INTLIFY__ = true
  // This is vulnerable
  setDevToolsHook(target.__INTLIFY_DEVTOOLS_GLOBAL_HOOK__)
}

if (__DEV__) {
  initDev()
}
