import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import workspaceModule from '../../../../../src/store/modules/agent-workspace/agent-workspace';
import call from '../../../../../src/store/modules/call/call';
import CallPreview
  from '../../../../../src/components/agent-workspace/workspace-section/call/call-preview.vue';
import PreviewProfile from '../../../../../src/components/agent-workspace/workspace-section/call/call-preview-profile.vue';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('Transfer functionality', () => {
  let store;

  beforeEach(() => {
    store = new Vuex.Store({
      modules: { call },
    });
  });

  it('Opens transfer tab from call-preview', () => {
    const wrapper = shallowMount(CallPreview, {
      store,
      localVue,
    });
    const transferBtn = wrapper.findAllComponents({ name: 'wt-rounded-action' }).at(1);
    transferBtn.vm.$emit('click', {});
    expect(wrapper.emitted().transfer)
      .toBeTruthy();
  });
});

describe('Answer and Hangup functionality', () => {
  let state;
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
        workspace: workspaceModule,
        call: {
          ...call,
          state,
        },
      },
    });
  });

  it('Answers on call', () => {
    const wrapper = shallowMount(CallPreview, {
      store,
      localVue,
    });
    const answerBtn = wrapper.findAllComponents({ name: 'wt-rounded-action' }).at(0);
    answerBtn.vm.$emit('click', {});
    expect(state.callOnWorkspace.answer)
      .toHaveBeenCalled();
  });

  it('Hangups call', () => {
    const wrapper = shallowMount(CallPreview, {
      store,
      localVue,
    });
    const hangupBtn = wrapper.findAllComponents({ name: 'wt-rounded-action' }).at(2);
    hangupBtn.vm.$emit('click', {});
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
        call: {
          ...call,
          state,
        },
      },
    });
  });

  it('Correctly displays call displayName', () => {
    const wrapper = shallowMount(PreviewProfile, {
      store,
      localVue,
    });
    expect(wrapper.find('.preview-profile__name').text()).toEqual(display);
  });

  it('Correctly displays call displayNumber', () => {
    const wrapper = shallowMount(PreviewProfile, {
      store,
      localVue,
    });
    expect(wrapper.find('.preview-profile__number').text()).toEqual(display);
  });
});
