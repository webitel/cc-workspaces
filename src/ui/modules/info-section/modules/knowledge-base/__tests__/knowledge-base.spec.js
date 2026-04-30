import { shallowMount } from '@vue/test-utils';
import { createStore } from 'vuex';

import call from '../../../../../../features/modules/call/call';
import workspace from '../../../../../store/agent-workspace';
import KnowledgeBaseTab from '../knowledge-base-tab.vue';

describe('knowledge base info section tab', () => {
	let store;

	beforeEach(() => {
		store = createStore({
			modules: {
				workspace,
				call,
			},
		});
	});

	it('renders a component', () => {
		store = createStore({
			modules: {
				workspace: {
					namespaced: true,
					getters: {
						TASK_ON_WORKSPACE: () => ({
							variables: {
								knowledge_base: 'https://example.org/kb',
							},
						}),
					},
				},
			},
		});
		const wrapper = shallowMount(KnowledgeBaseTab, {
			global: {
				plugins: [
					store,
				],
			},
		});
		expect(wrapper.exists()).toBe(true);
		expect(wrapper.find('iframe').attributes('src')).toBe(
			'https://example.org/kb',
		);
	});
});
