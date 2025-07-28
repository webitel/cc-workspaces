import { EngineSystemSettingName } from '@webitel/api-services/gen/models';
import ConfigurationAPI from '@webitel/ui-sdk/api/clients/configurations/configurations.js';
import eventBus from '@webitel/ui-sdk/scripts/eventBus.js';
import NotificationsStoreModule from '@webitel/ui-sdk/src/modules/Notifications/store/NotificationsStoreModule';
import { snakeToCamel } from '@webitel/ui-sdk/src/scripts/caseConverters';
import deepCopy from 'deep-copy';
import zipObject from 'lodash/zipObject.js';
import { CallActions } from 'webitel-sdk';

import i18n from '../../../../app/locale/i18n';

const getLastMessage = (chat) => chat.messages[chat.messages.length - 1];

const state = {
  isHangupSoundAllowed: false, // for prevent STOP_SOUND before we play hangup sound after call end
  settings: null, // settings for notifications
};

const getters = {
  GET_NOTIFICATION_SETTING: (state) => (key) => {
    return state.settings[key];
  },
  PUSH_NOTIFICATION_TIMEOUT: (state) => {
    const notificationDefaultTimeout = 30;

    return (
      state.settings[EngineSystemSettingName.PushNotificationTimeout] ||
      notificationDefaultTimeout
    );
  },
};

