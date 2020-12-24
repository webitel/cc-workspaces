import reportingModule from '../../../../src/store/modules/post-processing/post-processing';

const comm = { id: '123' };
const member = { communications: [comm] };

const call = {
  id: '1',
  reporting: jest.fn(),
  getMember: jest.fn(() => member),
};

const reportingState = {
  isSuccess: true,
  description: 'jest',
};

describe('reporting store: actions', () => {
  const context = {
    state: {},
    rootGetters: {
      'workspace/TASK_ON_WORKSPACE': call,
    },
    getters: {
      IS_MEMBER: false,
    },
    dispatch: jest.fn(),
    commit: jest.fn(),
  };

  beforeEach(() => {
    context.state = reportingState;
    context.getters.IS_MEMBER = false;
    call.reporting.mockClear();
    call.getMember.mockClear();
    context.dispatch.mockClear();
    context.commit.mockClear();
  });

  it('SEND_REPORTING calls task\'s reporting() method', () => {
    const finalReporting = {
      success: reportingState.isSuccess,
      description: reportingState.description,
    };
    reportingModule.actions.SEND_REPORTING(context);
    expect(call.reporting).toHaveBeenCalledWith(finalReporting);
  });

  it(`if IS_MEMBER getter is true, SEND_REPORTING calls task's reporting() method
   with communications values`, () => {
    context.state = {
      isSuccess: true,
      description: 'jest',
      communicationsList: [comm],
      nextCommunication: comm,
    };
    context.getters.IS_MEMBER = true;
    const finalReporting = {
      success: true,
      description: 'jest',
      communications: [comm],
      nextCommunication: comm,
    };
    reportingModule.actions.SEND_REPORTING(context);
    expect(call.reporting).toHaveBeenCalledWith(finalReporting);
  });

  it(`if isScheduleCall state variable is true, SEND_REPORTING calls task's reporting() method
   with communications values`, () => {
    const nextDistributeAt = Date.now();
    context.state = {
      isSuccess: true,
      description: 'jest',
      isScheduleCall: true,
      nextDistributeAt,
    };
    const finalReporting = {
      success: true,
      description: 'jest',
      nextDistributeAt,
    };
    reportingModule.actions.SEND_REPORTING(context);
    expect(call.reporting).toHaveBeenCalledWith(finalReporting);
  });

  it('LOAD_COMMUNICATIONS_LIST calls task\'s getMember() method', async () => {
    await reportingModule.actions.LOAD_COMMUNICATIONS_LIST(context);
    expect(call.getMember).toHaveBeenCalled();
  });

  it('LOAD_COMMUNICATIONS_LIST commits LOAD_COMMUNICATIONS_LIST with received communications', async () => {
    await reportingModule.actions.LOAD_COMMUNICATIONS_LIST(context);
    expect(context.commit).toHaveBeenCalledWith('SET_COMMUNICATIONS_LIST', member.communications);
  });

  it('SET_NEXT_COMMUNICATION commits SET_PROPERTY with received communications', () => {
    const payload = {
      prop: 'nextCommunication',
      value: comm,
    };
    reportingModule.actions.SET_NEXT_COMMUNICATION(context, comm);
    expect(context.commit).toHaveBeenCalledWith('SET_PROPERTY', payload);
  });

  it('BEGIN_COMMUNICATION_ADDING commits SET_PROPERTY with truthy isNewCommunication value', () => {
    const payload = {
      prop: 'isNewCommunication',
      value: true,
    };
    reportingModule.actions.BEGIN_COMMUNICATION_ADDING(context);
    expect(context.commit).toHaveBeenCalledWith('SET_PROPERTY', payload);
  });

  it('BEGIN_COMMUNICATION_EDIT commits SET_PROPERTY with received communication', () => {
    const payload = {
      prop: 'editedCommunication',
      value: comm,
    };
    reportingModule.actions.BEGIN_COMMUNICATION_EDIT(context, comm);
    expect(context.commit).toHaveBeenCalledWith('SET_PROPERTY', payload);
  });

  it('ADD_COMMUNICATION commits ADD_COMMUNICATION with received communication', () => {
    reportingModule.actions.ADD_COMMUNICATION(context, comm);
    expect(context.commit).toHaveBeenCalledWith('ADD_COMMUNICATION', comm);
  });

  it('ADD_COMMUNICATION dispatches CLOSE_COMMUNICATION_ACTIONS', () => {
    reportingModule.actions.ADD_COMMUNICATION(context);
    expect(context.dispatch).toHaveBeenCalledWith('CLOSE_COMMUNICATION_ACTIONS');
  });

  it('EDIT_COMMUNICATION commits EDIT_COMMUNICATION with received communication', () => {
    reportingModule.actions.EDIT_COMMUNICATION(context, comm);
    expect(context.commit).toHaveBeenCalledWith('EDIT_COMMUNICATION', comm);
  });

  it('EDIT_COMMUNICATION dispatches CLOSE_COMMUNICATION_ACTIONS', () => {
    reportingModule.actions.EDIT_COMMUNICATION(context);
    expect(context.dispatch).toHaveBeenCalledWith('CLOSE_COMMUNICATION_ACTIONS');
  });

  it(`if nextCommunication is editedCommunication, EDIT_COMMUNICATION
  dispatches SET_NEXT_COMMUNICATION to update this value`, () => {
    context.state.editedCommunication = comm;
    context.state.nextCommunication = comm;
    const editedComm = { id: '321' };
    reportingModule.actions.EDIT_COMMUNICATION(context, editedComm);
    expect(context.dispatch).toHaveBeenCalledWith('SET_NEXT_COMMUNICATION', editedComm);
  });

  it('DELETE_COMMUNICATION commits DELETE_COMMUNICATION with received communication', () => {
    reportingModule.actions.DELETE_COMMUNICATION(context, comm);
    expect(context.commit).toHaveBeenCalledWith('DELETE_COMMUNICATION', comm);
  });

  it('DELETE_COMMUNICATION commits DELETE_COMMUNICATION with received communication', () => {
    reportingModule.actions.DELETE_COMMUNICATION(context, comm);
    expect(context.commit).toHaveBeenCalledWith('DELETE_COMMUNICATION', comm);
  });

  it(`CLOSE_COMMUNICATION_ACTIONS commits SET_PROPERTY with false isNewCommunication
    value, if it's truthy`, () => {
    context.state.isNewCommunication = true;
    const payload = {
      prop: 'isNewCommunication',
      value: false,
    };
    reportingModule.actions.CLOSE_COMMUNICATION_ACTIONS(context);
    expect(context.commit).toHaveBeenCalledWith('SET_PROPERTY', payload);
  });

  it(`CLOSE_COMMUNICATION_ACTIONS commits SET_PROPERTY with null editedCommunication
    value, communication on popup -- isn't new`, () => {
    context.state.isNewCommunication = false;
    const payload = {
      prop: 'editedCommunication',
      value: null,
    };
    reportingModule.actions.CLOSE_COMMUNICATION_ACTIONS(context);
    expect(context.commit).toHaveBeenCalledWith('SET_PROPERTY', payload);
  });

  it('SET_PROPERTY commits SET_PROPERTY with received value', () => {
    const value = '123';
    reportingModule.actions.SET_PROPERTY(context, value);
    expect(context.commit).toHaveBeenCalledWith('SET_PROPERTY', value);
  });
});

describe('reporting store: mutations', () => {
  it('SET_COMMUNICATIONS_LIST sets communicationsList to state', () => {
    const commList = [comm];
    const state = { communicationsList: [] };
    reportingModule.mutations.SET_COMMUNICATIONS_LIST(state, commList);
    expect(state.communicationsList).toEqual(commList);
  });

  it('ADD_COMMUNICATION adds passed comm to the end of communicationsLit', () => {
    const commList = [comm];
    const state = { communicationsList: [] };
    reportingModule.mutations.ADD_COMMUNICATION(state, comm);
    expect(state.communicationsList).toEqual(commList);
  });

  it('EDIT_COMMUNICATION replaced passed comm with editedComm in communicationsLit', () => {
    const editedComm = { id: 'edited-comm' };
    const commList = [comm];
    const state = { communicationsList: [editedComm], editedCommunication: editedComm };
    reportingModule.mutations.EDIT_COMMUNICATION(state, comm);
    expect(state.communicationsList).toEqual(commList);
  });
});
