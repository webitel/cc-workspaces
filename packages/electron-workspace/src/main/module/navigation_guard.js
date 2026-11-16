const { originOf } = require('./url_utils');

// the main frame keeps Node integration, so another origin there would get require
function guardMainFrameNavigation(webContents, getAllowedOrigin) {
	const denyForeignNavigation = (details) => {
		if (!details.isMainFrame) return;

		const allowedOrigin = getAllowedOrigin();
		if (allowedOrigin && originOf(details.url) === allowedOrigin) return;

		details.preventDefault();
		console.warn('[workspace] blocked navigation to', details.url);
	};

	webContents.on('will-navigate', denyForeignNavigation);
	webContents.on('will-redirect', denyForeignNavigation);
}

module.exports = {
	guardMainFrameNavigation,
};
