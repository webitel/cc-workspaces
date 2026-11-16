const { originOf } = require('./url_utils');

// the main frame keeps Node integration across navigation, so another
// origin loaded into it would get `require`. Iframes (knowledge base,
// processing forms) have no Node and stay free to navigate; guard them
// too if `nodeIntegrationInSubFrames` is ever turned on. `loadURL`
// from the main process raises no navigation event.
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
