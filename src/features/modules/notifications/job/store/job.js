import { EngineSystemSettingName } from '@webitel/api-services/gen/models';
import { snakeToCamel } from '@webitel/api-services/utils';
import eventBus from '@webitel/ui-sdk/scripts/eventBus.js';
import { createBaseStoreModule } from '@webitel/ui-sdk/store/new/index.js';
import { JobState } from 'webitel-sdk';

import i18n from '../../../../../app/locale/i18n.js';

const actions = {
  // @author @stanislav-kozak
  // Action what call when job is ended
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
    });

    if (isJobEndPushNotification) {
      eventBus.$emit('notification', {
        type: 'info',
        text,
        timeout:
          context.rootGetters[
            'features/notifications/PUSH_NOTIFICATION_TIMEOUT'
          ],
      });
    }

    context.commit('features/notifications/SET_HANGUP_SOUND_ALLOW', true, {
      root: true,
    });

    if (isJobEndSoundNotification) {
      await context.dispatch(
        'features/notifications/PLAY_SOUND',
        { action: JobState.Closed },
        { root: true },
      );
    }
  },
  HANDLE_JOB_DISTRIBUTE: (context, { action, job }) => {
    const isJobEndPushNotification = context.rootGetters[
      'features/notifications/GET_NOTIFICATION_SETTING'
    ](EngineSystemSettingName.TaskEndPushNotification);
    const isJobEndSoundNotification = context.rootGetters[
      'features/notifications/GET_NOTIFICATION_SETTING'
    ](EngineSystemSettingName.TaskEndSoundNotification);

    if (isJobEndSoundNotification) {
      context.dispatch(
        'features/notifications/PLAY_SOUND',
        { action },
        { root: true },
      );
    }

    if (
      !document.hasFocus() &&
      context.rootGetters['features/notifications/IS_MAIN_TAB']
    ) {
      const name = job.displayName;
      const text = i18n.global.t(`notifications.${snakeToCamel(action)}`, {
        name,
      });
      if (isJobEndPushNotification) {
        eventBus.$emit('notification', {
          type: 'info',
          text,
          timeout:
            context.rootGetters[
              'features/notifications/PUSH_NOTIFICATION_TIMEOUT'
            ],
        });
      }
    }
    context.dispatch('features/notifications/INCREMENT_UNREAD_COUNT', null, {
      root: true,
    });
  },
};

const jobNotifications = createBaseStoreModule({
  actions,
});

export default jobNotifications;
