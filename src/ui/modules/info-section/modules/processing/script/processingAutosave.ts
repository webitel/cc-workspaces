import { debounce } from 'lodash-es';
import { JobState } from 'webitel-sdk';

export const AUTOSAVE_IDLE_DELAY_MS = 1500;
export const AUTOSAVE_MAX_DELAY_MS = 5000;
// longer than the 1 s "now" tick, so one tick always lands in it
export const AUTOSAVE_FORCE_BEFORE_DEADLINE_MS = 2000;

export interface AutosaveAttempt {
	state?: string;
	processingAutosave?: boolean;
	processingTimeoutAt?: number | null;
}

export const isAutosaveAllowed = (
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

export const isBeforeProcessing = (attempt?: AutosaveAttempt | null): boolean =>
	!!attempt?.state &&
	attempt.state !== JobState.Processing &&
	!FINISHED_STATES.includes(attempt.state);

export const isDeadlineWithin = (
	attempt: AutosaveAttempt | null | undefined,
	now: number,
	windowMs: number,
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
	keepUntilProcessing,
}: {
	save: (attempt: Attempt, payload: Payload) => unknown;
	keepUntilProcessing?: (attempt: Attempt, payload: Payload) => void;
}) => {
	const saveNow = (attempt: Attempt, payload: Payload) => {
		// the task may have changed while waiting
		if (!isAutosaveAllowed(attempt)) return;
		try {
			Promise.resolve(save(attempt, payload)).catch((err) => {
				console.warn('Processing autosave failed', err);
			});
		} catch (err) {
			console.warn('Processing autosave failed', err);
		}
	};

	// attempt is passed in, so a pending save stays with its own task
	const delayedSave = debounce(
		(attempt: Attempt, payload: Payload) => {
			if (isBeforeProcessing(attempt)) {
				keepUntilProcessing?.(attempt, payload);
				return;
			}
			saveNow(attempt, payload);
		},
		AUTOSAVE_IDLE_DELAY_MS,
		{
			maxWait: AUTOSAVE_MAX_DELAY_MS,
		},
	);

	const saveLater = (attempt: Attempt, payload: Payload) => {
		delayedSave(attempt, payload);
		if (isDeadlineWithin(attempt, Date.now(), AUTOSAVE_IDLE_DELAY_MS)) {
			delayedSave.flush();
		}
	};

	return {
		saveLater,
		saveNow,
		savePendingNow: delayedSave.flush,
		discardPending: delayedSave.cancel,
	};
};
