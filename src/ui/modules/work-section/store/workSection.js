import chatHistory
  from '../modules/chat/modules/chat-messaging/chat-history/store/chat-history.js';
import chatMedia from '../modules/chat/store/chat-media.js';

export default {
  namespaced: true,
  modules: {
    chatMedia,
    chatHistory,
  },
};
