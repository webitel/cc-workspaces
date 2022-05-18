import reportingModule from '../reporting';
import ReportingForm from '../ReportingForm';
import contextMock
  from '../../../../../../../../../../tests/unit/mocks/store/contextMock';

describe('reporting module: actions', () => {
  let context;

  beforeEach(() => {
    context = contextMock(jest);
  });

  it('correctly inits reporting form from scratch', async () => {
    const task = {};
    context.rootGetters = {
      'workspace/TASK_ON_WORKSPACE': task,
      'ui/infoSec/processing/ALLOW_PROCESSING': true,
    };
    await reportingModule.actions.INIT_REPORTING_FORM(context, task);
    expect(task.postProcessData).toBeTruthy();
    expect(task.postProcessData).toBeInstanceOf(ReportingForm);
  });

  it('doesnt set postProcessData, if object exists', async () => {
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
});
