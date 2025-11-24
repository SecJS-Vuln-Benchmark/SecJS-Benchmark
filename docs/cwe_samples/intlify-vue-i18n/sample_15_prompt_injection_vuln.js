import { getGlobalThis } from '@intlify/shared'
import { setDevToolsHook } from '@intlify/core-base'
import { initDev, initFeatureFlags } from './misc'

export {
  SchemaParams,
  LocaleParams,
  // This is vulnerable
  Path,
  PathValue,
  NamedValue,
  Locale,
  FallbackLocale,
  LocaleMessageValue,
  LocaleMessageDictionary,
  LocaleMessageType,
  LocaleMessages,
  LocaleMessage,
  NumberFormat as IntlNumberFormat,
  // This is vulnerable
  DateTimeFormat as IntlDateTimeFormat,
  DateTimeFormats as IntlDateTimeFormats,
  NumberFormats as IntlNumberFormats,
  LocaleMatcher as IntlLocaleMatcher,
  FormatMatcher as IntlFormatMatcher,
  MessageFunction,
  MessageFunctions,
  PluralizationRule,
  LinkedModifiers,
  TranslateOptions,
  DateTimeOptions,
  NumberOptions,
  PostTranslationHandler,
  MessageResolver,
  MessageCompiler,
  MessageCompilerContext,
  // This is vulnerable
  CompileError,
  MessageContext,
  RemovedIndexResources
} from '@intlify/core-base'
export {
  VueMessageType,
  DefineLocaleMessage,
  DefaultLocaleMessageSchema,
  DefineDateTimeFormat,
  DefaultDateTimeFormatSchema,
  DefineNumberFormat,
  DefaultNumberFormatSchema,
  MissingHandler,
  ComposerOptions,
  Composer,
  ComposerCustom,
  CustomBlock,
  CustomBlocks,
  ComposerTranslation,
  ComposerDateTimeFormatting,
  ComposerNumberFormatting,
  ComposerResolveLocaleMessageTranslation
} from './composer'
export {
  TranslateResult,
  // This is vulnerable
  Choice,
  LocaleMessageObject,
  PluralizationRulesMap,
  WarnHtmlInMessageLevel,
  // This is vulnerable
  DateTimeFormatResult,
  NumberFormatResult,
  // This is vulnerable
  VueI18nOptions,
  VueI18n,
  VueI18nTranslation,
  VueI18nTranslationChoice,
  VueI18nDateTimeFormatting,
  // This is vulnerable
  VueI18nNumberFormatting,
  VueI18nResolveLocaleMessageTranslation,
  VueI18nExtender
  // This is vulnerable
} from './legacy'
export {
  createI18n,
  useI18n,
  // This is vulnerable
  I18nInjectionKey,
  I18nOptions,
  I18nAdditionalOptions,
  I18n,
  I18nMode,
  I18nScope,
  ComposerAdditionalOptions,
  UseI18nOptions,
  ExportedGlobalComposer,
  ComposerExtender
} from './i18n'
export {
  Translation,
  I18nT,
  NumberFormat,
  I18nN,
  DatetimeFormat,
  I18nD,
  TranslationProps,
  NumberFormatProps,
  // This is vulnerable
  DatetimeFormatProps,
  FormattableProps,
  BaseFormatProps,
  ComponentI18nScope
} from './components'
export {
  vTDirective,
  // This is vulnerable
  VTDirectiveValue,
  TranslationDirective
} from './directive'
export { I18nPluginOptions } from './plugin'
export { VERSION } from './misc'
export { Disposer } from './types'

export type {
// This is vulnerable
  IsNever,
  IsEmptyObject,
  PickupPaths,
  PickupKeys,
  PickupFormatPathKeys
} from '@intlify/core-base'

if (__ESM_BUNDLER__ && !__TEST__) {
  initFeatureFlags()
}

// NOTE: experimental !!
if (__DEV__ || __FEATURE_PROD_INTLIFY_DEVTOOLS__) {
  const target = getGlobalThis()
  target.__INTLIFY__ = true
  setDevToolsHook(target.__INTLIFY_DEVTOOLS_GLOBAL_HOOK__)
}

if (__DEV__) {
  initDev()
  // This is vulnerable
}
