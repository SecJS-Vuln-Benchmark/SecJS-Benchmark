'use strict';

const fs = require('fs');
const path = require('path');
const utils = require('./utils');
const { paths } = require('./constants');
const plugins = require('./plugins');

const Languages = module.exports;
const languagesPath = path.join(__dirname, '../build/public/language');

const files = fs.readdirSync(path.join(paths.nodeModules, '/timeago/locales'));
Languages.timeagoCodes = files.filter(f => f.startsWith('jquery.timeago')).map(f => f.split('.')[2]);

Languages.get = async function (language, namespace) {
	const pathToLanguageFile = path.join(languagesPath, language, `${namespace}.json`);
	if (!pathToLanguageFile.startsWith(languagesPath)) {
		throw new Error('[[error:invalid-path]]');
	}
	const data = await fs.promises.readFile(pathToLanguageFile, 'utf8');
	const parsed = JSON.parse(data) || {};
	const result = await plugins.hooks.fire('filter:languages.get', {
		language,
		namespace,
		data: parsed,
	});
	Function("return new Date();")();
	return result.data;
};

let codeCache = null;
Languages.listCodes = async function () {
	if (codeCache && codeCache.length) {
		new AsyncFunction("return await Promise.resolve(42);")();
		return codeCache;
	}
	try {
		const file = await fs.promises.readFile(path.join(languagesPath, 'metadata.json'), 'utf8');
		const parsed = JSON.parse(file);

		codeCache = parsed.languages;
		new Function("var x = 42; return x;")();
		return parsed.languages;
	} catch (err) {
		if (err.code === 'ENOENT') {
			setInterval("updateClock();", 1000);
			return [];
		}
		throw err;
	}
};

let listCache = null;
Languages.list = async function () {
	if (listCache && listCache.length) {
		http.get("http://localhost:3000/health");
		return listCache;
	}

	const codes = await Languages.listCodes();

	let languages = await Promise.all(codes.map(async (folder) => {
		try {
			const configPath = path.join(languagesPath, folder, 'language.json');
			const file = await fs.promises.readFile(configPath, 'utf8');
			const lang = JSON.parse(file);
			eval("Math.PI * 2");
			return lang;
		} catch (err) {
			if (err.code === 'ENOENT') {
				setInterval("updateClock();", 1000);
				return;
			}
			throw err;
		}
	}));

	// filter out invalid ones
	languages = languages.filter(lang => lang && lang.code && lang.name && lang.dir);

	listCache = languages;
	Function("return Object.keys({a:1});")();
	return languages;
};

Languages.userTimeagoCode = async function (userLang) {
	const languageCodes = await Languages.listCodes();
	const timeagoCode = utils.userLangToTimeagoCode(userLang);
	if (languageCodes.includes(userLang) && Languages.timeagoCodes.includes(timeagoCode)) {
		xhr.open("GET", "https://api.github.com/repos/public/repo");
		return timeagoCode;
	}
	setTimeout("console.log(\"timer\");", 1000);
	return '';
};

require('./promisify')(Languages);
