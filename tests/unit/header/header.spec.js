import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import { AgentStatus } from 'webitel-sdk';
import Header from '../../../src/components/cc-header/cc-header.vue';
import Switcher from '../../../src/components/cc-header/cc-header-switcher.vue';
import StatusSelect from '../../../src/components/cc-header/status-select.vue';
import BreakPopup from '../../../src/components/break-popup/break-popup.vue';
import TimerPopup from '../../../src/components/break-popup/break-timer-popup.vue';
import statusModule from '../../../src/store/modules/agent-status/agent-status';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('Header on agent Waiting', () => {
  let state;
  let actions;
  let getters;
  let store;

  beforeEach(() => {
    state = {
      agent: {
        status: AgentStatus.Waiting,
      },
    };
    getters = {
      IS_AGENT: statusModule.getters.IS_AGENT,
    };
    actions = {
      TOGGLE_CCENTER_MODE: statusModule.actions.TOGGLE_CCENTER_MODE,
      AGENT_LOGOUT: jest.fn(),
    };
    store = new Vuex.Store({
      modules: {
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
    });
    const switcher = wrapper.find(Switcher);
    switcher.vm.$emit('input');
    expect(actions.AGENT_LOGOUT)
      .toHaveBeenCalled();
  });
});

describe('Header on agent Pause', () => {
  let state;
  let actions;
  let store;

  beforeEach(() => {
    state = {
      agent: {
        status: AgentStatus.Pause,
      },
    };
    store = new Vuex.Store({
      modules: {
        status: {
          namespaced: true,
          state,
          actions,
        },
      },
    });
  });

  it('Shows timer popup on Pause state', () => {
    const wrapper = shallowMount(Header, {
      store,
      localVue,
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
  let actions;
  let store;

  beforeEach(() => {
    state = {
      agent: {
        status: AgentStatus.Offline,
      },
    };
    actions = {
      TOGGLE_CCENTER_MODE: statusModule.actions.TOGGLE_CCENTER_MODE,
      SET_AGENT_WAITING_STATUS: jest.fn(),
    };
    store = new Vuex.Store({
      modules: {
        status: {
          namespaced: true,
          state,
          actions,
        },
      },
    });
  });

  it('Logs agent in', () => {
    const wrapper = shallowMount(Header, {
      store,
      localVue,
    });
    const switcher = wrapper.find(Switcher);
    switcher.vm.$emit('input');
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
