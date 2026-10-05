import { shallowMount } from '@vue/test-utils';
import { createPinia } from 'pinia';
import { reactive } from 'vue';
import { createStore } from 'vuex';

import { ChatSendMessageErrors } from '../../enums/ChatSendMessageErrors.enum';
import ChatMessaging from '../chat-messaging.vue';

const { emitSpy } = vi.hoisted(() => ({
	emitSpy: vi.fn(),
}));

vi.mock('@webitel/ui-sdk/composables', () => ({
	useEventBus: () => ({
		$emit: emitSpy,
		$on: vi.fn(),
		$off: vi.fn(),
	}),
}));

vi.mock('@webitel/ui-sdk/components', () => ({
	WtChatEmoji: {
		name: 'wt-chat-emoji',
		template: '<div />',
	},
}));

/**
 * These tests target the sendMessage() error-handling logic in
 * chat-messaging.vue, which was updated to rename the caught error
 * variable from `error` to `err` (WTEL). The behavior of each branch
 * should remain unchanged; the tests both lock in current behavior and
 * guard against future regressions in the rename.
 */
describe('ChatMessaging: sendMessage', () => {
	let chatState;
	let sendAction;
	let store;

	beforeEach(() => {
		emitSpy.mockClear();

		chatState = reactive({
			draft: 'Hello world',
			variables: {},
		});

		sendAction = vi.fn().mockResolvedValue(undefined);

		store = createStore({
			modules: {
				features: {
					namespaced: true,
					modules: {
						chat: {
							namespaced: true,
							getters: {
								CHAT_ON_WORKSPACE: () => chatState,
								IS_CHAT_ACTIVE: () => true,
							},
							actions: {
								SEND: sendAction,
								SEND_FILE: vi.fn(),
								ACCEPT: vi.fn(),
							},
						},
					},
				},
			},
		});
	});

	const getWrapper = () =>
		shallowMount(ChatMessaging, {
			global: {
				plugins: [
					store,
					createPinia(),
				],
			},
		});

	it('clears the draft synchronously and dispatches SEND with the drafted text', async () => {
		const wrapper = getWrapper();
		const draftToSend = chatState.draft;

		const pending = wrapper.vm.sendMessage();
		// draft is cleared synchronously, before the dispatch resolves
		expect(chatState.draft).toBe('');

		await pending;

		expect(sendAction).toHaveBeenCalledWith(expect.anything(), draftToSend);
		expect(chatState.draft).toBe('');
		expect(emitSpy).not.toHaveBeenCalled();
	});

	it('shows a "sent but not delivered" notification and keeps the draft cleared for WebhookSiteClosedButMsgSent errors', async () => {
		sendAction.mockRejectedValueOnce({
			id: ChatSendMessageErrors.WebhookSiteClosedButMsgSent,
		});
		const wrapper = getWrapper();

		await wrapper.vm.sendMessage();

		expect(chatState.draft).toBe('');
		expect(emitSpy).toHaveBeenCalledTimes(1);
		expect(emitSpy).toHaveBeenCalledWith('notification', {
			type: 'error',
			text: 'Message sent but not delivered',
		});
	});

	it('silently ignores PortalNoDeviceConnection errors without notifying or restoring the draft', async () => {
		sendAction.mockRejectedValueOnce({
			id: ChatSendMessageErrors.PortalNoDeviceConnection,
		});
		const wrapper = getWrapper();

		await wrapper.vm.sendMessage();

		expect(chatState.draft).toBe('');
		expect(emitSpy).not.toHaveBeenCalled();
	});

	it('restores the draft and shows a general error notification for an unrecognized error id', async () => {
		sendAction.mockRejectedValueOnce({
			id: 'some.other.error',
		});
		const wrapper = getWrapper();
		const draftToSend = chatState.draft;

		await wrapper.vm.sendMessage();

		expect(chatState.draft).toBe(draftToSend);
		expect(emitSpy).toHaveBeenCalledTimes(1);
		expect(emitSpy).toHaveBeenCalledWith('notification', {
			type: 'error',
			text: 'An error occured. Please, try again.',
		});
	});

	it('restores the draft and shows a general error notification when the rejection has no id at all', async () => {
		sendAction.mockRejectedValueOnce(new Error('Network failure'));
		const wrapper = getWrapper();
		const draftToSend = chatState.draft;

		await wrapper.vm.sendMessage();

		expect(chatState.draft).toBe(draftToSend);
		expect(emitSpy).toHaveBeenCalledWith('notification', {
			type: 'error',
			text: 'An error occured. Please, try again.',
		});
	});

	it('restores the draft and shows a general error notification when the rejection value is nullish', async () => {
		sendAction.mockRejectedValueOnce(null);
		const wrapper = getWrapper();
		const draftToSend = chatState.draft;

		await wrapper.vm.sendMessage();

		expect(chatState.draft).toBe(draftToSend);
		expect(emitSpy).toHaveBeenCalledWith('notification', {
			type: 'error',
			text: 'An error occured. Please, try again.',
		});
	});
});
