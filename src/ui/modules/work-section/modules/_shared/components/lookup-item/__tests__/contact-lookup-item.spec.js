import { shallowMount, mount } from '@vue/test-utils';
import AbstractUserStatus
  from '@webitel/ui-sdk/src/enums/AbstractUserStatus/AbstractUserStatus.enum';
import ContactLookupItem from '../contact-lookup-item.vue';

describe('ContactLookupItem', () => {
  const item = {};

  it('renders a component', () => {
    const wrapper = shallowMount(ContactLookupItem, {
      props: { item },
    });
    expect(wrapper.exists()).toBe(true);
  });

  it('emits input event at wt-rounded-action click', () => {
    const wrapper = mount(ContactLookupItem, {
      props: { item },
    });
    wrapper.findComponent({ name: 'wt-rounded-action' }).vm.$emit('click');
    expect(wrapper.emitted().input[0]).toEqual([item]);
  });

  it('correctly comoputes user ACTIVE status: web', () => {
    item.presence = { status: 'web' };
    const wrapper = shallowMount(ContactLookupItem, {
      props: { item },
    });
    expect(wrapper.vm.userStatus).toBe(AbstractUserStatus.ACTIVE);
  });

  it('correctly comoputes user ACTIVE status: sip', () => {
    item.presence = { status: 'sip' };
    const wrapper = shallowMount(ContactLookupItem, {
      props: { item },
    });
    expect(wrapper.vm.userStatus).toBe(AbstractUserStatus.ACTIVE);
  });

  it('correctly comoputes user BUSY status: dlg', () => {
    item.presence = { status: 'dlg' };
    const wrapper = shallowMount(ContactLookupItem, {
      props: { item },
    });
    expect(wrapper.vm.userStatus).toBe(AbstractUserStatus.BUSY);
  });

  it('correctly comoputes user DND status: dnd', () => {
    item.presence = { status: 'dnd' };
    const wrapper = shallowMount(ContactLookupItem, {
      props: { item },
    });
    expect(wrapper.vm.userStatus).toBe(AbstractUserStatus.DND);
  });
});
