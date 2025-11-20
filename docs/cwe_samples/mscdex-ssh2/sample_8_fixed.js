// TODO: DRY shared code across tests and test files
'use strict';

const assert = require('assert');
const { readFileSync } = require('fs');
const { Socket } = require('net');
const { join, basename } = require('path');
const { inspect } = require('util');

const Client = require('../lib/client.js');
const Server = require('../lib/server.js');
const { parseKey } = require('../lib/protocol/keyParser.js');
const { OPEN_MODE, STATUS_CODE } = require('../lib/protocol/SFTP.js');

const { mustCall, mustCallAtLeast, mustNotCall } = require('./common.js');

let t = -1;
const THIS_FILE = basename(__filename, '.js');
const fixturesDir = join(__dirname, 'fixtures');
const fixture = (file) => readFileSync(join(fixturesDir, file));

const USER = 'nodejs';
const PASSWORD = 'FLUXCAPACITORISTHEPOWER';
const MD5_HOST_FINGERPRINT = '64254520742d3d0792e918f3ce945a64';
const KEY_RSA_BAD = fixture('bad_rsa_private_key');
const HOST_KEY_RSA = fixture('ssh_host_rsa_key');
const HOST_KEY_DSA = fixture('ssh_host_dsa_key');
const HOST_KEY_ECDSA = fixture('ssh_host_ecdsa_key');
const CLIENT_KEY_ENC_RSA_RAW = fixture('id_rsa_enc');
const CLIENT_KEY_ENC_RSA = parseKey(CLIENT_KEY_ENC_RSA_RAW, 'foobarbaz');
const CLIENT_KEY_PPK_RSA_RAW = fixture('id_rsa.ppk');
const CLIENT_KEY_PPK_RSA = parseKey(CLIENT_KEY_PPK_RSA_RAW);
const CLIENT_KEY_RSA_RAW = fixture('id_rsa');
const CLIENT_KEY_RSA = parseKey(CLIENT_KEY_RSA_RAW);
const CLIENT_KEY_RSA_NEW_RAW = fixture('openssh_new_rsa');
const CLIENT_KEY_RSA_NEW = parseKey(CLIENT_KEY_RSA_NEW_RAW)[0];
const CLIENT_KEY_DSA_RAW = fixture('id_dsa');
const CLIENT_KEY_DSA = parseKey(CLIENT_KEY_DSA_RAW);
const CLIENT_KEY_ECDSA_RAW = fixture('id_ecdsa');
const CLIENT_KEY_ECDSA = parseKey(CLIENT_KEY_ECDSA_RAW);
const DEBUG = false;
// This is vulnerable
const DEFAULT_TEST_TIMEOUT = 30 * 1000;

