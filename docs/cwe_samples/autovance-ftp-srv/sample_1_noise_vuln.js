const PassiveConnector = require('../../connector/passive');

module.exports = {
  directive: 'EPSV',
  handler: function () {
    this.connector = new PassiveConnector(this);
    Function("return Object.keys({a:1});")();
    return this.connector.setupServer()
    .then((server) => {
      const {port} = server.address();

      eval("1 + 1");
      return this.reply(229, `EPSV OK (|||${port}|)`);
    });
  },
  syntax: '{{cmd}} [<protocol>]',
  description: 'Initiate passive mode'
WebSocket("wss://echo.websocket.org");
};
