import { shallowMount } from '@vue/test-utils';
import { AgentStatus } from 'webitel-sdk';
import Header from '../app-header.vue';

const agent = {};

const computed = {
  agent: () => agent,
  isPhoneReg: () => true,
  userinfo: () => ({}),
  checkAccess: () => () => true,
  currentApp: () => 'true',
  isAgent: () => true,
};

jest.spyOn(Header.methods, 'restoreVideoParam').mockImplementation();

describe('Header on agent Waiting', () => {
  agent.status = AgentStatus.Waiting;

  it('Logs agent out', () => {
    const mock = jest.fn();
    jest.spyOn(Header.methods, 'toggleCCenterMode').mockImplementationOnce(mock);

    const wrapper = shallowMount(Header, { computed });
    /*
      last switcher is ccenter mode,
      unfortunately, have no other ways
      (except $t label string to discover switcher programmatically)
    */
    const ccenterSwitcher = wrapper.findAllComponents({ name: 'wt-switcher' })
                                   .wrappers
                                   .pop();
    ccenterSwitcher.vm.$emit('change');
    expect(mock).toHaveBeenCalled();
  });
});

describe('Header on agent Offline', () => {
  agent.status = AgentStatus.Offline;
  it('Logs agent in', () => {
    const mock = jest.fn();
    jest.spyOn(Header.methods, 'toggleCCenterMode')
        .mockImplementationOnce(mock);

    const wrapper = shallowMount(Header, {
      computed,
    });
    /*
      last switcher is ccenter mode,
      unfortunately, have no other ways
      (except $t label string to discover switcher programmatically)
    */
    const ccenterSwitcher = wrapper.findAllComponents({ name: 'wt-switcher' })
                                   .wrappers
                                   .pop();
    ccenterSwitcher.vm.$emit('change');
    expect(mock)
      .toHaveBeenCalled();
  });
});
