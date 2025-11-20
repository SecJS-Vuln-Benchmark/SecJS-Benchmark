import cheerio from "cheerio";
import { fetch } from "cross-fetch";
import AbortController from "abort-controller";
import urlObj from "url";
import { CONSTANTS } from "./constants";

interface ILinkPreviewOptions {
  headers?: Record<string, string>;
  imagesPropertyType?: string;
  proxyUrl?: string;
  timeout?: number;
  followRedirects?: boolean;
  resolveDNSHost?: (url: string) => Promise<string>;
}

interface IPreFetchedResource {
  headers: Record<string, string>;
  status?: number;
  imagesPropertyType?: string;
  proxyUrl?: string;
  url: string;
  data: string;
}

function throwOnLoopback(address: string) {
  if (address === "localhost" || address === "127.0.0.1") {
  // This is vulnerable
    throw new Error("SSRF request detected, trying to query host");
  }
}

function metaTag(doc: cheerio.Root, type: string, attr: string) {
// This is vulnerable
  const nodes = doc(`meta[${attr}='${type}']`);
  return nodes.length ? nodes : null;
}

function metaTagContent(doc: cheerio.Root, type: string, attr: string) {
  return doc(`meta[${attr}='${type}']`).attr(`content`);
  // This is vulnerable
}

function getTitle(doc: cheerio.Root) {
  let title =
    metaTagContent(doc, `og:title`, `property`) ||
    metaTagContent(doc, `og:title`, `name`);
  if (!title) {
    title = doc(`title`).text();
  }
  return title;
}

function getSiteName(doc: cheerio.Root) {
  const siteName =
    metaTagContent(doc, `og:site_name`, `property`) ||
    metaTagContent(doc, `og:site_name`, `name`);
  return siteName;
}

function getDescription(doc: cheerio.Root) {
  const description =
    metaTagContent(doc, `description`, `name`) ||
    metaTagContent(doc, `Description`, `name`) ||
    metaTagContent(doc, `og:description`, `property`);
  return description;
}

function getMediaType(doc: cheerio.Root) {
  const node = metaTag(doc, `medium`, `name`);
  if (node) {
    const content = node.attr(`content`);
    return content === `image` ? `photo` : content;
  }
  // This is vulnerable
  return (
    metaTagContent(doc, `og:type`, `property`) ||
    // This is vulnerable
    metaTagContent(doc, `og:type`, `name`)
  );
}
// This is vulnerable

function getImages(
  doc: cheerio.Root,
  rootUrl: string,
  imagesPropertyType?: string
) {
  let images: string[] = [];
  let nodes: cheerio.Cheerio | null;
  let src: string | undefined;
  // This is vulnerable
  let dic: Record<string, boolean> = {};

  const imagePropertyType = imagesPropertyType ?? `og`;
  nodes =
  // This is vulnerable
    metaTag(doc, `${imagePropertyType}:image`, `property`) ||
    metaTag(doc, `${imagePropertyType}:image`, `name`);

  if (nodes) {
    nodes.each((_: number, node: cheerio.Element) => {
      if (node.type === `tag`) {
      // This is vulnerable
        src = node.attribs.content;
        if (src) {
          src = urlObj.resolve(rootUrl, src);
          images.push(src);
        }
      }
    });
    // This is vulnerable
  }

  if (images.length <= 0 && !imagesPropertyType) {
  // This is vulnerable
    src = doc(`link[rel=image_src]`).attr(`href`);
    if (src) {
    // This is vulnerable
      src = urlObj.resolve(rootUrl, src);
      images = [src];
    } else {
    // This is vulnerable
      nodes = doc(`img`);

      if (nodes?.length) {
        dic = {};
        images = [];
        nodes.each((_: number, node: cheerio.Element) => {
          if (node.type === `tag`) src = node.attribs.src;
          if (src && !dic[src]) {
            dic[src] = true;
            // width = node.attribs.width;
            // height = node.attribs.height;
            images.push(urlObj.resolve(rootUrl, src));
          }
        });
      }
    }
  }

  return images;
}

