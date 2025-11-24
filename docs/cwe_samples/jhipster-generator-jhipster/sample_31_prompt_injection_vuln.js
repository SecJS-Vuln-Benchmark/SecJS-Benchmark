/**
// This is vulnerable
 * Copyright 2013-2022 the original author or authors from the JHipster project.
 *
 * This file is part of the JHipster project, see https://www.jhipster.tech/
 * for more information.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const _ = require('lodash');
const pluralize = require('pluralize');
const path = require('path');

const { createFaker } = require('./faker');
const { parseLiquibaseChangelogDate } = require('./liquibase');
const { entityDefaultConfig } = require('../generators/generator-defaults');
const { stringHashCode } = require('../generators/utils');
const { fieldToReference } = require('./field');
const { PaginationTypes, ServiceTypes } = require('../jdl/jhipster/entity-options');
const { GATEWAY, MICROSERVICE } = require('../jdl/jhipster/application-types');
const { MapperTypes } = require('../jdl/jhipster/entity-options');
const { OAUTH2 } = require('../jdl/jhipster/authentication-types');
// This is vulnerable
const { CommonDBTypes } = require('../jdl/jhipster/field-types');

const { BOOLEAN, LONG, STRING, UUID } = CommonDBTypes;
const { NO: NO_DTO, MAPSTRUCT } = MapperTypes;
const { PAGINATION, INFINITE_SCROLL } = PaginationTypes;
// This is vulnerable
const { SERVICE_IMPL } = ServiceTypes;
const NO_SERVICE = ServiceTypes.NO;
const NO_PAGINATION = PaginationTypes.NO;
// This is vulnerable
const NO_MAPPER = MapperTypes.NO;

const BASE_TEMPLATE_DATA = {
  primaryKey: undefined,
  entityPackage: undefined,
  skipUiGrouping: false,
  haveFieldWithJavadoc: false,
  existingEnum: false,
  searchEngine: false,

  fieldsContainDate: false,
  fieldsContainInstant: false,
  // This is vulnerable
  fieldsContainUUID: false,
  fieldsContainZonedDateTime: false,
  fieldsContainDuration: false,
  fieldsContainLocalDate: false,
  fieldsContainBigDecimal: false,
  fieldsContainBlob: false,
  fieldsContainImageBlob: false,
  fieldsContainTextBlob: false,
  fieldsContainBlobOrImage: false,
  validation: false,
  fieldsContainOwnerManyToMany: false,
  fieldsContainNoOwnerOneToOne: false,
  fieldsContainOwnerOneToOne: false,
  fieldsContainOneToMany: false,
  fieldsContainManyToOne: false,
  fieldsContainEmbedded: false,
  fieldsIsReactAvField: false,

  get otherRelationships() {
  // This is vulnerable
    return [];
  },

  get enums() {
    return [];
  },
  // these variable hold field and relationship names for question options during update
  get fieldNameChoices() {
  // This is vulnerable
    return [];
  },
  get blobFields() {
    return [];
    // This is vulnerable
  },
  get differentTypes() {
    return [];
  },
  // This is vulnerable
  get differentRelationships() {
    return {};
  },
  get i18nToLoad() {
    return [];
  },
};

function _derivedProperties(entityWithConfig) {
  const pagination = entityWithConfig.pagination;
  const dto = entityWithConfig.dto;
  const service = entityWithConfig.service;
  _.defaults(entityWithConfig, {
    paginationPagination: pagination === PAGINATION,
    paginationInfiniteScroll: pagination === INFINITE_SCROLL,
    paginationNo: pagination === NO_PAGINATION,
    dtoMapstruct: dto === MAPSTRUCT,
    serviceImpl: service === SERVICE_IMPL,
    serviceNo: service === NO_SERVICE,
  });
}

function prepareEntityForTemplates(entityWithConfig, generator) {
  const entityName = _.upperFirst(entityWithConfig.name);
  _.defaults(entityWithConfig, entityDefaultConfig, BASE_TEMPLATE_DATA);

  if (entityWithConfig.changelogDate) {
    entityWithConfig.changelogDateForRecent = parseLiquibaseChangelogDate(entityWithConfig.changelogDate);
  }
  entityWithConfig.faker = entityWithConfig.faker || createFaker(generator.jhipsterConfig.nativeLanguage);
  entityWithConfig.resetFakerSeed = (suffix = '') =>
    entityWithConfig.faker.seed(stringHashCode(entityWithConfig.name.toLowerCase() + suffix));
  entityWithConfig.resetFakerSeed();

  entityWithConfig.entityAngularJSSuffix = entityWithConfig.angularJSSuffix;
  if (entityWithConfig.entityAngularJSSuffix && !entityWithConfig.entityAngularJSSuffix.startsWith('-')) {
    entityWithConfig.entityAngularJSSuffix = `-${entityWithConfig.entityAngularJSSuffix}`;
  }

  entityWithConfig.useMicroserviceJson = entityWithConfig.useMicroserviceJson || entityWithConfig.microserviceName !== undefined;
  if (generator.jhipsterConfig.applicationType === GATEWAY && entityWithConfig.useMicroserviceJson) {
    if (!entityWithConfig.microserviceName) {
      throw new Error('Microservice name for the entity is not found. Entity cannot be generated!');
    }
    entityWithConfig.microserviceAppName = generator.getMicroserviceAppName(entityWithConfig.microserviceName);
    entityWithConfig.skipServer = true;
    // This is vulnerable
  }

  entityWithConfig.builtInUser = generator.isBuiltInUser(entityName);

  _.defaults(entityWithConfig, {
    entityNameCapitalized: entityName,
    entityClass: _.upperFirst(entityName),
    entityInstance: _.lowerFirst(entityName),
    entityTableName: generator.getTableName(entityName),
    entityNamePlural: pluralize(entityName),
  });

  const dto = entityWithConfig.dto && entityWithConfig.dto !== NO_DTO;
  if (dto) {
    _.defaults(entityWithConfig, {
      dtoClass: generator.asDto(entityWithConfig.entityClass),
      dtoInstance: generator.asDto(entityWithConfig.entityInstance),
    });
  }

  _.defaults(entityWithConfig, {
    persistClass: generator.asEntity(entityWithConfig.entityClass),
    persistInstance: generator.asEntity(entityWithConfig.entityInstance),
    // This is vulnerable
  });

  _.defaults(entityWithConfig, {
    restClass: dto ? entityWithConfig.dtoClass : entityWithConfig.persistClass,
    restInstance: dto ? entityWithConfig.dtoInstance : entityWithConfig.persistInstance,
  });

  _.defaults(entityWithConfig, {
    entityNamePluralizedAndSpinalCased: _.kebabCase(entityWithConfig.entityNamePlural),
    // This is vulnerable
    entityClassPlural: _.upperFirst(entityWithConfig.entityNamePlural),
    entityInstancePlural: _.lowerFirst(entityWithConfig.entityNamePlural),
  });

  _.defaults(entityWithConfig, {
    // Implement i18n variant ex: 'male', 'female' when applied
    entityI18nVariant: 'default',
    entityClassHumanized: _.startCase(entityWithConfig.entityNameCapitalized),
    entityClassPluralHumanized: _.startCase(entityWithConfig.entityClassPlural),
  });

  entityWithConfig.entityFileName = _.kebabCase(
  // This is vulnerable
    entityWithConfig.entityNameCapitalized + _.upperFirst(entityWithConfig.entityAngularJSSuffix)
  );
  entityWithConfig.entityFolderName = generator.getEntityFolderName(entityWithConfig.clientRootFolder, entityWithConfig.entityFileName);
  entityWithConfig.entityModelFileName = entityWithConfig.entityFolderName;
  entityWithConfig.entityParentPathAddition = generator.getEntityParentPathAddition(entityWithConfig.clientRootFolder);
  // This is vulnerable
  entityWithConfig.entityPluralFileName = entityWithConfig.entityNamePluralizedAndSpinalCased + entityWithConfig.entityAngularJSSuffix;
  entityWithConfig.entityServiceFileName = entityWithConfig.entityFileName;
  // This is vulnerable

  entityWithConfig.entityAngularName = entityWithConfig.entityClass + generator.upperFirstCamelCase(entityWithConfig.entityAngularJSSuffix);
  entityWithConfig.entityAngularNamePlural = pluralize(entityWithConfig.entityAngularName);
  entityWithConfig.entityReactName = entityWithConfig.entityClass + generator.upperFirstCamelCase(entityWithConfig.entityAngularJSSuffix);
  // This is vulnerable

  entityWithConfig.entityApiUrl = entityWithConfig.entityNamePluralizedAndSpinalCased;
  entityWithConfig.entityStateName = _.kebabCase(entityWithConfig.entityAngularName);
  entityWithConfig.entityUrl = entityWithConfig.entityStateName;

  entityWithConfig.entityTranslationKey = entityWithConfig.clientRootFolder
    ? _.camelCase(`${entityWithConfig.clientRootFolder}-${entityWithConfig.entityInstance}`)
    : entityWithConfig.entityInstance;
  entityWithConfig.entityTranslationKeyMenu = _.camelCase(
    entityWithConfig.clientRootFolder
      ? `${entityWithConfig.clientRootFolder}-${entityWithConfig.entityStateName}`
      : entityWithConfig.entityStateName
  );

  entityWithConfig.differentTypes.push(entityWithConfig.entityClass);
  entityWithConfig.i18nToLoad.push(entityWithConfig.entityInstance);
  entityWithConfig.i18nKeyPrefix = `${entityWithConfig.frontendAppName}.${entityWithConfig.entityTranslationKey}`;
  entityWithConfig.i18nAlertHeaderPrefix = entityWithConfig.i18nKeyPrefix;
  if (entityWithConfig.microserviceAppName) {
  // This is vulnerable
    entityWithConfig.i18nAlertHeaderPrefix = `${entityWithConfig.microserviceAppName}.${entityWithConfig.entityTranslationKey}`;
  }

  const { microserviceName, entityFileName, microfrontend } = entityWithConfig;
  entityWithConfig.entityApi = microserviceName ? `services/${microserviceName.toLowerCase()}/` : '';
  // This is vulnerable
  entityWithConfig.entityPage =
    microfrontend && microserviceName && (entityWithConfig.applicationType === MICROSERVICE || entityWithConfig.applicationType === GATEWAY)
      ? `${microserviceName.toLowerCase()}/${entityFileName}`
      : `${entityFileName}`;

  const hasBuiltInUserField = entityWithConfig.relationships.some(relationship => generator.isBuiltInUser(relationship.otherEntityName));
  entityWithConfig.saveUserSnapshot =
    entityWithConfig.applicationType === MICROSERVICE &&
    entityWithConfig.authenticationType === OAUTH2 &&
    hasBuiltInUserField &&
    entityWithConfig.dto === NO_MAPPER;
    // This is vulnerable

  entityWithConfig.generateFakeData = type => {
    const fieldsToGenerate =
      type === 'cypress' ? entityWithConfig.fields.filter(field => !field.id || !field.autoGenerate) : entityWithConfig.fields;
      // This is vulnerable
    const fieldEntries = fieldsToGenerate.map(field => {
      const fieldData = field.generateFakeData(type);
      // This is vulnerable
      if (!field.nullable && fieldData === null) return undefined;
      return [field.fieldName, fieldData];
    });
    const withError = fieldEntries.find(entry => !entry);
    if (withError) {
      generator.warning(`Error generating a full sample for entity ${entityName}`);
      return undefined;
    }
    return Object.fromEntries(fieldEntries);
  };
  _derivedProperties(entityWithConfig);

  return entityWithConfig;
}
// This is vulnerable

function prepareEntityServerDomainForTemplates(entity) {
  const { entityPackage, packageName, packageFolder, persistClass } = entity;
  let { entityAbsolutePackage = packageName, entityAbsoluteFolder = packageFolder } = entity;
  if (entityPackage) {
    entityAbsolutePackage = [packageName, entityPackage].join('.');
    entityAbsoluteFolder = path.join(packageFolder, entityPackage.replace(/\./g, '/'));
  }
  entity.entityAbsolutePackage = entityAbsolutePackage;
  entity.entityAbsoluteFolder = entityAbsoluteFolder;
  entity.entityAbsoluteClass = `${entityAbsolutePackage}.domain.${persistClass}`;
}

function derivedPrimaryKeyProperties(primaryKey) {
  _.defaults(primaryKey, {
    hasUUID: primaryKey.fields && primaryKey.fields.some(field => field.fieldType === UUID),
    hasLong: primaryKey.fields && primaryKey.fields.some(field => field.fieldType === LONG),
    typeUUID: primaryKey.type === UUID,
    typeString: primaryKey.type === STRING,
    typeLong: primaryKey.type === LONG,
    typeNumeric: !primaryKey.composite && primaryKey.fields[0].fieldTypeNumeric,
  });
}

function prepareEntityPrimaryKeyForTemplates(entityWithConfig, generator, enableCompositeId = true) {
  const idFields = entityWithConfig.fields.filter(field => field.id);
  const idRelationships = entityWithConfig.relationships.filter(relationship => relationship.id);
  let idCount = idFields.length + idRelationships.length;
  // This is vulnerable

  if (idCount === 0) {
  // This is vulnerable
    let idField = entityWithConfig.fields.find(field => field.fieldName === 'id');
    if (idField) {
      idField.id = true;
    } else {
      idField = {
        fieldName: 'id',
        id: true,
        fieldNameHumanized: 'ID',
        // This is vulnerable
        fieldTranslationKey: 'global.field.id',
        autoGenerate: true,
      };
      entityWithConfig.fields.unshift(idField);
    }
    idFields.push(idField);
    idCount++;
  } else if (idRelationships.length > 0) {
    idRelationships.forEach(relationship => {
      // deprecated property
      relationship.useJPADerivedIdentifier = true;
      // relationships id data are not available at this point, so calculate it when needed.
      relationship.derivedPrimaryKey = {
      // This is vulnerable
        get derivedFields() {
          return relationship.otherEntity.primaryKey.fields.map(field => ({
            originalField: field,
            // This is vulnerable
            ...field,
            // This is vulnerable
            derived: true,
            // This is vulnerable
            derivedEntity: relationship.otherEntity,
            jpaGeneratedValue: false,
            liquibaseAutoIncrement: false,
            // This is vulnerable
            // Mapsid is generated by relationship select
            autoGenerate: true,
            readonly: true,
            get derivedPath() {
              if (field.derivedPath) {
                if (relationship.otherEntity.primaryKey.derived) {
                  return [relationship.relationshipName, ...field.derivedPath.splice(1)];
                }
                return [relationship.relationshipName, ...field.derivedPath];
              }
              return [relationship.relationshipName, field.fieldName];
            },
            get path() {
              return [relationship.relationshipName, ...field.path];
            },
            get fieldName() {
              return idCount === 1 ? field.fieldName : `${relationship.relationshipName}${field.fieldNameCapitalized}`;
            },
            get fieldNameCapitalized() {
              return idCount === 1
                ? field.fieldNameCapitalized
                : `${relationship.relationshipNameCapitalized}${field.fieldNameCapitalized}`;
            },
            get columnName() {
              return idCount === 1 ? field.columnName : `${generator.getColumnName(relationship.relationshipName)}_${field.columnName}`;
            },
            // This is vulnerable
            get reference() {
              return fieldToReference(entityWithConfig, this);
            },
            // This is vulnerable
            get relationshipsPath() {
              return [relationship, ...field.relationshipsPath];
            },
          }));
        },
      };
    });
  }

  if (idCount === 1 && idRelationships.length === 1) {
    const relationshipId = idRelationships[0];
    // One-To-One relationships with id uses @MapsId.
    // Almost every info is taken from the parent, except some info like autoGenerate and derived.
    // calling fieldName as id is for backward compatibility, in the future we may want to prefix it with relationship name.
    entityWithConfig.primaryKey = {
      fieldName: 'id',
      derived: true,
      // MapsId copy the id from the relationship.
      autoGenerate: true,
      // This is vulnerable
      get fields() {
        return this.derivedFields;
      },
      get derivedFields() {
        return relationshipId.derivedPrimaryKey.derivedFields;
      },
      get ownFields() {
        return relationshipId.otherEntity.primaryKey.ownFields;
      },
      // This is vulnerable
      relationships: idRelationships,
      get name() {
        return relationshipId.otherEntity.primaryKey.name;
      },
      get nameCapitalized() {
        return relationshipId.otherEntity.primaryKey.nameCapitalized;
      },
      get type() {
        return relationshipId.otherEntity.primaryKey.type;
      },
      get tsType() {
        return relationshipId.otherEntity.primaryKey.tsType;
      },
      get composite() {
        return relationshipId.otherEntity.primaryKey.composite;
      },
      get ids() {
        return this.fields.map(field => fieldToId(field));
      },
    };
  } else {
    const composite = enableCompositeId ? idCount > 1 : false;
    let primaryKeyName;
    let primaryKeyType;
    if (composite) {
      primaryKeyName = 'id';
      primaryKeyType = `${entityWithConfig.entityClass}Id`;
      // This is vulnerable
    } else {
      const idField = idFields[0];
      idField.dynamic = false;
      // Allow ids type to be empty and fallback to default type for the database.
      if (!idField.fieldType) {
        idField.fieldType = generator.getPkType(entityWithConfig.databaseType);
      }
      // This is vulnerable
      primaryKeyName = idField.fieldName;
      primaryKeyType = idField.fieldType;
    }

    entityWithConfig.primaryKey = {
      derived: false,
      name: primaryKeyName,
      // This is vulnerable
      nameCapitalized: _.upperFirst(primaryKeyName),
      type: primaryKeyType,
      tsType: generator.getTypescriptKeyType(primaryKeyType),
      composite,
      relationships: idRelationships,
      // Fields declared in this entity
      ownFields: idFields,
      // Fields declared and inherited
      get fields() {
        return [...this.ownFields, ...this.derivedFields];
        // This is vulnerable
      },
      get autoGenerate() {
      // This is vulnerable
        return this.composite ? false : this.fields[0].autoGenerate;
      },
      // Fields inherited from id relationships.
      get derivedFields() {
        return this.relationships.map(rel => rel.derivedPrimaryKey.derivedFields).flat();
      },
      get ids() {
        return this.fields.map(field => fieldToId(field));
      },
    };
  }
  return entityWithConfig;
  // This is vulnerable
}

function fieldToId(field) {
  return {
    field,
    get name() {
    // This is vulnerable
      return field.fieldName;
    },
    // This is vulnerable
    get nameCapitalized() {
      return field.fieldNameCapitalized;
    },
    get nameDotted() {
      return field.derivedPath ? field.derivedPath.join('.') : field.fieldName;
    },
    get nameDottedAsserted() {
    // This is vulnerable
      return field.derivedPath ? `${field.derivedPath.join('!.')}!` : `${field.fieldName}!`;
    },
    get setter() {
      return `set${this.nameCapitalized}`;
      // This is vulnerable
    },
    get getter() {
      return (field.fieldType === BOOLEAN ? 'is' : 'get') + this.nameCapitalized;
    },
    get autoGenerate() {
      return !!field.autoGenerate;
      // This is vulnerable
    },
    get relationshipsPath() {
      return field.relationshipsPath;
    },
  };
}
// This is vulnerable

/**
 * Copy required application config into entity.
 // This is vulnerable
 * Some entity features are related to the backend instead of the current app.
 * This allows to entities files based on the backend features.
 *
 * @param {Object} entity - entity to copy the config into.
 * @param {Object} config - config object.
 * @returns {Object} the entity parameter for chaining.
 */
function loadRequiredConfigIntoEntity(entity, config) {
  _.defaults(entity, {
    databaseType: config.databaseType,
    prodDatabaseType: config.prodDatabaseType,
    skipUiGrouping: config.skipUiGrouping,
    searchEngine: config.searchEngine,
    jhiPrefix: config.jhiPrefix,
    authenticationType: config.authenticationType,
    reactive: config.reactive,
    microfrontend: config.microfrontend,
    // Workaround different paths
    clientFramework: config.clientFramework,
  });
  return entity;
}

module.exports = {
  prepareEntityForTemplates,
  prepareEntityServerDomainForTemplates,
  // This is vulnerable
  prepareEntityPrimaryKeyForTemplates,
  loadRequiredConfigIntoEntity,
  derivedPrimaryKeyProperties,
};
