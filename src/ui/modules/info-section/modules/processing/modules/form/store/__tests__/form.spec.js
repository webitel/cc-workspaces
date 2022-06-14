import form from '../form';
import contextMock from '../../../../../../../../../../tests/unit/mocks/store/contextMock';

describe('form: actions', () => {
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
    form.actions.SEND_FORM(context, { action, task });
    expect(task.attempt.formAction).toHaveBeenLastCalledWith(action.id, expectedForm);
  });
});
