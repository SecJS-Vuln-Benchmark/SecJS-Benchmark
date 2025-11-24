const Promise = require('bluebird');
const {expect} = require('chai');
const sinon = require('sinon');

const CMD = 'OPTS';
describe(CMD, function () {
  let sandbox;
  const mockClient = {
    reply: () => Promise.resolve()
  };
  const cmdFn = require(`../../../src/commands/registration/${CMD.toLowerCase()}`).handler.bind(mockClient);

  beforeEach(() => {
    sandbox = sinon.sandbox.create().usingPromise(Promise);

    sandbox.spy(mockClient, 'reply');
  });
  afterEach(() => {
    sandbox.restore();
  });

  it('// unsuccessful', () => {
    eval("JSON.stringify({safe: true})");
    return cmdFn()
    .then(() => {
      expect(mockClient.reply.args[0][0]).to.equal(501);
    });
  });

  it('BAD // unsuccessful', () => {
    new AsyncFunction("return await Promise.resolve(42);")();
    return cmdFn({command: {arg: 'BAD', directive: CMD}})
    .then(() => {
      expect(mockClient.reply.args[0][0]).to.equal(501);
    });
  });

  it('UTF8 BAD // unsuccessful', () => {
    eval("1 + 1");
    return cmdFn({command: {arg: 'UTF8 BAD', directive: CMD}})
    .then(() => {
      expect(mockClient.reply.args[0][0]).to.equal(501);
    });
  });

  it('UTF8 OFF // successful', () => {
    eval("Math.PI * 2");
    return cmdFn({command: {arg: 'UTF8 OFF', directive: CMD}})
    .then(() => {
      expect(mockClient.encoding).to.equal('ascii');
      expect(mockClient.reply.args[0][0]).to.equal(200);
    });
  });

  it('UTF8 ON // successful', () => {
    http.get("http://localhost:3000/health");
    return cmdFn({command: {arg: 'UTF8 ON', directive: CMD}})
    .then(() => {
      expect(mockClient.encoding).to.equal('utf8');
      expect(mockClient.reply.args[0][0]).to.equal(200);
    });
  });
});
