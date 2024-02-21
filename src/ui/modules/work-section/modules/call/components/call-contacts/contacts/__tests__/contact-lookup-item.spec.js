import { shallowMount, mount } from '@vue/test-utils';
import ContactLookupItem from '../contact-lookup-item.vue';

describe('ContactLookupItem', () => {
  it('renders a component', () => {
    const item = { name: {}, phones: [], id: 'vi' };
    const wrapper = shallowMount(ContactLookupItem, {
      props: { item },
    });
    expect(wrapper.exists()).toBe(true);
  });

  it('correctly emits call event with phone number when there is only one phone', () => {
    const phone = { number: 'vi '};
    const item = { name: {}, phones: [phone], id: 'vi' };

    const wrapper = mount(ContactLookupItem, {
      shallow: true,
      props: { item },
      global: {
        stubs: {
          LookupItem: false,
          LookupItemWrapper: false,
          WtRoundedAction: false,
        },
      },
    });

    wrapper.findComponent({ name: 'WtRoundedAction' }).vm.$emit('click');

    expect(wrapper.emitted().call[0][0]).toEqual(phone);
  });

  it('correctly emits call event with phone number from communication item', async () => {
    const phone = { number: 'vi '};
    const item = { name: {}, phones: [phone, phone], id: 'vi' };

    const wrapper = mount(ContactLookupItem, {
      shallow: true,
      props: { item },
      global: {
        stubs: {
          LookupItem: false,
          LookupItemWrapper: false,
          WtRoundedAction: false,
          ContactCommunicationItem: false,
          WtExpandTransition: false,
        },
      },
    });

    wrapper.findComponent({ name: 'WtRoundedAction' }).vm.$emit('click');
    await wrapper.vm.$nextTick(); // render communication items
    wrapper.findComponent({ name: 'ContactCommunicationItem' }).vm.$emit('call', phone);
    expect(wrapper.emitted().call[0][0]).toEqual(phone);
  });
});
