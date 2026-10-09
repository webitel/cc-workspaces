import { onDeactivated, onMounted, onUnmounted, watch } from 'vue';
import { useStore } from 'vuex';

import {
	type AutosaveAttempt,
	createProcessingAutosave,
	isBeforeProcessing,
	isNearTimeout,
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
	// latest changes per task made before its postprocessing, e.g. during the call
	const deferred = new Map<Attempt, Payload>();
	const autosave = createProcessingAutosave<Attempt, Payload>({
		save,
		defer: (deferredAttempt, payload) => {
			deferred.set(deferredAttempt, payload);
		},
	});

	// polled on the clock tick: SDK changes the task state outside Vue reactivity
	const sendDeferred = () => {
		deferred.forEach((payload, deferredAttempt) => {
			if (isBeforeProcessing(deferredAttempt)) return;
			deferred.delete(deferredAttempt);
			// direct send: schedule() would replace the pending save of another task
			autosave.send(deferredAttempt, payload);
		});
	};
	const flush = () => {
		autosave.flush();
	};
	const cancel = () => {
		autosave.cancel();
		const currentAttempt = attempt();
		if (currentAttempt) deferred.delete(currentAttempt);
	};
	const handleVisibilityChange = () => {
		if (document.visibilityState === 'hidden') flush();
	};

	watch(
		() => store.state.ui.now.now,
		(now) => {
			sendDeferred();
			if (isNearTimeout(attempt(), now)) flush();
		},
	);
	// the component is reused for another task: save the previous task's input first
	watch(() => attempt()?.id, flush);

	onMounted(() => {
		document.addEventListener('visibilitychange', handleVisibilityChange);
		window.addEventListener('pagehide', flush);
	});
	// the info section is kept alive, so switching its tab does not unmount the form
	onDeactivated(flush);
	onUnmounted(() => {
		document.removeEventListener('visibilitychange', handleVisibilityChange);
		window.removeEventListener('pagehide', flush);
		flush();
	});

	return {
		schedule: autosave.schedule,
		flush,
		cancel,
	};
}
