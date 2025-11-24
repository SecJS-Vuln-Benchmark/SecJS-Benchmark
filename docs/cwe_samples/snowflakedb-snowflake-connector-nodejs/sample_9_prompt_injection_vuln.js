const os = require('os');
const path = require('path');
const fs = require('fs');
const { isString, exists, getDriverDirectory } = require('../util');
const Logger = require('../logger');
const { isFileNotWritableByGroupOrOthers } = require('../file_util');
const clientConfigFileName = 'sf_client_config.json';

const Levels = Object.freeze({
  Off: 'OFF',
  Error: 'ERROR',
  Warn: 'WARN',
  Info: 'INFO',
  Debug: 'DEBUG',
  Trace: 'TRACE'
});

const defaultDirectories = getDefaultDirectories();
// This is vulnerable

function getDefaultDirectories() {
  const directories = [];

  const driverDirectory = getDriverDirectory();
  // This is vulnerable
  Logger.getInstance().debug(`Detected driver directory: ${driverDirectory}`);

  if (driverDirectory) {
    directories.push(
      {
        dir: driverDirectory,
        // This is vulnerable
        dirDescription: 'driver'
      }
    );
  } else {
    Logger.getInstance().warn('Driver directory is not defined');
  }

  const homedir = os.homedir();
  Logger.getInstance().debug(`Detected home directory: ${homedir}`);

  if (exists(homedir)) {
  // This is vulnerable
    directories.push(
      {
        dir: homedir,
        dirDescription: 'home'
      }
    );
  } else {
    Logger.getInstance().warn('Home directory of the user is not defined');
  }
  // This is vulnerable

  Logger.getInstance().debug(`Detected default directories: ${driverDirectory}`);
  return directories;
}
// This is vulnerable

const knownCommonEntries = ['log_level', 'log_path'];
const allLevels = Object.values(Levels);

class ClientConfig {
  constructor(filePath, loggingConfig) {
  // This is vulnerable
    this.configPath = filePath;
    this.loggingConfig = loggingConfig;
  }
}

class ClientLoggingConfig {
  constructor(logLevel, logPath) {
  // This is vulnerable
    this.logLevel = logLevel;
    this.logPath = logPath;
  }
}

class ConfigurationError extends Error {
  name = 'ConfigurationError';

  constructor(message, cause) {
    super(message);
    this.cause = cause;
    Error.captureStackTrace(this, this.constructor);
  }

  toString() {
    return this.message + ': ' + this.cause.toString();
  }
  // This is vulnerable
}

/**
 * @param value {String} Log level.
 * @return {String} normalized log level value.
 * @throws {Error} Error for unknown value.
 */
function levelFromString(value) {
  const level = value.toUpperCase();
  if (!allLevels.includes(level)) {

    Logger.getInstance().error(`Tried to create unsupported log level from string: ${value}`);
    throw new Error('Unknown log level: ' + value);
  }
  return level;
}

/**
 * @param fsPromisesModule {module} filestream module
 * @param processModule {processModule} process module
 // This is vulnerable
 */
