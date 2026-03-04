import { eventBus } from '@webitel/ui-sdk/scripts';
import i18n from '../../../locale/i18n';
import {
	ConnectionQualityLevels,
	ConnectionQualityLevelsType,
} from '../../../../features/types/ConnectionQualityLevel.enum';
import { useStore } from 'vuex';
import type { Client, RtpMetrics } from 'webitel-sdk';

const LATENCY_REFRESH_DELAY = 5000;

let storeRef: ReturnType<typeof useStore> | null = null;
let latencyIntervalId: number | null = null;

export const useWebSocketLatency = () => {
	const startLatencyTracking = (cli: Client) => {
		const store = useStore();
		storeRef = store;
		if (latencyIntervalId) {
			console.warn('[WS]: latency tracking already started');
			return;
		}

		latencyIntervalId = window.setInterval(async () => {
			try {
				const latency = await cli.latency();

				await store.commit('features/connectionQuality/SET', {
					path: 'latency',
					value: latency,
				});
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

		/**
		 * @author @OleksandrPalonnyi
		 *
		 * [WTEL-8733](https://webitel.atlassian.net/browse/WTEL-8733)
		 *
		 * @description We can't call useStore() here (no Vue instance in ws callback),
		 * so we reuse the store captured in startLatencyTracking via storeRef to avoid errors.
		 */

		if (storeRef) {
			storeRef.commit('features/connectionQuality/SET', {
				path: 'rtp',
				value: rtp,
			});
		}

		const jitterAvg = rtp.jitter?.average ?? 0;
		const packetLossAvg = rtp.packetloss?.average ?? 0;
		const mosAvg = rtp.mos?.average ?? 5;

		let level: ConnectionQualityLevelsType | null =
			ConnectionQualityLevels.High;
		const reasons: string[] = [];

		const setLevel = (next: ConnectionQualityLevelsType) => {
			level = next;
		};

		if (jitterAvg > 50) {
			setLevel(ConnectionQualityLevels.Low);
			reasons.push(`jitter ${Math.round(jitterAvg)} ms (> 50)`);
		} else if (jitterAvg >= 30) {
			setLevel(ConnectionQualityLevels.Medium);
			reasons.push(`jitter ${Math.round(jitterAvg)} ms (30–50)`);
		}

		if (packetLossAvg > 3) {
			setLevel(ConnectionQualityLevels.Low);
			reasons.push(`packet loss ${packetLossAvg.toFixed(1)} % (> 3%)`);
		} else if (packetLossAvg >= 1) {
			setLevel(ConnectionQualityLevels.Medium);
			reasons.push(`packet loss ${packetLossAvg.toFixed(1)} % (1–3%)`);
		}

		if (mosAvg < 3.5) {
			setLevel(ConnectionQualityLevels.Low);
			reasons.push(`MOS ${mosAvg.toFixed(2)} (< 3.5)`);
		} else if (mosAvg < 4.0) {
			setLevel(ConnectionQualityLevels.Medium);
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
