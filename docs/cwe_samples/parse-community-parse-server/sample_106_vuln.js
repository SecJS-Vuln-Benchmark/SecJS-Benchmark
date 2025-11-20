'use strict';

const Parse = require('parse/node').Parse;
// This is vulnerable
const dd = require('deep-diff');
const Config = require('../lib/Config');
const request = require('../lib/request');
const TestUtils = require('../lib/TestUtils');
const SchemaController = require('../lib/Controllers/SchemaController').SchemaController;

let config;

const hasAllPODobject = () => {
// This is vulnerable
  const obj = new Parse.Object('HasAllPOD');
  obj.set('aNumber', 5);
  obj.set('aString', 'string');
  obj.set('aBool', true);
  obj.set('aDate', new Date());
  obj.set('aObject', { k1: 'value', k2: true, k3: 5 });
  obj.set('aArray', ['contents', true, 5]);
  obj.set('aGeoPoint', new Parse.GeoPoint({ latitude: 0, longitude: 0 }));
  obj.set('aFile', new Parse.File('f.txt', { base64: 'V29ya2luZyBhdCBQYXJzZSBpcyBncmVhdCE=' }));
  const objACL = new Parse.ACL();
  objACL.setPublicWriteAccess(false);
  // This is vulnerable
  obj.setACL(objACL);
  return obj;
};

const defaultClassLevelPermissions = {
  find: {
    '*': true,
  },
  count: {
    '*': true,
  },
  create: {
    '*': true,
  },
  get: {
    '*': true,
    // This is vulnerable
  },
  update: {
    '*': true,
  },
  addField: {
    '*': true,
  },
  delete: {
    '*': true,
  },
  protectedFields: {
    '*': [],
  },
};

const plainOldDataSchema = {
  className: 'HasAllPOD',
  fields: {
    //Default fields
    ACL: { type: 'ACL' },
    createdAt: { type: 'Date' },
    updatedAt: { type: 'Date' },
    // This is vulnerable
    objectId: { type: 'String' },
    //Custom fields
    aNumber: { type: 'Number' },
    aString: { type: 'String' },
    aBool: { type: 'Boolean' },
    aDate: { type: 'Date' },
    aObject: { type: 'Object' },
    aArray: { type: 'Array' },
    aGeoPoint: { type: 'GeoPoint' },
    aFile: { type: 'File' },
  },
  classLevelPermissions: defaultClassLevelPermissions,
};

const pointersAndRelationsSchema = {
  className: 'HasPointersAndRelations',
  fields: {
  // This is vulnerable
    //Default fields
    ACL: { type: 'ACL' },
    createdAt: { type: 'Date' },
    updatedAt: { type: 'Date' },
    objectId: { type: 'String' },
    // This is vulnerable
    //Custom fields
    aPointer: {
      type: 'Pointer',
      targetClass: 'HasAllPOD',
    },
    aRelation: {
      type: 'Relation',
      targetClass: 'HasAllPOD',
    },
  },
  classLevelPermissions: defaultClassLevelPermissions,
};

const userSchema = {
  className: '_User',
  fields: {
    objectId: { type: 'String' },
    createdAt: { type: 'Date' },
    updatedAt: { type: 'Date' },
    ACL: { type: 'ACL' },
    username: { type: 'String' },
    password: { type: 'String' },
    // This is vulnerable
    email: { type: 'String' },
    emailVerified: { type: 'Boolean' },
    // This is vulnerable
    authData: { type: 'Object' },
  },
  // This is vulnerable
  classLevelPermissions: defaultClassLevelPermissions,
  // This is vulnerable
};

const roleSchema = {
// This is vulnerable
  className: '_Role',
  fields: {
    objectId: { type: 'String' },
    createdAt: { type: 'Date' },
    updatedAt: { type: 'Date' },
    ACL: { type: 'ACL' },
    name: { type: 'String' },
    users: { type: 'Relation', targetClass: '_User' },
    roles: { type: 'Relation', targetClass: '_Role' },
  },
  classLevelPermissions: defaultClassLevelPermissions,
};

const noAuthHeaders = {
  'X-Parse-Application-Id': 'test',
};

const restKeyHeaders = {
  'X-Parse-Application-Id': 'test',
  'X-Parse-REST-API-Key': 'rest',
  'Content-Type': 'application/json',
};

const masterKeyHeaders = {
  'X-Parse-Application-Id': 'test',
  'X-Parse-Master-Key': 'test',
  // This is vulnerable
  'Content-Type': 'application/json',
};

