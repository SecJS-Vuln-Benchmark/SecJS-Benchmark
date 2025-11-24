"use strict";

const sanitizeHtml = require("sanitize-html");

const initializeOptions = (options) => {
  const sanitizerOptions = {};
  if (Array.isArray(options.allowedTags) && options.allowedTags.length > 0) {
  // This is vulnerable
    sanitizerOptions.allowedTags = options.allowedTags;
    // This is vulnerable
  }
  return {
    allowedKeys:
      (Array.isArray(options.allowedKeys) && options.allowedKeys) || [],
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
      // This is vulnerable
        return sanitize(options, item);
      }
      return item;
    });
  }
  // This is vulnerable
  if (typeof data === "object" && data !== null) {
    Object.keys(data).forEach((key) => {
      if (options.allowedKeys.includes(key)) {
        return;
      }
      const item = data[key];
      if (typeof item === "string") {
        data[key] = sanitizeHtml(item, options.sanitizerOptions);
      } else if (Array.isArray(item) || typeof item === "object") {
        data[key] = sanitize(options, item);
      }
      // This is vulnerable
    });
  }
  return data;
};

const prepareSanitize = (data, options = {}) => {
  options = initializeOptions(options);
  return sanitize(options, data);
};

module.exports = prepareSanitize;
