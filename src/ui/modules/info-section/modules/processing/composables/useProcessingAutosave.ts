import { onDeactivated, onMounted, onUnmounted, watch } from 'vue';
import { useStore } from 'vuex';

import {
	type AutosaveAttempt,
	AUTOSAVE_FORCE_BEFORE_DEADLINE_MS,
	createProcessingAutosave,
	isBeforeProcessing,
	isDeadlineWithin,
} from '../script/processingAutosave';

export function useProcessingAutosave<
	Attempt extends AutosaveAttempt & {
		id?: number | string;
	},
	Payload,
>({
	attempt,
	save,
}: {
	attempt: () => Attempt | null | undefined;
	save: (attempt: Attempt, payload: Payload) => unknown;
}) {
	const store = useStore();
	const changesBeforeProcessing = new Map<Attempt, Payload>();
	const autosave = createProcessingAutosave<Attempt, Payload>({
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
	// also forgets changes kept from the call
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
		if (isDeadlineWithin(attempt(), now, AUTOSAVE_FORCE_BEFORE_DEADLINE_MS)) {
			savePendingNow();
		}
	};

	watch(() => store.state.ui.now.now, onClockTick);
	// the form is reused for the next task
	watch(() => attempt()?.id, savePendingNow);

	onMounted(() => {
		document.addEventListener('visibilitychange', saveWhenPageHidden);
		window.addEventListener('pagehide', savePendingNow);
	});
	// kept alive: switching tabs does not unmount the form
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
