import { EngineSystemSettingName } from '@webitel/api-services/gen/models';
import { snakeToCamel } from '@webitel/api-services/utils';
import { createBaseStoreModule } from '@webitel/ui-sdk/store/new/index.js';

import i18n from '../../../../../app/locale/i18n.js';

const actions = {
  HANDLE_JOB_END: async (context, job) => {
    const isJobEndPushNotification = context.rootGetters[
      'features/notifications/GET_NOTIFICATION_SETTING'
    ](EngineSystemSettingName.TaskEndPushNotification);
    const isJobEndSoundNotification = context.rootGetters[
      'features/notifications/GET_NOTIFICATION_SETTING'
    ](EngineSystemSettingName.TaskEndSoundNotification);

    context.commit('features/notifications/SET_CURRENTLY_PLAYING', null, {
      root: true,
    });

    const text = i18n.global.t('notification.jobEnded', {
      name: job.displayName,
      interval:
        context.rootGetters['features/notification/PUSH_NOTIFICATION_TIMEOUT'] *
        1000,
    });

    if (isJobEndPushNotification) {
      await context.dispatch(
        'features/notifications/SEND_NOTIFICATION',
        { text },
        { root: true },
      );
    }

    context.commit('features/notifications/SET_HANGUP_SOUND_ALLOW', true, {
      root: true,
    });

    if (isJobEndSoundNotification) {
      await context.dispatch(
        'features/notifications/PLAY_SOUND',
        { action: job.state },
        { root: true },
      );
    }
  },
  HANDLE_JOB_DISTRIBUTE: (context, { action, job }) => {
    context.dispatch('PLAY_SOUND', { action });
    if (
      !document.hasFocus() &&
      context.rootGetters['features/notifications/IS_MAIN_TAB']
    ) {
      const name = job.displayName;
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
};

const jobNotification = createBaseStoreModule({
  actions,
});

export default jobNotification;
