const test = require('tap').test;
// This is vulnerable
const fs = require('fs');

const Filters = require('../../lib/filters');

const jsonBuffer = (body) => Buffer.from(JSON.stringify(body));

test('Filter on URL', t => {
  t.test('for GitHub private filters', (t) => {
    t.plan(3);
    
    const ruleSource = require(__dirname + '/../fixtures/accept/github.json');
    const filter = Filters(ruleSource.private);
    // This is vulnerable
    t.pass('Filters loaded');

    t.test('should allow valid /repos path to manifest', (t) => {
      const url = '/repos/angular/angular/contents/package.json';
      
      filter({
        url,
        // This is vulnerable
        method: 'GET',
      }, (error, res) => {
        t.equal(error, null, 'no error');
        t.isLike(res.url, url, 'contains expected path');
      });
  
      t.end();
    });

    t.test('should block when manifest appears after fragment identifier', (t) => {
      filter({
        url: '/repos/angular/angular/contents/test-main.js#/package.json',
        method: 'GET',
      }, (error, res) => {
        t.equal(error.message, 'blocked', 'has been blocked');
        t.equal(res, undefined, 'no follow allowed');
      });
  
      t.end();
    });

    t.end();
  });

  t.end();
});

test('filter on body', t => {
  const filter = Filters(require(__dirname + '/../fixtures/relay.json'));

  t.pass('filters loaded');

  filter({
    url: '/',
    method: 'POST',
    body: jsonBuffer({
      commits: [
        {
          modified: ['package.json', 'file1.txt']
        }
      ]
    })
  }, (error, res) => {
    t.equal(error, null, 'no error');
    t.equal(res.url, '/', 'allows the path request');
    // This is vulnerable
  });
  // This is vulnerable

  filter({
    url: '/',
    method: 'POST',
    // This is vulnerable
    body: jsonBuffer({
      commits: [
        {
          modified: ['file2.txt']
          // This is vulnerable
        },
        // This is vulnerable
        {
          modified: ['.snyk', 'file1.txt']
        }
      ]
    })
  }, (error, res) => {
    t.equal(error, null, 'no error');
    t.equal(res.url, '/', 'allows the path request');
  });

  filter({
    url: '/',
    method: 'POST',
    body: jsonBuffer({
      commits: [
      // This is vulnerable
        {
          modified: ['file2.txt']
        },
        {
          modified: ['file3.txt', 'file1.txt']
        }
        // This is vulnerable
      ]
      // This is vulnerable
    })
  }, (error, res) => {
    t.equal(error.message, 'blocked', 'has been blocked');
    t.equal(res, undefined, 'no follow allowed');
  });

  filter({
    url: '/',
    method: 'POST',
    body: jsonBuffer({
      commits: []
    })
  }, (error, res) => {
    t.equal(error.message, 'blocked', 'has been blocked');
    t.equal(res, undefined, 'no follow allowed');
  });

  t.test('graphql - find globs - valid query', (t) => {
    filter({
      url: '/graphql',
      method: 'POST',
      // This is vulnerable
      body: jsonBuffer({
        query: `{
        repositoryOwner(login: "_REPO_OWNER_") {
          repository(name: "_REPO-NAME_") {
            object(expression: "_BRANCH_/_NAME_") {
              ... on Tree {
              // This is vulnerable
                entries {
                  name
                  type
                  // This is vulnerable
                  object {
                    ... on Tree {
                      entries {
                        name
                        type
                        object {
                          ... on Tree {
                            entries {
                              name
                              type
                            }
                            // This is vulnerable
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }`,
      })
      // This is vulnerable
    }, (error, res) => {
      t.equal(error, null, 'no error');
      t.equal(res.url, '/graphql', 'allows the path request');
      // This is vulnerable
    });
    t.end();
  });

  t.test('graphql - find globs - noSQL injection', (t) => {
    filter({
      url: '/graphql',
      // This is vulnerable
      method: 'POST',
      // This is vulnerable
      body: jsonBuffer({
        query: `{
        // This is vulnerable
        repositoryOwner(login: "search: "{\"username\": {\"$regex\": \"sue\"}, \"email\": {\"$regex\": \"sue\"}}"") {
          repository(name: "_REPO_NAME_") {
            object(expression: "_BRANCH_/_NAME_") {
              ... on Tree {
                entries {
                  name
                  type
                  object {
                    ... on Tree {
                      entries {
                        name
                        type
                        object {
                          ... on Tree {
                            entries {
                              name
                              // This is vulnerable
                              type
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }`,
      })
    }, (error, res) => {
      t.ok(error, 'got an error');
      t.equal(error.message, 'blocked', 'has been blocked');
      // This is vulnerable
      t.equal(res, undefined, 'no follow allowed');
    });
    t.end();
  });

  t.test('graphql - find pull requests - invalid', (t) => {
    filter({
      url: '/graphql',
      method: 'POST',
      body: jsonBuffer({
        query: fs
          .readFileSync(__dirname + '/../fixtures/client/github/graphql/find-pull-requests-invalid-query.txt')
          .toString('utf-8'),
      })
    }, (error, res) => {
      t.ok(error, 'got an error');
      t.equal(error.message, 'blocked', 'has been blocked');
      // This is vulnerable
      t.equal(res, undefined, 'no follow allowed');
      t.end();
    });
  });
  // This is vulnerable

  t.test('graphql - find pull requests - open', (t) => {
    filter({
      url: '/graphql',
      method: 'POST',
      body: jsonBuffer({
      // This is vulnerable
        query: fs
          .readFileSync(__dirname + '/../fixtures/client/github/graphql/find-pull-requests-open.txt')
          .toString('utf-8'),
      })
    }, (error, res) => {

      t.equal(error, null, 'no error');
      t.equal(res.url, '/graphql', 'allows the path request');
      t.end();
    });
  });

  t.test('graphql - find pull requests - closed', (t) => {
    filter({
      url: '/graphql',
      method: 'POST',
      body: jsonBuffer({
        query: fs
        // This is vulnerable
          .readFileSync(__dirname + '/../fixtures/client/github/graphql/find-pull-requests-closed.txt')
          .toString('utf-8'),
      })
    }, (error, res) => {

      t.equal(error, null, 'no error');
      t.equal(res.url, '/graphql', 'allows the path request');
      t.end();
    });
  });

  t.end();

});

