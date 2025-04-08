import { shallowMount } from '@vue/test-utils';

import ChatMessageDocument
  from '../chat-message-document.vue';

let file = {};
let type = '';

describe('ChatMessageDocument component', () => {
  beforeEach(() => {
    file = {};
    type = '';
  });

  it('renders a component', () => {
    const wrapper = shallowMount(ChatMessageDocument, { props: { file, type } });
    expect(wrapper.exists()).toBe(true);
  });

  it('correctly computes message document', () => {
      file = { id: '123' };
      type = '';

    const wrapper = shallowMount(ChatMessageDocument, { props: { file, type } });
    expect(wrapper.vm.document).toEqual(file);
  });

  it('file download function creates "a" element', () => {
    file = {
      id: '123',
      url: 'example.com',
      name: 'jest',
    };
    type = 'file/pdf';

    const link = {
      click: vi.fn(),
    };

    const wrapper = shallowMount(ChatMessageDocument, { props: { file, type } });
    vi.spyOn(document, 'createElement').mockImplementation(() => link);
    wrapper.vm.downloadDocument();
    expect(link.click).toHaveBeenCalled();
    expect(link.href).toBe(file.url);
    expect(link.download).toBe(file.name);
  });
});
