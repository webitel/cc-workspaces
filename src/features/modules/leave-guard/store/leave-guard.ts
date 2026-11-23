import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import { JobState, type Task } from 'webitel-sdk';

import { useUserinfoStore } from '../../../../ui/modules/userinfo/userinfoStore';
import { getAllClientConversations } from '../../chat/scripts/getClientConversations';

export const useLeaveGuardStore = defineStore('features/leaveGuard', () => {
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

	const isInPostProcessing = (task?: Task | null) =>
		task?.state === JobState.Processing;

	const hasPostProcessing = computed(
		() =>
			vuexStore.state.features.call.callList.some((call) =>
				isInPostProcessing(call.task),
			) ||
			vuexStore.state.features.job.jobList.some(isInPostProcessing) ||
			getAllClientConversations(vuexStore.state).some((chat) =>
				isInPostProcessing(chat.task),
			),
	);

	const shouldConfirmLeave = computed(
		() =>
			!isLeaving.value &&
			(isOnline.value || hasActiveTask.value || hasPostProcessing.value),
	);

	const handleLeaveAttempt = (event: BeforeUnloadEvent) => {
		if (!shouldConfirmLeave.value) return;
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
