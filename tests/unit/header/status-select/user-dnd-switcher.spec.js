import Vuex from 'vuex';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import UserStatus from '../../../../src/store/modules/agent-status/statusUtils/UserStatus';
import UserDndSwitcher from '../../../../src/components/shared/app-header/user-dnd-switcher.vue';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('User Dnd Switcher', () => {
  let state;
  let getters;
  let actions;
  let store;

  beforeEach(() => {
    state = {
      user: {
        status: UserStatus.ACTIVE,
      },
    };
    actions = {
      TOGGLE_USER_DND: jest.fn(),
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

  it('renders a component', () => {
    const wrapper = shallowMount(UserDndSwitcher, { store, localVue });
    expect(wrapper.exists()).toBe(true);
  });
});
