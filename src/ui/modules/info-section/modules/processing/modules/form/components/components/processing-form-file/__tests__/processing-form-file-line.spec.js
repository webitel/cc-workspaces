import { shallowMount, mount } from '@vue/test-utils';
import FormFileStatus from '../../../../enums/FormFileStatus.enum';
import ProcessingFormFileLine from '../processing-form-file-line.vue';

describe('ProcessingFormFileLine', () => {
  let file = {};
  ProcessingFormFileLine.methods.initHref = jest.fn(); // prevent Jest "unhandled promise rejected" errors

  beforeEach(() => {
    file = {
      mime: '',
    };
  });

  it('renders a component', () => {
    const wrapper = shallowMount(ProcessingFormFileLine, {
      props: { file },
    });
    expect(wrapper.isVisible()).toBe(true);
  });
  it('correctly computes "done" status', () => {
    file = {
      mime: '',
      id: 123,
      metadata: {
        error: true,
        done: true,
        close: true,
        progress: true,
      },
    };

    const wrapper = shallowMount(ProcessingFormFileLine, {
      props: { file },
    });
    expect(wrapper.vm.status).toBe(FormFileStatus.DONE);
  });
  it('correctly computes "error" status', () => {
    file = {
      mime: '',
      metadata: {
        error: true,
        close: true,
        progress: true,
      },
    };

    const wrapper = shallowMount(ProcessingFormFileLine, {
      props: { file },
    });
    expect(wrapper.vm.status).toBe(FormFileStatus.ERROR);
  });
  it('correctly computes "after_error" status', () => {
    file = {
      mime: '',
      metadata: {
        error: true,
        progress: true,
      },
    };

    const wrapper = shallowMount(ProcessingFormFileLine, {
      props: { file },
    });
    expect(wrapper.vm.status).toBe(FormFileStatus.AFTER_ERROR);
  });
  it('correctly computes "after_done" status', () => {
    file = {
      mime: '',
      metadata: {
        done: true,
        progress: true,
      },
    };

    const wrapper = shallowMount(ProcessingFormFileLine, {
      props: { file },
    });
    expect(wrapper.vm.status).toBe(FormFileStatus.AFTER_DONE);
  });
  it('at "done" status, action icon click triggers delete event', () => {
    const wrapper = mount(ProcessingFormFileLine, {
      props: { file },
      computed: {
        ...ProcessingFormFileLine.computed,
        status: () => FormFileStatus.DONE,
      },
    });

    wrapper.findComponent({ name: 'wt-icon-btn' }).vm.$emit('click');
    expect(wrapper.emitted().delete).toBeTruthy();
  });
  it('at "error" status, action icon click triggers passed to "close" method', () => {
    const close = jest.fn();
    const wrapper = mount(ProcessingFormFileLine, {
      props: { file: { mime: '', metadata: { close } } },
      computed: {
        ...ProcessingFormFileLine.computed,
        status: () => FormFileStatus.ERROR,
      },
    });

    wrapper.findComponent({ name: 'wt-icon-btn' }).vm.$emit('click');
    expect(close).toHaveBeenCalled();
  });
});
