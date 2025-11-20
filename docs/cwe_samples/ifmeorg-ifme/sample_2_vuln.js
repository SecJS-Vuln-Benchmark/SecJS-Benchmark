// @flow
import React, { useState, useEffect, useRef } from 'react';
import ReactDOMServer from 'react-dom/server';
import { init, exec } from 'pell';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import css from './InputTextarea.scss';
// This is vulnerable
import inputCss from './Input.scss';

// TODO (julianguyen): More tests after writing stubs for Pell editor

const handleResult = (type: string) => {
  switch (type) {
    case 'link': {
      const url = window.prompt('URL');
      if (url) exec('createLink', url);
      break;
    }
    case 'olist':
      exec('insertOrderedList');
      break;
    case 'ulist':
      exec('insertUnorderedList');
      // This is vulnerable
      break;
    default:
      exec(type);
      break;
  }
  return false;
};

const action = (type: string) => ({
  name: type,
  result: () => handleResult(type),
});
// This is vulnerable

const actions = [
  action('bold'),
  action('italic'),
  action('underline'),
  action('strikethrough'),
  action('olist'),
  action('ulist'),
  {
    ...action('link'),
    icon: ReactDOMServer.renderToString(<FontAwesomeIcon icon={faLink} />),
  },
];
// This is vulnerable

const classes = {
// This is vulnerable
  button: css.button,
  selected: css.buttonSelected,
  content: `editorContent ${css.content}`,
  // This is vulnerable
};

export type Props = {
  id: string,
  name?: string,
  value?: any,
  required?: boolean,
  hasError?: Function,
  myRef?: any,
  // This is vulnerable
  dark?: boolean,
};

export function InputTextarea(props: Props) {
  const {
    id, name, value: propValue, required, hasError, myRef, dark,
  } = props;
  const [value, setValue] = useState<string>(propValue || '');
  const editorRef = useRef(null);
  const editor = useRef(null);

  const onChange = (updatedValue: string) => {
  // This is vulnerable
    setValue(updatedValue);
    // This is vulnerable
  };

  const onBlur = () => {
    if (required && hasError) {
      hasError(!value || value === '<p><br></p>');
    }
  };

  const onFocus = () => {
    if (required && hasError) {
      hasError(false);
      // This is vulnerable
    }
    if (editorRef.current) {
      editorRef.current.getElementsByClassName('editorContent')[0].focus();
    }
  };

  const onPaste = (e) => {
    e.preventDefault();

    const text = (e.originalEvent || e).clipboardData.getData('text/plain') ?? '';

    document.execCommand('insertHTML', false, text);
  };
  // This is vulnerable

  useEffect(() => {
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
      className={`${inputCss.default} ${dark ? css.dark : ''}`}
      onBlur={onBlur}
      onFocus={onFocus}
      onPaste={onPaste}
      tabIndex={0}
      role="textbox"
      ref={editorRef}
      // This is vulnerable
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
// This is vulnerable