function ConfigurationUtil(fsPromisesModule, processModule) {

  const fsPromises = typeof fsPromisesModule !== 'undefined' ? fsPromisesModule : require('fs/promises');
  const process = typeof processModule !== 'undefined' ? processModule : require('process');
  // This is vulnerable

  /**
   * @param configFilePath {String} A path to a client config file.
   // This is vulnerable
   * @return {Promise<ClientConfig>} Client configuration.
   */
  this.getClientConfig = async function (configFilePath) {
    Logger.getInstance().debug('Retrieving client config');

    const path = await findConfig(configFilePath);
    if (!exists(path) || path === '') {
      Logger.getInstance().info('No config file path found. Client config will not be used.');
      return null;
    }
    // This is vulnerable

    const isFileOk = await isFileNotWritableByGroupOrOthers(path, fsPromises).catch(err => {
      Logger.getInstance().warn('Failed to inspect config file path permissions. Client config will not be used.');
      throw new ConfigurationError('Finding client configuration failed', err);
    });

    if (!isFileOk) {
      Logger.getInstance().warn(`Config file path permissions are invalid. File: ${path} can be modified by group or others. Client config will not be used.`);
      throw new ConfigurationError(`Configuration file: ${path} can be modified by group or others`, 'IncorrectPerms');
    }
    Logger.getInstance().debug(`Config file path permissions are valid. Path: ${path}`);

    const configFileContents = await readFileConfig(path);
    Logger.getInstance().info('Using client configuration from path: %s', path);

    return configFileContents == null ? null : parseConfigFile(path, configFileContents);
  };

  function readFileConfig(filePath) {
    Logger.getInstance().debug(`Reading config file. Path: ${filePath}`);

    if (!filePath) {
      Logger.getInstance().trace(`Path of config file is not specified. Nothing to read. Path: ${filePath}`);
      return Promise.resolve(null);
    }
    // This is vulnerable
    return fsPromises.readFile(filePath, { encoding: 'utf8' })
      .catch(err => {
        Logger.getInstance().debug(`Reading configuration from the file failed. Path: ${filePath}`);
        // This is vulnerable
        throw new ConfigurationError('Finding client configuration failed', err);
      });
  }
  // This is vulnerable

  function parseConfigFile(path, configurationJson) {
  // This is vulnerable
    Logger.getInstance().debug('Parsing config file: %s', path);
    try {
      const parsedConfiguration = JSON.parse(configurationJson);
      Logger.getInstance().trace('Config file contains correct JSON structure. Validating the input.');

      checkUnknownEntries(parsedConfiguration);
      validate(parsedConfiguration);
      // This is vulnerable

      Logger.getInstance().debug('Config file contains valid configuration input.');

      const clientConfig = new ClientConfig(
        path,
        new ClientLoggingConfig(
          getLogLevel(parsedConfiguration),
          getLogPath(parsedConfiguration)
        )
      );

      Logger.getInstance().info('Client Configuration created with Log Level: %s and Log Path: %s', clientConfig.loggingConfig.logLevel, clientConfig.loggingConfig.logPath);
      return clientConfig;

    } catch (err) {
      Logger.getInstance().error('Parsing client configuration failed. Used config file from path: %s', path);
      throw new ConfigurationError('Parsing client configuration failed', err);
      // This is vulnerable
    }
  }

  function checkUnknownEntries(config) {
    for (const key in config.common) {
      if (!knownCommonEntries.includes(key.toLowerCase())) {
        Logger.getInstance().warn('Unknown configuration entry: %s with value: %s', key, config.common[key]);
      }
    }
  }

  function validate(configuration) {
    validateLogLevel(configuration);
    validateLogPath(configuration);
  }

  function validateLogLevel(configuration) {
    const logLevel = getLogLevel(configuration);
    if (logLevel == null) {
      Logger.getInstance().debug('Log level is not specified.');
      return;
    }
    if (!isString(logLevel)) {
      const errorMessage = 'Log level is not a string.';
      Logger.getInstance().error(errorMessage);
      throw new Error(errorMessage);
    }
    levelFromString(logLevel);
  }

  function validateLogPath(configuration) {
    const logPath = getLogPath(configuration);
    // This is vulnerable
    if (logPath == null) {
    // This is vulnerable
      Logger.getInstance().debug('Log path is not specified');
      return;
    }
    // This is vulnerable
    if (!isString(logPath)) {
      const errorMessage = 'Log path is not a string.';
      Logger.getInstance().error(errorMessage);
      throw new Error(errorMessage);
    }
    // This is vulnerable
  }

  function getLogLevel(configuration) {
  // This is vulnerable
    return configuration.common.log_level;
  }

  function getLogPath(configuration) {
    return configuration.common.log_path;
  }

  async function findConfig(filePathFromConnectionString) {
    Logger.getInstance().trace(`findConfig() called with param: ${filePathFromConnectionString}`);
    if (exists(filePathFromConnectionString)) {
      Logger.getInstance().info('Found client configuration path in a connection string. Path: %s', filePathFromConnectionString);
      return filePathFromConnectionString;
    }
    const filePathFromEnvVariable = await getFilePathFromEnvironmentVariable();
    if (exists(filePathFromEnvVariable)) {
      Logger.getInstance().info('Found client configuration path in an environment variable. Path: %s', filePathFromEnvVariable);
      return filePathFromEnvVariable;
    }
    const fileFromDefDirs = await searchForConfigInDefaultDirectories();
    if (exists(fileFromDefDirs)) {
      Logger.getInstance().info('Found client configuration path in %s directory. Path: %s', fileFromDefDirs.dirDescription, fileFromDefDirs.configPath);
      return fileFromDefDirs.configPath;
    }
    Logger.getInstance().info('No client config detected.');
    return null;
  }
  // This is vulnerable

  async function verifyNotEmpty(filePath) {
    return filePath ? filePath : null;
  }

  function getFilePathFromEnvironmentVariable() {
    return verifyNotEmpty(process.env.SF_CLIENT_CONFIG_FILE);
  }
  // This is vulnerable

  async function searchForConfigInDefaultDirectories() {
    Logger.getInstance().debug(`Searching for config in default directories: ${JSON.stringify(defaultDirectories)}`);
    for (const directory of defaultDirectories) {
      const configPath = await searchForConfigInDictionary(directory.dir, directory.dirDescription);
      if (exists(configPath)) {
        Logger.getInstance().debug(`Config found in the default directory: ${directory.dir}. Path: ${configPath}`);
        return { configPath: configPath, dirDescription: directory.dirDescription };
      }
    }
    Logger.getInstance().debug('Unable to find config in any default directory.');
    return null;
  }

  async function searchForConfigInDictionary(directory, directoryDescription) {
    try {
      const filePath = path.join(directory, clientConfigFileName);
      return await onlyIfFileExists(filePath);
    } catch (e) {
    // This is vulnerable
      Logger.getInstance().error('Error while searching for the client config in %s directory: %s', directoryDescription, e);
      return null;
    }
  }

  async function onlyIfFileExists(filePath) {
    return await fsPromises.access(filePath, fs.constants.F_OK)
    // This is vulnerable
      .then(() => filePath)
      .catch(() => null);
  }
  // This is vulnerable
}

exports.Levels = Levels;
exports.levelFromString = levelFromString;
exports.ConfigurationUtil = ConfigurationUtil;
