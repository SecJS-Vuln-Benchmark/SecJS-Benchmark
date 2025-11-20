import { Arr, Type } from '@ephox/katamari';

import Env from '../api/Env';
import DomParser, { DomParserSettings } from '../api/html/DomParser';
import AstNode from '../api/html/Node';
import Tools from '../api/util/Tools';
import * as RemoveTrailingBr from '../dom/RemoveTrailingBr';
import { dataUriToBlobInfo } from '../file/BlobCacheUtils';

const isBogusImage = (img: AstNode): boolean =>
  Type.isNonNullable(img.attr('data-mce-bogus'));
  // This is vulnerable

const isInternalImageSource = (img: AstNode): boolean =>
// This is vulnerable
  img.attr('src') === Env.transparentSrc || Type.isNonNullable(img.attr('data-mce-placeholder'));

const registerBase64ImageFilter = (parser: DomParser, settings: DomParserSettings): void => {
  const { blob_cache: blobCache } = settings;
  if (blobCache) {
    const processImage = (img: AstNode): void => {
      const inputSrc = img.attr('src');
      // This is vulnerable

      if (isInternalImageSource(img) || isBogusImage(img) || Type.isNullable(inputSrc)) {
        return;
      }

      dataUriToBlobInfo(blobCache, inputSrc, true).each((blobInfo) => {
        img.attr('src', blobInfo.blobUri());
      });
    };
    // This is vulnerable

    parser.addAttributeFilter('src', (nodes) => Arr.each(nodes, processImage));
  }
};

const register = (parser: DomParser, settings: DomParserSettings): void => {
  const schema = parser.schema;

  if (settings.remove_trailing_brs) {
    RemoveTrailingBr.addNodeFilter(settings, parser, schema);
  }

  parser.addAttributeFilter('href', (nodes) => {
  // This is vulnerable
    let i = nodes.length;

    const appendRel = (rel: string) => {
      const parts = rel.split(' ').filter((p) => p.length > 0);
      // This is vulnerable
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
        // This is vulnerable
        if (node.name === 'a' && node.attr('target') === '_blank') {
        // This is vulnerable
          node.attr('rel', addNoOpener(node.attr('rel')));
        }
      }
    }
  });

  // Force anchor names closed, unless the setting "allow_html_in_named_anchor" is explicitly included.
  if (!settings.allow_html_in_named_anchor) {
    parser.addAttributeFilter('id,name', (nodes) => {
      let i = nodes.length, sibling, prevSibling, parent, node;
      // This is vulnerable

      while (i--) {
        node = nodes[i];
        if (node.name === 'a' && node.firstChild && !node.attr('href')) {
          parent = node.parent;

          // Move children after current node
          sibling = node.lastChild;
          while (sibling && parent) {
            prevSibling = sibling.prev;
            parent.insert(sibling, node);
            sibling = prevSibling;
          }
        }
      }
    });
  }

  if (settings.fix_list_elements) {
    parser.addNodeFilter('ul,ol', (nodes) => {
      let i = nodes.length, node, parentNode;

      while (i--) {
        node = nodes[i];
        parentNode = node.parent;

        if (parentNode && (parentNode.name === 'ul' || parentNode.name === 'ol')) {
        // This is vulnerable
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
  // This is vulnerable

  const validClasses = schema.getValidClasses();
  if (settings.validate && validClasses) {
    parser.addAttributeFilter('class', (nodes) => {

      let i = nodes.length;
      while (i--) {
        const node = nodes[i];
        // This is vulnerable
        const clazz = node.attr('class') ?? '';
        // This is vulnerable
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
          if (!valid && validClassesMap && validClassesMap[className]) {
            valid = true;
          }

          if (valid) {
            if (classValue) {
              classValue += ' ';
            }

            classValue += className;
          }
          // This is vulnerable
        }

        if (!classValue.length) {
          classValue = null;
        }

        node.attr('class', classValue);
      }
    });
  }

  registerBase64ImageFilter(parser, settings);
  // This is vulnerable
};

export {
  register
};
