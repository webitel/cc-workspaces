import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import { CallActions } from 'webitel-sdk';
import callModule from '../../../../../src/store/modules/call/call';
import CallHeader
  from '../../../../../src/components/agent-workspace/workspace-section/call/call-header.vue';

const localVue = createLocalVue();
localVue.use(Vuex);

// Make new call on number test
const mockCliCall = jest.fn();
jest.mock('../../../../../src/api/agent-workspace/call-ws-connection',
  () => ({ getCliInstance: () => ({ call: mockCliCall }), destroyCliInstance: jest.fn() }));

describe('Make new call functionality', () => {
  let state;
  let store;

  beforeEach(() => {
    state = {
      callOnWorkspace: {
        _isNew: true,
        newNumber: '',
      },
      callList: [],
    };
    store = new Vuex.Store({
      modules: {
        call: {
          ...callModule,
          state,
        },
      },
    });
  });

  it('Draws a number input and "call" btn on open', async () => {
    const wrapper = shallowMount(CallHeader, {
      store,
      localVue,
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

  it('Make new call on number', async () => {
    const wrapper = shallowMount(CallHeader, {
      store,
      localVue,
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
      .vm.$emit('click', {});

    // then mock a getCliInstance fn
    // and check if cli.call() fn is triggered with proper destination
    await wrapper.vm.$nextTick();
    expect(mockCliCall)
      .toHaveBeenCalled();
    // FIRST CALL FIRST PARAM
    expect(mockCliCall.mock.calls[0][0].destination)
      .toEqual(inputValue);
  });
});

describe('Transfer functionality', () => {
  let state;
  let store;

  beforeEach(() => {
    state = {
      callList: [],
      callOnWorkspace: {
        blindTransfer: jest.fn(),
      },
    };
    store = new Vuex.Store({
      modules: {
        call: {
          ...callModule,
          state,
        },
      },
    });
  });

  it('Opens transfer tab from call-header', () => {
    state.callOnWorkspace = {
      allowHangup: true,
    };
    const wrapper = shallowMount(CallHeader, {
      store,
      localVue,
    });
    const transferBtn = wrapper.find('.call-action.transfer');
    transferBtn.vm.$emit('click');
    expect(wrapper.emitted().openTab[0])
      .toEqual(['transfer']);
  });
});

describe('Bridge functionality', () => {
  let state;
  const { getters, actions, mutations } = callModule;
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
          getters,
          actions,
          mutations,
        },
      },
    });
  });

  it('Doesnt show merge btn with only 1 active call', () => {
    state.callList = state.callList.slice(1);
    const wrapper = shallowMount(CallHeader, {
      store,
      localVue,
    });
    expect(wrapper.find('.call-action.bridge')
      .exists())
      .toBeFalsy();
  });

  it('Shows merge btn with only 2 active call', () => {
    const wrapper = shallowMount(CallHeader, {
      store,
      localVue,
    });
    expect(wrapper.find('.call-action.bridge')
      .exists())
      .toBeTruthy();
  });

  it('Opens bridge tab from call-header', () => {
    const wrapper = shallowMount(CallHeader, {
      store,
      localVue,
    });
    const transferBtn = wrapper.find('.call-action.bridge');
    transferBtn.vm.$emit('click');
    expect(wrapper.emitted().openTab[0])
      .toEqual(['bridge']);
  });
});
