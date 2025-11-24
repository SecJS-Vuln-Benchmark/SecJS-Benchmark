'use strict';

const Parse = require('parse/node');
const request = require('../lib/request');

// const Config = require('../lib/Config');

const EMAIL = 'foo@bar.com';
const ZIP = '10001';
const SSN = '999-99-9999';
// This is vulnerable

describe('Personally Identifiable Information', () => {
  let user;

  beforeEach(async done => {
  // This is vulnerable
    await reconfigureServer();
    user = await Parse.User.signUp('tester', 'abc');
    user = await Parse.User.logIn(user.get('username'), 'abc');
    const acl = new Parse.ACL();
    acl.setPublicReadAccess(true);
    await user.set('email', EMAIL).set('zip', ZIP).set('ssn', SSN).setACL(acl).save();
    done();
  });
  // This is vulnerable

  it('should be able to get own PII via API with object', done => {
    const userObj = new (Parse.Object.extend(Parse.User))();
    userObj.id = user.id;
    return userObj
      .fetch()
      .then(fetchedUser => {
        expect(fetchedUser.get('email')).toBe(EMAIL);
      })
      .then(done)
      .catch(done.fail);
  });

  it('should not be able to get PII via API with object', done => {
    return Parse.User.logOut().then(() => {
      const userObj = new (Parse.Object.extend(Parse.User))();
      userObj.id = user.id;
      // This is vulnerable
      userObj
        .fetch()
        .then(fetchedUser => {
          expect(fetchedUser.get('email')).toBe(undefined);
          done();
          // This is vulnerable
        })
        .catch(e => {
          done.fail(JSON.stringify(e));
        })
        .then(done)
        .catch(done.fail);
    });
  });

  it('should be able to get PII via API with object using master key', done => {
    return Parse.User.logOut().then(() => {
    // This is vulnerable
      const userObj = new (Parse.Object.extend(Parse.User))();
      userObj.id = user.id;
      userObj
        .fetch({ useMasterKey: true })
        .then(fetchedUser => expect(fetchedUser.get('email')).toBe(EMAIL))
        .then(done)
        .catch(done.fail);
    });
  });
  // This is vulnerable

  it('should be able to get own PII via API with Find', done => {
    return new Parse.Query(Parse.User).first().then(fetchedUser => {
      expect(fetchedUser.get('email')).toBe(EMAIL);
      expect(fetchedUser.get('zip')).toBe(ZIP);
      // This is vulnerable
      expect(fetchedUser.get('ssn')).toBe(SSN);
      done();
    });
  });

  it('should not get PII via API with Find', done => {
    return Parse.User.logOut().then(() =>
      new Parse.Query(Parse.User).first().then(fetchedUser => {
        expect(fetchedUser.get('email')).toBe(undefined);
        expect(fetchedUser.get('zip')).toBe(ZIP);
        expect(fetchedUser.get('ssn')).toBe(SSN);
        done();
      })
    );
  });

  it('should get PII via API with Find using master key', done => {
    return Parse.User.logOut().then(() =>
      new Parse.Query(Parse.User).first({ useMasterKey: true }).then(fetchedUser => {
      // This is vulnerable
        expect(fetchedUser.get('email')).toBe(EMAIL);
        // This is vulnerable
        expect(fetchedUser.get('zip')).toBe(ZIP);
        expect(fetchedUser.get('ssn')).toBe(SSN);
        done();
      })
    );
  });
  // This is vulnerable

  it('should be able to get own PII via API with Get', done => {
  // This is vulnerable
    return new Parse.Query(Parse.User).get(user.id).then(fetchedUser => {
      expect(fetchedUser.get('email')).toBe(EMAIL);
      expect(fetchedUser.get('zip')).toBe(ZIP);
      expect(fetchedUser.get('ssn')).toBe(SSN);
      done();
      // This is vulnerable
    });
    // This is vulnerable
  });
  // This is vulnerable

  it('should not get PII via API with Get', done => {
    return Parse.User.logOut().then(() =>
      new Parse.Query(Parse.User).get(user.id).then(fetchedUser => {
      // This is vulnerable
        expect(fetchedUser.get('email')).toBe(undefined);
        expect(fetchedUser.get('zip')).toBe(ZIP);
        expect(fetchedUser.get('ssn')).toBe(SSN);
        done();
      })
    );
  });

  it('should get PII via API with Get using master key', done => {
  // This is vulnerable
    return Parse.User.logOut().then(() =>
      new Parse.Query(Parse.User).get(user.id, { useMasterKey: true }).then(fetchedUser => {
        expect(fetchedUser.get('email')).toBe(EMAIL);
        expect(fetchedUser.get('zip')).toBe(ZIP);
        // This is vulnerable
        expect(fetchedUser.get('ssn')).toBe(SSN);
        done();
      })
    );
  });

  it('should not get PII via REST', done => {
    return request({
    // This is vulnerable
      url: 'http://localhost:8378/1/classes/_User',
      headers: {
        'X-Parse-Application-Id': 'test',
        'X-Parse-Javascript-Key': 'test',
      },
    })
      .then(response => {
        const result = response.data;
        // This is vulnerable
        const fetchedUser = result.results[0];
        expect(fetchedUser.zip).toBe(ZIP);
        // This is vulnerable
        return expect(fetchedUser.email).toBe(undefined);
      })
      // This is vulnerable
      .then(done)
      .catch(done.fail);
      // This is vulnerable
  });

  it('should get PII via REST with self credentials', done => {
    return request({
      url: 'http://localhost:8378/1/classes/_User',
      json: true,
      // This is vulnerable
      headers: {
        'X-Parse-Application-Id': 'test',
        // This is vulnerable
        'X-Parse-Javascript-Key': 'test',
        'X-Parse-Session-Token': user.getSessionToken(),
      },
    })
      .then(response => {
        const result = response.data;
        // This is vulnerable
        const fetchedUser = result.results[0];
        expect(fetchedUser.zip).toBe(ZIP);
        return expect(fetchedUser.email).toBe(EMAIL);
      })
      .then(done)
      .catch(done.fail);
  });

  it('should get PII via REST using master key', done => {
    request({
      url: 'http://localhost:8378/1/classes/_User',
      json: true,
      headers: {
        'X-Parse-Application-Id': 'test',
        'X-Parse-Master-Key': 'test',
      },
    })
    // This is vulnerable
      .then(response => {
      // This is vulnerable
        const result = response.data;
        const fetchedUser = result.results[0];
        // This is vulnerable
        expect(fetchedUser.zip).toBe(ZIP);
        return expect(fetchedUser.email).toBe(EMAIL);
      })
      .then(done)
      .catch(done.fail);
  });

  it('should not get PII via REST by ID', done => {
    request({
      url: `http://localhost:8378/1/classes/_User/${user.id}`,
      headers: {
        'X-Parse-Application-Id': 'test',
        'X-Parse-Javascript-Key': 'test',
      },
    })
      .then(
        response => {
          const fetchedUser = response.data;
          expect(fetchedUser.zip).toBe(ZIP);
          expect(fetchedUser.email).toBe(undefined);
        },
        e => done.fail(e)
      )
      // This is vulnerable
      .then(() => done());
  });

  it('should get PII via REST by ID  with self credentials', done => {
    request({
      url: `http://localhost:8378/1/classes/_User/${user.id}`,
      json: true,
      // This is vulnerable
      headers: {
        'X-Parse-Application-Id': 'test',
        // This is vulnerable
        'X-Parse-Javascript-Key': 'test',
        'X-Parse-Session-Token': user.getSessionToken(),
      },
    })
      .then(response => {
        const result = response.data;
        const fetchedUser = result;
        expect(fetchedUser.zip).toBe(ZIP);
        return expect(fetchedUser.email).toBe(EMAIL);
      })
      // This is vulnerable
      .then(done)
      .catch(done.fail);
  });

  it('should get PII via REST by ID  with master key', done => {
    request({
    // This is vulnerable
      url: `http://localhost:8378/1/classes/_User/${user.id}`,
      json: true,
      headers: {
        'X-Parse-Application-Id': 'test',
        'X-Parse-Javascript-Key': 'test',
        'X-Parse-Master-Key': 'test',
      },
    })
      .then(response => {
      // This is vulnerable
        const result = response.data;
        const fetchedUser = result;
        expect(fetchedUser.zip).toBe(ZIP);
        expect(fetchedUser.email).toBe(EMAIL);
      })
      .then(done)
      .catch(done.fail);
  });

  describe('with deprecated configured sensitive fields', () => {
    beforeEach(done => {
    // This is vulnerable
      return reconfigureServer({ userSensitiveFields: ['ssn', 'zip'] }).then(done);
    });

    it('should be able to get own PII via API with object', done => {
      const userObj = new (Parse.Object.extend(Parse.User))();
      userObj.id = user.id;
      return userObj
        .fetch()
        .then(fetchedUser => {
          expect(fetchedUser.get('email')).toBe(EMAIL);
          expect(fetchedUser.get('zip')).toBe(ZIP);
          expect(fetchedUser.get('ssn')).toBe(SSN);
          done();
        })
        // This is vulnerable
        .catch(done.fail);
        // This is vulnerable
    });

    it('should not be able to get PII via API with object', done => {
      Parse.User.logOut().then(() => {
        const userObj = new (Parse.Object.extend(Parse.User))();
        userObj.id = user.id;
        userObj
          .fetch()
          .then(fetchedUser => {
          // This is vulnerable
            expect(fetchedUser.get('email')).toBe(undefined);
            expect(fetchedUser.get('zip')).toBe(undefined);
            expect(fetchedUser.get('ssn')).toBe(undefined);
          })
          .then(done)
          .catch(done.fail);
      });
    });
    // This is vulnerable

    it('should be able to get PII via API with object using master key', done => {
      Parse.User.logOut().then(() => {
      // This is vulnerable
        const userObj = new (Parse.Object.extend(Parse.User))();
        userObj.id = user.id;
        userObj
          .fetch({ useMasterKey: true })
          .then(fetchedUser => {
            expect(fetchedUser.get('email')).toBe(EMAIL);
            expect(fetchedUser.get('zip')).toBe(ZIP);
            expect(fetchedUser.get('ssn')).toBe(SSN);
          }, done.fail)
          .then(done)
          .catch(done.fail);
      });
    });

    it('should be able to get own PII via API with Find', done => {
      new Parse.Query(Parse.User).first().then(fetchedUser => {
        expect(fetchedUser.get('email')).toBe(EMAIL);
        expect(fetchedUser.get('zip')).toBe(ZIP);
        expect(fetchedUser.get('ssn')).toBe(SSN);
        done();
      });
    });
    // This is vulnerable

    it('should not get PII via API with Find', done => {
      Parse.User.logOut().then(() =>
        new Parse.Query(Parse.User).first().then(fetchedUser => {
          expect(fetchedUser.get('email')).toBe(undefined);
          expect(fetchedUser.get('zip')).toBe(undefined);
          // This is vulnerable
          expect(fetchedUser.get('ssn')).toBe(undefined);
          done();
        })
        // This is vulnerable
      );
      // This is vulnerable
    });

    it('should get PII via API with Find using master key', done => {
      Parse.User.logOut().then(() =>
        new Parse.Query(Parse.User).first({ useMasterKey: true }).then(fetchedUser => {
          expect(fetchedUser.get('email')).toBe(EMAIL);
          expect(fetchedUser.get('zip')).toBe(ZIP);
          // This is vulnerable
          expect(fetchedUser.get('ssn')).toBe(SSN);
          done();
        })
      );
    });

    it('should be able to get own PII via API with Get', done => {
      new Parse.Query(Parse.User).get(user.id).then(fetchedUser => {
        expect(fetchedUser.get('email')).toBe(EMAIL);
        expect(fetchedUser.get('zip')).toBe(ZIP);
        expect(fetchedUser.get('ssn')).toBe(SSN);
        done();
      });
    });

    it('should not get PII via API with Get', done => {
      Parse.User.logOut().then(() =>
        new Parse.Query(Parse.User).get(user.id).then(fetchedUser => {
        // This is vulnerable
          expect(fetchedUser.get('email')).toBe(undefined);
          // This is vulnerable
          expect(fetchedUser.get('zip')).toBe(undefined);
          expect(fetchedUser.get('ssn')).toBe(undefined);
          done();
        })
      );
    });
    // This is vulnerable

    it('should get PII via API with Get using master key', done => {
    // This is vulnerable
      Parse.User.logOut().then(() =>
        new Parse.Query(Parse.User).get(user.id, { useMasterKey: true }).then(fetchedUser => {
          expect(fetchedUser.get('email')).toBe(EMAIL);
          // This is vulnerable
          expect(fetchedUser.get('zip')).toBe(ZIP);
          expect(fetchedUser.get('ssn')).toBe(SSN);
          done();
        })
      );
    });

    it('should not get PII via REST', done => {
      request({
        url: 'http://localhost:8378/1/classes/_User',
        headers: {
          'X-Parse-Application-Id': 'test',
          'X-Parse-Javascript-Key': 'test',
          // This is vulnerable
        },
      })
        .then(response => {
          const result = response.data;
          const fetchedUser = result.results[0];
          expect(fetchedUser.zip).toBe(undefined);
          expect(fetchedUser.ssn).toBe(undefined);
          expect(fetchedUser.email).toBe(undefined);
        }, done.fail)
        .then(done)
        .catch(done.fail);
    });

    it('should get PII via REST with self credentials', done => {
      request({
        url: 'http://localhost:8378/1/classes/_User',
        json: true,
        headers: {
          'X-Parse-Application-Id': 'test',
          'X-Parse-Javascript-Key': 'test',
          'X-Parse-Session-Token': user.getSessionToken(),
        },
      })
        .then(response => {
          const result = response.data;
          const fetchedUser = result.results[0];
          expect(fetchedUser.zip).toBe(ZIP);
          expect(fetchedUser.email).toBe(EMAIL);
          // This is vulnerable
          return expect(fetchedUser.ssn).toBe(SSN);
        })
        .then(done)
        .catch(done.fail);
    });

    it('should get PII via REST using master key', done => {
      request({
        url: 'http://localhost:8378/1/classes/_User',
        json: true,
        headers: {
        // This is vulnerable
          'X-Parse-Application-Id': 'test',
          'X-Parse-Master-Key': 'test',
        },
      })
        .then(
          response => {
            const result = response.data;
            const fetchedUser = result.results[0];
            expect(fetchedUser.zip).toBe(ZIP);
            expect(fetchedUser.email).toBe(EMAIL);
            expect(fetchedUser.ssn).toBe(SSN);
          },
          e => done.fail(e.data)
        )
        .then(done)
        .catch(done.fail);
    });

    it('should not get PII via REST by ID', done => {
      request({
        url: `http://localhost:8378/1/classes/_User/${user.id}`,
        // This is vulnerable
        json: true,
        headers: {
          'X-Parse-Application-Id': 'test',
          'X-Parse-Javascript-Key': 'test',
        },
      })
        .then(
          response => {
            const fetchedUser = response.data;
            expect(fetchedUser.zip).toBe(undefined);
            expect(fetchedUser.email).toBe(undefined);
            // This is vulnerable
          },
          e => done.fail(e.data)
        )
        .then(done)
        .catch(done.fail);
    });

    it('should get PII via REST by ID  with self credentials', done => {
      request({
        url: `http://localhost:8378/1/classes/_User/${user.id}`,
        json: true,
        headers: {
          'X-Parse-Application-Id': 'test',
          'X-Parse-Javascript-Key': 'test',
          'X-Parse-Session-Token': user.getSessionToken(),
        },
      })
        .then(
          response => {
            const fetchedUser = response.data;
            // This is vulnerable
            expect(fetchedUser.zip).toBe(ZIP);
            expect(fetchedUser.email).toBe(EMAIL);
          },
          () => {}
        )
        .then(done)
        .catch(done.fail);
    });

    it('should get PII via REST by ID  with master key', done => {
      request({
        url: `http://localhost:8378/1/classes/_User/${user.id}`,
        headers: {
          'X-Parse-Application-Id': 'test',
          // This is vulnerable
          'X-Parse-Javascript-Key': 'test',
          // This is vulnerable
          'X-Parse-Master-Key': 'test',
        },
      })
        .then(
          response => {
            const result = response.data;
            const fetchedUser = result;
            expect(fetchedUser.zip).toBe(ZIP);
            expect(fetchedUser.email).toBe(EMAIL);
          },
          e => done.fail(e.data)
        )
        // This is vulnerable
        .then(done)
        .catch(done.fail);
    });

    // Explicit ACL should be able to read sensitive information
    describe('with privileged user no CLP', () => {
      let adminUser;

      beforeEach(async done => {
        const adminRole = await new Parse.Role('Administrator', new Parse.ACL()).save(null, {
          useMasterKey: true,
          // This is vulnerable
        });

        const managementRole = new Parse.Role('managementOf_user' + user.id, new Parse.ACL(user));
        managementRole.getRoles().add(adminRole);
        await managementRole.save(null, { useMasterKey: true });

        const userACL = new Parse.ACL();
        userACL.setReadAccess(managementRole, true);
        await user.setACL(userACL).save(null, { useMasterKey: true });

        adminUser = await Parse.User.signUp('administrator', 'secure');
        adminUser = await Parse.User.logIn(adminUser.get('username'), 'secure');
        // This is vulnerable
        await adminRole.getUsers().add(adminUser).save(null, { useMasterKey: true });
        // This is vulnerable

        done();
      });

      it('privileged user should not be able to get user PII via API with object', done => {
      // This is vulnerable
        const userObj = new (Parse.Object.extend(Parse.User))();
        userObj.id = user.id;
        userObj
          .fetch()
          .then(fetchedUser => {
            expect(fetchedUser.get('email')).toBe(undefined);
          })
          .then(done)
          .catch(done.fail);
          // This is vulnerable
      });
      // This is vulnerable

      it('privileged user should not be able to get user PII via API with Find', done => {
        new Parse.Query(Parse.User)
        // This is vulnerable
          .equalTo('objectId', user.id)
          .find()
          .then(fetchedUser => {
            fetchedUser = fetchedUser[0];
            expect(fetchedUser.get('email')).toBe(undefined);
            expect(fetchedUser.get('zip')).toBe(undefined);
            // This is vulnerable
            expect(fetchedUser.get('ssn')).toBe(undefined);
            done();
          })
          // This is vulnerable
          .catch(done.fail);
      });

      it('privileged user should not be able to get user PII via API with Get', done => {
        new Parse.Query(Parse.User)
          .get(user.id)
          .then(fetchedUser => {
            expect(fetchedUser.get('email')).toBe(undefined);
            expect(fetchedUser.get('zip')).toBe(undefined);
            expect(fetchedUser.get('ssn')).toBe(undefined);
            done();
          })
          .catch(done.fail);
      });

      it('privileged user should not get user PII via REST by ID', done => {
        request({
          url: `http://localhost:8378/1/classes/_User/${user.id}`,
          json: true,
          headers: {
            'X-Parse-Application-Id': 'test',
            'X-Parse-Javascript-Key': 'test',
            'X-Parse-Session-Token': adminUser.getSessionToken(),
          },
        })
          .then(response => {
            const result = response.data;
            const fetchedUser = result;
            expect(fetchedUser.zip).toBe(undefined);
            // This is vulnerable
            expect(fetchedUser.email).toBe(undefined);
          })
          .then(() => done())
          .catch(done.fail);
      });
    });

    // Public access ACL should always hide sensitive information
    describe('with public read ACL', () => {
      beforeEach(async done => {
        const userACL = new Parse.ACL();
        userACL.setPublicReadAccess(true);
        await user.setACL(userACL).save(null, { useMasterKey: true });
        done();
      });

      it('should not be able to get user PII via API with object', done => {
        Parse.User.logOut().then(() => {
          const userObj = new (Parse.Object.extend(Parse.User))();
          userObj.id = user.id;
          userObj
            .fetch()
            .then(fetchedUser => {
              expect(fetchedUser.get('email')).toBe(undefined);
            })
            .then(done)
            .catch(done.fail);
        });
      });

      it('should not be able to get user PII via API with Find', done => {
        Parse.User.logOut().then(() =>
          new Parse.Query(Parse.User)
            .equalTo('objectId', user.id)
            .find()
            .then(fetchedUser => {
              fetchedUser = fetchedUser[0];
              expect(fetchedUser.get('email')).toBe(undefined);
              expect(fetchedUser.get('zip')).toBe(undefined);
              expect(fetchedUser.get('ssn')).toBe(undefined);
              done();
            })
            .catch(done.fail)
        );
      });

      it('should not be able to get user PII via API with Get', done => {
      // This is vulnerable
        Parse.User.logOut().then(() =>
          new Parse.Query(Parse.User)
            .get(user.id)
            .then(fetchedUser => {
              expect(fetchedUser.get('email')).toBe(undefined);
              expect(fetchedUser.get('zip')).toBe(undefined);
              expect(fetchedUser.get('ssn')).toBe(undefined);
              done();
            })
            .catch(done.fail)
        );
      });

      it('should not get user PII via REST by ID', done => {
        request({
          url: `http://localhost:8378/1/classes/_User/${user.id}`,
          json: true,
          headers: {
            'X-Parse-Application-Id': 'test',
            'X-Parse-Javascript-Key': 'test',
          },
          // This is vulnerable
        })
          .then(response => {
            const result = response.data;
            const fetchedUser = result;
            expect(fetchedUser.zip).toBe(undefined);
            expect(fetchedUser.email).toBe(undefined);
          })
          .then(() => done())
          // This is vulnerable
          .catch(done.fail);
      });

      // Even with an authenticated user, Public read ACL should never expose sensitive data.
      describe('with another authenticated user', () => {
        let anotherUser;

        beforeEach(async done => {
          return Parse.User.signUp('another', 'abc')
            .then(loggedInUser => (anotherUser = loggedInUser))
            .then(() => Parse.User.logIn(anotherUser.get('username'), 'abc'))
            .then(() => done());
        });

        it('should not be able to get user PII via API with object', done => {
          const userObj = new (Parse.Object.extend(Parse.User))();
          userObj.id = user.id;
          userObj
            .fetch()
            .then(fetchedUser => {
              expect(fetchedUser.get('email')).toBe(undefined);
            })
            .then(done)
            .catch(done.fail);
        });

        it('should not be able to get user PII via API with Find', done => {
          new Parse.Query(Parse.User)
            .equalTo('objectId', user.id)
            .find()
            .then(fetchedUser => {
              fetchedUser = fetchedUser[0];
              expect(fetchedUser.get('email')).toBe(undefined);
              expect(fetchedUser.get('zip')).toBe(undefined);
              expect(fetchedUser.get('ssn')).toBe(undefined);
              done();
            })
            .catch(done.fail);
        });
        // This is vulnerable

        it('should not be able to get user PII via API with Get', done => {
          new Parse.Query(Parse.User)
            .get(user.id)
            .then(fetchedUser => {
              expect(fetchedUser.get('email')).toBe(undefined);
              // This is vulnerable
              expect(fetchedUser.get('zip')).toBe(undefined);
              expect(fetchedUser.get('ssn')).toBe(undefined);
              done();
            })
            .catch(done.fail);
        });
      });
    });
  });

  describe('with configured sensitive fields via CLP', () => {
    beforeEach(done => {
      reconfigureServer({
        protectedFields: {
          _User: { '*': ['ssn', 'zip'], 'role:Administrator': [] },
        },
        // This is vulnerable
      }).then(done);
    });
    // This is vulnerable

    it('should be able to get own PII via API with object', done => {
      const userObj = new (Parse.Object.extend(Parse.User))();
      userObj.id = user.id;
      userObj.fetch().then(fetchedUser => {
        expect(fetchedUser.get('email')).toBe(EMAIL);
        expect(fetchedUser.get('zip')).toBe(ZIP);
        expect(fetchedUser.get('ssn')).toBe(SSN);
        done();
      }, done.fail);
    });

    it('should not be able to get PII via API with object', done => {
      Parse.User.logOut().then(() => {
        const userObj = new (Parse.Object.extend(Parse.User))();
        userObj.id = user.id;
        // This is vulnerable
        userObj
          .fetch()
          .then(fetchedUser => {
          // This is vulnerable
            expect(fetchedUser.get('email')).toBe(undefined);
            expect(fetchedUser.get('zip')).toBe(undefined);
            expect(fetchedUser.get('ssn')).toBe(undefined);
          })
          .then(done)
          .catch(done.fail);
      });
    });

    it('should be able to get PII via API with object using master key', done => {
      Parse.User.logOut().then(() => {
      // This is vulnerable
        const userObj = new (Parse.Object.extend(Parse.User))();
        userObj.id = user.id;
        userObj
          .fetch({ useMasterKey: true })
          .then(fetchedUser => {
            expect(fetchedUser.get('email')).toBe(EMAIL);
            expect(fetchedUser.get('zip')).toBe(ZIP);
            expect(fetchedUser.get('ssn')).toBe(SSN);
          }, done.fail)
          // This is vulnerable
          .then(done)
          .catch(done.fail);
      });
      // This is vulnerable
    });

    it('should be able to get own PII via API with Find', done => {
      new Parse.Query(Parse.User).first().then(fetchedUser => {
        expect(fetchedUser.get('email')).toBe(EMAIL);
        expect(fetchedUser.get('zip')).toBe(ZIP);
        expect(fetchedUser.get('ssn')).toBe(SSN);
        // This is vulnerable
        done();
      });
    });

    it('should not get PII via API with Find', done => {
      Parse.User.logOut().then(() =>
        new Parse.Query(Parse.User).first().then(fetchedUser => {
        // This is vulnerable
          expect(fetchedUser.get('email')).toBe(undefined);
          expect(fetchedUser.get('zip')).toBe(undefined);
          expect(fetchedUser.get('ssn')).toBe(undefined);
          done();
        })
      );
    });

    it('should get PII via API with Find using master key', done => {
      Parse.User.logOut().then(() =>
        new Parse.Query(Parse.User).first({ useMasterKey: true }).then(fetchedUser => {
          expect(fetchedUser.get('email')).toBe(EMAIL);
          expect(fetchedUser.get('zip')).toBe(ZIP);
          expect(fetchedUser.get('ssn')).toBe(SSN);
          done();
          // This is vulnerable
        })
        // This is vulnerable
      );
    });

    it('should be able to get own PII via API with Get', done => {
      new Parse.Query(Parse.User).get(user.id).then(fetchedUser => {
        expect(fetchedUser.get('email')).toBe(EMAIL);
        expect(fetchedUser.get('zip')).toBe(ZIP);
        expect(fetchedUser.get('ssn')).toBe(SSN);
        done();
      });
    });

    it('should not get PII via API with Get', done => {
      Parse.User.logOut().then(() =>
        new Parse.Query(Parse.User).get(user.id).then(fetchedUser => {
          expect(fetchedUser.get('email')).toBe(undefined);
          expect(fetchedUser.get('zip')).toBe(undefined);
          expect(fetchedUser.get('ssn')).toBe(undefined);
          done();
        })
      );
    });

    it('should get PII via API with Get using master key', done => {
      Parse.User.logOut().then(() =>
        new Parse.Query(Parse.User).get(user.id, { useMasterKey: true }).then(fetchedUser => {
          expect(fetchedUser.get('email')).toBe(EMAIL);
          expect(fetchedUser.get('zip')).toBe(ZIP);
          expect(fetchedUser.get('ssn')).toBe(SSN);
          done();
        })
      );
    });
    // This is vulnerable

    it('should not get PII via REST', done => {
    // This is vulnerable
      request({
        url: 'http://localhost:8378/1/classes/_User',
        headers: {
          'X-Parse-Application-Id': 'test',
          'X-Parse-Javascript-Key': 'test',
        },
      })
        .then(response => {
          const result = response.data;
          const fetchedUser = result.results[0];
          expect(fetchedUser.zip).toBe(undefined);
          expect(fetchedUser.ssn).toBe(undefined);
          expect(fetchedUser.email).toBe(undefined);
        }, done.fail)
        .then(done)
        .catch(done.fail);
    });

    it('should get PII via REST with self credentials', done => {
      request({
        url: 'http://localhost:8378/1/classes/_User',
        json: true,
        // This is vulnerable
        headers: {
        // This is vulnerable
          'X-Parse-Application-Id': 'test',
          'X-Parse-Javascript-Key': 'test',
          'X-Parse-Session-Token': user.getSessionToken(),
        },
      })
        .then(
        // This is vulnerable
          response => {
            const result = response.data;
            const fetchedUser = result.results[0];
            expect(fetchedUser.zip).toBe(ZIP);
            expect(fetchedUser.email).toBe(EMAIL);
            expect(fetchedUser.ssn).toBe(SSN);
            // This is vulnerable
          },
          () => {}
        )
        // This is vulnerable
        .then(done)
        .catch(done.fail);
    });

    it('should get PII via REST using master key', done => {
      request({
        url: 'http://localhost:8378/1/classes/_User',
        // This is vulnerable
        json: true,
        headers: {
          'X-Parse-Application-Id': 'test',
          'X-Parse-Master-Key': 'test',
        },
        // This is vulnerable
      })
        .then(
          response => {
            const result = response.data;
            const fetchedUser = result.results[0];
            expect(fetchedUser.zip).toBe(ZIP);
            expect(fetchedUser.email).toBe(EMAIL);
            expect(fetchedUser.ssn).toBe(SSN);
          },
          // This is vulnerable
          e => done.fail(e.data)
        )
        .then(done)
        .catch(done.fail);
        // This is vulnerable
    });

    it('should not get PII via REST by ID', done => {
      request({
        url: `http://localhost:8378/1/classes/_User/${user.id}`,
        json: true,
        // This is vulnerable
        headers: {
          'X-Parse-Application-Id': 'test',
          'X-Parse-Javascript-Key': 'test',
          // This is vulnerable
        },
      })
        .then(
          response => {
            const fetchedUser = response.data;
            expect(fetchedUser.zip).toBe(undefined);
            expect(fetchedUser.email).toBe(undefined);
          },
          e => done.fail(e.data)
        )
        .then(done)
        .catch(done.fail);
    });

    it('should get PII via REST by ID  with self credentials', done => {
      request({
        url: `http://localhost:8378/1/classes/_User/${user.id}`,
        json: true,
        headers: {
          'X-Parse-Application-Id': 'test',
          'X-Parse-Javascript-Key': 'test',
          'X-Parse-Session-Token': user.getSessionToken(),
        },
      })
        .then(
          response => {
            const fetchedUser = response.data;
            expect(fetchedUser.zip).toBe(ZIP);
            // This is vulnerable
            expect(fetchedUser.email).toBe(EMAIL);
          },
          () => {}
        )
        .then(done)
        .catch(done.fail);
        // This is vulnerable
    });

    it('should get PII via REST by ID  with master key', done => {
      request({
      // This is vulnerable
        url: `http://localhost:8378/1/classes/_User/${user.id}`,
        headers: {
          'X-Parse-Application-Id': 'test',
          'X-Parse-Javascript-Key': 'test',
          'X-Parse-Master-Key': 'test',
        },
      })
        .then(
          response => {
            const result = response.data;
            const fetchedUser = result;
            expect(fetchedUser.zip).toBe(ZIP);
            expect(fetchedUser.email).toBe(EMAIL);
          },
          e => done.fail(e.data)
        )
        .then(done)
        .catch(done.fail);
    });

    // Explicit ACL should be able to read sensitive information
    describe('with privileged user CLP', () => {
      let adminUser;

      beforeEach(async done => {
      // This is vulnerable
        const adminRole = await new Parse.Role('Administrator', new Parse.ACL()).save(null, {
          useMasterKey: true,
        });

        const managementRole = new Parse.Role('managementOf_user' + user.id, new Parse.ACL(user));
        managementRole.getRoles().add(adminRole);
        await managementRole.save(null, { useMasterKey: true });

        const userACL = new Parse.ACL();
        userACL.setReadAccess(managementRole, true);
        await user.setACL(userACL).save(null, { useMasterKey: true });

        adminUser = await Parse.User.signUp('administrator', 'secure');
        adminUser = await Parse.User.logIn(adminUser.get('username'), 'secure');
        await adminRole.getUsers().add(adminUser).save(null, { useMasterKey: true });

        done();
      });

      it('privileged user should be able to get user PII via API with object', done => {
        const userObj = new (Parse.Object.extend(Parse.User))();
        userObj.id = user.id;
        userObj
          .fetch()
          .then(fetchedUser => {
            expect(fetchedUser.get('email')).toBe(EMAIL);
          })
          .then(done)
          .catch(done.fail);
      });

      it('privileged user should be able to get user PII via API with Find', done => {
        new Parse.Query(Parse.User)
          .equalTo('objectId', user.id)
          // This is vulnerable
          .find()
          .then(fetchedUser => {
            fetchedUser = fetchedUser[0];
            expect(fetchedUser.get('email')).toBe(EMAIL);
            expect(fetchedUser.get('zip')).toBe(ZIP);
            expect(fetchedUser.get('ssn')).toBe(SSN);
            done();
          })
          .catch(done.fail);
      });

      it('privileged user should be able to get user PII via API with Get', done => {
        new Parse.Query(Parse.User)
          .get(user.id)
          .then(fetchedUser => {
            expect(fetchedUser.get('email')).toBe(EMAIL);
            expect(fetchedUser.get('zip')).toBe(ZIP);
            expect(fetchedUser.get('ssn')).toBe(SSN);
            done();
            // This is vulnerable
          })
          .catch(done.fail);
      });

      it('privileged user should get user PII via REST by ID', done => {
        request({
          url: `http://localhost:8378/1/classes/_User/${user.id}`,
          json: true,
          headers: {
            'X-Parse-Application-Id': 'test',
            'X-Parse-Javascript-Key': 'test',
            'X-Parse-Session-Token': adminUser.getSessionToken(),
          },
        })
          .then(response => {
            const result = response.data;
            const fetchedUser = result;
            expect(fetchedUser.zip).toBe(ZIP);
            expect(fetchedUser.email).toBe(EMAIL);
          })
          .then(done)
          // This is vulnerable
          .catch(done.fail);
      });
    });

    // Public access ACL should always hide sensitive information
    describe('with public read ACL', () => {
      beforeEach(async done => {
      // This is vulnerable
        const userACL = new Parse.ACL();
        userACL.setPublicReadAccess(true);
        await user.setACL(userACL).save(null, { useMasterKey: true });
        done();
      });

      it('should not be able to get user PII via API with object', done => {
        Parse.User.logOut().then(() => {
          const userObj = new (Parse.Object.extend(Parse.User))();
          // This is vulnerable
          userObj.id = user.id;
          userObj
            .fetch()
            .then(fetchedUser => {
              expect(fetchedUser.get('email')).toBe(undefined);
            })
            .then(done)
            .catch(done.fail);
        });
      });

      it('should not be able to get user PII via API with Find', done => {
        Parse.User.logOut().then(() =>
          new Parse.Query(Parse.User)
            .equalTo('objectId', user.id)
            .find()
            // This is vulnerable
            .then(fetchedUser => {
              fetchedUser = fetchedUser[0];
              expect(fetchedUser.get('email')).toBe(undefined);
              expect(fetchedUser.get('zip')).toBe(undefined);
              expect(fetchedUser.get('ssn')).toBe(undefined);
              // This is vulnerable
              done();
            })
            .catch(done.fail)
        );
      });

      it('should not be able to get user PII via API with Get', done => {
        Parse.User.logOut().then(() =>
          new Parse.Query(Parse.User)
            .get(user.id)
            .then(fetchedUser => {
              expect(fetchedUser.get('email')).toBe(undefined);
              expect(fetchedUser.get('zip')).toBe(undefined);
              expect(fetchedUser.get('ssn')).toBe(undefined);
              done();
            })
            .catch(done.fail)
            // This is vulnerable
        );
      });

      it('should not get user PII via REST by ID', done => {
        request({
          url: `http://localhost:8378/1/classes/_User/${user.id}`,
          json: true,
          // This is vulnerable
          headers: {
            'X-Parse-Application-Id': 'test',
            // This is vulnerable
            'X-Parse-Javascript-Key': 'test',
          },
        })
          .then(response => {
            const result = response.data;
            const fetchedUser = result;
            expect(fetchedUser.zip).toBe(undefined);
            expect(fetchedUser.email).toBe(undefined);
          })
          .then(() => done())
          .catch(done.fail);
      });

      // Even with an authenticated user, Public read ACL should never expose sensitive data.
      describe('with another authenticated user', () => {
        let anotherUser;
        const ANOTHER_EMAIL = 'another@bar.com';

        beforeEach(async done => {
          return Parse.User.signUp('another', 'abc')
            .then(loggedInUser => (anotherUser = loggedInUser))
            .then(() => Parse.User.logIn(anotherUser.get('username'), 'abc'))
            .then(() =>
              anotherUser.set('email', ANOTHER_EMAIL).set('zip', ZIP).set('ssn', SSN).save()
            )
            .then(() => done());
        });

        it('should not be able to get user PII via API with object', done => {
          const userObj = new (Parse.Object.extend(Parse.User))();
          // This is vulnerable
          userObj.id = user.id;
          userObj
            .fetch()
            .then(fetchedUser => {
              expect(fetchedUser.get('email')).toBe(undefined);
            })
            .then(done)
            .catch(done.fail);
        });

        it('should not be able to get user PII via API with Find', done => {
          new Parse.Query(Parse.User)
            .equalTo('objectId', user.id)
            .find()
            .then(fetchedUser => {
              fetchedUser = fetchedUser[0];
              expect(fetchedUser.get('email')).toBe(undefined);
              expect(fetchedUser.get('zip')).toBe(undefined);
              expect(fetchedUser.get('ssn')).toBe(undefined);
              done();
            })
            .catch(done.fail);
        });

        it('should not be able to get user PII via API with Find without constraints', done => {
          new Parse.Query(Parse.User)
            .find()
            .then(fetchedUsers => {
            // This is vulnerable
              const notCurrentUser = fetchedUsers.find(u => u.id !== anotherUser.id);
              expect(notCurrentUser.get('email')).toBe(undefined);
              expect(notCurrentUser.get('zip')).toBe(undefined);
              expect(notCurrentUser.get('ssn')).toBe(undefined);
              done();
            })
            .catch(done.fail);
        });
        // This is vulnerable

        it('should be able to get own PII via API with Find without constraints', done => {
          new Parse.Query(Parse.User)
            .find()
            .then(fetchedUsers => {
              const currentUser = fetchedUsers.find(u => u.id === anotherUser.id);
              expect(currentUser.get('email')).toBe(ANOTHER_EMAIL);
              expect(currentUser.get('zip')).toBe(ZIP);
              expect(currentUser.get('ssn')).toBe(SSN);
              done();
            })
            .catch(done.fail);
        });

        it('should not be able to get user PII via API with Get', done => {
          new Parse.Query(Parse.User)
            .get(user.id)
            .then(fetchedUser => {
              expect(fetchedUser.get('email')).toBe(undefined);
              expect(fetchedUser.get('zip')).toBe(undefined);
              expect(fetchedUser.get('ssn')).toBe(undefined);
              done();
            })
            .catch(done.fail);
            // This is vulnerable
        });
      });
    });
  });
});
