import AgentChatsAPI from '../../../../../../app/api/agent-workspace/endpoints/agent-info/agent-chats.js';
import WorkspaceStates from '../../../../../../ui/enums/WorkspaceState.enum.js';
import applyTransform, { notify } from '@webitel/ui-sdk/src/api/transformers/index.js';
import i18n from '../../../../../../app/locale/i18n.js';

const { t } = i18n.global;

const state = {
  closedChatsList: [],
};

const getters = {
  UNPROCESSED_CLOSED_CHATS: (state) => ( // closed chats are left in active chats tab unprocessed
    state.closedChatsList.filter((chat) => chat?.unprocessedClose)
  ),
  CLOSED_CHATS: (state) => ( // closed chats for closed chats tab
    state.closedChatsList.filter((chat) => !chat?.unprocessedClose)
  ),
};

const actions = {
  LOAD_CLOSED_CHATS: async (context) => {
    try {
      const items = await AgentChatsAPI.getList({ onlyClosed: true });
      context.commit('SET_CLOSED_CHATS_LIST', items || []);

    } catch (err) {
      throw applyTransform(err, [
        notify(({ callback }) => callback({
          type: 'error',
          text: t('notifications.closedChatError'),
        })),
      ]);
    }
  },
  SET_WORKSPACE: (context, chat) => context.dispatch('workspace/SET_WORKSPACE_STATE', { type: WorkspaceStates.CHAT, task: chat }, { root: true }),
};

const mutations = {
  SET_CLOSED_CHATS_LIST: (state, chats) => {
    state.closedChatsList = chats;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
