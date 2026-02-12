import { shallowMount } from '@vue/test-utils';

import TaskFooter from '../task-footer.vue';

describe('TaskFooter', () => {
	it('renders a component', () => {
		const wrapper = shallowMount(TaskFooter);
		expect(wrapper.isVisible()).toBe(true);
	});
});
