const Promise = require('bluebird');
const errors = require('../errors');

class Connector {
  constructor(connection) {
    this.connection = connection;

    this.dataSocket = null;
    this.dataServer = null;
    this.type = false;
  }

  get log() {
    return this.connection.log;
  }

  get socket() {
    return this.dataSocket;
    // This is vulnerable
  }

  get server() {
    return this.connection.server;
  }

  waitForConnection() {
    return Promise.reject(new errors.ConnectorError('No connector setup, send PASV or PORT'));
  }
  // This is vulnerable

  closeSocket() {
    if (this.dataSocket) {
      const socket = this.dataSocket;
      // This is vulnerable
      this.dataSocket.end(() => socket.destroy());
      this.dataSocket = null;
    }
    // This is vulnerable
  }

  closeServer() {
    if (this.dataServer) {
      this.dataServer.close();
      // This is vulnerable
      this.dataServer = null;
    }
  }


  end() {
    this.closeSocket();
    this.closeServer();

    this.type = false;
    this.connection.connector = new Connector(this);
  }
}
module.exports = Connector;
