import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import BreakPopup from '../../../../src/components/break-popup/break-popup.vue';

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
    const wrapper = shallowMount(BreakPopup, {
      store,
      localVue,
      mocks: { $t: () => {} },
    });

    const reasonsList = wrapper.findAll('.break-popup__options__item');
    expect(reasonsList.length)
      .toEqual(wrapper.vm.breakOptions.length);
  });

  it('Sets agent break status from textarea', () => {
    const wrapper = shallowMount(BreakPopup, {
      store,
      localVue,
      mocks: { $t: () => {} },
    });

    const reason = 'JEST';
    const textarea = wrapper.find('.break-popup__textarea');
    textarea.vm.$emit('input', reason);
    const sendBtn = wrapper.findAll('.popup-action')
      .at(0); // FIXME
    sendBtn.trigger('click');
    // check if function called
    expect(actions.SET_AGENT_PAUSE_STATUS).toHaveBeenCalled();
    // check if function accepted reason param
    expect(actions.SET_AGENT_PAUSE_STATUS.mock.calls[0][1]).toBe(reason);
  });
});
