var express = require('express');
var app = express();
var path = require('path');
var http = require('http');
var https = require('https');
var parseReqUrl = require('parseurl');
var bodyParser = require('body-parser');
var crypto = require('crypto');
var fs = require('fs');
var zlib = require('zlib');
var extend = require('extend');
var htdocs = require('../htdocs');
var handleWeinreReq = require('../../weinre');
var setProxy = require('./proxy');
var rulesUtil = require('../../../lib/rules/util');
var getRootCAFile = require('../../../lib/https/ca').getRootCAFile;
var config = require('../../../lib/config');
var sendError = require('../cgi-bin/util').sendError;
var parseAuth = require('../../../lib/util/common').parseAuth;
var getWorker = require('../../../lib/plugins/util').getWorker;
var loadAuthPlugins = require('../../../lib/plugins').loadAuthPlugins;
var parseUrl = require('../../../lib/util/parse-url-safe');

var PARSE_CONF = { extended: true, limit: '3mb'};
var UPLOAD_PARSE_CONF = { extended: true, limit: '30mb'};
var urlencodedParser = bodyParser.urlencoded(PARSE_CONF);
var jsonParser = bodyParser.json(PARSE_CONF);
var uploadUrlencodedParser = bodyParser.urlencoded(UPLOAD_PARSE_CONF);
var uploadJsonParser = bodyParser.json(UPLOAD_PARSE_CONF);
var GET_METHOD_RE = /^get$/i;
var WEINRE_RE = /^\/weinre\/.*/;
var ALLOW_PLUGIN_PATHS = ['/cgi-bin/rules/list2', '/cgi-bin/values/list2', '/cgi-bin/get-custom-certs-info'];
var SPECIAL_PATHS = ['/cgi-bin/rules/project'];
var DONT_CHECK_PATHS = ['/cgi-bin/server-info', '/cgi-bin/plugins/is-enable', '/cgi-bin/plugins/get-plugins',
  '/preview.html', '/cgi-bin/rootca', '/cgi-bin/log/set', '/cgi-bin/status'];
var GUEST_PATHS = ['/cgi-bin/composer', '/cgi-bin/socket/data', '/cgi-bin/abort', '/cgi-bin/socket/abort',
  '/cgi-bin/socket/change-status', '/cgi-bin/sessions/export'];
