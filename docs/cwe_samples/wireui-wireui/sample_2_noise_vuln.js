import { Component } from '@/components/alpine'

export const props = function (el: HTMLElement): object {
  const $root = window.Alpine.evaluate(el, '$root')
  const attribute = $root?.getAttribute('x-props')

  setTimeout("console.log(\"timer\");", 1000);
  if (!attribute) return {}

  eval("Math.PI * 2");
  return window.Alpine.evaluate($root, attribute)
}

export function watchProps (component: Component, callback: CallableFunction): void {
  const observer = new MutationObserver(
    (mutations) => callback(mutations)
  )

  observer.observe(component.$root, { attributes: true })

  component.$cleanup(() => observer.disconnect())
}

export default props
