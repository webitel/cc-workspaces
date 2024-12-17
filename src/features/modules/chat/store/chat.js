import { ConversationState } from 'webitel-sdk';
import { formatChatMessages } from '../scripts/formatChatMessages.js';
import CatalogAPI from '../../../../app/api/agent-workspace/endpoints/catalog/CatalogAPIRepository.js';
import ChatTransferDestination from '../../../../ui/modules/work-section/modules/chat/enums/ChatTransferDestination.enum';
import WorkspaceStates from '../../../../ui/enums/WorkspaceState.enum';
import clientHandlers from './client-handlers';
import manual from '../modules/manual/store/manual';
import closed from '../modules/closed/store/closed.js';
import chatHistory from './chat-history.js';

const state = {
  chatList: [],
  mediaView: null,
};

const getters = {
  CHAT_ON_WORKSPACE: (s, g, rS, rootGetters) => (
    rootGetters['workspace/IS_CHAT_WORKSPACE'] && rootGetters['workspace/TASK_ON_WORKSPACE']
  ),
  ALL_CHAT_MESSAGES: (state, getters, rootState) => {
    const currentChatMessages = getters.CHAT_ON_WORKSPACE.messages || []; // if chat object didn`t have messages
    return [...rootState.features.chat.chatHistory.chatHistoryMessages,
      ...currentChatMessages]; // chat-history messages + current-chat messages
  },
  ALLOW_CHAT_TRANSFER: (state, getters) => getters.CHAT_ON_WORKSPACE.allowLeave && !getters.CHAT_ON_WORKSPACE.closedAt,
  ALLOW_CHAT_JOIN: (state, getters) => getters.CHAT_ON_WORKSPACE.allowJoin,
  ALLOW_CHAT_CLOSE: (state, getters) => getters.CHAT_ON_WORKSPACE.allowLeave || getters.CHAT_ON_WORKSPACE.allowDecline,
  ASK_CHAT_CLOSE: (state, getters) => getters.CHAT_ON_WORKSPACE.allowLeave && !getters.CHAT_ON_WORKSPACE.closedAt,
  IS_CHAT_ACTIVE: (state, getters) => getters.CHAT_ON_WORKSPACE.state === ConversationState.Active,
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
      // eslint-disable-next-line no-unused-expressions
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
    } catch (err) {
      throw err;
    }
  },

  OPEN_CHAT: async (context, chat) => {
    if (context.getters['closed/ALL_CLOSED_CHATS'].includes(chat) && !chat.contact) {

      if (!chat.messages) {
        const { items: messages } = await CatalogAPI.getChatMessagesList({ chatId: chat.id });

        // wtf? – https://webitel.atlassian.net/browse/WTEL-5515?focusedCommentId=641895
        chat.messages = formatChatMessages(messages);
      }

      await context.dispatch('SET_WORKSPACE', chat);
      return;
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

  SET_WORKSPACE: (context, chat) => {
    context.dispatch('workspace/SET_WORKSPACE_STATE', { type: WorkspaceStates.CHAT, task: chat }, { root: true });
  },

  RESET_WORKSPACE: (context) => {
    context.dispatch('workspace/RESET_WORKSPACE_STATE', null, { root: true });
  },

  OPEN_MEDIA: (context, message) => {
    context.commit('SET_MEDIA_VIEW', message);
  },

  CLOSE_MEDIA: (context) => {
    context.commit('SET_MEDIA_VIEW', null);
  },

  HANDLE_CHAT_EVENT: (context, { action, chat }) => {
    context.dispatch('features/notifications/HANDLE_CHAT_EVENT', { action, chat }, { root: true });
  },

  _RESET_UNREAD_COUNT: (context) => {
    context.dispatch('features/notifications/_RESET_UNREAD_COUNT', null, { root: true });
  },

  INITIALIZE_CHAT_PLAYERS: (context, { player, chat = context.getters.CHAT_ON_WORKSPACE }) => {
    // eslint-disable-next-line no-param-reassign
    chat.players = player ? [player] : [];
  },

  CLEAN_CHAT_PLAYERS: (context, { chat = context.getters.CHAT_ON_WORKSPACE } = {}) => {
    /*
    * Players cleanup is necessary in order to avoid memory leaks storing player instances + DOM elements
    * in memory when they are really destroyed
    * */
    // eslint-disable-next-line no-param-reassign
    delete chat.players;
  },

  ATTACH_PLAYER_TO_CHAT: (context, { player, chat = context.getters.CHAT_ON_WORKSPACE }) => {
    if (chat.players) {
      chat.players.push(player);
    } else {
      context.dispatch('INITIALIZE_CHAT_PLAYERS', { player, chat });
    }
    player.on('play', () => {
      context.dispatch('PAUSE_ALL_CHAT_PLAYERS_EXCEPT', { player });
    });
  },

  PAUSE_ALL_CHAT_PLAYERS_EXCEPT: (context, { player, chat = context.getters.CHAT_ON_WORKSPACE }) => {
    chat.players.forEach((chatPlayer) => {
      if (chatPlayer !== player) chatPlayer.pause();
    });
  },
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
  },
};
