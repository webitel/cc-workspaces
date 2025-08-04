import { EngineSystemSettingName } from '@webitel/api-services/gen/models';
import { snakeToCamel } from '@webitel/api-services/utils';
import { createBaseStoreModule } from '@webitel/ui-sdk/store/new/index.js';
import { ChatActions } from 'webitel-sdk';

import i18n from '../../../../../app/locale/i18n.js';

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

    // @author @stanislav-kozak
    // When chat action is ChatActions.UserInvite do we need to play sound notification
    // also when chat action is ChatActions.Message do we need to play sound notification
    if (
      (isNewChatSoundNotification && action === ChatActions.UserInvite) ||
      (isNewMessageSoundNotification && action === ChatActions.Message)
    ) {
      context.dispatch(
        'features/notifications/PLAY_SOUND',
        { action },
        { root: true },
      );
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

    // @author @stanislav-kozak
    // Function for display chat name
    const displayChatName = () => {
      if (chat?.members?.length) {
        return chat?.members?.map((member) => member.name).join(', ');
      }

      if (chat?.title) {
        return chat.title;
      }

      return 'unknown';
    };

    context.commit('features/notifications/SET_CURRENTLY_PLAYING', null, {
      root: true,
    });

    const text = i18n.global.t('notification.chatEnded', {
      name: displayChatName(),
      interval:
        context.rootGetters['features/notification/PUSH_NOTIFICATION_TIMEOUT'] *
        1000,
    });

    // @author @stanislav-kozak
    // We check option by admin settings enable for send push notification
    if (isChatEndPushNotification) {
      await context.dispatch(
        'features/notifications/SEND_NOTIFICATION',
        { text },
        { root: true },
      );
    }

    // @author @stanislav-kozak
    // We check option by admin settings enable for play sound notification
    if (isChatEndSoundNotification) {
      context.commit('SET_HANGUP_SOUND_ALLOW', true);
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
