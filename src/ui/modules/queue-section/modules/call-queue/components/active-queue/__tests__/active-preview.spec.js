import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import { CallActions, CallDirection } from 'webitel-sdk';
import workspaceModule from '../../../../../../../store/agent-workspace';
import callModule from '../../../../../../../../features/call/call';
import ActivePreview
  from '../active-queue-preview.vue';

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
        call: {
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
    const wrapper = shallowMount(ActivePreview, {
      store,
      localVue,
      propsData: { call },
    });
    expect(wrapper.find('.queue-preview-header__name').text()).toEqual(display);
  });

  it('Correctly displays call displayNumber', () => {
    const wrapper = shallowMount(ActivePreview, {
      store,
      localVue,
      propsData: { call },
    });
    expect(wrapper.find('.active-preview__number').text()).toEqual(display);
  });

  it('Correctly displays call displayQueueName', () => {
    call.task = {
      queue: { name: display },
    };
    const wrapper = shallowMount(ActivePreview, {
      store,
      localVue,
      propsData: { call },
    });
    expect(wrapper.findComponent({ name: 'wt-chip' }).exists()).toBe(true);
    expect(wrapper.findComponent({ name: 'wt-chip' }).text()).toBe(display);
  });

  it('if call has no queue, queue chip is absent', () => {
    call.task = {};
    const wrapper = shallowMount(ActivePreview, {
      store,
      localVue,
      propsData: { call },
    });
    expect(wrapper.find('.queue-preview-chips').exists()).toBe(false);
  });
});

describe('Preview Actions', () => {
  let state;
  const { actions } = callModule;
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
        call: {
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
    const wrapper = shallowMount(ActivePreview, {
      store,
      localVue,
      propsData: { call },
    });
    expect(wrapper.find('.queue-preview-actions')
      .exists())
      .toBeTruthy();
  });

  it('Shows preview actions on Preview Dialer', () => {
    call = {
      state: CallActions.Ringing,
      direction: CallDirection.Outbound,
      queue: { queue_type: 'preview' },
    };
    const wrapper = shallowMount(ActivePreview, {
      store,
      localVue,
      propsData: { call },
    });
    expect(wrapper.find('.queue-preview-actions')
      .exists())
      .toBeTruthy();
  });

  it('Hides preview actions on Outbound calls', () => {
    call = {
      direction: CallDirection.Outbound,
    };
    const wrapper = shallowMount(ActivePreview, {
      store,
      localVue,
      propsData: { call },
    });
    expect(wrapper.find('.preview-actions')
      .exists())
      .toBeFalsy();
  });
});

describe('Answer and Hangup', () => {
  let state;
  const { actions, mutations, getters } = callModule;
  let store;
  let call;

  beforeEach(() => {
    call = {
      id: '1',
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
        workspace: workspaceModule,
        call: {
          namespaced: true,
          state,
          getters,
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
    const wrapper = shallowMount(ActivePreview, {
      store,
      localVue,
      propsData: { call },
    });
    wrapper.findAllComponents({ name: 'wt-button' }).at(0).vm.$emit('click');
    expect(call.answer).toHaveBeenCalled();
  });

  it('Hangups to call', () => {
    call.allowHangup = true;
    const wrapper = shallowMount(ActivePreview, {
      store,
      localVue,
      propsData: { call },
    });
    wrapper.findAllComponents({ name: 'wt-button' }).at(1).vm.$emit('click');
    expect(call.hangup).toHaveBeenCalled();
  });
});
