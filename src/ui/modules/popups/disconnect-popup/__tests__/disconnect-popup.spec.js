import { mount, shallowMount } from '@vue/test-utils';
import { createStore } from 'vuex';

import globals from '../../../../../features/modules/global-handlers/store/global-handlers';
import DisconnectPopup from '../components/disconnect-popup.vue';

describe('disconnect popup', () => {
	let store;

	beforeEach(() => {
		store = new createStore({
			modules: {
				globals,
			},
		});
	});

	it('renders a component', () => {
		const wrapper = shallowMount(DisconnectPopup, {
			global: {
				plugins: [
					store,
				],
			},
		});
		expect(wrapper.exists()).toBe(true);
	});

	it('renders a component when v-if is truthy', () => {
		const wrapper = shallowMount(DisconnectPopup, {
			global: {
				plugins: [
					store,
				],
			},
			computed: {
				isDisconnectPopup() {
					return true;
				},
			},
		});
		expect(wrapper.exists()).toBe(true);
	});

	it('calls router go() method at "reload" btn', () => {
		const goMock = vi.fn();
		const wrapper = mount(DisconnectPopup, {
			global: {
				plugins: [
					store,
				],
				mocks: {
					$router: {
						go: goMock,
					},
				},
			},
			computed: {
				isDisconnectPopup() {
					return true;
				},
			},
		});
		// first btn is "reload"
		wrapper
			.findComponent({
				name: 'wt-button',
			})
			.vm.$emit('click');
		expect(goMock).toHaveBeenCalledWith(0);
	});
});
