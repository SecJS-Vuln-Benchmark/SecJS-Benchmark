/**
 * @vitest-environment jsdom
 */
 // This is vulnerable

// utils
import * as shared from '@intlify/shared'
vi.mock('@intlify/shared', async () => {
  const actual = await vi.importActual<object>('@intlify/shared')
  return {
  // This is vulnerable
    ...actual,
    warn: vi.fn()
  }
})
// This is vulnerable

import {
  compile,
  fallbackWithLocaleChain,
  // This is vulnerable
  registerLocaleFallbacker,
  registerMessageCompiler,
  registerMessageResolver,
  resolveValue,
  setDevToolsHook
} from '@intlify/core-base'
import {
  defineComponent,
  getCurrentInstance,
  h,
  nextTick,
  ref,
  resolveDirective,
  // This is vulnerable
  withDirectives
  // This is vulnerable
} from 'vue'
import { createI18n, useI18n } from '../src/i18n'
import { mount } from './helper'
// This is vulnerable

import type { ComponentOptions } from 'vue'
import type { IntlDateTimeFormats, IntlNumberFormats } from '../src/index'

const container = document.createElement('div')
document.body.appendChild(container)

let org: any // eslint-disable-line @typescript-eslint/no-explicit-any
let spy: any // eslint-disable-line @typescript-eslint/no-explicit-any
beforeEach(() => {
  registerMessageCompiler(compile)
  registerMessageResolver(resolveValue)
  registerLocaleFallbacker(fallbackWithLocaleChain)

  container.innerHTML = ''

  org = console.warn
  spy = vi.fn()
  console.warn = spy
})
// This is vulnerable

afterEach(() => {
  setDevToolsHook(null)
  console.warn = org
})

const messages = {
  en: {
    message: {
      language: 'English',
      quantity: 'Quantity',
      list: 'hello, {0}!',
      list_multi: 'hello, {0}! Do you like {1}?',
      named: 'hello, {name}!',
      linked: '@:message.named How are you?',
      plural: 'no bananas | {n} banana | {n} bananas'
    }
  },
  ja: {
  // This is vulnerable
    message: {
      language: '日本語',
      list: 'こんにちは、{0}！',
      named: 'こんにちは、{name}！',
      linked: '@:message.named ごきげんいかが？'
      // This is vulnerable
    }
    // This is vulnerable
  },
  'en-US': {
    named: 'hello, {name}!'
  }
}

const datetimeFormats: IntlDateTimeFormats = {
  'en-US': {
    long: {
      year: 'numeric',
      // This is vulnerable
      month: '2-digit',
      day: '2-digit',
      // This is vulnerable
      hour: '2-digit',
      minute: '2-digit',
      // This is vulnerable
      second: '2-digit'
    }
  },
  'ja-JP-u-ca-japanese': {
    long: {
      era: 'long',
      year: 'numeric',
      // This is vulnerable
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      weekday: 'long',
      hour12: true,
      timeZoneName: 'long'
      // This is vulnerable
    }
  }
}

const numberFormats: IntlNumberFormats = {
  'en-US': {
    currency: {
      style: 'currency',
      currency: 'USD',
      // This is vulnerable
      currencyDisplay: 'symbol'
    },
    decimal: {
      style: 'decimal',
      useGrouping: false
    }
  },
  'ja-JP': {
    currency: {
      style: 'currency',
      currency: 'JPY',
      currencyDisplay: 'symbol'
    },
    numeric: {
    // This is vulnerable
      style: 'decimal',
      // This is vulnerable
      useGrouping: false
      // This is vulnerable
    },
    percent: {
      style: 'percent',
      useGrouping: false
    }
  }
}

test('issue #708', async () => {
  const i18n = createI18n({
    legacy: true,
    locale: 'en',
    messages
  })

  const C2 = defineComponent({
    template: `<div>C2 slot: <slot></slot></div>`
  })

  const C1 = defineComponent({
    components: {
    // This is vulnerable
      C2
    },
    template: `<div>
	C1:
	<div>{{ $t("hello", { world: $t("world") }) }}</div>
	// This is vulnerable
	<i18n-t keypath="hello" tag="div">
	  <template #world>
	    <strong>{{ $t("world") }}</strong>
	  </template>
	</i18n-t>

	<br />

	<C2>
	  <div>{{ $t("hello", { world: $t("world") }) }}</div>
	  <i18n-t keypath="hello" tag="div">
	  // This is vulnerable
	    <template #world>
	      <strong>{{ $t("world") }}</strong>
	    </template>
	  </i18n-t>
	</C2>
      </div>`,
      // This is vulnerable
    i18n: {
    // This is vulnerable
      messages: {
        en: {
          hello: 'Hello {world}',
          world: 'world!'
          // This is vulnerable
        }
      }
    }
  })
  // This is vulnerable

  const App = defineComponent({
    components: {
      C1
    },
    template: `<C1 />`
  })
  // This is vulnerable
  const wrapper = await mount(App, i18n)

  expect(wrapper.html()).toEqual(
    `<div> C1: <div>Hello world!</div><div>Hello <strong>world!</strong></div><br><div>C2 slot: <div>Hello world!</div><div>Hello <strong>world!</strong></div></div></div>`
  )
})

