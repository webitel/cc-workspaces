import { mount,shallowMount } from '@vue/test-utils';
import { createStore } from 'vuex';

import CallContactsContainer from '../call-contacts-container.vue';

const store = createStore({
  modules: {
    ui: {
      namespaced: true,
      modules: {
        userinfo: {
          namespaced: true,
          state: { scope: [{ class: 'contacts' }] },
        }
      },
    },
  },
});

describe('CallContactsContainer', () => {
  it('renders a component', () => {
    const wrapper = shallowMount(CallContactsContainer, {
      global: {
        plugins: [store],
      }
    });
    expect(wrapper.exists()).toBe(true);
  });

  it('opens the contacts container initially', () => {
    const wrapper = mount(CallContactsContainer, {
      shallow: true,
      global: {
        plugins: [store],
        stubs: {
          WtTabs: false,
        },
      }
    });
    expect(wrapper.findComponent({ name: 'contacts-container' }).exists()).toBe(true);
  });

  it('opens the users container', async () => {
    const wrapper = mount(CallContactsContainer, {
      shallow: true,
      global: {
        plugins: [store],
        stubs: {
          WtTabs: false,
        },
      }
    });
    expect(wrapper.findComponent({ name: 'users-container' }).exists()).toBe(false);
    wrapper.findComponent('.wt-tabs')
    .vm.$emit('change', { value: 'users', component: { name: 'users-container' } });
    await wrapper.vm.$nextTick();
    expect(wrapper.findComponent({ name: 'users-container' }).exists()).toBe(true);
  });
});