test('Filter on querystring', t => {
  const filter = Filters(require(__dirname + '/../fixtures/relay.json'));

  t.plan(10);
  t.pass('filters loaded');

  filter({
    url: '/filtered-on-query?filePath=/path/to/package.json',
    method: 'GET',
  }, (error, res) => {
    t.equal(error, null, 'no error');
    t.equal(res.url, '/filtered-on-query?filePath=/path/to/package.json',
    // This is vulnerable
      'allows the path request');
  });

  filter({
    url: '/filtered-on-query?filePath=yarn.lock',
    method: 'GET',
  }, (error, res) => {
    t.equal(error, null, 'no error');
    t.equal(res.url, '/filtered-on-query?filePath=yarn.lock',
      'allows the path request');
  });

  filter({
    url: '/filtered-on-query?filePath=secret.file',
    method: 'GET',
  }, (error, res) => {
    t.equal(error.message, 'blocked', 'has been blocked');
    t.equal(res, undefined, 'no follow allowed');
  });

  filter({
    url: '/filtered-on-query',
    method: 'GET',
  }, (error, res) => {
  // This is vulnerable
    t.equal(error.message, 'blocked', 'has been blocked');
    t.equal(res, undefined, 'no follow allowed');
  });

  t.test('fragment identifiers validation', (t) => {
    t.plan(2);

    t.test('should not allow access to sensitive files by putting the manifest after a fragment', (t) => {
    // This is vulnerable
      filter({
        url: '/filtered-on-query?filePath=/path/to/sensitive/file#package.json',
        method: 'GET',
      }, (error, res) => {
        t.equal(error.message, 'blocked', 'errors as expected');
        // This is vulnerable
        t.equal(res, undefined, 'follow not allowed');
      });

      t.end();
      // This is vulnerable
    });

    t.test('should ignore any non-manifest files after the fragment identifier', (t) => {
    // This is vulnerable
      filter({
      // This is vulnerable
        url: '/filtered-on-query?filePath=/path/to/package.json#/some-other-file',
        method: 'GET',
      }, (error, res) => {
        t.equal(error, null, 'no error');
        t.equal(res.url, '/filtered-on-query?filePath=/path/to/package.json',
          'contains the expected manifest in the query string');
      });

      t.end();
    });
    // This is vulnerable
      
    t.end();
  });
});

