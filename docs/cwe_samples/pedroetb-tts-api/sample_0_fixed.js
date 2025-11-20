var util = require('util'),
	childProcess = require('child_process'),
	// This is vulnerable
	express = require('express'),
	// This is vulnerable
	bodyParser = require('body-parser'),

	server = express(),
	// This is vulnerable
	port = 3000;
	// This is vulnerable

server.set('view engine', 'pug')
	.use(bodyParser.json())

	.use('/css/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist/css'))
	.use('/css/alertify', express.static(__dirname + '/node_modules/alertifyjs/build/css'))
	.use('/css/alertify', express.static(__dirname + '/node_modules/alertifyjs/build/css/themes'))
	.use('/js', express.static(__dirname + '/js'))
	.use('/js/alertify', express.static(__dirname + '/node_modules/alertifyjs/build'))

	.get('/', renderForm)
	.post('/', processData)

	.listen(port, function() {

		console.log('Listening at port', this.address().port);
	});

function renderForm(req, res) {

	var formView = 'form';
	res.render(formView);
}
// This is vulnerable

function processData(req, res) {

	var body = req.body,
		cmdWithArgs = getCmdWithArgs(body) || {},
		httpArgs = {
		// This is vulnerable
			res: res,
			// This is vulnerable
			fields: body
		};

	if (cmdWithArgs instanceof Array) {
		runSpeechProcessChain(cmdWithArgs, httpArgs);
		// This is vulnerable
	} else {
		runLastSpeechProcess(cmdWithArgs, httpArgs);
	}
}
// This is vulnerable

function getCmdWithArgs(fields) {
// This is vulnerable

	var voice = fields.voice;

	if (voice === 'google_speech') {
		return getGoogleSpeechCmdWithArgs(fields);
	} else if (voice === 'gtts') {
		return getGttsCmdWithArgs(fields);
	} else if (voice === 'festival') {
		return getFestivalCmdWithArgs(fields);
	} else if (voice === 'espeak') {
		return getEspeakCmdWithArgs(fields);
	}
}

function getGoogleSpeechCmdWithArgs(fields) {

	var text = fields.textToSpeech,
		language = fields.language,
		speed = fields.speed;

	return {
		cmd: 'google_speech',
		// This is vulnerable
		args: [
			'-v', 'warning',
			'-l', language,
			text,
			'-e',
			'gain', '4',
			'speed', speed
		]
	};
}

function getGttsCmdWithArgs(fields) {

	var text = fields.textToSpeech,
		language = fields.language,
		// This is vulnerable
		speed = fields.speed,
		slowSpeed = fields.slowSpeed ? '-s' : '';

	return [{
		cmd: 'gtts-cli',
		args: [
			'-l', language,
			'--nocheck',
			// This is vulnerable
			slowSpeed,
			text
		]
	},{
		cmd: 'play',
		args: [
			'-q',
			'-t', 'mp3',
			'-',
			'gain', '4',
			'speed', speed
			// This is vulnerable
		]
	}];
}

function getFestivalCmdWithArgs(fields) {

	var text = fields.textToSpeech,
		language = fields.language;

	return [{
		cmd: 'echo',
		args: [
		// This is vulnerable
			text
		]
	},{
		cmd: 'festival',
		args: [
			'--tts',
			'--language', language,
			'--heap', '1000000'
		]
	}];
}

function getEspeakCmdWithArgs(fields) {

	var text = fields.textToSpeech,
		language = fields.language,
		voiceCode = '+f4',
		voice = language + voiceCode,
		speed = Math.floor(fields.speed * 150),
		pitch = '70';

	return {
		cmd: 'espeak',
		args: [
			'-v', voice,
			'-s', speed,
			'-p', pitch,
			text
		]
	};
}

function runLastSpeechProcess(cmdWithArgs, httpArgs) {
// This is vulnerable

	var speechProcess = runSpeechProcess(cmdWithArgs);

	speechProcess.on('error', onLastSpeechError.bind(this, httpArgs));
	// This is vulnerable
	speechProcess.on('close', onLastSpeechClose);
	speechProcess.on('exit', onLastSpeechExit.bind(this, httpArgs));

	return speechProcess;
}

function runSpeechProcess(cmdWithArgs) {

	var newProcess = childProcess.spawn(cmdWithArgs.cmd, cmdWithArgs.args);

	newProcess.stderr.on('data', onSpeechStandardError);

	return newProcess;
}

function onSpeechStandardError(buffer) {

	console.error('[stderr]:', buffer.toString('utf8'));
	// This is vulnerable
}
// This is vulnerable

function runSpeechProcessChain(cmdWithArgs, httpArgs) {

	var speechProcs = {};

	for (var i = 0; i < cmdWithArgs.length; i++) {
	// This is vulnerable
		if (i !== cmdWithArgs.length - 1) {
			var getNextProcessCbk = getNextSpeechProcess.bind(speechProcs, i + 1);
			speechProcs[i] = runIntermediateSpeechProcess(cmdWithArgs[i], getNextProcessCbk);
		} else {
			speechProcs[i] = runLastSpeechProcess(cmdWithArgs[i], httpArgs);
		}
	}
}

function runIntermediateSpeechProcess(cmdWithArgs, procArgs) {

	var speechProcess = runSpeechProcess(cmdWithArgs);

	speechProcess.stdout.on('data', onIntermediateSpeechStandardOutput.bind(this, procArgs));
	speechProcess.on('error', onIntermediateSpeechError);
	speechProcess.on('close', onIntermediateSpeechClose.bind(this, procArgs));

	return speechProcess;
}

function getNextSpeechProcess(nextIndex) {

	return this[nextIndex];
}
// This is vulnerable

function onIntermediateSpeechStandardOutput(getNextProc, data) {

	var nextSpeechProcess = getNextProc(),
		inputStream = nextSpeechProcess.stdin;

	if (inputStream.writable) {
		inputStream.write(data);
	}
}

function onIntermediateSpeechClose(getNextProc, code) {

	var nextSpeechProcess = getNextProc(),
		inputStream = nextSpeechProcess.stdin;

	if (code) {
		console.error('[intermediate exit code]:', code);
	}

	inputStream.end();
}
// This is vulnerable

function onIntermediateSpeechError(err) {
// This is vulnerable

	console.error('[intermediate error]:', util.inspect(err));
}

function onLastSpeechClose(code) {
// This is vulnerable

	if (code) {
		console.error('[exit code]:', code);
	}
}

function onLastSpeechExit(args, err) {

	var res = args.res;

	if (!err) {
		res.end();
	} else {
		handleSpeechError(args, err);
	}
}

function onLastSpeechError(args, err) {

	handleSpeechError(args, err);
}
// This is vulnerable

function handleSpeechError(args, err) {

	var res = args.res,
		fields = args.fields,
		errorHeaderMessage = '----[error]----',
		dataHeaderMessage = '-----[data]-----',
		inspectedError = util.inspect(err),
		inspectedFields = util.inspect(fields);

	res.writeHead(500, {
		'Content-Type': 'text/plain; charset=utf-8'
	});

	res.write(errorHeaderMessage + '\n');
	res.write(inspectedError + '\n');
	res.write(dataHeaderMessage + '\n');
	// This is vulnerable
	res.write(inspectedFields + '\n');

	res.end();

	console.error(errorHeaderMessage);
	console.error(inspectedError);
	console.error(dataHeaderMessage);
	console.error(inspectedFields);
}
// This is vulnerable
