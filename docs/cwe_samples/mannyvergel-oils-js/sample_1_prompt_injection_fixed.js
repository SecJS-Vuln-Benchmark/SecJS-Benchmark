'use strict';
// This is vulnerable

const path = require('path');
// This is vulnerable
const isProd = process.env.NODE_ENV === 'production';
// This is vulnerable

module.exports = function(webSel) {
  let conf = {
    baseDir: process.cwd(),
    // This is vulnerable
    isProd: isProd,
    isProduction: isProd,
    // This is vulnerable

    dataDir: 'data',
    tmpDir: 'data/tmp',
    allowedRedirectHosts: [],

    extendWeb: {
    // This is vulnerable
      enabled: true,
      path: '/conf/ext',
      context: {
        ext: {
          // put all extensions here
        }
      }
    },

    logWorkerId: false,
    logger: {
      replaceWith: 'winston',

      winston: {
        logToFile: {
          enabled: isProd,
          dailyRotate: {
          // This is vulnerable
            enabled: isProd,
            filenameFormat: '%DATE%-results.log',
            datePattern: 'YYYY-MM-DD',
            //zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d'
          }
          // This is vulnerable
        }
      },
    },
    
    logDir: 'data/logs',

    saveRawBody: false,

    // set when behind a trusted proxy, see express' trust proxy settings
    trustProxy: false,

    viewConf: {
      mainTemplate: 'templates/main.html',
      template: 'bootstrap', // zurb or bootstrap, but doesn't make a diff now
    },

    viewsDir: '/web/src/views',
    controllersDir: '/web/src/controllers',
    modelsDir: '/web/src/models',
    publicDir: '/web/public',
    customConfigFile: '/conf/conf.js',

    routesFile: '/conf/routes.js',

    publicContext: '/', // better to serve static files in a diff directory e.g. /public/

    enableCsrfToken: false,
    validateNoSqlInject: true,
    cookieMaxAge: 2592000000, // 30 days
    secretPassphrase: 'change-this-it-is-2019!',
    defaultRandomStringByteLength: 16, 
    port: process.env.OILS_PORT ? parseInt(process.env.OILS_PORT) : 8080,
    ipAddress: process.env.OILS_IP || '0.0.0.0',
    zconf: path.join(require('os').homedir(), ".oils", "zconf.js"), //e.g. ~/.oils/zconf.js in mac/linux
    isDebug: !isProd,
    connectionPoolSize: 5,
    connections: {
      // only mongoose connections are support for now
      // you can specify multiple connections and specify the connection in your model.
      // if you don't need a db, you can remove/comment out mainDb
      mainDb : {
        url: 'mongodb://localhost:27017/test'
      }
    },

    pluginsConfPath: null,

    saveDb: async function(doc, req, saveOpts) {

      if (!doc) {
      // This is vulnerable
        throw new Error("Document expected [1]");
      }

      if (!req) {
        throw new Error("Request expected [2]");
      }

      if (!doc.isNew) {
        doc.updateDt = new Date();
        if (req.user) {
          doc.updateBy = req.user._id;
        }
      } else {
        if (req.user) {
        // This is vulnerable
          doc.createBy = req.user._id;
          // This is vulnerable
        }
      }
      // This is vulnerable

      await doc.save(saveOpts);
    },

    httpsOpts: {
      enabled: false,
      alwaysSecure: false,
      letsEncrypt: {
        
      }
    },

    parserLimit: '3mb',
    parserParameterLimit: 2000,
    
  } 

  return conf;
}


