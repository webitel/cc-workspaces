import ConfigurationAPI from '@webitel/ui-sdk/src/api/clients/configurations/configurations';
import { createPinia } from 'pinia';
import { shallowMount } from '@vue/test-utils';
import { createStore } from 'vuex';
import { vi } from 'vitest';

import ClientInfo from '../client-info-tab.vue';

vi.mock('../../../../userinfo/userinfoStore', () => ({
	useUserinfoStore: () => ({
		hasLicense: () => true,
	}),
}));

describe('Client Info Tab', () => {
	it('renders component with chips', async () => {
		vi.spyOn(ConfigurationAPI, 'getList').mockResolvedValue({
			items: [],
		});

		const store = createStore({
			getters: {
				'workspace/IS_JOB_WORKSPACE': () => false,
				'features/chat/closed/IS_CHAT_ON_WORKSPACE_CLOSED': () => false,
			},
		});

		const wrapper = shallowMount(ClientInfo, {
			props: {
				task: {},
				size: 'md',
			},
			global: {
				plugins: [
					store,
					createPinia(),
				],
			},
		});
		expect(wrapper.exists()).toBe(true);
		expect(
			wrapper
				.findComponent({
					name: 'client-info-chips',
				})
				.exists(),
		).toBe(true);
	});

	//   it('Correctly renders key-value in call variables', () => {
	//     state.callOnWorkspace.variables = {
	//       key: 'value',
	//     };
	//     const wrapper = shallowMount(ClientInfo, {
	//       store,
	//       localVue,
	//     });
	//     // const md = wrapper.find('.md');
	//     // expect(md.find('h3').text()).toBe('key:');
	//     // expect(md.find('p').text()).toBe('value');
	//   });
	//
	//   it('Correctly renders key-value with MD in call variables', () => {
	//     state.callOnWorkspace.variables = {
	//       md: '# h1 Heading',
	//     };
	//     const wrapper = shallowMount(ClientInfo, {
	//       store,
	//       localVue,
	//     });
	//     const md = wrapper.find('.md');
	//     expect(md.find('h3').text()).toBe('md:');
	//     expect(md.find('h1').text()).toBe('h1 Heading');
	//   });
});
