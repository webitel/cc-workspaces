import { shallowMount } from '@vue/test-utils';
import TheProcessingForm from '../the-processing-form.vue';

describe('TheProcessingForm', () => {
  const task = { task: {} };

  const propsData = {
    task,
  };
  const mocks = {
    $refs: {
      'processing-form': {},
    },
  };

  beforeEach(() => {
    task.task = {
      form: {
        body: [],
        actions: [],
      },
    };
  });

  it('renders a component', () => {
    const wrapper = shallowMount(TheProcessingForm, {
      propsData,
      mocks,
    });
    expect(wrapper.isVisible()).toBe(true);
  });

  it('initializes components with initialValues', () => {
    const value = 'jest';
    const component = { value: '', view: { initialValue: value } };
    task.task.form.body.push(component);
    shallowMount(TheProcessingForm, {
      propsData,
      mocks,
    });
    expect(component.value).toBe(value);
  });
});
