import { mount } from '@vue/test-utils';
import {
	defineComponent,
	h,
	KeepAlive,
	markRaw,
	nextTick,
	reactive,
} from 'vue';
import { createStore } from 'vuex';
import { JobState } from 'webitel-sdk';

import {
	AUTOSAVE_BEFORE_TIMEOUT_MS,
	AUTOSAVE_DEBOUNCE_MS,
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
	// KeepAlive lets the test deactivate the host without unmounting it
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

	it('saves after the debounce pause', () => {
		mountHost();

		autosave.schedule(state.attempt, 'payload');
		vi.advanceTimersByTime(AUTOSAVE_DEBOUNCE_MS);

		expect(save).toHaveBeenCalledWith(state.attempt, 'payload');
	});

	it('flushes a pending save when the deadline is near', async () => {
		mountHost();

		autosave.schedule(state.attempt, 'payload');
		store.state.ui.now.now =
			state.attempt.processingTimeoutAt - AUTOSAVE_BEFORE_TIMEOUT_MS - 1;
		await nextTick();
		expect(save).not.toHaveBeenCalled();

		store.state.ui.now.now =
			state.attempt.processingTimeoutAt - AUTOSAVE_BEFORE_TIMEOUT_MS;
		await nextTick();
		expect(save).toHaveBeenCalledTimes(1);
	});

	it('saves the previous attempt when the attempt changes', async () => {
		mountHost();
		const attemptA = state.attempt;

		autosave.schedule(attemptA, 'payload A');
		state.attempt = createAttempt({
			id: 2,
		});
		await nextTick();

		expect(save).toHaveBeenCalledWith(attemptA, 'payload A');
	});

	it('flushes when the host is deactivated', async () => {
		mountKeptAliveHost();

		autosave.schedule(state.attempt, 'payload');
		state.isShown = false;
		await nextTick();

		expect(save).toHaveBeenCalledTimes(1);
	});

	it('flushes when the page is hidden, not when it becomes visible', () => {
		const wrapper = mountHost();
		const visibility = vi
			.spyOn(document, 'visibilityState', 'get')
			.mockReturnValue('visible');

		autosave.schedule(state.attempt, 'payload');
		document.dispatchEvent(new Event('visibilitychange'));
		expect(save).not.toHaveBeenCalled();

		visibility.mockReturnValue('hidden');
		document.dispatchEvent(new Event('visibilitychange'));
		expect(save).toHaveBeenCalledTimes(1);

		autosave.schedule(state.attempt, 'payload again');
		window.dispatchEvent(new Event('pagehide'));
		expect(save).toHaveBeenCalledTimes(2);

		visibility.mockRestore();
		wrapper.unmount();
	});

	it('flushes on unmount and removes the same page listeners it added', () => {
		const addWindowListener = vi.spyOn(window, 'addEventListener');
		const addDocumentListener = vi.spyOn(document, 'addEventListener');
		const removeWindowListener = vi.spyOn(window, 'removeEventListener');
		const removeDocumentListener = vi.spyOn(document, 'removeEventListener');
		const wrapper = mountHost();
		const listenerOf = (spy, type) =>
			spy.mock.calls.find(([eventType]) => eventType === type)?.[1];

		autosave.schedule(state.attempt, 'payload');
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

	it('cancel drops the pending save', () => {
		const wrapper = mountHost();

		autosave.schedule(state.attempt, 'payload');
		autosave.cancel();
		wrapper.unmount();

		expect(save).not.toHaveBeenCalled();
	});

	describe('changes made before postprocessing', () => {
		// raw like an SDK task: its state changes are invisible to Vue watchers
		const createActiveCallAttempt = (overrides = {}) =>
			markRaw(
				createAttempt({
					state: JobState.Bridged,
					processingAutosave: false,
					processingTimeoutAt: null,
					...overrides,
				}),
			);
		const enterProcessing = (attempt) => {
			attempt.state = JobState.Processing;
			attempt.processingAutosave = true;
			attempt.processingTimeoutAt = Date.now() + 60_000;
		};
		const tick = async () => {
			store.state.ui.now.now += 1000;
			await nextTick();
		};

		it('are saved on the first tick after the task enters postprocessing', async () => {
			state.attempt = createActiveCallAttempt();
			mountHost();

			autosave.schedule(state.attempt, 'during call');
			vi.advanceTimersByTime(AUTOSAVE_DEBOUNCE_MS);
			await tick();
			expect(save).not.toHaveBeenCalled();

			enterProcessing(state.attempt);
			await tick();
			expect(save).toHaveBeenCalledWith(state.attempt, 'during call');

			await tick();
			expect(save).toHaveBeenCalledTimes(1);
		});

		it('are dropped when the task ends without postprocessing', async () => {
			state.attempt = createActiveCallAttempt();
			mountHost();

			autosave.schedule(state.attempt, 'during call');
			vi.advanceTimersByTime(AUTOSAVE_DEBOUNCE_MS);
			state.attempt.state = JobState.Closed;
			await tick();
			enterProcessing(state.attempt);
			await tick();

			expect(save).not.toHaveBeenCalled();
		});

		it('are dropped by cancel (manual submit during the call)', async () => {
			state.attempt = createActiveCallAttempt();
			mountHost();

			autosave.schedule(state.attempt, 'during call');
			vi.advanceTimersByTime(AUTOSAVE_DEBOUNCE_MS);
			autosave.cancel();
			enterProcessing(state.attempt);
			await tick();

			expect(save).not.toHaveBeenCalled();
		});

		it('of a previous task do not replace the pending save of the current one', async () => {
			const attemptA = createActiveCallAttempt();
			state.attempt = attemptA;
			mountHost();

			autosave.schedule(attemptA, 'payload A');
			vi.advanceTimersByTime(AUTOSAVE_DEBOUNCE_MS);
			const attemptB = createAttempt({
				id: 2,
			});
			state.attempt = attemptB;
			await nextTick();
			autosave.schedule(attemptB, 'payload B');
			enterProcessing(attemptA);
			await tick();
			expect(save).toHaveBeenCalledWith(attemptA, 'payload A');

			vi.advanceTimersByTime(AUTOSAVE_DEBOUNCE_MS);
			expect(save).toHaveBeenCalledWith(attemptB, 'payload B');
			expect(save).toHaveBeenCalledTimes(2);
		});
	});
});
