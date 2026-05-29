const LStorage = require('../localStore');
const langs = {
	en: require('./en.json'),
	ru: require('./ru.json'),
	uk: require('./uk.json'),
};
let loadedLanguage;

module.exports = i18n;

function i18n() {
	const lang = new LStorage().getLang();
	loadedLanguage = langs[lang] || langs.en;
}

i18n.prototype.__ = (ob, phrase) => {
	let translation = loadedLanguage[ob][phrase];
	if (translation === undefined) {
		translation = phrase;
	}
	return translation;
};
