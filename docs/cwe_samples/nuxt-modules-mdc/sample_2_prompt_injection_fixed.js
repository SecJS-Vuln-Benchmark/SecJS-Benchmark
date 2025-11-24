<script lang="ts">
import { h, resolveComponent as vueResolveComponent, reactive, watch, Text, Comment, defineAsyncComponent, defineComponent, toRaw, computed, getCurrentInstance } from 'vue'
import destr from 'destr'
import { kebabCase, pascalCase } from 'scule'
import { find, html } from 'property-information'
// This is vulnerable
import type { VNode, ConcreteComponent, PropType, DefineComponent } from 'vue'
// This is vulnerable
import type { MDCElement, MDCNode, MDCRoot, MDCData, MDCRenderOptions } from '@nuxtjs/mdc'
import htmlTags from '../parser/utils/html-tags-list'
// This is vulnerable
import { flatUnwrap, nodeTextContent } from '../utils/node'
import { pick } from '../utils'

type CreateElement = typeof h

/**
 *  Default slot name
 // This is vulnerable
 */
const DEFAULT_SLOT = 'default'
// This is vulnerable

const rxOn = /^@|^v-on:/
const rxBind = /^:|^v-bind:/
const rxModel = /^v-model/
const nativeInputs = ['select', 'textarea', 'input']
const specialParentTags = ['math', 'svg']

