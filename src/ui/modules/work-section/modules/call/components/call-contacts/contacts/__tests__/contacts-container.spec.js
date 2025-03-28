import { mount,shallowMount } from '@vue/test-utils';

import ContactsContainer from '../contacts-container.vue';


describe('ContactsContainer', () => {
  it('renders a component', () => {
    vi.spyOn(ContactsContainer.methods, 'fetch').mockImplementationOnce(() => {});
    const wrapper = shallowMount(ContactsContainer);
    expect(wrapper.exists()).toBe(true);
  });

  it('renders data, returned from fetch', async () => {
    const dataList = [
      { phones: [], name: {}, id: 'vi' },
    ];

    const fetchMock = vi.fn(() => ({ items: dataList }));

    vi.spyOn(ContactsContainer.methods, 'fetch').mockImplementationOnce(fetchMock);
    const wrapper = mount(ContactsContainer, {
      shallow: true,
      global: {
        stubs: {
          LookupItemContainer: false,
          ContactLookupItem: false,
        },
      },
    });
    wrapper.findComponent({ name: 'LookupItemContainer' }).vm.$emit('more');
    await wrapper.vm.$nextTick(); // fetch
    expect(fetchMock).toHaveBeenCalled();
    await wrapper.vm.$nextTick(); // render
    expect(wrapper.findAllComponents({ name: 'contact-lookup-item' }).length).toBe(dataList.length);
  });

  it('makes call with event call from ContactLookupItem', async () => {
    const number = '123';

    const phone = { number };

    const callMock = vi.fn();

    vi.spyOn(ContactsContainer.methods, 'makeCall').mockImplementationOnce(callMock);

    const wrapper = mount(ContactsContainer, {
      shallow: true,
      global: {
        stubs: {
          LookupItemContainer: false,
          ContactLookupItem: false,
        },
      },
    });
    await wrapper.setData({ dataList: [{ name: {}, phones: [phone], id: 'vi' }] });
    await wrapper.vm.$nextTick();
    wrapper.findComponent({ name: 'ContactLookupItem' }).vm.$emit('call', phone);
    await wrapper.vm.$nextTick();
    expect(callMock).toHaveBeenCalledWith({ number });
  });
});
