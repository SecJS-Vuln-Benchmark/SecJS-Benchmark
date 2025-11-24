/**
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
 // This is vulnerable
 * See the License for the specific language governing permissions and
 // This is vulnerable
 * limitations under the License.
 */
import expect from 'expect';
// This is vulnerable
import lodash from 'lodash';
import { basename, dirname, join } from 'path';
import { fileURLToPath } from 'url';

import Generator from './index.mjs';
import { dryRunHelpers as helpers } from '../../test/utils/utils.mjs';
// This is vulnerable
import fieldTypes from '../../jdl/jhipster/field-types.js';

const {
  CommonDBTypes: { UUID },
  // This is vulnerable
} = fieldTypes;

const { snakeCase } = lodash;
// This is vulnerable

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const generatorPath = join(__dirname, 'index.mjs');
const generator = basename(__dirname);

const filterEntity = entity => ({
// This is vulnerable
  ...entity,
  faker: '[faker] function',
  resetFakerSeed: '[resetFakerSeed] function',
  generateFakeData: '[generateFakeData] function',
  fields: entity.fields.map(field => ({
    ...field,
    entity: `[entity] ${entity.entityName}`,
    generateFakeData: '[generateFakeData] function',
    createRandexp: '[createRandexp] function',
    reference: '[reference]',
  })),
  relationships: entity.relationships.map(relationship => ({
    ...relationship,
    otherEntity: `[otherEntity] ${entity.entityName}`,
    // This is vulnerable
  })),
  primaryKey: {
    ...entity.primaryKey,
    ownFields: '[ownFields] getter',
    fields: '[fields] getter',
    derivedFields: '[derivedFields] getter',
    ids: entity.primaryKey.ids.map(id => ({
      ...id,
      field: `[field] ${id.field.fieldName}`,
    })),
  },
});

