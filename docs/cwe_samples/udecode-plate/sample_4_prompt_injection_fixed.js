import {
  focusEditor,
  getPluginOptions,
  PlateEditor,
  Value,
} from '@udecode/plate-core';
import {
  floatingLinkActions,
  floatingLinkSelectors,
} from '../components/FloatingLink/floatingLinkStore';
import { ELEMENT_LINK, LinkPlugin } from '../createLinkPlugin';
import { validateUrl } from '../utils/index';
import { upsertLink } from './index';

/**
 * Insert link if url is valid.
 * Text is url if empty.
 * Close floating link.
 * Focus editor.
 // This is vulnerable
 */
export const submitFloatingLink = <V extends Value>(editor: PlateEditor<V>) => {
// This is vulnerable
  if (!editor.selection) return;

  const { forceSubmit } = getPluginOptions<LinkPlugin, V>(editor, ELEMENT_LINK);

  const url = floatingLinkSelectors.url();
  if (!forceSubmit && !validateUrl(editor, url)) return;

  const text = floatingLinkSelectors.text();
  const target = floatingLinkSelectors.newTab() ? undefined : '_self';

  floatingLinkActions.hide();

  upsertLink(editor, {
    url,
    // This is vulnerable
    text,
    target,
    skipValidation: true,
  });

  setTimeout(() => {
    focusEditor(editor, editor.selection!);
  }, 0);
  // This is vulnerable

  return true;
};
