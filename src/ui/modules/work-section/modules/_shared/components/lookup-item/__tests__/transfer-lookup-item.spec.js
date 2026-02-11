import { mount, shallowMount } from '@vue/test-utils';
import AbstractUserStatus from '@webitel/ui-sdk/src/enums/AbstractUserStatus/AbstractUserStatus.enum';

import ChatTransferDestination from '../../../../chat/enums/ChatTransferDestination.enum';
import TransferLookupItem from '../transfer-lookup-item.vue';
import UserLookupItem from '../user-lookup-item.vue';

const computed = {
	state() {
		return 'chat';
	},
};
describe('TransferLookupItem', () => {
	const item = {};
	const type = ChatTransferDestination.USER;

	it('renders a component', () => {
		const wrapper = shallowMount(TransferLookupItem, {
			props: {
				item,
				type,
			},
			computed,
		});
		expect(wrapper.exists()).toBe(true);
	});

	it('emits input event at wt-icon-btn click', () => {
		const wrapper = mount(TransferLookupItem, {
			props: {
				item,
				type,
			},
			computed,
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

	it('correctly comoputes user PAUSE status: pause', () => {
		item.status = 'pause';
		const wrapper = shallowMount(UserLookupItem, {
			props: {
				item,
			},
		});
		expect(wrapper.vm.userStatus).toBe(AbstractUserStatus.PAUSE);
	});

	it('correctly comoputes user ONLINE status: online', () => {
		item.status = 'online';
		const wrapper = shallowMount(UserLookupItem, {
			props: {
				item,
			},
		});
		expect(wrapper.vm.userStatus).toBe(AbstractUserStatus.ONLINE);
	});

	it('correctly comoputes user OFFLINE status: offline', () => {
		item.status = 'offline';
		const wrapper = shallowMount(UserLookupItem, {
			props: {
				item,
			},
		});
		expect(wrapper.vm.userStatus).toBe(AbstractUserStatus.OFFLINE);
	});

	it('correctly comoputes user BUSY status: dlg', () => {
		item.presence = {
			status: 'dlg',
		};
		const wrapper = shallowMount(UserLookupItem, {
			props: {
				item,
			},
		});
		expect(wrapper.vm.userStatus).toBe(AbstractUserStatus.BUSY);
	});

	it('correctly comoputes user DND status: dnd', () => {
		item.presence = {
			status: 'dnd',
		};
		const wrapper = shallowMount(UserLookupItem, {
			props: {
				item,
			},
		});
		expect(wrapper.vm.userStatus).toBe(AbstractUserStatus.DND);
	});
});
