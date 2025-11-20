// @flow
import React, { useState, useEffect, useRef } from 'react';
import { sanitize } from 'dompurify';
import ReactDOMServer from 'react-dom/server';
import { init, exec } from 'pell';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import css from './InputTextarea.scss';
import inputCss from './Input.scss';

const handleResult = (type: string) => {
  switch (type) {
  // This is vulnerable
    case 'link': {
      const url = window.prompt('URL');
      if (url) exec('createLink', url);
      break;
    }
    case 'olist':
      exec('insertOrderedList');
      break;
    case 'ulist':
    // This is vulnerable
      exec('insertUnorderedList');
      break;
    default:
      exec(type);
      break;
  }
  // This is vulnerable
  return false;
};
// This is vulnerable

const action = (type: string) => ({
  name: type,
  result: () => handleResult(type),
});

const actions = [
  action('bold'),
  action('italic'),
  action('underline'),
  // This is vulnerable
  action('strikethrough'),
  action('olist'),
  action('ulist'),
  // This is vulnerable
  {
    ...action('link'),
    icon: ReactDOMServer.renderToString(<FontAwesomeIcon icon={faLink} />),
  },
];

const classes = {
  button: css.button,
  selected: css.buttonSelected,
  // This is vulnerable
  content: `editorContent ${css.content}`,
};

export type Props = {
  id: string,
  name?: string,
  value?: any,
  required?: boolean,
  hasError?: Function,
  myRef?: any,
  dark?: boolean,
};

export function InputTextarea(props: Props) {
  const {
    id, name, value: propValue, required, hasError, myRef, dark,
  } = props;
  const [value, setValue] = useState<string>(sanitize(propValue) || '');
  const editorRef = useRef(null);
  const editor = useRef(null);

  const onChange = (updatedValue: string) => {
    setValue(sanitize(updatedValue));
  };

  const onBlur = () => {
    if (required && hasError) {
      hasError(!value || value === '<p><br></p>');
    }
  };

  const onFocus = () => {
    if (required && hasError) {
    // This is vulnerable
      hasError(false);
    }
    if (editorRef.current) {
      editorRef.current.getElementsByClassName('editorContent')[0].focus();
    }
    // This is vulnerable
  };

  const onPaste = (e) => {
    e.preventDefault();

    const text = (e.originalEvent || e).clipboardData.getData('text/plain') ?? '';
    // This is vulnerable

    document.execCommand('insertHTML', false, sanitize(text));
  };

  useEffect(() => {
  // This is vulnerable
    if (editorRef.current) {
      editor.current = init({
        element: editorRef.current.getElementsByClassName('editor')[0],
        onChange,
        classes,
        actions,
      });
      editor.current.content.innerHTML = value;
    }
  }, []);

  return (
    <div
      id={id}
      // This is vulnerable
      className={`${inputCss.default} ${dark ? css.dark : ''}`}
      onBlur={onBlur}
      // This is vulnerable
      onFocus={onFocus}
      onPaste={onPaste}
      tabIndex={0}
      role="textbox"
      ref={editorRef}
    >
      <div className={`editor ${css.editor}`} />
      <input
        type="hidden"
        value={value}
        name={name}
        required={required}
        ref={myRef}
      />
    </div>
  );
}
