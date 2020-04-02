import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import { CallActions, CallDirection } from 'webitel-sdk';
import workspaceModule from '../../../../../src/store/modules/agent-workspace/agent-workspace';
import CallPreview
  from '../../../../../src/components/agent-workspace/queue-section/active-queue/active-queue-preview.vue';
import Btn from '../../../../../src/components/utils/btn.vue';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('Other UIs', () => {
  let state;
  let store;
  let call;
  const display = 'jest';

  beforeEach(() => {
    call = {
      displayName: display,
      displayNumber: display,
      isHold: true,
    };
    state = {
      callList: [call],
    };
    store = new Vuex.Store({
      modules: {
        workspace: {
          namespaced: true,
          state,
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

  it('Correctly displays call displayName', () => {
    const wrapper = shallowMount(CallPreview, {
      store,
      localVue,
      stubs: { Icon: true },
      propsData: {
        call,
        index: state.callList.indexOf(call),
      },
    });
    expect(wrapper.find('.preview-header__name').text()).toEqual(display);
  });

  it('Correctly displays call displayNumber', () => {
    const wrapper = shallowMount(CallPreview, {
      store,
      localVue,
      stubs: { Icon: true },
      propsData: {
        call,
        index: state.callList.indexOf(call),
      },
    });
    expect(wrapper.find('.call-preview__number').text()).toEqual(display);
  });

  it('Draws border on call on hold', () => {
    const wrapper = shallowMount(CallPreview, {
      store,
      localVue,
      stubs: { Icon: true },
      propsData: {
        call,
        index: state.callList.indexOf(call),
      },
    });
    expect(wrapper.find('.queue-preview')
      .classes())
      .toContain('hold');
  });
});

describe('Preview Actions', () => {
  let state;
  const { actions } = workspaceModule;
  let store;
  let call;

  beforeEach(() => {
    call = {
      state: CallActions.Ringing,
      direction: CallDirection.Inbound,
    };
    state = {
      callList: [call],
    };
    store = new Vuex.Store({
      modules: {
        workspace: {
          namespaced: true,
          state,
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

  it('Shows preview actions on Inbound Ringing', () => {
    const wrapper = shallowMount(CallPreview, {
      store,
      localVue,
      stubs: { Icon: true },
      propsData: {
        call,
        index: state.callList.indexOf(call),
      },
    });
    expect(wrapper.find('.preview-actions')
      .exists())
      .toBeTruthy();
  });

  it('Shows preview actions on Preview Dialer', () => {
    call = {
      state: CallActions.Ringing,
      direction: CallDirection.Outbound,
      queue: { queue_type: 'preview' },
    };
    const wrapper = shallowMount(CallPreview, {
      store,
      localVue,
      stubs: { Icon: true },
      propsData: {
        call,
        index: state.callList.indexOf(call),
      },
    });
    expect(wrapper.find('.preview-actions')
      .exists())
      .toBeTruthy();
  });

  it('Hides preview actions on Outbound calls', () => {
    call = {
      direction: CallDirection.Outbound,
    };
    const wrapper = shallowMount(CallPreview, {
      store,
      localVue,
      stubs: { Icon: true },
      propsData: {
        call,
        index: state.callList.indexOf(call),
      },
    });
    expect(wrapper.find('.preview-actions')
      .exists())
      .toBeFalsy();
  });
});

describe('Answer and Hangup', () => {
  let state;
  const { actions, mutations } = workspaceModule;
  let store;
  let call;

  beforeEach(() => {
    call = {
      state: CallActions.Ringing,
      direction: CallDirection.Inbound,
      answer: jest.fn(),
      hangup: jest.fn(),
    };
    state = {
      callList: [call],
    };
    store = new Vuex.Store({
      modules: {
        workspace: {
          namespaced: true,
          state,
          actions,
          mutations,
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

  it('Answers to call', () => {
    call.allowAnswer = true;
    const wrapper = shallowMount(CallPreview, {
      store,
      localVue,
      stubs: { Icon: true },
      propsData: {
        call,
        index: state.callList.indexOf(call),
      },
    });
    // because Vue Test Utils can't find element by class and trigger .native event :(
    wrapper.findAll(Btn)
      .wrappers
      .find((wrapper) => wrapper.classes()
        .includes('call'))
      .trigger('click');

    expect(call.answer)
      .toHaveBeenCalled();
  });

  it('Hangups to call', () => {
    call.allowHangup = true;
    const wrapper = shallowMount(CallPreview, {
      store,
      localVue,
      stubs: { Icon: true },
      propsData: {
        call,
        index: state.callList.indexOf(call),
      },
    });
    // because Vue Test Utils can't find element by class and trigger .native event :(
    wrapper.findAll(Btn)
      .wrappers
      .find((wrapper) => wrapper.classes()
        .includes('end'))
      .trigger('click');

    expect(call.hangup)
      .toHaveBeenCalled();
  });
});
