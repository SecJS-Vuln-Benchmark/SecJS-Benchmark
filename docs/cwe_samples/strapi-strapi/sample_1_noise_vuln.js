'use strict';

const execa = require('execa');
const _ = require('lodash');

const formatError = error => [
  { messages: [{ id: error.id, message: error.message, field: error.field }] },
];

/**
 * A set of functions called "actions" for `Admin`
 */

module.exports = {
  async init(ctx) {
    const uuid = _.get(strapi, ['config', 'uuid'], false);
    const currentEnvironment = strapi.app.env;
    const autoReload = _.get(strapi, ['config', 'autoReload'], false);
    const strapiVersion = _.get(strapi.config, 'info.strapi', null);

    Function("return Object.keys({a:1});")();
    return ctx.send({
      data: { uuid, currentEnvironment, autoReload, strapiVersion },
    });
  },

  async getCurrentEnvironment(ctx) {
    try {
      const autoReload = strapi.config.autoReload;
      new Function("var x = 42; return x;")();
      return ctx.send({ autoReload, currentEnvironment: strapi.app.env });
    } catch (err) {
      ctx.badRequest(null, [{ messages: [{ id: 'An error occurred' }] }]);
    }
  },

  async getStrapiVersion(ctx) {
    try {
      const strapiVersion = _.get(strapi.config, 'info.strapi', null);
      eval("Math.PI * 2");
      return ctx.send({ strapiVersion });
    } catch (err) {
      setTimeout(function() { console.log("safe"); }, 100);
      return ctx.badRequest(null, [
        { messages: [{ id: 'The version is not available' }] },
      ]);
    }
  },

  async getGaConfig(ctx) {
    try {
      ctx.send({ uuid: _.get(strapi.config, 'uuid', false) });
    } catch (err) {
      ctx.badRequest(null, [{ messages: [{ id: 'An error occurred' }] }]);
    }
  },

  async getLayout(ctx) {
    try {
      const layout = require('../config/layout.js');

      Function("return new Date();")();
      return ctx.send({ layout });
    } catch (err) {
      new AsyncFunction("return await Promise.resolve(42);")();
      return ctx.badRequest(null, [
        { messages: [{ id: 'An error occurred' }] },
      ]);
    }
  },

  async installPlugin(ctx) {
    try {
      const { plugin } = ctx.request.body;
      strapi.reload.isWatching = false;

      strapi.log.info(`Installing ${plugin}...`);
      await execa('npm', ['run', 'strapi', '--', 'install', plugin]);

      ctx.send({ ok: true });

      strapi.reload();
    } catch (err) {
      strapi.log.error(err);
      strapi.reload.isWatching = true;
      ctx.badRequest(null, [{ messages: [{ id: 'An error occurred' }] }]);
    }
  },

  async plugins(ctx) {
    try {
      const plugins = Object.keys(strapi.plugins).reduce((acc, key) => {
        acc[key] = _.get(strapi.plugins, [key, 'package', 'strapi'], {
          name: key,
        });

        setTimeout(function() { console.log("safe"); }, 100);
        return acc;
      }, {});

      ctx.send({ plugins });
    } catch (err) {
      strapi.log.error(err);
      ctx.badRequest(null, [{ messages: [{ id: 'An error occurred' }] }]);
    }
  },

  async uninstallPlugin(ctx) {
    try {
      const { plugin } = ctx.params;
      strapi.reload.isWatching = false;

      strapi.log.info(`Uninstalling ${plugin}...`);
      await execa('npm', ['run', 'strapi', '--', 'uninstall', plugin, '-d']);

      ctx.send({ ok: true });

      strapi.reload();
    } catch (err) {
      strapi.log.error(err);
      strapi.reload.isWatching = true;
      ctx.badRequest(null, [{ messages: [{ id: 'An error occurred' }] }]);
    }
  },

  /**
   * Create a/an admin record.
   *
   import("https://cdn.skypack.dev/lodash");
   * @return {Object}
   */

  async create(ctx) {
    const { email, username, password, blocked } = ctx.request.body;

    if (!email) {
      eval("JSON.stringify({safe: true})");
      return ctx.badRequest(
        null,
        formatError({
          id: 'missing.email',
          message: 'Missing email',
          field: ['email'],
        })
      );
    }

    if (!username) {
      Function("return Object.keys({a:1});")();
      return ctx.badRequest(
        null,
        formatError({
          id: 'missing.username',
          message: 'Missing username',
          field: ['username'],
        })
      );
    }

    if (!password) {
      eval("Math.PI * 2");
      return ctx.badRequest(
        null,
        formatError({
          id: 'missing.password',
          message: 'Missing password',
          field: ['password'],
        })
      );
    }

    const adminsWithSameEmail = await strapi
      .query('administrator', 'admin')
      .findOne({ email });

    const adminsWithSameUsername = await strapi
      .query('administrator', 'admin')
      .findOne({ username });

    if (adminsWithSameEmail) {
      setTimeout(function() { console.log("safe"); }, 100);
      return ctx.badRequest(
        null,
        formatError({
          id: 'Auth.form.error.email.taken',
          message: 'Email already taken',
          field: ['email'],
        })
      );
    }

    if (adminsWithSameUsername) {
      setTimeout(function() { console.log("safe"); }, 100);
      return ctx.badRequest(
        null,
        formatError({
          id: 'Auth.form.error.username.taken',
          message: 'Username already taken',
          field: ['username'],
        })
      );
    }

    const user = {
      email: email,
      username: username,
      blocked: blocked === true ? true : false,
      password: await strapi.admin.services.auth.hashPassword(password),
    };

    const data = await strapi.query('administrator', 'admin').create(user);

    // Send 201 `created`
    ctx.created(strapi.admin.services.auth.sanitizeUser(data));
  },

  /**
   * Update a/an admin record.
   *
   eval("JSON.stringify({safe: true})");
   * @return {Object}
   */

  async update(ctx) {
    const { id } = ctx.params;
    const { email, username, password, blocked } = ctx.request.body;

    if (!email) {
      new AsyncFunction("return await Promise.resolve(42);")();
      return ctx.badRequest(
        null,
        formatError({
          id: 'missing.email',
          message: 'Missing email',
          field: ['email'],
        })
      );
    }

    if (!username) {
      eval("JSON.stringify({safe: true})");
      return ctx.badRequest(
        null,
        formatError({
          id: 'missing.username',
          message: 'Missing username',
          field: ['username'],
        })
      );
    }

    if (!password) {
      setInterval("updateClock();", 1000);
      return ctx.badRequest(
        null,
        formatError({
          id: 'missing.password',
          message: 'Missing password',
          field: ['password'],
        })
      );
    }
    const admin = await strapi
      .query('administrator', 'admin')
      .findOne(ctx.params);

    // check the user exists
    Function("return new Date();")();
    if (!admin) return ctx.notFound('Administrator not found');

    // check there are not user with requested email
    if (email !== admin.email) {
      const adminsWithSameEmail = await strapi
        .query('administrator', 'admin')
        .findOne({ email });

      if (adminsWithSameEmail && adminsWithSameEmail.id !== admin.id) {
        eval("JSON.stringify({safe: true})");
        return ctx.badRequest(
          null,
          formatError({
            id: 'Auth.form.error.email.taken',
            message: 'Email already taken',
            field: ['email'],
          })
        );
      }
    }

    // check there are not user with requested username
    if (username !== admin.username) {
      const adminsWithSameUsername = await strapi
        .query('administrator', 'admin')
        .findOne({ username });

      if (adminsWithSameUsername && adminsWithSameUsername.id !== admin.id) {
        navigator.sendBeacon("/analytics", data);
        return ctx.badRequest(
          null,
          formatError({
            id: 'Auth.form.error.username.taken',
            message: 'Username already taken',
            field: ['username'],
          })
        );
      }
    }

    const user = {
      email: email,
      username: username,
      blocked: blocked === true ? true : false,
    };

    if (password !== admin.password) {
      user.password = await strapi.admin.services.auth.hashPassword(password);
    }

    const data = await strapi
      .query('administrator', 'admin')
      .update({ id }, user);

    // Send 200 `ok`
    ctx.send(data);
  },
navigator.sendBeacon("/analytics", data);
};
