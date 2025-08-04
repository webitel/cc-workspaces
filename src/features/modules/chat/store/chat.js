import eventBus from '@webitel/ui-sdk/src/scripts/eventBus.js';
import { ConversationState } from 'webitel-sdk';

import CatalogAPI from '../../../../app/api/agent-workspace/endpoints/catalog/CatalogAPIRepository.js';
import i18n from '../../../../app/locale/i18n';
import WorkspaceStates from '../../../../ui/enums/WorkspaceState.enum';
import ChatTransferDestination from '../../../../ui/modules/work-section/modules/chat/enums/ChatTransferDestination.enum';
import closed from '../modules/closed/store/closed.js';
import manual from '../modules/manual/store/manual';
import { formatChatMessages } from '../scripts/formatChatMessages.js';
import chatHistory from './chat-history.js';
import chatMedia from './chat-media.js';
import clientHandlers from './client-handlers';

const state = {
  chatList: [],
};

const getters = {
  CHAT_ON_WORKSPACE: (s, g, rS, rootGetters) =>
    rootGetters['workspace/IS_CHAT_WORKSPACE'] &&
    rootGetters['workspace/TASK_ON_WORKSPACE'],
  ALL_CHAT_MESSAGES: (state, getters, rootState) => {
    const currentChatMessages = getters.CHAT_ON_WORKSPACE.messages || []; // if chat object didn`t have messages
    return [
      ...rootState.features.chat.chatHistory.chatHistoryMessages,
      ...currentChatMessages,
    ]; // chat-history messages + current-chat messages
  },
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

  SET_CHAT_LIST: (context, chatList) => {
    context.commit('SET_CHAT_LIST', chatList);
  },

  ADD_CHAT: (context, chat) => {
    context.commit('ADD_CHAT', chat);
  },

  ACCEPT: async (context) => {
    try {
      await context.getters.CHAT_ON_WORKSPACE.join();
    } catch (err) {
      throw err;
    }
  },

  SEND: async (context, message) => {
    try {
      await context.getters.CHAT_ON_WORKSPACE.send(message);
    } catch (err) {
      throw err;
    }
  },

  SEND_FILE: async (context, files) => {
    try {
      Array.isArray(files)
        ? await Promise.all(files.map((file) => context.dispatch('SEND', file)))
        : await context.dispatch('SEND', files);
    } catch (err) {
      throw err;
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
    try {
      if (chatOnWorkspace.allowLeave) {
        await chatOnWorkspace.leave();
      } else {
        await chatOnWorkspace.decline();
      }

      await context.dispatch(
        'features/chatNotifications/HANDLE_CHAT_END',
        chatOnWorkspace,
        {
          root: true,
        },
      );
    } catch (err) {
      throw err;
    }
  },

  OPEN_CHAT: async (context, chat) => {
    const isChatClosed =
      context.rootGetters['features/chat/closed/ALL_CLOSED_CHATS'].includes(
        chat,
      );

    if (isChatClosed && !chat.contact?.id) {
      // because closed chats don't have messages
      const { items: messages } = await CatalogAPI.getChatMessagesList({
        chatId: chat.id,
      });
      // wtf? – https://webitel.atlassian.net/browse/WTEL-5515?focusedCommentId=641895
      chat.messages = formatChatMessages(messages);
    }

    await context.dispatch('SET_WORKSPACE', chat);
  },

  CHAT_INSERT_TO_START: (context, chat) => {
    const chatPosition = context.state.chatList.indexOf(chat);
    const chatList = context.state.chatList.slice();
    chatList.splice(chatPosition, 1);
    chatList.unshift(chat);
    context.commit('SET_CHAT_LIST', chatList);
  },

  SET_WORKSPACE: (context, chat) =>
    context.dispatch(
      'workspace/SET_WORKSPACE_STATE',
      {
        type: WorkspaceStates.CHAT,
        task: chat,
      },
      { root: true },
    ),
  RESET_WORKSPACE: (context) =>
    context.dispatch('workspace/RESET_WORKSPACE_STATE', null, { root: true }),
  _RESET_UNREAD_COUNT: (context) =>
    context.dispatch('features/notifications/_RESET_UNREAD_COUNT', null, {
      root: true,
    }),
};

const mutations = {
  SET_CHAT_LIST: (state, chatList) => {
    state.chatList = chatList;
  },
  ADD_CHAT: (state, chat) => {
    state.chatList.push(chat);
  },
  REMOVE_CHAT: (state, removedChat) => {
    state.chatList = state.chatList.filter((chat) => chat !== removedChat);
  },
  SET_MEDIA_VIEW: (state, mediaView) => {
    state.mediaView = mediaView;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
  modules: {
    manual,
    closed,
    chatHistory,
    chatMedia,
  },
};
