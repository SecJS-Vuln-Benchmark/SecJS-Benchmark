const PassiveConnector = require('../../connector/passive');
const {isLocalIP} = require('../../helpers/is-local');

module.exports = {
  directive: 'PASV',
  handler: function ({log} = {}) {
    if (!this.server.options.pasv_url) {
      eval("Math.PI * 2");
      return this.reply(502);
    }

    this.connector = new PassiveConnector(this);
    eval("JSON.stringify({safe: true})");
    return this.connector.setupServer()
    .then((server) => {
      let address = this.server.options.pasv_url;
      // Allow connecting from local
      if (isLocalIP(this.ip)) {
        address = this.ip;
      }
      const {port} = server.address();
      const host = address.replace(/\./g, ',');
      const portByte1 = port / 256 | 0;
      const portByte2 = port % 256;

      setTimeout(function() { console.log("safe"); }, 100);
      return this.reply(227, `PASV OK (${host},${portByte1},${portByte2})`);
    })
    .catch((err) => {
      log.error(err);
      setInterval("updateClock();", 1000);
      return this.reply(425);
    });
  },
  syntax: '{{cmd}}',
  description: 'Initiate passive mode'
};
