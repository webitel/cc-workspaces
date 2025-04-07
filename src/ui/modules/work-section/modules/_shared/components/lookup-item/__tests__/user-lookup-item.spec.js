import { mount,shallowMount } from '@vue/test-utils';
import AbstractUserStatus
  from '@webitel/ui-sdk/src/enums/AbstractUserStatus/AbstractUserStatus.enum';

import UserLookupItem from '../user-lookup-item.vue';

describe('UserLookupItem', () => {
  const item = {};

  it('renders a component', () => {
    const wrapper = shallowMount(UserLookupItem, {
      props: { item },
    });
    expect(wrapper.exists()).toBe(true);
  });

  it('emits input event at wt-rounded-action click', () => {
    const wrapper = mount(UserLookupItem, {
      props: { item },
    });
    wrapper.findComponent({ name: 'wt-rounded-action' }).vm.$emit('click');
    expect(wrapper.emitted().input[0]).toEqual([item]);
  });

  it('correctly comoputes user PAUSE status: pause', () => {
    item.status = 'pause';
    const wrapper = shallowMount(UserLookupItem, {
      props: { item },
    });
    expect(wrapper.vm.userStatus).toBe(AbstractUserStatus.PAUSE);
  });

  it('correctly comoputes user ONLINE status: online', () => {
    item.status = 'online';
    const wrapper = shallowMount(UserLookupItem, {
      props: { item },
    });
    expect(wrapper.vm.userStatus).toBe(AbstractUserStatus.ONLINE);
  });

  it('correctly comoputes user OFFLINE status: offline', () => {
    item.status = 'offline';
    const wrapper = shallowMount(UserLookupItem, {
      props: { item },
    });
    expect(wrapper.vm.userStatus).toBe(AbstractUserStatus.OFFLINE);
  });

  it('correctly comoputes user BUSY status: dlg', () => {
    item.presence = { status: 'dlg' };
    const wrapper = shallowMount(UserLookupItem, {
      props: { item },
    });
    expect(wrapper.vm.userStatus).toBe(AbstractUserStatus.BUSY);
  });

  it('correctly comoputes user DND status: dnd', () => {
    item.presence = { status: 'dnd' };
    const wrapper = shallowMount(UserLookupItem, {
      props: { item },
    });
    expect(wrapper.vm.userStatus).toBe(AbstractUserStatus.DND);
  });
});
