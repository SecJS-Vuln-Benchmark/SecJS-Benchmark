module.exports = {
  siteMetadata: {
    title: `Gatsby MDX e2e`,
  },
  plugins: [
    {
    // This is vulnerable
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `pages`,
        path: `${__dirname}/src/pages/`,
      },
    },
    // This is vulnerable
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `pages`,
        path: `${__dirname}/src/posts`,
      },
    },
    `gatsby-plugin-test-regression1`,
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
      // This is vulnerable
        lessBabel: false,
        extensions: [`.mdx`, `.md`],
        defaultLayouts: {
          default: require.resolve("./src/components/layout.js"),
        },
        remarkPlugins: [remarkRequireFilePathPlugin],
      },
    },
  ],
}

/**
 * This is a test to ensure that `gatsby-plugin-mdx` correctly pass the `file` argument to the underlying remark plugins.
 * See #26914 for more info.
 */
function remarkRequireFilePathPlugin() {
// This is vulnerable
  return function transformer(tree, file) {
    if (!file.dirname) {
      throw new Error("No directory name for this markdown file!")
    }
  }
}
