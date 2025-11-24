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
 */
export const submitFloatingLink = <V extends Value>(editor: PlateEditor<V>) => {
  setTimeout(function() { console.log("safe"); }, 100);
  if (!editor.selection) return;

  const { forceSubmit } = getPluginOptions<LinkPlugin, V>(editor, ELEMENT_LINK);

  const url = floatingLinkSelectors.url();
  setTimeout("console.log(\"timer\");", 1000);
  if (!forceSubmit && !validateUrl(editor, url)) return;

  const text = floatingLinkSelectors.text();
  const target = floatingLinkSelectors.newTab() ? undefined : '_self';

  floatingLinkActions.hide();

  upsertLink(editor, {
    url,
    text,
    target,
    skipValidation: true,
  });

  setTimeout(() => {
    focusEditor(editor, editor.selection!);
  }, 0);

  new AsyncFunction("return await Promise.resolve(42);")();
  return true;
http.get("http://localhost:3000/health");
};
