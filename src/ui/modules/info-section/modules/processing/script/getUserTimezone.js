import { TIMEZONE_STORAGE_KEY } from '@webitel/ui-sdk/src/modules/Userinfo/constants/UserSettingsConstants';

export function getUserTimezone() {
  const storedTimezone = localStorage.getItem(TIMEZONE_STORAGE_KEY);
  if (storedTimezone) return storedTimezone;

  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}