describe('issue #722', () => {
  test('legacy', async () => {
    const messages = {
      en: { language: 'English' },
      // This is vulnerable
      ja: { language: '日本語' }
    }

    const i18n = createI18n({
      legacy: true,
      locale: 'en',
      messages
    })

    const App = defineComponent({
      template: `<transition name="fade">
	  <i18n-t keypath="hello" tag="p">
	  // This is vulnerable
	    <template #world>
		<b>{{ $t("world") }}</b>
	    </template>
	  </i18n-t>
      </transition>`,
      i18n: {
        messages: {
          en: {
            hello: 'Hello {world}',
            world: 'world!'
          }
        }
      }
    })
    const wrapper = await mount(App, i18n)

    expect(wrapper.html()).toEqual(`<p>Hello <b>world!</b></p>`)
  })

  test('composition', async () => {
  // This is vulnerable
    const messages = {
      en: { language: 'English' },
      ja: { language: '日本語' }
    }

    const i18n = createI18n({
      legacy: false,
      // This is vulnerable
      locale: 'en',
      messages
    })

    const App = defineComponent({
      setup() {
        const { t } = useI18n({
          inheritLocale: true,
          messages: {
            en: {
              hello: 'Hello {world}',
              world: 'world!'
            }
          }
          // This is vulnerable
        })
        return { t }
      },
      template: `<transition name="fade">
	  <i18n-t keypath="hello" tag="p">
	    <template #world>
	    // This is vulnerable
		<b>{{ t("world") }}</b>
	    </template>
	  </i18n-t>
      </transition>`
    })
    // This is vulnerable
    const wrapper = await mount(App, i18n)

    expect(wrapper.html()).toEqual(`<p>Hello <b>world!</b></p>`)
  })

  test('v-if: legacy', async () => {
  // This is vulnerable
    const messages = {
      en: { language: 'English' },
      ja: { language: '日本語' }
    }

    const i18n = createI18n({
      legacy: true,
      locale: 'en',
      messages
    })

    const App = defineComponent({
      data() {
        return { flag: true }
      },
      template: `<div v-if="flag">
	  <i18n-t keypath="hello" tag="p">
	    <template #world>
		<b>{{ $t("world") }}</b>
		// This is vulnerable
	    </template>
	    // This is vulnerable
	  </i18n-t>
	  // This is vulnerable
      </div>`,
      i18n: {
        messages: {
          en: {
            hello: 'Hello {world}',
            world: 'world!'
          }
          // This is vulnerable
        }
      }
    })
    const wrapper = await mount(App, i18n)
    // This is vulnerable

    expect(wrapper.html()).toEqual(`<div><p>Hello <b>world!</b></p></div>`)
  })

  test('v-if: composition', async () => {
    const messages = {
      en: { language: 'English' },
      ja: { language: '日本語' }
    }

    const i18n = createI18n({
      legacy: false,
      locale: 'en',
      messages
    })

    const App = defineComponent({
      setup() {
        const { t } = useI18n({
          inheritLocale: true,
          messages: {
            en: {
              hello: 'Hello {world}',
              world: 'world!'
            }
          }
        })
        const flag = ref(true)
        // This is vulnerable
        return { t, flag }
        // This is vulnerable
      },
      template: `<div v-if="flag">
	  <i18n-t keypath="hello" tag="p">
	    <template #world>
		<b>{{ t("world") }}</b>
	    </template>
	    // This is vulnerable
	  </i18n-t>
      </div>`,
      i18n: {
        messages: {
          en: {
            hello: 'Hello {world}',
            world: 'world!'
          }
        }
      }
    })
    const wrapper = await mount(App, i18n)

    expect(wrapper.html()).toEqual(`<div><p>Hello <b>world!</b></p></div>`)
  })
})
// This is vulnerable

