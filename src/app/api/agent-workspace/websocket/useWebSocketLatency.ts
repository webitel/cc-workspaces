import {
	ConnectionQualityLevels,
	type ConnectionQualityLevelsType,
} from '@webitel/ui-sdk/enums';
import { eventBus, getConnectionQuality } from '@webitel/ui-sdk/scripts';
import type { Store } from 'vuex';
import type { Client, RtpMetrics } from 'webitel-sdk';
import i18n from '../../../locale/i18n';

const LATENCY_REFRESH_DELAY = 5000;

let latencyIntervalId: number | null = null;

/**
 * @author @OleksandrPalonnyi
 *
 * [WTEL-8733](https://webitel.atlassian.net/browse/WTEL-8733), [WTEL-9842](https://webitel.atlassian.net/browse/WTEL-9842)
 *
 * @description `useStore()` needs a component `setup()` context, which these
 * callbacks don't have. `store/index.js` registers the store once instead.
 */
let storeRef: Store<unknown> | null = null;

export function registerWebSocketStore(store: Store<unknown>): void {
	storeRef = store;
}

function commitConnectionQuality(path: 'latency' | 'rtp', value: unknown) {
	if (!storeRef) {
		console.error(
			'[WS] connection quality store is not initialized — ' +
				'registerWebSocketStore() must be called before the websocket client connects',
		);
		return;
	}

	storeRef.commit('features/connectionQuality/SET', {
		path,
		value,
	});
}

export const useWebSocketLatency = () => {
	const startLatencyTracking = (cli: Client) => {
		if (latencyIntervalId) {
			console.warn('[WS]: latency tracking already started');
			return;
		}

		latencyIntervalId = window.setInterval(async () => {
			try {
				const latency = await cli.latency();

				commitConnectionQuality('latency', latency);
			} catch (e) {
				console.warn('[WS] latency error', e);
			}
		}, LATENCY_REFRESH_DELAY);
	};

	const stopLatencyTracking = () => {
		if (latencyIntervalId) {
			window.clearInterval(latencyIntervalId);
			latencyIntervalId = null;
		}
	};

	const websocketRtpConnectionLevelHandler = (
		rtp: RtpMetrics | null | undefined,
	): {
		level: ConnectionQualityLevelsType;
		reasons: string[];
	} => {
		if (!rtp) {
			return {
				level: ConnectionQualityLevels.High,
				reasons: [],
			};
		}

		commitConnectionQuality('rtp', rtp);

		const jitterAvg = rtp.jitter?.average ?? 0;
		const packetLossAvg = rtp.packetloss?.average ?? 0;
		const mosAvg = rtp.mos?.average ?? 5;

		let level: ConnectionQualityLevelsType | null =
			ConnectionQualityLevels.High;
		const reasons: string[] = [];

		if (jitterAvg > 50) {
			level = ConnectionQualityLevels.Low;
			reasons.push(`jitter ${Math.round(jitterAvg)} ms (> 50)`);
		} else if (jitterAvg >= 30) {
			level = ConnectionQualityLevels.Medium;
			reasons.push(`jitter ${Math.round(jitterAvg)} ms (30–50)`);
		}

		if (packetLossAvg > 3) {
			level = ConnectionQualityLevels.Low;
			reasons.push(`packet loss ${packetLossAvg.toFixed(1)} % (> 3%)`);
		} else if (packetLossAvg > 1) {
			level = ConnectionQualityLevels.Medium;
			reasons.push(`packet loss ${packetLossAvg.toFixed(1)} % (1–3%)`);
		}

		const mosLevel = getConnectionQuality(mosAvg);

		if (mosLevel === ConnectionQualityLevels.Low) {
			level = ConnectionQualityLevels.Low;
			reasons.push(`MOS ${mosAvg.toFixed(2)} (< 3.5)`);
		} else if (mosLevel === ConnectionQualityLevels.Medium) {
			level = ConnectionQualityLevels.Medium;
			reasons.push(`MOS ${mosAvg.toFixed(2)} (3.5–4.0)`);
		}

		if (level && level === ConnectionQualityLevels.Low) {
			eventBus.$emit('notification', {
				type: 'error',
				text: i18n.global.t(
					`notifications.connectionQuality.${ConnectionQualityLevels.Low}`,
				),
				timeout: 8000,
			});
		} else if (level && level === ConnectionQualityLevels.Medium) {
			eventBus.$emit('notification', {
				type: 'warning',
				text: i18n.global.t(
					`notifications.connectionQuality.${ConnectionQualityLevels.Medium}`,
				),
				timeout: 8000,
			});
		}

		return {
			level,
			reasons,
		};
	};

	return {
		startLatencyTracking,
		stopLatencyTracking,
		websocketRtpConnectionLevelHandler,
	};
};
