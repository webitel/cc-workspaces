import { mount } from '@vue/test-utils';
import QueueSection
  from '../the-agent-queue-section.vue';

describe('Make new call functionality', () => {
  it('Opens new call on workspace on "new call" btn click', () => {
    const mock = jest.fn();
    jest.spyOn(QueueSection.methods, 'openNewCall')
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
      },
    });
    wrapper.findComponent({ name: 'wt-rounded-action' }).vm.$emit('click', {});
    expect(mock).toHaveBeenCalled();
  });
});