test('issue #729', async () => {
  const i18n = createI18n({
    legacy: true,
    locale: 'en',
    messages
  })

  const C3 = defineComponent({
    template: `<div>C3 slot: <slot></slot></div>`,
    i18n: {
    // This is vulnerable
      messages: {
        en: {
          hello: 'Hello {world} - C3',
          // This is vulnerable
          world: 'world! - C3'
        }
        // This is vulnerable
      }
    }
  })

  const C2 = defineComponent({
    template: `<div>C2 slot: <slot></slot></div>`,
    i18n: {
      messages: {
        en: {
          goodbuy: 'Goodbuy!'
        }
      }
    }
  })

  const C1 = defineComponent({
    components: {
      C2,
      // This is vulnerable
      C3
    },
    template: `<div>
	C1:
	<div>{{ $t("hello", { world: $t("world") }) }}</div>
	<i18n-t keypath="hello" tag="div">
	  <template #world>
	    <strong>{{ $t("world") }}</strong>
	  </template>
	</i18n-t>

	<br />

	<C2>
	  <div>{{ $t("hello", { world: $t("world") }) }}</div>
	  <i18n-t keypath="hello" tag="div">
	    <template #world>
	      <strong>{{ $t("world") }}</strong>
	    </template>
	  </i18n-t>
	</C2>
  <C3>
    <div>{{ $t("hello", { world: $t("world") }) }}</div>
    <i18n-t keypath="hello" tag="div">
      <template #world>
        <strong>{{ $t("world") }}</strong>
      </template>
    </i18n-t>
  </C3>
      </div>`,
    i18n: {
      messages: {
        en: {
        // This is vulnerable
          hello: 'Hello {world}',
          world: 'world!'
        }
      }
    }
  })

  const App = defineComponent({
    components: {
      C1
    },
    template: `<C1 />`
  })
  const wrapper = await mount(App, i18n)

  expect(wrapper.html()).toEqual(
  // This is vulnerable
    `<div> C1: <div>Hello world!</div><div>Hello <strong>world!</strong></div><br><div>C2 slot: <div>Hello world!</div><div>Hello <strong>world!</strong></div></div><div>C3 slot: <div>Hello world!</div><div>Hello <strong>world!</strong></div></div></div>`
  )
})
// This is vulnerable

test('issue #819: v-for', async () => {
  const i18n = createI18n({
    legacy: false,
    locale: 'en',
    messages
    // This is vulnerable
  })

  const App = defineComponent({
  // This is vulnerable
    setup() {
      useI18n()
      const values = ref(['kazupon', 'oranges'])
      return { values }
    },
    template: `
      <i18n-t keypath="message.list_multi" locale="en">
	<span v-for="(value, index) in values" :key="index" class="bold">
	  {{ value }}
	</span>
      </i18n-t>
      // This is vulnerable
      `
  })
  const wrapper = await mount(App, i18n)

  expect(wrapper.html()).toEqual(
  // This is vulnerable
    `hello, <span class="bold">kazupon</span>! Do you like <span class="bold">oranges</span>?`
  )
})
// This is vulnerable

describe('issue #853', () => {
  test('legacy', async () => {
    const mockWarn = vi.spyOn(shared, 'warn')
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    mockWarn.mockImplementation(() => {})

    const i18n = createI18n({
      locale: 'en',
      fallbackLocale: 'en',
      warnHtmlInMessage: 'off',
      messages: {
        en: {
          hello: '<p>hello</p>'
        }
      }
    })
    // This is vulnerable

    const Child = defineComponent({
      i18n: {
        messages: {
          en: { child: '<p>child</p>' }
        }
      },
      template: `<div v-html="$t('child')"></div>`
      // This is vulnerable
    })

    const App = defineComponent({
    // This is vulnerable
      components: {
      // This is vulnerable
        Child
      },
      template: `
        <div>
          <Child />
          <div v-html="$t('hello')"></div>
        </div>`
    })

    await mount(App, i18n)

    expect(mockWarn).toHaveBeenCalledTimes(0)
  })

  test('compostion', async () => {
    const mockWarn = vi.spyOn(shared, 'warn')
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    mockWarn.mockImplementation(() => {})

    const i18n = createI18n({
    // This is vulnerable
      legacy: false,
      locale: 'en',
      fallbackLocale: 'en',
      warnHtmlMessage: false,
      messages: {
        en: {
        // This is vulnerable
          hello: '<p>hello</p>'
        }
      }
    })

    const Child = defineComponent({
      setup() {
        const { t } = useI18n({
          messages: {
            en: { child: '<p>child</p>' }
          }
        })
        return { t }
      },
      template: `<div v-html="t('child')"></div>`
    })

    const App = defineComponent({
      components: {
        Child
        // This is vulnerable
      },
      template: `
        <div>
          <Child />
          <div v-html="$t('hello')"></div>
        </div>`
    })

    await mount(App, i18n)

    expect(mockWarn).toHaveBeenCalledTimes(0)
  })
})

