import { JobState, type Task } from 'webitel-sdk';

export const AUTOSAVE_DELAY = 1500;
export const AUTOSAVE_MAX_DELAY = 5000;
export const FORCE_AUTOSAVE_BEFORE_DEADLINE = 2000;

const isAutosaveDuringCall = (attempt: Task): boolean =>
	attempt.autosave && attempt.state === JobState.Bridged;

const isAutosaveDuringProcessing = (attempt: Task, now: number): boolean =>
	attempt.processingAutosave &&
	attempt.state === JobState.Processing &&
	!!attempt.processingTimeoutAt &&
	attempt.processingTimeoutAt > now;

export const isAutosaveAllowed = (
	attempt?: Task | null,
	now = Date.now(),
): boolean =>
	!!attempt &&
	(isAutosaveDuringCall(attempt) || isAutosaveDuringProcessing(attempt, now));

export const isNearDeadline = (
	attempt: Task | null | undefined,
	now: number,
): boolean => {
	const timeoutAt = attempt?.processingTimeoutAt;
	if (!timeoutAt) return false;
	const msLeft = timeoutAt - now;
	return msLeft > 0 && msLeft <= FORCE_AUTOSAVE_BEFORE_DEADLINE;
};
