import changeFormBeforeSend from '../../../script/changeFormBeforeSend.js';

const actions = {
  SEND_FORM: (
    context,
    { action, task = context.rootGetters.TASK_ON_WORKSPACE } = {},
  ) => {
    const form = task.attempt?.form?.fields || changeFormBeforeSend(task.attempt?.form?.body);
    return task.attempt.formAction(action.id, form);
  },
};

export default {
  namespaced: true,
  actions,
};
