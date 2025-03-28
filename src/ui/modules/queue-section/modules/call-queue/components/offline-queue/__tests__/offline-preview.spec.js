import { shallowMount } from '@vue/test-utils';

import OfflinePreview
  from '../offline-queue-preview.vue';

describe('Other UIs', () => {
  let member;
  const name = 'jest';

  beforeEach(() => {
    member = {
      name,
      communications: [
        { destination: '123' },
        { destination: '456' },
      ],
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
