const actions = {
  SEND_FORM: (
    context,
    { action, task = context.rootGetters.TASK_ON_WORKSPACE } = {},
  ) => {
    const form = task.attempt.form.body.reduce((form, { id, value, view }) => {
      let _value = value;
      if (view.component === 'form-text') return form;
      if (view.component === 'wt-select') {
        if (Array.isArray(value)) {
          _value = value.map((val) => (
            // мені здається тут опечатка і має бути typeof val === 'object' ???
            typeof value === 'object' ? val.value : val
          ));
        } else if (typeof value === 'object') _value = value.value; // тут змінював _value = value.value на _value = value, але тоді в формі не таке значення
      }
      return {
        ...form,
        [id]: _value,
      };
    }, {});

    return task.attempt.formAction(action.id, form);
  },
};

export default {
  namespaced: true,
  actions,
};
