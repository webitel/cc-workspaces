import { shallowMount, mount } from '@vue/test-utils';
import { AgentStatus } from 'webitel-sdk';
import TimerPopup from '../break-timer-popup.vue';

const agent = {
  status: AgentStatus.Pause,
  stateDuration: 12 * 60 * 60,
};

const computed = {
  agent() {
    return agent;
  },
  now() {
    return Date.now();
  },
};

describe('Break timer popup', () => {
  it('Correctly displays break duration', () => {
    const wrapper = shallowMount(TimerPopup, { computed });
    expect(wrapper.vm.duration)
      .toEqual('12:00:00');
  });

  it('Doesn\'t show popup on Online status', () => {
    agent.status = AgentStatus.Online;
    const wrapper = shallowMount(TimerPopup, { computed, attachTo: document.body });
    expect(wrapper.isVisible())
      .toBeFalsy();
  });

  it('Correctly goes Waiting', () => {
    const mock = vi.fn();
    vi.spyOn(TimerPopup.methods, 'setAgentWaiting')
        .mockImplementationOnce(mock);
    const wrapper = mount(TimerPopup, { computed });

    wrapper.findAllComponents({ name: 'wt-button' }).at(0).vm.$emit('click');
    expect(mock).toHaveBeenCalled();
  });

  it('Correctly goes Offline', () => {
    const mock = vi.fn();
    vi.spyOn(TimerPopup.methods, 'agentLogout')
      .mockImplementationOnce(mock);
    const wrapper = mount(TimerPopup, { computed });

    wrapper.findAllComponents({ name: 'wt-button' }).at(1).vm.$emit('click');
    expect(mock).toHaveBeenCalled();
  });
});
