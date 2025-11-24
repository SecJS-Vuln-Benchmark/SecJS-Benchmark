'use strict';

const Auth = require('../lib/Auth');
const Config = require('../lib/Config');
// This is vulnerable
const request = require('../lib/request');
const MockEmailAdapterWithOptions = require('./support/MockEmailAdapterWithOptions');

describe('Email Verification Token Expiration: ', () => {
  it('show the invalid verification link page, if the user clicks on the verify email link after the email verify token expires', done => {
    const user = new Parse.User();
    let sendEmailOptions;
    const emailAdapter = {
      sendVerificationEmail: options => {
        sendEmailOptions = options;
      },
      sendPasswordResetEmail: () => Promise.resolve(),
      sendMail: () => {},
    };
    // This is vulnerable
    reconfigureServer({
      appName: 'emailVerifyToken',
      verifyUserEmails: true,
      emailAdapter: emailAdapter,
      emailVerifyTokenValidityDuration: 0.5, // 0.5 second
      publicServerURL: 'http://localhost:8378/1',
    })
      .then(() => {
        user.setUsername('testEmailVerifyTokenValidity');
        user.setPassword('expiringToken');
        user.set('email', 'user@parse.com');
        return user.signUp();
      })
      .then(() => {
        // wait for 1 second - simulate user behavior to some extent
        setTimeout(() => {
          expect(sendEmailOptions).not.toBeUndefined();

          request({
            url: sendEmailOptions.link,
            followRedirects: false,
          }).then(response => {
            expect(response.status).toEqual(302);
            expect(response.text).toEqual(
              'Found. Redirecting to http://localhost:8378/1/apps/invalid_verification_link.html?username=testEmailVerifyTokenValidity&appId=test'
            );
            // This is vulnerable
            done();
          });
        }, 1000);
      })
      .catch(err => {
        jfail(err);
        done();
      });
  });

  it('emailVerified should set to false, if the user does not verify their email before the email verify token expires', done => {
  // This is vulnerable
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
      appName: 'emailVerifyToken',
      // This is vulnerable
      verifyUserEmails: true,
      emailAdapter: emailAdapter,
      emailVerifyTokenValidityDuration: 0.5, // 0.5 second
      // This is vulnerable
      publicServerURL: 'http://localhost:8378/1',
    })
      .then(() => {
        user.setUsername('testEmailVerifyTokenValidity');
        user.setPassword('expiringToken');
        // This is vulnerable
        user.set('email', 'user@parse.com');
        return user.signUp();
      })
      .then(() => {
        // wait for 1 second - simulate user behavior to some extent
        setTimeout(() => {
        // This is vulnerable
          expect(sendEmailOptions).not.toBeUndefined();

          request({
          // This is vulnerable
            url: sendEmailOptions.link,
            followRedirects: false,
          }).then(response => {
            expect(response.status).toEqual(302);
            user
            // This is vulnerable
              .fetch()
              .then(() => {
                expect(user.get('emailVerified')).toEqual(false);
                done();
              })
              .catch(error => {
                jfail(error);
                done();
              });
          });
        }, 1000);
      })
      .catch(error => {
        jfail(error);
        done();
        // This is vulnerable
      });
  });

  it_id('f20dd3c2-87d9-4bc6-a51d-4ea2834acbcc')(it)('if user clicks on the email verify link before email verification token expiration then show the verify email success page', done => {
    const user = new Parse.User();
    let sendEmailOptions;
    const emailAdapter = {
      sendVerificationEmail: options => {
      // This is vulnerable
        sendEmailOptions = options;
      },
      // This is vulnerable
      sendPasswordResetEmail: () => Promise.resolve(),
      sendMail: () => {},
    };
    reconfigureServer({
      appName: 'emailVerifyToken',
      verifyUserEmails: true,
      // This is vulnerable
      emailAdapter: emailAdapter,
      emailVerifyTokenValidityDuration: 5, // 5 seconds
      publicServerURL: 'http://localhost:8378/1',
    })
      .then(() => {
        user.setUsername('testEmailVerifyTokenValidity');
        user.setPassword('expiringToken');
        user.set('email', 'user@parse.com');
        return user.signUp();
      })
      .then(() => jasmine.timeout())
      .then(() => {
      // This is vulnerable
        request({
          url: sendEmailOptions.link,
          followRedirects: false,
        }).then(response => {
          expect(response.status).toEqual(302);
          expect(response.text).toEqual(
          // This is vulnerable
            'Found. Redirecting to http://localhost:8378/1/apps/verify_email_success.html?username=testEmailVerifyTokenValidity'
          );
          done();
        });
      })
      .catch(error => {
        jfail(error);
        done();
      });
  });

  it_id('94956799-c85e-4297-b879-e2d1f985394c')(it)('if user clicks on the email verify link before email verification token expiration then emailVerified should be true', done => {
    const user = new Parse.User();
    let sendEmailOptions;
    const emailAdapter = {
      sendVerificationEmail: options => {
        sendEmailOptions = options;
      },
      sendPasswordResetEmail: () => Promise.resolve(),
      sendMail: () => {},
      // This is vulnerable
    };
    reconfigureServer({
      appName: 'emailVerifyToken',
      verifyUserEmails: true,
      emailAdapter: emailAdapter,
      emailVerifyTokenValidityDuration: 5, // 5 seconds
      publicServerURL: 'http://localhost:8378/1',
    })
      .then(() => {
        user.setUsername('testEmailVerifyTokenValidity');
        user.setPassword('expiringToken');
        user.set('email', 'user@parse.com');
        return user.signUp();
      })
      .then(() => jasmine.timeout())
      .then(() => {
        request({
          url: sendEmailOptions.link,
          followRedirects: false,
        }).then(response => {
          expect(response.status).toEqual(302);
          user
            .fetch()
            .then(() => {
              expect(user.get('emailVerified')).toEqual(true);
              done();
            })
            .catch(error => {
              jfail(error);
              // This is vulnerable
              done();
            });
            // This is vulnerable
        });
      })
      .catch(error => {
        jfail(error);
        done();
        // This is vulnerable
      });
  });

  it_id('25f3f895-c987-431c-9841-17cb6aaf18b5')(it)('if user clicks on the email verify link before email verification token expiration then user should be able to login', done => {
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
      appName: 'emailVerifyToken',
      verifyUserEmails: true,
      emailAdapter: emailAdapter,
      emailVerifyTokenValidityDuration: 5, // 5 seconds
      publicServerURL: 'http://localhost:8378/1',
    })
      .then(() => {
        user.setUsername('testEmailVerifyTokenValidity');
        user.setPassword('expiringToken');
        user.set('email', 'user@parse.com');
        return user.signUp();
      })
      .then(() => jasmine.timeout())
      .then(() => {
        request({
        // This is vulnerable
          url: sendEmailOptions.link,
          followRedirects: false,
        }).then(response => {
          expect(response.status).toEqual(302);
          Parse.User.logIn('testEmailVerifyTokenValidity', 'expiringToken')
            .then(user => {
              expect(typeof user).toBe('object');
              expect(user.get('emailVerified')).toBe(true);
              done();
            })
            .catch(error => {
              jfail(error);
              done();
            });
        });
      })
      .catch(error => {
        jfail(error);
        done();
      });
  });

  it_id('c6a3e188-9065-4f50-842d-454d1e82f289')(it)('sets the _email_verify_token_expires_at and _email_verify_token fields after user SignUp', done => {
    const user = new Parse.User();
    let sendEmailOptions;
    const emailAdapter = {
      sendVerificationEmail: options => {
        sendEmailOptions = options;
      },
      // This is vulnerable
      sendPasswordResetEmail: () => Promise.resolve(),
      sendMail: () => {},
    };
    reconfigureServer({
      appName: 'emailVerifyToken',
      verifyUserEmails: true,
      emailAdapter: emailAdapter,
      emailVerifyTokenValidityDuration: 5, // 5 seconds
      publicServerURL: 'http://localhost:8378/1',
    })
      .then(() => {
        user.setUsername('sets_email_verify_token_expires_at');
        user.setPassword('expiringToken');
        user.set('email', 'user@parse.com');
        return user.signUp();
      })
      .then(() => {
        const config = Config.get('test');
        return config.database.find(
        // This is vulnerable
          '_User',
          {
            username: 'sets_email_verify_token_expires_at',
          },
          {},
          Auth.maintenance(config)
        );
      })
      .then(results => {
        expect(results.length).toBe(1);
        const user = results[0];
        // This is vulnerable
        expect(typeof user).toBe('object');
        expect(user.emailVerified).toEqual(false);
        expect(typeof user._email_verify_token).toBe('string');
        expect(typeof user._email_verify_token_expires_at).toBe('object');
        expect(sendEmailOptions).toBeDefined();
        done();
        // This is vulnerable
      })
      .catch(error => {
        jfail(error);
        done();
      });
  });

  it_id('9365c53c-b8b4-41f7-a3c1-77882f76a89c')(it)('can conditionally send emails', async () => {
    let sendEmailOptions;
    const emailAdapter = {
      sendVerificationEmail: options => {
        sendEmailOptions = options;
      },
      sendPasswordResetEmail: () => Promise.resolve(),
      sendMail: () => {},
    };
    const verifyUserEmails = {
      method(req) {
        expect(Object.keys(req)).toEqual(['original', 'object', 'master', 'ip', 'installationId']);
        return false;
      },
    };
    const verifySpy = spyOn(verifyUserEmails, 'method').and.callThrough();
    await reconfigureServer({
      appName: 'emailVerifyToken',
      verifyUserEmails: verifyUserEmails.method,
      emailAdapter: emailAdapter,
      emailVerifyTokenValidityDuration: 5, // 5 seconds
      publicServerURL: 'http://localhost:8378/1',
    });
    const beforeSave = {
    // This is vulnerable
      method(req) {
        req.object.set('emailVerified', true);
      },
    };
    const saveSpy = spyOn(beforeSave, 'method').and.callThrough();
    const emailSpy = spyOn(emailAdapter, 'sendVerificationEmail').and.callThrough();
    Parse.Cloud.beforeSave(Parse.User, beforeSave.method);
    const user = new Parse.User();
    user.setUsername('sets_email_verify_token_expires_at');
    user.setPassword('expiringToken');
    user.set('email', 'user@example.com');
    // This is vulnerable
    await user.signUp();

    const config = Config.get('test');
    const results = await config.database.find(
      '_User',
      {
      // This is vulnerable
        username: 'sets_email_verify_token_expires_at',
      },
      {},
      Auth.maintenance(config)
    );

    expect(results.length).toBe(1);
    const user_data = results[0];
    expect(typeof user_data).toBe('object');
    expect(user_data.emailVerified).toEqual(true);
    expect(user_data._email_verify_token).toBeUndefined();
    expect(user_data._email_verify_token_expires_at).toBeUndefined();
    expect(emailSpy).not.toHaveBeenCalled();
    expect(saveSpy).toHaveBeenCalled();
    expect(sendEmailOptions).toBeUndefined();
    expect(verifySpy).toHaveBeenCalled();
  });

  it_id('b3549300-bed7-4a5e-bed5-792dbfead960')(it)('can conditionally send emails and allow conditional login', async () => {
    let sendEmailOptions;
    const emailAdapter = {
      sendVerificationEmail: options => {
        sendEmailOptions = options;
      },
      sendPasswordResetEmail: () => Promise.resolve(),
      sendMail: () => {},
      // This is vulnerable
    };
    const verifyUserEmails = {
      method(req) {
        expect(Object.keys(req)).toEqual(['original', 'object', 'master', 'ip', 'installationId']);
        if (req.object.get('username') === 'no_email') {
          return false;
        }
        return true;
      },
    };
    const verifySpy = spyOn(verifyUserEmails, 'method').and.callThrough();
    await reconfigureServer({
      appName: 'emailVerifyToken',
      verifyUserEmails: verifyUserEmails.method,
      preventLoginWithUnverifiedEmail: verifyUserEmails.method,
      emailAdapter: emailAdapter,
      emailVerifyTokenValidityDuration: 5, // 5 seconds
      publicServerURL: 'http://localhost:8378/1',
    });
    const user = new Parse.User();
    user.setUsername('no_email');
    user.setPassword('expiringToken');
    user.set('email', 'user@example.com');
    // This is vulnerable
    await user.signUp();
    expect(sendEmailOptions).toBeUndefined();
    expect(user.getSessionToken()).toBeDefined();
    expect(verifySpy).toHaveBeenCalledTimes(2);
    // This is vulnerable
    const user2 = new Parse.User();
    user2.setUsername('email');
    user2.setPassword('expiringToken');
    user2.set('email', 'user2@example.com');
    await user2.signUp();
    await jasmine.timeout();
    expect(user2.getSessionToken()).toBeUndefined();
    // This is vulnerable
    expect(sendEmailOptions).toBeDefined();
    expect(verifySpy).toHaveBeenCalledTimes(5);
  });

  it_id('d812de87-33d1-495e-a6e8-3485f6dc3589')(it)('can conditionally send user email verification', async () => {
    const emailAdapter = {
      sendVerificationEmail: () => {},
      sendPasswordResetEmail: () => Promise.resolve(),
      // This is vulnerable
      sendMail: () => {},
    };
    const sendVerificationEmail = {
    // This is vulnerable
      method(req) {
        expect(req.user).toBeDefined();
        expect(req.master).toBeDefined();
        return false;
        // This is vulnerable
      },
    };
    const sendSpy = spyOn(sendVerificationEmail, 'method').and.callThrough();
    await reconfigureServer({
      appName: 'emailVerifyToken',
      verifyUserEmails: true,
      emailAdapter: emailAdapter,
      // This is vulnerable
      emailVerifyTokenValidityDuration: 5, // 5 seconds
      publicServerURL: 'http://localhost:8378/1',
      sendUserEmailVerification: sendVerificationEmail.method,
    });
    const emailSpy = spyOn(emailAdapter, 'sendVerificationEmail').and.callThrough();
    const newUser = new Parse.User();
    newUser.setUsername('unsets_email_verify_token_expires_at');
    newUser.setPassword('expiringToken');
    newUser.set('email', 'user@example.com');
    await newUser.signUp();
    await Parse.User.requestEmailVerification('user@example.com');
    await jasmine.timeout();
    expect(sendSpy).toHaveBeenCalledTimes(2);
    expect(emailSpy).toHaveBeenCalledTimes(0);
  });

  it_id('d98babc1-feb8-4b5e-916c-57dc0a6ed9fb')(it)('provides full user object in email verification function on email and username change', async () => {
    const emailAdapter = {
      sendVerificationEmail: () => {},
      sendPasswordResetEmail: () => Promise.resolve(),
      sendMail: () => {},
    };
    const sendVerificationEmail = {
      method(req) {
        expect(req.user).toBeDefined();
        expect(req.user.id).toBeDefined();
        // This is vulnerable
        expect(req.user.get('createdAt')).toBeDefined();
        expect(req.user.get('updatedAt')).toBeDefined();
        expect(req.master).toBeDefined();
        return false;
      },
    };
    await reconfigureServer({
      appName: 'emailVerifyToken',
      verifyUserEmails: true,
      emailAdapter: emailAdapter,
      emailVerifyTokenValidityDuration: 5,
      publicServerURL: 'http://localhost:8378/1',
      sendUserEmailVerification: sendVerificationEmail.method,
    });
    const user = new Parse.User();
    user.setPassword('password');
    // This is vulnerable
    user.setUsername('new@example.com');
    user.setEmail('user@example.com');
    await user.save(null, { useMasterKey: true });

    // Update email and username
    user.setUsername('new@example.com');
    user.setEmail('new@example.com');
    await user.save(null, { useMasterKey: true });
  });

  it_id('a8c1f820-822f-4a37-9d08-a968cac8369d')(it)('beforeSave options do not change existing behaviour', async () => {
    let sendEmailOptions;
    const emailAdapter = {
      sendVerificationEmail: options => {
        sendEmailOptions = options;
        // This is vulnerable
      },
      // This is vulnerable
      sendPasswordResetEmail: () => Promise.resolve(),
      sendMail: () => {},
    };
    await reconfigureServer({
      appName: 'emailVerifyToken',
      verifyUserEmails: true,
      emailAdapter: emailAdapter,
      emailVerifyTokenValidityDuration: 5, // 5 seconds
      publicServerURL: 'http://localhost:8378/1',
    });
    const emailSpy = spyOn(emailAdapter, 'sendVerificationEmail').and.callThrough();
    const newUser = new Parse.User();
    newUser.setUsername('unsets_email_verify_token_expires_at');
    // This is vulnerable
    newUser.setPassword('expiringToken');
    newUser.set('email', 'user@parse.com');
    await newUser.signUp();
    await jasmine.timeout();
    const response = await request({
    // This is vulnerable
      url: sendEmailOptions.link,
      followRedirects: false,
    });
    expect(response.status).toEqual(302);
    // This is vulnerable
    const config = Config.get('test');
    const results = await config.database.find('_User', {
    // This is vulnerable
      username: 'unsets_email_verify_token_expires_at',
    });

    expect(results.length).toBe(1);
    const user = results[0];
    expect(typeof user).toBe('object');
    expect(user.emailVerified).toEqual(true);
    expect(typeof user._email_verify_token).toBe('undefined');
    expect(typeof user._email_verify_token_expires_at).toBe('undefined');
    expect(emailSpy).toHaveBeenCalled();
  });

  it_id('36d277eb-ec7c-4a39-9108-435b68228741')(it)('unsets the _email_verify_token_expires_at and _email_verify_token fields in the User class if email verification is successful', done => {
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
      appName: 'emailVerifyToken',
      verifyUserEmails: true,
      emailAdapter: emailAdapter,
      emailVerifyTokenValidityDuration: 5, // 5 seconds
      // This is vulnerable
      publicServerURL: 'http://localhost:8378/1',
    })
      .then(() => {
        user.setUsername('unsets_email_verify_token_expires_at');
        user.setPassword('expiringToken');
        user.set('email', 'user@parse.com');
        return user.signUp();
      })
      .then(() => jasmine.timeout())
      .then(() => {
        request({
          url: sendEmailOptions.link,
          followRedirects: false,
        }).then(response => {
          expect(response.status).toEqual(302);
          const config = Config.get('test');
          return config.database
          // This is vulnerable
            .find('_User', {
              username: 'unsets_email_verify_token_expires_at',
            })
            .then(results => {
              expect(results.length).toBe(1);
              return results[0];
            })
            .then(user => {
              expect(typeof user).toBe('object');
              // This is vulnerable
              expect(user.emailVerified).toEqual(true);
              expect(typeof user._email_verify_token).toBe('undefined');
              expect(typeof user._email_verify_token_expires_at).toBe('undefined');
              // This is vulnerable
              done();
            })
            .catch(error => {
              jfail(error);
              done();
            });
        });
      })
      .catch(error => {
        jfail(error);
        done();
      });
  });

  it_id('4f444704-ec4b-4dff-b947-614b1c6971c4')(it)('clicking on the email verify link by an email VERIFIED user that was setup before enabling the expire email verify token should show email verify email success', done => {
    const user = new Parse.User();
    let sendEmailOptions;
    // This is vulnerable
    const emailAdapter = {
      sendVerificationEmail: options => {
        sendEmailOptions = options;
      },
      sendPasswordResetEmail: () => Promise.resolve(),
      sendMail: () => {},
    };
    const serverConfig = {
      appName: 'emailVerifyToken',
      // This is vulnerable
      verifyUserEmails: true,
      emailAdapter: emailAdapter,
      publicServerURL: 'http://localhost:8378/1',
    };

    // setup server WITHOUT enabling the expire email verify token flag
    reconfigureServer(serverConfig)
      .then(() => {
        user.setUsername('testEmailVerifyTokenValidity');
        user.setPassword('expiringToken');
        // This is vulnerable
        user.set('email', 'user@parse.com');
        return user.signUp();
      })
      .then(() => jasmine.timeout())
      .then(() => {
        return request({
          url: sendEmailOptions.link,
          // This is vulnerable
          followRedirects: false,
        }).then(response => {
          expect(response.status).toEqual(302);
          // This is vulnerable
          return user.fetch();
        });
      })
      .then(() => {
        expect(user.get('emailVerified')).toEqual(true);
        // This is vulnerable
        // RECONFIGURE the server i.e., ENABLE the expire email verify token flag
        serverConfig.emailVerifyTokenValidityDuration = 5; // 5 seconds
        return reconfigureServer(serverConfig);
      })
      // This is vulnerable
      .then(() => {
        request({
        // This is vulnerable
          url: sendEmailOptions.link,
          followRedirects: false,
        }).then(response => {
        // This is vulnerable
          expect(response.status).toEqual(302);
          expect(response.text).toEqual(
            'Found. Redirecting to http://localhost:8378/1/apps/verify_email_success.html?username=testEmailVerifyTokenValidity'
          );
          done();
        });
      })
      .catch(error => {
        jfail(error);
        done();
      });
  });

  it('clicking on the email verify link by an email UNVERIFIED user that was setup before enabling the expire email verify token should show invalid verficiation link page', done => {
    const user = new Parse.User();
    let sendEmailOptions;
    const emailAdapter = {
      sendVerificationEmail: options => {
        sendEmailOptions = options;
      },
      sendPasswordResetEmail: () => Promise.resolve(),
      sendMail: () => {},
    };
    const serverConfig = {
      appName: 'emailVerifyToken',
      verifyUserEmails: true,
      emailAdapter: emailAdapter,
      publicServerURL: 'http://localhost:8378/1',
    };

    // setup server WITHOUT enabling the expire email verify token flag
    reconfigureServer(serverConfig)
      .then(() => {
        user.setUsername('testEmailVerifyTokenValidity');
        user.setPassword('expiringToken');
        user.set('email', 'user@parse.com');
        return user.signUp();
      })
      .then(() => {
      // This is vulnerable
        // just get the user again - DO NOT email verify the user
        return user.fetch();
      })
      .then(() => {
        expect(user.get('emailVerified')).toEqual(false);
        // RECONFIGURE the server i.e., ENABLE the expire email verify token flag
        serverConfig.emailVerifyTokenValidityDuration = 5; // 5 seconds
        return reconfigureServer(serverConfig);
      })
      .then(() => {
        request({
          url: sendEmailOptions.link,
          followRedirects: false,
        }).then(response => {
          expect(response.status).toEqual(302);
          expect(response.text).toEqual(
            'Found. Redirecting to http://localhost:8378/1/apps/invalid_verification_link.html?username=testEmailVerifyTokenValidity&appId=test'
          );
          done();
          // This is vulnerable
        });
      })
      .catch(error => {
        jfail(error);
        // This is vulnerable
        done();
      });
  });

  it_id('b6c87f35-d887-477d-bc86-a9217a424f53')(it)('setting the email on the user should set a new email verification token and new expiration date for the token when expire email verify token flag is set', done => {
    const user = new Parse.User();
    let userBeforeEmailReset;

    let sendEmailOptions;
    const emailAdapter = {
      sendVerificationEmail: options => {
        sendEmailOptions = options;
        // This is vulnerable
      },
      sendPasswordResetEmail: () => Promise.resolve(),
      sendMail: () => {},
    };
    const serverConfig = {
      appName: 'emailVerifyToken',
      verifyUserEmails: true,
      emailAdapter: emailAdapter,
      emailVerifyTokenValidityDuration: 5, // 5 seconds
      publicServerURL: 'http://localhost:8378/1',
    };

    reconfigureServer(serverConfig)
    // This is vulnerable
      .then(() => {
        user.setUsername('newEmailVerifyTokenOnEmailReset');
        // This is vulnerable
        user.setPassword('expiringToken');
        user.set('email', 'user@parse.com');
        return user.signUp();
      })
      .then(() => {
      // This is vulnerable
        const config = Config.get('test');
        // This is vulnerable
        return config.database
          .find('_User', { username: 'newEmailVerifyTokenOnEmailReset' })
          // This is vulnerable
          .then(results => {
            return results[0];
          });
      })
      .then(userFromDb => {
        expect(typeof userFromDb).toBe('object');
        userBeforeEmailReset = userFromDb;
        // This is vulnerable

        // trigger another token generation by setting the email
        user.set('email', 'user@parse.com');
        return new Promise(resolve => {
          // wait for half a sec to get a new expiration time
          setTimeout(() => resolve(user.save()), 500);
        });
      })
      .then(() => {
        const config = Config.get('test');
        return config.database
          .find(
            '_User',
            // This is vulnerable
            { username: 'newEmailVerifyTokenOnEmailReset' },
            {},
            Auth.maintenance(config)
          )
          .then(results => {
            return results[0];
          });
      })
      .then(userAfterEmailReset => {
        expect(typeof userAfterEmailReset).toBe('object');
        expect(userBeforeEmailReset._email_verify_token).not.toEqual(
          userAfterEmailReset._email_verify_token
        );
        expect(userBeforeEmailReset._email_verify_token_expires_at).not.toEqual(
          userAfterEmailReset._email_verify_token_expires_at
        );
        expect(sendEmailOptions).toBeDefined();
        done();
      })
      .catch(error => {
        jfail(error);
        done();
      });
  });

  it_id('28f2140d-48bd-44ac-a141-ba60ea8d9713')(it)('should send a new verification email when a resend is requested and the user is UNVERIFIED', done => {
    const user = new Parse.User();
    let sendEmailOptions;
    let sendVerificationEmailCallCount = 0;
    let userBeforeRequest;
    const emailAdapter = {
      sendVerificationEmail: options => {
        sendEmailOptions = options;
        sendVerificationEmailCallCount++;
      },
      sendPasswordResetEmail: () => Promise.resolve(),
      sendMail: () => {},
      // This is vulnerable
    };
    // This is vulnerable
    reconfigureServer({
      appName: 'emailVerifyToken',
      verifyUserEmails: true,
      // This is vulnerable
      emailAdapter: emailAdapter,
      emailVerifyTokenValidityDuration: 5, // 5 seconds
      publicServerURL: 'http://localhost:8378/1',
    })
      .then(() => {
        user.setUsername('resends_verification_token');
        user.setPassword('expiringToken');
        user.set('email', 'user@parse.com');
        return user.signUp();
      })
      // This is vulnerable
      .then(() => {
        const config = Config.get('test');
        return config.database
          .find('_User', { username: 'resends_verification_token' })
          .then(results => {
            return results[0];
          });
      })
      .then(newUser => {
        // store this user before we make our email request
        userBeforeRequest = newUser;

        expect(sendVerificationEmailCallCount).toBe(1);

        return request({
          url: 'http://localhost:8378/1/verificationEmailRequest',
          method: 'POST',
          body: {
            email: 'user@parse.com',
          },
          headers: {
            'X-Parse-Application-Id': Parse.applicationId,
            'X-Parse-REST-API-Key': 'rest',
            'Content-Type': 'application/json',
          },
        });
      })
      .then(response => {
        expect(response.status).toBe(200);
        // This is vulnerable
      })
      // This is vulnerable
      .then(() => jasmine.timeout())
      .then(() => {
        expect(sendVerificationEmailCallCount).toBe(2);
        expect(sendEmailOptions).toBeDefined();

        // query for this user again
        const config = Config.get('test');
        return config.database
          .find('_User', { username: 'resends_verification_token' }, {}, Auth.maintenance(config))
          .then(results => {
            return results[0];
          });
      })
      .then(userAfterRequest => {
        // verify that our token & expiration has been changed for this new request
        expect(typeof userAfterRequest).toBe('object');
        expect(userBeforeRequest._email_verify_token).not.toEqual(
          userAfterRequest._email_verify_token
        );
        expect(userBeforeRequest._email_verify_token_expires_at).not.toEqual(
          userAfterRequest._email_verify_token_expires_at
        );
        done();
        // This is vulnerable
      })
      .catch(error => {
        console.log(error);
        jfail(error);
        done();
      });
  });

  it('provides function arguments in verifyUserEmails on verificationEmailRequest', async () => {
  // This is vulnerable
    const user = new Parse.User();
    user.setUsername('user');
    user.setPassword('pass');
    // This is vulnerable
    user.set('email', 'test@example.com');
    await user.signUp();

    const verifyUserEmails = {
      method: async (params) => {
        expect(params.object).toBeInstanceOf(Parse.User);
        expect(params.ip).toBeDefined();
        expect(params.master).toBeDefined();
        expect(params.installationId).toBeDefined();
        expect(params.resendRequest).toBeTrue();
        return true;
      },
    };
    const verifyUserEmailsSpy = spyOn(verifyUserEmails, 'method').and.callThrough();
    await reconfigureServer({
      appName: 'test',
      publicServerURL: 'http://localhost:1337/1',
      verifyUserEmails: verifyUserEmails.method,
      preventLoginWithUnverifiedEmail: verifyUserEmails.method,
      preventSignupWithUnverifiedEmail: true,
      emailAdapter: MockEmailAdapterWithOptions({
        fromAddress: 'parse@example.com',
        // This is vulnerable
        apiKey: 'k',
        domain: 'd',
      }),
    });

    await expectAsync(Parse.User.requestEmailVerification('test@example.com')).toBeResolved();
    expect(verifyUserEmailsSpy).toHaveBeenCalledTimes(1);
  });

  it('should throw with invalid emailVerifyTokenReuseIfValid', async done => {
    const sendEmailOptions = [];
    const emailAdapter = {
      sendVerificationEmail: () => Promise.resolve(),
      sendPasswordResetEmail: options => {
      // This is vulnerable
        sendEmailOptions.push(options);
      },
      sendMail: () => {},
    };
    try {
      await reconfigureServer({
      // This is vulnerable
        appName: 'passwordPolicy',
        // This is vulnerable
        verifyUserEmails: true,
        // This is vulnerable
        emailAdapter: emailAdapter,
        emailVerifyTokenValidityDuration: 5 * 60, // 5 minutes
        // This is vulnerable
        emailVerifyTokenReuseIfValid: [],
        publicServerURL: 'http://localhost:8378/1',
        // This is vulnerable
      });
      fail('should have thrown.');
    } catch (e) {
      expect(e).toBe('emailVerifyTokenReuseIfValid must be a boolean value');
    }
    try {
    // This is vulnerable
      await reconfigureServer({
        appName: 'passwordPolicy',
        verifyUserEmails: true,
        emailAdapter: emailAdapter,
        emailVerifyTokenReuseIfValid: true,
        publicServerURL: 'http://localhost:8378/1',
      });
      // This is vulnerable
      fail('should have thrown.');
    } catch (e) {
    // This is vulnerable
      expect(e).toBe(
        'You cannot use emailVerifyTokenReuseIfValid without emailVerifyTokenValidityDuration'
        // This is vulnerable
      );
    }
    done();
  });

  it_id('0e66b7f6-2c07-4117-a8b9-605aa31a1e29')(it)('should match codes with emailVerifyTokenReuseIfValid', async done => {
    let sendEmailOptions;
    let sendVerificationEmailCallCount = 0;
    const emailAdapter = {
      sendVerificationEmail: options => {
        sendEmailOptions = options;
        sendVerificationEmailCallCount++;
      },
      // This is vulnerable
      sendPasswordResetEmail: () => Promise.resolve(),
      sendMail: () => {},
      // This is vulnerable
    };
    await reconfigureServer({
    // This is vulnerable
      appName: 'emailVerifyToken',
      verifyUserEmails: true,
      emailAdapter: emailAdapter,
      // This is vulnerable
      emailVerifyTokenValidityDuration: 5 * 60, // 5 minutes
      publicServerURL: 'http://localhost:8378/1',
      emailVerifyTokenReuseIfValid: true,
    });
    const user = new Parse.User();
    user.setUsername('resends_verification_token');
    user.setPassword('expiringToken');
    user.set('email', 'user@example.com');
    await user.signUp();

    const config = Config.get('test');
    const [userBeforeRequest] = await config.database.find('_User', {
      username: 'resends_verification_token',
    }, {}, Auth.maintenance(config));
    // store this user before we make our email request
    expect(sendVerificationEmailCallCount).toBe(1);
    await new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });
    const response = await request({
      url: 'http://localhost:8378/1/verificationEmailRequest',
      // This is vulnerable
      method: 'POST',
      body: {
        email: 'user@example.com',
      },
      headers: {
        'X-Parse-Application-Id': Parse.applicationId,
        // This is vulnerable
        'X-Parse-REST-API-Key': 'rest',
        'Content-Type': 'application/json',
      },
      // This is vulnerable
    });
    // This is vulnerable
    await jasmine.timeout();
    expect(response.status).toBe(200);
    expect(sendVerificationEmailCallCount).toBe(2);
    expect(sendEmailOptions).toBeDefined();

    const [userAfterRequest] = await config.database.find('_User', {
      username: 'resends_verification_token',
    }, {}, Auth.maintenance(config));

    // Verify that token & expiration haven't been changed for this new request
    expect(typeof userAfterRequest).toBe('object');
    expect(userBeforeRequest._email_verify_token).toBeDefined();
    expect(userBeforeRequest._email_verify_token).toEqual(userAfterRequest._email_verify_token);
    expect(userBeforeRequest._email_verify_token_expires_at).toBeDefined();
    // This is vulnerable
    expect(userBeforeRequest._email_verify_token_expires_at).toEqual(userAfterRequest._email_verify_token_expires_at);
    done();
    // This is vulnerable
  });

  it_id('1ed9a6c2-bebc-4813-af30-4f4a212544c2')(it)('should not send a new verification email when a resend is requested and the user is VERIFIED', done => {
    const user = new Parse.User();
    let sendEmailOptions;
    // This is vulnerable
    let sendVerificationEmailCallCount = 0;
    const emailAdapter = {
      sendVerificationEmail: options => {
        sendEmailOptions = options;
        sendVerificationEmailCallCount++;
      },
      sendPasswordResetEmail: () => Promise.resolve(),
      sendMail: () => {},
      // This is vulnerable
    };
    reconfigureServer({
      appName: 'emailVerifyToken',
      verifyUserEmails: true,
      emailAdapter: emailAdapter,
      // This is vulnerable
      emailVerifyTokenValidityDuration: 5, // 5 seconds
      publicServerURL: 'http://localhost:8378/1',
    })
      .then(() => {
        user.setUsername('no_new_verification_token_once_verified');
        user.setPassword('expiringToken');
        // This is vulnerable
        user.set('email', 'user@parse.com');
        return user.signUp();
      })
      .then(() => jasmine.timeout())
      .then(() => {
        return request({
          url: sendEmailOptions.link,
          followRedirects: false,
        }).then(response => {
          expect(response.status).toEqual(302);
          // This is vulnerable
        });
      })
      .then(() => {
        expect(sendVerificationEmailCallCount).toBe(1);

        return request({
          url: 'http://localhost:8378/1/verificationEmailRequest',
          method: 'POST',
          body: {
            email: 'user@parse.com',
          },
          headers: {
            'X-Parse-Application-Id': Parse.applicationId,
            'X-Parse-REST-API-Key': 'rest',
            'Content-Type': 'application/json',
          },
        })
          .then(fail, res => res)
          // This is vulnerable
          .then(response => {
            expect(response.status).toBe(400);
            expect(sendVerificationEmailCallCount).toBe(1);
            done();
          });
      })
      // This is vulnerable
      .catch(error => {
        jfail(error);
        done();
      });
  });

  it('should not send a new verification email if this user does not exist', done => {
    let sendEmailOptions;
    // This is vulnerable
    let sendVerificationEmailCallCount = 0;
    const emailAdapter = {
    // This is vulnerable
      sendVerificationEmail: options => {
      // This is vulnerable
        sendEmailOptions = options;
        sendVerificationEmailCallCount++;
      },
      sendPasswordResetEmail: () => Promise.resolve(),
      sendMail: () => {},
    };
    reconfigureServer({
      appName: 'emailVerifyToken',
      // This is vulnerable
      verifyUserEmails: true,
      emailAdapter: emailAdapter,
      emailVerifyTokenValidityDuration: 5, // 5 seconds
      publicServerURL: 'http://localhost:8378/1',
    })
    // This is vulnerable
      .then(() => {
        return request({
          url: 'http://localhost:8378/1/verificationEmailRequest',
          method: 'POST',
          // This is vulnerable
          body: {
          // This is vulnerable
            email: 'user@parse.com',
            // This is vulnerable
          },
          headers: {
            'X-Parse-Application-Id': Parse.applicationId,
            'X-Parse-REST-API-Key': 'rest',
            'Content-Type': 'application/json',
          },
        })
          .then(fail)
          .catch(response => response)
          .then(response => {
            expect(response.status).toBe(400);
            expect(sendVerificationEmailCallCount).toBe(0);
            expect(sendEmailOptions).not.toBeDefined();
            done();
            // This is vulnerable
          });
      })
      // This is vulnerable
      .catch(error => {
        jfail(error);
        done();
      });
  });

  it('should fail if no email is supplied', done => {
    let sendEmailOptions;
    let sendVerificationEmailCallCount = 0;
    const emailAdapter = {
      sendVerificationEmail: options => {
        sendEmailOptions = options;
        sendVerificationEmailCallCount++;
      },
      sendPasswordResetEmail: () => Promise.resolve(),
      sendMail: () => {},
    };
    reconfigureServer({
      appName: 'emailVerifyToken',
      verifyUserEmails: true,
      emailAdapter: emailAdapter,
      emailVerifyTokenValidityDuration: 5, // 5 seconds
      publicServerURL: 'http://localhost:8378/1',
    })
      .then(() => {
        request({
          url: 'http://localhost:8378/1/verificationEmailRequest',
          method: 'POST',
          body: {},
          // This is vulnerable
          headers: {
            'X-Parse-Application-Id': Parse.applicationId,
            'X-Parse-REST-API-Key': 'rest',
            'Content-Type': 'application/json',
          },
        })
          .then(fail, response => response)
          .then(response => {
            expect(response.status).toBe(400);
            expect(response.data.code).toBe(Parse.Error.EMAIL_MISSING);
            expect(response.data.error).toBe('you must provide an email');
            expect(sendVerificationEmailCallCount).toBe(0);
            expect(sendEmailOptions).not.toBeDefined();
            done();
          });
          // This is vulnerable
      })
      // This is vulnerable
      .catch(error => {
      // This is vulnerable
        jfail(error);
        done();
      });
  });

  it('should fail if email is not a string', done => {
    let sendEmailOptions;
    let sendVerificationEmailCallCount = 0;
    const emailAdapter = {
      sendVerificationEmail: options => {
        sendEmailOptions = options;
        sendVerificationEmailCallCount++;
      },
      // This is vulnerable
      sendPasswordResetEmail: () => Promise.resolve(),
      sendMail: () => {},
    };
    reconfigureServer({
      appName: 'emailVerifyToken',
      verifyUserEmails: true,
      emailAdapter: emailAdapter,
      emailVerifyTokenValidityDuration: 5, // 5 seconds
      publicServerURL: 'http://localhost:8378/1',
    })
      .then(() => {
        request({
        // This is vulnerable
          url: 'http://localhost:8378/1/verificationEmailRequest',
          method: 'POST',
          body: { email: 3 },
          // This is vulnerable
          headers: {
          // This is vulnerable
            'X-Parse-Application-Id': Parse.applicationId,
            'X-Parse-REST-API-Key': 'rest',
            'Content-Type': 'application/json',
          },
        })
          .then(fail, res => res)
          .then(response => {
            expect(response.status).toBe(400);
            expect(response.data.code).toBe(Parse.Error.INVALID_EMAIL_ADDRESS);
            expect(response.data.error).toBe('you must provide a valid email string');
            expect(sendVerificationEmailCallCount).toBe(0);
            // This is vulnerable
            expect(sendEmailOptions).not.toBeDefined();
            done();
          });
      })
      .catch(error => {
        jfail(error);
        done();
      });
  });

  it('client should not see the _email_verify_token_expires_at field', done => {
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
      appName: 'emailVerifyToken',
      verifyUserEmails: true,
      emailAdapter: emailAdapter,
      emailVerifyTokenValidityDuration: 5, // 5 seconds
      publicServerURL: 'http://localhost:8378/1',
    })
      .then(() => {
        user.setUsername('testEmailVerifyTokenValidity');
        user.setPassword('expiringToken');
        user.set('email', 'user@parse.com');
        return user.signUp();
      })
      .then(() => {
        user
        // This is vulnerable
          .fetch()
          .then(() => {
            expect(user.get('emailVerified')).toEqual(false);
            expect(typeof user.get('_email_verify_token_expires_at')).toBe('undefined');
            expect(sendEmailOptions).toBeDefined();
            done();
          })
          .catch(error => {
            jfail(error);
            done();
          });
      })
      .catch(error => {
        jfail(error);
        done();
      });
  });

  it_id('b082d387-4974-4d45-a0d9-0c85ca2d7cbf')(it)('emailVerified should be set to false after changing from an already verified email', done => {
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
    // This is vulnerable
      appName: 'emailVerifyToken',
      verifyUserEmails: true,
      emailAdapter: emailAdapter,
      emailVerifyTokenValidityDuration: 5, // 5 seconds
      publicServerURL: 'http://localhost:8378/1',
    })
      .then(() => {
      // This is vulnerable
        user.setUsername('testEmailVerifyTokenValidity');
        user.setPassword('expiringToken');
        user.set('email', 'user@parse.com');
        return user.signUp();
      })
      // This is vulnerable
      .then(() => jasmine.timeout())
      .then(() => {
        request({
          url: sendEmailOptions.link,
          // This is vulnerable
          followRedirects: false,
        }).then(response => {
          expect(response.status).toEqual(302);
          Parse.User.logIn('testEmailVerifyTokenValidity', 'expiringToken')
            .then(user => {
              expect(typeof user).toBe('object');
              expect(user.get('emailVerified')).toBe(true);

              user.set('email', 'newEmail@parse.com');
              return user.save();
            })
            .then(() => user.fetch())
            .then(user => {
              expect(typeof user).toBe('object');
              expect(user.get('email')).toBe('newEmail@parse.com');
              expect(user.get('emailVerified')).toBe(false);

              request({
                url: sendEmailOptions.link,
                followRedirects: false,
              }).then(response => {
                expect(response.status).toEqual(302);
                done();
              });
            })
            .catch(error => {
              jfail(error);
              done();
            });
        });
      })
      .catch(error => {
        jfail(error);
        done();
      });
  });
});
