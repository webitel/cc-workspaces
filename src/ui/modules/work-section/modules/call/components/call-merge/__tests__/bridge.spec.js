import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import { CallActions } from 'webitel-sdk';
import callModule from '../../../../../../../../features/call/call';
import Bridge
  from '../call-bridge-container.vue';

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
    expect(wrapper.findAllComponents({ name: 'merge-lookup-item' }).length)
      .toEqual(state.callList.length - 1); // all except callOnWorkspace
  });

  it('Selects call and bridges them', () => {
    const wrapper = shallowMount(Bridge, {
      store,
      localVue,
    });
    wrapper.findComponent({ name: 'merge-lookup-item' }).vm.$emit('input', call2);
    expect(state.callOnWorkspace.bridgeTo)
      .toHaveBeenCalledWith(call2);
  });
});
