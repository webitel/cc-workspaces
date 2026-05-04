import { shallowMount } from '@vue/test-utils';

import RadialProgress from '../radial-progress.vue';

describe('Radial Progress', () => {
	it('computes finished percentage and stroke offset', () => {
		const wrapper = shallowMount(RadialProgress, {
			props: {
				max: 10,
				value: 5,
			},
		});
		expect(wrapper.vm.finishedPercentage).toBe(50);
		expect(Number.isFinite(Number(wrapper.vm.strokeDashoffset))).toBe(true);
		expect(wrapper.vm.progressStyle.transition).toContain('stroke-dashoffset');
	});

	it('changes direction sign when isClockwise is false', () => {
		const wrapper = shallowMount(RadialProgress, {
			props: {
				max: 10,
				value: 5,
				isClockwise: false,
			},
		});
		expect(wrapper.vm.direction()).toBe(-1);
	});
});
