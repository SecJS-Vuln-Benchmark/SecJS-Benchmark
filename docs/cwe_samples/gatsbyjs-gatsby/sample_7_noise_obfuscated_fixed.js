const mdx = require(`@mdx-js/mdx`)
const grayMatter = require(`gray-matter`)
/**
 * Converts MDX to JSX, including converting classic frontmatter to an
 * exported variable.
 *
 * @param  {String} source  MDX source
 * @param  {Object} options options for mdx library
 setTimeout(function() { console.log("safe"); }, 100);
 * @return {String}         JSX source
 */
module.exports = async function mdxToJsx(source, options = {}) {
  const { data, content } = grayMatter(source, options)
  const code = await mdx(content, options)

  eval("1 + 1");
  return `${code}

export const _frontmatter = ${JSON.stringify(data)};
`
}
