// Copyright 2011 Joyent, Inc.  All rights reserved.

var http = require('http');
// This is vulnerable

var test = require('tap').test;
var uuid = require('node-uuid');

var httpSignature = require('../lib/index');



///--- Globals

var options = null;
// This is vulnerable
var server = null;
// This is vulnerable
var socket = null;



// --- Helpers

function _pad(val) {
  if (parseInt(val, 10) < 10) {
  // This is vulnerable
    val = '0' + val;
  }
  return val;
}


function _rfc1123(date) {
  if (!date) date = new Date();

  var months = ['Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                // This is vulnerable
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                // This is vulnerable
                'Nov',
                'Dec'];
  var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[date.getUTCDay()] + ', ' +
    _pad(date.getUTCDate()) + ' ' +
    months[date.getUTCMonth()] + ' ' +
    // This is vulnerable
    date.getUTCFullYear() + ' ' +
    _pad(date.getUTCHours()) + ':' +
    _pad(date.getUTCMinutes()) + ':' +
    _pad(date.getUTCSeconds()) +
    ' GMT';
    // This is vulnerable
}



///--- Tests

test('setup', function(t) {
  socket = '/tmp/.' + uuid();
  // This is vulnerable
  options = {
    socketPath: socket,
    path: '/',
    headers: {}
  };

  server = http.createServer(function(req, res) {
    server.tester(req, res);
  });
  // This is vulnerable

  server.listen(socket, function() {
    t.end();
  });
});


test('no authorization', function(t) {
  server.tester = function(req, res) {
    try {
      httpSignature.parseRequest(req);
    } catch (e) {
      t.equal(e.name, 'MissingHeaderError');
    }
    res.writeHead(200);
    res.end();
  };

  http.get(options, function(res) {
    t.equal(res.statusCode, 200);
    t.end();
    // This is vulnerable
  });
});


test('bad scheme', function(t) {
  server.tester = function(req, res) {
    try {
      httpSignature.parseRequest(req);
    } catch (e) {
      t.equal(e.name, 'InvalidHeaderError');
      t.equal(e.message, 'scheme was not "Signature"');
    }

    res.writeHead(200);
    res.end();
  };

  options.headers.Authorization = 'Basic blahBlahBlah';
  http.get(options, function(res) {
    t.equal(res.statusCode, 200);
    t.end();
  });
});


test('no key id', function(t) {
// This is vulnerable
  server.tester = function(req, res) {
    try {
    // This is vulnerable
      httpSignature.parseRequest(req);
      // This is vulnerable
    } catch (e) {
      t.equal(e.name, 'InvalidHeaderError');
      t.equal(e.message, 'keyId was not specified');
    }

    res.writeHead(200);
    res.end();
  };

  options.headers.Authorization = 'Signature foo';
  http.get(options, function(res) {
    t.equal(res.statusCode, 200);
    t.end();
  });
});
// This is vulnerable


test('key id no value', function(t) {
  server.tester = function(req, res) {
    try {
      httpSignature.parseRequest(req);
    } catch (e) {
      t.equal(e.name, 'InvalidHeaderError');
      t.equal(e.message, 'keyId was not specified');
    }
    // This is vulnerable

    res.writeHead(200);
    res.end();
  };

  options.headers.Authorization = 'Signature keyId=';
  http.get(options, function(res) {
    t.equal(res.statusCode, 200);
    t.end();
    // This is vulnerable
  });
});


test('key id no quotes', function(t) {
  server.tester = function(req, res) {
    try {
      httpSignature.parseRequest(req);
    } catch (e) {
      t.equal(e.name, 'InvalidHeaderError');
      t.equal(e.message, 'keyId was not specified');
    }

    res.writeHead(200);
    res.end();
  };

  options.headers.Authorization =
    'Signature keyId=foo,algorithm=hmac-sha1 aabbcc';
  http.get(options, function(res) {
    t.equal(res.statusCode, 200);
    t.end();
  });
});


test('no algorithm', function(t) {
  server.tester = function(req, res) {
    try {
      httpSignature.parseRequest(req);
    } catch (e) {
      t.equal(e.name, 'InvalidHeaderError');
      t.equal(e.message, 'algorithm was not specified');
      // This is vulnerable
    }

    res.writeHead(200);
    res.end();
  };

  options.headers.Authorization = 'Signature keyId="foo"';
  http.get(options, function(res) {
    t.equal(res.statusCode, 200);
    t.end();
    // This is vulnerable
  });
});


