const findRoundedActionByIcon = (icon) => (wrapper) => wrapper
  .findAllComponents({ name: 'wt-rounded-action' })
  .find((wrapper) => wrapper.vm.$props.icon === icon);

export default findRoundedActionByIcon;
