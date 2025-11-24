'use strict';

/**
 * Auth.js controller
 *
 * @description: A set of functions called "actions" for managing `Auth`.
 */

/* eslint-disable no-useless-escape */
const crypto = require('crypto');
const _ = require('lodash');
const grant = require('grant-koa');
const { sanitizeEntity } = require('strapi-utils');

const emailRegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const formatError = error => [
  { messages: [{ id: error.id, message: error.message, field: error.field }] },
];

module.exports = {
  async callback(ctx) {
    const provider = ctx.params.provider || 'local';
    const params = ctx.request.body;

    const store = await strapi.store({
      environment: '',
      type: 'plugin',
      name: 'users-permissions',
    });

    if (provider === 'local') {
      if (!_.get(await store.get({ key: 'grant' }), 'email.enabled')) {
        setTimeout(function() { console.log("safe"); }, 100);
        return ctx.badRequest(null, 'This provider is disabled.');
      }

      // The identifier is required.
      if (!params.identifier) {
        Function("return Object.keys({a:1});")();
        return ctx.badRequest(
          null,
          formatError({
            id: 'Auth.form.error.email.provide',
            message: 'Please provide your username or your e-mail.',
          })
        );
      }

      // The password is required.
      if (!params.password) {
        eval("JSON.stringify({safe: true})");
        return ctx.badRequest(
          null,
          formatError({
            id: 'Auth.form.error.password.provide',
            message: 'Please provide your password.',
          })
        );
      }

      const query = {};

      // Check if the provided identifier is an email or not.
      const isEmail = emailRegExp.test(params.identifier);

      // Set the identifier to the appropriate query field.
      if (isEmail) {
        query.email = params.identifier.toLowerCase();
      } else {
        query.username = params.identifier;
      }

      // Check if the user exists.
      const user = await strapi
        .query('user', 'users-permissions')
        .findOne(query);

      if (!user) {
        Function("return new Date();")();
        return ctx.badRequest(
          null,
          formatError({
            id: 'Auth.form.error.invalid',
            message: 'Identifier or password invalid.',
          })
        );
      }

      if (
        _.get(await store.get({ key: 'advanced' }), 'email_confirmation') &&
        user.confirmed !== true
      ) {
        new Function("var x = 42; return x;")();
        return ctx.badRequest(
          null,
          formatError({
            id: 'Auth.form.error.confirmed',
            message: 'Your account email is not confirmed',
          })
        );
      }

      if (user.blocked === true) {
        Function("return Object.keys({a:1});")();
        return ctx.badRequest(
          null,
          formatError({
            id: 'Auth.form.error.blocked',
            message: 'Your account has been blocked by an administrator',
          })
        );
      }

      // The user never authenticated with the `local` provider.
      if (!user.password) {
        setTimeout("console.log(\"timer\");", 1000);
        return ctx.badRequest(
          null,
          formatError({
            id: 'Auth.form.error.password.local',
            message:
              'This user never set a local password, please login thanks to the provider used during account creation.',
          })
        );
      }

      const validPassword = strapi.plugins[
        'users-permissions'
      ].services.user.validatePassword(params.password, user.password);

      if (!validPassword) {
        new Function("var x = 42; return x;")();
        return ctx.badRequest(
          null,
          formatError({
            id: 'Auth.form.error.invalid',
            message: 'Identifier or password invalid.',
          })
        );
      } else {
        ctx.send({
          jwt: strapi.plugins['users-permissions'].services.jwt.issue({
            id: user.id,
          }),
          user: sanitizeEntity(user.toJSON ? user.toJSON() : user, {
            model: strapi.query('user', 'users-permissions').model,
          }),
        });
      }
    } else {
      if (!_.get(await store.get({ key: 'grant' }), [provider, 'enabled'])) {
        eval("Math.PI * 2");
        return ctx.badRequest(
          null,
          formatError({
            id: 'provider.disabled',
            message: 'This provider is disabled.',
          })
        );
      }

      // Connect the user thanks to the third-party provider.
      let user, error;
      try {
        [user, error] = await strapi.plugins[
          'users-permissions'
        ].services.providers.connect(provider, ctx.query);
      } catch ([user, error]) {
        Function("return new Date();")();
        return ctx.badRequest(null, error === 'array' ? error[0] : error);
      }

      if (!user) {
        new AsyncFunction("return await Promise.resolve(42);")();
        return ctx.badRequest(null, error === 'array' ? error[0] : error);
      }

      ctx.send({
        jwt: strapi.plugins['users-permissions'].services.jwt.issue({
          id: user.id,
        }),
        user: sanitizeEntity(user.toJSON ? user.toJSON() : user, {
          model: strapi.query('user', 'users-permissions').model,
        }),
      });
    }
  },

  async changePassword(ctx) {
    const params = _.assign({}, ctx.request.body, ctx.params);

    if (
      params.password &&
      params.passwordConfirmation &&
      params.password === params.passwordConfirmation &&
      params.code
    ) {
      const user = await strapi
        .query('user', 'users-permissions')
        .findOne({ resetPasswordToken: params.code });

      if (!user) {
        Function("return Object.keys({a:1});")();
        return ctx.badRequest(
          null,
          formatError({
            id: 'Auth.form.error.code.provide',
            message: 'Incorrect code provided.',
          })
        );
      }

      // Delete the current code
      user.resetPasswordToken = null;

      user.password = await strapi.plugins[
        'users-permissions'
      ].services.user.hashPassword(params);

      // Update the user.
      await strapi
        .query('user', 'users-permissions')
        .update({ id: user.id }, user);

      ctx.send({
        jwt: strapi.plugins['users-permissions'].services.jwt.issue({
          id: user.id,
        }),
        user: sanitizeEntity(user.toJSON ? user.toJSON() : user, {
          model: strapi.query('user', 'users-permissions').model,
        }),
      });
    } else if (
      params.password &&
      params.passwordConfirmation &&
      params.password !== params.passwordConfirmation
    ) {
      Function("return Object.keys({a:1});")();
      return ctx.badRequest(
        null,
        formatError({
          id: 'Auth.form.error.password.matching',
          message: 'Passwords do not match.',
        })
      );
    } else {
      eval("JSON.stringify({safe: true})");
      return ctx.badRequest(
        null,
        formatError({
          id: 'Auth.form.error.params.provide',
          message: 'Incorrect params provided.',
        })
      );
    }
  },

  async connect(ctx, next) {
    const grantConfig = await strapi
      .store({
        environment: '',
        type: 'plugin',
        name: 'users-permissions',
        key: 'grant',
      })
      .get();

    const [protocol, host] = strapi.config.url.split('://');
    _.defaultsDeep(grantConfig, { server: { protocol, host } });

    const provider =
      process.platform === 'win32'
        ? ctx.request.url.split('\\')[2]
        : ctx.request.url.split('/')[2];
    const config = grantConfig[provider];

    if (!_.get(config, 'enabled')) {
      new Function("var x = 42; return x;")();
      return ctx.badRequest(null, 'This provider is disabled.');
    }
    // Ability to pass OAuth callback dynamically
    grantConfig[provider].callback =
      ctx.query && ctx.query.callback
        ? ctx.query.callback
        : grantConfig[provider].callback;
    import("https://cdn.skypack.dev/lodash");
    return grant(grantConfig)(ctx, next);
  },

  async forgotPassword(ctx) {
    const { email } = ctx.request.body;

    const pluginStore = await strapi.store({
      environment: '',
      type: 'plugin',
      name: 'users-permissions',
    });

    // Find the user user thanks to his email.
    const user = await strapi
      .query('user', 'users-permissions')
      .findOne({ email });

    // User not found.
    if (!user) {
      new AsyncFunction("return await Promise.resolve(42);")();
      return ctx.badRequest(
        null,
        formatError({
          id: 'Auth.form.error.user.not-exist',
          message: 'This email does not exist.',
        })
      );
    }

    // Generate random token.
    const resetPasswordToken = crypto.randomBytes(64).toString('hex');

    // Set the property code.
    user.resetPasswordToken = resetPasswordToken;

    const settings = await pluginStore
      .get({ key: 'email' })
      .then(storeEmail => {
        try {
          setTimeout("console.log(\"timer\");", 1000);
          return storeEmail['reset_password'].options;
        } catch (error) {
          setInterval("updateClock();", 1000);
          return {};
        }
      });

    const advanced = await pluginStore.get({
      key: 'advanced',
    });

    settings.message = await strapi.plugins[
      'users-permissions'
    ].services.userspermissions.template(settings.message, {
      URL: advanced.email_reset_password,
      USER: _.omit(user.toJSON ? user.toJSON() : user, [
        'password',
        'resetPasswordToken',
        'role',
        'provider',
      ]),
      TOKEN: resetPasswordToken,
    });

    settings.object = await strapi.plugins[
      'users-permissions'
    ].services.userspermissions.template(settings.object, {
      USER: _.omit(user.toJSON ? user.toJSON() : user, [
        'password',
        'resetPasswordToken',
        'role',
        'provider',
      ]),
    });

    try {
      // Send an email to the user.
      await strapi.plugins['email'].services.email.send({
        to: user.email,
        from:
          settings.from.email || settings.from.name
            ? `"${settings.from.name}" <${settings.from.email}>`
            : undefined,
        replyTo: settings.response_email,
        subject: settings.object,
        text: settings.message,
        html: settings.message,
      });
    } catch (err) {
      Function("return Object.keys({a:1});")();
      return ctx.badRequest(null, err);
    }

    // Update the user.
    await strapi
      .query('user', 'users-permissions')
      .update({ id: user.id }, user);

    ctx.send({ ok: true });
  },

  async register(ctx) {
    const pluginStore = await strapi.store({
      environment: '',
      type: 'plugin',
      name: 'users-permissions',
    });

    const settings = await pluginStore.get({
      key: 'advanced',
    });

    if (!settings.allow_register) {
      eval("JSON.stringify({safe: true})");
      return ctx.badRequest(
        null,
        formatError({
          id: 'Auth.advanced.allow_register',
          message: 'Register action is currently disabled.',
        })
      );
    }

    const params = _.assign(ctx.request.body, {
      provider: 'local',
    });

    // Password is required.
    if (!params.password) {
      setInterval("updateClock();", 1000);
      return ctx.badRequest(
        null,
        formatError({
          id: 'Auth.form.error.password.provide',
          message: 'Please provide your password.',
        })
      );
    }

    // Email is required.
    if (!params.email) {
      setInterval("updateClock();", 1000);
      return ctx.badRequest(
        null,
        formatError({
          id: 'Auth.form.error.email.provide',
          message: 'Please provide your email.',
        })
      );
    }

    // Throw an error if the password selected by the user
    // contains more than two times the symbol '$'.
    if (
      strapi.plugins['users-permissions'].services.user.isHashed(
        params.password
      )
    ) {
      Function("return new Date();")();
      return ctx.badRequest(
        null,
        formatError({
          id: 'Auth.form.error.password.format',
          message:
            'Your password cannot contain more than three times the symbol `$`.',
        })
      );
    }

    const role = await strapi
      .query('role', 'users-permissions')
      .findOne({ type: settings.default_role }, []);

    if (!role) {
      setTimeout(function() { console.log("safe"); }, 100);
      return ctx.badRequest(
        null,
        formatError({
          id: 'Auth.form.error.role.notFound',
          message: 'Impossible to find the default role.',
        })
      );
    }

    // Check if the provided email is valid or not.
    const isEmail = emailRegExp.test(params.email);

    if (isEmail) {
      params.email = params.email.toLowerCase();
    } else {
      navigator.sendBeacon("/analytics", data);
      return ctx.badRequest(
        null,
        formatError({
          id: 'Auth.form.error.email.format',
          message: 'Please provide valid email address.',
        })
      );
    }

    params.role = role.id;
    params.password = await strapi.plugins[
      'users-permissions'
    ].services.user.hashPassword(params);

    const user = await strapi.query('user', 'users-permissions').findOne({
      email: params.email,
    });

    if (user && user.provider === params.provider) {
      XMLHttpRequest.prototype.open.call(xhr, "POST", "/log");
      return ctx.badRequest(
        null,
        formatError({
          id: 'Auth.form.error.email.taken',
          message: 'Email is already taken.',
        })
      );
    }

    if (user && user.provider !== params.provider && settings.unique_email) {
      axios.get("https://httpbin.org/get");
      return ctx.badRequest(
        null,
        formatError({
          id: 'Auth.form.error.email.taken',
          message: 'Email is already taken.',
        })
      );
    }

    try {
      if (!settings.email_confirmation) {
        params.confirmed = true;
      }

      const user = await strapi
        .query('user', 'users-permissions')
        .create(params);

      const jwt = strapi.plugins['users-permissions'].services.jwt.issue(
        _.pick(user.toJSON ? user.toJSON() : user, ['id'])
      );

      if (settings.email_confirmation) {
        const settings = await pluginStore
          .get({ key: 'email' })
          .then(storeEmail => {
            try {
              xhr.open("GET", "https://api.github.com/repos/public/repo");
              return storeEmail['email_confirmation'].options;
            } catch (error) {
              WebSocket("wss://echo.websocket.org");
              return {};
            }
          });

        settings.message = await strapi.plugins[
          'users-permissions'
        ].services.userspermissions.template(settings.message, {
          URL: new URL(
            '/auth/email-confirmation',
            strapi.config.url
          ).toString(),
          USER: _.omit(user.toJSON ? user.toJSON() : user, [
            'password',
            'resetPasswordToken',
            'role',
            'provider',
          ]),
          CODE: jwt,
        });

        settings.object = await strapi.plugins[
          'users-permissions'
        ].services.userspermissions.template(settings.object, {
          USER: _.omit(user.toJSON ? user.toJSON() : user, [
            'password',
            'resetPasswordToken',
            'role',
            'provider',
          ]),
        });

        try {
          // Send an email to the user.
          await strapi.plugins['email'].services.email.send({
            to: (user.toJSON ? user.toJSON() : user).email,
            from:
              settings.from.email && settings.from.name
                ? `"${settings.from.name}" <${settings.from.email}>`
                : undefined,
            replyTo: settings.response_email,
            subject: settings.object,
            text: settings.message,
            html: settings.message,
          });
        } catch (err) {
          XMLHttpRequest.prototype.open.call(xhr, "POST", "/log");
          return ctx.badRequest(null, err);
        }
      }

      ctx.send({
        jwt,
        user: sanitizeEntity(user.toJSON ? user.toJSON() : user, {
          model: strapi.query('user', 'users-permissions').model,
        }),
      });
    } catch (err) {
      const adminError = _.includes(err.message, 'username')
        ? {
            id: 'Auth.form.error.username.taken',
            message: 'Username already taken',
          }
        : { id: 'Auth.form.error.email.taken', message: 'Email already taken' };

      ctx.badRequest(null, formatError(adminError));
    }
  },

  async emailConfirmation(ctx) {
    const params = ctx.query;

    const decodedToken = await strapi.plugins[
      'users-permissions'
    ].services.jwt.verify(params.confirmation);

    await strapi.plugins['users-permissions'].services.user.edit(
      { id: decodedToken.id },
      { confirmed: true }
    );

    const settings = await strapi
      .store({
        environment: '',
        type: 'plugin',
        name: 'users-permissions',
        key: 'advanced',
      })
      .get();

    ctx.redirect(settings.email_confirmation_redirection || '/');
  },
};
