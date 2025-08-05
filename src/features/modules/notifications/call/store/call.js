import { EngineSystemSettingName } from '@webitel/api-services/gen/models';
import eventBus from '@webitel/ui-sdk/scripts/eventBus.js';
import { createBaseStoreModule } from '@webitel/ui-sdk/store/new/index.js';
import { CallActions } from 'webitel-sdk';

import i18n from '../../../../../app/locale/i18n.js';

const actions = {
  HANDLE_CALL_START: async (context) => {
    await context.dispatch('features/notifications/STOP_SOUND', null, {
      root: true,
    }); // ringing
    localStorage.setItem('wtIsPlaying', 'true');
    context.commit('features/notifications/SET_CURRENTLY_PLAYING', true, {
      root: true,
    });
  },

  HANDLE_CALL_END: async (context, call) => {
    // @author @stanislav-kozak
    // We got setting from admin panel to check if we need to send push notification and sound notification
    const isCallEndPushNotification = context.rootGetters[
      'features/notifications/GET_NOTIFICATION_SETTING'
    ](EngineSystemSettingName.CallEndPushNotification);
    const isCallEndSoundNotification = context.rootGetters[
      'features/notifications/GET_NOTIFICATION_SETTING'
    ](EngineSystemSettingName.CallEndSoundNotification);

    const isCallEndSound = localStorage.getItem('settings/callEndSound');

    await context.dispatch('features/notifications/STOP_SOUND', null, {
      root: true,
    }); // ringing
    localStorage.removeItem('wtIsPlaying');
    context.commit('features/notifications/SET_CURRENTLY_PLAYING', null, {
      root: true,
    });

    const text = i18n.global.t('notification.callEnded', {
      name: call.displayName,
    });

    if (call.state === CallActions.Hangup) {
      // @author @stanislav-kozak
      // We check option by admin settings and after user setting for check if we need to send notification
      if (isCallEndPushNotification || isCallEndSound) {
        eventBus.$emit('notification', {
          type: 'error',
          text,
          timeout:
            context.rootGetters[
              'features/notification/PUSH_NOTIFICATION_TIMEOUT'
            ],
        });
      }

      // @author @stanislav-kozak
      // We check option by admin settings and after user setting for check if we need to play sound
      if (isCallEndSoundNotification || isCallEndSound) {
        context.commit('features/notifications/SET_HANGUP_SOUND_ALLOW', true, {
          root: true,
        });
        await context.dispatch(
          'features/notifications/PLAY_SOUND',
          { action: call.state },
          { root: true },
        );
      }
    }
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
      context.dispatch(
        'features/notifications/PLAY_SOUND',
        {
          action: CallActions.Ringing,
          sound: customRingtone,
          volume: ringtoneVolume,
        },
        { root: true },
      );

    // sometimes we need to wait when call end sound is finished before playing ringtone
    // https://webitel.atlassian.net/browse/WTEL-4918
    context.rootState['features/notifications/currentlyPlaying']
      ? setTimeout(playSound, 1000)
      : playSound();
  },
};

const callNotifications = createBaseStoreModule({
  actions,
});

export default callNotifications;
