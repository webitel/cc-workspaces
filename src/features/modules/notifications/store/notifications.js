import { UserSettingsAPI } from '@webitel/api-services/api';
import { EngineSystemSettingName } from '@webitel/api-services/gen/models';
import NotificationsStoreModule from '@webitel/ui-sdk/src/modules/Notifications/store/NotificationsStoreModule';

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
		const settings = await UserSettingsAPI.get({
			key: 'notification',
		});

		context.commit('SET', {
			path: 'settings',
			value: settings,
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
