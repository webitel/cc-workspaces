import { shallowMount } from '@vue/test-utils';
import { createStore } from 'vuex';
import { CallActions } from 'webitel-sdk';

import InfoSectionModule from '../../store/infoSec.js';
import InfoSection from '../the-agent-info-section.vue';

const callOnWorkspace = {
	state: CallActions.Active,
	allowReporting: true,
};

describe('InfoSection', () => {
	let store;
	store = createStore({
		modules: {
			...InfoSectionModule,
		},
	});
	it('resolveDefaultTab returns processing tab for a closed chat pending post-processing', () => {
		const wrapper = shallowMount(InfoSection, {
			global: {
				plugins: [
					store,
				],
			},
			computed: {
				...InfoSection.computed,
				showProcessing: () => true,
				showFlows: () => false,
				taskOnWorkspace: () => ({
					id: '1',
					closedAt: 1753600000000,
					allowReporting: true,
				}),
			},
		});
		expect(wrapper.vm.resolveDefaultTab().value).toBe('processing');
	});

	it('resolveDefaultTab returns client info tab for a closed chat without post-processing', () => {
		const wrapper = shallowMount(InfoSection, {
			global: {
				plugins: [
					store,
				],
			},
			computed: {
				...InfoSection.computed,
				showProcessing: () => false,
				showFlows: () => false,
				taskOnWorkspace: () => ({
					id: '1',
					closedAt: 1753600000000,
				}),
			},
		});
		expect(wrapper.vm.resolveDefaultTab().value).toBe('client-info');
	});

	it('renders a component', () => {
		const wrapper = shallowMount(InfoSection, {
			global: {
				plugins: [
					store,
				],
			},
			computed: {
				...InfoSection.computed,
				showProcessing: () => true,
				showFlows: () => true,
				taskOnWorkspace: () => callOnWorkspace,
			},
		});
		expect(wrapper.isVisible()).toBe(true);
		expect(wrapper.find('.info-section').exists()).toBe(true);
		expect(
			wrapper
				.findComponent({
					name: 'the-agent-info-nav-panel',
				})
				.exists(),
		).toBe(true);
	});
});
