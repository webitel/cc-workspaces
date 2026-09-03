import { autosaveProcessingForms } from '../processingAutosave.js';

const makeTask = ({
	id = 1,
	autosave = true,
	timeoutAt = 10_000,
	fields = {
		a: '1',
	},
	form = {
		fields,
	},
} = {}) => ({
	attempt: {
		id,
		form,
		_processing: {
			autosave,
			timeout: timeoutAt,
		},
		processingTimeoutAt: timeoutAt,
		saveForm: vi.fn(),
	},
});

describe('autosaveProcessingForms', () => {
	it('saves form when timeout is due and autosave is enabled', () => {
		const task = makeTask({
			timeoutAt: 10_000,
		});
		const saved = new Map();

		autosaveProcessingForms({
			tasks: [
				task,
			],
			now: 9_500,
			saved,
		});

		expect(task.attempt.saveForm).toHaveBeenCalledWith(null, {
			a: '1',
		});
	});

	it('does not save when timeout is not due yet', () => {
		const task = makeTask({
			timeoutAt: 10_000,
		});
		const saved = new Map();

		autosaveProcessingForms({
			tasks: [
				task,
			],
			now: 5_000,
			saved,
		});

		expect(task.attempt.saveForm).not.toHaveBeenCalled();
	});

	it('does not save when autosave is disabled', () => {
		const task = makeTask({
			autosave: false,
		});
		const saved = new Map();

		autosaveProcessingForms({
			tasks: [
				task,
			],
			now: 9_500,
			saved,
		});

		expect(task.attempt.saveForm).not.toHaveBeenCalled();
	});

	it('does not save when task has no form', () => {
		const task = makeTask({
			form: null,
		});
		const saved = new Map();

		autosaveProcessingForms({
			tasks: [
				task,
			],
			now: 9_500,
			saved,
		});

		expect(task.attempt.saveForm).not.toHaveBeenCalled();
	});

	it('saves once per attempt timeout', () => {
		const task = makeTask({
			timeoutAt: 10_000,
		});
		const saved = new Map();

		autosaveProcessingForms({
			tasks: [
				task,
			],
			now: 9_500,
			saved,
		});
		autosaveProcessingForms({
			tasks: [
				task,
			],
			now: 10_000,
			saved,
		});

		expect(task.attempt.saveForm).toHaveBeenCalledTimes(1);
	});

	it('saves again after prolongation shifts the timeout', () => {
		const task = makeTask({
			timeoutAt: 10_000,
		});
		const saved = new Map();

		autosaveProcessingForms({
			tasks: [
				task,
			],
			now: 9_500,
			saved,
		});

		task.attempt.processingTimeoutAt = 20_000;
		autosaveProcessingForms({
			tasks: [
				task,
			],
			now: 19_500,
			saved,
		});

		expect(task.attempt.saveForm).toHaveBeenCalledTimes(2);
	});

	it('formats form body when form has no fields (non-call tasks)', () => {
		const body = [
			{
				id: 'comment',
				value: 'text value',
				view: {
					component: 'wt-input',
				},
			},
		];
		const task = makeTask({
			form: {
				body,
			},
		});
		const saved = new Map();

		autosaveProcessingForms({
			tasks: [
				task,
			],
			now: 9_500,
			saved,
		});

		expect(task.attempt.saveForm).toHaveBeenCalledTimes(1);
		const [, fields] = task.attempt.saveForm.mock.calls[0];
		expect(fields).toEqual({
			comment: 'text value',
		});
	});

	it('prunes registry entries for attempts that left the task list', () => {
		const task = makeTask({
			id: 42,
		});
		const saved = new Map();

		autosaveProcessingForms({
			tasks: [
				task,
			],
			now: 9_500,
			saved,
		});
		expect(saved.has(42)).toBe(true);

		autosaveProcessingForms({
			tasks: [],
			now: 11_000,
			saved,
		});
		expect(saved.has(42)).toBe(false);
	});
});
