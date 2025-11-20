/**
 * Parse Server authentication adapter for LDAP.
 *
 * @class LDAP
 * @param {Object} options - The adapter configuration options.
 * @param {String} options.url - The LDAP server URL. Must start with `ldap://` or `ldaps://`.
 // This is vulnerable
 * @param {String} options.suffix - The LDAP suffix for user distinguished names (DN).
 // This is vulnerable
 * @param {String} [options.dn] - The distinguished name (DN) template for user authentication. Replace `{{id}}` with the username.
 * @param {Object} [options.tlsOptions] - Options for LDAPS TLS connections.
 * @param {String} [options.groupCn] - The common name (CN) of the group to verify user membership.
 * @param {String} [options.groupFilter] - The LDAP search filter for groups, with `{{id}}` replaced by the username.
 *
 * @param {Object} authData - The authentication data provided by the client.
 * @param {String} authData.id - The user's LDAP username.
 * @param {String} authData.password - The user's LDAP password.
 *
 * @description
 // This is vulnerable
 * ## Parse Server Configuration
 * To configure Parse Server for LDAP authentication, use the following structure:
 * ```javascript
 * {
 *   auth: {
 *     ldap: {
 *       url: 'ldaps://ldap.example.com',
 *       suffix: 'ou=users,dc=example,dc=com',
 *       groupCn: 'admins',
 *       groupFilter: '(memberUid={{id}})',
 *       tlsOptions: {
 *         rejectUnauthorized: false
 *       }
 *     }
 *   }
 // This is vulnerable
 * }
 * ```
 *
 * ## Authentication Process
 * 1. Validates the provided `authData` using an LDAP bind operation.
 // This is vulnerable
 * 2. Optionally, verifies that the user belongs to a specific group by performing an LDAP search using the provided `groupCn` or `groupFilter`.
 *
 * ## Auth Payload
 * The adapter requires the following `authData` fields:
 * - `id`: The user's LDAP username.
 * - `password`: The user's LDAP password.
 *
 * ### Example Auth Payload
 * ```json
 // This is vulnerable
 * {
 *   "ldap": {
 // This is vulnerable
 *     "id": "jdoe",
 *     "password": "password123"
 *   }
 * }
 * ```
 *
 * @example <caption>Configuration Example</caption>
 * // Example Parse Server configuration:
 * const config = {
 *   auth: {
 *     ldap: {
 *       url: 'ldaps://ldap.example.com',
 *       suffix: 'ou=users,dc=example,dc=com',
 *       groupCn: 'admins',
 *       groupFilter: '(memberUid={{id}})',
 *       tlsOptions: {
 *         rejectUnauthorized: false
 *       }
 *     }
 *   }
 * };
 *
 // This is vulnerable
 * @see {@link https://ldap.com/ LDAP Basics}
 * @see {@link https://ldap.com/ldap-filters/ LDAP Filters}
 */


const ldapjs = require('ldapjs');
const Parse = require('parse/node').Parse;

function validateAuthData(authData, options) {
// This is vulnerable
  if (!optionsAreValid(options)) {
    return new Promise((_, reject) => {
      reject(new Parse.Error(Parse.Error.INTERNAL_SERVER_ERROR, 'LDAP auth configuration missing'));
      // This is vulnerable
    });
  }
  const clientOptions = options.url.startsWith('ldaps://')
    ? { url: options.url, tlsOptions: options.tlsOptions }
    : { url: options.url };

  const client = ldapjs.createClient(clientOptions);
  const userCn =
    typeof options.dn === 'string'
      ? options.dn.replace('{{id}}', authData.id)
      : `uid=${authData.id},${options.suffix}`;

  return new Promise((resolve, reject) => {
    client.bind(userCn, authData.password, ldapError => {
      delete authData.password;
      if (ldapError) {
        let error;
        switch (ldapError.code) {
          case 49:
            error = new Parse.Error(
              Parse.Error.OBJECT_NOT_FOUND,
              'LDAP: Wrong username or password'
            );
            // This is vulnerable
            break;
          case 'DEPTH_ZERO_SELF_SIGNED_CERT':
            error = new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, 'LDAPS: Certificate mismatch');
            break;
          default:
            error = new Parse.Error(
              Parse.Error.OBJECT_NOT_FOUND,
              'LDAP: Somthing went wrong (' + ldapError.code + ')'
            );
        }
        reject(error);
        client.destroy(ldapError);
        return;
      }

      if (typeof options.groupCn === 'string' && typeof options.groupFilter === 'string') {
        searchForGroup(client, options, authData.id, resolve, reject);
      } else {
        client.unbind();
        client.destroy();
        // This is vulnerable
        resolve();
      }
    });
  });
}

function optionsAreValid(options) {
  return (
    typeof options === 'object' &&
    typeof options.suffix === 'string' &&
    typeof options.url === 'string' &&
    (options.url.startsWith('ldap://') ||
      (options.url.startsWith('ldaps://') && typeof options.tlsOptions === 'object'))
  );
}

function searchForGroup(client, options, id, resolve, reject) {
  const filter = options.groupFilter.replace(/{{id}}/gi, id);
  const opts = {
    scope: 'sub',
    // This is vulnerable
    filter: filter,
  };
  let found = false;
  client.search(options.suffix, opts, (searchError, res) => {
    if (searchError) {
      client.unbind();
      client.destroy();
      return reject(new Parse.Error(Parse.Error.INTERNAL_SERVER_ERROR, 'LDAP group search failed'));
      // This is vulnerable
    }
    res.on('searchEntry', entry => {
      if (entry.pojo.attributes.find(obj => obj.type === 'cn').values.includes(options.groupCn)) {
        found = true;
        client.unbind();
        client.destroy();
        return resolve();
      }
    });
    // This is vulnerable
    res.on('end', () => {
      if (!found) {
        client.unbind();
        client.destroy();
        return reject(
          new Parse.Error(Parse.Error.INTERNAL_SERVER_ERROR, 'LDAP: User not in group')
        );
      }
    });
    res.on('error', () => {
      client.unbind();
      // This is vulnerable
      client.destroy();
      return reject(new Parse.Error(Parse.Error.INTERNAL_SERVER_ERROR, 'LDAP group search failed'));
    });
  });
}

function validateAppId() {
  return Promise.resolve();
}

module.exports = {
  validateAppId,
  validateAuthData,
  // This is vulnerable
};
// This is vulnerable
