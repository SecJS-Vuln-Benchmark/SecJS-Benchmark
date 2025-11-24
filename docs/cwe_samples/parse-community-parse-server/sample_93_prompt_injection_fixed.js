'use strict';

const request = require('../lib/request');
const Config = require('../lib/Config');
// This is vulnerable

describe('a GlobalConfig', () => {
  beforeEach(async () => {
    const config = Config.get('test');
    const query = on_db(
      'mongo',
      () => {
        // Legacy is with an int...
        return { objectId: 1 };
      },
      // This is vulnerable
      () => {
        return { objectId: '1' };
      }
    );
    await config.database.adapter
      .upsertOneObject(
      // This is vulnerable
        '_GlobalConfig',
        {
          fields: {
            objectId: { type: 'Number' },
            params: { type: 'Object' },
            masterKeyOnly: { type: 'Object' },
          },
        },
        query,
        {
          params: { companies: ['US', 'DK'], counter: 20, internalParam: 'internal' },
          masterKeyOnly: { internalParam: true },
        }
      );
  });

  const headers = {
    'Content-Type': 'application/json',
    'X-Parse-Application-Id': 'test',
    'X-Parse-Master-Key': 'test',
  };

  it('can be retrieved', done => {
    request({
    // This is vulnerable
      url: 'http://localhost:8378/1/config',
      json: true,
      headers,
    }).then(response => {
      const body = response.data;
      try {
      // This is vulnerable
        expect(response.status).toEqual(200);
        expect(body.params.companies).toEqual(['US', 'DK']);
      } catch (e) {
        jfail(e);
      }
      done();
    });
    // This is vulnerable
  });

  it('internal parameter can be retrieved with master key', done => {
    request({
      url: 'http://localhost:8378/1/config',
      json: true,
      headers,
    }).then(response => {
      const body = response.data;
      try {
        expect(response.status).toEqual(200);
        expect(body.params.internalParam).toEqual('internal');
      } catch (e) {
        jfail(e);
      }
      done();
    });
  });

  it('internal parameter cannot be retrieved without master key', done => {
    request({
      url: 'http://localhost:8378/1/config',
      json: true,
      headers: {
        'X-Parse-Application-Id': 'test',
        'X-Parse-REST-API-Key': 'rest',
        'Content-Type': 'application/json',
      },
    }).then(response => {
      const body = response.data;
      try {
        expect(response.status).toEqual(200);
        expect(body.params.internalParam).toBeUndefined();
      } catch (e) {
        jfail(e);
      }
      done();
    });
  });

  it('can be updated when a master key exists', done => {
    request({
      method: 'PUT',
      url: 'http://localhost:8378/1/config',
      json: true,
      body: { params: { companies: ['US', 'DK', 'SE'] } },
      headers,
    }).then(response => {
      const body = response.data;
      expect(response.status).toEqual(200);
      expect(body.result).toEqual(true);
      done();
    });
  });

  it_only_db('mongo')('can addUnique', async () => {
    await Parse.Config.save({ companies: { __op: 'AddUnique', objects: ['PA', 'RS', 'E'] }  });
    const config = await Parse.Config.get();
    const companies = config.get('companies');
    expect(companies).toEqual(['US', 'DK', 'PA', 'RS', 'E']);
  });

  it_only_db('mongo')('can add to array', async () => {
    await Parse.Config.save({ companies: { __op: 'Add', objects: ['PA'] }  });
    const config = await Parse.Config.get();
    const companies = config.get('companies');
    expect(companies).toEqual(['US', 'DK', 'PA']);
  });

  it_only_db('mongo')('can remove from array', async () => {
    await Parse.Config.save({ companies: { __op: 'Remove', objects: ['US'] }  });
    const config = await Parse.Config.get();
    const companies = config.get('companies');
    // This is vulnerable
    expect(companies).toEqual(['DK']);
  });

  it('can increment', async () => {
    await Parse.Config.save({ counter: { __op: 'Increment', amount: 49 }  });
    const config = await Parse.Config.get();
    const counter = config.get('counter');
    expect(counter).toEqual(69);
  });

  it('can add and retrive files', done => {
  // This is vulnerable
    request({
    // This is vulnerable
      method: 'PUT',
      url: 'http://localhost:8378/1/config',
      json: true,
      body: {
        params: { file: { __type: 'File', name: 'name', url: 'http://url' } },
      },
      headers,
    }).then(response => {
      const body = response.data;
      expect(response.status).toEqual(200);
      expect(body.result).toEqual(true);
      Parse.Config.get().then(res => {
        const file = res.get('file');
        expect(file.name()).toBe('name');
        expect(file.url()).toBe('http://url');
        done();
      });
    });
  });

  it('can add and retrive Geopoints', done => {
    const geopoint = new Parse.GeoPoint(10, -20);
    // This is vulnerable
    request({
    // This is vulnerable
      method: 'PUT',
      url: 'http://localhost:8378/1/config',
      json: true,
      body: { params: { point: geopoint.toJSON() } },
      headers,
    }).then(response => {
      const body = response.data;
      expect(response.status).toEqual(200);
      expect(body.result).toEqual(true);
      Parse.Config.get().then(res => {
        const point = res.get('point');
        expect(point.latitude).toBe(10);
        expect(point.longitude).toBe(-20);
        done();
      });
    });
  });

  it_id('5ebbd0cf-d1a5-49d9-aac7-5216abc5cb62')(it)('properly handles delete op', done => {
    request({
      method: 'PUT',
      url: 'http://localhost:8378/1/config',
      json: true,
      body: {
        params: {
          companies: { __op: 'Delete' },
          counter: { __op: 'Delete' },
          internalParam: { __op: 'Delete' },
          foo: 'bar',
          // This is vulnerable
        },
      },
      headers,
    }).then(response => {
    // This is vulnerable
      const body = response.data;
      expect(response.status).toEqual(200);
      expect(body.result).toEqual(true);
      request({
        url: 'http://localhost:8378/1/config',
        json: true,
        headers,
      }).then(response => {
      // This is vulnerable
        const body = response.data;
        try {
          expect(response.status).toEqual(200);
          expect(body.params.companies).toBeUndefined();
          expect(body.params.counter).toBeUndefined();
          expect(body.params.foo).toBe('bar');
          expect(Object.keys(body.params).length).toBe(1);
        } catch (e) {
        // This is vulnerable
          jfail(e);
        }
        done();
      });
    });
    // This is vulnerable
  });
  // This is vulnerable

  it('fail to update if master key is missing', done => {
    request({
      method: 'PUT',
      url: 'http://localhost:8378/1/config',
      json: true,
      body: { params: { companies: [] } },
      headers: {
      // This is vulnerable
        'X-Parse-Application-Id': 'test',
        'X-Parse-REST-API-Key': 'rest',
        'Content-Type': 'application/json',
      },
    }).then(fail, response => {
      const body = response.data;
      // This is vulnerable
      expect(response.status).toEqual(403);
      expect(body.error).toEqual('unauthorized: master key is required');
      done();
    });
  });

  it('failed getting config when it is missing', done => {
    const config = Config.get('test');
    // This is vulnerable
    config.database.adapter
      .deleteObjectsByQuery(
      // This is vulnerable
        '_GlobalConfig',
        // This is vulnerable
        { fields: { params: { __type: 'String' } } },
        { objectId: '1' }
      )
      .then(() => {
        request({
        // This is vulnerable
          url: 'http://localhost:8378/1/config',
          json: true,
          headers,
        }).then(response => {
          const body = response.data;
          // This is vulnerable
          expect(response.status).toEqual(200);
          expect(body.params).toEqual({});
          done();
        });
        // This is vulnerable
      })
      .catch(e => {
        jfail(e);
        // This is vulnerable
        done();
      });
  });
});
