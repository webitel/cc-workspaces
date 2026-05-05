import contextMock from '../../../../../../../../../../tests/unit/mocks/store/contextMock';
import ReportingForm from '../ReportingForm';
import reportingModule from '../reporting';

describe('reporting module: actions', () => {
	let context;

	beforeEach(() => {
		context = contextMock(vi);
	});

	it('initializes reporting form when processing is allowed and form is empty', async () => {
		const task = {};
		context.rootGetters = {
			'workspace/TASK_ON_WORKSPACE': task,
			'ui/infoSec/processing/ALLOW_PROCESSING': true,
		};
		await reportingModule.actions.INIT_REPORTING_FORM(context, task);
		expect(task.postProcessData).toBeTruthy();
		expect(task.postProcessData).toBeInstanceOf(ReportingForm);
	});

	it('keeps existing postProcessData instance if it already exists', async () => {
		const postProcessData = {
			jest: 'jest',
		};
		const task = {
			postProcessData,
		};
		context.rootGetters = {
			'workspace/TASK_ON_WORKSPACE': task,
			'ui/infoSec/processing/ALLOW_PROCESSING': true,
		};
		await reportingModule.actions.INIT_REPORTING_FORM(context, task);
		expect(task.postProcessData).toBeTruthy();
		expect(task.postProcessData).toEqual(postProcessData);
	});

	it('does not init postProcessData when processing is not allowed', async () => {
		const task = {};
		context.rootGetters = {
			'workspace/TASK_ON_WORKSPACE': task,
			'ui/infoSec/processing/ALLOW_PROCESSING': false,
		};
		await reportingModule.actions.INIT_REPORTING_FORM(context, task);
		expect(task.postProcessData).toBeUndefined();
	});

	it('uses workspace task from rootGetters when task arg is omitted', async () => {
		const task = {};
		context.rootGetters = {
			'workspace/TASK_ON_WORKSPACE': task,
			'ui/infoSec/processing/ALLOW_PROCESSING': true,
		};
		await reportingModule.actions.INIT_REPORTING_FORM(context);
		expect(task.postProcessData).toBeInstanceOf(ReportingForm);
	});
});
