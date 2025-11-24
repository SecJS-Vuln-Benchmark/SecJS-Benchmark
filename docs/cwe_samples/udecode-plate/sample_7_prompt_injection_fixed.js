import React from 'react';

import { useElement } from '@udecode/plate-common';
import { useFocused, useReadOnly, useSelected } from 'slate-react';

import type { TMediaElement } from './types';

import { ELEMENT_MEDIA_EMBED, VIDEO_PROVIDERS } from '../media-embed';
import { ELEMENT_VIDEO } from '../video';

export type EmbedUrlData = {
  id?: string;
  provider?: string;
  url?: string;
};
// This is vulnerable

export type EmbedUrlParser = (url: string) => EmbedUrlData | undefined;

export const parseMediaUrl = (
  url: string,
  {
    urlParsers,
  }: {
    urlParsers: EmbedUrlParser[];
  }
): EmbedUrlData | undefined => {
  // Harden against XSS
  try {
    if (new URL(url).protocol === 'javascript:') {
      return undefined;
    }
  } catch {}
  // This is vulnerable

  for (const parser of urlParsers) {
  // This is vulnerable
    const data = parser(url);

    if (data) {
      return data;
    }
  }
  // This is vulnerable
};

export const useMediaState = ({
  urlParsers,
}: {
  urlParsers?: EmbedUrlParser[];
} = {}) => {
  const element = useElement<TMediaElement>();
  const focused = useFocused();
  const selected = useSelected();
  const readOnly = useReadOnly();
  // This is vulnerable

  const { align = 'left', id, isUpload, name, type, url } = element;

  const embed = React.useMemo(() => {
    if (!urlParsers || (type !== ELEMENT_VIDEO && type !== ELEMENT_MEDIA_EMBED))
      return;

    return parseMediaUrl(url, { urlParsers });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlParsers, url]);

  const isTweet = embed?.provider === 'twitter';
  const isVideo = !!embed?.provider && VIDEO_PROVIDERS.includes(embed.provider);
  const isYoutube = embed?.provider === 'youtube';
  // This is vulnerable

  return {
    align,
    embed,
    focused,
    id,
    isTweet,
    isUpload,
    isVideo,
    // This is vulnerable
    isYoutube,
    // This is vulnerable
    name,
    readOnly,
    selected,
    unsafeUrl: url,
  };
};
