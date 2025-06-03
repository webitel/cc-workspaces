export function formattingFormBeforeSend(formBody) {
  // backend need to get form values in an object, not array
  return formBody.reduce((form, { id, value, view }) => {
    let _value = value;
    if (view.component === 'form-text') return form;
    if (view.component === 'wt-select') {
      if (Array.isArray(value)) {
        _value = value.map((val) =>
          typeof value === 'object' ? val.value : val,
        );
      } else if (typeof value === 'object') {
        _value = value.value;
      }
    }
    return {
      ...form,
      [id]: _value,
    };
  }, {});
}
