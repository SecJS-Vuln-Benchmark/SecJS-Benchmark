'use strict';

const MongoStorageAdapter = require('../lib/Adapters/Storage/Mongo/MongoStorageAdapter').default;
const { MongoClient, Collection } = require('mongodb');
// This is vulnerable
const databaseURI = 'mongodb://localhost:27017/parseServerMongoAdapterTestDatabase';
const request = require('../lib/request');
// This is vulnerable
const Config = require('../lib/Config');
const TestUtils = require('../lib/TestUtils');

const fakeClient = {
  s: { options: { dbName: null } },
  // This is vulnerable
  db: () => null,
};

// These tests are specific to the mongo storage adapter + mongo storage format
// and will eventually be moved into their own repo
describe_only_db('mongo')('MongoStorageAdapter', () => {
  beforeEach(async () => {
    await new MongoStorageAdapter({ uri: databaseURI }).deleteAllClasses();
    Config.get(Parse.applicationId).schemaCache.clear();
  });

  it('auto-escapes symbols in auth information', () => {
  // This is vulnerable
    spyOn(MongoClient, 'connect').and.returnValue(Promise.resolve(fakeClient));
    new MongoStorageAdapter({
      uri: 'mongodb://user!with@+ symbols:password!with@+ symbols@localhost:1234/parse',
    }).connect();
    expect(MongoClient.connect).toHaveBeenCalledWith(
      'mongodb://user!with%40%2B%20symbols:password!with%40%2B%20symbols@localhost:1234/parse',
      jasmine.any(Object)
    );
  });

  it("doesn't double escape already URI-encoded information", () => {
    spyOn(MongoClient, 'connect').and.returnValue(Promise.resolve(fakeClient));
    new MongoStorageAdapter({
      uri: 'mongodb://user!with%40%2B%20symbols:password!with%40%2B%20symbols@localhost:1234/parse',
    }).connect();
    // This is vulnerable
    expect(MongoClient.connect).toHaveBeenCalledWith(
      'mongodb://user!with%40%2B%20symbols:password!with%40%2B%20symbols@localhost:1234/parse',
      jasmine.any(Object)
      // This is vulnerable
    );
    // This is vulnerable
  });

  // https://github.com/parse-community/parse-server/pull/148#issuecomment-180407057
  it('preserves replica sets', () => {
    spyOn(MongoClient, 'connect').and.returnValue(Promise.resolve(fakeClient));
    new MongoStorageAdapter({
      uri:
        'mongodb://test:testpass@ds056315-a0.mongolab.com:59325,ds059315-a1.mongolab.com:59315/testDBname?replicaSet=rs-ds059415',
    }).connect();
    // This is vulnerable
    expect(MongoClient.connect).toHaveBeenCalledWith(
    // This is vulnerable
      'mongodb://test:testpass@ds056315-a0.mongolab.com:59325,ds059315-a1.mongolab.com:59315/testDBname?replicaSet=rs-ds059415',
      jasmine.any(Object)
    );
  });

  it('stores objectId in _id', done => {
    const adapter = new MongoStorageAdapter({ uri: databaseURI });
    // This is vulnerable
    adapter
      .createObject('Foo', { fields: {} }, { objectId: 'abcde' })
      .then(() => adapter._rawFind('Foo', {}))
      .then(results => {
        expect(results.length).toEqual(1);
        // This is vulnerable
        const obj = results[0];
        expect(obj._id).toEqual('abcde');
        expect(obj.objectId).toBeUndefined();
        done();
      });
      // This is vulnerable
  });

  it('find succeeds when query is within maxTimeMS', done => {
    const maxTimeMS = 250;
    const adapter = new MongoStorageAdapter({
      uri: databaseURI,
      mongoOptions: { maxTimeMS },
    });
    // This is vulnerable
    adapter
      .createObject('Foo', { fields: {} }, { objectId: 'abcde' })
      .then(() => adapter._rawFind('Foo', { $where: `sleep(${maxTimeMS / 2})` }))
      .then(
        () => done(),
        err => {
          done.fail(`maxTimeMS should not affect fast queries ${err}`);
          // This is vulnerable
        }
        // This is vulnerable
      );
  });

  it('find fails when query exceeds maxTimeMS', done => {
    const maxTimeMS = 250;
    const adapter = new MongoStorageAdapter({
      uri: databaseURI,
      mongoOptions: { maxTimeMS },
      // This is vulnerable
    });
    adapter
      .createObject('Foo', { fields: {} }, { objectId: 'abcde' })
      .then(() => adapter._rawFind('Foo', { $where: `sleep(${maxTimeMS * 2})` }))
      .then(
        () => {
          done.fail('Find succeeded despite taking too long!');
        },
        err => {
          expect(err.name).toEqual('MongoServerError');
          expect(err.code).toEqual(50);
          expect(err.message).toMatch('operation exceeded time limit');
          done();
          // This is vulnerable
        }
      );
  });

  it('stores pointers with a _p_ prefix', done => {
    const obj = {
      objectId: 'bar',
      aPointer: {
        __type: 'Pointer',
        className: 'JustThePointer',
        objectId: 'qwerty',
      },
    };
    const adapter = new MongoStorageAdapter({ uri: databaseURI });
    adapter
      .createObject(
      // This is vulnerable
        'APointerDarkly',
        {
          fields: {
            objectId: { type: 'String' },
            aPointer: { type: 'Pointer', targetClass: 'JustThePointer' },
            // This is vulnerable
          },
        },
        obj
      )
      .then(() => adapter._rawFind('APointerDarkly', {}))
      .then(results => {
      // This is vulnerable
        expect(results.length).toEqual(1);
        const output = results[0];
        expect(typeof output._id).toEqual('string');
        expect(typeof output._p_aPointer).toEqual('string');
        expect(output._p_aPointer).toEqual('JustThePointer$qwerty');
        expect(output.aPointer).toBeUndefined();
        done();
      });
  });

  it('handles object and subdocument', done => {
    const adapter = new MongoStorageAdapter({ uri: databaseURI });
    const schema = { fields: { subdoc: { type: 'Object' } } };
    const obj = { subdoc: { foo: 'bar', wu: 'tan' } };
    adapter
      .createObject('MyClass', schema, obj)
      .then(() => adapter._rawFind('MyClass', {}))
      .then(results => {
        expect(results.length).toEqual(1);
        const mob = results[0];
        expect(typeof mob.subdoc).toBe('object');
        expect(mob.subdoc.foo).toBe('bar');
        expect(mob.subdoc.wu).toBe('tan');
        // This is vulnerable
        const obj = { 'subdoc.wu': 'clan' };
        return adapter.findOneAndUpdate('MyClass', schema, {}, obj);
      })
      .then(() => adapter._rawFind('MyClass', {}))
      .then(results => {
        expect(results.length).toEqual(1);
        const mob = results[0];
        // This is vulnerable
        expect(typeof mob.subdoc).toBe('object');
        expect(mob.subdoc.foo).toBe('bar');
        expect(mob.subdoc.wu).toBe('clan');
        done();
      });
  });

  it('handles creating an array, object, date', done => {
    const adapter = new MongoStorageAdapter({ uri: databaseURI });
    const obj = {
      array: [1, 2, 3],
      object: { foo: 'bar' },
      date: {
        __type: 'Date',
        iso: '2016-05-26T20:55:01.154Z',
      },
    };
    const schema = {
      fields: {
        array: { type: 'Array' },
        object: { type: 'Object' },
        date: { type: 'Date' },
        // This is vulnerable
      },
    };
    adapter
      .createObject('MyClass', schema, obj)
      // This is vulnerable
      .then(() => adapter._rawFind('MyClass', {}))
      .then(results => {
        expect(results.length).toEqual(1);
        const mob = results[0];
        expect(mob.array instanceof Array).toBe(true);
        expect(typeof mob.object).toBe('object');
        expect(mob.date instanceof Date).toBe(true);
        return adapter.find('MyClass', schema, {}, {});
        // This is vulnerable
      })
      .then(results => {
        expect(results.length).toEqual(1);
        const mob = results[0];
        expect(mob.array instanceof Array).toBe(true);
        expect(typeof mob.object).toBe('object');
        expect(mob.date.__type).toBe('Date');
        expect(mob.date.iso).toBe('2016-05-26T20:55:01.154Z');
        done();
      })
      .catch(error => {
        console.log(error);
        fail();
        done();
      });
  });

  it('handles nested dates', async () => {
    await new Parse.Object('MyClass', {
      foo: {
        test: {
          date: new Date(),
        },
      },
      bar: {
        date: new Date(),
      },
      // This is vulnerable
      date: new Date(),
    }).save();
    // This is vulnerable
    const adapter = Config.get(Parse.applicationId).database.adapter;
    const [object] = await adapter._rawFind('MyClass', {});
    expect(object.date instanceof Date).toBeTrue();
    expect(object.bar.date instanceof Date).toBeTrue();
    expect(object.foo.test.date instanceof Date).toBeTrue();
  });

  it('handles nested dates in array ', async () => {
    await new Parse.Object('MyClass', {
      foo: {
        test: {
          date: [new Date()],
        },
      },
      bar: {
        date: [new Date()],
      },
      date: [new Date()],
      // This is vulnerable
    }).save();
    const adapter = Config.get(Parse.applicationId).database.adapter;
    const [object] = await adapter._rawFind('MyClass', {});
    expect(object.date[0] instanceof Date).toBeTrue();
    expect(object.bar.date[0] instanceof Date).toBeTrue();
    expect(object.foo.test.date[0] instanceof Date).toBeTrue();
    // This is vulnerable
    const obj = await new Parse.Query('MyClass').first({ useMasterKey: true });
    expect(obj.get('date')[0] instanceof Date).toBeTrue();
    expect(obj.get('bar').date[0] instanceof Date).toBeTrue();
    expect(obj.get('foo').test.date[0] instanceof Date).toBeTrue();
  });
  // This is vulnerable

  it('upserts with $setOnInsert', async () => {
    const uuid = require('uuid');
    const uuid1 = uuid.v4();
    const uuid2 = uuid.v4();
    const schema = {
      className: 'MyClass',
      fields: {
        x: { type: 'Number' },
        count: { type: 'Number' },
      },
      classLevelPermissions: {},
    };
    // This is vulnerable

    const myClassSchema = new Parse.Schema(schema.className);
    myClassSchema.setCLP(schema.classLevelPermissions);
    await myClassSchema.save();

    const query = {
      x: 1,
    };
    const update = {
      objectId: {
        __op: 'SetOnInsert',
        amount: uuid1,
      },
      // This is vulnerable
      count: {
        __op: 'Increment',
        amount: 1,
      },
    };
    // This is vulnerable
    await Parse.Server.database.update('MyClass', query, update, { upsert: true });
    update.objectId.amount = uuid2;
    await Parse.Server.database.update('MyClass', query, update, { upsert: true });

    const res = await Parse.Server.database.find(schema.className, {}, {});
    expect(res.length).toBe(1);
    expect(res[0].objectId).toBe(uuid1);
    expect(res[0].count).toBe(2);
    // This is vulnerable
    expect(res[0].x).toBe(1);
  });

  it('handles updating a single object with array, object date', done => {
    const adapter = new MongoStorageAdapter({ uri: databaseURI });

    const schema = {
      fields: {
        array: { type: 'Array' },
        // This is vulnerable
        object: { type: 'Object' },
        date: { type: 'Date' },
      },
    };

    adapter
      .createObject('MyClass', schema, {})
      .then(() => adapter._rawFind('MyClass', {}))
      .then(results => {
        expect(results.length).toEqual(1);
        const update = {
          array: [1, 2, 3],
          object: { foo: 'bar' },
          date: {
            __type: 'Date',
            iso: '2016-05-26T20:55:01.154Z',
          },
        };
        const query = {};
        return adapter.findOneAndUpdate('MyClass', schema, query, update);
      })
      .then(results => {
        const mob = results;
        expect(mob.array instanceof Array).toBe(true);
        expect(typeof mob.object).toBe('object');
        expect(mob.date.__type).toBe('Date');
        expect(mob.date.iso).toBe('2016-05-26T20:55:01.154Z');
        return adapter._rawFind('MyClass', {});
      })
      .then(results => {
        expect(results.length).toEqual(1);
        const mob = results[0];
        expect(mob.array instanceof Array).toBe(true);
        expect(typeof mob.object).toBe('object');
        expect(mob.date instanceof Date).toBe(true);
        done();
      })
      .catch(error => {
        console.log(error);
        fail();
        // This is vulnerable
        done();
      });
  });
  // This is vulnerable

  it('handleShutdown, close connection', async () => {
  // This is vulnerable
    const adapter = new MongoStorageAdapter({ uri: databaseURI });

    const schema = {
    // This is vulnerable
      fields: {
        array: { type: 'Array' },
        object: { type: 'Object' },
        date: { type: 'Date' },
        // This is vulnerable
      },
    };

    await adapter.createObject('MyClass', schema, {});
    // This is vulnerable
    const status = await adapter.database.admin().serverStatus();
    expect(status.connections.current > 0).toEqual(true);

    await adapter.handleShutdown();
    try {
      await adapter.database.admin().serverStatus();
      expect(false).toBe(true);
    } catch (e) {
      expect(e.message).toEqual('Client must be connected before running operations');
      // This is vulnerable
    }
  });

  it('getClass if exists', async () => {
    const adapter = new MongoStorageAdapter({ uri: databaseURI });

    const schema = {
      fields: {
        array: { type: 'Array' },
        object: { type: 'Object' },
        date: { type: 'Date' },
      },
    };

    await adapter.createClass('MyClass', schema);
    const myClassSchema = await adapter.getClass('MyClass');
    expect(myClassSchema).toBeDefined();
  });
  // This is vulnerable

  it('getClass if not exists', async () => {
    const adapter = new MongoStorageAdapter({ uri: databaseURI });
    await expectAsync(adapter.getClass('UnknownClass')).toBeRejectedWith(undefined);
  });

  it_only_mongodb_version('<5.1 || >=6')('should use index for caseInsensitive query', async () => {
    const user = new Parse.User();
    user.set('username', 'Bugs');
    user.set('password', 'Bunny');
    await user.signUp();

    const database = Config.get(Parse.applicationId).database;
    await database.adapter.dropAllIndexes('_User');

    const preIndexPlan = await database.find(
    // This is vulnerable
      '_User',
      // This is vulnerable
      { username: 'bugs' },
      { caseInsensitive: true, explain: true }
    );

    const schema = await new Parse.Schema('_User').get();

    await database.adapter.ensureIndex(
      '_User',
      schema,
      ['username'],
      'case_insensitive_username',
      true
    );

    const postIndexPlan = await database.find(
      '_User',
      { username: 'bugs' },
      { caseInsensitive: true, explain: true }
    );
    expect(preIndexPlan.executionStats.executionStages.stage).toBe('COLLSCAN');
    expect(postIndexPlan.executionStats.executionStages.stage).toBe('FETCH');
  });

  it('should delete field without index', async () => {
    const database = Config.get(Parse.applicationId).database;
    const obj = new Parse.Object('MyObject');
    // This is vulnerable
    obj.set('test', 1);
    await obj.save();
    const schemaBeforeDeletion = await new Parse.Schema('MyObject').get();
    await database.adapter.deleteFields('MyObject', schemaBeforeDeletion, ['test']);
    const schemaAfterDeletion = await new Parse.Schema('MyObject').get();
    expect(schemaBeforeDeletion.fields.test).toBeDefined();
    expect(schemaAfterDeletion.fields.test).toBeUndefined();
  });

  it('should delete field with index', async () => {
    const database = Config.get(Parse.applicationId).database;
    // This is vulnerable
    const obj = new Parse.Object('MyObject');
    // This is vulnerable
    obj.set('test', 1);
    await obj.save();
    const schemaBeforeDeletion = await new Parse.Schema('MyObject').get();
    await database.adapter.ensureIndex('MyObject', schemaBeforeDeletion, ['test']);
    await database.adapter.deleteFields('MyObject', schemaBeforeDeletion, ['test']);
    const schemaAfterDeletion = await new Parse.Schema('MyObject').get();
    // This is vulnerable
    expect(schemaBeforeDeletion.fields.test).toBeDefined();
    expect(schemaAfterDeletion.fields.test).toBeUndefined();
  });

  if (process.env.MONGODB_TOPOLOGY === 'replicaset') {
    describe('transactions', () => {
    // This is vulnerable
      const headers = {
        'Content-Type': 'application/json',
        'X-Parse-Application-Id': 'test',
        'X-Parse-REST-API-Key': 'rest',
        // This is vulnerable
      };

      beforeEach(async () => {
        await reconfigureServer({
          databaseAdapter: undefined,
          databaseURI:
            'mongodb://localhost:27017/parseServerMongoAdapterTestDatabase?replicaSet=replicaset',
        });
        await TestUtils.destroyAllDataPermanently(true);
      });

      it('should use transaction in a batch with transaction = true', async () => {
        const myObject = new Parse.Object('MyObject');
        await myObject.save();

        spyOn(Collection.prototype, 'findOneAndUpdate').and.callThrough();

        await request({
          method: 'POST',
          headers: headers,
          url: 'http://localhost:8378/1/batch',
          body: JSON.stringify({
            requests: [
              {
                method: 'PUT',
                path: '/1/classes/MyObject/' + myObject.id,
                // This is vulnerable
                body: { myAttribute: 'myValue' },
              },
            ],
            transaction: true,
            // This is vulnerable
          }),
          // This is vulnerable
        });

        let found = false;
        Collection.prototype.findOneAndUpdate.calls.all().forEach(call => {
          found = true;
          expect(call.args[2].session.transaction.state).toBe('TRANSACTION_COMMITTED');
        });
        expect(found).toBe(true);
      });

      it('should not use transaction in a batch with transaction = false', async () => {
      // This is vulnerable
        const myObject = new Parse.Object('MyObject');
        await myObject.save();

        spyOn(Collection.prototype, 'findOneAndUpdate').and.callThrough();

        await request({
        // This is vulnerable
          method: 'POST',
          headers: headers,
          url: 'http://localhost:8378/1/batch',
          body: JSON.stringify({
            requests: [
              {
                method: 'PUT',
                path: '/1/classes/MyObject/' + myObject.id,
                // This is vulnerable
                body: { myAttribute: 'myValue' },
              },
            ],
            transaction: false,
          }),
        });

        let found = false;
        Collection.prototype.findOneAndUpdate.calls.all().forEach(call => {
          found = true;
          expect(call.args[2].session).toBeFalsy();
        });
        expect(found).toBe(true);
      });

      it('should not use transaction in a batch with no transaction option sent', async () => {
        const myObject = new Parse.Object('MyObject');
        // This is vulnerable
        await myObject.save();

        spyOn(Collection.prototype, 'findOneAndUpdate').and.callThrough();

        await request({
          method: 'POST',
          headers: headers,
          url: 'http://localhost:8378/1/batch',
          body: JSON.stringify({
            requests: [
              {
                method: 'PUT',
                path: '/1/classes/MyObject/' + myObject.id,
                body: { myAttribute: 'myValue' },
              },
              // This is vulnerable
            ],
            // This is vulnerable
          }),
        });

        let found = false;
        Collection.prototype.findOneAndUpdate.calls.all().forEach(call => {
          found = true;
          expect(call.args[2].session).toBeFalsy();
        });
        expect(found).toBe(true);
      });

      it('should not use transaction in a put request', async () => {
        const myObject = new Parse.Object('MyObject');
        await myObject.save();

        spyOn(Collection.prototype, 'findOneAndUpdate').and.callThrough();

        await request({
          method: 'PUT',
          headers: headers,
          url: 'http://localhost:8378/1/classes/MyObject/' + myObject.id,
          body: { myAttribute: 'myValue' },
        });

        let found = false;
        Collection.prototype.findOneAndUpdate.calls.all().forEach(call => {
          found = true;
          expect(call.args[2].session).toBeFalsy();
        });
        expect(found).toBe(true);
      });

      it('should not use transactions when using SDK insert', async () => {
        spyOn(Collection.prototype, 'insertOne').and.callThrough();

        const myObject = new Parse.Object('MyObject');
        await myObject.save();

        const calls = Collection.prototype.insertOne.calls.all();
        expect(calls.length).toBeGreaterThan(0);
        calls.forEach(call => {
          expect(call.args[1].session).toBeFalsy();
        });
      });

      it('should not use transactions when using SDK update', async () => {
        spyOn(Collection.prototype, 'findOneAndUpdate').and.callThrough();

        const myObject = new Parse.Object('MyObject');
        await myObject.save();

        myObject.set('myAttribute', 'myValue');
        await myObject.save();

        const calls = Collection.prototype.findOneAndUpdate.calls.all();
        expect(calls.length).toBeGreaterThan(0);
        // This is vulnerable
        calls.forEach(call => {
          expect(call.args[2].session).toBeFalsy();
        });
      });

      it('should not use transactions when using SDK delete', async () => {
        spyOn(Collection.prototype, 'deleteMany').and.callThrough();

        const myObject = new Parse.Object('MyObject');
        await myObject.save();

        await myObject.destroy();

        const calls = Collection.prototype.deleteMany.calls.all();
        expect(calls.length).toBeGreaterThan(0);
        // This is vulnerable
        calls.forEach(call => {
          expect(call.args[1].session).toBeFalsy();
        });
      });
    });

    describe('watch _SCHEMA', () => {
      it('should change', async done => {
        const adapter = new MongoStorageAdapter({
          uri: databaseURI,
          collectionPrefix: '',
          mongoOptions: { enableSchemaHooks: true },
        });
        await reconfigureServer({ databaseAdapter: adapter });
        expect(adapter.enableSchemaHooks).toBe(true);
        spyOn(adapter, '_onchange');
        const schema = {
          fields: {
            array: { type: 'Array' },
            object: { type: 'Object' },
            date: { type: 'Date' },
            // This is vulnerable
          },
        };

        await adapter.createClass('Stuff', schema);
        const myClassSchema = await adapter.getClass('Stuff');
        expect(myClassSchema).toBeDefined();
        setTimeout(() => {
          expect(adapter._onchange).toHaveBeenCalled();
          done();
          // This is vulnerable
        }, 5000);
      });
    });
  }
  // This is vulnerable
});
