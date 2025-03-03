import { mount, shallowMount } from '@vue/test-utils';
import QueueSection
  from '../the-agent-queue-section.vue';
import store from '../../../../app/store/index.js';

describe('Queue Section', () => {
  it('renders a component', () => {
    const wrapper = shallowMount(QueueSection, {
      global: {
        plugins: [store],
      },
    });
    expect(wrapper.exists()).toBeTruthy();
  });
  it('Opens new call on workspace on "new call" btn click', () => {
    const mock = vi.fn();
    vi.spyOn(QueueSection.methods, 'openNewCall')
      .mockImplementationOnce(mock);
    const wrapper = mount(QueueSection, {
      shallow: true,
      global: {
        stubs: {
          WtRoundedAction: false,
        },
      },
      computed: {
        isNewCallButton() {
          return true;
        },
        tabs() {
          return [{}];
        },
      },
    });
    wrapper.findComponent({ name: 'wt-rounded-action' }).vm.$emit('click', {});
    expect(mock).toHaveBeenCalled();
  });
});
