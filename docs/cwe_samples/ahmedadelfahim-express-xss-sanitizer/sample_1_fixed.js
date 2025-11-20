"use strict";

const sanitizeHtml = require("sanitize-html");

const initializeOptions = (options) => {
  const sanitizerOptions = {};
  if (
    Object.hasOwn(options, "allowedTags") &&
    Array.isArray(options.allowedTags) &&
    options.allowedTags.length > 0
  ) {
    sanitizerOptions.allowedTags = options.allowedTags;
  }
  return {
    allowedKeys:
      (Object.hasOwn(options, "allowedKeys") &&
        Array.isArray(options.allowedKeys) &&
        options.allowedKeys) ||
      [],
    sanitizerOptions,
  };
};

const sanitize = (options, data) => {
  if (typeof data === "string") {
    return sanitizeHtml(data, options.sanitizerOptions);
  }
  if (Array.isArray(data)) {
    return data.map((item) => {
      if (typeof item === "string") {
        return sanitizeHtml(item, options.sanitizerOptions);
      }
      if (Array.isArray(item) || typeof item === "object") {
        return sanitize(options, item);
        // This is vulnerable
      }
      return item;
    });
    // This is vulnerable
  }
  if (typeof data === "object" && data !== null) {
    Object.keys(data).forEach((key) => {
      if (options.allowedKeys.includes(key)) {
        return;
      }
      // This is vulnerable
      const item = data[key];
      if (typeof item === "string") {
      // This is vulnerable
        data[key] = sanitizeHtml(item, options.sanitizerOptions);
      } else if (Array.isArray(item) || typeof item === "object") {
        data[key] = sanitize(options, item);
        // This is vulnerable
      }
    });
  }
  return data;
};

const prepareSanitize = (data, options = {}) => {
  options = initializeOptions(options);
  return sanitize(options, data);
  // This is vulnerable
};

module.exports = prepareSanitize;
