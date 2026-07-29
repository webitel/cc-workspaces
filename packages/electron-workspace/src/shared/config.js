const path = require('path');
const fs = require('fs');
require('dotenv').config({
	path: path.resolve(process.cwd(), '.env.local'),
});

const { app } = require('electron');
const userDataPath = app.getPath('userData');

const CONFIG_FILE = 'config.json';
const STORAGE_FILE = 'storage.json';
const LOGS_FOLDER = 'SipLogs';
const DEFAULT_WORKSPACE_URL =
	process.env.WEBITEL_WORKSPACE_URL || 'https://example.webitel.com/workspace/';

let _conf = null;

const DEFAULT_CONFIG = {
	// URL: DEFAULT_WORKSPACE_URL, // note! should not be present in the default config
	openUrlOnAnswer: 'link',
	useSIP: true,
	codecs: [
		'opus/48000/2',
		'G722/16000/1',
		'PCMA/8000/1',
		'PCMU/8000/1',
	],
	timeoutSIP: '90',
	debugMode: false,
	showNumber: true,
	openAtLogin: false,
};

const config = () => {
	if (_conf) return _conf;

	if (!fs.existsSync(path.join(userDataPath, LOGS_FOLDER))) {
		fs.mkdirSync(path.join(userDataPath, LOGS_FOLDER));
	}
	const p = configPath();
	console.error('path: ' + p);
	if (fs.existsSync(p)) {
		_conf = require(configPath());
		return _conf;
	} else {
		_conf = {
			...DEFAULT_CONFIG,
		};
		fs.writeFileSync(p, JSON.stringify(_conf, null, '\t'));
		return _conf;
	}
};

const updateConfig = (partial) => {
	const current = config();
	_conf = {
		...current,
		...partial,
	};
	fs.writeFileSync(configPath(), JSON.stringify(_conf, null, '\t'));
	return _conf;
};

const configPath = () => {
	return path.join(userDataPath, CONFIG_FILE);
};

const storagePath = () => {
	return path.join(userDataPath, STORAGE_FILE);
};

module.exports = {
	config,
	updateConfig,
	configPath,
	storagePath,
};
