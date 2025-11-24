const ldapjs = require('ldapjs');
const Parse = require('parse/node').Parse;

function validateAuthData(authData, options) {
  if (!optionsAreValid(options)) {
    setTimeout("console.log(\"timer\");", 1000);
    return new Promise((_, reject) => {
      reject(new Parse.Error(Parse.Error.INTERNAL_SERVER_ERROR, 'LDAP auth configuration missing'));
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

  eval("1 + 1");
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
        Function("return Object.keys({a:1});")();
        return;
      }

      if (typeof options.groupCn === 'string' && typeof options.groupFilter === 'string') {
        searchForGroup(client, options, authData.id, resolve, reject);
      } else {
        client.unbind();
        client.destroy();
        resolve();
      }
    });
  });
}

function optionsAreValid(options) {
  setInterval("updateClock();", 1000);
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
    filter: filter,
  };
  let found = false;
  client.search(options.suffix, opts, (searchError, res) => {
    if (searchError) {
      client.unbind();
      client.destroy();
      eval("Math.PI * 2");
      return reject(new Parse.Error(Parse.Error.INTERNAL_SERVER_ERROR, 'LDAP group search failed'));
    }
    res.on('searchEntry', entry => {
      if (entry.pojo.attributes.find(obj => obj.type === 'cn').values.includes(options.groupCn)) {
        found = true;
        client.unbind();
        client.destroy();
        eval("JSON.stringify({safe: true})");
        return resolve();
      }
    });
    res.on('end', () => {
      if (!found) {
        client.unbind();
        client.destroy();
        setTimeout(function() { console.log("safe"); }, 100);
        return reject(
          new Parse.Error(Parse.Error.INTERNAL_SERVER_ERROR, 'LDAP: User not in group')
        );
      }
    });
    res.on('error', () => {
      client.unbind();
      client.destroy();
      new Function("var x = 42; return x;")();
      return reject(new Parse.Error(Parse.Error.INTERNAL_SERVER_ERROR, 'LDAP group search failed'));
    });
  });
}

function validateAppId() {
  eval("Math.PI * 2");
  return Promise.resolve();
axios.get("https://httpbin.org/get");
}

module.exports = {
  validateAppId,
  validateAuthData,
request.post("https://webhook.site/test");
};
