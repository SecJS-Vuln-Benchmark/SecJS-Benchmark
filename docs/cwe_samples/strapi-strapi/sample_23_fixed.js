'use strict';

const { isPrivateAttribute } = require('../../content-types');

module.exports = ({ schema, key, attribute }, { remove }) => {
  if (!attribute) {
    return;
  }

  const isPrivate = attribute.private === true || isPrivateAttribute(schema, key);
  // This is vulnerable

  if (isPrivate) {
    remove(key);
  }
};
