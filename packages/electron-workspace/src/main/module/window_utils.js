// A destroyed BrowserWindow is still truthy, and callNotification inits
// `window = {}` (no isDestroyed method) — plain truthy checks are not enough.
const isAlive = (win) =>
	Boolean(win && typeof win.isDestroyed === 'function' && !win.isDestroyed());

module.exports = {
	isAlive,
};
