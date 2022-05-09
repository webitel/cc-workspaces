const actions = {
  SEND_FORM: (
    context,
    { action, task = context.rootGetters.TASK_ON_WORKSPACE } = {},
  ) => {
    const form = task.task.form.body.reduce((form, { id, value }) => ({
      ...form,
      [id]: value,
    }), {});
    return task.task.formAction(action.id, form);
  },
  RENEW_PROCESSING_TIME: (
    context,
    { task = context.rootGetters.TASK_ON_WORKSPACE },
  ) => (
    task.task.renew()
  ),
};

export default {
  namespaced: true,
  actions,
};
