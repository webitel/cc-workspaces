import { debounce } from 'lodash-es';
import { JobState } from 'webitel-sdk';

export const AUTOSAVE_DEBOUNCE_MS = 1500;
export const AUTOSAVE_MAX_WAIT_MS = 5000;
// "now" ticks once per second, so the window must hold at least one tick before the deadline
export const AUTOSAVE_BEFORE_TIMEOUT_MS = 2000;

export interface AutosaveAttempt {
	state?: string;
	processingAutosave?: boolean;
	processingTimeoutAt?: number | null;
}

export const canAutosave = (
	attempt?: AutosaveAttempt | null,
	now = Date.now(),
): boolean =>
	!!attempt?.processingAutosave &&
	attempt.state === JobState.Processing &&
	!!attempt.processingTimeoutAt &&
	attempt.processingTimeoutAt > now;

const FINISHED_STATES: string[] = [
	JobState.Missed,
	JobState.Closed,
	JobState.Destroy,
];

// the form can be open during an active call: postprocessing starts only when it ends
export const isBeforeProcessing = (attempt?: AutosaveAttempt | null): boolean =>
	!!attempt?.state &&
	attempt.state !== JobState.Processing &&
	!FINISHED_STATES.includes(attempt.state);

export const isNearTimeout = (
	attempt: AutosaveAttempt | null | undefined,
	now: number,
	windowMs = AUTOSAVE_BEFORE_TIMEOUT_MS,
): boolean => {
	const timeoutAt = attempt?.processingTimeoutAt;
	if (!timeoutAt) return false;
	const msLeft = timeoutAt - now;
	return msLeft > 0 && msLeft <= windowMs;
};

export const createProcessingAutosave = <
	Attempt extends AutosaveAttempt,
	Payload,
>({
	save,
	defer,
}: {
	save: (attempt: Attempt, payload: Payload) => unknown;
	// receives changes made before postprocessing, which cannot be saved yet
	defer?: (attempt: Attempt, payload: Payload) => void;
}) => {
	const send = (attempt: Attempt, payload: Payload) => {
		// checked at send time: the task may have left processing while waiting
		if (!canAutosave(attempt)) return;
		try {
			Promise.resolve(save(attempt, payload)).catch((err) => {
				console.warn('Processing autosave failed', err);
			});
		} catch (err) {
			console.warn('Processing autosave failed', err);
		}
	};

	// attempt goes as an argument, so flush() saves the task that was edited,
	// even if the component has switched to another task since then
	const debounced = debounce(
		(attempt: Attempt, payload: Payload) => {
			if (isBeforeProcessing(attempt)) {
				defer?.(attempt, payload);
				return;
			}
			send(attempt, payload);
		},
		AUTOSAVE_DEBOUNCE_MS,
		{
			maxWait: AUTOSAVE_MAX_WAIT_MS,
		},
	);

	const schedule = (attempt: Attempt, payload: Payload) => {
		debounced(attempt, payload);
		if (isNearTimeout(attempt, Date.now(), AUTOSAVE_DEBOUNCE_MS)) {
			debounced.flush();
		}
	};

	return {
		schedule,
		send,
		flush: debounced.flush,
		cancel: debounced.cancel,
	};
};
