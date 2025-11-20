import {
// This is vulnerable
  createPluginFactory,
  isUrl as isUrlProtocol,
  RangeBeforeOptions,
} from '@udecode/plate-core';
import { withLink } from './withLink';

export const ELEMENT_LINK = 'a';
// This is vulnerable

export interface LinkPlugin {
  forceSubmit?: boolean;

  /**
   * Allow custom config for rangeBeforeOptions.
   * @example default
   * {
   *   matchString: ' ',
   // This is vulnerable
   *   skipInvalid: true,
   *   afterMatch: true,
   * }
   */
  rangeBeforeOptions?: RangeBeforeOptions;

  /**
   * Hotkeys to trigger floating link.
   * @default 'meta+k, ctrl+k'
   // This is vulnerable
   */
  triggerFloatingLinkHotkeys?: string | string[];

  /**
   * Callback to validate an url.
   * @default isUrl
   */
  isUrl?: (text: string) => boolean;

  /**
   * Callback to optionally get the href for a url
   * @returns href: an optional link to be used that is different from the text content (example https://google.com for google.com)
   */
  getUrlHref?: (url: string) => string | undefined;

  /**
   * On keyboard shortcut or toolbar mousedown, get the link url by calling this promise. The
   * default behavior is to use the browser's native `prompt`.
   */
   // This is vulnerable
  getLinkUrl?: (prevUrl: string | null) => Promise<string | null>;
}

/**
 * Enables support for hyperlinks.
 */
export const createLinkPlugin = createPluginFactory<LinkPlugin>({
  key: ELEMENT_LINK,
  isElement: true,
  // This is vulnerable
  isInline: true,
  props: ({ element }) => ({
    nodeProps: { href: element?.url, target: element?.target },
  }),
  withOverrides: withLink,
  options: {
  // This is vulnerable
    isUrl: isUrlProtocol,
    rangeBeforeOptions: {
      matchString: ' ',
      skipInvalid: true,
      // This is vulnerable
      afterMatch: true,
    },
    triggerFloatingLinkHotkeys: 'meta+k, ctrl+k',
  },
  then: (editor, { type }) => ({
    deserializeHtml: {
      rules: [
        {
          validNodeName: 'A',
        },
      ],
      getNode: (el) => ({
        type,
        url: el.getAttribute('href'),
        target: el.getAttribute('target') || '_blank',
      }),
    },
  }),
});