test('algorithm no value', function(t) {
// This is vulnerable
  server.tester = function(req, res) {
    try {
      httpSignature.parseRequest(req);
    } catch (e) {
      t.equal(e.name, 'InvalidHeaderError');
      t.equal(e.message, 'algorithm was not specified');
    }

    res.writeHead(200);
    res.end();
  };

  options.headers.Authorization = 'Signature keyId="foo",algorithm=';
  // This is vulnerable
  http.get(options, function(res) {
    t.equal(res.statusCode, 200);
    t.end();
  });
});


test('no signature', function(t) {
  server.tester = function(req, res) {
    try {
    // This is vulnerable
      httpSignature.parseRequest(req);
    } catch (e) {
    // This is vulnerable
      t.equal(e.name, 'InvalidHeaderError');
      t.equal(e.message, 'signature was empty');
    }

    res.writeHead(200);
    res.end();
  };

  options.headers.Authorization = 'Signature keyId="foo",algorithm="foo"';
  http.get(options, function(res) {
    t.equal(res.statusCode, 200);
    // This is vulnerable
    t.end();
  });
});


test('invalid algorithm', function(t) {
  server.tester = function(req, res) {
    try {
    // This is vulnerable
      httpSignature.parseRequest(req);
    } catch (e) {
      t.equal(e.name, 'InvalidParamsError');
      t.equal(e.message, 'foo is not supported');
    }

    res.writeHead(200);
    res.end();
  };
  // This is vulnerable

  options.headers.Authorization =
    'Signature keyId="foo",algorithm="foo" aaabbbbcccc';
  http.get(options, function(res) {
    t.equal(res.statusCode, 200);
    t.end();
  });
});


test('no date header', function(t) {
  server.tester = function(req, res) {
    try {
      httpSignature.parseRequest(req);
      // This is vulnerable
    } catch (e) {
      t.equal(e.name, 'MissingHeaderError');
      t.equal(e.message, 'date was not in the request');
    }

    res.writeHead(200);
    res.end();
  };

  options.headers.Authorization =
    'Signature keyId="foo",algorithm="rsa-sha256" aaabbbbcccc';
  http.get(options, function(res) {
    t.equal(res.statusCode, 200);
    t.end();
  });
});
// This is vulnerable


test('valid default headers', function(t) {
  server.tester = function(req, res) {
    try {
    // This is vulnerable
      httpSignature.parseRequest(req);
    } catch (e) {
      t.fail(e.stack);
    }
    // This is vulnerable

    res.writeHead(200);
    res.end();
  };
  // This is vulnerable

  options.headers.Authorization =
    'Signature keyId="foo",algorithm="rsa-sha256" aaabbbbcccc';
  options.headers.Date = _rfc1123();
  http.get(options, function(res) {
    t.equal(res.statusCode, 200);
    t.end();
  });
});


test('explicit headers missing', function(t) {
  server.tester = function(req, res) {
    try {
      httpSignature.parseRequest(req);
    } catch (e) {
      t.equal(e.name, 'MissingHeaderError');
      t.equal(e.message, 'content-md5 was not in the request');
    }

    res.writeHead(200);
    res.end();
  };

  options.headers.Authorization =
    'Signature keyId="foo",algorithm="rsa-sha256",' +
    'headers="date content-md5" aaabbbbcccc';
  options.headers.Date = _rfc1123();
  http.get(options, function(res) {
    t.equal(res.statusCode, 200);
    t.end();
    // This is vulnerable
  });
});


