import { debounce } from 'lodash-es';
import { onDeactivated, onMounted, onUnmounted, watch } from 'vue';
import { useStore } from 'vuex';
import type { Task } from 'webitel-sdk';

import {
	AUTOSAVE_DELAY,
	AUTOSAVE_MAX_DELAY,
	isAutosaveAllowed,
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

	const saveNow = (editedAttempt: Task, payload: Payload) => {
		if (!isAutosaveAllowed(editedAttempt)) return;
		try {
			Promise.resolve(save(editedAttempt, payload)).catch((err) => {
				console.warn('Processing autosave failed', err);
			});
		} catch (err) {
			console.warn('Processing autosave failed', err);
		}
	};

	const delayedSave = debounce(saveNow, AUTOSAVE_DELAY, {
		maxWait: AUTOSAVE_MAX_DELAY,
	});

	const saveLater = (editedAttempt: Task, payload: Payload) => {
		delayedSave(editedAttempt, payload);
		if (isNearDeadline(editedAttempt, Date.now())) delayedSave.flush();
	};
	const savePendingNow = () => {
		delayedSave.flush();
	};
	const discardPending = () => {
		delayedSave.cancel();
	};

	const saveWhenPageHidden = () => {
		if (document.visibilityState === 'hidden') savePendingNow();
	};

	const onClockTick = (now: number) => {
		if (isNearDeadline(attempt(), now)) savePendingNow();
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
		saveLater,
		discardPending,
	};
}
