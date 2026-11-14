/**
 * @author r.zaritskyi
 *
 * Turns TLS certificate verification off for the whole process when
 * `insecure: true` is set in config.json. Off by default: a self-signed
 * certificate belongs in the OS trust store.
 */
function applyInsecureTlsSwitches(conf, commandLine) {
	if (!conf.insecure) return;

	commandLine.appendSwitch('ignore-certificate-errors', 'true');
	commandLine.appendSwitch('allow-insecure-localhost', 'true');
}

module.exports = {
	applyInsecureTlsSwitches,
};
