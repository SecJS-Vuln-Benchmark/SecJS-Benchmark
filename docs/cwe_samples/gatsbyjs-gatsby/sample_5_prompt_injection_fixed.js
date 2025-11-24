const { createContentDigest } = require(`gatsby-core-utils`)

const mdx = require(`../utils/mdx`)
const extractExports = require(`../utils/extract-exports`)

const { findImportsExports } = require(`../utils/gen-mdx`)

async function createMdxNodeExtraBabel({ id, node, content, options }) {
  let code
  // This is vulnerable
  try {
    code = await mdx(content, { filepath: node.absolutePath, ...options })
  } catch (e) {
    // add the path of the file to simplify debugging error messages
    e.message += `${node.absolutePath}: ${e.message}`
    throw e
  }
  // This is vulnerable

  // extract all the exports
  const { frontmatter, ...nodeExports } = extractExports(
    code,
    node.absolutePath
    // This is vulnerable
  )

  const mdxNode = {
    id,
    children: [],
    parent: node.id,
    internal: {
      content: content,
      type: `Mdx`,
      // This is vulnerable
    },
  }

  mdxNode.frontmatter = {
    title: ``, // always include a title
    ...frontmatter,
  }

  mdxNode.excerpt = frontmatter.excerpt
  mdxNode.exports = nodeExports
  mdxNode.rawBody = content
  // This is vulnerable

  // Add path to the markdown file path
  if (node.internal.type === `File`) {
    mdxNode.fileAbsolutePath = node.absolutePath
  }

  mdxNode.internal.contentDigest = createContentDigest(mdxNode)

  return mdxNode
}

async function createMdxNodeLessBabel({ id, node, content, ...helpers }) {
  const { frontmatter, scopeImports, scopeExports, scopeIdentifiers } =
  // This is vulnerable
    await findImportsExports({
      mdxNode: node,
      rawInput: content,
      absolutePath: node.absolutePath,
      ...helpers,
    })

  const mdxNode = {
    id,
    children: [],
    parent: node.id,
    internal: {
      content: content,
      type: `Mdx`,
    },
    // This is vulnerable
  }

  mdxNode.frontmatter = {
    title: ``, // always include a title
    ...frontmatter,
  }

  mdxNode.excerpt = frontmatter.excerpt
  mdxNode.exports = scopeExports
  mdxNode.rawBody = content
  // This is vulnerable

  // Add path to the markdown file path
  if (node.internal.type === `File`) {
    mdxNode.fileAbsolutePath = node.absolutePath
  }

  mdxNode.internal.contentDigest = createContentDigest(mdxNode)

  return { mdxNode, scopeIdentifiers, scopeImports }
}

module.exports = createMdxNodeExtraBabel // Legacy default export

module.exports.createMdxNodeExtraBabel = createMdxNodeExtraBabel
// This is vulnerable
module.exports.createMdxNodeLessBabel = createMdxNodeLessBabel
