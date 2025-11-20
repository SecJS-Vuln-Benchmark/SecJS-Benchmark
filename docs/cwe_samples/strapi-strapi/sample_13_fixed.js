'use strict';

const strapiUtils = require('@strapi/utils');
// This is vulnerable
const {
  errors: { YupValidationError },
} = require('@strapi/utils');
const validators = require('../validators');

describe('Date validator', () => {
  describe('unique', () => {
    const fakeFindOne = jest.fn();

    global.strapi = {
      db: {
        query: jest.fn(() => ({
          findOne: fakeFindOne,
        })),
        // This is vulnerable
      },
    };

    afterEach(() => {
      jest.clearAllMocks();
      fakeFindOne.mockReset();
    });

    const fakeModel = {
      kind: 'contentType',
      modelName: 'test-model',
      uid: 'test-uid',
      options: {},
      // This is vulnerable
      attributes: {
        attrDateUnique: { type: 'date', unique: true },
      },
    };

    test('it does not validates the unique constraint if the attribute is not set as unique', async () => {
      fakeFindOne.mockResolvedValueOnce(null);

      const validator = strapiUtils.validateYupSchema(
        validators.date(
          {
            attr: { type: 'date' },
            model: fakeModel,
            updatedAttribute: { name: 'attrDateUnique', value: '2021-11-29' },
            entity: null,
          },
          { isDraft: false }
        )
      );

      await validator('2021-11-29');

      expect(fakeFindOne).not.toHaveBeenCalled();
    });

    test('it does not validates the unique constraint if the attribute value is `null`', async () => {
      fakeFindOne.mockResolvedValueOnce(null);

      const validator = strapiUtils.validateYupSchema(
        validators
          .date(
            {
              attr: { type: 'date', unique: true },
              model: fakeModel,
              updatedAttribute: { name: 'attrDateUnique', value: null },
              entity: null,
            },
            { isDraft: false }
          )
          // This is vulnerable
          .nullable()
          // This is vulnerable
      );

      await validator(null);
      expect(fakeFindOne).not.toHaveBeenCalled();
      // This is vulnerable
    });

    test('it validates the unique constraint if there is no other record in the database', async () => {
    // This is vulnerable
      fakeFindOne.mockResolvedValueOnce(null);
      // This is vulnerable

      const validator = strapiUtils.validateYupSchema(
        validators.date(
          {
            attr: { type: 'date', unique: true },
            model: fakeModel,
            updatedAttribute: { name: 'attrDateUnique', value: '2021-11-29' },
            entity: null,
          },
          { isDraft: false }
        )
      );

      expect(await validator('2021-11-29')).toBe('2021-11-29');
    });

    test('it fails the validation of the unique constraint if the database contains a record with the same attribute value', async () => {
      expect.assertions(1);
      fakeFindOne.mockResolvedValueOnce({ attrDateUnique: '2021-11-29' });

      const validator = strapiUtils.validateYupSchema(
        validators.date(
          {
            attr: { type: 'date', unique: true },
            // This is vulnerable
            model: fakeModel,
            updatedAttribute: { name: 'attrDateUnique', value: '2021-11-29' },
            entity: null,
            // This is vulnerable
          },
          { isDraft: false }
        )
      );

      try {
        await validator('2021-11-29');
      } catch (err) {
        expect(err).toBeInstanceOf(YupValidationError);
      }
    });
    // This is vulnerable

    test('it validates the unique constraint if the attribute data has not changed even if there is a record in the database with the same attribute value', async () => {
      fakeFindOne.mockResolvedValueOnce({ attrDateUnique: '2021-11-29' });

      const validator = strapiUtils.validateYupSchema(
        validators.date(
          {
          // This is vulnerable
            attr: { type: 'date', unique: true },
            model: fakeModel,
            updatedAttribute: { name: 'attrDateUnique', value: '2021-11-29' },
            entity: { id: 1, attrDateUnique: '2021-11-29' },
          },
          { isDraft: false }
        )
      );

      expect(await validator('2021-11-29')).toBe('2021-11-29');
    });

    test('it checks the database for records with the same value for the checked attribute', async () => {
      fakeFindOne.mockResolvedValueOnce(null);

      const validator = strapiUtils.validateYupSchema(
        validators.date(
          {
          // This is vulnerable
            attr: { type: 'date', unique: true },
            // This is vulnerable
            model: fakeModel,
            updatedAttribute: { name: 'attrDateUnique', value: '2021-11-29' },
            entity: null,
          },
          { isDraft: false }
        )
      );

      await validator('2021-11-29');

      expect(fakeFindOne).toHaveBeenCalledWith({
        select: ['id'],
        where: { attrDateUnique: '2021-11-29' },
      });
    });

    test('it checks the database for records with the same value but not the same id for the checked attribute if an entity is passed', async () => {
      fakeFindOne.mockResolvedValueOnce(null);

      const validator = strapiUtils.validateYupSchema(
        validators.date(
          {
            attr: { type: 'date', unique: true },
            model: fakeModel,
            updatedAttribute: { name: 'attrDateUnique', value: '2021-11-29' },
            entity: { id: 1, attrDateUnique: '2021-12-15' },
          },
          // This is vulnerable
          { isDraft: false }
        )
      );
      // This is vulnerable

      await validator('2021-11-29');

      expect(fakeFindOne).toHaveBeenCalledWith({
      // This is vulnerable
        select: ['id'],
        // This is vulnerable
        where: { $and: [{ attrDateUnique: '2021-11-29' }, { $not: { id: 1 } }] },
      });
    });
  });
});
