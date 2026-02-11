import { config, shallowMount } from '@vue/test-utils';

import FlowsAPI from '../../api/flows';
import FlowButton from '../flow-button.vue';

const id = 12;

describe('FlowButton', () => {
	it('renders a component', () => {
		const wrapper = shallowMount(FlowButton, {
			props: {
				id,
			},
		});
		expect(wrapper.exists()).toBe(true);
	});

	it('run flow', async () => {
		const mock = vi.fn();
		vi.spyOn(FlowsAPI, 'run').mockImplementationOnce(mock);
		const wrapper = shallowMount(FlowButton, {
			props: {
				id,
			},
		});

		await wrapper.find('wt-button-stub').trigger('click');
		expect(mock).toHaveBeenCalled();
	});
});
