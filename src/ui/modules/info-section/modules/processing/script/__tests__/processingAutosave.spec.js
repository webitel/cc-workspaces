import { JobState } from 'webitel-sdk';

import {
	AUTOSAVE_BEFORE_TIMEOUT_MS,
	AUTOSAVE_DEBOUNCE_MS,
	AUTOSAVE_MAX_WAIT_MS,
	canAutosave,
	createProcessingAutosave,
	isBeforeProcessing,
	isNearTimeout,
} from '../processingAutosave';

const NOW = 1_000_000;

const createAttempt = (overrides = {}) => ({
	id: 1,
	state: JobState.Processing,
	processingAutosave: true,
	processingTimeoutAt: NOW + 60_000,
	...overrides,
});

describe('canAutosave', () => {
	it('allows an attempt in processing with autosave on and a future deadline', () => {
		expect(canAutosave(createAttempt(), NOW)).toBe(true);
	});

	it('rejects when queue autosave is off', () => {
		expect(
			canAutosave(
				createAttempt({
					processingAutosave: false,
				}),
				NOW,
			),
		).toBe(false);
	});

	it('rejects when the attempt is not in processing', () => {
		expect(
			canAutosave(
				createAttempt({
					state: JobState.Bridged,
				}),
				NOW,
			),
		).toBe(false);
	});

	it('rejects when the deadline has passed', () => {
		expect(
			canAutosave(
				createAttempt({
					processingTimeoutAt: NOW,
				}),
				NOW,
			),
		).toBe(false);
	});

	it('rejects when there is no deadline or no attempt', () => {
		expect(
			canAutosave(
				createAttempt({
					processingTimeoutAt: null,
				}),
				NOW,
			),
		).toBe(false);
		expect(canAutosave(null, NOW)).toBe(false);
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

describe('isNearTimeout', () => {
	it('is true inside the pre-timeout window', () => {
		const attempt = createAttempt({
			processingTimeoutAt: NOW + AUTOSAVE_BEFORE_TIMEOUT_MS,
		});
		expect(isNearTimeout(attempt, NOW)).toBe(true);
	});

	it('is false before the window and after the deadline', () => {
		const attempt = createAttempt({
			processingTimeoutAt: NOW + AUTOSAVE_BEFORE_TIMEOUT_MS + 1,
		});
		expect(isNearTimeout(attempt, NOW)).toBe(false);
		expect(isNearTimeout(attempt, attempt.processingTimeoutAt)).toBe(false);
	});

	it('follows the current deadline after a renewal', () => {
		const attempt = createAttempt({
			processingTimeoutAt: NOW + 1000,
		});
		expect(isNearTimeout(attempt, NOW)).toBe(true);

		attempt.processingTimeoutAt = NOW + 30_000;
		expect(isNearTimeout(attempt, NOW)).toBe(false);
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

	it('saves once after the debounce pause with the last payload', () => {
		const save = vi.fn();
		const autosave = createProcessingAutosave({
			save,
		});
		const attempt = createAttempt();

		autosave.schedule(attempt, 'first');
		autosave.schedule(attempt, 'second');
		vi.advanceTimersByTime(AUTOSAVE_DEBOUNCE_MS - 1);
		expect(save).not.toHaveBeenCalled();

		vi.advanceTimersByTime(1);
		expect(save).toHaveBeenCalledTimes(1);
		expect(save).toHaveBeenCalledWith(attempt, 'second');
	});

	it('saves during continuous input no later than the max wait', () => {
		const save = vi.fn();
		const autosave = createProcessingAutosave({
			save,
		});
		const attempt = createAttempt();

		for (let elapsed = 0; elapsed < AUTOSAVE_MAX_WAIT_MS; elapsed += 500) {
			autosave.schedule(attempt, elapsed);
			vi.advanceTimersByTime(500);
		}

		expect(save).toHaveBeenCalledTimes(1);
	});

	it('flush sends the pending save immediately and nothing when idle', () => {
		const save = vi.fn();
		const autosave = createProcessingAutosave({
			save,
		});
		const attempt = createAttempt();

		autosave.flush();
		expect(save).not.toHaveBeenCalled();

		autosave.schedule(attempt, 'payload');
		autosave.flush();
		expect(save).toHaveBeenCalledWith(attempt, 'payload');

		autosave.flush();
		expect(save).toHaveBeenCalledTimes(1);
	});

	it('saves to the attempt passed to schedule', () => {
		const save = vi.fn();
		const autosave = createProcessingAutosave({
			save,
		});
		const attemptA = createAttempt({
			id: 'A',
		});

		autosave.schedule(attemptA, 'payloadA');
		autosave.flush();

		expect(save).toHaveBeenCalledWith(attemptA, 'payloadA');
	});

	it('drops the save when the attempt left processing before it fires', () => {
		const save = vi.fn();
		const autosave = createProcessingAutosave({
			save,
		});
		const attempt = createAttempt();

		autosave.schedule(attempt, 'payload');
		attempt.state = JobState.Closed;
		vi.advanceTimersByTime(AUTOSAVE_DEBOUNCE_MS);

		expect(save).not.toHaveBeenCalled();
	});

	it('drops the save when the deadline passed before it fires', () => {
		const save = vi.fn();
		const autosave = createProcessingAutosave({
			save,
		});
		const attempt = createAttempt({
			processingTimeoutAt: NOW + 1000,
		});

		autosave.schedule(attempt, 'payload');
		vi.advanceTimersByTime(AUTOSAVE_DEBOUNCE_MS);

		expect(save).not.toHaveBeenCalled();
	});

	it('swallows save errors', async () => {
		const autosave = createProcessingAutosave({
			save: () => Promise.reject(new Error('network')),
		});
		const throwingAutosave = createProcessingAutosave({
			save: () => {
				throw new Error('sync');
			},
		});

		autosave.schedule(createAttempt(), 'payload');
		throwingAutosave.schedule(createAttempt(), 'payload');

		expect(() => autosave.flush()).not.toThrow();
		expect(() => throwingAutosave.flush()).not.toThrow();
		await vi.runAllTimersAsync();
	});

	it('cancel drops the pending save', () => {
		const save = vi.fn();
		const autosave = createProcessingAutosave({
			save,
		});

		autosave.schedule(createAttempt(), 'payload');
		autosave.cancel();
		vi.advanceTimersByTime(AUTOSAVE_MAX_WAIT_MS);

		expect(save).not.toHaveBeenCalled();
	});

	it('keeps the latest payload of a task that is not in postprocessing yet', () => {
		const save = vi.fn();
		const defer = vi.fn();
		const autosave = createProcessingAutosave({
			save,
			defer,
		});
		const attempt = createAttempt({
			state: JobState.Bridged,
			processingAutosave: false,
			processingTimeoutAt: null,
		});

		autosave.schedule(attempt, 'first');
		autosave.schedule(attempt, 'second');
		vi.advanceTimersByTime(AUTOSAVE_DEBOUNCE_MS);

		expect(save).not.toHaveBeenCalled();
		expect(defer).toHaveBeenCalledTimes(1);
		expect(defer).toHaveBeenCalledWith(attempt, 'second');
	});

	it('drops, not defers, a save of a task that has ended', () => {
		const defer = vi.fn();
		const autosave = createProcessingAutosave({
			save: vi.fn(),
			defer,
		});

		autosave.schedule(
			createAttempt({
				state: JobState.Closed,
			}),
			'payload',
		);
		autosave.flush();

		expect(defer).not.toHaveBeenCalled();
	});

	it('send saves at once through the same guard', () => {
		const save = vi.fn();
		const autosave = createProcessingAutosave({
			save,
		});
		const attempt = createAttempt();

		autosave.send(attempt, 'payload');
		expect(save).toHaveBeenCalledWith(attempt, 'payload');

		autosave.send(
			createAttempt({
				processingAutosave: false,
			}),
			'payload',
		);
		expect(save).toHaveBeenCalledTimes(1);
	});
});
