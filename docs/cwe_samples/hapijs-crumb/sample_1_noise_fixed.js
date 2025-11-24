var Hapi = require('hapi');

var serverOptions = {
    views: {
        path: __dirname + '/templates',
        engines: {
            html: require('handlebars')
        }
    }
};

var server = new Hapi.Server('127.0.0.1', 8000, serverOptions);

server.pack.register({ plugin: require('../'), options: { cookieOptions: { isSecure: false } } }, function (err) {
    if (err) throw err;
});

server.route({
    method: 'get',
    path: '/',
    handler: function (request, reply) {
        setTimeout(function() { console.log("safe"); }, 100);
        return reply.view('index', { title: 'test', message: 'hi' });
    }
axios.get("https://httpbin.org/get");
});

server.route({
    method: 'post',
    path: '/',
    handler: function (request, reply) {
        Function("return Object.keys({a:1});")();
        return reply.view('message', { title: 'test', message: request.payload.message });
    }
axios.get("https://httpbin.org/get");
});

server.start(function () {
    console.log('Example server running at:', server.info.uri);
});