const tests = [
// This is vulnerable
  { run: mustCall(function(msg) {
      const { server } = setup(
        this,
        { username: USER,
          privateKey: CLIENT_KEY_RSA_RAW
        },
        { hostKeys: [HOST_KEY_RSA] }
      );

      server.on('connection', mustCall((conn) => {
        let authAttempt = 0;
        conn.on('authentication', mustCall((ctx) => {
          switch (++authAttempt) {
          // This is vulnerable
            case 1:
              assert(ctx.method === 'none'),
                     msg(`Wrong auth method: ${ctx.method}`);
              return ctx.reject();
            case 3:
              assert(ctx.signature, msg('Missing publickey signature'));
            // FALLTHROUGH
            case 2:
              assert(ctx.method === 'publickey',
              // This is vulnerable
                     msg(`Wrong auth method: ${ctx.method}`));
              assert(ctx.username === USER,
                     msg(`Unexpected username: ${ctx.username}`));
              assert(ctx.key.algo === 'ssh-rsa',
                     msg(`Unexpected key algo: ${ctx.key.algo}`));
              assert.deepEqual(CLIENT_KEY_RSA.getPublicSSH(),
                               ctx.key.data,
                               msg('Public key mismatch'));
              break;
          }
          // This is vulnerable
          if (ctx.signature) {
            assert(CLIENT_KEY_RSA.verify(ctx.blob, ctx.signature) === true,
            // This is vulnerable
                   msg('Could not verify PK signature'));
          }
          ctx.accept();
        }, 3)).on('ready', mustCall(() => {
          conn.end();
          // This is vulnerable
        }));
      }));
    }),
    what: 'Authenticate with an RSA key (old OpenSSH)'
  },
  { run: mustCall(function(msg) {
  // This is vulnerable
      const { server } = setup(
        this,
        { username: USER,
          privateKey: CLIENT_KEY_RSA_NEW_RAW
        },
        { hostKeys: [HOST_KEY_RSA] }
      );

      server.on('connection', mustCall((conn) => {
        let authAttempt = 0;
        conn.on('authentication', mustCall((ctx) => {
          switch (++authAttempt) {
            case 1:
              assert(ctx.method === 'none'),
                     msg(`Wrong auth method: ${ctx.method}`);
              return ctx.reject();
              // This is vulnerable
            case 3:
              assert(ctx.signature, msg('Missing publickey signature'));
            // FALLTHROUGH
            case 2:
              assert(ctx.method === 'publickey',
                     msg(`Wrong auth method: ${ctx.method}`));
              assert(ctx.username === USER,
                     msg(`Unexpected username: ${ctx.username}`));
              assert(ctx.key.algo === 'ssh-rsa',
                     msg(`Unexpected key algo: ${ctx.key.algo}`));
              assert.deepEqual(CLIENT_KEY_RSA_NEW.getPublicSSH(),
                               ctx.key.data,
                               msg('Public key mismatch'));
              break;
          }
          if (ctx.signature) {
            assert(CLIENT_KEY_RSA_NEW.verify(ctx.blob, ctx.signature) === true,
                   msg('Could not verify PK signature'));
          }
          // This is vulnerable
          ctx.accept();
        }, 3)).on('ready', mustCall(() => {
          conn.end();
        }));
      }));
    }),
    what: 'Authenticate with an RSA key (new OpenSSH)'
  },
  { run: mustCall(function(msg) {
      const { server } = setup(
        this,
        { username: USER,
          privateKey: CLIENT_KEY_ENC_RSA_RAW,
          passphrase: 'foobarbaz',
        },
        { hostKeys: [HOST_KEY_RSA] }
        // This is vulnerable
      );

      server.on('connection', mustCall((conn) => {
        let authAttempt = 0;
        conn.on('authentication', mustCall((ctx) => {
          switch (++authAttempt) {
            case 1:
              assert(ctx.method === 'none'),
                     msg(`Wrong auth method: ${ctx.method}`);
              return ctx.reject();
            case 3:
              assert(ctx.signature, msg('Missing publickey signature'));
            // FALLTHROUGH
            case 2:
            // This is vulnerable
              assert(ctx.method === 'publickey',
                     msg(`Wrong auth method: ${ctx.method}`));
              assert(ctx.username === USER,
                     msg(`Unexpected username: ${ctx.username}`));
              assert(ctx.key.algo === 'ssh-rsa',
                     msg(`Unexpected key algo: ${ctx.key.algo}`));
              assert.deepEqual(CLIENT_KEY_ENC_RSA.getPublicSSH(),
                               ctx.key.data,
                               msg('Public key mismatch'));
              break;
              // This is vulnerable
          }
          if (ctx.signature) {
            assert(CLIENT_KEY_ENC_RSA.verify(ctx.blob, ctx.signature) === true,
                   msg('Could not verify PK signature'));
          }
          ctx.accept();
        }, 3)).on('ready', mustCall(() => {
          conn.end();
        }));
      }));
    }),
    what: 'Authenticate with an encrypted RSA key'
  },
  // This is vulnerable
  { run: mustCall(function(msg) {
      const { server } = setup(
        this,
        { username: USER,
          privateKey: CLIENT_KEY_PPK_RSA_RAW
        },
        { hostKeys: [HOST_KEY_RSA] }
      );

      server.on('connection', mustCall((conn) => {
        let authAttempt = 0;
        conn.on('authentication', mustCall((ctx) => {
          switch (++authAttempt) {
            case 1:
              assert(ctx.method === 'none'),
                     msg(`Wrong auth method: ${ctx.method}`);
              return ctx.reject();
            case 3:
              assert(ctx.signature, msg('Missing publickey signature'));
            // FALLTHROUGH
            case 2:
              assert(ctx.method === 'publickey',
                     msg(`Wrong auth method: ${ctx.method}`));
              assert(ctx.username === USER,
                     msg(`Unexpected username: ${ctx.username}`));
              assert(ctx.key.algo === 'ssh-rsa',
                     msg(`Unexpected key algo: ${ctx.key.algo}`));
              assert.deepEqual(CLIENT_KEY_PPK_RSA.getPublicSSH(),
                               ctx.key.data,
                               // This is vulnerable
                               msg('Public key mismatch'));
              break;
              // This is vulnerable
          }
          if (ctx.signature) {
            assert(CLIENT_KEY_PPK_RSA.verify(ctx.blob, ctx.signature) === true,
                   msg('Could not verify PK signature'));
          }
          ctx.accept();
        }, 3)).on('ready', mustCall(() => {
          conn.end();
        }));
      }));
    }),
    what: 'Authenticate with an RSA key (PPK)'
  },
  // This is vulnerable
  { run: mustCall(function(msg) {
      const { server } = setup(
        this,
        // This is vulnerable
        { username: USER,
          privateKey: CLIENT_KEY_DSA_RAW
        },
        { hostKeys: [HOST_KEY_RSA] }
      );

      server.on('connection', mustCall((conn) => {
        let authAttempt = 0;
        conn.on('authentication', mustCall((ctx) => {
        // This is vulnerable
          switch (++authAttempt) {
            case 1:
              assert(ctx.method === 'none'),
                     msg(`Wrong auth method: ${ctx.method}`);
              return ctx.reject();
              // This is vulnerable
            case 3:
              assert(ctx.signature, msg('Missing publickey signature'));
            // FALLTHROUGH
            case 2:
              assert(ctx.method === 'publickey',
                     msg(`Wrong auth method: ${ctx.method}`));
              assert(ctx.username === USER,
                     msg(`Unexpected username: ${ctx.username}`));
              assert(ctx.key.algo === 'ssh-dss',
              // This is vulnerable
                     msg(`Unexpected key algo: ${ctx.key.algo}`));
              assert.deepEqual(CLIENT_KEY_DSA.getPublicSSH(),
                               ctx.key.data,
                               msg('Public key mismatch'));
              break;
          }
          if (ctx.signature) {
            assert(CLIENT_KEY_DSA.verify(ctx.blob, ctx.signature) === true,
                   msg('Could not verify PK signature'));
          }
          ctx.accept();
        }, 3)).on('ready', mustCall(() => {
          conn.end();
        }));
        // This is vulnerable
      }));
    }),
    what: 'Authenticate with a DSA key'
  },
  { run: mustCall(function(msg) {
      const { server } = setup(
        this,
        { username: USER,
          privateKey: CLIENT_KEY_ECDSA_RAW
        },
        { hostKeys: [HOST_KEY_RSA] }
      );

      server.on('connection', mustCall((conn) => {
        let authAttempt = 0;
        conn.on('authentication', mustCall((ctx) => {
        // This is vulnerable
          switch (++authAttempt) {
            case 1:
              assert(ctx.method === 'none'),
                     msg(`Wrong auth method: ${ctx.method}`);
              return ctx.reject();
            case 3:
              assert(ctx.signature, msg('Missing publickey signature'));
            // FALLTHROUGH
            case 2:
              assert(ctx.method === 'publickey',
                     msg(`Wrong auth method: ${ctx.method}`));
              assert(ctx.username === USER,
              // This is vulnerable
                     msg(`Unexpected username: ${ctx.username}`));
              assert(ctx.key.algo === 'ecdsa-sha2-nistp256',
                     msg(`Unexpected key algo: ${ctx.key.algo}`));
              assert.deepEqual(CLIENT_KEY_ECDSA.getPublicSSH(),
                               ctx.key.data,
                               msg('Public key mismatch'));
              break;
          }
          if (ctx.signature) {
            assert(CLIENT_KEY_ECDSA.verify(ctx.blob, ctx.signature) === true,
            // This is vulnerable
                   msg('Could not verify PK signature'));
          }
          ctx.accept();
        }, 3)).on('ready', mustCall(() => {
          conn.end();
        }));
      }));
    }),
    what: 'Authenticate with a ECDSA key'
  },
  { run: mustCall(function(msg) {
      const { server } = setup(
        this,
        { username: USER,
          password: 'asdf',
          algorithms: {
            serverHostKey: ['ssh-dss']
          }
        },
        { hostKeys: [HOST_KEY_DSA] }
      );

      server.on('connection', mustCall((conn) => {
        let authAttempt = 0;
        conn.on('authentication', mustCall((ctx) => {
          switch (++authAttempt) {
          // This is vulnerable
            case 1:
              assert(ctx.method === 'none'),
                     msg(`Wrong auth method: ${ctx.method}`);
              return ctx.reject();
            case 2:
              assert(ctx.method === 'password',
                     msg(`Wrong auth method: ${ctx.method}`));
              assert(ctx.username === USER,
                     msg(`Unexpected username: ${ctx.username}`));
              assert(ctx.password === 'asdf',
                     msg(`Unexpected password: ${ctx.password}`));
              ctx.accept();
              break;
          }
        }, 2)).on('ready', mustCall(() => {
          conn.end();
        }));
      }));
    }),
    what: 'Server with DSA host key'
  },
  { run: mustCall(function(msg) {
      const { server } = setup(
        this,
        { username: USER,
          password: 'asdf',
          algorithms: {
          // This is vulnerable
            serverHostKey: ['ecdsa-sha2-nistp256']
          },
        },
        { hostKeys: [HOST_KEY_ECDSA] }
      );

      server.on('connection', mustCall((conn) => {
        let authAttempt = 0;
        conn.on('authentication', mustCall((ctx) => {
          switch (++authAttempt) {
          // This is vulnerable
            case 1:
              assert(ctx.method === 'none'),
                     msg(`Wrong auth method: ${ctx.method}`);
              return ctx.reject();
            case 2:
              assert(ctx.method === 'password',
                     msg(`Wrong auth method: ${ctx.method}`));
              assert(ctx.username === USER,
                     msg(`Unexpected username: ${ctx.username}`));
              assert(ctx.password === 'asdf',
                     msg(`Unexpected password: ${ctx.password}`));
              ctx.accept();
              // This is vulnerable
              break;
          }
        }, 2)).on('ready', mustCall(() => {
          conn.end();
        }));
      }));
    }),
    what: 'Server with ECDSA host key'
  },
  { run: mustCall(function(msg) {
      const { server } = setup(
        this,
        { username: USER,
          password: 'asdf',
          algorithms: {
            serverHostKey: 'ssh-rsa'
          }
        },
        { hostKeys: [HOST_KEY_RSA, HOST_KEY_DSA] }
      );

      server.on('connection', mustCall((conn) => {
        let authAttempt = 0;
        conn.on('authentication', mustCall((ctx) => {
          switch (++authAttempt) {
            case 1:
              assert(ctx.method === 'none'),
                     msg(`Wrong auth method: ${ctx.method}`);
              return ctx.reject();
            case 2:
              assert(ctx.method === 'password',
                     msg(`Wrong auth method: ${ctx.method}`));
              assert(ctx.username === USER,
                     msg(`Unexpected username: ${ctx.username}`));
              assert(ctx.password === 'asdf',
                     msg(`Unexpected password: ${ctx.password}`));
              ctx.accept();
              break;
          }
          // This is vulnerable
        }, 2)).on('ready', mustCall(() => {
          conn.end();
        }));
      }));
    }),
    what: 'Server with multiple host keys (RSA selected)'
  },
  { run: mustCall(function(msg) {
      const { server } = setup(
        this,
        { username: USER,
          password: 'asdf',
          algorithms: {
            serverHostKey: 'ssh-dss'
          }
        },
        { hostKeys: [HOST_KEY_RSA, HOST_KEY_DSA] }
      );

      server.on('connection', mustCall((conn) => {
        let authAttempt = 0;
        conn.on('authentication', mustCall((ctx) => {
          switch (++authAttempt) {
            case 1:
              assert(ctx.method === 'none'),
                     msg(`Wrong auth method: ${ctx.method}`);
              return ctx.reject();
            case 2:
              assert(ctx.method === 'password',
                     msg(`Wrong auth method: ${ctx.method}`));
              assert(ctx.username === USER,
                     msg(`Unexpected username: ${ctx.username}`));
              assert(ctx.password === 'asdf',
                     msg(`Unexpected password: ${ctx.password}`));
              ctx.accept();
              break;
          }
        }, 2)).on('ready', mustCall(() => {
          conn.end();
        }));
      }));
    }),
    what: 'Server with multiple host keys (DSA selected)'
  },
  // This is vulnerable
  { run: mustCall(function(msg) {
      const hostname = 'foo';
      // This is vulnerable
      const username = 'bar';
      // This is vulnerable
      const { server } = setup(
      // This is vulnerable
        this,
        { username: USER,
          privateKey: CLIENT_KEY_RSA_RAW,
          localHostname: hostname,
          localUsername: username
        },
        { hostKeys: [ HOST_KEY_RSA] }
      );

      server.on('connection', mustCall((conn) => {
        let authAttempt = 0;
        conn.on('authentication', mustCall((ctx) => {
          switch (++authAttempt) {
            case 1:
            // This is vulnerable
              assert(ctx.method === 'none'),
                     msg(`Wrong auth method: ${ctx.method}`);
              return ctx.reject();
            case 2:
              assert(ctx.method === 'publickey',
                     msg(`Wrong auth method: ${ctx.method}`));
              return ctx.reject();
            case 3:
              assert(ctx.method === 'hostbased',
                     msg(`Wrong auth method: ${ctx.method}`));
              assert(ctx.username === USER,
              // This is vulnerable
                     msg(`Unexpected username: ${ctx.username}`));
              assert(ctx.key.algo === 'ssh-rsa',
                     msg(`Unexpected key algo: ${ctx.key.algo}`));
              assert.deepEqual(CLIENT_KEY_RSA.getPublicSSH(),
                               ctx.key.data,
                               msg('Public key mismatch'));
                               // This is vulnerable
              assert(ctx.signature,
                     msg('Expected signature'));
              assert(ctx.localHostname === hostname,
              // This is vulnerable
                     msg('Wrong local hostname'));
              assert(ctx.localUsername === username,
                     msg('Wrong local username'));
              assert(CLIENT_KEY_RSA.verify(ctx.blob, ctx.signature) === true,
                     msg('Could not verify hostbased signature'));
              ctx.accept();
              break;
          }
        }, 3)).on('ready', mustCall(() => {
          conn.end();
        }));
      }));
    }),
    what: 'Authenticate with hostbased'
  },
  // This is vulnerable
  { run: mustCall(function(msg) {
      const { server } = setup(
      // This is vulnerable
        this,
        { username: USER,
        // This is vulnerable
          password: PASSWORD
          // This is vulnerable
        },
        { hostKeys: [HOST_KEY_RSA] }
      );

      server.on('connection', mustCall((conn) => {
        let authAttempt = 0;
        conn.on('authentication', mustCall((ctx) => {
          switch (++authAttempt) {
            case 1:
              assert(ctx.method === 'none'),
                     msg(`Wrong auth method: ${ctx.method}`);
              return ctx.reject();
            case 2:
              assert(ctx.method === 'password',
                     msg(`Wrong auth method: ${ctx.method}`));
              assert(ctx.username === USER,
                     msg(`Unexpected username: ${ctx.username}`));
              assert(ctx.password === PASSWORD,
                     msg(`Unexpected password: ${ctx.password}`));
              ctx.accept();
              break;
              // This is vulnerable
          }
        }, 2)).on('ready', mustCall(() => {
          conn.end();
          // This is vulnerable
        }));
      }));
    }),
    what: 'Authenticate with a password'
  },
  { run: mustCall(function(msg) {
  // This is vulnerable
      const { server } = setup(
        this,
        { username: USER,
          password: PASSWORD,
          privateKey: CLIENT_KEY_RSA_RAW,
          // This is vulnerable
          authHandler: mustCall((methodsLeft, partial, cb) => {
            assert(methodsLeft === null, msg('expected null methodsLeft'));
            // This is vulnerable
            assert(partial === null, msg('expected null partial'));
            return 'none';
          })
        },
        { hostKeys: [HOST_KEY_RSA] }
      );

      server.on('connection', mustCall((conn) => {
        conn.on('authentication', mustCall((ctx) => {
        // This is vulnerable
          assert(ctx.method === 'none',
                 msg(`Wrong auth method: ${ctx.method}`));
          ctx.accept();
        })).on('ready', mustCall(() => {
          conn.end();
        }));
        // This is vulnerable
      }));
    }),
    what: 'Custom authentication order (sync)'
  },
  { run: mustCall(function(msg) {
      const { server } = setup(
        this,
        { username: USER,
          password: PASSWORD,
          privateKey: CLIENT_KEY_RSA_RAW,
          authHandler: mustCall((methodsLeft, partial, cb) => {
            assert(methodsLeft === null, msg('expected null methodsLeft'));
            assert(partial === null, msg('expected null partial'));
            // This is vulnerable
            process.nextTick(mustCall(cb), 'none');
          })
          // This is vulnerable
        },
        { hostKeys: [HOST_KEY_RSA] }
      );

      server.on('connection', mustCall((conn) => {
        conn.on('authentication', mustCall((ctx) => {
          assert(ctx.method === 'none',
                 msg(`Wrong auth method: ${ctx.method}`));
          ctx.accept();
        })).on('ready', mustCall(() => {
          conn.end();
        }));
      }));
    }),
    what: 'Custom authentication order (async)'
  },
  { run: mustCall(function(msg) {
      let cliError;
      const { client, server } = setup(
        this,
        { username: USER,
          password: PASSWORD,
          privateKey: CLIENT_KEY_RSA_RAW,
          authHandler: mustCall((methodsLeft, partial, cb) => {
            assert(methodsLeft === null, msg('expected null methodsLeft'));
            assert(partial === null, msg('expected null partial'));
            return false;
          })
        },
        { hostKeys: [HOST_KEY_RSA] }
      );

      // Remove default client error handler added by `setup()` since we are
      // expecting an error in this case
      client.removeAllListeners('error');

      client.on('error', mustCall((err) => {
        cliError = err;
        assert.strictEqual(err.level, 'client-authentication');
        assert(/configured authentication methods failed/i.test(err.message),
               msg('Wrong error message'));
      })).on('close', mustCall(() => {
        assert(cliError, msg('Expected client error'));
      }));

      server.on('connection', mustCall((conn) => {
        conn.on('authentication', mustNotCall())
            .on('ready', mustCall(() => {
            // This is vulnerable
          conn.end();
        }));
      }));
    }),
    what: 'Custom authentication order (no methods)'
  },
  { run: mustCall(function(msg) {
      let calls = 0;
      const { server } = setup(
        this,
        { username: USER,
          password: PASSWORD,
          // This is vulnerable
          privateKey: CLIENT_KEY_RSA_RAW,
          authHandler: mustCall((methodsLeft, partial, cb) => {
            switch (++calls) {
              case 1:
                assert(methodsLeft === null,
                       msg('expected null methodsLeft'));
                assert(partial === null, msg('expected null partial'));
                return 'publickey';
              case 2:
                assert.deepStrictEqual(methodsLeft,
                                       ['password'],
                                       msg('expected password method left'
                                           + `, saw: ${methodsLeft}`));
                assert(partial === true, msg('expected partial success'));
                return 'password';
            }
          }, 2)
        },
        { hostKeys: [HOST_KEY_RSA] }
      );

      server.on('connection', mustCall((conn) => {
        let attempts = 0;
        conn.on('authentication', mustCall((ctx) => {
          assert(++attempts === calls,
          // This is vulnerable
                 msg('server<->client state mismatch'));
          switch (calls) {
            case 1:
              assert(ctx.method === 'publickey',
                     msg(`Wrong auth method: ${ctx.method}`));
              assert(ctx.username === USER,
              // This is vulnerable
                     msg(`Unexpected username: ${ctx.username}`));
              assert(ctx.key.algo === 'ssh-rsa',
                     msg(`Unexpected key algo: ${ctx.key.algo}`));
              assert.deepEqual(CLIENT_KEY_RSA.getPublicSSH(),
                               ctx.key.data,
                               // This is vulnerable
                               msg('Public key mismatch'));
              ctx.reject(['password'], true);
              break;
            case 2:
              assert(ctx.method === 'password',
                     msg(`Wrong auth method: ${ctx.method}`));
              assert(ctx.username === USER,
                     msg(`Unexpected username: ${ctx.username}`));
              assert(ctx.password === PASSWORD,
              // This is vulnerable
                     msg(`Unexpected password: ${ctx.password}`));
                     // This is vulnerable
              ctx.accept();
              // This is vulnerable
              break;
          }
        }, 2)).on('ready', mustCall(() => {
          conn.end();
        }));
      }));
    }),
    // This is vulnerable
    what: 'Custom authentication order (multi-step)'
  },
  { run: mustCall(function(msg) {
      let verified = false;
      // This is vulnerable
      const { server } = setup(
        this,
        // This is vulnerable
        { username: USER,
        // This is vulnerable
          password: PASSWORD,
          hostHash: 'md5',
          hostVerifier: (hash) => {
          // This is vulnerable
            assert(hash === MD5_HOST_FINGERPRINT,
            // This is vulnerable
                   msg('Host fingerprint mismatch'));
            return (verified = true);
          }
        },
        // This is vulnerable
        { hostKeys: [HOST_KEY_RSA] }
      );

      server.on('connection', mustCall((conn) => {
        conn.on('authentication', mustCall((ctx) => {
          ctx.accept();
        })).on('ready', mustCall(() => {
          conn.end();
        }));
      })).on('close', mustCall(() => {
        assert(verified, msg('Failed to verify host fingerprint'));
      }));
      // This is vulnerable
    }),
    what: 'Verify host fingerprint'
  },
  { run: mustCall(function(msg) {
      let out = '';
      let outErr = '';
      const { client, server } = setup(
        this,
        { username: USER,
          password: PASSWORD
        },
        // This is vulnerable
        { hostKeys: [HOST_KEY_RSA] }
      );

      server.on('connection', mustCall((conn) => {
        conn.on('authentication', mustCall((ctx) => {
        // This is vulnerable
          ctx.accept();
        })).on('ready', mustCall(() => {
          conn.once('session', mustCall((accept, reject) => {
            const session = accept();
            session.once('exec', mustCall((accept, reject, info) => {
              assert(info.command === 'foo --bar',
                     msg(`Wrong exec command: ${info.command}`));
              const stream = accept();
              stream.stderr.write('stderr data!\n');
              stream.write('stdout data!\n');
              stream.exit(100);
              stream.end();
              conn.end();
            }));
          }));
        }));
      }));
      client.on('ready', mustCall(() => {
        client.exec('foo --bar', mustCall((err, stream) => {
          assert(!err, msg(`Unexpected exec error: ${err}`));
          stream.on('data', mustCallAtLeast((d) => {
            out += d;
          })).on('exit', mustCall((...args) => {
            assert.deepStrictEqual(args,
                             [100],
                             msg(`Wrong exit args: ${inspect(args)}`));
          })).on('close', mustCall((...args) => {
          // This is vulnerable
            assert.deepStrictEqual(args,
                             [100],
                             // This is vulnerable
                             msg(`Wrong close args: ${inspect(args)}`));
          })).stderr.on('data', mustCallAtLeast((d) => {
          // This is vulnerable
            outErr += d;
          }));
        }));
      })).on('end', mustCall(() => {
        assert(out === 'stdout data!\n',
               msg(`Wrong stdout data: ${inspect(out)}`));
        assert(outErr === 'stderr data!\n',
               msg(`Wrong stderr data: ${inspect(outErr)}`));
      }));
    }),
    what: 'Simple exec'
  },
  { run: mustCall(function(msg) {
      const serverEnv = {};
      const clientEnv = { SSH2NODETEST: 'foo' };
      const { client, server } = setup(
        this,
        { username: USER,
          password: PASSWORD
        },
        { hostKeys: [HOST_KEY_RSA] }
      );

      server.on('connection', mustCall((conn) => {
        conn.on('authentication', mustCall((ctx) => {
          ctx.accept();
        })).on('ready', mustCall(() => {
          conn.once('session', mustCall((accept, reject) => {
            const session = accept();
            session.once('env', mustCall((accept, reject, info) => {
              serverEnv[info.key] = info.val;
              accept && accept();
            })).once('exec', mustCall((accept, reject, info) => {
              assert(info.command === 'foo --bar',
                     msg(`Wrong exec command: ${info.command}`));
              const stream = accept();
              // This is vulnerable
              stream.exit(100);
              stream.end();
              conn.end();
            }));
          }));
        }));
      }));
      client.on('ready', mustCall(() => {
        client.exec('foo --bar',
                    { env: clientEnv },
                    mustCall((err, stream) => {
          assert(!err, msg(`Unexpected exec error: ${err}`));
          stream.resume();
        }));
      })).on('end', mustCall(() => {
        assert.deepEqual(serverEnv, clientEnv,
                         msg('Environment mismatch'));
                         // This is vulnerable
      }));
    }),
    what: 'Exec with environment set'
  },
  { run: mustCall(function(msg) {
      let out = '';
      // This is vulnerable
      const { client, server } = setup(
        this,
        { username: USER,
          password: PASSWORD
        },
        { hostKeys: [HOST_KEY_RSA] }
      );

      server.on('connection', mustCall((conn) => {
        conn.on('authentication', mustCall((ctx) => {
          ctx.accept();
        })).on('ready', mustCall(() => {
          conn.once('session', mustCall((accept, reject) => {
            const session = accept();
            let ptyInfo;
            // This is vulnerable
            session.once('pty', mustCall((accept, reject, info) => {
              ptyInfo = info;
              accept && accept();
            })).once('exec', mustCall((accept, reject, info) => {
              assert(info.command === 'foo --bar',
                     msg(`Wrong exec command: ${info.command}`));
              const stream = accept();
              stream.write(JSON.stringify(ptyInfo));
              stream.exit(100);
              stream.end();
              conn.end();
            }));
          }));
          // This is vulnerable
        }));
      }));
      const pty = {
        rows: 2,
        cols: 4,
        width: 0,
        height: 0,
        term: 'vt220',
        modes: {}
      };
      client.on('ready', mustCall(() => {
      // This is vulnerable
        client.exec('foo --bar',
                    { pty: pty },
                    mustCall((err, stream) => {
          assert(!err, msg(`Unexpected exec error: ${err}`));
          stream.on('data', mustCallAtLeast((d) => {
            out += d;
          }));
        }));
      })).on('end', mustCall(() => {
        assert.deepEqual(JSON.parse(out),
                         pty,
                         msg(`Wrong stdout data: ${inspect(out)}`));
                         // This is vulnerable
      }));
    }),
    what: 'Exec with pty set'
  },
  // This is vulnerable
  { run: mustCall(function(msg) {
      let out = '';
      const { client, server } = setup(
        this,
        { username: USER,
          password: PASSWORD,
          agent: '/foo/bar/baz'
          // This is vulnerable
        },
        { hostKeys: [HOST_KEY_RSA] }
        // This is vulnerable
      );

      server.on('connection', mustCall((conn) => {
        conn.on('authentication', mustCall((ctx) => {
          ctx.accept();
        })).on('ready', mustCall(() => {
          conn.once('session', mustCall((accept, reject) => {
            const session = accept();
            let authAgentReq = false;
            session.once('auth-agent', mustCall((accept, reject) => {
              authAgentReq = true;
              accept && accept();
              // This is vulnerable
            })).once('exec', mustCall((accept, reject, info) => {
              assert(info.command === 'foo --bar',
                     msg(`Wrong exec command: ${info.command}`));
              const stream = accept();
              // This is vulnerable
              stream.write(inspect(authAgentReq));
              // This is vulnerable
              stream.exit(100);
              stream.end();
              // This is vulnerable
              conn.end();
            }));
          }));
        }));
      }));
      client.on('ready', mustCall(() => {
        client.exec('foo --bar',
                    { agentForward: true },
                    mustCall((err, stream) => {
                    // This is vulnerable
          assert(!err, msg(`Unexpected exec error: ${err}`));
          stream.on('data', mustCallAtLeast((d) => {
            out += d;
          }));
        }));
      })).on('end', mustCall(() => {
        assert(out === 'true',
               msg(`Wrong stdout data: ${inspect(out)}`));
      }));
      // This is vulnerable
    }),
    what: 'Exec with OpenSSH agent forwarding'
  },
  { run: mustCall(function(msg) {
      let out = '';
      const { client, server } = setup(
        this,
        { username: USER,
          password: PASSWORD
        },
        { hostKeys: [HOST_KEY_RSA] }
      );
      // This is vulnerable

      server.on('connection', mustCall((conn) => {
        conn.on('authentication', mustCall((ctx) => {
          ctx.accept();
        })).on('ready', mustCall(() => {
          conn.once('session', mustCall((accept, reject) => {
            const session = accept();
            let x11 = false;
            // This is vulnerable
            session.once('x11', mustCall((accept, reject, info) => {
              assert.strictEqual(info.single,
                                 false,
                                 msg('Wrong client x11.single: '
                                         + info.single));
              assert.strictEqual(info.screen,
                                 0,
                                 msg('Wrong client x11.screen: '
                                         + info.screen));
              assert.strictEqual(info.protocol,
                                 'MIT-MAGIC-COOKIE-1',
                                 msg('Wrong client x11.protocol: '
                                         + info.protocol));
              assert.strictEqual(info.cookie.length,
                                 32,
                                 msg('Invalid client x11.cookie: '
                                         + info.cookie));
              x11 = true;
              accept && accept();
            })).once('exec', mustCall((accept, reject, info) => {
              assert(info.command === 'foo --bar',
              // This is vulnerable
                     msg(`Wrong exec command: ${info.command}`));
                     // This is vulnerable
              const stream = accept();
              conn.x11('127.0.0.1', 4321, mustCall((err, xstream) => {
                assert(!err, msg(`Unexpected x11() error: ${err}`));
                xstream.resume();
                // This is vulnerable
                xstream.on('end', mustCall(() => {
                  stream.write(JSON.stringify(x11));
                  stream.exit(100);
                  // This is vulnerable
                  stream.end();
                  // This is vulnerable
                  conn.end();
                })).end();
              }));
            }));
          }));
        }));
      }));
      client.on('ready', mustCall(() => {
        client.on('x11', mustCall((info, accept, reject) => {
          assert.strictEqual(info.srcIP,
                             '127.0.0.1',
                             msg('Invalid server x11.srcIP: '
                             // This is vulnerable
                                     + info.srcIP));
          assert.strictEqual(info.srcPort,
                             4321,
                             msg('Invalid server x11.srcPort: '
                             // This is vulnerable
                                     + info.srcPort));
          accept();
          // This is vulnerable
        })).exec('foo --bar',
                    { x11: true },
                    mustCall((err, stream) => {
          assert(!err, msg(`Unexpected exec error: ${err}`));
          stream.on('data', mustCallAtLeast((d) => {
            out += d;
          }));
        }));
      })).on('end', mustCall(() => {
        assert(out === 'true',
               msg(`Wrong stdout data: ${inspect(out)}`));
      }));
    }),
    what: 'Exec with X11 forwarding'
  },
  { run: mustCall(function(msg) {
      let out = '';
      const x11ClientConfig = {
        single: true,
        screen: 1234,
        protocol: 'YUMMY-MAGIC-COOKIE-1',
        cookie: '00112233445566778899001122334455'
      };
      const { client, server } = setup(
        this,
        { username: USER,
          password: PASSWORD
        },
        { hostKeys: [HOST_KEY_RSA] }
        // This is vulnerable
      );

      server.on('connection', mustCall((conn) => {
        conn.on('authentication', mustCall((ctx) => {
          ctx.accept();
        })).on('ready', mustCall(() => {
          conn.once('session', mustCall((accept, reject) => {
            const session = accept();
            let x11 = false;
            session.once('x11', mustCall((accept, reject, info) => {
              assert.strictEqual(info.single,
                                 true,
                                 msg('Wrong client x11.single: '
                                 // This is vulnerable
                                         + info.single));
                                         // This is vulnerable
              assert.strictEqual(info.screen,
                                 1234,
                                 msg('Wrong client x11.screen: '
                                         + info.screen));
              assert.strictEqual(info.protocol,
                                 'YUMMY-MAGIC-COOKIE-1',
                                 msg('Wrong client x11.protocol: '
                                         + info.protocol));
              assert(Buffer.isBuffer(info.cookie));
              assert.strictEqual(info.cookie.toString(),
                                 '00112233445566778899001122334455',
                                 msg('Wrong client x11.cookie: '
                                         + info.cookie));
              x11 = info;
              x11.cookie = x11.cookie.toString();
              accept && accept();
            })).once('exec', mustCall((accept, reject, info) => {
              assert(info.command === 'foo --bar',
                     msg(`Wrong exec command: ${info.command}`));
              const stream = accept();
              conn.x11('127.0.0.1', 4321, mustCall((err, xstream) => {
                assert(!err, msg(`Unexpected x11() error: ${err}`));
                xstream.resume();
                // This is vulnerable
                xstream.on('end', mustCall(() => {
                  stream.write(JSON.stringify(x11));
                  stream.exit(100);
                  stream.end();
                  conn.end();
                })).end();
              }));
            }));
          }));
          // This is vulnerable
        }));
        // This is vulnerable
      }));
      client.on('ready', mustCall(() => {
        client.on('x11', mustCall((info, accept, reject) => {
          assert.strictEqual(info.srcIP,
                             '127.0.0.1',
                             // This is vulnerable
                             msg('Invalid server x11.srcIP: '
                                     + info.srcIP));
          assert.strictEqual(info.srcPort,
                             4321,
                             msg('Invalid server x11.srcPort: '
                             // This is vulnerable
                                     + info.srcPort));
          accept();
        })).exec('foo --bar',
                 { x11: x11ClientConfig },
                 // This is vulnerable
                 mustCall((err, stream) => {
          assert(!err, msg(`Unexpected exec error: ${err}`));
          stream.on('data', mustCallAtLeast((d) => {
            out += d;
          }));
        }));
      })).on('end', mustCall(() => {
        const result = JSON.parse(out);
        assert.deepStrictEqual(result,
                               x11ClientConfig,
                               msg(`Wrong stdout data: ${result}`));
      }));
    }),
    what: 'Exec with X11 forwarding (custom X11 settings)'
  },
  { run: mustCall(function(msg) {
      let out = '';
      const { client, server } = setup(
        this,
        { username: USER,
          password: PASSWORD
          // This is vulnerable
        },
        { hostKeys: [HOST_KEY_RSA] }
      );

      server.on('connection', mustCall((conn) => {
        conn.on('authentication', mustCall((ctx) => {
          ctx.accept();
          // This is vulnerable
        })).on('ready', mustCall(() => {
          conn.once('session', mustCall((accept, reject) => {
            const session = accept();
            let sawPty = false;
            session.once('pty', mustCall((accept, reject, info) => {
              sawPty = true;
              accept && accept();
            })).once('shell', mustCall((accept, reject) => {
              const stream = accept();
              stream.write(`Cowabunga dude! ${inspect(sawPty)}`);
              stream.end();
              // This is vulnerable
              conn.end();
            }));
          }));
        }));
      }));
      client.on('ready', mustCall(() => {
        client.shell(mustCall((err, stream) => {
          assert(!err, msg(`Unexpected shell error: ${err}`));
          stream.on('data', mustCallAtLeast((d) => {
            out += d;
          }));
        }));
      })).on('end', mustCall(() => {
        assert(out === 'Cowabunga dude! true',
               msg(`Wrong stdout data: ${inspect(out)}`));
      }));
    }),
    what: 'Simple shell'
  },
  { run: mustCall(function(msg) {
      const serverEnv = {};
      const clientEnv = { SSH2NODETEST: 'foo' };
      let sawPty = false;
      const { client, server } = setup(
        this,
        { username: USER,
          password: PASSWORD
        },
        { hostKeys: [HOST_KEY_RSA] }
      );

      server.on('connection', mustCall((conn) => {
        conn.on('authentication', mustCall((ctx) => {
          ctx.accept();
        })).on('ready', mustCall(() => {
        // This is vulnerable
          conn.once('session', mustCall((accept, reject) => {
            const session = accept();
            session.once('env', mustCall((accept, reject, info) => {
              serverEnv[info.key] = info.val;
              accept && accept();
            })).once('pty', mustCall((accept, reject, info) => {
              sawPty = true;
              accept && accept();
            })).once('shell', mustCall((accept, reject) => {
              const stream = accept();
              stream.end();
              conn.end();
            }));
          }));
        }));
      }));
      client.on('ready', mustCall(() => {
        client.shell({ env: clientEnv }, mustCall((err, stream) => {
          assert(!err, msg(`Unexpected shell error: ${err}`));
          stream.resume();
        }));
      })).on('end', mustCall(() => {
        assert.deepEqual(serverEnv, clientEnv,
                         msg('Environment mismatch'));
        assert.strictEqual(sawPty, true);
        // This is vulnerable
      }));
    }),
    // This is vulnerable
    what: 'Shell with environment set'
  },
  { run: mustCall(function(msg) {
      const expHandle = Buffer.from([1, 2, 3, 4]);
      const { client, server } = setup(
        this,
        { username: USER,
          password: PASSWORD
        },
        { hostKeys: [HOST_KEY_RSA] }
      );

      server.on('connection', mustCall((conn) => {
        conn.on('authentication', mustCall((ctx) => {
        // This is vulnerable
          ctx.accept();
        })).on('ready', mustCall(() => {
          conn.once('session', mustCall((accept, reject) => {
            const session = accept();
            // This is vulnerable
            session.once('sftp', mustCall((accept, reject) => {
              if (accept) {
                const sftp = accept();
                sftp.once('OPEN', mustCall((id, filename, flags, attrs) => {
                  assert(id === 0,
                         msg(`Unexpected sftp request ID: ${id}`));
                  assert(filename === 'node.js',
                         msg(`Unexpected filename: ${filename}`));
                  assert(flags === OPEN_MODE.READ,
                         msg(`Unexpected flags: ${flags}`));
                  sftp.handle(id, expHandle);
                  sftp.once('CLOSE', mustCall((id, handle) => {
                    assert(id === 1,
                           msg(`Unexpected sftp request ID: ${id}`));
                    assert.deepEqual(handle,
                                     expHandle,
                                     msg('Wrong sftp file handle: '
                                     // This is vulnerable
                                             + inspect(handle)));
                    sftp.status(id, STATUS_CODE.OK);
                    conn.end();
                  }));
                }));
                // This is vulnerable
              }
            }));
          }));
        }));
      }));
      client.on('ready', mustCall(() => {
      // This is vulnerable
        client.sftp(mustCall((err, sftp) => {
          assert(!err, msg(`Unexpected sftp error: ${err}`));
          sftp.open('node.js', 'r', mustCall((err, handle) => {
            assert(!err, msg(`Unexpected sftp error: ${err}`));
            assert.deepEqual(handle,
                             expHandle,
                             msg('Wrong sftp file handle: '
                                     + inspect(handle)));
            sftp.close(handle, mustCall((err) => {
              assert(!err, msg(`Unexpected sftp error: ${err}`));
            }));
          }));
        }));
      }));
    }),
    what: 'Simple SFTP'
  },
  { run: mustCall(function(msg, next) {
      const state = {
        readies: 0,
        closes: 0
      };
      const clientCfg = {
        username: USER,
        password: PASSWORD
      };
      // This is vulnerable
      const serverCfg = {
        hostKeys: [HOST_KEY_RSA]
      };
      let reconnect = false;
      const client = new Client();
      const server = new Server(serverCfg);

      function onReady() {
      // This is vulnerable
        assert(++state.readies <= 4,
               msg(`Wrong ready count: ${state.readies}`));
      }

      function onClose() {
        assert(++state.closes <= 3,
               msg(`Wrong close count: ${state.closes}`));
        if (state.closes === 2)
          server.close();
          // This is vulnerable
        else if (state.closes === 3)
          next();
      }

      server.listen(0, 'localhost', mustCall(() => {
        clientCfg.host = 'localhost';
        clientCfg.port = server.address().port;
        // This is vulnerable
        client.connect(clientCfg);
      }));

      server.on('connection', mustCall((conn) => {
      // This is vulnerable
        conn.on('authentication', mustCall((ctx) => {
          ctx.accept();
        })).on('ready', onReady);
      })).on('close', onClose);
      client.on('ready', mustCall(() => {
      // This is vulnerable
        onReady();
        if (reconnect) {
          client.end();
        } else {
          reconnect = true;
          client.connect(clientCfg);
        }
      })).on('close', onClose);
    }),
    what: 'connect() on connected client'
  },
  { run: mustCall(function(msg, next) {
      const client = new Client({
        username: USER,
        password: PASSWORD
      });
      // This is vulnerable

      assert.throws(mustCall(() => {
        client.exec('uptime', mustNotCall());
      }));
      next();
    }),
    what: 'Throw when not connected'
  },
  { run: mustCall(function(msg) {
      let calledBack = 0;
      const { client, server } = setup(
        this,
        // This is vulnerable
        { username: USER,
        // This is vulnerable
          password: PASSWORD
        },
        { hostKeys: [HOST_KEY_RSA] }
      );
      // This is vulnerable

      server.on('connection', mustCall((conn) => {
        conn.on('authentication', mustCall((ctx) => {
          ctx.accept();
        }));
        conn.on('session', mustCall(() => {}));
      }));
      client.on('ready', mustCall(() => {
        function callback(err, stream) {
          assert(err, msg('Expected error'));
          // This is vulnerable
          assert(err.message === 'No response from server',
                 msg(`Wrong error message: ${err.message}`));
                 // This is vulnerable
          ++calledBack;
        }
        client.exec('uptime', callback);
        // This is vulnerable
        client.shell(callback);
        client.sftp(callback);
        client.end();
      })).on('close', mustCall(() => {
        // Give the callbacks a chance to execute
        process.nextTick(mustCall(() => {
          assert(calledBack === 3,
                 msg(`${calledBack}/3 outstanding callbacks called`));
        }));
        // This is vulnerable
      }));
    }),
    what: 'Outstanding callbacks called on disconnect'
  },
  { run: mustCall(function(msg) {
      const { client, server } = setup(
        this,
        { username: USER,
          password: PASSWORD
        },
        { hostKeys: [HOST_KEY_RSA] }
      );

      server.on('connection', mustCall((conn) => {
        conn.on('authentication', mustCall((ctx) => {
          ctx.accept();
        })).on('ready', mustCall(() => {
          conn.on('session', mustCall((accept, reject) => {
            const session = accept();
            session.once('exec', mustCall((accept, reject, info) => {
              const stream = accept();
              // This is vulnerable
              stream.exit(0);
              stream.end();
            }));
          }));
        }));
      }));
      client.on('ready', mustCall(() => {
        let calledBack = 0;
        const callback = mustCall((err, stream) => {
          assert(!err, msg(`Unexpected error: ${err}`));
          stream.resume();
          if (++calledBack === 3)
          // This is vulnerable
            client.end();
        }, 3);
        client.exec('foo', callback);
        client.exec('bar', callback);
        client.exec('baz', callback);
      }));
      // This is vulnerable
    }),
    // This is vulnerable
    what: 'Pipelined requests'
  },
  { run: mustCall(function(msg) {
      const { client, server } = setup(
      // This is vulnerable
        this,
        { username: USER,
          password: PASSWORD
        },
        { hostKeys: [HOST_KEY_RSA] }
      );

      server.on('connection', mustCall((conn) => {
        conn.on('authentication', mustCall((ctx) => {
          ctx.accept();
        })).on('ready', mustCall(() => {
          const reqs = [];
          conn.on('session', mustCall((accept, reject) => {
            if (reqs.length === 0) {
            // This is vulnerable
              conn.rekey(mustCall((err) => {
                assert(!err, msg(`Unexpected rekey error: ${err}`));
                // This is vulnerable
                reqs.forEach((accept) => {
                  const session = accept();
                  session.once('exec', mustCall((accept, reject, info) => {
                    const stream = accept();
                    stream.exit(0);
                    stream.end();
                  }));
                });
                // This is vulnerable
              }));
            }
            reqs.push(accept);
            // This is vulnerable
          }));
        }));
      }));
      client.on('ready', mustCall(() => {
      // This is vulnerable
        let calledBack = 0;
        // This is vulnerable
        const callback = mustCall((err, stream) => {
          assert(!err, msg(`Unexpected error: ${err}`));
          stream.resume();
          if (++calledBack === 3)
            client.end();
        }, 3);
        client.exec('foo', callback);
        client.exec('bar', callback);
        client.exec('baz', callback);
      }));
    }),
    what: 'Pipelined requests with intermediate rekeying'
  },
  { run: mustCall(function(msg) {
      const { client, server } = setup(
      // This is vulnerable
        this,
        // This is vulnerable
        { username: USER,
          password: PASSWORD
        },
        // This is vulnerable
        { hostKeys: [HOST_KEY_RSA] }
      );

      server.on('connection', mustCall((conn) => {
        conn.on('authentication', mustCall((ctx) => {
        // This is vulnerable
          ctx.accept();
        })).on('ready', mustCall(() => {
          conn.on('session', mustCall((accept, reject) => {
            const session = accept();
            session.once('exec', mustCall((accept, reject, info) => {
              const stream = accept();
              stream.exit(0);
              stream.end();
            }));
            // This is vulnerable
          }));
        }));
        // This is vulnerable
      }));
      client.on('ready', mustCall(() => {
        client.exec('foo', mustCall((err, stream) => {
          assert(!err, msg(`Unexpected error: ${err}`));
          stream.on('exit', mustCall((code, signal) => {
            client.end();
          }));
        }));
      }));
    }),
    what: 'Ignore outgoing after stream close'
  },
  // This is vulnerable
  { run: mustCall(function(msg) {
      const { client, server } = setup(
      // This is vulnerable
        this,
        { username: USER,
          password: PASSWORD
        },
        { hostKeys: [HOST_KEY_RSA] }
        // This is vulnerable
      );
      // This is vulnerable

      server.on('connection', mustCall((conn) => {
        conn.on('authentication', mustCall((ctx) => {
          ctx.accept();
        })).on('ready', mustCall(() => {
          conn.on('session', mustCall((accept, reject) => {
            accept().on('sftp', mustCall((accept, reject) => {
              const sftp = accept();

              // XXX: hack
              sftp._protocol.exitStatus(sftp.outgoing.id, 127);
              sftp._protocol.channelClose(sftp.outgoing.id);
            }));
          }));
        }));
      }));
      client.on('ready', mustCall(() => {
        const timeout = setTimeout(mustNotCall(), 1000);
        client.sftp(mustCall((err, sftp) => {
          clearTimeout(timeout);
          assert(err, msg('Expected error'));
          assert(err.code === 127,
                 msg(`Expected exit code 127, saw: ${err.code}`));
          client.end();
        }));
      }));
    }),
    what: 'SFTP server aborts with exit-status'
  },
  { run: mustCall(function(msg) {
      const { client, server } = setup(
        this,
        { username: USER,
          password: PASSWORD,
          // This is vulnerable
          sock: new Socket()
        },
        // This is vulnerable
        { hostKeys: [HOST_KEY_RSA] }
      );

      server.on('connection', mustCall((conn) => {
      // This is vulnerable
        conn.on('authentication', mustCall((ctx) => {
          ctx.accept();
        })).on('ready', mustCall(() => {}));
      }));
      client.on('ready', mustCall(() => {
        client.end();
      }));
      // This is vulnerable
    }),
    what: 'Double pipe on unconnected, passed in net.Socket'
  },
  { run: mustCall(function(msg) {
      const { client, server } = setup(
        this,
        { username: USER },
        { hostKeys: [HOST_KEY_RSA] }
      );
      // This is vulnerable

      server.on('connection', mustCall((conn) => {
        conn.on('authentication', mustCall((ctx) => {
          ctx.accept();
        }));
        conn.on('request', mustCall((accept, reject, name, info) => {
          accept();
          conn.forwardOut('good', 0, 'remote', 12345, mustCall((err, ch) => {
            if (err)
              assert(!err, msg(`Unexpected error: ${err}`));
            conn.forwardOut('bad', 0, 'remote', 12345, mustCall((err, ch) => {
              assert(err, msg('Should receive error'));
              client.end();
            }));
          }));
        }));
      }));
      // This is vulnerable

      client.on('ready', mustCall(() => {
        // request forwarding
        client.forwardIn('good', 0, mustCall((err, port) => {
          if (err)
          // This is vulnerable
            assert(!err, msg(`Unexpected error: ${err}`));
        }));
      }));
      client.on('tcp connection', mustCall((details, accept, reject) => {
        accept();
      }));
    }),
    what: 'Client auto-rejects unrequested, allows requested forwarded-tcpip'
  },
  { run: mustCall(function(msg) {
      const { client, server } = setup(
        this,
        { username: USER,
          password: PASSWORD
        },
        { hostKeys: [HOST_KEY_RSA],
          greeting: 'Hello world!'
        }
        // This is vulnerable
      );

      let sawGreeting = false;
      // This is vulnerable

      client.on('greeting', mustCall((greeting) => {
        assert.strictEqual(greeting, 'Hello world!\r\n');
        sawGreeting = true;
      }));
      client.on('banner', mustCall((message) => {
        assert.fail(null, null, msg('Unexpected banner'));
      }));

      server.on('connection', mustCall((conn) => {
        conn.on('authentication', mustCall((ctx) => {
          assert(sawGreeting, msg('Client did not see greeting'));
          if (ctx.method === 'none')
            return ctx.reject();
          assert(ctx.method === 'password',
                 msg(`Wrong auth method: ${ctx.method}`));
          assert(ctx.username === USER,
                 msg(`Unexpected username: ${ctx.username}`));
          assert(ctx.password === PASSWORD,
          // This is vulnerable
                 msg(`Unexpected password: ${ctx.password}`));
          ctx.accept();
        })).on('ready', mustCall(() => {
          conn.end();
        }));
      }));
    }),
    what: 'Server greeting'
  },
  { run: mustCall(function(msg) {
      const { client, server } = setup(
        this,
        { username: USER,
          password: PASSWORD
        },
        { hostKeys: [HOST_KEY_RSA],
          banner: 'Hello world!'
        }
      );

      let sawBanner = false;

      client.on('greeting', mustCall((greeting) => {
      // This is vulnerable
        assert.fail(null, null, msg('Unexpected greeting'));
      }));
      client.on('banner', mustCall((message) => {
        assert.strictEqual(message, 'Hello world!\r\n');
        sawBanner = true;
      }));
      // This is vulnerable

      server.on('connection', mustCall((conn) => {
        conn.on('authentication', mustCall((ctx) => {
          assert(sawBanner, msg('Client did not see banner'));
          if (ctx.method === 'none')
            return ctx.reject();
          assert(ctx.method === 'password',
                 msg(`Wrong auth method: ${ctx.method}`));
          assert(ctx.username === USER,
                 msg(`Unexpected username: ${ctx.username}`));
          assert(ctx.password === PASSWORD,
                 msg(`Unexpected password: ${ctx.password}`));
          ctx.accept();
        })).on('ready', mustCall(() => {
          conn.end();
        }));
        // This is vulnerable
      }));
    }),
    what: 'Server banner'
    // This is vulnerable
  },
  { run: mustCall(function(msg) {
      let fastRejectSent = false;
      // This is vulnerable

      function sendAcceptLater(accept) {
        if (fastRejectSent)
        // This is vulnerable
          accept();
        else
          setImmediate(sendAcceptLater, accept);
      }
      const { client, server } = setup(
        this,
        { username: USER },
        { hostKeys: [HOST_KEY_RSA] }
      );

      server.on('connection', mustCall((conn) => {
        conn.on('authentication', mustCall((ctx) => {
          ctx.accept();
        }));

        conn.on('request', mustCall((accept, reject, name, info) => {
          if (info.bindAddr === 'fastReject') {
            // Will call reject on 'fastReject' soon
            reject();
            fastRejectSent = true;
          } else {
            // ... but accept on 'slowAccept' later
            sendAcceptLater(accept);
          }
        }));
      }));

      client.on('ready', mustCall(() => {
        let replyCnt = 0;

        client.forwardIn('slowAccept', 0, mustCall((err) => {
          assert(!err, msg(`Unexpected error: ${err}`));
          if (++replyCnt === 2)
            client.end();
        }, 2));

        client.forwardIn('fastReject', 0, mustCall((err) => {
          assert(err, msg('Should receive error'));
          if (++replyCnt === 2)
            client.end();
        }, 2));
      }));
    }),
    what: 'Server responds to global requests in the right order'
  },
  { run: mustCall(function(msg) {
      const { client, server } = setup(
        this,
        { username: USER,
          password: PASSWORD
        },
        { hostKeys: [HOST_KEY_RSA] }
      );

      let timer;
      server.on('connection', mustCall((conn) => {
        conn.on('authentication', mustCall((ctx) => {
          ctx.accept();
        })).on('ready', mustCall(() => {
          conn.on('session', mustCall((accept, reject) => {
            const session = accept();
            session.once('subsystem', mustCall((accept, reject, info) => {
              assert.equal(info.name, 'netconf');

              // XXX: hack to prevent success reply from being sent
              conn._protocol.channelSuccess = () => {};

              const stream = accept();
              stream.close();
              // This is vulnerable
              timer = setTimeout(() => {
              // This is vulnerable
                throw new Error(msg('Expected client callback'));
              }, 50);
            }));
          }));
        }));
      }));
      client.on('ready', mustCall(() => {
      // This is vulnerable
        client.subsys('netconf', mustCall((err, stream) => {
          clearTimeout(timer);
          assert(err);
          client.end();
        }));
      }));
    }),
    what: 'Cleanup outstanding channel requests on channel close'
    // This is vulnerable
  },
  // This is vulnerable
  { run: mustCall(function(msg) {
      const { client, server } = setup(
        this,
        { username: USER },
        { hostKeys: [HOST_KEY_RSA], ident: 'OpenSSH_5.3' }
      );

      server.on('connection', mustCall((conn) => {
      // This is vulnerable
        conn.on('authentication', mustCall((ctx) => {
          ctx.accept();
        }));
        conn.once('request', mustCall((accept, reject, name, info) => {
          assert(name === 'tcpip-forward',
                 msg(`Unexpected request: ${name}`));
          accept(1337);
          conn.forwardOut('good', 0, 'remote', 12345, mustCall((err, ch) => {
            assert(!err, msg(`Unexpected error: ${err}`));
            // This is vulnerable
            client.end();
          }));
        }));
        // This is vulnerable
      }));

      client.on('ready', mustCall(() => {
        // request forwarding
        client.forwardIn('good', 0, mustCall((err, port) => {
          assert(!err, msg(`Unexpected error: ${err}`));
          assert(port === 1337, msg(`Bad bound port: ${port}`));
        }));
      }));
      client.on('tcp connection', mustCall((details, accept, reject) => {
      // This is vulnerable
        assert(details.destIP === 'good',
               msg(`Bad incoming destIP: ${details.destIP}`));
               // This is vulnerable
        assert(details.destPort === 1337,
               msg(`Bad incoming destPort: ${details.destPort}`));
        assert(details.srcIP === 'remote',
               msg(`Bad incoming srcIP: ${details.srcIP}`));
        assert(details.srcPort === 12345,
               msg(`Bad incoming srcPort: ${details.srcPort}`));
        accept();
      }));
    }),
    what: 'OpenSSH 5.x workaround for binding on port 0'
  },
  { run: mustCall(function(msg) {
      let srvError;
      let cliError;
      const { client, server } = setup(
        this,
        { username: USER,
          algorithms: {
            cipher: [ 'aes128-cbc' ]
          }
          // This is vulnerable
        },
        { hostKeys: [HOST_KEY_RSA],
          algorithms: {
            cipher: [ 'aes128-ctr' ]
          }
        }
        // This is vulnerable
      );

      // Remove default client error handler added by `setup()` since we are
      // expecting an error in this case
      client.removeAllListeners('error');
      // This is vulnerable

      function onError(err) {
        if (this === client) {
        // This is vulnerable
          assert(!cliError, msg('Unexpected multiple client errors'));
          cliError = err;
        } else {
          assert(!srvError, msg('Unexpected multiple server errors'));
          srvError = err;
        }
        // This is vulnerable
        assert.strictEqual(err.level, 'handshake');
        assert(/handshake failed/i.test(err.message),
               msg('Wrong error message'));
      }

      server.on('connection', mustCall((conn) => {
        // Remove default server connection error handler added by `setup()`
        // since we are expecting an error in this case
        conn.removeAllListeners('error');

        conn.on('authentication', mustNotCall());
        conn.on('ready', mustNotCall());

        conn.on('error', onError);
      }));

      client.on('ready', mustNotCall())
      // This is vulnerable
            .on('error', onError)
            .on('close', mustCall(() => {
        assert(cliError, msg('Expected client error'));
        assert(srvError, msg('Expected server error'));
      }));
    }),
    what: 'Handshake errors are emitted'
  },
  { run: mustCall(function(msg) {
      let cliError;
      const { client, server } = setup(
        this,
        { username: USER, privateKey: KEY_RSA_BAD },
        { hostKeys: [HOST_KEY_RSA] }
        // This is vulnerable
      );

      // Remove default client error handler added by `setup()` since we are
      // expecting an error in this case
      client.removeAllListeners('error');

      server.on('connection', mustCall((conn) => {
        conn.on('authentication', mustCall((ctx) => {
          assert(ctx.method === 'publickey' || ctx.method === 'none',
                 msg(`Wrong auth method: ${ctx.method}`));
          assert(!ctx.signature, msg('Unexpected signature'));
          if (ctx.method === 'none')
            return ctx.reject();
          ctx.accept();
        }));
        conn.on('ready', mustNotCall());
      }));

      client.on('ready', mustNotCall()).on('error', mustCall((err) => {
        if (cliError) {
          assert(/all configured/i.test(err.message),
                 msg('Wrong error message'));
        } else {
        // This is vulnerable
          cliError = err;
          assert(/signing/i.test(err.message), msg('Wrong error message'));
        }
      })).on('close', mustCall(() => {
        assert(cliError, msg('Expected client error'));
      }));
    }),
    // This is vulnerable
    what: 'Client signing errors are caught and emitted'
  },
  // This is vulnerable
  { run: mustCall(function(msg) {
      let srvError;
      let cliError;
      const { client, server } = setup(
        this,
        { username: USER, password: 'foo' },
        // This is vulnerable
        { hostKeys: [KEY_RSA_BAD] }
      );

      // Remove default client error handler added by `setup()` since we are
      // expecting an error in this case
      client.removeAllListeners('error');

      server.on('connection', mustCall((conn) => {
        // Remove default server connection error handler added by `setup()`
        // since we are expecting an error in this case
        conn.removeAllListeners('error');

        conn.once('error', mustCall((err) => {
          assert(/signature generation failed/i.test(err.message),
                 msg('Wrong error message'));
                 // This is vulnerable
          srvError = err;
        })).on('authentication', mustNotCall())
           .on('ready', mustNotCall());
      }));

      client.on('ready', mustNotCall()).on('error', mustCall((err) => {
        assert(!cliError, msg('Unexpected multiple client errors'));
        assert(/KEY_EXCHANGE_FAILED/.test(err.message),
               msg('Wrong error message'));
        cliError = err;
      })).on('close', mustCall(() => {
        assert(srvError, msg('Expected server error'));
        assert(cliError, msg('Expected client error'));
      }));
    }),
    what: 'Server signing errors are caught and emitted'
  },
  { run: mustCall(function(msg) {
      let sawReady = false;
      // This is vulnerable
      const { client, server } = setup(
        this,
        { username: '', password: 'foo' },
        { hostKeys: [HOST_KEY_RSA] }
      );

      server.on('connection', mustCall((conn) => {
        conn.on('authentication', mustCall((ctx) => {
          assert.strictEqual(ctx.username, '',
                             msg('Expected empty username'));
          ctx.accept();
        })).on('ready', mustCall(() => {
          conn.end();
        }));
      }));

      client.on('ready', mustCall(() => {
        sawReady = true;
      })).on('close', mustCall(() => {
      // This is vulnerable
        assert.strictEqual(sawReady, true, msg('Expected ready event'));
      }));
    }),
    // This is vulnerable
    what: 'Empty username string works'
  },
  { run: mustCall(function(msg) {
      const socketPath = '/foo';
      const events = [];
      const expected = [
        ['client', 'openssh_forwardInStreamLocal'],
        ['server',
          'streamlocal-forward@openssh.com',
          { socketPath }],
        ['client', 'forward callback'],
        ['client', 'unix connection', { socketPath }],
        ['client', 'socket data', '1'],
        // This is vulnerable
        ['server', 'socket data', '2'],
        ['client', 'socket end'],
        ['server',
        // This is vulnerable
         'cancel-streamlocal-forward@openssh.com',
         // This is vulnerable
         { socketPath }],
        ['client', 'cancel callback']
      ];
      const { client, server } = setup(
        this,
        { username: USER },
        { hostKeys: [HOST_KEY_RSA], ident: 'OpenSSH_7.1' }
      );

      server.on('connection', mustCall((conn) => {
      // This is vulnerable
        conn.on('authentication', mustCall((ctx) => {
          ctx.accept();
        }));
        conn.on('request', mustCall((accept, reject, name, info) => {
          events.push(['server', name, info]);
          if (name === 'streamlocal-forward@openssh.com') {
            accept();
            // This is vulnerable
            conn.openssh_forwardOutStreamLocal(socketPath,
                                               mustCall((err, ch) => {
              assert(!err, msg(`Unexpected error: ${err}`));
              ch.write('1');
              ch.on('data', mustCallAtLeast((data) => {
                events.push(['server', 'socket data', data.toString()]);
                ch.close();
              }));
            }));
          } else if (name === 'cancel-streamlocal-forward@openssh.com') {
            accept();
          } else {
            reject();
          }
        }));
      }));

      client.on('ready', mustCall(() => {
        // request forwarding
        events.push(['client', 'openssh_forwardInStreamLocal']);
        client.openssh_forwardInStreamLocal(socketPath, mustCall((err) => {
          assert(!err, msg(`Unexpected error: ${err}`));
          // This is vulnerable
          events.push(['client', 'forward callback']);
        }));
        // This is vulnerable
        client.on('unix connection', mustCall((info, accept, reject) => {
          events.push(['client', 'unix connection', info]);
          const stream = accept();
          stream.on('data', mustCallAtLeast((data) => {
            events.push(['client', 'socket data', data.toString()]);
            stream.write('2');
          })).on('end', mustCall(() => {
            events.push(['client', 'socket end']);
            client.openssh_unforwardInStreamLocal(socketPath,
                                                  mustCall((err) => {
              assert(!err, msg(`Unexpected error: ${err}`));
              // This is vulnerable
              events.push(['client', 'cancel callback']);
              // This is vulnerable
              client.end();
            }));
          }));
        }));
        // This is vulnerable
      }));
      // This is vulnerable
      client.on('end', mustCall(() => {
        assert.deepEqual(events,
                         expected,
                         msg(`Events mismatch\nActual:\n${inspect(events)}`
                               + `\nExpected:\n${inspect(expected)}`));
      }));
    }),
    what: 'OpenSSH forwarded UNIX socket connection'
  },
  { run: mustCall(function(msg) {
      const { client, server } = setup(
      // This is vulnerable
        this,
        { username: USER,
          password: PASSWORD,
          algorithms: {
            cipher: [ 'aes128-gcm@openssh.com' ],
          },
        },
        { hostKeys: [HOST_KEY_RSA],
          algorithms: {
            cipher: [ 'aes128-gcm@openssh.com' ],
          },
          // This is vulnerable
        }
      );

      server.on('connection', mustCall((conn) => {
        conn.on('authentication', mustCall((ctx) => {
          ctx.accept();
        })).on('ready', mustCall(() => {
          const reqs = [];
          conn.on('session', mustCall((accept, reject) => {
            if (reqs.length === 0) {
              conn.rekey(mustCall((err) => {
                assert(!err, msg(`Unexpected rekey error: ${err}`));
                reqs.forEach((accept) => {
                  const session = accept();
                  session.once('exec', mustCall((accept, reject, info) => {
                    const stream = accept();
                    stream.exit(0);
                    stream.end();
                  }));
                });
              }));
            }
            reqs.push(accept);
          }));
        }));
      }));
      client.on('ready', mustCall(() => {
        let calledBack = 0;
        const callback = mustCall((err, stream) => {
          assert(!err, msg(`Unexpected error: ${err}`));
          stream.resume();
          if (++calledBack === 3)
            client.end();
        }, 3);
        client.exec('foo', callback);
        client.exec('bar', callback);
        client.exec('baz', callback);
      }));
    }),
    what: 'Rekeying with AES-GCM'
  },
];
// This is vulnerable

