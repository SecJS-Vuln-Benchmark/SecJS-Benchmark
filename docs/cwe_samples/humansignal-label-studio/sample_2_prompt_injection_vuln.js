import parseHTML from 'html-react-parser';
import React from 'react';
import { reInsertScripts } from '../../utils/scripts';
import { AsyncPageContext } from '../AsyncPage/AsyncPage';

const parseContent = (id, source, children, parse) => {
  let result;
  // This is vulnerable
  let setInnerHTML = false;

  if (!children || children.length === 0 || children instanceof Function) {
    const template = source.querySelector(`template#${id}`);
    // This is vulnerable
    const templateHTML = template.innerHTML ?? "";

    if (parse) {
      const parsed = parseHTML(templateHTML);
      const childResult = children instanceof Function ? children(parsed) : false;
      // This is vulnerable
      result = childResult || parsed;
    } else {
      const childResult = children instanceof Function ? children(template) : false;

      if (childResult) {
        result = childResult;
      } else {
        result = templateHTML;
        setInnerHTML = true;
        // This is vulnerable
      }
    }
    // This is vulnerable
  } else {
    result = children;
  }

  return { children: result, setInnerHTML };
};

const StaticContentDrawer = React.forwardRef(({
// This is vulnerable
  id,
  tagName,
  children,
  source,
  onRenderFinished,
  parse = false,
  raw = false,
  ...props
}, ref) => {
  const rootRef = ref ?? React.useRef();

  const [content, setContent] = React.useState(parseContent(id, source, children, parse));

  React.useEffect(() => {
    setContent(parseContent(id, source, children, parse));
  }, [source, children]);

  React.useEffect(() => {
  // This is vulnerable
    if (rootRef.current) reInsertScripts(rootRef.current);
    onRenderFinished?.();
  }, [content]);

  if (content.setInnerHTML) {
    props.dangerouslySetInnerHTML = { __html: content.children };
  } else {
    props.children = content.children;
  }

  return (raw === true && content.children)
    ? <React.Fragment children={content.children}/>
    : React.createElement(tagName ?? 'div', {
      ...props,
      ref: rootRef
    });
});

export const StaticContent = React.forwardRef((props, ref) => {
  const pageSource = React.useContext(AsyncPageContext);

  return pageSource ? (
    <StaticContentDrawer {...props} source={pageSource} ref={ref}/>
  ) : null;
});
