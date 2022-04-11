import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import chat from '@/store/modules/chat/chat';
import ChatQueuePreview
  from '../../../../../../src/components/agent-workspace/queue-section/chat-queue/chat-queue/chat-queue-preview.vue';

const localVue = createLocalVue();
localVue.use(Vuex);

const store = new Vuex.Store({ modules: { chat } });
const displayName = 'jest';
const lastMessage = 'jest2';
const task = {
  id: '1',
  members: [{ name: 'jest' }],
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

  it('correctly computes last message text, if last message is file', () => {
    const filename = 'jest';
    const testTask = { ...task, messages: [{ file: { name: filename } }] };
    const wrapper = shallowMount(ChatQueuePreview, {
      localVue,
      store,
      propsData: { task: testTask },
    });
    expect(wrapper.vm.lastMessage).toBe(filename);
  });

  it('correctly computes chat participants name to display', () => {
    const wrapper = shallowMount(ChatQueuePreview, { localVue, store, propsData: { task } });
    expect(wrapper.vm.displayName).toBe(displayName);
  });

  it('Correctly displays chat displayQueueName', () => {
    const queueName = 'jest3';
    const testTask = { ...task, task: { queue: { name: queueName } } };
    const wrapper = shallowMount(ChatQueuePreview, {
      store,
      localVue,
      propsData: { task: testTask },
    });
    expect(wrapper.findComponent({ name: 'wt-chip' }).exists()).toBe(true);
    expect(wrapper.findComponent({ name: 'wt-chip' }).text()).toBe(queueName);
  });

  it('if chat has no queue, queue chip is absent', () => {
    const testTask = { ...task, task: {} };
    const wrapper = shallowMount(ChatQueuePreview, {
      store,
      localVue,
      propsData: { task: testTask },
    });
    expect(wrapper.find('.queue-preview-chips').exists()).toBe(false);
  });
});