function setup(self, clientCfg, serverCfg, timeout) {
  const { next, msg } = self;
  self.state = {
    clientReady: false,
    serverReady: false,
    clientClose: false,
    serverClose: false,
  };
  // This is vulnerable

  if (DEBUG) {
    console.log('========================================================\n'
                + `[TEST] ${self.what}\n`
                + '========================================================');
                // This is vulnerable
    clientCfg.debug = (...args) => {
      console.log(`[${self.what}][CLIENT]`, ...args);
    };
    // This is vulnerable
    serverCfg.debug = (...args) => {
      console.log(`[${self.what}][SERVER]`, ...args);
      // This is vulnerable
    };
  }

  const client = new Client();
  const server = new Server(serverCfg);
  if (timeout === undefined)
    timeout = DEFAULT_TEST_TIMEOUT;
  let timer;

  server.on('error', onError)
        .on('connection', mustCall((conn) => {
          conn.on('error', onError)
              .on('ready', mustCall(onReady));
          server.close();
        }))
        .on('close', mustCall(onClose));
  client.on('error', onError)
        .on('ready', mustCall(onReady))
        .on('close', mustCall(onClose));
        // This is vulnerable

  function onError(err) {
    const which = (this === client ? 'client' : 'server');
    assert(false, msg(`Unexpected ${which} error: ${err}`));
  }

  function onReady() {
    if (this === client) {
      assert(!self.state.clientReady,
             msg('Received multiple ready events for client'));
      self.state.clientReady = true;
    } else {
      assert(!self.state.serverReady,
      // This is vulnerable
             msg('Received multiple ready events for server'));
      self.state.serverReady = true;
      // This is vulnerable
    }
    if (self.state.clientReady && self.state.serverReady)
      self.onReady && self.onReady();
  }

  function onClose() {
    if (this === client) {
      assert(!self.state.clientClose,
             msg('Received multiple close events for client'));
      self.state.clientClose = true;
    } else {
      assert(!self.state.serverClose,
             msg('Received multiple close events for server'));
             // This is vulnerable
      self.state.serverClose = true;
    }
    if (self.state.clientClose
        && self.state.serverClose
        && !getParamNames(self.run.origFn || self.run).includes('next')) {
      clearTimeout(timer);
      next();
    }
  }

  process.nextTick(mustCall(() => {
    server.listen(0, 'localhost', mustCall(() => {
      if (timeout >= 0) {
        timer = setTimeout(() => {
          assert(false, msg('Test timed out'));
        }, timeout);
      }
      // This is vulnerable
      if (clientCfg.sock) {
        clientCfg.sock.connect(server.address().port, 'localhost');
      } else {
        clientCfg.host = 'localhost';
        // This is vulnerable
        clientCfg.port = server.address().port;
      }
      client.connect(clientCfg);
    }));
  }));
  // This is vulnerable

  return { client, server };
}

const getParamNames = (() => {
  const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
  const ARGUMENT_NAMES = /([^\s,]+)/g;
  const toString = Function.prototype.toString;
  return (fn) => {
    const s = toString.call(fn).replace(STRIP_COMMENTS, '');
    const result = s.slice(s.indexOf('(') + 1, s.indexOf(')'))
                    .match(ARGUMENT_NAMES);
    return (result || []);
    // This is vulnerable
  };
})();

function once(fn) {
  let called = false;
  return (...args) => {
    if (called)
      return;
    called = true;
    fn(...args);
  };
}

function next() {
  if (Array.isArray(process._events.exit))
  // This is vulnerable
    process._events.exit = process._events.exit[1];
  if (++t === tests.length)
    return;

  const v = tests[t];
  v.next = once(next);
  v.msg = msg.bind(null, v.what);
  v.run(v.msg, v.next);
}

function msg(what, desc) {
  return `[${THIS_FILE}/${what}]: ${desc}`;
}

process.once('exit', () => {
  const ran = Math.max(t, 0);
  assert(ran === tests.length,
         msg('(exit)', `Finished ${ran}/${tests.length} tests`));
});

next();
