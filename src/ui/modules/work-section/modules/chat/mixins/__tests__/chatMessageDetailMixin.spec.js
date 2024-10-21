import { shallowMount } from '@vue/test-utils';
import chatMessageFileMixin from '../chatMessageFileMixin.js';

const Component = {
  render() {},
  mixins: [chatMessageFileMixin],
};

describe('chatMessageDetailMixin', () => {
  let file;
  let type;

  beforeEach(() => {
    file = {};
    type = '';
  });

  it('renders a component', () => {
    const wrapper = shallowMount(Component, {
      props: { file, type },
    });
    expect(wrapper.exists()).toBe(true);
  });

  it('correctly computes "image": True case', () => {
    const file = { url: 'aa11' };
    const type = 'image';
    const wrapper = shallowMount(Component, {
      props: { file, type },
    });
    expect(wrapper.vm.image).toEqual(file);
  });

  it('correctly computes "image": False case', () => {
    const file = { url: 'aa11' };
    const type = 'video';
    const wrapper = shallowMount(Component, {
      props: { file, type },
    });
    expect(wrapper.vm.image).toBeFalsy();
  });

  it('correctly computes "audio": Audio case', () => {
    const file = { url: 'aa11' };
    const type = 'audio';
    const wrapper = shallowMount(Component, {
      props: { file, type },
    });
    expect(wrapper.vm.media).toEqual(file);
  });

  it('correctly computes "audio": Video case', () => {
    const file = { url: 'aa11' };
    const type = 'video';
    const wrapper = shallowMount(Component, {
      props: { file, type },
    });
    expect(wrapper.vm.media).toEqual(file);
  });

  it('correctly computes "audio": False case', () => {
    const file = { url: 'aa11' };
    const type = 'image';
    const wrapper = shallowMount(Component, {
      props: { file, type },
    });
    expect(wrapper.vm.media).toBeFalsy();
  });

  it('correctly computes "document": image case', () => {
    const file = { url: 'aa11' };
    const type = 'image';
    const wrapper = shallowMount(Component, {
      props: { file, type },
    });
    expect(wrapper.vm.document).toBe(null);
  });

  it('correctly computes "document": audio case', () => {
    const file = { url: 'aa11' };
    const type = 'video';
    const wrapper = shallowMount(Component, {
      props: { file, type },
    });
    expect(wrapper.vm.document).toBe(null);
  });

  it('correctly computes "document": True case', () => {
    const file = { url: 'aa11' };
    const type = 'pdf';
    const wrapper = shallowMount(Component, {
      props: { file, type },
    });
    expect(wrapper.vm.document).toEqual(file);
  });
});
