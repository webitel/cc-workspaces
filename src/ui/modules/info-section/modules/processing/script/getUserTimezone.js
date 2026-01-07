import { TIMEZONE_STORAGE_KEY } from '@webitel/ui-sdk/src/modules/Userinfo/v2/constants/UserSettingsConstants';

export function getUserTimezone() {
  try {
    const storedTimezone = localStorage.getItem(TIMEZONE_STORAGE_KEY);
    if (storedTimezone) return storedTimezone;
  } catch {
    // Ignore storage access errors and fall back to browser timezone.
  }

  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}