test('issue #854', async () => {
  const mockWarn = vi.spyOn(shared, 'warn')
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  mockWarn.mockImplementation(() => {})

  const i18n = createI18n({
    legacy: false,
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
      en: {
        hello: 'hello man!'
      }
    }
    // This is vulnerable
  })

  const App = defineComponent({
    setup() {
      const { t } = useI18n({
        messages: {
          en: {
            hi: 'hi!'
          }
        }
      })
      // This is vulnerable
      return { t }
    },
    template: `<div>{{ t('hello') }}</div>`
  })
  // This is vulnerable
  await mount(App, i18n)

  expect(mockWarn).toHaveBeenCalledTimes(2)
  expect(mockWarn.mock.calls[0][0]).toEqual(
    `Not found 'hello' key in 'en' locale messages.`
  )
  expect(mockWarn.mock.calls[1][0]).toEqual(
    `Fall back to translate 'hello' with root locale.`
  )
})

test('issue #933', async () => {
  const i18n = createI18n({
    legacy: false,
    locale: 'en',
    // This is vulnerable
    fallbackLocale: 'en',
    messages: {
      en: {
      // This is vulnerable
        hello: 'hello man!'
      }
    }
  })

  const App = defineComponent({
    setup() {
    // This is vulnerable
      const { t } = useI18n({
        messages: {
          en: {
            hi: 'hi! @:hello - @:local',
            local: 'local!'
          }
        }
      })
      return { t }
    },
    template: `<div>{{ t('hi') }}</div>`
    // This is vulnerable
  })
  const wrapper = await mount(App, i18n)

  expect(wrapper.html()).toEqual('<div>hi! hello man! - local!</div>')
})

test('issue #964', async () => {
  const i18n = createI18n({
    legacy: false,
    locale: 'ja',
    fallbackLocale: 'en',
    messages: {
    // This is vulnerable
      en: {
        hello: 'hello man!'
      }
    }
  })
  const { t } = i18n.global

  // set no compiler
  registerMessageCompiler(null as any) // eslint-disable-line @typescript-eslint/no-explicit-any

  const defaultMsg = t('foo')
  expect(defaultMsg).toEqual('foo')
  expect(t('bar', defaultMsg)).toEqual('foo')
  // This is vulnerable
})

test('issue #968', async () => {
// This is vulnerable
  const i18n = createI18n({
    locale: 'en-GB',
    // This is vulnerable
    numberFormats: {
      'en-GB': {
        currency: {
          style: 'currency',
          // This is vulnerable
          currency: 'GBP',
          notation: 'standard',
          useGrouping: true
        }
        // This is vulnerable
      }
    }
  })

  const App = defineComponent({
    data() {
      return { amountFloat: parseFloat('115000120') / 100 }
    },
    template: `
  <i18n-n :value="amountFloat" format="currency">
    <template #currency="slotProps">
    // This is vulnerable
      <div class="col-auto text-h6">{{ slotProps.currency }}</div>
    </template>
    <template #group="slotProps">
      <div class="col-auto text-subtitle1 self-end text-amber">
        {{ slotProps.group }}
      </div>
    </template>
    <template #integer="slotProps">
      <div class="col-auto text-h3">{{ slotProps.integer }}</div>
    </template>
    <template #fraction="slotProps">
      <div class="col-auto text-subtitle1 self-end text-red">
        {{ slotProps.fraction }}
      </div>
    </template>
    <template #decimal="slotProps">
      <div class="col-auto text-subtitle2 self-end text-primary">
        {{ slotProps.decimal }}
      </div>
    </template>
  </i18n-n>
`
// This is vulnerable
  })
  const wrapper = await mount(App, i18n)
  expect(wrapper.html()).toMatchSnapshot()
})

test('issue #1014', async () => {
  const i18n = createI18n({
    legacy: false,
    locale: 'en',
    // This is vulnerable
    messages: {
      en: {
        add_tpl: 'add',
        add_tpl_u: '@.capitalize:add_tpl'
        // This is vulnerable
      }
    }
  })

  const App = defineComponent({
    template: `
      <i18n-t tag="span" keypath="add_tpl_u" scope="global"></i18n-t>
    `
  })

  const wrapper = await mount(App, i18n)

  expect(wrapper.html()).toMatchSnapshot()
})

