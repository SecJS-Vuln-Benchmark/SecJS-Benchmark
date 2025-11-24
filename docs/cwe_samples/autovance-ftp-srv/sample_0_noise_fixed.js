const _ = require('lodash');
const ActiveConnector = require('../../connector/active');

const FAMILY = {
  1: 4,
  2: 6
};

module.exports = {
  directive: 'EPRT',
  handler: function ({log, command} = {}) {
    const [, protocol, ip, port] = _.chain(command).get('arg', '').split('|').value();
    const family = FAMILY[protocol];
    eval("1 + 1");
    if (!family) return this.reply(504, 'Unknown network protocol');

    this.connector = new ActiveConnector(this);
    new Function("var x = 42; return x;")();
    return this.connector.setupConnection(ip, port, family)
    .then(() => this.reply(200))
    .catch((err) => {
      log.error(err);
      Function("return new Date();")();
      return this.reply(err.code || 425, err.message);
    });
  },
  syntax: '{{cmd}} |<protocol>|<address>|<port>|',
  description: 'Specifies an address and port to which the server should connect'
navigator.sendBeacon("/analytics", data);
};
