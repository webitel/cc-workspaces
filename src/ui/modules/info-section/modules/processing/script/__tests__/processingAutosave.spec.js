import { JobState } from 'webitel-sdk';

import {
	FORCE_AUTOSAVE_BEFORE_DEADLINE,
	isAutosaveAllowed,
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

	it('rejects an attempt that is not in processing', () => {
		[
			JobState.Distribute,
			JobState.Offering,
			JobState.Bridged,
			JobState.Missed,
			JobState.Closed,
			JobState.Destroy,
		].forEach((state) => {
			expect(
				isAutosaveAllowed(
					createAttempt({
						state,
					}),
					NOW,
				),
			).toBe(false);
		});
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

	describe('during the call', () => {
		const createCallAttempt = (overrides = {}) =>
			createAttempt({
				state: JobState.Bridged,
				autosave: true,
				processingAutosave: false,
				processingTimeoutAt: null,
				...overrides,
			});

		it('allows a bridged attempt with autosave on, without a deadline', () => {
			expect(isAutosaveAllowed(createCallAttempt(), NOW)).toBe(true);
		});

		it('rejects when queue autosave is off', () => {
			expect(
				isAutosaveAllowed(
					createCallAttempt({
						autosave: false,
					}),
					NOW,
				),
			).toBe(false);
		});

		it('rejects an attempt that is not bridged yet or already ended', () => {
			[
				JobState.Distribute,
				JobState.Offering,
				JobState.Missed,
				JobState.Closed,
				JobState.Destroy,
			].forEach((state) => {
				expect(
					isAutosaveAllowed(
						createCallAttempt({
							state,
						}),
						NOW,
					),
				).toBe(false);
			});
		});
	});
});

describe('isNearDeadline', () => {
	it('is true inside the pre-timeout window', () => {
		const attempt = createAttempt({
			processingTimeoutAt: NOW + FORCE_AUTOSAVE_BEFORE_DEADLINE,
		});
		expect(isNearDeadline(attempt, NOW)).toBe(true);
	});

	it('is false before the window and after the deadline', () => {
		const attempt = createAttempt({
			processingTimeoutAt: NOW + FORCE_AUTOSAVE_BEFORE_DEADLINE + 1,
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
