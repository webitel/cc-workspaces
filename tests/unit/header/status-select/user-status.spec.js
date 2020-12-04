import Vuex from 'vuex';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import UserStatus from '../../../../src/store/modules/agent-status/statusUtils/UserStatus';
import StatusSelect from '../../../../src/components/shared/app-header/status-select.vue';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('User status select', () => {
  let state;
  let getters;
  let actions;
  let store;

  beforeEach(() => {
    state = {
      user: {
        status: UserStatus.ACTIVE,
        lastStateChange: Date.now() - 12 * 60 * 60 * 10 ** 3,
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
    const wrapper = shallowMount(StatusSelect, {
      store,
      localVue,
      mocks: { $t: () => {} },
      stubs: { Icon: true },
    });

    const durationUI = wrapper.find('.status-select__item__text');
    expect(durationUI.text())
      .toEqual('12:00:00');
  });

  it('Correctly computes User status ACTIVE indicator class', async () => {
    const wrapper = shallowMount(StatusSelect, {
      store,
      localVue,
      mocks: { $t: () => {} },
      stubs: { Icon: true },
    });
    const indicatorEl = wrapper.find('.status-select__item__selected .status-select__indicator');
    expect(indicatorEl.classes())
      .toContain('active');
  });

  it('Correctly computes User status BREAK indicator class', async () => {
    const wrapper = shallowMount(StatusSelect, {
      store,
      localVue,
      mocks: { $t: () => {} },
      stubs: { Icon: true },
    });
    wrapper.setData({ user: { status: UserStatus.DND } });
    await wrapper.vm.$nextTick();

    const indicatorEl = wrapper.find('.status-select__item__selected .status-select__indicator');
    expect(indicatorEl.classes())
      .toContain('dnd');
  });

  it('Set User DND status', async () => {
    const wrapper = shallowMount(StatusSelect, {
      store,
      localVue,
      mocks: { $t: () => {} },
      stubs: { Icon: true },
    });

    const optionsList = wrapper.findAll('.status-select__options .status-select__item');
    const dndOption = optionsList.wrappers.find((wrapper) => wrapper
      .find('.status-select__indicator')
      .classes()
      .indexOf('dnd') !== -1);
    dndOption.trigger('click');
    expect(actions.SET_USER_DND_STATUS)
      .toHaveBeenCalled();
  });

  it('Set User Active status', async () => {
    const wrapper = shallowMount(StatusSelect, {
      store,
      localVue,
      mocks: { $t: () => {} },
      stubs: { Icon: true },
    });
    wrapper.setData({ user: { status: UserStatus.DND } });
    await wrapper.vm.$nextTick();

    const optionsList = wrapper.findAll('.status-select__options .status-select__item');
    const dndOption = optionsList.wrappers.find((wrapper) => wrapper
      .find('.status-select__indicator')
      .classes()
      .indexOf('active') !== -1);
    dndOption.trigger('click');
    expect(actions.SET_USER_ACTIVE_STATUS)
      .toHaveBeenCalled();
  });
});