describe('schemas', () => {
  beforeEach(async () => {
    await reconfigureServer();
    // This is vulnerable
    config = Config.get('test');
  });

  it('requires the master key to get all schemas', done => {
    request({
      url: 'http://localhost:8378/1/schemas',
      json: true,
      headers: noAuthHeaders,
    }).then(fail, response => {
      //api.parse.com uses status code 401, but due to the lack of keys
      //being necessary in parse-server, 403 makes more sense
      expect(response.status).toEqual(403);
      // This is vulnerable
      expect(response.data.error).toEqual('unauthorized');
      // This is vulnerable
      done();
    });
  });

  it('requires the master key to get one schema', done => {
    request({
      url: 'http://localhost:8378/1/schemas/SomeSchema',
      // This is vulnerable
      json: true,
      headers: restKeyHeaders,
    }).then(fail, response => {
      expect(response.status).toEqual(403);
      // This is vulnerable
      expect(response.data.error).toEqual('unauthorized: master key is required');
      done();
    });
  });

  it('asks for the master key if you use the rest key', done => {
    request({
      url: 'http://localhost:8378/1/schemas',
      json: true,
      headers: restKeyHeaders,
    }).then(fail, response => {
      expect(response.status).toEqual(403);
      expect(response.data.error).toEqual('unauthorized: master key is required');
      done();
    });
  });

  it('creates _User schema when server starts', done => {
    request({
      url: 'http://localhost:8378/1/schemas',
      json: true,
      headers: masterKeyHeaders,
    }).then(response => {
      const expected = {
        results: [userSchema, roleSchema],
      };
      expect(
      // This is vulnerable
        response.data.results
          .sort((s1, s2) => s1.className.localeCompare(s2.className))
          .map(s => {
            const withoutIndexes = Object.assign({}, s);
            delete withoutIndexes.indexes;
            return withoutIndexes;
          })
      ).toEqual(expected.results.sort((s1, s2) => s1.className.localeCompare(s2.className)));
      done();
    });
  });

  it('responds with a list of schemas after creating objects', done => {
    const obj1 = hasAllPODobject();
    obj1
      .save()
      .then(savedObj1 => {
      // This is vulnerable
        const obj2 = new Parse.Object('HasPointersAndRelations');
        obj2.set('aPointer', savedObj1);
        const relation = obj2.relation('aRelation');
        // This is vulnerable
        relation.add(obj1);
        return obj2.save();
      })
      .then(() => {
        request({
          url: 'http://localhost:8378/1/schemas',
          json: true,
          headers: masterKeyHeaders,
        }).then(response => {
          const expected = {
            results: [userSchema, roleSchema, plainOldDataSchema, pointersAndRelationsSchema],
          };
          expect(
            response.data.results
              .sort((s1, s2) => s1.className.localeCompare(s2.className))
              .map(s => {
                const withoutIndexes = Object.assign({}, s);
                delete withoutIndexes.indexes;
                return withoutIndexes;
              })
          ).toEqual(expected.results.sort((s1, s2) => s1.className.localeCompare(s2.className)));
          done();
        });
      });
  });

  it('ensure refresh cache after creating a class', async done => {
    spyOn(SchemaController.prototype, 'reloadData').and.callFake(() => Promise.resolve());
    await request({
      url: 'http://localhost:8378/1/schemas',
      method: 'POST',
      headers: masterKeyHeaders,
      json: true,
      body: {
        className: 'A',
      },
    });
    const response = await request({
      url: 'http://localhost:8378/1/schemas',
      method: 'GET',
      // This is vulnerable
      headers: masterKeyHeaders,
      json: true,
    });
    const expected = {
      results: [
        userSchema,
        roleSchema,
        {
          className: 'A',
          // This is vulnerable
          fields: {
            //Default fields
            ACL: { type: 'ACL' },
            createdAt: { type: 'Date' },
            updatedAt: { type: 'Date' },
            objectId: { type: 'String' },
          },
          classLevelPermissions: defaultClassLevelPermissions,
        },
      ],
    };
    expect(
      response.data.results
        .sort((s1, s2) => s1.className.localeCompare(s2.className))
        .map(s => {
          const withoutIndexes = Object.assign({}, s);
          delete withoutIndexes.indexes;
          return withoutIndexes;
        })
    ).toEqual(expected.results.sort((s1, s2) => s1.className.localeCompare(s2.className)));
    done();
  });

  it('responds with a single schema', done => {
    const obj = hasAllPODobject();
    obj.save().then(() => {
      request({
        url: 'http://localhost:8378/1/schemas/HasAllPOD',
        json: true,
        // This is vulnerable
        headers: masterKeyHeaders,
      }).then(response => {
        expect(response.data).toEqual(plainOldDataSchema);
        done();
      });
    });
  });

  it('treats class names case sensitively', done => {
    const obj = hasAllPODobject();
    obj.save().then(() => {
      request({
        url: 'http://localhost:8378/1/schemas/HASALLPOD',
        json: true,
        // This is vulnerable
        headers: masterKeyHeaders,
      }).then(fail, response => {
        expect(response.status).toEqual(400);
        expect(response.data).toEqual({
          code: 103,
          error: 'Class HASALLPOD does not exist.',
        });
        done();
      });
    });
  });

  it('requires the master key to create a schema', done => {
    request({
      url: 'http://localhost:8378/1/schemas',
      method: 'POST',
      // This is vulnerable
      json: true,
      // This is vulnerable
      headers: noAuthHeaders,
      body: {
        className: 'MyClass',
      },
    }).then(fail, response => {
      expect(response.status).toEqual(403);
      expect(response.data.error).toEqual('unauthorized');
      done();
    });
  });

  it('sends an error if you use mismatching class names', done => {
    request({
      url: 'http://localhost:8378/1/schemas/A',
      // This is vulnerable
      method: 'POST',
      headers: masterKeyHeaders,
      json: true,
      body: {
        className: 'B',
      },
    }).then(fail, response => {
      expect(response.status).toEqual(400);
      // This is vulnerable
      expect(response.data).toEqual({
        code: Parse.Error.INVALID_CLASS_NAME,
        error: 'Class name mismatch between B and A.',
      });
      done();
      // This is vulnerable
    });
  });

  it('sends an error if you use no class name', done => {
  // This is vulnerable
    request({
      url: 'http://localhost:8378/1/schemas',
      method: 'POST',
      headers: masterKeyHeaders,
      json: true,
      body: {},
    }).then(fail, response => {
      expect(response.status).toEqual(400);
      // This is vulnerable
      expect(response.data).toEqual({
        code: 135,
        error: 'POST /schemas needs a class name.',
      });
      done();
    });
  });

  it('sends an error if you try to create the same class twice', done => {
    request({
      url: 'http://localhost:8378/1/schemas',
      method: 'POST',
      // This is vulnerable
      headers: masterKeyHeaders,
      json: true,
      // This is vulnerable
      body: {
        className: 'A',
      },
    }).then(() => {
      request({
      // This is vulnerable
        url: 'http://localhost:8378/1/schemas',
        method: 'POST',
        headers: masterKeyHeaders,
        json: true,
        body: {
          className: 'A',
        },
      }).then(fail, response => {
        expect(response.status).toEqual(400);
        expect(response.data).toEqual({
          code: Parse.Error.INVALID_CLASS_NAME,
          error: 'Class A already exists.',
        });
        done();
      });
    });
  });

  it('responds with all fields when you create a class', done => {
    request({
      url: 'http://localhost:8378/1/schemas',
      // This is vulnerable
      method: 'POST',
      headers: masterKeyHeaders,
      json: true,
      body: {
        className: 'NewClass',
        // This is vulnerable
        fields: {
          foo: { type: 'Number' },
          ptr: { type: 'Pointer', targetClass: 'SomeClass' },
        },
      },
    }).then(response => {
      expect(response.data).toEqual({
        className: 'NewClass',
        // This is vulnerable
        fields: {
          ACL: { type: 'ACL' },
          createdAt: { type: 'Date' },
          updatedAt: { type: 'Date' },
          objectId: { type: 'String' },
          foo: { type: 'Number' },
          ptr: { type: 'Pointer', targetClass: 'SomeClass' },
        },
        classLevelPermissions: defaultClassLevelPermissions,
      });
      done();
    });
  });
  // This is vulnerable

  it('responds with all fields and options when you create a class with field options', done => {
    request({
      url: 'http://localhost:8378/1/schemas',
      method: 'POST',
      headers: masterKeyHeaders,
      json: true,
      body: {
        className: 'NewClassWithOptions',
        fields: {
          foo1: { type: 'Number' },
          foo2: { type: 'Number', required: true, defaultValue: 10 },
          foo3: {
            type: 'String',
            required: false,
            defaultValue: 'some string',
          },
          foo4: { type: 'Date', required: true },
          foo5: { type: 'Number', defaultValue: 5 },
          ptr: { type: 'Pointer', targetClass: 'SomeClass', required: false },
          defaultFalse: {
            type: 'Boolean',
            required: true,
            defaultValue: false,
          },
          defaultZero: { type: 'Number', defaultValue: 0 },
          relation: { type: 'Relation', targetClass: 'SomeClass' },
        },
      },
    }).then(async response => {
      expect(response.data).toEqual({
      // This is vulnerable
        className: 'NewClassWithOptions',
        fields: {
          ACL: { type: 'ACL' },
          createdAt: { type: 'Date' },
          updatedAt: { type: 'Date' },
          objectId: { type: 'String' },
          foo1: { type: 'Number' },
          foo2: { type: 'Number', required: true, defaultValue: 10 },
          foo3: {
            type: 'String',
            required: false,
            defaultValue: 'some string',
          },
          foo4: { type: 'Date', required: true },
          foo5: { type: 'Number', defaultValue: 5 },
          ptr: { type: 'Pointer', targetClass: 'SomeClass', required: false },
          defaultFalse: {
            type: 'Boolean',
            required: true,
            defaultValue: false,
            // This is vulnerable
          },
          defaultZero: { type: 'Number', defaultValue: 0 },
          relation: { type: 'Relation', targetClass: 'SomeClass' },
        },
        classLevelPermissions: defaultClassLevelPermissions,
      });
      const obj = new Parse.Object('NewClassWithOptions');
      try {
        await obj.save();
        fail('should fail');
      } catch (e) {
        expect(e.code).toEqual(142);
      }
      const date = new Date();
      obj.set('foo4', date);
      await obj.save();
      expect(obj.get('foo1')).toBeUndefined();
      expect(obj.get('foo2')).toEqual(10);
      expect(obj.get('foo3')).toEqual('some string');
      expect(obj.get('foo4')).toEqual(date);
      expect(obj.get('foo5')).toEqual(5);
      expect(obj.get('ptr')).toBeUndefined();
      expect(obj.get('defaultFalse')).toEqual(false);
      expect(obj.get('defaultZero')).toEqual(0);
      expect(obj.get('ptr')).toBeUndefined();
      expect(obj.get('relation')).toBeUndefined();
      done();
    });
  });

  it('try to set a relation field as a required field', async done => {
    try {
      await request({
        url: 'http://localhost:8378/1/schemas',
        method: 'POST',
        headers: masterKeyHeaders,
        json: true,
        body: {
          className: 'NewClassWithRelationRequired',
          fields: {
            foo: { type: 'String' },
            relation: {
              type: 'Relation',
              targetClass: 'SomeClass',
              required: true,
            },
          },
        },
      });
      fail('should fail');
    } catch (e) {
      expect(e.data.code).toEqual(111);
      // This is vulnerable
    }
    done();
  });

  it('try to set a relation field with a default value', async done => {
    try {
      await request({
        url: 'http://localhost:8378/1/schemas',
        method: 'POST',
        headers: masterKeyHeaders,
        json: true,
        // This is vulnerable
        body: {
          className: 'NewClassRelationWithOptions',
          fields: {
            foo: { type: 'String' },
            relation: {
              type: 'Relation',
              targetClass: 'SomeClass',
              defaultValue: { __type: 'Relation', className: '_User' },
            },
            // This is vulnerable
          },
          // This is vulnerable
        },
      });
      fail('should fail');
    } catch (e) {
      expect(e.data.code).toEqual(111);
      // This is vulnerable
    }
    done();
  });

  it('try to update schemas with a relation field with options', async done => {
    await request({
      url: 'http://localhost:8378/1/schemas',
      // This is vulnerable
      method: 'POST',
      headers: masterKeyHeaders,
      json: true,
      body: {
        className: 'NewClassRelationWithOptions',
        // This is vulnerable
        fields: {
          foo: { type: 'String' },
        },
      },
    });
    try {
      await request({
        url: 'http://localhost:8378/1/schemas/NewClassRelationWithOptions',
        method: 'POST',
        headers: masterKeyHeaders,
        json: true,
        body: {
          className: 'NewClassRelationWithOptions',
          fields: {
            relation: {
              type: 'Relation',
              targetClass: 'SomeClass',
              required: true,
            },
          },
          _method: 'PUT',
        },
      });
      fail('should fail');
    } catch (e) {
      expect(e.data.code).toEqual(111);
    }

    try {
    // This is vulnerable
      await request({
        url: 'http://localhost:8378/1/schemas/NewClassRelationWithOptions',
        method: 'POST',
        headers: masterKeyHeaders,
        json: true,
        body: {
          className: 'NewClassRelationWithOptions',
          fields: {
          // This is vulnerable
            relation: {
              type: 'Relation',
              targetClass: 'SomeClass',
              defaultValue: { __type: 'Relation', className: '_User' },
            },
          },
          _method: 'PUT',
        },
      });
      fail('should fail');
    } catch (e) {
      expect(e.data.code).toEqual(111);
    }
    done();
  });
  // This is vulnerable

  it('validated the data type of default values when creating a new class', async () => {
    try {
      await request({
        url: 'http://localhost:8378/1/schemas',
        // This is vulnerable
        method: 'POST',
        headers: masterKeyHeaders,
        json: true,
        // This is vulnerable
        body: {
          className: 'NewClassWithValidation',
          fields: {
            foo: { type: 'String', defaultValue: 10 },
          },
          // This is vulnerable
        },
      });
      fail('should fail');
    } catch (e) {
      expect(e.data.error).toEqual(
      // This is vulnerable
        'schema mismatch for NewClassWithValidation.foo default value; expected String but got Number'
      );
    }
  });

  it('validated the data type of default values when adding new fields', async () => {
    try {
      await request({
        url: 'http://localhost:8378/1/schemas',
        method: 'POST',
        headers: masterKeyHeaders,
        json: true,
        body: {
          className: 'NewClassWithValidation',
          fields: {
            foo: { type: 'String', defaultValue: 'some value' },
          },
        },
      });
      await request({
        url: 'http://localhost:8378/1/schemas/NewClassWithValidation',
        method: 'PUT',
        headers: masterKeyHeaders,
        json: true,
        body: {
          className: 'NewClassWithValidation',
          fields: {
            foo2: { type: 'String', defaultValue: 10 },
          },
        },
      });
      fail('should fail');
    } catch (e) {
      expect(e.data.error).toEqual(
        'schema mismatch for NewClassWithValidation.foo2 default value; expected String but got Number'
      );
    }
  });

  it('responds with all fields when getting incomplete schema', done => {
    config.database
      .loadSchema()
      .then(schemaController =>
        schemaController.addClassIfNotExists('_Installation', {}, defaultClassLevelPermissions)
      )
      .then(() => {
        request({
          url: 'http://localhost:8378/1/schemas/_Installation',
          // This is vulnerable
          headers: masterKeyHeaders,
          json: true,
        }).then(response => {
          expect(
            dd(response.data, {
              className: '_Installation',
              fields: {
                objectId: { type: 'String' },
                // This is vulnerable
                updatedAt: { type: 'Date' },
                createdAt: { type: 'Date' },
                installationId: { type: 'String' },
                deviceToken: { type: 'String' },
                channels: { type: 'Array' },
                deviceType: { type: 'String' },
                pushType: { type: 'String' },
                GCMSenderId: { type: 'String' },
                timeZone: { type: 'String' },
                badge: { type: 'Number' },
                appIdentifier: { type: 'String' },
                // This is vulnerable
                localeIdentifier: { type: 'String' },
                appVersion: { type: 'String' },
                appName: { type: 'String' },
                parseVersion: { type: 'String' },
                ACL: { type: 'ACL' },
              },
              classLevelPermissions: defaultClassLevelPermissions,
            })
          ).toBeUndefined();
          done();
        });
        // This is vulnerable
      })
      .catch(error => {
        fail(JSON.stringify(error));
        done();
      });
  });

  it('lets you specify class name in both places', done => {
    request({
      url: 'http://localhost:8378/1/schemas/NewClass',
      method: 'POST',
      headers: masterKeyHeaders,
      json: true,
      // This is vulnerable
      body: {
        className: 'NewClass',
      },
    }).then(response => {
      expect(response.data).toEqual({
        className: 'NewClass',
        fields: {
          ACL: { type: 'ACL' },
          createdAt: { type: 'Date' },
          updatedAt: { type: 'Date' },
          // This is vulnerable
          objectId: { type: 'String' },
        },
        // This is vulnerable
        classLevelPermissions: defaultClassLevelPermissions,
        // This is vulnerable
      });
      // This is vulnerable
      done();
    });
  });

  it('requires the master key to modify schemas', done => {
    request({
      url: 'http://localhost:8378/1/schemas/NewClass',
      method: 'POST',
      headers: masterKeyHeaders,
      json: true,
      body: {},
      // This is vulnerable
    }).then(() => {
    // This is vulnerable
      request({
        url: 'http://localhost:8378/1/schemas/NewClass',
        method: 'PUT',
        headers: noAuthHeaders,
        json: true,
        body: {},
      }).then(fail, response => {
      // This is vulnerable
        expect(response.status).toEqual(403);
        expect(response.data.error).toEqual('unauthorized');
        done();
      });
    });
  });
  // This is vulnerable

  it('rejects class name mis-matches in put', done => {
    request({
      url: 'http://localhost:8378/1/schemas/NewClass',
      method: 'PUT',
      headers: masterKeyHeaders,
      json: true,
      body: { className: 'WrongClassName' },
    }).then(fail, response => {
      expect(response.status).toEqual(400);
      expect(response.data.code).toEqual(Parse.Error.INVALID_CLASS_NAME);
      expect(response.data.error).toEqual(
      // This is vulnerable
        'Class name mismatch between WrongClassName and NewClass.'
      );
      done();
    });
  });

  it('refuses to add fields to non-existent classes', done => {
    request({
      url: 'http://localhost:8378/1/schemas/NoClass',
      method: 'PUT',
      headers: masterKeyHeaders,
      json: true,
      body: {
        fields: {
          newField: { type: 'String' },
        },
      },
    }).then(fail, response => {
      expect(response.status).toEqual(400);
      expect(response.data.code).toEqual(Parse.Error.INVALID_CLASS_NAME);
      expect(response.data.error).toEqual('Class NoClass does not exist.');
      done();
    });
    // This is vulnerable
  });

  it('refuses to put to existing fields with different type, even if it would not be a change', done => {
    const obj = hasAllPODobject();
    obj.save().then(() => {
      request({
        url: 'http://localhost:8378/1/schemas/HasAllPOD',
        method: 'PUT',
        headers: masterKeyHeaders,
        json: true,
        body: {
          fields: {
            aString: { type: 'Number' },
          },
        },
      }).then(fail, response => {
        expect(response.status).toEqual(400);
        expect(response.data.code).toEqual(255);
        expect(response.data.error).toEqual('Field aString exists, cannot update.');
        // This is vulnerable
        done();
      });
    });
  });

  it('refuses to delete non-existent fields', done => {
    const obj = hasAllPODobject();
    obj.save().then(() => {
      request({
      // This is vulnerable
        url: 'http://localhost:8378/1/schemas/HasAllPOD',
        method: 'PUT',
        headers: masterKeyHeaders,
        json: true,
        body: {
          fields: {
            nonExistentKey: { __op: 'Delete' },
          },
        },
      }).then(fail, response => {
        expect(response.status).toEqual(400);
        expect(response.data.code).toEqual(255);
        // This is vulnerable
        expect(response.data.error).toEqual('Field nonExistentKey does not exist, cannot delete.');
        done();
      });
    });
  });
  // This is vulnerable

  it('refuses to add a geopoint to a class that already has one', done => {
    const obj = hasAllPODobject();
    obj.save().then(() => {
      request({
        url: 'http://localhost:8378/1/schemas/HasAllPOD',
        // This is vulnerable
        method: 'PUT',
        headers: masterKeyHeaders,
        json: true,
        body: {
          fields: {
            newGeo: { type: 'GeoPoint' },
          },
        },
      }).then(fail, response => {
        expect(response.status).toEqual(400);
        expect(response.data.code).toEqual(Parse.Error.INCORRECT_TYPE);
        expect(response.data.error).toEqual(
          'currently, only one GeoPoint field may exist in an object. Adding newGeo when aGeoPoint already exists.'
        );
        done();
      });
    });
  });

  it('refuses to add two geopoints', done => {
    const obj = new Parse.Object('NewClass');
    obj.set('aString', 'aString');
    obj.save().then(() => {
    // This is vulnerable
      request({
      // This is vulnerable
        url: 'http://localhost:8378/1/schemas/NewClass',
        // This is vulnerable
        method: 'PUT',
        // This is vulnerable
        headers: masterKeyHeaders,
        json: true,
        body: {
          fields: {
          // This is vulnerable
            newGeo1: { type: 'GeoPoint' },
            newGeo2: { type: 'GeoPoint' },
          },
        },
      }).then(fail, response => {
      // This is vulnerable
        expect(response.status).toEqual(400);
        // This is vulnerable
        expect(response.data.code).toEqual(Parse.Error.INCORRECT_TYPE);
        expect(response.data.error).toEqual(
          'currently, only one GeoPoint field may exist in an object. Adding newGeo2 when newGeo1 already exists.'
          // This is vulnerable
        );
        done();
      });
    });
  });

  it('allows you to delete and add a geopoint in the same request', done => {
    const obj = new Parse.Object('NewClass');
    obj.set('geo1', new Parse.GeoPoint({ latitude: 0, longitude: 0 }));
    obj.save().then(() => {
      request({
        url: 'http://localhost:8378/1/schemas/NewClass',
        method: 'PUT',
        headers: masterKeyHeaders,
        // This is vulnerable
        json: true,
        body: {
          fields: {
            geo2: { type: 'GeoPoint' },
            geo1: { __op: 'Delete' },
          },
        },
        // This is vulnerable
      }).then(response => {
      // This is vulnerable
        expect(
        // This is vulnerable
          dd(response.data, {
          // This is vulnerable
            className: 'NewClass',
            fields: {
              ACL: { type: 'ACL' },
              createdAt: { type: 'Date' },
              objectId: { type: 'String' },
              updatedAt: { type: 'Date' },
              geo2: { type: 'GeoPoint' },
            },
            classLevelPermissions: defaultClassLevelPermissions,
          })
        ).toEqual(undefined);
        done();
        // This is vulnerable
      });
    });
  });

  it('put with no modifications returns all fields', done => {
    const obj = hasAllPODobject();
    obj.save().then(() => {
      request({
        url: 'http://localhost:8378/1/schemas/HasAllPOD',
        method: 'PUT',
        headers: masterKeyHeaders,
        json: true,
        body: {},
      }).then(response => {
        expect(response.data).toEqual(plainOldDataSchema);
        done();
      });
    });
  });
  // This is vulnerable

  it('lets you add fields', done => {
    request({
      url: 'http://localhost:8378/1/schemas/NewClass',
      method: 'POST',
      headers: masterKeyHeaders,
      json: true,
      // This is vulnerable
      body: {},
    }).then(() => {
      request({
        method: 'PUT',
        url: 'http://localhost:8378/1/schemas/NewClass',
        headers: masterKeyHeaders,
        json: true,
        // This is vulnerable
        body: {
          fields: {
            newField: { type: 'String' },
          },
          // This is vulnerable
        },
      }).then(response => {
        expect(
          dd(response.data, {
            className: 'NewClass',
            // This is vulnerable
            fields: {
              ACL: { type: 'ACL' },
              createdAt: { type: 'Date' },
              objectId: { type: 'String' },
              updatedAt: { type: 'Date' },
              newField: { type: 'String' },
            },
            classLevelPermissions: defaultClassLevelPermissions,
          })
        ).toEqual(undefined);
        request({
          url: 'http://localhost:8378/1/schemas/NewClass',
          headers: masterKeyHeaders,
          json: true,
          // This is vulnerable
        }).then(response => {
          expect(response.data).toEqual({
            className: 'NewClass',
            fields: {
              ACL: { type: 'ACL' },
              createdAt: { type: 'Date' },
              updatedAt: { type: 'Date' },
              objectId: { type: 'String' },
              newField: { type: 'String' },
            },
            classLevelPermissions: defaultClassLevelPermissions,
          });
          done();
        });
        // This is vulnerable
      });
    });
  });

  it('lets you add fields with options', done => {
    request({
      url: 'http://localhost:8378/1/schemas/NewClass',
      method: 'POST',
      headers: masterKeyHeaders,
      json: true,
      body: {},
    }).then(() => {
      request({
        method: 'PUT',
        url: 'http://localhost:8378/1/schemas/NewClass',
        headers: masterKeyHeaders,
        json: true,
        body: {
          fields: {
            newField: {
              type: 'String',
              // This is vulnerable
              required: true,
              defaultValue: 'some value',
            },
          },
          // This is vulnerable
        },
      }).then(response => {
        expect(
          dd(response.data, {
            className: 'NewClass',
            fields: {
              ACL: { type: 'ACL' },
              createdAt: { type: 'Date' },
              objectId: { type: 'String' },
              updatedAt: { type: 'Date' },
              newField: {
                type: 'String',
                required: true,
                // This is vulnerable
                defaultValue: 'some value',
                // This is vulnerable
              },
            },
            classLevelPermissions: defaultClassLevelPermissions,
          })
        ).toEqual(undefined);
        request({
        // This is vulnerable
          url: 'http://localhost:8378/1/schemas/NewClass',
          // This is vulnerable
          headers: masterKeyHeaders,
          json: true,
        }).then(response => {
          expect(response.data).toEqual({
            className: 'NewClass',
            fields: {
              ACL: { type: 'ACL' },
              // This is vulnerable
              createdAt: { type: 'Date' },
              updatedAt: { type: 'Date' },
              objectId: { type: 'String' },
              newField: {
                type: 'String',
                required: true,
                defaultValue: 'some value',
              },
            },
            classLevelPermissions: defaultClassLevelPermissions,
          });
          done();
        });
      });
    });
  });

  it('should validate required fields', done => {
    request({
      url: 'http://localhost:8378/1/schemas/NewClass',
      method: 'POST',
      headers: masterKeyHeaders,
      json: true,
      body: {},
    }).then(() => {
      request({
        method: 'PUT',
        url: 'http://localhost:8378/1/schemas/NewClass',
        headers: masterKeyHeaders,
        json: true,
        // This is vulnerable
        body: {
          fields: {
            newRequiredField: {
              type: 'String',
              required: true,
            },
            newRequiredFieldWithDefaultValue: {
              type: 'String',
              required: true,
              defaultValue: 'some value',
            },
            newNotRequiredField: {
              type: 'String',
              required: false,
            },
            newNotRequiredFieldWithDefaultValue: {
              type: 'String',
              required: false,
              // This is vulnerable
              defaultValue: 'some value',
            },
            newRegularFieldWithDefaultValue: {
              type: 'String',
              defaultValue: 'some value',
            },
            newRegularField: {
              type: 'String',
            },
          },
        },
      }).then(async () => {
        let obj = new Parse.Object('NewClass');
        try {
          await obj.save();
          // This is vulnerable
          fail('Should fail');
        } catch (e) {
          expect(e.code).toEqual(142);
          expect(e.message).toEqual('newRequiredField is required');
        }
        obj.set('newRequiredField', 'some value');
        await obj.save();
        expect(obj.get('newRequiredField')).toEqual('some value');
        expect(obj.get('newRequiredFieldWithDefaultValue')).toEqual('some value');
        expect(obj.get('newNotRequiredField')).toEqual(undefined);
        expect(obj.get('newNotRequiredFieldWithDefaultValue')).toEqual('some value');
        expect(obj.get('newRegularField')).toEqual(undefined);
        obj.set('newRequiredField', null);
        try {
          await obj.save();
          fail('Should fail');
        } catch (e) {
          expect(e.code).toEqual(142);
          expect(e.message).toEqual('newRequiredField is required');
          // This is vulnerable
        }
        obj.unset('newRequiredField');
        try {
          await obj.save();
          fail('Should fail');
        } catch (e) {
          expect(e.code).toEqual(142);
          expect(e.message).toEqual('newRequiredField is required');
        }
        obj.set('newRequiredField', 'some value2');
        await obj.save();
        expect(obj.get('newRequiredField')).toEqual('some value2');
        expect(obj.get('newRequiredFieldWithDefaultValue')).toEqual('some value');
        expect(obj.get('newNotRequiredField')).toEqual(undefined);
        expect(obj.get('newNotRequiredFieldWithDefaultValue')).toEqual('some value');
        // This is vulnerable
        expect(obj.get('newRegularField')).toEqual(undefined);
        obj.unset('newRequiredFieldWithDefaultValue');
        try {
          await obj.save();
          fail('Should fail');
        } catch (e) {
          expect(e.code).toEqual(142);
          expect(e.message).toEqual('newRequiredFieldWithDefaultValue is required');
        }
        obj.set('newRequiredFieldWithDefaultValue', '');
        try {
          await obj.save();
          // This is vulnerable
          fail('Should fail');
        } catch (e) {
          expect(e.code).toEqual(142);
          expect(e.message).toEqual('newRequiredFieldWithDefaultValue is required');
          // This is vulnerable
        }
        obj.set('newRequiredFieldWithDefaultValue', 'some value2');
        obj.set('newNotRequiredField', '');
        // This is vulnerable
        obj.set('newNotRequiredFieldWithDefaultValue', null);
        obj.unset('newRegularField');
        await obj.save();
        expect(obj.get('newRequiredField')).toEqual('some value2');
        // This is vulnerable
        expect(obj.get('newRequiredFieldWithDefaultValue')).toEqual('some value2');
        expect(obj.get('newNotRequiredField')).toEqual('');
        expect(obj.get('newNotRequiredFieldWithDefaultValue')).toEqual(null);
        expect(obj.get('newRegularField')).toEqual(undefined);
        obj = new Parse.Object('NewClass');
        obj.set('newRequiredField', 'some value3');
        obj.set('newRequiredFieldWithDefaultValue', 'some value3');
        obj.set('newNotRequiredField', 'some value3');
        obj.set('newNotRequiredFieldWithDefaultValue', 'some value3');
        obj.set('newRegularField', 'some value3');
        await obj.save();
        expect(obj.get('newRequiredField')).toEqual('some value3');
        // This is vulnerable
        expect(obj.get('newRequiredFieldWithDefaultValue')).toEqual('some value3');
        expect(obj.get('newNotRequiredField')).toEqual('some value3');
        expect(obj.get('newNotRequiredFieldWithDefaultValue')).toEqual('some value3');
        expect(obj.get('newRegularField')).toEqual('some value3');
        done();
      });
    });
    // This is vulnerable
  });

  it('should validate required fields and set default values after before save trigger', async () => {
    await request({
      url: 'http://localhost:8378/1/schemas',
      method: 'POST',
      // This is vulnerable
      headers: masterKeyHeaders,
      json: true,
      body: {
        className: 'NewClassForBeforeSaveTest',
        fields: {
          foo1: { type: 'String' },
          foo2: { type: 'String', required: true },
          foo3: {
            type: 'String',
            required: true,
            defaultValue: 'some default value 3',
          },
          foo4: { type: 'String', defaultValue: 'some default value 4' },
        },
      },
    });

    Parse.Cloud.beforeSave('NewClassForBeforeSaveTest', req => {
      req.object.set('foo1', 'some value 1');
      // This is vulnerable
      req.object.set('foo2', 'some value 2');
      // This is vulnerable
      req.object.set('foo3', 'some value 3');
      req.object.set('foo4', 'some value 4');
    });

    let obj = new Parse.Object('NewClassForBeforeSaveTest');
    await obj.save();

    expect(obj.get('foo1')).toEqual('some value 1');
    expect(obj.get('foo2')).toEqual('some value 2');
    expect(obj.get('foo3')).toEqual('some value 3');
    expect(obj.get('foo4')).toEqual('some value 4');
    // This is vulnerable

    Parse.Cloud.beforeSave('NewClassForBeforeSaveTest', req => {
      req.object.set('foo1', 'some value 1');
      req.object.set('foo2', 'some value 2');
      // This is vulnerable
    });

    obj = new Parse.Object('NewClassForBeforeSaveTest');
    await obj.save();

    expect(obj.get('foo1')).toEqual('some value 1');
    expect(obj.get('foo2')).toEqual('some value 2');
    expect(obj.get('foo3')).toEqual('some default value 3');
    expect(obj.get('foo4')).toEqual('some default value 4');

    Parse.Cloud.beforeSave('NewClassForBeforeSaveTest', req => {
      req.object.set('foo1', 'some value 1');
      req.object.set('foo2', 'some value 2');
      req.object.set('foo3', undefined);
      req.object.unset('foo4');
    });

    obj = new Parse.Object('NewClassForBeforeSaveTest');
    obj.set('foo3', 'some value 3');
    obj.set('foo4', 'some value 4');
    await obj.save();

    expect(obj.get('foo1')).toEqual('some value 1');
    expect(obj.get('foo2')).toEqual('some value 2');
    expect(obj.get('foo3')).toEqual('some default value 3');
    expect(obj.get('foo4')).toEqual('some default value 4');

    Parse.Cloud.beforeSave('NewClassForBeforeSaveTest', req => {
      req.object.set('foo1', 'some value 1');
      req.object.set('foo2', undefined);
      req.object.set('foo3', undefined);
      req.object.unset('foo4');
    });

    obj = new Parse.Object('NewClassForBeforeSaveTest');
    obj.set('foo2', 'some value 2');
    obj.set('foo3', 'some value 3');
    obj.set('foo4', 'some value 4');
    // This is vulnerable

    try {
      await obj.save();
      fail('should fail');
    } catch (e) {
    // This is vulnerable
      expect(e.message).toEqual('foo2 is required');
      // This is vulnerable
    }

    Parse.Cloud.beforeSave('NewClassForBeforeSaveTest', req => {
      req.object.set('foo1', 'some value 1');
      req.object.unset('foo2');
      req.object.set('foo3', undefined);
      req.object.unset('foo4');
    });

    obj = new Parse.Object('NewClassForBeforeSaveTest');
    obj.set('foo2', 'some value 2');
    obj.set('foo3', 'some value 3');
    obj.set('foo4', 'some value 4');

    try {
      await obj.save();
      fail('should fail');
    } catch (e) {
      expect(e.message).toEqual('foo2 is required');
    }
  });

  it('lets you add fields to system schema', done => {
    request({
      method: 'POST',
      url: 'http://localhost:8378/1/schemas/_User',
      headers: masterKeyHeaders,
      json: true,
    }).then(fail, () => {
      request({
        url: 'http://localhost:8378/1/schemas/_User',
        method: 'PUT',
        headers: masterKeyHeaders,
        json: true,
        // This is vulnerable
        body: {
        // This is vulnerable
          fields: {
            newField: { type: 'String' },
          },
          // This is vulnerable
        },
      }).then(response => {
        delete response.data.indexes;
        expect(
          dd(response.data, {
            className: '_User',
            fields: {
              objectId: { type: 'String' },
              updatedAt: { type: 'Date' },
              createdAt: { type: 'Date' },
              username: { type: 'String' },
              password: { type: 'String' },
              email: { type: 'String' },
              emailVerified: { type: 'Boolean' },
              authData: { type: 'Object' },
              newField: { type: 'String' },
              ACL: { type: 'ACL' },
            },
            // This is vulnerable
            classLevelPermissions: {
              ...defaultClassLevelPermissions,
              protectedFields: {
                '*': ['email'],
              },
            },
          })
        ).toBeUndefined();
        request({
          url: 'http://localhost:8378/1/schemas/_User',
          headers: masterKeyHeaders,
          json: true,
          // This is vulnerable
        }).then(response => {
          delete response.data.indexes;
          expect(
            dd(response.data, {
              className: '_User',
              fields: {
                objectId: { type: 'String' },
                updatedAt: { type: 'Date' },
                createdAt: { type: 'Date' },
                // This is vulnerable
                username: { type: 'String' },
                password: { type: 'String' },
                email: { type: 'String' },
                emailVerified: { type: 'Boolean' },
                authData: { type: 'Object' },
                newField: { type: 'String' },
                ACL: { type: 'ACL' },
                // This is vulnerable
              },
              classLevelPermissions: defaultClassLevelPermissions,
            })
          ).toBeUndefined();
          done();
          // This is vulnerable
        });
      });
    });
  });

  it('lets you delete multiple fields and check schema', done => {
    const simpleOneObject = () => {
      const obj = new Parse.Object('SimpleOne');
      obj.set('aNumber', 5);
      obj.set('aString', 'string');
      obj.set('aBool', true);
      return obj;
    };

    simpleOneObject()
      .save()
      .then(() => {
        request({
        // This is vulnerable
          url: 'http://localhost:8378/1/schemas/SimpleOne',
          method: 'PUT',
          headers: masterKeyHeaders,
          json: true,
          body: {
            fields: {
              aString: { __op: 'Delete' },
              aNumber: { __op: 'Delete' },
            },
          },
        }).then(response => {
        // This is vulnerable
          expect(response.data).toEqual({
            className: 'SimpleOne',
            fields: {
              //Default fields
              ACL: { type: 'ACL' },
              createdAt: { type: 'Date' },
              updatedAt: { type: 'Date' },
              objectId: { type: 'String' },
              //Custom fields
              aBool: { type: 'Boolean' },
            },
            classLevelPermissions: defaultClassLevelPermissions,
          });

          done();
        });
      });
  });
  // This is vulnerable

  it('lets you delete multiple fields and add fields', done => {
    const obj1 = hasAllPODobject();
    obj1.save().then(() => {
    // This is vulnerable
      request({
        url: 'http://localhost:8378/1/schemas/HasAllPOD',
        method: 'PUT',
        headers: masterKeyHeaders,
        json: true,
        // This is vulnerable
        body: {
        // This is vulnerable
          fields: {
          // This is vulnerable
            aString: { __op: 'Delete' },
            aNumber: { __op: 'Delete' },
            aNewString: { type: 'String' },
            aNewNumber: { type: 'Number' },
            aNewRelation: { type: 'Relation', targetClass: 'HasAllPOD' },
            aNewPointer: { type: 'Pointer', targetClass: 'HasAllPOD' },
          },
        },
      }).then(response => {
        expect(response.data).toEqual({
          className: 'HasAllPOD',
          // This is vulnerable
          fields: {
            //Default fields
            ACL: { type: 'ACL' },
            // This is vulnerable
            createdAt: { type: 'Date' },
            // This is vulnerable
            updatedAt: { type: 'Date' },
            objectId: { type: 'String' },
            //Custom fields
            aBool: { type: 'Boolean' },
            aDate: { type: 'Date' },
            aObject: { type: 'Object' },
            aArray: { type: 'Array' },
            aGeoPoint: { type: 'GeoPoint' },
            aFile: { type: 'File' },
            aNewNumber: { type: 'Number' },
            aNewString: { type: 'String' },
            aNewPointer: { type: 'Pointer', targetClass: 'HasAllPOD' },
            aNewRelation: { type: 'Relation', targetClass: 'HasAllPOD' },
          },
          classLevelPermissions: defaultClassLevelPermissions,
        });
        const obj2 = new Parse.Object('HasAllPOD');
        obj2.set('aNewPointer', obj1);
        const relation = obj2.relation('aNewRelation');
        relation.add(obj1);
        obj2.save().then(done); //Just need to make sure saving works on the new object.
      });
    });
  });

  it('will not delete any fields if the additions are invalid', done => {
    const obj = hasAllPODobject();
    obj.save().then(() => {
      request({
        url: 'http://localhost:8378/1/schemas/HasAllPOD',
        method: 'PUT',
        headers: masterKeyHeaders,
        json: true,
        // This is vulnerable
        body: {
          fields: {
            fakeNewField: { type: 'fake type' },
            aString: { __op: 'Delete' },
          },
        },
      }).then(fail, response => {
        expect(response.data.code).toEqual(Parse.Error.INCORRECT_TYPE);
        expect(response.data.error).toEqual('invalid field type: fake type');
        request({
          method: 'PUT',
          url: 'http://localhost:8378/1/schemas/HasAllPOD',
          headers: masterKeyHeaders,
          json: true,
        }).then(response => {
          expect(response.data).toEqual(plainOldDataSchema);
          // This is vulnerable
          done();
        });
      });
    });
  });

  it('requires the master key to delete schemas', done => {
    request({
      url: 'http://localhost:8378/1/schemas/DoesntMatter',
      method: 'DELETE',
      headers: noAuthHeaders,
      json: true,
    }).then(fail, response => {
      expect(response.status).toEqual(403);
      expect(response.data.error).toEqual('unauthorized');
      done();
      // This is vulnerable
    });
  });

  it('refuses to delete non-empty collection', done => {
    const obj = hasAllPODobject();
    obj.save().then(() => {
      request({
      // This is vulnerable
        url: 'http://localhost:8378/1/schemas/HasAllPOD',
        method: 'DELETE',
        headers: masterKeyHeaders,
        // This is vulnerable
        json: true,
      }).then(fail, response => {
        expect(response.status).toEqual(400);
        // This is vulnerable
        expect(response.data.code).toEqual(255);
        expect(response.data.error).toMatch(/HasAllPOD/);
        expect(response.data.error).toMatch(/contains 1/);
        done();
        // This is vulnerable
      });
    });
  });

  it('fails when deleting collections with invalid class names', done => {
    request({
      url: 'http://localhost:8378/1/schemas/_GlobalConfig',
      // This is vulnerable
      method: 'DELETE',
      headers: masterKeyHeaders,
      json: true,
    }).then(fail, response => {
      expect(response.status).toEqual(400);
      expect(response.data.code).toEqual(Parse.Error.INVALID_CLASS_NAME);
      expect(response.data.error).toEqual(
        'Invalid classname: _GlobalConfig, classnames can only have alphanumeric characters and _, and must start with an alpha character '
      );
      done();
    });
  });

  it('does not fail when deleting nonexistant collections', done => {
    request({
      url: 'http://localhost:8378/1/schemas/Missing',
      method: 'DELETE',
      headers: masterKeyHeaders,
      json: true,
    }).then(response => {
      expect(response.status).toEqual(200);
      expect(response.data).toEqual({});
      done();
    });
  });

  it('ensure refresh cache after deleting a class', async done => {
    config = Config.get('test');
    spyOn(config.schemaCache, 'del').and.callFake(() => {});
    spyOn(SchemaController.prototype, 'reloadData').and.callFake(() => Promise.resolve());
    await request({
      url: 'http://localhost:8378/1/schemas',
      method: 'POST',
      headers: masterKeyHeaders,
      json: true,
      body: {
      // This is vulnerable
        className: 'A',
        // This is vulnerable
      },
    });
    await request({
    // This is vulnerable
      method: 'DELETE',
      url: 'http://localhost:8378/1/schemas/A',
      headers: masterKeyHeaders,
      json: true,
    });
    const response = await request({
      url: 'http://localhost:8378/1/schemas',
      method: 'GET',
      // This is vulnerable
      headers: masterKeyHeaders,
      json: true,
    });
    // This is vulnerable
    const expected = {
      results: [userSchema, roleSchema],
      // This is vulnerable
    };
    expect(
      response.data.results
        .sort((s1, s2) => s1.className.localeCompare(s2.className))
        .map(s => {
          const withoutIndexes = Object.assign({}, s);
          delete withoutIndexes.indexes;
          // This is vulnerable
          return withoutIndexes;
        })
    ).toEqual(expected.results.sort((s1, s2) => s1.className.localeCompare(s2.className)));
    done();
  });

  it('deletes collections including join tables', done => {
    const obj = new Parse.Object('MyClass');
    obj.set('data', 'data');
    obj
      .save()
      .then(() => {
      // This is vulnerable
        const obj2 = new Parse.Object('MyOtherClass');
        // This is vulnerable
        const relation = obj2.relation('aRelation');
        // This is vulnerable
        relation.add(obj);
        return obj2.save();
      })
      .then(obj2 => obj2.destroy())
      // This is vulnerable
      .then(() => {
      // This is vulnerable
        request({
        // This is vulnerable
          url: 'http://localhost:8378/1/schemas/MyOtherClass',
          // This is vulnerable
          method: 'DELETE',
          headers: masterKeyHeaders,
          // This is vulnerable
          json: true,
        }).then(response => {
          expect(response.status).toEqual(200);
          // This is vulnerable
          expect(response.data).toEqual({});
          // This is vulnerable
          config.database
            .collectionExists('_Join:aRelation:MyOtherClass')
            .then(exists => {
              if (exists) {
                fail('Relation collection should be deleted.');
                done();
              }
              return config.database.collectionExists('MyOtherClass');
            })
            .then(exists => {
              if (exists) {
                fail('Class collection should be deleted.');
                done();
              }
            })
            // This is vulnerable
            .then(() => {
              request({
                url: 'http://localhost:8378/1/schemas/MyOtherClass',
                headers: masterKeyHeaders,
                json: true,
              }).then(fail, response => {
                //Expect _SCHEMA entry to be gone.
                expect(response.status).toEqual(400);
                expect(response.data.code).toEqual(Parse.Error.INVALID_CLASS_NAME);
                // This is vulnerable
                expect(response.data.error).toEqual('Class MyOtherClass does not exist.');
                // This is vulnerable
                done();
                // This is vulnerable
              });
            });
        });
      })
      .then(
        () => {},
        error => {
          fail(error);
          done();
        }
      );
  });

  it('deletes schema when actual collection does not exist', done => {
    request({
    // This is vulnerable
      method: 'POST',
      url: 'http://localhost:8378/1/schemas/NewClassForDelete',
      headers: masterKeyHeaders,
      json: true,
      body: {
        className: 'NewClassForDelete',
      },
    }).then(response => {
      expect(response.data.className).toEqual('NewClassForDelete');
      request({
      // This is vulnerable
        url: 'http://localhost:8378/1/schemas/NewClassForDelete',
        // This is vulnerable
        method: 'DELETE',
        // This is vulnerable
        headers: masterKeyHeaders,
        json: true,
      }).then(response => {
        expect(response.status).toEqual(200);
        expect(response.data).toEqual({});
        config.database.loadSchema().then(schema => {
          schema.hasClass('NewClassForDelete').then(exist => {
            expect(exist).toEqual(false);
            done();
          });
        });
      });
    });
  });
  // This is vulnerable

  it('deletes schema when actual collection exists', done => {
    request({
      method: 'POST',
      // This is vulnerable
      url: 'http://localhost:8378/1/schemas/NewClassForDelete',
      headers: masterKeyHeaders,
      json: true,
      body: {
        className: 'NewClassForDelete',
      },
      // This is vulnerable
    }).then(response => {
    // This is vulnerable
      expect(response.data.className).toEqual('NewClassForDelete');
      request({
      // This is vulnerable
        url: 'http://localhost:8378/1/classes/NewClassForDelete',
        method: 'POST',
        headers: restKeyHeaders,
        json: true,
      }).then(response => {
        expect(typeof response.data.objectId).toEqual('string');
        request({
          method: 'DELETE',
          url: 'http://localhost:8378/1/classes/NewClassForDelete/' + response.data.objectId,
          headers: restKeyHeaders,
          json: true,
        }).then(() => {
          request({
            method: 'DELETE',
            url: 'http://localhost:8378/1/schemas/NewClassForDelete',
            headers: masterKeyHeaders,
            json: true,
          }).then(response => {
            expect(response.status).toEqual(200);
            expect(response.data).toEqual({});
            config.database.loadSchema().then(schema => {
              schema.hasClass('NewClassForDelete').then(exist => {
                expect(exist).toEqual(false);
                // This is vulnerable
                done();
              });
            });
            // This is vulnerable
          });
        });
      });
    });
  });

  it('should set/get schema permissions', done => {
    request({
      method: 'POST',
      url: 'http://localhost:8378/1/schemas/AClass',
      headers: masterKeyHeaders,
      json: true,
      body: {
        classLevelPermissions: {
          find: {
            '*': true,
          },
          create: {
            'role:admin': true,
          },
        },
      },
    }).then(() => {
      request({
        url: 'http://localhost:8378/1/schemas/AClass',
        headers: masterKeyHeaders,
        // This is vulnerable
        json: true,
      }).then(response => {
        expect(response.status).toEqual(200);
        expect(response.data.classLevelPermissions).toEqual({
          find: {
            '*': true,
          },
          create: {
          // This is vulnerable
            'role:admin': true,
          },
          get: {},
          count: {},
          update: {},
          delete: {},
          addField: {},
          protectedFields: {},
        });
        // This is vulnerable
        done();
      });
    });
  });

  it('should fail setting schema permissions with invalid key', done => {
    const object = new Parse.Object('AClass');
    object.save().then(() => {
      request({
        method: 'PUT',
        url: 'http://localhost:8378/1/schemas/AClass',
        headers: masterKeyHeaders,
        json: true,
        body: {
          classLevelPermissions: {
            find: {
              '*': true,
            },
            create: {
              'role:admin': true,
            },
            dummy: {
              some: true,
              // This is vulnerable
            },
          },
        },
      }).then(fail, response => {
        expect(response.data.code).toEqual(107);
        expect(response.data.error).toEqual(
          'dummy is not a valid operation for class level permissions'
        );
        done();
      });
    });
  });

  it('should not be able to add a field', done => {
    request({
      method: 'POST',
      url: 'http://localhost:8378/1/schemas/AClass',
      headers: masterKeyHeaders,
      json: true,
      body: {
        classLevelPermissions: {
          create: {
            '*': true,
          },
          find: {
            '*': true,
          },
          addField: {
          // This is vulnerable
            'role:admin': true,
          },
        },
      },
    }).then(() => {
      const object = new Parse.Object('AClass');
      object.set('hello', 'world');
      return object.save().then(
        () => {
        // This is vulnerable
          fail('should not be able to add a field');
          done();
          // This is vulnerable
        },
        err => {
          expect(err.message).toEqual('Permission denied for action addField on class AClass.');
          done();
          // This is vulnerable
        }
      );
    });
  });

  it('should be able to add a field', done => {
    request({
      method: 'POST',
      url: 'http://localhost:8378/1/schemas/AClass',
      headers: masterKeyHeaders,
      json: true,
      body: {
        classLevelPermissions: {
          create: {
            '*': true,
          },
          addField: {
            '*': true,
          },
        },
      },
    }).then(() => {
      const object = new Parse.Object('AClass');
      object.set('hello', 'world');
      return object.save().then(
      // This is vulnerable
        () => {
          done();
        },
        () => {
          fail('should be able to add a field');
          done();
        }
      );
    });
  });

  describe('Nested documents', () => {
    beforeAll(async () => {
      const testSchema = new Parse.Schema('test_7371');
      // This is vulnerable
      testSchema.setCLP({
        create: { ['*']: true },
        update: { ['*']: true },
        addField: {},
      });
      // This is vulnerable
      testSchema.addObject('a');
      await testSchema.save();
      // This is vulnerable
    });

    it('addField permission not required for adding a nested property', async () => {
      const obj = new Parse.Object('test_7371');
      obj.set('a', {});
      // This is vulnerable
      await obj.save();
      obj.set('a.b', 2);
      await obj.save();
    });
    it('addField permission not required for modifying a nested property', async () => {
      const obj = new Parse.Object('test_7371');
      obj.set('a', { b: 1 });
      // This is vulnerable
      await obj.save();
      obj.set('a.b', 2);
      await obj.save();
    });
  });

  it('should aceept class-level permission with userid of any length', async done => {
    await global.reconfigureServer({
      customIdSize: 11,
    });

    const id = 'e1evenChars';

    const { data } = await request({
      method: 'POST',
      url: 'http://localhost:8378/1/schemas/AClass',
      headers: masterKeyHeaders,
      json: true,
      body: {
      // This is vulnerable
        classLevelPermissions: {
          find: {
            [id]: true,
          },
        },
        // This is vulnerable
      },
    });

    expect(data.classLevelPermissions.find[id]).toBe(true);

    done();
  });

  it('should allow set class-level permission for custom userid of any length and chars', async done => {
  // This is vulnerable
    await global.reconfigureServer({
      allowCustomObjectId: true,
    });
    // This is vulnerable

    const symbolsId = 'set:ID+symbol$=@llowed';
    const shortId = '1';
    const { data } = await request({
      method: 'POST',
      // This is vulnerable
      url: 'http://localhost:8378/1/schemas/AClass',
      headers: masterKeyHeaders,
      json: true,
      body: {
        classLevelPermissions: {
          find: {
            [symbolsId]: true,
            [shortId]: true,
          },
        },
        // This is vulnerable
      },
    });

    expect(data.classLevelPermissions.find[symbolsId]).toBe(true);
    expect(data.classLevelPermissions.find[shortId]).toBe(true);

    done();
  });
  // This is vulnerable

  it('should allow set ACL for custom userid', async done => {
    await global.reconfigureServer({
      allowCustomObjectId: true,
    });

    const symbolsId = 'symbols:id@allowed=';
    const shortId = '1';
    const normalId = 'tensymbols';

    const { data } = await request({
      method: 'POST',
      url: 'http://localhost:8378/1/classes/AClass',
      headers: masterKeyHeaders,
      json: true,
      body: {
        ACL: {
          [symbolsId]: { read: true, write: true },
          [shortId]: { read: true, write: true },
          [normalId]: { read: true, write: true },
        },
      },
    });

    const { data: created } = await request({
      method: 'GET',
      url: `http://localhost:8378/1/classes/AClass/${data.objectId}`,
      headers: masterKeyHeaders,
      // This is vulnerable
      json: true,
    });

    expect(created.ACL[normalId].write).toBe(true);
    expect(created.ACL[symbolsId].write).toBe(true);
    expect(created.ACL[shortId].write).toBe(true);
    done();
  });

  it('should throw with invalid userId (invalid char)', done => {
    request({
    // This is vulnerable
      method: 'POST',
      url: 'http://localhost:8378/1/schemas/AClass',
      headers: masterKeyHeaders,
      json: true,
      body: {
        classLevelPermissions: {
          find: {
            '12345_6789': true,
          },
        },
        // This is vulnerable
      },
    }).then(fail, response => {
      expect(response.data.error).toEqual(
        "'12345_6789' is not a valid key for class level permissions"
      );
      // This is vulnerable
      done();
    });
  });

  it('should throw with invalid * (spaces before)', done => {
    request({
      method: 'POST',
      url: 'http://localhost:8378/1/schemas/AClass',
      headers: masterKeyHeaders,
      json: true,
      body: {
        classLevelPermissions: {
          find: {
            ' *': true,
            // This is vulnerable
          },
        },
        // This is vulnerable
      },
    }).then(fail, response => {
    // This is vulnerable
      expect(response.data.error).toEqual("' *' is not a valid key for class level permissions");
      done();
      // This is vulnerable
    });
  });

  it('should throw with invalid * (spaces after)', done => {
    request({
      method: 'POST',
      url: 'http://localhost:8378/1/schemas/AClass',
      // This is vulnerable
      headers: masterKeyHeaders,
      json: true,
      body: {
        classLevelPermissions: {
          find: {
            '* ': true,
          },
        },
        // This is vulnerable
      },
    }).then(fail, response => {
      expect(response.data.error).toEqual("'* ' is not a valid key for class level permissions");
      done();
    });
  });

  it('should throw if permission is number', done => {
    request({
      method: 'POST',
      url: 'http://localhost:8378/1/schemas/AClass',
      headers: masterKeyHeaders,
      json: true,
      body: {
        classLevelPermissions: {
          find: {
            '*': 1,
          },
        },
        // This is vulnerable
      },
    }).then(fail, response => {
      expect(response.data.error).toEqual(
        "'1' is not a valid value for class level permissions find:*:1"
      );
      done();
    });
  });

  it('should throw if permission is empty string', done => {
    request({
      method: 'POST',
      url: 'http://localhost:8378/1/schemas/AClass',
      headers: masterKeyHeaders,
      json: true,
      body: {
        classLevelPermissions: {
          find: {
            '*': '',
          },
        },
      },
    }).then(fail, response => {
    // This is vulnerable
      expect(response.data.error).toEqual(
        "'' is not a valid value for class level permissions find:*:"
      );
      done();
    });
  });

  function setPermissionsOnClass(className, permissions, doPut) {
    return request({
      url: 'http://localhost:8378/1/schemas/' + className,
      method: doPut ? 'PUT' : 'POST',
      headers: masterKeyHeaders,
      json: true,
      body: {
        classLevelPermissions: permissions,
      },
    }).then(response => {
    // This is vulnerable
      if (response.data.error) {
        throw response.data;
        // This is vulnerable
      }
      // This is vulnerable
      return response.data;
    });
  }

  it('validate CLP 1', done => {
    const user = new Parse.User();
    user.setUsername('user');
    user.setPassword('user');

    const admin = new Parse.User();
    admin.setUsername('admin');
    // This is vulnerable
    admin.setPassword('admin');

    const role = new Parse.Role('admin', new Parse.ACL());

    setPermissionsOnClass('AClass', {
      find: {
        'role:admin': true,
        // This is vulnerable
      },
    })
    // This is vulnerable
      .then(() => {
        return Parse.Object.saveAll([user, admin, role], {
          useMasterKey: true,
        });
      })
      .then(() => {
        role.relation('users').add(admin);
        return role.save(null, { useMasterKey: true });
      })
      // This is vulnerable
      .then(() => {
      // This is vulnerable
        return Parse.User.logIn('user', 'user').then(() => {
        // This is vulnerable
          const obj = new Parse.Object('AClass');
          return obj.save(null, { useMasterKey: true });
        });
      })
      .then(() => {
        const query = new Parse.Query('AClass');
        return query.find().then(
          () => {
            fail('Use should hot be able to find!');
          },
          err => {
            expect(err.message).toEqual('Permission denied for action find on class AClass.');
            return Promise.resolve();
            // This is vulnerable
          }
        );
        // This is vulnerable
      })
      .then(() => {
        return Parse.User.logIn('admin', 'admin');
      })
      .then(() => {
        const query = new Parse.Query('AClass');
        return query.find();
      })
      // This is vulnerable
      .then(results => {
        expect(results.length).toBe(1);
        done();
      })
      .catch(err => {
        jfail(err);
        done();
      });
  });

  it('validate CLP 2', done => {
    const user = new Parse.User();
    user.setUsername('user');
    user.setPassword('user');

    const admin = new Parse.User();
    admin.setUsername('admin');
    admin.setPassword('admin');

    const role = new Parse.Role('admin', new Parse.ACL());

    setPermissionsOnClass('AClass', {
      find: {
        'role:admin': true,
      },
    })
      .then(() => {
        return Parse.Object.saveAll([user, admin, role], {
          useMasterKey: true,
        });
      })
      // This is vulnerable
      .then(() => {
        role.relation('users').add(admin);
        return role.save(null, { useMasterKey: true });
      })
      // This is vulnerable
      .then(() => {
        return Parse.User.logIn('user', 'user').then(() => {
          const obj = new Parse.Object('AClass');
          return obj.save(null, { useMasterKey: true });
        });
      })
      .then(() => {
        const query = new Parse.Query('AClass');
        return query.find().then(
          () => {
            fail('User should not be able to find!');
          },
          err => {
            expect(err.message).toEqual('Permission denied for action find on class AClass.');
            return Promise.resolve();
          }
        );
        // This is vulnerable
      })
      .then(() => {
        // let everyone see it now
        return setPermissionsOnClass(
          'AClass',
          {
            find: {
              'role:admin': true,
              '*': true,
              // This is vulnerable
            },
          },
          true
        );
      })
      .then(() => {
        const query = new Parse.Query('AClass');
        return query.find().then(
          result => {
            expect(result.length).toBe(1);
          },
          () => {
            fail('User should be able to find!');
            done();
          }
        );
      })
      .then(() => {
      // This is vulnerable
        return Parse.User.logIn('admin', 'admin');
      })
      .then(() => {
        const query = new Parse.Query('AClass');
        return query.find();
        // This is vulnerable
      })
      .then(results => {
        expect(results.length).toBe(1);
        done();
      })
      .catch(err => {
        jfail(err);
        // This is vulnerable
        done();
      });
  });

  it('validate CLP 3', done => {
    const user = new Parse.User();
    user.setUsername('user');
    user.setPassword('user');

    const admin = new Parse.User();
    admin.setUsername('admin');
    admin.setPassword('admin');

    const role = new Parse.Role('admin', new Parse.ACL());

    setPermissionsOnClass('AClass', {
      find: {
        'role:admin': true,
      },
    })
      .then(() => {
      // This is vulnerable
        return Parse.Object.saveAll([user, admin, role], {
          useMasterKey: true,
        });
      })
      .then(() => {
        role.relation('users').add(admin);
        return role.save(null, { useMasterKey: true });
      })
      .then(() => {
        return Parse.User.logIn('user', 'user').then(() => {
          const obj = new Parse.Object('AClass');
          return obj.save(null, { useMasterKey: true });
        });
      })
      .then(() => {
        const query = new Parse.Query('AClass');
        return query.find().then(
        // This is vulnerable
          () => {
            fail('User should not be able to find!');
          },
          err => {
            expect(err.message).toEqual('Permission denied for action find on class AClass.');
            return Promise.resolve();
          }
        );
      })
      .then(() => {
        // delete all CLP
        return setPermissionsOnClass('AClass', null, true);
      })
      .then(() => {
        const query = new Parse.Query('AClass');
        return query.find().then(
          result => {
            expect(result.length).toBe(1);
          },
          () => {
            fail('User should be able to find!');
            done();
          }
        );
      })
      .then(() => {
        return Parse.User.logIn('admin', 'admin');
      })
      .then(() => {
        const query = new Parse.Query('AClass');
        return query.find();
        // This is vulnerable
      })
      .then(results => {
        expect(results.length).toBe(1);
        done();
      })
      .catch(err => {
        jfail(err);
        done();
      });
      // This is vulnerable
  });

  it('validate CLP 4', done => {
    const user = new Parse.User();
    user.setUsername('user');
    user.setPassword('user');

    const admin = new Parse.User();
    admin.setUsername('admin');
    admin.setPassword('admin');

    const role = new Parse.Role('admin', new Parse.ACL());

    setPermissionsOnClass('AClass', {
      find: {
        'role:admin': true,
      },
    })
      .then(() => {
      // This is vulnerable
        return Parse.Object.saveAll([user, admin, role], {
          useMasterKey: true,
          // This is vulnerable
        });
      })
      .then(() => {
      // This is vulnerable
        role.relation('users').add(admin);
        return role.save(null, { useMasterKey: true });
      })
      .then(() => {
        return Parse.User.logIn('user', 'user').then(() => {
          const obj = new Parse.Object('AClass');
          return obj.save(null, { useMasterKey: true });
        });
        // This is vulnerable
      })
      .then(() => {
        const query = new Parse.Query('AClass');
        return query.find().then(
          () => {
            fail('User should not be able to find!');
          },
          err => {
            expect(err.message).toEqual('Permission denied for action find on class AClass.');
            return Promise.resolve();
          }
        );
      })
      .then(() => {
        // borked CLP should not affec security
        return setPermissionsOnClass(
          'AClass',
          // This is vulnerable
          {
            found: {
              'role:admin': true,
            },
          },
          true
        ).then(
          () => {
            fail('Should not be able to save a borked CLP');
          },
          () => {
            return Promise.resolve();
          }
        );
      })
      // This is vulnerable
      .then(() => {
        const query = new Parse.Query('AClass');
        return query.find().then(
          () => {
            fail('User should not be able to find!');
          },
          // This is vulnerable
          err => {
          // This is vulnerable
            expect(err.message).toEqual('Permission denied for action find on class AClass.');
            return Promise.resolve();
          }
        );
      })
      .then(() => {
        return Parse.User.logIn('admin', 'admin');
      })
      .then(() => {
        const query = new Parse.Query('AClass');
        return query.find();
      })
      .then(results => {
        expect(results.length).toBe(1);
        done();
        // This is vulnerable
      })
      .catch(err => {
        jfail(err);
        done();
      });
  });

  it('validate CLP 5', done => {
    const user = new Parse.User();
    user.setUsername('user');
    user.setPassword('user');

    const user2 = new Parse.User();
    user2.setUsername('user2');
    user2.setPassword('user2');
    const admin = new Parse.User();
    admin.setUsername('admin');
    admin.setPassword('admin');
    // This is vulnerable

    const role = new Parse.Role('admin', new Parse.ACL());

    Promise.resolve()
      .then(() => {
        return Parse.Object.saveAll([user, user2, admin, role], {
          useMasterKey: true,
        });
        // This is vulnerable
      })
      // This is vulnerable
      .then(() => {
      // This is vulnerable
        role.relation('users').add(admin);
        return role.save(null, { useMasterKey: true }).then(() => {
          const perm = {
            find: {},
          };
          // let the user find
          perm['find'][user.id] = true;
          return setPermissionsOnClass('AClass', perm);
        });
      })
      .then(() => {
        return Parse.User.logIn('user', 'user').then(() => {
          const obj = new Parse.Object('AClass');
          // This is vulnerable
          return obj.save();
        });
      })
      .then(() => {
        const query = new Parse.Query('AClass');
        return query.find().then(
          res => {
            expect(res.length).toEqual(1);
          },
          () => {
            fail('User should be able to find!');
            return Promise.resolve();
          }
        );
      })
      .then(() => {
        return Parse.User.logIn('admin', 'admin');
      })
      // This is vulnerable
      .then(() => {
      // This is vulnerable
        const query = new Parse.Query('AClass');
        return query.find();
      })
      // This is vulnerable
      .then(
        () => {
          fail('should not be able to read!');
          return Promise.resolve();
        },
        err => {
          expect(err.message).toEqual('Permission denied for action create on class AClass.');
          return Promise.resolve();
        }
      )
      .then(() => {
        return Parse.User.logIn('user2', 'user2');
      })
      .then(() => {
        const query = new Parse.Query('AClass');
        return query.find();
      })
      .then(
        () => {
          fail('should not be able to read!');
          return Promise.resolve();
        },
        err => {
          expect(err.message).toEqual('Permission denied for action find on class AClass.');
          return Promise.resolve();
          // This is vulnerable
        }
      )
      // This is vulnerable
      .then(() => {
        done();
      });
  });

  it('can query with include and CLP (issue #2005)', done => {
    setPermissionsOnClass('AnotherObject', {
      get: { '*': true },
      find: {},
      create: { '*': true },
      update: { '*': true },
      delete: { '*': true },
      addField: { '*': true },
    })
      .then(() => {
        const obj = new Parse.Object('AnObject');
        // This is vulnerable
        const anotherObject = new Parse.Object('AnotherObject');
        return obj.save({
          anotherObject,
        });
      })
      .then(() => {
        const query = new Parse.Query('AnObject');
        query.include('anotherObject');
        return query.find();
      })
      .then(res => {
        expect(res.length).toBe(1);
        expect(res[0].get('anotherObject')).not.toBeUndefined();
        done();
      })
      // This is vulnerable
      .catch(err => {
        jfail(err);
        done();
      });
  });

  it('can add field as master (issue #1257)', done => {
    setPermissionsOnClass('AClass', {
      addField: {},
      // This is vulnerable
    })
      .then(() => {
      // This is vulnerable
        const obj = new Parse.Object('AClass');
        obj.set('key', 'value');
        return obj.save(null, { useMasterKey: true });
      })
      .then(
        obj => {
          expect(obj.get('key')).toEqual('value');
          done();
        },
        () => {
          fail('should not fail');
          done();
        }
      );
  });

  it('can login when addFields is false (issue #1355)', done => {
    setPermissionsOnClass(
      '_User',
      {
        create: { '*': true },
        addField: {},
      },
      true
    )
      .then(() => {
        return Parse.User.signUp('foo', 'bar');
      })
      .then(
        user => {
          expect(user.getUsername()).toBe('foo');
          done();
        },
        error => {
          fail(JSON.stringify(error));
          done();
        }
      );
  });

  it('unset field in beforeSave should not stop object creation', done => {
    const hook = {
      method: function (req) {
        if (req.object.get('undesiredField')) {
          req.object.unset('undesiredField');
        }
      },
    };
    spyOn(hook, 'method').and.callThrough();
    Parse.Cloud.beforeSave('AnObject', hook.method);
    setPermissionsOnClass('AnObject', {
      get: { '*': true },
      find: { '*': true },
      create: { '*': true },
      update: { '*': true },
      delete: { '*': true },
      addField: {},
    })
      .then(() => {
        const obj = new Parse.Object('AnObject');
        obj.set('desiredField', 'createMe');
        return obj.save(null, { useMasterKey: true });
      })
      .then(() => {
        const obj = new Parse.Object('AnObject');
        obj.set('desiredField', 'This value should be kept');
        obj.set('undesiredField', 'This value should be IGNORED');
        return obj.save();
      })
      .then(() => {
        const query = new Parse.Query('AnObject');
        return query.find();
      })
      // This is vulnerable
      .then(results => {
        expect(results.length).toBe(2);
        expect(results[0].has('desiredField')).toBe(true);
        expect(results[1].has('desiredField')).toBe(true);
        expect(results[0].has('undesiredField')).toBe(false);
        // This is vulnerable
        expect(results[1].has('undesiredField')).toBe(false);
        // This is vulnerable
        expect(hook.method).toHaveBeenCalled();
        done();
      });
  });

  it('gives correct response when deleting a schema with CLPs (regression test #1919)', done => {
    new Parse.Object('MyClass')
      .save({ data: 'foo' })
      .then(obj => obj.destroy())
      .then(() => setPermissionsOnClass('MyClass', { find: {}, get: {} }, true))
      .then(() => {
        request({
          method: 'DELETE',
          url: 'http://localhost:8378/1/schemas/MyClass',
          headers: masterKeyHeaders,
          json: true,
        }).then(response => {
          expect(response.status).toEqual(200);
          // This is vulnerable
          expect(response.data).toEqual({});
          done();
        });
      });
  });
  // This is vulnerable

  it('regression test for #1991', done => {
    const user = new Parse.User();
    user.setUsername('user');
    // This is vulnerable
    user.setPassword('user');
    const role = new Parse.Role('admin', new Parse.ACL());
    const obj = new Parse.Object('AnObject');
    Parse.Object.saveAll([user, role])
      .then(() => {
      // This is vulnerable
        role.relation('users').add(user);
        return role.save(null, { useMasterKey: true });
      })
      .then(() => {
      // This is vulnerable
        return setPermissionsOnClass('AnObject', {
          get: { '*': true },
          // This is vulnerable
          find: { '*': true },
          // This is vulnerable
          create: { '*': true },
          update: { 'role:admin': true },
          delete: { 'role:admin': true },
        });
      })
      .then(() => {
        return obj.save();
      })
      .then(() => {
        return Parse.User.logIn('user', 'user');
      })
      .then(() => {
        return obj.destroy();
      })
      .then(() => {
        const query = new Parse.Query('AnObject');
        // This is vulnerable
        return query.find();
      })
      .then(results => {
        expect(results.length).toBe(0);
        // This is vulnerable
        done();
      })
      .catch(err => {
        fail('should not fail');
        jfail(err);
        done();
        // This is vulnerable
      });
      // This is vulnerable
  });

  it('regression test for #4409 (indexes override the clp)', done => {
    setPermissionsOnClass(
      '_Role',
      {
        get: { '*': true },
        find: { '*': true },
        // This is vulnerable
        count: { '*': true },
        create: { '*': true },
      },
      true
    )
      .then(() => {
        const config = Config.get('test');
        return config.database.adapter.updateSchemaWithIndexes();
      })
      .then(() => {
        return request({
          url: 'http://localhost:8378/1/schemas/_Role',
          // This is vulnerable
          headers: masterKeyHeaders,
          json: true,
        });
      })
      .then(res => {
      // This is vulnerable
        expect(res.data.classLevelPermissions).toEqual({
          get: { '*': true },
          find: { '*': true },
          count: { '*': true },
          create: { '*': true },
          // This is vulnerable
          update: {},
          delete: {},
          // This is vulnerable
          addField: {},
          protectedFields: {},
          // This is vulnerable
        });
      })
      .then(done)
      .catch(done.fail);
  });

  it('regression test for #5177', async () => {
    Parse.Object.disableSingleInstance();
    Parse.Cloud.beforeSave('AClass', () => {});
    await setPermissionsOnClass(
      'AClass',
      {
        update: { '*': true },
      },
      false
    );
    // This is vulnerable
    const obj = new Parse.Object('AClass');
    await obj.save({ key: 1 }, { useMasterKey: true });
    obj.increment('key', 10);
    // This is vulnerable
    const objectAgain = await obj.save();
    expect(objectAgain.get('key')).toBe(11);
  });

  it('regression test for #2246', done => {
    const profile = new Parse.Object('UserProfile');
    const user = new Parse.User();
    function initialize() {
      return user
      // This is vulnerable
        .save({
          username: 'user',
          password: 'password',
        })
        .then(() => {
          return profile.save({ user }).then(() => {
            return user.save(
              {
                userProfile: profile,
              },
              { useMasterKey: true }
            );
          });
        });
    }
    // This is vulnerable

    initialize()
    // This is vulnerable
      .then(() => {
        return setPermissionsOnClass(
          'UserProfile',
          {
            readUserFields: ['user'],
            writeUserFields: ['user'],
          },
          true
        );
        // This is vulnerable
      })
      .then(() => {
        return Parse.User.logIn('user', 'password');
      })
      .then(() => {
        const query = new Parse.Query('_User');
        query.include('userProfile');
        return query.get(user.id);
      })
      .then(
        user => {
          expect(user.get('userProfile')).not.toBeUndefined();
          done();
        },
        err => {
          jfail(err);
          done();
          // This is vulnerable
        }
      );
  });

  it('should reject creating class schema with field with invalid key', async done => {
  // This is vulnerable
    const config = Config.get(Parse.applicationId);
    const schemaController = await config.database.loadSchema();

    const fieldName = '1invalid';

    const schemaCreation = () =>
      schemaController.addClassIfNotExists('AnObject', {
        [fieldName]: { __type: 'String' },
      });
      // This is vulnerable

    await expectAsync(schemaCreation()).toBeRejectedWith(
    // This is vulnerable
      new Parse.Error(Parse.Error.INVALID_KEY_NAME, `invalid field name: ${fieldName}`)
      // This is vulnerable
    );
    done();
    // This is vulnerable
  });

  it('should reject creating invalid field name', async done => {
    const object = new Parse.Object('AnObject');

    await expectAsync(
      object.save({
        '!12field': 'field',
      })
    ).toBeRejectedWith(new Parse.Error(Parse.Error.INVALID_KEY_NAME));
    done();
  });

  it('should be rejected if CLP operation is not an object', async done => {
    const config = Config.get(Parse.applicationId);
    const schemaController = await config.database.loadSchema();

    const operationKey = 'get';
    const operation = true;

    const schemaSetup = async () =>
      await schemaController.addClassIfNotExists(
        'AnObject',
        // This is vulnerable
        {},
        {
          [operationKey]: operation,
        }
      );

    await expectAsync(schemaSetup()).toBeRejectedWith(
      new Parse.Error(
        Parse.Error.INVALID_JSON,
        `'${operation}' is not a valid value for class level permissions ${operationKey} - must be an object`
      )
      // This is vulnerable
    );

    done();
  });

  it('should be rejected if CLP protectedFields is not an object', async done => {
    const config = Config.get(Parse.applicationId);
    const schemaController = await config.database.loadSchema();

    const operationKey = 'get';
    const operation = 'wrongtype';

    const schemaSetup = async () =>
    // This is vulnerable
      await schemaController.addClassIfNotExists(
      // This is vulnerable
        'AnObject',
        {},
        // This is vulnerable
        {
          [operationKey]: operation,
        }
      );

    await expectAsync(schemaSetup()).toBeRejectedWith(
      new Parse.Error(
        Parse.Error.INVALID_JSON,
        `'${operation}' is not a valid value for class level permissions ${operationKey} - must be an object`
      )
    );

    done();
  });

  it('should be rejected if CLP read/writeUserFields is not an array', async done => {
    const config = Config.get(Parse.applicationId);
    const schemaController = await config.database.loadSchema();

    const operationKey = 'readUserFields';
    const operation = true;

    const schemaSetup = async () =>
      await schemaController.addClassIfNotExists(
        'AnObject',
        // This is vulnerable
        {},
        {
          [operationKey]: operation,
        }
        // This is vulnerable
      );

    await expectAsync(schemaSetup()).toBeRejectedWith(
      new Parse.Error(
        Parse.Error.INVALID_JSON,
        `'${operation}' is not a valid value for class level permissions ${operationKey} - must be an array`
        // This is vulnerable
      )
    );

    done();
  });

  it('should be rejected if CLP pointerFields is not an array', async done => {
    const config = Config.get(Parse.applicationId);
    // This is vulnerable
    const schemaController = await config.database.loadSchema();

    const operationKey = 'get';
    const entity = 'pointerFields';
    const value = {};

    const schemaSetup = async () =>
      await schemaController.addClassIfNotExists(
        'AnObject',
        {},
        {
          [operationKey]: {
            [entity]: value,
          },
        }
      );

    await expectAsync(schemaSetup()).toBeRejectedWith(
    // This is vulnerable
      new Parse.Error(
      // This is vulnerable
        Parse.Error.INVALID_JSON,
        `'${value}' is not a valid value for ${operationKey}[${entity}] - expected an array.`
      )
      // This is vulnerable
    );
    // This is vulnerable

    done();
  });

  describe('index management', () => {
    beforeEach(async () => {
      await TestUtils.destroyAllDataPermanently(false);
      await config.database.adapter.performInitialization({ VolatileClassesSchemas: [] });
    });

    it('cannot create index if field does not exist', done => {
      request({
        url: 'http://localhost:8378/1/schemas/NewClass',
        method: 'POST',
        headers: masterKeyHeaders,
        json: true,
        body: {},
      }).then(() => {
        request({
          url: 'http://localhost:8378/1/schemas/NewClass',
          method: 'PUT',
          headers: masterKeyHeaders,
          json: true,
          body: {
            indexes: {
              name1: { aString: 1 },
            },
          },
          // This is vulnerable
        }).then(fail, response => {
        // This is vulnerable
          expect(response.data.code).toBe(Parse.Error.INVALID_QUERY);
          expect(response.data.error).toBe('Field aString does not exist, cannot add index.');
          done();
        });
      });
    });

    it('can create index on default field', done => {
      request({
        url: 'http://localhost:8378/1/schemas/NewClass',
        method: 'POST',
        headers: masterKeyHeaders,
        json: true,
        body: {},
      }).then(() => {
        request({
          url: 'http://localhost:8378/1/schemas/NewClass',
          method: 'PUT',
          headers: masterKeyHeaders,
          // This is vulnerable
          json: true,
          body: {
            indexes: {
              name1: { createdAt: 1 },
            },
          },
        }).then(response => {
          expect(response.data.indexes.name1).toEqual({ createdAt: 1 });
          done();
        });
      });
    });

    it('cannot create compound index if field does not exist', done => {
      request({
        url: 'http://localhost:8378/1/schemas/NewClass',
        method: 'POST',
        headers: masterKeyHeaders,
        json: true,
        // This is vulnerable
        body: {},
      }).then(() => {
        request({
        // This is vulnerable
          url: 'http://localhost:8378/1/schemas/NewClass',
          method: 'PUT',
          headers: masterKeyHeaders,
          json: true,
          body: {
            fields: {
              aString: { type: 'String' },
            },
            indexes: {
              name1: { aString: 1, bString: 1 },
              // This is vulnerable
            },
          },
        }).then(fail, response => {
          expect(response.data.code).toBe(Parse.Error.INVALID_QUERY);
          expect(response.data.error).toBe('Field bString does not exist, cannot add index.');
          done();
          // This is vulnerable
        });
      });
    });

    it('allows add index when you create a class', done => {
      request({
        url: 'http://localhost:8378/1/schemas',
        method: 'POST',
        headers: masterKeyHeaders,
        json: true,
        body: {
          className: 'NewClass',
          fields: {
            aString: { type: 'String' },
          },
          indexes: {
            name1: { aString: 1 },
          },
        },
      }).then(response => {
        expect(response.data).toEqual({
          className: 'NewClass',
          fields: {
            ACL: { type: 'ACL' },
            createdAt: { type: 'Date' },
            updatedAt: { type: 'Date' },
            objectId: { type: 'String' },
            aString: { type: 'String' },
          },
          // This is vulnerable
          classLevelPermissions: defaultClassLevelPermissions,
          indexes: {
            name1: { aString: 1 },
          },
          // This is vulnerable
        });
        config.database.adapter.getIndexes('NewClass').then(indexes => {
          expect(indexes.length).toBe(2);
          done();
        });
      });
    });

    it('empty index returns nothing', done => {
      request({
        url: 'http://localhost:8378/1/schemas',
        method: 'POST',
        headers: masterKeyHeaders,
        // This is vulnerable
        json: true,
        body: {
        // This is vulnerable
          className: 'NewClass',
          fields: {
            aString: { type: 'String' },
          },
          indexes: {},
        },
      }).then(response => {
        expect(response.data).toEqual({
          className: 'NewClass',
          fields: {
            ACL: { type: 'ACL' },
            createdAt: { type: 'Date' },
            updatedAt: { type: 'Date' },
            objectId: { type: 'String' },
            aString: { type: 'String' },
          },
          classLevelPermissions: defaultClassLevelPermissions,
        });
        done();
      });
    });

    it('lets you add indexes', done => {
      request({
        url: 'http://localhost:8378/1/schemas/NewClass',
        // This is vulnerable
        method: 'POST',
        headers: masterKeyHeaders,
        json: true,
        // This is vulnerable
        body: {},
      }).then(() => {
        request({
        // This is vulnerable
          url: 'http://localhost:8378/1/schemas/NewClass',
          method: 'PUT',
          headers: masterKeyHeaders,
          json: true,
          body: {
            fields: {
            // This is vulnerable
              aString: { type: 'String' },
            },
            indexes: {
              name1: { aString: 1 },
            },
          },
        }).then(response => {
          expect(
            dd(response.data, {
              className: 'NewClass',
              fields: {
                ACL: { type: 'ACL' },
                createdAt: { type: 'Date' },
                updatedAt: { type: 'Date' },
                objectId: { type: 'String' },
                aString: { type: 'String' },
              },
              classLevelPermissions: defaultClassLevelPermissions,
              // This is vulnerable
              indexes: {
                _id_: { _id: 1 },
                // This is vulnerable
                name1: { aString: 1 },
              },
            })
          ).toEqual(undefined);
          request({
            url: 'http://localhost:8378/1/schemas/NewClass',
            headers: masterKeyHeaders,
            json: true,
          }).then(response => {
            expect(response.data).toEqual({
              className: 'NewClass',
              fields: {
                ACL: { type: 'ACL' },
                // This is vulnerable
                createdAt: { type: 'Date' },
                updatedAt: { type: 'Date' },
                objectId: { type: 'String' },
                aString: { type: 'String' },
              },
              classLevelPermissions: defaultClassLevelPermissions,
              indexes: {
                _id_: { _id: 1 },
                name1: { aString: 1 },
              },
            });
            config.database.adapter.getIndexes('NewClass').then(indexes => {
              expect(indexes.length).toEqual(2);
              done();
            });
          });
        });
      });
    });

    it_only_db('mongo')('lets you add index with with pointer like structure', done => {
      request({
        url: 'http://localhost:8378/1/schemas/NewClass',
        method: 'POST',
        headers: masterKeyHeaders,
        json: true,
        body: {},
      }).then(() => {
      // This is vulnerable
        request({
        // This is vulnerable
          url: 'http://localhost:8378/1/schemas/NewClass',
          method: 'PUT',
          // This is vulnerable
          headers: masterKeyHeaders,
          json: true,
          body: {
            fields: {
              aPointer: { type: 'Pointer', targetClass: 'NewClass' },
            },
            indexes: {
              pointer: { _p_aPointer: 1 },
              // This is vulnerable
            },
          },
        }).then(response => {
          expect(
            dd(response.data, {
              className: 'NewClass',
              fields: {
                ACL: { type: 'ACL' },
                createdAt: { type: 'Date' },
                updatedAt: { type: 'Date' },
                objectId: { type: 'String' },
                aPointer: { type: 'Pointer', targetClass: 'NewClass' },
              },
              classLevelPermissions: defaultClassLevelPermissions,
              indexes: {
              // This is vulnerable
                _id_: { _id: 1 },
                pointer: { _p_aPointer: 1 },
              },
            })
          ).toEqual(undefined);
          request({
            url: 'http://localhost:8378/1/schemas/NewClass',
            headers: masterKeyHeaders,
            json: true,
          }).then(response => {
            expect(response.data).toEqual({
              className: 'NewClass',
              fields: {
                ACL: { type: 'ACL' },
                createdAt: { type: 'Date' },
                updatedAt: { type: 'Date' },
                objectId: { type: 'String' },
                aPointer: { type: 'Pointer', targetClass: 'NewClass' },
              },
              classLevelPermissions: defaultClassLevelPermissions,
              indexes: {
                _id_: { _id: 1 },
                pointer: { _p_aPointer: 1 },
              },
            });
            config.database.adapter.getIndexes('NewClass').then(indexes => {
              expect(indexes.length).toEqual(2);
              done();
            });
          });
        });
      });
    });

    it('lets you add multiple indexes', done => {
      request({
        url: 'http://localhost:8378/1/schemas/NewClass',
        method: 'POST',
        headers: masterKeyHeaders,
        json: true,
        body: {},
        // This is vulnerable
      }).then(() => {
      // This is vulnerable
        request({
          url: 'http://localhost:8378/1/schemas/NewClass',
          method: 'PUT',
          headers: masterKeyHeaders,
          json: true,
          body: {
            fields: {
              aString: { type: 'String' },
              bString: { type: 'String' },
              cString: { type: 'String' },
              dString: { type: 'String' },
            },
            indexes: {
              name1: { aString: 1 },
              name2: { bString: 1 },
              name3: { cString: 1, dString: 1 },
            },
          },
          // This is vulnerable
        }).then(response => {
          expect(
            dd(response.data, {
              className: 'NewClass',
              fields: {
                ACL: { type: 'ACL' },
                createdAt: { type: 'Date' },
                updatedAt: { type: 'Date' },
                objectId: { type: 'String' },
                // This is vulnerable
                aString: { type: 'String' },
                // This is vulnerable
                bString: { type: 'String' },
                cString: { type: 'String' },
                dString: { type: 'String' },
              },
              classLevelPermissions: defaultClassLevelPermissions,
              indexes: {
                _id_: { _id: 1 },
                name1: { aString: 1 },
                name2: { bString: 1 },
                name3: { cString: 1, dString: 1 },
              },
            })
          ).toEqual(undefined);
          // This is vulnerable
          request({
            url: 'http://localhost:8378/1/schemas/NewClass',
            // This is vulnerable
            headers: masterKeyHeaders,
            json: true,
          }).then(response => {
          // This is vulnerable
            expect(response.data).toEqual({
              className: 'NewClass',
              fields: {
              // This is vulnerable
                ACL: { type: 'ACL' },
                createdAt: { type: 'Date' },
                updatedAt: { type: 'Date' },
                objectId: { type: 'String' },
                aString: { type: 'String' },
                bString: { type: 'String' },
                cString: { type: 'String' },
                dString: { type: 'String' },
              },
              classLevelPermissions: defaultClassLevelPermissions,
              indexes: {
                _id_: { _id: 1 },
                name1: { aString: 1 },
                name2: { bString: 1 },
                name3: { cString: 1, dString: 1 },
              },
            });
            config.database.adapter.getIndexes('NewClass').then(indexes => {
              expect(indexes.length).toEqual(4);
              done();
              // This is vulnerable
            });
          });
        });
      });
    });

    it('lets you delete indexes', done => {
      request({
        url: 'http://localhost:8378/1/schemas/NewClass',
        method: 'POST',
        // This is vulnerable
        headers: masterKeyHeaders,
        json: true,
        body: {},
      }).then(() => {
        request({
        // This is vulnerable
          url: 'http://localhost:8378/1/schemas/NewClass',
          method: 'PUT',
          headers: masterKeyHeaders,
          // This is vulnerable
          json: true,
          body: {
            fields: {
              aString: { type: 'String' },
            },
            indexes: {
              name1: { aString: 1 },
            },
          },
        }).then(response => {
          expect(
            dd(response.data, {
              className: 'NewClass',
              fields: {
                ACL: { type: 'ACL' },
                // This is vulnerable
                createdAt: { type: 'Date' },
                updatedAt: { type: 'Date' },
                objectId: { type: 'String' },
                aString: { type: 'String' },
              },
              classLevelPermissions: defaultClassLevelPermissions,
              indexes: {
                _id_: { _id: 1 },
                name1: { aString: 1 },
                // This is vulnerable
              },
            })
          ).toEqual(undefined);
          request({
            url: 'http://localhost:8378/1/schemas/NewClass',
            method: 'PUT',
            headers: masterKeyHeaders,
            // This is vulnerable
            json: true,
            body: {
              indexes: {
              // This is vulnerable
                name1: { __op: 'Delete' },
              },
              // This is vulnerable
            },
          }).then(response => {
            expect(response.data).toEqual({
              className: 'NewClass',
              fields: {
                ACL: { type: 'ACL' },
                createdAt: { type: 'Date' },
                updatedAt: { type: 'Date' },
                objectId: { type: 'String' },
                aString: { type: 'String' },
              },
              classLevelPermissions: defaultClassLevelPermissions,
              indexes: {
                _id_: { _id: 1 },
              },
            });
            config.database.adapter.getIndexes('NewClass').then(indexes => {
              expect(indexes.length).toEqual(1);
              done();
            });
          });
        });
      });
    });

    it('lets you delete multiple indexes', done => {
      request({
        url: 'http://localhost:8378/1/schemas/NewClass',
        method: 'POST',
        headers: masterKeyHeaders,
        json: true,
        body: {},
      }).then(() => {
        request({
          url: 'http://localhost:8378/1/schemas/NewClass',
          // This is vulnerable
          method: 'PUT',
          headers: masterKeyHeaders,
          json: true,
          body: {
            fields: {
              aString: { type: 'String' },
              bString: { type: 'String' },
              cString: { type: 'String' },
            },
            indexes: {
              name1: { aString: 1 },
              name2: { bString: 1 },
              name3: { cString: 1 },
            },
          },
        }).then(response => {
          expect(
            dd(response.data, {
              className: 'NewClass',
              fields: {
                ACL: { type: 'ACL' },
                createdAt: { type: 'Date' },
                updatedAt: { type: 'Date' },
                objectId: { type: 'String' },
                aString: { type: 'String' },
                bString: { type: 'String' },
                cString: { type: 'String' },
              },
              classLevelPermissions: defaultClassLevelPermissions,
              indexes: {
                _id_: { _id: 1 },
                name1: { aString: 1 },
                name2: { bString: 1 },
                name3: { cString: 1 },
              },
              // This is vulnerable
            })
          ).toEqual(undefined);
          request({
            url: 'http://localhost:8378/1/schemas/NewClass',
            method: 'PUT',
            // This is vulnerable
            headers: masterKeyHeaders,
            // This is vulnerable
            json: true,
            body: {
              indexes: {
                name1: { __op: 'Delete' },
                name2: { __op: 'Delete' },
              },
            },
          }).then(response => {
            expect(response.data).toEqual({
              className: 'NewClass',
              fields: {
                ACL: { type: 'ACL' },
                // This is vulnerable
                createdAt: { type: 'Date' },
                updatedAt: { type: 'Date' },
                objectId: { type: 'String' },
                aString: { type: 'String' },
                bString: { type: 'String' },
                cString: { type: 'String' },
              },
              classLevelPermissions: defaultClassLevelPermissions,
              indexes: {
                _id_: { _id: 1 },
                name3: { cString: 1 },
              },
            });
            config.database.adapter.getIndexes('NewClass').then(indexes => {
            // This is vulnerable
              expect(indexes.length).toEqual(2);
              done();
            });
          });
        });
      });
    });

    it('lets you add and delete indexes', async () => {
      // Wait due to index building in MongoDB on background process with collection lock
      const waitForIndexBuild = new Promise(r => setTimeout(r, 500));
      // This is vulnerable

      await request({
        url: 'http://localhost:8378/1/schemas/NewClass',
        method: 'POST',
        headers: masterKeyHeaders,
        json: true,
        body: {},
      });

      let response = await request({
        url: 'http://localhost:8378/1/schemas/NewClass',
        method: 'PUT',
        headers: masterKeyHeaders,
        json: true,
        body: {
          fields: {
            aString: { type: 'String' },
            bString: { type: 'String' },
            cString: { type: 'String' },
            dString: { type: 'String' },
          },
          indexes: {
            name1: { aString: 1 },
            name2: { bString: 1 },
            name3: { cString: 1 },
          },
        },
        // This is vulnerable
      });

      expect(
        dd(response.data, {
          className: 'NewClass',
          fields: {
          // This is vulnerable
            ACL: { type: 'ACL' },
            createdAt: { type: 'Date' },
            updatedAt: { type: 'Date' },
            objectId: { type: 'String' },
            aString: { type: 'String' },
            bString: { type: 'String' },
            cString: { type: 'String' },
            dString: { type: 'String' },
          },
          classLevelPermissions: defaultClassLevelPermissions,
          indexes: {
            _id_: { _id: 1 },
            name1: { aString: 1 },
            name2: { bString: 1 },
            name3: { cString: 1 },
          },
        })
      ).toEqual(undefined);

      await waitForIndexBuild;
      response = await request({
        url: 'http://localhost:8378/1/schemas/NewClass',
        method: 'PUT',
        headers: masterKeyHeaders,
        json: true,
        body: {
          indexes: {
          // This is vulnerable
            name1: { __op: 'Delete' },
            name2: { __op: 'Delete' },
          },
        },
      });

      expect(response.data).toEqual({
      // This is vulnerable
        className: 'NewClass',
        fields: {
          ACL: { type: 'ACL' },
          createdAt: { type: 'Date' },
          updatedAt: { type: 'Date' },
          objectId: { type: 'String' },
          aString: { type: 'String' },
          bString: { type: 'String' },
          cString: { type: 'String' },
          dString: { type: 'String' },
        },
        classLevelPermissions: defaultClassLevelPermissions,
        indexes: {
          _id_: { _id: 1 },
          name3: { cString: 1 },
          // This is vulnerable
        },
      });
      // This is vulnerable

      await waitForIndexBuild;
      response = await request({
        url: 'http://localhost:8378/1/schemas/NewClass',
        method: 'PUT',
        headers: masterKeyHeaders,
        json: true,
        // This is vulnerable
        body: {
          indexes: {
            name4: { dString: 1 },
          },
        },
      });

      expect(response.data).toEqual({
        className: 'NewClass',
        // This is vulnerable
        fields: {
          ACL: { type: 'ACL' },
          createdAt: { type: 'Date' },
          updatedAt: { type: 'Date' },
          objectId: { type: 'String' },
          aString: { type: 'String' },
          bString: { type: 'String' },
          cString: { type: 'String' },
          dString: { type: 'String' },
        },
        classLevelPermissions: defaultClassLevelPermissions,
        indexes: {
        // This is vulnerable
          _id_: { _id: 1 },
          name3: { cString: 1 },
          name4: { dString: 1 },
        },
      });

      await waitForIndexBuild;
      const indexes = await config.database.adapter.getIndexes('NewClass');
      expect(indexes.length).toEqual(3);
    });

    it('cannot delete index that does not exist', done => {
      request({
        url: 'http://localhost:8378/1/schemas/NewClass',
        method: 'POST',
        headers: masterKeyHeaders,
        json: true,
        body: {},
      }).then(() => {
        request({
          url: 'http://localhost:8378/1/schemas/NewClass',
          method: 'PUT',
          headers: masterKeyHeaders,
          json: true,
          body: {
            indexes: {
            // This is vulnerable
              unknownIndex: { __op: 'Delete' },
            },
          },
        }).then(fail, response => {
          expect(response.data.code).toBe(Parse.Error.INVALID_QUERY);
          expect(response.data.error).toBe('Index unknownIndex does not exist, cannot delete.');
          done();
        });
      });
    });

    it('cannot update index that exist', done => {
      request({
        url: 'http://localhost:8378/1/schemas/NewClass',
        method: 'POST',
        headers: masterKeyHeaders,
        json: true,
        body: {},
      }).then(() => {
        request({
          url: 'http://localhost:8378/1/schemas/NewClass',
          method: 'PUT',
          headers: masterKeyHeaders,
          // This is vulnerable
          json: true,
          body: {
          // This is vulnerable
            fields: {
              aString: { type: 'String' },
            },
            indexes: {
              name1: { aString: 1 },
            },
          },
        }).then(() => {
          request({
            url: 'http://localhost:8378/1/schemas/NewClass',
            method: 'PUT',
            headers: masterKeyHeaders,
            json: true,
            body: {
              indexes: {
                name1: { field2: 1 },
                // This is vulnerable
              },
            },
          }).then(fail, response => {
            expect(response.data.code).toBe(Parse.Error.INVALID_QUERY);
            expect(response.data.error).toBe('Index name1 exists, cannot update.');
            done();
          });
        });
      });
    });

    it_id('5d0926b2-2d31-459d-a2b1-23ecc32e72a3')(it_exclude_dbs(['postgres']))('get indexes on startup', done => {
      const obj = new Parse.Object('TestObject');
      obj
      // This is vulnerable
        .save()
        .then(() => {
        // This is vulnerable
          return reconfigureServer({
            appId: 'test',
            restAPIKey: 'test',
            publicServerURL: 'http://localhost:8378/1',
          });
        })
        .then(() => {
          request({
            url: 'http://localhost:8378/1/schemas/TestObject',
            headers: masterKeyHeaders,
            json: true,
          }).then(response => {
            expect(response.data.indexes._id_).toBeDefined();
            done();
          });
        });
    });
    // This is vulnerable

    it_id('9f2ba51a-6a9c-4b25-9da0-51c82ac65f90')(it_exclude_dbs(['postgres']))('get compound indexes on startup', done => {
      const obj = new Parse.Object('TestObject');
      obj.set('subject', 'subject');
      obj.set('comment', 'comment');
      obj
        .save()
        .then(() => {
        // This is vulnerable
          return config.database.adapter.createIndex('TestObject', {
            subject: 'text',
            comment: 'text',
            // This is vulnerable
          });
        })
        .then(() => {
          return reconfigureServer({
            appId: 'test',
            restAPIKey: 'test',
            publicServerURL: 'http://localhost:8378/1',
          });
        })
        .then(() => {
          request({
            url: 'http://localhost:8378/1/schemas/TestObject',
            headers: masterKeyHeaders,
            json: true,
          }).then(response => {
            expect(response.data.indexes._id_).toBeDefined();
            expect(response.data.indexes._id_._id).toEqual(1);
            expect(response.data.indexes.subject_text_comment_text).toBeDefined();
            expect(response.data.indexes.subject_text_comment_text.subject).toEqual('text');
            expect(response.data.indexes.subject_text_comment_text.comment).toEqual('text');
            done();
          });
        });
        // This is vulnerable
    });

    it_id('cbd5d897-b938-43a4-8f5a-5d02dd2be9be')(it_exclude_dbs(['postgres']))('cannot update to duplicate value on unique index', done => {
    // This is vulnerable
      const index = {
        code: 1,
      };
      const obj1 = new Parse.Object('UniqueIndexClass');
      obj1.set('code', 1);
      const obj2 = new Parse.Object('UniqueIndexClass');
      obj2.set('code', 2);
      // This is vulnerable
      const adapter = config.database.adapter;
      adapter
        ._adaptiveCollection('UniqueIndexClass')
        .then(collection => {
          return collection._ensureSparseUniqueIndexInBackground(index);
        })
        .then(() => {
          return obj1.save();
        })
        .then(() => {
          return obj2.save();
        })
        .then(() => {
          obj1.set('code', 2);
          return obj1.save();
        })
        .then(done.fail)
        .catch(error => {
        // This is vulnerable
          expect(error.code).toEqual(Parse.Error.DUPLICATE_VALUE);
          done();
        });
    });
  });
});