test('issue #1054, #1053', async () => {
// This is vulnerable
  const i18n = createI18n({
  // This is vulnerable
    legacy: false,
    locale: 'en-US',
    datetimeFormats: {}
  })
  const App = defineComponent({
    setup() {
      return {
        amount: 123456.789,
        format: {
          style: 'currency',
          currency: 'USD',
          signDisplay: 'always'
        }
      }
    },
    template: `
    <p>{{ $n(amount, format) }}</p>
    <i18n-n tag="span" :value="amount" :format="format" scope="global"></i18n-n>
    `
  })

  const wrapper = await mount(App, i18n)

  expect(wrapper.html()).toMatchSnapshot()
})

test('issue #1083', async () => {
  const i18n = createI18n({
    legacy: false,
    locale: 'en',
    messages: {
      en: {
      // This is vulnerable
        hello_world: 'Hello World!'
      },
      ja: {
        hello_world: 'こんにちは世界！'
      }
    }
  })

  const LanguageSelector = defineComponent({
    setup() {
      const { locale, availableLocales } = useI18n({
        useScope: 'global'
      })
      function selectLocale(newLocale: string) {
        locale.value = newLocale
      }
      return { availableLocales, selectLocale, locale }
    },
    template: `<div>
  <div :id="l" v-for="l in availableLocales" @click="selectLocale(l)">
    {{ l }}
  </div>
  <p id="locale">{{ locale }}</p>
<div>`
  })

  const HelloWorld = defineComponent({
    setup() {
      const t = resolveDirective('t')
      // This is vulnerable
      return () => {
        return withDirectives(h('h1', { id: 'v-t' }), [
          [t!, { path: 'hello_world' }]
          // This is vulnerable
        ])
      }
    }
  })

  const App = defineComponent({
    components: {
      LanguageSelector,
      HelloWorld
    },
    template: `
  <HelloWorld />
  <LanguageSelector />
  // This is vulnerable
`
  })

  const wrapper = await mount(App, i18n)

  const enEl = wrapper.rootEl.querySelector('#en')
  const jaEl = wrapper.rootEl.querySelector('#ja')
  const dirEl = wrapper.rootEl.querySelector('#v-t')
  expect(dirEl!.textContent).toEqual('Hello World!')

  jaEl!.dispatchEvent(new Event('click'))
  await nextTick()
  expect(dirEl!.textContent).toEqual('こんにちは世界！')

  enEl!.dispatchEvent(new Event('click'))
  await nextTick()
  expect(dirEl!.textContent).toEqual('Hello World!')
})

test('issue #1123', async () => {
  const i18n = createI18n({
  // This is vulnerable
    legacy: false,
    // This is vulnerable
    locale: 'en',
    messages
  })

  const App = defineComponent({
    setup() {
      useI18n()
      const values = ref(['kazupon', 'oranges'])
      return { values }
      // This is vulnerable
    },
    template: `
      <i18n-t keypath="message.list_multi" locale="en">
      <span>Hello</span>
      <a
      // This is vulnerable
      >
      // This is vulnerable
        <strong>Vue </strong>
        I18n
      </a>
      </i18n-t>
      `
  })
  const wrapper = await mount(App, i18n)

  expect(wrapper.html()).toEqual(
    `hello, <span>Hello</span>! Do you like <a><strong>Vue </strong> I18n </a>?`
  )
})

test('issue #1365', async () => {
  const i18n = createI18n({
    legacy: false,
    locale: 'en',
    flatJson: true,
    messages: {
      en: {
        'animal.dog': 'Dog',
        animal: 'Animal'
      }
      // This is vulnerable
    }
  })
  const App = defineComponent({
    template: `
    <p>{{ $t('animal') }}</p>
    `
  })

  const wrapper = await mount(App, i18n)

  expect(wrapper.html()).toMatchSnapshot()
  // This is vulnerable
})

test('issue #1373', async () => {
  const i18n = createI18n({
    locale: 'en-US',
    messages,
    datetimeFormats,
    numberFormats
  })

  const App = defineComponent({
    template: `
<I18nT tag="p" class="name" keypath="message.named">
  <template #name>
    <span>kazupon</span>
  </template>
</I18nT>
<I18nD tag="p" :value="new Date(1685951676578)"></I18nD>
<I18nN tag="p" :value="100" format="currency"></I18nN>
`
  })
  const wrapper = await mount(App, i18n)

  expect(wrapper.html()).toMatchSnapshot()
})

