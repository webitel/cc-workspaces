import { EngineSystemSettingName } from '@webitel/api-services/gen/models';
import { snakeToCamel } from '@webitel/api-services/utils';
import eventBus from '@webitel/ui-sdk/scripts/eventBus.js';
import { createBaseStoreModule } from '@webitel/ui-sdk/store/new/index.js';
import { ChatActions } from 'webitel-sdk';

import i18n from '../../../../../app/locale/i18n.js';

// @author @stanislav-kozak
// Function for display chat name
const displayChatName = (chat) => {
  if (chat?.members?.length) {
    return chat?.members?.map((member) => member.name).join(', ');
  }

  if (chat?.title) {
    return chat.title;
  }

  return 'unknown';
};

const getLastMessage = (chat) => chat.messages[chat.messages.length - 1];

const actions = {
  HANDLE_CHAT_EVENT: (context, { action, chat }) => {
    // @author @stanislav-kozak
    // We got setting from admin panel to check if we need to send push notification and sound notification
    const isNewMessageSoundNotification = context.rootGetters[
      'features/notifications/GET_NOTIFICATION_SETTING'
    ](EngineSystemSettingName.NewMessageSoundNotification);
    const isNewChatSoundNotification = context.rootGetters[
      'features/notifications/GET_NOTIFICATION_SETTING'
    ](EngineSystemSettingName.NewChatSoundNotification);
    const isChatEndPushNotification = context.rootGetters[
      'features/notifications/GET_NOTIFICATION_SETTING'
    ](EngineSystemSettingName.ChatEndPushNotification);
    const isChatEndSoundNotification = context.rootGetters[
      'features/notifications/GET_NOTIFICATION_SETTING'
    ](EngineSystemSettingName.ChatEndSoundNotification);

    // @author @stanislav-kozak
    // When chat action is ChatActions.UserInvite do we need to play sound notification
    // also when chat action is ChatActions.Message do we need to play sound notification
    if (
      (isNewChatSoundNotification && action === ChatActions.UserInvite) ||
      (isNewMessageSoundNotification && action === ChatActions.Message) ||
      (isChatEndSoundNotification && action === ChatActions.Close)
    ) {
      // @author @stanislav-kozak
      // We need stop sound for prevent play sound notification, and play sound for each new message action
      context.dispatch('features/notifications/STOP_SOUND', null, {
        root: true,
      });
      context.dispatch(
        'features/notifications/PLAY_SOUND',
        { action },
        { root: true },
      );
    }

    if (isChatEndPushNotification && action === ChatActions.Close) {
      const text = i18n.global.t('notification.chatEnded', {
        name: displayChatName(chat),
      });

      eventBus.$emit('notification', {
        type: 'info',
        text,
        timeout:
          context.rootGetters[
            'features/notifications/PUSH_NOTIFICATION_TIMEOUT'
          ],
      });
    }

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
      context.dispatch(
        'features/notifications/SEND_NOTIFICATION',
        { text },
        { root: true },
      );
    }
    context.dispatch('features/notifications/INCREMENT_UNREAD_COUNT', null, {
      root: true,
    });
  },

  // @author @stanislav-kozak
  // Action what call when chat is ended
  HANDLE_CHAT_END: async (context, chat) => {
    const isChatEndPushNotification = context.rootGetters[
      'features/notifications/GET_NOTIFICATION_SETTING'
    ](EngineSystemSettingName.ChatEndPushNotification);
    const isChatEndSoundNotification = context.rootGetters[
      'features/notifications/GET_NOTIFICATION_SETTING'
    ](EngineSystemSettingName.ChatEndSoundNotification);

    context.commit('features/notifications/SET_CURRENTLY_PLAYING', null, {
      root: true,
    });

    const text = i18n.global.t('notification.chatEnded', {
      name: displayChatName(chat),
    });

    // @author @stanislav-kozak
    // We check option by admin settings enable for send push notification
    if (isChatEndPushNotification) {
      eventBus.$emit('notification', {
        type: 'info',
        text,
        timeout:
          context.rootGetters[
            'features/notifications/PUSH_NOTIFICATION_TIMEOUT'
          ],
      });
    }

    // @author @stanislav-kozak
    // We check option by admin settings enable for play sound notification
    if (isChatEndSoundNotification) {
      context.commit('features/notifications/SET_HANGUP_SOUND_ALLOW', true, {
        root: true,
      });
      await context.dispatch(
        'features/notifications/PLAY_SOUND',
        { action: chat.state },
        { root: true },
      );
    }
  },
};

const chatNotifications = createBaseStoreModule({
  actions,
});

export default chatNotifications;
