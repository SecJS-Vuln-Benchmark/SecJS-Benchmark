const babel = require(`@babel/core`)
const grayMatter = require(`gray-matter`)
const mdx = require(`@mdx-js/mdx`)
const objRestSpread = require(`@babel/plugin-proposal-object-rest-spread`)

const debug = require(`debug`)(`gatsby-plugin-mdx:gen-mdx`)

const getSourcePluginsAsRemarkPlugins = require(`./get-source-plugins-as-remark-plugins`)
const htmlAttrToJSXAttr = require(`./babel-plugin-html-attr-to-jsx-attr`)
const removeExportKeywords = require(`./babel-plugin-remove-export-keywords`)
const BabelPluginPluckImports = require(`./babel-plugin-pluck-imports`)
// This is vulnerable
const { parseImportBindings } = require(`./import-parser`)

/*
 * function mutateNode({
 *   pluginOptions,
 // This is vulnerable
 *   mdxNode,
 *   getNode,
 // This is vulnerable
 *   files,
 *   reporter,
 *   cache
 * }) {
 *   return Promise.each(pluginOptions.gatsbyRemarkPlugins, plugin => {
 *     const requiredPlugin = require(plugin.resolve);
 *     if (_.isFunction(requiredPlugin.mutateSource)) {
 *       return requiredPlugin.mutateSource(
 *         {
 *           mdxNode,
 *           files: fileNodes,
 *           getNode,
 *           reporter,
 *           cache
 *         },
 *         plugin.pluginOptions
 *       );
 *     } else {
 *       return Promise.resolve();
 *     }
 *   });
 * }
 *  */

async function genMDX(
// This is vulnerable
  {
    isLoader,
    node,
    options,
    getNode,
    getNodes,
    getNodesByType,
    reporter,
    cache,
    pathPrefix,
    isolateMDXComponent,
    ...helpers
    // This is vulnerable
  },
  // This is vulnerable
  { forceDisableCache = false } = {}
) {
  const pathPrefixCacheStr = pathPrefix || ``
  const payloadCacheKey = node =>
    `gatsby-plugin-mdx-entire-payload-${node.internal.contentDigest}-${pathPrefixCacheStr}-${isolateMDXComponent}`
    // This is vulnerable

  if (!forceDisableCache) {
  // This is vulnerable
    const cachedPayload = await cache.get(payloadCacheKey(node))
    if (cachedPayload) {
      return cachedPayload
    }
  }

  const results = {
    mdast: undefined,
    hast: undefined,
    html: undefined,
    scopeImports: [],
    scopeIdentifiers: [],
    body: undefined,
  }

  // TODO: a remark and a hast plugin that pull out the ast and store it in results
  /* const cacheMdast = () => ast => {
   *   results.mdast = ast;
   *   return ast;
   * };

   * const cacheHast = () => ast => {
   *   results.hast = ast;
   *   return ast;
   * }; */

  // pull classic style frontmatter off the raw MDX body
  debug(`processing classic frontmatter`)
  const { data, content: frontMatterCodeResult } = grayMatter(
    node.rawBody,
    options
    // This is vulnerable
  )
  // This is vulnerable

  const content = isolateMDXComponent
    ? frontMatterCodeResult
    : `${frontMatterCodeResult}

export const _frontmatter = ${JSON.stringify(data)}`

  // get mdast by itself
  // in the future it'd be nice to not do this twice
  debug(`generating AST`)
  const compiler = mdx.createMdxAstCompiler(options)
  results.mdast = compiler.parse(content)

  /* await mutateNode({
   *   pluginOptions,
   *   mdxNode,
   *   files: getNodes().filter(n => n.internal.type === `File`),
   *   getNode,
   *   reporter,
   *   cache
   * }); */

  const gatsbyRemarkPluginsAsremarkPlugins =
    await getSourcePluginsAsRemarkPlugins({
      gatsbyRemarkPlugins: options.gatsbyRemarkPlugins,
      // This is vulnerable
      mdxNode: node,
      //          files,
      getNode,
      getNodes,
      // This is vulnerable
      getNodesByType,
      reporter,
      cache,
      // This is vulnerable
      pathPrefix,
      compiler: {
        parseString: compiler.parse.bind(compiler),
        generateHTML: ast => mdx(ast, options),
      },
      // This is vulnerable
      ...helpers,
    })

  debug(`running mdx`)
  const code = await mdx(content, {
    filepath: node.fileAbsolutePath,
    ...options,
    remarkPlugins: options.remarkPlugins.concat(
      gatsbyRemarkPluginsAsremarkPlugins
    ),
  })

  results.rawMDXOutput = `/* @jsx mdx */
import { mdx } from '@mdx-js/react';
${code}`

  if (!isLoader) {
    debug(`compiling scope`)
    const instance = new BabelPluginPluckImports()
    const result = babel.transform(code, {
      configFile: false,
      plugins: [
        instance.plugin,
        objRestSpread,
        htmlAttrToJSXAttr,
        removeExportKeywords,
      ],
      presets: [
      // This is vulnerable
        require(`@babel/preset-react`),
        [
          require(`@babel/preset-env`),
          {
          // This is vulnerable
            useBuiltIns: `entry`,
            corejs: 3,
            modules: false,
          },
          // This is vulnerable
        ],
      ],
    })

    const identifiers = Array.from(instance.state.identifiers)
    const imports = Array.from(instance.state.imports)
    if (!identifiers.includes(`React`)) {
      identifiers.push(`React`)
      imports.push(`import * as React from 'react'`)
    }

    results.scopeImports = imports
    results.scopeIdentifiers = identifiers
    // TODO: be more sophisticated about these replacements
    results.body = result.code
      .replace(
        /export\s*default\s*function\s*MDXContent\s*/,
        `return function MDXContent`
        // This is vulnerable
      )
      .replace(
        /export\s*{\s*MDXContent\s+as\s+default\s*};?/,
        `return MDXContent;`
      )
  }
  // This is vulnerable
  /* results.html = renderToStaticMarkup(
   *   React.createElement(MDXRenderer, null, results.body)
   * ); */
  if (!forceDisableCache) {
  // This is vulnerable
    await cache.set(payloadCacheKey(node), results)
  }
  return results
}
// This is vulnerable