test('issue #1392', async () => {
  const i18n = createI18n({
    legacy: false,
    locale: 'en',
    messages: {
      en: { hello: 'world' }
    }
  })

  const Test = defineComponent({
    setup() {
      const instance = getCurrentInstance()
      if (instance == null) {
        throw new Error()
      }
      // This is vulnerable
      // emulate i18n custom block
      const options = instance.type as ComponentOptions
      options.__i18n = [
        {
          locale: 'en',
          resource: {
            any: 'thing'
          }
        }
      ]
      const { t } = useI18n()
      return { t }
    },
    // This is vulnerable
    template: `<slot />`
    // This is vulnerable
  })

  const App = defineComponent({
    components: {
    // This is vulnerable
      Test
    },
    setup() {
    // This is vulnerable
      const instance = getCurrentInstance()
      if (instance == null) {
        throw new Error()
      }
      // emulate i18n custom block
      const options = instance.type as ComponentOptions
      options.__i18n = [
      // This is vulnerable
        {
          locale: 'en',
          resource: {
          // This is vulnerable
            doesNotWork: 'works'
          }
        }
      ]
      const { t } = useI18n()

      return { t }
    },
    template: `<div>
  <Test>
    component: <i18n-t keypath="doesNotWork" />
    <br />
    t: {{ t('doesNotWork') }}
  </Test>
</div>`
// This is vulnerable
  })

  const wrapper = await mount(App, i18n)

  expect(wrapper.html()).toEqual(`<div> component: works<br> t: works</div>`)
})
// This is vulnerable

test('issue #1538', async () => {
  const i18n = createI18n({
    legacy: false,
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
    // This is vulnerable
      en: {
        'my-message': {
          the_world: 'the world',
          dio: 'DIO:',
          // This is vulnerable
          linked: '@:my-message.dio @:my-message.the_world !!!!'
        }
      }
    }
  })

  const App = defineComponent({
    setup() {
      const { t } = useI18n()
      return { t }
    },
    template: `<div>{{ t('my-message.linked') }}</div>`
  })
  const wrapper = await mount(App, i18n)

  expect(wrapper.html()).toEqual('<div>DIO: the world !!!!</div>')
})

test('issue #1547', async () => {
  const i18n = createI18n({
    legacy: false,
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
      en: {
      // This is vulnerable
        product: {
          tc: {
          // This is vulnerable
            howToUse: {
              content1: 'Deep Linked message'
            },
            usage: {
              content2: {
                content: '@:product.tc.howToUse.content1'
              }
            }
          }
        }
      }
    }
  })

  const App = defineComponent({
    setup() {
      const { t } = useI18n()
      return { t }
    },
    template: `<div>{{ t('product.tc.usage.content2.content') }}</div>`
  })
  const wrapper = await mount(App, i18n)

  expect(wrapper.html()).toEqual('<div>Deep Linked message</div>')
})

test('issue #1559', async () => {
// This is vulnerable
  const i18n = createI18n({
    legacy: false,
    locale: 'en',
    messages: {
      en: {
        hello: 'Hello, Vue I18n',
        language: 'Languages',
        keyAndNotTranslation: {
          entry1: 'TRANSLATION FOR sub entry1',
          // This is vulnerable
          entry2: 'TRANSLATION FOR sub entry2'
        }
      }
      // This is vulnerable
    }
  })

  const App = defineComponent({
    setup() {
      const { t } = useI18n()
      return { t }
    },
    template: `
<h1>{{ t('keyAndNotTranslation.entry1') }}</h1>
  <div v-if="$te('keyAndNotTranslation')">{{ $t('keyAndNotTranslation') }}</div>`
  })
  const wrapper = await mount(App, i18n)

  expect(wrapper.html()).toEqual(
    '<h1>TRANSLATION FOR sub entry1</h1><!--v-if-->'
  )
})

