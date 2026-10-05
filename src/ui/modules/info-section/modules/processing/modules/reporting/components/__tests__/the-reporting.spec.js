import { mount, shallowMount } from '@vue/test-utils';
import deepmerge from 'deepmerge';
import { nextTick, reactive } from 'vue';
import { createStore } from 'vuex';
import { JobState } from 'webitel-sdk';

import {
	AUTOSAVE_BEFORE_TIMEOUT_MS,
	AUTOSAVE_DEBOUNCE_MS,
} from '../../../../script/processingAutosave';
import ReportingForm from '../../store/ReportingForm';
import FailureForm from '../reporting-failure-form.vue';
import TheReporting from '../the-reporting.vue';

const mockReporingForm = vi.fn();
const taskOnWorkspace = {
	allowReporting: true,
	reporting: mockReporingForm,
	task: {
		reportedAt: 0,
	},
};
let reporting = new ReportingForm(taskOnWorkspace);
taskOnWorkspace.postProcessData = reporting;

const props = {
	task: taskOnWorkspace,
};

const computed = {
	...TheReporting.computed,
	isTaskReporting: () => true,
	taskPostProcessing() {
		return reporting;
	},
	reportingSent: () => false,
};

const NOW = 1_000_000;
const store = createStore({
	modules: {
		workspace: {
			namespaced: true,
			// state, not a closure: the store outlives tests and caches getters
			state: {
				isCall: true,
			},
			getters: {
				IS_CALL_WORKSPACE: (state) => state.isCall,
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
			},
		},
	},
});

const options = {
	props,
	computed,
};

// the store is passed outside deepmerge, which would clone it into a plain object
const withStore = (mountOptions) => ({
	...mountOptions,
	global: {
		plugins: [
			store,
		],
	},
});

const initReportingFormMock = vi.fn();
vi.spyOn(TheReporting.methods, 'initReportingForm').mockImplementation(
	initReportingFormMock,
);

describe('TheReport appearance and form setting', () => {
	beforeEach(() => {
		initReportingFormMock.mockClear();
	});

	it('post processing immediately calls initReportingForm', () => {
		shallowMount(TheReporting, withStore(options));
		expect(initReportingFormMock).toHaveBeenCalled();
	});

	// https://github.com/vuejs/vue-test-utils/issues/331#issuecomment-382037200
	// it('post processing calls initReportingForm after isTaskReporingForm getter change', async () => {});

	it('should render report button color "secondary"', () => {
		const wrapper = shallowMount(
			TheReporting,
			withStore(
				deepmerge(options, {
					computed: {
						reportingSent() {
							return 1;
						},
					},
				}),
			),
		);
		const { reportButtonColor } = wrapper.vm;
		expect(reportButtonColor).toBe('secondary');
	});

	it('should render report button text "Edit"', () => {
		const wrapper = shallowMount(
			TheReporting,
			withStore(
				deepmerge(options, {
					computed: {
						reportingSent() {
							return 1;
						},
					},
				}),
			),
		);
		const { reportButtonText } = wrapper.vm;
		expect(reportButtonText).toBe('Edit');
	});

	it('should render report button color "primary"', () => {
		const wrapper = shallowMount(TheReporting, withStore(options));
		const { reportButtonColor } = wrapper.vm;
		expect(reportButtonColor).toBe('primary');
	});

	it('should render report button text "Send"', () => {
		const wrapper = shallowMount(TheReporting, withStore(options));
		const { reportButtonText } = wrapper.vm;
		expect(reportButtonText).toBe('Send');
	});
});

describe('Post processing Success reporting', () => {
	let sendReportMock;

	beforeEach(() => {
		initReportingFormMock.mockClear();
	});

	// restored even when the test fails, so later tests get the real sendReporting
	afterEach(() => {
		sendReportMock?.mockRestore();
	});

	it('At success submit, calls taskOnWorkspace sendReport() method', () => {
		sendReportMock = vi
			.spyOn(TheReporting.methods, 'sendReporting')
			.mockImplementation(() => {});
		const wrapper = mount(TheReporting, withStore(options));
		wrapper
			.findAllComponents({
				name: 'wt-button',
			})
			.at(-1)
			.vm.$emit('click');
		expect(sendReportMock).toHaveBeenCalled();
	});
});

describe('Post processing Failure reporting', () => {
	afterEach(() => {
		reporting = new ReportingForm(taskOnWorkspace);
	});

	it('post processing failure form is initially invisible', async () => {
		const wrapper = mount(
			TheReporting,
			withStore({
				...options,
				attachTo: document.body,
			}),
		);
		const failureForm = wrapper.findComponent(FailureForm);
		expect(failureForm.isVisible()).toBe(false);
	});

	it('post processing failure form is shown if reporting.success is falsy', async () => {
		reporting.success = false;
		const wrapper = mount(TheReporting, withStore(options));
		await wrapper.vm.$nextTick(); // re-render
		const failureForm = wrapper.findComponent(FailureForm);
		expect(failureForm.exists()).toBe(true);
	});
});

