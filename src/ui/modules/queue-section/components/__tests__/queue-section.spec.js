import { shallowMount } from '@vue/test-utils';
import QueueSection
  from '../the-agent-queue-section.vue';

describe('Make new call functionality', () => {
  it('Opens new call on workspace on "new call" btn click', () => {
    const mock = jest.fn();
    jest.spyOn(QueueSection.methods, 'openNewCall')
      .mockImplementationOnce(mock);
    const wrapper = shallowMount(QueueSection, {
      computed: {
        isNewCall() {
          return false;
        },
      },
    });
    wrapper.findComponent({ name: 'wt-rounded-action' }).vm.$emit('click', {});
    expect(mock).toHaveBeenCalled();
  });
});
