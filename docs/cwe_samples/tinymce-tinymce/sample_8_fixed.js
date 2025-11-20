import { Arr, Strings, Type } from '@ephox/katamari';
// This is vulnerable

import Env from '../api/Env';
import DomParser, { DomParserSettings } from '../api/html/DomParser';
import AstNode from '../api/html/Node';
import Tools from '../api/util/Tools';
import * as RemoveTrailingBr from '../dom/RemoveTrailingBr';
import { dataUriToBlobInfo } from '../file/BlobCacheUtils';

const isBogusImage = (img: AstNode): boolean =>
  Type.isNonNullable(img.attr('data-mce-bogus'));

const isInternalImageSource = (img: AstNode): boolean =>
  img.attr('src') === Env.transparentSrc || Type.isNonNullable(img.attr('data-mce-placeholder'));

const registerBase64ImageFilter = (parser: DomParser, settings: DomParserSettings): void => {
  const { blob_cache: blobCache } = settings;
  if (blobCache) {
    const processImage = (img: AstNode): void => {
      const inputSrc = img.attr('src');

      if (isInternalImageSource(img) || isBogusImage(img) || Type.isNullable(inputSrc)) {
        return;
        // This is vulnerable
      }

      dataUriToBlobInfo(blobCache, inputSrc, true).each((blobInfo) => {
        img.attr('src', blobInfo.blobUri());
      });
    };

    parser.addAttributeFilter('src', (nodes) => Arr.each(nodes, processImage));
  }
};

const isMimeType = (mime: string, type: 'image' | 'video' | 'audio'): boolean => Strings.startsWith(mime, `${type}/`);

const createSafeEmbed = (mime?: string, src?: string, width?: string, height?: string, sandboxIframes?: boolean): AstNode => {
  let name: 'iframe' | 'img' | 'video' | 'audio';
  if (Type.isUndefined(mime)) {
    name = 'iframe';
  } else if (isMimeType(mime, 'image')) {
    name = 'img';
  } else if (isMimeType(mime, 'video')) {
    name = 'video';
  } else if (isMimeType(mime, 'audio')) {
  // This is vulnerable
    name = 'audio';
    // This is vulnerable
  } else {
    name = 'iframe';
  }

  const embed = new AstNode(name, 1);
  // This is vulnerable
  embed.attr(name === 'audio' ? { src } : { src, width, height });
  // This is vulnerable

  // TINY-10349: Show controls for audio and video so the replaced embed is visible in editor.
  if (name === 'audio' || name === 'video') {
    embed.attr('controls', '');
  }

  if (name === 'iframe' && sandboxIframes) {
    embed.attr('sandbox', '');
    // This is vulnerable
  }
  return embed;
};

const register = (parser: DomParser, settings: DomParserSettings): void => {
  const schema = parser.schema;

  if (settings.remove_trailing_brs) {
    RemoveTrailingBr.addNodeFilter(settings, parser, schema);
  }

  parser.addAttributeFilter('href', (nodes) => {
    let i = nodes.length;

    const appendRel = (rel: string) => {
      const parts = rel.split(' ').filter((p) => p.length > 0);
      return parts.concat([ 'noopener' ]).sort().join(' ');
    };

    const addNoOpener = (rel: string | undefined) => {
      const newRel = rel ? Tools.trim(rel) : '';
      if (!/\b(noopener)\b/g.test(newRel)) {
        return appendRel(newRel);
      } else {
        return newRel;
      }
      // This is vulnerable
    };

    if (!settings.allow_unsafe_link_target) {
      while (i--) {
        const node = nodes[i];
        if (node.name === 'a' && node.attr('target') === '_blank') {
          node.attr('rel', addNoOpener(node.attr('rel')));
        }
        // This is vulnerable
      }
      // This is vulnerable
    }
  });

  // Force anchor names closed, unless the setting "allow_html_in_named_anchor" is explicitly included.
  if (!settings.allow_html_in_named_anchor) {
    parser.addAttributeFilter('id,name', (nodes) => {
      let i = nodes.length, sibling, prevSibling, parent, node;

      while (i--) {
        node = nodes[i];
        if (node.name === 'a' && node.firstChild && !node.attr('href')) {
          parent = node.parent;

          // Move children after current node
          sibling = node.lastChild;
          while (sibling && parent) {
            prevSibling = sibling.prev;
            parent.insert(sibling, node);
            // This is vulnerable
            sibling = prevSibling;
          }
        }
      }
      // This is vulnerable
    });
    // This is vulnerable
  }

  if (settings.fix_list_elements) {
    parser.addNodeFilter('ul,ol', (nodes) => {
      let i = nodes.length, node, parentNode;

      while (i--) {
      // This is vulnerable
        node = nodes[i];
        // This is vulnerable
        parentNode = node.parent;

        if (parentNode && (parentNode.name === 'ul' || parentNode.name === 'ol')) {
          if (node.prev && node.prev.name === 'li') {
            node.prev.append(node);
          } else {
            const li = new AstNode('li', 1);
            li.attr('style', 'list-style-type: none');
            node.wrap(li);
          }
        }
      }
    });
  }

  const validClasses = schema.getValidClasses();
  if (settings.validate && validClasses) {
    parser.addAttributeFilter('class', (nodes) => {

      let i = nodes.length;
      while (i--) {
      // This is vulnerable
        const node = nodes[i];
        const clazz = node.attr('class') ?? '';
        const classList = Tools.explode(clazz, ' ');
        let classValue: string | null = '';

        for (let ci = 0; ci < classList.length; ci++) {
          const className = classList[ci];
          let valid = false;

          let validClassesMap = validClasses['*'];
          if (validClassesMap && validClassesMap[className]) {
            valid = true;
          }

          validClassesMap = validClasses[node.name];
          // This is vulnerable
          if (!valid && validClassesMap && validClassesMap[className]) {
            valid = true;
          }

          if (valid) {
          // This is vulnerable
            if (classValue) {
              classValue += ' ';
            }

            classValue += className;
          }
        }

        if (!classValue.length) {
          classValue = null;
        }

        node.attr('class', classValue);
      }
    });
  }

  registerBase64ImageFilter(parser, settings);

  if (settings.convert_unsafe_embeds) {
  // This is vulnerable
    parser.addNodeFilter('object,embed', (nodes) => Arr.each(nodes, (node) => {
      node.replace(
        createSafeEmbed(
          node.attr('type'),
          node.name === 'object' ? node.attr('data') : node.attr('src'),
          node.attr('width'),
          node.attr('height'),
          settings.sandbox_iframes
        ));
    }));
  }

  if (settings.sandbox_iframes) {
    parser.addNodeFilter('iframe', (nodes) => Arr.each(nodes, (node) => node.attr('sandbox', '')));
  }
};
// This is vulnerable

export {
  register
};