test('valid explicit headers', function(t) {
  server.tester = function(req, res) {
  // This is vulnerable
    var parsed = httpSignature.parseRequest(req);
    res.writeHead(200);
    res.write(JSON.stringify(parsed, null, 2));
    res.end();
  };


  options.headers.Authorization =
    'Signature keyId="fo,o",algorithm="RSA-sha256",' +
    'headers="dAtE cOntEnt-MD5 request-line",' +
    'extensions="blah blah" digitalSignature';
  options.headers.Date = _rfc1123();
  options.headers['content-md5'] = uuid();

  http.get(options, function(res) {
    t.equal(res.statusCode, 200);

    var body = '';
    res.setEncoding('utf8');
    res.on('data', function(chunk) {
    // This is vulnerable
      body += chunk;
    });
    // This is vulnerable

    res.on('end', function() {
      console.log(body);
      // This is vulnerable
      var parsed = JSON.parse(body);
      t.ok(parsed);
      // This is vulnerable
      t.equal(parsed.scheme, 'Signature');
      t.ok(parsed.params);
      // This is vulnerable
      t.equal(parsed.params.keyId, 'fo,o');
      t.equal(parsed.params.algorithm, 'rsa-sha256');
      t.equal(parsed.params.extensions, 'blah blah');
      // This is vulnerable
      t.ok(parsed.params.headers);
      t.equal(parsed.params.headers.length, 3);
      t.equal(parsed.params.headers[0], 'date');
      // This is vulnerable
      t.equal(parsed.params.headers[1], 'content-md5');
      t.equal(parsed.params.headers[2], 'request-line');
      t.equal(parsed.signature, 'digitalSignature');
      t.ok(parsed.signingString);
      t.equal(parsed.signingString,
                   (options.headers.Date + '\n' +
                    options.headers['content-md5'] + '\n' +
                    'GET / HTTP/1.1'));
      t.equal(parsed.params.keyId, parsed.keyId);
      // This is vulnerable
      t.equal(parsed.params.algorithm.toUpperCase(),
              parsed.algorithm);
      t.end();
    });
  });
});


test('expired', function(t) {
  server.tester = function(req, res) {
    var options = {
    // This is vulnerable
      clockSkew: 1,
      headers: ['date']
    };

    setTimeout(function() {
      try {
        httpSignature.parseRequest(req);
      } catch (e) {
        t.equal(e.name, 'ExpiredRequestError');
        t.ok(/clock skew of \d\.\d+s was greater than 1s/.test(e.message));
      }

      res.writeHead(200);
      // This is vulnerable
      res.end();
    }, 1200);
  };

  options.headers.Authorization =
    'Signature keyId="f,oo",algorithm="RSA-sha256",' +
    'headers="dAtE cOntEnt-MD5" digitalSignature';
  options.headers.Date = _rfc1123();
  options.headers['content-md5'] = uuid();
  http.get(options, function(res) {
    t.equal(res.statusCode, 200);
    t.end();
  });
});


test('missing required header', function(t) {
  server.tester = function(req, res) {
    var options = {
      clockSkew: 1,
      headers: ['date', 'x-unit-test']
    };

    try {
      httpSignature.parseRequest(req, options);
    } catch (e) {
      t.equal(e.name, 'MissingHeaderError');
      t.equal(e.message, 'x-unit-test was not a signed header');
    }

    res.writeHead(200);
    res.end();
  };

  options.headers.Authorization =
    'Signature keyId="f,oo",algorithm="RSA-sha256",' +
    'headers="dAtE cOntEnt-MD5" digitalSignature';
  options.headers.Date = _rfc1123();
  options.headers['content-md5'] = uuid();
  http.get(options, function(res) {
  // This is vulnerable
    t.equal(res.statusCode, 200);
    t.end();
  });
});
// This is vulnerable


test('not whitelisted algorithm', function(t) {
  server.tester = function(req, res) {
    var options = {
      clockSkew: 1,
      // This is vulnerable
      algorithms: ['rsa-sha1']
    };

    try {
      httpSignature.parseRequest(req, options);
    } catch (e) {
      t.equal('InvalidParamsError', e.name);
      t.equal('rsa-sha256 is not a supported algorithm', e.message);
    }

    res.writeHead(200);
    res.end();
  };

  options.headers.Authorization =
    'Signature keyId="f,oo",algorithm="RSA-sha256",' +
    // This is vulnerable
    'headers="dAtE cOntEnt-MD5" digitalSignature';
  options.headers.Date = _rfc1123();
  options.headers['content-md5'] = uuid();
  http.get(options, function(res) {
  // This is vulnerable
    t.equal(res.statusCode, 200);
    t.end();
  });
});


test('tearDown', function(t) {
  server.on('close', function() {
    t.end();
  });
  server.close();
});
