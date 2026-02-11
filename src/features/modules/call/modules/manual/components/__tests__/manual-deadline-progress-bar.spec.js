import { shallowMount } from '@vue/test-utils';

import ManualDeadlineProgressBar from '../manual-deadline-progress-bar.vue';

describe('ManualDeadlineProgressBar', () => {
	it('renders a component', () => {
		const wrapper = shallowMount(ManualDeadlineProgressBar, {
			props: {
				deadline: 76,
			},
		});
		expect(wrapper.isVisible()).toBe(true);
	});

	it('renders a component with deadline 0', () => {
		const wrapper = shallowMount(ManualDeadlineProgressBar, {
			props: {
				deadline: 0,
			},
		});
		expect(wrapper.isVisible()).toBe(true);
	});

	it('renders a component with deadline 100', () => {
		const wrapper = shallowMount(ManualDeadlineProgressBar, {
			props: {
				deadline: 100,
			},
		});
		expect(wrapper.isVisible()).toBe(true);
	});

	it('adds warning class when deadline is greater than 50', () => {
		const wrapper = shallowMount(ManualDeadlineProgressBar, {
			props: {
				deadline: 52,
			},
		});
		expect(
			wrapper.find('.manual-deadline-progress-bar__progress').classes(),
		).toContain('manual-deadline-progress-bar__progress--warning');
	});

	it('adds danger class when deadline is greater than 75', () => {
		const wrapper = shallowMount(ManualDeadlineProgressBar, {
			props: {
				deadline: 76,
			},
		});
		expect(
			wrapper.find('.manual-deadline-progress-bar__progress').classes(),
		).toContain('manual-deadline-progress-bar__progress--danger');
	});
});
