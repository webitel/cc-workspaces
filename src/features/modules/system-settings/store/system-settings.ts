import { EngineSystemSettingName } from '@webitel/api-services/gen/models';
import { useSystemSettings } from '@webitel/ui-sdk/modules/SystemSettings';
import { defineStore } from 'pinia';

export const useSystemSettingsStore = defineStore(
	'features/system-settings',
	() => {
		// [Claude] notification settings are not here: they are owned by features/notifications store
		const { settings, initialize, reload, applyChange, subscribe } =
			useSystemSettings([
				EngineSystemSettingName.DefaultWorkspaceTab,
				EngineSystemSettingName.WbtHideContact,
				EngineSystemSettingName.ExpandContactTabs,
				EngineSystemSettingName.ShowFullContact,
			]);

		return {
			settings,

			initialize,
			reload,
			applyChange,
			subscribe,
		};
	},
);
