import { shallowMount } from '@vue/test-utils';
import UserStatus from '../../../../../features/modules/agent-status/statusUtils/UserStatus';
import UserDndSwitcher from '../user-dnd-switcher.vue';

describe('User Dnd Switcher', () => {
  it('renders a component', () => {
    const wrapper = shallowMount(UserDndSwitcher, {
      computed: {
        user() {
          return {
            status: UserStatus.ACTIVE,
          };
        },
      },
    });
    expect(wrapper.exists()).toBe(true);
  });
});
