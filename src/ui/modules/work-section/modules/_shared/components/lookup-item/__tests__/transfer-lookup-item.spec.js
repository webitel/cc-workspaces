import { shallowMount } from '@vue/test-utils';
import AbstractUserStatus
  from '@webitel/ui-sdk/src/enums/AbstractUserStatus/AbstractUserStatus.enum';
import ContactLookupItem from '../contact-lookup-item';
import TransferLookupItem from '../transfer-lookup-item.vue';
import ChatTransferDestination from '../../../../chat/enums/ChatTransferDestination.enum';

const computed = {
  state() {
    return 'chat';
  },
};
describe('TransferLookupItem', () => {
  const item = {};
  const type = ChatTransferDestination.USER;

  it('renders a component', () => {
    const wrapper = shallowMount(TransferLookupItem, {
      propsData: { item, type },
      computed,
    });
    expect(wrapper.exists()).toBe(true);
  });

  it('emits input event at wt-icon-btn click', () => {
    const wrapper = shallowMount(TransferLookupItem, {
      propsData: { item, type },
      computed,
    });
    wrapper.findComponent({ name: 'wt-rounded-action' }).vm.$emit('click');
    expect(wrapper.emitted().input[0]).toEqual([item]);
  });

  it('correctly comoputes user ACTIVE status: web', () => {
    item.presence = { status: 'web' };
    const wrapper = shallowMount(ContactLookupItem, {
      propsData: { item },
    });
    expect(wrapper.vm.userStatus).toBe(AbstractUserStatus.ACTIVE);
  });

  it('correctly comoputes user ACTIVE status: sip', () => {
    item.presence = { status: 'sip' };
    const wrapper = shallowMount(ContactLookupItem, {
      propsData: { item },
    });
    expect(wrapper.vm.userStatus).toBe(AbstractUserStatus.ACTIVE);
  });

  it('correctly comoputes user BUSY status: dlg', () => {
    item.presence = { status: 'dlg' };
    const wrapper = shallowMount(ContactLookupItem, {
      propsData: { item },
    });
    expect(wrapper.vm.userStatus).toBe(AbstractUserStatus.BUSY);
  });

  it('correctly comoputes user DND status: dnd', () => {
    item.presence = { status: 'dnd' };
    const wrapper = shallowMount(ContactLookupItem, {
      propsData: { item },
    });
    expect(wrapper.vm.userStatus).toBe(AbstractUserStatus.DND);
  });
});
