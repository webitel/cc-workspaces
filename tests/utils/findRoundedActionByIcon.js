const findRoundedActionByIcon = (icon) => (wrapper) => wrapper
  .findAllComponents({ name: 'wt-rounded-action' })
  .wrappers
  .find((wrapper) => wrapper.vm.$props.icon === icon);

export default findRoundedActionByIcon;