describe('Default form draft autosave', () => {
	let task;

	const createTask = (attemptOverrides = {}) =>
		reactive({
			allowReporting: true,
			reporting: vi.fn(),
			postProcessData: new ReportingForm(),
			attempt: {
				id: 1,
				state: JobState.Processing,
				processingAutosave: true,
				processingTimeoutAt: NOW + 60_000,
				reportedAt: 0,
				reportingDraft: vi.fn(() => Promise.resolve()),
				...attemptOverrides,
			},
		});

	const mountReporting = () =>
		shallowMount(
			TheReporting,
			withStore({
				props: {
					task,
				},
			}),
		);

	beforeEach(() => {
		vi.useFakeTimers();
		vi.setSystemTime(NOW);
		store.state.workspace.isCall = true;
		store.state.ui.now.now = NOW;
		task = createTask();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('sends a draft after the agent stops editing a call report', async () => {
		const wrapper = mountReporting();

		task.postProcessData.success = false;
		task.postProcessData.description = 'callback later';
		await nextTick();
		expect(task.attempt.reportingDraft).not.toHaveBeenCalled();

		vi.advanceTimersByTime(AUTOSAVE_DEBOUNCE_MS);
		expect(task.attempt.reportingDraft).toHaveBeenCalledTimes(1);
		expect(task.attempt.reportingDraft).toHaveBeenCalledWith(
			task.postProcessData.generateReporting(),
		);
		expect(task.reporting).not.toHaveBeenCalled();
		expect(wrapper.vm.reportButtonText).toBe('Send');
	});

	it('sends nothing for an untouched form, even near the deadline', async () => {
		mountReporting();

		store.state.ui.now.now =
			task.attempt.processingTimeoutAt - AUTOSAVE_BEFORE_TIMEOUT_MS;
		await nextTick();
		vi.advanceTimersByTime(AUTOSAVE_DEBOUNCE_MS);

		expect(task.attempt.reportingDraft).not.toHaveBeenCalled();
	});

	it('flushes a pending draft when the deadline is near', async () => {
		mountReporting();

		task.postProcessData.description = 'note';
		await nextTick();
		store.state.ui.now.now =
			task.attempt.processingTimeoutAt - AUTOSAVE_BEFORE_TIMEOUT_MS;
		await nextTick();

		expect(task.attempt.reportingDraft).toHaveBeenCalledTimes(1);
	});

	it('does not send drafts for chats and jobs', async () => {
		store.state.workspace.isCall = false;
		const wrapper = mountReporting();

		task.postProcessData.description = 'note';
		await nextTick();
		vi.advanceTimersByTime(AUTOSAVE_DEBOUNCE_MS);
		wrapper.unmount();

		expect(task.attempt.reportingDraft).not.toHaveBeenCalled();
	});

	it('does not send drafts after a real report', async () => {
		task.attempt.reportedAt = NOW - 1000;
		const wrapper = mountReporting();

		task.postProcessData.description = 'edited after send';
		await nextTick();
		vi.advanceTimersByTime(AUTOSAVE_DEBOUNCE_MS);
		wrapper.unmount();

		expect(task.attempt.reportingDraft).not.toHaveBeenCalled();
	});

	it('Send cancels the pending draft and reports as before', async () => {
		const wrapper = mountReporting();

		task.postProcessData.description = 'final';
		await nextTick();
		wrapper.vm.sendReporting();
		vi.advanceTimersByTime(AUTOSAVE_DEBOUNCE_MS);

		expect(task.reporting).toHaveBeenCalledWith(
			task.postProcessData.generateReporting(),
		);
		expect(task.attempt.reportingDraft).not.toHaveBeenCalled();
	});

	it('saves the previous task and sends nothing for the next one on switch', async () => {
		const taskA = task;
		const wrapper = mountReporting();

		taskA.postProcessData.description = 'value A';
		await nextTick();
		const taskB = createTask({
			id: 2,
		});
		await wrapper.setProps({
			task: taskB,
		});

		expect(taskA.attempt.reportingDraft).toHaveBeenCalledWith(
			expect.objectContaining({
				description: 'value A',
			}),
		);
		vi.advanceTimersByTime(AUTOSAVE_DEBOUNCE_MS);
		expect(taskB.attempt.reportingDraft).not.toHaveBeenCalled();
	});

	describe('when the report is filled during the call', () => {
		const startCall = () => {
			Object.assign(task.attempt, {
				state: JobState.Bridged,
				processingAutosave: false,
				processingTimeoutAt: null,
			});
		};
		const endCall = async () => {
			Object.assign(task.attempt, {
				state: JobState.Processing,
				processingAutosave: true,
				processingTimeoutAt: NOW + 60_000,
			});
			store.state.ui.now.now += 1000;
			await nextTick();
		};

		it('sends the draft once postprocessing starts', async () => {
			startCall();
			mountReporting();

			task.postProcessData.description = 'during call';
			await nextTick();
			vi.advanceTimersByTime(AUTOSAVE_DEBOUNCE_MS);
			expect(task.attempt.reportingDraft).not.toHaveBeenCalled();

			await endCall();
			expect(task.attempt.reportingDraft).toHaveBeenCalledWith(
				expect.objectContaining({
					description: 'during call',
				}),
			);
		});

		it('sends no draft after Send during the call', async () => {
			startCall();
			const wrapper = mountReporting();

			task.postProcessData.description = 'during call';
			await nextTick();
			vi.advanceTimersByTime(AUTOSAVE_DEBOUNCE_MS);
			wrapper.vm.sendReporting();
			await endCall();

			expect(task.reporting).toHaveBeenCalledTimes(1);
			expect(task.attempt.reportingDraft).not.toHaveBeenCalled();
		});
	});
});
