import WorkspaceStates from '../../../../../ui/enums/WorkspaceState.enum';
import jobModule from '../job';

const job = {
	id: '1',
};

describe('features/job store: actions', () => {
	const context = {
		getters: {
			JOB_ON_WORKSPACE: job,
		},
		dispatch: vi.fn(),
		commit: vi.fn(),
	};

	beforeEach(() => {
		context.getters = {
			JOB_ON_WORKSPACE: job,
		};
		context.dispatch.mockClear();
		context.commit.mockClear();
	});

	it('OPEN_JOB dispatches SET_WORKSPACE_STATE action with passed job as param', () => {
		jobModule.actions.OPEN_JOB(context, job);
		expect(context.dispatch).toHaveBeenCalledWith(
			'workspace/SET_WORKSPACE_STATE',
			{
				type: WorkspaceStates.JOB,
				task: job,
			},
			{
				root: true,
			},
		);
	});

	it('REMOVE_JOB dispatches RESET_WORKSPACE mutation if passed job is equal to job on workspace', () => {
		jobModule.actions.REMOVE_JOB(context, job);
		expect(context.dispatch).toHaveBeenCalledWith('RESET_WORKSPACE');
	});

	it('RESET_WORKSPACE dispatches RESET_WORKSPACE_STATE action with passed null as param', () => {
		jobModule.actions.RESET_WORKSPACE(context, job);
		expect(context.dispatch).toHaveBeenCalledWith(
			'workspace/RESET_WORKSPACE_STATE',
			null,
			{
				root: true,
			},
		);
	});
});
