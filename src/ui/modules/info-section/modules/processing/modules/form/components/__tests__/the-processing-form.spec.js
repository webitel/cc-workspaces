import { shallowMount } from '@vue/test-utils';

import TheProcessingForm from '../the-processing-form.vue';

describe('TheProcessingForm', () => {
  const task = { task: {} };

  const props = {
    task,
  };
  const mocks = {
    $refs: {
      'processing-form': {},
    },
  };

  beforeEach(() => {
    task.attempt = {
      form: {
        body: [],
        actions: [],
      },
    };
  });

  it('renders a component', () => {
    const wrapper = shallowMount(TheProcessingForm, {
      props,
      mocks,
    });
    expect(wrapper.isVisible()).toBe(true);
  });

  it('initializes components with initialValues', () => {
    const value = 'jest';
    const component = { value: '', view: { initialValue: value } };
    task.attempt.form.body.push(component);
    shallowMount(TheProcessingForm, {
      props,
      mocks,
    });
    expect(component.value).toBe(value);
  });
});
