import ChatCloseReason from '../enums/ChatCloseReason.enum';
import AgentChatsAPI from '../../../../../../app/api/agent-workspace/endpoints/agent-info/agent-chats.js'

const state = {
  closedChatsList: [],
};

const getters = {
  CHATS_FOR_MANUAL_CLOSING: (state) => ( // closed chats are left in active chats tab
    state.closedChatsList.filter((chat) =>
        chat.closeReason !== ChatCloseReason.AGENT_LEAVE
        && chat.closeReason !== ChatCloseReason.TRANSFER,
      )
  ),
  IMMEDIATELY_CLOSED_CHATS: (state) => ( // closed chats for closed chats tab
    state.closedChatsList.filter((chat) =>
        chat.closeReason === ChatCloseReason.TRANSFER
        || chat.closeReason === ChatCloseReason.AGENT_LEAVE,
      )
  ),
};

const actions = {
  LOAD_CLOSED_CHATS: async (context) => {
    const items = await AgentChatsAPI.getList({ onlyClosed: true });
    context.commit('SET_CLOSED_CHATS_LIST', items);
  },
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
