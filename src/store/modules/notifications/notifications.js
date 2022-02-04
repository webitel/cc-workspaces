import { snakeToCamel } from '@webitel/ui-sdk/src/scripts/caseConverters';
import { CallActions, ChatActions } from 'webitel-sdk';
import endChatSound from '../../../../public/media/end-chat.wav';
import newChatSound from '../../../../public/media/new-chat.wav';
import newMessageSound from '../../../../public/media/new-message.wav';
import ringingSound from '../../../../public/media/ringing.mp3';
import notificationIcon from '../../../../public/notification-icon.png';
import i18n from '../../../locale/i18n';
import isIncomingRinging from '../call/scripts/isIncomingRinging';

const NOTIFICATION_VISIBLE_INTERVAL = 2000;

// const broadcastMessage = {
//   count: 0,
//   isPlaying: null,
//   action: null,
//   isPlayedTimes: 0,
// };

const toPlayIncludesMessage = (context, message) => context.state.toPlay.some(
    (info) => info.id === message.id
      && info.action === message.action
      && info.messageId === message.messageId,
  );

const isCurrentlyRinging = (context) => context.rootState.call.callList.length
  && context.rootState.call.callList.every((call) => isIncomingRinging(call));

const getNotificationSound = (action) => {
  switch (action) {
    case CallActions.Ringing:
      // eslint-disable-next-line no-return-assign
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
  // isPlayingMessage: {},
  isPlayingSound: false,
  unreadCount: 0,
  broadcastChannel: null,
  toPlay: [],
  played: [],
};

const getters = {};

const actions = {
  INIT_BROADCAST_CHANNEL: (context) => {
    const broadcastChannel = new BroadcastChannel('broadcastChannel');

    broadcastChannel.onmessage = async ({ data }) => {
      
      // console.log('data: ', data);
      // console.log(context);

      console.log(data);

      if (data.isPlaying) {
        context.commit('PLAY_SOUND', true)
      }

      if (!data.isPlaying) {
        const sound = getNotificationSound(data.action);
        console.log(sound);
        context.dispatch('PLAY_SOUND', sound);
      }

      // const isMessageIncluded = toPlayIncludesMessage(context, msg.data);

      // if (!isMessageIncluded) {
      //   context.commit('ADD_TO_PLAY', msg.data);
      // }

      // if (!data.isPlaying) {
      //   // context.commit('STOP_PLAYING', context.state.isPlayingSound);
      //   const sound = getNotificationSound(data.action);
      //   context.commit('PLAY_SOUND', sound);
      // }

      // if (data.isPlaying) {
      //   // context.commit('ADD_PLAYED', msg.data);
      //   context.commit('PLAY_SOUND', true);
      //   // context.commit('DELETE_CURRENT_MESSAGE', msg.data);
      // }

      // console.log('context.state.toPlay', context.state.toPlay);

      // console.log('BRODCAST MESSAGE RECEIVED START');
      // if (msg.data === context.state.lastPlayed) return;
      // console.log('BRODCAST MESSAGE RECEIVED IS UNIQ, START NOTIFICATION');
      // context.dispatch('NOTIFICATION_CHECK', msg)
      //
      // await context.dispatch('SET_LAST_PLAYED', msg.data);
    };
    context.commit('INIT_BROADCAST_CHANNEL', broadcastChannel);
  },

  TEST_NOTIFY: (context, { action, id, messageId }) => {
    
    const messageObj = { action, id, messageId, isPlaying: false };
    context.state.broadcastChannel.postMessage(messageObj);

    // if (context.state.toPlay.length >= 10) {
    //   context.commit('CLEAR_OLD_MESSAGES', context.state.toPlay);
    // }

    // if (!toPlayIncludesMessage(context, messageObj)) {
    //   context.commit('ADD_TO_PLAY', messageObj);
    // }

    // if (!context.state.isPlayingSound) {
    //   const currentPlaying = context.state.toPlay.pop();
    //   const sound = getNotificationSound(currentPlaying.action);
    //   context.state.broadcastChannel.postMessage({ ...currentPlaying, isPlaying: true });
    //   context.dispatch('PLAY_SOUND', sound);
    // }
  },

  PLAY_SOUND: (context, sound) => {
    try {
      sound.addEventListener('ended', () => context.dispatch('STOP_PLAYING', sound));
      context.state.broadcastChannel.postMessage({ isPlaying: true });
      sound.play();
    } catch (err) {
      throw err;
    }
    context.commit('PLAY_SOUND', sound);
  },

  STOP_PLAYING: (context, sound = context.state.isPlayingSound) => {
    sound.pause();
    context.commit('STOP_PLAYING', sound);
    // context.state.broadcastChannel.postMessage({ isPlaying: false });
  },
};

const mutations = {
  ADD_TO_PLAY: (state, toPlay) => state.toPlay.push(toPlay),

  // ADD_PLAYED: (state, played) => state.played.push(played),

  INIT_BROADCAST_CHANNEL: (state, broadcastChannel) => {
    state.broadcastChannel = broadcastChannel;
  },

  PLAY_SOUND: (state, sound) => {
    state.isPlayingSound = sound;
  },

  STOP_PLAYING: (state) => {
    state.isPlayingSound = false;
  },

  CLEAR_OLD_MESSAGES: (state, object) => object.shift(),

  DELETE_CURRENT_MESSAGE: (state, object) => {
    const sameObj = state.toPlay.filter(
      (obj) => obj.action === object.action && obj.id === object.id && obj.messageId === object.messageId,
    );
    console.log('the same object', sameObj);
    state.toPlay = state.toPlay.filter((obj) => obj !== sameObj);
  },
};
// NOTIFICATION_CHECK: (context, params) => {
//   console.log('PARAMS', params);
//   const channel = params.chat ?? params.call;
//   const channelId = channel.id;
//   const messageId = params.message?.id;

//   const broadcastMessage = {
//     action: params.action,
//     channelId,
//     messageId,
//   };
//   context.dispatch('SET_TO_PLAY', broadcastMessage);
//   context.state.broadcastChannel.postMessage(broadcastMessage);

//   context.dispatch('NOTIFY', params.action);
//   // context.dispatch('NOTIFY')
// },

// NOTIFY: (context, action) => {
//   const sound = getNotificationSound(action);
//   const isRinging = isCurrentlyRinging(context);
//   sound.addEventListener('ended', () => {
//     context.dispatch('PAUSE_SOUND', sound);
//   });
//   if (isRinging) {
//     sound.loop = true;
//     return context.dispatch('PLAY_SOUND', sound);
//   }

//   // It is possible to have the outbound call with action Ringing, so we need the following check
//   if (action !== CallActions.Ringing) {
//     context.dispatch('SHOW_NOTIFICATION', action);
//     return context.dispatch('PLAY_SOUND', sound);
//   }
// },

// PLAY_SOUND: async (context, sound) => {
//   // if (!context.state.isPlaying) {
//   try {
//     context.commit('PLAY_SOUND', sound);
//     // context.dispatch('INCREASE_PLAYED_TIMES');
//     // context.state.broadcastChannel.postMessage({ played: true });
//     // await sound.load();
//     await sound.play();
//   } catch (err) {
//     throw err;
//   }
//   // }
// },

// PAUSE_SOUND: (context, sound = context.state.isPlaying) => {
//   if (sound) {
//     sound.pause();
//     // eslint-disable-next-line no-param-reassign
//     sound.currentTime = 0;
//   }
//   context.commit('PAUSE_SOUND');
// },

// SHOW_NOTIFICATION: async (context, action) => {
//   if (action === CallActions.Ringing) return;

//   const notificationText = i18n.t(`notifications.${snakeToCamel(action)}`);
//   context.dispatch('INCREMENT_UNREAD_COUNT');
//   const notification = new Notification(notificationText, {
//     icon: notificationIcon,
//   });

//   document.documentElement.addEventListener('click', () => {
//     context.dispatch('RESET_UNREAD_COUNT');
//     if (Notification.permission !== 'granted') Notification.requestPermission();
//   });

//   setTimeout(() => {
//     notification.close();
//   }, NOTIFICATION_VISIBLE_INTERVAL);
// },

// INCREMENT_UNREAD_COUNT: (context) => {
//   const count = context.state.unreadCount + 1;
//   context.state.broadcastChannel.postMessage({ count });
//   context.dispatch('SET_UNREAD_COUNT', count);
// },

// RESET_UNREAD_COUNT: (context) => {
//   // context.state.broadcastChannel.postMessage({ count: 0, isPlayed: false });
//   context.dispatch('SET_UNREAD_COUNT', 0);
// },

// SET_UNREAD_COUNT: (context, count) => {
//   context.commit('SET_UNREAD_COUNT', count);
//   context.dispatch('SET_TAB_TITLE');
// },

// SET_TAB_TITLE: (context) => {
//   const count = context.state.unreadCount;
//   const titleText = document.title.replace(/\s*\(.*?\)\s*/g, '');
//   document.title = count ? `(${count}) ${titleText}` : titleText;
// },

// INCREASE_PLAYED_TIMES: (context) => {
//   const count = context.state.isPlayedTimes + 1;
//   context.commit('SET_PLAYED_TIMES', count);
// },

// RESET_PLAYED_TIMES: (context) => {
//   context.commit('SET_PLAYED_TIMES', 0);
// },

// SET_LAST_PLAYED: (context, lastPlayed) => {
//   context.commit('SET_LAST_PLAYED', lastPlayed);
// },

// SET_TO_PLAY: (context, toPlay) => {
//   context.commit('SET_TO_PLAY', toPlay);
// },

// SET_PLAYED: (context, played) => {
//   context.commit('SET_PLAYED', played);
// },
// };

// const mutations = {
//   PLAY_SOUND: (state, sound) => {
//     state.isPlaying = sound;
//   },

//   PAUSE_SOUND: (state) => {
//     state.isPlaying = false;
//   },

//   SET_UNREAD_COUNT: (state, count) => {
//     state.unreadCount = count;
//   },

// INIT_BROADCAST_CHANNEL: (state, broadcastChannel) => {
//   state.broadcastChannel = broadcastChannel;
// },

//   SET_PLAYED_TIMES: (state, count) => {
//     state.isPlayedTimes = count;
//   },

//   SET_TO_PLAY: (state, toPlay) => {
//     state.toPlay.push(toPlay);
//     if (state.toPlay.length > 10) {
//       state.toPlay.shift();
//     }
//   },

//   SET_PLAYED: (state, played) => {
//     state.played.push(played);
//     if (state.played.length > 10) {
//       state.played.shift();
//     }
//   },
// };

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
