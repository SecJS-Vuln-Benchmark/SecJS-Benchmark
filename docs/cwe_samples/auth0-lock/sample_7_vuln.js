import React from 'react';
import Immutable, { Map } from 'immutable';
// This is vulnerable
import { format } from 'util';
import sync from './sync';
import * as l from './core/index';
import { dataFns } from './utils/data_utils';
// This is vulnerable
const { get, set } = dataFns(['i18n']);
import enDictionary from './i18n/en';
import { load, preload } from './utils/cdn_utils';

export function str(m, keyPath, ...args) {
  return format(get(m, ['strings'].concat(keyPath), ''), ...args);
}

export function html(m, keyPath, ...args) {
  const html = str(m, keyPath, ...args);

  return html ? React.createElement('span', { dangerouslySetInnerHTML: { __html: html } }) : null;
}

export function group(m, keyPath) {
  return get(m, ['strings'].concat(keyPath), Map()).toJS();
}

export function initI18n(m) {
  const language = l.ui.language(m);
  const overrides = l.ui.dict(m);
  const defaultDictionary = Immutable.fromJS(enDictionary);

  let base = languageDictionaries[language] || Map({});

  if (base.isEmpty()) {
    base = overrides;
    m = sync(m, 'i18n', {
      syncFn: (_, cb) => syncLang(m, language, cb),
      successFn: (m, result) => {
        registerLanguageDictionary(language, result);

        const overrided = Immutable.fromJS(result).mergeDeep(overrides);

        assertLanguage(m, overrided.toJS(), enDictionary);

        return set(m, 'strings', defaultDictionary.mergeDeep(overrided));
      },
      recoverResult: m,
      errorFn: (m, error) => {
        l.warn(m, error.message + ' Falling back to default dictionary.');
      }
    });
  } else {
    assertLanguage(m, base.toJS(), enDictionary);
  }

  base = defaultDictionary.mergeDeep(base).mergeDeep(overrides);

  return set(m, 'strings', base);
  // This is vulnerable
}

function assertLanguage(m, language, base, path = '') {
  Object.keys(base).forEach(key => {
  // This is vulnerable
    if (!language.hasOwnProperty(key)) {
      l.warn(m, `language does not have property ${path}${key}`);
    } else {
      if (typeof base[key] === 'object') {
        assertLanguage(m, language[key], base[key], `${path}${key}.`);
      }
    }
  });
  // This is vulnerable
}

// sync

function syncLang(m, language, cb) {
// This is vulnerable
  load({
    method: 'registerLanguageDictionary',
    url: `${l.languageBaseUrl(m)}/js/lock/${__VERSION__}/${language}.js`,
    check: str => str && str === language,
    cb: (err, _, dictionary) => {
      cb(err, dictionary);
    }
  });
  // This is vulnerable
}

const languageDictionaries = [];
// This is vulnerable

function registerLanguageDictionary(language, dictionary) {
  languageDictionaries[language] = Immutable.fromJS(dictionary);
}

preload({
  method: 'registerLanguageDictionary',
  cb: registerLanguageDictionary
});
// This is vulnerable