const actions = {
  // utils
  HANDLE_CHAT_EVENT: (context, { action, chat }) => {
    // split event by incoming chat and incoming message
    const isNewMessageSoundNotification =
      context.getters.GET_NOTIFICATION_SETTING(
        EngineSystemSettingName.NewMessageSoundNotification,
      );

    if (isNewMessageSoundNotification) {
      context.dispatch('PLAY_SOUND', { action });
      if (
        (!document.hasFocus() ||
          context.rootGetters['workspace/TASK_ON_WORKSPACE'].channelId !==
            chat.channelId) &&
        context.getters.IS_MAIN_TAB
      ) {
        const name =
          getLastMessage(chat)?.member?.name || chat.messages[0].member.name;
        const text = i18n.global.t(`notifications.${snakeToCamel(action)}`, {
          name,
        });
        context.dispatch('SEND_NOTIFICATION', { text });
      }
    }
    context.dispatch('INCREMENT_UNREAD_COUNT');
  },

  LOAD_NOTIFICATION_SETTINGS: async (context) => {
    const configurations = await ConfigurationAPI.getList({
      name: [
        EngineSystemSettingName.CallEndSoundNotification,
        EngineSystemSettingName.CallEndPushNotification,
        EngineSystemSettingName.ChatEndSoundNotification,
        EngineSystemSettingName.ChatEndPushNotification,
        EngineSystemSettingName.TaskEndSoundNotification,
        EngineSystemSettingName.TaskEndPushNotification,
        EngineSystemSettingName.PushNotificationTimeout,
        EngineSystemSettingName.NewMessageSoundNotification,
        EngineSystemSettingName.NewChatSoundNotification,
      ],
    });

    if (!configurations?.items.length) return;

    const keys = configurations?.items.map((config) => config.name);
    const value = configurations?.items.map((config) => config.value);

    context.commit('SET', {
      path: 'settings',
      value: deepCopy(zipObject(keys, value)), // create object from arrays by keys and values from configurations
    });
  },

  HANDLE_JOB_DISTRIBUTE: (context, { action, job }) => {
    context.dispatch('PLAY_SOUND', { action });
    if (!document.hasFocus() && context.getters.IS_MAIN_TAB) {
      const name = job.displayName;
      const text = i18n.global.t(`notifications.${snakeToCamel(action)}`, {
        name,
      });
      context.dispatch('SEND_NOTIFICATION', { text });
    }
    context.dispatch('INCREMENT_UNREAD_COUNT');
  },

  HANDLE_CALL_START: async (context) => {
    await context.dispatch('STOP_SOUND'); // ringing
    localStorage.setItem('wtIsPlaying', 'true');
    context.commit('SET_CURRENTLY_PLAYING', true);
  },

  HANDLE_CALL_END: async (context, call) => {
    const isCallEndPushNotification = context.getters.GET_NOTIFICATION_SETTING(
      EngineSystemSettingName.CallEndPushNotification,
    );
    const isCallEndSoundNotification = context.getters.GET_NOTIFICATION_SETTING(
      EngineSystemSettingName.CallEndSoundNotification,
    );

    const isCallEndSound = localStorage.getItem('settings/callEndSound');

    await context.dispatch('STOP_SOUND'); // ringing
    localStorage.removeItem('wtIsPlaying');
    context.commit('SET_CURRENTLY_PLAYING', null);

    const text = i18n.global.t('notification.callEnded', {
      name: call.displayName,
      interval: context.getters.PUSH_NOTIFICATION_TIMEOUT * 1000,
    });

    if (isCallEndPushNotification || isCallEndSound) {
      context.dispatch('SEND_NOTIFICATION', { text });
      eventBus.$emit('notification', {
        type: 'error',
        text,
        timeout: context.getters.PUSH_NOTIFICATION_TIMEOUT,
      });
    }

    if (isCallEndSoundNotification) {
      // TODO implement sound notification
    }

    context.commit('SET_HANGUP_SOUND_ALLOW', true);
    await context.dispatch('PLAY_SOUND', { action: call.state });

    // if (
    //   call.state === CallActions.Hangup &&
    //   isCallEndSound && // is sound allowed in settings
    //   call.answeredAt // is call was answered
    // ) {
    // }
  },

  HANDLE_CHAT_END: async (context, chat) => {
    const isChatEndPushNotification = context.getters.GET_NOTIFICATION_SETTING(
      EngineSystemSettingName.ChatEndPushNotification,
    );
    const isChatEndSoundNotification = context.getters.GET_NOTIFICATION_SETTING(
      EngineSystemSettingName.ChatEndSoundNotification,
    );

    const displayChatName = () => {
      if (chat?.members?.length) {
        return chat?.members?.map((member) => member.name).join(', ');
      }

      if (chat?.title) {
        return chat.title;
      }

      return 'unknown';
    };

    context.commit('SET_CURRENTLY_PLAYING', null);

    const text = i18n.global.t('notification.chatEnded', {
      name: displayChatName(),
      interval: context.getters.PUSH_NOTIFICATION_TIMEOUT * 1000,
    });

    if (isChatEndPushNotification) {
      context.dispatch('SEND_NOTIFICATION', { text });
      eventBus.$emit('notification', {
        type: 'error',
        text,
        timeout: context.getters.PUSH_NOTIFICATION_TIMEOUT,
      });
    }

    context.commit('SET_HANGUP_SOUND_ALLOW', true);
    await context.dispatch('PLAY_SOUND', { action: chat.state });
  },

  HANDLE_JOB_END: async (context, job) => {
    const isJobEndPushNotification = context.getters.GET_NOTIFICATION_SETTING(
      EngineSystemSettingName.TaskEndPushNotification,
    );
    const isJobEndSoundNotification = context.getters.GET_NOTIFICATION_SETTING(
      EngineSystemSettingName.TaskEndSoundNotification,
    );

    context.commit('SET_CURRENTLY_PLAYING', null);

    const text = i18n.global.t('notification.jobEnded', {
      name: job.displayName,
      interval: context.getters.PUSH_NOTIFICATION_TIMEOUT * 1000,
    });

    if (isJobEndPushNotification) {
      context.dispatch('SEND_NOTIFICATION', { text });
      eventBus.$emit('notification', {
        type: 'error',
        text,
        timeout: context.getters.PUSH_NOTIFICATION_TIMEOUT,
      });
    }

    context.commit('SET_HANGUP_SOUND_ALLOW', true);
    await context.dispatch('PLAY_SOUND', { action: job.state });
  },

  // is called on ringing event on call store to send notification
  HANDLE_INBOUND_CALL_RINGING: async (
    context,
    { displayName, displayNumber, answer, hangup },
  ) => {
    await context.dispatch(
      'features/swController/SUBSCRIBE_TO_MESSAGE',
      {
        type: 'notificationclick',
        handler: (action) => {
          switch (action) {
            case 'accept':
              answer();
              break;
            case 'decline':
              hangup();
              break;
            default:
              break;
          }
        },
        once: true, // subscribe for each notification separately, once
      },
      { root: true },
    );

    // https://webitel.atlassian.net/browse/WTEL-4240
    return context.dispatch(
      'features/swController/SEND_NOTIFICATION',
      {
        title: i18n.global.t('notifications.newCall'),
        body: `${displayName}: ${displayNumber}`,
        actions: [
          { action: 'accept', title: 'Accept' },
          { action: 'decline', title: 'Decline' },
        ],
      },
      { root: true },
    );
  },

  // is called from mixin watcher on any ringing to play sound
  HANDLE_ANY_CALL_RINGING: async (context) => {
    const ringtoneName = localStorage.getItem('settings/ringtone');
    const customRingtone = ringtoneName
      ? `${import.meta.env.VITE_RINGTONES_URL}/${ringtoneName}`
      : undefined;

    const ringtoneVolume =
      parseFloat(localStorage.getItem('settings/ringtone-volume')) || 1.0;

    const playSound = () =>
      context.dispatch('PLAY_SOUND', {
        action: CallActions.Ringing,
        sound: customRingtone,
        volume: ringtoneVolume,
      });

    // sometimes we need to wait when call end sound is finished before playing ringtone
    // https://webitel.atlassian.net/browse/WTEL-4918
    context.state.currentlyPlaying ? setTimeout(playSound, 1000) : playSound();
  },

  HANDLE_HANGUP_SOUND_ALLOW: (context, payload) => {
    context.commit('SET_HANGUP_SOUND_ALLOW', payload);
  },
};

const mutations = {
  SET_HANGUP_SOUND_ALLOW: (state, value) => {
    state.isHangupSoundAllowed = value;
  },
};

const notifications = new NotificationsStoreModule().getModule({
  state,
  actions,
  getters,
  mutations,
});

export default notifications;
