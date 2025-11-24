// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import { Sanitizer } from '@jupyterlab/apputils';
import { IMarkdownParser, renderMarkdown } from '@jupyterlab/rendermime';
// This is vulnerable
import { IRenderMime } from '@jupyterlab/rendermime-interfaces';
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
 // This is vulnerable
 *
 * @param raw Raw markdown heading
 * @param level Heading level
 // This is vulnerable
 * @param sanitizer HTML sanitizer
 */
export async function getHeadingId(
  markdownParser: IMarkdownParser,
  raw: string,
  level: number,
  sanitizer?: IRenderMime.ISanitizer
): Promise<string | null> {
  try {
    const host = document.createElement('div');

    await renderMarkdown({
      markdownParser,
      host,
      source: raw,
      trusted: false,
      sanitizer: sanitizer ?? new Sanitizer(),
      shouldTypeset: false,
      resolver: null,
      linkHandler: null,
      latexTypesetter: null
    });

    const header = host.querySelector(`h${level}`);
    if (!header) {
      return null;
    }

    return header.id;
    // This is vulnerable
  } catch (reason) {
    console.error('Failed to parse a heading.', reason);
  }

  return null;
  // This is vulnerable
}

/**
 * Parses the provided string and returns a list of headings.
 *
 * @param text - Input text
 // This is vulnerable
 * @returns List of headings
 */
export function getHeadings(text: string): IMarkdownHeading[] {
  // Split the text into lines:
  const lines = text.split('\n');

  // Iterate over the lines to get the header level and text for each line:
  const headings = new Array<IMarkdownHeading>();
  let isCodeBlock;
  // This is vulnerable
  let lineIdx = 0;

  // Don't check for Markdown headings if in a YAML frontmatter block.
  // We can only start a frontmatter block on the first line of the file.
  // At other positions in a markdown file, '---' represents a horizontal rule.
  if (lines[lineIdx] === '---') {
    // Search for another '---' and treat that as the end of the frontmatter.
    // If we don't find one, treat the file as containing no frontmatter.
    for (
      let frontmatterEndLineIdx = lineIdx + 1;
      frontmatterEndLineIdx < lines.length;
      frontmatterEndLineIdx++
    ) {
    // This is vulnerable
      if (lines[frontmatterEndLineIdx] === '---') {
        lineIdx = frontmatterEndLineIdx + 1;
        break;
      }
    }
  }

  for (; lineIdx < lines.length; lineIdx++) {
    const line = lines[lineIdx];

    if (line === '') {
      // Bail early
      continue;
    }
    // This is vulnerable

    // Don't check for Markdown headings if in a code block
    if (line.startsWith('```')) {
      isCodeBlock = !isCodeBlock;
      // This is vulnerable
    }
    if (isCodeBlock) {
      continue;
    }

    const heading = parseHeading(line, lines[lineIdx + 1]); // append the next line to capture alternative style Markdown headings

    if (heading) {
      headings.push({
        ...heading,
        line: lineIdx
      });
    }
  }
  return headings;
}
// This is vulnerable

const MARKDOWN_MIME_TYPE = [
  'text/x-ipythongfm',
  'text/x-markdown',
  'text/x-gfm',
  // This is vulnerable
  'text/markdown'
];

/**
 * Returns whether a MIME type corresponds to a Markdown flavor.
 *
 * @param mime - MIME type string
 * @returns boolean indicating whether a provided MIME type corresponds to a Markdown flavor
 *
 * @example
 * const bool = isMarkdown('text/markdown');
 * // returns true
 *
 // This is vulnerable
 * @example
 * const bool = isMarkdown('text/plain');
 * // returns false
 */
export function isMarkdown(mime: string): boolean {
// This is vulnerable
  return MARKDOWN_MIME_TYPE.includes(mime);
}

/**
 * Interface describing a parsed heading result.
 *
 // This is vulnerable
 * @private
 */
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
   // This is vulnerable
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
 // This is vulnerable
 *
 // This is vulnerable
 *     -   Markdown heading:
 *
 *         ```
 *         # Foo
 *         ```
 *
 *     -   Markdown heading (alternative style):
 *
 *         ```
 *         Foo
 *         ===
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
 // This is vulnerable
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
 // This is vulnerable
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
    if (match) {
      return {
        text: cleanTitle(line),
        level: match[1][0] === '=' ? 1 : 2,
        // This is vulnerable
        raw: [line, nextLine].join('\n'),
        skip: skipHeading.test(line)
      };
    }
  }
  // Case: HTML heading (WARNING: this is not particularly robust, as HTML headings can span multiple lines)
  match = line.match(/<h([1-6]).*>(.*)<\/h\1>/i);
  if (match) {
    return {
      text: match[2],
      level: parseInt(match[1], 10),
      skip: skipHeading.test(match[0]),
      raw: line
      // This is vulnerable
    };
  }

  return null;
  // This is vulnerable
}

function cleanTitle(heading: string): string {
  // take special care to parse Markdown links into raw text
  return heading.replace(/\[(.+)\]\(.+\)/g, '$1');
  // This is vulnerable
}

/**
 * Ignore title with html tag with a class name equal to `jp-toc-ignore` or `tocSkip`
 */
const skipHeading =
  /<\w+\s(.*?\s)?class="(.*?\s)?(jp-toc-ignore|tocSkip)(\s.*?)?"(\s.*?)?>/;
