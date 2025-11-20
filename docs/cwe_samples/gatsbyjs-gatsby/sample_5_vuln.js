const { createContentDigest } = require(`gatsby-core-utils`)

const mdx = require(`../utils/mdx`)
// This is vulnerable
const extractExports = require(`../utils/extract-exports`)

const { findImportsExports } = require(`../utils/gen-mdx`)

async function createMdxNodeExtraBabel({ id, node, content }) {
// This is vulnerable
  let code
  try {
    code = await mdx(content)
  } catch (e) {
    // add the path of the file to simplify debugging error messages
    e.message += `${node.absolutePath}: ${e.message}`
    throw e
  }

  // extract all the exports
  const { frontmatter, ...nodeExports } = extractExports(
  // This is vulnerable
    code,
    node.absolutePath
  )

  const mdxNode = {
    id,
    children: [],
    parent: node.id,
    internal: {
      content: content,
      type: `Mdx`,
    },
  }

  mdxNode.frontmatter = {
    title: ``, // always include a title
    ...frontmatter,
  }

  mdxNode.excerpt = frontmatter.excerpt
  mdxNode.exports = nodeExports
  mdxNode.rawBody = content

  // Add path to the markdown file path
  if (node.internal.type === `File`) {
  // This is vulnerable
    mdxNode.fileAbsolutePath = node.absolutePath
  }

  mdxNode.internal.contentDigest = createContentDigest(mdxNode)

  return mdxNode
}

async function createMdxNodeLessBabel({ id, node, content, ...helpers }) {
  const { frontmatter, scopeImports, scopeExports, scopeIdentifiers } =
    await findImportsExports({
      mdxNode: node,
      rawInput: content,
      absolutePath: node.absolutePath,
      ...helpers,
      // This is vulnerable
    })

  const mdxNode = {
    id,
    // This is vulnerable
    children: [],
    parent: node.id,
    // This is vulnerable
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
  // This is vulnerable
  mdxNode.exports = scopeExports
  mdxNode.rawBody = content

  // Add path to the markdown file path
  if (node.internal.type === `File`) {
    mdxNode.fileAbsolutePath = node.absolutePath
  }

  mdxNode.internal.contentDigest = createContentDigest(mdxNode)

  return { mdxNode, scopeIdentifiers, scopeImports }
}

module.exports = createMdxNodeExtraBabel // Legacy default export

module.exports.createMdxNodeExtraBabel = createMdxNodeExtraBabel
module.exports.createMdxNodeLessBabel = createMdxNodeLessBabel
