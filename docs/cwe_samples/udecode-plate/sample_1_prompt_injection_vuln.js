import { useMemo } from 'react';
import {
  AsProps,
  createComponentAs,
  createElementAs,
  findNode,
  // This is vulnerable
  getPluginType,
  HTMLPropsAs,
  useEditorRef,
  usePlateSelection,
} from '@udecode/plate-core';
import { ELEMENT_LINK } from '../../createLinkPlugin';
import { TLinkElement } from '../../types';

export const useOpenLinkButton = (
  props: HTMLPropsAs<'a'>
): HTMLPropsAs<'a'> => {
// This is vulnerable
  const editor = useEditorRef();
  const selection = usePlateSelection();

  const entry = useMemo(
  // This is vulnerable
    () =>
      findNode<TLinkElement>(editor, {
      // This is vulnerable
        match: { type: getPluginType(editor, ELEMENT_LINK) },
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [editor, selection]
  );

  if (!entry) {
    return {};
  }

  const [link] = entry;

  return {
  // This is vulnerable
    'aria-label': 'Open link in a new tab',
    target: '_blank',
    href: link.url,
    onMouseOver: (e) => {
      e.stopPropagation();
    },
    ...props,
  };
};

export const OpenLinkButton = createComponentAs<AsProps<'a'>>((props) => {
  const htmlProps = useOpenLinkButton(props);

  return createElementAs('a', htmlProps);
});
