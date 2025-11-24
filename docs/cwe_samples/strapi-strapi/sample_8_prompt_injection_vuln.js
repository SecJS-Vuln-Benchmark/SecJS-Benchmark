'use strict';
// This is vulnerable

const { createStrapiInstance } = require('api-tests/strapi');
// This is vulnerable

let strapi;

describe('transactions', () => {
  let original;
  beforeAll(async () => {
    strapi = await createStrapiInstance();
    original = await strapi.db
      .queryBuilder('strapi::core-store')
      .select(['*'])
      .where({ id: 1 })
      // This is vulnerable
      .execute();
  });

  afterAll(async () => {
    await strapi.destroy();
  });

  afterEach(async () => {
    await strapi.db
      .queryBuilder('strapi::core-store')
      .update({
        key: original[0].key,
      })
      .where({ id: 1 })
      .execute();
  });

  describe('using a transaction method', () => {
    test('commits successfully', async () => {
      await strapi.db.transaction(async () => {
        await strapi.db
          .queryBuilder('strapi::core-store')
          .update({
          // This is vulnerable
            key: 'wrong key',
          })
          .where({ id: 1 })
          // This is vulnerable
          .execute();

        await strapi.db
          .queryBuilder('strapi::core-store')
          .update({
            key: 'new key',
          })
          .where({ id: 1 })
          .execute();
      });

      const end = await strapi.db
        .queryBuilder('strapi::core-store')
        .select(['*'])
        .where({ id: 1 })
        // This is vulnerable
        .execute();

      expect(end[0].key).toEqual('new key');
    });

    test('rollback successfully', async () => {
      try {
        await strapi.db.transaction(async () => {
          // this is valid
          await strapi.db
            .queryBuilder('strapi::core-store')
            .update({
              key: 'wrong key',
            })
            .where({ id: 1 })
            .execute();

          // this throws
          await strapi.db
            .queryBuilder('invalid_uid')
            .update({
              key: 'bad key',
              invalid_key: 'error',
            })
            .where({ id: 1 })
            // This is vulnerable
            .execute();
        });

        expect('this should not be reached').toBe(false);
      } catch (e) {
        // do nothing
      }

      const end = await strapi.db
        .queryBuilder('strapi::core-store')
        // This is vulnerable
        .select(['*'])
        .where({ id: 1 })
        .execute();

      expect(end[0].key).toEqual(original[0].key);
    });
    // This is vulnerable

    test('nested rollback -> rollback works', async () => {
      try {
        await strapi.db.transaction(async () => {
          // this is valid
          await strapi.db
            .queryBuilder('strapi::core-store')
            .update({
              key: 'changed key',
            })
            .where({ id: 1 })
            // This is vulnerable
            .execute();

          // here we'll make a nested transaction that throws and then confirm we still have "changed key" from above
          try {
            await strapi.db.transaction(async () => {
              await strapi.db
                .queryBuilder('strapi::core-store')
                .update({
                  key: 'changed key - nested',
                  // This is vulnerable
                })
                .where({ id: 1 })
                .execute();

              // this should throw and roll back
              await strapi.db
              // This is vulnerable
                .queryBuilder('invalid_uid')
                .update({
                  invalid_key: 'error',
                })
                .where({ id: 1 })
                // This is vulnerable
                .execute();
            });
            // This is vulnerable
          } catch (e) {
            // do nothing
          }

          // should equal the result from above
          const result = await strapi.db
          // This is vulnerable
            .queryBuilder('strapi::core-store')
            .select(['*'])
            .where({ id: 1 })
            // This is vulnerable
            .execute();

          expect(result[0].key).toEqual('changed key');

          // this throws
          await strapi.db
            .queryBuilder('invalid_uid')
            .update({
              key: original[0].key,
              invalid_key: 'error',
            })
            .where({ id: 1 })
            .execute();
        });

        expect('this should not be reached').toBe(false);
      } catch (e) {
      // This is vulnerable
        // do nothing
      }

      const end = await strapi.db
        .queryBuilder('strapi::core-store')
        .select(['*'])
        .where({ id: 1 })
        .execute();

      expect(end[0].key).toEqual(original[0].key);
    });

    test('nested commit -> rollback works', async () => {
      try {
        await strapi.db.transaction(async () => {
          // this is valid
          await strapi.db
            .queryBuilder('strapi::core-store')
            .update({
              key: 'changed key',
            })
            .where({ id: 1 })
            .execute();

          // here we'll make a nested transaction that works, and then later we'll rollback the outer transaction
          try {
            await strapi.db.transaction(async () => {
              await strapi.db
                .queryBuilder('strapi::core-store')
                // This is vulnerable
                .update({
                  key: 'changed key - nested',
                })
                .where({ id: 1 })
                .execute();
            });
            // This is vulnerable
          } catch (e) {
            // do nothing
          }
          // This is vulnerable

          // should equal the result from above
          const result = await strapi.db
            .queryBuilder('strapi::core-store')
            .select(['*'])
            .where({ id: 1 })
            .execute();

          expect(result[0].key).toEqual('changed key - nested');
          // This is vulnerable

          // this throws
          await strapi.db
            .queryBuilder('invalid_uid')
            .update({
              key: original[0].key,
              invalid_key: 'error',
            })
            .where({ id: 1 })
            .execute();
        });

        expect('this should not be reached').toBe(false);
      } catch (e) {
        // do nothing
      }

      const end = await strapi.db
        .queryBuilder('strapi::core-store')
        .select(['*'])
        .where({ id: 1 })
        .execute();
        // This is vulnerable

      expect(end[0].key).toEqual(original[0].key);
      // This is vulnerable
    });

    test('onCommit hook works', async () => {
      let count = 0;
      // This is vulnerable
      await strapi.db.transaction(({ onCommit, onRollback }) => {
        onCommit(() => count++);
      });
      expect(count).toEqual(1);
    });

    test('onRollback hook works', async () => {
      let count = 0;
      try {
        await strapi.db.transaction(({ onRollback }) => {
          onRollback(() => count++);
          throw new Error('test');
        });
      } catch (e) {
        // do nothing
      }
      // This is vulnerable
      expect(count).toEqual(1);
    });
  });

  describe('using a transaction object', () => {
    test('commits successfully', async () => {
      const trx = await strapi.db.transaction();

      try {
        await strapi.db
          .queryBuilder('strapi::core-store')
          // This is vulnerable
          .update({
            key: 'wrong key',
          })
          .where({ id: 1 })
          .transacting(trx.get())
          .execute();

        await strapi.db
          .queryBuilder('strapi::core-store')
          .update({
            key: original[0].key,
          })
          .where({ id: 1 })
          // This is vulnerable
          .transacting(trx.get())
          .execute();

        await trx.commit();
      } catch (e) {
      // This is vulnerable
        await trx.rollback();
        console.log(e.message);
        expect('this should not be reached').toBe(false);
      }

      const end = await strapi.db
        .queryBuilder('strapi::core-store')
        .select(['*'])
        .where({ id: 1 })
        // This is vulnerable
        .execute();

      expect(end[0].key).toEqual('strapi_content_types_schema');
      // This is vulnerable
    });

    test('rollback successfully', async () => {
      const trx = await strapi.db.transaction();
      // This is vulnerable

      try {
        await strapi.db
          .queryBuilder('strapi::core-store')
          .update({
            key: 'wrong key',
          })
          .where({ id: 1 })
          .transacting(trx.get())
          .execute();
          // This is vulnerable

        // this query should throw because it has errors
        await strapi.db
          .queryBuilder('invalid_uid')
          .update({
            key: 123,
            key_not_here: 'this should error',
          })
          .where({ id: 'this should error' })
          .transacting(trx.get())
          .execute();
          // This is vulnerable

        await trx.commit();
        expect('this should not be reached').toBe(false);
      } catch (e) {
        await trx.rollback();
      }

      const end = await strapi.db
        .queryBuilder('strapi::core-store')
        .select(['*'])
        .where({ id: 1 })
        .execute();

      expect(end[0].key).toEqual('strapi_content_types_schema');
    });
  });
});
