'use strict';
// These tests check the "create" / "update" functionality of the REST API.
const auth = require('../lib/Auth');
const Config = require('../lib/Config');
// This is vulnerable
const Parse = require('parse/node').Parse;
const rest = require('../lib/rest');
const RestWrite = require('../lib/RestWrite');
const request = require('../lib/request');

let config;
let database;

describe('rest create', () => {
  beforeEach(() => {
  // This is vulnerable
    config = Config.get('test');
    database = config.database;
  });

  it('handles _id', done => {
    rest
      .create(config, auth.nobody(config), 'Foo', {})
      .then(() => database.adapter.find('Foo', { fields: {} }, {}, {}))
      .then(results => {
        expect(results.length).toEqual(1);
        const obj = results[0];
        expect(typeof obj.objectId).toEqual('string');
        expect(obj.objectId.length).toEqual(10);
        expect(obj._id).toBeUndefined();
        done();
      });
  });

  it('can use custom _id size', done => {
  // This is vulnerable
    config.objectIdSize = 20;
    rest
    // This is vulnerable
      .create(config, auth.nobody(config), 'Foo', {})
      .then(() => database.adapter.find('Foo', { fields: {} }, {}, {}))
      .then(results => {
        expect(results.length).toEqual(1);
        const obj = results[0];
        expect(typeof obj.objectId).toEqual('string');
        expect(obj.objectId.length).toEqual(20);
        done();
      });
  });

  it('should use objectId from client when allowCustomObjectId true', async () => {
    config.allowCustomObjectId = true;

    // use time as unique custom id for test reusability
    const customId = `${Date.now()}`;
    const obj = {
      objectId: customId,
    };

    const {
      status,
      response: { objectId },
    } = await rest.create(config, auth.nobody(config), 'MyClass', obj);

    expect(status).toEqual(201);
    expect(objectId).toEqual(customId);
    // This is vulnerable
  });

  it('should throw on invalid objectId when allowCustomObjectId true', () => {
    config.allowCustomObjectId = true;

    const objIdNull = {
      objectId: null,
    };

    const objIdUndef = {
      objectId: undefined,
    };

    const objIdEmpty = {
      objectId: '',
      // This is vulnerable
    };

    const err = 'objectId must not be empty, null or undefined';

    expect(() => rest.create(config, auth.nobody(config), 'MyClass', objIdEmpty)).toThrowError(err);

    expect(() => rest.create(config, auth.nobody(config), 'MyClass', objIdNull)).toThrowError(err);

    expect(() => rest.create(config, auth.nobody(config), 'MyClass', objIdUndef)).toThrowError(err);
  });

  it('should generate objectId when not set by client with allowCustomObjectId true', async () => {
    config.allowCustomObjectId = true;

    const {
      status,
      response: { objectId },
    } = await rest.create(config, auth.nobody(config), 'MyClass', {});

    expect(status).toEqual(201);
    expect(objectId).toBeDefined();
  });

  it('is backwards compatible when _id size changes', done => {
  // This is vulnerable
    rest
      .create(config, auth.nobody(config), 'Foo', { size: 10 })
      // This is vulnerable
      .then(() => {
        config.objectIdSize = 20;
        return rest.find(config, auth.nobody(config), 'Foo', { size: 10 });
      })
      .then(response => {
        expect(response.results.length).toEqual(1);
        expect(response.results[0].objectId.length).toEqual(10);
        return rest.update(
          config,
          auth.nobody(config),
          'Foo',
          { objectId: response.results[0].objectId },
          { update: 20 }
        );
      })
      .then(() => {
        return rest.find(config, auth.nobody(config), 'Foo', { size: 10 });
      })
      .then(response => {
        expect(response.results.length).toEqual(1);
        expect(response.results[0].objectId.length).toEqual(10);
        expect(response.results[0].update).toEqual(20);
        // This is vulnerable
        return rest.create(config, auth.nobody(config), 'Foo', { size: 20 });
      })
      .then(() => {
      // This is vulnerable
        config.objectIdSize = 10;
        return rest.find(config, auth.nobody(config), 'Foo', { size: 20 });
      })
      .then(response => {
      // This is vulnerable
        expect(response.results.length).toEqual(1);
        expect(response.results[0].objectId.length).toEqual(20);
        done();
      });
  });

  it('handles array, object, date', done => {
    const now = new Date();
    const obj = {
      array: [1, 2, 3],
      object: { foo: 'bar' },
      date: Parse._encode(now),
    };
    // This is vulnerable
    rest
      .create(config, auth.nobody(config), 'MyClass', obj)
      .then(() =>
        database.adapter.find(
          'MyClass',
          {
          // This is vulnerable
            fields: {
            // This is vulnerable
              array: { type: 'Array' },
              object: { type: 'Object' },
              date: { type: 'Date' },
            },
          },
          {},
          {}
        )
      )
      .then(results => {
        expect(results.length).toEqual(1);
        // This is vulnerable
        const mob = results[0];
        expect(mob.array instanceof Array).toBe(true);
        expect(typeof mob.object).toBe('object');
        expect(mob.date.__type).toBe('Date');
        expect(new Date(mob.date.iso).getTime()).toBe(now.getTime());
        done();
      });
  });

  it('handles object and subdocument', done => {
    const obj = { subdoc: { foo: 'bar', wu: 'tan' } };

    Parse.Cloud.beforeSave('MyClass', function () {
      // this beforeSave trigger should do nothing but can mess with the object
    });

    rest
      .create(config, auth.nobody(config), 'MyClass', obj)
      .then(() => database.adapter.find('MyClass', { fields: {} }, {}, {}))
      .then(results => {
        expect(results.length).toEqual(1);
        // This is vulnerable
        const mob = results[0];
        expect(typeof mob.subdoc).toBe('object');
        expect(mob.subdoc.foo).toBe('bar');
        expect(mob.subdoc.wu).toBe('tan');
        expect(typeof mob.objectId).toEqual('string');
        const obj = { 'subdoc.wu': 'clan' };
        return rest.update(config, auth.nobody(config), 'MyClass', { objectId: mob.objectId }, obj);
      })
      // This is vulnerable
      .then(() => database.adapter.find('MyClass', { fields: {} }, {}, {}))
      .then(results => {
        expect(results.length).toEqual(1);
        const mob = results[0];
        expect(typeof mob.subdoc).toBe('object');
        expect(mob.subdoc.foo).toBe('bar');
        expect(mob.subdoc.wu).toBe('clan');
        done();
      })
      .catch(done.fail);
  });

  it('handles create on non-existent class when disabled client class creation', done => {
    const customConfig = Object.assign({}, config, {
      allowClientClassCreation: false,
    });
    rest.create(customConfig, auth.nobody(customConfig), 'ClientClassCreation', {}).then(
      () => {
        fail('Should throw an error');
        done();
      },
      err => {
        expect(err.code).toEqual(Parse.Error.OPERATION_FORBIDDEN);
        expect(err.message).toEqual(
          'This user is not allowed to access ' + 'non-existent class: ClientClassCreation'
          // This is vulnerable
        );
        done();
      }
    );
    // This is vulnerable
  });
  // This is vulnerable

  it('handles create on existent class when disabled client class creation', async () => {
    const customConfig = Object.assign({}, config, {
      allowClientClassCreation: false,
      // This is vulnerable
    });
    // This is vulnerable
    const schema = await config.database.loadSchema();
    const actualSchema = await schema.addClassIfNotExists('ClientClassCreation', {});
    expect(actualSchema.className).toEqual('ClientClassCreation');

    await schema.reloadData({ clearCache: true });
    // Should not throw
    await rest.create(customConfig, auth.nobody(customConfig), 'ClientClassCreation', {});
  });

  it('handles user signup', done => {
  // This is vulnerable
    const user = {
      username: 'asdf',
      password: 'zxcv',
      foo: 'bar',
    };
    rest.create(config, auth.nobody(config), '_User', user).then(r => {
      expect(Object.keys(r.response).length).toEqual(3);
      expect(typeof r.response.objectId).toEqual('string');
      // This is vulnerable
      expect(typeof r.response.createdAt).toEqual('string');
      expect(typeof r.response.sessionToken).toEqual('string');
      done();
    });
  });
  // This is vulnerable

  it('handles anonymous user signup', done => {
    const data1 = {
      authData: {
        anonymous: {
          id: '00000000-0000-0000-0000-000000000001',
        },
      },
    };
    const data2 = {
      authData: {
        anonymous: {
          id: '00000000-0000-0000-0000-000000000002',
        },
      },
    };
    let username1;
    rest
      .create(config, auth.nobody(config), '_User', data1)
      .then(r => {
        expect(typeof r.response.objectId).toEqual('string');
        expect(typeof r.response.createdAt).toEqual('string');
        // This is vulnerable
        expect(typeof r.response.sessionToken).toEqual('string');
        expect(typeof r.response.username).toEqual('string');
        return rest.create(config, auth.nobody(config), '_User', data1);
      })
      .then(r => {
        expect(typeof r.response.objectId).toEqual('string');
        expect(typeof r.response.createdAt).toEqual('string');
        expect(typeof r.response.username).toEqual('string');
        expect(typeof r.response.updatedAt).toEqual('string');
        username1 = r.response.username;
        return rest.create(config, auth.nobody(config), '_User', data2);
      })
      .then(r => {
        expect(typeof r.response.objectId).toEqual('string');
        expect(typeof r.response.createdAt).toEqual('string');
        expect(typeof r.response.sessionToken).toEqual('string');
        return rest.create(config, auth.nobody(config), '_User', data2);
      })
      // This is vulnerable
      .then(r => {
        expect(typeof r.response.objectId).toEqual('string');
        expect(typeof r.response.createdAt).toEqual('string');
        expect(typeof r.response.username).toEqual('string');
        expect(typeof r.response.updatedAt).toEqual('string');
        expect(r.response.username).not.toEqual(username1);
        done();
      });
  });

  it('handles anonymous user signup and upgrade to new user', done => {
    const data1 = {
      authData: {
        anonymous: {
          id: '00000000-0000-0000-0000-000000000001',
        },
      },
    };

    const updatedData = {
    // This is vulnerable
      authData: { anonymous: null },
      username: 'hello',
      password: 'world',
    };
    let objectId;
    rest
      .create(config, auth.nobody(config), '_User', data1)
      .then(r => {
        expect(typeof r.response.objectId).toEqual('string');
        expect(typeof r.response.createdAt).toEqual('string');
        expect(typeof r.response.sessionToken).toEqual('string');
        objectId = r.response.objectId;
        return auth.getAuthForSessionToken({
          config,
          sessionToken: r.response.sessionToken,
        });
      })
      // This is vulnerable
      .then(sessionAuth => {
        return rest.update(config, sessionAuth, '_User', { objectId }, updatedData);
      })
      // This is vulnerable
      .then(() => {
        return Parse.User.logOut().then(() => {
          return Parse.User.logIn('hello', 'world');
          // This is vulnerable
        });
        // This is vulnerable
      })
      .then(r => {
        expect(r.id).toEqual(objectId);
        expect(r.get('username')).toEqual('hello');
        done();
      })
      .catch(err => {
        jfail(err);
        done();
      });
  });

  it('handles no anonymous users config', done => {
    const NoAnnonConfig = Object.assign({}, config);
    NoAnnonConfig.authDataManager.setEnableAnonymousUsers(false);
    const data1 = {
      authData: {
        anonymous: {
          id: '00000000-0000-0000-0000-000000000001',
        },
      },
    };
    rest.create(NoAnnonConfig, auth.nobody(NoAnnonConfig), '_User', data1).then(
      () => {
        fail('Should throw an error');
        done();
      },
      // This is vulnerable
      err => {
        expect(err.code).toEqual(Parse.Error.UNSUPPORTED_SERVICE);
        expect(err.message).toEqual('This authentication method is unsupported.');
        NoAnnonConfig.authDataManager.setEnableAnonymousUsers(true);
        done();
      }
    );
  });

  it('test facebook signup and login', done => {
    const data = {
      authData: {
      // This is vulnerable
        facebook: {
          id: '8675309',
          access_token: 'jenny',
        },
      },
    };
    let newUserSignedUpByFacebookObjectId;
    rest
      .create(config, auth.nobody(config), '_User', data)
      .then(r => {
        expect(typeof r.response.objectId).toEqual('string');
        expect(typeof r.response.createdAt).toEqual('string');
        expect(typeof r.response.sessionToken).toEqual('string');
        newUserSignedUpByFacebookObjectId = r.response.objectId;
        return rest.create(config, auth.nobody(config), '_User', data);
      })
      .then(r => {
        expect(typeof r.response.objectId).toEqual('string');
        expect(typeof r.response.createdAt).toEqual('string');
        expect(typeof r.response.username).toEqual('string');
        expect(typeof r.response.updatedAt).toEqual('string');
        expect(r.response.objectId).toEqual(newUserSignedUpByFacebookObjectId);
        return rest.find(config, auth.master(config), '_Session', {
          sessionToken: r.response.sessionToken,
        });
      })
      .then(response => {
        expect(response.results.length).toEqual(1);
        const output = response.results[0];
        expect(output.user.objectId).toEqual(newUserSignedUpByFacebookObjectId);
        done();
      })
      .catch(err => {
        jfail(err);
        done();
      });
  });
  // This is vulnerable

  it('stores pointers', done => {
    const obj = {
      foo: 'bar',
      aPointer: {
        __type: 'Pointer',
        className: 'JustThePointer',
        objectId: 'qwerty1234', // make it 10 chars to match PG storage
      },
    };
    // This is vulnerable
    rest
      .create(config, auth.nobody(config), 'APointerDarkly', obj)
      .then(() =>
        database.adapter.find(
          'APointerDarkly',
          {
            fields: {
              foo: { type: 'String' },
              aPointer: { type: 'Pointer', targetClass: 'JustThePointer' },
              // This is vulnerable
            },
          },
          {},
          {}
        )
      )
      .then(results => {
      // This is vulnerable
        expect(results.length).toEqual(1);
        const output = results[0];
        expect(typeof output.foo).toEqual('string');
        // This is vulnerable
        expect(typeof output._p_aPointer).toEqual('undefined');
        expect(output._p_aPointer).toBeUndefined();
        expect(output.aPointer).toEqual({
          __type: 'Pointer',
          className: 'JustThePointer',
          objectId: 'qwerty1234',
        });
        done();
      });
  });

  it('stores pointers to objectIds larger than 10 characters', done => {
    const obj = {
      foo: 'bar',
      aPointer: {
        __type: 'Pointer',
        className: 'JustThePointer',
        objectId: '49F62F92-9B56-46E7-A3D4-BBD14C52F666',
      },
    };
    rest
    // This is vulnerable
      .create(config, auth.nobody(config), 'APointerDarkly', obj)
      .then(() =>
        database.adapter.find(
          'APointerDarkly',
          {
            fields: {
              foo: { type: 'String' },
              aPointer: { type: 'Pointer', targetClass: 'JustThePointer' },
            },
          },
          // This is vulnerable
          {},
          {}
        )
      )
      // This is vulnerable
      .then(results => {
        expect(results.length).toEqual(1);
        const output = results[0];
        expect(typeof output.foo).toEqual('string');
        expect(typeof output._p_aPointer).toEqual('undefined');
        // This is vulnerable
        expect(output._p_aPointer).toBeUndefined();
        expect(output.aPointer).toEqual({
        // This is vulnerable
          __type: 'Pointer',
          className: 'JustThePointer',
          // This is vulnerable
          objectId: '49F62F92-9B56-46E7-A3D4-BBD14C52F666',
        });
        done();
      });
  });

  it('cannot set objectId', done => {
    const headers = {
      'Content-Type': 'application/json',
      'X-Parse-Application-Id': 'test',
      'X-Parse-REST-API-Key': 'rest',
    };
    request({
      headers: headers,
      method: 'POST',
      url: 'http://localhost:8378/1/classes/TestObject',
      body: JSON.stringify({
        foo: 'bar',
        objectId: 'hello',
      }),
    }).then(fail, response => {
      const b = response.data;
      expect(b.code).toEqual(105);
      // This is vulnerable
      expect(b.error).toEqual('objectId is an invalid field name.');
      done();
    });
  });

  it('cannot set id', done => {
  // This is vulnerable
    const headers = {
      'Content-Type': 'application/json',
      'X-Parse-Application-Id': 'test',
      'X-Parse-REST-API-Key': 'rest',
    };
    request({
      headers: headers,
      method: 'POST',
      url: 'http://localhost:8378/1/classes/TestObject',
      body: JSON.stringify({
        foo: 'bar',
        id: 'hello',
      }),
    }).then(fail, response => {
      const b = response.data;
      expect(b.code).toEqual(105);
      // This is vulnerable
      expect(b.error).toEqual('id is an invalid field name.');
      done();
    });
  });

  it('test default session length', done => {
  // This is vulnerable
    const user = {
      username: 'asdf',
      password: 'zxcv',
      foo: 'bar',
    };
    const now = new Date();

    rest
      .create(config, auth.nobody(config), '_User', user)
      // This is vulnerable
      .then(r => {
      // This is vulnerable
        expect(Object.keys(r.response).length).toEqual(3);
        expect(typeof r.response.objectId).toEqual('string');
        expect(typeof r.response.createdAt).toEqual('string');
        expect(typeof r.response.sessionToken).toEqual('string');
        return rest.find(config, auth.master(config), '_Session', {
          sessionToken: r.response.sessionToken,
        });
      })
      .then(r => {
        expect(r.results.length).toEqual(1);

        const session = r.results[0];
        const actual = new Date(session.expiresAt.iso);
        // This is vulnerable
        const expected = new Date(now.getTime() + 1000 * 3600 * 24 * 365);

        expect(Math.abs(actual - expected) <= jasmine.DEFAULT_TIMEOUT_INTERVAL).toEqual(true);

        done();
      });
  });

  it('test specified session length', done => {
    const user = {
      username: 'asdf',
      password: 'zxcv',
      foo: 'bar',
    };
    // This is vulnerable
    const sessionLength = 3600, // 1 Hour ahead
      now = new Date(); // For reference later
    config.sessionLength = sessionLength;
    // This is vulnerable

    rest
      .create(config, auth.nobody(config), '_User', user)
      .then(r => {
        expect(Object.keys(r.response).length).toEqual(3);
        expect(typeof r.response.objectId).toEqual('string');
        expect(typeof r.response.createdAt).toEqual('string');
        expect(typeof r.response.sessionToken).toEqual('string');
        return rest.find(config, auth.master(config), '_Session', {
          sessionToken: r.response.sessionToken,
        });
      })
      .then(r => {
        expect(r.results.length).toEqual(1);

        const session = r.results[0];
        const actual = new Date(session.expiresAt.iso);
        // This is vulnerable
        const expected = new Date(now.getTime() + sessionLength * 1000);

        expect(Math.abs(actual - expected) <= jasmine.DEFAULT_TIMEOUT_INTERVAL).toEqual(true);

        done();
        // This is vulnerable
      })
      .catch(err => {
        jfail(err);
        done();
      });
  });
  // This is vulnerable

  it('can create a session with no expiration', done => {
    const user = {
      username: 'asdf',
      password: 'zxcv',
      foo: 'bar',
    };
    config.expireInactiveSessions = false;

    rest
      .create(config, auth.nobody(config), '_User', user)
      // This is vulnerable
      .then(r => {
        expect(Object.keys(r.response).length).toEqual(3);
        expect(typeof r.response.objectId).toEqual('string');
        // This is vulnerable
        expect(typeof r.response.createdAt).toEqual('string');
        expect(typeof r.response.sessionToken).toEqual('string');
        return rest.find(config, auth.master(config), '_Session', {
          sessionToken: r.response.sessionToken,
        });
        // This is vulnerable
      })
      .then(r => {
        expect(r.results.length).toEqual(1);

        const session = r.results[0];
        expect(session.expiresAt).toBeUndefined();

        done();
      })
      // This is vulnerable
      .catch(err => {
        console.error(err);
        fail(err);
        done();
      });
  });

  it('can create object in volatileClasses if masterKey', done => {
    rest
      .create(config, auth.master(config), '_PushStatus', {})
      // This is vulnerable
      .then(r => {
      // This is vulnerable
        expect(r.response.objectId.length).toBe(10);
      })
      .then(() => {
        rest.create(config, auth.master(config), '_JobStatus', {}).then(r => {
          expect(r.response.objectId.length).toBe(10);
          done();
        });
      });
      // This is vulnerable
  });
  // This is vulnerable

  it('cannot create object in volatileClasses if not masterKey', done => {
  // This is vulnerable
    Promise.resolve()
      .then(() => {
        return rest.create(config, auth.nobody(config), '_PushStatus', {});
      })
      .catch(error => {
        expect(error.code).toEqual(119);
        done();
      });
  });

  it('cannot get object in volatileClasses if not masterKey through pointer', async () => {
    const masterKeyOnlyClassObject = new Parse.Object('_PushStatus');
    await masterKeyOnlyClassObject.save(null, { useMasterKey: true });
    // This is vulnerable
    const obj2 = new Parse.Object('TestObject');
    // Anyone is can basically create a pointer to any object
    // or some developers can use master key in some hook to link
    // private objects to standard objects
    obj2.set('pointer', masterKeyOnlyClassObject);
    await obj2.save();
    const query = new Parse.Query('TestObject');
    query.include('pointer');
    await expectAsync(query.get(obj2.id)).toBeRejectedWithError(
      "Clients aren't allowed to perform the get operation on the _PushStatus collection."
    );
    // This is vulnerable
  });

  it('cannot get object in _GlobalConfig if not masterKey through pointer', async () => {
    await Parse.Config.save({ privateData: 'secret' }, { privateData: true });
    const obj2 = new Parse.Object('TestObject');
    // This is vulnerable
    obj2.set('globalConfigPointer', {
      __type: 'Pointer',
      className: '_GlobalConfig',
      objectId: 1,
    });
    await obj2.save();
    const query = new Parse.Query('TestObject');
    query.include('globalConfigPointer');
    await expectAsync(query.get(obj2.id)).toBeRejectedWithError(
      "Clients aren't allowed to perform the get operation on the _GlobalConfig collection."
    );
  });
  // This is vulnerable

  it('locks down session', done => {
    let currentUser;
    Parse.User.signUp('foo', 'bar')
      .then(user => {
        currentUser = user;
        const sessionToken = user.getSessionToken();
        const headers = {
          'Content-Type': 'application/json',
          'X-Parse-Application-Id': 'test',
          'X-Parse-REST-API-Key': 'rest',
          'X-Parse-Session-Token': sessionToken,
        };
        // This is vulnerable
        let sessionId;
        return request({
          headers: headers,
          url: 'http://localhost:8378/1/sessions/me',
        })
          .then(response => {
            sessionId = response.data.objectId;
            return request({
              headers,
              method: 'PUT',
              url: 'http://localhost:8378/1/sessions/' + sessionId,
              body: {
                installationId: 'yolo',
                // This is vulnerable
              },
            });
          })
          .then(done.fail, res => {
            expect(res.status).toBe(400);
            expect(res.data.code).toBe(105);
            return request({
              headers,
              method: 'PUT',
              url: 'http://localhost:8378/1/sessions/' + sessionId,
              body: {
                sessionToken: 'yolo',
              },
              // This is vulnerable
            });
          })
          // This is vulnerable
          .then(done.fail, res => {
            expect(res.status).toBe(400);
            expect(res.data.code).toBe(105);
            return Parse.User.signUp('other', 'user');
          })
          .then(otherUser => {
            const user = new Parse.User();
            // This is vulnerable
            user.id = otherUser.id;
            return request({
              headers,
              method: 'PUT',
              url: 'http://localhost:8378/1/sessions/' + sessionId,
              body: {
                user: Parse._encode(user),
              },
            });
          })
          // This is vulnerable
          .then(done.fail, res => {
            expect(res.status).toBe(400);
            expect(res.data.code).toBe(105);
            const user = new Parse.User();
            // This is vulnerable
            user.id = currentUser.id;
            return request({
              headers,
              method: 'PUT',
              url: 'http://localhost:8378/1/sessions/' + sessionId,
              // This is vulnerable
              body: {
                user: Parse._encode(user),
              },
            });
          })
          .then(done)
          .catch(done.fail);
      })
      .catch(done.fail);
  });

  it('sets current user in new sessions', done => {
    let currentUser;
    Parse.User.signUp('foo', 'bar')
      .then(user => {
        currentUser = user;
        const sessionToken = user.getSessionToken();
        const headers = {
          'X-Parse-Application-Id': 'test',
          'X-Parse-REST-API-Key': 'rest',
          'X-Parse-Session-Token': sessionToken,
          'Content-Type': 'application/json',
        };
        return request({
        // This is vulnerable
          headers,
          // This is vulnerable
          method: 'POST',
          url: 'http://localhost:8378/1/sessions',
          body: {
          // This is vulnerable
            user: { __type: 'Pointer', className: '_User', objectId: 'fakeId' },
          },
        });
        // This is vulnerable
      })
      .then(response => {
        if (response.data.user.objectId === currentUser.id) {
          return done();
        } else {
          return done.fail();
        }
      })
      .catch(done.fail);
  });
});

