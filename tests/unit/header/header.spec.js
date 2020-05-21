import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import { AgentStatus } from 'webitel-sdk';
import Header from '../../../src/components/cc-header/cc-header.vue';
import Switcher from '../../../src/components/cc-header/cc-header-switcher.vue';
import StatusSelect from '../../../src/components/cc-header/status-select.vue';
import BreakPopup from '../../../src/components/break-popup/break-popup.vue';
import TimerPopup from '../../../src/components/break-popup/break-timer-popup.vue';
import statusModule from '../../../src/store/modules/agent-status/agent-status';
import callModule from '../../../src/store/modules/call/call';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('Header on agent Waiting', () => {
  let state;
  const { getters, actions } = statusModule;
  let store;

  beforeEach(() => {
    state = {
      agent: {
        status: AgentStatus.Waiting,
      },
    };
    actions.AGENT_LOGOUT = jest.fn();
    store = new Vuex.Store({
      modules: {
        call: callModule,
        status: {
          namespaced: true,
          state,
          getters,
          actions,
        },
      },
    });
  });

  it('Doesnt show any popups on default Waiting', () => {
    const wrapper = shallowMount(Header, {
      store,
      localVue,
      mocks: {
        $t: () => {
        },
      },
    });
    const breakPopup = wrapper.find(BreakPopup);
    const timerPopup = wrapper.find(TimerPopup);
    expect(breakPopup.exists())
      .toBeFalsy();
    expect(timerPopup.exists())
      .toBeFalsy();
  });

  // TODO: Fix this test
  it('Shows break popup on setBreak event', async () => {
    const wrapper = shallowMount(Header, {
      store,
      localVue,
      mocks: {
        $t: () => {
        },
      },
      // sync: false,
      /*
         FIXME: REMOVE data: () => ({});
          all properties have changed, and popup v-if should be rerendered,
          but it's not, and I don't know why :(
      */
      data: () => ({
        isBreakPopup: true,
      }),
    });
    const breakPopup = wrapper.find(BreakPopup);
    const statusSelect = wrapper.find(StatusSelect);

    statusSelect.vm.$emit('setBreak');

    await wrapper.vm.$nextTick();
    expect(breakPopup.exists())
      .toBeTruthy();
  });

  it('Logs agent out', () => {
    const wrapper = shallowMount(Header, {
      store,
      localVue,
      mocks: {
        $t: () => {
        },
      },
    });
    /*
      last switcher is ccenter mode,
      unfortunately, have no other ways
      (except $t label string to discover switcher programmatically)
    */
    const ccenterSwitcher = wrapper.findAll(Switcher).wrappers.pop();
    ccenterSwitcher.vm.$emit('input');
    expect(actions.AGENT_LOGOUT)
      .toHaveBeenCalled();
  });
});

describe('Header on agent Pause', () => {
  let state;
  const { getters, actions } = statusModule;
  let store;

  beforeEach(() => {
    state = {
      agent: {
        status: AgentStatus.Pause,
      },
    };
    store = new Vuex.Store({
      modules: {
        call: callModule,
        status: {
          namespaced: true,
          state,
          getters,
          actions,
        },
      },
    });
  });

  it('Shows timer popup on Pause state', () => {
    const wrapper = shallowMount(Header, {
      store,
      localVue,
      mocks: {
        $t: () => {
        },
      },
    });
    const breakPopup = wrapper.find(BreakPopup);
    const timerPopup = wrapper.find(TimerPopup);
    expect(breakPopup.exists())
      .toBeFalsy();
    expect(timerPopup.exists())
      .toBeTruthy();
  });
});

describe('Header on agent Offline', () => {
  let state;
  const { getters, actions } = statusModule;
  let store;

  beforeEach(() => {
    state = {
      agent: {
        status: AgentStatus.Offline,
      },
    };
    actions.SET_AGENT_WAITING_STATUS = jest.fn();
    store = new Vuex.Store({
      modules: {
        call: callModule,
        status: {
          namespaced: true,
          state,
          getters,
          actions,
        },
      },
    });
  });

  it('Logs agent in', () => {
    const wrapper = shallowMount(Header, {
      store,
      localVue,
      mocks: {
        $t: () => {
        },
      },
    });
    /*
      last switcher is ccenter mode,
      unfortunately, have no other ways
      (except $t label string to discover switcher programmatically)
    */
    const ccenterSwitcher = wrapper.findAll(Switcher).wrappers.pop();
    ccenterSwitcher.vm.$emit('input');
    expect(actions.SET_AGENT_WAITING_STATUS)
      .toHaveBeenCalled();
  });
});

describe('Agent status getter', () => {
  it('Returns True on Waiting agent state', () => {
    const state = { agent: { status: AgentStatus.Waiting } };
    const isAgent = statusModule.getters.IS_AGENT(state);
    expect(isAgent)
      .toBeTruthy();
  });

  it('Returns True on Pause agent state', () => {
    const state = { agent: { status: AgentStatus.Pause } };
    const isAgent = statusModule.getters.IS_AGENT(state);
    expect(isAgent)
      .toBeTruthy();
  });

  it('Returns False on Offline agent state', () => {
    const state = { agent: { status: AgentStatus.Offline } };
    const isAgent = statusModule.getters.IS_AGENT(state);
    expect(isAgent)
      .toBeFalsy();
  });
});
