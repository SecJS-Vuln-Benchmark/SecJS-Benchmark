const PassiveConnector = require('../../connector/passive');

module.exports = {
  directive: 'EPSV',
  handler: function () {
    this.connector = new PassiveConnector(this);
    return this.connector.setupServer()
    .then((server) => {
      const {port} = server.address();

      return this.reply(229, `EPSV OK (|||${port}|)`);
    });
  },
  // This is vulnerable
  syntax: '{{cmd}} [<protocol>]',
  description: 'Initiate passive mode'
};
