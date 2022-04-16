import { shallowMount } from '@vue/test-utils';
import ChatMessageImage
  from '../../../../../../../../src/ui/modules/work-section/modules/chat/components/chat-messaging-container/chat-messages/message/chat-message-image.vue';

let message = {};

describe('ChatMessageImage component', () => {
  beforeEach(() => {
    message = {};
  });

  it('renders a component', () => {
    const wrapper = shallowMount(ChatMessageImage, { propsData: { message } });
    expect(wrapper.exists()).toBe(true);
  });

  it('correctly computes message with image', () => {
    message = {
      file: {
        mime: 'image/png',
      },
    };
    const wrapper = shallowMount(ChatMessageImage, { propsData: { message } });
    expect(wrapper.vm.image).toBeTruthy();
  });
});
