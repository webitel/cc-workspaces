import { shallowMount } from '@vue/test-utils';
import OfflinePreview
  from '../offline-queue-preview.vue';

describe('Other UIs', () => {
  let member;
  const name = 'jest';

  beforeEach(() => {
    member = {
      name,
    };
  });

  it('Correctly displays member name', () => {
    const wrapper = shallowMount(OfflinePreview, {
      props: {
        task: member,
      },
    });
    expect(wrapper.vm.displayName).toBe(name);
  });
});
