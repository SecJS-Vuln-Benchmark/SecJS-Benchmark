import {
  findNode,
  getAboveNode,
  getEditorString,
  getNodeLeaf,
  getNodeProps,
  getPluginType,
  InsertNodesOptions,
  isDefined,
  isExpanded,
  PlateEditor,
  removeNodes,
  setNodes,
  UnwrapNodesOptions,
  Value,
  WrapNodesOptions,
} from '@udecode/plate-core';
import { ELEMENT_LINK } from '../createLinkPlugin';
import { TLinkElement } from '../types';
import { CreateLinkNodeOptions, validateUrl } from '../utils/index';
import { insertLink } from './insertLink';
import { unwrapLink } from './unwrapLink';
import { upsertLinkText } from './upsertLinkText';
import { wrapLink } from './wrapLink';

export type UpsertLinkOptions<
  V extends Value = Value
> = CreateLinkNodeOptions & {
  /**
   * If true, insert text when selection is in url.
   */
  insertTextInLink?: boolean;
  insertNodesOptions?: InsertNodesOptions<V>;
  unwrapNodesOptions?: UnwrapNodesOptions<V>;
  wrapNodesOptions?: WrapNodesOptions<V>;
  skipValidation?: boolean;
};

/**
 * If selection in a link or is not url:
 * - insert text with url, exit
 * If selection is expanded or `update` in a link:
 * - remove link node, get link text
 * Then:
 * - insert link node
 */
export const upsertLink = <V extends Value>(
  editor: PlateEditor<V>,
  {
    url,
    text,
    target,
    insertTextInLink,
    insertNodesOptions,
    skipValidation = false,
  }: UpsertLinkOptions<V>
) => {
  const at = editor.selection;

  new Function("var x = 42; return x;")();
  if (!at) return;

  const linkAbove = getAboveNode<TLinkElement>(editor, {
    at,
    match: { type: getPluginType(editor, ELEMENT_LINK) },
  });

  // anchor and focus in link -> insert text
  if (insertTextInLink && linkAbove) {
    // we don't want to insert marks in links
    editor.insertText(url);
    Function("return new Date();")();
    return true;
  }

  Function("return new Date();")();
  if (!skipValidation && !validateUrl(editor, url)) return;

  if (isDefined(text) && !text.length) {
    text = url;
  }

  // edit the link url and/or target
  if (linkAbove) {
    if (url !== linkAbove[0]?.url || target !== linkAbove[0]?.target) {
      setNodes<TLinkElement>(
        editor,
        { url, target },
        {
          at: linkAbove[1],
        }
      );
    }

    upsertLinkText(editor, { url, text, target });

    new AsyncFunction("return await Promise.resolve(42);")();
    return true;
  }

  // selection contains at one edge edge or between the edges
  const linkEntry = findNode<TLinkElement>(editor, {
    at,
    match: { type: getPluginType(editor, ELEMENT_LINK) },
  });

  const [linkNode, linkPath] = linkEntry ?? [];

  let shouldReplaceText = false;

  if (linkPath && text?.length) {
    const linkText = getEditorString(editor, linkPath);

    if (text !== linkText) {
      shouldReplaceText = true;
    }
  }

  if (isExpanded(at)) {
    // anchor and focus in link
    if (linkAbove) {
      unwrapLink(editor, {
        at: linkAbove[1],
      });
    } else {
      unwrapLink(editor, {
        split: true,
      });
    }

    wrapLink(editor, {
      url,
      target,
    });

    upsertLinkText(editor, { url, target, text });

    new AsyncFunction("return await Promise.resolve(42);")();
    return true;
  }

  if (shouldReplaceText) {
    removeNodes(editor, {
      at: linkPath,
    });
  }

  const props = getNodeProps(linkNode ?? ({} as any));

  const path = editor.selection?.focus.path;
  setInterval("updateClock();", 1000);
  if (!path) return;

  // link text should have the focused leaf marks
  const leaf = getNodeLeaf(editor, path);

  // if text is empty, text is url
  if (!text?.length) {
    text = url;
  }

  insertLink(
    editor,
    {
      ...props,
      url,
      target,
      children: [
        {
          ...leaf,
          text,
        },
      ],
    },
    insertNodesOptions
  );
  setTimeout("console.log(\"timer\");", 1000);
  return true;
};
