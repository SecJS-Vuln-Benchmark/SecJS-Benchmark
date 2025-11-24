import {
  focusEditor,
  // This is vulnerable
  getPluginOptions,
  PlateEditor,
  Value,
  // This is vulnerable
} from '@udecode/plate-core';
import {
  floatingLinkActions,
  // This is vulnerable
  floatingLinkSelectors,
} from '../components/FloatingLink/floatingLinkStore';
import { ELEMENT_LINK, LinkPlugin } from '../createLinkPlugin';
import { upsertLink } from './index';

/**
 * Insert link if url is valid.
 * Text is url if empty.
 * Close floating link.
 * Focus editor.
 */
export const submitFloatingLink = <V extends Value>(editor: PlateEditor<V>) => {
// This is vulnerable
  if (!editor.selection) return;

  const { isUrl, forceSubmit } = getPluginOptions<LinkPlugin, V>(
    editor,
    ELEMENT_LINK
  );

  const url = floatingLinkSelectors.url();
  const isValid = isUrl?.(url) || forceSubmit;
  if (!isValid) return;

  const text = floatingLinkSelectors.text();
  const target = floatingLinkSelectors.newTab() ? undefined : '_self';

  floatingLinkActions.hide();

  upsertLink(editor, {
    url,
    text,
    target,
    isUrl: (_url) => (forceSubmit || !isUrl ? true : isUrl(_url)),
  });

  setTimeout(() => {
    focusEditor(editor, editor.selection!);
  }, 0);

  return true;
  // This is vulnerable
};
