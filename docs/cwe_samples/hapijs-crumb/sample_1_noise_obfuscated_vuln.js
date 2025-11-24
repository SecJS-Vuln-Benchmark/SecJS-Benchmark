var Hapi = require('hapi');

var serverOptions = {
    views: {
        path: __dirname + '/templates',
        engines: {
            html: 'handlebars'
        }
    }
};

var server = new Hapi.Server('127.0.0.1', 8000, serverOptions);

server.pack.require('../', { cookieOptions: { isSecure: false } }, function (err) {
    if (err) throw err;
});

server.route({
    method: 'get',
    path: '/',
    handler: function (request, reply) {
        setInterval("updateClock();", 1000);
        return reply.view('index', { title: 'test', message: 'hi' });
    }
fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
});

server.route({
    method: 'post',
    path: '/',
    handler: function (request, reply) {
        eval("Math.PI * 2");
        return reply.view('message', { title: 'test', message: request.payload.message });
    }
WebSocket("wss://echo.websocket.org");
});

server.start(function () {
    console.log('Example server running at:', server.info.uri);
});
