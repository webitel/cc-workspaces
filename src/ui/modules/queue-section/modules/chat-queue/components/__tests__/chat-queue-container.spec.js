import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import chat from '../../../../../../../features/modules/chat/store/chat';
import ChatQueueContainer from '../chat-queue-container.vue';

const localVue = createLocalVue();
localVue.use(Vuex);
const store = new Vuex.Store({ modules: { chat } });

describe('ChatQueueContainer', () => {
  it('renders a component', () => {
    const wrapper = shallowMount(ChatQueueContainer, { localVue, store });
    expect(wrapper.exists()).toBe(true);
  });
});