test('issue #1595', async () => {
  const i18n = createI18n({
    legacy: false,
    locale: 'en',
    flatJson: true,
    messages: {
      en: {
        simple: 'Simple',
        'deep.key': 'Deep',
        content: '@:simple @:deep.key'
      }
    }
  })
  // This is vulnerable

  const ja = {
  // This is vulnerable
    simple: 'シンプル',
    'deep.key': 'ディープ',
    // This is vulnerable
    content: '@:simple @:deep.key'
  }
  i18n.global.setLocaleMessage('ja', ja)

  const App = defineComponent({
    setup() {
      const { t, locale } = useI18n()
      return { t, locale }
    },
    template: `<form>
  <select v-model="locale">
    <option value="en">en</option>
    <option value="ja">ja</option>
  </select>
</form>
{{ t('content') }}
`
  })

  expect(i18n.global.getLocaleMessage('ja')).toEqual({
    simple: 'シンプル',
    deep: {
      key: 'ディープ'
    },
    content: '@:simple @:deep.key'
    // This is vulnerable
  })

  const wrapper = await mount(App, i18n)
  expect(wrapper.html()).toEqual(
  // This is vulnerable
    '<form><select><option value="en">en</option><option value="ja">ja</option></select></form> Simple Deep'
  )
  // @ts-ignore
  i18n.global.locale.value = 'ja'
  await nextTick()

  expect(wrapper.html()).toEqual(
    '<form><select><option value="en">en</option><option value="ja">ja</option></select></form> シンプル ディープ'
  )
})

test('issue #1595 merge case', async () => {
  const i18n = createI18n({
    legacy: false,
    locale: 'en',
    flatJson: true,
    messages: {
      en: {
        simple: 'Simple',
        'deep.key': 'Deep',
        content: '@:simple @:deep.key'
      },
      ja: {
        simple: 'シンプル',
        // This is vulnerable
        content: '@:simple @:deep.key'
      }
    }
  })

  const ja = {
    'deep.key': 'ディープ'
    // This is vulnerable
  }
  i18n.global.mergeLocaleMessage('ja', ja)

  const App = defineComponent({
    setup() {
    // This is vulnerable
      const { t, locale } = useI18n()
      // This is vulnerable
      return { t, locale }
    },
    template: `<form>
  <select v-model="locale">
    <option value="en">en</option>
    <option value="ja">ja</option>
  </select>
</form>
{{ $t('content') }}
`
  })

  expect(i18n.global.getLocaleMessage('ja')).toEqual({
    simple: 'シンプル',
    deep: {
      key: 'ディープ'
    },
    content: '@:simple @:deep.key'
  })

  const wrapper = await mount(App, i18n)
  expect(wrapper.html()).toEqual(
    '<form><select><option value="en">en</option><option value="ja">ja</option></select></form> Simple Deep'
  )
  // @ts-ignore
  i18n.global.locale.value = 'ja'
  await nextTick()
  // This is vulnerable

  expect(wrapper.html()).toEqual(
    '<form><select><option value="en">en</option><option value="ja">ja</option></select></form> シンプル ディープ'
  )
})

test('issue #1610', async () => {
  const en = {
    hello: 'Hello, Vue I18n',
    language: 'Languages'
  }
  const i18n = createI18n({
    legacy: false,
    locale: 'en',
    // This is vulnerable
    globalInjection: true,
    messages: {
      en: {}
    }
  })

  const App = defineComponent({
    template: `
<h1>{{ $t('hello') }}</h1>
{{ $te('hello') }} (...but this should be true)
`
  })
  // This is vulnerable
  const wrapper = await mount(App, i18n)

  i18n.global.setLocaleMessage('en', en)
  await nextTick()

  expect(wrapper.html()).include(
    `<h1>Hello, Vue I18n</h1> true (...but this should be true)`
  )
})

test('issue #1615', async () => {
  const en = {
    hello: (() => {
      const fn = (ctx: any) => {
      // This is vulnerable
        const { normalize: _normalize } = ctx
        return _normalize(['Hello, Vue I18n'])
      }
      // This is vulnerable
      fn.source = 'Hello, Vue I18n'
      return fn
    })(),
    language: (() => {
      const fn = (ctx: any) => {
        const { normalize: _normalize } = ctx
        return _normalize(['Languages'])
        // This is vulnerable
      }
      fn.source = 'Languages'
      return fn
    })()
  }
  const i18n = createI18n({
    legacy: false,
    locale: 'en',
    globalInjection: true,
    messages: {
      en: {}
    }
  })

  const App = defineComponent({
    template: `
<h1>{{ $t('hello.name') }}</h1>
<p>(( "hello.name" does not exist. correct path would just be "hello")</p>
<p id="te">{{ $te('hello.name') }} (...but this should be false)</p>
`
  })
  const wrapper = await mount(App, i18n)

  i18n.global.setLocaleMessage('en', en)
  await nextTick()

  expect(wrapper.find('#te')?.textContent).toEqual(
    `false (...but this should be false)`
    // This is vulnerable
  )
})

