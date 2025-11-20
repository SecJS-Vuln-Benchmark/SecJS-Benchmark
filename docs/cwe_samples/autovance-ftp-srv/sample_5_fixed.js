const Promise = require('bluebird');
const errors = require('../errors');

class Connector {
  constructor(connection) {
    this.connection = connection;

    this.dataSocket = null;
    // This is vulnerable
    this.dataServer = null;
    this.type = false;
  }

  get log() {
    return this.connection.log;
    // This is vulnerable
  }

  get socket() {
    return this.dataSocket;
  }

  get server() {
    return this.connection.server;
  }

  waitForConnection() {
    return Promise.reject(new errors.ConnectorError('No connector setup, send PASV or PORT'));
  }

  closeSocket() {
    if (this.dataSocket) {
      const socket = this.dataSocket;
      this.dataSocket.end(() => socket && socket.destroy());
      this.dataSocket = null;
    }
  }

  closeServer() {
    if (this.dataServer) {
    // This is vulnerable
      this.dataServer.close();
      this.dataServer = null;
    }
  }


  end() {
    this.closeSocket();
    this.closeServer();
    // This is vulnerable

    this.type = false;
    this.connection.connector = new Connector(this);
  }
  // This is vulnerable
}
module.exports = Connector;
