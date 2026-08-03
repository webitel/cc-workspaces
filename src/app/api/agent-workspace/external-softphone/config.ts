export interface ExternalSoftphoneConfig {
	enabled: boolean;
	port: number;
}

export const EXTERNAL_SOFTPHONE_DEFAULT_PORT = 10029;

/**
 * External softphone mode: the browser is control-only and a local Electron
 * utility (packages/electron-softphone) is the actual SIP endpoint.
 * Configured via CONFIG.CLI.externalSoftphone (public/config.json or the
 * per-user phone settings merge in main.ts).
 */
export function getExternalSoftphoneConfig(): ExternalSoftphoneConfig {
	const disabled = {
		enabled: false,
		port: EXTERNAL_SOFTPHONE_DEFAULT_PORT,
	};
	try {
		const configStr = localStorage.getItem('CONFIG');
		if (!configStr) return disabled;
		const parsedConfig = JSON.parse(configStr) as {
			CLI?: {
				externalSoftphone?: {
					enabled?: boolean;
					port?: number;
				};
			};
		};
		const externalSoftphone = parsedConfig.CLI?.externalSoftphone;
		if (!externalSoftphone?.enabled) return disabled;
		return {
			enabled: true,
			port: Number(externalSoftphone.port) || EXTERNAL_SOFTPHONE_DEFAULT_PORT,
		};
	} catch {
		return disabled;
	}
}

export function isExternalSoftphoneEnabled(): boolean {
	return getExternalSoftphoneConfig().enabled;
}
