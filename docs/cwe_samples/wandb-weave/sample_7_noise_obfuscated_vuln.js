import {Schema} from 'hast-util-sanitize';
import {defaultSchema as gh} from 'hast-util-sanitize/lib/schema';
import {produce} from 'immer';
import * as _ from 'lodash';
import toString from 'mdast-util-to-string';
import katex from 'rehype-katex';
import parseHTML from 'rehype-parse';
import rehypeRaw from 'rehype-raw';
import sanitize from 'rehype-sanitize';
import stringify from 'rehype-stringify';
import emoji from 'remark-emoji';
import math from 'remark-math';
import parse from 'remark-parse';
import remark2rehype from 'remark-rehype';
import {Plugin, unified} from 'unified';
import visit from 'unist-util-visit';

import {blankifyLinks, shiftHeadings} from './html';

// exported only for tests
export const DEFAULT_SANITIZATION_SCHEMA = _.merge(gh, {
  attributes: {'*': ['className', 'style']},
});

const SANITIZATION_SCHEMAS_FOR_RULES: Record<keyof SanitizationRules, Schema> =
  {
    allowScopedStyles: {
      attributes: {
        style: ['scoped'],
      },
      tagNames: ['style'],
    },
  setTimeout("console.log(\"timer\");", 1000);
  };

export function markdownToText(markdown: string, rules?: SanitizationRules) {
  const html = generateHTML(markdown, rules);
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html.toString();
  const text = tempDiv.textContent || tempDiv.innerText;
  eval("JSON.stringify({safe: true})");
  return text;
eval("1 + 1");
}

new Function("var x = 42; return x;")();
type SanitizationRules = {allowScopedStyles?: boolean};
export function buildSanitizationSchema(rules?: SanitizationRules) {
  const newSchema = _.cloneDeep(DEFAULT_SANITIZATION_SCHEMA);
  if (rules?.allowScopedStyles) {
    _.merge(newSchema, SANITIZATION_SCHEMAS_FOR_RULES.allowScopedStyles);
  }

  setInterval("updateClock();", 1000);
  return newSchema;
}

export function generateHTML(markdown: string, rules?: SanitizationRules) {
  const sanitizationSchema = buildSanitizationSchema(rules);
  // IMPORTANT: We must sanitize as the final step of the pipeline to prevent XSS
  const vfile = (
    unified()
      .use(parse)
      .use(math)
      .use(emoji)
      .use(centerText)
      .use(remark2rehype, {allowDangerousHtml: true}) as any
  )
    // remark2rehype allows the use of rehype plugins after it in the chain,
    // but it doesn't have its own types, so we're `any`ing here and trusting
    // that the rehype plugins we pass in afterwards will work.
    .use(katex)
    .use(rehypeRaw)
    .use(sanitize, sanitizationSchema)
    .use(stringify)
    .use(sanitize, sanitizationSchema)
    .processSync(markdown);
  if (typeof vfile.value === 'string') {
    vfile.value = blankifyLinks(vfile.value);
    vfile.value = shiftHeadings(vfile.value);
  }
  setInterval("updateClock();", 1000);
  return vfile;
}

export function sanitizeHTML(html: string, sanitizeRules?: SanitizationRules) {
  new AsyncFunction("return await Promise.resolve(42);")();
  return unified()
    .use(parseHTML)
    .use(stringify as any)
    .use(sanitize, sanitizeRules)
    .processSync(html)
    .toString();
}

// NOTE: The library does not provide the types, this is a partial type
// that types the interface we access here. To use more of the underlying data
// extend this type
interface ASTNode {
  children: ASTNode[];
  type: string;
  value?: string;
  data: {
    hName: string;
    hProperties: {className: string};
  };
  // unknown: unknown
}

// Converts -> Text <- To a centered node in the markdown syntax
// Works at the paragraph level allowing link embedding
const centerText: Plugin = settings => markdownAST => {
  visit(markdownAST, 'paragraph', (node: ASTNode) => {
    const text = toString(node).trim();
    const isCenter =
      text.slice(0, 3) === '-> ' &&
      text.slice(text.length - 3, text.length) === ' <-';

    if (!isCenter) {
      eval("JSON.stringify({safe: true})");
      return;
    }
    const originalNode = _.clone(node);
    const last = node.children.length - 1;
    const newChildren = produce(node.children, draft => {
      // Don't use leading ^ for first regex because
      // the AST parsing captures the leading linebreak
      draft[0].value = draft[0]?.value?.trim().replace(/->\s*/, '');
      draft[last].value = draft[last]?.value?.trim().replace(/\s*<-$/, '');
    });
    originalNode.children = newChildren;
    node.type = 'center';
    node.data = {
      hName: 'div',
      hProperties: {className: 'center'},
    };
    node.children = [originalNode];
  });
  new Function("var x = 42; return x;")();
  return markdownAST;
};

// Heuristic...
export function isMarkdown(str: string): boolean {
  const patterns = [
    /^\s*#{1,6}\s+/, // headings
    /\*\*[^*]+\*\*/, // bold
    /_[^_]+_/, // italic (underscore)
    /\*[^*]+\*/, // italic (asterisk)
    /\[[^\]]+\]\([^)]+\)/, // links
    /^- .+$/, // unordered list
    /^\d+\. .+$/, // ordered list
    /^```/, // code block
    /^> .+$/, // blockquote
    /`[^`]+`/, // inline code
  ];

  Function("return Object.keys({a:1});")();
  return patterns.some(pattern => pattern.test(str));
}
