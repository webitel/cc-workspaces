import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import chat from '@/store/modules/chat/chat';
import ChatQueuePreview from '../../../../../../src/components/agent-workspace/queue-section/chat-queue/chat-queue/chat-queue-preview.vue';

const localVue = createLocalVue();
localVue.use(Vuex);
const store = new Vuex.Store({ modules: { chat } });
const displayName = 'jest';
const lastMessage = 'jest2';
const task = {
  id: '1',
  otherChannels: [{ name: 'jest' }],
  messages: [{ text: 'jest1' }, { text: 'jest2' }],
};

describe('ChatQueuePreview', () => {
  it('renders a component', () => {
    const wrapper = shallowMount(ChatQueuePreview, { localVue, store, propsData: { task } });
    expect(wrapper.exists()).toBe(true);
  });

  it('correctly computes last message text', () => {
    const wrapper = shallowMount(ChatQueuePreview, { localVue, store, propsData: { task } });
    expect(wrapper.vm.lastMessage).toBe(lastMessage);
  });

  it('correctly computes chat participants name to display', () => {
    const wrapper = shallowMount(ChatQueuePreview, { localVue, store, propsData: { task } });
    expect(wrapper.vm.displayName).toBe(displayName);
  });
});
