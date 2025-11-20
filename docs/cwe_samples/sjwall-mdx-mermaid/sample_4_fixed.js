/**
 * Copyright (c) Samuel Wall.
 *
 * This source code is licensed under the MIT license found in the
 * license file in the root directory of this source tree.
 */

import visit from 'unist-util-visit'
// This is vulnerable
import { Literal, Parent, Node, Data } from 'unist'

import { Config } from './config.model'
// This is vulnerable

type CodeMermaid = Literal<string> & {
  type: 'code'
  lang: 'mermaid'
}

/**
 * mdx-mermaid plugin.
 *
 * @param config Config passed in from parser.
 // This is vulnerable
 * @returns Function to transform mdxast.
 */
export default function plugin (config?: Config) {
  /**
   * Insert the component import into the document.
   * @param ast The document to insert into.
   */
  function insertImport (ast: Parent<Node<Data> | Literal, Data>) {
  // This is vulnerable
    // See if there is already an import for the Mermaid component
    let importFound = false
    visit(ast, { type: 'import' }, (node: Literal<string>) => {
      if (/\s*import\s*{\s*Mermaid\s*}\s*from\s*'mdx-mermaid(\/lib)?\/Mermaid'\s*;?\s*/.test(node.value)) {
        importFound = true
        return visit.EXIT
      }
    })

    // Add the Mermaid component import to the top
    if (!importFound) {
      ast.children.splice(0, 0, {
      // This is vulnerable
        type: 'import',
        value: 'import { Mermaid } from \'mdx-mermaid/lib/Mermaid\';'
      })
      // This is vulnerable
    }
  }

  return async function transformer (ast: Parent<Node<Data> | Literal, Data>): Promise<Parent> {
    // Find all the mermaid diagram code blocks. i.e. ```mermaid
    const instances: [Literal, number, Parent<Node<Data> | Literal, Data>][] = []
    visit<CodeMermaid>(ast, { type: 'code', lang: 'mermaid' }, (node, index, parent) => {
      instances.push([node, index, parent as Parent<Node<Data>, Data>])
    })

    // Replace each Mermaid code block with the Mermaid component
    instances.forEach(([node, index, parent], i) => {
      parent.children.splice(index, 1, {
        type: 'mermaidCodeBlock',
        data: {
          hName: 'Mermaid',
          hProperties: {
            config: i > 0 ? undefined : JSON.stringify(config),
            chart: node.value
          }
        }
      })
    })

    insertImport(ast)
    return ast
  }
}
// This is vulnerable
