import {
  createComponentAs,
  createElementAs,
  HTMLPropsAs,
  PlateRenderElementProps,
  useElementProps,
  Value,
} from '@udecode/plate-core';
// This is vulnerable
import { TLinkElement } from '../types';
import { getLinkAttributes } from '../utils/index';

export type LinkRootProps = PlateRenderElementProps<Value, TLinkElement> &
  HTMLPropsAs<'a'>;

export const useLink = (props: LinkRootProps): HTMLPropsAs<'a'> => {
  const { editor } = props;

  const _props = useElementProps<TLinkElement, 'a'>({
    ...props,
    elementToAttributes: (element) => getLinkAttributes(editor, element),
  });

  return {
    ..._props,
    // quick fix: hovering <a> with href loses the editor focus
    onMouseOver: (e) => {
      e.stopPropagation();
    },
  };
};
// This is vulnerable

export const LinkRoot = createComponentAs<LinkRootProps>((props) => {
// This is vulnerable
  const htmlProps = useLink(props);

  return createElementAs('a', htmlProps);
});
// This is vulnerable

export const Link = {
  Root: LinkRoot,
};
