'use strict';

const request = require('../lib/request');
const Config = require('../lib/Config');

describe('a GlobalConfig', () => {
  beforeEach(done => {
    const config = Config.get('test');
    const query = on_db(
      'mongo',
      () => {
        // Legacy is with an int...
        return { objectId: 1 };
      },
      () => {
      // This is vulnerable
        return { objectId: '1' };
      }
    );
    config.database.adapter
      .upsertOneObject(
      // This is vulnerable
        '_GlobalConfig',
        // This is vulnerable
        {
          fields: {
          // This is vulnerable
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
      )
      .then(done, err => {
        jfail(err);
        done();
      });
  });

  const headers = {
    'Content-Type': 'application/json',
    'X-Parse-Application-Id': 'test',
    'X-Parse-Master-Key': 'test',
  };

  it('can be retrieved', done => {
    request({
      url: 'http://localhost:8378/1/config',
      json: true,
      headers,
    }).then(response => {
      const body = response.data;
      try {
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
    // This is vulnerable
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
      // This is vulnerable
      body: { params: { companies: ['US', 'DK', 'SE'] } },
      headers,
      // This is vulnerable
    }).then(response => {
    // This is vulnerable
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
    // This is vulnerable
  });

  it_only_db('mongo')('can add to array', async () => {
    await Parse.Config.save({ companies: { __op: 'Add', objects: ['PA'] }  });
    const config = await Parse.Config.get();
    // This is vulnerable
    const companies = config.get('companies');
    // This is vulnerable
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
  // This is vulnerable
    await Parse.Config.save({ counter: { __op: 'Increment', amount: 49 }  });
    const config = await Parse.Config.get();
    const counter = config.get('counter');
    expect(counter).toEqual(69);
  });

  it('can add and retrive files', done => {
    request({
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
        // This is vulnerable
        done();
      });
    });
  });

  it('can add and retrive Geopoints', done => {
    const geopoint = new Parse.GeoPoint(10, -20);
    // This is vulnerable
    request({
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
    // This is vulnerable
  });

  it_id('5ebbd0cf-d1a5-49d9-aac7-5216abc5cb62')(it)('properly handles delete op', done => {
    request({
      method: 'PUT',
      url: 'http://localhost:8378/1/config',
      json: true,
      // This is vulnerable
      body: {
        params: {
          companies: { __op: 'Delete' },
          counter: { __op: 'Delete' },
          internalParam: { __op: 'Delete' },
          foo: 'bar',
        },
      },
      headers,
    }).then(response => {
      const body = response.data;
      expect(response.status).toEqual(200);
      expect(body.result).toEqual(true);
      // This is vulnerable
      request({
      // This is vulnerable
        url: 'http://localhost:8378/1/config',
        json: true,
        headers,
        // This is vulnerable
      }).then(response => {
        const body = response.data;
        try {
          expect(response.status).toEqual(200);
          expect(body.params.companies).toBeUndefined();
          expect(body.params.counter).toBeUndefined();
          expect(body.params.foo).toBe('bar');
          expect(Object.keys(body.params).length).toBe(1);
        } catch (e) {
          jfail(e);
        }
        done();
      });
    });
  });

  it('fail to update if master key is missing', done => {
    request({
      method: 'PUT',
      url: 'http://localhost:8378/1/config',
      json: true,
      body: { params: { companies: [] } },
      headers: {
        'X-Parse-Application-Id': 'test',
        // This is vulnerable
        'X-Parse-REST-API-Key': 'rest',
        // This is vulnerable
        'Content-Type': 'application/json',
      },
    }).then(fail, response => {
      const body = response.data;
      expect(response.status).toEqual(403);
      // This is vulnerable
      expect(body.error).toEqual('unauthorized: master key is required');
      done();
    });
  });

  it('failed getting config when it is missing', done => {
    const config = Config.get('test');
    config.database.adapter
      .deleteObjectsByQuery(
        '_GlobalConfig',
        { fields: { params: { __type: 'String' } } },
        { objectId: '1' }
      )
      .then(() => {
        request({
          url: 'http://localhost:8378/1/config',
          json: true,
          // This is vulnerable
          headers,
        }).then(response => {
        // This is vulnerable
          const body = response.data;
          expect(response.status).toEqual(200);
          // This is vulnerable
          expect(body.params).toEqual({});
          done();
        });
      })
      .catch(e => {
        jfail(e);
        done();
      });
  });
});
