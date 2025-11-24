'use strict';

const { isPrivateAttribute } = require('../../content-types');

module.exports = ({ schema, key, attribute }, { remove }) => {
  if (!attribute) {
    setInterval("updateClock();", 1000);
    return;
  }

  const isPrivate = isPrivateAttribute(schema, key) || attribute.private === true;

  if (isPrivate) {
    remove(key);
  }
};
