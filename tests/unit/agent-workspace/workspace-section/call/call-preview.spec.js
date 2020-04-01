import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import workspaceModule from '../../../../../src/store/modules/agent-workspace/agent-workspace';
import CallStates from '../../../../../src/store/modules/agent-workspace/call/callUtils/CallStates';
import CallPreview
  from '../../../../../src/components/agent-workspace/workspace-section/call/call-preview.vue';
import PreviewProfile from '../../../../../src/components/agent-workspace/workspace-section/call/call-preview-profile.vue';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('Transfer functionality', () => {
  let state;
  const { actions, mutations } = workspaceModule;
  let store;

  beforeEach(() => {
    state = {};
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

  it('Opens transfer tab from call-preview', () => {
    const wrapper = shallowMount(CallPreview, {
      store,
      localVue,
      stubs: { Icon: true },
    });
    const transferBtn = wrapper.find('.transfer');
    transferBtn.trigger('click');
    expect(state.callState)
      .toEqual(CallStates.TRANSFER);
  });
});

describe('Answer and Hangup functionality', () => {
  let state;
  const { actions, mutations } = workspaceModule;
  let store;

  beforeEach(() => {
    state = {
      callOnWorkspace: {
        allowAnswer: true,
        allowHangup: true,
        answer: jest.fn(),
        hangup: jest.fn(),
      },
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

  it('Answers on call', () => {
    const wrapper = shallowMount(CallPreview, {
      store,
      localVue,
      stubs: { Icon: true },
    });
    const answerBtn = wrapper.find('.call');
    answerBtn.trigger('click');
    expect(state.callOnWorkspace.answer)
      .toHaveBeenCalled();
  });

  it('Hangups call', () => {
    const wrapper = shallowMount(CallPreview, {
      store,
      localVue,
      stubs: { Icon: true },
    });
    const hangupBtn = wrapper.find('.end');
    hangupBtn.trigger('click');
    expect(state.callOnWorkspace.hangup)
      .toHaveBeenCalled();
  });
});

describe('preview-profile displays', () => {
  let state;
  let store;
  const display = 'jest';

  beforeEach(() => {
    state = {
      callOnWorkspace: {
        displayName: display,
        displayNumber: display,
      },
    };
    store = new Vuex.Store({
      modules: {
        workspace: {
          namespaced: true,
          state,
        },
      },
    });
  });

  it('Correctly displays call displayName', () => {
    const wrapper = shallowMount(PreviewProfile, {
      store,
      localVue,
      stubs: { Icon: true },
    });
    expect(wrapper.find('.preview-profile__name').text()).toEqual(display);
  });

  it('Correctly displays call displayNumber', () => {
    const wrapper = shallowMount(PreviewProfile, {
      store,
      localVue,
      stubs: { Icon: true },
    });
    expect(wrapper.find('.preview-profile__number').text()).toEqual(display);
  });
});
