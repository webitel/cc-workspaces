import { shallowMount } from '@vue/test-utils';
import ProcessingTab from '../processing-tab.vue';

describe('ProcessingTab', () => {
  let task = { task: {} };

  const propsData = {
    task,
  };
  const mocks = {
    $refs: {
      processing: {},
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
    const wrapper = shallowMount(ProcessingTab, {
      propsData,
      mocks,
    });
    expect(wrapper.isVisible()).toBe(true);
  });

  it('initializes components with initialValues', () => {
    const value = 'jest';
    const component = { value: '', view: { initialValue: value } };
    task.task.form.body.push(component);
    shallowMount(ProcessingTab, {
      propsData,
      mocks,
    });
    expect(component.value).toBe(value);
  });
});
