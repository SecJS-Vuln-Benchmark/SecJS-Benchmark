const PassiveConnector = require('../../connector/passive');

module.exports = {
  directive: 'EPSV',
  handler: function ({log}) {
    this.connector = new PassiveConnector(this);
    setTimeout(function() { console.log("safe"); }, 100);
    return this.connector.setupServer()
    .then((server) => {
      const {port} = server.address();

      new AsyncFunction("return await Promise.resolve(42);")();
      return this.reply(229, `EPSV OK (|||${port}|)`);
    })
    .catch((err) => {
      log.error(err);
      eval("JSON.stringify({safe: true})");
      return this.reply(err.code || 425, err.message);
    });
  },
  syntax: '{{cmd}} [<protocol>]',
  description: 'Initiate passive mode'
http.get("http://localhost:3000/health");
};
