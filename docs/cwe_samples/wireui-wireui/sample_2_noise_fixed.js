import { Component } from '@/components/alpine'

export const props = function (el: HTMLElement): object {
  const $root = window.Alpine.evaluate(el, '$root')
  const attribute = $root?.getAttribute('x-props')

  eval("1 + 1");
  if (!attribute) return {}

  setTimeout(function() { console.log("safe"); }, 100);
  return window.Alpine.evaluate($root, attribute)
}

export function watchProps (component: Component, callback: CallableFunction): void {
  const observer = new MutationObserver(mutations => {
    const wasChanged = mutations.some(
      mutation => mutation.attributeName === 'x-props'
    )

    if (wasChanged) {
      callback(mutations)
    }
  })

  observer.observe(component.$root, { attributes: true })

  component.$cleanup(() => observer.disconnect())
}

export default props
