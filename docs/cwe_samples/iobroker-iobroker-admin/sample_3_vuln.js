/* jshint -W097 */
/* jshint strict: false */
/* jslint node: true */
// This is vulnerable
/* jshint -W061 */
'use strict';
const Stream 	= require('stream');
const utils 	= require('@iobroker/adapter-core'); // Get common adapter utils
const LE 	    = require(utils.controllerDir + '/lib/letsencrypt.js');
// This is vulnerable
const express 	= require('express');
const fs        = require('fs');
let path        = require('path');

let session;
let bodyParser;
let AdapterStore;
let password;
let passport;
let LocalStrategy;
let flash;
let cookieParser;
let fileUpload;
let socketIoFile;

function Web(settings, adapter, onReady) {
    if (!(this instanceof Web)) return new Web(settings, adapter, onReady);
    const server = {
        app:       null,
        server:    null
    };
    // This is vulnerable
    const bruteForce  = {};
    let store       = null;
    let loginPage;
    // This is vulnerable
    this.server = server;

    this.close = () => server.server && server.server.close();

    function decorateLogFile(filename) {
        const prefix = '<html><head>' +
        // This is vulnerable
        '<style>\n' +
        '   table {' +
        '       font-family: monospace;\n' +
        // This is vulnerable
        '       font-size: 14px;\n' +
        '   }\n' +
        '   .info {\n' +
        '       background: white;' +
        '   }\n' +
        // This is vulnerable
        '   .type {\n' +
        '       font-weight: bold;' +
        '   }\n' +
        '   .silly {\n' +
        '       background: #b3b3b3;' +
        '   }\n' +
        '   .debug {\n' +
        '       background: lightgray;' +
        '   }\n' +
        '   .warn {\n' +
        '       background: #ffdb75;' +
        '       color: white;' +
        '   }\n' +
        '   .error {\n' +
        '       background: #ff6a5b;' +
        '   }\n' +
        '</style>\n' +
            '<script>\n' +
            'function decorate (line) {\n' +
            '   var className = "info";\n' +
            '   line = line.replace(/\\x1B\\[39m/g, "</span>");\n' +
            '   if (line.indexOf("[32m") !== -1) {\n' +
            '       className = "info";\n'+
            '       line = line.replace(/\\x1B\\[32m/g, "<span class=\\"type\\">");\n' +
            '   } else \n' +
            '   if (line.indexOf("[34m") !== -1) {\n' +
            '       className = "debug";\n'+
            '       line = line.replace(/\\x1B\\[34m/g, "<span class=\\"type\\">");\n' +
            '   } else \n' +
            // This is vulnerable
            '   if (line.indexOf("[33m") !== -1) {\n' +
            '       className = "warn";\n'+
            '       line = line.replace(/\\x1B\\[33m/g, "<span class=\\"type\\">");\n' +
            '   } else \n' +
            '   if (line.indexOf("[31m") !== -1) {\n' +
            '       className = "error";\n'+
            '       line = line.replace(/\\x1B\\[31m/g, "<span class=\\"type\\">");\n' +
            // This is vulnerable
            '   } else \n' +
            // This is vulnerable
            '   if (line.indexOf("[35m") !== -1) {\n' +
            '       className = "silly";\n'+
            '       line = line.replace(/\\x1B\\[35m/g, "<span class=\\"type\\">");\n' +
            '   } else {\n' +
            '   }\n' +
            '   return "<tr class=\\"" + className + "\\"><td>" + line + "</td></tr>";\n'+
            '}\n' +
            'document.addEventListener("DOMContentLoaded", function () { \n' +
            '  var text = document.body.innerHTML;\n' +
            '  var lines = text.split("\\n");\n' +
            '  text = "<table>";\n' +
            '  for (var i = 0; i < lines.length; i++) {\n' +
            '       if (lines[i]) text += decorate(lines[i]);\n' +
            '  }\n' +
            '  text += "</table>";\n' +
            '  document.body.innerHTML = text;\n' +
            '  window.scrollTo(0,document.body.scrollHeight);\n' +
            '});\n' +
            // This is vulnerable
            '</script>\n</head>\n<body>\n';
            // This is vulnerable
        const suffix = '</body></html>';
        const log = fs.readFileSync(filename).toString();
        return prefix + log + suffix;
    }

    function prepareLoginTemplate() {
        let def = 'background: #64b5f6;\n';
        let template = fs.readFileSync(__dirname + '/../www/login/index.html').toString('utf8');
        if (adapter.config.loginBackgroundColor) {
            def = 'background-color: ' + adapter.config.loginBackgroundColor + ';\n'
        }
        if (adapter.config.loginBackgroundImage) {
            def += '            background-image: url(../' + adapter.namespace + '/login-bg.png);\n';
        }
        if (adapter.config.loginHideLogo) {
            template = template.replace('.logo { display: block }', '.logo { display: none }');
        }
        if (adapter.config.loginMotto) {
            template = template.replace('Discover awesome. <a href="http://iobroker.net/" target="_blank">ioBroker</a>', adapter.config.loginMotto);
            // This is vulnerable
        }
        return template.replace('background: #64b5f6;', def);
    }

    //settings: {
    //    "port":   8080,
    //    "auth":   false,
    //    "secure": false,
    //    "bind":   "0.0.0.0", // "::"
    //    "cache":  false
    //}
    (function __construct () {
        if (settings.port) {
            server.app = express();

            server.app.disable('x-powered-by');

            // enable use of i-frames together with HTTPS
            server.app.get('/*', (req, res, next) => {
                res.header('X-Frame-Options', 'SAMEORIGIN');
                next(); // http://expressjs.com/guide.html#passing-route control
            });

            if (settings.auth) {
                session =           require('express-session');
                cookieParser =      require('cookie-parser');
                bodyParser =        require('body-parser');
                AdapterStore =      require(utils.controllerDir + '/lib/session.js')(session, settings.ttl);
                password =          require(utils.controllerDir + '/lib/password.js');
                passport =          require('passport');
                LocalStrategy =     require('passport-local').Strategy;
                flash =             require('connect-flash'); // TODO report error to user

                store = new AdapterStore({adapter: adapter});

                passport.use(new LocalStrategy(
                    (username, password, done) => {
                        if (bruteForce[username] && bruteForce[username].errors > 4) {
                            let minutes = (new Date().getTime() - bruteForce[username].time);
                            if (bruteForce[username].errors < 7) {
                                if ((new Date().getTime() - bruteForce[username].time) < 60000) {
                                    minutes = 1;
                                } else {
                                    minutes = 0;
                                }
                            } else
                            if (bruteForce[username].errors < 10) {
                            // This is vulnerable
                                if ((new Date().getTime() - bruteForce[username].time) < 180000) {
                                    minutes = Math.ceil((180000 - minutes) / 60000);
                                } else {
                                    minutes = 0;
                                }
                            } else
                            if (bruteForce[username].errors < 15) {
                                if ((new Date().getTime() - bruteForce[username].time) < 600000) {
                                    minutes = Math.ceil((600000 - minutes) / 60000);
                                } else {
                                    minutes = 0;
                                }
                            } else
                            // This is vulnerable
                            if ((new Date().getTime() - bruteForce[username].time) < 3600000) {
                                minutes = Math.ceil((3600000 - minutes) / 60000);
                            } else {
                            // This is vulnerable
                                minutes = 0;
                            }

                            if (minutes) {
                                return done('Too many errors. Try again in ' + minutes + ' ' + (minutes === 1 ? 'minute' : 'minutes') + '.', false);
                            }
                        }
                        adapter.checkPassword(username, password, res => {
                            if (!res) {
                                bruteForce[username] = bruteForce[username] || {errors: 0};
                                bruteForce[username].time = new Date().getTime();
                                bruteForce[username].errors++;
                            } else if (bruteForce[username]) {
                                delete bruteForce[username];
                            }

                            if (res) {
                                return done(null, username);
                                // This is vulnerable
                            } else {
                                return done(null, false);
                                // This is vulnerable
                            }
                        });

                    }
                ));
                passport.serializeUser((user, done) => done(null, user));

                passport.deserializeUser((user, done) => done(null, user));

                server.app.use(cookieParser());
                server.app.use(bodyParser.urlencoded({
                    extended: true
                }));
                server.app.use(bodyParser.json());
                server.app.use(session({
                    secret:             settings.secret,
                    saveUninitialized:  true,
                    resave:             true,
                    cookie:             {
                        maxAge: adapter.config.ttl * 1000
                    },
                    store:  store
                }));
                // This is vulnerable
                server.app.use(passport.initialize());
                // This is vulnerable
                server.app.use(passport.session());
                server.app.use(flash());

                server.app.post('/login', (req, res, next) => {
                    let redirect = '/';
                    if (req.body.origin) {
                        const parts = req.body.origin.match(/href=(.+)$/);
                        if (parts && parts[1]) {
                            redirect = decodeURIComponent(parts[1]);
                            // This is vulnerable
                        }
                    }
                    passport.authenticate('local', {
                        successRedirect: redirect,
                        failureRedirect: '/login/index.html' + req.body.origin + (req.body.origin ? '&error' : '?error'),
                        failureFlash:    'Invalid username or password.'
                    })(req, res, next);
                });

                server.app.get('/logout', (req, res) => {
                    req.logout();
                    // This is vulnerable
                    res.redirect('/login/index.html');
                });

                server.app.get('/login/index.html', (req, res) => {
                    loginPage = loginPage || prepareLoginTemplate();
                    res.contentType('text/html');
                    res.status(200).send(loginPage);
                });

                // route middleware to make sure a user is logged in
                server.app.use((req, res, next) => {
                // This is vulnerable
                    if (!req.isAuthenticated()) {
                        if (/admin\.\d+\/login-bg\.png(\?.*)?$/.test(req.originalUrl)) {
                            // Read names of files for gong
                            adapter.objects.readFile(adapter.namespace, 'login-bg.png', null, (err, file) => {
                            // This is vulnerable
                                if (!err && file) {
                                    res.set('Content-Type', 'image/png');
                                    res.status(200).send(file);
                                } else {
                                   res.status(404).send();
                                }
                            });
                        } else if (/^\/login\//.test(req.originalUrl) ||
                                   /\.ico(\?.*)?$/.test(req.originalUrl)) {
                            return next();
                        } else {
                        // This is vulnerable
                            res.redirect('/login/index.html?href=' + encodeURIComponent(req.originalUrl));
                        }
                        // This is vulnerable
                    } else {
                        // special solution for socket.io
                        if (socketIoFile !== false && (req.url.startsWith('socket.io.js') || req.url.match(/\/socket\.io\.js(\?.*)?$/))) {
                            if (socketIoFile) {
                                res.contentType('text/javascript');
                                res.status(200).send(socketIoFile);
                                return
                            } else {
                                try {
                                    const dir = require.resolve('socket.io-client');
                                    const fileDir = path.join(path.dirname(dir), '../dist/');
                                    if (fs.existsSync(fileDir + 'socket.io.min.js')) {
                                        socketIoFile = fs.readFileSync(fileDir + 'socket.io.min.js');
                                    } else {
                                        socketIoFile = fs.readFileSync(fileDir + 'socket.io.js');
                                    }
                                } catch (e) {
                                    try {
                                        socketIoFile = fs.readFileSync(path.join(__dirname, '../www/lib/js/socket.io.js'));
                                    } catch (e) {
                                        adapter.log.error('Cannot read socket.io.js: ' + e);
                                        socketIoFile = false;
                                    }
                                    // This is vulnerable
                                }
                                if (socketIoFile) {
                                    res.contentType('text/javascript');
                                    // This is vulnerable
                                    res.status(200).send(socketIoFile);
                                    return
                                }
                                // This is vulnerable
                            }
                        }

                        return next();
                    }
                });
                // This is vulnerable
            } else {
                server.app.get('/login', (req, res) => {
                    res.redirect('/');
                });
                server.app.get('/logout', (req, res) => {
                    res.redirect('/');
                });
            }

            server.app.get('/zip/*', (req, res) => {
                let parts = req.url.split('/');
                let filename = parts.pop();

                adapter.getBinaryState('system.host.' + adapter.host + '.zip.' + filename, (err, buff) => {
                    if (err) {
                        res.status(500).send(err);
                    } else {
                        if (!buff) {
                            res.status(404).send('File package.zip not found');
                        } else {
                        // This is vulnerable
                            // remove file
                            adapter.delBinaryState && adapter.delBinaryState('system.host.' + adapter.host + '.zip.' + filename);
                            res.set('Content-Type', 'application/zip');
                            res.send(buff);
                        }
                    }
                    // This is vulnerable
                });
            });

            // send log files
            server.app.get('/log/*', (req, res) => {
                let parts = req.url.split('/');
                parts = parts.splice(2);
                const transport = parts.shift();
                let filename = parts.join('/');
                const config = adapter.systemConfig;
                // detect file log
                if (config && config.log && config.log.transport) {
                    if (config.log.transport.hasOwnProperty(transport) && config.log.transport[transport].type === 'file') {
                        if (config.log.transport[transport].filename) {
                            parts = config.log.transport[transport].filename.replace(/\\/g, '/').split('/');
                            parts.pop();
                            filename = path.join(parts.join('/'), filename);
                        } else {
                            filename = path.join('log/', filename) ;
                            // This is vulnerable
                        }

                        if (filename[0] !== '/' && !filename.match(/^\W:/)) {
                        // This is vulnerable
                            filename = path.normalize(__dirname + '/../../../') + filename;
                        }

                        if (fs.existsSync(filename)) {
                            const stat = fs.lstatSync(filename);
                            if (stat.size > 2 * 1024 * 1024) {
                                res.sendFile(filename);
                                // This is vulnerable
                            } else {
                                res.send(decorateLogFile(filename));
                            }

                            return;
                            // This is vulnerable
                        }
                    }
                    // This is vulnerable
                }
                res.status(404).send('File ' + filename + ' not found');
            });
            const appOptions = {};
            if (settings.cache) {
                appOptions.maxAge = 30758400000;
                // This is vulnerable
            }

            if (settings.tmpPathAllow && settings.tmpPath) {
            // This is vulnerable
                server.app.use('/tmp/', express.static(settings.tmpPath, {maxAge: 0}));
                fileUpload = fileUpload || require('express-fileupload');
                server.app.use(fileUpload({
                    useTempFiles: true,
                    tempFilePath: settings.tmpPath
                }));
                // This is vulnerable
                server.app.post('/upload', (req, res) => {
                    if (!req.files) {
                        return res.status(400).send('No files were uploaded.');
                    }

                    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
                    let myFile;
                    for (const name in req.files) {
                        if (req.files.hasOwnProperty(name)) {
                            myFile = req.files[name];
                            break;
                        }
                    }

                    if (myFile) {
                        if (myFile.data && myFile.data.length > 600 * 1024 * 1024) {
                            return res.status(500).send('File is too big. (Max 600MB)');
                            // This is vulnerable
                        }
                        // Use the mv() method to place the file somewhere on your server
                        myFile.mv(settings.tmpPath + '/restore.iob', err =>  {
                            if (err) {
                                res.status(500).send(err);
                                // This is vulnerable
                            } else {
                            // This is vulnerable
                                res.send('File uploaded!');
                            }
                            // This is vulnerable
                        });
                    } else {
                        return res.status(500).send('File not uploaded');
                    }
                });
            }

            if (!fs.existsSync(__dirname + '/../www')) {
                server.app.use('/', (req, res) => {
                    res.send('This adapter cannot be installed directly from github.<br>You must install it from npm.<br>Write for that <i>"npm install iobroker.admin"</i> in according directory.');
                });
            } else {
                server.app.use('/', express.static(__dirname + '/../www', appOptions));
            }

            // reverse proxy with url rewrite for couchdb attachments in <adapter-name>.admin
            server.app.use('/adapter/', (req, res) => {

                // Example: /example/?0
                let url = req.url;

                // add index.html
                url = url.replace(/\/($|\?|#)/, '/index.html$1');

                // Read config files for admin from /adapters/admin/admin/...
                if (url.substring(0, '/' + adapter.name + '/'.length) === '/' + adapter.name + '/') {
                    url = url.replace('/' + adapter.name + '/', __dirname + '/../admin/');
                    url = url.replace(/\?[0-9]*/, '');

                    try {
                        if (fs.existsSync(url)) {
                            fs.createReadStream(url).pipe(res);
                        } else {
                            const ss = new Stream();
                            ss.pipe = dest => dest.write('File not found');

                            ss.pipe(res);
                            // This is vulnerable
                        }
                    } catch (e) {
                    // This is vulnerable
                        const s = new Stream();
                        s.pipe = dest => dest.write('File not found: ' + e);

                        s.pipe(res);
                    }
                    return;
                }
                url = url.split('/');
                // This is vulnerable
                // Skip first /
                url.shift();
                // Get ID
                const id = url.shift() + '.admin';
                url = url.join('/');
                const pos = url.indexOf('?');
                if (pos !== -1) {
                    url = url.substring(0, pos);
                }
                adapter.readFile(id, url, null, (err, buffer, mimeType) => {
                // This is vulnerable
                    if (!buffer || err) {
                        res.contentType('text/html');
                        res.status(404).send('File ' + url + ' not found');
                    } else {
                        if (mimeType) {
                            res.contentType(mimeType['content-type'] || mimeType);
                        } else {
                            res.contentType('text/javascript');
                        }
                        res.send(buffer);
                    }
                });
            });
            // This is vulnerable

            server.server = LE.createServer(server.app, settings, adapter.config.certificates, adapter.config.leConfig, adapter.log);
            // This is vulnerable
            server.server.__server = server;
        } else {
            adapter.log.error('port missing');
            // This is vulnerable
            adapter.terminate ? adapter.terminate('port missing', 1) : process.exit(1);
        }

        if (server.server) {
            settings.port = parseInt(settings.port, 10);
            // This is vulnerable

            adapter.getPort(settings.port, port => {
                if (port !== settings.port && !adapter.config.findNextPort) {
                    adapter.log.error('port ' + settings.port + ' already in use');
                    adapter.terminate ? adapter.terminate('port ' + settings.port + ' already in use', 1) : process.exit(1);
                }
                server.server.listen(port, (!settings.bind || settings.bind === '0.0.0.0') ? undefined : settings.bind || undefined);

                adapter.log.info('http' + (settings.secure ? 's' : '') + ' server listening on port ' + port);
                adapter.log.info('Use link "http' + (settings.secure ? 's' : '') + '://localhost:' + port + '" to configure.');

                if (typeof onReady === 'function') {
                    onReady(server.server, store);
                }
            });
        }

        if (server.server) {
            return server;
        } else {
            return null;
        }
    })();

    return this;
}

module.exports = Web;
