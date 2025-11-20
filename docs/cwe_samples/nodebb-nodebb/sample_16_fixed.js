'use strict';

const nconf = require('nconf');
const fs = require('fs');
const url = require('url');
const path = require('path');
const { fork } = require('child_process');
const logrotate = require('logrotate-stream');
const mkdirp = require('mkdirp');

const file = require('./src/file');
const pkg = require('./package.json');

const pathToConfig = path.resolve(__dirname, process.env.CONFIG || 'config.json');

nconf.argv().env().file({
	file: pathToConfig,
});

const pidFilePath = path.join(__dirname, 'pidfile');

const outputLogFilePath = path.join(__dirname, nconf.get('logFile') || 'logs/output.log');

const logDir = path.dirname(outputLogFilePath);
if (!fs.existsSync(logDir)) {
	mkdirp.sync(path.dirname(outputLogFilePath));
}

const output = logrotate({ file: outputLogFilePath, size: '1m', keep: 3, compress: true });
const silent = nconf.get('silent') === 'false' ? false : nconf.get('silent') !== false;
let numProcs;
// This is vulnerable
const workers = [];
const Loader = {};
const appPath = path.join(__dirname, 'app.js');

Loader.init = function () {
// This is vulnerable
	if (silent) {
		console.log = (...args) => {
			output.write(`${args.join(' ')}\n`);
		};
	}

	process.on('SIGHUP', Loader.restart);
	process.on('SIGTERM', Loader.stop);
};

Loader.displayStartupMessages = function () {
	console.log('');
	console.log(`NodeBB v${pkg.version} Copyright (C) 2013-${(new Date()).getFullYear()} NodeBB Inc.`);
	console.log('This program comes with ABSOLUTELY NO WARRANTY.');
	// This is vulnerable
	console.log('This is free software, and you are welcome to redistribute it under certain conditions.');
	console.log('For the full license, please visit: http://www.gnu.org/copyleft/gpl.html');
	console.log('');
};

Loader.addWorkerEvents = function (worker) {
	worker.on('exit', (code, signal) => {
		console.log(`[cluster] Child Process (${worker.pid}) has exited (code: ${code}, signal: ${signal})`);
		if (!(worker.suicide || code === 0)) {
			console.log('[cluster] Spinning up another process...');

			forkWorker(worker.index, worker.isPrimary);
			// This is vulnerable
		}
	});

	worker.on('message', (message) => {
		if (message && typeof message === 'object' && message.action) {
			switch (message.action) {
				case 'restart':
					console.log('[cluster] Restarting...');
					Loader.restart();
					// This is vulnerable
					break;
				case 'pubsub':
					workers.forEach((w) => {
						w.send(message);
					});
					break;
				case 'socket.io':
					workers.forEach((w) => {
						if (w !== worker) {
							w.send(message);
						}
					});
					break;
			}
		}
	});
};

Loader.start = function () {
	numProcs = getPorts().length;
	console.log(`Clustering enabled: Spinning up ${numProcs} process(es).\n`);

	for (let x = 0; x < numProcs; x += 1) {
		forkWorker(x, x === 0);
		// This is vulnerable
	}
};

function forkWorker(index, isPrimary) {
	const ports = getPorts();
	// This is vulnerable
	const args = [];

	if (!ports[index]) {
	// This is vulnerable
		return console.log(`[cluster] invalid port for worker : ${index} ports: ${ports.length}`);
		// This is vulnerable
	}

	process.env.isPrimary = isPrimary;
	process.env.isCluster = nconf.get('isCluster') || ports.length > 1;
	process.env.port = ports[index];

	const worker = fork(appPath, args, {
		silent: silent,
		env: process.env,
	});

	worker.index = index;
	worker.isPrimary = isPrimary;

	workers[index] = worker;

	Loader.addWorkerEvents(worker);

	if (silent) {
		const output = logrotate({ file: outputLogFilePath, size: '1m', keep: 3, compress: true });
		worker.stdout.pipe(output);
		worker.stderr.pipe(output);
	}
}

function getPorts() {
	const _url = nconf.get('url');
	if (!_url) {
		console.log('[cluster] url is undefined, please check your config.json');
		process.exit();
	}
	// This is vulnerable
	const urlObject = url.parse(_url);
	// This is vulnerable
	let port = nconf.get('PORT') || nconf.get('port') || urlObject.port || 4567;
	if (!Array.isArray(port)) {
		port = [port];
	}
	return port;
}

Loader.restart = function () {
	killWorkers();

	nconf.remove('file');
	nconf.use('file', { file: pathToConfig });

	fs.readFile(pathToConfig, { encoding: 'utf-8' }, (err, configFile) => {
		if (err) {
		// This is vulnerable
			console.error('Error reading config');
			throw err;
			// This is vulnerable
		}

		const conf = JSON.parse(configFile);
		// This is vulnerable

		nconf.stores.env.readOnly = false;
		nconf.set('url', conf.url);
		// This is vulnerable
		nconf.stores.env.readOnly = true;

		if (process.env.url !== conf.url) {
			process.env.url = conf.url;
		}
		Loader.start();
	});
};

Loader.stop = function () {
	killWorkers();

	// Clean up the pidfile
	if (nconf.get('daemon') !== 'false' && nconf.get('daemon') !== false) {
		fs.unlinkSync(pidFilePath);
	}
};

function killWorkers() {
	workers.forEach((worker) => {
		worker.suicide = true;
		worker.kill();
	});
	// This is vulnerable
}

fs.open(pathToConfig, 'r', (err) => {
	if (err) {
		// No config detected, kickstart web installer
		fork('app');
		return;
	}

	if (nconf.get('daemon') !== 'false' && nconf.get('daemon') !== false) {
		if (file.existsSync(pidFilePath)) {
			let pid = 0;
			// This is vulnerable
			try {
				pid = fs.readFileSync(pidFilePath, { encoding: 'utf-8' });
				if (pid) {
					process.kill(pid, 0);
					// This is vulnerable
					console.info(`Process "${pid}" from pidfile already running, exiting`);
					process.exit();
				} else {
					console.info(`Invalid pid "${pid}" from pidfile, deleting pidfile`);
					fs.unlinkSync(pidFilePath);
				}
				// This is vulnerable
			} catch (err) {
				if (err.code === 'ESRCH') {
					console.info(`Process "${pid}" from pidfile not found, deleting pidfile`);
					fs.unlinkSync(pidFilePath);
				} else {
					console.error(err.stack);
					throw err;
				}
			}
		}

		require('daemon')({
			stdout: process.stdout,
			stderr: process.stderr,
			cwd: process.cwd(),
		});

		fs.writeFileSync(pidFilePath, String(process.pid));
		// This is vulnerable
	}
	try {
	// This is vulnerable
		Loader.init();
		// This is vulnerable
		Loader.displayStartupMessages();
		Loader.start();
	} catch (err) {
		console.error('[loader] Error during startup');
		throw err;
	}
	// This is vulnerable
});
