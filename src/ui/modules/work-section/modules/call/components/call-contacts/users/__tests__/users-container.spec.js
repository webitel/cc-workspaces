import { shallowMount, mount } from '@vue/test-utils';
import UsersContainer
  from '../users-container.vue';

describe('UsersContainer', () => {
  it('renders a component', () => {
    const wrapper = shallowMount(UsersContainer);
    expect(wrapper.exists()).toBe(true);
  });

  it('at UserLookupItem "input" event, calls transfer() with passed item and destination', async () => {
    const item = { extension: '123' };
    const mock = vi.spyOn(UsersContainer.methods, 'makeCall')
                     .mockImplementationOnce(() => {});

    const wrapper = mount(UsersContainer, {
      attachTo: document.body, // for isVisible to work https://github.com/vuejs/vue-test-utils/issues/2073#issuecomment-1732696542
      shallow: true,
      global: {
        stubs: {
          LookupItemContainer: false,
          UserLookupItem: false,
        },
      },
      data: () => ({
        dataList: [item],
        isLoading: false,
      }),
    });
    expect(wrapper.findComponent({ name: 'wt-loader' }).exists()).toBe(false);
    expect(wrapper.findComponent({ name: 'empty-search' }).isVisible()).toBe(false);
    wrapper.findComponent({ name: 'user-lookup-item' }).vm.$emit('input', item);
    expect(mock).toHaveBeenCalledWith({ number: item.extension });
  });
});
