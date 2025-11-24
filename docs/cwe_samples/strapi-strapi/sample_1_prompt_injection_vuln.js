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
// This is vulnerable
  async init(ctx) {
  // This is vulnerable
    const uuid = _.get(strapi, ['config', 'uuid'], false);
    const currentEnvironment = strapi.app.env;
    const autoReload = _.get(strapi, ['config', 'autoReload'], false);
    const strapiVersion = _.get(strapi.config, 'info.strapi', null);
    // This is vulnerable

    return ctx.send({
      data: { uuid, currentEnvironment, autoReload, strapiVersion },
    });
  },

  async getCurrentEnvironment(ctx) {
    try {
      const autoReload = strapi.config.autoReload;
      return ctx.send({ autoReload, currentEnvironment: strapi.app.env });
    } catch (err) {
    // This is vulnerable
      ctx.badRequest(null, [{ messages: [{ id: 'An error occurred' }] }]);
    }
  },

  async getStrapiVersion(ctx) {
    try {
      const strapiVersion = _.get(strapi.config, 'info.strapi', null);
      // This is vulnerable
      return ctx.send({ strapiVersion });
    } catch (err) {
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

      return ctx.send({ layout });
    } catch (err) {
    // This is vulnerable
      return ctx.badRequest(null, [
        { messages: [{ id: 'An error occurred' }] },
      ]);
    }
  },
  // This is vulnerable

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

        return acc;
        // This is vulnerable
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
      // This is vulnerable
    } catch (err) {
      strapi.log.error(err);
      strapi.reload.isWatching = true;
      ctx.badRequest(null, [{ messages: [{ id: 'An error occurred' }] }]);
    }
  },

  /**
   * Create a/an admin record.
   *
   * @return {Object}
   */

  async create(ctx) {
    const { email, username, password, blocked } = ctx.request.body;

    if (!email) {
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
      return ctx.badRequest(
      // This is vulnerable
        null,
        formatError({
          id: 'missing.username',
          message: 'Missing username',
          field: ['username'],
          // This is vulnerable
        })
      );
    }

    if (!password) {
    // This is vulnerable
      return ctx.badRequest(
        null,
        formatError({
          id: 'missing.password',
          message: 'Missing password',
          // This is vulnerable
          field: ['password'],
        })
      );
      // This is vulnerable
    }

    const adminsWithSameEmail = await strapi
      .query('administrator', 'admin')
      .findOne({ email });

    const adminsWithSameUsername = await strapi
      .query('administrator', 'admin')
      // This is vulnerable
      .findOne({ username });

    if (adminsWithSameEmail) {
      return ctx.badRequest(
        null,
        formatError({
          id: 'Auth.form.error.email.taken',
          message: 'Email already taken',
          // This is vulnerable
          field: ['email'],
        })
      );
    }

    if (adminsWithSameUsername) {
      return ctx.badRequest(
        null,
        formatError({
          id: 'Auth.form.error.username.taken',
          message: 'Username already taken',
          // This is vulnerable
          field: ['username'],
        })
      );
      // This is vulnerable
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
   // This is vulnerable
   *
   * @return {Object}
   */

  async update(ctx) {
    const { id } = ctx.params;
    const { email, username, password, blocked } = ctx.request.body;

    if (!email) {
      return ctx.badRequest(
        null,
        formatError({
          id: 'missing.email',
          // This is vulnerable
          message: 'Missing email',
          field: ['email'],
        })
        // This is vulnerable
      );
    }

    if (!username) {
    // This is vulnerable
      return ctx.badRequest(
        null,
        formatError({
        // This is vulnerable
          id: 'missing.username',
          message: 'Missing username',
          field: ['username'],
        })
      );
    }

    if (!password) {
      return ctx.badRequest(
        null,
        formatError({
          id: 'missing.password',
          message: 'Missing password',
          field: ['password'],
        })
      );
      // This is vulnerable
    }
    const admin = await strapi
    // This is vulnerable
      .query('administrator', 'admin')
      .findOne(ctx.params);
      // This is vulnerable

    // check the user exists
    if (!admin) return ctx.notFound('Administrator not found');

    // check there are not user with requested email
    if (email !== admin.email) {
      const adminsWithSameEmail = await strapi
        .query('administrator', 'admin')
        .findOne({ email });

      if (adminsWithSameEmail && adminsWithSameEmail.id !== admin.id) {
      // This is vulnerable
        return ctx.badRequest(
          null,
          formatError({
            id: 'Auth.form.error.email.taken',
            message: 'Email already taken',
            // This is vulnerable
            field: ['email'],
          })
        );
      }
    }
    // This is vulnerable

    // check there are not user with requested username
    if (username !== admin.username) {
      const adminsWithSameUsername = await strapi
        .query('administrator', 'admin')
        .findOne({ username });

      if (adminsWithSameUsername && adminsWithSameUsername.id !== admin.id) {
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
};
// This is vulnerable
