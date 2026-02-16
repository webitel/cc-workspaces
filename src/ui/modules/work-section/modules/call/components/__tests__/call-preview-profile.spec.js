import { shallowMount } from '@vue/test-utils';

import PreviewProfile from '../call-preview-profile.vue';

describe('PreviewProfile', () => {
	const display = 'jest';
	let task;
	const computed = {
		task: () => task,
	};

	beforeEach(() => {
		task = {};
	});

	it('Correctly displays call displayName', () => {
		task.displayName = display;
		const wrapper = shallowMount(PreviewProfile, {
			computed,
		});
		expect(wrapper.find('.preview-profile__name').text()).toEqual(display);
	});

	it('Correctly displays call displayNumber', () => {
		task.displayNumber = display;
		const wrapper = shallowMount(PreviewProfile, {
			computed,
		});
		expect(wrapper.find('.preview-profile__number').text()).toEqual(display);
	});
});
