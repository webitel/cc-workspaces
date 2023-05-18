import { mount } from '@vue/test-utils';
import { AgentStatus } from 'webitel-sdk';
import BreakTimerPopup from '../../../popups/break-popup/break-timer-popup.vue';
import AgentStatusSelect from '../agent-status-select.vue';
import Header from '../app-header.vue';

const agent = {};

const computed = {
  agent: () => agent,
  isPhoneReg: () => true,
  userinfo: () => ({}),
  checkAccess: () => () => true,
  currentApp: () => 'true',
  isCcenterOn: () => true,
  isAgent: () => true,
};

jest.spyOn(Header.methods, 'restoreVideoParam').mockImplementation();

describe('Header on agent Waiting', () => {
  agent.status = AgentStatus.Waiting;

  it('Logs agent out', () => {
    const mock = jest.fn();
    jest.spyOn(Header.methods, 'toggleCCenterMode').mockImplementationOnce(mock);

    const wrapper = mount(Header, {
      computed,
      shallow: true,
      global: {
        stubs: {
          WtAppHeader: false,
          WtSwitcher: false,
        },
      },
    });
    /*
      last switcher is ccenter mode,
      unfortunately, have no other ways
      (except $t label string to discover switcher programmatically)
    */
    const ccenterSwitcher = wrapper.findAllComponents({ name: 'wt-switcher' }).at(0);
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

    const wrapper = mount(Header, {
      computed,
      shallow: true,
      global: {
        stubs: {
          WtAppHeader: false,
          WtSwitcher: false,
        },
      },
    });
    /*
      last switcher is ccenter mode,
      unfortunately, have no other ways
      (except $t label string to discover switcher programmatically)
    */
    const ccenterSwitcher = wrapper.findAllComponents({ name: 'wt-switcher' })
                                   .pop();
    ccenterSwitcher.vm.$emit('change');
    expect(mock)
      .toHaveBeenCalled();
  });

  it('hide ccenter switcher if isAgent is falsy', () => {
    const wrapper = mount(Header, {
      computed: {
        ...computed,
        isAgent() { return false; },
      },
      shallow: true,
      global: {
        stubs: {
          WtAppHeader: false,
          WtSwitcher: false,
        },
      },
    });
    const ccenterSwitcher = wrapper.findAllComponents({ name: 'wt-switcher' })
                                   .find((switcher) => switcher.vm.label.includes('callCenter'));
    expect(ccenterSwitcher).toBeFalsy();
  });

  it('hide ccenter status select if isAgent is falsy', () => {
    const wrapper = mount(Header, {
      computed: {
        ...computed,
        isAgent() { return false; },
      },
      shallow: true,
      global: {
        stubs: {
          WtAppHeader: false,
          WtSwitcher: false,
        },
      },
    });
    const statusSelect = wrapper.findComponent(AgentStatusSelect);
    expect(statusSelect.exists()).toBe(false);
  });

  it('hide break timer popup if isAgent is falsy', () => {
    const wrapper = mount(Header, {
      computed: {
        ...computed,
        isAgent() { return false; },
      },
      shallow: true,
      global: {
        stubs: {
          WtAppHeader: false,
          WtSwitcher: false,
        },
      },
    });
    const component = wrapper.findComponent(BreakTimerPopup);
    expect(component.exists()).toBe(false);
  });
});
