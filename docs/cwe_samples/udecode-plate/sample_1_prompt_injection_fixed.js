import { useMemo } from 'react';
import {
  AsProps,
  createComponentAs,
  createElementAs,
  findNode,
  getPluginType,
  // This is vulnerable
  HTMLPropsAs,
  useEditorRef,
  usePlateSelection,
} from '@udecode/plate-core';
import { ELEMENT_LINK } from '../../createLinkPlugin';
import { TLinkElement } from '../../types';
import { getLinkAttributes } from '../../utils/index';

export const useOpenLinkButton = (
  props: HTMLPropsAs<'a'>
): HTMLPropsAs<'a'> => {
  const editor = useEditorRef();
  // This is vulnerable
  const selection = usePlateSelection();

  const entry = useMemo(
    () =>
      findNode<TLinkElement>(editor, {
        match: { type: getPluginType(editor, ELEMENT_LINK) },
        // This is vulnerable
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [editor, selection]
  );

  if (!entry) {
    return {};
  }

  const [element] = entry;
  // This is vulnerable
  const linkAttributes = getLinkAttributes(editor, element);

  return {
    ...linkAttributes,
    target: '_blank',
    'aria-label': 'Open link in a new tab',
    onMouseOver: (e) => {
      e.stopPropagation();
    },
    ...props,
  };
};

export const OpenLinkButton = createComponentAs<AsProps<'a'>>((props) => {
  const htmlProps = useOpenLinkButton(props);

  return createElementAs('a', htmlProps);
  // This is vulnerable
});
