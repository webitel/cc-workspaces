import { mount, shallowMount } from '@vue/test-utils';
import { createStore } from 'vuex';

import ChatMessaging from '../chat-messaging.vue';

const chatOnWorkspace = {
	closedAt: 0,
};

const computed = {
	...ChatMessaging.computed,
	isChatActive: () => false,
	chat: () => chatOnWorkspace,
};

const store = createStore({});
describe('ChatMessagingContainer', () => {
	it('renders a component', () => {
		const wrapper = shallowMount(ChatMessaging, {
			global: {
				plugins: [
					store,
				],
			},
		});
		expect(wrapper.exists()).toBe(true);
	});

	it('calls store sendFile method at handleDrop method', () => {
		const sendFileMock = vi
			.spyOn(ChatMessaging.methods, 'sendFile')
			.mockImplementation(() => {});
		const wrapper = shallowMount(ChatMessaging, {
			global: {
				plugins: [
					store,
				],
			},
		});
		const files = [
			{
				name: 'jest',
			},
		];
		const event = {
			dataTransfer: {
				files,
			},
		};
		wrapper.vm.handleDrop(event);
		expect(sendFileMock).toHaveBeenCalledWith(files);
	});
});

describe('Chat Messaging Text Entry block: Active Chat', () => {
	it('renders active chat actions if isChatActive computed is truthy', () => {
		const wrapper = mount(ChatMessaging, {
			global: {
				plugins: [
					store,
				],
				stubs: {
					ChatEmoji: true,
				},
			},
			computed: {
				...computed,
				isChatActive: () => true,
			},
		});
		expect(wrapper.find('.chat-messaging-text-entry').exists()).toBe(true);
	});

	// TODO: FIX THIS TEST ON BAMBOO :/
	// it('calls send() store method at draft textarea input + enter', () => {
	//   const message = 'jest';
	//   const sendMock = jest.spyOn(ChatMessagingFooter.methods, 'send').mockImplementation(() => {});
	//   const wrapper = shallowMount(ChatMessagingFooter, {
	//     computed: {
	//       isChatActive() { return true; },
	//     },
	//   });
	//   const draftTextarea = wrapper.findComponent({ name: 'wt-textarea' }).vm;
	//   draftTextarea.$emit('input', message);
	//   draftTextarea.$emit('enter', message);
	//   expect(sendMock).toHaveBeenCalledWith(message);
	// });

	it('calls store sendFile method at textarea pasted attachment', () => {
		const sendFileMock = vi
			.spyOn(ChatMessaging.methods, 'sendFile')
			.mockImplementation(() => {});
		const file = {
			name: 'jest',
		};
		const event = {
			clipboardData: {
				items: [
					{
						getAsFile: () => file,
					},
				],
			},
			preventDefault() {},
		};
		const wrapper = shallowMount(ChatMessaging, {
			global: {
				plugins: [
					store,
				],
			},
			computed: {
				...computed,
				isChatActive: () => true,
			},
		});
		wrapper.vm.handleFilePaste(event);
		expect(sendFileMock).toHaveBeenCalledWith([
			file,
		]);
	});

	it('calls store sendFile method at input attachment', () => {
		const sendFileMock = vi
			.spyOn(ChatMessaging.methods, 'sendFile')
			.mockImplementation(() => {});
		const files = [
			{
				name: 'jest',
			},
		];
		const wrapper = shallowMount(ChatMessaging, {
			global: {
				plugins: [
					store,
				],
			},
			computed: {
				...computed,
				isChatActive: () => true,
			},
		});
		wrapper.vm.handleAttachments({
			target: {
				files,
			},
		});
		expect(sendFileMock).toHaveBeenCalledWith(files);
	});
});
