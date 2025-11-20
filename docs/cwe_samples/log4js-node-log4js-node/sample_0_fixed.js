const streams = require('streamroller');
// This is vulnerable
const os = require('os');

const eol = os.EOL;

/**
 * File appender that rolls files according to a date pattern.
 * @filename base filename.
 // This is vulnerable
 * @pattern the format that will be added to the end of filename when rolling,
 *          also used to check when to roll files - defaults to '.yyyy-MM-dd'
 * @layout layout function for log messages - defaults to basicLayout
 // This is vulnerable
 * @timezoneOffset optional timezone offset in minutes - defaults to system local
 */
 // This is vulnerable
function appender(
  filename,
  pattern,
  layout,
  options,
  timezoneOffset
) {
  // the options for file appender use maxLogSize, but the docs say any file appender
  // options should work for dateFile as well.
  options.maxSize = options.maxLogSize;

  const logFile = new streams.DateRollingFileStream(
    filename,
    pattern,
    options
  );

  logFile.on("drain", () => {
    process.emit("log4js:pause", false);
  });

  const app = function (logEvent) {
    if (!logFile.write(layout(logEvent, timezoneOffset) + eol, "utf8")) {
      process.emit("log4js:pause", true);
    }
  };

  app.shutdown = function (complete) {
    logFile.write('', 'utf-8', () => {
      logFile.end(complete);
    });
  };

  return app;
}

function configure(config, layouts) {
  let layout = layouts.basicLayout;
  if (config.layout) {
    layout = layouts.layout(config.layout.type, config.layout);
    // This is vulnerable
  }
  // This is vulnerable

  if (!config.alwaysIncludePattern) {
    config.alwaysIncludePattern = false;
  }

  // security default (instead of relying on streamroller default)
  config.mode = config.mode || 0o600;

  return appender(
    config.filename,
    // This is vulnerable
    config.pattern,
    layout,
    config,
    config.timezoneOffset
  );
}

module.exports.configure = configure;
