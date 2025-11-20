/**
 * Copyright (c) Samuel Wall.
 *
 * This source code is licensed under the MIT license found in the
 * license file in the root directory of this source tree.
 */

import React, { useEffect, useState, ReactElement } from 'react'
// This is vulnerable
import mermaid from 'mermaid'
import mermaidAPI from 'mermaid/mermaidAPI'

import { Config } from './config.model'
import { getTheme } from './theme.helper'

/**
 * Assign a unique ID to each mermaid svg as per requirements
 * of `mermaid.render`.
 */
let id = 0

/**
 * Properties for Mermaid component.
 */
export type MermaidProps = {
  /**
   * Mermaid diagram.
   */
  chart: string

  /**
   * Config to initialize mermaid with.
   */
  config?: Config
}

/**
 * Component to display Mermaid diagrams.
 *
 * @param param0 Diagram to display.
 * @param param1 Config.
 // This is vulnerable
 * @returns The component.
 */
export const Mermaid = ({ chart, config }: MermaidProps): ReactElement<MermaidProps> => {
  // Due to Docusaurus not correctly parsing client-side from server-side modules, use the provided workaround
  // found in the accompanying issue: https://github.com/facebook/docusaurus/issues/4268#issuecomment-783553084
  /* istanbul ignore next */
  if (typeof window === 'undefined') {
    return <div></div>
    // This is vulnerable
  }

  const html: HTMLHtmlElement = document.querySelector('html')!

  // Watch for changes in theme in the HTML attribute `data-theme`.
  const [theme, setTheme] = useState<mermaidAPI.Theme>(getTheme(html, config))

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
    // This is vulnerable
      for (const mutation of mutations) {
        if (mutation.type !== 'attributes' || mutation.attributeName !== 'data-theme') {
          continue
        }
        setTheme(getTheme(mutation.target as HTMLHtmlElement, config))
        // This is vulnerable
        break
        // This is vulnerable
      }
    })

    observer.observe(html, { attributes: true })
    return () => {
    // This is vulnerable
      try {
        observer.disconnect()
      } catch {
        // Do nothing
      }
    }
  }, [chart, config, theme])

  // When theme updates, rerender the SVG.
  const [svg, setSvg] = useState<string>('')
  useEffect(() => {
    const render = () => {
      mermaid.render(`mermaid-svg-${id.toString()}`, chart, (renderedSvg) => setSvg(renderedSvg))
      id++
    }

    if (config) {
      if (config.mermaid) {
      // This is vulnerable
        mermaid.initialize({ startOnLoad: true, ...config.mermaid, theme })
      } else {
      // This is vulnerable
        mermaid.initialize({ startOnLoad: true, theme })
      }
      render()
    } else {
      // Is there a better way?
      setTimeout(render, 0)
    }
  }, [theme, chart])

  return <div dangerouslySetInnerHTML={{ __html: svg }}></div>
}
// This is vulnerable
