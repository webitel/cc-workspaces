import NotificationsStoreModule
  from '@webitel/ui-sdk/src/modules/Notifications/store/NotificationsStoreModule';
import { snakeToCamel } from '@webitel/ui-sdk/src/scripts/caseConverters';
import { CallActions } from 'webitel-sdk';
import i18n from '../../../../app/locale/i18n';
import notificationIcon from '@webitel/ui-sdk/src/modules/Notifications/assets/img/notification-icon.png';

const getLastMessage = (chat) => chat.messages[chat.messages.length - 1];

const actions = {
  // utils
  HANDLE_CHAT_EVENT: (context, { action, chat }) => {
    context.dispatch('PLAY_SOUND', { action });
    if ((!document.hasFocus() ||
        context.rootGetters['workspace/TASK_ON_WORKSPACE'].channelId !==
        chat.channelId)
      && context.getters.IS_MAIN_TAB) {
      const name = getLastMessage(chat)?.member?.name ||
        chat.messages[0].member.name;
      const text = i18n.global.t(`notifications.${snakeToCamel(action)}`, { name });
      context.dispatch('SEND_NOTIFICATION', { text });
    }
    context.dispatch('INCREMENT_UNREAD_COUNT');
  },
  HANDLE_JOB_DISTRIBUTE: (context, { action, job }) => {
    context.dispatch('PLAY_SOUND', { action });
    if (!document.hasFocus() && context.getters.IS_MAIN_TAB) {
      const name = job.displayName;
      const text = i18n.global.t(`notifications.${snakeToCamel(action)}`, { name });
      context.dispatch('SEND_NOTIFICATION', { text });
    }
    context.dispatch('INCREMENT_UNREAD_COUNT');
  },

  HANDLE_CALL_START: async (context, { action, call }) => {
    await context.dispatch('STOP_SOUND'); // ringing
    localStorage.setItem('wtIsPlaying', 'true');
    context.commit('SET_CURRENTLY_PLAYING', true);
  },

  HANDLE_CALL_END: async (context) => {
    await context.dispatch('STOP_SOUND'); // ringing
    localStorage.removeItem('wtIsPlaying');
    context.commit('SET_CURRENTLY_PLAYING', null);
  },

  // is called on ringing event on call store to send notification
  HANDLE_INBOUND_CALL_RINGING: async (
    context,
    {
      displayName,
      displayNumber,
      answer,
      hangup,
    },
  ) => {

    await context.dispatch('features/swController/SUBSCRIBE_TO_MESSAGE', {
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
    }, { root: true });

    // https://webitel.atlassian.net/browse/WTEL-4240
    return context.dispatch('features/swController/SEND_NOTIFICATION', {
      title: i18n.global.t('notifications.newCall'),
      text: `!!!!!!!${displayName}: ${displayNumber}`,
      icon: notificationIcon,
      actions: [
        { action: 'accept', title: 'Accept' },
        { action: 'decline', title: 'Decline' },
      ],
    }, { root: true });
  },

  // is called from mixin watcher on any ringing to play sound
  HANDLE_ANY_CALL_RINGING: async (context) => {
    await context.dispatch('PLAY_SOUND', { action: CallActions.Ringing });
  },
};

const notifications = new NotificationsStoreModule()
.getModule({
  actions,
});

export default notifications;
