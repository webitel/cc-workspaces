import Vuex from 'vuex';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import { AgentStatus } from 'webitel-sdk';
import StatusSelect from '../../../../src/components/shared/app-header/status-select.vue';
import statusModule from '../../../../src/store/modules/agent-status/agent-status';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('Agent status select', () => {
  let state;
  let getters;
  let store;

  beforeEach(() => {
    state = {
      agent: {
        status: AgentStatus.Online,
        stateDuration: 12 * 60 * 60,
      },
    };
    getters = {
      IS_AGENT: statusModule.getters.IS_AGENT,
    };
    store = new Vuex.Store({
      modules: {
        status: {
          namespaced: true,
          state,
          getters,
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

  it('Correctly computes Agent status duration', () => {
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

  it('Correctly computes Agent status ACTIVE indicator class', async () => {
    const wrapper = shallowMount(StatusSelect, {
      store,
      localVue,
      mocks: { $t: () => {} },
      stubs: { Icon: true },
    });
    const indicatorEl = wrapper.find('.status-select__item__selected .status-select__indicator');
    expect(indicatorEl.classes())
      .toContain('online');
  });

  it('Correctly computes Agent status BREAK indicator class', async () => {
    const wrapper = shallowMount(StatusSelect, {
      store,
      localVue,
      mocks: { $t: () => {} },
      stubs: { Icon: true },
    });
    wrapper.setData({ agent: { status: AgentStatus.Pause } });
    await wrapper.vm.$nextTick();

    const indicatorEl = wrapper.find('.status-select__item__selected .status-select__indicator');
    expect(indicatorEl.classes())
      .toContain('pause');
  });

  it('Changes Agent status', async () => {
    const wrapper = shallowMount(StatusSelect, {
      store,
      localVue,
      mocks: { $t: () => {} },
      stubs: { Icon: true },
    });

    const optionsList = wrapper.findAll('.status-select__options .status-select__item');
    const breakOption = optionsList.wrappers.find((wrapper) => wrapper
      .find('.status-select__indicator')
      .classes()
      .indexOf('pause') !== -1);
    breakOption.trigger('click');
    expect(wrapper.emitted().setBreak)
      .toBeTruthy();
  });
});
