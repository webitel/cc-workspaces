import processing from '../processing';
import contextMock
  from '../../../../../../../../tests/unit/mocks/store/contextMock';

describe('processing: actions', () => {
  let context;

  beforeEach(() => {
    context = contextMock(jest);
  });

  it('SEND_FORM calls passed task "formAction" method with passed form', () => {
    const body = [{ id: 'jest', value: 'jest1', view: {} }];
    const expectedForm = { jest: 'jest1' };
    const action = { id: 'jst' };
    const task = {
      task: {
        form: { body },
        formAction: jest.fn(),
      },
    };
    processing.actions.SEND_FORM(context, { action, task });
    expect(task.task.formAction).toHaveBeenLastCalledWith(action.id, expectedForm);
  });

  it('RENEW_PROCESSING_TIME calls passed task "renew" method', () => {
    const task = {
      task: { renew: jest.fn() },
    };
    processing.actions.RENEW_PROCESSING_TIME(context, { task });
    expect(task.task.renew).toHaveBeenCalled();
  });
});
