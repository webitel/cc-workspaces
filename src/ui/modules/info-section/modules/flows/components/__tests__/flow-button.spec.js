import { shallowMount } from '@vue/test-utils';

import FlowsAPI from '../../api/flows';
import FlowButton from '../flow-button.vue';

describe('FlowButton', () => {
	const flowItem = {
		id: 12,
		name: 'test-flow',
	};

	it('renders run button', () => {
		const wrapper = shallowMount(FlowButton, {
			props: {
				item: flowItem,
			},
		});
		expect(wrapper.exists()).toBe(true);
	});

	it('calls FlowsAPI.run with item on click', async () => {
		const runMock = vi.fn().mockResolvedValue(undefined);
		vi.spyOn(FlowsAPI, 'run').mockImplementationOnce(runMock);
		const wrapper = shallowMount(FlowButton, {
			props: {
				item: flowItem,
			},
		});

		await wrapper.find('wt-button-stub').trigger('click');
		expect(runMock).toHaveBeenCalledWith(flowItem);
	});
});
