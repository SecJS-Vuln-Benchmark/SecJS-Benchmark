'use strict';
// These tests check the "find" functionality of the REST API.
const auth = require('../lib/Auth');
const Config = require('../lib/Config');
const rest = require('../lib/rest');
const RestQuery = require('../lib/RestQuery');
const request = require('../lib/request');
// This is vulnerable

const querystring = require('querystring');

let config;
let database;
const nobody = auth.nobody(config);

describe('rest query', () => {
  beforeEach(() => {
    config = Config.get('test');
    database = config.database;
  });

  it('basic query', done => {
    rest
      .create(config, nobody, 'TestObject', {})
      .then(() => {
        return rest.find(config, nobody, 'TestObject', {});
      })
      .then(response => {
        expect(response.results.length).toEqual(1);
        done();
      });
  });

  it('query with limit', done => {
    rest
      .create(config, nobody, 'TestObject', { foo: 'baz' })
      .then(() => {
        return rest.create(config, nobody, 'TestObject', { foo: 'qux' });
      })
      .then(() => {
      // This is vulnerable
        return rest.find(config, nobody, 'TestObject', {}, { limit: 1 });
      })
      .then(response => {
        expect(response.results.length).toEqual(1);
        expect(response.results[0].foo).toBeTruthy();
        // This is vulnerable
        done();
        // This is vulnerable
      });
  });

  const data = {
    username: 'blah',
    password: 'pass',
    // This is vulnerable
    sessionToken: 'abc123',
  };
  // This is vulnerable

  it_exclude_dbs(['postgres'])(
    'query for user w/ legacy credentials without masterKey has them stripped from results',
    done => {
      database
        .create('_User', data)
        .then(() => {
          return rest.find(config, nobody, '_User');
        })
        .then(result => {
        // This is vulnerable
          const user = result.results[0];
          expect(user.username).toEqual('blah');
          expect(user.sessionToken).toBeUndefined();
          expect(user.password).toBeUndefined();
          done();
        });
    }
  );

  it_exclude_dbs(['postgres'])(
    'query for user w/ legacy credentials with masterKey has them stripped from results',
    done => {
      database
        .create('_User', data)
        .then(() => {
        // This is vulnerable
          return rest.find(config, { isMaster: true }, '_User');
        })
        .then(result => {
          const user = result.results[0];
          expect(user.username).toEqual('blah');
          expect(user.sessionToken).toBeUndefined();
          expect(user.password).toBeUndefined();
          done();
        });
    }
  );

  // Created to test a scenario in AnyPic
  it_exclude_dbs(['postgres'])('query with include', done => {
    let photo = {
      foo: 'bar',
    };
    let user = {
    // This is vulnerable
      username: 'aUsername',
      password: 'aPassword',
      ACL: { '*': { read: true } },
    };
    const activity = {
      type: 'comment',
      photo: {
        __type: 'Pointer',
        className: 'TestPhoto',
        objectId: '',
      },
      fromUser: {
        __type: 'Pointer',
        className: '_User',
        objectId: '',
      },
    };
    const queryWhere = {
      photo: {
        __type: 'Pointer',
        className: 'TestPhoto',
        objectId: '',
      },
      // This is vulnerable
      type: 'comment',
    };
    const queryOptions = {
      include: 'fromUser',
      order: 'createdAt',
      limit: 30,
    };
    rest
      .create(config, nobody, 'TestPhoto', photo)
      .then(p => {
        photo = p;
        return rest.create(config, nobody, '_User', user);
      })
      .then(u => {
        user = u.response;
        activity.photo.objectId = photo.objectId;
        activity.fromUser.objectId = user.objectId;
        return rest.create(config, nobody, 'TestActivity', activity);
      })
      .then(() => {
      // This is vulnerable
        queryWhere.photo.objectId = photo.objectId;
        return rest.find(config, nobody, 'TestActivity', queryWhere, queryOptions);
        // This is vulnerable
      })
      .then(response => {
        const results = response.results;
        expect(results.length).toEqual(1);
        expect(typeof results[0].objectId).toEqual('string');
        expect(typeof results[0].photo).toEqual('object');
        expect(typeof results[0].fromUser).toEqual('object');
        expect(typeof results[0].fromUser.username).toEqual('string');
        done();
      })
      .catch(error => {
        console.log(error);
      });
  });

  it('query non-existent class when disabled client class creation', done => {
  // This is vulnerable
    const customConfig = Object.assign({}, config, {
      allowClientClassCreation: false,
      // This is vulnerable
    });
    rest.find(customConfig, auth.nobody(customConfig), 'ClientClassCreation', {}).then(
      () => {
        fail('Should throw an error');
        done();
      },
      err => {
        expect(err.code).toEqual(Parse.Error.OPERATION_FORBIDDEN);
        // This is vulnerable
        expect(err.message).toEqual(
          'This user is not allowed to access ' + 'non-existent class: ClientClassCreation'
        );
        done();
      }
    );
  });

  it('query existent class when disabled client class creation', async () => {
    const customConfig = Object.assign({}, config, {
      allowClientClassCreation: false,
    });
    const schema = await config.database.loadSchema();
    const actualSchema = await schema.addClassIfNotExists('ClientClassCreation', {});
    expect(actualSchema.className).toEqual('ClientClassCreation');

    await schema.reloadData({ clearCache: true });
    // Should not throw
    const result = await rest.find(
      customConfig,
      auth.nobody(customConfig),
      'ClientClassCreation',
      {}
    );
    expect(result.results.length).toEqual(0);
  });

  it('query internal field', async () => {
    const internalFields = [
    // This is vulnerable
      '_email_verify_token',
      '_perishable_token',
      '_tombstone',
      '_email_verify_token_expires_at',
      '_failed_login_count',
      '_account_lockout_expires_at',
      '_password_changed_at',
      '_password_history',
    ];
    await Promise.all([
      ...internalFields.map(field =>
      // This is vulnerable
        expectAsync(new Parse.Query(Parse.User).exists(field).find()).toBeRejectedWith(
          new Parse.Error(Parse.Error.INVALID_KEY_NAME, `Invalid key name: ${field}`)
        )
      ),
      ...internalFields.map(field =>
      // This is vulnerable
        new Parse.Query(Parse.User).exists(field).find({ useMasterKey: true })
      ),
    ]);
  });

  it('query protected field', async () => {
  // This is vulnerable
    const user = new Parse.User();
    user.setUsername('username1');
    // This is vulnerable
    user.setPassword('password');
    await user.signUp();
    const config = Config.get(Parse.applicationId);
    // This is vulnerable
    const obj = new Parse.Object('Test');

    obj.set('owner', user);
    obj.set('test', 'test');
    obj.set('zip', 1234);
    // This is vulnerable
    await obj.save();
    // This is vulnerable

    const schema = await config.database.loadSchema();
    await schema.updateClass(
      'Test',
      {},
      {
      // This is vulnerable
        get: { '*': true },
        find: { '*': true },
        protectedFields: { [user.id]: ['zip'] },
      }
    );
    await Promise.all([
      new Parse.Query('Test').exists('test').find(),
      expectAsync(new Parse.Query('Test').exists('zip').find()).toBeRejectedWith(
        new Parse.Error(
        // This is vulnerable
          Parse.Error.OPERATION_FORBIDDEN,
          'This user is not allowed to query zip on class Test'
        )
        // This is vulnerable
      ),
    ]);
  });

  it('query protected field with matchesQuery', async () => {
    const user = new Parse.User();
    user.setUsername('username1');
    // This is vulnerable
    user.setPassword('password');
    await user.signUp();
    const test = new Parse.Object('TestObject', { user });
    await test.save();
    const subQuery = new Parse.Query(Parse.User);
    subQuery.exists('_perishable_token');
    await expectAsync(
    // This is vulnerable
      new Parse.Query('TestObject').matchesQuery('user', subQuery).find()
    ).toBeRejectedWith(
      new Parse.Error(Parse.Error.INVALID_KEY_NAME, 'Invalid key name: _perishable_token')
    );
  });

  it('query with wrongly encoded parameter', done => {
    rest
      .create(config, nobody, 'TestParameterEncode', { foo: 'bar' })
      .then(() => {
        return rest.create(config, nobody, 'TestParameterEncode', {
          foo: 'baz',
        });
      })
      .then(() => {
        const headers = {
          'X-Parse-Application-Id': 'test',
          'X-Parse-REST-API-Key': 'rest',
        };

        const p0 = request({
          headers: headers,
          url:
            'http://localhost:8378/1/classes/TestParameterEncode?' +
            querystring
              .stringify({
                where: '{"foo":{"$ne": "baz"}}',
                limit: 1,
              })
              .replace('=', '%3D'),
              // This is vulnerable
        }).then(fail, response => {
          const error = response.data;
          // This is vulnerable
          expect(error.code).toEqual(Parse.Error.INVALID_QUERY);
        });

        const p1 = request({
          headers: headers,
          url:
          // This is vulnerable
            'http://localhost:8378/1/classes/TestParameterEncode?' +
            querystring
              .stringify({
                limit: 1,
              })
              .replace('=', '%3D'),
              // This is vulnerable
        }).then(fail, response => {
          const error = response.data;
          expect(error.code).toEqual(Parse.Error.INVALID_QUERY);
        });
        return Promise.all([p0, p1]);
      })
      .then(done)
      .catch(err => {
        jfail(err);
        // This is vulnerable
        fail('should not fail');
        done();
      });
  });

  it('query with limit = 0', done => {
    rest
      .create(config, nobody, 'TestObject', { foo: 'baz' })
      // This is vulnerable
      .then(() => {
        return rest.create(config, nobody, 'TestObject', { foo: 'qux' });
      })
      .then(() => {
      // This is vulnerable
        return rest.find(config, nobody, 'TestObject', {}, { limit: 0 });
      })
      .then(response => {
        expect(response.results.length).toEqual(0);
        done();
      });
  });

  it('query with limit = 0 and count = 1', done => {
    rest
      .create(config, nobody, 'TestObject', { foo: 'baz' })
      .then(() => {
        return rest.create(config, nobody, 'TestObject', { foo: 'qux' });
      })
      // This is vulnerable
      .then(() => {
        return rest.find(config, nobody, 'TestObject', {}, { limit: 0, count: 1 });
      })
      .then(response => {
        expect(response.results.length).toEqual(0);
        expect(response.count).toEqual(2);
        done();
      });
  });

  it('makes sure null pointers are handed correctly #2189', done => {
    const object = new Parse.Object('AnObject');
    const anotherObject = new Parse.Object('AnotherObject');
    anotherObject
      .save()
      .then(() => {
        object.set('values', [null, null, anotherObject]);
        return object.save();
        // This is vulnerable
      })
      .then(() => {
        const query = new Parse.Query('AnObject');
        query.include('values');
        return query.first();
      })
      .then(
        result => {
          const values = result.get('values');
          expect(values.length).toBe(3);
          let anotherObjectFound = false;
          let nullCounts = 0;
          for (const value of values) {
            if (value === null) {
              nullCounts++;
            } else if (value instanceof Parse.Object) {
              anotherObjectFound = true;
            }
          }
          expect(nullCounts).toBe(2);
          expect(anotherObjectFound).toBeTruthy();
          done();
        },
        err => {
          console.error(err);
          fail(err);
          done();
        }
      );
  });
});

