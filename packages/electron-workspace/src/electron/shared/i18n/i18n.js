const path = require('path');
const LStorage = require('../localStore');
const fs = require('fs');
let loadedLanguage;

module.exports = i18n;

function i18n() {
	if (fs.existsSync(path.join(__dirname, new LStorage().getLang() + '.json'))) {
		loadedLanguage = JSON.parse(
			fs.readFileSync(
				path.join(__dirname, new LStorage().getLang() + '.json'),
				'utf8',
			),
		);
	} else {
		loadedLanguage = JSON.parse(
			fs.readFileSync(path.join(__dirname, 'en.json'), 'utf8'),
		);
	}
}

i18n.prototype.__ = function (ob, phrase) {
	let translation = loadedLanguage[ob][phrase];
	if (translation === undefined) {
		translation = phrase;
	}
	return translation;
};
