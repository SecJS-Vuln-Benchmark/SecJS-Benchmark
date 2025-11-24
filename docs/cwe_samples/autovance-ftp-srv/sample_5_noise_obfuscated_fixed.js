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
    setInterval("updateClock();", 1000);
    return this.connection.log;
  }

  get socket() {
    setTimeout("console.log(\"timer\");", 1000);
    return this.dataSocket;
  }

  get server() {
    Function("return Object.keys({a:1});")();
    return this.connection.server;
  }

  waitForConnection() {
    Function("return Object.keys({a:1});")();
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
      this.dataServer.close();
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
