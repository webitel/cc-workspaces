import { mount, shallowMount } from '@vue/test-utils';

import MissedQueueContainer from '../missed-queue-container.vue';

describe('MissedQueueContainer', () => {
	const initializeMissedMock = vi
		.spyOn(MissedQueueContainer.methods, 'initializeMissed')
		.mockImplementation(() => {});

	it('renders a component', () => {
		const wrapper = shallowMount(MissedQueueContainer, {
			computed: {
				missedList: () => [
					{
						id: 'jest',
					},
				],
			},
		});
		expect(wrapper.exists()).toBe(true);
	});
	it('calls initializeMissed on created', () => {
		initializeMissedMock.mockClear();
		shallowMount(MissedQueueContainer, {
			computed: {
				missedList: () => [
					{
						id: 'jest',
					},
				],
			},
		});
		expect(initializeMissedMock).toHaveBeenCalled();
	});

	it('calls redial on call preview event', () => {
		const mock = vi
			.spyOn(MissedQueueContainer.methods, 'redial')
			.mockImplementationOnce(() => {});
		const wrapper = mount(MissedQueueContainer, {
			shallow: true,
			global: {
				stubs: {
					TaskQueueContainer: false,
					MissedQueuePreview: false,
				},
			},
			computed: {
				missedList: () => [
					{
						id: 'jest',
					},
				],
				next: () => false,
			},
		});
		wrapper
			.findComponent({
				name: 'missed-queue-preview',
			})
			.vm.$emit('call');
		expect(mock).toHaveBeenCalled();
	});

	it('calls hideMissed on hide preview event', () => {
		const mock = vi
			.spyOn(MissedQueueContainer.methods, 'hideMissed')
			.mockImplementationOnce(() => {});
		const wrapper = mount(MissedQueueContainer, {
			shallow: true,
			global: {
				stubs: {
					TaskQueueContainer: false,
					MissedQueuePreview: false,
				},
			},
			computed: {
				missedList: () => [
					{
						id: 'jest',
					},
				],
				next: () => false,
			},
		});
		wrapper
			.findComponent({
				name: 'missed-queue-preview',
			})
			.vm.$emit('hide');
		expect(mock).toHaveBeenCalled();
	});
});
