import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import chat from '@/store/modules/chat/chat';
import ChatQueueContainer from '../../../../../../src/components/agent-workspace/queue-section/chat-queue/chat-queue/chat-queue-container.vue';

const localVue = createLocalVue();
localVue.use(Vuex);
const store = new Vuex.Store({ modules: { chat } });

describe('ChatQueueContainer', () => {
  it('renders a component', () => {
    const wrapper = shallowMount(ChatQueueContainer, { localVue, store });
    expect(wrapper.exists()).toBe(true);
  });
});
