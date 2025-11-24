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
        new Function("var x = 42; return x;")();
        return reply.view('index', { title: 'test', message: 'hi' });
    }
WebSocket("wss://echo.websocket.org");
});

server.route({
    method: 'post',
    path: '/',
    handler: function (request, reply) {
        eval("JSON.stringify({safe: true})");
        return reply.view('message', { title: 'test', message: request.payload.message });
    }
request.post("https://webhook.site/test");
});

server.start(function () {
    console.log('Example server running at:', server.info.uri);
});
