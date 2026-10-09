import { shallowMount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { createStore } from 'vuex';
import { JobState } from 'webitel-sdk';

import { formattingFormBeforeSend } from '../../../../script/formattingFormBeforeSend';
import {
	AUTOSAVE_BEFORE_TIMEOUT_MS,
	AUTOSAVE_DEBOUNCE_MS,
} from '../../../../script/processingAutosave';
import TheProcessingForm from '../the-processing-form.vue';

const NOW = 1_000_000;

const createAttempt = (overrides = {}) => ({
	id: 1,
	state: JobState.Processing,
	processingAutosave: true,
	processingTimeoutAt: NOW + 60_000,
	saveForm: vi.fn(() => Promise.resolve()),
	form: {
		body: [],
		actions: [],
	},
	...overrides,
});

const createInput = (value = '') => ({
	id: 'field',
	value,
	view: {
		component: 'wt-input',
	},
});

describe('TheProcessingForm', () => {
	let store;
	let task;
	let isCall;
	let sendFormAction;

	const mountForm = (props = {}) =>
		shallowMount(TheProcessingForm, {
			props: {
				task,
				...props,
			},
			global: {
				plugins: [
					store,
				],
			},
		});

	beforeEach(() => {
		vi.useFakeTimers();
		vi.setSystemTime(NOW);
		isCall = true;
		sendFormAction = vi.fn();
		store = createStore({
			modules: {
				workspace: {
					namespaced: true,
					getters: {
						IS_CALL_WORKSPACE: () => isCall,
					},
				},
				ui: {
					namespaced: true,
					modules: {
						now: {
							namespaced: true,
							state: {
								now: NOW,
							},
						},
						infoSec: {
							namespaced: true,
							modules: {
								processing: {
									namespaced: true,
									modules: {
										form: {
											namespaced: true,
											actions: {
												SEND_FORM: sendFormAction,
											},
										},
									},
								},
							},
						},
					},
				},
			},
		});
		task = {
			attempt: createAttempt(),
		};
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('renders a component', () => {
		const wrapper = mountForm();
		expect(wrapper.isVisible()).toBe(true);
	});

	it('initializes components with initialValues', () => {
		const value = 'jest';
		const component = {
			value: '',
			view: {
				initialValue: value,
			},
		};
		task.attempt.form.body.push(component);
		mountForm();
		expect(component.value).toBe(value);
	});

	describe('autosave', () => {
		const typeInto = async (wrapper, el, value) => {
			wrapper.vm.change({
				el,
				value,
			});
			await nextTick();
		};

		it('saves form fields after the agent stops typing', async () => {
			const el = createInput();
			task.attempt.form.body.push(el);
			const wrapper = mountForm();

			await typeInto(wrapper, el, 'hello');
			expect(task.attempt.saveForm).not.toHaveBeenCalled();

			vi.advanceTimersByTime(AUTOSAVE_DEBOUNCE_MS);
			expect(task.attempt.saveForm).toHaveBeenCalledWith(
				null,
				formattingFormBeforeSend(task.attempt.form.body),
			);
		});

		it('saves for chats and jobs too', async () => {
			isCall = false;
			const el = createInput();
			task.attempt.form.body.push(el);
			const wrapper = mountForm();

			await typeInto(wrapper, el, 'hello');
			vi.advanceTimersByTime(AUTOSAVE_DEBOUNCE_MS);

			expect(task.attempt.saveForm).toHaveBeenCalledTimes(1);
		});

		it('does not save when queue autosave is off', async () => {
			task.attempt.processingAutosave = false;
			const el = createInput();
			task.attempt.form.body.push(el);
			const wrapper = mountForm();

			await typeInto(wrapper, el, 'hello');
			vi.advanceTimersByTime(AUTOSAVE_DEBOUNCE_MS);
			wrapper.unmount();

			expect(task.attempt.saveForm).not.toHaveBeenCalled();
		});

		it('flushes a pending save when the deadline is near', async () => {
			const el = createInput();
			task.attempt.form.body.push(el);
			const wrapper = mountForm();

			await typeInto(wrapper, el, 'hello');
			store.state.ui.now.now =
				task.attempt.processingTimeoutAt - AUTOSAVE_BEFORE_TIMEOUT_MS - 1;
			await nextTick();
			expect(task.attempt.saveForm).not.toHaveBeenCalled();

			store.state.ui.now.now =
				task.attempt.processingTimeoutAt - AUTOSAVE_BEFORE_TIMEOUT_MS;
			await nextTick();
			expect(task.attempt.saveForm).toHaveBeenCalledTimes(1);
		});

		it('cancels a pending save before a form action', async () => {
			const el = createInput();
			task.attempt.form.body.push(el);
			const wrapper = mountForm();
			const action = {
				id: 'next',
			};

			await typeInto(wrapper, el, 'hello');
			wrapper.vm.sendForm({
				action,
				task,
			});
			vi.advanceTimersByTime(AUTOSAVE_DEBOUNCE_MS);

			expect(sendFormAction).toHaveBeenCalledWith(expect.anything(), {
				action,
				task,
			});
			expect(task.attempt.saveForm).not.toHaveBeenCalled();
		});

		it('saves the previous task when the component switches to another task', async () => {
			const elA = createInput();
			task.attempt.form.body.push(elA);
			const attemptA = task.attempt;
			const wrapper = mountForm();

			await typeInto(wrapper, elA, 'value A');
			const attemptB = createAttempt({
				id: 2,
			});
			await wrapper.setProps({
				task: {
					attempt: attemptB,
				},
			});

			expect(attemptA.saveForm).toHaveBeenCalledWith(null, {
				field: 'value A',
			});
			expect(attemptB.saveForm).not.toHaveBeenCalled();
		});

		it('saves values entered during the call once postprocessing starts', async () => {
			Object.assign(task.attempt, {
				state: JobState.Bridged,
				processingAutosave: false,
				processingTimeoutAt: null,
			});
			const el = createInput();
			task.attempt.form.body.push(el);
			const wrapper = mountForm();

			await typeInto(wrapper, el, 'during call');
			vi.advanceTimersByTime(AUTOSAVE_DEBOUNCE_MS);
			expect(task.attempt.saveForm).not.toHaveBeenCalled();

			Object.assign(task.attempt, {
				state: JobState.Processing,
				processingAutosave: true,
				processingTimeoutAt: NOW + 60_000,
			});
			store.state.ui.now.now += 1000;
			await nextTick();

			expect(task.attempt.saveForm).toHaveBeenCalledWith(null, {
				field: 'during call',
			});
		});
	});
});