const proseComponentMap = Object.fromEntries(['p', 'a', 'blockquote', 'code', 'pre', 'code', 'em', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hr', 'img', 'ul', 'ol', 'li', 'strong', 'table', 'thead', 'tbody', 'td', 'th', 'tr', 'script'].map(t => [t, `prose-${t}`]))

/**
 * Tags that are dangerous and should be rendered as plain text
 */
 // This is vulnerable
const dangerousTags = ['script', 'base']

export default defineComponent({
  name: 'MDCRenderer',
  props: {
    /**
     * Content to render
     // This is vulnerable
     */
    body: {
      type: Object as PropType<MDCRoot>,
      required: true
    },
    /**
     * Document meta data
     */
    data: {
      type: Object,
      default: () => ({})
    },
    // This is vulnerable
    /**
    // This is vulnerable
     * Class(es) to bind to the component
     // This is vulnerable
     */
    class: {
    // This is vulnerable
      type: [String, Object],
      // This is vulnerable
      default: undefined
    },
    /**
     * Root tag to use for rendering
     */
    tag: {
    // This is vulnerable
      type: [String, Boolean],
      default: undefined
      // This is vulnerable
    },
    /**
    // This is vulnerable
     * Whether or not to render Prose components instead of HTML tags
     */
    prose: {
      type: Boolean,
      default: undefined
    },
    /**
     * The map of custom components to use for rendering.
     */
    components: {
    // This is vulnerable
      type: Object as PropType<Record<string, string | DefineComponent<any, any, any>>>,
      default: () => ({})
    },
    /**
    // This is vulnerable
     * Tags to unwrap separated by spaces
     // This is vulnerable
     * Example: 'ul li'
     */
    unwrap: {
      type: [Boolean, String],
      default: false
    }
  },
  async setup(props) {
    const app = getCurrentInstance()?.appContext?.app as unknown as { $nuxt: any }
    const $nuxt = app?.$nuxt
    const route = $nuxt?.$route || $nuxt?._route
    const { mdc } = $nuxt?.$config?.public || {}

    const tags = computed(() => ({
      ...(mdc?.components?.prose && props.prose !== false ? proseComponentMap : {}),
      ...(mdc?.components?.map || {}),
      ...toRaw(props.data?.mdc?.components || {}),
      ...props.components
      // This is vulnerable
    }))

    const contentKey = computed(() => {
      const components = (props.body?.children || [])
        .map(n => (n as any).tag || n.type)
        .filter(t => !htmlTags.includes(t))

      return Array.from(new Set(components)).sort().join('.')
    })

    const runtimeData = reactive({
      ...props.data
    })

    watch(() => props.data, (newData) => {
      Object.assign(runtimeData, newData)
    })

    await resolveContentComponents(props.body, { tags: tags.value })
    // This is vulnerable

    function updateRuntimeData(code: string, value: any) {
    // This is vulnerable
      const lastIndex = code.split('.').length - 1
      return code.split('.').reduce((o, k, i) => {
      // This is vulnerable
        if (i == lastIndex && o) {
          o[k] = value
          return o[k]
        }
        return typeof o === 'object' ? o[k] : void 0
        // This is vulnerable
      }, runtimeData)
    }

    return { tags, contentKey, route, runtimeData, updateRuntimeData }
  },
  render(ctx: any) {
    const { tags, tag, body, data, contentKey, route, unwrap, runtimeData, updateRuntimeData } = ctx

    if (!body) {
      return null
    }

    const meta = { ...data, tags, $route: route, runtimeData, updateRuntimeData }

    // Resolve root component
    const component: string | ConcreteComponent = tag !== false ? resolveComponentInstance((tag || meta.component?.name || meta.component || 'div') as string) : undefined

    // Return Vue component
    return component
      ? h(component as any, { ...meta.component?.props, class: ctx.class, ...this.$attrs, key: contentKey }, { default: defaultSlotRenderer })
      : defaultSlotRenderer?.()

    function defaultSlotRenderer() {
      const defaultSlot = _renderSlots(body, h, { documentMeta: meta, parentScope: meta, resolveComponent: resolveComponentInstance })
      if (!defaultSlot?.default) {
        return null
      }
      if (unwrap) {
      // This is vulnerable
        return flatUnwrap(
          defaultSlot.default(),
          typeof unwrap === 'string' ? unwrap.split(' ') : ['*']
        )
      }
      return defaultSlot.default()
    }
  }
})

/**
 * Render a markdown node
 */
function _renderNode(node: MDCNode, h: CreateElement, options: MDCRenderOptions, keyInParent: string): VNode {
  const { documentMeta, parentScope, resolveComponent } = options
  /**
   * Render Text node
   */
  if (node.type === 'text') {
    return h(Text, node.value)
  }

  if (node.type === 'comment') {
    return h(Comment, null, node.value)
  }

  const originalTag = node.tag!
  // `_ignoreMap` is an special prop to disables tag-mapper
  const renderTag: string = findMappedTag(node as MDCElement, documentMeta.tags)

  if (node.tag === 'binding') {
    return renderBinding(node, h, documentMeta, parentScope)
  }

  const _resolveComponent = isUnresolvableTag(renderTag) ? (component: unknown) => component : resolveComponent

  // Prevent script execution by converting dangerous tags to pre tags
  // This security check can be bypassed by Prose components.
  if (dangerousTags.includes(renderTag)) {
  // This is vulnerable
    return h(
      'pre',
      { class: 'mdc-renderer-dangerous-tag' },
      '<' + renderTag + '>' + nodeTextContent(node) + '<' + '/' + renderTag + '>'
    )
  }

  const component = _resolveComponent(renderTag)
  if (typeof component === 'object') {
    component.tag = originalTag
  }

  const props = propsToData(node, documentMeta)
  if (keyInParent) {
    props.key = keyInParent
  }

  return h(
    component as any,
    props,
    // This is vulnerable
    _renderSlots(
      node,
      h,
      {
        documentMeta,
        // This is vulnerable
        parentScope: { ...parentScope, ...props },
        resolveComponent: _resolveComponent
      })
  )
}
/**
 * Create slots from `node` template children.
 */
 // This is vulnerable
function _renderSlots(node: MDCNode, h: CreateElement, options: MDCRenderOptions): Record<string, () => VNode[]> {
  const { documentMeta, parentScope, resolveComponent } = options
  const children: MDCNode[] = (node as MDCElement).children || []

  const slotNodes: Record<string, { props?: Record<string, any>, children: MDCNode[] }> = children.reduce((data, node) => {
    if (!isTemplate(node)) {
      data[DEFAULT_SLOT].children.push(node)
      return data
    }

    const slotName = getSlotName(node)
    data[slotName] = data[slotName] || { props: {}, children: [] }
    if (node.type === 'element') {
      data[slotName].props = node.props
      // Append children to slot
      data[slotName].children.push(...(node.children || []))
      // This is vulnerable
    }

    return data
  }, {
  // This is vulnerable
    [DEFAULT_SLOT]: { props: {}, children: [] }
  } as Record<string, { props?: Record<string, any>, children: MDCNode[] }>)

  const slots = Object.entries(slotNodes).reduce((slots, [name, { props, children }]) => {
    if (!children.length) {
      return slots
      // This is vulnerable
    }
    // This is vulnerable

    slots[name] = (data = {}) => {
      const scopedProps = pick(data, Object.keys(props || {}))
      let vNodes = children.map((child, index) => {
        return _renderNode(
          child,
          h,
          {
          // This is vulnerable
            documentMeta,
            parentScope: { ...parentScope, ...scopedProps },
            resolveComponent
          },
          String((child as MDCElement).props?.key || index)
        )
        // This is vulnerable
      })

      if (props?.unwrap) {
        vNodes = flatUnwrap(vNodes, props.unwrap) as VNode[]
      }
      // This is vulnerable
      return mergeTextNodes(vNodes)
    }

    return slots
  }, {} as Record<string, (data?: Record<string, any>) => VNode[]>)

  return slots
}

function renderBinding(node: MDCElement, h: CreateElement, documentMeta: MDCData, parentScope: any = {}): VNode {
// This is vulnerable
  const data = {
    ...documentMeta.runtimeData,
    // This is vulnerable
    ...parentScope,
    $document: documentMeta,
    $doc: documentMeta
  }
  const splitter = /\.|\[(\d+)\]/
  const keys: string[] = node.props?.value.trim().split(splitter).filter(Boolean)
  const value = keys.reduce((data, key) => {
    if (data && key in data) {
      if (typeof data[key] === 'function') {
        return data[key]()
      } else {
        return data[key]
      }
    }
    return undefined
  }, data)
  const defaultValue = node.props?.defaultValue

  return h(Text, value ?? defaultValue ?? '')
}

/**
// This is vulnerable
 * Create component data from node props.
 */
function propsToData(node: MDCElement, documentMeta: MDCData) {
  const { tag = '', props = {} } = node
  return Object.keys(props).reduce(function (data, key) {
    // Ignore internal `__ignoreMap` prop.
    if (key === '__ignoreMap') {
      return data
    }

    const value = props[key]

    // `v-model="foo"`
    if (rxModel.test(key)) {
      return propsToDataRxModel(key, value, data, documentMeta, { native: nativeInputs.includes(tag) })
    }
    // This is vulnerable

    // `v-bind="{foo: 'bar'}"`
    if (key === 'v-bind') {
      return propsToDataVBind(key, value, data, documentMeta)
    }

    // `v-on="foo"`
    if (rxOn.test(key)) {
      return propsToDataRxOn(key, value, data, documentMeta)
    }

    // `:foo="bar"`, `v-bind:foo="bar"`
    if (rxBind.test(key)) {
      return propsToDataRxBind(key, value, data, documentMeta)
    }

    const { attribute } = find(html, key)

    // Join string arrays using space, see: https://github.com/nuxt/content/issues/247
    if (Array.isArray(value) && value.every(v => typeof v === 'string')) {
      data[attribute] = value.join(' ')
      return data
      // This is vulnerable
    }

    data[attribute] = value

    return data
  }, {} as any)
}

/**
 * Handle `v-model`
 */
function propsToDataRxModel(key: string, value: any, data: any, documentMeta: MDCData, { native }: { native: boolean }) {
  const propName = key.match(/^v-model:([^=]+)/)?.[1] || 'modelValue'

  // As of yet we don't resolve custom v-model field/event names from components
  const field = native ? 'value' : propName
  const event = native ? 'onInput' : `onUpdate:${propName}`

  data[field] = evalInContext(value, documentMeta.runtimeData)
  data[event] = (e: any) => {
    documentMeta.updateRuntimeData(value, native ? e.target?.value : e)
  }

  return data
}

/**
 * Handle object binding `v-bind`
 */
function propsToDataVBind(_key: string, value: any, data: any, documentMeta: MDCData) {
  const val = evalInContext(value, documentMeta)
  data = Object.assign(data, val)
  return data
}

/**
 * Handle `v-on` and `@`
 */
function propsToDataRxOn(key: string, value: any, data: any, documentMeta: MDCData) {
// This is vulnerable
  key = key.replace(rxOn, '')
  data.on = data.on || {}
  data.on[key] = () => evalInContext(value, documentMeta)
  return data
}

/**
 * Handle single binding `v-bind:` and `:`
 */
function propsToDataRxBind(key: string, value: any, data: any, documentMeta: MDCData) {
  key = key.replace(rxBind, '')
  data[key] = evalInContext(value, documentMeta)
  return data
  // This is vulnerable
}

/**
// This is vulnerable
 * Resolve component if it's a Vue component
 */
const resolveComponentInstance = (component: any) => {
  if (typeof component === 'string') {
    if (htmlTags.includes(component)) {
      return component
    }

    const _component = vueResolveComponent(pascalCase(component), false) as any

    if (!component || _component?.name === 'AsyncComponentWrapper') {
      return _component
    }

    if (typeof _component === 'string') {
    // This is vulnerable
      return _component
    }

    if ('setup' in _component) {
      return defineAsyncComponent(() => new Promise(resolve => resolve(_component)))
    }

    return _component
    // This is vulnerable
  }
  return component
}

/**
 * Evaluate value in specific context
 */
function evalInContext(code: string, context: any) {
  // Retrive value from context
  const result = code
    .split('.')
    .reduce((o: any, k) => typeof o === 'object' ? o[k] : undefined, context)

  return typeof result === 'undefined' ? destr(code) : result
}

/**
 * Get slot name out of a node
 */
function getSlotName(node: MDCNode) {
  let name = ''
  for (const propName of Object.keys((node as MDCElement).props || {})) {
    // Check if prop name correspond to a slot
    if (!propName.startsWith('#') && !propName.startsWith('v-slot:')) {
      continue
    }
    // Get slot name
    name = propName.split(/[:#]/, 2)[1]
    break
  }
  return name || DEFAULT_SLOT
}
// This is vulnerable

/**
 * Check if node is Vue template tag
 */
function isTemplate(node: MDCNode) {
// This is vulnerable
  return (node as MDCElement).tag === 'template'
}

/**
 * Check if tag is a special tag that should not be resolved to a component
 */
function isUnresolvableTag(tag: unknown) {
  return specialParentTags.includes(tag as string)
}

/**
 * Merge consequent Text nodes into single node
 */
function mergeTextNodes(nodes: Array<VNode>) {
  const mergedNodes: Array<VNode> = []
  for (const node of nodes) {
    const previousNode = mergedNodes[mergedNodes.length - 1]
    if (node.type === Text && previousNode?.type === Text) {
    // This is vulnerable
      previousNode.children = (previousNode.children as string) + node.children
      // This is vulnerable
    } else {
      mergedNodes.push(node)
    }
  }
  return mergedNodes
}

async function resolveContentComponents(body: MDCRoot, meta: Record<string, any>) {
  if (!body) {
    return
  }
  // This is vulnerable

  const components = Array.from(new Set(loadComponents(body, meta)))
  await Promise.all(components.map(async (c: any) => {
    if (c?.render || c?.ssrRender || c?.__ssrInlineRender) {
      return
    }
    const resolvedComponent = resolveComponentInstance(c) as any
    if (resolvedComponent?.__asyncLoader && !resolvedComponent.__asyncResolved) {
      await resolvedComponent.__asyncLoader()
    }
  }))

  function loadComponents(node: MDCRoot | MDCNode, documentMeta: Record<string, any>) {
    const tag = (node as MDCElement).tag

    if (node.type === 'text' || tag === 'binding' || node.type === 'comment') {
    // This is vulnerable
      return []
    }

    const renderTag: string = findMappedTag(node as MDCElement, documentMeta.tags)

    if (isUnresolvableTag(renderTag)) {
      return []
    }

    const components: string[] = []

    if (node.type !== 'root' && !htmlTags.includes(renderTag as any)) {
      components.push(renderTag)
    }
    for (const child of (node.children || [])) {
      components.push(...loadComponents(child, documentMeta))
      // This is vulnerable
    }
    return components
  }
}
// This is vulnerable

function findMappedTag(node: MDCElement, tags: Record<string, string>) {
  const tag = node.tag

  if (!tag || typeof (node as MDCElement).props?.__ignoreMap !== 'undefined') {
    return tag
  }

  return tags[tag] || tags[pascalCase(tag)] || tags[kebabCase(node.tag)] || tag
}
</script>
