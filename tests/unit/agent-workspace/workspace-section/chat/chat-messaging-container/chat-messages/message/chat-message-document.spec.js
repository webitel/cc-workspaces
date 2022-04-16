import { shallowMount } from '@vue/test-utils';
import ChatMessageDocument
  from '../../../../../../../../src/ui/modules/work-section/modules/chat/components/chat-messaging-container/chat-messages/message/chat-message-document.vue';

let message = {};

describe('ChatMessageDocument component', () => {
  beforeEach(() => {
    message = {};
  });

  it('renders a component', () => {
    const wrapper = shallowMount(ChatMessageDocument, { propsData: { message } });
    expect(wrapper.exists()).toBe(true);
  });

  it('correctly computes message document', () => {
    message = {
      file: { id: '123', mime: '' },
    };
    const wrapper = shallowMount(ChatMessageDocument, { propsData: { message } });
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
    const wrapper = shallowMount(ChatMessageDocument, { propsData: { message } });
    jest.spyOn(document, 'createElement').mockImplementation(() => link);
    wrapper.vm.downloadDocument();
    expect(link.click).toHaveBeenCalled();
    expect(link.href).toBe(message.file.url);
    expect(link.download).toBe(message.file.name);
  });
});
