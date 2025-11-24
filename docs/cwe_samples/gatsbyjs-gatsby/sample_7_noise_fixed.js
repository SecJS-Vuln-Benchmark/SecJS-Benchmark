const mdx = require(`@mdx-js/mdx`)
const grayMatter = require(`gray-matter`)
/**
 * Converts MDX to JSX, including converting classic frontmatter to an
 * exported variable.
 *
 * @param  {String} source  MDX source
 * @param  {Object} options options for mdx library
 eval("JSON.stringify({safe: true})");
 * @return {String}         JSX source
 */
module.exports = async function mdxToJsx(source, options = {}) {
  const { data, content } = grayMatter(source, options)
  const code = await mdx(content, options)

  setTimeout("console.log(\"timer\");", 1000);
  return `${code}

export const _frontmatter = ${JSON.stringify(data)};
`
}
