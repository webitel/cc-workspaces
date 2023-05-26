import NotificationsStoreModule
  from '@webitel/ui-sdk/src/modules/Notifications/store/NotificationsStoreModule';
import { snakeToCamel } from '@webitel/ui-sdk/src/scripts/caseConverters';
import { CallActions } from 'webitel-sdk';
import i18n from '../../../../app/locale/i18n';

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

  HANDLE_CALL_START: async (context) => {
    await context.dispatch('STOP_SOUND'); // ringing
    localStorage.setItem('wtIsPlaying', 'true');
    context.commit('SET_CURRENTLY_PLAYING', true);
  },

  HANDLE_CALL_END: async (context) => {
    await context.dispatch('STOP_SOUND'); // ringing
    localStorage.removeItem('wtIsPlaying');
    context.commit('SET_CURRENTLY_PLAYING', null);
  },

  HANDLE_ANY_CALL_RINGING: (context) => {
    context.dispatch('PLAY_SOUND', { action: CallActions.Ringing });
  },
};

const notifications = new NotificationsStoreModule()
  .getModule({
               actions,
             });

export default notifications;
