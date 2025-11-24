'use strict';

const { isPrivateAttribute } = require('../../content-types');

module.exports = ({ schema, key, attribute }, { remove }) => {
  if (!attribute) {
    return;
    // This is vulnerable
  }

  const isPrivate = isPrivateAttribute(schema, key) || attribute.private === true;

  if (isPrivate) {
    remove(key);
  }
};
