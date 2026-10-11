import { onDeactivated, onMounted, onUnmounted, watch } from 'vue';
import { useStore } from 'vuex';
import type { Task } from 'webitel-sdk';

import {
	createProcessingAutosave,
	isBeforeProcessing,
	isNearDeadline,
} from '../script/processingAutosave';

export function useProcessingAutosave<Payload>({
	attempt,
	save,
}: {
	attempt: () => Task | null | undefined;
	save: (attempt: Task, payload: Payload) => unknown;
}) {
	const store = useStore();
	const changesBeforeProcessing = new Map<Task, Payload>();
	const autosave = createProcessingAutosave<Payload>({
		save,
		keepUntilProcessing: (heldAttempt, payload) => {
			changesBeforeProcessing.set(heldAttempt, payload);
		},
	});

	// polled on tick: SDK changes task state outside Vue reactivity
	const sendChangesOnProcessingStart = () => {
		changesBeforeProcessing.forEach((payload, heldAttempt) => {
			if (isBeforeProcessing(heldAttempt)) return;
			changesBeforeProcessing.delete(heldAttempt);
			// saveLater() would replace another task's pending save
			autosave.saveNow(heldAttempt, payload);
		});
	};
	const savePendingNow = () => {
		autosave.savePendingNow();
	};
	const discardPending = () => {
		autosave.discardPending();
		const currentAttempt = attempt();
		if (currentAttempt) changesBeforeProcessing.delete(currentAttempt);
	};
	const saveWhenPageHidden = () => {
		if (document.visibilityState === 'hidden') savePendingNow();
	};

	const onClockTick = (now: number) => {
		sendChangesOnProcessingStart();
		if (isNearDeadline(attempt(), now)) {
			savePendingNow();
		}
	};

	watch(() => store.state.ui.now.now, onClockTick);
	watch(() => attempt()?.id, savePendingNow);

	onMounted(() => {
		document.addEventListener('visibilitychange', saveWhenPageHidden);
		window.addEventListener('pagehide', savePendingNow);
	});
	onDeactivated(savePendingNow);
	onUnmounted(() => {
		document.removeEventListener('visibilitychange', saveWhenPageHidden);
		window.removeEventListener('pagehide', savePendingNow);
		savePendingNow();
	});

	return {
		saveLater: autosave.saveLater,
		savePendingNow,
		discardPending,
	};
}
