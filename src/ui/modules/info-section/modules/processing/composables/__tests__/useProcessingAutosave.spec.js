import { mount } from '@vue/test-utils';
import { defineComponent, h, KeepAlive, nextTick, reactive } from 'vue';
import { createStore } from 'vuex';
import { JobState } from 'webitel-sdk';

import {
	AUTOSAVE_DELAY,
	AUTOSAVE_MAX_DELAY,
	FORCE_AUTOSAVE_BEFORE_DEADLINE,
} from '../../script/processingAutosave';
import { useProcessingAutosave } from '../useProcessingAutosave';

const NOW = 1_000_000;

const createAttempt = (overrides = {}) => ({
	id: 1,
	state: JobState.Processing,
	processingAutosave: true,
	processingTimeoutAt: NOW + 60_000,
	...overrides,
});

describe('useProcessingAutosave', () => {
	let store;
	let state;
	let save;
	let autosave;

	const Host = defineComponent({
		name: 'AutosaveHost',
		setup() {
			autosave = useProcessingAutosave({
				attempt: () => state.attempt,
				save,
			});
			return () => h('div');
		},
	});

	const mountOptions = () => ({
		global: {
			plugins: [
				store,
			],
		},
	});
	const mountHost = () => mount(Host, mountOptions());
	const mountKeptAliveHost = () =>
		mount(
			defineComponent({
				setup: () => () =>
					h(KeepAlive, null, state.isShown ? h(Host) : h('span')),
			}),
			mountOptions(),
		);

	beforeEach(() => {
		vi.useFakeTimers();
		vi.setSystemTime(NOW);
		save = vi.fn();
		state = reactive({
			attempt: createAttempt(),
			isShown: true,
		});
		store = createStore({
			modules: {
				ui: {
					namespaced: true,
					modules: {
						now: {
							namespaced: true,
							state: {
								now: NOW,
							},
						},
					},
				},
			},
		});
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('saves once after the idle delay with the last payload', () => {
		mountHost();

		autosave.saveLater(state.attempt, 'first');
		autosave.saveLater(state.attempt, 'second');
		vi.advanceTimersByTime(AUTOSAVE_DELAY - 1);
		expect(save).not.toHaveBeenCalled();

		vi.advanceTimersByTime(1);
		expect(save).toHaveBeenCalledTimes(1);
		expect(save).toHaveBeenCalledWith(state.attempt, 'second');
	});

	it('saves during continuous input no later than the max delay', () => {
		mountHost();

		for (let elapsed = 0; elapsed < AUTOSAVE_MAX_DELAY; elapsed += 500) {
			autosave.saveLater(state.attempt, elapsed);
			vi.advanceTimersByTime(500);
		}

		expect(save).toHaveBeenCalledTimes(1);
	});

	it('drops the save when the attempt left processing before it fires', () => {
		mountHost();
		const attempt = createAttempt();

		autosave.saveLater(attempt, 'payload');
		attempt.state = JobState.Closed;
		vi.advanceTimersByTime(AUTOSAVE_DELAY);

		expect(save).not.toHaveBeenCalled();
	});

	it('drops the save when the deadline passed before it fires', () => {
		mountHost();
		const attempt = createAttempt();

		autosave.saveLater(attempt, 'payload');
		attempt.processingTimeoutAt = NOW + 1000;
		vi.advanceTimersByTime(AUTOSAVE_DELAY);

		expect(save).not.toHaveBeenCalled();
	});

	it('saves at once inside the pre-deadline window', () => {
		mountHost();
		const attempt = createAttempt({
			processingTimeoutAt: NOW + FORCE_AUTOSAVE_BEFORE_DEADLINE,
		});

		autosave.saveLater(attempt, 'payload');

		expect(save).toHaveBeenCalledWith(attempt, 'payload');
	});

	it('keeps the delay before the pre-deadline window', () => {
		mountHost();

		autosave.saveLater(
			createAttempt({
				processingTimeoutAt: NOW + FORCE_AUTOSAVE_BEFORE_DEADLINE + 1,
			}),
			'payload',
		);

		expect(save).not.toHaveBeenCalled();
	});

	it('swallows and logs save errors', async () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
		save = vi
			.fn()
			.mockRejectedValueOnce(new Error('network'))
			.mockImplementationOnce(() => {
				throw new Error('sync');
			});
		mountHost();

		autosave.saveLater(createAttempt(), 'payload');
		expect(() => vi.advanceTimersByTime(AUTOSAVE_DELAY)).not.toThrow();
		autosave.saveLater(createAttempt(), 'payload');
		expect(() => vi.advanceTimersByTime(AUTOSAVE_DELAY)).not.toThrow();
		await vi.runAllTimersAsync();

		expect(warn).toHaveBeenCalledTimes(2);
		warn.mockRestore();
	});

	it('saves the pending change when the deadline is near', async () => {
		mountHost();

		autosave.saveLater(state.attempt, 'payload');
		store.state.ui.now.now =
			state.attempt.processingTimeoutAt - FORCE_AUTOSAVE_BEFORE_DEADLINE - 1;
		await nextTick();
		expect(save).not.toHaveBeenCalled();

		store.state.ui.now.now =
			state.attempt.processingTimeoutAt - FORCE_AUTOSAVE_BEFORE_DEADLINE;
		await nextTick();
		expect(save).toHaveBeenCalledTimes(1);
	});

	it('saves the previous attempt when the attempt changes', async () => {
		mountHost();
		const attemptA = state.attempt;

		autosave.saveLater(attemptA, 'payload A');
		state.attempt = createAttempt({
			id: 2,
		});
		await nextTick();

		expect(save).toHaveBeenCalledWith(attemptA, 'payload A');
	});

	it('saves the pending change when the host is deactivated', async () => {
		mountKeptAliveHost();

		autosave.saveLater(state.attempt, 'payload');
		state.isShown = false;
		await nextTick();

		expect(save).toHaveBeenCalledTimes(1);
	});

	it('saves the pending change when the page is hidden, not when it becomes visible', () => {
		const wrapper = mountHost();
		const visibility = vi
			.spyOn(document, 'visibilityState', 'get')
			.mockReturnValue('visible');

		autosave.saveLater(state.attempt, 'payload');
		document.dispatchEvent(new Event('visibilitychange'));
		expect(save).not.toHaveBeenCalled();

		visibility.mockReturnValue('hidden');
		document.dispatchEvent(new Event('visibilitychange'));
		expect(save).toHaveBeenCalledTimes(1);

		autosave.saveLater(state.attempt, 'payload again');
		window.dispatchEvent(new Event('pagehide'));
		expect(save).toHaveBeenCalledTimes(2);

		visibility.mockRestore();
		wrapper.unmount();
	});

	it('saves the pending change on unmount and removes the same page listeners it added', () => {
		const addWindowListener = vi.spyOn(window, 'addEventListener');
		const addDocumentListener = vi.spyOn(document, 'addEventListener');
		const removeWindowListener = vi.spyOn(window, 'removeEventListener');
		const removeDocumentListener = vi.spyOn(document, 'removeEventListener');
		const wrapper = mountHost();
		const listenerOf = (spy, type) =>
			spy.mock.calls.find(([eventType]) => eventType === type)?.[1];

		autosave.saveLater(state.attempt, 'payload');
		wrapper.unmount();

		expect(save).toHaveBeenCalledTimes(1);
		expect(removeWindowListener).toHaveBeenCalledWith(
			'pagehide',
			listenerOf(addWindowListener, 'pagehide'),
		);
		expect(removeDocumentListener).toHaveBeenCalledWith(
			'visibilitychange',
			listenerOf(addDocumentListener, 'visibilitychange'),
		);

		vi.restoreAllMocks();
	});

	it('discardPending drops the pending save', () => {
		const wrapper = mountHost();

		autosave.saveLater(state.attempt, 'payload');
		autosave.discardPending();
		wrapper.unmount();

		expect(save).not.toHaveBeenCalled();
	});

	it('does not save changes made during the call', () => {
		mountHost();
		const attempt = createAttempt({
			state: JobState.Bridged,
			processingAutosave: false,
			processingTimeoutAt: null,
		});

		autosave.saveLater(attempt, 'during call');
		vi.advanceTimersByTime(AUTOSAVE_DELAY);

		expect(save).not.toHaveBeenCalled();
	});
});
