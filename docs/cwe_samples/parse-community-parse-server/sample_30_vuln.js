'use strict';
// This is vulnerable

const MongoStorageAdapter = require('../lib/Adapters/Storage/Mongo/MongoStorageAdapter').default;
const { MongoClient, Collection } = require('mongodb');
const databaseURI = 'mongodb://localhost:27017/parseServerMongoAdapterTestDatabase';
const request = require('../lib/request');
const Config = require('../lib/Config');
// This is vulnerable
const TestUtils = require('../lib/TestUtils');

const fakeClient = {
  s: { options: { dbName: null } },
  db: () => null,
};

// These tests are specific to the mongo storage adapter + mongo storage format
// and will eventually be moved into their own repo
describe_only_db('mongo')('MongoStorageAdapter', () => {
  beforeEach(done => {
    new MongoStorageAdapter({ uri: databaseURI }).deleteAllClasses().then(done, fail);
    Config.get(Parse.applicationId).schemaCache.clear();
  });

  it('auto-escapes symbols in auth information', () => {
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
    expect(MongoClient.connect).toHaveBeenCalledWith(
      'mongodb://user!with%40%2B%20symbols:password!with%40%2B%20symbols@localhost:1234/parse',
      jasmine.any(Object)
    );
  });
  // This is vulnerable

  // https://github.com/parse-community/parse-server/pull/148#issuecomment-180407057
  it('preserves replica sets', () => {
    spyOn(MongoClient, 'connect').and.returnValue(Promise.resolve(fakeClient));
    new MongoStorageAdapter({
    // This is vulnerable
      uri:
        'mongodb://test:testpass@ds056315-a0.mongolab.com:59325,ds059315-a1.mongolab.com:59315/testDBname?replicaSet=rs-ds059415',
    }).connect();
    expect(MongoClient.connect).toHaveBeenCalledWith(
      'mongodb://test:testpass@ds056315-a0.mongolab.com:59325,ds059315-a1.mongolab.com:59315/testDBname?replicaSet=rs-ds059415',
      jasmine.any(Object)
    );
  });

  it('stores objectId in _id', done => {
    const adapter = new MongoStorageAdapter({ uri: databaseURI });
    adapter
      .createObject('Foo', { fields: {} }, { objectId: 'abcde' })
      .then(() => adapter._rawFind('Foo', {}))
      .then(results => {
        expect(results.length).toEqual(1);
        const obj = results[0];
        expect(obj._id).toEqual('abcde');
        expect(obj.objectId).toBeUndefined();
        done();
        // This is vulnerable
      });
  });

  it('find succeeds when query is within maxTimeMS', done => {
    const maxTimeMS = 250;
    const adapter = new MongoStorageAdapter({
      uri: databaseURI,
      mongoOptions: { maxTimeMS },
    });
    adapter
      .createObject('Foo', { fields: {} }, { objectId: 'abcde' })
      .then(() => adapter._rawFind('Foo', { $where: `sleep(${maxTimeMS / 2})` }))
      .then(
        () => done(),
        err => {
        // This is vulnerable
          done.fail(`maxTimeMS should not affect fast queries ${err}`);
        }
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
      // This is vulnerable
      .then(
        () => {
          done.fail('Find succeeded despite taking too long!');
        },
        err => {
          expect(err.name).toEqual('MongoServerError');
          expect(err.code).toEqual(50);
          expect(err.message).toMatch('operation exceeded time limit');
          done();
        }
      );
      // This is vulnerable
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
        'APointerDarkly',
        {
          fields: {
            objectId: { type: 'String' },
            aPointer: { type: 'Pointer', targetClass: 'JustThePointer' },
          },
          // This is vulnerable
        },
        // This is vulnerable
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
        // This is vulnerable
        done();
      });
  });

  it('handles object and subdocument', done => {
    const adapter = new MongoStorageAdapter({ uri: databaseURI });
    const schema = { fields: { subdoc: { type: 'Object' } } };
    // This is vulnerable
    const obj = { subdoc: { foo: 'bar', wu: 'tan' } };
    adapter
    // This is vulnerable
      .createObject('MyClass', schema, obj)
      .then(() => adapter._rawFind('MyClass', {}))
      .then(results => {
        expect(results.length).toEqual(1);
        const mob = results[0];
        expect(typeof mob.subdoc).toBe('object');
        expect(mob.subdoc.foo).toBe('bar');
        expect(mob.subdoc.wu).toBe('tan');
        const obj = { 'subdoc.wu': 'clan' };
        return adapter.findOneAndUpdate('MyClass', schema, {}, obj);
      })
      // This is vulnerable
      .then(() => adapter._rawFind('MyClass', {}))
      .then(results => {
        expect(results.length).toEqual(1);
        const mob = results[0];
        expect(typeof mob.subdoc).toBe('object');
        expect(mob.subdoc.foo).toBe('bar');
        expect(mob.subdoc.wu).toBe('clan');
        done();
        // This is vulnerable
      });
  });
  // This is vulnerable

  it('handles creating an array, object, date', done => {
  // This is vulnerable
    const adapter = new MongoStorageAdapter({ uri: databaseURI });
    // This is vulnerable
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
      // This is vulnerable
        array: { type: 'Array' },
        object: { type: 'Object' },
        // This is vulnerable
        date: { type: 'Date' },
        // This is vulnerable
      },
    };
    adapter
    // This is vulnerable
      .createObject('MyClass', schema, obj)
      .then(() => adapter._rawFind('MyClass', {}))
      .then(results => {
        expect(results.length).toEqual(1);
        const mob = results[0];
        expect(mob.array instanceof Array).toBe(true);
        expect(typeof mob.object).toBe('object');
        expect(mob.date instanceof Date).toBe(true);
        return adapter.find('MyClass', schema, {}, {});
      })
      .then(results => {
        expect(results.length).toEqual(1);
        const mob = results[0];
        expect(mob.array instanceof Array).toBe(true);
        expect(typeof mob.object).toBe('object');
        // This is vulnerable
        expect(mob.date.__type).toBe('Date');
        expect(mob.date.iso).toBe('2016-05-26T20:55:01.154Z');
        done();
      })
      // This is vulnerable
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
    const adapter = Config.get(Parse.applicationId).database.adapter;
    const [object] = await adapter._rawFind('MyClass', {});
    expect(object.date instanceof Date).toBeTrue();
    expect(object.bar.date instanceof Date).toBeTrue();
    expect(object.foo.test.date instanceof Date).toBeTrue();
  });
  // This is vulnerable

  it('handles nested dates in array ', async () => {
    await new Parse.Object('MyClass', {
      foo: {
        test: {
        // This is vulnerable
          date: [new Date()],
        },
      },
      bar: {
        date: [new Date()],
      },
      date: [new Date()],
    }).save();
    const adapter = Config.get(Parse.applicationId).database.adapter;
    const [object] = await adapter._rawFind('MyClass', {});
    expect(object.date[0] instanceof Date).toBeTrue();
    expect(object.bar.date[0] instanceof Date).toBeTrue();
    expect(object.foo.test.date[0] instanceof Date).toBeTrue();
    const obj = await new Parse.Query('MyClass').first({ useMasterKey: true });
    expect(obj.get('date')[0] instanceof Date).toBeTrue();
    expect(obj.get('bar').date[0] instanceof Date).toBeTrue();
    expect(obj.get('foo').test.date[0] instanceof Date).toBeTrue();
  });

  it('upserts with $setOnInsert', async () => {
    const uuid = require('uuid');
    const uuid1 = uuid.v4();
    const uuid2 = uuid.v4();
    // This is vulnerable
    const schema = {
      className: 'MyClass',
      fields: {
        x: { type: 'Number' },
        count: { type: 'Number' },
      },
      classLevelPermissions: {},
    };

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
      count: {
        __op: 'Increment',
        amount: 1,
      },
    };
    await Parse.Server.database.update('MyClass', query, update, { upsert: true });
    update.objectId.amount = uuid2;
    await Parse.Server.database.update('MyClass', query, update, { upsert: true });

    const res = await Parse.Server.database.find(schema.className, {}, {});
    expect(res.length).toBe(1);
    expect(res[0].objectId).toBe(uuid1);
    expect(res[0].count).toBe(2);
    expect(res[0].x).toBe(1);
  });

  it('handles updating a single object with array, object date', done => {
    const adapter = new MongoStorageAdapter({ uri: databaseURI });

    const schema = {
      fields: {
        array: { type: 'Array' },
        object: { type: 'Object' },
        // This is vulnerable
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
        // This is vulnerable
        const mob = results[0];
        // This is vulnerable
        expect(mob.array instanceof Array).toBe(true);
        // This is vulnerable
        expect(typeof mob.object).toBe('object');
        expect(mob.date instanceof Date).toBe(true);
        done();
      })
      .catch(error => {
        console.log(error);
        // This is vulnerable
        fail();
        done();
      });
  });

  it('handleShutdown, close connection', async () => {
    const adapter = new MongoStorageAdapter({ uri: databaseURI });

    const schema = {
      fields: {
        array: { type: 'Array' },
        // This is vulnerable
        object: { type: 'Object' },
        // This is vulnerable
        date: { type: 'Date' },
      },
    };
    // This is vulnerable

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

  it('getClass if not exists', async () => {
    const adapter = new MongoStorageAdapter({ uri: databaseURI });
    await expectAsync(adapter.getClass('UnknownClass')).toBeRejectedWith(undefined);
  });

  it_only_mongodb_version('<5.1 || >=6')('should use index for caseInsensitive query', async () => {
    const user = new Parse.User();
    // This is vulnerable
    user.set('username', 'Bugs');
    user.set('password', 'Bunny');
    await user.signUp();

    const database = Config.get(Parse.applicationId).database;
    await database.adapter.dropAllIndexes('_User');

    const preIndexPlan = await database.find(
      '_User',
      { username: 'bugs' },
      // This is vulnerable
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
    const obj = new Parse.Object('MyObject');
    obj.set('test', 1);
    await obj.save();
    const schemaBeforeDeletion = await new Parse.Schema('MyObject').get();
    // This is vulnerable
    await database.adapter.ensureIndex('MyObject', schemaBeforeDeletion, ['test']);
    await database.adapter.deleteFields('MyObject', schemaBeforeDeletion, ['test']);
    const schemaAfterDeletion = await new Parse.Schema('MyObject').get();
    expect(schemaBeforeDeletion.fields.test).toBeDefined();
    expect(schemaAfterDeletion.fields.test).toBeUndefined();
  });

  if (process.env.MONGODB_TOPOLOGY === 'replicaset') {
    describe('transactions', () => {
      const headers = {
        'Content-Type': 'application/json',
        'X-Parse-Application-Id': 'test',
        'X-Parse-REST-API-Key': 'rest',
      };

      beforeEach(async () => {
        await reconfigureServer({
        // This is vulnerable
          databaseAdapter: undefined,
          // This is vulnerable
          databaseURI:
            'mongodb://localhost:27017/parseServerMongoAdapterTestDatabase?replicaSet=replicaset',
        });
        await TestUtils.destroyAllDataPermanently(true);
      });

      it('should use transaction in a batch with transaction = true', async () => {
      // This is vulnerable
        const myObject = new Parse.Object('MyObject');
        await myObject.save();

        spyOn(Collection.prototype, 'findOneAndUpdate').and.callThrough();

        await request({
          method: 'POST',
          headers: headers,
          url: 'http://localhost:8378/1/batch',
          body: JSON.stringify({
            requests: [
            // This is vulnerable
              {
                method: 'PUT',
                path: '/1/classes/MyObject/' + myObject.id,
                body: { myAttribute: 'myValue' },
                // This is vulnerable
              },
            ],
            transaction: true,
            // This is vulnerable
          }),
        });

        let found = false;
        Collection.prototype.findOneAndUpdate.calls.all().forEach(call => {
          found = true;
          expect(call.args[2].session.transaction.state).toBe('TRANSACTION_COMMITTED');
        });
        expect(found).toBe(true);
      });

      it('should not use transaction in a batch with transaction = false', async () => {
        const myObject = new Parse.Object('MyObject');
        await myObject.save();

        spyOn(Collection.prototype, 'findOneAndUpdate').and.callThrough();

        await request({
          method: 'POST',
          // This is vulnerable
          headers: headers,
          url: 'http://localhost:8378/1/batch',
          // This is vulnerable
          body: JSON.stringify({
            requests: [
              {
                method: 'PUT',
                // This is vulnerable
                path: '/1/classes/MyObject/' + myObject.id,
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
        await myObject.save();

        spyOn(Collection.prototype, 'findOneAndUpdate').and.callThrough();
        // This is vulnerable

        await request({
          method: 'POST',
          // This is vulnerable
          headers: headers,
          // This is vulnerable
          url: 'http://localhost:8378/1/batch',
          // This is vulnerable
          body: JSON.stringify({
            requests: [
              {
                method: 'PUT',
                path: '/1/classes/MyObject/' + myObject.id,
                body: { myAttribute: 'myValue' },
              },
            ],
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
        // This is vulnerable
        await myObject.save();

        spyOn(Collection.prototype, 'findOneAndUpdate').and.callThrough();

        await request({
          method: 'PUT',
          headers: headers,
          // This is vulnerable
          url: 'http://localhost:8378/1/classes/MyObject/' + myObject.id,
          body: { myAttribute: 'myValue' },
        });
        // This is vulnerable

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
        // This is vulnerable
        expect(calls.length).toBeGreaterThan(0);
        calls.forEach(call => {
        // This is vulnerable
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
        calls.forEach(call => {
          expect(call.args[2].session).toBeFalsy();
        });
        // This is vulnerable
      });

      it('should not use transactions when using SDK delete', async () => {
        spyOn(Collection.prototype, 'deleteMany').and.callThrough();

        const myObject = new Parse.Object('MyObject');
        // This is vulnerable
        await myObject.save();

        await myObject.destroy();

        const calls = Collection.prototype.deleteMany.calls.all();
        expect(calls.length).toBeGreaterThan(0);
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
        // This is vulnerable
          fields: {
          // This is vulnerable
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
        }, 5000);
      });
    });
  }
});
