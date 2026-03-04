import { eventBus } from '@webitel/ui-sdk/scripts';
import i18n from '../../../locale/i18n';
import {
	CONNECTION_QUALITY_LEVELS,
	CONNECTION_QUALITY_LEVELS_TYPE,
} from '../../../../features/types/connection-quality-level.enum';
import { useStore } from 'vuex';
import type { Client } from 'webitel-sdk';

type RtpMetricStats = {
	average: number;
};

type RtpMetrics = {
	jitter?: RtpMetricStats;
	packetloss?: RtpMetricStats;
	mos?: RtpMetricStats;
	roundtrip?: RtpMetricStats;
};

const LATENCY_REFRESH_DELAY = 5000;

let storeRef: ReturnType<typeof useStore> | null = null;

export const useWebSocketLatency = () => {
	let latencyIntervalId: number | null = null;

	const startLatencyTracking = (cli: Client) => {
		const store = useStore();
		storeRef = store;
		if (latencyIntervalId) {
			window.clearInterval(latencyIntervalId);
		}

		latencyIntervalId = window.setInterval(async () => {
			try {
				const latency = await cli.latency();

				await store.commit('features/connectionQuality/SET', {
					path: 'latency',
					value: latency,
				});

				const latencyLevel =
					store.getters['features/connectionQuality/LATENCY_LEVEL'];

				if (latencyLevel === CONNECTION_QUALITY_LEVELS.Low) {
					eventBus.$emit('notification', {
						type: 'error',
						text: i18n.global.t(
							`header.connectionQuality.${CONNECTION_QUALITY_LEVELS.Low}`,
						),
					});
				} else if (latencyLevel === CONNECTION_QUALITY_LEVELS.Medium) {
					eventBus.$emit('notification', {
						type: 'warning',
						text: i18n.global.t(
							`header.connectionQuality.${CONNECTION_QUALITY_LEVELS.Medium}`,
						),
					});
				}
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
		level: CONNECTION_QUALITY_LEVELS_TYPE;
		reasons: string[];
	} => {
		if (!rtp) {
			return {
				level: CONNECTION_QUALITY_LEVELS.High,
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

		let level: CONNECTION_QUALITY_LEVELS_TYPE | null =
			CONNECTION_QUALITY_LEVELS.High;
		const reasons: string[] = [];

		const setLevel = (next: CONNECTION_QUALITY_LEVELS_TYPE) => {
			level = next;
		};

		if (jitterAvg > 50) {
			setLevel(CONNECTION_QUALITY_LEVELS.Low);
			reasons.push(`jitter ${Math.round(jitterAvg)} ms (> 50)`);
		} else if (jitterAvg >= 30) {
			setLevel(CONNECTION_QUALITY_LEVELS.Medium);
			reasons.push(`jitter ${Math.round(jitterAvg)} ms (30–50)`);
		}

		if (packetLossAvg > 3) {
			setLevel(CONNECTION_QUALITY_LEVELS.Low);
			reasons.push(`packet loss ${packetLossAvg.toFixed(1)} % (> 3%)`);
		} else if (packetLossAvg >= 1) {
			setLevel(CONNECTION_QUALITY_LEVELS.Medium);
			reasons.push(`packet loss ${packetLossAvg.toFixed(1)} % (1–3%)`);
		}

		if (mosAvg < 3.5) {
			setLevel(CONNECTION_QUALITY_LEVELS.Low);
			reasons.push(`MOS ${mosAvg.toFixed(2)} (< 3.5)`);
		} else if (mosAvg < 4.0) {
			setLevel(CONNECTION_QUALITY_LEVELS.Medium);
			reasons.push(`MOS ${mosAvg.toFixed(2)} (3.5–4.0)`);
		}

		if (level && level === CONNECTION_QUALITY_LEVELS.Low) {
			eventBus.$emit('notification', {
				type: 'error',
				text: i18n.global.t(
					`notifications.connectionQuality.${CONNECTION_QUALITY_LEVELS.Low}`,
				),
				timeout: 8000,
			});
		} else if (level && level === CONNECTION_QUALITY_LEVELS.Medium) {
			eventBus.$emit('notification', {
				type: 'warning',
				text: i18n.global.t(
					`notifications.connectionQuality.${CONNECTION_QUALITY_LEVELS.Medium}`,
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
