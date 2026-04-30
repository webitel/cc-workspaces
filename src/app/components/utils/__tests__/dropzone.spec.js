import { shallowMount } from '@vue/test-utils';

import Dropzone from '../dropzone.vue';

describe('Dropzone', () => {
	it('renders localized title and description blocks', () => {
		const wrapper = shallowMount(Dropzone);
		expect(wrapper.find('.dropzone__title').exists()).toBe(true);
		expect(wrapper.find('.dropzone__description').exists()).toBe(true);
		expect(wrapper.find('.dropzone--animated').exists()).toBe(true);
	});
});
