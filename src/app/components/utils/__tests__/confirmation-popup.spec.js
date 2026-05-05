import { shallowMount } from '@vue/test-utils';

import ConfirmationPopup from '../confirmation-popup.vue';

describe('ConfirmationPopup', () => {
	it('emits confirm and close on confirm()', () => {
		const wrapper = shallowMount(ConfirmationPopup);
		wrapper.vm.confirm();
		expect(wrapper.emitted('confirm')).toHaveLength(1);
		expect(wrapper.emitted('close')).toHaveLength(1);
	});

	it('emits close on popup close event', async () => {
		const wrapper = shallowMount(ConfirmationPopup);
		await wrapper
			.findComponent({
				name: 'wt-popup',
			})
			.vm.$emit('close');
		expect(wrapper.emitted('close')).toHaveLength(1);
	});
});
