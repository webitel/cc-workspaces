import isElectron from 'is-electron';
import { RECORDER_VERSION } from '../config';
import { sanitize } from '../sanitize';
import type { RecordFn } from '../types';

type NetworkInformation = EventTarget & {
	effectiveType?: string;
	rtt?: number;
	downlink?: number;
	saveData?: boolean;
	type?: string;
};

type NavigatorExtras = Navigator & {
	connection?: NetworkInformation;
	deviceMemory?: number;
	userAgentData?: {
		brands: unknown;
		mobile: boolean;
		platform: string;
		getHighEntropyValues(hints: string[]): Promise<Record<string, unknown>>;
	};
};

function connectionInfo(connection?: NetworkInformation) {
	return connection
		? {
				effectiveType: connection.effectiveType,
				type: connection.type,
				rtt: connection.rtt,
				downlink: connection.downlink,
				saveData: connection.saveData,
			}
		: undefined;
}

/** one-off snapshot of the browser and app, plus network-type changes */
export function collectEnvironment(record: RecordFn): void {
	const nav = navigator as NavigatorExtras;
	record('env', 'snapshot', {
		recorder: RECORDER_VERSION,
		app: __APP_VERSION__,
		origin: location.origin,
		path: location.pathname,
		electron: isElectron(),
		standalone: window.matchMedia?.('(display-mode: standalone)').matches,
		userAgent: nav.userAgent,
		languages: nav.languages,
		timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
		screen: {
			width: screen.width,
			height: screen.height,
			dpr: window.devicePixelRatio,
		},
		hardwareConcurrency: nav.hardwareConcurrency,
		deviceMemory: nav.deviceMemory,
		online: nav.onLine,
		secureContext: window.isSecureContext,
		connection: connectionInfo(nav.connection),
	});

	nav.userAgentData
		?.getHighEntropyValues([
			'architecture',
			'platformVersion',
			'fullVersionList',
		])
		.then((values) => record('env', 'ua-data', sanitize(values)))
		.catch(() => {});

	navigator.storage
		?.estimate?.()
		.then((estimate) =>
			record('env', 'storage', {
				usage: estimate.usage,
				quota: estimate.quota,
			}),
		)
		.catch(() => {});

	nav.connection?.addEventListener('change', () =>
		record('env', 'connection', connectionInfo(nav.connection)),
	);
}