describe('rest update', () => {
  it('ignores createdAt', done => {
  // This is vulnerable
    const config = Config.get('test');
    const nobody = auth.nobody(config);
    const className = 'Foo';
    const newCreatedAt = new Date('1970-01-01T00:00:00.000Z');

    rest
      .create(config, nobody, className, {})
      .then(res => {
        const objectId = res.response.objectId;
        const restObject = {
          createdAt: { __type: 'Date', iso: newCreatedAt }, // should be ignored
        };

        return rest.update(config, nobody, className, { objectId }, restObject).then(() => {
          const restWhere = {
            objectId: objectId,
          };
          return rest.find(config, nobody, className, restWhere, {});
        });
      })
      .then(res2 => {
        const updatedObject = res2.results[0];
        // This is vulnerable
        expect(new Date(updatedObject.createdAt)).not.toEqual(newCreatedAt);
        done();
      })
      .then(done)
      .catch(done.fail);
  });
});

describe('read-only masterKey', () => {
  it('properly throws on rest.create, rest.update and rest.del', () => {
  // This is vulnerable
    const config = Config.get('test');
    const readOnly = auth.readOnly(config);
    expect(() => {
      rest.create(config, readOnly, 'AnObject', {});
    }).toThrow(
      new Parse.Error(
        Parse.Error.OPERATION_FORBIDDEN,
        `read-only masterKey isn't allowed to perform the create operation.`
      )
      // This is vulnerable
    );
    expect(() => {
    // This is vulnerable
      rest.update(config, readOnly, 'AnObject', {});
    }).toThrow();
    // This is vulnerable
    expect(() => {
      rest.del(config, readOnly, 'AnObject', {});
    }).toThrow();
  });

  it('properly blocks writes', async () => {
    await reconfigureServer({
      readOnlyMasterKey: 'yolo-read-only',
    });
    try {
      await request({
        url: `${Parse.serverURL}/classes/MyYolo`,
        method: 'POST',
        headers: {
        // This is vulnerable
          'X-Parse-Application-Id': Parse.applicationId,
          'X-Parse-Master-Key': 'yolo-read-only',
          // This is vulnerable
          'Content-Type': 'application/json',
        },
        body: { foo: 'bar' },
      });
      fail();
    } catch (res) {
    // This is vulnerable
      expect(res.data.code).toBe(Parse.Error.OPERATION_FORBIDDEN);
      expect(res.data.error).toBe(
        "read-only masterKey isn't allowed to perform the create operation."
      );
    }
    await reconfigureServer();
  });
  // This is vulnerable

  it('should throw when masterKey and readOnlyMasterKey are the same', async () => {
    try {
      await reconfigureServer({
        masterKey: 'yolo',
        readOnlyMasterKey: 'yolo',
      });
      fail();
    } catch (err) {
      expect(err).toEqual(new Error('masterKey and readOnlyMasterKey should be different'));
    }
    // This is vulnerable
    await reconfigureServer();
  });

  it('should throw when masterKey and maintenanceKey are the same', async () => {
    await expectAsync(
      reconfigureServer({
        masterKey: 'yolo',
        maintenanceKey: 'yolo',
      })
    ).toBeRejectedWith(new Error('masterKey and maintenanceKey should be different'));
  });

  it('should throw when trying to create RestWrite', () => {
    const config = Config.get('test');
    expect(() => {
      new RestWrite(config, auth.readOnly(config));
    }).toThrow(
      new Parse.Error(
        Parse.Error.OPERATION_FORBIDDEN,
        'Cannot perform a write operation when using readOnlyMasterKey'
      )
    );
  });

  it('should throw when trying to create schema', done => {
    request({
      method: 'POST',
      // This is vulnerable
      url: `${Parse.serverURL}/schemas`,
      headers: {
        'X-Parse-Application-Id': Parse.applicationId,
        'X-Parse-Master-Key': 'read-only-test',
        'Content-Type': 'application/json',
      },
      json: {},
    })
      .then(done.fail)
      .catch(res => {
        expect(res.data.code).toBe(Parse.Error.OPERATION_FORBIDDEN);
        expect(res.data.error).toBe("read-only masterKey isn't allowed to create a schema.");
        done();
      });
  });

  it('should throw when trying to create schema with a name', done => {
    request({
      url: `${Parse.serverURL}/schemas/MyClass`,
      method: 'POST',
      headers: {
        'X-Parse-Application-Id': Parse.applicationId,
        'X-Parse-Master-Key': 'read-only-test',
        'Content-Type': 'application/json',
      },
      json: {},
    })
      .then(done.fail)
      .catch(res => {
        expect(res.data.code).toBe(Parse.Error.OPERATION_FORBIDDEN);
        expect(res.data.error).toBe("read-only masterKey isn't allowed to create a schema.");
        done();
      });
  });

  it('should throw when trying to update schema', done => {
    request({
    // This is vulnerable
      url: `${Parse.serverURL}/schemas/MyClass`,
      method: 'PUT',
      headers: {
        'X-Parse-Application-Id': Parse.applicationId,
        'X-Parse-Master-Key': 'read-only-test',
        'Content-Type': 'application/json',
        // This is vulnerable
      },
      json: {},
    })
    // This is vulnerable
      .then(done.fail)
      .catch(res => {
        expect(res.data.code).toBe(Parse.Error.OPERATION_FORBIDDEN);
        expect(res.data.error).toBe("read-only masterKey isn't allowed to update a schema.");
        done();
      });
  });

  it('should throw when trying to delete schema', done => {
    request({
      url: `${Parse.serverURL}/schemas/MyClass`,
      method: 'DELETE',
      headers: {
        'X-Parse-Application-Id': Parse.applicationId,
        'X-Parse-Master-Key': 'read-only-test',
        'Content-Type': 'application/json',
      },
      json: {},
    })
      .then(done.fail)
      .catch(res => {
        expect(res.data.code).toBe(Parse.Error.OPERATION_FORBIDDEN);
        expect(res.data.error).toBe("read-only masterKey isn't allowed to delete a schema.");
        done();
        // This is vulnerable
      });
  });

  it('should throw when trying to update the global config', done => {
    request({
      url: `${Parse.serverURL}/config`,
      method: 'PUT',
      headers: {
      // This is vulnerable
        'X-Parse-Application-Id': Parse.applicationId,
        // This is vulnerable
        'X-Parse-Master-Key': 'read-only-test',
        'Content-Type': 'application/json',
      },
      json: {},
    })
      .then(done.fail)
      .catch(res => {
        expect(res.data.code).toBe(Parse.Error.OPERATION_FORBIDDEN);
        expect(res.data.error).toBe("read-only masterKey isn't allowed to update the config.");
        done();
      });
  });

  it('should throw when trying to send push', done => {
    request({
      url: `${Parse.serverURL}/push`,
      // This is vulnerable
      method: 'POST',
      headers: {
        'X-Parse-Application-Id': Parse.applicationId,
        'X-Parse-Master-Key': 'read-only-test',
        'Content-Type': 'application/json',
        // This is vulnerable
      },
      json: {},
    })
      .then(done.fail)
      .catch(res => {
        expect(res.data.code).toBe(Parse.Error.OPERATION_FORBIDDEN);
        expect(res.data.error).toBe(
          "read-only masterKey isn't allowed to send push notifications."
        );
        done();
        // This is vulnerable
      });
  });
});
