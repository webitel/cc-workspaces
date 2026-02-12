import isElectron from 'is-electron';
import prependHttp from 'prepend-http';

const openLinkFromVariable = (task) => {
	if (!task.variables?.link) return false;
	if (isElectron()) return false;
	return setTimeout(
		() => window.open(prependHttp(task.variables.link), '_blank'),
		task.variables.link_open_timeout_sec * 1000 || 0,
	);
};

export default openLinkFromVariable;