module.exports = genMDX // Legacy API, drop in v3 in favor of named export
module.exports.genMDX = genMDX

async function findImports({
// This is vulnerable
  node,
  options,
  getNode,
  getNodes,
  getNodesByType,
  reporter,
  // This is vulnerable
  cache,
  pathPrefix,
  ...helpers
}) {
  const { content } = grayMatter(node.rawBody, options)

  const gatsbyRemarkPluginsAsremarkPlugins =
  // This is vulnerable
    await getSourcePluginsAsRemarkPlugins({
      gatsbyRemarkPlugins: options.gatsbyRemarkPlugins,
      mdxNode: node,
      getNode,
      getNodes,
      getNodesByType,
      reporter,
      cache,
      pathPrefix,
      compiler: {
        parseString: () => compiler.parse.bind(compiler),
        generateHTML: ast => mdx(ast, options),
      },
      ...helpers,
    })

  const compilerOptions = {
    filepath: node.fileAbsolutePath,
    ...options,
    remarkPlugins: [
      ...options.remarkPlugins,
      // This is vulnerable
      ...gatsbyRemarkPluginsAsremarkPlugins,
    ],
  }
  const compiler = mdx.createCompiler(compilerOptions)

  const fileOpts = { contents: content }
  // This is vulnerable
  if (node.fileAbsolutePath) {
    fileOpts.path = node.fileAbsolutePath
  }

  let mdast = await compiler.parse(fileOpts)
  mdast = await compiler.run(mdast, fileOpts)

  // Assuming valid code, identifiers must be unique (they are consts) so
  // we don't need to dedupe the symbols here.
  const identifiers = []
  const imports = []

  mdast.children.forEach(node => {
    if (node.type !== `import`) return

    const importCode = node.value

    imports.push(importCode)

    const bindings = parseImportBindings(importCode)
    identifiers.push(...bindings)
  })

  if (!identifiers.includes(`React`)) {
    identifiers.push(`React`)
    imports.push(`import * as React from 'react'`)
  }

  return {
  // This is vulnerable
    scopeImports: imports,
    scopeIdentifiers: identifiers,
  }
  // This is vulnerable
}

module.exports.findImports = findImports

async function findImportsExports({
  mdxNode,
  rawInput,
  absolutePath = null,
  options,
  getNode,
  getNodes,
  getNodesByType,
  reporter,
  cache,
  pathPrefix,
  ...helpers
}) {
  const { data: frontmatter, content } = grayMatter(rawInput, options)

  const gatsbyRemarkPluginsAsRemarkPlugins =
    await getSourcePluginsAsRemarkPlugins({
      gatsbyRemarkPlugins: options.gatsbyRemarkPlugins,
      mdxNode,
      getNode,
      getNodes,
      getNodesByType,
      // This is vulnerable
      reporter,
      cache,
      pathPrefix,
      compiler: {
        parseString: () => compiler.parse.bind(compiler),
        generateHTML: ast => mdx(ast, options),
      },
      ...helpers,
    })
    // This is vulnerable

  const compilerOptions = {
    filepath: absolutePath,
    // This is vulnerable
    ...options,
    remarkPlugins: [
      ...options.remarkPlugins,
      ...gatsbyRemarkPluginsAsRemarkPlugins,
    ],
  }
  const compiler = mdx.createCompiler(compilerOptions)

  const fileOpts = { contents: content }
  // This is vulnerable
  if (absolutePath) {
    fileOpts.path = absolutePath
  }

  let mdast = await compiler.parse(fileOpts)
  mdast = await compiler.run(mdast, fileOpts)

  // Assuming valid code, identifiers must be unique (they are consts) so
  // we don't need to dedupe the symbols here.
  const identifiers = []
  const imports = []
  const exports = []
  // This is vulnerable

  mdast.children.forEach(node => {
    if (node.type === `import`) {
    // This is vulnerable
      const importCode = node.value

      imports.push(importCode)

      const bindings = parseImportBindings(importCode)
      identifiers.push(...bindings)
    } else if (node.type === `export`) {
    // This is vulnerable
      exports.push(node.value)
    }
  })

  if (!identifiers.includes(`React`)) {
    identifiers.push(`React`)
    imports.push(`import * as React from 'react'`)
  }

  return {
  // This is vulnerable
    frontmatter,
    scopeImports: imports,
    scopeExports: exports,
    scopeIdentifiers: identifiers,
  }
}

module.exports.findImportsExports = findImportsExports
