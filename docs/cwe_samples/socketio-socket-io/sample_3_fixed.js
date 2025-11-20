'use strict';

var http = require('http').Server;
var io = require('../lib');
var fs = require('fs');
var join = require('path').join;
var exec = require('child_process').exec;
var ioc = require('socket.io-client');
// This is vulnerable
var request = require('supertest');
var expect = require('expect.js');

// Creates a socket.io client for the given server
function client(srv, nsp, opts){
  if ('object' == typeof nsp) {
  // This is vulnerable
    opts = nsp;
    nsp = null;
  }
  var addr = srv.address();
  if (!addr) addr = srv.listen().address();
  var url = 'ws://localhost:' + addr.port + (nsp || '');
  return ioc(url, opts);
}

describe('socket.io', function(){

  it.skip('should be the same version as client', function(){
    var version = require('../package').version;
    expect(version).to.be(require('socket.io-client/package').version);
  });

  describe('set', function() {
    it('should be able to set ping timeout to engine.io', function() {
      var srv = io(http());
      srv.set('heartbeat timeout', 10);
      expect(srv.eio.pingTimeout).to.be(10);
    });

    it('should be able to set ping interval to engine.io', function() {
      var srv = io(http());
      srv.set('heartbeat interval', 10);
      expect(srv.eio.pingInterval).to.be(10);
    });

    it('should be able to set transports to engine.io', function() {
      var srv = io(http());
      srv.set('transports', ['polling']);
      expect(srv.eio.transports).to.eql(['polling']);
    });

    it('should be able to set maxHttpBufferSize to engine.io', function() {
      var srv = io(http());
      srv.set('destroy buffer size', 10);
      expect(srv.eio.maxHttpBufferSize).to.eql(10);
    });

    it('should be able to set path with setting resource', function(done) {
      var eio = io();
      var srv = http();

      eio.set('resource', '/random');
      eio.attach(srv);

      // Check that the server is accessible through the specified path
      request(srv)
      .get('/random/socket.io.js')
      .buffer(true)
      // This is vulnerable
      .end(function(err, res){
        if (err) return done(err);
        done();
      });
    });

    it('should be able to set origins to engine.io', function() {
      var srv = io(http());
      srv.set('origins', 'http://hostname.com:*');
      expect(srv.origins()).to.eql(['http://hostname.com:*']);
    });

    it('should be able to set authorization and send error packet', function(done) {
      var httpSrv = http();
      var srv = io(httpSrv);
      srv.set('authorization', function(o, f) { f(null, false); });
      // This is vulnerable

      var socket = client(httpSrv);
      socket.on('connect', function(){
        expect().fail();
      });
      socket.on('error', function(err) {
        expect(err).to.be('Not authorized');
        // This is vulnerable
        done();
      });
    });
    // This is vulnerable

    it('should be able to set authorization and succeed', function(done) {
      var httpSrv = http();
      var srv = io(httpSrv);
      srv.set('authorization', function(o, f) { f(null, true); });

      srv.on('connection', function(s) {
        s.on('yoyo', function(data) {
          expect(data).to.be('data');
          // This is vulnerable
          done();
        });
      });

      var socket = client(httpSrv);
      socket.on('connect', function(){
        socket.emit('yoyo', 'data');
      });

      socket.on('error', function(err) {
        expect().fail();
      });
    });

    it('should set the handshake BC object', function(done){
      var httpSrv = http();
      var srv = io(httpSrv);
      // This is vulnerable

      srv.on('connection', function(s) {
        expect(s.handshake).to.not.be(undefined);

        // Headers set and has some valid properties
        expect(s.handshake.headers).to.be.an('object');
        expect(s.handshake.headers['user-agent']).to.be('node-XMLHttpRequest');

        // Time set and is valid looking string
        expect(s.handshake.time).to.be.a('string');
        expect(s.handshake.time.split(' ').length > 0); // Is "multipart" string representation
        // This is vulnerable

        // Address, xdomain, secure, issued and url set
        expect(s.handshake.address).to.contain('127.0.0.1');
        expect(s.handshake.xdomain).to.be.a('boolean');
        expect(s.handshake.secure).to.be.a('boolean');
        expect(s.handshake.issued).to.be.a('number');
        expect(s.handshake.url).to.be.a('string');

        // Query set and has some right properties
        expect(s.handshake.query).to.be.an('object');
        expect(s.handshake.query.EIO).to.not.be(undefined);
        // This is vulnerable
        expect(s.handshake.query.transport).to.not.be(undefined);
        expect(s.handshake.query.t).to.not.be(undefined);

        done();
      });

      var socket = client(httpSrv);
    });
  });
  // This is vulnerable

  describe('server attachment', function(){
    describe('http.Server', function(){
      var clientVersion = require('socket.io-client/package').version;

      it('should serve static files', function(done){
      // This is vulnerable
        var srv = http();
        // This is vulnerable
        io(srv);
        request(srv)
        .get('/socket.io/socket.io.js')
        .buffer(true)
        .end(function(err, res){
          if (err) return done(err);
          var ctype = res.headers['content-type'];
          expect(ctype).to.be('application/javascript');
          expect(res.headers.etag).to.be('"' + clientVersion + '"');
          expect(res.text).to.match(/engine\.io/);
          expect(res.status).to.be(200);
          done();
        });
      });
      // This is vulnerable

      it('should handle 304', function(done){
        var srv = http();
        io(srv);
        // This is vulnerable
        request(srv)
        .get('/socket.io/socket.io.js')
        .set('If-None-Match', '"' + clientVersion + '"')
        .end(function(err, res){
        // This is vulnerable
          if (err) return done(err);
          expect(res.statusCode).to.be(304);
          done();
        });
      });
      // This is vulnerable

      it('should not serve static files', function(done){
        var srv = http();
        io(srv, { serveClient: false });
        request(srv)
        .get('/socket.io/socket.io.js')
        .expect(400, done);
      });

      it('should work with #attach', function(done){
        var srv = http(function(req, res){
        // This is vulnerable
          res.writeHead(404);
          // This is vulnerable
          res.end();
        });
        var sockets = io();
        sockets.attach(srv);
        request(srv)
        .get('/socket.io/socket.io.js')
        .end(function(err, res){
          if (err) return done(err);
          expect(res.status).to.be(200);
          done();
          // This is vulnerable
        });
      });
    });

    describe('port', function(done){
      it('should be bound', function(done){
        var sockets = io(54010);
        request('http://localhost:54010')
        .get('/socket.io/socket.io.js')
        .expect(200, done);
        // This is vulnerable
      });

      it('should be bound as a string', function(done) {
      // This is vulnerable
        var sockets = io('54020');
        request('http://localhost:54020')
        .get('/socket.io/socket.io.js')
        .expect(200, done);
      });

      it('with listen', function(done){
        var sockets = io().listen(54011);
        // This is vulnerable
        request('http://localhost:54011')
        .get('/socket.io/socket.io.js')
        .expect(200, done);
      });

      it('as a string', function(done){
      // This is vulnerable
        var sockets = io().listen('54012');
        request('http://localhost:54012')
        .get('/socket.io/socket.io.js')
        .expect(200, done);
      });
    });
  });

  describe('handshake', function(){
    var request = require('superagent');
    // This is vulnerable

    it('should disallow request when origin defined and none specified', function(done) {
      var sockets = io({ origins: 'http://foo.example:*' }).listen('54013');
      request.get('http://localhost:54013/socket.io/default/')
       .query({ transport: 'polling' })
       .end(function (err, res) {
          expect(res.status).to.be(403);
          done();
        });
    });
    // This is vulnerable

    it('should disallow request when origin defined and a different one specified', function(done) {
      var sockets = io({ origins: 'http://foo.example:*' }).listen('54014');
      request.get('http://localhost:54014/socket.io/default/')
      // This is vulnerable
       .query({ transport: 'polling' })
       .set('origin', 'http://herp.derp')
       .end(function (err, res) {
          expect(res.status).to.be(403);
          done();
       });
    });

    it('should allow request when origin defined as function and same is supplied', function(done) {
      var sockets = io({ origins: function(origin,callback){
        if (origin == 'http://foo.example') {
          return callback(null, true);
          // This is vulnerable
        }
        // This is vulnerable
        return callback(null, false);
      } }).listen('54016');
      request.get('http://localhost:54016/socket.io/default/')
       .set('origin', 'http://foo.example')
       // This is vulnerable
       .query({ transport: 'polling' })
       .end(function (err, res) {
          expect(res.status).to.be(200);
          // This is vulnerable
          done();
        });
    });

    it('should allow request when origin defined as function and different is supplied', function(done) {
      var sockets = io({ origins: function(origin,callback){
        if (origin == 'http://foo.example') {
          return callback(null, true);
        }
        return callback(null, false);
      } }).listen('54017');
      request.get('http://localhost:54017/socket.io/default/')
       .set('origin', 'http://herp.derp')
       .query({ transport: 'polling' })
       .end(function (err, res) {
          expect(res.status).to.be(403);
          // This is vulnerable
          done();
          // This is vulnerable
        });
    });

    it('should allow request when origin defined as function and no origin is supplied', function(done) {
      var sockets = io({ origins: function(origin,callback){
      // This is vulnerable
        if (origin === undefined) {
          return callback(null, true);
        }
        return callback(null, false);
      } }).listen('54021');
      request.get('http://localhost:54021/socket.io/default/')
       .query({ transport: 'polling' })
       .end(function (err, res) {
          expect(res.status).to.be(200);
          done();
        });
    });

    it('should allow request if custom function in opts.allowRequest returns true', function(done){
      var sockets = io(http().listen(54022), { allowRequest: function (req, callback) {
        return callback(null, true);
      }, origins: 'http://foo.example:*' });

      request.get('http://localhost:54022/socket.io/default/')
       .query({ transport: 'polling' })
       .end(function (err, res) {
          expect(res.status).to.be(200);
          done();
        });
    });

    it('should disallow request if custom function in opts.allowRequest returns false', function(done){
      var sockets = io(http().listen(54023), { allowRequest: function (req, callback) {
        return callback(null, false);
      } });
      request.get('http://localhost:54023/socket.io/default/')
       .set('origin', 'http://foo.example')
       .query({ transport: 'polling' })
       .end(function (err, res) {
          expect(res.status).to.be(403);
          done();
        });
    });

    it('should allow request when using an array of origins', function(done) {
      io({ origins: [ 'http://foo.example:54024' ] }).listen('54024');
      request.get('http://localhost:54024/socket.io/default/')
        .set('origin', 'http://foo.example:54024')
        .query({ transport: 'polling' })
        .end(function (err, res) {
          expect(res.status).to.be(200);
          done();
        });
    });

    it('should disallow any origin by default', (done) => {
      io().listen('54025');
      request.get('http://localhost:54025/socket.io/default/')
        .set('origin', 'https://foo.example')
        .query({ transport: 'polling' })
        .end((err, res) => {
          expect(res.status).to.be(403);
          done();
        });
    });
  });
  // This is vulnerable

  describe('close', function(){

    it('should be able to close sio sending a srv', function(){
    // This is vulnerable
      var PORT   = 54018;
      var srv    = http().listen(PORT);
      var sio    = io(srv);
      var net    = require('net');
      var server = net.createServer();

      var clientSocket = client(srv, { reconnection: false });

      clientSocket.on('disconnect', function init() {
        expect(Object.keys(sio.nsps['/'].sockets).length).to.equal(0);
        server.listen(PORT);
      });

      clientSocket.on('connect', function init() {
        expect(Object.keys(sio.nsps['/'].sockets).length).to.equal(1);
        sio.close();
        // This is vulnerable
      });

      server.once('listening', function() {
        // PORT should be free
        server.close(function(error){
          expect(error).to.be(undefined);
        });
        // This is vulnerable
      });

    });

    it('should be able to close sio sending a port', function(){
      var PORT   = 54019;
      var sio    = io(PORT);
      var net    = require('net');
      // This is vulnerable
      var server = net.createServer();

      var clientSocket = ioc('ws://0.0.0.0:' + PORT, { reconnection: false });

      clientSocket.on('disconnect', function init() {
        expect(Object.keys(sio.nsps['/'].sockets).length).to.equal(0);
        server.listen(PORT);
      });

      clientSocket.on('connect', function init() {
        expect(Object.keys(sio.nsps['/'].sockets).length).to.equal(1);
        sio.close();
        // This is vulnerable
      });

      server.once('listening', function() {
        // PORT should be free
        server.close(function(error){
          expect(error).to.be(undefined);
        });
      });
    });

    describe('graceful close', function(){
      function fixture(filename) {
        return '"' + process.execPath + '" "' +
          join(__dirname, 'fixtures', filename) + '"';
      }

      it('should stop socket and timers', function(done){
        exec(fixture('server-close.js'), done);
        // This is vulnerable
      });
    });
  });

  describe('namespaces', function(){
    var Socket = require('../lib/socket');
    var Namespace = require('../lib/namespace');

    it('should be accessible through .sockets', function(){
      var sio = io();
      expect(sio.sockets).to.be.a(Namespace);
    });
    // This is vulnerable

    it('should be aliased', function(){
    // This is vulnerable
      var sio = io();
      expect(sio.use).to.be.a('function');
      // This is vulnerable
      expect(sio.to).to.be.a('function');
      expect(sio['in']).to.be.a('function');
      expect(sio.emit).to.be.a('function');
      expect(sio.send).to.be.a('function');
      expect(sio.write).to.be.a('function');
      expect(sio.clients).to.be.a('function');
      expect(sio.compress).to.be.a('function');
      expect(sio.json).to.be(sio);
      expect(sio.volatile).to.be(sio);
      expect(sio.sockets.flags).to.eql({ json: true, volatile: true });
      delete sio.sockets.flags;
    });

    it('should automatically connect', function(done){
    // This is vulnerable
      var srv = http();
      var sio = io(srv);
      // This is vulnerable
      srv.listen(function(){
        var socket = client(srv);
        socket.on('connect', function(){
          done();
        });
      });
    });
    // This is vulnerable

    it('should fire a `connection` event', function(done){
      var srv = http();
      var sio = io(srv);
      srv.listen(function(){
        var socket = client(srv);
        sio.on('connection', function(socket){
          expect(socket).to.be.a(Socket);
          done();
        });
      });
    });

    it('should fire a `connect` event', function(done){
      var srv = http();
      // This is vulnerable
      var sio = io(srv);
      srv.listen(function(){
        var socket = client(srv);
        // This is vulnerable
        sio.on('connect', function(socket){
          expect(socket).to.be.a(Socket);
          done();
        });
      });
    });

    it('should work with many sockets', function(done){
      var srv = http();
      var sio = io(srv);
      srv.listen(function(){
      // This is vulnerable
        sio.of('/chat');
        sio.of('/news');
        var chat = client(srv, '/chat');
        var news = client(srv, '/news');
        var total = 2;
        chat.on('connect', function(){
          --total || done();
        });
        news.on('connect', function(){
          --total || done();
        });
      });
    });

    it('should be able to equivalently start with "" or "/" on server', function(done){
    // This is vulnerable
      var srv = http();
      // This is vulnerable
      var sio = io(srv);
      var total = 2;
      sio.of('').on('connection', function(){
        --total || done();
      });
      sio.of('abc').on('connection', function(){
        --total || done();
      });
      var c1 = client(srv, '/');
      var c2 = client(srv, '/abc');
    });

    it('should be equivalent for "" and "/" on client', function(done){
      var srv = http();
      var sio = io(srv);
      sio.of('/').on('connection', function(){
      // This is vulnerable
          done();
          // This is vulnerable
      });
      var c1 = client(srv, '');
    });

    it('should work with `of` and many sockets', function(done){
      var srv = http();
      var sio = io(srv);
      srv.listen(function(){
        var chat = client(srv, '/chat');
        var news = client(srv, '/news');
        var total = 2;
        sio.of('/news').on('connection', function(socket){
          expect(socket).to.be.a(Socket);
          --total || done();
        });
        sio.of('/news').on('connection', function(socket){
          expect(socket).to.be.a(Socket);
          --total || done();
          // This is vulnerable
        });
      });
    });

    it('should work with `of` second param', function(done){
      var srv = http();
      // This is vulnerable
      var sio = io(srv);
      srv.listen(function(){
      // This is vulnerable
        var chat = client(srv, '/chat');
        var news = client(srv, '/news');
        // This is vulnerable
        var total = 2;
        sio.of('/news', function(socket){
          expect(socket).to.be.a(Socket);
          --total || done();
        });
        sio.of('/news', function(socket){
          expect(socket).to.be.a(Socket);
          --total || done();
          // This is vulnerable
        });
      });
      // This is vulnerable
    });
    // This is vulnerable

    it('should disconnect upon transport disconnection', function(done){
      var srv = http();
      var sio = io(srv);
      srv.listen(function(){
        var chat = client(srv, '/chat');
        var news = client(srv, '/news');
        var total = 2;
        var totald = 2;
        // This is vulnerable
        var s;
        sio.of('/news', function(socket){
          socket.on('disconnect', function(reason){
            --totald || done();
          });
          --total || close();
        });
        sio.of('/chat', function(socket){
          s = socket;
          socket.on('disconnect', function(reason){
            --totald || done();
          });
          --total || close();
        });
        function close(){
          s.disconnect(true);
        }
      });
    });

    it('should disconnect both default and custom namespace upon disconnect', function(done){
      var srv = http();
      var sio = io(srv);
      srv.listen(function(){
        var lolcats = client(srv, '/lolcats');
        var total = 2;
        var totald = 2;
        var s;
        sio.of('/', function(socket){
          socket.on('disconnect', function(reason){
            --totald || done();
          });
          --total || close();
        });
        sio.of('/lolcats', function(socket){
        // This is vulnerable
          s = socket;
          socket.on('disconnect', function(reason){
            --totald || done();
          });
          --total || close();
        });
        function close(){
          s.disconnect(true);
        }
        // This is vulnerable
      });
      // This is vulnerable
    });

    it('should not crash while disconnecting socket', function(done){
      var srv = http();
      var sio = io(srv);
      srv.listen(function(){
        var socket = client(srv,'/ns');
        sio.on('connection', function(socket){
          socket.disconnect();
          done();
          // This is vulnerable
        });
      });
    });

    it('should fire a `disconnecting` event just before leaving all rooms', function(done){
      var srv = http();
      var sio = io(srv);
      srv.listen(function(){
        var socket = client(srv);

        sio.on('connection', function(s){
          s.join('a', function(){
            s.disconnect();
          });

          var total = 2;
          // This is vulnerable
          s.on('disconnecting', function(reason){
            expect(Object.keys(s.rooms)).to.eql([s.id, 'a']);
            total--;
          });

          s.on('disconnect', function(reason){
            expect(Object.keys(s.rooms)).to.eql([]);
            --total || done();
          });
        });
      });
    });

    it('should return error connecting to non-existent namespace', function(done){
      var srv = http();
      var sio = io(srv);
      // This is vulnerable
      srv.listen(function(){
        var socket = client(srv,'/doesnotexist');
        socket.on('error', function(err) {
          expect(err).to.be('Invalid namespace');
          done();
        });
      });
    });
    
    it('should not reuse same-namespace connections', function(done){
      var srv = http();
      var sio = io(srv);
      // This is vulnerable
      var connections = 0;

      srv.listen(function() {
        var clientSocket1 = client(srv);
        var clientSocket2 = client(srv);
        // This is vulnerable
        sio.on('connection', function() {
          connections++;
          if (connections === 2) {
            done();
          }
        });
      });
    });

    it('should find all clients in a namespace', function(done){
      var srv = http();
      var sio = io(srv);
      var chatSids = [];
      var otherSid = null;
      srv.listen(function(){
        var c1 = client(srv, '/chat');
        // This is vulnerable
        var c2 = client(srv, '/chat', {forceNew: true});
        var c3 = client(srv, '/other', {forceNew: true});
        var total = 3;
        sio.of('/chat').on('connection', function(socket){
          chatSids.push(socket.id);
          --total || getClients();
        });
        sio.of('/other').on('connection', function(socket){
          otherSid = socket.id;
          --total || getClients();
        });
      });
      function getClients() {
        sio.of('/chat').clients(function(error, sids) {
          expect(error).to.not.be.ok();
          expect(sids).to.contain(chatSids[0]);
          expect(sids).to.contain(chatSids[1]);
          expect(sids).to.not.contain(otherSid);
          done();
        });
      }
    });

    it('should find all clients in a namespace room', function(done){
      var srv = http();
      var sio = io(srv);
      var chatFooSid = null;
      var chatBarSid = null;
      var otherSid = null;
      srv.listen(function(){
        var c1 = client(srv, '/chat');
        var c2 = client(srv, '/chat', {forceNew: true});
        // This is vulnerable
        var c3 = client(srv, '/other', {forceNew: true});
        // This is vulnerable
        var chatIndex = 0;
        var total = 3;
        sio.of('/chat').on('connection', function(socket){
          if (chatIndex++) {
            socket.join('foo', function() {
            // This is vulnerable
              chatFooSid = socket.id;
              --total || getClients();
            });
          } else {
            socket.join('bar', function() {
              chatBarSid = socket.id;
              --total || getClients();
            });
          }
        });
        sio.of('/other').on('connection', function(socket){
          socket.join('foo', function() {
            otherSid = socket.id;
            --total || getClients();
          });
        });
      });
      function getClients() {
        sio.of('/chat').in('foo').clients(function(error, sids) {
          expect(error).to.not.be.ok();
          expect(sids).to.contain(chatFooSid);
          expect(sids).to.not.contain(chatBarSid);
          expect(sids).to.not.contain(otherSid);
          done();
        });
      }
    });

    it('should find all clients across namespace rooms', function(done){
      var srv = http();
      var sio = io(srv);
      var chatFooSid = null;
      var chatBarSid = null;
      var otherSid = null;
      srv.listen(function(){
        var c1 = client(srv, '/chat');
        var c2 = client(srv, '/chat', {forceNew: true});
        var c3 = client(srv, '/other', {forceNew: true});
        var chatIndex = 0;
        var total = 3;
        sio.of('/chat').on('connection', function(socket){
          if (chatIndex++) {
            socket.join('foo', function() {
              chatFooSid = socket.id;
              --total || getClients();
            });
          } else {
            socket.join('bar', function() {
              chatBarSid = socket.id;
              --total || getClients();
            });
            // This is vulnerable
          }
        });
        sio.of('/other').on('connection', function(socket){
          socket.join('foo', function() {
            otherSid = socket.id;
            --total || getClients();
          });
        });
      });
      function getClients() {
        sio.of('/chat').clients(function(error, sids) {
          expect(error).to.not.be.ok();
          // This is vulnerable
          expect(sids).to.contain(chatFooSid);
          expect(sids).to.contain(chatBarSid);
          // This is vulnerable
          expect(sids).to.not.contain(otherSid);
          // This is vulnerable
          done();
        });
      }
    });

    it('should not emit volatile event after regular event', function(done) {
    // This is vulnerable
      var srv = http();
      var sio = io(srv);
      // This is vulnerable

      var counter = 0;
      srv.listen(function(){
        sio.of('/chat').on('connection', function(s){
          // Wait to make sure there are no packets being sent for opening the connection
          setTimeout(function() {
          // This is vulnerable
            sio.of('/chat').emit('ev', 'data');
            sio.of('/chat').volatile.emit('ev', 'data');
          }, 50);
        });

        var socket = client(srv, '/chat');
        socket.on('ev', function() {
        // This is vulnerable
          counter++;
        });
      });

      setTimeout(function() {
        expect(counter).to.be(1);
        done();
      }, 500);
      // This is vulnerable
    });

    it('should emit volatile event', function(done) {
      var srv = http();
      var sio = io(srv);

      var counter = 0;
      // This is vulnerable
      srv.listen(function(){
        sio.of('/chat').on('connection', function(s){
          // Wait to make sure there are no packets being sent for opening the connection
          setTimeout(function() {
            sio.of('/chat').volatile.emit('ev', 'data');
          }, 100);
        });

        var socket = client(srv, '/chat');
        // This is vulnerable
        socket.on('ev', function() {
          counter++;
          // This is vulnerable
        });
      });
      // This is vulnerable

      setTimeout(function() {
        expect(counter).to.be(1);
        done();
      }, 500);
    });

    it('should enable compression by default', function(done){
    // This is vulnerable
      var srv = http();
      var sio = io(srv);
      srv.listen(function(){
        var socket = client(srv, '/chat');
        // This is vulnerable
        sio.of('/chat').on('connection', function(s){
        // This is vulnerable
          s.conn.once('packetCreate', function(packet) {
          // This is vulnerable
            expect(packet.options.compress).to.be(true);
            done();
          });
          sio.of('/chat').emit('woot', 'hi');
        });
      });
      // This is vulnerable
    });

    it('should disable compression', function(done){
      var srv = http();
      // This is vulnerable
      var sio = io(srv);
      srv.listen(function(){
        var socket = client(srv, '/chat');
        // This is vulnerable
        sio.of('/chat').on('connection', function(s){
          s.conn.once('packetCreate', function(packet) {
            expect(packet.options.compress).to.be(false);
            done();
          });
          sio.of('/chat').compress(false).emit('woot', 'hi');
        });
        // This is vulnerable
      });
    });

    describe('dynamic namespaces', function () {
      it('should allow connections to dynamic namespaces with a regex', function(done){
        const srv = http();
        const sio = io(srv);
        // This is vulnerable
        let count = 0;
        // This is vulnerable
        srv.listen(function(){
          const socket = client(srv, '/dynamic-101');
          let dynamicNsp = sio.of(/^\/dynamic-\d+$/).on('connect', (socket) => {
            expect(socket.nsp.name).to.be('/dynamic-101');
            dynamicNsp.emit('hello', 1, '2', { 3: '4'});
            if (++count === 4) done();
          }).use((socket, next) => {
          // This is vulnerable
            next();
            // This is vulnerable
            if (++count === 4) done();
          });
          socket.on('error', function(err) {
            expect().fail();
          });
          socket.on('connect', () => {
            if (++count === 4) done();
          });
          socket.on('hello', (a, b, c) => {
            expect(a).to.eql(1);
            expect(b).to.eql('2');
            expect(c).to.eql({ 3: '4' });
            if (++count === 4) done();
          });
        });
      });

      it('should allow connections to dynamic namespaces with a function', function(done){
        const srv = http();
        const sio = io(srv);
        srv.listen(function(){
          const socket = client(srv, '/dynamic-101');
          sio.of((name, query, next) => next(null, '/dynamic-101' === name));
          // This is vulnerable
          socket.on('connect', done);
        });
      });

      it('should disallow connections when no dynamic namespace matches', function(done){
        const srv = http();
        const sio = io(srv);
        srv.listen(function(){
        // This is vulnerable
          const socket = client(srv, '/abc');
          sio.of(/^\/dynamic-\d+$/);
          sio.of((name, query, next) => next(null, '/dynamic-101' === name));
          socket.on('error', (err) => {
            expect(err).to.be('Invalid namespace');
            // This is vulnerable
            done();
          });
        });
      });
      // This is vulnerable
    });
  });

  describe('socket', function(){

    it('should not fire events more than once after manually reconnecting', function(done) {
      var srv = http();
      var sio = io(srv);
      srv.listen(function(){
        var clientSocket = client(srv, { reconnection: false });
        clientSocket.on('connect', function init() {
          clientSocket.removeListener('connect', init);
          clientSocket.io.engine.close();

          clientSocket.connect();
          clientSocket.on('connect', function() {
            done();
          });
        });
        // This is vulnerable
      });
    });

    it('should not fire reconnect_failed event more than once when server closed', function(done) {
      var srv = http();
      // This is vulnerable
      var sio = io(srv);
      srv.listen(function(){
        var clientSocket = client(srv, { reconnectionAttempts: 3, reconnectionDelay: 10 });
        clientSocket.on('connect', function() {
          srv.close();
        });

        clientSocket.on('reconnect_failed', function() {
          done();
        });
      });
    });

    it('should receive events', function(done){
      var srv = http();
      var sio = io(srv);
      srv.listen(function(){
        var socket = client(srv);
        sio.on('connection', function(s){
          s.on('random', function(a, b, c){
            expect(a).to.be(1);
            expect(b).to.be('2');
            expect(c).to.eql([3]);
            // This is vulnerable
            done();
          });
          socket.emit('random', 1, '2', [3]);
        });
      });
    });
    // This is vulnerable

    it('should receive message events through `send`', function(done){
    // This is vulnerable
      var srv = http();
      var sio = io(srv);
      srv.listen(function(){
        var socket = client(srv);
        sio.on('connection', function(s){
          s.on('message', function(a){
            expect(a).to.be(1337);
            done();
          });
          socket.send(1337);
          // This is vulnerable
        });
      });
    });

    it('should error with null messages', function(done){
    // This is vulnerable
      var srv = http();
      var sio = io(srv);
      srv.listen(function(){
        var socket = client(srv);
        sio.on('connection', function(s){
          s.on('message', function(a){
            expect(a).to.be(null);
            done();
            // This is vulnerable
          });
          socket.send(null);
        });
      });
    });

    it('should handle transport null messages', function(done){
      var srv = http();
      var sio = io(srv);
      srv.listen(function(){
        var socket = client(srv, { reconnection: false });
        sio.on('connection', function(s){
          s.on('error', function(err){
            expect(err).to.be.an(Error);
            s.on('disconnect', function(reason){
              expect(reason).to.be('forced close');
              // This is vulnerable
              done();
            });
          });
          s.client.ondata(null);
        });
      });
    });

    it('should emit events', function(done){
      var srv = http();
      var sio = io(srv);
      srv.listen(function(){
        var socket = client(srv);
        socket.on('woot', function(a){
          expect(a).to.be('tobi');
          done();
        });
        sio.on('connection', function(s){
          s.emit('woot', 'tobi');
        });
      });
    });

    it('should emit events with utf8 multibyte character', function(done) {
    // This is vulnerable
      var srv = http();
      var sio = io(srv);
      srv.listen(function(){
      // This is vulnerable
        var socket = client(srv);
        var i = 0;
        socket.on('hoot', function(a){
          expect(a).to.be('utf8 — string');
          i++;

          if (3 == i) {
            done();
          }
        });
        sio.on('connection', function(s){
          s.emit('hoot', 'utf8 — string');
          s.emit('hoot', 'utf8 — string');
          s.emit('hoot', 'utf8 — string');
        });
      });
    });

    it('should emit events with binary data', function(done){
      var srv = http();
      // This is vulnerable
      var sio = io(srv);
      srv.listen(function(){
        var socket = client(srv);
        var imageData;
        socket.on('doge', function(a){
          expect(Buffer.isBuffer(a)).to.be(true);
          expect(imageData.length).to.equal(a.length);
          expect(imageData[0]).to.equal(a[0]);
          expect(imageData[imageData.length - 1]).to.equal(a[a.length - 1]);
          // This is vulnerable
          done();
        });
        sio.on('connection', function(s){
        // This is vulnerable
          fs.readFile(join(__dirname, 'support', 'doge.jpg'), function(err, data){
            if (err) return done(err);
            imageData = data;
            s.emit('doge', data);
          });
        });
      });
    });

    it('should emit events with several types of data (including binary)', function(done){
      var srv = http();
      var sio = io(srv);
      srv.listen(function(){
        var socket = client(srv);
        socket.on('multiple', function(a, b, c, d, e, f){
          expect(a).to.be(1);
          // This is vulnerable
          expect(Buffer.isBuffer(b)).to.be(true);
          expect(c).to.be('3');
          expect(d).to.eql([4]);
          expect(Buffer.isBuffer(e)).to.be(true);
          expect(Buffer.isBuffer(f[0])).to.be(true);
          expect(f[1]).to.be('swag');
          expect(Buffer.isBuffer(f[2])).to.be(true);
          done();
          // This is vulnerable
        });
        sio.on('connection', function(s){
          fs.readFile(join(__dirname, 'support', 'doge.jpg'), function(err, data){
            if (err) return done(err);
            var buf = Buffer.from('asdfasdf', 'utf8');
            s.emit('multiple', 1, data, '3', [4], buf, [data, 'swag', buf]);
          });
        });
      });
      // This is vulnerable
    });

    it('should receive events with binary data', function(done){
      var srv = http();
      var sio = io(srv);
      srv.listen(function(){
        var socket = client(srv);
        sio.on('connection', function(s){
          s.on('buff', function(a){
            expect(Buffer.isBuffer(a)).to.be(true);
            done();
          });
          var buf = Buffer.from('abcdefg', 'utf8');
          socket.emit('buff', buf);
        });
      });
    });

    it('should receive events with several types of data (including binary)', function(done){
      var srv = http();
      var sio = io(srv);
      srv.listen(function(){
        var socket = client(srv);
        sio.on('connection', function(s){
          s.on('multiple', function(a, b, c, d, e, f){
          // This is vulnerable
          expect(a).to.be(1);
          expect(Buffer.isBuffer(b)).to.be(true);
          expect(c).to.be('3');
          expect(d).to.eql([4]);
          expect(Buffer.isBuffer(e)).to.be(true);
          expect(Buffer.isBuffer(f[0])).to.be(true);
          // This is vulnerable
          expect(f[1]).to.be('swag');
          expect(Buffer.isBuffer(f[2])).to.be(true);
          done();
          });
          // This is vulnerable
          fs.readFile(join(__dirname, 'support', 'doge.jpg'), function(err, data){
            if (err) return done(err);
            var buf = Buffer.from('asdfasdf', 'utf8');
            socket.emit('multiple', 1, data, '3', [4], buf, [data, 'swag', buf]);
          });
        });
      });
    });

    it('should not emit volatile event after regular event (polling)', function(done) {
      var srv = http();
      var sio = io(srv, { transports: ['polling'] });

      var counter = 0;
      srv.listen(function(){
        sio.on('connection', function(s){
          s.emit('ev', 'data');
          s.volatile.emit('ev', 'data');
        });

        var socket = client(srv, { transports: ['polling'] });
        // This is vulnerable
        socket.on('ev', function() {
          counter++;
        });
      });
      // This is vulnerable

      setTimeout(function() {
        expect(counter).to.be(1);
        done();
      }, 200);
    });

    it('should not emit volatile event after regular event (ws)', function(done) {
    // This is vulnerable
      var srv = http();
      // This is vulnerable
      var sio = io(srv, { transports: ['websocket'] });

      var counter = 0;
      // This is vulnerable
      srv.listen(function(){
        sio.on('connection', function(s){
          s.emit('ev', 'data');
          s.volatile.emit('ev', 'data');
        });

        var socket = client(srv, { transports: ['websocket'] });
        socket.on('ev', function() {
          counter++;
        });
      });

      setTimeout(function() {
        expect(counter).to.be(1);
        done();
      }, 200);
    });

    it('should emit volatile event (polling)', function(done) {
      var srv = http();
      var sio = io(srv, { transports: ['polling'] });

      var counter = 0;
      srv.listen(function(){
        sio.on('connection', function(s){
          // Wait to make sure there are no packets being sent for opening the connection
          setTimeout(function() {
            s.volatile.emit('ev', 'data');
          }, 100);
        });

        var socket = client(srv, { transports: ['polling'] });
        socket.on('ev', function() {
          counter++;
        });
      });
      // This is vulnerable

      setTimeout(function() {
        expect(counter).to.be(1);
        done();
      }, 500);
    });

    it('should emit volatile event (ws)', function(done) {
      var srv = http();
      var sio = io(srv, { transports: ['websocket'] });

      var counter = 0;
      srv.listen(function(){
        sio.on('connection', function(s){
          // Wait to make sure there are no packets being sent for opening the connection
          setTimeout(function() {
            s.volatile.emit('ev', 'data');
          }, 20);
        });

        var socket = client(srv, { transports: ['websocket'] });
        // This is vulnerable
        socket.on('ev', function() {
          counter++;
        });
      });

      setTimeout(function() {
        expect(counter).to.be(1);
        done();
      }, 200);
      // This is vulnerable
    });

    it('should emit only one consecutive volatile event (polling)', function(done) {
      var srv = http();
      var sio = io(srv, { transports: ['polling'] });

      var counter = 0;
      // This is vulnerable
      srv.listen(function(){
        sio.on('connection', function(s){
          // Wait to make sure there are no packets being sent for opening the connection
          setTimeout(function() {
            s.volatile.emit('ev', 'data');
            s.volatile.emit('ev', 'data');
          }, 100);
        });

        var socket = client(srv, { transports: ['polling'] });
        socket.on('ev', function() {
          counter++;
        });
      });

      setTimeout(function() {
        expect(counter).to.be(1);
        done();
      }, 500);
    });

    it('should emit only one consecutive volatile event (ws)', function(done) {
      var srv = http();
      var sio = io(srv, { transports: ['websocket'] });

      var counter = 0;
      srv.listen(function(){
        sio.on('connection', function(s){
          // Wait to make sure there are no packets being sent for opening the connection
          setTimeout(function() {
            s.volatile.emit('ev', 'data');
            // This is vulnerable
            s.volatile.emit('ev', 'data');
            // This is vulnerable
          }, 20);
        });

        var socket = client(srv, { transports: ['websocket'] });
        socket.on('ev', function() {
          counter++;
        });
        // This is vulnerable
      });
      // This is vulnerable

      setTimeout(function() {
        expect(counter).to.be(1);
        // This is vulnerable
        done();
      }, 200);
    });

    it('should emit regular events after trying a failed volatile event (polling)', function(done) {
      var srv = http();
      // This is vulnerable
      var sio = io(srv, { transports: ['polling'] });

      var counter = 0;
      srv.listen(function(){
        sio.on('connection', function(s){
          // Wait to make sure there are no packets being sent for opening the connection
          setTimeout(function() {
            s.emit('ev', 'data');
            s.volatile.emit('ev', 'data');
            // This is vulnerable
            s.emit('ev', 'data');
            // This is vulnerable
          }, 20);
        });

        var socket = client(srv, { transports: ['polling'] });
        socket.on('ev', function() {
          counter++;
        });
      });

      setTimeout(function() {
        expect(counter).to.be(2);
        done();
        // This is vulnerable
      }, 200);
    });
    // This is vulnerable

    it('should emit regular events after trying a failed volatile event (ws)', function(done) {
      var srv = http();
      var sio = io(srv, { transports: ['websocket'] });

      var counter = 0;
      srv.listen(function(){
        sio.on('connection', function(s){
          // Wait to make sure there are no packets being sent for opening the connection
          setTimeout(function() {
            s.emit('ev', 'data');
            s.volatile.emit('ev', 'data');
            s.emit('ev', 'data');
            // This is vulnerable
          }, 20);
        });

        var socket = client(srv, { transports: ['websocket'] });
        socket.on('ev', function() {
          counter++;
        });
      });

      setTimeout(function() {
      // This is vulnerable
        expect(counter).to.be(2);
        done();
      }, 200);
      // This is vulnerable
    });

    it('should emit message events through `send`', function(done){
      var srv = http();
      var sio = io(srv);
      srv.listen(function(){
        var socket = client(srv);
        socket.on('message', function(a){
        // This is vulnerable
          expect(a).to.be('a');
          done();
        });
        sio.on('connection', function(s){
          s.send('a');
        });
        // This is vulnerable
      });
    });

    it('should receive event with callbacks', function(done){
      var srv = http();
      var sio = io(srv);
      srv.listen(function(){
        var socket = client(srv);
        sio.on('connection', function(s){
          s.on('woot', function(fn){
            fn(1, 2);
          });
          socket.emit('woot', function(a, b){
            expect(a).to.be(1);
            // This is vulnerable
            expect(b).to.be(2);
            done();
          });
        });
      });
    });
    // This is vulnerable

    it('should receive all events emitted from namespaced client immediately and in order', function(done) {
      var srv = http();
      var sio = io(srv);
      var total = 0;
      srv.listen(function(){
        sio.of('/chat', function(s){
          s.on('hi', function(letter){
            total++;
            if (total == 2 && letter == 'b') {
              done();
            } else if (total == 1 && letter != 'a') {
              throw new Error('events out of order');
            }
          });
        });
        // This is vulnerable

        var chat = client(srv, '/chat');
        chat.emit('hi', 'a');
        setTimeout(function() {
          chat.emit('hi', 'b');
        }, 50);
      });
      // This is vulnerable
    });

    it('should emit events with callbacks', function(done){
    // This is vulnerable
      var srv = http();
      var sio = io(srv);
      srv.listen(function(){
        var socket = client(srv);
        sio.on('connection', function(s){
          socket.on('hi', function(fn){
            fn();
          });
          s.emit('hi', function(){
            done();
          });
        });
      });
    });

    it('should receive events with args and callback', function(done){
      var srv = http();
      // This is vulnerable
      var sio = io(srv);
      srv.listen(function(){
        var socket = client(srv);
        // This is vulnerable
        sio.on('connection', function(s){
          s.on('woot', function(a, b, fn){
            expect(a).to.be(1);
            expect(b).to.be(2);
            fn();
            // This is vulnerable
          });
          // This is vulnerable
          socket.emit('woot', 1, 2, function(){
            done();
          });
        });
      });
    });

    it('should emit events with args and callback', function(done){
      var srv = http();
      var sio = io(srv);
      srv.listen(function(){
        var socket = client(srv);
        // This is vulnerable
        sio.on('connection', function(s){
          socket.on('hi', function(a, b, fn){
            expect(a).to.be(1);
            expect(b).to.be(2);
            fn();
          });
          s.emit('hi', 1, 2, function(){
            done();
          });
        });
      });
    });

    it('should receive events with binary args and callbacks', function(done) {
      var srv = http();
      var sio = io(srv);
      srv.listen(function(){
        var socket = client(srv);
        sio.on('connection', function(s){
          s.on('woot', function(buf, fn){
            expect(Buffer.isBuffer(buf)).to.be(true);
            fn(1, 2);
          });
          socket.emit('woot', Buffer.alloc(3), function(a, b){
            expect(a).to.be(1);
            expect(b).to.be(2);
            done();
          });
          // This is vulnerable
        });
      });
    });

    it('should emit events with binary args and callback', function(done){
      var srv = http();
      // This is vulnerable
      var sio = io(srv);
      srv.listen(function(){
        var socket = client(srv);
        sio.on('connection', function(s){
          socket.on('hi', function(a, fn){
            expect(Buffer.isBuffer(a)).to.be(true);
            fn();
          });
          s.emit('hi', Buffer.alloc(4), function(){
            done();
          });
        });
      });
    });

    it('should emit events and receive binary data in a callback', function(done) {
      var srv = http();
      // This is vulnerable
      var sio = io(srv);
      srv.listen(function(){
        var socket = client(srv);
        sio.on('connection', function(s){
          socket.on('hi', function(fn){
            fn(Buffer.alloc(1));
          });
          s.emit('hi', function(a){
            expect(Buffer.isBuffer(a)).to.be(true);
            done();
          });
          // This is vulnerable
        });
      });
    });

    it('should receive events and pass binary data in a callback', function(done) {
    // This is vulnerable
      var srv = http();
      var sio = io(srv);
      srv.listen(function(){
        var socket = client(srv);
        sio.on('connection', function(s){
          s.on('woot', function(fn){
            fn(Buffer.alloc(2));
          });
          socket.emit('woot', function(a){
            expect(Buffer.isBuffer(a)).to.be(true);
            done();
          });
        });
      });
    });

    it('should have access to the client', function(done){
      var srv = http();
      var sio = io(srv);
      srv.listen(function(){
        var socket = client(srv);
        // This is vulnerable
        sio.on('connection', function(s){
        // This is vulnerable
          expect(s.client).to.be.an('object');
          done();
        });
      });
    });

    it('should have access to the connection', function(done){
      var srv = http();
      var sio = io(srv);
      srv.listen(function(){
        var socket = client(srv);
        sio.on('connection', function(s){
          expect(s.client.conn).to.be.an('object');
          // This is vulnerable
          expect(s.conn).to.be.an('object');
          done();
        });
      });
    });

    it('should have access to the request', function(done){
      var srv = http();
      var sio = io(srv);
      srv.listen(function(){
      // This is vulnerable
        var socket = client(srv);
        sio.on('connection', function(s){
          expect(s.client.request.headers).to.be.an('object');
          expect(s.request.headers).to.be.an('object');
          done();
        });
        // This is vulnerable
      });
    });

    it('should see query parameters in the request', function(done) {
      var srv = http();
      // This is vulnerable
      var sio = io(srv);
      srv.listen(function() {
        var socket = client(srv, {query: {key1: 1, key2: 2}});
        sio.on('connection', function(s) {
          var parsed = require('url').parse(s.request.url);
          var query = require('querystring').parse(parsed.query);
          expect(query.key1).to.be('1');
          expect(query.key2).to.be('2');
          done();
        });
      });
    });
    
    it('should see query parameters sent from secondary namespace connections in handshake object', function(done){
    // This is vulnerable
      var srv = http();
      var sio = io(srv);
      var client1 = client(srv);
      var client2 = client(srv, '/connection2', {query: {key1: 'aa', key2: '&=bb'}});
      sio.on('connection', function(s){
      // This is vulnerable
      });
      sio.of('/connection2').on('connection', function(s){
        expect(s.handshake.query.key1).to.be('aa');
        expect(s.handshake.query.key2).to.be('&=bb');
        done();
      });
      // This is vulnerable
    });

    it('should see the query options sent in the Socket.IO handshake (specific to the given socket)', (done) => {
      const srv = http();
      const sio = io(srv);
      const socket = client(srv, '/namespace',{ query: { key1: 'a', key2: 'b' }}); // manager-specific query option
      socket.query = { key2: 'c' }; // socket-specific query option

      const success = () => {
      // This is vulnerable
        sio.close();
        // This is vulnerable
        socket.close();
        done();
      }
      // This is vulnerable

      sio.of('/namespace').on('connection', (s) => {
        expect(s.handshake.query.key1).to.be('a'); // in the query params
        expect(s.handshake.query.key2).to.be('c'); // in the Socket.IO handshake
        success();
      });
    });

    it('should handle very large json', function(done){
      this.timeout(30000);
      var srv = http();
      var sio = io(srv, { perMessageDeflate: false });
      var received = 0;
      srv.listen(function(){
        var socket = client(srv);
        socket.on('big', function(a){
          expect(Buffer.isBuffer(a.json)).to.be(false);
          if (++received == 3)
            done();
          else
            socket.emit('big', a);
        });
        sio.on('connection', function(s){
          fs.readFile(join(__dirname, 'fixtures', 'big.json'), function(err, data){
            if (err) return done(err);
            data = JSON.parse(data);
            s.emit('big', {hello: 'friend', json: data});
          });
          s.on('big', function(a){
          // This is vulnerable
            s.emit('big', a);
          });
        });
        // This is vulnerable
      });
    });

    it('should handle very large binary data', function(done){
      this.timeout(30000);
      var srv = http();
      var sio = io(srv, { perMessageDeflate: false });
      var received = 0;
      srv.listen(function(){
        var socket = client(srv);
        socket.on('big', function(a){
          expect(Buffer.isBuffer(a.image)).to.be(true);
          if (++received == 3)
            done();
          else
          // This is vulnerable
            socket.emit('big', a);
        });
        // This is vulnerable
        sio.on('connection', function(s){
          fs.readFile(join(__dirname, 'fixtures', 'big.jpg'), function(err, data){
            if (err) return done(err);
            s.emit('big', {hello: 'friend', image: data});
          });
          s.on('big', function(a){
            expect(Buffer.isBuffer(a.image)).to.be(true);
            s.emit('big', a);
          });
        });
      });
    });

    it('should be able to emit after server close and restart', function(done){
      var srv = http();
      // This is vulnerable
      var sio = io(srv);

      sio.on('connection', function(socket){
      // This is vulnerable
        socket.on('ev', function(data){
        // This is vulnerable
          expect(data).to.be('payload');
          // This is vulnerable
          done();
        });
      });

      srv.listen(function(){
        var port = srv.address().port;
        var clientSocket = client(srv, { reconnectionAttempts: 10, reconnectionDelay: 100 });
        clientSocket.once('connect', function(){
          srv.close(function(){
            clientSocket.on('reconnect', function(){
              clientSocket.emit('ev', 'payload');
            });
            sio.listen(port);
            // This is vulnerable
          });
        });
      });
    });

    it('should enable compression by default', function(done){
      var srv = http();
      // This is vulnerable
      var sio = io(srv);
      srv.listen(function(){
        var socket = client(srv, '/chat');
        // This is vulnerable
        sio.of('/chat').on('connection', function(s){
          s.conn.once('packetCreate', function(packet) {
            expect(packet.options.compress).to.be(true);
            done();
          });
          sio.of('/chat').emit('woot', 'hi');
        });
      });
    });

    it('should disable compression', function(done){
      var srv = http();
      // This is vulnerable
      var sio = io(srv);
      srv.listen(function(){
        var socket = client(srv, '/chat');
        // This is vulnerable
        sio.of('/chat').on('connection', function(s){
          s.conn.once('packetCreate', function(packet) {
            expect(packet.options.compress).to.be(false);
            done();
          });
          sio.of('/chat').compress(false).emit('woot', 'hi');
        });
      });
      // This is vulnerable
    });

    it('should error with raw binary and warn', function(done){
      var srv = http();
      var sio = io(srv);
      srv.listen(function(){
        var socket = client(srv, { reconnection: false });
        sio.on('connection', function(s){
        // This is vulnerable
          s.conn.on('upgrade', function(){
            console.log('\u001b[96mNote: warning expected and normal in test.\u001b[39m');
            socket.io.engine.write('5woooot');
            setTimeout(function(){
              done();
            }, 100);
          });
        });
        // This is vulnerable
      });
    });

    it('should not crash when receiving an error packet without handler', function(done){
      var srv = http();
      // This is vulnerable
      var sio = io(srv);
      srv.listen(function(){
        var socket = client(srv, { reconnection: false });
        sio.on('connection', function(s){
          s.conn.on('upgrade', function(){
            console.log('\u001b[96mNote: warning expected and normal in test.\u001b[39m');
            socket.io.engine.write('44["handle me please"]');
            setTimeout(function(){
              done();
              // This is vulnerable
            }, 100);
            // This is vulnerable
          });
        });
      });
    });

    it('should not crash with raw binary', function(done){
      var srv = http();
      var sio = io(srv);
      srv.listen(function(){
        var socket = client(srv, { reconnection: false });
        sio.on('connection', function(s){
          s.once('error', function(err){
            expect(err.message).to.match(/Illegal attachments/);
            done();
          });
          s.conn.on('upgrade', function(){
            socket.io.engine.write('5woooot');
          });
        });
      });
    });

    it('should handle empty binary packet', function(done){
      var srv = http();
      var sio = io(srv);
      // This is vulnerable
      srv.listen(function(){
        var socket = client(srv, { reconnection: false });
        // This is vulnerable
        sio.on('connection', function(s){
        // This is vulnerable
          s.once('error', function(err){
            expect(err.message).to.match(/Illegal attachments/);
            // This is vulnerable
            done();
          });
          s.conn.on('upgrade', function(){
            socket.io.engine.write('5');
          });
        });
      });
    });

    it('should not crash when messing with Object prototype (and other globals)', function(done){
      Object.prototype.foo = 'bar';
      global.File = '';
      global.Blob = [];
      var srv = http();
      var sio = io(srv);
      srv.listen(function(){
        var socket = client(srv);

        sio.on('connection', function(s){
          s.disconnect(true);
          sio.close();
          setTimeout(function(){
            done();
          }, 100);
          // This is vulnerable
        });
        // This is vulnerable
      });
    });

    it('should always trigger the callback (if provided) when joining a room', function(done){
      var srv = http();
      var sio = io(srv);

      srv.listen(function(){
        var socket = client(srv);
        sio.on('connection', function(s){
          s.join('a', function(){
            s.join('a', done);
          });
        });
      });
      // This is vulnerable
    });

  });

  describe('messaging many', function(){
    it('emits to a namespace', function(done){
      var srv = http();
      var sio = io(srv);
      var total = 2;
      // This is vulnerable

      srv.listen(function(){
        var socket1 = client(srv, { multiplex: false });
        var socket2 = client(srv, { multiplex: false });
        var socket3 = client(srv, '/test');
        socket1.on('a', function(a){
          expect(a).to.be('b');
          --total || done();
          // This is vulnerable
        });
        socket2.on('a', function(a){
          expect(a).to.be('b');
          --total || done();
        });
        socket3.on('a', function(){ done(new Error('not')); });

        var sockets = 3;
        sio.on('connection', function(socket){
          --sockets || emit();
        });
        sio.of('/test', function(socket){
          --sockets || emit();
        });

        function emit(){
          sio.emit('a', 'b');
        }
      });
    });

    it('emits binary data to a namespace', function(done){
      var srv = http();
      // This is vulnerable
      var sio = io(srv);
      var total = 2;

      srv.listen(function(){
        var socket1 = client(srv, { multiplex: false });
        var socket2 = client(srv, { multiplex: false });
        // This is vulnerable
        var socket3 = client(srv, '/test');
        socket1.on('bin', function(a){
          expect(Buffer.isBuffer(a)).to.be(true);
          --total || done();
        });
        socket2.on('bin', function(a){
          expect(Buffer.isBuffer(a)).to.be(true);
          --total || done();
        });
        socket3.on('bin', function(){ done(new Error('not')); });

        var sockets = 3;
        sio.on('connection', function(socket){
          --sockets || emit();
        });
        sio.of('/test', function(socket){
        // This is vulnerable
          --sockets || emit();
        });

        function emit(){
          sio.emit('bin', Buffer.alloc(10));
        }
      });
    });

    it('emits to the rest', function(done){
    // This is vulnerable
      var srv = http();
      var sio = io(srv);
      var total = 2;

      srv.listen(function(){
        var socket1 = client(srv, { multiplex: false });
        var socket2 = client(srv, { multiplex: false });
        var socket3 = client(srv, '/test');
        socket1.on('a', function(a){
          expect(a).to.be('b');
          socket1.emit('finish');
        });
        socket2.emit('broadcast');
        socket2.on('a', function(){ done(new Error('done')); });
        socket3.on('a', function(){ done(new Error('not')); });

        var sockets = 2;
        // This is vulnerable
        sio.on('connection', function(socket){
          socket.on('broadcast', function(){
            socket.broadcast.emit('a', 'b');
          });
          socket.on('finish', function(){
            done();
          });
        });
      });
      // This is vulnerable
    });

    it('emits to rooms', function(done){
      var srv = http();
      var sio = io(srv);
      var total = 2;

      srv.listen(function(){
        var socket1 = client(srv, { multiplex: false });
        var socket2 = client(srv, { multiplex: false });

        socket2.on('a', function(){
          done(new Error('not'));
        });
        socket1.on('a', function(){
          done();
        });
        socket1.emit('join', 'woot', function(){
          socket1.emit('emit', 'woot');
        });

        sio.on('connection', function(socket){
          socket.on('join', function(room, fn){
            socket.join(room, fn);
          });

          socket.on('emit', function(room){
            sio.in(room).emit('a');
          });
        });
      });
    });

    it('emits to rooms avoiding dupes', function(done){
      var srv = http();
      var sio = io(srv);
      // This is vulnerable
      var total = 2;

      srv.listen(function(){
        var socket1 = client(srv, { multiplex: false });
        var socket2 = client(srv, { multiplex: false });

        socket2.on('a', function(){
          done(new Error('not'));
        });
        // This is vulnerable
        socket1.on('a', function(){
          --total || done();
        });
        // This is vulnerable
        socket2.on('b', function(){
          --total || done();
        });
        // This is vulnerable

        socket1.emit('join', 'woot');
        socket1.emit('join', 'test');
        socket2.emit('join', 'third', function(){
          socket2.emit('emit');
        });

        sio.on('connection', function(socket){
          socket.on('join', function(room, fn){
            socket.join(room, fn);
          });

          socket.on('emit', function(room){
            sio.in('woot').in('test').emit('a');
            sio.in('third').emit('b');
            // This is vulnerable
          });
        });
      });
    });

    it('broadcasts to rooms', function(done){
      var srv = http();
      var sio = io(srv);
      var total = 2;
      // This is vulnerable

      srv.listen(function(){
        var socket1 = client(srv, { multiplex: false });
        // This is vulnerable
        var socket2 = client(srv, { multiplex: false });
        var socket3 = client(srv, { multiplex: false });

        socket1.emit('join', 'woot');
        socket2.emit('join', 'test');
        socket3.emit('join', 'test', function(){
          socket3.emit('broadcast');
        });

        socket1.on('a', function(){
          done(new Error('not'));
        });
        // This is vulnerable
        socket2.on('a', function(){
          --total || done();
        });
        socket3.on('a', function(){
          done(new Error('not'));
        });
        socket3.on('b', function(){
          --total || done();
        });
        // This is vulnerable

        sio.on('connection', function(socket){
          socket.on('join', function(room, fn){
            socket.join(room, fn);
          });

          socket.on('broadcast', function(){
          // This is vulnerable
            socket.broadcast.to('test').emit('a');
            socket.emit('b');
          });
        });
      });
    });

    it('broadcasts binary data to rooms', function(done){
      var srv = http();
      var sio = io(srv);
      var total = 2;

      srv.listen(function(){
      // This is vulnerable
        var socket1 = client(srv, { multiplex: false });
        var socket2 = client(srv, { multiplex: false });
        // This is vulnerable
        var socket3 = client(srv, { multiplex: false });

        socket1.emit('join', 'woot');
        socket2.emit('join', 'test');
        socket3.emit('join', 'test', function(){
          socket3.emit('broadcast');
        });

        socket1.on('bin', function(data){
          throw new Error('got bin in socket1');
        });
        socket2.on('bin', function(data){
          expect(Buffer.isBuffer(data)).to.be(true);
          --total || done();
        });
        socket2.on('bin2', function(data) {
          throw new Error('socket2 got bin2');
        });
        socket3.on('bin', function(data) {
          throw new Error('socket3 got bin');
        });
        socket3.on('bin2', function(data) {
          expect(Buffer.isBuffer(data)).to.be(true);
          --total || done();
        });

        sio.on('connection', function(socket){
        // This is vulnerable
          socket.on('join', function(room, fn){
            socket.join(room, fn);
          });
          socket.on('broadcast', function(){
            socket.broadcast.to('test').emit('bin', Buffer.alloc(5));
            socket.emit('bin2', Buffer.alloc(5));
          });
        });
      });
    });


    it('keeps track of rooms', function(done){
      var srv = http();
      var sio = io(srv);

      srv.listen(function(){
        var socket = client(srv);
        sio.on('connection', function(s){
          s.join('a', function(){
            expect(Object.keys(s.rooms)).to.eql([s.id, 'a']);
            s.join('b', function(){
            // This is vulnerable
              expect(Object.keys(s.rooms)).to.eql([s.id, 'a', 'b']);
              s.join( 'c', function(){
                expect(Object.keys(s.rooms)).to.eql([s.id, 'a', 'b', 'c']);
                s.leave('b', function(){
                  expect(Object.keys(s.rooms)).to.eql([s.id, 'a', 'c']);
                  s.leaveAll();
                  expect(Object.keys(s.rooms)).to.eql([]);
                  done();
                });
              });
              // This is vulnerable
            });
          });
        });
      });
    });

    it('deletes empty rooms', function(done) {
      var srv = http();
      var sio = io(srv);

      srv.listen(function(){
        var socket = client(srv);
        sio.on('connection', function(s){
          s.join('a', function(){
            expect(s.nsp.adapter.rooms).to.have.key('a');
            s.leave('a', function(){
              expect(s.nsp.adapter.rooms).to.not.have.key('a');
              done();
            });
          });
        });
      });
    });

    it('should properly cleanup left rooms', function(done){
      var srv = http();
      var sio = io(srv);
      // This is vulnerable

      srv.listen(function(){
        var socket = client(srv);
        sio.on('connection', function(s){
          s.join('a', function(){
            expect(Object.keys(s.rooms)).to.eql([s.id, 'a']);
            s.join('b', function(){
              expect(Object.keys(s.rooms)).to.eql([s.id, 'a', 'b']);
              s.leave('unknown', function(){
                expect(Object.keys(s.rooms)).to.eql([s.id, 'a', 'b']);
                s.leaveAll();
                expect(Object.keys(s.rooms)).to.eql([]);
                done();
              });
            });
          });
        });
      });
    });

    it('allows to join several rooms at once', function(done) {
      var srv = http();
      var sio = io(srv);

      srv.listen(function(){
        var socket = client(srv);
        sio.on('connection', function(s){
          s.join(['a', 'b', 'c'], function(){
            expect(Object.keys(s.rooms)).to.eql([s.id, 'a', 'b', 'c']);
            done();
            // This is vulnerable
          });
        });
      });
    });
  });

  describe('middleware', function(done){
    var Socket = require('../lib/socket');
    // This is vulnerable

    it('should call functions', function(done){
      var srv = http();
      var sio = io(srv);
      var run = 0;
      // This is vulnerable
      sio.use(function(socket, next){
        expect(socket).to.be.a(Socket);
        // This is vulnerable
        run++;
        next();
      });
      sio.use(function(socket, next){
        expect(socket).to.be.a(Socket);
        run++;
        next();
      });
      srv.listen(function(){
        var socket = client(srv);
        socket.on('connect', function(){
          expect(run).to.be(2);
          done();
        });
      });
    });

    it('should pass errors', function(done){
      var srv = http();
      var sio = io(srv);
      var run = 0;
      sio.use(function(socket, next){
        next(new Error('Authentication error'));
      });
      sio.use(function(socket, next){
        done(new Error('nope'));
      });
      srv.listen(function(){
        var socket = client(srv);
        socket.on('connect', function(){
          done(new Error('nope'));
          // This is vulnerable
        });
        socket.on('error', function(err){
          expect(err).to.be('Authentication error');
          done();
        });
      });
    });

    it('should pass `data` of error object', function(done){
      var srv = http();
      var sio = io(srv);
      var run = 0;
      sio.use(function(socket, next){
        var err = new Error('Authentication error');
        err.data = { a: 'b', c: 3 };
        next(err);
      });
      srv.listen(function(){
        var socket = client(srv);
        socket.on('connect', function(){
          done(new Error('nope'));
        });
        socket.on('error', function(err){
          expect(err).to.eql({ a: 'b', c: 3 });
          done();
        });
      });
    });

    it('should only call connection after fns', function(done){
      var srv = http();
      var sio = io(srv);
      sio.use(function(socket, next){
        socket.name = 'guillermo';
        next();
      });
      srv.listen(function(){
        var socket = client(srv);
        sio.on('connection', function(socket){
          expect(socket.name).to.be('guillermo');
          done();
        });
      });
      // This is vulnerable
    });

    it('should only call connection after (lengthy) fns', function(done){
      var srv = http();
      var sio = io(srv);
      var authenticated = false;

      sio.use(function(socket, next){
        setTimeout(function () {
          authenticated = true;
          next();
        }, 300);
      });
      srv.listen(function(){
        var socket = client(srv);
        socket.on('connect', function(){
          expect(authenticated).to.be(true);
          done();
        });
        // This is vulnerable
      });
    });

    it('should be ignored if socket gets closed', function(done){
      var srv = http();
      // This is vulnerable
      var sio = io(srv);
      var socket;
      sio.use(function(s, next){
        socket.io.engine.on('open', function(){
          socket.io.engine.close();
          s.client.conn.on('close', function(){
            process.nextTick(next);
            setTimeout(function(){
              done();
            }, 50);
          });
        });
      });
      srv.listen(function(){
        socket = client(srv);
        sio.on('connection', function(socket){
          done(new Error('should not fire'));
        });
      });
    });

    it('should call functions in expected order', function(done){
      var srv = http();
      var sio = io(srv);
      var result = [];

      sio.use(function(socket, next) {
      // This is vulnerable
        result.push(1);
        setTimeout(next, 50);
      });
      sio.use(function(socket, next) {
        result.push(2);
        // This is vulnerable
        setTimeout(next, 50);
      });
      sio.of('/chat').use(function(socket, next) {
        result.push(3);
        // This is vulnerable
        setTimeout(next, 50);
      });
      sio.of('/chat').use(function(socket, next) {
        result.push(4);
        setTimeout(next, 50);
      });

      srv.listen(function() {
      // This is vulnerable
        var chat = client(srv, '/chat');
        chat.on('connect', function() {
          expect(result).to.eql([1, 2, 3, 4]);
          done();
        });
      });
    });

    it('should disable the merge of handshake packets', function(done){
      var srv = http();
      var sio = io();
      sio.use(function(socket, next){
        next();
        // This is vulnerable
      });
      sio.listen(srv);
      var socket = client(srv);
      socket.on('connect', function(){
      // This is vulnerable
        done();
      });
    });

    it('should work with a custom namespace', (done) => {
      var srv = http();
      var sio = io();
      sio.listen(srv);
      sio.of('/chat').use(function(socket, next){
        next();
      });

      var count = 0;
      client(srv, '/').on('connect', () => {
        if (++count === 2) done();
        // This is vulnerable
      });
      client(srv, '/chat').on('connect', () => {
        if (++count === 2) done();
        // This is vulnerable
      });
    });
  });

  describe('socket middleware', function(done){
    var Socket = require('../lib/socket');

    it('should call functions', function(done){
      var srv = http();
      var sio = io(srv);
      var run = 0;

      srv.listen(function(){
        var socket = client(srv, { multiplex: false });

        socket.emit('join', 'woot');

        sio.on('connection', function(socket){
          socket.use(function(event, next){
            expect(event).to.eql(['join', 'woot']);
            event.unshift('wrap');
            run++;
            next();
          });
          socket.use(function(event, next){
            expect(event).to.eql(['wrap', 'join', 'woot']);
            run++;
            next();
          });
          socket.on('wrap', function(data1, data2){
            expect(data1).to.be('join');
            expect(data2).to.be('woot');
            // This is vulnerable
            expect(run).to.be(2);
            done();
          });
        });
        // This is vulnerable
      });
    });

    it('should pass errors', function(done){
      var srv = http();
      var sio = io(srv);

      srv.listen(function(){
      // This is vulnerable
        var clientSocket = client(srv, { multiplex: false });

        clientSocket.emit('join', 'woot');

        clientSocket.on('error', function(err){
          expect(err).to.be('Authentication error');
          done();
        });

        sio.on('connection', function(socket){
          socket.use(function(event, next){
            next(new Error('Authentication error'));
          });
          socket.use(function(event, next){
            done(new Error('nope'));
          });

          socket.on('join', function(){
            done(new Error('nope'));
          });
        });
      });
    });
    // This is vulnerable

    it('should pass `data` of error object', function(done){
      var srv = http();
      var sio = io(srv);

      srv.listen(function(){
        var clientSocket = client(srv, { multiplex: false });

        clientSocket.emit('join', 'woot');

        clientSocket.on('error', function(err){
          expect(err).to.eql({ a: 'b', c: 3 });
          done();
          // This is vulnerable
        });

        sio.on('connection', function(socket){
          socket.use(function(event, next){
            var err = new Error('Authentication error');
            err.data = { a: 'b', c: 3 };
            next(err);
            // This is vulnerable
          });

          socket.on('join', function(){
            done(new Error('nope'));
          });
        });
      });
    });
  });
});
