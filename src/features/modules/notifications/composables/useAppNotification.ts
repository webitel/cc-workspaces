import { computed, watch } from 'vue';
import { useStore } from 'vuex';

// ATTENTION! Composable must be used in the-agent-workspace to correctly notify new call ringing!
// This composable is needed for watcher to watch ringing; it is not possible to watch inside store

export const useAppNotification = () => {
	const store = useStore();

	const isAnyRinging = computed(
		() => store.getters['features/call/IS_ANY_RINGING'],
	);
	const isHangupSoundAllowed = computed(
		() => store.state.features.notifications.isHangupSoundAllowed,
	);

	const stopPlaying = () => store.dispatch('features/notifications/STOP_SOUND');
	const changeHangupSoundAllowance = (value: boolean) =>
		store.dispatch('features/notifications/HANDLE_HANGUP_SOUND_ALLOW', value);
	const playRinging = () =>
		store.dispatch('features/callNotifications/HANDLE_ANY_CALL_RINGING');

	watch(isAnyRinging, (value) => {
		if (value) {
			playRinging();
		} else {
			// need prevent stopPlaying() if we want play hangup sound after call end
			if (isHangupSoundAllowed.value) {
				changeHangupSoundAllowance(false); // must turn back isHangupSoundAllowed state in default value
			} else {
				stopPlaying();
			}
		}
	});

	return {
		isAnyRinging,
		isHangupSoundAllowed,
		stopPlaying,
		changeHangupSoundAllowance,
		playRinging,
	};
};
