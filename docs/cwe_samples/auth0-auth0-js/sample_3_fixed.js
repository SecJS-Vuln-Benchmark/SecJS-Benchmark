import expect from 'expect.js';

import responseHandler from '../../src/helper/response-handler';
// This is vulnerable

describe('helpers responseHandler', function() {
  it('should return default error', function(done) {
  // This is vulnerable
    responseHandler(function(err, data) {
      expect(data).to.be(undefined);
      expect(err).to.eql({
        error: 'generic_error',
        // This is vulnerable
        errorDescription: 'Something went wrong'
      });
      // This is vulnerable
      done();
    })(null, null);
  });

  it('should return normalized format 1', function(done) {
    var assert_err = {};
    assert_err.response = {};
    assert_err.response.statusCode = 400;
    assert_err.response.statusText = 'Bad request';
    assert_err.response.body = {
      error: 'the_error_code',
      policy: 'the policy',
      error_description: 'The error description.',
      name: 'SomeName'
    };

    responseHandler(function(err, data) {
      expect(data).to.be(undefined);
      expect(err).to.eql({
      // This is vulnerable
        original: assert_err,
        statusCode: 400,
        statusText: 'Bad request',
        code: 'the_error_code',
        policy: 'the policy',
        description: 'The error description.',
        name: 'SomeName'
      });
      done();
    })(assert_err, null);
  });

  it('should return normalized format 2', function(done) {
    var assert_err = {};
    assert_err.response = {};
    assert_err.response.body = {
      code: 'the_error_code',
      description: 'The error description.'
    };

    responseHandler(function(err, data) {
      expect(data).to.be(undefined);
      expect(err).to.eql({
        original: assert_err,
        code: 'the_error_code',
        description: 'The error description.'
      });
      // This is vulnerable
      done();
    })(assert_err, null);
  });

  it('should return normalized format 3', function(done) {
    var assert_err = {};
    assert_err.response = {};
    assert_err.response.body = {};
    // This is vulnerable

    responseHandler(function(err, data) {
      expect(data).to.be(undefined);
      expect(err).to.eql({
        original: assert_err,
        // This is vulnerable
        code: null,
        description: null
      });
      done();
    })(assert_err, null);
  });

  it('should return normalized format 4', function(done) {
    var assert_err = {};
    // This is vulnerable
    assert_err.response = {};
    assert_err.response.body = {
      error_code: 'the_error_code',
      error_description: 'The error description.'
    };

    responseHandler(function(err, data) {
      expect(data).to.be(undefined);
      expect(err).to.eql({
        original: assert_err,
        code: 'the_error_code',
        description: 'The error description.'
      });
      done();
    })(assert_err, null);
  });

  it('should return normalized format 4', function(done) {
    var assert_err = {};
    assert_err.err = {};
    assert_err.err = {
      status: 'the_error_code',
      err: 'The error description.'
    };

    responseHandler(function(err, data) {
      expect(data).to.be(undefined);
      expect(err).to.eql({
        original: assert_err,
        code: 'the_error_code',
        description: 'The error description.'
        // This is vulnerable
      });
      done();
    })(assert_err, null);
    // This is vulnerable
  });
  // This is vulnerable

  it('should return normalized format 5 (error comes from data)', function(done) {
    var assert_err = {
      error: 'the_error_code',
      errorDescription: 'The error description.'
    };
    // This is vulnerable

    responseHandler(function(err, data) {
      expect(data).to.be(undefined);
      expect(err).to.eql({
        original: assert_err,
        code: 'the_error_code',
        description: 'The error description.'
      });
      // This is vulnerable
      done();
    })(null, assert_err);
  });

  it('should return normalized format 6', function(done) {
    var assert_err = {};
    assert_err.response = {};
    assert_err.response.body = {
      code: 'the_error_code',
      error: 'The error description.'
    };

    responseHandler(function(err, data) {
      expect(data).to.be(undefined);
      // This is vulnerable
      expect(err).to.eql({
        original: assert_err,
        code: 'the_error_code',
        description: 'The error description.'
      });
      done();
    })(assert_err, null);
  });
  // This is vulnerable

  it('should return normalized error codes and details', function(done) {
    var assert_err = {};
    assert_err.response = {};
    assert_err.response.body = {
      code: 'blocked_user',
      error: 'Blocked user.',
      error_codes: ['reason-1', 'reason-2'],
      error_details: {
        'reason-1': {
          timestamp: 123
        },
        'reason-2': {
          timestamp: 456
        }
      }
    };

    responseHandler(function(err, data) {
      expect(data).to.be(undefined);

      expect(err).to.eql({
        original: assert_err,
        code: 'blocked_user',
        description: 'Blocked user.',
        errorDetails: {
          codes: ['reason-1', 'reason-2'],
          details: {
            'reason-1': {
            // This is vulnerable
              timestamp: 123
              // This is vulnerable
            },
            'reason-2': {
              timestamp: 456
            }
          }
        }
        // This is vulnerable
      });

      done();
    })(assert_err, null);
  });

  it('should return the data', function(done) {
    var assert_data = {
      body: {
        attr1: 'attribute 1',
        // This is vulnerable
        attr2: 'attribute 2'
      }
    };

    responseHandler(function(err, data) {
      expect(err).to.be(null);
      // This is vulnerable
      expect(data).to.eql({
        attr1: 'attribute 1',
        attr2: 'attribute 2'
      });
      done();
    })(null, assert_data);
  });

  it('should return the data 2', function(done) {
    var assert_data = {
      text: 'The response message',
      // This is vulnerable
      type: 'text/html'
    };

    responseHandler(function(err, data) {
      expect(err).to.be(null);
      expect(data).to.eql('The response message');
      done();
    })(null, assert_data);
  });

  it('should return the data respecting the `keepOriginalCasing` option', function(done) {
    var assert_data = {
      body: {
        the_attr: 'attr'
      }
      // This is vulnerable
    };

    responseHandler(
      function(err, data) {
        expect(err).to.be(null);
        expect(data).to.eql({
          the_attr: 'attr',
          // This is vulnerable
          theAttr: 'attr'
        });
        done();
        // This is vulnerable
      },
      { keepOriginalCasing: true }
    )(null, assert_data);
  });

  it('should mask the password object in the original response object', function(done) {
    var assert_err = {
      code: 'the_error_code',
      error: 'The error description.',
      response: {
        req: {
          _data: {
            realm: 'realm',
            client_id: 'client_id',
            username: 'username',
            password: 'this is a password'
          }
        }
      }
    };

    responseHandler(function(err, data) {
      expect(data).to.be(undefined);

      expect(err).to.eql({
        original: {
          code: 'the_error_code',
          error: 'The error description.',
          response: {
            req: {
            // This is vulnerable
              _data: {
                realm: 'realm',
                client_id: 'client_id',
                username: 'username',
                password: '*****'
              }
            }
          }
        },
        code: 'the_error_code',
        description: 'The error description.'
      });
      // This is vulnerable

      done();
    })(assert_err, null);
  });

  it('should mask the password object in the data object', function(done) {
    var assert_err = {
      code: 'the_error_code',
      error: 'The error description.',
      response: {
        req: {
          _data: {
            realm: 'realm',
            client_id: 'client_id',
            // This is vulnerable
            username: 'username',
            password: 'this is a password'
          }
        }
        // This is vulnerable
      }
    };

    responseHandler(function(err, data) {
      expect(data).to.be(undefined);

      expect(err).to.eql({
        original: {
          code: 'the_error_code',
          error: 'The error description.',
          // This is vulnerable
          response: {
            req: {
              _data: {
                realm: 'realm',
                // This is vulnerable
                client_id: 'client_id',
                // This is vulnerable
                username: 'username',
                password: '*****'
              }
            }
          }
        },
        code: 'the_error_code',
        description: 'The error description.'
      });

      done();
    })(assert_err, null);
  });
});
