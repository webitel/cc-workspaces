import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import { CallActions } from 'webitel-sdk';
import callModule from '../../../../../../src/store/modules/call/call';
import Bridge
  from '../../../../../../src/components/agent-workspace/workspace-section/shared/workspace-bridge/workspace-bridge-container.vue';
import ActiveCallItem
  from '../../../../../../src/components/agent-workspace/workspace-section/shared/workspace-bridge/active-call-item.vue';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('Bridge functionality', () => {
  let state;
  const { actions } = callModule;
  let store;

  const call1 = {
    id: 1,
    bridgeTo: jest.fn(),
    state: CallActions.Active,
  };
  const call2 = {
    id: 2,
    state: CallActions.Active,
  };

  beforeEach(() => {
    state = {
      callList: [call1, call2],
      callOnWorkspace: call1,
    };
    store = new Vuex.Store({
      modules: {
        call: {
          namespaced: true,
          state,
          actions,
        },
      },
    });
  });

  it('Fills bridge list active calls', () => {
    const wrapper = shallowMount(Bridge, {
      store,
      localVue,
    });
    expect(wrapper.findAll(ActiveCallItem).length)
      .toEqual(state.callList.length - 1); // all except callOnWorkspace
  });

  it('Selects call and bridges them', () => {
    const wrapper = shallowMount(Bridge, {
      store,
      localVue,
    });
    wrapper.find(ActiveCallItem).trigger('click');
    const bridgeBtn = wrapper.findComponent({ name: 'wt-button' });
    bridgeBtn.vm.$emit('click');
    expect(state.callOnWorkspace.bridgeTo)
      .toHaveBeenCalledWith(call2);
  });
});
