import { EngineSystemSettingName } from '@webitel/api-services/gen/models';
import { createSystemSettingsStore } from '@webitel/ui-sdk/modules/SystemSettings';

// [Claude] notification settings are not here: they are owned by features/notifications store
export const useSystemSettingsStore = createSystemSettingsStore({
	names: [
		EngineSystemSettingName.DefaultWorkspaceTab,
		EngineSystemSettingName.WbtHideContact,
		EngineSystemSettingName.ExpandContactTabs,
		EngineSystemSettingName.ShowFullContact,
	],
});
