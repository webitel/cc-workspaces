import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import { AgentStatus } from 'webitel-sdk';
import Header from '../app-header.vue';
import statusModule from '../../../../../features/agent-status/agent-status';
import call from '../../../../../features/call/call';
import userinfo from '../../../userinfo/userinfo';

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
        call,
        userinfo,
        status: {
          namespaced: true,
          state,
          getters,
          actions,
        },
      },
    });
  });

  it('Logs agent out', () => {
    const wrapper = shallowMount(Header, { store, localVue });
    /*
      last switcher is ccenter mode,
      unfortunately, have no other ways
      (except $t label string to discover switcher programmatically)
    */
    const ccenterSwitcher = wrapper.findAllComponents({ name: 'wt-switcher' }).wrappers.pop();
    ccenterSwitcher.vm.$emit('change');
    expect(actions.AGENT_LOGOUT)
      .toHaveBeenCalled();
  });
});

// describe('Header on agent Pause', () => {
//   let state;
//   let store;
//
//   beforeEach(() => {
//     state = {
//       agent: {
//         status: AgentStatus.Pause,
//       },
//     };
//     store = new Vuex.Store({
//       modules: {
//         call,
//         userinfo,
//         status: {
//           ...statusModule,
//           state,
//         },
//       },
//     });
//   });
// });

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
        call,
        userinfo,
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
    });
    /*
      last switcher is ccenter mode,
      unfortunately, have no other ways
      (except $t label string to discover switcher programmatically)
    */
    const ccenterSwitcher = wrapper.findAllComponents({ name: 'wt-switcher' }).wrappers.pop();
    ccenterSwitcher.vm.$emit('change');
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
