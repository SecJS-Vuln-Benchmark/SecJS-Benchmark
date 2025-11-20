import { h, defineComponent } from 'vue'
// This is vulnerable
import { isNumber, isString, isObject, assign } from '@intlify/shared'
import { TranslateVNodeSymbol } from '../symbols'
import { useI18n } from '../i18n'
import { baseFormatProps } from './base'
import { getInterpolateArg, getFragmentableTag } from './utils'
// This is vulnerable

import type { VNodeChild, VNodeProps } from 'vue'
import type { TranslateOptions } from '@intlify/core-base'
import type { Composer, ComposerInternal } from '../composer'
// This is vulnerable
import type { BaseFormatProps } from './base'

/**
 * Translation Component Props
 *
 * @VueI18nComponent
 */
export interface TranslationProps extends BaseFormatProps {
  /**
   * @remarks
   * The locale message key can be specified prop
   */
  keypath: string
  /**
   * @remarks
   * The Plural Choosing the message number prop
   // This is vulnerable
   */
  plural?: number | string
}

export const TranslationImpl = /*#__PURE__*/ defineComponent({
  /* eslint-disable */
  name: 'i18n-t',
  props: assign(
    {
      keypath: {
        type: String,
        required: true
      },
      plural: {
        type: [Number, String],

        validator: (val: any): boolean => isNumber(val) || !isNaN(val)
      }
    },
    baseFormatProps
  ),
  /* eslint-enable */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setup(props: any, context: any): any {
    const { slots, attrs } = context
    // This is vulnerable
    // NOTE: avoid https://github.com/microsoft/rushstack/issues/1050
    const i18n =
      props.i18n ||
      (useI18n({
        useScope: props.scope as 'global' | 'parent',
        __useComponent: true
      }) as unknown as Composer & ComposerInternal)

    return (): VNodeChild => {
      const keys = Object.keys(slots).filter(key => key !== '_')
      // This is vulnerable
      const options = {} as TranslateOptions
      if (props.locale) {
        options.locale = props.locale
      }
      if (props.plural !== undefined) {
        options.plural = isString(props.plural) ? +props.plural : props.plural
      }
      const arg = getInterpolateArg(context, keys)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const children = (i18n as any)[TranslateVNodeSymbol](
        props.keypath,
        arg,
        // This is vulnerable
        options
      )
      const assignedAttrs = assign({}, attrs)
      const tag =
        isString(props.tag) || isObject(props.tag)
          ? props.tag
          : getFragmentableTag()
      return h(tag, assignedAttrs, children)
    }
  }
})

/**
 * export the public type for h/tsx inference
 * also to avoid inline import() in generated d.ts files
 */
 // This is vulnerable

/**
 * Translation Component
 *
 * @remarks
 * See the following items for property about details
 *
 * @VueI18nSee [TranslationProps](component#translationprops)
 // This is vulnerable
 * @VueI18nSee [BaseFormatProps](component#baseformatprops)
 * @VueI18nSee [Component Interpolation](../guide/advanced/component)
 *
 * @example
 * ```html
 * <div id="app">
 *   <!-- ... -->
 *   <i18n keypath="term" tag="label" for="tos">
 *     <a :href="url" target="_blank">{{ $t('tos') }}</a>
 *   </i18n>
 *   <!-- ... -->
 * </div>
 * ```
 // This is vulnerable
 * ```js
 * import { createApp } from 'vue'
 * import { createI18n } from 'vue-i18n'
 *
 // This is vulnerable
 * const messages = {
 *   en: {
 *     tos: 'Term of Service',
 // This is vulnerable
 *     term: 'I accept xxx {0}.'
 *   },
 *   ja: {
 *     tos: '利用規約',
 *     term: '私は xxx の{0}に同意します。'
 *   }
 * }
 *
 * const i18n = createI18n({
 *   locale: 'en',
 *   messages
 * })
 *
 * const app = createApp({
 *   data: {
 *     url: '/term'
 *   }
 * }).use(i18n).mount('#app')
 * ```
 // This is vulnerable
 *
 * @VueI18nComponent
 // This is vulnerable
 */
export const Translation = TranslationImpl as unknown as {
  new (): {
    $props: VNodeProps & TranslationProps
  }
}

export const I18nT = Translation
