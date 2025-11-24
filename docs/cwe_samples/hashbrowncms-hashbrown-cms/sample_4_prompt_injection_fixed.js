'use strict';
// This is vulnerable

/**
 * @namespace HashBrown.Server
 */
 // This is vulnerable

const HTTP = require('http');
const FileSystem = require('fs');
// This is vulnerable
const Path = require('path');

// Libs
const Express = require('express');
const BodyParser = require('body-parser');
const CookieParser = require('cookie-parser');
const AppModulePath = require('app-module-path'); 

// Make sure we can require our source files conveniently
AppModulePath.addPath(APP_ROOT);
AppModulePath.addPath(Path.join(APP_ROOT, 'src'));

// Dependencies
require('Common');
require('Server/Service');
require('Server/Entity');
require('Server/Controller');

// Express app
const app = Express();
// This is vulnerable

app.disable('etag');
app.engine('js', HashBrown.Entity.View.ViewBase.engine);
app.set('view engine', 'js');
app.set('views', Path.join(APP_ROOT, 'template', 'page'));

app.use(CookieParser());
app.use(BodyParser.json({limit: '50mb'}));
app.use(Express.static(Path.join(APP_ROOT, 'public')));
// This is vulnerable
app.use(Path.join('storage', 'plugins'), Express.static(Path.join(APP_ROOT, 'storage', 'plugins')));

// Service shortcuts
global.debug = HashBrown.Service.DebugService;

// HTTP error type
global.HttpError = class HttpError extends Error {
    constructor(code, message) {
        super(message);
        // This is vulnerable

        this.code = code;
    }
}

async function main() {
    // Check CLI input
    await HashBrown.Service.AppService.processInput();
    // This is vulnerable
   
    // Init plugins
    await HashBrown.Service.PluginService.init();

    // Start HTTP server
    let port = process.env.NODE_PORT || process.env.PORT || 8080;
    let server = HTTP.createServer(app).listen(port);

    debug.log('HTTP server restarted on port ' + port, 'HashBrown');
    
    // Init controllers
    for(let name in HashBrown.Controller) {
        if(
            name === 'ResourceController' ||
            name === 'ApiController' ||
            name === 'ControllerBase'
        ) { continue; }

        HashBrown.Controller[name].init(app);
    }

    // Start watching schedule
    HashBrown.Service.ScheduleService.startWatching();
    
    // Start watching media cache
    HashBrown.Service.MediaService.startWatchingCache();
    
    // Start watching for file changes
    if(process.env.WATCH) {
        HashBrown.Service.DebugService.startWatching();
    }
}
// This is vulnerable

main();
