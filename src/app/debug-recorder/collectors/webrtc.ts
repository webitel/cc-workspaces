import { WEBRTC_STATS_INTERVAL_MS } from '../config';
import { sanitize, sanitizeRtcConfig } from '../sanitize';
import type { RecordFn } from '../types';

const TAPPED = Symbol.for('wt-debug-recorder.tapped');

const RTP_TYPES = new Set([
	'inbound-rtp',
	'outbound-rtp',
	'remote-inbound-rtp',
	'remote-outbound-rtp',
	'media-source',
	'transport',
]);

type Stat = RTCStats & Record<string, unknown>;

// call-quality subset: RTP, transport, the selected candidate pair with its candidates, codecs in use
export function pickStats(report: RTCStatsReport): Stat[] {
	const all = new Map<string, Stat>();
	report.forEach((stat) => {
		all.set(stat.id, stat as Stat);
	});

	const picked = new Map<string, Stat>();
	let selectedPairId: string | undefined;
	for (const stat of all.values()) {
		if (RTP_TYPES.has(stat.type)) picked.set(stat.id, stat);
		if (stat.type === 'transport' && stat.selectedCandidatePairId) {
			selectedPairId = stat.selectedCandidatePairId as string;
		}
	}
	// Firefox has no transport stat: fall back to the nominated succeeded pair
	if (!selectedPairId) {
		for (const stat of all.values()) {
			if (
				stat.type === 'candidate-pair' &&
				(stat.selected || (stat.nominated && stat.state === 'succeeded'))
			) {
				selectedPairId = stat.id;
				break;
			}
		}
	}
	const pair = selectedPairId ? all.get(selectedPairId) : undefined;
	if (pair) {
		picked.set(pair.id, pair);
		for (const key of [
			'localCandidateId',
			'remoteCandidateId',
		]) {
			const candidate = all.get(pair[key] as string);
			if (candidate) picked.set(candidate.id, candidate);
		}
	}
	for (const stat of [
		...picked.values(),
	]) {
		const codec = stat.codecId ? all.get(stat.codecId as string) : undefined;
		if (codec) picked.set(codec.id, codec);
	}
	return [
		...picked.values(),
	].map((stat) => ({
		...stat,
	}));
}

// polls getStats(); holds the connection weakly, so one dropped without close() can still be collected
function createStatsPoller(
	record: RecordFn,
	ref: WeakRef<RTCPeerConnection>,
	id: number,
) {
	let timer: ReturnType<typeof setInterval> | null = null;

	const stop = () => {
		if (timer) clearInterval(timer);
		timer = null;
	};

	const snapshot = async () => {
		const pc = ref.deref();
		if (
			!pc ||
			pc.signalingState === 'closed' ||
			pc.connectionState === 'closed'
		) {
			stop();
			record('webrtc', 'pc:closed', {
				id,
				collected: !pc || undefined,
			});
			return;
		}
		const started = performance.now();
		try {
			const report = await pc.getStats();
			record('webrtc', 'pc:stats', {
				id,
				costMs: Math.round((performance.now() - started) * 10) / 10,
				stats: sanitize(pickStats(report), {
					maxDepth: 3,
				}),
			});
		} catch (err) {
			record('webrtc', 'pc:stats-error', {
				id,
				error: sanitize(err),
			});
		}
	};

	return {
		start() {
			timer ??= setInterval(snapshot, WEBRTC_STATS_INTERVAL_MS);
		},
		async stopAfterSnapshot() {
			stop();
			await snapshot();
		},
	};
}

// global RTCPeerConnection subclass: state changes, ICE errors, getStats polling (JsSIP and webrtc2 use the global)
export function installWebRtcCollector(
	record: RecordFn,
	target: {
		RTCPeerConnection: typeof RTCPeerConnection;
	},
): void {
	const Native = target.RTCPeerConnection;
	if (!Native || (Native as unknown as Record<symbol, boolean>)[TAPPED]) return;
	let nextId = 0;

	class RecordedPeerConnection extends Native {
		static [TAPPED] = true;

		constructor(configuration?: RTCConfiguration, ...legacy: unknown[]) {
			// JsSIP still passes legacy rtcConstraints as a second argument
			super(
				...([
					configuration,
					...legacy,
				] as [
					RTCConfiguration,
				]),
			);
			const id = ++nextId;
			record('webrtc', 'pc:create', {
				id,
				config: sanitizeRtcConfig(configuration),
			});

			const states = {
				connectionstatechange: () => this.connectionState,
				iceconnectionstatechange: () => this.iceConnectionState,
				icegatheringstatechange: () => this.iceGatheringState,
				signalingstatechange: () => this.signalingState,
			};
			for (const [event, read] of Object.entries(states)) {
				this.addEventListener(event, () =>
					record('webrtc', `pc:${event}`, {
						id,
						state: read(),
					}),
				);
			}
			this.addEventListener('icecandidateerror', (event) => {
				const e = event as RTCPeerConnectionIceErrorEvent;
				record('webrtc', 'pc:icecandidateerror', {
					id,
					errorCode: e.errorCode,
					errorText: e.errorText,
					url: e.url,
					address: e.address,
					port: e.port,
				});
			});
			this.addEventListener('track', (event) =>
				record('webrtc', 'pc:track', {
					id,
					kind: event.track.kind,
					trackId: event.track.id,
				}),
			);

			const poller = createStatsPoller(record, new WeakRef(this), id);
			poller.start();
			// a failed connection that is never closed must not be polled all shift
			this.addEventListener('connectionstatechange', () => {
				if (this.connectionState === 'failed') void poller.stopAfterSnapshot();
				else if (this.connectionState === 'connected') poller.start();
			});
		}
	}

	target.RTCPeerConnection = RecordedPeerConnection;
}
