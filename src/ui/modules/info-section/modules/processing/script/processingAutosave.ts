import { debounce } from 'lodash-es';
import { JobState, type Task } from 'webitel-sdk';

export const AUTOSAVE_DELAY_MS = 1500;
export const AUTOSAVE_MAX_DELAY_MS = 5000;
export const FORCE_AUTOSAVE_BEFORE_DEADLINE_MS = 2000;

export const isAutosaveAllowed = (
	attempt?: Task | null,
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

export const isBeforeProcessing = (attempt?: Task | null): boolean =>
	!!attempt?.state &&
	attempt.state !== JobState.Processing &&
	!FINISHED_STATES.includes(attempt.state);

export const isDeadlineWithin = (
	attempt: Task | null | undefined,
	now: number,
	windowMs: number,
): boolean => {
	const timeoutAt = attempt?.processingTimeoutAt;
	if (!timeoutAt) return false;
	const msLeft = timeoutAt - now;
	return msLeft > 0 && msLeft <= windowMs;
};

export const createProcessingAutosave = <Payload>({
	save,
	keepUntilProcessing,
}: {
	save: (attempt: Task, payload: Payload) => unknown;
	keepUntilProcessing?: (attempt: Task, payload: Payload) => void;
}) => {
	const saveNow = (attempt: Task, payload: Payload) => {
		if (!isAutosaveAllowed(attempt)) return;
		try {
			Promise.resolve(save(attempt, payload)).catch((err) => {
				console.warn('Processing autosave failed', err);
			});
		} catch (err) {
			console.warn('Processing autosave failed', err);
		}
	};

	const delayedSave = debounce(
		(attempt: Task, payload: Payload) => {
			if (isBeforeProcessing(attempt)) {
				keepUntilProcessing?.(attempt, payload);
				return;
			}
			saveNow(attempt, payload);
		},
		AUTOSAVE_DELAY_MS,
		{
			maxWait: AUTOSAVE_MAX_DELAY_MS,
		},
	);

	const saveLater = (attempt: Task, payload: Payload) => {
		delayedSave(attempt, payload);
		if (isDeadlineWithin(attempt, Date.now(), AUTOSAVE_DELAY_MS)) {
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
