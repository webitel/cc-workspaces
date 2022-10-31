import { shallowMount } from '@vue/test-utils';
import RichTextEditor from '../rich-text-editor.vue';

describe('RichTextEditor', () => {
  it('renders a component', () => {
    const wrapper = shallowMount(RichTextEditor);
    expect(wrapper.isVisible()).toBe(true);
  });
});
