import WorkspaceStates from '../../../../../ui/enums/WorkspaceState.enum';
import jobModule from '../job';

const job = {
  id: '1',
};

describe('features/job store: actions', () => {
  const context = {
    state: { jobOnWorkspace: job },
    dispatch: jest.fn(),
    commit: jest.fn(),
  };

  beforeEach(() => {
    context.state = { jobOnWorkspace: job };
    context.dispatch.mockClear();
    context.commit.mockClear();
  });

  it('OPEN_JOB dispatches SET_WORKSPACE_STATE action with passed job as param', () => {
    jobModule.actions.OPEN_JOB(context, job);
    expect(context.dispatch).toHaveBeenCalledWith('workspace/SET_WORKSPACE_STATE', WorkspaceStates.JOB, { root: true });
  });

  it('REMOVE_JOB commits REMOVE_JOB mutation', () => {
    jobModule.actions.REMOVE_JOB(context, job);
    expect(context.commit).toHaveBeenCalledWith('REMOVE_JOB', job);
  });

  it('RESET_WORKSPACE dispatches RESET_WORKSPACE_STATE action with passed null as param', () => {
    jobModule.actions.RESET_WORKSPACE(context, job);
    expect(context.dispatch).toHaveBeenCalledWith('workspace/RESET_WORKSPACE_STATE', null, { root: true });
  });
});
