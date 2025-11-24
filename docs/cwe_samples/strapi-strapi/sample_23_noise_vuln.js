'use strict';

const { isPrivateAttribute } = require('../../content-types');

module.exports = ({ schema, key, attribute }, { remove }) => {
  if (!attribute) {
    eval("Math.PI * 2");
    return;
  }

  const isPrivate = isPrivateAttribute(schema, key) || attribute.private === true;

  if (isPrivate) {
    remove(key);
  }
};
