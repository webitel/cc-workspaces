import {
	BroadcastChannelName,
	type UserSettingsBroadcastMessage,
} from '@webitel/ui-sdk/enums';
import { onMounted, onUnmounted } from 'vue';
import { useWebSocketClient } from '../api/agent-workspace/websocket/useWebSocketClient';

type AudioProcessingSettings = {
	echoCancellation?: boolean;
	noiseSuppression?: boolean;
	autoGainControl?: boolean;
};

export function useAudioProcessingSync() {
	const { getCliInstance } = useWebSocketClient();

	let channel: BroadcastChannel | null = null;

	function persistToConfig(settings: AudioProcessingSettings) {
		try {
			const rawCongig = localStorage.getItem('CONFIG');
			const config = rawCongig ? JSON.parse(rawCongig) : {};
			config.CLI = {
				...(config.CLI ?? {}),
				...settings,
			};
			localStorage.setItem('CONFIG', JSON.stringify(config));
		} catch {}
	}

	async function applyWebphoneSettings(settings: AudioProcessingSettings) {
		try {
			persistToConfig(settings);
			const cli = await getCliInstance();
			cli.updateAudioProcessing(settings);
		} catch (err) {
			console.error('[audio-processing-sync] failed', err);
		}
	}

	function onMessage({ data }: MessageEvent<UserSettingsBroadcastMessage>) {
		if (data?.type !== 'webphone') return;
		const { echoCancellation, noiseSuppression, autoGainControl } =
			data.payload;
		applyWebphoneSettings({
			echoCancellation,
			noiseSuppression,
			autoGainControl,
		});
	}

	onMounted(() => {
		channel = new BroadcastChannel(BroadcastChannelName.UserSettings);
		channel.addEventListener('message', onMessage);
	});

	onUnmounted(() => {
		channel?.removeEventListener('message', onMessage);
		channel?.close();
		channel = null;
	});
}
