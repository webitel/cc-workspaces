import { shallowMount, mount } from '@vue/test-utils';
import MissedQueuePreview
  from '../missed-queue-preview.vue';

describe('MissedQueuePreview', () => {
  it('renders a component', () => {
    const wrapper = shallowMount(MissedQueuePreview, {
      props: {
        index: 1,
        task: {},
      },
    });
    expect(wrapper.exists()).toBe(true);
  });

  it('emits call event on call button click: MD size', () => {
    const wrapper = mount(MissedQueuePreview, {
      props: {
        task: {},
        size: 'md',
      },
    });
    wrapper.findComponent({ name: 'wt-rounded-action' }).vm.$emit('click', {
      preventDefault: () => {}, // .prevent event handler
    });
    expect(wrapper.emitted().call).toBeTruthy();
  });

  it('emits call event on call button click: SM size', () => {
    const wrapper = mount(MissedQueuePreview, {
      props: {
        task: {},
        size: 'sm',
      },
    });
    wrapper.findComponent({ name: 'wt-rounded-action' }).vm.$emit('click', {
      preventDefault: () => {}, // .prevent event handler
    });
    expect(wrapper.emitted().call).toBeTruthy();
  });

  it('emits hide event on close icon-button click: MD size', () => {
    const wrapper = mount(MissedQueuePreview, {
      props: {
        task: {},
        size: 'md',
      },
    });
    wrapper.findComponent('.missed-queue-preview-hide-action').vm.$emit('click', {
      preventDefault: () => {}, // .prevent event handler
    });
    expect(wrapper.emitted().hide).toBeTruthy();
  });

  it('emits hide event on close icon-button click: SM size', () => {
    const wrapper = mount(MissedQueuePreview, {
      props: {
        task: {},
        size: 'sm',
      },
    });
    wrapper.findComponent('.missed-queue-preview-hide-action').vm.$emit('click', {
      preventDefault: () => {}, // .prevent event handler
    });
    expect(wrapper.emitted().hide).toBeTruthy();
  });
});