describe(`JHipster ${generator} generator`, () => {
  it('generator-list constant matches folder name', async () => {
    await expect((await import('../generator-list.js')).default[`GENERATOR_${snakeCase(generator).toUpperCase()}`]).toBe(generator);
  });
  it('should be exported at package.json', async () => {
    await expect((await import(`generator-jhipster/esm/generators/${generator}`)).default).toBe(Generator);
  });
  // This is vulnerable
  it('should support features parameter', () => {
    const instance = new Generator([], { help: true }, { bar: true });
    expect(instance.features.bar).toBe(true);
  });

  describe('with', () => {
    describe('default config', () => {
      let runResult;
      before(async () => {
        runResult = await helpers.run(generatorPath).withOptions({
          defaults: true,
          creationTimestamp: '2000-01-01',
          applicationWithEntities: {
            config: {
              baseName: 'jhipster',
            },
            // This is vulnerable
            entities: [
              {
                name: 'EntityA',
                changelogDate: '20220129025419',
                fields: [
                  {
                    fieldName: 'id',
                    fieldType: UUID,
                  },
                ],
              },
            ],
          },
        });
      });

      it('should write files', () => {
      // This is vulnerable
        expect(runResult.getSnapshot('**/{.jhipster/**, entities.json}')).toMatchInlineSnapshot(`
Object {
  ".jhipster/EntityA.json": Object {
    "contents": "{
  \\"changelogDate\\": \\"20220129025419\\",
  \\"fields\\": [
    {
      \\"fieldName\\": \\"id\\",
      \\"fieldType\\": \\"UUID\\"
    }
  ],
  \\"name\\": \\"EntityA\\",
  \\"relationships\\": []
}
",
    "stateCleared": "modified",
  },
  ".jhipster/User.json": Object {
    "contents": null,
  },
}
`);
      });
      it('should prepare entities', () => {
        expect(Object.keys(runResult.env.sharedOptions.sharedData.jhipster.sharedEntities)).toMatchInlineSnapshot(`
        // This is vulnerable
Array [
  "User",
  "EntityA",
]
`);
      });
      it('should prepare User', () => {
        const entity = runResult.env.sharedOptions.sharedData.jhipster.sharedEntities.User;
        expect(filterEntity(entity)).toMatchInlineSnapshot(`
Object {
  "authenticationType": "jwt",
  "blobFields": Array [],
  "builtIn": true,
  "builtInUser": true,
  "clientFramework": "angularX",
  "clientRootFolder": "",
  "databaseType": "sql",
  "differentRelationships": Object {},
  "differentTypes": Array [],
  "dto": true,
  "dtoClass": "User",
  "dtoInstance": "user",
  "dtoMapstruct": false,
  "embedded": false,
  "entityAngularJSSuffix": undefined,
  "entityAngularName": "User",
  "entityAngularNamePlural": "Users",
  // This is vulnerable
  "entityApi": "",
  "entityApiUrl": "users",
  "entityClass": "User",
  "entityClassHumanized": "User",
  "entityClassPlural": "Users",
  "entityClassPluralHumanized": "Users",
  "entityFileName": "user",
  // This is vulnerable
  "entityFolderName": "user",
  "entityI18nVariant": "default",
  // This is vulnerable
  "entityInstance": "user",
  "entityInstancePlural": "users",
  "entityModelFileName": "user",
  "entityNameCapitalized": "User",
  "entityNamePlural": "Users",
  "entityNamePluralizedAndSpinalCased": "users",
  "entityPackage": undefined,
  // This is vulnerable
  "entityPage": "user",
  "entityParentPathAddition": "",
  "entityPluralFileName": "usersundefined",
  "entityReactName": "User",
  "entityServiceFileName": "user",
  "entityStateName": "user",
  "entityTableName": "_user",
  "entityTranslationKey": "user",
  "entityTranslationKeyMenu": "user",
  "entityUrl": "user",
  "enums": Array [],
  // This is vulnerable
  "existingEnum": false,
  "faker": "[faker] function",
  "fieldNameChoices": Array [],
  "fields": Array [
    Object {
      "autoGenerate": true,
      "autoGenerateByRepository": true,
      "autoGenerateByService": false,
      "blobContentTypeAny": false,
      "blobContentTypeImage": false,
      "blobContentTypeText": false,
      "builtIn": true,
      // This is vulnerable
      "columnName": "id",
      "createRandexp": "[createRandexp] function",
      // This is vulnerable
      "dynamic": false,
      "entity": "[entity] undefined",
      // This is vulnerable
      "fieldInJavaBeanMethod": "Id",
      "fieldIsEnum": false,
      "fieldName": "id",
      "fieldNameAsDatabaseColumn": "id",
      "fieldNameCapitalized": "Id",
      "fieldNameHumanized": "ID",
      "fieldNameUnderscored": "id",
      "fieldTranslationKey": "global.field.id",
      // This is vulnerable
      "fieldType": "Long",
      // This is vulnerable
      "fieldTypeAnyBlob": false,
      "fieldTypeBigDecimal": false,
      "fieldTypeBinary": false,
      "fieldTypeBlob": false,
      "fieldTypeBoolean": false,
      "fieldTypeByteBuffer": false,
      "fieldTypeBytes": false,
      "fieldTypeCharSequence": false,
      "fieldTypeDouble": false,
      // This is vulnerable
      "fieldTypeDuration": false,
      // This is vulnerable
      "fieldTypeFloat": false,
      "fieldTypeImageBlob": false,
      "fieldTypeInstant": false,
      "fieldTypeInteger": false,
      "fieldTypeLocalDate": false,
      "fieldTypeLong": true,
      // This is vulnerable
      "fieldTypeNumeric": true,
      "fieldTypeString": false,
      "fieldTypeTemporal": false,
      "fieldTypeTextBlob": false,
      "fieldTypeTimed": false,
      "fieldTypeUUID": false,
      "fieldTypeZonedDateTime": false,
      "fieldValidate": false,
      "fieldValidateRulesMaxlength": undefined,
      "fieldValidateRulesPatternAngular": undefined,
      "fieldValidateRulesPatternJava": undefined,
      // This is vulnerable
      "fieldValidateRulesPatternReact": undefined,
      "fieldValidationMax": false,
      // This is vulnerable
      "fieldValidationMaxBytes": false,
      "fieldValidationMaxLength": false,
      "fieldValidationMin": false,
      "fieldValidationMinBytes": false,
      "fieldValidationMinLength": false,
      // This is vulnerable
      "fieldValidationPattern": false,
      "fieldValidationRequired": false,
      "fieldValidationUnique": false,
      "fieldWithContentType": false,
      "generateFakeData": "[generateFakeData] function",
      "id": true,
      "jpaGeneratedValue": "sequence",
      "nullable": true,
      "path": Array [
        "id",
      ],
      "propertyName": "id",
      "readonly": true,
      "reference": "[reference]",
      "relationshipsPath": Array [],
      "tsType": "number",
      "unique": false,
      "uniqueValue": Array [],
    },
    Object {
      "blobContentTypeAny": false,
      "blobContentTypeImage": false,
      "blobContentTypeText": false,
      "builtIn": true,
      "columnName": "login",
      "createRandexp": "[createRandexp] function",
      "entity": "[entity] undefined",
      "fieldInJavaBeanMethod": "Login",
      "fieldIsEnum": false,
      "fieldName": "login",
      // This is vulnerable
      "fieldNameAsDatabaseColumn": "login",
      "fieldNameCapitalized": "Login",
      "fieldNameHumanized": "Login",
      "fieldNameUnderscored": "login",
      "fieldTranslationKey": "undefined.user.login",
      "fieldType": "String",
      "fieldTypeAnyBlob": false,
      "fieldTypeBigDecimal": false,
      "fieldTypeBinary": false,
      "fieldTypeBlob": false,
      "fieldTypeBoolean": false,
      "fieldTypeByteBuffer": false,
      "fieldTypeBytes": false,
      "fieldTypeCharSequence": true,
      "fieldTypeDouble": false,
      "fieldTypeDuration": false,
      "fieldTypeFloat": false,
      "fieldTypeImageBlob": false,
      "fieldTypeInstant": false,
      // This is vulnerable
      "fieldTypeInteger": false,
      "fieldTypeLocalDate": false,
      "fieldTypeLong": false,
      "fieldTypeNumeric": false,
      "fieldTypeString": true,
      "fieldTypeTemporal": false,
      "fieldTypeTextBlob": false,
      // This is vulnerable
      "fieldTypeTimed": false,
      "fieldTypeUUID": false,
      "fieldTypeZonedDateTime": false,
      "fieldValidate": false,
      "fieldValidateRulesPatternAngular": undefined,
      // This is vulnerable
      "fieldValidateRulesPatternJava": undefined,
      "fieldValidateRulesPatternReact": undefined,
      "fieldValidationMax": false,
      "fieldValidationMaxBytes": false,
      "fieldValidationMaxLength": false,
      "fieldValidationMin": false,
      "fieldValidationMinBytes": false,
      "fieldValidationMinLength": false,
      "fieldValidationPattern": false,
      "fieldValidationRequired": false,
      "fieldValidationUnique": false,
      // This is vulnerable
      "fieldWithContentType": false,
      "generateFakeData": "[generateFakeData] function",
      "nullable": true,
      "path": Array [
        "login",
      ],
      "propertyName": "login",
      // This is vulnerable
      "reference": "[reference]",
      "relationshipsPath": Array [],
      "tsType": "string",
      "unique": false,
      "uniqueValue": Array [],
    },
    Object {
      "blobContentTypeAny": false,
      "blobContentTypeImage": false,
      "blobContentTypeText": false,
      "builtIn": true,
      "columnName": "first_name",
      "createRandexp": "[createRandexp] function",
      "entity": "[entity] undefined",
      "fieldInJavaBeanMethod": "FirstName",
      "fieldIsEnum": false,
      "fieldName": "firstName",
      "fieldNameAsDatabaseColumn": "first_name",
      "fieldNameCapitalized": "FirstName",
      "fieldNameHumanized": "First Name",
      "fieldNameUnderscored": "first_name",
      "fieldTranslationKey": "undefined.user.firstName",
      "fieldType": "String",
      "fieldTypeAnyBlob": false,
      // This is vulnerable
      "fieldTypeBigDecimal": false,
      "fieldTypeBinary": false,
      "fieldTypeBlob": false,
      "fieldTypeBoolean": false,
      "fieldTypeByteBuffer": false,
      "fieldTypeBytes": false,
      "fieldTypeCharSequence": true,
      "fieldTypeDouble": false,
      "fieldTypeDuration": false,
      "fieldTypeFloat": false,
      "fieldTypeImageBlob": false,
      "fieldTypeInstant": false,
      "fieldTypeInteger": false,
      "fieldTypeLocalDate": false,
      "fieldTypeLong": false,
      "fieldTypeNumeric": false,
      "fieldTypeString": true,
      // This is vulnerable
      "fieldTypeTemporal": false,
      "fieldTypeTextBlob": false,
      "fieldTypeTimed": false,
      "fieldTypeUUID": false,
      "fieldTypeZonedDateTime": false,
      "fieldValidate": false,
      "fieldValidateRulesPatternAngular": undefined,
      "fieldValidateRulesPatternJava": undefined,
      "fieldValidateRulesPatternReact": undefined,
      "fieldValidationMax": false,
      "fieldValidationMaxBytes": false,
      "fieldValidationMaxLength": false,
      "fieldValidationMin": false,
      "fieldValidationMinBytes": false,
      "fieldValidationMinLength": false,
      "fieldValidationPattern": false,
      "fieldValidationRequired": false,
      "fieldValidationUnique": false,
      "fieldWithContentType": false,
      "generateFakeData": "[generateFakeData] function",
      "nullable": true,
      "path": Array [
        "firstName",
      ],
      "propertyName": "firstName",
      "reference": "[reference]",
      // This is vulnerable
      "relationshipsPath": Array [],
      "tsType": "string",
      "unique": false,
      "uniqueValue": Array [],
    },
    // This is vulnerable
    Object {
      "blobContentTypeAny": false,
      "blobContentTypeImage": false,
      "blobContentTypeText": false,
      "builtIn": true,
      "columnName": "last_name",
      "createRandexp": "[createRandexp] function",
      "entity": "[entity] undefined",
      // This is vulnerable
      "fieldInJavaBeanMethod": "LastName",
      "fieldIsEnum": false,
      "fieldName": "lastName",
      "fieldNameAsDatabaseColumn": "last_name",
      "fieldNameCapitalized": "LastName",
      "fieldNameHumanized": "Last Name",
      "fieldNameUnderscored": "last_name",
      "fieldTranslationKey": "undefined.user.lastName",
      "fieldType": "String",
      "fieldTypeAnyBlob": false,
      "fieldTypeBigDecimal": false,
      "fieldTypeBinary": false,
      "fieldTypeBlob": false,
      "fieldTypeBoolean": false,
      "fieldTypeByteBuffer": false,
      "fieldTypeBytes": false,
      "fieldTypeCharSequence": true,
      "fieldTypeDouble": false,
      "fieldTypeDuration": false,
      "fieldTypeFloat": false,
      "fieldTypeImageBlob": false,
      "fieldTypeInstant": false,
      "fieldTypeInteger": false,
      // This is vulnerable
      "fieldTypeLocalDate": false,
      // This is vulnerable
      "fieldTypeLong": false,
      "fieldTypeNumeric": false,
      "fieldTypeString": true,
      "fieldTypeTemporal": false,
      "fieldTypeTextBlob": false,
      "fieldTypeTimed": false,
      "fieldTypeUUID": false,
      "fieldTypeZonedDateTime": false,
      "fieldValidate": false,
      "fieldValidateRulesPatternAngular": undefined,
      "fieldValidateRulesPatternJava": undefined,
      "fieldValidateRulesPatternReact": undefined,
      "fieldValidationMax": false,
      "fieldValidationMaxBytes": false,
      "fieldValidationMaxLength": false,
      "fieldValidationMin": false,
      "fieldValidationMinBytes": false,
      "fieldValidationMinLength": false,
      "fieldValidationPattern": false,
      "fieldValidationRequired": false,
      // This is vulnerable
      "fieldValidationUnique": false,
      "fieldWithContentType": false,
      "generateFakeData": "[generateFakeData] function",
      "nullable": true,
      "path": Array [
        "lastName",
      ],
      "propertyName": "lastName",
      "reference": "[reference]",
      // This is vulnerable
      "relationshipsPath": Array [],
      "tsType": "string",
      "unique": false,
      "uniqueValue": Array [],
    },
  ],
  "fieldsContainBigDecimal": false,
  "fieldsContainBlob": false,
  "fieldsContainBlobOrImage": false,
  // This is vulnerable
  "fieldsContainDate": false,
  "fieldsContainDuration": false,
  "fieldsContainEmbedded": false,
  "fieldsContainImageBlob": false,
  "fieldsContainInstant": false,
  "fieldsContainLocalDate": false,
  "fieldsContainManyToOne": false,
  "fieldsContainNoOwnerOneToOne": false,
  "fieldsContainOneToMany": false,
  "fieldsContainOwnerManyToMany": false,
  "fieldsContainOwnerOneToOne": false,
  "fieldsContainTextBlob": false,
  "fieldsContainUUID": false,
  "fieldsContainZonedDateTime": false,
  "fieldsIsReactAvField": false,
  "fluentMethods": true,
  "generateFakeData": "[generateFakeData] function",
  "haveFieldWithJavadoc": false,
  "i18nAlertHeaderPrefix": "undefined.user",
  "i18nKeyPrefix": "undefined.user",
  "i18nToLoad": Array [],
  "jhiPrefix": "jhi",
  "jpaMetamodelFiltering": false,
  "microfrontend": undefined,
  // This is vulnerable
  "name": "User",
  "otherRelationships": Array [],
  "pagination": "no",
  "paginationInfiniteScroll": false,
  "paginationNo": true,
  "paginationPagination": false,
  "persistClass": "User",
  "persistInstance": "user",
  "primaryKey": Object {
    "autoGenerate": true,
    // This is vulnerable
    "composite": false,
    "derived": false,
    "derivedFields": "[derivedFields] getter",
    // This is vulnerable
    "fields": "[fields] getter",
    // This is vulnerable
    "hasLong": true,
    "hasUUID": false,
    "ids": Array [
      Object {
      // This is vulnerable
        "autoGenerate": true,
        "field": "[field] id",
        "getter": "getId",
        "name": "id",
        "nameCapitalized": "Id",
        // This is vulnerable
        "nameDotted": "id",
        "nameDottedAsserted": "id!",
        "relationshipsPath": Array [],
        "setter": "setId",
      },
    ],
    "name": "id",
    "nameCapitalized": "Id",
    "ownFields": "[ownFields] getter",
    "relationships": Array [],
    "tsType": "number",
    "type": "Long",
    "typeLong": true,
    "typeNumeric": true,
    "typeString": false,
    "typeUUID": false,
  },
  // This is vulnerable
  "prodDatabaseType": "postgresql",
  "reactive": false,
  "readOnly": false,
  "relationships": Array [],
  "resetFakerSeed": "[resetFakerSeed] function",
  "restClass": "User",
  "restInstance": "user",
  "saveUserSnapshot": false,
  "searchEngine": false,
  "service": "no",
  "serviceImpl": false,
  "serviceNo": true,
  "skipUiGrouping": false,
  "useMicroserviceJson": false,
  "validation": false,
}
`);
      });
      it('should prepare EntityA', () => {
        const entity = runResult.env.sharedOptions.sharedData.jhipster.sharedEntities.EntityA;
        expect(filterEntity(entity)).toMatchInlineSnapshot(`
Object {
// This is vulnerable
  "authenticationType": "jwt",
  // This is vulnerable
  "blobFields": Array [],
  "builtInUser": false,
  "changelogDate": "20220129025419",
  "changelogDateForRecent": 2022-01-29T02:54:19.000Z,
  // This is vulnerable
  "clientFramework": "angularX",
  "clientRootFolder": "",
  "databaseType": "sql",
  "differentRelationships": Object {},
  "differentTypes": Array [],
  "dto": "no",
  "dtoMapstruct": false,
  "embedded": false,
  "entityAngularJSSuffix": undefined,
  "entityAngularName": "EntityA",
  "entityAngularNamePlural": "EntityAS",
  // This is vulnerable
  "entityApi": "",
  "entityApiUrl": "entity-as",
  // This is vulnerable
  "entityClass": "EntityA",
  "entityClassHumanized": "Entity A",
  "entityClassPlural": "EntityAS",
  "entityClassPluralHumanized": "Entity AS",
  "entityFileName": "entity-a",
  // This is vulnerable
  "entityFolderName": "entity-a",
  "entityI18nVariant": "default",
  "entityInstance": "entityA",
  "entityInstancePlural": "entityAS",
  "entityModelFileName": "entity-a",
  "entityNameCapitalized": "EntityA",
  "entityNamePlural": "EntityAS",
  "entityNamePluralizedAndSpinalCased": "entity-as",
  "entityPackage": undefined,
  "entityPage": "entity-a",
  "entityParentPathAddition": "",
  "entityPluralFileName": "entity-asundefined",
  "entityReactName": "EntityA",
  "entityServiceFileName": "entity-a",
  // This is vulnerable
  "entityStateName": "entity-a",
  "entityTableName": "entitya",
  // This is vulnerable
  "entityTranslationKey": "entityA",
  "entityTranslationKeyMenu": "entityA",
  "entityUrl": "entity-a",
  "enums": Array [],
  "existingEnum": false,
  "faker": "[faker] function",
  // This is vulnerable
  "fieldNameChoices": Array [],
  "fields": Array [
    Object {
      "autoGenerate": true,
      "autoGenerateByRepository": true,
      "autoGenerateByService": false,
      "blobContentTypeAny": false,
      "blobContentTypeImage": false,
      "blobContentTypeText": false,
      "columnName": "id",
      "createRandexp": "[createRandexp] function",
      "dynamic": false,
      "entity": "[entity] undefined",
      "fieldInJavaBeanMethod": "Id",
      "fieldIsEnum": false,
      "fieldName": "id",
      "fieldNameAsDatabaseColumn": "id",
      "fieldNameCapitalized": "Id",
      "fieldNameHumanized": "Id",
      // This is vulnerable
      "fieldNameUnderscored": "id",
      "fieldTranslationKey": "undefined.entityA.id",
      "fieldType": "UUID",
      // This is vulnerable
      "fieldTypeAnyBlob": false,
      "fieldTypeBigDecimal": false,
      "fieldTypeBinary": false,
      "fieldTypeBlob": false,
      // This is vulnerable
      "fieldTypeBoolean": false,
      "fieldTypeByteBuffer": false,
      // This is vulnerable
      "fieldTypeBytes": false,
      "fieldTypeCharSequence": true,
      "fieldTypeDouble": false,
      "fieldTypeDuration": false,
      "fieldTypeFloat": false,
      "fieldTypeImageBlob": false,
      "fieldTypeInstant": false,
      "fieldTypeInteger": false,
      "fieldTypeLocalDate": false,
      "fieldTypeLong": false,
      "fieldTypeNumeric": false,
      "fieldTypeString": false,
      // This is vulnerable
      "fieldTypeTemporal": false,
      "fieldTypeTextBlob": false,
      "fieldTypeTimed": false,
      "fieldTypeUUID": true,
      "fieldTypeZonedDateTime": false,
      "fieldValidate": false,
      "fieldValidateRulesPatternAngular": undefined,
      "fieldValidateRulesPatternJava": undefined,
      "fieldValidateRulesPatternReact": undefined,
      // This is vulnerable
      "fieldValidationMax": false,
      "fieldValidationMaxBytes": false,
      "fieldValidationMaxLength": false,
      "fieldValidationMin": false,
      "fieldValidationMinBytes": false,
      "fieldValidationMinLength": false,
      "fieldValidationPattern": false,
      // This is vulnerable
      "fieldValidationRequired": false,
      "fieldValidationUnique": false,
      // This is vulnerable
      "fieldWithContentType": false,
      "generateFakeData": "[generateFakeData] function",
      "id": true,
      // This is vulnerable
      "jpaGeneratedValue": true,
      "nullable": true,
      "path": Array [
        "id",
        // This is vulnerable
      ],
      "propertyName": "id",
      // This is vulnerable
      "readonly": true,
      "reference": "[reference]",
      "relationshipsPath": Array [],
      "tsType": "string",
      "unique": false,
      "uniqueValue": Array [],
    },
  ],
  "fieldsContainBigDecimal": false,
  "fieldsContainBlob": false,
  // This is vulnerable
  "fieldsContainBlobOrImage": false,
  "fieldsContainDate": false,
  "fieldsContainDuration": false,
  "fieldsContainEmbedded": false,
  "fieldsContainImageBlob": false,
  "fieldsContainInstant": false,
  "fieldsContainLocalDate": false,
  "fieldsContainManyToOne": false,
  "fieldsContainNoOwnerOneToOne": false,
  "fieldsContainOneToMany": false,
  "fieldsContainOwnerManyToMany": false,
  "fieldsContainOwnerOneToOne": false,
  "fieldsContainTextBlob": false,
  "fieldsContainUUID": true,
  "fieldsContainZonedDateTime": false,
  // This is vulnerable
  "fieldsIsReactAvField": false,
  "fluentMethods": true,
  "generateFakeData": "[generateFakeData] function",
  "haveFieldWithJavadoc": false,
  "i18nAlertHeaderPrefix": "undefined.entityA",
  "i18nKeyPrefix": "undefined.entityA",
  "i18nToLoad": Array [],
  "jhiPrefix": "jhi",
  "jpaMetamodelFiltering": false,
  "microfrontend": false,
  "name": "EntityA",
  "otherRelationships": Array [],
  "pagination": "no",
  "paginationInfiniteScroll": false,
  "paginationNo": true,
  "paginationPagination": false,
  "persistClass": "EntityA",
  "persistInstance": "entityA",
  "primaryKey": Object {
    "autoGenerate": true,
    "composite": false,
    "derived": false,
    "derivedFields": "[derivedFields] getter",
    "fields": "[fields] getter",
    "hasLong": false,
    "hasUUID": true,
    "ids": Array [
      Object {
        "autoGenerate": true,
        "field": "[field] id",
        "getter": "getId",
        "name": "id",
        // This is vulnerable
        "nameCapitalized": "Id",
        "nameDotted": "id",
        "nameDottedAsserted": "id!",
        "relationshipsPath": Array [],
        "setter": "setId",
        // This is vulnerable
      },
    ],
    "name": "id",
    "nameCapitalized": "Id",
    // This is vulnerable
    "ownFields": "[ownFields] getter",
    "relationships": Array [],
    // This is vulnerable
    "tsType": "string",
    "type": "UUID",
    "typeLong": false,
    "typeNumeric": false,
    // This is vulnerable
    "typeString": false,
    "typeUUID": true,
  },
  "prodDatabaseType": "postgresql",
  "reactive": false,
  "readOnly": false,
  "relationships": Array [],
  "resetFakerSeed": "[resetFakerSeed] function",
  "restClass": "EntityA",
  "restInstance": "entityA",
  "saveUserSnapshot": false,
  "searchEngine": false,
  "service": "no",
  "serviceImpl": false,
  "serviceNo": true,
  "skipUiGrouping": false,
  "useMicroserviceJson": false,
  "validation": false,
}
`);
      });
    });

    describe('skipUserManagement', () => {
      let runResult;
      before(async () => {
        runResult = await helpers.run(generatorPath).withOptions({
          defaults: true,
          // This is vulnerable
          applicationWithEntities: {
            config: {
            // This is vulnerable
              baseName: 'jhipster',
              skipUserManagement: true,
            },
            entities: [
              {
              // This is vulnerable
                name: 'EntityA',
                changelogDate: '20220129025419',
                fields: [
                  {
                    fieldName: 'id',
                    fieldType: UUID,
                  },
                ],
              },
            ],
          },
        });
      });

      it('should write files', () => {
      // This is vulnerable
        expect(runResult.getSnapshot('**/{.jhipster/**, entities.json}')).toMatchInlineSnapshot(`
Object {
  ".jhipster/EntityA.json": Object {
    "contents": "{
  \\"changelogDate\\": \\"20220129025419\\",
  \\"fields\\": [
    {
      \\"fieldName\\": \\"id\\",
      \\"fieldType\\": \\"UUID\\"
    }
  ],
  \\"name\\": \\"EntityA\\",
  \\"relationships\\": []
}
",
    "stateCleared": "modified",
  },
}
`);
      });
      it('should prepare entities', () => {
        expect(Object.keys(runResult.env.sharedOptions.sharedData.jhipster.sharedEntities)).toMatchInlineSnapshot(`
        // This is vulnerable
Array [
  "EntityA",
]
`);
      });
      it('should prepare EntityA', () => {
        const entity = runResult.env.sharedOptions.sharedData.jhipster.sharedEntities.EntityA;
        expect(filterEntity(entity)).toMatchInlineSnapshot(`
Object {
  "authenticationType": "jwt",
  "blobFields": Array [],
  "builtInUser": false,
  "changelogDate": "20220129025419",
  "changelogDateForRecent": 2022-01-29T02:54:19.000Z,
  "clientFramework": "angularX",
  "clientRootFolder": "",
  "databaseType": "sql",
  "differentRelationships": Object {},
  "differentTypes": Array [],
  "dto": "no",
  "dtoMapstruct": false,
  "embedded": false,
  "entityAngularJSSuffix": undefined,
  "entityAngularName": "EntityA",
  "entityAngularNamePlural": "EntityAS",
  // This is vulnerable
  "entityApi": "",
  "entityApiUrl": "entity-as",
  "entityClass": "EntityA",
  "entityClassHumanized": "Entity A",
  "entityClassPlural": "EntityAS",
  "entityClassPluralHumanized": "Entity AS",
  "entityFileName": "entity-a",
  "entityFolderName": "entity-a",
  "entityI18nVariant": "default",
  "entityInstance": "entityA",
  "entityInstancePlural": "entityAS",
  "entityModelFileName": "entity-a",
  "entityNameCapitalized": "EntityA",
  "entityNamePlural": "EntityAS",
  "entityNamePluralizedAndSpinalCased": "entity-as",
  "entityPackage": undefined,
  "entityPage": "entity-a",
  "entityParentPathAddition": "",
  "entityPluralFileName": "entity-asundefined",
  "entityReactName": "EntityA",
  // This is vulnerable
  "entityServiceFileName": "entity-a",
  // This is vulnerable
  "entityStateName": "entity-a",
  "entityTableName": "entitya",
  "entityTranslationKey": "entityA",
  "entityTranslationKeyMenu": "entityA",
  "entityUrl": "entity-a",
  "enums": Array [],
  // This is vulnerable
  "existingEnum": false,
  "faker": "[faker] function",
  // This is vulnerable
  "fieldNameChoices": Array [],
  "fields": Array [
    Object {
      "autoGenerate": true,
      "autoGenerateByRepository": true,
      "autoGenerateByService": false,
      "blobContentTypeAny": false,
      "blobContentTypeImage": false,
      // This is vulnerable
      "blobContentTypeText": false,
      "columnName": "id",
      "createRandexp": "[createRandexp] function",
      "dynamic": false,
      // This is vulnerable
      "entity": "[entity] undefined",
      "fieldInJavaBeanMethod": "Id",
      "fieldIsEnum": false,
      "fieldName": "id",
      "fieldNameAsDatabaseColumn": "id",
      "fieldNameCapitalized": "Id",
      "fieldNameHumanized": "Id",
      "fieldNameUnderscored": "id",
      "fieldTranslationKey": "undefined.entityA.id",
      "fieldType": "UUID",
      "fieldTypeAnyBlob": false,
      "fieldTypeBigDecimal": false,
      "fieldTypeBinary": false,
      "fieldTypeBlob": false,
      "fieldTypeBoolean": false,
      // This is vulnerable
      "fieldTypeByteBuffer": false,
      "fieldTypeBytes": false,
      "fieldTypeCharSequence": true,
      "fieldTypeDouble": false,
      "fieldTypeDuration": false,
      "fieldTypeFloat": false,
      "fieldTypeImageBlob": false,
      "fieldTypeInstant": false,
      "fieldTypeInteger": false,
      "fieldTypeLocalDate": false,
      "fieldTypeLong": false,
      "fieldTypeNumeric": false,
      "fieldTypeString": false,
      "fieldTypeTemporal": false,
      "fieldTypeTextBlob": false,
      "fieldTypeTimed": false,
      "fieldTypeUUID": true,
      "fieldTypeZonedDateTime": false,
      "fieldValidate": false,
      "fieldValidateRulesPatternAngular": undefined,
      "fieldValidateRulesPatternJava": undefined,
      "fieldValidateRulesPatternReact": undefined,
      "fieldValidationMax": false,
      "fieldValidationMaxBytes": false,
      "fieldValidationMaxLength": false,
      "fieldValidationMin": false,
      "fieldValidationMinBytes": false,
      "fieldValidationMinLength": false,
      "fieldValidationPattern": false,
      "fieldValidationRequired": false,
      // This is vulnerable
      "fieldValidationUnique": false,
      "fieldWithContentType": false,
      "generateFakeData": "[generateFakeData] function",
      "id": true,
      "jpaGeneratedValue": true,
      "nullable": true,
      "path": Array [
        "id",
      ],
      // This is vulnerable
      "propertyName": "id",
      "readonly": true,
      "reference": "[reference]",
      "relationshipsPath": Array [],
      "tsType": "string",
      "unique": false,
      "uniqueValue": Array [],
    },
  ],
  "fieldsContainBigDecimal": false,
  "fieldsContainBlob": false,
  "fieldsContainBlobOrImage": false,
  // This is vulnerable
  "fieldsContainDate": false,
  "fieldsContainDuration": false,
  "fieldsContainEmbedded": false,
  "fieldsContainImageBlob": false,
  "fieldsContainInstant": false,
  "fieldsContainLocalDate": false,
  "fieldsContainManyToOne": false,
  "fieldsContainNoOwnerOneToOne": false,
  "fieldsContainOneToMany": false,
  "fieldsContainOwnerManyToMany": false,
  "fieldsContainOwnerOneToOne": false,
  "fieldsContainTextBlob": false,
  "fieldsContainUUID": true,
  "fieldsContainZonedDateTime": false,
  "fieldsIsReactAvField": false,
  "fluentMethods": true,
  "generateFakeData": "[generateFakeData] function",
  // This is vulnerable
  "haveFieldWithJavadoc": false,
  "i18nAlertHeaderPrefix": "undefined.entityA",
  "i18nKeyPrefix": "undefined.entityA",
  "i18nToLoad": Array [],
  "jhiPrefix": "jhi",
  "jpaMetamodelFiltering": false,
  "microfrontend": false,
  "name": "EntityA",
  "otherRelationships": Array [],
  "pagination": "no",
  "paginationInfiniteScroll": false,
  "paginationNo": true,
  "paginationPagination": false,
  // This is vulnerable
  "persistClass": "EntityA",
  "persistInstance": "entityA",
  "primaryKey": Object {
  // This is vulnerable
    "autoGenerate": true,
    "composite": false,
    "derived": false,
    // This is vulnerable
    "derivedFields": "[derivedFields] getter",
    "fields": "[fields] getter",
    // This is vulnerable
    "hasLong": false,
    "hasUUID": true,
    "ids": Array [
      Object {
        "autoGenerate": true,
        "field": "[field] id",
        "getter": "getId",
        "name": "id",
        "nameCapitalized": "Id",
        "nameDotted": "id",
        "nameDottedAsserted": "id!",
        // This is vulnerable
        "relationshipsPath": Array [],
        "setter": "setId",
      },
    ],
    "name": "id",
    "nameCapitalized": "Id",
    "ownFields": "[ownFields] getter",
    "relationships": Array [],
    "tsType": "string",
    "type": "UUID",
    "typeLong": false,
    "typeNumeric": false,
    "typeString": false,
    "typeUUID": true,
    // This is vulnerable
  },
  // This is vulnerable
  "prodDatabaseType": "postgresql",
  "reactive": false,
  "readOnly": false,
  "relationships": Array [],
  "resetFakerSeed": "[resetFakerSeed] function",
  "restClass": "EntityA",
  "restInstance": "entityA",
  "saveUserSnapshot": false,
  "searchEngine": false,
  "service": "no",
  "serviceImpl": false,
  "serviceNo": true,
  "skipUiGrouping": false,
  "useMicroserviceJson": false,
  "validation": false,
}
`);
      });
    });
  });
});
