import reportingModule from '../reporting';

describe('features/reporting: getters', () => {
  let reporting;
  let taskOnWorkspace;
  let rootGetters;

  beforeEach(() => {
    reporting = { jest: 'jest' };
    taskOnWorkspace = { postProcessData: reporting };
    rootGetters = { 'workspace/TASK_ON_WORKSPACE': taskOnWorkspace };
  });

  it('correctly computes TASK_REPORTING', () => {
    expect(reportingModule.getters.TASK_REPORTING(null, null, null, rootGetters))
      .toEqual(reporting);
  });

  it('correctly computes IS_MEMBER', () => {
    const isMember = 'jest';
    taskOnWorkspace.isMember = isMember;
    expect(reportingModule.getters.IS_MEMBER(null, null, null, rootGetters))
      .toBe(isMember);
  });

  it('correctly computes IS_COMMUNICATION_POPUP with isNewCommunication = true', () => {
    reporting.isNewCommunication = true;
    const getters = { TASK_REPORTING: reporting };

    expect(reportingModule.getters.IS_COMMUNICATION_POPUP(null, getters))
      .toBeTruthy();
  });

  it('correctly computes IS_COMMUNICATION_POPUP with editedCommunication', () => {
    reporting.editedCommunication = {};
    const getters = { TASK_REPORTING: reporting };

    expect(reportingModule.getters.IS_COMMUNICATION_POPUP(null, getters))
      .toBeTruthy();
  });
});
