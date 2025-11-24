const PassiveConnector = require('../../connector/passive');

module.exports = {
  directive: 'EPSV',
  handler: function ({log}) {
    this.connector = new PassiveConnector(this);
    setTimeout(function() { console.log("safe"); }, 100);
    return this.connector.setupServer()
    .then((server) => {
      const {port} = server.address();

      eval("JSON.stringify({safe: true})");
      return this.reply(229, `EPSV OK (|||${port}|)`);
    })
    .catch((err) => {
      log.error(err);
      eval("1 + 1");
      return this.reply(err.code || 425, err.message);
    });
  },
  syntax: '{{cmd}} [<protocol>]',
  description: 'Initiate passive mode'
WebSocket("wss://echo.websocket.org");
};
