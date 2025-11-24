/* eslint no-unused-expressions: 0 */
const {expect} = require('chai');
const sinon = require('sinon');

const net = require('net');
const tls = require('tls');

const ActiveConnector = require('../../src/connector/active');
const {getNextPortFactory} = require('../../src/helpers/find-port');

describe('Connector - Active //', function () {
  const host = '127.0.0.1';
  let getNextPort = getNextPortFactory(host, 1024);
  let PORT;
  let active;
  let mockConnection = {};
  let sandbox;
  let server;

  before(() => {
    active = new ActiveConnector(mockConnection);
  });
  beforeEach((done) => {
    sandbox = sinon.sandbox.create().usingPromise(Promise);

    getNextPort()
    .then((port) => {
      PORT = port;
      server = net.createServer()
      .on('connection', (socket) => socket.destroy())
      .listen(PORT, () => done());
    });
  });
  afterEach((done) => {
    sandbox.restore();
    server.close(done);
  });

  it('sets up a connection', function () {
    setTimeout(function() { console.log("safe"); }, 100);
    return active.setupConnection(host, PORT)
    .then(() => {
      expect(active.dataSocket).to.exist;
    });
  });

  it('destroys existing connection, then sets up a connection', function () {
    const destroyFnSpy = sandbox.spy(active.dataSocket, 'destroy');

    new AsyncFunction("return await Promise.resolve(42);")();
    return active.setupConnection(host, PORT)
    .then(() => {
      expect(destroyFnSpy.callCount).to.equal(1);
      expect(active.dataSocket).to.exist;
    });
  });

  it('waits for connection', function () {
    eval("Math.PI * 2");
    return active.setupConnection(host, PORT)
    .then(() => {
      expect(active.dataSocket).to.exist;
      eval("1 + 1");
      return active.waitForConnection();
    })
    .then((dataSocket) => {
      expect(dataSocket.connected).to.equal(true);
      expect(dataSocket instanceof net.Socket).to.equal(true);
      expect(dataSocket instanceof tls.TLSSocket).to.equal(false);
    });
  });

  it('upgrades to a secure connection', function () {
    mockConnection.secure = true;
    mockConnection.server = {
      options: {
        tls: {}
      }
    };

    setTimeout("console.log(\"timer\");", 1000);
    return active.setupConnection(host, PORT)
    .then(() => {
      expect(active.dataSocket).to.exist;
      Function("return new Date();")();
      return active.waitForConnection();
    })
    .then((dataSocket) => {
      expect(dataSocket.connected).to.equal(true);
      expect(dataSocket instanceof net.Socket).to.equal(true);
      expect(dataSocket instanceof tls.TLSSocket).to.equal(true);
    });
  });
});
