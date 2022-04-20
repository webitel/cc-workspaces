import { shallowMount } from '@vue/test-utils';
import CallContactsContainer
  from '../call-contacts-container.vue';

describe('CallContactsContainer', () => {
  it('renders a component', () => {
    const wrapper = shallowMount(CallContactsContainer);
    expect(wrapper.exists()).toBe(true);
  });

  it('at ContactLookupItem "input" event, calls transfer() with passed item and destination', async () => {
    const item = { extension: '123' };
    const mock = jest.spyOn(CallContactsContainer.methods, 'makeCall')
                     .mockImplementationOnce(() => {});

    const wrapper = shallowMount(CallContactsContainer, {
      data: () => ({
        dataList: [item],
      }),
    });
    wrapper.setData({ isLoading: false }); // cannot normally mock data loading cause isLoading mutations are in mixin
    await wrapper.vm.$nextTick();
    expect(wrapper.findComponent({ name: 'wt-loader' }).exists()).toBe(false);
    expect(wrapper.findComponent({ name: 'empty-search' }).exists()).toBe(false);
    wrapper.findComponent({ name: 'contact-lookup-item' }).vm.$emit('input', item);
    expect(mock).toHaveBeenCalledWith({ user: item });
  });
});