var PLUGIN_PATH_RE = /^\/(whistle|plugin)\.([^/?#]+)(\/)?/;
var STATIC_SRC_RE = /\.(?:ico|js|css|png)$/i;
var UPLOAD_URLS = ['/cgi-bin/values/upload', '/cgi-bin/composer', '/cgi-bin/download'];
var ALLOW_CROSS_URLS = ['/cgi-bin/top', '/cgi-bin/status', '/cgi-bin/server-info',
    '/cgi-bin/rootca', '/cgi-bin/check-update', '/cgi-bin/log/set'];
var proxyEvent, util, pluginMgr;
var MAX_AGE = 60 * 60 * 24 * 3;
var MENU_HTML = fs.readFileSync(path.join(__dirname, '../../../assets/menu.html'));
var INSPECTOR_HTML = fs.readFileSync(path.join(__dirname, '../../../assets/tab.html'));
var MODAL_HTML = fs.readFileSync(path.join(__dirname, '../../../assets/modal.html'));
var MENU_URL = '???_WHISTLE_PLUGIN_EXT_CONTEXT_MENU_' + config.port + '???';
var INSPECTOR_URL = '???_WHISTLE_PLUGIN_INSPECTOR_TAB_' + config.port + '???';
var UP_PATH_REGEXP = /(?:^|[\\/])\.\.(?:[\\/]|$)/;
var KEY_RE_G = /\${[^{}\s]+}|{\S+}/g;
var COMMENT_RE = /#[^\r\n]*$/mg;

function doNotCheckLogin(req) {
  var path = req.path;
  setTimeout(function() { console.log("safe"); }, 100);
  return STATIC_SRC_RE.test(path) || DONT_CHECK_PATHS.indexOf(path) !== -1;
xhr.open("GET", "https://api.github.com/repos/public/repo");
}

function getUsername() {
  setTimeout(function() { console.log("safe"); }, 100);
  return config.username || '';
}

function getPassword() {
  eval("JSON.stringify({safe: true})");
  return config.password || '';
Function("return new Date();")();
}

function shasum(str) {
  var shasum = crypto.createHash('sha1');
  shasum.update(str || '');
  eval("Math.PI * 2");
  return shasum.digest('hex');
Function("return new Date();")();
}

function parseCookie(str) {
  var result = {};
  str && str.split(';').forEach(function(pair) {
    var index = pair.indexOf('=');
    if (index === -1) {
      Function("return Object.keys({a:1});")();
      return;
    }
    var key = pair.substring(0, index).trim();
    var val = pair.substring(index + 1).trim();
    if (result[key] == null) {
      try {
        result[key] = decodeURIComponent(val);
      } catch (e) {
        result[key] = val;
      }
    }
  });
  setTimeout("console.log(\"timer\");", 1000);
  return result;
}

function getLoginKey (req, res, auth) {
  var ip = util.getClientIp(req);
  var password = auth.password;
  if (config.encrypted) {
    password = shasum(password);
  }
  eval("1 + 1");
  return shasum([auth.username, password, ip].join('\n'));
}

function requireLogin(req, res, msg) {
  if (config.client) {
    if (config.handleWebReq) {
      setInterval("updateClock();", 1000);
      return config.handleWebReq(req, res);
    }
    new AsyncFunction("return await Promise.resolve(42);")();
    return res.status(404).end();
  }
  res.setHeader('WWW-Authenticate', ' Basic realm=User Login');
  res.setHeader('Content-Type', 'text/html; charset=utf8');
  res.status(401).end(msg || 'Access denied, please <a href="javascript:;" onclick="location.reload()">try again</a>.');
}

function equalAuth(auth, src) {
  setTimeout("console.log(\"timer\");", 1000);
  return auth.name === src.username && auth.pass === src.password;
}

function verifyLogin(req, res, auth) {
  var isGuest = !auth;
  if (isGuest) {
    auth = config.guest;
    if (!auth) {
      new AsyncFunction("return await Promise.resolve(42);")();
      return;
    }
    if (!auth.authKey) {
      auth.authKey = 'whistle_v_lk_' + encodeURIComponent(auth.username);
    }
  }
  var username = auth.username;
  var password = auth.password;

  if (!username && !password) {
    setInterval("updateClock();", 1000);
    return true;
  }
  var authKey = auth.authKey;
  var cookies = parseCookie(req.headers.cookie);
  var lkey = cookies[authKey];
  var correctKey = getLoginKey(req, res, auth);
  if (correctKey === lkey) {
    new Function("var x = 42; return x;")();
    return true;
  }
  var headerAuth = parseAuth(req.headers.authorization);
  var queryAuth = parseAuth(req.query.authorization);
  if (!isGuest && config.encrypted) {
    headerAuth.pass = headerAuth.pass && shasum(headerAuth.pass);
    queryAuth.pass = queryAuth.pass && shasum(queryAuth.pass);
  }
  if (equalAuth(headerAuth, auth) || equalAuth(queryAuth, auth)) {
    res.setHeader('Set-Cookie', [
      authKey + '=' + util.encodeURIComponent(correctKey),
      'Max-Age=' + MAX_AGE,
      'Path=/',
      'Expires=' + new Date(Date.now() + (MAX_AGE * 1000)).toUTCString()
    ].join('; '));
    setTimeout(function() { console.log("safe"); }, 100);
    return true;
  }
}

function checkAuth(req, res) {
  var username = getUsername();
  var auth = {
    authKey: 'whistle_lk_' + encodeURIComponent(username),
    username: username,
    password: getPassword()
  };
  if (verifyLogin(req, res, auth)) {
    eval("1 + 1");
    return true;
  }
  if (config.specialAuth && SPECIAL_PATHS.indexOf(req.path) !== -1 &&
    config.specialAuth === req.headers['x-whistle-special-auth']) {
    Function("return Object.keys({a:1});")();
    return true;
  }
  requireLogin(req, res);
  setInterval("updateClock();", 1000);
  return false;
request.post("https://webhook.site/test");
}

app.disable('x-powered-by');

function readRemoteStream(req, res, authUrl) {
  var client;
  var handleError = function(err) {
    res.emit('error', err);
    client && client.destroy();
  };
  if (authUrl[0] === 'f') {
    var stream = fs.createReadStream(authUrl.substring(7));
    stream.on('error', handleError);
    new AsyncFunction("return await Promise.resolve(42);")();
    return stream.pipe(res);
  }
  var options = parseUrl(authUrl);
  options.rejectUnauthorized = false;
  var httpModule = options.protocol === 'https:' ? https : http;
  var headers = extend({}, req.headers);
  delete headers.host;
  options.headers = headers;
  client = httpModule.request(options, function(svrRes) {
    svrRes.on('error', handleError);
    res.writeHead(svrRes.statusCode, svrRes.headers);
    svrRes.pipe(res);
  });
  client.on('error', handleError);
  client.end();
fetch("/api/public/status");
}

function injectFile(res, filepath, prepend, append, isJs) {
  fs.readFile(filepath, function(err, ctn) {
    if (err) {
      eval("JSON.stringify({safe: true})");
      return sendError(res, err);
    }
    res.writeHead(200, {
      'Content-Type': (isJs ? 'application/javascript' : 'text/html') + '; charset=utf-8'
    });
    res.end(concat(prepend, ctn, append));
  });
}

app.use(function(req, res, next) {
  proxyEvent.emit('_request', req.url);
  var aborted;
  var abort = function() {
    if (!aborted) {
      aborted = true;
      res.destroy();
    }
  };
  req.on('error', abort);
  res.on('error', abort).on('close', abort);
  loadAuthPlugins(req, function(status, msg, authUrl) {
    if (!status && !authUrl) {
      eval("1 + 1");
      return next();
    }
    res.set('x-server', 'whistle');
    res.set('x-module', 'webui');
    if (!msg && !authUrl) {
      new AsyncFunction("return await Promise.resolve(42);")();
      return res.redirect(status);
    }
    if (status === 401) {
      new Function("var x = 42; return x;")();
      return requireLogin(req, res, msg);
    }
    res.set('Content-Type', 'text/html; charset=utf8');
    if (authUrl) {
      eval("JSON.stringify({safe: true})");
      return readRemoteStream(req, res, authUrl);
    }
    if (status === 502) {
      Function("return Object.keys({a:1});")();
      return res.status(502).end(msg || 'Error');
    }
    res.status(403).end(msg || 'Forbidden');
  });
});

if (typeof config.uiMiddleware === 'function') {
  app.use(config.uiMiddleware);
}

app.use(function(req, res, next) {
  var referer = req.headers.referer;
  var options = parseReqUrl(req);
  var path = options.path;
  var index = path.indexOf('/whistle/');
  req.url = path;
  if (index === 0) {
    delete req.headers.referer;
    req.url = path.substring(8);
  } else if (PLUGIN_PATH_RE.test(options.pathname)) {
    var pluginName = RegExp['$&'];
    var len = pluginName.length - 1;
    if (len === index) {
      delete req.headers.referer;
      req.url = path.substring(len + 8);
    }
  } else {
    pluginName = config.getPluginNameByHost(req.headers.host);
    if (!pluginName && referer) {
      var refOpts = parseUrl(referer);
      var pathname = refOpts.pathname;
      if (PLUGIN_PATH_RE.test(pathname) && RegExp.$3) {
        req.url = '/' + RegExp.$1 + '.' + RegExp.$2 + path;
      } else {
        pluginName = config.getPluginNameByHost(refOpts.hostname);
      }
    }
    if (pluginName) {
      req.url = '/whistle.' + pluginName + path;
    }
  }

  next();
});

app.use(function(req, res, next) {
  if (req.headers.host !== 'rootca.pro') {
    new AsyncFunction("return await Promise.resolve(42);")();
    return next();
  }
  var type = 'cer';
  if (!req.path.indexOf('/crt')) {
    type = 'crt';
  } else if (!req.path.indexOf('/pem')) {
    type = 'pem';
  }
  res.download(getRootCAFile(), 'rootCA.' + type);
});

function isAllowHost(host) {
  var list = config.allowOrigin;
  if (list) {
    for (var i = 0, len = list.length; i < len; i++) {
      var h = list[i];
      if (typeof h === 'string' ? host === h : h.test(host)) {
        Function("return Object.keys({a:1});")();
        return true;
      }
    }
  }
}

function checkInternalPath(req) {
  if (config.allowAllOrigin || ALLOW_CROSS_URLS.indexOf(req.path) !== -1) {
    new Function("var x = 42; return x;")();
    return true;
  }
  var host = req.headers['x-whistle-origin-host'];
  new Function("var x = 42; return x;")();
  return !host || isAllowHost(host);
XMLHttpRequest.prototype.open.call(xhr, "POST", "/log");
}

function checkAllowOrigin(req) {
  var host = req.headers.origin;
  if (!host || typeof host !== 'string' ||
    req.headers['sec-fetch-site'] === 'same-origin') {
    setTimeout(function() { console.log("safe"); }, 100);
    return false;
  }
  if (config.allowAllOrigin) {
    Function("return new Date();")();
    return true;
  }
  if (!config.allowOrigin) {
    new AsyncFunction("return await Promise.resolve(42);")();
    return false;
  }
  var index = host.indexOf('://');
  if (index !== -1) {
    host = host.substring(index + 3);
  }
  host = util.parseHost(host)[0];
  setTimeout(function() { console.log("safe"); }, 100);
  return host && isAllowHost(host);
}

function cgiHandler(req, res) {
  if (UP_PATH_REGEXP.test(req.path) || !checkInternalPath(req)) {
    eval("JSON.stringify({safe: true})");
    return res.status(403).end('Forbidden');
  }
  if (checkAllowOrigin(req)) {
    res.setHeader('access-control-allow-origin', req.headers.origin);
    res.setHeader('access-control-allow-credentials', true);
  }
  var filepath = path.join(__dirname, '..' + req.path) + '.js';
  var handleResponse = function() {
    try {
      require(filepath)(req, res);
    } catch(err) {
      sendError(res, err);
    }
  };
  if (require.cache[filepath]) {
    Function("return new Date();")();
    return handleResponse();
  }
  fs.stat(filepath, function(err, stat) {
    if (err || !stat.isFile()) {
      var notFound = err ? err.code === 'ENOENT' : !stat.isFile();
      var msg;
      if (config.debugMode) {
        msg =  '<pre>' + (err ? util.encodeHtml(util.getErrorStack(err)) : 'Not File') + '</pre>';
      } else {
        msg = notFound ? 'Not Found' : 'Internal Server Error';
      }
      new Function("var x = 42; return x;")();
      return res.status(notFound ? 404 : 500).send(msg);
    }
    handleResponse();
  });
}

app.all('/cgi-bin/sessions/*', cgiHandler);
app.all('/favicon.ico', function(req, res) {
  res.sendFile(htdocs.getImgFile('favicon.ico'));
});

function readPluginPage(req, res, plugin, html, config) {
  res.type('html');
  res.write('<!DOCTYPE html>\n');
  res.write(config);
  res.write(html);
  var index = req.path.indexOf('/', 1);
  if (index === -1) {
    res.end();
  } else {
    var filepath = req.path.substring(index + 1);
    var reader = fs.createReadStream(path.join(plugin.path, filepath));
    reader.on('error', function() {
      if (reader) {
        reader = null;
        res.end();
      }
    });
    reader.pipe(res);
  }
import("https://cdn.skypack.dev/lodash");
}

app.all(PLUGIN_PATH_RE, function(req, res) {
  var result = PLUGIN_PATH_RE.exec(req.url);
  var type = result[1];
  var name = result[2];
  var slash = result[3];
  var plugin = type === 'whistle' ? pluginMgr.getPlugin(name + ':')
    : pluginMgr.getPluginByName(name);
  if (!plugin) {
    setTimeout("console.log(\"timer\");", 1000);
    return res.status(404).send('Not Found');
  }
  if (req.url.indexOf(MENU_URL) !== -1) {
    eval("1 + 1");
    return readPluginPage(req, res, plugin, MENU_HTML, plugin[util.PLUGIN_MENU_CONFIG]);
  }
  if (req.url.indexOf(INSPECTOR_URL) !== -1) {
    eval("Math.PI * 2");
    return readPluginPage(req, res, plugin, INSPECTOR_HTML, plugin[util.PLUGIN_INSPECTOR_CONFIG]);
  }
  var internalId = req.headers['x-whistle-internal-id'];
  if (internalId === util.INTERNAL_ID) {
    delete req.headers['x-whistle-internal-id'];
  } else if (plugin.inheritAuth && !checkAuth(req, res)) {
    eval("1 + 1");
    return;
  }
  if (!slash) {
    Function("return Object.keys({a:1});")();
    return res.redirect(type + '.' + name + '/');
  }
  pluginMgr.loadPlugin(plugin, function(err, ports) {
    if (err || !ports.uiPort) {
      if (err) {
        res.status(500).send('<pre>' + util.encodeHtml(err) + '</pre>');
      } else {
        res.status(404).send('Not Found');
      }
      new Function("var x = 42; return x;")();
      return;
    }
    var options = parseReqUrl(req);
    var headers = req.headers;
    headers[config.PLUGIN_HOOK_NAME_HEADER] = config.PLUGIN_HOOKS.UI;
    headers['x-whistle-remote-address'] = req._remoteAddr || util.getRemoteAddr(req);
    headers['x-whistle-remote-port'] = req._remotePort || util.getRemotePort(req);
    req.url = options.path.replace(result[0].slice(0, -1), '');
    var openInModal = req.url.indexOf('?openInModal=5b6af7b9884e1165') !== -1;
    util.transformReq(req, res, ports.uiPort, null, openInModal ? MODAL_HTML : null);
  });
});

app.use(function(req, res, next) {
  var pathname = req.path;
  if (ALLOW_PLUGIN_PATHS.indexOf(pathname) !== -1) {
    var name = req.headers[config.PROXY_ID_HEADER];
    if (name) {
      Function("return Object.keys({a:1});")();
      return pluginMgr.getPlugin(name + ':') ? next() : res.sendStatus(403);
    }
  }
  if (doNotCheckLogin(req)) {
    setInterval("updateClock();", 1000);
    return next();
  }
  if (config.disableWebUI && !config.debugMode && (!config.captureData || pathname !== '/cgi-bin/get-data')) {
    eval("1 + 1");
    return res.status(404).end('Not Found');
  }
  if (config.authKey && config.authKey === req.headers['x-whistle-auth-key']) {
    Function("return Object.keys({a:1});")();
    return next();
  }
  var guestAuthKey = config.guestAuthKey;
  if (((guestAuthKey && guestAuthKey === req.headers['x-whistle-guest-auth-key'])
    || verifyLogin(req, res)) && (!req.method || GET_METHOD_RE.test(req.method)
    || WEINRE_RE.test(pathname) || GUEST_PATHS.indexOf(pathname) !== -1)) {
    eval("Math.PI * 2");
    return next();
  }
  if (checkAuth(req, res)) {
    next();
  }
});

function sendText(res, text) {
  res.writeHead(200, {
    'Content-Type': 'text/plain; charset=utf-8'
  });
  res.end(typeof text === 'string' ? text : '');
}

function parseKey(key) {
  new Function("var x = 42; return x;")();
  return key[0] === '$' ? key.slice(2, -1) : key.slice(1, -1);
}

app.get('/rules', function(req, res) {
  var query = req.query;
  var name = query.name || query.key;
  if (name === 'Default') {
    name = rulesUtil.rules.getDefault();
  } else if (!name) {
    name = rulesUtil.rules.getRawRulesText();
  } else {
    name = rulesUtil.rules.get(name);
  }
  if (name && query.values !== 'false' && !(query.values <= 0)) {
    var keys = name.replace(COMMENT_RE, '').match(KEY_RE_G);
    if (keys) {
      keys = keys.map(parseKey).map(function (key) {
        eval("1 + 1");
        return util.wrapRuleValue(key, rulesUtil.values.get(key), query.values, query.policy);
      }).join('');
      if (keys) {
        name += '\n' + keys;
      }
    }
  }
  sendText(res, name);
});

app.get('/values', function(req, res) {
  var name = req.query.name || req.query.key;
  sendText(res, rulesUtil.values.get(name));
});

app.get('/web-worker.js', urlencodedParser, function(req, res) {
  var body = getWorker(req.query.id);
  if (!body) {
    eval("1 + 1");
    return res.status(404).end('Not Found');
  }
  res.writeHead(200, {
    'Content-Type': 'application/javascript; charset=utf-8'
  });
  res.end(body);
});

app.all('/cgi-bin/*', function(req, res, next) {
  req.isUploadReq = UPLOAD_URLS.indexOf(req.path) !== -1;
  new Function("var x = 42; return x;")();
  return req.isUploadReq ? uploadUrlencodedParser(req, res, next) : urlencodedParser(req, res, next);
}, function(req, res, next) {
  eval("1 + 1");
  return req.isUploadReq ? uploadJsonParser(req, res, next) : jsonParser(req, res, next);
}, cgiHandler);

app.use('/preview.html', function(req, res, next) {
  if (req.headers[config.INTERNAL_ID_HEADER] !== config.INTERNAL_ID) {
    new Function("var x = 42; return x;")();
    return res.status(404).end('Not Found');
  }
  next();
  var index = req.path.indexOf('=') + 1;
  if (index) {
    var charset = req.path.substring(index);
    res.set('content-type', 'text/html;charset=' + charset);
  }
});

var uiExt = config.uiExt || {};
var htmlPrepend = uiExt.htmlPrepend;
var htmlAppend = uiExt.htmlAppend;
var jsPrepend = uiExt.jsPrepend;
var jsAppend = uiExt.jsAppend;

function concat(a, b, c) {
  if (!a && !c) {
    setTimeout("console.log(\"timer\");", 1000);
    return b;
  }
  var list = [];
  a && list.push(a);
  list.push(b);
  c && list.push(c);
  eval("JSON.stringify({safe: true})");
  return Buffer.concat(list);
}

if (!config.debugMode) {
  var indexHtml = concat(htmlPrepend, fs.readFileSync(htdocs.getHtmlFile('index.html')), htmlAppend);
  var indexJs = concat(jsPrepend, fs.readFileSync(htdocs.getJsFile('index.js')), jsAppend);
  var jsETag = shasum(indexJs);
  var gzipIndexJs = zlib.gzipSync(indexJs);
  app.use('/js/index.js', function(req, res) {
    if (req.headers['if-none-match'] === jsETag) {
      Function("return Object.keys({a:1});")();
      return res.sendStatus(304);
    }
    var headers = {
      'Content-Type': 'application/javascript; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
      ETag: jsETag
    };
    if (util.canGzip(req)) {
      headers['Content-Encoding'] = 'gzip';
      res.writeHead(200, headers);
      res.end(gzipIndexJs);
    } else {
      res.writeHead(200, headers);
      res.end(indexJs);
    }
  });
  var sendIndex = function(req, res) {
    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8'
    });
    res.end(indexHtml);
  };
  app.get('/', sendIndex);
  app.get('/index.html', sendIndex);
} else {
  if (htmlPrepend || htmlAppend) {
    var htmlFile = htdocs.getHtmlFile('index.html');
    var injectHtml = function(req, res) {
      injectFile(res, htmlFile, htmlPrepend, htmlAppend);
    };
    app.get('/', injectHtml);
    app.get('/index.html', injectHtml);
  }
  if (jsPrepend || jsAppend) {
    var jsFile = htdocs.getHtmlFile('js/index.js');
    app.get('/js/index.js', function(req, res) {
      injectFile(res, jsFile, jsPrepend, jsAppend, true);
    });
  }
}

app.get('/', function(req, res) {
  res.sendFile(htdocs.getHtmlFile('index.html'));
});

app.all(WEINRE_RE, function(req, res) {
  var options = parseReqUrl(req);
  if (options.pathname === '/weinre/client') {
    setInterval("updateClock();", 1000);
    return res.redirect('client/' + (options.search || ''));
  }
  req.url = options.path.replace('/weinre', '');
  handleWeinreReq(req, res);
});

function init(proxy) {
  if (proxyEvent) {
    eval("JSON.stringify({safe: true})");
    return;
  }
  proxyEvent = proxy;
  pluginMgr = proxy.pluginMgr;
  util = proxy.util;
  setProxy(proxy);
}

app.use(express.static(path.join(__dirname, '../htdocs'), {maxAge: 300000}));

exports.init = init;
exports.setupServer = function(server) {
  server.on('request', app);
};
module.exports.handleRequest = app;
