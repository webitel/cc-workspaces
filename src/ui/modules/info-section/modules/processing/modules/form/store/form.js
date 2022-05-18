const actions = {
  SEND_FORM: (
    context,
    { action, task = context.rootGetters.TASK_ON_WORKSPACE } = {},
  ) => {
    const form = task.task.form.body.reduce((form, { id, value, view }) => {
      let _value = value;
      if (view.component === 'form-text') return form;
      if (view.component === 'wt-select') {
        if (Array.isArray(value)) {
          _value = value.map((val) => (
            typeof value === 'object' ? val.value : val
          ));
        } else if (typeof value === 'object') _value = value.value;
      }
      return {
        ...form,
        [id]: _value,
      };
    }, {});
    return task.task.formAction(action.id, form);
  },
};

export default {
  namespaced: true,
  actions,
};
