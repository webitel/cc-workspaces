import { shallowMount } from '@vue/test-utils';
import ChatMessage
  from '../../../../../../../src/components/agent-workspace/workspace-section/chat/shared/chat-messages/chat-message.vue';

let message = {};
describe('Chat Message component', () => {
  beforeEach(() => {
    message = {};
  });

  it('renders a component', () => {
    const wrapper = shallowMount(ChatMessage, { propsData: { message } });
    expect(wrapper.exists()).toBe(true);
  });

  it('correctly computes sentAt time', () => {
    message.createdAt = '0';
    const wrapper = shallowMount(ChatMessage, { propsData: { message } });
    expect(wrapper.vm.sentAt).toBeTruthy();
  });

  it('correctly computes message text', () => {
    const text = 'jest';
    message.text = text;
    const wrapper = shallowMount(ChatMessage, { propsData: { message } });
    expect(wrapper.vm.text).toBe(text);
  });

  it('correctly computes message with image', () => {
    message = {
      file: {
        mime: 'image/png',
      },
    };
    const wrapper = shallowMount(ChatMessage, { propsData: { message } });
    expect(wrapper.vm.image).toBeTruthy();
  });

  it('correctly computes message document', () => {
    message = {
      file: { id: '123', mime: '' },
    };
    const wrapper = shallowMount(ChatMessage, { propsData: { message } });
    expect(wrapper.vm.document).toEqual(message.file);
  });

  it('file download function creates "a" element', () => {
    message.file = {
      id: '123',
      mime: 'file/pdf',
      url: 'example.com',
      name: 'jest',
    };
    const link = {
      click: jest.fn(),
    };
    const wrapper = shallowMount(ChatMessage, { propsData: { message } });
    jest.spyOn(document, 'createElement').mockImplementation(() => link);
    wrapper.vm.downloadDocument();
    expect(link.click).toHaveBeenCalled();
    expect(link.href).toBe(message.file.url);
    expect(link.download).toBe(message.file.name);
  });
});
