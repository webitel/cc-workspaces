import { shallowMount } from '@vue/test-utils';
import Communication
  from '../../../../../../../src/components/agent-workspace/info-section/client-info/post-processing/member-communications/post-processing-communication.vue';

const communication = {
  destination: 'destination',
  type: { name: 'type' },
  priority: 1,
};

describe('Post Processing Communication', () => {
  it('renders a component', () => {
    const wrapper = shallowMount(Communication, {
      propsData: { communication },
    });
    expect(wrapper.exists()).toBe(true);
  });

  it('displays communication destination', () => {
    const wrapper = shallowMount(Communication, {
      propsData: { communication },
    });
    expect(wrapper.find('.processing-communication__info-destination').text())
      .toBe(communication.destination);
  });

  it('displays communication type name', () => {
    const wrapper = shallowMount(Communication, {
      propsData: { communication },
    });
    expect(wrapper.find('.processing-communication__info-type').text())
      .toBe(communication.type.name);
  });

  it('displays communication priority', () => {
    const wrapper = shallowMount(Communication, {
      propsData: { communication },
    });
    expect(wrapper.find('.processing-communication__priority').text())
      .toBe(`${communication.priority}`);
  });
});
