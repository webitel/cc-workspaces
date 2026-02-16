import { mount, shallowMount } from '@vue/test-utils';
import { CallActions } from 'webitel-sdk';

import findRoundedActionByIcon from '../../../../../../../../tests/utils/findRoundedActionByIcon';
import CallHeader from '../call-header.vue';

let callOnWorkspace;

let callList;

const computed = {
	...CallHeader.computed,
	call: () => callOnWorkspace,
	callList: () => callList,
	isNewCall: () => callOnWorkspace._isNew,
	isOnNumpad: () => callOnWorkspace.currentTab,
};

describe('Make new call functionality', () => {
	const findCallBtn = findRoundedActionByIcon('call-ringing--filled');

	beforeEach(() => {
		callOnWorkspace = {
			_isNew: true,
			newNumber: '',
			historyId: '',
			currentTab: '',
		};

		callList = [];
	});

	it('Make new call on number', () => {
		callOnWorkspace.newNumber = '100';
		callOnWorkspace.historyId = '10';
		callOnWorkspace.currentTab = 'numpad';

		const mock = vi.fn();
		vi.spyOn(CallHeader.methods, 'makeCall').mockImplementationOnce(mock);

		const wrapper = mount(CallHeader, {
			computed,
		});

		// then find "call" button and trigger click
		const callBtn = findCallBtn(wrapper);
		callBtn.vm.$emit('click', {});

		expect(mock).toHaveBeenCalled();
	});
});

describe('Transfer functionality', () => {
	const findTransferBtn = findRoundedActionByIcon('call-transfer--filled');

	beforeEach(() => {
		callList = [];
		callOnWorkspace = {
			blindTransfer: vi.fn(),
		};
	});

	it('Opens transfer tab from call-header', () => {
		callOnWorkspace.allowHangup = true;

		const wrapper = mount(CallHeader, {
			computed,
		});
		const transferBtn = findTransferBtn(wrapper);
		transferBtn.vm.$emit('click');
		expect(wrapper.emitted().openTab[0]).toEqual([
			'transfer',
		]);
	});
});

describe('Bridge functionality', () => {
	const findBridgeBtn = findRoundedActionByIcon('call-add-to');

	const call1 = {
		id: 1,
		bridgeTo: vi.fn(),
		state: CallActions.Active,
	};
	const call2 = {
		id: 2,
		state: CallActions.Active,
	};

	beforeEach(() => {
		callList = [
			call1,
			call2,
		];
		callOnWorkspace = call1;
	});

	it('Doesnt show merge btn with only 1 active call', () => {
		callList = callList.slice(1);
		const wrapper = shallowMount(CallHeader, {
			computed,
		});
		const bridgeBtn = findBridgeBtn(wrapper);
		expect(bridgeBtn).toBeFalsy();
	});

	it('Shows merge btn with only 2 active call', () => {
		const wrapper = mount(CallHeader, {
			computed,
		});
		const bridgeBtn = findBridgeBtn(wrapper);
		expect(bridgeBtn.exists()).toBe(true);
	});

	it('Opens bridge tab from call-header', () => {
		const wrapper = mount(CallHeader, {
			computed,
		});
		const bridgeBtn = findBridgeBtn(wrapper);
		expect(bridgeBtn.exists()).toBe(true);
		bridgeBtn.vm.$emit('click');
		expect(wrapper.emitted().openTab[0]).toEqual([
			'bridge',
		]);
	});
});
