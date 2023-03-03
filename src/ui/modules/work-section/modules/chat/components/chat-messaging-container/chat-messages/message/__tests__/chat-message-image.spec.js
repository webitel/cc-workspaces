import { shallowMount } from '@vue/test-utils';
import ChatMessageImage
  from '../chat-message-image.vue';

let message = {};

describe('ChatMessageImage component', () => {
  beforeEach(() => {
    message = {};
  });

  it('renders a component', () => {
    const wrapper = shallowMount(ChatMessageImage, { props: { message } });
    expect(wrapper.exists()).toBe(true);
  });

  it('correctly computes message with image', () => {
    message = {
      file: {
        mime: 'image/png',
      },
    };
    const wrapper = shallowMount(ChatMessageImage, { props: { message } });
    expect(wrapper.vm.image).toBeTruthy();
  });
});
