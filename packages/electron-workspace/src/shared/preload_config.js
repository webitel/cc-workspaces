const path = require('path');
const fs = require('fs');
require('dotenv').config({
	path: path.resolve(process.cwd(), '.env.local'),
});

const { ipcRenderer } = require('electron');
let userDataPath;

ipcRenderer.invoke('get-userData-path').then((result) => getConf(result));

function getConf(data) {
	userDataPath = data;
}

const CONFIG_FILE = 'config.json';
const STORAGE_FILE = 'storage.json';
const LOGS_FOLDER = 'SipLogs';
const DEFAULT_WORKSPACE_URL =
	process.env.WEBITEL_WORKSPACE_URL || 'https://example.webitel.com/workspace/';

let _conf = null;

const DEFAULT_CONFIG = JSON.stringify({
	URL: DEFAULT_WORKSPACE_URL,
	openUrlOnAnswer: 'link',
	useSIP: true,
	codecs: [
		'opus/48000/2',
		'G722/16000/1',
		'PCMA/8000/1',
		'PCMU/8000/1',
	],
	timeoutSIP: '90',
	hidePostProcessing: false,
	debugMode: false,
	showNumber: true,
});

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
		fs.writeFileSync(p, DEFAULT_CONFIG);
		return DEFAULT_CONFIG;
	}
};

const configPath = () => {
	return path.join(userDataPath, CONFIG_FILE);
};

const storagePath = () => {
	return path.join(userDataPath, STORAGE_FILE);
};

module.exports = {
	config,
	configPath,
	storagePath,
};
