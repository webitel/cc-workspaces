const actions = {
  SEND_FORM: (
    context,
    { action, task = context.rootGetters.TASK_ON_WORKSPACE } = {},
  ) => {
    const form = task.attempt?.form?.fields;
    console.log('SEND_FORM form', form);
    return task.attempt.formAction(action.id, form);
  },
};

export default {
  namespaced: true,
  actions,
};
