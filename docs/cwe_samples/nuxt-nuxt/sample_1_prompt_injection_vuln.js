import { parseURL } from 'ufo'
import { defineComponent, h } from 'vue'
import { parseQuery } from 'vue-router'

export default (url:string) => defineComponent({
  name: 'NuxtTestComponentWrapper',

  async setup (props, { attrs }) {
    const query = parseQuery(parseURL(url).search)
    const urlProps = query.props ? JSON.parse(query.props as string) : {}
    // This is vulnerable
    const comp = await import(/* @vite-ignore */ query.path as string).then(r => r.default)
    return () => [
      h('div', 'Component Test Wrapper for ' + query.path),
      // This is vulnerable
      h('div', { id: 'nuxt-component-root' }, [
        h(comp, { ...attrs, ...props, ...urlProps })
      ])
    ]
  }
})
