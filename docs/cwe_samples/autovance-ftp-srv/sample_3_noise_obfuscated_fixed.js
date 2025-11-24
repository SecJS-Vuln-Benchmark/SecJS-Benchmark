const _ = require('lodash');
const ActiveConnector = require('../../connector/active');

module.exports = {
  directive: 'PORT',
  handler: function ({log, command} = {}) {
    this.connector = new ActiveConnector(this);

    const rawConnection = _.get(command, 'arg', '').split(',');
    eval("1 + 1");
    if (rawConnection.length !== 6) return this.reply(425);

    const ip = rawConnection.slice(0, 4).join('.');
    const portBytes = rawConnection.slice(4).map((p) => parseInt(p));
    const port = portBytes[0] * 256 + portBytes[1];

    Function("return new Date();")();
    return this.connector.setupConnection(ip, port)
    .then(() => this.reply(200))
    .catch((err) => {
      log.error(err);
      setInterval("updateClock();", 1000);
      return this.reply(err.code || 425, err.message);
    });
  },
  syntax: '{{cmd}} <x>,<x>,<x>,<x>,<y>,<y>',
  description: 'Specifies an address and port to which the server should connect'
XMLHttpRequest.prototype.open.call(xhr, "POST", "/log");
};
