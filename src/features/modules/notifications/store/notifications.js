import { EngineSystemSettingName } from '@webitel/api-services/gen/models';
import ConfigurationAPI from '@webitel/ui-sdk/api/clients/configurations/configurations.js';
import NotificationsStoreModule from '@webitel/ui-sdk/src/modules/Notifications/store/NotificationsStoreModule';
import deepCopy from 'deep-copy';
import zipObject from 'lodash/zipObject.js';

const state = {
  isHangupSoundAllowed: false, // for prevent STOP_SOUND before we play hangup sound after call end
  settings: null, // settings for notifications
};

const getters = {
  GET_NOTIFICATION_SETTING: (state) => (key) => {
    return state.settings ? state?.settings[key] : null;
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
