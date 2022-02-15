import { CallActions, ChatActions } from "webitel-sdk";
import endChatSound from "../../../../public/media/end-chat.wav";
import newChatSound from "../../../../public/media/new-chat.wav";
import newMessageSound from "../../../../public/media/new-message.wav";
import ringingSound from "../../../../public/media/ringing.mp3";

const getNotificationSound = action => {
  switch (action) {
    case CallActions.Ringing:
      return (new Audio(ringingSound).loop = true);
    case ChatActions.UserInvite:
      return new Audio(newChatSound);
    case ChatActions.Message:
      return new Audio(newMessageSound);
    case ChatActions.Close:
      return new Audio(endChatSound);
    default:
      return false;
  }
};

const state = {
  isPlayingSound: false,
  broadcastChannel: null,
};

const getters = {};

const actions = {
  INIT_BROADCAST_CHANNEL: context => {
    const broadcastChannel = new BroadcastChannel("broadcastChannel");

    broadcastChannel.onmessage = async ({ data }) => {

      if (data.isPlaying && !context.state.isPlayingSound) {
        context.commit("PLAY_SOUND", true);
      }

      if (!data.isPlaying) {
        const sound = getNotificationSound(data.action);
        console.log(sound);
        context.dispatch("PLAY_SOUND", sound);
      }
    };
    context.commit("INIT_BROADCAST_CHANNEL", broadcastChannel);
  },

  TEST_NOTIFY: (context, { action, id, messageId }) => {

    const messageObj = { action, id, messageId, isPlaying: true };
    context.state.broadcastChannel.postMessage(messageObj);
  },

  PLAY_SOUND: (context, sound) => {
    try {
      sound.addEventListener("ended", () => context.dispatch("STOP_PLAYING", sound));
      context.state.broadcastChannel.postMessage({ isPlaying: true });
      sound.play();
    } catch (err) {
      throw err;
    }
    context.commit("PLAY_SOUND", sound);
  },

  STOP_PLAYING: (context, sound = context.state.isPlayingSound) => {
    sound.pause();
    context.commit("STOP_PLAYING", sound);
    context.state.broadcastChannel.postMessage({ isPlaying: false });
  }
};

const mutations = {

  INIT_BROADCAST_CHANNEL: (state, broadcastChannel) => {
    state.broadcastChannel = broadcastChannel;
  },

  PLAY_SOUND: (state, sound) => {
    state.isPlayingSound = sound;
  },

  STOP_PLAYING: state => {
    state.isPlayingSound = false;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
