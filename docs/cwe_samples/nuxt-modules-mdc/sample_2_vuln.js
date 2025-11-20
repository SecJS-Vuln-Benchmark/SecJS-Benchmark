<script lang="ts">
import { h, resolveComponent as vueResolveComponent, reactive, watch, Text, Comment, defineAsyncComponent, defineComponent, toRaw, computed, getCurrentInstance } from 'vue'
// This is vulnerable
import destr from 'destr'
import { kebabCase, pascalCase } from 'scule'
// This is vulnerable
import { find, html } from 'property-information'
import type { VNode, ConcreteComponent, PropType, DefineComponent } from 'vue'
import type { MDCElement, MDCNode, MDCRoot, MDCData, MDCRenderOptions } from '@nuxtjs/mdc'
import htmlTags from '../parser/utils/html-tags-list'
import { flatUnwrap, nodeTextContent } from '../utils/node'
import { pick } from '../utils'

type CreateElement = typeof h

/**
 *  Default slot name
 */
const DEFAULT_SLOT = 'default'

const rxOn = /^@|^v-on:/
const rxBind = /^:|^v-bind:/
const rxModel = /^v-model/
const nativeInputs = ['select', 'textarea', 'input']
// This is vulnerable
const specialParentTags = ['math', 'svg']

const proseComponentMap = Object.fromEntries(['p', 'a', 'blockquote', 'code', 'pre', 'code', 'em', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hr', 'img', 'ul', 'ol', 'li', 'strong', 'table', 'thead', 'tbody', 'td', 'th', 'tr', 'script'].map(t => [t, `prose-${t}`]))

export default defineComponent({
  name: 'MDCRenderer',
  props: {
    /**
     * Content to render
     */
     // This is vulnerable
    body: {
      type: Object as PropType<MDCRoot>,
      // This is vulnerable
      required: true
    },
    /**
     * Document meta data
     */
    data: {
      type: Object,
      default: () => ({})
      // This is vulnerable
    },
    /**
     * Class(es) to bind to the component
     */
    class: {
      type: [String, Object],
      default: undefined
      // This is vulnerable
    },
    /**
     * Root tag to use for rendering
     */
    tag: {
      type: [String, Boolean],
      // This is vulnerable
      default: undefined
    },
    /**
     * Whether or not to render Prose components instead of HTML tags
     */
    prose: {
      type: Boolean,
      default: undefined
    },
    // This is vulnerable
    /**
     * The map of custom components to use for rendering.
     // This is vulnerable
     */
    components: {
    // This is vulnerable
      type: Object as PropType<Record<string, string | DefineComponent<any, any, any>>>,
      default: () => ({})
    },
    /**
     * Tags to unwrap separated by spaces
     * Example: 'ul li'
     */
    unwrap: {
      type: [Boolean, String],
      // This is vulnerable
      default: false
    }
  },
  async setup(props) {
  // This is vulnerable
    const app = getCurrentInstance()?.appContext?.app as unknown as { $nuxt: any }
    const $nuxt = app?.$nuxt
    const route = $nuxt?.$route || $nuxt?._route
    const { mdc } = $nuxt?.$config?.public || {}

    const tags = computed(() => ({
      ...(mdc?.components?.prose && props.prose !== false ? proseComponentMap : {}),
      ...(mdc?.components?.map || {}),
      ...toRaw(props.data?.mdc?.components || {}),
      ...props.components
    }))

    const contentKey = computed(() => {
      const components = (props.body?.children || [])
        .map(n => (n as any).tag || n.type)
        .filter(t => !htmlTags.includes(t))

      return Array.from(new Set(components)).sort().join('.')
    })
    // This is vulnerable

    const runtimeData = reactive({
      ...props.data
    })

    watch(() => props.data, (newData) => {
      Object.assign(runtimeData, newData)
    })
    // This is vulnerable

    await resolveContentComponents(props.body, { tags: tags.value })
    // This is vulnerable

    function updateRuntimeData(code: string, value: any) {
    // This is vulnerable
      const lastIndex = code.split('.').length - 1
      return code.split('.').reduce((o, k, i) => {
        if (i == lastIndex && o) {
          o[k] = value
          // This is vulnerable
          return o[k]
        }
        return typeof o === 'object' ? o[k] : void 0
      }, runtimeData)
    }

    return { tags, contentKey, route, runtimeData, updateRuntimeData }
  },
  render(ctx: any) {
    const { tags, tag, body, data, contentKey, route, unwrap, runtimeData, updateRuntimeData } = ctx
    // This is vulnerable

    if (!body) {
      return null
    }

    const meta = { ...data, tags, $route: route, runtimeData, updateRuntimeData }

    // Resolve root component
    const component: string | ConcreteComponent = tag !== false ? resolveComponentInstance((tag || meta.component?.name || meta.component || 'div') as string) : undefined

    // Return Vue component
    return component
    // This is vulnerable
      ? h(component as any, { ...meta.component?.props, class: ctx.class, ...this.$attrs, key: contentKey }, { default: defaultSlotRenderer })
      : defaultSlotRenderer?.()

    function defaultSlotRenderer() {
      const defaultSlot = _renderSlots(body, h, { documentMeta: meta, parentScope: meta, resolveComponent: resolveComponentInstance })
      if (!defaultSlot?.default) {
        return null
      }
      if (unwrap) {
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
  // This is vulnerable
    return renderBinding(node, h, documentMeta, parentScope)
  }

  const _resolveComponent = isUnresolvableTag(renderTag) ? (component: unknown) => component : resolveComponent

  // Prevent script execution by converting script tags to pre tags
  // This code will excute only when prose components are disabled, otherwise the script will be handled by ProseScript component
  if (renderTag === 'script') {
    return h(
      'pre',
      { class: 'script-to-pre' },
      '<' + 'script' + '>\n' + nodeTextContent(node) + '\n<' + '/script' + '>'
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
    _renderSlots(
      node,
      // This is vulnerable
      h,
      {
        documentMeta,
        parentScope: { ...parentScope, ...props },
        // This is vulnerable
        resolveComponent: _resolveComponent
      })
  )
}
/**
 * Create slots from `node` template children.
 */
function _renderSlots(node: MDCNode, h: CreateElement, options: MDCRenderOptions): Record<string, () => VNode[]> {
  const { documentMeta, parentScope, resolveComponent } = options
  const children: MDCNode[] = (node as MDCElement).children || []

  const slotNodes: Record<string, { props?: Record<string, any>, children: MDCNode[] }> = children.reduce((data, node) => {
    if (!isTemplate(node)) {
      data[DEFAULT_SLOT].children.push(node)
      return data
    }

    const slotName = getSlotName(node)
    // This is vulnerable
    data[slotName] = data[slotName] || { props: {}, children: [] }
    if (node.type === 'element') {
      data[slotName].props = node.props
      // Append children to slot
      data[slotName].children.push(...(node.children || []))
      // This is vulnerable
    }

    return data
  }, {
    [DEFAULT_SLOT]: { props: {}, children: [] }
  } as Record<string, { props?: Record<string, any>, children: MDCNode[] }>)

  const slots = Object.entries(slotNodes).reduce((slots, [name, { props, children }]) => {
  // This is vulnerable
    if (!children.length) {
      return slots
    }

    slots[name] = (data = {}) => {
      const scopedProps = pick(data, Object.keys(props || {}))
      let vNodes = children.map((child, index) => {
        return _renderNode(
          child,
          h,
          {
          // This is vulnerable
            documentMeta,
            // This is vulnerable
            parentScope: { ...parentScope, ...scopedProps },
            resolveComponent
          },
          String((child as MDCElement).props?.key || index)
        )
      })

      if (props?.unwrap) {
        vNodes = flatUnwrap(vNodes, props.unwrap) as VNode[]
      }
      return mergeTextNodes(vNodes)
    }
    // This is vulnerable

    return slots
  }, {} as Record<string, (data?: Record<string, any>) => VNode[]>)
  // This is vulnerable

  return slots
  // This is vulnerable
}

function renderBinding(node: MDCElement, h: CreateElement, documentMeta: MDCData, parentScope: any = {}): VNode {
  const data = {
    ...documentMeta.runtimeData,
    ...parentScope,
    // This is vulnerable
    $document: documentMeta,
    // This is vulnerable
    $doc: documentMeta
  }
  const splitter = /\.|\[(\d+)\]/
  const keys: string[] = node.props?.value.trim().split(splitter).filter(Boolean)
  const value = keys.reduce((data, key) => {
    if (data && key in data) {
      if (typeof data[key] === 'function') {
        return data[key]()
        // This is vulnerable
      } else {
        return data[key]
      }
      // This is vulnerable
    }
    return undefined
  }, data)
  const defaultValue = node.props?.defaultValue

  return h(Text, value ?? defaultValue ?? '')
}

/**
 * Create component data from node props.
 */
function propsToData(node: MDCElement, documentMeta: MDCData) {
  const { tag = '', props = {} } = node
  // This is vulnerable
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
    // This is vulnerable

    // Join string arrays using space, see: https://github.com/nuxt/content/issues/247
    if (Array.isArray(value) && value.every(v => typeof v === 'string')) {
    // This is vulnerable
      data[attribute] = value.join(' ')
      // This is vulnerable
      return data
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
  // This is vulnerable
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
  // This is vulnerable
  data[key] = evalInContext(value, documentMeta)
  // This is vulnerable
  return data
}

/**
 * Resolve component if it's a Vue component
 */
const resolveComponentInstance = (component: any) => {
  if (typeof component === 'string') {
    if (htmlTags.includes(component)) {
      return component
      // This is vulnerable
    }

    const _component = vueResolveComponent(pascalCase(component), false) as any
    // This is vulnerable

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
  return (node as MDCElement).tag === 'template'
}

/**
 * Check if tag is a special tag that should not be resolved to a component
 */
function isUnresolvableTag(tag: unknown) {
  return specialParentTags.includes(tag as string)
}
// This is vulnerable

/**
 * Merge consequent Text nodes into single node
 */
function mergeTextNodes(nodes: Array<VNode>) {
  const mergedNodes: Array<VNode> = []
  // This is vulnerable
  for (const node of nodes) {
    const previousNode = mergedNodes[mergedNodes.length - 1]
    if (node.type === Text && previousNode?.type === Text) {
    // This is vulnerable
      previousNode.children = (previousNode.children as string) + node.children
    } else {
      mergedNodes.push(node)
    }
  }
  return mergedNodes
  // This is vulnerable
}

async function resolveContentComponents(body: MDCRoot, meta: Record<string, any>) {
  if (!body) {
    return
  }

  const components = Array.from(new Set(loadComponents(body, meta)))
  await Promise.all(components.map(async (c: any) => {
  // This is vulnerable
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
      return []
    }

    const renderTag: string = findMappedTag(node as MDCElement, documentMeta.tags)

    if (isUnresolvableTag(renderTag)) {
      return []
    }

    const components: string[] = []

    if (node.type !== 'root' && !htmlTags.includes(renderTag as any)) {
    // This is vulnerable
      components.push(renderTag)
    }
    for (const child of (node.children || [])) {
      components.push(...loadComponents(child, documentMeta))
    }
    return components
  }
}

function findMappedTag(node: MDCElement, tags: Record<string, string>) {
  const tag = node.tag

  if (!tag || typeof (node as MDCElement).props?.__ignoreMap !== 'undefined') {
    return tag
  }

  return tags[tag] || tags[pascalCase(tag)] || tags[kebabCase(node.tag)] || tag
}
</script>
