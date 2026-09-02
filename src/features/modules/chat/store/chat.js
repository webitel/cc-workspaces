import { applyTransform, notify } from '@webitel/api-services/api/transformers';
import { ConversationState } from 'webitel-sdk';

import i18n from '../../../../app/locale/i18n';
import WorkspaceStates from '../../../../ui/enums/WorkspaceState.enum';
import ChatTransferDestination from '../../../../ui/modules/work-section/modules/chat/enums/ChatTransferDestination.enum';
import active from '../modules/active/store/active';
import closed from '../modules/closed/store/closed';
import manual from '../modules/manual/store/manual';
import postProcessing from '../modules/post-processing/store/post-processing';
import chatHistory from './chat-history';
import chatMedia from './chat-media';
import clientHandlers from './client-handlers';
import unseen from './unseen';

const { t } = i18n.global;

// stable per-chat key: `.id` is `channelId || inviteId || conversationId` and
// changes during a chat's lifetime, `conversationId` doesn't
const pendingFileKey = (chat) => chat?.conversationId || chat?.id;

const getters = {
	CHAT_ON_WORKSPACE: (s, g, rS, rootGetters) =>
		rootGetters['workspace/IS_CHAT_WORKSPACE'] &&
		rootGetters['workspace/TASK_ON_WORKSPACE'],
	FAILED_FILES: (state, getters) =>
		state.failedFiles[pendingFileKey(getters.CHAT_ON_WORKSPACE)] || [],
	ALLOW_CHAT_TRANSFER: (state, getters) =>
		getters.CHAT_ON_WORKSPACE.allowLeave && !getters.CHAT_ON_WORKSPACE.closedAt,
	ALLOW_CHAT_JOIN: (state, getters) => getters.CHAT_ON_WORKSPACE.allowJoin,
	ALLOW_CHAT_CLOSE: (state, getters) =>
		getters.CHAT_ON_WORKSPACE.allowLeave ||
		getters.CHAT_ON_WORKSPACE.allowDecline,
	ASK_CHAT_CLOSE: (state, getters) =>
		getters.CHAT_ON_WORKSPACE.allowLeave && !getters.CHAT_ON_WORKSPACE.closedAt,
	IS_CHAT_ACTIVE: (state, getters) =>
		getters.CHAT_ON_WORKSPACE.state === ConversationState.Active,
	IS_MY_MESSAGE: () => (message) => message.member?.self,
};

const actions = {
	...clientHandlers.actions,

	ACCEPT: async (context) => {
		await context.getters.CHAT_ON_WORKSPACE.join();
	},

	SEND: async (context, message) => {
		const isText = typeof message === 'string';
		const preparedMessage = isText ? message.trim() : message;
		if (isText && !preparedMessage.length) return;
		await context.getters.CHAT_ON_WORKSPACE.send(preparedMessage);
	},

	SEND_FILE: async (context, files) => {
		const list = Array.isArray(files)
			? files
			: [
					files,
				];
		await Promise.all(
			list.map((file) => context.dispatch('SEND_SINGLE_FILE', file)),
		);
	},

	SEND_SINGLE_FILE: async (context, file) => {
		try {
			await context.dispatch('SEND', file);
		} catch (err) {
			/**
			 * @author @OleksandrPalonnyi
			 *
			 * [WTEL-6706](https://webitel.atlassian.net/browse/WTEL-6706)
			 *
			 * description link - https://webitel.atlassian.net/browse/WTEL-6706?focusedCommentId=777623
			 * */
			const detail = err.detail || err.response?.data?.detail;
			if (detail?.includes('PHOTO_INVALID_DIMENSIONS')) {
				const chatMessages = context.getters.CHAT_ON_WORKSPACE.messages;
				const lastMessageCreatedAt =
					chatMessages[chatMessages.length - 1]?.createdAt || 0;
				context.commit('ADD_FAILED_FILE', {
					key: pendingFileKey(context.getters.CHAT_ON_WORKSPACE),
					id: crypto.randomUUID(),
					file,
					createdAt: Math.max(Date.now(), lastMessageCreatedAt + 1),
					channelId: context.getters.CHAT_ON_WORKSPACE.channelId,
				});
				return;
			}

			const errorMessage =
				err.response?.data?.id === 'file.malware'
					? t('workspaceSec.chat.chatsFileBlocked')
					: t('workspaceSec.chat.errors.uploadFileLimitSize');
			throw applyTransform(err, [
				notify(({ callback }) =>
					callback({
						type: 'error',
						text: errorMessage,
					}),
				),
			]);
		}
	},

	TRANSFER: async (
		context,
		{ chat = context.getters.CHAT_ON_WORKSPACE, destination, item },
	) => {
		if (destination === ChatTransferDestination.USER) {
			return chat.transferToUser(item.id);
		}
		if (destination === ChatTransferDestination.CHATPLAN) {
			return chat.transferToPlan(item.id);
		}
		throw new TypeError('Unknown transfer destination: ', destination);
	},

	CLOSE: async (context) => {
		const chatOnWorkspace = context.getters.CHAT_ON_WORKSPACE;
		if (chatOnWorkspace.allowLeave) {
			await chatOnWorkspace.leave();
		} else {
			await chatOnWorkspace.decline();
		}

		context.commit('CLEAR_FAILED_FILES', pendingFileKey(chatOnWorkspace));

		await context.dispatch(
			'features/chatNotifications/HANDLE_CHAT_END',
			chatOnWorkspace,
			{
				root: true,
			},
		);
	},

	OPEN_CHAT: async (context, chat) => {
		const isUnidentifiedClosedChat = !chat.contact?.id && chat.closedAt;

		if (isUnidentifiedClosedChat) {
			await context.dispatch('features/chat/closed/LOAD_CLOSED_CHAT', chat, {
				root: true,
			});
		} else {
			await context.dispatch('SET_WORKSPACE', chat);
		}
	},

	SET_WORKSPACE: (context, chat) =>
		context.dispatch(
			'workspace/SET_WORKSPACE_STATE',
			{
				type: WorkspaceStates.CHAT,
				task: chat,
			},
			{
				root: true,
			},
		),
	RESET_WORKSPACE: (context) =>
		context.dispatch('workspace/RESET_WORKSPACE_STATE', null, {
			root: true,
		}),
	_RESET_UNREAD_COUNT: (context) =>
		context.dispatch('features/notifications/_RESET_UNREAD_COUNT', null, {
			root: true,
		}),
};

const mutations = {
	SET_MEDIA_VIEW: (state, mediaView) => {
		state.mediaView = mediaView;
	},
	ADD_FAILED_FILE: (state, { key, id, file, createdAt, channelId }) => {
		if (!state.failedFiles[key]) state.failedFiles[key] = [];
		state.failedFiles[key].push({
			id,
			photoInvalidDimensions: true,
			file,
			member: {
				self: true,
			},
			channelId,
			createdAt,
		});
	},
	CLEAR_FAILED_FILES: (state, key) => {
		delete state.failedFiles[key];
	},
};

export default {
	namespaced: true,
	state: () => ({
		failedFiles: {},
	}),
	getters,
	actions,
	mutations,
	modules: {
		active,
		manual,
		closed,
		postProcessing,
		chatHistory,
		chatMedia,
		unseen,
	},
};
