import AgentStatusAPI from '../../../../src/api/agent-workspace/agent-info/agent-status';
import AgentPauseCauseAPI from '../../../../src/api/agent-workspace/agent-info/agent-pause-causes';
import AgentQueuesAPI from '../../../../src/api/agent-workspace/agent-info/agent-queues';
import agentInfo from '../../../../src/store/modules/agent-info/agent-info';
import getContextMock from '../../mocks/store/contextMock';

describe('Agent Info Module: Actions', () => {
  let context;
  beforeEach(() => {
    context = getContextMock(jest);
  });
  it('LOAD_AGENT_INFO dispatches LOAD_STATUS', () => {
    agentInfo.actions.LOAD_AGENT_INFO(context);
    expect(context.dispatch).toHaveBeenCalledWith('LOAD_STATUS');
  });
  it('LOAD_AGENT_INFO dispatches LOAD_PAUSE_CAUSES', () => {
    agentInfo.actions.LOAD_AGENT_INFO(context);
    expect(context.dispatch).toHaveBeenCalledWith('LOAD_PAUSE_CAUSES');
  });
  it('LOAD_AGENT_INFO dispatches LOAD_QUEUES', () => {
    agentInfo.actions.LOAD_AGENT_INFO(context);
    expect(context.dispatch).toHaveBeenCalledWith('LOAD_QUEUES');
  });
  it('LOAD_STATUS calls AgentStatus API and commits response to SET_AGENT_STATUS', async () => {
    const response = { jest: 'jest' };
    const getMock = jest.fn(() => response);
    AgentStatusAPI.get = getMock;
    await agentInfo.actions.LOAD_STATUS(context);
    expect(getMock).toHaveBeenCalled();
    expect(context.commit).toHaveBeenCalledWith('SET_AGENT_STATUS', response);
  });
  it('LOAD_PAUSE_CAUSES calls AgentPauseCause API and commits response to SET_PAUSE_CAUSES', async () => {
    const response = { items: [] };
    const getListMock = jest.fn(() => response);
    AgentPauseCauseAPI.getList = getListMock;
    await agentInfo.actions.LOAD_PAUSE_CAUSES(context);
    expect(getListMock).toHaveBeenCalled();
    expect(context.commit).toHaveBeenCalledWith('SET_PAUSE_CAUSES', response.items);
  });
  it('LOAD_QUEUES calls AgentQueues API and commits response to SET_QUEUES', async () => {
    const response = { items: [] };
    const getListMock = jest.fn(() => response);
    AgentQueuesAPI.getList = getListMock;
    await agentInfo.actions.LOAD_QUEUES(context);
    expect(getListMock).toHaveBeenCalled();
    expect(context.commit).toHaveBeenCalledWith('SET_QUEUES', response.items);
  });
});

describe('Agent Info Module: Mutation', () => {
  let state;
  beforeEach(() => {
    state = {};
  });
  it('SET_AGENT_STATUS sets passed status to state', () => {
    const status = { status: 'jest' };
    agentInfo.mutations.SET_AGENT_STATUS(state, status);
    expect(state.status).toEqual(status);
  });
  it('SET_PAUSE_CAUSES sets passed pauseCauses to state', () => {
    const pauseCauses = [{ name: 'jest' }];
    agentInfo.mutations.SET_PAUSE_CAUSES(state, pauseCauses);
    expect(state.pauseCauses).toEqual(pauseCauses);
  });
  it('SET_QUEUES sets passed pauseCauses to state', () => {
    const queues = [{ name: 'jest' }];
    agentInfo.mutations.SET_QUEUES(state, queues);
    expect(state.queues).toEqual(queues);
  });
});