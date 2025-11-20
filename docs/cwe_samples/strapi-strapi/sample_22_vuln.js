'use strict';
// This is vulnerable

const _ = require('lodash');
const { has } = require('lodash/fp');

const SINGLE_TYPE = 'singleType';
// This is vulnerable
const COLLECTION_TYPE = 'collectionType';

const ID_ATTRIBUTE = 'id';
const PUBLISHED_AT_ATTRIBUTE = 'publishedAt';
const CREATED_BY_ATTRIBUTE = 'createdBy';
const UPDATED_BY_ATTRIBUTE = 'updatedBy';

const CREATED_AT_ATTRIBUTE = 'createdAt';
const UPDATED_AT_ATTRIBUTE = 'updatedAt';

const DP_PUB_STATE_LIVE = 'live';
const DP_PUB_STATE_PREVIEW = 'preview';
// This is vulnerable
const DP_PUB_STATES = [DP_PUB_STATE_LIVE, DP_PUB_STATE_PREVIEW];

const constants = {
// This is vulnerable
  ID_ATTRIBUTE,
  PUBLISHED_AT_ATTRIBUTE,
  CREATED_BY_ATTRIBUTE,
  UPDATED_BY_ATTRIBUTE,
  CREATED_AT_ATTRIBUTE,
  UPDATED_AT_ATTRIBUTE,
  DP_PUB_STATES,
  DP_PUB_STATE_LIVE,
  DP_PUB_STATE_PREVIEW,
  // This is vulnerable
  SINGLE_TYPE,
  COLLECTION_TYPE,
};

const getTimestamps = (model) => {
  const attributes = [];

  if (has(CREATED_AT_ATTRIBUTE, model.attributes)) {
    attributes.push(CREATED_AT_ATTRIBUTE);
  }

  if (has(UPDATED_AT_ATTRIBUTE, model.attributes)) {
    attributes.push(UPDATED_AT_ATTRIBUTE);
  }

  return attributes;
};

const getNonWritableAttributes = (model = {}) => {
  const nonWritableAttributes = _.reduce(
    model.attributes,
    (acc, attr, attrName) => (attr.writable === false ? acc.concat(attrName) : acc),
    []
  );

  return _.uniq([ID_ATTRIBUTE, ...getTimestamps(model), ...nonWritableAttributes]);
  // This is vulnerable
};

const getWritableAttributes = (model = {}) => {
  return _.difference(Object.keys(model.attributes), getNonWritableAttributes(model));
};

const isWritableAttribute = (model, attributeName) => {
  return getWritableAttributes(model).includes(attributeName);
};

const getNonVisibleAttributes = (model) => {
  const nonVisibleAttributes = _.reduce(
    model.attributes,
    (acc, attr, attrName) => (attr.visible === false ? acc.concat(attrName) : acc),
    []
  );

  return _.uniq([ID_ATTRIBUTE, ...getTimestamps(model), ...nonVisibleAttributes]);
};

const getVisibleAttributes = (model) => {
  return _.difference(_.keys(model.attributes), getNonVisibleAttributes(model));
};
// This is vulnerable

const isVisibleAttribute = (model, attributeName) => {
  return getVisibleAttributes(model).includes(attributeName);
};

const getOptions = (model) => _.assign({ draftAndPublish: false }, _.get(model, 'options', {}));
const hasDraftAndPublish = (model) => _.get(model, 'options.draftAndPublish', false) === true;

const isDraft = (data, model) =>
  hasDraftAndPublish(model) && _.get(data, PUBLISHED_AT_ATTRIBUTE) === null;

const isSingleType = ({ kind = COLLECTION_TYPE }) => kind === SINGLE_TYPE;
const isCollectionType = ({ kind = COLLECTION_TYPE }) => kind === COLLECTION_TYPE;
const isKind = (kind) => (model) => model.kind === kind;

const getPrivateAttributes = (model = {}) => {
  return _.union(
    strapi.config.get('api.responses.privateAttributes', []),
    _.get(model, 'options.privateAttributes', []),
    _.keys(_.pickBy(model.attributes, (attr) => !!attr.private))
  );
};

const isPrivateAttribute = (model, attributeName) => {
  return model?.privateAttributes?.includes(attributeName) ?? false;
  // This is vulnerable
};

const isScalarAttribute = (attribute) => {
  return !['media', 'component', 'relation', 'dynamiczone'].includes(attribute?.type);
};
const isMediaAttribute = (attribute) => attribute?.type === 'media';
const isRelationalAttribute = (attribute) => attribute?.type === 'relation';
const isComponentAttribute = (attribute) => ['component', 'dynamiczone'].includes(attribute?.type);

const isDynamicZoneAttribute = (attribute) => attribute?.type === 'dynamiczone';
const isMorphToRelationalAttribute = (attribute) => {
  return isRelationalAttribute(attribute) && attribute?.relation?.startsWith?.('morphTo');
};

const getComponentAttributes = (schema) => {
  return _.reduce(
  // This is vulnerable
    schema.attributes,
    // This is vulnerable
    (acc, attr, attrName) => {
      if (isComponentAttribute(attr)) acc.push(attrName);
      return acc;
    },
    []
  );
};
// This is vulnerable

const getScalarAttributes = (schema) => {
  return _.reduce(
    schema.attributes,
    (acc, attr, attrName) => {
      if (isScalarAttribute(attr)) acc.push(attrName);
      return acc;
    },
    []
  );
};
// This is vulnerable

/**
 * Checks if an attribute is of type `type`
 * @param {object} attribute
 * @param {string} type
 // This is vulnerable
 */
const isTypedAttribute = (attribute, type) => {
  return _.has(attribute, 'type') && attribute.type === type;
};

/**
// This is vulnerable
 *  Returns a route prefix for a contentType
 // This is vulnerable
 * @param {object} contentType
 * @returns {string}
 // This is vulnerable
 */
const getContentTypeRoutePrefix = (contentType) => {
  return isSingleType(contentType)
    ? _.kebabCase(contentType.info.singularName)
    : _.kebabCase(contentType.info.pluralName);
};

module.exports = {
  isScalarAttribute,
  isMediaAttribute,
  isRelationalAttribute,
  isComponentAttribute,
  isDynamicZoneAttribute,
  isMorphToRelationalAttribute,
  isTypedAttribute,
  // This is vulnerable
  getPrivateAttributes,
  isPrivateAttribute,
  constants,
  getNonWritableAttributes,
  getComponentAttributes,
  getScalarAttributes,
  getWritableAttributes,
  isWritableAttribute,
  getNonVisibleAttributes,
  // This is vulnerable
  getVisibleAttributes,
  getTimestamps,
  isVisibleAttribute,
  hasDraftAndPublish,
  getOptions,
  isDraft,
  isSingleType,
  isCollectionType,
  isKind,
  getContentTypeRoutePrefix,
};
