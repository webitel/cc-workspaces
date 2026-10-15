import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { useStore } from 'vuex';

import { useUserinfoStore } from '../../../../ui/modules/userinfo/userinfoStore';

export const useLeaveGuardStore = defineStore('leaveGuard', () => {
	const vuexStore = useStore();
	const userinfoStore = useUserinfoStore();

	const isLeaving = ref(false);

	const isOnline = computed(
		() => vuexStore.getters['features/status/IS_AGENT_ONLINE'],
	);

	const hasActiveTask = computed(
		() =>
			vuexStore.state.features.call.callList.length > 0 ||
			vuexStore.state.features.job.jobList.length > 0 ||
			vuexStore.getters['features/chat/active/ALL_CHAT_LIST'].length > 0,
	);

	const hasPostProcessing = computed(
		() =>
			vuexStore.getters['features/chat/postProcessing/CHATS_IN_POSTPROCESSING']
				.length > 0,
	);

	const shouldConfirmLeave = computed(
		() =>
			!isLeaving.value &&
			(isOnline.value || hasActiveTask.value || hasPostProcessing.value),
	);

	const handleLeaveAttempt = (event: BeforeUnloadEvent) => {
		if (!shouldConfirmLeave.value) return;
		event.preventDefault();
		event.returnValue = '';
	};

	const logout = async () => {
		isLeaving.value = true;
		try {
			await userinfoStore.logoutUser();
		} catch (err) {
			isLeaving.value = false;
			throw err;
		}
	};

	return {
		isLeaving,
		isOnline,
		hasActiveTask,
		hasPostProcessing,
		shouldConfirmLeave,
		handleLeaveAttempt,
		logout,
	};
});
