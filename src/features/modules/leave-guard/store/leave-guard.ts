import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import { JobState } from 'webitel-sdk';

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

	const hasPostProcessing = () => {
		const client = vuexStore.state.client.getClientSync();
		if (!client) return false;
		return client.allTask().some((task) => task.state === JobState.Processing);
	};

	const shouldConfirmLeave = () =>
		!isLeaving.value &&
		(isOnline.value || hasActiveTask.value || hasPostProcessing());

	const handleLeaveAttempt = (event: BeforeUnloadEvent) => {
		if (!shouldConfirmLeave()) return;
		event.preventDefault();
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
