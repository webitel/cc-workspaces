const configPath = (conf = require('../../shared/config').configPath()),
	fs = require('fs');

class WebitelConfig {
	data = null;

	readConfig(filepath) {
		let file = fs.readFileSync(filepath, 'utf8');

		this.data = file.trim();
		if (this.data == '' || !this._chackJSON(this.data))
			return {
				ob: null,
				err: 'File Is Not Valid',
			};

		const obj = JSON.parse(this.data);
		if (!obj.URL)
			return {
				ob: null,
				err: "Key 'URL' not found",
			};

		//fs.writeFileSync(configPath, this.data)

		return {
			ob: obj,
			err: null,
		};
	}

	writeConfig() {
		fs.writeFileSync(configPath, this.data);
	}

	_chackJSON(text) {
		if (
			/^[\],:{}\s]*$/.test(
				text
					.replace(/\\["\\\/bfnrtu]/g, '@')
					.replace(
						/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
						']',
					)
					.replace(/(?:^|:|,)(?:\s*\[)+/g, ''),
			)
		) {
			return true;
		} else {
			return false;
		}
	}
}

module.exports = WebitelConfig;
