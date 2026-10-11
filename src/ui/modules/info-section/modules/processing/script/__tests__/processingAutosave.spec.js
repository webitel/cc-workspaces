import { JobState } from 'webitel-sdk';

import {
	FORCE_AUTOSAVE_BEFORE_DEADLINE_MS,
	isAutosaveAllowed,
	isBeforeProcessing,
	isNearDeadline,
} from '../processingAutosave';

const NOW = 1_000_000;

const createAttempt = (overrides = {}) => ({
	id: 1,
	state: JobState.Processing,
	processingAutosave: true,
	processingTimeoutAt: NOW + 60_000,
	...overrides,
});

describe('isAutosaveAllowed', () => {
	it('allows an attempt in processing with autosave on and a future deadline', () => {
		expect(isAutosaveAllowed(createAttempt(), NOW)).toBe(true);
	});

	it('rejects when queue autosave is off', () => {
		expect(
			isAutosaveAllowed(
				createAttempt({
					processingAutosave: false,
				}),
				NOW,
			),
		).toBe(false);
	});

	it('rejects when the attempt is not in processing', () => {
		expect(
			isAutosaveAllowed(
				createAttempt({
					state: JobState.Bridged,
				}),
				NOW,
			),
		).toBe(false);
	});

	it('rejects when the deadline has passed', () => {
		expect(
			isAutosaveAllowed(
				createAttempt({
					processingTimeoutAt: NOW,
				}),
				NOW,
			),
		).toBe(false);
	});

	it('rejects when there is no deadline or no attempt', () => {
		expect(
			isAutosaveAllowed(
				createAttempt({
					processingTimeoutAt: null,
				}),
				NOW,
			),
		).toBe(false);
		expect(isAutosaveAllowed(null, NOW)).toBe(false);
	});
});

describe('isBeforeProcessing', () => {
	it('is true while the task has not reached postprocessing yet', () => {
		[
			JobState.Distribute,
			JobState.Offering,
			JobState.Bridged,
		].forEach((state) => {
			expect(
				isBeforeProcessing(
					createAttempt({
						state,
					}),
				),
			).toBe(true);
		});
	});

	it('is false in postprocessing, after the task ended, and without a state', () => {
		[
			JobState.Processing,
			JobState.Missed,
			JobState.Closed,
			JobState.Destroy,
		].forEach((state) => {
			expect(
				isBeforeProcessing(
					createAttempt({
						state,
					}),
				),
			).toBe(false);
		});
		expect(
			isBeforeProcessing(
				createAttempt({
					state: undefined,
				}),
			),
		).toBe(false);
		expect(isBeforeProcessing(null)).toBe(false);
	});
});

describe('isNearDeadline', () => {
	it('is true inside the pre-timeout window', () => {
		const attempt = createAttempt({
			processingTimeoutAt: NOW + FORCE_AUTOSAVE_BEFORE_DEADLINE_MS,
		});
		expect(isNearDeadline(attempt, NOW)).toBe(true);
	});

	it('is false before the window and after the deadline', () => {
		const attempt = createAttempt({
			processingTimeoutAt: NOW + FORCE_AUTOSAVE_BEFORE_DEADLINE_MS + 1,
		});
		expect(isNearDeadline(attempt, NOW)).toBe(false);
		expect(isNearDeadline(attempt, attempt.processingTimeoutAt)).toBe(false);
	});

	it('follows the current deadline after a renewal', () => {
		const attempt = createAttempt({
			processingTimeoutAt: NOW + 1000,
		});
		expect(isNearDeadline(attempt, NOW)).toBe(true);

		attempt.processingTimeoutAt = NOW + 30_000;
		expect(isNearDeadline(attempt, NOW)).toBe(false);
	});
});
