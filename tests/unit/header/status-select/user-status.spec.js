import Vuex from 'vuex';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import UIStatus from '@webitel/ui-sdk/src/enums/AgentStatus/AgentStatus.enum';
import UserStatus from '../../../../src/store/modules/agent-status/statusUtils/UserStatus';
import StatusSelect from '../../../../src/components/shared/app-header/status-select.vue';

const localVue = createLocalVue();
localVue.use(Vuex);

const lastStateChange = Date.now() - 12 * 60 * 60 * 10 ** 3; // '12:00:00'

describe('User status select', () => {
  let state;
  let getters;
  let actions;
  let store;

  beforeEach(() => {
    state = {
      user: {
        status: UserStatus.ACTIVE,
        lastStateChange,
      },
    };
    getters = {
      IS_AGENT: () => false,
    };
    actions = {
      SET_USER_ACTIVE_STATUS: jest.fn(),
      SET_USER_DND_STATUS: jest.fn(),
    };
    store = new Vuex.Store({
      modules: {
        status: {
          namespaced: true,
          state,
          getters,
          actions,
        },
        now: {
          namespaced: true,
          state: {
            now: Date.now(),
          },
        },
      },
    });
  });

  it('Correctly computes User status duration', () => {
    const wrapper = shallowMount(StatusSelect, { store, localVue });
    expect(wrapper.vm.duration).toEqual('12:00:00');
  });

  it('Set User DND status', async () => {
    const wrapper = shallowMount(StatusSelect, { store, localVue });
    wrapper.getComponent({ name: 'wt-status-select' }).vm.$emit('change', UIStatus.PAUSE);
    expect(actions.SET_USER_DND_STATUS)
      .toHaveBeenCalled();
  });

  it('Set User Active status', async () => {
    const wrapper = shallowMount(StatusSelect, { store, localVue });
    wrapper.getComponent({ name: 'wt-status-select' }).vm.$emit('change', UIStatus.ONLINE);
    expect(actions.SET_USER_ACTIVE_STATUS)
      .toHaveBeenCalled();
  });
});
