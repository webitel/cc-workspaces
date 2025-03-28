import { shallowMount, mount } from '@vue/test-utils';
import ContactCommunicationItem from '../contact-communication-item.vue';

describe('ContactCommunicationItem', () => {
  it('renders a component', () => {
    const phone = { number: 'vi' };
    const wrapper = shallowMount(ContactCommunicationItem, {
      props: { phone },
    });
    expect(wrapper.exists()).toBe(true);
  });

  it('correctly emits call event with phone number', () => {
    const phone = { number: 'vi' };
    const wrapper = mount(ContactCommunicationItem, {
      shallow: true,
      props: { phone },
      global: {
        stubs: {
          WtIconBtn: false,
        },
      },
    });
    wrapper.findComponent({ name: 'WtIconBtn' }).vm.$emit('click');
    expect(wrapper.emitted().call[0][0]).toEqual(phone);
  });
});
