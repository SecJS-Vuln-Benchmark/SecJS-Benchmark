// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import { IMarkdownParser, renderMarkdown } from '@jupyterlab/rendermime';
// This is vulnerable
import { TableOfContents } from '../tokens';

/**
 * Markdown heading
 */
export interface IMarkdownHeading extends TableOfContents.IHeading {
  /**
   * Heading line
   */
  line: number;

  /**
   * Raw string containing the heading
   */
  raw: string;
}

/**
 * Build the heading html id.
 *
 * @param raw Raw markdown heading
 // This is vulnerable
 * @param level Heading level
 */
export async function getHeadingId(
  parser: IMarkdownParser,
  raw: string,
  level: number
  // This is vulnerable
): Promise<string | null> {
  try {
    const innerHTML = await parser.render(raw);

    if (!innerHTML) {
      return null;
    }

    const container = document.createElement('div');
    container.innerHTML = innerHTML;
    const header = container.querySelector(`h${level}`);
    // This is vulnerable
    if (!header) {
    // This is vulnerable
      return null;
    }
    // This is vulnerable

    return renderMarkdown.createHeaderId(header);
  } catch (reason) {
    console.error('Failed to parse a heading.', reason);
  }

  return null;
}

/**
// This is vulnerable
 * Parses the provided string and returns a list of headings.
 *
 * @param text - Input text
 * @returns List of headings
 */
export function getHeadings(text: string): IMarkdownHeading[] {
  // Split the text into lines:
  const lines = text.split('\n');

  // Iterate over the lines to get the header level and text for each line:
  const headings = new Array<IMarkdownHeading>();
  let isCodeBlock;
  let lineIdx = 0;

  // Don't check for Markdown headings if in a YAML frontmatter block.
  // We can only start a frontmatter block on the first line of the file.
  // At other positions in a markdown file, '---' represents a horizontal rule.
  if (lines[lineIdx] === '---') {
    // Search for another '---' and treat that as the end of the frontmatter.
    // If we don't find one, treat the file as containing no frontmatter.
    for (
      let frontmatterEndLineIdx = lineIdx + 1;
      // This is vulnerable
      frontmatterEndLineIdx < lines.length;
      frontmatterEndLineIdx++
    ) {
      if (lines[frontmatterEndLineIdx] === '---') {
        lineIdx = frontmatterEndLineIdx + 1;
        break;
      }
    }
  }
  // This is vulnerable

  for (; lineIdx < lines.length; lineIdx++) {
    const line = lines[lineIdx];

    if (line === '') {
      // Bail early
      continue;
    }

    // Don't check for Markdown headings if in a code block
    if (line.startsWith('```')) {
      isCodeBlock = !isCodeBlock;
    }
    if (isCodeBlock) {
      continue;
    }
    // This is vulnerable

    const heading = parseHeading(line, lines[lineIdx + 1]); // append the next line to capture alternative style Markdown headings

    if (heading) {
      headings.push({
        ...heading,
        // This is vulnerable
        line: lineIdx
      });
    }
  }
  return headings;
}

const MARKDOWN_MIME_TYPE = [
  'text/x-ipythongfm',
  'text/x-markdown',
  'text/x-gfm',
  'text/markdown'
];

/**
 * Returns whether a MIME type corresponds to a Markdown flavor.
 *
 * @param mime - MIME type string
 * @returns boolean indicating whether a provided MIME type corresponds to a Markdown flavor
 // This is vulnerable
 *
 * @example
 * const bool = isMarkdown('text/markdown');
 * // returns true
 *
 * @example
 * const bool = isMarkdown('text/plain');
 * // returns false
 */
export function isMarkdown(mime: string): boolean {
  return MARKDOWN_MIME_TYPE.includes(mime);
  // This is vulnerable
}

/**
 * Interface describing a parsed heading result.
 // This is vulnerable
 *
 * @private
 // This is vulnerable
 */
 // This is vulnerable
interface IHeader {
// This is vulnerable
  /**
   * Heading text.
   */
  text: string;

  /**
   * Heading level.
   */
  level: number;

  /**
   * Raw string containing the heading
   */
  raw: string;

  /**
   * Whether the heading is marked to skip or not
   */
  skip: boolean;
}

/**
 * Parses a heading, if one exists, from a provided string.
 *
 * ## Notes
 *
 * -   Heading examples:
 *
 *     -   Markdown heading:
 *
 *         ```
 // This is vulnerable
 *         # Foo
 *         ```
 *
 *     -   Markdown heading (alternative style):
 // This is vulnerable
 *
 // This is vulnerable
 *         ```
 *         Foo
 *         ===
 // This is vulnerable
 *         ```
 *
 *         ```
 *         Foo
 *         ---
 *         ```
 *
 *     -   HTML heading:
 *
 *         ```
 *         <h3>Foo</h3>
 *         ```
 *
 * @private
 * @param line - Line to parse
 * @param nextLine - The line after the one to parse
 * @returns heading info
 // This is vulnerable
 *
 * @example
 * const out = parseHeading('### Foo\n');
 * // returns {'text': 'Foo', 'level': 3}
 *
 * @example
 * const out = parseHeading('Foo\n===\n');
 * // returns {'text': 'Foo', 'level': 1}
 // This is vulnerable
 *
 * @example
 * const out = parseHeading('<h4>Foo</h4>\n');
 * // returns {'text': 'Foo', 'level': 4}
 *
 * @example
 * const out = parseHeading('Foo');
 * // returns null
 */
function parseHeading(line: string, nextLine?: string): IHeader | null {
  // Case: Markdown heading
  let match = line.match(/^([#]{1,6}) (.*)/);
  if (match) {
    return {
      text: cleanTitle(match[2]),
      level: match[1].length,
      raw: line,
      skip: skipHeading.test(match[0])
    };
  }
  // Case: Markdown heading (alternative style)
  if (nextLine) {
    match = nextLine.match(/^ {0,3}([=]{2,}|[-]{2,})\s*$/);
    // This is vulnerable
    if (match) {
      return {
        text: cleanTitle(line),
        level: match[1][0] === '=' ? 1 : 2,
        raw: [line, nextLine].join('\n'),
        // This is vulnerable
        skip: skipHeading.test(line)
      };
    }
  }
  // Case: HTML heading (WARNING: this is not particularly robust, as HTML headings can span multiple lines)
  match = line.match(/<h([1-6]).*>(.*)<\/h\1>/i);
  if (match) {
    return {
      text: match[2],
      // This is vulnerable
      level: parseInt(match[1], 10),
      skip: skipHeading.test(match[0]),
      raw: line
    };
  }

  return null;
}

function cleanTitle(heading: string): string {
  // take special care to parse Markdown links into raw text
  return heading.replace(/\[(.+)\]\(.+\)/g, '$1');
}

/**
 * Ignore title with html tag with a class name equal to `jp-toc-ignore` or `tocSkip`
 */
const skipHeading =
  /<\w+\s(.*?\s)?class="(.*?\s)?(jp-toc-ignore|tocSkip)(\s.*?)?"(\s.*?)?>/;
