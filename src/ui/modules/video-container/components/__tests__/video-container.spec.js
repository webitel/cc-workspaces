import { shallowMount } from '@vue/test-utils';
import { createStore } from 'vuex';

import VideoContainer from '../video-container.vue';

describe('VideoContainer', () => {
	it('renders a component', () => {
		const store = createStore({
			state: {
				features: {
					call: {
						callInfo: new Map(),
					},
				},
			},
			getters: {
				'features/call/CALL_ON_WORKSPACE': () => ({}),
			},
		});
		const wrapper = shallowMount(VideoContainer, {
			global: {
				plugins: [
					store,
				],
			},
		});
		expect(wrapper.exists()).toBe(true);
	});
});
