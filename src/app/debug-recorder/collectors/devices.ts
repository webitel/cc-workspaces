import { sanitize } from '../sanitize';
import type { RecordFn } from '../types';

function describeTrack(track: MediaStreamTrack) {
	return {
		id: track.id,
		kind: track.kind,
		label: track.label,
		enabled: track.enabled,
		muted: track.muted,
		readyState: track.readyState,
		settings: track.getSettings?.(),
	};
}

function watchTrack(record: RecordFn, track: MediaStreamTrack) {
	for (const event of [
		'mute',
		'unmute',
		'ended',
	]) {
		track.addEventListener(event, () =>
			record('device', `track:${event}`, describeTrack(track)),
		);
	}
}

async function snapshotDevices(record: RecordFn, reason: string) {
	try {
		const devices = await navigator.mediaDevices.enumerateDevices();
		record('device', 'devices', {
			reason,
			// labels are empty until a getUserMedia permission is granted
			devices: devices.map((d) => ({
				kind: d.kind,
				label: d.label,
				deviceId: d.deviceId.slice(0, 8),
				groupId: d.groupId.slice(0, 8),
			})),
		});
	} catch (err) {
		record('device', 'devices-error', {
			reason,
			error: sanitize(err),
		});
	}
}

async function watchPermission(record: RecordFn, name: string) {
	try {
		const status = await navigator.permissions.query({
			name: name as PermissionName,
		});
		record('device', 'permission', {
			name,
			state: status.state,
		});
		status.addEventListener('change', () =>
			record('device', 'permission', {
				name,
				state: status.state,
				changed: true,
			}),
		);
	} catch {
		record('device', 'permission', {
			name,
			state: 'unsupported',
		});
	}
}

/** mic/camera permission, device list and changes, every getUserMedia call and its tracks */
export function installDeviceCollector(record: RecordFn): void {
	const media = navigator.mediaDevices;
	if (!media) {
		record('device', 'unavailable', {
			secureContext: window.isSecureContext,
		});
		return;
	}

	void snapshotDevices(record, 'start');
	media.addEventListener('devicechange', () =>
		snapshotDevices(record, 'devicechange'),
	);
	void watchPermission(record, 'microphone');
	void watchPermission(record, 'camera');

	const nativeGetUserMedia = media.getUserMedia.bind(media);
	media.getUserMedia = async (constraints?: MediaStreamConstraints) => {
		record('device', 'getUserMedia', {
			constraints: sanitize(constraints),
		});
		try {
			const stream = await nativeGetUserMedia(constraints);
			const tracks = stream.getTracks();
			for (const track of tracks) watchTrack(record, track);
			record('device', 'getUserMedia:ok', {
				tracks: tracks.map(describeTrack),
			});
			// labels become available only now
			void snapshotDevices(record, 'after-getUserMedia');
			return stream;
		} catch (err) {
			const e = err as DOMException & {
				constraint?: string;
			};
			record('device', 'getUserMedia:fail', {
				name: e?.name,
				message: e?.message,
				constraint: e?.constraint,
			});
			throw err;
		}
	};
}
