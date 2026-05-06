import { shallowMount } from '@vue/test-utils';
import { createStore } from 'vuex';

import VideoContainer from '../video-container.vue';

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

	const buildStore = (callOnWorkspace = {}) =>
		createStore({
			state: {
				features: {
					call: {
						callInfo: new Map(),
					},
				},
			},
			getters: {
				'features/call/CALL_ON_WORKSPACE': () => callOnWorkspace,
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