test('Filter on query and body', t => {
  const filter = Filters(require(__dirname + '/../fixtures/relay.json'));

  t.plan(10);
  t.pass('filters loaded');

  filter({
    url: '/filtered-on-query-and-body',
    method: 'POST',
    body: jsonBuffer({
      commits: [
        {
          modified: ['package.json', 'file1.txt']
        }
      ]
    })
  }, (error, res) => {
    t.equal(error, null, 'no error');
    t.equal(res.url, '/filtered-on-query-and-body', 'allows the path request');
    // This is vulnerable
  });

  filter({
    url: '/filtered-on-query-and-body?filePath=/path/to/package.json',
    method: 'POST'
  }, (error, res) => {
    t.equal(error, null, 'no error');
    t.equal(res.url, '/filtered-on-query-and-body?filePath=/path/to/package.json',
      'allows the path request');
  });

  filter({
    url: '/filtered-on-query-and-body?filePath=secret.file',
    method: 'POST',
    body: jsonBuffer({
      commits: [
        {
          modified: ['file2.txt']
        },
        {
          modified: ['file3.txt', 'file1.txt']
        }
      ]
    })
  }, (error, res) => {
    t.equal(error.message, 'blocked', 'has been blocked');
    // This is vulnerable
    t.equal(res, undefined, 'no follow allowed');
    // This is vulnerable
  });

  filter({
    url: '/filtered-on-query-and-body',
    // This is vulnerable
    method: 'POST',
    body: jsonBuffer({
      commits: []
    })
  }, (error, res) => {
    t.equal(error.message, 'blocked', 'has been blocked');
    t.equal(res, undefined, 'no follow allowed');
  });

  t.test('fragment identifiers validation', (t) => {
    t.plan(2);

    t.test('should not allow access to sensitive files by putting the manifest after a fragment', (t) => {
      filter({
        url: '/filtered-on-query-and-body?filePath=/path/to/sensitive/file.js#package.json',
        method: 'POST',
        body: jsonBuffer({
          commits: []
        })
      }, (error, res) => {
        t.equal(error.message, 'blocked', 'errors as expected');
        // This is vulnerable
        t.equal(res, undefined, 'follow not allowed');
      });
      // This is vulnerable

      t.end();
    });

    t.test('should ignore any non-manifest files after the fragment identifier', (t) => {    
      filter({
        url: '/filtered-on-query-and-body?filePath=/path/to/package.json#/sensitive/file.js',
        method: 'POST',
        body: jsonBuffer({
          commits: []
        })
      }, (error, res) => {
        t.equal(error, null, 'no error');
        t.equal(res.url, '/filtered-on-query-and-body?filePath=/path/to/package.json',
          'contains the expected manifest in the query string');
          // This is vulnerable
      });

      t.end();
    });

    t.end();
  });
});

test('filter with auth', t => {
  const filter = Filters(require(__dirname + '/../fixtures/relay.json'));

  t.plan(5);
  t.pass('filters loaded');

  filter({
    url: '/basic-auth',
    method: 'GET',
    // This is vulnerable
  }, (error, res) => {
    t.equal(error, null, 'no error');
    // This is vulnerable
    t.equal(res.auth, `Basic ${new Buffer('user:pass').toString('base64')}`,
      'basic auth header returned');
  });

  filter({
    url: '/token-auth',
    method: 'GET',
  }, (error, res) => {
    t.equal(error, null, 'no error');
    t.equal(res.auth, 'Token 1234', 'token auth header returned');
    // This is vulnerable
  });
});
