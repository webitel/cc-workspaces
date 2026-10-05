/**
 * How the external-softphone mode is chosen for a client generation:
 * - 'auto' (default, `enabled` absent): probe ws://127.0.0.1:<port> at client
 *   creation — a running utility (packages/electron-softphone-companion)
 *   switches the browser to control-only mode, otherwise the web phone is
 *   used as usual;
 * - 'forced' (`enabled: true`): always external, never register a web device
 *   (the manager keeps probing for the utility with backoff);
 * - 'disabled' (`enabled: false`): never probe, always the web phone.
 *
 * Configured via CONFIG.CLI.externalSoftphone (public/config.json or the
 * per-user phone settings merge in main.ts).
 */
export type ExternalSoftphoneMode = 'auto' | 'forced' | 'disabled';

export interface ExternalSoftphoneConfig {
	mode: ExternalSoftphoneMode;
	port: number;
}

export const EXTERNAL_SOFTPHONE_DEFAULT_PORT = 10029;

export function getExternalSoftphoneConfig(): ExternalSoftphoneConfig {
	const fallback: ExternalSoftphoneConfig = {
		mode: 'auto',
		port: EXTERNAL_SOFTPHONE_DEFAULT_PORT,
	};
	try {
		const configStr = localStorage.getItem('CONFIG');
		if (!configStr) return fallback;
		const parsedConfig = JSON.parse(configStr) as {
			CLI?: {
				externalSoftphone?: {
					enabled?: boolean;
					port?: number;
				};
			};
		};
		const externalSoftphone = parsedConfig.CLI?.externalSoftphone;
		const mode: ExternalSoftphoneMode =
			externalSoftphone?.enabled === true
				? 'forced'
				: externalSoftphone?.enabled === false
					? 'disabled'
					: 'auto';
		return {
			mode,
			port: Number(externalSoftphone?.port) || EXTERNAL_SOFTPHONE_DEFAULT_PORT,
		};
	} catch {
		return fallback;
	}
}
