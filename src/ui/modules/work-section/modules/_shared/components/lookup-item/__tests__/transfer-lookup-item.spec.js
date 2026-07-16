import { mount, shallowMount } from '@vue/test-utils';
import AbstractUserStatus from '@webitel/ui-sdk/src/enums/AbstractUserStatus/AbstractUserStatus.enum';
import { createStore } from 'vuex';

import ChatTransferDestination from '../../../../chat/enums/ChatTransferDestination.enum';
import TransferLookupItem from '../transfer-lookup-item.vue';

describe('TransferLookupItem', () => {
	const item = {};
	const type = ChatTransferDestination.USER;
	const store = createStore({
		getters: {
			'workspace/WORKSRACE_STATE': () => 'chat',
		},
	});

	it('renders a component', () => {
		const wrapper = shallowMount(TransferLookupItem, {
			props: {
				item,
				type,
			},
			global: {
				plugins: [
					store,
				],
			},
		});
		expect(wrapper.exists()).toBe(true);
	});

	it('emits input event at wt-icon-btn click', () => {
		const wrapper = mount(TransferLookupItem, {
			props: {
				item,
				type,
			},
			global: {
				plugins: [
					store,
				],
			},
		});
		wrapper
			.findComponent({
				name: 'wt-rounded-action',
			})
			.vm.$emit('click');
		expect(wrapper.emitted().input[0]).toEqual([
			item,
		]);
	});

	// status priority matrix is covered in statusUtils/__tests__/getUserStatusByPriority.spec.ts
	it('computes userStatus from item presence and agent status', () => {
		const wrapper = shallowMount(TransferLookupItem, {
			props: {
				item: {
					status: 'offline',
					presence: {
						status: 'sip',
					},
				},
				type,
				showStatus: true,
			},
			global: {
				plugins: [
					store,
				],
			},
		});
		expect(wrapper.vm.userStatus).toBe(AbstractUserStatus.OFFLINE);
	});

	it('reads presence from custom presenceStatusField', () => {
		const wrapper = shallowMount(TransferLookupItem, {
			props: {
				item: {
					userPresenceStatus: {
						status: 'dlg',
					},
				},
				type,
				showStatus: true,
				presenceStatusField: 'userPresenceStatus',
			},
			global: {
				plugins: [
					store,
				],
			},
		});
		expect(wrapper.vm.userStatus).toBe(AbstractUserStatus.BUSY);
	});

	it('does not compute userStatus when showStatus is false', () => {
		const wrapper = shallowMount(TransferLookupItem, {
			props: {
				item: {
					presence: {
						status: 'sip',
					},
				},
				type,
				showStatus: false,
			},
			global: {
				plugins: [
					store,
				],
			},
		});
		expect(wrapper.vm.userStatus).toBe(undefined);
	});
});
