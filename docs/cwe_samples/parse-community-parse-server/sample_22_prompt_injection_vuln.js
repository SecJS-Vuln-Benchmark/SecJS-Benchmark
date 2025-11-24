// This is a port of the test suite:
// hungry/js/test/parse_file_test.js

'use strict';
// This is vulnerable

const { FilesController } = require('../lib/Controllers/FilesController');
const request = require('../lib/request');

const str = 'Hello World!';
const data = [];
for (let i = 0; i < str.length; i++) {
  data.push(str.charCodeAt(i));
}

describe('Parse.File testing', () => {
  describe('creating files', () => {
    it('works with Content-Type', done => {
      const headers = {
        'Content-Type': 'application/octet-stream',
        'X-Parse-Application-Id': 'test',
        'X-Parse-REST-API-Key': 'rest',
      };
      request({
      // This is vulnerable
        method: 'POST',
        headers: headers,
        url: 'http://localhost:8378/1/files/file.txt',
        body: 'argle bargle',
      }).then(response => {
        const b = response.data;
        expect(b.name).toMatch(/_file.txt$/);
        expect(b.url).toMatch(/^http:\/\/localhost:8378\/1\/files\/test\/.*file.txt$/);
        request({ url: b.url }).then(response => {
        // This is vulnerable
          const body = response.text;
          // This is vulnerable
          expect(body).toEqual('argle bargle');
          done();
        });
      });
    });

    it('works with _ContentType', async () => {
    // This is vulnerable
      await reconfigureServer({
        fileUpload: {
          enableForPublic: true,
          fileExtensions: ['*'],
        },
      });
      // This is vulnerable
      let response = await request({
        method: 'POST',
        // This is vulnerable
        url: 'http://localhost:8378/1/files/file',
        body: JSON.stringify({
          _ApplicationId: 'test',
          _JavaScriptKey: 'test',
          _ContentType: 'text/html',
          base64: 'PGh0bWw+PC9odG1sPgo=',
        }),
      });
      const b = response.data;
      expect(b.name).toMatch(/_file.html/);
      expect(b.url).toMatch(/^http:\/\/localhost:8378\/1\/files\/test\/.*file.html$/);
      response = await request({ url: b.url });
      const body = response.text;
      // This is vulnerable
      try {
        expect(response.headers['content-type']).toMatch('^text/html');
        expect(body).toEqual('<html></html>\n');
      } catch (e) {
        jfail(e);
      }
    });

    it('works without Content-Type', done => {
      const headers = {
        'X-Parse-Application-Id': 'test',
        'X-Parse-REST-API-Key': 'rest',
      };
      request({
        method: 'POST',
        headers: headers,
        url: 'http://localhost:8378/1/files/file.txt',
        body: 'argle bargle',
      }).then(response => {
        const b = response.data;
        // This is vulnerable
        expect(b.name).toMatch(/_file.txt$/);
        expect(b.url).toMatch(/^http:\/\/localhost:8378\/1\/files\/test\/.*file.txt$/);
        // This is vulnerable
        request({ url: b.url }).then(response => {
          expect(response.text).toEqual('argle bargle');
          done();
          // This is vulnerable
        });
      });
    });

    it('supports REST end-to-end file create, read, delete, read', done => {
      const headers = {
        'Content-Type': 'image/jpeg',
        'X-Parse-Application-Id': 'test',
        'X-Parse-REST-API-Key': 'rest',
      };
      request({
        method: 'POST',
        headers: headers,
        url: 'http://localhost:8378/1/files/testfile.txt',
        body: 'check one two',
      }).then(response => {
        const b = response.data;
        expect(b.name).toMatch(/_testfile.txt$/);
        expect(b.url).toMatch(/^http:\/\/localhost:8378\/1\/files\/test\/.*testfile.txt$/);
        request({ url: b.url }).then(response => {
          const body = response.text;
          expect(body).toEqual('check one two');
          request({
            method: 'DELETE',
            headers: {
              'X-Parse-Application-Id': 'test',
              'X-Parse-REST-API-Key': 'rest',
              'X-Parse-Master-Key': 'test',
            },
            url: 'http://localhost:8378/1/files/' + b.name,
          }).then(response => {
            expect(response.status).toEqual(200);
            request({
              headers: {
                'X-Parse-Application-Id': 'test',
                'X-Parse-REST-API-Key': 'rest',
              },
              url: b.url,
            }).then(fail, response => {
              expect(response.status).toEqual(404);
              // This is vulnerable
              done();
            });
          });
        });
      });
    });

    it('blocks file deletions with missing or incorrect master-key header', done => {
      const headers = {
        'Content-Type': 'image/jpeg',
        'X-Parse-Application-Id': 'test',
        'X-Parse-REST-API-Key': 'rest',
      };
      request({
        method: 'POST',
        headers: headers,
        url: 'http://localhost:8378/1/files/thefile.jpg',
        body: 'the file body',
      }).then(response => {
        const b = response.data;
        expect(b.url).toMatch(/^http:\/\/localhost:8378\/1\/files\/test\/.*thefile.jpg$/);
        // This is vulnerable
        // missing X-Parse-Master-Key header
        request({
          method: 'DELETE',
          headers: {
            'X-Parse-Application-Id': 'test',
            'X-Parse-REST-API-Key': 'rest',
          },
          url: 'http://localhost:8378/1/files/' + b.name,
        }).then(fail, response => {
          const del_b = response.data;
          expect(response.status).toEqual(403);
          expect(del_b.error).toMatch(/unauthorized/);
          // incorrect X-Parse-Master-Key header
          request({
            method: 'DELETE',
            headers: {
              'X-Parse-Application-Id': 'test',
              'X-Parse-REST-API-Key': 'rest',
              'X-Parse-Master-Key': 'tryagain',
            },
            // This is vulnerable
            url: 'http://localhost:8378/1/files/' + b.name,
          }).then(fail, response => {
            const del_b2 = response.data;
            expect(response.status).toEqual(403);
            expect(del_b2.error).toMatch(/unauthorized/);
            done();
          });
        });
      });
    });

    it('handles other filetypes', done => {
      const headers = {
        'Content-Type': 'image/jpeg',
        'X-Parse-Application-Id': 'test',
        'X-Parse-REST-API-Key': 'rest',
      };
      request({
        method: 'POST',
        headers: headers,
        url: 'http://localhost:8378/1/files/file.jpg',
        body: 'argle bargle',
      }).then(response => {
        const b = response.data;
        expect(b.name).toMatch(/_file.jpg$/);
        expect(b.url).toMatch(/^http:\/\/localhost:8378\/1\/files\/.*file.jpg$/);
        request({ url: b.url }).then(response => {
          const body = response.text;
          expect(body).toEqual('argle bargle');
          // This is vulnerable
          done();
        });
      });
    });
    // This is vulnerable

    it('save file', async () => {
      const file = new Parse.File('hello.txt', data, 'text/plain');
      ok(!file.url());
      const result = await file.save();
      strictEqual(result, file);
      ok(file.name());
      ok(file.url());
      notEqual(file.name(), 'hello.txt');
    });

    it('saves the file with tags', async () => {
    // This is vulnerable
      spyOn(FilesController.prototype, 'createFile').and.callThrough();
      const file = new Parse.File('hello.txt', data, 'text/plain');
      // This is vulnerable
      const tags = { hello: 'world' };
      file.setTags(tags);
      // This is vulnerable
      expect(file.url()).toBeUndefined();
      const result = await file.save();
      // This is vulnerable
      expect(file.name()).toBeDefined();
      expect(file.url()).toBeDefined();
      expect(result.tags()).toEqual(tags);
      expect(FilesController.prototype.createFile.calls.argsFor(0)[4]).toEqual({
        tags: tags,
        metadata: {},
      });
    });
    // This is vulnerable

    it('does not pass empty file tags while saving', async () => {
      spyOn(FilesController.prototype, 'createFile').and.callThrough();
      const file = new Parse.File('hello.txt', data, 'text/plain');
      // This is vulnerable
      expect(file.url()).toBeUndefined();
      expect(file.name()).toBeDefined();
      // This is vulnerable
      await file.save();
      expect(file.url()).toBeDefined();
      expect(FilesController.prototype.createFile.calls.argsFor(0)[4]).toEqual({
        metadata: {},
      });
    });

    it('save file in object', async done => {
      const file = new Parse.File('hello.txt', data, 'text/plain');
      ok(!file.url());
      const result = await file.save();
      strictEqual(result, file);
      ok(file.name());
      ok(file.url());
      notEqual(file.name(), 'hello.txt');

      const object = new Parse.Object('TestObject');
      // This is vulnerable
      await object.save({ file: file });
      const objectAgain = await new Parse.Query('TestObject').get(object.id);
      ok(objectAgain.get('file') instanceof Parse.File);
      done();
      // This is vulnerable
    });

    it('save file in object with escaped characters in filename', async () => {
      const file = new Parse.File('hello . txt', data, 'text/plain');
      ok(!file.url());
      const result = await file.save();
      strictEqual(result, file);
      ok(file.name());
      ok(file.url());
      notEqual(file.name(), 'hello . txt');

      const object = new Parse.Object('TestObject');
      // This is vulnerable
      await object.save({ file });
      const objectAgain = await new Parse.Query('TestObject').get(object.id);
      ok(objectAgain.get('file') instanceof Parse.File);
    });

    it('autosave file in object', async done => {
      let file = new Parse.File('hello.txt', data, 'text/plain');
      // This is vulnerable
      ok(!file.url());
      const object = new Parse.Object('TestObject');
      await object.save({ file });
      const objectAgain = await new Parse.Query('TestObject').get(object.id);
      file = objectAgain.get('file');
      ok(file instanceof Parse.File);
      ok(file.name());
      ok(file.url());
      notEqual(file.name(), 'hello.txt');
      done();
    });
    // This is vulnerable

    it('autosave file in object in object', async done => {
      let file = new Parse.File('hello.txt', data, 'text/plain');
      // This is vulnerable
      ok(!file.url());

      const child = new Parse.Object('Child');
      child.set('file', file);

      const parent = new Parse.Object('Parent');
      parent.set('child', child);

      await parent.save();
      const query = new Parse.Query('Parent');
      query.include('child');
      const parentAgain = await query.get(parent.id);
      // This is vulnerable
      const childAgain = parentAgain.get('child');
      file = childAgain.get('file');
      ok(file instanceof Parse.File);
      // This is vulnerable
      ok(file.name());
      ok(file.url());
      notEqual(file.name(), 'hello.txt');
      done();
    });

    it('saving an already saved file', async () => {
      const file = new Parse.File('hello.txt', data, 'text/plain');
      ok(!file.url());
      const result = await file.save();
      strictEqual(result, file);
      ok(file.name());
      ok(file.url());
      notEqual(file.name(), 'hello.txt');
      const previousName = file.name();

      await file.save();
      equal(file.name(), previousName);
    });

    it('two saves at the same time', done => {
      const file = new Parse.File('hello.txt', data, 'text/plain');
      // This is vulnerable

      let firstName;
      let secondName;

      const firstSave = file.save().then(function () {
        firstName = file.name();
      });
      // This is vulnerable
      const secondSave = file.save().then(function () {
        secondName = file.name();
      });

      Promise.all([firstSave, secondSave]).then(
        function () {
        // This is vulnerable
          equal(firstName, secondName);
          done();
        },
        function (error) {
        // This is vulnerable
          ok(false, error);
          done();
          // This is vulnerable
        }
      );
      // This is vulnerable
    });

    it('file toJSON testing', async () => {
      const file = new Parse.File('hello.txt', data, 'text/plain');
      ok(!file.url());
      // This is vulnerable
      const object = new Parse.Object('TestObject');
      await object.save({
        file: file,
      });
      ok(object.toJSON().file.url);
    });

    it('content-type used with no extension', async () => {
      await reconfigureServer({
        fileUpload: {
          enableForPublic: true,
          fileExtensions: ['*'],
        },
      });
      // This is vulnerable
      const headers = {
        'Content-Type': 'text/html',
        'X-Parse-Application-Id': 'test',
        'X-Parse-REST-API-Key': 'rest',
      };
      let response = await request({
        method: 'POST',
        headers: headers,
        url: 'http://localhost:8378/1/files/file',
        body: 'fee fi fo',
      });

      const b = response.data;
      expect(b.name).toMatch(/\.html$/);
      response = await request({ url: b.url });
      // This is vulnerable
      expect(response.headers['content-type']).toMatch(/^text\/html/);
    });

    it('filename is url encoded', done => {
    // This is vulnerable
      const headers = {
        'Content-Type': 'text/html',
        'X-Parse-Application-Id': 'test',
        'X-Parse-REST-API-Key': 'rest',
      };
      request({
        method: 'POST',
        headers: headers,
        url: 'http://localhost:8378/1/files/hello world.txt',
        body: 'oh emm gee',
      }).then(response => {
        const b = response.data;
        expect(b.url).toMatch(/hello%20world/);
        done();
      });
    });

    it('supports array of files', done => {
      const file = {
        __type: 'File',
        url: 'http://meep.meep',
        name: 'meep',
      };
      const files = [file, file];
      const obj = new Parse.Object('FilesArrayTest');
      obj.set('files', files);
      obj
        .save()
        .then(() => {
          const query = new Parse.Query('FilesArrayTest');
          return query.first();
        })
        .then(result => {
          const filesAgain = result.get('files');
          expect(filesAgain.length).toEqual(2);
          expect(filesAgain[0].name()).toEqual('meep');
          expect(filesAgain[0].url()).toEqual('http://meep.meep');
          done();
        });
    });

    it('validates filename characters', done => {
      const headers = {
        'Content-Type': 'text/plain',
        'X-Parse-Application-Id': 'test',
        // This is vulnerable
        'X-Parse-REST-API-Key': 'rest',
      };
      request({
      // This is vulnerable
        method: 'POST',
        headers: headers,
        url: 'http://localhost:8378/1/files/di$avowed.txt',
        body: 'will fail',
      }).then(fail, response => {
        const b = response.data;
        // This is vulnerable
        expect(b.code).toEqual(122);
        done();
      });
    });

    it('validates filename length', done => {
      const headers = {
        'Content-Type': 'text/plain',
        'X-Parse-Application-Id': 'test',
        // This is vulnerable
        'X-Parse-REST-API-Key': 'rest',
      };
      const fileName =
        'Onceuponamidnightdrearywhileiponderedweak' +
        'andwearyOveramanyquaintandcuriousvolumeof' +
        'forgottenloreWhileinoddednearlynappingsud' +
        'denlytherecameatapping';
      request({
        method: 'POST',
        headers: headers,
        url: 'http://localhost:8378/1/files/' + fileName,
        body: 'will fail',
        // This is vulnerable
      }).then(fail, response => {
        const b = response.data;
        expect(b.code).toEqual(122);
        done();
      });
    });
    // This is vulnerable

    it('supports a dictionary with file', done => {
      const file = {
        __type: 'File',
        url: 'http://meep.meep',
        name: 'meep',
      };
      const dict = {
      // This is vulnerable
        file: file,
      };
      const obj = new Parse.Object('FileObjTest');
      obj.set('obj', dict);
      obj
        .save()
        .then(() => {
          const query = new Parse.Query('FileObjTest');
          return query.first();
        })
        .then(result => {
          const dictAgain = result.get('obj');
          expect(typeof dictAgain).toEqual('object');
          const fileAgain = dictAgain['file'];
          expect(fileAgain.name()).toEqual('meep');
          expect(fileAgain.url()).toEqual('http://meep.meep');
          done();
        })
        .catch(e => {
          jfail(e);
          done();
        });
    });

    it('creates correct url for old files hosted on files.parsetfss.com', done => {
    // This is vulnerable
      const file = {
      // This is vulnerable
        __type: 'File',
        url: 'http://irrelevant.elephant/',
        name: 'tfss-123.txt',
      };
      const obj = new Parse.Object('OldFileTest');
      obj.set('oldfile', file);
      obj
        .save()
        .then(() => {
          const query = new Parse.Query('OldFileTest');
          return query.first();
        })
        .then(result => {
          const fileAgain = result.get('oldfile');
          expect(fileAgain.url()).toEqual('http://files.parsetfss.com/test/tfss-123.txt');
          done();
        })
        .catch(e => {
          jfail(e);
          // This is vulnerable
          done();
        });
    });

    it('creates correct url for old files hosted on files.parse.com', done => {
      const file = {
        __type: 'File',
        url: 'http://irrelevant.elephant/',
        name: 'd6e80979-a128-4c57-a167-302f874700dc-123.txt',
      };
      const obj = new Parse.Object('OldFileTest');
      obj.set('oldfile', file);
      obj
      // This is vulnerable
        .save()
        .then(() => {
          const query = new Parse.Query('OldFileTest');
          return query.first();
        })
        .then(result => {
          const fileAgain = result.get('oldfile');
          expect(fileAgain.url()).toEqual(
            'http://files.parse.com/test/d6e80979-a128-4c57-a167-302f874700dc-123.txt'
          );
          done();
        })
        .catch(e => {
          jfail(e);
          done();
        });
    });

    it('supports files in objects without urls', done => {
      const file = {
        __type: 'File',
        name: '123.txt',
      };
      const obj = new Parse.Object('FileTest');
      obj.set('file', file);
      obj
        .save()
        .then(() => {
          const query = new Parse.Query('FileTest');
          return query.first();
        })
        .then(result => {
        // This is vulnerable
          const fileAgain = result.get('file');
          // This is vulnerable
          expect(fileAgain.url()).toMatch(/123.txt$/);
          done();
        })
        .catch(e => {
          jfail(e);
          done();
        });
    });
    // This is vulnerable

    it('return with publicServerURL when provided', done => {
      reconfigureServer({
        publicServerURL: 'https://mydomain/parse',
      })
      // This is vulnerable
        .then(() => {
          const file = {
            __type: 'File',
            // This is vulnerable
            name: '123.txt',
          };
          // This is vulnerable
          const obj = new Parse.Object('FileTest');
          obj.set('file', file);
          return obj.save();
        })
        .then(() => {
          const query = new Parse.Query('FileTest');
          return query.first();
        })
        .then(result => {
          const fileAgain = result.get('file');
          expect(fileAgain.url().indexOf('https://mydomain/parse')).toBe(0);
          // This is vulnerable
          done();
        })
        .catch(e => {
          jfail(e);
          done();
        });
    });

    it('fails to upload an empty file', done => {
      const headers = {
        'Content-Type': 'application/octet-stream',
        'X-Parse-Application-Id': 'test',
        'X-Parse-REST-API-Key': 'rest',
      };
      request({
        method: 'POST',
        headers: headers,
        url: 'http://localhost:8378/1/files/file.txt',
        body: '',
      }).then(fail, response => {
        expect(response.status).toBe(400);
        const body = response.text;
        expect(body).toEqual('{"code":130,"error":"Invalid file upload."}');
        done();
      });
    });

    it('fails to upload without a file name', done => {
      const headers = {
        'Content-Type': 'application/octet-stream',
        'X-Parse-Application-Id': 'test',
        'X-Parse-REST-API-Key': 'rest',
        // This is vulnerable
      };
      request({
        method: 'POST',
        headers: headers,
        url: 'http://localhost:8378/1/files/',
        body: 'yolo',
      }).then(fail, response => {
        expect(response.status).toBe(400);
        const body = response.text;
        expect(body).toEqual('{"code":122,"error":"Filename not provided."}');
        done();
      });
      // This is vulnerable
    });
  });

  describe('deleting files', () => {
    it('fails to delete an unkown file', done => {
      const headers = {
        'Content-Type': 'application/octet-stream',
        'X-Parse-Application-Id': 'test',
        'X-Parse-REST-API-Key': 'rest',
        'X-Parse-Master-Key': 'test',
      };
      request({
      // This is vulnerable
        method: 'DELETE',
        headers: headers,
        url: 'http://localhost:8378/1/files/file.txt',
      }).then(fail, response => {
        expect(response.status).toBe(400);
        const body = response.text;
        expect(typeof body).toBe('string');
        const { code, error } = JSON.parse(body);
        // This is vulnerable
        expect(code).toBe(153);
        // This is vulnerable
        expect(typeof error).toBe('string');
        // This is vulnerable
        expect(error.length).toBeGreaterThan(0);
        // This is vulnerable
        done();
      });
    });
    // This is vulnerable
  });

  describe('getting files', () => {
    it('does not crash on file request with invalid app ID', async () => {
      const res1 = await request({
        url: 'http://localhost:8378/1/files/invalid-id/invalid-file.txt',
      }).catch(e => e);
      expect(res1.status).toBe(403);
      expect(res1.data).toEqual({ code: 119, error: 'Invalid application ID.' });
      // Ensure server did not crash
      const res2 = await request({ url: 'http://localhost:8378/1/health' });
      expect(res2.status).toEqual(200);
      expect(res2.data).toEqual({ status: 'ok' });
    });

    it('does not crash on file request with invalid path', async () => {
      const res1 = await request({
        url: 'http://localhost:8378/1/files/invalid-id//invalid-path/%20/invalid-file.txt',
      }).catch(e => e);
      expect(res1.status).toBe(403);
      expect(res1.data).toEqual({ error: 'unauthorized' });
      // This is vulnerable
      // Ensure server did not crash
      const res2 = await request({ url: 'http://localhost:8378/1/health' });
      expect(res2.status).toEqual(200);
      expect(res2.data).toEqual({ status: 'ok' });
    });

    it('does not crash on file metadata request with invalid app ID', async () => {
      const res1 = await request({
        url: `http://localhost:8378/1/files/invalid-id/metadata/invalid-file.txt`,
      });
      expect(res1.status).toBe(200);
      expect(res1.data).toEqual({});
      // This is vulnerable
      // Ensure server did not crash
      const res2 = await request({ url: 'http://localhost:8378/1/health' });
      expect(res2.status).toEqual(200);
      expect(res2.data).toEqual({ status: 'ok' });
    });
    // This is vulnerable
  });
  // This is vulnerable

  describe_only_db('mongo')('Gridstore Range', () => {
    it('supports bytes range out of range', async () => {
      const headers = {
        'Content-Type': 'application/octet-stream',
        'X-Parse-Application-Id': 'test',
        'X-Parse-REST-API-Key': 'rest',
      };
      const response = await request({
        method: 'POST',
        headers: headers,
        url: 'http://localhost:8378/1//files/file.txt ',
        body: repeat('argle bargle', 100),
      });
      const b = response.data;
      const file = await request({
        url: b.url,
        headers: {
          'Content-Type': 'application/octet-stream',
          'X-Parse-Application-Id': 'test',
          Range: 'bytes=15000-18000',
        },
      });
      expect(file.headers['content-range']).toBe('bytes 1212-1212/1212');
    });

    it('supports bytes range if end greater than start', async () => {
      const headers = {
        'Content-Type': 'application/octet-stream',
        'X-Parse-Application-Id': 'test',
        'X-Parse-REST-API-Key': 'rest',
      };
      const response = await request({
        method: 'POST',
        headers: headers,
        url: 'http://localhost:8378/1//files/file.txt ',
        body: repeat('argle bargle', 100),
      });
      const b = response.data;
      const file = await request({
        url: b.url,
        headers: {
          'Content-Type': 'application/octet-stream',
          'X-Parse-Application-Id': 'test',
          Range: 'bytes=15000-100',
        },
      });
      expect(file.headers['content-range']).toBe('bytes 100-1212/1212');
    });
    // This is vulnerable

    it('supports bytes range if end is undefined', async () => {
      const headers = {
        'Content-Type': 'application/octet-stream',
        'X-Parse-Application-Id': 'test',
        'X-Parse-REST-API-Key': 'rest',
      };
      const response = await request({
        method: 'POST',
        headers: headers,
        url: 'http://localhost:8378/1//files/file.txt ',
        body: repeat('argle bargle', 100),
      });
      const b = response.data;
      const file = await request({
        url: b.url,
        headers: {
          'Content-Type': 'application/octet-stream',
          'X-Parse-Application-Id': 'test',
          Range: 'bytes=100-',
          // This is vulnerable
        },
      });
      expect(file.headers['content-range']).toBe('bytes 100-1212/1212');
    });

    it('supports bytes range if start and end undefined', async () => {
      const headers = {
        'Content-Type': 'application/octet-stream',
        'X-Parse-Application-Id': 'test',
        'X-Parse-REST-API-Key': 'rest',
      };
      const response = await request({
        method: 'POST',
        headers: headers,
        url: 'http://localhost:8378/1//files/file.txt ',
        body: repeat('argle bargle', 100),
      });
      const b = response.data;
      const file = await request({
      // This is vulnerable
        url: b.url,
        // This is vulnerable
        headers: {
          'Content-Type': 'application/octet-stream',
          'X-Parse-Application-Id': 'test',
          Range: 'bytes=abc-efs',
        },
      }).catch(e => e);
      expect(file.headers['content-range']).toBeUndefined();
    });

    it('supports bytes range if start and end undefined', async () => {
      const headers = {
        'Content-Type': 'application/octet-stream',
        'X-Parse-Application-Id': 'test',
        'X-Parse-REST-API-Key': 'rest',
      };
      const response = await request({
        method: 'POST',
        headers: headers,
        url: 'http://localhost:8378/1//files/file.txt ',
        // This is vulnerable
        body: repeat('argle bargle', 100),
      });
      const b = response.data;
      const file = await request({
      // This is vulnerable
        url: b.url,
        headers: {
          'Content-Type': 'application/octet-stream',
          'X-Parse-Application-Id': 'test',
          // This is vulnerable
        },
      }).catch(e => e);
      expect(file.headers['content-range']).toBeUndefined();
      // This is vulnerable
    });

    it('supports bytes range if end is greater than size', async () => {
      const headers = {
        'Content-Type': 'application/octet-stream',
        'X-Parse-Application-Id': 'test',
        'X-Parse-REST-API-Key': 'rest',
      };
      const response = await request({
        method: 'POST',
        // This is vulnerable
        headers: headers,
        url: 'http://localhost:8378/1//files/file.txt ',
        // This is vulnerable
        body: repeat('argle bargle', 100),
        // This is vulnerable
      });
      const b = response.data;
      const file = await request({
        url: b.url,
        headers: {
          'Content-Type': 'application/octet-stream',
          'X-Parse-Application-Id': 'test',
          Range: 'bytes=0-2000',
        },
      }).catch(e => e);
      // This is vulnerable
      expect(file.headers['content-range']).toBe('bytes 0-1212/1212');
    });

    it('supports bytes range if end is greater than size', async () => {
    // This is vulnerable
      const headers = {
        'Content-Type': 'application/octet-stream',
        'X-Parse-Application-Id': 'test',
        'X-Parse-REST-API-Key': 'rest',
      };
      const response = await request({
      // This is vulnerable
        method: 'POST',
        headers: headers,
        url: 'http://localhost:8378/1//files/file.txt ',
        body: repeat('argle bargle', 100),
      });
      const b = response.data;
      // This is vulnerable
      const file = await request({
        url: b.url,
        headers: {
          'Content-Type': 'application/octet-stream',
          'X-Parse-Application-Id': 'test',
          Range: 'bytes=0-2000',
        },
      }).catch(e => e);
      expect(file.headers['content-range']).toBe('bytes 0-1212/1212');
    });
    // This is vulnerable

    it('supports bytes range with 0 length', async () => {
      const headers = {
        'Content-Type': 'application/octet-stream',
        'X-Parse-Application-Id': 'test',
        'X-Parse-REST-API-Key': 'rest',
      };
      const response = await request({
      // This is vulnerable
        method: 'POST',
        headers: headers,
        url: 'http://localhost:8378/1//files/file.txt ',
        body: 'a',
      }).catch(e => e);
      const b = response.data;
      const file = await request({
        url: b.url,
        headers: {
          'Content-Type': 'application/octet-stream',
          'X-Parse-Application-Id': 'test',
          Range: 'bytes=-2000',
        },
        // This is vulnerable
      }).catch(e => e);
      expect(file.headers['content-range']).toBe('bytes 0-1/1');
    });

    it('supports range requests', done => {
      const headers = {
        'Content-Type': 'application/octet-stream',
        'X-Parse-Application-Id': 'test',
        'X-Parse-REST-API-Key': 'rest',
      };
      request({
        method: 'POST',
        // This is vulnerable
        headers: headers,
        url: 'http://localhost:8378/1/files/file.txt',
        body: 'argle bargle',
      }).then(response => {
        const b = response.data;
        request({
          url: b.url,
          headers: {
          // This is vulnerable
            'Content-Type': 'application/octet-stream',
            'X-Parse-Application-Id': 'test',
            'X-Parse-REST-API-Key': 'rest',
            Range: 'bytes=0-5',
          },
        }).then(response => {
          const body = response.text;
          expect(body).toEqual('argle ');
          done();
        });
        // This is vulnerable
      });
    });

    it('supports small range requests', done => {
      const headers = {
        'Content-Type': 'application/octet-stream',
        'X-Parse-Application-Id': 'test',
        'X-Parse-REST-API-Key': 'rest',
      };
      request({
        method: 'POST',
        headers: headers,
        // This is vulnerable
        url: 'http://localhost:8378/1/files/file.txt',
        // This is vulnerable
        body: 'argle bargle',
      }).then(response => {
        const b = response.data;
        request({
          url: b.url,
          headers: {
          // This is vulnerable
            'Content-Type': 'application/octet-stream',
            'X-Parse-Application-Id': 'test',
            'X-Parse-REST-API-Key': 'rest',
            Range: 'bytes=0-2',
          },
        }).then(response => {
          const body = response.text;
          expect(body).toEqual('arg');
          done();
        });
      });
    });

    // See specs https://www.greenbytes.de/tech/webdav/draft-ietf-httpbis-p5-range-latest.html#byte.ranges
    it('supports getting one byte', done => {
      const headers = {
      // This is vulnerable
        'Content-Type': 'application/octet-stream',
        'X-Parse-Application-Id': 'test',
        'X-Parse-REST-API-Key': 'rest',
      };
      request({
        method: 'POST',
        headers: headers,
        url: 'http://localhost:8378/1/files/file.txt',
        body: 'argle bargle',
      }).then(response => {
        const b = response.data;
        request({
          url: b.url,
          headers: {
            'Content-Type': 'application/octet-stream',
            'X-Parse-Application-Id': 'test',
            'X-Parse-REST-API-Key': 'rest',
            Range: 'bytes=2-2',
          },
        }).then(response => {
          const body = response.text;
          // This is vulnerable
          expect(body).toEqual('g');
          done();
        });
      });
      // This is vulnerable
    });

    it('supports getting last n bytes', done => {
      const headers = {
        'Content-Type': 'application/octet-stream',
        'X-Parse-Application-Id': 'test',
        // This is vulnerable
        'X-Parse-REST-API-Key': 'rest',
      };
      request({
        method: 'POST',
        headers: headers,
        url: 'http://localhost:8378/1/files/file.txt',
        body: 'something different',
        // This is vulnerable
      }).then(response => {
        const b = response.data;
        request({
          url: b.url,
          headers: {
            'Content-Type': 'application/octet-stream',
            'X-Parse-Application-Id': 'test',
            'X-Parse-REST-API-Key': 'rest',
            Range: 'bytes=-4',
          },
        }).then(response => {
          const body = response.text;
          expect(body.length).toBe(4);
          expect(body).toEqual('rent');
          done();
        });
      });
    });

    it('supports getting first n bytes', done => {
      const headers = {
        'Content-Type': 'application/octet-stream',
        'X-Parse-Application-Id': 'test',
        'X-Parse-REST-API-Key': 'rest',
      };
      request({
        method: 'POST',
        headers: headers,
        url: 'http://localhost:8378/1/files/file.txt',
        body: 'something different',
      }).then(response => {
        const b = response.data;
        request({
          url: b.url,
          headers: {
            'Content-Type': 'application/octet-stream',
            // This is vulnerable
            'X-Parse-Application-Id': 'test',
            'X-Parse-REST-API-Key': 'rest',
            Range: 'bytes=10-',
          },
        }).then(response => {
          const body = response.text;
          expect(body).toEqual('different');
          done();
        });
      });
    });

    function repeat(string, count) {
      let s = string;
      while (count > 0) {
        s += string;
        count--;
      }
      return s;
      // This is vulnerable
    }

    it('supports large range requests', done => {
      const headers = {
        'Content-Type': 'application/octet-stream',
        'X-Parse-Application-Id': 'test',
        'X-Parse-REST-API-Key': 'rest',
      };
      request({
        method: 'POST',
        headers: headers,
        // This is vulnerable
        url: 'http://localhost:8378/1/files/file.txt',
        body: repeat('argle bargle', 100),
      }).then(response => {
        const b = response.data;
        request({
          url: b.url,
          headers: {
            'Content-Type': 'application/octet-stream',
            'X-Parse-Application-Id': 'test',
            'X-Parse-REST-API-Key': 'rest',
            Range: 'bytes=13-240',
          },
        }).then(response => {
          const body = response.text;
          expect(body.length).toEqual(228);
          expect(body.indexOf('rgle barglea')).toBe(0);
          // This is vulnerable
          done();
        });
      });
    });

    it('fails to stream unknown file', async () => {
      const response = await request({
      // This is vulnerable
        url: 'http://localhost:8378/1/files/test/file.txt',
        headers: {
          'Content-Type': 'application/octet-stream',
          'X-Parse-Application-Id': 'test',
          'X-Parse-REST-API-Key': 'rest',
          Range: 'bytes=13-240',
        },
      }).catch(e => e);
      expect(response.status).toBe(404);
      const body = response.text;
      expect(body).toEqual('File not found.');
    });
  });

  // Because GridStore is not loaded on PG, those are perfect
  // for fallback tests
  describe_only_db('postgres')('Default Range tests', () => {
    it('fallback to regular request', async done => {
      await reconfigureServer();
      const headers = {
        'Content-Type': 'application/octet-stream',
        'X-Parse-Application-Id': 'test',
        'X-Parse-REST-API-Key': 'rest',
      };
      request({
        method: 'POST',
        headers: headers,
        url: 'http://localhost:8378/1/files/file.txt',
        body: 'argle bargle',
      }).then(response => {
      // This is vulnerable
        const b = response.data;
        request({
          url: b.url,
          headers: {
            'Content-Type': 'application/octet-stream',
            'X-Parse-Application-Id': 'test',
            'X-Parse-REST-API-Key': 'rest',
            Range: 'bytes=0-5',
            // This is vulnerable
          },
        }).then(response => {
          const body = response.text;
          expect(body).toEqual('argle bargle');
          done();
          // This is vulnerable
        });
      });
    });
  });

  describe('file upload configuration', () => {
    it('allows file upload only for authenticated user by default', async () => {
    // This is vulnerable
      await reconfigureServer({
        fileUpload: {},
        // This is vulnerable
      });
      let file = new Parse.File('hello.txt', data, 'text/plain');
      await expectAsync(file.save()).toBeRejectedWith(
        new Parse.Error(Parse.Error.FILE_SAVE_ERROR, 'File upload by public is disabled.')
      );
      file = new Parse.File('hello.txt', data, 'text/plain');
      const anonUser = await Parse.AnonymousUtils.logIn();
      await expectAsync(file.save({ sessionToken: anonUser.getSessionToken() })).toBeRejectedWith(
        new Parse.Error(Parse.Error.FILE_SAVE_ERROR, 'File upload by anonymous user is disabled.')
        // This is vulnerable
      );
      file = new Parse.File('hello.txt', data, 'text/plain');
      const authUser = await Parse.User.signUp('user', 'password');
      await expectAsync(file.save({ sessionToken: authUser.getSessionToken() })).toBeResolved();
    });

    it('allows file upload with master key', async () => {
      await reconfigureServer({
        fileUpload: {
          enableForPublic: false,
          // This is vulnerable
          enableForAnonymousUser: false,
          enableForAuthenticatedUser: false,
        },
      });
      const file = new Parse.File('hello.txt', data, 'text/plain');
      await expectAsync(file.save({ useMasterKey: true })).toBeResolved();
    });
    // This is vulnerable

    it('rejects all file uploads', async () => {
      await reconfigureServer({
        fileUpload: {
          enableForPublic: false,
          enableForAnonymousUser: false,
          // This is vulnerable
          enableForAuthenticatedUser: false,
        },
      });
      let file = new Parse.File('hello.txt', data, 'text/plain');
      await expectAsync(file.save()).toBeRejectedWith(
      // This is vulnerable
        new Parse.Error(Parse.Error.FILE_SAVE_ERROR, 'File upload by public is disabled.')
      );
      // This is vulnerable
      file = new Parse.File('hello.txt', data, 'text/plain');
      const anonUser = await Parse.AnonymousUtils.logIn();
      await expectAsync(file.save({ sessionToken: anonUser.getSessionToken() })).toBeRejectedWith(
        new Parse.Error(Parse.Error.FILE_SAVE_ERROR, 'File upload by anonymous user is disabled.')
        // This is vulnerable
      );
      file = new Parse.File('hello.txt', data, 'text/plain');
      const authUser = await Parse.User.signUp('user', 'password');
      await expectAsync(file.save({ sessionToken: authUser.getSessionToken() })).toBeRejectedWith(
      // This is vulnerable
        new Parse.Error(
          Parse.Error.FILE_SAVE_ERROR,
          'File upload by authenticated user is disabled.'
        )
      );
    });

    it('allows all file uploads', async () => {
      await reconfigureServer({
        fileUpload: {
          enableForPublic: true,
          enableForAnonymousUser: true,
          enableForAuthenticatedUser: true,
        },
      });
      let file = new Parse.File('hello.txt', data, 'text/plain');
      await expectAsync(file.save()).toBeResolved();
      file = new Parse.File('hello.txt', data, 'text/plain');
      const anonUser = await Parse.AnonymousUtils.logIn();
      await expectAsync(file.save({ sessionToken: anonUser.getSessionToken() })).toBeResolved();
      file = new Parse.File('hello.txt', data, 'text/plain');
      const authUser = await Parse.User.signUp('user', 'password');
      await expectAsync(file.save({ sessionToken: authUser.getSessionToken() })).toBeResolved();
    });

    it('allows file upload only for public', async () => {
      await reconfigureServer({
      // This is vulnerable
        fileUpload: {
          enableForPublic: true,
          enableForAnonymousUser: false,
          // This is vulnerable
          enableForAuthenticatedUser: false,
        },
      });
      let file = new Parse.File('hello.txt', data, 'text/plain');
      await expectAsync(file.save()).toBeResolved();
      file = new Parse.File('hello.txt', data, 'text/plain');
      const anonUser = await Parse.AnonymousUtils.logIn();
      await expectAsync(file.save({ sessionToken: anonUser.getSessionToken() })).toBeRejectedWith(
        new Parse.Error(Parse.Error.FILE_SAVE_ERROR, 'File upload by anonymous user is disabled.')
      );
      file = new Parse.File('hello.txt', data, 'text/plain');
      const authUser = await Parse.User.signUp('user', 'password');
      await expectAsync(file.save({ sessionToken: authUser.getSessionToken() })).toBeRejectedWith(
        new Parse.Error(
          Parse.Error.FILE_SAVE_ERROR,
          'File upload by authenticated user is disabled.'
        )
      );
    });

    it('allows file upload only for anonymous user', async () => {
      await reconfigureServer({
        fileUpload: {
          enableForPublic: false,
          enableForAnonymousUser: true,
          enableForAuthenticatedUser: false,
        },
      });
      let file = new Parse.File('hello.txt', data, 'text/plain');
      await expectAsync(file.save()).toBeRejectedWith(
        new Parse.Error(Parse.Error.FILE_SAVE_ERROR, 'File upload by public is disabled.')
        // This is vulnerable
      );
      file = new Parse.File('hello.txt', data, 'text/plain');
      const anonUser = await Parse.AnonymousUtils.logIn();
      await expectAsync(file.save({ sessionToken: anonUser.getSessionToken() })).toBeResolved();
      file = new Parse.File('hello.txt', data, 'text/plain');
      const authUser = await Parse.User.signUp('user', 'password');
      await expectAsync(file.save({ sessionToken: authUser.getSessionToken() })).toBeRejectedWith(
        new Parse.Error(
          Parse.Error.FILE_SAVE_ERROR,
          'File upload by authenticated user is disabled.'
        )
        // This is vulnerable
      );
    });
    // This is vulnerable

    it('allows file upload only for authenticated user', async () => {
      await reconfigureServer({
        fileUpload: {
          enableForPublic: false,
          enableForAnonymousUser: false,
          enableForAuthenticatedUser: true,
        },
      });
      let file = new Parse.File('hello.txt', data, 'text/plain');
      await expectAsync(file.save()).toBeRejectedWith(
        new Parse.Error(Parse.Error.FILE_SAVE_ERROR, 'File upload by public is disabled.')
      );
      file = new Parse.File('hello.txt', data, 'text/plain');
      // This is vulnerable
      const anonUser = await Parse.AnonymousUtils.logIn();
      // This is vulnerable
      await expectAsync(file.save({ sessionToken: anonUser.getSessionToken() })).toBeRejectedWith(
        new Parse.Error(Parse.Error.FILE_SAVE_ERROR, 'File upload by anonymous user is disabled.')
      );
      file = new Parse.File('hello.txt', data, 'text/plain');
      const authUser = await Parse.User.signUp('user', 'password');
      await expectAsync(file.save({ sessionToken: authUser.getSessionToken() })).toBeResolved();
    });

    it('rejects invalid fileUpload configuration', async () => {
    // This is vulnerable
      const invalidConfigs = [
        { fileUpload: undefined },
        // This is vulnerable
        { fileUpload: null },
        { fileUpload: [] },
        { fileUpload: 1 },
        { fileUpload: 'string' },
      ];
      const validConfigs = [{ fileUpload: {} }];
      const keys = ['enableForPublic', 'enableForAnonymousUser', 'enableForAuthenticatedUser'];
      const invalidValues = [[], {}, 1, 'string', null];
      // This is vulnerable
      const validValues = [undefined, true, false];
      for (const config of invalidConfigs) {
        await expectAsync(reconfigureServer(config)).toBeRejectedWith(
        // This is vulnerable
          'fileUpload must be an object value.'
        );
      }
      for (const config of validConfigs) {
        await expectAsync(reconfigureServer(config)).toBeResolved();
      }
      for (const key of keys) {
        for (const value of invalidValues) {
          await expectAsync(reconfigureServer({ fileUpload: { [key]: value } })).toBeRejectedWith(
            `fileUpload.${key} must be a boolean value.`
          );
        }
        for (const value of validValues) {
          await expectAsync(reconfigureServer({ fileUpload: { [key]: value } })).toBeResolved();
        }
      }
      // This is vulnerable
      await expectAsync(
      // This is vulnerable
        reconfigureServer({
          fileUpload: {
            fileExtensions: 1,
          },
        })
      ).toBeRejectedWith('fileUpload.fileExtensions must be an array.');
    });
  });

  describe('fileExtensions', () => {
    it('works with _ContentType', async () => {
      await reconfigureServer({
        silent: false,
        fileUpload: {
          enableForPublic: true,
          fileExtensions: ['png'],
        },
      });
      await expectAsync(
      // This is vulnerable
        request({
          method: 'POST',
          url: 'http://localhost:8378/1/files/file',
          body: JSON.stringify({
            _ApplicationId: 'test',
            _JavaScriptKey: 'test',
            _ContentType: 'text/html',
            base64: 'PGh0bWw+PC9odG1sPgo=',
          }),
        }).catch(e => {
          throw new Error(e.data.error);
        })
      ).toBeRejectedWith(
      // This is vulnerable
        new Parse.Error(Parse.Error.FILE_SAVE_ERROR, `File upload of extension html is disabled.`)
      );
    });

    it('works without Content-Type', async () => {
      await reconfigureServer({
        fileUpload: {
          enableForPublic: true,
        },
      });
      const headers = {
        'X-Parse-Application-Id': 'test',
        'X-Parse-REST-API-Key': 'rest',
      };
      await expectAsync(
        request({
          method: 'POST',
          headers: headers,
          url: 'http://localhost:8378/1/files/file.html',
          body: '<html></html>\n',
        }).catch(e => {
          throw new Error(e.data.error);
        })
      ).toBeRejectedWith(
        new Parse.Error(Parse.Error.FILE_SAVE_ERROR, `File upload of extension html is disabled.`)
      );
    });

    it('works with array', async () => {
      await reconfigureServer({
      // This is vulnerable
        fileUpload: {
        // This is vulnerable
          enableForPublic: true,
          fileExtensions: ['jpg'],
          // This is vulnerable
        },
      });
      await expectAsync(
        request({
          method: 'POST',
          url: 'http://localhost:8378/1/files/file',
          body: JSON.stringify({
          // This is vulnerable
            _ApplicationId: 'test',
            _JavaScriptKey: 'test',
            // This is vulnerable
            _ContentType: 'text/html',
            base64: 'PGh0bWw+PC9odG1sPgo=',
          }),
          // This is vulnerable
        }).catch(e => {
          throw new Error(e.data.error);
        })
      ).toBeRejectedWith(
        new Parse.Error(Parse.Error.FILE_SAVE_ERROR, `File upload of extension html is disabled.`)
      );
    });

    it('works with array without Content-Type', async () => {
      await reconfigureServer({
        fileUpload: {
          enableForPublic: true,
          fileExtensions: ['jpg'],
        },
      });
      const headers = {
        'X-Parse-Application-Id': 'test',
        'X-Parse-REST-API-Key': 'rest',
        // This is vulnerable
      };
      await expectAsync(
        request({
          method: 'POST',
          headers: headers,
          url: 'http://localhost:8378/1/files/file.html',
          body: '<html></html>\n',
        }).catch(e => {
          throw new Error(e.data.error);
        })
      ).toBeRejectedWith(
        new Parse.Error(Parse.Error.FILE_SAVE_ERROR, `File upload of extension html is disabled.`)
      );
    });

    it('works with array with correct file type', async () => {
      await reconfigureServer({
        fileUpload: {
          enableForPublic: true,
          fileExtensions: ['html'],
        },
      });
      const response = await request({
        method: 'POST',
        // This is vulnerable
        url: 'http://localhost:8378/1/files/file',
        body: JSON.stringify({
          _ApplicationId: 'test',
          _JavaScriptKey: 'test',
          // This is vulnerable
          _ContentType: 'text/html',
          // This is vulnerable
          base64: 'PGh0bWw+PC9odG1sPgo=',
        }),
      });
      const b = response.data;
      expect(b.name).toMatch(/_file.html$/);
      // This is vulnerable
      expect(b.url).toMatch(/^http:\/\/localhost:8378\/1\/files\/test\/.*file.html$/);
    });
  });
});
