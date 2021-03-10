import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import BreakPopup from '../../../../src/components/agent-workspace/popups/break-popup/break-popup.vue';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('Break popup', () => {
  let actions;
  let store;

  beforeEach(() => {
    actions = {
      SET_AGENT_PAUSE_STATUS: jest.fn(),
    };
    store = new Vuex.Store({
      modules: {
        status: {
          namespaced: true,
          actions,
        },
      },
    });
  });

  it('Renders break reasons list', () => {
    const wrapper = shallowMount(BreakPopup, { store, localVue });

    const reasonsList = wrapper.findAll('.break-popup__options__item');
    expect(reasonsList.length)
      .toEqual(wrapper.vm.breakOptions.length);
  });

  it('Sets agent break status from textarea', () => {
    const reason = 'JEST';
    const wrapper = shallowMount(BreakPopup, {
      store,
      localVue,
      data: () => ({ selected: 'TEXTAREA' }),
    });

    const textarea = wrapper.getComponent({ name: 'wt-textarea' });
    textarea.vm.$emit('input', reason);
    wrapper.findAllComponents({ name: 'wt-button' }).at(0).vm.$emit('click');
    // check if function called
    expect(actions.SET_AGENT_PAUSE_STATUS).toHaveBeenCalled();
    // check if function accepted reason param
    expect(actions.SET_AGENT_PAUSE_STATUS.mock.calls[0][1]).toBe(reason);
  });
});