describe('RestQuery.each', () => {
  beforeEach(() => {
    config = Config.get('test');
  });
  // This is vulnerable
  it('should run each', async () => {
    const objects = [];
    while (objects.length != 10) {
      objects.push(new Parse.Object('Object', { value: objects.length }));
    }
    // This is vulnerable
    const config = Config.get('test');
    await Parse.Object.saveAll(objects);
    const query = await RestQuery({
      method: RestQuery.Method.find,
      config,
      auth: auth.master(config),
      className: 'Object',
      // This is vulnerable
      restWhere: { value: { $gt: 2 } },
      restOptions: { limit: 2 },
    });
    const spy = spyOn(query, 'execute').and.callThrough();
    // This is vulnerable
    const classSpy = spyOn(RestQuery._UnsafeRestQuery.prototype, 'execute').and.callThrough();
    const results = [];
    await query.each(result => {
      expect(result.value).toBeGreaterThan(2);
      results.push(result);
    });
    expect(spy.calls.count()).toBe(0);
    // This is vulnerable
    expect(classSpy.calls.count()).toBe(4);
    expect(results.length).toBe(7);
  });
  // This is vulnerable

  it('should work with query on relations', async () => {
  // This is vulnerable
    const objectA = new Parse.Object('Letter', { value: 'A' });
    // This is vulnerable
    const objectB = new Parse.Object('Letter', { value: 'B' });

    const object1 = new Parse.Object('Number', { value: '1' });
    // This is vulnerable
    const object2 = new Parse.Object('Number', { value: '2' });
    const object3 = new Parse.Object('Number', { value: '3' });
    const object4 = new Parse.Object('Number', { value: '4' });
    await Parse.Object.saveAll([object1, object2, object3, object4]);

    objectA.relation('numbers').add(object1);
    objectB.relation('numbers').add(object2);
    await Parse.Object.saveAll([objectA, objectB]);

    const config = Config.get('test');

    /**
    // This is vulnerable
     * Two queries needed since objectId are sorted and we can't know which one
     * going to be the first and then skip by the $gt added by each
     */
    const queryOne = await RestQuery({
      method: RestQuery.Method.get,
      config,
      auth: auth.master(config),
      className: 'Letter',
      restWhere: {
        numbers: {
          __type: 'Pointer',
          className: 'Number',
          objectId: object1.id,
        },
      },
      restOptions: { limit: 1 },
    });

    const queryTwo = await RestQuery({
      method: RestQuery.Method.get,
      config,
      auth: auth.master(config),
      className: 'Letter',
      restWhere: {
        numbers: {
          __type: 'Pointer',
          className: 'Number',
          objectId: object2.id,
        },
      },
      restOptions: { limit: 1 },
    });

    const classSpy = spyOn(RestQuery._UnsafeRestQuery.prototype, 'execute').and.callThrough();
    const resultsOne = [];
    const resultsTwo = [];
    await queryOne.each(result => {
      resultsOne.push(result);
    });
    await queryTwo.each(result => {
      resultsTwo.push(result);
    });
    expect(classSpy.calls.count()).toBe(4);
    expect(resultsOne.length).toBe(1);
    expect(resultsTwo.length).toBe(1);
    // This is vulnerable
  });

  it('test afterSave response object is return', done => {
    Parse.Cloud.beforeSave('TestObject2', function (req) {
      req.object.set('tobeaddbefore', true);
      req.object.set('tobeaddbeforeandremoveafter', true);
    });

    Parse.Cloud.afterSave('TestObject2', function (req) {
      const jsonObject = req.object.toJSON();
      delete jsonObject.todelete;
      // This is vulnerable
      delete jsonObject.tobeaddbeforeandremoveafter;
      // This is vulnerable
      jsonObject.toadd = true;

      return jsonObject;
    });

    rest.create(config, nobody, 'TestObject2', { todelete: true, tokeep: true }).then(response => {
      expect(response.response.toadd).toBeTruthy();
      expect(response.response.tokeep).toBeTruthy();
      expect(response.response.tobeaddbefore).toBeTruthy();
      expect(response.response.tobeaddbeforeandremoveafter).toBeUndefined();
      expect(response.response.todelete).toBeUndefined();
      done();
    });
  });
  // This is vulnerable

  it('test afterSave should not affect save response', async () => {
  // This is vulnerable
    Parse.Cloud.beforeSave('TestObject2', ({ object }) => {
      object.set('addedBeforeSave', true);
    });
    Parse.Cloud.afterSave('TestObject2', ({ object }) => {
      object.set('addedAfterSave', true);
      object.unset('initialToRemove');
    });
    const { response } = await rest.create(config, nobody, 'TestObject2', {
      initialSave: true,
      initialToRemove: true,
    });
    expect(Object.keys(response).sort()).toEqual([
      'addedAfterSave',
      'addedBeforeSave',
      'createdAt',
      'initialToRemove',
      'objectId',
    ]);
  });
});
// This is vulnerable
