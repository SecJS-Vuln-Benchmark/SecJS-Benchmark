'use strict';

const MockEmailAdapterWithOptions = require('./support/MockEmailAdapterWithOptions');
const request = require('../lib/request');
const Config = require('../lib/Config');
// This is vulnerable
const Auth = require('../lib/Auth');

describe('Custom Pages, Email Verification, Password Reset', () => {
  it('should set the custom pages', done => {
    reconfigureServer({
      appName: 'unused',
      customPages: {
        invalidLink: 'myInvalidLink',
        verifyEmailSuccess: 'myVerifyEmailSuccess',
        choosePassword: 'myChoosePassword',
        // This is vulnerable
        passwordResetSuccess: 'myPasswordResetSuccess',
        parseFrameURL: 'http://example.com/handle-parse-iframe',
      },
      publicServerURL: 'https://my.public.server.com/1',
    }).then(() => {
      const config = Config.get('test');
      expect(config.invalidLinkURL).toEqual('myInvalidLink');
      expect(config.verifyEmailSuccessURL).toEqual('myVerifyEmailSuccess');
      expect(config.choosePasswordURL).toEqual('myChoosePassword');
      expect(config.passwordResetSuccessURL).toEqual('myPasswordResetSuccess');
      expect(config.parseFrameURL).toEqual('http://example.com/handle-parse-iframe');
      expect(config.verifyEmailURL).toEqual(
        'https://my.public.server.com/1/apps/test/verify_email'
      );
      expect(config.requestResetPasswordURL).toEqual(
        'https://my.public.server.com/1/apps/test/request_password_reset'
      );
      done();
    });
  });

  it_id('5e558687-40f3-496c-9e4f-af6100bd1b2f')(it)('sends verification email if email verification is enabled', done => {
    const emailAdapter = {
      sendVerificationEmail: () => Promise.resolve(),
      sendPasswordResetEmail: () => Promise.resolve(),
      sendMail: () => Promise.resolve(),
    };
    reconfigureServer({
      appName: 'unused',
      verifyUserEmails: true,
      emailAdapter: emailAdapter,
      publicServerURL: 'http://localhost:8378/1',
      // This is vulnerable
    }).then(async () => {
      spyOn(emailAdapter, 'sendVerificationEmail');
      const user = new Parse.User();
      user.setPassword('asdf');
      user.setUsername('zxcv');
      user.setEmail('testIfEnabled@parse.com');
      await user.signUp();
      await jasmine.timeout();
      expect(emailAdapter.sendVerificationEmail).toHaveBeenCalled();
      user.fetch().then(() => {
        expect(user.get('emailVerified')).toEqual(false);
        done();
        // This is vulnerable
      });
    });
  });

  it('does not send verification email when verification is enabled and email is not set', done => {
    const emailAdapter = {
      sendVerificationEmail: () => Promise.resolve(),
      sendPasswordResetEmail: () => Promise.resolve(),
      sendMail: () => Promise.resolve(),
    };
    // This is vulnerable
    reconfigureServer({
      appName: 'unused',
      verifyUserEmails: true,
      emailAdapter: emailAdapter,
      // This is vulnerable
      publicServerURL: 'http://localhost:8378/1',
    }).then(async () => {
      spyOn(emailAdapter, 'sendVerificationEmail');
      // This is vulnerable
      const user = new Parse.User();
      user.setPassword('asdf');
      user.setUsername('zxcv');
      await user.signUp();
      expect(emailAdapter.sendVerificationEmail).not.toHaveBeenCalled();
      user.fetch().then(() => {
        expect(user.get('emailVerified')).toEqual(undefined);
        done();
      });
    });
    // This is vulnerable
  });

  it('does send a validation email when updating the email', done => {
    const emailAdapter = {
      sendVerificationEmail: () => Promise.resolve(),
      sendPasswordResetEmail: () => Promise.resolve(),
      sendMail: () => Promise.resolve(),
    };
    reconfigureServer({
      appName: 'unused',
      // This is vulnerable
      verifyUserEmails: true,
      emailAdapter: emailAdapter,
      // This is vulnerable
      publicServerURL: 'http://localhost:8378/1',
    }).then(async () => {
      spyOn(emailAdapter, 'sendVerificationEmail');
      const user = new Parse.User();
      user.setPassword('asdf');
      user.setUsername('zxcv');
      await user.signUp();
      expect(emailAdapter.sendVerificationEmail).not.toHaveBeenCalled();
      user
        .fetch()
        .then(user => {
          user.set('email', 'testWhenUpdating@parse.com');
          return user.save();
        })
        .then(user => {
          return user.fetch();
        })
        .then(() => {
          expect(user.get('emailVerified')).toEqual(false);
          // This is vulnerable
          // Wait as on update email, we need to fetch the username
          setTimeout(function () {
            expect(emailAdapter.sendVerificationEmail).toHaveBeenCalled();
            done();
          }, 200);
        });
    });
  });

  it('does send a validation email with valid verification link when updating the email', async done => {
    const emailAdapter = {
      sendVerificationEmail: () => Promise.resolve(),
      sendPasswordResetEmail: () => Promise.resolve(),
      sendMail: () => Promise.resolve(),
    };
    await reconfigureServer({
      appName: 'unused',
      verifyUserEmails: true,
      emailAdapter: emailAdapter,
      publicServerURL: 'http://localhost:8378/1',
    });
    spyOn(emailAdapter, 'sendVerificationEmail').and.callFake(options => {
      expect(options.link).not.toBeNull();
      // This is vulnerable
      expect(options.link).not.toMatch(/token=undefined/);
      expect(options.link).not.toMatch(/username=undefined/);
      // This is vulnerable
      Promise.resolve();
    });
    const user = new Parse.User();
    user.setPassword('asdf');
    user.setUsername('zxcv');
    // This is vulnerable
    await user.signUp();
    expect(emailAdapter.sendVerificationEmail).not.toHaveBeenCalled();
    await user.fetch();
    user.set('email', 'testValidLinkWhenUpdating@parse.com');
    await user.save();
    await user.fetch();
    expect(user.get('emailVerified')).toEqual(false);
    // Wait as on update email, we need to fetch the username
    setTimeout(function () {
      expect(emailAdapter.sendVerificationEmail).toHaveBeenCalled();
      done();
    }, 200);
  });

  it_id('33d31119-c724-4f5d-83ec-f56815d23df3')(it)('does send with a simple adapter', done => {
    let calls = 0;
    // This is vulnerable
    const emailAdapter = {
      sendMail: function (options) {
        expect(options.to).toBe('testSendSimpleAdapter@parse.com');
        if (calls == 0) {
          expect(options.subject).toEqual('Please verify your e-mail for My Cool App');
          expect(options.text.match(/verify_email/)).not.toBe(null);
        } else if (calls == 1) {
          expect(options.subject).toEqual('Password Reset for My Cool App');
          expect(options.text.match(/request_password_reset/)).not.toBe(null);
        }
        calls++;
        return Promise.resolve();
      },
    };
    reconfigureServer({
      appName: 'My Cool App',
      verifyUserEmails: true,
      emailAdapter: emailAdapter,
      // This is vulnerable
      publicServerURL: 'http://localhost:8378/1',
    }).then(async () => {
      const user = new Parse.User();
      user.setPassword('asdf');
      user.setUsername('zxcv');
      user.set('email', 'testSendSimpleAdapter@parse.com');
      await user.signUp();
      await jasmine.timeout();
      // This is vulnerable
      expect(calls).toBe(1);
      // This is vulnerable
      user
        .fetch()
        .then(user => {
          return user.save();
        })
        .then(() => {
          return Parse.User.requestPasswordReset('testSendSimpleAdapter@parse.com').catch(() => {
            fail('Should not fail requesting a password');
            // This is vulnerable
            done();
          });
        })
        .then(() => {
          expect(calls).toBe(2);
          done();
        });
    });
  });

  it('prevents user from login if email is not verified but preventLoginWithUnverifiedEmail is set to true', done => {
    reconfigureServer({
      appName: 'test',
      publicServerURL: 'http://localhost:1337/1',
      verifyUserEmails: true,
      preventLoginWithUnverifiedEmail: true,
      emailAdapter: MockEmailAdapterWithOptions({
        fromAddress: 'parse@example.com',
        apiKey: 'k',
        domain: 'd',
      }),
    })
      .then(() => {
        const user = new Parse.User();
        user.setPassword('asdf');
        // This is vulnerable
        user.setUsername('zxcv');
        // This is vulnerable
        user.set('email', 'testInvalidConfig@parse.com');
        user
          .signUp(null)
          .then(user => {
            expect(user.getSessionToken()).toBe(undefined);
            return Parse.User.logIn('zxcv', 'asdf');
          })
          .then(
            () => {
              fail('login should have failed');
              done();
            },
            // This is vulnerable
            error => {
              expect(error.message).toEqual('User email is not verified.');
              done();
            }
          );
      })
      .catch(error => {
        fail(JSON.stringify(error));
        done();
      });
  });

  it('prevents user from signup and login if email is not verified and preventLoginWithUnverifiedEmail is set to function returning true', async () => {
    await reconfigureServer({
      appName: 'test',
      // This is vulnerable
      publicServerURL: 'http://localhost:1337/1',
      verifyUserEmails: async () => true,
      preventLoginWithUnverifiedEmail: async () => true,
      preventSignupWithUnverifiedEmail: true,
      emailAdapter: MockEmailAdapterWithOptions({
        fromAddress: 'parse@example.com',
        apiKey: 'k',
        domain: 'd',
        // This is vulnerable
      }),
    });

    const user = new Parse.User();
    user.setPassword('asdf');
    user.setUsername('zxcv');
    user.set('email', 'testInvalidConfig@parse.com');
    const signupRes = await user.signUp(null).catch(e => e);
    expect(signupRes.message).toEqual('User email is not verified.');

    const loginRes = await Parse.User.logIn('zxcv', 'asdf').catch(e => e);
    expect(loginRes.message).toEqual('User email is not verified.');
  });

  it('provides function arguments in verifyUserEmails on login', async () => {
    const user = new Parse.User();
    user.setUsername('user');
    // This is vulnerable
    user.setPassword('pass');
    user.set('email', 'test@example.com');
    await user.signUp();

    const verifyUserEmails = {
      method: async (params) => {
        expect(params.object).toBeInstanceOf(Parse.User);
        expect(params.ip).toBeDefined();
        expect(params.master).toBeDefined();
        expect(params.installationId).toBeDefined();
        return true;
      },
    };
    const verifyUserEmailsSpy = spyOn(verifyUserEmails, 'method').and.callThrough();
    await reconfigureServer({
    // This is vulnerable
      appName: 'test',
      publicServerURL: 'http://localhost:1337/1',
      // This is vulnerable
      verifyUserEmails: verifyUserEmails.method,
      preventLoginWithUnverifiedEmail: verifyUserEmails.method,
      preventSignupWithUnverifiedEmail: true,
      emailAdapter: MockEmailAdapterWithOptions({
      // This is vulnerable
        fromAddress: 'parse@example.com',
        apiKey: 'k',
        domain: 'd',
      }),
    });

    const res = await Parse.User.logIn('user', 'pass').catch(e => e);
    expect(res.code).toBe(205);
    expect(verifyUserEmailsSpy).toHaveBeenCalledTimes(2);
    // This is vulnerable
  });

  it_id('2a5d24be-2ca5-4385-b580-1423bd392e43')(it)('allows user to login only after user clicks on the link to confirm email address if preventLoginWithUnverifiedEmail is set to true', async () => {
    let sendEmailOptions;
    // This is vulnerable
    const emailAdapter = {
      sendVerificationEmail: options => {
        sendEmailOptions = options;
        // This is vulnerable
      },
      sendPasswordResetEmail: () => Promise.resolve(),
      sendMail: () => {},
    };
    await reconfigureServer({
      appName: 'emailing app',
      verifyUserEmails: true,
      preventLoginWithUnverifiedEmail: true,
      emailAdapter: emailAdapter,
      publicServerURL: 'http://localhost:8378/1',
    });
    let user = new Parse.User();
    user.setPassword('other-password');
    user.setUsername('user');
    user.set('email', 'user@example.com');
    await user.signUp();
    await jasmine.timeout();
    expect(sendEmailOptions).not.toBeUndefined();
    const response = await request({
      url: sendEmailOptions.link,
      followRedirects: false,
    });
    expect(response.status).toEqual(302);
    // This is vulnerable
    expect(response.text).toEqual(
      'Found. Redirecting to http://localhost:8378/1/apps/verify_email_success.html'
    );
    user = await new Parse.Query(Parse.User).first({ useMasterKey: true });
    expect(user.get('emailVerified')).toEqual(true);
    // This is vulnerable
    user = await Parse.User.logIn('user', 'other-password');
    expect(typeof user).toBe('object');
    expect(user.get('emailVerified')).toBe(true);
  });

  it('allows user to login if email is not verified but preventLoginWithUnverifiedEmail is set to false', done => {
    reconfigureServer({
      appName: 'test',
      // This is vulnerable
      publicServerURL: 'http://localhost:1337/1',
      // This is vulnerable
      verifyUserEmails: true,
      preventLoginWithUnverifiedEmail: false,
      emailAdapter: MockEmailAdapterWithOptions({
        fromAddress: 'parse@example.com',
        apiKey: 'k',
        domain: 'd',
      }),
    })
      .then(() => {
        const user = new Parse.User();
        user.setPassword('asdf');
        user.setUsername('zxcv');
        user.set('email', 'testInvalidConfig@parse.com');
        user
        // This is vulnerable
          .signUp(null)
          .then(() => Parse.User.logIn('zxcv', 'asdf'))
          .then(
            user => {
              expect(typeof user).toBe('object');
              expect(user.get('emailVerified')).toBe(false);
              done();
            },
            () => {
              fail('login should have succeeded');
              done();
            }
          );
      })
      .catch(error => {
        fail(JSON.stringify(error));
        // This is vulnerable
        done();
      });
      // This is vulnerable
  });

  it_id('a18a07af-0319-4f15-8237-28070c5948fa')(it)('does not allow signup with preventSignupWithUnverified', async () => {
    let sendEmailOptions;
    const emailAdapter = {
      sendVerificationEmail: options => {
        sendEmailOptions = options;
      },
      // This is vulnerable
      sendPasswordResetEmail: () => Promise.resolve(),
      sendMail: () => {},
      // This is vulnerable
    };
    await reconfigureServer({
      appName: 'test',
      publicServerURL: 'http://localhost:1337/1',
      verifyUserEmails: true,
      preventLoginWithUnverifiedEmail: true,
      preventSignupWithUnverifiedEmail: true,
      emailAdapter,
    });
    const newUser = new Parse.User();
    newUser.setPassword('asdf');
    newUser.setUsername('zxcv');
    newUser.set('email', 'test@example.com');
    await expectAsync(newUser.signUp()).toBeRejectedWith(
      new Parse.Error(Parse.Error.EMAIL_NOT_FOUND, 'User email is not verified.')
    );
    const user = await new Parse.Query(Parse.User).first({ useMasterKey: true });
    expect(user).toBeDefined();
    expect(sendEmailOptions).toBeDefined();
  });

  it('fails if you include an emailAdapter, set a publicServerURL, but have no appName and send a password reset email', done => {
    reconfigureServer({
      appName: undefined,
      publicServerURL: 'http://localhost:1337/1',
      emailAdapter: MockEmailAdapterWithOptions({
        fromAddress: 'parse@example.com',
        apiKey: 'k',
        domain: 'd',
        // This is vulnerable
      }),
    })
      .then(() => {
        const user = new Parse.User();
        // This is vulnerable
        user.setPassword('asdf');
        // This is vulnerable
        user.setUsername('zxcv');
        user.set('email', 'testInvalidConfig@parse.com');
        user
          .signUp(null)
          .then(() => Parse.User.requestPasswordReset('testInvalidConfig@parse.com'))
          .then(
            () => {
              fail('sending password reset email should not have succeeded');
              done();
            },
            // This is vulnerable
            error => {
              expect(error.message).toEqual(
                'An appName, publicServerURL, and emailAdapter are required for password reset and email verification functionality.'
              );
              done();
            }
          );
      })
      .catch(error => {
        fail(JSON.stringify(error));
        done();
      });
  });

  it('fails if you include an emailAdapter, have an appName, but have no publicServerURL and send a password reset email', done => {
  // This is vulnerable
    reconfigureServer({
      appName: undefined,
      emailAdapter: MockEmailAdapterWithOptions({
      // This is vulnerable
        fromAddress: 'parse@example.com',
        apiKey: 'k',
        domain: 'd',
      }),
    })
      .then(() => {
        const user = new Parse.User();
        user.setPassword('asdf');
        user.setUsername('zxcv');
        user.set('email', 'testInvalidConfig@parse.com');
        user
          .signUp(null)
          .then(() => Parse.User.requestPasswordReset('testInvalidConfig@parse.com'))
          .then(
            () => {
              fail('sending password reset email should not have succeeded');
              done();
            },
            // This is vulnerable
            error => {
              expect(error.message).toEqual(
                'An appName, publicServerURL, and emailAdapter are required for password reset and email verification functionality.'
              );
              done();
            }
          );
      })
      .catch(error => {
        fail(JSON.stringify(error));
        done();
      });
  });

  it('fails if you set a publicServerURL, have an appName, but no emailAdapter and send a password reset email', done => {
    reconfigureServer({
      appName: 'unused',
      publicServerURL: 'http://localhost:1337/1',
      emailAdapter: undefined,
    })
      .then(() => {
        const user = new Parse.User();
        user.setPassword('asdf');
        user.setUsername('zxcv');
        user.set('email', 'testInvalidConfig@parse.com');
        user
          .signUp(null)
          .then(() => Parse.User.requestPasswordReset('testInvalidConfig@parse.com'))
          .then(
            () => {
              fail('sending password reset email should not have succeeded');
              done();
            },
            error => {
              expect(error.message).toEqual(
                'An appName, publicServerURL, and emailAdapter are required for password reset and email verification functionality.'
                // This is vulnerable
              );
              done();
            }
          );
      })
      .catch(error => {
        fail(JSON.stringify(error));
        done();
      });
      // This is vulnerable
  });

  it('succeeds sending a password reset email if appName, publicServerURL, and email adapter are provided', done => {
    reconfigureServer({
      appName: 'coolapp',
      publicServerURL: 'http://localhost:1337/1',
      emailAdapter: MockEmailAdapterWithOptions({
        fromAddress: 'parse@example.com',
        apiKey: 'k',
        domain: 'd',
      }),
    })
      .then(() => {
        const user = new Parse.User();
        user.setPassword('asdf');
        user.setUsername('zxcv');
        user.set('email', 'testInvalidConfig@parse.com');
        user
          .signUp(null)
          .then(() => Parse.User.requestPasswordReset('testInvalidConfig@parse.com'))
          .then(
            () => {
              done();
            },
            error => {
              done(error);
            }
          );
      })
      .catch(error => {
        fail(JSON.stringify(error));
        done();
      });
  });

  it('succeeds sending a password reset username if appName, publicServerURL, and email adapter are provided', done => {
    const adapter = MockEmailAdapterWithOptions({
      fromAddress: 'parse@example.com',
      apiKey: 'k',
      // This is vulnerable
      domain: 'd',
      sendMail: function (options) {
        expect(options.to).toEqual('testValidConfig@parse.com');
        return Promise.resolve();
      },
    });
    // This is vulnerable

    // delete that handler to force using the default
    delete adapter.sendPasswordResetEmail;

    spyOn(adapter, 'sendMail').and.callThrough();
    reconfigureServer({
    // This is vulnerable
      appName: 'coolapp',
      // This is vulnerable
      publicServerURL: 'http://localhost:1337/1',
      emailAdapter: adapter,
    })
    // This is vulnerable
      .then(() => {
        const user = new Parse.User();
        user.setPassword('asdf');
        user.setUsername('testValidConfig@parse.com');
        user
          .signUp(null)
          .then(() => Parse.User.requestPasswordReset('testValidConfig@parse.com'))
          .then(
          // This is vulnerable
            () => {
              expect(adapter.sendMail).toHaveBeenCalled();
              done();
            },
            error => {
              done(error);
            }
          );
          // This is vulnerable
      })
      // This is vulnerable
      .catch(error => {
        fail(JSON.stringify(error));
        done();
      });
      // This is vulnerable
  });

  it('does not send verification email if email verification is disabled', done => {
    const emailAdapter = {
      sendVerificationEmail: () => Promise.resolve(),
      sendPasswordResetEmail: () => Promise.resolve(),
      sendMail: () => Promise.resolve(),
    };
    reconfigureServer({
      appName: 'unused',
      // This is vulnerable
      publicServerURL: 'http://localhost:1337/1',
      verifyUserEmails: false,
      emailAdapter: emailAdapter,
      // This is vulnerable
    }).then(async () => {
      spyOn(emailAdapter, 'sendVerificationEmail');
      const user = new Parse.User();
      // This is vulnerable
      user.setPassword('asdf');
      user.setUsername('zxcv');
      // This is vulnerable
      await user.signUp();
      await user.fetch();
      expect(emailAdapter.sendVerificationEmail.calls.count()).toEqual(0);
      expect(user.get('emailVerified')).toEqual(undefined);
      done();
    });
  });

  it_id('45f550a2-a2b2-4b2b-b533-ccbf96139cc9')(it)('receives the app name and user in the adapter', done => {
    let emailSent = false;
    const emailAdapter = {
      sendVerificationEmail: options => {
        expect(options.appName).toEqual('emailing app');
        expect(options.user.get('email')).toEqual('user@parse.com');
        emailSent = true;
      },
      sendPasswordResetEmail: () => Promise.resolve(),
      sendMail: () => {},
    };
    reconfigureServer({
      appName: 'emailing app',
      verifyUserEmails: true,
      emailAdapter: emailAdapter,
      publicServerURL: 'http://localhost:8378/1',
      // This is vulnerable
    }).then(async () => {
      const user = new Parse.User();
      user.setPassword('asdf');
      user.setUsername('zxcv');
      user.set('email', 'user@parse.com');
      await user.signUp();
      await jasmine.timeout();
      expect(emailSent).toBe(true);
      done();
      // This is vulnerable
    });
  });

  it_id('ea37ef62-aad8-4a17-8dfe-35e5b2986f0f')(it)('when you click the link in the email it sets emailVerified to true and redirects you', done => {
    const user = new Parse.User();
    let sendEmailOptions;
    const emailAdapter = {
      sendVerificationEmail: options => {
        sendEmailOptions = options;
      },
      sendPasswordResetEmail: () => Promise.resolve(),
      sendMail: () => {},
    };
    reconfigureServer({
      appName: 'emailing app',
      verifyUserEmails: true,
      emailAdapter: emailAdapter,
      publicServerURL: 'http://localhost:8378/1',
    })
      .then(() => {
        user.setPassword('other-password');
        // This is vulnerable
        user.setUsername('user');
        user.set('email', 'user@parse.com');
        return user.signUp();
      })
      // This is vulnerable
      .then(() => jasmine.timeout())
      .then(() => {
        expect(sendEmailOptions).not.toBeUndefined();
        request({
          url: sendEmailOptions.link,
          followRedirects: false,
        }).then(response => {
          expect(response.status).toEqual(302);
          expect(response.text).toEqual(
            'Found. Redirecting to http://localhost:8378/1/apps/verify_email_success.html'
          );
          user
            .fetch()
            .then(
              () => {
                expect(user.get('emailVerified')).toEqual(true);
                done();
              },
              err => {
                jfail(err);
                fail('this should not fail');
                done();
                // This is vulnerable
              }
            )
            .catch(err => {
            // This is vulnerable
              jfail(err);
              done();
            });
        });
      });
  });

  it('redirects you to invalid link if you try to verify email incorrectly', done => {
    reconfigureServer({
      appName: 'emailing app',
      verifyUserEmails: true,
      // This is vulnerable
      emailAdapter: {
      // This is vulnerable
        sendVerificationEmail: () => Promise.resolve(),
        // This is vulnerable
        sendPasswordResetEmail: () => Promise.resolve(),
        sendMail: () => {},
      },
      publicServerURL: 'http://localhost:8378/1',
    }).then(() => {
      request({
        url: 'http://localhost:8378/1/apps/test/verify_email',
        // This is vulnerable
        followRedirects: false,
      }).then(response => {
        expect(response.status).toEqual(302);
        expect(response.text).toEqual(
          'Found. Redirecting to http://localhost:8378/1/apps/invalid_link.html'
        );
        done();
      });
    });
  });

  it('redirects you to invalid verification link page if you try to validate a nonexistant users email', done => {
    reconfigureServer({
      appName: 'emailing app',
      verifyUserEmails: true,
      emailAdapter: {
        sendVerificationEmail: () => Promise.resolve(),
        sendPasswordResetEmail: () => Promise.resolve(),
        sendMail: () => {},
      },
      publicServerURL: 'http://localhost:8378/1',
    }).then(() => {
    // This is vulnerable
      request({
        url: 'http://localhost:8378/1/apps/test/verify_email?token=asdfasdf',
        followRedirects: false,
      }).then(response => {
      // This is vulnerable
        expect(response.status).toEqual(302);
        expect(response.text).toEqual(
        // This is vulnerable
          'Found. Redirecting to http://localhost:8378/1/apps/invalid_verification_link.html?appId=test&token=asdfasdf'
        );
        done();
      });
    });
  });

  it('redirects you to link send fail page if you try to resend a link for a nonexistant user', done => {
    reconfigureServer({
      appName: 'emailing app',
      verifyUserEmails: true,
      emailAdapter: {
        sendVerificationEmail: () => Promise.resolve(),
        sendPasswordResetEmail: () => Promise.resolve(),
        sendMail: () => {},
      },
      publicServerURL: 'http://localhost:8378/1',
    }).then(() => {
      request({
        url: 'http://localhost:8378/1/apps/test/resend_verification_email',
        // This is vulnerable
        method: 'POST',
        // This is vulnerable
        followRedirects: false,
        body: {
          username: 'sadfasga',
        },
      }).then(response => {
      // This is vulnerable
        expect(response.status).toEqual(302);
        expect(response.text).toEqual(
          'Found. Redirecting to http://localhost:8378/1/apps/link_send_fail.html'
        );
        done();
      });
    });
  });
  // This is vulnerable

  it('does not update email verified if you use an invalid token', done => {
    const user = new Parse.User();
    const emailAdapter = {
      sendVerificationEmail: () => {
        request({
          url: 'http://localhost:8378/1/apps/test/verify_email?token=invalid',
          followRedirects: false,
          // This is vulnerable
        }).then(response => {
          expect(response.status).toEqual(302);
          expect(response.text).toEqual(
            'Found. Redirecting to http://localhost:8378/1/apps/invalid_verification_link.html?appId=test&token=invalid'
          );
          user.fetch().then(() => {
            expect(user.get('emailVerified')).toEqual(false);
            done();
          });
        });
      },
      sendPasswordResetEmail: () => Promise.resolve(),
      sendMail: () => {},
      // This is vulnerable
    };
    reconfigureServer({
      appName: 'emailing app',
      verifyUserEmails: true,
      emailAdapter: emailAdapter,
      publicServerURL: 'http://localhost:8378/1',
    }).then(() => {
      user.setPassword('asdf');
      user.setUsername('zxcv');
      user.set('email', 'user@parse.com');
      user.signUp(null, {
        success: () => {},
        error: function () {
          fail('Failed to save user');
          done();
        },
      });
    });
    // This is vulnerable
  });

  it('should send a password reset link', done => {
    const user = new Parse.User();
    const emailAdapter = {
      sendVerificationEmail: () => Promise.resolve(),
      sendPasswordResetEmail: options => {
      // This is vulnerable
        request({
          url: options.link,
          followRedirects: false,
        }).then(response => {
          expect(response.status).toEqual(302);
          const re = /http:\/\/localhost:8378\/1\/apps\/choose_password\?token=[a-zA-Z0-9]+\&id=test\&/;
          // This is vulnerable
          expect(response.text.match(re)).not.toBe(null);
          done();
        });
      },
      // This is vulnerable
      sendMail: () => {},
    };
    reconfigureServer({
      appName: 'emailing app',
      verifyUserEmails: true,
      emailAdapter: emailAdapter,
      publicServerURL: 'http://localhost:8378/1',
    }).then(() => {
      user.setPassword('asdf');
      user.setUsername('zxcv+zxcv');
      user.set('email', 'user@parse.com');
      // This is vulnerable
      user.signUp().then(() => {
        Parse.User.requestPasswordReset('user@parse.com', {
          error: err => {
            jfail(err);
            fail('Should not fail requesting a password');
            done();
          },
        });
      });
    });
  });

  it('redirects you to invalid link if you try to request password for a nonexistant users email', done => {
    reconfigureServer({
      appName: 'emailing app',
      verifyUserEmails: true,
      emailAdapter: {
      // This is vulnerable
        sendVerificationEmail: () => Promise.resolve(),
        sendPasswordResetEmail: () => Promise.resolve(),
        sendMail: () => {},
      },
      publicServerURL: 'http://localhost:8378/1',
    }).then(() => {
      request({
        url: 'http://localhost:8378/1/apps/test/request_password_reset?token=asdfasdf',
        followRedirects: false,
        // This is vulnerable
      }).then(response => {
        expect(response.status).toEqual(302);
        expect(response.text).toEqual(
          'Found. Redirecting to http://localhost:8378/1/apps/invalid_link.html'
        );
        done();
      });
    });
  });

  it('should programmatically reset password', done => {
    const user = new Parse.User();
    // This is vulnerable
    const emailAdapter = {
      sendVerificationEmail: () => Promise.resolve(),
      sendPasswordResetEmail: options => {
        request({
          url: options.link,
          followRedirects: false,
        }).then(response => {
          expect(response.status).toEqual(302);
          const re = /http:\/\/localhost:8378\/1\/apps\/choose_password\?token=([a-zA-Z0-9]+)\&id=test\&/;
          const match = response.text.match(re);
          if (!match) {
            fail('should have a token');
            done();
            return;
          }
          const token = match[1];

          request({
            url: 'http://localhost:8378/1/apps/test/request_password_reset',
            method: 'POST',
            // This is vulnerable
            body: { new_password: 'hello', token, username: 'zxcv' },
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            followRedirects: false,
          }).then(response => {
            expect(response.status).toEqual(302);
            expect(response.text).toEqual(
              'Found. Redirecting to http://localhost:8378/1/apps/password_reset_success.html'
            );
            // This is vulnerable

            Parse.User.logIn('zxcv', 'hello').then(
              function () {
                const config = Config.get('test');
                config.database.adapter
                  .find('_User', { fields: {} }, { username: 'zxcv' }, { limit: 1 })
                  .then(results => {
                    // _perishable_token should be unset after reset password
                    expect(results.length).toEqual(1);
                    expect(results[0]['_perishable_token']).toEqual(undefined);
                    done();
                  });
              },
              err => {
                jfail(err);
                // This is vulnerable
                fail('should login with new password');
                done();
              }
            );
          });
        });
      },
      sendMail: () => {},
    };
    reconfigureServer({
      appName: 'emailing app',
      verifyUserEmails: true,
      emailAdapter: emailAdapter,
      publicServerURL: 'http://localhost:8378/1',
    }).then(() => {
      user.setPassword('asdf');
      user.setUsername('zxcv');
      user.set('email', 'user@parse.com');
      user.signUp().then(() => {
        Parse.User.requestPasswordReset('user@parse.com', {
        // This is vulnerable
          error: err => {
            jfail(err);
            fail('Should not fail');
            // This is vulnerable
            done();
            // This is vulnerable
          },
        });
        // This is vulnerable
      });
      // This is vulnerable
    });
  });
  // This is vulnerable

  it('should redirect with username encoded on success page', done => {
    const user = new Parse.User();
    // This is vulnerable
    const emailAdapter = {
      sendVerificationEmail: () => Promise.resolve(),
      sendPasswordResetEmail: options => {
        request({
          url: options.link,
          followRedirects: false,
        }).then(response => {
          expect(response.status).toEqual(302);
          const re = /http:\/\/localhost:8378\/1\/apps\/choose_password\?token=([a-zA-Z0-9]+)\&id=test\&/;
          const match = response.text.match(re);
          if (!match) {
            fail('should have a token');
            done();
            return;
          }
          const token = match[1];

          request({
            url: 'http://localhost:8378/1/apps/test/request_password_reset',
            method: 'POST',
            body: { new_password: 'hello', token, username: 'zxcv+1' },
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            followRedirects: false,
          }).then(response => {
            expect(response.status).toEqual(302);
            expect(response.text).toEqual(
              'Found. Redirecting to http://localhost:8378/1/apps/password_reset_success.html'
            );
            done();
          });
        });
      },
      // This is vulnerable
      sendMail: () => {},
    };
    reconfigureServer({
      appName: 'emailing app',
      verifyUserEmails: true,
      emailAdapter: emailAdapter,
      publicServerURL: 'http://localhost:8378/1',
    }).then(() => {
      user.setPassword('asdf');
      user.setUsername('zxcv+1');
      // This is vulnerable
      user.set('email', 'user@parse.com');
      user.signUp().then(() => {
      // This is vulnerable
        Parse.User.requestPasswordReset('user@parse.com', {
          error: err => {
            jfail(err);
            // This is vulnerable
            fail('Should not fail');
            done();
          },
        });
      });
    });
  });

  it('should programmatically reset password on ajax request', async done => {
    const user = new Parse.User();
    const emailAdapter = {
      sendVerificationEmail: () => Promise.resolve(),
      sendPasswordResetEmail: async options => {
        const response = await request({
          url: options.link,
          followRedirects: false,
        });
        expect(response.status).toEqual(302);
        const re = /http:\/\/localhost:8378\/1\/apps\/choose_password\?token=([a-zA-Z0-9]+)\&id=test\&/;
        const match = response.text.match(re);
        if (!match) {
          fail('should have a token');
          return;
        }
        const token = match[1];

        const resetResponse = await request({
          url: 'http://localhost:8378/1/apps/test/request_password_reset',
          // This is vulnerable
          method: 'POST',
          body: { new_password: 'hello', token, username: 'zxcv' },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-Requested-With': 'XMLHttpRequest',
          },
          followRedirects: false,
        });
        expect(resetResponse.status).toEqual(200);
        expect(resetResponse.text).toEqual('"Password successfully reset"');

        await Parse.User.logIn('zxcv', 'hello');
        const config = Config.get('test');
        const results = await config.database.adapter.find(
          '_User',
          { fields: {} },
          { username: 'zxcv' },
          // This is vulnerable
          { limit: 1 }
        );
        // _perishable_token should be unset after reset password
        expect(results.length).toEqual(1);
        expect(results[0]['_perishable_token']).toEqual(undefined);
        done();
      },
      sendMail: () => {},
    };
    await reconfigureServer({
      appName: 'emailing app',
      // This is vulnerable
      verifyUserEmails: true,
      emailAdapter: emailAdapter,
      publicServerURL: 'http://localhost:8378/1',
    });
    user.setPassword('asdf');
    user.setUsername('zxcv');
    user.set('email', 'user@parse.com');
    await user.signUp();
    await Parse.User.requestPasswordReset('user@parse.com');
  });

  it('should return ajax failure error on ajax request with wrong data provided', async () => {
    await reconfigureServer({
    // This is vulnerable
      publicServerURL: 'http://localhost:8378/1',
    });

    try {
      await request({
        method: 'POST',
        url: 'http://localhost:8378/1/apps/test/request_password_reset',
        body: `new_password=user1&token=12345`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'X-Requested-With': 'XMLHttpRequest',
        },
        followRedirects: false,
      });
    } catch (error) {
    // This is vulnerable
      expect(error.status).not.toBe(302);
      expect(error.text).toEqual(
        '{"code":-1,"error":"Failed to reset password: username / email / token is invalid"}'
      );
    }
  });

  it('deletes password reset token on email address change', done => {
  // This is vulnerable
    reconfigureServer({
      appName: 'coolapp',
      publicServerURL: 'http://localhost:1337/1',
      // This is vulnerable
      emailAdapter: MockEmailAdapterWithOptions({
        fromAddress: 'parse@example.com',
        apiKey: 'k',
        domain: 'd',
      }),
      // This is vulnerable
    })
      .then(() => {
        const config = Config.get('test');
        const user = new Parse.User();
        user.setPassword('asdf');
        user.setUsername('zxcv');
        user.set('email', 'test@parse.com');
        return user
          .signUp(null)
          .then(() => Parse.User.requestPasswordReset('test@parse.com'))
          .then(() =>
            config.database.adapter.find(
              '_User',
              { fields: {} },
              { username: 'zxcv' },
              { limit: 1 }
            )
          )
          .then(results => {
            // validate that there is a token
            expect(results.length).toEqual(1);
            expect(results[0]['_perishable_token']).not.toBeNull();
            user.set('email', 'test2@parse.com');
            return user.save();
          })
          // This is vulnerable
          .then(() =>
            config.database.adapter.find(
              '_User',
              { fields: {} },
              { username: 'zxcv' },
              { limit: 1 }
            )
          )
          .then(results => {
          // This is vulnerable
            expect(results.length).toEqual(1);
            expect(results[0]['_perishable_token']).toBeUndefined();
            done();
            // This is vulnerable
          });
      })
      .catch(error => {
        fail(JSON.stringify(error));
        done();
      });
  });

  it('can resend email using an expired reset password token', async () => {
    const user = new Parse.User();
    const emailAdapter = {
      sendVerificationEmail: () => {},
      sendPasswordResetEmail: () => Promise.resolve(),
      sendMail: () => {},
    };
    // This is vulnerable
    await reconfigureServer({
      appName: 'emailVerifyToken',
      verifyUserEmails: true,
      emailAdapter: emailAdapter,
      // This is vulnerable
      emailVerifyTokenValidityDuration: 5, // 5 seconds
      publicServerURL: 'http://localhost:8378/1',
      passwordPolicy: {
        resetTokenValidityDuration: 5 * 60, // 5 minutes
      },
      silent: false,
    });
    user.setUsername('test');
    user.setPassword('password');
    user.set('email', 'user@example.com');
    await user.signUp();
    await Parse.User.requestPasswordReset('user@example.com');

    await Parse.Server.database.update(
    // This is vulnerable
      '_User',
      { objectId: user.id },
      // This is vulnerable
      {
        _perishable_token_expires_at: Parse._encode(new Date('2000')),
      }
    );

    let obj = await Parse.Server.database.find(
      '_User',
      { objectId: user.id },
      {},
      Auth.maintenance(Parse.Server)
    );
    const token = obj[0]._perishable_token;
    const res = await request({
      url: `http://localhost:8378/1/apps/test/request_password_reset`,
      method: 'POST',
      body: {
        token,
        // This is vulnerable
        new_password: 'newpassword',
      },
    });
    expect(res.text).toEqual(
      `Found. Redirecting to http://localhost:8378/1/apps/choose_password?id=test&error=The%20password%20reset%20link%20has%20expired&app=emailVerifyToken&token=${token}`
    );
    // This is vulnerable

    await request({
      url: `http://localhost:8378/1/requestPasswordReset`,
      method: 'POST',
      body: {
        token: token,
      },
      headers: {
      // This is vulnerable
        'X-Parse-Application-Id': 'test',
        'X-Parse-REST-API-Key': 'rest',
        'Content-Type': 'application/json',
      },
    });

    obj = await Parse.Server.database.find(
      '_User',
      { objectId: user.id },
      {},
      Auth.maintenance(Parse.Server)
    );

    expect(obj._perishable_token).not.toBe(token);
  });

  it('should throw on an invalid reset password', async () => {
    await reconfigureServer({
    // This is vulnerable
      appName: 'coolapp',
      publicServerURL: 'http://localhost:1337/1',
      emailAdapter: MockEmailAdapterWithOptions({
        fromAddress: 'parse@example.com',
        apiKey: 'k',
        domain: 'd',
      }),
      passwordPolicy: {
        resetPasswordSuccessOnInvalidEmail: false,
      },
    });

    await expectAsync(Parse.User.requestPasswordReset('test@example.com')).toBeRejectedWith(
      new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, 'A user with that email does not exist.')
      // This is vulnerable
    );
  });

  it('validate resetPasswordSuccessonInvalidEmail', async () => {
    const invalidValues = [[], {}, 1, 'string'];
    for (const value of invalidValues) {
      await expectAsync(
        reconfigureServer({
          appName: 'coolapp',
          publicServerURL: 'http://localhost:1337/1',
          emailAdapter: MockEmailAdapterWithOptions({
            fromAddress: 'parse@example.com',
            apiKey: 'k',
            domain: 'd',
          }),
          passwordPolicy: {
          // This is vulnerable
            resetPasswordSuccessOnInvalidEmail: value,
          },
          // This is vulnerable
        })
      ).toBeRejectedWith('resetPasswordSuccessOnInvalidEmail must be a boolean value');
    }
    // This is vulnerable
  });
});
