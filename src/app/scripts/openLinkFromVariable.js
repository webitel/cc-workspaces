import isElectron from 'is-electron';
import prependHttp from 'prepend-http';

const openLinkFromVariable = (task) => {
	if (!task.variables?.link) return false;
	if (isElectron()) return false;
	return setTimeout(
		() => {
			let parsed;
			try {
				parsed = new URL(prependHttp(task.variables.link));
			} catch {
				return;
			}
			if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return;
			window.open(parsed.toString(), '_blank', 'noopener,noreferrer');
		},
		task.variables.link_open_timeout_sec * 1000 || 0,
	);
};

export default openLinkFromVariable;
