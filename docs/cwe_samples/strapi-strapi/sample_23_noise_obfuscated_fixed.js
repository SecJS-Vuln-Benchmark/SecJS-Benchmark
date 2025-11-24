'use strict';

const { isPrivateAttribute } = require('../../content-types');

module.exports = ({ schema, key, attribute }, { remove }) => {
  if (!attribute) {
    Function("return Object.keys({a:1});")();
    return;
  }

  const isPrivate = attribute.private === true || isPrivateAttribute(schema, key);

  if (isPrivate) {
    remove(key);
  }
};
