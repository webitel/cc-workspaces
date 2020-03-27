import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import workspaceModule from '../../../../src/store/modules/agent-workspace/agent-workspace';
import CallStates from '../../../../src/store/callUtils/CallStates';
import ActiveCall
  from '../../../../src/components/agent-workspace/workspace-section/call/active-call.vue';
import CallHeader
  from '../../../../src/components/agent-workspace/workspace-section/call/call-header.vue';
import Numpad
  from '../../../../src/components/agent-workspace/workspace-section/call/call-numpad/numpad.vue';

const localVue = createLocalVue();
localVue.use(Vuex);

const mockCliCall = jest.fn();
jest.mock('../../../../src/api/agent-workspace/call-ws-connection',
  () => () => ({ call: mockCliCall }));

describe('Make new call functionality', () => {
  let state;
  const { actions, mutations } = workspaceModule;
  let store;

  beforeEach(() => {
    state = {
      callState: CallStates.NEW,
      callOnWorkspace: {},
      newCallNumber: '',
    };
    store = new Vuex.Store({
      modules: {
        workspace: {
          namespaced: true,
          state,
          actions,
          mutations,
        },
      },
    });
  });

  it('Draws a numpad on open', () => {
    const wrapper = shallowMount(ActiveCall, {
      store,
      localVue,
    });
    const numpad = wrapper.find(Numpad);
    expect(numpad.isVisible())
      .toBeTruthy();
  });

  it('Draws a number input and "call" btn on open', async () => {
    const wrapper = shallowMount(CallHeader, {
      store,
      localVue,
      stubs: { Icon: true },
    });
    const numberInput = wrapper.find('.call-header__form-number__input');
    expect(numberInput.exists())
      .toBeTruthy();

    numberInput.element.value = 100;
    numberInput.trigger('input');

    await wrapper.vm.$nextTick();
    const callBtn = wrapper.find('.call-action.call');
    expect(callBtn.exists())
      .toBeTruthy();
  });

  it('Lets user call on number input', async () => {
    const wrapper = shallowMount(CallHeader, {
      store,
      localVue,
      stubs: { Icon: true },
    });
    const inputValue = '123';
    // find input and emit some value from it
    const numberInput = wrapper.find('.call-header__form-number__input');
    expect(numberInput.exists())
      .toBeTruthy();
    numberInput.element.value = inputValue;
    numberInput.trigger('input');

    // then find "call" button and trigger click
    await wrapper.vm.$nextTick();
    wrapper.find('.call-action.call')
      .trigger('click');

    // then mock a getCliInstance fn
    // and check if cli.call() fn is triggered with proper destination
    await wrapper.vm.$nextTick();
    expect(mockCliCall)
      .toHaveBeenCalledWith({ destination: inputValue });
  });
});
