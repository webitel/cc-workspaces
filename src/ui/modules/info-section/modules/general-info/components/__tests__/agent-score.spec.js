import { shallowMount } from '@vue/test-utils';
import AgentScore from '../agent-score.vue';

describe('General Info: Agent Score', () => {
  it('renders a component', () => {
    const wrapper = shallowMount(AgentScore, {
      props: {
        score: {},
      },
    });
    expect(wrapper.exists()).toBe(true);
  });
});