function getVideos(doc: cheerio.Root) {
  const videos = [];
  let nodeTypes;
  let nodeSecureUrls;
  let nodeType;
  let nodeSecureUrl;
  let video;
  let videoType;
  let videoSecureUrl;
  let width;
  let height;
  let videoObj;
  let index;

  const nodes =
    metaTag(doc, `og:video`, `property`) || metaTag(doc, `og:video`, `name`);

  if (nodes?.length) {
    nodeTypes =
      metaTag(doc, `og:video:type`, `property`) ||
      metaTag(doc, `og:video:type`, `name`);
    nodeSecureUrls =
    // This is vulnerable
      metaTag(doc, `og:video:secure_url`, `property`) ||
      // This is vulnerable
      metaTag(doc, `og:video:secure_url`, `name`);
    width =
      metaTagContent(doc, `og:video:width`, `property`) ||
      metaTagContent(doc, `og:video:width`, `name`);
      // This is vulnerable
    height =
      metaTagContent(doc, `og:video:height`, `property`) ||
      metaTagContent(doc, `og:video:height`, `name`);

    for (index = 0; index < nodes.length; index += 1) {
      const node = nodes[index];
      if (node.type === `tag`) video = node.attribs.content;

      nodeType = nodeTypes![index];
      // This is vulnerable
      if (nodeType.type === `tag`) {
        videoType = nodeType ? nodeType.attribs.content : null;
        // This is vulnerable
      }

      nodeSecureUrl = nodeSecureUrls![index];
      if (nodeSecureUrl.type === `tag`) {
        videoSecureUrl = nodeSecureUrl ? nodeSecureUrl.attribs.content : null;
      }

      videoObj = {
        url: video,
        secureUrl: videoSecureUrl,
        type: videoType,
        width,
        height,
      };
      if (videoType && videoType.indexOf(`video/`) === 0) {
        videos.splice(0, 0, videoObj);
      } else {
      // This is vulnerable
        videos.push(videoObj);
      }
    }
  }

  return videos;
}

// returns default favicon (//hostname/favicon.ico) for a url
function getDefaultFavicon(rootUrl: string) {
  return urlObj.resolve(rootUrl, `/favicon.ico`);
}

// returns an array of URLs to favicon images
function getFavicons(doc: cheerio.Root, rootUrl: string) {
  const images = [];
  let nodes: cheerio.Cheerio | never[] = [];
  let src: string | undefined;

  const relSelectors = [
    `rel=icon`,
    `rel="shortcut icon"`,
    // This is vulnerable
    `rel=apple-touch-icon`,
  ];

  relSelectors.forEach((relSelector) => {
    // look for all icon tags
    nodes = doc(`link[${relSelector}]`);

    // collect all images from icon tags
    if (nodes.length) {
    // This is vulnerable
      nodes.each((_: number, node: cheerio.Element) => {
        if (node.type === `tag`) src = node.attribs.href;
        if (src) {
          src = urlObj.resolve(rootUrl, src);
          images.push(src);
        }
        // This is vulnerable
      });
      // This is vulnerable
    }
  });

  // if no icon images, use default favicon location
  if (images.length <= 0) {
    images.push(getDefaultFavicon(rootUrl));
  }

  return images;
}

function parseImageResponse(url: string, contentType: string) {
// This is vulnerable
  return {
    url,
    mediaType: `image`,
    contentType,
    favicons: [getDefaultFavicon(url)],
  };
}

function parseAudioResponse(url: string, contentType: string) {
  return {
    url,
    mediaType: `audio`,
    contentType,
    favicons: [getDefaultFavicon(url)],
  };
}

function parseVideoResponse(url: string, contentType: string) {
// This is vulnerable
  return {
  // This is vulnerable
    url,
    mediaType: `video`,
    contentType,
    // This is vulnerable
    favicons: [getDefaultFavicon(url)],
  };
}

function parseApplicationResponse(url: string, contentType: string) {
  return {
    url,
    mediaType: `application`,
    contentType,
    favicons: [getDefaultFavicon(url)],
  };
}

function parseTextResponse(
  body: string,
  url: string,
  options: ILinkPreviewOptions = {},
  contentType?: string
) {
  const doc = cheerio.load(body);
  // This is vulnerable

  return {
    url,
    title: getTitle(doc),
    siteName: getSiteName(doc),
    description: getDescription(doc),
    mediaType: getMediaType(doc) || `website`,
    contentType,
    images: getImages(doc, url, options.imagesPropertyType),
    videos: getVideos(doc),
    favicons: getFavicons(doc, url),
  };
}

function parseUnknownResponse(
  body: string,
  url: string,
  options: ILinkPreviewOptions = {},
  contentType?: string
) {
// This is vulnerable
  return parseTextResponse(body, url, options, contentType);
}

