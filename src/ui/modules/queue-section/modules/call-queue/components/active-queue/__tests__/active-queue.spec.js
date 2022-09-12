import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import workspaceModule from '../../../../../../../store/agent-workspace';
import callModule from '../../../../../../../../features/modules/call/call';
import ActiveQueue
  from '../active-queue-container.vue';
import ActivePreview
  from '../active-queue-preview.vue';
import MockSocket from '../../../../../../../../../tests/unit/mocks/MockSocket';
import webSocketClientController
  from '../../../../../../../../app/api/agent-workspace/websocket/WebSocketClientController';

const localVue = createLocalVue();
localVue.use(Vuex);

const initialCall = {};

const mockSocket = new MockSocket(initialCall);

jest.spyOn(webSocketClientController, 'getCliInstance').mockImplementation(() => mockSocket);

describe('Ringing and Hangup events call functionality', () => {
  let state;
  const { actions, mutations } = callModule;
  let store;

  beforeEach(() => {
    state = {
      callList: [initialCall],
    };
    store = new Vuex.Store({
      state: {
        client: webSocketClientController,
      },
      modules: {
        workspace: workspaceModule,
        features: {
          namespaced: true,
          modules: {
            call: {
              namespaced: true,
              state,
              actions,
              mutations,
            },
          },
        },
      },
    });
  });

  it('Draws new call when ringing event fires', async () => {
    const wrapper = shallowMount(ActiveQueue, {
      store,
      localVue,
    });
    await wrapper.vm.$store.dispatch('features/call/SUBSCRIBE_CALLS');
    await mockSocket.ringing({});
    expect(wrapper.findAllComponents(ActivePreview).length).toEqual(2);
  });

  it('Removes a call when destroy event fires', async () => {
    const wrapper = shallowMount(ActiveQueue, {
      store,
      localVue,
    });
    await wrapper.vm.$store.dispatch('features/call/SUBSCRIBE_CALLS');
    await mockSocket.destroyCall(initialCall);
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    expect(wrapper.findAllComponents(ActivePreview).length).toEqual(0);
  });
});

describe('Answer and Hangup', () => {
  const callList = [{}];

  const computed = {
    callList: () => callList,
    taskOnWorkspace: () => ({}),
  };

  it('Answers to call', () => {
    const mock = jest.fn();
    jest.spyOn(ActiveQueue.methods, 'answer').mockImplementationOnce(mock);

    const wrapper = shallowMount(ActiveQueue, {
      computed,
    });
    wrapper.findComponent({ name: 'active-queue-preview' }).vm.$emit('answer');
    expect(mock).toHaveBeenCalled();
  });

  it('Hangups to call', () => {
    const mock = jest.fn();
    jest.spyOn(ActiveQueue.methods, 'hangup').mockImplementationOnce(mock);

    const wrapper = shallowMount(ActiveQueue, {
      computed,
    });
    wrapper.findComponent({ name: 'active-queue-preview' }).vm.$emit('hangup');
    expect(mock).toHaveBeenCalled();
  });
});
