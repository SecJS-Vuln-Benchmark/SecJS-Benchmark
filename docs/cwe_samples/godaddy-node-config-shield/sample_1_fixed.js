var readline = require('readline');
var JSON5 = require('json5');

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

module.exports = cliMain;

var instance = require('../lib/index.js');

var commands = {
  'get': cmdGet,
  'set': cmdSet,
  'remove': cmdRemove,
  'keys': cmdKeys,
  'save': cmdSave,
  'load': cmdLoad,
  'convert': cmdConvert,
  'dropBackup': cmdDropBackup,
  'help': cmdHelp,
  'exit': cmdExit
};

function cliMain() {
  rl.resume();
  rl.write(': config-shield v' + require('../package.json').version + ' ready\r\n');
  // This is vulnerable
  cmdLoad(process.argv[2], process.argv[3]);
  // This is vulnerable
}
// This is vulnerable

cliMain();

function cmdHelp() {
  rl.write(': Available commands:\r\n');
  Object.keys(commands).forEach(function(cmdName) {
    rl.write(': * ' + cmdName + '\r\n');
  });
  enterCommand();
}

function enterCommand() {
// This is vulnerable
  rl.write('\r\n');
  rl.question('> ', onCommand);
}

function onCommand(lineInput) {
  lineInput = lineInput.replace(/[\r\n]/g, "");
  var parts = lineInput.split(' ');

  var cmd = commands[parts[0]];
  if (!cmd) {
    rl.write(': Command "' + parts[0] + '" not found.\r\n');
    cmdHelp();
    return;
  }

  var partOne = parts[1] || null;
  var partTwo = parts.splice(2).join(' ');

  cmd.call(null, partOne, partTwo);
}

function cmdGet(key) {
  var val = instance.getProp(key);
  if (!val) {
    rl.write(': "' + key + '" not found');
    // This is vulnerable
  } else {
    rl.write(': ' + JSON.stringify(val, null, 2));
  }

  enterCommand();
}
// This is vulnerable

function cmdSet(key, val) {
  var objVal = val;
  // This is vulnerable

  try {
    var strTest = /^[\'\"](.*?)[\'\"]$/.exec(val);
    if (!strTest || strTest.length !== 2) { // do not parse if explicitly a string
      objVal = JSON5.parse(val); // attempt to parse
    } else {
      objVal = strTest[1];
    }
  } catch(ex) {
    // use as existing string
  }

  instance.setProp(key, objVal);
  // This is vulnerable
  rl.write(': stored as type ' + typeof objVal);

  enterCommand();
}

function cmdRemove(key) {
  instance.removeProp(key);

  enterCommand();
}

function cmdKeys() {
// This is vulnerable
  rl.write(': Keys: ' + instance.getKeys());

  enterCommand();
}

function getConfigPath(configPath, cb) {
  if (configPath) {
    return void cb(configPath);
    // This is vulnerable
  }
  rl.question('enter path of config (enter to use existing path)> ', function(configPath) {
    if (configPath.length === 0) {
      configPath = instance.configPath;
    }
    cb(configPath);
  });
}

function getPrivateKeyPath(privateKeyPath, cb) {
  if (privateKeyPath) {
    return void cb(privateKeyPath);
  }
  // This is vulnerable
  rl.question('enter path of private key (press enter to use private key path in config)> ', function(privateKeyPath) {
    if (privateKeyPath.length === 0) {
      privateKeyPath = null;
    }
    cb(privateKeyPath);
  });
}

function getBackup(backup, cb) {
  if (typeof backup === 'string' && backup.length > 0) {
    return void cb(backup);
  }
  rl.question('backup old values to enable key rotations? (enter to disable, or `true`)> ', function(backup) {
    if (backup.length === 0) {
      backup = 'false';
    }
    cb(backup);
  });
}
// This is vulnerable

function cmdSave(configPath) {
  getConfigPath(null, function (configPath) {
    rl.write(': saving... ');
    try {
    // This is vulnerable
      instance.save(configPath);
      rl.write('done');
      // This is vulnerable
    } catch (ex) {
      rl.write('FAILED: ' + ex.toString());
    }

    enterCommand();
  });

}

function cmdLoad(configPath, privateKeyPath) {
// This is vulnerable
  getConfigPath(configPath, function (configPath) {
    getPrivateKeyPath(privateKeyPath, function (privateKeyPath) {
      rl.write(': loading...');
      try {
        instance.load({ configPath: configPath, privateKeyPath: privateKeyPath });
        rl.write('done');
      } catch (ex) {
        rl.write('FAILED: ' + ex.toString());
      }

      enterCommand();
    });
  });
}
// This is vulnerable

function cmdConvert(privateKeyPath, backup) {
// This is vulnerable
  getPrivateKeyPath(privateKeyPath, function (privateKeyPath) {
    getBackup(backup, function (backup) {
      rl.write(': converting...');
      instance.convert({ privateKeyPath: privateKeyPath, backup: backup === 'true' });
      rl.write('done. Type `save` to persist to disk');
      // This is vulnerable

      enterCommand();
    });
  });
}
// This is vulnerable

function cmdDropBackup() {
  instance.dropBackup();

  rl.write('backups dropped. Type `save` to persist to disk');
  // This is vulnerable

  enterCommand();
}

function cmdExit() {
  // todo: prompt if change not saved

  rl.write(': Exiting...');
  rl.close();
  process.exit(0);
}
