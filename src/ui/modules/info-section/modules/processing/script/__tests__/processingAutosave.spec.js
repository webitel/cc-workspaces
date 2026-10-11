import { JobState } from 'webitel-sdk';

import {
	FORCE_AUTOSAVE_BEFORE_DEADLINE_MS,
	AUTOSAVE_DELAY_MS,
	AUTOSAVE_MAX_DELAY_MS,
	isAutosaveAllowed,
	createProcessingAutosave,
	isBeforeProcessing,
	isDeadlineWithin,
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

describe('isDeadlineWithin', () => {
	it('is true inside the pre-timeout window', () => {
		const attempt = createAttempt({
			processingTimeoutAt: NOW + FORCE_AUTOSAVE_BEFORE_DEADLINE_MS,
		});
		expect(isDeadlineWithin(attempt, NOW)).toBe(true);
	});

	it('is false before the window and after the deadline', () => {
		const attempt = createAttempt({
			processingTimeoutAt: NOW + FORCE_AUTOSAVE_BEFORE_DEADLINE_MS + 1,
		});
		expect(isDeadlineWithin(attempt, NOW)).toBe(false);
		expect(isDeadlineWithin(attempt, attempt.processingTimeoutAt)).toBe(false);
	});

	it('follows the current deadline after a renewal', () => {
		const attempt = createAttempt({
			processingTimeoutAt: NOW + 1000,
		});
		expect(isDeadlineWithin(attempt, NOW)).toBe(true);

		attempt.processingTimeoutAt = NOW + 30_000;
		expect(isDeadlineWithin(attempt, NOW)).toBe(false);
	});
});

describe('createProcessingAutosave', () => {
	beforeEach(() => {
		vi.useFakeTimers();
		vi.setSystemTime(NOW);
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('saves once after the idle delay with the last payload', () => {
		const save = vi.fn();
		const autosave = createProcessingAutosave({
			save,
		});
		const attempt = createAttempt();

		autosave.saveLater(attempt, 'first');
		autosave.saveLater(attempt, 'second');
		vi.advanceTimersByTime(AUTOSAVE_DELAY_MS - 1);
		expect(save).not.toHaveBeenCalled();

		vi.advanceTimersByTime(1);
		expect(save).toHaveBeenCalledTimes(1);
		expect(save).toHaveBeenCalledWith(attempt, 'second');
	});

	it('saves during continuous input no later than the max delay', () => {
		const save = vi.fn();
		const autosave = createProcessingAutosave({
			save,
		});
		const attempt = createAttempt();

		for (let elapsed = 0; elapsed < AUTOSAVE_MAX_DELAY_MS; elapsed += 500) {
			autosave.saveLater(attempt, elapsed);
			vi.advanceTimersByTime(500);
		}

		expect(save).toHaveBeenCalledTimes(1);
	});

	it('savePendingNow sends the pending save immediately and nothing when idle', () => {
		const save = vi.fn();
		const autosave = createProcessingAutosave({
			save,
		});
		const attempt = createAttempt();

		autosave.savePendingNow();
		expect(save).not.toHaveBeenCalled();

		autosave.saveLater(attempt, 'payload');
		autosave.savePendingNow();
		expect(save).toHaveBeenCalledWith(attempt, 'payload');

		autosave.savePendingNow();
		expect(save).toHaveBeenCalledTimes(1);
	});

	it('saves to the attempt passed to saveLater', () => {
		const save = vi.fn();
		const autosave = createProcessingAutosave({
			save,
		});
		const attemptA = createAttempt({
			id: 'A',
		});

		autosave.saveLater(attemptA, 'payloadA');
		autosave.savePendingNow();

		expect(save).toHaveBeenCalledWith(attemptA, 'payloadA');
	});

	it('drops the save when the attempt left processing before it fires', () => {
		const save = vi.fn();
		const autosave = createProcessingAutosave({
			save,
		});
		const attempt = createAttempt();

		autosave.saveLater(attempt, 'payload');
		attempt.state = JobState.Closed;
		vi.advanceTimersByTime(AUTOSAVE_DELAY_MS);

		expect(save).not.toHaveBeenCalled();
	});

	it('drops the save when the deadline passed before it fires', () => {
		const save = vi.fn();
		const autosave = createProcessingAutosave({
			save,
		});
		const attempt = createAttempt();

		autosave.saveLater(attempt, 'payload');
		attempt.processingTimeoutAt = NOW + 1000;
		vi.advanceTimersByTime(AUTOSAVE_DELAY_MS);

		expect(save).not.toHaveBeenCalled();
	});

	it('saves at once inside the pre-deadline window', () => {
		const save = vi.fn();
		const autosave = createProcessingAutosave({
			save,
		});
		const attempt = createAttempt({
			processingTimeoutAt: NOW + FORCE_AUTOSAVE_BEFORE_DEADLINE_MS,
		});

		autosave.saveLater(attempt, 'payload');

		expect(save).toHaveBeenCalledWith(attempt, 'payload');
	});

	it('keeps the delay before the pre-deadline window', () => {
		const save = vi.fn();
		const autosave = createProcessingAutosave({
			save,
		});

		autosave.saveLater(
			createAttempt({
				processingTimeoutAt: NOW + FORCE_AUTOSAVE_BEFORE_DEADLINE_MS + 1,
			}),
			'payload',
		);

		expect(save).not.toHaveBeenCalled();
	});

	it('swallows and logs save errors', async () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
		const autosave = createProcessingAutosave({
			save: () => Promise.reject(new Error('network')),
		});
		const throwingAutosave = createProcessingAutosave({
			save: () => {
				throw new Error('sync');
			},
		});

		autosave.saveLater(createAttempt(), 'payload');
		throwingAutosave.saveLater(createAttempt(), 'payload');

		expect(() => autosave.savePendingNow()).not.toThrow();
		expect(() => throwingAutosave.savePendingNow()).not.toThrow();
		await vi.runAllTimersAsync();
		expect(warn).toHaveBeenCalledTimes(2);
		warn.mockRestore();
	});

	it('discardPending drops the pending save', () => {
		const save = vi.fn();
		const autosave = createProcessingAutosave({
			save,
		});

		autosave.saveLater(createAttempt(), 'payload');
		autosave.discardPending();
		vi.advanceTimersByTime(AUTOSAVE_MAX_DELAY_MS);

		expect(save).not.toHaveBeenCalled();
	});

	it('keeps the latest payload of a task that is not in postprocessing yet', () => {
		const save = vi.fn();
		const keepUntilProcessing = vi.fn();
		const autosave = createProcessingAutosave({
			save,
			keepUntilProcessing,
		});
		const attempt = createAttempt({
			state: JobState.Bridged,
			processingAutosave: false,
			processingTimeoutAt: null,
		});

		autosave.saveLater(attempt, 'first');
		autosave.saveLater(attempt, 'second');
		vi.advanceTimersByTime(AUTOSAVE_DELAY_MS);

		expect(save).not.toHaveBeenCalled();
		expect(keepUntilProcessing).toHaveBeenCalledTimes(1);
		expect(keepUntilProcessing).toHaveBeenCalledWith(attempt, 'second');
	});

	it('drops, not keeps, a save of a task that has ended', () => {
		const keepUntilProcessing = vi.fn();
		const autosave = createProcessingAutosave({
			save: vi.fn(),
			keepUntilProcessing,
		});

		autosave.saveLater(
			createAttempt({
				state: JobState.Closed,
			}),
			'payload',
		);
		autosave.savePendingNow();

		expect(keepUntilProcessing).not.toHaveBeenCalled();
	});

	it('saveNow saves at once through the same guard', () => {
		const save = vi.fn();
		const autosave = createProcessingAutosave({
			save,
		});
		const attempt = createAttempt();

		autosave.saveNow(attempt, 'payload');
		expect(save).toHaveBeenCalledWith(attempt, 'payload');

		autosave.saveNow(
			createAttempt({
				processingAutosave: false,
			}),
			'payload',
		);
		expect(save).toHaveBeenCalledTimes(1);
	});
});
