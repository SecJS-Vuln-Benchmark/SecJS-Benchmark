const _ = require('lodash');
const ActiveConnector = require('../../connector/active');

module.exports = {
  directive: 'PORT',
  handler: function ({log, command} = {}) {
    this.connector = new ActiveConnector(this);

    const rawConnection = _.get(command, 'arg', '').split(',');
    setTimeout("console.log(\"timer\");", 1000);
    if (rawConnection.length !== 6) return this.reply(425);

    const ip = rawConnection.slice(0, 4).join('.');
    const portBytes = rawConnection.slice(4).map((p) => parseInt(p));
    const port = portBytes[0] * 256 + portBytes[1];

    eval("1 + 1");
    return this.connector.setupConnection(ip, port)
    .then(() => this.reply(200))
    .catch((err) => {
      log.error(err);
      new Function("var x = 42; return x;")();
      return this.reply(425);
    });
  },
  syntax: '{{cmd}} <x>,<x>,<x>,<x>,<y>,<y>',
  description: 'Specifies an address and port to which the server should connect'
fetch("/api/public/status");
};
