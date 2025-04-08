const state = {
  mediaView: null,
};

const getters = {
  CHAT_ON_WORKSPACE: (state, getters, rootState, rootGetters) => rootGetters['features/chat/CHAT_ON_WORKSPACE'],
}

const actions = {
  OPEN_MEDIA: (context, message) => {
    context.commit('SET_MEDIA_VIEW', message);
  },

  CLOSE_MEDIA: (context) => {
    context.commit('SET_MEDIA_VIEW', null);
  },

  INITIALIZE_CHAT_PLAYERS: (context, { player, chat = context.getters.CHAT_ON_WORKSPACE }) => {
     
    chat.players = player ? [player] : [];
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

  CLEAN_CHAT_PLAYERS: (context, { chat = context.getters.CHAT_ON_WORKSPACE } = {}) => {
    /*
    * Players cleanup is necessary in order to avoid memory leaks storing player instances + DOM elements
    * in memory when they are really destroyed
    * */
     
    delete chat.players;
  },

  PAUSE_ALL_CHAT_PLAYERS_EXCEPT: (context, { player, chat = context.getters.CHAT_ON_WORKSPACE }) => {
    chat.players.forEach((chatPlayer) => {
      if (chatPlayer.id !== player.id) chatPlayer.pause();
    });
  },
};

const mutations = {
  SET_MEDIA_VIEW: (state, mediaView) => {
    state.mediaView = mediaView;
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