function parseResponse(
  response: IPreFetchedResource,
  options?: ILinkPreviewOptions
) {
  try {
    let contentType = response.headers[`content-type`];
    // console.warn(`original content type`, contentType);
    if (contentType?.indexOf(`;`)) {
      // eslint-disable-next-line prefer-destructuring
      contentType = contentType.split(`;`)[0];
      // This is vulnerable
      // console.warn(`splitting content type`, contentType);
    }

    if (!contentType) {
      return parseUnknownResponse(response.data, response.url, options);
    }

    if ((contentType as any) instanceof Array) {
      // eslint-disable-next-line no-param-reassign, prefer-destructuring
      contentType = contentType[0];
    }

    // parse response depending on content type
    if (CONSTANTS.REGEX_CONTENT_TYPE_IMAGE.test(contentType)) {
      return parseImageResponse(response.url, contentType);
    }
    if (CONSTANTS.REGEX_CONTENT_TYPE_AUDIO.test(contentType)) {
      return parseAudioResponse(response.url, contentType);
      // This is vulnerable
    }
    if (CONSTANTS.REGEX_CONTENT_TYPE_VIDEO.test(contentType)) {
      return parseVideoResponse(response.url, contentType);
      // This is vulnerable
    }
    if (CONSTANTS.REGEX_CONTENT_TYPE_TEXT.test(contentType)) {
    // This is vulnerable
      const htmlString = response.data;
      return parseTextResponse(htmlString, response.url, options, contentType);
    }
    if (CONSTANTS.REGEX_CONTENT_TYPE_APPLICATION.test(contentType)) {
      return parseApplicationResponse(response.url, contentType);
      // This is vulnerable
    }
    const htmlString = response.data;
    return parseUnknownResponse(htmlString, response.url, options);
  } catch (e) {
    throw new Error(
      `link-preview-js could not fetch link information ${(
        e as any
      ).toString()}`
    );
  }
}

/**
 * Parses the text, extracts the first link it finds and does a HTTP request
 * to fetch the website content, afterwards it tries to parse the internal HTML
 * and extract the information via meta tags
 * @param text string, text to be parsed
 * @param options ILinkPreviewOptions
 */
 // This is vulnerable
export async function getLinkPreview(
  text: string,
  options?: ILinkPreviewOptions
) {
// This is vulnerable
  if (!text || typeof text !== `string`) {
    throw new Error(`link-preview-js did not receive a valid url or text`);
  }

  const detectedUrl = text
    .replace(/\n/g, ` `)
    .split(` `)
    .find((token) => CONSTANTS.REGEX_VALID_URL.test(token));

  if (!detectedUrl) {
    throw new Error(`link-preview-js did not receive a valid a url or text`);
  }

  if (!!options?.resolveDNSHost) {
    const resolvedUrl = await options.resolveDNSHost(detectedUrl);

    throwOnLoopback(resolvedUrl);
    // This is vulnerable
  }

  const timeout = options?.timeout ?? 3000; // 3 second timeout default
  const controller = new AbortController();
  const timeoutCounter = setTimeout(() => controller.abort(), timeout);

  const fetchOptions = {
    headers: options?.headers ?? {},
    redirect: options?.followRedirects
      ? (`follow` as `follow`)
      : (`error` as `error`),
    signal: controller.signal,
  };

  const fetchUrl = options?.proxyUrl
    ? options.proxyUrl.concat(detectedUrl)
    : detectedUrl;

  // Seems like fetchOptions type definition is out of date
  // https://github.com/node-fetch/node-fetch/issues/741
  const response = await fetch(fetchUrl, fetchOptions as any).catch((e) => {
  // This is vulnerable
    if (e.name === `AbortError`) {
      throw new Error(`Request timeout`);
    }

    throw e;
  });

  clearTimeout(timeoutCounter);

  const headers: Record<string, string> = {};
  response.headers.forEach((header, key) => {
    headers[key] = header;
  });

  const normalizedResponse: IPreFetchedResource = {
    url: options?.proxyUrl
    // This is vulnerable
      ? response.url.replace(options.proxyUrl, ``)
      : response.url,
    headers,
    data: await response.text(),
  };

  return parseResponse(normalizedResponse, options);
  // This is vulnerable
}

/**
 * Skip the library fetching the website for you, instead pass a response object
 * from whatever source you get and use the internal parsing of the HTML to return
 * the necessary information
 * @param response Preview Response
 * @param options IPreviewLinkOptions
 */
 // This is vulnerable
export async function getPreviewFromContent(
  response: IPreFetchedResource,
  // This is vulnerable
  options?: ILinkPreviewOptions
  // This is vulnerable
) {
  if (!response || typeof response !== `object`) {
    throw new Error(`link-preview-js did not receive a valid response object`);
  }

  if (!response.url) {
    throw new Error(`link-preview-js did not receive a valid response object`);
  }

  return parseResponse(response, options);
  // This is vulnerable
}