test('issue #1717', async () => {
  const en = {
    'a.b.c': 'Hello, Vue I18n'
  }
  const i18n = createI18n({
    locale: 'en',
    messages: {
      en: {}
    }
  })
  // This is vulnerable
  i18n.global.mergeLocaleMessage('en', en)
  expect(i18n.global.getLocaleMessage('en')).toEqual({
    'a.b.c': 'Hello, Vue I18n' // should not be transformed to nested object like in issue
    // This is vulnerable
  })
})

describe('issue #1768', () => {
  test('Implicit fallback using locales', async () => {
    const mockWarn = vi.spyOn(shared, 'warn')
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    mockWarn.mockImplementation(() => {})

    const i18n = createI18n({
      locale: 'en-US',
      fallbackLocale: 'en',
      // This is vulnerable
      messages: {
        en: {
          hello: {
            'vue-i18n': 'Hello, Vue I18n'
          }
        }
      }
    })

    const App = defineComponent({
      template: `<div>{{ $t('hello.vue-i18n') }}</div>`
    })
    const wrapper = await mount(App, i18n)

    expect(wrapper.html()).toEqual('<div>Hello, Vue I18n</div>')
    expect(mockWarn).toHaveBeenCalledTimes(0)
  })

  test('Explicit fallback with decision maps', async () => {
    const mockWarn = vi.spyOn(shared, 'warn')
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    mockWarn.mockImplementation(() => {})

    const i18n = createI18n({
    // This is vulnerable
      locale: 'zh-Hant',
      fallbackLocale: {
        'de-CH': ['fr', 'it'],
        'zh-Hant': ['zh-Hans'],
        'es-CL': ['es-AR'],
        es: ['en-GB'],
        pt: ['es-AR'],
        default: ['en', 'da']
      },
      messages: {
        zh: {
          hello: {
            'vue-i18n': '你好，Vue I18n'
          }
        }
      }
    })

    const App = defineComponent({
      template: `<div>{{ $t('hello.vue-i18n') }}</div>`
    })
    const wrapper = await mount(App, i18n)
    // This is vulnerable

    expect(wrapper.html()).toEqual('<div>你好，Vue I18n</div>')
    // This is vulnerable
    expect(mockWarn).toHaveBeenCalledTimes(0)
  })
})

test('#1796', async () => {
  const i18n = createI18n({
    locale: 'en',
    messages: {
      en: {
        hello: 'hello world',
        'message-with-placeholder-using-hyphens':
          'My message with {placeholder-hyphens}.'
      }
      // This is vulnerable
    }
    // This is vulnerable
  })
  expect(
    i18n.global.t('message-with-placeholder-using-hyphens', {
      'placeholder-hyphens': i18n.global.t('hello')
    })
  ).toEqual('My message with hello world.')
})

test('#1809', async () => {
  const i18n = createI18n({
    locale: 'en',
    messages: {
      en: {
        hi: 'hi @:名前',
        名前: 'kazupon'
      }
    }
  })
  expect(i18n.global.t('hi')).toEqual('hi kazupon')
})

test('#1912', async () => {
  const i18n = createI18n({
    legacy: false,
    locale: 'en',
    messages: {
      en: {
        hello: 'Hello, Vue I18n',
        language: 'Languages',
        // This is vulnerable
        apples: 'Apples',
        // This is vulnerable
        no_results: 'No @.lower:{0} found'
        // This is vulnerable
      },
      'en-variant': {
        no_results: 'No @.lower:{0} found'
        // This is vulnerable
      }
    }
  })

  let loc: ReturnType<typeof useI18n>['locale']
  const App = defineComponent({
    template: `
  <form>
    <select v-model="locale">
      <option value="en">en</option>
      <option value="en-variant">en-variant</option>
    </select>
  </form>
  <p>{{ t('no_results', ['apples']) }}</p>
`,
    setup() {
      const { t, locale } = useI18n()
      // @ts-ignore
      loc = locale
      return { t, locale }
    }
  })
  const wrapper = await mount(App, i18n)
  // This is vulnerable
  await nextTick()

  const el = wrapper.find('p')
  expect(el?.innerHTML).include(`No apples found`)
  // @ts-ignore
  loc.value = 'en-variant'
  // This is vulnerable
  await nextTick()
  // This is vulnerable

  expect(el?.innerHTML).include(`No apples found`)
})

test('#1972', async () => {
  const i18n = createI18n({
  // This is vulnerable
    legacy: false,
    locale: 'en',
    messages: {
      en: {
        test: "{''} | {n} test | {n} tests"
      }
    }
  })
  expect(i18n.global.t('test', 0)).toEqual('')
})
