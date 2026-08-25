import { shallowMount } from '@vue/test-utils';
import { createPinia } from 'pinia';
import { createStore } from 'vuex';

import VideoContainer from '../video-container.vue';

vi.mock('@webitel/ui-sdk/components', () => ({
	WtGalleria: {
		name: 'wt-galleria',
		template: '<div />',
	},
}));

describe('VideoContainer', () => {
	const createVideoStream = () => ({
		getVideoTracks: () => [
			{
				kind: 'video',
			},
		],
		getTracks: () => [
			{
				kind: 'video',
			},
		],
	});

	const buildStore = (activeVideoCall = {}) =>
		createStore({
			state: {
				features: {
					call: {
						callInfo: new Map(),
					},
				},
			},
			getters: {
				'features/call/ACTIVE_VIDEO_CALL': () => activeVideoCall,
			},
		});

	it('renders video-call when both local and peer video streams exist', () => {
		const store = buildStore({
			localStreams: [
				createVideoStream(),
			],
			peerStreams: [
				createVideoStream(),
			],
		});
		const wrapper = shallowMount(VideoContainer, {
			global: {
				plugins: [
					store,
					createPinia(),
				],
			},
		});
		expect(
			wrapper
				.findComponent({
					name: 'video-call',
				})
				.exists(),
		).toBe(true);
	});

	it('hides video-call when peer stream has no video', () => {
		const store = buildStore({
			localStreams: [
				createVideoStream(),
			],
			peerStreams: [],
		});
		const wrapper = shallowMount(VideoContainer, {
			global: {
				plugins: [
					store,
					createPinia(),
				],
			},
		});
		expect(
			wrapper
				.findComponent({
					name: 'video-call',
				})
				.exists(),
		).toBe(false);
	});
});
