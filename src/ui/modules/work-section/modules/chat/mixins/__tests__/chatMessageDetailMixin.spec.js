import { shallowMount } from '@vue/test-utils';
import chatMessageDetailMixin from '../chatMessageDetailMixin';

const Component = {
  render() {},
  mixins: [chatMessageDetailMixin],
};

describe('chatMessageDetailMixin', () => {
  let message;

  beforeEach(() => {
    message = {};
  });

  it('renders a component', () => {
    const wrapper = shallowMount(Component, {
      propsData: { message },
    });
    expect(wrapper.exists()).toBe(true);
  });

  it('correctly computes "image": True case', () => {
    const file = { mime: 'image' };
    message.file = file;
    const wrapper = shallowMount(Component, {
      propsData: { message },
    });
    expect(wrapper.vm.image).toBe(file);
  });

  it('correctly computes "image": False case', () => {
    const file = { mime: 'video' };
    message.file = file;
    const wrapper = shallowMount(Component, {
      propsData: { message },
    });
    expect(wrapper.vm.image).toBeFalsy();
  });

  it('correctly computes "audio": Audio case', () => {
    const file = { mime: 'audio' };
    message.file = file;
    const wrapper = shallowMount(Component, {
      propsData: { message },
    });
    expect(wrapper.vm.audio).toBe(file);
  });

  it('correctly computes "audio": Video case', () => {
    const file = { mime: 'video' };
    message.file = file;
    const wrapper = shallowMount(Component, {
      propsData: { message },
    });
    expect(wrapper.vm.audio).toBe(file);
  });

  it('correctly computes "audio": False case', () => {
    const file = { mime: 'image' };
    message.file = file;
    const wrapper = shallowMount(Component, {
      propsData: { message },
    });
    expect(wrapper.vm.audio).toBeFalsy();
  });

  it('correctly computes "showDocument": image case', () => {
    const file = { mime: 'image' };
    message.file = file;
    const wrapper = shallowMount(Component, {
      propsData: { message },
    });
    expect(wrapper.vm.showDocument).toBe(false);
  });

  it('correctly computes "showDocument": audio case', () => {
    const file = { mime: 'video' };
    message.file = file;
    const wrapper = shallowMount(Component, {
      propsData: { message },
    });
    expect(wrapper.vm.showDocument).toBe(false);
  });

  it('correctly computes "showDocument": True case', () => {
    const file = { mime: 'pdf' };
    message.file = file;
    const wrapper = shallowMount(Component, {
      propsData: { message },
    });
    expect(wrapper.vm.showDocument).toBe(true);
  });
});
