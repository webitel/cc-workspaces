const storage = require('electron-localstorage');
const { ipcRenderer } = require('electron');
// const storagePath = require('./config').storagePath()

class LStorage {
	constructor() {
		let storagePath = '';
		if (ipcRenderer) {
			storagePath = ipcRenderer.invoke('get-localStore');
		} else {
			storagePath = require('./config').storagePath();
		}
		storage.setStoragePath(storagePath);
	}

	getLang() {
		return storage.getItem(`lang`);
	}

	setLang(lang) {
		storage.setItem(`lang`, lang);
	}

	getSIP() {
		return storage.config.useSIP; //storage.getItem(`useSIP`)
	}

	setSIP(value) {
		storage.setItem(`useSIP`, value);
	}
}

module.exports = LStorage;
